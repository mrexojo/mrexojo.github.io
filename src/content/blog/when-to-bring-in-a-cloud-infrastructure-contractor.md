---
title: "When to Bring In a Cloud Infrastructure Contractor — and When Not To"
publishDate: 2026-06-15
tags:
  - contracting
  - engineering-management
  - cloud
description: "A build-vs-borrow framework for engineering leaders: which infrastructure work justifies external senior capacity, what it should cost relative to hiring, and the three signs you are about to buy the wrong thing."
draft: false
---

Somewhere in your planning cycle, a piece of infrastructure work is stuck: the migration nobody has bandwidth for, the CI/CD rebuild that keeps slipping quarters, the cloud bill review everyone agrees should happen. The default responses — "we'll hire for it" and "the team will get to it" — both have a failure rate that rarely gets examined. Hiring a senior platform engineer in Europe currently takes three to six months from opening the role to productive work. "The team will get to it" is often a polite way of scheduling the work for never.

External senior capacity is the third option, and it is neither a luxury nor an admission of failure — it is a financing decision about engineering time. But it fits some work extremely well and other work very badly, and buying it for the wrong work is how companies end up owning infrastructure nobody understands. Having sold this capacity since 2022 — to banks, insurers, and software companies — I have a well-tested view of where the line sits.

## The economics, stated plainly

A contractor's day rate is higher than an employee's fully loaded daily cost. Comparing those two numbers is the standard mistake, because they buy different things:

- **A hire** buys permanent capacity plus ramp-up time, hiring risk, and the obligation to keep that person engaged with meaningful work after the urgent project ends.
- **A contractor** buys immediate capacity, zero long-term obligation, and — if you choose well — pattern knowledge from having done this specific job many times.

The economics favor a contractor when the work is **bounded, urgent, and infrequent**: it has a definition of done, it costs you something every month it does not happen, and your team will not do it often enough to get good at it. A cloud migration is the canonical case — most internal teams do one every five years; a specialist does several a year. The economics favor hiring when the work is **permanent and central**: operating your platform indefinitely is a job, not a project, and structuring it as contracting just adds margin to a salary.

## Work that fits external capacity

Across my engagements, the recurring shapes:

**Migrations and platform transitions.** Cloud-to-cloud, off PaaS platforms, VM fleets into managed Kubernetes or serverless. High stakes, clear end state, rare enough that internal experience is thin. This is the category where specialist pattern knowledge pays most directly — I have executed EKS-to-GKE and Heroku-to-Cloud SQL migrations that internal teams had correctly assessed as risky and then deferred for a year.

**Foundation work with a handover.** Infrastructure as Code adoption, CI/CD and DevSecOps pipelines, landing-zone and account structure. The contractor builds the first version *with* the team, and the team owns it after. A version of this I deliver often: Terraform plus GitHub Actions delivery setup, with security scanning integrated, handed over with training.

**Independent review.** Architecture assessments, cost reviews, security posture checks. Here independence is the product — an outsider can conclude "this is over-engineered" or "this vendor contract is bad" without owning the internal history of those decisions.

**Pressure relief with a boundary.** The team must ship a product deadline while the platform bleeds operational issues. A contractor holds the platform front for a quarter so the team does not context-switch. The boundary — which front, for how long — is what keeps this from sliding into the anti-pattern below.

## Work that does not fit

Three shapes reliably produce bad outcomes:

**Permanent operations without an end state.** If the engagement description is "keep production healthy," indefinitely, you are hiring — do it properly. A contractor in this seat becomes a single point of failure with a notice period measured in days.

**Work nobody internal will receive.** If there is no team member who will own the result, the deliverable is orphaned on day one. This is the most important pre-check: name the internal owner *before* signing, not after delivery. No owner, no engagement.

**Judgment outsourcing on strategy.** A contractor can inform a build-vs-buy or cloud-provider decision; they cannot own it. Companies occasionally want an external name to carry a controversial decision — that purchase always ends badly, because accountability does not transfer with the invoice.

## How to buy it well

Four practical points from the selling side, offered against interest where noted:

**Scope by outcome, not by hours.** "Migrate these three services to ECS with rollback tested and the team trained" is a contract; "help us with DevOps" is a subscription to ambiguity. Fixed scope keeps both sides honest — and against my interest as a seller of time, I will note that vague retainers are more profitable and deliver less.

**Check for handover behavior, not just skills.** Ask a candidate contractor how their last three engagements ended. The answer you want involves documentation, training sessions, and internal owners. The answer you do not want involves "they still call me sometimes" delivered as a point of pride.

**Start with a small cut.** A one-to-two-week assessment before a large commitment tests working style, communication, and honesty at low cost. A good contractor's assessment will include at least one recommendation that reduces the scope of what you buy from them.

**Insist on your systems, your accounts, your repositories.** Everything built lives in your GitHub organization, your cloud accounts, your documentation space, from day one. Contractors who deliver from their own accounts are building leverage, not infrastructure.

## When this applies, and when it does not

This framework assumes you have an internal engineering team to hand work to and remote-friendly practices — the standard case in European product companies today.

It does not apply if you have no technical staff at all (you need a managed-services relationship with ongoing accountability, a different market) or if your constraint is headcount budget rather than time — contractors are a speed instrument, and buying speed you do not need is waste.

## If you are considering this

My own engagement model — remote B2B from Spain, European time zones, fixed-scope or bounded retainer, handover written into the statement of work — is documented across the [services pages](/works/). If the work you have in mind fits the shapes above, the first step is a 30-minute scoping call; if it does not fit, that call will save us both a contract.
