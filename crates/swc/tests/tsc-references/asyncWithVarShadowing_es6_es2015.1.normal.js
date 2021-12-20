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
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function fn1(x) {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _asyncToGenerator(function*(x) {
        var x;
    });
    return _fn1.apply(this, arguments);
}
function fn2(x) {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _asyncToGenerator(function*(x) {
        var x, z;
    });
    return _fn2.apply(this, arguments);
}
function fn3(x) {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _asyncToGenerator(function*(x) {
        var z;
    });
    return _fn3.apply(this, arguments);
}
function fn4(x) {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _asyncToGenerator(function*(x) {
        var x = y;
    });
    return _fn4.apply(this, arguments);
}
function fn5(x) {
    return _fn5.apply(this, arguments);
}
function _fn5() {
    _fn5 = _asyncToGenerator(function*(x) {
        var { x  } = y;
    });
    return _fn5.apply(this, arguments);
}
function fn6(x) {
    return _fn6.apply(this, arguments);
}
function _fn6() {
    _fn6 = _asyncToGenerator(function*(x) {
        var { x , z  } = y;
    });
    return _fn6.apply(this, arguments);
}
function fn7(x) {
    return _fn7.apply(this, arguments);
}
function _fn7() {
    _fn7 = _asyncToGenerator(function*(x) {
        var { x =y  } = y;
    });
    return _fn7.apply(this, arguments);
}
function fn8(x) {
    return _fn8.apply(this, arguments);
}
function _fn8() {
    _fn8 = _asyncToGenerator(function*(x) {
        var { z: x  } = y;
    });
    return _fn8.apply(this, arguments);
}
function fn9(x) {
    return _fn9.apply(this, arguments);
}
function _fn9() {
    _fn9 = _asyncToGenerator(function*(x) {
        var { z: { x  }  } = y;
    });
    return _fn9.apply(this, arguments);
}
function fn10(x) {
    return _fn10.apply(this, arguments);
}
function _fn10() {
    _fn10 = _asyncToGenerator(function*(x) {
        var { z: { x  } = y  } = y;
    });
    return _fn10.apply(this, arguments);
}
function fn11(x) {
    return _fn11.apply(this, arguments);
}
function _fn11() {
    _fn11 = _asyncToGenerator(function*(x) {
        var x = _extends({
        }, y);
    });
    return _fn11.apply(this, arguments);
}
function fn12(x) {
    return _fn12.apply(this, arguments);
}
function _fn12() {
    _fn12 = _asyncToGenerator(function*(x) {
        var [x] = y;
    });
    return _fn12.apply(this, arguments);
}
function fn13(x) {
    return _fn13.apply(this, arguments);
}
function _fn13() {
    _fn13 = _asyncToGenerator(function*(x) {
        var [x = y] = y;
    });
    return _fn13.apply(this, arguments);
}
function fn14(x) {
    return _fn14.apply(this, arguments);
}
function _fn14() {
    _fn14 = _asyncToGenerator(function*(x) {
        var [, x] = y;
    });
    return _fn14.apply(this, arguments);
}
function fn15(x) {
    return _fn15.apply(this, arguments);
}
function _fn15() {
    _fn15 = _asyncToGenerator(function*(x) {
        var [...x] = y;
    });
    return _fn15.apply(this, arguments);
}
function fn16(x) {
    return _fn16.apply(this, arguments);
}
function _fn16() {
    _fn16 = _asyncToGenerator(function*(x) {
        var [[x]] = y;
    });
    return _fn16.apply(this, arguments);
}
function fn17(x) {
    return _fn17.apply(this, arguments);
}
function _fn17() {
    _fn17 = _asyncToGenerator(function*(x) {
        var [[x] = y] = y;
    });
    return _fn17.apply(this, arguments);
}
function fn18(_) {
    return _fn18.apply(this, arguments);
}
function _fn18() {
    _fn18 = _asyncToGenerator(function*({ x  }) {
        var x;
    });
    return _fn18.apply(this, arguments);
}
function fn19(_) {
    return _fn19.apply(this, arguments);
}
function _fn19() {
    _fn19 = _asyncToGenerator(function*([x]) {
        var x;
    });
    return _fn19.apply(this, arguments);
}
function fn20(x) {
    return _fn20.apply(this, arguments);
}
function _fn20() {
    _fn20 = _asyncToGenerator(function*(x) {
        {
            var x;
        }
    });
    return _fn20.apply(this, arguments);
}
function fn21(x) {
    return _fn21.apply(this, arguments);
}
function _fn21() {
    _fn21 = _asyncToGenerator(function*(x) {
        if (y) {
            var x;
        }
    });
    return _fn21.apply(this, arguments);
}
function fn22(x) {
    return _fn22.apply(this, arguments);
}
function _fn22() {
    _fn22 = _asyncToGenerator(function*(x) {
        if (y) {
        } else {
            var x;
        }
    });
    return _fn22.apply(this, arguments);
}
function fn23(x) {
    return _fn23.apply(this, arguments);
}
function _fn23() {
    _fn23 = _asyncToGenerator(function*(x) {
        try {
            var x;
        } catch (e) {
        }
    });
    return _fn23.apply(this, arguments);
}
function fn24(x) {
    return _fn24.apply(this, arguments);
}
function _fn24() {
    _fn24 = _asyncToGenerator(function*(x) {
        try {
        } catch (e) {
            var x;
        }
    });
    return _fn24.apply(this, arguments);
}
function fn25(x) {
    return _fn25.apply(this, arguments);
}
function _fn25() {
    _fn25 = _asyncToGenerator(function*(x) {
        try {
        } catch (x1) {
            var x1;
        }
    });
    return _fn25.apply(this, arguments);
}
function fn26(x) {
    return _fn26.apply(this, arguments);
}
function _fn26() {
    _fn26 = _asyncToGenerator(function*(x) {
        try {
        } catch ({ x: x2  }) {
            var x2;
        }
    });
    return _fn26.apply(this, arguments);
}
function fn27(x) {
    return _fn27.apply(this, arguments);
}
function _fn27() {
    _fn27 = _asyncToGenerator(function*(x) {
        try {
        } finally{
            var x;
        }
    });
    return _fn27.apply(this, arguments);
}
function fn28(x) {
    return _fn28.apply(this, arguments);
}
function _fn28() {
    _fn28 = _asyncToGenerator(function*(x) {
        while(y){
            var x;
        }
    });
    return _fn28.apply(this, arguments);
}
function fn29(x) {
    return _fn29.apply(this, arguments);
}
function _fn29() {
    _fn29 = _asyncToGenerator(function*(x) {
        do {
            var x;
        }while (y)
    });
    return _fn29.apply(this, arguments);
}
function fn30(x) {
    return _fn30.apply(this, arguments);
}
function _fn30() {
    _fn30 = _asyncToGenerator(function*(x) {
        for(var x = y;;){
        }
    });
    return _fn30.apply(this, arguments);
}
function fn31(x) {
    return _fn31.apply(this, arguments);
}
function _fn31() {
    _fn31 = _asyncToGenerator(function*(x) {
        for(var { x  } = y;;){
        }
    });
    return _fn31.apply(this, arguments);
}
function fn32(x) {
    return _fn32.apply(this, arguments);
}
function _fn32() {
    _fn32 = _asyncToGenerator(function*(x) {
        for(;;){
            var x;
        }
    });
    return _fn32.apply(this, arguments);
}
function fn33(x) {
    return _fn33.apply(this, arguments);
}
function _fn33() {
    _fn33 = _asyncToGenerator(function*(x) {
        for(var x in y){
        }
    });
    return _fn33.apply(this, arguments);
}
function fn34(x) {
    return _fn34.apply(this, arguments);
}
function _fn34() {
    _fn34 = _asyncToGenerator(function*(x) {
        for(var z in y){
            var x;
        }
    });
    return _fn34.apply(this, arguments);
}
function fn35(x) {
    return _fn35.apply(this, arguments);
}
function _fn35() {
    _fn35 = _asyncToGenerator(function*(x) {
        for (var x of y){
        }
    });
    return _fn35.apply(this, arguments);
}
function fn36(x) {
    return _fn36.apply(this, arguments);
}
function _fn36() {
    _fn36 = _asyncToGenerator(function*(x) {
        for (var { x  } of y){
        }
    });
    return _fn36.apply(this, arguments);
}
function fn37(x) {
    return _fn37.apply(this, arguments);
}
function _fn37() {
    _fn37 = _asyncToGenerator(function*(x) {
        for (var z of y){
            var x;
        }
    });
    return _fn37.apply(this, arguments);
}
function fn38(x) {
    return _fn38.apply(this, arguments);
}
function _fn38() {
    _fn38 = _asyncToGenerator(function*(x) {
        switch(y){
            case y:
                var x;
        }
    });
    return _fn38.apply(this, arguments);
}
function fn39(x) {
    return _fn39.apply(this, arguments);
}
function _fn39() {
    _fn39 = _asyncToGenerator(function*(x) {
        foo: {
            var x;
            break foo;
        }
    });
    return _fn39.apply(this, arguments);
}
function fn40(x) {
    return _fn40.apply(this, arguments);
}
function _fn40() {
    _fn40 = _asyncToGenerator(function*(x) {
        try {
        } catch (e) {
            var x;
        }
    });
    return _fn40.apply(this, arguments);
}
