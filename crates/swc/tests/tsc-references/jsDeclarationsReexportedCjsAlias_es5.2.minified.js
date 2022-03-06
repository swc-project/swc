import * as swcHelpers from "@swc/helpers";
var SomeClass = function() {
    "use strict";
    function SomeClass() {
        swcHelpers.classCallCheck(this, SomeClass);
    }
    return swcHelpers.createClass(SomeClass, [
        {
            key: "a",
            value: function() {
                return 1;
            }
        }
    ]), SomeClass;
}();
module.exports = {
    bar: function(a) {
        return a + a;
    },
    SomeClass: SomeClass
};
var ref = require("./lib"), SomeClass = ref.SomeClass, Another = ref.SomeClass;
module.exports = {
    SomeClass: SomeClass,
    Another: Another
};
