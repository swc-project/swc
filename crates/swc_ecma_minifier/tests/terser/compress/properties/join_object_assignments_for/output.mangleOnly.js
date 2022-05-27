console.log((function() {
    var a = {
        p: 3
    };
    for(a.q = "foo"; console.log(a.q););
    return a.p;
})());
