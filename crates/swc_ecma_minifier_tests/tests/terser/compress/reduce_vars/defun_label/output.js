!(function () {
    console.log(
        (function (a) {
            L: {
                if (2) break L;
                return 1;
            }
        })()
    );
})();
