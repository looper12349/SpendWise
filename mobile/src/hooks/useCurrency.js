import { useAuth } from '../context/AuthContext';
import { formatCurrency as formatCurrencyHelper } from '../utils/helpers';

export const useCurrency = () => {
    const { user } = useAuth();
    const currency = user?.currency || 'USD';

    const formatCurrency = (amount) => {
        return formatCurrencyHelper(amount, currency);
    };

    const getCurrencySymbol = () => {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'INR': '₹',
            'JPY': '¥',
            'AUD': 'A$',
            'CAD': 'C$'
        };
        return symbols[currency] || '$';
    };

    return {
        currency,
        formatCurrency,
        getCurrencySymbol
    };
};
