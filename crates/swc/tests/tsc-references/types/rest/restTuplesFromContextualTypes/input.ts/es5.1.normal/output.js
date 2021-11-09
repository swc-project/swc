function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for(var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
(function(a, b, c) {
}).apply(this, _toConsumableArray(t1));
(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t1));
(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t1));
(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t1));
(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t1));
f1(function(a, b, c) {
});
f1(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
});
f1(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
});
f1(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
});
f1(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
});
(function(a, b, c) {
}).apply(this, _toConsumableArray(t2));
(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t2));
(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t2));
(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t2));
(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
}).apply(this, _toConsumableArray(t2));
f2(function(a, b, c) {
});
f2(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
});
f2(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
});
f2(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
});
f2(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
});
(function(a, b, c) {
}).apply(this, [
    1
].concat(_toConsumableArray(t3)));
(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
}).apply(this, [
    1
].concat(_toConsumableArray(t3)));
(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
}).apply(this, [
    1
].concat(_toConsumableArray(t3)));
(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
}).apply(this, [
    1
].concat(_toConsumableArray(t3)));
(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
}).apply(this, [
    1
].concat(_toConsumableArray(t3)));
f3(function(a, b, c) {
});
f3(function() {
    for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
        x[_key] = arguments[_key];
    }
});
f3(function(a) {
    for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        x[_key - 1] = arguments[_key];
    }
});
f3(function(a, b) {
    for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        x[_key - 2] = arguments[_key];
    }
});
f3(function(a, b, c) {
    for(var _len = arguments.length, x = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++){
        x[_key - 3] = arguments[_key];
    }
});
function f4(t) {
    var f = function f(cb) {
    };
    (function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
    }).apply(this, _toConsumableArray(t));
    (function(a) {
        for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            x[_key - 1] = arguments[_key];
        }
    }).apply(this, [
        1
    ].concat(_toConsumableArray(t)));
    (function(a) {
        for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            x[_key - 1] = arguments[_key];
        }
    }).apply(this, [
        1,
        2
    ].concat(_toConsumableArray(t)));
    f(function() {
        for(var _len = arguments.length, x = new Array(_len), _key = 0; _key < _len; _key++){
            x[_key] = arguments[_key];
        }
    });
    f(function(a) {
        for(var _len = arguments.length, x = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            x[_key - 1] = arguments[_key];
        }
    });
    f(function(a, b) {
        for(var _len = arguments.length, x = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            x[_key - 2] = arguments[_key];
        }
    });
}
var g0 = f5(function() {
    return "hello";
});
var g1 = f5(function(x, y) {
    return 42;
});
var g2 = f5(function(x, y) {
    return 42;
});
var g3 = f5(function(x, y) {
    return x + y;
});
var g4 = f5(function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return true;
});
var g5 = pipe(function() {
    return true;
}, function(b) {
    return 42;
});
var g6 = pipe(function(x) {
    return "hello";
}, function(s) {
    return s.length;
});
var g7 = pipe(function(x, y) {
    return 42;
}, function(x) {
    return "" + x;
});
var g8 = pipe(function(x, y) {
    return 42;
}, function(x) {
    return "" + x;
});
(function foo(a, b) {
}).apply(this, _toConsumableArray(tuple));
(function foo() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
})(1, '');
take(function() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
});
var funcUnionTupleNoRest = function(num, strOrErr) {
    return num;
};
var funcUnionTupleRest = function() {
    for(var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++){
        params[_key] = arguments[_key];
    }
    var _params = _slicedToArray(params, 2), num = _params[0], strOrErr = _params[1];
    return num;
};
