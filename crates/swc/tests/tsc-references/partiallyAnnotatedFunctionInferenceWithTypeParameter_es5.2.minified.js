import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
}, D = function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
test(function(t1, t2) {
    t2.test2;
}), test(function(t1, t2) {
    t2.test2;
}), test(function() {}), test(function(t1) {}), test(function() {
    for(var _len = arguments.length, ts = new Array(_len), _key = 0; _key < _len; _key++)ts[_key] = arguments[_key];
}), testRest(function(t1) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t1, t2, t3) {}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
}), testRest(function(t2) {
    for(var _len = arguments.length, t3 = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)t3[_key - 1] = arguments[_key];
});
