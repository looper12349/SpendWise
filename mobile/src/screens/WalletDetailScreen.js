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
import { walletsAPI } from '../api/client';
import { getInitials } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../hooks/useCurrency';
import Button from '../components/Button';
import Input from '../components/Input';
import CategoryPicker from '../components/CategoryPicker';

const WalletDetailScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const { wallet: initialWallet } = route.params;
    const { user } = useAuth();
    const { formatCurrency } = useCurrency();

    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Add member state
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');
    const [addingMember, setAddingMember] = useState(false);

    // Add expense state
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('food');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [addingExpense, setAddingExpense] = useState(false);

    const fetchWallet = useCallback(async () => {
        try {
            const response = await walletsAPI.getOne(initialWallet._id);
            setWalletData(response.data.data);
        } catch (error) {
            console.log('Wallet fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [initialWallet._id]);

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    useFocusEffect(
        useCallback(() => {
            fetchWallet();
        }, [fetchWallet])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchWallet();
    };

    const handleAddMember = async () => {
        if (!memberEmail.trim()) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        setAddingMember(true);
        try {
            await walletsAPI.addMember(initialWallet._id, memberEmail.trim());
            setShowAddMember(false);
            setMemberEmail('');
            fetchWallet();
            Alert.alert('Success', 'Member added successfully!');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to add member');
        } finally {
            setAddingMember(false);
        }
    };

    const handleAddExpense = async () => {
        if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setAddingExpense(true);
        try {
            await walletsAPI.addExpense(initialWallet._id, {
                amount: parseFloat(expenseAmount),
                category: expenseCategory,
                description: expenseDescription.trim()
            });
            setShowAddExpense(false);
            setExpenseAmount('');
            setExpenseDescription('');
            fetchWallet();
            Alert.alert('Success', 'Expense added and split!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add expense');
        } finally {
            setAddingExpense(false);
        }
    };

    const wallet = walletData?.wallet;
    const expenses = walletData?.expenses || [];
    const balances = walletData?.balances || [];
    
    // Find current user's balance
    const myBalance = balances.find(b => b.user._id === user._id);
    const otherBalances = balances.filter(b => b.user._id !== user._id);

    const handleSettle = (userId) => {
        Alert.alert(
            'Settle Up',
            'Mark this balance as settled?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Settle', onPress: () => {
                    // TODO: Implement settle API call
                    Alert.alert('Success', 'Balance settled!');
                }}
            ]
        );
    };

    const handleRemind = (userName) => {
        Alert.alert('Remind', `Send reminder to ${userName}?`);
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
        backButton: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        backText: {
            color: colors.primary,
            fontSize: 16,
            marginLeft: 4
        },
        title: {
            color: colors.text,
            fontSize: 20,
            fontWeight: '600',
            flex: 1,
            textAlign: 'center'
        },
        statsCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            marginBottom: 20
        },
        statsRow: {
            flexDirection: 'row',
            marginBottom: 16
        },
        statItem: {
            flex: 1,
            alignItems: 'center'
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 13,
            marginBottom: 8
        },
        statValue: {
            color: colors.text,
            fontSize: 22,
            fontWeight: '700'
        },
        statDivider: {
            width: 1,
            backgroundColor: colors.surfaceLight,
            marginHorizontal: 16
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.surfaceLight,
            marginTop: 4
        },
        summaryItem: {
            flex: 1
        },
        summaryLabel: {
            color: colors.textMuted,
            fontSize: 12,
            marginBottom: 4
        },
        summaryValue: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600'
        },
        actions: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20
        },
        actionBtn: {
            flex: 1
        },
        formCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
        },
        formTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
        },
        splitInfo: {
            color: colors.textMuted,
            fontSize: 13,
            marginBottom: 16,
            textAlign: 'center'
        },
        formButtons: {
            gap: 10
        },
        cancelBtn: {
            alignItems: 'center',
            padding: 12
        },
        cancelText: {
            color: colors.textMuted
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
        balanceItem: {
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12
        },
        balanceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        },
        balanceLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600'
        },
        memberInfo: {
            flex: 1
        },
        memberName: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 2
        },
        memberEmail: {
            color: colors.textMuted,
            fontSize: 12
        },
        balanceRight: {
            alignItems: 'flex-end'
        },
        balanceAmount: {
            fontSize: 18,
            fontWeight: '700',
            marginBottom: 2
        },
        balanceLabel: {
            color: colors.textMuted,
            fontSize: 11
        },
        balanceBreakdown: {
            backgroundColor: colors.surfaceLight,
            borderRadius: 8,
            padding: 12,
            marginTop: 8
        },
        breakdownRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6
        },
        breakdownLabel: {
            color: colors.textMuted,
            fontSize: 13
        },
        breakdownValue: {
            color: colors.text,
            fontSize: 13,
            fontWeight: '500'
        },
        breakdownDivider: {
            height: 1,
            backgroundColor: colors.background,
            marginVertical: 8
        },
        breakdownTotal: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4
        },
        breakdownTotalLabel: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '600'
        },
        breakdownTotalValue: {
            fontSize: 14,
            fontWeight: '700'
        },
        settleButton: {
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginTop: 12,
            alignItems: 'center'
        },
        settleButtonText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600'
        },
        remindButton: {
            backgroundColor: colors.surfaceLight,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginTop: 12,
            alignItems: 'center'
        },
        remindButtonText: {
            color: colors.primary,
            fontSize: 13,
            fontWeight: '600'
        },
        settledBadge: {
            backgroundColor: colors.success + '20',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            marginTop: 12,
            alignSelf: 'flex-start'
        },
        settledBadgeText: {
            color: colors.success,
            fontSize: 12,
            fontWeight: '600'
        },
        yourBalanceCard: {
            backgroundColor: colors.primary + '15',
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: colors.primary + '30'
        },
        yourBalanceTitle: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 8
        },
        yourBalanceAmount: {
            fontSize: 32,
            fontWeight: '700',
            marginBottom: 4
        },
        yourBalanceSubtext: {
            color: colors.textMuted,
            fontSize: 13,
            marginTop: 4
        },
        emptyText: {
            color: colors.textMuted,
            textAlign: 'center',
            padding: 20
        },
        expenseItem: {
            backgroundColor: colors.surface,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12
        },
        expenseHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12
        },
        expenseIcon: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
        },
        expenseInfo: {
            flex: 1
        },
        expenseDesc: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 2
        },
        expensePaidBy: {
            color: colors.textMuted,
            fontSize: 12
        },
        expenseAmount: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '700'
        },
        expenseBreakdown: {
            backgroundColor: colors.surfaceLight,
            borderRadius: 8,
            padding: 12,
            marginTop: 8
        },
        expenseBreakdownTitle: {
            color: colors.text,
            fontSize: 13,
            fontWeight: '600',
            marginBottom: 8
        },
        splitRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6
        },
        splitLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        },
        splitAvatar: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8
        },
        splitAvatarText: {
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '600'
        },
        splitName: {
            color: colors.text,
            fontSize: 13,
            flex: 1
        },
        splitAmount: {
            color: colors.text,
            fontSize: 13,
            fontWeight: '600'
        },
        splitBadge: {
            backgroundColor: colors.success + '20',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            marginLeft: 8
        },
        splitBadgeText: {
            color: colors.success,
            fontSize: 10,
            fontWeight: '600'
        },
        expenseDivider: {
            height: 1,
            backgroundColor: colors.background,
            marginVertical: 8
        },
        expenseDate: {
            color: colors.textMuted,
            fontSize: 11,
            marginTop: 8
        },
        yourShareBadge: {
            backgroundColor: colors.primary + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            alignSelf: 'flex-start',
            marginTop: 8
        },
        yourShareText: {
            color: colors.primary,
            fontSize: 12,
            fontWeight: '600'
        },
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1}>{wallet?.name || initialWallet.name}</Text>
                    <View style={{ width: 50 }} />
                </View>

                {/* Total & Stats */}
                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total Expenses</Text>
                            <Text style={styles.statValue}>
                                {formatCurrency(wallet?.totalExpenses || 0)}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Members</Text>
                            <Text style={styles.statValue}>{wallet?.members?.length || 0}</Text>
                        </View>
                    </View>
                    
                    {myBalance && (
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>You paid</Text>
                                <Text style={styles.summaryValue}>
                                    {formatCurrency(myBalance.paid)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Your share</Text>
                                <Text style={styles.summaryValue}>
                                    {formatCurrency(myBalance.share)}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Balance</Text>
                                <Text style={[
                                    styles.summaryValue,
                                    { color: myBalance.balance >= 0 ? colors.success : colors.error }
                                ]}>
                                    {myBalance.balance >= 0 ? '+' : ''}{formatCurrency(myBalance.balance)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title="Add Expense"
                        icon="cash"
                        onPress={() => setShowAddExpense(true)}
                        style={styles.actionBtn}
                    />
                    <Button
                        title="Add Member"
                        icon="person-add"
                        variant="secondary"
                        onPress={() => setShowAddMember(true)}
                        style={styles.actionBtn}
                    />
                </View>

                {/* Add Member Form */}
                {showAddMember && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Add Member</Text>
                        <Input
                            value={memberEmail}
                            onChangeText={setMemberEmail}
                            placeholder="Enter member's email"
                            keyboardType="email-address"
                            icon="mail"
                        />
                        <View style={styles.formButtons}>
                            <Button
                                title="Add"
                                onPress={handleAddMember}
                                loading={addingMember}
                                icon="checkmark"
                            />
                            <TouchableOpacity
                                onPress={() => setShowAddMember(false)}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Add Expense Form */}
                {showAddExpense && (
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Add Shared Expense</Text>
                        <Input
                            value={expenseAmount}
                            onChangeText={setExpenseAmount}
                            placeholder="Enter amount"
                            keyboardType="decimal-pad"
                            icon="cash"
                        />
                        <CategoryPicker
                            selected={expenseCategory}
                            onSelect={setExpenseCategory}
                        />
                        <Input
                            value={expenseDescription}
                            onChangeText={setExpenseDescription}
                            placeholder="Description (optional)"
                            icon="create"
                        />
                        <Text style={styles.splitInfo}>
                            Will be split equally among {wallet?.members?.length || 0} members
                        </Text>
                        <View style={styles.formButtons}>
                            <Button
                                title="Add & Split"
                                onPress={handleAddExpense}
                                loading={addingExpense}
                                icon="checkmark"
                            />
                            <TouchableOpacity
                                onPress={() => setShowAddExpense(false)}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Your Balance Card */}
                {myBalance && (
                    <View style={styles.yourBalanceCard}>
                        <Text style={styles.yourBalanceTitle}>Your Balance</Text>
                        <Text style={[
                            styles.yourBalanceAmount,
                            { color: myBalance.balance >= 0 ? colors.success : colors.error }
                        ]}>
                            {myBalance.balance >= 0 ? '+' : ''}{formatCurrency(myBalance.balance)}
                        </Text>
                        <Text style={styles.yourBalanceSubtext}>
                            {myBalance.balance > 0 
                                ? `You'll get back ${formatCurrency(myBalance.balance)}`
                                : myBalance.balance < 0 
                                ? `You owe ${formatCurrency(Math.abs(myBalance.balance))}`
                                : 'All settled up!'}
                        </Text>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>You paid</Text>
                            <Text style={styles.breakdownValue}>{formatCurrency(myBalance.paid)}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Your share</Text>
                            <Text style={styles.breakdownValue}>{formatCurrency(myBalance.share)}</Text>
                        </View>
                    </View>
                )}

                {/* Balances */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Member Balances</Text>
                    {otherBalances.map((balance, index) => {
                        const isPositive = balance.balance >= 0;
                        const isSettled = balance.balance === 0;
                        
                        return (
                            <View key={balance.user?._id || index} style={styles.balanceItem}>
                                {/* Header with avatar and balance */}
                                <View style={styles.balanceHeader}>
                                    <View style={styles.balanceLeft}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {getInitials(balance.user?.name)}
                                            </Text>
                                        </View>
                                        <View style={styles.memberInfo}>
                                            <Text style={styles.memberName} numberOfLines={1}>
                                                {balance.user?.name}
                                            </Text>
                                            <Text style={styles.memberEmail} numberOfLines={1}>
                                                {balance.user?.email}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.balanceRight}>
                                        <Text style={[
                                            styles.balanceAmount,
                                            { color: isPositive ? colors.success : colors.error }
                                        ]}>
                                            {isPositive ? '+' : ''}{formatCurrency(balance.balance)}
                                        </Text>
                                        <Text style={styles.balanceLabel}>
                                            {isPositive ? 'gets back' : isSettled ? 'settled' : 'owes'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Detailed Breakdown */}
                                <View style={styles.balanceBreakdown}>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>Total paid</Text>
                                        <Text style={styles.breakdownValue}>
                                            {formatCurrency(balance.paid)}
                                        </Text>
                                    </View>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>Fair share</Text>
                                        <Text style={styles.breakdownValue}>
                                            {formatCurrency(balance.share)}
                                        </Text>
                                    </View>
                                    <View style={styles.breakdownDivider} />
                                    <View style={styles.breakdownTotal}>
                                        <Text style={styles.breakdownTotalLabel}>
                                            {isPositive ? 'Should receive' : 'Should pay'}
                                        </Text>
                                        <Text style={[
                                            styles.breakdownTotalValue,
                                            { color: isPositive ? colors.success : colors.error }
                                        ]}>
                                            {formatCurrency(Math.abs(balance.balance))}
                                        </Text>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                {isSettled ? (
                                    <View style={styles.settledBadge}>
                                        <Text style={styles.settledBadgeText}>✓ All Settled</Text>
                                    </View>
                                ) : (
                                    <>
                                        {!isPositive && myBalance?.balance > 0 && (
                                            <TouchableOpacity 
                                                style={styles.remindButton}
                                                onPress={() => handleRemind(balance.user?.name)}
                                            >
                                                <Text style={styles.remindButtonText}>
                                                    Send Reminder
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {isPositive && myBalance?.balance < 0 && (
                                            <TouchableOpacity 
                                                style={styles.settleButton}
                                                onPress={() => handleSettle(balance.user._id)}
                                            >
                                                <Text style={styles.settleButtonText}>
                                                    Settle Up • {formatCurrency(Math.abs(balance.balance))}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Recent Expenses */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Expense History</Text>
                    {expenses.length === 0 ? (
                        <Text style={styles.emptyText}>No expenses yet</Text>
                    ) : (
                        expenses.map((expense) => {
                            const cat = categories.find(c => c.id === expense.category) || categories[9];
                            const categoryColor = colors.categories[expense.category] || colors.textMuted;
                            
                            // Find the split for this expense
                            const split = wallet?.splits?.find(s => 
                                s.expense._id?.toString() === expense._id.toString() ||
                                s.expense.toString() === expense._id.toString()
                            );
                            
                            // Calculate your share
                            const yourSplit = split?.splits?.find(s => 
                                s.user._id?.toString() === user._id.toString() ||
                                s.user.toString() === user._id.toString()
                            );
                            
                            const isPaidByYou = expense.user._id === user._id;
                            const expenseDate = new Date(expense.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            return (
                                <View key={expense._id} style={styles.expenseItem}>
                                    {/* Header */}
                                    <View style={styles.expenseHeader}>
                                        <View style={[styles.expenseIcon, { backgroundColor: categoryColor + '20' }]}>
                                            <Ionicons name={cat.icon} size={24} color={categoryColor} />
                                        </View>
                                        <View style={styles.expenseInfo}>
                                            <Text style={styles.expenseDesc}>
                                                {expense.description || cat.label}
                                            </Text>
                                            <Text style={styles.expensePaidBy}>
                                                Paid by {isPaidByYou ? 'You' : expense.user?.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.expenseAmount}>
                                            {formatCurrency(expense.amount)}
                                        </Text>
                                    </View>

                                    {/* Split Breakdown */}
                                    {split && split.splits && split.splits.length > 0 && (
                                        <View style={styles.expenseBreakdown}>
                                            <Text style={styles.expenseBreakdownTitle}>
                                                Split between {split.splits.length} {split.splits.length === 1 ? 'person' : 'people'}
                                            </Text>
                                            
                                            {split.splits.map((s, idx) => {
                                                const isYou = s.user._id?.toString() === user._id.toString() ||
                                                             s.user.toString() === user._id.toString();
                                                const splitUser = isYou ? { name: 'You' } : 
                                                    (s.user.name ? s.user : wallet?.members?.find(m => 
                                                        m.user._id?.toString() === s.user.toString()
                                                    )?.user);
                                                
                                                return (
                                                    <View key={idx} style={styles.splitRow}>
                                                        <View style={styles.splitLeft}>
                                                            <View style={styles.splitAvatar}>
                                                                <Text style={styles.splitAvatarText}>
                                                                    {getInitials(splitUser?.name || '?')}
                                                                </Text>
                                                            </View>
                                                            <Text style={styles.splitName} numberOfLines={1}>
                                                                {splitUser?.name || 'Unknown'}
                                                            </Text>
                                                            {s.settled && (
                                                                <View style={styles.splitBadge}>
                                                                    <Text style={styles.splitBadgeText}>Paid</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                        <Text style={styles.splitAmount}>
                                                            {formatCurrency(s.amount)}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                            
                                            {yourSplit && (
                                                <>
                                                    <View style={styles.expenseDivider} />
                                                    <View style={styles.splitRow}>
                                                        <Text style={styles.breakdownLabel}>Your share</Text>
                                                        <Text style={[styles.breakdownValue, { fontWeight: '700' }]}>
                                                            {formatCurrency(yourSplit.amount)}
                                                        </Text>
                                                    </View>
                                                </>
                                            )}
                                        </View>
                                    )}
                                    
                                    {/* Your Share Badge */}
                                    {yourSplit && (
                                        <View style={styles.yourShareBadge}>
                                            <Text style={styles.yourShareText}>
                                                {isPaidByYou 
                                                    ? `You paid • Your share: ${formatCurrency(yourSplit.amount)}`
                                                    : `Your share: ${formatCurrency(yourSplit.amount)}`
                                                }
                                            </Text>
                                        </View>
                                    )}
                                    
                                    {/* Date */}
                                    <Text style={styles.expenseDate}>{expenseDate}</Text>
                                </View>
                            );
                        })
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

export default WalletDetailScreen;
