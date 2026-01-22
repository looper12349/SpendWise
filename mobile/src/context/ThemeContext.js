import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme definitions
export const themes = {
    greenLight: {
        id: 'greenLight',
        name: 'Green Light',
        isDark: false,
        colors: {
            // Primary
            primary: '#10B981',
            primaryLight: '#34D399',
            primaryDark: '#059669',

            // Secondary
            secondary: '#06B6D4',
            secondaryLight: '#22D3EE',
            secondaryDark: '#0891B2',

            // Background
            background: '#FFFFFF',
            backgroundLight: '#F9FAFB',
            backgroundCard: '#F3F4F6',

            // Surface
            surface: '#F9FAFB',
            surfaceLight: '#E5E7EB',

            // Text
            text: '#111827',
            textSecondary: '#4B5563',
            textMuted: '#9CA3AF',

            // Status
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',

            // Tab Bar
            tabBar: '#FFFFFF',
            tabBarBorder: '#E5E7EB',

            // Categories
            categories: {
                food: '#EF4444',
                transport: '#3B82F6',
                shopping: '#F59E0B',
                entertainment: '#8B5CF6',
                bills: '#EC4899',
                health: '#10B981',
                education: '#06B6D4',
                travel: '#F97316',
                groceries: '#22C55E',
                other: '#6B7280'
            },

            // Gradients
            gradients: {
                primary: ['#10B981', '#059669'],
                secondary: ['#06B6D4', '#0891B2'],
                card: ['#FFFFFF', '#F9FAFB'],
                income: ['#10B981', '#22C55E'],
                expense: ['#EF4444', '#F87171']
            }
        }
    },
    greenDark: {
        id: 'greenDark',
        name: 'Green Dark',
        isDark: true,
        colors: {
            // Primary
            primary: '#10B981',
            primaryLight: '#34D399',
            primaryDark: '#059669',

            // Secondary
            secondary: '#06B6D4',
            secondaryLight: '#22D3EE',
            secondaryDark: '#0891B2',

            // Background
            background: '#0F172A',
            backgroundLight: '#1E293B',
            backgroundCard: '#1E293B',

            // Surface
            surface: '#1E293B',
            surfaceLight: '#334155',

            // Text
            text: '#F9FAFB',
            textSecondary: '#CBD5E1',
            textMuted: '#64748B',

            // Status
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',

            // Tab Bar
            tabBar: '#1E293B',
            tabBarBorder: '#334155',

            // Categories
            categories: {
                food: '#EF4444',
                transport: '#3B82F6',
                shopping: '#F59E0B',
                entertainment: '#8B5CF6',
                bills: '#EC4899',
                health: '#10B981',
                education: '#06B6D4',
                travel: '#F97316',
                groceries: '#22C55E',
                other: '#6B7280'
            },

            // Gradients
            gradients: {
                primary: ['#10B981', '#059669'],
                secondary: ['#06B6D4', '#0891B2'],
                card: ['#1E293B', '#0F172A'],
                income: ['#10B981', '#22C55E'],
                expense: ['#EF4444', '#F87171']
            }
        }
    },
    purple: {
        id: 'purple',
        name: 'Purple Night',
        isDark: true,
        colors: {
            // Primary
            primary: '#8B5CF6',
            primaryLight: '#A78BFA',
            primaryDark: '#7C3AED',

            // Secondary
            secondary: '#06B6D4',
            secondaryLight: '#22D3EE',
            secondaryDark: '#0891B2',

            // Background
            background: '#0F0F23',
            backgroundLight: '#1A1A2E',
            backgroundCard: '#16213E',

            // Surface
            surface: '#1E1E3F',
            surfaceLight: '#252547',

            // Text
            text: '#FFFFFF',
            textSecondary: '#A0A0B8',
            textMuted: '#6B6B80',

            // Status
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',

            // Tab Bar
            tabBar: '#16213E',
            tabBarBorder: '#252547',

            // Categories
            categories: {
                food: '#EF4444',
                transport: '#3B82F6',
                shopping: '#F59E0B',
                entertainment: '#8B5CF6',
                bills: '#EC4899',
                health: '#10B981',
                education: '#06B6D4',
                travel: '#F97316',
                groceries: '#22C55E',
                other: '#6B7280'
            },

            // Gradients
            gradients: {
                primary: ['#8B5CF6', '#A78BFA'],
                secondary: ['#06B6D4', '#0891B2'],
                card: ['#1E1E3F', '#16213E'],
                income: ['#10B981', '#22C55E'],
                expense: ['#EF4444', '#F87171']
            }
        }
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Blue',
        isDark: true,
        colors: {
            // Primary
            primary: '#0EA5E9',
            primaryLight: '#38BDF8',
            primaryDark: '#0284C7',

            // Secondary
            secondary: '#10B981',
            secondaryLight: '#34D399',
            secondaryDark: '#059669',

            // Background
            background: '#0C1929',
            backgroundLight: '#132F4C',
            backgroundCard: '#173A5E',

            // Surface
            surface: '#132F4C',
            surfaceLight: '#1E4976',

            // Text
            text: '#FFFFFF',
            textSecondary: '#B2BAC2',
            textMuted: '#5C6B77',

            // Status
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#0EA5E9',

            // Tab Bar
            tabBar: '#173A5E',
            tabBarBorder: '#1E4976',

            // Categories
            categories: {
                food: '#EF4444',
                transport: '#0EA5E9',
                shopping: '#F59E0B',
                entertainment: '#8B5CF6',
                bills: '#EC4899',
                health: '#10B981',
                education: '#06B6D4',
                travel: '#F97316',
                groceries: '#22C55E',
                other: '#6B7280'
            },

            // Gradients
            gradients: {
                primary: ['#0EA5E9', '#0284C7'],
                secondary: ['#10B981', '#059669'],
                card: ['#132F4C', '#0C1929'],
                income: ['#10B981', '#22C55E'],
                expense: ['#EF4444', '#F87171']
            }
        }
    }
};

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(themes.greenLight);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedThemeId = await AsyncStorage.getItem('theme');
            if (savedThemeId && themes[savedThemeId]) {
                setCurrentTheme(themes[savedThemeId]);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const setTheme = async (themeId) => {
        if (themes[themeId]) {
            setCurrentTheme(themes[themeId]);
            await AsyncStorage.setItem('theme', themeId);
        }
    };

    return (
        <ThemeContext.Provider value={{
            theme: currentTheme,
            colors: currentTheme.colors,
            isDark: currentTheme.isDark,
            setTheme,
            availableThemes: Object.values(themes),
            loading
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
