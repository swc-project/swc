var tmp = Symbol.toStringTag;
//@target: ES6
class C1 extends C2 {
    [tmp]() {
        return {
            x: ""
        };
    }
}
class C2 {
}
