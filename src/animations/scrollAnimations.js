import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, Flip, Observer);

// Split helpers (stand-in for original Jt/SplitType usage in the bundle)
function splitWords(el) {
  if (!el || el.dataset.splitWords === "1")
    return el?.querySelectorAll?.(".word") || [];
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  el.innerHTML = text
    .split(" ")
    .map(
      (w) =>
        `<span class="word" style="display:inline-block;will-change:transform,opacity,filter">${w}&nbsp;</span>`,
    )
    .join("");
  el.dataset.splitWords = "1";
  return el.querySelectorAll(".word");
}
function splitChars(el) {
  if (!el || el.dataset.splitChars === "1")
    return el?.querySelectorAll?.(".char") || [];
  const text = el.textContent || "";
  el.innerHTML = [...text]
    .map((ch) =>
      ch === " "
        ? " "
        : `<span class="char" style="display:inline-block">${ch}</span>`,
    )
    .join("");
  el.dataset.splitChars = "1";
  return el.querySelectorAll(".char");
}
function splitLetters(el) {
  if (!el || el.dataset.splitLetters === "1")
    return el?.querySelectorAll?.(".title-letter") || [];
  const html = el.innerHTML;
  el.innerHTML = html.replace(
    /(<[^>]+>)|([^<])/g,
    (m, tag, ch) =>
      tag || (ch === " " ? " " : `<span class="title-letter">${ch}</span>`),
  );
  el.dataset.splitLetters = "1";
  return el.querySelectorAll(".title-letter");
}
function splitLinesByBreak(el) {
  // approximate Jt types:"lines,chars" by treating text as lines via <br> or wrapping; fallback to chars
  if (!el) return [];
  return splitChars(el);
}

