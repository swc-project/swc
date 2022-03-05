import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    console.log(swcHelpers.classStaticPrivateFieldSpecGet(A, A, _myField)); //Ok
    console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, A, _myField)); //Error
};
var _myField = {
    writable: true,
    value: "hello world"
};
