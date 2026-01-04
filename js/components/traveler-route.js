export function initTravelerRouteSelection() {
    const page = document.querySelector('[data-page="traveler-route"]');
    if (!page) {
        console.error('Traveler route page not found');
        return;
    }

    console.log('🚀 Initializing traveler route selection...');

    // Get input fields using IDs
    const originInput = page.querySelector('#origin-input');
    const destInput = page.querySelector('#dest-input');
    const swapButton = page.querySelector('#swap-button');
    const submitButton = page.querySelector('#submit-route');
    const popularRouteButtons = page.querySelectorAll('.popular-route-btn');
    const airportSuggestions = page.querySelectorAll('.airport-suggestion');

    if (!originInput || !destInput) {
        console.error('Input fields not found');
        return;
    }

    console.log('✅ Found elements:', {
        originInput,
        destInput,
        swapButton: !!swapButton,
        submitButton: !!submitButton,
        popularRoutes: popularRouteButtons.length,
        suggestions: airportSuggestions.length
    });

    // ===== POPULAR ROUTES FUNCTIONALITY =====
    popularRouteButtons.forEach(button => {
        // حذف event listenerهای قبلی برای جلوگیری از duplicate
        button.replaceWith(button.cloneNode(true));
    });

    // انتخاب مجدد
    const freshButtons = page.querySelectorAll('.popular-route-btn');

    freshButtons.forEach(button => {
        // جلوگیری از رفتار پیش‌فرض
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // جلوگیری از event delegation
            if (e.target !== this && !this.contains(e.target)) {
                return;
            }

            const origin = this.getAttribute('data-origin');
            const destination = this.getAttribute('data-destination');

            console.log('📍 Popular route selected:', { origin, destination });

            // Fill inputs
            originInput.value = origin;
            destInput.value = destination;

            // Highlight
            highlightSelectedButton(this, freshButtons);

            // Validate
            validateForm();

            // Focus
            setTimeout(() => destInput.focus(), 100);

            return false;
        });

        // همچنین روی لینک parent هم event را متوقف کنید
        const parentLink = button.closest('a');
        if (parentLink) {
            parentLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });

    // ===== SWAP BUTTON FUNCTIONALITY =====
    if (swapButton) {
        swapButton.addEventListener('click', (e) => {
            e.preventDefault();

            console.log('🔄 Swapping origin and destination');

            // Swap values
            const temp = originInput.value;
            originInput.value = destInput.value;
            destInput.value = temp;

            // Animate the icon
            const icon = swapButton.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }

            // Update highlighted popular route
            updateHighlightedPopularRoute(originInput.value, destInput.value, popularRouteButtons);

            // Validate form
            validateForm();
        });
    }

    // ===== AIRPORT SUGGESTIONS =====
    airportSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', (e) => {
            e.preventDefault();

            const airport = suggestion.getAttribute('data-airport');
            const code = suggestion.getAttribute('data-code');
            const fullName = `${airport} (${code})`;

            console.log('🏢 Airport selected:', fullName);

            // Check which input is focused
            const activeElement = document.activeElement;
            if (activeElement === originInput || !destInput.value.trim()) {
                originInput.value = fullName;
                setTimeout(() => destInput.focus(), 100);
            } else {
                destInput.value = fullName;
            }

            // Validate form
            validateForm();
        });
    });

    // ===== FORM VALIDATION =====
    function validateForm() {
        if (!submitButton) return;

        const origin = originInput.value.trim();
        const destination = destInput.value.trim();

        const isValid = origin.length > 0 &&
            destination.length > 0 &&
            origin !== destination;

        console.log('📝 Form validation:', { origin, destination, isValid });

        if (isValid) {
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            submitButton.classList.add('cursor-pointer');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            submitButton.classList.remove('cursor-pointer');
        }

        return isValid;
    }

    // ===== SUBMIT BUTTON HANDLER =====
    if (submitButton) {
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Prevent multiple clicks
            if (submitButton.getAttribute('data-processing') === 'true') {
                return;
            }

            submitButton.setAttribute('data-processing', 'true');

            try {
                // Validate
                if (!validateForm()) {
                    showError('لطفاً مبدأ و مقصد معتبر وارد کنید');
                    return;
                }

                const origin = originInput.value.trim();
                const destination = destInput.value.trim();

                // Save data
                const routeData = {
                    origin,
                    destination,
                    timestamp: Date.now()
                };

                localStorage.setItem('travelerRoute', JSON.stringify(routeData));

                // Show success
                showSuccess('مسیر پرواز ثبت شد!');

                // Wait for animation
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Navigate - با try/catch جداگانه
                try {
                    if (window.router?.navigate) {
                        await window.router.navigate('traveler-flight-date');
                    } else {
                        window.location.hash = '#/traveler-flight-date';
                        // یا اگر SPA نیست:
                        // window.location.href = 'registered-flight.html';
                    }
                } catch (navError) {
                    console.error('Navigation error:', navError);
                    // Fallback
                    window.location.href = '#';
                }

            } catch (error) {
                console.error('Submit error:', error);
                showError('خطا در پردازش درخواست');
            } finally {
                submitButton.removeAttribute('data-processing');
            }
        });
    }

    // ===== INPUT VALIDATION =====
    [originInput, destInput].forEach(input => {
        input.addEventListener('input', () => {
            validateForm();

            // Clear error state when user starts typing
            input.classList.remove('border-red-500');
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() && !validateForm()) {
                input.classList.add('border-red-500');
            }
        });
    });

    // ===== BACK BUTTON =====
    const backButton = page.querySelector('[data-href="#"]');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.router) {
                window.router.navigate('home');
            } else {
                window.history.back();
            }
        });
    }

    // Initial validation
    validateForm();

    console.log('🎉 Traveler route initialization complete!');
}

