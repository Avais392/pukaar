import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles, theme } from '../styles/index'
import Loader from '../components/Loader';

export default class EmailVerification extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate('Login')
        }, 3000)
    }

    render() {
        return (
            <View style={[styles.fillSpace]}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ width: '100%', marginBottom: theme.size(10), marginTop: theme.size(100) }}>
                        <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={2}>
                            Email successfully verified. Redirecting you to login...
                        </Text>
                        <Loader size={'large'} color={theme.colorPrimary} />
                    </View>
                </View >
            </View>
        )
    }
} 