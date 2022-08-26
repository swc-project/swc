function e(e, i) {
    if (typeof e !== "object") {
        return;
    }
    if (Array.isArray(e)) {
        for(var f = 0; f < e.length; f++){
            var r = e[f];
            if (isValidElement(r)) {
                validateExplicitKey(r, i);
            }
        }
    } else if (isValidElement(e)) {
        if (e._store) {
            e._store.validated = true;
        }
    } else if (e) {
        var t = getIteratorFn(e);
        if (typeof t === "function") {
            if (t !== e.entries) {
                var a = t.call(e);
                var l;
                while(!(l = a.next()).done){
                    if (isValidElement(l.value)) {
                        validateExplicitKey(l.value, i);
                    }
                }
            }
        }
    }
}
