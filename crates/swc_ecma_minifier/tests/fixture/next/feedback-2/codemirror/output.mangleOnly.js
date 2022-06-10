(function(a, b) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = b()) : typeof define === "function" && define.amd ? define(b) : ((a = a || self), (a.CodeMirror = b()));
})(this, function() {
    "use strict";
    var f = navigator.userAgent;
    var D = navigator.platform;
    var E = /gecko\/\d/i.test(f);
    var F = /MSIE \d/.test(f);
    var G = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(f);
    var s = /Edge\/(\d+)/.exec(f);
    var t = F || G || s;
    var P = t && (F ? document.documentMode || 6 : +(s || G)[1]);
    var H = !s && /WebKit\//.test(f);
    var Q = H && /Qt\/\d+\.\d+/.test(f);
    var R = !s && /Chrome\//.test(f);
    var x = /Opera\//.test(f);
    var I = /Apple Computer/.test(navigator.vendor);
    var ae = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(f);
    var af = /PhantomJS/.test(f);
    var y = I && (/Mobile\/\w+/.test(f) || navigator.maxTouchPoints > 2);
    var S = /Android/.test(f);
    var ag = y || S || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(f);
    var J = y || /Mac/.test(D);
    var ah = /\bCrOS\b/.test(f);
    var ai = /win/i.test(D);
    var h = x && f.match(/Version\/(\d*\.\d*)/);
    if (h) {
        h = Number(h[1]);
    }
    if (h && h >= 15) {
        x = false;
        H = true;
    }
    var aj = J && (Q || (x && (h == null || h < 12.11)));
    var ak = E || (t && P >= 9);
    function al(a) {
        return new RegExp("(^|\\s)" + a + "(?:$|\\s)\\s*");
    }
    var am = function(c, e) {
        var b = c.className;
        var a = al(e).exec(b);
        if (a) {
            var d = b.slice(a.index + a[0].length);
            c.className = b.slice(0, a.index) + (d ? a[1] + d : "");
        }
    };
    function an(a) {
        for(var b = a.childNodes.length; b > 0; --b){
            a.removeChild(a.firstChild);
        }
        return a;
    }
    function ao(a, b) {
        return an(a).appendChild(b);
    }
    function ap(f, a, d, e) {
        var b = document.createElement(f);
        if (d) {
            b.className = d;
        }
        if (e) {
            b.style.cssText = e;
        }
        if (typeof a == "string") {
            b.appendChild(document.createTextNode(a));
        } else if (a) {
            for(var c = 0; c < a.length; ++c){
                b.appendChild(a[c]);
            }
        }
        return b;
    }
    function aq(b, c, d, e) {
        var a = ap(b, c, d, e);
        a.setAttribute("role", "presentation");
        return a;
    }
    var K;
    if (document.createRange) {
        K = function(b, c, d, e) {
            var a = document.createRange();
            a.setEnd(e || b, d);
            a.setStart(b, c);
            return a;
        };
    } else {
        K = function(b, c, d) {
            var a = document.body.createTextRange();
            try {
                a.moveToElementText(b.parentNode);
            } catch (e) {
                return a;
            }
            a.collapse(true);
            a.moveEnd("character", d);
            a.moveStart("character", c);
            return a;
        };
    }
    function ar(b, a) {
        if (a.nodeType == 3) {
            a = a.parentNode;
        }
        if (b.contains) {
            return b.contains(a);
        }
        do {
            if (a.nodeType == 11) {
                a = a.host;
            }
            if (a == b) {
                return true;
            }
        }while ((a = a.parentNode))
    }
    function as() {
        var a;
        try {
            a = document.activeElement;
        } catch (b) {
            a = document.body || null;
        }
        while(a && a.shadowRoot && a.shadowRoot.activeElement){
            a = a.shadowRoot.activeElement;
        }
        return a;
    }
    function at(a, b) {
        var c = a.className;
        if (!al(b).test(c)) {
            a.className += (c ? " " : "") + b;
        }
    }
    function au(d, c) {
        var b = d.split(" ");
        for(var a = 0; a < b.length; a++){
            if (b[a] && !al(b[a]).test(c)) {
                c += " " + b[a];
            }
        }
        return c;
    }
    var L = function(a) {
        a.select();
    };
    if (y) {
        L = function(a) {
            a.selectionStart = 0;
            a.selectionEnd = a.value.length;
        };
    } else if (t) {
        L = function(a) {
            try {
                a.select();
            } catch (b) {}
        };
    }
    function av(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return function() {
            return a.apply(null, b);
        };
    }
    function aw(c, a, d) {
        if (!a) {
            a = {};
        }
        for(var b in c){
            if (c.hasOwnProperty(b) && (d !== false || !a.hasOwnProperty(b))) {
                a[b] = c[b];
            }
        }
        return a;
    }
    function ax(e, a, f, g, h) {
        if (a == null) {
            a = e.search(/[^\s\u00a0]/);
            if (a == -1) {
                a = e.length;
            }
        }
        for(var b = g || 0, c = h || 0;;){
            var d = e.indexOf("\t", b);
            if (d < 0 || d >= a) {
                return c + (a - b);
            }
            c += d - b;
            c += f - (c % f);
            b = d + 1;
        }
    }
    var z = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = av(this.onTimeout, this);
    };
    z.prototype.onTimeout = function(a) {
        a.id = 0;
        if (a.time <= +new Date()) {
            a.f();
        } else {
            setTimeout(a.handler, a.time - +new Date());
        }
    };
    z.prototype.set = function(a, c) {
        this.f = c;
        var b = +new Date() + a;
        if (!this.id || b < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, a);
            this.time = b;
        }
    };
    function T(b, c) {
        for(var a = 0; a < b.length; ++a){
            if (b[a] == c) {
                return a;
            }
        }
        return -1;
    }
    var ay = 50;
    var az = {
        toString: function() {
            return "CodeMirror.Pass";
        }
    };
    var aA = {
        scroll: false
    }, aB = {
        origin: "*mouse"
    }, aC = {
        origin: "+move"
    };
    function aD(d, e, f) {
        for(var a = 0, b = 0;;){
            var c = d.indexOf("\t", a);
            if (c == -1) {
                c = d.length;
            }
            var g = c - a;
            if (c == d.length || b + g >= e) {
                return a + Math.min(g, e - b);
            }
            b += c - a;
            b += f - (b % f);
            a = c + 1;
            if (b >= e) {
                return a;
            }
        }
    }
    var aE = [
        ""
    ];
    function aF(a) {
        while(aE.length <= a){
            aE.push(aG(aE) + " ");
        }
        return aE[a];
    }
    function aG(a) {
        return a[a.length - 1];
    }
    function aH(b, d) {
        var c = [];
        for(var a = 0; a < b.length; a++){
            c[a] = d(b[a], a);
        }
        return c;
    }
    function aI(b, c, d) {
        var a = 0, e = d(c);
        while(a < b.length && d(b[a]) <= e){
            a++;
        }
        b.splice(a, 0, c);
    }
    function aJ() {}
    function U(b, c) {
        var a;
        if (Object.create) {
            a = Object.create(b);
        } else {
            aJ.prototype = b;
            a = new aJ();
        }
        if (c) {
            aw(c, a);
        }
        return a;
    }
    var aK = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function aL(a) {
        return (/\w/.test(a) || (a > "\x80" && (a.toUpperCase() != a.toLowerCase() || aK.test(a))));
    }
    function aM(a, b) {
        if (!b) {
            return aL(a);
        }
        if (b.source.indexOf("\\w") > -1 && aL(a)) {
            return true;
        }
        return b.test(a);
    }
    function aN(a) {
        for(var b in a){
            if (a.hasOwnProperty(b) && a[b]) {
                return false;
            }
        }
        return true;
    }
    var aO = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function aP(a) {
        return a.charCodeAt(0) >= 768 && aO.test(a);
    }
    function aQ(b, a, c) {
        while((c < 0 ? a > 0 : a < b.length) && aP(b.charAt(a))){
            a += c;
        }
        return a;
    }
    function aR(d, a, b) {
        var e = a > b ? -1 : 1;
        for(;;){
            if (a == b) {
                return a;
            }
            var f = (a + b) / 2, c = e < 0 ? Math.ceil(f) : Math.floor(f);
            if (c == a) {
                return d(c) ? a : b;
            }
            if (d(c)) {
                b = c;
            } else {
                a = c + e;
            }
        }
    }
    function aS(e, a, c, f) {
        if (!e) {
            return f(a, c, "ltr", 0);
        }
        var g = false;
        for(var d = 0; d < e.length; ++d){
            var b = e[d];
            if ((b.from < c && b.to > a) || (a == c && b.to == a)) {
                f(Math.max(b.from, a), Math.min(b.to, c), b.level == 1 ? "rtl" : "ltr", d);
                g = true;
            }
        }
        if (!g) {
            f(a, c, "ltr");
        }
    }
    var aT = null;
    function aU(e, c, f) {
        var d;
        aT = null;
        for(var a = 0; a < e.length; ++a){
            var b = e[a];
            if (b.from < c && b.to > c) {
                return a;
            }
            if (b.to == c) {
                if (b.from != b.to && f == "before") {
                    d = a;
                } else {
                    aT = a;
                }
            }
            if (b.from == c) {
                if (b.from != b.to && f != "before") {
                    d = a;
                } else {
                    aT = a;
                }
            }
        }
        return d != null ? d : aT;
    }
    var aV = (function() {
        var a = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var b = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function c(c) {
            if (c <= 0xf7) {
                return a.charAt(c);
            } else if (0x590 <= c && c <= 0x5f4) {
                return "R";
            } else if (0x600 <= c && c <= 0x6f9) {
                return b.charAt(c - 0x600);
            } else if (0x6ee <= c && c <= 0x8ac) {
                return "r";
            } else if (0x2000 <= c && c <= 0x200b) {
                return "w";
            } else if (c == 0x200c) {
                return "b";
            } else {
                return "L";
            }
        }
        var d = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var e = /[stwN]/, f = /[LRr]/, g = /[Lb1n]/, h = /[1n]/;
        function i(a, b, c) {
            this.level = a;
            this.from = b;
            this.to = c;
        }
        return function(r, w) {
            var s = w == "ltr" ? "L" : "R";
            if (r.length == 0 || (w == "ltr" && !d.test(r))) {
                return false;
            }
            var j = r.length, a = [];
            for(var C = 0; C < j; ++C){
                a.push(c(r.charCodeAt(C)));
            }
            for(var z = 0, H = s; z < j; ++z){
                var I = a[z];
                if (I == "m") {
                    a[z] = H;
                } else {
                    H = I;
                }
            }
            for(var x = 0, J = s; x < j; ++x){
                var A = a[x];
                if (A == "1" && J == "r") {
                    a[x] = "n";
                } else if (f.test(A)) {
                    J = A;
                    if (A == "r") {
                        a[x] = "R";
                    }
                }
            }
            for(var q = 1, t = a[0]; q < j - 1; ++q){
                var D = a[q];
                if (D == "+" && t == "1" && a[q + 1] == "1") {
                    a[q] = "1";
                } else if (D == "," && t == a[q + 1] && (t == "1" || t == "n")) {
                    a[q] = t;
                }
                t = D;
            }
            for(var m = 0; m < j; ++m){
                var K = a[m];
                if (K == ",") {
                    a[m] = "N";
                } else if (K == "%") {
                    var n = void 0;
                    for(n = m + 1; n < j && a[n] == "%"; ++n){}
                    var O = (m && a[m - 1] == "!") || (n < j && a[n] == "1") ? "1" : "N";
                    for(var E = m; E < n; ++E){
                        a[E] = O;
                    }
                    m = n - 1;
                }
            }
            for(var B = 0, L = s; B < j; ++B){
                var F = a[B];
                if (L == "L" && F == "1") {
                    a[B] = "L";
                } else if (f.test(F)) {
                    L = F;
                }
            }
            for(var o = 0; o < j; ++o){
                if (e.test(a[o])) {
                    var p = void 0;
                    for(p = o + 1; p < j && e.test(a[p]); ++p){}
                    var M = (o ? a[o - 1] : s) == "L";
                    var P = (p < j ? a[p] : s) == "L";
                    var Q = M == P ? (M ? "L" : "R") : s;
                    for(var G = o; G < p; ++G){
                        a[G] = Q;
                    }
                    o = p - 1;
                }
            }
            var k = [], u;
            for(var b = 0; b < j;){
                if (g.test(a[b])) {
                    var R = b;
                    for(++b; b < j && g.test(a[b]); ++b){}
                    k.push(new i(0, R, b));
                } else {
                    var v = b, y = k.length, N = w == "rtl" ? 1 : 0;
                    for(++b; b < j && a[b] != "L"; ++b){}
                    for(var l = v; l < b;){
                        if (h.test(a[l])) {
                            if (v < l) {
                                k.splice(y, 0, new i(1, v, l));
                                y += N;
                            }
                            var S = l;
                            for(++l; l < b && h.test(a[l]); ++l){}
                            k.splice(y, 0, new i(2, S, l));
                            y += N;
                            v = l;
                        } else {
                            ++l;
                        }
                    }
                    if (v < b) {
                        k.splice(y, 0, new i(1, v, b));
                    }
                }
            }
            if (w == "ltr") {
                if (k[0].level == 1 && (u = r.match(/^\s+/))) {
                    k[0].from = u[0].length;
                    k.unshift(new i(0, 0, u[0].length));
                }
                if (aG(k).level == 1 && (u = r.match(/\s+$/))) {
                    aG(k).to -= u[0].length;
                    k.push(new i(0, j - u[0].length, j));
                }
            }
            return w == "rtl" ? k.reverse() : k;
        };
    })();
    function aW(a, c) {
        var b = a.order;
        if (b == null) {
            b = a.order = aV(a.text, c);
        }
        return b;
    }
    var aX = [];
    var aY = function(a, b, c) {
        if (a.addEventListener) {
            a.addEventListener(b, c, false);
        } else if (a.attachEvent) {
            a.attachEvent("on" + b, c);
        } else {
            var d = a._handlers || (a._handlers = {});
            d[b] = (d[b] || aX).concat(c);
        }
    };
    function aZ(a, b) {
        return (a._handlers && a._handlers[b]) || aX;
    }
    function a$(a, b, d) {
        if (a.removeEventListener) {
            a.removeEventListener(b, d, false);
        } else if (a.detachEvent) {
            a.detachEvent("on" + b, d);
        } else {
            var e = a._handlers, c = e && e[b];
            if (c) {
                var f = T(c, d);
                if (f > -1) {
                    e[b] = c.slice(0, f).concat(c.slice(f + 1));
                }
            }
        }
    }
    function a_(c, d) {
        var a = aZ(c, d);
        if (!a.length) {
            return;
        }
        var e = Array.prototype.slice.call(arguments, 2);
        for(var b = 0; b < a.length; ++b){
            a[b].apply(null, e);
        }
    }
    function a0(b, a, c) {
        if (typeof a == "string") {
            a = {
                type: a,
                preventDefault: function() {
                    this.defaultPrevented = true;
                }
            };
        }
        a_(b, c || a.type, b, a);
        return a5(a) || a.codemirrorIgnore;
    }
    function a1(a) {
        var b = a._handlers && a._handlers.cursorActivity;
        if (!b) {
            return;
        }
        var d = a.curOp.cursorActivityHandlers || (a.curOp.cursorActivityHandlers = []);
        for(var c = 0; c < b.length; ++c){
            if (T(d, b[c]) == -1) {
                d.push(b[c]);
            }
        }
    }
    function a2(a, b) {
        return aZ(a, b).length > 0;
    }
    function l(a) {
        a.prototype.on = function(a, b) {
            aY(this, a, b);
        };
        a.prototype.off = function(a, b) {
            a$(this, a, b);
        };
    }
    function a3(a) {
        if (a.preventDefault) {
            a.preventDefault();
        } else {
            a.returnValue = false;
        }
    }
    function a4(a) {
        if (a.stopPropagation) {
            a.stopPropagation();
        } else {
            a.cancelBubble = true;
        }
    }
    function a5(a) {
        return a.defaultPrevented != null ? a.defaultPrevented : a.returnValue == false;
    }
    function a6(a) {
        a3(a);
        a4(a);
    }
    function a7(a) {
        return a.target || a.srcElement;
    }
    function a8(b) {
        var a = b.which;
        if (a == null) {
            if (b.button & 1) {
                a = 1;
            } else if (b.button & 2) {
                a = 3;
            } else if (b.button & 4) {
                a = 2;
            }
        }
        if (J && b.ctrlKey && a == 1) {
            a = 3;
        }
        return a;
    }
    var a9 = (function() {
        if (t && P < 9) {
            return false;
        }
        var a = ap("div");
        return "draggable" in a || "dragDrop" in a;
    })();
    var ba;
    function bb(b) {
        if (ba == null) {
            var a = ap("span", "\u200b");
            ao(b, ap("span", [
                a,
                document.createTextNode("x")
            ]));
            if (b.firstChild.offsetHeight != 0) {
                ba = a.offsetWidth <= 1 && a.offsetHeight > 2 && !(t && P < 8);
            }
        }
        var c = ba ? ap("span", "\u200b") : ap("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        c.setAttribute("cm-text", "");
        return c;
    }
    var bc;
    function bd(b) {
        if (bc != null) {
            return bc;
        }
        var c = ao(b, document.createTextNode("A\u062eA"));
        var a = K(c, 0, 1).getBoundingClientRect();
        var d = K(c, 1, 2).getBoundingClientRect();
        an(b);
        if (!a || a.left == a.right) {
            return false;
        }
        return (bc = d.right - a.right < 3);
    }
    var be = "\n\nb".split(/\n/).length != 3 ? function(b) {
        var c = 0, d = [], g = b.length;
        while(c <= g){
            var a = b.indexOf("\n", c);
            if (a == -1) {
                a = b.length;
            }
            var e = b.slice(c, b.charAt(a - 1) == "\r" ? a - 1 : a);
            var f = e.indexOf("\r");
            if (f != -1) {
                d.push(e.slice(0, f));
                c += f + 1;
            } else {
                d.push(e);
                c = a + 1;
            }
        }
        return d;
    } : function(a) {
        return a.split(/\r\n?|\n/);
    };
    var bf = window.getSelection ? function(a) {
        try {
            return a.selectionStart != a.selectionEnd;
        } catch (b) {
            return false;
        }
    } : function(b) {
        var a;
        try {
            a = b.ownerDocument.selection.createRange();
        } catch (c) {}
        if (!a || a.parentElement() != b) {
            return false;
        }
        return a.compareEndPoints("StartToEnd", a) != 0;
    };
    var bg = (function() {
        var a = ap("div");
        if ("oncopy" in a) {
            return true;
        }
        a.setAttribute("oncopy", "return;");
        return typeof a.oncopy == "function";
    })();
    var bh = null;
    function bi(b) {
        if (bh != null) {
            return bh;
        }
        var a = ao(b, ap("span", "x"));
        var c = a.getBoundingClientRect();
        var d = K(a, 0, 1).getBoundingClientRect();
        return (bh = Math.abs(c.left - d.left) > 1);
    }
    var bj = {}, bk = {};
    function bl(b, a) {
        if (arguments.length > 2) {
            a.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        bj[b] = a;
    }
    function V(a, b) {
        bk[a] = b;
    }
    function bm(a) {
        if (typeof a == "string" && bk.hasOwnProperty(a)) {
            a = bk[a];
        } else if (a && typeof a.name == "string" && bk.hasOwnProperty(a.name)) {
            var b = bk[a.name];
            if (typeof b == "string") {
                b = {
                    name: b
                };
            }
            a = U(b, a);
            a.name = b.name;
        } else if (typeof a == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(a)) {
            return bm("application/xml");
        } else if (typeof a == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(a)) {
            return bm("application/json");
        }
        if (typeof a == "string") {
            return {
                name: a
            };
        } else {
            return a || {
                name: "null"
            };
        }
    }
    function bn(e, a) {
        a = bm(a);
        var f = bj[a.name];
        if (!f) {
            return bn(e, "text/plain");
        }
        var b = f(e, a);
        if (bo.hasOwnProperty(a.name)) {
            var d = bo[a.name];
            for(var c in d){
                if (!d.hasOwnProperty(c)) {
                    continue;
                }
                if (b.hasOwnProperty(c)) {
                    b["_" + c] = b[c];
                }
                b[c] = d[c];
            }
        }
        b.name = a.name;
        if (a.helperType) {
            b.helperType = a.helperType;
        }
        if (a.modeProps) {
            for(var g in a.modeProps){
                b[g] = a.modeProps[g];
            }
        }
        return b;
    }
    var bo = {};
    function bp(a, b) {
        var c = bo.hasOwnProperty(a) ? bo[a] : (bo[a] = {});
        aw(b, c);
    }
    function bq(c, a) {
        if (a === true) {
            return a;
        }
        if (c.copyState) {
            return c.copyState(a);
        }
        var d = {};
        for(var e in a){
            var b = a[e];
            if (b instanceof Array) {
                b = b.concat([]);
            }
            d[e] = b;
        }
        return d;
    }
    function br(b, c) {
        var a;
        while(b.innerMode){
            a = b.innerMode(c);
            if (!a || a.mode == b) {
                break;
            }
            c = a.state;
            b = a.mode;
        }
        return a || {
            mode: b,
            state: c
        };
    }
    function bs(a, b, c) {
        return a.startState ? a.startState(b, c) : true;
    }
    var d = function(a, b, c) {
        this.pos = this.start = 0;
        this.string = a;
        this.tabSize = b || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = c;
    };
    d.prototype.eol = function() {
        return this.pos >= this.string.length;
    };
    d.prototype.sol = function() {
        return this.pos == this.lineStart;
    };
    d.prototype.peek = function() {
        return this.string.charAt(this.pos) || undefined;
    };
    d.prototype.next = function() {
        if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++);
        }
    };
    d.prototype.eat = function(a) {
        var b = this.string.charAt(this.pos);
        var c;
        if (typeof a == "string") {
            c = b == a;
        } else {
            c = b && (a.test ? a.test(b) : a(b));
        }
        if (c) {
            ++this.pos;
            return b;
        }
    };
    d.prototype.eatWhile = function(a) {
        var b = this.pos;
        while(this.eat(a)){}
        return this.pos > b;
    };
    d.prototype.eatSpace = function() {
        var a = this.pos;
        while(/[\s\u00a0]/.test(this.string.charAt(this.pos))){
            ++this.pos;
        }
        return this.pos > a;
    };
    d.prototype.skipToEnd = function() {
        this.pos = this.string.length;
    };
    d.prototype.skipTo = function(b) {
        var a = this.string.indexOf(b, this.pos);
        if (a > -1) {
            this.pos = a;
            return true;
        }
    };
    d.prototype.backUp = function(a) {
        this.pos -= a;
    };
    d.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = ax(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return (this.lastColumnValue - (this.lineStart ? ax(this.string, this.lineStart, this.tabSize) : 0));
    };
    d.prototype.indentation = function() {
        return (ax(this.string, null, this.tabSize) - (this.lineStart ? ax(this.string, this.lineStart, this.tabSize) : 0));
    };
    d.prototype.match = function(a, c, f) {
        if (typeof a == "string") {
            var d = function(a) {
                return f ? a.toLowerCase() : a;
            };
            var e = this.string.substr(this.pos, a.length);
            if (d(e) == d(a)) {
                if (c !== false) {
                    this.pos += a.length;
                }
                return true;
            }
        } else {
            var b = this.string.slice(this.pos).match(a);
            if (b && b.index > 0) {
                return null;
            }
            if (b && c !== false) {
                this.pos += b[0].length;
            }
            return b;
        }
    };
    d.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
    };
    d.prototype.hideFirstChars = function(a, b) {
        this.lineStart += a;
        try {
            return b();
        } finally{
            this.lineStart -= a;
        }
    };
    d.prototype.lookAhead = function(b) {
        var a = this.lineOracle;
        return a && a.lookAhead(b);
    };
    d.prototype.baseToken = function() {
        var a = this.lineOracle;
        return a && a.baseToken(this.pos);
    };
    function bt(b, a) {
        a -= b.first;
        if (a < 0 || a >= b.size) {
            throw new Error("There is no line " + (a + b.first) + " in the document.");
        }
        var c = b;
        while(!c.lines){
            for(var d = 0;; ++d){
                var e = c.children[d], f = e.chunkSize();
                if (a < f) {
                    c = e;
                    break;
                }
                a -= f;
            }
        }
        return c.lines[a];
    }
    function bu(b, a, c) {
        var d = [], e = a.line;
        b.iter(a.line, c.line + 1, function(f) {
            var b = f.text;
            if (e == c.line) {
                b = b.slice(0, c.ch);
            }
            if (e == a.line) {
                b = b.slice(a.ch);
            }
            d.push(b);
            ++e;
        });
        return d;
    }
    function bv(a, b, c) {
        var d = [];
        a.iter(b, c, function(a) {
            d.push(a.text);
        });
        return d;
    }
    function bw(b, d) {
        var c = d - b.height;
        if (c) {
            for(var a = b; a; a = a.parent){
                a.height += c;
            }
        }
    }
    function bx(c) {
        if (c.parent == null) {
            return null;
        }
        var b = c.parent, e = T(b.lines, c);
        for(var a = b.parent; a; b = a, a = a.parent){
            for(var d = 0;; ++d){
                if (a.children[d] == b) {
                    break;
                }
                e += a.children[d].chunkSize();
            }
        }
        return e + b.first;
    }
    function by(a, b) {
        var d = a.first;
        outer: do {
            for(var e = 0; e < a.children.length; ++e){
                var f = a.children[e], g = f.height;
                if (b < g) {
                    a = f;
                    continue outer;
                }
                b -= g;
                d += f.chunkSize();
            }
            return d;
        }while (!a.lines)
        var c = 0;
        for(; c < a.lines.length; ++c){
            var i = a.lines[c], h = i.height;
            if (b < h) {
                break;
            }
            b -= h;
        }
        return d + c;
    }
    function bz(a, b) {
        return b >= a.first && b < a.first + a.size;
    }
    function bA(a, b) {
        return String(a.lineNumberFormatter(b + a.firstLineNumber));
    }
    function bB(b, c, a) {
        if (a === void 0) a = null;
        if (!(this instanceof bB)) {
            return new bB(b, c, a);
        }
        this.line = b;
        this.ch = c;
        this.sticky = a;
    }
    function bC(a, b) {
        return a.line - b.line || a.ch - b.ch;
    }
    function bD(a, b) {
        return a.sticky == b.sticky && bC(a, b) == 0;
    }
    function bE(a) {
        return bB(a.line, a.ch);
    }
    function bF(a, b) {
        return bC(a, b) < 0 ? b : a;
    }
    function bG(a, b) {
        return bC(a, b) < 0 ? a : b;
    }
    function bH(a, b) {
        return Math.max(a.first, Math.min(b, a.first + a.size - 1));
    }
    function bI(a, b) {
        if (b.line < a.first) {
            return bB(a.first, 0);
        }
        var c = a.first + a.size - 1;
        if (b.line > c) {
            return bB(c, bt(a, c).text.length);
        }
        return bJ(b, bt(a, b.line).text.length);
    }
    function bJ(a, c) {
        var b = a.ch;
        if (b == null || b > c) {
            return bB(a.line, c);
        } else if (b < 0) {
            return bB(a.line, 0);
        } else {
            return a;
        }
    }
    function bK(d, b) {
        var c = [];
        for(var a = 0; a < b.length; a++){
            c[a] = bI(d, b[a]);
        }
        return c;
    }
    var bL = function(a, b) {
        this.state = a;
        this.lookAhead = b;
    };
    var m = function(a, b, c, d) {
        this.state = b;
        this.doc = a;
        this.line = c;
        this.maxLookAhead = d || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
    };
    m.prototype.lookAhead = function(a) {
        var b = this.doc.getLine(this.line + a);
        if (b != null && a > this.maxLookAhead) {
            this.maxLookAhead = a;
        }
        return b;
    };
    m.prototype.baseToken = function(a) {
        if (!this.baseTokens) {
            return null;
        }
        while(this.baseTokens[this.baseTokenPos] <= a){
            this.baseTokenPos += 2;
        }
        var b = this.baseTokens[this.baseTokenPos + 1];
        return {
            type: b && b.replace(/( |^)overlay .*/, ""),
            size: this.baseTokens[this.baseTokenPos] - a
        };
    };
    m.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) {
            this.maxLookAhead--;
        }
    };
    m.fromSaved = function(a, b, c) {
        if (b instanceof bL) {
            return new m(a, bq(a.mode, b.state), c, b.lookAhead);
        } else {
            return new m(a, bq(a.mode, b), c);
        }
    };
    m.prototype.save = function(b) {
        var a = b !== false ? bq(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new bL(a, this.maxLookAhead) : a;
    };
    function bM(a, e, d, f) {
        var g = [
            a.state.modeGen
        ], b = {};
        bV(a, e.text, a.doc.mode, d, function(a, b) {
            return g.push(a, b);
        }, b, f);
        var i = d.state;
        var h = function(c) {
            d.baseTokens = g;
            var f = a.state.overlays[c], h = 1, j = 0;
            d.state = true;
            bV(a, e.text, f.mode, d, function(b, c) {
                var a = h;
                while(j < b){
                    var d = g[h];
                    if (d > b) {
                        g.splice(h, 1, b, g[h + 1], d);
                    }
                    h += 2;
                    j = Math.min(b, d);
                }
                if (!c) {
                    return;
                }
                if (f.opaque) {
                    g.splice(a, h - a, b, "overlay " + c);
                    h = a + 2;
                } else {
                    for(; a < h; a += 2){
                        var e = g[a + 1];
                        g[a + 1] = (e ? e + " " : "") + "overlay " + c;
                    }
                }
            }, b);
            d.state = i;
            d.baseTokens = null;
            d.baseTokenPos = 1;
        };
        for(var c = 0; c < a.state.overlays.length; ++c)h(c);
        return {
            styles: g,
            classes: b.bgClass || b.textClass ? b : null
        };
    }
    function bN(b, a, f) {
        if (!a.styles || a.styles[0] != b.state.modeGen) {
            var c = bO(b, bx(a));
            var d = a.text.length > b.options.maxHighlightLength && bq(b.doc.mode, c.state);
            var e = bM(b, a, c);
            if (d) {
                c.state = d;
            }
            a.stateAfter = c.save(!d);
            a.styles = e.styles;
            if (e.classes) {
                a.styleClasses = e.classes;
            } else if (a.styleClasses) {
                a.styleClasses = null;
            }
            if (f === b.doc.highlightFrontier) {
                b.doc.modeFrontier = Math.max(b.doc.modeFrontier, ++b.doc.highlightFrontier);
            }
        }
        return a.styles;
    }
    function bO(c, d, e) {
        var a = c.doc, h = c.display;
        if (!a.mode.startState) {
            return new m(a, true, d);
        }
        var b = bW(c, d, e);
        var f = b > a.first && bt(a, b - 1).stateAfter;
        var g = f ? m.fromSaved(a, f, b) : new m(a, bs(a.mode), b);
        a.iter(b, d, function(b) {
            bP(c, b.text, g);
            var a = g.line;
            b.stateAfter = a == d - 1 || a % 5 == 0 || (a >= h.viewFrom && a < h.viewTo) ? g.save() : null;
            g.nextLine();
        });
        if (e) {
            a.modeFrontier = g.line;
        }
        return g;
    }
    function bP(c, e, b, g) {
        var f = c.doc.mode;
        var a = new d(e, c.options.tabSize, b);
        a.start = a.pos = g || 0;
        if (e == "") {
            bQ(f, b.state);
        }
        while(!a.eol()){
            bR(f, a, b.state);
            a.start = a.pos;
        }
    }
    function bQ(a, c) {
        if (a.blankLine) {
            return a.blankLine(c);
        }
        if (!a.innerMode) {
            return;
        }
        var b = br(a, c);
        if (b.mode.blankLine) {
            return b.mode.blankLine(b.state);
        }
    }
    function bR(a, b, c, d) {
        for(var e = 0; e < 10; e++){
            if (d) {
                d[0] = br(a, c).mode;
            }
            var f = a.token(b, c);
            if (b.pos > b.start) {
                return f;
            }
        }
        throw new Error("Mode " + a.name + " failed to advance stream.");
    }
    var bS = function(a, b, c) {
        this.start = a.start;
        this.end = a.pos;
        this.string = a.current();
        this.type = b || null;
        this.state = c;
    };
    function bT(g, b, j, c) {
        var e = g.doc, k = e.mode, h;
        b = bI(e, b);
        var l = bt(e, b.line), f = bO(g, b.line, j);
        var a = new d(l.text, g.options.tabSize, f), i;
        if (c) {
            i = [];
        }
        while((c || a.pos < b.ch) && !a.eol()){
            a.start = a.pos;
            h = bR(k, a, f.state);
            if (c) {
                i.push(new bS(a, h, bq(e.mode, f.state)));
            }
        }
        return c ? i : new bS(a, h, f.state);
    }
    function bU(b, c) {
        if (b) {
            for(;;){
                var a = b.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!a) {
                    break;
                }
                b = b.slice(0, a.index) + b.slice(a.index + a[0].length);
                var d = a[1] ? "bgClass" : "textClass";
                if (c[d] == null) {
                    c[d] = a[2];
                } else if (!new RegExp("(?:^|\\s)" + a[2] + "(?:$|\\s)").test(c[d])) {
                    c[d] += " " + a[2];
                }
            }
        }
        return b;
    }
    function bV(e, f, j, g, m, n, p) {
        var h = j.flattenSpans;
        if (h == null) {
            h = e.options.flattenSpans;
        }
        var b = 0, i = null;
        var a = new d(f, e.options.tabSize, g), c;
        var k = e.options.addModeClass && [
            null
        ];
        if (f == "") {
            bU(bQ(j, g.state), n);
        }
        while(!a.eol()){
            if (a.pos > e.options.maxHighlightLength) {
                h = false;
                if (p) {
                    bP(e, f, g, a.pos);
                }
                a.pos = f.length;
                c = null;
            } else {
                c = bU(bR(j, a, g.state, k), n);
            }
            if (k) {
                var l = k[0].name;
                if (l) {
                    c = "m-" + (c ? l + " " + c : l);
                }
            }
            if (!h || i != c) {
                while(b < a.start){
                    b = Math.min(a.start, b + 5000);
                    m(b, i);
                }
                i = c;
            }
            a.start = a.pos;
        }
        while(b < a.pos){
            var o = Math.min(a.pos, b + 5000);
            m(o, i);
            b = o;
        }
    }
    function bW(c, f, g) {
        var h, d, b = c.doc;
        var k = g ? -1 : f - (c.doc.mode.innerMode ? 1000 : 100);
        for(var a = f; a > k; --a){
            if (a <= b.first) {
                return b.first;
            }
            var i = bt(b, a - 1), e = i.stateAfter;
            if (e && (!g || a + (e instanceof bL ? e.lookAhead : 0) <= b.modeFrontier)) {
                return a;
            }
            var j = ax(i.text, null, c.options.tabSize);
            if (d == null || h > j) {
                d = a - 1;
                h = j;
            }
        }
        return d;
    }
    function bX(a, c) {
        a.modeFrontier = Math.min(a.modeFrontier, c);
        if (a.highlightFrontier < c - 10) {
            return;
        }
        var d = a.first;
        for(var b = c - 1; b > d; b--){
            var e = bt(a, b).stateAfter;
            if (e && (!(e instanceof bL) || b + e.lookAhead < c)) {
                d = b + 1;
                break;
            }
        }
        a.highlightFrontier = Math.min(a.highlightFrontier, d);
    }
    var bY = false, bZ = false;
    function b$() {
        bY = true;
    }
    function b_() {
        bZ = true;
    }
    function b0(a, b, c) {
        this.marker = a;
        this.from = b;
        this.to = c;
    }
    function b1(a, d) {
        if (a) {
            for(var b = 0; b < a.length; ++b){
                var c = a[b];
                if (c.marker == d) {
                    return c;
                }
            }
        }
    }
    function b2(b, d) {
        var c;
        for(var a = 0; a < b.length; ++a){
            if (b[a] != d) {
                (c || (c = [])).push(b[a]);
            }
        }
        return c;
    }
    function b3(a, b, d) {
        var c = d && window.WeakSet && (d.markedSpans || (d.markedSpans = new WeakSet()));
        if (c && c.has(a.markedSpans)) {
            a.markedSpans.push(b);
        } else {
            a.markedSpans = a.markedSpans ? a.markedSpans.concat([
                b
            ]) : [
                b
            ];
            if (c) {
                c.add(a.markedSpans);
            }
        }
        b.marker.attachLine(a);
    }
    function b4(d, b, g) {
        var e;
        if (d) {
            for(var f = 0; f < d.length; ++f){
                var a = d[f], c = a.marker;
                var h = a.from == null || (c.inclusiveLeft ? a.from <= b : a.from < b);
                if (h || (a.from == b && c.type == "bookmark" && (!g || !a.marker.insertLeft))) {
                    var i = a.to == null || (c.inclusiveRight ? a.to >= b : a.to > b);
                    (e || (e = [])).push(new b0(c, a.from, i ? null : a.to));
                }
            }
        }
        return e;
    }
    function b5(d, b, g) {
        var e;
        if (d) {
            for(var f = 0; f < d.length; ++f){
                var a = d[f], c = a.marker;
                var h = a.to == null || (c.inclusiveRight ? a.to >= b : a.to > b);
                if (h || (a.from == b && c.type == "bookmark" && (!g || a.marker.insertLeft))) {
                    var i = a.from == null || (c.inclusiveLeft ? a.from <= b : a.from < b);
                    (e || (e = [])).push(new b0(c, i ? null : a.from - b, a.to == null ? null : a.to - b));
                }
            }
        }
        return e;
    }
    function b6(f, b) {
        if (b.full) {
            return null;
        }
        var p = bz(f, b.from.line) && bt(f, b.from.line).markedSpans;
        var q = bz(f, b.to.line) && bt(f, b.to.line).markedSpans;
        if (!p && !q) {
            return null;
        }
        var j = b.from.ch, u = b.to.ch, r = bC(b.from, b.to) == 0;
        var a = b4(p, j, r);
        var c = b5(q, u, r);
        var e = b.text.length == 1, g = aG(b.text).length + (e ? j : 0);
        if (a) {
            for(var k = 0; k < a.length; ++k){
                var h = a[k];
                if (h.to == null) {
                    var l = b1(c, h.marker);
                    if (!l) {
                        h.to = j;
                    } else if (e) {
                        h.to = l.to == null ? null : l.to + g;
                    }
                }
            }
        }
        if (c) {
            for(var m = 0; m < c.length; ++m){
                var d = c[m];
                if (d.to != null) {
                    d.to += g;
                }
                if (d.from == null) {
                    var v = b1(a, d.marker);
                    if (!v) {
                        d.from = g;
                        if (e) {
                            (a || (a = [])).push(d);
                        }
                    }
                } else {
                    d.from += g;
                    if (e) {
                        (a || (a = [])).push(d);
                    }
                }
            }
        }
        if (a) {
            a = b7(a);
        }
        if (c && c != a) {
            c = b7(c);
        }
        var n = [
            a
        ];
        if (!e) {
            var s = b.text.length - 2, o;
            if (s > 0 && a) {
                for(var i = 0; i < a.length; ++i){
                    if (a[i].to == null) {
                        (o || (o = [])).push(new b0(a[i].marker, null, null));
                    }
                }
            }
            for(var t = 0; t < s; ++t){
                n.push(o);
            }
            n.push(c);
        }
        return n;
    }
    function b7(a) {
        for(var b = 0; b < a.length; ++b){
            var c = a[b];
            if (c.from != null && c.from == c.to && c.marker.clearWhenEmpty !== false) {
                a.splice(b--, 1);
            }
        }
        if (!a.length) {
            return null;
        }
        return a;
    }
    function b8(m, i, j) {
        var f = null;
        m.iter(i.line, j.line + 1, function(a) {
            if (a.markedSpans) {
                for(var b = 0; b < a.markedSpans.length; ++b){
                    var c = a.markedSpans[b].marker;
                    if (c.readOnly && (!f || T(f, c) == -1)) {
                        (f || (f = [])).push(c);
                    }
                }
            }
        });
        if (!f) {
            return null;
        }
        var c = [
            {
                from: i,
                to: j
            }
        ];
        for(var g = 0; g < f.length; ++g){
            var h = f[g], a = h.find(0);
            for(var d = 0; d < c.length; ++d){
                var b = c[d];
                if (bC(b.to, a.from) < 0 || bC(b.from, a.to) > 0) {
                    continue;
                }
                var e = [
                    d,
                    1
                ], k = bC(b.from, a.from), l = bC(b.to, a.to);
                if (k < 0 || (!h.inclusiveLeft && !k)) {
                    e.push({
                        from: b.from,
                        to: a.from
                    });
                }
                if (l > 0 || (!h.inclusiveRight && !l)) {
                    e.push({
                        from: a.to,
                        to: b.to
                    });
                }
                c.splice.apply(c, e);
                d += e.length - 3;
            }
        }
        return c;
    }
    function b9(a) {
        var b = a.markedSpans;
        if (!b) {
            return;
        }
        for(var c = 0; c < b.length; ++c){
            b[c].marker.detachLine(a);
        }
        a.markedSpans = null;
    }
    function ca(c, a) {
        if (!a) {
            return;
        }
        for(var b = 0; b < a.length; ++b){
            a[b].marker.attachLine(c);
        }
        c.markedSpans = a;
    }
    function cb(a) {
        return a.inclusiveLeft ? -1 : 0;
    }
    function cc(a) {
        return a.inclusiveRight ? 1 : 0;
    }
    function cd(a, b) {
        var c = a.lines.length - b.lines.length;
        if (c != 0) {
            return c;
        }
        var d = a.find(), e = b.find();
        var f = bC(d.from, e.from) || cb(a) - cb(b);
        if (f) {
            return -f;
        }
        var g = bC(d.to, e.to) || cc(a) - cc(b);
        if (g) {
            return g;
        }
        return b.id - a.id;
    }
    function ce(e, f) {
        var c = bZ && e.markedSpans, b;
        if (c) {
            for(var a = void 0, d = 0; d < c.length; ++d){
                a = c[d];
                if (a.marker.collapsed && (f ? a.from : a.to) == null && (!b || cd(b, a.marker) < 0)) {
                    b = a.marker;
                }
            }
        }
        return b;
    }
    function cf(a) {
        return ce(a, true);
    }
    function cg(a) {
        return ce(a, false);
    }
    function ch(f, e) {
        var c = bZ && f.markedSpans, b;
        if (c) {
            for(var d = 0; d < c.length; ++d){
                var a = c[d];
                if (a.marker.collapsed && (a.from == null || a.from < e) && (a.to == null || a.to > e) && (!b || cd(b, a.marker) < 0)) {
                    b = a.marker;
                }
            }
        }
        return b;
    }
    function ci(j, k, e, f, c) {
        var l = bt(j, k);
        var g = bZ && l.markedSpans;
        if (g) {
            for(var h = 0; h < g.length; ++h){
                var a = g[h];
                if (!a.marker.collapsed) {
                    continue;
                }
                var b = a.marker.find(0);
                var d = bC(b.from, e) || cb(a.marker) - cb(c);
                var i = bC(b.to, f) || cc(a.marker) - cc(c);
                if ((d >= 0 && i <= 0) || (d <= 0 && i >= 0)) {
                    continue;
                }
                if ((d <= 0 && (a.marker.inclusiveRight && c.inclusiveLeft ? bC(b.to, e) >= 0 : bC(b.to, e) > 0)) || (d >= 0 && (a.marker.inclusiveRight && c.inclusiveLeft ? bC(b.from, f) <= 0 : bC(b.from, f) < 0))) {
                    return true;
                }
            }
        }
    }
    function cj(a) {
        var b;
        while((b = cf(a))){
            a = b.find(-1, true).line;
        }
        return a;
    }
    function ck(a) {
        var b;
        while((b = cg(a))){
            a = b.find(1, true).line;
        }
        return a;
    }
    function cl(a) {
        var c, b;
        while((c = cg(a))){
            a = c.find(1, true).line;
            (b || (b = [])).push(a);
        }
        return b;
    }
    function cm(d, a) {
        var b = bt(d, a), c = cj(b);
        if (b == c) {
            return a;
        }
        return bx(c);
    }
    function cn(c, a) {
        if (a > c.lastLine()) {
            return a;
        }
        var b = bt(c, a), d;
        if (!co(c, b)) {
            return a;
        }
        while((d = cg(b))){
            b = d.find(1, true).line;
        }
        return bx(b) + 1;
    }
    function co(e, d) {
        var b = bZ && d.markedSpans;
        if (b) {
            for(var a = void 0, c = 0; c < b.length; ++c){
                a = b[c];
                if (!a.marker.collapsed) {
                    continue;
                }
                if (a.from == null) {
                    return true;
                }
                if (a.marker.widgetNode) {
                    continue;
                }
                if (a.from == 0 && a.marker.inclusiveLeft && cp(e, d, a)) {
                    return true;
                }
            }
        }
    }
    function cp(e, c, a) {
        if (a.to == null) {
            var f = a.marker.find(1, true);
            return cp(e, f.line, b1(f.line.markedSpans, a.marker));
        }
        if (a.marker.inclusiveRight && a.to == c.text.length) {
            return true;
        }
        for(var b = void 0, d = 0; d < c.markedSpans.length; ++d){
            b = c.markedSpans[d];
            if (b.marker.collapsed && !b.marker.widgetNode && b.from == a.to && (b.to == null || b.to != a.from) && (b.marker.inclusiveLeft || a.marker.inclusiveRight) && cp(e, c, b)) {
                return true;
            }
        }
    }
    function cq(c) {
        c = cj(c);
        var d = 0, a = c.parent;
        for(var e = 0; e < a.lines.length; ++e){
            var g = a.lines[e];
            if (g == c) {
                break;
            } else {
                d += g.height;
            }
        }
        for(var b = a.parent; b; a = b, b = a.parent){
            for(var f = 0; f < b.children.length; ++f){
                var h = b.children[f];
                if (h == a) {
                    break;
                } else {
                    d += h.height;
                }
            }
        }
        return d;
    }
    function cr(b) {
        if (b.height == 0) {
            return 0;
        }
        var c = b.text.length, d, a = b;
        while((d = cf(a))){
            var e = d.find(0, true);
            a = e.from.line;
            c += e.from.ch - e.to.ch;
        }
        a = b;
        while((d = cg(a))){
            var f = d.find(0, true);
            c -= a.text.length - f.from.ch;
            a = f.to.line;
            c += a.text.length - f.to.ch;
        }
        return c;
    }
    function cs(c) {
        var a = c.display, b = c.doc;
        a.maxLine = bt(b, b.first);
        a.maxLineLength = cr(a.maxLine);
        a.maxLineChanged = true;
        b.iter(function(b) {
            var c = cr(b);
            if (c > a.maxLineLength) {
                a.maxLineLength = c;
                a.maxLine = b;
            }
        });
    }
    var M = function(b, c, a) {
        this.text = b;
        ca(this, c);
        this.height = a ? a(this) : 1;
    };
    M.prototype.lineNo = function() {
        return bx(this);
    };
    l(M);
    function ct(a, d, e, b) {
        a.text = d;
        if (a.stateAfter) {
            a.stateAfter = null;
        }
        if (a.styles) {
            a.styles = null;
        }
        if (a.order != null) {
            a.order = null;
        }
        b9(a);
        ca(a, e);
        var c = b ? b(a) : 1;
        if (c != a.height) {
            bw(a, c);
        }
    }
    function cu(a) {
        a.parent = null;
        b9(a);
    }
    var cv = {}, cw = {};
    function cx(a, c) {
        if (!a || /^\s*$/.test(a)) {
            return null;
        }
        var b = c.addModeClass ? cw : cv;
        return b[a] || (b[a] = a.replace(/\S+/g, "cm-$&"));
    }
    function cy(c, b) {
        var g = aq("span", null, null, H ? "padding-right: .1px" : null);
        var a = {
            pre: aq("pre", [
                g
            ], "CodeMirror-line"),
            content: g,
            col: 0,
            pos: 0,
            cm: c,
            trailingSpace: false,
            splitSpaces: c.getOption("lineWrapping")
        };
        b.measure = {};
        for(var e = 0; e <= (b.rest ? b.rest.length : 0); e++){
            var d = e ? b.rest[e - 1] : b.line, h = void 0;
            a.pos = 0;
            a.addToken = cA;
            if (bd(c.display.measure) && (h = aW(d, c.doc.direction))) {
                a.addToken = cC(a.addToken, h);
            }
            a.map = [];
            var i = b != c.display.externalMeasured && bx(d);
            cE(d, a, bN(c, d, i));
            if (d.styleClasses) {
                if (d.styleClasses.bgClass) {
                    a.bgClass = au(d.styleClasses.bgClass, a.bgClass || "");
                }
                if (d.styleClasses.textClass) {
                    a.textClass = au(d.styleClasses.textClass, a.textClass || "");
                }
            }
            if (a.map.length == 0) {
                a.map.push(0, 0, a.content.appendChild(bb(c.display.measure)));
            }
            if (e == 0) {
                b.measure.map = a.map;
                b.measure.cache = {};
            } else {
                (b.measure.maps || (b.measure.maps = [])).push(a.map);
                (b.measure.caches || (b.measure.caches = [])).push({});
            }
        }
        if (H) {
            var f = a.content.lastChild;
            if (/\bcm-tab\b/.test(f.className) || (f.querySelector && f.querySelector(".cm-tab"))) {
                a.content.className = "cm-tab-wrap-hack";
            }
        }
        a_(c, "renderLine", c, b.line, a.pre);
        if (a.pre.className) {
            a.textClass = au(a.pre.className, a.textClass || "");
        }
        return a;
    }
    function cz(b) {
        var a = ap("span", "\u2022", "cm-invalidchar");
        a.title = "\\u" + b.charCodeAt(0).toString(16);
        a.setAttribute("aria-label", a.title);
        return a;
    }
    function cA(a, c, p, j, k, q, h) {
        if (!c) {
            return;
        }
        var l = a.splitSpaces ? cB(c, a.trailingSpace) : c;
        var m = a.cm.state.specialChars, r = false;
        var b;
        if (!m.test(c)) {
            a.col += c.length;
            b = document.createTextNode(l);
            a.map.push(a.pos, a.pos + c.length, b);
            if (t && P < 9) {
                r = true;
            }
            a.pos += c.length;
        } else {
            b = document.createDocumentFragment();
            var f = 0;
            while(true){
                m.lastIndex = f;
                var d = m.exec(c);
                var g = d ? d.index - f : c.length - f;
                if (g) {
                    var n = document.createTextNode(l.slice(f, f + g));
                    if (t && P < 9) {
                        b.appendChild(ap("span", [
                            n
                        ]));
                    } else {
                        b.appendChild(n);
                    }
                    a.map.push(a.pos, a.pos + g, n);
                    a.col += g;
                    a.pos += g;
                }
                if (!d) {
                    break;
                }
                f += g + 1;
                var e = void 0;
                if (d[0] == "\t") {
                    var s = a.cm.options.tabSize, u = s - (a.col % s);
                    e = b.appendChild(ap("span", aF(u), "cm-tab"));
                    e.setAttribute("role", "presentation");
                    e.setAttribute("cm-text", "\t");
                    a.col += u;
                } else if (d[0] == "\r" || d[0] == "\n") {
                    e = b.appendChild(ap("span", d[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                    e.setAttribute("cm-text", d[0]);
                    a.col += 1;
                } else {
                    e = a.cm.options.specialCharPlaceholder(d[0]);
                    e.setAttribute("cm-text", d[0]);
                    if (t && P < 9) {
                        b.appendChild(ap("span", [
                            e
                        ]));
                    } else {
                        b.appendChild(e);
                    }
                    a.col += 1;
                }
                a.map.push(a.pos, a.pos + 1, e);
                a.pos++;
            }
        }
        a.trailingSpace = l.charCodeAt(c.length - 1) == 32;
        if (p || j || k || r || q || h) {
            var o = p || "";
            if (j) {
                o += j;
            }
            if (k) {
                o += k;
            }
            var v = ap("span", [
                b
            ], o, q);
            if (h) {
                for(var i in h){
                    if (h.hasOwnProperty(i) && i != "style" && i != "class") {
                        v.setAttribute(i, h[i]);
                    }
                }
            }
            return a.content.appendChild(v);
        }
        a.content.appendChild(b);
    }
    function cB(a, f) {
        if (a.length > 1 && !/  /.test(a)) {
            return a;
        }
        var d = f, e = "";
        for(var b = 0; b < a.length; b++){
            var c = a.charAt(b);
            if (c == " " && d && (b == a.length - 1 || a.charCodeAt(b + 1) == 32)) {
                c = "\u00a0";
            }
            e += c;
            d = c == " ";
        }
        return e;
    }
    function cC(a, b) {
        return function(g, e, f, h, l, j, k) {
            f = f ? f + " cm-force-border" : "cm-force-border";
            var d = g.pos, m = d + e.length;
            for(;;){
                var c = void 0;
                for(var i = 0; i < b.length; i++){
                    c = b[i];
                    if (c.to > d && c.from <= d) {
                        break;
                    }
                }
                if (c.to >= m) {
                    return a(g, e, f, h, l, j, k);
                }
                a(g, e.slice(0, c.to - d), f, h, null, j, k);
                h = null;
                e = e.slice(c.to - d);
                d = c.to;
            }
        };
    }
    function cD(a, c, d, e) {
        var b = !e && d.widgetNode;
        if (b) {
            a.map.push(a.pos, a.pos + c, b);
        }
        if (!e && a.cm.display.input.needsContentAttribute) {
            if (!b) {
                b = a.content.appendChild(document.createElement("span"));
            }
            b.setAttribute("cm-marker", d.id);
        }
        if (b) {
            a.cm.display.input.setUneditable(b);
            a.content.appendChild(b);
        }
        a.pos += c;
        a.trailingSpace = false;
    }
    function cE(A, f, j) {
        var s = A.markedSpans, t = A.text, m = 0;
        if (!s) {
            for(var n = 1; n < j.length; n += 2){
                f.addToken(f, t.slice(m, (m = j[n])), cx(j[n + 1], f.cm.options));
            }
            return;
        }
        var u = t.length, a = 0, B = 1, g = "", v, k;
        var e = 0, o, p, q, d, h;
        for(;;){
            if (e == a) {
                o = p = q = k = "";
                h = null;
                d = null;
                e = Infinity;
                var w = [], i = void 0;
                for(var x = 0; x < s.length; ++x){
                    var c = s[x], b = c.marker;
                    if (b.type == "bookmark" && c.from == a && b.widgetNode) {
                        w.push(b);
                    } else if (c.from <= a && (c.to == null || c.to > a || (b.collapsed && c.to == a && c.from == a))) {
                        if (c.to != null && c.to != a && e > c.to) {
                            e = c.to;
                            p = "";
                        }
                        if (b.className) {
                            o += " " + b.className;
                        }
                        if (b.css) {
                            k = (k ? k + ";" : "") + b.css;
                        }
                        if (b.startStyle && c.from == a) {
                            q += " " + b.startStyle;
                        }
                        if (b.endStyle && c.to == e) {
                            (i || (i = [])).push(b.endStyle, c.to);
                        }
                        if (b.title) {
                            (h || (h = {})).title = b.title;
                        }
                        if (b.attributes) {
                            for(var C in b.attributes){
                                (h || (h = {}))[C] = b.attributes[C];
                            }
                        }
                        if (b.collapsed && (!d || cd(d.marker, b) < 0)) {
                            d = c;
                        }
                    } else if (c.from > a && e > c.from) {
                        e = c.from;
                    }
                }
                if (i) {
                    for(var r = 0; r < i.length; r += 2){
                        if (i[r + 1] == e) {
                            p += " " + i[r];
                        }
                    }
                }
                if (!d || d.from == a) {
                    for(var y = 0; y < w.length; ++y){
                        cD(f, 0, w[y]);
                    }
                }
                if (d && (d.from || 0) == a) {
                    cD(f, (d.to == null ? u + 1 : d.to) - a, d.marker, d.from == null);
                    if (d.to == null) {
                        return;
                    }
                    if (d.to == a) {
                        d = false;
                    }
                }
            }
            if (a >= u) {
                break;
            }
            var l = Math.min(u, e);
            while(true){
                if (g) {
                    var z = a + g.length;
                    if (!d) {
                        var D = z > l ? g.slice(0, l - a) : g;
                        f.addToken(f, D, v ? v + o : o, q, a + D.length == e ? p : "", k, h);
                    }
                    if (z >= l) {
                        g = g.slice(l - a);
                        a = l;
                        break;
                    }
                    a = z;
                    q = "";
                }
                g = t.slice(m, (m = j[B++]));
                v = cx(j[B++], f.cm.options);
            }
        }
    }
    function cF(b, a, c) {
        this.line = a;
        this.rest = cl(a);
        this.size = this.rest ? bx(aG(this.rest)) - c + 1 : 1;
        this.node = this.text = null;
        this.hidden = co(b, a);
    }
    function cG(b, f, g) {
        var c = [], d;
        for(var a = f; a < g; a = d){
            var e = new cF(b.doc, bt(b.doc, a), a);
            d = a + e.size;
            c.push(e);
        }
        return c;
    }
    var cH = null;
    function cI(a) {
        if (cH) {
            cH.ops.push(a);
        } else {
            a.ownsGroup = cH = {
                ops: [
                    a
                ],
                delayedCallbacks: []
            };
        }
    }
    function cJ(c) {
        var d = c.delayedCallbacks, b = 0;
        do {
            for(; b < d.length; b++){
                d[b].call(null);
            }
            for(var e = 0; e < c.ops.length; e++){
                var a = c.ops[e];
                if (a.cursorActivityHandlers) {
                    while(a.cursorActivityCalled < a.cursorActivityHandlers.length){
                        a.cursorActivityHandlers[a.cursorActivityCalled++].call(null, a.cm);
                    }
                }
            }
        }while (b < d.length)
    }
    function cK(b, c) {
        var a = b.ownsGroup;
        if (!a) {
            return;
        }
        try {
            cJ(a);
        } finally{
            cH = null;
            c(a);
        }
    }
    var cL = null;
    function cM(d, e) {
        var c = aZ(d, e);
        if (!c.length) {
            return;
        }
        var g = Array.prototype.slice.call(arguments, 2), a;
        if (cH) {
            a = cH.delayedCallbacks;
        } else if (cL) {
            a = cL;
        } else {
            a = cL = [];
            setTimeout(cN, 0);
        }
        var f = function(b) {
            a.push(function() {
                return c[b].apply(null, g);
            });
        };
        for(var b = 0; b < c.length; ++b)f(b);
    }
    function cN() {
        var b = cL;
        cL = null;
        for(var a = 0; a < b.length; ++a){
            b[a]();
        }
    }
    function cO(b, a, f, e) {
        for(var d = 0; d < a.changes.length; d++){
            var c = a.changes[d];
            if (c == "text") {
                cS(b, a);
            } else if (c == "gutter") {
                cU(b, a, f, e);
            } else if (c == "class") {
                cT(b, a);
            } else if (c == "widget") {
                cV(b, a, e);
            }
        }
        a.changes = null;
    }
    function cP(a) {
        if (a.node == a.text) {
            a.node = ap("div", null, null, "position: relative");
            if (a.text.parentNode) {
                a.text.parentNode.replaceChild(a.node, a.text);
            }
            a.node.appendChild(a.text);
            if (t && P < 8) {
                a.node.style.zIndex = 2;
            }
        }
        return a.node;
    }
    function cQ(d, a) {
        var b = a.bgClass ? a.bgClass + " " + (a.line.bgClass || "") : a.line.bgClass;
        if (b) {
            b += " CodeMirror-linebackground";
        }
        if (a.background) {
            if (b) {
                a.background.className = b;
            } else {
                a.background.parentNode.removeChild(a.background);
                a.background = null;
            }
        } else if (b) {
            var c = cP(a);
            a.background = c.insertBefore(ap("div", null, b), c.firstChild);
            d.display.input.setUneditable(a.background);
        }
    }
    function cR(b, c) {
        var a = b.display.externalMeasured;
        if (a && a.line == c.line) {
            b.display.externalMeasured = null;
            c.measure = a.measure;
            return a.built;
        }
        return cy(b, c);
    }
    function cS(c, a) {
        var d = a.text.className;
        var b = cR(c, a);
        if (a.text == a.node) {
            a.node = b.pre;
        }
        a.text.parentNode.replaceChild(b.pre, a.text);
        a.text = b.pre;
        if (b.bgClass != a.bgClass || b.textClass != a.textClass) {
            a.bgClass = b.bgClass;
            a.textClass = b.textClass;
            cT(c, a);
        } else if (d) {
            a.text.className = d;
        }
    }
    function cT(b, a) {
        cQ(b, a);
        if (a.line.wrapClass) {
            cP(a).className = a.line.wrapClass;
        } else if (a.node != a.text) {
            a.node.className = "";
        }
        var c = a.textClass ? a.textClass + " " + (a.line.textClass || "") : a.line.textClass;
        a.text.className = c || "";
    }
    function cU(b, a, i, c) {
        if (a.gutter) {
            a.node.removeChild(a.gutter);
            a.gutter = null;
        }
        if (a.gutterBackground) {
            a.node.removeChild(a.gutterBackground);
            a.gutterBackground = null;
        }
        if (a.line.gutterClass) {
            var j = cP(a);
            a.gutterBackground = ap("div", null, "CodeMirror-gutter-background " + a.line.gutterClass, "left: " + (b.options.fixedGutter ? c.fixedPos : -c.gutterTotalWidth) + "px; width: " + c.gutterTotalWidth + "px");
            b.display.input.setUneditable(a.gutterBackground);
            j.insertBefore(a.gutterBackground, a.text);
        }
        var d = a.line.gutterMarkers;
        if (b.options.lineNumbers || d) {
            var k = cP(a);
            var e = (a.gutter = ap("div", null, "CodeMirror-gutter-wrapper", "left: " + (b.options.fixedGutter ? c.fixedPos : -c.gutterTotalWidth) + "px"));
            e.setAttribute("aria-hidden", "true");
            b.display.input.setUneditable(e);
            k.insertBefore(e, a.text);
            if (a.line.gutterClass) {
                e.className += " " + a.line.gutterClass;
            }
            if (b.options.lineNumbers && (!d || !d["CodeMirror-linenumbers"])) {
                a.lineNumber = e.appendChild(ap("div", bA(b.options, i), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + c.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + b.display.lineNumInnerWidth + "px"));
            }
            if (d) {
                for(var g = 0; g < b.display.gutterSpecs.length; ++g){
                    var f = b.display.gutterSpecs[g].className, h = d.hasOwnProperty(f) && d[f];
                    if (h) {
                        e.appendChild(ap("div", [
                            h
                        ], "CodeMirror-gutter-elt", "left: " + c.gutterLeft[f] + "px; width: " + c.gutterWidth[f] + "px"));
                    }
                }
            }
        }
    }
    function cV(d, a, e) {
        if (a.alignable) {
            a.alignable = null;
        }
        var f = al("CodeMirror-linewidget");
        for(var b = a.node.firstChild, c = void 0; b; b = c){
            c = b.nextSibling;
            if (f.test(b.className)) {
                a.node.removeChild(b);
            }
        }
        cX(d, a, e);
    }
    function cW(c, a, e, d) {
        var b = cR(c, a);
        a.text = a.node = b.pre;
        if (b.bgClass) {
            a.bgClass = b.bgClass;
        }
        if (b.textClass) {
            a.textClass = b.textClass;
        }
        cT(c, a);
        cU(c, a, e, d);
        cX(c, a, d);
        return a.node;
    }
    function cX(c, a, d) {
        cY(c, a.line, a, d, true);
        if (a.rest) {
            for(var b = 0; b < a.rest.length; b++){
                cY(c, a.rest[b], a, d, false);
            }
        }
    }
    function cY(h, e, c, i, j) {
        if (!e.widgets) {
            return;
        }
        var f = cP(c);
        for(var d = 0, g = e.widgets; d < g.length; ++d){
            var a = g[d], b = ap("div", [
                a.node
            ], "CodeMirror-linewidget" + (a.className ? " " + a.className : ""));
            if (!a.handleMouseEvents) {
                b.setAttribute("cm-ignore-events", "true");
            }
            cZ(a, b, c, i);
            h.display.input.setUneditable(b);
            if (j && a.above) {
                f.insertBefore(b, c.gutter || c.text);
            } else {
                f.appendChild(b);
            }
            cM(a, "redraw");
        }
    }
    function cZ(c, a, d, b) {
        if (c.noHScroll) {
            (d.alignable || (d.alignable = [])).push(a);
            var e = b.wrapperWidth;
            a.style.left = b.fixedPos + "px";
            if (!c.coverGutter) {
                e -= b.gutterTotalWidth;
                a.style.paddingLeft = b.gutterTotalWidth + "px";
            }
            a.style.width = e + "px";
        }
        if (c.coverGutter) {
            a.style.zIndex = 5;
            a.style.position = "relative";
            if (!c.noHScroll) {
                a.style.marginLeft = -b.gutterTotalWidth + "px";
            }
        }
    }
    function c$(a) {
        if (a.height != null) {
            return a.height;
        }
        var b = a.doc.cm;
        if (!b) {
            return 0;
        }
        if (!ar(document.body, a.node)) {
            var c = "position: relative;";
            if (a.coverGutter) {
                c += "margin-left: -" + b.display.gutters.offsetWidth + "px;";
            }
            if (a.noHScroll) {
                c += "width: " + b.display.wrapper.clientWidth + "px;";
            }
            ao(b.display.measure, ap("div", [
                a.node
            ], null, c));
        }
        return (a.height = a.node.parentNode.offsetHeight);
    }
    function c_(b, c) {
        for(var a = a7(c); a != b.wrapper; a = a.parentNode){
            if (!a || (a.nodeType == 1 && a.getAttribute("cm-ignore-events") == "true") || (a.parentNode == b.sizer && a != b.mover)) {
                return true;
            }
        }
    }
    function c0(a) {
        return a.lineSpace.offsetTop;
    }
    function c1(a) {
        return a.mover.offsetHeight - a.lineSpace.offsetHeight;
    }
    function c2(a) {
        if (a.cachedPaddingH) {
            return a.cachedPaddingH;
        }
        var c = ao(a.measure, ap("pre", "x", "CodeMirror-line-like"));
        var d = window.getComputedStyle ? window.getComputedStyle(c) : c.currentStyle;
        var b = {
            left: parseInt(d.paddingLeft),
            right: parseInt(d.paddingRight)
        };
        if (!isNaN(b.left) && !isNaN(b.right)) {
            a.cachedPaddingH = b;
        }
        return b;
    }
    function c3(a) {
        return ay - a.display.nativeBarWidth;
    }
    function c4(a) {
        return (a.display.scroller.clientWidth - c3(a) - a.display.barWidth);
    }
    function c5(a) {
        return (a.display.scroller.clientHeight - c3(a) - a.display.barHeight);
    }
    function c6(f, a, c) {
        var d = f.options.lineWrapping;
        var g = d && c4(f);
        if (!a.measure.heights || (d && a.measure.width != g)) {
            var h = (a.measure.heights = []);
            if (d) {
                a.measure.width = g;
                var e = a.text.firstChild.getClientRects();
                for(var b = 0; b < e.length - 1; b++){
                    var i = e[b], j = e[b + 1];
                    if (Math.abs(i.bottom - j.bottom) > 2) {
                        h.push((i.bottom + j.top) / 2 - c.top);
                    }
                }
            }
            h.push(c.bottom - c.top);
        }
    }
    function c7(a, d, e) {
        if (a.line == d) {
            return {
                map: a.measure.map,
                cache: a.measure.cache
            };
        }
        if (a.rest) {
            for(var b = 0; b < a.rest.length; b++){
                if (a.rest[b] == d) {
                    return {
                        map: a.measure.maps[b],
                        cache: a.measure.caches[b]
                    };
                }
            }
            for(var c = 0; c < a.rest.length; c++){
                if (bx(a.rest[c]) > e) {
                    return {
                        map: a.measure.maps[c],
                        cache: a.measure.caches[c],
                        before: true
                    };
                }
            }
        }
    }
    function c8(b, c) {
        c = cj(c);
        var d = bx(c);
        var a = (b.display.externalMeasured = new cF(b.doc, c, d));
        a.lineN = d;
        var e = (a.built = cy(b, a));
        a.text = e.pre;
        ao(b.display.lineMeasure, e.pre);
        return a;
    }
    function c9(a, b, c, d) {
        return dc(a, db(a, b), c, d);
    }
    function da(a, b) {
        if (b >= a.display.viewFrom && b < a.display.viewTo) {
            return a.display.view[dK(a, b)];
        }
        var c = a.display.externalMeasured;
        if (c && b >= c.lineN && b < c.lineN + c.size) {
            return c;
        }
    }
    function db(b, c) {
        var d = bx(c);
        var a = da(b, d);
        if (a && !a.text) {
            a = null;
        } else if (a && a.changes) {
            cO(b, a, d, dF(b));
            b.curOp.forceUpdate = true;
        }
        if (!a) {
            a = c8(b, c);
        }
        var e = c7(a, c, d);
        return {
            line: c,
            view: a,
            rect: null,
            map: e.map,
            cache: e.cache,
            before: e.before,
            hasHeights: false
        };
    }
    function dc(e, a, c, f, g) {
        if (a.before) {
            c = -1;
        }
        var d = c + (f || ""), b;
        if (a.cache.hasOwnProperty(d)) {
            b = a.cache[d];
        } else {
            if (!a.rect) {
                a.rect = a.view.text.getBoundingClientRect();
            }
            if (!a.hasHeights) {
                c6(e, a.view, a.rect);
                a.hasHeights = true;
            }
            b = dg(e, a, c, f);
            if (!b.bogus) {
                a.cache[d] = b;
            }
        }
        return {
            left: b.left,
            right: b.right,
            top: g ? b.rtop : b.top,
            bottom: g ? b.rbottom : b.bottom
        };
    }
    var dd = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function de(b, f, j) {
        var h, c, i, g, e, d;
        for(var a = 0; a < b.length; a += 3){
            e = b[a];
            d = b[a + 1];
            if (f < e) {
                c = 0;
                i = 1;
                g = "left";
            } else if (f < d) {
                c = f - e;
                i = c + 1;
            } else if (a == b.length - 3 || (f == d && b[a + 3] > f)) {
                i = d - e;
                c = i - 1;
                if (f >= d) {
                    g = "right";
                }
            }
            if (c != null) {
                h = b[a + 2];
                if (e == d && j == (h.insertLeft ? "left" : "right")) {
                    g = j;
                }
                if (j == "left" && c == 0) {
                    while(a && b[a - 2] == b[a - 3] && b[a - 1].insertLeft){
                        h = b[(a -= 3) + 2];
                        g = "left";
                    }
                }
                if (j == "right" && c == d - e) {
                    while(a < b.length - 3 && b[a + 3] == b[a + 4] && !b[a + 5].insertLeft){
                        h = b[(a += 3) + 2];
                        g = "right";
                    }
                }
                break;
            }
        }
        return {
            node: h,
            start: c,
            end: i,
            collapse: g,
            coverStart: e,
            coverEnd: d
        };
    }
    function df(b, e) {
        var a = dd;
        if (e == "left") {
            for(var c = 0; c < b.length; c++){
                if ((a = b[c]).left != a.right) {
                    break;
                }
            }
        } else {
            for(var d = b.length - 1; d >= 0; d--){
                if ((a = b[d]).left != a.right) {
                    break;
                }
            }
        }
        return a;
    }
    function dg(i, d, r, j) {
        var c = de(d.map, r, j);
        var e = c.node, b = c.start, f = c.end, k = c.collapse;
        var a;
        if (e.nodeType == 3) {
            for(var o = 0; o < 4; o++){
                while(b && aP(d.line.text.charAt(c.coverStart + b))){
                    --b;
                }
                while(c.coverStart + f < c.coverEnd && aP(d.line.text.charAt(c.coverStart + f))){
                    ++f;
                }
                if (t && P < 9 && b == 0 && f == c.coverEnd - c.coverStart) {
                    a = e.parentNode.getBoundingClientRect();
                } else {
                    a = df(K(e, b, f).getClientRects(), j);
                }
                if (a.left || a.right || b == 0) {
                    break;
                }
                f = b;
                b = b - 1;
                k = "right";
            }
            if (t && P < 11) {
                a = dh(i.display.measure, a);
            }
        } else {
            if (b > 0) {
                k = j = "right";
            }
            var n;
            if (i.options.lineWrapping && (n = e.getClientRects()).length > 1) {
                a = n[j == "right" ? n.length - 1 : 0];
            } else {
                a = e.getBoundingClientRect();
            }
        }
        if (t && P < 9 && !b && (!a || (!a.left && !a.right))) {
            var h = e.parentNode.getClientRects()[0];
            if (h) {
                a = {
                    left: h.left,
                    right: h.left + dE(i.display),
                    top: h.top,
                    bottom: h.bottom
                };
            } else {
                a = dd;
            }
        }
        var p = a.top - d.rect.top, q = a.bottom - d.rect.top;
        var s = (p + q) / 2;
        var l = d.view.measure.heights;
        var g = 0;
        for(; g < l.length - 1; g++){
            if (s < l[g]) {
                break;
            }
        }
        var u = g ? l[g - 1] : 0, v = l[g];
        var m = {
            left: (k == "right" ? a.right : a.left) - d.rect.left,
            right: (k == "left" ? a.left : a.right) - d.rect.left,
            top: u,
            bottom: v
        };
        if (!a.left && !a.right) {
            m.bogus = true;
        }
        if (!i.options.singleCursorHeightPerLine) {
            m.rtop = p;
            m.rbottom = q;
        }
        return m;
    }
    function dh(d, a) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !bi(d)) {
            return a;
        }
        var b = screen.logicalXDPI / screen.deviceXDPI;
        var c = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: a.left * b,
            right: a.right * b,
            top: a.top * c,
            bottom: a.bottom * c
        };
    }
    function di(a) {
        if (a.measure) {
            a.measure.cache = {};
            a.measure.heights = null;
            if (a.rest) {
                for(var b = 0; b < a.rest.length; b++){
                    a.measure.caches[b] = {};
                }
            }
        }
    }
    function dj(a) {
        a.display.externalMeasure = null;
        an(a.display.lineMeasure);
        for(var b = 0; b < a.display.view.length; b++){
            di(a.display.view[b]);
        }
    }
    function dk(a) {
        dj(a);
        a.display.cachedCharWidth = a.display.cachedTextHeight = a.display.cachedPaddingH = null;
        if (!a.options.lineWrapping) {
            a.display.maxLineChanged = true;
        }
        a.display.lineNumChars = null;
    }
    function dl() {
        if (R && S) {
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        }
        return (window.pageXOffset || (document.documentElement || document.body).scrollLeft);
    }
    function dm() {
        if (R && S) {
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        }
        return (window.pageYOffset || (document.documentElement || document.body).scrollTop);
    }
    function dn(d) {
        var e = cj(d);
        var a = e.widgets;
        var c = 0;
        if (a) {
            for(var b = 0; b < a.length; ++b){
                if (a[b].above) {
                    c += c$(a[b]);
                }
            }
        }
        return c;
    }
    function dp(d, e, a, b, i) {
        if (!i) {
            var f = dn(e);
            a.top += f;
            a.bottom += f;
        }
        if (b == "line") {
            return a;
        }
        if (!b) {
            b = "local";
        }
        var c = cq(e);
        if (b == "local") {
            c += c0(d.display);
        } else {
            c -= d.display.viewOffset;
        }
        if (b == "page" || b == "window") {
            var g = d.display.lineSpace.getBoundingClientRect();
            c += g.top + (b == "window" ? 0 : dm());
            var h = g.left + (b == "window" ? 0 : dl());
            a.left += h;
            a.right += h;
        }
        a.top += c;
        a.bottom += c;
        return a;
    }
    function dq(e, b, a) {
        if (a == "div") {
            return b;
        }
        var c = b.left, d = b.top;
        if (a == "page") {
            c -= dl();
            d -= dm();
        } else if (a == "local" || !a) {
            var f = e.display.sizer.getBoundingClientRect();
            c += f.left;
            d += f.top;
        }
        var g = e.display.lineSpace.getBoundingClientRect();
        return {
            left: c - g.left,
            top: d - g.top
        };
    }
    function dr(b, c, d, a, e) {
        if (!a) {
            a = bt(b.doc, c.line);
        }
        return dp(b, a, c9(b, a, c.ch, e), d);
    }
    function ds(d, e, m, c, f, n) {
        c = c || bt(d.doc, e.line);
        if (!f) {
            f = db(d, c);
        }
        function k(e, b) {
            var a = dc(d, f, e, b ? "right" : "left", n);
            if (b) {
                a.left = a.right;
            } else {
                a.right = a.left;
            }
            return dp(d, c, a, m);
        }
        var g = aW(c, d.doc.direction), a = e.ch, b = e.sticky;
        if (a >= c.text.length) {
            a = c.text.length;
            b = "before";
        } else if (a <= 0) {
            a = 0;
            b = "after";
        }
        if (!g) {
            return k(b == "before" ? a - 1 : a, b == "before");
        }
        function h(a, c, b) {
            var d = g[c], e = d.level == 1;
            return k(b ? a - 1 : a, e != b);
        }
        var l = aU(g, a, b);
        var i = aT;
        var j = h(a, l, b == "before");
        if (i != null) {
            j.other = h(a, i, b != "before");
        }
        return j;
    }
    function dt(a, b) {
        var c = 0;
        b = bI(a.doc, b);
        if (!a.options.lineWrapping) {
            c = dE(a.display) * b.ch;
        }
        var d = bt(a.doc, b.line);
        var e = cq(d) + c0(a.display);
        return {
            left: c,
            right: c,
            top: e,
            bottom: e + d.height
        };
    }
    function du(c, d, e, b, f) {
        var a = bB(c, d, e);
        a.xRel = f;
        if (b) {
            a.outside = b;
        }
        return a;
    }
    function dv(e, f, c) {
        var a = e.doc;
        c += e.display.viewOffset;
        if (c < 0) {
            return du(a.first, 0, null, -1, -1);
        }
        var b = by(a, c), i = a.first + a.size - 1;
        if (b > i) {
            return du(a.first + a.size - 1, bt(a, i).text.length, null, 1, 1);
        }
        if (f < 0) {
            f = 0;
        }
        var g = bt(a, b);
        for(;;){
            var d = dz(e, g, b, f, c);
            var j = ch(g, d.ch + (d.xRel > 0 || d.outside > 0 ? 1 : 0));
            if (!j) {
                return d;
            }
            var h = j.find(1);
            if (h.line == b) {
                return h;
            }
            g = bt(a, (b = h.line));
        }
    }
    function dw(e, b, f, d) {
        d -= dn(b);
        var a = b.text.length;
        var c = aR(function(a) {
            return (dc(e, f, a - 1).bottom <= d);
        }, a, 0);
        a = aR(function(a) {
            return dc(e, f, a).top > d;
        }, c, a);
        return {
            begin: c,
            end: a
        };
    }
    function dx(a, c, b, d) {
        if (!b) {
            b = db(a, c);
        }
        var e = dp(a, c, dc(a, b, d), "line").top;
        return dw(a, c, b, e);
    }
    function dy(a, c, b, d) {
        return a.bottom <= b ? false : a.top > b ? true : (d ? a.left : a.right) > c;
    }
    function dz(d, b, j, h, e) {
        e -= cq(b);
        var k = db(d, b);
        var t = dn(b);
        var l = 0, m = b.text.length, c = true;
        var p = aW(b, d.doc.direction);
        if (p) {
            var f = (d.options.lineWrapping ? dB : dA)(d, b, j, k, p, h, e);
            c = f.level != 1;
            l = c ? f.from : f.to - 1;
            m = c ? f.to : f.from - 1;
        }
        var u = null, g = null;
        var a = aR(function(b) {
            var a = dc(d, k, b);
            a.top += t;
            a.bottom += t;
            if (!dy(a, h, e, false)) {
                return false;
            }
            if (a.top <= e && a.left <= h) {
                u = b;
                g = a;
            }
            return true;
        }, l, m);
        var n, i, q = false;
        if (g) {
            var r = h - g.left < g.right - h, s = r == c;
            a = u + (s ? 0 : 1);
            i = s ? "after" : "before";
            n = r ? g.left : g.right;
        } else {
            if (!c && (a == m || a == l)) {
                a++;
            }
            i = a == 0 ? "after" : a == b.text.length ? "before" : dc(d, k, a - (c ? 1 : 0)).bottom + t <= e == c ? "after" : "before";
            var o = ds(d, bB(j, a, i), "line", b, k);
            n = o.left;
            q = e < o.top ? -1 : e >= o.bottom ? 1 : 0;
        }
        a = aQ(b.text, a, 1);
        return du(j, a, i, q, h - n);
    }
    function dA(g, h, i, j, b, k, d) {
        var c = aR(function(e) {
            var a = b[e], c = a.level != 1;
            return dy(ds(g, bB(i, c ? a.to : a.from, c ? "before" : "after"), "line", h, j), k, d, true);
        }, 0, b.length - 1);
        var a = b[c];
        if (c > 0) {
            var e = a.level != 1;
            var f = ds(g, bB(i, e ? a.from : a.to, e ? "after" : "before"), "line", h, j);
            if (dy(f, k, d, true) && f.top > d) {
                a = b[c - 1];
            }
        }
        return a;
    }
    function dB(i, j, q, k, d, f, o) {
        var l = dw(i, j, k, o);
        var e = l.begin;
        var b = l.end;
        if (/\s/.test(j.text.charAt(b - 1))) {
            b--;
        }
        var a = null, m = null;
        for(var g = 0; g < d.length; g++){
            var c = d[g];
            if (c.from >= b || c.to <= e) {
                continue;
            }
            var p = c.level != 1;
            var h = dc(i, k, p ? Math.min(b, c.to) - 1 : Math.max(e, c.from)).right;
            var n = h < f ? f - h + 1e9 : h - f;
            if (!a || m > n) {
                a = c;
                m = n;
            }
        }
        if (!a) {
            a = d[d.length - 1];
        }
        if (a.from < e) {
            a = {
                from: e,
                to: a.to,
                level: a.level
            };
        }
        if (a.to > b) {
            a = {
                from: a.from,
                to: b,
                level: a.level
            };
        }
        return a;
    }
    var dC;
    function dD(a) {
        if (a.cachedTextHeight != null) {
            return a.cachedTextHeight;
        }
        if (dC == null) {
            dC = ap("pre", null, "CodeMirror-line-like");
            for(var c = 0; c < 49; ++c){
                dC.appendChild(document.createTextNode("x"));
                dC.appendChild(ap("br"));
            }
            dC.appendChild(document.createTextNode("x"));
        }
        ao(a.measure, dC);
        var b = dC.offsetHeight / 50;
        if (b > 3) {
            a.cachedTextHeight = b;
        }
        an(a.measure);
        return b || 1;
    }
    function dE(a) {
        if (a.cachedCharWidth != null) {
            return a.cachedCharWidth;
        }
        var c = ap("span", "xxxxxxxxxx");
        var e = ap("pre", [
            c
        ], "CodeMirror-line-like");
        ao(a.measure, e);
        var d = c.getBoundingClientRect(), b = (d.right - d.left) / 10;
        if (b > 2) {
            a.cachedCharWidth = b;
        }
        return b || 10;
    }
    function dF(c) {
        var b = c.display, d = {}, e = {};
        var h = b.gutters.clientLeft;
        for(var a = b.gutters.firstChild, f = 0; a; a = a.nextSibling, ++f){
            var g = c.display.gutterSpecs[f].className;
            d[g] = a.offsetLeft + a.clientLeft + h;
            e[g] = a.clientWidth;
        }
        return {
            fixedPos: dG(b),
            gutterTotalWidth: b.gutters.offsetWidth,
            gutterLeft: d,
            gutterWidth: e,
            wrapperWidth: b.wrapper.clientWidth
        };
    }
    function dG(a) {
        return (a.scroller.getBoundingClientRect().left - a.sizer.getBoundingClientRect().left);
    }
    function dH(a) {
        var c = dD(a.display), b = a.options.lineWrapping;
        var d = b && Math.max(5, a.display.scroller.clientWidth / dE(a.display) - 3);
        return function(e) {
            if (co(a.doc, e)) {
                return 0;
            }
            var g = 0;
            if (e.widgets) {
                for(var f = 0; f < e.widgets.length; f++){
                    if (e.widgets[f].height) {
                        g += e.widgets[f].height;
                    }
                }
            }
            if (b) {
                return (g + (Math.ceil(e.text.length / d) || 1) * c);
            } else {
                return g + c;
            }
        };
    }
    function dI(a) {
        var b = a.doc, c = dH(a);
        b.iter(function(a) {
            var b = c(a);
            if (b != a.height) {
                bw(a, b);
            }
        });
    }
    function dJ(a, d, h, i) {
        var j = a.display;
        if (!h && a7(d).getAttribute("cm-not-content") == "true") {
            return null;
        }
        var e, f, g = j.lineSpace.getBoundingClientRect();
        try {
            e = d.clientX - g.left;
            f = d.clientY - g.top;
        } catch (l) {
            return null;
        }
        var b = dv(a, e, f), c;
        if (i && b.xRel > 0 && (c = bt(a.doc, b.line).text).length == b.ch) {
            var k = ax(c, c.length, a.options.tabSize) - c.length;
            b = bB(b.line, Math.max(0, Math.round((e - c2(a.display).left) / dE(a.display)) - k));
        }
        return b;
    }
    function dK(c, a) {
        if (a >= c.display.viewTo) {
            return null;
        }
        a -= c.display.viewFrom;
        if (a < 0) {
            return null;
        }
        var d = c.display.view;
        for(var b = 0; b < d.length; b++){
            a -= d[b].size;
            if (a < 0) {
                return b;
            }
        }
    }
    function dL(b, c, d, e) {
        if (c == null) {
            c = b.doc.first;
        }
        if (d == null) {
            d = b.doc.first + b.doc.size;
        }
        if (!e) {
            e = 0;
        }
        var a = b.display;
        if (e && d < a.viewTo && (a.updateLineNumbers == null || a.updateLineNumbers > c)) {
            a.updateLineNumbers = c;
        }
        b.curOp.viewChanged = true;
        if (c >= a.viewTo) {
            if (bZ && cm(b.doc, c) < a.viewTo) {
                dN(b);
            }
        } else if (d <= a.viewFrom) {
            if (bZ && cn(b.doc, d + e) > a.viewFrom) {
                dN(b);
            } else {
                a.viewFrom += e;
                a.viewTo += e;
            }
        } else if (c <= a.viewFrom && d >= a.viewTo) {
            dN(b);
        } else if (c <= a.viewFrom) {
            var g = dO(b, d, d + e, 1);
            if (g) {
                a.view = a.view.slice(g.index);
                a.viewFrom = g.lineN;
                a.viewTo += e;
            } else {
                dN(b);
            }
        } else if (d >= a.viewTo) {
            var h = dO(b, c, c, -1);
            if (h) {
                a.view = a.view.slice(0, h.index);
                a.viewTo = h.lineN;
            } else {
                dN(b);
            }
        } else {
            var i = dO(b, c, c, -1);
            var j = dO(b, d, d + e, 1);
            if (i && j) {
                a.view = a.view.slice(0, i.index).concat(cG(b, i.lineN, j.lineN)).concat(a.view.slice(j.index));
                a.viewTo += e;
            } else {
                dN(b);
            }
        }
        var f = a.externalMeasured;
        if (f) {
            if (d < f.lineN) {
                f.lineN += e;
            } else if (c < f.lineN + f.size) {
                a.externalMeasured = null;
            }
        }
    }
    function dM(b, a, f) {
        b.curOp.viewChanged = true;
        var c = b.display, d = b.display.externalMeasured;
        if (d && a >= d.lineN && a < d.lineN + d.size) {
            c.externalMeasured = null;
        }
        if (a < c.viewFrom || a >= c.viewTo) {
            return;
        }
        var e = c.view[dK(b, a)];
        if (e.node == null) {
            return;
        }
        var g = e.changes || (e.changes = []);
        if (T(g, f) == -1) {
            g.push(f);
        }
    }
    function dN(a) {
        a.display.viewFrom = a.display.viewTo = a.doc.first;
        a.display.view = [];
        a.display.viewOffset = 0;
    }
    function dO(c, d, b, e) {
        var a = dK(c, d), g, f = c.display.view;
        if (!bZ || b == c.doc.first + c.doc.size) {
            return {
                index: a,
                lineN: b
            };
        }
        var h = c.display.viewFrom;
        for(var i = 0; i < a; i++){
            h += f[i].size;
        }
        if (h != d) {
            if (e > 0) {
                if (a == f.length - 1) {
                    return null;
                }
                g = h + f[a].size - d;
                a++;
            } else {
                g = h - d;
            }
            d += g;
            b += g;
        }
        while(cm(c.doc, b) != b){
            if (a == (e < 0 ? 0 : f.length - 1)) {
                return null;
            }
            b += e * f[a - (e < 0 ? 1 : 0)].size;
            a += e;
        }
        return {
            index: a,
            lineN: b
        };
    }
    function dP(d, b, c) {
        var a = d.display, e = a.view;
        if (e.length == 0 || b >= a.viewTo || c <= a.viewFrom) {
            a.view = cG(d, b, c);
            a.viewFrom = b;
        } else {
            if (a.viewFrom > b) {
                a.view = cG(d, b, a.viewFrom).concat(a.view);
            } else if (a.viewFrom < b) {
                a.view = a.view.slice(dK(d, b));
            }
            a.viewFrom = b;
            if (a.viewTo < c) {
                a.view = a.view.concat(cG(d, a.viewTo, c));
            } else if (a.viewTo > c) {
                a.view = a.view.slice(0, dK(d, c));
            }
        }
        a.viewTo = c;
    }
    function dQ(e) {
        var c = e.display.view, d = 0;
        for(var a = 0; a < c.length; a++){
            var b = c[a];
            if (!b.hidden && (!b.node || b.changes)) {
                ++d;
            }
        }
        return d;
    }
    function dR(a) {
        a.display.input.showSelection(a.display.input.prepareSelection());
    }
    function dS(a, c) {
        if (c === void 0) c = true;
        var e = a.doc, f = {};
        var h = (f.cursors = document.createDocumentFragment());
        var k = (f.selection = document.createDocumentFragment());
        var g = a.options.$customCursor;
        if (g) {
            c = true;
        }
        for(var d = 0; d < e.sel.ranges.length; d++){
            if (!c && d == e.sel.primIndex) {
                continue;
            }
            var b = e.sel.ranges[d];
            if (b.from().line >= a.display.viewTo || b.to().line < a.display.viewFrom) {
                continue;
            }
            var i = b.empty();
            if (g) {
                var j = g(a, b);
                if (j) {
                    dT(a, j, h);
                }
            } else if (i || a.options.showCursorWhenSelecting) {
                dT(a, b.head, h);
            }
            if (!i) {
                dV(a, b, k);
            }
        }
        return f;
    }
    function dT(b, e, f) {
        var a = ds(b, e, "div", null, null, !b.options.singleCursorHeightPerLine);
        var c = f.appendChild(ap("div", "\u00a0", "CodeMirror-cursor"));
        c.style.left = a.left + "px";
        c.style.top = a.top + "px";
        c.style.height = Math.max(0, a.bottom - a.top) * b.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(b.getWrapperElement().className)) {
            var g = dr(b, e, "div", null, null);
            var h = g.right - g.left;
            c.style.width = (h > 0 ? h : b.defaultCharWidth()) + "px";
        }
        if (a.other) {
            var d = f.appendChild(ap("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            d.style.display = "";
            d.style.left = a.other.left + "px";
            d.style.top = a.other.top + "px";
            d.style.height = (a.other.bottom - a.other.top) * 0.85 + "px";
        }
    }
    function dU(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    function dV(e, j, o) {
        var k = e.display, g = e.doc;
        var p = document.createDocumentFragment();
        var l = c2(e.display), m = l.left;
        var r = Math.max(k.sizerWidth, c4(e) - k.sizer.offsetLeft) - l.right;
        var s = g.direction == "ltr";
        function f(c, a, d, b) {
            if (a < 0) {
                a = 0;
            }
            a = Math.round(a);
            b = Math.round(b);
            p.appendChild(ap("div", null, "CodeMirror-selected", "position: absolute; left: " + c + "px;\n                             top: " + a + "px; width: " + (d == null ? r - c : d) + "px;\n                             height: " + (b - a) + "px"));
        }
        function h(c, d, a) {
            var b = bt(g, c);
            var h = b.text.length;
            var i, j;
            function l(a, d) {
                return dr(e, bB(c, a), "div", b, d);
            }
            function n(f, g, c) {
                var a = dx(e, b, null, f);
                var d = (g == "ltr") == (c == "after") ? "left" : "right";
                var h = c == "after" ? a.begin : a.end - (/\s/.test(b.text.charAt(a.end - 1)) ? 2 : 1);
                return l(h, d)[d];
            }
            var k = aW(b, g.direction);
            aS(k, d || 0, a == null ? h : a, function(o, p, e, A) {
                var g = e == "ltr";
                var b = l(o, g ? "left" : "right");
                var c = l(p - 1, g ? "right" : "left");
                var q = d == null && o == 0, t = a == null && p == h;
                var w = A == 0, x = !k || A == k.length - 1;
                if (c.top - b.top <= 3) {
                    var C = (s ? q : t) && w;
                    var D = (s ? t : q) && x;
                    var B = C ? m : (g ? b : c).left;
                    var E = D ? r : (g ? c : b).right;
                    f(B, b.top, E - B, b.bottom);
                } else {
                    var u, y, v, z;
                    if (g) {
                        u = s && q && w ? m : b.left;
                        y = s ? r : n(o, e, "before");
                        v = s ? m : n(p, e, "after");
                        z = s && t && x ? r : c.right;
                    } else {
                        u = !s ? m : n(o, e, "before");
                        y = !s && q && w ? r : b.right;
                        v = !s && t && x ? m : c.left;
                        z = !s ? r : n(p, e, "after");
                    }
                    f(u, b.top, y - u, b.bottom);
                    if (b.bottom < c.top) {
                        f(m, b.bottom, null, c.top);
                    }
                    f(v, c.top, z - v, c.bottom);
                }
                if (!i || dU(b, i) < 0) {
                    i = b;
                }
                if (dU(c, i) < 0) {
                    i = c;
                }
                if (!j || dU(b, j) < 0) {
                    j = b;
                }
                if (dU(c, j) < 0) {
                    j = c;
                }
            });
            return {
                start: i,
                end: j
            };
        }
        var c = j.from(), d = j.to();
        if (c.line == d.line) {
            h(c.line, c.ch, d.ch);
        } else {
            var n = bt(g, c.line), q = bt(g, d.line);
            var i = cj(n) == cj(q);
            var a = h(c.line, c.ch, i ? n.text.length + 1 : null).end;
            var b = h(d.line, i ? 0 : null, d.ch).start;
            if (i) {
                if (a.top < b.top - 2) {
                    f(a.right, a.top, null, a.bottom);
                    f(m, b.top, b.left, b.bottom);
                } else {
                    f(a.right, a.top, b.left - a.right, a.bottom);
                }
            }
            if (a.bottom < b.top) {
                f(m, a.bottom, null, b.top);
            }
        }
        o.appendChild(p);
    }
    function dW(a) {
        if (!a.state.focused) {
            return;
        }
        var b = a.display;
        clearInterval(b.blinker);
        var c = true;
        b.cursorDiv.style.visibility = "";
        if (a.options.cursorBlinkRate > 0) {
            b.blinker = setInterval(function() {
                if (!a.hasFocus()) {
                    d$(a);
                }
                b.cursorDiv.style.visibility = (c = !c) ? "" : "hidden";
            }, a.options.cursorBlinkRate);
        } else if (a.options.cursorBlinkRate < 0) {
            b.cursorDiv.style.visibility = "hidden";
        }
    }
    function dX(a) {
        if (!a.hasFocus()) {
            a.display.input.focus();
            if (!a.state.focused) {
                dZ(a);
            }
        }
    }
    function dY(a) {
        a.state.delayingBlurEvent = true;
        setTimeout(function() {
            if (a.state.delayingBlurEvent) {
                a.state.delayingBlurEvent = false;
                if (a.state.focused) {
                    d$(a);
                }
            }
        }, 100);
    }
    function dZ(a, b) {
        if (a.state.delayingBlurEvent && !a.state.draggingText) {
            a.state.delayingBlurEvent = false;
        }
        if (a.options.readOnly == "nocursor") {
            return;
        }
        if (!a.state.focused) {
            a_(a, "focus", a, b);
            a.state.focused = true;
            at(a.display.wrapper, "CodeMirror-focused");
            if (!a.curOp && a.display.selForContextMenu != a.doc.sel) {
                a.display.input.reset();
                if (H) {
                    setTimeout(function() {
                        return a.display.input.reset(true);
                    }, 20);
                }
            }
            a.display.input.receivedFocus();
        }
        dW(a);
    }
    function d$(a, b) {
        if (a.state.delayingBlurEvent) {
            return;
        }
        if (a.state.focused) {
            a_(a, "blur", a, b);
            a.state.focused = false;
            am(a.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(a.display.blinker);
        setTimeout(function() {
            if (!a.state.focused) {
                a.display.shift = false;
            }
        }, 150);
    }
    function d_(b) {
        var c = b.display;
        var k = c.lineDiv.offsetTop;
        var o = Math.max(0, c.scroller.getBoundingClientRect().top);
        var l = c.lineDiv.getBoundingClientRect().top;
        var e = 0;
        for(var f = 0; f < c.view.length; f++){
            var a = c.view[f], p = b.options.lineWrapping;
            var d = void 0, g = 0;
            if (a.hidden) {
                continue;
            }
            l += a.line.height;
            if (t && P < 8) {
                var m = a.node.offsetTop + a.node.offsetHeight;
                d = m - k;
                k = m;
            } else {
                var h = a.node.getBoundingClientRect();
                d = h.bottom - h.top;
                if (!p && a.text.firstChild) {
                    g = a.text.firstChild.getBoundingClientRect().right - h.left - 1;
                }
            }
            var i = a.line.height - d;
            if (i > 0.005 || i < -0.005) {
                if (l < o) {
                    e -= i;
                }
                bw(a.line, d);
                d0(a.line);
                if (a.rest) {
                    for(var j = 0; j < a.rest.length; j++){
                        d0(a.rest[j]);
                    }
                }
            }
            if (g > b.display.sizerWidth) {
                var n = Math.ceil(g / dE(b.display));
                if (n > b.display.maxLineLength) {
                    b.display.maxLineLength = n;
                    b.display.maxLine = a.line;
                    b.display.maxLineChanged = true;
                }
            }
        }
        if (Math.abs(e) > 2) {
            c.scroller.scrollTop += e;
        }
    }
    function d0(a) {
        if (a.widgets) {
            for(var b = 0; b < a.widgets.length; ++b){
                var c = a.widgets[b], d = c.node.parentNode;
                if (d) {
                    c.height = d.offsetHeight;
                }
            }
        }
    }
    function d1(c, b, a) {
        var e = a && a.top != null ? Math.max(0, a.top) : c.scroller.scrollTop;
        e = Math.floor(e - c0(c));
        var i = a && a.bottom != null ? a.bottom : e + c.wrapper.clientHeight;
        var d = by(b, e), f = by(b, i);
        if (a && a.ensure) {
            var g = a.ensure.from.line, h = a.ensure.to.line;
            if (g < d) {
                d = g;
                f = by(b, cq(bt(b, g)) + c.wrapper.clientHeight);
            } else if (Math.min(h, b.lastLine()) >= f) {
                d = by(b, cq(bt(b, h)) - c.wrapper.clientHeight);
                f = h;
            }
        }
        return {
            from: d,
            to: Math.max(f, d + 1)
        };
    }
    function d2(b, a) {
        if (a0(b, "scrollCursorIntoView")) {
            return;
        }
        var d = b.display, f = d.sizer.getBoundingClientRect(), c = null;
        if (a.top + f.top < 0) {
            c = true;
        } else if (a.bottom + f.top > (window.innerHeight || document.documentElement.clientHeight)) {
            c = false;
        }
        if (c != null && !af) {
            var e = ap("div", "\u200b", null, "position: absolute;\n                         top: " + (a.top - d.viewOffset - c0(b.display)) + "px;\n                         height: " + (a.bottom - a.top + c3(b) + d.barHeight) + "px;\n                         left: " + a.left + "px; width: " + Math.max(2, a.right - a.left) + "px;");
            b.display.lineSpace.appendChild(e);
            e.scrollIntoView(c);
            b.display.lineSpace.removeChild(e);
        }
    }
    function d3(b, a, c, e) {
        if (e == null) {
            e = 0;
        }
        var h;
        if (!b.options.lineWrapping && a == c) {
            c = a.sticky == "before" ? bB(a.line, a.ch + 1, "before") : a;
            a = a.ch ? bB(a.line, a.sticky == "before" ? a.ch - 1 : a.ch, "after") : a;
        }
        for(var j = 0; j < 5; j++){
            var i = false;
            var d = ds(b, a);
            var f = !c || c == a ? d : ds(b, c);
            h = {
                left: Math.min(d.left, f.left),
                top: Math.min(d.top, f.top) - e,
                right: Math.max(d.left, f.left),
                bottom: Math.max(d.bottom, f.bottom) + e
            };
            var g = d5(b, h);
            var k = b.doc.scrollTop, l = b.doc.scrollLeft;
            if (g.scrollTop != null) {
                ec(b, g.scrollTop);
                if (Math.abs(b.doc.scrollTop - k) > 1) {
                    i = true;
                }
            }
            if (g.scrollLeft != null) {
                ee(b, g.scrollLeft);
                if (Math.abs(b.doc.scrollLeft - l) > 1) {
                    i = true;
                }
            }
            if (!i) {
                break;
            }
        }
        return h;
    }
    function d4(b, c) {
        var a = d5(b, c);
        if (a.scrollTop != null) {
            ec(b, a.scrollTop);
        }
        if (a.scrollLeft != null) {
            ee(b, a.scrollLeft);
        }
    }
    function d5(b, a) {
        var d = b.display, i = dD(b.display);
        if (a.top < 0) {
            a.top = 0;
        }
        var g = b.curOp && b.curOp.scrollTop != null ? b.curOp.scrollTop : d.scroller.scrollTop;
        var e = c5(b), c = {};
        if (a.bottom - a.top > e) {
            a.bottom = a.top + e;
        }
        var j = b.doc.height + c1(d);
        var n = a.top < i, o = a.bottom > j - i;
        if (a.top < g) {
            c.scrollTop = n ? 0 : a.top;
        } else if (a.bottom > g + e) {
            var k = Math.min(a.top, (o ? j : a.bottom) - e);
            if (k != g) {
                c.scrollTop = k;
            }
        }
        var l = b.options.fixedGutter ? 0 : d.gutters.offsetWidth;
        var m = b.curOp && b.curOp.scrollLeft != null ? b.curOp.scrollLeft : d.scroller.scrollLeft - l;
        var f = c4(b) - d.gutters.offsetWidth;
        var h = a.right - a.left > f;
        if (h) {
            a.right = a.left + f;
        }
        if (a.left < 10) {
            c.scrollLeft = 0;
        } else if (a.left < m) {
            c.scrollLeft = Math.max(0, a.left + l - (h ? 0 : 10));
        } else if (a.right > f + m - 3) {
            c.scrollLeft = a.right + (h ? 0 : 10) - f;
        }
        return c;
    }
    function d6(a, b) {
        if (b == null) {
            return;
        }
        ea(a);
        a.curOp.scrollTop = (a.curOp.scrollTop == null ? a.doc.scrollTop : a.curOp.scrollTop) + b;
    }
    function d7(a) {
        ea(a);
        var b = a.getCursor();
        a.curOp.scrollToPos = {
            from: b,
            to: b,
            margin: a.options.cursorScrollMargin
        };
    }
    function d8(a, b, c) {
        if (b != null || c != null) {
            ea(a);
        }
        if (b != null) {
            a.curOp.scrollLeft = b;
        }
        if (c != null) {
            a.curOp.scrollTop = c;
        }
    }
    function d9(a, b) {
        ea(a);
        a.curOp.scrollToPos = b;
    }
    function ea(a) {
        var b = a.curOp.scrollToPos;
        if (b) {
            a.curOp.scrollToPos = null;
            var c = dt(a, b.from), d = dt(a, b.to);
            eb(a, c, d, b.margin);
        }
    }
    function eb(c, a, b, d) {
        var e = d5(c, {
            left: Math.min(a.left, b.left),
            top: Math.min(a.top, b.top) - d,
            right: Math.max(a.right, b.right),
            bottom: Math.max(a.bottom, b.bottom) + d
        });
        d8(c, e.scrollLeft, e.scrollTop);
    }
    function ec(a, b) {
        if (Math.abs(a.doc.scrollTop - b) < 2) {
            return;
        }
        if (!E) {
            eD(a, {
                top: b
            });
        }
        ed(a, b, true);
        if (E) {
            eD(a);
        }
        ew(a, 100);
    }
    function ed(a, b, c) {
        b = Math.max(0, Math.min(a.display.scroller.scrollHeight - a.display.scroller.clientHeight, b));
        if (a.display.scroller.scrollTop == b && !c) {
            return;
        }
        a.doc.scrollTop = b;
        a.display.scrollbars.setScrollTop(b);
        if (a.display.scroller.scrollTop != b) {
            a.display.scroller.scrollTop = b;
        }
    }
    function ee(a, b, c, d) {
        b = Math.max(0, Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth));
        if ((c ? b == a.doc.scrollLeft : Math.abs(a.doc.scrollLeft - b) < 2) && !d) {
            return;
        }
        a.doc.scrollLeft = b;
        eH(a);
        if (a.display.scroller.scrollLeft != b) {
            a.display.scroller.scrollLeft = b;
        }
        a.display.scrollbars.setScrollLeft(b);
    }
    function ef(b) {
        var a = b.display, c = a.gutters.offsetWidth;
        var d = Math.round(b.doc.height + c1(b.display));
        return {
            clientHeight: a.scroller.clientHeight,
            viewHeight: a.wrapper.clientHeight,
            scrollWidth: a.scroller.scrollWidth,
            clientWidth: a.scroller.clientWidth,
            viewWidth: a.wrapper.clientWidth,
            barLeft: b.options.fixedGutter ? c : 0,
            docHeight: d,
            scrollHeight: d + c3(b) + a.barHeight,
            nativeBarWidth: a.nativeBarWidth,
            gutterWidth: c
        };
    }
    var i = function(c, e, d) {
        this.cm = d;
        var a = (this.vert = ap("div", [
            ap("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar"));
        var b = (this.horiz = ap("div", [
            ap("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar"));
        a.tabIndex = b.tabIndex = -1;
        c(a);
        c(b);
        aY(a, "scroll", function() {
            if (a.clientHeight) {
                e(a.scrollTop, "vertical");
            }
        });
        aY(b, "scroll", function() {
            if (b.clientWidth) {
                e(b.scrollLeft, "horizontal");
            }
        });
        this.checkedZeroWidth = false;
        if (t && P < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
    };
    i.prototype.update = function(a) {
        var c = a.scrollWidth > a.clientWidth + 1;
        var d = a.scrollHeight > a.clientHeight + 1;
        var b = a.nativeBarWidth;
        if (d) {
            this.vert.style.display = "block";
            this.vert.style.bottom = c ? b + "px" : "0";
            var e = a.viewHeight - (c ? b : 0);
            this.vert.firstChild.style.height = Math.max(0, a.scrollHeight - a.clientHeight + e) + "px";
        } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
        }
        if (c) {
            this.horiz.style.display = "block";
            this.horiz.style.right = d ? b + "px" : "0";
            this.horiz.style.left = a.barLeft + "px";
            var f = a.viewWidth - a.barLeft - (d ? b : 0);
            this.horiz.firstChild.style.width = Math.max(0, a.scrollWidth - a.clientWidth + f) + "px";
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && a.clientHeight > 0) {
            if (b == 0) {
                this.zeroWidthHack();
            }
            this.checkedZeroWidth = true;
        }
        return {
            right: d ? b : 0,
            bottom: c ? b : 0
        };
    };
    i.prototype.setScrollLeft = function(a) {
        if (this.horiz.scrollLeft != a) {
            this.horiz.scrollLeft = a;
        }
        if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
    };
    i.prototype.setScrollTop = function(a) {
        if (this.vert.scrollTop != a) {
            this.vert.scrollTop = a;
        }
        if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
    };
    i.prototype.zeroWidthHack = function() {
        var a = J && !ae ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = a;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new z();
        this.disableVert = new z();
    };
    i.prototype.enableZeroWidthBar = function(a, b, d) {
        a.style.pointerEvents = "auto";
        function c() {
            var e = a.getBoundingClientRect();
            var f = d == "vert" ? document.elementFromPoint(e.right - 1, (e.top + e.bottom) / 2) : document.elementFromPoint((e.right + e.left) / 2, e.bottom - 1);
            if (f != a) {
                a.style.pointerEvents = "none";
            } else {
                b.set(1000, c);
            }
        }
        b.set(1000, c);
    };
    i.prototype.clear = function() {
        var a = this.horiz.parentNode;
        a.removeChild(this.horiz);
        a.removeChild(this.vert);
    };
    var n = function() {};
    n.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    };
    n.prototype.setScrollLeft = function() {};
    n.prototype.setScrollTop = function() {};
    n.prototype.clear = function() {};
    function eg(a, b) {
        if (!b) {
            b = ef(a);
        }
        var c = a.display.barWidth, d = a.display.barHeight;
        eh(a, b);
        for(var e = 0; (e < 4 && c != a.display.barWidth) || d != a.display.barHeight; e++){
            if (c != a.display.barWidth && a.options.lineWrapping) {
                d_(a);
            }
            eh(a, ef(a));
            c = a.display.barWidth;
            d = a.display.barHeight;
        }
    }
    function eh(c, d) {
        var a = c.display;
        var b = a.scrollbars.update(d);
        a.sizer.style.paddingRight = (a.barWidth = b.right) + "px";
        a.sizer.style.paddingBottom = (a.barHeight = b.bottom) + "px";
        a.heightForcer.style.borderBottom = b.bottom + "px solid transparent";
        if (b.right && b.bottom) {
            a.scrollbarFiller.style.display = "block";
            a.scrollbarFiller.style.height = b.bottom + "px";
            a.scrollbarFiller.style.width = b.right + "px";
        } else {
            a.scrollbarFiller.style.display = "";
        }
        if (b.bottom && c.options.coverGutterNextToScrollbar && c.options.fixedGutter) {
            a.gutterFiller.style.display = "block";
            a.gutterFiller.style.height = b.bottom + "px";
            a.gutterFiller.style.width = d.gutterWidth + "px";
        } else {
            a.gutterFiller.style.display = "";
        }
    }
    var ei = {
        native: i,
        null: n
    };
    function ej(a) {
        if (a.display.scrollbars) {
            a.display.scrollbars.clear();
            if (a.display.scrollbars.addClass) {
                am(a.display.wrapper, a.display.scrollbars.addClass);
            }
        }
        a.display.scrollbars = new ei[a.options.scrollbarStyle](function(b) {
            a.display.wrapper.insertBefore(b, a.display.scrollbarFiller);
            aY(b, "mousedown", function() {
                if (a.state.focused) {
                    setTimeout(function() {
                        return a.display.input.focus();
                    }, 0);
                }
            });
            b.setAttribute("cm-not-content", "true");
        }, function(b, c) {
            if (c == "horizontal") {
                ee(a, b);
            } else {
                ec(a, b);
            }
        }, a);
        if (a.display.scrollbars.addClass) {
            at(a.display.wrapper, a.display.scrollbars.addClass);
        }
    }
    var ek = 0;
    function el(a) {
        a.curOp = {
            cm: a,
            viewChanged: false,
            startHeight: a.doc.height,
            forceUpdate: false,
            updateInput: 0,
            typing: false,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: false,
            updateMaxLine: false,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: false,
            id: ++ek,
            markArrays: null
        };
        cI(a.curOp);
    }
    function em(b) {
        var a = b.curOp;
        if (a) {
            cK(a, function(a) {
                for(var b = 0; b < a.ops.length; b++){
                    a.ops[b].cm.curOp = null;
                }
                en(a);
            });
        }
    }
    function en(g) {
        var a = g.ops;
        for(var b = 0; b < a.length; b++){
            eo(a[b]);
        }
        for(var c = 0; c < a.length; c++){
            ep(a[c]);
        }
        for(var d = 0; d < a.length; d++){
            eq(a[d]);
        }
        for(var e = 0; e < a.length; e++){
            er(a[e]);
        }
        for(var f = 0; f < a.length; f++){
            es(a[f]);
        }
    }
    function eo(a) {
        var b = a.cm, c = b.display;
        ey(b);
        if (a.updateMaxLine) {
            cs(b);
        }
        a.mustUpdate = a.viewChanged || a.forceUpdate || a.scrollTop != null || (a.scrollToPos && (a.scrollToPos.from.line < c.viewFrom || a.scrollToPos.to.line >= c.viewTo)) || (c.maxLineChanged && b.options.lineWrapping);
        a.update = a.mustUpdate && new N(b, a.mustUpdate && {
            top: a.scrollTop,
            ensure: a.scrollToPos
        }, a.forceUpdate);
    }
    function ep(a) {
        a.updatedDisplay = a.mustUpdate && eB(a.cm, a.update);
    }
    function eq(a) {
        var b = a.cm, c = b.display;
        if (a.updatedDisplay) {
            d_(b);
        }
        a.barMeasure = ef(b);
        if (c.maxLineChanged && !b.options.lineWrapping) {
            a.adjustWidthTo = c9(b, c.maxLine, c.maxLine.text.length).left + 3;
            b.display.sizerWidth = a.adjustWidthTo;
            a.barMeasure.scrollWidth = Math.max(c.scroller.clientWidth, c.sizer.offsetLeft + a.adjustWidthTo + c3(b) + b.display.barWidth);
            a.maxScrollLeft = Math.max(0, c.sizer.offsetLeft + a.adjustWidthTo - c4(b));
        }
        if (a.updatedDisplay || a.selectionChanged) {
            a.preparedSelection = c.input.prepareSelection();
        }
    }
    function er(a) {
        var b = a.cm;
        if (a.adjustWidthTo != null) {
            b.display.sizer.style.minWidth = a.adjustWidthTo + "px";
            if (a.maxScrollLeft < b.doc.scrollLeft) {
                ee(b, Math.min(b.display.scroller.scrollLeft, a.maxScrollLeft), true);
            }
            b.display.maxLineChanged = false;
        }
        var c = a.focus && a.focus == as();
        if (a.preparedSelection) {
            b.display.input.showSelection(a.preparedSelection, c);
        }
        if (a.updatedDisplay || a.startHeight != b.doc.height) {
            eg(b, a.barMeasure);
        }
        if (a.updatedDisplay) {
            eG(b, a.barMeasure);
        }
        if (a.selectionChanged) {
            dW(b);
        }
        if (b.state.focused && a.updateInput) {
            b.display.input.reset(a.typing);
        }
        if (c) {
            dX(a.cm);
        }
    }
    function es(a) {
        var b = a.cm, c = b.display, h = b.doc;
        if (a.updatedDisplay) {
            eC(b, a.update);
        }
        if (c.wheelStartX != null && (a.scrollTop != null || a.scrollLeft != null || a.scrollToPos)) {
            c.wheelStartX = c.wheelStartY = null;
        }
        if (a.scrollTop != null) {
            ed(b, a.scrollTop, a.forceScroll);
        }
        if (a.scrollLeft != null) {
            ee(b, a.scrollLeft, true, true);
        }
        if (a.scrollToPos) {
            var i = d3(b, bI(h, a.scrollToPos.from), bI(h, a.scrollToPos.to), a.scrollToPos.margin);
            d2(b, i);
        }
        var d = a.maybeHiddenMarkers, e = a.maybeUnhiddenMarkers;
        if (d) {
            for(var f = 0; f < d.length; ++f){
                if (!d[f].lines.length) {
                    a_(d[f], "hide");
                }
            }
        }
        if (e) {
            for(var g = 0; g < e.length; ++g){
                if (e[g].lines.length) {
                    a_(e[g], "unhide");
                }
            }
        }
        if (c.wrapper.offsetHeight) {
            h.scrollTop = b.display.scroller.scrollTop;
        }
        if (a.changeObjs) {
            a_(b, "changes", b, a.changeObjs);
        }
        if (a.update) {
            a.update.finish();
        }
    }
    function et(a, b) {
        if (a.curOp) {
            return b();
        }
        el(a);
        try {
            return b();
        } finally{
            em(a);
        }
    }
    function eu(a, b) {
        return function() {
            if (a.curOp) {
                return b.apply(a, arguments);
            }
            el(a);
            try {
                return b.apply(a, arguments);
            } finally{
                em(a);
            }
        };
    }
    function ev(a) {
        return function() {
            if (this.curOp) {
                return a.apply(this, arguments);
            }
            el(this);
            try {
                return a.apply(this, arguments);
            } finally{
                em(this);
            }
        };
    }
    function c(a) {
        return function() {
            var b = this.cm;
            if (!b || b.curOp) {
                return a.apply(this, arguments);
            }
            el(b);
            try {
                return a.apply(this, arguments);
            } finally{
                em(b);
            }
        };
    }
    function ew(a, b) {
        if (a.doc.highlightFrontier < a.display.viewTo) {
            a.state.highlight.set(b, av(ex, a));
        }
    }
    function ex(b) {
        var a = b.doc;
        if (a.highlightFrontier >= b.display.viewTo) {
            return;
        }
        var e = +new Date() + b.options.workTime;
        var c = bO(b, a.highlightFrontier);
        var d = [];
        a.iter(c.line, Math.min(a.first + a.size, b.display.viewTo + 500), function(f) {
            if (c.line >= b.display.viewFrom) {
                var i = f.styles;
                var l = f.text.length > b.options.maxHighlightLength ? bq(a.mode, c.state) : null;
                var m = bM(b, f, c, true);
                if (l) {
                    c.state = l;
                }
                f.styles = m.styles;
                var h = f.styleClasses, g = m.classes;
                if (g) {
                    f.styleClasses = g;
                } else if (h) {
                    f.styleClasses = null;
                }
                var k = !i || i.length != f.styles.length || (h != g && (!h || !g || h.bgClass != g.bgClass || h.textClass != g.textClass));
                for(var j = 0; !k && j < i.length; ++j){
                    k = i[j] != f.styles[j];
                }
                if (k) {
                    d.push(c.line);
                }
                f.stateAfter = c.save();
                c.nextLine();
            } else {
                if (f.text.length <= b.options.maxHighlightLength) {
                    bP(b, f.text, c);
                }
                f.stateAfter = c.line % 5 == 0 ? c.save() : null;
                c.nextLine();
            }
            if (+new Date() > e) {
                ew(b, b.options.workDelay);
                return true;
            }
        });
        a.highlightFrontier = c.line;
        a.modeFrontier = Math.max(a.modeFrontier, c.line);
        if (d.length) {
            et(b, function() {
                for(var a = 0; a < d.length; a++){
                    dM(b, d[a], "text");
                }
            });
        }
    }
    var N = function(a, c, d) {
        var b = a.display;
        this.viewport = c;
        this.visible = d1(b, a.doc, c);
        this.editorIsHidden = !b.wrapper.offsetWidth;
        this.wrapperHeight = b.wrapper.clientHeight;
        this.wrapperWidth = b.wrapper.clientWidth;
        this.oldDisplayWidth = c4(a);
        this.force = d;
        this.dims = dF(a);
        this.events = [];
    };
    N.prototype.signal = function(a, b) {
        if (a2(a, b)) {
            this.events.push(arguments);
        }
    };
    N.prototype.finish = function() {
        for(var a = 0; a < this.events.length; a++){
            a_.apply(null, this.events[a]);
        }
    };
    function ey(b) {
        var a = b.display;
        if (!a.scrollbarsClipped && a.scroller.offsetWidth) {
            a.nativeBarWidth = a.scroller.offsetWidth - a.scroller.clientWidth;
            a.heightForcer.style.height = c3(b) + "px";
            a.sizer.style.marginBottom = -a.nativeBarWidth + "px";
            a.sizer.style.borderRightWidth = c3(b) + "px";
            a.scrollbarsClipped = true;
        }
    }
    function ez(c) {
        if (c.hasFocus()) {
            return null;
        }
        var d = as();
        if (!d || !ar(c.display.lineDiv, d)) {
            return null;
        }
        var b = {
            activeElt: d
        };
        if (window.getSelection) {
            var a = window.getSelection();
            if (a.anchorNode && a.extend && ar(c.display.lineDiv, a.anchorNode)) {
                b.anchorNode = a.anchorNode;
                b.anchorOffset = a.anchorOffset;
                b.focusNode = a.focusNode;
                b.focusOffset = a.focusOffset;
            }
        }
        return b;
    }
    function eA(a) {
        if (!a || !a.activeElt || a.activeElt == as()) {
            return;
        }
        a.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(a.activeElt.nodeName) && a.anchorNode && ar(document.body, a.anchorNode) && ar(document.body, a.focusNode)) {
            var b = window.getSelection(), c = document.createRange();
            c.setEnd(a.anchorNode, a.anchorOffset);
            c.collapse(false);
            b.removeAllRanges();
            b.addRange(c);
            b.extend(a.focusNode, a.focusOffset);
        }
    }
    function eB(b, c) {
        var a = b.display, f = b.doc;
        if (c.editorIsHidden) {
            dN(b);
            return false;
        }
        if (!c.force && c.visible.from >= a.viewFrom && c.visible.to <= a.viewTo && (a.updateLineNumbers == null || a.updateLineNumbers >= a.viewTo) && a.renderedView == a.view && dQ(b) == 0) {
            return false;
        }
        if (eI(b)) {
            dN(b);
            c.dims = dF(b);
        }
        var h = f.first + f.size;
        var d = Math.max(c.visible.from - b.options.viewportMargin, f.first);
        var e = Math.min(h, c.visible.to + b.options.viewportMargin);
        if (a.viewFrom < d && d - a.viewFrom < 20) {
            d = Math.max(f.first, a.viewFrom);
        }
        if (a.viewTo > e && a.viewTo - e < 20) {
            e = Math.min(h, a.viewTo);
        }
        if (bZ) {
            d = cm(b.doc, d);
            e = cn(b.doc, e);
        }
        var i = d != a.viewFrom || e != a.viewTo || a.lastWrapHeight != c.wrapperHeight || a.lastWrapWidth != c.wrapperWidth;
        dP(b, d, e);
        a.viewOffset = cq(bt(b.doc, a.viewFrom));
        b.display.mover.style.top = a.viewOffset + "px";
        var g = dQ(b);
        if (!i && g == 0 && !c.force && a.renderedView == a.view && (a.updateLineNumbers == null || a.updateLineNumbers >= a.viewTo)) {
            return false;
        }
        var j = ez(b);
        if (g > 4) {
            a.lineDiv.style.display = "none";
        }
        eE(b, a.updateLineNumbers, c.dims);
        if (g > 4) {
            a.lineDiv.style.display = "";
        }
        a.renderedView = a.view;
        eA(j);
        an(a.cursorDiv);
        an(a.selectionDiv);
        a.gutters.style.height = a.sizer.style.minHeight = 0;
        if (i) {
            a.lastWrapHeight = c.wrapperHeight;
            a.lastWrapWidth = c.wrapperWidth;
            ew(b, 400);
        }
        a.updateLineNumbers = null;
        return true;
    }
    function eC(a, b) {
        var c = b.viewport;
        for(var d = true;; d = false){
            if (!d || !a.options.lineWrapping || b.oldDisplayWidth == c4(a)) {
                if (c && c.top != null) {
                    c = {
                        top: Math.min(a.doc.height + c1(a.display) - c5(a), c.top)
                    };
                }
                b.visible = d1(a.display, a.doc, c);
                if (b.visible.from >= a.display.viewFrom && b.visible.to <= a.display.viewTo) {
                    break;
                }
            } else if (d) {
                b.visible = d1(a.display, a.doc, c);
            }
            if (!eB(a, b)) {
                break;
            }
            d_(a);
            var e = ef(a);
            dR(a);
            eg(a, e);
            eG(a, e);
            b.force = false;
        }
        b.signal(a, "update", a);
        if (a.display.viewFrom != a.display.reportedViewFrom || a.display.viewTo != a.display.reportedViewTo) {
            b.signal(a, "viewportChange", a, a.display.viewFrom, a.display.viewTo);
            a.display.reportedViewFrom = a.display.viewFrom;
            a.display.reportedViewTo = a.display.viewTo;
        }
    }
    function eD(a, d) {
        var b = new N(a, d);
        if (eB(a, b)) {
            d_(a);
            eC(a, b);
            var c = ef(a);
            dR(a);
            eg(a, c);
            eG(a, c);
            b.finish();
        }
    }
    function eE(c, h, i) {
        var e = c.display, m = c.options.lineNumbers;
        var f = e.lineDiv, b = f.firstChild;
        function j(a) {
            var b = a.nextSibling;
            if (H && J && c.display.currentWheelTarget == a) {
                a.style.display = "none";
            } else {
                a.parentNode.removeChild(a);
            }
            return b;
        }
        var k = e.view, d = e.viewFrom;
        for(var g = 0; g < k.length; g++){
            var a = k[g];
            if (a.hidden) ;
            else if (!a.node || a.node.parentNode != f) {
                var n = cW(c, a, d, i);
                f.insertBefore(n, b);
            } else {
                while(b != a.node){
                    b = j(b);
                }
                var l = m && h != null && h <= d && a.lineNumber;
                if (a.changes) {
                    if (T(a.changes, "gutter") > -1) {
                        l = false;
                    }
                    cO(c, a, d, i);
                }
                if (l) {
                    an(a.lineNumber);
                    a.lineNumber.appendChild(document.createTextNode(bA(c.options, d)));
                }
                b = a.node.nextSibling;
            }
            d += a.size;
        }
        while(b){
            b = j(b);
        }
    }
    function eF(a) {
        var b = a.gutters.offsetWidth;
        a.sizer.style.marginLeft = b + "px";
        cM(a, "gutterChanged", a);
    }
    function eG(a, b) {
        a.display.sizer.style.minHeight = b.docHeight + "px";
        a.display.heightForcer.style.top = b.docHeight + "px";
        a.display.gutters.style.height = b.docHeight + a.display.barHeight + c3(a) + "px";
    }
    function eH(d) {
        var b = d.display, c = b.view;
        if (!b.alignWidgets && (!b.gutters.firstChild || !d.options.fixedGutter)) {
            return;
        }
        var h = dG(b) - b.scroller.scrollLeft + d.doc.scrollLeft;
        var i = b.gutters.offsetWidth, e = h + "px";
        for(var a = 0; a < c.length; a++){
            if (!c[a].hidden) {
                if (d.options.fixedGutter) {
                    if (c[a].gutter) {
                        c[a].gutter.style.left = e;
                    }
                    if (c[a].gutterBackground) {
                        c[a].gutterBackground.style.left = e;
                    }
                }
                var f = c[a].alignable;
                if (f) {
                    for(var g = 0; g < f.length; g++){
                        f[g].style.left = e;
                    }
                }
            }
        }
        if (d.options.fixedGutter) {
            b.gutters.style.left = h + i + "px";
        }
    }
    function eI(b) {
        if (!b.options.lineNumbers) {
            return false;
        }
        var d = b.doc, c = bA(b.options, d.first + d.size - 1), a = b.display;
        if (c.length != a.lineNumChars) {
            var e = a.measure.appendChild(ap("div", [
                ap("div", c)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var f = e.firstChild.offsetWidth, g = e.offsetWidth - f;
            a.lineGutter.style.width = "";
            a.lineNumInnerWidth = Math.max(f, a.lineGutter.offsetWidth - g) + 1;
            a.lineNumWidth = a.lineNumInnerWidth + g;
            a.lineNumChars = a.lineNumInnerWidth ? c.length : -1;
            a.lineGutter.style.width = a.lineNumWidth + "px";
            eF(b.display);
            return true;
        }
        return false;
    }
    function eJ(d, e) {
        var b = [], f = false;
        for(var c = 0; c < d.length; c++){
            var a = d[c], g = null;
            if (typeof a != "string") {
                g = a.style;
                a = a.className;
            }
            if (a == "CodeMirror-linenumbers") {
                if (!e) {
                    continue;
                } else {
                    f = true;
                }
            }
            b.push({
                className: a,
                style: g
            });
        }
        if (e && !f) {
            b.push({
                className: "CodeMirror-linenumbers",
                style: null
            });
        }
        return b;
    }
    function eK(a) {
        var b = a.gutters, c = a.gutterSpecs;
        an(b);
        a.lineGutter = null;
        for(var d = 0; d < c.length; ++d){
            var f = c[d];
            var g = f.className;
            var h = f.style;
            var e = b.appendChild(ap("div", null, "CodeMirror-gutter " + g));
            if (h) {
                e.style.cssText = h;
            }
            if (g == "CodeMirror-linenumbers") {
                a.lineGutter = e;
                e.style.width = (a.lineNumWidth || 1) + "px";
            }
        }
        b.style.display = c.length ? "" : "none";
        eF(a);
    }
    function eL(a) {
        eK(a.display);
        dL(a);
        eH(a);
    }
    function eM(b, c, d, e) {
        var a = this;
        this.input = d;
        a.scrollbarFiller = ap("div", null, "CodeMirror-scrollbar-filler");
        a.scrollbarFiller.setAttribute("cm-not-content", "true");
        a.gutterFiller = ap("div", null, "CodeMirror-gutter-filler");
        a.gutterFiller.setAttribute("cm-not-content", "true");
        a.lineDiv = aq("div", null, "CodeMirror-code");
        a.selectionDiv = ap("div", null, null, "position: relative; z-index: 1");
        a.cursorDiv = ap("div", null, "CodeMirror-cursors");
        a.measure = ap("div", null, "CodeMirror-measure");
        a.lineMeasure = ap("div", null, "CodeMirror-measure");
        a.lineSpace = aq("div", [
            a.measure,
            a.lineMeasure,
            a.selectionDiv,
            a.cursorDiv,
            a.lineDiv
        ], null, "position: relative; outline: none");
        var f = aq("div", [
            a.lineSpace
        ], "CodeMirror-lines");
        a.mover = ap("div", [
            f
        ], null, "position: relative");
        a.sizer = ap("div", [
            a.mover
        ], "CodeMirror-sizer");
        a.sizerWidth = null;
        a.heightForcer = ap("div", null, null, "position: absolute; height: " + ay + "px; width: 1px;");
        a.gutters = ap("div", null, "CodeMirror-gutters");
        a.lineGutter = null;
        a.scroller = ap("div", [
            a.sizer,
            a.heightForcer,
            a.gutters
        ], "CodeMirror-scroll");
        a.scroller.setAttribute("tabIndex", "-1");
        a.wrapper = ap("div", [
            a.scrollbarFiller,
            a.gutterFiller,
            a.scroller
        ], "CodeMirror");
        a.wrapper.setAttribute("translate", "no");
        if (t && P < 8) {
            a.gutters.style.zIndex = -1;
            a.scroller.style.paddingRight = 0;
        }
        if (!H && !(E && ag)) {
            a.scroller.draggable = true;
        }
        if (b) {
            if (b.appendChild) {
                b.appendChild(a.wrapper);
            } else {
                b(a.wrapper);
            }
        }
        a.viewFrom = a.viewTo = c.first;
        a.reportedViewFrom = a.reportedViewTo = c.first;
        a.view = [];
        a.renderedView = null;
        a.externalMeasured = null;
        a.viewOffset = 0;
        a.lastWrapHeight = a.lastWrapWidth = 0;
        a.updateLineNumbers = null;
        a.nativeBarWidth = a.barHeight = a.barWidth = 0;
        a.scrollbarsClipped = false;
        a.lineNumWidth = a.lineNumInnerWidth = a.lineNumChars = null;
        a.alignWidgets = false;
        a.cachedCharWidth = a.cachedTextHeight = a.cachedPaddingH = null;
        a.maxLine = null;
        a.maxLineLength = 0;
        a.maxLineChanged = false;
        a.wheelDX = a.wheelDY = a.wheelStartX = a.wheelStartY = null;
        a.shift = false;
        a.selForContextMenu = null;
        a.activeTouch = null;
        a.gutterSpecs = eJ(e.gutters, e.lineNumbers);
        eK(a);
        d.init(a);
    }
    var eN = 0, u = null;
    if (t) {
        u = -0.53;
    } else if (E) {
        u = 15;
    } else if (R) {
        u = -0.7;
    } else if (I) {
        u = -1 / 3;
    }
    function eO(a) {
        var c = a.wheelDeltaX, b = a.wheelDeltaY;
        if (c == null && a.detail && a.axis == a.HORIZONTAL_AXIS) {
            c = a.detail;
        }
        if (b == null && a.detail && a.axis == a.VERTICAL_AXIS) {
            b = a.detail;
        } else if (b == null) {
            b = a.wheelDelta;
        }
        return {
            x: c,
            y: b
        };
    }
    function eP(b) {
        var a = eO(b);
        a.x *= u;
        a.y *= u;
        return a;
    }
    function eQ(d, e) {
        var n = eO(e), f = n.x, a = n.y;
        var g = u;
        if (e.deltaMode === 0) {
            f = e.deltaX;
            a = e.deltaY;
            g = 1;
        }
        var b = d.display, c = b.scroller;
        var p = c.scrollWidth > c.clientWidth;
        var j = c.scrollHeight > c.clientHeight;
        if (!((f && p) || (a && j))) {
            return;
        }
        if (a && J && H) {
            outer: for(var h = e.target, o = b.view; h != c; h = h.parentNode){
                for(var k = 0; k < o.length; k++){
                    if (o[k].node == h) {
                        d.display.currentWheelTarget = h;
                        break outer;
                    }
                }
            }
        }
        if (f && !E && !x && g != null) {
            if (a && j) {
                ec(d, Math.max(0, c.scrollTop + a * g));
            }
            ee(d, Math.max(0, c.scrollLeft + f * g));
            if (!a || (a && j)) {
                a3(e);
            }
            b.wheelStartX = null;
            return;
        }
        if (a && g != null) {
            var l = a * g;
            var i = d.doc.scrollTop, m = i + b.wrapper.clientHeight;
            if (l < 0) {
                i = Math.max(0, i + l - 50);
            } else {
                m = Math.min(d.doc.height, m + l + 50);
            }
            eD(d, {
                top: i,
                bottom: m
            });
        }
        if (eN < 20 && e.deltaMode !== 0) {
            if (b.wheelStartX == null) {
                b.wheelStartX = c.scrollLeft;
                b.wheelStartY = c.scrollTop;
                b.wheelDX = f;
                b.wheelDY = a;
                setTimeout(function() {
                    if (b.wheelStartX == null) {
                        return;
                    }
                    var a = c.scrollLeft - b.wheelStartX;
                    var d = c.scrollTop - b.wheelStartY;
                    var e = (d && b.wheelDY && d / b.wheelDY) || (a && b.wheelDX && a / b.wheelDX);
                    b.wheelStartX = b.wheelStartY = null;
                    if (!e) {
                        return;
                    }
                    u = (u * eN + e) / (eN + 1);
                    ++eN;
                }, 200);
            } else {
                b.wheelDX += f;
                b.wheelDY += a;
            }
        }
    }
    var o = function(a, b) {
        this.ranges = a;
        this.primIndex = b;
    };
    o.prototype.primary = function() {
        return this.ranges[this.primIndex];
    };
    o.prototype.equals = function(a) {
        if (a == this) {
            return true;
        }
        if (a.primIndex != this.primIndex || a.ranges.length != this.ranges.length) {
            return false;
        }
        for(var b = 0; b < this.ranges.length; b++){
            var c = this.ranges[b], d = a.ranges[b];
            if (!bD(c.anchor, d.anchor) || !bD(c.head, d.head)) {
                return false;
            }
        }
        return true;
    };
    o.prototype.deepCopy = function() {
        var b = [];
        for(var a = 0; a < this.ranges.length; a++){
            b[a] = new A(bE(this.ranges[a].anchor), bE(this.ranges[a].head));
        }
        return new o(b, this.primIndex);
    };
    o.prototype.somethingSelected = function() {
        for(var a = 0; a < this.ranges.length; a++){
            if (!this.ranges[a].empty()) {
                return true;
            }
        }
        return false;
    };
    o.prototype.contains = function(c, b) {
        if (!b) {
            b = c;
        }
        for(var a = 0; a < this.ranges.length; a++){
            var d = this.ranges[a];
            if (bC(b, d.from()) >= 0 && bC(c, d.to()) <= 0) {
                return a;
            }
        }
        return -1;
    };
    var A = function(a, b) {
        this.anchor = a;
        this.head = b;
    };
    A.prototype.from = function() {
        return bG(this.anchor, this.head);
    };
    A.prototype.to = function() {
        return bF(this.anchor, this.head);
    };
    A.prototype.empty = function() {
        return (this.head.line == this.anchor.line && this.head.ch == this.anchor.ch);
    };
    function eR(f, a, e) {
        var k = f && f.options.selectionsMayTouch;
        var l = a[e];
        a.sort(function(a, b) {
            return bC(a.from(), b.from());
        });
        e = T(a, l);
        for(var b = 1; b < a.length; b++){
            var c = a[b], d = a[b - 1];
            var g = bC(d.to(), c.from());
            if (k && !c.empty() ? g > 0 : g >= 0) {
                var h = bG(d.from(), c.from()), i = bF(d.to(), c.to());
                var j = d.empty() ? c.from() == c.head : d.from() == d.head;
                if (b <= e) {
                    --e;
                }
                a.splice(--b, 2, new A(j ? i : h, j ? h : i));
            }
        }
        return new o(a, e);
    }
    function eS(a, b) {
        return new o([
            new A(a, b || a)
        ], 0);
    }
    function eT(a) {
        if (!a.text) {
            return a.to;
        }
        return bB(a.from.line + a.text.length - 1, aG(a.text).length + (a.text.length == 1 ? a.from.ch : 0));
    }
    function eU(b, a) {
        if (bC(b, a.from) < 0) {
            return b;
        }
        if (bC(b, a.to) <= 0) {
            return eT(a);
        }
        var d = b.line + a.text.length - (a.to.line - a.from.line) - 1, c = b.ch;
        if (b.line == a.to.line) {
            c += eT(a).ch - a.to.ch;
        }
        return bB(d, c);
    }
    function eV(a, c) {
        var d = [];
        for(var b = 0; b < a.sel.ranges.length; b++){
            var e = a.sel.ranges[b];
            d.push(new A(eU(e.anchor, c), eU(e.head, c)));
        }
        return eR(a.cm, d, a.sel.primIndex);
    }
    function eW(a, b, c) {
        if (a.line == b.line) {
            return bB(c.line, a.ch - b.ch + c.ch);
        } else {
            return bB(c.line + (a.line - b.line), a.ch);
        }
    }
    function eX(d, i, l) {
        var e = [];
        var b = bB(d.first, 0), f = b;
        for(var a = 0; a < i.length; a++){
            var g = i[a];
            var c = eW(g.from, b, f);
            var h = eW(eT(g), b, f);
            b = g.to;
            f = h;
            if (l == "around") {
                var j = d.sel.ranges[a], k = bC(j.head, j.anchor) < 0;
                e[a] = new A(k ? h : c, k ? c : h);
            } else {
                e[a] = new A(c, c);
            }
        }
        return new o(e, d.sel.primIndex);
    }
    function eY(a) {
        a.doc.mode = bn(a.options, a.doc.modeOption);
        eZ(a);
    }
    function eZ(a) {
        a.doc.iter(function(a) {
            if (a.stateAfter) {
                a.stateAfter = null;
            }
            if (a.styles) {
                a.styles = null;
            }
        });
        a.doc.modeFrontier = a.doc.highlightFrontier = a.doc.first;
        ew(a, 100);
        a.state.modeGen++;
        if (a.curOp) {
            dL(a);
        }
    }
    function e$(b, a) {
        return (a.from.ch == 0 && a.to.ch == 0 && aG(a.text) == "" && (!b.cm || b.cm.options.wholeLineUpdateBefore));
    }
    function e_(a, e, r, p) {
        function j(a) {
            return r ? r[a] : null;
        }
        function f(a, b, c) {
            ct(a, b, c, p);
            cM(a, "change", a, e);
        }
        function k(d, e) {
            var c = [];
            for(var a = d; a < e; ++a){
                c.push(new M(b[a], j(a), p));
            }
            return c;
        }
        var c = e.from, g = e.to, b = e.text;
        var d = bt(a, c.line), h = bt(a, g.line);
        var m = aG(b), l = j(b.length - 1), i = g.line - c.line;
        if (e.full) {
            a.insert(0, k(0, b.length));
            a.remove(b.length, a.size - b.length);
        } else if (e$(a, e)) {
            var n = k(0, b.length - 1);
            f(h, h.text, l);
            if (i) {
                a.remove(c.line, i);
            }
            if (n.length) {
                a.insert(c.line, n);
            }
        } else if (d == h) {
            if (b.length == 1) {
                f(d, d.text.slice(0, c.ch) + m + d.text.slice(g.ch), l);
            } else {
                var o = k(1, b.length - 1);
                o.push(new M(m + d.text.slice(g.ch), l, p));
                f(d, d.text.slice(0, c.ch) + b[0], j(0));
                a.insert(c.line + 1, o);
            }
        } else if (b.length == 1) {
            f(d, d.text.slice(0, c.ch) + b[0] + h.text.slice(g.ch), j(0));
            a.remove(c.line + 1, i);
        } else {
            f(d, d.text.slice(0, c.ch) + b[0], j(0));
            f(h, m + h.text.slice(g.ch), l);
            var q = k(1, b.length - 1);
            if (i > 1) {
                a.remove(c.line + 1, i - 1);
            }
            a.insert(c.line + 1, q);
        }
        cM(a, "change", a, e);
    }
    function e0(a, c, d) {
        function b(a, h, i) {
            if (a.linked) {
                for(var f = 0; f < a.linked.length; ++f){
                    var e = a.linked[f];
                    if (e.doc == h) {
                        continue;
                    }
                    var g = i && e.sharedHist;
                    if (d && !g) {
                        continue;
                    }
                    c(e.doc, g);
                    b(e.doc, a, g);
                }
            }
        }
        b(a, null, true);
    }
    function e1(a, b) {
        if (b.cm) {
            throw new Error("This document is already in use.");
        }
        a.doc = b;
        b.cm = a;
        dI(a);
        eY(a);
        e2(a);
        a.options.direction = b.direction;
        if (!a.options.lineWrapping) {
            cs(a);
        }
        a.options.mode = b.modeOption;
        dL(a);
    }
    function e2(a) {
        (a.doc.direction == "rtl" ? at : am)(a.display.lineDiv, "CodeMirror-rtl");
    }
    function e3(a) {
        et(a, function() {
            e2(a);
            dL(a);
        });
    }
    function e4(a) {
        this.done = [];
        this.undone = [];
        this.undoDepth = a ? a.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = a ? a.maxGeneration : 1;
    }
    function e5(b, a) {
        var c = {
            from: bE(a.from),
            to: eT(a),
            text: bu(b, a.from, a.to)
        };
        fc(b, c, a.from.line, a.to.line + 1);
        e0(b, function(b) {
            return fc(b, c, a.from.line, a.to.line + 1);
        }, true);
        return c;
    }
    function e6(a) {
        while(a.length){
            var b = aG(a);
            if (b.ranges) {
                a.pop();
            } else {
                break;
            }
        }
    }
    function e7(a, b) {
        if (b) {
            e6(a.done);
            return aG(a.done);
        } else if (a.done.length && !aG(a.done).ranges) {
            return aG(a.done);
        } else if (a.done.length > 1 && !a.done[a.done.length - 2].ranges) {
            a.done.pop();
            return aG(a.done);
        }
    }
    function e8(c, b, i, f) {
        var a = c.history;
        a.undone.length = 0;
        var g = +new Date(), d;
        var e;
        if ((a.lastOp == f || (a.lastOrigin == b.origin && b.origin && ((b.origin.charAt(0) == "+" && a.lastModTime > g - (c.cm ? c.cm.options.historyEventDelay : 500)) || b.origin.charAt(0) == "*"))) && (d = e7(a, a.lastOp == f))) {
            e = aG(d.changes);
            if (bC(b.from, b.to) == 0 && bC(b.from, e.to) == 0) {
                e.to = eT(b);
            } else {
                d.changes.push(e5(c, b));
            }
        } else {
            var h = aG(a.done);
            if (!h || !h.ranges) {
                fb(c.sel, a.done);
            }
            d = {
                changes: [
                    e5(c, b)
                ],
                generation: a.generation
            };
            a.done.push(d);
            while(a.done.length > a.undoDepth){
                a.done.shift();
                if (!a.done[0].ranges) {
                    a.done.shift();
                }
            }
        }
        a.done.push(i);
        a.generation = ++a.maxGeneration;
        a.lastModTime = a.lastSelTime = g;
        a.lastOp = a.lastSelOp = f;
        a.lastOrigin = a.lastSelOrigin = b.origin;
        if (!e) {
            a_(c, "historyAdded");
        }
    }
    function e9(a, e, b, c) {
        var d = e.charAt(0);
        return (d == "*" || (d == "+" && b.ranges.length == c.ranges.length && b.somethingSelected() == c.somethingSelected() && new Date() - a.history.lastSelTime <= (a.cm ? a.cm.options.historyEventDelay : 500)));
    }
    function fa(e, d, f, c) {
        var a = e.history, b = c && c.origin;
        if (f == a.lastSelOp || (b && a.lastSelOrigin == b && ((a.lastModTime == a.lastSelTime && a.lastOrigin == b) || e9(e, b, aG(a.done), d)))) {
            a.done[a.done.length - 1] = d;
        } else {
            fb(d, a.done);
        }
        a.lastSelTime = +new Date();
        a.lastSelOrigin = b;
        a.lastSelOp = f;
        if (c && c.clearRedo !== false) {
            e6(a.undone);
        }
    }
    function fb(b, c) {
        var a = aG(c);
        if (!(a && a.ranges && a.equals(b))) {
            c.push(b);
        }
    }
    function fc(a, b, c, d) {
        var e = b["spans_" + a.id], f = 0;
        a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function(c) {
            if (c.markedSpans) {
                (e || (e = b["spans_" + a.id] = {}))[f] = c.markedSpans;
            }
            ++f;
        });
    }
    function fd(b) {
        if (!b) {
            return null;
        }
        var a;
        for(var c = 0; c < b.length; ++c){
            if (b[c].marker.explicitlyCleared) {
                if (!a) {
                    a = b.slice(0, c);
                }
            } else if (a) {
                a.push(b[c]);
            }
        }
        return !a ? b : a.length ? a : null;
    }
    function fe(e, b) {
        var c = b["spans_" + e.id];
        if (!c) {
            return null;
        }
        var d = [];
        for(var a = 0; a < b.text.length; ++a){
            d.push(fd(c[a]));
        }
        return d;
    }
    function ff(h, i) {
        var a = fe(h, i);
        var e = b6(h, i);
        if (!a) {
            return e;
        }
        if (!e) {
            return a;
        }
        for(var b = 0; b < a.length; ++b){
            var d = a[b], c = e[b];
            if (d && c) {
                spans: for(var f = 0; f < c.length; ++f){
                    var j = c[f];
                    for(var g = 0; g < d.length; ++g){
                        if (d[g].marker == j.marker) {
                            continue spans;
                        }
                    }
                    d.push(j);
                }
            } else if (c) {
                a[b] = c;
            }
        }
        return a;
    }
    function fg(h, i, l) {
        var d = [];
        for(var e = 0; e < h.length; ++e){
            var b = h[e];
            if (b.ranges) {
                d.push(l ? o.prototype.deepCopy.call(b) : b);
                continue;
            }
            var j = b.changes, f = [];
            d.push({
                changes: f
            });
            for(var g = 0; g < j.length; ++g){
                var a = j[g], k = void 0;
                f.push({
                    from: a.from,
                    to: a.to,
                    text: a.text
                });
                if (i) {
                    for(var c in a){
                        if ((k = c.match(/^spans_(\d+)$/))) {
                            if (T(i, Number(k[1])) > -1) {
                                aG(f)[c] = a[c];
                                delete a[c];
                            }
                        }
                    }
                }
            }
        }
        return d;
    }
    function fh(e, a, b, f) {
        if (f) {
            var c = e.anchor;
            if (b) {
                var d = bC(a, c) < 0;
                if (d != bC(b, c) < 0) {
                    c = a;
                    a = b;
                } else if (d != bC(a, b) < 0) {
                    a = b;
                }
            }
            return new A(c, a);
        } else {
            return new A(b || a, a);
        }
    }
    function fi(a, c, d, e, b) {
        if (b == null) {
            b = a.cm && (a.cm.display.shift || a.extend);
        }
        fo(a, new o([
            fh(a.sel.primary(), c, d, b)
        ], 0), e);
    }
    function fj(a, d, e) {
        var c = [];
        var f = a.cm && (a.cm.display.shift || a.extend);
        for(var b = 0; b < a.sel.ranges.length; b++){
            c[b] = fh(a.sel.ranges[b], d[b], null, f);
        }
        var g = eR(a.cm, c, a.sel.primIndex);
        fo(a, g, e);
    }
    function fk(a, c, d, e) {
        var b = a.sel.ranges.slice(0);
        b[c] = d;
        fo(a, eR(a.cm, b, a.sel.primIndex), e);
    }
    function fl(a, b, c, d) {
        fo(a, eS(b, c), d);
    }
    function fm(a, c, d) {
        var b = {
            ranges: c.ranges,
            update: function(c) {
                this.ranges = [];
                for(var b = 0; b < c.length; b++){
                    this.ranges[b] = new A(bI(a, c[b].anchor), bI(a, c[b].head));
                }
            },
            origin: d && d.origin
        };
        a_(a, "beforeSelectionChange", a, b);
        if (a.cm) {
            a_(a.cm, "beforeSelectionChange", a.cm, b);
        }
        if (b.ranges != c.ranges) {
            return eR(a.cm, b.ranges, b.ranges.length - 1);
        } else {
            return c;
        }
    }
    function fn(a, b, d) {
        var c = a.history.done, e = aG(c);
        if (e && e.ranges) {
            c[c.length - 1] = b;
            fp(a, b, d);
        } else {
            fo(a, b, d);
        }
    }
    function fo(a, c, b) {
        fp(a, c, b);
        fa(a, a.sel, a.cm ? a.cm.curOp.id : NaN, b);
    }
    function fp(a, c, b) {
        if (a2(a, "beforeSelectionChange") || (a.cm && a2(a.cm, "beforeSelectionChange"))) {
            c = fm(a, c, b);
        }
        var d = (b && b.bias) || (bC(c.primary().head, a.sel.primary().head) < 0 ? -1 : 1);
        fq(a, fs(a, c, d, true));
        if (!(b && b.scroll === false) && a.cm && a.cm.getOption("readOnly") != "nocursor") {
            d7(a.cm);
        }
    }
    function fq(a, b) {
        if (b.equals(a.sel)) {
            return;
        }
        a.sel = b;
        if (a.cm) {
            a.cm.curOp.updateInput = 1;
            a.cm.curOp.selectionChanged = true;
            a1(a.cm);
        }
        cM(a, "cursorActivity", a);
    }
    function fr(a) {
        fq(a, fs(a, a.sel, null, false));
    }
    function fs(d, a, g, h) {
        var b;
        for(var c = 0; c < a.ranges.length; c++){
            var e = a.ranges[c];
            var f = a.ranges.length == d.sel.ranges.length && d.sel.ranges[c];
            var i = fu(d, e.anchor, f && f.anchor, g, h);
            var j = fu(d, e.head, f && f.head, g, h);
            if (b || i != e.anchor || j != e.head) {
                if (!b) {
                    b = a.ranges.slice(0, c);
                }
                b[c] = new A(i, j);
            }
        }
        return b ? eR(d.cm, b, a.primIndex) : a;
    }
    function ft(g, a, n, c, j) {
        var f = bt(g, a.line);
        if (f.markedSpans) {
            for(var i = 0; i < f.markedSpans.length; ++i){
                var e = f.markedSpans[i], b = e.marker;
                var k = "selectLeft" in b ? !b.selectLeft : b.inclusiveLeft;
                var l = "selectRight" in b ? !b.selectRight : b.inclusiveRight;
                if ((e.from == null || (k ? e.from <= a.ch : e.from < a.ch)) && (e.to == null || (l ? e.to >= a.ch : e.to > a.ch))) {
                    if (j) {
                        a_(b, "beforeCursorEnter");
                        if (b.explicitlyCleared) {
                            if (!f.markedSpans) {
                                break;
                            } else {
                                --i;
                                continue;
                            }
                        }
                    }
                    if (!b.atomic) {
                        continue;
                    }
                    if (n) {
                        var d = b.find(c < 0 ? 1 : -1), m = void 0;
                        if (c < 0 ? l : k) {
                            d = fv(g, d, -c, d && d.line == a.line ? f : null);
                        }
                        if (d && d.line == a.line && (m = bC(d, n)) && (c < 0 ? m < 0 : m > 0)) {
                            return ft(g, d, a, c, j);
                        }
                    }
                    var h = b.find(c < 0 ? -1 : 1);
                    if (c < 0 ? k : l) {
                        h = fv(g, h, c, h.line == a.line ? f : null);
                    }
                    return h ? ft(g, h, a, c, j) : null;
                }
            }
        }
        return a;
    }
    function fu(a, b, c, g, d) {
        var e = g || 1;
        var f = ft(a, b, c, e, d) || (!d && ft(a, b, c, e, true)) || ft(a, b, c, -e, d) || (!d && ft(a, b, c, -e, true));
        if (!f) {
            a.cantEdit = true;
            return bB(a.first, 0);
        }
        return f;
    }
    function fv(b, a, c, d) {
        if (c < 0 && a.ch == 0) {
            if (a.line > b.first) {
                return bI(b, bB(a.line - 1));
            } else {
                return null;
            }
        } else if (c > 0 && a.ch == (d || bt(b, a.line)).text.length) {
            if (a.line < b.first + b.size - 1) {
                return bB(a.line + 1, 0);
            } else {
                return null;
            }
        } else {
            return new bB(a.line, a.ch + c);
        }
    }
    function W(a) {
        a.setSelection(bB(a.firstLine(), 0), bB(a.lastLine()), aA);
    }
    function fw(b, c, d) {
        var a = {
            canceled: false,
            from: c.from,
            to: c.to,
            text: c.text,
            origin: c.origin,
            cancel: function() {
                return (a.canceled = true);
            }
        };
        if (d) {
            a.update = function(c, d, e, f) {
                if (c) {
                    a.from = bI(b, c);
                }
                if (d) {
                    a.to = bI(b, d);
                }
                if (e) {
                    a.text = e;
                }
                if (f !== undefined) {
                    a.origin = f;
                }
            };
        }
        a_(b, "beforeChange", b, a);
        if (b.cm) {
            a_(b.cm, "beforeChange", b.cm, a);
        }
        if (a.canceled) {
            if (b.cm) {
                b.cm.curOp.updateInput = 2;
            }
            return null;
        }
        return {
            from: a.from,
            to: a.to,
            text: a.text,
            origin: a.origin
        };
    }
    function fx(a, b, e) {
        if (a.cm) {
            if (!a.cm.curOp) {
                return eu(a.cm, fx)(a, b, e);
            }
            if (a.cm.state.suppressEdits) {
                return;
            }
        }
        if (a2(a, "beforeChange") || (a.cm && a2(a.cm, "beforeChange"))) {
            b = fw(a, b, true);
            if (!b) {
                return;
            }
        }
        var d = bY && !e && b8(a, b.from, b.to);
        if (d) {
            for(var c = d.length - 1; c >= 0; --c){
                fy(a, {
                    from: d[c].from,
                    to: d[c].to,
                    text: c ? [
                        ""
                    ] : b.text,
                    origin: b.origin
                });
            }
        } else {
            fy(a, b);
        }
    }
    function fy(b, a) {
        if (a.text.length == 1 && a.text[0] == "" && bC(a.from, a.to) == 0) {
            return;
        }
        var c = eV(b, a);
        e8(b, a, c, b.cm ? b.cm.curOp.id : NaN);
        fB(b, a, c, b6(b, a));
        var d = [];
        e0(b, function(b, c) {
            if (!c && T(d, b.history) == -1) {
                fG(b.history, a);
                d.push(b.history);
            }
            fB(b, a, null, b6(b, a));
        });
    }
    function fz(b, i, f) {
        var j = b.cm && b.cm.state.suppressEdits;
        if (j && !f) {
            return;
        }
        var c = b.history, a, k = b.sel;
        var d = i == "undo" ? c.done : c.undone, g = i == "undo" ? c.undone : c.done;
        var e = 0;
        for(; e < d.length; e++){
            a = d[e];
            if (f ? a.ranges && !a.equals(b.sel) : !a.ranges) {
                break;
            }
        }
        if (e == d.length) {
            return;
        }
        c.lastOrigin = c.lastSelOrigin = null;
        for(;;){
            a = d.pop();
            if (a.ranges) {
                fb(a, g);
                if (f && !a.equals(b.sel)) {
                    fo(b, a, {
                        clearRedo: false
                    });
                    return;
                }
                k = a;
            } else if (j) {
                d.push(a);
                return;
            } else {
                break;
            }
        }
        var m = [];
        fb(k, g);
        g.push({
            changes: m,
            generation: c.generation
        });
        c.generation = a.generation || ++c.maxGeneration;
        var o = a2(b, "beforeChange") || (b.cm && a2(b.cm, "beforeChange"));
        var n = function(e) {
            var c = a.changes[e];
            c.origin = i;
            if (o && !fw(b, c, false)) {
                d.length = 0;
                return {};
            }
            m.push(e5(b, c));
            var f = e ? eV(b, c) : aG(d);
            fB(b, c, f, ff(b, c));
            if (!e && b.cm) {
                b.cm.scrollIntoView({
                    from: c.from,
                    to: eT(c)
                });
            }
            var g = [];
            e0(b, function(a, b) {
                if (!b && T(g, a.history) == -1) {
                    fG(a.history, c);
                    g.push(a.history);
                }
                fB(a, c, null, ff(a, c));
            });
        };
        for(var h = a.changes.length - 1; h >= 0; --h){
            var l = n(h);
            if (l) return l.v;
        }
    }
    function fA(a, b) {
        if (b == 0) {
            return;
        }
        a.first += b;
        a.sel = new o(aH(a.sel.ranges, function(a) {
            return new A(bB(a.anchor.line + b, a.anchor.ch), bB(a.head.line + b, a.head.ch));
        }), a.sel.primIndex);
        if (a.cm) {
            dL(a.cm, a.first, a.first - b, b);
            for(var d = a.cm.display, c = d.viewFrom; c < d.viewTo; c++){
                dM(a.cm, c, "gutter");
            }
        }
    }
    function fB(b, a, c, d) {
        if (b.cm && !b.cm.curOp) {
            return eu(b.cm, fB)(b, a, c, d);
        }
        if (a.to.line < b.first) {
            fA(b, a.text.length - 1 - (a.to.line - a.from.line));
            return;
        }
        if (a.from.line > b.lastLine()) {
            return;
        }
        if (a.from.line < b.first) {
            var f = a.text.length - 1 - (b.first - a.from.line);
            fA(b, f);
            a = {
                from: bB(b.first, 0),
                to: bB(a.to.line + f, a.to.ch),
                text: [
                    aG(a.text)
                ],
                origin: a.origin
            };
        }
        var e = b.lastLine();
        if (a.to.line > e) {
            a = {
                from: a.from,
                to: bB(e, bt(b, e).text.length),
                text: [
                    a.text[0]
                ],
                origin: a.origin
            };
        }
        a.removed = bu(b, a.from, a.to);
        if (!c) {
            c = eV(b, a);
        }
        if (b.cm) {
            fC(b.cm, a, d);
        } else {
            e_(b, a, d);
        }
        fp(b, c, aA);
        if (b.cantEdit && fu(b, bB(b.firstLine(), 0))) {
            b.cantEdit = false;
        }
    }
    function fC(a, b, j) {
        var d = a.doc, m = a.display, c = b.from, e = b.to;
        var k = false, f = c.line;
        if (!a.options.lineWrapping) {
            f = bx(cj(bt(d, c.line)));
            d.iter(f, e.line + 1, function(a) {
                if (a == m.maxLine) {
                    k = true;
                    return true;
                }
            });
        }
        if (d.sel.contains(b.from, b.to) > -1) {
            a1(a);
        }
        e_(d, b, j, dH(a));
        if (!a.options.lineWrapping) {
            d.iter(f, c.line + b.text.length, function(a) {
                var b = cr(a);
                if (b > m.maxLineLength) {
                    m.maxLine = a;
                    m.maxLineLength = b;
                    m.maxLineChanged = true;
                    k = false;
                }
            });
            if (k) {
                a.curOp.updateMaxLine = true;
            }
        }
        bX(d, c.line);
        ew(a, 400);
        var l = b.text.length - (e.line - c.line) - 1;
        if (b.full) {
            dL(a);
        } else if (c.line == e.line && b.text.length == 1 && !e$(a.doc, b)) {
            dM(a, c.line, "text");
        } else {
            dL(a, c.line, e.line + 1, l);
        }
        var g = a2(a, "changes"), h = a2(a, "change");
        if (h || g) {
            var i = {
                from: c,
                to: e,
                text: b.text,
                removed: b.removed,
                origin: b.origin
            };
            if (h) {
                cM(a, "change", a, i);
            }
            if (g) {
                (a.curOp.changeObjs || (a.curOp.changeObjs = [])).push(i);
            }
        }
        a.display.selForContextMenu = null;
    }
    function fD(e, c, b, a, f) {
        var d;
        if (!a) {
            a = b;
        }
        if (bC(a, b) < 0) {
            (d = [
                a,
                b
            ]), (b = d[0]), (a = d[1]);
        }
        if (typeof c == "string") {
            c = e.splitLines(c);
        }
        fx(e, {
            from: b,
            to: a,
            text: c,
            origin: f
        });
    }
    function fE(a, b, c, d) {
        if (c < a.line) {
            a.line += d;
        } else if (b < a.line) {
            a.line = b;
            a.ch = 0;
        }
    }
    function fF(d, g, h, e) {
        for(var c = 0; c < d.length; ++c){
            var a = d[c], j = true;
            if (a.ranges) {
                if (!a.copied) {
                    a = d[c] = a.deepCopy();
                    a.copied = true;
                }
                for(var f = 0; f < a.ranges.length; f++){
                    fE(a.ranges[f].anchor, g, h, e);
                    fE(a.ranges[f].head, g, h, e);
                }
                continue;
            }
            for(var i = 0; i < a.changes.length; ++i){
                var b = a.changes[i];
                if (h < b.from.line) {
                    b.from = bB(b.from.line + e, b.from.ch);
                    b.to = bB(b.to.line + e, b.to.ch);
                } else if (g <= b.to.line) {
                    j = false;
                    break;
                }
            }
            if (!j) {
                d.splice(0, c + 1);
                c = 0;
            }
        }
    }
    function fG(d, a) {
        var b = a.from.line, c = a.to.line, e = a.text.length - (c - b) - 1;
        fF(d.done, b, c, e);
        fF(d.undone, b, c, e);
    }
    function fH(b, a, e, f) {
        var c = a, d = a;
        if (typeof a == "number") {
            d = bt(b, bH(b, a));
        } else {
            c = bx(a);
        }
        if (c == null) {
            return null;
        }
        if (f(d, c) && b.cm) {
            dM(b.cm, c, e);
        }
        return d;
    }
    function X(a) {
        this.lines = a;
        this.parent = null;
        var c = 0;
        for(var b = 0; b < a.length; ++b){
            a[b].parent = this;
            c += a[b].height;
        }
        this.height = c;
    }
    X.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        removeInner: function(a, d) {
            for(var b = a, e = a + d; b < e; ++b){
                var c = this.lines[b];
                this.height -= c.height;
                cu(c);
                cM(c, "delete");
            }
            this.lines.splice(a, d);
        },
        collapse: function(a) {
            a.push.apply(a, this.lines);
        },
        insertInner: function(c, a, d) {
            this.height += d;
            this.lines = this.lines.slice(0, c).concat(a).concat(this.lines.slice(c));
            for(var b = 0; b < a.length; ++b){
                a[b].parent = this;
            }
        },
        iterN: function(a, b, c) {
            for(var d = a + b; a < d; ++a){
                if (c(this.lines[a])) {
                    return true;
                }
            }
        }
    };
    function O(a) {
        this.children = a;
        var d = 0, e = 0;
        for(var b = 0; b < a.length; ++b){
            var c = a[b];
            d += c.chunkSize();
            e += c.height;
            c.parent = this;
        }
        this.size = d;
        this.height = e;
        this.parent = null;
    }
    O.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(a, c) {
            this.size -= c;
            for(var d = 0; d < this.children.length; ++d){
                var b = this.children[d], e = b.chunkSize();
                if (a < e) {
                    var f = Math.min(c, e - a), h = b.height;
                    b.removeInner(a, f);
                    this.height -= h - b.height;
                    if (e == f) {
                        this.children.splice(d--, 1);
                        b.parent = null;
                    }
                    if ((c -= f) == 0) {
                        break;
                    }
                    a = 0;
                } else {
                    a -= e;
                }
            }
            if (this.size - c < 25 && (this.children.length > 1 || !(this.children[0] instanceof X))) {
                var g = [];
                this.collapse(g);
                this.children = [
                    new X(g)
                ];
                this.children[0].parent = this;
            }
        },
        collapse: function(b) {
            for(var a = 0; a < this.children.length; ++a){
                this.children[a].collapse(b);
            }
        },
        insertInner: function(c, f, g) {
            this.size += f.length;
            this.height += g;
            for(var b = 0; b < this.children.length; ++b){
                var a = this.children[b], h = a.chunkSize();
                if (c <= h) {
                    a.insertInner(c, f, g);
                    if (a.lines && a.lines.length > 50) {
                        var i = (a.lines.length % 25) + 25;
                        for(var d = i; d < a.lines.length;){
                            var e = new X(a.lines.slice(d, (d += 25)));
                            a.height -= e.height;
                            this.children.splice(++b, 0, e);
                            e.parent = this;
                        }
                        a.lines = a.lines.slice(0, i);
                        this.maybeSpill();
                    }
                    break;
                }
                c -= h;
            }
        },
        maybeSpill: function() {
            if (this.children.length <= 10) {
                return;
            }
            var a = this;
            do {
                var d = a.children.splice(a.children.length - 5, 5);
                var b = new O(d);
                if (!a.parent) {
                    var c = new O(a.children);
                    c.parent = a;
                    a.children = [
                        c,
                        b
                    ];
                    a = c;
                } else {
                    a.size -= b.size;
                    a.height -= b.height;
                    var e = T(a.parent.children, a);
                    a.parent.children.splice(e + 1, 0, b);
                }
                b.parent = a.parent;
            }while (a.children.length > 10)
            a.parent.maybeSpill();
        },
        iterN: function(a, d, g) {
            for(var b = 0; b < this.children.length; ++b){
                var e = this.children[b], c = e.chunkSize();
                if (a < c) {
                    var f = Math.min(d, c - a);
                    if (e.iterN(a, f, g)) {
                        return true;
                    }
                    if ((d -= f) == 0) {
                        break;
                    }
                    a = 0;
                } else {
                    a -= c;
                }
            }
        }
    };
    var B = function(c, d, a) {
        if (a) {
            for(var b in a){
                if (a.hasOwnProperty(b)) {
                    this[b] = a[b];
                }
            }
        }
        this.doc = c;
        this.node = d;
    };
    B.prototype.clear = function() {
        var b = this.doc.cm, a = this.line.widgets, c = this.line, e = bx(c);
        if (e == null || !a) {
            return;
        }
        for(var d = 0; d < a.length; ++d){
            if (a[d] == this) {
                a.splice(d--, 1);
            }
        }
        if (!a.length) {
            c.widgets = null;
        }
        var f = c$(this);
        bw(c, Math.max(0, c.height - f));
        if (b) {
            et(b, function() {
                fI(b, c, -f);
                dM(b, e, "widget");
            });
            cM(b, "lineWidgetCleared", b, this, e);
        }
    };
    B.prototype.changed = function() {
        var e = this;
        var d = this.height, b = this.doc.cm, a = this.line;
        this.height = null;
        var c = c$(this) - d;
        if (!c) {
            return;
        }
        if (!co(this.doc, a)) {
            bw(a, a.height + c);
        }
        if (b) {
            et(b, function() {
                b.curOp.forceUpdate = true;
                fI(b, a, c);
                cM(b, "lineWidgetChanged", b, e, bx(a));
            });
        }
    };
    l(B);
    function fI(a, b, c) {
        if (cq(b) < ((a.curOp && a.curOp.scrollTop) || a.doc.scrollTop)) {
            d6(a, c);
        }
    }
    function fJ(c, b, e, f) {
        var d = new B(c, e, f);
        var a = c.cm;
        if (a && d.noHScroll) {
            a.display.alignWidgets = true;
        }
        fH(c, b, "widget", function(b) {
            var e = b.widgets || (b.widgets = []);
            if (d.insertAt == null) {
                e.push(d);
            } else {
                e.splice(Math.min(e.length, Math.max(0, d.insertAt)), 0, d);
            }
            d.line = b;
            if (a && !co(c, b)) {
                var f = cq(b) < c.scrollTop;
                bw(b, b.height + c$(d));
                if (f) {
                    d6(a, d.height);
                }
                a.curOp.forceUpdate = true;
            }
            return true;
        });
        if (a) {
            cM(a, "lineWidgetAdded", a, d, typeof b == "number" ? b : bx(b));
        }
        return d;
    }
    var fK = 0;
    var k = function(a, b) {
        this.lines = [];
        this.type = b;
        this.doc = a;
        this.id = ++fK;
    };
    k.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        var a = this.doc.cm, i = a && !a.curOp;
        if (i) {
            el(a);
        }
        if (a2(this, "clear")) {
            var e = this.find();
            if (e) {
                cM(this, "clear", e.from, e.to);
            }
        }
        var c = null, f = null;
        for(var g = 0; g < this.lines.length; ++g){
            var b = this.lines[g];
            var d = b1(b.markedSpans, this);
            if (a && !this.collapsed) {
                dM(a, bx(b), "text");
            } else if (a) {
                if (d.to != null) {
                    f = bx(b);
                }
                if (d.from != null) {
                    c = bx(b);
                }
            }
            b.markedSpans = b2(b.markedSpans, d);
            if (d.from == null && this.collapsed && !co(this.doc, b) && a) {
                bw(b, dD(a.display));
            }
        }
        if (a && this.collapsed && !a.options.lineWrapping) {
            for(var h = 0; h < this.lines.length; ++h){
                var j = cj(this.lines[h]), k = cr(j);
                if (k > a.display.maxLineLength) {
                    a.display.maxLine = j;
                    a.display.maxLineLength = k;
                    a.display.maxLineChanged = true;
                }
            }
        }
        if (c != null && a && this.collapsed) {
            dL(a, c, f + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (a) {
                fr(a.doc);
            }
        }
        if (a) {
            cM(a, "markerCleared", a, this, c, f);
        }
        if (i) {
            em(a);
        }
        if (this.parent) {
            this.parent.clear();
        }
    };
    k.prototype.find = function(b, g) {
        if (b == null && this.type == "bookmark") {
            b = 1;
        }
        var c, e;
        for(var f = 0; f < this.lines.length; ++f){
            var a = this.lines[f];
            var d = b1(a.markedSpans, this);
            if (d.from != null) {
                c = bB(g ? a : bx(a), d.from);
                if (b == -1) {
                    return c;
                }
            }
            if (d.to != null) {
                e = bB(g ? a : bx(a), d.to);
                if (b == 1) {
                    return e;
                }
            }
        }
        return c && {
            from: c,
            to: e
        };
    };
    k.prototype.changed = function() {
        var c = this;
        var b = this.find(-1, true), d = this, a = this.doc.cm;
        if (!b || !a) {
            return;
        }
        et(a, function() {
            var e = b.line, h = bx(b.line);
            var f = da(a, h);
            if (f) {
                di(f);
                a.curOp.selectionChanged = a.curOp.forceUpdate = true;
            }
            a.curOp.updateMaxLine = true;
            if (!co(d.doc, e) && d.height != null) {
                var i = d.height;
                d.height = null;
                var g = c$(d) - i;
                if (g) {
                    bw(e, e.height + g);
                }
            }
            cM(a, "markerChanged", a, c);
        });
    };
    k.prototype.attachLine = function(b) {
        if (!this.lines.length && this.doc.cm) {
            var a = this.doc.cm.curOp;
            if (!a.maybeHiddenMarkers || T(a.maybeHiddenMarkers, this) == -1) {
                (a.maybeUnhiddenMarkers || (a.maybeUnhiddenMarkers = [])).push(this);
            }
        }
        this.lines.push(b);
    };
    k.prototype.detachLine = function(b) {
        this.lines.splice(T(this.lines, b), 1);
        if (!this.lines.length && this.doc.cm) {
            var a = this.doc.cm.curOp;
            (a.maybeHiddenMarkers || (a.maybeHiddenMarkers = [])).push(this);
        }
    };
    l(k);
    function fL(b, c, d, e, g) {
        if (e && e.shared) {
            return fM(b, c, d, e, g);
        }
        if (b.cm && !b.cm.curOp) {
            return eu(b.cm, fL)(b, c, d, e, g);
        }
        var a = new k(b, g), i = bC(c, d);
        if (e) {
            aw(e, a, false);
        }
        if (i > 0 || (i == 0 && a.clearWhenEmpty !== false)) {
            return a;
        }
        if (a.replacedWith) {
            a.collapsed = true;
            a.widgetNode = aq("span", [
                a.replacedWith
            ], "CodeMirror-widget");
            if (!e.handleMouseEvents) {
                a.widgetNode.setAttribute("cm-ignore-events", "true");
            }
            if (e.insertLeft) {
                a.widgetNode.insertLeft = true;
            }
        }
        if (a.collapsed) {
            if (ci(b, c.line, c, d, a) || (c.line != d.line && ci(b, d.line, c, d, a))) {
                throw new Error("Inserting collapsed marker partially overlapping an existing one");
            }
            b_();
        }
        if (a.addToHistory) {
            e8(b, {
                from: c,
                to: d,
                origin: "markText"
            }, b.sel, NaN);
        }
        var j = c.line, f = b.cm, l;
        b.iter(j, d.line + 1, function(e) {
            if (f && a.collapsed && !f.options.lineWrapping && cj(e) == f.display.maxLine) {
                l = true;
            }
            if (a.collapsed && j != c.line) {
                bw(e, 0);
            }
            b3(e, new b0(a, j == c.line ? c.ch : null, j == d.line ? d.ch : null), b.cm && b.cm.curOp);
            ++j;
        });
        if (a.collapsed) {
            b.iter(c.line, d.line + 1, function(a) {
                if (co(b, a)) {
                    bw(a, 0);
                }
            });
        }
        if (a.clearOnEnter) {
            aY(a, "beforeCursorEnter", function() {
                return a.clear();
            });
        }
        if (a.readOnly) {
            b$();
            if (b.history.done.length || b.history.undone.length) {
                b.clearHistory();
            }
        }
        if (a.collapsed) {
            a.id = ++fK;
            a.atomic = true;
        }
        if (f) {
            if (l) {
                f.curOp.updateMaxLine = true;
            }
            if (a.collapsed) {
                dL(f, c.line, d.line + 1);
            } else if (a.className || a.startStyle || a.endStyle || a.css || a.attributes || a.title) {
                for(var h = c.line; h <= d.line; h++){
                    dM(f, h, "text");
                }
            }
            if (a.atomic) {
                fr(f.doc);
            }
            cM(f, "markerAdded", f, a);
        }
        return a;
    }
    var C = function(a, c) {
        this.markers = a;
        this.primary = c;
        for(var b = 0; b < a.length; ++b){
            a[b].parent = this;
        }
    };
    C.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        this.explicitlyCleared = true;
        for(var a = 0; a < this.markers.length; ++a){
            this.markers[a].clear();
        }
        cM(this, "clear");
    };
    C.prototype.find = function(a, b) {
        return this.primary.find(a, b);
    };
    l(C);
    function fM(b, d, e, a, f) {
        a = aw(a);
        a.shared = false;
        var c = [
            fL(b, d, e, a, f)
        ], g = c[0];
        var h = a.widgetNode;
        e0(b, function(b) {
            if (h) {
                a.widgetNode = h.cloneNode(true);
            }
            c.push(fL(b, bI(b, d), bI(b, e), a, f));
            for(var i = 0; i < b.linked.length; ++i){
                if (b.linked[i].isParent) {
                    return;
                }
            }
            g = aG(c);
        });
        return new C(c, g);
    }
    function fN(a) {
        return a.findMarks(bB(a.first, 0), a.clipPos(bB(a.lastLine())), function(a) {
            return a.parent;
        });
    }
    function fO(b, d) {
        for(var c = 0; c < d.length; c++){
            var a = d[c], e = a.find();
            var f = b.clipPos(e.from), g = b.clipPos(e.to);
            if (bC(f, g)) {
                var h = fL(b, f, g, a.primary, a.primary.type);
                a.markers.push(h);
                h.parent = a;
            }
        }
    }
    function fP(b) {
        var c = function(e) {
            var a = b[e], f = [
                a.primary.doc
            ];
            e0(a.primary.doc, function(a) {
                return f.push(a);
            });
            for(var c = 0; c < a.markers.length; c++){
                var d = a.markers[c];
                if (T(f, d.doc) == -1) {
                    d.parent = null;
                    a.markers.splice(c--, 1);
                }
            }
        };
        for(var a = 0; a < b.length; a++)c(a);
    }
    var fQ = 0;
    var g = function(b, d, a, e, f) {
        if (!(this instanceof g)) {
            return new g(b, d, a, e, f);
        }
        if (a == null) {
            a = 0;
        }
        O.call(this, [
            new X([
                new M("", null)
            ])
        ]);
        this.first = a;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = a;
        var c = bB(a, 0);
        this.sel = eS(c);
        this.history = new e4(null);
        this.id = ++fQ;
        this.modeOption = d;
        this.lineSep = e;
        this.direction = f == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof b == "string") {
            b = this.splitLines(b);
        }
        e_(this, {
            from: c,
            to: c,
            text: b
        });
        fo(this, eS(c), aA);
    };
    g.prototype = U(O.prototype, {
        constructor: g,
        iter: function(a, c, b) {
            if (b) {
                this.iterN(a - this.first, c - a, b);
            } else {
                this.iterN(this.first, this.first + this.size, a);
            }
        },
        insert: function(d, a) {
            var c = 0;
            for(var b = 0; b < a.length; ++b){
                c += a[b].height;
            }
            this.insertInner(d - this.first, a, c);
        },
        remove: function(a, b) {
            this.removeInner(a - this.first, b);
        },
        getValue: function(a) {
            var b = bv(this, this.first, this.first + this.size);
            if (a === false) {
                return b;
            }
            return b.join(a || this.lineSeparator());
        },
        setValue: c(function(c) {
            var a = bB(this.first, 0), b = this.first + this.size - 1;
            fx(this, {
                from: a,
                to: bB(b, bt(this, b).text.length),
                text: this.splitLines(c),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) {
                d8(this.cm, 0, 0);
            }
            fo(this, eS(a), aA);
        }),
        replaceRange: function(c, a, b, d) {
            a = bI(this, a);
            b = b ? bI(this, b) : a;
            fD(this, c, a, b, d);
        },
        getRange: function(c, d, a) {
            var b = bu(this, bI(this, c), bI(this, d));
            if (a === false) {
                return b;
            }
            if (a === "") {
                return b.join("");
            }
            return b.join(a || this.lineSeparator());
        },
        getLine: function(b) {
            var a = this.getLineHandle(b);
            return a && a.text;
        },
        getLineHandle: function(a) {
            if (bz(this, a)) {
                return bt(this, a);
            }
        },
        getLineNumber: function(a) {
            return bx(a);
        },
        getLineHandleVisualStart: function(a) {
            if (typeof a == "number") {
                a = bt(this, a);
            }
            return cj(a);
        },
        lineCount: function() {
            return this.size;
        },
        firstLine: function() {
            return this.first;
        },
        lastLine: function() {
            return this.first + this.size - 1;
        },
        clipPos: function(a) {
            return bI(this, a);
        },
        getCursor: function(a) {
            var c = this.sel.primary(), b;
            if (a == null || a == "head") {
                b = c.head;
            } else if (a == "anchor") {
                b = c.anchor;
            } else if (a == "end" || a == "to" || a === false) {
                b = c.to();
            } else {
                b = c.from();
            }
            return b;
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: c(function(a, b, c) {
            fl(this, bI(this, typeof a == "number" ? bB(a, b || 0) : a), null, c);
        }),
        setSelection: c(function(a, b, c) {
            fl(this, bI(this, a), bI(this, b || a), c);
        }),
        extendSelection: c(function(b, a, c) {
            fi(this, bI(this, b), a && bI(this, a), c);
        }),
        extendSelections: c(function(a, b) {
            fj(this, bK(this, a), b);
        }),
        extendSelectionsBy: c(function(a, b) {
            var c = aH(this.sel.ranges, a);
            fj(this, bK(this, c), b);
        }),
        setSelections: c(function(a, c, e) {
            if (!a.length) {
                return;
            }
            var d = [];
            for(var b = 0; b < a.length; b++){
                d[b] = new A(bI(this, a[b].anchor), bI(this, a[b].head || a[b].anchor));
            }
            if (c == null) {
                c = Math.min(a.length - 1, this.sel.primIndex);
            }
            fo(this, eR(this.cm, d, c), e);
        }),
        addSelection: c(function(b, c, d) {
            var a = this.sel.ranges.slice(0);
            a.push(new A(bI(this, b), bI(this, c || b)));
            fo(this, eR(this.cm, a, a.length - 1), d);
        }),
        getSelection: function(d) {
            var c = this.sel.ranges, a;
            for(var b = 0; b < c.length; b++){
                var e = bu(this, c[b].from(), c[b].to());
                a = a ? a.concat(e) : e;
            }
            if (d === false) {
                return a;
            } else {
                return a.join(d || this.lineSeparator());
            }
        },
        getSelections: function(d) {
            var e = [], b = this.sel.ranges;
            for(var a = 0; a < b.length; a++){
                var c = bu(this, b[a].from(), b[a].to());
                if (d !== false) {
                    c = c.join(d || this.lineSeparator());
                }
                e[a] = c;
            }
            return e;
        },
        replaceSelection: function(c, d, e) {
            var b = [];
            for(var a = 0; a < this.sel.ranges.length; a++){
                b[a] = c;
            }
            this.replaceSelections(b, d, e || "+input");
        },
        replaceSelections: c(function(h, c, i) {
            var b = [], e = this.sel;
            for(var a = 0; a < e.ranges.length; a++){
                var f = e.ranges[a];
                b[a] = {
                    from: f.from(),
                    to: f.to(),
                    text: this.splitLines(h[a]),
                    origin: i
                };
            }
            var g = c && c != "end" && eX(this, b, c);
            for(var d = b.length - 1; d >= 0; d--){
                fx(this, b[d]);
            }
            if (g) {
                fn(this, g);
            } else if (this.cm) {
                d7(this.cm);
            }
        }),
        undo: c(function() {
            fz(this, "undo");
        }),
        redo: c(function() {
            fz(this, "redo");
        }),
        undoSelection: c(function() {
            fz(this, "undo", true);
        }),
        redoSelection: c(function() {
            fz(this, "redo", true);
        }),
        setExtending: function(a) {
            this.extend = a;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            var a = this.history, d = 0, e = 0;
            for(var b = 0; b < a.done.length; b++){
                if (!a.done[b].ranges) {
                    ++d;
                }
            }
            for(var c = 0; c < a.undone.length; c++){
                if (!a.undone[c].ranges) {
                    ++e;
                }
            }
            return {
                undo: d,
                redo: e
            };
        },
        clearHistory: function() {
            var a = this;
            this.history = new e4(this.history);
            e0(this, function(b) {
                return (b.history = a.history);
            }, true);
        },
        markClean: function() {
            this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function(a) {
            if (a) {
                this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            }
            return this.history.generation;
        },
        isClean: function(a) {
            return this.history.generation == (a || this.cleanGeneration);
        },
        getHistory: function() {
            return {
                done: fg(this.history.done),
                undone: fg(this.history.undone)
            };
        },
        setHistory: function(a) {
            var b = (this.history = new e4(this.history));
            b.done = fg(a.done.slice(0), null, true);
            b.undone = fg(a.undone.slice(0), null, true);
        },
        setGutterMarker: c(function(a, b, c) {
            return fH(this, a, "gutter", function(a) {
                var d = a.gutterMarkers || (a.gutterMarkers = {});
                d[b] = c;
                if (!c && aN(d)) {
                    a.gutterMarkers = null;
                }
                return true;
            });
        }),
        clearGutter: c(function(a) {
            var b = this;
            this.iter(function(c) {
                if (c.gutterMarkers && c.gutterMarkers[a]) {
                    fH(b, c, "gutter", function() {
                        c.gutterMarkers[a] = null;
                        if (aN(c.gutterMarkers)) {
                            c.gutterMarkers = null;
                        }
                        return true;
                    });
                }
            });
        }),
        lineInfo: function(a) {
            var b;
            if (typeof a == "number") {
                if (!bz(this, a)) {
                    return null;
                }
                b = a;
                a = bt(this, a);
                if (!a) {
                    return null;
                }
            } else {
                b = bx(a);
                if (b == null) {
                    return null;
                }
            }
            return {
                line: b,
                handle: a,
                text: a.text,
                gutterMarkers: a.gutterMarkers,
                textClass: a.textClass,
                bgClass: a.bgClass,
                wrapClass: a.wrapClass,
                widgets: a.widgets
            };
        },
        addLineClass: c(function(a, b, c) {
            return fH(this, a, b == "gutter" ? "gutter" : "class", function(a) {
                var d = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass";
                if (!a[d]) {
                    a[d] = c;
                } else if (al(c).test(a[d])) {
                    return false;
                } else {
                    a[d] += " " + c;
                }
                return true;
            });
        }),
        removeLineClass: c(function(a, b, c) {
            return fH(this, a, b == "gutter" ? "gutter" : "class", function(e) {
                var f = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass";
                var a = e[f];
                if (!a) {
                    return false;
                } else if (c == null) {
                    e[f] = null;
                } else {
                    var d = a.match(al(c));
                    if (!d) {
                        return false;
                    }
                    var g = d.index + d[0].length;
                    e[f] = a.slice(0, d.index) + (!d.index || g == a.length ? "" : " ") + a.slice(g) || null;
                }
                return true;
            });
        }),
        addLineWidget: c(function(a, b, c) {
            return fJ(this, a, b, c);
        }),
        removeLineWidget: function(a) {
            a.clear();
        },
        markText: function(b, c, a) {
            return fL(this, bI(this, b), bI(this, c), a, (a && a.type) || "range");
        },
        setBookmark: function(b, a) {
            var c = {
                replacedWith: a && (a.nodeType == null ? a.widget : a),
                insertLeft: a && a.insertLeft,
                clearWhenEmpty: false,
                shared: a && a.shared,
                handleMouseEvents: a && a.handleMouseEvents
            };
            b = bI(this, b);
            return fL(this, b, b, c, "bookmark");
        },
        findMarksAt: function(b) {
            b = bI(this, b);
            var e = [], c = bt(this, b.line).markedSpans;
            if (c) {
                for(var d = 0; d < c.length; ++d){
                    var a = c[d];
                    if ((a.from == null || a.from <= b.ch) && (a.to == null || a.to >= b.ch)) {
                        e.push(a.marker.parent || a.marker);
                    }
                }
            }
            return e;
        },
        findMarks: function(a, b, d) {
            a = bI(this, a);
            b = bI(this, b);
            var c = [], e = a.line;
            this.iter(a.line, b.line + 1, function(i) {
                var g = i.markedSpans;
                if (g) {
                    for(var h = 0; h < g.length; h++){
                        var f = g[h];
                        if (!((f.to != null && e == a.line && a.ch >= f.to) || (f.from == null && e != a.line) || (f.from != null && e == b.line && f.from >= b.ch)) && (!d || d(f.marker))) {
                            c.push(f.marker.parent || f.marker);
                        }
                    }
                }
                ++e;
            });
            return c;
        },
        getAllMarks: function() {
            var a = [];
            this.iter(function(d) {
                var b = d.markedSpans;
                if (b) {
                    for(var c = 0; c < b.length; ++c){
                        if (b[c].from != null) {
                            a.push(b[c].marker);
                        }
                    }
                }
            });
            return a;
        },
        posFromIndex: function(c) {
            var a, b = this.first, d = this.lineSeparator().length;
            this.iter(function(f) {
                var e = f.text.length + d;
                if (e > c) {
                    a = c;
                    return true;
                }
                c -= e;
                ++b;
            });
            return bI(this, bB(b, a));
        },
        indexFromPos: function(a) {
            a = bI(this, a);
            var b = a.ch;
            if (a.line < this.first || a.ch < 0) {
                return 0;
            }
            var c = this.lineSeparator().length;
            this.iter(this.first, a.line, function(a) {
                b += a.text.length + c;
            });
            return b;
        },
        copy: function(b) {
            var a = new g(bv(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            a.scrollTop = this.scrollTop;
            a.scrollLeft = this.scrollLeft;
            a.sel = this.sel;
            a.extend = false;
            if (b) {
                a.history.undoDepth = this.history.undoDepth;
                a.setHistory(this.getHistory());
            }
            return a;
        },
        linkedDoc: function(a) {
            if (!a) {
                a = {};
            }
            var c = this.first, d = this.first + this.size;
            if (a.from != null && a.from > c) {
                c = a.from;
            }
            if (a.to != null && a.to < d) {
                d = a.to;
            }
            var b = new g(bv(this, c, d), a.mode || this.modeOption, c, this.lineSep, this.direction);
            if (a.sharedHist) {
                b.history = this.history;
            }
            (this.linked || (this.linked = [])).push({
                doc: b,
                sharedHist: a.sharedHist
            });
            b.linked = [
                {
                    doc: this,
                    isParent: true,
                    sharedHist: a.sharedHist
                }, 
            ];
            fO(b, fN(this));
            return b;
        },
        unlinkDoc: function(a) {
            if (a instanceof e) {
                a = a.doc;
            }
            if (this.linked) {
                for(var b = 0; b < this.linked.length; ++b){
                    var d = this.linked[b];
                    if (d.doc != a) {
                        continue;
                    }
                    this.linked.splice(b, 1);
                    a.unlinkDoc(this);
                    fP(fN(this));
                    break;
                }
            }
            if (a.history == this.history) {
                var c = [
                    a.id
                ];
                e0(a, function(a) {
                    return c.push(a.id);
                }, true);
                a.history = new e4(null);
                a.history.done = fg(this.history.done, c);
                a.history.undone = fg(this.history.undone, c);
            }
        },
        iterLinkedDocs: function(a) {
            e0(this, a);
        },
        getMode: function() {
            return this.mode;
        },
        getEditor: function() {
            return this.cm;
        },
        splitLines: function(a) {
            if (this.lineSep) {
                return a.split(this.lineSep);
            }
            return be(a);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: c(function(a) {
            if (a != "rtl") {
                a = "ltr";
            }
            if (a == this.direction) {
                return;
            }
            this.direction = a;
            this.iter(function(a) {
                return (a.order = null);
            });
            if (this.cm) {
                e3(this.cm);
            }
        })
    });
    g.prototype.eachLine = g.prototype.iter;
    var fR = 0;
    function fS(b) {
        var a = this;
        fV(a);
        if (a0(a, b) || c_(a.display, b)) {
            return;
        }
        a3(b);
        if (t) {
            fR = +new Date();
        }
        var e = dJ(a, b, true), c = b.dataTransfer.files;
        if (!e || a.isReadOnly()) {
            return;
        }
        if (c && c.length && window.FileReader && window.File) {
            var i = c.length, k = Array(i), l = 0;
            var m = function() {
                if (++l == i) {
                    eu(a, function() {
                        e = bI(a.doc, e);
                        var b = {
                            from: e,
                            to: e,
                            text: a.doc.splitLines(k.filter(function(a) {
                                return a != null;
                            }).join(a.doc.lineSeparator())),
                            origin: "paste"
                        };
                        fx(a.doc, b);
                        fn(a.doc, eS(bI(a.doc, e), bI(a.doc, eT(b))));
                    })();
                }
            };
            var j = function(c, d) {
                if (a.options.allowDropFileTypes && T(a.options.allowDropFileTypes, c.type) == -1) {
                    m();
                    return;
                }
                var b = new FileReader();
                b.onerror = function() {
                    return m();
                };
                b.onload = function() {
                    var a = b.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(a)) {
                        m();
                        return;
                    }
                    k[d] = a;
                    m();
                };
                b.readAsText(c);
            };
            for(var f = 0; f < c.length; f++){
                j(c[f], f);
            }
        } else {
            if (a.state.draggingText && a.doc.sel.contains(e) > -1) {
                a.state.draggingText(b);
                setTimeout(function() {
                    return a.display.input.focus();
                }, 20);
                return;
            }
            try {
                var h = b.dataTransfer.getData("Text");
                if (h) {
                    var d;
                    if (a.state.draggingText && !a.state.draggingText.copy) {
                        d = a.listSelections();
                    }
                    fp(a.doc, eS(e, e));
                    if (d) {
                        for(var g = 0; g < d.length; ++g){
                            fD(a.doc, "", d[g].anchor, d[g].head, "drag");
                        }
                    }
                    a.replaceSelection(h, "around", "paste");
                    a.display.input.focus();
                }
            } catch (n) {}
        }
    }
    function fT(c, b) {
        if (t && (!c.state.draggingText || +new Date() - fR < 100)) {
            a6(b);
            return;
        }
        if (a0(c, b) || c_(c.display, b)) {
            return;
        }
        b.dataTransfer.setData("Text", c.getSelection());
        b.dataTransfer.effectAllowed = "copyMove";
        if (b.dataTransfer.setDragImage && !I) {
            var a = ap("img", null, null, "position: fixed; left: 0; top: 0;");
            a.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (x) {
                a.width = a.height = 1;
                c.display.wrapper.appendChild(a);
                a._top = a.offsetTop;
            }
            b.dataTransfer.setDragImage(a, 0, 0);
            if (x) {
                a.parentNode.removeChild(a);
            }
        }
    }
    function fU(a, d) {
        var b = dJ(a, d);
        if (!b) {
            return;
        }
        var c = document.createDocumentFragment();
        dT(a, b, c);
        if (!a.display.dragCursor) {
            a.display.dragCursor = ap("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            a.display.lineSpace.insertBefore(a.display.dragCursor, a.display.cursorDiv);
        }
        ao(a.display.dragCursor, c);
    }
    function fV(a) {
        if (a.display.dragCursor) {
            a.display.lineSpace.removeChild(a.display.dragCursor);
            a.display.dragCursor = null;
        }
    }
    function fW(e) {
        if (!document.getElementsByClassName) {
            return;
        }
        var c = document.getElementsByClassName("CodeMirror"), a = [];
        for(var b = 0; b < c.length; b++){
            var d = c[b].CodeMirror;
            if (d) {
                a.push(d);
            }
        }
        if (a.length) {
            a[0].operation(function() {
                for(var b = 0; b < a.length; b++){
                    e(a[b]);
                }
            });
        }
    }
    var fX = false;
    function fY() {
        if (fX) {
            return;
        }
        fZ();
        fX = true;
    }
    function fZ() {
        var a;
        aY(window, "resize", function() {
            if (a == null) {
                a = setTimeout(function() {
                    a = null;
                    fW(f$);
                }, 100);
            }
        });
        aY(window, "blur", function() {
            return fW(d$);
        });
    }
    function f$(b) {
        var a = b.display;
        a.cachedCharWidth = a.cachedTextHeight = a.cachedPaddingH = null;
        a.scrollbarsClipped = false;
        b.setSize();
    }
    var p = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
    };
    for(var q = 0; q < 10; q++){
        p[q + 48] = p[q + 96] = String(q);
    }
    for(var v = 65; v <= 90; v++){
        p[v] = String.fromCharCode(v);
    }
    for(var r = 1; r <= 12; r++){
        p[r + 111] = p[r + 63235] = "F" + r;
    }
    var j = {};
    j.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharAfter",
        Backspace: "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite",
        Esc: "singleSelection"
    };
    j.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        fallthrough: "basic"
    };
    j.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
    };
    j.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        fallthrough: [
            "basic",
            "emacsy"
        ]
    };
    j["default"] = J ? j.macDefault : j.pcDefault;
    function f_(a) {
        var c = a.split(/-(?!$)/);
        a = c[c.length - 1];
        var e, f, g, h;
        for(var d = 0; d < c.length - 1; d++){
            var b = c[d];
            if (/^(cmd|meta|m)$/i.test(b)) {
                h = true;
            } else if (/^a(lt)?$/i.test(b)) {
                e = true;
            } else if (/^(c|ctrl|control)$/i.test(b)) {
                f = true;
            } else if (/^s(hift)?$/i.test(b)) {
                g = true;
            } else {
                throw new Error("Unrecognized modifier name: " + b);
            }
        }
        if (e) {
            a = "Alt-" + a;
        }
        if (f) {
            a = "Ctrl-" + a;
        }
        if (h) {
            a = "Cmd-" + a;
        }
        if (g) {
            a = "Shift-" + a;
        }
        return a;
    }
    function f0(a) {
        var d = {};
        for(var b in a){
            if (a.hasOwnProperty(b)) {
                var h = a[b];
                if (/^(name|fallthrough|(de|at)tach)$/.test(b)) {
                    continue;
                }
                if (h == "...") {
                    delete a[b];
                    continue;
                }
                var e = aH(b.split(" "), f_);
                for(var f = 0; f < e.length; f++){
                    var g = void 0, c = void 0;
                    if (f == e.length - 1) {
                        c = e.join(" ");
                        g = h;
                    } else {
                        c = e.slice(0, f + 1).join(" ");
                        g = "...";
                    }
                    var i = d[c];
                    if (!i) {
                        d[c] = g;
                    } else if (i != g) {
                        throw new Error("Inconsistent bindings for " + c);
                    }
                }
                delete a[b];
            }
        }
        for(var j in d){
            a[j] = d[j];
        }
        return a;
    }
    function f1(b, a, d, e) {
        a = f5(a);
        var c = a.call ? a.call(b, e) : a[b];
        if (c === false) {
            return "nothing";
        }
        if (c === "...") {
            return "multi";
        }
        if (c != null && d(c)) {
            return "handled";
        }
        if (a.fallthrough) {
            if (Object.prototype.toString.call(a.fallthrough) != "[object Array]") {
                return f1(b, a.fallthrough, d, e);
            }
            for(var f = 0; f < a.fallthrough.length; f++){
                var g = f1(b, a.fallthrough[f], d, e);
                if (g) {
                    return g;
                }
            }
        }
    }
    function f2(b) {
        var a = typeof b == "string" ? b : p[b.keyCode];
        return (a == "Ctrl" || a == "Alt" || a == "Shift" || a == "Mod");
    }
    function f3(a, b, d) {
        var c = a;
        if (b.altKey && c != "Alt") {
            a = "Alt-" + a;
        }
        if ((aj ? b.metaKey : b.ctrlKey) && c != "Ctrl") {
            a = "Ctrl-" + a;
        }
        if ((aj ? b.ctrlKey : b.metaKey) && c != "Mod") {
            a = "Cmd-" + a;
        }
        if (!d && b.shiftKey && c != "Shift") {
            a = "Shift-" + a;
        }
        return a;
    }
    function f4(a, c) {
        if (x && a.keyCode == 34 && a["char"]) {
            return false;
        }
        var b = p[a.keyCode];
        if (b == null || a.altGraphKey) {
            return false;
        }
        if (a.keyCode == 3 && a.code) {
            b = a.code;
        }
        return f3(b, a, c);
    }
    function f5(a) {
        return typeof a == "string" ? j[a] : a;
    }
    function f6(d, g) {
        var e = d.doc.sel.ranges, a = [];
        for(var c = 0; c < e.length; c++){
            var b = g(e[c]);
            while(a.length && bC(b.from, aG(a).to) <= 0){
                var f = a.pop();
                if (bC(f.from, b.from) < 0) {
                    b.from = f.from;
                    break;
                }
            }
            a.push(b);
        }
        et(d, function() {
            for(var b = a.length - 1; b >= 0; b--){
                fD(d.doc, "", a[b].from, a[b].to, "+delete");
            }
            d7(d);
        });
    }
    function f7(b, d, c) {
        var a = aQ(b.text, d + c, c);
        return a < 0 || a > b.text.length ? null : a;
    }
    function f8(d, a, b) {
        var c = f7(d, a.ch, b);
        return c == null ? null : new bB(a.line, c, b < 0 ? "after" : "before");
    }
    function f9(i, d, e, g, a) {
        if (i) {
            if (d.doc.direction == "rtl") {
                a = -a;
            }
            var f = aW(e, d.doc.direction);
            if (f) {
                var c = a < 0 ? aG(f) : f[0];
                var j = a < 0 == (c.level == 1);
                var h = j ? "after" : "before";
                var b;
                if (c.level > 0 || d.doc.direction == "rtl") {
                    var k = db(d, e);
                    b = a < 0 ? e.text.length - 1 : 0;
                    var l = dc(d, k, b).top;
                    b = aR(function(a) {
                        return (dc(d, k, a).top == l);
                    }, a < 0 == (c.level == 1) ? c.from : c.to - 1, b);
                    if (h == "before") {
                        b = f7(e, b, 1);
                    }
                } else {
                    b = a < 0 ? c.to : c.from;
                }
                return new bB(g, b, h);
            }
        }
        return new bB(g, a < 0 ? e.text.length : 0, a < 0 ? "before" : "after");
    }
    function ga(i, d, a, b) {
        var h = aW(d, i.doc.direction);
        if (!h) {
            return f8(d, a, b);
        }
        if (a.ch >= d.text.length) {
            a.ch = d.text.length;
            a.sticky = "before";
        } else if (a.ch <= 0) {
            a.ch = 0;
            a.sticky = "after";
        }
        var m = aU(h, a.ch, a.sticky), c = h[m];
        if (i.doc.direction == "ltr" && c.level % 2 == 0 && (b > 0 ? c.to > a.ch : c.from < a.ch)) {
            return f8(d, a, b);
        }
        var j = function(a, b) {
            return f7(d, a instanceof bB ? a.ch : a, b);
        };
        var q;
        var n = function(a) {
            if (!i.options.lineWrapping) {
                return {
                    begin: 0,
                    end: d.text.length
                };
            }
            q = q || db(i, d);
            return dx(i, d, q, a);
        };
        var f = n(a.sticky == "before" ? j(a, -1) : a.ch);
        if (i.doc.direction == "rtl" || c.level == 1) {
            var k = (c.level == 1) == b < 0;
            var e = j(a, k ? 1 : -1);
            if (e != null && (!k ? e >= c.from && e >= f.begin : e <= c.to && e <= f.end)) {
                var p = k ? "before" : "after";
                return new bB(a.line, e, p);
            }
        }
        var o = function(d, g, e) {
            var i = function(b, c) {
                return c ? new bB(a.line, j(b, 1), "before") : new bB(a.line, b, "after");
            };
            for(; d >= 0 && d < h.length; d += g){
                var c = h[d];
                var f = g > 0 == (c.level != 1);
                var b = f ? e.begin : j(e.end, -1);
                if (c.from <= b && b < c.to) {
                    return i(b, f);
                }
                b = f ? c.from : j(c.to, -1);
                if (e.begin <= b && b < e.end) {
                    return i(b, f);
                }
            }
        };
        var g = o(m + b, b, f);
        if (g) {
            return g;
        }
        var l = b > 0 ? f.end : j(f.begin, -1);
        if (l != null && !(b > 0 && l == d.text.length)) {
            g = o(b > 0 ? 0 : h.length - 1, b, n(l));
            if (g) {
                return g;
            }
        }
        return null;
    }
    var gb = {
        selectAll: W,
        singleSelection: function(a) {
            return a.setSelection(a.getCursor("anchor"), a.getCursor("head"), aA);
        },
        killLine: function(a) {
            return f6(a, function(b) {
                if (b.empty()) {
                    var c = bt(a.doc, b.head.line).text.length;
                    if (b.head.ch == c && b.head.line < a.lastLine()) {
                        return {
                            from: b.head,
                            to: bB(b.head.line + 1, 0)
                        };
                    } else {
                        return {
                            from: b.head,
                            to: bB(b.head.line, c)
                        };
                    }
                } else {
                    return {
                        from: b.from(),
                        to: b.to()
                    };
                }
            });
        },
        deleteLine: function(a) {
            return f6(a, function(b) {
                return {
                    from: bB(b.from().line, 0),
                    to: bI(a.doc, bB(b.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(a) {
            return f6(a, function(a) {
                return {
                    from: bB(a.from().line, 0),
                    to: a.from()
                };
            });
        },
        delWrappedLineLeft: function(a) {
            return f6(a, function(b) {
                var c = a.charCoords(b.head, "div").top + 5;
                var d = a.coordsChar({
                    left: 0,
                    top: c
                }, "div");
                return {
                    from: d,
                    to: b.from()
                };
            });
        },
        delWrappedLineRight: function(a) {
            return f6(a, function(b) {
                var c = a.charCoords(b.head, "div").top + 5;
                var d = a.coordsChar({
                    left: a.display.lineDiv.offsetWidth + 100,
                    top: c
                }, "div");
                return {
                    from: b.from(),
                    to: d
                };
            });
        },
        undo: function(a) {
            return a.undo();
        },
        redo: function(a) {
            return a.redo();
        },
        undoSelection: function(a) {
            return a.undoSelection();
        },
        redoSelection: function(a) {
            return a.redoSelection();
        },
        goDocStart: function(a) {
            return a.extendSelection(bB(a.firstLine(), 0));
        },
        goDocEnd: function(a) {
            return a.extendSelection(bB(a.lastLine()));
        },
        goLineStart: function(a) {
            return a.extendSelectionsBy(function(b) {
                return gc(a, b.head.line);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineStartSmart: function(a) {
            return a.extendSelectionsBy(function(b) {
                return ge(a, b.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(a) {
            return a.extendSelectionsBy(function(b) {
                return gd(a, b.head.line);
            }, {
                origin: "+move",
                bias: -1
            });
        },
        goLineRight: function(a) {
            return a.extendSelectionsBy(function(b) {
                var c = a.cursorCoords(b.head, "div").top + 5;
                return a.coordsChar({
                    left: a.display.lineDiv.offsetWidth + 100,
                    top: c
                }, "div");
            }, aC);
        },
        goLineLeft: function(a) {
            return a.extendSelectionsBy(function(b) {
                var c = a.cursorCoords(b.head, "div").top + 5;
                return a.coordsChar({
                    left: 0,
                    top: c
                }, "div");
            }, aC);
        },
        goLineLeftSmart: function(a) {
            return a.extendSelectionsBy(function(c) {
                var d = a.cursorCoords(c.head, "div").top + 5;
                var b = a.coordsChar({
                    left: 0,
                    top: d
                }, "div");
                if (b.ch < a.getLine(b.line).search(/\S/)) {
                    return ge(a, c.head);
                }
                return b;
            }, aC);
        },
        goLineUp: function(a) {
            return a.moveV(-1, "line");
        },
        goLineDown: function(a) {
            return a.moveV(1, "line");
        },
        goPageUp: function(a) {
            return a.moveV(-1, "page");
        },
        goPageDown: function(a) {
            return a.moveV(1, "page");
        },
        goCharLeft: function(a) {
            return a.moveH(-1, "char");
        },
        goCharRight: function(a) {
            return a.moveH(1, "char");
        },
        goColumnLeft: function(a) {
            return a.moveH(-1, "column");
        },
        goColumnRight: function(a) {
            return a.moveH(1, "column");
        },
        goWordLeft: function(a) {
            return a.moveH(-1, "word");
        },
        goGroupRight: function(a) {
            return a.moveH(1, "group");
        },
        goGroupLeft: function(a) {
            return a.moveH(-1, "group");
        },
        goWordRight: function(a) {
            return a.moveH(1, "word");
        },
        delCharBefore: function(a) {
            return a.deleteH(-1, "codepoint");
        },
        delCharAfter: function(a) {
            return a.deleteH(1, "char");
        },
        delWordBefore: function(a) {
            return a.deleteH(-1, "word");
        },
        delWordAfter: function(a) {
            return a.deleteH(1, "word");
        },
        delGroupBefore: function(a) {
            return a.deleteH(-1, "group");
        },
        delGroupAfter: function(a) {
            return a.deleteH(1, "group");
        },
        indentAuto: function(a) {
            return a.indentSelection("smart");
        },
        indentMore: function(a) {
            return a.indentSelection("add");
        },
        indentLess: function(a) {
            return a.indentSelection("subtract");
        },
        insertTab: function(a) {
            return a.replaceSelection("\t");
        },
        insertSoftTab: function(a) {
            var d = [], e = a.listSelections(), b = a.options.tabSize;
            for(var c = 0; c < e.length; c++){
                var f = e[c].from();
                var g = ax(a.getLine(f.line), f.ch, b);
                d.push(aF(b - (g % b)));
            }
            a.replaceSelections(d);
        },
        defaultTab: function(a) {
            if (a.somethingSelected()) {
                a.indentSelection("add");
            } else {
                a.execCommand("insertTab");
            }
        },
        transposeChars: function(a) {
            return et(a, function() {
                var f = a.listSelections(), g = [];
                for(var d = 0; d < f.length; d++){
                    if (!f[d].empty()) {
                        continue;
                    }
                    var b = f[d].head, c = bt(a.doc, b.line).text;
                    if (c) {
                        if (b.ch == c.length) {
                            b = new bB(b.line, b.ch - 1);
                        }
                        if (b.ch > 0) {
                            b = new bB(b.line, b.ch + 1);
                            a.replaceRange(c.charAt(b.ch - 1) + c.charAt(b.ch - 2), bB(b.line, b.ch - 2), b, "+transpose");
                        } else if (b.line > a.doc.first) {
                            var e = bt(a.doc, b.line - 1).text;
                            if (e) {
                                b = new bB(b.line, 1);
                                a.replaceRange(c.charAt(0) + a.doc.lineSeparator() + e.charAt(e.length - 1), bB(b.line - 1, e.length - 1), b, "+transpose");
                            }
                        }
                    }
                    g.push(new A(b, b));
                }
                a.setSelections(g);
            });
        },
        newlineAndIndent: function(a) {
            return et(a, function() {
                var b = a.listSelections();
                for(var c = b.length - 1; c >= 0; c--){
                    a.replaceRange(a.doc.lineSeparator(), b[c].anchor, b[c].head, "+input");
                }
                b = a.listSelections();
                for(var d = 0; d < b.length; d++){
                    a.indentLine(b[d].from().line, null, true);
                }
                d7(a);
            });
        },
        openLine: function(a) {
            return a.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(a) {
            return a.toggleOverwrite();
        }
    };
    function gc(c, a) {
        var d = bt(c.doc, a);
        var b = cj(d);
        if (b != d) {
            a = bx(b);
        }
        return f9(true, c, b, a, 1);
    }
    function gd(c, a) {
        var b = bt(c.doc, a);
        var d = ck(b);
        if (d != b) {
            a = bx(d);
        }
        return f9(true, c, b, a, -1);
    }
    function ge(c, b) {
        var a = gc(c, b.line);
        var d = bt(c.doc, a.line);
        var e = aW(d, c.doc.direction);
        if (!e || e[0].level == 0) {
            var f = Math.max(a.ch, d.text.search(/\S/));
            var g = b.line == a.line && b.ch <= f && b.ch;
            return bB(a.line, g ? 0 : f, a.sticky);
        }
        return a;
    }
    function gf(a, b, d) {
        if (typeof b == "string") {
            b = gb[b];
            if (!b) {
                return false;
            }
        }
        a.display.input.ensurePolled();
        var e = a.display.shift, c = false;
        try {
            if (a.isReadOnly()) {
                a.state.suppressEdits = true;
            }
            if (d) {
                a.display.shift = false;
            }
            c = b(a) != az;
        } finally{
            a.display.shift = e;
            a.state.suppressEdits = false;
        }
        return c;
    }
    function gg(a, b, c) {
        for(var d = 0; d < a.state.keyMaps.length; d++){
            var e = f1(b, a.state.keyMaps[d], c, a);
            if (e) {
                return e;
            }
        }
        return ((a.options.extraKeys && f1(b, a.options.extraKeys, c, a)) || f1(b, a.options.keyMap, c, a));
    }
    var gh = new z();
    function gi(a, b, c, d) {
        var e = a.state.keySeq;
        if (e) {
            if (f2(b)) {
                return "handled";
            }
            if (/\'$/.test(b)) {
                a.state.keySeq = null;
            } else {
                gh.set(50, function() {
                    if (a.state.keySeq == e) {
                        a.state.keySeq = null;
                        a.display.input.reset();
                    }
                });
            }
            if (gj(a, e + " " + b, c, d)) {
                return true;
            }
        }
        return gj(a, b, c, d);
    }
    function gj(a, c, d, e) {
        var b = gg(a, c, e);
        if (b == "multi") {
            a.state.keySeq = c;
        }
        if (b == "handled") {
            cM(a, "keyHandled", a, c, d);
        }
        if (b == "handled" || b == "multi") {
            a3(d);
            dW(a);
        }
        return !!b;
    }
    function gk(b, a) {
        var c = f4(a, true);
        if (!c) {
            return false;
        }
        if (a.shiftKey && !b.state.keySeq) {
            return (gi(b, "Shift-" + c, a, function(a) {
                return gf(b, a, true);
            }) || gi(b, c, a, function(a) {
                if (typeof a == "string" ? /^go[A-Z]/.test(a) : a.motion) {
                    return gf(b, a);
                }
            }));
        } else {
            return gi(b, c, a, function(a) {
                return gf(b, a);
            });
        }
    }
    function gl(a, b, c) {
        return gi(a, "'" + c + "'", b, function(b) {
            return gf(a, b, true);
        });
    }
    var gm = null;
    function gn(a) {
        var b = this;
        if (a.target && a.target != b.display.input.getField()) {
            return;
        }
        b.curOp.focus = as();
        if (a0(b, a)) {
            return;
        }
        if (t && P < 11 && a.keyCode == 27) {
            a.returnValue = false;
        }
        var c = a.keyCode;
        b.display.shift = c == 16 || a.shiftKey;
        var d = gk(b, a);
        if (x) {
            gm = d ? c : null;
            if (!d && c == 88 && !bg && (J ? a.metaKey : a.ctrlKey)) {
                b.replaceSelection("", null, "cut");
            }
        }
        if (E && !J && !d && c == 46 && a.shiftKey && !a.ctrlKey && document.execCommand) {
            document.execCommand("cut");
        }
        if (c == 18 && !/\bCodeMirror-crosshair\b/.test(b.display.lineDiv.className)) {
            go(b);
        }
    }
    function go(b) {
        var c = b.display.lineDiv;
        at(c, "CodeMirror-crosshair");
        function a(b) {
            if (b.keyCode == 18 || !b.altKey) {
                am(c, "CodeMirror-crosshair");
                a$(document, "keyup", a);
                a$(document, "mouseover", a);
            }
        }
        aY(document, "keyup", a);
        aY(document, "mouseover", a);
    }
    function gp(a) {
        if (a.keyCode == 16) {
            this.doc.sel.shift = false;
        }
        a0(this, a);
    }
    function gq(a) {
        var b = this;
        if (a.target && a.target != b.display.input.getField()) {
            return;
        }
        if (c_(b.display, a) || a0(b, a) || (a.ctrlKey && !a.altKey) || (J && a.metaKey)) {
            return;
        }
        var c = a.keyCode, d = a.charCode;
        if (x && c == gm) {
            gm = null;
            a3(a);
            return;
        }
        if (x && (!a.which || a.which < 10) && gk(b, a)) {
            return;
        }
        var e = String.fromCharCode(d == null ? c : d);
        if (e == "\x08") {
            return;
        }
        if (gl(b, a, e)) {
            return;
        }
        b.display.input.onKeyPress(a);
    }
    var gr = 400;
    var Y = function(a, b, c) {
        this.time = a;
        this.pos = b;
        this.button = c;
    };
    Y.prototype.compare = function(a, b, c) {
        return (this.time + gr > a && bC(b, this.pos) == 0 && c == this.button);
    };
    var gs, gt;
    function gu(a, b) {
        var c = +new Date();
        if (gt && gt.compare(c, a, b)) {
            gs = gt = null;
            return "triple";
        } else if (gs && gs.compare(c, a, b)) {
            gt = new Y(c, a, b);
            gs = null;
            return "double";
        } else {
            gs = new Y(c, a, b);
            gt = null;
            return "single";
        }
    }
    function gv(a) {
        var b = this, d = b.display;
        if (a0(b, a) || (d.activeTouch && d.input.supportsTouch())) {
            return;
        }
        d.input.ensurePolled();
        d.shift = a.shiftKey;
        if (c_(d, a)) {
            if (!H) {
                d.scroller.draggable = false;
                setTimeout(function() {
                    return (d.scroller.draggable = true);
                }, 100);
            }
            return;
        }
        if (gE(b, a)) {
            return;
        }
        var c = dJ(b, a), e = a8(a), f = c ? gu(c, e) : "single";
        window.focus();
        if (e == 1 && b.state.selectingText) {
            b.state.selectingText(a);
        }
        if (c && gw(b, e, c, f, a)) {
            return;
        }
        if (e == 1) {
            if (c) {
                gy(b, c, f, a);
            } else if (a7(a) == d.scroller) {
                a3(a);
            }
        } else if (e == 2) {
            if (c) {
                fi(b.doc, c);
            }
            setTimeout(function() {
                return d.input.focus();
            }, 20);
        } else if (e == 3) {
            if (ak) {
                b.display.input.onContextMenu(a);
            } else {
                dY(b);
            }
        }
    }
    function gw(e, b, f, c, d) {
        var a = "Click";
        if (c == "double") {
            a = "Double" + a;
        } else if (c == "triple") {
            a = "Triple" + a;
        }
        a = (b == 1 ? "Left" : b == 2 ? "Middle" : "Right") + a;
        return gi(e, f3(a, d), d, function(a) {
            if (typeof a == "string") {
                a = gb[a];
            }
            if (!a) {
                return false;
            }
            var b = false;
            try {
                if (e.isReadOnly()) {
                    e.state.suppressEdits = true;
                }
                b = a(e, f) != az;
            } finally{
                e.state.suppressEdits = false;
            }
            return b;
        });
    }
    function gx(c, d, a) {
        var e = c.getOption("configureMouse");
        var b = e ? e(c, d, a) : {};
        if (b.unit == null) {
            var f = ah ? a.shiftKey && a.metaKey : a.altKey;
            b.unit = f ? "rectangle" : d == "single" ? "char" : d == "double" ? "word" : "line";
        }
        if (b.extend == null || c.doc.extend) {
            b.extend = c.doc.extend || a.shiftKey;
        }
        if (b.addNew == null) {
            b.addNew = J ? a.metaKey : a.ctrlKey;
        }
        if (b.moveOnDrag == null) {
            b.moveOnDrag = !(J ? a.altKey : a.ctrlKey);
        }
        return b;
    }
    function gy(a, b, e, d) {
        if (t) {
            setTimeout(av(dX, a), 0);
        } else {
            a.curOp.focus = as();
        }
        var f = gx(a, e, d);
        var g = a.doc.sel, c;
        if (a.options.dragDrop && a9 && !a.isReadOnly() && e == "single" && (c = g.contains(b)) > -1 && (bC((c = g.ranges[c]).from(), b) < 0 || b.xRel > 0) && (bC(c.to(), b) > 0 || b.xRel < 0)) {
            gz(a, d, b, f);
        } else {
            gB(a, d, b, f);
        }
    }
    function gz(b, g, h, d) {
        var a = b.display, i = false;
        var c = eu(b, function(g) {
            if (H) {
                a.scroller.draggable = false;
            }
            b.state.draggingText = false;
            if (b.state.delayingBlurEvent) {
                if (b.hasFocus()) {
                    b.state.delayingBlurEvent = false;
                } else {
                    dY(b);
                }
            }
            a$(a.wrapper.ownerDocument, "mouseup", c);
            a$(a.wrapper.ownerDocument, "mousemove", e);
            a$(a.scroller, "dragstart", f);
            a$(a.scroller, "drop", c);
            if (!i) {
                a3(g);
                if (!d.addNew) {
                    fi(b.doc, h, null, null, d.extend);
                }
                if ((H && !I) || (t && P == 9)) {
                    setTimeout(function() {
                        a.wrapper.ownerDocument.body.focus({
                            preventScroll: true
                        });
                        a.input.focus();
                    }, 20);
                } else {
                    a.input.focus();
                }
            }
        });
        var e = function(a) {
            i = i || Math.abs(g.clientX - a.clientX) + Math.abs(g.clientY - a.clientY) >= 10;
        };
        var f = function() {
            return (i = true);
        };
        if (H) {
            a.scroller.draggable = true;
        }
        b.state.draggingText = c;
        c.copy = !d.moveOnDrag;
        aY(a.wrapper.ownerDocument, "mouseup", c);
        aY(a.wrapper.ownerDocument, "mousemove", e);
        aY(a.scroller, "dragstart", f);
        aY(a.scroller, "drop", c);
        b.state.delayingBlurEvent = true;
        setTimeout(function() {
            return a.input.focus();
        }, 20);
        if (a.scroller.dragDrop) {
            a.scroller.dragDrop();
        }
    }
    function gA(c, a, b) {
        if (b == "char") {
            return new A(a, a);
        }
        if (b == "word") {
            return c.findWordAt(a);
        }
        if (b == "line") {
            return new A(bB(a.line, 0), bI(c.doc, bB(a.line + 1, 0)));
        }
        var d = b(c, a);
        return new A(d.from, d.to);
    }
    function gB(b, k, f, c) {
        if (t) {
            dY(b);
        }
        var h = b.display, d = b.doc;
        a3(k);
        var e, a, i = d.sel, g = i.ranges;
        if (c.addNew && !c.extend) {
            a = d.sel.contains(f);
            if (a > -1) {
                e = g[a];
            } else {
                e = new A(f, f);
            }
        } else {
            e = d.sel.primary();
            a = d.sel.primIndex;
        }
        if (c.unit == "rectangle") {
            if (!c.addNew) {
                e = new A(f, f);
            }
            f = dJ(b, k, true, true);
            a = -1;
        } else {
            var j = gA(b, f, c.unit);
            if (c.extend) {
                e = fh(e, j.anchor, j.head, c.extend);
            } else {
                e = j;
            }
        }
        if (!c.addNew) {
            a = 0;
            fo(d, new o([
                e
            ], 0), aB);
            i = d.sel;
        } else if (a == -1) {
            a = g.length;
            fo(d, eR(b, g.concat([
                e
            ]), a), {
                scroll: false,
                origin: "*mouse"
            });
        } else if (g.length > 1 && g[a].empty() && c.unit == "char" && !c.extend) {
            fo(d, eR(b, g.slice(0, a).concat(g.slice(a + 1)), 0), {
                scroll: false,
                origin: "*mouse"
            });
            i = d.sel;
        } else {
            fk(d, a, e, aB);
        }
        var p = f;
        function q(g) {
            if (bC(p, g) == 0) {
                return;
            }
            p = g;
            if (c.unit == "rectangle") {
                var j = [], l = b.options.tabSize;
                var s = ax(bt(d, f.line).text, f.ch, l);
                var t = ax(bt(d, g.line).text, g.ch, l);
                var u = Math.min(s, t), v = Math.max(s, t);
                for(var h = Math.min(f.line, g.line), x = Math.min(b.lastLine(), Math.max(f.line, g.line)); h <= x; h++){
                    var o = bt(d, h).text, m = aD(o, u, l);
                    if (u == v) {
                        j.push(new A(bB(h, m), bB(h, m)));
                    } else if (o.length > m) {
                        j.push(new A(bB(h, m), bB(h, aD(o, v, l))));
                    }
                }
                if (!j.length) {
                    j.push(new A(f, f));
                }
                fo(d, eR(b, i.ranges.slice(0, a).concat(j), a), {
                    origin: "*mouse",
                    scroll: false
                });
                b.scrollIntoView(g);
            } else {
                var q = e;
                var k = gA(b, g, c.unit);
                var n = q.anchor, r;
                if (bC(k.anchor, n) > 0) {
                    r = k.head;
                    n = bG(q.from(), k.anchor);
                } else {
                    r = k.anchor;
                    n = bF(q.to(), k.head);
                }
                var w = i.ranges.slice(0);
                w[a] = gC(b, new A(bI(d, n), r));
                fo(d, eR(b, w, a), aB);
            }
        }
        var r = h.wrapper.getBoundingClientRect();
        var s = 0;
        function u(e) {
            var i = ++s;
            var a = dJ(b, e, true, c.unit == "rectangle");
            if (!a) {
                return;
            }
            if (bC(a, p) != 0) {
                b.curOp.focus = as();
                q(a);
                var f = d1(h, d);
                if (a.line >= f.to || a.line < f.from) {
                    setTimeout(eu(b, function() {
                        if (s == i) {
                            u(e);
                        }
                    }), 150);
                }
            } else {
                var g = e.clientY < r.top ? -20 : e.clientY > r.bottom ? 20 : 0;
                if (g) {
                    setTimeout(eu(b, function() {
                        if (s != i) {
                            return;
                        }
                        h.scroller.scrollTop += g;
                        u(e);
                    }), 50);
                }
            }
        }
        function m(a) {
            b.state.selectingText = false;
            s = Infinity;
            if (a) {
                a3(a);
                h.input.focus();
            }
            a$(h.wrapper.ownerDocument, "mousemove", n);
            a$(h.wrapper.ownerDocument, "mouseup", l);
            d.history.lastSelOrigin = null;
        }
        var n = eu(b, function(a) {
            if (a.buttons === 0 || !a8(a)) {
                m(a);
            } else {
                u(a);
            }
        });
        var l = eu(b, m);
        b.state.selectingText = l;
        aY(h.wrapper.ownerDocument, "mousemove", n);
        aY(h.wrapper.ownerDocument, "mouseup", l);
    }
    function gC(k, c) {
        var a = c.anchor;
        var b = c.head;
        var p = bt(k.doc, a.line);
        if (bC(a, b) == 0 && a.sticky == b.sticky) {
            return c;
        }
        var d = aW(p);
        if (!d) {
            return c;
        }
        var h = aU(d, a.ch, a.sticky), e = d[h];
        if (e.from != a.ch && e.to != a.ch) {
            return c;
        }
        var f = h + ((e.from == a.ch) == (e.level != 1) ? 0 : 1);
        if (f == 0 || f == d.length) {
            return c;
        }
        var g;
        if (b.line != a.line) {
            g = (b.line - a.line) * (k.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
            var i = aU(d, b.ch, b.sticky);
            var l = i - h || (b.ch - a.ch) * (e.level == 1 ? -1 : 1);
            if (i == f - 1 || i == f) {
                g = l < 0;
            } else {
                g = l > 0;
            }
        }
        var j = d[f + (g ? -1 : 0)];
        var m = g == (j.level == 1);
        var n = m ? j.from : j.to, o = m ? "after" : "before";
        return a.ch == n && a.sticky == o ? c : new A(new bB(a.line, n, o), b);
    }
    function gD(b, a, g, j) {
        var d, c;
        if (a.touches) {
            d = a.touches[0].clientX;
            c = a.touches[0].clientY;
        } else {
            try {
                d = a.clientX;
                c = a.clientY;
            } catch (m) {
                return false;
            }
        }
        if (d >= Math.floor(b.display.gutters.getBoundingClientRect().right)) {
            return false;
        }
        if (j) {
            a3(a);
        }
        var f = b.display;
        var h = f.lineDiv.getBoundingClientRect();
        if (c > h.bottom || !a2(b, g)) {
            return a5(a);
        }
        c -= h.top - f.viewOffset;
        for(var e = 0; e < b.display.gutterSpecs.length; ++e){
            var i = f.gutters.childNodes[e];
            if (i && i.getBoundingClientRect().right >= d) {
                var k = by(b.doc, c);
                var l = b.display.gutterSpecs[e];
                a_(b, g, b, k, l.className, a);
                return a5(a);
            }
        }
    }
    function gE(a, b) {
        return gD(a, b, "gutterClick", true);
    }
    function gF(a, b) {
        if (c_(a.display, b) || gG(a, b)) {
            return;
        }
        if (a0(a, b, "contextmenu")) {
            return;
        }
        if (!ak) {
            a.display.input.onContextMenu(b);
        }
    }
    function gG(a, b) {
        if (!a2(a, "gutterContextMenu")) {
            return false;
        }
        return gD(a, b, "gutterContextMenu", false);
    }
    function gH(a) {
        a.display.wrapper.className = a.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + a.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        dk(a);
    }
    var gI = {
        toString: function() {
            return "CodeMirror.Init";
        }
    };
    var Z = {};
    var $ = {};
    function _(b) {
        var c = b.optionHandlers;
        function a(a, e, d, f) {
            b.defaults[a] = e;
            if (d) {
                c[a] = f ? function(b, c, a) {
                    if (a != gI) {
                        d(b, c, a);
                    }
                } : d;
            }
        }
        b.defineOption = a;
        b.Init = gI;
        a("value", "", function(a, b) {
            return a.setValue(b);
        }, true);
        a("mode", null, function(a, b) {
            a.doc.modeOption = b;
            eY(a);
        }, true);
        a("indentUnit", 2, eY, true);
        a("indentWithTabs", false);
        a("smartIndent", true);
        a("tabSize", 4, function(a) {
            eZ(a);
            dk(a);
            dL(a);
        }, true);
        a("lineSeparator", null, function(b, c) {
            b.doc.lineSep = c;
            if (!c) {
                return;
            }
            var d = [], e = b.doc.first;
            b.doc.iter(function(f) {
                for(var b = 0;;){
                    var a = f.text.indexOf(c, b);
                    if (a == -1) {
                        break;
                    }
                    b = a + c.length;
                    d.push(bB(e, a));
                }
                e++;
            });
            for(var a = d.length - 1; a >= 0; a--){
                fD(b.doc, c, d[a], bB(d[a].line, d[a].ch + c.length));
            }
        });
        a("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(a, b, c) {
            a.state.specialChars = new RegExp(b.source + (b.test("\t") ? "" : "|\t"), "g");
            if (c != gI) {
                a.refresh();
            }
        });
        a("specialCharPlaceholder", cz, function(a) {
            return a.refresh();
        }, true);
        a("electricChars", true);
        a("inputStyle", ag ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        a("spellcheck", false, function(a, b) {
            return (a.getInputField().spellcheck = b);
        }, true);
        a("autocorrect", false, function(a, b) {
            return (a.getInputField().autocorrect = b);
        }, true);
        a("autocapitalize", false, function(a, b) {
            return (a.getInputField().autocapitalize = b);
        }, true);
        a("rtlMoveVisually", !ai);
        a("wholeLineUpdateBefore", true);
        a("theme", "default", function(a) {
            gH(a);
            eL(a);
        }, true);
        a("keyMap", "default", function(c, e, d) {
            var b = f5(e);
            var a = d != gI && f5(d);
            if (a && a.detach) {
                a.detach(c, b);
            }
            if (b.attach) {
                b.attach(c, a || null);
            }
        });
        a("extraKeys", null);
        a("configureMouse", null);
        a("lineWrapping", false, gK, true);
        a("gutters", [], function(a, b) {
            a.display.gutterSpecs = eJ(b, a.options.lineNumbers);
            eL(a);
        }, true);
        a("fixedGutter", true, function(a, b) {
            a.display.gutters.style.left = b ? dG(a.display) + "px" : "0";
            a.refresh();
        }, true);
        a("coverGutterNextToScrollbar", false, function(a) {
            return eg(a);
        }, true);
        a("scrollbarStyle", "native", function(a) {
            ej(a);
            eg(a);
            a.display.scrollbars.setScrollTop(a.doc.scrollTop);
            a.display.scrollbars.setScrollLeft(a.doc.scrollLeft);
        }, true);
        a("lineNumbers", false, function(a, b) {
            a.display.gutterSpecs = eJ(a.options.gutters, b);
            eL(a);
        }, true);
        a("firstLineNumber", 1, eL, true);
        a("lineNumberFormatter", function(a) {
            return a;
        }, eL, true);
        a("showCursorWhenSelecting", false, dR, true);
        a("resetSelectionOnContextMenu", true);
        a("lineWiseCopyCut", true);
        a("pasteLinesPerSelection", true);
        a("selectionsMayTouch", false);
        a("readOnly", false, function(a, b) {
            if (b == "nocursor") {
                d$(a);
                a.display.input.blur();
            }
            a.display.input.readOnlyChanged(b);
        });
        a("screenReaderLabel", null, function(b, a) {
            a = a === "" ? null : a;
            b.display.input.screenReaderLabelChanged(a);
        });
        a("disableInput", false, function(a, b) {
            if (!b) {
                a.display.input.reset();
            }
        }, true);
        a("dragDrop", true, gJ);
        a("allowDropFileTypes", null);
        a("cursorBlinkRate", 530);
        a("cursorScrollMargin", 0);
        a("cursorHeight", 1, dR, true);
        a("singleCursorHeightPerLine", true, dR, true);
        a("workTime", 100);
        a("workDelay", 100);
        a("flattenSpans", true, eZ, true);
        a("addModeClass", false, eZ, true);
        a("pollInterval", 100);
        a("undoDepth", 200, function(a, b) {
            return (a.doc.history.undoDepth = b);
        });
        a("historyEventDelay", 1250);
        a("viewportMargin", 10, function(a) {
            return a.refresh();
        }, true);
        a("maxHighlightLength", 10000, eZ, true);
        a("moveInputWithCursor", true, function(a, b) {
            if (!b) {
                a.display.input.resetPosition();
            }
        });
        a("tabindex", null, function(a, b) {
            return (a.display.input.getField().tabIndex = b || "");
        });
        a("autofocus", null);
        a("direction", "ltr", function(a, b) {
            return a.doc.setDirection(b);
        }, true);
        a("phrases", null);
    }
    function gJ(a, d, e) {
        var f = e && e != gI;
        if (!d != !f) {
            var b = a.display.dragFunctions;
            var c = d ? aY : a$;
            c(a.display.scroller, "dragstart", b.start);
            c(a.display.scroller, "dragenter", b.enter);
            c(a.display.scroller, "dragover", b.over);
            c(a.display.scroller, "dragleave", b.leave);
            c(a.display.scroller, "drop", b.drop);
        }
    }
    function gK(a) {
        if (a.options.lineWrapping) {
            at(a.display.wrapper, "CodeMirror-wrap");
            a.display.sizer.style.minWidth = "";
            a.display.sizerWidth = null;
        } else {
            am(a.display.wrapper, "CodeMirror-wrap");
            cs(a);
        }
        dI(a);
        dL(a);
        dk(a);
        setTimeout(function() {
            return eg(a);
        }, 100);
    }
    function e(h, a) {
        var j = this;
        if (!(this instanceof e)) {
            return new e(h, a);
        }
        this.options = a = a ? aw(a) : {};
        aw(Z, a, false);
        var b = a.value;
        if (typeof b == "string") {
            b = new g(b, a.mode, null, a.lineSeparator, a.direction);
        } else if (a.mode) {
            b.modeOption = a.mode;
        }
        this.doc = b;
        var i = new e.inputStyles[a.inputStyle](this);
        var c = (this.display = new eM(h, b, i, a));
        c.wrapper.CodeMirror = this;
        gH(this);
        if (a.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap";
        }
        ej(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: false,
            draggingText: false,
            highlight: new z(),
            keySeq: null,
            specialChars: null
        };
        if (a.autofocus && !ag) {
            c.input.focus();
        }
        if (t && P < 11) {
            setTimeout(function() {
                return j.display.input.reset(true);
            }, 20);
        }
        gL(this);
        fY();
        el(this);
        this.curOp.forceUpdate = true;
        e1(this, b);
        if ((a.autofocus && !ag) || this.hasFocus()) {
            setTimeout(function() {
                if (j.hasFocus() && !j.state.focused) {
                    dZ(j);
                }
            }, 20);
        } else {
            d$(this);
        }
        for(var d in $){
            if ($.hasOwnProperty(d)) {
                $[d](this, a[d], gI);
            }
        }
        eI(this);
        if (a.finishInit) {
            a.finishInit(this);
        }
        for(var f = 0; f < gM.length; ++f){
            gM[f](this);
        }
        em(this);
        if (H && a.lineWrapping && getComputedStyle(c.lineDiv).textRendering == "optimizelegibility") {
            c.lineDiv.style.textRendering = "auto";
        }
    }
    e.defaults = Z;
    e.optionHandlers = $;
    function gL(b) {
        var a = b.display;
        aY(a.scroller, "mousedown", eu(b, gv));
        if (t && P < 11) {
            aY(a.scroller, "dblclick", eu(b, function(a) {
                if (a0(b, a)) {
                    return;
                }
                var c = dJ(b, a);
                if (!c || gE(b, a) || c_(b.display, a)) {
                    return;
                }
                a3(a);
                var d = b.findWordAt(c);
                fi(b.doc, d.anchor, d.head);
            }));
        } else {
            aY(a.scroller, "dblclick", function(a) {
                return a0(b, a) || a3(a);
            });
        }
        aY(a.scroller, "contextmenu", function(a) {
            return gF(b, a);
        });
        aY(a.input.getField(), "contextmenu", function(c) {
            if (!a.scroller.contains(c.target)) {
                gF(b, c);
            }
        });
        var e, f = {
            end: 0
        };
        function d() {
            if (a.activeTouch) {
                e = setTimeout(function() {
                    return (a.activeTouch = null);
                }, 1000);
                f = a.activeTouch;
                f.end = +new Date();
            }
        }
        function g(a) {
            if (a.touches.length != 1) {
                return false;
            }
            var b = a.touches[0];
            return b.radiusX <= 1 && b.radiusY <= 1;
        }
        function h(b, a) {
            if (a.left == null) {
                return true;
            }
            var c = a.left - b.left, d = a.top - b.top;
            return c * c + d * d > 20 * 20;
        }
        aY(a.scroller, "touchstart", function(c) {
            if (!a0(b, c) && !g(c) && !gE(b, c)) {
                a.input.ensurePolled();
                clearTimeout(e);
                var d = +new Date();
                a.activeTouch = {
                    start: d,
                    moved: false,
                    prev: d - f.end <= 300 ? f : null
                };
                if (c.touches.length == 1) {
                    a.activeTouch.left = c.touches[0].pageX;
                    a.activeTouch.top = c.touches[0].pageY;
                }
            }
        });
        aY(a.scroller, "touchmove", function() {
            if (a.activeTouch) {
                a.activeTouch.moved = true;
            }
        });
        aY(a.scroller, "touchend", function(g) {
            var c = a.activeTouch;
            if (c && !c_(a, g) && c.left != null && !c.moved && new Date() - c.start < 300) {
                var e = b.coordsChar(a.activeTouch, "page"), f;
                if (!c.prev || h(c, c.prev)) {
                    f = new A(e, e);
                } else if (!c.prev.prev || h(c, c.prev.prev)) {
                    f = b.findWordAt(e);
                } else {
                    f = new A(bB(e.line, 0), bI(b.doc, bB(e.line + 1, 0)));
                }
                b.setSelection(f.anchor, f.head);
                b.focus();
                a3(g);
            }
            d();
        });
        aY(a.scroller, "touchcancel", d);
        aY(a.scroller, "scroll", function() {
            if (a.scroller.clientHeight) {
                ec(b, a.scroller.scrollTop);
                ee(b, a.scroller.scrollLeft, true);
                a_(b, "scroll", b);
            }
        });
        aY(a.scroller, "mousewheel", function(a) {
            return eQ(b, a);
        });
        aY(a.scroller, "DOMMouseScroll", function(a) {
            return eQ(b, a);
        });
        aY(a.wrapper, "scroll", function() {
            return (a.wrapper.scrollTop = a.wrapper.scrollLeft = 0);
        });
        a.dragFunctions = {
            enter: function(a) {
                if (!a0(b, a)) {
                    a6(a);
                }
            },
            over: function(a) {
                if (!a0(b, a)) {
                    fU(b, a);
                    a6(a);
                }
            },
            start: function(a) {
                return fT(b, a);
            },
            drop: eu(b, fS),
            leave: function(a) {
                if (!a0(b, a)) {
                    fV(b);
                }
            }
        };
        var c = a.input.getField();
        aY(c, "keyup", function(a) {
            return gp.call(b, a);
        });
        aY(c, "keydown", eu(b, gn));
        aY(c, "keypress", eu(b, gq));
        aY(c, "focus", function(a) {
            return dZ(b, a);
        });
        aY(c, "blur", function(a) {
            return d$(b, a);
        });
    }
    var gM = [];
    e.defineInitHook = function(a) {
        return gM.push(a);
    };
    function gN(f, d, b, m) {
        var c = f.doc, n;
        if (b == null) {
            b = "add";
        }
        if (b == "smart") {
            if (!c.mode.indent) {
                b = "prev";
            } else {
                n = bO(f, d).state;
            }
        }
        var h = f.options.tabSize;
        var e = bt(c, d), k = ax(e.text, null, h);
        if (e.stateAfter) {
            e.stateAfter = null;
        }
        var g = e.text.match(/^\s*/)[0], a;
        if (!m && !/\S/.test(e.text)) {
            a = 0;
            b = "not";
        } else if (b == "smart") {
            a = c.mode.indent(n, e.text.slice(g.length), e.text);
            if (a == az || a > 150) {
                if (!m) {
                    return;
                }
                b = "prev";
            }
        }
        if (b == "prev") {
            if (d > c.first) {
                a = ax(bt(c, d - 1).text, null, h);
            } else {
                a = 0;
            }
        } else if (b == "add") {
            a = k + f.options.indentUnit;
        } else if (b == "subtract") {
            a = k - f.options.indentUnit;
        } else if (typeof b == "number") {
            a = k + b;
        }
        a = Math.max(0, a);
        var i = "", l = 0;
        if (f.options.indentWithTabs) {
            for(var o = Math.floor(a / h); o; --o){
                l += h;
                i += "\t";
            }
        }
        if (l < a) {
            i += aF(a - l);
        }
        if (i != g) {
            fD(c, i, bB(d, 0), bB(d, g.length), "+input");
            e.stateAfter = null;
            return true;
        } else {
            for(var j = 0; j < c.sel.ranges.length; j++){
                var p = c.sel.ranges[j];
                if (p.head.line == d && p.head.ch < g.length) {
                    var q = bB(d, g.length);
                    fk(c, j, new A(q, q));
                    break;
                }
            }
        }
    }
    var gO = null;
    function gP(a) {
        gO = a;
    }
    function gQ(a, h, j, b, n) {
        var k = a.doc;
        a.display.shift = false;
        if (!b) {
            b = k.sel;
        }
        var o = +new Date() - 200;
        var f = n == "paste" || a.state.pasteIncoming > o;
        var g = be(h), c = null;
        if (f && b.ranges.length > 1) {
            if (gO && gO.text.join("\n") == h) {
                if (b.ranges.length % gO.text.length == 0) {
                    c = [];
                    for(var l = 0; l < gO.text.length; l++){
                        c.push(k.splitLines(gO.text[l]));
                    }
                }
            } else if (g.length == b.ranges.length && a.options.pasteLinesPerSelection) {
                c = aH(g, function(a) {
                    return [
                        a
                    ];
                });
            }
        }
        var q = a.curOp.updateInput;
        for(var i = b.ranges.length - 1; i >= 0; i--){
            var m = b.ranges[i];
            var d = m.from(), e = m.to();
            if (m.empty()) {
                if (j && j > 0) {
                    d = bB(d.line, d.ch - j);
                } else if (a.state.overwrite && !f) {
                    e = bB(e.line, Math.min(bt(k, e.line).text.length, e.ch + aG(g).length));
                } else if (f && gO && gO.lineWise && gO.text.join("\n") == g.join("\n")) {
                    d = e = bB(d.line, 0);
                }
            }
            var p = {
                from: d,
                to: e,
                text: c ? c[i % c.length] : g,
                origin: n || (f ? "paste" : a.state.cutIncoming > o ? "cut" : "+input")
            };
            fx(a.doc, p);
            cM(a, "inputRead", a, p);
        }
        if (h && !f) {
            gS(a, h);
        }
        d7(a);
        if (a.curOp.updateInput < 2) {
            a.curOp.updateInput = q;
        }
        a.curOp.typing = true;
        a.state.pasteIncoming = a.state.cutIncoming = -1;
    }
    function gR(a, b) {
        var c = a.clipboardData && a.clipboardData.getData("Text");
        if (c) {
            a.preventDefault();
            if (!b.isReadOnly() && !b.options.disableInput) {
                et(b, function() {
                    return gQ(b, c, 0, null, "paste");
                });
            }
            return true;
        }
    }
    function gS(a, h) {
        if (!a.options.electricChars || !a.options.smartIndent) {
            return;
        }
        var e = a.doc.sel;
        for(var c = e.ranges.length - 1; c >= 0; c--){
            var b = e.ranges[c];
            if (b.head.ch > 100 || (c && e.ranges[c - 1].head.line == b.head.line)) {
                continue;
            }
            var d = a.getModeAt(b.head);
            var f = false;
            if (d.electricChars) {
                for(var g = 0; g < d.electricChars.length; g++){
                    if (h.indexOf(d.electricChars.charAt(g)) > -1) {
                        f = gN(a, b.head.line, "smart");
                        break;
                    }
                }
            } else if (d.electricInput) {
                if (d.electricInput.test(bt(a.doc, b.head.line).text.slice(0, b.head.ch))) {
                    f = gN(a, b.head.line, "smart");
                }
            }
            if (f) {
                cM(a, "electricInput", a, b.head.line);
            }
        }
    }
    function gT(a) {
        var d = [], e = [];
        for(var b = 0; b < a.doc.sel.ranges.length; b++){
            var f = a.doc.sel.ranges[b].head.line;
            var c = {
                anchor: bB(f, 0),
                head: bB(f + 1, 0)
            };
            e.push(c);
            d.push(a.getRange(c.anchor, c.head));
        }
        return {
            text: d,
            ranges: e
        };
    }
    function gU(a, b, c, d) {
        a.setAttribute("autocorrect", c ? "" : "off");
        a.setAttribute("autocapitalize", d ? "" : "off");
        a.setAttribute("spellcheck", !!b);
    }
    function gV() {
        var a = ap("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var b = ap("div", [
            a
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (H) {
            a.style.width = "1000px";
        } else {
            a.setAttribute("wrap", "off");
        }
        if (y) {
            a.style.border = "1px solid black";
        }
        gU(a);
        return b;
    }
    function aa(a) {
        var b = a.optionHandlers;
        var c = (a.helpers = {});
        a.prototype = {
            constructor: a,
            focus: function() {
                window.focus();
                this.display.input.focus();
            },
            setOption: function(a, c) {
                var d = this.options, e = d[a];
                if (d[a] == c && a != "mode") {
                    return;
                }
                d[a] = c;
                if (b.hasOwnProperty(a)) {
                    eu(this, b[a])(this, c, e);
                }
                a_(this, "optionChange", this, a);
            },
            getOption: function(a) {
                return this.options[a];
            },
            getDoc: function() {
                return this.doc;
            },
            addKeyMap: function(a, b) {
                this.state.keyMaps[b ? "push" : "unshift"](f5(a));
            },
            removeKeyMap: function(c) {
                var b = this.state.keyMaps;
                for(var a = 0; a < b.length; ++a){
                    if (b[a] == c || b[a].name == c) {
                        b.splice(a, 1);
                        return true;
                    }
                }
            },
            addOverlay: ev(function(b, c) {
                var d = b.token ? b : a.getMode(this.options, b);
                if (d.startState) {
                    throw new Error("Overlays may not be stateful.");
                }
                aI(this.state.overlays, {
                    mode: d,
                    modeSpec: b,
                    opaque: c && c.opaque,
                    priority: (c && c.priority) || 0
                }, function(a) {
                    return a.priority;
                });
                this.state.modeGen++;
                dL(this);
            }),
            removeOverlay: ev(function(b) {
                var c = this.state.overlays;
                for(var a = 0; a < c.length; ++a){
                    var d = c[a].modeSpec;
                    if (d == b || (typeof b == "string" && d.name == b)) {
                        c.splice(a, 1);
                        this.state.modeGen++;
                        dL(this);
                        return;
                    }
                }
            }),
            indentLine: ev(function(b, a, c) {
                if (typeof a != "string" && typeof a != "number") {
                    if (a == null) {
                        a = this.options.smartIndent ? "smart" : "prev";
                    } else {
                        a = a ? "add" : "subtract";
                    }
                }
                if (bz(this.doc, b)) {
                    gN(this, b, a, c);
                }
            }),
            indentSelection: ev(function(h) {
                var d = this.doc.sel.ranges, c = -1;
                for(var a = 0; a < d.length; a++){
                    var b = d[a];
                    if (!b.empty()) {
                        var e = b.from(), i = b.to();
                        var j = Math.max(c, e.line);
                        c = Math.min(this.lastLine(), i.line - (i.ch ? 0 : 1)) + 1;
                        for(var f = j; f < c; ++f){
                            gN(this, f, h);
                        }
                        var g = this.doc.sel.ranges;
                        if (e.ch == 0 && d.length == g.length && g[a].from().ch > 0) {
                            fk(this.doc, a, new A(e, g[a].to()), aA);
                        }
                    } else if (b.head.line > c) {
                        gN(this, b.head.line, h, true);
                        c = b.head.line;
                        if (a == this.doc.sel.primIndex) {
                            d7(this);
                        }
                    }
                }
            }),
            getTokenAt: function(a, b) {
                return bT(this, a, b);
            },
            getLineTokens: function(a, b) {
                return bT(this, bB(a), b, true);
            },
            getTokenTypeAt: function(d) {
                d = bI(this.doc, d);
                var c = bN(this, bt(this.doc, d.line));
                var g = 0, h = (c.length - 1) / 2, e = d.ch;
                var a;
                if (e == 0) {
                    a = c[2];
                } else {
                    for(;;){
                        var b = (g + h) >> 1;
                        if ((b ? c[b * 2 - 1] : 0) >= e) {
                            h = b;
                        } else if (c[b * 2 + 1] < e) {
                            g = b + 1;
                        } else {
                            a = c[b * 2 + 2];
                            break;
                        }
                    }
                }
                var f = a ? a.indexOf("overlay ") : -1;
                return f < 0 ? a : f == 0 ? null : a.slice(0, f - 1);
            },
            getModeAt: function(c) {
                var b = this.doc.mode;
                if (!b.innerMode) {
                    return b;
                }
                return a.innerMode(b, this.getTokenAt(c).state).mode;
            },
            getHelper: function(a, b) {
                return this.getHelpers(a, b)[0];
            },
            getHelpers: function(j, d) {
                var e = [];
                if (!c.hasOwnProperty(d)) {
                    return e;
                }
                var b = c[d], a = this.getModeAt(j);
                if (typeof a[d] == "string") {
                    if (b[a[d]]) {
                        e.push(b[a[d]]);
                    }
                } else if (a[d]) {
                    for(var f = 0; f < a[d].length; f++){
                        var i = b[a[d][f]];
                        if (i) {
                            e.push(i);
                        }
                    }
                } else if (a.helperType && b[a.helperType]) {
                    e.push(b[a.helperType]);
                } else if (b[a.name]) {
                    e.push(b[a.name]);
                }
                for(var g = 0; g < b._global.length; g++){
                    var h = b._global[g];
                    if (h.pred(a, this) && T(e, h.val) == -1) {
                        e.push(h.val);
                    }
                }
                return e;
            },
            getStateAfter: function(a, c) {
                var b = this.doc;
                a = bH(b, a == null ? b.first + b.size - 1 : a);
                return bO(this, a + 1, c).state;
            },
            cursorCoords: function(a, d) {
                var b, c = this.doc.sel.primary();
                if (a == null) {
                    b = c.head;
                } else if (typeof a == "object") {
                    b = bI(this.doc, a);
                } else {
                    b = a ? c.from() : c.to();
                }
                return ds(this, b, d || "page");
            },
            charCoords: function(a, b) {
                return dr(this, bI(this.doc, a), b || "page");
            },
            coordsChar: function(a, b) {
                a = dq(this, a, b || "page");
                return dv(this, a.left, a.top);
            },
            lineAtHeight: function(a, b) {
                a = dq(this, {
                    top: a,
                    left: 0
                }, b || "page").top;
                return by(this.doc, a + this.display.viewOffset);
            },
            heightAtLine: function(a, e, f) {
                var c = false, b;
                if (typeof a == "number") {
                    var d = this.doc.first + this.doc.size - 1;
                    if (a < this.doc.first) {
                        a = this.doc.first;
                    } else if (a > d) {
                        a = d;
                        c = true;
                    }
                    b = bt(this.doc, a);
                } else {
                    b = a;
                }
                return (dp(this, b, {
                    top: 0,
                    left: 0
                }, e || "page", f || c).top + (c ? this.doc.height - cq(b) : 0));
            },
            defaultTextHeight: function() {
                return dD(this.display);
            },
            defaultCharWidth: function() {
                return dE(this.display);
            },
            getViewport: function() {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function(b, a, j, f, g) {
                var d = this.display;
                b = ds(this, bI(this.doc, b));
                var e = b.bottom, c = b.left;
                a.style.position = "absolute";
                a.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(a);
                d.sizer.appendChild(a);
                if (f == "over") {
                    e = b.top;
                } else if (f == "above" || f == "near") {
                    var h = Math.max(d.wrapper.clientHeight, this.doc.height), i = Math.max(d.sizer.clientWidth, d.lineSpace.clientWidth);
                    if ((f == "above" || b.bottom + a.offsetHeight > h) && b.top > a.offsetHeight) {
                        e = b.top - a.offsetHeight;
                    } else if (b.bottom + a.offsetHeight <= h) {
                        e = b.bottom;
                    }
                    if (c + a.offsetWidth > i) {
                        c = i - a.offsetWidth;
                    }
                }
                a.style.top = e + "px";
                a.style.left = a.style.right = "";
                if (g == "right") {
                    c = d.sizer.clientWidth - a.offsetWidth;
                    a.style.right = "0px";
                } else {
                    if (g == "left") {
                        c = 0;
                    } else if (g == "middle") {
                        c = (d.sizer.clientWidth - a.offsetWidth) / 2;
                    }
                    a.style.left = c + "px";
                }
                if (j) {
                    d4(this, {
                        left: c,
                        top: e,
                        right: c + a.offsetWidth,
                        bottom: e + a.offsetHeight
                    });
                }
            },
            triggerOnKeyDown: ev(gn),
            triggerOnKeyPress: ev(gq),
            triggerOnKeyUp: gp,
            triggerOnMouseDown: ev(gv),
            execCommand: function(a) {
                if (gb.hasOwnProperty(a)) {
                    return gb[a].call(null, this);
                }
            },
            triggerElectric: ev(function(a) {
                gS(this, a);
            }),
            findPosH: function(e, a, f, g) {
                var c = 1;
                if (a < 0) {
                    c = -1;
                    a = -a;
                }
                var b = bI(this.doc, e);
                for(var d = 0; d < a; ++d){
                    b = gW(this.doc, b, c, f, g);
                    if (b.hitSide) {
                        break;
                    }
                }
                return b;
            },
            moveH: ev(function(a, b) {
                var c = this;
                this.extendSelectionsBy(function(d) {
                    if (c.display.shift || c.doc.extend || d.empty()) {
                        return gW(c.doc, d.head, a, b, c.options.rtlMoveVisually);
                    } else {
                        return a < 0 ? d.from() : d.to();
                    }
                }, aC);
            }),
            deleteH: ev(function(c, d) {
                var a = this.doc.sel, b = this.doc;
                if (a.somethingSelected()) {
                    b.replaceSelection("", null, "+delete");
                } else {
                    f6(this, function(a) {
                        var e = gW(b, a.head, c, d, false);
                        return c < 0 ? {
                            from: e,
                            to: a.head
                        } : {
                            from: a.head,
                            to: e
                        };
                    });
                }
            }),
            findPosV: function(g, a, h, i) {
                var e = 1, c = i;
                if (a < 0) {
                    e = -1;
                    a = -a;
                }
                var b = bI(this.doc, g);
                for(var f = 0; f < a; ++f){
                    var d = ds(this, b, "div");
                    if (c == null) {
                        c = d.left;
                    } else {
                        d.left = c;
                    }
                    b = gX(this, d, e, h);
                    if (b.hitSide) {
                        break;
                    }
                }
                return b;
            },
            moveV: ev(function(d, e) {
                var f = this;
                var a = this.doc, c = [];
                var g = !this.display.shift && !a.extend && a.sel.somethingSelected();
                a.extendSelectionsBy(function(b) {
                    if (g) {
                        return d < 0 ? b.from() : b.to();
                    }
                    var h = ds(f, b.head, "div");
                    if (b.goalColumn != null) {
                        h.left = b.goalColumn;
                    }
                    c.push(h.left);
                    var i = gX(f, h, d, e);
                    if (e == "page" && b == a.sel.primary()) {
                        d6(f, dr(f, i, "div").top - h.top);
                    }
                    return i;
                }, aC);
                if (c.length) {
                    for(var b = 0; b < a.sel.ranges.length; b++){
                        a.sel.ranges[b].goalColumn = c[b];
                    }
                }
            }),
            findWordAt: function(a) {
                var g = this.doc, c = bt(g, a.line).text;
                var b = a.ch, d = a.ch;
                if (c) {
                    var h = this.getHelper(a, "wordChars");
                    if ((a.sticky == "before" || d == c.length) && b) {
                        --b;
                    } else {
                        ++d;
                    }
                    var e = c.charAt(b);
                    var f = aM(e, h) ? function(a) {
                        return aM(a, h);
                    } : /\s/.test(e) ? function(a) {
                        return /\s/.test(a);
                    } : function(a) {
                        return !/\s/.test(a) && !aM(a);
                    };
                    while(b > 0 && f(c.charAt(b - 1))){
                        --b;
                    }
                    while(d < c.length && f(c.charAt(d))){
                        ++d;
                    }
                }
                return new A(bB(a.line, b), bB(a.line, d));
            },
            toggleOverwrite: function(a) {
                if (a != null && a == this.state.overwrite) {
                    return;
                }
                if ((this.state.overwrite = !this.state.overwrite)) {
                    at(this.display.cursorDiv, "CodeMirror-overwrite");
                } else {
                    am(this.display.cursorDiv, "CodeMirror-overwrite");
                }
                a_(this, "overwriteToggle", this, this.state.overwrite);
            },
            hasFocus: function() {
                return this.display.input.getField() == as();
            },
            isReadOnly: function() {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: ev(function(a, b) {
                d8(this, a, b);
            }),
            getScrollInfo: function() {
                var a = this.display.scroller;
                return {
                    left: a.scrollLeft,
                    top: a.scrollTop,
                    height: a.scrollHeight - c3(this) - this.display.barHeight,
                    width: a.scrollWidth - c3(this) - this.display.barWidth,
                    clientHeight: c5(this),
                    clientWidth: c4(this)
                };
            },
            scrollIntoView: ev(function(a, b) {
                if (a == null) {
                    a = {
                        from: this.doc.sel.primary().head,
                        to: null
                    };
                    if (b == null) {
                        b = this.options.cursorScrollMargin;
                    }
                } else if (typeof a == "number") {
                    a = {
                        from: bB(a, 0),
                        to: null
                    };
                } else if (a.from == null) {
                    a = {
                        from: a,
                        to: null
                    };
                }
                if (!a.to) {
                    a.to = a.from;
                }
                a.margin = b || 0;
                if (a.from.line != null) {
                    d9(this, a);
                } else {
                    eb(this, a.from, a.to, a.margin);
                }
            }),
            setSize: ev(function(a, b) {
                var e = this;
                var c = function(a) {
                    return typeof a == "number" || /^\d+$/.test(String(a)) ? a + "px" : a;
                };
                if (a != null) {
                    this.display.wrapper.style.width = c(a);
                }
                if (b != null) {
                    this.display.wrapper.style.height = c(b);
                }
                if (this.options.lineWrapping) {
                    dj(this);
                }
                var d = this.display.viewFrom;
                this.doc.iter(d, this.display.viewTo, function(a) {
                    if (a.widgets) {
                        for(var b = 0; b < a.widgets.length; b++){
                            if (a.widgets[b].noHScroll) {
                                dM(e, d, "widget");
                                break;
                            }
                        }
                    }
                    ++d;
                });
                this.curOp.forceUpdate = true;
                a_(this, "refresh", this);
            }),
            operation: function(a) {
                return et(this, a);
            },
            startOperation: function() {
                return el(this);
            },
            endOperation: function() {
                return em(this);
            },
            refresh: ev(function() {
                var a = this.display.cachedTextHeight;
                dL(this);
                this.curOp.forceUpdate = true;
                dk(this);
                d8(this, this.doc.scrollLeft, this.doc.scrollTop);
                eF(this.display);
                if (a == null || Math.abs(a - dD(this.display)) > 0.5 || this.options.lineWrapping) {
                    dI(this);
                }
                a_(this, "refresh", this);
            }),
            swapDoc: ev(function(a) {
                var b = this.doc;
                b.cm = null;
                if (this.state.selectingText) {
                    this.state.selectingText();
                }
                e1(this, a);
                dk(this);
                this.display.input.reset();
                d8(this, a.scrollLeft, a.scrollTop);
                this.curOp.forceScroll = true;
                cM(this, "swapDoc", this, b);
                return b;
            }),
            phrase: function(a) {
                var b = this.options.phrases;
                return b && Object.prototype.hasOwnProperty.call(b, a) ? b[a] : a;
            },
            getInputField: function() {
                return this.display.input.getField();
            },
            getWrapperElement: function() {
                return this.display.wrapper;
            },
            getScrollerElement: function() {
                return this.display.scroller;
            },
            getGutterElement: function() {
                return this.display.gutters;
            }
        };
        l(a);
        a.registerHelper = function(b, d, e) {
            if (!c.hasOwnProperty(b)) {
                c[b] = a[b] = {
                    _global: []
                };
            }
            c[b][d] = e;
        };
        a.registerGlobalHelper = function(b, e, f, d) {
            a.registerHelper(b, e, d);
            c[b]._global.push({
                pred: f,
                val: d
            });
        };
    }
    function gW(d, b, a, c, m) {
        var l = b;
        var n = a;
        var o = bt(d, b.line);
        var q = m && d.direction == "rtl" ? -a : a;
        function r() {
            var a = b.line + q;
            if (a < d.first || a >= d.first + d.size) {
                return false;
            }
            b = new bB(a, b.ch, b.sticky);
            return (o = bt(d, a));
        }
        function e(g) {
            var e;
            if (c == "codepoint") {
                var f = o.text.charCodeAt(b.ch + (a > 0 ? 0 : -1));
                if (isNaN(f)) {
                    e = null;
                } else {
                    var h = a > 0 ? f >= 0xd800 && f < 0xdc00 : f >= 0xdc00 && f < 0xdfff;
                    e = new bB(b.line, Math.max(0, Math.min(o.text.length, b.ch + a * (h ? 2 : 1))), -a);
                }
            } else if (m) {
                e = ga(d.cm, o, b, a);
            } else {
                e = f8(o, b, a);
            }
            if (e == null) {
                if (!g && r()) {
                    b = f9(m, d.cm, o, b.line, q);
                } else {
                    return false;
                }
            } else {
                b = e;
            }
            return true;
        }
        if (c == "char" || c == "codepoint") {
            e();
        } else if (c == "column") {
            e(true);
        } else if (c == "word" || c == "group") {
            var h = null, i = c == "group";
            var p = d.cm && d.cm.getHelper(b, "wordChars");
            for(var g = true;; g = false){
                if (a < 0 && !e(!g)) {
                    break;
                }
                var j = o.text.charAt(b.ch) || "\n";
                var f = aM(j, p) ? "w" : i && j == "\n" ? "n" : !i || /\s/.test(j) ? null : "p";
                if (i && !g && !f) {
                    f = "s";
                }
                if (h && h != f) {
                    if (a < 0) {
                        a = 1;
                        e();
                        b.sticky = "after";
                    }
                    break;
                }
                if (f) {
                    h = f;
                }
                if (a > 0 && !e(!g)) {
                    break;
                }
            }
        }
        var k = fu(d, b, l, n, true);
        if (bD(l, k)) {
            k.hitSide = true;
        }
        return k;
    }
    function gX(d, b, c, f) {
        var g = d.doc, h = b.left, a;
        if (f == "page") {
            var i = Math.min(d.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            var j = Math.max(i - 0.5 * dD(d.display), 3);
            a = (c > 0 ? b.bottom : b.top) + c * j;
        } else if (f == "line") {
            a = c > 0 ? b.bottom + 3 : b.top - 3;
        }
        var e;
        for(;;){
            e = dv(d, h, a);
            if (!e.outside) {
                break;
            }
            if (c < 0 ? a <= 0 : a >= g.height) {
                e.hitSide = true;
                break;
            }
            a += c * 5;
        }
        return e;
    }
    var a = function(a) {
        this.cm = a;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new z();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
    };
    a.prototype.init = function(e) {
        var f = this;
        var c = this, b = c.cm;
        var a = (c.div = e.lineDiv);
        a.contentEditable = true;
        gU(a, b.options.spellcheck, b.options.autocorrect, b.options.autocapitalize);
        function g(c) {
            for(var b = c.target; b; b = b.parentNode){
                if (b == a) {
                    return true;
                }
                if (/\bCodeMirror-(?:line)?widget\b/.test(b.className)) {
                    break;
                }
            }
            return false;
        }
        aY(a, "paste", function(a) {
            if (!g(a) || a0(b, a) || gR(a, b)) {
                return;
            }
            if (P <= 11) {
                setTimeout(eu(b, function() {
                    return f.updateFromDOM();
                }), 20);
            }
        });
        aY(a, "compositionstart", function(a) {
            f.composing = {
                data: a.data,
                done: false
            };
        });
        aY(a, "compositionupdate", function(a) {
            if (!f.composing) {
                f.composing = {
                    data: a.data,
                    done: false
                };
            }
        });
        aY(a, "compositionend", function(a) {
            if (f.composing) {
                if (a.data != f.composing.data) {
                    f.readFromDOMSoon();
                }
                f.composing.done = true;
            }
        });
        aY(a, "touchstart", function() {
            return c.forceCompositionEnd();
        });
        aY(a, "input", function() {
            if (!f.composing) {
                f.readFromDOMSoon();
            }
        });
        function d(d) {
            if (!g(d) || a0(b, d)) {
                return;
            }
            if (b.somethingSelected()) {
                gP({
                    lineWise: false,
                    text: b.getSelections()
                });
                if (d.type == "cut") {
                    b.replaceSelection("", null, "cut");
                }
            } else if (!b.options.lineWiseCopyCut) {
                return;
            } else {
                var i = gT(b);
                gP({
                    lineWise: true,
                    text: i.text
                });
                if (d.type == "cut") {
                    b.operation(function() {
                        b.setSelections(i.ranges, 0, aA);
                        b.replaceSelection("", null, "cut");
                    });
                }
            }
            if (d.clipboardData) {
                d.clipboardData.clearData();
                var e = gO.text.join("\n");
                d.clipboardData.setData("Text", e);
                if (d.clipboardData.getData("Text") == e) {
                    d.preventDefault();
                    return;
                }
            }
            var f = gV(), h = f.firstChild;
            b.display.lineSpace.insertBefore(f, b.display.lineSpace.firstChild);
            h.value = gO.text.join("\n");
            var j = as();
            L(h);
            setTimeout(function() {
                b.display.lineSpace.removeChild(f);
                j.focus();
                if (j == a) {
                    c.showPrimarySelection();
                }
            }, 50);
        }
        aY(a, "copy", d);
        aY(a, "cut", d);
    };
    a.prototype.screenReaderLabelChanged = function(a) {
        if (a) {
            this.div.setAttribute("aria-label", a);
        } else {
            this.div.removeAttribute("aria-label");
        }
    };
    a.prototype.prepareSelection = function() {
        var a = dS(this.cm, false);
        a.focus = as() == this.div;
        return a;
    };
    a.prototype.showSelection = function(a, b) {
        if (!a || !this.cm.display.view.length) {
            return;
        }
        if (a.focus || b) {
            this.showPrimarySelection();
        }
        this.showMultipleSelections(a);
    };
    a.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    };
    a.prototype.showPrimarySelection = function() {
        var a = this.getSelection(), b = this.cm, m = b.doc.sel.primary();
        var g = m.from(), h = m.to();
        if (b.display.viewTo == b.display.viewFrom || g.line >= b.display.viewTo || h.line < b.display.viewFrom) {
            a.removeAllRanges();
            return;
        }
        var i = g0(b, a.anchorNode, a.anchorOffset);
        var j = g0(b, a.focusNode, a.focusOffset);
        if (i && !i.bad && j && !j.bad && bC(bG(i, j), g) == 0 && bC(bF(i, j), h) == 0) {
            return;
        }
        var l = b.display.view;
        var d = (g.line >= b.display.viewFrom && gY(b, g)) || {
            node: l[0].measure.map[2],
            offset: 0
        };
        var e = h.line < b.display.viewTo && gY(b, h);
        if (!e) {
            var k = l[l.length - 1].measure;
            var c = k.maps ? k.maps[k.maps.length - 1] : k.map;
            e = {
                node: c[c.length - 1],
                offset: c[c.length - 2] - c[c.length - 3]
            };
        }
        if (!d || !e) {
            a.removeAllRanges();
            return;
        }
        var n = a.rangeCount && a.getRangeAt(0), f;
        try {
            f = K(d.node, d.offset, e.offset, e.node);
        } catch (o) {}
        if (f) {
            if (!E && b.state.focused) {
                a.collapse(d.node, d.offset);
                if (!f.collapsed) {
                    a.removeAllRanges();
                    a.addRange(f);
                }
            } else {
                a.removeAllRanges();
                a.addRange(f);
            }
            if (n && a.anchorNode == null) {
                a.addRange(n);
            } else if (E) {
                this.startGracePeriod();
            }
        }
        this.rememberSelection();
    };
    a.prototype.startGracePeriod = function() {
        var a = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function() {
            a.gracePeriod = false;
            if (a.selectionChanged()) {
                a.cm.operation(function() {
                    return (a.cm.curOp.selectionChanged = true);
                });
            }
        }, 20);
    };
    a.prototype.showMultipleSelections = function(a) {
        ao(this.cm.display.cursorDiv, a.cursors);
        ao(this.cm.display.selectionDiv, a.selection);
    };
    a.prototype.rememberSelection = function() {
        var a = this.getSelection();
        this.lastAnchorNode = a.anchorNode;
        this.lastAnchorOffset = a.anchorOffset;
        this.lastFocusNode = a.focusNode;
        this.lastFocusOffset = a.focusOffset;
    };
    a.prototype.selectionInEditor = function() {
        var a = this.getSelection();
        if (!a.rangeCount) {
            return false;
        }
        var b = a.getRangeAt(0).commonAncestorContainer;
        return ar(this.div, b);
    };
    a.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || as() != this.div) {
                this.showSelection(this.prepareSelection(), true);
            }
            this.div.focus();
        }
    };
    a.prototype.blur = function() {
        this.div.blur();
    };
    a.prototype.getField = function() {
        return this.div;
    };
    a.prototype.supportsTouch = function() {
        return true;
    };
    a.prototype.receivedFocus = function() {
        var b = this;
        var c = this;
        if (this.selectionInEditor()) {
            setTimeout(function() {
                return b.pollSelection();
            }, 20);
        } else {
            et(this.cm, function() {
                return (c.cm.curOp.selectionChanged = true);
            });
        }
        function a() {
            if (c.cm.state.focused) {
                c.pollSelection();
                c.polling.set(c.cm.options.pollInterval, a);
            }
        }
        this.polling.set(this.cm.options.pollInterval, a);
    };
    a.prototype.selectionChanged = function() {
        var a = this.getSelection();
        return (a.anchorNode != this.lastAnchorNode || a.anchorOffset != this.lastAnchorOffset || a.focusNode != this.lastFocusNode || a.focusOffset != this.lastFocusOffset);
    };
    a.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return;
        }
        var a = this.getSelection(), b = this.cm;
        if (S && R && this.cm.display.gutterSpecs.length && gZ(a.anchorNode)) {
            this.cm.triggerOnKeyDown({
                type: "keydown",
                keyCode: 8,
                preventDefault: Math.abs
            });
            this.blur();
            this.focus();
            return;
        }
        if (this.composing) {
            return;
        }
        this.rememberSelection();
        var c = g0(b, a.anchorNode, a.anchorOffset);
        var d = g0(b, a.focusNode, a.focusOffset);
        if (c && d) {
            et(b, function() {
                fo(b.doc, eS(c, d), aA);
                if (c.bad || d.bad) {
                    b.curOp.selectionChanged = true;
                }
            });
        }
    };
    a.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
        }
        var b = this.cm, c = b.display, q = b.doc.sel.primary();
        var f = q.from(), h = q.to();
        if (f.ch == 0 && f.line > b.firstLine()) {
            f = bB(f.line - 1, bt(b.doc, f.line - 1).length);
        }
        if (h.ch == bt(b.doc, h.line).text.length && h.line < b.lastLine()) {
            h = bB(h.line + 1, 0);
        }
        if (f.line < c.viewFrom || h.line > c.viewTo - 1) {
            return false;
        }
        var n, i, m;
        if (f.line == c.viewFrom || (n = dK(b, f.line)) == 0) {
            i = bx(c.view[0].line);
            m = c.view[0].node;
        } else {
            i = bx(c.view[n].line);
            m = c.view[n - 1].node.nextSibling;
        }
        var o = dK(b, h.line);
        var j, p;
        if (o == c.view.length - 1) {
            j = c.viewTo - 1;
            p = c.lineDiv.lastChild;
        } else {
            j = bx(c.view[o + 1].line) - 1;
            p = c.view[o + 1].node.previousSibling;
        }
        if (!m) {
            return false;
        }
        var a = b.doc.splitLines(g_(b, m, p, i, j));
        var d = bu(b.doc, bB(i, 0), bB(j, bt(b.doc, j).text.length));
        while(a.length > 1 && d.length > 1){
            if (aG(a) == aG(d)) {
                a.pop();
                d.pop();
                j--;
            } else if (a[0] == d[0]) {
                a.shift();
                d.shift();
                i++;
            } else {
                break;
            }
        }
        var e = 0, g = 0;
        var r = a[0], s = d[0], v = Math.min(r.length, s.length);
        while(e < v && r.charCodeAt(e) == s.charCodeAt(e)){
            ++e;
        }
        var k = aG(a), l = aG(d);
        var w = Math.min(k.length - (a.length == 1 ? e : 0), l.length - (d.length == 1 ? e : 0));
        while(g < w && k.charCodeAt(k.length - g - 1) == l.charCodeAt(l.length - g - 1)){
            ++g;
        }
        if (a.length == 1 && d.length == 1 && i == f.line) {
            while(e && e > f.ch && k.charCodeAt(k.length - g - 1) == l.charCodeAt(l.length - g - 1)){
                e--;
                g++;
            }
        }
        a[a.length - 1] = k.slice(0, k.length - g).replace(/^\u200b+/, "");
        a[0] = a[0].slice(e).replace(/\u200b+$/, "");
        var t = bB(i, e);
        var u = bB(j, d.length ? aG(d).length - g : 0);
        if (a.length > 1 || a[0] || bC(t, u)) {
            fD(b.doc, a, t, u, "+input");
            return true;
        }
    };
    a.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    };
    a.prototype.reset = function() {
        this.forceCompositionEnd();
    };
    a.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
            return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
    };
    a.prototype.readFromDOMSoon = function() {
        var a = this;
        if (this.readDOMTimeout != null) {
            return;
        }
        this.readDOMTimeout = setTimeout(function() {
            a.readDOMTimeout = null;
            if (a.composing) {
                if (a.composing.done) {
                    a.composing = null;
                } else {
                    return;
                }
            }
            a.updateFromDOM();
        }, 80);
    };
    a.prototype.updateFromDOM = function() {
        var a = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
            et(this.cm, function() {
                return dL(a.cm);
            });
        }
    };
    a.prototype.setUneditable = function(a) {
        a.contentEditable = "false";
    };
    a.prototype.onKeyPress = function(a) {
        if (a.charCode == 0 || this.composing) {
            return;
        }
        a.preventDefault();
        if (!this.cm.isReadOnly()) {
            eu(this.cm, gQ)(this.cm, String.fromCharCode(a.charCode == null ? a.keyCode : a.charCode), 0);
        }
    };
    a.prototype.readOnlyChanged = function(a) {
        this.div.contentEditable = String(a != "nocursor");
    };
    a.prototype.onContextMenu = function() {};
    a.prototype.resetPosition = function() {};
    a.prototype.needsContentAttribute = true;
    function gY(c, a) {
        var d = da(c, a.line);
        if (!d || d.hidden) {
            return null;
        }
        var e = bt(c.doc, a.line);
        var h = c7(d, e, a.line);
        var f = aW(e, c.doc.direction), g = "left";
        if (f) {
            var i = aU(f, a.ch);
            g = i % 2 ? "right" : "left";
        }
        var b = de(h.map, a.ch, g);
        b.offset = b.collapse == "right" ? b.end : b.start;
        return b;
    }
    function gZ(b) {
        for(var a = b; a; a = a.parentNode){
            if (/CodeMirror-gutter-wrapper/.test(a.className)) {
                return true;
            }
        }
        return false;
    }
    function g$(a, b) {
        if (b) {
            a.bad = true;
        }
        return a;
    }
    function g_(b, a, c, g, h) {
        var d = "", i = false, j = b.doc.lineSeparator(), e = false;
        function k(a) {
            return function(b) {
                return b.id == a;
            };
        }
        function l() {
            if (i) {
                d += j;
                if (e) {
                    d += j;
                }
                i = e = false;
            }
        }
        function m(a) {
            if (a) {
                l();
                d += a;
            }
        }
        function f(a) {
            if (a.nodeType == 1) {
                var n = a.getAttribute("cm-text");
                if (n) {
                    m(n);
                    return;
                }
                var o = a.getAttribute("cm-marker"), c;
                if (o) {
                    var p = b.findMarks(bB(g, 0), bB(h + 1, 0), k(+o));
                    if (p.length && (c = p[0].find(0))) {
                        m(bu(b.doc, c.from, c.to).join(j));
                    }
                    return;
                }
                if (a.getAttribute("contenteditable") == "false") {
                    return;
                }
                var q = /^(pre|div|p|li|table|br)$/i.test(a.nodeName);
                if (!/^br$/i.test(a.nodeName) && a.textContent.length == 0) {
                    return;
                }
                if (q) {
                    l();
                }
                for(var d = 0; d < a.childNodes.length; d++){
                    f(a.childNodes[d]);
                }
                if (/^(pre|p)$/i.test(a.nodeName)) {
                    e = true;
                }
                if (q) {
                    i = true;
                }
            } else if (a.nodeType == 3) {
                m(a.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
            }
        }
        for(;;){
            f(a);
            if (a == c) {
                break;
            }
            a = a.nextSibling;
            e = false;
        }
        return d;
    }
    function g0(b, c, d) {
        var a;
        if (c == b.display.lineDiv) {
            a = b.display.lineDiv.childNodes[d];
            if (!a) {
                return g$(b.clipPos(bB(b.display.viewTo - 1)), true);
            }
            c = null;
            d = 0;
        } else {
            for(a = c;; a = a.parentNode){
                if (!a || a == b.display.lineDiv) {
                    return null;
                }
                if (a.parentNode && a.parentNode == b.display.lineDiv) {
                    break;
                }
            }
        }
        for(var e = 0; e < b.display.view.length; e++){
            var f = b.display.view[e];
            if (f.node == a) {
                return g1(f, c, d);
            }
        }
    }
    function g1(d, a, c) {
        var j = d.text.firstChild, i = false;
        if (!a || !ar(j, a)) {
            return g$(bB(bx(d.line), 0), true);
        }
        if (a == j) {
            i = true;
            a = j.childNodes[c];
            c = 0;
            if (!a) {
                var l = d.rest ? aG(d.rest) : d.line;
                return g$(bB(bx(l), l.text.length), i);
            }
        }
        var e = a.nodeType == 3 ? a : null, f = a;
        if (!e && a.childNodes.length == 1 && a.firstChild.nodeType == 3) {
            e = a.firstChild;
            if (c) {
                c = e.nodeValue.length;
            }
        }
        while(f.parentNode != j){
            f = f.parentNode;
        }
        var o = d.measure, p = o.maps;
        function k(g, i, e) {
            for(var a = -1; a < (p ? p.length : 0); a++){
                var c = a < 0 ? o.map : p[a];
                for(var b = 0; b < c.length; b += 3){
                    var f = c[b + 2];
                    if (f == g || f == i) {
                        var j = bx(a < 0 ? d.line : d.rest[a]);
                        var h = c[b] + e;
                        if (e < 0 || f != g) {
                            h = c[b + (e ? 1 : 0)];
                        }
                        return bB(j, h);
                    }
                }
            }
        }
        var b = k(e, f, c);
        if (b) {
            return g$(b, i);
        }
        for(var g = f.nextSibling, m = e ? e.nodeValue.length - c : 0; g; g = g.nextSibling){
            b = k(g, g.firstChild, 0);
            if (b) {
                return g$(bB(b.line, b.ch - m), i);
            } else {
                m += g.textContent.length;
            }
        }
        for(var h = f.previousSibling, n = c; h; h = h.previousSibling){
            b = k(h, h.firstChild, -1);
            if (b) {
                return g$(bB(b.line, b.ch + n), i);
            } else {
                n += h.textContent.length;
            }
        }
    }
    var b = function(a) {
        this.cm = a;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new z();
        this.hasSelection = false;
        this.composing = null;
    };
    b.prototype.init = function(b) {
        var d = this;
        var e = this, f = this.cm;
        this.createField(b);
        var a = this.textarea;
        b.wrapper.insertBefore(this.wrapper, b.wrapper.firstChild);
        if (y) {
            a.style.width = "0px";
        }
        aY(a, "input", function() {
            if (t && P >= 9 && d.hasSelection) {
                d.hasSelection = null;
            }
            e.poll();
        });
        aY(a, "paste", function(a) {
            if (a0(f, a) || gR(a, f)) {
                return;
            }
            f.state.pasteIncoming = +new Date();
            e.fastPoll();
        });
        function c(b) {
            if (a0(f, b)) {
                return;
            }
            if (f.somethingSelected()) {
                gP({
                    lineWise: false,
                    text: f.getSelections()
                });
            } else if (!f.options.lineWiseCopyCut) {
                return;
            } else {
                var c = gT(f);
                gP({
                    lineWise: true,
                    text: c.text
                });
                if (b.type == "cut") {
                    f.setSelections(c.ranges, null, aA);
                } else {
                    e.prevInput = "";
                    a.value = c.text.join("\n");
                    L(a);
                }
            }
            if (b.type == "cut") {
                f.state.cutIncoming = +new Date();
            }
        }
        aY(a, "cut", c);
        aY(a, "copy", c);
        aY(b.scroller, "paste", function(c) {
            if (c_(b, c) || a0(f, c)) {
                return;
            }
            if (!a.dispatchEvent) {
                f.state.pasteIncoming = +new Date();
                e.focus();
                return;
            }
            var d = new Event("paste");
            d.clipboardData = c.clipboardData;
            a.dispatchEvent(d);
        });
        aY(b.lineSpace, "selectstart", function(a) {
            if (!c_(b, a)) {
                a3(a);
            }
        });
        aY(a, "compositionstart", function() {
            var a = f.getCursor("from");
            if (e.composing) {
                e.composing.range.clear();
            }
            e.composing = {
                start: a,
                range: f.markText(a, f.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        });
        aY(a, "compositionend", function() {
            if (e.composing) {
                e.poll();
                e.composing.range.clear();
                e.composing = null;
            }
        });
    };
    b.prototype.createField = function(a) {
        this.wrapper = gV();
        this.textarea = this.wrapper.firstChild;
    };
    b.prototype.screenReaderLabelChanged = function(a) {
        if (a) {
            this.textarea.setAttribute("aria-label", a);
        } else {
            this.textarea.removeAttribute("aria-label");
        }
    };
    b.prototype.prepareSelection = function() {
        var a = this.cm, b = a.display, g = a.doc;
        var c = dS(a);
        if (a.options.moveInputWithCursor) {
            var d = ds(a, g.sel.primary().head, "div");
            var e = b.wrapper.getBoundingClientRect(), f = b.lineDiv.getBoundingClientRect();
            c.teTop = Math.max(0, Math.min(b.wrapper.clientHeight - 10, d.top + f.top - e.top));
            c.teLeft = Math.max(0, Math.min(b.wrapper.clientWidth - 10, d.left + f.left - e.left));
        }
        return c;
    };
    b.prototype.showSelection = function(a) {
        var c = this.cm, b = c.display;
        ao(b.cursorDiv, a.cursors);
        ao(b.selectionDiv, a.selection);
        if (a.teTop != null) {
            this.wrapper.style.top = a.teTop + "px";
            this.wrapper.style.left = a.teLeft + "px";
        }
    };
    b.prototype.reset = function(c) {
        if (this.contextMenuPending || this.composing) {
            return;
        }
        var a = this.cm;
        if (a.somethingSelected()) {
            this.prevInput = "";
            var b = a.getSelection();
            this.textarea.value = b;
            if (a.state.focused) {
                L(this.textarea);
            }
            if (t && P >= 9) {
                this.hasSelection = b;
            }
        } else if (!c) {
            this.prevInput = this.textarea.value = "";
            if (t && P >= 9) {
                this.hasSelection = null;
            }
        }
    };
    b.prototype.getField = function() {
        return this.textarea;
    };
    b.prototype.supportsTouch = function() {
        return false;
    };
    b.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!ag || as() != this.textarea)) {
            try {
                this.textarea.focus();
            } catch (a) {}
        }
    };
    b.prototype.blur = function() {
        this.textarea.blur();
    };
    b.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
    };
    b.prototype.receivedFocus = function() {
        this.slowPoll();
    };
    b.prototype.slowPoll = function() {
        var a = this;
        if (this.pollingFast) {
            return;
        }
        this.polling.set(this.cm.options.pollInterval, function() {
            a.poll();
            if (a.cm.state.focused) {
                a.slowPoll();
            }
        });
    };
    b.prototype.fastPoll = function() {
        var c = false, a = this;
        a.pollingFast = true;
        function b() {
            var d = a.poll();
            if (!d && !c) {
                c = true;
                a.polling.set(60, b);
            } else {
                a.pollingFast = false;
                a.slowPoll();
            }
        }
        a.polling.set(20, b);
    };
    b.prototype.poll = function() {
        var h = this;
        var a = this.cm, e = this.textarea, b = this.prevInput;
        if (this.contextMenuPending || !a.state.focused || (bf(e) && !b && !this.composing) || a.isReadOnly() || a.options.disableInput || a.state.keySeq) {
            return false;
        }
        var c = e.value;
        if (c == b && !a.somethingSelected()) {
            return false;
        }
        if ((t && P >= 9 && this.hasSelection === c) || (J && /[\uf700-\uf7ff]/.test(c))) {
            a.display.input.reset();
            return false;
        }
        if (a.doc.sel == a.display.selForContextMenu) {
            var f = c.charCodeAt(0);
            if (f == 0x200b && !b) {
                b = "\u200b";
            }
            if (f == 0x21da) {
                this.reset();
                return this.cm.execCommand("undo");
            }
        }
        var d = 0, g = Math.min(b.length, c.length);
        while(d < g && b.charCodeAt(d) == c.charCodeAt(d)){
            ++d;
        }
        et(a, function() {
            gQ(a, c.slice(d), b.length - d, null, h.composing ? "*compose" : null);
            if (c.length > 1000 || c.indexOf("\n") > -1) {
                e.value = h.prevInput = "";
            } else {
                h.prevInput = c;
            }
            if (h.composing) {
                h.composing.range.clear();
                h.composing.range = a.markText(h.composing.start, a.getCursor("to"), {
                    className: "CodeMirror-composing"
                });
            }
        });
        return true;
    };
    b.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) {
            this.pollingFast = false;
        }
    };
    b.prototype.onKeyPress = function() {
        if (t && P >= 9) {
            this.hasSelection = null;
        }
        this.fastPoll();
    };
    b.prototype.onContextMenu = function(d) {
        var a = this, b = a.cm, c = b.display, e = a.textarea;
        if (a.contextMenuPending) {
            a.contextMenuPending();
        }
        var f = dJ(b, d), m = c.scroller.scrollTop;
        if (!f || x) {
            return;
        }
        var i = b.options.resetSelectionOnContextMenu;
        if (i && b.doc.sel.contains(f) == -1) {
            eu(b, fo)(b.doc, eS(f), aA);
        }
        var n = e.style.cssText, o = a.wrapper.style.cssText;
        var g = a.wrapper.offsetParent.getBoundingClientRect();
        a.wrapper.style.cssText = "position: static";
        e.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (d.clientY - g.top - 5) + "px; left: " + (d.clientX - g.left - 5) + "px;\n      z-index: 1000; background: " + (t ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var h;
        if (H) {
            h = window.scrollY;
        }
        c.input.focus();
        if (H) {
            window.scrollTo(null, h);
        }
        c.input.reset();
        if (!b.somethingSelected()) {
            e.value = a.prevInput = " ";
        }
        a.contextMenuPending = k;
        c.selForContextMenu = b.doc.sel;
        clearTimeout(c.detectingSelectAll);
        function j() {
            if (e.selectionStart != null) {
                var d = b.somethingSelected();
                var f = "\u200b" + (d ? e.value : "");
                e.value = "\u21da";
                e.value = f;
                a.prevInput = d ? "" : "\u200b";
                e.selectionStart = 1;
                e.selectionEnd = f.length;
                c.selForContextMenu = b.doc.sel;
            }
        }
        function k() {
            if (a.contextMenuPending != k) {
                return;
            }
            a.contextMenuPending = false;
            a.wrapper.style.cssText = o;
            e.style.cssText = n;
            if (t && P < 9) {
                c.scrollbars.setScrollTop((c.scroller.scrollTop = m));
            }
            if (e.selectionStart != null) {
                if (!t || (t && P < 9)) {
                    j();
                }
                var f = 0, d = function() {
                    if (c.selForContextMenu == b.doc.sel && e.selectionStart == 0 && e.selectionEnd > 0 && a.prevInput == "\u200b") {
                        eu(b, W)(b);
                    } else if (f++ < 10) {
                        c.detectingSelectAll = setTimeout(d, 500);
                    } else {
                        c.selForContextMenu = null;
                        c.input.reset();
                    }
                };
                c.detectingSelectAll = setTimeout(d, 200);
            }
        }
        if (t && P >= 9) {
            j();
        }
        if (ak) {
            a6(d);
            var l = function() {
                a$(window, "mouseup", l);
                setTimeout(k, 20);
            };
            aY(window, "mouseup", l);
        } else {
            setTimeout(k, 50);
        }
    };
    b.prototype.readOnlyChanged = function(a) {
        if (!a) {
            this.reset();
        }
        this.textarea.disabled = a == "nocursor";
        this.textarea.readOnly = !!a;
    };
    b.prototype.setUneditable = function() {};
    b.prototype.needsContentAttribute = false;
    function ab(b, a) {
        a = a ? aw(a) : {};
        a.value = b.value;
        if (!a.tabindex && b.tabIndex) {
            a.tabindex = b.tabIndex;
        }
        if (!a.placeholder && b.placeholder) {
            a.placeholder = b.placeholder;
        }
        if (a.autofocus == null) {
            var c = as();
            a.autofocus = c == b || (b.getAttribute("autofocus") != null && c == document.body);
        }
        function f() {
            b.value = h.getValue();
        }
        var g;
        if (b.form) {
            aY(b.form, "submit", f);
            if (!a.leaveSubmitMethodAlone) {
                var d = b.form;
                g = d.submit;
                try {
                    var i = (d.submit = function() {
                        f();
                        d.submit = g;
                        d.submit();
                        d.submit = i;
                    });
                } catch (j) {}
            }
        }
        a.finishInit = function(c) {
            c.save = f;
            c.getTextArea = function() {
                return b;
            };
            c.toTextArea = function() {
                c.toTextArea = isNaN;
                f();
                b.parentNode.removeChild(c.getWrapperElement());
                b.style.display = "";
                if (b.form) {
                    a$(b.form, "submit", f);
                    if (!a.leaveSubmitMethodAlone && typeof b.form.submit == "function") {
                        b.form.submit = g;
                    }
                }
            };
        };
        b.style.display = "none";
        var h = e(function(a) {
            return b.parentNode.insertBefore(a, b.nextSibling);
        }, a);
        return h;
    }
    function ac(a) {
        a.off = a$;
        a.on = aY;
        a.wheelEventPixels = eP;
        a.Doc = g;
        a.splitLines = be;
        a.countColumn = ax;
        a.findColumn = aD;
        a.isWordChar = aL;
        a.Pass = az;
        a.signal = a_;
        a.Line = M;
        a.changeEnd = eT;
        a.scrollbarModel = ei;
        a.Pos = bB;
        a.cmpPos = bC;
        a.modes = bj;
        a.mimeModes = bk;
        a.resolveMode = bm;
        a.getMode = bn;
        a.modeExtensions = bo;
        a.extendMode = bp;
        a.copyState = bq;
        a.startState = bs;
        a.innerMode = br;
        a.commands = gb;
        a.keyMap = j;
        a.keyName = f4;
        a.isModifierKey = f2;
        a.lookupKey = f1;
        a.normalizeKeyMap = f0;
        a.StringStream = d;
        a.SharedTextMarker = C;
        a.TextMarker = k;
        a.LineWidget = B;
        a.e_preventDefault = a3;
        a.e_stopPropagation = a4;
        a.e_stop = a6;
        a.addClass = at;
        a.contains = ar;
        a.rmClass = am;
        a.keyNames = p;
    }
    _(e);
    aa(e);
    var ad = "iter insert remove copy getEditor constructor".split(" ");
    for(var w in g.prototype){
        if (g.prototype.hasOwnProperty(w) && T(ad, w) < 0) {
            e.prototype[w] = (function(a) {
                return function() {
                    return a.apply(this.doc, arguments);
                };
            })(g.prototype[w]);
        }
    }
    l(g);
    e.inputStyles = {
        textarea: b,
        contenteditable: a
    };
    e.defineMode = function(a) {
        if (!e.defaults.mode && a != "null") {
            e.defaults.mode = a;
        }
        bl.apply(this, arguments);
    };
    e.defineMIME = V;
    e.defineMode("null", function() {
        return {
            token: function(a) {
                return a.skipToEnd();
            }
        };
    });
    e.defineMIME("text/plain", "null");
    e.defineExtension = function(a, b) {
        e.prototype[a] = b;
    };
    e.defineDocExtension = function(a, b) {
        g.prototype[a] = b;
    };
    e.fromTextArea = ab;
    ac(e);
    e.version = "5.65.1";
    return e;
});
