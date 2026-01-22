import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../hooks/useCurrency';
import { analyticsAPI, expensesAPI } from '../api/client';
import { getMonthName, getCurrentMonthYear } from '../utils/helpers';
import ExpenseCard from '../components/ExpenseCard';

const DashboardScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const { formatCurrency } = useCurrency();
    const [overview, setOverview] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [overviewRes, expensesRes] = await Promise.all([
                analyticsAPI.getOverview(),
                expensesAPI.getAll({ limit: 5 })
            ]);

            setOverview(overviewRes.data.data);
            setRecentExpenses(expensesRes.data.data);
        } catch (error) {
            console.log('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const { month, year } = getCurrentMonthYear();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        },
        header: {
            paddingTop: 60,
            paddingBottom: 30,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30
        },
        headerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
        },
        greeting: {
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 4
        },
        date: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center'
        },
        balanceCard: {
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: 20
        },
        balanceLabel: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            marginBottom: 8
        },
        balanceAmount: {
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: '700',
            marginBottom: 16
        },
        balanceStats: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        stat: {
            flex: 1
        },
        statLabel: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            marginBottom: 4
        },
        statValue: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600'
        },
        statDivider: {
            width: 1,
            height: 30,
            backgroundColor: 'rgba(255,255,255,0.2)',
            marginHorizontal: 20
        },
        section: {
            padding: 20
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        actionButton: {
            alignItems: 'center'
        },
        actionIcon: {
            width: 56,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8
        },
        actionLabel: {
            color: colors.textSecondary,
            fontSize: 12
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        },
        sectionTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600'
        },
        seeAll: {
            color: colors.primary,
            fontSize: 14
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        },
        emptyText: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 8
        },
        emptySubtext: {
            color: colors.textMuted,
            fontSize: 14
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
                <LinearGradient
                    colors={colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
                            <Text style={styles.date}>{getMonthName(month)} {year}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.avatar}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Balance Card */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>This Month's Spending</Text>
                        <Text style={styles.balanceAmount}>
                            {formatCurrency(overview?.currentMonth || 0, user?.currency)}
                        </Text>
                        <View style={styles.balanceStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Today</Text>
                                <Text style={styles.statValue}>
                                    {formatCurrency(overview?.today || 0, user?.currency)}
                                </Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>vs Last Month</Text>
                                <Text style={[
                                    styles.statValue,
                                    { color: (overview?.percentChange || 0) > 0 ? '#EF4444' : '#10B981' }
                                ]}>
                                    {(overview?.percentChange || 0) > 0 ? '+' : ''}
                                    {overview?.percentChange || 0}%
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Expenses', { screen: 'AddExpense' })}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                                <Ionicons name="add" size={28} color={colors.primary} />
                            </View>
                            <Text style={styles.actionLabel}>Add Expense</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Budget')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                                <Ionicons name="flag" size={24} color={colors.success} />
                            </View>
                            <Text style={styles.actionLabel}>Set Budget</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Wallets')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
                                <Ionicons name="people" size={24} color={colors.warning} />
                            </View>
                            <Text style={styles.actionLabel}>Split Bill</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('Charts')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
                                <Ionicons name="pie-chart" size={24} color={colors.info} />
                            </View>
                            <Text style={styles.actionLabel}>Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Expenses */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Expenses</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentExpenses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="receipt" size={36} color={colors.textMuted} />
                            </View>
                            <Text style={styles.emptyText}>No expenses yet</Text>
                            <Text style={styles.emptySubtext}>Add your first expense to get started</Text>
                        </View>
                    ) : (
                        recentExpenses.map((expense) => (
                            <ExpenseCard
                                key={expense._id}
                                expense={expense}
                                currency={user?.currency}
                                onPress={() => navigation.navigate('Expenses', {
                                    screen: 'AddExpense',
                                    params: { expense }
                                })}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default DashboardScreen;
