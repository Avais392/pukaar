import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, Linking, Dimensions } from 'react-native';
import { styles, theme } from "../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { facebookUrl, instagramUrl, linkedInUrl, youtubeUrl } from '../util/constants'


let list = [
    {
        name: 'Facebook',
        icon: 'facebook-box',
        color: theme.colorPrimary,
        url: facebookUrl
    },
    {
        name: 'Instagram',
        icon: 'instagram',
        color: theme.colorPrimary,
        url: instagramUrl
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin-box',
        color: theme.colorPrimary,
        url: linkedInUrl
    },
    {
        name: 'Youtube',
        icon: 'youtube',
        color: 'red',
        url: youtubeUrl
    }
];

export default class Subscribe extends Component {

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
                <Header title={'Subscribe'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '5%', width: '100%', backgroundColor: '#f6f6f6' }} />
                <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                    <View style={{ height: "100%", backgroundColor: 'white' }}>
                        {
                            list.map((l, i) => {
                                return <ListItem
                                    leftIcon={{ name: l.icon, type: 'material-community', size: 36, color: l.color }}
                                    key={i}
                                    title={l.name}
                                    titleStyle={styles.subtitle}
                                    bottomDivider
                                    containerStyle={{ height: theme.size(90) }}
                                    onPress={() => {
                                        Linking.openURL(l.url)
                                    }}
                                />
                            })
                        }
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