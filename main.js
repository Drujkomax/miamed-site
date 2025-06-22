/* =========================================================================
   main.js — MiaMed landing (rewrite · 24-06-2025)  •  Часть 1/3
   -------------------------------------------------------------------------
   01) Утилиты селекторов / событий
   02) Модальные окна (open / close / Esc / клик-фон)
   03) Базовые ROI-калькуляторы  (2 ползунка, фикс-маржа $50)
   04) DOM-ready: инициализация simple ROI
   -------------------------------------------------------------------------
   Продолжение (advanced ROI, smooth-scroll, reveal-animation, burger-menu,
   Lottie и прочее) будет в Части 2.
   =========================================================================*/
(() => {
  'use strict';

  /* ---------- 01.  UTILS -------------------------------------------- */
  const $  = (sel)             => document.querySelector(sel);
  const $$ = (sel, all = false) =>
    all ? document.querySelectorAll(sel) : document.querySelector(sel);

  /* ---------- 02.  MODALS ------------------------------------------- */
  function openModal(id) {
    const m = $('#' + id);
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const m = $('#' + id);
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Esc-закрытие и клик по фону
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
      $$('.modal.open', true).forEach((m) => closeModal(m.id));
  });
  $$('.modal', true).forEach((m) =>
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m.id);
    })
  );

  /* ---------- 03.  SIMPLE ROI (2-slider) ---------------------------- */
  const FIX_MARGIN = 50; // $ за процедуру

  function initSimpleROI(calc) {
    if (!calc) return;

    // элементы
    const priceSlider = calc.querySelector('input[id^="price"]');
    const procSlider  = calc.querySelector('input[id^="procedures"]');
    const priceValEl  = calc.querySelector('span[id^="priceValue"]');
    const procValEl   = calc.querySelector('span[id^="proceduresValue"]');
    const resultEl    = calc.querySelector('p[id^="roiResult"]');

    // расчёт + вывод
    const render = () => {
      const price = +priceSlider.value;
      const procs = +procSlider.value;
      const months = Math.ceil(price / (procs * FIX_MARGIN));

      priceValEl.textContent = `$${price.toLocaleString()}`;
      procValEl.textContent  = procs;

      resultEl.textContent = `Окупаемость: ${months} мес.`;
      resultEl.style.color =
        months <= 6 ? '#00FF6A' : months <= 12 ? '#FFC400' : '#FF4D4D';
    };

    // слушатели
    priceSlider.addEventListener('input', render);
    procSlider .addEventListener('input', render);

    render(); // первый запуск
  }

  /* ---------- 04.  DOM READY --------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // инициализируем ВСЕ калькуляторы без класса .roi-advanced
    $$('.roi-calculator:not(.roi-advanced)', true).forEach(initSimpleROI);

    /* ---------------------------------------------------------------
       advanced ROI, scroll-helpers, анимации и прочее подключим дальше
       (в Части 2/3).
    --------------------------------------------------------------- */
  });
})();
/* =========================================================================
   main.js — MiaMed landing (rewrite · 24-06-2025)  •  Часть 2/3
   -------------------------------------------------------------------------
   05) Advanced ROI-калькулятор (3 ползунка + inputs)
   06) Smooth-scroll c учётом фикс-хедера
   07) Анимация «reveal on scroll»
   08) Burger-меню + mobile-nav
   09) Загрузка Lottie-анимации (canvas)
   -------------------------------------------------------------------------
   Часть 3 (если будет нужна) — дополнительные виджеты, lazy-video и т.д.
   =========================================================================*/
