//@target: ES5
var symbol;
var tmp = symbol;
class Foo {
    [tmp]() {
        return 0;
    }
}
var tmp1 = symbol;
class Bar extends Foo {
    [tmp1]() {
        return super[symbol]();
    }
}
