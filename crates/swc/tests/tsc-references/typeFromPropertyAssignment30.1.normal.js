//// [typeFromPropertyAssignment30.ts]
var c = function() {
    return 1;
};
// should not be an expando object, but contextually typed by Combo.p
c.p = {};
