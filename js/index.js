document.addEventListener('DOMContentLoaded', function() {
    //избранное -------------------------------- Данная функция в разработке
    class Wishlist {
        constructor() {
            this.wishlist = this.loadWishlist();
            this.modal = document.getElementById('wishlist-modal');
            this.itemsContainer = document.getElementById('wishlist-items');
            this.countElement = document.getElementById('wishlist-count');
            this.clearButton = document.getElementById('clear-wishlist');
            this.init();
        }
        
        init() {
            this.render();
            this.setupEventListeners();
            this.setupModal();
        }
        
        loadWishlist() {
            const wishlistData = sessionStorage.getItem('wishlist');
            return wishlistData ? JSON.parse(wishlistData) : [];
        }
        
        saveWishlist() {
            sessionStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        }
        
        setupModal() {
            // Открытие/закрытие модалки
            document.querySelectorAll('.wishlist-button')[0].addEventListener('click', () => {
                this.modal.style.display = 'block';
            });
            
            document.querySelector('.wishlist-close-modal').addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.modal.style.display = 'none';
                }
            });
        }
        
        setupEventListeners() {
            // Обработчики для кнопок внутри избранного
            this.itemsContainer.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.wishlist-item');
                if (!itemElement) return;
                
                const id = itemElement.dataset.id;
                
                if (e.target.classList.contains('remove-wishlist-item')) {
                    this.removeItem(id);
                }
                
                if (e.target.classList.contains('move-to-cart')) {
                    this.moveToCart(id);
                }
            });
            
            // Очистка избранного
            this.clearButton.addEventListener('click', () => {
                this.clearWishlist();
            });
            
            // Добавление в избранное
            document.querySelectorAll('.wishlist-btn').forEach(button => {
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
                        image
                    });
                    
                    this.showNotification(`${name} добавлен в избранное`);
                });
            });
        }
        
        addItem(product) {
            const existingItem = this.wishlist.find(item => item.id === product.id);
            
            if (!existingItem) {
                this.wishlist.push(product);
                this.render();
            }
        }
        
        removeItem(id) {
            this.wishlist = this.wishlist.filter(item => item.id != id);
            this.render();
        }
        
        moveToCart(id) {
            const item = this.wishlist.find(item => item.id === id);
            if (item) {
                window.ardorCart.addItem({...item, quantity: 1});
                this.removeItem(id);
                this.showNotification(`${item.name} перемещен в корзину`);
            }
        }
        
        clearWishlist() {
            this.wishlist = [];
            this.render();
        }
        
        render() {
            this.itemsContainer.innerHTML = '';
            
            if (this.wishlist.length === 0) {
                this.itemsContainer.innerHTML = '<p class="empty-wishlist">Ваш список избранного пуст</p>';
                // this.countElement.textContent = '0';
                this.saveWishlist();
                return;
            }
            
            this.wishlist.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'wishlist-item';
                itemElement.dataset.id = item.id;
                itemElement.innerHTML = `
                    <div class="wishlist-item-info">
                        <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
                        <div>
                            <div class="wishlist-item-name">${item.name}</div>
                            <div class="wishlist-item-price">${item.price.toLocaleString()} ₽</div>
                        </div>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart">В корзину</button>
                        <button class="remove-wishlist-item" aria-label="Удалить">×</button>
                    </div>
                `;
                
                this.itemsContainer.appendChild(itemElement);
            });
            
            this.countElement.textContent = this.wishlist.length;
            this.saveWishlist();
        }
        
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'wishlist-notification';
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

    // Инициализация избранного
    const wishlist = new Wishlist();
    
    // Для доступа из других скриптов
    window.ardorWishlist = wishlist;

    
});


document.addEventListener('DOMContentLoaded', function() {
  // Элементы модального окна
  const supportModal = document.getElementById('support-modal');
  const supportLink = document.querySelector('header a[href*="поддержка"], header a[href*="support"]');
  const closeBtn = document.querySelector('.support-close');
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // Открытие модального окна
  if (supportLink) {
    supportLink.addEventListener('click', function(e) {
      e.preventDefault();
      supportModal.style.display = 'block';
    });
  }

  // Закрытие модального окна
  closeBtn.addEventListener('click', function() {
    supportModal.style.display = 'none';
  });

  // Закрытие при клике вне окна
  window.addEventListener('click', function(e) {
    if (e.target === supportModal) {
      supportModal.style.display = 'none';
    }
  });

  // Отправка сообщения
  function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Добавляем сообщение пользователя
    addMessage(message, 'user');
    userInput.value = '';

    // Имитируем ответ бота (можно заменить на реальный API)
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      addMessage(botResponse, 'bot');
    }, 1000);
  }

  // Обработчики отправки
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Добавление сообщения в чат
  function addMessage(text, sender) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
      <div class="message-content">${text}</div>
      <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Генерация ответов бота (можно расширить)
  function generateBotResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('привет') || lowerMsg.includes('здравствуйте')) {
      return 'Здравствуйте! Как я могу вам помочь?';
    } else if (lowerMsg.includes('доставка') || lowerMsg.includes('доставк')) {
      return 'Доставка осуществляется в течение 2-5 рабочих дней. Есть вопросы по конкретному заказу?';
    } else if (lowerMsg.includes('оплата') || lowerMsg.includes('платеж')) {
      return 'Мы принимаем карты Visa, Mastercard, МИР, а также электронные кошельки.';
    } else if (lowerMsg.includes('возврат') || lowerMsg.includes('вернуть')) {
      return 'Возврат возможен в течение 14 дней с момента получения заказа. Для инициации возврата напишите номер заказа.';
    } else if (lowerMsg.includes('спасибо') || lowerMsg.includes('благодарю')) {
      return 'Всегда рады помочь! Обращайтесь, если возникнут ещё вопросы.';
    } else {
      const randomResponses = [
        'Понял ваш вопрос. Давайте уточню: что именно вас интересует?',
        'Спасибо за вопрос. Я передам его специалисту для более детального ответа.',
        'Извините, я не совсем понял вопрос. Можете переформулировать?',
        'Для решения этого вопроса вам лучше обратиться в поддержку по email: support@example.com',
        'Слушай сюда, тупая ты мразь. КУПИ АРДОР',
        'Ну купи ардор, зай...🥺',
        'Спасибо тебе, сенпай, за ардоооор &#128571;'
      ];
      return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
  }
});

// Поисковик
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик поиска
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Сохраняем поисковый запрос в sessionStorage
            sessionStorage.setItem('searchQuery', searchTerm);
            // Перенаправляем на страницу каталога
            window.location.href = 'catalog.html';
        } else {
            // Если поле поиска пустое, просто переходим в каталог
            window.location.href = 'catalog.html';
        }
    }
});



