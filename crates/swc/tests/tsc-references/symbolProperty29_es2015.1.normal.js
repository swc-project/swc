let _toStringTag = Symbol.toStringTag;
//@target: ES6
class C1 {
    [_toStringTag]() {
        return {
            x: ""
        };
    }
}
