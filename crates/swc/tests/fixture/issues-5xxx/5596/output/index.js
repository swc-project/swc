import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
class Base {
    superMethod() {
        return 'good';
    }
}
var _privateMethod = new WeakSet();
class Sub extends Base {
    superMethod() {
        return 'bad';
    }
    publicMethod() {
        return _class_private_method_get(this, _privateMethod, privateMethod).call(this);
    }
    constructor(...args){
        super(...args);
        _class_private_method_init(this, _privateMethod);
    }
}
function privateMethod() {
    return _get(_get_prototype_of(Sub.prototype), "superMethod", this).call(this);
}
new Sub().publicMethod().toEqual('good');
