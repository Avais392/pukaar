import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, Linking, Platform, Dimensions } from 'react-native';
import { styles, theme } from "../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { pukaarContact, pukaarEmail } from '../util/constants'

export default class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    render() {
        return (
            <View style={styles.fillSpace}>
                <Header title={'Contact'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} logout={this.logout} />
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '5%', width: '100%', backgroundColor: '#f6f6f6' }} />
                <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                    <View style={{ height: "100%", backgroundColor: 'white' }}>
                        <ListItem
                            leftIcon={{ name: 'phone-outline', type: 'material-community', size: 36 }}
                            title={'Pukaar Support'}
                            titleStyle={styles.subtitle}
                            bottomDivider
                            containerStyle={{ height: theme.size(90) }}
                            onPress={() => {
                                if(Platform.OS === 'ios'){
                                    Linking.openURL(`telprompt:${pukaarContact}`)
                                }
                                else{
                                    Linking.openURL(`tel:${pukaarContact}`)
                                }
                            }}
                        />
                        <ListItem
                            leftIcon={{ name: 'email-open-outline', type: 'material-community', size: 36 }}
                            title={'Pukaar Email'}
                            titleStyle={styles.subtitle}
                            bottomDivider
                            containerStyle={{ height: theme.size(90) }}
                            onPress={() => {
                                Linking.openURL(`mailto:${pukaarEmail}`)
                            }}
                        />
                    </View >
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                    <Icon name="home-outline" color='white' type='material-community' />
                                    <Text style={[styles.bodyText, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        )
    }
}