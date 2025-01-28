let investmentChart = null;

export function initInvestmentCalculator() {
    const calculateBtn = document.getElementById('calculate-investment');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', calculateInvestment);
}

function calculateInvestment() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
    const investmentPeriod = parseInt(document.getElementById('investment-period').value) || 0;
    const expectedReturn = parseFloat(document.getElementById('expected-return').value) || 0;

    if (investmentPeriod <= 0) {
        alert('Please enter a valid investment period');
        return;
    }

    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = investmentPeriod * 12;
    const investmentData = calculateInvestmentGrowth(
        initialInvestment,
        monthlyInvestment,
        monthlyRate,
        totalMonths
    );

    updateResults(investmentData);
    updateChart(investmentData);
}

function calculateInvestmentGrowth(initial, monthly, rate, months) {
    const data = {
        labels: [],
        invested: [],
        totalValue: []
    };

    let currentValue = initial;
    let totalInvested = initial;

    for (let i = 0; i <= months; i += 12) {
        data.labels.push(`Year ${i / 12}`);
        data.invested.push(totalInvested);
        data.totalValue.push(currentValue);

        for (let j = 0; j < 12 && i + j < months; j++) {
            currentValue = (currentValue + monthly) * (1 + rate);
            totalInvested += monthly;
        }
    }

    return data;
}

function updateResults(data) {
    const lastIndex = data.invested.length - 1;
    const totalInvestment = data.invested[lastIndex];
    const finalAmount = data.totalValue[lastIndex];
    const returns = finalAmount - totalInvestment;

    document.getElementById('total-investment').textContent = 
        `₹${formatNumber(totalInvestment)}`;
    document.getElementById('expected-returns').textContent = 
        `₹${formatNumber(returns)}`;
    document.getElementById('final-amount').textContent = 
        `₹${formatNumber(finalAmount)}`;
}

function updateChart(data) {
    const ctx = document.getElementById('investmentGrowthChart');
    if (!ctx) return;

    if (investmentChart) {
        investmentChart.destroy();
    }

    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Total Value',
                    data: data.totalValue,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true
                },
                {
                    label: 'Amount Invested',
                    data: data.invested,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ₹${formatNumber(context.parsed.y)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `₹${formatNumber(value)}`
                    }
                }
            }
        }
    });
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(num);
}
