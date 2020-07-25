import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input as Inputt } from 'react-native-elements';

import { styles, theme } from "../styles";

export default function Input(props) {
    return (
        <Inputt
            inputContainerStyle={{
                borderBottomWidth: 0,
            }}
            inputStyle={{ fontFamily: theme.font.regular }}
            containerStyle={{
                borderColor: theme.inputBordercolor,
                borderRadius: 4,
                borderWidth: 1,
                paddingHorizontal: 0,
                marginTop:10
            }}
            onChangeText={(text) => props.onChange(text, props.propertyName)}
            placeholderTextColor={theme.colorGrey}
            textAlignVertical={'top'}
            {...props}
        />
    )
}