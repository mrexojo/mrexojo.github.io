---
title: "AI Can Suggest the Rollback. Deciding Still Belongs to Someone."
description: "AI is genuinely useful at correlating signals during an incident. What it recommends and what actually gets executed without a human in the loop are two different questions — and cost has quietly become part of the reliability conversation too."
pubDate: 2026-10-01
tags: ["sre", "finops", "cost-optimization"]
draft: true
---

Picture a fairly ordinary incident: latency climbs, errors follow, database connections spike shortly after, and there's a deployment that went out twenty minutes earlier. Any experienced on-call engineer would look at that sequence and reach for the same suspect. The genuinely new part isn't the reasoning — it's that a system can now do a first pass of that correlation automatically and hand you the same conclusion, sometimes before a human has finished reading the alert.

I think that's real progress. I also think it's worth being precise about what it is and isn't.

## What this is actually good at right now

Pattern-matching across telemetry that a tired human might miss at 3 a.m. is a legitimately strong use of AI in an incident. Given enough historical incident data, correlating "this shape of symptoms, in this order, has usually meant this cause" is exactly the kind of task that benefits from not getting fatigued or distracted. Where I'd be more careful is treating a confident-sounding recommendation as equivalent to a verified one. A model that says "rollback the latest deployment" with total fluency and one that says it after genuinely ruling out three other explanations can sound identical from the outside, and only one of them should get acted on without a second look.

Correlation isn't causation, and that didn't stop being true because the thing doing the correlating got more articulate about it.

## Matching automation to what's actually at stake

The useful distinction, in my experience, isn't "should AI be involved in incident response" — it clearly can be — but which actions are safe to let it take on its own. Read-only, diagnostic work (querying logs, correlating metrics, surfacing a likely cause) is low-risk regardless of whether the conclusion is right, because nothing changes in production just from asking the question. Reversible, well-understood actions — restarting a pod, scaling out a deployment — are reasonable candidates for automation with a lightweight approval step. Anything with real blast radius — a rollback that touches a database migration, a failover between regions, deleting anything — probably deserves an actual human looking at it every time, no matter how good the tooling gets, if only because the cost of being wrong is so asymmetric with the cost of a short delay.

That's the shape of what people mean by risk-based automation, stripped of the framing: match the system's autonomy to the size of the mistake it could make, not to how confident it sounds.

## Cost quietly became part of the reliability conversation

The other shift I'd flag is less about intelligence and more about the balance sheet. GPU capacity, LLM token spend, and inference costs sit next to compute and storage now, and they don't behave like traditional cloud costs — token pricing scales with usage in a way that's much less forgiving of an inefficient prompt or an unnecessarily large model than an oversized EC2 instance ever was of idle capacity. A model call that's twice as expensive as it needs to be doesn't show up as a line item worth investigating the way an idle VM does; it just quietly doubles a bill that keeps scaling with traffic.

Reliability engineering absorbing cost as one of its concerns isn't new in principle — this is the same argument FinOps has been making about cloud spend for years, just applied to a category of resource that's newer and less well understood. Model selection (does this task actually need the largest available model, or would a smaller one do), caching repeated or similar queries, and batching where latency requirements allow it are the first places I'd look before assuming the spend is just the cost of doing business.

## Where I'd actually start

If a team is early on this: instrument the AI-assisted correlation as a suggestion engine first, not an actuator, and let it earn trust over a few real incidents before anything it recommends executes on its own. And treat the first FinOps review of AI infrastructure the way any cost review should start — find out what's actually being spent and on what, before deciding what's worth optimizing.

None of this replaces the on-call engineer. It changes what the first ten minutes of their shift look like, which is a smaller claim than the framing around it usually suggests — and, I think, a more honest one.
