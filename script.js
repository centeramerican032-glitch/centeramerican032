// Navigation
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('active')));

// Back to Top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.pageYOffset > 400));

// Counter Animation
const counters = document.querySelectorAll('.stat-number');
const animate = (el) => {
    const target = +el.dataset.target;
    const step = target / 50;
    let count = 0;
    const update = () => {
        count += step;
        el.textContent = count >= target ? target.toLocaleString() : Math.ceil(count);
        if (count < target) requestAnimationFrame(update);
    };
    update();
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); observer.unobserve(e.target); } });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// Reveal Animation
const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }, i * 50);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .article-card, .info-card').forEach(el => {
    el.style.cssText = 'opacity:0;transform:translateY(30px);transition:all 0.4s ease';
    reveal.observe(el);
});

// Form - WhatsApp
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const msg = encodeURIComponent(`طلب خدمة جديد
الاسم: ${document.getElementById('name').value}
الهاتف: ${document.getElementById('phone').value}
الخدمة: ${document.getElementById('service').value}
ملاحظات: ${document.getElementById('message').value}`);
    window.open('https://wa.me/50255870?text=' + msg, '_blank');
    this.reset();
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
}));
