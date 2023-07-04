const FluentV9ColorTokens = {
    colorNeutralForegroundDisabled: '--colorNeutralForegroundDisabled'
};
export default ((props)=>{
    const { dummyBool } = props;
    return dummyBool && console.log(`var(${FluentV9ColorTokens.colorNeutralForegroundDisabled}, ${theme?.palette.neutralTertiary ?? ThemeColorPalette.Neutral.neutralTertiary})`), null;
});
