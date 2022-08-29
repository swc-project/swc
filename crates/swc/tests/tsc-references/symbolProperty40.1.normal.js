//// [symbolProperty40.ts]
class C {
    [Symbol.iterator](x) {
        return undefined;
    }
}
var c = new C;
c[Symbol.iterator]("");
c[Symbol.iterator](0);
