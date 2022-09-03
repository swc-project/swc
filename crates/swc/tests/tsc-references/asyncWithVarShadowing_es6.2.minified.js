//// [asyncWithVarShadowing_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
function fn1(x) {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    return (_fn1 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn2(x) {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    return (_fn2 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn3(x) {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    return (_fn3 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn4(x) {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    return (_fn4 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn5(x) {
    return _fn5.apply(this, arguments);
}
function _fn5() {
    return (_fn5 = _async_to_generator(function*(x) {
        var { x  } = y;
    })).apply(this, arguments);
}
function fn6(x) {
    return _fn6.apply(this, arguments);
}
function _fn6() {
    return (_fn6 = _async_to_generator(function*(x) {
        var { x , z  } = y;
    })).apply(this, arguments);
}
function fn7(x) {
    return _fn7.apply(this, arguments);
}
function _fn7() {
    return (_fn7 = _async_to_generator(function*(x) {
        var { x =y  } = y;
    })).apply(this, arguments);
}
function fn8(x) {
    return _fn8.apply(this, arguments);
}
function _fn8() {
    return (_fn8 = _async_to_generator(function*(x) {
        var { z: x  } = y;
    })).apply(this, arguments);
}
function fn9(x) {
    return _fn9.apply(this, arguments);
}
function _fn9() {
    return (_fn9 = _async_to_generator(function*(x) {
        var { z: { x  }  } = y;
    })).apply(this, arguments);
}
function fn10(x) {
    return _fn10.apply(this, arguments);
}
function _fn10() {
    return (_fn10 = _async_to_generator(function*(x) {
        var { z: { x  } = y  } = y;
    })).apply(this, arguments);
}
function fn11(x) {
    return _fn11.apply(this, arguments);
}
function _fn11() {
    return (_fn11 = _async_to_generator(function*(x) {
        _extends({}, y);
    })).apply(this, arguments);
}
function fn12(x) {
    return _fn12.apply(this, arguments);
}
function _fn12() {
    return (_fn12 = _async_to_generator(function*(x) {
        var [x] = y;
    })).apply(this, arguments);
}
function fn13(x) {
    return _fn13.apply(this, arguments);
}
function _fn13() {
    return (_fn13 = _async_to_generator(function*(x) {
        var [x = y] = y;
    })).apply(this, arguments);
}
function fn14(x) {
    return _fn14.apply(this, arguments);
}
function _fn14() {
    return (_fn14 = _async_to_generator(function*(x) {
        var [, x] = y;
    })).apply(this, arguments);
}
function fn15(x) {
    return _fn15.apply(this, arguments);
}
function _fn15() {
    return (_fn15 = _async_to_generator(function*(x) {
        var [...x] = y;
    })).apply(this, arguments);
}
function fn16(x) {
    return _fn16.apply(this, arguments);
}
function _fn16() {
    return (_fn16 = _async_to_generator(function*(x) {
        var [[x]] = y;
    })).apply(this, arguments);
}
function fn17(x) {
    return _fn17.apply(this, arguments);
}
function _fn17() {
    return (_fn17 = _async_to_generator(function*(x) {
        var [[x] = y] = y;
    })).apply(this, arguments);
}
function fn18(_) {
    return _fn18.apply(this, arguments);
}
function _fn18() {
    return (_fn18 = _async_to_generator(function*({ x  }) {})).apply(this, arguments);
}
function fn19(_) {
    return _fn19.apply(this, arguments);
}
function _fn19() {
    return (_fn19 = _async_to_generator(function*([x]) {})).apply(this, arguments);
}
function fn20(x) {
    return _fn20.apply(this, arguments);
}
function _fn20() {
    return (_fn20 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn21(x) {
    return _fn21.apply(this, arguments);
}
function _fn21() {
    return (_fn21 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn22(x) {
    return _fn22.apply(this, arguments);
}
function _fn22() {
    return (_fn22 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn23(x) {
    return _fn23.apply(this, arguments);
}
function _fn23() {
    return (_fn23 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn24(x) {
    return _fn24.apply(this, arguments);
}
function _fn24() {
    return (_fn24 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn25(x) {
    return _fn25.apply(this, arguments);
}
function _fn25() {
    return (_fn25 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn26(x) {
    return _fn26.apply(this, arguments);
}
function _fn26() {
    return (_fn26 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn27(x) {
    return _fn27.apply(this, arguments);
}
function _fn27() {
    return (_fn27 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn28(x) {
    return _fn28.apply(this, arguments);
}
function _fn28() {
    return (_fn28 = _async_to_generator(function*(x) {
        for(; y;);
    })).apply(this, arguments);
}
function fn29(x) {
    return _fn29.apply(this, arguments);
}
function _fn29() {
    return (_fn29 = _async_to_generator(function*(x) {
        do ;
        while (y)
    })).apply(this, arguments);
}
function fn30(x) {
    return _fn30.apply(this, arguments);
}
function _fn30() {
    return (_fn30 = _async_to_generator(function*(x) {
        for(;;);
    })).apply(this, arguments);
}
function fn31(x) {
    return _fn31.apply(this, arguments);
}
function _fn31() {
    return (_fn31 = _async_to_generator(function*(x) {
        for(var { x  } = y;;);
    })).apply(this, arguments);
}
function fn32(x) {
    return _fn32.apply(this, arguments);
}
function _fn32() {
    return (_fn32 = _async_to_generator(function*(x) {
        for(;;);
    })).apply(this, arguments);
}
function fn33(x) {
    return _fn33.apply(this, arguments);
}
function _fn33() {
    return (_fn33 = _async_to_generator(function*(x) {
        for(var x in y);
    })).apply(this, arguments);
}
function fn34(x) {
    return _fn34.apply(this, arguments);
}
function _fn34() {
    return (_fn34 = _async_to_generator(function*(x) {
        for(var z in y);
    })).apply(this, arguments);
}
function fn35(x) {
    return _fn35.apply(this, arguments);
}
function _fn35() {
    return (_fn35 = _async_to_generator(function*(x) {
        for (var x of y);
    })).apply(this, arguments);
}
function fn36(x) {
    return _fn36.apply(this, arguments);
}
function _fn36() {
    return (_fn36 = _async_to_generator(function*(x) {
        for (var { x  } of y);
    })).apply(this, arguments);
}
function fn37(x) {
    return _fn37.apply(this, arguments);
}
function _fn37() {
    return (_fn37 = _async_to_generator(function*(x) {
        for (var z of y);
    })).apply(this, arguments);
}
function fn38(x) {
    return _fn38.apply(this, arguments);
}
function _fn38() {
    return (_fn38 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn39(x) {
    return _fn39.apply(this, arguments);
}
function _fn39() {
    return (_fn39 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
function fn40(x) {
    return _fn40.apply(this, arguments);
}
function _fn40() {
    return (_fn40 = _async_to_generator(function*(x) {})).apply(this, arguments);
}
