//// [taggedTemplateStringsWithOverloadResolution1.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        ""
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    return _templateObject1 = function() {
        return data;
    }, data;
}
function _templateObject2() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    return _templateObject2 = function() {
        return data;
    }, data;
}
function _templateObject3() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    return _templateObject3 = function() {
        return data;
    }, data;
}
function _templateObject4() {
    var data = _tagged_template_literal([
        "",
        "",
        ""
    ]);
    return _templateObject4 = function() {
        return data;
    }, data;
}
function _templateObject5() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    return _templateObject5 = function() {
        return data;
    }, data;
}
function foo() {
    for(var _len = arguments.length, stuff = Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
foo([]), foo([], 1), foo([], 1, 2), foo([], 1, !0), foo([], 1, "2"), foo([], 1, 2, 3), foo(_templateObject()), foo(_templateObject1(), 1), foo(_templateObject2(), 1, 2), foo(_templateObject3(), 1, !0), foo(_templateObject4(), 1, "2"), foo(_templateObject5(), 1, 2, 3);
