function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var _class, _class1;
var B = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    _createClass(B, [
        {
            key: "m",
            value: function m() {
                console.log(_classStaticPrivateFieldSpecGet(B, B, _foo).test);
                _classStaticPrivateFieldSpecGet(B, B, _foo).test = 10;
                new (_classStaticPrivateFieldSpecGet(B, B, _foo))().field;
            }
        }
    ]);
    return B;
}();
var _foo = {
    writable: true,
    value: (_class = function _class2() {
        "use strict";
        _classCallCheck(this, _class2);
        this.field = 10;
        console.log("hello");
        new (_classStaticPrivateFieldSpecGet(B, B, _foo2))();
    }, _class.test = 123, _class)
};
var _foo2 = {
    writable: true,
    value: (_class1 = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    }, _class1.otherClass = 123, _class1)
};
