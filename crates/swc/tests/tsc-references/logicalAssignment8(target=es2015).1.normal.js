//// [logicalAssignment8.ts]
function foo1(results) {
    var _bar_value;
    (results || (results = (_bar_value = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _bar_value !== void 0 ? _bar_value : [])).push(100);
}
function foo2(results) {
    var _bar_value;
    (results !== null && results !== void 0 ? results : results = (_bar_value = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _bar_value !== void 0 ? _bar_value : []).push(100);
}
function foo3(results) {
    var _bar_value;
    (results && (results = (_bar_value = bar === null || bar === void 0 ? void 0 : bar.value) !== null && _bar_value !== void 0 ? _bar_value : [])).push(100);
}
