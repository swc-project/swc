//// [symbolProperty42.ts]
class C {
    [Symbol.iterator](x) {
        return undefined;
    }
}
