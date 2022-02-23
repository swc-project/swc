function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "tagged template"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "tagged template"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
var _tag = new WeakSet();
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    _classPrivateMethodInit(this, _tag);
    _classPrivateFieldInit(this, _tag2, {
        writable: true,
        value: _classPrivateMethodGet(this, _tag, tag)
    });
    var receiver = _classPrivateMethodGet(this, _tag, tag).bind(this)(_templateObject());
    console.log(receiver === this);
    var receiver2 = _classPrivateFieldGet(this, _tag2).bind(this)(_templateObject1());
    console.log(receiver2 === this);
};
var _tag2 = new WeakMap();
function tag() {
    return this;
}
new Foo();
