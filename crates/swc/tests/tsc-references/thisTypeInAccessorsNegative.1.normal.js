//// [thisTypeInAccessorsNegative.ts]
var mismatch = {
    n: 13,
    get x () {
        return this.n;
    },
    set x (n){
        this.wrong = "method";
    }
};
var contextual = {
    n: 16,
    get x () {
        return this.n;
    }
};
