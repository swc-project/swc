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
        "  ",
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
        "  ",
        ""
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        ""
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        " ",
        ""
    ]);
    _templateObject3 = function _templateObject3() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        " ",
        ""
    ]);
    _templateObject4 = function _templateObject4() {
        return data;
    };
    return data;
}
function _templateObject5() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        " ",
        ""
    ]);
    _templateObject5 = function _templateObject5() {
        return data;
    };
    return data;
}
function _templateObject6() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        " ",
        ""
    ]);
    _templateObject6 = function _templateObject6() {
        return data;
    };
    return data;
}
function _templateObject7() {
    var data = _taggedTemplateLiteral([
        "",
        " ",
        " ",
        ""
    ]);
    _templateObject7 = function _templateObject7() {
        return data;
    };
    return data;
}
function tempFun(tempStrs, g, x) {
    return g(x);
}
var a = tempFun(_templateObject(), function(x) {
    return x;
}, 10);
var b = tempFun(_templateObject1(), function(x) {
    return x;
}, 10);
var c = tempFun(_templateObject2(), function(x) {
    return x;
}, 10);
var d = tempFun(_templateObject3(), function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var e = tempFun(_templateObject4(), function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var f = tempFun(_templateObject5(), function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var g1 = tempFun(_templateObject6(), function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var h = tempFun(_templateObject7(), function(x) {
    return x;
}, function(x) {
    return x;
}, undefined);
