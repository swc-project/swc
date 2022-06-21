export var format;
export default function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    return locale;
}
format = "123";
