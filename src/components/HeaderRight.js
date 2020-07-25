import React from "react";
import { Icon, Avatar } from 'react-native-elements';
import { styles } from "../styles";
import { TouchableOpacity } from "react-native";

export default function HeaderRight(props) {
    if (props.avatar) {
        return (
            <Avatar
                rounded
                size={'small'}
                source={{ uri: props.icon }}
            />
        )
    }
    else {
        return (
            <TouchableOpacity >
                {/* <Icon
                    name={props.icon}
                    color='#000'
                /> */}
            </TouchableOpacity>
        )
    }
}