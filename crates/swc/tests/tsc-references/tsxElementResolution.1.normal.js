//// [tsxElementResolution.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var foundFirst1 = function foundFirst1() {
    "use strict";
    _class_call_check(this, foundFirst1);
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
var a = <foundFirst x="hello"/>;
var b = <string_named/>;
// TODO: This should not be a parse error (should
//        parse a property name here, not identifier)
// var c = <var />;
var d = <Other/>;
var e = <Dotted.Name/>;
var Dotted;
