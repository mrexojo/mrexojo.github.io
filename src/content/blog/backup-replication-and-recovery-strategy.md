---
title: "Backups, Replication, and Recovery: Three Budgets, Not One"
publishDate: 2026-07-06
tags:
  - disaster-recovery
  - continuity
  - cloud
description: "Why 'we have backups' is not an answer to a continuity question, and how engineering leaders should structure — and test — recovery before an incident or an audit forces the issue."
draft: false
---

At some point a board member, a large customer, or an auditor will ask your organization a simple question: "If your primary systems were lost today, how long until you are operating again?" The answer "we have backups" does not answer it. Backups, replication, and validated recovery are three different capabilities with three different costs, and conflating them is how companies discover — mid-incident — that they bought the wrong one.

I have designed and operated continuity setups since the tape-and-Bacula era through to modern cloud architectures with cross-region replication. The technology changed completely; the failure pattern did not. Organizations consistently over-invest in copying data and under-invest in proving they can restore it.

## Three capabilities, three questions

Each capability answers a different question, and your requirements — not vendor defaults — should decide how much of each you buy.

**Backups answer: "Can we go back in time?"** They protect against deletion, corruption, ransomware, and bad deployments. Their value is determined by retention policy (how far back), granularity (to which point), and restore mechanics (how, by whom, how fast). A backup you cannot restore within your tolerance window is a compliance artifact, not a capability.

**Replication answers: "Can we keep running if this component dies?"** A standby database or a second region reduces downtime from hours to minutes. But replication is not a backup, and treating it as one is a classic and costly error: replication faithfully copies your mistakes. Delete a table, and the deletion arrives at the replica milliseconds later. Ransomware encrypts your data, and the replica encrypts in sync. Replication buys availability, never history.

**Validated recovery answers: "Does any of this actually work?"** This is the capability almost everyone skips, because it has no purchase order — it is an exercise, not a product. An untested recovery plan is a hypothesis. In my experience, the first real recovery test always fails somewhere unexpected: an IAM role nobody documented, a DNS TTL nobody lowered, a database user that exists only in the primary, a runbook step referencing a dashboard that was decommissioned.

## Set targets before buying anything

Two numbers turn this from an infrastructure debate into a business decision:

- **RTO (Recovery Time Objective):** how long the business tolerates the service being down.
- **RPO (Recovery Point Objective):** how much recent data the business tolerates losing.

These are business decisions with engineering consequences. An RPO of 24 hours is a nightly backup job. An RPO of five minutes is continuous replication plus point-in-time recovery — an order of magnitude more cost and complexity. When leadership says "we cannot lose anything and cannot be down," the correct response is to show the price of RPO≈0/RTO≈0 and let the budget negotiate the requirement. It always does. Most organizations end with tiered targets: strict for the transactional core, relaxed for analytics and internal tools — which is rational, and much cheaper than uniform paranoia.

## The parts of recovery that are not data

Recovery plans obsess over data and forget everything the data needs in order to be useful. A restore test I ran for a client came back green for every byte of the database — and the application still could not start, because the secrets store, the network routes, and a third-party API allowlist all assumed the original environment.

A recovery exercise has to cover:

- **Identity and access:** Can the people executing recovery authenticate if the primary identity provider is part of the outage? Break-glass credentials, stored where the outage cannot reach them.
- **Infrastructure definition:** Can you rebuild the environment, not just refill it? This is where Infrastructure as Code quietly becomes a continuity tool — a platform defined in Terraform can be re-created in a new account or region in hours. One defined by years of console changes cannot be re-created at all.
- **Dependencies:** DNS, certificates, third-party integrations, IP allowlists held by partners. Each one is a step in the runbook or a surprise during the incident.
- **People:** Who executes, in what order, with what authority to make destructive decisions at 3 a.m.? A plan that lives in one engineer's head has an RTO equal to that engineer's availability.

## Make testing routine, not heroic

Annual full-scale DR exercises are valuable but heavy, so they get postponed. What works in practice is a gradient: automated restore verification continuously (restore a backup to an isolated environment and run checks against it — fully automatable), a tabletop walkthrough of the runbook quarterly, and a real component-level recovery once or twice a year, rotating which component. For organizations under DORA, NIS2, ISO 27001, or SOC 2 obligations, this cadence also happens to produce exactly the evidence auditors ask for — test dates, results, and remediations — as a byproduct instead of a fire drill before the audit.

## When this applies, and when it does not

This framing fits any organization where a day of downtime or data loss has material cost — which includes far smaller companies than usually admit it.

It is oversized for genuinely stateless or reconstructible workloads: if a service can be rebuilt from a git repository and a pipeline in an hour, that pipeline *is* the recovery plan, and adding backup infrastructure to it is waste. It is undersized for organizations with hard regulatory RTOs (payments, health, critical infrastructure), where this article's pragmatic gradient must give way to formally documented, independently audited exercises.

## If you are considering this

A useful first engagement is small: one week to establish actual RTO/RPO per critical service, compare against what the current setup can deliver, and run one restore test that has never been run before. The gap between assumed and demonstrated recovery is usually the most persuasive document leadership sees that quarter. Details on the [Cloud Architecture and Migration](/works/cloud-architecture-and-migration/) page.
