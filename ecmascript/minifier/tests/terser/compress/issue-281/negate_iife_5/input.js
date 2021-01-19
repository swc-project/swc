if (
    (function () {
        return t;
    })()
) {
    foo(true);
} else {
    bar(false);
}
(function () {
    console.log("something");
})();
