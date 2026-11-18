class C {
    *method?() { yield 1; }
    *["computed"]?() { yield 2; }
    private *privateMethod?() { yield 3; }
    static *staticMethod?() { yield 4; }
    *generic?<T>(value: T) { yield value; }
    async *asyncMethod?() { yield 5; }
}
