import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _tagged_template_literal from "@swc/helpers/lib/_tagged_template_literal.js";
function _templateObject() {
    var data = _tagged_template_literal([
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
    var data = _tagged_template_literal([
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
    var data = _tagged_template_literal([
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
    return _object_spread({}, input);
});
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
c = obj.prop(_templateObject3(), function(input) {
    return _object_spread({}, input);
});
c.returnedObjProp.x;
c.returnedObjProp.y;
c.returnedObjProp.z;
