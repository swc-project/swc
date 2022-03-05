import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "Hello ",
        " World"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "Hello"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
"".concat(579), "leading ".concat(579), "".concat(579, " trailing"), "Hello ".concat(123, " World"), "".concat(1, " end of string"), tag(_templateObject(), 123), tag(_templateObject1());
