// M is optional and S contains no property with the same name as M
// N is optional and T contains no property with the same name as N
class Base {
}
class Derived extends Base {
}
class Derived2 extends Derived {
}
var TargetHasOptional;
(function(TargetHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    // disallowed by weak type checking
    c = d;
    c = e;
    c = f;
    a = d;
    a = e;
    a = f;
    b = d;
    b = e;
    b = f;
    // ok
    c = a;
    a = c;
    b = a;
    b = c;
})(TargetHasOptional || (TargetHasOptional = {
}));
var SourceHasOptional;
(function(SourceHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    c = d; // error
    c = e; // error
    c = f; // error
    c = a; // ok
    a = d; // error
    a = e; // error
    a = f; // error
    a = c; // ok
    b = d; // error
    b = e; // error
    b = f; // error
    b = a; // ok
    b = c; // ok
})(SourceHasOptional || (SourceHasOptional = {
}));
