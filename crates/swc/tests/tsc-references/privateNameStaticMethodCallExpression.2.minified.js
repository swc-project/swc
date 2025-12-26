//// [privateNameStaticMethodCallExpression.ts]
var __ = new WeakMap();
class AA {
    test() {
        method.call(AA), method(), new method();
        let arr = [
            1,
            2
        ];
        method2.call(AA, 0, ...arr, 3), new method2(0, ...arr, 3), method2`head${1}middle${2}tail`, method2`test${1}and${2}`, method2.call(AA.getClass(), 0, ...arr, 3), new method2(0, ...arr, 3), method2`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
function method() {
    this.x = 10;
}
function method2(a) {}
__.set(AA, {
    writable: !0,
    value: AA.x = 1
});
