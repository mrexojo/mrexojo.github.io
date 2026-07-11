---
title: "Infrastructure as Code and Automation"
description: "Terraform-based infrastructure and deployment automation that removes manual steps and stays maintainable after handover."
tech:
  - Terraform
  - Ansible
  - GitHub Actions
  - Packer
  - Python
order: 2
publishDate: 2026-07-02
---

## The problem this solves

When every change depends on manual steps, specific people, or scattered documentation, the platform stops scaling with the team. Deployments become the bottleneck, environment drift becomes the norm, and onboarding a new engineer takes weeks instead of days.

## What the engagement looks like

I define the infrastructure in Terraform at the right level of abstraction: enough structure that changes are reviewable and repeatable, not so much that only the author can maintain it. Pipelines (GitHub Actions, GitLab CI, Azure DevOps) automate the path from merge to environment, with approvals and controls where they matter.

In a recent freelance engagement I built the full development toolchain around Terraform and GitHub Actions — including the GitHub organization itself — which cut deployment time by roughly 40% and removed the manual environment errors that had been causing incidents. At Copado I built custom Terraform modules integrated with GKE, Cloud Storage, and Cloud SQL for a Salesforce DevOps platform; at Telefónica Foundation, the full IaC for a globally available platform with eight autoscaling groups and three HA clusters.

## Typical deliverables

- Terraform codebase with module structure, state management, and CI integration.
- Deployment pipelines with documented promotion and rollback paths.
- Image and environment build automation (Packer, Ansible) where needed.
- Documentation and a working session with the team that inherits it.

## Who this is for

Engineering managers whose teams lose time to manual deployments, and platform leads who inherited cloud infrastructure that only exists in the console. HashiCorp Terraform Certified Associate; I have also designed and delivered Terraform training for client teams.
