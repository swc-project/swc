function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "",
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function foo1() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++){
        stuff[_key] = arguments[_key];
    }
    return undefined;
}
var a = foo1(_templateObject(), 1);
var b = foo1([], 1);
function foo2() {
    for(var _len = arguments.length, stuff = new Array(_len), _key = 0; _key < _len; _key++){
        stuff[_key] = arguments[_key];
    }
    return undefined;
}
var c = foo2(_templateObject1(), 1);
var d = foo2([], 1);