export function initScrollAnimations() {
  const ctx = gsap.context(() => {
    // --- Menu / logo entrance (bundle delays varied; keep visible & animated) ---
    gsap.to(".menu-2-bar", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.to(".logo-3d", { opacity: 1, duration: 1, delay: 0.2 });

    // --- Hero (ST22 + hero bg) ---
    gsap.to(".hero-section-home", {
      backgroundImage:
        "linear-gradient(250deg, rgba(214, 4, 7, 1) 0%, rgba(0, 0, 0, 1) 100%)",
      duration: 3,
      delay: 0.6,
    });
    gsap.utils
      .toArray(
        ".hero-section-home .para-introduce-hero, .hero-section-home .expertise-text span",
      )
      .forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.3 + i * 0.08,
          },
        );
      });
    gsap.to(".face-image", {
      y: 0,
      duration: 3.5,
      filter: "brightness(1)",
      scale: 1,
      ease: "power2.out",
      delay: 0.2,
    });

    // ST22: cinematic-title letters (extracted)
    document.querySelectorAll(".cinematic-title").forEach((title) => {
      const letters = splitLetters(title);
      if (letters.length)
        gsap.from(letters, {
          opacity: 0,
          scale: 0.5,
          transformOrigin: "50% 100%",
          duration: 1.2,
          stagger: { each: 0.05, from: "random" },
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 50%",
            end: "85% 35%",
            scrub: false,
          },
        });
    });

    // ST5: cinematic-text words (extracted)
    document.querySelectorAll(".cinematic-text").forEach((el) => {
      const words = splitWords(el);
      if (words.length) {
        gsap.set(words, {
          opacity: 0,
          y: 50,
          filter: "blur(2px)",
          transformOrigin: "50% 100%",
        });
        gsap.to(words, {
          opacity: 1,
          y: 0,
          skewY: 0,
          filter: "blur(0px)",
          duration: 3,
          ease: "power4.out",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          clearProps: "willChange,filter",
        });
      }
    });

    // ST6: facts-box chars/words (extracted)
    document.querySelectorAll(".facts-box").forEach((r) => {
      const numEl = r.querySelector(".numbers-facts");
      const paraEl = r.querySelector(".para-facts");
      const chars = splitChars(numEl);
      const words = splitWords(paraEl);
      if (chars.length)
        gsap.set(chars, { opacity: 0, y: 50, filter: "blur(4px)" });
      if (words.length)
        gsap.set(words, { opacity: 0, y: 20, filter: "blur(4px)" });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: r,
          start: "top center",
          end: "bottom bottom",
          once: true,
        },
      });
      if (chars.length)
        tl.to(chars, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "expo.out",
          stagger: { each: 0.04, from: "random" },
        });
      if (words.length)
        tl.to(
          words,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power4.out",
            stagger: { each: 0.05, from: "random" },
          },
          "-=0.8",
        );
    });

    // ST1: services heading flip/move (extracted - uses Flip)
    const Zb = document.querySelector(".services-heading");
    const $E = document.querySelector(".scroll-downn");
    if (Zb && $E && !Zb.dataset.flipped) {
      const state = Flip.getState(Zb);
      $E.appendChild(Zb);
      Zb.dataset.flipped = "1";
      Flip.from(state, {
        duration: 1,
        ease: "none",
        absolute: true,
        scrollTrigger: {
          trigger: ".services-project",
          start: "top 60%",
          end: "center 50%",
          scrub: true,
        },
      });
    }

    // ST2: services chars + word1/points split (extracted)
    const Qb = document.querySelector(".services-heading .breaks");
    if (Qb && !Qb.dataset.chars) {
      const chars = (Qb.textContent || "").split("");
      Qb.innerHTML = chars
        .map((r) => `<span class="services-char">${r}</span>`)
        .join("");
      Qb.dataset.chars = "1";
    }
    const tv = (sel) =>
      document.querySelectorAll(sel).forEach((el) => {
        if (el.dataset.charSplit) return;
        const t = el.textContent || "";
        el.innerHTML = "";
        [...t].forEach((n) => {
          const s = document.createElement("span");
          s.textContent = n === " " ? "\u00A0" : n;
          el.appendChild(s);
        });
        el.dataset.charSplit = "1";
      });
    tv(".word1");
    tv(".points");
    gsap.set(".word1 span, .points span", { y: "120%" });
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".box-section-ups",
          start: "top top",
          end: "100% top",
          scrub: true,
        },
      })
      .to(".services-char", { fontSize: "19rem", stagger: 0.1, ease: "none" })
      .to(".breaks", { transform: "translateX(0%)", ease: "none" }, "0");

    // ST3 + ST4: main services pinned timelines (extracted)
    // original: Jt line-split for heading-fall/fall-para, wrap each line in span; animate to y:0% at "18"
    ;[".heading-fall", ".fall-para"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el || el.dataset.lineSplit === "1") return;
      el.innerHTML = `<div class="line" style="overflow:hidden;display:block"><span style="display:inline-block;will-change:transform">${el.innerHTML}</span></div>`;
      el.dataset.lineSplit = "1";
    });
    gsap.set(".fall-para .line span, .heading-fall .line span", { y: "100%" });
    // CSS: .another-fall has translateY(100%) scale(.3); .paper-tear img has scale(1.9)
    gsap.set(".another-fall", { y: "100%", scale: 0.3, transformOrigin: "center center" });
    gsap.set(".uiux", { clipPath: "inset(100% 0% 0% 0%)" });

    const nv = document.querySelectorAll(".svg-strokee svg *");
    nv.forEach((r) => {
      if (typeof r.getTotalLength === "function") {
        const e = r.getTotalLength();
        gsap.set(r, { strokeDasharray: e, strokeDashoffset: e });
      }
    });
    if (document.querySelector(".services-project")) {
      const fi = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-project",
          start: "top top",
          end: "+=690%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      fi.to(nv, { strokeDashoffset: 0, duration: 3, stagger: 0.11 }, "0");
      fi.to(".services-char", { y: "-130%", delay: 0.5, stagger: 0.1 });
      fi.to(".services-change-1 .word1:nth-child(1) span", {
        y: "0%",
        stagger: 0.03,
        duration: 1,
      });
      fi.to(
        ".set-1 .points span",
        { y: "0%", stagger: 0.04, duration: 0.6 },
        "<",
      );
      fi.to(
        ".services-change-1 .word1:nth-child(1) span",
        { y: "-120%", stagger: 0.02, duration: 1 },
        "+=0.2",
      );
      fi.to(
        ".set-1 .points span",
        { y: "-120%", stagger: 0.02, duration: 1 },
        "<",
      );
      fi.to(".services-change-1 .word1:nth-child(2) span", {
        y: "0%",
        stagger: 0.03,
        ease: "power4.out",
        duration: 0.6,
      });
      fi.to(
        ".set-2 .points span",
        { y: "0%", stagger: 0.04, ease: "power4.out", duration: 0.6 },
        "<",
      );
      fi.to(".another-fall", { y: "0%", stagger: 0.04, duration: 2 });
      fi.to(".another-fall", {
        scale: 1,
        width: "100vw",
        height: "100vh",
        stagger: 0.04,
        duration: 0.6,
      });
      fi.to(".paper-tear img", { scale: 1, stagger: 0.04, duration: 0.6 });
      fi.to(
        ".fall-para .line span",
        { y: "0%", stagger: 0.04, duration: 0.6 },
        "18",
      );
      fi.to(
        ".heading-fall .line span",
        { y: "0%", stagger: 0.04, duration: 0.6 },
        "18",
      );

      const iv = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-project",
          start: "top top",
          end: "700% bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      iv.to(
        ".uiux",
        { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.08, ease: "power3.out" },
        0,
      );
      iv.fromTo(
        ".uiux img",
        { yPercent: 40 },
        { yPercent: -40, stagger: 0.08, ease: "none" },
        0,
      );
    }

    // services-text words (if used)
    document.querySelectorAll(".services-text").forEach((el) => {
      const words = splitWords(el);
      if (words.length) {
        gsap.set(words, { opacity: 0, y: 50, filter: "blur(2px)" });
        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 2,
          ease: "power4.out",
          stagger: { each: 0.04, from: "random" },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    });

    // pictures-services mouse parallax (extracted, desktop)
    const uM = document.querySelector(".pictures-services");
    if (uM && window.innerWidth > 768) {
      let r = window.innerWidth / 2, e = window.innerHeight / 2, t = r, n = e;
      const iL = 0.12;
      const onMove = (s) => { t = s.clientX; n = s.clientY; };
      window.addEventListener("mousemove", onMove);
      const tick = () => {
        r += (t - r) * iL; e += (n - e) * iL;
        const s = r - window.innerWidth / 2, a = e - window.innerHeight / 2;
        const o = gsap.utils.mapRange(0, window.innerWidth, -45, 45, r);
        const l = gsap.utils.mapRange(0, window.innerHeight, 25, -25, e);
        gsap.set(uM, { x: s, y: a, rotationX: l, rotationY: o, transformPerspective: 1200, transformOrigin: "center center", force3D: true });
      };
      gsap.ticker.add(tick);
      // best-effort cleanup on hot reload / if disposed externally
      window.__psCleanup = () => { window.removeEventListener("mousemove", onMove); gsap.ticker.remove(tick); };
    }

    // ST7: work/steps (extracted core)
    initWorkSteps();

    // ST11-15: step-of-work + blog splits/reveals (extracted)
    initStepOfWorkAndBlog();

    // ST8,9,10,15: blog + CTA
    if (document.querySelector(".blog-section")) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".blog-section",
            start: "top 10%",
            end: "120% bottom",
            scrub: true,
          },
        })
        .to(".card-1:nth-child(2)", { y: 0 }, "0");
    }
    const cta = document.querySelector(".cta-title");
    if (cta) {
      const cChars = splitChars(cta);
      if (cChars.length)
        gsap.from(cChars, {
          y: 150,
          opacity: 0,
          rotateX: -90,
          scale: 0.7,
          duration: 0.8,
          filter: "blur(4px)",
          color: "#990000",
          stagger: 0.01,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".before-footer-cta",
            start: "top 75%",
            end: "bottom center",
            scrub: false,
          },
        });
    }
    if (window.innerWidth <= 768 && document.querySelector(".cards-blogs")) {
      gsap.utils
        .toArray(".card-1")
        .forEach((r, e) =>
          gsap.from(r, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            delay: e * 0.1,
            scrollTrigger: {
              trigger: ".cards-blogs",
              start: "top 20%",
              scrub: true,
            },
          }),
        );
    }

    // ST18-20: roman statue cross-section moves (uses exposed group)
    initRomanScrollMoves();

    // Recognitions (ST21: 3D canvas + camera + split panels) handled by initRecognitions3D module.

    // Footer/link reveals
    gsap.to(".plus-rotate", {
      rotate: 0,
      duration: 1,
      scale: 1,
      ease: "power3.out",
      delay: 0.2,
    });

    // Hero + Footer scrolling-text marquee (extracted: iy horizontalLoop + Observer timeScale)
    initScrollingTextMarquee();
  });

  return {
    dispose() {
      ctx.revert();
    },
  };
}

