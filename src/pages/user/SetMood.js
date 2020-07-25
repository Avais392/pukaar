import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Badge, Avatar, ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import { roles } from '../../util/enums/User';


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
            selectedMood: ''
        };
    }



    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
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
                <Header title={'Set mood'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ alignItems: "center", marginTop: theme.size(20) }}>
                            <Avatar
                                rounded
                                size={100}
                                source={{ uri: user.image }}
                            />
                        </View>
                        <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]}>Select one option</Text>
                        <Text style={[styles.bodyText, { textAlign: 'center', color: 'black', marginBottom: theme.size(25) }]}>Select the correct option</Text>
                        {
                            moodList.map(mood => {
                                let borderBottom = this.state.selectedMood === mood.title ? { borderBottomWidth: 2, borderBottomColor: theme.colorPrimary } : null
                                return (
                                    <TouchableOpacity onPress={() => this.updateSelectedMood(mood.title)} style={[{ flexDirection: 'row', alignItems: "center" }, borderBottom]} key={mood.title}>
                                        {
                                            this.state.selectedMood === mood.title
                                                ?
                                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ backgroundColor: "blue", width: '15%', height: theme.size(70), justifyContent: "center" }}>
                                                    <Icon name="check" color="white" type="material-community" />
                                                </LinearGradient>
                                                :
                                                <View style={{ width: '15%', height: theme.size(70), justifyContent: "center" }} />
                                        }
                                        <Text style={[styles.bodyText, { color: theme.colorGrey, marginLeft: theme.size(15), width: "60%" }]}>
                                            {mood.title}
                                        </Text>
                                        <Icon name={mood.icon} color={this.state.selectedMood === mood.title ? theme.colorPrimary : "black"} type="material-community" size={50} />
                                    </TouchableOpacity>
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