function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        _classCallCheck(this, SomeClass);
    }
    return _createClass(SomeClass, [
        {
            key: "method",
            value: function() {
                this.state.data, "stringVariant" === this.state.type && this.state.data;
            }
        }
    ]), SomeClass;
}(), SomeClass2 = function() {
    "use strict";
    function SomeClass2() {
        _classCallCheck(this, SomeClass2);
    }
    return _createClass(SomeClass2, [
        {
            key: "method",
            value: function() {
                for(var ref, c = !1; c;);
                "numberVariant" === this.state.type && this.state.data, null === (ref = this.state) || void 0 === ref || ref.data;
            }
        }
    ]), SomeClass2;
}();
