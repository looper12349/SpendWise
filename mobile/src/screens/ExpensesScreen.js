import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../utils/constants';
import { expensesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ExpenseCard from '../components/ExpenseCard';
import Button from '../components/Button';

const ExpensesScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchExpenses = useCallback(async (reset = false) => {
        try {
            const currentPage = reset ? 1 : page;
            const params = {
                limit: 20,
                page: currentPage,
                ...(selectedCategory && { category: selectedCategory })
            };

            const response = await expensesAPI.getAll(params);
            const newExpenses = response.data.data;

            if (reset) {
                setExpenses(newExpenses);
            } else {
                setExpenses(prev => [...prev, ...newExpenses]);
            }

            setHasMore(currentPage < response.data.pages);
            if (!reset) setPage(currentPage + 1);
        } catch (error) {
            console.log('Expenses fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, selectedCategory]);

    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchExpenses(true);
    }, [selectedCategory]);

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            fetchExpenses(true);
        }, [selectedCategory])
    );

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchExpenses(true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchExpenses();
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        },
        headerContainer: {
            paddingTop: 60,
            paddingBottom: 10
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 20
        },
        title: {
            color: colors.text,
            fontSize: 28,
            fontWeight: '700'
        },
        categoryFilter: {
            paddingHorizontal: 20,
            paddingBottom: 10
        },
        categoryChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            marginRight: 10
        },
        categoryChipActive: {
            backgroundColor: colors.primary + '30'
        },
        categoryLabel: {
            color: colors.textSecondary,
            fontSize: 13,
            marginLeft: 6
        },
        categoryLabelActive: {
            color: colors.primary
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: 100
        },
        cardContainer: {
            paddingHorizontal: 20
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 40
        },
        emptyIcon: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        },
        emptyText: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 8
        },
        emptySubtext: {
            color: colors.textMuted,
            fontSize: 14,
            textAlign: 'center'
        }
    });

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Expenses</Text>
                <Button
                    title="Add"
                    icon="add"
                    size="small"
                    onPress={() => navigation.navigate('AddExpense')}
                />
            </View>

            {/* Category Filter */}
            <FlatList
                horizontal
                data={[{ id: null, label: 'All', icon: 'list' }, ...categories]}
                keyExtractor={(item) => item.id || 'all'}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryFilter}
                renderItem={({ item }) => {
                    const isSelected = selectedCategory === item.id;
                    const categoryColor = item.id ? colors.categories[item.id] : colors.textSecondary;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                isSelected && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(item.id)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={16}
                                color={isSelected ? colors.primary : categoryColor}
                            />
                            <Text style={[
                                styles.categoryLabel,
                                isSelected && styles.categoryLabelActive
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Ionicons name="wallet" size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubtext}>
                {selectedCategory ? 'Try a different category' : 'Start adding your expenses'}
            </Text>
            <Button
                title="Add Expense"
                onPress={() => navigation.navigate('AddExpense')}
                icon="add"
                style={{ marginTop: 20 }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <ExpenseCard
                            expense={item}
                            currency={user?.currency}
                            onPress={() => navigation.navigate('AddExpense', { expense: item })}
                        />
                    </View>
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={!loading && renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

export default ExpensesScreen;
