var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _create_class = require("@swc/helpers/_/_create_class");
var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function _templateObject() {
    var data = _tagged_template_literal._([
        "",
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _foo, _foo1, _bar, _;
var _obj, _obj1;
throw 'error';
throw 0;
throw false;
throw null;
throw {};
throw undefined;
throw 'a' + 'b';
var b = new Error();
throw 'a' + b;
throw foo = 'error';
throw foo += new Error();
throw foo &= new Error();
throw foo && (foo = 'literal');
throw new Error(), 3;
throw 'literal' && 'not an Error';
throw foo && 'literal';
throw foo ? 'not an Error' : 'literal';
throw "".concat(err);
// valid
throw new Error();
throw new Error('error');
throw Error('error');
var _$e = new Error();
throw _$e;
try {
    throw new Error();
} catch (e) {
    throw e;
}
;
throw a;
throw foo();
throw new foo();
throw foo.bar;
throw foo[bar];
var _field = /*#__PURE__*/ new WeakMap();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check._(this, C);
        _class_private_field_init._(this, _field, {
            writable: true,
            value: void 0
        });
    }
    _create_class._(C, [
        {
            key: "foo",
            value: function foo1() {
                throw _class_private_field_get._(foo, _field);
            }
        }
    ]);
    return C;
}();
throw foo = new Error();
throw (_foo = foo).bar || (_foo.bar = 'literal');
throw (_ = (_foo1 = foo)[_bar = bar]) !== null && _ !== void 0 ? _ : _foo1[_bar] = 'literal';
throw 1, new Error();
throw 'literal' && new Error();
throw new Error() || 'literal';
throw foo ? new Error() : 'literal';
throw foo ? 'literal' : new Error();
throw tag(_templateObject(), foo);
function foo() {
    var index;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                index = 0;
                return [
                    4,
                    index++
                ];
            case 1:
                throw _state.sent();
        }
    });
}
function foo() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        bar
                    ];
                case 1:
                    throw _state.sent();
            }
        });
    })();
}
throw (_obj = obj) === null || _obj === void 0 ? void 0 : _obj.foo;
throw (_obj1 = obj) === null || _obj1 === void 0 ? void 0 : _obj1.foo();
