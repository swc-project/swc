function a(a, b) {
    if (typeof a !== "object") {
        return;
    }
    if (Array.isArray(a)) {
        for(var c = 0; c < a.length; c++){
            var d = a[c];
            if (isValidElement(d)) {
                validateExplicitKey(d, b);
            }
        }
    } else if (isValidElement(a)) {
        if (a._store) {
            a._store.validated = true;
        }
    } else if (a) {
        var e = getIteratorFn(a);
        if (typeof e === "function") {
            if (e !== a.entries) {
                var f = e.call(a);
                var g;
                while(!(g = f.next()).done){
                    if (isValidElement(g.value)) {
                        validateExplicitKey(g.value, b);
                    }
                }
            }
        }
    }
}
