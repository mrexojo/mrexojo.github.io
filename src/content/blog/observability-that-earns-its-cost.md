---
title: "Observability That Earns Its Cost"
publishDate: 2026-05-25
tags:
  - observability
  - sre
  - engineering-management
description: "Observability bills are rising faster than the reliability they buy. How engineering leaders should decide what to instrument, what to alert on, and when the monitoring stack itself needs an audit."
draft: false
---

Observability has quietly become a top-five line item in many cloud budgets — datapoint pricing, log ingestion, per-host agents, and seat licenses compound until the monitoring bill rivals the compute it monitors. Meanwhile, the operational question that justifies all of it — *do we find out about problems before our customers do, and can we diagnose them quickly?* — often has an embarrassing answer. Paying more and knowing less is the observability failure mode of this decade, and it is fixable with decisions rather than tools.

I spent years on the operating side of this: at Copado I built the observability stack (Sumo Logic, Fluentd, Prometheus) across Heroku, AWS, and GCP for a distributed platform, engineered the alerting that sustained 98% uptime, and lived through incidents — including the log4j response — where observability quality directly determined resolution speed. Earlier, at Nokia, I built the Grafana/InfluxDB performance stacks for telecom streaming infrastructure. The lessons below are operational, not vendor talking points.

## Start from questions, not from data

The root error in most observability estates is directional: teams instrument everything collectable, then hope insight emerges. Cost scales with data volume; insight scales with *intent*. The fix is to work backwards from the questions that matter:

- Is the service meeting its commitment to users right now? (A handful of symptom metrics: availability, latency, error rate — per user-facing service.)
- When it is not, where is the fault? (Traces or structured logs along the critical paths — not everywhere.)
- What happened around the time things changed? (Deploy markers, config changes, dependency status.)

Everything you collect should serve one of those questions or a specific compliance retention requirement. In observability audits I run, typically **half of ingested log volume serves neither** — debug logging left on after the incident that prompted it, verbose framework noise nobody parses, metrics at cardinality nobody queries. Deleting it is pure savings with zero reliability cost, and finding it takes days, not months: every major platform (CloudWatch, Datadog, Sumo Logic, Grafana stack) will report ingestion by source; sort descending and interrogate the top ten.

## Alert on symptoms; investigate causes

Alerting philosophy determines whether your on-call rotation is sustainable, and there is a principle that survives every environment I have applied it in: **page on user-visible symptoms; record everything else.** A page means "a human must act now." High CPU is not that; error rate above threshold is. Disk at 80% is not that; disk trending to full within hours is.

The practical test for every alert in your system: *when this fired last, did anyone do anything?* If the honest answer across the last five firings is no, the alert is noise — delete it or demote it to a dashboard. Alert fatigue is not a personnel weakness; it is a system defect with a known consequence: the night the real page arrives, it gets the same weary glance as the hundred false ones before it. When I rebuilt alerting at Copado, the count of paging alerts went *down* while detection of real incidents improved — those two outcomes usually travel together, and if a vendor or an internal proposal promises more alerts as a benefit, treat it as the warning sign it is.

Two structural upgrades pay for themselves quickly once symptom-based paging is in place: **SLOs with error budgets**, which convert "how reliable should this be" from a feelings-based argument into a number both engineering and product can negotiate; and **deploy markers in every dashboard**, because "what changed?" is the first incident question and the majority of incidents follow a change.

## The stack: boring choices, honestly priced

The tooling market is loud, so let me compress years of operating experience into a paragraph. The open standard for instrumentation is **OpenTelemetry** — instrument once, choose backends freely, preserve exit options; this is the one place where avoiding lock-in is cheap and worth it. The managed platforms (Datadog, Sumo Logic, Grafana Cloud, cloud-native offerings) differ less in capability than in pricing model, so model *your* data shape against their pricing before committing — per-host pricing punishes many small nodes, ingestion pricing punishes verbose logs, cardinality pricing punishes label-happy metrics. Self-hosting the Prometheus/Grafana/Loki stack is genuinely viable and I have run it in production — but price the engineer-time honestly (storage scaling, upgrades, retention management); below a certain scale, the managed bill is cheaper than the distraction.

The cost lever nobody uses enough: **retention tiers.** You need days of hot, searchable data for incidents; weeks of warm data for pattern analysis; and cheap cold storage (S3-class) for the compliance tail. Paying hot-tier prices for month-old logs is the single most common line-item waste I find.

## When this applies, and when it does not

This applies to any organization running production services with an on-call rotation and a monitoring bill someone has started to question — the natural audit trigger is either a five-figure monthly observability spend or an incident where the answer was "we were blind."

It applies differently at the edges. Pre-product-market-fit startups need uptime checks, error tracking, and structured logs — a day of setup — and should defer the SLO apparatus until there are users to make commitments to. And organizations with regulatory telemetry retention (finance, health) have a floor on data volume this article's deletion advice cannot cut below — though tiering still applies to *where* that data sits.

## If you are considering this

The engagement here is an observability audit: two weeks, ending with an ingestion-by-value map (what you pay for versus what answers questions), an alert review against the "did anyone act" test, and a remediation plan — typically cutting 30–50% of spend while improving detection. Implementation, if wanted, delivered in code alongside your team. This work usually pairs with the reliability side of [DevSecOps and Delivery Pipelines](/works/devsecops-and-delivery-pipelines/) engagements.
