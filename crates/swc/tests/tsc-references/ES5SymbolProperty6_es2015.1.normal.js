let _iterator = Symbol.iterator;
//@target: ES5
class C {
    [_iterator]() {}
}
(new C)[Symbol.iterator];
