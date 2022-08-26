(function() {
    var c;
    const a = "acdabcdeabbb";
    const b = /ab*/g;
    while((c = b.exec(a))){
        console.log(c[0]);
    }
})();
