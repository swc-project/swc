function a(a, n, t) {
    {
        var r = ReactSharedInternals.ReactDebugCurrentFrame;
        var e = r.getStackAddendum();
        if (e !== "") {
            n += "%s";
            t = t.concat([
                e
            ]);
        }
        var c = t.map(function(a) {
            return "" + a;
        });
        c.unshift("Warning: " + n);
        Function.prototype.apply.call(console[a], console, c);
    }
}
