//// [computedPropertyNames14_ES6.ts]
var b;
class C {
    [b]() {}
    static [true]() {}
    [[]]() {}
    static [{}]() {}
    [undefined]() {}
    static [null]() {}
}
