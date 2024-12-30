import { currentFilters, applyPriceFilter, sortProducts, initializeFilters } from './modules/filters.js';
import { displayProducts, ITEMS_PER_PAGE } from './modules/productDisplay.js';
import { updatePagination, scrollToTop } from './modules/pagination.js';
import { products } from './modules/products.js';
import { Cart } from './modules/cart.js';

console.log('Main module loaded');
console.log('Products loaded:', products);
console.log('Products array length:', products.length);

let currentPage = 1;

// Initialize cart and make it globally available
window.cart = new Cart();
console.log('Cart initialized');

// Make products globally available for other scripts
window.products = products;

function changePage(page) {
    console.log('Changing to page:', page);
    currentPage = page;
    const totalPages = displayProducts(products, currentFilters.category, currentPage, {
        currentFilters,
        applyPriceFilter,
        sortProducts
    });
    updatePagination(totalPages, currentPage, changePage);
    scrollToTop();
}

function handleFilterChange(category = currentFilters.category) {
    console.log('Filter changed:', { category, currentFilters });
    currentPage = 1;
    const totalPages = displayProducts(products, category, currentPage, {
        currentFilters,
        applyPriceFilter,
        sortProducts
    });
    updatePagination(totalPages, currentPage, changePage);
}

// Initialize everything once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application');
    try {
        // Initialize filters with callback
        initializeFilters(handleFilterChange);
        
        // Initial display of products
        handleFilterChange(currentFilters.category);
        console.log('Initial products displayed');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Checkout function
window.checkout = function() {
    if (cart.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = './checkout.html';
};

// Add error handler for module loading
window.addEventListener('error', function(e) {
    console.error('Script error:', e);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejection:', e.reason);
});