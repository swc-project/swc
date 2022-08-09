(function() {
    var c;
    const n = "acdabcdeabbb";
    const o = /ab*/g;
    while((c = o.exec(n))){
        console.log(c[0]);
    }
})();
