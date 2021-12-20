function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// members N and M of types S and T have the same name, same accessibility, same optionality, and N is assignable M
var TargetIsPublic;
(function(TargetIsPublic) {
    var Base = function Base() {
        "use strict";
        _classCallCheck(this, Base);
    };
    var a;
    var b;
    var i;
    var D = function D() {
        "use strict";
        _classCallCheck(this, D);
    };
    var E = function E() {
        "use strict";
        _classCallCheck(this, E);
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
})(TargetIsPublic || (TargetIsPublic = {
}));
(function(TargetIsPublic) {
    var Base = function Base() {
        "use strict";
        _classCallCheck(this, Base);
    };
    var a;
    var b;
    var i;
    var D = function D() {
        "use strict";
        _classCallCheck(this, D);
    };
    var E = function E() {
        "use strict";
        _classCallCheck(this, E);
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
})(TargetIsPublic || (TargetIsPublic = {
}));
