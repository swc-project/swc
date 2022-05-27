(function() {
    var a;
    const b = "acdabcdeabbb";
    const c = /ab*/g;
    while((a = c.exec(b))){
        console.log(a[0]);
    }
})();
