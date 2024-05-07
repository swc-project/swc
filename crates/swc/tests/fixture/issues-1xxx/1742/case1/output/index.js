var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
var _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
var _class_private_method_get = require("@swc/helpers/_/_class_private_method_get");
var _class_private_method_init = require("@swc/helpers/_/_class_private_method_init");
var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
function _templateObject() {
    var data = _tagged_template_literal._([
        "tagged template"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal._([
        "tagged template"
    ]);
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
var _tag = /*#__PURE__*/ new WeakSet(), _tag2 = /*#__PURE__*/ new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check._(this, Foo);
    _class_private_method_init._(this, _tag);
    _class_private_field_init._(this, _tag2, {
        writable: true,
        value: _class_private_method_get._(this, _tag, tag)
    });
    var receiver = _class_private_method_get._(this, _tag, tag).bind(this)(_templateObject());
    console.log(receiver === this);
    var receiver2 = _class_private_field_get._(this, _tag2).bind(this)(_templateObject1());
    console.log(receiver2 === this);
};
function tag() {
    return this;
}
new Foo();
