document.addEventListener('DOMContentLoaded', function () {
    // Data from your index.html with add-to-cart buttons
    const catalogData = [
        {
            id: 1,
            title: "ARDOR CONSOLE 2 PRO",
            category: "tech",
            price: 59990,
            rating: 4.9,
            image: "img2/pristavka.png",
            badge: "НОВИНКА",
            
        },
        {
            id: 2,
            title: "GAMING MONITORS",
            category: "tech",
            price: 45990,
            rating: 4.7,
            image: "img1/monitor_dorogoy.png",
            discount: 20,
            
        },
        {
            id: 3,
            title: "ARDOR APEX",
            category: "tech",
            price: 99990,
            rating: 4.8,
            image: "img2/загрузка.jpg",
            tag: "exclusive",
            
        },
        {
            id: 4,
            title: "ARDOR GAMING PC XTREME",
            category: "tech",
            price: 129990,
            oldPrice: 149990,
            rating: 4.8,
            image: "https://c.dns-shop.ru/thumb/st1/fit/0/0/5f7137757554c0d4b9cb3feeb1ff2843/2fbce19e8956b2330b9a2fe5c4a3603a6c19988ad268c0fb21637240004b78a1.jpg.webp",
            badge: "ХИТ",
            
        },
        {
            id: 5,
            title: "ARDOR RACER X7 PRO",
            category: "cars",
            price: 2499990,
            rating: 4.8,
            image: "https://i.pinimg.com/originals/da/9b/9e/da9b9e627af17cabe4a3a6e739c3aa7e.png",
            tag: "eco",
            cashback: 249999,
            
        },
        {
            id: 6,
            title: "DIGITAL APARTMENT 121 series",
            category: "apartments",
            price: 18999990,
            oldPrice: 25000000,
            rating: 4.9,
            image: "https://avatars.mds.yandex.net/i?id=f909d7c692abadd228444b600703ae0ea7c19e3b-4114158-images-thumbs&n=13",
            tag: "exclusive",
            discount: 24,
            
        }
    ];

    // Initialize
    const catalogGrid = document.getElementById('catalogGrid');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    let activeCategory = 'all';
    let maxPrice = 10000000;

    // Title animation
    anime({
        targets: '.ardor-title',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic',
        delay: 200
    });

    // Tab buttons animation
    anime({
        targets: '.tab-btn',
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });

    // Render items with insane animations
    function renderItems() {
    catalogGrid.innerHTML = '';

    // Получаем поисковый запрос из sessionStorage
    const searchQuery = sessionStorage.getItem('searchQuery');
    if (searchQuery) {
        // Удаляем запрос после использования
        sessionStorage.removeItem('searchQuery');
        // Устанавливаем значение в поле поиска
        searchInput.value = searchQuery;
        
        // Добавляем заголовок с результатами поиска
        const searchHeader = document.createElement('h2');
        searchHeader.className = 'search-results-header';
        searchHeader.textContent = `Результаты поиска: "${searchQuery}"`;
        catalogGrid.parentNode.insertBefore(searchHeader, catalogGrid);
        
        // Анимация появления заголовка
        anime({
            targets: searchHeader,
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic'
        });
    }
    
    const filteredItems = catalogData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesPrice = item.price <= maxPrice;
        const matchesSearch = searchQuery ? 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesCategory && matchesPrice && matchesSearch;
    });

    if (filteredItems.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'НИЧЕГО НЕ НАЙДЕНО';
        catalogGrid.appendChild(noResults);
        
        anime({
            targets: noResults,
            scale: [0.5, 1],
            rotate: [-10, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic'
        });
        return;
    }

    filteredItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'catalog-item';
        itemElement.dataset.category = item.category;
        
        // Определяем позицию бейджа
        const badgePosition = item.badge === 'ХИТ' ? 'left' : 'right';
        const badgeHTML = item.badge ? 
            `<div class="product-badge" style="${badgePosition === 'left' ? 'left: 10px; right: auto;' : 'right: 10px; left: auto;'}">
                ${item.badge}
            </div>` : '';

        const discountHTML = item.discount ? 
            `<div class="discount-bubble">-${item.discount}%</div>` : '';

        const oldPriceHTML = item.oldPrice ? 
            `<span class="old-price">${item.oldPrice.toLocaleString()} ₽</span>` : '';

        const cashbackHTML = item.cashback ? 
            `<div class="cashback">+ ${item.cashback.toLocaleString()} бонусов</div>` : '';

        const tagHTML = item.tag ? 
            `<div class="product-tag ${item.tag}">${item.tag.toUpperCase()}</div>` : '';

        itemElement.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                ${badgeHTML}
                ${tagHTML}
                ${discountHTML}
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-price">
                    <span class="current-price">${item.price.toLocaleString()} ₽</span>
                    ${oldPriceHTML}
                </div>
                <div class="item-rating stars" style="--rating: ${item.rating};"></div>
                ${cashbackHTML}
                <div class="item-actions">
                    <button class="ardor-btn add-to-cart" data-id="${item.id}">В КОРЗИНУ</button>
                    <button class="quick-view">
                        <img src="https://img.icons8.com/?size=100&id=60022&format=png&color=FA5252" alt="" width="20">
                    </button>
                </div>
            </div>
        `;
        
        catalogGrid.appendChild(itemElement);
        
        // Анимация появления
        anime({
            targets: itemElement,
            translateY: [100, 0],
            rotateY: [90, 0],
            opacity: [0, 1],
            duration: 1200,
            delay: index * 100,
            easing: 'easeOutElastic'
        });

        // Эффекты при наведении
        itemElement.addEventListener('mouseenter', () => {
            anime({
                targets: itemElement,
                translateY: -15,
                rotateX: 10,
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(255, 26, 46, 0.4)',
                duration: 500,
                easing: 'easeOutQuad'
            });
            
            anime({
                targets: itemElement.querySelector('.item-image'),
                scale: 1.1,
                duration: 500
            });
        });

        itemElement.addEventListener('mouseleave', () => {
            anime({
                targets: itemElement,
                translateY: 0,
                rotateX: 0,
                scale: 1,
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                duration: 800,
                easing: 'easeOutElastic'
            });
            
            anime({
                targets: itemElement.querySelector('.item-image'),
                scale: 1,
                duration: 500
            });
        });

        // Обработчик кнопки "В корзину"
        itemElement.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.stopPropagation();
            const button = e.target;
            
            anime({
                targets: button,
                scale: [1, 0.8, 1.2, 1],
                backgroundColor: ['#ff1a2e', '#00ff88'],
                duration: 800,
                easing: 'easeOutElastic'
            });
            
            // Анимация летящей иконки корзины
            const cartIcon = document.createElement('div');
            cartIcon.innerHTML = '🛒';
            cartIcon.style.position = 'fixed';
            cartIcon.style.fontSize = '20px';
            cartIcon.style.zIndex = '1000';
            cartIcon.style.left = button.getBoundingClientRect().left + 'px';
            cartIcon.style.top = button.getBoundingClientRect().top + 'px';
            document.body.appendChild(cartIcon);
            
            anime({
                targets: cartIcon,
                translateX: window.innerWidth - 100,
                translateY: 20,
                rotate: '+=360',
                scale: [1, 1.5, 1],
                opacity: [1, 0],
                duration: 1200,
                easing: 'easeInOutQuad',
                complete: () => cartIcon.remove()
            });

            // Здесь должна быть ваша логика добавления в корзину
            console.log('Добавлен товар ID:', item.id);
            updateCartCount();
        });
    });
}

    // Create particles on hover
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#ff1a2e', '#00ff88', '#0088ff', '#ff00ff'];

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 10 + 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * rect.width + rect.left + 'px';
            particle.style.top = Math.random() * rect.height + rect.top + 'px';
            document.body.appendChild(particle);

            anime({
                targets: particle,
                translateX: () => anime.random(-100, 100),
                translateY: () => anime.random(-100, 100),
                scale: [1, 0],
                opacity: [1, 0],
                duration: anime.random(800, 1200),
                easing: 'easeOutExpo',
                complete: () => particle.remove()
            });
        }
    }

    // Create floating background elements
    function createFloatingElements() {
        const container = document.querySelector('.ardor-catalog');
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#ff1a2e', '#00ff88', '#0088ff', '#ff00ff'];

        for (let i = 0; i < 25; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';

            const size = Math.random() * 30 + 10;
            const duration = Math.random() * 30 + 20;
            const delay = Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.background = color;
            element.style.opacity = Math.random() * 0.2 + 0.1;

            if (shape === 'circle') {
                element.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                element.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                element.style.background = 'transparent';
                element.style.borderLeft = `${size / 2}px solid transparent`;
                element.style.borderRight = `${size / 2}px solid transparent`;
                element.style.borderBottom = `${size}px solid ${color}`;
                element.style.width = '0';
                element.style.height = '0';
            }

            element.style.position = 'absolute';
            element.style.top = `${Math.random() * 100}%`;
            element.style.left = `${Math.random() * 100}%`;
            element.style.zIndex = '-1';
            element.style.filter = 'blur(1px)';

            container.appendChild(element);

            // Complex floating animation
            anime({
                targets: element,
                translateX: () => anime.random(-100, 100),
                translateY: () => anime.random(-50, 50),
                rotate: () => anime.random(-180, 180),
                duration: duration * 1000,
                delay: delay * 1000,
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });
        }
    }

    // Tab switching with animation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            activeCategory = button.dataset.category;

            // Tab switch animation
            anime({
                targets: button,
                scale: [1, 0.8, 1.2, 1],
                rotate: [0, -10, 10, 0],
                backgroundColor: ['#ff1a2e', '#00ff88', '#0088ff', '#ff1a2e'],
                duration: 1200,
                easing: 'easeOutElastic'
            });

            // Grid items exit animation
            anime({
                targets: '.catalog-item',
                translateY: 100,
                rotateY: 90,
                opacity: 0,
                duration: 600,
                easing: 'easeInExpo',
                complete: renderItems
            });
        });
    });

    // Price filter with animation
    priceRange.addEventListener('input', () => {
        maxPrice = parseInt(priceRange.value);
        priceValue.textContent = `$0 - $${maxPrice.toLocaleString()}`;

        // Price value animation
        anime({
            targets: priceValue,
            scale: [1, 1.3, 1],
            color: ['#fff', '#ff1a2e', '#fff'],
            duration: 800,
            easing: 'easeOutElastic'
        });

        renderItems();
    });

    // Search filter with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Search icon animation
            anime({
                targets: searchInput,
                translateX: [-10, 0],
                backgroundColor: ['rgba(51, 51, 51, 0.8)', 'rgba(51, 51, 51, 1)'],
                duration: 800,
                easing: 'easeOutElastic'
            });

            renderItems();
        }, 300);
    });

    // Update cart count (integrate with your cart.js)
    function updateCartCount() {
        // This should be replaced with your actual cart logic
        const cartCount = document.getElementById('cart-count');
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;

        // Pulse animation
        anime({
            targets: cartCount,
            scale: [1, 1.5, 1],
            duration: 800,
            easing: 'easeOutElastic'
        });
    }

    // Initial render
    renderItems();
    createFloatingElements();

    // Continuous background animation
    setInterval(() => {
        anime({
            targets: '.floating-element',
            rotate: () => anime.random(-180, 180),
            duration: 10000,
            easing: 'linear'
        });
    }, 10000);
});