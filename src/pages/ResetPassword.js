import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { styles, theme } from '../styles/index'
import Input from "../components/Input";
import { Button, Avatar, CheckBox } from 'react-native-elements';
import { Divider, Badge } from 'react-native-elements';
import { http } from "../util/http";
import Snack from '../components/Snackbar';
import LinearGradient from 'react-native-linear-gradient';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password2: '',
            loading: false
        };
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // console.log(this.props)
        this.props.navigation.goBack()
        return true;
    }

    onSubmit = () => {
        this.setState({ loading: true })
        if (this.valid()) {
            const { password } = this.state;
            let { token } = this.props.navigation.state.params;
            http.post('/users/update-password', { token, password })
                .then(resp => {
                    this.setState({ loading: false })
                    Snack("success", "Password Successfully changed.")
                    this.props.navigation.navigate('Login')
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
        const { password, password2 } = this.state;
        if (password !== password2) {
            Snack("error", "Passwords do not match")
            return false;
        }
        if (password.length > 0 && password2.length > 0) {
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
                        <Text style={[styles.h1, { textAlign: 'center', fontWeight: 'bold', color: theme.colorPrimary }]} numberOfLines={1}>
                            Reset Password
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.size(-100) }}>
                        <Input placeholder={"Password"} leftIcon={{ name: 'lock-outline' }} secureTextEntry={true} onChange={this.onChange} propertyName={'password'} />
                        <Input placeholder={"Confirm Password"} leftIcon={{ name: 'lock-outline' }} secureTextEntry={true} onChange={this.onChange} propertyName={'password2'} />
                    </View>
                    <View style={{ bottom: theme.size(30) }}>
                        {
                            this.state.loading
                                ?
                                <Button loading ViewComponent={LinearGradient} />
                                :
                                <Button title="Reset" onPress={() => this.onSubmit()} ViewComponent={LinearGradient} />
                        }
                    </View>
                </View >
            </View>
        )
    }
} 