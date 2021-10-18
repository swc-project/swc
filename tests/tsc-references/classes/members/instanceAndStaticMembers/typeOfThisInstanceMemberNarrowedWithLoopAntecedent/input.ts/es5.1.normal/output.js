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
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _classCallCheck(this, SomeClass);
    }
    _createClass(SomeClass, [
        {
            key: "method",
            value: function method() {
                while(0){
                }
                this.state.data;
                if (this.state.type === "stringVariant") {
                    var s = this.state.data;
                }
            }
        }
    ]);
    return SomeClass;
}();
var SomeClass2 = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass2() {
        _classCallCheck(this, SomeClass2);
    }
    _createClass(SomeClass2, [
        {
            key: "method",
            value: function method() {
                var ref;
                var c = false;
                while(c){
                }
                if (this.state.type === "numberVariant") {
                    this.state.data;
                }
                var n = (ref = this.state) === null || ref === void 0 ? void 0 : ref.data; // This should be an error
            }
        }
    ]);
    return SomeClass2;
}();
