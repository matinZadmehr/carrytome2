(() => {
  const DEFAULT_ROUTE = "home";

  function applyColorScheme(isDark) {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }

  function hideAppLoader() {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.classList.add("app-loader--hidden");
    window.setTimeout(() => loader.remove(), 260);
  }

  function createRouteProgress() {
    const el = document.getElementById("route-progress");
    if (!el) return () => { };

    let timerId = null;
    return () => {
      if (timerId) window.clearTimeout(timerId);
      el.classList.remove("is-active");
      void el.offsetWidth;
      el.classList.add("is-active");
      timerId = window.setTimeout(() => el.classList.remove("is-active"), 280);
    };
  }

  function initTelegramWebApp() {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
      } catch {
        // ignore
      }

      const applyTgColorScheme = () => {
        applyColorScheme(tg.colorScheme === "dark");
      };

      applyTgColorScheme();

      try {
        tg.onEvent("themeChanged", applyTgColorScheme);
      } catch {
        // ignore
      }

      return;
    }

    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mediaQuery) return;
    applyColorScheme(mediaQuery.matches);
    try {
      mediaQuery.addEventListener("change", (event) =>
        applyColorScheme(event.matches),
      );
    } catch {
      // Safari < 14
      mediaQuery.addListener((event) => applyColorScheme(event.matches));
    }
  }

  function initCargoCategories() {
    const searchInput = document.querySelector('[data-page="cargo-cat"] input[type="text"]');
    if (!searchInput) return;

    const buttons = document.querySelectorAll('[data-page="cargo-cat"] [role="radiogroup"] button');
    const categories = [
      { name: "کالای لوکس", keywords: ["لوکس", "طلا", "جواهر", "ساعت"] },
      { name: "اسناد و مدارک", keywords: ["مدارک", "اسناد", "پاسپورت", "شناسنامه", "قرارداد"] },
      { name: "الکترونیک", keywords: ["الکترونیک", "موبایل", "لپ", "دوربین", "گوشی", "آیفون"] },
      { name: "پزشکی و دارو", keywords: ["دارو", "پزشکی", "تجهیزات", "دارویی"] },
      { name: "آثار هنری", keywords: ["تابلو", "مجسمه", "هنری", "آثار"] },
      { name: "سایر موارد", keywords: ["سایر", "جعبه", "عمومی"] },
    ];

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      buttons.forEach((button) => {
        const text = button.textContent.toLowerCase();
        const matches = !query || text.includes(query);
        button.style.display = matches ? "" : "none";
      });
    });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((b) => {
          const circle = b.querySelector("div:last-child");
          circle.style.background = "";
          circle.style.borderColor = "";
        });

        const circle = button.querySelector("div:last-child");
        circle.style.borderColor = "#0f6df0";
        circle.style.background = "#0f6df0";
        circle.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px; color: white;">check</span>';
      });
    });
  }

  function initWeightSlider() {
    const page = document.querySelector('[data-page="cargo-weight"]');
    if (!page) return;

    const slider = page.querySelector('input[type="range"]');
    const displaySpan = page.querySelector('span.text-7xl');

    if (!slider || !displaySpan) return;

    const updateDisplay = () => {
      displaySpan.textContent = slider.value;
    };

    slider.addEventListener("input", updateDisplay);
  }

  function initValueSlider() {
    const page = document.querySelector('[data-page="cargo-val"]');
    if (!page) return;

    const slider = page.querySelector('input[type="range"]');
    const display = page.querySelector('input[inputmode="numeric"]');

    if (!slider || !display) return;

    const updateValues = () => {
      display.value = slider.value;
    };

    slider.addEventListener("input", updateValues);
    display.addEventListener("input", () => {
      slider.value = display.value;
    });

    const buttons = page.querySelectorAll('[type="button"]');
    buttons.forEach((btn) => {
      const amount = parseInt(btn.textContent);
      if (!isNaN(amount)) {
        btn.addEventListener("click", () => {
          display.value = amount;
          slider.value = amount;

          buttons.forEach((b) => b.classList.remove("border-primary", "bg-primary/10"));
          btn.classList.add("border-primary", "bg-primary/10");
        });
      }
    });
  }

  function initRouteSelection() {
    const page = document.querySelector('[data-page="cargo-route"]');
    if (!page) return;

    const inputs = page.querySelectorAll('input[type="text"][placeholder*="شهر"]');
    if (inputs.length < 2) return;

    const originInput = inputs[0];
    const destInput = inputs[1];

    const routes = [
      { origin: "تهران", destination: "مسقط" },
      { origin: "مسقط", destination: "تهران" },
    ];

    const routeButtons = page.querySelectorAll('[type="button"][class*="flex"][class*="items-center"][class*="gap"]');

    routeButtons.forEach((btn, index) => {
      if (index < 2 && routes[index]) {
        const route = routes[index];
        btn.addEventListener("click", () => {
          originInput.value = route.origin;
          destInput.value = route.destination;
        });
      }
    });

    const swapBtn = page.querySelector('button[type="button"] .material-symbols-outlined[style*="swap"]')?.closest('button');
    if (swapBtn) {
      swapBtn.addEventListener("click", () => {
        [originInput.value, destInput.value] = [destInput.value, originInput.value];
      });
    }
  }

  function initRouter() {
    const pages = Array.from(document.querySelectorAll("[data-page]"));
    if (pages.length === 0) return null;

    const tickProgress = createRouteProgress();
    let isFirstRender = true;
    let currentRoute = null;

    const pageByRoute = new Map(
      pages
        .map((el) => [el.getAttribute("data-page"), el])
        .filter(([route]) => typeof route === "string" && route.length > 0),
    );

    const normalizeRoute = (route) => {
      if (typeof route !== "string") return DEFAULT_ROUTE;
      const cleaned = route.trim().replace(/^\/+/, "");
      if (!cleaned) return DEFAULT_ROUTE;
      return pageByRoute.has(cleaned) ? cleaned : DEFAULT_ROUTE;
    };

    const routeFromHash = () => {
      const hash = window.location.hash || "";
      const withoutHash = hash.replace(/^#\/?/, "");
      if (!withoutHash) return DEFAULT_ROUTE;
      const routePart = withoutHash.split(/[?&]/, 1)[0];
      return normalizeRoute(decodeURIComponent(routePart));
    };

    const updateNavVisibility = (route) => {
      const nav = document.querySelector("nav[data-visible-pages]");
      if (!nav) return;

      const visiblePagesAttr = nav.getAttribute("data-visible-pages");
      if (!visiblePagesAttr) return;

      const visiblePages = visiblePagesAttr.split(",").map((p) => p.trim());
      const isPageVisible = visiblePages.includes(route);

      if (isPageVisible) {
        nav.classList.remove("hidden");
        nav.style.display = "";
      } else {
        nav.classList.add("hidden");
        nav.style.display = "none";
      }
    };

    const showRoute = (route) => {
      const activeRoute = normalizeRoute(route);
      const routeChanged = activeRoute !== currentRoute;
      currentRoute = activeRoute;

      if (routeChanged && !isFirstRender) tickProgress();

      for (const [pageRoute, pageEl] of pageByRoute) {
        const isActive = pageRoute === activeRoute;

        if (!isActive) {
          pageEl.classList.add("hidden");
          pageEl.setAttribute("aria-hidden", "true");
          pageEl.classList.remove("page-enter");
          continue;
        }

        const wasHidden = pageEl.classList.contains("hidden");
        pageEl.classList.remove("hidden");
        pageEl.removeAttribute("aria-hidden");

        if (routeChanged && !isFirstRender && wasHidden) {
          pageEl.classList.add("page-enter");
          window.requestAnimationFrame(() => {
            pageEl.classList.remove("page-enter");
          });
        }
      }

      updateNavVisibility(activeRoute);

      if (routeChanged) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      isFirstRender = false;
    };

    const navigate = (route, { replace = false } = {}) => {
      const targetRoute = normalizeRoute(route);
      const nextHash = `#/${encodeURIComponent(targetRoute)}`;
      if (replace) window.location.replace(nextHash);
      else window.location.hash = nextHash;
      showRoute(targetRoute);
    };

    window.addEventListener("hashchange", () => showRoute(routeFromHash()));
    showRoute(routeFromHash());

    return { navigate, normalizeRoute, routeFromHash };
  }

  function routeFromHref(href) {
    if (typeof href !== "string" || href.length === 0) return null;
    if (href.startsWith("#")) {
      const route = href.replace(/^#\/?/, "");
      return route.length > 0 ? decodeURIComponent(route) : DEFAULT_ROUTE;
    }
    return null;
  }

  function initNavigation(router) {
    const navigate = (route, opts) => {
      if (router) router.navigate(route, opts);
      else window.location.assign(route);
    };

    const handleNav = (event, el) => {
      const explicitRoute = el.getAttribute("data-route");
      const href = el.getAttribute("data-href");
      const targetRoute = explicitRoute || routeFromHref(href);

      if (targetRoute) {
        event.preventDefault();
        navigate(targetRoute);
        return;
      }

      if (href) {
        event.preventDefault();
        window.location.assign(href);
      }
    };

    document.addEventListener("click", (event) => {
      const el = event.target?.closest?.("[data-route], [data-href]");
      if (!el) return;
      handleNav(event, el);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const el = event.target;
      if (!(el instanceof HTMLElement)) return;
      if (!el.matches("[role='button'][data-route], [role='button'][data-href]"))
        return;
      handleNav(event, el);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTelegramWebApp();
    const router = initRouter();
    initNavigation(router);
    initCargoCategories();
    initWeightSlider();
    initValueSlider();
    initRouteSelection();
    hideAppLoader();
    window.setTimeout(hideAppLoader, 2500);
  });
})();
