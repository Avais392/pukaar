import React from "react";
import { Picker as Pickerr, View } from "react-native";

import { styles, theme } from "../styles";



export default function Picker(props) {
    const options = Object.keys(props.data).map(key => {
        let label = typeof props.data[key] === 'boolean' ? props.data[key].toString() : props.data[key];
        if (typeof props.data[key] === 'boolean') {
            if (props.propertyName === 'available') {
                label = label === 'true' ? "available" : "unavailable"
            }
            else {
                label = label === 'true' ? "yes" : "no"
            }
        }
        return <Pickerr.Item label={label} key={props.data[key]} value={props.data[key]} />
    })
    return (
        <View style={[{ marginTop: theme.size(20), width: '100%', borderColor: theme.inputBordercolor, borderRadius: 4, borderWidth: 1, }]}>
            <Pickerr
                selectedValue={props.selectedValue}
                style={{ color: theme.colorGrey }}
                onValueChange={(itemValue) =>
                    props.onValueChange(itemValue, props.propertyName)
                }>
                <Pickerr.Item value='' label={props.label} />
                {options}
            </Pickerr>
        </View>
    )
}
