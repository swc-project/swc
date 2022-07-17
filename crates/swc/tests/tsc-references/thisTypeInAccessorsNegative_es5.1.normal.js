// @noImplicitAny: true
// @noImplicitThis: true
// @target: es5
var mismatch = {
    n: 13,
    get x () {
        return this.n;
    },
    set x (_this){
        this.wrong = "method";
    }
};
var contextual = {
    n: 16,
    get x () {
        return this.n;
    }
};
