(() => {
  "use strict";

  const STORAGE_KEY = "pronuxfin_intro_seen";
  const INTRO_DURATION = 5200;

  const introScreen = document.getElementById("introScreen");
  const skipIntroBtn = document.getElementById("skipIntroBtn");

  let introFinished = false;
  let introTimer = null;

  function disableBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableBodyScroll() {
    document.body.style.overflow = "";
  }

  function hasSeenIntro() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveIntroSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      /* silencioso: navegação continua normal mesmo sem storage */
    }
  }

  function clearIntroTimer() {
    if (introTimer) {
      clearTimeout(introTimer);
      introTimer = null;
    }
  }

  function removeIntroFromDOM() {
    if (!introScreen) return;
    introScreen.remove();
  }

  function finishIntro({ persist = true, removeAfterTransition = true } = {}) {
    if (!introScreen || introFinished) return;

    introFinished = true;
    clearIntroTimer();

    if (persist) {
      saveIntroSeen();
    }

    introScreen.classList.add("hide");
    introScreen.setAttribute("aria-hidden", "true");
    enableBodyScroll();

    if (removeAfterTransition) {
      window.setTimeout(() => {
        removeIntroFromDOM();
      }, 1000);
    }
  }

  function skipIntro() {
    finishIntro({ persist: true, removeAfterTransition: true });
  }

  function instantSkipIntro() {
    if (!introScreen) return;

    introFinished = true;
    clearIntroTimer();
    introScreen.setAttribute("aria-hidden", "true");
    enableBodyScroll();
    removeIntroFromDOM();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      skipIntro();
    }
  }

  function bindEvents() {
    if (skipIntroBtn) {
      skipIntroBtn.addEventListener("click", skipIntro);
    }

    document.addEventListener("keydown", handleKeydown);
  }

  function startIntro() {
    if (!introScreen) return;

    introScreen.setAttribute("aria-hidden", "false");
    disableBodyScroll();

    introTimer = window.setTimeout(() => {
      finishIntro({ persist: true, removeAfterTransition: true });
    }, INTRO_DURATION);
  }

  function initIntro() {
    if (!introScreen) return;

    if (hasSeenIntro()) {
      instantSkipIntro();
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

  /* opcional para debug manual no console:
     window.resetPronuxfinIntro = function () {
       localStorage.removeItem(STORAGE_KEY);
       location.reload();
     };
  */
})();
