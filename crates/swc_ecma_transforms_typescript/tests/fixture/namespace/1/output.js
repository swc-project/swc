let X1;
(function(X1) {
    console.log(1);
})(X1 || (X1 = {}));
export let X2;
(function(X2) {
    console.log(2);
})(X2 || (X2 = {}));
let X3;
(function(X3) {
    let X4;
    (function(X4) {
        console.log(4);
    })(X4 || (X4 = {}));
})(X3 || (X3 = {}));
let X5;
(function(X5) {
    let X6;
    (function(X6) {
        console.log(6);
    })(X6 = X5.X6 || (X5.X6 = {}));
})(X5 || (X5 = {}));
let X7;
(function(X7) {
    (function(X8) {
        console.log(8);
    })(X7.X8 || (X7.X8 = {}));
})(X7 || (X7 = {}));
