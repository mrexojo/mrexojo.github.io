---
title: "What a One-Week Cloud Cost Review Actually Finds"
publishDate: 2026-06-22
tags:
  - finops
  - cost-optimization
  - cloud
description: "The typical findings of a short, structured cloud cost review — idle spend, mis-sized capacity, wrong service tiers — what each is worth, and why the durable savings come from process, not deletion."
draft: false
---

Cloud cost reviews have a credibility problem, and it is earned. The market is full of dashboards that restate your bill in prettier colors, and consultants whose recommendation is a subscription to more consulting. So let me be concrete about what a short, structured review — one to two weeks, one engineer, read access — actually finds in practice, what each finding is typically worth, and where the limits are.

The numbers below come from FinOps engagements on AWS and Azure environments between roughly €10k and €200k of monthly spend. In one representative engagement, the combination of these findings reduced monthly cloud spend by 25%. That figure is not a promise — environments differ — but the *categories* of waste are remarkably consistent, because they all grow from the same root: cloud spend accumulates decisions, and nobody is paid to revisit them.

## Finding 1: Spend that serves nothing (typically 5–15%)

Every environment past its third year contains resources with no consumer: the staging environment for a cancelled project, unattached storage volumes, snapshots accumulating since 2023, load balancers routing to nothing, elastic IPs reserved and forgotten. Individually trivial, collectively substantial — and completely safe to remove once traced.

The tracing is the actual work. "Is anything using this?" is answerable from access logs, network flow data, and IAM history, but somebody has to look, resource by resource. Internal teams rarely do, not from laziness but because deletion has asymmetric risk for an employee: nobody gets promoted for removing a volume, and everybody remembers who deleted the thing that turned out to matter. An external reviewer with a verification method carries that risk professionally.

## Finding 2: Capacity sized by anxiety (typically 10–20%)

Instances sized for a launch-day peak that never returned. Databases provisioned at the next tier up "to be safe." Autoscaling groups whose minimum was set during an incident and never lowered. Development environments running 168 hours a week for a team that works 50.

Right-sizing is straightforward analytically — utilization data over a representative period, compared against provisioned capacity — but it requires judgment about *which* peaks matter. The month-end batch job that pins the CPU for six hours is a real requirement; sizing for it year-round is not, and moving it to scheduled capacity usually costs one afternoon. Scheduling non-production environments to office hours alone routinely returns 60–70% of their cost, with zero performance risk to production.

## Finding 3: The right workload on the wrong service (typically 10–25%, more effort)

The deepest savings are usually architectural: workloads running on services that made sense at a different scale or a different era of the platform. The static content served from oversized VMs instead of S3 and CloudFront. The cron job running on a permanent instance instead of Lambda. The self-managed database consuming an engineer-day a week next to a cheaper managed equivalent. The container fleet on raw EC2 that ECS or spot capacity would run at a fraction of the cost.

These findings are worth the most and cost the most: each is a small migration with testing and rollback, not a console change. A good review prices that effort honestly per item, so you can sequence by return — in my engagements, moving eligible workloads to ECS, Lambda, CloudFront, and S3 has been the single largest contributor to the savings figure, and also the line items that took actual engineering weeks.

## Finding 4: Commitment money left on the table (typically 5–15%)

Steady-state workloads paying on-demand prices, three years running. Savings Plans and reserved capacity ask for a commitment in exchange for 30–60% discounts; the analysis of what is safe to commit takes a day with a year of usage data. This is the least glamorous finding and frequently the fastest to realize — it requires a signature, not a migration. The discipline is committing only to demonstrated baseline, never to hoped-for growth.

## What separates lasting savings from a one-time haircut

Everything above, executed once, produces a satisfying dip in next month's bill — and eighteen months later the bill is back, because the *mechanisms* that grew it remain. The findings that matter most in the report are therefore not resources but absences:

- **No attribution.** Without consistent tagging or account boundaries, spend cannot be assigned to teams or products, which means no one owns any number, which means every number grows.
- **No visibility at decision time.** Engineers choose instance types with no price in sight. Surfacing cost at the pull-request and design-review stage changes behavior more than any quarterly report.
- **No budget alarms.** The €30k mistake that runs for three weeks is a monitoring failure, not an engineering one. Budget alerts per environment cost an hour to set up.

A review worth paying for encodes its findings in code — Terraform for the changed resources, tagging policy enforced in the pipeline, alerts as configuration — so the environment resists regrowing its waste. This is also, frankly, the test of whether you hired an engineer or a slide deck.

## When this applies, and when it does not

A short review pays for itself reliably above roughly €10k of monthly spend that has grown organically for two or more years without dedicated FinOps attention. The 25% figure from my engagements sits within the range such environments typically yield (15–30%).

It is the wrong purchase if your spend is already under active FinOps management with attribution and commitment coverage — the remaining gains there are architectural and incremental — or if your bill is dominated by one irreducible workload (a GPU training fleet, a data platform) where the conversation is engineering optimization, not waste removal. And if spend is below a few thousand euros monthly, read your bill yourself for an afternoon; you do not need me.

## If you are considering this

The engagement shape: one to two weeks, read access, a findings report with each item priced by savings and implementation effort, and — if you want the second phase — the implementation itself, delivered as code. FinOps Certified Practitioner; certifications and approach on the [Cloud Cost Optimization and FinOps](/works/cloud-cost-optimization-finops/) page.
