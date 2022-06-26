function a(a, b, c) {
    {
        var d = ReactSharedInternals.ReactDebugCurrentFrame;
        var e = d.getStackAddendum();
        if (e !== "") {
            b += "%s";
            c = c.concat([
                e
            ]);
        }
        var f = c.map(function(a) {
            return "" + a;
        });
        f.unshift("Warning: " + b);
        Function.prototype.apply.call(console[a], console, f);
    }
}
