import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, themes } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import Button from '../components/Button';

const ProfileScreen = ({ navigation }) => {
    const { colors, theme, setTheme, availableThemes } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: logout
                }
            ]
        );
    };

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
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
        menuSection: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24
        },
        menuItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 18,
            borderBottomWidth: 1,
            borderBottomColor: colors.surfaceLight
        },
        menuLeft: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        menuLabel: {
            color: colors.text,
            fontSize: 15,
            marginLeft: 14
        },
        logoutSection: {
            marginBottom: 24
        },
        version: {
            color: colors.textMuted,
            fontSize: 12,
            textAlign: 'center'
        }
    });

    const menuItems = [
        { icon: 'person', label: 'Edit Profile', onPress: () => { } },
        { icon: 'cash', label: 'Currency Settings', onPress: () => { } },
        { icon: 'notifications', label: 'Notifications', onPress: () => { } },
        { icon: 'shield-checkmark', label: 'Privacy & Security', onPress: () => { } },
        { icon: 'download', label: 'Export Data', onPress: () => { } },
        { icon: 'help-circle', label: 'Help & Support', onPress: () => { } },
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
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                    </View>
                    <Text style={styles.name}>{user?.name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>--</Text>
                            <Text style={styles.statLabel}>Expenses</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{user?.currency || 'USD'}</Text>
                            <Text style={styles.statLabel}>Currency</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>--</Text>
                            <Text style={styles.statLabel}>Wallets</Text>
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

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
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
        </View>
    );
};

export default ProfileScreen;
