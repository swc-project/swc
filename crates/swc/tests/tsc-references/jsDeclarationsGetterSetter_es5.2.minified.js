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
export var A = function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    return _createClass(A, [
        {
            key: "x",
            get: function() {
                return 12;
            }
        }
    ]), A;
}();
export var B = function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    return _createClass(B, [
        {
            key: "x",
            set: function(_arg) {
            }
        }
    ]), B;
}();
export var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "x",
            get: function() {
                return 12;
            },
            set: function(_arg) {
            }
        }
    ]), C;
}();
export var D = function() {
    "use strict";
    _classCallCheck(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function() {
        return 12;
    }
});
export var E = function() {
    "use strict";
    _classCallCheck(this, E);
};
Object.defineProperty(E.prototype, "x", {
    set: function(_arg) {
    }
});
export var F = function() {
    "use strict";
    _classCallCheck(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function() {
        return 12;
    },
    set: function(_arg) {
    }
});
