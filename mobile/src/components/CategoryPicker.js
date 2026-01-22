import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../utils/constants';

const CategoryPicker = ({ selected, onSelect, showAll = false }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginBottom: 20
        },
        label: {
            color: colors.text,
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 12
        },
        scrollContent: {
            paddingRight: 20
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 20,
            marginRight: 10
        },
        itemActive: {
            backgroundColor: colors.primary + '30'
        },
        categoryLabel: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '500',
            marginLeft: 8
        },
        categoryLabelActive: {
            color: colors.primary
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((category) => {
                    const categoryColor = colors.categories[category.id] || colors.textSecondary;
                    const isSelected = selected === category.id;

                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.item,
                                isSelected && styles.itemActive
                            ]}
                            onPress={() => onSelect(category.id)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={category.icon}
                                size={18}
                                color={isSelected ? colors.primary : categoryColor}
                            />
                            <Text style={[
                                styles.categoryLabel,
                                isSelected && styles.categoryLabelActive
                            ]}>
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default CategoryPicker;
