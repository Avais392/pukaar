import AsyncStorage from '@react-native-community/async-storage';

import data from './index';

const REMEMBER_EMAIL = "remember_email";
const REMEMBER_PASSWORD = "remember_password";
const USER = "user";
const PASSCODE = "passcode";
const DEVICETOKEN = "device_token";
const FIRSTTIMEFLAG = "first_time_flag";

let isAuthenticated = false

export default {
    isLoggedIn: () => isLoggedIn,

    userId: () => _user.id,

    getUser: () => {
        return AsyncStorage.getItem(USER)
            .then(resp => {
                return JSON.parse(resp);
            })
    },

    getFirstTimeFlag: () => {
        return AsyncStorage.getItem(FIRSTTIMEFLAG)
            .then(resp => {
                return JSON.parse(resp);
            })
    },

    setFirstTimeFlag: (flag) => {
        AsyncStorage.setItem(FIRSTTIMEFLAG, JSON.stringify(flag))
    },


    isAuthenticated: () => {
        return isAuthenticated
    },

    setDeviceToken: (token) => {
        AsyncStorage.setItem(DEVICETOKEN, token)
    },

    getDeviceToken() {
        return AsyncStorage.getItem(DEVICETOKEN)
    },

    setIsAuthenticated: (isAuthenticated) => {
        isAuthenticated = isAuthenticated;
    },

    loggingOut(user) {
        AsyncStorage.removeItem(USER)
    },

    loggingIn(user) {
        AsyncStorage.setItem(USER, JSON.stringify(user))
    },

    setRememberMe(email, password) {
        AsyncStorage.setItem(REMEMBER_EMAIL, email)
        AsyncStorage.setItem(REMEMBER_PASSWORD, password)
    },

    setPasscode(code) {
        AsyncStorage.setItem(PASSCODE, code)
    },

    removePasscode() {
        AsyncStorage.removeItem(PASSCODE)
    },

    getPasscode() {
        return AsyncStorage.getItem(PASSCODE)
    },

    getRememberMe() {
        return AsyncStorage.multiGet([REMEMBER_EMAIL, REMEMBER_PASSWORD])
            .then(resp => {
                return {
                    email: resp[0][1],
                    password: resp[1][1]
                }
            })
    },

    async logout() {
        _isLoggedIn = false;
        _user = null;
        await data.clear();
    }
}