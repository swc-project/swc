export function iifeAnonFirstDefaultUnused(value) {
    return (function (a = 1, b) {
        return b;
    })(undefined, value);
}
