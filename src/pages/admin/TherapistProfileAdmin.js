import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Avatar, Divider, Icon, Button } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import Badge from '../../components/Badge'

export default class AdminUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.getParam('userId'),
            user: null,
            loading: true,
            loggedinUser: props.navigation.getParam('user')
        };
        this.getUser(props.navigation.getParam('userId'))
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

    getUser = (id) => {
        http.get(`/admin/therapists/${id}`, { headers: { 'Authorization': `Bearer ${this.state.loggedinUser.jwt}` } })
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
        if (prevState.userId !== this.props.navigation.getParam('userId')) {
            this.setState({ userId: this.props.navigation.getParam('userId'), loading: true })
            this.getUser(this.props.navigation.getParam('userId'));
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    updateProfile = (services, focus, name, about, address, phone, available, doctorType, avatarSource) => {
        let user = { services, focus, name, about, address, phone, available, doctorType, photo: avatarSource };
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
                    <Header title={'Therapist profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: theme.size(30) }}>
                                <Avatar
                                    rounded
                                    size={100}
                                    source={{ uri: user.photo ? user.photo : ''}}
                                />
                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                    <Text style={[styles.subtitle, { textAlign: "right", color: theme.colorStatus }]} >{this.state.user.available ? 'Available' : 'Away'}</Text>
                                    <Text style={[styles.h1, { fontFamily: theme.font.regular }]}>{user.name}</Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: theme.size(-5) }}>
                                        <Icon
                                            name='map-marker-outline'
                                            type='material-community'
                                            size={15}
                                            color={theme.colorGrey}
                                        />
                                        <Text style={[styles.h2, { color: theme.colorGrey }]}>{this.state.user.address}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: theme.size(-5) }}>
                                        <Icon
                                            name='star'
                                            color='#F2BC3B'
                                        />
                                        <Text style={[styles.subtitle, { color: theme.colorGrey }]}>{this.state.user.averageRating.toFixed(1)} | {this.state.user.totalRatings} reviews</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Button icon={{ name: "pencil-outline", type: 'material-community', size: 15, color: "white" }}
                                            title="Edit profile" iconRight={true}
                                            onPress={() => this.props.navigation.navigate('EditTherapistProfileAdmin', { user: this.state.user, back: 'TherapistProfileAdmin', updateProfile: this.updateProfile, jwt: this.state.loggedinUser.jwt })}
                                            buttonStyle={{ borderRadius: 5 }}
                                            containerStyle={{ marginVertical: theme.size(10) }}
                                            ViewComponent={LinearGradient}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} />
                            <View style={{ marginTop: theme.size(20), marginLeft: '10%', width: '80%', flexDirection: 'column' }}>
                                <Text style={[styles.h2, { color: theme.colorPrimary, fontFamily: theme.font.regular }]}>
                                    About
                                </Text>
                                <Text style={[styles.bodyText, { color: theme.colorGrey, marginLeft: theme.size(10), fontFamily: theme.font.regular }]}>
                                    {this.state.user.about}
                                </Text>
                            </View>
                            <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} />
                            <View style={{ marginTop: theme.size(20), marginLeft: '10%', width: '90%', flexDirection: 'column' }}>
                                <Text style={[styles.subtitle, { color: theme.colorPrimary, fontFamily: theme.font.regular }]}>
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