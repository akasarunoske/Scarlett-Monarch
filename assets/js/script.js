class Cart {
    constructor() {
        this.cartCount = document.querySelector('.cart-count');
        this.cartButtons = document.querySelectorAll('.product-card__cart');
        this.cartItems = this.getCartFromStorage();

        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.bindEvents();
        console.log('Cart initialized with items:', this.cartItems);
    }

    bindEvents() {
        this.cartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add to cart button clicked');
                this.addToCart(button);
            });
        });
    }

    getCartFromStorage() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error reading cart from storage:', error);
            return [];
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
            console.log('Cart saved to storage:', this.cartItems);
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    addToCart(button) {
        console.log('Adding to cart...');

        const productCard = button.closest('.product-card');
        const productId = this.generateProductId(productCard);
        const productName = productCard.querySelector('.product-card__name').textContent;
        const productPrice = this.getProductPrice(productCard);

        console.log('Product details:', { productId, productName, productPrice });
        const existingItemIndex = this.cartItems.findIndex(item => item.id === productId);

        if (existingItemIndex !== -1) {
            this.cartItems[existingItemIndex].quantity += 1;
            console.log('Item quantity increased');
        } else {
            this.cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
            console.log('New item added to cart');
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showAddToCartAnimation(button);
    }

    generateProductId(productCard) {
        const name = productCard.querySelector('.product-card__name').textContent.trim();
        const priceElement = productCard.querySelector('.product-card__current-price') ||
            productCard.querySelector('.product-card__new-price');
        const price = priceElement ? priceElement.textContent.trim() : '0';
        return `${name}-${price}`.replace(/\s+/g, '-');
    }

    getProductPrice(productCard) {
        const currentPrice = productCard.querySelector('.product-card__current-price');
        const newPrice = productCard.querySelector('.product-card__new-price');
        const priceElement = currentPrice || newPrice;
        return priceElement ? priceElement.textContent.trim() : '0 ₽';
    }

    getTotalItems() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartDisplay() {
        const totalItems = this.getTotalItems();
        console.log('Updating cart display, total items:', totalItems);

        if (this.cartCount) {
            if (totalItems > 0) {
                this.cartCount.textContent = `(${totalItems})`;
                this.cartCount.style.display = 'inline';
                console.log('Cart count updated to:', totalItems);
            } else {
                this.cartCount.textContent = '(0)';
                this.cartCount.style.display = 'none';
                console.log('Cart count hidden');
            }
        } else {
            console.error('Cart count element not found!');
        }
    }

    showAddToCartAnimation(button) {
        const originalText = button.textContent;

        button.textContent = 'Добавлено';
        button.style.background = '#09ABE4';
        button.style.color = 'white';
        button.style.pointerEvents = 'none';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'transparent';
            button.style.color = '#09ABE4';
            button.style.pointerEvents = 'auto';
        }, 2000);

        this.showNotification('Товар добавлен в корзину');
    }

    showNotification(message) {
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #09ABE4;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 600;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}


class BannerSlider {
    constructor() {
        this.slides = document.querySelectorAll('.banner__slide');
        this.indicators = document.querySelectorAll('.banner__indicator');
        this.prevBtn = document.querySelector('.banner__nav--prev');
        this.nextBtn = document.querySelector('.banner__nav--next');
        this.currentSlide = 0;

        this.init();
    }

    init() {
        this.showSlide(this.currentSlide);
        this.bindEvents();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showSlide(index));
        });
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('banner__slide--active'));
        this.indicators.forEach(indicator => indicator.classList.remove('banner__indicator--active'));

        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('banner__slide--active');
        this.indicators[this.currentSlide].classList.add('banner__indicator--active');
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
}


class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.currentPath = window.location.pathname;

        this.init();
    }

    init() {
        this.setActiveNavItem();
    }

    setActiveNavItem() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (this.currentPath.includes(href) && href !== '#') {
                link.classList.add('active');
            }
        });
    }
}


