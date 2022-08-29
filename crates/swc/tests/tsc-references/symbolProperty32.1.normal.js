//// [symbolProperty32.ts]
class C1 {
    [Symbol.toStringTag]() {
        return {
            x: ""
        };
    }
}
class C2 extends C1 {
}
