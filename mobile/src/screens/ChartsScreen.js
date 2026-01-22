import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../utils/constants';
import { analyticsAPI } from '../api/client';
import { formatCurrency, getMonthName, getCurrentMonthYear } from '../utils/helpers';

const { width } = Dimensions.get('window');

const ChartsScreen = () => {
    const { colors, isDark } = useTheme();
    const [categoryData, setCategoryData] = useState(null);
    const [monthlyTrend, setMonthlyTrend] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { month, year } = getCurrentMonthYear();

    const fetchData = useCallback(async () => {
        try {
            const [catRes, trendRes] = await Promise.all([
                analyticsAPI.getByCategory(),
                analyticsAPI.getMonthlyTrend({ months: 6 })
            ]);

            setCategoryData(catRes.data.data);
            setMonthlyTrend(trendRes.data.data);
        } catch (error) {
            console.log('Charts fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

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
        totalCard: {
            backgroundColor: colors.primary,
            borderRadius: 20,
            padding: 24,
            marginBottom: 20,
            alignItems: 'center'
        },
        totalLabel: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            marginBottom: 8
        },
        totalAmount: {
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: '700'
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
        breakdownCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
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
            alignItems: 'center'
        },
        colorDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginRight: 10
        },
        breakdownLabel: {
            color: colors.text,
            fontSize: 14,
            marginLeft: 8
        },
        breakdownRight: {
            alignItems: 'flex-end'
        },
        breakdownAmount: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '600'
        },
        breakdownPercent: {
            color: colors.textMuted,
            fontSize: 12,
            marginTop: 2
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
                    <Text style={styles.title}>Analytics</Text>
                    <Text style={styles.subtitle}>{getMonthName(month)} {year}</Text>
                </View>

                {/* Total Spent */}
                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Total This Month</Text>
                    <Text style={styles.totalAmount}>
                        {formatCurrency(categoryData?.total || 0)}
                    </Text>
                </View>

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
                <View style={styles.breakdownCard}>
                    <Text style={styles.chartTitle}>Category Details</Text>
                    {categoryData?.categories?.map((item) => {
                        const cat = categories.find(c => c.id === item.category) || categories[categories.length - 1];
                        const categoryColor = colors.categories[item.category] || colors.textMuted;

                        return (
                            <View key={item.category} style={styles.breakdownItem}>
                                <View style={styles.breakdownLeft}>
                                    <View style={[styles.colorDot, { backgroundColor: categoryColor }]} />
                                    <Ionicons name={cat.icon} size={18} color={categoryColor} />
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

                {/* Line Chart - Monthly Trend */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Monthly Trend</Text>
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

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default ChartsScreen;
