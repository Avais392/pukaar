import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, TouchableOpacity, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';

export default class AssignedUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: true,
            page: 1,
            hasMore: false,
            user: props.navigation.getParam('user')
        };
        this.getUsers(1);
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

    getUsers = async (page) => {
        const user = await session.getUser()
        http.get(`/therapists/list?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                this.setState({
                    users: resp.data.data.docs,
                    loading: false,
                    hasMore: resp.data.data.pages > 1 ? true : false
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

    goBack = () => {
        this.props.navigation.goBack()
    }

    loadMore = async () => {
        const user = await session.getUser()
        if (this.state.hasMore) {
            let page = this.state.page + 1
            http.get(`/therapists/list?page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    this.setState({
                        users: [...this.state.users, ...resp.data.data.docs],
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

    selectItem = (index) => {
        this.setState({ selectedItem: index === this.state.selectedItem ? null : index })
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Assigned users'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "flex-end" }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '11%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'Dashboard' })}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'Dashboard' })} style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
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
                    <Header title={'Assigned users'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '5%', width: '100%', backgroundColor: '#f6f6f6' }} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        {
                            this.state.users && this.state.users.length > 0
                                ?
                                <FlatList
                                    data={this.state.users}
                                    renderItem={({ item, index }) => {
                                        if (index === this.state.selectedItem) {
                                            return (
                                                <View style={{ flexDirection: 'column' }}>
                                                    <ListItem
                                                        style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                        key={item}
                                                        leftAvatar={{ source: { uri: item.photo } }}
                                                        title={item.name}
                                                        titleStyle={styles.subtitle}
                                                        bottomDivider
                                                        onPress={() => this.selectItem(index)}
                                                    />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', margin: 10 }}>
                                                        <TouchableOpacity style={{ width: '33.3%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientProfile', { userId: item._id, back: 'AssignedUsers', user: this.state.user })}>
                                                            <Icon name="account-circle-outline" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>Profile</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width: '33.3%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientNotes', { userId: item._id, jwt: this.state.user.jwt })}>
                                                            <Icon name="emoticon-happy-outline" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>Mood</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width: '33.3%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientDiaryTherapist', { userId: item._id, user: this.state.user })}>
                                                            <Icon name="book-open-outline" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>History</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }
                                        else {
                                            return <ListItem
                                                style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                key={item.id}
                                                leftAvatar={{ source: { uri: item.photo } }}
                                                title={item.name}
                                                titleStyle={styles.subtitle}
                                                bottomDivider
                                                onPress={() => this.selectItem(index)}
                                            />
                                        }
                                    }}
                                    onEndReached={this.loadMore}
                                    onEndReachedThreshold={500}
                                    keyExtractor={item => item.id}
                                />
                                // <FlatList
                                //     data={this.state.users}
                                //     renderItem={({ item, index }) => {
                                //         return <ListItem
                                //             style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                //             key={item.id}
                                //             leftAvatar={{ source: { uri: item.photo } }}
                                //             title={item.name}
                                //             bottomDivider
                                //             onPress={() => this.props.navigation.navigate('PatientProfile', { userId: item._id, back: 'AssignedUsers', user: this.state.user })}
                                //         />
                                //     }}
                                //     onEndReached={this.loadMore}
                                //     onEndReachedThreshold={500}
                                //     keyExtractor={item => item.id}
                                // />
                                :
                                <Text style={[styles.h2, { textAlign: 'center' }]}>No Users Found</Text>
                        }
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '11%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '100%', width: '100%' }}>
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('TherapistProfile', { jwt: this.state.user.jwt, back: 'AssignedUsers' })}>
                                        <Icon name="account-circle-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '50%' }} onPress={() => this.props.navigation.navigate('Dashboard')}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
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