/**
 * Womencypedia Analytics Dashboard
 * Uses Chart.js for data visualization
 */

// Initialize Charts
document.addEventListener('DOMContentLoaded', function () {
    initTrafficChart();
    initTopPagesChart();
    initGeoChart();
    initCategoryChart();
    updateLastUpdated();
});

function updateLastUpdated() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('last-updated').textContent = now.toLocaleDateString('en-US', options);
}

function initTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5'],
            datasets: [
                {
                    label: 'Page Views',
                    data: [18500, 22100, 19800, 24500, 23200, 26800],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Unique Visitors',
                    data: [2800, 3400, 3100, 3800, 3600, 4200],
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            family: 'Lato, sans-serif',
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Lato, sans-serif',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Lato, sans-serif',
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initTopPagesChart() {
    const ctx = document.getElementById('topPagesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Queen Amina',
                'Mary Seacole',
                'Hildegard of Bingen',
                'Cleopatra',
                'Yaa Asantewaa'
            ],
            datasets: [{
                label: 'Page Views',
                data: [12450, 9820, 8760, 7650, 6540],
                backgroundColor: [
                    '#7c3aed',
                    '#0d9488',
                    '#d97706',
                    '#7c3aed',
                    '#0d9488'
                ],
                borderRadius: 6,
                barThickness: 32
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Lato, sans-serif',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Playfair Display, serif',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initGeoChart() {
    const ctx = document.getElementById('geoChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'North America',
                'Europe',
                'Africa',
                'Asia',
                'South America',
                'Oceania'
            ],
            datasets: [{
                data: [32, 24, 18, 14, 8, 4],
                backgroundColor: [
                    '#7c3aed',
                    '#0d9488',
                    '#d97706',
                    '#7c3aed80',
                    '#0d948880',
                    '#d9770680'
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: {
                            family: 'Lato, sans-serif',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function initCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Leadership',
                'Science',
                'Arts & Culture',
                'Faith',
                'Enterprise',
                'Activism'
            ],
            datasets: [
                {
                    label: 'Page Views',
                    data: [85, 72, 68, 55, 78, 62],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.2)',
                    pointBackgroundColor: '#7c3aed',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#7c3aed',
                    borderWidth: 2
                },
                {
                    label: 'Avg. Time on Page',
                    data: [75, 82, 65, 70, 68, 72],
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.2)',
                    pointBackgroundColor: '#0d9488',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#0d9488',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: {
                            family: 'Lato, sans-serif',
                            size: 11
                        }
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    },
                    pointLabels: {
                        font: {
                            family: 'Lato, sans-serif',
                            size: 11
                        }
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

// Export functionality
document.querySelector('button').addEventListener('click', function () {
    // In a real implementation, this would generate and download a report
    alert('Report export functionality would be implemented here with backend support.');
});

// Refresh data functionality
function refreshData() {
    // In a real implementation, this would fetch fresh data from the API
    location.reload();
}

// Time range selector
document.querySelector('select').addEventListener('change', function (e) {
    const range = e.target.value;
    // In a real implementation, this would update the charts with data for the selected range
    console.log('Selected time range:', range);
});
