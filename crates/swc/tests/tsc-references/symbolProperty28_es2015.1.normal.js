let _toStringTag = Symbol.toStringTag;
//@target: ES6
class C1 {
    [_toStringTag]() {
        return {
            x: ""
        };
    }
}
class C2 extends C1 {
}
var c;
var obj = c[Symbol.toStringTag]().x;
