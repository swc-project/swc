//// [logicalAssignment8.ts]
function foo1(results) {
    var _bar;
    var _bar_value;
    (results || (results = (_bar_value = (_bar = bar) === null || _bar === void 0 ? void 0 : _bar.value) !== null && _bar_value !== void 0 ? _bar_value : [])).push(100);
}
function foo2(results) {
    var _bar;
    var _bar_value;
    (results !== null && results !== void 0 ? results : results = (_bar_value = (_bar = bar) === null || _bar === void 0 ? void 0 : _bar.value) !== null && _bar_value !== void 0 ? _bar_value : []).push(100);
}
function foo3(results) {
    var _bar;
    var _bar_value;
    (results && (results = (_bar_value = (_bar = bar) === null || _bar === void 0 ? void 0 : _bar.value) !== null && _bar_value !== void 0 ? _bar_value : [])).push(100);
}
