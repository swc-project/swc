//// [symbolProperty28.ts]
class C1 {
    [Symbol.toStringTag]() {
        return {
            x: ""
        };
    }
}
class C2 extends C1 {
}
var c, obj = c[Symbol.toStringTag]().x;
