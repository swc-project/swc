//@target: ES5
var symbol;
let _symbol = symbol;
class Foo {
    static [_symbol]() {
        return 0;
    }
}
let _symbol1 = symbol;
class Bar extends Foo {
    static [_symbol1]() {
        return super[symbol]();
    }
}
