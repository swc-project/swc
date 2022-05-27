var a = {
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
a.method();
console.log(a.g);
