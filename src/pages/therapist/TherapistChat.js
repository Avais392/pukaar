import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler, StyleSheet, NativeModules, Dimensions, PermissionsAndroid,Platform, KeyboardAvoidingView } from 'react-native';
import { styles, theme } from "../../styles";
import { Icon, Divider } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Message from '../../components/Message';
import Snack from '../../components/Snackbar';
import LinearGradient from 'react-native-linear-gradient';
import Input from "../../components/Input";
import session from '../../data/session';
import openSocket from 'socket.io-client';
import { socketUrl, agoraAppId } from "../../util/constants";
import Moment from 'react-moment';
import { roles } from '../../util/enums/User'
import NetInfo from "@react-native-community/netinfo";
import ChatModal from '../../components/ChatModal';

import { RtcEngine, AgoraView } from 'react-native-agora';
const { Agora } = NativeModules;
const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Adaptative,
} = Agora;

let updateTimeVar, callTimeout;

export default class TherapistChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientId: props.navigation.getParam('patientId'),
            loading: true,
            rightIcon: props.navigation.getParam('rightIcon'),
            name: props.navigation.getParam('patientName'),
            hasMore: false,
            messages: [],
            page: 1,
            toSkip: 0,
            message: '',
            user: props.navigation.getParam('user'),

            call: props.navigation.getParam('call') || false,
            vidMute: true,                             //State variable for Video Mute
            audMute: false,
            // joinSucceed: false,
            speakerMute: false,
            callStatus: '',
            callStartTime: null,
            callDuration: null,
            callId: null,
            permission: false,
            chatModalVisible: false
        };
        this.getChat(props.navigation.getParam('patientId'))
        if (props.navigation.getParam('call')) {
            this.call(true)
        }
    }

    getChat = async (id) => {
        const user = await session.getUser()
        http.get(`/therapists/${id}/chat?page=${this.state.page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                this.setState({
                    messages: resp.data.data.messages.docs,
                    loading: false,
                    hasMore: resp.data.data.messages.pages > 1 ? true : false
                })
                // this.setState({ messages: resp.data.data.docs, loading: false, hasMore: resp.data.data.pages > 1 ? true : false })
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

    receiveCall = () => {
        RtcEngine.startPreview();                                 //Start RTC preview
        RtcEngine.setEnableSpeakerphone(false)
        RtcEngine.enableAudio();
        RtcEngine.disableVideo();
        this.setState({
            callStatus: 'connected',
            callStartTime: new Date().getTime(),
            call: true
        })
        updateTimeVar = setInterval(() => {
            this.setState({
                callDuration: new Date().getTime(),
            })
        }, 1000)

    }

    updateVisible = () => {
        this.setState({
            chatModalVisible: !this.state.chatModalVisible
        })
    }

    async componentDidMount() {
        await this.getPermissions();
        let unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                if (this.state.callStatus !== '') {
                    RtcEngine.destroy()
                    this.setState({
                        call: false,
                        callStartTime: null,
                        callDuration: null,
                        callStatus: ''
                    })
                    this.props.navigation.goBack();
                }
            }
        });

        if (this.props.navigation.getParam('receive')) {
            this.receiveCall();
        }
        const socket = openSocket(socketUrl);
        socket.on(this.state.patientId, (message) => {
            if (message.sender === this.state.patientId) {
                let data = {
                    id: message._id,
                    message: message.message,
                    time: message.createdAt,
                    type: message.type,
                    isSender: false,
                    sender: {
                        photo: this.props.navigation.getParam('patientName'),
                        name: this.props.navigation.getParam('rightIcon'),
                    }
                }
                let skip = this.state.toSkip + 1
                this.setState({
                    messages: [data, ...this.state.messages],
                    toSkip: skip
                })
            }
        });
        socket.on(`${this.state.patientId}-call-accepted`, async (data) => {
            if (data.role === roles.user) {
                RtcEngine.setEnableSpeakerphone(false)
                RtcEngine.enableAudio();
                RtcEngine.disableVideo();
                RtcEngine.startPreview();                                      //Start RTC preview
                this.setState({
                    callStatus: 'connected',
                    callStartTime: new Date().getTime()
                });
                updateTimeVar = setInterval(() => {
                    this.setState({
                        callDuration: new Date().getTime(),
                    })
                }, 1000)
            }
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    toggleSpeaker() {
        let mute = this.state.speakerMute;
        this.setState({
            speakerMute: !mute,
        });
        RtcEngine.setEnableSpeakerphone(!mute)
    }

    toggleAudio() {
        let mute = this.state.audMute;
        this.setState({
            audMute: !mute,
        });
        if (!mute) {
            RtcEngine.disableAudio()
        }
        else {
            RtcEngine.enableAudio()
        }
    }
    /**
    * @name toggleVideo
    * @description Function to toggle local user's video
    */
    toggleVideo() {
        let mute = this.state.vidMute;
        if (!mute) {
            RtcEngine.disableVideo()
        }
        else {
            RtcEngine.enableVideo()
        }
        this.setState({
            vidMute: !mute,
        });
    }
    /**
    * @name endCall
    * @description Function to end the call
    */
    endCall(cancelledByUser) {
        RtcEngine.leaveChannel()
        RtcEngine.destroy();
        clearInterval(updateTimeVar)
        clearTimeout(callTimeout)
        const { callId } = this.state;
        if (this.state.callStatus === 'connected' || this.state.callStatus === 'connecting') {
            let status = this.state.callStatus === 'connected' ? 'finished' : 'declined';
            if (cancelledByUser) {
                status = this.state.callStatus === 'connected' ? 'finished' : 'missed'
            }
            http.post('/therapists/call-status', { callId: callId, status: status, userId: this.state.patientId }, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                .then(resp => { })
                .catch(err => {
                    if (err.response) {
                        Snack("error", err.response.data.error)
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                    }
                })
        }
        this.setState({
            call: false,
            vidMute: true,                             //State variable for Video Mute
            audMute: false,
            // joinSucceed: false,
            speakerMute: false,
            callStatus: '',
            callDuration: null,
            callStartTime: null
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        // this.props.navigation.goBack();
        if (this.state.callStatus === '') {
            this.props.navigation.navigate('AssignedUsersChats', { user: this.state.user })
            return true
        }
        else {
            return true
        }
    }

    goBack = () => {
        // this.props.navigation.goBack();
        if (this.state.callStatus === '') {
            this.props.navigation.navigate('AssignedUsersChats', { user: this.state.user })
        }
    }

    onChange = (value, property) => { this.setState({ [property]: value }) }

    loadMore = async () => {
        if (this.state.hasMore) {
            let page = this.state.page + 1 + (Math.floor(this.state.toSkip / 10))
            const user = await session.getUser()
            http.get(`/therapists/${this.state.patientId}/chat?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    let newMessages = resp.data.data.messages.docs.slice(this.state.toSkip);
                    this.setState({
                        messages: [...this.state.messages, ...newMessages],
                        hasMore: resp.data.data.messages.pages > page ? true : false,
                        page: page,
                        toSkip: 0
                    })
                })
                .catch(err => {
                    if (err.response) {
                        setTimeout(() => {
                            Snack("error", err.response.data.error)
                        }, 500)
                    }
                    else {
                        setTimeout(() => {
                            Snack("error", "Unknown error occured, please contact an Admin")
                        }, 500)
                    }
                })
        }
    }

    sendMessage = async () => {
        const { message } = this.state;
        if (message.length > 0) {
            this.setState({ message: '' })
            const user = await session.getUser()
            http.post('/therapists/send-message', { message, patient: this.state.patientId }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    let newMessage = {
                        createdAt: new Date(),
                        isSender: true,
                        message: message,
                        sender: {
                            photo: user.image,
                            name: user.name,
                        },
                        type: "chat",
                    }
                    let array = [...this.state.messages];
                    array.unshift(newMessage);
                    let skip = this.state.toSkip + 1
                    this.setState({
                        messages: array,
                        toSkip: skip
                    })
                })
                .catch(err => {
                    if (err.response) {
                        setTimeout(() => {
                            Snack("error", err.response.data.error)
                        }, 500)
                    }
                    else {
                        setTimeout(() => {
                            Snack("error", "Unknown error occured, please contact an Admin")
                        }, 500)
                    }
                })
        }
    }

    videoView() {
        if (this.state.callStatus === 'connecting') {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.fillSpace}>
                        <Text style={styles.h1}>Connecting...</Text>
                    </View>
                    <View style={stylesz.buttonBar}>
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.audMute ? 'mic-off' : 'mic'} color='#000' onPress={() => this.toggleAudio()} />
                        <Icon iconStyle={stylesz.iconStyle} name="call-end" color='#000' onPress={() => this.endCall(true)} />
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.vidMute ? 'videocam-off' : 'videocam'} color='#000' onPress={() => this.toggleVideo()} />
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.speakerMute ? 'volume-up' : 'volume-mute'} color='#000' onPress={() => this.toggleSpeaker()} />
                    </View>
                </View>
            );
        }
        else if (this.state.callStatus === 'connected') {
            return (
                <View style={{ flex: 1 }}>
                    {
                        !this.state.vidMute
                            ?
                            <View style={{ height: dimensions.height - 100 }}>
                                {/* <AgoraView remoteUid={2} mode={1} /> */}
                                <AgoraView style={stylesz.localVideoStyle} zOrderMediaOverlay={true} remoteUid={1} mode={1} />
                            </View>
                            :
                            <View style={{ flex: 1 }}>
                                <View style={styles.fillSpace}>
                                    <Text style={styles.h1}>
                                        {
                                            this.state.callStartTime && this.state.callDuration &&
                                            <Moment format="mm:ss" element={Text} >{this.state.callDuration - this.state.callStartTime}</Moment>
                                        }
                                    </Text>
                                </View>
                                <View style={stylesz.buttonBar}>
                                    <Icon iconStyle={stylesz.iconStyle} name={this.state.audMute ? 'mic-off' : 'mic'} color='#000' onPress={() => this.toggleAudio()} />
                                    <Icon iconStyle={stylesz.iconStyle} name="call-end" color='#000' onPress={() => this.endCall()} />
                                    <Icon iconStyle={stylesz.iconStyle} name={this.state.vidMute ? 'videocam-off' : 'videocam'} color='#000' onPress={() => this.toggleVideo()} />
                                    <Icon iconStyle={stylesz.iconStyle} name={this.state.speakerMute ? 'volume-up' : 'volume-mute'} color='#000' onPress={() => this.toggleSpeaker()} />
                                </View>
                            </View>
                    }
                    <View style={stylesz.buttonBar}>
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.audMute ? 'mic-off' : 'mic'} color='#000' onPress={() => this.toggleAudio()} />
                        <Icon iconStyle={stylesz.iconStyle} name="call-end" color='#000' onPress={() => this.endCall()} />
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.vidMute ? 'videocam-off' : 'videocam'} color='#000' onPress={() => this.toggleVideo()} />
                        <Icon iconStyle={stylesz.iconStyle} name={this.state.speakerMute ? 'volume-up' : 'volume-mute'} color='#000' onPress={() => this.toggleSpeaker()} />
                    </View>
                </View>
            );
        }
    }

    getPermissions = async () => {
        try {
            if(Platform.OS !== 'ios'){
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                ]);
                if (
                    granted["android.permission.RECORD_AUDIO"] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    granted["android.permission.CAMERA"] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    this.setState({
                        permission: true
                    })
                } else {
                    this.setState({
                        permission: false
                    })
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    call = async (notify) => {
        if (this.state.permission || Platform.OS === 'ios') {
            if (this.state.callStatus.length === 0) {
                try {
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
                    this.setState({ call: true, callStatus: 'connecting' })
                    callTimeout = setTimeout(() => {
                        if (this.state.callStatus === 'connecting') {
                            this.endCall(true)
                        }
                    }, 30000);
                    RtcEngine.on('userOffline', (data) => {       //If user leaves
                        this.endCall(false)
                        this.setState({
                            call: false,
                            callStatus: ''
                        });
                    });
                    RtcEngine.joinChannel(this.state.patientId, 2);  //Join Channel
                    if (!notify) {
                        http.post('/therapists/call', { patient: this.state.patientId }, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                            .then(resp => {
                                this.setState({
                                    callId: resp.data.data.callId
                                })
                            })
                            .catch(err => {
                                if (err.response) {
                                    setTimeout(() => {
                                        Snack("error", err.response.data.error)
                                    }, 500)
                                }
                                else {
                                    setTimeout(() => {
                                        Snack("error", "Unknown error occured, please contact an Admin")
                                    }, 500)
                                }
                            })
                    }
                }
                catch (err) {
                    if (err.response) {
                        Snack("error", err.response.data.error)
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                    }
                }
            }
        }
        else {
            this.getPermissions()
        }
    }

    specialAction = (action) => {
        this.setState({ chatModalVisible: false })
        setTimeout(() => {
            if (action === 'call') {
                this.call(false)
            }
        }, 200);
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Users'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "flex-end" }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'TherapistChat' })}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                </ View>
            )
        }
        else {
            if (this.state.call) {
                return this.videoView()
            }
            else {
                return (
                    <View style={styles.fillSpace}>
                        <Header title={this.state.name} changeDrawer={this.goBack} icon={'keyboard-arrow-left'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} avatarRight={true} iconRight={this.state.rightIcon} />
                        <ChatModal
                            visible={this.state.chatModalVisible}
                            updateVisible={this.updateVisible}
                            action={this.specialAction}
                        />
                        <View style={{ flex: 1, width: '100%' }}>
                            <FlatList
                                data={this.state.messages}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Message
                                            data={{
                                                message: item.message,
                                                avatar: item.isSender ? this.state.user.image : this.state.rightIcon,
                                                time: item.createdAt,
                                                type: item.type,
                                                name: item.sender.name
                                            }}
                                            isSender={item.isSender}
                                            patientName={this.state.name}
                                        />
                                    )
                                }}
                                keyExtractor={item => item.id}
                                inverted
                                onEndReached={this.loadMore}
                                onEndReachedThreshold={0.1}
                            />
                            <Divider style={{ marginTop: theme.size(10) }} />
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#FAFAFA', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <Icon name="add" color='#000' iconStyle={{ padding: 10 }} onPress={() => this.setState({ chatModalVisible: true })} />
                            <Input placeholder={"Name"} placeholder={'Message...'} onChange={this.onChange} propertyName={'message'} value={this.state.message}
                                containerStyle={{ borderWidth: 0.75, width: '75%', borderRadius: 50, height: "75%", borderColor: theme.colorPrimary }}
                            />
                            <Text onPress={() => { this.sendMessage() }} style={[styles.bodyText, { color: "#3C94FF" }]}>Send</Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'TherapistChat' })}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )
            }
        }
    }
}


const stylesz = StyleSheet.create({
    buttonBar: {
        height: 50,
        display: 'flex',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        marginBottom: Platform.OS === 'ios' ? 30 : 0
    },
    // localVideoStyle: {
    //     width: 140,
    //     height: 160,
    //     position: 'absolute',
    //     top: 5,
    //     right: 5,
    //     zIndex: 100,
    // },
    localVideoStyle: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 5,
        // right: 5,
        zIndex: 100,
    },
    iconStyle: {
        padding: 20,
        borderRadius: 0,
        // marginBottom: 10
    },
});

let dimensions = {                                            //get dimensions of the device to use in view styles
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};