var tmp = Symbol.iterator, tmp1 = Symbol.iterator;
//@target: ES6
class C {
    [tmp](x) {
        return undefined;
    }
    [tmp1](x1) {
        return undefined;
    }
}
