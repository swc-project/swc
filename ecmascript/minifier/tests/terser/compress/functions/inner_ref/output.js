console.log(
    (function (a) {
        return a + 1;
    })(1),
    (function (a) {
        return void 0 === a;
    })()
);
