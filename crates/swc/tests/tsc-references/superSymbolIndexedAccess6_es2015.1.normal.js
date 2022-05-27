//@target: ES5
var symbol;
class Foo {
    static [symbol]() {
        return 0;
    }
}
class Bar extends Foo {
    static [symbol]() {
        return super[symbol]();
    }
}
