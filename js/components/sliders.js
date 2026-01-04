export function initWeightSlider() {
    const page = document.querySelector('[data-page="cargo-weight"]');
    if (!page) return;

    const slider = page.querySelector('input[type="range"]');
    const displaySpan = page.querySelector('span.text-7xl');

    if (!slider || !displaySpan) return;

    const updateDisplay = () => {
        displaySpan.textContent = slider.value;
    };

    slider.addEventListener("input", updateDisplay);
    updateDisplay(); // Initial display
}

export function initValueSlider() {
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

    updateValues(); // Initial display
}