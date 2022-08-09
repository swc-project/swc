function e(r, a, i, f, t) {
    const l = ".";
    var s = typeof r;
    if (s === "undefined" || s === "boolean") {
        r = null;
    }
    var v = false;
    if (r === null) {
        v = true;
    } else {
        switch(s){
            case "string":
            case "number":
                v = true;
                break;
            case "object":
                switch(r.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        v = true;
                }
        }
    }
    if (v) {
        var n = r;
        var u = t(n);
        var c = f === "" ? l + getElementKey(n, 0) : f;
        if (Array.isArray(u)) {
            var o = "";
            if (c != null) {
                o = escapeUserProvidedKey(c) + "/";
            }
            e(u, a, o, "", function(e) {
                return e;
            });
        } else if (u != null) {
            if (isValidElement(u)) {
                u = cloneAndReplaceKey(u, i + (u.key && (!n || n.key !== u.key) ? escapeUserProvidedKey("" + u.key) + "/" : "") + c);
            }
            a.push(u);
        }
        return 1;
    }
    var y;
    var h;
    var k = 0;
    var p = f === "" ? l : f + SUBSEPARATOR;
    if (Array.isArray(r)) {
        for(var w = 0; w < r.length; w++){
            y = r[w];
            h = p + getElementKey(y, w);
            k += e(y, a, i, h, t);
        }
    } else {
        var $ = getIteratorFn(r);
        if (typeof $ === "function") {
            var A = r;
            {
                if ($ === A.entries) {
                    if (!didWarnAboutMaps) {
                        warn("Using Maps as children is not supported. " + "Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                }
            }
            var b = $.call(A);
            var d;
            var g = 0;
            while(!(d = b.next()).done){
                y = d.value;
                h = p + getElementKey(y, g++);
                k += e(y, a, i, h, t);
            }
        } else if (s === "object") {
            var j = "" + r;
            {
                {
                    throw Error("Objects are not valid as a React child (found: " + (j === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : j) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
        }
    }
    return k;
}
