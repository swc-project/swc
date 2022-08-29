import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
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
