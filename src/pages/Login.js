import React, { Component } from 'react';
import { View, Text, BackHandler, Platform } from 'react-native';
import { styles, theme } from '../styles/index'
import Input from "../components/Input";
import { Button, Avatar, CheckBox } from 'react-native-elements';
import { Divider, Badge } from 'react-native-elements';
import { http } from "../util/http";
import Snack from '../components/Snackbar';
import session from "../data/session";
import LinearGradient from 'react-native-linear-gradient';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            checked: false,
            loading: false,
            viewPass: false
        };
    }

    componentDidMount() {
        session.getRememberMe()
            .then(resp => {
                this.setState({
                    email: resp.email,
                    password: resp.password,
                    checked: resp.email && resp.email.length > 0 ? true : false
                })
            })
    }


    onSubmit = async () => {
        this.setState({ loading: true })
        if (this.valid()) {
            const { email, password } = this.state;
            let deviceToken = await session.getDeviceToken();
            http.post('/users/login', { email, password, deviceToken:deviceToken, platform: Platform.OS })
                .then(resp => {
                    Snack("success", "Login successful")
                    session.loggingIn(resp.data.data);
                    setTimeout(() => {
                        this.props.navigation.navigate('Dashboard', { update: true })
                    }, 200)
                    this.state.checked ? session.setRememberMe(email, password) : session.setRememberMe('', '')
                    this.setState({ loading: false, email: '', password: '' })
                })
                .catch(err => {
                    this.setState({ loading: false })
                    if (err.response) {
                        Snack("error", err.response.data.error)
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                    }

                })
        }
        else {
            this.setState({ loading: false })
        }
    };

    valid() {
        const { email, password } = this.state;
        if (email && email.length === 0 || !emailRegex.test(email)) {
            Snack("error", "Please enter valid email")
            return false;
        }
        if (password && password.length > 0) {
            return true
        }
        else {
            Snack("error", "All fields must be filled")
            return false;
        }
    }

    rememberMe = () => {
        this.setState({ checked: !this.state.checked })
    }

    onChange = (value, property) => { this.setState({ [property]: value }) }

    render() {
        return (
            <View style={[styles.fillSpace, styles.bodyPadding]}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <View style={{ marginBottom: theme.size(10), marginTop: theme.size(100) }}>
                        <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={1}>
                            Sign In
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                        <Input placeholder={"E-mail"} leftIcon={{ name: 'mail-outline' }} keyboardType={'email-address'} onChange={this.onChange} propertyName={'email'} value={this.state.email} autoCapitalize='none' value={this.state.email} />
                        <Input placeholder={"Password"} leftIcon={{ name: 'lock-outline' }} secureTextEntry={!this.state.viewPass} onChange={this.onChange} propertyName={'password'} value={this.state.password} autoCapitalize='none' rightIcon={{ name: this.state.viewPass ? 'eye-off-outline' : 'eye-outline', type: 'material-community', onPress: () => this.setState({ viewPass: !this.state.viewPass }), containerStyle: { padding: 10 } }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                containerStyle={{ marginLeft: 0, paddingLeft: 0 }}
                                checked={this.state.checked}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                onPress={() => this.rememberMe()}
                            />
                            <Text style={[styles.subtitle, { marginLeft: -10 }]}>Remember</Text>
                        </View>
                        <Text style={[styles.subtitle]} onPress={() => this.props.navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
                    </View>
                    <View style={{ bottom: theme.size(-30) }}>
                        {
                            this.state.loading
                                ?
                                <Button loading ViewComponent={LinearGradient} buttonStyle={{ paddingVertical: theme.size(10), borderRadius: 5 }} />
                                :
                                <Button buttonStyle={{ paddingVertical: theme.size(10), borderRadius: 5 }} title="Sign In" onPress={() => this.onSubmit()} containerStyle={{ marginVertical: theme.size(20) }} loading={this.state.loading} ViewComponent={LinearGradient} />
                        }
                    </View>
                    <View>
                        <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={2}>
                            Dont have account?
                                <Text style={{ color: theme.colorPrimary }} onPress={() => this.props.navigation.navigate('signupOptions')}>
                                &nbsp;Create account
                                </Text>
                        </Text>
                    </View>
                    <View style={{ marginBottom: theme.size(20) }}>
                        <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={2}>
                            Pukaar is free for a limited time only.
                        </Text>
                    </View>
                </View >
            </View >
        )
    }
} 