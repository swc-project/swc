import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject3 = function _templateObject3() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject4 = function _templateObject4() {
        return data;
    };
    return data;
}
function _templateObject5() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject5 = function _templateObject5() {
        return data;
    };
    return data;
}
function _templateObject6() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject6 = function _templateObject6() {
        return data;
    };
    return data;
}
function _templateObject7() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject7 = function _templateObject7() {
        return data;
    };
    return data;
}
function _templateObject8() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject8 = function _templateObject8() {
        return data;
    };
    return data;
}
function _templateObject9() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject9 = function _templateObject9() {
        return data;
    };
    return data;
}
function _templateObject10() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject10 = function _templateObject10() {
        return data;
    };
    return data;
}
function _templateObject11() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject11 = function _templateObject11() {
        return data;
    };
    return data;
}
// @target: ES6
var f;
f(_templateObject());
f(_templateObject1(), 1, 2);
f.g.h(_templateObject2());
f.g.h(_templateObject3(), 1, 2);
f(_templateObject4()).member;
f(_templateObject5(), 1, 2).member;
f(_templateObject6())["member"];
f(_templateObject7(), 1, 2)["member"];
f(_templateObject8())["member"].someOtherTag(_templateObject9(), 1, 2);
f(_templateObject10(), 1, 2)["member"].someOtherTag(_templateObject11(), 1, 2);
f.thisIsNotATag("abc");
f.thisIsNotATag("abc".concat(1, "def", 2, "ghi"));
