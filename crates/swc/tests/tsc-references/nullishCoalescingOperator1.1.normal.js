//// [nullishCoalescingOperator1.ts]
var aa1 = a1 !== null && a1 !== void 0 ? a1 : 'whatever';
var aa2 = a2 !== null && a2 !== void 0 ? a2 : 'whatever';
var aa3 = a3 !== null && a3 !== void 0 ? a3 : 'whatever';
var aa4 = a4 !== null && a4 !== void 0 ? a4 : 'whatever';
var bb1 = b1 !== null && b1 !== void 0 ? b1 : 1;
var bb2 = b2 !== null && b2 !== void 0 ? b2 : 1;
var bb3 = b3 !== null && b3 !== void 0 ? b3 : 1;
var bb4 = b4 !== null && b4 !== void 0 ? b4 : 1;
var cc1 = c1 !== null && c1 !== void 0 ? c1 : true;
var cc2 = c2 !== null && c2 !== void 0 ? c2 : true;
var cc3 = c3 !== null && c3 !== void 0 ? c3 : true;
var cc4 = c4 !== null && c4 !== void 0 ? c4 : true;
var dd1 = d1 !== null && d1 !== void 0 ? d1 : {
    b: 1
};
var dd2 = d2 !== null && d2 !== void 0 ? d2 : {
    b: 1
};
var dd3 = d3 !== null && d3 !== void 0 ? d3 : {
    b: 1
};
var dd4 = d4 !== null && d4 !== void 0 ? d4 : {
    b: 1
};
var maybeBool = false;
if (!(maybeBool !== null && maybeBool !== void 0 ? maybeBool : true)) {
    foo();
}
if (maybeBool !== null && maybeBool !== void 0 ? maybeBool : true) {
    foo();
} else {
    foo();
}
var _ref;
if ((_ref = false) !== null && _ref !== void 0 ? _ref : true) {
    foo();
} else {
    foo();
}
