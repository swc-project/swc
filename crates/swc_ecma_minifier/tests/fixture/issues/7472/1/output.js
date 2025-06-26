export default ((props)=>{
    const { dummyBool } = props;
    return dummyBool && console.log(`var(--colorNeutralForegroundDisabled, ${theme?.palette.neutralTertiary ?? ThemeColorPalette.Neutral.neutralTertiary})`), null;
});
