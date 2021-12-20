function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
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
            _next(void 0);
        });
    };
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _fn1() {
    return (_fn1 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn2() {
    return (_fn2 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn3() {
    return (_fn3 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn4() {
    return (_fn4 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn5() {
    return (_fn5 = _asyncToGenerator(function*(x) {
        var { x  } = y;
    })).apply(this, arguments);
}
function _fn6() {
    return (_fn6 = _asyncToGenerator(function*(x) {
        var { x , z  } = y;
    })).apply(this, arguments);
}
function _fn7() {
    return (_fn7 = _asyncToGenerator(function*(x) {
        var { x =y  } = y;
    })).apply(this, arguments);
}
function _fn8() {
    return (_fn8 = _asyncToGenerator(function*(x) {
        var { z: x  } = y;
    })).apply(this, arguments);
}
function _fn9() {
    return (_fn9 = _asyncToGenerator(function*(x) {
        var { z: { x  }  } = y;
    })).apply(this, arguments);
}
function _fn10() {
    return (_fn10 = _asyncToGenerator(function*(x) {
        var { z: { x  } = y  } = y;
    })).apply(this, arguments);
}
function _fn11() {
    return (_fn11 = _asyncToGenerator(function*(x) {
        _extends({
        }, y);
    })).apply(this, arguments);
}
function _fn12() {
    return (_fn12 = _asyncToGenerator(function*(x) {
        var [x] = y;
    })).apply(this, arguments);
}
function _fn13() {
    return (_fn13 = _asyncToGenerator(function*(x) {
        var [x = y] = y;
    })).apply(this, arguments);
}
function _fn14() {
    return (_fn14 = _asyncToGenerator(function*(x) {
        var [, x] = y;
    })).apply(this, arguments);
}
function _fn15() {
    return (_fn15 = _asyncToGenerator(function*(x) {
        var [...x] = y;
    })).apply(this, arguments);
}
function _fn16() {
    return (_fn16 = _asyncToGenerator(function*(x) {
        var [[x]] = y;
    })).apply(this, arguments);
}
function _fn17() {
    return (_fn17 = _asyncToGenerator(function*(x) {
        var [[x] = y] = y;
    })).apply(this, arguments);
}
function _fn18() {
    return (_fn18 = _asyncToGenerator(function*({ x  }) {
    })).apply(this, arguments);
}
function _fn19() {
    return (_fn19 = _asyncToGenerator(function*([x]) {
    })).apply(this, arguments);
}
function _fn20() {
    return (_fn20 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn21() {
    return (_fn21 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn22() {
    return (_fn22 = _asyncToGenerator(function*(x) {
    })).apply(this, arguments);
}
function _fn23() {
    return (_fn23 = _asyncToGenerator(function*(x) {
        try {
        } catch (e) {
        }
    })).apply(this, arguments);
}
function _fn24() {
    return (_fn24 = _asyncToGenerator(function*(x) {
        try {
        } catch (e) {
        }
    })).apply(this, arguments);
}
function _fn25() {
    return (_fn25 = _asyncToGenerator(function*(x) {
        try {
        } catch (x1) {
        }
    })).apply(this, arguments);
}
function _fn26() {
    return (_fn26 = _asyncToGenerator(function*(x) {
        try {
        } catch ({ x: x2  }) {
        }
    })).apply(this, arguments);
}
function _fn27() {
    return (_fn27 = _asyncToGenerator(function*(x) {
        try {
        } finally{
        }
    })).apply(this, arguments);
}
function _fn28() {
    return (_fn28 = _asyncToGenerator(function*(x) {
        for(; y;);
    })).apply(this, arguments);
}
function _fn29() {
    return (_fn29 = _asyncToGenerator(function*(x) {
        do ;
        while (y)
    })).apply(this, arguments);
}
function _fn30() {
    return (_fn30 = _asyncToGenerator(function*(x) {
        for(;;);
    })).apply(this, arguments);
}
function _fn31() {
    return (_fn31 = _asyncToGenerator(function*(x) {
        for(var { x  } = y;;);
    })).apply(this, arguments);
}
function _fn32() {
    return (_fn32 = _asyncToGenerator(function*(x) {
        for(;;);
    })).apply(this, arguments);
}
function _fn33() {
    return (_fn33 = _asyncToGenerator(function*(x) {
        for(var x in y);
    })).apply(this, arguments);
}
function _fn34() {
    return (_fn34 = _asyncToGenerator(function*(x) {
        for(var z in y);
    })).apply(this, arguments);
}
function _fn35() {
    return (_fn35 = _asyncToGenerator(function*(x) {
        for (var x of y);
    })).apply(this, arguments);
}
function _fn36() {
    return (_fn36 = _asyncToGenerator(function*(x) {
        for (var { x  } of y);
    })).apply(this, arguments);
}
function _fn37() {
    return (_fn37 = _asyncToGenerator(function*(x) {
        for (var z of y);
    })).apply(this, arguments);
}
function _fn38() {
    return (_fn38 = _asyncToGenerator(function*(x) {
        switch(y){
            case y:
        }
    })).apply(this, arguments);
}
function _fn39() {
    return (_fn39 = _asyncToGenerator(function*(x) {
        foo: break foo;
    })).apply(this, arguments);
}
function _fn40() {
    return (_fn40 = _asyncToGenerator(function*(x) {
        try {
        } catch (e) {
        }
    })).apply(this, arguments);
}
