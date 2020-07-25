import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Avatar, Divider, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import { roles } from '../../util/enums/User';

import Badge from '../../components/Badge'

export default class AdminUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.getParam('userId'),
            user: null,
            loading: true,
            loggedInUser: props.navigation.getParam('user')
        };
        this.getUser(props.navigation.getParam('userId'))
    }

    getUser = (id) => {
        http.get(`/users/${id}`, { headers: { 'Authorization': `Bearer ${this.state.loggedInUser.jwt}` } })
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

    // isTherapist = () => {
    //     return this.state.loggedInUser.role === roles.therapist
    // }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userId !== this.props.navigation.getParam('userId')) {
            this.setState({ userId: this.props.navigation.getParam('userId'), loading: true })
            this.getUser(this.props.navigation.getParam('userId'));
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.goBack();
        return true
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        if (this.state.loading) {
            return null
        }
        else {
            const { user } = this.state;
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Patient Profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, justifyContent: 'space-between', width: '96%'}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: theme.size(30), }}>
                                <Avatar
                                    rounded
                                    size={100}
                                    source={{ uri: user.photo }}
                                />
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Text style={[styles.h2, { fontFamily: theme.font.regular }]}>{user.name}</Text>
                                    <Text style={[styles.bodyText, { color: theme.colorGrey, fontFamily: theme.font.medium }]}>{user.email}</Text>
                                </View>
                            </View>
                            <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary, marginTop: theme.size(30) }]}>Questions/Answers</Text>
                            <View style={{
                                borderRadius: 4,
                                borderWidth: 2,
                                borderColor: theme.inputBordercolor,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginBottom: theme.size(20),
                                paddingBottom:20
                            }}>

                                <Text style={[styles.subtitle, styles.bodyPadding, { marginTop: theme.size(20) }]}>What is your orientation?</Text>
                                <Badge value={user.orientation} />
                                <Divider style={{ alignSelf: 'center', backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(0.5), width: '80%' }} />

                                <Text style={[styles.subtitle, styles.bodyPadding, { marginTop: theme.size(20) }]}>What do you think your are suffering from?</Text>
                                <View style={{ flexDirection: 'row', flexWrap: "wrap"}}>
                                    {
                                        user.diseases.map((item) =>
                                            <Badge value={item} />
                                        )
                                    }
                                </View>

                                <Divider style={{ alignSelf: 'center', backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(0.5), width: '80%' }} />

                                <Text style={[styles.subtitle,styles.bodyPadding]}>Do you consider yourself to be religious?</Text>
                                <Badge value={user.religious ? 'Yes' : 'No'} />
                                <Divider style={{ alignSelf: 'center', backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(0.5), width: '80%' }} />

                                <Text style={[styles.subtitle, styles.bodyPadding, { marginTop: theme.size(20) }]}>What religion do you identify with?</Text>
                                <Badge value={user.religion} />
                                <Divider style={{ alignSelf: 'center', backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(0.5), width: '80%' }} />

                                <Text style={[styles.subtitle, styles.bodyPadding, { marginTop: theme.size(20) }]}>How would you rate your current sleeping habits?</Text>
                                <Badge value={user.sleepingHabits} />
                                <Divider style={{ alignSelf: 'center', backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(0.5), width: '80%' }} />

                                <Text style={[styles.subtitle, styles.bodyPadding, { marginTop: theme.size(20) }]}>Are you currently taking any medication?</Text>
                                <Badge value={user.onMedication ? 'Yes' : 'No'} />
                                </View>
                        </ScrollView>
                    </View>
                    {
                        this.state.loggedInUser.role === roles.therapist
                            ?
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '10%', width: '100%', backgroundColor: theme.colorPrimary}} >
                                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.loggedInUser.jwt, back: 'PatientProfile' })}>
                                            <Icon name="account-circle-outline" color='white' type='material-community' />
                                            <Text onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.loggedInUser.jwt, back: 'PatientProfile' })} style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                            <Icon name="home-outline" color='white' type='material-community' />
                                            <Text style={[styles.subtitle, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                            :
                            null
                    }
                    {
                        this.state.loggedInUser.role === roles.admin
                            ?
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                                <Icon name="home-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                            :
                            null
                    }

                </View>
            )
        }

    }
}