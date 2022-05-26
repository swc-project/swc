//@target: ES5
var Symbol;
class C {
    [Symbol.iterator]() {}
}
(new C)[Symbol.iterator](0) // Should error
;
