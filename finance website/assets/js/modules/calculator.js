export function initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('amount').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);

        if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
            showResult('Please enter valid values for all fields.', 'error');
            return;
        }

        if (amount <= 0 || rate <= 0 || years <= 0) {
            showResult('Please enter positive values for all fields.', 'error');
            return;
        }

        const result = calculateInvestment(amount, rate, years);
        showResult(`Future Value: ₹${result.toFixed(2)}`, 'success');
    });

    function calculateInvestment(principal, rate, time) {
        return principal * Math.pow(1 + rate, time);
    }

    function showResult(message, type) {
        const resultElement = document.getElementById('calculator-result');
        if (!resultElement) return;

        resultElement.textContent = message;
        resultElement.className = `result-box ${type}`;
    }
}
