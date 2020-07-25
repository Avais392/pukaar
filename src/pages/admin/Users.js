import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import ConfirmationModal from '../../components/ConfirmationModal';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';

export default class AdminUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            searchToggle: false, // searching for assigned
            toggleTitle: 'List of unassigned users',
            removeTherapistModalVisible: false,
            patientIndex: null,
            users: [],
            loading: true,
            page: 1,
            hasMore: false,
            user: props.navigation.getParam('user'),
            removeTherapistName: '',
            removeTherapistPic: '',
            assignTherapistId: null
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

    componentDidUpdate(prevProps, prevState) {
        if (this.props.navigation.getParam('patientId') !== this.state.assignTherapistId && this.state.searchToggle) {
            let index = null;
            for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i]._id === this.props.navigation.getParam('patientId')) {
                    index = i;
                }
            }
            if (index !== null) {
                let array = [...this.state.users];
                array.splice(index, 1);
                this.setState({ users: array, assignTherapistId: this.props.navigation.getParam('patientId') })
            }
            // this.setState({ assignTherapistId: this.props.navigation.getParam('patientId') })
        }
    }


    getUsers = (searchToggle, page) => {
        let sorted = !searchToggle ? 'assigned' : 'unassigned'
        http.get(`/users/list?sorted=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
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
        // this.props.navigation.navigate('Dashboard')
    }

    selectItem = (index) => {
        this.setState({ selectedItem: index === this.state.selectedItem ? null : index })
    }

    toggleChange = () => {
        let title = this.state.searchToggle ? 'List of unassigned users' : 'List of unassigned users'
        this.setState({ searchToggle: !this.state.searchToggle, toggleTitle: title, selectedItem: null, loading: true })
        this.getUsers(!this.state.searchToggle, 1);
    }


    removeTherapist = () => {
        let id = this.state.users[this.state.patientIndex]._id
        http.delete(`/admin/users/${id}/remove-therapist`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
            .then(resp => {
                let array = [...this.state.users];
                array.splice(this.state.patientIndex, 1);
                this.setState({ removeTherapistModalVisible: false, patientIndex: null, users: array })
                setTimeout(() => {
                    Snack("success", resp.data.message)
                }, 500)
            })
            .catch(err => {
                this.setState({ removeTherapistModalVisible: false, patientIndex: null })
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

    updateVisible = (index, type) => {
        if (type === 'remove') {
            this.setState({
                removeTherapistModalVisible: !this.state.removeTherapistModalVisible,
                patientIndex: index
            })
        }
    }

    loadMore = () => {
        if (this.state.hasMore) {
            let sorted = !this.state.searchToggle ? 'assigned' : 'unassigned'
            let page = this.state.page + 1
            http.get(`/users/list?sorted=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
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

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Users'} changeDrawer={this.back} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "flex-end" }}>
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
                </ View>
            )
        }
        else {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Users'} changeDrawer={this.back} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        <ListItem
                            style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                            title={this.state.toggleTitle}
                            switch={{ value: this.state.searchToggle, onChange: this.toggleChange }}
                            onPress={() => this.toggleChange()}
                            titleStyle={styles.subtitle}
                        />
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
                                                        leftAvatar={{ source: { uri: item.photo ? item.photo : '' } }}
                                                        title={item.name}
                                                        titleStyle={styles.subtitle}
                                                        subtitleStyle={{ fontFamily: theme.font.regular }}
                                                        bottomDivider
                                                        onPress={() => this.selectItem(index)}
                                                        subtitle={!this.state.searchToggle ? item.therapist.name : null}
                                                        rightIcon={this.state.searchToggle ? { name: 'add', onPress: () => this.props.navigation.navigate('AssignTherapist', { patientId: item._id }) } : { name: 'close', onPress: () => { this.setState({ removeTherapistName: item.therapist.name, removeTherapistPic: item.therapist.photo }); this.updateVisible(index, 'remove') } }}
                                                    />
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', margin: 10 }}>
                                                        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientProfile', { userId: item._id, back: 'AdminUsers', user: this.state.user })}>
                                                            <Icon name="account-circle-outline" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>Profile</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientDiary', { userId: item._id })}>
                                                            <Icon name="book-open" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>Diary</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('PatientChat', { userId: item._id, rightIcon: item.photo, userName: item.name })}>
                                                            <Icon name="forum-outline" type="material-community" size={20} />
                                                            <Text style={styles.subtitle}>Chat</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                        }
                                        else {
                                            return <ListItem
                                                style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                key={item.id}
                                                leftAvatar={{ source: { uri: item.photo ? item.photo : '' } }}
                                                title={item.name}
                                                titleStyle={styles.subtitle}
                                                bottomDivider
                                                onPress={() => this.selectItem(index)}
                                                subtitle={!this.state.searchToggle ? item.therapist.name : null}
                                                subtitleStyle={{ fontFamily: theme.font.regular }}
                                                rightIcon={this.state.searchToggle ? { name: 'add', onPress: () => this.props.navigation.navigate('AssignTherapist', { patientId: item._id }) } : { name: 'close', onPress: () => { this.setState({ removeTherapistName: item.therapist.name, removeTherapistPic: item.therapist.photo }); this.updateVisible(index, 'remove') } }}
                                            />
                                        }
                                    }}
                                    onEndReached={this.loadMore}
                                    onEndReachedThreshold={500}
                                    keyExtractor={item => item.id}
                                />
                                :
                                <Text style={[styles.h2, { textAlign: 'center' }]}>No Users Found</Text>
                        }
                        <ConfirmationModal
                            visible={this.state.removeTherapistModalVisible}
                            updateVisible={this.updateVisible}
                            message={'Are you sure you want to'}
                            title={'Remove Therapist'}
                            removeTherapist={this.removeTherapist}
                            data={{ name: this.state.removeTherapistName, photo: this.state.removeTherapistPic }}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                    <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                            <Icon name="home-outline" color='white' type='material-community' />
                                            <Text style={[styles.subtitle, { color: theme.colorAccent }]}>Home</Text>
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