//@target: ES6
class C {
    [Symbol.iterator](x) {
        return undefined;
    }
}
var c = new C;
c[Symbol.iterator]("");
c[Symbol.iterator](0);
