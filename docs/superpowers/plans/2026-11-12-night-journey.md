# Infinite Train Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Deliver an original explorable pixel-art train and a reviewable GitHub PR.
**Architecture:** A static ES-module app separates carriage/voting data, pure vote helpers, scene rendering, and accessible DOM controls.
**Tech Stack:** HTML, CSS, Canvas 2D, Node test runner, Playwright for browser verification.
**Spec:** ../../design.md

## Global Constraints
- No runtime dependencies; work under a GitHub Pages subpath.
- Never mix demo and public votes or claim unavailable counts are zero.
- Preserve unrelated repository content; feature branch and PR only.
- Italian UI; touch, keyboard, reduced-motion and storage-error support.

## Review Focus
- Malformed saved votes must not grant arbitrary counts (unit tests).
- Network failure must never silently substitute sample scores (unit/browser tests).
- Navigating by keyboard must not hijack typing or modal focus (browser tests).
- Narrow screens must retain all actions without page overflow (browser tests).
- Scene loops must stop while hidden/paused and under reduced motion (browser tests).

### Task 1: Vote model and catalog
Files: src/model.js, src/catalog.js, tests/model.test.js, package.json.
Interfaces: readVotes(storage, ids), toggleVote(votes, id, ids), rankCars(cars, votes), fetchPublicVotes(cars, fetcher).
- [ ] Write failing Node tests for safe local votes, ranking/ties and independent public counts.
- [ ] Run npm test, observe missing implementation failure.
- [ ] Implement helpers and four-car catalog; run npm test to green.

### Task 2: Explorable scene and accessible controls
Files: index.html, styles/tokens.css, styles/app.css, src/scene.js, src/app.js, tests/browser.spec.js, playwright.config.js.
Interfaces: Scene(canvas, cars, onSelect), select(id), setPaused(value), setDawn(value). DOM controls use catalog ids and vote model functions.
- [ ] Add browser tests for navigation, demo persistence, public separation, responsive controls and dialogs; observe failure before app exists.
- [ ] Implement original pixel scenery and carriage interiors, responsive shell, vote modes and contribution dialog.
- [ ] Run unit/browser tests and inspect desktop/mobile screenshots; correct supported defects.

### Task 3: Review and delivery
Files: README.md, CONTRIBUTING.md, .github/ISSUE_TEMPLATE/carriage.yml, .github/workflows/check.yml, docs/verification.md.
- [ ] Document run/deploy, vote activation and contribution steps; add CI.
- [ ] Run audit, syntax/behavior tests and visual checks; fresh review and fix material defects.
- [ ] Commit, create remote branch and PR toward main; verify remote changes and report PR or concrete permission limit.
