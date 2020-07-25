import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Overlay, Button, Divider, Avatar, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function Session(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible()} overlayStyle={{ padding: 0}} height="15%" borderRadius={20}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', borderRadius: 20 }}>
                <View style={{ flexDirection: "column", justifyContent: "center", height:"100%", position:"relative"}}>
                    <Icon name="close" color='white' type='material-community' containerStyle={{ position:"absolute", top:10, right: 10 }} onPress={() => props.updateVisible()} />
                    <Text style={[styles.h2, { color: "white", textAlign: 'center'}]}>{props.message}</Text>
                </View>
            </LinearGradient>
        </Overlay>
    )
}
