---
title: "Fifteen CI/CD and Kubernetes Questions Worth Sitting With"
description: "Not questions with a single correct answer, but ones where working through them honestly says more than reciting the textbook definition. How I currently think about each — not the final word on any of them."
pubDate: 2026-09-17
tags: ["sre", "kubernetes", "devsecops"]
draft: true
---

I don't think there's one right way to answer most of what follows — plenty of engineers who do this daily would reasonably push back on parts of it. What I can offer is how I've come to think about these after years running CI/CD pipelines and Kubernetes across a handful of environments: GKE, an EKS-to-GKE migration, AKS, EKS/ECS in freelance work. I've gotten a few of these wrong before landing on the version below, and I'd guess I still have blind spots in here somewhere.

Grouped into three areas, for whatever they're worth.

## I. From commit to production

### 1. The complete CI/CD flow, commit to production

Roughly: commit to a feature branch → the pipeline runs lint, static analysis, unit tests, and dependency scanning → on merge, it builds the artifact or image, tags it with the commit SHA, scans it for vulnerabilities, and pushes it to the registry → it deploys automatically to a lower environment → integration and contract tests run there → an approval gate, if the organization needs one → progressive rollout to production (rolling, canary, or blue-green) → automated smoke tests and health checks afterward → deploy markers land on the dashboards, closing the loop back to observability.

The part I'd underline: a pipeline is only as trustworthy as its ability to block the next stage automatically when something fails. One that just emails someone and hopes tends to get ignored eventually — not out of carelessness, just because that's what happens to alerts nobody has to act on.

### 5. Rolling, Blue-Green, and Canary — and when each earns its complexity

**Rolling** replaces old pods with new ones gradually, no parallel environment — the Kubernetes default, and usually fine for routine, low-risk changes. **Blue-Green** runs a full parallel environment and switches all traffic at once, keeping the old version live as an instant rollback — worth the doubled capacity cost when a clean, immediate rollback matters more than gradual exposure, which comes up more often in regulated releases. **Canary** ships to a small slice of real traffic first and expands only if metrics hold — useful when you want evidence from live users before committing fully, though it's rarely as simple as it sounds: it needs real automated analysis behind it, not someone watching a dashboard and hoping.

They're not really three competing options — rolling is the update mechanism, canary is a traffic-shaping policy, blue-green is an environment topology. They can combine.

### 6. A canary's error rate spikes — how do you stop it before 100%

This works best when it's decided ahead of time, not in the moment. A progressive-delivery controller (Argo Rollouts, Flagger) watches defined success metrics — error rate, latency, a custom query — at each traffic-weight step, and a breach aborts the promotion automatically, dropping the canary's traffic back to zero while the stable version keeps serving everyone. Where that automation doesn't exist yet, the fallback is a predefined kill switch that on-call can pull without asking permission first. Either way, it's worth resisting the urge to delete the failing pods immediately — they're usually the only evidence you'll have for figuring out what actually went wrong.

If aborting a canary needs a meeting first, it's probably not protecting anyone in the moment that matters.

### 7. Terraform reports manual drift — how do you handle it

`terraform plan` shows the diff; it doesn't say why it's there. Checking the cloud audit log for who made the change and when usually answers that. From there it's a judgment call: if it was a legitimate emergency fix, `terraform import` the real state or update the code so it reflects reality, rather than silently overwriting someone's hotfix. If it wasn't legitimate, apply the revert — but knowingly, since reverting a manual fix without understanding it can reopen whatever it was patching.

In most cases I've run into, the drift itself wasn't really the problem — it was a sign that write access to infrastructure was broader than anyone had noticed. Scheduled drift detection helps catch the next one sooner, but it doesn't fix that underlying gap on its own.

### 8. Your Docker image is 2 GB — how do you optimize it

Multi-stage builds usually do most of the work: build in one stage with the full toolchain, then copy only the resulting binary or artifact into a minimal final stage — distroless, alpine, or scratch depending on what the runtime actually needs. Ordering layers by how often they change helps the cache do its job, so only the application layer rebuilds most of the time. A `.dockerignore` that excludes `.git`, test fixtures, and local dependency folders rounds it out.