(() => {
  'use strict';

  /* ---------- 05. ADVANCED ROI (3-slider) --------------------------- */
  function initAdvancedROI(box) {
    if (!box) return;

    // range-inputs
    const sPrice  = $('#priceSlider');
    const sProc   = $('#procSlider');
    const sMargin = $('#marginSlider');

    // number-inputs (если есть)
    const nPrice  = $('#priceInput');
    const nProc   = $('#procInput');
    const nMargin = $('#marginInput');

    // выводы
    const oPriceVal  = $('#priceValue');
    const oProcVal   = $('#procValue');
    const oMarginVal = $('#marginValue');
    const oMonths    = $('#roiMonths');
    const oMonthly   = $('#monthlyProfit');
    const oYearly    = $('#yearlyProfit');

    // sync helper
    const sync = (src, dest) => dest && (dest.value = src.value);

    const render = () => {
      const price  = +sPrice.value;
      const procs  = +sProc.value;
      const margin = +sMargin.value;

      const months  = procs && margin ? Math.ceil(price / (procs * margin)) : 0;
      const monthly = procs * margin;
      const yearly  = monthly * 12;

      oPriceVal .textContent = `$${price.toLocaleString()}`;
      oProcVal  .textContent = procs.toLocaleString();
      oMarginVal.textContent = `$${margin}`;

      oMonths .textContent = `Окупаемость: ${months} мес.`;
      oMonthly.textContent = `Месячная прибыль: $${monthly.toLocaleString()}`;
      oYearly .textContent = `Годовая прибыль: $${yearly.toLocaleString()}`;

      // цветовая индикация
      oMonths.classList.remove('green','yellow','red');
      oMonths.classList.add(months<=6?'green':months<=12?'yellow':'red');
    };

    // listeners: range
    [sPrice, sProc, sMargin].forEach((el) =>
      el.addEventListener('input', () => {
        sync(el, {price:nPrice, proc:nProc, margin:nMargin}[el.dataset.sync]);
        render();
      })
    );
    // listeners: number-inputs
    [nPrice, nProc, nMargin].forEach((el) =>
      el &&
      el.addEventListener('input', () => {
        sync(el, {price:sPrice, proc:sProc, margin:sMargin}[el.dataset.sync]);
        render();
      })
    );

    render(); // первоначальный расчёт
  }

  /* ---------- 06. Smooth-scroll ------------------------------------ */
  function initSmoothScroll() {
    const headerHeight = 70;
    $$('a[href^="#"]', true).forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const offset = target.getBoundingClientRect().top + scrollY - headerHeight;
          window.scrollTo({ top: offset, behavior: 'smooth' });
          // закрываем моб.-меню
          closeMobileNav();
        }
      });
    });
  }

  /* ---------- 07. Reveal-animation --------------------------------- */
  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add('visible');
            io.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    $$('.reveal', true).forEach((el) => io.observe(el));
  }

  /* ---------- 08. Burger & mobile nav ------------------------------ */
  const burger     = $('.burger');
  const mobileNav  = $('.mobile-nav');
  function toggleMobileNav() {
    burger?.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open')
      ? 'hidden'
      : '';
  }
  function closeMobileNav() {
    burger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }
  burger?.addEventListener('click', toggleMobileNav);

  /* ---------- 09. Lottie-animation --------------------------------- */
  function initLottie() {
    const canvas = document.querySelector('[data-lottie]');
    if (!canvas) return;
    import('https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js')
      .then((lottie) =>
        lottie.loadAnimation({
          container: canvas,
          renderer: 'canvas',
          loop: true,
          autoplay: true,
          path: canvas.dataset.lottie
        })
      )
      .catch((err) => console.warn('Lottie error', err));
  }

  /* ---------- DOM READY (part 2) ----------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const advBox = document.querySelector('.roi-calculator.roi-advanced');
    initAdvancedROI(advBox);
    initSmoothScroll();
    initReveal();
    initLottie();
  });
})();
/* =========================================================================
   main.js — MiaMed landing (rewrite · 24-06-2025)  •  Часть 3/3
   -------------------------------------------------------------------------
   10) YouTube-Lazy-Embed (poster → iframe on click)
   11) AJAX-форма консультации (fetch, no-refresh, basic validation)
   12) Sticky-header shadow при скролле
   13) Countdown-таймер «Акция до конца месяца»
   -------------------------------------------------------------------------
   На этом функционал лендинга закрыт; при новых требованиях можно расширять.
   =========================================================================*/
(() => {
  'use strict';

  /* ---------- 10. Lazy YouTube embeds ------------------------------ */
  function initLazyVideos() {
    $$('.yt-lazy', true).forEach((wrap) => {
      const id = wrap.dataset.id;
      if (!id) return;
      // Плашка-постер
      wrap.innerHTML = `
        <div class="yt-thumb" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)">
          <button aria-label="Play video"></button>
        </div>`;
      wrap.addEventListener('click', () => {
        wrap.innerHTML = `
          <iframe
            src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="YouTube video"></iframe>`;
      });
    });
  }

  /* ---------- 11. AJAX-Lead-Form ----------------------------------- */
  function initLeadForm() {
    const form = document.querySelector('#leadForm');
    if (!form) return;

    const status = form.querySelector('.form-status');

    const validate = () => {
      const required = [...form.querySelectorAll('[data-required]')];
      return required.every((el) => el.value.trim().length);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) {
        status.textContent = 'Пожалуйста, заполните все обязательные поля.';
        status.classList.add('error');
        return;
      }
      status.textContent = 'Отправка…';
      status.classList.remove('error');

      try {
        const fd = new FormData(form);
        //  🔒  Замените URL API на свой энд-пойнт
        const resp = await fetch('https://example.com/api/lead', {
          method: 'POST',
          body: fd
        });
        if (!resp.ok) throw new Error(resp.statusText);
        form.reset();
        status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      } catch (err) {
        console.warn(err);
        status.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
        status.classList.add('error');
      }
    });
  }

  /* ---------- 12. Sticky header shadow ----------------------------- */
  function initHeaderShadow() {
    const header = document.querySelector('.header');
    if (!header) return;
    const toggle = () =>
      header.classList.toggle('scrolled', window.scrollY > 10);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ---------- 13. Countdown timer ---------------------------------- */
  function initCountdown() {
    const box = document.querySelector('[data-countdown]');
    if (!box) return;
    const target = new Date(box.dataset.countdown); // формат YYYY-MM-DD
    const spans = {
      days   : box.querySelector('.cd-days'),
      hours  : box.querySelector('.cd-hours'),
      minutes: box.querySelector('.cd-minutes'),
      seconds: box.querySelector('.cd-seconds')
    };
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return clearInterval(int);
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      spans.days.textContent    = String(d).padStart(2, '0');
      spans.hours.textContent   = String(h).padStart(2, '0');
      spans.minutes.textContent = String(m).padStart(2, '0');
      spans.seconds.textContent = String(s).padStart(2, '0');
    };
    tick();
    const int = setInterval(tick, 1000);
  }

  /* ---------- DOM READY (part 3) ----------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLazyVideos();
    initLeadForm();
    initHeaderShadow();
    initCountdown();
  });
})();
