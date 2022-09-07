var t = {
    [1 + 0]: 1,
    [2 + 0]() {
        this[4] = "PASS";
    },
    get [3 + 0]() {
        return this[1];
    },
    set [4 + 0](t) {
        this[1] = t;
    },
};
t[2]();
console.log(t[3]);
