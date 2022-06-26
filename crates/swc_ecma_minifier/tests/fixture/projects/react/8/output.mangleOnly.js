function a(b, c, d, e, f) {
    const g = ".";
    var h = typeof b;
    if (h === "undefined" || h === "boolean") {
        b = null;
    }
    var i = false;
    if (b === null) {
        i = true;
    } else {
        switch(h){
            case "string":
            case "number":
                i = true;
                break;
            case "object":
                switch(b.$$typeof){
                    case REACT_ELEMENT_TYPE:
                    case REACT_PORTAL_TYPE:
                        i = true;
                }
        }
    }
    if (i) {
        var j = b;
        var k = f(j);
        var l = e === "" ? g + getElementKey(j, 0) : e;
        if (Array.isArray(k)) {
            var m = "";
            if (l != null) {
                m = escapeUserProvidedKey(l) + "/";
            }
            a(k, c, m, "", function(a) {
                return a;
            });
        } else if (k != null) {
            if (isValidElement(k)) {
                k = cloneAndReplaceKey(k, d + (k.key && (!j || j.key !== k.key) ? escapeUserProvidedKey("" + k.key) + "/" : "") + l);
            }
            c.push(k);
        }
        return 1;
    }
    var n;
    var o;
    var p = 0;
    var q = e === "" ? g : e + SUBSEPARATOR;
    if (Array.isArray(b)) {
        for(var r = 0; r < b.length; r++){
            n = b[r];
            o = q + getElementKey(n, r);
            p += a(n, c, d, o, f);
        }
    } else {
        var s = getIteratorFn(b);
        if (typeof s === "function") {
            var t = b;
            {
                if (s === t.entries) {
                    if (!didWarnAboutMaps) {
                        warn("Using Maps as children is not supported. " + "Use an array of keyed ReactElements instead.");
                    }
                    didWarnAboutMaps = true;
                }
            }
            var u = s.call(t);
            var v;
            var w = 0;
            while(!(v = u.next()).done){
                n = v.value;
                o = q + getElementKey(n, w++);
                p += a(n, c, d, o, f);
            }
        } else if (h === "object") {
            var x = "" + b;
            {
                {
                    throw Error("Objects are not valid as a React child (found: " + (x === "[object Object]" ? "object with keys {" + Object.keys(b).join(", ") + "}" : x) + "). If you meant to render a collection of children, use an array instead.");
                }
            }
        }
    }
    return p;
}
