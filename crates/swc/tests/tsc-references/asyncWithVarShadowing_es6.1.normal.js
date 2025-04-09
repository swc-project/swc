//// [asyncWithVarShadowing_es6.ts]
// https://github.com/Microsoft/TypeScript/issues/20461
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
function fn1(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var x;
    })();
}
function fn2(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var x, z;
    })();
}
function fn3(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var z;
    })();
}
function fn4(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var x = y;
    })();
}
function fn5(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { x } = y;
    })();
}
function fn6(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { x, z } = y;
    })();
}
function fn7(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { x = y } = y;
    })();
}
function fn8(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { z: x } = y;
    })();
}
function fn9(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { z: { x } } = y;
    })();
}
function fn10(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var { z: { x } = y } = y;
    })();
}
function fn11(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var x = _extends({}, _object_destructuring_empty(y));
    })();
}
function fn12(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [x] = y;
    })();
}
function fn13(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [x = y] = y;
    })();
}
function fn14(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [, x] = y;
    })();
}
function fn15(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [...x] = y;
    })();
}
function fn16(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [[x]] = y;
    })();
}
function fn17(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        var [[x] = y] = y;
    })();
}
function fn18(_0) {
    return /*#__PURE__*/ _async_to_generator(function*({ x }) {
        var x;
    }).apply(this, arguments);
}
function fn19(_0) {
    return /*#__PURE__*/ _async_to_generator(function*([x]) {
        var x;
    }).apply(this, arguments);
}
function fn20(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        {
            var x;
        }
    })();
}
function fn21(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        if (y) {
            var x;
        }
    })();
}
function fn22(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        if (y) {} else {
            var x;
        }
    })();
}
function fn23(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {
            var x;
        } catch (e) {}
    })();
}
function fn24(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {} catch (e) {
            var x;
        }
    })();
}
function fn25(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {} catch (x) {
            var x;
        }
    })();
}
function fn26(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {} catch ({ x }) {
            var x;
        }
    })();
}
function fn27(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {} finally{
            var x;
        }
    })();
}
function fn28(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        while(y){
            var x;
        }
    })();
}
function fn29(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        do {
            var x;
        }while (y)
    })();
}
function fn30(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for(var x = y;;){}
    })();
}
function fn31(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for(var { x } = y;;){}
    })();
}
function fn32(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for(;;){
            var x;
        }
    })();
}
function fn33(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for(var x in y){}
    })();
}
function fn34(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for(var z in y){
            var x;
        }
    })();
}
function fn35(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for (var x of y){}
    })();
}
function fn36(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for (var { x } of y){}
    })();
}
function fn37(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        for (var z of y){
            var x;
        }
    })();
}
function fn38(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        switch(y){
            case y:
                var x;
        }
    })();
}
function fn39(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        foo: {
            var x;
            break foo;
        }
    })();
}
function fn40(x) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        try {} catch (e) {
            var x;
        }
    })();
}
