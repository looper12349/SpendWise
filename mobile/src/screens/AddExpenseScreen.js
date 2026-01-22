import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../hooks/useCurrency';
import { paymentMethods } from '../utils/constants';
import { expensesAPI } from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';
import CategoryPicker from '../components/CategoryPicker';

const AddExpenseScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const { getCurrencySymbol } = useCurrency();
    const existingExpense = route.params?.expense;
    const isEditing = !!existingExpense;

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [description, setDescription] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingExpense) {
            setAmount(String(existingExpense.amount));
            setCategory(existingExpense.category);
            setDescription(existingExpense.description || '');
            setPaymentMethod(existingExpense.paymentMethod || 'cash');
        }
    }, [existingExpense]);

    const validate = () => {
        const newErrors = {};

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const data = {
                amount: parseFloat(amount),
                category,
                description: description.trim(),
                paymentMethod
            };

            if (isEditing) {
                await expensesAPI.update(existingExpense._id, data);
            } else {
                await expensesAPI.create(data);
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await expensesAPI.delete(existingExpense._id);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete expense');
                        }
                    }
                }
            ]
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        },
        keyboardView: {
            flex: 1
        },
        scrollContent: {
            flexGrow: 1,
            padding: 20
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 60,
            marginBottom: 30
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            color: colors.text,
            fontSize: 24,
            fontWeight: '700'
        },
        deleteButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.error + '20',
            justifyContent: 'center',
            alignItems: 'center'
        },
        amountCard: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 30,
            marginBottom: 24,
            alignItems: 'center'
        },
        amountLabel: {
            color: colors.textMuted,
            fontSize: 14,
            marginBottom: 16
        },
        amountRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        currencySymbol: {
            color: colors.text,
            fontSize: 48,
            fontWeight: '700',
            marginRight: 8
        },
        amountInputWrapper: {
            minWidth: 150
        },
        amountInput: {
            color: colors.text,
            fontSize: 48,
            fontWeight: '700',
            textAlign: 'center',
            padding: 0,
            margin: 0
        },
        section: {
            marginBottom: 24
        },
        sectionTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12
        },
        paymentMethods: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10
        },
        paymentChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'transparent'
        },
        paymentChipActive: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary
        },
        paymentIcon: {
            marginRight: 8
        },
        paymentLabel: {
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: '500'
        },
        paymentLabelActive: {
            color: colors.primary,
            fontWeight: '600'
        },
        buttons: {
            marginTop: 20,
            paddingBottom: 40
        }
    });

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {isEditing ? 'Edit Expense' : 'Add Expense'}
                        </Text>
                        {isEditing ? (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDelete}
                            >
                                <Ionicons name="trash" size={20} color={colors.error} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 40 }} />
                        )}
                    </View>

                    {/* Amount Card */}
                    <View style={styles.amountCard}>
                        <Text style={styles.amountLabel}>Amount</Text>
                        <View style={styles.amountRow}>
                            <Text style={styles.currencySymbol}>{getCurrencySymbol()}</Text>
                            <View style={styles.amountInputWrapper}>
                                <TextInput
                                    value={amount}
                                    onChangeText={setAmount}
                                    placeholder="0"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="decimal-pad"
                                    style={styles.amountInput}
                                    autoFocus={!isEditing}
                                />
                            </View>
                        </View>
                        {errors.amount && (
                            <Text style={{ color: colors.error, fontSize: 13, marginTop: 12 }}>
                                {errors.amount}
                            </Text>
                        )}
                    </View>

                    {/* Category Picker */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <CategoryPicker
                            selected={category}
                            onSelect={setCategory}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description (Optional)</Text>
                        <Input
                            value={description}
                            onChangeText={setDescription}
                            placeholder="What was this for?"
                            icon="create"
                            style={{ marginBottom: 0 }}
                        />
                    </View>

                    {/* Payment Method */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <View style={styles.paymentMethods}>
                            {paymentMethods.map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.paymentChip,
                                        paymentMethod === method.id && styles.paymentChipActive
                                    ]}
                                    onPress={() => setPaymentMethod(method.id)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={method.icon}
                                        size={20}
                                        color={paymentMethod === method.id ? colors.primary : colors.textSecondary}
                                        style={styles.paymentIcon}
                                    />
                                    <Text style={[
                                        styles.paymentLabel,
                                        paymentMethod === method.id && styles.paymentLabelActive
                                    ]}>
                                        {method.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttons}>
                        <Button
                            title={isEditing ? 'Update Expense' : 'Add Expense'}
                            onPress={handleSave}
                            loading={loading}
                            icon={isEditing ? 'checkmark' : 'add'}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddExpenseScreen;
