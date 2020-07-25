import React, { Component, useReducer } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Avatar, Divider, Icon, Button, AirbnbRating } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import Input from "../../components/Input";

import Badge from '../../components/Badge'
export default class TherapistProfileUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true,
            review: '',
            rating: 3,
            buttonLoading: false,
            reviewGiven: false
        };
        this.getUser()
    }

    getUser = async () => {
        const user = await session.getUser();
        const config = { headers: { 'Authorization': `Bearer ${user.jwt}` } }
        http.get(`/users/therapist-profile`, config)
            .then(resp => {
                if (resp.data.data.therapist) {
                    this.setState({
                        user: resp.data.data.therapist,
                        loading: false,
                        reviewGiven: resp.data.data.review ? true : false,
                        review: resp.data.data.review
                    })
                }
                else {
                    this.setState({
                        user: null,
                        loading: false
                    })
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
        this.props.navigation.goBack();
        return true
    }

    onChange = (value, property) => {
        this.setState({ [property]: value })
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    submitReview = async () => {
        if (this.state.review.length === 0) {
            Snack('error', 'Rewview cant be empty')
        }
        else {
            const user = await session.getUser();
            const config = { headers: { 'Authorization': `Bearer ${user.jwt}` } }
            const { rating, review } = this.state;
            let therapistId = this.state.user._id
            this.setState({ buttonLoading: true })
            http.post('/users/add-review', { therapistId, rating, review }, config)
                .then((resp) => {
                    Snack("success", "Review added successfully")
                    this.setState({ review: { review, rating }, buttonLoading: false, rating: 3, reviewGiven: true })
                })
                .catch(err => {
                    this.setState({ buttonLoading: false })
                    if (err.response) {
                        Snack("error", err.response.data.error)
                        return false
                    }
                    else {
                        Snack("error", "Unknown error occured, please contact an Admin");
                        return false
                    }
                })
        }
    }

    goToChat = async () => {
        const user = await session.getUser();
        this.props.navigation.navigate('UserChat', { user: user })
    }

    render() {
        if (this.state.loading) {
            return null
        }
        else {
            const { user } = this.state;
            if (user) {
                return (
                    <View style={styles.fillSpace}>
                        <Header title={'Therapist profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                        <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: theme.size(30) }}>
                                    <Avatar
                                        rounded
                                        size={100}
                                        source={{ uri: user.photo }}
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
                                <Divider style={{ marginTop: theme.size(20), height: theme.size(1), width: '100%' }} />
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
                                </View>
                                <Divider style={{ marginTop: theme.size(100), height: theme.size(1), width: '100%' }} /> */}
                                <View style={{ height: '15%', marginTop: theme.size(20), width: '100%', flexDirection: 'column', marginBottom: theme.size(50) }}>
                                    {
                                        this.state.reviewGiven
                                            ?
                                            <>
                                                <View style={{ marginLeft: "15%", alignItems: "flex-start", marginTop: theme.size(20) }}>
                                                    <AirbnbRating
                                                        count={5}
                                                        defaultRating={this.state.rating}
                                                        size={25}
                                                        showRating={false}
                                                        readOnly={true}
                                                    />
                                                </View>
                                                <View style={{ marginLeft: "15%", width: "80%", alignItems: "flex-start", marginBottom: theme.size(10) }}>
                                                    <Input placeholder={"Write your review here..."} onChange={this.onChange} propertyName={'review'} multiline={true} numberOfLines={5} value={this.state.review.review} editable={false} />
                                                </View>
                                            </>
                                            :
                                            <>
                                                <Text style={[styles.bodyText, { marginLeft: "10%" }]}>
                                                    Review your therapist/counsellor
                                                </Text>
                                                <View style={{ marginLeft: "15%", alignItems: "flex-start", marginTop: theme.size(20) }}>
                                                    <AirbnbRating
                                                        count={5}
                                                        defaultRating={this.state.rating}
                                                        size={25}
                                                        showRating={false}
                                                    />
                                                </View>
                                                <View style={{ marginLeft: "15%", width: "80%", alignItems: "flex-start", marginBottom: theme.size(10) }}>
                                                    <Input placeholder={"Write your review here..."} onChange={this.onChange} propertyName={'review'} multiline={true} numberOfLines={5} value={this.state.review} />
                                                </View>
                                                <View style={{ marginLeft: "15%", width: "80%", alignItems: "flex-start" }}>
                                                    <Button title="Add review +" onPress={() => this.submitReview()} ViewComponent={LinearGradient}
                                                        containerStyle={{ width: '100%' }} loading={this.state.buttonLoading}
                                                    />
                                                </View>
                                            </>
                                    }
                                </View>
                                <Divider style={{ marginTop: theme.size(100), height: theme.size(1), width: '100%' }} />
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Therapist</Text>
                                    </View>
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
            else {
                return (
                    <View style={styles.fillSpace}>
                        <Header title={'Therapist Profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', alignItems: "center" }}>
                            <Text style={[styles.h2, { color: theme.colorPrimary }]}>
                                No therapist assigned to you currently
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Therapist</Text>
                                    </View>
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
    }
}