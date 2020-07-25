import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Overlay, Button, Divider, Avatar, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function ConfirmationModal(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible(null, 'remove')} overlayStyle={{ padding: 0 }} borderRadius={20} height="auto">
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ borderRadius: 20 }}>
                <View style={{ flexDirection: "column", alignItems: "center", marginTop: theme.size(10), marginBottom: 30 }}>
                    <Icon name="close" color='white' type='material-community' size={30} containerStyle={{ alignSelf: "flex-end", marginRight: 10 }} onPress={() => props.updateVisible(null, 'remove')} />
                    <Text style={[styles.bodyText, { color: "white" }]}>{props.message}</Text>
                    <Text style={[styles.h1, { color: "white" }]}>{props.title}</Text>
                    <Divider style={{ marginVertical: theme.size(20), width: '80%' }} />
                    <Avatar
                        rounded
                        size="large"
                        source={{ uri: props.data.photo ? props.data.photo : ''}}
                    />
                    <Text style={[styles.h2, { color: "white", marginVertical: theme.size(20), textAlign: 'center' }]} numberOfLines={2}>{props.data.name}</Text>
                    <Divider style={{ marginVertical: theme.size(20), width: '80%' }} />
                    <Button title="Yes" buttonStyle={{ backgroundColor: 'white', borderRadius: theme.size(6) }} titleStyle={{ color: theme.colorPrimary }} onPress={() => props.removeTherapist()} containerStyle={{ width: '75%', marginVertical: theme.size(10) }} linearGradientProps={null} />
                    <Button title="No" buttonStyle={{ backgroundColor: 'white', borderRadius: theme.size(6) }} titleStyle={{ color: theme.colorPrimary }} onPress={() => props.updateVisible(null, 'remove')} containerStyle={{ width: '75%', marginVertical: theme.size(10) }} linearGradientProps={null} />
                </View>
            </LinearGradient>
        </Overlay>
    )
}
