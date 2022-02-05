function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "test"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "test"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
var Foo = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Foo() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo);
    }
    return Constructor = Foo, protoProps = null, staticProps = [
        {
            key: "m",
            value: function(strings) {
                return new this();
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Foo;
}();
Foo.m(_templateObject()), Foo.m(_templateObject1());
