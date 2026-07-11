---
title: "When to Move to Managed Cloud Services — and When to Wait"
publishDate: 2026-07-05
tags:
  - cloud
  - engineering-management
  - cost-optimization
description: "Decision criteria for CTOs weighing managed databases, Kubernetes, and serverless against self-operated infrastructure: the real cost comparison, the migration signals, and the lock-in question answered honestly."
draft: false
---

"Should we run it ourselves or pay for the managed service?" is one of the few infrastructure questions that reaches CTO level in almost every company — because it is not really a technology question. It is a question about where your engineers' time goes, what your tolerance for operational risk is, and what a 3 a.m. incident actually costs you.

Having operated both sides — self-managed OpenStack and bare-metal provisioning at Nokia, self-hosted everything in the years before cloud, and managed services (RDS, GKE, ECS, Cloud SQL) across freelance and employed engagements since — I can say the honest answer is unfashionable: managed services win far more often than engineering pride admits, but the exceptions are real and expensive to get wrong in either direction.

## The cost comparison everyone gets wrong

The standard mistake is comparing the managed service's price against the instance cost of running it yourself. A managed PostgreSQL at, say, 2–3× the raw compute price looks expensive — until you price what the raw compute number omits:

- **Failover engineering.** A production database needs replication, automated failover, and connection handling that survives it. Building and testing this well is weeks of senior work; the managed service includes it.
- **Backup and point-in-time recovery**, tested, with retention. (See how rarely self-managed setups actually test restores.)
- **Patching under pressure.** When the next critical CVE lands, the managed provider patches the fleet; your team patches nights and weekends. Having handled log4j response at Copado across a distributed platform, I can attest this cost is real and arrives without an appointment.
- **The on-call tax.** Every self-operated stateful system adds pages to someone's rotation. Pages have a direct cost in engineer attention and an indirect one in retention.

Priced honestly, the managed premium is usually cheaper than half an engineer — and half an engineer is roughly what a properly operated production database consumes. The calculation only flips at real scale (where the premium multiplies across a large fleet) or with unusual requirements the managed service cannot express.

## Signals that it is time

In consulting engagements, the same signals precede every justified migration:

- **Your engineers operate infrastructure instead of shipping.** If product engineers spend meaningful time nursing Jenkins, ElasticSearch, or a hand-rolled Kubernetes cluster, you are paying product-development salaries for operations work a provider does cheaper.
- **Key-person risk on the platform.** One person understands the database cluster. That person's resignation letter is an availability incident.
- **Compliance pressure.** Encryption at rest, audit logging, patch cadence — managed services turn each into a checkbox and a document; self-managed turns each into an engineering project.
- **Unexplained cost accumulation.** Fleets of self-managed VMs accrete: oversized instances "to be safe," environments nobody decommissions. Migrating to managed and serverless services forces the inventory conversation. In one freelance engagement, that combination — right-sizing plus moving workloads to ECS, Lambda, CloudFront, and S3 — cut monthly cloud spend by 25%.

## When self-operating is right

The honest exceptions:

- **Genuine scale economics.** Above a certain size, the managed premium on a large database or Kafka fleet funds a dedicated team that can do better. Very few companies below several hundred engineers are actually there.
- **Hard requirements the service cannot meet.** Specific extensions, kernel tuning, exotic topologies, data-residency terms the provider will not sign. Verify these are real requirements rather than preferences — this list shrinks every year.
- **Core competence.** If operating infrastructure *is* your product, buy less and build more. This describes infrastructure vendors, not most product companies.
- **Deep-freeze workloads.** A stable internal system running quietly on a VM with good backups may not repay migration effort. Not every workload needs to move; the discipline is choosing, not defaulting.

## The lock-in question, answered honestly

Lock-in is the most common objection and deserves a straight answer: it is real, and it is usually worth it. But the risk is not uniform — it depends on the *interface*. Managed open-source (RDS PostgreSQL, GKE, managed Kafka) keeps a portable interface: I have moved workloads from AWS EKS to GCP GKE (Decathlon Spain) and databases from Heroku to Cloud SQL (Copado); real work, but bounded and plannable. Proprietary serverless (Lambda, DynamoDB, EventBridge) is a deeper commitment — the exit is a rewrite, so demand a proportionally deeper operational payoff, which Lambda-class services often deliver.

Two cheap mitigations regardless: define everything in Terraform, so your architecture is documented, portable in structure, and re-creatable; and keep data exportable with a tested export path. Beyond that, treating lock-in avoidance as an architectural goal usually costs more than the lock-in.

## How to sequence a migration once the decision is made

Once you decide a workload should move, the order of operations determines whether the migration is a quiet success or a visible incident. Three rules from doing this repeatedly:

**Migrate the boring workload first.** Every team wants to prove the model on something important; the correct move is the opposite. Pick the lowest-stakes service that still exercises the real pattern — same database engine, same network topology — and run the whole migration process against it: provisioning, data movement, cutover, rollback. The mistakes surface there, cheaply, instead of on the workload that pages someone at 2 a.m.

**Cut over data before you cut over traffic.** Replicate into the managed target and let it run in parallel, verified against the source, before a single production request touches it. For databases this usually means logical replication or a change-data-capture pipeline running for days, not minutes — long enough to catch the edge case that only shows up during a weekly batch job or a month-end close. The temptation to shortcut this step under deadline pressure is exactly when it matters most.

**Keep the rollback path alive longer than feels necessary.** The instinct after a successful cutover is to decommission the old environment quickly — it is costing money, and it is untidy. Resist for at least one full business cycle. I have seen a "successful" migration unravel three weeks later when a downstream job that only runs at quarter-end hit the new environment and failed on a permission nobody had provisioned. The cost of keeping the old system idle for a month is trivial next to the cost of not having it when that happens.

None of this needs elaborate tooling. It needs a written runbook, a named owner for the cutover window, and the discipline to move one boring workload before the important one.

## When this applies, and when it does not

This framework fits product companies between roughly ten and a few hundred engineers on AWS, GCP, or Azure — the range where engineer-time is the scarcest resource and platform teams are thin.

It fits poorly at the extremes: pre-product startups should simply default to managed everything and skip the analysis, and organizations with sovereign or air-gapped requirements are having a different conversation entirely, where self-operation is the requirement rather than a choice.

## If you are considering this

The migrations that go badly are the ones scoped by enthusiasm — everything at once — rather than by dependency order and rollback points. I scope and deliver these as fixed engagements: assessment first, then migration in stages the internal team can absorb, defined in Terraform they keep. Details on the [Cloud Architecture and Migration](/works/cloud-architecture-and-migration/) page.
