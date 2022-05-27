function a(a) {
    var d = -1;
    var e = 0;
    var f = 1;
    var h = 2;
    if (a._status === d) {
        var g = a._result;
        var b = g();
        var c = a;
        c._status = e;
        c._result = b;
        b.then(function(b) {
            if (a._status === e) {
                var c = b.default;
                {
                    if (c === undefined) {
                        error("lazy: Expected the result of a dynamic import() call. " + "Instead received: %s\n\nYour code should look like: \n  " + "const MyComponent = lazy(() => imp" + "ort('./MyComponent'))", b);
                    }
                }
                var d = a;
                d._status = f;
                d._result = c;
            }
        }, function(c) {
            if (a._status === e) {
                var b = a;
                b._status = h;
                b._result = c;
            }
        });
    }
    if (a._status === f) {
        return a._result;
    } else {
        throw a._result;
    }
}
