import React, { Component } from 'react';
import { View, Text, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import { styles, theme } from "../styles";
import { Avatar, Icon, Divider } from 'react-native-elements';
import Drawer from 'react-native-drawer';
import List from '../components/List';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import session from '../data/session';
import PasscodeModal from '../components/PasscodeModal';
import { roles } from '../util/enums/User'
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { pushTypes } from '../util/pushTypes';
import notificationConfigure from '../services/NotificationService'
import ReasonModal from '../components/ReasonModal';
import { http } from '../util/http';
import Snack from '../components/Snackbar';
import SessionModal from '../pages/Session';

const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
    main: { paddingLeft: 3 },
}

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drawer: false,
            loading: true,
            user: null,
            passcodeModalVisible: false,
            changeTherapistModal: false,
            changeTherapistReason: '',
            changeTherapistLoader: false,
            comingSoonModalVisible: false,
            comingSoonModalVisible2: false
        };
        notificationConfigure(this.onNotification);
    }

    onNotification = async (notification) => {
        const user = await session.getUser()
        if (notification && notification.data.type === pushTypes.newMessage) {
            if (user.role === roles.therapist) {
                this.props.navigation.navigate('TherapistChat', { patientId: notification.data.id, user: user, patientName: notification.data.senderName, rightIcon: notification.data.photo })
            }
            else if (user.role === roles.user) {
                this.props.navigation.navigate('UserChat', { user: user })
            }
        }
        if (notification && notification.data.type === pushTypes.therapistAssigned) {
            if (user.role === roles.user) {
                this.props.navigation.navigate('UserChat', { user: user })
            }
        }
        if (notification && notification.data.type === pushTypes.newPatient) {
            this.props.navigation.navigate('UnassignedUsers', { user: user })
        }
        if (notification && notification.data.type === pushTypes.call) {
            this.props.navigation.navigate('RecieveCall', {
                user: user,
                notification: {
                    id: notification.data.id,
                    type: notification.data.type,
                    senderName: notification.data.senderName,
                    photo: notification.data.photo,
                    callId: notification.data.callId,
                }
            })
        }
        if (notification && (notification.data.type === pushTypes.cancelCall || notification.data.type === pushTypes.declineCall || notification.data.type === pushTypes.missedCall)) {
            if (user.role === roles.therapist) {
                this.props.navigation.navigate('TherapistChat', { patientId: notification.data.id, user: user, patientName: notification.data.senderName, rightIcon: notification.data.photo })
            }
            else if (user.role === roles.user) {
                this.props.navigation.navigate('UserChat', { user: user })
            }
        }
        if (notification && notification.data.type === pushTypes.welcomeUser) {
            this.props.navigation.navigate('UserChat', { user: user })
        }
    }

    async componentDidMount() {
        messaging().onMessage(async remoteMessage => {
            if (remoteMessage.data.type === pushTypes.call) {
                let user = await session.getUser();
                this.props.navigation.navigate('Dashboard')
                this.props.navigation.navigate('RecieveCall', {
                    user: user,
                    notification: {
                        id: remoteMessage.data.id,
                        type: remoteMessage.data.type,
                        senderName: remoteMessage.data.name,
                        photo: remoteMessage.data.photo,
                        callId: remoteMessage.data.callId
                    }
                })
            }
            else if (remoteMessage.data.type === pushTypes.declineCall || remoteMessage.data.type === pushTypes.cancelCall) {
                if (remoteMessage.data.type === pushTypes.cancelCall) {
                    this.props.navigation.navigate('RecieveCall', {
                        ringing: false
                    })
                    this.props.navigation.navigate('Dashboard');
                    PushNotification.localNotification({
                        message: remoteMessage.data.message, // (required)
                        playSound: false, // (optional) default: true
                        soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                        importance: "high",
                        data: {
                            id: remoteMessage.data.id,
                            type: remoteMessage.data.type,
                            senderName: remoteMessage.data.name,
                            photo: remoteMessage.data.photo
                        }
                    });
                }
                else {
                    if (this.state.user.role === roles.therapist) {
                        // this.props.navigation.navigate('AssignedUsersChats', { user: this.state.user })
                        // this.props.navigation.navigate('TherapistChat', { patientId: remoteMessage.data.id, user: this.state.user, patientName: remoteMessage.data.senderName, rightIcon: remoteMessage.data.photo, call: false, notify: true })
                    }
                    else if (this.state.user.role === roles.user) {
                        this.props.navigation.navigate('Dashboard');
                        this.props.navigation.navigate('UserChat', { user: this.state.user, call: false, notify: true })
                    }
                }
            }
            else if (remoteMessage.data.type === pushTypes.welcomeUser) {
                PushNotification.localNotification({
                    message: remoteMessage.data.message, // (required)
                    playSound: false, // (optional) default: true
                    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                    importance: "high",
                    data: {
                        type: remoteMessage.data.type,
                    }
                });
            }
            else {
                PushNotification.localNotification({
                    message: remoteMessage.data.message, // (required)
                    playSound: false, // (optional) default: true
                    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
                    importance: "high",
                    data: {
                        id: remoteMessage.data.id,
                        type: remoteMessage.data.type,
                        senderName: remoteMessage.data.name,
                        photo: remoteMessage.data.photo
                    }
                });
            }

        });
        session.getUser()
            .then(async (resp) => {
                if (resp) {
                    let passcode = await session.getPasscode()
                    if (passcode) {
                        let isAuthenticated = await session.isAuthenticated()
                        if (!isAuthenticated) {
                            this.setState({ passcodeModalVisible: true, loading: false })
                            return;
                        }
                    }
                    this.setState({
                        loading: false,
                        user: resp
                    })
                }
                else {
                    this.setState({
                        loading: true
                    })
                    this.props.navigation.navigate('Login', { update: true })
                }
            })
        PushNotification.popInitialNotification(async (notification) => {
            const user = await session.getUser()
            if (notification && notification.data.type === pushTypes.newMessage) {
                if (user.role === roles.therapist) {
                    this.props.navigation.navigate('TherapistChat', { patientId: notification.data.id, user: user, patientName: notification.data.senderName, rightIcon: notification.data.photo })
                }
                else if (user.role === roles.user) {
                    this.props.navigation.navigate('UserChat', { user: user })
                }
            }
            if (notification && notification.data.type === pushTypes.newPatient) {
                this.props.navigation.navigate('UnassignedUsers', { user: user })
            }
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }


    changeDrawer = () => {
        this.setState({ drawer: !this.state.drawer })
    };

    afterAuthentication = () => {
        session.getUser()
            .then(resp => {
                if (resp) {
                    this.setState({
                        loading: false,
                        user: resp,
                        passcodeModalVisible: false
                    })
                }
            })
    }

    componentWillReceiveProps(prevProps, prevState) {
        if (prevState.user) {
            if (this.props.navigation.getParam('update')) {
                session.getUser()
                    .then(resp => {
                        if (resp) {
                            if (resp.jwt !== prevState.user.jwt) {
                                this.setState({
                                    loading: false,
                                    user: resp
                                })
                            }
                        }
                    })
            }
        }
        else {
            session.getUser()
                .then(async (resp) => {
                    if (resp) {
                        let passcode = await session.getPasscode()
                        if (passcode) {
                            let isAuthenticated = await session.isAuthenticated()
                            if (!isAuthenticated) {
                                this.setState({ passcodeModalVisible: true, loading: false })
                                return;
                            }
                        }
                        this.setState({
                            loading: false,
                            user: resp
                        })
                    }
                    else {
                        this.setState({
                            loading: true
                        })
                        this.props.navigation.navigate('Login', { update: true })
                    }
                })
        }
    }

    logout = () => {
        session.loggingOut();
        session.isAuthenticated(false);
        this.props.navigation.navigate('Login', { update: true })
    }


    changeTherapistUserModal = () => {
        if (!this.state.changeTherapistModal) {
            this.changeDrawer()
            setTimeout(() => {
                this.setState({
                    changeTherapistModal: !this.state.changeTherapistModal
                })
            }, 400);
        }
        else {
            this.setState({
                changeTherapistModal: !this.state.changeTherapistModal
            })
        }
    }

    changeComingSoonModal = async () => {
        if (!this.state.comingSoonModalVisible) {
            await this.changeDrawer()
            setTimeout(() => {
                this.setState({
                    comingSoonModalVisible: !this.state.comingSoonModalVisible
                })
            }, 400);
        }
        else {
            this.setState({
                comingSoonModalVisible: !this.state.comingSoonModalVisible
            })
        }
    }

    changeComingSoonModal2 = () => {
        this.setState({
            comingSoonModalVisible2: !this.state.comingSoonModalVisible2,
        })
    }

    onChange = (value, property) => { this.setState({ [property]: value }) }

    onChangeTherapistSubmit = () => {
        const { changeTherapistReason, user } = this.state
        if (changeTherapistReason.length === 0) {
            Snack("error", "Reason cant be empty");
            return;
        }
        if (!this.state.changeTherapistLoader) {
            this.setState({ changeTherapistLoader: true })
            http.post('/users/change-therapist', { reason: changeTherapistReason }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    Snack("success", "Request submitted successfully")
                    this.setState({
                        changeTherapistModal: false,
                        changeTherapistReason: '',
                        changeTherapistLoader: false
                    })
                })
                .catch(err => {
                    this.setState({
                        changeTherapistLoader: false
                    })
                    if (err.response) {
                        Snack("error", err.response.data.error)
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                    }

                })
        }
    }

    render() {
        if (this.state.loading) {
            return null
        }
        else if (this.state.passcodeModalVisible) {
            return <PasscodeModal isVisible={this.state.passcodeModalVisible} navigation={this.props.navigation} afterAuthentication={this.afterAuthentication} />
        }
        else {
            if (this.state.user.role === roles.therapist) {
                return (
                    <Drawer
                        open={this.state.drawer}
                        type="overlay"
                        content={<List navigation={this.props.navigation} onClose={this.changeDrawer} onLogout={this.logout} role={this.state.user.role} comingSoonModal={this.changeComingSoonModal} />}
                        tapToClose={true}
                        openDrawerOffset={0.2} // 20% gap on the right side of drawer
                        panCloseMask={0.2}
                        closedDrawerOffset={-3}
                        styles={drawerStyles}
                        tweenHandler={(ratio) => ({
                            main: { opacity: (2 - ratio) / 2 }
                        })}
                        captureGestures={true}
                    >
                        <View style={styles.fillSpace}>
                            <SessionModal visible={this.state.comingSoonModalVisible} updateVisible={this.changeComingSoonModal} message={'This feature is coming soon.'} />
                            <Header title={'Welcome to Pukaar'} changeDrawer={this.changeDrawer} icon={'menu'} logout={this.logout} customStyles={{paddingTop: Platform.OS === 'ios' ? (60 * Dimensions.get('window').height)/896 : 20, height: Platform.OS === 'ios' ? (120 * Dimensions.get('window').height)/896 : 80}}/>
                            <View style={{ width: '100%', height: '95%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '35%', width: '100%', backgroundColor: theme.colorGrey}}>
                                    <Avatar
                                        rounded
                                        size="large"
                                        source={{ uri: this.state.user.image }}
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.size(20) }}>
                                        <Text style={[styles.subtitle, { fontSize: theme.size(20) }]}>
                                            {this.state.user.name}
                                        </Text>
                                    </View>
                                </View>

                                {/* buttons */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25%', width: '100%' }}>

                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '50%', backgroundColor: theme.colorPrimary, }} >
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AssignedUsers', { user: this.state.user })} style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.5, borderRightColor: theme.colorPrimary, borderLeftColor: theme.colorPrimary, borderBottomWidth: 1, borderBottomColor: theme.colorPrimary }}>
                                            <Icon name="emoticon-happy-outline" type="material-community" color='white' />
                                            <Text style={[styles.subtitle, { color: theme.colorAccent, fontSize: theme.size(18) }]}>Users</Text>
                                            <Text style={[styles.subtitle, { textAlign: 'center', color: theme.colorAccent }]}>Patient's Profile, Set Mood</Text>
                                            <Divider style={{ alignSelf: 'center', backgroundColor: "white", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AssignedUsersChats', { user: this.state.user })} style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderLeftWidth: 0.5, borderLeftColor: theme.colorPrimary, borderBottomWidth: 1, borderBottomColor: theme.colorPrimary }}>
                                        <Icon name="forum-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Chats</Text>
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>View Your Chats</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: '25%', width: '100%' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('UnassignedUsers', { user: this.state.user })} style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderRightWidth: 1, borderRightColor: theme.colorPrimary, }}>
                                        <Icon name="account-plus-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Unassigned Users</Text>
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>View Available Users</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom Navigation */}
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%' }} >
                                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '35%', width: '100%', }}>
                                        {/* <View style={{ height: '70%', width: '100%', backgroundColor: theme.colorAccent }} /> */}
                                        <View style={{ flexDirection: 'row', height: '30%', width: '100%' }}>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'Dashboard' })}>
                                                <Icon name="account-circle-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                            </TouchableOpacity>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }}>
                                                <Icon name="home-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View >
                    </Drawer>
                )
            }
            else if (this.state.user.role === roles.admin) {
                return (
                    <Drawer
                        open={this.state.drawer}
                        type="overlay"
                        content={<List navigation={this.props.navigation} onClose={this.changeDrawer} onLogout={this.logout} role={this.state.user.role} comingSoonModal={this.changeComingSoonModal} />}
                        tapToClose={true}
                        openDrawerOffset={0.2} // 20% gap on the right side of drawer
                        panCloseMask={0.2}
                        closedDrawerOffset={-3}
                        styles={drawerStyles}
                        tweenHandler={(ratio) => ({
                            main: { opacity: (2 - ratio) / 2 }
                        })}
                        captureGestures={true}
                    >
                        <View style={styles.fillSpace}>
                            <SessionModal visible={this.state.comingSoonModalVisible} updateVisible={this.changeComingSoonModal} message={'This feature is coming soon.'} />
                            <Header title={'Welcome to Pukaar'} changeDrawer={this.changeDrawer} icon={'menu'} logout={this.logout} customStyles={{ paddingTop: Platform.OS === 'ios' ? (60 * Dimensions.get('window').height) / 896 : 20, height: Platform.OS === 'ios' ? (120 * Dimensions.get('window').height) / 896 : 80 }} />
                            <View style={{ width: '100%', height: '95%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '35%', width: '100%', backgroundColor: theme.colorGrey }}>
                                    <Avatar
                                        rounded
                                        size="large"
                                        source={{ uri: this.state.user.image }}
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.size(20) }}>
                                        <Text style={[styles.subtitle, { fontSize: theme.size(20) }]}>
                                            {this.state.user.name}
                                        </Text>
                                    </View>
                                </View>

                                {/* buttons */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25%', width: '100%', backgroundColor: '#000000' }}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '50%', }} >
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminUsers', { user: this.state.user })} style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colorPrimary, borderRightWidth: 0.5, borderRightColor: theme.colorPrimary, }}>
                                            <Icon name="person-outline" color='white' />
                                            <Text style={[styles.subtitle, { color: theme.colorAccent, fontSize: theme.size(18) }]}>Users</Text>
                                            <Text style={[styles.subtitle, { color: theme.colorAccent }]}>See User's Profile</Text>
                                            <Divider style={{ alignSelf: 'center', backgroundColor: "white", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminTherapists', { user: this.state.user })} style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: theme.colorPrimary, borderLeftWidth: 0.5, borderLeftColor: theme.colorPrimary, }}>
                                        <Icon name="account-heart-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Therapists</Text>
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>See therapists</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom Navigation */}
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '35%', width: '100%', }}>
                                        <View style={{ height: '70%', width: '100%', backgroundColor: theme.colorAccent }} />
                                        <View style={{ flexDirection: 'row', height: '30%', width: '100%' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                                <Icon name="home-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View >
                    </Drawer>
                )
            }
            else if (this.state.user.role === roles.user) {
                return (
                    <Drawer
                        open={this.state.drawer}
                        type="overlay"
                        content={<List navigation={this.props.navigation} onClose={this.changeDrawer} onLogout={this.logout} role={this.state.user.role} modalFunction={this.changeTherapistUserModal} comingSoonModal={this.changeComingSoonModal} />}
                        tapToClose={true}
                        openDrawerOffset={0.2} // 20% gap on the right side of drawer
                        panCloseMask={0.2}
                        closedDrawerOffset={-3}
                        styles={drawerStyles}
                        tweenHandler={(ratio) => ({
                            main: { opacity: (2 - ratio) / 2 }
                        })}
                        captureGestures={true}
                        onClose={() => { this.setState({ drawer: false }) }}
                    >
                        <View style={styles.fillSpace}>
                            <Header title={'Welcome to Pukaar'} changeDrawer={this.changeDrawer} icon={'menu'} logout={this.logout} customStyles={{ paddingTop: Platform.OS === 'ios' ? (60 * Dimensions.get('window').height) / 896 : 20, height: Platform.OS === 'ios' ? (120 * Dimensions.get('window').height) / 896 : 80 }} />
                            <ReasonModal visible={this.state.changeTherapistModal} updateVisible={this.changeTherapistUserModal} message={'State the reason for'} title={'changing your therapist'} propertyName={'changeTherapistReason'} value={this.state.changeTherapistReason} onChange={this.onChange} onSubmit={this.onChangeTherapistSubmit} loading={this.state.changeTherapistLoader} />
                            <SessionModal visible={this.state.comingSoonModalVisible} updateVisible={this.changeComingSoonModal} message={'This feature is coming soon.'} />
                            <SessionModal visible={this.state.comingSoonModalVisible2} updateVisible={this.changeComingSoonModal2} message={'This feature is coming soon.'} />
                            <View style={{ width: '100%', height: '95%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '35%', width: '100%', backgroundColor: theme.colorGrey }}>
                                    <Avatar
                                        rounded
                                        size="large"
                                        source={{ uri: this.state.user.image }}
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.size(20) }}>
                                        <Text style={[styles.subtitle, { fontSize: theme.size(20) }]}>
                                            {this.state.user.name}
                                        </Text>
                                    </View>
                                </View>

                                {/* buttons */}
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25%', width: '100%', backgroundColor: '#000000' }}>
                                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '50%', backgroundColor: theme.colorPrimary }} >
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SetMood', { user: this.state.user })} style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: theme.colorPrimary, borderBottomWidth: 1, borderBottomColor: theme.colorPrimary }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Icon name="emoticon-neutral-outline" type="material-community" color='white' />
                                                <Icon name="emoticon-happy-outline" type="material-community" color='white' />
                                                <Icon name="emoticon-sad-outline" type="material-community" color='white' />
                                            </View>
                                            <Text style={[styles.subtitle, { color: theme.colorAccent, fontSize: theme.size(18) }]}>Set mood</Text>
                                            <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Set your mood</Text>
                                            <Divider style={{ alignSelf: 'center', backgroundColor: "white", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                        </TouchableOpacity>
                                    </LinearGradient>


                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Diary', { user: this.state.user })} style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderLeftWidth: 1, borderLeftColor: theme.colorPrimary, borderBottomWidth: 1, borderBottomColor: theme.colorPrimary }}>
                                        <Icon name="book-open-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Diary</Text>
                                        <Text style={[styles.subtitle, { textAlign: 'center', color: theme.colorGrey }]}>View your mood history</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '25%', width: '100%', backgroundColor: '#000000', }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderRightWidth: 1, borderRightColor: theme.colorPrimary, borderTopWidth: 1, borderTopColor: theme.colorPrimary }} onPress={() => this.props.navigation.navigate('Forum')}>
                                        <Icon name="comment-question-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Forum</Text>
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>Pukaar forum</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%', backgroundColor: '#ffffff', borderLeftWidth: 1, borderLeftColor: theme.colorPrimary, borderTopWidth: 1, borderTopColor: theme.colorPrimary }} onPress={() => this.props.navigation.navigate('Settings')}>
                                        <Icon name="settings-outline" type="material-community" />
                                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(18), fontFamily: theme.font.regular }]}>Settings</Text>
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>Payment, passcode...</Text>
                                        <Divider style={{ alignSelf: 'center', backgroundColor: "black", marginTop: theme.size(20), height: theme.size(5), width: '10%' }} />
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom Navigation */}
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%' }} >
                                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '35%', width: '100%', }}>
                                        <View style={{ flexDirection: 'row', height: '30%', width: '100%' }}>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('TherapistProfileUser')}>
                                                <Icon name="account-circle-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Therapist</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('UserChat', { user: this.state.user })}>
                                                <Icon name="forum-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Chat</Text>
                                            </TouchableOpacity>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }}>
                                                <Icon name="home-outline" color='white' type='material-community' />
                                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View >
                    </Drawer >
                )
            }
        }

    }
}