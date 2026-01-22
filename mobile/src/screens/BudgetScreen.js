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
import { formatCurrency, getCurrentMonthYear, getMonthName } from '../utils/helpers';
import BudgetProgress from '../components/BudgetProgress';
import Button from '../components/Button';
import Input from '../components/Input';

const BudgetScreen = ({ navigation }) => {
    const { colors } = useTheme();
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
        mainCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24
        },
        cardLabel: {
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 8
        },
        budgetAmount: {
            color: colors.text,
            fontSize: 32,
            fontWeight: '700',
            marginBottom: 16
        },
        ofLimit: {
            color: colors.textMuted,
            fontSize: 18,
            fontWeight: '400'
        },
        statsRow: {
            flexDirection: 'row',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.surfaceLight
        },
        statItem: {
            flex: 1
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12,
            marginBottom: 4
        },
        statValue: {
            color: colors.text,
            fontSize: 16,
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
            borderRadius: 12,
            padding: 16,
            marginBottom: 10
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8
        },
        categoryName: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500',
            marginLeft: 10
        },
        categoryProgress: {
            marginTop: 8
        },
        categoryAmount: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8
        },
        categoryLimit: {
            color: colors.textMuted,
            fontWeight: '400'
        },
        categoryInput: {
            marginTop: 8,
            marginBottom: 0
        },
        buttonContainer: {
            paddingBottom: 100
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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Budget</Text>
                    <Text style={styles.subtitle}>{getMonthName(month)} {year}</Text>
                </View>

                {/* Main Budget Card */}
                <View style={styles.mainCard}>
                    {isEditing ? (
                        <View>
                            <Text style={styles.cardLabel}>Set Monthly Budget</Text>
                            <Input
                                value={totalLimit}
                                onChangeText={setTotalLimit}
                                placeholder="Enter total budget"
                                keyboardType="decimal-pad"
                                icon="cash"
                            />
                        </View>
                    ) : (
                        <>
                            <Text style={styles.cardLabel}>Monthly Budget</Text>
                            <Text style={styles.budgetAmount}>
                                {formatCurrency(totalSpent)}
                                <Text style={styles.ofLimit}> / {formatCurrency(budgetLimit)}</Text>
                            </Text>
                            <BudgetProgress
                                spent={totalSpent}
                                limit={budgetLimit}
                                showLabel={false}
                            />
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Remaining</Text>
                                    <Text style={[
                                        styles.statValue,
                                        { color: budgetLimit - totalSpent >= 0 ? colors.success : colors.error }
                                    ]}>
                                        {formatCurrency(Math.max(0, budgetLimit - totalSpent))}
                                    </Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Daily Average</Text>
                                    <Text style={styles.statValue}>
                                        {formatCurrency((budgetLimit - totalSpent) / (30 - new Date().getDate()))}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Category Budgets */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {isEditing ? 'Set Category Limits' : 'Category Breakdown'}
                    </Text>

                    {categories.map((cat) => {
                        const spent = getCategorySpending(cat.id);
                        const limit = budget?.categoryLimits?.find(c => c.category === cat.id)?.limit || 0;
                        const categoryColor = colors.categories[cat.id];

                        return (
                            <View key={cat.id} style={styles.categoryItem}>
                                <View style={styles.categoryHeader}>
                                    <Ionicons name={cat.icon} size={20} color={categoryColor} />
                                    <Text style={styles.categoryName}>{cat.label}</Text>
                                </View>

                                {isEditing ? (
                                    <Input
                                        value={categoryLimits[cat.id] || ''}
                                        onChangeText={(val) => setCategoryLimits(prev => ({
                                            ...prev,
                                            [cat.id]: val
                                        }))}
                                        placeholder="0"
                                        keyboardType="decimal-pad"
                                        style={styles.categoryInput}
                                    />
                                ) : (
                                    <View style={styles.categoryProgress}>
                                        <Text style={styles.categoryAmount}>
                                            {formatCurrency(spent)}
                                            {limit > 0 && (
                                                <Text style={styles.categoryLimit}> / {formatCurrency(limit)}</Text>
                                            )}
                                        </Text>
                                        {limit > 0 && (
                                            <BudgetProgress spent={spent} limit={limit} showLabel={false} />
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Action Button */}
                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <>
                            <Button
                                title="Save Budget"
                                onPress={handleSave}
                                size="large"
                                icon="checkmark"
                            />
                            <Button
                                title="Cancel"
                                onPress={() => setIsEditing(false)}
                                variant="outline"
                                style={{ marginTop: 12 }}
                            />
                        </>
                    ) : (
                        <Button
                            title="Edit Budget"
                            onPress={() => setIsEditing(true)}
                            icon="create"
                            size="large"
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default BudgetScreen;
