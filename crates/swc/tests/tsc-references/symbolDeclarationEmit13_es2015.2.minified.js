class C {
    get [Symbol.toPrimitive]() {
        return "";
    }
    set [Symbol.toStringTag](x) {}
}
