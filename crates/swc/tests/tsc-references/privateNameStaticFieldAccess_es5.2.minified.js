import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), console.log(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _myField)), console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _myField));
}, _myField = {
    writable: !0,
    value: "hello world"
};
