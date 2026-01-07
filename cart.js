// Cart functionality using localStorage
const CartManager = {
    STORAGE_KEY: 'endlessCoffeeCart',

    // Get all cart items
    getCart: function() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    },

    // Add item to cart
    addToCart: function(item) {
        const cart = this.getCart();
        const existingItem = cart.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        this.saveCart(cart);
        this.updateCartBadge();
        return true;
    },

    // Remove item from cart
    removeFromCart: function(id) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== id);
        this.saveCart(cart);
        this.updateCartBadge();
    },

    // Update item quantity
    updateQuantity: function(id, change) {
        const cart = this.getCart();
        const item = cart.find(i => i.id === id);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(id);
                return;
            }
            this.saveCart(cart);
        }
        this.updateCartBadge();
    },

    // Get cart item count
    getCartCount: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Get cart total price
    getCartTotal: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Clear entire cart
    clearCart: function() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartBadge();
    },

    // Update cart badge in navbar
    updateCartBadge: function() {
        const badge = document.getElementById('cart-badge');
        const count = this.getCartCount();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    // Show notification
    showNotification: function(message) {
        // Remove existing notification
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `✓ ${message}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #1fc47f 0%, #085c2e 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 5px 20px rgba(31, 196, 127, 0.4);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);

        // Add animation keyframes
        if (!document.getElementById('cart-animations')) {
            const style = document.createElement('style');
            style.id = 'cart-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
};

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', function() {
    CartManager.updateCartBadge();
});
