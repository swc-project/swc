// @target: es5
var b;
class C {
    [b]() {}
    static [true]() {}
    [[]]() {}
    static [{}]() {}
    [undefined]() {}
    static [null]() {}
}
