export function initRouteSelection() {
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

export function initTravelerRouteSelection() {
  const page = document.querySelector('[data-page="traveler-route"]');
  if (!page) return;

  const inputs = page.querySelectorAll('input[type="text"][placeholder*="فرودگاه"], input[type="text"][placeholder*="شهر"]');
  if (inputs.length < 2) return;

  const originInput = inputs[0];
  const destInput = inputs[1];

  const routes = [
    { origin: "تهران", destination: "مسقط" },
    { origin: "مسقط", destination: "تهران" },
  ];

  const popularButtons = page.querySelectorAll('div.flex.flex-wrap button');
  popularButtons.forEach((btn, index) => {
    if (index < 2 && routes[index]) {
      const route = routes[index];
      btn.addEventListener('click', () => {
        originInput.value = route.origin;
        destInput.value = route.destination;
      });
    }
  });

  const iconSpans = Array.from(page.querySelectorAll('button span.material-symbols-outlined'));
  const swapSpan = iconSpans.find(sp => sp.textContent && sp.textContent.trim() === 'swap_vert');
  const swapBtn = swapSpan ? swapSpan.closest('button') : null;
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      [originInput.value, destInput.value] = [destInput.value, originInput.value];
    });
  }
}