//@target: ES5
var Symbol;
var tmp = Symbol.iterator;
class C {
    [tmp]() {}
}
(new C)[Symbol.iterator](0) // Should error
;
