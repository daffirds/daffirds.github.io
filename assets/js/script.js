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
    };

    // 1. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const homeSection = document.getElementById('home');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                let topPos = targetSection.offsetTop;

                // === FIX APPLIED HERE ===
                // If the target section is not yet visible (and not the home section),
                // it is transformed down by 40px. We must subtract this from the
                // calculated position to land in the correct spot.
                if (!targetSection.classList.contains('visible') && targetId !== '#home') {
                    topPos -= 40;
                }
                
                window.scrollTo({
                    top: topPos,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                let targetId = entry.target.id;
                
                // If the current section is 'highlight', activate the 'projects' link
                if (targetId === 'highlight') {
                    targetId = 'projects';
                }

                const correspondingLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => navObserver.observe(section));

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

    /* 2. Highlight Slider
    const sliderWrapper = document.querySelector('.highlight-slider-wrapper');
    if (sliderWrapper) {
        const track = sliderWrapper.querySelector('.highlight-track');
        const slides = Array.from(track.children);
        const nextButton = sliderWrapper.querySelector('.next-arrow');
        const prevButton = sliderWrapper.querySelector('.prev-arrow');
        const dotsNav = sliderWrapper.querySelector('.slider-dots');
        
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Create dots
        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('current-slide');
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        const moveToSlide = (currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // Arrange slides next to one another
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        });

        const moveToNext = () => {
            const currentSlide = track.querySelector('.current-slide');
            let nextSlide = currentSlide.nextElementSibling;
            if (!nextSlide) {
                nextSlide = slides[0];
            }
            const currentDot = dotsNav.querySelector('.current-slide');
            let nextDot = currentDot.nextElementSibling;
            if (!nextDot) {
                nextDot = dots[0];
            }
            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        };

        // Autoscroll functionality
        let autoScrollInterval;
        const startAutoScroll = () => {
            stopAutoScroll(); // Prevent multiple intervals
            autoScrollInterval = setInterval(moveToNext, 3000); // 3 seconds
        };
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // When I click right, move slides to the left
        nextButton.addEventListener('click', e => {
            moveToNext();
            startAutoScroll(); // Reset timer
        });

        // When I click left, move slides to the right
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            let prevSlide = currentSlide.previousElementSibling;
            if (!prevSlide) {
                prevSlide = slides[slides.length - 1];
            }
            const currentDot = dotsNav.querySelector('.current-slide');
            let prevDot = currentDot.previousElementSibling;
            if (!prevDot) {
                prevDot = dots[dots.length - 1];
            }
            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            startAutoScroll(); // Reset timer
        });

        // When I click the nav indicators, move to that slide
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button.slider-dot');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            startAutoScroll(); // Reset timer
        });

        // Pause on hover
        sliderWrapper.addEventListener('mouseenter', stopAutoScroll);
        sliderWrapper.addEventListener('mouseleave', startAutoScroll);

        // Start the autoscroll
        startAutoScroll();
    }
    */

    // === 3. FADE-IN SECTION ANIMATION ===
    const animationObserverOptions = {
        root: null,
        threshold: 0.15 // Trigger when 15% of the section is visible
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

});
