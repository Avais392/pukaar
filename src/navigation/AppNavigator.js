import React from 'react';
import { createAppContainer } from 'react-navigation';
import Home from '../pages/Home';
import signupOptions from '../pages/signupOptions';
import signup from '../pages/signup';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import AdminUsers from '../pages/admin/Users';
import PatientProfile from '../pages/admin/PatientProfile';
import PatientDiary from '../pages/admin/PatientDiary';
import PatientChat from '../pages/admin/PatientChat';
import Settings from '../pages/sidebar/Setting';
import AssignedUsers from '../pages/therapist/Users';
import PatientNotes from '../pages/therapist/PatientNotes';
import AdminTherapists from '../pages/admin/Therapists';
import AddTherapist from '../pages/admin/AddTherapist';
import TherapistProfileAdmin from '../pages/admin/TherapistProfileAdmin';
import Subscribe from '../pages/Subscribe';
import TherapistProfile from '../pages/therapist/TherapistProfile';
import EditTherapistProfile from '../pages/therapist/EditTherapistProfile';
import AssignedUsersChats from '../pages/therapist/AssignedUsersChats';
import TherapistChat from '../pages/therapist/TherapistChat';
import AssignTherapist from '../pages/admin/AssignTherapist';
import AppPasscode from '../pages/AppPasscode';
import EditTherapistProfileAdmin from '../pages/admin/EditTherapist';
import EmailVerification from '../pages/EmailVerification';
import SetMood from '../pages/user/SetMood';
import SetNote from '../pages/user/SetNote';
import Diary from '../pages/user/Diary';
import History from '../pages/user/History';
import TherapistProfileUser from '../pages/user/TherapistProfile';
import Forum from '../pages/Forum';
import UserChat from '../pages/user/Chat';
import PatientDiaryTherapist from '../pages/therapist/Diary';
import UnassignedUsers from '../pages/therapist/UnassignedUsers';
import Contact from '../pages/Contact';
import About from '../pages/About';
import RecieveCall from '../pages/RecieveCall';
import CallPage from '../pages/CallPage';
import Requests from '../pages/admin/Requests';
import Walkthrough from '../pages/Walkthrough';

import { createStackNavigator } from 'react-navigation-stack';

let navigationOptions = {
    animationEnabled: false
}

const MyApp = createStackNavigator({
    CallPage: {
        screen: CallPage,
        navigationOptions
    },
    Home: {
        screen: Home,
        navigationOptions
    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions
    },
    signupOptions: {
        screen: signupOptions,
        navigationOptions
    },
    signup: {
        screen: signup,
        navigationOptions
    },
    Walkthrough: {
        screen: Walkthrough,
        navigationOptions
    },
}, {
    initialRouteName: "Home",
    headerMode: "none"
});

const MyAppTwo = createStackNavigator({
    Requests: {
        screen: Requests,
        navigationOptions
    },
    About: {
        screen: About,
        navigationOptions
    },
    Contact: {
        screen: Contact,
        navigationOptions
    },
    UnassignedUsers: {
        screen: UnassignedUsers,
        navigationOptions
    },
    PatientDiaryTherapist: {
        screen: PatientDiaryTherapist,
        navigationOptions
    },
    UserChat: {
        screen: UserChat,
        navigationOptions
    },
    TherapistProfileUser: {
        screen: TherapistProfileUser,
        navigationOptions
    },
    Forum: {
        screen: Forum,
        navigationOptions
    },
    History: {
        screen: History,
        navigationOptions
    },
    Diary: {
        screen: Diary,
        navigationOptions
    },
    Login: {
        screen: Login,
        navigationOptions
    },
    SetMood: {
        screen: SetMood,
        navigationOptions
    },
    SetNote: {
        screen: SetNote,
        navigationOptions
    },
    Dashboard: {
        screen: Dashboard,
        navigationOptions
    },
    RecieveCall: {
        screen: RecieveCall,
        navigationOptions
    },
    AdminUsers: {
        screen: AdminUsers,
        navigationOptions
    },
    PatientChat: {
        screen: PatientChat,
        navigationOptions
    },
    PatientProfile: {
        screen: PatientProfile,
        navigationOptions
    },
    PatientDiary: {
        screen: PatientDiary,
        navigationOptions
    },
    EditTherapistProfileAdmin: {
        screen: EditTherapistProfileAdmin,
        navigationOptions
    },
    AppPasscode: {
        screen: AppPasscode,
        navigationOptions
    },
    Subscribe: {
        screen: Subscribe,
        navigationOptions
    },
    AssignTherapist: {
        screen: AssignTherapist,
        navigationOptions
    },
    TherapistChat: {
        screen: TherapistChat,
        navigationOptions
    },
    EditTherapistProfile: {
        screen: EditTherapistProfile,
        navigationOptions
    },
    AddTherapist: {
        screen: AddTherapist,
        navigationOptions
    },
    TherapistProfile: {
        screen: TherapistProfile,
        navigationOptions
    },
    TherapistProfileAdmin: {
        screen: TherapistProfileAdmin,
        navigationOptions
    },
    AdminTherapists: {
        screen: AdminTherapists,
        navigationOptions
    },
    PatientNotes: {
        screen: PatientNotes,
        navigationOptions
    },
    AssignedUsers: {
        screen: AssignedUsers,
        navigationOptions
    },
    AssignedUsersChats: {
        screen: AssignedUsersChats,
        navigationOptions
    },
    Settings: {
        screen: Settings,
        navigationOptions
    }
}, {
    initialRouteName: "Dashboard",
    headerMode: "none"
});

const TabNavigator = createBottomTabNavigator(
    {
        Home: {
            screen: MyApp,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        Dashboard: {
            screen: MyAppTwo,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        ResetPassword: {
            screen: ResetPassword,
            path: 'reset-password/:token',
            navigationOptions: {
                tabBarVisible: false
            }
        },
        EmailVerification: {
            screen: EmailVerification,
            path: 'email-verification',
            navigationOptions: {
                tabBarVisible: false
            }
        },
    },
    {
        initialRouteName: 'Home',
    }
);



export default createAppContainer(TabNavigator);