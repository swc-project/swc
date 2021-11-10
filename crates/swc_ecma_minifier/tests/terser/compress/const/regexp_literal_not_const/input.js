(function () {
    var result;
    const s = "acdabcdeabbb";
    const REGEXP_LITERAL = /ab*/g;
    while ((result = REGEXP_LITERAL.exec(s))) {
        console.log(result[0]);
    }
})();
