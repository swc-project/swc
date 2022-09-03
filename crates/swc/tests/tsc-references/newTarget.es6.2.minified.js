//// [newTarget.es6.ts]
class A {
    constructor(){
        this.d = function() {
            return new.target;
        }, new.target;
    }
}
A.c = function() {
    return new.target;
};
class B extends A {
    constructor(){
        super(), new.target;
    }
}
function f1() {
    new.target;
}
const f2 = function() {
    new.target;
}, O = {
    k: function() {
        return new.target;
    }
};
