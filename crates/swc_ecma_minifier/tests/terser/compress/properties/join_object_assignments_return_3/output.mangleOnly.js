console.log((function() {
    var a = {
        p: 3
    };
    return (a.q = "foo"), (a.p += ""), console.log(a.q), a.p;
})());
