function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {
        }, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _taggedTemplateLiteral(strings, raw) {
    return raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "\n    hello\n    ",
        "\n    brave\n    ",
        "\n    world\n    ",
        "\n"
    ]);
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _taggedTemplateLiteral([
        "\n    hello\n    ",
        "\n    brave\n    ",
        "\n    world\n    ",
        "\n"
    ]);
    return _templateObject1 = function _templateObject1() {
        return data;
    }, data;
}
function _templateObject2() {
    var data = _taggedTemplateLiteral([
        "",
        ""
    ]);
    return _templateObject2 = function _templateObject2() {
        return data;
    }, data;
}
function _templateObject3() {
    var data = _taggedTemplateLiteral([
        "",
        ""
    ]);
    return _templateObject3 = function _templateObject3() {
        return data;
    }, data;
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
export var c = obj.prop(_templateObject2(), function(input) {
    return _objectSpread({
    }, input);
});
c.returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z, (c = obj.prop(_templateObject3(), function(input) {
    return _objectSpread({
    }, input);
})).returnedObjProp.x, c.returnedObjProp.y, c.returnedObjProp.z;