Done reasonably well, this tends to take a 2 GB image down to the low hundreds of megabytes, and deploy time from minutes to seconds. The rough rule I use: the final image should hold the runtime, not the tools that built it.

### 15. Everything is automated, and deployments still fail

Automation removes manual error; it doesn't remove a flawed deployment design underneath it. The usual suspects, in my experience: a test suite with solid unit coverage but no integration or contract tests against real dependencies, or a pipeline that's been red often enough that people have quietly stopped trusting it; staging that doesn't match production closely enough in data volume or scale, so problems only ever show up live; migrations that lock tables or break compatibility without an expand-contract approach; no validation gate that checks real production metrics after the deploy finishes; and deploys that are also releases by default, with nothing — like feature flags — decoupling "the code is live" from "the feature is on."

When this keeps happening, I've usually found the pipeline itself wasn't the actual problem — the deployment strategy underneath it was.

## II. Inside the cluster

### 3. A pod is stuck in CrashLoopBackOff — how do you find the root cause

CrashLoopBackOff is Kubernetes' backoff mechanism, not a diagnosis — it's worth remembering that before spending time on it directly. `kubectl describe pod` usually gives the last exit code and recent events. Exit 137 points to OOMKilled, a resource-limit issue rather than an application bug. Exit 1, or most other application-level codes, usually means the process is crashing on its own, and `kubectl logs --previous` tends to explain why, since the current container has already restarted by the time you look.

Separately, it's worth checking whether a liveness probe is killing an app that's actually fine but just slow to start — from the outside that looks identical to a real crash, but the fix is the probe's timing, not the code. After that: mounted config or secrets missing expected keys, and node-level conditions like disk pressure. Almost always, the actual answer is sitting in the exit code or the previous container's logs — CrashLoopBackOff on its own doesn't tell you much.

### 4. How Kubernetes DNS works, and what happens when one service calls another

CoreDNS runs as cluster pods and handles the cluster's internal DNS. Every Service gets a record — `service.namespace.svc.cluster.local` — that resolves to its ClusterIP, a stable virtual address. The kubelet points each pod's resolver at CoreDNS. When Service A calls Service B by name, that lookup returns B's ClusterIP, an address that only really exists as iptables or IPVS rules, not on any physical interface. kube-proxy (or an eBPF equivalent like Cilium) intercepts traffic to that virtual address and routes it to one of the real pod IPs listed in the Service's EndpointSlice — which only includes pods currently passing their readiness check.

DNS gets you to a stable address; kube-proxy is what turns that address into an actual, live pod. When something is "unreachable," I've found it worth pausing to figure out which of those two layers actually failed before touching either.

### 11. Configuring an L7 load balancer for multiple microservices

