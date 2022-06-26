function a(a) {
    var b = -1;
    var c = 0;
    var d = 1;
    var e = 2;
    if (a._status === b) {
        var f = a._result;
        var g = f();
        var h = a;
        h._status = c;
        h._result = g;
        g.then(function(b) {
            if (a._status === c) {
                var e = b.default;
                {
                    if (e === undefined) {
                        error("lazy: Expected the result of a dynamic import() call. " + "Instead received: %s\n\nYour code should look like: \n  " + "const MyComponent = lazy(() => imp" + "ort('./MyComponent'))", b);
                    }
                }
                var f = a;
                f._status = d;
                f._result = e;
            }
        }, function(b) {
            if (a._status === c) {
                var d = a;
                d._status = e;
                d._result = b;
            }
        });
    }
    if (a._status === d) {
        return a._result;
    } else {
        throw a._result;
    }
}
