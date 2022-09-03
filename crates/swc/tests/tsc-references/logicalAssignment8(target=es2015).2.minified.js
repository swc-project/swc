//// [logicalAssignment8.ts]
function foo1(results) {
    var ref;
    (results || (results = null !== (ref = null == bar ? void 0 : bar.value) && void 0 !== ref ? ref : [])).push(100);
}
function foo2(results) {
    var ref;
    (null != results ? results : results = null !== (ref = null == bar ? void 0 : bar.value) && void 0 !== ref ? ref : []).push(100);
}
function foo3(results) {
    var ref;
    (results && (results = null !== (ref = null == bar ? void 0 : bar.value) && void 0 !== ref ? ref : [])).push(100);
}
