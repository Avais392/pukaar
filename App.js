// import 'react-native-gesture-handler';
// import { NavigationNativeContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import AppNavigator from './src/navigation/AppNavigator'
import { ThemeProvider } from 'react-native-elements';
import { theme as themee } from "./src/styles";

import { ScrollView, View,} from 'react-native';
const prefix = 'pukaar://';
const theme = {
  Button: {
    raised: true,
    buttonStyle: {
      width: '100%',
    },
    titleStyle: {
      fontFamily: themee.font.medium
    },
    linearGradientProps: {
      colors: [themee.colorGradientStart, themee.colorGradientEnd],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    }
  },
  Icon: {
    containerStyle: {
      padding: 5,
    }
  }
};

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
          <AppNavigator uriPrefix={prefix}/>
      </ThemeProvider>
    );
  }
}