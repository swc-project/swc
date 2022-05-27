var a = new (class {
    constructor(){
        this[1] = 2;
    }
    [2 + 0]() {
        this[4] = "PASS";
    }
    get [3 + 0]() {
        return this[1];
    }
    set [4 + 0](a) {
        this[1] = a;
    }
})();
a[2]();
console.log(a[3]);
