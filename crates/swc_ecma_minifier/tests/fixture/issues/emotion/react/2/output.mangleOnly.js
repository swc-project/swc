var a = p;
var c = /[A-Z]|^ms/g;
var d = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var b = {
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
var e = b;
var f = function b(a) {
    return a.charCodeAt(1) === 45;
};
var g = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var h;
var i = l;
function j(c, d, a) {
    if (a == null) {
        return "";
    }
    if (a.__emotion_styles !== undefined) {
        if (false) {}
        return a;
    }
    switch(typeof a){
        case "boolean":
            {
                return "";
            }
        case "object":
            {
                if (a.anim === 1) {
                    h = {
                        name: a.name,
                        styles: a.styles,
                        next: h
                    };
                    return a.name;
                }
                if (a.styles !== undefined) {
                    var b = a.next;
                    if (b !== undefined) {
                        while(b !== undefined){
                            h = {
                                name: b.name,
                                styles: b.styles,
                                next: h
                            };
                            b = b.next;
                        }
                    }
                    var f = a.styles + ";";
                    if (false) {}
                    return f;
                }
                return k(c, d, a);
            }
        case "function":
            {
                if (c !== undefined) {
                    var g = h;
                    var i = a(c);
                    h = g;
                    return j(c, d, i);
                } else if (false) {}
                break;
            }
        case "string":
            if (false) {
                var l, m;
            }
            break;
    }
    if (d == null) {
        return a;
    }
    var e = d[a];
    return e !== undefined ? e : a;
}
export function serializeStyles(a, e, f) {
    if (a.length === 1 && typeof a[0] === "object" && a[0] !== null && a[0].styles !== undefined) {
        return a[0];
    }
    var k = true;
    var b = "";
    h = undefined;
    var c = a[0];
    if (c == null || c.raw === undefined) {
        k = false;
        b += j(f, e, c);
    } else {
        if (false) {}
        b += c[0];
    }
    for(var d = 1; d < a.length; d++){
        b += j(f, e, a[d]);
        if (k) {
            if (false) {}
            b += c[d];
        }
    }
    var o;
    if (false) {}
    g.lastIndex = 0;
    var l = "";
    var m;
    while((m = g.exec(b)) !== null){
        l += "-" + m[1];
    }
    var n = i(b) + l;
    if (false) {}
    return {
        name: n,
        styles: b,
        next: h
    };
}
function k(h, c, e) {
    var d = "";
    if (Array.isArray(e)) {
        for(var g = 0; g < e.length; g++){
            d += j(h, c, e[g]) + ";";
        }
    } else {
        for(var b in e){
            var a = e[b];
            if (typeof a !== "object") {
                if (c != null && c[a] !== undefined) {
                    d += b + "{" + c[a] + "}";
                } else if (m(a)) {
                    d += n(b) + ":" + o(b, a) + ";";
                }
            } else {
                if (b === "NO_COMPONENT_SELECTOR" && "production" !== "production") {}
                if (Array.isArray(a) && typeof a[0] === "string" && (c == null || c[a[0]] === undefined)) {
                    for(var f = 0; f < a.length; f++){
                        if (m(a[f])) {
                            d += n(b) + ":" + o(b, a[f]) + ";";
                        }
                    }
                } else {
                    var i = j(h, c, a);
                    switch(b){
                        case "animation":
                        case "animationName":
                            {
                                d += n(b) + ":" + i + ";";
                                break;
                            }
                        default:
                            {
                                if (false) {}
                                d += b + "{" + i + "}";
                            }
                    }
                }
            }
        }
    }
    return d;
}
function l(b) {
    var a = 0;
    var c, d = 0, e = b.length;
    for(; e >= 4; ++d, e -= 4){
        c = (b.charCodeAt(d) & 0xff) | ((b.charCodeAt(++d) & 0xff) << 8) | ((b.charCodeAt(++d) & 0xff) << 16) | ((b.charCodeAt(++d) & 0xff) << 24);
        c = (c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16);
        c ^= c >>> 24;
        a = ((c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16)) ^ ((a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16));
    }
    switch(e){
        case 3:
            a ^= (b.charCodeAt(d + 2) & 0xff) << 16;
        case 2:
            a ^= (b.charCodeAt(d + 1) & 0xff) << 8;
        case 1:
            a ^= b.charCodeAt(d) & 0xff;
            a = (a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16);
    }
    a ^= a >>> 13;
    a = (a & 0xffff) * 0x5bd1e995 + (((a >>> 16) * 0xe995) << 16);
    return ((a ^ (a >>> 15)) >>> 0).toString(36);
}
function m(a) {
    return a != null && typeof a !== "boolean";
}
var n = a(function(a) {
    return f(a) ? a : a.replace(c, "-$&").toLowerCase();
});
var o = function c(b, a) {
    switch(b){
        case "animation":
        case "animationName":
            {
                if (typeof a === "string") {
                    return a.replace(d, function(c, a, b) {
                        h = {
                            name: a,
                            styles: b,
                            next: h
                        };
                        return a;
                    });
                }
            }
    }
    if (e[b] !== 1 && !f(b) && typeof a === "number" && a !== 0) {
        return a + "px";
    }
    return a;
};
function p(a) {
    var b = Object.create(null);
    return function(c) {
        if (b[c] === undefined) b[c] = a(c);
        return b[c];
    };
}
