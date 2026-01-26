//// [typeFromPropertyAssignment30.ts]
var c = function c() {
    return 1;
};
// should not be an expando object, but contextually typed by Combo.p
c.p = {};
