import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import { styles, theme } from "../../styles";
import { Button, Badge, Avatar, ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import { roles } from '../../util/enums/User';
import { http } from '../../util/http';
import Moment from 'react-moment';

let moodList = [
    {
        title: 'Crying',
        icon: 'emoticon-cry-outline'
    },
    {
        title: 'Depressed',
        icon: 'emoticon-dead-outline'
    },
    {
        title: 'Excited',
        icon: 'emoticon-excited-outline'
    },
    {
        title: 'Ok',
        icon: 'emoticon-neutral-outline'
    },
    {
        title: 'Sad',
        icon: 'emoticon-sad-outline'
    }
]

export default class SetMood extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.navigation.getParam('user'),
            loading: false,
            selectedMood: '',
            moodList: [],
            sortBy: 'Day'
        };
    }

    getMoodIcon = (title) => {
        for (let i = 0; i < moodList.length; i++) {
            if (title == moodList[i].title) return moodList[i].icon;
        }
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    getDiary = (sortBy) => {
        if (sortBy !== this.state.sortBy) {
            http.get(`/users/diary?sortBy=${sortBy}`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                .then(resp => {
                    this.setState({
                        moodList: resp.data.data,
                        sortBy
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

    componentDidMount() {
        http.get(`/users/diary?sortBy=Day`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
            .then(resp => {
                this.setState({ moodList: resp.data.data })
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
        this.goBack();
        return true
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    updateSelectedMood = (mood) => {
        this.setState({ selectedMood: mood })
        this.props.navigation.navigate('SetNote', { mood: mood })
    }

    goToChat = async () => {
        const user = await session.getUser();
        this.props.navigation.navigate('UserChat', { user: user })
    }

    render() {
        const { user } = this.state;
        return (
            <View style={styles.fillSpace}>
                <Header title={'History'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Icon name={'chart-pie'} color={"black"} type="material-community" size={40} containerStyle={{ alignSelf: "flex-end", top: theme.size(5), right: theme.size(5) }} onPress={() => this.props.navigation.navigate("History", { data: this.state.moodList })} />
                        <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]}>Mood diary</Text>
                        <Text style={[styles.subtitle, { textAlign: 'center', color: 'black', marginBottom: theme.size(20) }]}>
                            You can see your mood history
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: theme.size(20), }}>
                            {
                                this.state.sortBy === 'Day'
                                    ?
                                    <Button containerStyle={{ width: '30%' }} title="Day" ViewComponent={LinearGradient} onPress={() => this.getDiary('Day')} />
                                    :
                                    <Button buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} containerStyle={{ width: '30%' }} title="Day" linearGradientProps={null} onPress={() => this.getDiary('Day')} />
                            }
                            {
                                this.state.sortBy === 'Week'
                                    ?
                                    <Button containerStyle={{ width: '30%' }} title="Week" ViewComponent={LinearGradient} onPress={() => this.getDiary('Week')} />
                                    :
                                    <Button buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} containerStyle={{ width: '30%' }} title="Week" linearGradientProps={null} onPress={() => this.getDiary('Week')} />
                            }
                            {
                                this.state.sortBy === 'Month'
                                    ?
                                    <Button containerStyle={{ width: '30%' }} title="Month" ViewComponent={LinearGradient} onPress={() => this.getDiary('Month')} />
                                    :
                                    <Button buttonStyle={{ backgroundColor: 'white' }} titleStyle={{ color: 'black' }} containerStyle={{ width: '30%' }} title="Month" linearGradientProps={null} onPress={() => this.getDiary('Month')} />
                            }
                        </View>
                        {
                            this.state.moodList.map(mood => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", borderBottomWidth: 1, borderBottomColor: theme.colorPrimary }} key={mood.title}>
                                        {
                                            <View style={{ width: '30%', height: theme.size(70), alignItems: "center", flexDirection: "row" }}>
                                                <Badge status="primary" />
                                                <Moment style={[{ fontSize: theme.size(14), color: theme.colorGrey, marginLeft: theme.size(25), marginRight: theme.size(15) }]} format="hh:mm A" element={Text} >{mood.createdAt}</Moment>
                                            </View>
                                        }
                                        <View style={{ width: "30%", flexDirection: "column", justifyContent: 'flex-start', paddingHorizontal: theme.size(15) }}>
                                            <Text style={[styles.bodyText, { color: "#000" }]}>
                                                {mood.mood}
                                            </Text>
                                            <Moment style={[{ fontSize: theme.size(14), color: theme.colorGrey }]} format="DD-MM-YYYY" element={Text} >{mood.createdAt}</Moment>
                                        </View>
                                        <View style={{ width: "30%" }}>
                                            <Icon name={this.getMoodIcon(mood.mood)} color={this.state.selectedMood === mood.title ? theme.colorPrimary : "black"} type="material-community" size={50} />
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                        <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('TherapistProfileUser')}>
                                <Icon name="account-circle-outline" color='white' type='material-community' />
                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Therapist</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.goToChat()}>
                                <Icon name="forum-outline" color='white' type='material-community' />
                                <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Chat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
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