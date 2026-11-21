export function iifeDefaultReassigned(value) {
    return function(a, b = 1) {
        b = 2;
        return a;
    }(value);
}
