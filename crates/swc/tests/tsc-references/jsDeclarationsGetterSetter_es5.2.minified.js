import * as swcHelpers from "@swc/helpers";
export var A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
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
        swcHelpers.classCallCheck(this, B);
    }
    return swcHelpers.createClass(B, [
        {
            key: "x",
            set: function(_arg) {}
        }
    ]), B;
}();
export var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "x",
            get: function() {
                return 12;
            },
            set: function(_arg) {}
        }
    ]), C;
}();
export var D = function() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function() {
        return 12;
    }
});
export var E = function() {
    "use strict";
    swcHelpers.classCallCheck(this, E);
};
Object.defineProperty(E.prototype, "x", {
    set: function(_arg) {}
});
export var F = function() {
    "use strict";
    swcHelpers.classCallCheck(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function() {
        return 12;
    },
    set: function(_arg) {}
});
