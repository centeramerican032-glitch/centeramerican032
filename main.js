// Carousel Functionality
let currentCarouselIndex = 0;
const carouselItems = document.querySelectorAll('.carousel-item');
const carouselContainer = document.querySelector('.carousel');

function showCarouselSlide(index) {
  if (carouselItems.length === 0) return;
  
  if (index >= carouselItems.length) currentCarouselIndex = 0;
  if (index < 0) currentCarouselIndex = carouselItems.length - 1;

  carouselItems.forEach(item => item.classList.remove('active'));
  carouselItems[currentCarouselIndex].classList.add('active');

  updateCarouselDots();
}

function updateCarouselDots() {
  const dotsContainer = document.getElementById('carouselDots');
  if (!dotsContainer || carouselItems.length === 0) return;

  dotsContainer.innerHTML = '';
  carouselItems.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${index === currentCarouselIndex ? 'active' : ''}`;
    dot.onclick = () => {
      currentCarouselIndex = index;
      showCarouselSlide(currentCarouselIndex);
    };
    dotsContainer.appendChild(dot);
  });
}

function nextCarouselSlide() {
  currentCarouselIndex++;
  showCarouselSlide(currentCarouselIndex);
}

function prevCarouselSlide() {
  currentCarouselIndex--;
  showCarouselSlide(currentCarouselIndex);
}

// Auto-rotate carousel every 6 seconds
let carouselInterval;
function startCarouselAutoRotate() {
  if (carouselItems.length > 1) {
    carouselInterval = setInterval(() => {
      nextCarouselSlide();
    }, 6000);
  }
}

function resetCarouselTimer() {
  clearInterval(carouselInterval);
  startCarouselAutoRotate();
}

// Carousel Event Listeners
if (document.getElementById('carouselNext')) {
  document.getElementById('carouselNext').addEventListener('click', () => {
    nextCarouselSlide();
    resetCarouselTimer();
  });
}

if (document.getElementById('carouselPrev')) {
  document.getElementById('carouselPrev').addEventListener('click', () => {
    prevCarouselSlide();
    resetCarouselTimer();
  });
}

// Initialize carousel
if (carouselItems.length > 0) {
  showCarouselSlide(currentCarouselIndex);
  startCarouselAutoRotate();

  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carouselContainer.addEventListener('mouseleave', startCarouselAutoRotate);
  }
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Floating Action Buttons - Sticky Position
const fabContainer = document.querySelector('.fab-container');
const backToTop = document.querySelector('.back-to-top');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;

  // Show/hide FAB based on scroll position
  if (lastScrollY > 300) {
    if (fabContainer) {
      fabContainer.style.opacity = '1';
      fabContainer.style.pointerEvents = 'auto';
    }
    if (backToTop) backToTop.classList.add('visible');
  } else {
    if (fabContainer) fabContainer.style.opacity = '0.7';
    if (backToTop) backToTop.classList.remove('visible');
  }

  // Update progress bar
  updateProgressBar();
});

// Progress Bar (for articles)
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  progressBar.style.width = scrolled + '%';
}

// Table of Contents Generation
function generateTableOfContents() {
  const tocList = document.getElementById('tocList');
  if (!tocList) return;

  const article = document.querySelector('article');
  if (!article) return;

  const headings = article.querySelectorAll('h2, h3');
  
  tocList.innerHTML = '';
  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = heading.textContent;
    li.appendChild(a);

    if (heading.tagName === 'H3') {
      li.style.marginRight = '15px';
    }

    tocList.appendChild(li);

    // Add smooth scroll
    a.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Initialize TOC on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateTableOfContents);
} else {
  generateTableOfContents();
}

// Lightbox Functions (if gallery exists)
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImage = document.getElementById('lightboxImage');
  lightboxImage.src = src;
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function changeLightbox(n) {
  const images = document.querySelectorAll('.gallery-item img');
  const lightboxImage = document.getElementById('lightboxImage');

  const currentSrc = lightboxImage.src;
  let currentIndex = Array.from(images).findIndex(img => img.src === currentSrc);

  currentIndex += n;
  if (currentIndex >= images.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = images.length - 1;

  lightboxImage.src = images[currentIndex].src;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || lightbox.style.display !== 'block') return;

  if (e.key === 'ArrowLeft') changeLightbox(-1);
  if (e.key === 'ArrowRight') changeLightbox(1);
  if (e.key === 'Escape') closeLightbox();
});

// Click outside lightbox to close
window.addEventListener('click', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Lazy Loading for Images (if Intersection Observer is available)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Add animation on scroll for elements
if ('IntersectionObserver' in window) {
  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .feature, .step, .article-card, .gallery-item, .video-item').forEach(el => {
    elementObserver.observe(el);
  });
}

// Initialize on page load
window.addEventListener('load', () => {
  // Hide preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }

  updateProgressBar();
  if (carouselItems.length > 0) {
    showCarouselSlide(currentCarouselIndex);
  }
});

// Prevent console errors for missing elements
console.clear = () => {};

// Utility: Check if element exists before manipulating
function safeQuery(selector) {
  return document.querySelector(selector) || null;
}

function safeQueryAll(selector) {
  return document.querySelectorAll(selector) || [];
}

// Export functions for external use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showCarouselSlide,
    nextCarouselSlide,
    prevCarouselSlide,
    openLightbox,
    closeLightbox,
    changeLightbox,
    generateTableOfContents,
    updateProgressBar
  };
}
