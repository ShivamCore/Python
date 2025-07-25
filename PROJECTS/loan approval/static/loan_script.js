// Apple-inspired, modern, interactive loan approval JS

function showConfetti() {
    const confetti = document.getElementById('confetti');
    if (confetti) {
        confetti.style.display = 'block';
        setTimeout(() => confetti.style.display = 'none', 1800);
    }
}
function showResultAnimation(resultText) {
    const resultBox = document.getElementById('loan-result');
    resultBox.classList.remove('approved', 'rejected');
    if (/approved/i.test(resultText)) {
        resultBox.classList.add('approved');
        resultBox.innerHTML = `<span style='font-size:2.5rem;vertical-align:middle;'>✅</span><br>${resultText}`;
        showConfetti();
    } else {
        resultBox.classList.add('rejected');
        resultBox.innerHTML = `<span style='font-size:2.5rem;vertical-align:middle;'>❌</span><br>${resultText}`;
    }
    resultBox.style.display = 'block';
    resultBox.classList.add('show');
    setTimeout(() => resultBox.classList.remove('show'), 3000);
}
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loan-form');
    const resultBox = document.getElementById('loan-result');
    const messageBox = document.getElementById('loan-form-message');
    const inputs = form.querySelectorAll('input, select');

    // Floating label for selects
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
        // For autofill
        if (input.value) input.classList.add('has-value');
    });

    // Real-time validation
    form.addEventListener('input', function(e) {
        if (e.target.checkValidity()) {
            e.target.classList.remove('invalid');
        } else {
            e.target.classList.add('invalid');
        }
    });

    // Animated submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        messageBox.textContent = '';
        resultBox.style.display = 'none';
        let valid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                valid = false;
            }
        });
        if (!valid) {
            messageBox.textContent = 'Please fill all required fields correctly.';
            return;
        }
        // Animate button ripple
        const btn = form.querySelector('.loan-submit-btn');
        btn.disabled = true;
        btn.textContent = 'Processing...';
        btn.style.transform = 'scale(0.97)';
        // Ripple effect
        btn.classList.add('ripple');
        setTimeout(() => btn.classList.remove('ripple'), 400);
        // Gather form data
        const formData = new FormData(form);
        fetch('/loan_predict', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            btn.disabled = false;
            btn.textContent = 'Apply for Loan';
            btn.style.transform = '';
            if (data.error) {
                messageBox.textContent = data.error;
                return;
            }
            // Animate result
            showResultAnimation(data.result || 'Loan decision unavailable.');
        })
        .catch(() => {
            btn.disabled = false;
            btn.textContent = 'Apply for Loan';
            btn.style.transform = '';
            messageBox.textContent = 'Server error. Please try again.';
        });
    });
}); 