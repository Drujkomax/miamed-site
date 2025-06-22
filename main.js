// ----------------  UTILS  ----------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel, all=false) => all ? document.querySelectorAll(sel) : document.querySelector(sel);

// ----------------  MODAL -----------------
function openModal(id){
  $( `#${id}` ).classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(id){
  $( `#${id}` ).classList.remove('open');
  document.body.style.overflow='';
}

// закрытие по Esc / клику фона
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ $$('.modal.open',true).forEach(m=>closeModal(m.id)); }
});
$$('.modal',true).forEach(m=>m.addEventListener('click',e=>{
  if(e.target===m) closeModal(m.id);
}));

// ----------------  ROI CALCULATORS  ----------------
function initROI(calcEl){
  const price = calcEl.querySelector('input[id^="price"]');
  const proc  = calcEl.querySelector('input[id^="procedures"]');
  const out   = calcEl.querySelector('p[id^="roiResult"]');
  const priceVal = calcEl.querySelector('span[id^="priceValue"]');
  const procVal  = calcEl.querySelector('span[id^="proceduresValue"]');
  const monthly  = calcEl.querySelector('span[id^="monthlyProfit"]');
  const yearly   = calcEl.querySelector('span[id^="yearlyProfit"]');
  const MARGIN = 50; // $ маржа за процедуру

  function update(){
    priceVal.textContent = `$${Number(price.value).toLocaleString()}`;
    procVal.textContent  = proc.value;
    const months = Math.ceil((price.value*0.2)/(proc.value*MARGIN));
    out.textContent = `Окупаемость: ${months} мес.`;
    out.style.color = months<=6 ? '#00FF6A' : months<=12 ? '#FFC400' : '#FF4D4D';
    if(monthly && yearly){
      const monthlyProfit = proc.value*MARGIN;
      monthly.textContent = `$${Number(monthlyProfit).toLocaleString()}`;
      yearly.textContent  = `$${Number(monthlyProfit*12).toLocaleString()}`;
    }
  }
  price.addEventListener('input',update); proc.addEventListener('input',update);
  update();
}

let priceSlider, procSlider, marginSlider;
let priceInput, procInput, marginInput;

function updateROI(){
  const price  = +priceSlider.value;
  const procs  = +procSlider.value;
  const margin = +marginSlider.value;
  priceInput.value = price;
  procInput.value  = procs;
  marginInput.value = margin;
  const months = Math.ceil(price / (procs * margin));
  const monthly = procs * margin;
  const yearly = monthly * 12;
  document.getElementById('priceValue').textContent  = `$${price.toLocaleString()}`;
  document.getElementById('procValue').textContent   = procs;
  document.getElementById('marginValue').textContent = `$${margin}`;
  document.getElementById('roiMonths').textContent   = `Окупаемость: ${months} мес.`;
  document.getElementById('monthlyProfit').textContent = `Месячная прибыль: $${monthly.toLocaleString()}`;
  document.getElementById('yearlyProfit').textContent  = `Годовая прибыль: $${yearly.toLocaleString()}`;
}

// Инициализация базовых ROI-калькуляторов
document.addEventListener('DOMContentLoaded',()=>{
  // инициализируем базовые калькуляторы
  $$('.roi-calculator:not(.roi-advanced)',true).forEach(initROI);

  // продвинутый ROI-калькулятор
  if($('.roi-advanced')){
    priceSlider = document.getElementById('priceSlider');
    procSlider  = document.getElementById('procSlider');
    marginSlider = document.getElementById('marginSlider');
    priceInput  = document.getElementById('priceInput');
    procInput   = document.getElementById('procInput');
    marginInput = document.getElementById('marginInput');

    const pairs = [
      [priceSlider, priceInput],
      [procSlider,  procInput],
      [marginSlider, marginInput]
    ];
    pairs.forEach(([slider,input])=>{
      if(slider && input){
        slider.addEventListener('input',()=>{input.value=slider.value;updateROI();});
        input.addEventListener('input',()=>{slider.value=input.value;updateROI();});
      }
    });
    updateROI();
  }

let priceSlider, procSlider, marginSlider;
let priceInput, procInput, marginInput;

function updateROI() {
  if (!priceSlider || !procSlider || !marginSlider ||
      !priceInput || !procInput || !marginInput) return;

  const price  = +priceSlider.value;
  const procs  = +procSlider.value;
  const margin = +marginSlider.value;

  priceInput.value = price;
  procInput.value  = procs;
  marginInput.value = margin;

  const months = procs && margin ? Math.ceil(price / (procs * margin)) : 0;
  const monthly = procs * margin;
  const yearly = monthly * 12;

  const priceValue  = document.getElementById('priceValue');
  const procValue   = document.getElementById('procValue');
  const marginValue = document.getElementById('marginValue');
  const roiMonths   = document.getElementById('roiMonths');
  const monthlyProfit = document.getElementById('monthlyProfit');
  const yearlyProfit  = document.getElementById('yearlyProfit');

  if (priceValue)  priceValue.textContent  = `$${price.toLocaleString()}`;
  if (procValue)   procValue.textContent   = procs;
  if (marginValue) marginValue.textContent = `$${margin}`;
  if (roiMonths)   roiMonths.textContent   = `Окупаемость: ${months} мес.`;
  if (monthlyProfit) monthlyProfit.textContent = `Месячная прибыль: $${monthly.toLocaleString()}`;
  if (yearlyProfit)  yearlyProfit.textContent  = `Годовая прибыль: $${yearly.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Инициализация базовых калькуляторов
  $$('.roi-calculator:not(.roi-advanced)', true).forEach(initROI);

  // Инициализация продвинутого калькулятора
  const adv = $('.roi-advanced');
  if (adv) {
    priceSlider = document.getElementById('priceSlider');
    procSlider  = document.getElementById('procSlider');
    marginSlider = document.getElementById('marginSlider');
    priceInput  = document.getElementById('priceInput');
    procInput   = document.getElementById('procInput');
    marginInput = document.getElementById('marginInput');

    [
      [priceSlider, priceInput],
      [procSlider,  procInput],
      [marginSlider, marginInput]
    ].forEach(([slider, input]) => {
      if (slider && input) {
        slider.addEventListener('input', () => {
          input.value = slider.value;
          updateROI();
        });
        input.addEventListener('input', () => {
          slider.value = input.value;
          updateROI();
        });
      }
    });

    updateROI();
  }

  // ----------------  SMOOTH SCROLL (offset для fixed header) -------------
  $$('a[href^="#"]',true).forEach(a=>{
    a.addEventListener('click',e=>{
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target){
        e.preventDefault();
        window.scrollTo({top:target.offsetTop-70,behavior:'smooth'});
      }
    });
  });

  // ----------------  REVEAL ON SCROLL  ----------------
  const io = new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('visible');
        io.unobserve(ent.target);
      }
    });
  },{threshold:.2});
  $$('.reveal',true).forEach(el=>io.observe(el));

  // ----------------  LOTTIE  ----------------
  const canvas = $('#lottie-heart');
  if(canvas){
    try{
      import('https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js')
        .then((module)=>{ // Access the entire module
          module.loadAnimation({ // Access loadAnimation directly from the module
            container:canvas,
            renderer:'canvas',
            loop:true,
            autoplay:true,
            path:canvas.dataset.src
          });
        });
      }catch(err){console.warn('Lottie load error',err);}
    }
  })