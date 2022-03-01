// @target: es5
var b;
let _b = b, _undefined = undefined;
class C {
    [_b]() {}
    static [true]() {}
    [[]]() {}
    static [{}]() {}
    [_undefined]() {}
    static [null]() {}
}
