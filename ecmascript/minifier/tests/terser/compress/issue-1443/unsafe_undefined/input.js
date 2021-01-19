function f(undefined) {
    return function () {
        if (a) return b;
        if (c) return d;
    };
}
