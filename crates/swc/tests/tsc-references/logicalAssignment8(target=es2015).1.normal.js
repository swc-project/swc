//// [logicalAssignment8.ts]
function foo1(results) {
    var ref;
    (results || (results = (ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && ref !== void 0 ? ref : [])).push(100);
}
function foo2(results) {
    var ref;
    (results !== null && results !== void 0 ? results : results = (ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && ref !== void 0 ? ref : []).push(100);
}
function foo3(results) {
    var ref;
    (results && (results = (ref = bar === null || bar === void 0 ? void 0 : bar.value) !== null && ref !== void 0 ? ref : [])).push(100);
}
