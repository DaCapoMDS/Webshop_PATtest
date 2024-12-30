// Pagination
export const ITEMS_PER_PAGE = 40;

// Filter Defaults
export const DEFAULT_FILTERS = {
    category: 'all',
    priceRange: 'all',
    location: 'all',
    sort: 'relevance'
};

// Price Range Configuration
export const PRICE_RANGES = {
    ALL: 'all',
    BUDGET: '0-20',
    MEDIUM: '20-50',
    HIGH: '50-100',
    PREMIUM: '100+',
    CUSTOM: 'custom'
};

// Sort Options
export const SORT_OPTIONS = {
    RELEVANCE: 'relevance',
    PRICE_ASC: 'priceAsc',
    PRICE_DESC: 'priceDesc',
    NAME_ASC: 'nameAsc',
    NAME_DESC: 'nameDesc'
};