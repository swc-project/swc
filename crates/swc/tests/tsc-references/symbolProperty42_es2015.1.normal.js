var tmp = Symbol.iterator;
//@target: ES6
class C {
    [tmp](x) {
        return undefined;
    }
}
