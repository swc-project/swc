var tmp = Symbol.iterator;
//@target: ES5
class C {
    [tmp]() {}
}
(new C)[Symbol.iterator];
