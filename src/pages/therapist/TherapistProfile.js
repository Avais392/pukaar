import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import { styles, theme } from "../../styles";
import { Avatar, Divider, Icon, Button } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';

import Badge from '../../components/Badge';

export default class AdminUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jwt: props.navigation.getParam('jwt'),
            user: null,
            loading: true
        };
        this.getUser(props.navigation.getParam('jwt'))
    }

    getUser = (jwt) => {
        const config = { headers: { 'Authorization': `Bearer ${jwt}` } }
        http.get(`/therapists`, config)
            .then(resp => {
                this.setState({ user: resp.data.data, loading: false })
            })
            .catch(err => {
                if (err.response) {
                    Snack("error", err.response.data.error)
                }
                else {
                    Snack("error", "Unknown error occured, please contact an Admin");
                }

            })
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.jwt !== this.props.navigation.getParam('jwt')) {
            this.setState({ jwt: this.props.navigation.getParam('jwt'), loading: true })
            this.getUser(this.props.navigation.getParam('jwt'));
        }
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

    updateProfile = (services, focus, name, about, address, phone, available, doctorType, photo) => {
        let user = { services, focus, name, about, address, phone, available, doctorType, photo };
        this.setState({
            user: user
        })
    }

    render() {
        if (this.state.loading) {
            return null
        }
        else {
            const { user } = this.state;
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: theme.size(30) }}>
                                <Avatar
                                    rounded
                                    size={100}
                                    source={{ uri: this.state.user.photo }}
                                />
                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                    <Text style={[styles.bodyText, { textAlign: "right", color: theme.colorStatus }]} >{this.state.user.available ? 'Available' : 'Away'}</Text>
                                    <Text style={styles.h1}>{this.state.user.name}</Text>
                                    <Text style={[styles.bodyText, { fontWeight: 'bold', color: theme.colorGrey }]}>{this.state.user.address}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: theme.size(-5) }}>
                                        <Icon
                                            name='star'
                                            color='#F2BC3B'
                                        />
                                        <Text style={[styles.bodyText, { color: theme.colorGrey }]}>{this.state.user.averageRating.toFixed(1)} | {this.state.user.totalRatings} reviews</Text>
                                    </View>
                                    {/* <View style={{ flexDirection: 'row' }}>
                                        <Button icon={{ name: "pencil-outline", type: 'material-community', size: 15, color: "white" }}
                                            title="Edit profile" iconRight={true}
                                            onPress={() => this.props.navigation.navigate('EditTherapistProfile', { user: this.state.user, back: 'TherapistProfile', updateProfile: this.updateProfile })}
                                            buttonStyle={{ borderRadius: 5 }}
                                            containerStyle={{ marginVertical: theme.size(10) }}
                                            ViewComponent={LinearGradient}
                                        />
                                    </View> */}
                                </View>
                            </View>
                            <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} />
                            <View style={{ marginTop: theme.size(20), marginLeft: '10%', width: '80%', flexDirection: 'column' }}>
                                <Text style={[styles.h1, { color: theme.colorPrimary }]}>
                                    About
                                </Text>
                                <Text style={[styles.bodyText, { color: theme.colorGrey, marginLeft: theme.size(10) }]}>
                                    {this.state.user.about}
                                </Text>
                            </View>
                            <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} />
                            <View style={{ marginTop: theme.size(20), marginLeft: '10%', width: '80%', flexDirection: 'column' }}>
                                <Text style={[styles.h1, { color: theme.colorPrimary }]}>
                                    Information
                                </Text>
                                <Text style={[styles.subtitle, { marginLeft: theme.size(20), marginTop: theme.size(20), color: theme.colorMenuHeading }]}>
                                    Services:
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: 'wrap', marginLeft:'10%'}}>
                                        {
                                            this.state.user.services.map((item) =>
                                            <Badge value={item}/>
                                            )
                                        }
                                </View>
                                <Text style={[styles.bodyText, { marginLeft: theme.size(20) }]}>
                                    Focus:
                                </Text>
                                <View style={{ flexDirection: "row", flexWrap: 'wrap', marginLeft:'10%' }}>
                                        {
                                            this.state.user.focus.map((item) =>
                                            <Badge value={item} />
                                            )
                                        }
                                </View>
                            </View>
                            {/* <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} /> */}
                            {/* <View style={{ height: '15%', marginTop: theme.size(20), width: '100%', flexDirection: 'column' }}>
                                <Text style={[styles.h1, { color: theme.colorPrimary, marginLeft: "10%" }]}>
                                    Availability
                                </Text>
                                <View style={{ height: '100%', marginTop: theme.size(20), width: '100%', flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: "white", width: '34%', borderRightColor: theme.colorGrey, borderRightWidth: theme.size(0.5), justifyContent: "center", alignItems: "center" }}>
                                        <Text style={[styles.h2, { color: theme.colorTextDark, fontWeight: "bold" }]}>Friday</Text>
                                        <Text style={[styles.h2, { color: theme.colorTextDark, fontWeight: "bold" }]}>7PM - 8PM</Text>
                                    </View>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '33%', backgroundColor: theme.colorPrimary }} >
                                        <View style={{ width: '100%', height: '100%', justifyContent: "center", alignItems: "center" }}>
                                            <Text style={[styles.h2, { color: theme.colorAccent, fontWeight: "bold" }]}>Saturday</Text>
                                            <Text style={[styles.h2, { color: theme.colorAccent, fontWeight: "bold" }]}>8PM - 9PM</Text>
                                        </View>
                                    </LinearGradient>
                                    <View style={{ backgroundColor: "white", width: '33%', borderRightColor: theme.colorGrey, borderRightWidth: theme.size(0.5), justifyContent: "center", alignItems: "center" }}>
                                        <Text style={[styles.h2, { color: theme.colorTextDark, fontWeight: "bold" }]}>Sunday</Text>
                                        <Text style={[styles.h2, { color: theme.colorTextDark, fontWeight: "bold" }]}>8PM - 9PM</Text>
                                    </View>
                                </View>
                            </View> */}
                            <Divider style={{ marginTop: theme.size(100), height: theme.size(1), width: '100%' }} />
                        </ScrollView>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }}>
                                    <Icon name="account-circle-outline" color='white' type='material-community' />
                                    <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Profile</Text>
                                </View>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                    <Icon name="home-outline" color='white' type='material-community' />
                                    <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Home</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            )
        }

    }
}