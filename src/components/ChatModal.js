import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Overlay, Button, Divider, Avatar, Icon, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function ChatModal(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible()} overlayStyle={{ padding: 0, maxHeight: '40%', height: 'auto' }} borderRadius={20}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ borderRadius: 20, flexDirection: 'column', justifyContent: 'center', height: 'auto', position: 'relative' }}>
                <Icon name="close" color='white' type='material-community' containerStyle={{ alignSelf: "flex-end", position: 'absolute', top: 10, right: 10, zIndex: 1 }} iconStyle={{ padding: 10 }} onPress={() => props.updateVisible()} />
                <ListItem
                    title={"Call"}
                    titleStyle={[styles.subtitle, { color: 'white', textAlign: 'center', marginBottom: 10 }]}
                    bottomDivider
                    linearGradientProps={{
                        colors: [theme.colorGradientStart, theme.colorGradientEnd],
                        start: { x: 0, y: 0 },
                        end: { x: 1, y: 0 },
                    }}
                    containerStyle={{
                        marginTop: 20,
                        marginBottom: 10
                    }}
                    onPress={() => props.action('call')}
                    ViewComponent={LinearGradient}
                />
                <ListItem
                    title={"Image"}
                    titleStyle={[styles.subtitle, { color: 'white', textAlign: 'center', marginBottom: 10 }]}
                    bottomDivider
                    linearGradientProps={{
                        colors: [theme.colorGradientStart, theme.colorGradientEnd],
                        start: { x: 0, y: 0 },
                        end: { x: 1, y: 0 },
                    }}
                    containerStyle={{
                        marginTop: 10,
                    }}

                    ViewComponent={LinearGradient}
                />
                <ListItem
                    title={"Voice Notes"}
                    titleStyle={[styles.subtitle, { color: 'white', textAlign: 'center', marginTop: 10 }]}
                    linearGradientProps={{
                        colors: [theme.colorGradientStart, theme.colorGradientEnd],
                        start: { x: 0, y: 0 },
                        end: { x: 1, y: 0 },
                    }}
                    containerStyle={{
                        marginBottom: 20
                    }}
                    ViewComponent={LinearGradient}
                />
            </LinearGradient>
        </Overlay>
    )
}
