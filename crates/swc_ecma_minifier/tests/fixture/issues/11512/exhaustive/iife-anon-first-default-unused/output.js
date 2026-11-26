export function iifeAnonFirstDefaultUnused(value) {
    return function(a = 1, b) {
        return b;
    }(void 0, value);
}
