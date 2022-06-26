var a = p;
var b = /[A-Z]|^ms/g;
var c = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
var d = {
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
var e = d;
var f = function a(b) {
    return b.charCodeAt(1) === 45;
};
var g = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
var h;
var i = l;
function j(a, b, c) {
    if (c == null) {
        return "";
    }
    if (c.__emotion_styles !== undefined) {
        if (false) {}
        return c;
    }
    switch(typeof c){
        case "boolean":
            {
                return "";
            }
        case "object":
            {
                if (c.anim === 1) {
                    h = {
                        name: c.name,
                        styles: c.styles,
                        next: h
                    };
                    return c.name;
                }
                if (c.styles !== undefined) {
                    var d = c.next;
                    if (d !== undefined) {
                        while(d !== undefined){
                            h = {
                                name: d.name,
                                styles: d.styles,
                                next: h
                            };
                            d = d.next;
                        }
                    }
                    var e = c.styles + ";";
                    if (false) {}
                    return e;
                }
                return k(a, b, c);
            }
        case "function":
            {
                if (a !== undefined) {
                    var f = h;
                    var g = c(a);
                    h = f;
                    return j(a, b, g);
                } else if (false) {}
                break;
            }
        case "string":
            if (false) {
                var i, l;
            }
            break;
    }
    if (b == null) {
        return c;
    }
    var m = b[c];
    return m !== undefined ? m : c;
}
export function serializeStyles(a, b, c) {
    if (a.length === 1 && typeof a[0] === "object" && a[0] !== null && a[0].styles !== undefined) {
        return a[0];
    }
    var d = true;
    var e = "";
    h = undefined;
    var f = a[0];
    if (f == null || f.raw === undefined) {
        d = false;
        e += j(c, b, f);
    } else {
        if (false) {}
        e += f[0];
    }
    for(var k = 1; k < a.length; k++){
        e += j(c, b, a[k]);
        if (d) {
            if (false) {}
            e += f[k];
        }
    }
    var l;
    if (false) {}
    g.lastIndex = 0;
    var m = "";
    var n;
    while((n = g.exec(e)) !== null){
        m += "-" + n[1];
    }
    var o = i(e) + m;
    if (false) {}
    return {
        name: o,
        styles: e,
        next: h
    };
}
function k(a, b, c) {
    var d = "";
    if (Array.isArray(c)) {
        for(var e = 0; e < c.length; e++){
            d += j(a, b, c[e]) + ";";
        }
    } else {
        for(var f in c){
            var g = c[f];
            if (typeof g !== "object") {
                if (b != null && b[g] !== undefined) {
                    d += f + "{" + b[g] + "}";
                } else if (m(g)) {
                    d += n(f) + ":" + o(f, g) + ";";
                }
            } else {
                if (f === "NO_COMPONENT_SELECTOR" && "production" !== "production") {}
                if (Array.isArray(g) && typeof g[0] === "string" && (b == null || b[g[0]] === undefined)) {
                    for(var h = 0; h < g.length; h++){
                        if (m(g[h])) {
                            d += n(f) + ":" + o(f, g[h]) + ";";
                        }
                    }
                } else {
                    var i = j(a, b, g);
                    switch(f){
                        case "animation":
                        case "animationName":
                            {
                                d += n(f) + ":" + i + ";";
                                break;
                            }
                        default:
                            {
                                if (false) {}
                                d += f + "{" + i + "}";
                            }
                    }
                }
            }
        }
    }
    return d;
}
function l(a) {
    var b = 0;
    var c, d = 0, e = a.length;
    for(; e >= 4; ++d, e -= 4){
        c = (a.charCodeAt(d) & 0xff) | ((a.charCodeAt(++d) & 0xff) << 8) | ((a.charCodeAt(++d) & 0xff) << 16) | ((a.charCodeAt(++d) & 0xff) << 24);
        c = (c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16);
        c ^= c >>> 24;
        b = ((c & 0xffff) * 0x5bd1e995 + (((c >>> 16) * 0xe995) << 16)) ^ ((b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16));
    }
    switch(e){
        case 3:
            b ^= (a.charCodeAt(d + 2) & 0xff) << 16;
        case 2:
            b ^= (a.charCodeAt(d + 1) & 0xff) << 8;
        case 1:
            b ^= a.charCodeAt(d) & 0xff;
            b = (b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16);
    }
    b ^= b >>> 13;
    b = (b & 0xffff) * 0x5bd1e995 + (((b >>> 16) * 0xe995) << 16);
    return ((b ^ (b >>> 15)) >>> 0).toString(36);
}
function m(a) {
    return a != null && typeof a !== "boolean";
}
var n = a(function(a) {
    return f(a) ? a : a.replace(b, "-$&").toLowerCase();
});
var o = function a(b, d) {
    switch(b){
        case "animation":
        case "animationName":
            {
                if (typeof d === "string") {
                    return d.replace(c, function(a, b, c) {
                        h = {
                            name: b,
                            styles: c,
                            next: h
                        };
                        return b;
                    });
                }
            }
    }
    if (e[b] !== 1 && !f(b) && typeof d === "number" && d !== 0) {
        return d + "px";
    }
    return d;
};
function p(a) {
    var b = Object.create(null);
    return function(c) {
        if (b[c] === undefined) b[c] = a(c);
        return b[c];
    };
}
