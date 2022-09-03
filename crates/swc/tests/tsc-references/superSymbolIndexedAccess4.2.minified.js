//// [superSymbolIndexedAccess4.ts]
var symbol = Symbol.for('myThing');
class Bar {
    [symbol]() {
        return super[symbol]();
    }
}
