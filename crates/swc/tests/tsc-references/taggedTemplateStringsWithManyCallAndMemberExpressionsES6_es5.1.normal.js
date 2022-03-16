import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "abc",
        "def"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var f;
var x = new new new (f(_templateObject(), 0)).member("hello")(42) === true;
