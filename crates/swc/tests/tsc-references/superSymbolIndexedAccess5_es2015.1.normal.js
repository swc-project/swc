//@target: ES5
var symbol;
class Foo {
    [symbol]() {
        return 0;
    }
}
class Bar extends Foo {
    [symbol]() {
        return super[symbol]();
    }
}
