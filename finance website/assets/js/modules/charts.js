export function initCharts() {
    // Initialize charts only when they become visible
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartId = entry.target.id;
                switch(chartId) {
                    case 'investmentChart':
                        renderInvestmentChart();
                        break;
                    case 'retirementChart':
                        renderRetirementChart();
                        break;
                    case 'taxChart':
                        renderTaxChart();
                        break;
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each chart canvas
    ['investmentChart', 'retirementChart', 'taxChart'].forEach(chartId => {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartObserver.observe(chartElement);
        }
    });
}

function renderInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Investment Growth (₹)',
                data: [100000, 120000, 150000, 200000, 250000, 300000],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 750 // Reduced animation duration
            },
            plugins: {
                legend: {
                    display: false // Remove legend if not necessary
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5, // Limit number of ticks
                        callback: value => '₹' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

function renderRetirementChart() {
    const ctx = document.getElementById('retirementChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Savings', 'Investments', 'Expenses'],
            datasets: [{
                data: [40, 35, 25],
                backgroundColor: ['#e67e22', '#3498db', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 750
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 5,
                    bottom: 15
                }
            }
        }
    });
}

function renderTaxChart() {
    const ctx = document.getElementById('taxChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Income Tax', 'GST', 'Property Tax', 'Capital Gains'],
            datasets: [{
                label: 'Taxes Paid (₹)',
                data: [50000, 30000, 20000, 15000],
                backgroundColor: ['#1abc9c', '#16a085', '#f39c12', '#e74c3c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 750
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 5,
                        callback: value => '₹' + value.toLocaleString()
                    }
                }
            }
        }
    });
}
