import * as swcHelpers from "@swc/helpers";
var A3 = function A3(a, b) {
    "use strict";
    swcHelpers.classCallCheck(this, A3);
    var _this_method;
    swcHelpers.classStaticPrivateFieldSpecSet(A3, A3, _method, function() {} // Error, not writable 
    );
    swcHelpers.classStaticPrivateFieldSpecSet(a, A3, _method, function() {}); // Error, not writable 
    swcHelpers.classStaticPrivateFieldSpecSet(b, A3, _method, function() {} //Error, not writable 
    );
    var ref;
    ref = {
        x: function() {}
    }, swcHelpers.classStaticPrivateFieldDestructureSet(A3, _method).value = ref.x, ref; //Error, not writable 
    var x = swcHelpers.classStaticPrivateMethodGet(A3, A3, method);
    swcHelpers.classStaticPrivateFieldSpecSet(b, A3, _method, (_this_method = +swcHelpers.classStaticPrivateMethodGet(b, A3, method)) + 1), _this_method; //Error, not writable 
};
function method() {}