// horizontalLoop helper (ported from original bundle `iy`), applied per .rail
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  if (!items.length) return null;
  let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) });
  let length = items.length, startX = items[0].offsetLeft, widths = [], xPercents = [], pixelsPerSecond = (config.speed || 1) * 100, snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), curIndex = 0, times = [];
  gsap.set(items, { xPercent: (i, el) => { let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px")); xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent")); return xPercents[i]; } });
  gsap.set(items, { x: 0 });
  let totalWidth = items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
  for (let i = 0; i < length; i++) {
    let item = items[i], curX = (xPercents[i] / 100) * widths[i], distanceToStart = item.offsetLeft + curX - startX, distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
      .fromTo(item, { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {}; (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
    let newIndex = gsap.utils.wrap(0, length, index), time = times[newIndex];
    if (time > tl.time() !== index > curIndex) { vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }; time += tl.duration() * (index > curIndex ? 1 : -1); }
    curIndex = newIndex; vars.overwrite = true; return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);
  if (config.reversed) { tl.vars.onReverseComplete(); tl.reverse(); }
  return tl;
}

function initScrollingTextMarquee() {
  // extracted: .rail h4 + iy({repeat:-1,paddingRight:30}) + Observer onChangeY timeScale
  document.querySelectorAll(".scrolling-text .rail").forEach((rail) => {
    const items = rail.querySelectorAll("h4");
    if (items.length < 2) return;
    const loop = horizontalLoop(items, { repeat: -1, paddingRight: 30 });
    if (!loop) return;
    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onChangeY(self) {
        let factor = 2.5;
        if (self.deltaY < 0) factor *= -1;
        gsap.timeline({ defaults: { ease: "none" } })
          .to(loop, { timeScale: factor * 2.5, duration: 0.2, overwrite: true })
          .to(loop, { timeScale: factor / 2.5, duration: 1 }, "+=0.3");
      },
    });
  });
}

