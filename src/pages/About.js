import React, { Component } from 'react';
import { View, Text, FlatList, BackHandler, Linking, Dimensions} from 'react-native';
import { styles, theme } from "../styles";
import { ListItem, Icon } from 'react-native-elements';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { pukaarContact, pukaarEmail } from '../util/constants'
import diseaseTypes from '../util/enums/diseaseTypes'
export default class About extends Component {

    constructor(props) {
        super(props);
        this.state = {};
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

    goBack = () => {
        this.props.navigation.goBack();
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

    displayDiseaseList = () => {
        let arr = [];
        for (let k in diseaseTypes) {
            // diseaseTypes[k]
            arr.push(diseaseTypes[k])
        }
        return arr.map((disease, i) => {
            return <Text key={i}>{"\n"} - {disease}</Text>
        })
    }

    render() {
        return (
            <View style={styles.fillSpace}>
            <Header title={'About'} changeDrawer={this.goBack} icon={'arrow-back'} logout={this.logout} customStyles={{height: (76 * Dimensions.get('window').height)/896}}/> 
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={[{ height: '92%', width: '100%', backgroundColor: theme.colorPrimary }]} >
                <View style={{ flex: 1, width: '90%', justifyContent: "space-between" }}>
                    <View style={{ height: "100%", marginTop: theme.size(20), marginLeft: 5 }}>
                        <Text style={[styles.bodyText, { color: "white" }]}>
                            We at Pukaar, make it easy to talk about worries Anytime, Anywhere.
                            Our mission is to provide people with easy access to well-trained psychologists, who are willing to help free of cost with the sole purpose of enabling people to live a happier and healthier life.
                            We have psychologists who excel in various areas of expertise, having helped people with the following and more:
                            {this.displayDiseaseList()}
                        </Text>
                    </View >
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', height: '10%', width: '100%', backgroundColor: '#000000' }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ height: '100%', width: '100%', backgroundColor: theme.colorPrimary }} >
                            <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                    <Icon name="home-outline" color='white' type='material-community' />
                                    <Text style={[styles.bodyText, { color: theme.colorAccent }]} onPress={() => this.props.navigation.navigate('Dashboard')}>Home</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </LinearGradient>
            </View>
        )
    }
}