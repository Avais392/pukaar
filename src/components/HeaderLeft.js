import React from "react";
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from "react-native";


export default function HeaderLeft(props) {
    return (
        <TouchableOpacity onPress={() => props.changeDrawer()}>
            <Icon
                name={props.icon}
                color={props.avatar ? '#fff' : '#000'}
                size={28}
            />
        </TouchableOpacity>
    )
}