function initWorkSteps() {
  const work =
    document.querySelector(".container#work") ||
    document.querySelector(".container");
  const steps = gsap.utils.toArray(".container .step");
  if (!work || !steps.length) return;
  const Hs = steps.length;
  const Ls = document.querySelector(".steps-overlay-bg-change img");
  const uv = document.querySelector(".text-chnage-on-steps");
  const Ih = uv?.querySelector("h1");
  const Uh = uv?.querySelector("p");
  const hv = document.querySelector(".circle-steps circle");
  const AM = document.querySelector(".circle-steps h1");
  const md = 2 * Math.PI * 35;
  if (hv) gsap.set(hv, { strokeDasharray: md, strokeDashoffset: md });

  // work data (extracted from bundle wM)
  const wM = [
    { title: "CODENARTS", desc: "A bold creative agency website featuring futuristic Golden and purple visuals, seamless animations, and immersive storytelling." },
    { title: "AZ-DIGITAL-VENTURES", desc: "A bold digital agency website showcasing premium branding, striking typography, and conversion-focused services with a modern editorial aesthetic." },
    { title: "AMRON", desc: "A futuristic creative agency concept featuring bold 3D visuals, cinematic motion, and a premium digital aesthetic that emphasizes storytelling and visual impact." },
    { title: "CHATONE", desc: "A clean, light-themed messaging app designed for effortless conversations, real-time communication, and an intuitive user experience." },
    { title: "FINANCE", desc: "A futuristic finance platform combining glowing green visuals, intuitive dashboards, and seamless banking for modern users." },
  ];

  function Mp(r) {
    return r === 0
      ? { top: "25%", scale: 1, opacity: 1, pointerEvents: "auto" }
      : r === -1
        ? { top: "-10%", scale: 0.3, opacity: 0.4, pointerEvents: "none" }
        : r <= -2
          ? { top: "-25%", scale: 0, opacity: 0, pointerEvents: "none" }
          : r === 1
            ? { top: "60%", scale: 0.3, opacity: 0.4, pointerEvents: "none" }
            : { top: "80%", scale: 0.1, opacity: 0.1, pointerEvents: "none" };
  }
  steps.forEach((r, e) =>
    gsap.set(r, {
      ...Mp(e),
      zIndex: Hs - e,
      position: "absolute",
      left: "50%",
      xPercent: -50,
    }),
  );

  let Vo = false;
  const setText = (idx) => {
    const d = wM[idx] || wM[0];
    if (Ih) Ih.textContent = d ? d.title : "My work";
    if (Uh) Uh.textContent = d ? d.desc : "Scroll down for more";
  };
  setText(0);

  const DM = gsap.timeline({
    scrollTrigger: {
      trigger: work,
      start: "top top",
      end: "+=" + Hs * 100 + "%",
      scrub: 0.15,
      pin: true,
      onEnter() {
        Vo = true;
        if (Ls) gsap.to(Ls, { opacity: 1, duration: 0.5, overwrite: "auto" });
      },
      onEnterBack() {
        Vo = true;
        if (Ls) gsap.to(Ls, { opacity: 1, duration: 0.5, overwrite: "auto" });
      },
      onLeave() {
        Vo = false;
        if (Ls) gsap.to(Ls, { opacity: 0, duration: 0.5, overwrite: "auto" });
      },
      onLeaveBack() {
        Vo = false;
        if (Ls) gsap.to(Ls, { opacity: 0, duration: 0.5, overwrite: "auto" });
      },
      onUpdate(r) {
        const e = Math.min(r.progress * Hs, Hs - 1),
          t = Math.floor(e),
          n = e - t;
        steps.forEach((i, s) => {
          const a = s - t;
          gsap.to(i, {
            ...Mp(a),
            duration: 0.6,
            ease: "power3.out",
            overwrite: true,
          });
        });
        setText(t);
        const src = steps[t]?.querySelector("img")?.getAttribute("src");
        if (Ls && src) Ls.setAttribute("src", src);
        if (hv) hv.style.strokeDashoffset = String(md * (1 - n));
        if (AM) AM.innerText = String(t + 1).padStart(2, "0");
      },
    },
  });
  for (let r = 0; r < Hs; r++)
    steps.forEach((el, t) => {
      const n = t - r;
      let i = Mp(n);
      if (t === Hs - 1 && n === 0) i = { ...i, width: "45vw", height: "50vh" };
      if (t === Hs - 1 && n !== 0) i = { ...i, width: "45vw", height: "50vh" };
      DM.to(el, { ...i, ease: "none", duration: 1 }, r);
    });

  // circle follow view
  const Ga = document.querySelector(".circle-follow-view");
  if (Ga && window.innerWidth > 800) {
    const fv = (r) => {
      Ga.style.transform = `translate(${r.clientX - Ga.offsetWidth / 2}px, ${r.clientY - Ga.offsetHeight / 2}px)`;
    };
    window.addEventListener("mousemove", fv);
    steps.forEach((r) => {
      r.addEventListener("mouseenter", () =>
        gsap.to(Ga, { opacity: 1, duration: 0.4, ease: "power2.out" }),
      );
      r.addEventListener("mouseleave", () =>
        gsap.to(Ga, { opacity: 0, duration: 0.6, ease: "power2.out" }),
      );
    });
  }
}

