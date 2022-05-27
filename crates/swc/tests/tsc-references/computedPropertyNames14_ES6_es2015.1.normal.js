// @target: es6
var b;
class C {
    [b]() {}
    static [true]() {}
    [[]]() {}
    static [{}]() {}
    [undefined]() {}
    static [null]() {}
}
