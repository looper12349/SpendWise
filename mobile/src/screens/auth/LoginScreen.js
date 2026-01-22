import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/helpers';
import Button from '../../components/Button';
import Input from '../../components/Input';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { login, loading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        clearError();
        if (!validate()) return;

        const result = await login(email, password);
        if (!result.success) {
            setErrors({ general: result.error });
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        keyboardView: {
            flex: 1
        },
        scrollContent: {
            flexGrow: 1,
            padding: 24
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            marginTop: 40,
            marginBottom: 20
        },
        backText: {
            color: colors.primary,
            fontSize: 16,
            marginLeft: 4
        },
        header: {
            alignItems: 'center',
            marginBottom: 40
        },
        logo: {
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8
        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary
        },
        errorContainer: {
            backgroundColor: colors.error + '20',
            padding: 12,
            borderRadius: 8,
            marginBottom: 20
        },
        errorText: {
            color: colors.error,
            textAlign: 'center'
        },
        form: {
            flex: 1
        },
        loginButton: {
            marginTop: 10
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30
        },
        footerText: {
            color: colors.textSecondary
        },
        footerLink: {
            color: colors.primary,
            fontWeight: '600'
        }
    });

    return (
        <LinearGradient
            colors={[colors.background, colors.backgroundLight]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} color={colors.primary} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Ionicons name="wallet" size={40} color="#FFFFFF" />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    {(errors.general || error) && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errors.general || error}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            error={errors.email}
                            icon="mail"
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            error={errors.password}
                            icon="lock-closed"
                        />

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={loading}
                            size="large"
                            icon="log-in"
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default LoginScreen;