function initStepOfWorkAndBlog() {
  // splits
  [".heading-of-step-work h1", ".para-for-stepss"].forEach((s) =>
    splitWords(document.querySelector(s)),
  );
  document
    .querySelectorAll(".box-step-main h1, .box-step-main p")
    .forEach((r) => splitWords(r));
  splitWords(document.querySelector(".blog-heading"));
  splitWords(document.querySelector(".blog-para"));

  gsap.set(".heading-of-step-work .word", { opacity: 0, y: 80 });
  gsap.set(".para-for-stepss .word", { opacity: 0, y: 40 });
  gsap.set(".box-step-main h1 .word", { opacity: 0, y: 60 });
  gsap.set(".box-step-main p .word", { opacity: 0, y: 30 });
  const sowImg = document.querySelector(".step-of-work img");
  if (sowImg)
    gsap.to(sowImg, {
      yPercent: -20,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".step-of-work",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  gsap.to(".heading-of-step-work .word", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    stagger: 0.05,
    duration: 0.8,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".heading-of-step-work",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.to(".para-for-stepss .word", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    stagger: 0.015,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".para-for-stepss",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
  gsap.utils.toArray(".box-step-main").forEach((r) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: r,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
      .from(r, { y: 120, opacity: 0, duration: 0.8, ease: "power4.out" })
      .to(
        r.querySelectorAll("h1 .word"),
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.05,
          duration: 0.5,
          ease: "power4.out",
        },
        "-=0.4",
      )
      .to(
        r.querySelectorAll("p .word"),
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.015,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.35",
      );
  });

  gsap.set(".blog-heading .word", {
    yPercent: 120,
    opacity: 0,
    filter: "blur(5px)",
  });
  gsap.set(".blog-para .word", {
    yPercent: 120,
    opacity: 0,
    filter: "blur(5px)",
  });
  if (document.querySelector(".blog-section")) {
    const XM = gsap.timeline({
      scrollTrigger: { trigger: ".blog-section", start: "top 45%", once: true },
    });
    XM.to(
      ".blog-heading .word",
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.05,
        ease: "expo.out",
      },
      0,
    ).to(
      ".blog-para .word",
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.025,
        ease: "power4.out",
      },
      0.3,
    );
  }
}

