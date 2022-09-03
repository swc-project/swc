//// [parameterInitializersForwardReferencing1_es6.ts]
let foo = "";
function f1(bar = foo) {
    return bar;
}
function f2(bar = (baz = foo)=>baz) {
    return bar();
}
function f3(bar = foo, foo1 = 2) {
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
function f7({ [foo]: bar  }) {}
class Foo {
    constructor(x = 12, y = x){
        this.x = x, this.y = y;
    }
}
function f8(foo1, bar = foo1) {}
