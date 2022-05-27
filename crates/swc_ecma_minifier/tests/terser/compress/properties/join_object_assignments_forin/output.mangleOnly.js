console.log((function() {
    var a = {};
    for(var b in ((a.a = "PASS"), a))return a[b];
})());
