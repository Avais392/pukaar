import React, { Component } from 'react';
import { ScrollView, View, Text, BackHandler } from 'react-native';
import { styles, theme } from '../styles/index'
import Input from "../components/Input";
import { Button, Avatar, CheckBox } from 'react-native-elements';
import { Divider, Badge } from 'react-native-elements';
import { http } from "../util/http";
import Snack from '../components/Snackbar';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import TermsModal from '../pages/Terms';

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default class signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            email: '',
            password: '',
            password2: '',
            checked: false,
            signupOptions: props.navigation.getParam('signupOptions'),
            image: null,
            avatarSource: null,
            loading: false,
            termsModalVisible: false
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.navigate('signupOptions');
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.navigation.getParam('signupOptions')) {
            const old = prevState.signupOptions;
            const updated = this.props.navigation.getParam('signupOptions');
            if (old.orientation !== updated.orientation || old.religious !== updated.religious || old.religion !== updated.religion || old.onMedication !== updated.onMedication || old.sleepingHabits !== updated.sleepingHabits || JSON.stringify(old.selectedDiseases) !== JSON.stringify(updated.selectedDiseases)) {
                this.setState({ signupOptions: this.props.navigation.getParam('signupOptions') })
            }
        }
    }


    updateTerms = () => {
        this.setState({ checked: !this.state.checked })
    }

    onSubmit = () => {
        this.setState({ loading: true })
        if (this.valid()) {
            const { name, phone, email, password } = this.state;
            const { orientation, religious, religion, onMedication, sleepingHabits, selectedDiseases } = this.state.signupOptions;
            const body = new FormData();
            body.append('name', name);
            body.append('phone', phone);
            body.append('email', email);
            body.append('password', password);

            body.append('orientation', orientation);
            body.append('religious', religious);
            body.append('religion', religion);
            body.append('onMedication', onMedication);
            body.append('sleepingHabits', sleepingHabits);
            body.append('selectedDiseases', JSON.stringify(selectedDiseases));
            if (this.state.image) {
                body.append('file', {
                    uri: this.state.image.uri,
                    type: this.state.image.type,
                    name:'image'
                });
            }
            const config = { headers: { 'content-type': 'multipart/form-data' } }
            http.post('/users', body, config)
                .then(resp => {
                    this.setState({ loading: false })
                    Snack("success", "Signup successful, Verify your email so you can login.")
                    this.props.navigation.navigate('Login')
                })
                .catch(err => {
                    console.log(err)
                    this.setState({ loading: false })
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
        else {
            this.setState({ loading: false })
        }
    };

    handleImage = () => {
        ImagePicker.showImagePicker({}, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                Snack("error", "Unknown error occured, please contact an Admin");
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ image: response, avatarSource: response.uri });
            }
        });
    }

    valid() {
        if (this.state.image) {
            if (this.state.image.type !== 'image/jpeg' && this.state.image.type !== 'image/png' && this.state.image.type !== 'image/jpg') {
                Snack("error", "Invalid image type. Must be jpg or png.")
                return false
            }
            if (this.state.image.fileSize >= 9000000) {
                Snack("error", "File size too large. Must be below 9 Mb")
                return false
            }
        }
        if (!this.state.checked) {
            Snack("error", "Must agree to the terms and conditions.")
            return false
        }
        const { name, phone, email, password, password2 } = this.state;
        if (phone.length === 0 || !phone.match('^((\\+92)|(0092))-{0,1}\\d{3}-{0,1}\\d{7}$|^\\d{11}$|^\\d{4}-\\d{7}$')) {
            Snack("error", "Please enter valid phone number")
            return false;
        }
        if (email.length === 0 || !emailRegex.test(email)) {
            Snack("error", "Please enter valid email")
            return false;
        }
        if (password !== password2) {
            Snack("error", "Passwords do not match")
            return false
        }
        if (name.length > 0 && email.length > 0 && password.length > 0 && password2.length > 0) {
            return true
        }
        else {
            Snack("error", "All fields must be filled")
            return false;
        }
    }

    onChange = (value, property) => { this.setState({ [property]: value }) }

    updateVisible = () => {
        this.setState({
            termsModalVisible: !this.state.termsModalVisible,
        })
    }

    render() {
        return (
            <View style={styles.fillSpace}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView style={[styles.bodyPadding]}>
                        <View style={{ marginBottom: theme.size(10), marginTop: theme.size(30) }}>
                            <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary }]} numberOfLines={1}>
                                Sign up
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Divider style={{ backgroundColor: theme.colorPrimary, marginTop: theme.size(10), height: theme.size(2), width: '60%' }} /> */}
                            <Divider style={{ backgroundColor: theme.colorGrey, marginTop: theme.size(10), height: theme.size(2), width: '60%' }} />
                            <View style={{ flexDirection: 'row' }}>
                                <Badge value="1" badgeStyle={{ backgroundColor: 'grey' }} containerStyle={{ top: -10, left: -30 }} onPress={() => this.handleBackButtonClick()} />
                                <Badge value="2" containerStyle={{ top: -10, left: 30 }} />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: theme.size(10) }}>
                            <Avatar
                                rounded
                                size="large"
                                source={{ uri: this.state.avatarSource ? this.state.avatarSource : '' }}
                                showEditButton
                                // onPress={() => this.handleImage()}
                                editButton={{ onPress: () => this.handleImage(), containerStyle: { padding: 0 } }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                            <Input placeholder={"Your Name"} leftIcon={{ name: 'person-outline', color: theme.colorGrey }} onChange={this.onChange} propertyName={'name'} />
                            <Input placeholder={"Contact number"} leftIcon={{ name: 'phone-outline', type: 'material-community', color: theme.colorGrey }} keyboardType={'numeric'} onChange={this.onChange} propertyName={'phone'} />
                            <Input placeholder={"E-mail"} leftIcon={{ name: 'mail-outline', color: theme.colorGrey }} keyboardType={'email-address'} onChange={this.onChange} propertyName={'email'} autoCapitalize='none' />
                            <Input placeholder={"Password"} leftIcon={{ name: 'lock-outline', color: theme.colorGrey }} secureTextEntry={true} onChange={this.onChange} propertyName={'password'} autoCapitalize='none' />
                            <Input placeholder={"Confirm Password"} leftIcon={{ name: 'lock-outline', color: theme.colorGrey }} secureTextEntry={true} onChange={this.onChange} propertyName={'password2'} autoCapitalize='none' />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                containerStyle={{ marginHorizontal: 0, paddingHorizontal: 0 }}
                                checked={this.state.checked}
                                onPress={() => this.updateTerms()}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                            />
                            <Text style={[styles.subtitle, { fontSize: theme.size(14) }]}>agree to the <Text style={{ color: theme.colorPrimary }} onPress={() => this.setState({ termsModalVisible: true })}>terms and conditions</Text> of Pukaar.</Text>
                        </View>
                        <TermsModal
                            visible={this.state.termsModalVisible}
                            updateVisible={this.updateVisible}
                        />
                        <View style={{ marginTop: theme.size(10), marginBottom: theme.size(10) }}>
                            {
                                this.state.loading
                                    ?
                                    <Button buttonStyle={{ paddingVertical: theme.size(10), borderRadius: 5 }} loading ViewComponent={LinearGradient} />
                                    :
                                    <Button buttonStyle={{ paddingVertical: theme.size(10), borderRadius: 5 }} title="Sign up" onPress={() => this.onSubmit()} ViewComponent={LinearGradient} />
                            }
                        </View>
                        <View style={{ marginBottom: theme.size(10) }}>
                            <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={2}>
                                Already have an account? <Text style={{ color: theme.colorPrimary }} onPress={() => this.props.navigation.navigate('Login')}>Login</Text>
                            </Text>
                            <Text style={[styles.bodyText, { textAlign: 'center' }]} numberOfLines={2}>
                                Pukaar is free for a limited time only.
                            </Text>
                        </View>
                    </ScrollView>
                </View >
            </View>
        )
    }
} 