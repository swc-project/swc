import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// members N and M of types S and T have the same name, same accessibility, same optionality, and N is assignable M
var TargetIsPublic;
(function(TargetIsPublic) {
    // targets
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var a;
    var b;
    var i;
    // sources
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
    var E = function E() {
        "use strict";
        _class_call_check(this, E);
    };
    var d;
    var e;
    a = b;
    a = i;
    a = d;
    a = e; // error
    b = a;
    b = i;
    b = d;
    b = e; // error
    i = a;
    i = b;
    i = d;
    i = e; // error
    d = a;
    d = b;
    d = i;
    d = e; // error
    e = a; // errror
    e = b; // errror
    e = i; // errror
    e = d; // errror
    e = e;
})(TargetIsPublic || (TargetIsPublic = {}));
(function(TargetIsPublic) {
    // targets
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var a;
    var b;
    var i;
    // sources
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
    var E = function E() {
        "use strict";
        _class_call_check(this, E);
    };
    var d;
    var e;
    a = b; // error
    a = i; // error
    a = d;
    a = e; // error
    b = a; // error
    b = i;
    b = d; // error
    b = e; // error
    b = b;
    i = a; // error
    i = b;
    i = d; // error
    i = e; // error
    i = i;
    d = a;
    d = b; // error
    d = i; // error
    d = e; // error
    e = a; // errror
    e = b; // errror
    e = i; // errror
    e = d; // errror
    e = e;
})(TargetIsPublic || (TargetIsPublic = {}));
