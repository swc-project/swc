var tmp = Symbol.toStringTag;
//@target: ES6
class C1 {
    [tmp]() {
        return {
            x: ""
        };
    }
}
class C2 extends C1 {
}
var c;
var obj = c[Symbol.toStringTag]().x;
