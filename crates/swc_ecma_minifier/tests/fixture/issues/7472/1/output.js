export default ((props)=>{
    let { dummyBool } = props;
    return dummyBool && console.log(`var(--colorNeutralForegroundDisabled, ${theme?.palette.neutralTertiary ?? ThemeColorPalette.Neutral.neutralTertiary})`), null;
});
