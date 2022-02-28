let _iterator = Symbol.iterator;
//@target: ES6
class C {
    [_iterator](x) {
        return undefined;
    }
}
