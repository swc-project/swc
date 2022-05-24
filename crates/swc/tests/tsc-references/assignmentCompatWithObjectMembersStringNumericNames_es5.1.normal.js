import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// members N and M of types S and T have the same name, same accessibility, same optionality, and N is assignable M
// string named numeric properties work correctly, errors below unless otherwise noted
var JustStrings;
(function(JustStrings) {
    var S = function S() {
        "use strict";
        _class_call_check(this, S);
    };
    var T = function T() {
        "use strict";
        _class_call_check(this, T);
    };
    var s;
    var t;
    var s2;
    var t2;
    var a;
    var b;
    var a2 = {
        "1.0": ""
    };
    var b2 = {
        "1": ""
    };
    s = t;
    t = s;
    s = s2; // ok
    s = a2;
    s2 = t2;
    t2 = s2;
    s2 = t;
    s2 = b;
    s2 = a2;
    a = b;
    b = a;
    a = s;
    a = s2;
    a = a2;
    a2 = b2;
    b2 = a2;
    a2 = b; // ok
    a2 = t2; // ok
    a2 = t;
})(JustStrings || (JustStrings = {}));
var NumbersAndStrings;
(function(NumbersAndStrings) {
    var S = function S() {
        "use strict";
        _class_call_check(this, S);
    };
    var T = function T() {
        "use strict";
        _class_call_check(this, T);
    };
    var s;
    var t;
    var s2;
    var t2;
    var a;
    var b;
    var a2 = {
        "1.0": ""
    };
    var b2 = {
        1.: ""
    };
    s = t; // ok
    t = s; // ok
    s = s2; // ok
    s = a2; // error
    s2 = t2; // ok
    t2 = s2; // ok
    s2 = t; // ok
    s2 = b; // ok
    s2 = a2; // error
    a = b; // error
    b = a; // error
    a = s; // error
    a = s2; // error
    a = a2; // error
    a = b2; // error
    a2 = b2; // error
    b2 = a2; // error
    a2 = b; // error
    a2 = t2; // error
    a2 = t; // error
})(NumbersAndStrings || (NumbersAndStrings = {}));
