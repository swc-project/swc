function n(n, a, t) {
    {
        var e = ReactSharedInternals.ReactDebugCurrentFrame;
        var r = e.getStackAddendum();
        if (r !== "") {
            a += "%s";
            t = t.concat([
                r
            ]);
        }
        var c = t.map(function(n) {
            return "" + n;
        });
        c.unshift("Warning: " + a);
        Function.prototype.apply.call(console[n], console, c);
    }
}
