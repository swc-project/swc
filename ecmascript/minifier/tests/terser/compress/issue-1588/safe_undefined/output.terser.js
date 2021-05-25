var a, c;
console.log(
    (function (n) {
        return function () {
            return a ? b : c ? d : void 0;
        };
    })(1)()
);
