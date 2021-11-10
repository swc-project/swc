console.log(
    (function (same_name) {
        /* @license Foo bar */
        function licensed(same_name) {
            return same_name.toUpperCase();
        }
        console.log("PASS");
        return licensed("PA") + "SS";
    })()
);
