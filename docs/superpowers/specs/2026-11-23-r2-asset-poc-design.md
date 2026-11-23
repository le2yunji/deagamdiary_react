# Cloudflare R2 Asset PoC Design

## Intent

Vercel 재배포에 포함되지 않는 필수 GLB를 Cloudflare R2에서 안정적으로 제공할 수 있는지 작은 범위로 검증한다.

## Current state

- Cloudflare에 Standard 등급의 `i-am-talking-potato` 버킷이 이미 있다.
- 버킷은 비어 있고 공개 접근은 꺼져 있다.
- Cloudflare에 등록된 도메인은 없다.
- 프로젝트는 `/assets/models/Gamza_cycle.glb`를 Vercel 정적 파일로 요청한다.

## Goals

- `Gamza_cycle.glb` 한 개를 `assets/models/Gamza_cycle.glb` 키로 업로드한다.
- 임시 `r2.dev` 공개 주소로 GET 요청이 성공하게 한다.
- localhost와 Vercel 운영 origin에서 브라우저 CORS 요청을 허용한다.
- React 코드가 환경변수 기반 에셋 주소를 사용하도록 한다.
- URL, Content-Type, CORS 헤더와 3D 모델 표시를 검증한다.

## Non-goals

- 이번 PoC에서 나머지 GLB, 이미지, 영상, 오디오를 이전하지 않는다.
- 커스텀 도메인을 구매하거나 연결하지 않는다.
- Worker, 서명 URL, 비공개 다운로드 기능을 추가하지 않는다.
- R2 API 토큰이나 비밀키를 프론트엔드 또는 Git에 저장하지 않는다.

## Approach

기존 버킷의 `r2.dev` 공개 개발 URL을 잠시 활성화한다. `REACT_APP_ASSET_BASE_URL`과 작은 URL 헬퍼를 추가해 `Player` 모델 한 개만 R2로 전환한다. 경로 구조를 `assets/...`로 유지해 이후 전체 이전 시 코드 변경을 최소화한다.

`r2.dev`는 개발용이며 캐시와 운영 기능이 제한된다. PoC가 통과하면 #8에서 전체 에셋을 이전하고, 도메인을 확보한 뒤 같은 환경변수 값만 `https://assets.<domain>`으로 교체한다.

## Security and rollback

- 공개 권한은 객체 읽기에만 사용하고 업로드 자격 증명은 브라우저에 노출하지 않는다.
- CORS는 `GET`과 `HEAD`만 허용하고 허용 origin을 명시한다.
- 실패하면 `REACT_APP_ASSET_BASE_URL`을 비우고 R2 공개 접근을 끄면 기존 `/assets/...` 경로로 돌아간다.

## Official sources

- Public buckets: https://developers.cloudflare.com/r2/buckets/public-buckets/
- CORS: https://developers.cloudflare.com/r2/buckets/cors/
- Pricing: https://developers.cloudflare.com/r2/pricing/
