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
var f = a;
var n = function e(r) {
    return r.charCodeAt(1) === 45;
};
var i = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var l;
var o = u;
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
                    l = {
                        name: t.name,
                        styles: t.styles,
                        next: l
                    };
                    return t.name;
                }
                if (t.styles !== undefined) {
                    var a = t.next;
                    if (a !== undefined) {
                        while(a !== undefined){
                            l = {
                                name: a.name,
                                styles: a.styles,
                                next: l
                            };
                            a = a.next;
                        }
                    }
                    var f = t.styles + ";";
                    if (false) {}
                    return f;
                }
                return _(e, r, t);
            }
        case "function":
            {
                if (e !== undefined) {
                    var n = l;
                    var i = t(e);
                    l = n;
                    return s(e, r, i);
                } else if (false) {}
                break;
            }
        case "string":
            if (false) {
                var o, u;
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
    var f = "";
    l = undefined;
    var n = e[0];
    if (n == null || n.raw === undefined) {
        a = false;
        f += s(t, r, n);
    } else {
        if (false) {}
        f += n[0];
    }
    for(var _ = 1; _ < e.length; _++){
        f += s(t, r, e[_]);
        if (a) {
            if (false) {}
            f += n[_];
        }
    }
    var u;
    if (false) {}
    i.lastIndex = 0;
    var c = "";
    var x;
    while((x = i.exec(f)) !== null){
        c += "-" + x[1];
    }
    var d = o(f) + c;
    if (false) {}
    return {
        name: d,
        styles: f,
        next: l
    };
}
function _(e, r, t) {
    var a = "";
    if (Array.isArray(t)) {
        for(var f = 0; f < t.length; f++){
            a += s(e, r, t[f]) + ";";
        }
    } else {
        for(var n in t){
            var i = t[n];
            if (typeof i !== "object") {
                if (r != null && r[i] !== undefined) {
                    a += n + "{" + r[i] + "}";
                } else if (c(i)) {
                    a += x(n) + ":" + d(n, i) + ";";
                }
            } else {
                if (n === "NO_COMPONENT_SELECTOR" && "production" !== "production") {}
                if (Array.isArray(i) && typeof i[0] === "string" && (r == null || r[i[0]] === undefined)) {
                    for(var l = 0; l < i.length; l++){
                        if (c(i[l])) {
                            a += x(n) + ":" + d(n, i[l]) + ";";
                        }
                    }
                } else {
                    var o = s(e, r, i);
                    switch(n){
                        case "animation":
                        case "animationName":
                            {
                                a += x(n) + ":" + o + ";";
                                break;
                            }
                        default:
                            {
                                if (false) {}
                                a += n + "{" + o + "}";
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
    var t, a = 0, f = e.length;
    for(; f >= 4; ++a, f -= 4){
        t = (e.charCodeAt(a) & 0xff) | ((e.charCodeAt(++a) & 0xff) << 8) | ((e.charCodeAt(++a) & 0xff) << 16) | ((e.charCodeAt(++a) & 0xff) << 24);
        t = (t & 0xffff) * 0x5bd1e995 + (((t >>> 16) * 0xe995) << 16);
        t ^= t >>> 24;
        r = ((t & 0xffff) * 0x5bd1e995 + (((t >>> 16) * 0xe995) << 16)) ^ ((r & 0xffff) * 0x5bd1e995 + (((r >>> 16) * 0xe995) << 16));
    }
    switch(f){
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
    return n(e) ? e : e.replace(r, "-$&").toLowerCase();
});
var d = function e(r, a) {
    switch(r){
        case "animation":
        case "animationName":
            {
                if (typeof a === "string") {
                    return a.replace(t, function(e, r, t) {
                        l = {
                            name: r,
                            styles: t,
                            next: l
                        };
                        return r;
                    });
                }
            }
    }
    if (f[r] !== 1 && !n(r) && typeof a === "number" && a !== 0) {
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
