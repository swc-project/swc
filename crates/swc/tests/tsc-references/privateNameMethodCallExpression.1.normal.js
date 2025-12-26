//// [privateNameMethodCallExpression.ts]
var _method = new WeakSet(), _method2 = new WeakSet();
class AA {
    test() {
        method.call(this);
        const func = method;
        func();
        new method();
        const arr = [
            1,
            2
        ];
        method2.call(this, 0, ...arr, 3);
        const b = new method2(0, ...arr, 3); //Error 
        const str = method2`head${1}middle${2}tail`;
        method2`test${1}and${2}`;
        method2.call(this.getInstance(), 0, ...arr, 3);
        const b2 = new method2(0, ...arr, 3); //Error 
        const str2 = method2`head${1}middle${2}tail`;
    }
    getInstance() {
        return new AA();
    }
    constructor(){
        _method.add(this);
        _method2.add(this);
        this.x = 1;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
