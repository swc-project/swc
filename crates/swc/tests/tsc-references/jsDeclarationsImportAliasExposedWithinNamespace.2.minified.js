//// [file.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "myTypes", {
    enumerable: !0,
    get: function() {
        return myTypes;
    }
});
const myTypes = {};
//// [file2.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    testFn: function() {
        return testFn;
    },
    testFnTypes: function() {
        return testFnTypes;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
const testFnTypes = {};
function testFn(input) {
    return 'number' == typeof input ? 2 * input : null;
}
