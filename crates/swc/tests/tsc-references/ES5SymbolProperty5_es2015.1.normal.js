//@target: ES5
var Symbol;
let _iterator = Symbol.iterator;
class C {
    [_iterator]() {}
}
(new C)[Symbol.iterator](0) // Should error
;
