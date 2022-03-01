let _toStringTag = Symbol.toStringTag;
//@target: ES6
class C1 extends C2 {
    [_toStringTag]() {
        return {
            x: ""
        };
    }
}
class C2 {
}
