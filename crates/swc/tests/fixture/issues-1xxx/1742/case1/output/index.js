import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "tagged template"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "tagged template"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var _tag = /*#__PURE__*/ new WeakSet(), _tag2 = /*#__PURE__*/ new WeakMap();
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
    swcHelpers.classPrivateMethodInit(this, _tag);
    swcHelpers.classPrivateFieldInit(this, _tag2, {
        writable: true,
        value: swcHelpers.classPrivateMethodGet(this, _tag, tag)
    });
    var receiver = swcHelpers.classPrivateMethodGet(this, _tag, tag).bind(this)(_templateObject());
    console.log(receiver === this);
    var receiver2 = swcHelpers.classPrivateFieldGet(this, _tag2).bind(this)(_templateObject1());
    console.log(receiver2 === this);
};
function tag() {
    return this;
}
new Foo();
