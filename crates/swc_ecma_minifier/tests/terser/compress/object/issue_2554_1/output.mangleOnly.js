var t = {
    ["x" + ""]: 1,
    ["method" + ""] () {
        this.s = "PASS";
    },
    get ["g" + ""] () {
        return this.x;
    },
    set ["s" + ""] (value){
        this.x = value;
    }
};
t.method();
console.log(t.g);
