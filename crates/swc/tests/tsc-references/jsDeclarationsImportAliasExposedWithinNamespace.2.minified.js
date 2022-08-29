//// [file.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "myTypes", {
    enumerable: !0,
    get: ()=>myTypes
});
const myTypes = {};
//// [file2.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    testFn: ()=>testFn,
    testFnTypes: ()=>testFnTypes
});
const testFnTypes = {};
function testFn(input) {
    return 'number' == typeof input ? 2 * input : null;
}
