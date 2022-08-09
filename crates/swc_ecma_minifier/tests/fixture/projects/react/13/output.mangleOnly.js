function e(e, i) {
    if (typeof e !== "object") {
        return;
    }
    if (Array.isArray(e)) {
        for(var r = 0; r < e.length; r++){
            var f = e[r];
            if (isValidElement(f)) {
                validateExplicitKey(f, i);
            }
        }
    } else if (isValidElement(e)) {
        if (e._store) {
            e._store.validated = true;
        }
    } else if (e) {
        var a = getIteratorFn(e);
        if (typeof a === "function") {
            if (a !== e.entries) {
                var t = a.call(e);
                var l;
                while(!(l = t.next()).done){
                    if (isValidElement(l.value)) {
                        validateExplicitKey(l.value, i);
                    }
                }
            }
        }
    }
}
