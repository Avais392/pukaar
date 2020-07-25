import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, BackHandler, Dimensions } from 'react-native';
import { styles, theme } from "../../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../../components/Header';
import ConfirmationModal from '../../components/ConfirmationModal';
import { http } from "../../util/http";
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import LinearGradient from 'react-native-linear-gradient';

export default class AdminTherapists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchToggle: false, // searching for assigned
            toggleTitle: 'List of unavailable therapists',
            confirmationModalVisible: false,
            therapistIndex: null,
            users: [],
            loading: true,
            page: 1,
            hasMore: false,
            user: props.navigation.getParam('user'),
            therapistName: '', //to change status
            therapistPic: '' //to change status
        };
        this.getTherapists(false, 1);
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
        this.props.navigation.navigate('Dashboard')
    }

    getTherapists = (searchToggle, page) => {
        let sorted = !searchToggle ? 'available' : 'unavailable'
        http.get(`/admin/therapists/list?available=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
            .then(resp => {
                let totalPages;
                if (resp.data.data[0].metadata.length === 0) {
                    totalPages = 0;
                }
                else {
                    totalPages = Math.ceil(resp.data.data[0].metadata[0].total / resp.data.data[0].metadata[0].limit)
                }
                this.setState({
                    users: resp.data.data[0].data,
                    loading: false,
                    hasMore: totalPages > 1 ? true : false
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

    selectItem = (index) => {
        this.setState({ selectedItem: index === this.state.selectedItem ? null : index })
    }

    toggleChange = () => {
        let title = this.state.searchToggle ? 'List of unavailable therapists' : 'List of unavailable therapists'
        this.setState({ searchToggle: !this.state.searchToggle, toggleTitle: title, selectedItem: null, loading: true, page: 1 })
        this.getTherapists(!this.state.searchToggle, 1);
    }

    updateTherapistAvailability = () => {
        let id = this.state.users[this.state.therapistIndex]._id
        let available = this.state.searchToggle;
        http.put(`/admin/therapists/${id}/availability`, { available }, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
            .then(resp => {
                let array = [...this.state.users];
                array.splice(this.state.therapistIndex, 1);
                this.setState({ confirmationModalVisible: false, therapistIndex: null, users: array })
                setTimeout(() => {
                    Snack("success", resp.data.message)
                }, 500)
            })
            .catch(err => {
                this.setState({ confirmationModalVisible: false, therapistIndex: null })
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
                confirmationModalVisible: !this.state.confirmationModalVisible,
                therapistIndex: index
            })
        }
    }

    loadMore = () => {
        if (this.state.hasMore) {
            let sorted = !this.state.searchToggle ? 'available' : 'unavailable'
            let page = this.state.page + 1
            http.get(`/admin/therapists/list?available=${sorted}&page=${page}`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
                .then(resp => {
                    let totalPages;
                    if (resp.data.data[0].metadata.length === 0) {
                        totalPages = 0;
                    }
                    else {
                        totalPages = Math.ceil(resp.data.data[0].metadata[0].total / resp.data.data[0].metadata[0].limit)
                    }
                    this.setState({
                        users: [...this.state.users, ...resp.data.data[0].data],
                        hasMore: totalPages > page ? true : false,
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
                    <Header title={'Therapists'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
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
                    <Header title={'Therapists'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        {
                            this.state.users && this.state.users.length > 0
                                ?
                                <>
                                    <ListItem
                                        style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                        title={this.state.toggleTitle}
                                        switch={{ value: this.state.searchToggle, onChange: this.toggleChange }}
                                        onPress={() => this.toggleChange()}
                                        titleStyle={styles.subtitle}
                                    />
                                    <FlatList
                                        data={this.state.users}
                                        renderItem={({ item, index }) => {
                                            if (index === 0) {
                                                return <>
                                                    <ListItem
                                                        style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                        leftAvatar={{ icon: { name: 'add' } }}
                                                        title={"Add a new therapist"}
                                                        bottomDivider
                                                        onPress={() => this.props.navigation.navigate('AddTherapist')}
                                                        titleStyle={styles.subtitle}
                                                        subtitleStyle={{ fontFamily: theme.font.regular }}
                                                    />
                                                    <ListItem
                                                        style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                        key={item.id}
                                                        leftAvatar={{ source: { uri: item.photo ? item.photo : ''} }}
                                                        title={item.name}
                                                        titleStyle={styles.subtitle}
                                                        subtitleStyle={{ fontFamily: theme.font.regular }}
                                                        bottomDivider
                                                        onPress={() => this.props.navigation.navigate('TherapistProfileAdmin', { userId: item._id, back: 'AdminTherapists', user: this.state.user })}
                                                        subtitle={
                                                            <View>
                                                                <Text style={[styles.subtitle, { fontSize: theme.size(14), color: theme.colorGrey }]}>Patient treated: {item.patientsTreated}</Text>
                                                                <Text style={[styles.subtitle, { fontSize: theme.size(14), color: theme.colorGrey }]}>Currently treating: {item.currentlyTreating}</Text>
                                                            </View>
                                                        }
                                                        rightIcon={this.state.searchToggle ? { name: 'eye-off-outline', type: 'material-community', onPress: () => { this.setState({ therapistName: item.name, therapistPic: item.photo }); this.updateVisible(index, 'remove') } } : { name: 'eye-outline', type: 'material-community', onPress: () => { this.setState({ therapistName: item.name, therapistPic: item.photo }); this.updateVisible(index, 'remove') } }}
                                                    />
                                                </>
                                            }
                                            else {
                                                return <ListItem
                                                    style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                                    key={item.id}
                                                    leftAvatar={{ source: { uri: item.photo ? item.photo : ''} }}
                                                    title={item.name}
                                                    titleStyle={styles.subtitle}
                                                    subtitleStyle={{ fontFamily: theme.font.regular }}
                                                    bottomDivider
                                                    onPress={() => this.props.navigation.navigate('TherapistProfileAdmin', { userId: item._id, back: 'AdminTherapists', user: this.state.user })}
                                                    subtitle={
                                                        <View>
                                                            <Text style={[styles.subtitle, { fontSize: theme.size(14), color: theme.colorGrey }]}>Patient treated: {item.patientsTreated}</Text>
                                                            <Text style={[styles.subtitle, { fontSize: theme.size(14), color: theme.colorGrey }]}>Currently treating: {item.currentlyTreating}</Text>
                                                        </View>
                                                    }
                                                    rightIcon={this.state.searchToggle ? { name: 'eye-off-outline', type: 'material-community', onPress: () => { this.setState({ therapistName: item.name, therapistPic: item.photo }); this.updateVisible(index, 'remove') } } : { name: 'eye-outline', type: 'material-community', onPress: () => { this.setState({ therapistName: item.name, therapistPic: item.photo }); this.updateVisible(index, 'remove') } }}
                                                />
                                            }
                                        }}
                                        onEndReached={this.loadMore}
                                        onEndReachedThreshold={500}
                                        keyExtractor={item => item.id}
                                    />
                                </>
                                :
                                <>
                                    <View>
                                        <ListItem
                                            style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                            title={this.state.toggleTitle}
                                            switch={{ value: this.state.searchToggle, onChange: this.toggleChange }}
                                            onPress={() => this.toggleChange()}
                                        />
                                        <ListItem
                                            style={{ borderLeftColor: theme.colorGrey, borderLeftWidth: theme.size(5) }}
                                            leftAvatar={{ icon: { name: 'add' } }}
                                            title={"Add a new therapist"}
                                            bottomDivider
                                            onPress={() => this.props.navigation.navigate('AddTherapist')}
                                        />
                                    </View>
                                    <Text style={[styles.h2, { textAlign: 'center' }]}>No Therapists Found</Text>
                                </>
                        }
                        <ConfirmationModal
                            visible={this.state.confirmationModalVisible}
                            updateVisible={this.updateVisible}
                            message={'Are you sure you want to change'}
                            title={'Therapist status'}
                            removeTherapist={this.updateTherapistAvailability}
                            data={{ name: this.state.therapistName, photo: this.state.therapistPic }}
                        />
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
                </View>
            )
        }
    }
}