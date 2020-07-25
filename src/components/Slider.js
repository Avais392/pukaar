import React, { Component } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { styles, theme } from "../styles";
import { PanGestureHandler } from 'react-native-gesture-handler'


export default class Slider extends Component {

    constructor(props) {
        super(props);
    }

    displayDots = () => {
        let arr = [];
        for (let i = 0; i <= 20; i++) {
            let width = this.props.width * 0.86;
            let start = this.props.width * 0.07;
            let value = this.props.value + 10
            width = (width / 20) * i
            if (i < value) {
                arr.push(<View style={{ height: 6, width: 6, backgroundColor: theme.colorPrimary, marginTop: 9, borderRadius: 3, position: "absolute", left: start + width }} />)
            }
            else if (i == value) {
                arr.push(<View style={{ height: 10, width: 10, backgroundColor: theme.colorPrimary, marginTop: 7, borderRadius: 5, position: "absolute", left: start + width - 2 }} />)
            }
            else {
                arr.push(<View style={{ height: 6, width: 6, backgroundColor: theme.colorGrey, marginTop: 9, borderRadius: 3, position: "absolute", left: start + width }} />)
            }
        }
        return arr;
    }

    handleGesture = (evt) => {
        let { nativeEvent } = evt
        this.props.handlePress(nativeEvent.absoluteX, this.props.property)
    }

    render() {
        let width = this.props.width * 0.86;
        let value = ((this.props.value + 10) / 20) * width;
        width = width - value;
        return (
            <TouchableOpacity onPress={(evt) => this.props.handleTap(evt, this.props.property)} activeOpacity={1}>
                <Text style={[styles.bodyText, { textAlign: 'center', marginTop: 30, }]}>{this.props.title}</Text>
                <PanGestureHandler onGestureEvent={this.handleGesture}>
                    <View style={{ flexDirection: 'row', marginTop: 10, width: '100%' }}>
                        <Text style={[styles.bodyText, { width: '7%', lineHeight: 24, textAlign: "left" }]}>-10</Text>
                        <View style={{ width: '86%', marginTop: 12, flexDirection: 'row', display: "flex" }} >
                            <View style={{ height: 1, width: value, backgroundColor: theme.colorPrimary }} />
                            <View style={{ height: 1, width: width, backgroundColor: theme.colorGrey }} />
                        </View>
                        {this.displayDots()}
                        <Text style={[styles.bodyText, { width: '7%', lineHeight: 24, textAlign: "right" }]}>10</Text>
                    </View>
                </PanGestureHandler>
                <Text style={[styles.bodyText, { textAlign: 'center' }]}>{this.props.value}</Text>
            </TouchableOpacity>
        )
    }

}



                // return (
//     <>
//         <Text style={[styles.bodyText, { textAlign: 'center', marginTop: 30 }]}>{this.props.property}</Text>
//         <PanGestureHandler onGestureEvent={this.handleGesture}>
//             <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, width: '100%' }} activeOpacity={1.0}>
//                 <Text style={[styles.bodyText, { width: '7%', lineHeight: 24, textAlign: "left" }]}>-10</Text>
//                 <View style={{ width: '86%', marginTop: 12, flexDirection: 'row', display: "flex" }} >
//                     <View style={{ height: 1, width: value, backgroundColor: theme.colorPrimary }} />
//                     <View style={{ height: 1, width: width, backgroundColor: theme.colorGrey }} />
//                 </View>
//                 {displayDots()}
//                 <Text style={[styles.bodyText, { width: '7%', lineHeight: 24, textAlign: "right" }]}>10</Text>
//             </TouchableOpacity>
//         </PanGestureHandler>
//         <Text style={[styles.bodyText, { textAlign: 'center' }]}>{this.props.value}</Text>
//     </>
// )