// ===== HELPER FUNCTIONS =====
function highlightSelectedButton(selectedButton, allButtons) {
    allButtons.forEach(button => {
        button.classList.remove(
            'bg-primary',
            'text-white',
            'border-primary',
            'ring-2',
            'ring-primary/30'
        );
        button.classList.add(
            'bg-white',
            'dark:bg-slate-800',
            'border-slate-200',
            'dark:border-slate-700',
            'text-slate-600',
            'dark:text-slate-300'
        );
    });

    selectedButton.classList.remove(
        'bg-white',
        'dark:bg-slate-800',
        'border-slate-200',
        'dark:border-slate-700',
        'text-slate-600',
        'dark:text-slate-300'
    );
    selectedButton.classList.add(
        'bg-primary',
        'text-white',
        'border-primary',
        'ring-2',
        'ring-primary/30'
    );
}

function updateHighlightedPopularRoute(origin, destination, buttons) {
    // Find if this route matches any popular route
    let foundMatch = false;

    buttons.forEach(button => {
        const btnOrigin = button.getAttribute('data-origin');
        const btnDest = button.getAttribute('data-destination');

        if (origin.includes(btnOrigin) && destination.includes(btnDest)) {
            highlightSelectedButton(button, buttons);
            foundMatch = true;
        }
    });

    // If no match found, clear all highlights
    if (!foundMatch) {
        buttons.forEach(button => {
            button.classList.remove(
                'bg-primary',
                'text-white',
                'border-primary',
                'ring-2',
                'ring-primary/30'
            );
            button.classList.add(
                'bg-white',
                'dark:bg-slate-800',
                'border-slate-200',
                'dark:border-slate-700',
                'text-slate-600',
                'dark:text-slate-300'
            );
        });
    }
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 right-4 z-50 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg animate-slideDown';
    notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <span class="material-symbols-outlined">check_circle</span>
      </div>
      <div class="flex-1">
        <p class="font-bold">${message}</p>
        <p class="text-sm opacity-90 mt-1">در حال انتقال...</p>
      </div>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 right-4 z-50 bg-red-500 text-white p-4 rounded-2xl shadow-lg animate-slideDown';
    notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <span class="material-symbols-outlined">error</span>
      </div>
      <div class="flex-1">
        <p class="font-bold">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/80 hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}