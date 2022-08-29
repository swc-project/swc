//// [computedPropertyNames13_ES6.ts]
var s;
var n;
var a;
class C {
    [s]() {}
    [n]() {}
    static [s + s]() {}
    [s + n]() {}
    [+s]() {}
    static [""]() {}
    [0]() {}
    [a]() {}
    static [true]() {}
    [`hello bye`]() {}
    static [`hello ${a} bye`]() {}
}
