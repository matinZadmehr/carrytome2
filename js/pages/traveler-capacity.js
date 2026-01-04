// pages/traveler-capacity.js
export function initTravelerCapacity() {
    const page = document.querySelector(
        '#page-traveler-capacity[data-page="traveler-capacity"]'
    );
    if (!page) return;

    /* ======================
       ELEMENTS
    ====================== */
    const sliderInput = page.querySelector('input[type="range"]');
    const weightDisplay = page.querySelector(
        '.flex.items-baseline span.text-6xl'
    );
    const confirmBtn = page.querySelector('button');

    /* ======================
       STATE
    ====================== */
    let state = {
        weight: 0, // Start at 0 kg (right side)
    };

    /* ======================
       HELPERS
    ====================== */
    function updateWeightDisplay() {
        weightDisplay.textContent = state.weight.toFixed(1);
    }

    function handleSliderChange(e) {
        // Map slider value (0-30) to weight (0-30) with RTL logic
        // When slider is at max (30) on left, weight is 0
        // When slider is at min (0) on right, weight is 30
        const sliderValue = parseFloat(e.target.value);
        state.weight = 30 - sliderValue; // Invert the value for RTL
        updateWeightDisplay();
    }

    function handleConfirm() {
        console.log('Selected traveler capacity (kg):', state.weight);
        window.travelerCapacity = state.weight;
    }

    /* ======================
       STYLE SLIDER + BREAKPOINTS
    ====================== */
    function styleSlider() {
        sliderInput.style.appearance = 'none';
        sliderInput.style.width = '100%';
        sliderInput.style.height = '0.5rem';
        sliderInput.style.borderRadius = '1rem';
        sliderInput.style.background = '#d1d5db'; // track
        sliderInput.style.outline = 'none';
        sliderInput.style.cursor = 'pointer';
        sliderInput.style.direction = 'rtl'; // RTL slider

        sliderInput.setAttribute('min', '0');
        sliderInput.setAttribute('max', '30');
        sliderInput.setAttribute('step', '0.1');

        // Initialize slider value to 30 (left side = 0 kg)
        sliderInput.value = '30';
        state.weight = 0; // Corresponding to slider at max position

        // Add tick marks every 5 kg (0 kg on right, 30 kg on left)
        const tickContainer = document.createElement('div');
        tickContainer.style.position = 'absolute';
        tickContainer.style.top = '100%';
        tickContainer.style.left = '0';
        tickContainer.style.width = '100%';
        tickContainer.style.height = '1rem';
        tickContainer.style.display = 'flex';
        tickContainer.style.justifyContent = 'space-between';
        tickContainer.style.pointerEvents = 'none';
        tickContainer.style.flexDirection = 'row-reverse'; // ticks RTL

        // Create ticks from 0 to 30, but positioned RTL
        // Right side: 0 kg, Left side: 30 kg
        for (let i = 0; i <= 30; i += 5) {
            const tickWrapper = document.createElement('div');
            tickWrapper.style.position = 'relative';
            tickWrapper.style.display = 'flex';
            tickWrapper.style.flexDirection = 'column';
            tickWrapper.style.alignItems = 'center';

            const tick = document.createElement('div');
            tick.style.width = '1px';
            tick.style.height = '0.5rem';
            tick.style.background = '#9ca3af';

            const label = document.createElement('span');
            // Labels show actual weight values (0-30)
            // But positioned from right (0) to left (30)
            label.textContent = i;
            label.style.fontSize = '10px';
            label.style.color = '#6b7280';
            label.style.marginTop = '2px';

            tickWrapper.appendChild(tick);
            tickWrapper.appendChild(label);
            tickContainer.appendChild(tickWrapper);
        }

        sliderInput.parentElement.style.position = 'relative';
        sliderInput.parentElement.appendChild(tickContainer);

        // Thumb styling
        const style = document.createElement('style');
        style.textContent = `
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 2rem;
        width: 2rem;
        background: #3b82f6;
        border-radius: 50%;
        border: none;
        margin-top: -0.75rem;
      }
      input[type=range]::-moz-range-thumb {
        height: 2rem;
        width: 2rem;
        background: #3b82f6;
        border-radius: 50%;
        border: none;
      }
      input[type=range]::-ms-thumb {
        height: 2rem;
        width: 2rem;
        background: #3b82f6;
        border-radius: 50%;
        border: none;
      }
    `;
        document.head.appendChild(style);

        sliderInput.addEventListener('input', handleSliderChange);
    }

    /* ======================
       INIT
    ====================== */
    updateWeightDisplay();
    styleSlider();
    confirmBtn.addEventListener('click', handleConfirm);

    console.log('Traveler Capacity page initialized (RTL slider: 0kg right, 30kg left)');
}