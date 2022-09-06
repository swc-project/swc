var t = {
    ["x" + ""]: 1,
    ["method" + ""]() {
        this.s = "PASS";
    },
    get ["g" + ""]() {
        return this.x;
    },
    set ["s" + ""](t) {
        this.x = t;
    },
};
t.method();
console.log(t.g);
