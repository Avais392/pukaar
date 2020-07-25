import React from "react";
import { Text, View } from 'react-native';
import { styles, theme } from "../styles";
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'react-moment';
import { printNewTherapistMessage, printWelcomeMessage } from '../util/index'

export default function Message(props) {
    if (props.data.type === 'special') {
        if (props.data.message === 'newTherapist') {
            if (props.isSender) {
                return (
                    <View style={{ alignItems: "flex-end" }}>
                        <View style={{ width: '70%', flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                            <View style={{ flexDirection: 'row-reverse', alignItems: "center" }}>
                                <Avatar
                                    rounded
                                    size={20}
                                    source={{ uri: props.data.avatar ? props.data.avatar : ''}}
                                    containerStyle={{ marginRight: theme.size(10) }}
                                />
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ padding: 10, borderRadius: theme.size(5), marginRight: theme.size(10) }} >
                                    <Text style={[styles.subtitle, { color: "#fff" }]}>
                                        {printNewTherapistMessage(props.data.name, props.patientName)}
                                    </Text>
                                </LinearGradient>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: "flex-start" }}>
                                <Moment style={{ color: theme.colorGrey }} format="hh:mm A" element={Text} >
                                    {props.data.time}
                                </Moment>
                            </View>
                        </View>
                    </View>
                )
            }
            else {
                return (
                    <View style={{ width: '70%', flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <Avatar
                                rounded
                                size={20}
                                source={{ uri: props.data.avatar ? props.data.avatar : ''}}
                                containerStyle={{ marginLeft: theme.size(10) }}
                            />
                            <Text style={[styles.subtitle, { marginLeft: theme.size(10), backgroundColor: '#F7F7F8', color: "#000", padding: 10, borderRadius: theme.size(5) }]}>
                                {printNewTherapistMessage(props.data.name, props.patientName)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: "flex-end", marginBottom: theme.size(10) }}>
                            <Moment style={{ color: theme.colorGrey }} format="hh:mm A" element={Text} >
                                {props.data.time}
                            </Moment>
                        </View>
                    </View>
                )
            }

        }
        else if (props.data.message === 'welcome') {
            return (
                <View style={{ width: '70%', flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Avatar
                            rounded
                            size={20}
                            title="P"
                            containerStyle={{ marginLeft: theme.size(10) }}
                        />
                        <Text style={[styles.subtitle, { marginLeft: theme.size(10), backgroundColor: '#F7F7F8', color: "#000", padding: 10, borderRadius: theme.size(5) }]}>

                            {printWelcomeMessage(props.patientName)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: "flex-end", marginBottom: theme.size(10) }}>
                        <Moment style={{ color: theme.colorGrey }} format="hh:mm A" element={Text} >
                            {props.data.time}
                        </Moment>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ width: '100%', height: theme.size(50), flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ backgroundColor: '#F7F7F8', color: "#000", paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.size(5) }}>
                            {props.data.name} {props.data.message}
                        </Text>
                    </View>
                </View>
            )
        }
    }
    else {
        if (!props.isSender) {
            return (
                <View style={{ maxWidth: '90%', height: theme.size(50), flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Avatar
                            rounded
                            size={20}
                            source={{ uri: props.data.avatar ? props.data.avatar : ''}}
                            containerStyle={{ marginLeft: theme.size(10) }}
                        />
                        <Text style={[styles.subtitle, { marginLeft: theme.size(10), backgroundColor: '#F7F7F8', color: "#000", padding: 10, borderRadius: theme.size(5) }]}>
                            {props.data.message}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: "flex-end", marginBottom: theme.size(10) }}>
                        <Moment style={{ color: theme.colorGrey }} format="hh:mm A" element={Text} >
                            {props.data.time}
                        </Moment>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ alignItems: "flex-end" }}>
                    <View style={{ maxWidth: '90%', height: theme.size(50), flexDirection: "column", justifyContent: "center", marginTop: theme.size(40) }}>
                        <View style={{ flexDirection: 'row-reverse', alignItems: "center" }}>
                            <Avatar
                                rounded
                                size={20}
                                source={{ uri: props.data.avatar ? props.data.avatar  : '' }}
                                containerStyle={{ marginRight: theme.size(10) }}
                            />
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ padding: 10, borderRadius: theme.size(5), marginRight: theme.size(10) }} >
                                {/* <Text style={{ color: "#fff" }}> */}
                                <Text style={[styles.subtitle, { color: "#fff" }]}>
                                    {props.data.message}
                                </Text>
                            </LinearGradient>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: "flex-start", marginBottom: theme.size(10) }}>
                            <Moment style={{ color: theme.colorGrey }} format="hh:mm A" element={Text} >
                                {props.data.time}
                            </Moment>
                            {/* <Text style={{ color: "#b0b0b0" }}>
                                {props.data.time}
                            </Text> */}
                        </View>
                    </View>
                </View>
            )
        }
    }
}