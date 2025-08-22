const email = document.querySelector('.container__bio--info--email');
const originalText = email.textContent;

// 기존 너비
const rect = email.getBoundingClientRect();
email.style.width = rect.width + 'px';

// 호버
email.addEventListener('mouseenter', () => {
  email.textContent = "Click to copy!";
  email.style.textAlign = 'center';
  email.style.fontWeight = '700';
});

email.addEventListener('mouseleave', () => {
  email.textContent = originalText;
  email.style.textAlign = 'left';
  email.style.fontWeight = '400';
});

// 복사
email.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(originalText);
    console.log('Email copied:', originalText);
    email.textContent = "Copied!";
  } catch (err) {
    console.error('Email copy failed: ', err);
  }
});
