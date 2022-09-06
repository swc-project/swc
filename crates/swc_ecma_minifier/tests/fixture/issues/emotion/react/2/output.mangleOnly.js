var e = y;
var r = /[A-Z]|^ms/g;
var n = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var t = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
};
var a = t;
var i = function e(r) {
    return r.charCodeAt(1) === 45;
};
var o = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var f;
var l = d;
function s(e, r, n) {
    if (n == null) {
        return "";
    }
    if (n.__emotion_styles !== undefined) {
        if (false) {}
        return n;
    }
    switch(typeof n){
        case "boolean":
            {
                return "";
            }
        case "object":
            {
                if (n.anim === 1) {
                    f = {
                        name: n.name,
                        styles: n.styles,
                        next: f
                    };
                    return n.name;
                }
                if (n.styles !== undefined) {
                    var t = n.next;
                    if (t !== undefined) {
                        while(t !== undefined){
                            f = {
                                name: t.name,
                                styles: t.styles,
                                next: f
                            };
                            t = t.next;
                        }
                    }
                    var a = n.styles + ";";
                    if (false) {}
                    return a;
                }
                return u(e, r, n);
            }
        case "function":
            {
                if (e !== undefined) {
                    var i = f;
                    var o = n(e);
                    f = i;
                    return s(e, r, o);
                } else if (false) {}
                break;
            }
        case "string":
            if (false) {
                var l, d;
            }
            break;
    }
    if (r == null) {
        return n;
    }
    var c = r[n];
    return c !== undefined ? c : n;
}
export function serializeStyles(e, r, n) {
    if (e.length === 1 && typeof e[0] === "object" && e[0] !== null && e[0].styles !== undefined) {
        return e[0];
    }
    var t = true;
    var a = "";
    f = undefined;
    var i = e[0];
    if (i == null || i.raw === undefined) {
        t = false;
        a += s(n, r, i);
    } else {
        if (false) {}
        a += i[0];
    }
    for(var u = 1; u < e.length; u++){
        a += s(n, r, e[u]);
        if (t) {
            if (false) {}
            a += i[u];
        }
    }
    var d;
    if (false) {}
    o.lastIndex = 0;
    var c = "";
    var m;
    while((m = o.exec(a)) !== null){
        c += "-" + m[1];
    }
    var v = l(a) + c;
    if (false) {}
    return {
        name: v,
        styles: a,
        next: f
    };
}
function u(e, r, n) {
    var t = "";
    if (Array.isArray(n)) {
        for(var a = 0; a < n.length; a++){
            t += s(e, r, n[a]) + ";";
        }
    } else {
        for(var i in n){
            var o = n[i];
            if (typeof o !== "object") {
                if (r != null && r[o] !== undefined) {
                    t += i + "{" + r[o] + "}";
                } else if (c(o)) {
                    t += m(i) + ":" + v(i, o) + ";";
                }
            } else {
                if (i === "NO_COMPONENT_SELECTOR" && "production" !== "production") {}
                if (Array.isArray(o) && typeof o[0] === "string" && (r == null || r[o[0]] === undefined)) {
                    for(var f = 0; f < o.length; f++){
                        if (c(o[f])) {
                            t += m(i) + ":" + v(i, o[f]) + ";";
                        }
                    }
                } else {
                    var l = s(e, r, o);
                    switch(i){
                        case "animation":
                        case "animationName":
                            {
                                t += m(i) + ":" + l + ";";
                                break;
                            }
                        default:
                            {
                                if (false) {}
                                t += i + "{" + l + "}";
                            }
                    }
                }
            }
        }
    }
    return t;
}
function d(e) {
    var r = 0;
    var n, t = 0, a = e.length;
    for(; a >= 4; ++t, a -= 4){
        n = (e.charCodeAt(t) & 0xff) | ((e.charCodeAt(++t) & 0xff) << 8) | ((e.charCodeAt(++t) & 0xff) << 16) | ((e.charCodeAt(++t) & 0xff) << 24);
        n = (n & 0xffff) * 0x5bd1e995 + (((n >>> 16) * 0xe995) << 16);
        n ^= n >>> 24;
        r = ((n & 0xffff) * 0x5bd1e995 + (((n >>> 16) * 0xe995) << 16)) ^ ((r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16));
    }
    switch(a){
        case 3:
            r ^= (e.charCodeAt(t + 2) & 0xff) << 16;
        case 2:
            r ^= (e.charCodeAt(t + 1) & 0xff) << 8;
        case 1:
            r ^= e.charCodeAt(t) & 0xff;
            r = (r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16);
    }
    r ^= r >>> 13;
    r = (r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16);
    return ((r ^ (r >>> 15)) >>> 0).toString(36);
}
function c(e) {
    return e != null && typeof e !== "boolean";
}
var m = e(function(e) {
    return i(e) ? e : e.replace(r, "-$&").toLowerCase();
});
var v = function e(r, t) {
    switch(r){
        case "animation":
        case "animationName":
            {
                if (typeof t === "string") {
                    return t.replace(n, function(e, r, n) {
                        f = {
                            name: r,
                            styles: n,
                            next: f
                        };
                        return r;
                    });
                }
            }
    }
    if (a[r] !== 1 && !i(r) && typeof t === "number" && t !== 0) {
        return t + "px";
    }
    return t;
};
function y(e) {
    var r = Object.create(null);
    return function(n) {
        if (r[n] === undefined) r[n] = e(n);
        return r[n];
    };
}
