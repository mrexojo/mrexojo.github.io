---
title: "Audit-Ready Cloud Infrastructure Without the Pre-Audit Panic"
publishDate: 2026-06-29
tags:
  - compliance
  - devsecops
  - security
description: "How engineering organizations facing ISO 27001, SOC 2, NIS2, or DORA can make audit evidence a byproduct of normal operations — and why infrastructure as code is the cheapest compliance tool you already own."
draft: false
---

There is a moment familiar to every engineering leader in a regulated or enterprise-selling company: the audit is scheduled, the evidence request list arrives, and the organization discovers that proving what it does costs more than doing it. Screenshots are taken, spreadsheets of access grants are reconstructed from memory, and for six weeks the platform team becomes a documentation team. Then it ends, everyone exhales, and nothing changes until next year.

This cycle is optional. The organizations that handle audits cheaply — increasingly a market-access requirement in Europe, where NIS2 and DORA have joined ISO 27001 and SOC 2 on the enterprise procurement checklist, and where German, Dutch, and Nordic buyers in particular treat certifications as table stakes — share one property: **their normal engineering practices produce evidence as a byproduct.** Having built DevSecOps delivery for clients in banking and insurance, where this discipline is not negotiable, I can report that the gap between audit-ready and audit-panicked is smaller than it looks, and most of it is infrastructure work you would benefit from anyway.

## The reframe: auditors ask questions your platform should answer

Strip the compliance vocabulary away and every framework asks the same five operational questions:

1. Who can access what, and who approved it?
2. What changed in production, when, and who reviewed it?
3. How do you know your systems are patched and free of known vulnerabilities?
4. Can you recover from failure, and when did you last prove it?
5. When something goes wrong, how do you detect and respond?

Notice these are not compliance questions. They are the questions *you* should want answered about your own platform, audit or no audit. A platform that cannot answer them has an operational problem wearing a compliance costume. This reframe matters practically: it means the work is not "for the auditor" — it compounds.

## Infrastructure as code is your evidence engine

The single highest-leverage move is one many teams have half-made already: define infrastructure in Terraform, deploy it through a pipeline, and forbid console changes culturally and then technically.

Consider what this produces without any additional effort. Every infrastructure change is a pull request: proposed by a named person, reviewed by another named person, timestamped, with the diff preserved forever. That is the *change management evidence* auditors ask for — question 2 answered wholesale — except instead of a change-advisory-board spreadsheet, it is your normal engineering workflow. The same repository documents your architecture more truthfully than any diagram, because it cannot drift from reality without the drift being detectable (`terraform plan` on a schedule *is* a compliance control). And when an auditor asks "how do you ensure encryption at rest on all storage," the answer is a grep and a policy check in CI, not a manual inventory.

Policy-as-code tooling (checkov, tfsec/Trivy, OPA) closes the loop: the control is not "we intend to encrypt storage" but "the pipeline rejects unencrypted storage." Auditors distinguish sharply between controls that depend on intention and controls that are mechanically enforced, and so should you.

## The delivery pipeline as control surface

The same logic extends through CI/CD. A pipeline that runs dependency scanning (Snyk, DependencyTrack), static analysis (Semgrep, SonarQube), and container scanning (Trivy) on every build answers question 3 continuously — with findings routed into a triage workflow (DefectDojo) rather than a PDF nobody reopens. Signed-off deployments to production answer the segregation-of-duties question. Secrets in a managed store (Vault, cloud-native) with rotation and access logging answer half of question 1 for machine identities.

Two hard-won cautions from building this in banking environments. First, **tune before you enforce**: a scanner introduced at maximum severity blocks every build, and within a fortnight the team has learned to bypass it — a control that is bypassed routinely is worse than none, and an auditor who spots the bypass pattern will (correctly) distrust everything else. Second, **findings need an owner and an SLA**, or the dashboard becomes a liability: discovery without response is documented negligence.

## Access and recovery: the two questions that sink audits

Question 1 fails audits most often, for a mundane reason: access accumulates and reviews do not happen. The fix is structural — one identity provider for everything, roles instead of individual grants, expiry dates on external access, and a quarterly access review that is an exported report from the IdP rather than an archaeology project. If any system holds local accounts outside the IdP, that system is where your audit finding lives.

Question 4 — recovery — fails second-most-often, because "we have backups" meets "show me the last restore test" and loses. The bar is a scheduled, automated restore verification and one documented recovery exercise per year with findings and remediations. (I have written about the [backup-replication-recovery distinction](/blog/backup-replication-and-recovery-strategy/) separately; for audit purposes, the test evidence is the deliverable.)

## When this applies, and when it does not

This approach fits engineering organizations facing their first serious framework (ISO 27001, SOC 2 Type II) or newly in scope for NIS2/DORA, especially those selling into DACH, Benelux, and Nordic enterprises where the security questionnaire arrives before the second sales call.

It is not a substitute for the organizational half of compliance — policies, risk assessment, HR processes, vendor management — which no pipeline produces; you still need a compliance function or consultant for that layer. And in heavily regulated sectors (payments, health), the frameworks prescribe specifics beyond this article's scope. What the engineering practices above do is make the *technical* control set nearly free, which typically shrinks the audit project by half.

## If you are considering this

The engagement I run here is a gap review against the five questions — two weeks, ending in a prioritized remediation plan where most items are engineering improvements you would want regardless — followed, if wanted, by the implementation: IaC coverage, pipeline controls, access cleanup, restore automation. Built with your team, documented for your auditor. Details on the [DevSecOps and Delivery Pipelines](/works/devsecops-and-delivery-pipelines/) page.
