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
var C = // @target:es6
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "name",
            get: function get() {
                return this._name;
            }
        },
        {
            key: "computedname1",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname2",
            get: function get() {
                return "";
            }
        },
        {
            key: "computedname3",
            set: function set(x) {}
        },
        {
            key: "computedname4",
            set: function set(y) {}
        },
        {
            key: "foo",
            set: function set(a) {}
        }
    ], [
        {
            key: "name2",
            get: function get() {
                return "BYE";
            }
        },
        {
            key: "computedname",
            get: function get() {
                return "";
            }
        },
        {
            key: "bar",
            set: function set(b) {}
        },
        {
            key: "computedname",
            set: function set(b) {}
        }
    ]);
    return C;
}();
