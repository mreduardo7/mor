/* ==========================================================
   NOSSO REINO DE LANTERNAS — interações e efeitos
   Mantém o conteúdo original e controla a quantidade de efeitos.
   ========================================================== */
"use strict";

const CONFIG = {
  nomeDela: "A mulher que me ensinou a amar de verdade",
  mensagem: `Minha princesa,

 Amor queria através dessa carta, expressar um pouco do que sinto, amor desde o dia q te vi, me deparei com uma pessoa que me fez sentir algo q nunca senti antes, senti o meu corpo tremer, as pernas bambearem, e meu coração enlouquecer ao seu lado, amor obrigado por todos os momentos que já tivemos juntos, sei que não é nem 1% do que vamos viver ainda, ao olhar para vc, vc já virou a minha oração mais sincera pra Jesus, dizendo pai…A sua filha é tão linda e tão meiga, sou digno de ser um dia o amor dela? E Deus me presenteou com a flor mais linda de todos os campos, uma menina tão meiga, carinhosa, que exala feminilidade, e que tem o brilho do Espírito Santo iluminando a vida dela, amor sei q vc ja escolhemos nos perdoar muitas vezes, mais eu faria isso a vida inteira, pq em provérbios diz, que o amor é paciente e bondoso.
   Não quero ser uma pessoa de momento, quero viver até o fim da minha vida ao seu lado, uma música q me faz chorar ao pensar em vc e no que vc vai se tornar é mulher maravilha, só de pensar em tudo q temos pela frente já agradeço a Deus , amor sei q já te magoei, e nunca te entendi do jeito q vc merece, mais quero te pedir confia em mim, coloque suas dores em mim, eu quero ser o seu escape meu bem, naqueles dias q estiver tudo dando errado, eu quero q vc diz “ preciso do meu namorado” eu quero viver o extraordinário ao seu lado, até o fim EU e VOCÊ!!!!

  Eu te amo! ♡`,
  desejo: "Que Deus cuide de nós, ilumine nossos caminhos e nos ensine a amar cada dia melhor.",
  lanternasAutomaticas: true,
  intervaloLanternas: 760,
  maxLanternasPorCenario: 34,
  quantidadeEstrelas: 95,
  quantidadeLanternasDesejo: 22
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const intro = $("#intro");
const startBtn = $("#startBtn");
const lanternSky = $("#lanternSky");
const bannerLanterns = $("#bannerLanterns");
const heroStars = $("#heroStars");
const heroParticles = $("#heroParticles");
const bannerParticles = $("#bannerParticles");
const wishBtn = $("#wishBtn");
const bannerWishBtn = $("#bannerWishBtn");
const musicToggle = $("#musicToggle");
const musicLabel = $("#musicLabel");
const musicIcon = $("#musicIcon");
const spotifyPlayer = $("#spotifyPlayer");
const menuBtn = $("#menuBtn");
const navMenu = $("#navMenu");
const toast = $("#toast");
const letterModal = $("#letterModal");
const openLetterBtn = $("#openLetterBtn");
const letterContent = $("#letterContent");
const letterPreview = $("#letterPreview");
const photoCards = $$(".photo-card");
const photoModal = $("#photoModal");
const expandedPhoto = $("#expandedPhoto");
const expandedCaption = $("#expandedCaption");
const prevPhoto = $("#prevPhoto");
const nextPhoto = $("#nextPhoto");
const finalBtn = $("#finalBtn");
const finalMessage = $("#finalMessage");

let toastTimer = 0;
let lanternTimer = 0;
let sparkleTimer = 0;
let galleryIndex = 0;
let lastFocusedElement = null;
let activeModal = null;
let enteredStory = false;

/* Toasts */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3400);
}

/* Intro */
function enterStory() {
  if (enteredStory) return;
  enteredStory = true;
  if (intro) {
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
  }
  document.body.classList.remove("locked");
  createLanternBurst(reduceMotion.matches ? 4 : 18, lanternSky);
  createSparkleBurst(reduceMotion.matches ? 3 : 24, heroParticles);
  initializeReveal();
  if (musicToggle) musicToggle.focus({ preventScroll: true });
  showToast("Bem-vinda ao nosso pequeno universo. 💜");
}

if (intro) document.body.classList.add("locked");
if (startBtn) startBtn.addEventListener("click", enterStory);

/* Star field: decorative elements are capped and marked aria-hidden in HTML. */
function createStarField() {
  if (!heroStars || reduceMotion.matches) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < CONFIG.quantidadeEstrelas; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--star-size", `${Math.random() * 2.4 + 1}px`);
    star.style.setProperty("--twinkle-duration", `${2 + Math.random() * 4}s`);
    star.style.setProperty("--twinkle-delay", `${Math.random() * -6}s`);
    fragment.appendChild(star);
  }
  heroStars.appendChild(fragment);
}

