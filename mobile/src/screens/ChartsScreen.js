import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../hooks/useCurrency';
import { categories } from '../utils/constants';
import { analyticsAPI } from '../api/client';
import { getMonthName, getCurrentMonthYear } from '../utils/helpers';

const { width } = Dimensions.get('window');

const ChartsScreen = () => {
    const { colors, isDark } = useTheme();
    const { formatCurrency } = useCurrency();
    const [categoryData, setCategoryData] = useState(null);
    const [monthlyTrend, setMonthlyTrend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('6'); // 3, 6, 12 months

    const { month, year } = getCurrentMonthYear();

    const fetchData = useCallback(async () => {
        try {
            const [catRes, trendRes] = await Promise.all([
                analyticsAPI.getByCategory(),
                analyticsAPI.getMonthlyTrend({ months: parseInt(selectedPeriod) })
            ]);

            setCategoryData(catRes.data.data);
            setMonthlyTrend(trendRes.data.data);
        } catch (error) {
            console.log('Charts fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Prepare pie chart data
    const pieData = categoryData?.categories?.slice(0, 6).map((item) => {
        const cat = categories.find(c => c.id === item.category) || categories[categories.length - 1];
        return {
            name: cat.label,
            amount: item.amount,
            color: colors.categories[item.category] || colors.textMuted,
            legendFontColor: colors.textSecondary,
            legendFontSize: 12
        };
    }) || [];

    // Prepare line chart data
    const lineData = monthlyTrend ? {
        labels: monthlyTrend.map(m => m.label),
        datasets: [{
            data: monthlyTrend.map(m => m.total || 0),
            color: (opacity = 1) => colors.primary,
            strokeWidth: 3
        }]
    } : null;

    // Calculate comparisons
    const currentMonthTotal = categoryData?.total || 0;
    const previousMonthTotal = monthlyTrend && monthlyTrend.length >= 2 
        ? monthlyTrend[monthlyTrend.length - 2].total 
        : 0;
    const monthChange = previousMonthTotal > 0 
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
        : 0;
    const isIncrease = monthChange > 0;

    // Calculate average
    const averageSpending = monthlyTrend && monthlyTrend.length > 0
        ? monthlyTrend.reduce((sum, m) => sum + m.total, 0) / monthlyTrend.length
        : 0;

    // Top spending category
    const topCategory = categoryData?.categories?.[0];
    const topCat = topCategory ? categories.find(c => c.id === topCategory.category) : null;

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
        statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20
        },
        statCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            flex: 1,
            minWidth: '47%'
        },
        statCardFull: {
            width: '100%'
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12,
            marginBottom: 6
        },
        statValue: {
            color: colors.text,
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 4
        },
        statChange: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
        },
        statChangeText: {
            fontSize: 12,
            fontWeight: '600'
        },
        statSubtext: {
            color: colors.textMuted,
            fontSize: 11,
            marginTop: 4
        },
        periodSelector: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            gap: 4
        },
        periodButton: {
            flex: 1,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center'
        },
        periodButtonActive: {
            backgroundColor: colors.primary
        },
        periodButtonText: {
            color: colors.textMuted,
            fontSize: 13,
            fontWeight: '600'
        },
        periodButtonTextActive: {
            color: '#FFFFFF'
        },
        chartCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
        },
        chartTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
        },
        lineChart: {
            borderRadius: 16,
            marginLeft: -10
        },
        emptyChart: {
            alignItems: 'center',
            paddingVertical: 40
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.surfaceLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12
        },
        emptyText: {
            color: colors.textMuted,
            fontSize: 14
        },
        breakdownItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.surfaceLight
        },
        breakdownLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        },
        categoryIconSmall: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        breakdownLabel: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500'
        },
        breakdownRight: {
            alignItems: 'flex-end'
        },
        breakdownAmount: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 2
        },
        breakdownPercent: {
            color: colors.textMuted,
            fontSize: 12
        },
        insightCard: {
            backgroundColor: colors.primary + '15',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary
        },
        insightTitle: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 8
        },
        insightText: {
            color: colors.textSecondary,
            fontSize: 13,
            lineHeight: 20
        },
        comparisonCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
        },
        comparisonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10
        },
        comparisonLabel: {
            color: colors.textMuted,
            fontSize: 13
        },
        comparisonValue: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600'
        }
    });

    const chartConfig = {
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        color: (opacity = 1) => colors.primary,
        labelColor: () => colors.textSecondary,
        strokeWidth: 3,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: colors.primary
        },
        decimalPlaces: 0
    };

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
                    <Text style={styles.title}>Analytics</Text>
                    <Text style={styles.subtitle}>{getMonthName(month)} {year}</Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {/* Current Month */}
                    <View style={[styles.statCard, styles.statCardFull]}>
                        <Text style={styles.statLabel}>This Month</Text>
                        <Text style={styles.statValue}>{formatCurrency(currentMonthTotal)}</Text>
                        {previousMonthTotal > 0 && (
                            <View style={styles.statChange}>
                                <Ionicons 
                                    name={isIncrease ? "trending-up" : "trending-down"} 
                                    size={14} 
                                    color={isIncrease ? colors.error : colors.success} 
                                />
                                <Text style={[
                                    styles.statChangeText,
                                    { color: isIncrease ? colors.error : colors.success }
                                ]}>
                                    {Math.abs(monthChange)}% vs last month
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Average */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Average</Text>
                        <Text style={styles.statValue}>{formatCurrency(averageSpending)}</Text>
                        <Text style={styles.statSubtext}>Per month</Text>
                    </View>

                    {/* Top Category */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Top Category</Text>
                        <Text style={styles.statValue}>{topCat?.label || 'N/A'}</Text>
                        <Text style={styles.statSubtext}>
                            {topCategory ? formatCurrency(topCategory.amount) : ''}
                        </Text>
                    </View>
                </View>

                {/* Insight Card */}
                {previousMonthTotal > 0 && (
                    <View style={styles.insightCard}>
                        <Text style={styles.insightTitle}>💡 Insight</Text>
                        <Text style={styles.insightText}>
                            {isIncrease 
                                ? `You spent ${Math.abs(monthChange)}% more this month compared to last month. Consider reviewing your ${topCat?.label || 'top'} expenses.`
                                : `Great job! You spent ${Math.abs(monthChange)}% less this month. Keep up the good work!`
                            }
                        </Text>
                    </View>
                )}

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === '3' && styles.periodButtonActive]}
                        onPress={() => setSelectedPeriod('3')}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === '3' && styles.periodButtonTextActive
                        ]}>3 Months</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === '6' && styles.periodButtonActive]}
                        onPress={() => setSelectedPeriod('6')}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === '6' && styles.periodButtonTextActive
                        ]}>6 Months</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === '12' && styles.periodButtonActive]}
                        onPress={() => setSelectedPeriod('12')}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === '12' && styles.periodButtonTextActive
                        ]}>12 Months</Text>
                    </TouchableOpacity>
                </View>

                {/* Line Chart - Monthly Trend */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Spending Trend</Text>
                    {lineData && lineData.datasets[0].data.some(d => d > 0) ? (
                        <LineChart
                            data={lineData}
                            width={width - 80}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.lineChart}
                            withInnerLines={false}
                            withOuterLines={false}
                            fromZero
                        />
                    ) : (
                        <View style={styles.emptyChart}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="trending-up" size={36} color={colors.textMuted} />
                            </View>
                            <Text style={styles.emptyText}>Not enough data</Text>
                        </View>
                    )}
                </View>

                {/* Comparison Card */}
                {monthlyTrend && monthlyTrend.length >= 2 && (
                    <View style={styles.comparisonCard}>
                        <Text style={styles.chartTitle}>Month Comparison</Text>
                        {monthlyTrend.slice(-3).reverse().map((m, idx) => (
                            <View key={idx} style={styles.comparisonRow}>
                                <Text style={styles.comparisonLabel}>{m.label}</Text>
                                <Text style={styles.comparisonValue}>{formatCurrency(m.total)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Pie Chart - By Category */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Spending by Category</Text>
                    {pieData.length > 0 ? (
                        <PieChart
                            data={pieData}
                            width={width - 80}
                            height={220}
                            chartConfig={chartConfig}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    ) : (
                        <View style={styles.emptyChart}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="pie-chart" size={36} color={colors.textMuted} />
                            </View>
                            <Text style={styles.emptyText}>No data yet</Text>
                        </View>
                    )}
                </View>

                {/* Category Breakdown */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Category Details</Text>
                    {categoryData?.categories?.map((item, idx) => {
                        const cat = categories.find(c => c.id === item.category) || categories[categories.length - 1];
                        const categoryColor = colors.categories[item.category] || colors.textMuted;

                        return (
                            <View key={item.category} style={[
                                styles.breakdownItem,
                                idx === categoryData.categories.length - 1 && { borderBottomWidth: 0 }
                            ]}>
                                <View style={styles.breakdownLeft}>
                                    <View style={[
                                        styles.categoryIconSmall,
                                        { backgroundColor: categoryColor + '20' }
                                    ]}>
                                        <Ionicons name={cat.icon} size={18} color={categoryColor} />
                                    </View>
                                    <Text style={styles.breakdownLabel}>{cat.label}</Text>
                                </View>
                                <View style={styles.breakdownRight}>
                                    <Text style={styles.breakdownAmount}>{formatCurrency(item.amount)}</Text>
                                    <Text style={styles.breakdownPercent}>{item.percentage}%</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default ChartsScreen;
