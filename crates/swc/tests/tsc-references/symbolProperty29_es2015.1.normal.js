var tmp = Symbol.toStringTag;
//@target: ES6
class C1 {
    [tmp]() {
        return {
            x: ""
        };
    }
}
