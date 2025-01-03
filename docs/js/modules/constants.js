// GitHub configuration
export const GITHUB_CONFIG = {
    OWNER: 'DaCapoMDS',
    REPO: 'Webshop_PATtest'
};

// API endpoints
const VERCEL_API_URL = 'https://webshop-pattest-git-main-dacapos-projects.vercel.app';

export const API_ENDPOINTS = {
    ISSUES_API: `${VERCEL_API_URL}/api/create-issue`,
    ORDERS_API: `${VERCEL_API_URL}/api/create-order`
};

// Debug - log configuration
console.log('GitHub Config:', {
    owner: GITHUB_CONFIG.OWNER,
    repo: GITHUB_CONFIG.REPO
});
console.log('API Endpoints:', {
    base: API_ENDPOINTS.GITHUB_API,
    repo: API_ENDPOINTS.REPO_API,
    issues: API_ENDPOINTS.ISSUES_API
});

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