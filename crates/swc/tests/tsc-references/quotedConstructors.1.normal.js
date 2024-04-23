//// [quotedConstructors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    console.log(this);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    console.log(this);
};
var E = /*#__PURE__*/ function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    var _proto = E.prototype;
    _proto['constructor'] = function() {
        console.log(this);
    };
    return E;
}();
new function _class() {
    "use strict";
    _class_call_check(this, _class);
    console.log(this);
};
var o = {
    "constructor": function() {}
};
var F = function F() {
    "use strict";
    _class_call_check(this, F);
    console.log(this);
};
