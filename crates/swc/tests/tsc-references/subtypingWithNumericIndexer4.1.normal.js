//// [subtypingWithNumericIndexer4.ts]
// Derived type indexer must be subtype of base type indexer
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    return B;
}(A);
(function(Generics) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        function B() {
            _class_call_check(this, B);
            return _call_super(this, B, arguments);
        }
        return B;
    }(A);
    var B3 = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B3, A);
        function B3() {
            _class_call_check(this, B3);
            return _call_super(this, B3, arguments);
        }
        return B3;
    }(A);
})(Generics || (Generics = {}));
var Generics;
