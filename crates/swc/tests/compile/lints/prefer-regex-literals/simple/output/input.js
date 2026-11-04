var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _tagged_template_literal = require("@swc/helpers/_/_tagged_template_literal");
function _templateObject() {
    var data = _tagged_template_literal._([
        "^d.$"
    ], [
        "^\\d\\.$"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal._([
        "^d. ",
        ""
    ], [
        "^\\d\\. ",
        ""
    ]);
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _tagged_template_literal._([
        "^d.$"
    ], [
        "^\\d\\.$"
    ]);
    _templateObject2 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = _tagged_template_literal._([
        "^d.$"
    ], [
        "^\\d\\.$"
    ]);
    _templateObject3 = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = _tagged_template_literal._([
        "^d.$"
    ], [
        "^\\d\\.$"
    ]);
    _templateObject4 = function _templateObject() {
        return data;
    };
    return data;
}
new RegExp("abc");
new RegExp("abc", "u");
RegExp("abc");
RegExp("abc", "u");
new RegExp("\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d");
RegExp("^\\d\\.$");
new RegExp(String.raw(_templateObject()));
/abc/;
RegExp("abc", "u");
/\d\d\.\d\d\.\d\d\d\d/;
/^\d\.$/;
new RegExp(pattern);
RegExp("abc", flags);
new RegExp(prefix + "abc");
RegExp("".concat(prefix, "abc"));
new RegExp(String.raw(_templateObject1(), suffix));
function f1() {
    var _$RegExp = function RegExp1(a, b) {
        "use strict";
        _class_call_check._(this, RegExp1);
    };
    new _$RegExp("a", "b");
}
new RegExp(/redundant/);
var obj = {
    RegExp: RegExp
};
console.log(RegExp);
(function(a, b) {
    RegExp;
})("a", "b");
foo(function() {
    new RegExp("a");
})("a", "b");
new RegExp("a", "b", "c");
new RegExp(myFn(_templateObject2()));
new RegExp(obj.myFn(_templateObject3()));
function f2() {
    // redeclare
    var _$String = {};
    new RegExp(_$String.raw(_templateObject4()));
}
