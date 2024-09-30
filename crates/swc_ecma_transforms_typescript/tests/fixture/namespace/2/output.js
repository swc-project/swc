class X1 {
}
(function(X1) {
    console.log(1);
})(X1 || (X1 = {}));
function X2() {}
(function(X2) {
    console.log(2);
})(X2 || (X2 = {}));
var X3 = /*#__PURE__*/ function(X3) {
    return X3;
}(X3 || {});
(function(X3) {
    console.log(3);
})(X3 || (X3 = {}));
