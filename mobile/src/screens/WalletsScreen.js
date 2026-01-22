import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { walletTypes } from '../utils/constants';
import { walletsAPI } from '../api/client';
import WalletCard from '../components/WalletCard';
import Button from '../components/Button';
import Input from '../components/Input';

const WalletsScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletType, setNewWalletType] = useState('group');
    const [creating, setCreating] = useState(false);

    const fetchWallets = useCallback(async () => {
        try {
            const response = await walletsAPI.getAll();
            setWallets(response.data.data);
        } catch (error) {
            console.log('Wallets fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    useFocusEffect(
        useCallback(() => {
            fetchWallets();
        }, [fetchWallets])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchWallets();
    };

    const handleCreateWallet = async () => {
        if (!newWalletName.trim()) {
            Alert.alert('Error', 'Please enter a wallet name');
            return;
        }

        setCreating(true);
        try {
            await walletsAPI.create({
                name: newWalletName.trim(),
                type: newWalletType
            });

            setShowCreate(false);
            setNewWalletName('');
            fetchWallets();
        } catch (error) {
            Alert.alert('Error', 'Failed to create wallet');
        } finally {
            setCreating(false);
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
        titleContainer: {},
        title: {
            color: colors.text,
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 4
        },
        subtitle: {
            color: colors.textMuted,
            fontSize: 14
        },
        createCard: {
            backgroundColor: colors.surface,
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 20,
            marginBottom: 20
        },
        createTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 16
        },
        typeLabel: {
            color: colors.textSecondary,
            fontSize: 14,
            marginBottom: 10
        },
        typeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 20
        },
        typeChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceLight,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12
        },
        typeChipActive: {
            backgroundColor: colors.primary + '30'
        },
        typeText: {
            color: colors.textSecondary,
            fontSize: 13,
            marginLeft: 8
        },
        typeTextActive: {
            color: colors.primary
        },
        createButtons: {
            marginTop: 10
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
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Shared Wallets</Text>
                    <Text style={styles.subtitle}>Split bills with friends</Text>
                </View>
                <Button
                    title="New"
                    icon="add"
                    size="small"
                    onPress={() => setShowCreate(true)}
                />
            </View>

            {showCreate && (
                <View style={styles.createCard}>
                    <Text style={styles.createTitle}>Create New Wallet</Text>
                    <Input
                        value={newWalletName}
                        onChangeText={setNewWalletName}
                        placeholder="Wallet name (e.g., Trip to Goa)"
                        icon="wallet"
                    />

                    <Text style={styles.typeLabel}>Wallet Type</Text>
                    <View style={styles.typeGrid}>
                        {walletTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeChip,
                                    newWalletType === type.id && styles.typeChipActive
                                ]}
                                onPress={() => setNewWalletType(type.id)}
                            >
                                <Ionicons
                                    name={type.icon}
                                    size={18}
                                    color={newWalletType === type.id ? colors.primary : colors.textSecondary}
                                />
                                <Text style={[
                                    styles.typeText,
                                    newWalletType === type.id && styles.typeTextActive
                                ]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.createButtons}>
                        <Button
                            title="Create Wallet"
                            onPress={handleCreateWallet}
                            loading={creating}
                            icon="checkmark"
                        />
                        <Button
                            title="Cancel"
                            onPress={() => setShowCreate(false)}
                            variant="outline"
                            style={{ marginTop: 10 }}
                        />
                    </View>
                </View>
            )}
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Ionicons name="people" size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyText}>No shared wallets yet</Text>
            <Text style={styles.emptySubtext}>
                Create a wallet to start splitting bills with friends
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={wallets}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <WalletCard
                            wallet={item}
                            onPress={() => navigation.navigate('WalletDetail', { wallet: item })}
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
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

export default WalletsScreen;
