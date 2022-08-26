var e = $;
var r = /[A-Z]|^ms/g;
var t = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var a = {
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
var n = a;
var f = function e(r) {
    return r.charCodeAt(1) === 45;
};
var i = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var o;
var l = u;
function s(e, r, t) {
    if (t == null) {
        return "";
    }
    if (t.__emotion_styles !== undefined) {
        if (false) {}
        return t;
    }
    switch(typeof t){
        case "boolean":
            {
                return "";
            }
        case "object":
            {
                if (t.anim === 1) {
                    o = {
                        name: t.name,
                        styles: t.styles,
                        next: o
                    };
                    return t.name;
                }
                if (t.styles !== undefined) {
                    var a = t.next;
                    if (a !== undefined) {
                        while(a !== undefined){
                            o = {
                                name: a.name,
                                styles: a.styles,
                                next: o
                            };
                            a = a.next;
                        }
                    }
                    var n = t.styles + ";";
                    if (false) {}
                    return n;
                }
                return _(e, r, t);
            }
        case "function":
            {
                if (e !== undefined) {
                    var f = o;
                    var i = t(e);
                    o = f;
                    return s(e, r, i);
                } else if (false) {}
                break;
            }
        case "string":
            if (false) {
                var l, u;
            }
            break;
    }
    if (r == null) {
        return t;
    }
    var c = r[t];
    return c !== undefined ? c : t;
}
export function serializeStyles(e, r, t) {
    if (e.length === 1 && typeof e[0] === "object" && e[0] !== null && e[0].styles !== undefined) {
        return e[0];
    }
    var a = true;
    var n = "";
    o = undefined;
    var f = e[0];
    if (f == null || f.raw === undefined) {
        a = false;
        n += s(t, r, f);
    } else {
        if (false) {}
        n += f[0];
    }
    for(var _ = 1; _ < e.length; _++){
        n += s(t, r, e[_]);
        if (a) {
            if (false) {}
            n += f[_];
        }
    }
    var u;
    if (false) {}
    i.lastIndex = 0;
    var c = "";
    var x;
    while((x = i.exec(n)) !== null){
        c += "-" + x[1];
    }
    var d = l(n) + c;
    if (false) {}
    return {
        name: d,
        styles: n,
        next: o
    };
}
function _(e, r, t) {
    var a = "";
    if (Array.isArray(t)) {
        for(var n = 0; n < t.length; n++){
            a += s(e, r, t[n]) + ";";
        }
    } else {
        for(var f in t){
            var i = t[f];
            if (typeof i !== "object") {
                if (r != null && r[i] !== undefined) {
                    a += f + "{" + r[i] + "}";
                } else if (c(i)) {
                    a += x(f) + ":" + d(f, i) + ";";
                }
            } else {
                if (f === "NO_COMPONENT_SELECTOR" && "production" !== "production") {}
                if (Array.isArray(i) && typeof i[0] === "string" && (r == null || r[i[0]] === undefined)) {
                    for(var o = 0; o < i.length; o++){
                        if (c(i[o])) {
                            a += x(f) + ":" + d(f, i[o]) + ";";
                        }
                    }
                } else {
                    var l = s(e, r, i);
                    switch(f){
                        case "animation":
                        case "animationName":
                            {
                                a += x(f) + ":" + l + ";";
                                break;
                            }
                        default:
                            {
                                if (false) {}
                                a += f + "{" + l + "}";
                            }
                    }
                }
            }
        }
    }
    return a;
}
function u(e) {
    var r = 0;
    var t, a = 0, n = e.length;
    for(; n >= 4; ++a, n -= 4){
        t = (e.charCodeAt(a) & 0xff) | ((e.charCodeAt(++a) & 0xff) << 8) | ((e.charCodeAt(++a) & 0xff) << 16) | ((e.charCodeAt(++a) & 0xff) << 24);
        t = (t & 0xffff) * 0x5bd1e995 + (((t >>> 16) * 0xe995) << 16);
        t ^= t >>> 24;
        r = ((t & 0xffff) * 0x5bd1e995 + (((t >>> 16) * 0xe995) << 16)) ^ ((r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16));
    }
    switch(n){
        case 3:
            r ^= (e.charCodeAt(a + 2) & 0xff) << 16;
        case 2:
            r ^= (e.charCodeAt(a + 1) & 0xff) << 8;
        case 1:
            r ^= e.charCodeAt(a) & 0xff;
            r = (r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16);
    }
    r ^= r >>> 13;
    r = (r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16);
    return ((r ^ (r >>> 15)) >>> 0).toString(36);
}
function c(e) {
    return e != null && typeof e !== "boolean";
}
var x = e(function(e) {
    return f(e) ? e : e.replace(r, "-$&").toLowerCase();
});
var d = function e(r, a) {
    switch(r){
        case "animation":
        case "animationName":
            {
                if (typeof a === "string") {
                    return a.replace(t, function(e, r, t) {
                        o = {
                            name: r,
                            styles: t,
                            next: o
                        };
                        return r;
                    });
                }
            }
    }
    if (n[r] !== 1 && !f(r) && typeof a === "number" && a !== 0) {
        return a + "px";
    }
    return a;
};
function $(e) {
    var r = Object.create(null);
    return function(t) {
        if (r[t] === undefined) r[t] = e(t);
        return r[t];
    };
}
