import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { paymentMethods } from '../utils/constants';
import { expensesAPI } from '../api/client';
import Button from '../components/Button';
import Input from '../components/Input';
import CategoryPicker from '../components/CategoryPicker';

const AddExpenseScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
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
            padding: 20,
            paddingTop: 60
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 30
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
            fontWeight: '600'
        },
        amountContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30
        },
        currencySymbol: {
            color: colors.text,
            fontSize: 36,
            fontWeight: '700',
            marginRight: 8
        },
        amountInput: {
            flex: 0,
            width: 200
        },
        paymentSection: {
            marginBottom: 20
        },
        label: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500',
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
            borderRadius: 12
        },
        paymentChipActive: {
            backgroundColor: colors.primary + '30'
        },
        paymentLabel: {
            color: colors.textSecondary,
            fontSize: 14,
            marginLeft: 8
        },
        paymentLabelActive: {
            color: colors.primary
        },
        buttons: {
            marginTop: 'auto',
            paddingTop: 30
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
                            <Ionicons name="arrow-back" size={20} color={colors.primary} />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {isEditing ? 'Edit Expense' : 'New Expense'}
                        </Text>
                        <View style={{ width: 50 }} />
                    </View>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <Input
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            error={errors.amount}
                            style={styles.amountInput}
                        />
                    </View>

                    {/* Category Picker */}
                    <CategoryPicker
                        selected={category}
                        onSelect={setCategory}
                    />

                    {/* Description */}
                    <Input
                        label="Description (Optional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What was this expense for?"
                        icon="create"
                    />

                    {/* Payment Method */}
                    <View style={styles.paymentSection}>
                        <Text style={styles.label}>Payment Method</Text>
                        <View style={styles.paymentMethods}>
                            {paymentMethods.map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.paymentChip,
                                        paymentMethod === method.id && styles.paymentChipActive
                                    ]}
                                    onPress={() => setPaymentMethod(method.id)}
                                >
                                    <Ionicons
                                        name={method.icon}
                                        size={18}
                                        color={paymentMethod === method.id ? colors.primary : colors.textSecondary}
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
                            size="large"
                            icon={isEditing ? 'checkmark' : 'add'}
                        />

                        {isEditing && (
                            <Button
                                title="Delete Expense"
                                onPress={handleDelete}
                                variant="danger"
                                icon="trash"
                                style={{ marginTop: 12 }}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddExpenseScreen;
