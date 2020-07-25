import variables from "./variables";

export default {
    bold: { fontFamily: variables.font.bold },
    medium: { fontFamily: variables.font.medium },

    h1: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(28),
        marginBottom: variables.size(6)
    },
    h2: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(20),
        marginBottom: variables.size(6)
    },
    subtitle: {
        fontFamily: variables.font.regular,
        fontSize: variables.fontSize(16)
    },
    bodyText: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(16)
    },

    /** Elements */
    buttonText: {
        fontFamily: variables.font.medium,
        textTransform: 'capitalize',
        alignSelf: 'center'
    },
    buttonTextSimple: { // Plain text without background
        fontFamily: variables.font.bold,
        color: variables.colorAccent,
        textTransform: 'capitalize'
    },
    inputLabel: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(16),
        textAlign: 'left'
    },
    label: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(12),
        color: variables.colorTextLight
    },
    toolbarText: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(20)
    },

    listTitle: {
        fontFamily: variables.font.medium,
        fontSize: variables.fontSize(16),
        textAlign: 'left'
    },
}