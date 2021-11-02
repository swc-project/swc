let foo1 = "";
function f1(bar = foo1) {
    var foo = 2;
    return bar; // returns 1
}
function f2(bar = (baz = foo1)=>baz
) {
    var foo = 2;
    return bar(); // returns 1
}
function f3(bar = foo1, foo = 2) {
    return bar;
}
function f4(foo, bar = foo) {
    return bar;
}
function f5(a = a) {
    return a;
}
function f6(async = async) {
    return async;
}
function f7({ [foo1]: bar  }) {
    let foo = 2;
}
class Foo {
    constructor(x = 12, y = x){
        this.x = x;
        this.y = y;
    }
}
function f8(foo1, bar = foo1) {
}
