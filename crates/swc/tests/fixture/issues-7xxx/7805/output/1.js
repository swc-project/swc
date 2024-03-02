var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            \u0130: "i",
            I: "\u0131",
            I\u0307: "i"
        }
    },
    az: {
        regexp: /\u0130/g,
        map: {
            \u0130: "i",
            I: "\u0131",
            I\u0307: "i"
        }
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "i\u0307",
            J: "j\u0307",
            \u012E: "\u012F\u0307",
            "\xcc": "i\u0307\u0300",
            "\xcd": "i\u0307\u0301",
            \u0128: "i\u0307\u0303"
        }
    }
};
export function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang) return lowerCase(str.replace(lang.regexp, function(m) {
        return lang.map[m];
    }));
    return lowerCase(str);
}
export function lowerCase(str) {
    return str.toLowerCase();
}
