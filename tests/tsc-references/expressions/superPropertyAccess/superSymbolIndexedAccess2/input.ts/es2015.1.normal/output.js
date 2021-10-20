var tmp = Symbol.isConcatSpreadable;
//@target: ES6
class Foo {
    [tmp]() {
        return 0;
    }
}
var tmp1 = Symbol.isConcatSpreadable;
class Bar extends Foo {
    [tmp1]() {
        return super[Symbol.isConcatSpreadable]();
    }
}
