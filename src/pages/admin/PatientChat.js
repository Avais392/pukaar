import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Icon, Button } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Message from '../../components/Message';
import Snack from '../../components/Snackbar';
import LinearGradient from 'react-native-linear-gradient';
import session from '../../data/session';
import openSocket from 'socket.io-client';
import { socketUrl } from "../../util/constants";
import Input from "../../components/Input";

export default class PatientChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.getParam('userId'),
            loading: false,
            rightIcon: props.navigation.getParam('rightIcon'),
            name: props.navigation.getParam('userName'),
            hasMore: false,
            messages: [],
            page: 1,
            toSkip: 0,
            currentTherapistId: '',
            currentTherapistName: '',
            currentTherapistPhoto: null,
            currentTherapistId: '',
            adminVerified: false,
            masterPassword: '',
            buttonLoading: false
        };
        this.getChat(props.navigation.getParam('userId'))
    }

    componentDidMount() {
        const socket = openSocket(socketUrl);
        socket.on(this.state.userId, async (message) => {
            let data = {
                id: message._id,
                message: message.message,
                time: message.createdAt,
                type: message.type,
            }
            let skip = this.state.toSkip + 1
            if (message.sender === this.state.userId) {
                data.isSender = true
                data.sender = {
                    photo: this.state.rightIcon,
                    name: this.state.name,
                }
            }
            else {
                data.isSender = false
                data.sender = {
                    photo: this.state.currentTherapistPhoto,
                    name: this.state.currentTherapistName,
                }
            }
            this.setState({ messages: [data, ...this.state.messages], toSkip: skip })
        });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true
    }

    verifyMasterPassword = async () => {
        if (this.state.masterPassword.length > 0 && !this.state.buttonLoading) {
            this.setState({ buttonLoading: true })
            const { masterPassword } = this.state;
            const user = await session.getUser()
            http.post('/admin/users/master-password', { masterPassword }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    this.setState({ buttonLoading: false, masterPassword: '', loading: true, adminVerified: true })
                    this.getChat(this.state.userId)
                })
                .catch(err => {
                    this.setState({ buttonLoading: false })
                    if (err.response) {
                        Snack("error", err.response.data.error)
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                    }

                })
        }
    }

    getChat = async () => {
        const user = await session.getUser()
        http.get(`/admin/users/${this.state.userId}/chat?page=${this.state.page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                if (resp.data.data.currentTherapistInfo) {
                    this.setState({
                        messages: resp.data.data.messages.docs,
                        loading: false,
                        hasMore: resp.data.data.messages.pages > 1 ? true : false,
                    })
                }
                else {
                    this.setState({
                        messages: resp.data.data.messages.docs,
                        loading: false,
                        hasMore: resp.data.data.messages.pages > 1 ? true : false,
                        currentTherapistName: resp.data.data.currentTherapistInfo.therapist.name,
                        currentTherapistPhoto: resp.data.data.currentTherapistInfo.therapist.photo,
                        currentTherapistId: resp.data.data.currentTherapistInfo.therapist._id
                    })
                }

            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    Snack("error", err.response.data.error)
                }
                else {
                    Snack("error", "Unknown error occured, please contact an Admin");
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userId !== this.props.navigation.getParam('userId')) {
            this.setState({
                name: this.props.navigation.getParam('userName'),
                rightIcon: this.props.navigation.getParam('rightIcon'),
                userId: this.props.navigation.getParam('userId'),
                page: 1
            })
            this.getChat(this.props.navigation.getParam('userId'))
        }
    }

    goBack = () => {
        this.props.navigation.navigate('AdminUsers')
    }

    loadMore = async () => {
        if (this.state.hasMore) {
            let page = this.state.page + 1 + (Math.floor(this.state.toSkip / 10))
            const user = await session.getUser()
            http.get(`/admin/users/${this.state.userId}/chat?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
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

    onChange = (value, property) => { this.setState({ [property]: value }) }

    render() {
        if (!this.state.adminVerified) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={this.state.name} changeDrawer={this.goBack} icon={'keyboard-arrow-left'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} avatarRight={true} iconRight={this.state.rightIcon} />
                    <View style={{ flex: 1, width: '80%', marginBottom: theme.size(10), alignItems: "center", justifyContent: "center" }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                            <Input placeholder={"Master password"} leftIcon={{ name: 'lock-outline' }} secureTextEntry={true} onChange={this.onChange} propertyName={'masterPassword'} value={this.state.masterPassword} autoCapitalize='none' value={this.state.masterPassword} />
                        </View>
                        <View style={{ width: '100%', bottom: theme.size(-30) }}>
                            <Button title="View Chat" onPress={() => this.verifyMasterPassword()} buttonStyle={{ borderRadius: 5 }} containerStyle={{ marginVertical: theme.size(20) }} loading={this.state.loading} ViewComponent={LinearGradient} loading={this.state.buttonLoading} disabled={this.state.masterPassword.length === 0 ? true : false} />
                        </View>
                    </View>
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
                </View>

            )
        }
        else {
            if (this.state.loading) {
                return (
                    <View style={styles.fillSpace}>
                        <Header title={'Users'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} />
                        <View style={{ flex: 1, width: '100%', justifyContent: "flex-end" }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                                <Icon name="home-outline" color='white' type='material-community' />
                                                <Text style={[styles.bodyText, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </ View>
                )
            }
            else {
                return (
                    <View style={styles.fillSpace}>
                        <Header title={this.state.name} changeDrawer={this.goBack} icon={'keyboard-arrow-left'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} avatarRight={true} iconRight={this.state.rightIcon} />
                        <View style={{ flex: 1, width: '100%', marginBottom: theme.size(10) }}>
                            <FlatList
                                data={this.state.messages}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Message
                                            data={{
                                                message: item.message,
                                                avatar: item.sender.photo,
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
                        </View>
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
                    </View>
                )
            }
        }
    }
}