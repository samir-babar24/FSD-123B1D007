document.addEventListener('DOMContentLoaded', () => {
    loadHistory();

    // Listen for global delete events to refresh the list instantly
    window.addEventListener('dataChanged', loadHistory);
});

function loadHistory() {
    const list = document.getElementById('full-history-list');
    const countLabel = document.getElementById('entry-count');
    const transactions = DataManager.getTransactions();

    list.innerHTML = '';
    countLabel.textContent = `${transactions.length} entries found`;

    // Sort by Date (Newest First)
    const sorted = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding: 3rem; color: var(--text-secondary);">
                <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No records found.</p>
            </div>`;
        return;
    }

    sorted.forEach(t => {
        const li = document.createElement('li');
        li.className = 'transaction-item';
        
        // Icon logic
        const iconClass = t.category === 'Food' ? 'fa-burger' :
                          t.category === 'Rent' ? 'fa-house' :
                          t.category === 'Travel' ? 'fa-plane' :
                          t.category === 'Salary' ? 'fa-money-bill' : 'fa-bag-shopping';

        li.innerHTML = `
            <div class="t-details">
                <div class="t-icon">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="t-info">
                    <h4>${t.category}</h4>
                    <span>${formatDate(t.date)} • ${t.desc || 'No description'}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap: 15px;">
                <span class="t-amount ${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </span>
                <button onclick="deleteEntry(${t.id})" style="background:none; border:none; color:var(--text-secondary); cursor:pointer;">
                    <i class="fa-solid fa-trash hover-red"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Helper: Format Date nicely
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Delete function wrapper
function deleteEntry(id) {
    if(confirm('Are you sure you want to delete this record?')) {
        DataManager.deleteTransaction(id);
    }
}