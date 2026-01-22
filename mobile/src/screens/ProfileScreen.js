import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, themes } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import Button from '../components/Button';
import Input from '../components/Input';

const ProfileScreen = ({ navigation }) => {
    const { colors, theme, setTheme, availableThemes } = useTheme();
    const { user, logout, updateProfile } = useAuth();
    
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [editName, setEditName] = useState(user?.name || '');
    const [editCurrency, setEditCurrency] = useState(user?.currency || 'USD');
    const [updating, setUpdating] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    ];

    const handleLogout = () => {
        console.log('=== Logout button clicked! ===');
        setShowLogoutModal(true);
    };

    const confirmLogout = async () => {
        try {
            console.log('=== User confirmed logout ===');
            setLoggingOut(true);
            console.log('Calling logout function...');
            await logout();
            console.log('=== Logout function completed ===');
            setShowLogoutModal(false);
        } catch (error) {
            console.error('=== Error during logout ===', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
        } finally {
            setLoggingOut(false);
        }
    };

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
    };

    const handleEditProfile = () => {
        setEditName(user?.name || '');
        setEditCurrency(user?.currency || 'USD');
        setShowEditModal(true);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setUpdating(true);
        try {
            await updateProfile({
                name: editName.trim(),
                currency: editCurrency
            });
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
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
            fontWeight: '700'
        },
        profileCard: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 28,
            alignItems: 'center',
            marginBottom: 24
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: '700'
        },
        name: {
            color: colors.text,
            fontSize: 22,
            fontWeight: '600',
            marginBottom: 4
        },
        email: {
            color: colors.textMuted,
            fontSize: 14,
            marginBottom: 20
        },
        statsRow: {
            flexDirection: 'row',
            width: '100%',
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.surfaceLight
        },
        statItem: {
            flex: 1,
            alignItems: 'center'
        },
        statValue: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 4
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12
        },
        statDivider: {
            width: 1,
            backgroundColor: colors.surfaceLight
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
        themeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12
        },
        themeOption: {
            width: '47%',
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: 'transparent'
        },
        themeOptionActive: {
            borderColor: colors.primary
        },
        themePreview: {
            flexDirection: 'row',
            marginBottom: 12,
            gap: 6
        },
        themeColorDot: {
            width: 24,
            height: 24,
            borderRadius: 12
        },
        themeName: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500'
        },
        themeCheck: {
            position: 'absolute',
            top: 10,
            right: 10
        },
        logoutSection: {
            marginBottom: 24
        },
        version: {
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center'
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
        },
        modalContent: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 24,
            width: '100%',
            maxWidth: 400
        },
        modalTitle: {
            color: colors.text,
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 20
        },
        currencyGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 20
        },
        currencyOption: {
            backgroundColor: colors.surfaceLight,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'transparent'
        },
        currencyOptionActive: {
            borderColor: colors.primary,
            backgroundColor: colors.primary + '20'
        },
        currencyText: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500'
        },
        modalButtons: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 10
        },
        cancelButton: {
            flex: 1,
            backgroundColor: colors.surfaceLight,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center'
        },
        cancelButtonText: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600'
        },
        editButton: {
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: colors.primary + '20',
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center'
        },
        logoutIconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.error + '20',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 16
        },
        logoutMessage: {
            color: colors.textMuted,
            fontSize: 15,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 22
        }
    });

    const menuItems = [
        { icon: 'help-circle', label: 'Help & Support', onPress: () => Alert.alert('Help', 'Contact: support@spendwise.com') },
        { icon: 'information-circle', label: 'About', onPress: () => Alert.alert('About', 'SpendWise v1.0.0\nExpense tracking made simple') },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={handleEditProfile}
                    >
                        <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{currencies.find(c => c.code === user?.currency)?.symbol || '$'}</Text>
                            <Text style={styles.statLabel}>Currency</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.currency || 'USD'}</Text>
                            <Text style={styles.statLabel}>Code</Text>
                        </View>
                    </View>
                </View>

                {/* Theme Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.themeGrid}>
                        {availableThemes.map((t) => (
                            <TouchableOpacity
                                key={t.id}
                                style={[
                                    styles.themeOption,
                                    theme.id === t.id && styles.themeOptionActive
                                ]}
                                onPress={() => handleThemeChange(t.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.themePreview}>
                                    <View style={[styles.themeColorDot, { backgroundColor: t.colors.primary }]} />
                                    <View style={[styles.themeColorDot, { backgroundColor: t.colors.background }]} />
                                    <View style={[styles.themeColorDot, { backgroundColor: t.colors.surface }]} />
                                </View>
                                <Text style={styles.themeName}>{t.name}</Text>
                                {theme.id === t.id && (
                                    <View style={styles.themeCheck}>
                                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="danger"
                        icon="log-out"
                    />
                </View>

                {/* App Version */}
                <Text style={styles.version}>SpendWise v1.0.0</Text>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        
                        <Input
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Your name"
                            icon="person"
                        />

                        <Text style={[styles.sectionTitle, { fontSize: 14, marginTop: 10, marginBottom: 12 }]}>
                            Currency
                        </Text>
                        <View style={styles.currencyGrid}>
                            {currencies.map((curr) => (
                                <TouchableOpacity
                                    key={curr.code}
                                    style={[
                                        styles.currencyOption,
                                        editCurrency === curr.code && styles.currencyOptionActive
                                    ]}
                                    onPress={() => setEditCurrency(curr.code)}
                                >
                                    <Text style={styles.currencyText}>
                                        {curr.symbol} {curr.code}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Save"
                                    onPress={handleSaveProfile}
                                    loading={updating}
                                    icon="checkmark"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.logoutIconContainer}>
                            <Ionicons name="log-out-outline" size={48} color={colors.error} />
                        </View>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.logoutMessage}>
                            Are you sure you want to logout?
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowLogoutModal(false)}
                                disabled={loggingOut}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Logout"
                                    onPress={confirmLogout}
                                    loading={loggingOut}
                                    variant="danger"
                                    icon="log-out"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileScreen;