/* Lanterns and magical particles */
function createLantern(container, options = {}) {
  if (!container) return;
  if (reduceMotion.matches && !options.force) return;
  if (container.querySelectorAll(".lantern").length >= CONFIG.maxLanternasPorCenario) return;

  const lantern = document.createElement("span");
  lantern.className = "lantern";
  const size = Math.random();
  if (size > 0.78) lantern.classList.add("large");
  else if (size < 0.3) lantern.classList.add("small");

  const duration = options.duration ?? (Math.random() * 8 + 10);
  lantern.style.left = `${Math.random() * 96}%`;
  lantern.style.animationDuration = `${duration}s`;
  lantern.style.animationDelay = `${options.delay ?? 0}s`;
  lantern.style.setProperty("--drift", `${Math.round(Math.random() * 90 - 45)}px`);
  lantern.style.filter = `hue-rotate(${Math.random() * 14 - 7}deg)`;
  container.appendChild(lantern);

  const removeLantern = () => {
    if (lantern.isConnected) lantern.remove();
  };
  lantern.addEventListener("animationend", removeLantern, { once: true });
  window.setTimeout(removeLantern, (duration + 3) * 1000);
}

function createLanternBurst(amount = 12, container = lanternSky) {
  if (!container) return;
  const safeAmount = reduceMotion.matches ? Math.min(amount, 4) : Math.min(amount, 28);
  for (let i = 0; i < safeAmount; i++) {
    window.setTimeout(() => createLantern(container, { duration: 9 + Math.random() * 8 }), i * 95);
  }
}

function createSparkle(container) {
  if (!container || reduceMotion.matches) return;
  if (container.querySelectorAll(".sparkle").length >= 48) return;
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.top = `${Math.random() * 100}%`;
  sparkle.style.setProperty("--sparkle-size", `${Math.random() * 3 + 2}px`);
  sparkle.style.setProperty("--sparkle-duration", `${5 + Math.random() * 6}s`);
  sparkle.style.setProperty("--drift", `${Math.round(Math.random() * 100 - 50)}px`);
  container.appendChild(sparkle);
  const removeSparkle = () => { if (sparkle.isConnected) sparkle.remove(); };
  sparkle.addEventListener("animationend", removeSparkle, { once: true });
  window.setTimeout(removeSparkle, 12000);
}

function createSparkleBurst(amount = 12, container = heroParticles) {
  if (!container || reduceMotion.matches) return;
  for (let i = 0; i < Math.min(amount, 30); i++) {
    window.setTimeout(() => createSparkle(container), i * 65);
  }
}

function startAmbientEffects() {
  if (CONFIG.lanternasAutomaticas && !lanternTimer) {
    lanternTimer = window.setInterval(() => {
      if (document.hidden || reduceMotion.matches || !enteredStory) return;
      createLantern(lanternSky);
      if (Math.random() > 0.45) createLantern(bannerLanterns);
    }, CONFIG.intervaloLanternas);
  }
  if (!sparkleTimer) {
    sparkleTimer = window.setInterval(() => {
      if (document.hidden || reduceMotion.matches || !enteredStory) return;
      createSparkle(heroParticles);
      if (Math.random() > 0.5) createSparkle(bannerParticles);
    }, 520);
  }
}

function stopAmbientEffects() {
  window.clearInterval(lanternTimer);
  window.clearInterval(sparkleTimer);
  lanternTimer = 0;
  sparkleTimer = 0;
}

function releaseWish() {
  createLanternBurst(CONFIG.quantidadeLanternasDesejo, lanternSky);
  createSparkleBurst(24, heroParticles);
  createLanternBurst(10, bannerLanterns);
  createSparkleBurst(12, bannerParticles);
  showToast(CONFIG.desejo);
}
if (wishBtn) wishBtn.addEventListener("click", releaseWish);
if (bannerWishBtn) bannerWishBtn.addEventListener("click", releaseWish);

/* Reveal on scroll, with a graceful fallback for older browsers. */
let revealObserver = null;
function initializeReveal() {
  const targets = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(element => element.classList.add("visible"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
  }
  targets.forEach(element => {
    if (!element.classList.contains("visible")) revealObserver.observe(element);
  });
}

/* Mobile navigation */
function closeMenu() {
  if (!navMenu || !menuBtn) return;
  navMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menu");
  menuBtn.textContent = "☰";
}
if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menuBtn.textContent = isOpen ? "×" : "☰";
  });
  $$("#navMenu a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (navMenu.classList.contains("open") && !navMenu.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  }, { passive: true });
}

