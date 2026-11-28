# Dead Code Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 동작을 유지하면서 확실한 미사용 코드와 옛 주석 코드를 제거한다.

**Architecture:** 실행 진입점 기준의 import 도달성 검사와 ESLint `no-unused-vars` 결과를 삭제 근거로 사용한다. 동작 변경 가능성이 있는 Hook 경고, 에셋, 패키지 정리는 별도 작업으로 남긴다.

**Tech Stack:** React 18, Create React App, JavaScript/JSX, ESLint

**Spec:** `docs/superpowers/specs/2026-11-23-dead-code-cleanup-design.md`

## Global Constraints

- 기존 사용자 변경을 보존한다.
- 실행 동작을 바꾸지 않는다.
- 이유를 설명하는 주석은 남긴다.
- Hook 의존성, 에셋, npm 의존성은 수정하지 않는다.

## Review Focus

- 모든 장면 모듈이 `src/index.jsx`에서 계속 도달 가능해야 한다.
- 카메라 전환과 장면 전환용 prop 전달이 유지되어야 한다.
- 오디오 플레이어와 3D 모델 preload 호출이 유지되어야 한다.
- 사용자 작업 중인 파일의 동작 코드가 삭제되지 않아야 한다.
- ESLint의 기존 Hook 경고 외에 새 오류가 생기지 않아야 한다.

---

### Task 1: Remove unreachable modules and archived code

**Files:**
- Delete: `src/start.jsx`
- Delete: `src/components/Emotion.jsx`
- Delete: `src/components/Coffee.jsx`
- Delete: `src/components/NomoneyBank.jsx`
- Delete: `src/components/dom/MovinDom.jsx`
- Modify: `src/Scene.jsx`
- Modify: `src/components/Ground.jsx`
- Modify: `src/utils/Common.jsx`

**Interfaces:**
- Consumes: current `src/index.jsx` import graph
- Produces: the same reachable runtime module graph without unreachable modules

- [x] Remove unreachable files and commented-out archived implementations.
- [x] Run ESLint and confirm the previous `no-undef` error is gone.

### Task 2: Remove unused bindings

**Files:**
- Modify: files reported by ESLint `no-unused-vars`

**Interfaces:**
- Consumes: ESLint `no-unused-vars` findings
- Produces: equivalent runtime code without unused imports, state, refs, and helpers

- [x] Remove each unused binding without changing used siblings.
- [x] Run ESLint and confirm `no-unused-vars` reports zero findings.

### Task 3: Verify behavior-preserving cleanup

**Files:**
- Verify: all changed source files

**Interfaces:**
- Consumes: cleaned source tree
- Produces: verification evidence and a reviewable diff

- [x] Run ESLint and record the remaining warning categories.
- [x] Run the non-watch test command. (React 테스트 12개와 에셋 테스트 22개 통과.)
- [x] Run the production build with output directed outside the workspace. (임시 폴더 빌드 성공.)
- [x] Review the final diff for accidental behavior changes.
