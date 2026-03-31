(() => {
  "use strict";

  const STORAGE_KEY = "pronuxfin_intro_seen";
  const INTRO_DURATION = 5200;
  const FADE_DURATION = 1000;

  const introScreen = document.getElementById("introScreen");
  const skipIntroBtn = document.getElementById("skipIntroBtn");

  let introFinished = false;
  let introTimer = null;
  let removeTimer = null;

  function disableBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableBodyScroll() {
    document.body.style.overflow = "";
  }

  function hasSeenIntro() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  function saveIntroSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* sem bloqueio */
    }
  }

  function clearTimers() {
    if (introTimer) {
      window.clearTimeout(introTimer);
      introTimer = null;
    }

    if (removeTimer) {
      window.clearTimeout(removeTimer);
      removeTimer = null;
    }
  }

  function removeIntro() {
    if (!introScreen) return;
    introScreen.remove();
  }

  function finishIntro({ persist = true, immediate = false } = {}) {
    if (!introScreen || introFinished) return;

    introFinished = true;
    clearTimers();

    if (persist) {
      saveIntroSeen();
    }

    enableBodyScroll();
    introScreen.setAttribute("aria-hidden", "true");

    if (immediate) {
      removeIntro();
      return;
    }

    introScreen.classList.add("hide");

    removeTimer = window.setTimeout(() => {
      removeIntro();
    }, FADE_DURATION);
  }

  function handleSkip() {
    finishIntro({ persist: true, immediate: false });
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      handleSkip();
    }
  }

  function bindEvents() {
    if (skipIntroBtn) {
      skipIntroBtn.addEventListener("click", handleSkip, { passive: true });
    }

    document.addEventListener("keydown", handleKeydown);
  }

  function startIntro() {
    if (!introScreen) return;

    introScreen.setAttribute("aria-hidden", "false");
    disableBodyScroll();

    introTimer = window.setTimeout(() => {
      finishIntro({ persist: true, immediate: false });
    }, INTRO_DURATION);
  }

  function initIntro() {
    if (!introScreen) return;

    if (hasSeenIntro()) {
      finishIntro({ persist: false, immediate: true });
      return;
    }

    bindEvents();
    startIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initIntro);
  } else {
    initIntro();
  }
})();
