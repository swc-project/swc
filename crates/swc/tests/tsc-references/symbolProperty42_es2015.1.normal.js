//@target: ES6
class C {
    [Symbol.iterator](x) {
        return undefined;
    }
}
