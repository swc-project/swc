let _isConcatSpreadable = Symbol.isConcatSpreadable;
//@target: ES6
class Foo {
    [_isConcatSpreadable]() {
        return 0;
    }
}
let _isConcatSpreadable1 = Symbol.isConcatSpreadable;
class Bar extends Foo {
    [_isConcatSpreadable1]() {
        return super[Symbol.isConcatSpreadable]();
    }
}
