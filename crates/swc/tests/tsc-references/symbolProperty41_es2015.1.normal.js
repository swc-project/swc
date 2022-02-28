let _iterator = Symbol.iterator;
//@target: ES6
class C {
    [_iterator](x) {
        return undefined;
    }
}
var c = new C;
c[Symbol.iterator]("");
c[Symbol.iterator]("hello");
