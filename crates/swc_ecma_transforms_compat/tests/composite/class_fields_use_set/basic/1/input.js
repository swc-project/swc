class Foo {
    // Move class field into constructor
    a = 1;
    // Move private class field init into constructor to preserve execution order
    #b = 2;
    static c = 3;
    static #d = 4;
}
