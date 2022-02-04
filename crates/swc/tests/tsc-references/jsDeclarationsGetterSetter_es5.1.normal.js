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
// @outDir: ./out
// @target: es6
// @declaration: true
// @filename: index.js
export var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, [
        {
            key: "x",
            get: function get() {
                return 12;
            }
        }
    ]);
    return A;
}();
export var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _classCallCheck(this, B);
    }
    _createClass(B, [
        {
            key: "x",
            set: /**
     * @param {number} _arg
     */ function set(_arg) {}
        }
    ]);
    return B;
}();
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "x",
            get: function get() {
                return 12;
            },
            set: function set(_arg) {}
        }
    ]);
    return C;
}();
export var D = function D() {
    "use strict";
    _classCallCheck(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function get() {
        return 12;
    }
});
export var E = function E() {
    "use strict";
    _classCallCheck(this, E);
};
Object.defineProperty(E.prototype, "x", {
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
export var F = function F() {
    "use strict";
    _classCallCheck(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function get() {
        return 12;
    },
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
