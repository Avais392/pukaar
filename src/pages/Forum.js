import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, TouchableOpacity } from 'react-native';
import { styles, theme } from "../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../components/Header';
import { http } from "../util/http";
import Snack from '../components/Snackbar';
import session from '../data/session';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'react-moment';
import CommentBadge from '../components/CommentBadge';

let date = new Date()
let date2 = new Date()
date2.setDate(date2.getDate() - 1)
let posts = [
    {
        id: 1,
        author: "Jon snow",
        description: "I know nothing seriously.",
        time: "4:50 pm",
        comments: 150,
        authorPhoto: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        date: date
    },
    {
        id: 2,
        author: "!Jon snow",
        description: "I know everything seriously.",
        time: "10:50 pm",
        comments: 427,
        authorPhoto: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
        date: date2
    }
]
let currentDate = null;

export default class Forum extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: false,
            page: 1,
            hasMore: false,
            user: props.navigation.getParam('user')
        };
        this.getPosts(1);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.goBack();
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    getPosts = async (page) => {
        const user = await session.getUser()
        // http.get(`/therapists/list?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
        //     .then(resp => {
        //         this.setState({
        //             posts: resp.data.data.docs,
        //             loading: false,
        //             hasMore: resp.data.data.pages > 1 ? true : false
        //         })
        //     })
        //     .catch(err => {
        //         if (err.response) {
        //             setTimeout(() => {
        //                 Snack("error", err.response.data.error)
        //             }, 500)
        //         }
        //         else {
        //             setTimeout(() => {
        //                 Snack("error", "Unknown error occured, please contact an Admin")
        //             }, 500)
        //         }
        //     })
    }

    loadMore = async () => {
        const user = await session.getUser()
        if (this.state.hasMore) {
            let page = this.state.page + 1
            http.get(`/therapists/list?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    this.setState({
                        posts: [...this.state.posts, ...resp.data.data.docs],
                        hasMore: resp.data.data.pages > page ? true : false,
                        page: page
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

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'View post'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{ paddingTop: theme.size(0), height: theme.size(56) }} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "flex-end" }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '11%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('TherapistProfileUser')}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Therapist</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => alert('make this later')}>
                                        <Icon name="forum-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Chat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View >
            )
        }
        else {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'View post'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{ paddingTop: theme.size(0), height: theme.size(56) }} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        {
                            // this.state.posts && this.state.posts.length > 0
                            posts && posts.length > 0
                                ?
                                <FlatList
                                    data={posts}
                                    renderItem={({ item, index }) => {
                                        if (item.date !== currentDate) {
                                            currentDate = item.date
                                            return (
                                                <>
                                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#f6f6f6' }}>
                                                        <Moment style={[{ paddingVertical: theme.size(20), color: theme.colorGrey, marginLeft: theme.size(15) }]} format="DD-MM-YYYY" element={Text} >{item.date}</Moment>
                                                    </View>
                                                    <ListItem
                                                        style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                        key={item.id}
                                                        leftAvatar={{ source: { uri: item.authorPhoto } }}
                                                        title={`${item.author} | ${item.time}`}
                                                        bottomDivider
                                                        subtitle={item.description}
                                                        rightElement={CommentBadge(item.comments)}
                                                    />
                                                </>
                                            )
                                        }
                                        else {
                                            return <ListItem
                                                style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                key={item.id}
                                                leftAvatar={{ source: { uri: item.authorPhoto } }}
                                                title={`${item.author} | ${item.time}`}
                                                bottomDivider
                                                subtitle={item.description}
                                                rightElement={CommentBadge(item.comments)}
                                            />
                                        }

                                    }}
                                    // onEndReached={this.loadMore}
                                    // onEndReachedThreshold={500}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <Text style={[styles.h2, { textAlign: 'center' }]}>No Posts Found</Text>
                        }
                        <View style={{ height: '11%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: 50, width: 50, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                <Icon name="add" color='white' onPress={() => alert('hah')} />
                            </LinearGradient>
                        </View>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '11%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('TherapistProfileUser')}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Therapist</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => alert('make this later')}>
                                        <Icon name="forum-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Chat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '33.3%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Home</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            )
        }

    }
}