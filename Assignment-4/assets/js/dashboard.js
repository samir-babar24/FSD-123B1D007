document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    
    // Listen for deletes or updates
    window.addEventListener('dataChanged', loadDashboard);
    
    // Listen for filter changes
    document.getElementById('month-filter').addEventListener('change', loadDashboard);
});


function loadDashboard() {
    const allTransactions = DataManager.getTransactions();
    const filterValue = document.getElementById('month-filter').value;
    const transactions = filterTransactions(allTransactions, filterValue);

    // 1. Calculate Summaries
    let income = 0, expense = 0;
    const categoryTotals = {};

    transactions.forEach(t => {
        if (t.type === 'income') {
            income += t.amount;
        } else {
            expense += t.amount;
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        }
    });

    const balance = income - expense;

    // 2. Prepare Trend Data (Last 6 entries or grouped by day)
    // Simple logic: Group expenses by date for the line chart
    const trendMap = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            trendMap[t.date] = (trendMap[t.date] || 0) + t.amount;
        }
    });
    // Sort dates
    const sortedDates = Object.keys(trendMap).sort();
    const trendData = {
        labels: sortedDates,
        data: sortedDates.map(date => trendMap[date])
    };

    // 3. Update DOM
    document.getElementById('total-income').textContent = `$${income.toFixed(2)}`;
    document.getElementById('total-expense').textContent = `$${expense.toFixed(2)}`;
    document.getElementById('total-balance').textContent = `$${balance.toFixed(2)}`;

    // 4. Update Charts
    ChartManager.initCharts(income, expense, categoryTotals, trendData);

    renderTransactionList(transactions);
    populateMonthFilter(allTransactions);
}


function filterTransactions(transactions, filter) {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.date.startsWith(filter)); // filter format "YYYY-MM"
}

function renderTransactionList(transactions) {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    // Sort by date descending
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        list.innerHTML = '<li class="empty-state" style="padding:1rem; text-align:center; color:gray;">No data for this period.</li>';
        return;
    }

    sorted.slice(0, 5).forEach(t => { // Show last 5
        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
            <div class="t-info">
                <h5>${t.category}</h5>
                <span>${t.date} &bull; ${t.desc || 'No desc'}</span>
            </div>
            <div style="display:flex; align-items:center;">
                <span class="t-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </span>
                <i class="fa-solid fa-trash delete-btn" onclick="DataManager.deleteTransaction(${t.id})"></i>
            </div>
        `;
        list.appendChild(li);
    });
}

function populateMonthFilter(transactions) {
    const select = document.getElementById('month-filter');
    // Keep the "All Time" option, clear others
    if (select.options.length > 1) return; 

    const months = new Set();
    transactions.forEach(t => {
        // substring(0,7) gets "YYYY-MM"
        months.add(t.date.substring(0, 7));
    });

    Array.from(months).sort().reverse().forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        select.appendChild(option);
    });
}