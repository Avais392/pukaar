import React from "react";
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { styles, theme } from "../styles";
import { Overlay, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

export default function MultiSelect(props) {
    let selectedValues = props.selectedValues;
    const options = Object.keys(props.data).map((key, i) => {
        return <ListItem
            key={i}
            title={props.data[key]}
            onPress={() => props.updateValues(props.data[key])}
            rightIcon={selectedValues && selectedValues.includes(props.data[key]) ? { name: 'check' } : null}
            bottomDivider
        />
    })

    // if (!props.visible) {
    //     return (
    //         <TouchableOpacity style={{ width: "100%", marginTop: theme.size(20) }} onPress={() => props.updateVisible()}>
    //             <Input
    //                 inputContainerStyle={{
    //                     borderBottomWidth: 0,
    //                 }}
    //                 containerStyle={{
    //                     borderColor: theme.inputBordercolor,
    //                     borderRadius: 4,
    //                     borderWidth: 1,
    //                     paddingHorizontal: 0
    //                 }}
    //                 placeholderTextColor={theme.colorGrey}
    //                 {...props}
    //                 disabled={true}
    //             />
    //         </TouchableOpacity>
    //     )
    // }
    // else {
        return (
            <Overlay isVisible={props.visible} height="auto" onBackdropPress={() => props.updateVisible()}>
                <ScrollView>
                    {
                        options
                    }
                    <Button title="Ok" onPress={() => props.updateVisible()} ViewComponent={LinearGradient} containerStyle={{ marginTop: theme.size(10) }} />
                </ScrollView>
            </Overlay>
        )
    // }
}