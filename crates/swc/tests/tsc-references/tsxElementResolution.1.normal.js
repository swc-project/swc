//// [tsxElementResolution.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var foundFirst = function foundFirst() {
    "use strict";
    _class_call_check(this, foundFirst);
};
var Other = function Other() {
    "use strict";
    _class_call_check(this, Other);
};
(function(Dotted) {
    var Name = function Name() {
        "use strict";
        _class_call_check(this, Name);
    };
    Dotted.Name = Name;
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
var Dotted;
