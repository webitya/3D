function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.querySelector('.mobile-menu').classList.toggle('open');
}
function toggleMenu() {
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    fullscreenMenu.classList.toggle('open');

    if (fullscreenMenu.classList.contains('open')) {
        document.body.style.overflow = 'auto'; // Allow page scrolling
    } else {
        document.body.style.overflow = 'auto'; // Ensure page scrolling is always enabled
    }
}
function handleMenuToggleKey(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        toggleMenu();
    } else if (event.key === 'Escape') {
        const fullscreenMenu = document.getElementById('fullscreen-menu');
        if (fullscreenMenu.classList.contains('open')) {
            fullscreenMenu.classList.remove('open');
        }
    }
}
// carousell movement//

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showNextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlidePosition();
}

function showPreviousSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlidePosition();
}

function updateSlidePosition() {
  const slideWidth = slides[0].clientWidth;
  document.querySelector('.carousel-slide').style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function toggleDropdownDetails() {
    const dropdownDetails = document.getElementById('dropdown-details');
    if (dropdownDetails.style.display === 'block') {
        dropdownDetails.style.display = 'none';
    } else {
        dropdownDetails.style.display = 'block';
    }
}