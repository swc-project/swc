class Test {
    set property(value) {
        if (value === void 0) value = null;
    // oh no, will generate code that is a SyntaxError
    }
}
