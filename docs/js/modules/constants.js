// GitHub configuration
export const GITHUB_CONFIG = {
    OWNER: 'Joppinger',
    REPO: 'WebShop'
};

// API endpoints
export const API_ENDPOINTS = {
    GITHUB_API: 'https://api.github.com',
    GITHUB_REPO: `https://api.github.com/repos/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}`
};

// Order status constants
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Error messages
export const ERROR_MESSAGES = {
    CONNECTION_ERROR: 'Cannot connect to order system. Please check your internet connection.',
    RATE_LIMIT: 'Order system is busy. Please try again in {minutes} minutes.',
    SYSTEM_UNAVAILABLE: 'Order system is currently unavailable. Please try again later.',
    INVALID_ORDER: 'Invalid order data. Please check your order and try again.',
    AUTH_FAILED: 'Authentication failed. Please try again later.'
};