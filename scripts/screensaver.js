let idleTimer;
const idleDelay = 1000 * 3; // 대기시간
const main = document.querySelector('main');
const screensaver = document.createElement('div');
screensaver.id = 'screensaver';
main.appendChild(screensaver);

const shapeCount = 30;   // 최대 개수
const cellSize = 180;    // 개별 이미지 크기
let cells = [];
let saverInterval;

// 도형 파일
const scriptPath = document.currentScript.src;  // 현재 JS 파일 URL
const basePath = scriptPath.replace(/screensaver\.js$/, '../assets/shapes/'); 

const shapes = Array.from({ length: 25 }, (_, i) =>
  `${basePath}shape_${String(i+1).padStart(2, "0")}.svg`
);

// SVG 캐시
const svgCache = {}; // URL -> SVG Element

// 랜덤 색상
function randomColor() {
  const h = Math.random() * 360;
  return `oklch(80% 0.2 ${h})`;
}

// 그리드 초기화
function initGrid() {
  const preCols = Math.floor(main.clientWidth / cellSize);
  const cols = main.clientWidth / preCols;
  const rows = Math.floor(main.clientHeight / cellSize);
  cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < preCols; c++) {
      cells.push({ r, c, used: false, size: cols });
    }
  }
}

// 영역 제한(스크롤 대응)
function updateScreensaverBounds() {
  const rect = main.getBoundingClientRect();
  screensaver.style.position = 'fixed';
  screensaver.style.top = `${rect.top}px`;
  screensaver.style.left = `${rect.left}px`;
  screensaver.style.width = `${rect.width}px`;
  screensaver.style.height = `${rect.height}px`;
}

// 랜덤 칸 선정
function getRandomCell() {
  const empty = cells.filter(cell => !cell.used);
  if (empty.length === 0) return null;
  const chosen = empty[Math.floor(Math.random() * empty.length)];
  chosen.used = true;
  return chosen;
}

// 랜덤 도형 생성
function addRandomShape() {
  if (screensaver.querySelectorAll(".shape").length >= shapeCount) return;
  const shapeUrl = shapes[Math.floor(Math.random() * shapes.length)];
  const cell = getRandomCell();
  if (!cell || !svgCache[shapeUrl]) return;

  const svgEl = svgCache[shapeUrl].cloneNode(true);   // 캐시에서 복제
  svgEl.classList.add("shape");

  const size = cell.size - 10;
  svgEl.style.position = "absolute";
  svgEl.style.left = `${cell.c * cell.size + 10}px`;
  svgEl.style.top = `${cell.r * cell.size + 10}px`;
  svgEl.style.width = `${size}px`;
  svgEl.style.height = `${size}px`;

  // 랜덤 색상
  const fillColor = randomColor();
  svgEl.querySelectorAll("*").forEach(el => {
    if (el.tagName !== "svg") el.setAttribute("fill", fillColor);
  });

  screensaver.appendChild(svgEl);
}

// 화면보호기 시작
function startScreensaver() {
  initGrid();
  updateScreensaverBounds();
  screensaver.innerHTML = "";
  screensaver.style.opacity = "1";
  saverInterval = setInterval(addRandomShape, 4000);
}

// 화면보호기 종료
function stopScreensaver() {
  screensaver.style.opacity = "0";
  screensaver.innerHTML = "";
  clearInterval(saverInterval);
}

// 타이머 초기화
function resetIdleTimer() {
  clearTimeout(idleTimer);
  stopScreensaver();
  idleTimer = setTimeout(startScreensaver, idleDelay);
}

// SVG 프리로드
async function preloadSVGs() {
  for (const shapeUrl of shapes) {
    try {
      const res = await fetch(shapeUrl);                   // SVG 불러오기
      const text = await res.text();                       // 텍스트로 가져오기
      const parser = new DOMParser();                      // DOM 변환 준비
      const svgDoc = parser.parseFromString(text, "image/svg+xml"); // SVG로 파싱
      svgCache[shapeUrl] = svgDoc.documentElement.cloneNode(true); // 캐시에 저장
    } catch (err) {
      console.error("SVG preload failed:", shapeUrl, err);
    }
  }
}

// 활동 이벤트 시 초기화
["pointermove", "pointerdown", "keydown", "touchstart"].forEach(evt =>
  document.addEventListener(evt, resetIdleTimer)
);
window.addEventListener('resize', resetIdleTimer);

window.addEventListener("DOMContentLoaded", async () => {
  await preloadSVGs(); 
  resetIdleTimer(); // 초기 실행
});
