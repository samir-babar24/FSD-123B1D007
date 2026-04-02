const ChartManager = {
    comparisonChart: null,
    categoryChart: null,
    trendChart: null,

    initCharts: function(income, expense, categoryData, trendData) {
        this.renderTrendChart(trendData);
        this.renderCategoryChart(categoryData);
        this.renderComparisonChart(income, expense);
    },

    // 1. Trend Chart (Line) - The Big One
    renderTrendChart: function(trendData) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        if (this.trendChart) this.trendChart.destroy();

        // Neon Glow Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [{
                    label: 'Spending',
                    data: trendData.data,
                    borderColor: '#818cf8', // Indigo Light
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#6366f1',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    },

    // 2. Category Chart (Bar) - Vertical
    renderCategoryChart: function(categoryData) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        if (this.categoryChart) this.categoryChart.destroy();

        this.categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: 'Spent',
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
                    ],
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { display: false }, ticks: { display: false } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: {size: 10} } }
                }
            }
        });
    },

    // 3. Comparison (Doughnut) - Small Minimal
    renderComparisonChart: function(income, expense) {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        if (this.comparisonChart) this.comparisonChart.destroy();

        this.comparisonChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: ['#10b981', '#3b82f6'],
                    borderWidth: 0,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true } } }
            }
        });
    }
};