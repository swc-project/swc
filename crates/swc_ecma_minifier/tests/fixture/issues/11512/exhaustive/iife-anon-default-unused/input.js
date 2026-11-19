export function iifeAnonDefaultUnused(value) {
    return (function (a, b = 1) {
        return a;
    })(value);
}
