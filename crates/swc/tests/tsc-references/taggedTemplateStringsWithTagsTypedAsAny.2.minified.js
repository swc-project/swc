//// [taggedTemplateStringsWithTagsTypedAsAny.ts]
var f;
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject1 = function() {
        return data;
    }, data;
}
function _templateObject2() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    return _templateObject2 = function() {
        return data;
    }, data;
}
function _templateObject3() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject3 = function() {
        return data;
    }, data;
}
function _templateObject4() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    return _templateObject4 = function() {
        return data;
    }, data;
}
function _templateObject5() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject5 = function() {
        return data;
    }, data;
}
function _templateObject6() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    return _templateObject6 = function() {
        return data;
    }, data;
}
function _templateObject7() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject7 = function() {
        return data;
    }, data;
}
function _templateObject8() {
    var data = _tagged_template_literal([
        "abc"
    ]);
    return _templateObject8 = function() {
        return data;
    }, data;
}
function _templateObject9() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject9 = function() {
        return data;
    }, data;
}
function _templateObject10() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject10 = function() {
        return data;
    }, data;
}
function _templateObject11() {
    var data = _tagged_template_literal([
        "abc",
        "def",
        "ghi"
    ]);
    return _templateObject11 = function() {
        return data;
    }, data;
}
f(_templateObject()), f(_templateObject1(), 1, 2), f.g.h(_templateObject2()), f.g.h(_templateObject3(), 1, 2), f(_templateObject4()).member, f(_templateObject5(), 1, 2).member, f(_templateObject6()).member, f(_templateObject7(), 1, 2).member, f(_templateObject8()).member.someOtherTag(_templateObject9(), 1, 2), f(_templateObject10(), 1, 2).member.someOtherTag(_templateObject11(), 1, 2), f.thisIsNotATag("abc"), f.thisIsNotATag("abc".concat(1, "def", 2, "ghi"));
