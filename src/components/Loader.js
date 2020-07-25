import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View, } from 'react-native'


export default function BottomBar(props) {
    return (
        <ActivityIndicator size={props.size} color={props.color} />
    )
}