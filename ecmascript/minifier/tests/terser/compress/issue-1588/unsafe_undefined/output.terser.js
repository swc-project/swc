var a, c;
console.log(
    (function (n) {
        return function () {
            return a ? b : c ? d : n;
        };
    })()()
);
