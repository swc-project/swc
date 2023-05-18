//// [taggedTemplateStringsWithIncompatibleTypedTags.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
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
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject2 = function _templateObject() {
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
    _templateObject3 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject4 = function _templateObject() {
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
    _templateObject5 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject6() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    _templateObject6 = function _templateObject() {
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
    _templateObject7 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject8() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    _templateObject8 = function _templateObject() {
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
    _templateObject9 = function _templateObject() {
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
    _templateObject10 = function _templateObject() {
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
    _templateObject11 = function _templateObject() {
        return data;
    };
    return data;
}
var f;
f(_templateObject());
f(_templateObject1(), 1, 2);
f(_templateObject2()).member;
f(_templateObject3(), 1, 2).member;
f(_templateObject4())["member"];
f(_templateObject5(), 1, 2)["member"];
f(_templateObject6())[0].member(_templateObject7(), 1, 2);
f(_templateObject8(), 1, 2)["member"].member(_templateObject9(), 1, 2);
f(_templateObject10(), true, true)["member"].member(_templateObject11(), 1, 2);
f.thisIsNotATag("abc");
f.thisIsNotATag("abc".concat(1, "def", 2, "ghi"));
