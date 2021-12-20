//@target: ES6
var symbol = Symbol.for('myThing');
var tmp = symbol;
class Bar {
    [tmp]() {
        return super[symbol]();
    }
}
