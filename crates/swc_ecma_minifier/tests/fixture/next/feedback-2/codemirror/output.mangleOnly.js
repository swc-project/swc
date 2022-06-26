(function(a, b) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = b()) : typeof define === "function" && define.amd ? define(b) : ((a = a || self), (a.CodeMirror = b()));
})(this, function() {
    "use strict";
    var a = navigator.userAgent;
    var b = navigator.platform;
    var c = /gecko\/\d/i.test(a);
    var d = /MSIE \d/.test(a);
    var e = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(a);
    var f = /Edge\/(\d+)/.exec(a);
    var g = d || e || f;
    var h = g && (d ? document.documentMode || 6 : +(f || e)[1]);
    var i = !f && /WebKit\//.test(a);
    var j = i && /Qt\/\d+\.\d+/.test(a);
    var k = !f && /Chrome\//.test(a);
    var l = /Opera\//.test(a);
    var m = /Apple Computer/.test(navigator.vendor);
    var n = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(a);
    var o = /PhantomJS/.test(a);
    var p = m && (/Mobile\/\w+/.test(a) || navigator.maxTouchPoints > 2);
    var q = /Android/.test(a);
    var r = p || q || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(a);
    var s = p || /Mac/.test(b);
    var t = /\bCrOS\b/.test(a);
    var u = /win/i.test(b);
    var v = l && a.match(/Version\/(\d*\.\d*)/);
    if (v) {
        v = Number(v[1]);
    }
    if (v && v >= 15) {
        l = false;
        i = true;
    }
    var w = s && (j || (l && (v == null || v < 12.11)));
    var x = c || (g && h >= 9);
    function y(a) {
        return new RegExp("(^|\\s)" + a + "(?:$|\\s)\\s*");
    }
    var z = function(a, b) {
        var c = a.className;
        var d = y(b).exec(c);
        if (d) {
            var e = c.slice(d.index + d[0].length);
            a.className = c.slice(0, d.index) + (e ? d[1] + e : "");
        }
    };
    function A(a) {
        for(var b = a.childNodes.length; b > 0; --b){
            a.removeChild(a.firstChild);
        }
        return a;
    }
    function B(a, b) {
        return A(a).appendChild(b);
    }
    function C(a, b, c, d) {
        var e = document.createElement(a);
        if (c) {
            e.className = c;
        }
        if (d) {
            e.style.cssText = d;
        }
        if (typeof b == "string") {
            e.appendChild(document.createTextNode(b));
        } else if (b) {
            for(var f = 0; f < b.length; ++f){
                e.appendChild(b[f]);
            }
        }
        return e;
    }
    function D(a, b, c, d) {
        var e = C(a, b, c, d);
        e.setAttribute("role", "presentation");
        return e;
    }
    var E;
    if (document.createRange) {
        E = function(a, b, c, d) {
            var e = document.createRange();
            e.setEnd(d || a, c);
            e.setStart(a, b);
            return e;
        };
    } else {
        E = function(a, b, c) {
            var d = document.body.createTextRange();
            try {
                d.moveToElementText(a.parentNode);
            } catch (e) {
                return d;
            }
            d.collapse(true);
            d.moveEnd("character", c);
            d.moveStart("character", b);
            return d;
        };
    }
    function F(a, b) {
        if (b.nodeType == 3) {
            b = b.parentNode;
        }
        if (a.contains) {
            return a.contains(b);
        }
        do {
            if (b.nodeType == 11) {
                b = b.host;
            }
            if (b == a) {
                return true;
            }
        }while ((b = b.parentNode))
    }
    function G() {
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
    function H(a, b) {
        var c = a.className;
        if (!y(b).test(c)) {
            a.className += (c ? " " : "") + b;
        }
    }
    function I(a, b) {
        var c = a.split(" ");
        for(var d = 0; d < c.length; d++){
            if (c[d] && !y(c[d]).test(b)) {
                b += " " + c[d];
            }
        }
        return b;
    }
    var J = function(a) {
        a.select();
    };
    if (p) {
        J = function(a) {
            a.selectionStart = 0;
            a.selectionEnd = a.value.length;
        };
    } else if (g) {
        J = function(a) {
            try {
                a.select();
            } catch (b) {}
        };
    }
    function K(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return function() {
            return a.apply(null, b);
        };
    }
    function L(a, b, c) {
        if (!b) {
            b = {};
        }
        for(var d in a){
            if (a.hasOwnProperty(d) && (c !== false || !b.hasOwnProperty(d))) {
                b[d] = a[d];
            }
        }
        return b;
    }
    function M(a, b, c, d, e) {
        if (b == null) {
            b = a.search(/[^\s\u00a0]/);
            if (b == -1) {
                b = a.length;
            }
        }
        for(var f = d || 0, g = e || 0;;){
            var h = a.indexOf("\t", f);
            if (h < 0 || h >= b) {
                return g + (b - f);
            }
            g += h - f;
            g += c - (g % c);
            f = h + 1;
        }
    }
    var N = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = K(this.onTimeout, this);
    };
    N.prototype.onTimeout = function(a) {
        a.id = 0;
        if (a.time <= +new Date()) {
            a.f();
        } else {
            setTimeout(a.handler, a.time - +new Date());
        }
    };
    N.prototype.set = function(a, b) {
        this.f = b;
        var c = +new Date() + a;
        if (!this.id || c < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, a);
            this.time = c;
        }
    };
    function O(a, b) {
        for(var c = 0; c < a.length; ++c){
            if (a[c] == b) {
                return c;
            }
        }
        return -1;
    }
    var P = 50;
    var Q = {
        toString: function() {
            return "CodeMirror.Pass";
        }
    };
    var R = {
        scroll: false
    }, S = {
        origin: "*mouse"
    }, T = {
        origin: "+move"
    };
    function U(a, b, c) {
        for(var d = 0, e = 0;;){
            var f = a.indexOf("\t", d);
            if (f == -1) {
                f = a.length;
            }
            var g = f - d;
            if (f == a.length || e + g >= b) {
                return d + Math.min(g, b - e);
            }
            e += f - d;
            e += c - (e % c);
            d = f + 1;
            if (e >= b) {
                return d;
            }
        }
    }
    var V = [
        ""
    ];
    function W(a) {
        while(V.length <= a){
            V.push(X(V) + " ");
        }
        return V[a];
    }
    function X(a) {
        return a[a.length - 1];
    }
    function Y(a, b) {
        var c = [];
        for(var d = 0; d < a.length; d++){
            c[d] = b(a[d], d);
        }
        return c;
    }
    function Z(a, b, c) {
        var d = 0, e = c(b);
        while(d < a.length && c(a[d]) <= e){
            d++;
        }
        a.splice(d, 0, b);
    }
    function $() {}
    function _(a, b) {
        var c;
        if (Object.create) {
            c = Object.create(a);
        } else {
            $.prototype = a;
            c = new $();
        }
        if (b) {
            L(b, c);
        }
        return c;
    }
    var aa = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function ab(a) {
        return (/\w/.test(a) || (a > "\x80" && (a.toUpperCase() != a.toLowerCase() || aa.test(a))));
    }
    function ac(a, b) {
        if (!b) {
            return ab(a);
        }
        if (b.source.indexOf("\\w") > -1 && ab(a)) {
            return true;
        }
        return b.test(a);
    }
    function ad(a) {
        for(var b in a){
            if (a.hasOwnProperty(b) && a[b]) {
                return false;
            }
        }
        return true;
    }
    var ae = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function af(a) {
        return a.charCodeAt(0) >= 768 && ae.test(a);
    }
    function ag(a, b, c) {
        while((c < 0 ? b > 0 : b < a.length) && af(a.charAt(b))){
            b += c;
        }
        return b;
    }
    function ah(a, b, c) {
        var d = b > c ? -1 : 1;
        for(;;){
            if (b == c) {
                return b;
            }
            var e = (b + c) / 2, f = d < 0 ? Math.ceil(e) : Math.floor(e);
            if (f == b) {
                return a(f) ? b : c;
            }
            if (a(f)) {
                c = f;
            } else {
                b = f + d;
            }
        }
    }
    function ai(a, b, c, d) {
        if (!a) {
            return d(b, c, "ltr", 0);
        }
        var e = false;
        for(var f = 0; f < a.length; ++f){
            var g = a[f];
            if ((g.from < c && g.to > b) || (b == c && g.to == b)) {
                d(Math.max(g.from, b), Math.min(g.to, c), g.level == 1 ? "rtl" : "ltr", f);
                e = true;
            }
        }
        if (!e) {
            d(b, c, "ltr");
        }
    }
    var aj = null;
    function ak(a, b, c) {
        var d;
        aj = null;
        for(var e = 0; e < a.length; ++e){
            var f = a[e];
            if (f.from < b && f.to > b) {
                return e;
            }
            if (f.to == b) {
                if (f.from != f.to && c == "before") {
                    d = e;
                } else {
                    aj = e;
                }
            }
            if (f.from == b) {
                if (f.from != f.to && c != "before") {
                    d = e;
                } else {
                    aj = e;
                }
            }
        }
        return d != null ? d : aj;
    }
    var al = (function() {
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
        return function(a, b) {
            var j = b == "ltr" ? "L" : "R";
            if (a.length == 0 || (b == "ltr" && !d.test(a))) {
                return false;
            }
            var k = a.length, l = [];
            for(var m = 0; m < k; ++m){
                l.push(c(a.charCodeAt(m)));
            }
            for(var n = 0, o = j; n < k; ++n){
                var p = l[n];
                if (p == "m") {
                    l[n] = o;
                } else {
                    o = p;
                }
            }
            for(var q = 0, r = j; q < k; ++q){
                var s = l[q];
                if (s == "1" && r == "r") {
                    l[q] = "n";
                } else if (f.test(s)) {
                    r = s;
                    if (s == "r") {
                        l[q] = "R";
                    }
                }
            }
            for(var t = 1, u = l[0]; t < k - 1; ++t){
                var v = l[t];
                if (v == "+" && u == "1" && l[t + 1] == "1") {
                    l[t] = "1";
                } else if (v == "," && u == l[t + 1] && (u == "1" || u == "n")) {
                    l[t] = u;
                }
                u = v;
            }
            for(var w = 0; w < k; ++w){
                var x = l[w];
                if (x == ",") {
                    l[w] = "N";
                } else if (x == "%") {
                    var y = void 0;
                    for(y = w + 1; y < k && l[y] == "%"; ++y){}
                    var z = (w && l[w - 1] == "!") || (y < k && l[y] == "1") ? "1" : "N";
                    for(var A = w; A < y; ++A){
                        l[A] = z;
                    }
                    w = y - 1;
                }
            }
            for(var B = 0, C = j; B < k; ++B){
                var D = l[B];
                if (C == "L" && D == "1") {
                    l[B] = "L";
                } else if (f.test(D)) {
                    C = D;
                }
            }
            for(var E = 0; E < k; ++E){
                if (e.test(l[E])) {
                    var F = void 0;
                    for(F = E + 1; F < k && e.test(l[F]); ++F){}
                    var G = (E ? l[E - 1] : j) == "L";
                    var H = (F < k ? l[F] : j) == "L";
                    var I = G == H ? (G ? "L" : "R") : j;
                    for(var J = E; J < F; ++J){
                        l[J] = I;
                    }
                    E = F - 1;
                }
            }
            var K = [], L;
            for(var M = 0; M < k;){
                if (g.test(l[M])) {
                    var N = M;
                    for(++M; M < k && g.test(l[M]); ++M){}
                    K.push(new i(0, N, M));
                } else {
                    var O = M, P = K.length, Q = b == "rtl" ? 1 : 0;
                    for(++M; M < k && l[M] != "L"; ++M){}
                    for(var R = O; R < M;){
                        if (h.test(l[R])) {
                            if (O < R) {
                                K.splice(P, 0, new i(1, O, R));
                                P += Q;
                            }
                            var S = R;
                            for(++R; R < M && h.test(l[R]); ++R){}
                            K.splice(P, 0, new i(2, S, R));
                            P += Q;
                            O = R;
                        } else {
                            ++R;
                        }
                    }
                    if (O < M) {
                        K.splice(P, 0, new i(1, O, M));
                    }
                }
            }
            if (b == "ltr") {
                if (K[0].level == 1 && (L = a.match(/^\s+/))) {
                    K[0].from = L[0].length;
                    K.unshift(new i(0, 0, L[0].length));
                }
                if (X(K).level == 1 && (L = a.match(/\s+$/))) {
                    X(K).to -= L[0].length;
                    K.push(new i(0, k - L[0].length, k));
                }
            }
            return b == "rtl" ? K.reverse() : K;
        };
    })();
    function am(a, b) {
        var c = a.order;
        if (c == null) {
            c = a.order = al(a.text, b);
        }
        return c;
    }
    var an = [];
    var ao = function(a, b, c) {
        if (a.addEventListener) {
            a.addEventListener(b, c, false);
        } else if (a.attachEvent) {
            a.attachEvent("on" + b, c);
        } else {
            var d = a._handlers || (a._handlers = {});
            d[b] = (d[b] || an).concat(c);
        }
    };
    function ap(a, b) {
        return (a._handlers && a._handlers[b]) || an;
    }
    function aq(a, b, c) {
        if (a.removeEventListener) {
            a.removeEventListener(b, c, false);
        } else if (a.detachEvent) {
            a.detachEvent("on" + b, c);
        } else {
            var d = a._handlers, e = d && d[b];
            if (e) {
                var f = O(e, c);
                if (f > -1) {
                    d[b] = e.slice(0, f).concat(e.slice(f + 1));
                }
            }
        }
    }
    function ar(a, b) {
        var c = ap(a, b);
        if (!c.length) {
            return;
        }
        var d = Array.prototype.slice.call(arguments, 2);
        for(var e = 0; e < c.length; ++e){
            c[e].apply(null, d);
        }
    }
    function as(a, b, c) {
        if (typeof b == "string") {
            b = {
                type: b,
                preventDefault: function() {
                    this.defaultPrevented = true;
                }
            };
        }
        ar(a, c || b.type, a, b);
        return ay(b) || b.codemirrorIgnore;
    }
    function at(a) {
        var b = a._handlers && a._handlers.cursorActivity;
        if (!b) {
            return;
        }
        var c = a.curOp.cursorActivityHandlers || (a.curOp.cursorActivityHandlers = []);
        for(var d = 0; d < b.length; ++d){
            if (O(c, b[d]) == -1) {
                c.push(b[d]);
            }
        }
    }
    function au(a, b) {
        return ap(a, b).length > 0;
    }
    function av(a) {
        a.prototype.on = function(a, b) {
            ao(this, a, b);
        };
        a.prototype.off = function(a, b) {
            aq(this, a, b);
        };
    }
    function aw(a) {
        if (a.preventDefault) {
            a.preventDefault();
        } else {
            a.returnValue = false;
        }
    }
    function ax(a) {
        if (a.stopPropagation) {
            a.stopPropagation();
        } else {
            a.cancelBubble = true;
        }
    }
    function ay(a) {
        return a.defaultPrevented != null ? a.defaultPrevented : a.returnValue == false;
    }
    function az(a) {
        aw(a);
        ax(a);
    }
    function aA(a) {
        return a.target || a.srcElement;
    }
    function aB(a) {
        var b = a.which;
        if (b == null) {
            if (a.button & 1) {
                b = 1;
            } else if (a.button & 2) {
                b = 3;
            } else if (a.button & 4) {
                b = 2;
            }
        }
        if (s && a.ctrlKey && b == 1) {
            b = 3;
        }
        return b;
    }
    var aC = (function() {
        if (g && h < 9) {
            return false;
        }
        var a = C("div");
        return "draggable" in a || "dragDrop" in a;
    })();
    var aD;
    function aE(a) {
        if (aD == null) {
            var b = C("span", "\u200b");
            B(a, C("span", [
                b,
                document.createTextNode("x")
            ]));
            if (a.firstChild.offsetHeight != 0) {
                aD = b.offsetWidth <= 1 && b.offsetHeight > 2 && !(g && h < 8);
            }
        }
        var c = aD ? C("span", "\u200b") : C("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        c.setAttribute("cm-text", "");
        return c;
    }
    var aF;
    function aG(a) {
        if (aF != null) {
            return aF;
        }
        var b = B(a, document.createTextNode("A\u062eA"));
        var c = E(b, 0, 1).getBoundingClientRect();
        var d = E(b, 1, 2).getBoundingClientRect();
        A(a);
        if (!c || c.left == c.right) {
            return false;
        }
        return (aF = d.right - c.right < 3);
    }
    var aH = "\n\nb".split(/\n/).length != 3 ? function(a) {
        var b = 0, c = [], d = a.length;
        while(b <= d){
            var e = a.indexOf("\n", b);
            if (e == -1) {
                e = a.length;
            }
            var f = a.slice(b, a.charAt(e - 1) == "\r" ? e - 1 : e);
            var g = f.indexOf("\r");
            if (g != -1) {
                c.push(f.slice(0, g));
                b += g + 1;
            } else {
                c.push(f);
                b = e + 1;
            }
        }
        return c;
    } : function(a) {
        return a.split(/\r\n?|\n/);
    };
    var aI = window.getSelection ? function(a) {
        try {
            return a.selectionStart != a.selectionEnd;
        } catch (b) {
            return false;
        }
    } : function(a) {
        var b;
        try {
            b = a.ownerDocument.selection.createRange();
        } catch (c) {}
        if (!b || b.parentElement() != a) {
            return false;
        }
        return b.compareEndPoints("StartToEnd", b) != 0;
    };
    var aJ = (function() {
        var a = C("div");
        if ("oncopy" in a) {
            return true;
        }
        a.setAttribute("oncopy", "return;");
        return typeof a.oncopy == "function";
    })();
    var aK = null;
    function aL(a) {
        if (aK != null) {
            return aK;
        }
        var b = B(a, C("span", "x"));
        var c = b.getBoundingClientRect();
        var d = E(b, 0, 1).getBoundingClientRect();
        return (aK = Math.abs(c.left - d.left) > 1);
    }
    var aM = {}, aN = {};
    function aO(a, b) {
        if (arguments.length > 2) {
            b.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        aM[a] = b;
    }
    function aP(a, b) {
        aN[a] = b;
    }
    function aQ(a) {
        if (typeof a == "string" && aN.hasOwnProperty(a)) {
            a = aN[a];
        } else if (a && typeof a.name == "string" && aN.hasOwnProperty(a.name)) {
            var b = aN[a.name];
            if (typeof b == "string") {
                b = {
                    name: b
                };
            }
            a = _(b, a);
            a.name = b.name;
        } else if (typeof a == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(a)) {
            return aQ("application/xml");
        } else if (typeof a == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(a)) {
            return aQ("application/json");
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
    function aR(a, b) {
        b = aQ(b);
        var c = aM[b.name];
        if (!c) {
            return aR(a, "text/plain");
        }
        var d = c(a, b);
        if (aS.hasOwnProperty(b.name)) {
            var e = aS[b.name];
            for(var f in e){
                if (!e.hasOwnProperty(f)) {
                    continue;
                }
                if (d.hasOwnProperty(f)) {
                    d["_" + f] = d[f];
                }
                d[f] = e[f];
            }
        }
        d.name = b.name;
        if (b.helperType) {
            d.helperType = b.helperType;
        }
        if (b.modeProps) {
            for(var g in b.modeProps){
                d[g] = b.modeProps[g];
            }
        }
        return d;
    }
    var aS = {};
    function aT(a, b) {
        var c = aS.hasOwnProperty(a) ? aS[a] : (aS[a] = {});
        L(b, c);
    }
    function aU(a, b) {
        if (b === true) {
            return b;
        }
        if (a.copyState) {
            return a.copyState(b);
        }
        var c = {};
        for(var d in b){
            var e = b[d];
            if (e instanceof Array) {
                e = e.concat([]);
            }
            c[d] = e;
        }
        return c;
    }
    function aV(a, b) {
        var c;
        while(a.innerMode){
            c = a.innerMode(b);
            if (!c || c.mode == a) {
                break;
            }
            b = c.state;
            a = c.mode;
        }
        return c || {
            mode: a,
            state: b
        };
    }
    function aW(a, b, c) {
        return a.startState ? a.startState(b, c) : true;
    }
    var aX = function(a, b, c) {
        this.pos = this.start = 0;
        this.string = a;
        this.tabSize = b || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = c;
    };
    aX.prototype.eol = function() {
        return this.pos >= this.string.length;
    };
    aX.prototype.sol = function() {
        return this.pos == this.lineStart;
    };
    aX.prototype.peek = function() {
        return this.string.charAt(this.pos) || undefined;
    };
    aX.prototype.next = function() {
        if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++);
        }
    };
    aX.prototype.eat = function(a) {
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
    aX.prototype.eatWhile = function(a) {
        var b = this.pos;
        while(this.eat(a)){}
        return this.pos > b;
    };
    aX.prototype.eatSpace = function() {
        var a = this.pos;
        while(/[\s\u00a0]/.test(this.string.charAt(this.pos))){
            ++this.pos;
        }
        return this.pos > a;
    };
    aX.prototype.skipToEnd = function() {
        this.pos = this.string.length;
    };
    aX.prototype.skipTo = function(a) {
        var b = this.string.indexOf(a, this.pos);
        if (b > -1) {
            this.pos = b;
            return true;
        }
    };
    aX.prototype.backUp = function(a) {
        this.pos -= a;
    };
    aX.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = M(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return (this.lastColumnValue - (this.lineStart ? M(this.string, this.lineStart, this.tabSize) : 0));
    };
    aX.prototype.indentation = function() {
        return (M(this.string, null, this.tabSize) - (this.lineStart ? M(this.string, this.lineStart, this.tabSize) : 0));
    };
    aX.prototype.match = function(a, b, c) {
        if (typeof a == "string") {
            var d = function(a) {
                return c ? a.toLowerCase() : a;
            };
            var e = this.string.substr(this.pos, a.length);
            if (d(e) == d(a)) {
                if (b !== false) {
                    this.pos += a.length;
                }
                return true;
            }
        } else {
            var f = this.string.slice(this.pos).match(a);
            if (f && f.index > 0) {
                return null;
            }
            if (f && b !== false) {
                this.pos += f[0].length;
            }
            return f;
        }
    };
    aX.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
    };
    aX.prototype.hideFirstChars = function(a, b) {
        this.lineStart += a;
        try {
            return b();
        } finally{
            this.lineStart -= a;
        }
    };
    aX.prototype.lookAhead = function(a) {
        var b = this.lineOracle;
        return b && b.lookAhead(a);
    };
    aX.prototype.baseToken = function() {
        var a = this.lineOracle;
        return a && a.baseToken(this.pos);
    };
    function aY(a, b) {
        b -= a.first;
        if (b < 0 || b >= a.size) {
            throw new Error("There is no line " + (b + a.first) + " in the document.");
        }
        var c = a;
        while(!c.lines){
            for(var d = 0;; ++d){
                var e = c.children[d], f = e.chunkSize();
                if (b < f) {
                    c = e;
                    break;
                }
                b -= f;
            }
        }
        return c.lines[b];
    }
    function aZ(a, b, c) {
        var d = [], e = b.line;
        a.iter(b.line, c.line + 1, function(a) {
            var f = a.text;
            if (e == c.line) {
                f = f.slice(0, c.ch);
            }
            if (e == b.line) {
                f = f.slice(b.ch);
            }
            d.push(f);
            ++e;
        });
        return d;
    }
    function a$(a, b, c) {
        var d = [];
        a.iter(b, c, function(a) {
            d.push(a.text);
        });
        return d;
    }
    function a_(a, b) {
        var c = b - a.height;
        if (c) {
            for(var d = a; d; d = d.parent){
                d.height += c;
            }
        }
    }
    function a0(a) {
        if (a.parent == null) {
            return null;
        }
        var b = a.parent, c = O(b.lines, a);
        for(var d = b.parent; d; b = d, d = d.parent){
            for(var e = 0;; ++e){
                if (d.children[e] == b) {
                    break;
                }
                c += d.children[e].chunkSize();
            }
        }
        return c + b.first;
    }
    function a1(a, b) {
        var c = a.first;
        outer: do {
            for(var d = 0; d < a.children.length; ++d){
                var e = a.children[d], f = e.height;
                if (b < f) {
                    a = e;
                    continue outer;
                }
                b -= f;
                c += e.chunkSize();
            }
            return c;
        }while (!a.lines)
        var g = 0;
        for(; g < a.lines.length; ++g){
            var h = a.lines[g], i = h.height;
            if (b < i) {
                break;
            }
            b -= i;
        }
        return c + g;
    }
    function a2(a, b) {
        return b >= a.first && b < a.first + a.size;
    }
    function a3(a, b) {
        return String(a.lineNumberFormatter(b + a.firstLineNumber));
    }
    function a4(a, b, c) {
        if (c === void 0) c = null;
        if (!(this instanceof a4)) {
            return new a4(a, b, c);
        }
        this.line = a;
        this.ch = b;
        this.sticky = c;
    }
    function a5(a, b) {
        return a.line - b.line || a.ch - b.ch;
    }
    function a6(a, b) {
        return a.sticky == b.sticky && a5(a, b) == 0;
    }
    function a7(a) {
        return a4(a.line, a.ch);
    }
    function a8(a, b) {
        return a5(a, b) < 0 ? b : a;
    }
    function a9(a, b) {
        return a5(a, b) < 0 ? a : b;
    }
    function ba(a, b) {
        return Math.max(a.first, Math.min(b, a.first + a.size - 1));
    }
    function bb(a, b) {
        if (b.line < a.first) {
            return a4(a.first, 0);
        }
        var c = a.first + a.size - 1;
        if (b.line > c) {
            return a4(c, aY(a, c).text.length);
        }
        return bc(b, aY(a, b.line).text.length);
    }
    function bc(a, b) {
        var c = a.ch;
        if (c == null || c > b) {
            return a4(a.line, b);
        } else if (c < 0) {
            return a4(a.line, 0);
        } else {
            return a;
        }
    }
    function bd(a, b) {
        var c = [];
        for(var d = 0; d < b.length; d++){
            c[d] = bb(a, b[d]);
        }
        return c;
    }
    var be = function(a, b) {
        this.state = a;
        this.lookAhead = b;
    };
    var bf = function(a, b, c, d) {
        this.state = b;
        this.doc = a;
        this.line = c;
        this.maxLookAhead = d || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
    };
    bf.prototype.lookAhead = function(a) {
        var b = this.doc.getLine(this.line + a);
        if (b != null && a > this.maxLookAhead) {
            this.maxLookAhead = a;
        }
        return b;
    };
    bf.prototype.baseToken = function(a) {
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
    bf.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) {
            this.maxLookAhead--;
        }
    };
    bf.fromSaved = function(a, b, c) {
        if (b instanceof be) {
            return new bf(a, aU(a.mode, b.state), c, b.lookAhead);
        } else {
            return new bf(a, aU(a.mode, b), c);
        }
    };
    bf.prototype.save = function(a) {
        var b = a !== false ? aU(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new be(b, this.maxLookAhead) : b;
    };
    function bg(a, b, c, d) {
        var e = [
            a.state.modeGen
        ], f = {};
        bp(a, b.text, a.doc.mode, c, function(a, b) {
            return e.push(a, b);
        }, f, d);
        var g = c.state;
        var h = function(d) {
            c.baseTokens = e;
            var h = a.state.overlays[d], i = 1, j = 0;
            c.state = true;
            bp(a, b.text, h.mode, c, function(a, b) {
                var c = i;
                while(j < a){
                    var d = e[i];
                    if (d > a) {
                        e.splice(i, 1, a, e[i + 1], d);
                    }
                    i += 2;
                    j = Math.min(a, d);
                }
                if (!b) {
                    return;
                }
                if (h.opaque) {
                    e.splice(c, i - c, a, "overlay " + b);
                    i = c + 2;
                } else {
                    for(; c < i; c += 2){
                        var f = e[c + 1];
                        e[c + 1] = (f ? f + " " : "") + "overlay " + b;
                    }
                }
            }, f);
            c.state = g;
            c.baseTokens = null;
            c.baseTokenPos = 1;
        };
        for(var i = 0; i < a.state.overlays.length; ++i)h(i);
        return {
            styles: e,
            classes: f.bgClass || f.textClass ? f : null
        };
    }
    function bh(a, b, c) {
        if (!b.styles || b.styles[0] != a.state.modeGen) {
            var d = bi(a, a0(b));
            var e = b.text.length > a.options.maxHighlightLength && aU(a.doc.mode, d.state);
            var f = bg(a, b, d);
            if (e) {
                d.state = e;
            }
            b.stateAfter = d.save(!e);
            b.styles = f.styles;
            if (f.classes) {
                b.styleClasses = f.classes;
            } else if (b.styleClasses) {
                b.styleClasses = null;
            }
            if (c === a.doc.highlightFrontier) {
                a.doc.modeFrontier = Math.max(a.doc.modeFrontier, ++a.doc.highlightFrontier);
            }
        }
        return b.styles;
    }
    function bi(a, b, c) {
        var d = a.doc, e = a.display;
        if (!d.mode.startState) {
            return new bf(d, true, b);
        }
        var f = bq(a, b, c);
        var g = f > d.first && aY(d, f - 1).stateAfter;
        var h = g ? bf.fromSaved(d, g, f) : new bf(d, aW(d.mode), f);
        d.iter(f, b, function(c) {
            bj(a, c.text, h);
            var d = h.line;
            c.stateAfter = d == b - 1 || d % 5 == 0 || (d >= e.viewFrom && d < e.viewTo) ? h.save() : null;
            h.nextLine();
        });
        if (c) {
            d.modeFrontier = h.line;
        }
        return h;
    }
    function bj(a, b, c, d) {
        var e = a.doc.mode;
        var f = new aX(b, a.options.tabSize, c);
        f.start = f.pos = d || 0;
        if (b == "") {
            bk(e, c.state);
        }
        while(!f.eol()){
            bl(e, f, c.state);
            f.start = f.pos;
        }
    }
    function bk(a, b) {
        if (a.blankLine) {
            return a.blankLine(b);
        }
        if (!a.innerMode) {
            return;
        }
        var c = aV(a, b);
        if (c.mode.blankLine) {
            return c.mode.blankLine(c.state);
        }
    }
    function bl(a, b, c, d) {
        for(var e = 0; e < 10; e++){
            if (d) {
                d[0] = aV(a, c).mode;
            }
            var f = a.token(b, c);
            if (b.pos > b.start) {
                return f;
            }
        }
        throw new Error("Mode " + a.name + " failed to advance stream.");
    }
    var bm = function(a, b, c) {
        this.start = a.start;
        this.end = a.pos;
        this.string = a.current();
        this.type = b || null;
        this.state = c;
    };
    function bn(a, b, c, d) {
        var e = a.doc, f = e.mode, g;
        b = bb(e, b);
        var h = aY(e, b.line), i = bi(a, b.line, c);
        var j = new aX(h.text, a.options.tabSize, i), k;
        if (d) {
            k = [];
        }
        while((d || j.pos < b.ch) && !j.eol()){
            j.start = j.pos;
            g = bl(f, j, i.state);
            if (d) {
                k.push(new bm(j, g, aU(e.mode, i.state)));
            }
        }
        return d ? k : new bm(j, g, i.state);
    }
    function bo(a, b) {
        if (a) {
            for(;;){
                var c = a.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!c) {
                    break;
                }
                a = a.slice(0, c.index) + a.slice(c.index + c[0].length);
                var d = c[1] ? "bgClass" : "textClass";
                if (b[d] == null) {
                    b[d] = c[2];
                } else if (!new RegExp("(?:^|\\s)" + c[2] + "(?:$|\\s)").test(b[d])) {
                    b[d] += " " + c[2];
                }
            }
        }
        return a;
    }
    function bp(a, b, c, d, e, f, g) {
        var h = c.flattenSpans;
        if (h == null) {
            h = a.options.flattenSpans;
        }
        var i = 0, j = null;
        var k = new aX(b, a.options.tabSize, d), l;
        var m = a.options.addModeClass && [
            null
        ];
        if (b == "") {
            bo(bk(c, d.state), f);
        }
        while(!k.eol()){
            if (k.pos > a.options.maxHighlightLength) {
                h = false;
                if (g) {
                    bj(a, b, d, k.pos);
                }
                k.pos = b.length;
                l = null;
            } else {
                l = bo(bl(c, k, d.state, m), f);
            }
            if (m) {
                var n = m[0].name;
                if (n) {
                    l = "m-" + (l ? n + " " + l : n);
                }
            }
            if (!h || j != l) {
                while(i < k.start){
                    i = Math.min(k.start, i + 5000);
                    e(i, j);
                }
                j = l;
            }
            k.start = k.pos;
        }
        while(i < k.pos){
            var o = Math.min(k.pos, i + 5000);
            e(o, j);
            i = o;
        }
    }
    function bq(a, b, c) {
        var d, e, f = a.doc;
        var g = c ? -1 : b - (a.doc.mode.innerMode ? 1000 : 100);
        for(var h = b; h > g; --h){
            if (h <= f.first) {
                return f.first;
            }
            var i = aY(f, h - 1), j = i.stateAfter;
            if (j && (!c || h + (j instanceof be ? j.lookAhead : 0) <= f.modeFrontier)) {
                return h;
            }
            var k = M(i.text, null, a.options.tabSize);
            if (e == null || d > k) {
                e = h - 1;
                d = k;
            }
        }
        return e;
    }
    function br(a, b) {
        a.modeFrontier = Math.min(a.modeFrontier, b);
        if (a.highlightFrontier < b - 10) {
            return;
        }
        var c = a.first;
        for(var d = b - 1; d > c; d--){
            var e = aY(a, d).stateAfter;
            if (e && (!(e instanceof be) || d + e.lookAhead < b)) {
                c = d + 1;
                break;
            }
        }
        a.highlightFrontier = Math.min(a.highlightFrontier, c);
    }
    var bs = false, bt = false;
    function bu() {
        bs = true;
    }
    function bv() {
        bt = true;
    }
    function bw(a, b, c) {
        this.marker = a;
        this.from = b;
        this.to = c;
    }
    function bx(a, b) {
        if (a) {
            for(var c = 0; c < a.length; ++c){
                var d = a[c];
                if (d.marker == b) {
                    return d;
                }
            }
        }
    }
    function by(a, b) {
        var c;
        for(var d = 0; d < a.length; ++d){
            if (a[d] != b) {
                (c || (c = [])).push(a[d]);
            }
        }
        return c;
    }
    function bz(a, b, c) {
        var d = c && window.WeakSet && (c.markedSpans || (c.markedSpans = new WeakSet()));
        if (d && d.has(a.markedSpans)) {
            a.markedSpans.push(b);
        } else {
            a.markedSpans = a.markedSpans ? a.markedSpans.concat([
                b
            ]) : [
                b
            ];
            if (d) {
                d.add(a.markedSpans);
            }
        }
        b.marker.attachLine(a);
    }
    function bA(a, b, c) {
        var d;
        if (a) {
            for(var e = 0; e < a.length; ++e){
                var f = a[e], g = f.marker;
                var h = f.from == null || (g.inclusiveLeft ? f.from <= b : f.from < b);
                if (h || (f.from == b && g.type == "bookmark" && (!c || !f.marker.insertLeft))) {
                    var i = f.to == null || (g.inclusiveRight ? f.to >= b : f.to > b);
                    (d || (d = [])).push(new bw(g, f.from, i ? null : f.to));
                }
            }
        }
        return d;
    }
    function bB(a, b, c) {
        var d;
        if (a) {
            for(var e = 0; e < a.length; ++e){
                var f = a[e], g = f.marker;
                var h = f.to == null || (g.inclusiveRight ? f.to >= b : f.to > b);
                if (h || (f.from == b && g.type == "bookmark" && (!c || f.marker.insertLeft))) {
                    var i = f.from == null || (g.inclusiveLeft ? f.from <= b : f.from < b);
                    (d || (d = [])).push(new bw(g, i ? null : f.from - b, f.to == null ? null : f.to - b));
                }
            }
        }
        return d;
    }
    function bC(a, b) {
        if (b.full) {
            return null;
        }
        var c = a2(a, b.from.line) && aY(a, b.from.line).markedSpans;
        var d = a2(a, b.to.line) && aY(a, b.to.line).markedSpans;
        if (!c && !d) {
            return null;
        }
        var e = b.from.ch, f = b.to.ch, g = a5(b.from, b.to) == 0;
        var h = bA(c, e, g);
        var i = bB(d, f, g);
        var j = b.text.length == 1, k = X(b.text).length + (j ? e : 0);
        if (h) {
            for(var l = 0; l < h.length; ++l){
                var m = h[l];
                if (m.to == null) {
                    var n = bx(i, m.marker);
                    if (!n) {
                        m.to = e;
                    } else if (j) {
                        m.to = n.to == null ? null : n.to + k;
                    }
                }
            }
        }
        if (i) {
            for(var o = 0; o < i.length; ++o){
                var p = i[o];
                if (p.to != null) {
                    p.to += k;
                }
                if (p.from == null) {
                    var q = bx(h, p.marker);
                    if (!q) {
                        p.from = k;
                        if (j) {
                            (h || (h = [])).push(p);
                        }
                    }
                } else {
                    p.from += k;
                    if (j) {
                        (h || (h = [])).push(p);
                    }
                }
            }
        }
        if (h) {
            h = bD(h);
        }
        if (i && i != h) {
            i = bD(i);
        }
        var r = [
            h
        ];
        if (!j) {
            var s = b.text.length - 2, t;
            if (s > 0 && h) {
                for(var u = 0; u < h.length; ++u){
                    if (h[u].to == null) {
                        (t || (t = [])).push(new bw(h[u].marker, null, null));
                    }
                }
            }
            for(var v = 0; v < s; ++v){
                r.push(t);
            }
            r.push(i);
        }
        return r;
    }
    function bD(a) {
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
    function bE(a, b, c) {
        var d = null;
        a.iter(b.line, c.line + 1, function(a) {
            if (a.markedSpans) {
                for(var b = 0; b < a.markedSpans.length; ++b){
                    var c = a.markedSpans[b].marker;
                    if (c.readOnly && (!d || O(d, c) == -1)) {
                        (d || (d = [])).push(c);
                    }
                }
            }
        });
        if (!d) {
            return null;
        }
        var e = [
            {
                from: b,
                to: c
            }
        ];
        for(var f = 0; f < d.length; ++f){
            var g = d[f], h = g.find(0);
            for(var i = 0; i < e.length; ++i){
                var j = e[i];
                if (a5(j.to, h.from) < 0 || a5(j.from, h.to) > 0) {
                    continue;
                }
                var k = [
                    i,
                    1
                ], l = a5(j.from, h.from), m = a5(j.to, h.to);
                if (l < 0 || (!g.inclusiveLeft && !l)) {
                    k.push({
                        from: j.from,
                        to: h.from
                    });
                }
                if (m > 0 || (!g.inclusiveRight && !m)) {
                    k.push({
                        from: h.to,
                        to: j.to
                    });
                }
                e.splice.apply(e, k);
                i += k.length - 3;
            }
        }
        return e;
    }
    function bF(a) {
        var b = a.markedSpans;
        if (!b) {
            return;
        }
        for(var c = 0; c < b.length; ++c){
            b[c].marker.detachLine(a);
        }
        a.markedSpans = null;
    }
    function bG(a, b) {
        if (!b) {
            return;
        }
        for(var c = 0; c < b.length; ++c){
            b[c].marker.attachLine(a);
        }
        a.markedSpans = b;
    }
    function bH(a) {
        return a.inclusiveLeft ? -1 : 0;
    }
    function bI(a) {
        return a.inclusiveRight ? 1 : 0;
    }
    function bJ(a, b) {
        var c = a.lines.length - b.lines.length;
        if (c != 0) {
            return c;
        }
        var d = a.find(), e = b.find();
        var f = a5(d.from, e.from) || bH(a) - bH(b);
        if (f) {
            return -f;
        }
        var g = a5(d.to, e.to) || bI(a) - bI(b);
        if (g) {
            return g;
        }
        return b.id - a.id;
    }
    function bK(a, b) {
        var c = bt && a.markedSpans, d;
        if (c) {
            for(var e = void 0, f = 0; f < c.length; ++f){
                e = c[f];
                if (e.marker.collapsed && (b ? e.from : e.to) == null && (!d || bJ(d, e.marker) < 0)) {
                    d = e.marker;
                }
            }
        }
        return d;
    }
    function bL(a) {
        return bK(a, true);
    }
    function bM(a) {
        return bK(a, false);
    }
    function bN(a, b) {
        var c = bt && a.markedSpans, d;
        if (c) {
            for(var e = 0; e < c.length; ++e){
                var f = c[e];
                if (f.marker.collapsed && (f.from == null || f.from < b) && (f.to == null || f.to > b) && (!d || bJ(d, f.marker) < 0)) {
                    d = f.marker;
                }
            }
        }
        return d;
    }
    function bO(a, b, c, d, e) {
        var f = aY(a, b);
        var g = bt && f.markedSpans;
        if (g) {
            for(var h = 0; h < g.length; ++h){
                var i = g[h];
                if (!i.marker.collapsed) {
                    continue;
                }
                var j = i.marker.find(0);
                var k = a5(j.from, c) || bH(i.marker) - bH(e);
                var l = a5(j.to, d) || bI(i.marker) - bI(e);
                if ((k >= 0 && l <= 0) || (k <= 0 && l >= 0)) {
                    continue;
                }
                if ((k <= 0 && (i.marker.inclusiveRight && e.inclusiveLeft ? a5(j.to, c) >= 0 : a5(j.to, c) > 0)) || (k >= 0 && (i.marker.inclusiveRight && e.inclusiveLeft ? a5(j.from, d) <= 0 : a5(j.from, d) < 0))) {
                    return true;
                }
            }
        }
    }
    function bP(a) {
        var b;
        while((b = bL(a))){
            a = b.find(-1, true).line;
        }
        return a;
    }
    function bQ(a) {
        var b;
        while((b = bM(a))){
            a = b.find(1, true).line;
        }
        return a;
    }
    function bR(a) {
        var b, c;
        while((b = bM(a))){
            a = b.find(1, true).line;
            (c || (c = [])).push(a);
        }
        return c;
    }
    function bS(a, b) {
        var c = aY(a, b), d = bP(c);
        if (c == d) {
            return b;
        }
        return a0(d);
    }
    function bT(a, b) {
        if (b > a.lastLine()) {
            return b;
        }
        var c = aY(a, b), d;
        if (!bU(a, c)) {
            return b;
        }
        while((d = bM(c))){
            c = d.find(1, true).line;
        }
        return a0(c) + 1;
    }
    function bU(a, b) {
        var c = bt && b.markedSpans;
        if (c) {
            for(var d = void 0, e = 0; e < c.length; ++e){
                d = c[e];
                if (!d.marker.collapsed) {
                    continue;
                }
                if (d.from == null) {
                    return true;
                }
                if (d.marker.widgetNode) {
                    continue;
                }
                if (d.from == 0 && d.marker.inclusiveLeft && bV(a, b, d)) {
                    return true;
                }
            }
        }
    }
    function bV(a, b, c) {
        if (c.to == null) {
            var d = c.marker.find(1, true);
            return bV(a, d.line, bx(d.line.markedSpans, c.marker));
        }
        if (c.marker.inclusiveRight && c.to == b.text.length) {
            return true;
        }
        for(var e = void 0, f = 0; f < b.markedSpans.length; ++f){
            e = b.markedSpans[f];
            if (e.marker.collapsed && !e.marker.widgetNode && e.from == c.to && (e.to == null || e.to != c.from) && (e.marker.inclusiveLeft || c.marker.inclusiveRight) && bV(a, b, e)) {
                return true;
            }
        }
    }
    function bW(a) {
        a = bP(a);
        var b = 0, c = a.parent;
        for(var d = 0; d < c.lines.length; ++d){
            var e = c.lines[d];
            if (e == a) {
                break;
            } else {
                b += e.height;
            }
        }
        for(var f = c.parent; f; c = f, f = c.parent){
            for(var g = 0; g < f.children.length; ++g){
                var h = f.children[g];
                if (h == c) {
                    break;
                } else {
                    b += h.height;
                }
            }
        }
        return b;
    }
    function bX(a) {
        if (a.height == 0) {
            return 0;
        }
        var b = a.text.length, c, d = a;
        while((c = bL(d))){
            var e = c.find(0, true);
            d = e.from.line;
            b += e.from.ch - e.to.ch;
        }
        d = a;
        while((c = bM(d))){
            var f = c.find(0, true);
            b -= d.text.length - f.from.ch;
            d = f.to.line;
            b += d.text.length - f.to.ch;
        }
        return b;
    }
    function bY(a) {
        var b = a.display, c = a.doc;
        b.maxLine = aY(c, c.first);
        b.maxLineLength = bX(b.maxLine);
        b.maxLineChanged = true;
        c.iter(function(a) {
            var c = bX(a);
            if (c > b.maxLineLength) {
                b.maxLineLength = c;
                b.maxLine = a;
            }
        });
    }
    var bZ = function(a, b, c) {
        this.text = a;
        bG(this, b);
        this.height = c ? c(this) : 1;
    };
    bZ.prototype.lineNo = function() {
        return a0(this);
    };
    av(bZ);
    function b$(a, b, c, d) {
        a.text = b;
        if (a.stateAfter) {
            a.stateAfter = null;
        }
        if (a.styles) {
            a.styles = null;
        }
        if (a.order != null) {
            a.order = null;
        }
        bF(a);
        bG(a, c);
        var e = d ? d(a) : 1;
        if (e != a.height) {
            a_(a, e);
        }
    }
    function b_(a) {
        a.parent = null;
        bF(a);
    }
    var b0 = {}, b1 = {};
    function b2(a, b) {
        if (!a || /^\s*$/.test(a)) {
            return null;
        }
        var c = b.addModeClass ? b1 : b0;
        return c[a] || (c[a] = a.replace(/\S+/g, "cm-$&"));
    }
    function b3(a, b) {
        var c = D("span", null, null, i ? "padding-right: .1px" : null);
        var d = {
            pre: D("pre", [
                c
            ], "CodeMirror-line"),
            content: c,
            col: 0,
            pos: 0,
            cm: a,
            trailingSpace: false,
            splitSpaces: a.getOption("lineWrapping")
        };
        b.measure = {};
        for(var e = 0; e <= (b.rest ? b.rest.length : 0); e++){
            var f = e ? b.rest[e - 1] : b.line, g = void 0;
            d.pos = 0;
            d.addToken = b5;
            if (aG(a.display.measure) && (g = am(f, a.doc.direction))) {
                d.addToken = b7(d.addToken, g);
            }
            d.map = [];
            var h = b != a.display.externalMeasured && a0(f);
            b9(f, d, bh(a, f, h));
            if (f.styleClasses) {
                if (f.styleClasses.bgClass) {
                    d.bgClass = I(f.styleClasses.bgClass, d.bgClass || "");
                }
                if (f.styleClasses.textClass) {
                    d.textClass = I(f.styleClasses.textClass, d.textClass || "");
                }
            }
            if (d.map.length == 0) {
                d.map.push(0, 0, d.content.appendChild(aE(a.display.measure)));
            }
            if (e == 0) {
                b.measure.map = d.map;
                b.measure.cache = {};
            } else {
                (b.measure.maps || (b.measure.maps = [])).push(d.map);
                (b.measure.caches || (b.measure.caches = [])).push({});
            }
        }
        if (i) {
            var j = d.content.lastChild;
            if (/\bcm-tab\b/.test(j.className) || (j.querySelector && j.querySelector(".cm-tab"))) {
                d.content.className = "cm-tab-wrap-hack";
            }
        }
        ar(a, "renderLine", a, b.line, d.pre);
        if (d.pre.className) {
            d.textClass = I(d.pre.className, d.textClass || "");
        }
        return d;
    }
    function b4(a) {
        var b = C("span", "\u2022", "cm-invalidchar");
        b.title = "\\u" + a.charCodeAt(0).toString(16);
        b.setAttribute("aria-label", b.title);
        return b;
    }
    function b5(a, b, c, d, e, f, i) {
        if (!b) {
            return;
        }
        var j = a.splitSpaces ? b6(b, a.trailingSpace) : b;
        var k = a.cm.state.specialChars, l = false;
        var m;
        if (!k.test(b)) {
            a.col += b.length;
            m = document.createTextNode(j);
            a.map.push(a.pos, a.pos + b.length, m);
            if (g && h < 9) {
                l = true;
            }
            a.pos += b.length;
        } else {
            m = document.createDocumentFragment();
            var n = 0;
            while(true){
                k.lastIndex = n;
                var o = k.exec(b);
                var p = o ? o.index - n : b.length - n;
                if (p) {
                    var q = document.createTextNode(j.slice(n, n + p));
                    if (g && h < 9) {
                        m.appendChild(C("span", [
                            q
                        ]));
                    } else {
                        m.appendChild(q);
                    }
                    a.map.push(a.pos, a.pos + p, q);
                    a.col += p;
                    a.pos += p;
                }
                if (!o) {
                    break;
                }
                n += p + 1;
                var r = void 0;
                if (o[0] == "\t") {
                    var s = a.cm.options.tabSize, t = s - (a.col % s);
                    r = m.appendChild(C("span", W(t), "cm-tab"));
                    r.setAttribute("role", "presentation");
                    r.setAttribute("cm-text", "\t");
                    a.col += t;
                } else if (o[0] == "\r" || o[0] == "\n") {
                    r = m.appendChild(C("span", o[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                    r.setAttribute("cm-text", o[0]);
                    a.col += 1;
                } else {
                    r = a.cm.options.specialCharPlaceholder(o[0]);
                    r.setAttribute("cm-text", o[0]);
                    if (g && h < 9) {
                        m.appendChild(C("span", [
                            r
                        ]));
                    } else {
                        m.appendChild(r);
                    }
                    a.col += 1;
                }
                a.map.push(a.pos, a.pos + 1, r);
                a.pos++;
            }
        }
        a.trailingSpace = j.charCodeAt(b.length - 1) == 32;
        if (c || d || e || l || f || i) {
            var u = c || "";
            if (d) {
                u += d;
            }
            if (e) {
                u += e;
            }
            var v = C("span", [
                m
            ], u, f);
            if (i) {
                for(var w in i){
                    if (i.hasOwnProperty(w) && w != "style" && w != "class") {
                        v.setAttribute(w, i[w]);
                    }
                }
            }
            return a.content.appendChild(v);
        }
        a.content.appendChild(m);
    }
    function b6(a, b) {
        if (a.length > 1 && !/  /.test(a)) {
            return a;
        }
        var c = b, d = "";
        for(var e = 0; e < a.length; e++){
            var f = a.charAt(e);
            if (f == " " && c && (e == a.length - 1 || a.charCodeAt(e + 1) == 32)) {
                f = "\u00a0";
            }
            d += f;
            c = f == " ";
        }
        return d;
    }
    function b7(a, b) {
        return function(c, d, e, f, g, h, i) {
            e = e ? e + " cm-force-border" : "cm-force-border";
            var j = c.pos, k = j + d.length;
            for(;;){
                var l = void 0;
                for(var m = 0; m < b.length; m++){
                    l = b[m];
                    if (l.to > j && l.from <= j) {
                        break;
                    }
                }
                if (l.to >= k) {
                    return a(c, d, e, f, g, h, i);
                }
                a(c, d.slice(0, l.to - j), e, f, null, h, i);
                f = null;
                d = d.slice(l.to - j);
                j = l.to;
            }
        };
    }
    function b8(a, b, c, d) {
        var e = !d && c.widgetNode;
        if (e) {
            a.map.push(a.pos, a.pos + b, e);
        }
        if (!d && a.cm.display.input.needsContentAttribute) {
            if (!e) {
                e = a.content.appendChild(document.createElement("span"));
            }
            e.setAttribute("cm-marker", c.id);
        }
        if (e) {
            a.cm.display.input.setUneditable(e);
            a.content.appendChild(e);
        }
        a.pos += b;
        a.trailingSpace = false;
    }
    function b9(a, b, c) {
        var d = a.markedSpans, e = a.text, f = 0;
        if (!d) {
            for(var g = 1; g < c.length; g += 2){
                b.addToken(b, e.slice(f, (f = c[g])), b2(c[g + 1], b.cm.options));
            }
            return;
        }
        var h = e.length, i = 0, j = 1, k = "", l, m;
        var n = 0, o, p, q, r, s;
        for(;;){
            if (n == i) {
                o = p = q = m = "";
                s = null;
                r = null;
                n = Infinity;
                var t = [], u = void 0;
                for(var v = 0; v < d.length; ++v){
                    var w = d[v], x = w.marker;
                    if (x.type == "bookmark" && w.from == i && x.widgetNode) {
                        t.push(x);
                    } else if (w.from <= i && (w.to == null || w.to > i || (x.collapsed && w.to == i && w.from == i))) {
                        if (w.to != null && w.to != i && n > w.to) {
                            n = w.to;
                            p = "";
                        }
                        if (x.className) {
                            o += " " + x.className;
                        }
                        if (x.css) {
                            m = (m ? m + ";" : "") + x.css;
                        }
                        if (x.startStyle && w.from == i) {
                            q += " " + x.startStyle;
                        }
                        if (x.endStyle && w.to == n) {
                            (u || (u = [])).push(x.endStyle, w.to);
                        }
                        if (x.title) {
                            (s || (s = {})).title = x.title;
                        }
                        if (x.attributes) {
                            for(var y in x.attributes){
                                (s || (s = {}))[y] = x.attributes[y];
                            }
                        }
                        if (x.collapsed && (!r || bJ(r.marker, x) < 0)) {
                            r = w;
                        }
                    } else if (w.from > i && n > w.from) {
                        n = w.from;
                    }
                }
                if (u) {
                    for(var z = 0; z < u.length; z += 2){
                        if (u[z + 1] == n) {
                            p += " " + u[z];
                        }
                    }
                }
                if (!r || r.from == i) {
                    for(var A = 0; A < t.length; ++A){
                        b8(b, 0, t[A]);
                    }
                }
                if (r && (r.from || 0) == i) {
                    b8(b, (r.to == null ? h + 1 : r.to) - i, r.marker, r.from == null);
                    if (r.to == null) {
                        return;
                    }
                    if (r.to == i) {
                        r = false;
                    }
                }
            }
            if (i >= h) {
                break;
            }
            var B = Math.min(h, n);
            while(true){
                if (k) {
                    var C = i + k.length;
                    if (!r) {
                        var D = C > B ? k.slice(0, B - i) : k;
                        b.addToken(b, D, l ? l + o : o, q, i + D.length == n ? p : "", m, s);
                    }
                    if (C >= B) {
                        k = k.slice(B - i);
                        i = B;
                        break;
                    }
                    i = C;
                    q = "";
                }
                k = e.slice(f, (f = c[j++]));
                l = b2(c[j++], b.cm.options);
            }
        }
    }
    function ca(a, b, c) {
        this.line = b;
        this.rest = bR(b);
        this.size = this.rest ? a0(X(this.rest)) - c + 1 : 1;
        this.node = this.text = null;
        this.hidden = bU(a, b);
    }
    function cb(a, b, c) {
        var d = [], e;
        for(var f = b; f < c; f = e){
            var g = new ca(a.doc, aY(a.doc, f), f);
            e = f + g.size;
            d.push(g);
        }
        return d;
    }
    var cc = null;
    function cd(a) {
        if (cc) {
            cc.ops.push(a);
        } else {
            a.ownsGroup = cc = {
                ops: [
                    a
                ],
                delayedCallbacks: []
            };
        }
    }
    function ce(a) {
        var b = a.delayedCallbacks, c = 0;
        do {
            for(; c < b.length; c++){
                b[c].call(null);
            }
            for(var d = 0; d < a.ops.length; d++){
                var e = a.ops[d];
                if (e.cursorActivityHandlers) {
                    while(e.cursorActivityCalled < e.cursorActivityHandlers.length){
                        e.cursorActivityHandlers[e.cursorActivityCalled++].call(null, e.cm);
                    }
                }
            }
        }while (c < b.length)
    }
    function cf(a, b) {
        var c = a.ownsGroup;
        if (!c) {
            return;
        }
        try {
            ce(c);
        } finally{
            cc = null;
            b(c);
        }
    }
    var cg = null;
    function ch(a, b) {
        var c = ap(a, b);
        if (!c.length) {
            return;
        }
        var d = Array.prototype.slice.call(arguments, 2), e;
        if (cc) {
            e = cc.delayedCallbacks;
        } else if (cg) {
            e = cg;
        } else {
            e = cg = [];
            setTimeout(ci, 0);
        }
        var f = function(a) {
            e.push(function() {
                return c[a].apply(null, d);
            });
        };
        for(var g = 0; g < c.length; ++g)f(g);
    }
    function ci() {
        var a = cg;
        cg = null;
        for(var b = 0; b < a.length; ++b){
            a[b]();
        }
    }
    function cj(a, b, c, d) {
        for(var e = 0; e < b.changes.length; e++){
            var f = b.changes[e];
            if (f == "text") {
                cn(a, b);
            } else if (f == "gutter") {
                cp(a, b, c, d);
            } else if (f == "class") {
                co(a, b);
            } else if (f == "widget") {
                cq(a, b, d);
            }
        }
        b.changes = null;
    }
    function ck(a) {
        if (a.node == a.text) {
            a.node = C("div", null, null, "position: relative");
            if (a.text.parentNode) {
                a.text.parentNode.replaceChild(a.node, a.text);
            }
            a.node.appendChild(a.text);
            if (g && h < 8) {
                a.node.style.zIndex = 2;
            }
        }
        return a.node;
    }
    function cl(a, b) {
        var c = b.bgClass ? b.bgClass + " " + (b.line.bgClass || "") : b.line.bgClass;
        if (c) {
            c += " CodeMirror-linebackground";
        }
        if (b.background) {
            if (c) {
                b.background.className = c;
            } else {
                b.background.parentNode.removeChild(b.background);
                b.background = null;
            }
        } else if (c) {
            var d = ck(b);
            b.background = d.insertBefore(C("div", null, c), d.firstChild);
            a.display.input.setUneditable(b.background);
        }
    }
    function cm(a, b) {
        var c = a.display.externalMeasured;
        if (c && c.line == b.line) {
            a.display.externalMeasured = null;
            b.measure = c.measure;
            return c.built;
        }
        return b3(a, b);
    }
    function cn(a, b) {
        var c = b.text.className;
        var d = cm(a, b);
        if (b.text == b.node) {
            b.node = d.pre;
        }
        b.text.parentNode.replaceChild(d.pre, b.text);
        b.text = d.pre;
        if (d.bgClass != b.bgClass || d.textClass != b.textClass) {
            b.bgClass = d.bgClass;
            b.textClass = d.textClass;
            co(a, b);
        } else if (c) {
            b.text.className = c;
        }
    }
    function co(a, b) {
        cl(a, b);
        if (b.line.wrapClass) {
            ck(b).className = b.line.wrapClass;
        } else if (b.node != b.text) {
            b.node.className = "";
        }
        var c = b.textClass ? b.textClass + " " + (b.line.textClass || "") : b.line.textClass;
        b.text.className = c || "";
    }
    function cp(a, b, c, d) {
        if (b.gutter) {
            b.node.removeChild(b.gutter);
            b.gutter = null;
        }
        if (b.gutterBackground) {
            b.node.removeChild(b.gutterBackground);
            b.gutterBackground = null;
        }
        if (b.line.gutterClass) {
            var e = ck(b);
            b.gutterBackground = C("div", null, "CodeMirror-gutter-background " + b.line.gutterClass, "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px; width: " + d.gutterTotalWidth + "px");
            a.display.input.setUneditable(b.gutterBackground);
            e.insertBefore(b.gutterBackground, b.text);
        }
        var f = b.line.gutterMarkers;
        if (a.options.lineNumbers || f) {
            var g = ck(b);
            var h = (b.gutter = C("div", null, "CodeMirror-gutter-wrapper", "left: " + (a.options.fixedGutter ? d.fixedPos : -d.gutterTotalWidth) + "px"));
            h.setAttribute("aria-hidden", "true");
            a.display.input.setUneditable(h);
            g.insertBefore(h, b.text);
            if (b.line.gutterClass) {
                h.className += " " + b.line.gutterClass;
            }
            if (a.options.lineNumbers && (!f || !f["CodeMirror-linenumbers"])) {
                b.lineNumber = h.appendChild(C("div", a3(a.options, c), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + d.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + a.display.lineNumInnerWidth + "px"));
            }
            if (f) {
                for(var i = 0; i < a.display.gutterSpecs.length; ++i){
                    var j = a.display.gutterSpecs[i].className, k = f.hasOwnProperty(j) && f[j];
                    if (k) {
                        h.appendChild(C("div", [
                            k
                        ], "CodeMirror-gutter-elt", "left: " + d.gutterLeft[j] + "px; width: " + d.gutterWidth[j] + "px"));
                    }
                }
            }
        }
    }
    function cq(a, b, c) {
        if (b.alignable) {
            b.alignable = null;
        }
        var d = y("CodeMirror-linewidget");
        for(var e = b.node.firstChild, f = void 0; e; e = f){
            f = e.nextSibling;
            if (d.test(e.className)) {
                b.node.removeChild(e);
            }
        }
        cs(a, b, c);
    }
    function cr(a, b, c, d) {
        var e = cm(a, b);
        b.text = b.node = e.pre;
        if (e.bgClass) {
            b.bgClass = e.bgClass;
        }
        if (e.textClass) {
            b.textClass = e.textClass;
        }
        co(a, b);
        cp(a, b, c, d);
        cs(a, b, d);
        return b.node;
    }
    function cs(a, b, c) {
        ct(a, b.line, b, c, true);
        if (b.rest) {
            for(var d = 0; d < b.rest.length; d++){
                ct(a, b.rest[d], b, c, false);
            }
        }
    }
    function ct(a, b, c, d, e) {
        if (!b.widgets) {
            return;
        }
        var f = ck(c);
        for(var g = 0, h = b.widgets; g < h.length; ++g){
            var i = h[g], j = C("div", [
                i.node
            ], "CodeMirror-linewidget" + (i.className ? " " + i.className : ""));
            if (!i.handleMouseEvents) {
                j.setAttribute("cm-ignore-events", "true");
            }
            cu(i, j, c, d);
            a.display.input.setUneditable(j);
            if (e && i.above) {
                f.insertBefore(j, c.gutter || c.text);
            } else {
                f.appendChild(j);
            }
            ch(i, "redraw");
        }
    }
    function cu(a, b, c, d) {
        if (a.noHScroll) {
            (c.alignable || (c.alignable = [])).push(b);
            var e = d.wrapperWidth;
            b.style.left = d.fixedPos + "px";
            if (!a.coverGutter) {
                e -= d.gutterTotalWidth;
                b.style.paddingLeft = d.gutterTotalWidth + "px";
            }
            b.style.width = e + "px";
        }
        if (a.coverGutter) {
            b.style.zIndex = 5;
            b.style.position = "relative";
            if (!a.noHScroll) {
                b.style.marginLeft = -d.gutterTotalWidth + "px";
            }
        }
    }
    function cv(a) {
        if (a.height != null) {
            return a.height;
        }
        var b = a.doc.cm;
        if (!b) {
            return 0;
        }
        if (!F(document.body, a.node)) {
            var c = "position: relative;";
            if (a.coverGutter) {
                c += "margin-left: -" + b.display.gutters.offsetWidth + "px;";
            }
            if (a.noHScroll) {
                c += "width: " + b.display.wrapper.clientWidth + "px;";
            }
            B(b.display.measure, C("div", [
                a.node
            ], null, c));
        }
        return (a.height = a.node.parentNode.offsetHeight);
    }
    function cw(a, b) {
        for(var c = aA(b); c != a.wrapper; c = c.parentNode){
            if (!c || (c.nodeType == 1 && c.getAttribute("cm-ignore-events") == "true") || (c.parentNode == a.sizer && c != a.mover)) {
                return true;
            }
        }
    }
    function cx(a) {
        return a.lineSpace.offsetTop;
    }
    function cy(a) {
        return a.mover.offsetHeight - a.lineSpace.offsetHeight;
    }
    function cz(a) {
        if (a.cachedPaddingH) {
            return a.cachedPaddingH;
        }
        var b = B(a.measure, C("pre", "x", "CodeMirror-line-like"));
        var c = window.getComputedStyle ? window.getComputedStyle(b) : b.currentStyle;
        var d = {
            left: parseInt(c.paddingLeft),
            right: parseInt(c.paddingRight)
        };
        if (!isNaN(d.left) && !isNaN(d.right)) {
            a.cachedPaddingH = d;
        }
        return d;
    }
    function cA(a) {
        return P - a.display.nativeBarWidth;
    }
    function cB(a) {
        return (a.display.scroller.clientWidth - cA(a) - a.display.barWidth);
    }
    function cC(a) {
        return (a.display.scroller.clientHeight - cA(a) - a.display.barHeight);
    }
    function cD(a, b, c) {
        var d = a.options.lineWrapping;
        var e = d && cB(a);
        if (!b.measure.heights || (d && b.measure.width != e)) {
            var f = (b.measure.heights = []);
            if (d) {
                b.measure.width = e;
                var g = b.text.firstChild.getClientRects();
                for(var h = 0; h < g.length - 1; h++){
                    var i = g[h], j = g[h + 1];
                    if (Math.abs(i.bottom - j.bottom) > 2) {
                        f.push((i.bottom + j.top) / 2 - c.top);
                    }
                }
            }
            f.push(c.bottom - c.top);
        }
    }
    function cE(a, b, c) {
        if (a.line == b) {
            return {
                map: a.measure.map,
                cache: a.measure.cache
            };
        }
        if (a.rest) {
            for(var d = 0; d < a.rest.length; d++){
                if (a.rest[d] == b) {
                    return {
                        map: a.measure.maps[d],
                        cache: a.measure.caches[d]
                    };
                }
            }
            for(var e = 0; e < a.rest.length; e++){
                if (a0(a.rest[e]) > c) {
                    return {
                        map: a.measure.maps[e],
                        cache: a.measure.caches[e],
                        before: true
                    };
                }
            }
        }
    }
    function cF(a, b) {
        b = bP(b);
        var c = a0(b);
        var d = (a.display.externalMeasured = new ca(a.doc, b, c));
        d.lineN = c;
        var e = (d.built = b3(a, d));
        d.text = e.pre;
        B(a.display.lineMeasure, e.pre);
        return d;
    }
    function cG(a, b, c, d) {
        return cJ(a, cI(a, b), c, d);
    }
    function cH(a, b) {
        if (b >= a.display.viewFrom && b < a.display.viewTo) {
            return a.display.view[de(a, b)];
        }
        var c = a.display.externalMeasured;
        if (c && b >= c.lineN && b < c.lineN + c.size) {
            return c;
        }
    }
    function cI(a, b) {
        var c = a0(b);
        var d = cH(a, c);
        if (d && !d.text) {
            d = null;
        } else if (d && d.changes) {
            cj(a, d, c, c9(a));
            a.curOp.forceUpdate = true;
        }
        if (!d) {
            d = cF(a, b);
        }
        var e = cE(d, b, c);
        return {
            line: b,
            view: d,
            rect: null,
            map: e.map,
            cache: e.cache,
            before: e.before,
            hasHeights: false
        };
    }
    function cJ(a, b, c, d, e) {
        if (b.before) {
            c = -1;
        }
        var f = c + (d || ""), g;
        if (b.cache.hasOwnProperty(f)) {
            g = b.cache[f];
        } else {
            if (!b.rect) {
                b.rect = b.view.text.getBoundingClientRect();
            }
            if (!b.hasHeights) {
                cD(a, b.view, b.rect);
                b.hasHeights = true;
            }
            g = cN(a, b, c, d);
            if (!g.bogus) {
                b.cache[f] = g;
            }
        }
        return {
            left: g.left,
            right: g.right,
            top: e ? g.rtop : g.top,
            bottom: e ? g.rbottom : g.bottom
        };
    }
    var cK = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function cL(a, b, c) {
        var d, e, f, g, h, i;
        for(var j = 0; j < a.length; j += 3){
            h = a[j];
            i = a[j + 1];
            if (b < h) {
                e = 0;
                f = 1;
                g = "left";
            } else if (b < i) {
                e = b - h;
                f = e + 1;
            } else if (j == a.length - 3 || (b == i && a[j + 3] > b)) {
                f = i - h;
                e = f - 1;
                if (b >= i) {
                    g = "right";
                }
            }
            if (e != null) {
                d = a[j + 2];
                if (h == i && c == (d.insertLeft ? "left" : "right")) {
                    g = c;
                }
                if (c == "left" && e == 0) {
                    while(j && a[j - 2] == a[j - 3] && a[j - 1].insertLeft){
                        d = a[(j -= 3) + 2];
                        g = "left";
                    }
                }
                if (c == "right" && e == i - h) {
                    while(j < a.length - 3 && a[j + 3] == a[j + 4] && !a[j + 5].insertLeft){
                        d = a[(j += 3) + 2];
                        g = "right";
                    }
                }
                break;
            }
        }
        return {
            node: d,
            start: e,
            end: f,
            collapse: g,
            coverStart: h,
            coverEnd: i
        };
    }
    function cM(a, b) {
        var c = cK;
        if (b == "left") {
            for(var d = 0; d < a.length; d++){
                if ((c = a[d]).left != c.right) {
                    break;
                }
            }
        } else {
            for(var e = a.length - 1; e >= 0; e--){
                if ((c = a[e]).left != c.right) {
                    break;
                }
            }
        }
        return c;
    }
    function cN(a, b, c, d) {
        var e = cL(b.map, c, d);
        var f = e.node, i = e.start, j = e.end, k = e.collapse;
        var l;
        if (f.nodeType == 3) {
            for(var m = 0; m < 4; m++){
                while(i && af(b.line.text.charAt(e.coverStart + i))){
                    --i;
                }
                while(e.coverStart + j < e.coverEnd && af(b.line.text.charAt(e.coverStart + j))){
                    ++j;
                }
                if (g && h < 9 && i == 0 && j == e.coverEnd - e.coverStart) {
                    l = f.parentNode.getBoundingClientRect();
                } else {
                    l = cM(E(f, i, j).getClientRects(), d);
                }
                if (l.left || l.right || i == 0) {
                    break;
                }
                j = i;
                i = i - 1;
                k = "right";
            }
            if (g && h < 11) {
                l = cO(a.display.measure, l);
            }
        } else {
            if (i > 0) {
                k = d = "right";
            }
            var n;
            if (a.options.lineWrapping && (n = f.getClientRects()).length > 1) {
                l = n[d == "right" ? n.length - 1 : 0];
            } else {
                l = f.getBoundingClientRect();
            }
        }
        if (g && h < 9 && !i && (!l || (!l.left && !l.right))) {
            var o = f.parentNode.getClientRects()[0];
            if (o) {
                l = {
                    left: o.left,
                    right: o.left + c8(a.display),
                    top: o.top,
                    bottom: o.bottom
                };
            } else {
                l = cK;
            }
        }
        var p = l.top - b.rect.top, q = l.bottom - b.rect.top;
        var r = (p + q) / 2;
        var s = b.view.measure.heights;
        var t = 0;
        for(; t < s.length - 1; t++){
            if (r < s[t]) {
                break;
            }
        }
        var u = t ? s[t - 1] : 0, v = s[t];
        var w = {
            left: (k == "right" ? l.right : l.left) - b.rect.left,
            right: (k == "left" ? l.left : l.right) - b.rect.left,
            top: u,
            bottom: v
        };
        if (!l.left && !l.right) {
            w.bogus = true;
        }
        if (!a.options.singleCursorHeightPerLine) {
            w.rtop = p;
            w.rbottom = q;
        }
        return w;
    }
    function cO(a, b) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !aL(a)) {
            return b;
        }
        var c = screen.logicalXDPI / screen.deviceXDPI;
        var d = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: b.left * c,
            right: b.right * c,
            top: b.top * d,
            bottom: b.bottom * d
        };
    }
    function cP(a) {
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
    function cQ(a) {
        a.display.externalMeasure = null;
        A(a.display.lineMeasure);
        for(var b = 0; b < a.display.view.length; b++){
            cP(a.display.view[b]);
        }
    }
    function cR(a) {
        cQ(a);
        a.display.cachedCharWidth = a.display.cachedTextHeight = a.display.cachedPaddingH = null;
        if (!a.options.lineWrapping) {
            a.display.maxLineChanged = true;
        }
        a.display.lineNumChars = null;
    }
    function cS() {
        if (k && q) {
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        }
        return (window.pageXOffset || (document.documentElement || document.body).scrollLeft);
    }
    function cT() {
        if (k && q) {
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        }
        return (window.pageYOffset || (document.documentElement || document.body).scrollTop);
    }
    function cU(a) {
        var b = bP(a);
        var c = b.widgets;
        var d = 0;
        if (c) {
            for(var e = 0; e < c.length; ++e){
                if (c[e].above) {
                    d += cv(c[e]);
                }
            }
        }
        return d;
    }
    function cV(a, b, c, d, e) {
        if (!e) {
            var f = cU(b);
            c.top += f;
            c.bottom += f;
        }
        if (d == "line") {
            return c;
        }
        if (!d) {
            d = "local";
        }
        var g = bW(b);
        if (d == "local") {
            g += cx(a.display);
        } else {
            g -= a.display.viewOffset;
        }
        if (d == "page" || d == "window") {
            var h = a.display.lineSpace.getBoundingClientRect();
            g += h.top + (d == "window" ? 0 : cT());
            var i = h.left + (d == "window" ? 0 : cS());
            c.left += i;
            c.right += i;
        }
        c.top += g;
        c.bottom += g;
        return c;
    }
    function cW(a, b, c) {
        if (c == "div") {
            return b;
        }
        var d = b.left, e = b.top;
        if (c == "page") {
            d -= cS();
            e -= cT();
        } else if (c == "local" || !c) {
            var f = a.display.sizer.getBoundingClientRect();
            d += f.left;
            e += f.top;
        }
        var g = a.display.lineSpace.getBoundingClientRect();
        return {
            left: d - g.left,
            top: e - g.top
        };
    }
    function cX(a, b, c, d, e) {
        if (!d) {
            d = aY(a.doc, b.line);
        }
        return cV(a, d, cG(a, d, b.ch, e), c);
    }
    function cY(a, b, c, d, e, f) {
        d = d || aY(a.doc, b.line);
        if (!e) {
            e = cI(a, d);
        }
        function g(b, g) {
            var h = cJ(a, e, b, g ? "right" : "left", f);
            if (g) {
                h.left = h.right;
            } else {
                h.right = h.left;
            }
            return cV(a, d, h, c);
        }
        var h = am(d, a.doc.direction), i = b.ch, j = b.sticky;
        if (i >= d.text.length) {
            i = d.text.length;
            j = "before";
        } else if (i <= 0) {
            i = 0;
            j = "after";
        }
        if (!h) {
            return g(j == "before" ? i - 1 : i, j == "before");
        }
        function k(a, b, c) {
            var d = h[b], e = d.level == 1;
            return g(c ? a - 1 : a, e != c);
        }
        var l = ak(h, i, j);
        var m = aj;
        var n = k(i, l, j == "before");
        if (m != null) {
            n.other = k(i, m, j != "before");
        }
        return n;
    }
    function cZ(a, b) {
        var c = 0;
        b = bb(a.doc, b);
        if (!a.options.lineWrapping) {
            c = c8(a.display) * b.ch;
        }
        var d = aY(a.doc, b.line);
        var e = bW(d) + cx(a.display);
        return {
            left: c,
            right: c,
            top: e,
            bottom: e + d.height
        };
    }
    function c$(a, b, c, d, e) {
        var f = a4(a, b, c);
        f.xRel = e;
        if (d) {
            f.outside = d;
        }
        return f;
    }
    function c_(a, b, c) {
        var d = a.doc;
        c += a.display.viewOffset;
        if (c < 0) {
            return c$(d.first, 0, null, -1, -1);
        }
        var e = a1(d, c), f = d.first + d.size - 1;
        if (e > f) {
            return c$(d.first + d.size - 1, aY(d, f).text.length, null, 1, 1);
        }
        if (b < 0) {
            b = 0;
        }
        var g = aY(d, e);
        for(;;){
            var h = c3(a, g, e, b, c);
            var i = bN(g, h.ch + (h.xRel > 0 || h.outside > 0 ? 1 : 0));
            if (!i) {
                return h;
            }
            var j = i.find(1);
            if (j.line == e) {
                return j;
            }
            g = aY(d, (e = j.line));
        }
    }
    function c0(a, b, c, d) {
        d -= cU(b);
        var e = b.text.length;
        var f = ah(function(b) {
            return (cJ(a, c, b - 1).bottom <= d);
        }, e, 0);
        e = ah(function(b) {
            return cJ(a, c, b).top > d;
        }, f, e);
        return {
            begin: f,
            end: e
        };
    }
    function c1(a, b, c, d) {
        if (!c) {
            c = cI(a, b);
        }
        var e = cV(a, b, cJ(a, c, d), "line").top;
        return c0(a, b, c, e);
    }
    function c2(a, b, c, d) {
        return a.bottom <= c ? false : a.top > c ? true : (d ? a.left : a.right) > b;
    }
    function c3(a, b, c, d, e) {
        e -= bW(b);
        var f = cI(a, b);
        var g = cU(b);
        var h = 0, i = b.text.length, j = true;
        var k = am(b, a.doc.direction);
        if (k) {
            var l = (a.options.lineWrapping ? c5 : c4)(a, b, c, f, k, d, e);
            j = l.level != 1;
            h = j ? l.from : l.to - 1;
            i = j ? l.to : l.from - 1;
        }
        var m = null, n = null;
        var o = ah(function(b) {
            var c = cJ(a, f, b);
            c.top += g;
            c.bottom += g;
            if (!c2(c, d, e, false)) {
                return false;
            }
            if (c.top <= e && c.left <= d) {
                m = b;
                n = c;
            }
            return true;
        }, h, i);
        var p, q, r = false;
        if (n) {
            var s = d - n.left < n.right - d, t = s == j;
            o = m + (t ? 0 : 1);
            q = t ? "after" : "before";
            p = s ? n.left : n.right;
        } else {
            if (!j && (o == i || o == h)) {
                o++;
            }
            q = o == 0 ? "after" : o == b.text.length ? "before" : cJ(a, f, o - (j ? 1 : 0)).bottom + g <= e == j ? "after" : "before";
            var u = cY(a, a4(c, o, q), "line", b, f);
            p = u.left;
            r = e < u.top ? -1 : e >= u.bottom ? 1 : 0;
        }
        o = ag(b.text, o, 1);
        return c$(c, o, q, r, d - p);
    }
    function c4(a, b, c, d, e, f, g) {
        var h = ah(function(h) {
            var i = e[h], j = i.level != 1;
            return c2(cY(a, a4(c, j ? i.to : i.from, j ? "before" : "after"), "line", b, d), f, g, true);
        }, 0, e.length - 1);
        var i = e[h];
        if (h > 0) {
            var j = i.level != 1;
            var k = cY(a, a4(c, j ? i.from : i.to, j ? "after" : "before"), "line", b, d);
            if (c2(k, f, g, true) && k.top > g) {
                i = e[h - 1];
            }
        }
        return i;
    }
    function c5(a, b, c, d, e, f, g) {
        var h = c0(a, b, d, g);
        var i = h.begin;
        var j = h.end;
        if (/\s/.test(b.text.charAt(j - 1))) {
            j--;
        }
        var k = null, l = null;
        for(var m = 0; m < e.length; m++){
            var n = e[m];
            if (n.from >= j || n.to <= i) {
                continue;
            }
            var o = n.level != 1;
            var p = cJ(a, d, o ? Math.min(j, n.to) - 1 : Math.max(i, n.from)).right;
            var q = p < f ? f - p + 1e9 : p - f;
            if (!k || l > q) {
                k = n;
                l = q;
            }
        }
        if (!k) {
            k = e[e.length - 1];
        }
        if (k.from < i) {
            k = {
                from: i,
                to: k.to,
                level: k.level
            };
        }
        if (k.to > j) {
            k = {
                from: k.from,
                to: j,
                level: k.level
            };
        }
        return k;
    }
    var c6;
    function c7(a) {
        if (a.cachedTextHeight != null) {
            return a.cachedTextHeight;
        }
        if (c6 == null) {
            c6 = C("pre", null, "CodeMirror-line-like");
            for(var b = 0; b < 49; ++b){
                c6.appendChild(document.createTextNode("x"));
                c6.appendChild(C("br"));
            }
            c6.appendChild(document.createTextNode("x"));
        }
        B(a.measure, c6);
        var c = c6.offsetHeight / 50;
        if (c > 3) {
            a.cachedTextHeight = c;
        }
        A(a.measure);
        return c || 1;
    }
    function c8(a) {
        if (a.cachedCharWidth != null) {
            return a.cachedCharWidth;
        }
        var b = C("span", "xxxxxxxxxx");
        var c = C("pre", [
            b
        ], "CodeMirror-line-like");
        B(a.measure, c);
        var d = b.getBoundingClientRect(), e = (d.right - d.left) / 10;
        if (e > 2) {
            a.cachedCharWidth = e;
        }
        return e || 10;
    }
    function c9(a) {
        var b = a.display, c = {}, d = {};
        var e = b.gutters.clientLeft;
        for(var f = b.gutters.firstChild, g = 0; f; f = f.nextSibling, ++g){
            var h = a.display.gutterSpecs[g].className;
            c[h] = f.offsetLeft + f.clientLeft + e;
            d[h] = f.clientWidth;
        }
        return {
            fixedPos: da(b),
            gutterTotalWidth: b.gutters.offsetWidth,
            gutterLeft: c,
            gutterWidth: d,
            wrapperWidth: b.wrapper.clientWidth
        };
    }
    function da(a) {
        return (a.scroller.getBoundingClientRect().left - a.sizer.getBoundingClientRect().left);
    }
    function db(a) {
        var b = c7(a.display), c = a.options.lineWrapping;
        var d = c && Math.max(5, a.display.scroller.clientWidth / c8(a.display) - 3);
        return function(e) {
            if (bU(a.doc, e)) {
                return 0;
            }
            var f = 0;
            if (e.widgets) {
                for(var g = 0; g < e.widgets.length; g++){
                    if (e.widgets[g].height) {
                        f += e.widgets[g].height;
                    }
                }
            }
            if (c) {
                return (f + (Math.ceil(e.text.length / d) || 1) * b);
            } else {
                return f + b;
            }
        };
    }
    function dc(a) {
        var b = a.doc, c = db(a);
        b.iter(function(a) {
            var b = c(a);
            if (b != a.height) {
                a_(a, b);
            }
        });
    }
    function dd(a, b, c, d) {
        var e = a.display;
        if (!c && aA(b).getAttribute("cm-not-content") == "true") {
            return null;
        }
        var f, g, h = e.lineSpace.getBoundingClientRect();
        try {
            f = b.clientX - h.left;
            g = b.clientY - h.top;
        } catch (i) {
            return null;
        }
        var j = c_(a, f, g), k;
        if (d && j.xRel > 0 && (k = aY(a.doc, j.line).text).length == j.ch) {
            var l = M(k, k.length, a.options.tabSize) - k.length;
            j = a4(j.line, Math.max(0, Math.round((f - cz(a.display).left) / c8(a.display)) - l));
        }
        return j;
    }
    function de(a, b) {
        if (b >= a.display.viewTo) {
            return null;
        }
        b -= a.display.viewFrom;
        if (b < 0) {
            return null;
        }
        var c = a.display.view;
        for(var d = 0; d < c.length; d++){
            b -= c[d].size;
            if (b < 0) {
                return d;
            }
        }
    }
    function df(a, b, c, d) {
        if (b == null) {
            b = a.doc.first;
        }
        if (c == null) {
            c = a.doc.first + a.doc.size;
        }
        if (!d) {
            d = 0;
        }
        var e = a.display;
        if (d && c < e.viewTo && (e.updateLineNumbers == null || e.updateLineNumbers > b)) {
            e.updateLineNumbers = b;
        }
        a.curOp.viewChanged = true;
        if (b >= e.viewTo) {
            if (bt && bS(a.doc, b) < e.viewTo) {
                dh(a);
            }
        } else if (c <= e.viewFrom) {
            if (bt && bT(a.doc, c + d) > e.viewFrom) {
                dh(a);
            } else {
                e.viewFrom += d;
                e.viewTo += d;
            }
        } else if (b <= e.viewFrom && c >= e.viewTo) {
            dh(a);
        } else if (b <= e.viewFrom) {
            var f = di(a, c, c + d, 1);
            if (f) {
                e.view = e.view.slice(f.index);
                e.viewFrom = f.lineN;
                e.viewTo += d;
            } else {
                dh(a);
            }
        } else if (c >= e.viewTo) {
            var g = di(a, b, b, -1);
            if (g) {
                e.view = e.view.slice(0, g.index);
                e.viewTo = g.lineN;
            } else {
                dh(a);
            }
        } else {
            var h = di(a, b, b, -1);
            var i = di(a, c, c + d, 1);
            if (h && i) {
                e.view = e.view.slice(0, h.index).concat(cb(a, h.lineN, i.lineN)).concat(e.view.slice(i.index));
                e.viewTo += d;
            } else {
                dh(a);
            }
        }
        var j = e.externalMeasured;
        if (j) {
            if (c < j.lineN) {
                j.lineN += d;
            } else if (b < j.lineN + j.size) {
                e.externalMeasured = null;
            }
        }
    }
    function dg(a, b, c) {
        a.curOp.viewChanged = true;
        var d = a.display, e = a.display.externalMeasured;
        if (e && b >= e.lineN && b < e.lineN + e.size) {
            d.externalMeasured = null;
        }
        if (b < d.viewFrom || b >= d.viewTo) {
            return;
        }
        var f = d.view[de(a, b)];
        if (f.node == null) {
            return;
        }
        var g = f.changes || (f.changes = []);
        if (O(g, c) == -1) {
            g.push(c);
        }
    }
    function dh(a) {
        a.display.viewFrom = a.display.viewTo = a.doc.first;
        a.display.view = [];
        a.display.viewOffset = 0;
    }
    function di(a, b, c, d) {
        var e = de(a, b), f, g = a.display.view;
        if (!bt || c == a.doc.first + a.doc.size) {
            return {
                index: e,
                lineN: c
            };
        }
        var h = a.display.viewFrom;
        for(var i = 0; i < e; i++){
            h += g[i].size;
        }
        if (h != b) {
            if (d > 0) {
                if (e == g.length - 1) {
                    return null;
                }
                f = h + g[e].size - b;
                e++;
            } else {
                f = h - b;
            }
            b += f;
            c += f;
        }
        while(bS(a.doc, c) != c){
            if (e == (d < 0 ? 0 : g.length - 1)) {
                return null;
            }
            c += d * g[e - (d < 0 ? 1 : 0)].size;
            e += d;
        }
        return {
            index: e,
            lineN: c
        };
    }
    function dj(a, b, c) {
        var d = a.display, e = d.view;
        if (e.length == 0 || b >= d.viewTo || c <= d.viewFrom) {
            d.view = cb(a, b, c);
            d.viewFrom = b;
        } else {
            if (d.viewFrom > b) {
                d.view = cb(a, b, d.viewFrom).concat(d.view);
            } else if (d.viewFrom < b) {
                d.view = d.view.slice(de(a, b));
            }
            d.viewFrom = b;
            if (d.viewTo < c) {
                d.view = d.view.concat(cb(a, d.viewTo, c));
            } else if (d.viewTo > c) {
                d.view = d.view.slice(0, de(a, c));
            }
        }
        d.viewTo = c;
    }
    function dk(a) {
        var b = a.display.view, c = 0;
        for(var d = 0; d < b.length; d++){
            var e = b[d];
            if (!e.hidden && (!e.node || e.changes)) {
                ++c;
            }
        }
        return c;
    }
    function dl(a) {
        a.display.input.showSelection(a.display.input.prepareSelection());
    }
    function dm(a, b) {
        if (b === void 0) b = true;
        var c = a.doc, d = {};
        var e = (d.cursors = document.createDocumentFragment());
        var f = (d.selection = document.createDocumentFragment());
        var g = a.options.$customCursor;
        if (g) {
            b = true;
        }
        for(var h = 0; h < c.sel.ranges.length; h++){
            if (!b && h == c.sel.primIndex) {
                continue;
            }
            var i = c.sel.ranges[h];
            if (i.from().line >= a.display.viewTo || i.to().line < a.display.viewFrom) {
                continue;
            }
            var j = i.empty();
            if (g) {
                var k = g(a, i);
                if (k) {
                    dn(a, k, e);
                }
            } else if (j || a.options.showCursorWhenSelecting) {
                dn(a, i.head, e);
            }
            if (!j) {
                dq(a, i, f);
            }
        }
        return d;
    }
    function dn(a, b, c) {
        var d = cY(a, b, "div", null, null, !a.options.singleCursorHeightPerLine);
        var e = c.appendChild(C("div", "\u00a0", "CodeMirror-cursor"));
        e.style.left = d.left + "px";
        e.style.top = d.top + "px";
        e.style.height = Math.max(0, d.bottom - d.top) * a.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(a.getWrapperElement().className)) {
            var f = cX(a, b, "div", null, null);
            var g = f.right - f.left;
            e.style.width = (g > 0 ? g : a.defaultCharWidth()) + "px";
        }
        if (d.other) {
            var h = c.appendChild(C("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            h.style.display = "";
            h.style.left = d.other.left + "px";
            h.style.top = d.other.top + "px";
            h.style.height = (d.other.bottom - d.other.top) * 0.85 + "px";
        }
    }
    function dp(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    function dq(a, b, c) {
        var d = a.display, e = a.doc;
        var f = document.createDocumentFragment();
        var g = cz(a.display), h = g.left;
        var i = Math.max(d.sizerWidth, cB(a) - d.sizer.offsetLeft) - g.right;
        var j = e.direction == "ltr";
        function k(a, b, c, d) {
            if (b < 0) {
                b = 0;
            }
            b = Math.round(b);
            d = Math.round(d);
            f.appendChild(C("div", null, "CodeMirror-selected", "position: absolute; left: " + a + "px;\n                             top: " + b + "px; width: " + (c == null ? i - a : c) + "px;\n                             height: " + (d - b) + "px"));
        }
        function l(b, c, d) {
            var f = aY(e, b);
            var g = f.text.length;
            var l, m;
            function n(c, d) {
                return cX(a, a4(b, c), "div", f, d);
            }
            function o(b, c, d) {
                var e = c1(a, f, null, b);
                var g = (c == "ltr") == (d == "after") ? "left" : "right";
                var h = d == "after" ? e.begin : e.end - (/\s/.test(f.text.charAt(e.end - 1)) ? 2 : 1);
                return n(h, g)[g];
            }
            var p = am(f, e.direction);
            ai(p, c || 0, d == null ? g : d, function(a, b, e, f) {
                var q = e == "ltr";
                var r = n(a, q ? "left" : "right");
                var s = n(b - 1, q ? "right" : "left");
                var t = c == null && a == 0, u = d == null && b == g;
                var v = f == 0, w = !p || f == p.length - 1;
                if (s.top - r.top <= 3) {
                    var x = (j ? t : u) && v;
                    var y = (j ? u : t) && w;
                    var z = x ? h : (q ? r : s).left;
                    var A = y ? i : (q ? s : r).right;
                    k(z, r.top, A - z, r.bottom);
                } else {
                    var B, C, D, E;
                    if (q) {
                        B = j && t && v ? h : r.left;
                        C = j ? i : o(a, e, "before");
                        D = j ? h : o(b, e, "after");
                        E = j && u && w ? i : s.right;
                    } else {
                        B = !j ? h : o(a, e, "before");
                        C = !j && t && v ? i : r.right;
                        D = !j && u && w ? h : s.left;
                        E = !j ? i : o(b, e, "after");
                    }
                    k(B, r.top, C - B, r.bottom);
                    if (r.bottom < s.top) {
                        k(h, r.bottom, null, s.top);
                    }
                    k(D, s.top, E - D, s.bottom);
                }
                if (!l || dp(r, l) < 0) {
                    l = r;
                }
                if (dp(s, l) < 0) {
                    l = s;
                }
                if (!m || dp(r, m) < 0) {
                    m = r;
                }
                if (dp(s, m) < 0) {
                    m = s;
                }
            });
            return {
                start: l,
                end: m
            };
        }
        var m = b.from(), n = b.to();
        if (m.line == n.line) {
            l(m.line, m.ch, n.ch);
        } else {
            var o = aY(e, m.line), p = aY(e, n.line);
            var q = bP(o) == bP(p);
            var r = l(m.line, m.ch, q ? o.text.length + 1 : null).end;
            var s = l(n.line, q ? 0 : null, n.ch).start;
            if (q) {
                if (r.top < s.top - 2) {
                    k(r.right, r.top, null, r.bottom);
                    k(h, s.top, s.left, s.bottom);
                } else {
                    k(r.right, r.top, s.left - r.right, r.bottom);
                }
            }
            if (r.bottom < s.top) {
                k(h, r.bottom, null, s.top);
            }
        }
        c.appendChild(f);
    }
    function dr(a) {
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
                    dv(a);
                }
                b.cursorDiv.style.visibility = (c = !c) ? "" : "hidden";
            }, a.options.cursorBlinkRate);
        } else if (a.options.cursorBlinkRate < 0) {
            b.cursorDiv.style.visibility = "hidden";
        }
    }
    function ds(a) {
        if (!a.hasFocus()) {
            a.display.input.focus();
            if (!a.state.focused) {
                du(a);
            }
        }
    }
    function dt(a) {
        a.state.delayingBlurEvent = true;
        setTimeout(function() {
            if (a.state.delayingBlurEvent) {
                a.state.delayingBlurEvent = false;
                if (a.state.focused) {
                    dv(a);
                }
            }
        }, 100);
    }
    function du(a, b) {
        if (a.state.delayingBlurEvent && !a.state.draggingText) {
            a.state.delayingBlurEvent = false;
        }
        if (a.options.readOnly == "nocursor") {
            return;
        }
        if (!a.state.focused) {
            ar(a, "focus", a, b);
            a.state.focused = true;
            H(a.display.wrapper, "CodeMirror-focused");
            if (!a.curOp && a.display.selForContextMenu != a.doc.sel) {
                a.display.input.reset();
                if (i) {
                    setTimeout(function() {
                        return a.display.input.reset(true);
                    }, 20);
                }
            }
            a.display.input.receivedFocus();
        }
        dr(a);
    }
    function dv(a, b) {
        if (a.state.delayingBlurEvent) {
            return;
        }
        if (a.state.focused) {
            ar(a, "blur", a, b);
            a.state.focused = false;
            z(a.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(a.display.blinker);
        setTimeout(function() {
            if (!a.state.focused) {
                a.display.shift = false;
            }
        }, 150);
    }
    function dw(a) {
        var b = a.display;
        var c = b.lineDiv.offsetTop;
        var d = Math.max(0, b.scroller.getBoundingClientRect().top);
        var e = b.lineDiv.getBoundingClientRect().top;
        var f = 0;
        for(var i = 0; i < b.view.length; i++){
            var j = b.view[i], k = a.options.lineWrapping;
            var l = void 0, m = 0;
            if (j.hidden) {
                continue;
            }
            e += j.line.height;
            if (g && h < 8) {
                var n = j.node.offsetTop + j.node.offsetHeight;
                l = n - c;
                c = n;
            } else {
                var o = j.node.getBoundingClientRect();
                l = o.bottom - o.top;
                if (!k && j.text.firstChild) {
                    m = j.text.firstChild.getBoundingClientRect().right - o.left - 1;
                }
            }
            var p = j.line.height - l;
            if (p > 0.005 || p < -0.005) {
                if (e < d) {
                    f -= p;
                }
                a_(j.line, l);
                dx(j.line);
                if (j.rest) {
                    for(var q = 0; q < j.rest.length; q++){
                        dx(j.rest[q]);
                    }
                }
            }
            if (m > a.display.sizerWidth) {
                var r = Math.ceil(m / c8(a.display));
                if (r > a.display.maxLineLength) {
                    a.display.maxLineLength = r;
                    a.display.maxLine = j.line;
                    a.display.maxLineChanged = true;
                }
            }
        }
        if (Math.abs(f) > 2) {
            b.scroller.scrollTop += f;
        }
    }
    function dx(a) {
        if (a.widgets) {
            for(var b = 0; b < a.widgets.length; ++b){
                var c = a.widgets[b], d = c.node.parentNode;
                if (d) {
                    c.height = d.offsetHeight;
                }
            }
        }
    }
    function dy(a, b, c) {
        var d = c && c.top != null ? Math.max(0, c.top) : a.scroller.scrollTop;
        d = Math.floor(d - cx(a));
        var e = c && c.bottom != null ? c.bottom : d + a.wrapper.clientHeight;
        var f = a1(b, d), g = a1(b, e);
        if (c && c.ensure) {
            var h = c.ensure.from.line, i = c.ensure.to.line;
            if (h < f) {
                f = h;
                g = a1(b, bW(aY(b, h)) + a.wrapper.clientHeight);
            } else if (Math.min(i, b.lastLine()) >= g) {
                f = a1(b, bW(aY(b, i)) - a.wrapper.clientHeight);
                g = i;
            }
        }
        return {
            from: f,
            to: Math.max(g, f + 1)
        };
    }
    function dz(a, b) {
        if (as(a, "scrollCursorIntoView")) {
            return;
        }
        var c = a.display, d = c.sizer.getBoundingClientRect(), e = null;
        if (b.top + d.top < 0) {
            e = true;
        } else if (b.bottom + d.top > (window.innerHeight || document.documentElement.clientHeight)) {
            e = false;
        }
        if (e != null && !o) {
            var f = C("div", "\u200b", null, "position: absolute;\n                         top: " + (b.top - c.viewOffset - cx(a.display)) + "px;\n                         height: " + (b.bottom - b.top + cA(a) + c.barHeight) + "px;\n                         left: " + b.left + "px; width: " + Math.max(2, b.right - b.left) + "px;");
            a.display.lineSpace.appendChild(f);
            f.scrollIntoView(e);
            a.display.lineSpace.removeChild(f);
        }
    }
    function dA(a, b, c, d) {
        if (d == null) {
            d = 0;
        }
        var e;
        if (!a.options.lineWrapping && b == c) {
            c = b.sticky == "before" ? a4(b.line, b.ch + 1, "before") : b;
            b = b.ch ? a4(b.line, b.sticky == "before" ? b.ch - 1 : b.ch, "after") : b;
        }
        for(var f = 0; f < 5; f++){
            var g = false;
            var h = cY(a, b);
            var i = !c || c == b ? h : cY(a, c);
            e = {
                left: Math.min(h.left, i.left),
                top: Math.min(h.top, i.top) - d,
                right: Math.max(h.left, i.left),
                bottom: Math.max(h.bottom, i.bottom) + d
            };
            var j = dC(a, e);
            var k = a.doc.scrollTop, l = a.doc.scrollLeft;
            if (j.scrollTop != null) {
                dJ(a, j.scrollTop);
                if (Math.abs(a.doc.scrollTop - k) > 1) {
                    g = true;
                }
            }
            if (j.scrollLeft != null) {
                dL(a, j.scrollLeft);
                if (Math.abs(a.doc.scrollLeft - l) > 1) {
                    g = true;
                }
            }
            if (!g) {
                break;
            }
        }
        return e;
    }
    function dB(a, b) {
        var c = dC(a, b);
        if (c.scrollTop != null) {
            dJ(a, c.scrollTop);
        }
        if (c.scrollLeft != null) {
            dL(a, c.scrollLeft);
        }
    }
    function dC(a, b) {
        var c = a.display, d = c7(a.display);
        if (b.top < 0) {
            b.top = 0;
        }
        var e = a.curOp && a.curOp.scrollTop != null ? a.curOp.scrollTop : c.scroller.scrollTop;
        var f = cC(a), g = {};
        if (b.bottom - b.top > f) {
            b.bottom = b.top + f;
        }
        var h = a.doc.height + cy(c);
        var i = b.top < d, j = b.bottom > h - d;
        if (b.top < e) {
            g.scrollTop = i ? 0 : b.top;
        } else if (b.bottom > e + f) {
            var k = Math.min(b.top, (j ? h : b.bottom) - f);
            if (k != e) {
                g.scrollTop = k;
            }
        }
        var l = a.options.fixedGutter ? 0 : c.gutters.offsetWidth;
        var m = a.curOp && a.curOp.scrollLeft != null ? a.curOp.scrollLeft : c.scroller.scrollLeft - l;
        var n = cB(a) - c.gutters.offsetWidth;
        var o = b.right - b.left > n;
        if (o) {
            b.right = b.left + n;
        }
        if (b.left < 10) {
            g.scrollLeft = 0;
        } else if (b.left < m) {
            g.scrollLeft = Math.max(0, b.left + l - (o ? 0 : 10));
        } else if (b.right > n + m - 3) {
            g.scrollLeft = b.right + (o ? 0 : 10) - n;
        }
        return g;
    }
    function dD(a, b) {
        if (b == null) {
            return;
        }
        dH(a);
        a.curOp.scrollTop = (a.curOp.scrollTop == null ? a.doc.scrollTop : a.curOp.scrollTop) + b;
    }
    function dE(a) {
        dH(a);
        var b = a.getCursor();
        a.curOp.scrollToPos = {
            from: b,
            to: b,
            margin: a.options.cursorScrollMargin
        };
    }
    function dF(a, b, c) {
        if (b != null || c != null) {
            dH(a);
        }
        if (b != null) {
            a.curOp.scrollLeft = b;
        }
        if (c != null) {
            a.curOp.scrollTop = c;
        }
    }
    function dG(a, b) {
        dH(a);
        a.curOp.scrollToPos = b;
    }
    function dH(a) {
        var b = a.curOp.scrollToPos;
        if (b) {
            a.curOp.scrollToPos = null;
            var c = cZ(a, b.from), d = cZ(a, b.to);
            dI(a, c, d, b.margin);
        }
    }
    function dI(a, b, c, d) {
        var e = dC(a, {
            left: Math.min(b.left, c.left),
            top: Math.min(b.top, c.top) - d,
            right: Math.max(b.right, c.right),
            bottom: Math.max(b.bottom, c.bottom) + d
        });
        dF(a, e.scrollLeft, e.scrollTop);
    }
    function dJ(a, b) {
        if (Math.abs(a.doc.scrollTop - b) < 2) {
            return;
        }
        if (!c) {
            ec(a, {
                top: b
            });
        }
        dK(a, b, true);
        if (c) {
            ec(a);
        }
        d4(a, 100);
    }
    function dK(a, b, c) {
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
    function dL(a, b, c, d) {
        b = Math.max(0, Math.min(b, a.display.scroller.scrollWidth - a.display.scroller.clientWidth));
        if ((c ? b == a.doc.scrollLeft : Math.abs(a.doc.scrollLeft - b) < 2) && !d) {
            return;
        }
        a.doc.scrollLeft = b;
        eg(a);
        if (a.display.scroller.scrollLeft != b) {
            a.display.scroller.scrollLeft = b;
        }
        a.display.scrollbars.setScrollLeft(b);
    }
    function dM(a) {
        var b = a.display, c = b.gutters.offsetWidth;
        var d = Math.round(a.doc.height + cy(a.display));
        return {
            clientHeight: b.scroller.clientHeight,
            viewHeight: b.wrapper.clientHeight,
            scrollWidth: b.scroller.scrollWidth,
            clientWidth: b.scroller.clientWidth,
            viewWidth: b.wrapper.clientWidth,
            barLeft: a.options.fixedGutter ? c : 0,
            docHeight: d,
            scrollHeight: d + cA(a) + b.barHeight,
            nativeBarWidth: b.nativeBarWidth,
            gutterWidth: c
        };
    }
    var dN = function(a, b, c) {
        this.cm = c;
        var d = (this.vert = C("div", [
            C("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar"));
        var e = (this.horiz = C("div", [
            C("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar"));
        d.tabIndex = e.tabIndex = -1;
        a(d);
        a(e);
        ao(d, "scroll", function() {
            if (d.clientHeight) {
                b(d.scrollTop, "vertical");
            }
        });
        ao(e, "scroll", function() {
            if (e.clientWidth) {
                b(e.scrollLeft, "horizontal");
            }
        });
        this.checkedZeroWidth = false;
        if (g && h < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
    };
    dN.prototype.update = function(a) {
        var b = a.scrollWidth > a.clientWidth + 1;
        var c = a.scrollHeight > a.clientHeight + 1;
        var d = a.nativeBarWidth;
        if (c) {
            this.vert.style.display = "block";
            this.vert.style.bottom = b ? d + "px" : "0";
            var e = a.viewHeight - (b ? d : 0);
            this.vert.firstChild.style.height = Math.max(0, a.scrollHeight - a.clientHeight + e) + "px";
        } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
        }
        if (b) {
            this.horiz.style.display = "block";
            this.horiz.style.right = c ? d + "px" : "0";
            this.horiz.style.left = a.barLeft + "px";
            var f = a.viewWidth - a.barLeft - (c ? d : 0);
            this.horiz.firstChild.style.width = Math.max(0, a.scrollWidth - a.clientWidth + f) + "px";
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && a.clientHeight > 0) {
            if (d == 0) {
                this.zeroWidthHack();
            }
            this.checkedZeroWidth = true;
        }
        return {
            right: c ? d : 0,
            bottom: b ? d : 0
        };
    };
    dN.prototype.setScrollLeft = function(a) {
        if (this.horiz.scrollLeft != a) {
            this.horiz.scrollLeft = a;
        }
        if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
    };
    dN.prototype.setScrollTop = function(a) {
        if (this.vert.scrollTop != a) {
            this.vert.scrollTop = a;
        }
        if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
    };
    dN.prototype.zeroWidthHack = function() {
        var a = s && !n ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = a;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new N();
        this.disableVert = new N();
    };
    dN.prototype.enableZeroWidthBar = function(a, b, c) {
        a.style.pointerEvents = "auto";
        function d() {
            var e = a.getBoundingClientRect();
            var f = c == "vert" ? document.elementFromPoint(e.right - 1, (e.top + e.bottom) / 2) : document.elementFromPoint((e.right + e.left) / 2, e.bottom - 1);
            if (f != a) {
                a.style.pointerEvents = "none";
            } else {
                b.set(1000, d);
            }
        }
        b.set(1000, d);
    };
    dN.prototype.clear = function() {
        var a = this.horiz.parentNode;
        a.removeChild(this.horiz);
        a.removeChild(this.vert);
    };
    var dO = function() {};
    dO.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    };
    dO.prototype.setScrollLeft = function() {};
    dO.prototype.setScrollTop = function() {};
    dO.prototype.clear = function() {};
    function dP(a, b) {
        if (!b) {
            b = dM(a);
        }
        var c = a.display.barWidth, d = a.display.barHeight;
        dQ(a, b);
        for(var e = 0; (e < 4 && c != a.display.barWidth) || d != a.display.barHeight; e++){
            if (c != a.display.barWidth && a.options.lineWrapping) {
                dw(a);
            }
            dQ(a, dM(a));
            c = a.display.barWidth;
            d = a.display.barHeight;
        }
    }
    function dQ(a, b) {
        var c = a.display;
        var d = c.scrollbars.update(b);
        c.sizer.style.paddingRight = (c.barWidth = d.right) + "px";
        c.sizer.style.paddingBottom = (c.barHeight = d.bottom) + "px";
        c.heightForcer.style.borderBottom = d.bottom + "px solid transparent";
        if (d.right && d.bottom) {
            c.scrollbarFiller.style.display = "block";
            c.scrollbarFiller.style.height = d.bottom + "px";
            c.scrollbarFiller.style.width = d.right + "px";
        } else {
            c.scrollbarFiller.style.display = "";
        }
        if (d.bottom && a.options.coverGutterNextToScrollbar && a.options.fixedGutter) {
            c.gutterFiller.style.display = "block";
            c.gutterFiller.style.height = d.bottom + "px";
            c.gutterFiller.style.width = b.gutterWidth + "px";
        } else {
            c.gutterFiller.style.display = "";
        }
    }
    var dR = {
        native: dN,
        null: dO
    };
    function dS(a) {
        if (a.display.scrollbars) {
            a.display.scrollbars.clear();
            if (a.display.scrollbars.addClass) {
                z(a.display.wrapper, a.display.scrollbars.addClass);
            }
        }
        a.display.scrollbars = new dR[a.options.scrollbarStyle](function(b) {
            a.display.wrapper.insertBefore(b, a.display.scrollbarFiller);
            ao(b, "mousedown", function() {
                if (a.state.focused) {
                    setTimeout(function() {
                        return a.display.input.focus();
                    }, 0);
                }
            });
            b.setAttribute("cm-not-content", "true");
        }, function(b, c) {
            if (c == "horizontal") {
                dL(a, b);
            } else {
                dJ(a, b);
            }
        }, a);
        if (a.display.scrollbars.addClass) {
            H(a.display.wrapper, a.display.scrollbars.addClass);
        }
    }
    var dT = 0;
    function dU(a) {
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
            id: ++dT,
            markArrays: null
        };
        cd(a.curOp);
    }
    function dV(a) {
        var b = a.curOp;
        if (b) {
            cf(b, function(a) {
                for(var b = 0; b < a.ops.length; b++){
                    a.ops[b].cm.curOp = null;
                }
                dW(a);
            });
        }
    }
    function dW(a) {
        var b = a.ops;
        for(var c = 0; c < b.length; c++){
            dX(b[c]);
        }
        for(var d = 0; d < b.length; d++){
            dY(b[d]);
        }
        for(var e = 0; e < b.length; e++){
            dZ(b[e]);
        }
        for(var f = 0; f < b.length; f++){
            d$(b[f]);
        }
        for(var g = 0; g < b.length; g++){
            d_(b[g]);
        }
    }
    function dX(a) {
        var b = a.cm, c = b.display;
        d7(b);
        if (a.updateMaxLine) {
            bY(b);
        }
        a.mustUpdate = a.viewChanged || a.forceUpdate || a.scrollTop != null || (a.scrollToPos && (a.scrollToPos.from.line < c.viewFrom || a.scrollToPos.to.line >= c.viewTo)) || (c.maxLineChanged && b.options.lineWrapping);
        a.update = a.mustUpdate && new d6(b, a.mustUpdate && {
            top: a.scrollTop,
            ensure: a.scrollToPos
        }, a.forceUpdate);
    }
    function dY(a) {
        a.updatedDisplay = a.mustUpdate && ea(a.cm, a.update);
    }
    function dZ(a) {
        var b = a.cm, c = b.display;
        if (a.updatedDisplay) {
            dw(b);
        }
        a.barMeasure = dM(b);
        if (c.maxLineChanged && !b.options.lineWrapping) {
            a.adjustWidthTo = cG(b, c.maxLine, c.maxLine.text.length).left + 3;
            b.display.sizerWidth = a.adjustWidthTo;
            a.barMeasure.scrollWidth = Math.max(c.scroller.clientWidth, c.sizer.offsetLeft + a.adjustWidthTo + cA(b) + b.display.barWidth);
            a.maxScrollLeft = Math.max(0, c.sizer.offsetLeft + a.adjustWidthTo - cB(b));
        }
        if (a.updatedDisplay || a.selectionChanged) {
            a.preparedSelection = c.input.prepareSelection();
        }
    }
    function d$(a) {
        var b = a.cm;
        if (a.adjustWidthTo != null) {
            b.display.sizer.style.minWidth = a.adjustWidthTo + "px";
            if (a.maxScrollLeft < b.doc.scrollLeft) {
                dL(b, Math.min(b.display.scroller.scrollLeft, a.maxScrollLeft), true);
            }
            b.display.maxLineChanged = false;
        }
        var c = a.focus && a.focus == G();
        if (a.preparedSelection) {
            b.display.input.showSelection(a.preparedSelection, c);
        }
        if (a.updatedDisplay || a.startHeight != b.doc.height) {
            dP(b, a.barMeasure);
        }
        if (a.updatedDisplay) {
            ef(b, a.barMeasure);
        }
        if (a.selectionChanged) {
            dr(b);
        }
        if (b.state.focused && a.updateInput) {
            b.display.input.reset(a.typing);
        }
        if (c) {
            ds(a.cm);
        }
    }
    function d_(a) {
        var b = a.cm, c = b.display, d = b.doc;
        if (a.updatedDisplay) {
            eb(b, a.update);
        }
        if (c.wheelStartX != null && (a.scrollTop != null || a.scrollLeft != null || a.scrollToPos)) {
            c.wheelStartX = c.wheelStartY = null;
        }
        if (a.scrollTop != null) {
            dK(b, a.scrollTop, a.forceScroll);
        }
        if (a.scrollLeft != null) {
            dL(b, a.scrollLeft, true, true);
        }
        if (a.scrollToPos) {
            var e = dA(b, bb(d, a.scrollToPos.from), bb(d, a.scrollToPos.to), a.scrollToPos.margin);
            dz(b, e);
        }
        var f = a.maybeHiddenMarkers, g = a.maybeUnhiddenMarkers;
        if (f) {
            for(var h = 0; h < f.length; ++h){
                if (!f[h].lines.length) {
                    ar(f[h], "hide");
                }
            }
        }
        if (g) {
            for(var i = 0; i < g.length; ++i){
                if (g[i].lines.length) {
                    ar(g[i], "unhide");
                }
            }
        }
        if (c.wrapper.offsetHeight) {
            d.scrollTop = b.display.scroller.scrollTop;
        }
        if (a.changeObjs) {
            ar(b, "changes", b, a.changeObjs);
        }
        if (a.update) {
            a.update.finish();
        }
    }
    function d0(a, b) {
        if (a.curOp) {
            return b();
        }
        dU(a);
        try {
            return b();
        } finally{
            dV(a);
        }
    }
    function d1(a, b) {
        return function() {
            if (a.curOp) {
                return b.apply(a, arguments);
            }
            dU(a);
            try {
                return b.apply(a, arguments);
            } finally{
                dV(a);
            }
        };
    }
    function d2(a) {
        return function() {
            if (this.curOp) {
                return a.apply(this, arguments);
            }
            dU(this);
            try {
                return a.apply(this, arguments);
            } finally{
                dV(this);
            }
        };
    }
    function d3(a) {
        return function() {
            var b = this.cm;
            if (!b || b.curOp) {
                return a.apply(this, arguments);
            }
            dU(b);
            try {
                return a.apply(this, arguments);
            } finally{
                dV(b);
            }
        };
    }
    function d4(a, b) {
        if (a.doc.highlightFrontier < a.display.viewTo) {
            a.state.highlight.set(b, K(d5, a));
        }
    }
    function d5(a) {
        var b = a.doc;
        if (b.highlightFrontier >= a.display.viewTo) {
            return;
        }
        var c = +new Date() + a.options.workTime;
        var d = bi(a, b.highlightFrontier);
        var e = [];
        b.iter(d.line, Math.min(b.first + b.size, a.display.viewTo + 500), function(f) {
            if (d.line >= a.display.viewFrom) {
                var g = f.styles;
                var h = f.text.length > a.options.maxHighlightLength ? aU(b.mode, d.state) : null;
                var i = bg(a, f, d, true);
                if (h) {
                    d.state = h;
                }
                f.styles = i.styles;
                var j = f.styleClasses, k = i.classes;
                if (k) {
                    f.styleClasses = k;
                } else if (j) {
                    f.styleClasses = null;
                }
                var l = !g || g.length != f.styles.length || (j != k && (!j || !k || j.bgClass != k.bgClass || j.textClass != k.textClass));
                for(var m = 0; !l && m < g.length; ++m){
                    l = g[m] != f.styles[m];
                }
                if (l) {
                    e.push(d.line);
                }
                f.stateAfter = d.save();
                d.nextLine();
            } else {
                if (f.text.length <= a.options.maxHighlightLength) {
                    bj(a, f.text, d);
                }
                f.stateAfter = d.line % 5 == 0 ? d.save() : null;
                d.nextLine();
            }
            if (+new Date() > c) {
                d4(a, a.options.workDelay);
                return true;
            }
        });
        b.highlightFrontier = d.line;
        b.modeFrontier = Math.max(b.modeFrontier, d.line);
        if (e.length) {
            d0(a, function() {
                for(var b = 0; b < e.length; b++){
                    dg(a, e[b], "text");
                }
            });
        }
    }
    var d6 = function(a, b, c) {
        var d = a.display;
        this.viewport = b;
        this.visible = dy(d, a.doc, b);
        this.editorIsHidden = !d.wrapper.offsetWidth;
        this.wrapperHeight = d.wrapper.clientHeight;
        this.wrapperWidth = d.wrapper.clientWidth;
        this.oldDisplayWidth = cB(a);
        this.force = c;
        this.dims = c9(a);
        this.events = [];
    };
    d6.prototype.signal = function(a, b) {
        if (au(a, b)) {
            this.events.push(arguments);
        }
    };
    d6.prototype.finish = function() {
        for(var a = 0; a < this.events.length; a++){
            ar.apply(null, this.events[a]);
        }
    };
    function d7(a) {
        var b = a.display;
        if (!b.scrollbarsClipped && b.scroller.offsetWidth) {
            b.nativeBarWidth = b.scroller.offsetWidth - b.scroller.clientWidth;
            b.heightForcer.style.height = cA(a) + "px";
            b.sizer.style.marginBottom = -b.nativeBarWidth + "px";
            b.sizer.style.borderRightWidth = cA(a) + "px";
            b.scrollbarsClipped = true;
        }
    }
    function d8(a) {
        if (a.hasFocus()) {
            return null;
        }
        var b = G();
        if (!b || !F(a.display.lineDiv, b)) {
            return null;
        }
        var c = {
            activeElt: b
        };
        if (window.getSelection) {
            var d = window.getSelection();
            if (d.anchorNode && d.extend && F(a.display.lineDiv, d.anchorNode)) {
                c.anchorNode = d.anchorNode;
                c.anchorOffset = d.anchorOffset;
                c.focusNode = d.focusNode;
                c.focusOffset = d.focusOffset;
            }
        }
        return c;
    }
    function d9(a) {
        if (!a || !a.activeElt || a.activeElt == G()) {
            return;
        }
        a.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(a.activeElt.nodeName) && a.anchorNode && F(document.body, a.anchorNode) && F(document.body, a.focusNode)) {
            var b = window.getSelection(), c = document.createRange();
            c.setEnd(a.anchorNode, a.anchorOffset);
            c.collapse(false);
            b.removeAllRanges();
            b.addRange(c);
            b.extend(a.focusNode, a.focusOffset);
        }
    }
    function ea(a, b) {
        var c = a.display, d = a.doc;
        if (b.editorIsHidden) {
            dh(a);
            return false;
        }
        if (!b.force && b.visible.from >= c.viewFrom && b.visible.to <= c.viewTo && (c.updateLineNumbers == null || c.updateLineNumbers >= c.viewTo) && c.renderedView == c.view && dk(a) == 0) {
            return false;
        }
        if (eh(a)) {
            dh(a);
            b.dims = c9(a);
        }
        var e = d.first + d.size;
        var f = Math.max(b.visible.from - a.options.viewportMargin, d.first);
        var g = Math.min(e, b.visible.to + a.options.viewportMargin);
        if (c.viewFrom < f && f - c.viewFrom < 20) {
            f = Math.max(d.first, c.viewFrom);
        }
        if (c.viewTo > g && c.viewTo - g < 20) {
            g = Math.min(e, c.viewTo);
        }
        if (bt) {
            f = bS(a.doc, f);
            g = bT(a.doc, g);
        }
        var h = f != c.viewFrom || g != c.viewTo || c.lastWrapHeight != b.wrapperHeight || c.lastWrapWidth != b.wrapperWidth;
        dj(a, f, g);
        c.viewOffset = bW(aY(a.doc, c.viewFrom));
        a.display.mover.style.top = c.viewOffset + "px";
        var i = dk(a);
        if (!h && i == 0 && !b.force && c.renderedView == c.view && (c.updateLineNumbers == null || c.updateLineNumbers >= c.viewTo)) {
            return false;
        }
        var j = d8(a);
        if (i > 4) {
            c.lineDiv.style.display = "none";
        }
        ed(a, c.updateLineNumbers, b.dims);
        if (i > 4) {
            c.lineDiv.style.display = "";
        }
        c.renderedView = c.view;
        d9(j);
        A(c.cursorDiv);
        A(c.selectionDiv);
        c.gutters.style.height = c.sizer.style.minHeight = 0;
        if (h) {
            c.lastWrapHeight = b.wrapperHeight;
            c.lastWrapWidth = b.wrapperWidth;
            d4(a, 400);
        }
        c.updateLineNumbers = null;
        return true;
    }
    function eb(a, b) {
        var c = b.viewport;
        for(var d = true;; d = false){
            if (!d || !a.options.lineWrapping || b.oldDisplayWidth == cB(a)) {
                if (c && c.top != null) {
                    c = {
                        top: Math.min(a.doc.height + cy(a.display) - cC(a), c.top)
                    };
                }
                b.visible = dy(a.display, a.doc, c);
                if (b.visible.from >= a.display.viewFrom && b.visible.to <= a.display.viewTo) {
                    break;
                }
            } else if (d) {
                b.visible = dy(a.display, a.doc, c);
            }
            if (!ea(a, b)) {
                break;
            }
            dw(a);
            var e = dM(a);
            dl(a);
            dP(a, e);
            ef(a, e);
            b.force = false;
        }
        b.signal(a, "update", a);
        if (a.display.viewFrom != a.display.reportedViewFrom || a.display.viewTo != a.display.reportedViewTo) {
            b.signal(a, "viewportChange", a, a.display.viewFrom, a.display.viewTo);
            a.display.reportedViewFrom = a.display.viewFrom;
            a.display.reportedViewTo = a.display.viewTo;
        }
    }
    function ec(a, b) {
        var c = new d6(a, b);
        if (ea(a, c)) {
            dw(a);
            eb(a, c);
            var d = dM(a);
            dl(a);
            dP(a, d);
            ef(a, d);
            c.finish();
        }
    }
    function ed(a, b, c) {
        var d = a.display, e = a.options.lineNumbers;
        var f = d.lineDiv, g = f.firstChild;
        function h(b) {
            var c = b.nextSibling;
            if (i && s && a.display.currentWheelTarget == b) {
                b.style.display = "none";
            } else {
                b.parentNode.removeChild(b);
            }
            return c;
        }
        var j = d.view, k = d.viewFrom;
        for(var l = 0; l < j.length; l++){
            var m = j[l];
            if (m.hidden) ;
            else if (!m.node || m.node.parentNode != f) {
                var n = cr(a, m, k, c);
                f.insertBefore(n, g);
            } else {
                while(g != m.node){
                    g = h(g);
                }
                var o = e && b != null && b <= k && m.lineNumber;
                if (m.changes) {
                    if (O(m.changes, "gutter") > -1) {
                        o = false;
                    }
                    cj(a, m, k, c);
                }
                if (o) {
                    A(m.lineNumber);
                    m.lineNumber.appendChild(document.createTextNode(a3(a.options, k)));
                }
                g = m.node.nextSibling;
            }
            k += m.size;
        }
        while(g){
            g = h(g);
        }
    }
    function ee(a) {
        var b = a.gutters.offsetWidth;
        a.sizer.style.marginLeft = b + "px";
        ch(a, "gutterChanged", a);
    }
    function ef(a, b) {
        a.display.sizer.style.minHeight = b.docHeight + "px";
        a.display.heightForcer.style.top = b.docHeight + "px";
        a.display.gutters.style.height = b.docHeight + a.display.barHeight + cA(a) + "px";
    }
    function eg(a) {
        var b = a.display, c = b.view;
        if (!b.alignWidgets && (!b.gutters.firstChild || !a.options.fixedGutter)) {
            return;
        }
        var d = da(b) - b.scroller.scrollLeft + a.doc.scrollLeft;
        var e = b.gutters.offsetWidth, f = d + "px";
        for(var g = 0; g < c.length; g++){
            if (!c[g].hidden) {
                if (a.options.fixedGutter) {
                    if (c[g].gutter) {
                        c[g].gutter.style.left = f;
                    }
                    if (c[g].gutterBackground) {
                        c[g].gutterBackground.style.left = f;
                    }
                }
                var h = c[g].alignable;
                if (h) {
                    for(var i = 0; i < h.length; i++){
                        h[i].style.left = f;
                    }
                }
            }
        }
        if (a.options.fixedGutter) {
            b.gutters.style.left = d + e + "px";
        }
    }
    function eh(a) {
        if (!a.options.lineNumbers) {
            return false;
        }
        var b = a.doc, c = a3(a.options, b.first + b.size - 1), d = a.display;
        if (c.length != d.lineNumChars) {
            var e = d.measure.appendChild(C("div", [
                C("div", c)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var f = e.firstChild.offsetWidth, g = e.offsetWidth - f;
            d.lineGutter.style.width = "";
            d.lineNumInnerWidth = Math.max(f, d.lineGutter.offsetWidth - g) + 1;
            d.lineNumWidth = d.lineNumInnerWidth + g;
            d.lineNumChars = d.lineNumInnerWidth ? c.length : -1;
            d.lineGutter.style.width = d.lineNumWidth + "px";
            ee(a.display);
            return true;
        }
        return false;
    }
    function ei(a, b) {
        var c = [], d = false;
        for(var e = 0; e < a.length; e++){
            var f = a[e], g = null;
            if (typeof f != "string") {
                g = f.style;
                f = f.className;
            }
            if (f == "CodeMirror-linenumbers") {
                if (!b) {
                    continue;
                } else {
                    d = true;
                }
            }
            c.push({
                className: f,
                style: g
            });
        }
        if (b && !d) {
            c.push({
                className: "CodeMirror-linenumbers",
                style: null
            });
        }
        return c;
    }
    function ej(a) {
        var b = a.gutters, c = a.gutterSpecs;
        A(b);
        a.lineGutter = null;
        for(var d = 0; d < c.length; ++d){
            var e = c[d];
            var f = e.className;
            var g = e.style;
            var h = b.appendChild(C("div", null, "CodeMirror-gutter " + f));
            if (g) {
                h.style.cssText = g;
            }
            if (f == "CodeMirror-linenumbers") {
                a.lineGutter = h;
                h.style.width = (a.lineNumWidth || 1) + "px";
            }
        }
        b.style.display = c.length ? "" : "none";
        ee(a);
    }
    function ek(a) {
        ej(a.display);
        df(a);
        eg(a);
    }
    function el(a, b, d, e) {
        var f = this;
        this.input = d;
        f.scrollbarFiller = C("div", null, "CodeMirror-scrollbar-filler");
        f.scrollbarFiller.setAttribute("cm-not-content", "true");
        f.gutterFiller = C("div", null, "CodeMirror-gutter-filler");
        f.gutterFiller.setAttribute("cm-not-content", "true");
        f.lineDiv = D("div", null, "CodeMirror-code");
        f.selectionDiv = C("div", null, null, "position: relative; z-index: 1");
        f.cursorDiv = C("div", null, "CodeMirror-cursors");
        f.measure = C("div", null, "CodeMirror-measure");
        f.lineMeasure = C("div", null, "CodeMirror-measure");
        f.lineSpace = D("div", [
            f.measure,
            f.lineMeasure,
            f.selectionDiv,
            f.cursorDiv,
            f.lineDiv
        ], null, "position: relative; outline: none");
        var j = D("div", [
            f.lineSpace
        ], "CodeMirror-lines");
        f.mover = C("div", [
            j
        ], null, "position: relative");
        f.sizer = C("div", [
            f.mover
        ], "CodeMirror-sizer");
        f.sizerWidth = null;
        f.heightForcer = C("div", null, null, "position: absolute; height: " + P + "px; width: 1px;");
        f.gutters = C("div", null, "CodeMirror-gutters");
        f.lineGutter = null;
        f.scroller = C("div", [
            f.sizer,
            f.heightForcer,
            f.gutters
        ], "CodeMirror-scroll");
        f.scroller.setAttribute("tabIndex", "-1");
        f.wrapper = C("div", [
            f.scrollbarFiller,
            f.gutterFiller,
            f.scroller
        ], "CodeMirror");
        f.wrapper.setAttribute("translate", "no");
        if (g && h < 8) {
            f.gutters.style.zIndex = -1;
            f.scroller.style.paddingRight = 0;
        }
        if (!i && !(c && r)) {
            f.scroller.draggable = true;
        }
        if (a) {
            if (a.appendChild) {
                a.appendChild(f.wrapper);
            } else {
                a(f.wrapper);
            }
        }
        f.viewFrom = f.viewTo = b.first;
        f.reportedViewFrom = f.reportedViewTo = b.first;
        f.view = [];
        f.renderedView = null;
        f.externalMeasured = null;
        f.viewOffset = 0;
        f.lastWrapHeight = f.lastWrapWidth = 0;
        f.updateLineNumbers = null;
        f.nativeBarWidth = f.barHeight = f.barWidth = 0;
        f.scrollbarsClipped = false;
        f.lineNumWidth = f.lineNumInnerWidth = f.lineNumChars = null;
        f.alignWidgets = false;
        f.cachedCharWidth = f.cachedTextHeight = f.cachedPaddingH = null;
        f.maxLine = null;
        f.maxLineLength = 0;
        f.maxLineChanged = false;
        f.wheelDX = f.wheelDY = f.wheelStartX = f.wheelStartY = null;
        f.shift = false;
        f.selForContextMenu = null;
        f.activeTouch = null;
        f.gutterSpecs = ei(e.gutters, e.lineNumbers);
        ej(f);
        d.init(f);
    }
    var em = 0, en = null;
    if (g) {
        en = -0.53;
    } else if (c) {
        en = 15;
    } else if (k) {
        en = -0.7;
    } else if (m) {
        en = -1 / 3;
    }
    function eo(a) {
        var b = a.wheelDeltaX, c = a.wheelDeltaY;
        if (b == null && a.detail && a.axis == a.HORIZONTAL_AXIS) {
            b = a.detail;
        }
        if (c == null && a.detail && a.axis == a.VERTICAL_AXIS) {
            c = a.detail;
        } else if (c == null) {
            c = a.wheelDelta;
        }
        return {
            x: b,
            y: c
        };
    }
    function ep(a) {
        var b = eo(a);
        b.x *= en;
        b.y *= en;
        return b;
    }
    function eq(a, b) {
        var d = eo(b), e = d.x, f = d.y;
        var g = en;
        if (b.deltaMode === 0) {
            e = b.deltaX;
            f = b.deltaY;
            g = 1;
        }
        var h = a.display, j = h.scroller;
        var k = j.scrollWidth > j.clientWidth;
        var m = j.scrollHeight > j.clientHeight;
        if (!((e && k) || (f && m))) {
            return;
        }
        if (f && s && i) {
            outer: for(var n = b.target, o = h.view; n != j; n = n.parentNode){
                for(var p = 0; p < o.length; p++){
                    if (o[p].node == n) {
                        a.display.currentWheelTarget = n;
                        break outer;
                    }
                }
            }
        }
        if (e && !c && !l && g != null) {
            if (f && m) {
                dJ(a, Math.max(0, j.scrollTop + f * g));
            }
            dL(a, Math.max(0, j.scrollLeft + e * g));
            if (!f || (f && m)) {
                aw(b);
            }
            h.wheelStartX = null;
            return;
        }
        if (f && g != null) {
            var q = f * g;
            var r = a.doc.scrollTop, t = r + h.wrapper.clientHeight;
            if (q < 0) {
                r = Math.max(0, r + q - 50);
            } else {
                t = Math.min(a.doc.height, t + q + 50);
            }
            ec(a, {
                top: r,
                bottom: t
            });
        }
        if (em < 20 && b.deltaMode !== 0) {
            if (h.wheelStartX == null) {
                h.wheelStartX = j.scrollLeft;
                h.wheelStartY = j.scrollTop;
                h.wheelDX = e;
                h.wheelDY = f;
                setTimeout(function() {
                    if (h.wheelStartX == null) {
                        return;
                    }
                    var a = j.scrollLeft - h.wheelStartX;
                    var b = j.scrollTop - h.wheelStartY;
                    var c = (b && h.wheelDY && b / h.wheelDY) || (a && h.wheelDX && a / h.wheelDX);
                    h.wheelStartX = h.wheelStartY = null;
                    if (!c) {
                        return;
                    }
                    en = (en * em + c) / (em + 1);
                    ++em;
                }, 200);
            } else {
                h.wheelDX += e;
                h.wheelDY += f;
            }
        }
    }
    var er = function(a, b) {
        this.ranges = a;
        this.primIndex = b;
    };
    er.prototype.primary = function() {
        return this.ranges[this.primIndex];
    };
    er.prototype.equals = function(a) {
        if (a == this) {
            return true;
        }
        if (a.primIndex != this.primIndex || a.ranges.length != this.ranges.length) {
            return false;
        }
        for(var b = 0; b < this.ranges.length; b++){
            var c = this.ranges[b], d = a.ranges[b];
            if (!a6(c.anchor, d.anchor) || !a6(c.head, d.head)) {
                return false;
            }
        }
        return true;
    };
    er.prototype.deepCopy = function() {
        var a = [];
        for(var b = 0; b < this.ranges.length; b++){
            a[b] = new es(a7(this.ranges[b].anchor), a7(this.ranges[b].head));
        }
        return new er(a, this.primIndex);
    };
    er.prototype.somethingSelected = function() {
        for(var a = 0; a < this.ranges.length; a++){
            if (!this.ranges[a].empty()) {
                return true;
            }
        }
        return false;
    };
    er.prototype.contains = function(a, b) {
        if (!b) {
            b = a;
        }
        for(var c = 0; c < this.ranges.length; c++){
            var d = this.ranges[c];
            if (a5(b, d.from()) >= 0 && a5(a, d.to()) <= 0) {
                return c;
            }
        }
        return -1;
    };
    var es = function(a, b) {
        this.anchor = a;
        this.head = b;
    };
    es.prototype.from = function() {
        return a9(this.anchor, this.head);
    };
    es.prototype.to = function() {
        return a8(this.anchor, this.head);
    };
    es.prototype.empty = function() {
        return (this.head.line == this.anchor.line && this.head.ch == this.anchor.ch);
    };
    function et(a, b, c) {
        var d = a && a.options.selectionsMayTouch;
        var e = b[c];
        b.sort(function(a, b) {
            return a5(a.from(), b.from());
        });
        c = O(b, e);
        for(var f = 1; f < b.length; f++){
            var g = b[f], h = b[f - 1];
            var i = a5(h.to(), g.from());
            if (d && !g.empty() ? i > 0 : i >= 0) {
                var j = a9(h.from(), g.from()), k = a8(h.to(), g.to());
                var l = h.empty() ? g.from() == g.head : h.from() == h.head;
                if (f <= c) {
                    --c;
                }
                b.splice(--f, 2, new es(l ? k : j, l ? j : k));
            }
        }
        return new er(b, c);
    }
    function eu(a, b) {
        return new er([
            new es(a, b || a)
        ], 0);
    }
    function ev(a) {
        if (!a.text) {
            return a.to;
        }
        return a4(a.from.line + a.text.length - 1, X(a.text).length + (a.text.length == 1 ? a.from.ch : 0));
    }
    function ew(a, b) {
        if (a5(a, b.from) < 0) {
            return a;
        }
        if (a5(a, b.to) <= 0) {
            return ev(b);
        }
        var c = a.line + b.text.length - (b.to.line - b.from.line) - 1, d = a.ch;
        if (a.line == b.to.line) {
            d += ev(b).ch - b.to.ch;
        }
        return a4(c, d);
    }
    function ex(a, b) {
        var c = [];
        for(var d = 0; d < a.sel.ranges.length; d++){
            var e = a.sel.ranges[d];
            c.push(new es(ew(e.anchor, b), ew(e.head, b)));
        }
        return et(a.cm, c, a.sel.primIndex);
    }
    function ey(a, b, c) {
        if (a.line == b.line) {
            return a4(c.line, a.ch - b.ch + c.ch);
        } else {
            return a4(c.line + (a.line - b.line), a.ch);
        }
    }
    function ez(a, b, c) {
        var d = [];
        var e = a4(a.first, 0), f = e;
        for(var g = 0; g < b.length; g++){
            var h = b[g];
            var i = ey(h.from, e, f);
            var j = ey(ev(h), e, f);
            e = h.to;
            f = j;
            if (c == "around") {
                var k = a.sel.ranges[g], l = a5(k.head, k.anchor) < 0;
                d[g] = new es(l ? j : i, l ? i : j);
            } else {
                d[g] = new es(i, i);
            }
        }
        return new er(d, a.sel.primIndex);
    }
    function eA(a) {
        a.doc.mode = aR(a.options, a.doc.modeOption);
        eB(a);
    }
    function eB(a) {
        a.doc.iter(function(a) {
            if (a.stateAfter) {
                a.stateAfter = null;
            }
            if (a.styles) {
                a.styles = null;
            }
        });
        a.doc.modeFrontier = a.doc.highlightFrontier = a.doc.first;
        d4(a, 100);
        a.state.modeGen++;
        if (a.curOp) {
            df(a);
        }
    }
    function eC(a, b) {
        return (b.from.ch == 0 && b.to.ch == 0 && X(b.text) == "" && (!a.cm || a.cm.options.wholeLineUpdateBefore));
    }
    function eD(a, b, c, d) {
        function e(a) {
            return c ? c[a] : null;
        }
        function f(a, c, e) {
            b$(a, c, e, d);
            ch(a, "change", a, b);
        }
        function g(a, b) {
            var c = [];
            for(var f = a; f < b; ++f){
                c.push(new bZ(j[f], e(f), d));
            }
            return c;
        }
        var h = b.from, i = b.to, j = b.text;
        var k = aY(a, h.line), l = aY(a, i.line);
        var m = X(j), n = e(j.length - 1), o = i.line - h.line;
        if (b.full) {
            a.insert(0, g(0, j.length));
            a.remove(j.length, a.size - j.length);
        } else if (eC(a, b)) {
            var p = g(0, j.length - 1);
            f(l, l.text, n);
            if (o) {
                a.remove(h.line, o);
            }
            if (p.length) {
                a.insert(h.line, p);
            }
        } else if (k == l) {
            if (j.length == 1) {
                f(k, k.text.slice(0, h.ch) + m + k.text.slice(i.ch), n);
            } else {
                var q = g(1, j.length - 1);
                q.push(new bZ(m + k.text.slice(i.ch), n, d));
                f(k, k.text.slice(0, h.ch) + j[0], e(0));
                a.insert(h.line + 1, q);
            }
        } else if (j.length == 1) {
            f(k, k.text.slice(0, h.ch) + j[0] + l.text.slice(i.ch), e(0));
            a.remove(h.line + 1, o);
        } else {
            f(k, k.text.slice(0, h.ch) + j[0], e(0));
            f(l, m + l.text.slice(i.ch), n);
            var r = g(1, j.length - 1);
            if (o > 1) {
                a.remove(h.line + 1, o - 1);
            }
            a.insert(h.line + 1, r);
        }
        ch(a, "change", a, b);
    }
    function eE(a, b, c) {
        function d(a, e, f) {
            if (a.linked) {
                for(var g = 0; g < a.linked.length; ++g){
                    var h = a.linked[g];
                    if (h.doc == e) {
                        continue;
                    }
                    var i = f && h.sharedHist;
                    if (c && !i) {
                        continue;
                    }
                    b(h.doc, i);
                    d(h.doc, a, i);
                }
            }
        }
        d(a, null, true);
    }
    function eF(a, b) {
        if (b.cm) {
            throw new Error("This document is already in use.");
        }
        a.doc = b;
        b.cm = a;
        dc(a);
        eA(a);
        eG(a);
        a.options.direction = b.direction;
        if (!a.options.lineWrapping) {
            bY(a);
        }
        a.options.mode = b.modeOption;
        df(a);
    }
    function eG(a) {
        (a.doc.direction == "rtl" ? H : z)(a.display.lineDiv, "CodeMirror-rtl");
    }
    function eH(a) {
        d0(a, function() {
            eG(a);
            df(a);
        });
    }
    function eI(a) {
        this.done = [];
        this.undone = [];
        this.undoDepth = a ? a.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = a ? a.maxGeneration : 1;
    }
    function eJ(a, b) {
        var c = {
            from: a7(b.from),
            to: ev(b),
            text: aZ(a, b.from, b.to)
        };
        eQ(a, c, b.from.line, b.to.line + 1);
        eE(a, function(a) {
            return eQ(a, c, b.from.line, b.to.line + 1);
        }, true);
        return c;
    }
    function eK(a) {
        while(a.length){
            var b = X(a);
            if (b.ranges) {
                a.pop();
            } else {
                break;
            }
        }
    }
    function eL(a, b) {
        if (b) {
            eK(a.done);
            return X(a.done);
        } else if (a.done.length && !X(a.done).ranges) {
            return X(a.done);
        } else if (a.done.length > 1 && !a.done[a.done.length - 2].ranges) {
            a.done.pop();
            return X(a.done);
        }
    }
    function eM(a, b, c, d) {
        var e = a.history;
        e.undone.length = 0;
        var f = +new Date(), g;
        var h;
        if ((e.lastOp == d || (e.lastOrigin == b.origin && b.origin && ((b.origin.charAt(0) == "+" && e.lastModTime > f - (a.cm ? a.cm.options.historyEventDelay : 500)) || b.origin.charAt(0) == "*"))) && (g = eL(e, e.lastOp == d))) {
            h = X(g.changes);
            if (a5(b.from, b.to) == 0 && a5(b.from, h.to) == 0) {
                h.to = ev(b);
            } else {
                g.changes.push(eJ(a, b));
            }
        } else {
            var i = X(e.done);
            if (!i || !i.ranges) {
                eP(a.sel, e.done);
            }
            g = {
                changes: [
                    eJ(a, b)
                ],
                generation: e.generation
            };
            e.done.push(g);
            while(e.done.length > e.undoDepth){
                e.done.shift();
                if (!e.done[0].ranges) {
                    e.done.shift();
                }
            }
        }
        e.done.push(c);
        e.generation = ++e.maxGeneration;
        e.lastModTime = e.lastSelTime = f;
        e.lastOp = e.lastSelOp = d;
        e.lastOrigin = e.lastSelOrigin = b.origin;
        if (!h) {
            ar(a, "historyAdded");
        }
    }
    function eN(a, b, c, d) {
        var e = b.charAt(0);
        return (e == "*" || (e == "+" && c.ranges.length == d.ranges.length && c.somethingSelected() == d.somethingSelected() && new Date() - a.history.lastSelTime <= (a.cm ? a.cm.options.historyEventDelay : 500)));
    }
    function eO(a, b, c, d) {
        var e = a.history, f = d && d.origin;
        if (c == e.lastSelOp || (f && e.lastSelOrigin == f && ((e.lastModTime == e.lastSelTime && e.lastOrigin == f) || eN(a, f, X(e.done), b)))) {
            e.done[e.done.length - 1] = b;
        } else {
            eP(b, e.done);
        }
        e.lastSelTime = +new Date();
        e.lastSelOrigin = f;
        e.lastSelOp = c;
        if (d && d.clearRedo !== false) {
            eK(e.undone);
        }
    }
    function eP(a, b) {
        var c = X(b);
        if (!(c && c.ranges && c.equals(a))) {
            b.push(a);
        }
    }
    function eQ(a, b, c, d) {
        var e = b["spans_" + a.id], f = 0;
        a.iter(Math.max(a.first, c), Math.min(a.first + a.size, d), function(c) {
            if (c.markedSpans) {
                (e || (e = b["spans_" + a.id] = {}))[f] = c.markedSpans;
            }
            ++f;
        });
    }
    function eR(a) {
        if (!a) {
            return null;
        }
        var b;
        for(var c = 0; c < a.length; ++c){
            if (a[c].marker.explicitlyCleared) {
                if (!b) {
                    b = a.slice(0, c);
                }
            } else if (b) {
                b.push(a[c]);
            }
        }
        return !b ? a : b.length ? b : null;
    }
    function eS(a, b) {
        var c = b["spans_" + a.id];
        if (!c) {
            return null;
        }
        var d = [];
        for(var e = 0; e < b.text.length; ++e){
            d.push(eR(c[e]));
        }
        return d;
    }
    function eT(a, b) {
        var c = eS(a, b);
        var d = bC(a, b);
        if (!c) {
            return d;
        }
        if (!d) {
            return c;
        }
        for(var e = 0; e < c.length; ++e){
            var f = c[e], g = d[e];
            if (f && g) {
                spans: for(var h = 0; h < g.length; ++h){
                    var i = g[h];
                    for(var j = 0; j < f.length; ++j){
                        if (f[j].marker == i.marker) {
                            continue spans;
                        }
                    }
                    f.push(i);
                }
            } else if (g) {
                c[e] = g;
            }
        }
        return c;
    }
    function eU(a, b, c) {
        var d = [];
        for(var e = 0; e < a.length; ++e){
            var f = a[e];
            if (f.ranges) {
                d.push(c ? er.prototype.deepCopy.call(f) : f);
                continue;
            }
            var g = f.changes, h = [];
            d.push({
                changes: h
            });
            for(var i = 0; i < g.length; ++i){
                var j = g[i], k = void 0;
                h.push({
                    from: j.from,
                    to: j.to,
                    text: j.text
                });
                if (b) {
                    for(var l in j){
                        if ((k = l.match(/^spans_(\d+)$/))) {
                            if (O(b, Number(k[1])) > -1) {
                                X(h)[l] = j[l];
                                delete j[l];
                            }
                        }
                    }
                }
            }
        }
        return d;
    }
    function eV(a, b, c, d) {
        if (d) {
            var e = a.anchor;
            if (c) {
                var f = a5(b, e) < 0;
                if (f != a5(c, e) < 0) {
                    e = b;
                    b = c;
                } else if (f != a5(b, c) < 0) {
                    b = c;
                }
            }
            return new es(e, b);
        } else {
            return new es(c || b, b);
        }
    }
    function eW(a, b, c, d, e) {
        if (e == null) {
            e = a.cm && (a.cm.display.shift || a.extend);
        }
        e0(a, new er([
            eV(a.sel.primary(), b, c, e)
        ], 0), d);
    }
    function eX(a, b, c) {
        var d = [];
        var e = a.cm && (a.cm.display.shift || a.extend);
        for(var f = 0; f < a.sel.ranges.length; f++){
            d[f] = eV(a.sel.ranges[f], b[f], null, e);
        }
        var g = et(a.cm, d, a.sel.primIndex);
        e0(a, g, c);
    }
    function eY(a, b, c, d) {
        var e = a.sel.ranges.slice(0);
        e[b] = c;
        e0(a, et(a.cm, e, a.sel.primIndex), d);
    }
    function eZ(a, b, c, d) {
        e0(a, eu(b, c), d);
    }
    function e$(a, b, c) {
        var d = {
            ranges: b.ranges,
            update: function(b) {
                this.ranges = [];
                for(var c = 0; c < b.length; c++){
                    this.ranges[c] = new es(bb(a, b[c].anchor), bb(a, b[c].head));
                }
            },
            origin: c && c.origin
        };
        ar(a, "beforeSelectionChange", a, d);
        if (a.cm) {
            ar(a.cm, "beforeSelectionChange", a.cm, d);
        }
        if (d.ranges != b.ranges) {
            return et(a.cm, d.ranges, d.ranges.length - 1);
        } else {
            return b;
        }
    }
    function e_(a, b, c) {
        var d = a.history.done, e = X(d);
        if (e && e.ranges) {
            d[d.length - 1] = b;
            e1(a, b, c);
        } else {
            e0(a, b, c);
        }
    }
    function e0(a, b, c) {
        e1(a, b, c);
        eO(a, a.sel, a.cm ? a.cm.curOp.id : NaN, c);
    }
    function e1(a, b, c) {
        if (au(a, "beforeSelectionChange") || (a.cm && au(a.cm, "beforeSelectionChange"))) {
            b = e$(a, b, c);
        }
        var d = (c && c.bias) || (a5(b.primary().head, a.sel.primary().head) < 0 ? -1 : 1);
        e2(a, e4(a, b, d, true));
        if (!(c && c.scroll === false) && a.cm && a.cm.getOption("readOnly") != "nocursor") {
            dE(a.cm);
        }
    }
    function e2(a, b) {
        if (b.equals(a.sel)) {
            return;
        }
        a.sel = b;
        if (a.cm) {
            a.cm.curOp.updateInput = 1;
            a.cm.curOp.selectionChanged = true;
            at(a.cm);
        }
        ch(a, "cursorActivity", a);
    }
    function e3(a) {
        e2(a, e4(a, a.sel, null, false));
    }
    function e4(a, b, c, d) {
        var e;
        for(var f = 0; f < b.ranges.length; f++){
            var g = b.ranges[f];
            var h = b.ranges.length == a.sel.ranges.length && a.sel.ranges[f];
            var i = e6(a, g.anchor, h && h.anchor, c, d);
            var j = e6(a, g.head, h && h.head, c, d);
            if (e || i != g.anchor || j != g.head) {
                if (!e) {
                    e = b.ranges.slice(0, f);
                }
                e[f] = new es(i, j);
            }
        }
        return e ? et(a.cm, e, b.primIndex) : b;
    }
    function e5(a, b, c, d, e) {
        var f = aY(a, b.line);
        if (f.markedSpans) {
            for(var g = 0; g < f.markedSpans.length; ++g){
                var h = f.markedSpans[g], i = h.marker;
                var j = "selectLeft" in i ? !i.selectLeft : i.inclusiveLeft;
                var k = "selectRight" in i ? !i.selectRight : i.inclusiveRight;
                if ((h.from == null || (j ? h.from <= b.ch : h.from < b.ch)) && (h.to == null || (k ? h.to >= b.ch : h.to > b.ch))) {
                    if (e) {
                        ar(i, "beforeCursorEnter");
                        if (i.explicitlyCleared) {
                            if (!f.markedSpans) {
                                break;
                            } else {
                                --g;
                                continue;
                            }
                        }
                    }
                    if (!i.atomic) {
                        continue;
                    }
                    if (c) {
                        var l = i.find(d < 0 ? 1 : -1), m = void 0;
                        if (d < 0 ? k : j) {
                            l = e7(a, l, -d, l && l.line == b.line ? f : null);
                        }
                        if (l && l.line == b.line && (m = a5(l, c)) && (d < 0 ? m < 0 : m > 0)) {
                            return e5(a, l, b, d, e);
                        }
                    }
                    var n = i.find(d < 0 ? -1 : 1);
                    if (d < 0 ? j : k) {
                        n = e7(a, n, d, n.line == b.line ? f : null);
                    }
                    return n ? e5(a, n, b, d, e) : null;
                }
            }
        }
        return b;
    }
    function e6(a, b, c, d, e) {
        var f = d || 1;
        var g = e5(a, b, c, f, e) || (!e && e5(a, b, c, f, true)) || e5(a, b, c, -f, e) || (!e && e5(a, b, c, -f, true));
        if (!g) {
            a.cantEdit = true;
            return a4(a.first, 0);
        }
        return g;
    }
    function e7(a, b, c, d) {
        if (c < 0 && b.ch == 0) {
            if (b.line > a.first) {
                return bb(a, a4(b.line - 1));
            } else {
                return null;
            }
        } else if (c > 0 && b.ch == (d || aY(a, b.line)).text.length) {
            if (b.line < a.first + a.size - 1) {
                return a4(b.line + 1, 0);
            } else {
                return null;
            }
        } else {
            return new a4(b.line, b.ch + c);
        }
    }
    function e8(a) {
        a.setSelection(a4(a.firstLine(), 0), a4(a.lastLine()), R);
    }
    function e9(a, b, c) {
        var d = {
            canceled: false,
            from: b.from,
            to: b.to,
            text: b.text,
            origin: b.origin,
            cancel: function() {
                return (d.canceled = true);
            }
        };
        if (c) {
            d.update = function(b, c, e, f) {
                if (b) {
                    d.from = bb(a, b);
                }
                if (c) {
                    d.to = bb(a, c);
                }
                if (e) {
                    d.text = e;
                }
                if (f !== undefined) {
                    d.origin = f;
                }
            };
        }
        ar(a, "beforeChange", a, d);
        if (a.cm) {
            ar(a.cm, "beforeChange", a.cm, d);
        }
        if (d.canceled) {
            if (a.cm) {
                a.cm.curOp.updateInput = 2;
            }
            return null;
        }
        return {
            from: d.from,
            to: d.to,
            text: d.text,
            origin: d.origin
        };
    }
    function fa(a, b, c) {
        if (a.cm) {
            if (!a.cm.curOp) {
                return d1(a.cm, fa)(a, b, c);
            }
            if (a.cm.state.suppressEdits) {
                return;
            }
        }
        if (au(a, "beforeChange") || (a.cm && au(a.cm, "beforeChange"))) {
            b = e9(a, b, true);
            if (!b) {
                return;
            }
        }
        var d = bs && !c && bE(a, b.from, b.to);
        if (d) {
            for(var e = d.length - 1; e >= 0; --e){
                fb(a, {
                    from: d[e].from,
                    to: d[e].to,
                    text: e ? [
                        ""
                    ] : b.text,
                    origin: b.origin
                });
            }
        } else {
            fb(a, b);
        }
    }
    function fb(a, b) {
        if (b.text.length == 1 && b.text[0] == "" && a5(b.from, b.to) == 0) {
            return;
        }
        var c = ex(a, b);
        eM(a, b, c, a.cm ? a.cm.curOp.id : NaN);
        fe(a, b, c, bC(a, b));
        var d = [];
        eE(a, function(a, c) {
            if (!c && O(d, a.history) == -1) {
                fj(a.history, b);
                d.push(a.history);
            }
            fe(a, b, null, bC(a, b));
        });
    }
    function fc(a, b, c) {
        var d = a.cm && a.cm.state.suppressEdits;
        if (d && !c) {
            return;
        }
        var e = a.history, f, g = a.sel;
        var h = b == "undo" ? e.done : e.undone, i = b == "undo" ? e.undone : e.done;
        var j = 0;
        for(; j < h.length; j++){
            f = h[j];
            if (c ? f.ranges && !f.equals(a.sel) : !f.ranges) {
                break;
            }
        }
        if (j == h.length) {
            return;
        }
        e.lastOrigin = e.lastSelOrigin = null;
        for(;;){
            f = h.pop();
            if (f.ranges) {
                eP(f, i);
                if (c && !f.equals(a.sel)) {
                    e0(a, f, {
                        clearRedo: false
                    });
                    return;
                }
                g = f;
            } else if (d) {
                h.push(f);
                return;
            } else {
                break;
            }
        }
        var k = [];
        eP(g, i);
        i.push({
            changes: k,
            generation: e.generation
        });
        e.generation = f.generation || ++e.maxGeneration;
        var l = au(a, "beforeChange") || (a.cm && au(a.cm, "beforeChange"));
        var m = function(c) {
            var d = f.changes[c];
            d.origin = b;
            if (l && !e9(a, d, false)) {
                h.length = 0;
                return {};
            }
            k.push(eJ(a, d));
            var e = c ? ex(a, d) : X(h);
            fe(a, d, e, eT(a, d));
            if (!c && a.cm) {
                a.cm.scrollIntoView({
                    from: d.from,
                    to: ev(d)
                });
            }
            var g = [];
            eE(a, function(a, b) {
                if (!b && O(g, a.history) == -1) {
                    fj(a.history, d);
                    g.push(a.history);
                }
                fe(a, d, null, eT(a, d));
            });
        };
        for(var n = f.changes.length - 1; n >= 0; --n){
            var o = m(n);
            if (o) return o.v;
        }
    }
    function fd(a, b) {
        if (b == 0) {
            return;
        }
        a.first += b;
        a.sel = new er(Y(a.sel.ranges, function(a) {
            return new es(a4(a.anchor.line + b, a.anchor.ch), a4(a.head.line + b, a.head.ch));
        }), a.sel.primIndex);
        if (a.cm) {
            df(a.cm, a.first, a.first - b, b);
            for(var c = a.cm.display, d = c.viewFrom; d < c.viewTo; d++){
                dg(a.cm, d, "gutter");
            }
        }
    }
    function fe(a, b, c, d) {
        if (a.cm && !a.cm.curOp) {
            return d1(a.cm, fe)(a, b, c, d);
        }
        if (b.to.line < a.first) {
            fd(a, b.text.length - 1 - (b.to.line - b.from.line));
            return;
        }
        if (b.from.line > a.lastLine()) {
            return;
        }
        if (b.from.line < a.first) {
            var e = b.text.length - 1 - (a.first - b.from.line);
            fd(a, e);
            b = {
                from: a4(a.first, 0),
                to: a4(b.to.line + e, b.to.ch),
                text: [
                    X(b.text)
                ],
                origin: b.origin
            };
        }
        var f = a.lastLine();
        if (b.to.line > f) {
            b = {
                from: b.from,
                to: a4(f, aY(a, f).text.length),
                text: [
                    b.text[0]
                ],
                origin: b.origin
            };
        }
        b.removed = aZ(a, b.from, b.to);
        if (!c) {
            c = ex(a, b);
        }
        if (a.cm) {
            ff(a.cm, b, d);
        } else {
            eD(a, b, d);
        }
        e1(a, c, R);
        if (a.cantEdit && e6(a, a4(a.firstLine(), 0))) {
            a.cantEdit = false;
        }
    }
    function ff(a, b, c) {
        var d = a.doc, e = a.display, f = b.from, g = b.to;
        var h = false, i = f.line;
        if (!a.options.lineWrapping) {
            i = a0(bP(aY(d, f.line)));
            d.iter(i, g.line + 1, function(a) {
                if (a == e.maxLine) {
                    h = true;
                    return true;
                }
            });
        }
        if (d.sel.contains(b.from, b.to) > -1) {
            at(a);
        }
        eD(d, b, c, db(a));
        if (!a.options.lineWrapping) {
            d.iter(i, f.line + b.text.length, function(a) {
                var b = bX(a);
                if (b > e.maxLineLength) {
                    e.maxLine = a;
                    e.maxLineLength = b;
                    e.maxLineChanged = true;
                    h = false;
                }
            });
            if (h) {
                a.curOp.updateMaxLine = true;
            }
        }
        br(d, f.line);
        d4(a, 400);
        var j = b.text.length - (g.line - f.line) - 1;
        if (b.full) {
            df(a);
        } else if (f.line == g.line && b.text.length == 1 && !eC(a.doc, b)) {
            dg(a, f.line, "text");
        } else {
            df(a, f.line, g.line + 1, j);
        }
        var k = au(a, "changes"), l = au(a, "change");
        if (l || k) {
            var m = {
                from: f,
                to: g,
                text: b.text,
                removed: b.removed,
                origin: b.origin
            };
            if (l) {
                ch(a, "change", a, m);
            }
            if (k) {
                (a.curOp.changeObjs || (a.curOp.changeObjs = [])).push(m);
            }
        }
        a.display.selForContextMenu = null;
    }
    function fg(a, b, c, d, e) {
        var f;
        if (!d) {
            d = c;
        }
        if (a5(d, c) < 0) {
            (f = [
                d,
                c
            ]), (c = f[0]), (d = f[1]);
        }
        if (typeof b == "string") {
            b = a.splitLines(b);
        }
        fa(a, {
            from: c,
            to: d,
            text: b,
            origin: e
        });
    }
    function fh(a, b, c, d) {
        if (c < a.line) {
            a.line += d;
        } else if (b < a.line) {
            a.line = b;
            a.ch = 0;
        }
    }
    function fi(a, b, c, d) {
        for(var e = 0; e < a.length; ++e){
            var f = a[e], g = true;
            if (f.ranges) {
                if (!f.copied) {
                    f = a[e] = f.deepCopy();
                    f.copied = true;
                }
                for(var h = 0; h < f.ranges.length; h++){
                    fh(f.ranges[h].anchor, b, c, d);
                    fh(f.ranges[h].head, b, c, d);
                }
                continue;
            }
            for(var i = 0; i < f.changes.length; ++i){
                var j = f.changes[i];
                if (c < j.from.line) {
                    j.from = a4(j.from.line + d, j.from.ch);
                    j.to = a4(j.to.line + d, j.to.ch);
                } else if (b <= j.to.line) {
                    g = false;
                    break;
                }
            }
            if (!g) {
                a.splice(0, e + 1);
                e = 0;
            }
        }
    }
    function fj(a, b) {
        var c = b.from.line, d = b.to.line, e = b.text.length - (d - c) - 1;
        fi(a.done, c, d, e);
        fi(a.undone, c, d, e);
    }
    function fk(a, b, c, d) {
        var e = b, f = b;
        if (typeof b == "number") {
            f = aY(a, ba(a, b));
        } else {
            e = a0(b);
        }
        if (e == null) {
            return null;
        }
        if (d(f, e) && a.cm) {
            dg(a.cm, e, c);
        }
        return f;
    }
    function fl(a) {
        this.lines = a;
        this.parent = null;
        var b = 0;
        for(var c = 0; c < a.length; ++c){
            a[c].parent = this;
            b += a[c].height;
        }
        this.height = b;
    }
    fl.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        removeInner: function(a, b) {
            for(var c = a, d = a + b; c < d; ++c){
                var e = this.lines[c];
                this.height -= e.height;
                b_(e);
                ch(e, "delete");
            }
            this.lines.splice(a, b);
        },
        collapse: function(a) {
            a.push.apply(a, this.lines);
        },
        insertInner: function(a, b, c) {
            this.height += c;
            this.lines = this.lines.slice(0, a).concat(b).concat(this.lines.slice(a));
            for(var d = 0; d < b.length; ++d){
                b[d].parent = this;
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
    function fm(a) {
        this.children = a;
        var b = 0, c = 0;
        for(var d = 0; d < a.length; ++d){
            var e = a[d];
            b += e.chunkSize();
            c += e.height;
            e.parent = this;
        }
        this.size = b;
        this.height = c;
        this.parent = null;
    }
    fm.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(a, b) {
            this.size -= b;
            for(var c = 0; c < this.children.length; ++c){
                var d = this.children[c], e = d.chunkSize();
                if (a < e) {
                    var f = Math.min(b, e - a), g = d.height;
                    d.removeInner(a, f);
                    this.height -= g - d.height;
                    if (e == f) {
                        this.children.splice(c--, 1);
                        d.parent = null;
                    }
                    if ((b -= f) == 0) {
                        break;
                    }
                    a = 0;
                } else {
                    a -= e;
                }
            }
            if (this.size - b < 25 && (this.children.length > 1 || !(this.children[0] instanceof fl))) {
                var h = [];
                this.collapse(h);
                this.children = [
                    new fl(h)
                ];
                this.children[0].parent = this;
            }
        },
        collapse: function(a) {
            for(var b = 0; b < this.children.length; ++b){
                this.children[b].collapse(a);
            }
        },
        insertInner: function(a, b, c) {
            this.size += b.length;
            this.height += c;
            for(var d = 0; d < this.children.length; ++d){
                var e = this.children[d], f = e.chunkSize();
                if (a <= f) {
                    e.insertInner(a, b, c);
                    if (e.lines && e.lines.length > 50) {
                        var g = (e.lines.length % 25) + 25;
                        for(var h = g; h < e.lines.length;){
                            var i = new fl(e.lines.slice(h, (h += 25)));
                            e.height -= i.height;
                            this.children.splice(++d, 0, i);
                            i.parent = this;
                        }
                        e.lines = e.lines.slice(0, g);
                        this.maybeSpill();
                    }
                    break;
                }
                a -= f;
            }
        },
        maybeSpill: function() {
            if (this.children.length <= 10) {
                return;
            }
            var a = this;
            do {
                var b = a.children.splice(a.children.length - 5, 5);
                var c = new fm(b);
                if (!a.parent) {
                    var d = new fm(a.children);
                    d.parent = a;
                    a.children = [
                        d,
                        c
                    ];
                    a = d;
                } else {
                    a.size -= c.size;
                    a.height -= c.height;
                    var e = O(a.parent.children, a);
                    a.parent.children.splice(e + 1, 0, c);
                }
                c.parent = a.parent;
            }while (a.children.length > 10)
            a.parent.maybeSpill();
        },
        iterN: function(a, b, c) {
            for(var d = 0; d < this.children.length; ++d){
                var e = this.children[d], f = e.chunkSize();
                if (a < f) {
                    var g = Math.min(b, f - a);
                    if (e.iterN(a, g, c)) {
                        return true;
                    }
                    if ((b -= g) == 0) {
                        break;
                    }
                    a = 0;
                } else {
                    a -= f;
                }
            }
        }
    };
    var fn = function(a, b, c) {
        if (c) {
            for(var d in c){
                if (c.hasOwnProperty(d)) {
                    this[d] = c[d];
                }
            }
        }
        this.doc = a;
        this.node = b;
    };
    fn.prototype.clear = function() {
        var a = this.doc.cm, b = this.line.widgets, c = this.line, d = a0(c);
        if (d == null || !b) {
            return;
        }
        for(var e = 0; e < b.length; ++e){
            if (b[e] == this) {
                b.splice(e--, 1);
            }
        }
        if (!b.length) {
            c.widgets = null;
        }
        var f = cv(this);
        a_(c, Math.max(0, c.height - f));
        if (a) {
            d0(a, function() {
                fo(a, c, -f);
                dg(a, d, "widget");
            });
            ch(a, "lineWidgetCleared", a, this, d);
        }
    };
    fn.prototype.changed = function() {
        var a = this;
        var b = this.height, c = this.doc.cm, d = this.line;
        this.height = null;
        var e = cv(this) - b;
        if (!e) {
            return;
        }
        if (!bU(this.doc, d)) {
            a_(d, d.height + e);
        }
        if (c) {
            d0(c, function() {
                c.curOp.forceUpdate = true;
                fo(c, d, e);
                ch(c, "lineWidgetChanged", c, a, a0(d));
            });
        }
    };
    av(fn);
    function fo(a, b, c) {
        if (bW(b) < ((a.curOp && a.curOp.scrollTop) || a.doc.scrollTop)) {
            dD(a, c);
        }
    }
    function fp(a, b, c, d) {
        var e = new fn(a, c, d);
        var f = a.cm;
        if (f && e.noHScroll) {
            f.display.alignWidgets = true;
        }
        fk(a, b, "widget", function(b) {
            var c = b.widgets || (b.widgets = []);
            if (e.insertAt == null) {
                c.push(e);
            } else {
                c.splice(Math.min(c.length, Math.max(0, e.insertAt)), 0, e);
            }
            e.line = b;
            if (f && !bU(a, b)) {
                var d = bW(b) < a.scrollTop;
                a_(b, b.height + cv(e));
                if (d) {
                    dD(f, e.height);
                }
                f.curOp.forceUpdate = true;
            }
            return true;
        });
        if (f) {
            ch(f, "lineWidgetAdded", f, e, typeof b == "number" ? b : a0(b));
        }
        return e;
    }
    var fq = 0;
    var fr = function(a, b) {
        this.lines = [];
        this.type = b;
        this.doc = a;
        this.id = ++fq;
    };
    fr.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        var a = this.doc.cm, b = a && !a.curOp;
        if (b) {
            dU(a);
        }
        if (au(this, "clear")) {
            var c = this.find();
            if (c) {
                ch(this, "clear", c.from, c.to);
            }
        }
        var d = null, e = null;
        for(var f = 0; f < this.lines.length; ++f){
            var g = this.lines[f];
            var h = bx(g.markedSpans, this);
            if (a && !this.collapsed) {
                dg(a, a0(g), "text");
            } else if (a) {
                if (h.to != null) {
                    e = a0(g);
                }
                if (h.from != null) {
                    d = a0(g);
                }
            }
            g.markedSpans = by(g.markedSpans, h);
            if (h.from == null && this.collapsed && !bU(this.doc, g) && a) {
                a_(g, c7(a.display));
            }
        }
        if (a && this.collapsed && !a.options.lineWrapping) {
            for(var i = 0; i < this.lines.length; ++i){
                var j = bP(this.lines[i]), k = bX(j);
                if (k > a.display.maxLineLength) {
                    a.display.maxLine = j;
                    a.display.maxLineLength = k;
                    a.display.maxLineChanged = true;
                }
            }
        }
        if (d != null && a && this.collapsed) {
            df(a, d, e + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (a) {
                e3(a.doc);
            }
        }
        if (a) {
            ch(a, "markerCleared", a, this, d, e);
        }
        if (b) {
            dV(a);
        }
        if (this.parent) {
            this.parent.clear();
        }
    };
    fr.prototype.find = function(a, b) {
        if (a == null && this.type == "bookmark") {
            a = 1;
        }
        var c, d;
        for(var e = 0; e < this.lines.length; ++e){
            var f = this.lines[e];
            var g = bx(f.markedSpans, this);
            if (g.from != null) {
                c = a4(b ? f : a0(f), g.from);
                if (a == -1) {
                    return c;
                }
            }
            if (g.to != null) {
                d = a4(b ? f : a0(f), g.to);
                if (a == 1) {
                    return d;
                }
            }
        }
        return c && {
            from: c,
            to: d
        };
    };
    fr.prototype.changed = function() {
        var a = this;
        var b = this.find(-1, true), c = this, d = this.doc.cm;
        if (!b || !d) {
            return;
        }
        d0(d, function() {
            var e = b.line, f = a0(b.line);
            var g = cH(d, f);
            if (g) {
                cP(g);
                d.curOp.selectionChanged = d.curOp.forceUpdate = true;
            }
            d.curOp.updateMaxLine = true;
            if (!bU(c.doc, e) && c.height != null) {
                var h = c.height;
                c.height = null;
                var i = cv(c) - h;
                if (i) {
                    a_(e, e.height + i);
                }
            }
            ch(d, "markerChanged", d, a);
        });
    };
    fr.prototype.attachLine = function(a) {
        if (!this.lines.length && this.doc.cm) {
            var b = this.doc.cm.curOp;
            if (!b.maybeHiddenMarkers || O(b.maybeHiddenMarkers, this) == -1) {
                (b.maybeUnhiddenMarkers || (b.maybeUnhiddenMarkers = [])).push(this);
            }
        }
        this.lines.push(a);
    };
    fr.prototype.detachLine = function(a) {
        this.lines.splice(O(this.lines, a), 1);
        if (!this.lines.length && this.doc.cm) {
            var b = this.doc.cm.curOp;
            (b.maybeHiddenMarkers || (b.maybeHiddenMarkers = [])).push(this);
        }
    };
    av(fr);
    function fs(a, b, c, d, e) {
        if (d && d.shared) {
            return fu(a, b, c, d, e);
        }
        if (a.cm && !a.cm.curOp) {
            return d1(a.cm, fs)(a, b, c, d, e);
        }
        var f = new fr(a, e), g = a5(b, c);
        if (d) {
            L(d, f, false);
        }
        if (g > 0 || (g == 0 && f.clearWhenEmpty !== false)) {
            return f;
        }
        if (f.replacedWith) {
            f.collapsed = true;
            f.widgetNode = D("span", [
                f.replacedWith
            ], "CodeMirror-widget");
            if (!d.handleMouseEvents) {
                f.widgetNode.setAttribute("cm-ignore-events", "true");
            }
            if (d.insertLeft) {
                f.widgetNode.insertLeft = true;
            }
        }
        if (f.collapsed) {
            if (bO(a, b.line, b, c, f) || (b.line != c.line && bO(a, c.line, b, c, f))) {
                throw new Error("Inserting collapsed marker partially overlapping an existing one");
            }
            bv();
        }
        if (f.addToHistory) {
            eM(a, {
                from: b,
                to: c,
                origin: "markText"
            }, a.sel, NaN);
        }
        var h = b.line, i = a.cm, j;
        a.iter(h, c.line + 1, function(d) {
            if (i && f.collapsed && !i.options.lineWrapping && bP(d) == i.display.maxLine) {
                j = true;
            }
            if (f.collapsed && h != b.line) {
                a_(d, 0);
            }
            bz(d, new bw(f, h == b.line ? b.ch : null, h == c.line ? c.ch : null), a.cm && a.cm.curOp);
            ++h;
        });
        if (f.collapsed) {
            a.iter(b.line, c.line + 1, function(b) {
                if (bU(a, b)) {
                    a_(b, 0);
                }
            });
        }
        if (f.clearOnEnter) {
            ao(f, "beforeCursorEnter", function() {
                return f.clear();
            });
        }
        if (f.readOnly) {
            bu();
            if (a.history.done.length || a.history.undone.length) {
                a.clearHistory();
            }
        }
        if (f.collapsed) {
            f.id = ++fq;
            f.atomic = true;
        }
        if (i) {
            if (j) {
                i.curOp.updateMaxLine = true;
            }
            if (f.collapsed) {
                df(i, b.line, c.line + 1);
            } else if (f.className || f.startStyle || f.endStyle || f.css || f.attributes || f.title) {
                for(var k = b.line; k <= c.line; k++){
                    dg(i, k, "text");
                }
            }
            if (f.atomic) {
                e3(i.doc);
            }
            ch(i, "markerAdded", i, f);
        }
        return f;
    }
    var ft = function(a, b) {
        this.markers = a;
        this.primary = b;
        for(var c = 0; c < a.length; ++c){
            a[c].parent = this;
        }
    };
    ft.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        this.explicitlyCleared = true;
        for(var a = 0; a < this.markers.length; ++a){
            this.markers[a].clear();
        }
        ch(this, "clear");
    };
    ft.prototype.find = function(a, b) {
        return this.primary.find(a, b);
    };
    av(ft);
    function fu(a, b, c, d, e) {
        d = L(d);
        d.shared = false;
        var f = [
            fs(a, b, c, d, e)
        ], g = f[0];
        var h = d.widgetNode;
        eE(a, function(a) {
            if (h) {
                d.widgetNode = h.cloneNode(true);
            }
            f.push(fs(a, bb(a, b), bb(a, c), d, e));
            for(var i = 0; i < a.linked.length; ++i){
                if (a.linked[i].isParent) {
                    return;
                }
            }
            g = X(f);
        });
        return new ft(f, g);
    }
    function fv(a) {
        return a.findMarks(a4(a.first, 0), a.clipPos(a4(a.lastLine())), function(a) {
            return a.parent;
        });
    }
    function fw(a, b) {
        for(var c = 0; c < b.length; c++){
            var d = b[c], e = d.find();
            var f = a.clipPos(e.from), g = a.clipPos(e.to);
            if (a5(f, g)) {
                var h = fs(a, f, g, d.primary, d.primary.type);
                d.markers.push(h);
                h.parent = d;
            }
        }
    }
    function fx(a) {
        var b = function(b) {
            var c = a[b], d = [
                c.primary.doc
            ];
            eE(c.primary.doc, function(a) {
                return d.push(a);
            });
            for(var e = 0; e < c.markers.length; e++){
                var f = c.markers[e];
                if (O(d, f.doc) == -1) {
                    f.parent = null;
                    c.markers.splice(e--, 1);
                }
            }
        };
        for(var c = 0; c < a.length; c++)b(c);
    }
    var fy = 0;
    var fz = function(a, b, c, d, e) {
        if (!(this instanceof fz)) {
            return new fz(a, b, c, d, e);
        }
        if (c == null) {
            c = 0;
        }
        fm.call(this, [
            new fl([
                new bZ("", null)
            ])
        ]);
        this.first = c;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = c;
        var f = a4(c, 0);
        this.sel = eu(f);
        this.history = new eI(null);
        this.id = ++fy;
        this.modeOption = b;
        this.lineSep = d;
        this.direction = e == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof a == "string") {
            a = this.splitLines(a);
        }
        eD(this, {
            from: f,
            to: f,
            text: a
        });
        e0(this, eu(f), R);
    };
    fz.prototype = _(fm.prototype, {
        constructor: fz,
        iter: function(a, b, c) {
            if (c) {
                this.iterN(a - this.first, b - a, c);
            } else {
                this.iterN(this.first, this.first + this.size, a);
            }
        },
        insert: function(a, b) {
            var c = 0;
            for(var d = 0; d < b.length; ++d){
                c += b[d].height;
            }
            this.insertInner(a - this.first, b, c);
        },
        remove: function(a, b) {
            this.removeInner(a - this.first, b);
        },
        getValue: function(a) {
            var b = a$(this, this.first, this.first + this.size);
            if (a === false) {
                return b;
            }
            return b.join(a || this.lineSeparator());
        },
        setValue: d3(function(a) {
            var b = a4(this.first, 0), c = this.first + this.size - 1;
            fa(this, {
                from: b,
                to: a4(c, aY(this, c).text.length),
                text: this.splitLines(a),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) {
                dF(this.cm, 0, 0);
            }
            e0(this, eu(b), R);
        }),
        replaceRange: function(a, b, c, d) {
            b = bb(this, b);
            c = c ? bb(this, c) : b;
            fg(this, a, b, c, d);
        },
        getRange: function(a, b, c) {
            var d = aZ(this, bb(this, a), bb(this, b));
            if (c === false) {
                return d;
            }
            if (c === "") {
                return d.join("");
            }
            return d.join(c || this.lineSeparator());
        },
        getLine: function(a) {
            var b = this.getLineHandle(a);
            return b && b.text;
        },
        getLineHandle: function(a) {
            if (a2(this, a)) {
                return aY(this, a);
            }
        },
        getLineNumber: function(a) {
            return a0(a);
        },
        getLineHandleVisualStart: function(a) {
            if (typeof a == "number") {
                a = aY(this, a);
            }
            return bP(a);
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
            return bb(this, a);
        },
        getCursor: function(a) {
            var b = this.sel.primary(), c;
            if (a == null || a == "head") {
                c = b.head;
            } else if (a == "anchor") {
                c = b.anchor;
            } else if (a == "end" || a == "to" || a === false) {
                c = b.to();
            } else {
                c = b.from();
            }
            return c;
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: d3(function(a, b, c) {
            eZ(this, bb(this, typeof a == "number" ? a4(a, b || 0) : a), null, c);
        }),
        setSelection: d3(function(a, b, c) {
            eZ(this, bb(this, a), bb(this, b || a), c);
        }),
        extendSelection: d3(function(a, b, c) {
            eW(this, bb(this, a), b && bb(this, b), c);
        }),
        extendSelections: d3(function(a, b) {
            eX(this, bd(this, a), b);
        }),
        extendSelectionsBy: d3(function(a, b) {
            var c = Y(this.sel.ranges, a);
            eX(this, bd(this, c), b);
        }),
        setSelections: d3(function(a, b, c) {
            if (!a.length) {
                return;
            }
            var d = [];
            for(var e = 0; e < a.length; e++){
                d[e] = new es(bb(this, a[e].anchor), bb(this, a[e].head || a[e].anchor));
            }
            if (b == null) {
                b = Math.min(a.length - 1, this.sel.primIndex);
            }
            e0(this, et(this.cm, d, b), c);
        }),
        addSelection: d3(function(a, b, c) {
            var d = this.sel.ranges.slice(0);
            d.push(new es(bb(this, a), bb(this, b || a)));
            e0(this, et(this.cm, d, d.length - 1), c);
        }),
        getSelection: function(a) {
            var b = this.sel.ranges, c;
            for(var d = 0; d < b.length; d++){
                var e = aZ(this, b[d].from(), b[d].to());
                c = c ? c.concat(e) : e;
            }
            if (a === false) {
                return c;
            } else {
                return c.join(a || this.lineSeparator());
            }
        },
        getSelections: function(a) {
            var b = [], c = this.sel.ranges;
            for(var d = 0; d < c.length; d++){
                var e = aZ(this, c[d].from(), c[d].to());
                if (a !== false) {
                    e = e.join(a || this.lineSeparator());
                }
                b[d] = e;
            }
            return b;
        },
        replaceSelection: function(a, b, c) {
            var d = [];
            for(var e = 0; e < this.sel.ranges.length; e++){
                d[e] = a;
            }
            this.replaceSelections(d, b, c || "+input");
        },
        replaceSelections: d3(function(a, b, c) {
            var d = [], e = this.sel;
            for(var f = 0; f < e.ranges.length; f++){
                var g = e.ranges[f];
                d[f] = {
                    from: g.from(),
                    to: g.to(),
                    text: this.splitLines(a[f]),
                    origin: c
                };
            }
            var h = b && b != "end" && ez(this, d, b);
            for(var i = d.length - 1; i >= 0; i--){
                fa(this, d[i]);
            }
            if (h) {
                e_(this, h);
            } else if (this.cm) {
                dE(this.cm);
            }
        }),
        undo: d3(function() {
            fc(this, "undo");
        }),
        redo: d3(function() {
            fc(this, "redo");
        }),
        undoSelection: d3(function() {
            fc(this, "undo", true);
        }),
        redoSelection: d3(function() {
            fc(this, "redo", true);
        }),
        setExtending: function(a) {
            this.extend = a;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            var a = this.history, b = 0, c = 0;
            for(var d = 0; d < a.done.length; d++){
                if (!a.done[d].ranges) {
                    ++b;
                }
            }
            for(var e = 0; e < a.undone.length; e++){
                if (!a.undone[e].ranges) {
                    ++c;
                }
            }
            return {
                undo: b,
                redo: c
            };
        },
        clearHistory: function() {
            var a = this;
            this.history = new eI(this.history);
            eE(this, function(b) {
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
                done: eU(this.history.done),
                undone: eU(this.history.undone)
            };
        },
        setHistory: function(a) {
            var b = (this.history = new eI(this.history));
            b.done = eU(a.done.slice(0), null, true);
            b.undone = eU(a.undone.slice(0), null, true);
        },
        setGutterMarker: d3(function(a, b, c) {
            return fk(this, a, "gutter", function(a) {
                var d = a.gutterMarkers || (a.gutterMarkers = {});
                d[b] = c;
                if (!c && ad(d)) {
                    a.gutterMarkers = null;
                }
                return true;
            });
        }),
        clearGutter: d3(function(a) {
            var b = this;
            this.iter(function(c) {
                if (c.gutterMarkers && c.gutterMarkers[a]) {
                    fk(b, c, "gutter", function() {
                        c.gutterMarkers[a] = null;
                        if (ad(c.gutterMarkers)) {
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
                if (!a2(this, a)) {
                    return null;
                }
                b = a;
                a = aY(this, a);
                if (!a) {
                    return null;
                }
            } else {
                b = a0(a);
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
        addLineClass: d3(function(a, b, c) {
            return fk(this, a, b == "gutter" ? "gutter" : "class", function(a) {
                var d = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass";
                if (!a[d]) {
                    a[d] = c;
                } else if (y(c).test(a[d])) {
                    return false;
                } else {
                    a[d] += " " + c;
                }
                return true;
            });
        }),
        removeLineClass: d3(function(a, b, c) {
            return fk(this, a, b == "gutter" ? "gutter" : "class", function(a) {
                var d = b == "text" ? "textClass" : b == "background" ? "bgClass" : b == "gutter" ? "gutterClass" : "wrapClass";
                var e = a[d];
                if (!e) {
                    return false;
                } else if (c == null) {
                    a[d] = null;
                } else {
                    var f = e.match(y(c));
                    if (!f) {
                        return false;
                    }
                    var g = f.index + f[0].length;
                    a[d] = e.slice(0, f.index) + (!f.index || g == e.length ? "" : " ") + e.slice(g) || null;
                }
                return true;
            });
        }),
        addLineWidget: d3(function(a, b, c) {
            return fp(this, a, b, c);
        }),
        removeLineWidget: function(a) {
            a.clear();
        },
        markText: function(a, b, c) {
            return fs(this, bb(this, a), bb(this, b), c, (c && c.type) || "range");
        },
        setBookmark: function(a, b) {
            var c = {
                replacedWith: b && (b.nodeType == null ? b.widget : b),
                insertLeft: b && b.insertLeft,
                clearWhenEmpty: false,
                shared: b && b.shared,
                handleMouseEvents: b && b.handleMouseEvents
            };
            a = bb(this, a);
            return fs(this, a, a, c, "bookmark");
        },
        findMarksAt: function(a) {
            a = bb(this, a);
            var b = [], c = aY(this, a.line).markedSpans;
            if (c) {
                for(var d = 0; d < c.length; ++d){
                    var e = c[d];
                    if ((e.from == null || e.from <= a.ch) && (e.to == null || e.to >= a.ch)) {
                        b.push(e.marker.parent || e.marker);
                    }
                }
            }
            return b;
        },
        findMarks: function(a, b, c) {
            a = bb(this, a);
            b = bb(this, b);
            var d = [], e = a.line;
            this.iter(a.line, b.line + 1, function(f) {
                var g = f.markedSpans;
                if (g) {
                    for(var h = 0; h < g.length; h++){
                        var i = g[h];
                        if (!((i.to != null && e == a.line && a.ch >= i.to) || (i.from == null && e != a.line) || (i.from != null && e == b.line && i.from >= b.ch)) && (!c || c(i.marker))) {
                            d.push(i.marker.parent || i.marker);
                        }
                    }
                }
                ++e;
            });
            return d;
        },
        getAllMarks: function() {
            var a = [];
            this.iter(function(b) {
                var c = b.markedSpans;
                if (c) {
                    for(var d = 0; d < c.length; ++d){
                        if (c[d].from != null) {
                            a.push(c[d].marker);
                        }
                    }
                }
            });
            return a;
        },
        posFromIndex: function(a) {
            var b, c = this.first, d = this.lineSeparator().length;
            this.iter(function(e) {
                var f = e.text.length + d;
                if (f > a) {
                    b = a;
                    return true;
                }
                a -= f;
                ++c;
            });
            return bb(this, a4(c, b));
        },
        indexFromPos: function(a) {
            a = bb(this, a);
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
        copy: function(a) {
            var b = new fz(a$(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            b.scrollTop = this.scrollTop;
            b.scrollLeft = this.scrollLeft;
            b.sel = this.sel;
            b.extend = false;
            if (a) {
                b.history.undoDepth = this.history.undoDepth;
                b.setHistory(this.getHistory());
            }
            return b;
        },
        linkedDoc: function(a) {
            if (!a) {
                a = {};
            }
            var b = this.first, c = this.first + this.size;
            if (a.from != null && a.from > b) {
                b = a.from;
            }
            if (a.to != null && a.to < c) {
                c = a.to;
            }
            var d = new fz(a$(this, b, c), a.mode || this.modeOption, b, this.lineSep, this.direction);
            if (a.sharedHist) {
                d.history = this.history;
            }
            (this.linked || (this.linked = [])).push({
                doc: d,
                sharedHist: a.sharedHist
            });
            d.linked = [
                {
                    doc: this,
                    isParent: true,
                    sharedHist: a.sharedHist
                }, 
            ];
            fw(d, fv(this));
            return d;
        },
        unlinkDoc: function(a) {
            if (a instanceof gD) {
                a = a.doc;
            }
            if (this.linked) {
                for(var b = 0; b < this.linked.length; ++b){
                    var c = this.linked[b];
                    if (c.doc != a) {
                        continue;
                    }
                    this.linked.splice(b, 1);
                    a.unlinkDoc(this);
                    fx(fv(this));
                    break;
                }
            }
            if (a.history == this.history) {
                var d = [
                    a.id
                ];
                eE(a, function(a) {
                    return d.push(a.id);
                }, true);
                a.history = new eI(null);
                a.history.done = eU(this.history.done, d);
                a.history.undone = eU(this.history.undone, d);
            }
        },
        iterLinkedDocs: function(a) {
            eE(this, a);
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
            return aH(a);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: d3(function(a) {
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
                eH(this.cm);
            }
        })
    });
    fz.prototype.eachLine = fz.prototype.iter;
    var fA = 0;
    function fB(a) {
        var b = this;
        fE(b);
        if (as(b, a) || cw(b.display, a)) {
            return;
        }
        aw(a);
        if (g) {
            fA = +new Date();
        }
        var c = dd(b, a, true), d = a.dataTransfer.files;
        if (!c || b.isReadOnly()) {
            return;
        }
        if (d && d.length && window.FileReader && window.File) {
            var e = d.length, f = Array(e), h = 0;
            var i = function() {
                if (++h == e) {
                    d1(b, function() {
                        c = bb(b.doc, c);
                        var a = {
                            from: c,
                            to: c,
                            text: b.doc.splitLines(f.filter(function(a) {
                                return a != null;
                            }).join(b.doc.lineSeparator())),
                            origin: "paste"
                        };
                        fa(b.doc, a);
                        e_(b.doc, eu(bb(b.doc, c), bb(b.doc, ev(a))));
                    })();
                }
            };
            var j = function(a, c) {
                if (b.options.allowDropFileTypes && O(b.options.allowDropFileTypes, a.type) == -1) {
                    i();
                    return;
                }
                var d = new FileReader();
                d.onerror = function() {
                    return i();
                };
                d.onload = function() {
                    var a = d.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(a)) {
                        i();
                        return;
                    }
                    f[c] = a;
                    i();
                };
                d.readAsText(a);
            };
            for(var k = 0; k < d.length; k++){
                j(d[k], k);
            }
        } else {
            if (b.state.draggingText && b.doc.sel.contains(c) > -1) {
                b.state.draggingText(a);
                setTimeout(function() {
                    return b.display.input.focus();
                }, 20);
                return;
            }
            try {
                var l = a.dataTransfer.getData("Text");
                if (l) {
                    var m;
                    if (b.state.draggingText && !b.state.draggingText.copy) {
                        m = b.listSelections();
                    }
                    e1(b.doc, eu(c, c));
                    if (m) {
                        for(var n = 0; n < m.length; ++n){
                            fg(b.doc, "", m[n].anchor, m[n].head, "drag");
                        }
                    }
                    b.replaceSelection(l, "around", "paste");
                    b.display.input.focus();
                }
            } catch (o) {}
        }
    }
    function fC(a, b) {
        if (g && (!a.state.draggingText || +new Date() - fA < 100)) {
            az(b);
            return;
        }
        if (as(a, b) || cw(a.display, b)) {
            return;
        }
        b.dataTransfer.setData("Text", a.getSelection());
        b.dataTransfer.effectAllowed = "copyMove";
        if (b.dataTransfer.setDragImage && !m) {
            var c = C("img", null, null, "position: fixed; left: 0; top: 0;");
            c.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (l) {
                c.width = c.height = 1;
                a.display.wrapper.appendChild(c);
                c._top = c.offsetTop;
            }
            b.dataTransfer.setDragImage(c, 0, 0);
            if (l) {
                c.parentNode.removeChild(c);
            }
        }
    }
    function fD(a, b) {
        var c = dd(a, b);
        if (!c) {
            return;
        }
        var d = document.createDocumentFragment();
        dn(a, c, d);
        if (!a.display.dragCursor) {
            a.display.dragCursor = C("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            a.display.lineSpace.insertBefore(a.display.dragCursor, a.display.cursorDiv);
        }
        B(a.display.dragCursor, d);
    }
    function fE(a) {
        if (a.display.dragCursor) {
            a.display.lineSpace.removeChild(a.display.dragCursor);
            a.display.dragCursor = null;
        }
    }
    function fF(a) {
        if (!document.getElementsByClassName) {
            return;
        }
        var b = document.getElementsByClassName("CodeMirror"), c = [];
        for(var d = 0; d < b.length; d++){
            var e = b[d].CodeMirror;
            if (e) {
                c.push(e);
            }
        }
        if (c.length) {
            c[0].operation(function() {
                for(var b = 0; b < c.length; b++){
                    a(c[b]);
                }
            });
        }
    }
    var fG = false;
    function fH() {
        if (fG) {
            return;
        }
        fI();
        fG = true;
    }
    function fI() {
        var a;
        ao(window, "resize", function() {
            if (a == null) {
                a = setTimeout(function() {
                    a = null;
                    fF(fJ);
                }, 100);
            }
        });
        ao(window, "blur", function() {
            return fF(dv);
        });
    }
    function fJ(a) {
        var b = a.display;
        b.cachedCharWidth = b.cachedTextHeight = b.cachedPaddingH = null;
        b.scrollbarsClipped = false;
        a.setSize();
    }
    var fK = {
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
    for(var fL = 0; fL < 10; fL++){
        fK[fL + 48] = fK[fL + 96] = String(fL);
    }
    for(var fM = 65; fM <= 90; fM++){
        fK[fM] = String.fromCharCode(fM);
    }
    for(var fN = 1; fN <= 12; fN++){
        fK[fN + 111] = fK[fN + 63235] = "F" + fN;
    }
    var fO = {};
    fO.basic = {
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
    fO.pcDefault = {
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
    fO.emacsy = {
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
    fO.macDefault = {
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
    fO["default"] = s ? fO.macDefault : fO.pcDefault;
    function fP(a) {
        var b = a.split(/-(?!$)/);
        a = b[b.length - 1];
        var c, d, e, f;
        for(var g = 0; g < b.length - 1; g++){
            var h = b[g];
            if (/^(cmd|meta|m)$/i.test(h)) {
                f = true;
            } else if (/^a(lt)?$/i.test(h)) {
                c = true;
            } else if (/^(c|ctrl|control)$/i.test(h)) {
                d = true;
            } else if (/^s(hift)?$/i.test(h)) {
                e = true;
            } else {
                throw new Error("Unrecognized modifier name: " + h);
            }
        }
        if (c) {
            a = "Alt-" + a;
        }
        if (d) {
            a = "Ctrl-" + a;
        }
        if (f) {
            a = "Cmd-" + a;
        }
        if (e) {
            a = "Shift-" + a;
        }
        return a;
    }
    function fQ(a) {
        var b = {};
        for(var c in a){
            if (a.hasOwnProperty(c)) {
                var d = a[c];
                if (/^(name|fallthrough|(de|at)tach)$/.test(c)) {
                    continue;
                }
                if (d == "...") {
                    delete a[c];
                    continue;
                }
                var e = Y(c.split(" "), fP);
                for(var f = 0; f < e.length; f++){
                    var g = void 0, h = void 0;
                    if (f == e.length - 1) {
                        h = e.join(" ");
                        g = d;
                    } else {
                        h = e.slice(0, f + 1).join(" ");
                        g = "...";
                    }
                    var i = b[h];
                    if (!i) {
                        b[h] = g;
                    } else if (i != g) {
                        throw new Error("Inconsistent bindings for " + h);
                    }
                }
                delete a[c];
            }
        }
        for(var j in b){
            a[j] = b[j];
        }
        return a;
    }
    function fR(a, b, c, d) {
        b = fV(b);
        var e = b.call ? b.call(a, d) : b[a];
        if (e === false) {
            return "nothing";
        }
        if (e === "...") {
            return "multi";
        }
        if (e != null && c(e)) {
            return "handled";
        }
        if (b.fallthrough) {
            if (Object.prototype.toString.call(b.fallthrough) != "[object Array]") {
                return fR(a, b.fallthrough, c, d);
            }
            for(var f = 0; f < b.fallthrough.length; f++){
                var g = fR(a, b.fallthrough[f], c, d);
                if (g) {
                    return g;
                }
            }
        }
    }
    function fS(a) {
        var b = typeof a == "string" ? a : fK[a.keyCode];
        return (b == "Ctrl" || b == "Alt" || b == "Shift" || b == "Mod");
    }
    function fT(a, b, c) {
        var d = a;
        if (b.altKey && d != "Alt") {
            a = "Alt-" + a;
        }
        if ((w ? b.metaKey : b.ctrlKey) && d != "Ctrl") {
            a = "Ctrl-" + a;
        }
        if ((w ? b.ctrlKey : b.metaKey) && d != "Mod") {
            a = "Cmd-" + a;
        }
        if (!c && b.shiftKey && d != "Shift") {
            a = "Shift-" + a;
        }
        return a;
    }
    function fU(a, b) {
        if (l && a.keyCode == 34 && a["char"]) {
            return false;
        }
        var c = fK[a.keyCode];
        if (c == null || a.altGraphKey) {
            return false;
        }
        if (a.keyCode == 3 && a.code) {
            c = a.code;
        }
        return fT(c, a, b);
    }
    function fV(a) {
        return typeof a == "string" ? fO[a] : a;
    }
    function fW(a, b) {
        var c = a.doc.sel.ranges, d = [];
        for(var e = 0; e < c.length; e++){
            var f = b(c[e]);
            while(d.length && a5(f.from, X(d).to) <= 0){
                var g = d.pop();
                if (a5(g.from, f.from) < 0) {
                    f.from = g.from;
                    break;
                }
            }
            d.push(f);
        }
        d0(a, function() {
            for(var b = d.length - 1; b >= 0; b--){
                fg(a.doc, "", d[b].from, d[b].to, "+delete");
            }
            dE(a);
        });
    }
    function fX(a, b, c) {
        var d = ag(a.text, b + c, c);
        return d < 0 || d > a.text.length ? null : d;
    }
    function fY(a, b, c) {
        var d = fX(a, b.ch, c);
        return d == null ? null : new a4(b.line, d, c < 0 ? "after" : "before");
    }
    function fZ(a, b, c, d, e) {
        if (a) {
            if (b.doc.direction == "rtl") {
                e = -e;
            }
            var f = am(c, b.doc.direction);
            if (f) {
                var g = e < 0 ? X(f) : f[0];
                var h = e < 0 == (g.level == 1);
                var i = h ? "after" : "before";
                var j;
                if (g.level > 0 || b.doc.direction == "rtl") {
                    var k = cI(b, c);
                    j = e < 0 ? c.text.length - 1 : 0;
                    var l = cJ(b, k, j).top;
                    j = ah(function(a) {
                        return (cJ(b, k, a).top == l);
                    }, e < 0 == (g.level == 1) ? g.from : g.to - 1, j);
                    if (i == "before") {
                        j = fX(c, j, 1);
                    }
                } else {
                    j = e < 0 ? g.to : g.from;
                }
                return new a4(d, j, i);
            }
        }
        return new a4(d, e < 0 ? c.text.length : 0, e < 0 ? "before" : "after");
    }
    function f$(a, b, c, d) {
        var e = am(b, a.doc.direction);
        if (!e) {
            return fY(b, c, d);
        }
        if (c.ch >= b.text.length) {
            c.ch = b.text.length;
            c.sticky = "before";
        } else if (c.ch <= 0) {
            c.ch = 0;
            c.sticky = "after";
        }
        var f = ak(e, c.ch, c.sticky), g = e[f];
        if (a.doc.direction == "ltr" && g.level % 2 == 0 && (d > 0 ? g.to > c.ch : g.from < c.ch)) {
            return fY(b, c, d);
        }
        var h = function(a, c) {
            return fX(b, a instanceof a4 ? a.ch : a, c);
        };
        var i;
        var j = function(c) {
            if (!a.options.lineWrapping) {
                return {
                    begin: 0,
                    end: b.text.length
                };
            }
            i = i || cI(a, b);
            return c1(a, b, i, c);
        };
        var k = j(c.sticky == "before" ? h(c, -1) : c.ch);
        if (a.doc.direction == "rtl" || g.level == 1) {
            var l = (g.level == 1) == d < 0;
            var m = h(c, l ? 1 : -1);
            if (m != null && (!l ? m >= g.from && m >= k.begin : m <= g.to && m <= k.end)) {
                var n = l ? "before" : "after";
                return new a4(c.line, m, n);
            }
        }
        var o = function(a, b, d) {
            var f = function(a, b) {
                return b ? new a4(c.line, h(a, 1), "before") : new a4(c.line, a, "after");
            };
            for(; a >= 0 && a < e.length; a += b){
                var g = e[a];
                var i = b > 0 == (g.level != 1);
                var j = i ? d.begin : h(d.end, -1);
                if (g.from <= j && j < g.to) {
                    return f(j, i);
                }
                j = i ? g.from : h(g.to, -1);
                if (d.begin <= j && j < d.end) {
                    return f(j, i);
                }
            }
        };
        var p = o(f + d, d, k);
        if (p) {
            return p;
        }
        var q = d > 0 ? k.end : h(k.begin, -1);
        if (q != null && !(d > 0 && q == b.text.length)) {
            p = o(d > 0 ? 0 : e.length - 1, d, j(q));
            if (p) {
                return p;
            }
        }
        return null;
    }
    var f_ = {
        selectAll: e8,
        singleSelection: function(a) {
            return a.setSelection(a.getCursor("anchor"), a.getCursor("head"), R);
        },
        killLine: function(a) {
            return fW(a, function(b) {
                if (b.empty()) {
                    var c = aY(a.doc, b.head.line).text.length;
                    if (b.head.ch == c && b.head.line < a.lastLine()) {
                        return {
                            from: b.head,
                            to: a4(b.head.line + 1, 0)
                        };
                    } else {
                        return {
                            from: b.head,
                            to: a4(b.head.line, c)
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
            return fW(a, function(b) {
                return {
                    from: a4(b.from().line, 0),
                    to: bb(a.doc, a4(b.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(a) {
            return fW(a, function(a) {
                return {
                    from: a4(a.from().line, 0),
                    to: a.from()
                };
            });
        },
        delWrappedLineLeft: function(a) {
            return fW(a, function(b) {
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
            return fW(a, function(b) {
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
            return a.extendSelection(a4(a.firstLine(), 0));
        },
        goDocEnd: function(a) {
            return a.extendSelection(a4(a.lastLine()));
        },
        goLineStart: function(a) {
            return a.extendSelectionsBy(function(b) {
                return f0(a, b.head.line);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineStartSmart: function(a) {
            return a.extendSelectionsBy(function(b) {
                return f2(a, b.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(a) {
            return a.extendSelectionsBy(function(b) {
                return f1(a, b.head.line);
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
            }, T);
        },
        goLineLeft: function(a) {
            return a.extendSelectionsBy(function(b) {
                var c = a.cursorCoords(b.head, "div").top + 5;
                return a.coordsChar({
                    left: 0,
                    top: c
                }, "div");
            }, T);
        },
        goLineLeftSmart: function(a) {
            return a.extendSelectionsBy(function(b) {
                var c = a.cursorCoords(b.head, "div").top + 5;
                var d = a.coordsChar({
                    left: 0,
                    top: c
                }, "div");
                if (d.ch < a.getLine(d.line).search(/\S/)) {
                    return f2(a, b.head);
                }
                return d;
            }, T);
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
            var b = [], c = a.listSelections(), d = a.options.tabSize;
            for(var e = 0; e < c.length; e++){
                var f = c[e].from();
                var g = M(a.getLine(f.line), f.ch, d);
                b.push(W(d - (g % d)));
            }
            a.replaceSelections(b);
        },
        defaultTab: function(a) {
            if (a.somethingSelected()) {
                a.indentSelection("add");
            } else {
                a.execCommand("insertTab");
            }
        },
        transposeChars: function(a) {
            return d0(a, function() {
                var b = a.listSelections(), c = [];
                for(var d = 0; d < b.length; d++){
                    if (!b[d].empty()) {
                        continue;
                    }
                    var e = b[d].head, f = aY(a.doc, e.line).text;
                    if (f) {
                        if (e.ch == f.length) {
                            e = new a4(e.line, e.ch - 1);
                        }
                        if (e.ch > 0) {
                            e = new a4(e.line, e.ch + 1);
                            a.replaceRange(f.charAt(e.ch - 1) + f.charAt(e.ch - 2), a4(e.line, e.ch - 2), e, "+transpose");
                        } else if (e.line > a.doc.first) {
                            var g = aY(a.doc, e.line - 1).text;
                            if (g) {
                                e = new a4(e.line, 1);
                                a.replaceRange(f.charAt(0) + a.doc.lineSeparator() + g.charAt(g.length - 1), a4(e.line - 1, g.length - 1), e, "+transpose");
                            }
                        }
                    }
                    c.push(new es(e, e));
                }
                a.setSelections(c);
            });
        },
        newlineAndIndent: function(a) {
            return d0(a, function() {
                var b = a.listSelections();
                for(var c = b.length - 1; c >= 0; c--){
                    a.replaceRange(a.doc.lineSeparator(), b[c].anchor, b[c].head, "+input");
                }
                b = a.listSelections();
                for(var d = 0; d < b.length; d++){
                    a.indentLine(b[d].from().line, null, true);
                }
                dE(a);
            });
        },
        openLine: function(a) {
            return a.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(a) {
            return a.toggleOverwrite();
        }
    };
    function f0(a, b) {
        var c = aY(a.doc, b);
        var d = bP(c);
        if (d != c) {
            b = a0(d);
        }
        return fZ(true, a, d, b, 1);
    }
    function f1(a, b) {
        var c = aY(a.doc, b);
        var d = bQ(c);
        if (d != c) {
            b = a0(d);
        }
        return fZ(true, a, c, b, -1);
    }
    function f2(a, b) {
        var c = f0(a, b.line);
        var d = aY(a.doc, c.line);
        var e = am(d, a.doc.direction);
        if (!e || e[0].level == 0) {
            var f = Math.max(c.ch, d.text.search(/\S/));
            var g = b.line == c.line && b.ch <= f && b.ch;
            return a4(c.line, g ? 0 : f, c.sticky);
        }
        return c;
    }
    function f3(a, b, c) {
        if (typeof b == "string") {
            b = f_[b];
            if (!b) {
                return false;
            }
        }
        a.display.input.ensurePolled();
        var d = a.display.shift, e = false;
        try {
            if (a.isReadOnly()) {
                a.state.suppressEdits = true;
            }
            if (c) {
                a.display.shift = false;
            }
            e = b(a) != Q;
        } finally{
            a.display.shift = d;
            a.state.suppressEdits = false;
        }
        return e;
    }
    function f4(a, b, c) {
        for(var d = 0; d < a.state.keyMaps.length; d++){
            var e = fR(b, a.state.keyMaps[d], c, a);
            if (e) {
                return e;
            }
        }
        return ((a.options.extraKeys && fR(b, a.options.extraKeys, c, a)) || fR(b, a.options.keyMap, c, a));
    }
    var f5 = new N();
    function f6(a, b, c, d) {
        var e = a.state.keySeq;
        if (e) {
            if (fS(b)) {
                return "handled";
            }
            if (/\'$/.test(b)) {
                a.state.keySeq = null;
            } else {
                f5.set(50, function() {
                    if (a.state.keySeq == e) {
                        a.state.keySeq = null;
                        a.display.input.reset();
                    }
                });
            }
            if (f7(a, e + " " + b, c, d)) {
                return true;
            }
        }
        return f7(a, b, c, d);
    }
    function f7(a, b, c, d) {
        var e = f4(a, b, d);
        if (e == "multi") {
            a.state.keySeq = b;
        }
        if (e == "handled") {
            ch(a, "keyHandled", a, b, c);
        }
        if (e == "handled" || e == "multi") {
            aw(c);
            dr(a);
        }
        return !!e;
    }
    function f8(a, b) {
        var c = fU(b, true);
        if (!c) {
            return false;
        }
        if (b.shiftKey && !a.state.keySeq) {
            return (f6(a, "Shift-" + c, b, function(b) {
                return f3(a, b, true);
            }) || f6(a, c, b, function(b) {
                if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion) {
                    return f3(a, b);
                }
            }));
        } else {
            return f6(a, c, b, function(b) {
                return f3(a, b);
            });
        }
    }
    function f9(a, b, c) {
        return f6(a, "'" + c + "'", b, function(b) {
            return f3(a, b, true);
        });
    }
    var ga = null;
    function gb(a) {
        var b = this;
        if (a.target && a.target != b.display.input.getField()) {
            return;
        }
        b.curOp.focus = G();
        if (as(b, a)) {
            return;
        }
        if (g && h < 11 && a.keyCode == 27) {
            a.returnValue = false;
        }
        var d = a.keyCode;
        b.display.shift = d == 16 || a.shiftKey;
        var e = f8(b, a);
        if (l) {
            ga = e ? d : null;
            if (!e && d == 88 && !aJ && (s ? a.metaKey : a.ctrlKey)) {
                b.replaceSelection("", null, "cut");
            }
        }
        if (c && !s && !e && d == 46 && a.shiftKey && !a.ctrlKey && document.execCommand) {
            document.execCommand("cut");
        }
        if (d == 18 && !/\bCodeMirror-crosshair\b/.test(b.display.lineDiv.className)) {
            gc(b);
        }
    }
    function gc(a) {
        var b = a.display.lineDiv;
        H(b, "CodeMirror-crosshair");
        function c(a) {
            if (a.keyCode == 18 || !a.altKey) {
                z(b, "CodeMirror-crosshair");
                aq(document, "keyup", c);
                aq(document, "mouseover", c);
            }
        }
        ao(document, "keyup", c);
        ao(document, "mouseover", c);
    }
    function gd(a) {
        if (a.keyCode == 16) {
            this.doc.sel.shift = false;
        }
        as(this, a);
    }
    function ge(a) {
        var b = this;
        if (a.target && a.target != b.display.input.getField()) {
            return;
        }
        if (cw(b.display, a) || as(b, a) || (a.ctrlKey && !a.altKey) || (s && a.metaKey)) {
            return;
        }
        var c = a.keyCode, d = a.charCode;
        if (l && c == ga) {
            ga = null;
            aw(a);
            return;
        }
        if (l && (!a.which || a.which < 10) && f8(b, a)) {
            return;
        }
        var e = String.fromCharCode(d == null ? c : d);
        if (e == "\x08") {
            return;
        }
        if (f9(b, a, e)) {
            return;
        }
        b.display.input.onKeyPress(a);
    }
    var gf = 400;
    var gg = function(a, b, c) {
        this.time = a;
        this.pos = b;
        this.button = c;
    };
    gg.prototype.compare = function(a, b, c) {
        return (this.time + gf > a && a5(b, this.pos) == 0 && c == this.button);
    };
    var gh, gi;
    function gj(a, b) {
        var c = +new Date();
        if (gi && gi.compare(c, a, b)) {
            gh = gi = null;
            return "triple";
        } else if (gh && gh.compare(c, a, b)) {
            gi = new gg(c, a, b);
            gh = null;
            return "double";
        } else {
            gh = new gg(c, a, b);
            gi = null;
            return "single";
        }
    }
    function gk(a) {
        var b = this, c = b.display;
        if (as(b, a) || (c.activeTouch && c.input.supportsTouch())) {
            return;
        }
        c.input.ensurePolled();
        c.shift = a.shiftKey;
        if (cw(c, a)) {
            if (!i) {
                c.scroller.draggable = false;
                setTimeout(function() {
                    return (c.scroller.draggable = true);
                }, 100);
            }
            return;
        }
        if (gt(b, a)) {
            return;
        }
        var d = dd(b, a), e = aB(a), f = d ? gj(d, e) : "single";
        window.focus();
        if (e == 1 && b.state.selectingText) {
            b.state.selectingText(a);
        }
        if (d && gl(b, e, d, f, a)) {
            return;
        }
        if (e == 1) {
            if (d) {
                gn(b, d, f, a);
            } else if (aA(a) == c.scroller) {
                aw(a);
            }
        } else if (e == 2) {
            if (d) {
                eW(b.doc, d);
            }
            setTimeout(function() {
                return c.input.focus();
            }, 20);
        } else if (e == 3) {
            if (x) {
                b.display.input.onContextMenu(a);
            } else {
                dt(b);
            }
        }
    }
    function gl(a, b, c, d, e) {
        var f = "Click";
        if (d == "double") {
            f = "Double" + f;
        } else if (d == "triple") {
            f = "Triple" + f;
        }
        f = (b == 1 ? "Left" : b == 2 ? "Middle" : "Right") + f;
        return f6(a, fT(f, e), e, function(b) {
            if (typeof b == "string") {
                b = f_[b];
            }
            if (!b) {
                return false;
            }
            var d = false;
            try {
                if (a.isReadOnly()) {
                    a.state.suppressEdits = true;
                }
                d = b(a, c) != Q;
            } finally{
                a.state.suppressEdits = false;
            }
            return d;
        });
    }
    function gm(a, b, c) {
        var d = a.getOption("configureMouse");
        var e = d ? d(a, b, c) : {};
        if (e.unit == null) {
            var f = t ? c.shiftKey && c.metaKey : c.altKey;
            e.unit = f ? "rectangle" : b == "single" ? "char" : b == "double" ? "word" : "line";
        }
        if (e.extend == null || a.doc.extend) {
            e.extend = a.doc.extend || c.shiftKey;
        }
        if (e.addNew == null) {
            e.addNew = s ? c.metaKey : c.ctrlKey;
        }
        if (e.moveOnDrag == null) {
            e.moveOnDrag = !(s ? c.altKey : c.ctrlKey);
        }
        return e;
    }
    function gn(a, b, c, d) {
        if (g) {
            setTimeout(K(ds, a), 0);
        } else {
            a.curOp.focus = G();
        }
        var e = gm(a, c, d);
        var f = a.doc.sel, h;
        if (a.options.dragDrop && aC && !a.isReadOnly() && c == "single" && (h = f.contains(b)) > -1 && (a5((h = f.ranges[h]).from(), b) < 0 || b.xRel > 0) && (a5(h.to(), b) > 0 || b.xRel < 0)) {
            go(a, d, b, e);
        } else {
            gq(a, d, b, e);
        }
    }
    function go(a, b, c, d) {
        var e = a.display, f = false;
        var j = d1(a, function(b) {
            if (i) {
                e.scroller.draggable = false;
            }
            a.state.draggingText = false;
            if (a.state.delayingBlurEvent) {
                if (a.hasFocus()) {
                    a.state.delayingBlurEvent = false;
                } else {
                    dt(a);
                }
            }
            aq(e.wrapper.ownerDocument, "mouseup", j);
            aq(e.wrapper.ownerDocument, "mousemove", k);
            aq(e.scroller, "dragstart", l);
            aq(e.scroller, "drop", j);
            if (!f) {
                aw(b);
                if (!d.addNew) {
                    eW(a.doc, c, null, null, d.extend);
                }
                if ((i && !m) || (g && h == 9)) {
                    setTimeout(function() {
                        e.wrapper.ownerDocument.body.focus({
                            preventScroll: true
                        });
                        e.input.focus();
                    }, 20);
                } else {
                    e.input.focus();
                }
            }
        });
        var k = function(a) {
            f = f || Math.abs(b.clientX - a.clientX) + Math.abs(b.clientY - a.clientY) >= 10;
        };
        var l = function() {
            return (f = true);
        };
        if (i) {
            e.scroller.draggable = true;
        }
        a.state.draggingText = j;
        j.copy = !d.moveOnDrag;
        ao(e.wrapper.ownerDocument, "mouseup", j);
        ao(e.wrapper.ownerDocument, "mousemove", k);
        ao(e.scroller, "dragstart", l);
        ao(e.scroller, "drop", j);
        a.state.delayingBlurEvent = true;
        setTimeout(function() {
            return e.input.focus();
        }, 20);
        if (e.scroller.dragDrop) {
            e.scroller.dragDrop();
        }
    }
    function gp(a, b, c) {
        if (c == "char") {
            return new es(b, b);
        }
        if (c == "word") {
            return a.findWordAt(b);
        }
        if (c == "line") {
            return new es(a4(b.line, 0), bb(a.doc, a4(b.line + 1, 0)));
        }
        var d = c(a, b);
        return new es(d.from, d.to);
    }
    function gq(a, b, c, d) {
        if (g) {
            dt(a);
        }
        var e = a.display, f = a.doc;
        aw(b);
        var h, i, j = f.sel, k = j.ranges;
        if (d.addNew && !d.extend) {
            i = f.sel.contains(c);
            if (i > -1) {
                h = k[i];
            } else {
                h = new es(c, c);
            }
        } else {
            h = f.sel.primary();
            i = f.sel.primIndex;
        }
        if (d.unit == "rectangle") {
            if (!d.addNew) {
                h = new es(c, c);
            }
            c = dd(a, b, true, true);
            i = -1;
        } else {
            var l = gp(a, c, d.unit);
            if (d.extend) {
                h = eV(h, l.anchor, l.head, d.extend);
            } else {
                h = l;
            }
        }
        if (!d.addNew) {
            i = 0;
            e0(f, new er([
                h
            ], 0), S);
            j = f.sel;
        } else if (i == -1) {
            i = k.length;
            e0(f, et(a, k.concat([
                h
            ]), i), {
                scroll: false,
                origin: "*mouse"
            });
        } else if (k.length > 1 && k[i].empty() && d.unit == "char" && !d.extend) {
            e0(f, et(a, k.slice(0, i).concat(k.slice(i + 1)), 0), {
                scroll: false,
                origin: "*mouse"
            });
            j = f.sel;
        } else {
            eY(f, i, h, S);
        }
        var m = c;
        function n(b) {
            if (a5(m, b) == 0) {
                return;
            }
            m = b;
            if (d.unit == "rectangle") {
                var e = [], g = a.options.tabSize;
                var k = M(aY(f, c.line).text, c.ch, g);
                var l = M(aY(f, b.line).text, b.ch, g);
                var n = Math.min(k, l), o = Math.max(k, l);
                for(var p = Math.min(c.line, b.line), q = Math.min(a.lastLine(), Math.max(c.line, b.line)); p <= q; p++){
                    var r = aY(f, p).text, s = U(r, n, g);
                    if (n == o) {
                        e.push(new es(a4(p, s), a4(p, s)));
                    } else if (r.length > s) {
                        e.push(new es(a4(p, s), a4(p, U(r, o, g))));
                    }
                }
                if (!e.length) {
                    e.push(new es(c, c));
                }
                e0(f, et(a, j.ranges.slice(0, i).concat(e), i), {
                    origin: "*mouse",
                    scroll: false
                });
                a.scrollIntoView(b);
            } else {
                var t = h;
                var u = gp(a, b, d.unit);
                var v = t.anchor, w;
                if (a5(u.anchor, v) > 0) {
                    w = u.head;
                    v = a9(t.from(), u.anchor);
                } else {
                    w = u.anchor;
                    v = a8(t.to(), u.head);
                }
                var x = j.ranges.slice(0);
                x[i] = gr(a, new es(bb(f, v), w));
                e0(f, et(a, x, i), S);
            }
        }
        var o = e.wrapper.getBoundingClientRect();
        var p = 0;
        function q(b) {
            var c = ++p;
            var g = dd(a, b, true, d.unit == "rectangle");
            if (!g) {
                return;
            }
            if (a5(g, m) != 0) {
                a.curOp.focus = G();
                n(g);
                var h = dy(e, f);
                if (g.line >= h.to || g.line < h.from) {
                    setTimeout(d1(a, function() {
                        if (p == c) {
                            q(b);
                        }
                    }), 150);
                }
            } else {
                var i = b.clientY < o.top ? -20 : b.clientY > o.bottom ? 20 : 0;
                if (i) {
                    setTimeout(d1(a, function() {
                        if (p != c) {
                            return;
                        }
                        e.scroller.scrollTop += i;
                        q(b);
                    }), 50);
                }
            }
        }
        function r(b) {
            a.state.selectingText = false;
            p = Infinity;
            if (b) {
                aw(b);
                e.input.focus();
            }
            aq(e.wrapper.ownerDocument, "mousemove", s);
            aq(e.wrapper.ownerDocument, "mouseup", t);
            f.history.lastSelOrigin = null;
        }
        var s = d1(a, function(a) {
            if (a.buttons === 0 || !aB(a)) {
                r(a);
            } else {
                q(a);
            }
        });
        var t = d1(a, r);
        a.state.selectingText = t;
        ao(e.wrapper.ownerDocument, "mousemove", s);
        ao(e.wrapper.ownerDocument, "mouseup", t);
    }
    function gr(a, b) {
        var c = b.anchor;
        var d = b.head;
        var e = aY(a.doc, c.line);
        if (a5(c, d) == 0 && c.sticky == d.sticky) {
            return b;
        }
        var f = am(e);
        if (!f) {
            return b;
        }
        var g = ak(f, c.ch, c.sticky), h = f[g];
        if (h.from != c.ch && h.to != c.ch) {
            return b;
        }
        var i = g + ((h.from == c.ch) == (h.level != 1) ? 0 : 1);
        if (i == 0 || i == f.length) {
            return b;
        }
        var j;
        if (d.line != c.line) {
            j = (d.line - c.line) * (a.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
            var k = ak(f, d.ch, d.sticky);
            var l = k - g || (d.ch - c.ch) * (h.level == 1 ? -1 : 1);
            if (k == i - 1 || k == i) {
                j = l < 0;
            } else {
                j = l > 0;
            }
        }
        var m = f[i + (j ? -1 : 0)];
        var n = j == (m.level == 1);
        var o = n ? m.from : m.to, p = n ? "after" : "before";
        return c.ch == o && c.sticky == p ? b : new es(new a4(c.line, o, p), d);
    }
    function gs(a, b, c, d) {
        var e, f;
        if (b.touches) {
            e = b.touches[0].clientX;
            f = b.touches[0].clientY;
        } else {
            try {
                e = b.clientX;
                f = b.clientY;
            } catch (g) {
                return false;
            }
        }
        if (e >= Math.floor(a.display.gutters.getBoundingClientRect().right)) {
            return false;
        }
        if (d) {
            aw(b);
        }
        var h = a.display;
        var i = h.lineDiv.getBoundingClientRect();
        if (f > i.bottom || !au(a, c)) {
            return ay(b);
        }
        f -= i.top - h.viewOffset;
        for(var j = 0; j < a.display.gutterSpecs.length; ++j){
            var k = h.gutters.childNodes[j];
            if (k && k.getBoundingClientRect().right >= e) {
                var l = a1(a.doc, f);
                var m = a.display.gutterSpecs[j];
                ar(a, c, a, l, m.className, b);
                return ay(b);
            }
        }
    }
    function gt(a, b) {
        return gs(a, b, "gutterClick", true);
    }
    function gu(a, b) {
        if (cw(a.display, b) || gv(a, b)) {
            return;
        }
        if (as(a, b, "contextmenu")) {
            return;
        }
        if (!x) {
            a.display.input.onContextMenu(b);
        }
    }
    function gv(a, b) {
        if (!au(a, "gutterContextMenu")) {
            return false;
        }
        return gs(a, b, "gutterContextMenu", false);
    }
    function gw(a) {
        a.display.wrapper.className = a.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + a.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        cR(a);
    }
    var gx = {
        toString: function() {
            return "CodeMirror.Init";
        }
    };
    var gy = {};
    var gz = {};
    function gA(a) {
        var b = a.optionHandlers;
        function c(c, d, e, f) {
            a.defaults[c] = d;
            if (e) {
                b[c] = f ? function(a, b, c) {
                    if (c != gx) {
                        e(a, b, c);
                    }
                } : e;
            }
        }
        a.defineOption = c;
        a.Init = gx;
        c("value", "", function(a, b) {
            return a.setValue(b);
        }, true);
        c("mode", null, function(a, b) {
            a.doc.modeOption = b;
            eA(a);
        }, true);
        c("indentUnit", 2, eA, true);
        c("indentWithTabs", false);
        c("smartIndent", true);
        c("tabSize", 4, function(a) {
            eB(a);
            cR(a);
            df(a);
        }, true);
        c("lineSeparator", null, function(a, b) {
            a.doc.lineSep = b;
            if (!b) {
                return;
            }
            var c = [], d = a.doc.first;
            a.doc.iter(function(a) {
                for(var e = 0;;){
                    var f = a.text.indexOf(b, e);
                    if (f == -1) {
                        break;
                    }
                    e = f + b.length;
                    c.push(a4(d, f));
                }
                d++;
            });
            for(var e = c.length - 1; e >= 0; e--){
                fg(a.doc, b, c[e], a4(c[e].line, c[e].ch + b.length));
            }
        });
        c("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(a, b, c) {
            a.state.specialChars = new RegExp(b.source + (b.test("\t") ? "" : "|\t"), "g");
            if (c != gx) {
                a.refresh();
            }
        });
        c("specialCharPlaceholder", b4, function(a) {
            return a.refresh();
        }, true);
        c("electricChars", true);
        c("inputStyle", r ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        c("spellcheck", false, function(a, b) {
            return (a.getInputField().spellcheck = b);
        }, true);
        c("autocorrect", false, function(a, b) {
            return (a.getInputField().autocorrect = b);
        }, true);
        c("autocapitalize", false, function(a, b) {
            return (a.getInputField().autocapitalize = b);
        }, true);
        c("rtlMoveVisually", !u);
        c("wholeLineUpdateBefore", true);
        c("theme", "default", function(a) {
            gw(a);
            ek(a);
        }, true);
        c("keyMap", "default", function(a, b, c) {
            var d = fV(b);
            var e = c != gx && fV(c);
            if (e && e.detach) {
                e.detach(a, d);
            }
            if (d.attach) {
                d.attach(a, e || null);
            }
        });
        c("extraKeys", null);
        c("configureMouse", null);
        c("lineWrapping", false, gC, true);
        c("gutters", [], function(a, b) {
            a.display.gutterSpecs = ei(b, a.options.lineNumbers);
            ek(a);
        }, true);
        c("fixedGutter", true, function(a, b) {
            a.display.gutters.style.left = b ? da(a.display) + "px" : "0";
            a.refresh();
        }, true);
        c("coverGutterNextToScrollbar", false, function(a) {
            return dP(a);
        }, true);
        c("scrollbarStyle", "native", function(a) {
            dS(a);
            dP(a);
            a.display.scrollbars.setScrollTop(a.doc.scrollTop);
            a.display.scrollbars.setScrollLeft(a.doc.scrollLeft);
        }, true);
        c("lineNumbers", false, function(a, b) {
            a.display.gutterSpecs = ei(a.options.gutters, b);
            ek(a);
        }, true);
        c("firstLineNumber", 1, ek, true);
        c("lineNumberFormatter", function(a) {
            return a;
        }, ek, true);
        c("showCursorWhenSelecting", false, dl, true);
        c("resetSelectionOnContextMenu", true);
        c("lineWiseCopyCut", true);
        c("pasteLinesPerSelection", true);
        c("selectionsMayTouch", false);
        c("readOnly", false, function(a, b) {
            if (b == "nocursor") {
                dv(a);
                a.display.input.blur();
            }
            a.display.input.readOnlyChanged(b);
        });
        c("screenReaderLabel", null, function(a, b) {
            b = b === "" ? null : b;
            a.display.input.screenReaderLabelChanged(b);
        });
        c("disableInput", false, function(a, b) {
            if (!b) {
                a.display.input.reset();
            }
        }, true);
        c("dragDrop", true, gB);
        c("allowDropFileTypes", null);
        c("cursorBlinkRate", 530);
        c("cursorScrollMargin", 0);
        c("cursorHeight", 1, dl, true);
        c("singleCursorHeightPerLine", true, dl, true);
        c("workTime", 100);
        c("workDelay", 100);
        c("flattenSpans", true, eB, true);
        c("addModeClass", false, eB, true);
        c("pollInterval", 100);
        c("undoDepth", 200, function(a, b) {
            return (a.doc.history.undoDepth = b);
        });
        c("historyEventDelay", 1250);
        c("viewportMargin", 10, function(a) {
            return a.refresh();
        }, true);
        c("maxHighlightLength", 10000, eB, true);
        c("moveInputWithCursor", true, function(a, b) {
            if (!b) {
                a.display.input.resetPosition();
            }
        });
        c("tabindex", null, function(a, b) {
            return (a.display.input.getField().tabIndex = b || "");
        });
        c("autofocus", null);
        c("direction", "ltr", function(a, b) {
            return a.doc.setDirection(b);
        }, true);
        c("phrases", null);
    }
    function gB(a, b, c) {
        var d = c && c != gx;
        if (!b != !d) {
            var e = a.display.dragFunctions;
            var f = b ? ao : aq;
            f(a.display.scroller, "dragstart", e.start);
            f(a.display.scroller, "dragenter", e.enter);
            f(a.display.scroller, "dragover", e.over);
            f(a.display.scroller, "dragleave", e.leave);
            f(a.display.scroller, "drop", e.drop);
        }
    }
    function gC(a) {
        if (a.options.lineWrapping) {
            H(a.display.wrapper, "CodeMirror-wrap");
            a.display.sizer.style.minWidth = "";
            a.display.sizerWidth = null;
        } else {
            z(a.display.wrapper, "CodeMirror-wrap");
            bY(a);
        }
        dc(a);
        df(a);
        cR(a);
        setTimeout(function() {
            return dP(a);
        }, 100);
    }
    function gD(a, b) {
        var c = this;
        if (!(this instanceof gD)) {
            return new gD(a, b);
        }
        this.options = b = b ? L(b) : {};
        L(gy, b, false);
        var d = b.value;
        if (typeof d == "string") {
            d = new fz(d, b.mode, null, b.lineSeparator, b.direction);
        } else if (b.mode) {
            d.modeOption = b.mode;
        }
        this.doc = d;
        var e = new gD.inputStyles[b.inputStyle](this);
        var f = (this.display = new el(a, d, e, b));
        f.wrapper.CodeMirror = this;
        gw(this);
        if (b.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap";
        }
        dS(this);
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
            highlight: new N(),
            keySeq: null,
            specialChars: null
        };
        if (b.autofocus && !r) {
            f.input.focus();
        }
        if (g && h < 11) {
            setTimeout(function() {
                return c.display.input.reset(true);
            }, 20);
        }
        gE(this);
        fH();
        dU(this);
        this.curOp.forceUpdate = true;
        eF(this, d);
        if ((b.autofocus && !r) || this.hasFocus()) {
            setTimeout(function() {
                if (c.hasFocus() && !c.state.focused) {
                    du(c);
                }
            }, 20);
        } else {
            dv(this);
        }
        for(var j in gz){
            if (gz.hasOwnProperty(j)) {
                gz[j](this, b[j], gx);
            }
        }
        eh(this);
        if (b.finishInit) {
            b.finishInit(this);
        }
        for(var k = 0; k < gF.length; ++k){
            gF[k](this);
        }
        dV(this);
        if (i && b.lineWrapping && getComputedStyle(f.lineDiv).textRendering == "optimizelegibility") {
            f.lineDiv.style.textRendering = "auto";
        }
    }
    gD.defaults = gy;
    gD.optionHandlers = gz;
    function gE(a) {
        var b = a.display;
        ao(b.scroller, "mousedown", d1(a, gk));
        if (g && h < 11) {
            ao(b.scroller, "dblclick", d1(a, function(b) {
                if (as(a, b)) {
                    return;
                }
                var c = dd(a, b);
                if (!c || gt(a, b) || cw(a.display, b)) {
                    return;
                }
                aw(b);
                var d = a.findWordAt(c);
                eW(a.doc, d.anchor, d.head);
            }));
        } else {
            ao(b.scroller, "dblclick", function(b) {
                return as(a, b) || aw(b);
            });
        }
        ao(b.scroller, "contextmenu", function(b) {
            return gu(a, b);
        });
        ao(b.input.getField(), "contextmenu", function(c) {
            if (!b.scroller.contains(c.target)) {
                gu(a, c);
            }
        });
        var c, d = {
            end: 0
        };
        function e() {
            if (b.activeTouch) {
                c = setTimeout(function() {
                    return (b.activeTouch = null);
                }, 1000);
                d = b.activeTouch;
                d.end = +new Date();
            }
        }
        function f(a) {
            if (a.touches.length != 1) {
                return false;
            }
            var b = a.touches[0];
            return b.radiusX <= 1 && b.radiusY <= 1;
        }
        function i(a, b) {
            if (b.left == null) {
                return true;
            }
            var c = b.left - a.left, d = b.top - a.top;
            return c * c + d * d > 20 * 20;
        }
        ao(b.scroller, "touchstart", function(e) {
            if (!as(a, e) && !f(e) && !gt(a, e)) {
                b.input.ensurePolled();
                clearTimeout(c);
                var g = +new Date();
                b.activeTouch = {
                    start: g,
                    moved: false,
                    prev: g - d.end <= 300 ? d : null
                };
                if (e.touches.length == 1) {
                    b.activeTouch.left = e.touches[0].pageX;
                    b.activeTouch.top = e.touches[0].pageY;
                }
            }
        });
        ao(b.scroller, "touchmove", function() {
            if (b.activeTouch) {
                b.activeTouch.moved = true;
            }
        });
        ao(b.scroller, "touchend", function(c) {
            var d = b.activeTouch;
            if (d && !cw(b, c) && d.left != null && !d.moved && new Date() - d.start < 300) {
                var f = a.coordsChar(b.activeTouch, "page"), g;
                if (!d.prev || i(d, d.prev)) {
                    g = new es(f, f);
                } else if (!d.prev.prev || i(d, d.prev.prev)) {
                    g = a.findWordAt(f);
                } else {
                    g = new es(a4(f.line, 0), bb(a.doc, a4(f.line + 1, 0)));
                }
                a.setSelection(g.anchor, g.head);
                a.focus();
                aw(c);
            }
            e();
        });
        ao(b.scroller, "touchcancel", e);
        ao(b.scroller, "scroll", function() {
            if (b.scroller.clientHeight) {
                dJ(a, b.scroller.scrollTop);
                dL(a, b.scroller.scrollLeft, true);
                ar(a, "scroll", a);
            }
        });
        ao(b.scroller, "mousewheel", function(b) {
            return eq(a, b);
        });
        ao(b.scroller, "DOMMouseScroll", function(b) {
            return eq(a, b);
        });
        ao(b.wrapper, "scroll", function() {
            return (b.wrapper.scrollTop = b.wrapper.scrollLeft = 0);
        });
        b.dragFunctions = {
            enter: function(b) {
                if (!as(a, b)) {
                    az(b);
                }
            },
            over: function(b) {
                if (!as(a, b)) {
                    fD(a, b);
                    az(b);
                }
            },
            start: function(b) {
                return fC(a, b);
            },
            drop: d1(a, fB),
            leave: function(b) {
                if (!as(a, b)) {
                    fE(a);
                }
            }
        };
        var j = b.input.getField();
        ao(j, "keyup", function(b) {
            return gd.call(a, b);
        });
        ao(j, "keydown", d1(a, gb));
        ao(j, "keypress", d1(a, ge));
        ao(j, "focus", function(b) {
            return du(a, b);
        });
        ao(j, "blur", function(b) {
            return dv(a, b);
        });
    }
    var gF = [];
    gD.defineInitHook = function(a) {
        return gF.push(a);
    };
    function gG(a, b, c, d) {
        var e = a.doc, f;
        if (c == null) {
            c = "add";
        }
        if (c == "smart") {
            if (!e.mode.indent) {
                c = "prev";
            } else {
                f = bi(a, b).state;
            }
        }
        var g = a.options.tabSize;
        var h = aY(e, b), i = M(h.text, null, g);
        if (h.stateAfter) {
            h.stateAfter = null;
        }
        var j = h.text.match(/^\s*/)[0], k;
        if (!d && !/\S/.test(h.text)) {
            k = 0;
            c = "not";
        } else if (c == "smart") {
            k = e.mode.indent(f, h.text.slice(j.length), h.text);
            if (k == Q || k > 150) {
                if (!d) {
                    return;
                }
                c = "prev";
            }
        }
        if (c == "prev") {
            if (b > e.first) {
                k = M(aY(e, b - 1).text, null, g);
            } else {
                k = 0;
            }
        } else if (c == "add") {
            k = i + a.options.indentUnit;
        } else if (c == "subtract") {
            k = i - a.options.indentUnit;
        } else if (typeof c == "number") {
            k = i + c;
        }
        k = Math.max(0, k);
        var l = "", m = 0;
        if (a.options.indentWithTabs) {
            for(var n = Math.floor(k / g); n; --n){
                m += g;
                l += "\t";
            }
        }
        if (m < k) {
            l += W(k - m);
        }
        if (l != j) {
            fg(e, l, a4(b, 0), a4(b, j.length), "+input");
            h.stateAfter = null;
            return true;
        } else {
            for(var o = 0; o < e.sel.ranges.length; o++){
                var p = e.sel.ranges[o];
                if (p.head.line == b && p.head.ch < j.length) {
                    var q = a4(b, j.length);
                    eY(e, o, new es(q, q));
                    break;
                }
            }
        }
    }
    var gH = null;
    function gI(a) {
        gH = a;
    }
    function gJ(a, b, c, d, e) {
        var f = a.doc;
        a.display.shift = false;
        if (!d) {
            d = f.sel;
        }
        var g = +new Date() - 200;
        var h = e == "paste" || a.state.pasteIncoming > g;
        var i = aH(b), j = null;
        if (h && d.ranges.length > 1) {
            if (gH && gH.text.join("\n") == b) {
                if (d.ranges.length % gH.text.length == 0) {
                    j = [];
                    for(var k = 0; k < gH.text.length; k++){
                        j.push(f.splitLines(gH.text[k]));
                    }
                }
            } else if (i.length == d.ranges.length && a.options.pasteLinesPerSelection) {
                j = Y(i, function(a) {
                    return [
                        a
                    ];
                });
            }
        }
        var l = a.curOp.updateInput;
        for(var m = d.ranges.length - 1; m >= 0; m--){
            var n = d.ranges[m];
            var o = n.from(), p = n.to();
            if (n.empty()) {
                if (c && c > 0) {
                    o = a4(o.line, o.ch - c);
                } else if (a.state.overwrite && !h) {
                    p = a4(p.line, Math.min(aY(f, p.line).text.length, p.ch + X(i).length));
                } else if (h && gH && gH.lineWise && gH.text.join("\n") == i.join("\n")) {
                    o = p = a4(o.line, 0);
                }
            }
            var q = {
                from: o,
                to: p,
                text: j ? j[m % j.length] : i,
                origin: e || (h ? "paste" : a.state.cutIncoming > g ? "cut" : "+input")
            };
            fa(a.doc, q);
            ch(a, "inputRead", a, q);
        }
        if (b && !h) {
            gL(a, b);
        }
        dE(a);
        if (a.curOp.updateInput < 2) {
            a.curOp.updateInput = l;
        }
        a.curOp.typing = true;
        a.state.pasteIncoming = a.state.cutIncoming = -1;
    }
    function gK(a, b) {
        var c = a.clipboardData && a.clipboardData.getData("Text");
        if (c) {
            a.preventDefault();
            if (!b.isReadOnly() && !b.options.disableInput) {
                d0(b, function() {
                    return gJ(b, c, 0, null, "paste");
                });
            }
            return true;
        }
    }
    function gL(a, b) {
        if (!a.options.electricChars || !a.options.smartIndent) {
            return;
        }
        var c = a.doc.sel;
        for(var d = c.ranges.length - 1; d >= 0; d--){
            var e = c.ranges[d];
            if (e.head.ch > 100 || (d && c.ranges[d - 1].head.line == e.head.line)) {
                continue;
            }
            var f = a.getModeAt(e.head);
            var g = false;
            if (f.electricChars) {
                for(var h = 0; h < f.electricChars.length; h++){
                    if (b.indexOf(f.electricChars.charAt(h)) > -1) {
                        g = gG(a, e.head.line, "smart");
                        break;
                    }
                }
            } else if (f.electricInput) {
                if (f.electricInput.test(aY(a.doc, e.head.line).text.slice(0, e.head.ch))) {
                    g = gG(a, e.head.line, "smart");
                }
            }
            if (g) {
                ch(a, "electricInput", a, e.head.line);
            }
        }
    }
    function gM(a) {
        var b = [], c = [];
        for(var d = 0; d < a.doc.sel.ranges.length; d++){
            var e = a.doc.sel.ranges[d].head.line;
            var f = {
                anchor: a4(e, 0),
                head: a4(e + 1, 0)
            };
            c.push(f);
            b.push(a.getRange(f.anchor, f.head));
        }
        return {
            text: b,
            ranges: c
        };
    }
    function gN(a, b, c, d) {
        a.setAttribute("autocorrect", c ? "" : "off");
        a.setAttribute("autocapitalize", d ? "" : "off");
        a.setAttribute("spellcheck", !!b);
    }
    function gO() {
        var a = C("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var b = C("div", [
            a
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (i) {
            a.style.width = "1000px";
        } else {
            a.setAttribute("wrap", "off");
        }
        if (p) {
            a.style.border = "1px solid black";
        }
        gN(a);
        return b;
    }
    function gP(a) {
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
                    d1(this, b[a])(this, c, e);
                }
                ar(this, "optionChange", this, a);
            },
            getOption: function(a) {
                return this.options[a];
            },
            getDoc: function() {
                return this.doc;
            },
            addKeyMap: function(a, b) {
                this.state.keyMaps[b ? "push" : "unshift"](fV(a));
            },
            removeKeyMap: function(a) {
                var b = this.state.keyMaps;
                for(var c = 0; c < b.length; ++c){
                    if (b[c] == a || b[c].name == a) {
                        b.splice(c, 1);
                        return true;
                    }
                }
            },
            addOverlay: d2(function(b, c) {
                var d = b.token ? b : a.getMode(this.options, b);
                if (d.startState) {
                    throw new Error("Overlays may not be stateful.");
                }
                Z(this.state.overlays, {
                    mode: d,
                    modeSpec: b,
                    opaque: c && c.opaque,
                    priority: (c && c.priority) || 0
                }, function(a) {
                    return a.priority;
                });
                this.state.modeGen++;
                df(this);
            }),
            removeOverlay: d2(function(a) {
                var b = this.state.overlays;
                for(var c = 0; c < b.length; ++c){
                    var d = b[c].modeSpec;
                    if (d == a || (typeof a == "string" && d.name == a)) {
                        b.splice(c, 1);
                        this.state.modeGen++;
                        df(this);
                        return;
                    }
                }
            }),
            indentLine: d2(function(a, b, c) {
                if (typeof b != "string" && typeof b != "number") {
                    if (b == null) {
                        b = this.options.smartIndent ? "smart" : "prev";
                    } else {
                        b = b ? "add" : "subtract";
                    }
                }
                if (a2(this.doc, a)) {
                    gG(this, a, b, c);
                }
            }),
            indentSelection: d2(function(a) {
                var b = this.doc.sel.ranges, c = -1;
                for(var d = 0; d < b.length; d++){
                    var e = b[d];
                    if (!e.empty()) {
                        var f = e.from(), g = e.to();
                        var h = Math.max(c, f.line);
                        c = Math.min(this.lastLine(), g.line - (g.ch ? 0 : 1)) + 1;
                        for(var i = h; i < c; ++i){
                            gG(this, i, a);
                        }
                        var j = this.doc.sel.ranges;
                        if (f.ch == 0 && b.length == j.length && j[d].from().ch > 0) {
                            eY(this.doc, d, new es(f, j[d].to()), R);
                        }
                    } else if (e.head.line > c) {
                        gG(this, e.head.line, a, true);
                        c = e.head.line;
                        if (d == this.doc.sel.primIndex) {
                            dE(this);
                        }
                    }
                }
            }),
            getTokenAt: function(a, b) {
                return bn(this, a, b);
            },
            getLineTokens: function(a, b) {
                return bn(this, a4(a), b, true);
            },
            getTokenTypeAt: function(a) {
                a = bb(this.doc, a);
                var b = bh(this, aY(this.doc, a.line));
                var c = 0, d = (b.length - 1) / 2, e = a.ch;
                var f;
                if (e == 0) {
                    f = b[2];
                } else {
                    for(;;){
                        var g = (c + d) >> 1;
                        if ((g ? b[g * 2 - 1] : 0) >= e) {
                            d = g;
                        } else if (b[g * 2 + 1] < e) {
                            c = g + 1;
                        } else {
                            f = b[g * 2 + 2];
                            break;
                        }
                    }
                }
                var h = f ? f.indexOf("overlay ") : -1;
                return h < 0 ? f : h == 0 ? null : f.slice(0, h - 1);
            },
            getModeAt: function(b) {
                var c = this.doc.mode;
                if (!c.innerMode) {
                    return c;
                }
                return a.innerMode(c, this.getTokenAt(b).state).mode;
            },
            getHelper: function(a, b) {
                return this.getHelpers(a, b)[0];
            },
            getHelpers: function(a, b) {
                var d = [];
                if (!c.hasOwnProperty(b)) {
                    return d;
                }
                var e = c[b], f = this.getModeAt(a);
                if (typeof f[b] == "string") {
                    if (e[f[b]]) {
                        d.push(e[f[b]]);
                    }
                } else if (f[b]) {
                    for(var g = 0; g < f[b].length; g++){
                        var h = e[f[b][g]];
                        if (h) {
                            d.push(h);
                        }
                    }
                } else if (f.helperType && e[f.helperType]) {
                    d.push(e[f.helperType]);
                } else if (e[f.name]) {
                    d.push(e[f.name]);
                }
                for(var i = 0; i < e._global.length; i++){
                    var j = e._global[i];
                    if (j.pred(f, this) && O(d, j.val) == -1) {
                        d.push(j.val);
                    }
                }
                return d;
            },
            getStateAfter: function(a, b) {
                var c = this.doc;
                a = ba(c, a == null ? c.first + c.size - 1 : a);
                return bi(this, a + 1, b).state;
            },
            cursorCoords: function(a, b) {
                var c, d = this.doc.sel.primary();
                if (a == null) {
                    c = d.head;
                } else if (typeof a == "object") {
                    c = bb(this.doc, a);
                } else {
                    c = a ? d.from() : d.to();
                }
                return cY(this, c, b || "page");
            },
            charCoords: function(a, b) {
                return cX(this, bb(this.doc, a), b || "page");
            },
            coordsChar: function(a, b) {
                a = cW(this, a, b || "page");
                return c_(this, a.left, a.top);
            },
            lineAtHeight: function(a, b) {
                a = cW(this, {
                    top: a,
                    left: 0
                }, b || "page").top;
                return a1(this.doc, a + this.display.viewOffset);
            },
            heightAtLine: function(a, b, c) {
                var d = false, e;
                if (typeof a == "number") {
                    var f = this.doc.first + this.doc.size - 1;
                    if (a < this.doc.first) {
                        a = this.doc.first;
                    } else if (a > f) {
                        a = f;
                        d = true;
                    }
                    e = aY(this.doc, a);
                } else {
                    e = a;
                }
                return (cV(this, e, {
                    top: 0,
                    left: 0
                }, b || "page", c || d).top + (d ? this.doc.height - bW(e) : 0));
            },
            defaultTextHeight: function() {
                return c7(this.display);
            },
            defaultCharWidth: function() {
                return c8(this.display);
            },
            getViewport: function() {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function(a, b, c, d, e) {
                var f = this.display;
                a = cY(this, bb(this.doc, a));
                var g = a.bottom, h = a.left;
                b.style.position = "absolute";
                b.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(b);
                f.sizer.appendChild(b);
                if (d == "over") {
                    g = a.top;
                } else if (d == "above" || d == "near") {
                    var i = Math.max(f.wrapper.clientHeight, this.doc.height), j = Math.max(f.sizer.clientWidth, f.lineSpace.clientWidth);
                    if ((d == "above" || a.bottom + b.offsetHeight > i) && a.top > b.offsetHeight) {
                        g = a.top - b.offsetHeight;
                    } else if (a.bottom + b.offsetHeight <= i) {
                        g = a.bottom;
                    }
                    if (h + b.offsetWidth > j) {
                        h = j - b.offsetWidth;
                    }
                }
                b.style.top = g + "px";
                b.style.left = b.style.right = "";
                if (e == "right") {
                    h = f.sizer.clientWidth - b.offsetWidth;
                    b.style.right = "0px";
                } else {
                    if (e == "left") {
                        h = 0;
                    } else if (e == "middle") {
                        h = (f.sizer.clientWidth - b.offsetWidth) / 2;
                    }
                    b.style.left = h + "px";
                }
                if (c) {
                    dB(this, {
                        left: h,
                        top: g,
                        right: h + b.offsetWidth,
                        bottom: g + b.offsetHeight
                    });
                }
            },
            triggerOnKeyDown: d2(gb),
            triggerOnKeyPress: d2(ge),
            triggerOnKeyUp: gd,
            triggerOnMouseDown: d2(gk),
            execCommand: function(a) {
                if (f_.hasOwnProperty(a)) {
                    return f_[a].call(null, this);
                }
            },
            triggerElectric: d2(function(a) {
                gL(this, a);
            }),
            findPosH: function(a, b, c, d) {
                var e = 1;
                if (b < 0) {
                    e = -1;
                    b = -b;
                }
                var f = bb(this.doc, a);
                for(var g = 0; g < b; ++g){
                    f = gQ(this.doc, f, e, c, d);
                    if (f.hitSide) {
                        break;
                    }
                }
                return f;
            },
            moveH: d2(function(a, b) {
                var c = this;
                this.extendSelectionsBy(function(d) {
                    if (c.display.shift || c.doc.extend || d.empty()) {
                        return gQ(c.doc, d.head, a, b, c.options.rtlMoveVisually);
                    } else {
                        return a < 0 ? d.from() : d.to();
                    }
                }, T);
            }),
            deleteH: d2(function(a, b) {
                var c = this.doc.sel, d = this.doc;
                if (c.somethingSelected()) {
                    d.replaceSelection("", null, "+delete");
                } else {
                    fW(this, function(c) {
                        var e = gQ(d, c.head, a, b, false);
                        return a < 0 ? {
                            from: e,
                            to: c.head
                        } : {
                            from: c.head,
                            to: e
                        };
                    });
                }
            }),
            findPosV: function(a, b, c, d) {
                var e = 1, f = d;
                if (b < 0) {
                    e = -1;
                    b = -b;
                }
                var g = bb(this.doc, a);
                for(var h = 0; h < b; ++h){
                    var i = cY(this, g, "div");
                    if (f == null) {
                        f = i.left;
                    } else {
                        i.left = f;
                    }
                    g = gR(this, i, e, c);
                    if (g.hitSide) {
                        break;
                    }
                }
                return g;
            },
            moveV: d2(function(a, b) {
                var c = this;
                var d = this.doc, e = [];
                var f = !this.display.shift && !d.extend && d.sel.somethingSelected();
                d.extendSelectionsBy(function(g) {
                    if (f) {
                        return a < 0 ? g.from() : g.to();
                    }
                    var h = cY(c, g.head, "div");
                    if (g.goalColumn != null) {
                        h.left = g.goalColumn;
                    }
                    e.push(h.left);
                    var i = gR(c, h, a, b);
                    if (b == "page" && g == d.sel.primary()) {
                        dD(c, cX(c, i, "div").top - h.top);
                    }
                    return i;
                }, T);
                if (e.length) {
                    for(var g = 0; g < d.sel.ranges.length; g++){
                        d.sel.ranges[g].goalColumn = e[g];
                    }
                }
            }),
            findWordAt: function(a) {
                var b = this.doc, c = aY(b, a.line).text;
                var d = a.ch, e = a.ch;
                if (c) {
                    var f = this.getHelper(a, "wordChars");
                    if ((a.sticky == "before" || e == c.length) && d) {
                        --d;
                    } else {
                        ++e;
                    }
                    var g = c.charAt(d);
                    var h = ac(g, f) ? function(a) {
                        return ac(a, f);
                    } : /\s/.test(g) ? function(a) {
                        return /\s/.test(a);
                    } : function(a) {
                        return !/\s/.test(a) && !ac(a);
                    };
                    while(d > 0 && h(c.charAt(d - 1))){
                        --d;
                    }
                    while(e < c.length && h(c.charAt(e))){
                        ++e;
                    }
                }
                return new es(a4(a.line, d), a4(a.line, e));
            },
            toggleOverwrite: function(a) {
                if (a != null && a == this.state.overwrite) {
                    return;
                }
                if ((this.state.overwrite = !this.state.overwrite)) {
                    H(this.display.cursorDiv, "CodeMirror-overwrite");
                } else {
                    z(this.display.cursorDiv, "CodeMirror-overwrite");
                }
                ar(this, "overwriteToggle", this, this.state.overwrite);
            },
            hasFocus: function() {
                return this.display.input.getField() == G();
            },
            isReadOnly: function() {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: d2(function(a, b) {
                dF(this, a, b);
            }),
            getScrollInfo: function() {
                var a = this.display.scroller;
                return {
                    left: a.scrollLeft,
                    top: a.scrollTop,
                    height: a.scrollHeight - cA(this) - this.display.barHeight,
                    width: a.scrollWidth - cA(this) - this.display.barWidth,
                    clientHeight: cC(this),
                    clientWidth: cB(this)
                };
            },
            scrollIntoView: d2(function(a, b) {
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
                        from: a4(a, 0),
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
                    dG(this, a);
                } else {
                    dI(this, a.from, a.to, a.margin);
                }
            }),
            setSize: d2(function(a, b) {
                var c = this;
                var d = function(a) {
                    return typeof a == "number" || /^\d+$/.test(String(a)) ? a + "px" : a;
                };
                if (a != null) {
                    this.display.wrapper.style.width = d(a);
                }
                if (b != null) {
                    this.display.wrapper.style.height = d(b);
                }
                if (this.options.lineWrapping) {
                    cQ(this);
                }
                var e = this.display.viewFrom;
                this.doc.iter(e, this.display.viewTo, function(a) {
                    if (a.widgets) {
                        for(var b = 0; b < a.widgets.length; b++){
                            if (a.widgets[b].noHScroll) {
                                dg(c, e, "widget");
                                break;
                            }
                        }
                    }
                    ++e;
                });
                this.curOp.forceUpdate = true;
                ar(this, "refresh", this);
            }),
            operation: function(a) {
                return d0(this, a);
            },
            startOperation: function() {
                return dU(this);
            },
            endOperation: function() {
                return dV(this);
            },
            refresh: d2(function() {
                var a = this.display.cachedTextHeight;
                df(this);
                this.curOp.forceUpdate = true;
                cR(this);
                dF(this, this.doc.scrollLeft, this.doc.scrollTop);
                ee(this.display);
                if (a == null || Math.abs(a - c7(this.display)) > 0.5 || this.options.lineWrapping) {
                    dc(this);
                }
                ar(this, "refresh", this);
            }),
            swapDoc: d2(function(a) {
                var b = this.doc;
                b.cm = null;
                if (this.state.selectingText) {
                    this.state.selectingText();
                }
                eF(this, a);
                cR(this);
                this.display.input.reset();
                dF(this, a.scrollLeft, a.scrollTop);
                this.curOp.forceScroll = true;
                ch(this, "swapDoc", this, b);
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
        av(a);
        a.registerHelper = function(b, d, e) {
            if (!c.hasOwnProperty(b)) {
                c[b] = a[b] = {
                    _global: []
                };
            }
            c[b][d] = e;
        };
        a.registerGlobalHelper = function(b, d, e, f) {
            a.registerHelper(b, d, f);
            c[b]._global.push({
                pred: e,
                val: f
            });
        };
    }
    function gQ(a, b, c, d, e) {
        var f = b;
        var g = c;
        var h = aY(a, b.line);
        var i = e && a.direction == "rtl" ? -c : c;
        function j() {
            var c = b.line + i;
            if (c < a.first || c >= a.first + a.size) {
                return false;
            }
            b = new a4(c, b.ch, b.sticky);
            return (h = aY(a, c));
        }
        function k(f) {
            var g;
            if (d == "codepoint") {
                var k = h.text.charCodeAt(b.ch + (c > 0 ? 0 : -1));
                if (isNaN(k)) {
                    g = null;
                } else {
                    var l = c > 0 ? k >= 0xd800 && k < 0xdc00 : k >= 0xdc00 && k < 0xdfff;
                    g = new a4(b.line, Math.max(0, Math.min(h.text.length, b.ch + c * (l ? 2 : 1))), -c);
                }
            } else if (e) {
                g = f$(a.cm, h, b, c);
            } else {
                g = fY(h, b, c);
            }
            if (g == null) {
                if (!f && j()) {
                    b = fZ(e, a.cm, h, b.line, i);
                } else {
                    return false;
                }
            } else {
                b = g;
            }
            return true;
        }
        if (d == "char" || d == "codepoint") {
            k();
        } else if (d == "column") {
            k(true);
        } else if (d == "word" || d == "group") {
            var l = null, m = d == "group";
            var n = a.cm && a.cm.getHelper(b, "wordChars");
            for(var o = true;; o = false){
                if (c < 0 && !k(!o)) {
                    break;
                }
                var p = h.text.charAt(b.ch) || "\n";
                var q = ac(p, n) ? "w" : m && p == "\n" ? "n" : !m || /\s/.test(p) ? null : "p";
                if (m && !o && !q) {
                    q = "s";
                }
                if (l && l != q) {
                    if (c < 0) {
                        c = 1;
                        k();
                        b.sticky = "after";
                    }
                    break;
                }
                if (q) {
                    l = q;
                }
                if (c > 0 && !k(!o)) {
                    break;
                }
            }
        }
        var r = e6(a, b, f, g, true);
        if (a6(f, r)) {
            r.hitSide = true;
        }
        return r;
    }
    function gR(a, b, c, d) {
        var e = a.doc, f = b.left, g;
        if (d == "page") {
            var h = Math.min(a.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            var i = Math.max(h - 0.5 * c7(a.display), 3);
            g = (c > 0 ? b.bottom : b.top) + c * i;
        } else if (d == "line") {
            g = c > 0 ? b.bottom + 3 : b.top - 3;
        }
        var j;
        for(;;){
            j = c_(a, f, g);
            if (!j.outside) {
                break;
            }
            if (c < 0 ? g <= 0 : g >= e.height) {
                j.hitSide = true;
                break;
            }
            g += c * 5;
        }
        return j;
    }
    var gS = function(a) {
        this.cm = a;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new N();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
    };
    gS.prototype.init = function(a) {
        var b = this;
        var c = this, d = c.cm;
        var e = (c.div = a.lineDiv);
        e.contentEditable = true;
        gN(e, d.options.spellcheck, d.options.autocorrect, d.options.autocapitalize);
        function f(a) {
            for(var b = a.target; b; b = b.parentNode){
                if (b == e) {
                    return true;
                }
                if (/\bCodeMirror-(?:line)?widget\b/.test(b.className)) {
                    break;
                }
            }
            return false;
        }
        ao(e, "paste", function(a) {
            if (!f(a) || as(d, a) || gK(a, d)) {
                return;
            }
            if (h <= 11) {
                setTimeout(d1(d, function() {
                    return b.updateFromDOM();
                }), 20);
            }
        });
        ao(e, "compositionstart", function(a) {
            b.composing = {
                data: a.data,
                done: false
            };
        });
        ao(e, "compositionupdate", function(a) {
            if (!b.composing) {
                b.composing = {
                    data: a.data,
                    done: false
                };
            }
        });
        ao(e, "compositionend", function(a) {
            if (b.composing) {
                if (a.data != b.composing.data) {
                    b.readFromDOMSoon();
                }
                b.composing.done = true;
            }
        });
        ao(e, "touchstart", function() {
            return c.forceCompositionEnd();
        });
        ao(e, "input", function() {
            if (!b.composing) {
                b.readFromDOMSoon();
            }
        });
        function g(a) {
            if (!f(a) || as(d, a)) {
                return;
            }
            if (d.somethingSelected()) {
                gI({
                    lineWise: false,
                    text: d.getSelections()
                });
                if (a.type == "cut") {
                    d.replaceSelection("", null, "cut");
                }
            } else if (!d.options.lineWiseCopyCut) {
                return;
            } else {
                var b = gM(d);
                gI({
                    lineWise: true,
                    text: b.text
                });
                if (a.type == "cut") {
                    d.operation(function() {
                        d.setSelections(b.ranges, 0, R);
                        d.replaceSelection("", null, "cut");
                    });
                }
            }
            if (a.clipboardData) {
                a.clipboardData.clearData();
                var g = gH.text.join("\n");
                a.clipboardData.setData("Text", g);
                if (a.clipboardData.getData("Text") == g) {
                    a.preventDefault();
                    return;
                }
            }
            var h = gO(), i = h.firstChild;
            d.display.lineSpace.insertBefore(h, d.display.lineSpace.firstChild);
            i.value = gH.text.join("\n");
            var j = G();
            J(i);
            setTimeout(function() {
                d.display.lineSpace.removeChild(h);
                j.focus();
                if (j == e) {
                    c.showPrimarySelection();
                }
            }, 50);
        }
        ao(e, "copy", g);
        ao(e, "cut", g);
    };
    gS.prototype.screenReaderLabelChanged = function(a) {
        if (a) {
            this.div.setAttribute("aria-label", a);
        } else {
            this.div.removeAttribute("aria-label");
        }
    };
    gS.prototype.prepareSelection = function() {
        var a = dm(this.cm, false);
        a.focus = G() == this.div;
        return a;
    };
    gS.prototype.showSelection = function(a, b) {
        if (!a || !this.cm.display.view.length) {
            return;
        }
        if (a.focus || b) {
            this.showPrimarySelection();
        }
        this.showMultipleSelections(a);
    };
    gS.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    };
    gS.prototype.showPrimarySelection = function() {
        var a = this.getSelection(), b = this.cm, d = b.doc.sel.primary();
        var e = d.from(), f = d.to();
        if (b.display.viewTo == b.display.viewFrom || e.line >= b.display.viewTo || f.line < b.display.viewFrom) {
            a.removeAllRanges();
            return;
        }
        var g = gX(b, a.anchorNode, a.anchorOffset);
        var h = gX(b, a.focusNode, a.focusOffset);
        if (g && !g.bad && h && !h.bad && a5(a9(g, h), e) == 0 && a5(a8(g, h), f) == 0) {
            return;
        }
        var i = b.display.view;
        var j = (e.line >= b.display.viewFrom && gT(b, e)) || {
            node: i[0].measure.map[2],
            offset: 0
        };
        var k = f.line < b.display.viewTo && gT(b, f);
        if (!k) {
            var l = i[i.length - 1].measure;
            var m = l.maps ? l.maps[l.maps.length - 1] : l.map;
            k = {
                node: m[m.length - 1],
                offset: m[m.length - 2] - m[m.length - 3]
            };
        }
        if (!j || !k) {
            a.removeAllRanges();
            return;
        }
        var n = a.rangeCount && a.getRangeAt(0), o;
        try {
            o = E(j.node, j.offset, k.offset, k.node);
        } catch (p) {}
        if (o) {
            if (!c && b.state.focused) {
                a.collapse(j.node, j.offset);
                if (!o.collapsed) {
                    a.removeAllRanges();
                    a.addRange(o);
                }
            } else {
                a.removeAllRanges();
                a.addRange(o);
            }
            if (n && a.anchorNode == null) {
                a.addRange(n);
            } else if (c) {
                this.startGracePeriod();
            }
        }
        this.rememberSelection();
    };
    gS.prototype.startGracePeriod = function() {
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
    gS.prototype.showMultipleSelections = function(a) {
        B(this.cm.display.cursorDiv, a.cursors);
        B(this.cm.display.selectionDiv, a.selection);
    };
    gS.prototype.rememberSelection = function() {
        var a = this.getSelection();
        this.lastAnchorNode = a.anchorNode;
        this.lastAnchorOffset = a.anchorOffset;
        this.lastFocusNode = a.focusNode;
        this.lastFocusOffset = a.focusOffset;
    };
    gS.prototype.selectionInEditor = function() {
        var a = this.getSelection();
        if (!a.rangeCount) {
            return false;
        }
        var b = a.getRangeAt(0).commonAncestorContainer;
        return F(this.div, b);
    };
    gS.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || G() != this.div) {
                this.showSelection(this.prepareSelection(), true);
            }
            this.div.focus();
        }
    };
    gS.prototype.blur = function() {
        this.div.blur();
    };
    gS.prototype.getField = function() {
        return this.div;
    };
    gS.prototype.supportsTouch = function() {
        return true;
    };
    gS.prototype.receivedFocus = function() {
        var a = this;
        var b = this;
        if (this.selectionInEditor()) {
            setTimeout(function() {
                return a.pollSelection();
            }, 20);
        } else {
            d0(this.cm, function() {
                return (b.cm.curOp.selectionChanged = true);
            });
        }
        function c() {
            if (b.cm.state.focused) {
                b.pollSelection();
                b.polling.set(b.cm.options.pollInterval, c);
            }
        }
        this.polling.set(this.cm.options.pollInterval, c);
    };
    gS.prototype.selectionChanged = function() {
        var a = this.getSelection();
        return (a.anchorNode != this.lastAnchorNode || a.anchorOffset != this.lastAnchorOffset || a.focusNode != this.lastFocusNode || a.focusOffset != this.lastFocusOffset);
    };
    gS.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return;
        }
        var a = this.getSelection(), b = this.cm;
        if (q && k && this.cm.display.gutterSpecs.length && gU(a.anchorNode)) {
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
        var c = gX(b, a.anchorNode, a.anchorOffset);
        var d = gX(b, a.focusNode, a.focusOffset);
        if (c && d) {
            d0(b, function() {
                e0(b.doc, eu(c, d), R);
                if (c.bad || d.bad) {
                    b.curOp.selectionChanged = true;
                }
            });
        }
    };
    gS.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
        }
        var a = this.cm, b = a.display, c = a.doc.sel.primary();
        var d = c.from(), e = c.to();
        if (d.ch == 0 && d.line > a.firstLine()) {
            d = a4(d.line - 1, aY(a.doc, d.line - 1).length);
        }
        if (e.ch == aY(a.doc, e.line).text.length && e.line < a.lastLine()) {
            e = a4(e.line + 1, 0);
        }
        if (d.line < b.viewFrom || e.line > b.viewTo - 1) {
            return false;
        }
        var f, g, h;
        if (d.line == b.viewFrom || (f = de(a, d.line)) == 0) {
            g = a0(b.view[0].line);
            h = b.view[0].node;
        } else {
            g = a0(b.view[f].line);
            h = b.view[f - 1].node.nextSibling;
        }
        var i = de(a, e.line);
        var j, k;
        if (i == b.view.length - 1) {
            j = b.viewTo - 1;
            k = b.lineDiv.lastChild;
        } else {
            j = a0(b.view[i + 1].line) - 1;
            k = b.view[i + 1].node.previousSibling;
        }
        if (!h) {
            return false;
        }
        var l = a.doc.splitLines(gW(a, h, k, g, j));
        var m = aZ(a.doc, a4(g, 0), a4(j, aY(a.doc, j).text.length));
        while(l.length > 1 && m.length > 1){
            if (X(l) == X(m)) {
                l.pop();
                m.pop();
                j--;
            } else if (l[0] == m[0]) {
                l.shift();
                m.shift();
                g++;
            } else {
                break;
            }
        }
        var n = 0, o = 0;
        var p = l[0], q = m[0], r = Math.min(p.length, q.length);
        while(n < r && p.charCodeAt(n) == q.charCodeAt(n)){
            ++n;
        }
        var s = X(l), t = X(m);
        var u = Math.min(s.length - (l.length == 1 ? n : 0), t.length - (m.length == 1 ? n : 0));
        while(o < u && s.charCodeAt(s.length - o - 1) == t.charCodeAt(t.length - o - 1)){
            ++o;
        }
        if (l.length == 1 && m.length == 1 && g == d.line) {
            while(n && n > d.ch && s.charCodeAt(s.length - o - 1) == t.charCodeAt(t.length - o - 1)){
                n--;
                o++;
            }
        }
        l[l.length - 1] = s.slice(0, s.length - o).replace(/^\u200b+/, "");
        l[0] = l[0].slice(n).replace(/\u200b+$/, "");
        var v = a4(g, n);
        var w = a4(j, m.length ? X(m).length - o : 0);
        if (l.length > 1 || l[0] || a5(v, w)) {
            fg(a.doc, l, v, w, "+input");
            return true;
        }
    };
    gS.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    };
    gS.prototype.reset = function() {
        this.forceCompositionEnd();
    };
    gS.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
            return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
    };
    gS.prototype.readFromDOMSoon = function() {
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
    gS.prototype.updateFromDOM = function() {
        var a = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
            d0(this.cm, function() {
                return df(a.cm);
            });
        }
    };
    gS.prototype.setUneditable = function(a) {
        a.contentEditable = "false";
    };
    gS.prototype.onKeyPress = function(a) {
        if (a.charCode == 0 || this.composing) {
            return;
        }
        a.preventDefault();
        if (!this.cm.isReadOnly()) {
            d1(this.cm, gJ)(this.cm, String.fromCharCode(a.charCode == null ? a.keyCode : a.charCode), 0);
        }
    };
    gS.prototype.readOnlyChanged = function(a) {
        this.div.contentEditable = String(a != "nocursor");
    };
    gS.prototype.onContextMenu = function() {};
    gS.prototype.resetPosition = function() {};
    gS.prototype.needsContentAttribute = true;
    function gT(a, b) {
        var c = cH(a, b.line);
        if (!c || c.hidden) {
            return null;
        }
        var d = aY(a.doc, b.line);
        var e = cE(c, d, b.line);
        var f = am(d, a.doc.direction), g = "left";
        if (f) {
            var h = ak(f, b.ch);
            g = h % 2 ? "right" : "left";
        }
        var i = cL(e.map, b.ch, g);
        i.offset = i.collapse == "right" ? i.end : i.start;
        return i;
    }
    function gU(a) {
        for(var b = a; b; b = b.parentNode){
            if (/CodeMirror-gutter-wrapper/.test(b.className)) {
                return true;
            }
        }
        return false;
    }
    function gV(a, b) {
        if (b) {
            a.bad = true;
        }
        return a;
    }
    function gW(a, b, c, d, e) {
        var f = "", g = false, h = a.doc.lineSeparator(), i = false;
        function j(a) {
            return function(b) {
                return b.id == a;
            };
        }
        function k() {
            if (g) {
                f += h;
                if (i) {
                    f += h;
                }
                g = i = false;
            }
        }
        function l(a) {
            if (a) {
                k();
                f += a;
            }
        }
        function m(b) {
            if (b.nodeType == 1) {
                var c = b.getAttribute("cm-text");
                if (c) {
                    l(c);
                    return;
                }
                var f = b.getAttribute("cm-marker"), n;
                if (f) {
                    var o = a.findMarks(a4(d, 0), a4(e + 1, 0), j(+f));
                    if (o.length && (n = o[0].find(0))) {
                        l(aZ(a.doc, n.from, n.to).join(h));
                    }
                    return;
                }
                if (b.getAttribute("contenteditable") == "false") {
                    return;
                }
                var p = /^(pre|div|p|li|table|br)$/i.test(b.nodeName);
                if (!/^br$/i.test(b.nodeName) && b.textContent.length == 0) {
                    return;
                }
                if (p) {
                    k();
                }
                for(var q = 0; q < b.childNodes.length; q++){
                    m(b.childNodes[q]);
                }
                if (/^(pre|p)$/i.test(b.nodeName)) {
                    i = true;
                }
                if (p) {
                    g = true;
                }
            } else if (b.nodeType == 3) {
                l(b.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
            }
        }
        for(;;){
            m(b);
            if (b == c) {
                break;
            }
            b = b.nextSibling;
            i = false;
        }
        return f;
    }
    function gX(a, b, c) {
        var d;
        if (b == a.display.lineDiv) {
            d = a.display.lineDiv.childNodes[c];
            if (!d) {
                return gV(a.clipPos(a4(a.display.viewTo - 1)), true);
            }
            b = null;
            c = 0;
        } else {
            for(d = b;; d = d.parentNode){
                if (!d || d == a.display.lineDiv) {
                    return null;
                }
                if (d.parentNode && d.parentNode == a.display.lineDiv) {
                    break;
                }
            }
        }
        for(var e = 0; e < a.display.view.length; e++){
            var f = a.display.view[e];
            if (f.node == d) {
                return gY(f, b, c);
            }
        }
    }
    function gY(a, b, c) {
        var d = a.text.firstChild, e = false;
        if (!b || !F(d, b)) {
            return gV(a4(a0(a.line), 0), true);
        }
        if (b == d) {
            e = true;
            b = d.childNodes[c];
            c = 0;
            if (!b) {
                var f = a.rest ? X(a.rest) : a.line;
                return gV(a4(a0(f), f.text.length), e);
            }
        }
        var g = b.nodeType == 3 ? b : null, h = b;
        if (!g && b.childNodes.length == 1 && b.firstChild.nodeType == 3) {
            g = b.firstChild;
            if (c) {
                c = g.nodeValue.length;
            }
        }
        while(h.parentNode != d){
            h = h.parentNode;
        }
        var i = a.measure, j = i.maps;
        function k(b, c, d) {
            for(var e = -1; e < (j ? j.length : 0); e++){
                var f = e < 0 ? i.map : j[e];
                for(var g = 0; g < f.length; g += 3){
                    var h = f[g + 2];
                    if (h == b || h == c) {
                        var k = a0(e < 0 ? a.line : a.rest[e]);
                        var l = f[g] + d;
                        if (d < 0 || h != b) {
                            l = f[g + (d ? 1 : 0)];
                        }
                        return a4(k, l);
                    }
                }
            }
        }
        var l = k(g, h, c);
        if (l) {
            return gV(l, e);
        }
        for(var m = h.nextSibling, n = g ? g.nodeValue.length - c : 0; m; m = m.nextSibling){
            l = k(m, m.firstChild, 0);
            if (l) {
                return gV(a4(l.line, l.ch - n), e);
            } else {
                n += m.textContent.length;
            }
        }
        for(var o = h.previousSibling, p = c; o; o = o.previousSibling){
            l = k(o, o.firstChild, -1);
            if (l) {
                return gV(a4(l.line, l.ch + p), e);
            } else {
                p += o.textContent.length;
            }
        }
    }
    var gZ = function(a) {
        this.cm = a;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new N();
        this.hasSelection = false;
        this.composing = null;
    };
    gZ.prototype.init = function(a) {
        var b = this;
        var c = this, d = this.cm;
        this.createField(a);
        var e = this.textarea;
        a.wrapper.insertBefore(this.wrapper, a.wrapper.firstChild);
        if (p) {
            e.style.width = "0px";
        }
        ao(e, "input", function() {
            if (g && h >= 9 && b.hasSelection) {
                b.hasSelection = null;
            }
            c.poll();
        });
        ao(e, "paste", function(a) {
            if (as(d, a) || gK(a, d)) {
                return;
            }
            d.state.pasteIncoming = +new Date();
            c.fastPoll();
        });
        function f(a) {
            if (as(d, a)) {
                return;
            }
            if (d.somethingSelected()) {
                gI({
                    lineWise: false,
                    text: d.getSelections()
                });
            } else if (!d.options.lineWiseCopyCut) {
                return;
            } else {
                var b = gM(d);
                gI({
                    lineWise: true,
                    text: b.text
                });
                if (a.type == "cut") {
                    d.setSelections(b.ranges, null, R);
                } else {
                    c.prevInput = "";
                    e.value = b.text.join("\n");
                    J(e);
                }
            }
            if (a.type == "cut") {
                d.state.cutIncoming = +new Date();
            }
        }
        ao(e, "cut", f);
        ao(e, "copy", f);
        ao(a.scroller, "paste", function(b) {
            if (cw(a, b) || as(d, b)) {
                return;
            }
            if (!e.dispatchEvent) {
                d.state.pasteIncoming = +new Date();
                c.focus();
                return;
            }
            var f = new Event("paste");
            f.clipboardData = b.clipboardData;
            e.dispatchEvent(f);
        });
        ao(a.lineSpace, "selectstart", function(b) {
            if (!cw(a, b)) {
                aw(b);
            }
        });
        ao(e, "compositionstart", function() {
            var a = d.getCursor("from");
            if (c.composing) {
                c.composing.range.clear();
            }
            c.composing = {
                start: a,
                range: d.markText(a, d.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        });
        ao(e, "compositionend", function() {
            if (c.composing) {
                c.poll();
                c.composing.range.clear();
                c.composing = null;
            }
        });
    };
    gZ.prototype.createField = function(a) {
        this.wrapper = gO();
        this.textarea = this.wrapper.firstChild;
    };
    gZ.prototype.screenReaderLabelChanged = function(a) {
        if (a) {
            this.textarea.setAttribute("aria-label", a);
        } else {
            this.textarea.removeAttribute("aria-label");
        }
    };
    gZ.prototype.prepareSelection = function() {
        var a = this.cm, b = a.display, c = a.doc;
        var d = dm(a);
        if (a.options.moveInputWithCursor) {
            var e = cY(a, c.sel.primary().head, "div");
            var f = b.wrapper.getBoundingClientRect(), g = b.lineDiv.getBoundingClientRect();
            d.teTop = Math.max(0, Math.min(b.wrapper.clientHeight - 10, e.top + g.top - f.top));
            d.teLeft = Math.max(0, Math.min(b.wrapper.clientWidth - 10, e.left + g.left - f.left));
        }
        return d;
    };
    gZ.prototype.showSelection = function(a) {
        var b = this.cm, c = b.display;
        B(c.cursorDiv, a.cursors);
        B(c.selectionDiv, a.selection);
        if (a.teTop != null) {
            this.wrapper.style.top = a.teTop + "px";
            this.wrapper.style.left = a.teLeft + "px";
        }
    };
    gZ.prototype.reset = function(a) {
        if (this.contextMenuPending || this.composing) {
            return;
        }
        var b = this.cm;
        if (b.somethingSelected()) {
            this.prevInput = "";
            var c = b.getSelection();
            this.textarea.value = c;
            if (b.state.focused) {
                J(this.textarea);
            }
            if (g && h >= 9) {
                this.hasSelection = c;
            }
        } else if (!a) {
            this.prevInput = this.textarea.value = "";
            if (g && h >= 9) {
                this.hasSelection = null;
            }
        }
    };
    gZ.prototype.getField = function() {
        return this.textarea;
    };
    gZ.prototype.supportsTouch = function() {
        return false;
    };
    gZ.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!r || G() != this.textarea)) {
            try {
                this.textarea.focus();
            } catch (a) {}
        }
    };
    gZ.prototype.blur = function() {
        this.textarea.blur();
    };
    gZ.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
    };
    gZ.prototype.receivedFocus = function() {
        this.slowPoll();
    };
    gZ.prototype.slowPoll = function() {
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
    gZ.prototype.fastPoll = function() {
        var a = false, b = this;
        b.pollingFast = true;
        function c() {
            var d = b.poll();
            if (!d && !a) {
                a = true;
                b.polling.set(60, c);
            } else {
                b.pollingFast = false;
                b.slowPoll();
            }
        }
        b.polling.set(20, c);
    };
    gZ.prototype.poll = function() {
        var a = this;
        var b = this.cm, c = this.textarea, d = this.prevInput;
        if (this.contextMenuPending || !b.state.focused || (aI(c) && !d && !this.composing) || b.isReadOnly() || b.options.disableInput || b.state.keySeq) {
            return false;
        }
        var e = c.value;
        if (e == d && !b.somethingSelected()) {
            return false;
        }
        if ((g && h >= 9 && this.hasSelection === e) || (s && /[\uf700-\uf7ff]/.test(e))) {
            b.display.input.reset();
            return false;
        }
        if (b.doc.sel == b.display.selForContextMenu) {
            var f = e.charCodeAt(0);
            if (f == 0x200b && !d) {
                d = "\u200b";
            }
            if (f == 0x21da) {
                this.reset();
                return this.cm.execCommand("undo");
            }
        }
        var i = 0, j = Math.min(d.length, e.length);
        while(i < j && d.charCodeAt(i) == e.charCodeAt(i)){
            ++i;
        }
        d0(b, function() {
            gJ(b, e.slice(i), d.length - i, null, a.composing ? "*compose" : null);
            if (e.length > 1000 || e.indexOf("\n") > -1) {
                c.value = a.prevInput = "";
            } else {
                a.prevInput = e;
            }
            if (a.composing) {
                a.composing.range.clear();
                a.composing.range = b.markText(a.composing.start, b.getCursor("to"), {
                    className: "CodeMirror-composing"
                });
            }
        });
        return true;
    };
    gZ.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) {
            this.pollingFast = false;
        }
    };
    gZ.prototype.onKeyPress = function() {
        if (g && h >= 9) {
            this.hasSelection = null;
        }
        this.fastPoll();
    };
    gZ.prototype.onContextMenu = function(a) {
        var b = this, c = b.cm, d = c.display, e = b.textarea;
        if (b.contextMenuPending) {
            b.contextMenuPending();
        }
        var f = dd(c, a), j = d.scroller.scrollTop;
        if (!f || l) {
            return;
        }
        var k = c.options.resetSelectionOnContextMenu;
        if (k && c.doc.sel.contains(f) == -1) {
            d1(c, e0)(c.doc, eu(f), R);
        }
        var m = e.style.cssText, n = b.wrapper.style.cssText;
        var o = b.wrapper.offsetParent.getBoundingClientRect();
        b.wrapper.style.cssText = "position: static";
        e.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (a.clientY - o.top - 5) + "px; left: " + (a.clientX - o.left - 5) + "px;\n      z-index: 1000; background: " + (g ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var p;
        if (i) {
            p = window.scrollY;
        }
        d.input.focus();
        if (i) {
            window.scrollTo(null, p);
        }
        d.input.reset();
        if (!c.somethingSelected()) {
            e.value = b.prevInput = " ";
        }
        b.contextMenuPending = r;
        d.selForContextMenu = c.doc.sel;
        clearTimeout(d.detectingSelectAll);
        function q() {
            if (e.selectionStart != null) {
                var a = c.somethingSelected();
                var f = "\u200b" + (a ? e.value : "");
                e.value = "\u21da";
                e.value = f;
                b.prevInput = a ? "" : "\u200b";
                e.selectionStart = 1;
                e.selectionEnd = f.length;
                d.selForContextMenu = c.doc.sel;
            }
        }
        function r() {
            if (b.contextMenuPending != r) {
                return;
            }
            b.contextMenuPending = false;
            b.wrapper.style.cssText = n;
            e.style.cssText = m;
            if (g && h < 9) {
                d.scrollbars.setScrollTop((d.scroller.scrollTop = j));
            }
            if (e.selectionStart != null) {
                if (!g || (g && h < 9)) {
                    q();
                }
                var a = 0, f = function() {
                    if (d.selForContextMenu == c.doc.sel && e.selectionStart == 0 && e.selectionEnd > 0 && b.prevInput == "\u200b") {
                        d1(c, e8)(c);
                    } else if (a++ < 10) {
                        d.detectingSelectAll = setTimeout(f, 500);
                    } else {
                        d.selForContextMenu = null;
                        d.input.reset();
                    }
                };
                d.detectingSelectAll = setTimeout(f, 200);
            }
        }
        if (g && h >= 9) {
            q();
        }
        if (x) {
            az(a);
            var s = function() {
                aq(window, "mouseup", s);
                setTimeout(r, 20);
            };
            ao(window, "mouseup", s);
        } else {
            setTimeout(r, 50);
        }
    };
    gZ.prototype.readOnlyChanged = function(a) {
        if (!a) {
            this.reset();
        }
        this.textarea.disabled = a == "nocursor";
        this.textarea.readOnly = !!a;
    };
    gZ.prototype.setUneditable = function() {};
    gZ.prototype.needsContentAttribute = false;
    function g$(a, b) {
        b = b ? L(b) : {};
        b.value = a.value;
        if (!b.tabindex && a.tabIndex) {
            b.tabindex = a.tabIndex;
        }
        if (!b.placeholder && a.placeholder) {
            b.placeholder = a.placeholder;
        }
        if (b.autofocus == null) {
            var c = G();
            b.autofocus = c == a || (a.getAttribute("autofocus") != null && c == document.body);
        }
        function d() {
            a.value = i.getValue();
        }
        var e;
        if (a.form) {
            ao(a.form, "submit", d);
            if (!b.leaveSubmitMethodAlone) {
                var f = a.form;
                e = f.submit;
                try {
                    var g = (f.submit = function() {
                        d();
                        f.submit = e;
                        f.submit();
                        f.submit = g;
                    });
                } catch (h) {}
            }
        }
        b.finishInit = function(c) {
            c.save = d;
            c.getTextArea = function() {
                return a;
            };
            c.toTextArea = function() {
                c.toTextArea = isNaN;
                d();
                a.parentNode.removeChild(c.getWrapperElement());
                a.style.display = "";
                if (a.form) {
                    aq(a.form, "submit", d);
                    if (!b.leaveSubmitMethodAlone && typeof a.form.submit == "function") {
                        a.form.submit = e;
                    }
                }
            };
        };
        a.style.display = "none";
        var i = gD(function(b) {
            return a.parentNode.insertBefore(b, a.nextSibling);
        }, b);
        return i;
    }
    function g_(a) {
        a.off = aq;
        a.on = ao;
        a.wheelEventPixels = ep;
        a.Doc = fz;
        a.splitLines = aH;
        a.countColumn = M;
        a.findColumn = U;
        a.isWordChar = ab;
        a.Pass = Q;
        a.signal = ar;
        a.Line = bZ;
        a.changeEnd = ev;
        a.scrollbarModel = dR;
        a.Pos = a4;
        a.cmpPos = a5;
        a.modes = aM;
        a.mimeModes = aN;
        a.resolveMode = aQ;
        a.getMode = aR;
        a.modeExtensions = aS;
        a.extendMode = aT;
        a.copyState = aU;
        a.startState = aW;
        a.innerMode = aV;
        a.commands = f_;
        a.keyMap = fO;
        a.keyName = fU;
        a.isModifierKey = fS;
        a.lookupKey = fR;
        a.normalizeKeyMap = fQ;
        a.StringStream = aX;
        a.SharedTextMarker = ft;
        a.TextMarker = fr;
        a.LineWidget = fn;
        a.e_preventDefault = aw;
        a.e_stopPropagation = ax;
        a.e_stop = az;
        a.addClass = H;
        a.contains = F;
        a.rmClass = z;
        a.keyNames = fK;
    }
    gA(gD);
    gP(gD);
    var g0 = "iter insert remove copy getEditor constructor".split(" ");
    for(var g1 in fz.prototype){
        if (fz.prototype.hasOwnProperty(g1) && O(g0, g1) < 0) {
            gD.prototype[g1] = (function(a) {
                return function() {
                    return a.apply(this.doc, arguments);
                };
            })(fz.prototype[g1]);
        }
    }
    av(fz);
    gD.inputStyles = {
        textarea: gZ,
        contenteditable: gS
    };
    gD.defineMode = function(a) {
        if (!gD.defaults.mode && a != "null") {
            gD.defaults.mode = a;
        }
        aO.apply(this, arguments);
    };
    gD.defineMIME = aP;
    gD.defineMode("null", function() {
        return {
            token: function(a) {
                return a.skipToEnd();
            }
        };
    });
    gD.defineMIME("text/plain", "null");
    gD.defineExtension = function(a, b) {
        gD.prototype[a] = b;
    };
    gD.defineDocExtension = function(a, b) {
        fz.prototype[a] = b;
    };
    gD.fromTextArea = g$;
    g_(gD);
    gD.version = "5.65.1";
    return gD;
});
