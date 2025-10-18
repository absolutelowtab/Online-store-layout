document.addEventListener('DOMContentLoaded', function() {
    class Cart {
        constructor() {
            this.cart = this.loadCart();
            this.modal = document.getElementById('cart-modal');
            this.itemsContainer = document.getElementById('cart-items');
            this.totalElement = document.getElementById('cart-total');
            this.countElement = document.getElementById('cart-count');
            this.clearButton = document.getElementById('clear-cart');
            this.checkoutButton = document.getElementById('checkout-button');
            
            this.init();
        }
        
        init() {
            this.render();
            this.setupEventListeners();
            this.setupModal();
        }
        
        loadCart() {
            const cartData = sessionStorage.getItem('cart');
            return cartData ? JSON.parse(cartData) : [];
        }
        
        saveCart() {
            sessionStorage.setItem('cart', JSON.stringify(this.cart));
        }
        
        setupModal() {
            // Открытие/закрытие модалки
            document.getElementById('cart-button').addEventListener('click', () => {
                this.modal.style.display = 'block';
            });
            
            document.querySelector('.close-modal').addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.modal.style.display = 'none';
                }
            });
        }
        
        setupEventListeners() {
            // Обработчики для кнопок внутри корзины
            this.itemsContainer.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.cart-item');
                if (!itemElement) return;
                
                const id = itemElement.dataset.id;
                const item = this.cart.find(item => item.id == id);
                
                if (e.target.classList.contains('quantity-btn') && e.target.classList.contains('plus')) {
                    item.quantity++;
                    this.render();
                } else if (e.target.classList.contains('quantity-btn') && e.target.classList.contains('minus')) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        this.removeItem(id);
                        return;
                    }
                    this.render();
                } else if (e.target.classList.contains('remove-item')) {
                    this.removeItem(id);
                }
            });
            
            // Очистка корзины
            this.clearButton.addEventListener('click', () => {
                this.clearCart();
            });
            
            // Оформление заказа
            this.checkoutButton.addEventListener('click', () => {
                this.checkout();
            });
            
            // Добавление товаров
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productElement = e.target.closest('.product-card, .banner-content, .small-banner');
                    const id = e.target.dataset.id;
                    const name = productElement.querySelector('h3').textContent;
                    const priceText = productElement.querySelector('.current-price, .banner-price').textContent;
                    const price = parseInt(priceText.replace(/\D/g, ''));
                    const image = productElement.querySelector('img')?.src || 'img/no-image.jpg';
                    
                    this.addItem({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                    
                    this.showNotification(`${name} добавлен в корзину`);
                });
            });
        }
        
        addItem(product) {
            const existingItem = this.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push(product);
            }
            
            this.render();
        }
        
        removeItem(id) {
            this.cart = this.cart.filter(item => item.id != id);
            this.render();
        }
        
        clearCart() {
            this.cart = [];
            this.render();
        }
        
        checkout() {
            if (this.cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            alert(`Заказ оформлен! Сумма: ${this.getTotal()} ₽`);
            this.clearCart();
            this.modal.style.display = 'none';
        }
        
        getTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        
        render() {
            this.itemsContainer.innerHTML = '';
            
            if (this.cart.length === 0) {
                this.itemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
                this.totalElement.textContent = '0 ₽';
                this.countElement.textContent = '0';
                this.saveCart();
                return;
            }
            
            this.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.dataset.id = item.id;
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div>
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <div class="cart-item-subtotal">${(item.price * item.quantity).toLocaleString()} ₽</div>
                    <button class="remove-item" aria-label="Удалить">×</button>
                `;
                
                this.itemsContainer.appendChild(itemElement);
            });
            
            const total = this.getTotal();
            this.totalElement.textContent = `${total.toLocaleString()} ₽`;
            this.countElement.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.saveCart();
        }
        
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 3000);
            }, 10);
        }
    }

    // Инициализация корзины
    const cart = new Cart();
    
    // Для доступа из других скриптов
    window.ardorCart = cart;
});