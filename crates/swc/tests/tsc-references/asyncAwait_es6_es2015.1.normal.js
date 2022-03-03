function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function f0() {
    return _f0.apply(this, arguments);
}
function _f0() {
    _f0 = _asyncToGenerator(function*() {});
    return _f0.apply(this, arguments);
}
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _asyncToGenerator(function*() {});
    return _f1.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _asyncToGenerator(function*() {});
    return _f3.apply(this, arguments);
}
let f4 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
let f5 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
let f6 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
let f7 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
let f8 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f8() {
        return _ref.apply(this, arguments);
    };
}();
let f9 = function() {
    var _ref = _asyncToGenerator(function*() {});
    return function f9() {
        return _ref.apply(this, arguments);
    };
}();
let f10 = function() {
    var _ref = _asyncToGenerator(function*() {
        return p;
    });
    return function f10() {
        return _ref.apply(this, arguments);
    };
}();
let f11 = function() {
    var _ref = _asyncToGenerator(function*() {
        return mp;
    });
    return function f11() {
        return _ref.apply(this, arguments);
    };
}();
let f12 = function() {
    var _ref = _asyncToGenerator(function*() {
        return mp;
    });
    return function f12() {
        return _ref.apply(this, arguments);
    };
}();
let f13 = function() {
    var _ref = _asyncToGenerator(function*() {
        return p;
    });
    return function f13() {
        return _ref.apply(this, arguments);
    };
}();
let o = {
    m1 () {
        return _asyncToGenerator(function*() {})();
    },
    m2 () {
        return _asyncToGenerator(function*() {})();
    },
    m3 () {
        return _asyncToGenerator(function*() {})();
    }
};
class C {
    m1() {
        return _asyncToGenerator(function*() {})();
    }
    m2() {
        return _asyncToGenerator(function*() {})();
    }
    m3() {
        return _asyncToGenerator(function*() {})();
    }
    static m4() {
        return _asyncToGenerator(function*() {})();
    }
    static m5() {
        return _asyncToGenerator(function*() {})();
    }
    static m6() {
        return _asyncToGenerator(function*() {})();
    }
}
var M;
(function(M1) {
    function f15() {
        return _f11.apply(this, arguments);
    }
    function _f11() {
        _f11 = _asyncToGenerator(function*() {});
        return _f11.apply(this, arguments);
    }
    M1.f1 = f15;
})(M || (M = {}));
function f14() {
    return _f14.apply(this, arguments);
}
function _f14() {
    _f14 = _asyncToGenerator(function*() {
        block: {
            yield 1;
            break block;
        }
    });
    return _f14.apply(this, arguments);
}
