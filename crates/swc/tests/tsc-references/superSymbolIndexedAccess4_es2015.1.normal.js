//@target: ES6
var symbol = Symbol.for('myThing');
let _symbol = symbol;
class Bar {
    [_symbol]() {
        return super[symbol]();
    }
}
