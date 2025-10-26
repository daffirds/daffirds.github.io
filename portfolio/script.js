document.addEventListener('DOMContentLoaded', () => {

    // LOADING SCREEN LOGIC ===
    window.onload = () => {
        const loadingScreen = document.getElementById('loading-screen');
        const contentWrapper = document.querySelector('.content-wrapper');
        const sideNav = document.querySelector('.side-nav');
        const homeRight = document.querySelector('.home-right');
        const photoContainer = document.querySelector('.photo-container');

        // Fade out the loading screen
        loadingScreen.classList.add('loaded');

        // Fade in the main content and navigation
        contentWrapper.classList.add('visible');
        sideNav.classList.add('visible');

        // Trigger the home section text animation
        if (photoContainer) {
            photoContainer.classList.add('loaded');
        }

        if(homeRight) {
            homeRight.classList.add('loaded');
        }

        // === ANIMATED TEXT FOR CURRENT POSITION (MOVED HERE) ===
        const texts = [
            "Data Scientist",
            "AI Enthusiast"
        ];

        const wrapper = document.querySelector(".position-text-wrapper");
        const span = wrapper.querySelector(".position-text");
        const positionEl = document.querySelector(".current-position");

        let textIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {
            const currentText = texts[textIndex];

            if (!deleting) {
                // Typing
                span.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                positionEl.classList.remove("blinking"); // solid cursor

                if (charIndex === currentText.length) {
                    deleting = true;
                    positionEl.classList.add("blinking"); // blink during pause
                    setTimeout(typeEffect, 3000); // pause before deleting
                    return;
                }
            } else {
                // Deleting
                span.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                positionEl.classList.remove("blinking"); // solid cursor

                if (charIndex === 0) {
                    deleting = false;
                    textIndex = (textIndex + 1) % texts.length; // next text
                }
            }

            setTimeout(typeEffect, deleting ? 25 : 100); // typing speed vs deleting speed
        }

        typeEffect();
    };

    // 1. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const homeSection = document.getElementById('home');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (pageYOffset >= sectionTop - window.innerHeight / 4) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // SCROLL TO TOP BUTTON VISIBILITY
    const scrollTopObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    });
    scrollTopObserver.observe(homeSection);

    // SCROLL TO TOP BUTTON CLICK EVENT
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // === 3. FADE-IN SECTION ANIMATION ===
    const animationObserverOptions = {
        root: null,
        rootMargin: '-15% 0px -15% 0px', // Trigger when section is 20% into viewport
        threshold: 0 // Use 0 threshold with rootMargin for better control
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When section enters the viewport, make it visible after a delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            } else {
                // When section leaves the viewport...
                // Check if it's leaving by scrolling UP (the section is now below the viewport)
                if (entry.boundingClientRect.top > 0) {
                    // If so, hide it again so it can re-animate on next scroll down
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, animationObserverOptions);

    sections.forEach(section => {
        if (section.id !== 'home') {
            animationObserver.observe(section);
        }
    });

    // === 4. PROJECT MODAL (POP-UP) LOGIC (REVISED) ===

    const openModalButtons = document.querySelectorAll('[data-project-id]');
    const allModals = document.querySelectorAll('.modal-overlay');

    const closeModal = () => {
        const visibleModal = document.querySelector('.modal-overlay.visible');
        if (visibleModal) {
            visibleModal.classList.remove('visible');
            const video = visibleModal.querySelector("video");
            if (video) {
                video.pause();
            }
        }
        document.body.classList.remove('modal-open');
        if (history.state && history.state.modalOpen) {
            history.back();
        }
    };

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.projectId;
            const modalToOpen = document.getElementById(projectId + '-modal');

            if (modalToOpen) {
                modalToOpen.classList.add('visible');
                document.body.classList.add('modal-open');
                history.pushState({ modalOpen: true }, '');
                
                // Reset scroll to top when opening
                const modalContent = modalToOpen.querySelector('.modal');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
                const video = modalToOpen.querySelector("video");
                if (video) {
                    video.currentTime = 0;
                    video.play();
                }
            }
        });
    });

    allModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    window.addEventListener("popstate", (event) => {
        if (event.state && event.state.modalOpen) {
            closeModal();
        }
    });


    // --- Image Slider Functionality (for the recommendation system modal) ---
    function initializeSlider(modal) {
        const sliderContainer = modal.querySelector('.slider-container');
        if (!sliderContainer) return;

        const slides = Array.from(modal.querySelectorAll('.slide'));
        const prevBtn = modal.querySelector('.prev-btn');
        const nextBtn = modal.querySelector('.next-btn');
        const caption = modal.querySelector('.image-caption');
        let currentSlide = 0;

        const captionsMap = {
            'le-modal': [
                "Project Flowchart",
                "Residual vs Fitted Plot of The Best Model",
                "QQ-Plot of The Best Model",
            ],
            'rs-modal': [
                "Project Flowchart",
                "Iteration Plot, showing MAPE over iterations.",
                "Factors Accuracy"
            ],
            'dv-modal': [
                "1. Walmart Sales Analysis Dashboard"
            ],
            'lc-modal': [
                "Project Flowchart",
                "BERT + Logistic Regression Accuracy"
            ]
        };
        const captions = captionsMap[modal.id] || [];

        // Measure slide height and apply it to the wrapper
        const measureAndSetHeight = () => {
            const currentSlideEl = slides[currentSlide];
            if (currentSlideEl) {
                const media = currentSlideEl.querySelector('img, video');
                if (media && media.complete) {
                    sliderContainer.style.height = media.getBoundingClientRect().height + 'px';
                } else if (media) {
                    media.onload = () => {
                        sliderContainer.style.height = media.getBoundingClientRect().height + 'px';
                    };
                }
            }
        };

        const updateUI = (targetIndex, options = {}) => {
            const offset = -targetIndex * 100;
            sliderContainer.style.transform = `translateX(${offset}%)`;

            if (caption) caption.textContent = captions[targetIndex] || '';
            currentSlide = targetIndex;

            if (!options.skipMeasure) {
                measureAndSetHeight();
            }
        };

        if (slides.length > 0) {
            nextBtn && nextBtn.addEventListener('click', () => {
                const nextIndex = (currentSlide + 1) % slides.length;
                updateUI(nextIndex);
            });

            prevBtn && prevBtn.addEventListener('click', () => {
                const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                updateUI(prevIndex);
            });

            // Recompute height when window resizes (keeps responsive images correct)
            window.addEventListener('resize', () => {
                measureAndSetHeight(slides[currentSlide]);
            });

            // Initialize: set wrapper height to the first slide's height
            updateUI(0, { skipMeasure: true });
        }
    }


    // Initialize sliders 
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        initializeSlider(modal);
    });

    // Dynamically set --home-section-height to match #home section
    function setHomeSectionHeight() {
        var home = document.getElementById('home');
        if (home) {
            document.documentElement.style.setProperty('--home-section-height', home.offsetHeight + 'px');
        }
    }
    window.addEventListener('DOMContentLoaded', setHomeSectionHeight);
    window.addEventListener('resize', setHomeSectionHeight);
});
