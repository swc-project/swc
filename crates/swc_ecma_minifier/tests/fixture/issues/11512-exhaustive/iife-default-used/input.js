export function iifeDefaultUsed(value) {
    return (function (a, b = 1) {
        return b;
    })(value);
}
