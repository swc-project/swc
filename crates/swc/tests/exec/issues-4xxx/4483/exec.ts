
export enum THEME_SETTINGS_MODE {
    default = "default",
    dark = "dark"
}

export enum THEME_SETTINGS_MAP {
    normal = THEME_SETTINGS_MODE.default,
    fancy = THEME_SETTINGS_MODE.dark
}

console.log(THEME_SETTINGS_MAP.fancy)
console.log(THEME_SETTINGS_MAP.normal)