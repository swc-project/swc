//@target: ES6
var symbol = Symbol.for('myThing');
let _symbol = symbol;
class Foo {
    [_symbol]() {
        return 0;
    }
}
let _symbol1 = symbol;
class Bar extends Foo {
    [_symbol1]() {
        return super[Bar]();
    }
}
