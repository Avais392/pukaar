import { Dimensions, StyleSheet, Platform } from 'react-native';
import typography from "./typography";
import variables from "./variables";



export const styles = StyleSheet.create({
    ...typography,

    bodyPadding: {
        paddingStart: variables.paddingBody,
        paddingEnd: variables.paddingBody
    },
    bodyMargin: {
        marginStart: variables.paddingBody,
        marginEnd: variables.paddingBody
    },
    listPadding: (large) => ({
        paddingStart: large ? variables.size(16) : variables.size(8),
        paddingEnd: large ? variables.size(16) : variables.size(8)
    }),
    listMargin: (large) => ({
        marginStart: large ? variables.size(16) : variables.size(8),
        marginEnd: large ? variables.size(16) : variables.size(8)
    }),
    divider: {
        borderBottomWidth: variables.size(1),
        borderBottomColor: variables.colorDivider
    },

    iconContainer: {
        padding: 10
    },

    grid: {
        flex: 1,
        justifyContent: 'space-between'
    },

    
    /**
     * Utilities
     */
    centeredContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fillSpace: { flex: 1, alignItems: 'center', justifyContent: 'center'},
    autoWidth: { alignSelf: 'center' },

    textInput: {
        width: '100%',
        backgroundColor: variables.colorPrimary,
        marginTop: variables.size(8)
    },
    textInputLarge: {
        backgroundColor: variables.colorPrimary,
        height: variables.size(64)
    }
});

export const theme = variables;