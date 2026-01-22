import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../hooks/useCurrency';
import { categories } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const ExpenseCard = ({ expense, onPress }) => {
    const { colors } = useTheme();
    const { formatCurrency } = useCurrency();
    const category = categories.find(c => c.id === expense.category) || categories[categories.length - 1];
    const categoryColor = colors.categories[expense.category] || colors.categories.other;

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: categoryColor + '20'
        },
        details: {
            flex: 1,
            marginLeft: 14
        },
        description: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 4
        },
        date: {
            color: colors.textMuted,
            fontSize: 13
        },
        amountContainer: {
            alignItems: 'flex-end'
        },
        amount: {
            color: colors.error,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4
        },
        categoryLabel: {
            color: colors.textMuted,
            fontSize: 12
        }
    });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(expense)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={category.icon} size={24} color={categoryColor} />
            </View>

            <View style={styles.details}>
                <Text style={styles.description} numberOfLines={1}>
                    {expense.description || category.label}
                </Text>
                <Text style={styles.date}>{formatDate(expense.date, 'relative')}</Text>
            </View>

            <View style={styles.amountContainer}>
                <Text style={styles.amount}>
                    -{formatCurrency(expense.amount)}
                </Text>
                <Text style={styles.categoryLabel}>{category.label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ExpenseCard;
