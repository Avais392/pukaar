import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { styles, theme } from "../../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import RequestModal from '../../components/RequestModal';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';
import { types as requestTypes } from '../../util/enums/requestTypes';

export default class Requests extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchToggle: false, // searching for assigned
            toggleTitle: 'Change therapist requests',
            users: [],
            loading: true,
            page: 1,
            hasMore: false,
            requestModalVisible: false,
            reason: '',
            user: {
                photo: '',
                name: ''
            }, //to pass to request modal
            type: '',
            index: null
        };
        this.getUsers(false, 1);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.back();
        return true
    }

    getUsers = async (searchToggle, page) => {
        let sorted = !searchToggle ? 'user' : 'therapist'
        const user = await session.getUser();
        http.get(`/admin/users/requests?type=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
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

    back = () => {
        this.props.navigation.goBack()
    }


    toggleChange = () => {
        let title = this.state.searchToggle ? 'Change therapist requests' : 'Change availablity requests'
        this.setState({ searchToggle: !this.state.searchToggle, toggleTitle: title, loading: true })
        this.getUsers(!this.state.searchToggle, 1);
    }

    loadMore = async () => {
        if (this.state.hasMore) {
            let sorted = !searchToggle ? 'user' : 'therapist'
            let page = this.state.page + 1
            const user = await session.getUser()
            http.get(`/admin/users/requests?type=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
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

    updateVisible = (index, type) => {
        if (type === 'remove') {
            this.setState({
                requestModalVisible: !this.state.requestModalVisible,
            })
        }
    }

    acceptRequest = async () => {
        if (this.state.type === requestTypes.changeTherapist) {
            const user = await session.getUser()
            let id = this.state.users[this.state.index].creator._id
            // http.put(`/admin/requests/${id}/remove-therapist`, { headers: { 'Authorization': `Bearer ${yuser.jwt}` } })
            //     .then(resp => {
            //         let array = [...this.state.users];
            //         array.splice(this.state.patientIndex, 1);
            //         this.setState({
            //             reason: '',
            //             user: '',
            //             type: '',
            //             requestModalVisible: false,
            //             index: null
            //         })
            //         setTimeout(() => {
            //             Snack("success", resp.data.message)
            //         }, 500)
            //     })
            //     .catch(err => {
            //         this.setState({
            //             reason: '',
            //             user: '',
            //             type: '',
            //             requestModalVisible: false,
            //             index: null
            //         })
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
        else {
            // to:do after change availability in therapist
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Requests'} changeDrawer={this.back} icon={'arrow-back'} customStyles={{ paddingTop: theme.size(0), height: theme.size(56) }} iconRight={'exit-to-app'} logout={this.logout} />
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
                    <Header title={'Requests'} changeDrawer={this.back} icon={'arrow-back'} customStyles={{ paddingTop: theme.size(0), height: theme.size(56) }} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        <ListItem
                            style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                            title={this.state.toggleTitle}
                            switch={{ value: this.state.searchToggle, onChange: this.toggleChange }}
                            onPress={() => this.toggleChange()}
                        />
                        {
                            this.state.users && this.state.users.length > 0
                                ?
                                <FlatList
                                    data={this.state.users}
                                    renderItem={({ item, index }) => {
                                        return <ListItem
                                            style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                            key={item.id}
                                            leftAvatar={{ source: { uri: item.creator.photo } }}
                                            title={item.creator.name}
                                            bottomDivider
                                            onPress={() => {
                                                this.setState({
                                                    reason: item.reason,
                                                    user: item.creator.therapist,
                                                    type: item.type,
                                                    requestModalVisible: true,
                                                    index: index
                                                })
                                            }}
                                        // subtitle={!this.state.searchToggle ? item.creator.therapist.name : null}
                                        />
                                    }}
                                    onEndReached={this.loadMore}
                                    onEndReachedThreshold={500}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <Text style={[styles.h2, { textAlign: 'center' }]}>No Requests Found</Text>
                        }
                        <RequestModal
                            visible={this.state.requestModalVisible}
                            updateVisible={this.updateVisible}
                            title={this.state.toggleTitle ? 'Change therapist' : 'Change availability'}
                            message={'Are you sure you want to'}
                            accept={this.acceptRequest}
                            data={{ reason: this.state.reason, type: this.state.type, user: this.state.user }}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                    <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                            <Icon name="home-outline" color='white' type='material-community' />
                                            <Text style={[styles.bodyText, { color: theme.colorAccent }]}>Home</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </View>
            )
        }

    }
}