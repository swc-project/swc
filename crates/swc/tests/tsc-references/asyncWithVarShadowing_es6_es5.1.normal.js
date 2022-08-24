// @target: es2015
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/20461
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function fn1(x) {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _fn1.apply(this, arguments);
}
function fn2(x) {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _async_to_generator(function(x) {
        var x, z;
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _fn2.apply(this, arguments);
}
function fn3(x) {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _async_to_generator(function(x) {
        var z;
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _fn3.apply(this, arguments);
}
function fn4(x) {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            x = y;
            return [
                2
            ];
        });
    });
    return _fn4.apply(this, arguments);
}
function fn5(x) {
    return _fn5.apply(this, arguments);
}
function _fn5() {
    _fn5 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            x = y.x;
            return [
                2
            ];
        });
    });
    return _fn5.apply(this, arguments);
}
function fn6(x) {
    return _fn6.apply(this, arguments);
}
function _fn6() {
    _fn6 = _async_to_generator(function(x) {
        var x, z;
        return _ts_generator(this, function(_state) {
            x = y.x, z = y.z;
            return [
                2
            ];
        });
    });
    return _fn6.apply(this, arguments);
}
function fn7(x) {
    return _fn7.apply(this, arguments);
}
function _fn7() {
    _fn7 = _async_to_generator(function(x) {
        var _x, x;
        return _ts_generator(this, function(_state) {
            _x = y.x, x = _x === void 0 ? y : _x;
            return [
                2
            ];
        });
    });
    return _fn7.apply(this, arguments);
}
function fn8(x) {
    return _fn8.apply(this, arguments);
}
function _fn8() {
    _fn8 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            x = y.z;
            return [
                2
            ];
        });
    });
    return _fn8.apply(this, arguments);
}
function fn9(x) {
    return _fn9.apply(this, arguments);
}
function _fn9() {
    _fn9 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            x = y.z.x;
            return [
                2
            ];
        });
    });
    return _fn9.apply(this, arguments);
}
function fn10(x) {
    return _fn10.apply(this, arguments);
}
function _fn10() {
    _fn10 = _async_to_generator(function(x) {
        var tmp, x;
        return _ts_generator(this, function(_state) {
            tmp = y.z, x = (tmp === void 0 ? y : tmp).x;
            return [
                2
            ];
        });
    });
    return _fn10.apply(this, arguments);
}
function fn11(x) {
    return _fn11.apply(this, arguments);
}
function _fn11() {
    _fn11 = _async_to_generator(function(x) {
        var x, _tmp;
        return _ts_generator(this, function(_state) {
            _tmp = {};
            x = _extends(_tmp, y);
            return [
                2
            ];
        });
    });
    return _fn11.apply(this, arguments);
}
function fn12(x) {
    return _fn12.apply(this, arguments);
}
function _fn12() {
    _fn12 = _async_to_generator(function(x) {
        var _y, x;
        return _ts_generator(this, function(_state) {
            _y = _sliced_to_array(y, 1), x = _y[0];
            return [
                2
            ];
        });
    });
    return _fn12.apply(this, arguments);
}
function fn13(x) {
    return _fn13.apply(this, arguments);
}
function _fn13() {
    _fn13 = _async_to_generator(function(x) {
        var _y, tmp, x;
        return _ts_generator(this, function(_state) {
            _y = _sliced_to_array(y, 1), tmp = _y[0], x = tmp === void 0 ? y : tmp;
            return [
                2
            ];
        });
    });
    return _fn13.apply(this, arguments);
}
function fn14(x) {
    return _fn14.apply(this, arguments);
}
function _fn14() {
    _fn14 = _async_to_generator(function(x) {
        var _y, x;
        return _ts_generator(this, function(_state) {
            _y = _sliced_to_array(y, 2), x = _y[1];
            return [
                2
            ];
        });
    });
    return _fn14.apply(this, arguments);
}
function fn15(x) {
    return _fn15.apply(this, arguments);
}
function _fn15() {
    _fn15 = _async_to_generator(function(x) {
        var _y, x;
        return _ts_generator(this, function(_state) {
            _y = _to_array(y), x = _y.slice(0);
            return [
                2
            ];
        });
    });
    return _fn15.apply(this, arguments);
}
function fn16(x) {
    return _fn16.apply(this, arguments);
}
function _fn16() {
    _fn16 = _async_to_generator(function(x) {
        var _y, ref, x;
        return _ts_generator(this, function(_state) {
            _y = _sliced_to_array(y, 1), ref = _sliced_to_array(_y[0], 1), x = ref[0];
            return [
                2
            ];
        });
    });
    return _fn16.apply(this, arguments);
}
function fn17(x) {
    return _fn17.apply(this, arguments);
}
function _fn17() {
    _fn17 = _async_to_generator(function(x) {
        var _y, tmp, ref, x;
        return _ts_generator(this, function(_state) {
            _y = _sliced_to_array(y, 1), tmp = _y[0], ref = _sliced_to_array(tmp === void 0 ? y : tmp, 1), x = ref[0];
            return [
                2
            ];
        });
    });
    return _fn17.apply(this, arguments);
}
function fn18(_) {
    return _fn18.apply(this, arguments);
}
function _fn18() {
    _fn18 = _async_to_generator(function(param) {
        var x, x;
        return _ts_generator(this, function(_state) {
            x = param.x;
            return [
                2
            ];
        });
    });
    return _fn18.apply(this, arguments);
}
function fn19(_) {
    return _fn19.apply(this, arguments);
}
function _fn19() {
    _fn19 = _async_to_generator(function(param) {
        var _param, x, x;
        return _ts_generator(this, function(_state) {
            _param = _sliced_to_array(param, 1), x = _param[0];
            return [
                2
            ];
        });
    });
    return _fn19.apply(this, arguments);
}
function fn20(x) {
    return _fn20.apply(this, arguments);
}
function _fn20() {
    _fn20 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn20.apply(this, arguments);
}
function fn21(x) {
    return _fn21.apply(this, arguments);
}
function _fn21() {
    _fn21 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            if (y) {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn21.apply(this, arguments);
}
function fn22(x) {
    return _fn22.apply(this, arguments);
}
function _fn22() {
    _fn22 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            if (y) {} else {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn22.apply(this, arguments);
}
function fn23(x) {
    return _fn23.apply(this, arguments);
}
function _fn23() {
    _fn23 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            try {
                ;
            } catch (e) {}
            return [
                2
            ];
        });
    });
    return _fn23.apply(this, arguments);
}
function fn24(x) {
    return _fn24.apply(this, arguments);
}
function _fn24() {
    _fn24 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            try {} catch (e) {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn24.apply(this, arguments);
}
function fn25(x) {
    return _fn25.apply(this, arguments);
}
function _fn25() {
    _fn25 = _async_to_generator(function(x) {
        var x1;
        return _ts_generator(this, function(_state) {
            try {} catch (x1) {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn25.apply(this, arguments);
}
function fn26(x) {
    return _fn26.apply(this, arguments);
}
function _fn26() {
    _fn26 = _async_to_generator(function(x) {
        var x1, x1;
        return _ts_generator(this, function(_state) {
            try {} catch (param) {
                x1 = param.x;
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn26.apply(this, arguments);
}
function fn27(x) {
    return _fn27.apply(this, arguments);
}
function _fn27() {
    _fn27 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            try {} finally{
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn27.apply(this, arguments);
}
function fn28(x) {
    return _fn28.apply(this, arguments);
}
function _fn28() {
    _fn28 = _async_to_generator(function(x) {
        return _ts_generator(this, function(_state) {
            while(y){
                var x;
            }
            return [
                2
            ];
        });
    });
    return _fn28.apply(this, arguments);
}
function fn29(x) {
    return _fn29.apply(this, arguments);
}
function _fn29() {
    _fn29 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            do {
                ;
            }while (y);
            return [
                2
            ];
        });
    });
    return _fn29.apply(this, arguments);
}
function fn30(x) {
    return _fn30.apply(this, arguments);
}
function _fn30() {
    _fn30 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            for(x = y;;){}
            return [
                2
            ];
        });
    });
    return _fn30.apply(this, arguments);
}
function fn31(x) {
    return _fn31.apply(this, arguments);
}
function _fn31() {
    _fn31 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            for(x = y.x;;){}
            return [
                2
            ];
        });
    });
    return _fn31.apply(this, arguments);
}
function fn32(x) {
    return _fn32.apply(this, arguments);
}
function _fn32() {
    _fn32 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            for(;;){
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn32.apply(this, arguments);
}
function fn33(x) {
    return _fn33.apply(this, arguments);
}
function _fn33() {
    _fn33 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            for(var x in y){}
            return [
                2
            ];
        });
    });
    return _fn33.apply(this, arguments);
}
function fn34(x) {
    return _fn34.apply(this, arguments);
}
function _fn34() {
    _fn34 = _async_to_generator(function(x) {
        var z, x;
        return _ts_generator(this, function(_state) {
            for(var z in y){
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn34.apply(this, arguments);
}
function fn35(x) {
    return _fn35.apply(this, arguments);
}
function _fn35() {
    _fn35 = _async_to_generator(function(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;
        return _ts_generator(this, function(_state) {
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(_iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    x = _step.value;
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
            return [
                2
            ];
        });
    });
    return _fn35.apply(this, arguments);
}
function fn36(x) {
    return _fn36.apply(this, arguments);
}
function _fn36() {
    _fn36 = _async_to_generator(function(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;
        return _ts_generator(this, function(_state) {
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(_iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    x = _step.value.x;
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
            return [
                2
            ];
        });
    });
    return _fn36.apply(this, arguments);
}
function fn37(x) {
    return _fn37.apply(this, arguments);
}
function _fn37() {
    _fn37 = _async_to_generator(function(x) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, z, x;
        return _ts_generator(this, function(_state) {
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(_iterator = y[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    z = _step.value;
                    ;
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
            return [
                2
            ];
        });
    });
    return _fn37.apply(this, arguments);
}
function fn38(x) {
    return _fn38.apply(this, arguments);
}
function _fn38() {
    _fn38 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            switch(y){
                case y:
                    ;
            }
            return [
                2
            ];
        });
    });
    return _fn38.apply(this, arguments);
}
function fn39(x) {
    return _fn39.apply(this, arguments);
}
function _fn39() {
    _fn39 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            foo: {
                ;
                break foo;
            }
            return [
                2
            ];
        });
    });
    return _fn39.apply(this, arguments);
}
function fn40(x) {
    return _fn40.apply(this, arguments);
}
function _fn40() {
    _fn40 = _async_to_generator(function(x) {
        var x;
        return _ts_generator(this, function(_state) {
            try {} catch (e) {
                ;
            }
            return [
                2
            ];
        });
    });
    return _fn40.apply(this, arguments);
}
