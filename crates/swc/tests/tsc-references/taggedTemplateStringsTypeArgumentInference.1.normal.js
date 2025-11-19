//// [taggedTemplateStringsTypeArgumentInference.ts]
// Generic tag with one parameter
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
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
        ""
    ]);
    _templateObject11 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject12() {
    var data = _tagged_template_literal([
        "",
        " ",
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
        "",
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
function _templateObject22() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject22 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject23() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject23 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject24() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject24 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject25() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject25 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject26() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject26 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject27() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject27 = function _templateObject() {
        return data;
    };
    return data;
}
function noParams(n) {}
noParams(_templateObject());
// Generic tag with parameter which does not use type parameter
function noGenericParams(n) {}
noGenericParams(_templateObject1());
// Generic tag with multiple type parameters and only one used in parameter type annotation
function someGenerics1a(n, m) {}
someGenerics1a(_templateObject2(), 3);
function someGenerics1b(n, m) {}
someGenerics1b(_templateObject3(), 3);
// Generic tag with argument of function type whose parameter is of type parameter type
function someGenerics2a(strs, n) {}
someGenerics2a(_templateObject4(), function(n) {
    return n;
});
function someGenerics2b(strs, n) {}
someGenerics2b(_templateObject5(), function(n, x) {
    return n;
});
// Generic tag with argument of function type whose parameter is not of type parameter type but body/return type uses type parameter
function someGenerics3(strs, producer) {}
someGenerics3(_templateObject6(), function() {
    return '';
});
someGenerics3(_templateObject7(), function() {
    return undefined;
});
someGenerics3(_templateObject8(), function() {
    return 3;
});
// 2 parameter generic tag with argument 1 of type parameter type and argument 2 of function type whose parameter is of type parameter type
function someGenerics4(strs, n, f) {}
someGenerics4(_templateObject9(), 4, function() {
    return null;
});
someGenerics4(_templateObject10(), '', function() {
    return 3;
});
someGenerics4(_templateObject11(), null, null);
// 2 parameter generic tag with argument 2 of type parameter type and argument 1 of function type whose parameter is of type parameter type
function someGenerics5(strs, n, f) {}
someGenerics5(_templateObject12(), 4, function() {
    return null;
});
someGenerics5(_templateObject13(), '', function() {
    return 3;
});
someGenerics5(_templateObject14(), null, null);
// Generic tag with multiple arguments of function types that each have parameters of the same generic type
function someGenerics6(strs, a, b, c) {}
someGenerics6(_templateObject15(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics6(_templateObject16(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics6(_templateObject17(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
// Generic tag with multiple arguments of function types that each have parameters of different generic type
function someGenerics7(strs, a, b, c) {}
someGenerics7(_templateObject18(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics7(_templateObject19(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics7(_templateObject20(), function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
// Generic tag with argument of generic function type
function someGenerics8(strs, n) {
    return n;
}
var x = someGenerics8(_templateObject21(), someGenerics7);
x(_templateObject22(), null, null, null);
// Generic tag with multiple parameters of generic type passed arguments with no best common type
function someGenerics9(strs, a, b, c) {
    return null;
}
var a9a = someGenerics9(_templateObject23(), '', 0, []);
var a9a;
var a9e = someGenerics9(_templateObject24(), undefined, {
    x: 6,
    z: new Date()
}, {
    x: 6,
    y: ''
});
var a9e;
// Generic tag with multiple parameters of generic type passed arguments with a single best common type
var a9d = someGenerics9(_templateObject25(), {
    x: 3
}, {
    x: 6
}, {
    x: 6
});
var a9d;
// Generic tag with multiple parameters of generic type where one argument is of type 'any'
var anyVar;
var a = someGenerics9(_templateObject26(), 7, anyVar, 4);
var a;
// Generic tag with multiple parameters of generic type where one argument is [] and the other is not 'any'
var arr = someGenerics9(_templateObject27(), [], null, undefined);
var arr;
