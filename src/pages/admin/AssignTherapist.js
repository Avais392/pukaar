import React from "react";
import { TouchableOpacity, Text, View, Button, BackHandler, FlatList, Dimensions } from 'react-native';
import { styles, theme } from "../../styles";
import { Overlay, SearchBar, Badge, Icon, Avatar, Divider } from 'react-native-elements';
import debounce from "lodash/debounce";
import { http } from "../../util/http";
import Header from '../../components/Header';
import LinearGradient from "react-native-linear-gradient"
import session from '../../data/session';
import Snack from '../../components/Snackbar';

export default class AssignTherapist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            searchResults: [],
            patientId: props.navigation.getParam('patientId'),
            loading: true,
            page: 1,
            hasMore: false,
        }
        this.searchTherapists = debounce(this.searchTherapists, 500);
        this.fetchAllTherapists();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.patientId !== this.props.navigation.getParam('patientId')) {
            this.setState({ patientId: this.props.navigation.getParam('patientId') })
        }
    }

    fetchAllTherapists = async () => {
        const user = await session.getUser();
        http.get(`/admin/users/search?q=${this.state.query}&available=available&page=${this.state.page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                let totalPages;
                if (resp.data.data[0].metadata.length === 0) {
                    totalPages = 0;
                }
                else {
                    totalPages = Math.ceil(resp.data.data[0].metadata[0].total / resp.data.data[0].metadata[0].limit)
                }
                this.setState({
                    searchResults: resp.data.data[0].data,
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

    loadMore = async () => {
        if (this.state.hasMore) {
            let page = this.state.page + 1
            const user = await session.getUser()
            http.get(`/admin/users/search?q=${this.state.query}&available=available&page=${page}`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
                .then(resp => {
                    let totalPages;
                    if (resp.data.data[0].metadata.length === 0) {
                        totalPages = 0;
                    }
                    else {
                        totalPages = Math.ceil(resp.data.data[0].metadata[0].total / resp.data.data[0].metadata[0].limit)
                    }
                    this.setState({
                        searchResults: [...this.state.searchResults, ...resp.data.data[0].data],
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


    searchTherapists = async () => {
        const user = await session.getUser();
        http.get(`/admin/users/search?q=${this.state.query}&available=available&page=1`, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                let totalPages;
                if (resp.data.data[0].metadata.length === 0) {
                    totalPages = 0;
                }
                else {
                    totalPages = Math.ceil(resp.data.data[0].metadata[0].total / resp.data.data[0].metadata[0].limit)
                }
                this.setState({
                    searchResults: resp.data.data[0].data,
                    loading: false,
                    hasMore: totalPages > 1 ? true : false,
                    page: 1
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
    };

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
        this.props.navigation.goBack();
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    assignTherapist = async (therapistId) => {
        let id = this.state.patientId;
        const user = await session.getUser()
        http.post(`/admin/users/${id}/assign-therapist`, { therapistId }, { headers: { 'Authorization': `Bearer ${user.jwt}` } })
            .then(resp => {
                this.setState({ patientId: null, query: '', searchResults: [] })
                this.props.navigation.navigate('AdminUsers', { patientId: id })
                setTimeout(() => {
                    Snack("success", resp.data.message)
                }, 500)
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
                this.setState({ patientIndex: null })
            })
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.fillSpace}>
                    <Header title={'Loading'} changeDrawer={this.back} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
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
                    <Header title={'Assign therapist'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <SearchBar
                        placeholder={"Search"}
                        onChangeText={(query) => {
                            this.setState({ query });
                            this.searchTherapists();
                        }}
                        onClear={() => this.setState({ query: '' })}
                        value={this.state.query}
                        containerStyle={{ width: "100%", backgroundColor: "white", borderTopWidth: 0, borderBottomWidth: 0, borderRadius: 0, padding: 0 }}
                        lightTheme={true}
                        showLoading={this.state.loading}
                    />
                    <View style={{ flex: 1, width: '100%', justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            {
                                this.state.searchResults && this.state.searchResults.length > 0
                                    ?
                                    <FlatList
                                        data={this.state.searchResults}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <View style={{ flexDirection: 'row', marginTop: theme.size(30) }}>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Avatar
                                                            rounded
                                                            size={50}
                                                            source={{ uri: item.photo ? item.photo : ''}}
                                                        />
                                                    </View>
                                                    <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 10, width: '80%' }}>
                                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                            <Text style={[styles.h2, { marginVertical: theme.size(5) }]}>
                                                                {item.name}
                                                                <Badge status={item.available ? "success" : "warning"} containerStyle={{ width: 10, height: 10 }} />
                                                            </Text>
                                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: theme.size(-5) }}>
                                                                <Icon
                                                                    name='star'
                                                                    color='#F2BC3B'
                                                                    size={15}
                                                                />
                                                                <Text style={[styles.bodyText, { color: theme.colorGrey }]}>
                                                                    {
                                                                        item.rating.length > 0
                                                                            ?
                                                                            item.rating.reduce((acc, review) => acc + review.rating, 0) / item.rating.length
                                                                            :
                                                                            0
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <Text style={[styles.bodyText, { color: theme.colorGrey, marginTop: theme.size(5) }]}>{item.doctorType}</Text>
                                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginLeft: theme.size(-5) }}>
                                                            <Icon
                                                                name='map-marker-outline'
                                                                type='material-community'
                                                                size={15}
                                                                color={theme.colorGrey}
                                                            />
                                                            <Text style={[styles.bodyText, { color: theme.colorGrey, marginTop: theme.size(5) }]}>{item.address}</Text>
                                                        </View>
                                                        <TouchableOpacity style={{ width: "50%", marginTop: theme.size(5),alignItems:'flex-start' }} onPress={()=>this.assignTherapist(item._id)}>
                                                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ width: '70%', paddingHorizontal:20, paddingVertical:5,backgroundColor: theme.colorPrimary, borderRadius:5}} >
                                                            <Text style={[styles.subtitle,{color:'white', textAlign:'center'}]}>Assign</Text>
                                                            </LinearGradient>
                                                            
                                                        </TouchableOpacity>
                                                        <Divider style={{ marginVertical: theme.size(10), width: '100%' }} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                        onEndReached={this.loadMore}
                                        onEndReachedThreshold={1}
                                        keyExtractor={item => item.id}
                                    />
                                    :
                                    <Text style={[styles.h2, { textAlign: 'center', marginTop: theme.size(10) }]}>No Therapists Found</Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                                <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                        <Icon name="home-outline" color='white' type='material-community' />
                                        <Text style={[styles.subtitle, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                </ View>
            )
        }
    }

}