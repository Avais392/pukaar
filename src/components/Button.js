import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import { colors } from '../configs'

const Button = ({
  buttonText,
  callback,
  customStyle = {},
  buttonTextStyle = {},
  loading,
  loadingColor,
}) => {
  return (
    <>
      {!loading ? (
        <TouchableOpacity
          onPress={() => {
            callback();
          }}
          style={[styles.button, customStyle]}>
          <Text numberOfLines={1} style={[styles.buttonText, buttonTextStyle]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            callback();
          }}
          style={[styles.button, customStyle]}>
          {loadingColor ? (
            <ActivityIndicator color={loadingColor} />
          ) : (
            <ActivityIndicator color="white" />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.purpleDark
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'center',
    // paddingHorizontal: 20,
    paddingBottom: 4,
  },
});

export default Button;
