import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "tagged template"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "tagged template"
    ]);
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
var _tag = new WeakSet(), _tag2 = new WeakMap();
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    _tag.add(this);
    _class_private_field_init(this, _tag2, {
        writable: true,
        value: tag
    });
    var receiver = tag(_templateObject());
    console.log(receiver === this);
    var receiver2 = _class_private_field_get(this, _tag2)(_templateObject1());
    console.log(receiver2 === this);
};
function tag() {
    return this;
}
new Foo();
