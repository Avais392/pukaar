import React from "react";
import { Platform, Dimensions} from 'react-native';
import { styles, theme } from "../styles";
import { Header as Headerr } from 'react-native-elements'
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import LinearGradient from 'react-native-linear-gradient';

export default function Header(props) {
    if (props.avatarRight) {
        return (
            <Headerr
                ViewComponent={LinearGradient} // Don't forget this!
                linearGradientProps={{
                    colors: [theme.colorGradientStart, theme.colorGradientEnd],
                    start: { x: 0, y: 0 },
                    end: { x: 1, y: 0 },
                }}
                containerStyle={[{
                    //paddingTop: theme.size(40),
                    paddingTop: Platform.OS === 'ios' ? (20 * Dimensions.get('window').height) / 896 : null
                }, props.customStyles]}
                statusBarProps={{ hidden: true }}
                leftComponent={<HeaderLeft changeDrawer={props.changeDrawer} icon={props.icon} avatar={props.avatarRight} />}
                centerComponent={{ text: props.title, style: [{ color: props.avatarRight ? theme.colorAccent : '#000' }, styles.subtitle] }}
                rightComponent={<HeaderRight icon={props.iconRight} avatar={props.avatarRight} logout={props.logout} />}
            />
        )
    }
    else {
        console.log(Dimensions.get('window').height)
        return (
            <Headerr
                containerStyle={[{
                    backgroundColor: "#fff",
                    justifyContent: 'space-around',
                    paddingTop: Platform.OS === 'ios' ? (20 * Dimensions.get('window').height) / 896 : null
                }, props.customStyles]}
                statusBarProps={{ hidden: true }}
                leftComponent={<HeaderLeft changeDrawer={props.changeDrawer} icon={props.icon} avatar={props.avatarRight} />}
                centerComponent={{ text: props.title, style: [{ color: props.avatarRight ? theme.colorAccent : '#000' }, styles.subtitle] }}
                rightComponent={<HeaderRight icon={props.iconRight} avatar={props.avatarRight} logout={props.logout} />}
            />
        )
    }
}