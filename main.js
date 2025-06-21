function add(a, b) {
  return Number(a) + Number(b);
}

function setup() {
  const btn = document.getElementById('add-btn');
  const num1 = document.getElementById('num1');
  const num2 = document.getElementById('num2');
  const result = document.getElementById('result');

  if (btn && num1 && num2 && result) {
    btn.addEventListener('click', () => {
      result.textContent = add(num1.value, num2.value);
    });
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', setup);
}

if (typeof module !== 'undefined') {
  module.exports = { add };
}
