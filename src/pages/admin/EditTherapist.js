import React, { Component } from 'react';
import { ScrollView, View, BackHandler, Dimensions} from 'react-native';
import { styles, theme } from '../../styles/index'
import Input from "../../components/Input";
import Picker from "../../components/Picker";
import MultiSelect from "../../components/MultiSelect";
import { Button, Avatar,Input as Inputt  } from 'react-native-elements';
import Snack from '../../components/Snackbar';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import session from '../../data/session';
import ImagePicker from 'react-native-image-picker';
import serviceTypes from "../../util/enums/serviceTypes";
import focusTypes from "../../util/enums/focus";
import doctorTypes from "../../util/enums/doctorTypes";
import { http } from "../../util/http";

const booleanData = { true: true, false: false };


export default class EditTherapistProfileAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            avatarSource: props.navigation.getParam('user').photo,
            image: null,
            overlayVisible: false,
            overlayVisible2: false,
            selectedServices: props.navigation.getParam('user').services,
            selectedFocus: props.navigation.getParam('user').focus,
            userId: props.navigation.getParam('user')._id,
            name: props.navigation.getParam('user').name,
            about: props.navigation.getParam('user').about,
            phone: props.navigation.getParam('user').phone,
            address: props.navigation.getParam('user').address,
            available: props.navigation.getParam('user').available,
            doctorType: props.navigation.getParam('user').doctorType,
            
        };
        console.log(props.navigation.getParam('user').services)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.userId !== this.props.navigation.getParam('user')._id) {
            this.setState({
                avatarSource: this.props.navigation.getParam('user').photo,
                image: null,
                overlayVisible: false,
                overlayVisible2: false,
                selectedServices: this.props.navigation.getParam('user').services,
                selectedFocus: this.props.navigation.getParam('user').focus,
                userId: this.props.navigation.getParam('user')._id,
                name: this.props.navigation.getParam('user').name,
                about: this.props.navigation.getParam('user').about,
                phone: this.props.navigation.getParam('user').phone,
                address: this.props.navigation.getParam('user').address,
                available: this.props.navigation.getParam('user').available,
                doctorType: this.props.navigation.getParam('user').doctorType
            })
        }
    }

    valid() {
        const { selectedServices, selectedFocus, name, about, address, phone, available, doctorType } = this.state;
        if (selectedServices.length === 0 || selectedFocus.length === 0) {
            Snack("error", "All fields must be filled")
            return false;
        }
        if (this.state.image) {
            if (this.state.image.type !== 'image/jpeg' && this.state.image.type !== 'image/png' && this.state.image.type !== 'image/jpg') {
                Snack("error", "Invalid image type.")
                return false
            }
            if (this.state.image.fileSize >= 3500000) {
                Snack("error", "File size too large.")
                return false
            }
        }
        if (phone.length === 0 || !phone.match('^((\\+92)|(0092))-{0,1}\\d{3}-{0,1}\\d{7}$|^\\d{11}$|^\\d{4}-\\d{7}$')) {
            Snack("error", "Please enter valid phone number")
            return false;
        }
        if ((typeof available === 'boolean') && doctorType && doctorType.length > 0 && name.length > 0 && address.length > 0 && about.length > 0) {
            return true
        }
        else {
            Snack("error", "All fields must be filled")
            return false;
        }
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


    onSubmit = async () => {

        if (!this.state.loading) {
            if (this.valid()) {
                this.setState({ loading: true })
                const { selectedServices, selectedFocus, name, about, address, phone, available, doctorType } = this.state;
                const body = new FormData();
                body.append('name', name);
                body.append('about', about);
                body.append('phone', phone);
                body.append('address', address);

                body.append('selectedServices', JSON.stringify(selectedServices));
                body.append('selectedFocus', JSON.stringify(selectedFocus));
                body.append('available', available);
                body.append('doctorType', doctorType);

                if (this.state.image) {
                    body.append('file', {
                        uri: this.state.image.uri,
                        type: this.state.image.type,
                        name: this.state.image.fileName ? this.state.image.fileName : new Date().getTime()
                    });
                }
                const user = await session.getUser()
                const config = { headers: { 'content-type': 'multipart/form-data', 'Authorization': `Bearer ${user.jwt}` } }
                http.put(`/admin/therapists/${this.state.userId}`, body, config)
                    .then(resp => {
                        this.setState({ loading: false })
                        Snack("success", "Profile updated successfully")
                        this.props.navigation.getParam('updateProfile')(selectedServices, selectedFocus, name, about, address, phone, available, doctorType, this.state.avatarSource)
                    })
                    .catch(err => {
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
        }

    };

    updateValue = (value, property) => {
        this.setState({
            [property]: value
        })
    }

    logout = () => {
        session.loggingOut();
        this.props.navigation.navigate('Login', { update: true })
    }

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

    onChange = (value, property) => {
        this.setState({ [property]: value })
    }

    updateVisible = () => {
        this.setState({ overlayVisible: !this.state.overlayVisible })
    }

    updateVisible2 = () => {
        this.setState({ overlayVisible2: !this.state.overlayVisible2 })
    }

    updateServices = (value) => {
        if (this.state.selectedServices.includes(value)) {
            let array = [...this.state.selectedServices]; // make a separate copy of the array
            let index = array.indexOf(value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ selectedServices: array });
            }
        }
        else {
            this.setState({ selectedServices: [...this.state.selectedServices, value] })
        }
    }

    updateFocus = (value) => {
        if (this.state.selectedFocus.includes(value)) {
            let array = [...this.state.selectedFocus]; // make a separate copy of the array
            let index = array.indexOf(value)
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({ selectedFocus: array });
            }
        }
        else {
            this.setState({ selectedFocus: [...this.state.selectedFocus, value] })
        }
    }


    render() {
        return (
            <View style={styles.fillSpace}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Header title={'Edit profile'} changeDrawer={this.goBack} icon={'arrow-back'} customStyles={{height: (76 * Dimensions.get('window').height)/896}} iconRight={'exit-to-app'} logout={this.logout} />
                    <ScrollView style={[styles.bodyPadding]}>
                        <View style={{ alignItems: 'center', marginTop: theme.size(10) }}>
                            <Avatar
                                rounded
                                size="large"
                                source={{ uri: this.state.avatarSource }}
                                showEditButton
                                // onPress={() => this.handleImage()}
                                editButton={{ onPress: () => this.handleImage(), containerStyle: { padding: 0 } }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.paddingBodyVertical }}>
                            <Input placeholder={"Name"} leftIcon={{ name: 'person-outline', color: theme.colorGrey }} onChange={this.onChange} propertyName={'name'} value={this.state.name} />
                            <Input placeholder={"About"} leftIcon={{ name: 'information-outline', type: 'material-community', color: theme.colorGrey }} onChange={this.onChange} propertyName={'about'} multiline={true} numberOfLines={3} value={this.state.about} maxLength={1000} />
                            <Input placeholder={"Contact number"} leftIcon={{ name: 'local-phone', color: theme.colorGrey }} keyboardType={'numeric'} onChange={this.onChange} propertyName={'phone'} value={this.state.phone} />
                            <Input placeholder={"City, Province"} leftIcon={{ name: 'city-variant-outline', type: 'material-community', color: theme.colorGrey }} onChange={this.onChange} propertyName={'address'} value={this.state.address} />
                            {
                                this.state.overlayVisible2 
                                ?
                                <MultiSelect
                                placeholder={this.state.selectedServices.length === 0 ? "Services this therapist provides" : this.state.selectedServices.toString()}
                                visible={true}
                                updateVisible={this.updateVisible2}
                                data={serviceTypes}
                                selectedValues={this.state.selectedServices}
                                updateValues={this.updateServices}
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
                                            paddingHorizontal: 0,
                                            marginTop:10
                                        }}
                                        leftIcon={{ name: 'list', color: theme.colorGrey }}
                                        placeholderTextColor={theme.colorGrey}
                                        onFocus={()=>this.updateVisible2()}
                                        disable={true}
                                        placeholder={this.state.selectedServices.length === 0 ? "Services this therapist provides" : this.state.selectedServices.toString()}
                                
                                    />
                            }

                            {
                                this.state.overlayVisible
                                ?
                                <MultiSelect
                                placeholder={this.state.selectedFocus.length === 0 ? "Therapist's focus" : this.state.selectedFocus.toString()}
                                visible={true}
                                updateVisible={this.updateVisible}
                                data={focusTypes}
                                selectedValues={this.state.selectedFocus}
                                updateValues={this.updateFocus}
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
                                            paddingHorizontal: 0,
                                            marginTop:10
                                        }}
                                        leftIcon={{ name: 'list', color: theme.colorGrey }}
                                        placeholderTextColor={theme.colorGrey}
                                        onFocus={()=>this.updateVisible()}
                                        disable={true}
                                        placeholder={this.state.selectedFocus.length === 0 ? "Therapist's focus" : this.state.selectedFocus.toString()}
                                    />
                            }
                            
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.available}
                                propertyName={'available'}
                                data={booleanData}
                                label={'Is the therapist available?'} />
                            <Picker
                                onValueChange={this.updateValue}
                                selectedValue={this.state.doctorType}
                                propertyName={'doctorType'}
                                data={doctorTypes}
                                label={'Type of doctor?'} />
                        </View>
                        <View style={{ marginTop: theme.size(10), marginBottom: theme.size(10) }}>
                            <Button title="Update profile" onPress={() => this.onSubmit()} ViewComponent={LinearGradient} loading={this.state.loading} />
                        </View>
                    </ScrollView>
                </View>
            </View >
        )
    }
} 