//// [logicalAssignment8.ts]
function foo1(results) {
    var _ref;
    (results || (results = (_ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _ref !== void 0 ? _ref : [])).push(100);
}
function foo2(results) {
    var _ref;
    (results !== null && results !== void 0 ? results : results = (_ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _ref !== void 0 ? _ref : []).push(100);
}
function foo3(results) {
    var _ref;
    (results && (results = (_ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _ref !== void 0 ? _ref : [])).push(100);
}
