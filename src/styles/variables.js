const size = (value) => value;
const fontSize = (value) => value;

const radius = size(4);

export default Object.freeze({
    // #2F80ED
    // #1B69C7
    colorPrimary: '#1B75BC',
    colorAccent: '#FFFFFF',
    colorAccentLight: '#E6EFFC',
    colorGrey: '#8C8F94', //'#808080',
    colorRed: '#E36767',
    colorStatus: '#6FC754',
    colorTextLight: '#AEAEAE',
    colorTextDark: '#000000',
    colorDivider: 'rgba(0,0,0,.12)',
    colorRipple: 'rgba(0,0,0,.12)',
    colorWhiteTranslucent: 'rgba(255, 255, 255, 0.80)',
    colorGradientStart: '#1B69C7',
    colorGradientEnd: '#3C94FF',
    inputBordercolor: '#3E3E3E',
    colorMenuHeading: '#26272D',
    colorMenuText: '##1D1D26', //#1D1D26 //#8C8F94

    font: {
        regular: 'Montserrat-Regular',
        medium: 'Montserrat-Medium',
        // medium: 'Montserrat-SemiBold',
        bold: 'Montserrat-Bold'
    },

    toolbarHeight: size(52),
    buttonIconSize: size(18),

    radius: radius,
    paddingSmall: size(8),
    paddingBody: size(16),
    paddingMedium: size(16),
    paddingBodyVertical: size(16),
    paddingLarge: size(24),

    size: size,
    fontSize: fontSize,

    shadow: (elevation, top = false, opacity = 0.3) => ({
        elevation,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: top ? -(0.5 * elevation) : (0.5 * elevation)
        },
        shadowOpacity: opacity,
        shadowRadius: 0.8 * elevation
    })
})