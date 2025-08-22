document.addEventListener('DOMContentLoaded', () => {
  let cursor;
  let isActive = false;

  // 실행
  function toggleCursor() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    removeStyles();
    removeCursor();
    removeEvents();
    isActive = false;

    if (isTouchDevice) return;

    addStyles();
    createCursor();
    addEvents();
    isActive = true;
  }

  // 기본 커서 없애는 스타일 토글
  function addStyles() {
    const style = document.createElement('style');
    style.id = 'cursor-style';
    style.textContent = `*, *:hover { cursor: none !important; }`;
    document.head.appendChild(style);
  }

  function removeStyles() {
    document.getElementById('cursor-style')?.remove();
  }

  // 커스텀 커서 요소 토글
  function createCursor() {
    cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.opacity = '0';
    document.body.appendChild(cursor);
  }

  function removeCursor() {
    cursor?.remove();
    cursor = null;
  }

  // 위치와 상태에 따른 스타일 변경
  function addEvents() {
    document.addEventListener('pointermove', updatePosition);
    document.addEventListener('pointerdown', () => cursor?.classList.add('click'));
    document.addEventListener('pointerup', () => cursor?.classList.remove('click'));
    document.body.addEventListener('pointerleave', () => cursor && (cursor.style.opacity = '0'));
    document.addEventListener('dragstart', e => e.preventDefault());
    document.querySelectorAll('a, button, [onclick], .thumbnail, .container__bio--info--email').forEach(el => {
      el.addEventListener('pointerenter', () => cursor?.classList.add('hover'));
      el.addEventListener('pointerleave', () => cursor?.classList.remove('hover'));
    });
  }

  function removeEvents() {
    document.removeEventListener('pointermove', updatePosition);
    window.removeEventListener('pointermove', updatePosition);
    window.removeEventListener('scroll', updatePosition);
  }

  function updatePosition(e) {
    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.opacity = '1';
    }
  }

  //함수 실행
  toggleCursor();
  updatePosition;
  window.addEventListener('resize', toggleCursor);
});