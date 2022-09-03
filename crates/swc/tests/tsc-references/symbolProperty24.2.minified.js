//// [symbolProperty24.ts]
class C {
    [Symbol.toPrimitive]() {
        return "";
    }
}
