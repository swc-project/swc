var s = new (class {
    constructor() {
        this[1] = 2;
    }
    [2 + 0]() {
        this[4] = "PASS";
    }
    get [3 + 0]() {
        return this[1];
    }
    set [4 + 0](s) {
        this[1] = s;
    }
})();
s[2]();
console.log(s[3]);
