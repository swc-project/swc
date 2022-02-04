function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: lib.js
/**
 * @param {string} a
 */ function bar(a) {
    return a + a;
}
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _classCallCheck(this, SomeClass);
    }
    _createClass(SomeClass, [
        {
            key: "a",
            value: function a() {
                return 1;
            }
        }
    ]);
    return SomeClass;
}();
module.exports = {
    bar: bar,
    SomeClass: SomeClass
};
// @filename: main.js
var ref = require('./lib'), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