An Ingress controller (NGINX, Traefik) or a cloud-native L7 load balancer (ALB via the AWS Load Balancer Controller, GCP's HTTP(S) LB) sits in front of the cluster and routes by host (`api.example.com` vs. `admin.example.com`) or path (`/orders` → orders-service, `/users` → users-service). TLS terminates there, ideally with cert-manager handling issuance and renewal automatically. Per-backend health checks keep traffic away from a service that's running but not actually healthy.

A service mesh — Istio, Linkerd — solves a different problem (mTLS between services, fine-grained traffic policy) than ingress does, and it's worth adding only once that specific need shows up. I've seen it added earlier than necessary more often than I've seen it missing.

### 12. Managing database passwords, API keys, and secrets in Kubernetes

Worth starting from: a Kubernetes Secret is base64-encoded, not encrypted, unless etcd encryption at rest is explicitly enabled — better to treat the built-in object as access control rather than real secrecy until that's confirmed on the specific cluster. Beyond that, a dedicated secret store — Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault — synced in via the External Secrets Operator or a CSI driver keeps anything sensitive out of Git and out of plain manifests. For GitOps, Sealed Secrets or SOPS let you commit encrypted values safely.

Scoping RBAC so only the namespaces and service accounts that need a given secret can read it matters more than it usually gets credit for, and mounting as files rather than environment variables helps too — env vars have a way of ending up in logs or crash dumps eventually. Workload identity (IRSA on EKS, Workload Identity on GKE, Managed Identity on AKS) is the part I'd prioritize if only one thing changes: it lets pods assume cloud IAM roles directly instead of holding static long-lived credentials at all.

## III. When production breaks

### 2. The deployment succeeded, but users are getting 500 errors

Worth checking first: did "succeeded" mean the health checks actually passed, or just that `kubectl apply` returned without error? Those aren't the same claim. From there — reading the application logs for the specific failing requests, diffing everything that changed in the release and not just the code (environment variables, secrets, feature flags, a database migration), checking whether a dependency is degraded, checking for OOMKills or CPU throttling against resource limits, and checking whether traffic reached pods before they were actually ready.

If the cause isn't obvious within a few minutes, I'll usually roll back first and figure out the rest afterward. Restoring service and finding the root cause are two different jobs, and in my experience it's rarely a mistake to let the first one win, even before fully understanding what happened.

### 9. CPU and memory look normal, but response time has increased

Normal CPU and memory say the box is healthy; they don't say anything about what the request is actually waiting on. Worth checking the database first — a missing index, lock contention, a query that only gets slow under a particular data shape. Connection or thread pool exhaustion can cause requests to queue while every individual thread looks idle, which is easy to miss. Garbage collection pauses on managed runtimes, a cache hit rate that's dropped quietly, and a downstream API whose latency has crept up are the other usual places I end up looking.

CPU and memory measure the process; latency measures everything the request touches along the way — when it rises without them, in my experience the bottleneck has usually moved to a dependency or a queue rather than the code itself.

### 10. Configuring a default Grafana data source for new panels

In the data source's settings, there's a **Default** toggle — only one per organization can hold it, and any newly created panel without an explicit source picks it up automatically. If dashboards are provisioned as code, the equivalent is setting `isDefault: true` in that data source's provisioning YAML, which has the advantage of being reproducible rather than a manual click someone has to remember on the next environment.

### 13. Production is down at 2 a.m. — detection to RCA

**Detection**: ideally a symptom-based alert fires — an SLO burning too fast, error rate over threshold — before a customer notices first. **Investigation**, kept short: checking what changed recently, since most incidents trace back to a change — a deploy, a config edit, a dependency's status page — then correlating against logs and traces on the failing path. **Mitigation** comes before full understanding, not after: rolling back the last deploy, failing over, scaling out, or flipping a feature flag off, whichever stops the impact fastest, even without knowing exactly why it worked yet.

**RCA** happens a few days later, ideally blameless, building an honest timeline rather than just recording what fixed things, and naming action items with actual owners — including feeding back into monitoring, so the same failure either pages faster next time or doesn't happen at all.

### 14. Your application suddenly gets 10x normal traffic

Scaling compute is usually the more straightforward part — HPA on pods, cluster autoscaler on nodes, with enough quota headroom that autoscaling isn't blocked by a limit nobody remembered setting. The harder part tends to be the database: read replicas, connection pooling, and a caching layer in front of it to keep load off entirely. Rate limiting and backpressure at the edge help the system degrade gracefully instead of failing outright, and queue-based decoupling helps for anything that doesn't strictly need to be synchronous.

None of this is much good discovered live — load testing beforehand is really what turns a 10x spike from an incident into an ordinary Tuesday, though I'll admit that's easier to say than to always get around to doing.

## A note on where these came from

These aren't meant as a checklist, and definitely not a rubric for judging anyone. They're closer to the questions I still ask myself, even years into this, when something breaks in an unfamiliar way. If a few of them expose a gap in how a team would answer, I don't think that says much on its own — it usually just means the scenario hasn't come up yet, or came up once and got patched rather than properly understood at the time. Worth coming back to before it comes up for real, if there's time to.
