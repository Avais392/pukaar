import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, Linking, Button, NativeModules } from 'react-native';
import { styles, theme } from "../styles";
import { Avatar, Icon } from 'react-native-elements';
import { roles } from '../util/enums/User'
import LinearGradient from 'react-native-linear-gradient';
import { http } from "../util/http";

import { RtcEngine, AgoraView } from 'react-native-agora';
import { agoraAppId } from "../util/constants";
import session from '../data/session';
import Snack from '../components/Snackbar';

const { Agora } = NativeModules;
const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Adaptative,
} = Agora;


export default class RecieveCall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.navigation.getParam('user'),
            notification: props.navigation.getParam('notification'),
            ringing: true,
            loading: true
        };
        let notifcation = props.navigation.getParam('notification');
    }

    async componentDidMount() {
        const config = {                                                //Setting config of the app
            appid: agoraAppId,                                          //App ID
            channelProfile: 0,                                          //Set channel profile as 0 for RTC
            videoEncoderConfig: {                                       //Set Video feed encoder settings
                width: 1280,
                height: 720,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            audioProfile: AudioProfileDefault,
            audioScenario: AudioScenarioDefault,
        };
        RtcEngine.init(config);

        const user = await session.getUser()
        let id = null, userId = null, uid;
        if (user.role === roles.user) {
            id = user.id;
            userId = this.state.notification.id
            uid = 1;
        }
        else {
            id = this.state.notification.id
            userId = user.id
            uid = 2
        }
        RtcEngine.joinChannel(id, uid);  //Join Channel
        RtcEngine.setEnableSpeakerphone(false)
        RtcEngine.disableAudio();
        RtcEngine.disableVideo();
        RtcEngine.on('userOffline', (data) => {       //If user leaves
            RtcEngine.leaveChannel()
            RtcEngine.destroy();
            http.get(`/therapists/call-status/${this.state.notification.callId}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    let status = resp.data.data.status === 'connected' ? 'finished' : 'declined'
                    http.post('/therapists/call-status', { callId: this.state.notification.callId, status: status, userId }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                        .then(resp => {
                            this.props.navigation.goBack();
                            this.setState({
                                ringing: false
                            })
                        })
                        .catch(err => {
                            if (err.response) {
                                Snack("error", err.response.data.error)
                            }
                            else {
                                Snack("error", "Unknown error occured, please contact an Admin");
                            }
                        })
                })
        });
        RtcEngine.on('rtcStats', (data) => {
            if (data.stats.userCount < 2) {
                this.declineCall()
            }
        })
        http.get(`/therapists/call-status/${this.state.notification.callId}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                this.setState({
                    loading: false
                })
                if (resp.data.data.status !== 'connecting') {
                    RtcEngine.leaveChannel()
                    RtcEngine.destroy();
                    if (user.role === roles.user) {
                        this.props.navigation.navigate('UserChat', { user: user })
                        return
                    }
                    else {
                        this.props.navigation.navigate('TherapistChat', { patientId: this.state.notification.id, patientName: this.state.notification.senderName, rightIcon: this.state.notification.photo, user: user })
                        return
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    Snack("error", err.response.data.error)
                }
                else {
                    Snack("error", "Unknown error occured, please contact an Admin");
                }
            })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // this.props.navigation.goBack();
        // return true
    }

    goBack = () => {
        // this.props.navigation.goBack();
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.ringing && !this.props.navigation.getParam('ringing')) {
            this.setState({
                ringing: false
            })
        }
    }

    //To:Do make this socket accept thing
    acceptCall = async () => {
        const { user, notification } = this.state
        const localUser = await session.getUser()
        let notificationId, patientId, accepter;
        http.get(`/therapists/call-status/${notification.callId}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                if (resp.data.data.status === 'connecting') {
                    if (user.role === roles.user) {
                        notificationId = this.state.notification.id
                        patientId = localUser.id
                        accepter = roles.user
                        this.props.navigation.navigate('UserChat', { user: user, receive: true, therapistId: notificationId })
                    }
                    else {
                        notificationId = user.id
                        patientId = notification.id;
                        accepter = roles.therapist
                        this.props.navigation.navigate('TherapistChat', { receive: true, patientId: notification.id, patientName: notification.senderName, rightIcon: notification.photo, user: user })
                    }
                    http.post('/therapists/call-status', { accepter, callId: notification.callId, status: 'connected', userId: notificationId, patientId }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                        .then(resp => {
                            // this.props.navigation.goBack();
                            if (user.role === roles.user) {
                                this.props.navigation.navigate('UserChat', { user: user, receive: true, therapistId: notificationId })
                                return
                            }
                            else {
                                this.props.navigation.navigate('TherapistChat', { patientId: notification.id, patientName: notification.senderName, rightIcon: notification.photo, user: user })
                                return
                            }
                            this.setState({
                                ringing: false
                            })
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
                else {
                    RtcEngine.leaveChannel()
                    RtcEngine.destroy();
                    if (user.role === roles.user) {
                        this.props.navigation.navigate('UserChat', { user: user })
                    }
                    else {
                        this.props.navigation.navigate('TherapistChat', { patientId: notification.id, patientName: notification.senderName, rightIcon: notification.photo, user: user })
                    }
                }
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

    declineCall = () => {
        RtcEngine.leaveChannel()
        RtcEngine.destroy()
        const { user, notification } = this.state
        if (user.role === roles.user) {
            http.post('/users/decline-call', { currentTherapistId: notification.id, callId: notification.callId }, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                .then(resp => {
                    this.props.navigation.goBack();
                    this.setState({
                        ringing: false
                    })
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
        else if (user.role === roles.therapist) {
            http.post('/therapists/decline-call', { patient: notification.id, callId: notification.callId }, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                .then(resp => {
                    this.props.navigation.goBack();
                    this.setState({
                        ringing: false
                    })
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
    }

    render() {
        const { notification } = this.state;
        if (this.state.loading) {
            return null
        }
        else {
            if (notification) {
                return (
                    <View style={styles.fillSpace}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '35%', width: '100%', backgroundColor: '#d3d3d3' }}>
                            <Avatar
                                rounded
                                size="large"
                                source={{ uri: this.state.notification.photo }}
                            />
                        </View>
                        <View style={{ flex: 1, width: '50%', justifyContent: "space-evenly" }}>
                            <Button
                                containerStyle={{ backgroundColor: 'white' }}
                                title="Answer"
                                linearGradientProps={null}
                                onPress={() => this.acceptCall()}
                            />
                            {/* <Button ViewComponent={LinearGradient} title={'Answer'}
                                onPress={() => this.acceptCall()}
                            /> */}
                            <Button
                                icon={{ name: "pencil-outline", type: 'material-community', size: 15, color: "white" }}
                                title="Decline" iconRight={true}
                                buttonStyle={{ borderRadius: 5 }}
                                ViewComponent={LinearGradient}
                                onPress={() => this.declineCall()}
                            />
                        </View>
                    </View>
                )
            }
            else {
                return null
            }
        }
    }
}