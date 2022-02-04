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
var _brand_check_brand = new WeakSet();
var Foo = // @strict: true
// @noUnusedLocals: true
// @target: esnext, es2022
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
        _unused.set(this, {
            writable: true,
            value: void 0 // expect unused error
        });
        _brand.set(this, {
            writable: true,
            value: void _brand_check_brand.add(this)
        });
    }
    _createClass(Foo, [
        {
            key: "isFoo",
            value: function isFoo(v) {
                // This should count as using/reading '#brand'
                return _brand_check_brand.has(v);
            }
        }
    ]);
    return Foo;
}();
var _unused = new WeakMap();
var _brand = new WeakMap();
