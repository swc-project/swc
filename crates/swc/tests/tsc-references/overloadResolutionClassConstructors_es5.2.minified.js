import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var fn1 = function fn1() {
    "use strict";
    _class_call_check(this, fn1);
};
new fn1(void 0), new fn1({});
var fn2 = function fn2() {
    "use strict";
    _class_call_check(this, fn2);
};
new fn2(0, void 0), new fn2(0, ""), new fn2("", 0), new fn2("", 0);
var fn3 = function fn3() {
    "use strict";
    _class_call_check(this, fn3);
};
new fn3(3), new fn3("", 3, ""), new fn3(5, 5, 5), new fn3(4), new fn3("", "", ""), new fn3("", "", 3), new fn3();
var fn4 = function fn4() {
    "use strict";
    _class_call_check(this, fn4);
};
new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4("", 3), new fn4(3, ""), new fn4(3, void 0), new fn4("", null), new fn4(null, null), new fn4(!0, null), new fn4(null, !0);
var fn5 = function fn5() {
    "use strict";
    _class_call_check(this, fn5);
};
new fn5(function(n) {
    return n.toFixed();
}), new fn5(function(n) {
    return n.substr(0);
}), new fn5(function(n) {
    return n.blah;
});
