var tmp = Symbol.toStringTag;
//@target: ES6
class C1 {
    [tmp]() {
        return {
        };
    }
}
var tmp1 = Symbol.toStringTag;
class C2 extends C1 {
    [tmp1]() {
        return "";
    }
}
