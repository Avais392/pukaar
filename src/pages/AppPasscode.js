import React, { Component } from 'react';
import { ScrollView, View, Text, BackHandler, Dimensions } from 'react-native';
import { styles, theme } from '../styles/index'
import { Button, Avatar } from 'react-native-elements';
import { http } from "../util/http";
import Snack from '../components/Snackbar';
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import session from '../data/session';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';


export default class AppPasscode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false,
            code: ''
        };
        this.pinInput = React.createRef();
    }



    onSubmit = () => {
        this.setState({ loading: true })
        if (this.state.code.length === 4) {
            session.setPasscode(this.state.code)
            Snack("success", "Passcode set successfully")
            this.setState({ code: '' })
            this.goBack();
        }
        else {
            this.setState({ loading: false })
            Snack("error", "Must have 4 digits")
        }
    };

    valid() {
        const { email } = this.state;
        if (email.length === 0 || !emailRegex.test(email)) {
            Snack("error", "Please enter valid email")
            return false;
        }
        return true
    }

    onChange = (value, property) => { this.setState({ [property]: value }) }

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
        this.props.navigation.navigate('Settings')
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    removePasscode = async () => {
        await session.removePasscode()
        Snack("Success", "Passcode removed!")
    }

    render() {
        return (
            <View style={styles.fillSpace}>
                <Header title={'App passcode'} changeDrawer={this.goBack} icon={'arrow-back'} logout={this.logout} customStyles={{height: (76 * Dimensions.get('window').height)/896}} />
                <View style={{ width: '100%', height: '92%' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '5%', width: '100%', backgroundColor: theme.colorGrey }} />
                    <View style={[styles.bodyPadding, { alignItems: "center" }]}>
                        <Text style={[styles.h1, { marginVertical: theme.size(50), textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={1}>
                            App passcode
                        </Text>
                        <Avatar
                            rounded
                            size="large"
                            icon={{ name: 'lock' }}
                            containerStyle={{ marginTop: theme.size(20), marginBottom: theme.size(50) }}
                        />
                        <SmoothPinCodeInput
                            ref={this.pinInput}
                            value={this.state.code}
                            onTextChange={code => this.setState({ code })}
                            onBackspace={() => console.log('No more back.')}
                            containerStyle={{ marginVertical: theme.size(50) }}
                            mask="*"
                            password

                        />
                        <Button
                            containerStyle={{ width: '100%' }}
                            title="Save passcode"
                            onPress={() => this.onSubmit()}
                            buttonStyle={{ borderRadius: 5 }}
                            ViewComponent={LinearGradient}
                        />
                        <Button
                            containerStyle={{ width: '100%', marginVertical: 20 }}
                            title="Remove passcode"
                            onPress={() => this.removePasscode()}
                            buttonStyle={{ borderRadius: 5 }}
                            ViewComponent={LinearGradient}
                        />
                    </View>
                </View>
            </View>
        )
    }
} 