function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var foundFirst = function foundFirst() {
    "use strict";
    _classCallCheck(this, foundFirst);
};
var Other = function Other() {
    "use strict";
    _classCallCheck(this, Other);
};
var Dotted;
(function(Dotted1) {
    var Name = function Name() {
        "use strict";
        _classCallCheck(this, Name);
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
