// Calculator Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const calculatorContents = document.querySelectorAll('.calculator-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        calculatorContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-calculator`).classList.add('active');
    });
});

// Loan Calculator
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const interest = parseFloat(document.getElementById('loan-interest').value) / 100 / 12; // Monthly interest rate
    const term = parseFloat(document.getElementById('loan-term').value) * 12; // Convert years to months

    if (amount && interest && term) {
        const monthlyPayment = (amount * interest * Math.pow(1 + interest, term)) / (Math.pow(1 + interest, term) - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;

        document.querySelector('#loan-result span:nth-child(1)').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.querySelector('#loan-result span:nth-child(2)').textContent = `$${totalPayment.toFixed(2)}`;
        document.querySelector('#loan-result span:nth-child(3)').textContent = `$${totalInterest.toFixed(2)}`;
    }
}

// Investment Calculator
function calculateInvestment() {
    const initial = parseFloat(document.getElementById('investment-initial').value);
    const monthly = parseFloat(document.getElementById('investment-monthly').value);
    const returnRate = parseFloat(document.getElementById('investment-return').value) / 100;
    const years = parseFloat(document.getElementById('investment-period').value);

    if (initial && returnRate && years) {
        const monthlyRate = returnRate / 12;
        const months = years * 12;
        
        // Calculate future value with monthly contributions
        let futureValue = initial;
        for (let i = 0; i < months; i++) {
            futureValue = (futureValue + monthly) * (1 + monthlyRate);
        }

        const totalContributions = initial + (monthly * months);
        const totalInterest = futureValue - totalContributions;

        document.querySelector('#investment-result span:nth-child(1)').textContent = `$${futureValue.toFixed(2)}`;
        document.querySelector('#investment-result span:nth-child(2)').textContent = `$${totalContributions.toFixed(2)}`;
        document.querySelector('#investment-result span:nth-child(3)').textContent = `$${totalInterest.toFixed(2)}`;
    }
}

// Mortgage Calculator
function calculateMortgage() {
    const price = parseFloat(document.getElementById('mortgage-price').value);
    const downPayment = parseFloat(document.getElementById('mortgage-down').value);
    const interest = parseFloat(document.getElementById('mortgage-interest').value) / 100 / 12;
    const term = parseFloat(document.getElementById('mortgage-term').value) * 12;

    if (price && downPayment && interest && term) {
        const principal = price - downPayment;
        const monthlyPayment = (principal * interest * Math.pow(1 + interest, term)) / (Math.pow(1 + interest, term) - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - principal;

        document.querySelector('#mortgage-result span:nth-child(1)').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.querySelector('#mortgage-result span:nth-child(2)').textContent = `$${totalPayment.toFixed(2)}`;
        document.querySelector('#mortgage-result span:nth-child(3)').textContent = `$${totalInterest.toFixed(2)}`;
    }
}

// Add input validation
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value < 0) {
            input.value = 0;
        }
    });
});
