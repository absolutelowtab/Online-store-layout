class ArdorBank {
    constructor() {
        // Преобразуем баланс в число при загрузке
        this.balance = parseFloat(localStorage.getItem('ardor-bank-balance')) || 0;
        this.transactions = JSON.parse(localStorage.getItem('ardor-transactions')) || [];
        this.init();
    }

    init() {
        this.renderBalance();
        this.renderTransactions();
        this.setupListeners();
    }

    setupListeners() {
        // Кнопки действий
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', e => this.showTransactionModal(e));
        });
        
        // Подтверждение операции
        document.querySelector('.confirm-btn').addEventListener('click', () => this.processTransaction());
        
        // Кнопка отмены
        document.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal());
        
        // Переводы между пользователями
        document.querySelector('.quick-transfer button').addEventListener('click', () => this.handleTransfer());
    }

    showTransactionModal(e) {
        const type = e.target.dataset.action;
        this.currentTransaction = {
            type,
            amount: 0,
            timestamp: new Date()
        };
        
        document.getElementById('bank-modal').style.display = 'block';
        document.querySelector('.transaction-details').innerHTML = `
            <p>Тип: ${type === 'deposit' ? 'Пополнение' : 'Вывод'}</p>
            <input type="number" id="transaction-amount" 
                   placeholder="Сумма (₽)" 
                   class="ardor-input"
                   autofocus>
        `;
    }

    processTransaction() {
        const amountInput = document.getElementById('transaction-amount');
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount <= 0) {
            alert('Введите корректную сумму!');
            return;
        }

        if (this.currentTransaction.type === 'withdraw' && amount > this.balance) {
            alert('Недостаточно средств!');
            return;
        }

        // Обновляем баланс
        this.balance = this.currentTransaction.type === 'deposit' 
            ? this.balance + amount 
            : this.balance - amount;
        
        // Добавляем транзакцию
        this.transactions.push({
            ...this.currentTransaction,
            amount,
            status: 'completed'
        });

        this.updateStorage();
        this.closeModal();
    }

    handleTransfer() {
        // Логика P2P переводов (пока оставим пустым)
        alert('Функция переводов в разработке');
    }

    renderBalance() {
        document.getElementById('current-balance').textContent = 
            this.balance.toLocaleString('ru-RU');
    }

    renderTransactions() {
        const list = document.querySelector('.transactions-list');
        list.innerHTML = this.transactions.map(t => {
            // Форматируем дату для отображения
            const date = new Date(t.timestamp);
            const formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="transaction-item ${t.type}">
                    <div>
                        <span class="transaction-type">${t.type === 'deposit' ? '↑' : '↓'}</span>
                        ${formattedDate}
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'deposit' ? '+' : '-'}${t.amount.toLocaleString('ru-RU')} ₽
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStorage() {
        // Сохраняем баланс как число
        localStorage.setItem('ardor-bank-balance', this.balance);
        localStorage.setItem('ardor-transactions', JSON.stringify(this.transactions));
        this.renderBalance();
        this.renderTransactions();
    }

    // OpenModal() {
    //     document.querySelectorAll('.modal-open')[0].addEventListener('click', ()=> {
    //       document.getElementById('bank-modal').style.display = 'block';
    //     })
    // }

    closeModal() {
        document.getElementById('bank-modal').style.display = 'none';
        this.currentTransaction = null;
    }
}

// Инициализация банка
document.addEventListener('DOMContentLoaded', () => new ArdorBank());