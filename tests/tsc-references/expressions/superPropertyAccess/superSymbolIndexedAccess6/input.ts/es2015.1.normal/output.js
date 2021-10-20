//@target: ES5
var symbol;
var tmp = symbol;
class Foo {
    static [tmp]() {
        return 0;
    }
}
var tmp1 = symbol;
class Bar extends Foo {
    static [tmp1]() {
        return super[symbol]();
    }
}
