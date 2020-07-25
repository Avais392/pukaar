import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles, theme } from "../styles";
import { ListItem } from 'react-native-elements'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { roles } from '../util/enums/User'
import LinearGradient from 'react-native-linear-gradient';

export default function List(props) {
    let list = []
    if (props.role === roles.admin) {
        list = [
            {
                name: 'Home',
                goto: 'Dashboard'
            },
            {
                name: 'Change Therapist/Availability',
                goto: 'Requests'
            },
            {
                name: 'Settings',
                goto: 'Settings'
            },
            {
                name: 'Log Out',
            }
        ];
    }
    else if (props.role === roles.user) {
        list = [
            {
                name: 'Home',
                goto: 'Dashboard'
            },
            {
                name: 'Change Therapist',
                goto: 'Dashboard'
            },
            {
                name: 'Payment Method',
                goto: 'Dashboard'
            },
            {
                name: 'Trial Session',
                goto: 'Dashboard'
            },
            {
                name: 'Contact Support',
                goto: 'Contact'
            },
            {
                name: 'About',
                goto: 'About'
            },
            {
                name: 'Log Out',
            }
        ];
    }
    else {
        list = [
            {
                name: 'Home',
                goto: 'Dashboard'
            },
            {
                name: 'Change Availability',
                goto: 'Dashboard'
            },
            {
                name: 'Contact Support',
                goto: 'Contact'
            },
            {
                name: 'About',
                goto: 'About'
            },
            {
                name: 'Settings',
                goto: 'Settings'
            },
            {
                name: 'Log Out',
            }
        ];
    }
    if (props.role === roles.admin) {
        return (
            <View style={{ height: "100%", backgroundColor: 'white' }}>
                <ListItem
                    leftIcon={{
                        name: "close",
                        type: "material-community"
                    }}
                    onPress={() => props.onClose()}
                    bottomDivider
                    containerStyle={{ height: theme.size(90) }}
                />
                {
                    list.map((l, i) => {
                        if (l.name === 'Log Out') {
                            return <ListItem
                                key={i}
                                title={l.name}
                                titleStyle={styles.subtitle}
                                bottomDivider
                                containerStyle={{ height: theme.size(90) }}
                                onPress={() => {
                                    props.onLogout()
                                    props.onClose()
                                }}
                            />
                        }
                        else if (l.name === 'Change Therapist/Availability') {
                            return <ListItem
                                key={i}
                                title={l.name}
                                titleStyle={styles.subtitle}
                                bottomDivider
                                containerStyle={{ height: theme.size(90) }}
                                onPress={() => {
                                    props.comingSoonModal()
                                }}
                            />
                        }
                        return <ListItem
                            key={i}
                            title={l.name}
                            titleStyle={styles.subtitle}
                            bottomDivider
                            containerStyle={{ height: theme.size(90) }}
                            onPress={() => {
                                props.navigation.navigate(l.goto)
                                props.onClose()
                            }}
                        />
                    })
                }
            </View >
        )
    }
    else {
        return (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                <ScrollView style={[styles.bodyPadding]}>
                    <View style={{ height: "100%" }}>
                        <ListItem
                            leftIcon={{
                                name: "close",
                                type: "material-community",
                                color: 'white'
                            }}
                            onPress={() => props.onClose()}
                            bottomDivider
                            containerStyle={{ height: theme.size(90) }}
                            linearGradientProps={{
                                colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                start: { x: 0, y: 0 },
                                end: { x: 1, y: 0 },
                            }}
                            ViewComponent={LinearGradient}
                        />
                        {
                            list.map((l, i) => {
                                if (l.name === 'Log Out') {
                                    return <ListItem
                                        key={i}
                                        title={l.name}
                                        titleStyle={[styles.subtitle, { color: 'white' }]}
                                        bottomDivider
                                        containerStyle={{ height: theme.size(90) }}
                                        onPress={() => {
                                            props.onLogout()
                                            props.onClose()
                                        }}
                                        linearGradientProps={{
                                            colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                            start: { x: 0, y: 0 },
                                            end: { x: 1, y: 0 },
                                        }}
                                        ViewComponent={LinearGradient}
                                    />
                                }
                                else if (l.name === 'Payment Method' || l.name === 'Trial Session') {
                                    return <ListItem
                                        key={i}
                                        title={l.name}
                                        titleStyle={[styles.subtitle, { color: 'white' }]}
                                        bottomDivider
                                        containerStyle={{ height: theme.size(90) }}
                                        onPress={() => {
                                            props.comingSoonModal()
                                        }}
                                        linearGradientProps={{
                                            colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                            start: { x: 0, y: 0 },
                                            end: { x: 1, y: 0 },
                                        }}
                                        ViewComponent={LinearGradient}
                                    />
                                }
                                else if (l.name === 'Change Availability') {
                                    return <ListItem
                                        key={i}
                                        title={l.name}
                                        titleStyle={[styles.subtitle, { color: 'white' }]}
                                        bottomDivider
                                        containerStyle={{ height: theme.size(90) }}
                                        onPress={() => {
                                            // props.modalFunction()
                                            props.comingSoonModal()
                                        }}
                                        linearGradientProps={{
                                            colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                            start: { x: 0, y: 0 },
                                            end: { x: 1, y: 0 },
                                        }}
                                        ViewComponent={LinearGradient}
                                    />
                                }
                                else if (l.name === 'Change Therapist') {
                                    return <ListItem
                                        key={i}
                                        title={l.name}
                                        titleStyle={[styles.subtitle, { color: 'white' }]}
                                        bottomDivider
                                        containerStyle={{ height: theme.size(90) }}
                                        onPress={() => {
                                            // props.modalFunction()
                                            props.comingSoonModal()
                                        }}
                                        linearGradientProps={{
                                            colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                            start: { x: 0, y: 0 },
                                            end: { x: 1, y: 0 },
                                        }}
                                        ViewComponent={LinearGradient}
                                    />
                                }
                                return <ListItem
                                    key={i}
                                    title={l.name}
                                    titleStyle={[styles.subtitle, { color: 'white' }]}
                                    bottomDivider
                                    containerStyle={{ height: theme.size(90) }}
                                    onPress={() => {
                                        props.navigation.navigate(l.goto)
                                        props.onClose()
                                    }}
                                    linearGradientProps={{
                                        colors: [theme.colorGradientStart, theme.colorGradientEnd],
                                        start: { x: 0, y: 0 },
                                        end: { x: 1, y: 0 },
                                    }}
                                    ViewComponent={LinearGradient}
                                />
                            })
                        }
                    </View >
                </ScrollView>
            </LinearGradient>
        )
    }

}