let calls = 0;

function side() {
    calls++;
    return 1;
}

export function iifeDefaultSideEffect(value) {
    return (function (a, b = side()) {
        return a;
    })(value);
}
