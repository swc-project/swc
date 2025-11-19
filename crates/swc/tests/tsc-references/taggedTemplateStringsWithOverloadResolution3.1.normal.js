//// [taggedTemplateStringsWithOverloadResolution3.ts]
// Ambiguous call picks the first overload in declaration order
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject2 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject3 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject4 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject5() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject5 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject6() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject6 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject7() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject7 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject8() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject8 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject9() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject9 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject10() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject10 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject11() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject11 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject12() {
    var data = _tagged_template_literal([
        ""
    ]);
    _templateObject12 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject13() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject13 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject14() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject14 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject15() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject15 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject16() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject16 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject17() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject17 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject18() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject18 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject19() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    _templateObject19 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject20() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject20 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject21() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    _templateObject21 = function _templateObject() {
        return data;
    };
    return data;
}
function fn1() {
    return null;
}
var s = fn1(_templateObject(), undefined);
// No candidate overloads found
fn1(_templateObject1(), {}); // Error
function fn2() {
    return undefined;
}
var d1 = fn2(_templateObject2(), 0, undefined); // contextually typed
var d2 = fn2(_templateObject3(), 0, undefined); // any
d1.foo(); // error
d2(); // no error (typed as any)
// Generic and non-generic overload where generic overload is the only candidate
fn2(_templateObject4(), 0, ''); // OK
// Generic and non-generic overload where non-generic overload is the only candidate
fn2(_templateObject5(), '', 0); // OK
function fn3() {
    return null;
}
var s = fn3(_templateObject6(), 3);
var s = fn3(_templateObject7(), '', 3, '');
var n = fn3(_templateObject8(), 5, 5, 5);
var n;
// Generic overloads with differing arity tagging with arguments matching each overload type parameter count
var s = fn3(_templateObject9(), 4);
var s = fn3(_templateObject10(), '', '', '');
var n = fn3(_templateObject11(), '', '', 3);
// Generic overloads with differing arity tagging with argument count that doesn't match any overload
fn3(_templateObject12()); // Error
function fn4() {}
// Generic overloads with constraints tagged with types that satisfy the constraints
fn4(_templateObject13(), '', 3);
fn4(_templateObject14(), 3, '');
fn4(_templateObject15(), 3, undefined);
fn4(_templateObject16(), '', null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
fn4(_templateObject17(), null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
fn4(_templateObject18(), true, null);
fn4(_templateObject19(), null, true);
function fn5() {
    return undefined;
}
fn5(_templateObject20(), function(n) {
    return n.toFixed();
}); // will error; 'n' should have type 'string'.
fn5(_templateObject21(), function(n) {
    return n.substr(0);
});
