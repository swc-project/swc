function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>_get(_getPrototypeOf(D), "f", D) + 1
, D.functionExprBoundary = function() {
    return _get(_getPrototypeOf(D), "f", this) + 2;
}, D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
}, D.functionAndClassDeclBoundary = void 0;
