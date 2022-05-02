import * as swcHelpers from "@swc/helpers";
var _method = /*#__PURE__*/ new WeakSet();
// @target: es2015
var A3 = function A3(a, b) {
    "use strict";
    swcHelpers.classCallCheck(this, A3);
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
    swcHelpers.classPrivateFieldUpdate(b, _method).value++ //Error, not writable 
    ;
};
function method() {}
