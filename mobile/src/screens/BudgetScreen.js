import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../utils/constants';
import { budgetsAPI } from '../api/client';
import { getCurrentMonthYear, getMonthName } from '../utils/helpers';
import { useCurrency } from '../hooks/useCurrency';
import BudgetProgress from '../components/BudgetProgress';
import Button from '../components/Button';
import Input from '../components/Input';

const BudgetScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { formatCurrency } = useCurrency();
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [totalLimit, setTotalLimit] = useState('');
    const [categoryLimits, setCategoryLimits] = useState({});

    const { month, year } = getCurrentMonthYear();

    const fetchBudget = useCallback(async () => {
        try {
            const response = await budgetsAPI.getCurrent();
            setBudgetData(response.data.data);

            if (response.data.data.budget) {
                setTotalLimit(String(response.data.data.budget.totalLimit));
                const limits = {};
                response.data.data.budget.categoryLimits?.forEach(cl => {
                    limits[cl.category] = String(cl.limit);
                });
                setCategoryLimits(limits);
            }
        } catch (error) {
            console.log('Budget fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchBudget();
    }, [fetchBudget]);

    useFocusEffect(
        useCallback(() => {
            fetchBudget();
        }, [fetchBudget])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBudget();
    };

    const handleSave = async () => {
        try {
            const limitCategories = Object.entries(categoryLimits)
                .filter(([_, value]) => value && parseFloat(value) > 0)
                .map(([category, limit]) => ({
                    category,
                    limit: parseFloat(limit)
                }));

            await budgetsAPI.create({
                month,
                year,
                totalLimit: parseFloat(totalLimit) || 0,
                categoryLimits: limitCategories
            });

            setIsEditing(false);
            fetchBudget();
            Alert.alert('Success', 'Budget saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save budget');
        }
    };

    const budget = budgetData?.budget;
    const spending = budgetData?.spending;
    const totalSpent = spending?.total || 0;
    const budgetLimit = budget?.totalLimit || 0;

    const getCategorySpending = (categoryId) => {
        const found = spending?.byCategory?.find(c => c._id === categoryId);
        return found?.total || 0;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 20
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 60,
            marginBottom: 24
        },
        title: {
            color: colors.text,
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 4
        },
        subtitle: {
            color: colors.textMuted,
            fontSize: 16
        },
        editButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center'
        },
        cardsRow: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16
        },
        card: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20
        },
        cardHalf: {
            flex: 1
        },
        cardLabel: {
            color: colors.textMuted,
            fontSize: 13,
            marginBottom: 8
        },
        cardAmount: {
            color: colors.text,
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 12
        },
        cardBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary + '20',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            alignSelf: 'flex-start',
            gap: 4
        },
        cardBadgeText: {
            color: colors.primary,
            fontSize: 11,
            fontWeight: '600'
        },
        remainingCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24
        },
        remainingHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        },
        remainingLabel: {
            color: colors.textMuted,
            fontSize: 14
        },
        remainingAmount: {
            fontSize: 28,
            fontWeight: '700'
        },
        remainingStats: {
            flexDirection: 'row',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.surfaceLight,
            gap: 24
        },
        remainingStat: {
            flex: 1
        },
        remainingStatLabel: {
            color: colors.textMuted,
            fontSize: 12,
            marginBottom: 4
        },
        remainingStatValue: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600'
        },
        section: {
            marginBottom: 24
        },
        sectionTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
        },
        categoryItem: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12
        },
        categoryIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        categoryInfo: {
            flex: 1
        },
        categoryName: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 4
        },
        categoryAmount: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600'
        },
        categoryLimit: {
            color: colors.textMuted,
            fontSize: 14,
            fontWeight: '400'
        },
        categoryPercentage: {
            backgroundColor: colors.surfaceLight,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 12
        },
        percentageText: {
            fontSize: 14,
            fontWeight: '600'
        },
        categoryProgress: {
            marginTop: 8
        },
        editCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24
        },
        editCardTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12
        },
        categoryEditItem: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12
        },
        buttonContainer: {
            marginBottom: 24
        },
        cancelButton: {
            alignItems: 'center',
            paddingVertical: 14,
            marginTop: 12
        },
        cancelButtonText: {
            color: colors.textMuted,
            fontSize: 15,
            fontWeight: '600'
        }
    });

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header with Edit Button */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Budget</Text>
                        <Text style={styles.subtitle}>{getMonthName(month)} {year}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Ionicons 
                            name={isEditing ? "checkmark" : "pencil"} 
                            size={20} 
                            color={colors.primary} 
                        />
                    </TouchableOpacity>
                </View>

                {isEditing ? (
                    /* Edit Mode */
                    <View>
                        <View style={styles.editCard}>
                            <Text style={styles.editCardTitle}>Monthly Budget Limit</Text>
                            <Input
                                value={totalLimit}
                                onChangeText={setTotalLimit}
                                placeholder="Enter total budget"
                                keyboardType="decimal-pad"
                                icon="cash"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Category Limits</Text>
                            {categories.map((cat) => (
                                <View key={cat.id} style={styles.categoryEditItem}>
                                    <View style={styles.categoryHeader}>
                                        <Ionicons 
                                            name={cat.icon} 
                                            size={20} 
                                            color={colors.categories[cat.id]} 
                                        />
                                        <Text style={styles.categoryName}>{cat.label}</Text>
                                    </View>
                                    <Input
                                        value={categoryLimits[cat.id] || ''}
                                        onChangeText={(value) => setCategoryLimits({
                                            ...categoryLimits,
                                            [cat.id]: value
                                        })}
                                        placeholder="Optional limit"
                                        keyboardType="decimal-pad"
                                        icon="cash"
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Save Budget"
                                onPress={handleSave}
                                icon="checkmark"
                            />
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditing(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    /* View Mode - 2 Card Layout */
                    <View>
                        {/* Overview Cards Row */}
                        <View style={styles.cardsRow}>
                            {/* Total Budget Card */}
                            <View style={[styles.card, styles.cardHalf]}>
                                <Text style={styles.cardLabel}>Total Budget</Text>
                                <Text style={styles.cardAmount}>
                                    {formatCurrency(budgetLimit)}
                                </Text>
                                <View style={styles.cardBadge}>
                                    <Ionicons name="flag" size={14} color={colors.primary} />
                                    <Text style={styles.cardBadgeText}>Limit</Text>
                                </View>
                            </View>

                            {/* Total Spent Card */}
                            <View style={[styles.card, styles.cardHalf]}>
                                <Text style={styles.cardLabel}>Total Spent</Text>
                                <Text style={[
                                    styles.cardAmount,
                                    { color: totalSpent > budgetLimit ? colors.error : colors.success }
                                ]}>
                                    {formatCurrency(totalSpent)}
                                </Text>
                                <View style={[
                                    styles.cardBadge,
                                    { backgroundColor: totalSpent > budgetLimit ? colors.error + '20' : colors.success + '20' }
                                ]}>
                                    <Ionicons 
                                        name={totalSpent > budgetLimit ? "alert-circle" : "checkmark-circle"} 
                                        size={14} 
                                        color={totalSpent > budgetLimit ? colors.error : colors.success} 
                                    />
                                    <Text style={[
                                        styles.cardBadgeText,
                                        { color: totalSpent > budgetLimit ? colors.error : colors.success }
                                    ]}>
                                        {totalSpent > budgetLimit ? 'Over' : 'On Track'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Remaining Budget Card */}
                        <View style={styles.remainingCard}>
                            <View style={styles.remainingHeader}>
                                <Text style={styles.remainingLabel}>Remaining Budget</Text>
                                <Text style={[
                                    styles.remainingAmount,
                                    { color: (budgetLimit - totalSpent) >= 0 ? colors.success : colors.error }
                                ]}>
                                    {formatCurrency(Math.abs(budgetLimit - totalSpent))}
                                </Text>
                            </View>
                            <BudgetProgress
                                spent={totalSpent}
                                limit={budgetLimit}
                                color={colors.primary}
                            />
                            <View style={styles.remainingStats}>
                                <View style={styles.remainingStat}>
                                    <Text style={styles.remainingStatLabel}>Used</Text>
                                    <Text style={styles.remainingStatValue}>
                                        {budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0}%
                                    </Text>
                                </View>
                                <View style={styles.remainingStat}>
                                    <Text style={styles.remainingStatLabel}>Days Left</Text>
                                    <Text style={styles.remainingStatValue}>
                                        {new Date(year, month, 0).getDate() - new Date().getDate()}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Category Breakdown */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Category Breakdown</Text>
                            {budget?.categoryLimits?.map((catLimit) => {
                                const cat = categories.find(c => c.id === catLimit.category);
                                const spent = getCategorySpending(catLimit.category);
                                const percentage = catLimit.limit > 0 
                                    ? Math.round((spent / catLimit.limit) * 100) 
                                    : 0;

                                return (
                                    <View key={catLimit.category} style={styles.categoryItem}>
                                        <View style={styles.categoryHeader}>
                                            <View style={[
                                                styles.categoryIcon,
                                                { backgroundColor: colors.categories[catLimit.category] + '20' }
                                            ]}>
                                                <Ionicons 
                                                    name={cat?.icon || 'ellipse'} 
                                                    size={20} 
                                                    color={colors.categories[catLimit.category]} 
                                                />
                                            </View>
                                            <View style={styles.categoryInfo}>
                                                <Text style={styles.categoryName}>{cat?.label || catLimit.category}</Text>
                                                <Text style={styles.categoryAmount}>
                                                    {formatCurrency(spent)}
                                                    <Text style={styles.categoryLimit}> / {formatCurrency(catLimit.limit)}</Text>
                                                </Text>
                                            </View>
                                            <View style={styles.categoryPercentage}>
                                                <Text style={[
                                                    styles.percentageText,
                                                    { color: percentage > 100 ? colors.error : colors.text }
                                                ]}>
                                                    {percentage}%
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.categoryProgress}>
                                            <BudgetProgress
                                                spent={spent}
                                                limit={catLimit.limit}
                                                color={colors.categories[catLimit.category]}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default BudgetScreen;
