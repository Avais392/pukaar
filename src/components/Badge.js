import React from "react";
import { styles, theme } from "../styles";
import { View, Text } from 'react-native'
import { Icon, Badge as CustomBadge} from 'react-native-elements'

export default function Badge(props) {
    return (
        <View style={[styles.bodyMargin,{marginTop:10, backgroundColor:'black', paddingHorizontal:10, paddingVertical:2, backgroundColor: theme.colorPrimary, borderRadius:10}]}>
            <Text style={[styles.subtitle, {color:theme.colorAccent}]}>
                {props.value}
            </Text>
        </View>
    )
}



// <View style={{ flexDirection: "row", flexWrap: 'wrap', height:"30%" }}>
//                                         {
//                                             this.state.user.services.map((item) =>
//                                             <Badge value={<Text style={[styles.subtitle, {color: theme.colorAccent}]}>{item}</Text>} badgeStyle={[styles.bodyMargin, {marginTop: theme.size(20), paddingHorizontal:5, height:"32%", backgroundColor: theme.colorPrimary}]} />
//                                             )
//                                         }
//                                     </View>