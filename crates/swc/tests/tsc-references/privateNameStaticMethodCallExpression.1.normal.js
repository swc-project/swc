//// [privateNameStaticMethodCallExpression.ts]
import { _ as _class_static_private_method_get } from "@swc/helpers/_/_class_static_private_method_get";
class AA {
    test() {
        _class_static_private_method_get(AA, AA, method).call(AA);
        const func = _class_static_private_method_get(AA, AA, method);
        func();
        new (_class_static_private_method_get(AA, AA, method))();
        const arr = [
            1,
            2
        ];
        _class_static_private_method_get(AA, AA, method2).call(AA, 0, ...arr, 3);
        const b = new (_class_static_private_method_get(AA, AA, method2))(0, ...arr, 3); //Error 
        const str = _class_static_private_method_get(AA, AA, method2).bind(AA)`head${1}middle${2}tail`;
        _class_static_private_method_get(AA.getClass(), AA, method2).bind(AA)`test${1}and${2}`;
        _class_static_private_method_get(AA.getClass(), AA, method2).call(AA, 0, ...arr, 3);
        const b2 = new (_class_static_private_method_get(AA.getClass(), AA, method2))(0, ...arr, 3); //Error 
        const str2 = _class_static_private_method_get(AA.getClass(), AA, method2).bind(AA)`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
AA.x = 1;
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
