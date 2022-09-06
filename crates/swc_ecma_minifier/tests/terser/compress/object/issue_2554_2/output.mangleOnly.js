var s = new (class {
    constructor() {
        this.x = 2;
    }
    ["method" + ""]() {
        this.s = "PASS";
    }
    get ["g" + ""]() {
        return this.x;
    }
    set ["s" + ""](s) {
        this.x = s;
    }
})();
s.method();
console.log(s.g);
