var instance = new (class {
    constructor() {
        this.x = 2;
    }
    ["method" + ""]() {
        this.s = "PASS";
    }
    get ["g" + ""]() {
        return this.x;
    }
    set ["s" + ""](value) {
        this.x = value;
    }
})();
instance.method();
console.log(instance.g);
