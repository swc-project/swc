import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
export var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return _create_class(A, [
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
        _class_call_check(this, B);
    }
    return _create_class(B, [
        {
            key: "x",
            set: function(_arg) {}
        }
    ]), B;
}();
export var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
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
    _class_call_check(this, D);
};
Object.defineProperty(D.prototype, "x", {
    get: function() {
        return 12;
    }
});
export var E = function() {
    "use strict";
    _class_call_check(this, E);
};
Object.defineProperty(E.prototype, "x", {
    set: function(_arg) {}
});
export var F = function() {
    "use strict";
    _class_call_check(this, F);
};
Object.defineProperty(F.prototype, "x", {
    get: function() {
        return 12;
    },
    set: function(_arg) {}
});
