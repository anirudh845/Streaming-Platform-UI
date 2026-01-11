
// -------------------------------------------------------------------
//    MOVIE SLIDER PART
// -------------------------------------------------------------------

const movieSlider = document.querySelector('.movie-slider');
const leftArrowButton = document.querySelector('.arrow-left');
const rightArrowButton = document.querySelector('.arrow-right');

// Detect device type
const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 480) return 'mobile';      // Mobile: <480px
    else if (width <= 768) return 'tablet'; // Tablet: 480-768px  
    else return 'desktop';                  // Desktop: >768px
};

// Different scroll amounts for each device
const getScrollAmount = () => {
    const device = getDeviceType();
    
    switch(device) {
        case 'mobile':   // <480px
            // Mobile: scroll 3 posters
            return (140 + 15) * 2; // = 465px
        
        case 'tablet':   // 480-768px (iPad)
            // Tablet: scroll 4 posters (more like laptop)
            return (160 + 20) * 5; // = 720px
        
        case 'desktop':  // >768px (Laptop)
            // Desktop: scroll to end (original behavior)
            return movieSlider.scrollWidth - movieSlider.clientWidth;
        
        default:
            return (200 + 25) * 5;
    }
};

const checkArrowVisibility = () => {
    let currentPosition = movieSlider.scrollLeft;
    let maxPossibleScroll = movieSlider.scrollWidth - movieSlider.clientWidth;

    const buffer = 80;

    if (currentPosition <= (-20 + buffer)) {
        // At start: Hide left, show right
        leftArrowButton.style.opacity = "0";
        leftArrowButton.style.pointerEvents = "none";
        rightArrowButton.style.opacity = "1";
        rightArrowButton.style.pointerEvents = "auto";
    }
    else if (currentPosition >= (maxPossibleScroll - buffer)) {
        // At end: Show left, hide right
        leftArrowButton.style.opacity = "1";
        leftArrowButton.style.pointerEvents = "auto";
        rightArrowButton.style.opacity = "0";
        rightArrowButton.style.pointerEvents = "none";
    }
    else {
        // In middle: Show both
        leftArrowButton.style.opacity = "1";
        leftArrowButton.style.pointerEvents = "auto";
        rightArrowButton.style.opacity = "1";
        rightArrowButton.style.pointerEvents = "auto";
    }

    return {
        currentPos: currentPosition,
        maxScroll: maxPossibleScroll
    };
};

rightArrowButton.addEventListener('click', () => {
    const device = getDeviceType();
    const scrollAmount = getScrollAmount();
    const currentScroll = movieSlider.scrollLeft;
    const maxScroll = movieSlider.scrollWidth - movieSlider.clientWidth;
    
    let newScroll;
    
    if (device === 'desktop') {
        // Desktop: Jump to end
        newScroll = maxScroll;
    } else {
        // Mobile/Tablet: Incremental scroll
        newScroll = currentScroll + scrollAmount;
        if (newScroll > maxScroll) {
            newScroll = maxScroll;
        }
    }
    
    movieSlider.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });

    checkArrowVisibility();

    setTimeout(() => {
        checkArrowVisibility();
    }, 350);
});

leftArrowButton.addEventListener('click', () => {
    const scrollAmount = getScrollAmount();
    const currentScroll = movieSlider.scrollLeft;
    
    // Don't scroll before the start
    let newScroll = currentScroll - scrollAmount;
    if (newScroll < 0) {
        newScroll = 0;
    }
    
    movieSlider.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });

    checkArrowVisibility();

    setTimeout(() => {
        checkArrowVisibility();
    }, 350);
});

movieSlider.addEventListener('scroll', checkArrowVisibility);

// Update arrow visibility on window resize
window.addEventListener('resize', checkArrowVisibility);

// Initial check
checkArrowVisibility();

// --------------------------------------------------------------------
//     FAQ SECTION 
// --------------------------------------------------------------------

// Access all DOM FAQ Buttons
const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach((button) => {
    button.addEventListener('click', () => {

        const faqAnswer = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        faqButtons.forEach(otherButton => {

            if (otherButton === button) return;

            if (otherButton.getAttribute('aria-expanded') === 'true') {
                const otherAnswer = otherButton.nextElementSibling;

                otherAnswer.setAttribute('aria-expanded', 'false');
                otherAnswer.classList.remove('open');
                otherAnswer.style.maxHeight = otherAnswer.scrollHeight + 'px';

                requestAnimationFrame(() => {
                    otherAnswer.style.maxHeight = '0';
                });

                setTimeout(() => {
                    otherAnswer.setAttribute('hidden', '');
                }, 300);
            }
        });


        button.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
            // CLOSING - FAQ is open, need to close it
            faqAnswer.classList.remove('open'); // Remove padding class
            faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px'; // Set current height

            requestAnimationFrame(() => {
                faqAnswer.style.maxHeight = '0'; // Animate to 0
            });

            setTimeout(() => {
                faqAnswer.setAttribute('hidden', ''); // Hide after animation completes
            }, 300);
        }

        else {
            // OPENING - FAQ is closed, need to open it
            faqAnswer.removeAttribute('hidden'); // Make visible
            faqAnswer.style.maxHeight = '0'; // Start at 0

            requestAnimationFrame(() => {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px'; // Animate to full height
                faqAnswer.classList.add('open'); // Add padding class
            });
        }
    })
});