class ProductCards {
    constructor() {
        this.compareButtons = document.querySelectorAll('.product-card__compare');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.compareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCompare(button);
            });
        });
    }

    toggleCompare(button) {
        button.classList.toggle('product-card__compare--active');

        const isActive = button.classList.contains('product-card__compare--active');
        const action = isActive ? 'Добавлено к сравнению' : 'Убрано из сравнения';

        this.showNotification(action);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #09ABE4;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

class Promotions {
    constructor() {
        this.promotionCards = document.querySelectorAll('.promotion-card');
        this.promotionButtons = document.querySelectorAll('.promotion-card__button');
        this.allPromotionsBtn = document.querySelector('.promotions__all-btn');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.promotionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openPromotionDetails(button);
            });
        });

        this.promotionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.promotion-card__button')) {
                    this.openPromotionDetails(card);
                }
            });
        });

        if (this.allPromotionsBtn) {
            this.allPromotionsBtn.addEventListener('click', () => {
                this.showAllPromotions();
            });
        }
    }

    openPromotionDetails(element) {
        const card = element.closest('.promotion-card');
        const title = card.querySelector('.promotion-card__title').textContent;

        console.log(`Открытие акции: ${title}`);

        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    showAllPromotions() {
        console.log('Переход на страницу всех акций');

        this.allPromotionsBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.allPromotionsBtn.style.transform = '';
        }, 150);
    }
}


document.addEventListener('click', (e) => {
    if (e.target.closest('.product-card__cart')) {
        console.log('Cart button clicked directly');
    }
});

class MobileMenu {
    constructor() {
        this.burger = document.querySelector('.header__burger');
        this.nav = document.querySelector('.header__nav');

        if (this.burger && this.nav) {
            this.init();
        }
    }

    init() {
        this.burger.addEventListener('click', () => this.toggleMenu());
        this.nav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav__link')) this.closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) this.closeMenu();
        });
    }

    toggleMenu() {
        const willOpen = !this.nav.classList.contains('active');
        this.nav.classList.toggle('active', willOpen);
        this.burger.classList.toggle('active', willOpen);
        document.body.classList.toggle('no-scroll', willOpen);
    }

    closeMenu() {
        this.nav.classList.remove('active');
        this.burger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

class SimpleMobileSlider {
    constructor(root, itemSelector) {
        this.root = root;
        this.itemSelector = itemSelector;
        this.items = Array.from(root.querySelectorAll(itemSelector));
        this.index = 0;
        this.nav = null;
        this.inited = false;

        this.onResize = this.onResize.bind(this);
        this.tryInit();
        window.addEventListener('resize', this.onResize);
    }

    isMobile() { return window.innerWidth <= 768; }

    tryInit() {
        if (!this.inited && this.isMobile() && this.items.length > 1) {
            this.inited = true;
            this.items.forEach((el, i) => el.classList.toggle('is-active', i === 0));
            this.createNav();
        } else if (this.inited && !this.isMobile()) {
            this.destroy();
        }
    }

    createNav() {
        this.nav = document.createElement('div');
        this.nav.className = 'mobile-slider-nav';
        this.nav.innerHTML = `
          <button class="mobile-slider-nav__btn prev" aria-label="Предыдущий">‹</button>
          <button class="mobile-slider-nav__btn next" aria-label="Следующий">›</button>
        `;
        this.root.appendChild(this.nav);
        this.nav.querySelector('.prev').addEventListener('click', () => this.prev());
        this.nav.querySelector('.next').addEventListener('click', () => this.next());
        this.updateButtons();
    }

    updateButtons() {
        if (!this.nav) return;
        const prev = this.nav.querySelector('.prev');
        const next = this.nav.querySelector('.next');
        prev.disabled = (this.index === 0);
        next.disabled = (this.index === this.items.length - 1);
    }

    showCurrent() {
        this.items.forEach((el, i) => el.classList.toggle('is-active', i === this.index));
        this.updateButtons();
    }

    prev() { if (this.index > 0) { this.index--; this.showCurrent(); } }
    next() { if (this.index < this.items.length - 1) { this.index++; this.showCurrent(); } }

    destroy() {
        if (this.nav) { this.nav.remove(); this.nav = null; }
        this.items.forEach(el => el.classList.remove('is-active'));
        this.inited = false;
    }

    onResize() { this.tryInit(); }
}

class App {
    constructor() {
        this.init();
    }

    init() {
        this.cart = new Cart();
        this.bannerSlider = new BannerSlider();
        this.navigation = new Navigation();
        this.productCards = new ProductCards();
        this.promotions = new Promotions();
        this.mobileMenu = new MobileMenu();
        const popular = document.querySelector('.popular-products');
        if (popular) this.popularSlider = new SimpleMobileSlider(popular, '.product-card');

        const promos = document.querySelector('.promotions');
        if (promos) this.promosSlider = new SimpleMobileSlider(promos, '.promotion-card');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});