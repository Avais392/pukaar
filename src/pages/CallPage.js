import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, Linking } from 'react-native';
import { styles, theme } from "../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { pukaarContact, pukaarEmail } from '../util/constants'
import session from '../data/session';

export default class CallPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    gogo = async (remoteMessage) => {
        const user = await session.getUser()
        this.props.navigation.navigate('RecieveCall', {
            user: user,
            notification: {
                id: remoteMessage.data.id,
                type: remoteMessage.data.type,
                senderName: remoteMessage.data.name,
                photo: remoteMessage.data.photo
            }
        })
    }

    render() {
        return null
    }
}