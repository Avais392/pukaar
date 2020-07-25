import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Overlay, Button, Divider, Avatar, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Input from "./Input";

export default function ReasonModal(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible()} overlayStyle={{ padding: 0 }} height="70%" borderRadius={20}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', borderRadius: 20 }}>
                <View style={{ flexDirection: "column", alignItems: "center", marginTop: theme.size(10) }}>
                    <Icon name="close" color='white' type='material-community' containerStyle={{ alignSelf: "flex-end", marginRight: 10 }} onPress={() => props.updateVisible()} />
                    <Text style={[styles.bodyText, { color: "white", fontWeight: "bold" }]}>{props.message}</Text>
                    <Text style={[styles.h2, { color: "white", fontWeight: "bold" }]}>{props.title}</Text>
                    <View style={{ width: '90%', flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                        <Input placeholder={"Reason..."} leftIcon={{ name: 'mail-outline' }} keyboardType={'email-address'} onChange={props.onChange} propertyName={props.propertyName} value={props.value} autoCapitalize='none' />
                    </View>
                    <Divider style={{ marginVertical: theme.size(20), width: '80%' }} />
                    {/* <Button title="Submit" buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} onPress={() => props.onSubmit()} containerStyle={{ width: '75%', marginVertical: theme.size(20) }} linearGradientProps={null} loading={true} loadingProps={{color:'black'}}/> */}
                    <Button title="Submit" buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} onPress={() => props.onSubmit()} containerStyle={{ width: '75%', marginVertical: theme.size(20) }} linearGradientProps={null} loading={props.loading} loadingProps={{ color: 'black' }} />
                </View>
            </LinearGradient>
        </Overlay>
    )
}
