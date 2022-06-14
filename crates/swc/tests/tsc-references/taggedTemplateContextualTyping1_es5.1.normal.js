import _tagged_template_literal from "@swc/helpers/src/_tagged_template_literal.mjs";
function _templateObject() {
    var data = _tagged_template_literal([
        "",
        "",
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
        "",
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
        "",
        ""
    ]);
    _templateObject3 = function _templateObject3() {
        return data;
    };
    return data;
}
function tempTag1() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
    return undefined;
}
// If contextual typing takes place, these functions should work.
// Otherwise, the arrow functions' parameters will be typed as 'any',
// and it is an error to invoke an any-typed value with type arguments,
// so this test will error.
tempTag1(_templateObject(), function(x) {
    x(undefined);
    return x;
}, 10);
tempTag1(_templateObject1(), function(x) {
    x(undefined);
    return x;
}, function(y) {
    y(undefined);
    return y;
}, 10);
tempTag1(_templateObject2(), function(x) {
    x(undefined);
    return x;
}, function(y) {
    y(undefined);
    return y;
}, undefined);
tempTag1(_templateObject3(), function(x) {
    x(undefined);
    return x;
}, function(y) {
    y(undefined);
    return y;
}, undefined);
