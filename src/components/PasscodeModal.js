import React, { Component } from 'react';
import { ScrollView, View, Text, BackHandler } from 'react-native';
import { styles, theme } from '../styles/index'
import { Overlay, Button, Avatar } from 'react-native-elements';
import Snack from './Snackbar';
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
import LinearGradient from 'react-native-linear-gradient';
import session from '../data/session';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';


export default class PasscodeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            loading: false,
            code: ''
        };
        this.pinInput = React.createRef();
    }

    // goBack = () => {
    //     this.props.navigation.navigate('Dashboard')
    // }

    onSubmit = async () => {
        const passcode = await session.getPasscode()
        this.setState({ loading: true })
        if (this.state.code.length === 4) {
            if (this.state.code === passcode) {
                Snack("success", "Passcode correct")
                await session.setIsAuthenticated(true)
                this.setState({ code: '' })
                this.props.afterAuthentication();
            }
            else {
                Snack("error", "Incorrect passcode")
                this.setState({ code: '' })
            }
        }
        else {
            this.setState({ loading: false })
            Snack("error", "Must have 4 digits")
        }
    };

    onChange = (value, property) => { this.setState({ [property]: value }) }


    render() {
        return (
            <Overlay isVisible={this.props.isVisible} overlayStyle={{ padding: 0 }} fullScreen>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={[styles.bodyPadding, { alignItems: "center" }]}>
                        <Text style={[styles.h1, { marginVertical: theme.size(50), textAlign: 'center', fontWeight: 'bold', color: theme.colorPrimary }]} numberOfLines={1}>
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
                            containerStyle={{ width: '80%' }}
                            title="Unlock app"
                            onPress={() => this.onSubmit()}
                            buttonStyle={{ borderRadius: 5 }}
                            ViewComponent={LinearGradient}
                        />
                    </View>
                </View>
            </Overlay>
        )
    }
} 