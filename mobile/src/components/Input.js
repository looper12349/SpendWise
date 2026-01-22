import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    icon,
    multiline = false,
    numberOfLines = 1,
    style
}) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16
        },
        label: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 8
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.surfaceLight,
            paddingHorizontal: 16
        },
        inputError: {
            borderColor: colors.error
        },
        input: {
            flex: 1,
            color: colors.text,
            fontSize: 16,
            paddingVertical: 14
        },
        multiline: {
            minHeight: 100,
            textAlignVertical: 'top'
        },
        error: {
            color: colors.error,
            fontSize: 12,
            marginTop: 6
        }
    });

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                error && styles.inputError
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={colors.textMuted}
                        style={{ marginRight: 12 }}
                    />
                )}
                <TextInput
                    style={[styles.input, multiline && styles.multiline]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

export default Input;
