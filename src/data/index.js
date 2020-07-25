import AsyncStorage from '@react-native-community/async-storage';

const KEY_USER = 'user';

export default data = {

    async clear() {
        await AsyncStorage.multiRemove([KEY_USER]);
    },

    saveUser(user) {
        return AsyncStorage.setItem(KEY_USER, JSON.stringify(user))
    },

    getUser() {
        return AsyncStorage.getItem(KEY_USER)
            .then(user => {
                if (!user) return Promise.reject('not found');
                return JSON.parse(user);
            })
    }
}