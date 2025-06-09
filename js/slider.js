
    // Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevSlide = document.querySelector('.prev-slide');
    const nextSlide = document.querySelector('.next-slide');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlideFunc() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlideFunc() {
        showSlide(currentSlide - 1);
    }
    
    nextSlide.addEventListener('click', nextSlideFunc);
    prevSlide.addEventListener('click', prevSlideFunc);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto slide change every 5 seconds
    let slideInterval = setInterval(nextSlideFunc, 5000);
    
    // Pause auto slide on hover
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlideFunc, 5000);
    });
