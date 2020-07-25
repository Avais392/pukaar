import React, { Component } from 'react';
import { ScrollView, View, Text, BackHandler, TouchableOpacity, TouchableHighlight} from 'react-native';
import { styles, theme } from '../styles/index'
import Input from "../components/Input";
import Picker from "../components/Picker";
import { orientation, sleepingHabits as sleepingHabitsTypes } from "../util/enums/User";
import religionTypes from "../util/enums/religions";
import MultiSelect from "../components/MultiSelect";
import diseaseTypes from "../util/enums/diseaseTypes";
import { Button, Divider, Badge, Icon, Input as Inputt} from 'react-native-elements';
import Snack from '../components/Snackbar';
import LinearGradient from 'react-native-linear-gradient';

const booleanData = { true: true, false: false };


export default class signupOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orientation: null,
            religious: null,
            religion: null,
            onMedication: null,
            sleepingHabits: null,
            overlayVisible: false,
            selectedDiseases: []
        };

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

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    onSubmit = () => {
        if (this.valid()) {
            this.props.navigation.navigate('signup', { signupOptions: this.state })
        }
        else {
            Snack("error", "All fields must be filled")
        }
    };

    valid = () => {
        const { orientation, religious, religion, onMedication, sleepingHabits, selectedDiseases } = this.state;
        if (selectedDiseases.length === 0) {
            return false;
        }
        else if (orientation && orientation.length > 0 && religious !== null && religion && religion.length > 0 && onMedication !== null && sleepingHabits && sleepingHabits.length > 0) {
            return true
        }
        else {
            return false;
        }
    }

    updateValue = (value, property) => {
        this.setState({
            [property]: value
        })
    }

    updateVisible = () => {
        this.setState({ overlayVisible: !this.state.overlayVisible })
    }

    updateDiseases = (value) => {
        if (this.state.selectedDiseases.includes(value)) {
            let array = [...this.state.selectedDiseases]; // make a separate copy of the array
            let index = array.indexOf(value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ selectedDiseases: array });
            }
        }
        else {
            this.setState({ selectedDiseases: [...this.state.selectedDiseases, value] })
        }
    }

    render() {
        return (
            <View style={styles.fillSpace}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView style={[styles.bodyPadding]}>
                        <View style={{ marginVertical: theme.size(30) }}>
                            <Text style={[styles.h2, { textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={1}>
                                Choosing the
                            </Text>
                            <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={1}>
                                Right Therapist
                            </Text>
                            <Text style={[styles.subtitle, { textAlign: 'center' }]} numberOfLines={1}>
                                Select the correct options
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Divider style={{ backgroundColor: theme.colorGrey, marginTop: theme.size(20), height: theme.size(2), width: '60%' }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Badge value="1" containerStyle={{ top: -10, left: -30 }} />
                                <Badge value="2" badgeStyle={{ backgroundColor: 'grey' }} containerStyle={{ top: -10, left: 30 }} onPress={() => this.onSubmit()} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.orientation}
                                propertyName={'orientation'}
                                data={orientation}
                                label={'What is your orientation?'} />
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.religious}
                                propertyName={'religious'}
                                data={booleanData}
                                label={'Do you consider yourself to be religious?'} />
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.religion}
                                propertyName={'religion'}
                                data={religionTypes}
                                label={'What religion do you identify with?'} />
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.onMedication}
                                propertyName={'onMedication'}
                                data={booleanData}
                                label={'Are you currently on any medication?'} />
                            {/* <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.sleepingHabits}
                                propertyName={'sleepingHabits'}
                                data={sleepingHabitsTypes}
                                label={'How would you rate your current sleeping habits?'} /> */}
                            <View style={{ flexDirection: 'column', alignItems: 'center', marginVertical: theme.size(10) }}>
                                <Text style={[styles.subtitle, { fontSize: theme.size(14) }]}>
                                    How would you rate your current sleeping habits?
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginTop: theme.size(10) }}>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.updateValue('Good', 'sleepingHabits')}>
                                        <Icon name={'emoticon-excited-outline'} color={this.state.sleepingHabits === 'Good' ? theme.colorPrimary : "black"} type="material-community" size={50} />
                                        {
                                            this.state.sleepingHabits === 'Good'
                                                ?
                                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ width: '100%', borderRadius: 5, paddingHorizontal: 5 }} >
                                                    <Text style={[styles.subtitle, { color: 'white', textAlign: 'center' }]}>
                                                        Good
                                                    </Text>
                                                </LinearGradient>
                                                :
                                                <Text style={styles.subtitle}>
                                                    Good
                                                </Text>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.updateValue('Fair', 'sleepingHabits')}>
                                        <Icon name={'emoticon-neutral-outline'} color={this.state.sleepingHabits === 'Fair' ? theme.colorPrimary : "black"} type="material-community" size={50} />
                                        {
                                            this.state.sleepingHabits === 'Fair'
                                                ?
                                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ width: '100%', borderRadius: 5, paddingHorizontal: 5 }} >
                                                    <Text style={[styles.subtitle, { color: 'white', textAlign: 'center' }]}>
                                                        Fair
                                                    </Text>
                                                </LinearGradient>
                                                :
                                                <Text style={styles.subtitle}>
                                                    Fair
                                                </Text>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.updateValue('Poor', 'sleepingHabits')}>
                                        <Icon name={'emoticon-sad-outline'} color={this.state.sleepingHabits === 'Poor' ? theme.colorPrimary : "black"} type="material-community" size={50} />
                                        {
                                            this.state.sleepingHabits === 'Poor'
                                                ?
                                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]} style={{ width: '100%', borderRadius: 5, paddingHorizontal: 5 }} >
                                                    <Text style={[styles.subtitle, { color: 'white', textAlign: 'center' }]}>
                                                        Poor
                                                    </Text>
                                                </LinearGradient>
                                                :
                                                <Text style={styles.subtitle}>
                                                    Poor
                                                </Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                this.state.overlayVisible 
                                ?
                                <MultiSelect
                                placeholder={this.state.selectedDiseases.length === 0 ? "What do you think you are suffering from?" : this.state.selectedDiseases.toString()}
                                visible={true}
                                updateVisible={this.updateVisible}
                                data={diseaseTypes}
                                selectedValues={this.state.selectedDiseases}
                                updateValues={this.updateDiseases}
                                />
                                :
                                <Inputt
                                        inputContainerStyle={{
                                            borderBottomWidth: 0,
                                        }}
                                        containerStyle={{
                                            borderColor: theme.inputBordercolor,
                                            borderRadius: 4,
                                            borderWidth: 1,
                                            paddingHorizontal: 0
                                        }}
                                        placeholderTextColor={theme.colorGrey}
                                        onFocus={()=>this.updateVisible()}
                                        disable={true}
                                        placeholder={this.state.selectedDiseases.length === 0 ? "What do you think you are suffering from?" : this.state.selectedDiseases.toString()}
                                        leftIcon={{ name: 'list', color: theme.colorGrey }}
                                    />
                            }
                            
                        </View>
                        <View style={{ marginTop: theme.size(10), marginBottom: theme.size(10) }}>
                            <Button title="Continue to sign up" onPress={() => this.onSubmit()} ViewComponent={LinearGradient} />
                        </View>
                    </ScrollView>
                </View>
            </View >
        )
    }
} 