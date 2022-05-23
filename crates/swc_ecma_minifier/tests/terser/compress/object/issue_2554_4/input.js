var bar = new (class {
    constructor() {
        this[1] = 2;
    }
    [2 + 0]() {
        this[4] = "PASS";
    }
    get [3 + 0]() {
        return this[1];
    }
    set [4 + 0](value) {
        this[1] = value;
    }
})();
bar[2]();
console.log(bar[3]);
