export function iifeNamedDefaultLength(value) {
    return function named(a = 1, b) {
        return named.length + b;
    }(void 0, value);
}
