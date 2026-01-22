// Category icons and labels (using Ionicons names)
export const categories = [
    { id: 'food', label: 'Food & Dining', icon: 'fast-food', iconType: 'Ionicons' },
    { id: 'transport', label: 'Transport', icon: 'car', iconType: 'Ionicons' },
    { id: 'shopping', label: 'Shopping', icon: 'cart', iconType: 'Ionicons' },
    { id: 'entertainment', label: 'Entertainment', icon: 'film', iconType: 'Ionicons' },
    { id: 'bills', label: 'Bills', icon: 'document-text', iconType: 'Ionicons' },
    { id: 'health', label: 'Health', icon: 'medkit', iconType: 'Ionicons' },
    { id: 'education', label: 'Education', icon: 'school', iconType: 'Ionicons' },
    { id: 'travel', label: 'Travel', icon: 'airplane', iconType: 'Ionicons' },
    { id: 'groceries', label: 'Groceries', icon: 'basket', iconType: 'Ionicons' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', iconType: 'Ionicons' }
];

// Payment methods
export const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: 'cash', iconType: 'Ionicons' },
    { id: 'card', label: 'Card', icon: 'card', iconType: 'Ionicons' },
    { id: 'upi', label: 'UPI', icon: 'phone-portrait', iconType: 'Ionicons' },
    { id: 'other', label: 'Other', icon: 'wallet', iconType: 'Ionicons' }
];

// Wallet types
export const walletTypes = [
    { id: 'roommates', label: 'Roommates', icon: 'home', iconType: 'Ionicons' },
    { id: 'couple', label: 'Couple', icon: 'heart', iconType: 'Ionicons' },
    { id: 'trip', label: 'Trip', icon: 'airplane', iconType: 'Ionicons' },
    { id: 'group', label: 'Group', icon: 'people', iconType: 'Ionicons' },
    { id: 'other', label: 'Other', icon: 'folder', iconType: 'Ionicons' }
];

// Icon mapping for various UI elements
export const icons = {
    // Navigation
    home: 'home',
    homeOutline: 'home-outline',
    expenses: 'wallet',
    expensesOutline: 'wallet-outline',
    charts: 'pie-chart',
    chartsOutline: 'pie-chart-outline',
    budget: 'flag',
    budgetOutline: 'flag-outline',
    wallets: 'people',
    walletsOutline: 'people-outline',
    profile: 'person',
    profileOutline: 'person-outline',

    // Actions
    add: 'add',
    addCircle: 'add-circle',
    edit: 'create',
    delete: 'trash',
    back: 'arrow-back',
    forward: 'arrow-forward',
    close: 'close',
    check: 'checkmark',
    search: 'search',
    filter: 'filter',
    refresh: 'refresh',
    settings: 'settings',

    // Auth
    email: 'mail',
    password: 'lock-closed',
    user: 'person',
    logout: 'log-out',

    // Misc
    calendar: 'calendar',
    time: 'time',
    notification: 'notifications',
    help: 'help-circle',
    info: 'information-circle',
    warning: 'warning',
    success: 'checkmark-circle',
    error: 'close-circle',
    eye: 'eye',
    eyeOff: 'eye-off',
    moon: 'moon',
    sun: 'sunny',
    colorPalette: 'color-palette',
    download: 'download',
    document: 'document',
    privacy: 'shield-checkmark',
    terms: 'document-text'
};
