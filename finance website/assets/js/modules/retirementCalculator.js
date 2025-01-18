let retirementChart = null;

export function initRetirementCalculator() {
    const calculateBtn = document.getElementById('calculate-retirement');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', calculateRetirement);
    initFAQAccordion();
}

function calculateRetirement() {
    const currentAge = parseInt(document.getElementById('current-age').value) || 0;
    const retirementAge = parseInt(document.getElementById('retirement-age').value) || 0;
    const lifeExpectancy = parseInt(document.getElementById('life-expectancy').value) || 0;
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
    const inflationRate = parseFloat(document.getElementById('inflation-rate').value) || 6;
    const returnRate = parseFloat(document.getElementById('return-rate').value) || 12;

    // Validate inputs
    if (!validateInputs(currentAge, retirementAge, lifeExpectancy, monthlyExpenses)) {
        return;
    }

    const retirementData = calculateRetirementNeeds(
        currentAge,
        retirementAge,
        lifeExpectancy,
        monthlyExpenses,
        inflationRate,
        returnRate
    );

    updateResults(retirementData);
    updateChart(retirementData);
}

function validateInputs(currentAge, retirementAge, lifeExpectancy, monthlyExpenses) {
    if (currentAge <= 0 || retirementAge <= 0 || lifeExpectancy <= 0 || monthlyExpenses <= 0) {
        alert('Please fill in all fields with valid values');
        return false;
    }
    if (currentAge >= retirementAge) {
        alert('Retirement age must be greater than current age');
        return false;
    }
    if (retirementAge >= lifeExpectancy) {
        alert('Life expectancy must be greater than retirement age');
        return false;
    }
    return true;
}

function calculateRetirementNeeds(currentAge, retirementAge, lifeExpectancy, monthlyExpenses, inflationRate, returnRate) {
    const yearsToRetirement = retirementAge - currentAge;
    const retirementDuration = lifeExpectancy - retirementAge;
    
    // Calculate future monthly expenses at retirement
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate/100, yearsToRetirement);
    
    // Calculate total corpus needed at retirement
    const monthlyRate = returnRate / 12 / 100;
    const numberOfMonths = retirementDuration * 12;
    const corpusNeeded = calculateCorpusNeeded(futureMonthlyExpenses, monthlyRate, numberOfMonths);
    
    // Calculate required monthly savings
    const requiredMonthlySavings = calculateRequiredSavings(corpusNeeded, yearsToRetirement * 12, returnRate/12/100);

    return {
        requiredMonthlySavings,
        corpusNeeded,
        monthlyPension: futureMonthlyExpenses,
        savingsData: generateSavingsData(yearsToRetirement, requiredMonthlySavings, returnRate)
    };
}

function calculateCorpusNeeded(monthlyExpense, monthlyRate, months) {
    // Using the formula for present value of an annuity
    const corpus = monthlyExpense * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
    return corpus;
}

function calculateRequiredSavings(targetAmount, months, monthlyRate) {
    // Using the formula for future value of an annuity
    const savings = targetAmount * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));
    return savings;
}

function generateSavingsData(years, monthlySavings, annualRate) {
    const data = {
        labels: [],
        savings: [],
        totalValue: []
    };

    let currentValue = 0;
    const monthlyRate = annualRate / 12 / 100;

    for (let year = 0; year <= years; year++) {
        data.labels.push(`Year ${year}`);
        data.savings.push(monthlySavings * 12 * year);
        data.totalValue.push(currentValue);

        // Calculate next year's value
        for (let month = 0; month < 12; month++) {
            currentValue = (currentValue + monthlySavings) * (1 + monthlyRate);
        }
    }

    return data;
}

function updateResults(data) {
    document.getElementById('required-savings').textContent = 
        `₹${formatNumber(data.requiredMonthlySavings)}`;
    document.getElementById('retirement-corpus').textContent = 
        `₹${formatNumber(data.corpusNeeded)}`;
    document.getElementById('monthly-pension').textContent = 
        `₹${formatNumber(data.monthlyPension)}`;
}

function updateChart(data) {
    const ctx = document.getElementById('retirementChart');
    if (!ctx) return;

    if (retirementChart) {
        retirementChart.destroy();
    }

    retirementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.savingsData.labels,
            datasets: [
                {
                    label: 'Portfolio Value',
                    data: data.savingsData.totalValue,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true
                },
                {
                    label: 'Total Savings',
                    data: data.savingsData.savings,
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

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.fa-chevron-down');
        
        question.addEventListener('click', () => {
            // Toggle current item
            answer.style.maxHeight = answer.style.maxHeight ? null : answer.scrollHeight + 'px';
            item.classList.toggle('active');
            icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.fa-chevron-down').style.transform = 'rotate(0)';
                }
            });
        });
    });
}
