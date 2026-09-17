---
title: "The Paved Road Now Has to Include Security (And Someone Still Has to Own It)"
description: "Internal developer platforms promise a golden path from idea to production API. Increasingly, security and compliance are expected to ride along by default — which is a good idea that quietly depends on someone actually maintaining the road."
pubDate: 2026-09-24
tags: ["devsecops", "engineering-management", "compliance"]
draft: true
---

The idea behind an internal developer platform is simple enough that it's easy to undersell: a developer asks for a production API, and instead of making twenty separate infrastructure decisions to get one, they get a template that already made reasonable defaults for most of them. Infrastructure, CI/CD, a starting point for observability, deployment standards — bundled, instead of assembled from scratch by whoever drew the short straw that sprint.

What's changed recently is what's expected to be bundled in.

## What a golden path is actually solving

The problem a paved road solves isn't really a technology problem — it's a consistency one. Five teams building five slightly different deployment pipelines isn't just wasted effort; it's five different places an incident, an audit, or a security review has to independently re-learn how things work. A single, reasonably good default path beats five excellent bespoke ones, mostly because the coordination cost of the bespoke version compounds quietly for years.

That argument holds regardless of company size, though what a "platform" looks like scales down a lot before it stops applying. More on that below.

## Security and compliance move from a gate to a default

The part of this I think is genuinely new isn't platform engineering itself — it's that security and compliance are increasingly expected to be part of the paved road rather than a checkpoint bolted on before release. Security-as-code, policy-as-code, compliance-as-code: static analysis, dependency scanning, and policy checks (something like OPA or a cloud-native equivalent) defined and enforced in the same pipeline that builds and deploys the service, rather than a separate review that happens — or doesn't — depending on who remembers to ask for it.

The honest upside is one I've written about before in a different context: when the pipeline itself produces the evidence an audit eventually asks for, you're not scrambling to reconstruct a paper trail after the fact. It becomes a byproduct of normal operations rather than a separate project every year.

## The part that doesn't get mentioned enough

None of this is free, and I think the framing sometimes undersells that. Policies encoded in a pipeline still need someone deciding what they should say, updating them as the org's risk posture changes, and fixing them when a legitimate deployment gets blocked by an overly strict rule. A paved road that nobody owns tends to degrade the same way an unowned wiki page does — technically still there, increasingly out of date, quietly ignored the first time it gets in someone's way. If a platform team exists, this is squarely their job. If one doesn't, the road needs an owner anyway, even if that's a part-time responsibility on someone's plate rather than a dedicated team.

## A smaller-team version of the same idea

Most of the organizations I work with don't have the headcount for a full internal developer platform, and I don't think they need one to benefit from the underlying idea. A good CI/CD template with baseline security scanning and a couple of sensible policy checks, applied consistently across however many services exist, captures a meaningful share of the benefit at a fraction of the investment. The full Backstage-style platform is a real thing worth having at a certain scale — it's just not the entry point, and treating it as one is usually how these initiatives stall before they produce anything.

Start with the template. Add the compliance evidence generation once the template is actually being used. Build the fuller platform once there's enough repetition across teams to justify it — not before.
