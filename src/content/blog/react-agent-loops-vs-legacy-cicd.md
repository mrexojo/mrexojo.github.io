---
title: "ReAct Agent Loops in Production: Why Legacy CI/CD Assumptions Break"
publishDate: 2026-12-01
tags:
  - llmops
  - devops
  - platform-engineering
  - agentic-ai
description: "CI/CD was built for deterministic software: same input, same output, gate on green. Autonomous agent loops violate that premise. An opinion on which pipeline assumptions survive, which do not, and the guardrails platform teams should be building now."
draft: true
---

Opinion piece, stated as such: production agentic systems are young everywhere, and anyone claiming a settled playbook for operating them is selling something. But the collision course is visible enough to describe now, because it is a collision between two things I know well — the delivery pipelines platform teams have spent a decade perfecting, and software that no longer behaves like the software those pipelines assume.

## The premise your pipeline is built on

Every CI/CD pipeline worth the name rests on one assumption so basic it is never written down: **the artifact behaves the same way twice.** Same commit, same tests, same result; green means safe; behavior changes only when code changes. Rollback works because the old artifact still does what it did.

A ReAct-style agent — reason, act via tools, observe, loop until done — breaks this at several joints at once. The same input can produce different tool-call sequences on different runs. Behavior changes without any commit: a model version bump, a tweaked system prompt, a tool description edit (each of which is a *deployment* in every sense except the one your pipeline recognizes). And the runtime path is chosen by the agent at execution time, based on what it observes — the control flow is data, decided after your gates have already voted.

## What breaks, specifically

**Tests stop being binary.** A deterministic assertion suite over a non-deterministic system either flakes constantly or gets weakened until it tests nothing. The replacement is statistical: evaluation suites ("evals") that run scenarios many times and gate on success *rates*, cost distributions, and violation counts. That is a real discipline — but it is slower, more expensive, and gives you "95% within bounds," which your release process must learn to consume as a green light.

**The versioned unit is no longer the code.** The behavioral fingerprint of an agent is code + model version + prompts + tool definitions + retrieval corpus. If your pipeline versions only the first, four-fifths of your production behavior changes outside change control. The prompt edited in a vendor dashboard on a Tuesday is the new SSH-into-prod-and-fix-it — and most organizations doing agents today are doing exactly that.

**Rollback loses its guarantee.** Re-deploying yesterday's container does not restore yesterday's behavior if the model behind the API moved, or the data the agent reads shifted. Honest recovery for agentic systems looks less like rollback and more like feature-flag kill switches: degrade to the non-agentic path, instantly, while you diagnose.

**Observability moves up a layer.** Logs and traces still matter, but the questions become: what did the agent decide, why, at what token cost, over how many loop iterations? A loop that converges in 4 steps on Monday and 40 on Friday is an incident with no error in any log. Loop budgets — hard caps on iterations, cost, and wall-clock per task — are the new resource limits, and they belong in platform-enforced config, not in each team's goodwill.

## Pros and cons of moving now

The case for early adoption of these guardrails: they are cheap relative to retrofit, they mostly reuse muscles platform teams have (version everything, gate releases, enforce budgets, observe behavior), and the first production incident caused by an unversioned prompt edit costs more than the whole guardrail set. The case against rushing: eval tooling is immature and churning, standards (OpenTelemetry GenAI semantics, agent frameworks) are still moving, and building heavy custom infrastructure today risks owning a bespoke platform that the ecosystem obsoletes in eighteen months.

The lazy-but-right middle: enforce the cheap invariants now — everything versioned in git, kill switches, loop budgets, tool-call logging — and stay light on custom eval platforms until the ecosystem settles. Those invariants will survive any framework churn; a bespoke orchestrator will not.

## My take

The uncomfortable part for platform engineering is cultural, not technical: we have spent a decade telling ourselves that green pipelines mean safe deploys, and agentic software makes that sentence probabilistic. Teams that internalize "we ship behavior distributions, gated statistically, with a kill switch" will run agents in production calmly. Teams that force agents through deterministic gates will get either blocked adoption or, worse, a pipeline everyone learns to route around — and shadow-deployed agents with no gates at all.

## When this applies, and when it does not

Applies when agents cross from developer tooling into production paths — customer-facing flows, automated operations, anything whose failure a customer or auditor sees. It does not apply to LLM usage that is a stateless single call with structured output; that is an API dependency, testable with contract tests, and your existing pipeline handles it fine. The line to watch is the loop: when the software starts deciding its own next step, this article's problems arrive with it.

## If you are considering this

Foundation work — versioning the full behavioral surface, budgets, kill switches, tool-call observability — is ordinary platform engineering pointed at a new target, and it is best built before the first agentic incident, not after. That work fits the engagement shapes on the [Infrastructure as Code and Automation](/works/infrastructure-as-code-and-automation/) page.
