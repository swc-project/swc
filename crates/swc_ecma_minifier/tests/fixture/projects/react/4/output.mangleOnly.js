function a(e, b, a) {
    {
        var f = ReactSharedInternals.ReactDebugCurrentFrame;
        var c = f.getStackAddendum();
        if (c !== "") {
            b += "%s";
            a = a.concat([
                c
            ]);
        }
        var d = a.map(function(a) {
            return "" + a;
        });
        d.unshift("Warning: " + b);
        Function.prototype.apply.call(console[e], console, d);
    }
}
