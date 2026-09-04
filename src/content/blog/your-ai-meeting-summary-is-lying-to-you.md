---
title: "Your AI Meeting Summary Is Lying to You"
publishDate: 2026-09-04
tags:
  - ai
  - productivity
  - engineering-management
  - meeting-tools
description: "AI meeting tools solve transcription, not understanding. They capture words but miss the reality — pauses, glances, shared context, tone. Here's what I've learned after 18 months across three organizations, and the workflow that actually works."
draft: false
---

Your AI meeting summary is lying to you.

Not maliciously. Not because the model is broken. But because the entire premise — that a transcript plus an LLM equals understanding — misses what actually happens in a meeting.

I've spent the last eighteen months watching this play out across three different organizations. Banking, telecom, retail. Teams of five, teams of fifty. The pattern is always the same.

---

## The hook that got me

Six months ago, I sat in a quarterly planning session. Two hours. Eight people. One person running an AI notetaker that promised "actionable insights, automatically extracted."

The summary landed in Slack before we'd even left the room. Clean bullets. Clear owners. Deadlines. Impressive.

Except — the "decision" to migrate the payment gateway to a new provider? We didn't decide that. We agreed to *evaluate* it. The "owner" assigned to the database schema review? She was on maternity leave. The "deadline" for the API deprecation? That was a joke someone made about the legacy system finally dying.

The summary looked perfect. It was also fundamentally wrong in ways that would have caused real damage if someone had acted on it.

I've made this mistake myself. More than once. I've forwarded AI summaries to stakeholders without reading them. I've trusted the "action items" section because it was formatted so nicely. I've let the tool do the thinking because I was tired, or busy, or just wanted the meeting to be over.

---

## What the tools actually capture

Current AI meeting tools — and I've tested most of the major ones: Otter, Fireflies, Fathom, tl;dv, Granola, the built-ins from Zoom and Teams — they're solving a transcription problem, not an understanding problem.

They capture words. Speaker diarization has gotten genuinely good. Timestamp alignment works. The raw transcript is usually 95%+ accurate for clear audio in English. That's a real achievement.

But a meeting isn't a transcript.

A meeting is: the pause before someone answers. The glance between two engineers when the PM proposes a deadline. The "fine, whatever" that means "I disagree but I'm not fighting this battle." The context that everyone in the room shares — the history of the project, the politics of the org, the incident from last month that nobody mentions but everyone remembers.

The AI hears "we should refactor the authentication module." It writes: *Action item: refactor authentication module. Owner: backend team.*

What actually happened: the tech lead said it with the tone of someone who's said it four times before. The backend lead didn't make eye contact. The PM wrote it down anyway because the timeline needed something in that slot.

The summary captures the words. It misses the reality.

---

## What they get wrong systematically

### 1. False precision creates false confidence.

Bullets look decisive. Owners look accountable. Deadlines look real. The formatting does the heavy lifting of persuasion. A messy human note saying "maybe talk to Sarah about auth thing?" is honest about its uncertainty. A clean bullet saying "Refactor auth module — Sarah, by Q3" looks like a plan. It's not.

### 2. Action items without context are noise.

The tools extract imperatives. "We need to..." "Someone should..." "Let's make sure..." These become action items. But half of them are conversational filler. The other half are aspirations, not commitments. The tool can't distinguish "I'll do this" from "wouldn't it be nice if" from "this is what the auditors will ask for."

### 3. Decisions are rarely binary.

"We're going with PostgreSQL" — clean decision, right? Except the conversation included "for now," "unless the vendor review changes things," and "but we need to check licensing first." The summary says "Decision: PostgreSQL." The team operates on "Decision: PostgreSQL (with conditions)." Two weeks later, someone acts on the summary and the conditions get lost.

### 4. The people problem.

Speaker identification works until it doesn't. Two people with similar voices. Someone joining late. The person who speaks for the team vs. the person who speaks for themselves. The tools assign ownership based on who spoke the words, not who owns the work. I've seen summaries assign tasks to the person who *asked the question* rather than the person who *answered it*.

### 5. Recursive summarization.

This one's subtle. Team A uses AI summaries. Team B reads Team A's summaries and feeds them into their own AI. Team C summarizes the summaries. By the time it reaches leadership, the "we're evaluating options" has become "we're migrating." I've watched this happen in real time across a reorg. The signal degrades with every hop.

---

## The technical reality

Here's what I've learned building and running the infrastructure these tools sit on.

The models are good at extraction. They're bad at *resolution* — the process of turning ambiguous, contradictory, context-dependent human communication into unambiguous, actionable, context-free instructions.

Resolution requires: organizational context, project history, interpersonal dynamics, technical judgment, political awareness. The model has none of these. It has the transcript.

You can't prompt-engineer your way around this. RAG helps — feed it the project docs, the previous decisions, the org chart — but it's still operating on text. The critical information isn't in the text. It's in the relationships between people and the history they share.

The tools that work best are the ones that *don't pretend to understand*. Granola's approach — "your notes, enhanced" — is honest. You write. It structures. You remain the filter. The ones that promise "autonomous insights" are selling something they can't deliver.

---

## What I actually use now

I still use AI meeting tools. But differently.

**Raw transcript > Summary.** I keep the full transcript searchable. When someone asks "what did we decide about X?" I search the transcript. I read the actual words. It takes thirty seconds. It saves hours of cleanup.

**My notes, AI-structured.** I take sparse notes during the meeting — fragments, questions, disagreements. Afterward, I feed *my notes* to an LLM with a prompt: "Clean this up. Preserve uncertainty. Flag anything that sounds like a commitment but isn't explicit. Don't invent action items." The output is a better version of what I would have written, not a hallucination of what happened.

**Explicit confirmation loop.** Before any summary leaves my screen, I add a line: "Decisions confirmed: [list]. Open questions: [list]. Owners verbally confirmed: [names]." If I can't fill those in, the summary doesn't go out.

**The "what didn't happen" section.** Most valuable thing I've added: a bullet list of things that *didn't* get decided, *didn't* get assigned, *didn't* get resolved. The meeting spent forty minutes on the database migration and ended with "let's take this offline." The summary says nothing about it. My note says: "Migration approach unresolved — offline follow-up needed." That's the piece people actually need.

---

## The practical takeaway

Stop treating AI summaries as records. Treat them as *drafts written by someone who wasn't there*.

Read them. Edit them. Add the context they missed. Remove the confidence they invented. Send the corrected version.

And if you're building or buying these tools: optimize for *human-in-the-loop*, not *human-out-of-the-loop*. The best meeting tool is the one that makes it fastest for me to produce an accurate record — not the one that claims it doesn't need me.

---

## What's your experience?

I'm genuinely curious — especially from people running these tools at scale across distributed teams. What breaks? What actually works? What would you build if you were starting from scratch?

I'm @mrexojo on most platforms. The lab notes and infrastructure experiments live at mrexojo.com/blog.