import * as swcHelpers from "@swc/helpers";
function _templateObject() {
    var data = swcHelpers.taggedTemplateLiteral([
        "\n    hello\n    ",
        "\n    brave\n    ",
        "\n    world\n    ",
        "\n"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = swcHelpers.taggedTemplateLiteral([
        "\n    hello\n    ",
        "\n    brave\n    ",
        "\n    world\n    ",
        "\n"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = swcHelpers.taggedTemplateLiteral([
        "",
        ""
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = swcHelpers.taggedTemplateLiteral([
        "",
        ""
    ]);
    _templateObject3 = function _templateObject3() {
        return data;
    };
    return data;
}
export var a = f(_templateObject(), function(stuff) {
    return stuff.x;
}, function(stuff) {
    return stuff.y;
}, function(stuff) {
    return stuff.z;
});
export var b = g(_templateObject1(), function(stuff) {
    return stuff.x;
}, function(stuff) {
    return stuff.y;
}, function(stuff) {
    return stuff.z;
});
export var c = obj["prop"](_templateObject2(), function(input) {
    return swcHelpers.objectSpread({}, input);
});
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
c = obj.prop(_templateObject3(), function(input) {
    return swcHelpers.objectSpread({}, input);
});
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
