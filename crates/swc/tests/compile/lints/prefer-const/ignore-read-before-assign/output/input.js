var _object_without_properties = require("@swc/helpers/_/_object_without_properties");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
(function() {
    var x1 = 1;
    foo(x1);
});
(function() {
    for(var i in [
        1,
        2,
        3
    ]){
        foo(i);
    }
});
(function() {
    var tmp = 1, x2 = tmp === void 0 ? -1 : tmp, y2 = 2;
    y2 = 0;
});
(function() {
    var _ref = {
        a: 1,
        b: 2
    }, tmp = _ref.a, x3 = tmp === void 0 ? -1 : tmp, y3 = _ref.b;
    y3 = 0;
});
(function() {
    var x1 = 1;
    foo(x1);
})();
(function() {
    for(var i in [
        1,
        2,
        3
    ]){
        foo(i);
    }
})();
(function() {
    for(var _i = 0, _iter = [
        1,
        2,
        3
    ]; _i < _iter.length; _i++){
        var x1 = _iter[_i];
        foo(x1);
    }
})();
(function() {
    var tmp = 1, x1 = tmp === void 0 ? -1 : tmp, y = 2;
    y = 0;
})();
(function() {
    var f = function() {
        var g = x;
    }();
    f = 1;
});
(function() {
    var _ref = {
        a: 1,
        b: 2
    }, tmp = _ref.a, x1 = tmp === void 0 ? -1 : tmp, y = _ref.b;
    y = 0;
})();
(function() {
    var x1 = 0;
    {
        var x2 = 1;
        foo(x2);
    }
    x1 = 0;
});
(function() {
    for(var i = 0; i < 10; ++i){
        var x1 = 1;
        foo(x1);
    }
});
(function() {
    for(var i in [
        1,
        2,
        3
    ]){
        var x1 = 1;
        foo(x1);
    }
});
(function() {
    var foo1 = function foo1() {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = c5[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var b5 = _step.value;
                var l = void 0;
                l = 1;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
});
(function() {
    var foo1 = function foo1() {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = c[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var b = _step.value;
                var a1 = void 0;
                a1 = 1..a;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
});
(function() {
    var x1;
    x1 = 0;
});
(function() {
    switch(a){
        case 0:
            var x1;
            x1 = 0;
    }
});
(function() {
    var x1;
    x1 = 1;
})();
(function() {
    var _obj_a = obj.a, a1 = _obj_a === void 0 ? 0 : _obj_a, b = obj.b;
    b = 0;
    foo(a1, b);
});
(function() {
    var _ref = {
        a: {
            b: 1,
            c: 2
        }
    }, _ref_a = _ref.a, b = _ref_a.b, c1 = _ref_a.c;
    b = 3;
});
(function() {
    var _ref = {
        a: {
            b: 1,
            c: 2
        }
    }, _ref_a = _ref.a, b = _ref_a.b, c1 = _ref_a.c;
});
(function() {
    var a1 = 1;
});
(function() {
    var predicate;
    var ref, ref1;
    ref = _sliced_to_array._(foo(), 2), ref1 = ref[1], returnType = ref1.foo, predicate = ref1.predicate, ref1, ref;
});
(function() {
    var x1 = 'x', y = 'y';
});
var timer;
function initialize() {
    if (foo()) {
        clearInterval(timer);
    }
}
timer = setInterval(initialize, 100);
(function() {
    var _ref = {}, l = _ref.l, rest = _object_without_properties._(_ref, [
        "l"
    ]);
    l = 1;
});
// valid
(function() {
    var x1 = 0;
});
(function() {
    var x1;
});
(function() {
    var x1;
    {
        x1 = 0;
    }
    foo(x1);
});
(function() {
    var x1 = 0;
    x1 = 1;
});
(function() {
    var i = 0;
    i++;
});
