//// [symbolProperty23.ts]
class C {
    [Symbol.toPrimitive]() {
        return !0;
    }
}
