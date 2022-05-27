function a(a, e) {
    if (typeof a !== "object") {
        return;
    }
    if (Array.isArray(a)) {
        for(var b = 0; b < a.length; b++){
            var f = a[b];
            if (isValidElement(f)) {
                validateExplicitKey(f, e);
            }
        }
    } else if (isValidElement(a)) {
        if (a._store) {
            a._store.validated = true;
        }
    } else if (a) {
        var c = getIteratorFn(a);
        if (typeof c === "function") {
            if (c !== a.entries) {
                var g = c.call(a);
                var d;
                while(!(d = g.next()).done){
                    if (isValidElement(d.value)) {
                        validateExplicitKey(d.value, e);
                    }
                }
            }
        }
    }
}
