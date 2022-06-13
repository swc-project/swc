import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
// @target: esnext
// @useDefineForClassFields: false
var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
        this.p = 12;
    }
    var _proto = K.prototype;
    _proto.m = function m() {};
    _create_class(K, [
        {
            key: "g",
            get: function get() {
                return 0;
            }
        }
    ]);
    return K;
}();
var k = new K();
var sk = _object_spread({}, k);
var ssk = _object_spread({}, k, k);
sk.p;
sk.m(); // error
sk.g; // error
ssk.p;
ssk.m(); // error
ssk.g; // error
var i = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var si = _object_spread({}, i);
var ssi = _object_spread({}, i, i);
si.p;
si.m(); // ok
si.g; // ok
ssi.p;
ssi.m(); // ok
ssi.g; // ok
var o = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var so = _object_spread({}, o);
var sso = _object_spread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
