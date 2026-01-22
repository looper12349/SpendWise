import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/Button';

const { height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const { colors, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center'
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 60
        },
        logoIcon: {
            width: 100,
            height: 100,
            borderRadius: 30,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        },
        logoText: {
            fontSize: 36,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8
        },
        tagline: {
            fontSize: 16,
            color: colors.textSecondary
        },
        features: {
            gap: 20
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 16
        },
        featureIcon: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16
        },
        featureText: {
            flex: 1
        },
        featureTitle: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4
        },
        featureDesc: {
            color: colors.textMuted,
            fontSize: 14
        },
        buttons: {
            paddingHorizontal: 24,
            paddingBottom: 40
        },
        button: {
            marginBottom: 12
        }
    });

    return (
        <LinearGradient
            colors={[colors.background, colors.backgroundLight]}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="wallet" size={50} color="#FFFFFF" />
                    </View>
                    <Text style={styles.logoText}>SpendWise</Text>
                    <Text style={styles.tagline}>Smart expense tracking for everyone</Text>
                </View>

                <View style={styles.features}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="pie-chart" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Track Expenses</Text>
                            <Text style={styles.featureDesc}>Monitor your spending habits</Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="flag" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Set Budgets</Text>
                            <Text style={styles.featureDesc}>Stay within your limits</Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Ionicons name="people" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>Split Bills</Text>
                            <Text style={styles.featureDesc}>Share expenses with friends</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.buttons}>
                <Button
                    title="Get Started"
                    onPress={() => navigation.navigate('Register')}
                    size="large"
                    icon="arrow-forward"
                    style={styles.button}
                />
                <Button
                    title="I Already Have an Account"
                    onPress={() => navigation.navigate('Login')}
                    variant="outline"
                    size="large"
                    style={styles.button}
                />
            </View>
        </LinearGradient>
    );
};

export default WelcomeScreen;
