function e(r, a, t, n, i) {
    const s = ".";
    var o = typeof r;
    if (o === "undefined" || o === "boolean") {
        r = null;
    }
    var l = false;
    if (r === null) {
        l = true;
    } else {
        switch(o){
            case "string":
            case "number":
                l = true;
                break;
            case "object":
                switch(r.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        l = true;
                }
        }
    }
    if (l) {
        var c = r;
        var f = i(c);
        var u = n === "" ? s + getElementKey(c, 0) : n;
        if (Array.isArray(f)) {
            var d = "";
            if (u != null) {
                d = escapeUserProvidedKey(u) + "/";
            }
            e(f, a, d, "", function(e) {
                return e;
            });
        } else if (f != null) {
            if (isValidElement(f)) {
                f = cloneAndReplaceKey(f, t + (f.key && (!c || c.key !== f.key) ? escapeUserProvidedKey("" + f.key) + "/" : "") + u);
            }
            a.push(f);
        }
        return 1;
    }
    var y;
    var v;
    var E = 0;
    var b = n === "" ? s : n + SUBSEPARATOR;
    if (Array.isArray(r)) {
        for(var p = 0; p < r.length; p++){
            y = r[p];
            v = b + getElementKey(y, p);
            E += e(y, a, t, v, i);
        }
    } else {
        var A = getIteratorFn(r);
        if (typeof A === "function") {
            var h = r;
            {
                if (A === h.entries) {
                    if (!didWarnAboutMaps) {
                        warn("Using Maps as children is not supported. " + "Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                }
            }
            var j = A.call(h);
            var k;
            var R = 0;
            while(!(k = j.next()).done){
                y = k.value;
                v = b + getElementKey(y, R++);
                E += e(y, a, t, v, i);
            }
        } else if (o === "object") {
            var g = "" + r;
            {
                {
                    throw Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
        }
    }
    return E;
}
