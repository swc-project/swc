function e(a, r, t, n, i) {
    const s = ".";
    var o = typeof a;
    if (o === "undefined" || o === "boolean") {
        a = null;
    }
    var l = false;
    if (a === null) {
        l = true;
    } else {
        switch(o){
            case "string":
            case "number":
                l = true;
                break;
            case "object":
                switch(a.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        l = true;
                }
        }
    }
    if (l) {
        var c = a;
        var f = i(c);
        var u = n === "" ? s + getElementKey(c, 0) : n;
        if (Array.isArray(f)) {
            var v = "";
            if (u != null) {
                v = escapeUserProvidedKey(u) + "/";
            }
            e(f, r, v, "", function(e) {
                return e;
            });
        } else if (f != null) {
            if (isValidElement(f)) {
                f = cloneAndReplaceKey(f, t + (f.key && (!c || c.key !== f.key) ? escapeUserProvidedKey("" + f.key) + "/" : "") + u);
            }
            r.push(f);
        }
        return 1;
    }
    var y;
    var d;
    var h = 0;
    var b = n === "" ? s : n + SUBSEPARATOR;
    if (Array.isArray(a)) {
        for(var k = 0; k < a.length; k++){
            y = a[k];
            d = b + getElementKey(y, k);
            h += e(y, r, t, d, i);
        }
    } else {
        var j = getIteratorFn(a);
        if (typeof j === "function") {
            var p = a;
            {
                if (j === p.entries) {
                    if (!didWarnAboutMaps) {
                        warn("Using Maps as children is not supported. " + "Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                }
            }
            var w = j.call(p);
            var $;
            var g = 0;
            while(!($ = w.next()).done){
                y = $.value;
                d = b + getElementKey(y, g++);
                h += e(y, r, t, d, i);
            }
        } else if (o === "object") {
            var m = "" + a;
            {
                {
                    throw Error("Objects are not valid as a React child (found: " + (m === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : m) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
        }
    }
    return h;
}
