import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ChartsScreen from '../screens/ChartsScreen';
import WalletsScreen from '../screens/WalletsScreen';
import WalletDetailScreen from '../screens/WalletDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Expenses Stack
const ExpensesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ExpensesList" component={ExpensesScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
);

// Wallets Stack
const WalletsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WalletsList" component={WalletsScreen} />
        <Stack.Screen name="WalletDetail" component={WalletDetailScreen} />
    </Stack.Navigator>
);

const MainNavigator = () => {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.tabBar,
                    borderTopWidth: 1,
                    borderTopColor: colors.tabBarBorder,
                    height: 80,
                    paddingTop: 10,
                    paddingBottom: 20
                },
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500'
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Expenses':
                            iconName = focused ? 'wallet' : 'wallet-outline';
                            break;
                        case 'Charts':
                            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
                            break;
                        case 'Budget':
                            iconName = focused ? 'flag' : 'flag-outline';
                            break;
                        case 'Wallets':
                            iconName = focused ? 'people' : 'people-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    return <Ionicons name={iconName} size={24} color={color} />;
                }
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Expenses" component={ExpensesStack} />
            <Tab.Screen name="Charts" component={ChartsScreen} />
            <Tab.Screen name="Budget" component={BudgetScreen} />
            <Tab.Screen name="Wallets" component={WalletsStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainNavigator;
