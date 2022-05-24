import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
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
        "",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
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
    _templateObject2 = function _templateObject2() {
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
    _templateObject3 = function _templateObject3() {
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
    _templateObject4 = function _templateObject4() {
        return data;
    };
    return data;
}
function _templateObject5() {
    var data = _tagged_template_literal([
        "",
        "",
        "",
        ""
    ]);
    _templateObject5 = function _templateObject5() {
        return data;
    };
    return data;
}
function foo() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++){
        stuff[_key] = arguments[_key];
    }
    return undefined;
}
var a = foo([]); // number
var b = foo([], 1); // string
var c = foo([], 1, 2); // boolean
var d = foo([], 1, true); // boolean (with error)
var e = foo([], 1, "2"); // {}
var f = foo([], 1, 2, 3); // any (with error)
var u = foo(_templateObject()); // number
var v = foo(_templateObject1(), 1); // string
var w = foo(_templateObject2(), 1, 2); // boolean
var x = foo(_templateObject3(), 1, true); // boolean (with error)
var y = foo(_templateObject4(), 1, "2"); // {}
var z = foo(_templateObject5(), 1, 2, 3); // any (with error)
