function f(n) {
    return function () {
        return a ? b : c ? d : n;
    };
}
