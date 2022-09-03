//// [thisTypeInAccessorsNegative.ts]
var mismatch = {
    n: 13,
    get x () {
        return this.n;
    },
    set x (_this){
        this.wrong = "method";
    }
}, contextual = {
    n: 16,
    get x () {
        return this.n;
    }
};
