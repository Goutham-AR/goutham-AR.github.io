---
title: "My Learnings on Rate Limiting Algorithms: From Token Bucket to Sliding Windows"
description: "A personal deep-dive into rate limiting techniques I've explored — covering Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter, their trade-offs, and practical implementation notes from experiments and reading."
slug: rate-limiting-algorithms-learnings
date: 2026-02-06
lastmod: 2026-02-06
draft: false
tags:
  - rate-limiting
  - system-design
  - backend
  - algorithms
  - api
  - redis
  - scalability
categories:
  - System Design
  - Backend Engineering
author: Goutham
image: /images/rate-limiting-header.png
featured: true
readingTime: ~15 min
---

Rate limiting always felt like one of those “boring but essential” backend topics — until I actually tried implementing it properly. What started as a weekend experiment to protect a small side-project API quickly turned into a rabbit hole of algorithms, edge cases, memory trade-offs, and fairness questions.

Over the last few weeks I’ve built toy implementations in Python + Redis, read dozens of engineering blogs (Cloudflare, Redis, Kong, Stripe), watched system-design talks, and compared how these algorithms behave under bursty traffic, abusive clients, and distributed deployments.

This post is my attempt to document what I’ve learned in a structured way — not just the theory, but the practical “why I’d choose this one” decisions I’ve arrived at. We’ll cover the five most common algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, Sliding Window Log, and Sliding Window Counter.

## Why Rate Limiting Is Trickier Than It Looks

At its core, rate limiting is about **enforcing a maximum rate of operations** per client (user, IP, API key, etc.) over a sliding or fixed period of time.

But the devil is in the details:
- How do you handle **bursts**? Some APIs want to allow short spikes (e.g., mobile app refreshing), others want perfectly smooth traffic.
- How do you prevent the infamous **boundary burst** where someone sneaks double the limit by timing requests across window resets?
- How do you scale it to millions of users without exploding memory?
- How do you make it **fair** so one abusive client doesn’t starve legitimate ones?

These questions led me to realize there is no single “best” algorithm — only the best one for your specific use case.

## 1. Token Bucket – The Go-To for Burst-Friendly APIs

**How it really works**  
Picture a bucket that slowly fills with tokens at a fixed rate (e.g., 50 tokens per minute). Every request consumes one token. If there are no tokens left, the request is rejected (429). The bucket has a maximum capacity — that’s what allows controlled bursts. Once the bucket is full, extra tokens are discarded.

**Important realization from my experiments**  
In almost every real-world implementation (including libraries like Bucket4j, Guava RateLimiter, and Redis-based ones), buckets are **created lazily** — only when the first request from a particular user/IP/key arrives. At service startup, you don’t pre-create buckets for every possible user (that would waste gigabytes of RAM for millions of inactive users). Instead, you start with an empty map/dictionary and instantiate a bucket only on demand — usually **pre-filled to capacity** so the very first request always succeeds.

**Pros**
- Naturally supports controlled bursts up to the bucket size (great for user experience)
- Very memory efficient — only needs current token count + last-refill timestamp per key
- Easy to reason about and tune (capacity = burst size, refill rate = sustained limit)

**Cons**
- Bursts can still feel “unfair” if you set the bucket too large
- Requires careful tuning of two parameters (capacity + rate)

**Real-world examples**  
Stripe, GitHub API, many AWS services, and most general-purpose API gateways use variants of token bucket because it strikes a nice balance between protection and usability.

## 2. Leaky Bucket – When You Want Smooth, Predictable Traffic

**How it works**  
Requests arrive into a fixed-size queue (the “bucket”). A background process (or timer) “leaks” requests out of the bottom at a constant rate — say, one request every 100 ms. If the queue fills up, new requests are rejected or delayed.

**Key insight from our earlier discussion**  
Just like token bucket, real systems almost never use a single global queue — that would allow one abusive user to fill the queue and block everyone else. Instead, you maintain **multiple independent queues**, one per user, IP, API key, etc., created lazily on the first request from that identifier.

**Pros**
- Guarantees very smooth, constant-rate processing — excellent for downstream systems that can’t handle bursts (e.g., legacy databases, message queues)
- Predictable latency for accepted requests

**Cons**
- Introduces queuing delay (unless you drop instead of queue, which is common in APIs)
- Doesn’t allow meaningful bursts — everything is strictly paced

**Best for**  
Network traffic shaping, message brokers, or any system where jitter and bursts hurt more than they help.

## 3. Fixed Window Counter – Simple, but Dangerous at the Edges

**How it works**  
Time is divided into fixed, non-overlapping windows (e.g., every 60 seconds). You keep a counter for the current window. When a request arrives, increment the counter. If it exceeds the limit → reject. At the end of the window, reset the counter to zero.

