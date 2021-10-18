function fun(g, x) {
    return g(x);
}
var a = fun(function(x) {
    return x;
}, 10);
var b = fun(function(x) {
    return x;
}, 10);
var c = fun(function(x) {
    return x;
}, 10);
var d = fun(function(x) {
    return x;
}, 10);
var e = fun(function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var f = fun(function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var g = fun(function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
var h = fun(function(x) {
    return x;
}, function(x) {
    return x;
}, 10);
// Ternaries in parens
var i = fun(Math.random() < 0.5 ? function(x) {
    return x;
} : function(x) {
    return undefined;
}, 10);
var j = fun(Math.random() < 0.5 ? function(x) {
    return x;
} : function(x) {
    return undefined;
}, 10);
var k = fun(Math.random() < 0.5 ? function(x) {
    return x;
} : function(x) {
    return undefined;
}, function(x) {
    return x;
}, 10);
var l = fun(Math.random() < 0.5 ? function(x) {
    return x;
} : function(x) {
    return undefined;
}, function(x) {
    return x;
}, 10);
var lambda1 = function(x) {
    return x;
};
var lambda2 = function(x) {
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
