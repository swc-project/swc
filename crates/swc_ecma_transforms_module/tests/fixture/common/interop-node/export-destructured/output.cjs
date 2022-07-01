"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.y = exports.x = exports.f4 = exports.f3 = exports.f2 = exports.f1 = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    f1: ()=>f1,
    f2: ()=>f2,
    f3: ()=>f3,
    f4: ()=>f4,
    x: ()=>x,
    y: ()=>y
});
let x = 0;
let y = 0;
function f1() {
    ({ x  } = {
        x: 1
    });
}
function f2() {
    ({ x , y  } = {
        x: 2,
        y: 3
    });
}
function f3() {
    [x, y, z] = [
        3,
        4,
        5
    ];
}
function f4() {
    [x, , y] = [
        3,
        4,
        5
    ];
}
