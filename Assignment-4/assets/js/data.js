const DataManager = {
    STORAGE_KEY: 'finance_data_v1',

    // Get all transactions
    getTransactions: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Add a single transaction
    addTransaction: function(transaction) {
        const transactions = this.getTransactions();
        // Add ID for deletion purposes
        transaction.id = Date.now(); 
        transactions.push(transaction);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    },

    // Delete a transaction by ID
    deleteTransaction: function(id) {
        let transactions = this.getTransactions();
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
        // Dispatch event to update UI immediately if on dashboard
        window.dispatchEvent(new Event('dataChanged'));
    }
};