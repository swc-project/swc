(function () {
    var result;
    const REGEXP_LITERAL = /ab*/g;
    while ((result = REGEXP_LITERAL.exec("acdabcdeabbb")))
        console.log(result[0]);
})();
