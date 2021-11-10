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
    _f0 = _asyncToGenerator(function*() {
    });
    return _f0.apply(this, arguments);
}
function f14() {
    return _f11.apply(this, arguments);
}
function _f11() {
    _f11 = _asyncToGenerator(function*() {
    });
    return _f11.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _asyncToGenerator(function*() {
    });
    return _f3.apply(this, arguments);
}
let f4 = function() {
    var _ref = _asyncToGenerator(function*() {
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
let f5 = function() {
    var _ref = _asyncToGenerator(function*() {
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
let f6 = function() {
    var _ref = _asyncToGenerator(function*() {
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
let f7 = _asyncToGenerator(function*() {
});
let f8 = _asyncToGenerator(function*() {
});
let f9 = _asyncToGenerator(function*() {
});
let f10 = _asyncToGenerator(function*() {
    return p;
});
let f11 = _asyncToGenerator(function*() {
    return mp;
});
let f12 = _asyncToGenerator(function*() {
    return mp;
});
let f13 = _asyncToGenerator(function*() {
    return p;
});
let o = {
    m1 () {
        return _asyncToGenerator(function*() {
        })();
    },
    m2 () {
        return _asyncToGenerator(function*() {
        })();
    },
    m3 () {
        return _asyncToGenerator(function*() {
        })();
    }
};
class C {
    m1() {
        return _asyncToGenerator(function*() {
        })();
    }
    m2() {
        return _asyncToGenerator(function*() {
        })();
    }
    m3() {
        return _asyncToGenerator(function*() {
        })();
    }
    static m4() {
        return _asyncToGenerator(function*() {
        })();
    }
    static m5() {
        return _asyncToGenerator(function*() {
        })();
    }
    static m6() {
        return _asyncToGenerator(function*() {
        })();
    }
}
var M1;
(function(M) {
    function f1() {
        return _f1.apply(this, arguments);
    }
    function _f1() {
        _f1 = _asyncToGenerator(function*() {
        });
        return _f1.apply(this, arguments);
    }
    M.f1 = f1;
})(M1 || (M1 = {
}));
// @target: ES5
// @lib: es5,es2015.promise
// @isolatedModules: true
export { };
