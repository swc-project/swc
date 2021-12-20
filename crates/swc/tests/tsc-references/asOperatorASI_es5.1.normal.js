function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
        "Hello world"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
// Example 1
var x = 10;
as(_templateObject()); // should not error
// Example 2
var y = 20;
as(Foo); // should emit
