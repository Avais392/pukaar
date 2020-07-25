import React, {Component, useReducer} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  Dimensions,
} from 'react-native';
import {styles, theme} from '../../styles';
import {Icon, Divider} from 'react-native-elements';

import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import session from '../../data/session';
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsModal from '../../pages/Terms';
import SessionModal from '../../pages/Session';

import {roles} from '../../util/enums/User';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyPolicyModalVisible: false,
      termsModalVisible: false,
      user: {role: 'none'},
      donateSessionVisible: false,
    };
  }

  componentDidMount() {
    session.getUser().then(user => {
      this.setState({user: {...user}});
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.props.navigation.goBack();
    return true;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  logout = () => {
    session.loggingOut();
    this.props.navigation.navigate('Login', {update: true});
  };

  updateDonateSessionVisiblity = () => {
    this.setState({
      donateSessionVisible: !this.state.donateSessionVisible,
    });
  };

  updateVisible = () => {
    this.setState({
      privacyPolicyModalVisible: !this.state.privacyPolicyModalVisible,
    });
  };

  updateTermsVisible = () => {
    this.setState({
      termsModalVisible: !this.state.termsModalVisible,
    });
  };

  goToChat = async () => {
    const user = await session.getUser();
    this.props.navigation.navigate('UserChat', {user: user});
  };

  render() {
    return (
      <View style={styles.fillSpace}>
        <Header
          title={'Settings'}
          changeDrawer={this.goBack}
          icon={'arrow-back'}
          logout={this.logout}
          customStyles={{
            paddingTop:
              Platform.OS === 'ios'
                ? (60 * Dimensions.get('window').height) / 896
                : 20,
            height:
              Platform.OS === 'ios'
                ? (120 * Dimensions.get('window').height) / 896
                : 80,
          }}
        />
        <View style={{width: '100%', height: '95%'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '5%',
              width: '100%',
              backgroundColor: theme.colorGrey,
            }}
          />
          {/* buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '25%',
              width: '100%',
              backgroundColor: '#000000',
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AppPasscode')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderRightWidth: 1,
                borderRightColor: theme.colorPrimary,
                borderBottomWidth: 1.5,
                borderBottomColor: theme.colorPrimary,
              }}>
              <Icon name="key-outline" type="material-community" />
              <Text style={[styles.h2, {fontFamily: theme.font.regular}]}>
                App passcode
              </Text>
              <Divider
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  marginTop: theme.size(20),
                  height: theme.size(5),
                  width: '10%',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderLeftWidth: 1,
                borderLeftColor: theme.colorPrimary,
                borderBottomWidth: 1.5,
                borderBottomColor: theme.colorPrimary,
              }}
              onPress={() => {
                this.setState({donateSessionVisible: true});
              }}>
              <Icon name="gift-outline" type="material-community" />
              <Text
                style={[
                  styles.h2,
                  {fontFamily: theme.font.regular, textAlign: 'center'},
                ]}>
                Donate a session
              </Text>
              <Divider
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  marginTop: theme.size(20),
                  height: theme.size(5),
                  width: '10%',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '25%',
              width: '100%',
              backgroundColor: '#000000',
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Subscribe')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderRightWidth: 1,
                borderRightColor: theme.colorPrimary,
                borderTopWidth: 0.5,
                borderBottomColor: theme.colorPrimary,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colorPrimary,
              }}>
              <Icon name="bell-ring-outline" type="material-community" />
              <Text style={[styles.h2, {fontFamily: theme.font.regular}]}>
                Subscribe
              </Text>
              <Divider
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  marginTop: theme.size(20),
                  height: theme.size(5),
                  width: '10%',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({privacyPolicyModalVisible: true})}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderLeftWidth: 1,
                borderLeftColor: theme.colorPrimary,
                borderTopWidth: 0.5,
                borderTopColor: theme.colorPrimary,
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colorPrimary,
              }}>
              <Icon name="shield-account-outline" type="material-community" />
              <Text style={[styles.h2, {fontFamily: theme.font.regular}]}>
                Privacy Policy
              </Text>
              <Divider
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  marginTop: theme.size(20),
                  height: theme.size(5),
                  width: '10%',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '25%',
              width: '100%',
              backgroundColor: '#000000',
            }}>
            <TouchableOpacity
              onPress={() => this.setState({termsModalVisible: true})}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderRightWidth: 1,
                borderRightColor: theme.colorPrimary,
                borderTopWidth: 1.5,
                borderTopColor: theme.colorPrimary,
              }}>
              <Icon name="note-outline" type="material-community" />
              <Text style={[styles.h2, {fontFamily: theme.font.regular}]}>
                Terms of Use
              </Text>
              <Divider
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'black',
                  marginTop: theme.size(20),
                  height: theme.size(5),
                  width: '10%',
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
                backgroundColor: '#ffffff',
                borderLeftWidth: 1,
                borderLeftColor: theme.colorPrimary,
                borderTopWidth: 1.5,
                borderTopColor: theme.colorPrimary,
              }}
            />
          </View>
          <TermsModal
            visible={this.state.termsModalVisible}
            updateVisible={this.updateTermsVisible}
          />
          <PrivacyPolicy
            visible={this.state.privacyPolicyModalVisible}
            updateVisible={this.updateVisible}
          />

          <SessionModal
            visible={this.state.donateSessionVisible}
            updateVisible={this.updateDonateSessionVisiblity}
            message={'This feature is coming soon.'}
          />
          {/* Bottom Navigation */}
          {this.state.user.role === roles.admin ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Dashboard')}
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: '35%',
                width: '100%',
                backgroundColor: '#000000',
              }}>
              <View
                style={{
                  height: '10%',
                  width: '100%',
                  backgroundColor: theme.colorGrey,
                }}
              />
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[theme.colorGradientStart, theme.colorGradientEnd]}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.colorPrimary,
                }}>
                <View
                  style={{flexDirection: 'row', height: '30%', width: '100%'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '100%',
                    }}>
                    <Icon
                      name="home-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text
                      style={[styles.subtitle, {color: theme.colorAccent}]}
                      onPress={() =>
                        this.props.navigation.navigate('Dashboard')
                      }>
                      Home
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
          {this.state.user.role === roles.therapist ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Dashboard')}
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: '35%',
                width: '100%',
                backgroundColor: '#000000',
              }}>
              <View
                style={{
                  height: '10%',
                  width: '100%',
                  backgroundColor: '#d3d3d3',
                }}
              />
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[theme.colorGradientStart, theme.colorGradientEnd]}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.colorPrimary,
                }}>
                <View
                  style={{flexDirection: 'row', height: '30%', width: '100%'}}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '50%',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('TherapistProfile', {
                        jwt: this.state.user.jwt,
                        back: 'Settings',
                      })
                    }>
                    <Icon
                      name="account-circle-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text style={[styles.subtitle, {color: theme.colorAccent}]}>
                      Profile
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '50%',
                    }}
                    onPress={() => this.props.navigation.navigate('Dashboard')}>
                    <Icon
                      name="home-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text style={[styles.subtitle, {color: theme.colorAccent}]}>
                      Home
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
          {this.state.user.role === roles.user ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Dashboard')}
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: '35%',
                width: '100%',
                backgroundColor: '#000000',
              }}>
              <View
                style={{
                  height: '10%',
                  width: '100%',
                  backgroundColor: '#d3d3d3',
                }}
              />
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[theme.colorGradientStart, theme.colorGradientEnd]}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.colorPrimary,
                }}>
                <View
                  style={{flexDirection: 'row', height: '30%', width: '100%'}}>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '33.3%',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('TherapistProfileUser')
                    }>
                    <Icon
                      name="account-circle-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text style={[styles.subtitle, {color: theme.colorAccent}]}>
                      Therapist
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '33.3%',
                    }}
                    onPress={() => this.goToChat()}>
                    <Icon
                      name="forum-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text style={[styles.subtitle, {color: theme.colorAccent}]}>
                      Chat
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      width: '33.3%',
                    }}
                    onPress={() => this.props.navigation.navigate('Dashboard')}>
                    <Icon
                      name="home-outline"
                      color="white"
                      type="material-community"
                    />
                    <Text style={[styles.subtitle, {color: theme.colorAccent}]}>
                      Home
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
