import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Overlay, Button, Divider, Avatar, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function RequestModal(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible(null, 'remove')} overlayStyle={{ padding: 0 }} height="70%" borderRadius={20}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', borderRadius: 20 }}>
                <View style={{ flexDirection: "column", alignItems: "center", marginTop: theme.size(10) }}>
                    <Icon name="close" color='white' type='material-community' containerStyle={{ alignSelf: "flex-end", marginRight: 10 }} onPress={() => props.updateVisible(null, 'remove')} />
                    <Text style={[styles.h1, { color: "white", fontWeight: "bold" }]}>{props.title}</Text>
                    <Text style={[styles.bodyText, { color: "white", fontWeight: "bold" }]}>Reason: {props.data.reason}</Text>
                    <Divider style={{ marginVertical: theme.size(20), width: '80%' }} />
                    <Avatar
                        rounded
                        size="large"
                        source={{ uri: props.data.user.photo }}
                    />
                    <Text style={[styles.h1, { color: "white", fontWeight: "bold" }]}>{props.data.user.name}</Text>
                    <Divider style={{ marginVertical: theme.size(20), width: '80%' }} />
                    <Button title="Accept" buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} onPress={() => props.accept()} containerStyle={{ width: '75%', marginVertical: theme.size(20) }} linearGradientProps={null} />
                    <Button title="Deny" buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} onPress={() => props.updateVisible(null, 'remove')} containerStyle={{ width: '75%', marginVertical: theme.size(20) }} linearGradientProps={null} />
                </View>
            </LinearGradient>
        </Overlay>
    )
}
