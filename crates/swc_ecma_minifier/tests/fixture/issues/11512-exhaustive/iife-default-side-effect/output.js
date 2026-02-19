let calls = 0;
export function iifeDefaultSideEffect(value) {
    return function(a, b = (calls++, 1)) {
        return a;
    }(value);
}
