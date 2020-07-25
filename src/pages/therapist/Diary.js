import React, { Component, useReducer } from 'react';
import { View, TouchableOpacity, Text, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from "../../styles";
import { Icon } from 'react-native-elements';
import Header from '../../components/Header';
import { http } from "../../util/http";

import { PieChart } from 'react-native-svg-charts'
import { Text as Textt } from 'react-native-svg'
import Snack from '../../components/Snackbar';
import session from '../../data/session';
import Moment from 'react-moment';
import LinearGradient from 'react-native-linear-gradient';


export default class PatientDiary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: props.navigation.getParam('userId'),
            user: props.navigation.getParam('user'),
            loading: true,
            data: null,
            moodsTaken: '00',
            firstNote: null,
            positiveEntries: 0,
            negativeEntries: 0,
        };
        this.getDiary(props.navigation.getParam('userId'))
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

    getDiary = async (id) => {
        http.get(`/therapists/${id}/diary`, { headers: { 'Authorization': `Bearer ${this.state.user.jwt}` } })
            .then(resp => {
                if (resp.data.data.length > 0) {
                    let positiveEntries = 0, negativeEntries = 0;
                    let moods = resp.data.data;
                    for (let i = moods.length - 1; i >= 0; i--) {
                        let sum = moods[i].energy + moods[i].anxiety + moods[i].confidence
                        if (sum > 0) {
                            positiveEntries++
                        }
                        else {
                            negativeEntries++;
                        }
                    }
                    let energy = resp.data.data.reduce((acc, item) => acc + item.energy, 0) >= 0 ? resp.data.data.reduce((acc, item) => acc + item.energy, 0) : 0
                    let anxiety = resp.data.data.reduce((acc, item) => acc + item.anxiety, 0) >= 0 ? resp.data.data.reduce((acc, item) => acc + item.anxiety, 0) : 0
                    let confidence = resp.data.data.reduce((acc, item) => acc + item.confidence, 0) >= 0 ? resp.data.data.reduce((acc, item) => acc + item.confidence, 0) : 0
                    let data = [];
                    if (energy > 0) {
                        data.push({
                            key: 1,
                            amount: energy,
                            svg: { fill: '#C70039' },
                            label: 'Energy'
                        })
                    }
                    if (anxiety > 0) {
                        data.push({
                            key: 2,
                            amount: anxiety,
                            svg: { fill: '#44CD40' },
                            label: 'Anxiety'
                        })
                    }
                    if (confidence > 0) {
                        data.push({
                            key: 3,
                            amount: confidence,
                            svg: { fill: '#808080' },
                            label: 'Confidence'
                        })
                    }
                    this.setState({
                        data: data, loading: false,
                        moodsTaken: resp.data.data.length,
                        firstNote: resp.data.data[resp.data.data.length - 1].createdAt,
                        positiveEntries,
                        negativeEntries
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userId !== this.props.navigation.getParam('userId')) {
            this.setState({ data: null, moodsTaken: '00', firstNote: null, userId: this.props.navigation.getParam('userId'), loading: true })
            this.getDiary(this.props.navigation.getParam('userId'));
        }
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    render() {
        let Labels;
        if (this.state.data) {
            Labels = ({ slices, height, width }) => {
                return slices.map((slice, index) => {
                    const { labelCentroid, pieCentroid, data } = slice;
                    return (
                        <Textt
                            key={index}
                            x={pieCentroid[0]}
                            y={pieCentroid[1]}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={20}
                        >
                            {data.amount}
                        </Textt>
                    )
                })
            }
        }

        return (
            <View style={styles.fillSpace}>
                <Header title={'Moods Average'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <View style={{ flex: 1, width: '100%' }}>
                    <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary, marginTop: theme.size(10) }]}>Emotional History</Text>
                    <Text style={[styles.bodyText, { textAlign: 'center', marginTop: theme.size(2) }]}>Moods average</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "30%", justifyContent: "flex-end", marginLeft: "2%" }}>
                            {
                                this.state.data
                                    ?
                                    this.state.data.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: "row", alignItems: "center" }} key={index}>
                                                <View style={{ backgroundColor: item.svg.fill, height: theme.size(12), width: theme.size(12) }} />
                                                <Text style={{ marginLeft: theme.size(10) }}>{item.label}</Text>
                                            </View>
                                        )
                                    })
                                    :
                                    null
                            }
                        </View>
                        <View style={{ width: "70%", justifyContent: "flex-start" }}>
                            {
                                this.state.data
                                    ?
                                    <PieChart
                                        style={{ height: 180, width: 150 }}
                                        valueAccessor={({ item }) => item.amount}
                                        data={this.state.data}
                                        spacing={0}
                                        outerRadius={'95%'}
                                    >
                                        <Labels />
                                    </PieChart>
                                    :
                                    <Text style={[styles.bodyText, { height: theme.size(100), marginTop: theme.size(80) }]}>No data to show</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", width: '100%', height: '25%', marginTop: theme.size(30) }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '33%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ width: '100%', height: '100%', justifyContent: "center", alignItems: "center" }}>
                                <Text style={[styles.bodyText, { color: theme.colorAccent, textAlign: 'center' }]}>Moods taken</Text>
                                <Text style={[styles.bodyText, { color: theme.colorAccent, fontSize: theme.size(20), marginTop: theme.size(5) }]}>{this.state.moodsTaken}</Text>
                            </View>
                        </LinearGradient>
                        <View style={{ backgroundColor: "white", width: '34%', borderRightColor: theme.colorGrey, borderRightWidth: theme.size(0.5), justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.bodyText, { color: theme.colorMenuHeading, textAlign: 'center' }]}>Positive entries</Text>
                            <Text style={[styles.bodyText, { textAlign: 'center', color: theme.colorMenuHeading, fontSize: theme.size(20), marginTop: theme.size(5) }]}>{this.state.positiveEntries}</Text>
                        </View>
                        <View style={{ backgroundColor: "white", width: '33%', borderRightColor: theme.colorGrey, borderRightWidth: theme.size(0.5), justifyContent: "center", alignItems: "center" }}>
                            <Text style={[styles.bodyText, { color: theme.colorMenuHeading, textAlign: 'center' }]}>Negative entries</Text>
                            <Text style={[styles.bodyText, { textAlign: 'center', color: theme.colorMenuHeading, fontSize: theme.size(20), marginTop: theme.size(5) }]}>{this.state.negativeEntries}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: '25%', justifyContent: "center", alignItems: "center",}}>
                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading }]}>First Note Taken</Text>
                        <Text style={[styles.bodyText, { color: theme.colorMenuHeading, fontSize: theme.size(26), }]}>
                            {
                                !this.state.firstNote
                                    ?
                                    '00-00-0000'
                                    :
                                    <Moment format="DD-MM-YYYY" element={Text} >{this.state.firstNote}</Moment>
                            }
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
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
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View >
        )
    }
}