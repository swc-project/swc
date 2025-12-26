//// [privateNameStaticMethodCallExpression.ts]
var __ = new WeakMap();
class AA {
    test() {
        method.call(AA);
        const func = method;
        func();
        new method();
        const arr = [
            1,
            2
        ];
        method2.call(AA, 0, ...arr, 3);
        const b = new method2(0, ...arr, 3); //Error 
        const str = method2`head${1}middle${2}tail`;
        method2`test${1}and${2}`;
        method2.call(AA.getClass(), 0, ...arr, 3);
        const b2 = new method2(0, ...arr, 3); //Error 
        const str2 = method2`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
__.set(AA, {
    writable: true,
    value: AA.x = 1
});
