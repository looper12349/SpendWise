import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const Icon = ({
    name,
    size = 24,
    color,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <View style={style}>
            <Ionicons
                name={name}
                size={size}
                color={color || colors.text}
                {...props}
            />
        </View>
    );
};

export default Icon;
