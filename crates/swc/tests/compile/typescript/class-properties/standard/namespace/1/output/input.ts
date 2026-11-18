(function(X1) {
    console.log(1);
})(X1 || (X1 = {}));
(function(X2) {
    console.log(2);
})(X2 || (X2 = {}));
(function(X3) {
    (function(X4) {
        console.log(4);
    })(X4 || (X4 = {}));
    var X4;
})(X3 || (X3 = {}));
(function(X5) {
    (function(X6) {
        console.log(6);
    })(X5.X6 || (X5.X6 = {}));
})(X5 || (X5 = {}));
(function(X7) {
    (function(X8) {
        console.log(8);
    })(X7.X8 || (X7.X8 = {}));
})(X7 || (X7 = {}));
var X1, X3, X5, X7;
export var X2;
