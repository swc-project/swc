console.log((function() {
    var r = {
        p: 3
    };
    return (r.q = /foo/), (r.r = "bar");
})());
