import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../hooks/useCurrency';
import { walletTypes } from '../utils/constants';

const WalletCard = ({ wallet, onPress }) => {
    const { colors } = useTheme();
    const { formatCurrency } = useCurrency();
    const walletType = walletTypes.find(t => t.id === wallet.type) || walletTypes[walletTypes.length - 1];
    const memberCount = wallet.members?.length || 0;

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 16
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16
        },
        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 14,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center'
        },
        info: {
            marginLeft: 14
        },
        name: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 4
        },
        type: {
            color: colors.textMuted,
            fontSize: 13
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.surfaceLight
        },
        stat: {
            alignItems: 'center'
        },
        statValue: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4
        },
        statLabel: {
            color: colors.textMuted,
            fontSize: 12
        },
        avatars: {
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row'
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.surface
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600'
        },
        moreAvatar: {
            backgroundColor: colors.surfaceLight
        },
        moreText: {
            color: colors.textMuted,
            fontSize: 10,
            fontWeight: '600'
        }
    });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress?.(wallet)}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name={walletType.icon} size={26} color={colors.primary} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{wallet.name}</Text>
                    <Text style={styles.type}>{walletType.label}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{memberCount}</Text>
                    <Text style={styles.statLabel}>Members</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {formatCurrency(wallet.totalExpenses || 0)}
                    </Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            <View style={styles.avatars}>
                {wallet.members?.slice(0, 3).map((member, index) => (
                    <View
                        key={member._id || index}
                        style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                    >
                        <Text style={styles.avatarText}>
                            {member.user?.name?.[0] || '?'}
                        </Text>
                    </View>
                ))}
                {memberCount > 3 && (
                    <View style={[styles.avatar, styles.moreAvatar, { marginLeft: -8 }]}>
                        <Text style={styles.moreText}>+{memberCount - 3}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default WalletCard;
