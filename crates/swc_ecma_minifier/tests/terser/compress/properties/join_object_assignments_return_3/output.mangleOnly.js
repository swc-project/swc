console.log((function() {
    var n = {
        p: 3
    };
    return (n.q = "foo"), (n.p += ""), console.log(n.q), n.p;
})());
