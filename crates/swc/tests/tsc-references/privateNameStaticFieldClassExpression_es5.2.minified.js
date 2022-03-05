function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to get private static field before its declaration");
    }(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var _class, _Foo, B = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function B() {
        _classCallCheck(this, B);
    }
    return Constructor = B, protoProps = [
        {
            key: "m",
            value: function() {
                console.log(_classStaticPrivateFieldSpecGet(B, B, _foo).test), _classStaticPrivateFieldSpecGet(B, B, _foo).test = 10, new (_classStaticPrivateFieldSpecGet(B, B, _foo))().field;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}(), _foo = {
    writable: !0,
    value: ((_class = function _class1() {
        "use strict";
        _classCallCheck(this, _class1), this.field = 10, console.log("hello"), new (_classStaticPrivateFieldSpecGet(B, B, _foo2))();
    }).test = 123, _class)
}, _foo2 = {
    writable: !0,
    value: ((_Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    }).otherClass = 123, _Foo)
};
