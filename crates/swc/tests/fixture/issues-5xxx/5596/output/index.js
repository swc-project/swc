var _class_private_method_get = require("@swc/helpers/_/_class_private_method_get");
var _class_private_method_init = require("@swc/helpers/_/_class_private_method_init");
var _get = require("@swc/helpers/_/_get");
var _get_prototype_of = require("@swc/helpers/_/_get_prototype_of");
class Base {
    superMethod() {
        return 'good';
    }
}
var _privateMethod = /*#__PURE__*/ new WeakSet();
class Sub extends Base {
    superMethod() {
        return 'bad';
    }
    publicMethod() {
        return _class_private_method_get._(this, _privateMethod, privateMethod).call(this);
    }
    constructor(...args){
        super(...args), _class_private_method_init._(this, _privateMethod);
    }
}
function privateMethod() {
    return _get._(_get_prototype_of._(Sub.prototype), "superMethod", this).call(this);
}
new Sub().publicMethod().toEqual('good');
