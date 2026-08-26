---
title: "Docker Under the Hood: The Runtime Anatomy Every Infrastructure Engineer Should Know"
publishDate: 2026-09-22
tags:
  - docker
  - linux
  - sre
  - containers
description: "CLI, dockerd, containerd, runc, and the kernel primitives underneath — namespaces and cgroups. Why the layered anatomy matters operationally, what each layer owns, and where incidents actually live. A back-to-fundamentals piece."
draft: true
---

Unlike the news-driven pieces in this series, this one is fundamentals — and it is the article I find myself whiteboarding most often for teams. Everyone uses Docker; a surprising share of engineers who operate containers in production cannot say what actually happens after they press enter on `docker run`. That gap is invisible until an incident lives below the layer they know, and then it is the whole incident.

## The stack nobody drew for you

`docker run` does not run a container. It sends an API request. The actual anatomy is a chain of four separable components, and each one is an operational boundary:

**The CLI** is a thin REST client talking to a Unix socket. Operationally trivial — except that access to `/var/run/docker.sock` is root-equivalent on the host, which makes every "just mount the Docker socket into the container" pattern (CI runners love this) a privilege decision someone should have made consciously. Most did not.

**dockerd** is the daemon: API surface, image builds, volumes, networking, and the developer conveniences. It is also, historically, the component whose restart took your containers down with it — the operational reason the next layer exists as a separate process.

**containerd** is the supervisor that actually manages container lifecycle: pulls and stores images, manages snapshots, starts and watches containers via lightweight shims. The shim design is the operationally elegant part: each container gets a tiny shim process holding its stdio and exit status, so containerd — and dockerd above it — can restart *without killing your workloads*. It is also why Kubernetes dropped Docker entirely and talks to containerd directly: the top layer was developer convenience, not production necessity. If your mental model of "Docker in production" still includes dockerd on every node, it is a decade stale — on EKS, GKE, and AKS nodes, containerd *is* the runtime.

**runc** is where the container finally becomes real: a short-lived binary that assembles kernel primitives into an isolated process and exits. It runs for milliseconds. Nearly every "container escape" headline of the past decade — including the runc CVEs that had everyone patching in a hurry — lives at this layer or below, because this is the layer that touches the actual security boundary.

## The kernel is the only thing doing isolation

The uncomfortable truth the layers hide: **there is no container object in the kernel.** A container is an ordinary Linux process wearing two sets of kernel clothing:

**Namespaces** control what the process can *see*: its own PID tree (PID 1 inside is a lie the namespace tells), its own network stack, mounts, hostname, users. The user namespace is the one worth an engineer's special attention — root inside mapped to an unprivileged UID outside is a genuine hardening line, and still not the default in most deployments.

**cgroups** control what the process can *use*: CPU, memory, IO. This is where the most common production container incident in existence lives — the OOM kill. The kernel enforcing a memory limit does not negotiate; it kills. Every team that has stared at exit code 137 wondering what happened was meeting cgroups for the first time. Kubernetes requests and limits are cgroups with YAML on top; engineers who know that debug node-pressure incidents in minutes instead of afternoons.

Add layered filesystems (overlayfs) and capabilities (root, subdivided — most containers need three of the forty-odd, run with more) and you have the complete recipe. Isolation is *composed*, not conferred. It is exactly as strong as the primitives were configured — no more — which is why "containers are like lightweight VMs" is the most operationally expensive analogy in infrastructure: VMs share a hypervisor interface measured in pages; containers share a kernel measured in hundreds of syscalls. That difference is why hostile-code workloads are moving to microVMs, and why kernel CVEs are container-fleet incidents.

## Why this matters to a leader, not just a debugger

Three practical consequences. **Incident speed:** teams fluent in this anatomy resolve container incidents dramatically faster, because they ask layer-appropriate questions — is this a dockerd problem, a containerd problem, or a cgroup doing its job? **Security posture:** socket exposure, capability sets, user namespaces, seccomp profiles are all decisions being made in your fleet right now, by default, in whatever direction the defaults point. **Vendor conversations:** when a platform vendor says "our runtime is more secure," the anatomy tells you which layer they mean and what question to ask next. Fundamentals are leverage; they do not expire with the news cycle.

## When this applies, and when it does not

If your organization runs containers — so, if it exists — the anatomy applies; the only variable is which layer you operate versus delegate. Fully managed serverless containers delegate everything below the image, and that is a fine trade consciously made. The knowledge matters most for teams operating Kubernetes nodes, CI infrastructure, or anything multi-tenant — and for anyone who has to decide, after the next runtime CVE, whether their fleet is affected and how fast to move.

## If you want help

Fleet hardening against this anatomy — socket exposure, capabilities, user namespaces, runtime patch cadence — is a bounded review with findings your team keeps. Shape described on the [DevSecOps and Delivery Pipelines](/works/devsecops-and-delivery-pipelines/) page.
