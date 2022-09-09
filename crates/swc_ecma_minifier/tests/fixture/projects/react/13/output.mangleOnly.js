function e(e, i) {
    if (typeof e !== "object") {
        return;
    }
    if (Array.isArray(e)) {
        for(var t = 0; t < e.length; t++){
            var a = e[t];
            if (isValidElement(a)) {
                validateExplicitKey(a, i);
            }
        }
    } else if (isValidElement(e)) {
        if (e._store) {
            e._store.validated = true;
        }
    } else if (e) {
        var l = getIteratorFn(e);
        if (typeof l === "function") {
            if (l !== e.entries) {
                var r = l.call(e);
                var f;
                while(!(f = r.next()).done){
                    if (isValidElement(f.value)) {
                        validateExplicitKey(f.value, i);
                    }
                }
            }
        }
    }
}
