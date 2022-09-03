//// [symbolProperty33.ts]
class C1 extends C2 {
    [Symbol.toStringTag]() {
        return {
            x: ""
        };
    }
}
class C2 {
}
