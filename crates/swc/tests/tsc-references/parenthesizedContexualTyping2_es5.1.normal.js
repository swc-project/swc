// These tests ensure that in cases where it may *appear* that a value has a type,
// they actually are properly being contextually typed. The way we test this is
// that we invoke contextually typed arguments with type arguments.
// Since 'any' cannot be invoked with type arguments, we should get errors
// back if contextual typing is not taking effect.
function fun() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
    return undefined;
}
var a = fun(function(x) {
    x(undefined);
    return x;
}, 10);
var b = fun(function(x) {
    x(undefined);
    return x;
}, 10);
var c = fun(function(x) {
    x(undefined);
    return x;
}, 10);
var d = fun(function(x) {
    x(undefined);
    return x;
}, 10);
var e = fun(function(x) {
    x(undefined);
    return x;
}, function(x) {
    x(undefined);
    return x;
}, 10);
var f = fun(function(x) {
    x(undefined);
    return x;
}, function(x) {
    x(undefined);
    return x;
}, 10);
var g = fun(function(x) {
    x(undefined);
    return x;
}, function(x) {
    x(undefined);
    return x;
}, 10);
var h = fun(function(x) {
    x(undefined);
    return x;
}, function(x) {
    x(undefined);
    return x;
}, 10);
// Ternaries in parens
var i = fun(Math.random() < 0.5 ? function(x) {
    x(undefined);
    return x;
} : function(x) {
    return undefined;
}, 10);
var j = fun(Math.random() < 0.5 ? function(x) {
    x(undefined);
    return x;
} : function(x) {
    return undefined;
}, 10);
var k = fun(Math.random() < 0.5 ? function(x) {
    x(undefined);
    return x;
} : function(x) {
    return undefined;
}, function(x) {
    x(undefined);
    return x;
}, 10);
var l = fun(Math.random() < 0.5 ? function(x) {
    x(undefined);
    return x;
} : function(x) {
    return undefined;
}, function(x) {
    x(undefined);
    return x;
}, 10);
var lambda1 = function(x) {
    x(undefined);
    return x;
};
var lambda2 = function(x) {
    x(undefined);
    return x;
};
var obj1 = {
    x: function(x) {
        return x, undefined;
    },
    y: function(y) {
        return y, undefined;
    }
};
var obj2 = {
    x: function(x) {
        return x, undefined;
    },
    y: function(y) {
        return y, undefined;
    }
};
