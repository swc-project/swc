//// [symbolProperty23.ts]
class C {
    [Symbol.toPrimitive]() {
        return true;
    }
}