/* Spotify embed: this button only shows/hides the player; Spotify controls playback. */
if (musicToggle && spotifyPlayer) {
  musicToggle.addEventListener("click", () => {
    const willShow = spotifyPlayer.hidden || getComputedStyle(spotifyPlayer).display === "none";
    spotifyPlayer.hidden = !willShow;
    musicToggle.classList.toggle("playing", willShow);
    musicToggle.setAttribute("aria-expanded", String(willShow));
    musicLabel.textContent = willShow ? "Player aberto" : "Nossa música";
    musicIcon.textContent = willShow ? "♪" : "♫";
    showToast(willShow
      ? "Player aberto! Toque em reproduzir no Spotify para ouvir a música."
      : "Player escondido. Para pausar a música, use os controles do Spotify.");
  });
}

/* Modals and keyboard focus management */
function openModal(modal) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  activeModal = modal;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  const closeButton = $(".modal-close", modal);
  if (closeButton) closeButton.focus();
}

function closeModal(modal) {
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (activeModal === modal) activeModal = null;
  if (!$(".modal.open")) document.body.classList.remove("locked");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus({ preventScroll: true });
  }
}

if (letterContent) letterContent.textContent = CONFIG.mensagem.trim();
if (letterPreview) letterPreview.textContent = "Preparei algumas palavras especiais para você. Abra a carta e leia com carinho. ♡";
if (openLetterBtn) openLetterBtn.addEventListener("click", () => openModal(letterModal));
$$("[data-close-letter]").forEach(button => button.addEventListener("click", () => closeModal(letterModal)));

/* Photo gallery */
const galleryPhotos = photoCards.map(card => {
  const img = $("img", card);
  const caption = $(".photo-caption", card);
  return {
    src: img ? img.getAttribute("src") : "",
    alt: img ? img.alt : "Lembrança do casal",
    caption: caption ? caption.textContent.trim().replace(/\s+/g, " ") : "Nossa lembrança"
  };
});

function showPhoto(index) {
  if (!galleryPhotos.length || !expandedPhoto) return;
  galleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[galleryIndex];
  expandedPhoto.src = photo.src;
  expandedPhoto.alt = photo.alt;
  if (expandedCaption) expandedCaption.textContent = photo.caption;
  if (prevPhoto) prevPhoto.hidden = galleryPhotos.length < 2;
  if (nextPhoto) nextPhoto.hidden = galleryPhotos.length < 2;
}

photoCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    showPhoto(index);
    openModal(photoModal);
  });
});
if (prevPhoto) prevPhoto.addEventListener("click", () => showPhoto(galleryIndex - 1));
if (nextPhoto) nextPhoto.addEventListener("click", () => showPhoto(galleryIndex + 1));
$$("[data-close-photo]").forEach(button => button.addEventListener("click", () => closeModal(photoModal)));

$$(".photo-card img").forEach(img => {
  img.addEventListener("error", () => {
    img.hidden = true;
    img.parentElement.classList.add("photo-missing");
    img.parentElement.setAttribute("aria-label", "Adicione uma foto para preencher este espaço");
  });
});

/* Final surprise */
if (finalBtn && finalMessage) {
  finalBtn.addEventListener("click", () => {
    const revealMessage = finalMessage.hidden;
    finalMessage.hidden = !revealMessage;
    finalBtn.textContent = revealMessage ? "Guardar essa surpresa ♡" : "Uma última surpresa ♡";
    finalBtn.setAttribute("aria-expanded", String(revealMessage));
    if (revealMessage) {
      createLanternBurst(24, lanternSky);
      createSparkleBurst(24, heroParticles);
      finalMessage.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
      showToast("Mais uma lembrança para guardar no coração. 💜");
    }
  });
}

/* Keyboard support: Escape, photo arrows, and modal focus containment. */
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(letterModal);
    closeModal(photoModal);
    closeMenu();
    return;
  }
  if (photoModal && photoModal.classList.contains("open")) {
    if (event.key === "ArrowRight") showPhoto(galleryIndex + 1);
    if (event.key === "ArrowLeft") showPhoto(galleryIndex - 1);
  }
  if (event.key === "Tab" && activeModal) {
    const focusable = $$('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])', activeModal)
      .filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
  if (event.key === "Enter" && intro && !intro.classList.contains("hidden") && event.target === document.body) enterStory();
});

/* Pause background work when tab is hidden, resume when it returns. */
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAmbientEffects();
  else if (enteredStory) startAmbientEffects();
});
window.addEventListener("pagehide", stopAmbientEffects);

/* Respect live changes to the system motion preference. */
if (typeof reduceMotion.addEventListener === "function") {
  reduceMotion.addEventListener("change", event => {
    if (event.matches) {
      stopAmbientEffects();
      $$(".sparkle").forEach(node => node.remove());
      $$(".lantern").forEach(node => node.remove());
    } else if (enteredStory) startAmbientEffects();
  });
}

createStarField();
initializeReveal();
startAmbientEffects();
console.info("🏮 Nosso Reino de Lanternas está pronto!");
