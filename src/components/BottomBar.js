import React from "react";
import { styles, theme } from "../styles";
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'

export default function BottomBar(props) {
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '35%', width: '100%', backgroundColor: '#000000' }}>
            <View style={{ height: '70%', width: '100%', backgroundColor: theme.colorAccent }} />
            <View style={{ flexDirection: 'row', height: '30%', width: '100%', backgroundColor: theme.colorPrimary }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                    <Icon name="home-outline" color='white' type='material-community' />
                    <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Home</Text>
                </View>
            </View>
        </View>
    )
}

