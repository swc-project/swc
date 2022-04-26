import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "1"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "2"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function myTag(strings) {}
function f1() {
    return myTag(_templateObject());
}
function f2() {
    return myTag(_templateObject1());
}
