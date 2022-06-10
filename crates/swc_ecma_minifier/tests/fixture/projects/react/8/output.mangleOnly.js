function a(b, e, l, f, m) {
    const q = ".";
    var g = typeof b;
    if (g === "undefined" || g === "boolean") {
        b = null;
    }
    var h = false;
    if (b === null) {
        h = true;
    } else {
        switch(g){
            case "string":
            case "number":
                h = true;
                break;
            case "object":
                switch(b.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        h = true;
                }
        }
    }
    if (h) {
        var i = b;
        var c = m(i);
        var n = f === "" ? q + getElementKey(i, 0) : f;
        if (Array.isArray(c)) {
            var r = "";
            if (n != null) {
                r = escapeUserProvidedKey(n) + "/";
            }
            a(c, e, r, "", function(a) {
                return a;
            });
        } else if (c != null) {
            if (isValidElement(c)) {
                c = cloneAndReplaceKey(c, l + (c.key && (!i || i.key !== c.key) ? escapeUserProvidedKey("" + c.key) + "/" : "") + n);
            }
            e.push(c);
        }
        return 1;
    }
    var d;
    var j;
    var o = 0;
    var s = f === "" ? q : f + SUBSEPARATOR;
    if (Array.isArray(b)) {
        for(var k = 0; k < b.length; k++){
            d = b[k];
            j = s + getElementKey(d, k);
            o += a(d, e, l, j, m);
        }
    } else {
        var p = getIteratorFn(b);
        if (typeof p === "function") {
            var t = b;
            {
                if (p === t.entries) {
                    if (!didWarnAboutMaps) {
                        warn("Using Maps as children is not supported. " + "Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                }
            }
            var w = p.call(t);
            var u;
            var x = 0;
            while(!(u = w.next()).done){
                d = u.value;
                j = s + getElementKey(d, x++);
                o += a(d, e, l, j, m);
            }
        } else if (g === "object") {
            var v = "" + b;
            {
                {
                    throw Error("Objects are not valid as a React child (found: " + (v === "[object Object]" ? "object with keys {" + Object.keys(b).join(", ") + "}" : v) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
        }
    }
    return o;
}
