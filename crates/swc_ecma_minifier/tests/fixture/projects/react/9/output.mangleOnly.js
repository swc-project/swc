function t(t) {
    var r = -1;
    var e = 0;
    var s = 1;
    var a = 2;
    if (t._status === r) {
        var u = t._result;
        var n = u();
        var o = t;
        o._status = e;
        o._result = n;
        n.then(function(r) {
            if (t._status === e) {
                var a = r.default;
                {
                    if (a === undefined) {
                        error("lazy: Expected the result of a dynamic import() call. " + "Instead received: %s\n\nYour code should look like: \n  " + "const MyComponent = lazy(() => imp" + "ort('./MyComponent'))", r);
                    }
                }
                var u = t;
                u._status = s;
                u._result = a;
            }
        }, function(r) {
            if (t._status === e) {
                var s = t;
                s._status = a;
                s._result = r;
            }
        });
    }
    if (t._status === s) {
        return t._result;
    } else {
        throw t._result;
    }
}
