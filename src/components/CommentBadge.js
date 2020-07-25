import React from "react";
import { View, Text } from 'react-native'
import { theme, styles } from '../styles/index'
import LinearGradient from 'react-native-linear-gradient';

export default function (commentsLength) {
    return <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ padding: 10 }}>
        <Text style={{ color: 'white' }}>{commentsLength} comments</Text>
    </LinearGradient>
}
