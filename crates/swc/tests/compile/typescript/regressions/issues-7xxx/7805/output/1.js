var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            \u0130: "\u0069",
            I: "\u0131",
            I\u0307: "\u0069"
        }
    },
    az: {
        regexp: /\u0130/g,
        map: {
            \u0130: "\u0069",
            I: "\u0131",
            I\u0307: "\u0069"
        }
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            \u012E: "\u012F\u0307",
            "\xcc": "\u0069\u0307\u0300",
            "\xcd": "\u0069\u0307\u0301",
            \u0128: "\u0069\u0307\u0303"
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
