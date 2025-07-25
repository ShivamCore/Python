document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const inputs = form.querySelectorAll('input, textarea');
    // Floating label animation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
        if (input.value) input.classList.add('has-value');
    });
    // Basic validation
    form.addEventListener('submit', function(e) {
        let valid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                valid = false;
            } else {
                input.classList.remove('invalid');
            }
        });
        if (!valid) {
            e.preventDefault();
        }
    });
}); 