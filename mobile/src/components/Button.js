import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    style
}) => {
    const { colors } = useTheme();

    const getGradient = () => {
        switch (variant) {
            case 'secondary':
                return colors.gradients.secondary;
            case 'danger':
                return colors.gradients.expense;
            case 'outline':
                return ['transparent', 'transparent'];
            default:
                return colors.gradients.primary;
        }
    };

    const getSize = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 24 };
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') return colors.primary;
        return '#FFFFFF';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[styles.container, style]}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={getGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    getSize(),
                    variant === 'outline' && { borderWidth: 2, borderColor: colors.primary },
                    disabled && styles.disabled
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                    <View style={styles.content}>
                        {icon && (
                            <Ionicons
                                name={icon}
                                size={size === 'small' ? 16 : 20}
                                color={getTextColor()}
                                style={styles.icon}
                            />
                        )}
                        <Text style={[
                            styles.text,
                            { color: getTextColor() },
                            size === 'small' && styles.textSmall,
                            size === 'large' && styles.textLarge
                        ]}>
                            {title}
                        </Text>
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabled: {
        opacity: 0.5
    },
    text: {
        fontSize: 16,
        fontWeight: '600'
    },
    textSmall: {
        fontSize: 14
    },
    textLarge: {
        fontSize: 18
    },
    icon: {
        marginRight: 8
    }
});

export default Button;
