# AI Agent vs Human Tester — Critical Review
**Project:** SauceDemo E-Commerce QA Upskilling  
**Author:** Beta Ninjas QA Team  
**Date:** 2026-04-24  
**Scope:** Day 1 (manual + scripted automation) vs Day 2 (Playwright MCP + LLM-generated tests)

---

## 1. Coverage Comparison

| Area | Human / Scripted (Day 1) | AI Agent — Playwright MCP (Day 2) |
|------|--------------------------|-----------------------------------|
| Happy path login | ✅ Covered | ✅ Covered |
| Invalid login (6 combinations) | ✅ Parameterised | ✅ Covered |
| Sort all 4 options | ✅ Covered | ✅ Covered |
| Add / remove all 6 products | ✅ Covered | ✅ Covered |
| Full checkout flow | ✅ Covered | ✅ Covered |
| UX copy observations | ❌ Not captured | ✅ "Swag Labs" title mismatch, "pony" copy |
| Silent redirect (no error msg) | ❌ Assertion only | ✅ Flagged as UX gap |
| Floating-point display bug | ❌ Missed entirely | ✅ Caught live on order summary |
| Sort reset after cart return | ❌ Not asserted | ✅ Observed and flagged |
| Zip field accepts any string | ❌ Not tested | ✅ Flagged as UX gap |
| Accessibility (placeholder labels) | ❌ Not covered | ✅ Noted during live session |

**Verdict:** AI agent covered a broader surface area. Scripted tests covered the same functional assertions but missed all UX friction and the floating-point bug — because those were never written as assertions.

---

## 2. AI Agent Strengths

**Reads the page like a human.**  
The MCP session noticed the `$121949999999999` floating-point display error on the order summary because Claude read the visible text, not just asserted a pre-known value. A scripted test only catches what it was told to look for.

**Generates observations beyond pass/fail.**  
In 11 steps, the agent produced 12 UX friction items — copy issues, missing validation, accessibility gaps — none of which would appear in a traditional assertion-based suite.

**Adapts in real time.**  
When standard `.click()` didn't trigger button handlers, the agent automatically switched to JavaScript `dispatchEvent()`. A static script would have simply failed.

**Translates natural language to actions instantly.**  
No test code was written. A plain English charter was enough to drive a full browser session — dramatically lowering the barrier for non-technical testers to participate.

**Speed of test generation.**  
`edge-cases.spec.ts` — 18 tests across 3 feature areas — was generated from the PRD in minutes. Writing those tests manually would take hours.

---

## 3. AI Agent Failures

**Hallucination risk on selectors.**  
When given only a PRD (no existing code), an LLM will guess selectors. Common wrong guesses: `#username` instead of `[data-test="username"]`, `.cart-icon` instead of `.shopping_cart_link`, `price-low-high` instead of `lohi`. In this project, hallucinations were avoided because the LLM had access to the Page Object Model — but in a greenfield project that safety net does not exist.

**Cannot judge business intent.**  
The agent flagged "Free Pony Express Delivery!" as a UX confusion risk. But a human tester with domain knowledge would immediately recognise this as intentional demo humour. AI has no way to distinguish intentional quirk from genuine defect without explicit context.

**Approval interruptions in CLI.**  
Running the MCP charter required repeated manual approvals per tool type (`browser_navigate`, `browser_click`, etc.). This breaks the "hands-free" promise of AI testing and slows sessions down significantly until permissions are configured.

**No memory across sessions.**  
Each MCP session starts fresh. A human tester remembers "last time this broke on slow networks" — the agent has no such institutional memory unless it is explicitly given prior session notes.

**Over-verbose output.**  
The MCP session produced a very long chat transcript. Useful information (the floating-point bug, the sort reset) was buried inside 11 steps of narration. A human tester would write a concise bug ticket immediately.

---

## 4. Generated Test Quality

| Metric | Result |
|--------|--------|
| Tests generated | 18 |
| Tests passing | 18 (100%) |
| Tests failing | 0 |
| Hallucinated selectors | 0 |
| Flaky tests | 0 |
| Missing edge cases | Whitespace-only field validation, mobile viewport, back-button on checkout step 2 |

**Why 100% pass rate?**  
The LLM generated tests using the existing POM which contained correct selectors. This is the key limitation — the test quality depends entirely on the quality of context given. A PRD-only generation without page objects would have produced selector failures and required a correction loop.

**What the LLM got right:**  
- Correct sort option values (`lohi`, `hilo`, `za`, `az`) — non-obvious values not in the PRD
- Correct `data-test` attribute usage throughout
- Appropriate timeout extension (15s) for `performance_glitch_user`
- Correct assertion logic for badge count increments

**What the LLM missed:**  
- No whitespace-only field validation tests (PRD mentions it as an edge case)
- No back-button checkout navigation test
- No mobile viewport coverage

---

## 5. Verdict — Where Would You Trust an Agent vs a Human?

| Scenario | Trust Agent | Trust Human |
|----------|------------|-------------|
| Regression suite on a stable app | ✅ | |
| Generating test cases from a PRD | ✅ | |
| Running a full happy-path check overnight | ✅ | |
| Spotting visual UX friction | ✅ (with MCP) | ✅ |
| Catching floating-point display bugs | ✅ (MCP reads page) | ✅ |
| Judging business intent vs genuine bug | | ✅ |
| Exploratory testing on a brand-new feature | Partial | ✅ |
| Security / penetration testing | | ✅ |
| Accessibility deep audit | | ✅ |
| Greenfield test generation (no existing selectors) | ⚠️ Review required | ✅ |
| Debugging a flaky test | | ✅ |

**Bottom line:**

> Trust the agent for **speed and scale** — generating suites, running regression, covering happy paths, and reading visible page content during exploratory sessions.  
> Trust the human for **judgement** — deciding if a bug matters, understanding business context, deep accessibility review, and validating anything the agent generated before shipping it.  
>  
> The most effective QA team uses both: **AI generates and runs, human reviews and decides.**
