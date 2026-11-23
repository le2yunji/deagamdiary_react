# Cloudflare R2 전체 에셋 이전 Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 코드가 실제로 사용하는 정적 에셋을 문서화하고 Cloudflare R2로 이전한 뒤, 깨끗한 clone에서도 R2 주소만으로 서비스가 동작하게 한다.

**Architecture:** 사람이 검토할 수 있는 에셋 원본 목록을 JSON으로 두고, Node 스크립트가 크기·해시·Git 추적 여부를 계산해 인벤토리를 만든다. 같은 인벤토리를 업로드와 원격 검증에도 사용한다. React는 `getAssetUrl()`로 URL을 만들고, HTML은 빌드 환경변수 치환, CSS는 JavaScript가 주입한 CSS 사용자 지정 속성을 사용한다.

**Tech Stack:** React 18, React Three Fiber, Create React App 5, Node.js 내장 모듈, Node test runner, AWS CLI의 S3 호환 명령, Cloudflare R2

**Issue:** [#8 정적 자산 인벤토리 작성 및 R2 마이그레이션](https://github.com/le2yunji/deagamdiary_react/issues/8)

---

## 기준선

- 자동 테스트: 2 suites, 9 tests 통과
- 프로덕션 빌드: 통과
- 현재 빌드 폴더: 약 149 MiB
- 현재 빌드의 `assets` 폴더: 75개, 약 145 MiB
- 로컬 원본 전체: 182개, 약 264.45 MiB
- Node 버전 주의: 저장소는 Node 26을 요구하지만 현재 로컬은 Node 20.19.6이다. 최종 CI와 Vercel에서는 Node 26 결과도 확인한다.

## 공통 구현 규칙

- 새로 만들거나 수정하는 이름 있는 함수·컴포넌트·훅 위에 역할을 설명하는 `/** ... */` 주석을 단다.
- 테스트와 짧은 인라인 콜백은 함수 주석 대상에서 제외한다.
- 각 Task가 끝날 때 관련 테스트와 `git diff --check`를 실행한다.
- 사용자의 기존 작업 폴더는 에셋 원본을 읽는 용도로만 사용한다.
- R2 비밀키와 계정 식별자는 Git에 저장하지 않는다.

### Task 1: 에셋 목록 규칙과 검사기를 테스트로 고정

**Files:**

- Create: `config/r2-assets.json`
- Create: `scripts/lib/r2Assets.mjs`
- Create: `scripts/lib/r2Assets.test.mjs`
- Modify: `package.json`

**Step 1: 실패하는 단위 테스트 작성**

다음 동작을 Node test runner로 먼저 고정한다.

- 객체 키는 `assets/`로 시작해야 한다.
- `.DS_Store`는 목록에 들어갈 수 없다.
- 같은 객체 키를 두 원본이 사용하면 해시가 같을 때만 중복으로 인정한다.
- 같은 키인데 내용이 다르면 충돌로 실패한다.
- 파일 종류에 맞는 `Content-Type`을 계산한다.
- 실행 코드가 참조하는 경로가 목록에 없으면 실패한다.
- 주석과 테스트 fixture 속 경로는 실행 참조에서 제외한다.

Run: `node --test scripts/lib/r2Assets.test.mjs`

Expected: 구현 모듈이 없어 FAIL.

**Step 2: 최소 구현 작성**

`scripts/lib/r2Assets.mjs`에 작은 순수 함수로 구현한다.

```js
/** R2 객체 키가 허용된 assets 경로인지 검사한다. */
export function validateObjectKey(objectKey) {}

/** 파일 확장자를 브라우저 응답용 Content-Type으로 바꾼다. */
export function getContentType(filePath) {}

/** 원본 목록의 중복과 충돌을 검사한다. */
export function validateAssetEntries(entries) {}

/** 실행 소스에서 정적 에셋 참조를 추출한다. */
export function extractAssetReferences(source, filePath) {}
```

`config/r2-assets.json`에는 다음 상태를 구분한다.

- `required`: 실행 중 요청되는 파일
- `duplicate`: 같은 내용의 중복 원본
- `excluded`: 주석, 미사용 컴포넌트 또는 실제로 요청되지 않는 파일

각 필수 항목은 `sourcePath`, `objectKey`, `kind`를 가진다.

**Step 3: 테스트 통과 확인**

Run: `node --test scripts/lib/r2Assets.test.mjs`

Expected: PASS.

**Step 4: 프로젝트 테스트 명령에 포함**

`package.json`에 `test:assets`를 추가하고 `test:ci`가 Jest와 Node 테스트를 모두 실행하게 한다.

Run: `npm run test:ci`

Expected: 기존 9개와 새 인벤토리 테스트 모두 PASS.

**Step 5: 커밋**

```bash
git add config/r2-assets.json scripts/lib/r2Assets.mjs scripts/lib/r2Assets.test.mjs package.json
git commit -m "test: R2 에셋 목록 검증 규칙 추가"
```

### Task 2: 실제 인벤토리 생성

**Files:**

- Create: `scripts/generate-r2-asset-inventory.mjs`
- Create: `docs/assets/r2-asset-inventory.json`
- Modify: `config/r2-assets.json`
- Modify: `package.json`

**Step 1: 필수 에셋 원본 목록 채우기**

다음을 함께 대조해 `config/r2-assets.json`을 완성한다.

- `src`와 `public/index.html`의 실행 경로
- 동적으로 만들어지는 알바 포스터 GLB 5개
- `public/assets`와 `src/assets` 실제 파일
- `git ls-files` 결과

같은 객체 키를 가진 `src/assets`와 `public/assets` 파일의 내용이 다르면 실제 실행 경로를 기준으로 한 원본만 `required`로 선택한다. 다른 파일은 이유와 함께 `excluded`로 기록한다.

**Step 2: 생성기 테스트 추가**

임시 fixture에서 크기, SHA-256, Git 추적 상태가 기대한 값으로 생성되는 테스트를 먼저 실패시킨다.

**Step 3: 생성기 구현**

`R2_ASSET_SOURCE_ROOT`가 있으면 해당 저장소를 원본으로 읽고, 없으면 현재 저장소를 읽는다.

생성 결과에는 다음을 기록한다.

- `sourcePath`
- `objectKey`
- `kind`
- `size`
- `sha256`
- `gitTracked`
- `references`
- `status`

**Step 4: 실제 인벤토리 생성**

```bash
R2_ASSET_SOURCE_ROOT=/Users/2yunji/Desktop/deagamdiary_react npm run assets:inventory
```

Expected:

- 필수 원본 누락 0개
- 충돌 미해결 0개
- `.DS_Store` 포함 0개
- `docs/assets/r2-asset-inventory.json` 생성

**Step 5: 수동 검토**

- `subway.wepm`은 주석 속 오타로 분류한다.
- `Coffee.glb`, `escalator02.glb`처럼 미사용 파일의 참조는 실행 코드가 아닌지 확인한다.
- 필수 파일의 총 개수와 바이트 합계를 기록한다.

**Step 6: 커밋**

```bash
git add config/r2-assets.json scripts/generate-r2-asset-inventory.mjs scripts/lib/r2Assets.test.mjs docs/assets/r2-asset-inventory.json package.json
git commit -m "docs: R2 이전 에셋 인벤토리 추가"
```

### Task 3: 반복 가능한 R2 업로드와 검증 도구 추가

**Files:**

- Create: `scripts/upload-r2-assets.mjs`
- Create: `scripts/verify-r2-assets.mjs`
- Modify: `scripts/lib/r2Assets.mjs`
- Modify: `scripts/lib/r2Assets.test.mjs`
- Modify: `package.json`
- Modify: `.env.example`

**Step 1: 실패하는 명령 생성 테스트 작성**

자격 증명을 포함하지 않고 다음 값을 사용해 AWS CLI 인자를 만드는 테스트를 작성한다.

- 버킷: `i-am-talking-potato`
- 객체 키: 인벤토리의 `objectKey`
- endpoint: `R2_ENDPOINT_URL`
- `Content-Type`: 파일 종류별 값

**Step 2: 업로드 도구 구현**

업로드 도구는 다음 순서로 동작한다.

1. 원본 파일의 크기와 SHA-256을 인벤토리와 비교
2. 일치하는 파일만 `aws s3 cp`로 업로드
3. 실패한 파일이 하나라도 있으면 즉시 종료
4. 비밀 환경변수 값은 출력하지 않음

필요 환경변수 이름만 `.env.example`에 설명한다. 실제 값은 넣지 않는다.

**Step 3: 원격 검증 도구 구현**

`verify-r2-assets.mjs`는 공개 `r2.dev` URL에 `HEAD` 요청을 보내 다음을 확인한다.

- 상태 코드 200
- `Content-Length` 일치
- 기대한 `Content-Type`
- localhost와 Vercel origin에 대한 CORS 응답

**Step 4: 단위 테스트 실행**

Run: `npm run test:ci`

Expected: PASS.

**Step 5: 커밋**

```bash
git add scripts/upload-r2-assets.mjs scripts/verify-r2-assets.mjs scripts/lib/r2Assets.mjs scripts/lib/r2Assets.test.mjs package.json .env.example
git commit -m "feat: R2 에셋 업로드와 검증 도구 추가"
```

### Task 4: R2 자격 증명 생성과 필수 파일 업로드

**Files:**

- No repository file changes expected

**Step 1: Cloudflare에서 제한된 R2 API 토큰 준비**

`i-am-talking-potato` 버킷에만 객체 읽기·쓰기 권한이 있는 토큰을 만든다. 계정 전체 관리 권한은 주지 않는다.

**Step 2: 셸 세션에만 자격 증명 설정**

다음 값은 현재 셸 또는 사용자 자격 증명 저장소에만 둔다.

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `R2_ENDPOINT_URL`
- `R2_ASSET_SOURCE_ROOT`

**Step 3: 전체 업로드 실행**

Run: `npm run assets:upload`

Expected: 필수 항목 전체 업로드 성공, 실패 0개.

**Step 4: 공개 URL 검증**

Run: `npm run assets:verify-r2`

Expected: 모든 객체가 200이며 크기, Content-Type, CORS가 일치.

### Task 5: GLB 컴포넌트 경로를 공통 URL로 전환

**Files:**

- Modify: `src/components/AlbaBoard.jsx`
- Modify: `src/components/AlbaGamza.jsx`
- Modify: `src/components/AlbaPosters.jsx`
- Modify: `src/components/Bakery.jsx`
- Modify: `src/components/BakeryGamza.jsx`
- Modify: `src/components/BamGoguma.jsx`
- Modify: `src/components/Cafe.jsx`
- Modify: `src/components/CafeGamza.jsx`
- Modify: `src/components/ChatGPT.jsx`
- Modify: `src/components/Classroom.jsx`
- Modify: `src/components/ClassroomGamza.jsx`
- Modify: `src/components/Escalator.jsx`
- Modify: `src/components/File.jsx`
- Modify: `src/components/MailBox.jsx`
- Modify: `src/components/MailGamza.jsx`
- Modify: `src/components/Metro.jsx`
- Modify: `src/components/NomoneyGamza.jsx`
- Modify: `src/components/Onion.jsx`
- Modify: `src/components/Player.jsx`
- Modify: `src/components/PlayerController.jsx`

**Step 1: 실패하는 정적 검사 추가**

실행 대상 컴포넌트에 `useGLTF('/assets/...')`, `useGLTF.preload('/assets/...')`, loader의 원시 `/assets/...` 값이 남으면 실패하게 한다.

**Step 2: 각 파일에 URL 상수 추가**

```jsx
const BAKERY_MODEL_URL = getAssetUrl('/assets/models/Bakery.glb')
```

로딩과 preload는 같은 상수를 사용한다. `AlbaPosters`의 동적 목록도 각 결과에 `getAssetUrl()`을 적용한다.

수정하는 이름 있는 컴포넌트 위에는 역할 주석을 추가한다.

**Step 3: 검사와 기존 테스트 실행**

Run: `npm run test:ci`

Expected: GLB 원시 경로 0개, 전체 PASS.

**Step 4: 커밋**

```bash
git add src/components
git commit -m "refactor: GLB와 플레이어 에셋을 R2 URL로 전환"
```

### Task 6: 장면 이미지와 오디오 경로 전환

**Files:**

- Modify: `src/scenes/AlbaScene.jsx`
- Modify: `src/scenes/BakeryScene.jsx`
- Modify: `src/scenes/CafeScene.jsx`
- Modify: `src/scenes/ChatGPTScene.jsx`
- Modify: `src/scenes/ClassroomScene.jsx`
- Modify: `src/scenes/EscalatorScene.jsx`
- Modify: `src/scenes/MailScene.jsx`
- Modify: `src/scenes/MetroScene.jsx`
- Modify: `src/scenes/NomoneyScene.jsx`
- Modify: `src/components/Ground.jsx`

**Step 1: 실패하는 정적 검사 확장**

다음 API에 원시 `/assets/...`가 전달되면 실패하게 한다.

- `useTexture`
- `TextureLoader.load`
- `SVGLoader.load`
- 오디오 컴포넌트의 `url`
- JSX 이미지 `src`

**Step 2: 장면별 URL 상수와 배열 전환**

모든 경로는 모듈 상단에서 `getAssetUrl()`로 만든다. PPT·대화 이미지 배열도 변환된 URL 배열을 사용한다.

수정한 장면 컴포넌트와 이름 있는 보조 함수에 역할 주석을 추가한다.

**Step 3: 테스트 실행**

Run: `npm run test:ci`

Expected: 실행 장면의 원시 에셋 경로 0개, 전체 PASS.

**Step 4: 커밋**

```bash
git add src/scenes src/components/Ground.jsx
git commit -m "refactor: 장면 이미지와 오디오를 R2 URL로 전환"
```

### Task 7: HTML과 CSS 에셋 경로 전환

**Files:**

- Modify: `public/index.html`
- Modify: `src/index.css`
- Modify: `src/index.jsx`
- Create: `src/utils/assetStyles.js`
- Create: `src/utils/assetStyles.test.js`

**Step 1: CSS 변수 생성 테스트 작성**

`assetStyles.test.js`에서 가짜 root style 객체를 사용해 다음을 먼저 실패시킨다.

- 시작 버튼 이미지 URL 설정
- hover 이미지 URL 설정
- 노란 해·붉은 해 이미지 URL 설정
- 안내 버튼 두 개의 이미지 URL 설정
- 기본 URL이 비면 기존 `/assets/...` 주소 사용

**Step 2: CSS 변수 주입 구현**

```js
/** CSS 배경 이미지가 공통 에셋 기본 주소를 사용하도록 변수에 URL을 넣는다. */
export function applyAssetStyleVariables(root = document.documentElement) {}
```

`src/index.jsx`에서 React 렌더링 전에 한 번 호출한다. `src/index.css`는 `url(...)` 대신 주입된 `var(...)`를 사용한다.

**Step 3: HTML 경로 치환**

실행 중 사용하는 `src`와 소셜 미리보기 이미지를 다음 형태로 바꾼다.

```html
<source src="%REACT_APP_ASSET_BASE_URL%/assets/video/start.webm" type="video/webm" />
```

주석 처리된 지하철 영상의 `wepm` 오타 경로는 삭제하거나 정확한 설명만 남겨 실행 경로 검사에 잡히지 않게 한다.

**Step 4: 테스트와 빌드**

Run: `npm run test:ci && npm run build`

Expected: PASS. 빌드된 `index.html`에 `r2.dev` 기본 주소가 들어감.

**Step 5: 커밋**

```bash
git add public/index.html src/index.css src/index.jsx src/utils/assetStyles.js src/utils/assetStyles.test.js
git commit -m "refactor: HTML과 CSS 에셋을 R2 URL로 전환"
```

### Task 8: 로컬 배포 묶음에서 이전 에셋 제거

**Files:**

- Modify: `.gitignore`
- Delete: tracked files under `public/assets/`
- Delete: tracked files under `src/assets/`

**Step 1: R2 원격 검증 재실행**

Run: `npm run assets:verify-r2`

Expected: 전체 PASS. 실패하면 삭제하지 않는다.

**Step 2: 저장소 추적 파일 제거**

R2 검증을 통과한 파일만 Git에서 제거한다. `.gitignore`에는 `/public/assets/`와 `/src/assets/` 전체를 추가해 다시 커밋되지 않게 한다.

**Step 3: 깨끗한 작업 공간에서 테스트와 빌드**

Run:

```bash
npm run test:ci
npm run build
```

Expected:

- 전체 PASS
- `build/assets`가 없거나 비어 있음
- 기존 약 145 MiB의 에셋 복사가 사라짐
- JavaScript와 CSS 번들 생성 성공

**Step 4: 남은 경로 검사**

Run: `npm run assets:check`

Expected: 허용된 테스트·문서·미사용 코드 제외 항목 외 원시 에셋 경로 0개.

**Step 5: 커밋**

```bash
git add -A public/assets src/assets .gitignore
git commit -m "chore: 로컬 배포 에셋을 R2로 분리"
```

### Task 9: 브라우저 전체 스토리 검증

**Files:**

- Modify: `docs/assets/r2-asset-inventory.json` only if verified status is recorded

**Step 1: 로컬 서버 실행**

Node 26 환경에서 앱을 실행한다.

Run: `npm start`

**Step 2: Chrome Network와 Console 점검**

다음을 실제 화면에서 순서대로 확인한다.

1. 시작 영상
2. 시작·안내 버튼 이미지
3. 플레이어 이동과 GLB 애니메이션
4. 지하철, 카페, 교실, 알바, 베이커리, 우편, 잔고 부족, GPT, 에스컬레이터 장면
5. 장면별 음성·효과음
6. 엔딩 영상과 마지막 이미지

Expected:

- 이전 대상 요청 host가 모두 `pub-8f16ad22f2904f4fa68a2f18fd268daa.r2.dev`
- 404 없음
- CORS 오류 없음
- GLTF 파싱 오류 없음
- 이미지·오디오·영상 누락 없음

**Step 3: 캐시를 끈 첫 방문 기록**

Network에서 Disable cache를 켜고 첫 방문의 요청 수, 전송량, 주요 에셋 완료 시점을 기록한다. 이번 이슈는 이전 작업이므로 수치를 개선 성과로 과장하지 않고 다음 성능 이슈의 기준선으로 사용한다.

**Step 4: 최종 자동 검증**

Run:

```bash
npm run test:ci
npm run build
npm run assets:check
npm run assets:verify-r2
git diff --check
```

Expected: 모두 성공.

**Step 5: 검증 결과 커밋**

```bash
git add docs/assets/r2-asset-inventory.json
git commit -m "docs: R2 전체 에셋 검증 결과 기록"
```

### Task 10: PR 생성과 배포 검증

**Files:**

- No new source changes expected

**Step 1: 자체 코드 리뷰**

`main...HEAD` 전체 diff를 검토한다. 비밀키, R2 계정 자격 증명, 누락된 함수 주석, 불필요한 파일 삭제가 없는지 확인한다.

**Step 2: 브랜치 push와 PR 생성**

PR 본문에 다음을 포함한다.

- 이슈 #8 연결
- 변경 파일과 역할
- 인벤토리의 필수 파일 개수와 총 크기
- 테스트·빌드·R2·브라우저 검증 결과
- `r2.dev`는 임시이며 커스텀 도메인은 #16에서 연결한다는 기록

**Step 3: CI 확인**

Expected: 모든 GitHub Actions check 통과.

**Step 4: Vercel Preview 검증**

Preview origin이 R2 CORS 허용 목록에 없으면 Preview URL을 임시로 허용하거나 운영 Vercel origin에서만 최종 확인한다. 와일드카드 origin은 사용하지 않는다.

**Step 5: main 병합 뒤 운영 확인**

운영 배포에서 Network와 Console을 다시 확인한다. 정상 동작이 확인되면 이슈 #8을 닫는다.

