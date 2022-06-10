var a = new (class {
    constructor(){
        this.x = 2;
    }
    ["method" + ""]() {
        this.s = "PASS";
    }
    get ["g" + ""]() {
        return this.x;
    }
    set ["s" + ""](a) {
        this.x = a;
    }
})();
a.method();
console.log(a.g);
