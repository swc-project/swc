import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @target: es6
// @declaration: true
// @filename: index.js
export var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
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
        swcHelpers.classCallCheck(this, B);
    }
    swcHelpers.createClass(B, [
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
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
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
    swcHelpers.classCallCheck(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function get() {
        return 12;
    }
});
export var E = function E() {
    "use strict";
    swcHelpers.classCallCheck(this, E);
};
Object.defineProperty(E.prototype, "x", {
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
export var F = function F() {
    "use strict";
    swcHelpers.classCallCheck(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function get() {
        return 12;
    },
    /**
     * @param {number} _arg
     */ set: function set(_arg) {}
});
