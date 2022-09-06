var t = {
    get instanceof() {
        return test0;
    },
    set instanceof(t) {
        test0 = t;
    },
    set typeof(t) {
        test1 = t;
    },
    get typeof() {
        return test1;
    },
    set else(t) {
        test2 = t;
    },
    get else() {
        return test2;
    },
};
