import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { styles, theme } from "../styles";
import { Button, Divider, Badge } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import session from '../data/session';

const localStyle = StyleSheet.create({
    image: {
        width: theme.size(250),
        height: theme.size(250),
        borderRadius: theme.radius,
        // ...theme.shadow(16)
    },
});

export default class Walkthrough extends Component {

    constructor(props) {
        super(props);
        this.state = {
            walkthrough: 0,
            subheading: "Read about their experience and leave a review.",
            heading: "Swipe Left to Learn About Your Therapist",
            imagePath: require("../../assets/1-walkthrough-A.png")
        };
        session.setFirstTimeFlag(true)
    }

    setData = (walkthroughNo) => {
        if (walkthroughNo === 0) {
            this.setState({
                subheading: "Read about their experience and leave a review.",
                heading: "Swipe Left to Learn About Your Therapist",
                imagePath: require("../../assets/1-walkthrough-A.png")
            })
        }
        else if (walkthroughNo === 1) {
            this.setState({
                imagePath: require("../../assets/1-walkthrough-B.png"),
                subheading: "Track your progress with milestones and progress notes.",
                heading: "Swipe Right to See Your Journey",
            })
        }
        else if (walkthroughNo === 2) {
            this.setState({
                imagePath: require("../../assets/1-walkthrough-C.png"),
                subheading: "Talk to your therapist however you feel most comfortable - in voice, video or text.",
                heading: "Your Chat room",
            })
        }
        else if (walkthroughNo === 3) {
            this.setState({
                imagePath: require("../../assets/1-walkthrough-D.png"),
                subheading: "Access your chat room from any mobile device or your laptop or desktop",
                heading: "Chat From Anywhere",
            })
        }
    }

    next = () => {
        if (this.state.walkthrough === 0) {
            this.setState({ walkthrough: 1 })
            this.setData(1)
        }
        else if (this.state.walkthrough === 1) {
            this.setState({ walkthrough: 2 })
            this.setData(2)
        }
        else if (this.state.walkthrough === 2) {
            this.setState({ walkthrough: 3 })
            this.setData(3)
        }
        else {
            this.props.navigation.navigate('Home')
        }
    }

    onSwipeLeft = () => {
        if (this.state.walkthrough === 0) {
            this.setState({ walkthrough: 1 })
            this.setData(1)
        }
        else if (this.state.walkthrough === 1) {
            this.setState({ walkthrough: 2 })
            this.setData(2)
        }
        else if (this.state.walkthrough === 2) {
            this.setState({ walkthrough: 3 })
            this.setData(3)
        }
        else {
            this.props.navigation.navigate('Home')
        }
    }

    onSwipeRight = () => {
        if (this.state.walkthrough === 0) { }
        else if (this.state.walkthrough === 1) {
            this.setState({ walkthrough: 0 })
            this.setData(0)
        }
        else if (this.state.walkthrough === 2) {
            this.setState({ walkthrough: 1 })
            this.setData(1)
        }
        else if (this.state.walkthrough === 3) {
            this.setState({ walkthrough: 2 })
            this.setData(2)
        }
    }

    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (
            <GestureRecognizer
                onSwipeLeft={this.onSwipeLeft}
                onSwipeRight={this.onSwipeRight}
                config={config}
                style={{
                    flex: 1,
                    backgroundColor: this.state.backgroundColor
                }}
            >
                <View style={[styles.fillSpace, { backgroundColor: 'white' }]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', top: theme.size(-70) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '50%' }}>
                            <Badge containerStyle={{ top: -10 }} badgeStyle={{ backgroundColor: this.state.walkthrough === 0 ? theme.colorPrimary : 'grey' }} />
                            <Badge containerStyle={{ top: -10 }} badgeStyle={{ backgroundColor: this.state.walkthrough === 1 ? theme.colorPrimary : 'grey' }} />
                            <Badge containerStyle={{ top: -10 }} badgeStyle={{ backgroundColor: this.state.walkthrough === 2 ? theme.colorPrimary : 'grey' }} />
                            <Badge containerStyle={{ top: -10 }} badgeStyle={{ backgroundColor: this.state.walkthrough === 3 ? theme.colorPrimary : 'grey' }} />
                        </View>
                    </View>
                    <View style={{ top: theme.size(-50) }}>
                        <Image
                            style={{
                                width: '70%',
                                height: undefined,
                                aspectRatio: 1,
                            }}
                            resizeMode='contain'
                            source={this.state.imagePath}
                        />
                    </View>
                    <View style={{ top: theme.size(-20), width: '100%', alignItems: 'center' }}>
                        <Text style={[styles.h1, { textAlign: 'center', color: theme.colorPrimary, width: '80%' }]} numberOfLines={3}>
                            {this.state.heading}
                        </Text>
                        <Text style={[styles.bodyText, { textAlign: 'center', width: '90%' }]} numberOfLines={3}>
                            {this.state.subheading}
                        </Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                        <Button buttonStyle={{ paddingVertical: theme.size(20) }} title="Next" titleStyle={{ fontSize: 20 }} onPress={() => this.next()} ViewComponent={LinearGradient} />
                    </View>
                </View>
            </GestureRecognizer>
        )

    }
}