var tmp = Symbol.iterator;
//@target: ES6
class C {
    [tmp](x) {
        return undefined;
    }
}
var c = new C;
c[Symbol.iterator]("");
c[Symbol.iterator](0);
