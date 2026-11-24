import { getAssetUrl } from "./assetUrl";

const ASSET_STYLE_PATHS = {
  "--start-screen-button-image": "/assets/images/start_button.png",
  "--start-screen-button-hover-image": "/assets/images/start_button_hover.png",
  "--start-button-yellow-image": "/assets/images/yellowsun.png",
  "--start-button-red-image": "/assets/images/redsun.png",
  "--start-guide-button-one-image": "/assets/images/guide_btn1.png",
  "--start-guide-button-two-image": "/assets/images/guide_btn2.png",
};

/** CSS 배경 이미지가 공통 에셋 기본 주소를 사용하도록 변수에 URL을 넣는다. */
export function applyAssetStyleVariables(
  root = document.documentElement,
  baseUrl = import.meta.env.VITE_ASSET_BASE_URL,
) {
  Object.entries(ASSET_STYLE_PATHS).forEach(([property, path]) => {
    root.style.setProperty(property, `url("${getAssetUrl(path, baseUrl)}")`);
  });
}
