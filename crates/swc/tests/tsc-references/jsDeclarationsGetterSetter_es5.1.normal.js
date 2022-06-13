import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @target: es6
// @declaration: true
// @filename: index.js
export var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    _create_class(A, [
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
        _class_call_check(this, B);
    }
    _create_class(B, [
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
        _class_call_check(this, C);
    }
    _create_class(C, [
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
    _class_call_check(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function get() {
        return 12;
    }
});
export var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
Object.defineProperty(E.prototype, "x", {
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
export var F = function F() {
    "use strict";
    _class_call_check(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function get() {
        return 12;
    },
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
