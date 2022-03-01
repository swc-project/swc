let _toStringTag = Symbol.toStringTag;
//@target: ES6
class C1 {
    [_toStringTag]() {
        return "";
    }
}
let _toStringTag1 = Symbol.toStringTag;
class C2 extends C1 {
    [_toStringTag1]() {
        return "";
    }
}
