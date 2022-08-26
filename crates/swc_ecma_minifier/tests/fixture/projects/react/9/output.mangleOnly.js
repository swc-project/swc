function t(t) {
    var s = -1;
    var a = 0;
    var r = 1;
    var e = 2;
    if (t._status === s) {
        var u = t._result;
        var n = u();
        var o = t;
        o._status = a;
        o._result = n;
        n.then(function(s) {
            if (t._status === a) {
                var e = s.default;
                {
                    if (e === undefined) {
                        error("lazy: Expected the result of a dynamic import() call. " + "Instead received: %s\n\nYour code should look like: \n  " + "const MyComponent = lazy(() => imp" + "ort('./MyComponent'))", s);
                    }
                }
                var u = t;
                u._status = r;
                u._result = e;
            }
        }, function(s) {
            if (t._status === a) {
                var r = t;
                r._status = e;
                r._result = s;
            }
        });
    }
    if (t._status === r) {
        return t._result;
    } else {
        throw t._result;
    }
}
