---
title: "Managed Kubernetes for Mid-Size Companies: Decision Criteria"
publishDate: 2026-06-08
tags:
  - kubernetes
  - cloud
  - engineering-management
description: "EKS, GKE, or AKS — or none of them. How to decide whether managed Kubernetes fits your organization, what it really costs to operate, and the simpler alternatives that are often the right answer."
draft: false
---

Kubernetes has reached the stage of adoption where the pressure to use it is social as much as technical: candidates expect it, architects propose it by default, and "we run on Kubernetes" reads as engineering credibility. That is precisely when a technology gets adopted by organizations it does not fit. If you lead engineering at a company of twenty to a few hundred people, the Kubernetes question deserves an actual decision, not a default — in either direction.

I have operated Kubernetes in most of its managed forms: GKE at Copado (custom Terraform modules, Cloud SQL, production Salesforce DevOps platform), an EKS-to-GKE migration for Decathlon Spain, AKS delivery pipelines via Azure DevOps, and EKS/ECS estates in freelance engagements. I have also, more than once, advised a client *not* to adopt it. Both recommendations come from the same place.

## What Kubernetes is actually for

Strip the ecosystem down and Kubernetes solves a specific problem: **running many heterogeneous workloads on shared capacity with a uniform operational model.** Scheduling, self-healing, service discovery, rolling deployments, declarative configuration — one control plane, one deployment grammar, any workload shape.

The value of that uniformity scales with the number and diversity of things you run. Thirty services owned by eight teams, mixed batch and API workloads, a platform team mediating between developers and infrastructure: Kubernetes earns its complexity daily. Three services and a queue worker owned by one team: the same complexity, amortized over almost nothing.

So the first decision criterion is brutally simple — count your workloads and teams. Below roughly a dozen services or two teams, the simpler alternatives below will usually serve better. Above that, and growing, Kubernetes starts to justify itself.

## "Managed" removes the control plane, not the job

EKS, GKE, and AKS run the control plane for you — etcd, API server, upgrades of the masters. That genuinely removes the worst operational burden of self-hosted Kubernetes, and today self-hosting on VMs is almost never the right call.

But be clear-eyed about what remains yours: cluster and node upgrades on Kubernetes' aggressive release cadence (roughly three releases a year, with limited support windows — skipping upgrades is not an option the way it is with a stable VM); the ingress, DNS, certificate, autoscaling, and observability stack; resource requests and limits tuning; RBAC and network policy; and the entire relationship between developers and the cluster. In practice this is a meaningful fraction of an engineer permanently, even at modest scale, plus a learning curve for every developer who has to interact with it. That cost is fine — *if* you are buying enough uniformity with it.

Between the providers, honestly: GKE remains the most polished operationally (its autopilot mode meaningfully reduces the node-management burden), EKS is the pragmatic default inside AWS-committed organizations despite more assembly required, and AKS makes sense where the organization is already Azure- and Microsoft-toolchain-centric. The differences are real but rarely decisive; your existing cloud commitment usually decides, and that is a reasonable way to decide.

## The alternatives that are often correct

The honest comparison for a mid-size company is not Kubernetes versus chaos; it is Kubernetes versus the simpler managed runtimes:

- **ECS on Fargate / Cloud Run / Azure Container Apps.** Containers without cluster operations. For a modest number of services, these deliver 80% of the benefit — declarative deploys, scaling, health management — at perhaps 20% of the operational surface. In freelance engagements I have moved workloads *to* ECS and Lambda as a cost and simplicity improvement, in environments where Kubernetes would have been resume-driven architecture.
- **Serverless functions** for event-driven and bursty work, where the scale-to-zero economics are unbeatable.
- **Plain managed instances with good IaC** for the stable monolith that changes twice a month. Unfashionable, cheap, and perfectly professional when defined in Terraform with a clean pipeline.

A useful heuristic from migration work: if you cannot name the Kubernetes feature you need that Cloud Run or Fargate lacks — custom operators, specific scheduling, sidecar-heavy service mesh, GPU orchestration, multi-tenant platform building — you probably do not need Kubernetes yet. When you can name it, you are ready for the conversation.

## If you do adopt: the decisions that matter in year two

For organizations that clear the bar, the adoption failures I get called into are rarely about the cluster itself. They are about what surrounds it:

- **Everything in code from day one.** Cluster, node pools, ingress, IAM bindings — Terraform, not console. A cluster built by hand is unreproducible the day it matters most. (This is where my engagements usually start: the cluster exists, in one environment, built by someone who left.)
- **One paved road for developers.** A single blessed deployment path — Helm chart or Kustomize base, one pipeline pattern — beats five teams inventing five. The paved road is a product; someone must own it.
- **Upgrade discipline scheduled like rent.** Quarterly, boring, rehearsed in staging. Clusters more than two versions behind become migration projects instead of upgrades.
- **Cost visibility per namespace early.** Kubernetes is excellent at hiding which team spends what. Requests/limits discipline plus per-namespace attribution prevents the bill from becoming a mystery again — the thing you may have left VMs to escape.

## When this applies, and when it does not

This framing targets product companies in the twenty-to-few-hundred-engineer range making a platform choice they will live with for five years.

At the edges it changes: below that range, take Cloud Run or Fargate and revisit in a year — the migration later is cheaper than the operational tax now. Above it, or if you are building a multi-tenant platform *product*, Kubernetes is close to unavoidable and your questions are about platform engineering, not adoption. And organizations with hard on-premises or sovereignty requirements are choosing *distributions* (OpenShift, Rancher, k3s), a related but different decision.

## If you are considering this

I do both engagement shapes: the assessment (two weeks — workload inventory, team structure, a recommendation with the reasoning written down, sometimes the recommendation is "not Kubernetes") and the adoption or migration itself, delivered in Terraform with the paved road built alongside your team. Details on the [Cloud Architecture and Migration](/works/cloud-architecture-and-migration/) page.
