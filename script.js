// ===== Constants =====
const EDUCATION_INCREASE_RATE = 0.3074; // %30.74 artış
const DISCOUNT_RATES = {
    cash: 0.08,        // Peşin %8
    ccSingle: 0.06,    // K.K. Tek Çekim %6
    cc8Installment: 0.03  // K.K. 8 Taksit %3
};

// ===== DOM Elements =====
const prevEducationInput = document.getElementById('prevEducationFee');
const prevMealInput = document.getElementById('prevMealFee');
const newMealInput = document.getElementById('newMealFee');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function calculateNewEducationFee(prevFee) {
    return prevFee * (1 + EDUCATION_INCREASE_RATE);
}

function calculateDiscountedEducation(educationFee, discountRate) {
    return educationFee * (1 - discountRate);
}

// ===== Main Calculation Function =====
function calculate() {
    // Get input values
    const prevEducation = parseFloat(prevEducationInput.value) || 0;
    const prevMeal = parseFloat(prevMealInput.value) || 0;
    const newMeal = parseFloat(newMealInput.value) || 0;

    // Validate inputs
    if (prevEducation <= 0) {
        showError('Lütfen geçerli bir önceki yıl eğitim ücreti giriniz.');
        return;
    }

    // Calculate new education fee with 30.74% increase
    const newEducation = calculateNewEducationFee(prevEducation);

    // Calculate discounted education fees
    const cashEducation = calculateDiscountedEducation(newEducation, DISCOUNT_RATES.cash);
    const ccSingleEducation = calculateDiscountedEducation(newEducation, DISCOUNT_RATES.ccSingle);
    const cc8Education = calculateDiscountedEducation(newEducation, DISCOUNT_RATES.cc8Installment);

    // Calculate total amounts (education + meal)
    const noDiscountTotal = newEducation + newMeal;
    const cashTotal = cashEducation + newMeal;
    const ccSingleTotal = ccSingleEducation + newMeal;
    const cc8Total = cc8Education + newMeal;

    // Calculate savings
    const cashSavings = noDiscountTotal - cashTotal;
    const ccSingleSavings = noDiscountTotal - ccSingleTotal;
    const cc8Savings = noDiscountTotal - cc8Total;

    // Calculate monthly installment for 8-installment option
    const cc8Monthly = cc8Total / 8;

    // Update UI
    updateResults({
        prevEducation,
        newEducation,
        newMeal,
        cashEducation,
        ccSingleEducation,
        cc8Education,
        noDiscountTotal,
        cashTotal,
        ccSingleTotal,
        cc8Total,
        cashSavings,
        ccSingleSavings,
        cc8Savings,
        cc8Monthly
    });

    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Scroll to results with smooth animation
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateResults(data) {
    // Info card
    document.getElementById('displayPrevEducation').textContent = formatCurrency(data.prevEducation);
    document.getElementById('displayNewEducation').textContent = formatCurrency(data.newEducation);

    // Cash payment
    document.getElementById('cashEducation').textContent = formatCurrency(data.cashEducation);
    document.getElementById('cashMeal').textContent = formatCurrency(data.newMeal);
    document.getElementById('cashTotal').textContent = formatCurrency(data.cashTotal);
    document.getElementById('cashSavings').textContent = formatCurrency(data.cashSavings);

    // Credit card single payment
    document.getElementById('ccSingleEducation').textContent = formatCurrency(data.ccSingleEducation);
    document.getElementById('ccSingleMeal').textContent = formatCurrency(data.newMeal);
    document.getElementById('ccSingleTotal').textContent = formatCurrency(data.ccSingleTotal);
    document.getElementById('ccSingleSavings').textContent = formatCurrency(data.ccSingleSavings);

    // Credit card 8 installments
    document.getElementById('cc8Education').textContent = formatCurrency(data.cc8Education);
    document.getElementById('cc8Meal').textContent = formatCurrency(data.newMeal);
    document.getElementById('cc8Total').textContent = formatCurrency(data.cc8Total);
    document.getElementById('cc8Monthly').textContent = formatCurrency(data.cc8Monthly);
    document.getElementById('cc8Savings').textContent = formatCurrency(data.cc8Savings);

    // Comparison table
    document.getElementById('noDiscountTotal').textContent = formatCurrency(data.noDiscountTotal);
    document.getElementById('compCashTotal').textContent = formatCurrency(data.cashTotal);
    document.getElementById('compCcSingleTotal').textContent = formatCurrency(data.ccSingleTotal);
    document.getElementById('compCc8Total').textContent = formatCurrency(data.cc8Total);
}

function showError(message) {
    // Create error toast
    const existingToast = document.querySelector('.error-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <span class="toast-icon">⚠️</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(239, 68, 68, 0.4);
        z-index: 1000;
        animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Event Listeners =====
calculateBtn.addEventListener('click', calculate);

// Allow Enter key to trigger calculation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
});

// Auto-fill new meal fee when previous meal fee changes (optional convenience)
prevMealInput.addEventListener('change', () => {
    if (!newMealInput.value && prevMealInput.value) {
        // Suggest a slightly higher meal fee as placeholder
        const prevMeal = parseFloat(prevMealInput.value);
        if (prevMeal > 0) {
            newMealInput.placeholder = `Örn: ${Math.round(prevMeal * 1.3)}`;
        }
    }
});
