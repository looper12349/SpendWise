import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { calculatePercentage } from '../utils/helpers';

const BudgetProgress = ({ spent, limit, category, showLabel = true }) => {
    const { colors } = useTheme();
    const percentage = calculatePercentage(spent, limit);
    const isOverBudget = spent > limit;

    const getProgressColor = () => {
        if (isOverBudget) return colors.error;
        if (percentage > 80) return colors.warning;
        return colors.success;
    };

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16
        },
        labelRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        category: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500'
        },
        percentage: {
            color: colors.textSecondary,
            fontSize: 13
        },
        progressBg: {
            height: 8,
            backgroundColor: colors.surfaceLight,
            borderRadius: 4,
            overflow: 'hidden'
        },
        progressBar: {
            height: '100%',
            borderRadius: 4
        },
        amountRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6
        },
        spent: {
            color: colors.text,
            fontSize: 13,
            fontWeight: '600'
        },
        overBudget: {
            color: colors.error
        },
        limit: {
            color: colors.textMuted,
            fontSize: 13,
            marginLeft: 4
        }
    });

    return (
        <View style={styles.container}>
            {showLabel && (
                <View style={styles.labelRow}>
                    <Text style={styles.category}>{category || 'Total'}</Text>
                    <Text style={styles.percentage}>{percentage}%</Text>
                </View>
            )}

            <View style={styles.progressBg}>
                <View
                    style={[
                        styles.progressBar,
                        {
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: getProgressColor()
                        }
                    ]}
                />
            </View>

            {showLabel && (
                <View style={styles.amountRow}>
                    <Text style={[styles.spent, isOverBudget && styles.overBudget]}>
                        ${spent.toFixed(0)}
                    </Text>
                    <Text style={styles.limit}>of ${limit.toFixed(0)}</Text>
                </View>
            )}
        </View>
    );
};

export default BudgetProgress;
