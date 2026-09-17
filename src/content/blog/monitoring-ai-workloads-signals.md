---
title: "Monitoring AI Workloads: The Signals We Already Know, and the Ones We're Still Figuring Out"
description: "LLMs, agents, and inference services are production workloads now, which means someone owns their reliability. The old signals still matter — they're just not enough on their own, and the new ones don't have settled answers yet."
pubDate: 2026-09-17
tags: ["observability", "sre"]
draft: true
---

At some point in the last couple of years, LLM-backed features and inference services quietly stopped being experiments and started being things with on-call rotations. That shift happened faster than the tooling caught up to it, and I don't think that gap has closed yet — which is worth saying plainly before anything else here.

## The signals that don't go away

CPU, memory, latency, error rate, availability — none of that stops mattering because the workload behind it is a model instead of a REST API. If anything, it matters slightly more, because inference tends to be less forgiving of resource pressure than a typical CRUD service, and a saturated GPU degrades in ways that don't always show up as a clean error first.

So the baseline is still the baseline. The four golden signals didn't get replaced. They got joined by a second set that's genuinely harder.

## The part that's still fuzzy, and I think it's fair to say so

Model accuracy drifting, hallucination rate, output consistency — these show up on every "future of SRE" list right now, mine included, and I want to be honest that most organizations, ourselves included in the industry generally, don't have a clean, agreed-upon way to measure several of them yet. "Hallucination rate" sounds like a metric. In practice it usually means running an LLM-as-judge over a sample of outputs, or spot-checking against a golden dataset, and neither approach is as rigorous as an error-rate counter on an HTTP endpoint. That's not a reason to skip it — it's a reason to treat the resulting number with the humility it deserves rather than putting it on a dashboard next to p99 latency as if the two carry the same certainty.

Token usage and cost per request, and inference latency specifically, are in better shape — those are close enough to traditional metrics that instrumenting them isn't conceptually new, just additional. Time-to-first-token and total generation time are worth separating, since they tell you different things about the user experience and about where in the stack a slowdown is happening.

## Why correlation gets harder, not easier

The traditional observability pitch — logs, metrics, and traces stitched together so "CPU is at 90%" becomes "here's what changed and why" — still holds, and arguably matters more here, not less. The complication is that AI systems break an assumption most observability tooling quietly relies on: that the same input produces the same output. A non-deterministic system can look completely healthy on every infrastructure metric while producing a degraded, wrong, or subtly different answer than it did yesterday — and infrastructure telemetry alone won't show you that. You need the AI-specific signals feeding into the same picture, not sitting in a separate dashboard nobody correlates against the infra one during an incident.

## SLOs that now have to include things that are hard to define

A 99.95% availability target is still meaningful, but it stops being sufficient on its own once accuracy, output quality, and cost per interaction are part of what "reliable" means to the people using the service. I don't think anyone has fully solved what a good SLO looks like for "output quality" yet — and I'd be skeptical of anyone who claims they have. What does seem clear is that testing a model once before deployment and treating it as settled doesn't work anymore, especially if you're calling a hosted model that can change behavior on the provider's schedule, not yours. Continuous evaluation in production — even something as simple as a scheduled eval run against a fixed test set, alerting on regression — beats a one-time pre-deployment check that quietly goes stale.

## What I'd actually start with

If I were setting this up from nothing, I'd get cost and latency instrumented first, because they're unambiguous and the tooling for them is mature. I'd add a basic, imperfect accuracy or quality check next — even a rough one — specifically because a rough signal that exists beats a perfect one that's still being designed. And I'd resist the urge to chase every item on this list at once; a handful of well-understood metrics, checked often, has served me better over the years than a large dashboard with metrics nobody quite trusts.

I don't think this is a solved area of the field yet. Worth building for what's known now, and staying honest about what still isn't.
