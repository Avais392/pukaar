import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { styles, theme } from "../styles";
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import session from '../data/session';
import messaging from '@react-native-firebase/messaging';


const localStyle = StyleSheet.create({
    image: {
        width: theme.size(135),
        height: theme.size(204),
        borderRadius: theme.radius,
        // ...theme.shadow(16)
    },
});

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        this.requestPermission()
        const firstTime = await session.getFirstTimeFlag()
        if (!firstTime) {
            this.props.navigation.navigate('Walkthrough')
        }
        const user = await session.getUser()
        if (user) {
            this.props.navigation.navigate('Dashboard')
        }
        this.setState({ loading: false })
    }

    requestPermission = async () => {
        const granted = messaging().requestPermission();
            const fcmToken = await messaging().getToken();
            await session.setDeviceToken(fcmToken)
            if (granted) {
                // console.log('User granted messaging permissions!');
            } else {
                // console.log('User declined messaging permissions :(');
            }
        // messaging().requestPermission()
        //     .then(resp => console.log(resp))
        //     .catch(err => {
        //         console.log('231')
        
        //         console.log(err)
        //     })
    }




    render() {
        if (this.state.loading) {
            return null
        }
        else {
            return (
                <View style={styles.fillSpace}>
                    <View style={{ top: theme.size(-100) }}>
                        <Image style={localStyle.image} source={require("../../assets/Logo-pukar.png")} />
                    </View>
                    <View style={{ top: theme.size(-20), width: '80%' }}>
                        <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={3}>
                            Licensed, board-acredited therapist. All PHD or Master with counselling certification and years of experience
                        </Text>
                    </View>
                    <View style={{ bottom: theme.size(-100) }}>
                        <Button buttonStyle={{ paddingHorizontal: theme.size(70), paddingVertical: theme.size(10), }} title="Getting Started" onPress={() => this.props.navigation.navigate('signupOptions')} ViewComponent={LinearGradient} />
                    </View>
                    <View style={{ bottom: theme.size(-120) }}>
                        <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={2}>
                            Already have an account?
                            <Text style={{ color: theme.colorPrimary }} onPress={() => this.props.navigation.navigate('Login')}>
                                &nbsp;Login
                            </Text>
                        </Text>
                    </View>
                </View>
            )
        }
    }
}