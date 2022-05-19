// @target: es2015
let foo = "";
function f1(bar = foo) {
    var foo = 2;
    return bar; // returns 1
}
function f2(bar = (baz = foo)=>baz) {
    var foo = 2;
    return bar(); // returns 1
}
function f3(bar = foo, foo = 2) {
    return bar;
}
function f4(foo1, bar = foo1) {
    return bar;
}
function f5(a = a) {
    return a;
}
function f6(async = async) {
    return async;
}
function f7({ [foo]: bar  }) {
    let foo = 2;
}
class Foo {
    constructor(x = 12, y = x){
        this.x = x;
        this.y = y;
    }
}
function f8(foo1, bar = foo1) {}
