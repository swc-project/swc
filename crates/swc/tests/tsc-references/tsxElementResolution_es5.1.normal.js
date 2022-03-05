import * as swcHelpers from "@swc/helpers";
var foundFirst = function foundFirst() {
    "use strict";
    swcHelpers.classCallCheck(this, foundFirst);
};
var Other = function Other() {
    "use strict";
    swcHelpers.classCallCheck(this, Other);
};
var Dotted;
(function(Dotted1) {
    var Name = function Name() {
        "use strict";
        swcHelpers.classCallCheck(this, Name);
    };
    Dotted1.Name = Name;
})(Dotted || (Dotted = {}));
// Should find the intrinsic element, not the class element
var a = /*#__PURE__*/ React.createElement("foundFirst", {
    x: "hello"
});
var b = /*#__PURE__*/ React.createElement("string_named", null);
// TODO: This should not be a parse error (should
//        parse a property name here, not identifier)
// var c = <var />;
var d = /*#__PURE__*/ React.createElement(Other, null);
var e = /*#__PURE__*/ React.createElement(Dotted.Name, null);
