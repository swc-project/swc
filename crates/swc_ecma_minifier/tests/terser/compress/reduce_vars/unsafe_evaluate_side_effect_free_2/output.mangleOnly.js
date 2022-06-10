console.log((function() {
    var a = {
        p: 1
    }, b = [
        a
    ];
    console.log(b[0].p);
    return a.p;
})());
