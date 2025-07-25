// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.loan-nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.hash) {
            e.preventDefault();
            document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
// Parallax effect for hero background
const heroParallax = document.querySelector('.hero-parallax');
window.addEventListener('scroll', () => {
    if (heroParallax) {
        heroParallax.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
}); 