import * as swcHelpers from "@swc/helpers";
function bar(a) {
    return a + a;
}
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        swcHelpers.classCallCheck(this, SomeClass);
    }
    return SomeClass.prototype.a = function() {
        return 1;
    }, SomeClass;
}();
module.exports = {
    bar: bar,
    SomeClass: SomeClass
};
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
