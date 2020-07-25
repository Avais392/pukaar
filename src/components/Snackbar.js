import React from "react";
import Snackbar from 'react-native-snackbar';


export default function (status, message) {
    let color = status === "success" ? "blue" : "red";
    Snackbar.show({
        title: message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: color
    });
}
