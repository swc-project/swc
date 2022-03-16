import * as swcHelpers from "@swc/helpers";
var _get = /*#__PURE__*/ new WeakSet();
var MyClass = function MyClass() {
    "use strict";
    swcHelpers.classCallCheck(this, MyClass);
    swcHelpers.classPrivateMethodInit(this, _get);
    swcHelpers.classPrivateMethodGet(this, _get, get).call(this);
};
function get() {
    console.log("Hi from a method with a private identifier called #get");
}
var instance = new MyClass();
