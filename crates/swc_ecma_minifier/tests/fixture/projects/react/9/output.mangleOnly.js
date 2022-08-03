function t(t) {
    var s = -1;
    var r = 0;
    var a = 1;
    var u = 2;
    if (t._status === s) {
        var e = t._result;
        var n = e();
        var v = t;
        v._status = r;
        v._result = n;
        n.then(function(s) {
            if (t._status === r) {
                var u = s.default;
                {
                    if (u === undefined) {
                        error("lazy: Expected the result of a dynamic import() call. " + "Instead received: %s\n\nYour code should look like: \n  " + "const MyComponent = lazy(() => imp" + "ort('./MyComponent'))", s);
                    }
                }
                var e = t;
                e._status = a;
                e._result = u;
            }
        }, function(s) {
            if (t._status === r) {
                var a = t;
                a._status = u;
                a._result = s;
            }
        });
    }
    if (t._status === a) {
        return t._result;
    } else {
        throw t._result;
    }
}
