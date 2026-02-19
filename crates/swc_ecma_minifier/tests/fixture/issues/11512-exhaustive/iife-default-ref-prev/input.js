export function iifeDefaultRefPrev(value) {
    return (function (a, b = a) {
        return a;
    })(value);
}
