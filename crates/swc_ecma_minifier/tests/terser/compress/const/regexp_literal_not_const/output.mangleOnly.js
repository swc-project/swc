(function () {
    var c;
    const o = "acdabcdeabbb";
    const a = /ab*/g;
    while ((c = a.exec(o))) {
        console.log(c[0]);
    }
})();
