export function iifeAnonArgUnused(value) {
    return (function (a, b = 1) {
        return a;
    })(value, 7);
}
