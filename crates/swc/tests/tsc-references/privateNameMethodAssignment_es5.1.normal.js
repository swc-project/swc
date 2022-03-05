import * as swcHelpers from "@swc/helpers";
var _method = new WeakSet();
var A3 = function A3(a, b) {
    "use strict";
    swcHelpers.classCallCheck(this, A3);
    var _b, _this_method;
    swcHelpers.classPrivateMethodInit(this, _method);
    swcHelpers.classPrivateFieldSet(this, _method, function() {} // Error, not writable 
    );
    swcHelpers.classPrivateFieldSet(a, _method, function() {}); // Error, not writable 
    swcHelpers.classPrivateFieldSet(b, _method, function() {} //Error, not writable 
    );
    var ref;
    ref = {
        x: function() {}
    }, swcHelpers.classPrivateFieldDestructureSet(this, _method).value = ref.x, ref; //Error, not writable 
    var x = swcHelpers.classPrivateMethodGet(this, _method, method);
    swcHelpers.classPrivateFieldSet(_b = b, _method, (_this_method = +swcHelpers.classPrivateMethodGet(_b, _method, method)) + 1), _this_method; //Error, not writable 
};
function method() {}
