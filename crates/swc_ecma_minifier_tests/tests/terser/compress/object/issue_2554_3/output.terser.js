var foo = {
    1: 1,
    2() {
        this[4] = "PASS";
    },
    get 3() {
        return this[1];
    },
    set 4(value) {
        this[1] = value;
    },
};
foo[2]();
console.log(foo[3]);