function initRomanScrollMoves() {
  // ST18-20 animate the roman statue group if available (exposed by romanViewer)
  const poll = () => window.__romanStatue;
  const tryInit = () => {
    const rs = poll();
    if (!rs || !rs.group) return false;
    const Xt = rs.group;
    if (document.querySelector(".box-section-ups")) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".box-section-ups",
            start: "top top",
            end: "+=2500",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .to(Xt.position, { z: -35, y: 12, ease: "none", duration: 8 })
        .to(Xt.position, { y: 20, ease: "none" });
    }
    if (window.innerWidth > 768 && document.querySelector(".step-of-work")) {
      const r = gsap.timeline({
        scrollTrigger: {
          trigger: ".step-of-work",
          start: "top center",
          end: "100% bottom",
          scrub: 1,
          invalidateOnRefresh: true,
          immediateRender: false,
        },
      });
      r.to(Xt.rotation, { y: 2, duration: 20 }, "0");
      r.to(Xt.position, { y: 1.5, z: 0, duration: 10, autoAlpha: 1 }, "0");
      r.to(Xt.position, { y: 10, autoAlpha: 0, duration: 8 }, "15");
    }
    // ST19 footer move (extracted bP) + footer audio/spin
    if (document.querySelector("#footer")) {
      const kl = window.innerWidth <= 768;
      let footerAudio = window.__footerAudio;
      if (!footerAudio) { footerAudio = new Audio("/assets/footer-DWViNq5i.mp3"); footerAudio.preload = "auto"; footerAudio.volume = 1; window.__footerAudio = footerAudio; }
      let Xh;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#footer",
            start: kl ? "350% center" : "400% center",
            end: kl ? "450% bottom" : "500% bottom",
            scrub: 2,
            invalidateOnRefresh: true,
            immediateRender: false,
            onEnter: () => { try { footerAudio.pause(); footerAudio.currentTime = 0; footerAudio.play().catch(() => {}); } catch {} Xh = gsap.to(Xt.rotation, { y: "+=" + Math.PI * 2, duration: 8, ease: "none", repeat: -1 }); },
            onLeaveBack: () => { try { Xh && Xh.kill(); } catch {} gsap.to(Xt.rotation, { y: Math.PI * 10, duration: 1, ease: "power2.out" }); },
          },
        })
        .to(Xt.position, { z: 3, y: kl ? -1.5 : 1.5, duration: 10, ease: "none" });
    }
    return true;
  };
  if (!tryInit()) {
    let n = 0;
    const iv = setInterval(() => {
      if (tryInit() || ++n > 40) clearInterval(iv);
    }, 250);
  }
}