**The problem I kept hitting**  
The infamous boundary burst: imagine a limit of 100 req/min. A client sends 100 requests at 59.9 seconds → allowed. Then another 100 requests at 00.1 seconds of the next minute → also allowed. Result: 200 requests in ~1 second — double the intended rate!

**Pros**
- Extremely simple to implement
- Minimal memory (just one counter + current window timestamp per key)

**Cons**
- Severe edge-case burst vulnerability
- Resets feel artificial and unfair

**Best for**  
Quick prototypes, internal tools, or cases where you explicitly accept the boundary risk.

## 4. Sliding Window Log – Mathematically Perfect (but Heavy)

**How it works**  
For each user, maintain a sorted list (or Redis sorted set) of the **exact timestamps** of every allowed request. When a new request arrives:
1. Remove all timestamps older than the window (e.g., >60 seconds ago)
2. Count how many remain
3. If count < limit → allow the request and append current timestamp

**What I love about it**  
It is **perfectly accurate**: no matter when you look, the number of requests in any rolling 60-second window is never allowed to exceed the limit. There is no way to game the boundaries.

**The practical downsides I ran into**
- Memory usage grows linearly with the number of requests in the window (a 10,000 req/min limit means potentially storing 10,000 timestamps per active user)
- Every request requires trimming the list and counting — acceptable with Redis ZSET, but heavier than counters

**Best for**  
Security-focused APIs, strict per-user billing, fraud/abuse prevention — anywhere cheating the limit would be expensive.

## 5. Sliding Window Counter – The Modern Production Sweet Spot

**How it works**  
A clever hybrid: divide time into fixed sub-windows (usually 1 second or 1 minute granularity), but only keep counters for the **current sub-window** and the **previous sub-window**.

When a request arrives:
- Calculate how far we are into the current sub-window (e.g., 20 seconds into a 60-second window → 33% elapsed)
- Compute a **weighted estimate** of requests in the true sliding window:  
  `estimated = (previous_window_count × remaining_fraction) + current_window_count`
- If estimated < limit → allow + increment current counter

**Why this became my favorite**  
It gives ~95–99% of the accuracy of Sliding Window Log while using **constant memory** (only two counters per user/key). The boundary error is tiny and usually acceptable. It’s also very Redis-friendly (Lua scripts + two keys per user).

**Pros**
- Excellent accuracy with minimal memory and CPU cost
- No list trimming on every request
- Scales beautifully in distributed systems

**Cons**
- Still an approximation (very small over-allowance possible near edges)
- Slightly more complex logic than fixed window

**Best for**  
High-scale, production APIs — this is what many modern API gateways, Redis-based limiters, and companies like Kong / Zuplo lean toward today.

## Side-by-Side Comparison

| Algorithm                  | Accuracy          | Burst Behavior           | Memory per User       | CPU per Request     | Boundary Exploit? | Typical Production Use |
|----------------------------|-------------------|--------------------------|-----------------------|---------------------|-------------------|------------------------|
| Token Bucket               | Good              | Yes — controlled         | Low (2 values)        | Low                 | No                | Most general APIs      |
| Leaky Bucket               | Good              | No — strictly smoothed   | Low–Medium            | Low                 | No                | Traffic shaping        |
| Fixed Window Counter       | Medium            | Yes — dangerous double   | Very Low              | Very Low            | Yes (severe)      | Prototypes             |
| Sliding Window Log         | Excellent         | No — perfectly strict    | High (× requests)     | Medium              | No                | Strict security        |
| Sliding Window Counter     | Very Good         | Limited                  | Very Low (2 counters) | Low                 | Minor             | Scalable production    |

## Which One Should You Pick in 2026?

From my experiments and reading:
- **Default choice for most APIs** → **Sliding Window Counter** (best balance) or **Token Bucket** (if you want generous bursts)
- **Need bullet-proof fairness / no gaming possible** → **Sliding Window Log**
- **Downstream system hates bursts** → **Leaky Bucket**
- **Quick & dirty prototype** → **Fixed Window Counter** (but upgrade quickly)
- **Distributed high-scale** → Redis + Lua script with Sliding Window Counter or GCRA (a refined token-bucket variant)

## Closing Thoughts

Rate limiting turned out to be one of the most educational topics I’ve studied recently. It forced me to think deeply about time, state, fairness, and scale — all in one seemingly simple feature.

My biggest takeaway: **choose the algorithm based on what failure mode hurts your business most** — unfair bursts, memory explosion, cheating the limit, or latency jitter.

Next experiments on my list: implementing GCRA properly, trying adaptive rate limiting (based on CPU/load), and seeing how these behave under real abuse patterns.

If you’ve battled rate limiters in production — whether fighting 429s, tuning parameters, or surviving a scraping attack — I’d genuinely love to hear your story in the comments.

Thanks for reading this far — hope it saves someone a few late-night debugging sessions!

Happy building!  
Goutham  
February 2026, Kerala
