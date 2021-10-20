// Derived member is not optional but base member is, should be ok
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
    // all ok
    c = d;
    c = e;
    c = f;
    c = a;
    a = d;
    a = e;
    a = f;
    a = c;
    b = d;
    b = e;
    b = f;
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
    c = f; // ok
    c = a; // ok
    a = d; // error
    a = e; // error
    a = f; // ok
    a = c; // ok
    b = d; // error
    b = e; // error
    b = f; // ok
    b = a; // ok
    b = c; // ok
})(SourceHasOptional || (SourceHasOptional = {
}));
