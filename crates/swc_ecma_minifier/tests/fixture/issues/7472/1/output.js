const FluentV9ColorTokens = {
    colorNeutralForegroundDisabled: '--colorNeutralForegroundDisabled'
}, default_export = (props)=>{
    const { dummyBool } = props;
    return dummyBool && console.log(`var(${FluentV9ColorTokens.colorNeutralForegroundDisabled}, ${theme?.palette.neutralTertiary ?? ThemeColorPalette.Neutral.neutralTertiary})`), null;
};
export { default_export as default };
