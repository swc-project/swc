function t(t, a, n) {
    {
        var r = ReactSharedInternals.ReactDebugCurrentFrame;
        var e = r.getStackAddendum();
        if (e !== "") {
            a += "%s";
            n = n.concat([
                e
            ]);
        }
        var c = n.map(function(t) {
            return "" + t;
        });
        c.unshift("Warning: " + a);
        Function.prototype.apply.call(console[t], console, c);
    }
}
