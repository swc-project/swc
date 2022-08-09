(function(e, t) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = t()) : typeof define === "function" && define.amd ? define(t) : ((e = e || self), (e.CodeMirror = t()));
})(this, function() {
    "use strict";
    var e = navigator.userAgent;
    var t = navigator.platform;
    var i = /gecko\/\d/i.test(e);
    var r = /MSIE \d/.test(e);
    var n = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e);
    var o = /Edge\/(\d+)/.exec(e);
    var l = r || n || o;
    var s = l && (r ? document.documentMode || 6 : +(o || n)[1]);
    var a = !o && /WebKit\//.test(e);
    var f = a && /Qt\/\d+\.\d+/.test(e);
    var u = !o && /Chrome\//.test(e);
    var c = /Opera\//.test(e);
    var h = /Apple Computer/.test(navigator.vendor);
    var d = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e);
    var p = /PhantomJS/.test(e);
    var v = h && (/Mobile\/\w+/.test(e) || navigator.maxTouchPoints > 2);
    var g = /Android/.test(e);
    var m = v || g || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e);
    var $ = v || /Mac/.test(t);
    var y = /\bCrOS\b/.test(e);
    var _ = /win/i.test(t);
    var w = c && e.match(/Version\/(\d*\.\d*)/);
    if (w) {
        w = Number(w[1]);
    }
    if (w && w >= 15) {
        c = false;
        a = true;
    }
    var b = $ && (f || (c && (w == null || w < 12.11)));
    var x = i || (l && s >= 9);
    function C(e) {
        return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*");
    }
    var S = function(e, t) {
        var i = e.className;
        var r = C(t).exec(i);
        if (r) {
            var n = i.slice(r.index + r[0].length);
            e.className = i.slice(0, r.index) + (n ? r[1] + n : "");
        }
    };
    function k(e) {
        for(var t = e.childNodes.length; t > 0; --t){
            e.removeChild(e.firstChild);
        }
        return e;
    }
    function T(e, t) {
        return k(e).appendChild(t);
    }
    function L(e, t, i, r) {
        var n = document.createElement(e);
        if (i) {
            n.className = i;
        }
        if (r) {
            n.style.cssText = r;
        }
        if (typeof t == "string") {
            n.appendChild(document.createTextNode(t));
        } else if (t) {
            for(var o = 0; o < t.length; ++o){
                n.appendChild(t[o]);
            }
        }
        return n;
    }
    function O(e, t, i, r) {
        var n = L(e, t, i, r);
        n.setAttribute("role", "presentation");
        return n;
    }
    var W;
    if (document.createRange) {
        W = function(e, t, i, r) {
            var n = document.createRange();
            n.setEnd(r || e, i);
            n.setStart(e, t);
            return n;
        };
    } else {
        W = function(e, t, i) {
            var r = document.body.createTextRange();
            try {
                r.moveToElementText(e.parentNode);
            } catch (n) {
                return r;
            }
            r.collapse(true);
            r.moveEnd("character", i);
            r.moveStart("character", t);
            return r;
        };
    }
    function N(e, t) {
        if (t.nodeType == 3) {
            t = t.parentNode;
        }
        if (e.contains) {
            return e.contains(t);
        }
        do {
            if (t.nodeType == 11) {
                t = t.host;
            }
            if (t == e) {
                return true;
            }
        }while ((t = t.parentNode))
    }
    function A() {
        var e;
        try {
            e = document.activeElement;
        } catch (t) {
            e = document.body || null;
        }
        while(e && e.shadowRoot && e.shadowRoot.activeElement){
            e = e.shadowRoot.activeElement;
        }
        return e;
    }
    function D(e, t) {
        var i = e.className;
        if (!C(t).test(i)) {
            e.className += (i ? " " : "") + t;
        }
    }
    function H(e, t) {
        var i = e.split(" ");
        for(var r = 0; r < i.length; r++){
            if (i[r] && !C(i[r]).test(t)) {
                t += " " + i[r];
            }
        }
        return t;
    }
    var F = function(e) {
        e.select();
    };
    if (v) {
        F = function(e) {
            e.selectionStart = 0;
            e.selectionEnd = e.value.length;
        };
    } else if (l) {
        F = function(e) {
            try {
                e.select();
            } catch (t) {}
        };
    }
    function M(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return function() {
            return e.apply(null, t);
        };
    }
    function P(e, t, i) {
        if (!t) {
            t = {};
        }
        for(var r in e){
            if (e.hasOwnProperty(r) && (i !== false || !t.hasOwnProperty(r))) {
                t[r] = e[r];
            }
        }
        return t;
    }
    function z(e, t, i, r, n) {
        if (t == null) {
            t = e.search(/[^\s\u00a0]/);
            if (t == -1) {
                t = e.length;
            }
        }
        for(var o = r || 0, l = n || 0;;){
            var s = e.indexOf("\t", o);
            if (s < 0 || s >= t) {
                return l + (t - o);
            }
            l += s - o;
            l += i - (l % i);
            o = s + 1;
        }
    }
    var E = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = M(this.onTimeout, this);
    };
    E.prototype.onTimeout = function(e) {
        e.id = 0;
        if (e.time <= +new Date()) {
            e.f();
        } else {
            setTimeout(e.handler, e.time - +new Date());
        }
    };
    E.prototype.set = function(e, t) {
        this.f = t;
        var i = +new Date() + e;
        if (!this.id || i < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, e);
            this.time = i;
        }
    };
    function I(e, t) {
        for(var i = 0; i < e.length; ++i){
            if (e[i] == t) {
                return i;
            }
        }
        return -1;
    }
    var R = 50;
    var B = {
        toString: function() {
            return "CodeMirror.Pass";
        }
    };
    var G = {
        scroll: false
    }, U = {
        origin: "*mouse"
    }, V = {
        origin: "+move"
    };
    function K(e, t, i) {
        for(var r = 0, n = 0;;){
            var o = e.indexOf("\t", r);
            if (o == -1) {
                o = e.length;
            }
            var l = o - r;
            if (o == e.length || n + l >= t) {
                return r + Math.min(l, t - n);
            }
            n += o - r;
            n += i - (n % i);
            r = o + 1;
            if (n >= t) {
                return r;
            }
        }
    }
    var X = [
        ""
    ];
    function Y(e) {
        while(X.length <= e){
            X.push(j(X) + " ");
        }
        return X[e];
    }
    function j(e) {
        return e[e.length - 1];
    }
    function q(e, t) {
        var i = [];
        for(var r = 0; r < e.length; r++){
            i[r] = t(e[r], r);
        }
        return i;
    }
    function Z(e, t, i) {
        var r = 0, n = i(t);
        while(r < e.length && i(e[r]) <= n){
            r++;
        }
        e.splice(r, 0, t);
    }
    function J() {}
    function Q(e, t) {
        var i;
        if (Object.create) {
            i = Object.create(e);
        } else {
            J.prototype = e;
            i = new J();
        }
        if (t) {
            P(t, i);
        }
        return i;
    }
    var ee = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function et(e) {
        return (/\w/.test(e) || (e > "\x80" && (e.toUpperCase() != e.toLowerCase() || ee.test(e))));
    }
    function ei(e, t) {
        if (!t) {
            return et(e);
        }
        if (t.source.indexOf("\\w") > -1 && et(e)) {
            return true;
        }
        return t.test(e);
    }
    function er(e) {
        for(var t in e){
            if (e.hasOwnProperty(t) && e[t]) {
                return false;
            }
        }
        return true;
    }
    var en = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function eo(e) {
        return e.charCodeAt(0) >= 768 && en.test(e);
    }
    function el(e, t, i) {
        while((i < 0 ? t > 0 : t < e.length) && eo(e.charAt(t))){
            t += i;
        }
        return t;
    }
    function es(e, t, i) {
        var r = t > i ? -1 : 1;
        for(;;){
            if (t == i) {
                return t;
            }
            var n = (t + i) / 2, o = r < 0 ? Math.ceil(n) : Math.floor(n);
            if (o == t) {
                return e(o) ? t : i;
            }
            if (e(o)) {
                i = o;
            } else {
                t = o + r;
            }
        }
    }
    function ea(e, t, i, r) {
        if (!e) {
            return r(t, i, "ltr", 0);
        }
        var n = false;
        for(var o = 0; o < e.length; ++o){
            var l = e[o];
            if ((l.from < i && l.to > t) || (t == i && l.to == t)) {
                r(Math.max(l.from, t), Math.min(l.to, i), l.level == 1 ? "rtl" : "ltr", o);
                n = true;
            }
        }
        if (!n) {
            r(t, i, "ltr");
        }
    }
    var ef = null;
    function eu(e, t, i) {
        var r;
        ef = null;
        for(var n = 0; n < e.length; ++n){
            var o = e[n];
            if (o.from < t && o.to > t) {
                return n;
            }
            if (o.to == t) {
                if (o.from != o.to && i == "before") {
                    r = n;
                } else {
                    ef = n;
                }
            }
            if (o.from == t) {
                if (o.from != o.to && i != "before") {
                    r = n;
                } else {
                    ef = n;
                }
            }
        }
        return r != null ? r : ef;
    }
    var ec = (function() {
        var e = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var t = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function i(i) {
            if (i <= 0xf7) {
                return e.charAt(i);
            } else if (0x590 <= i && i <= 0x5f4) {
                return "R";
            } else if (0x600 <= i && i <= 0x6f9) {
                return t.charAt(i - 0x600);
            } else if (0x6ee <= i && i <= 0x8ac) {
                return "r";
            } else if (0x2000 <= i && i <= 0x200b) {
                return "w";
            } else if (i == 0x200c) {
                return "b";
            } else {
                return "L";
            }
        }
        var r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var n = /[stwN]/, o = /[LRr]/, l = /[Lb1n]/, s = /[1n]/;
        function a(e, t, i) {
            this.level = e;
            this.from = t;
            this.to = i;
        }
        return function(e, t) {
            var f = t == "ltr" ? "L" : "R";
            if (e.length == 0 || (t == "ltr" && !r.test(e))) {
                return false;
            }
            var u = e.length, c = [];
            for(var h = 0; h < u; ++h){
                c.push(i(e.charCodeAt(h)));
            }
            for(var d = 0, p = f; d < u; ++d){
                var v = c[d];
                if (v == "m") {
                    c[d] = p;
                } else {
                    p = v;
                }
            }
            for(var g = 0, m = f; g < u; ++g){
                var $ = c[g];
                if ($ == "1" && m == "r") {
                    c[g] = "n";
                } else if (o.test($)) {
                    m = $;
                    if ($ == "r") {
                        c[g] = "R";
                    }
                }
            }
            for(var y = 1, _ = c[0]; y < u - 1; ++y){
                var w = c[y];
                if (w == "+" && _ == "1" && c[y + 1] == "1") {
                    c[y] = "1";
                } else if (w == "," && _ == c[y + 1] && (_ == "1" || _ == "n")) {
                    c[y] = _;
                }
                _ = w;
            }
            for(var b = 0; b < u; ++b){
                var x = c[b];
                if (x == ",") {
                    c[b] = "N";
                } else if (x == "%") {
                    var C = void 0;
                    for(C = b + 1; C < u && c[C] == "%"; ++C){}
                    var S = (b && c[b - 1] == "!") || (C < u && c[C] == "1") ? "1" : "N";
                    for(var k = b; k < C; ++k){
                        c[k] = S;
                    }
                    b = C - 1;
                }
            }
            for(var T = 0, L = f; T < u; ++T){
                var O = c[T];
                if (L == "L" && O == "1") {
                    c[T] = "L";
                } else if (o.test(O)) {
                    L = O;
                }
            }
            for(var W = 0; W < u; ++W){
                if (n.test(c[W])) {
                    var N = void 0;
                    for(N = W + 1; N < u && n.test(c[N]); ++N){}
                    var A = (W ? c[W - 1] : f) == "L";
                    var D = (N < u ? c[N] : f) == "L";
                    var H = A == D ? (A ? "L" : "R") : f;
                    for(var F = W; F < N; ++F){
                        c[F] = H;
                    }
                    W = N - 1;
                }
            }
            var M = [], P;
            for(var z = 0; z < u;){
                if (l.test(c[z])) {
                    var E = z;
                    for(++z; z < u && l.test(c[z]); ++z){}
                    M.push(new a(0, E, z));
                } else {
                    var I = z, R = M.length, B = t == "rtl" ? 1 : 0;
                    for(++z; z < u && c[z] != "L"; ++z){}
                    for(var G = I; G < z;){
                        if (s.test(c[G])) {
                            if (I < G) {
                                M.splice(R, 0, new a(1, I, G));
                                R += B;
                            }
                            var U = G;
                            for(++G; G < z && s.test(c[G]); ++G){}
                            M.splice(R, 0, new a(2, U, G));
                            R += B;
                            I = G;
                        } else {
                            ++G;
                        }
                    }
                    if (I < z) {
                        M.splice(R, 0, new a(1, I, z));
                    }
                }
            }
            if (t == "ltr") {
                if (M[0].level == 1 && (P = e.match(/^\s+/))) {
                    M[0].from = P[0].length;
                    M.unshift(new a(0, 0, P[0].length));
                }
                if (j(M).level == 1 && (P = e.match(/\s+$/))) {
                    j(M).to -= P[0].length;
                    M.push(new a(0, u - P[0].length, u));
                }
            }
            return t == "rtl" ? M.reverse() : M;
        };
    })();
    function eh(e, t) {
        var i = e.order;
        if (i == null) {
            i = e.order = ec(e.text, t);
        }
        return i;
    }
    var ed = [];
    var ep = function(e, t, i) {
        if (e.addEventListener) {
            e.addEventListener(t, i, false);
        } else if (e.attachEvent) {
            e.attachEvent("on" + t, i);
        } else {
            var r = e._handlers || (e._handlers = {});
            r[t] = (r[t] || ed).concat(i);
        }
    };
    function ev(e, t) {
        return (e._handlers && e._handlers[t]) || ed;
    }
    function eg(e, t, i) {
        if (e.removeEventListener) {
            e.removeEventListener(t, i, false);
        } else if (e.detachEvent) {
            e.detachEvent("on" + t, i);
        } else {
            var r = e._handlers, n = r && r[t];
            if (n) {
                var o = I(n, i);
                if (o > -1) {
                    r[t] = n.slice(0, o).concat(n.slice(o + 1));
                }
            }
        }
    }
    function em(e, t) {
        var i = ev(e, t);
        if (!i.length) {
            return;
        }
        var r = Array.prototype.slice.call(arguments, 2);
        for(var n = 0; n < i.length; ++n){
            i[n].apply(null, r);
        }
    }
    function e$(e, t, i) {
        if (typeof t == "string") {
            t = {
                type: t,
                preventDefault: function() {
                    this.defaultPrevented = true;
                }
            };
        }
        em(e, i || t.type, e, t);
        return eC(t) || t.codemirrorIgnore;
    }
    function ey(e) {
        var t = e._handlers && e._handlers.cursorActivity;
        if (!t) {
            return;
        }
        var i = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []);
        for(var r = 0; r < t.length; ++r){
            if (I(i, t[r]) == -1) {
                i.push(t[r]);
            }
        }
    }
    function e_(e, t) {
        return ev(e, t).length > 0;
    }
    function ew(e) {
        e.prototype.on = function(e, t) {
            ep(this, e, t);
        };
        e.prototype.off = function(e, t) {
            eg(this, e, t);
        };
    }
    function eb(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    function ex(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
    function eC(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
    }
    function eS(e) {
        eb(e);
        ex(e);
    }
    function ek(e) {
        return e.target || e.srcElement;
    }
    function eT(e) {
        var t = e.which;
        if (t == null) {
            if (e.button & 1) {
                t = 1;
            } else if (e.button & 2) {
                t = 3;
            } else if (e.button & 4) {
                t = 2;
            }
        }
        if ($ && e.ctrlKey && t == 1) {
            t = 3;
        }
        return t;
    }
    var eL = (function() {
        if (l && s < 9) {
            return false;
        }
        var e = L("div");
        return "draggable" in e || "dragDrop" in e;
    })();
    var eO;
    function e0(e) {
        if (eO == null) {
            var t = L("span", "\u200b");
            T(e, L("span", [
                t,
                document.createTextNode("x")
            ]));
            if (e.firstChild.offsetHeight != 0) {
                eO = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(l && s < 8);
            }
        }
        var i = eO ? L("span", "\u200b") : L("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        i.setAttribute("cm-text", "");
        return i;
    }
    var eW;
    function eN(e) {
        if (eW != null) {
            return eW;
        }
        var t = T(e, document.createTextNode("A\u062eA"));
        var i = W(t, 0, 1).getBoundingClientRect();
        var r = W(t, 1, 2).getBoundingClientRect();
        k(e);
        if (!i || i.left == i.right) {
            return false;
        }
        return (eW = r.right - i.right < 3);
    }
    var eA = "\n\nb".split(/\n/).length != 3 ? function(e) {
        var t = 0, i = [], r = e.length;
        while(t <= r){
            var n = e.indexOf("\n", t);
            if (n == -1) {
                n = e.length;
            }
            var o = e.slice(t, e.charAt(n - 1) == "\r" ? n - 1 : n);
            var l = o.indexOf("\r");
            if (l != -1) {
                i.push(o.slice(0, l));
                t += l + 1;
            } else {
                i.push(o);
                t = n + 1;
            }
        }
        return i;
    } : function(e) {
        return e.split(/\r\n?|\n/);
    };
    var eD = window.getSelection ? function(e) {
        try {
            return e.selectionStart != e.selectionEnd;
        } catch (t) {
            return false;
        }
    } : function(e) {
        var t;
        try {
            t = e.ownerDocument.selection.createRange();
        } catch (i) {}
        if (!t || t.parentElement() != e) {
            return false;
        }
        return t.compareEndPoints("StartToEnd", t) != 0;
    };
    var eH = (function() {
        var e = L("div");
        if ("oncopy" in e) {
            return true;
        }
        e.setAttribute("oncopy", "return;");
        return typeof e.oncopy == "function";
    })();
    var eF = null;
    function eM(e) {
        if (eF != null) {
            return eF;
        }
        var t = T(e, L("span", "x"));
        var i = t.getBoundingClientRect();
        var r = W(t, 0, 1).getBoundingClientRect();
        return (eF = Math.abs(i.left - r.left) > 1);
    }
    var e1 = {}, eP = {};
    function ez(e, t) {
        if (arguments.length > 2) {
            t.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        e1[e] = t;
    }
    function eE(e, t) {
        eP[e] = t;
    }
    function eI(e) {
        if (typeof e == "string" && eP.hasOwnProperty(e)) {
            e = eP[e];
        } else if (e && typeof e.name == "string" && eP.hasOwnProperty(e.name)) {
            var t = eP[e.name];
            if (typeof t == "string") {
                t = {
                    name: t
                };
            }
            e = Q(t, e);
            e.name = t.name;
        } else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) {
            return eI("application/xml");
        } else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) {
            return eI("application/json");
        }
        if (typeof e == "string") {
            return {
                name: e
            };
        } else {
            return e || {
                name: "null"
            };
        }
    }
    function eR(e, t) {
        t = eI(t);
        var i = e1[t.name];
        if (!i) {
            return eR(e, "text/plain");
        }
        var r = i(e, t);
        if (e3.hasOwnProperty(t.name)) {
            var n = e3[t.name];
            for(var o in n){
                if (!n.hasOwnProperty(o)) {
                    continue;
                }
                if (r.hasOwnProperty(o)) {
                    r["_" + o] = r[o];
                }
                r[o] = n[o];
            }
        }
        r.name = t.name;
        if (t.helperType) {
            r.helperType = t.helperType;
        }
        if (t.modeProps) {
            for(var l in t.modeProps){
                r[l] = t.modeProps[l];
            }
        }
        return r;
    }
    var e3 = {};
    function e7(e, t) {
        var i = e3.hasOwnProperty(e) ? e3[e] : (e3[e] = {});
        P(t, i);
    }
    function eB(e, t) {
        if (t === true) {
            return t;
        }
        if (e.copyState) {
            return e.copyState(t);
        }
        var i = {};
        for(var r in t){
            var n = t[r];
            if (n instanceof Array) {
                n = n.concat([]);
            }
            i[r] = n;
        }
        return i;
    }
    function e4(e, t) {
        var i;
        while(e.innerMode){
            i = e.innerMode(t);
            if (!i || i.mode == e) {
                break;
            }
            t = i.state;
            e = i.mode;
        }
        return i || {
            mode: e,
            state: t
        };
    }
    function e6(e, t, i) {
        return e.startState ? e.startState(t, i) : true;
    }
    var e5 = function(e, t, i) {
        this.pos = this.start = 0;
        this.string = e;
        this.tabSize = t || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = i;
    };
    e5.prototype.eol = function() {
        return this.pos >= this.string.length;
    };
    e5.prototype.sol = function() {
        return this.pos == this.lineStart;
    };
    e5.prototype.peek = function() {
        return this.string.charAt(this.pos) || undefined;
    };
    e5.prototype.next = function() {
        if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++);
        }
    };
    e5.prototype.eat = function(e) {
        var t = this.string.charAt(this.pos);
        var i;
        if (typeof e == "string") {
            i = t == e;
        } else {
            i = t && (e.test ? e.test(t) : e(t));
        }
        if (i) {
            ++this.pos;
            return t;
        }
    };
    e5.prototype.eatWhile = function(e) {
        var t = this.pos;
        while(this.eat(e)){}
        return this.pos > t;
    };
    e5.prototype.eatSpace = function() {
        var e = this.pos;
        while(/[\s\u00a0]/.test(this.string.charAt(this.pos))){
            ++this.pos;
        }
        return this.pos > e;
    };
    e5.prototype.skipToEnd = function() {
        this.pos = this.string.length;
    };
    e5.prototype.skipTo = function(e) {
        var t = this.string.indexOf(e, this.pos);
        if (t > -1) {
            this.pos = t;
            return true;
        }
    };
    e5.prototype.backUp = function(e) {
        this.pos -= e;
    };
    e5.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = z(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return (this.lastColumnValue - (this.lineStart ? z(this.string, this.lineStart, this.tabSize) : 0));
    };
    e5.prototype.indentation = function() {
        return (z(this.string, null, this.tabSize) - (this.lineStart ? z(this.string, this.lineStart, this.tabSize) : 0));
    };
    e5.prototype.match = function(e, t, i) {
        if (typeof e == "string") {
            var r = function(e) {
                return i ? e.toLowerCase() : e;
            };
            var n = this.string.substr(this.pos, e.length);
            if (r(n) == r(e)) {
                if (t !== false) {
                    this.pos += e.length;
                }
                return true;
            }
        } else {
            var o = this.string.slice(this.pos).match(e);
            if (o && o.index > 0) {
                return null;
            }
            if (o && t !== false) {
                this.pos += o[0].length;
            }
            return o;
        }
    };
    e5.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
    };
    e5.prototype.hideFirstChars = function(e, t) {
        this.lineStart += e;
        try {
            return t();
        } finally{
            this.lineStart -= e;
        }
    };
    e5.prototype.lookAhead = function(e) {
        var t = this.lineOracle;
        return t && t.lookAhead(e);
    };
    e5.prototype.baseToken = function() {
        var e = this.lineOracle;
        return e && e.baseToken(this.pos);
    };
    function e2(e, t) {
        t -= e.first;
        if (t < 0 || t >= e.size) {
            throw new Error("There is no line " + (t + e.first) + " in the document.");
        }
        var i = e;
        while(!i.lines){
            for(var r = 0;; ++r){
                var n = i.children[r], o = n.chunkSize();
                if (t < o) {
                    i = n;
                    break;
                }
                t -= o;
            }
        }
        return i.lines[t];
    }
    function eG(e, t, i) {
        var r = [], n = t.line;
        e.iter(t.line, i.line + 1, function(e) {
            var o = e.text;
            if (n == i.line) {
                o = o.slice(0, i.ch);
            }
            if (n == t.line) {
                o = o.slice(t.ch);
            }
            r.push(o);
            ++n;
        });
        return r;
    }
    function eU(e, t, i) {
        var r = [];
        e.iter(t, i, function(e) {
            r.push(e.text);
        });
        return r;
    }
    function eV(e, t) {
        var i = t - e.height;
        if (i) {
            for(var r = e; r; r = r.parent){
                r.height += i;
            }
        }
    }
    function eK(e) {
        if (e.parent == null) {
            return null;
        }
        var t = e.parent, i = I(t.lines, e);
        for(var r = t.parent; r; t = r, r = r.parent){
            for(var n = 0;; ++n){
                if (r.children[n] == t) {
                    break;
                }
                i += r.children[n].chunkSize();
            }
        }
        return i + t.first;
    }
    function eX(e, t) {
        var i = e.first;
        outer: do {
            for(var r = 0; r < e.children.length; ++r){
                var n = e.children[r], o = n.height;
                if (t < o) {
                    e = n;
                    continue outer;
                }
                t -= o;
                i += n.chunkSize();
            }
            return i;
        }while (!e.lines)
        var l = 0;
        for(; l < e.lines.length; ++l){
            var s = e.lines[l], a = s.height;
            if (t < a) {
                break;
            }
            t -= a;
        }
        return i + l;
    }
    function eY(e, t) {
        return t >= e.first && t < e.first + e.size;
    }
    function ej(e, t) {
        return String(e.lineNumberFormatter(t + e.firstLineNumber));
    }
    function e9(e, t, i) {
        if (i === void 0) i = null;
        if (!(this instanceof e9)) {
            return new e9(e, t, i);
        }
        this.line = e;
        this.ch = t;
        this.sticky = i;
    }
    function eq(e, t) {
        return e.line - t.line || e.ch - t.ch;
    }
    function e8(e, t) {
        return e.sticky == t.sticky && eq(e, t) == 0;
    }
    function eZ(e) {
        return e9(e.line, e.ch);
    }
    function eJ(e, t) {
        return eq(e, t) < 0 ? t : e;
    }
    function eQ(e, t) {
        return eq(e, t) < 0 ? e : t;
    }
    function te(e, t) {
        return Math.max(e.first, Math.min(t, e.first + e.size - 1));
    }
    function tt(e, t) {
        if (t.line < e.first) {
            return e9(e.first, 0);
        }
        var i = e.first + e.size - 1;
        if (t.line > i) {
            return e9(i, e2(e, i).text.length);
        }
        return ti(t, e2(e, t.line).text.length);
    }
    function ti(e, t) {
        var i = e.ch;
        if (i == null || i > t) {
            return e9(e.line, t);
        } else if (i < 0) {
            return e9(e.line, 0);
        } else {
            return e;
        }
    }
    function tr(e, t) {
        var i = [];
        for(var r = 0; r < t.length; r++){
            i[r] = tt(e, t[r]);
        }
        return i;
    }
    var tn = function(e, t) {
        this.state = e;
        this.lookAhead = t;
    };
    var to = function(e, t, i, r) {
        this.state = t;
        this.doc = e;
        this.line = i;
        this.maxLookAhead = r || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
    };
    to.prototype.lookAhead = function(e) {
        var t = this.doc.getLine(this.line + e);
        if (t != null && e > this.maxLookAhead) {
            this.maxLookAhead = e;
        }
        return t;
    };
    to.prototype.baseToken = function(e) {
        if (!this.baseTokens) {
            return null;
        }
        while(this.baseTokens[this.baseTokenPos] <= e){
            this.baseTokenPos += 2;
        }
        var t = this.baseTokens[this.baseTokenPos + 1];
        return {
            type: t && t.replace(/( |^)overlay .*/, ""),
            size: this.baseTokens[this.baseTokenPos] - e
        };
    };
    to.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) {
            this.maxLookAhead--;
        }
    };
    to.fromSaved = function(e, t, i) {
        if (t instanceof tn) {
            return new to(e, eB(e.mode, t.state), i, t.lookAhead);
        } else {
            return new to(e, eB(e.mode, t), i);
        }
    };
    to.prototype.save = function(e) {
        var t = e !== false ? eB(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new tn(t, this.maxLookAhead) : t;
    };
    function tl(e, t, i, r) {
        var n = [
            e.state.modeGen
        ], o = {};
        tv(e, t.text, e.doc.mode, i, function(e, t) {
            return n.push(e, t);
        }, o, r);
        var l = i.state;
        var s = function(r) {
            i.baseTokens = n;
            var s = e.state.overlays[r], a = 1, f = 0;
            i.state = true;
            tv(e, t.text, s.mode, i, function(e, t) {
                var i = a;
                while(f < e){
                    var r = n[a];
                    if (r > e) {
                        n.splice(a, 1, e, n[a + 1], r);
                    }
                    a += 2;
                    f = Math.min(e, r);
                }
                if (!t) {
                    return;
                }
                if (s.opaque) {
                    n.splice(i, a - i, e, "overlay " + t);
                    a = i + 2;
                } else {
                    for(; i < a; i += 2){
                        var o = n[i + 1];
                        n[i + 1] = (o ? o + " " : "") + "overlay " + t;
                    }
                }
            }, o);
            i.state = l;
            i.baseTokens = null;
            i.baseTokenPos = 1;
        };
        for(var a = 0; a < e.state.overlays.length; ++a)s(a);
        return {
            styles: n,
            classes: o.bgClass || o.textClass ? o : null
        };
    }
    function ts(e, t, i) {
        if (!t.styles || t.styles[0] != e.state.modeGen) {
            var r = ta(e, eK(t));
            var n = t.text.length > e.options.maxHighlightLength && eB(e.doc.mode, r.state);
            var o = tl(e, t, r);
            if (n) {
                r.state = n;
            }
            t.stateAfter = r.save(!n);
            t.styles = o.styles;
            if (o.classes) {
                t.styleClasses = o.classes;
            } else if (t.styleClasses) {
                t.styleClasses = null;
            }
            if (i === e.doc.highlightFrontier) {
                e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier);
            }
        }
        return t.styles;
    }
    function ta(e, t, i) {
        var r = e.doc, n = e.display;
        if (!r.mode.startState) {
            return new to(r, true, t);
        }
        var o = tg(e, t, i);
        var l = o > r.first && e2(r, o - 1).stateAfter;
        var s = l ? to.fromSaved(r, l, o) : new to(r, e6(r.mode), o);
        r.iter(o, t, function(i) {
            tf(e, i.text, s);
            var r = s.line;
            i.stateAfter = r == t - 1 || r % 5 == 0 || (r >= n.viewFrom && r < n.viewTo) ? s.save() : null;
            s.nextLine();
        });
        if (i) {
            r.modeFrontier = s.line;
        }
        return s;
    }
    function tf(e, t, i, r) {
        var n = e.doc.mode;
        var o = new e5(t, e.options.tabSize, i);
        o.start = o.pos = r || 0;
        if (t == "") {
            tu(n, i.state);
        }
        while(!o.eol()){
            tc(n, o, i.state);
            o.start = o.pos;
        }
    }
    function tu(e, t) {
        if (e.blankLine) {
            return e.blankLine(t);
        }
        if (!e.innerMode) {
            return;
        }
        var i = e4(e, t);
        if (i.mode.blankLine) {
            return i.mode.blankLine(i.state);
        }
    }
    function tc(e, t, i, r) {
        for(var n = 0; n < 10; n++){
            if (r) {
                r[0] = e4(e, i).mode;
            }
            var o = e.token(t, i);
            if (t.pos > t.start) {
                return o;
            }
        }
        throw new Error("Mode " + e.name + " failed to advance stream.");
    }
    var th = function(e, t, i) {
        this.start = e.start;
        this.end = e.pos;
        this.string = e.current();
        this.type = t || null;
        this.state = i;
    };
    function td(e, t, i, r) {
        var n = e.doc, o = n.mode, l;
        t = tt(n, t);
        var s = e2(n, t.line), a = ta(e, t.line, i);
        var f = new e5(s.text, e.options.tabSize, a), u;
        if (r) {
            u = [];
        }
        while((r || f.pos < t.ch) && !f.eol()){
            f.start = f.pos;
            l = tc(o, f, a.state);
            if (r) {
                u.push(new th(f, l, eB(n.mode, a.state)));
            }
        }
        return r ? u : new th(f, l, a.state);
    }
    function tp(e, t) {
        if (e) {
            for(;;){
                var i = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!i) {
                    break;
                }
                e = e.slice(0, i.index) + e.slice(i.index + i[0].length);
                var r = i[1] ? "bgClass" : "textClass";
                if (t[r] == null) {
                    t[r] = i[2];
                } else if (!new RegExp("(?:^|\\s)" + i[2] + "(?:$|\\s)").test(t[r])) {
                    t[r] += " " + i[2];
                }
            }
        }
        return e;
    }
    function tv(e, t, i, r, n, o, l) {
        var s = i.flattenSpans;
        if (s == null) {
            s = e.options.flattenSpans;
        }
        var a = 0, f = null;
        var u = new e5(t, e.options.tabSize, r), c;
        var h = e.options.addModeClass && [
            null
        ];
        if (t == "") {
            tp(tu(i, r.state), o);
        }
        while(!u.eol()){
            if (u.pos > e.options.maxHighlightLength) {
                s = false;
                if (l) {
                    tf(e, t, r, u.pos);
                }
                u.pos = t.length;
                c = null;
            } else {
                c = tp(tc(i, u, r.state, h), o);
            }
            if (h) {
                var d = h[0].name;
                if (d) {
                    c = "m-" + (c ? d + " " + c : d);
                }
            }
            if (!s || f != c) {
                while(a < u.start){
                    a = Math.min(u.start, a + 5000);
                    n(a, f);
                }
                f = c;
            }
            u.start = u.pos;
        }
        while(a < u.pos){
            var p = Math.min(u.pos, a + 5000);
            n(p, f);
            a = p;
        }
    }
    function tg(e, t, i) {
        var r, n, o = e.doc;
        var l = i ? -1 : t - (e.doc.mode.innerMode ? 1000 : 100);
        for(var s = t; s > l; --s){
            if (s <= o.first) {
                return o.first;
            }
            var a = e2(o, s - 1), f = a.stateAfter;
            if (f && (!i || s + (f instanceof tn ? f.lookAhead : 0) <= o.modeFrontier)) {
                return s;
            }
            var u = z(a.text, null, e.options.tabSize);
            if (n == null || r > u) {
                n = s - 1;
                r = u;
            }
        }
        return n;
    }
    function tm(e, t) {
        e.modeFrontier = Math.min(e.modeFrontier, t);
        if (e.highlightFrontier < t - 10) {
            return;
        }
        var i = e.first;
        for(var r = t - 1; r > i; r--){
            var n = e2(e, r).stateAfter;
            if (n && (!(n instanceof tn) || r + n.lookAhead < t)) {
                i = r + 1;
                break;
            }
        }
        e.highlightFrontier = Math.min(e.highlightFrontier, i);
    }
    var t$ = false, ty = false;
    function t_() {
        t$ = true;
    }
    function tw() {
        ty = true;
    }
    function tb(e, t, i) {
        this.marker = e;
        this.from = t;
        this.to = i;
    }
    function tx(e, t) {
        if (e) {
            for(var i = 0; i < e.length; ++i){
                var r = e[i];
                if (r.marker == t) {
                    return r;
                }
            }
        }
    }
    function tC(e, t) {
        var i;
        for(var r = 0; r < e.length; ++r){
            if (e[r] != t) {
                (i || (i = [])).push(e[r]);
            }
        }
        return i;
    }
    function tS(e, t, i) {
        var r = i && window.WeakSet && (i.markedSpans || (i.markedSpans = new WeakSet()));
        if (r && r.has(e.markedSpans)) {
            e.markedSpans.push(t);
        } else {
            e.markedSpans = e.markedSpans ? e.markedSpans.concat([
                t
            ]) : [
                t
            ];
            if (r) {
                r.add(e.markedSpans);
            }
        }
        t.marker.attachLine(e);
    }
    function tk(e, t, i) {
        var r;
        if (e) {
            for(var n = 0; n < e.length; ++n){
                var o = e[n], l = o.marker;
                var s = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t);
                if (s || (o.from == t && l.type == "bookmark" && (!i || !o.marker.insertLeft))) {
                    var a = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t);
                    (r || (r = [])).push(new tb(l, o.from, a ? null : o.to));
                }
            }
        }
        return r;
    }
    function tT(e, t, i) {
        var r;
        if (e) {
            for(var n = 0; n < e.length; ++n){
                var o = e[n], l = o.marker;
                var s = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t);
                if (s || (o.from == t && l.type == "bookmark" && (!i || o.marker.insertLeft))) {
                    var a = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t);
                    (r || (r = [])).push(new tb(l, a ? null : o.from - t, o.to == null ? null : o.to - t));
                }
            }
        }
        return r;
    }
    function tL(e, t) {
        if (t.full) {
            return null;
        }
        var i = eY(e, t.from.line) && e2(e, t.from.line).markedSpans;
        var r = eY(e, t.to.line) && e2(e, t.to.line).markedSpans;
        if (!i && !r) {
            return null;
        }
        var n = t.from.ch, o = t.to.ch, l = eq(t.from, t.to) == 0;
        var s = tk(i, n, l);
        var a = tT(r, o, l);
        var f = t.text.length == 1, u = j(t.text).length + (f ? n : 0);
        if (s) {
            for(var c = 0; c < s.length; ++c){
                var h = s[c];
                if (h.to == null) {
                    var d = tx(a, h.marker);
                    if (!d) {
                        h.to = n;
                    } else if (f) {
                        h.to = d.to == null ? null : d.to + u;
                    }
                }
            }
        }
        if (a) {
            for(var p = 0; p < a.length; ++p){
                var v = a[p];
                if (v.to != null) {
                    v.to += u;
                }
                if (v.from == null) {
                    var g = tx(s, v.marker);
                    if (!g) {
                        v.from = u;
                        if (f) {
                            (s || (s = [])).push(v);
                        }
                    }
                } else {
                    v.from += u;
                    if (f) {
                        (s || (s = [])).push(v);
                    }
                }
            }
        }
        if (s) {
            s = tO(s);
        }
        if (a && a != s) {
            a = tO(a);
        }
        var m = [
            s
        ];
        if (!f) {
            var $ = t.text.length - 2, y;
            if ($ > 0 && s) {
                for(var _ = 0; _ < s.length; ++_){
                    if (s[_].to == null) {
                        (y || (y = [])).push(new tb(s[_].marker, null, null));
                    }
                }
            }
            for(var w = 0; w < $; ++w){
                m.push(y);
            }
            m.push(a);
        }
        return m;
    }
    function tO(e) {
        for(var t = 0; t < e.length; ++t){
            var i = e[t];
            if (i.from != null && i.from == i.to && i.marker.clearWhenEmpty !== false) {
                e.splice(t--, 1);
            }
        }
        if (!e.length) {
            return null;
        }
        return e;
    }
    function t0(e, t, i) {
        var r = null;
        e.iter(t.line, i.line + 1, function(e) {
            if (e.markedSpans) {
                for(var t = 0; t < e.markedSpans.length; ++t){
                    var i = e.markedSpans[t].marker;
                    if (i.readOnly && (!r || I(r, i) == -1)) {
                        (r || (r = [])).push(i);
                    }
                }
            }
        });
        if (!r) {
            return null;
        }
        var n = [
            {
                from: t,
                to: i
            }
        ];
        for(var o = 0; o < r.length; ++o){
            var l = r[o], s = l.find(0);
            for(var a = 0; a < n.length; ++a){
                var f = n[a];
                if (eq(f.to, s.from) < 0 || eq(f.from, s.to) > 0) {
                    continue;
                }
                var u = [
                    a,
                    1
                ], c = eq(f.from, s.from), h = eq(f.to, s.to);
                if (c < 0 || (!l.inclusiveLeft && !c)) {
                    u.push({
                        from: f.from,
                        to: s.from
                    });
                }
                if (h > 0 || (!l.inclusiveRight && !h)) {
                    u.push({
                        from: s.to,
                        to: f.to
                    });
                }
                n.splice.apply(n, u);
                a += u.length - 3;
            }
        }
        return n;
    }
    function tW(e) {
        var t = e.markedSpans;
        if (!t) {
            return;
        }
        for(var i = 0; i < t.length; ++i){
            t[i].marker.detachLine(e);
        }
        e.markedSpans = null;
    }
    function tN(e, t) {
        if (!t) {
            return;
        }
        for(var i = 0; i < t.length; ++i){
            t[i].marker.attachLine(e);
        }
        e.markedSpans = t;
    }
    function tA(e) {
        return e.inclusiveLeft ? -1 : 0;
    }
    function tD(e) {
        return e.inclusiveRight ? 1 : 0;
    }
    function tH(e, t) {
        var i = e.lines.length - t.lines.length;
        if (i != 0) {
            return i;
        }
        var r = e.find(), n = t.find();
        var o = eq(r.from, n.from) || tA(e) - tA(t);
        if (o) {
            return -o;
        }
        var l = eq(r.to, n.to) || tD(e) - tD(t);
        if (l) {
            return l;
        }
        return t.id - e.id;
    }
    function tF(e, t) {
        var i = ty && e.markedSpans, r;
        if (i) {
            for(var n = void 0, o = 0; o < i.length; ++o){
                n = i[o];
                if (n.marker.collapsed && (t ? n.from : n.to) == null && (!r || tH(r, n.marker) < 0)) {
                    r = n.marker;
                }
            }
        }
        return r;
    }
    function tM(e) {
        return tF(e, true);
    }
    function t1(e) {
        return tF(e, false);
    }
    function tP(e, t) {
        var i = ty && e.markedSpans, r;
        if (i) {
            for(var n = 0; n < i.length; ++n){
                var o = i[n];
                if (o.marker.collapsed && (o.from == null || o.from < t) && (o.to == null || o.to > t) && (!r || tH(r, o.marker) < 0)) {
                    r = o.marker;
                }
            }
        }
        return r;
    }
    function tz(e, t, i, r, n) {
        var o = e2(e, t);
        var l = ty && o.markedSpans;
        if (l) {
            for(var s = 0; s < l.length; ++s){
                var a = l[s];
                if (!a.marker.collapsed) {
                    continue;
                }
                var f = a.marker.find(0);
                var u = eq(f.from, i) || tA(a.marker) - tA(n);
                var c = eq(f.to, r) || tD(a.marker) - tD(n);
                if ((u >= 0 && c <= 0) || (u <= 0 && c >= 0)) {
                    continue;
                }
                if ((u <= 0 && (a.marker.inclusiveRight && n.inclusiveLeft ? eq(f.to, i) >= 0 : eq(f.to, i) > 0)) || (u >= 0 && (a.marker.inclusiveRight && n.inclusiveLeft ? eq(f.from, r) <= 0 : eq(f.from, r) < 0))) {
                    return true;
                }
            }
        }
    }
    function tE(e) {
        var t;
        while((t = tM(e))){
            e = t.find(-1, true).line;
        }
        return e;
    }
    function tI(e) {
        var t;
        while((t = t1(e))){
            e = t.find(1, true).line;
        }
        return e;
    }
    function tR(e) {
        var t, i;
        while((t = t1(e))){
            e = t.find(1, true).line;
            (i || (i = [])).push(e);
        }
        return i;
    }
    function t3(e, t) {
        var i = e2(e, t), r = tE(i);
        if (i == r) {
            return t;
        }
        return eK(r);
    }
    function t7(e, t) {
        if (t > e.lastLine()) {
            return t;
        }
        var i = e2(e, t), r;
        if (!tB(e, i)) {
            return t;
        }
        while((r = t1(i))){
            i = r.find(1, true).line;
        }
        return eK(i) + 1;
    }
    function tB(e, t) {
        var i = ty && t.markedSpans;
        if (i) {
            for(var r = void 0, n = 0; n < i.length; ++n){
                r = i[n];
                if (!r.marker.collapsed) {
                    continue;
                }
                if (r.from == null) {
                    return true;
                }
                if (r.marker.widgetNode) {
                    continue;
                }
                if (r.from == 0 && r.marker.inclusiveLeft && t4(e, t, r)) {
                    return true;
                }
            }
        }
    }
    function t4(e, t, i) {
        if (i.to == null) {
            var r = i.marker.find(1, true);
            return t4(e, r.line, tx(r.line.markedSpans, i.marker));
        }
        if (i.marker.inclusiveRight && i.to == t.text.length) {
            return true;
        }
        for(var n = void 0, o = 0; o < t.markedSpans.length; ++o){
            n = t.markedSpans[o];
            if (n.marker.collapsed && !n.marker.widgetNode && n.from == i.to && (n.to == null || n.to != i.from) && (n.marker.inclusiveLeft || i.marker.inclusiveRight) && t4(e, t, n)) {
                return true;
            }
        }
    }
    function t6(e) {
        e = tE(e);
        var t = 0, i = e.parent;
        for(var r = 0; r < i.lines.length; ++r){
            var n = i.lines[r];
            if (n == e) {
                break;
            } else {
                t += n.height;
            }
        }
        for(var o = i.parent; o; i = o, o = i.parent){
            for(var l = 0; l < o.children.length; ++l){
                var s = o.children[l];
                if (s == i) {
                    break;
                } else {
                    t += s.height;
                }
            }
        }
        return t;
    }
    function t5(e) {
        if (e.height == 0) {
            return 0;
        }
        var t = e.text.length, i, r = e;
        while((i = tM(r))){
            var n = i.find(0, true);
            r = n.from.line;
            t += n.from.ch - n.to.ch;
        }
        r = e;
        while((i = t1(r))){
            var o = i.find(0, true);
            t -= r.text.length - o.from.ch;
            r = o.to.line;
            t += r.text.length - o.to.ch;
        }
        return t;
    }
    function t2(e) {
        var t = e.display, i = e.doc;
        t.maxLine = e2(i, i.first);
        t.maxLineLength = t5(t.maxLine);
        t.maxLineChanged = true;
        i.iter(function(e) {
            var i = t5(e);
            if (i > t.maxLineLength) {
                t.maxLineLength = i;
                t.maxLine = e;
            }
        });
    }
    var tG = function(e, t, i) {
        this.text = e;
        tN(this, t);
        this.height = i ? i(this) : 1;
    };
    tG.prototype.lineNo = function() {
        return eK(this);
    };
    ew(tG);
    function tU(e, t, i, r) {
        e.text = t;
        if (e.stateAfter) {
            e.stateAfter = null;
        }
        if (e.styles) {
            e.styles = null;
        }
        if (e.order != null) {
            e.order = null;
        }
        tW(e);
        tN(e, i);
        var n = r ? r(e) : 1;
        if (n != e.height) {
            eV(e, n);
        }
    }
    function tV(e) {
        e.parent = null;
        tW(e);
    }
    var tK = {}, tX = {};
    function tY(e, t) {
        if (!e || /^\s*$/.test(e)) {
            return null;
        }
        var i = t.addModeClass ? tX : tK;
        return i[e] || (i[e] = e.replace(/\S+/g, "cm-$&"));
    }
    function tj(e, t) {
        var i = O("span", null, null, a ? "padding-right: .1px" : null);
        var r = {
            pre: O("pre", [
                i
            ], "CodeMirror-line"),
            content: i,
            col: 0,
            pos: 0,
            cm: e,
            trailingSpace: false,
            splitSpaces: e.getOption("lineWrapping")
        };
        t.measure = {};
        for(var n = 0; n <= (t.rest ? t.rest.length : 0); n++){
            var o = n ? t.rest[n - 1] : t.line, l = void 0;
            r.pos = 0;
            r.addToken = tq;
            if (eN(e.display.measure) && (l = eh(o, e.doc.direction))) {
                r.addToken = tZ(r.addToken, l);
            }
            r.map = [];
            var s = t != e.display.externalMeasured && eK(o);
            tQ(o, r, ts(e, o, s));
            if (o.styleClasses) {
                if (o.styleClasses.bgClass) {
                    r.bgClass = H(o.styleClasses.bgClass, r.bgClass || "");
                }
                if (o.styleClasses.textClass) {
                    r.textClass = H(o.styleClasses.textClass, r.textClass || "");
                }
            }
            if (r.map.length == 0) {
                r.map.push(0, 0, r.content.appendChild(e0(e.display.measure)));
            }
            if (n == 0) {
                t.measure.map = r.map;
                t.measure.cache = {};
            } else {
                (t.measure.maps || (t.measure.maps = [])).push(r.map);
                (t.measure.caches || (t.measure.caches = [])).push({});
            }
        }
        if (a) {
            var f = r.content.lastChild;
            if (/\bcm-tab\b/.test(f.className) || (f.querySelector && f.querySelector(".cm-tab"))) {
                r.content.className = "cm-tab-wrap-hack";
            }
        }
        em(e, "renderLine", e, t.line, r.pre);
        if (r.pre.className) {
            r.textClass = H(r.pre.className, r.textClass || "");
        }
        return r;
    }
    function t9(e) {
        var t = L("span", "\u2022", "cm-invalidchar");
        t.title = "\\u" + e.charCodeAt(0).toString(16);
        t.setAttribute("aria-label", t.title);
        return t;
    }
    function tq(e, t, i, r, n, o, a) {
        if (!t) {
            return;
        }
        var f = e.splitSpaces ? t8(t, e.trailingSpace) : t;
        var u = e.cm.state.specialChars, c = false;
        var h;
        if (!u.test(t)) {
            e.col += t.length;
            h = document.createTextNode(f);
            e.map.push(e.pos, e.pos + t.length, h);
            if (l && s < 9) {
                c = true;
            }
            e.pos += t.length;
        } else {
            h = document.createDocumentFragment();
            var d = 0;
            while(true){
                u.lastIndex = d;
                var p = u.exec(t);
                var v = p ? p.index - d : t.length - d;
                if (v) {
                    var g = document.createTextNode(f.slice(d, d + v));
                    if (l && s < 9) {
                        h.appendChild(L("span", [
                            g
                        ]));
                    } else {
                        h.appendChild(g);
                    }
                    e.map.push(e.pos, e.pos + v, g);
                    e.col += v;
                    e.pos += v;
                }
                if (!p) {
                    break;
                }
                d += v + 1;
                var m = void 0;
                if (p[0] == "\t") {
                    var $ = e.cm.options.tabSize, y = $ - (e.col % $);
                    m = h.appendChild(L("span", Y(y), "cm-tab"));
                    m.setAttribute("role", "presentation");
                    m.setAttribute("cm-text", "\t");
                    e.col += y;
                } else if (p[0] == "\r" || p[0] == "\n") {
                    m = h.appendChild(L("span", p[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                    m.setAttribute("cm-text", p[0]);
                    e.col += 1;
                } else {
                    m = e.cm.options.specialCharPlaceholder(p[0]);
                    m.setAttribute("cm-text", p[0]);
                    if (l && s < 9) {
                        h.appendChild(L("span", [
                            m
                        ]));
                    } else {
                        h.appendChild(m);
                    }
                    e.col += 1;
                }
                e.map.push(e.pos, e.pos + 1, m);
                e.pos++;
            }
        }
        e.trailingSpace = f.charCodeAt(t.length - 1) == 32;
        if (i || r || n || c || o || a) {
            var _ = i || "";
            if (r) {
                _ += r;
            }
            if (n) {
                _ += n;
            }
            var w = L("span", [
                h
            ], _, o);
            if (a) {
                for(var b in a){
                    if (a.hasOwnProperty(b) && b != "style" && b != "class") {
                        w.setAttribute(b, a[b]);
                    }
                }
            }
            return e.content.appendChild(w);
        }
        e.content.appendChild(h);
    }
    function t8(e, t) {
        if (e.length > 1 && !/  /.test(e)) {
            return e;
        }
        var i = t, r = "";
        for(var n = 0; n < e.length; n++){
            var o = e.charAt(n);
            if (o == " " && i && (n == e.length - 1 || e.charCodeAt(n + 1) == 32)) {
                o = "\u00a0";
            }
            r += o;
            i = o == " ";
        }
        return r;
    }
    function tZ(e, t) {
        return function(i, r, n, o, l, s, a) {
            n = n ? n + " cm-force-border" : "cm-force-border";
            var f = i.pos, u = f + r.length;
            for(;;){
                var c = void 0;
                for(var h = 0; h < t.length; h++){
                    c = t[h];
                    if (c.to > f && c.from <= f) {
                        break;
                    }
                }
                if (c.to >= u) {
                    return e(i, r, n, o, l, s, a);
                }
                e(i, r.slice(0, c.to - f), n, o, null, s, a);
                o = null;
                r = r.slice(c.to - f);
                f = c.to;
            }
        };
    }
    function tJ(e, t, i, r) {
        var n = !r && i.widgetNode;
        if (n) {
            e.map.push(e.pos, e.pos + t, n);
        }
        if (!r && e.cm.display.input.needsContentAttribute) {
            if (!n) {
                n = e.content.appendChild(document.createElement("span"));
            }
            n.setAttribute("cm-marker", i.id);
        }
        if (n) {
            e.cm.display.input.setUneditable(n);
            e.content.appendChild(n);
        }
        e.pos += t;
        e.trailingSpace = false;
    }
    function tQ(e, t, i) {
        var r = e.markedSpans, n = e.text, o = 0;
        if (!r) {
            for(var l = 1; l < i.length; l += 2){
                t.addToken(t, n.slice(o, (o = i[l])), tY(i[l + 1], t.cm.options));
            }
            return;
        }
        var s = n.length, a = 0, f = 1, u = "", c, h;
        var d = 0, p, v, g, m, $;
        for(;;){
            if (d == a) {
                p = v = g = h = "";
                $ = null;
                m = null;
                d = Infinity;
                var y = [], _ = void 0;
                for(var w = 0; w < r.length; ++w){
                    var b = r[w], x = b.marker;
                    if (x.type == "bookmark" && b.from == a && x.widgetNode) {
                        y.push(x);
                    } else if (b.from <= a && (b.to == null || b.to > a || (x.collapsed && b.to == a && b.from == a))) {
                        if (b.to != null && b.to != a && d > b.to) {
                            d = b.to;
                            v = "";
                        }
                        if (x.className) {
                            p += " " + x.className;
                        }
                        if (x.css) {
                            h = (h ? h + ";" : "") + x.css;
                        }
                        if (x.startStyle && b.from == a) {
                            g += " " + x.startStyle;
                        }
                        if (x.endStyle && b.to == d) {
                            (_ || (_ = [])).push(x.endStyle, b.to);
                        }
                        if (x.title) {
                            ($ || ($ = {})).title = x.title;
                        }
                        if (x.attributes) {
                            for(var C in x.attributes){
                                ($ || ($ = {}))[C] = x.attributes[C];
                            }
                        }
                        if (x.collapsed && (!m || tH(m.marker, x) < 0)) {
                            m = b;
                        }
                    } else if (b.from > a && d > b.from) {
                        d = b.from;
                    }
                }
                if (_) {
                    for(var S = 0; S < _.length; S += 2){
                        if (_[S + 1] == d) {
                            v += " " + _[S];
                        }
                    }
                }
                if (!m || m.from == a) {
                    for(var k = 0; k < y.length; ++k){
                        tJ(t, 0, y[k]);
                    }
                }
                if (m && (m.from || 0) == a) {
                    tJ(t, (m.to == null ? s + 1 : m.to) - a, m.marker, m.from == null);
                    if (m.to == null) {
                        return;
                    }
                    if (m.to == a) {
                        m = false;
                    }
                }
            }
            if (a >= s) {
                break;
            }
            var T = Math.min(s, d);
            while(true){
                if (u) {
                    var L = a + u.length;
                    if (!m) {
                        var O = L > T ? u.slice(0, T - a) : u;
                        t.addToken(t, O, c ? c + p : p, g, a + O.length == d ? v : "", h, $);
                    }
                    if (L >= T) {
                        u = u.slice(T - a);
                        a = T;
                        break;
                    }
                    a = L;
                    g = "";
                }
                u = n.slice(o, (o = i[f++]));
                c = tY(i[f++], t.cm.options);
            }
        }
    }
    function ie(e, t, i) {
        this.line = t;
        this.rest = tR(t);
        this.size = this.rest ? eK(j(this.rest)) - i + 1 : 1;
        this.node = this.text = null;
        this.hidden = tB(e, t);
    }
    function it(e, t, i) {
        var r = [], n;
        for(var o = t; o < i; o = n){
            var l = new ie(e.doc, e2(e.doc, o), o);
            n = o + l.size;
            r.push(l);
        }
        return r;
    }
    var ii = null;
    function ir(e) {
        if (ii) {
            ii.ops.push(e);
        } else {
            e.ownsGroup = ii = {
                ops: [
                    e
                ],
                delayedCallbacks: []
            };
        }
    }
    function io(e) {
        var t = e.delayedCallbacks, i = 0;
        do {
            for(; i < t.length; i++){
                t[i].call(null);
            }
            for(var r = 0; r < e.ops.length; r++){
                var n = e.ops[r];
                if (n.cursorActivityHandlers) {
                    while(n.cursorActivityCalled < n.cursorActivityHandlers.length){
                        n.cursorActivityHandlers[n.cursorActivityCalled++].call(null, n.cm);
                    }
                }
            }
        }while (i < t.length)
    }
    function il(e, t) {
        var i = e.ownsGroup;
        if (!i) {
            return;
        }
        try {
            io(i);
        } finally{
            ii = null;
            t(i);
        }
    }
    var is = null;
    function ia(e, t) {
        var i = ev(e, t);
        if (!i.length) {
            return;
        }
        var r = Array.prototype.slice.call(arguments, 2), n;
        if (ii) {
            n = ii.delayedCallbacks;
        } else if (is) {
            n = is;
        } else {
            n = is = [];
            setTimeout(iu, 0);
        }
        var o = function(e) {
            n.push(function() {
                return i[e].apply(null, r);
            });
        };
        for(var l = 0; l < i.length; ++l)o(l);
    }
    function iu() {
        var e = is;
        is = null;
        for(var t = 0; t < e.length; ++t){
            e[t]();
        }
    }
    function ic(e, t, i, r) {
        for(var n = 0; n < t.changes.length; n++){
            var o = t.changes[n];
            if (o == "text") {
                iv(e, t);
            } else if (o == "gutter") {
                im(e, t, i, r);
            } else if (o == "class") {
                ig(e, t);
            } else if (o == "widget") {
                i$(e, t, r);
            }
        }
        t.changes = null;
    }
    function ih(e) {
        if (e.node == e.text) {
            e.node = L("div", null, null, "position: relative");
            if (e.text.parentNode) {
                e.text.parentNode.replaceChild(e.node, e.text);
            }
            e.node.appendChild(e.text);
            if (l && s < 8) {
                e.node.style.zIndex = 2;
            }
        }
        return e.node;
    }
    function id(e, t) {
        var i = t.bgClass ? t.bgClass + " " + (t.line.bgClass || "") : t.line.bgClass;
        if (i) {
            i += " CodeMirror-linebackground";
        }
        if (t.background) {
            if (i) {
                t.background.className = i;
            } else {
                t.background.parentNode.removeChild(t.background);
                t.background = null;
            }
        } else if (i) {
            var r = ih(t);
            t.background = r.insertBefore(L("div", null, i), r.firstChild);
            e.display.input.setUneditable(t.background);
        }
    }
    function ip(e, t) {
        var i = e.display.externalMeasured;
        if (i && i.line == t.line) {
            e.display.externalMeasured = null;
            t.measure = i.measure;
            return i.built;
        }
        return tj(e, t);
    }
    function iv(e, t) {
        var i = t.text.className;
        var r = ip(e, t);
        if (t.text == t.node) {
            t.node = r.pre;
        }
        t.text.parentNode.replaceChild(r.pre, t.text);
        t.text = r.pre;
        if (r.bgClass != t.bgClass || r.textClass != t.textClass) {
            t.bgClass = r.bgClass;
            t.textClass = r.textClass;
            ig(e, t);
        } else if (i) {
            t.text.className = i;
        }
    }
    function ig(e, t) {
        id(e, t);
        if (t.line.wrapClass) {
            ih(t).className = t.line.wrapClass;
        } else if (t.node != t.text) {
            t.node.className = "";
        }
        var i = t.textClass ? t.textClass + " " + (t.line.textClass || "") : t.line.textClass;
        t.text.className = i || "";
    }
    function im(e, t, i, r) {
        if (t.gutter) {
            t.node.removeChild(t.gutter);
            t.gutter = null;
        }
        if (t.gutterBackground) {
            t.node.removeChild(t.gutterBackground);
            t.gutterBackground = null;
        }
        if (t.line.gutterClass) {
            var n = ih(t);
            t.gutterBackground = L("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px; width: " + r.gutterTotalWidth + "px");
            e.display.input.setUneditable(t.gutterBackground);
            n.insertBefore(t.gutterBackground, t.text);
        }
        var o = t.line.gutterMarkers;
        if (e.options.lineNumbers || o) {
            var l = ih(t);
            var s = (t.gutter = L("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px"));
            s.setAttribute("aria-hidden", "true");
            e.display.input.setUneditable(s);
            l.insertBefore(s, t.text);
            if (t.line.gutterClass) {
                s.className += " " + t.line.gutterClass;
            }
            if (e.options.lineNumbers && (!o || !o["CodeMirror-linenumbers"])) {
                t.lineNumber = s.appendChild(L("div", ej(e.options, i), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"));
            }
            if (o) {
                for(var a = 0; a < e.display.gutterSpecs.length; ++a){
                    var f = e.display.gutterSpecs[a].className, u = o.hasOwnProperty(f) && o[f];
                    if (u) {
                        s.appendChild(L("div", [
                            u
                        ], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[f] + "px; width: " + r.gutterWidth[f] + "px"));
                    }
                }
            }
        }
    }
    function i$(e, t, i) {
        if (t.alignable) {
            t.alignable = null;
        }
        var r = C("CodeMirror-linewidget");
        for(var n = t.node.firstChild, o = void 0; n; n = o){
            o = n.nextSibling;
            if (r.test(n.className)) {
                t.node.removeChild(n);
            }
        }
        i_(e, t, i);
    }
    function iy(e, t, i, r) {
        var n = ip(e, t);
        t.text = t.node = n.pre;
        if (n.bgClass) {
            t.bgClass = n.bgClass;
        }
        if (n.textClass) {
            t.textClass = n.textClass;
        }
        ig(e, t);
        im(e, t, i, r);
        i_(e, t, r);
        return t.node;
    }
    function i_(e, t, i) {
        iw(e, t.line, t, i, true);
        if (t.rest) {
            for(var r = 0; r < t.rest.length; r++){
                iw(e, t.rest[r], t, i, false);
            }
        }
    }
    function iw(e, t, i, r, n) {
        if (!t.widgets) {
            return;
        }
        var o = ih(i);
        for(var l = 0, s = t.widgets; l < s.length; ++l){
            var a = s[l], f = L("div", [
                a.node
            ], "CodeMirror-linewidget" + (a.className ? " " + a.className : ""));
            if (!a.handleMouseEvents) {
                f.setAttribute("cm-ignore-events", "true");
            }
            ib(a, f, i, r);
            e.display.input.setUneditable(f);
            if (n && a.above) {
                o.insertBefore(f, i.gutter || i.text);
            } else {
                o.appendChild(f);
            }
            ia(a, "redraw");
        }
    }
    function ib(e, t, i, r) {
        if (e.noHScroll) {
            (i.alignable || (i.alignable = [])).push(t);
            var n = r.wrapperWidth;
            t.style.left = r.fixedPos + "px";
            if (!e.coverGutter) {
                n -= r.gutterTotalWidth;
                t.style.paddingLeft = r.gutterTotalWidth + "px";
            }
            t.style.width = n + "px";
        }
        if (e.coverGutter) {
            t.style.zIndex = 5;
            t.style.position = "relative";
            if (!e.noHScroll) {
                t.style.marginLeft = -r.gutterTotalWidth + "px";
            }
        }
    }
    function ix(e) {
        if (e.height != null) {
            return e.height;
        }
        var t = e.doc.cm;
        if (!t) {
            return 0;
        }
        if (!N(document.body, e.node)) {
            var i = "position: relative;";
            if (e.coverGutter) {
                i += "margin-left: -" + t.display.gutters.offsetWidth + "px;";
            }
            if (e.noHScroll) {
                i += "width: " + t.display.wrapper.clientWidth + "px;";
            }
            T(t.display.measure, L("div", [
                e.node
            ], null, i));
        }
        return (e.height = e.node.parentNode.offsetHeight);
    }
    function iC(e, t) {
        for(var i = ek(t); i != e.wrapper; i = i.parentNode){
            if (!i || (i.nodeType == 1 && i.getAttribute("cm-ignore-events") == "true") || (i.parentNode == e.sizer && i != e.mover)) {
                return true;
            }
        }
    }
    function iS(e) {
        return e.lineSpace.offsetTop;
    }
    function ik(e) {
        return e.mover.offsetHeight - e.lineSpace.offsetHeight;
    }
    function iT(e) {
        if (e.cachedPaddingH) {
            return e.cachedPaddingH;
        }
        var t = T(e.measure, L("pre", "x", "CodeMirror-line-like"));
        var i = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle;
        var r = {
            left: parseInt(i.paddingLeft),
            right: parseInt(i.paddingRight)
        };
        if (!isNaN(r.left) && !isNaN(r.right)) {
            e.cachedPaddingH = r;
        }
        return r;
    }
    function iL(e) {
        return R - e.display.nativeBarWidth;
    }
    function iO(e) {
        return (e.display.scroller.clientWidth - iL(e) - e.display.barWidth);
    }
    function i0(e) {
        return (e.display.scroller.clientHeight - iL(e) - e.display.barHeight);
    }
    function iW(e, t, i) {
        var r = e.options.lineWrapping;
        var n = r && iO(e);
        if (!t.measure.heights || (r && t.measure.width != n)) {
            var o = (t.measure.heights = []);
            if (r) {
                t.measure.width = n;
                var l = t.text.firstChild.getClientRects();
                for(var s = 0; s < l.length - 1; s++){
                    var a = l[s], f = l[s + 1];
                    if (Math.abs(a.bottom - f.bottom) > 2) {
                        o.push((a.bottom + f.top) / 2 - i.top);
                    }
                }
            }
            o.push(i.bottom - i.top);
        }
    }
    function iN(e, t, i) {
        if (e.line == t) {
            return {
                map: e.measure.map,
                cache: e.measure.cache
            };
        }
        if (e.rest) {
            for(var r = 0; r < e.rest.length; r++){
                if (e.rest[r] == t) {
                    return {
                        map: e.measure.maps[r],
                        cache: e.measure.caches[r]
                    };
                }
            }
            for(var n = 0; n < e.rest.length; n++){
                if (eK(e.rest[n]) > i) {
                    return {
                        map: e.measure.maps[n],
                        cache: e.measure.caches[n],
                        before: true
                    };
                }
            }
        }
    }
    function iA(e, t) {
        t = tE(t);
        var i = eK(t);
        var r = (e.display.externalMeasured = new ie(e.doc, t, i));
        r.lineN = i;
        var n = (r.built = tj(e, r));
        r.text = n.pre;
        T(e.display.lineMeasure, n.pre);
        return r;
    }
    function iD(e, t, i, r) {
        return iM(e, iF(e, t), i, r);
    }
    function iH(e, t) {
        if (t >= e.display.viewFrom && t < e.display.viewTo) {
            return e.display.view[rl(e, t)];
        }
        var i = e.display.externalMeasured;
        if (i && t >= i.lineN && t < i.lineN + i.size) {
            return i;
        }
    }
    function iF(e, t) {
        var i = eK(t);
        var r = iH(e, i);
        if (r && !r.text) {
            r = null;
        } else if (r && r.changes) {
            ic(e, r, i, rt(e));
            e.curOp.forceUpdate = true;
        }
        if (!r) {
            r = iA(e, t);
        }
        var n = iN(r, t, i);
        return {
            line: t,
            view: r,
            rect: null,
            map: n.map,
            cache: n.cache,
            before: n.before,
            hasHeights: false
        };
    }
    function iM(e, t, i, r, n) {
        if (t.before) {
            i = -1;
        }
        var o = i + (r || ""), l;
        if (t.cache.hasOwnProperty(o)) {
            l = t.cache[o];
        } else {
            if (!t.rect) {
                t.rect = t.view.text.getBoundingClientRect();
            }
            if (!t.hasHeights) {
                iW(e, t.view, t.rect);
                t.hasHeights = true;
            }
            l = iE(e, t, i, r);
            if (!l.bogus) {
                t.cache[o] = l;
            }
        }
        return {
            left: l.left,
            right: l.right,
            top: n ? l.rtop : l.top,
            bottom: n ? l.rbottom : l.bottom
        };
    }
    var i1 = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function iP(e, t, i) {
        var r, n, o, l, s, a;
        for(var f = 0; f < e.length; f += 3){
            s = e[f];
            a = e[f + 1];
            if (t < s) {
                n = 0;
                o = 1;
                l = "left";
            } else if (t < a) {
                n = t - s;
                o = n + 1;
            } else if (f == e.length - 3 || (t == a && e[f + 3] > t)) {
                o = a - s;
                n = o - 1;
                if (t >= a) {
                    l = "right";
                }
            }
            if (n != null) {
                r = e[f + 2];
                if (s == a && i == (r.insertLeft ? "left" : "right")) {
                    l = i;
                }
                if (i == "left" && n == 0) {
                    while(f && e[f - 2] == e[f - 3] && e[f - 1].insertLeft){
                        r = e[(f -= 3) + 2];
                        l = "left";
                    }
                }
                if (i == "right" && n == a - s) {
                    while(f < e.length - 3 && e[f + 3] == e[f + 4] && !e[f + 5].insertLeft){
                        r = e[(f += 3) + 2];
                        l = "right";
                    }
                }
                break;
            }
        }
        return {
            node: r,
            start: n,
            end: o,
            collapse: l,
            coverStart: s,
            coverEnd: a
        };
    }
    function iz(e, t) {
        var i = i1;
        if (t == "left") {
            for(var r = 0; r < e.length; r++){
                if ((i = e[r]).left != i.right) {
                    break;
                }
            }
        } else {
            for(var n = e.length - 1; n >= 0; n--){
                if ((i = e[n]).left != i.right) {
                    break;
                }
            }
        }
        return i;
    }
    function iE(e, t, i, r) {
        var n = iP(t.map, i, r);
        var o = n.node, a = n.start, f = n.end, u = n.collapse;
        var c;
        if (o.nodeType == 3) {
            for(var h = 0; h < 4; h++){
                while(a && eo(t.line.text.charAt(n.coverStart + a))){
                    --a;
                }
                while(n.coverStart + f < n.coverEnd && eo(t.line.text.charAt(n.coverStart + f))){
                    ++f;
                }
                if (l && s < 9 && a == 0 && f == n.coverEnd - n.coverStart) {
                    c = o.parentNode.getBoundingClientRect();
                } else {
                    c = iz(W(o, a, f).getClientRects(), r);
                }
                if (c.left || c.right || a == 0) {
                    break;
                }
                f = a;
                a = a - 1;
                u = "right";
            }
            if (l && s < 11) {
                c = iI(e.display.measure, c);
            }
        } else {
            if (a > 0) {
                u = r = "right";
            }
            var d;
            if (e.options.lineWrapping && (d = o.getClientRects()).length > 1) {
                c = d[r == "right" ? d.length - 1 : 0];
            } else {
                c = o.getBoundingClientRect();
            }
        }
        if (l && s < 9 && !a && (!c || (!c.left && !c.right))) {
            var p = o.parentNode.getClientRects()[0];
            if (p) {
                c = {
                    left: p.left,
                    right: p.left + re(e.display),
                    top: p.top,
                    bottom: p.bottom
                };
            } else {
                c = i1;
            }
        }
        var v = c.top - t.rect.top, g = c.bottom - t.rect.top;
        var m = (v + g) / 2;
        var $ = t.view.measure.heights;
        var y = 0;
        for(; y < $.length - 1; y++){
            if (m < $[y]) {
                break;
            }
        }
        var _ = y ? $[y - 1] : 0, w = $[y];
        var b = {
            left: (u == "right" ? c.right : c.left) - t.rect.left,
            right: (u == "left" ? c.left : c.right) - t.rect.left,
            top: _,
            bottom: w
        };
        if (!c.left && !c.right) {
            b.bogus = true;
        }
        if (!e.options.singleCursorHeightPerLine) {
            b.rtop = v;
            b.rbottom = g;
        }
        return b;
    }
    function iI(e, t) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !eM(e)) {
            return t;
        }
        var i = screen.logicalXDPI / screen.deviceXDPI;
        var r = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: t.left * i,
            right: t.right * i,
            top: t.top * r,
            bottom: t.bottom * r
        };
    }
    function iR(e) {
        if (e.measure) {
            e.measure.cache = {};
            e.measure.heights = null;
            if (e.rest) {
                for(var t = 0; t < e.rest.length; t++){
                    e.measure.caches[t] = {};
                }
            }
        }
    }
    function i3(e) {
        e.display.externalMeasure = null;
        k(e.display.lineMeasure);
        for(var t = 0; t < e.display.view.length; t++){
            iR(e.display.view[t]);
        }
    }
    function i7(e) {
        i3(e);
        e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null;
        if (!e.options.lineWrapping) {
            e.display.maxLineChanged = true;
        }
        e.display.lineNumChars = null;
    }
    function iB() {
        if (u && g) {
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        }
        return (window.pageXOffset || (document.documentElement || document.body).scrollLeft);
    }
    function i4() {
        if (u && g) {
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        }
        return (window.pageYOffset || (document.documentElement || document.body).scrollTop);
    }
    function i6(e) {
        var t = tE(e);
        var i = t.widgets;
        var r = 0;
        if (i) {
            for(var n = 0; n < i.length; ++n){
                if (i[n].above) {
                    r += ix(i[n]);
                }
            }
        }
        return r;
    }
    function i5(e, t, i, r, n) {
        if (!n) {
            var o = i6(t);
            i.top += o;
            i.bottom += o;
        }
        if (r == "line") {
            return i;
        }
        if (!r) {
            r = "local";
        }
        var l = t6(t);
        if (r == "local") {
            l += iS(e.display);
        } else {
            l -= e.display.viewOffset;
        }
        if (r == "page" || r == "window") {
            var s = e.display.lineSpace.getBoundingClientRect();
            l += s.top + (r == "window" ? 0 : i4());
            var a = s.left + (r == "window" ? 0 : iB());
            i.left += a;
            i.right += a;
        }
        i.top += l;
        i.bottom += l;
        return i;
    }
    function i2(e, t, i) {
        if (i == "div") {
            return t;
        }
        var r = t.left, n = t.top;
        if (i == "page") {
            r -= iB();
            n -= i4();
        } else if (i == "local" || !i) {
            var o = e.display.sizer.getBoundingClientRect();
            r += o.left;
            n += o.top;
        }
        var l = e.display.lineSpace.getBoundingClientRect();
        return {
            left: r - l.left,
            top: n - l.top
        };
    }
    function iG(e, t, i, r, n) {
        if (!r) {
            r = e2(e.doc, t.line);
        }
        return i5(e, r, iD(e, r, t.ch, n), i);
    }
    function iU(e, t, i, r, n, o) {
        r = r || e2(e.doc, t.line);
        if (!n) {
            n = iF(e, r);
        }
        function l(t, l) {
            var s = iM(e, n, t, l ? "right" : "left", o);
            if (l) {
                s.left = s.right;
            } else {
                s.right = s.left;
            }
            return i5(e, r, s, i);
        }
        var s = eh(r, e.doc.direction), a = t.ch, f = t.sticky;
        if (a >= r.text.length) {
            a = r.text.length;
            f = "before";
        } else if (a <= 0) {
            a = 0;
            f = "after";
        }
        if (!s) {
            return l(f == "before" ? a - 1 : a, f == "before");
        }
        function u(e, t, i) {
            var r = s[t], n = r.level == 1;
            return l(i ? e - 1 : e, n != i);
        }
        var c = eu(s, a, f);
        var h = ef;
        var d = u(a, c, f == "before");
        if (h != null) {
            d.other = u(a, h, f != "before");
        }
        return d;
    }
    function iV(e, t) {
        var i = 0;
        t = tt(e.doc, t);
        if (!e.options.lineWrapping) {
            i = re(e.display) * t.ch;
        }
        var r = e2(e.doc, t.line);
        var n = t6(r) + iS(e.display);
        return {
            left: i,
            right: i,
            top: n,
            bottom: n + r.height
        };
    }
    function iK(e, t, i, r, n) {
        var o = e9(e, t, i);
        o.xRel = n;
        if (r) {
            o.outside = r;
        }
        return o;
    }
    function iX(e, t, i) {
        var r = e.doc;
        i += e.display.viewOffset;
        if (i < 0) {
            return iK(r.first, 0, null, -1, -1);
        }
        var n = eX(r, i), o = r.first + r.size - 1;
        if (n > o) {
            return iK(r.first + r.size - 1, e2(r, o).text.length, null, 1, 1);
        }
        if (t < 0) {
            t = 0;
        }
        var l = e2(r, n);
        for(;;){
            var s = iq(e, l, n, t, i);
            var a = tP(l, s.ch + (s.xRel > 0 || s.outside > 0 ? 1 : 0));
            if (!a) {
                return s;
            }
            var f = a.find(1);
            if (f.line == n) {
                return f;
            }
            l = e2(r, (n = f.line));
        }
    }
    function iY(e, t, i, r) {
        r -= i6(t);
        var n = t.text.length;
        var o = es(function(t) {
            return (iM(e, i, t - 1).bottom <= r);
        }, n, 0);
        n = es(function(t) {
            return iM(e, i, t).top > r;
        }, o, n);
        return {
            begin: o,
            end: n
        };
    }
    function ij(e, t, i, r) {
        if (!i) {
            i = iF(e, t);
        }
        var n = i5(e, t, iM(e, i, r), "line").top;
        return iY(e, t, i, n);
    }
    function i9(e, t, i, r) {
        return e.bottom <= i ? false : e.top > i ? true : (r ? e.left : e.right) > t;
    }
    function iq(e, t, i, r, n) {
        n -= t6(t);
        var o = iF(e, t);
        var l = i6(t);
        var s = 0, a = t.text.length, f = true;
        var u = eh(t, e.doc.direction);
        if (u) {
            var c = (e.options.lineWrapping ? iZ : i8)(e, t, i, o, u, r, n);
            f = c.level != 1;
            s = f ? c.from : c.to - 1;
            a = f ? c.to : c.from - 1;
        }
        var h = null, d = null;
        var p = es(function(t) {
            var i = iM(e, o, t);
            i.top += l;
            i.bottom += l;
            if (!i9(i, r, n, false)) {
                return false;
            }
            if (i.top <= n && i.left <= r) {
                h = t;
                d = i;
            }
            return true;
        }, s, a);
        var v, g, m = false;
        if (d) {
            var $ = r - d.left < d.right - r, y = $ == f;
            p = h + (y ? 0 : 1);
            g = y ? "after" : "before";
            v = $ ? d.left : d.right;
        } else {
            if (!f && (p == a || p == s)) {
                p++;
            }
            g = p == 0 ? "after" : p == t.text.length ? "before" : iM(e, o, p - (f ? 1 : 0)).bottom + l <= n == f ? "after" : "before";
            var _ = iU(e, e9(i, p, g), "line", t, o);
            v = _.left;
            m = n < _.top ? -1 : n >= _.bottom ? 1 : 0;
        }
        p = el(t.text, p, 1);
        return iK(i, p, g, m, r - v);
    }
    function i8(e, t, i, r, n, o, l) {
        var s = es(function(s) {
            var a = n[s], f = a.level != 1;
            return i9(iU(e, e9(i, f ? a.to : a.from, f ? "before" : "after"), "line", t, r), o, l, true);
        }, 0, n.length - 1);
        var a = n[s];
        if (s > 0) {
            var f = a.level != 1;
            var u = iU(e, e9(i, f ? a.from : a.to, f ? "after" : "before"), "line", t, r);
            if (i9(u, o, l, true) && u.top > l) {
                a = n[s - 1];
            }
        }
        return a;
    }
    function iZ(e, t, i, r, n, o, l) {
        var s = iY(e, t, r, l);
        var a = s.begin;
        var f = s.end;
        if (/\s/.test(t.text.charAt(f - 1))) {
            f--;
        }
        var u = null, c = null;
        for(var h = 0; h < n.length; h++){
            var d = n[h];
            if (d.from >= f || d.to <= a) {
                continue;
            }
            var p = d.level != 1;
            var v = iM(e, r, p ? Math.min(f, d.to) - 1 : Math.max(a, d.from)).right;
            var g = v < o ? o - v + 1e9 : v - o;
            if (!u || c > g) {
                u = d;
                c = g;
            }
        }
        if (!u) {
            u = n[n.length - 1];
        }
        if (u.from < a) {
            u = {
                from: a,
                to: u.to,
                level: u.level
            };
        }
        if (u.to > f) {
            u = {
                from: u.from,
                to: f,
                level: u.level
            };
        }
        return u;
    }
    var iJ;
    function iQ(e) {
        if (e.cachedTextHeight != null) {
            return e.cachedTextHeight;
        }
        if (iJ == null) {
            iJ = L("pre", null, "CodeMirror-line-like");
            for(var t = 0; t < 49; ++t){
                iJ.appendChild(document.createTextNode("x"));
                iJ.appendChild(L("br"));
            }
            iJ.appendChild(document.createTextNode("x"));
        }
        T(e.measure, iJ);
        var i = iJ.offsetHeight / 50;
        if (i > 3) {
            e.cachedTextHeight = i;
        }
        k(e.measure);
        return i || 1;
    }
    function re(e) {
        if (e.cachedCharWidth != null) {
            return e.cachedCharWidth;
        }
        var t = L("span", "xxxxxxxxxx");
        var i = L("pre", [
            t
        ], "CodeMirror-line-like");
        T(e.measure, i);
        var r = t.getBoundingClientRect(), n = (r.right - r.left) / 10;
        if (n > 2) {
            e.cachedCharWidth = n;
        }
        return n || 10;
    }
    function rt(e) {
        var t = e.display, i = {}, r = {};
        var n = t.gutters.clientLeft;
        for(var o = t.gutters.firstChild, l = 0; o; o = o.nextSibling, ++l){
            var s = e.display.gutterSpecs[l].className;
            i[s] = o.offsetLeft + o.clientLeft + n;
            r[s] = o.clientWidth;
        }
        return {
            fixedPos: ri(t),
            gutterTotalWidth: t.gutters.offsetWidth,
            gutterLeft: i,
            gutterWidth: r,
            wrapperWidth: t.wrapper.clientWidth
        };
    }
    function ri(e) {
        return (e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left);
    }
    function rr(e) {
        var t = iQ(e.display), i = e.options.lineWrapping;
        var r = i && Math.max(5, e.display.scroller.clientWidth / re(e.display) - 3);
        return function(n) {
            if (tB(e.doc, n)) {
                return 0;
            }
            var o = 0;
            if (n.widgets) {
                for(var l = 0; l < n.widgets.length; l++){
                    if (n.widgets[l].height) {
                        o += n.widgets[l].height;
                    }
                }
            }
            if (i) {
                return (o + (Math.ceil(n.text.length / r) || 1) * t);
            } else {
                return o + t;
            }
        };
    }
    function rn(e) {
        var t = e.doc, i = rr(e);
        t.iter(function(e) {
            var t = i(e);
            if (t != e.height) {
                eV(e, t);
            }
        });
    }
    function ro(e, t, i, r) {
        var n = e.display;
        if (!i && ek(t).getAttribute("cm-not-content") == "true") {
            return null;
        }
        var o, l, s = n.lineSpace.getBoundingClientRect();
        try {
            o = t.clientX - s.left;
            l = t.clientY - s.top;
        } catch (a) {
            return null;
        }
        var f = iX(e, o, l), u;
        if (r && f.xRel > 0 && (u = e2(e.doc, f.line).text).length == f.ch) {
            var c = z(u, u.length, e.options.tabSize) - u.length;
            f = e9(f.line, Math.max(0, Math.round((o - iT(e.display).left) / re(e.display)) - c));
        }
        return f;
    }
    function rl(e, t) {
        if (t >= e.display.viewTo) {
            return null;
        }
        t -= e.display.viewFrom;
        if (t < 0) {
            return null;
        }
        var i = e.display.view;
        for(var r = 0; r < i.length; r++){
            t -= i[r].size;
            if (t < 0) {
                return r;
            }
        }
    }
    function rs(e, t, i, r) {
        if (t == null) {
            t = e.doc.first;
        }
        if (i == null) {
            i = e.doc.first + e.doc.size;
        }
        if (!r) {
            r = 0;
        }
        var n = e.display;
        if (r && i < n.viewTo && (n.updateLineNumbers == null || n.updateLineNumbers > t)) {
            n.updateLineNumbers = t;
        }
        e.curOp.viewChanged = true;
        if (t >= n.viewTo) {
            if (ty && t3(e.doc, t) < n.viewTo) {
                rf(e);
            }
        } else if (i <= n.viewFrom) {
            if (ty && t7(e.doc, i + r) > n.viewFrom) {
                rf(e);
            } else {
                n.viewFrom += r;
                n.viewTo += r;
            }
        } else if (t <= n.viewFrom && i >= n.viewTo) {
            rf(e);
        } else if (t <= n.viewFrom) {
            var o = ru(e, i, i + r, 1);
            if (o) {
                n.view = n.view.slice(o.index);
                n.viewFrom = o.lineN;
                n.viewTo += r;
            } else {
                rf(e);
            }
        } else if (i >= n.viewTo) {
            var l = ru(e, t, t, -1);
            if (l) {
                n.view = n.view.slice(0, l.index);
                n.viewTo = l.lineN;
            } else {
                rf(e);
            }
        } else {
            var s = ru(e, t, t, -1);
            var a = ru(e, i, i + r, 1);
            if (s && a) {
                n.view = n.view.slice(0, s.index).concat(it(e, s.lineN, a.lineN)).concat(n.view.slice(a.index));
                n.viewTo += r;
            } else {
                rf(e);
            }
        }
        var f = n.externalMeasured;
        if (f) {
            if (i < f.lineN) {
                f.lineN += r;
            } else if (t < f.lineN + f.size) {
                n.externalMeasured = null;
            }
        }
    }
    function ra(e, t, i) {
        e.curOp.viewChanged = true;
        var r = e.display, n = e.display.externalMeasured;
        if (n && t >= n.lineN && t < n.lineN + n.size) {
            r.externalMeasured = null;
        }
        if (t < r.viewFrom || t >= r.viewTo) {
            return;
        }
        var o = r.view[rl(e, t)];
        if (o.node == null) {
            return;
        }
        var l = o.changes || (o.changes = []);
        if (I(l, i) == -1) {
            l.push(i);
        }
    }
    function rf(e) {
        e.display.viewFrom = e.display.viewTo = e.doc.first;
        e.display.view = [];
        e.display.viewOffset = 0;
    }
    function ru(e, t, i, r) {
        var n = rl(e, t), o, l = e.display.view;
        if (!ty || i == e.doc.first + e.doc.size) {
            return {
                index: n,
                lineN: i
            };
        }
        var s = e.display.viewFrom;
        for(var a = 0; a < n; a++){
            s += l[a].size;
        }
        if (s != t) {
            if (r > 0) {
                if (n == l.length - 1) {
                    return null;
                }
                o = s + l[n].size - t;
                n++;
            } else {
                o = s - t;
            }
            t += o;
            i += o;
        }
        while(t3(e.doc, i) != i){
            if (n == (r < 0 ? 0 : l.length - 1)) {
                return null;
            }
            i += r * l[n - (r < 0 ? 1 : 0)].size;
            n += r;
        }
        return {
            index: n,
            lineN: i
        };
    }
    function rc(e, t, i) {
        var r = e.display, n = r.view;
        if (n.length == 0 || t >= r.viewTo || i <= r.viewFrom) {
            r.view = it(e, t, i);
            r.viewFrom = t;
        } else {
            if (r.viewFrom > t) {
                r.view = it(e, t, r.viewFrom).concat(r.view);
            } else if (r.viewFrom < t) {
                r.view = r.view.slice(rl(e, t));
            }
            r.viewFrom = t;
            if (r.viewTo < i) {
                r.view = r.view.concat(it(e, r.viewTo, i));
            } else if (r.viewTo > i) {
                r.view = r.view.slice(0, rl(e, i));
            }
        }
        r.viewTo = i;
    }
    function rh(e) {
        var t = e.display.view, i = 0;
        for(var r = 0; r < t.length; r++){
            var n = t[r];
            if (!n.hidden && (!n.node || n.changes)) {
                ++i;
            }
        }
        return i;
    }
    function rd(e) {
        e.display.input.showSelection(e.display.input.prepareSelection());
    }
    function rp(e, t) {
        if (t === void 0) t = true;
        var i = e.doc, r = {};
        var n = (r.cursors = document.createDocumentFragment());
        var o = (r.selection = document.createDocumentFragment());
        var l = e.options.$customCursor;
        if (l) {
            t = true;
        }
        for(var s = 0; s < i.sel.ranges.length; s++){
            if (!t && s == i.sel.primIndex) {
                continue;
            }
            var a = i.sel.ranges[s];
            if (a.from().line >= e.display.viewTo || a.to().line < e.display.viewFrom) {
                continue;
            }
            var f = a.empty();
            if (l) {
                var u = l(e, a);
                if (u) {
                    rv(e, u, n);
                }
            } else if (f || e.options.showCursorWhenSelecting) {
                rv(e, a.head, n);
            }
            if (!f) {
                rm(e, a, o);
            }
        }
        return r;
    }
    function rv(e, t, i) {
        var r = iU(e, t, "div", null, null, !e.options.singleCursorHeightPerLine);
        var n = i.appendChild(L("div", "\u00a0", "CodeMirror-cursor"));
        n.style.left = r.left + "px";
        n.style.top = r.top + "px";
        n.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(e.getWrapperElement().className)) {
            var o = iG(e, t, "div", null, null);
            var l = o.right - o.left;
            n.style.width = (l > 0 ? l : e.defaultCharWidth()) + "px";
        }
        if (r.other) {
            var s = i.appendChild(L("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            s.style.display = "";
            s.style.left = r.other.left + "px";
            s.style.top = r.other.top + "px";
            s.style.height = (r.other.bottom - r.other.top) * 0.85 + "px";
        }
    }
    function rg(e, t) {
        return e.top - t.top || e.left - t.left;
    }
    function rm(e, t, i) {
        var r = e.display, n = e.doc;
        var o = document.createDocumentFragment();
        var l = iT(e.display), s = l.left;
        var a = Math.max(r.sizerWidth, iO(e) - r.sizer.offsetLeft) - l.right;
        var f = n.direction == "ltr";
        function u(e, t, i, r) {
            if (t < 0) {
                t = 0;
            }
            t = Math.round(t);
            r = Math.round(r);
            o.appendChild(L("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px;\n                             top: " + t + "px; width: " + (i == null ? a - e : i) + "px;\n                             height: " + (r - t) + "px"));
        }
        function c(t, i, r) {
            var o = e2(n, t);
            var l = o.text.length;
            var c, h;
            function d(i, r) {
                return iG(e, e9(t, i), "div", o, r);
            }
            function p(t, i, r) {
                var n = ij(e, o, null, t);
                var l = (i == "ltr") == (r == "after") ? "left" : "right";
                var s = r == "after" ? n.begin : n.end - (/\s/.test(o.text.charAt(n.end - 1)) ? 2 : 1);
                return d(s, l)[l];
            }
            var v = eh(o, n.direction);
            ea(v, i || 0, r == null ? l : r, function(e, t, n, o) {
                var g = n == "ltr";
                var m = d(e, g ? "left" : "right");
                var $ = d(t - 1, g ? "right" : "left");
                var y = i == null && e == 0, _ = r == null && t == l;
                var w = o == 0, b = !v || o == v.length - 1;
                if ($.top - m.top <= 3) {
                    var x = (f ? y : _) && w;
                    var C = (f ? _ : y) && b;
                    var S = x ? s : (g ? m : $).left;
                    var k = C ? a : (g ? $ : m).right;
                    u(S, m.top, k - S, m.bottom);
                } else {
                    var T, L, O, W;
                    if (g) {
                        T = f && y && w ? s : m.left;
                        L = f ? a : p(e, n, "before");
                        O = f ? s : p(t, n, "after");
                        W = f && _ && b ? a : $.right;
                    } else {
                        T = !f ? s : p(e, n, "before");
                        L = !f && y && w ? a : m.right;
                        O = !f && _ && b ? s : $.left;
                        W = !f ? a : p(t, n, "after");
                    }
                    u(T, m.top, L - T, m.bottom);
                    if (m.bottom < $.top) {
                        u(s, m.bottom, null, $.top);
                    }
                    u(O, $.top, W - O, $.bottom);
                }
                if (!c || rg(m, c) < 0) {
                    c = m;
                }
                if (rg($, c) < 0) {
                    c = $;
                }
                if (!h || rg(m, h) < 0) {
                    h = m;
                }
                if (rg($, h) < 0) {
                    h = $;
                }
            });
            return {
                start: c,
                end: h
            };
        }
        var h = t.from(), d = t.to();
        if (h.line == d.line) {
            c(h.line, h.ch, d.ch);
        } else {
            var p = e2(n, h.line), v = e2(n, d.line);
            var g = tE(p) == tE(v);
            var m = c(h.line, h.ch, g ? p.text.length + 1 : null).end;
            var $ = c(d.line, g ? 0 : null, d.ch).start;
            if (g) {
                if (m.top < $.top - 2) {
                    u(m.right, m.top, null, m.bottom);
                    u(s, $.top, $.left, $.bottom);
                } else {
                    u(m.right, m.top, $.left - m.right, m.bottom);
                }
            }
            if (m.bottom < $.top) {
                u(s, m.bottom, null, $.top);
            }
        }
        i.appendChild(o);
    }
    function r$(e) {
        if (!e.state.focused) {
            return;
        }
        var t = e.display;
        clearInterval(t.blinker);
        var i = true;
        t.cursorDiv.style.visibility = "";
        if (e.options.cursorBlinkRate > 0) {
            t.blinker = setInterval(function() {
                if (!e.hasFocus()) {
                    rb(e);
                }
                t.cursorDiv.style.visibility = (i = !i) ? "" : "hidden";
            }, e.options.cursorBlinkRate);
        } else if (e.options.cursorBlinkRate < 0) {
            t.cursorDiv.style.visibility = "hidden";
        }
    }
    function ry(e) {
        if (!e.hasFocus()) {
            e.display.input.focus();
            if (!e.state.focused) {
                rw(e);
            }
        }
    }
    function r_(e) {
        e.state.delayingBlurEvent = true;
        setTimeout(function() {
            if (e.state.delayingBlurEvent) {
                e.state.delayingBlurEvent = false;
                if (e.state.focused) {
                    rb(e);
                }
            }
        }, 100);
    }
    function rw(e, t) {
        if (e.state.delayingBlurEvent && !e.state.draggingText) {
            e.state.delayingBlurEvent = false;
        }
        if (e.options.readOnly == "nocursor") {
            return;
        }
        if (!e.state.focused) {
            em(e, "focus", e, t);
            e.state.focused = true;
            D(e.display.wrapper, "CodeMirror-focused");
            if (!e.curOp && e.display.selForContextMenu != e.doc.sel) {
                e.display.input.reset();
                if (a) {
                    setTimeout(function() {
                        return e.display.input.reset(true);
                    }, 20);
                }
            }
            e.display.input.receivedFocus();
        }
        r$(e);
    }
    function rb(e, t) {
        if (e.state.delayingBlurEvent) {
            return;
        }
        if (e.state.focused) {
            em(e, "blur", e, t);
            e.state.focused = false;
            S(e.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(e.display.blinker);
        setTimeout(function() {
            if (!e.state.focused) {
                e.display.shift = false;
            }
        }, 150);
    }
    function rx(e) {
        var t = e.display;
        var i = t.lineDiv.offsetTop;
        var r = Math.max(0, t.scroller.getBoundingClientRect().top);
        var n = t.lineDiv.getBoundingClientRect().top;
        var o = 0;
        for(var a = 0; a < t.view.length; a++){
            var f = t.view[a], u = e.options.lineWrapping;
            var c = void 0, h = 0;
            if (f.hidden) {
                continue;
            }
            n += f.line.height;
            if (l && s < 8) {
                var d = f.node.offsetTop + f.node.offsetHeight;
                c = d - i;
                i = d;
            } else {
                var p = f.node.getBoundingClientRect();
                c = p.bottom - p.top;
                if (!u && f.text.firstChild) {
                    h = f.text.firstChild.getBoundingClientRect().right - p.left - 1;
                }
            }
            var v = f.line.height - c;
            if (v > 0.005 || v < -0.005) {
                if (n < r) {
                    o -= v;
                }
                eV(f.line, c);
                rC(f.line);
                if (f.rest) {
                    for(var g = 0; g < f.rest.length; g++){
                        rC(f.rest[g]);
                    }
                }
            }
            if (h > e.display.sizerWidth) {
                var m = Math.ceil(h / re(e.display));
                if (m > e.display.maxLineLength) {
                    e.display.maxLineLength = m;
                    e.display.maxLine = f.line;
                    e.display.maxLineChanged = true;
                }
            }
        }
        if (Math.abs(o) > 2) {
            t.scroller.scrollTop += o;
        }
    }
    function rC(e) {
        if (e.widgets) {
            for(var t = 0; t < e.widgets.length; ++t){
                var i = e.widgets[t], r = i.node.parentNode;
                if (r) {
                    i.height = r.offsetHeight;
                }
            }
        }
    }
    function rS(e, t, i) {
        var r = i && i.top != null ? Math.max(0, i.top) : e.scroller.scrollTop;
        r = Math.floor(r - iS(e));
        var n = i && i.bottom != null ? i.bottom : r + e.wrapper.clientHeight;
        var o = eX(t, r), l = eX(t, n);
        if (i && i.ensure) {
            var s = i.ensure.from.line, a = i.ensure.to.line;
            if (s < o) {
                o = s;
                l = eX(t, t6(e2(t, s)) + e.wrapper.clientHeight);
            } else if (Math.min(a, t.lastLine()) >= l) {
                o = eX(t, t6(e2(t, a)) - e.wrapper.clientHeight);
                l = a;
            }
        }
        return {
            from: o,
            to: Math.max(l, o + 1)
        };
    }
    function rk(e, t) {
        if (e$(e, "scrollCursorIntoView")) {
            return;
        }
        var i = e.display, r = i.sizer.getBoundingClientRect(), n = null;
        if (t.top + r.top < 0) {
            n = true;
        } else if (t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight)) {
            n = false;
        }
        if (n != null && !p) {
            var o = L("div", "\u200b", null, "position: absolute;\n                         top: " + (t.top - i.viewOffset - iS(e.display)) + "px;\n                         height: " + (t.bottom - t.top + iL(e) + i.barHeight) + "px;\n                         left: " + t.left + "px; width: " + Math.max(2, t.right - t.left) + "px;");
            e.display.lineSpace.appendChild(o);
            o.scrollIntoView(n);
            e.display.lineSpace.removeChild(o);
        }
    }
    function rT(e, t, i, r) {
        if (r == null) {
            r = 0;
        }
        var n;
        if (!e.options.lineWrapping && t == i) {
            i = t.sticky == "before" ? e9(t.line, t.ch + 1, "before") : t;
            t = t.ch ? e9(t.line, t.sticky == "before" ? t.ch - 1 : t.ch, "after") : t;
        }
        for(var o = 0; o < 5; o++){
            var l = false;
            var s = iU(e, t);
            var a = !i || i == t ? s : iU(e, i);
            n = {
                left: Math.min(s.left, a.left),
                top: Math.min(s.top, a.top) - r,
                right: Math.max(s.left, a.left),
                bottom: Math.max(s.bottom, a.bottom) + r
            };
            var f = rO(e, n);
            var u = e.doc.scrollTop, c = e.doc.scrollLeft;
            if (f.scrollTop != null) {
                rF(e, f.scrollTop);
                if (Math.abs(e.doc.scrollTop - u) > 1) {
                    l = true;
                }
            }
            if (f.scrollLeft != null) {
                r1(e, f.scrollLeft);
                if (Math.abs(e.doc.scrollLeft - c) > 1) {
                    l = true;
                }
            }
            if (!l) {
                break;
            }
        }
        return n;
    }
    function rL(e, t) {
        var i = rO(e, t);
        if (i.scrollTop != null) {
            rF(e, i.scrollTop);
        }
        if (i.scrollLeft != null) {
            r1(e, i.scrollLeft);
        }
    }
    function rO(e, t) {
        var i = e.display, r = iQ(e.display);
        if (t.top < 0) {
            t.top = 0;
        }
        var n = e.curOp && e.curOp.scrollTop != null ? e.curOp.scrollTop : i.scroller.scrollTop;
        var o = i0(e), l = {};
        if (t.bottom - t.top > o) {
            t.bottom = t.top + o;
        }
        var s = e.doc.height + ik(i);
        var a = t.top < r, f = t.bottom > s - r;
        if (t.top < n) {
            l.scrollTop = a ? 0 : t.top;
        } else if (t.bottom > n + o) {
            var u = Math.min(t.top, (f ? s : t.bottom) - o);
            if (u != n) {
                l.scrollTop = u;
            }
        }
        var c = e.options.fixedGutter ? 0 : i.gutters.offsetWidth;
        var h = e.curOp && e.curOp.scrollLeft != null ? e.curOp.scrollLeft : i.scroller.scrollLeft - c;
        var d = iO(e) - i.gutters.offsetWidth;
        var p = t.right - t.left > d;
        if (p) {
            t.right = t.left + d;
        }
        if (t.left < 10) {
            l.scrollLeft = 0;
        } else if (t.left < h) {
            l.scrollLeft = Math.max(0, t.left + c - (p ? 0 : 10));
        } else if (t.right > d + h - 3) {
            l.scrollLeft = t.right + (p ? 0 : 10) - d;
        }
        return l;
    }
    function r0(e, t) {
        if (t == null) {
            return;
        }
        rD(e);
        e.curOp.scrollTop = (e.curOp.scrollTop == null ? e.doc.scrollTop : e.curOp.scrollTop) + t;
    }
    function rW(e) {
        rD(e);
        var t = e.getCursor();
        e.curOp.scrollToPos = {
            from: t,
            to: t,
            margin: e.options.cursorScrollMargin
        };
    }
    function rN(e, t, i) {
        if (t != null || i != null) {
            rD(e);
        }
        if (t != null) {
            e.curOp.scrollLeft = t;
        }
        if (i != null) {
            e.curOp.scrollTop = i;
        }
    }
    function rA(e, t) {
        rD(e);
        e.curOp.scrollToPos = t;
    }
    function rD(e) {
        var t = e.curOp.scrollToPos;
        if (t) {
            e.curOp.scrollToPos = null;
            var i = iV(e, t.from), r = iV(e, t.to);
            rH(e, i, r, t.margin);
        }
    }
    function rH(e, t, i, r) {
        var n = rO(e, {
            left: Math.min(t.left, i.left),
            top: Math.min(t.top, i.top) - r,
            right: Math.max(t.right, i.right),
            bottom: Math.max(t.bottom, i.bottom) + r
        });
        rN(e, n.scrollLeft, n.scrollTop);
    }
    function rF(e, t) {
        if (Math.abs(e.doc.scrollTop - t) < 2) {
            return;
        }
        if (!i) {
            nr(e, {
                top: t
            });
        }
        rM(e, t, true);
        if (i) {
            nr(e);
        }
        rq(e, 100);
    }
    function rM(e, t, i) {
        t = Math.max(0, Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t));
        if (e.display.scroller.scrollTop == t && !i) {
            return;
        }
        e.doc.scrollTop = t;
        e.display.scrollbars.setScrollTop(t);
        if (e.display.scroller.scrollTop != t) {
            e.display.scroller.scrollTop = t;
        }
    }
    function r1(e, t, i, r) {
        t = Math.max(0, Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth));
        if ((i ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !r) {
            return;
        }
        e.doc.scrollLeft = t;
        ns(e);
        if (e.display.scroller.scrollLeft != t) {
            e.display.scroller.scrollLeft = t;
        }
        e.display.scrollbars.setScrollLeft(t);
    }
    function rP(e) {
        var t = e.display, i = t.gutters.offsetWidth;
        var r = Math.round(e.doc.height + ik(e.display));
        return {
            clientHeight: t.scroller.clientHeight,
            viewHeight: t.wrapper.clientHeight,
            scrollWidth: t.scroller.scrollWidth,
            clientWidth: t.scroller.clientWidth,
            viewWidth: t.wrapper.clientWidth,
            barLeft: e.options.fixedGutter ? i : 0,
            docHeight: r,
            scrollHeight: r + iL(e) + t.barHeight,
            nativeBarWidth: t.nativeBarWidth,
            gutterWidth: i
        };
    }
    var rz = function(e, t, i) {
        this.cm = i;
        var r = (this.vert = L("div", [
            L("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar"));
        var n = (this.horiz = L("div", [
            L("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar"));
        r.tabIndex = n.tabIndex = -1;
        e(r);
        e(n);
        ep(r, "scroll", function() {
            if (r.clientHeight) {
                t(r.scrollTop, "vertical");
            }
        });
        ep(n, "scroll", function() {
            if (n.clientWidth) {
                t(n.scrollLeft, "horizontal");
            }
        });
        this.checkedZeroWidth = false;
        if (l && s < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
    };
    rz.prototype.update = function(e) {
        var t = e.scrollWidth > e.clientWidth + 1;
        var i = e.scrollHeight > e.clientHeight + 1;
        var r = e.nativeBarWidth;
        if (i) {
            this.vert.style.display = "block";
            this.vert.style.bottom = t ? r + "px" : "0";
            var n = e.viewHeight - (t ? r : 0);
            this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + n) + "px";
        } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
        }
        if (t) {
            this.horiz.style.display = "block";
            this.horiz.style.right = i ? r + "px" : "0";
            this.horiz.style.left = e.barLeft + "px";
            var o = e.viewWidth - e.barLeft - (i ? r : 0);
            this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + o) + "px";
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && e.clientHeight > 0) {
            if (r == 0) {
                this.zeroWidthHack();
            }
            this.checkedZeroWidth = true;
        }
        return {
            right: i ? r : 0,
            bottom: t ? r : 0
        };
    };
    rz.prototype.setScrollLeft = function(e) {
        if (this.horiz.scrollLeft != e) {
            this.horiz.scrollLeft = e;
        }
        if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
    };
    rz.prototype.setScrollTop = function(e) {
        if (this.vert.scrollTop != e) {
            this.vert.scrollTop = e;
        }
        if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
    };
    rz.prototype.zeroWidthHack = function() {
        var e = $ && !d ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = e;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new E();
        this.disableVert = new E();
    };
    rz.prototype.enableZeroWidthBar = function(e, t, i) {
        e.style.pointerEvents = "auto";
        function r() {
            var n = e.getBoundingClientRect();
            var o = i == "vert" ? document.elementFromPoint(n.right - 1, (n.top + n.bottom) / 2) : document.elementFromPoint((n.right + n.left) / 2, n.bottom - 1);
            if (o != e) {
                e.style.pointerEvents = "none";
            } else {
                t.set(1000, r);
            }
        }
        t.set(1000, r);
    };
    rz.prototype.clear = function() {
        var e = this.horiz.parentNode;
        e.removeChild(this.horiz);
        e.removeChild(this.vert);
    };
    var rE = function() {};
    rE.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    };
    rE.prototype.setScrollLeft = function() {};
    rE.prototype.setScrollTop = function() {};
    rE.prototype.clear = function() {};
    function rI(e, t) {
        if (!t) {
            t = rP(e);
        }
        var i = e.display.barWidth, r = e.display.barHeight;
        rR(e, t);
        for(var n = 0; (n < 4 && i != e.display.barWidth) || r != e.display.barHeight; n++){
            if (i != e.display.barWidth && e.options.lineWrapping) {
                rx(e);
            }
            rR(e, rP(e));
            i = e.display.barWidth;
            r = e.display.barHeight;
        }
    }
    function rR(e, t) {
        var i = e.display;
        var r = i.scrollbars.update(t);
        i.sizer.style.paddingRight = (i.barWidth = r.right) + "px";
        i.sizer.style.paddingBottom = (i.barHeight = r.bottom) + "px";
        i.heightForcer.style.borderBottom = r.bottom + "px solid transparent";
        if (r.right && r.bottom) {
            i.scrollbarFiller.style.display = "block";
            i.scrollbarFiller.style.height = r.bottom + "px";
            i.scrollbarFiller.style.width = r.right + "px";
        } else {
            i.scrollbarFiller.style.display = "";
        }
        if (r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter) {
            i.gutterFiller.style.display = "block";
            i.gutterFiller.style.height = r.bottom + "px";
            i.gutterFiller.style.width = t.gutterWidth + "px";
        } else {
            i.gutterFiller.style.display = "";
        }
    }
    var r3 = {
        native: rz,
        null: rE
    };
    function r7(e) {
        if (e.display.scrollbars) {
            e.display.scrollbars.clear();
            if (e.display.scrollbars.addClass) {
                S(e.display.wrapper, e.display.scrollbars.addClass);
            }
        }
        e.display.scrollbars = new r3[e.options.scrollbarStyle](function(t) {
            e.display.wrapper.insertBefore(t, e.display.scrollbarFiller);
            ep(t, "mousedown", function() {
                if (e.state.focused) {
                    setTimeout(function() {
                        return e.display.input.focus();
                    }, 0);
                }
            });
            t.setAttribute("cm-not-content", "true");
        }, function(t, i) {
            if (i == "horizontal") {
                r1(e, t);
            } else {
                rF(e, t);
            }
        }, e);
        if (e.display.scrollbars.addClass) {
            D(e.display.wrapper, e.display.scrollbars.addClass);
        }
    }
    var rB = 0;
    function r4(e) {
        e.curOp = {
            cm: e,
            viewChanged: false,
            startHeight: e.doc.height,
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
            id: ++rB,
            markArrays: null
        };
        ir(e.curOp);
    }
    function r6(e) {
        var t = e.curOp;
        if (t) {
            il(t, function(e) {
                for(var t = 0; t < e.ops.length; t++){
                    e.ops[t].cm.curOp = null;
                }
                r5(e);
            });
        }
    }
    function r5(e) {
        var t = e.ops;
        for(var i = 0; i < t.length; i++){
            r2(t[i]);
        }
        for(var r = 0; r < t.length; r++){
            rG(t[r]);
        }
        for(var n = 0; n < t.length; n++){
            rU(t[n]);
        }
        for(var o = 0; o < t.length; o++){
            rV(t[o]);
        }
        for(var l = 0; l < t.length; l++){
            rK(t[l]);
        }
    }
    function r2(e) {
        var t = e.cm, i = t.display;
        rJ(t);
        if (e.updateMaxLine) {
            t2(t);
        }
        e.mustUpdate = e.viewChanged || e.forceUpdate || e.scrollTop != null || (e.scrollToPos && (e.scrollToPos.from.line < i.viewFrom || e.scrollToPos.to.line >= i.viewTo)) || (i.maxLineChanged && t.options.lineWrapping);
        e.update = e.mustUpdate && new rZ(t, e.mustUpdate && {
            top: e.scrollTop,
            ensure: e.scrollToPos
        }, e.forceUpdate);
    }
    function rG(e) {
        e.updatedDisplay = e.mustUpdate && nt(e.cm, e.update);
    }
    function rU(e) {
        var t = e.cm, i = t.display;
        if (e.updatedDisplay) {
            rx(t);
        }
        e.barMeasure = rP(t);
        if (i.maxLineChanged && !t.options.lineWrapping) {
            e.adjustWidthTo = iD(t, i.maxLine, i.maxLine.text.length).left + 3;
            t.display.sizerWidth = e.adjustWidthTo;
            e.barMeasure.scrollWidth = Math.max(i.scroller.clientWidth, i.sizer.offsetLeft + e.adjustWidthTo + iL(t) + t.display.barWidth);
            e.maxScrollLeft = Math.max(0, i.sizer.offsetLeft + e.adjustWidthTo - iO(t));
        }
        if (e.updatedDisplay || e.selectionChanged) {
            e.preparedSelection = i.input.prepareSelection();
        }
    }
    function rV(e) {
        var t = e.cm;
        if (e.adjustWidthTo != null) {
            t.display.sizer.style.minWidth = e.adjustWidthTo + "px";
            if (e.maxScrollLeft < t.doc.scrollLeft) {
                r1(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), true);
            }
            t.display.maxLineChanged = false;
        }
        var i = e.focus && e.focus == A();
        if (e.preparedSelection) {
            t.display.input.showSelection(e.preparedSelection, i);
        }
        if (e.updatedDisplay || e.startHeight != t.doc.height) {
            rI(t, e.barMeasure);
        }
        if (e.updatedDisplay) {
            nl(t, e.barMeasure);
        }
        if (e.selectionChanged) {
            r$(t);
        }
        if (t.state.focused && e.updateInput) {
            t.display.input.reset(e.typing);
        }
        if (i) {
            ry(e.cm);
        }
    }
    function rK(e) {
        var t = e.cm, i = t.display, r = t.doc;
        if (e.updatedDisplay) {
            ni(t, e.update);
        }
        if (i.wheelStartX != null && (e.scrollTop != null || e.scrollLeft != null || e.scrollToPos)) {
            i.wheelStartX = i.wheelStartY = null;
        }
        if (e.scrollTop != null) {
            rM(t, e.scrollTop, e.forceScroll);
        }
        if (e.scrollLeft != null) {
            r1(t, e.scrollLeft, true, true);
        }
        if (e.scrollToPos) {
            var n = rT(t, tt(r, e.scrollToPos.from), tt(r, e.scrollToPos.to), e.scrollToPos.margin);
            rk(t, n);
        }
        var o = e.maybeHiddenMarkers, l = e.maybeUnhiddenMarkers;
        if (o) {
            for(var s = 0; s < o.length; ++s){
                if (!o[s].lines.length) {
                    em(o[s], "hide");
                }
            }
        }
        if (l) {
            for(var a = 0; a < l.length; ++a){
                if (l[a].lines.length) {
                    em(l[a], "unhide");
                }
            }
        }
        if (i.wrapper.offsetHeight) {
            r.scrollTop = t.display.scroller.scrollTop;
        }
        if (e.changeObjs) {
            em(t, "changes", t, e.changeObjs);
        }
        if (e.update) {
            e.update.finish();
        }
    }
    function rX(e, t) {
        if (e.curOp) {
            return t();
        }
        r4(e);
        try {
            return t();
        } finally{
            r6(e);
        }
    }
    function rY(e, t) {
        return function() {
            if (e.curOp) {
                return t.apply(e, arguments);
            }
            r4(e);
            try {
                return t.apply(e, arguments);
            } finally{
                r6(e);
            }
        };
    }
    function rj(e) {
        return function() {
            if (this.curOp) {
                return e.apply(this, arguments);
            }
            r4(this);
            try {
                return e.apply(this, arguments);
            } finally{
                r6(this);
            }
        };
    }
    function r9(e) {
        return function() {
            var t = this.cm;
            if (!t || t.curOp) {
                return e.apply(this, arguments);
            }
            r4(t);
            try {
                return e.apply(this, arguments);
            } finally{
                r6(t);
            }
        };
    }
    function rq(e, t) {
        if (e.doc.highlightFrontier < e.display.viewTo) {
            e.state.highlight.set(t, M(r8, e));
        }
    }
    function r8(e) {
        var t = e.doc;
        if (t.highlightFrontier >= e.display.viewTo) {
            return;
        }
        var i = +new Date() + e.options.workTime;
        var r = ta(e, t.highlightFrontier);
        var n = [];
        t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
            if (r.line >= e.display.viewFrom) {
                var l = o.styles;
                var s = o.text.length > e.options.maxHighlightLength ? eB(t.mode, r.state) : null;
                var a = tl(e, o, r, true);
                if (s) {
                    r.state = s;
                }
                o.styles = a.styles;
                var f = o.styleClasses, u = a.classes;
                if (u) {
                    o.styleClasses = u;
                } else if (f) {
                    o.styleClasses = null;
                }
                var c = !l || l.length != o.styles.length || (f != u && (!f || !u || f.bgClass != u.bgClass || f.textClass != u.textClass));
                for(var h = 0; !c && h < l.length; ++h){
                    c = l[h] != o.styles[h];
                }
                if (c) {
                    n.push(r.line);
                }
                o.stateAfter = r.save();
                r.nextLine();
            } else {
                if (o.text.length <= e.options.maxHighlightLength) {
                    tf(e, o.text, r);
                }
                o.stateAfter = r.line % 5 == 0 ? r.save() : null;
                r.nextLine();
            }
            if (+new Date() > i) {
                rq(e, e.options.workDelay);
                return true;
            }
        });
        t.highlightFrontier = r.line;
        t.modeFrontier = Math.max(t.modeFrontier, r.line);
        if (n.length) {
            rX(e, function() {
                for(var t = 0; t < n.length; t++){
                    ra(e, n[t], "text");
                }
            });
        }
    }
    var rZ = function(e, t, i) {
        var r = e.display;
        this.viewport = t;
        this.visible = rS(r, e.doc, t);
        this.editorIsHidden = !r.wrapper.offsetWidth;
        this.wrapperHeight = r.wrapper.clientHeight;
        this.wrapperWidth = r.wrapper.clientWidth;
        this.oldDisplayWidth = iO(e);
        this.force = i;
        this.dims = rt(e);
        this.events = [];
    };
    rZ.prototype.signal = function(e, t) {
        if (e_(e, t)) {
            this.events.push(arguments);
        }
    };
    rZ.prototype.finish = function() {
        for(var e = 0; e < this.events.length; e++){
            em.apply(null, this.events[e]);
        }
    };
    function rJ(e) {
        var t = e.display;
        if (!t.scrollbarsClipped && t.scroller.offsetWidth) {
            t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth;
            t.heightForcer.style.height = iL(e) + "px";
            t.sizer.style.marginBottom = -t.nativeBarWidth + "px";
            t.sizer.style.borderRightWidth = iL(e) + "px";
            t.scrollbarsClipped = true;
        }
    }
    function rQ(e) {
        if (e.hasFocus()) {
            return null;
        }
        var t = A();
        if (!t || !N(e.display.lineDiv, t)) {
            return null;
        }
        var i = {
            activeElt: t
        };
        if (window.getSelection) {
            var r = window.getSelection();
            if (r.anchorNode && r.extend && N(e.display.lineDiv, r.anchorNode)) {
                i.anchorNode = r.anchorNode;
                i.anchorOffset = r.anchorOffset;
                i.focusNode = r.focusNode;
                i.focusOffset = r.focusOffset;
            }
        }
        return i;
    }
    function ne(e) {
        if (!e || !e.activeElt || e.activeElt == A()) {
            return;
        }
        e.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) && e.anchorNode && N(document.body, e.anchorNode) && N(document.body, e.focusNode)) {
            var t = window.getSelection(), i = document.createRange();
            i.setEnd(e.anchorNode, e.anchorOffset);
            i.collapse(false);
            t.removeAllRanges();
            t.addRange(i);
            t.extend(e.focusNode, e.focusOffset);
        }
    }
    function nt(e, t) {
        var i = e.display, r = e.doc;
        if (t.editorIsHidden) {
            rf(e);
            return false;
        }
        if (!t.force && t.visible.from >= i.viewFrom && t.visible.to <= i.viewTo && (i.updateLineNumbers == null || i.updateLineNumbers >= i.viewTo) && i.renderedView == i.view && rh(e) == 0) {
            return false;
        }
        if (na(e)) {
            rf(e);
            t.dims = rt(e);
        }
        var n = r.first + r.size;
        var o = Math.max(t.visible.from - e.options.viewportMargin, r.first);
        var l = Math.min(n, t.visible.to + e.options.viewportMargin);
        if (i.viewFrom < o && o - i.viewFrom < 20) {
            o = Math.max(r.first, i.viewFrom);
        }
        if (i.viewTo > l && i.viewTo - l < 20) {
            l = Math.min(n, i.viewTo);
        }
        if (ty) {
            o = t3(e.doc, o);
            l = t7(e.doc, l);
        }
        var s = o != i.viewFrom || l != i.viewTo || i.lastWrapHeight != t.wrapperHeight || i.lastWrapWidth != t.wrapperWidth;
        rc(e, o, l);
        i.viewOffset = t6(e2(e.doc, i.viewFrom));
        e.display.mover.style.top = i.viewOffset + "px";
        var a = rh(e);
        if (!s && a == 0 && !t.force && i.renderedView == i.view && (i.updateLineNumbers == null || i.updateLineNumbers >= i.viewTo)) {
            return false;
        }
        var f = rQ(e);
        if (a > 4) {
            i.lineDiv.style.display = "none";
        }
        nn(e, i.updateLineNumbers, t.dims);
        if (a > 4) {
            i.lineDiv.style.display = "";
        }
        i.renderedView = i.view;
        ne(f);
        k(i.cursorDiv);
        k(i.selectionDiv);
        i.gutters.style.height = i.sizer.style.minHeight = 0;
        if (s) {
            i.lastWrapHeight = t.wrapperHeight;
            i.lastWrapWidth = t.wrapperWidth;
            rq(e, 400);
        }
        i.updateLineNumbers = null;
        return true;
    }
    function ni(e, t) {
        var i = t.viewport;
        for(var r = true;; r = false){
            if (!r || !e.options.lineWrapping || t.oldDisplayWidth == iO(e)) {
                if (i && i.top != null) {
                    i = {
                        top: Math.min(e.doc.height + ik(e.display) - i0(e), i.top)
                    };
                }
                t.visible = rS(e.display, e.doc, i);
                if (t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo) {
                    break;
                }
            } else if (r) {
                t.visible = rS(e.display, e.doc, i);
            }
            if (!nt(e, t)) {
                break;
            }
            rx(e);
            var n = rP(e);
            rd(e);
            rI(e, n);
            nl(e, n);
            t.force = false;
        }
        t.signal(e, "update", e);
        if (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) {
            t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo);
            e.display.reportedViewFrom = e.display.viewFrom;
            e.display.reportedViewTo = e.display.viewTo;
        }
    }
    function nr(e, t) {
        var i = new rZ(e, t);
        if (nt(e, i)) {
            rx(e);
            ni(e, i);
            var r = rP(e);
            rd(e);
            rI(e, r);
            nl(e, r);
            i.finish();
        }
    }
    function nn(e, t, i) {
        var r = e.display, n = e.options.lineNumbers;
        var o = r.lineDiv, l = o.firstChild;
        function s(t) {
            var i = t.nextSibling;
            if (a && $ && e.display.currentWheelTarget == t) {
                t.style.display = "none";
            } else {
                t.parentNode.removeChild(t);
            }
            return i;
        }
        var f = r.view, u = r.viewFrom;
        for(var c = 0; c < f.length; c++){
            var h = f[c];
            if (h.hidden) ;
            else if (!h.node || h.node.parentNode != o) {
                var d = iy(e, h, u, i);
                o.insertBefore(d, l);
            } else {
                while(l != h.node){
                    l = s(l);
                }
                var p = n && t != null && t <= u && h.lineNumber;
                if (h.changes) {
                    if (I(h.changes, "gutter") > -1) {
                        p = false;
                    }
                    ic(e, h, u, i);
                }
                if (p) {
                    k(h.lineNumber);
                    h.lineNumber.appendChild(document.createTextNode(ej(e.options, u)));
                }
                l = h.node.nextSibling;
            }
            u += h.size;
        }
        while(l){
            l = s(l);
        }
    }
    function no(e) {
        var t = e.gutters.offsetWidth;
        e.sizer.style.marginLeft = t + "px";
        ia(e, "gutterChanged", e);
    }
    function nl(e, t) {
        e.display.sizer.style.minHeight = t.docHeight + "px";
        e.display.heightForcer.style.top = t.docHeight + "px";
        e.display.gutters.style.height = t.docHeight + e.display.barHeight + iL(e) + "px";
    }
    function ns(e) {
        var t = e.display, i = t.view;
        if (!t.alignWidgets && (!t.gutters.firstChild || !e.options.fixedGutter)) {
            return;
        }
        var r = ri(t) - t.scroller.scrollLeft + e.doc.scrollLeft;
        var n = t.gutters.offsetWidth, o = r + "px";
        for(var l = 0; l < i.length; l++){
            if (!i[l].hidden) {
                if (e.options.fixedGutter) {
                    if (i[l].gutter) {
                        i[l].gutter.style.left = o;
                    }
                    if (i[l].gutterBackground) {
                        i[l].gutterBackground.style.left = o;
                    }
                }
                var s = i[l].alignable;
                if (s) {
                    for(var a = 0; a < s.length; a++){
                        s[a].style.left = o;
                    }
                }
            }
        }
        if (e.options.fixedGutter) {
            t.gutters.style.left = r + n + "px";
        }
    }
    function na(e) {
        if (!e.options.lineNumbers) {
            return false;
        }
        var t = e.doc, i = ej(e.options, t.first + t.size - 1), r = e.display;
        if (i.length != r.lineNumChars) {
            var n = r.measure.appendChild(L("div", [
                L("div", i)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var o = n.firstChild.offsetWidth, l = n.offsetWidth - o;
            r.lineGutter.style.width = "";
            r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - l) + 1;
            r.lineNumWidth = r.lineNumInnerWidth + l;
            r.lineNumChars = r.lineNumInnerWidth ? i.length : -1;
            r.lineGutter.style.width = r.lineNumWidth + "px";
            no(e.display);
            return true;
        }
        return false;
    }
    function nf(e, t) {
        var i = [], r = false;
        for(var n = 0; n < e.length; n++){
            var o = e[n], l = null;
            if (typeof o != "string") {
                l = o.style;
                o = o.className;
            }
            if (o == "CodeMirror-linenumbers") {
                if (!t) {
                    continue;
                } else {
                    r = true;
                }
            }
            i.push({
                className: o,
                style: l
            });
        }
        if (t && !r) {
            i.push({
                className: "CodeMirror-linenumbers",
                style: null
            });
        }
        return i;
    }
    function nu(e) {
        var t = e.gutters, i = e.gutterSpecs;
        k(t);
        e.lineGutter = null;
        for(var r = 0; r < i.length; ++r){
            var n = i[r];
            var o = n.className;
            var l = n.style;
            var s = t.appendChild(L("div", null, "CodeMirror-gutter " + o));
            if (l) {
                s.style.cssText = l;
            }
            if (o == "CodeMirror-linenumbers") {
                e.lineGutter = s;
                s.style.width = (e.lineNumWidth || 1) + "px";
            }
        }
        t.style.display = i.length ? "" : "none";
        no(e);
    }
    function nc(e) {
        nu(e.display);
        rs(e);
        ns(e);
    }
    function nh(e, t, r, n) {
        var o = this;
        this.input = r;
        o.scrollbarFiller = L("div", null, "CodeMirror-scrollbar-filler");
        o.scrollbarFiller.setAttribute("cm-not-content", "true");
        o.gutterFiller = L("div", null, "CodeMirror-gutter-filler");
        o.gutterFiller.setAttribute("cm-not-content", "true");
        o.lineDiv = O("div", null, "CodeMirror-code");
        o.selectionDiv = L("div", null, null, "position: relative; z-index: 1");
        o.cursorDiv = L("div", null, "CodeMirror-cursors");
        o.measure = L("div", null, "CodeMirror-measure");
        o.lineMeasure = L("div", null, "CodeMirror-measure");
        o.lineSpace = O("div", [
            o.measure,
            o.lineMeasure,
            o.selectionDiv,
            o.cursorDiv,
            o.lineDiv
        ], null, "position: relative; outline: none");
        var f = O("div", [
            o.lineSpace
        ], "CodeMirror-lines");
        o.mover = L("div", [
            f
        ], null, "position: relative");
        o.sizer = L("div", [
            o.mover
        ], "CodeMirror-sizer");
        o.sizerWidth = null;
        o.heightForcer = L("div", null, null, "position: absolute; height: " + R + "px; width: 1px;");
        o.gutters = L("div", null, "CodeMirror-gutters");
        o.lineGutter = null;
        o.scroller = L("div", [
            o.sizer,
            o.heightForcer,
            o.gutters
        ], "CodeMirror-scroll");
        o.scroller.setAttribute("tabIndex", "-1");
        o.wrapper = L("div", [
            o.scrollbarFiller,
            o.gutterFiller,
            o.scroller
        ], "CodeMirror");
        o.wrapper.setAttribute("translate", "no");
        if (l && s < 8) {
            o.gutters.style.zIndex = -1;
            o.scroller.style.paddingRight = 0;
        }
        if (!a && !(i && m)) {
            o.scroller.draggable = true;
        }
        if (e) {
            if (e.appendChild) {
                e.appendChild(o.wrapper);
            } else {
                e(o.wrapper);
            }
        }
        o.viewFrom = o.viewTo = t.first;
        o.reportedViewFrom = o.reportedViewTo = t.first;
        o.view = [];
        o.renderedView = null;
        o.externalMeasured = null;
        o.viewOffset = 0;
        o.lastWrapHeight = o.lastWrapWidth = 0;
        o.updateLineNumbers = null;
        o.nativeBarWidth = o.barHeight = o.barWidth = 0;
        o.scrollbarsClipped = false;
        o.lineNumWidth = o.lineNumInnerWidth = o.lineNumChars = null;
        o.alignWidgets = false;
        o.cachedCharWidth = o.cachedTextHeight = o.cachedPaddingH = null;
        o.maxLine = null;
        o.maxLineLength = 0;
        o.maxLineChanged = false;
        o.wheelDX = o.wheelDY = o.wheelStartX = o.wheelStartY = null;
        o.shift = false;
        o.selForContextMenu = null;
        o.activeTouch = null;
        o.gutterSpecs = nf(n.gutters, n.lineNumbers);
        nu(o);
        r.init(o);
    }
    var nd = 0, np = null;
    if (l) {
        np = -0.53;
    } else if (i) {
        np = 15;
    } else if (u) {
        np = -0.7;
    } else if (h) {
        np = -1 / 3;
    }
    function nv(e) {
        var t = e.wheelDeltaX, i = e.wheelDeltaY;
        if (t == null && e.detail && e.axis == e.HORIZONTAL_AXIS) {
            t = e.detail;
        }
        if (i == null && e.detail && e.axis == e.VERTICAL_AXIS) {
            i = e.detail;
        } else if (i == null) {
            i = e.wheelDelta;
        }
        return {
            x: t,
            y: i
        };
    }
    function ng(e) {
        var t = nv(e);
        t.x *= np;
        t.y *= np;
        return t;
    }
    function nm(e, t) {
        var r = nv(t), n = r.x, o = r.y;
        var l = np;
        if (t.deltaMode === 0) {
            n = t.deltaX;
            o = t.deltaY;
            l = 1;
        }
        var s = e.display, f = s.scroller;
        var u = f.scrollWidth > f.clientWidth;
        var h = f.scrollHeight > f.clientHeight;
        if (!((n && u) || (o && h))) {
            return;
        }
        if (o && $ && a) {
            outer: for(var d = t.target, p = s.view; d != f; d = d.parentNode){
                for(var v = 0; v < p.length; v++){
                    if (p[v].node == d) {
                        e.display.currentWheelTarget = d;
                        break outer;
                    }
                }
            }
        }
        if (n && !i && !c && l != null) {
            if (o && h) {
                rF(e, Math.max(0, f.scrollTop + o * l));
            }
            r1(e, Math.max(0, f.scrollLeft + n * l));
            if (!o || (o && h)) {
                eb(t);
            }
            s.wheelStartX = null;
            return;
        }
        if (o && l != null) {
            var g = o * l;
            var m = e.doc.scrollTop, y = m + s.wrapper.clientHeight;
            if (g < 0) {
                m = Math.max(0, m + g - 50);
            } else {
                y = Math.min(e.doc.height, y + g + 50);
            }
            nr(e, {
                top: m,
                bottom: y
            });
        }
        if (nd < 20 && t.deltaMode !== 0) {
            if (s.wheelStartX == null) {
                s.wheelStartX = f.scrollLeft;
                s.wheelStartY = f.scrollTop;
                s.wheelDX = n;
                s.wheelDY = o;
                setTimeout(function() {
                    if (s.wheelStartX == null) {
                        return;
                    }
                    var e = f.scrollLeft - s.wheelStartX;
                    var t = f.scrollTop - s.wheelStartY;
                    var i = (t && s.wheelDY && t / s.wheelDY) || (e && s.wheelDX && e / s.wheelDX);
                    s.wheelStartX = s.wheelStartY = null;
                    if (!i) {
                        return;
                    }
                    np = (np * nd + i) / (nd + 1);
                    ++nd;
                }, 200);
            } else {
                s.wheelDX += n;
                s.wheelDY += o;
            }
        }
    }
    var n$ = function(e, t) {
        this.ranges = e;
        this.primIndex = t;
    };
    n$.prototype.primary = function() {
        return this.ranges[this.primIndex];
    };
    n$.prototype.equals = function(e) {
        if (e == this) {
            return true;
        }
        if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) {
            return false;
        }
        for(var t = 0; t < this.ranges.length; t++){
            var i = this.ranges[t], r = e.ranges[t];
            if (!e8(i.anchor, r.anchor) || !e8(i.head, r.head)) {
                return false;
            }
        }
        return true;
    };
    n$.prototype.deepCopy = function() {
        var e = [];
        for(var t = 0; t < this.ranges.length; t++){
            e[t] = new ny(eZ(this.ranges[t].anchor), eZ(this.ranges[t].head));
        }
        return new n$(e, this.primIndex);
    };
    n$.prototype.somethingSelected = function() {
        for(var e = 0; e < this.ranges.length; e++){
            if (!this.ranges[e].empty()) {
                return true;
            }
        }
        return false;
    };
    n$.prototype.contains = function(e, t) {
        if (!t) {
            t = e;
        }
        for(var i = 0; i < this.ranges.length; i++){
            var r = this.ranges[i];
            if (eq(t, r.from()) >= 0 && eq(e, r.to()) <= 0) {
                return i;
            }
        }
        return -1;
    };
    var ny = function(e, t) {
        this.anchor = e;
        this.head = t;
    };
    ny.prototype.from = function() {
        return eQ(this.anchor, this.head);
    };
    ny.prototype.to = function() {
        return eJ(this.anchor, this.head);
    };
    ny.prototype.empty = function() {
        return (this.head.line == this.anchor.line && this.head.ch == this.anchor.ch);
    };
    function n_(e, t, i) {
        var r = e && e.options.selectionsMayTouch;
        var n = t[i];
        t.sort(function(e, t) {
            return eq(e.from(), t.from());
        });
        i = I(t, n);
        for(var o = 1; o < t.length; o++){
            var l = t[o], s = t[o - 1];
            var a = eq(s.to(), l.from());
            if (r && !l.empty() ? a > 0 : a >= 0) {
                var f = eQ(s.from(), l.from()), u = eJ(s.to(), l.to());
                var c = s.empty() ? l.from() == l.head : s.from() == s.head;
                if (o <= i) {
                    --i;
                }
                t.splice(--o, 2, new ny(c ? u : f, c ? f : u));
            }
        }
        return new n$(t, i);
    }
    function nw(e, t) {
        return new n$([
            new ny(e, t || e)
        ], 0);
    }
    function nb(e) {
        if (!e.text) {
            return e.to;
        }
        return e9(e.from.line + e.text.length - 1, j(e.text).length + (e.text.length == 1 ? e.from.ch : 0));
    }
    function nx(e, t) {
        if (eq(e, t.from) < 0) {
            return e;
        }
        if (eq(e, t.to) <= 0) {
            return nb(t);
        }
        var i = e.line + t.text.length - (t.to.line - t.from.line) - 1, r = e.ch;
        if (e.line == t.to.line) {
            r += nb(t).ch - t.to.ch;
        }
        return e9(i, r);
    }
    function nC(e, t) {
        var i = [];
        for(var r = 0; r < e.sel.ranges.length; r++){
            var n = e.sel.ranges[r];
            i.push(new ny(nx(n.anchor, t), nx(n.head, t)));
        }
        return n_(e.cm, i, e.sel.primIndex);
    }
    function nS(e, t, i) {
        if (e.line == t.line) {
            return e9(i.line, e.ch - t.ch + i.ch);
        } else {
            return e9(i.line + (e.line - t.line), e.ch);
        }
    }
    function nk(e, t, i) {
        var r = [];
        var n = e9(e.first, 0), o = n;
        for(var l = 0; l < t.length; l++){
            var s = t[l];
            var a = nS(s.from, n, o);
            var f = nS(nb(s), n, o);
            n = s.to;
            o = f;
            if (i == "around") {
                var u = e.sel.ranges[l], c = eq(u.head, u.anchor) < 0;
                r[l] = new ny(c ? f : a, c ? a : f);
            } else {
                r[l] = new ny(a, a);
            }
        }
        return new n$(r, e.sel.primIndex);
    }
    function nT(e) {
        e.doc.mode = eR(e.options, e.doc.modeOption);
        nL(e);
    }
    function nL(e) {
        e.doc.iter(function(e) {
            if (e.stateAfter) {
                e.stateAfter = null;
            }
            if (e.styles) {
                e.styles = null;
            }
        });
        e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first;
        rq(e, 100);
        e.state.modeGen++;
        if (e.curOp) {
            rs(e);
        }
    }
    function nO(e, t) {
        return (t.from.ch == 0 && t.to.ch == 0 && j(t.text) == "" && (!e.cm || e.cm.options.wholeLineUpdateBefore));
    }
    function n0(e, t, i, r) {
        function n(e) {
            return i ? i[e] : null;
        }
        function o(e, i, n) {
            tU(e, i, n, r);
            ia(e, "change", e, t);
        }
        function l(e, t) {
            var i = [];
            for(var o = e; o < t; ++o){
                i.push(new tG(f[o], n(o), r));
            }
            return i;
        }
        var s = t.from, a = t.to, f = t.text;
        var u = e2(e, s.line), c = e2(e, a.line);
        var h = j(f), d = n(f.length - 1), p = a.line - s.line;
        if (t.full) {
            e.insert(0, l(0, f.length));
            e.remove(f.length, e.size - f.length);
        } else if (nO(e, t)) {
            var v = l(0, f.length - 1);
            o(c, c.text, d);
            if (p) {
                e.remove(s.line, p);
            }
            if (v.length) {
                e.insert(s.line, v);
            }
        } else if (u == c) {
            if (f.length == 1) {
                o(u, u.text.slice(0, s.ch) + h + u.text.slice(a.ch), d);
            } else {
                var g = l(1, f.length - 1);
                g.push(new tG(h + u.text.slice(a.ch), d, r));
                o(u, u.text.slice(0, s.ch) + f[0], n(0));
                e.insert(s.line + 1, g);
            }
        } else if (f.length == 1) {
            o(u, u.text.slice(0, s.ch) + f[0] + c.text.slice(a.ch), n(0));
            e.remove(s.line + 1, p);
        } else {
            o(u, u.text.slice(0, s.ch) + f[0], n(0));
            o(c, h + c.text.slice(a.ch), d);
            var m = l(1, f.length - 1);
            if (p > 1) {
                e.remove(s.line + 1, p - 1);
            }
            e.insert(s.line + 1, m);
        }
        ia(e, "change", e, t);
    }
    function nW(e, t, i) {
        function r(e, n, o) {
            if (e.linked) {
                for(var l = 0; l < e.linked.length; ++l){
                    var s = e.linked[l];
                    if (s.doc == n) {
                        continue;
                    }
                    var a = o && s.sharedHist;
                    if (i && !a) {
                        continue;
                    }
                    t(s.doc, a);
                    r(s.doc, e, a);
                }
            }
        }
        r(e, null, true);
    }
    function nN(e, t) {
        if (t.cm) {
            throw new Error("This document is already in use.");
        }
        e.doc = t;
        t.cm = e;
        rn(e);
        nT(e);
        nA(e);
        e.options.direction = t.direction;
        if (!e.options.lineWrapping) {
            t2(e);
        }
        e.options.mode = t.modeOption;
        rs(e);
    }
    function nA(e) {
        (e.doc.direction == "rtl" ? D : S)(e.display.lineDiv, "CodeMirror-rtl");
    }
    function nD(e) {
        rX(e, function() {
            nA(e);
            rs(e);
        });
    }
    function nH(e) {
        this.done = [];
        this.undone = [];
        this.undoDepth = e ? e.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = e ? e.maxGeneration : 1;
    }
    function nF(e, t) {
        var i = {
            from: eZ(t.from),
            to: nb(t),
            text: eG(e, t.from, t.to)
        };
        nR(e, i, t.from.line, t.to.line + 1);
        nW(e, function(e) {
            return nR(e, i, t.from.line, t.to.line + 1);
        }, true);
        return i;
    }
    function nM(e) {
        while(e.length){
            var t = j(e);
            if (t.ranges) {
                e.pop();
            } else {
                break;
            }
        }
    }
    function n1(e, t) {
        if (t) {
            nM(e.done);
            return j(e.done);
        } else if (e.done.length && !j(e.done).ranges) {
            return j(e.done);
        } else if (e.done.length > 1 && !e.done[e.done.length - 2].ranges) {
            e.done.pop();
            return j(e.done);
        }
    }
    function nP(e, t, i, r) {
        var n = e.history;
        n.undone.length = 0;
        var o = +new Date(), l;
        var s;
        if ((n.lastOp == r || (n.lastOrigin == t.origin && t.origin && ((t.origin.charAt(0) == "+" && n.lastModTime > o - (e.cm ? e.cm.options.historyEventDelay : 500)) || t.origin.charAt(0) == "*"))) && (l = n1(n, n.lastOp == r))) {
            s = j(l.changes);
            if (eq(t.from, t.to) == 0 && eq(t.from, s.to) == 0) {
                s.to = nb(t);
            } else {
                l.changes.push(nF(e, t));
            }
        } else {
            var a = j(n.done);
            if (!a || !a.ranges) {
                nI(e.sel, n.done);
            }
            l = {
                changes: [
                    nF(e, t)
                ],
                generation: n.generation
            };
            n.done.push(l);
            while(n.done.length > n.undoDepth){
                n.done.shift();
                if (!n.done[0].ranges) {
                    n.done.shift();
                }
            }
        }
        n.done.push(i);
        n.generation = ++n.maxGeneration;
        n.lastModTime = n.lastSelTime = o;
        n.lastOp = n.lastSelOp = r;
        n.lastOrigin = n.lastSelOrigin = t.origin;
        if (!s) {
            em(e, "historyAdded");
        }
    }
    function nz(e, t, i, r) {
        var n = t.charAt(0);
        return (n == "*" || (n == "+" && i.ranges.length == r.ranges.length && i.somethingSelected() == r.somethingSelected() && new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)));
    }
    function nE(e, t, i, r) {
        var n = e.history, o = r && r.origin;
        if (i == n.lastSelOp || (o && n.lastSelOrigin == o && ((n.lastModTime == n.lastSelTime && n.lastOrigin == o) || nz(e, o, j(n.done), t)))) {
            n.done[n.done.length - 1] = t;
        } else {
            nI(t, n.done);
        }
        n.lastSelTime = +new Date();
        n.lastSelOrigin = o;
        n.lastSelOp = i;
        if (r && r.clearRedo !== false) {
            nM(n.undone);
        }
    }
    function nI(e, t) {
        var i = j(t);
        if (!(i && i.ranges && i.equals(e))) {
            t.push(e);
        }
    }
    function nR(e, t, i, r) {
        var n = t["spans_" + e.id], o = 0;
        e.iter(Math.max(e.first, i), Math.min(e.first + e.size, r), function(i) {
            if (i.markedSpans) {
                (n || (n = t["spans_" + e.id] = {}))[o] = i.markedSpans;
            }
            ++o;
        });
    }
    function n3(e) {
        if (!e) {
            return null;
        }
        var t;
        for(var i = 0; i < e.length; ++i){
            if (e[i].marker.explicitlyCleared) {
                if (!t) {
                    t = e.slice(0, i);
                }
            } else if (t) {
                t.push(e[i]);
            }
        }
        return !t ? e : t.length ? t : null;
    }
    function n7(e, t) {
        var i = t["spans_" + e.id];
        if (!i) {
            return null;
        }
        var r = [];
        for(var n = 0; n < t.text.length; ++n){
            r.push(n3(i[n]));
        }
        return r;
    }
    function nB(e, t) {
        var i = n7(e, t);
        var r = tL(e, t);
        if (!i) {
            return r;
        }
        if (!r) {
            return i;
        }
        for(var n = 0; n < i.length; ++n){
            var o = i[n], l = r[n];
            if (o && l) {
                spans: for(var s = 0; s < l.length; ++s){
                    var a = l[s];
                    for(var f = 0; f < o.length; ++f){
                        if (o[f].marker == a.marker) {
                            continue spans;
                        }
                    }
                    o.push(a);
                }
            } else if (l) {
                i[n] = l;
            }
        }
        return i;
    }
    function n4(e, t, i) {
        var r = [];
        for(var n = 0; n < e.length; ++n){
            var o = e[n];
            if (o.ranges) {
                r.push(i ? n$.prototype.deepCopy.call(o) : o);
                continue;
            }
            var l = o.changes, s = [];
            r.push({
                changes: s
            });
            for(var a = 0; a < l.length; ++a){
                var f = l[a], u = void 0;
                s.push({
                    from: f.from,
                    to: f.to,
                    text: f.text
                });
                if (t) {
                    for(var c in f){
                        if ((u = c.match(/^spans_(\d+)$/))) {
                            if (I(t, Number(u[1])) > -1) {
                                j(s)[c] = f[c];
                                delete f[c];
                            }
                        }
                    }
                }
            }
        }
        return r;
    }
    function n6(e, t, i, r) {
        if (r) {
            var n = e.anchor;
            if (i) {
                var o = eq(t, n) < 0;
                if (o != eq(i, n) < 0) {
                    n = t;
                    t = i;
                } else if (o != eq(t, i) < 0) {
                    t = i;
                }
            }
            return new ny(n, t);
        } else {
            return new ny(i || t, t);
        }
    }
    function n5(e, t, i, r, n) {
        if (n == null) {
            n = e.cm && (e.cm.display.shift || e.extend);
        }
        nX(e, new n$([
            n6(e.sel.primary(), t, i, n)
        ], 0), r);
    }
    function n2(e, t, i) {
        var r = [];
        var n = e.cm && (e.cm.display.shift || e.extend);
        for(var o = 0; o < e.sel.ranges.length; o++){
            r[o] = n6(e.sel.ranges[o], t[o], null, n);
        }
        var l = n_(e.cm, r, e.sel.primIndex);
        nX(e, l, i);
    }
    function nG(e, t, i, r) {
        var n = e.sel.ranges.slice(0);
        n[t] = i;
        nX(e, n_(e.cm, n, e.sel.primIndex), r);
    }
    function nU(e, t, i, r) {
        nX(e, nw(t, i), r);
    }
    function nV(e, t, i) {
        var r = {
            ranges: t.ranges,
            update: function(t) {
                this.ranges = [];
                for(var i = 0; i < t.length; i++){
                    this.ranges[i] = new ny(tt(e, t[i].anchor), tt(e, t[i].head));
                }
            },
            origin: i && i.origin
        };
        em(e, "beforeSelectionChange", e, r);
        if (e.cm) {
            em(e.cm, "beforeSelectionChange", e.cm, r);
        }
        if (r.ranges != t.ranges) {
            return n_(e.cm, r.ranges, r.ranges.length - 1);
        } else {
            return t;
        }
    }
    function nK(e, t, i) {
        var r = e.history.done, n = j(r);
        if (n && n.ranges) {
            r[r.length - 1] = t;
            nY(e, t, i);
        } else {
            nX(e, t, i);
        }
    }
    function nX(e, t, i) {
        nY(e, t, i);
        nE(e, e.sel, e.cm ? e.cm.curOp.id : NaN, i);
    }
    function nY(e, t, i) {
        if (e_(e, "beforeSelectionChange") || (e.cm && e_(e.cm, "beforeSelectionChange"))) {
            t = nV(e, t, i);
        }
        var r = (i && i.bias) || (eq(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
        nj(e, nq(e, t, r, true));
        if (!(i && i.scroll === false) && e.cm && e.cm.getOption("readOnly") != "nocursor") {
            rW(e.cm);
        }
    }
    function nj(e, t) {
        if (t.equals(e.sel)) {
            return;
        }
        e.sel = t;
        if (e.cm) {
            e.cm.curOp.updateInput = 1;
            e.cm.curOp.selectionChanged = true;
            ey(e.cm);
        }
        ia(e, "cursorActivity", e);
    }
    function n9(e) {
        nj(e, nq(e, e.sel, null, false));
    }
    function nq(e, t, i, r) {
        var n;
        for(var o = 0; o < t.ranges.length; o++){
            var l = t.ranges[o];
            var s = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o];
            var a = nZ(e, l.anchor, s && s.anchor, i, r);
            var f = nZ(e, l.head, s && s.head, i, r);
            if (n || a != l.anchor || f != l.head) {
                if (!n) {
                    n = t.ranges.slice(0, o);
                }
                n[o] = new ny(a, f);
            }
        }
        return n ? n_(e.cm, n, t.primIndex) : t;
    }
    function n8(e, t, i, r, n) {
        var o = e2(e, t.line);
        if (o.markedSpans) {
            for(var l = 0; l < o.markedSpans.length; ++l){
                var s = o.markedSpans[l], a = s.marker;
                var f = "selectLeft" in a ? !a.selectLeft : a.inclusiveLeft;
                var u = "selectRight" in a ? !a.selectRight : a.inclusiveRight;
                if ((s.from == null || (f ? s.from <= t.ch : s.from < t.ch)) && (s.to == null || (u ? s.to >= t.ch : s.to > t.ch))) {
                    if (n) {
                        em(a, "beforeCursorEnter");
                        if (a.explicitlyCleared) {
                            if (!o.markedSpans) {
                                break;
                            } else {
                                --l;
                                continue;
                            }
                        }
                    }
                    if (!a.atomic) {
                        continue;
                    }
                    if (i) {
                        var c = a.find(r < 0 ? 1 : -1), h = void 0;
                        if (r < 0 ? u : f) {
                            c = nJ(e, c, -r, c && c.line == t.line ? o : null);
                        }
                        if (c && c.line == t.line && (h = eq(c, i)) && (r < 0 ? h < 0 : h > 0)) {
                            return n8(e, c, t, r, n);
                        }
                    }
                    var d = a.find(r < 0 ? -1 : 1);
                    if (r < 0 ? f : u) {
                        d = nJ(e, d, r, d.line == t.line ? o : null);
                    }
                    return d ? n8(e, d, t, r, n) : null;
                }
            }
        }
        return t;
    }
    function nZ(e, t, i, r, n) {
        var o = r || 1;
        var l = n8(e, t, i, o, n) || (!n && n8(e, t, i, o, true)) || n8(e, t, i, -o, n) || (!n && n8(e, t, i, -o, true));
        if (!l) {
            e.cantEdit = true;
            return e9(e.first, 0);
        }
        return l;
    }
    function nJ(e, t, i, r) {
        if (i < 0 && t.ch == 0) {
            if (t.line > e.first) {
                return tt(e, e9(t.line - 1));
            } else {
                return null;
            }
        } else if (i > 0 && t.ch == (r || e2(e, t.line)).text.length) {
            if (t.line < e.first + e.size - 1) {
                return e9(t.line + 1, 0);
            } else {
                return null;
            }
        } else {
            return new e9(t.line, t.ch + i);
        }
    }
    function nQ(e) {
        e.setSelection(e9(e.firstLine(), 0), e9(e.lastLine()), G);
    }
    function oe(e, t, i) {
        var r = {
            canceled: false,
            from: t.from,
            to: t.to,
            text: t.text,
            origin: t.origin,
            cancel: function() {
                return (r.canceled = true);
            }
        };
        if (i) {
            r.update = function(t, i, n, o) {
                if (t) {
                    r.from = tt(e, t);
                }
                if (i) {
                    r.to = tt(e, i);
                }
                if (n) {
                    r.text = n;
                }
                if (o !== undefined) {
                    r.origin = o;
                }
            };
        }
        em(e, "beforeChange", e, r);
        if (e.cm) {
            em(e.cm, "beforeChange", e.cm, r);
        }
        if (r.canceled) {
            if (e.cm) {
                e.cm.curOp.updateInput = 2;
            }
            return null;
        }
        return {
            from: r.from,
            to: r.to,
            text: r.text,
            origin: r.origin
        };
    }
    function ot(e, t, i) {
        if (e.cm) {
            if (!e.cm.curOp) {
                return rY(e.cm, ot)(e, t, i);
            }
            if (e.cm.state.suppressEdits) {
                return;
            }
        }
        if (e_(e, "beforeChange") || (e.cm && e_(e.cm, "beforeChange"))) {
            t = oe(e, t, true);
            if (!t) {
                return;
            }
        }
        var r = t$ && !i && t0(e, t.from, t.to);
        if (r) {
            for(var n = r.length - 1; n >= 0; --n){
                oi(e, {
                    from: r[n].from,
                    to: r[n].to,
                    text: n ? [
                        ""
                    ] : t.text,
                    origin: t.origin
                });
            }
        } else {
            oi(e, t);
        }
    }
    function oi(e, t) {
        if (t.text.length == 1 && t.text[0] == "" && eq(t.from, t.to) == 0) {
            return;
        }
        var i = nC(e, t);
        nP(e, t, i, e.cm ? e.cm.curOp.id : NaN);
        oo(e, t, i, tL(e, t));
        var r = [];
        nW(e, function(e, i) {
            if (!i && I(r, e.history) == -1) {
                ou(e.history, t);
                r.push(e.history);
            }
            oo(e, t, null, tL(e, t));
        });
    }
    function or(e, t, i) {
        var r = e.cm && e.cm.state.suppressEdits;
        if (r && !i) {
            return;
        }
        var n = e.history, o, l = e.sel;
        var s = t == "undo" ? n.done : n.undone, a = t == "undo" ? n.undone : n.done;
        var f = 0;
        for(; f < s.length; f++){
            o = s[f];
            if (i ? o.ranges && !o.equals(e.sel) : !o.ranges) {
                break;
            }
        }
        if (f == s.length) {
            return;
        }
        n.lastOrigin = n.lastSelOrigin = null;
        for(;;){
            o = s.pop();
            if (o.ranges) {
                nI(o, a);
                if (i && !o.equals(e.sel)) {
                    nX(e, o, {
                        clearRedo: false
                    });
                    return;
                }
                l = o;
            } else if (r) {
                s.push(o);
                return;
            } else {
                break;
            }
        }
        var u = [];
        nI(l, a);
        a.push({
            changes: u,
            generation: n.generation
        });
        n.generation = o.generation || ++n.maxGeneration;
        var c = e_(e, "beforeChange") || (e.cm && e_(e.cm, "beforeChange"));
        var h = function(i) {
            var r = o.changes[i];
            r.origin = t;
            if (c && !oe(e, r, false)) {
                s.length = 0;
                return {};
            }
            u.push(nF(e, r));
            var n = i ? nC(e, r) : j(s);
            oo(e, r, n, nB(e, r));
            if (!i && e.cm) {
                e.cm.scrollIntoView({
                    from: r.from,
                    to: nb(r)
                });
            }
            var l = [];
            nW(e, function(e, t) {
                if (!t && I(l, e.history) == -1) {
                    ou(e.history, r);
                    l.push(e.history);
                }
                oo(e, r, null, nB(e, r));
            });
        };
        for(var d = o.changes.length - 1; d >= 0; --d){
            var p = h(d);
            if (p) return p.v;
        }
    }
    function on(e, t) {
        if (t == 0) {
            return;
        }
        e.first += t;
        e.sel = new n$(q(e.sel.ranges, function(e) {
            return new ny(e9(e.anchor.line + t, e.anchor.ch), e9(e.head.line + t, e.head.ch));
        }), e.sel.primIndex);
        if (e.cm) {
            rs(e.cm, e.first, e.first - t, t);
            for(var i = e.cm.display, r = i.viewFrom; r < i.viewTo; r++){
                ra(e.cm, r, "gutter");
            }
        }
    }
    function oo(e, t, i, r) {
        if (e.cm && !e.cm.curOp) {
            return rY(e.cm, oo)(e, t, i, r);
        }
        if (t.to.line < e.first) {
            on(e, t.text.length - 1 - (t.to.line - t.from.line));
            return;
        }
        if (t.from.line > e.lastLine()) {
            return;
        }
        if (t.from.line < e.first) {
            var n = t.text.length - 1 - (e.first - t.from.line);
            on(e, n);
            t = {
                from: e9(e.first, 0),
                to: e9(t.to.line + n, t.to.ch),
                text: [
                    j(t.text)
                ],
                origin: t.origin
            };
        }
        var o = e.lastLine();
        if (t.to.line > o) {
            t = {
                from: t.from,
                to: e9(o, e2(e, o).text.length),
                text: [
                    t.text[0]
                ],
                origin: t.origin
            };
        }
        t.removed = eG(e, t.from, t.to);
        if (!i) {
            i = nC(e, t);
        }
        if (e.cm) {
            ol(e.cm, t, r);
        } else {
            n0(e, t, r);
        }
        nY(e, i, G);
        if (e.cantEdit && nZ(e, e9(e.firstLine(), 0))) {
            e.cantEdit = false;
        }
    }
    function ol(e, t, i) {
        var r = e.doc, n = e.display, o = t.from, l = t.to;
        var s = false, a = o.line;
        if (!e.options.lineWrapping) {
            a = eK(tE(e2(r, o.line)));
            r.iter(a, l.line + 1, function(e) {
                if (e == n.maxLine) {
                    s = true;
                    return true;
                }
            });
        }
        if (r.sel.contains(t.from, t.to) > -1) {
            ey(e);
        }
        n0(r, t, i, rr(e));
        if (!e.options.lineWrapping) {
            r.iter(a, o.line + t.text.length, function(e) {
                var t = t5(e);
                if (t > n.maxLineLength) {
                    n.maxLine = e;
                    n.maxLineLength = t;
                    n.maxLineChanged = true;
                    s = false;
                }
            });
            if (s) {
                e.curOp.updateMaxLine = true;
            }
        }
        tm(r, o.line);
        rq(e, 400);
        var f = t.text.length - (l.line - o.line) - 1;
        if (t.full) {
            rs(e);
        } else if (o.line == l.line && t.text.length == 1 && !nO(e.doc, t)) {
            ra(e, o.line, "text");
        } else {
            rs(e, o.line, l.line + 1, f);
        }
        var u = e_(e, "changes"), c = e_(e, "change");
        if (c || u) {
            var h = {
                from: o,
                to: l,
                text: t.text,
                removed: t.removed,
                origin: t.origin
            };
            if (c) {
                ia(e, "change", e, h);
            }
            if (u) {
                (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(h);
            }
        }
        e.display.selForContextMenu = null;
    }
    function os(e, t, i, r, n) {
        var o;
        if (!r) {
            r = i;
        }
        if (eq(r, i) < 0) {
            (o = [
                r,
                i
            ]), (i = o[0]), (r = o[1]);
        }
        if (typeof t == "string") {
            t = e.splitLines(t);
        }
        ot(e, {
            from: i,
            to: r,
            text: t,
            origin: n
        });
    }
    function oa(e, t, i, r) {
        if (i < e.line) {
            e.line += r;
        } else if (t < e.line) {
            e.line = t;
            e.ch = 0;
        }
    }
    function of(e, t, i, r) {
        for(var n = 0; n < e.length; ++n){
            var o = e[n], l = true;
            if (o.ranges) {
                if (!o.copied) {
                    o = e[n] = o.deepCopy();
                    o.copied = true;
                }
                for(var s = 0; s < o.ranges.length; s++){
                    oa(o.ranges[s].anchor, t, i, r);
                    oa(o.ranges[s].head, t, i, r);
                }
                continue;
            }
            for(var a = 0; a < o.changes.length; ++a){
                var f = o.changes[a];
                if (i < f.from.line) {
                    f.from = e9(f.from.line + r, f.from.ch);
                    f.to = e9(f.to.line + r, f.to.ch);
                } else if (t <= f.to.line) {
                    l = false;
                    break;
                }
            }
            if (!l) {
                e.splice(0, n + 1);
                n = 0;
            }
        }
    }
    function ou(e, t) {
        var i = t.from.line, r = t.to.line, n = t.text.length - (r - i) - 1;
        of(e.done, i, r, n);
        of(e.undone, i, r, n);
    }
    function oc(e, t, i, r) {
        var n = t, o = t;
        if (typeof t == "number") {
            o = e2(e, te(e, t));
        } else {
            n = eK(t);
        }
        if (n == null) {
            return null;
        }
        if (r(o, n) && e.cm) {
            ra(e.cm, n, i);
        }
        return o;
    }
    function oh(e) {
        this.lines = e;
        this.parent = null;
        var t = 0;
        for(var i = 0; i < e.length; ++i){
            e[i].parent = this;
            t += e[i].height;
        }
        this.height = t;
    }
    oh.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        removeInner: function(e, t) {
            for(var i = e, r = e + t; i < r; ++i){
                var n = this.lines[i];
                this.height -= n.height;
                tV(n);
                ia(n, "delete");
            }
            this.lines.splice(e, t);
        },
        collapse: function(e) {
            e.push.apply(e, this.lines);
        },
        insertInner: function(e, t, i) {
            this.height += i;
            this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
            for(var r = 0; r < t.length; ++r){
                t[r].parent = this;
            }
        },
        iterN: function(e, t, i) {
            for(var r = e + t; e < r; ++e){
                if (i(this.lines[e])) {
                    return true;
                }
            }
        }
    };
    function od(e) {
        this.children = e;
        var t = 0, i = 0;
        for(var r = 0; r < e.length; ++r){
            var n = e[r];
            t += n.chunkSize();
            i += n.height;
            n.parent = this;
        }
        this.size = t;
        this.height = i;
        this.parent = null;
    }
    od.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(e, t) {
            this.size -= t;
            for(var i = 0; i < this.children.length; ++i){
                var r = this.children[i], n = r.chunkSize();
                if (e < n) {
                    var o = Math.min(t, n - e), l = r.height;
                    r.removeInner(e, o);
                    this.height -= l - r.height;
                    if (n == o) {
                        this.children.splice(i--, 1);
                        r.parent = null;
                    }
                    if ((t -= o) == 0) {
                        break;
                    }
                    e = 0;
                } else {
                    e -= n;
                }
            }
            if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof oh))) {
                var s = [];
                this.collapse(s);
                this.children = [
                    new oh(s)
                ];
                this.children[0].parent = this;
            }
        },
        collapse: function(e) {
            for(var t = 0; t < this.children.length; ++t){
                this.children[t].collapse(e);
            }
        },
        insertInner: function(e, t, i) {
            this.size += t.length;
            this.height += i;
            for(var r = 0; r < this.children.length; ++r){
                var n = this.children[r], o = n.chunkSize();
                if (e <= o) {
                    n.insertInner(e, t, i);
                    if (n.lines && n.lines.length > 50) {
                        var l = (n.lines.length % 25) + 25;
                        for(var s = l; s < n.lines.length;){
                            var a = new oh(n.lines.slice(s, (s += 25)));
                            n.height -= a.height;
                            this.children.splice(++r, 0, a);
                            a.parent = this;
                        }
                        n.lines = n.lines.slice(0, l);
                        this.maybeSpill();
                    }
                    break;
                }
                e -= o;
            }
        },
        maybeSpill: function() {
            if (this.children.length <= 10) {
                return;
            }
            var e = this;
            do {
                var t = e.children.splice(e.children.length - 5, 5);
                var i = new od(t);
                if (!e.parent) {
                    var r = new od(e.children);
                    r.parent = e;
                    e.children = [
                        r,
                        i
                    ];
                    e = r;
                } else {
                    e.size -= i.size;
                    e.height -= i.height;
                    var n = I(e.parent.children, e);
                    e.parent.children.splice(n + 1, 0, i);
                }
                i.parent = e.parent;
            }while (e.children.length > 10)
            e.parent.maybeSpill();
        },
        iterN: function(e, t, i) {
            for(var r = 0; r < this.children.length; ++r){
                var n = this.children[r], o = n.chunkSize();
                if (e < o) {
                    var l = Math.min(t, o - e);
                    if (n.iterN(e, l, i)) {
                        return true;
                    }
                    if ((t -= l) == 0) {
                        break;
                    }
                    e = 0;
                } else {
                    e -= o;
                }
            }
        }
    };
    var op = function(e, t, i) {
        if (i) {
            for(var r in i){
                if (i.hasOwnProperty(r)) {
                    this[r] = i[r];
                }
            }
        }
        this.doc = e;
        this.node = t;
    };
    op.prototype.clear = function() {
        var e = this.doc.cm, t = this.line.widgets, i = this.line, r = eK(i);
        if (r == null || !t) {
            return;
        }
        for(var n = 0; n < t.length; ++n){
            if (t[n] == this) {
                t.splice(n--, 1);
            }
        }
        if (!t.length) {
            i.widgets = null;
        }
        var o = ix(this);
        eV(i, Math.max(0, i.height - o));
        if (e) {
            rX(e, function() {
                ov(e, i, -o);
                ra(e, r, "widget");
            });
            ia(e, "lineWidgetCleared", e, this, r);
        }
    };
    op.prototype.changed = function() {
        var e = this;
        var t = this.height, i = this.doc.cm, r = this.line;
        this.height = null;
        var n = ix(this) - t;
        if (!n) {
            return;
        }
        if (!tB(this.doc, r)) {
            eV(r, r.height + n);
        }
        if (i) {
            rX(i, function() {
                i.curOp.forceUpdate = true;
                ov(i, r, n);
                ia(i, "lineWidgetChanged", i, e, eK(r));
            });
        }
    };
    ew(op);
    function ov(e, t, i) {
        if (t6(t) < ((e.curOp && e.curOp.scrollTop) || e.doc.scrollTop)) {
            r0(e, i);
        }
    }
    function og(e, t, i, r) {
        var n = new op(e, i, r);
        var o = e.cm;
        if (o && n.noHScroll) {
            o.display.alignWidgets = true;
        }
        oc(e, t, "widget", function(t) {
            var i = t.widgets || (t.widgets = []);
            if (n.insertAt == null) {
                i.push(n);
            } else {
                i.splice(Math.min(i.length, Math.max(0, n.insertAt)), 0, n);
            }
            n.line = t;
            if (o && !tB(e, t)) {
                var r = t6(t) < e.scrollTop;
                eV(t, t.height + ix(n));
                if (r) {
                    r0(o, n.height);
                }
                o.curOp.forceUpdate = true;
            }
            return true;
        });
        if (o) {
            ia(o, "lineWidgetAdded", o, n, typeof t == "number" ? t : eK(t));
        }
        return n;
    }
    var om = 0;
    var o$ = function(e, t) {
        this.lines = [];
        this.type = t;
        this.doc = e;
        this.id = ++om;
    };
    o$.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        var e = this.doc.cm, t = e && !e.curOp;
        if (t) {
            r4(e);
        }
        if (e_(this, "clear")) {
            var i = this.find();
            if (i) {
                ia(this, "clear", i.from, i.to);
            }
        }
        var r = null, n = null;
        for(var o = 0; o < this.lines.length; ++o){
            var l = this.lines[o];
            var s = tx(l.markedSpans, this);
            if (e && !this.collapsed) {
                ra(e, eK(l), "text");
            } else if (e) {
                if (s.to != null) {
                    n = eK(l);
                }
                if (s.from != null) {
                    r = eK(l);
                }
            }
            l.markedSpans = tC(l.markedSpans, s);
            if (s.from == null && this.collapsed && !tB(this.doc, l) && e) {
                eV(l, iQ(e.display));
            }
        }
        if (e && this.collapsed && !e.options.lineWrapping) {
            for(var a = 0; a < this.lines.length; ++a){
                var f = tE(this.lines[a]), u = t5(f);
                if (u > e.display.maxLineLength) {
                    e.display.maxLine = f;
                    e.display.maxLineLength = u;
                    e.display.maxLineChanged = true;
                }
            }
        }
        if (r != null && e && this.collapsed) {
            rs(e, r, n + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (e) {
                n9(e.doc);
            }
        }
        if (e) {
            ia(e, "markerCleared", e, this, r, n);
        }
        if (t) {
            r6(e);
        }
        if (this.parent) {
            this.parent.clear();
        }
    };
    o$.prototype.find = function(e, t) {
        if (e == null && this.type == "bookmark") {
            e = 1;
        }
        var i, r;
        for(var n = 0; n < this.lines.length; ++n){
            var o = this.lines[n];
            var l = tx(o.markedSpans, this);
            if (l.from != null) {
                i = e9(t ? o : eK(o), l.from);
                if (e == -1) {
                    return i;
                }
            }
            if (l.to != null) {
                r = e9(t ? o : eK(o), l.to);
                if (e == 1) {
                    return r;
                }
            }
        }
        return i && {
            from: i,
            to: r
        };
    };
    o$.prototype.changed = function() {
        var e = this;
        var t = this.find(-1, true), i = this, r = this.doc.cm;
        if (!t || !r) {
            return;
        }
        rX(r, function() {
            var n = t.line, o = eK(t.line);
            var l = iH(r, o);
            if (l) {
                iR(l);
                r.curOp.selectionChanged = r.curOp.forceUpdate = true;
            }
            r.curOp.updateMaxLine = true;
            if (!tB(i.doc, n) && i.height != null) {
                var s = i.height;
                i.height = null;
                var a = ix(i) - s;
                if (a) {
                    eV(n, n.height + a);
                }
            }
            ia(r, "markerChanged", r, e);
        });
    };
    o$.prototype.attachLine = function(e) {
        if (!this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            if (!t.maybeHiddenMarkers || I(t.maybeHiddenMarkers, this) == -1) {
                (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this);
            }
        }
        this.lines.push(e);
    };
    o$.prototype.detachLine = function(e) {
        this.lines.splice(I(this.lines, e), 1);
        if (!this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this);
        }
    };
    ew(o$);
    function oy(e, t, i, r, n) {
        if (r && r.shared) {
            return ow(e, t, i, r, n);
        }
        if (e.cm && !e.cm.curOp) {
            return rY(e.cm, oy)(e, t, i, r, n);
        }
        var o = new o$(e, n), l = eq(t, i);
        if (r) {
            P(r, o, false);
        }
        if (l > 0 || (l == 0 && o.clearWhenEmpty !== false)) {
            return o;
        }
        if (o.replacedWith) {
            o.collapsed = true;
            o.widgetNode = O("span", [
                o.replacedWith
            ], "CodeMirror-widget");
            if (!r.handleMouseEvents) {
                o.widgetNode.setAttribute("cm-ignore-events", "true");
            }
            if (r.insertLeft) {
                o.widgetNode.insertLeft = true;
            }
        }
        if (o.collapsed) {
            if (tz(e, t.line, t, i, o) || (t.line != i.line && tz(e, i.line, t, i, o))) {
                throw new Error("Inserting collapsed marker partially overlapping an existing one");
            }
            tw();
        }
        if (o.addToHistory) {
            nP(e, {
                from: t,
                to: i,
                origin: "markText"
            }, e.sel, NaN);
        }
        var s = t.line, a = e.cm, f;
        e.iter(s, i.line + 1, function(r) {
            if (a && o.collapsed && !a.options.lineWrapping && tE(r) == a.display.maxLine) {
                f = true;
            }
            if (o.collapsed && s != t.line) {
                eV(r, 0);
            }
            tS(r, new tb(o, s == t.line ? t.ch : null, s == i.line ? i.ch : null), e.cm && e.cm.curOp);
            ++s;
        });
        if (o.collapsed) {
            e.iter(t.line, i.line + 1, function(t) {
                if (tB(e, t)) {
                    eV(t, 0);
                }
            });
        }
        if (o.clearOnEnter) {
            ep(o, "beforeCursorEnter", function() {
                return o.clear();
            });
        }
        if (o.readOnly) {
            t_();
            if (e.history.done.length || e.history.undone.length) {
                e.clearHistory();
            }
        }
        if (o.collapsed) {
            o.id = ++om;
            o.atomic = true;
        }
        if (a) {
            if (f) {
                a.curOp.updateMaxLine = true;
            }
            if (o.collapsed) {
                rs(a, t.line, i.line + 1);
            } else if (o.className || o.startStyle || o.endStyle || o.css || o.attributes || o.title) {
                for(var u = t.line; u <= i.line; u++){
                    ra(a, u, "text");
                }
            }
            if (o.atomic) {
                n9(a.doc);
            }
            ia(a, "markerAdded", a, o);
        }
        return o;
    }
    var o_ = function(e, t) {
        this.markers = e;
        this.primary = t;
        for(var i = 0; i < e.length; ++i){
            e[i].parent = this;
        }
    };
    o_.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        this.explicitlyCleared = true;
        for(var e = 0; e < this.markers.length; ++e){
            this.markers[e].clear();
        }
        ia(this, "clear");
    };
    o_.prototype.find = function(e, t) {
        return this.primary.find(e, t);
    };
    ew(o_);
    function ow(e, t, i, r, n) {
        r = P(r);
        r.shared = false;
        var o = [
            oy(e, t, i, r, n)
        ], l = o[0];
        var s = r.widgetNode;
        nW(e, function(e) {
            if (s) {
                r.widgetNode = s.cloneNode(true);
            }
            o.push(oy(e, tt(e, t), tt(e, i), r, n));
            for(var a = 0; a < e.linked.length; ++a){
                if (e.linked[a].isParent) {
                    return;
                }
            }
            l = j(o);
        });
        return new o_(o, l);
    }
    function ob(e) {
        return e.findMarks(e9(e.first, 0), e.clipPos(e9(e.lastLine())), function(e) {
            return e.parent;
        });
    }
    function ox(e, t) {
        for(var i = 0; i < t.length; i++){
            var r = t[i], n = r.find();
            var o = e.clipPos(n.from), l = e.clipPos(n.to);
            if (eq(o, l)) {
                var s = oy(e, o, l, r.primary, r.primary.type);
                r.markers.push(s);
                s.parent = r;
            }
        }
    }
    function oC(e) {
        var t = function(t) {
            var i = e[t], r = [
                i.primary.doc
            ];
            nW(i.primary.doc, function(e) {
                return r.push(e);
            });
            for(var n = 0; n < i.markers.length; n++){
                var o = i.markers[n];
                if (I(r, o.doc) == -1) {
                    o.parent = null;
                    i.markers.splice(n--, 1);
                }
            }
        };
        for(var i = 0; i < e.length; i++)t(i);
    }
    var oS = 0;
    var ok = function(e, t, i, r, n) {
        if (!(this instanceof ok)) {
            return new ok(e, t, i, r, n);
        }
        if (i == null) {
            i = 0;
        }
        od.call(this, [
            new oh([
                new tG("", null)
            ])
        ]);
        this.first = i;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = i;
        var o = e9(i, 0);
        this.sel = nw(o);
        this.history = new nH(null);
        this.id = ++oS;
        this.modeOption = t;
        this.lineSep = r;
        this.direction = n == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof e == "string") {
            e = this.splitLines(e);
        }
        n0(this, {
            from: o,
            to: o,
            text: e
        });
        nX(this, nw(o), G);
    };
    ok.prototype = Q(od.prototype, {
        constructor: ok,
        iter: function(e, t, i) {
            if (i) {
                this.iterN(e - this.first, t - e, i);
            } else {
                this.iterN(this.first, this.first + this.size, e);
            }
        },
        insert: function(e, t) {
            var i = 0;
            for(var r = 0; r < t.length; ++r){
                i += t[r].height;
            }
            this.insertInner(e - this.first, t, i);
        },
        remove: function(e, t) {
            this.removeInner(e - this.first, t);
        },
        getValue: function(e) {
            var t = eU(this, this.first, this.first + this.size);
            if (e === false) {
                return t;
            }
            return t.join(e || this.lineSeparator());
        },
        setValue: r9(function(e) {
            var t = e9(this.first, 0), i = this.first + this.size - 1;
            ot(this, {
                from: t,
                to: e9(i, e2(this, i).text.length),
                text: this.splitLines(e),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) {
                rN(this.cm, 0, 0);
            }
            nX(this, nw(t), G);
        }),
        replaceRange: function(e, t, i, r) {
            t = tt(this, t);
            i = i ? tt(this, i) : t;
            os(this, e, t, i, r);
        },
        getRange: function(e, t, i) {
            var r = eG(this, tt(this, e), tt(this, t));
            if (i === false) {
                return r;
            }
            if (i === "") {
                return r.join("");
            }
            return r.join(i || this.lineSeparator());
        },
        getLine: function(e) {
            var t = this.getLineHandle(e);
            return t && t.text;
        },
        getLineHandle: function(e) {
            if (eY(this, e)) {
                return e2(this, e);
            }
        },
        getLineNumber: function(e) {
            return eK(e);
        },
        getLineHandleVisualStart: function(e) {
            if (typeof e == "number") {
                e = e2(this, e);
            }
            return tE(e);
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
        clipPos: function(e) {
            return tt(this, e);
        },
        getCursor: function(e) {
            var t = this.sel.primary(), i;
            if (e == null || e == "head") {
                i = t.head;
            } else if (e == "anchor") {
                i = t.anchor;
            } else if (e == "end" || e == "to" || e === false) {
                i = t.to();
            } else {
                i = t.from();
            }
            return i;
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: r9(function(e, t, i) {
            nU(this, tt(this, typeof e == "number" ? e9(e, t || 0) : e), null, i);
        }),
        setSelection: r9(function(e, t, i) {
            nU(this, tt(this, e), tt(this, t || e), i);
        }),
        extendSelection: r9(function(e, t, i) {
            n5(this, tt(this, e), t && tt(this, t), i);
        }),
        extendSelections: r9(function(e, t) {
            n2(this, tr(this, e), t);
        }),
        extendSelectionsBy: r9(function(e, t) {
            var i = q(this.sel.ranges, e);
            n2(this, tr(this, i), t);
        }),
        setSelections: r9(function(e, t, i) {
            if (!e.length) {
                return;
            }
            var r = [];
            for(var n = 0; n < e.length; n++){
                r[n] = new ny(tt(this, e[n].anchor), tt(this, e[n].head || e[n].anchor));
            }
            if (t == null) {
                t = Math.min(e.length - 1, this.sel.primIndex);
            }
            nX(this, n_(this.cm, r, t), i);
        }),
        addSelection: r9(function(e, t, i) {
            var r = this.sel.ranges.slice(0);
            r.push(new ny(tt(this, e), tt(this, t || e)));
            nX(this, n_(this.cm, r, r.length - 1), i);
        }),
        getSelection: function(e) {
            var t = this.sel.ranges, i;
            for(var r = 0; r < t.length; r++){
                var n = eG(this, t[r].from(), t[r].to());
                i = i ? i.concat(n) : n;
            }
            if (e === false) {
                return i;
            } else {
                return i.join(e || this.lineSeparator());
            }
        },
        getSelections: function(e) {
            var t = [], i = this.sel.ranges;
            for(var r = 0; r < i.length; r++){
                var n = eG(this, i[r].from(), i[r].to());
                if (e !== false) {
                    n = n.join(e || this.lineSeparator());
                }
                t[r] = n;
            }
            return t;
        },
        replaceSelection: function(e, t, i) {
            var r = [];
            for(var n = 0; n < this.sel.ranges.length; n++){
                r[n] = e;
            }
            this.replaceSelections(r, t, i || "+input");
        },
        replaceSelections: r9(function(e, t, i) {
            var r = [], n = this.sel;
            for(var o = 0; o < n.ranges.length; o++){
                var l = n.ranges[o];
                r[o] = {
                    from: l.from(),
                    to: l.to(),
                    text: this.splitLines(e[o]),
                    origin: i
                };
            }
            var s = t && t != "end" && nk(this, r, t);
            for(var a = r.length - 1; a >= 0; a--){
                ot(this, r[a]);
            }
            if (s) {
                nK(this, s);
            } else if (this.cm) {
                rW(this.cm);
            }
        }),
        undo: r9(function() {
            or(this, "undo");
        }),
        redo: r9(function() {
            or(this, "redo");
        }),
        undoSelection: r9(function() {
            or(this, "undo", true);
        }),
        redoSelection: r9(function() {
            or(this, "redo", true);
        }),
        setExtending: function(e) {
            this.extend = e;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            var e = this.history, t = 0, i = 0;
            for(var r = 0; r < e.done.length; r++){
                if (!e.done[r].ranges) {
                    ++t;
                }
            }
            for(var n = 0; n < e.undone.length; n++){
                if (!e.undone[n].ranges) {
                    ++i;
                }
            }
            return {
                undo: t,
                redo: i
            };
        },
        clearHistory: function() {
            var e = this;
            this.history = new nH(this.history);
            nW(this, function(t) {
                return (t.history = e.history);
            }, true);
        },
        markClean: function() {
            this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function(e) {
            if (e) {
                this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            }
            return this.history.generation;
        },
        isClean: function(e) {
            return this.history.generation == (e || this.cleanGeneration);
        },
        getHistory: function() {
            return {
                done: n4(this.history.done),
                undone: n4(this.history.undone)
            };
        },
        setHistory: function(e) {
            var t = (this.history = new nH(this.history));
            t.done = n4(e.done.slice(0), null, true);
            t.undone = n4(e.undone.slice(0), null, true);
        },
        setGutterMarker: r9(function(e, t, i) {
            return oc(this, e, "gutter", function(e) {
                var r = e.gutterMarkers || (e.gutterMarkers = {});
                r[t] = i;
                if (!i && er(r)) {
                    e.gutterMarkers = null;
                }
                return true;
            });
        }),
        clearGutter: r9(function(e) {
            var t = this;
            this.iter(function(i) {
                if (i.gutterMarkers && i.gutterMarkers[e]) {
                    oc(t, i, "gutter", function() {
                        i.gutterMarkers[e] = null;
                        if (er(i.gutterMarkers)) {
                            i.gutterMarkers = null;
                        }
                        return true;
                    });
                }
            });
        }),
        lineInfo: function(e) {
            var t;
            if (typeof e == "number") {
                if (!eY(this, e)) {
                    return null;
                }
                t = e;
                e = e2(this, e);
                if (!e) {
                    return null;
                }
            } else {
                t = eK(e);
                if (t == null) {
                    return null;
                }
            }
            return {
                line: t,
                handle: e,
                text: e.text,
                gutterMarkers: e.gutterMarkers,
                textClass: e.textClass,
                bgClass: e.bgClass,
                wrapClass: e.wrapClass,
                widgets: e.widgets
            };
        },
        addLineClass: r9(function(e, t, i) {
            return oc(this, e, t == "gutter" ? "gutter" : "class", function(e) {
                var r = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass";
                if (!e[r]) {
                    e[r] = i;
                } else if (C(i).test(e[r])) {
                    return false;
                } else {
                    e[r] += " " + i;
                }
                return true;
            });
        }),
        removeLineClass: r9(function(e, t, i) {
            return oc(this, e, t == "gutter" ? "gutter" : "class", function(e) {
                var r = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass";
                var n = e[r];
                if (!n) {
                    return false;
                } else if (i == null) {
                    e[r] = null;
                } else {
                    var o = n.match(C(i));
                    if (!o) {
                        return false;
                    }
                    var l = o.index + o[0].length;
                    e[r] = n.slice(0, o.index) + (!o.index || l == n.length ? "" : " ") + n.slice(l) || null;
                }
                return true;
            });
        }),
        addLineWidget: r9(function(e, t, i) {
            return og(this, e, t, i);
        }),
        removeLineWidget: function(e) {
            e.clear();
        },
        markText: function(e, t, i) {
            return oy(this, tt(this, e), tt(this, t), i, (i && i.type) || "range");
        },
        setBookmark: function(e, t) {
            var i = {
                replacedWith: t && (t.nodeType == null ? t.widget : t),
                insertLeft: t && t.insertLeft,
                clearWhenEmpty: false,
                shared: t && t.shared,
                handleMouseEvents: t && t.handleMouseEvents
            };
            e = tt(this, e);
            return oy(this, e, e, i, "bookmark");
        },
        findMarksAt: function(e) {
            e = tt(this, e);
            var t = [], i = e2(this, e.line).markedSpans;
            if (i) {
                for(var r = 0; r < i.length; ++r){
                    var n = i[r];
                    if ((n.from == null || n.from <= e.ch) && (n.to == null || n.to >= e.ch)) {
                        t.push(n.marker.parent || n.marker);
                    }
                }
            }
            return t;
        },
        findMarks: function(e, t, i) {
            e = tt(this, e);
            t = tt(this, t);
            var r = [], n = e.line;
            this.iter(e.line, t.line + 1, function(o) {
                var l = o.markedSpans;
                if (l) {
                    for(var s = 0; s < l.length; s++){
                        var a = l[s];
                        if (!((a.to != null && n == e.line && e.ch >= a.to) || (a.from == null && n != e.line) || (a.from != null && n == t.line && a.from >= t.ch)) && (!i || i(a.marker))) {
                            r.push(a.marker.parent || a.marker);
                        }
                    }
                }
                ++n;
            });
            return r;
        },
        getAllMarks: function() {
            var e = [];
            this.iter(function(t) {
                var i = t.markedSpans;
                if (i) {
                    for(var r = 0; r < i.length; ++r){
                        if (i[r].from != null) {
                            e.push(i[r].marker);
                        }
                    }
                }
            });
            return e;
        },
        posFromIndex: function(e) {
            var t, i = this.first, r = this.lineSeparator().length;
            this.iter(function(n) {
                var o = n.text.length + r;
                if (o > e) {
                    t = e;
                    return true;
                }
                e -= o;
                ++i;
            });
            return tt(this, e9(i, t));
        },
        indexFromPos: function(e) {
            e = tt(this, e);
            var t = e.ch;
            if (e.line < this.first || e.ch < 0) {
                return 0;
            }
            var i = this.lineSeparator().length;
            this.iter(this.first, e.line, function(e) {
                t += e.text.length + i;
            });
            return t;
        },
        copy: function(e) {
            var t = new ok(eU(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            t.scrollTop = this.scrollTop;
            t.scrollLeft = this.scrollLeft;
            t.sel = this.sel;
            t.extend = false;
            if (e) {
                t.history.undoDepth = this.history.undoDepth;
                t.setHistory(this.getHistory());
            }
            return t;
        },
        linkedDoc: function(e) {
            if (!e) {
                e = {};
            }
            var t = this.first, i = this.first + this.size;
            if (e.from != null && e.from > t) {
                t = e.from;
            }
            if (e.to != null && e.to < i) {
                i = e.to;
            }
            var r = new ok(eU(this, t, i), e.mode || this.modeOption, t, this.lineSep, this.direction);
            if (e.sharedHist) {
                r.history = this.history;
            }
            (this.linked || (this.linked = [])).push({
                doc: r,
                sharedHist: e.sharedHist
            });
            r.linked = [
                {
                    doc: this,
                    isParent: true,
                    sharedHist: e.sharedHist
                }, 
            ];
            ox(r, ob(this));
            return r;
        },
        unlinkDoc: function(e) {
            if (e instanceof l0) {
                e = e.doc;
            }
            if (this.linked) {
                for(var t = 0; t < this.linked.length; ++t){
                    var i = this.linked[t];
                    if (i.doc != e) {
                        continue;
                    }
                    this.linked.splice(t, 1);
                    e.unlinkDoc(this);
                    oC(ob(this));
                    break;
                }
            }
            if (e.history == this.history) {
                var r = [
                    e.id
                ];
                nW(e, function(e) {
                    return r.push(e.id);
                }, true);
                e.history = new nH(null);
                e.history.done = n4(this.history.done, r);
                e.history.undone = n4(this.history.undone, r);
            }
        },
        iterLinkedDocs: function(e) {
            nW(this, e);
        },
        getMode: function() {
            return this.mode;
        },
        getEditor: function() {
            return this.cm;
        },
        splitLines: function(e) {
            if (this.lineSep) {
                return e.split(this.lineSep);
            }
            return eA(e);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: r9(function(e) {
            if (e != "rtl") {
                e = "ltr";
            }
            if (e == this.direction) {
                return;
            }
            this.direction = e;
            this.iter(function(e) {
                return (e.order = null);
            });
            if (this.cm) {
                nD(this.cm);
            }
        })
    });
    ok.prototype.eachLine = ok.prototype.iter;
    var oT = 0;
    function oL(e) {
        var t = this;
        oW(t);
        if (e$(t, e) || iC(t.display, e)) {
            return;
        }
        eb(e);
        if (l) {
            oT = +new Date();
        }
        var i = ro(t, e, true), r = e.dataTransfer.files;
        if (!i || t.isReadOnly()) {
            return;
        }
        if (r && r.length && window.FileReader && window.File) {
            var n = r.length, o = Array(n), s = 0;
            var a = function() {
                if (++s == n) {
                    rY(t, function() {
                        i = tt(t.doc, i);
                        var e = {
                            from: i,
                            to: i,
                            text: t.doc.splitLines(o.filter(function(e) {
                                return e != null;
                            }).join(t.doc.lineSeparator())),
                            origin: "paste"
                        };
                        ot(t.doc, e);
                        nK(t.doc, nw(tt(t.doc, i), tt(t.doc, nb(e))));
                    })();
                }
            };
            var f = function(e, i) {
                if (t.options.allowDropFileTypes && I(t.options.allowDropFileTypes, e.type) == -1) {
                    a();
                    return;
                }
                var r = new FileReader();
                r.onerror = function() {
                    return a();
                };
                r.onload = function() {
                    var e = r.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(e)) {
                        a();
                        return;
                    }
                    o[i] = e;
                    a();
                };
                r.readAsText(e);
            };
            for(var u = 0; u < r.length; u++){
                f(r[u], u);
            }
        } else {
            if (t.state.draggingText && t.doc.sel.contains(i) > -1) {
                t.state.draggingText(e);
                setTimeout(function() {
                    return t.display.input.focus();
                }, 20);
                return;
            }
            try {
                var c = e.dataTransfer.getData("Text");
                if (c) {
                    var h;
                    if (t.state.draggingText && !t.state.draggingText.copy) {
                        h = t.listSelections();
                    }
                    nY(t.doc, nw(i, i));
                    if (h) {
                        for(var d = 0; d < h.length; ++d){
                            os(t.doc, "", h[d].anchor, h[d].head, "drag");
                        }
                    }
                    t.replaceSelection(c, "around", "paste");
                    t.display.input.focus();
                }
            } catch (p) {}
        }
    }
    function oO(e, t) {
        if (l && (!e.state.draggingText || +new Date() - oT < 100)) {
            eS(t);
            return;
        }
        if (e$(e, t) || iC(e.display, t)) {
            return;
        }
        t.dataTransfer.setData("Text", e.getSelection());
        t.dataTransfer.effectAllowed = "copyMove";
        if (t.dataTransfer.setDragImage && !h) {
            var i = L("img", null, null, "position: fixed; left: 0; top: 0;");
            i.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (c) {
                i.width = i.height = 1;
                e.display.wrapper.appendChild(i);
                i._top = i.offsetTop;
            }
            t.dataTransfer.setDragImage(i, 0, 0);
            if (c) {
                i.parentNode.removeChild(i);
            }
        }
    }
    function o0(e, t) {
        var i = ro(e, t);
        if (!i) {
            return;
        }
        var r = document.createDocumentFragment();
        rv(e, i, r);
        if (!e.display.dragCursor) {
            e.display.dragCursor = L("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv);
        }
        T(e.display.dragCursor, r);
    }
    function oW(e) {
        if (e.display.dragCursor) {
            e.display.lineSpace.removeChild(e.display.dragCursor);
            e.display.dragCursor = null;
        }
    }
    function oN(e) {
        if (!document.getElementsByClassName) {
            return;
        }
        var t = document.getElementsByClassName("CodeMirror"), i = [];
        for(var r = 0; r < t.length; r++){
            var n = t[r].CodeMirror;
            if (n) {
                i.push(n);
            }
        }
        if (i.length) {
            i[0].operation(function() {
                for(var t = 0; t < i.length; t++){
                    e(i[t]);
                }
            });
        }
    }
    var oA = false;
    function oD() {
        if (oA) {
            return;
        }
        oH();
        oA = true;
    }
    function oH() {
        var e;
        ep(window, "resize", function() {
            if (e == null) {
                e = setTimeout(function() {
                    e = null;
                    oN(oF);
                }, 100);
            }
        });
        ep(window, "blur", function() {
            return oN(rb);
        });
    }
    function oF(e) {
        var t = e.display;
        t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null;
        t.scrollbarsClipped = false;
        e.setSize();
    }
    var oM = {
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
    for(var o1 = 0; o1 < 10; o1++){
        oM[o1 + 48] = oM[o1 + 96] = String(o1);
    }
    for(var oP = 65; oP <= 90; oP++){
        oM[oP] = String.fromCharCode(oP);
    }
    for(var oz = 1; oz <= 12; oz++){
        oM[oz + 111] = oM[oz + 63235] = "F" + oz;
    }
    var oE = {};
    oE.basic = {
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
    oE.pcDefault = {
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
    oE.emacsy = {
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
    oE.macDefault = {
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
    oE["default"] = $ ? oE.macDefault : oE.pcDefault;
    function oI(e) {
        var t = e.split(/-(?!$)/);
        e = t[t.length - 1];
        var i, r, n, o;
        for(var l = 0; l < t.length - 1; l++){
            var s = t[l];
            if (/^(cmd|meta|m)$/i.test(s)) {
                o = true;
            } else if (/^a(lt)?$/i.test(s)) {
                i = true;
            } else if (/^(c|ctrl|control)$/i.test(s)) {
                r = true;
            } else if (/^s(hift)?$/i.test(s)) {
                n = true;
            } else {
                throw new Error("Unrecognized modifier name: " + s);
            }
        }
        if (i) {
            e = "Alt-" + e;
        }
        if (r) {
            e = "Ctrl-" + e;
        }
        if (o) {
            e = "Cmd-" + e;
        }
        if (n) {
            e = "Shift-" + e;
        }
        return e;
    }
    function oR(e) {
        var t = {};
        for(var i in e){
            if (e.hasOwnProperty(i)) {
                var r = e[i];
                if (/^(name|fallthrough|(de|at)tach)$/.test(i)) {
                    continue;
                }
                if (r == "...") {
                    delete e[i];
                    continue;
                }
                var n = q(i.split(" "), oI);
                for(var o = 0; o < n.length; o++){
                    var l = void 0, s = void 0;
                    if (o == n.length - 1) {
                        s = n.join(" ");
                        l = r;
                    } else {
                        s = n.slice(0, o + 1).join(" ");
                        l = "...";
                    }
                    var a = t[s];
                    if (!a) {
                        t[s] = l;
                    } else if (a != l) {
                        throw new Error("Inconsistent bindings for " + s);
                    }
                }
                delete e[i];
            }
        }
        for(var f in t){
            e[f] = t[f];
        }
        return e;
    }
    function o3(e, t, i, r) {
        t = o6(t);
        var n = t.call ? t.call(e, r) : t[e];
        if (n === false) {
            return "nothing";
        }
        if (n === "...") {
            return "multi";
        }
        if (n != null && i(n)) {
            return "handled";
        }
        if (t.fallthrough) {
            if (Object.prototype.toString.call(t.fallthrough) != "[object Array]") {
                return o3(e, t.fallthrough, i, r);
            }
            for(var o = 0; o < t.fallthrough.length; o++){
                var l = o3(e, t.fallthrough[o], i, r);
                if (l) {
                    return l;
                }
            }
        }
    }
    function o7(e) {
        var t = typeof e == "string" ? e : oM[e.keyCode];
        return (t == "Ctrl" || t == "Alt" || t == "Shift" || t == "Mod");
    }
    function oB(e, t, i) {
        var r = e;
        if (t.altKey && r != "Alt") {
            e = "Alt-" + e;
        }
        if ((b ? t.metaKey : t.ctrlKey) && r != "Ctrl") {
            e = "Ctrl-" + e;
        }
        if ((b ? t.ctrlKey : t.metaKey) && r != "Mod") {
            e = "Cmd-" + e;
        }
        if (!i && t.shiftKey && r != "Shift") {
            e = "Shift-" + e;
        }
        return e;
    }
    function o4(e, t) {
        if (c && e.keyCode == 34 && e["char"]) {
            return false;
        }
        var i = oM[e.keyCode];
        if (i == null || e.altGraphKey) {
            return false;
        }
        if (e.keyCode == 3 && e.code) {
            i = e.code;
        }
        return oB(i, e, t);
    }
    function o6(e) {
        return typeof e == "string" ? oE[e] : e;
    }
    function o5(e, t) {
        var i = e.doc.sel.ranges, r = [];
        for(var n = 0; n < i.length; n++){
            var o = t(i[n]);
            while(r.length && eq(o.from, j(r).to) <= 0){
                var l = r.pop();
                if (eq(l.from, o.from) < 0) {
                    o.from = l.from;
                    break;
                }
            }
            r.push(o);
        }
        rX(e, function() {
            for(var t = r.length - 1; t >= 0; t--){
                os(e.doc, "", r[t].from, r[t].to, "+delete");
            }
            rW(e);
        });
    }
    function o2(e, t, i) {
        var r = el(e.text, t + i, i);
        return r < 0 || r > e.text.length ? null : r;
    }
    function oG(e, t, i) {
        var r = o2(e, t.ch, i);
        return r == null ? null : new e9(t.line, r, i < 0 ? "after" : "before");
    }
    function oU(e, t, i, r, n) {
        if (e) {
            if (t.doc.direction == "rtl") {
                n = -n;
            }
            var o = eh(i, t.doc.direction);
            if (o) {
                var l = n < 0 ? j(o) : o[0];
                var s = n < 0 == (l.level == 1);
                var a = s ? "after" : "before";
                var f;
                if (l.level > 0 || t.doc.direction == "rtl") {
                    var u = iF(t, i);
                    f = n < 0 ? i.text.length - 1 : 0;
                    var c = iM(t, u, f).top;
                    f = es(function(e) {
                        return (iM(t, u, e).top == c);
                    }, n < 0 == (l.level == 1) ? l.from : l.to - 1, f);
                    if (a == "before") {
                        f = o2(i, f, 1);
                    }
                } else {
                    f = n < 0 ? l.to : l.from;
                }
                return new e9(r, f, a);
            }
        }
        return new e9(r, n < 0 ? i.text.length : 0, n < 0 ? "before" : "after");
    }
    function oV(e, t, i, r) {
        var n = eh(t, e.doc.direction);
        if (!n) {
            return oG(t, i, r);
        }
        if (i.ch >= t.text.length) {
            i.ch = t.text.length;
            i.sticky = "before";
        } else if (i.ch <= 0) {
            i.ch = 0;
            i.sticky = "after";
        }
        var o = eu(n, i.ch, i.sticky), l = n[o];
        if (e.doc.direction == "ltr" && l.level % 2 == 0 && (r > 0 ? l.to > i.ch : l.from < i.ch)) {
            return oG(t, i, r);
        }
        var s = function(e, i) {
            return o2(t, e instanceof e9 ? e.ch : e, i);
        };
        var a;
        var f = function(i) {
            if (!e.options.lineWrapping) {
                return {
                    begin: 0,
                    end: t.text.length
                };
            }
            a = a || iF(e, t);
            return ij(e, t, a, i);
        };
        var u = f(i.sticky == "before" ? s(i, -1) : i.ch);
        if (e.doc.direction == "rtl" || l.level == 1) {
            var c = (l.level == 1) == r < 0;
            var h = s(i, c ? 1 : -1);
            if (h != null && (!c ? h >= l.from && h >= u.begin : h <= l.to && h <= u.end)) {
                var d = c ? "before" : "after";
                return new e9(i.line, h, d);
            }
        }
        var p = function(e, t, r) {
            var o = function(e, t) {
                return t ? new e9(i.line, s(e, 1), "before") : new e9(i.line, e, "after");
            };
            for(; e >= 0 && e < n.length; e += t){
                var l = n[e];
                var a = t > 0 == (l.level != 1);
                var f = a ? r.begin : s(r.end, -1);
                if (l.from <= f && f < l.to) {
                    return o(f, a);
                }
                f = a ? l.from : s(l.to, -1);
                if (r.begin <= f && f < r.end) {
                    return o(f, a);
                }
            }
        };
        var v = p(o + r, r, u);
        if (v) {
            return v;
        }
        var g = r > 0 ? u.end : s(u.begin, -1);
        if (g != null && !(r > 0 && g == t.text.length)) {
            v = p(r > 0 ? 0 : n.length - 1, r, f(g));
            if (v) {
                return v;
            }
        }
        return null;
    }
    var oK = {
        selectAll: nQ,
        singleSelection: function(e) {
            return e.setSelection(e.getCursor("anchor"), e.getCursor("head"), G);
        },
        killLine: function(e) {
            return o5(e, function(t) {
                if (t.empty()) {
                    var i = e2(e.doc, t.head.line).text.length;
                    if (t.head.ch == i && t.head.line < e.lastLine()) {
                        return {
                            from: t.head,
                            to: e9(t.head.line + 1, 0)
                        };
                    } else {
                        return {
                            from: t.head,
                            to: e9(t.head.line, i)
                        };
                    }
                } else {
                    return {
                        from: t.from(),
                        to: t.to()
                    };
                }
            });
        },
        deleteLine: function(e) {
            return o5(e, function(t) {
                return {
                    from: e9(t.from().line, 0),
                    to: tt(e.doc, e9(t.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(e) {
            return o5(e, function(e) {
                return {
                    from: e9(e.from().line, 0),
                    to: e.from()
                };
            });
        },
        delWrappedLineLeft: function(e) {
            return o5(e, function(t) {
                var i = e.charCoords(t.head, "div").top + 5;
                var r = e.coordsChar({
                    left: 0,
                    top: i
                }, "div");
                return {
                    from: r,
                    to: t.from()
                };
            });
        },
        delWrappedLineRight: function(e) {
            return o5(e, function(t) {
                var i = e.charCoords(t.head, "div").top + 5;
                var r = e.coordsChar({
                    left: e.display.lineDiv.offsetWidth + 100,
                    top: i
                }, "div");
                return {
                    from: t.from(),
                    to: r
                };
            });
        },
        undo: function(e) {
            return e.undo();
        },
        redo: function(e) {
            return e.redo();
        },
        undoSelection: function(e) {
            return e.undoSelection();
        },
        redoSelection: function(e) {
            return e.redoSelection();
        },
        goDocStart: function(e) {
            return e.extendSelection(e9(e.firstLine(), 0));
        },
        goDocEnd: function(e) {
            return e.extendSelection(e9(e.lastLine()));
        },
        goLineStart: function(e) {
            return e.extendSelectionsBy(function(t) {
                return oX(e, t.head.line);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineStartSmart: function(e) {
            return e.extendSelectionsBy(function(t) {
                return oj(e, t.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(e) {
            return e.extendSelectionsBy(function(t) {
                return oY(e, t.head.line);
            }, {
                origin: "+move",
                bias: -1
            });
        },
        goLineRight: function(e) {
            return e.extendSelectionsBy(function(t) {
                var i = e.cursorCoords(t.head, "div").top + 5;
                return e.coordsChar({
                    left: e.display.lineDiv.offsetWidth + 100,
                    top: i
                }, "div");
            }, V);
        },
        goLineLeft: function(e) {
            return e.extendSelectionsBy(function(t) {
                var i = e.cursorCoords(t.head, "div").top + 5;
                return e.coordsChar({
                    left: 0,
                    top: i
                }, "div");
            }, V);
        },
        goLineLeftSmart: function(e) {
            return e.extendSelectionsBy(function(t) {
                var i = e.cursorCoords(t.head, "div").top + 5;
                var r = e.coordsChar({
                    left: 0,
                    top: i
                }, "div");
                if (r.ch < e.getLine(r.line).search(/\S/)) {
                    return oj(e, t.head);
                }
                return r;
            }, V);
        },
        goLineUp: function(e) {
            return e.moveV(-1, "line");
        },
        goLineDown: function(e) {
            return e.moveV(1, "line");
        },
        goPageUp: function(e) {
            return e.moveV(-1, "page");
        },
        goPageDown: function(e) {
            return e.moveV(1, "page");
        },
        goCharLeft: function(e) {
            return e.moveH(-1, "char");
        },
        goCharRight: function(e) {
            return e.moveH(1, "char");
        },
        goColumnLeft: function(e) {
            return e.moveH(-1, "column");
        },
        goColumnRight: function(e) {
            return e.moveH(1, "column");
        },
        goWordLeft: function(e) {
            return e.moveH(-1, "word");
        },
        goGroupRight: function(e) {
            return e.moveH(1, "group");
        },
        goGroupLeft: function(e) {
            return e.moveH(-1, "group");
        },
        goWordRight: function(e) {
            return e.moveH(1, "word");
        },
        delCharBefore: function(e) {
            return e.deleteH(-1, "codepoint");
        },
        delCharAfter: function(e) {
            return e.deleteH(1, "char");
        },
        delWordBefore: function(e) {
            return e.deleteH(-1, "word");
        },
        delWordAfter: function(e) {
            return e.deleteH(1, "word");
        },
        delGroupBefore: function(e) {
            return e.deleteH(-1, "group");
        },
        delGroupAfter: function(e) {
            return e.deleteH(1, "group");
        },
        indentAuto: function(e) {
            return e.indentSelection("smart");
        },
        indentMore: function(e) {
            return e.indentSelection("add");
        },
        indentLess: function(e) {
            return e.indentSelection("subtract");
        },
        insertTab: function(e) {
            return e.replaceSelection("\t");
        },
        insertSoftTab: function(e) {
            var t = [], i = e.listSelections(), r = e.options.tabSize;
            for(var n = 0; n < i.length; n++){
                var o = i[n].from();
                var l = z(e.getLine(o.line), o.ch, r);
                t.push(Y(r - (l % r)));
            }
            e.replaceSelections(t);
        },
        defaultTab: function(e) {
            if (e.somethingSelected()) {
                e.indentSelection("add");
            } else {
                e.execCommand("insertTab");
            }
        },
        transposeChars: function(e) {
            return rX(e, function() {
                var t = e.listSelections(), i = [];
                for(var r = 0; r < t.length; r++){
                    if (!t[r].empty()) {
                        continue;
                    }
                    var n = t[r].head, o = e2(e.doc, n.line).text;
                    if (o) {
                        if (n.ch == o.length) {
                            n = new e9(n.line, n.ch - 1);
                        }
                        if (n.ch > 0) {
                            n = new e9(n.line, n.ch + 1);
                            e.replaceRange(o.charAt(n.ch - 1) + o.charAt(n.ch - 2), e9(n.line, n.ch - 2), n, "+transpose");
                        } else if (n.line > e.doc.first) {
                            var l = e2(e.doc, n.line - 1).text;
                            if (l) {
                                n = new e9(n.line, 1);
                                e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), e9(n.line - 1, l.length - 1), n, "+transpose");
                            }
                        }
                    }
                    i.push(new ny(n, n));
                }
                e.setSelections(i);
            });
        },
        newlineAndIndent: function(e) {
            return rX(e, function() {
                var t = e.listSelections();
                for(var i = t.length - 1; i >= 0; i--){
                    e.replaceRange(e.doc.lineSeparator(), t[i].anchor, t[i].head, "+input");
                }
                t = e.listSelections();
                for(var r = 0; r < t.length; r++){
                    e.indentLine(t[r].from().line, null, true);
                }
                rW(e);
            });
        },
        openLine: function(e) {
            return e.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(e) {
            return e.toggleOverwrite();
        }
    };
    function oX(e, t) {
        var i = e2(e.doc, t);
        var r = tE(i);
        if (r != i) {
            t = eK(r);
        }
        return oU(true, e, r, t, 1);
    }
    function oY(e, t) {
        var i = e2(e.doc, t);
        var r = tI(i);
        if (r != i) {
            t = eK(r);
        }
        return oU(true, e, i, t, -1);
    }
    function oj(e, t) {
        var i = oX(e, t.line);
        var r = e2(e.doc, i.line);
        var n = eh(r, e.doc.direction);
        if (!n || n[0].level == 0) {
            var o = Math.max(i.ch, r.text.search(/\S/));
            var l = t.line == i.line && t.ch <= o && t.ch;
            return e9(i.line, l ? 0 : o, i.sticky);
        }
        return i;
    }
    function o9(e, t, i) {
        if (typeof t == "string") {
            t = oK[t];
            if (!t) {
                return false;
            }
        }
        e.display.input.ensurePolled();
        var r = e.display.shift, n = false;
        try {
            if (e.isReadOnly()) {
                e.state.suppressEdits = true;
            }
            if (i) {
                e.display.shift = false;
            }
            n = t(e) != B;
        } finally{
            e.display.shift = r;
            e.state.suppressEdits = false;
        }
        return n;
    }
    function oq(e, t, i) {
        for(var r = 0; r < e.state.keyMaps.length; r++){
            var n = o3(t, e.state.keyMaps[r], i, e);
            if (n) {
                return n;
            }
        }
        return ((e.options.extraKeys && o3(t, e.options.extraKeys, i, e)) || o3(t, e.options.keyMap, i, e));
    }
    var o8 = new E();
    function oZ(e, t, i, r) {
        var n = e.state.keySeq;
        if (n) {
            if (o7(t)) {
                return "handled";
            }
            if (/\'$/.test(t)) {
                e.state.keySeq = null;
            } else {
                o8.set(50, function() {
                    if (e.state.keySeq == n) {
                        e.state.keySeq = null;
                        e.display.input.reset();
                    }
                });
            }
            if (oJ(e, n + " " + t, i, r)) {
                return true;
            }
        }
        return oJ(e, t, i, r);
    }
    function oJ(e, t, i, r) {
        var n = oq(e, t, r);
        if (n == "multi") {
            e.state.keySeq = t;
        }
        if (n == "handled") {
            ia(e, "keyHandled", e, t, i);
        }
        if (n == "handled" || n == "multi") {
            eb(i);
            r$(e);
        }
        return !!n;
    }
    function oQ(e, t) {
        var i = o4(t, true);
        if (!i) {
            return false;
        }
        if (t.shiftKey && !e.state.keySeq) {
            return (oZ(e, "Shift-" + i, t, function(t) {
                return o9(e, t, true);
            }) || oZ(e, i, t, function(t) {
                if (typeof t == "string" ? /^go[A-Z]/.test(t) : t.motion) {
                    return o9(e, t);
                }
            }));
        } else {
            return oZ(e, i, t, function(t) {
                return o9(e, t);
            });
        }
    }
    function le(e, t, i) {
        return oZ(e, "'" + i + "'", t, function(t) {
            return o9(e, t, true);
        });
    }
    var lt = null;
    function li(e) {
        var t = this;
        if (e.target && e.target != t.display.input.getField()) {
            return;
        }
        t.curOp.focus = A();
        if (e$(t, e)) {
            return;
        }
        if (l && s < 11 && e.keyCode == 27) {
            e.returnValue = false;
        }
        var r = e.keyCode;
        t.display.shift = r == 16 || e.shiftKey;
        var n = oQ(t, e);
        if (c) {
            lt = n ? r : null;
            if (!n && r == 88 && !eH && ($ ? e.metaKey : e.ctrlKey)) {
                t.replaceSelection("", null, "cut");
            }
        }
        if (i && !$ && !n && r == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) {
            document.execCommand("cut");
        }
        if (r == 18 && !/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className)) {
            lr(t);
        }
    }
    function lr(e) {
        var t = e.display.lineDiv;
        D(t, "CodeMirror-crosshair");
        function i(e) {
            if (e.keyCode == 18 || !e.altKey) {
                S(t, "CodeMirror-crosshair");
                eg(document, "keyup", i);
                eg(document, "mouseover", i);
            }
        }
        ep(document, "keyup", i);
        ep(document, "mouseover", i);
    }
    function ln(e) {
        if (e.keyCode == 16) {
            this.doc.sel.shift = false;
        }
        e$(this, e);
    }
    function lo(e) {
        var t = this;
        if (e.target && e.target != t.display.input.getField()) {
            return;
        }
        if (iC(t.display, e) || e$(t, e) || (e.ctrlKey && !e.altKey) || ($ && e.metaKey)) {
            return;
        }
        var i = e.keyCode, r = e.charCode;
        if (c && i == lt) {
            lt = null;
            eb(e);
            return;
        }
        if (c && (!e.which || e.which < 10) && oQ(t, e)) {
            return;
        }
        var n = String.fromCharCode(r == null ? i : r);
        if (n == "\x08") {
            return;
        }
        if (le(t, e, n)) {
            return;
        }
        t.display.input.onKeyPress(e);
    }
    var ll = 400;
    var ls = function(e, t, i) {
        this.time = e;
        this.pos = t;
        this.button = i;
    };
    ls.prototype.compare = function(e, t, i) {
        return (this.time + ll > e && eq(t, this.pos) == 0 && i == this.button);
    };
    var la, lf;
    function lu(e, t) {
        var i = +new Date();
        if (lf && lf.compare(i, e, t)) {
            la = lf = null;
            return "triple";
        } else if (la && la.compare(i, e, t)) {
            lf = new ls(i, e, t);
            la = null;
            return "double";
        } else {
            la = new ls(i, e, t);
            lf = null;
            return "single";
        }
    }
    function lc(e) {
        var t = this, i = t.display;
        if (e$(t, e) || (i.activeTouch && i.input.supportsTouch())) {
            return;
        }
        i.input.ensurePolled();
        i.shift = e.shiftKey;
        if (iC(i, e)) {
            if (!a) {
                i.scroller.draggable = false;
                setTimeout(function() {
                    return (i.scroller.draggable = true);
                }, 100);
            }
            return;
        }
        if (l_(t, e)) {
            return;
        }
        var r = ro(t, e), n = eT(e), o = r ? lu(r, n) : "single";
        window.focus();
        if (n == 1 && t.state.selectingText) {
            t.state.selectingText(e);
        }
        if (r && lh(t, n, r, o, e)) {
            return;
        }
        if (n == 1) {
            if (r) {
                lp(t, r, o, e);
            } else if (ek(e) == i.scroller) {
                eb(e);
            }
        } else if (n == 2) {
            if (r) {
                n5(t.doc, r);
            }
            setTimeout(function() {
                return i.input.focus();
            }, 20);
        } else if (n == 3) {
            if (x) {
                t.display.input.onContextMenu(e);
            } else {
                r_(t);
            }
        }
    }
    function lh(e, t, i, r, n) {
        var o = "Click";
        if (r == "double") {
            o = "Double" + o;
        } else if (r == "triple") {
            o = "Triple" + o;
        }
        o = (t == 1 ? "Left" : t == 2 ? "Middle" : "Right") + o;
        return oZ(e, oB(o, n), n, function(t) {
            if (typeof t == "string") {
                t = oK[t];
            }
            if (!t) {
                return false;
            }
            var r = false;
            try {
                if (e.isReadOnly()) {
                    e.state.suppressEdits = true;
                }
                r = t(e, i) != B;
            } finally{
                e.state.suppressEdits = false;
            }
            return r;
        });
    }
    function ld(e, t, i) {
        var r = e.getOption("configureMouse");
        var n = r ? r(e, t, i) : {};
        if (n.unit == null) {
            var o = y ? i.shiftKey && i.metaKey : i.altKey;
            n.unit = o ? "rectangle" : t == "single" ? "char" : t == "double" ? "word" : "line";
        }
        if (n.extend == null || e.doc.extend) {
            n.extend = e.doc.extend || i.shiftKey;
        }
        if (n.addNew == null) {
            n.addNew = $ ? i.metaKey : i.ctrlKey;
        }
        if (n.moveOnDrag == null) {
            n.moveOnDrag = !($ ? i.altKey : i.ctrlKey);
        }
        return n;
    }
    function lp(e, t, i, r) {
        if (l) {
            setTimeout(M(ry, e), 0);
        } else {
            e.curOp.focus = A();
        }
        var n = ld(e, i, r);
        var o = e.doc.sel, s;
        if (e.options.dragDrop && eL && !e.isReadOnly() && i == "single" && (s = o.contains(t)) > -1 && (eq((s = o.ranges[s]).from(), t) < 0 || t.xRel > 0) && (eq(s.to(), t) > 0 || t.xRel < 0)) {
            lv(e, r, t, n);
        } else {
            lm(e, r, t, n);
        }
    }
    function lv(e, t, i, r) {
        var n = e.display, o = false;
        var f = rY(e, function(t) {
            if (a) {
                n.scroller.draggable = false;
            }
            e.state.draggingText = false;
            if (e.state.delayingBlurEvent) {
                if (e.hasFocus()) {
                    e.state.delayingBlurEvent = false;
                } else {
                    r_(e);
                }
            }
            eg(n.wrapper.ownerDocument, "mouseup", f);
            eg(n.wrapper.ownerDocument, "mousemove", u);
            eg(n.scroller, "dragstart", c);
            eg(n.scroller, "drop", f);
            if (!o) {
                eb(t);
                if (!r.addNew) {
                    n5(e.doc, i, null, null, r.extend);
                }
                if ((a && !h) || (l && s == 9)) {
                    setTimeout(function() {
                        n.wrapper.ownerDocument.body.focus({
                            preventScroll: true
                        });
                        n.input.focus();
                    }, 20);
                } else {
                    n.input.focus();
                }
            }
        });
        var u = function(e) {
            o = o || Math.abs(t.clientX - e.clientX) + Math.abs(t.clientY - e.clientY) >= 10;
        };
        var c = function() {
            return (o = true);
        };
        if (a) {
            n.scroller.draggable = true;
        }
        e.state.draggingText = f;
        f.copy = !r.moveOnDrag;
        ep(n.wrapper.ownerDocument, "mouseup", f);
        ep(n.wrapper.ownerDocument, "mousemove", u);
        ep(n.scroller, "dragstart", c);
        ep(n.scroller, "drop", f);
        e.state.delayingBlurEvent = true;
        setTimeout(function() {
            return n.input.focus();
        }, 20);
        if (n.scroller.dragDrop) {
            n.scroller.dragDrop();
        }
    }
    function lg(e, t, i) {
        if (i == "char") {
            return new ny(t, t);
        }
        if (i == "word") {
            return e.findWordAt(t);
        }
        if (i == "line") {
            return new ny(e9(t.line, 0), tt(e.doc, e9(t.line + 1, 0)));
        }
        var r = i(e, t);
        return new ny(r.from, r.to);
    }
    function lm(e, t, i, r) {
        if (l) {
            r_(e);
        }
        var n = e.display, o = e.doc;
        eb(t);
        var s, a, f = o.sel, u = f.ranges;
        if (r.addNew && !r.extend) {
            a = o.sel.contains(i);
            if (a > -1) {
                s = u[a];
            } else {
                s = new ny(i, i);
            }
        } else {
            s = o.sel.primary();
            a = o.sel.primIndex;
        }
        if (r.unit == "rectangle") {
            if (!r.addNew) {
                s = new ny(i, i);
            }
            i = ro(e, t, true, true);
            a = -1;
        } else {
            var c = lg(e, i, r.unit);
            if (r.extend) {
                s = n6(s, c.anchor, c.head, r.extend);
            } else {
                s = c;
            }
        }
        if (!r.addNew) {
            a = 0;
            nX(o, new n$([
                s
            ], 0), U);
            f = o.sel;
        } else if (a == -1) {
            a = u.length;
            nX(o, n_(e, u.concat([
                s
            ]), a), {
                scroll: false,
                origin: "*mouse"
            });
        } else if (u.length > 1 && u[a].empty() && r.unit == "char" && !r.extend) {
            nX(o, n_(e, u.slice(0, a).concat(u.slice(a + 1)), 0), {
                scroll: false,
                origin: "*mouse"
            });
            f = o.sel;
        } else {
            nG(o, a, s, U);
        }
        var h = i;
        function d(t) {
            if (eq(h, t) == 0) {
                return;
            }
            h = t;
            if (r.unit == "rectangle") {
                var n = [], l = e.options.tabSize;
                var u = z(e2(o, i.line).text, i.ch, l);
                var c = z(e2(o, t.line).text, t.ch, l);
                var d = Math.min(u, c), p = Math.max(u, c);
                for(var v = Math.min(i.line, t.line), g = Math.min(e.lastLine(), Math.max(i.line, t.line)); v <= g; v++){
                    var m = e2(o, v).text, $ = K(m, d, l);
                    if (d == p) {
                        n.push(new ny(e9(v, $), e9(v, $)));
                    } else if (m.length > $) {
                        n.push(new ny(e9(v, $), e9(v, K(m, p, l))));
                    }
                }
                if (!n.length) {
                    n.push(new ny(i, i));
                }
                nX(o, n_(e, f.ranges.slice(0, a).concat(n), a), {
                    origin: "*mouse",
                    scroll: false
                });
                e.scrollIntoView(t);
            } else {
                var y = s;
                var _ = lg(e, t, r.unit);
                var w = y.anchor, b;
                if (eq(_.anchor, w) > 0) {
                    b = _.head;
                    w = eQ(y.from(), _.anchor);
                } else {
                    b = _.anchor;
                    w = eJ(y.to(), _.head);
                }
                var x = f.ranges.slice(0);
                x[a] = l$(e, new ny(tt(o, w), b));
                nX(o, n_(e, x, a), U);
            }
        }
        var p = n.wrapper.getBoundingClientRect();
        var v = 0;
        function g(t) {
            var i = ++v;
            var l = ro(e, t, true, r.unit == "rectangle");
            if (!l) {
                return;
            }
            if (eq(l, h) != 0) {
                e.curOp.focus = A();
                d(l);
                var s = rS(n, o);
                if (l.line >= s.to || l.line < s.from) {
                    setTimeout(rY(e, function() {
                        if (v == i) {
                            g(t);
                        }
                    }), 150);
                }
            } else {
                var a = t.clientY < p.top ? -20 : t.clientY > p.bottom ? 20 : 0;
                if (a) {
                    setTimeout(rY(e, function() {
                        if (v != i) {
                            return;
                        }
                        n.scroller.scrollTop += a;
                        g(t);
                    }), 50);
                }
            }
        }
        function m(t) {
            e.state.selectingText = false;
            v = Infinity;
            if (t) {
                eb(t);
                n.input.focus();
            }
            eg(n.wrapper.ownerDocument, "mousemove", $);
            eg(n.wrapper.ownerDocument, "mouseup", y);
            o.history.lastSelOrigin = null;
        }
        var $ = rY(e, function(e) {
            if (e.buttons === 0 || !eT(e)) {
                m(e);
            } else {
                g(e);
            }
        });
        var y = rY(e, m);
        e.state.selectingText = y;
        ep(n.wrapper.ownerDocument, "mousemove", $);
        ep(n.wrapper.ownerDocument, "mouseup", y);
    }
    function l$(e, t) {
        var i = t.anchor;
        var r = t.head;
        var n = e2(e.doc, i.line);
        if (eq(i, r) == 0 && i.sticky == r.sticky) {
            return t;
        }
        var o = eh(n);
        if (!o) {
            return t;
        }
        var l = eu(o, i.ch, i.sticky), s = o[l];
        if (s.from != i.ch && s.to != i.ch) {
            return t;
        }
        var a = l + ((s.from == i.ch) == (s.level != 1) ? 0 : 1);
        if (a == 0 || a == o.length) {
            return t;
        }
        var f;
        if (r.line != i.line) {
            f = (r.line - i.line) * (e.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
            var u = eu(o, r.ch, r.sticky);
            var c = u - l || (r.ch - i.ch) * (s.level == 1 ? -1 : 1);
            if (u == a - 1 || u == a) {
                f = c < 0;
            } else {
                f = c > 0;
            }
        }
        var h = o[a + (f ? -1 : 0)];
        var d = f == (h.level == 1);
        var p = d ? h.from : h.to, v = d ? "after" : "before";
        return i.ch == p && i.sticky == v ? t : new ny(new e9(i.line, p, v), r);
    }
    function ly(e, t, i, r) {
        var n, o;
        if (t.touches) {
            n = t.touches[0].clientX;
            o = t.touches[0].clientY;
        } else {
            try {
                n = t.clientX;
                o = t.clientY;
            } catch (l) {
                return false;
            }
        }
        if (n >= Math.floor(e.display.gutters.getBoundingClientRect().right)) {
            return false;
        }
        if (r) {
            eb(t);
        }
        var s = e.display;
        var a = s.lineDiv.getBoundingClientRect();
        if (o > a.bottom || !e_(e, i)) {
            return eC(t);
        }
        o -= a.top - s.viewOffset;
        for(var f = 0; f < e.display.gutterSpecs.length; ++f){
            var u = s.gutters.childNodes[f];
            if (u && u.getBoundingClientRect().right >= n) {
                var c = eX(e.doc, o);
                var h = e.display.gutterSpecs[f];
                em(e, i, e, c, h.className, t);
                return eC(t);
            }
        }
    }
    function l_(e, t) {
        return ly(e, t, "gutterClick", true);
    }
    function lw(e, t) {
        if (iC(e.display, t) || lb(e, t)) {
            return;
        }
        if (e$(e, t, "contextmenu")) {
            return;
        }
        if (!x) {
            e.display.input.onContextMenu(t);
        }
    }
    function lb(e, t) {
        if (!e_(e, "gutterContextMenu")) {
            return false;
        }
        return ly(e, t, "gutterContextMenu", false);
    }
    function lx(e) {
        e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        i7(e);
    }
    var lC = {
        toString: function() {
            return "CodeMirror.Init";
        }
    };
    var lS = {};
    var lk = {};
    function lT(e) {
        var t = e.optionHandlers;
        function i(i, r, n, o) {
            e.defaults[i] = r;
            if (n) {
                t[i] = o ? function(e, t, i) {
                    if (i != lC) {
                        n(e, t, i);
                    }
                } : n;
            }
        }
        e.defineOption = i;
        e.Init = lC;
        i("value", "", function(e, t) {
            return e.setValue(t);
        }, true);
        i("mode", null, function(e, t) {
            e.doc.modeOption = t;
            nT(e);
        }, true);
        i("indentUnit", 2, nT, true);
        i("indentWithTabs", false);
        i("smartIndent", true);
        i("tabSize", 4, function(e) {
            nL(e);
            i7(e);
            rs(e);
        }, true);
        i("lineSeparator", null, function(e, t) {
            e.doc.lineSep = t;
            if (!t) {
                return;
            }
            var i = [], r = e.doc.first;
            e.doc.iter(function(e) {
                for(var n = 0;;){
                    var o = e.text.indexOf(t, n);
                    if (o == -1) {
                        break;
                    }
                    n = o + t.length;
                    i.push(e9(r, o));
                }
                r++;
            });
            for(var n = i.length - 1; n >= 0; n--){
                os(e.doc, t, i[n], e9(i[n].line, i[n].ch + t.length));
            }
        });
        i("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(e, t, i) {
            e.state.specialChars = new RegExp(t.source + (t.test("\t") ? "" : "|\t"), "g");
            if (i != lC) {
                e.refresh();
            }
        });
        i("specialCharPlaceholder", t9, function(e) {
            return e.refresh();
        }, true);
        i("electricChars", true);
        i("inputStyle", m ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        i("spellcheck", false, function(e, t) {
            return (e.getInputField().spellcheck = t);
        }, true);
        i("autocorrect", false, function(e, t) {
            return (e.getInputField().autocorrect = t);
        }, true);
        i("autocapitalize", false, function(e, t) {
            return (e.getInputField().autocapitalize = t);
        }, true);
        i("rtlMoveVisually", !_);
        i("wholeLineUpdateBefore", true);
        i("theme", "default", function(e) {
            lx(e);
            nc(e);
        }, true);
        i("keyMap", "default", function(e, t, i) {
            var r = o6(t);
            var n = i != lC && o6(i);
            if (n && n.detach) {
                n.detach(e, r);
            }
            if (r.attach) {
                r.attach(e, n || null);
            }
        });
        i("extraKeys", null);
        i("configureMouse", null);
        i("lineWrapping", false, lO, true);
        i("gutters", [], function(e, t) {
            e.display.gutterSpecs = nf(t, e.options.lineNumbers);
            nc(e);
        }, true);
        i("fixedGutter", true, function(e, t) {
            e.display.gutters.style.left = t ? ri(e.display) + "px" : "0";
            e.refresh();
        }, true);
        i("coverGutterNextToScrollbar", false, function(e) {
            return rI(e);
        }, true);
        i("scrollbarStyle", "native", function(e) {
            r7(e);
            rI(e);
            e.display.scrollbars.setScrollTop(e.doc.scrollTop);
            e.display.scrollbars.setScrollLeft(e.doc.scrollLeft);
        }, true);
        i("lineNumbers", false, function(e, t) {
            e.display.gutterSpecs = nf(e.options.gutters, t);
            nc(e);
        }, true);
        i("firstLineNumber", 1, nc, true);
        i("lineNumberFormatter", function(e) {
            return e;
        }, nc, true);
        i("showCursorWhenSelecting", false, rd, true);
        i("resetSelectionOnContextMenu", true);
        i("lineWiseCopyCut", true);
        i("pasteLinesPerSelection", true);
        i("selectionsMayTouch", false);
        i("readOnly", false, function(e, t) {
            if (t == "nocursor") {
                rb(e);
                e.display.input.blur();
            }
            e.display.input.readOnlyChanged(t);
        });
        i("screenReaderLabel", null, function(e, t) {
            t = t === "" ? null : t;
            e.display.input.screenReaderLabelChanged(t);
        });
        i("disableInput", false, function(e, t) {
            if (!t) {
                e.display.input.reset();
            }
        }, true);
        i("dragDrop", true, lL);
        i("allowDropFileTypes", null);
        i("cursorBlinkRate", 530);
        i("cursorScrollMargin", 0);
        i("cursorHeight", 1, rd, true);
        i("singleCursorHeightPerLine", true, rd, true);
        i("workTime", 100);
        i("workDelay", 100);
        i("flattenSpans", true, nL, true);
        i("addModeClass", false, nL, true);
        i("pollInterval", 100);
        i("undoDepth", 200, function(e, t) {
            return (e.doc.history.undoDepth = t);
        });
        i("historyEventDelay", 1250);
        i("viewportMargin", 10, function(e) {
            return e.refresh();
        }, true);
        i("maxHighlightLength", 10000, nL, true);
        i("moveInputWithCursor", true, function(e, t) {
            if (!t) {
                e.display.input.resetPosition();
            }
        });
        i("tabindex", null, function(e, t) {
            return (e.display.input.getField().tabIndex = t || "");
        });
        i("autofocus", null);
        i("direction", "ltr", function(e, t) {
            return e.doc.setDirection(t);
        }, true);
        i("phrases", null);
    }
    function lL(e, t, i) {
        var r = i && i != lC;
        if (!t != !r) {
            var n = e.display.dragFunctions;
            var o = t ? ep : eg;
            o(e.display.scroller, "dragstart", n.start);
            o(e.display.scroller, "dragenter", n.enter);
            o(e.display.scroller, "dragover", n.over);
            o(e.display.scroller, "dragleave", n.leave);
            o(e.display.scroller, "drop", n.drop);
        }
    }
    function lO(e) {
        if (e.options.lineWrapping) {
            D(e.display.wrapper, "CodeMirror-wrap");
            e.display.sizer.style.minWidth = "";
            e.display.sizerWidth = null;
        } else {
            S(e.display.wrapper, "CodeMirror-wrap");
            t2(e);
        }
        rn(e);
        rs(e);
        i7(e);
        setTimeout(function() {
            return rI(e);
        }, 100);
    }
    function l0(e, t) {
        var i = this;
        if (!(this instanceof l0)) {
            return new l0(e, t);
        }
        this.options = t = t ? P(t) : {};
        P(lS, t, false);
        var r = t.value;
        if (typeof r == "string") {
            r = new ok(r, t.mode, null, t.lineSeparator, t.direction);
        } else if (t.mode) {
            r.modeOption = t.mode;
        }
        this.doc = r;
        var n = new l0.inputStyles[t.inputStyle](this);
        var o = (this.display = new nh(e, r, n, t));
        o.wrapper.CodeMirror = this;
        lx(this);
        if (t.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap";
        }
        r7(this);
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
            highlight: new E(),
            keySeq: null,
            specialChars: null
        };
        if (t.autofocus && !m) {
            o.input.focus();
        }
        if (l && s < 11) {
            setTimeout(function() {
                return i.display.input.reset(true);
            }, 20);
        }
        lW(this);
        oD();
        r4(this);
        this.curOp.forceUpdate = true;
        nN(this, r);
        if ((t.autofocus && !m) || this.hasFocus()) {
            setTimeout(function() {
                if (i.hasFocus() && !i.state.focused) {
                    rw(i);
                }
            }, 20);
        } else {
            rb(this);
        }
        for(var f in lk){
            if (lk.hasOwnProperty(f)) {
                lk[f](this, t[f], lC);
            }
        }
        na(this);
        if (t.finishInit) {
            t.finishInit(this);
        }
        for(var u = 0; u < lN.length; ++u){
            lN[u](this);
        }
        r6(this);
        if (a && t.lineWrapping && getComputedStyle(o.lineDiv).textRendering == "optimizelegibility") {
            o.lineDiv.style.textRendering = "auto";
        }
    }
    l0.defaults = lS;
    l0.optionHandlers = lk;
    function lW(e) {
        var t = e.display;
        ep(t.scroller, "mousedown", rY(e, lc));
        if (l && s < 11) {
            ep(t.scroller, "dblclick", rY(e, function(t) {
                if (e$(e, t)) {
                    return;
                }
                var i = ro(e, t);
                if (!i || l_(e, t) || iC(e.display, t)) {
                    return;
                }
                eb(t);
                var r = e.findWordAt(i);
                n5(e.doc, r.anchor, r.head);
            }));
        } else {
            ep(t.scroller, "dblclick", function(t) {
                return e$(e, t) || eb(t);
            });
        }
        ep(t.scroller, "contextmenu", function(t) {
            return lw(e, t);
        });
        ep(t.input.getField(), "contextmenu", function(i) {
            if (!t.scroller.contains(i.target)) {
                lw(e, i);
            }
        });
        var i, r = {
            end: 0
        };
        function n() {
            if (t.activeTouch) {
                i = setTimeout(function() {
                    return (t.activeTouch = null);
                }, 1000);
                r = t.activeTouch;
                r.end = +new Date();
            }
        }
        function o(e) {
            if (e.touches.length != 1) {
                return false;
            }
            var t = e.touches[0];
            return t.radiusX <= 1 && t.radiusY <= 1;
        }
        function a(e, t) {
            if (t.left == null) {
                return true;
            }
            var i = t.left - e.left, r = t.top - e.top;
            return i * i + r * r > 20 * 20;
        }
        ep(t.scroller, "touchstart", function(n) {
            if (!e$(e, n) && !o(n) && !l_(e, n)) {
                t.input.ensurePolled();
                clearTimeout(i);
                var l = +new Date();
                t.activeTouch = {
                    start: l,
                    moved: false,
                    prev: l - r.end <= 300 ? r : null
                };
                if (n.touches.length == 1) {
                    t.activeTouch.left = n.touches[0].pageX;
                    t.activeTouch.top = n.touches[0].pageY;
                }
            }
        });
        ep(t.scroller, "touchmove", function() {
            if (t.activeTouch) {
                t.activeTouch.moved = true;
            }
        });
        ep(t.scroller, "touchend", function(i) {
            var r = t.activeTouch;
            if (r && !iC(t, i) && r.left != null && !r.moved && new Date() - r.start < 300) {
                var o = e.coordsChar(t.activeTouch, "page"), l;
                if (!r.prev || a(r, r.prev)) {
                    l = new ny(o, o);
                } else if (!r.prev.prev || a(r, r.prev.prev)) {
                    l = e.findWordAt(o);
                } else {
                    l = new ny(e9(o.line, 0), tt(e.doc, e9(o.line + 1, 0)));
                }
                e.setSelection(l.anchor, l.head);
                e.focus();
                eb(i);
            }
            n();
        });
        ep(t.scroller, "touchcancel", n);
        ep(t.scroller, "scroll", function() {
            if (t.scroller.clientHeight) {
                rF(e, t.scroller.scrollTop);
                r1(e, t.scroller.scrollLeft, true);
                em(e, "scroll", e);
            }
        });
        ep(t.scroller, "mousewheel", function(t) {
            return nm(e, t);
        });
        ep(t.scroller, "DOMMouseScroll", function(t) {
            return nm(e, t);
        });
        ep(t.wrapper, "scroll", function() {
            return (t.wrapper.scrollTop = t.wrapper.scrollLeft = 0);
        });
        t.dragFunctions = {
            enter: function(t) {
                if (!e$(e, t)) {
                    eS(t);
                }
            },
            over: function(t) {
                if (!e$(e, t)) {
                    o0(e, t);
                    eS(t);
                }
            },
            start: function(t) {
                return oO(e, t);
            },
            drop: rY(e, oL),
            leave: function(t) {
                if (!e$(e, t)) {
                    oW(e);
                }
            }
        };
        var f = t.input.getField();
        ep(f, "keyup", function(t) {
            return ln.call(e, t);
        });
        ep(f, "keydown", rY(e, li));
        ep(f, "keypress", rY(e, lo));
        ep(f, "focus", function(t) {
            return rw(e, t);
        });
        ep(f, "blur", function(t) {
            return rb(e, t);
        });
    }
    var lN = [];
    l0.defineInitHook = function(e) {
        return lN.push(e);
    };
    function lA(e, t, i, r) {
        var n = e.doc, o;
        if (i == null) {
            i = "add";
        }
        if (i == "smart") {
            if (!n.mode.indent) {
                i = "prev";
            } else {
                o = ta(e, t).state;
            }
        }
        var l = e.options.tabSize;
        var s = e2(n, t), a = z(s.text, null, l);
        if (s.stateAfter) {
            s.stateAfter = null;
        }
        var f = s.text.match(/^\s*/)[0], u;
        if (!r && !/\S/.test(s.text)) {
            u = 0;
            i = "not";
        } else if (i == "smart") {
            u = n.mode.indent(o, s.text.slice(f.length), s.text);
            if (u == B || u > 150) {
                if (!r) {
                    return;
                }
                i = "prev";
            }
        }
        if (i == "prev") {
            if (t > n.first) {
                u = z(e2(n, t - 1).text, null, l);
            } else {
                u = 0;
            }
        } else if (i == "add") {
            u = a + e.options.indentUnit;
        } else if (i == "subtract") {
            u = a - e.options.indentUnit;
        } else if (typeof i == "number") {
            u = a + i;
        }
        u = Math.max(0, u);
        var c = "", h = 0;
        if (e.options.indentWithTabs) {
            for(var d = Math.floor(u / l); d; --d){
                h += l;
                c += "\t";
            }
        }
        if (h < u) {
            c += Y(u - h);
        }
        if (c != f) {
            os(n, c, e9(t, 0), e9(t, f.length), "+input");
            s.stateAfter = null;
            return true;
        } else {
            for(var p = 0; p < n.sel.ranges.length; p++){
                var v = n.sel.ranges[p];
                if (v.head.line == t && v.head.ch < f.length) {
                    var g = e9(t, f.length);
                    nG(n, p, new ny(g, g));
                    break;
                }
            }
        }
    }
    var lD = null;
    function lH(e) {
        lD = e;
    }
    function lF(e, t, i, r, n) {
        var o = e.doc;
        e.display.shift = false;
        if (!r) {
            r = o.sel;
        }
        var l = +new Date() - 200;
        var s = n == "paste" || e.state.pasteIncoming > l;
        var a = eA(t), f = null;
        if (s && r.ranges.length > 1) {
            if (lD && lD.text.join("\n") == t) {
                if (r.ranges.length % lD.text.length == 0) {
                    f = [];
                    for(var u = 0; u < lD.text.length; u++){
                        f.push(o.splitLines(lD.text[u]));
                    }
                }
            } else if (a.length == r.ranges.length && e.options.pasteLinesPerSelection) {
                f = q(a, function(e) {
                    return [
                        e
                    ];
                });
            }
        }
        var c = e.curOp.updateInput;
        for(var h = r.ranges.length - 1; h >= 0; h--){
            var d = r.ranges[h];
            var p = d.from(), v = d.to();
            if (d.empty()) {
                if (i && i > 0) {
                    p = e9(p.line, p.ch - i);
                } else if (e.state.overwrite && !s) {
                    v = e9(v.line, Math.min(e2(o, v.line).text.length, v.ch + j(a).length));
                } else if (s && lD && lD.lineWise && lD.text.join("\n") == a.join("\n")) {
                    p = v = e9(p.line, 0);
                }
            }
            var g = {
                from: p,
                to: v,
                text: f ? f[h % f.length] : a,
                origin: n || (s ? "paste" : e.state.cutIncoming > l ? "cut" : "+input")
            };
            ot(e.doc, g);
            ia(e, "inputRead", e, g);
        }
        if (t && !s) {
            l1(e, t);
        }
        rW(e);
        if (e.curOp.updateInput < 2) {
            e.curOp.updateInput = c;
        }
        e.curOp.typing = true;
        e.state.pasteIncoming = e.state.cutIncoming = -1;
    }
    function lM(e, t) {
        var i = e.clipboardData && e.clipboardData.getData("Text");
        if (i) {
            e.preventDefault();
            if (!t.isReadOnly() && !t.options.disableInput) {
                rX(t, function() {
                    return lF(t, i, 0, null, "paste");
                });
            }
            return true;
        }
    }
    function l1(e, t) {
        if (!e.options.electricChars || !e.options.smartIndent) {
            return;
        }
        var i = e.doc.sel;
        for(var r = i.ranges.length - 1; r >= 0; r--){
            var n = i.ranges[r];
            if (n.head.ch > 100 || (r && i.ranges[r - 1].head.line == n.head.line)) {
                continue;
            }
            var o = e.getModeAt(n.head);
            var l = false;
            if (o.electricChars) {
                for(var s = 0; s < o.electricChars.length; s++){
                    if (t.indexOf(o.electricChars.charAt(s)) > -1) {
                        l = lA(e, n.head.line, "smart");
                        break;
                    }
                }
            } else if (o.electricInput) {
                if (o.electricInput.test(e2(e.doc, n.head.line).text.slice(0, n.head.ch))) {
                    l = lA(e, n.head.line, "smart");
                }
            }
            if (l) {
                ia(e, "electricInput", e, n.head.line);
            }
        }
    }
    function lP(e) {
        var t = [], i = [];
        for(var r = 0; r < e.doc.sel.ranges.length; r++){
            var n = e.doc.sel.ranges[r].head.line;
            var o = {
                anchor: e9(n, 0),
                head: e9(n + 1, 0)
            };
            i.push(o);
            t.push(e.getRange(o.anchor, o.head));
        }
        return {
            text: t,
            ranges: i
        };
    }
    function lz(e, t, i, r) {
        e.setAttribute("autocorrect", i ? "" : "off");
        e.setAttribute("autocapitalize", r ? "" : "off");
        e.setAttribute("spellcheck", !!t);
    }
    function lE() {
        var e = L("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var t = L("div", [
            e
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (a) {
            e.style.width = "1000px";
        } else {
            e.setAttribute("wrap", "off");
        }
        if (v) {
            e.style.border = "1px solid black";
        }
        lz(e);
        return t;
    }
    function lI(e) {
        var t = e.optionHandlers;
        var i = (e.helpers = {});
        e.prototype = {
            constructor: e,
            focus: function() {
                window.focus();
                this.display.input.focus();
            },
            setOption: function(e, i) {
                var r = this.options, n = r[e];
                if (r[e] == i && e != "mode") {
                    return;
                }
                r[e] = i;
                if (t.hasOwnProperty(e)) {
                    rY(this, t[e])(this, i, n);
                }
                em(this, "optionChange", this, e);
            },
            getOption: function(e) {
                return this.options[e];
            },
            getDoc: function() {
                return this.doc;
            },
            addKeyMap: function(e, t) {
                this.state.keyMaps[t ? "push" : "unshift"](o6(e));
            },
            removeKeyMap: function(e) {
                var t = this.state.keyMaps;
                for(var i = 0; i < t.length; ++i){
                    if (t[i] == e || t[i].name == e) {
                        t.splice(i, 1);
                        return true;
                    }
                }
            },
            addOverlay: rj(function(t, i) {
                var r = t.token ? t : e.getMode(this.options, t);
                if (r.startState) {
                    throw new Error("Overlays may not be stateful.");
                }
                Z(this.state.overlays, {
                    mode: r,
                    modeSpec: t,
                    opaque: i && i.opaque,
                    priority: (i && i.priority) || 0
                }, function(e) {
                    return e.priority;
                });
                this.state.modeGen++;
                rs(this);
            }),
            removeOverlay: rj(function(e) {
                var t = this.state.overlays;
                for(var i = 0; i < t.length; ++i){
                    var r = t[i].modeSpec;
                    if (r == e || (typeof e == "string" && r.name == e)) {
                        t.splice(i, 1);
                        this.state.modeGen++;
                        rs(this);
                        return;
                    }
                }
            }),
            indentLine: rj(function(e, t, i) {
                if (typeof t != "string" && typeof t != "number") {
                    if (t == null) {
                        t = this.options.smartIndent ? "smart" : "prev";
                    } else {
                        t = t ? "add" : "subtract";
                    }
                }
                if (eY(this.doc, e)) {
                    lA(this, e, t, i);
                }
            }),
            indentSelection: rj(function(e) {
                var t = this.doc.sel.ranges, i = -1;
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    if (!n.empty()) {
                        var o = n.from(), l = n.to();
                        var s = Math.max(i, o.line);
                        i = Math.min(this.lastLine(), l.line - (l.ch ? 0 : 1)) + 1;
                        for(var a = s; a < i; ++a){
                            lA(this, a, e);
                        }
                        var f = this.doc.sel.ranges;
                        if (o.ch == 0 && t.length == f.length && f[r].from().ch > 0) {
                            nG(this.doc, r, new ny(o, f[r].to()), G);
                        }
                    } else if (n.head.line > i) {
                        lA(this, n.head.line, e, true);
                        i = n.head.line;
                        if (r == this.doc.sel.primIndex) {
                            rW(this);
                        }
                    }
                }
            }),
            getTokenAt: function(e, t) {
                return td(this, e, t);
            },
            getLineTokens: function(e, t) {
                return td(this, e9(e), t, true);
            },
            getTokenTypeAt: function(e) {
                e = tt(this.doc, e);
                var t = ts(this, e2(this.doc, e.line));
                var i = 0, r = (t.length - 1) / 2, n = e.ch;
                var o;
                if (n == 0) {
                    o = t[2];
                } else {
                    for(;;){
                        var l = (i + r) >> 1;
                        if ((l ? t[l * 2 - 1] : 0) >= n) {
                            r = l;
                        } else if (t[l * 2 + 1] < n) {
                            i = l + 1;
                        } else {
                            o = t[l * 2 + 2];
                            break;
                        }
                    }
                }
                var s = o ? o.indexOf("overlay ") : -1;
                return s < 0 ? o : s == 0 ? null : o.slice(0, s - 1);
            },
            getModeAt: function(t) {
                var i = this.doc.mode;
                if (!i.innerMode) {
                    return i;
                }
                return e.innerMode(i, this.getTokenAt(t).state).mode;
            },
            getHelper: function(e, t) {
                return this.getHelpers(e, t)[0];
            },
            getHelpers: function(e, t) {
                var r = [];
                if (!i.hasOwnProperty(t)) {
                    return r;
                }
                var n = i[t], o = this.getModeAt(e);
                if (typeof o[t] == "string") {
                    if (n[o[t]]) {
                        r.push(n[o[t]]);
                    }
                } else if (o[t]) {
                    for(var l = 0; l < o[t].length; l++){
                        var s = n[o[t][l]];
                        if (s) {
                            r.push(s);
                        }
                    }
                } else if (o.helperType && n[o.helperType]) {
                    r.push(n[o.helperType]);
                } else if (n[o.name]) {
                    r.push(n[o.name]);
                }
                for(var a = 0; a < n._global.length; a++){
                    var f = n._global[a];
                    if (f.pred(o, this) && I(r, f.val) == -1) {
                        r.push(f.val);
                    }
                }
                return r;
            },
            getStateAfter: function(e, t) {
                var i = this.doc;
                e = te(i, e == null ? i.first + i.size - 1 : e);
                return ta(this, e + 1, t).state;
            },
            cursorCoords: function(e, t) {
                var i, r = this.doc.sel.primary();
                if (e == null) {
                    i = r.head;
                } else if (typeof e == "object") {
                    i = tt(this.doc, e);
                } else {
                    i = e ? r.from() : r.to();
                }
                return iU(this, i, t || "page");
            },
            charCoords: function(e, t) {
                return iG(this, tt(this.doc, e), t || "page");
            },
            coordsChar: function(e, t) {
                e = i2(this, e, t || "page");
                return iX(this, e.left, e.top);
            },
            lineAtHeight: function(e, t) {
                e = i2(this, {
                    top: e,
                    left: 0
                }, t || "page").top;
                return eX(this.doc, e + this.display.viewOffset);
            },
            heightAtLine: function(e, t, i) {
                var r = false, n;
                if (typeof e == "number") {
                    var o = this.doc.first + this.doc.size - 1;
                    if (e < this.doc.first) {
                        e = this.doc.first;
                    } else if (e > o) {
                        e = o;
                        r = true;
                    }
                    n = e2(this.doc, e);
                } else {
                    n = e;
                }
                return (i5(this, n, {
                    top: 0,
                    left: 0
                }, t || "page", i || r).top + (r ? this.doc.height - t6(n) : 0));
            },
            defaultTextHeight: function() {
                return iQ(this.display);
            },
            defaultCharWidth: function() {
                return re(this.display);
            },
            getViewport: function() {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function(e, t, i, r, n) {
                var o = this.display;
                e = iU(this, tt(this.doc, e));
                var l = e.bottom, s = e.left;
                t.style.position = "absolute";
                t.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(t);
                o.sizer.appendChild(t);
                if (r == "over") {
                    l = e.top;
                } else if (r == "above" || r == "near") {
                    var a = Math.max(o.wrapper.clientHeight, this.doc.height), f = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
                    if ((r == "above" || e.bottom + t.offsetHeight > a) && e.top > t.offsetHeight) {
                        l = e.top - t.offsetHeight;
                    } else if (e.bottom + t.offsetHeight <= a) {
                        l = e.bottom;
                    }
                    if (s + t.offsetWidth > f) {
                        s = f - t.offsetWidth;
                    }
                }
                t.style.top = l + "px";
                t.style.left = t.style.right = "";
                if (n == "right") {
                    s = o.sizer.clientWidth - t.offsetWidth;
                    t.style.right = "0px";
                } else {
                    if (n == "left") {
                        s = 0;
                    } else if (n == "middle") {
                        s = (o.sizer.clientWidth - t.offsetWidth) / 2;
                    }
                    t.style.left = s + "px";
                }
                if (i) {
                    rL(this, {
                        left: s,
                        top: l,
                        right: s + t.offsetWidth,
                        bottom: l + t.offsetHeight
                    });
                }
            },
            triggerOnKeyDown: rj(li),
            triggerOnKeyPress: rj(lo),
            triggerOnKeyUp: ln,
            triggerOnMouseDown: rj(lc),
            execCommand: function(e) {
                if (oK.hasOwnProperty(e)) {
                    return oK[e].call(null, this);
                }
            },
            triggerElectric: rj(function(e) {
                l1(this, e);
            }),
            findPosH: function(e, t, i, r) {
                var n = 1;
                if (t < 0) {
                    n = -1;
                    t = -t;
                }
                var o = tt(this.doc, e);
                for(var l = 0; l < t; ++l){
                    o = lR(this.doc, o, n, i, r);
                    if (o.hitSide) {
                        break;
                    }
                }
                return o;
            },
            moveH: rj(function(e, t) {
                var i = this;
                this.extendSelectionsBy(function(r) {
                    if (i.display.shift || i.doc.extend || r.empty()) {
                        return lR(i.doc, r.head, e, t, i.options.rtlMoveVisually);
                    } else {
                        return e < 0 ? r.from() : r.to();
                    }
                }, V);
            }),
            deleteH: rj(function(e, t) {
                var i = this.doc.sel, r = this.doc;
                if (i.somethingSelected()) {
                    r.replaceSelection("", null, "+delete");
                } else {
                    o5(this, function(i) {
                        var n = lR(r, i.head, e, t, false);
                        return e < 0 ? {
                            from: n,
                            to: i.head
                        } : {
                            from: i.head,
                            to: n
                        };
                    });
                }
            }),
            findPosV: function(e, t, i, r) {
                var n = 1, o = r;
                if (t < 0) {
                    n = -1;
                    t = -t;
                }
                var l = tt(this.doc, e);
                for(var s = 0; s < t; ++s){
                    var a = iU(this, l, "div");
                    if (o == null) {
                        o = a.left;
                    } else {
                        a.left = o;
                    }
                    l = l3(this, a, n, i);
                    if (l.hitSide) {
                        break;
                    }
                }
                return l;
            },
            moveV: rj(function(e, t) {
                var i = this;
                var r = this.doc, n = [];
                var o = !this.display.shift && !r.extend && r.sel.somethingSelected();
                r.extendSelectionsBy(function(l) {
                    if (o) {
                        return e < 0 ? l.from() : l.to();
                    }
                    var s = iU(i, l.head, "div");
                    if (l.goalColumn != null) {
                        s.left = l.goalColumn;
                    }
                    n.push(s.left);
                    var a = l3(i, s, e, t);
                    if (t == "page" && l == r.sel.primary()) {
                        r0(i, iG(i, a, "div").top - s.top);
                    }
                    return a;
                }, V);
                if (n.length) {
                    for(var l = 0; l < r.sel.ranges.length; l++){
                        r.sel.ranges[l].goalColumn = n[l];
                    }
                }
            }),
            findWordAt: function(e) {
                var t = this.doc, i = e2(t, e.line).text;
                var r = e.ch, n = e.ch;
                if (i) {
                    var o = this.getHelper(e, "wordChars");
                    if ((e.sticky == "before" || n == i.length) && r) {
                        --r;
                    } else {
                        ++n;
                    }
                    var l = i.charAt(r);
                    var s = ei(l, o) ? function(e) {
                        return ei(e, o);
                    } : /\s/.test(l) ? function(e) {
                        return /\s/.test(e);
                    } : function(e) {
                        return !/\s/.test(e) && !ei(e);
                    };
                    while(r > 0 && s(i.charAt(r - 1))){
                        --r;
                    }
                    while(n < i.length && s(i.charAt(n))){
                        ++n;
                    }
                }
                return new ny(e9(e.line, r), e9(e.line, n));
            },
            toggleOverwrite: function(e) {
                if (e != null && e == this.state.overwrite) {
                    return;
                }
                if ((this.state.overwrite = !this.state.overwrite)) {
                    D(this.display.cursorDiv, "CodeMirror-overwrite");
                } else {
                    S(this.display.cursorDiv, "CodeMirror-overwrite");
                }
                em(this, "overwriteToggle", this, this.state.overwrite);
            },
            hasFocus: function() {
                return this.display.input.getField() == A();
            },
            isReadOnly: function() {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: rj(function(e, t) {
                rN(this, e, t);
            }),
            getScrollInfo: function() {
                var e = this.display.scroller;
                return {
                    left: e.scrollLeft,
                    top: e.scrollTop,
                    height: e.scrollHeight - iL(this) - this.display.barHeight,
                    width: e.scrollWidth - iL(this) - this.display.barWidth,
                    clientHeight: i0(this),
                    clientWidth: iO(this)
                };
            },
            scrollIntoView: rj(function(e, t) {
                if (e == null) {
                    e = {
                        from: this.doc.sel.primary().head,
                        to: null
                    };
                    if (t == null) {
                        t = this.options.cursorScrollMargin;
                    }
                } else if (typeof e == "number") {
                    e = {
                        from: e9(e, 0),
                        to: null
                    };
                } else if (e.from == null) {
                    e = {
                        from: e,
                        to: null
                    };
                }
                if (!e.to) {
                    e.to = e.from;
                }
                e.margin = t || 0;
                if (e.from.line != null) {
                    rA(this, e);
                } else {
                    rH(this, e.from, e.to, e.margin);
                }
            }),
            setSize: rj(function(e, t) {
                var i = this;
                var r = function(e) {
                    return typeof e == "number" || /^\d+$/.test(String(e)) ? e + "px" : e;
                };
                if (e != null) {
                    this.display.wrapper.style.width = r(e);
                }
                if (t != null) {
                    this.display.wrapper.style.height = r(t);
                }
                if (this.options.lineWrapping) {
                    i3(this);
                }
                var n = this.display.viewFrom;
                this.doc.iter(n, this.display.viewTo, function(e) {
                    if (e.widgets) {
                        for(var t = 0; t < e.widgets.length; t++){
                            if (e.widgets[t].noHScroll) {
                                ra(i, n, "widget");
                                break;
                            }
                        }
                    }
                    ++n;
                });
                this.curOp.forceUpdate = true;
                em(this, "refresh", this);
            }),
            operation: function(e) {
                return rX(this, e);
            },
            startOperation: function() {
                return r4(this);
            },
            endOperation: function() {
                return r6(this);
            },
            refresh: rj(function() {
                var e = this.display.cachedTextHeight;
                rs(this);
                this.curOp.forceUpdate = true;
                i7(this);
                rN(this, this.doc.scrollLeft, this.doc.scrollTop);
                no(this.display);
                if (e == null || Math.abs(e - iQ(this.display)) > 0.5 || this.options.lineWrapping) {
                    rn(this);
                }
                em(this, "refresh", this);
            }),
            swapDoc: rj(function(e) {
                var t = this.doc;
                t.cm = null;
                if (this.state.selectingText) {
                    this.state.selectingText();
                }
                nN(this, e);
                i7(this);
                this.display.input.reset();
                rN(this, e.scrollLeft, e.scrollTop);
                this.curOp.forceScroll = true;
                ia(this, "swapDoc", this, t);
                return t;
            }),
            phrase: function(e) {
                var t = this.options.phrases;
                return t && Object.prototype.hasOwnProperty.call(t, e) ? t[e] : e;
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
        ew(e);
        e.registerHelper = function(t, r, n) {
            if (!i.hasOwnProperty(t)) {
                i[t] = e[t] = {
                    _global: []
                };
            }
            i[t][r] = n;
        };
        e.registerGlobalHelper = function(t, r, n, o) {
            e.registerHelper(t, r, o);
            i[t]._global.push({
                pred: n,
                val: o
            });
        };
    }
    function lR(e, t, i, r, n) {
        var o = t;
        var l = i;
        var s = e2(e, t.line);
        var a = n && e.direction == "rtl" ? -i : i;
        function f() {
            var i = t.line + a;
            if (i < e.first || i >= e.first + e.size) {
                return false;
            }
            t = new e9(i, t.ch, t.sticky);
            return (s = e2(e, i));
        }
        function u(o) {
            var l;
            if (r == "codepoint") {
                var u = s.text.charCodeAt(t.ch + (i > 0 ? 0 : -1));
                if (isNaN(u)) {
                    l = null;
                } else {
                    var c = i > 0 ? u >= 0xd800 && u < 0xdc00 : u >= 0xdc00 && u < 0xdfff;
                    l = new e9(t.line, Math.max(0, Math.min(s.text.length, t.ch + i * (c ? 2 : 1))), -i);
                }
            } else if (n) {
                l = oV(e.cm, s, t, i);
            } else {
                l = oG(s, t, i);
            }
            if (l == null) {
                if (!o && f()) {
                    t = oU(n, e.cm, s, t.line, a);
                } else {
                    return false;
                }
            } else {
                t = l;
            }
            return true;
        }
        if (r == "char" || r == "codepoint") {
            u();
        } else if (r == "column") {
            u(true);
        } else if (r == "word" || r == "group") {
            var c = null, h = r == "group";
            var d = e.cm && e.cm.getHelper(t, "wordChars");
            for(var p = true;; p = false){
                if (i < 0 && !u(!p)) {
                    break;
                }
                var v = s.text.charAt(t.ch) || "\n";
                var g = ei(v, d) ? "w" : h && v == "\n" ? "n" : !h || /\s/.test(v) ? null : "p";
                if (h && !p && !g) {
                    g = "s";
                }
                if (c && c != g) {
                    if (i < 0) {
                        i = 1;
                        u();
                        t.sticky = "after";
                    }
                    break;
                }
                if (g) {
                    c = g;
                }
                if (i > 0 && !u(!p)) {
                    break;
                }
            }
        }
        var m = nZ(e, t, o, l, true);
        if (e8(o, m)) {
            m.hitSide = true;
        }
        return m;
    }
    function l3(e, t, i, r) {
        var n = e.doc, o = t.left, l;
        if (r == "page") {
            var s = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            var a = Math.max(s - 0.5 * iQ(e.display), 3);
            l = (i > 0 ? t.bottom : t.top) + i * a;
        } else if (r == "line") {
            l = i > 0 ? t.bottom + 3 : t.top - 3;
        }
        var f;
        for(;;){
            f = iX(e, o, l);
            if (!f.outside) {
                break;
            }
            if (i < 0 ? l <= 0 : l >= n.height) {
                f.hitSide = true;
                break;
            }
            l += i * 5;
        }
        return f;
    }
    var l7 = function(e) {
        this.cm = e;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new E();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
    };
    l7.prototype.init = function(e) {
        var t = this;
        var i = this, r = i.cm;
        var n = (i.div = e.lineDiv);
        n.contentEditable = true;
        lz(n, r.options.spellcheck, r.options.autocorrect, r.options.autocapitalize);
        function o(e) {
            for(var t = e.target; t; t = t.parentNode){
                if (t == n) {
                    return true;
                }
                if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) {
                    break;
                }
            }
            return false;
        }
        ep(n, "paste", function(e) {
            if (!o(e) || e$(r, e) || lM(e, r)) {
                return;
            }
            if (s <= 11) {
                setTimeout(rY(r, function() {
                    return t.updateFromDOM();
                }), 20);
            }
        });
        ep(n, "compositionstart", function(e) {
            t.composing = {
                data: e.data,
                done: false
            };
        });
        ep(n, "compositionupdate", function(e) {
            if (!t.composing) {
                t.composing = {
                    data: e.data,
                    done: false
                };
            }
        });
        ep(n, "compositionend", function(e) {
            if (t.composing) {
                if (e.data != t.composing.data) {
                    t.readFromDOMSoon();
                }
                t.composing.done = true;
            }
        });
        ep(n, "touchstart", function() {
            return i.forceCompositionEnd();
        });
        ep(n, "input", function() {
            if (!t.composing) {
                t.readFromDOMSoon();
            }
        });
        function l(e) {
            if (!o(e) || e$(r, e)) {
                return;
            }
            if (r.somethingSelected()) {
                lH({
                    lineWise: false,
                    text: r.getSelections()
                });
                if (e.type == "cut") {
                    r.replaceSelection("", null, "cut");
                }
            } else if (!r.options.lineWiseCopyCut) {
                return;
            } else {
                var t = lP(r);
                lH({
                    lineWise: true,
                    text: t.text
                });
                if (e.type == "cut") {
                    r.operation(function() {
                        r.setSelections(t.ranges, 0, G);
                        r.replaceSelection("", null, "cut");
                    });
                }
            }
            if (e.clipboardData) {
                e.clipboardData.clearData();
                var l = lD.text.join("\n");
                e.clipboardData.setData("Text", l);
                if (e.clipboardData.getData("Text") == l) {
                    e.preventDefault();
                    return;
                }
            }
            var s = lE(), a = s.firstChild;
            r.display.lineSpace.insertBefore(s, r.display.lineSpace.firstChild);
            a.value = lD.text.join("\n");
            var f = A();
            F(a);
            setTimeout(function() {
                r.display.lineSpace.removeChild(s);
                f.focus();
                if (f == n) {
                    i.showPrimarySelection();
                }
            }, 50);
        }
        ep(n, "copy", l);
        ep(n, "cut", l);
    };
    l7.prototype.screenReaderLabelChanged = function(e) {
        if (e) {
            this.div.setAttribute("aria-label", e);
        } else {
            this.div.removeAttribute("aria-label");
        }
    };
    l7.prototype.prepareSelection = function() {
        var e = rp(this.cm, false);
        e.focus = A() == this.div;
        return e;
    };
    l7.prototype.showSelection = function(e, t) {
        if (!e || !this.cm.display.view.length) {
            return;
        }
        if (e.focus || t) {
            this.showPrimarySelection();
        }
        this.showMultipleSelections(e);
    };
    l7.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    };
    l7.prototype.showPrimarySelection = function() {
        var e = this.getSelection(), t = this.cm, r = t.doc.sel.primary();
        var n = r.from(), o = r.to();
        if (t.display.viewTo == t.display.viewFrom || n.line >= t.display.viewTo || o.line < t.display.viewFrom) {
            e.removeAllRanges();
            return;
        }
        var l = l2(t, e.anchorNode, e.anchorOffset);
        var s = l2(t, e.focusNode, e.focusOffset);
        if (l && !l.bad && s && !s.bad && eq(eQ(l, s), n) == 0 && eq(eJ(l, s), o) == 0) {
            return;
        }
        var a = t.display.view;
        var f = (n.line >= t.display.viewFrom && lB(t, n)) || {
            node: a[0].measure.map[2],
            offset: 0
        };
        var u = o.line < t.display.viewTo && lB(t, o);
        if (!u) {
            var c = a[a.length - 1].measure;
            var h = c.maps ? c.maps[c.maps.length - 1] : c.map;
            u = {
                node: h[h.length - 1],
                offset: h[h.length - 2] - h[h.length - 3]
            };
        }
        if (!f || !u) {
            e.removeAllRanges();
            return;
        }
        var d = e.rangeCount && e.getRangeAt(0), p;
        try {
            p = W(f.node, f.offset, u.offset, u.node);
        } catch (v) {}
        if (p) {
            if (!i && t.state.focused) {
                e.collapse(f.node, f.offset);
                if (!p.collapsed) {
                    e.removeAllRanges();
                    e.addRange(p);
                }
            } else {
                e.removeAllRanges();
                e.addRange(p);
            }
            if (d && e.anchorNode == null) {
                e.addRange(d);
            } else if (i) {
                this.startGracePeriod();
            }
        }
        this.rememberSelection();
    };
    l7.prototype.startGracePeriod = function() {
        var e = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function() {
            e.gracePeriod = false;
            if (e.selectionChanged()) {
                e.cm.operation(function() {
                    return (e.cm.curOp.selectionChanged = true);
                });
            }
        }, 20);
    };
    l7.prototype.showMultipleSelections = function(e) {
        T(this.cm.display.cursorDiv, e.cursors);
        T(this.cm.display.selectionDiv, e.selection);
    };
    l7.prototype.rememberSelection = function() {
        var e = this.getSelection();
        this.lastAnchorNode = e.anchorNode;
        this.lastAnchorOffset = e.anchorOffset;
        this.lastFocusNode = e.focusNode;
        this.lastFocusOffset = e.focusOffset;
    };
    l7.prototype.selectionInEditor = function() {
        var e = this.getSelection();
        if (!e.rangeCount) {
            return false;
        }
        var t = e.getRangeAt(0).commonAncestorContainer;
        return N(this.div, t);
    };
    l7.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || A() != this.div) {
                this.showSelection(this.prepareSelection(), true);
            }
            this.div.focus();
        }
    };
    l7.prototype.blur = function() {
        this.div.blur();
    };
    l7.prototype.getField = function() {
        return this.div;
    };
    l7.prototype.supportsTouch = function() {
        return true;
    };
    l7.prototype.receivedFocus = function() {
        var e = this;
        var t = this;
        if (this.selectionInEditor()) {
            setTimeout(function() {
                return e.pollSelection();
            }, 20);
        } else {
            rX(this.cm, function() {
                return (t.cm.curOp.selectionChanged = true);
            });
        }
        function i() {
            if (t.cm.state.focused) {
                t.pollSelection();
                t.polling.set(t.cm.options.pollInterval, i);
            }
        }
        this.polling.set(this.cm.options.pollInterval, i);
    };
    l7.prototype.selectionChanged = function() {
        var e = this.getSelection();
        return (e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset);
    };
    l7.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return;
        }
        var e = this.getSelection(), t = this.cm;
        if (g && u && this.cm.display.gutterSpecs.length && l4(e.anchorNode)) {
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
        var i = l2(t, e.anchorNode, e.anchorOffset);
        var r = l2(t, e.focusNode, e.focusOffset);
        if (i && r) {
            rX(t, function() {
                nX(t.doc, nw(i, r), G);
                if (i.bad || r.bad) {
                    t.curOp.selectionChanged = true;
                }
            });
        }
    };
    l7.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
        }
        var e = this.cm, t = e.display, i = e.doc.sel.primary();
        var r = i.from(), n = i.to();
        if (r.ch == 0 && r.line > e.firstLine()) {
            r = e9(r.line - 1, e2(e.doc, r.line - 1).length);
        }
        if (n.ch == e2(e.doc, n.line).text.length && n.line < e.lastLine()) {
            n = e9(n.line + 1, 0);
        }
        if (r.line < t.viewFrom || n.line > t.viewTo - 1) {
            return false;
        }
        var o, l, s;
        if (r.line == t.viewFrom || (o = rl(e, r.line)) == 0) {
            l = eK(t.view[0].line);
            s = t.view[0].node;
        } else {
            l = eK(t.view[o].line);
            s = t.view[o - 1].node.nextSibling;
        }
        var a = rl(e, n.line);
        var f, u;
        if (a == t.view.length - 1) {
            f = t.viewTo - 1;
            u = t.lineDiv.lastChild;
        } else {
            f = eK(t.view[a + 1].line) - 1;
            u = t.view[a + 1].node.previousSibling;
        }
        if (!s) {
            return false;
        }
        var c = e.doc.splitLines(l5(e, s, u, l, f));
        var h = eG(e.doc, e9(l, 0), e9(f, e2(e.doc, f).text.length));
        while(c.length > 1 && h.length > 1){
            if (j(c) == j(h)) {
                c.pop();
                h.pop();
                f--;
            } else if (c[0] == h[0]) {
                c.shift();
                h.shift();
                l++;
            } else {
                break;
            }
        }
        var d = 0, p = 0;
        var v = c[0], g = h[0], m = Math.min(v.length, g.length);
        while(d < m && v.charCodeAt(d) == g.charCodeAt(d)){
            ++d;
        }
        var $ = j(c), y = j(h);
        var _ = Math.min($.length - (c.length == 1 ? d : 0), y.length - (h.length == 1 ? d : 0));
        while(p < _ && $.charCodeAt($.length - p - 1) == y.charCodeAt(y.length - p - 1)){
            ++p;
        }
        if (c.length == 1 && h.length == 1 && l == r.line) {
            while(d && d > r.ch && $.charCodeAt($.length - p - 1) == y.charCodeAt(y.length - p - 1)){
                d--;
                p++;
            }
        }
        c[c.length - 1] = $.slice(0, $.length - p).replace(/^\u200b+/, "");
        c[0] = c[0].slice(d).replace(/\u200b+$/, "");
        var w = e9(l, d);
        var b = e9(f, h.length ? j(h).length - p : 0);
        if (c.length > 1 || c[0] || eq(w, b)) {
            os(e.doc, c, w, b, "+input");
            return true;
        }
    };
    l7.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    };
    l7.prototype.reset = function() {
        this.forceCompositionEnd();
    };
    l7.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
            return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
    };
    l7.prototype.readFromDOMSoon = function() {
        var e = this;
        if (this.readDOMTimeout != null) {
            return;
        }
        this.readDOMTimeout = setTimeout(function() {
            e.readDOMTimeout = null;
            if (e.composing) {
                if (e.composing.done) {
                    e.composing = null;
                } else {
                    return;
                }
            }
            e.updateFromDOM();
        }, 80);
    };
    l7.prototype.updateFromDOM = function() {
        var e = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
            rX(this.cm, function() {
                return rs(e.cm);
            });
        }
    };
    l7.prototype.setUneditable = function(e) {
        e.contentEditable = "false";
    };
    l7.prototype.onKeyPress = function(e) {
        if (e.charCode == 0 || this.composing) {
            return;
        }
        e.preventDefault();
        if (!this.cm.isReadOnly()) {
            rY(this.cm, lF)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
        }
    };
    l7.prototype.readOnlyChanged = function(e) {
        this.div.contentEditable = String(e != "nocursor");
    };
    l7.prototype.onContextMenu = function() {};
    l7.prototype.resetPosition = function() {};
    l7.prototype.needsContentAttribute = true;
    function lB(e, t) {
        var i = iH(e, t.line);
        if (!i || i.hidden) {
            return null;
        }
        var r = e2(e.doc, t.line);
        var n = iN(i, r, t.line);
        var o = eh(r, e.doc.direction), l = "left";
        if (o) {
            var s = eu(o, t.ch);
            l = s % 2 ? "right" : "left";
        }
        var a = iP(n.map, t.ch, l);
        a.offset = a.collapse == "right" ? a.end : a.start;
        return a;
    }
    function l4(e) {
        for(var t = e; t; t = t.parentNode){
            if (/CodeMirror-gutter-wrapper/.test(t.className)) {
                return true;
            }
        }
        return false;
    }
    function l6(e, t) {
        if (t) {
            e.bad = true;
        }
        return e;
    }
    function l5(e, t, i, r, n) {
        var o = "", l = false, s = e.doc.lineSeparator(), a = false;
        function f(e) {
            return function(t) {
                return t.id == e;
            };
        }
        function u() {
            if (l) {
                o += s;
                if (a) {
                    o += s;
                }
                l = a = false;
            }
        }
        function c(e) {
            if (e) {
                u();
                o += e;
            }
        }
        function h(t) {
            if (t.nodeType == 1) {
                var i = t.getAttribute("cm-text");
                if (i) {
                    c(i);
                    return;
                }
                var o = t.getAttribute("cm-marker"), d;
                if (o) {
                    var p = e.findMarks(e9(r, 0), e9(n + 1, 0), f(+o));
                    if (p.length && (d = p[0].find(0))) {
                        c(eG(e.doc, d.from, d.to).join(s));
                    }
                    return;
                }
                if (t.getAttribute("contenteditable") == "false") {
                    return;
                }
                var v = /^(pre|div|p|li|table|br)$/i.test(t.nodeName);
                if (!/^br$/i.test(t.nodeName) && t.textContent.length == 0) {
                    return;
                }
                if (v) {
                    u();
                }
                for(var g = 0; g < t.childNodes.length; g++){
                    h(t.childNodes[g]);
                }
                if (/^(pre|p)$/i.test(t.nodeName)) {
                    a = true;
                }
                if (v) {
                    l = true;
                }
            } else if (t.nodeType == 3) {
                c(t.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
            }
        }
        for(;;){
            h(t);
            if (t == i) {
                break;
            }
            t = t.nextSibling;
            a = false;
        }
        return o;
    }
    function l2(e, t, i) {
        var r;
        if (t == e.display.lineDiv) {
            r = e.display.lineDiv.childNodes[i];
            if (!r) {
                return l6(e.clipPos(e9(e.display.viewTo - 1)), true);
            }
            t = null;
            i = 0;
        } else {
            for(r = t;; r = r.parentNode){
                if (!r || r == e.display.lineDiv) {
                    return null;
                }
                if (r.parentNode && r.parentNode == e.display.lineDiv) {
                    break;
                }
            }
        }
        for(var n = 0; n < e.display.view.length; n++){
            var o = e.display.view[n];
            if (o.node == r) {
                return lG(o, t, i);
            }
        }
    }
    function lG(e, t, i) {
        var r = e.text.firstChild, n = false;
        if (!t || !N(r, t)) {
            return l6(e9(eK(e.line), 0), true);
        }
        if (t == r) {
            n = true;
            t = r.childNodes[i];
            i = 0;
            if (!t) {
                var o = e.rest ? j(e.rest) : e.line;
                return l6(e9(eK(o), o.text.length), n);
            }
        }
        var l = t.nodeType == 3 ? t : null, s = t;
        if (!l && t.childNodes.length == 1 && t.firstChild.nodeType == 3) {
            l = t.firstChild;
            if (i) {
                i = l.nodeValue.length;
            }
        }
        while(s.parentNode != r){
            s = s.parentNode;
        }
        var a = e.measure, f = a.maps;
        function u(t, i, r) {
            for(var n = -1; n < (f ? f.length : 0); n++){
                var o = n < 0 ? a.map : f[n];
                for(var l = 0; l < o.length; l += 3){
                    var s = o[l + 2];
                    if (s == t || s == i) {
                        var u = eK(n < 0 ? e.line : e.rest[n]);
                        var c = o[l] + r;
                        if (r < 0 || s != t) {
                            c = o[l + (r ? 1 : 0)];
                        }
                        return e9(u, c);
                    }
                }
            }
        }
        var c = u(l, s, i);
        if (c) {
            return l6(c, n);
        }
        for(var h = s.nextSibling, d = l ? l.nodeValue.length - i : 0; h; h = h.nextSibling){
            c = u(h, h.firstChild, 0);
            if (c) {
                return l6(e9(c.line, c.ch - d), n);
            } else {
                d += h.textContent.length;
            }
        }
        for(var p = s.previousSibling, v = i; p; p = p.previousSibling){
            c = u(p, p.firstChild, -1);
            if (c) {
                return l6(e9(c.line, c.ch + v), n);
            } else {
                v += p.textContent.length;
            }
        }
    }
    var lU = function(e) {
        this.cm = e;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new E();
        this.hasSelection = false;
        this.composing = null;
    };
    lU.prototype.init = function(e) {
        var t = this;
        var i = this, r = this.cm;
        this.createField(e);
        var n = this.textarea;
        e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild);
        if (v) {
            n.style.width = "0px";
        }
        ep(n, "input", function() {
            if (l && s >= 9 && t.hasSelection) {
                t.hasSelection = null;
            }
            i.poll();
        });
        ep(n, "paste", function(e) {
            if (e$(r, e) || lM(e, r)) {
                return;
            }
            r.state.pasteIncoming = +new Date();
            i.fastPoll();
        });
        function o(e) {
            if (e$(r, e)) {
                return;
            }
            if (r.somethingSelected()) {
                lH({
                    lineWise: false,
                    text: r.getSelections()
                });
            } else if (!r.options.lineWiseCopyCut) {
                return;
            } else {
                var t = lP(r);
                lH({
                    lineWise: true,
                    text: t.text
                });
                if (e.type == "cut") {
                    r.setSelections(t.ranges, null, G);
                } else {
                    i.prevInput = "";
                    n.value = t.text.join("\n");
                    F(n);
                }
            }
            if (e.type == "cut") {
                r.state.cutIncoming = +new Date();
            }
        }
        ep(n, "cut", o);
        ep(n, "copy", o);
        ep(e.scroller, "paste", function(t) {
            if (iC(e, t) || e$(r, t)) {
                return;
            }
            if (!n.dispatchEvent) {
                r.state.pasteIncoming = +new Date();
                i.focus();
                return;
            }
            var o = new Event("paste");
            o.clipboardData = t.clipboardData;
            n.dispatchEvent(o);
        });
        ep(e.lineSpace, "selectstart", function(t) {
            if (!iC(e, t)) {
                eb(t);
            }
        });
        ep(n, "compositionstart", function() {
            var e = r.getCursor("from");
            if (i.composing) {
                i.composing.range.clear();
            }
            i.composing = {
                start: e,
                range: r.markText(e, r.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        });
        ep(n, "compositionend", function() {
            if (i.composing) {
                i.poll();
                i.composing.range.clear();
                i.composing = null;
            }
        });
    };
    lU.prototype.createField = function(e) {
        this.wrapper = lE();
        this.textarea = this.wrapper.firstChild;
    };
    lU.prototype.screenReaderLabelChanged = function(e) {
        if (e) {
            this.textarea.setAttribute("aria-label", e);
        } else {
            this.textarea.removeAttribute("aria-label");
        }
    };
    lU.prototype.prepareSelection = function() {
        var e = this.cm, t = e.display, i = e.doc;
        var r = rp(e);
        if (e.options.moveInputWithCursor) {
            var n = iU(e, i.sel.primary().head, "div");
            var o = t.wrapper.getBoundingClientRect(), l = t.lineDiv.getBoundingClientRect();
            r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, n.top + l.top - o.top));
            r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, n.left + l.left - o.left));
        }
        return r;
    };
    lU.prototype.showSelection = function(e) {
        var t = this.cm, i = t.display;
        T(i.cursorDiv, e.cursors);
        T(i.selectionDiv, e.selection);
        if (e.teTop != null) {
            this.wrapper.style.top = e.teTop + "px";
            this.wrapper.style.left = e.teLeft + "px";
        }
    };
    lU.prototype.reset = function(e) {
        if (this.contextMenuPending || this.composing) {
            return;
        }
        var t = this.cm;
        if (t.somethingSelected()) {
            this.prevInput = "";
            var i = t.getSelection();
            this.textarea.value = i;
            if (t.state.focused) {
                F(this.textarea);
            }
            if (l && s >= 9) {
                this.hasSelection = i;
            }
        } else if (!e) {
            this.prevInput = this.textarea.value = "";
            if (l && s >= 9) {
                this.hasSelection = null;
            }
        }
    };
    lU.prototype.getField = function() {
        return this.textarea;
    };
    lU.prototype.supportsTouch = function() {
        return false;
    };
    lU.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!m || A() != this.textarea)) {
            try {
                this.textarea.focus();
            } catch (e) {}
        }
    };
    lU.prototype.blur = function() {
        this.textarea.blur();
    };
    lU.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
    };
    lU.prototype.receivedFocus = function() {
        this.slowPoll();
    };
    lU.prototype.slowPoll = function() {
        var e = this;
        if (this.pollingFast) {
            return;
        }
        this.polling.set(this.cm.options.pollInterval, function() {
            e.poll();
            if (e.cm.state.focused) {
                e.slowPoll();
            }
        });
    };
    lU.prototype.fastPoll = function() {
        var e = false, t = this;
        t.pollingFast = true;
        function i() {
            var r = t.poll();
            if (!r && !e) {
                e = true;
                t.polling.set(60, i);
            } else {
                t.pollingFast = false;
                t.slowPoll();
            }
        }
        t.polling.set(20, i);
    };
    lU.prototype.poll = function() {
        var e = this;
        var t = this.cm, i = this.textarea, r = this.prevInput;
        if (this.contextMenuPending || !t.state.focused || (eD(i) && !r && !this.composing) || t.isReadOnly() || t.options.disableInput || t.state.keySeq) {
            return false;
        }
        var n = i.value;
        if (n == r && !t.somethingSelected()) {
            return false;
        }
        if ((l && s >= 9 && this.hasSelection === n) || ($ && /[\uf700-\uf7ff]/.test(n))) {
            t.display.input.reset();
            return false;
        }
        if (t.doc.sel == t.display.selForContextMenu) {
            var o = n.charCodeAt(0);
            if (o == 0x200b && !r) {
                r = "\u200b";
            }
            if (o == 0x21da) {
                this.reset();
                return this.cm.execCommand("undo");
            }
        }
        var a = 0, f = Math.min(r.length, n.length);
        while(a < f && r.charCodeAt(a) == n.charCodeAt(a)){
            ++a;
        }
        rX(t, function() {
            lF(t, n.slice(a), r.length - a, null, e.composing ? "*compose" : null);
            if (n.length > 1000 || n.indexOf("\n") > -1) {
                i.value = e.prevInput = "";
            } else {
                e.prevInput = n;
            }
            if (e.composing) {
                e.composing.range.clear();
                e.composing.range = t.markText(e.composing.start, t.getCursor("to"), {
                    className: "CodeMirror-composing"
                });
            }
        });
        return true;
    };
    lU.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) {
            this.pollingFast = false;
        }
    };
    lU.prototype.onKeyPress = function() {
        if (l && s >= 9) {
            this.hasSelection = null;
        }
        this.fastPoll();
    };
    lU.prototype.onContextMenu = function(e) {
        var t = this, i = t.cm, r = i.display, n = t.textarea;
        if (t.contextMenuPending) {
            t.contextMenuPending();
        }
        var o = ro(i, e), f = r.scroller.scrollTop;
        if (!o || c) {
            return;
        }
        var u = i.options.resetSelectionOnContextMenu;
        if (u && i.doc.sel.contains(o) == -1) {
            rY(i, nX)(i.doc, nw(o), G);
        }
        var h = n.style.cssText, d = t.wrapper.style.cssText;
        var p = t.wrapper.offsetParent.getBoundingClientRect();
        t.wrapper.style.cssText = "position: static";
        n.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - p.top - 5) + "px; left: " + (e.clientX - p.left - 5) + "px;\n      z-index: 1000; background: " + (l ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var v;
        if (a) {
            v = window.scrollY;
        }
        r.input.focus();
        if (a) {
            window.scrollTo(null, v);
        }
        r.input.reset();
        if (!i.somethingSelected()) {
            n.value = t.prevInput = " ";
        }
        t.contextMenuPending = m;
        r.selForContextMenu = i.doc.sel;
        clearTimeout(r.detectingSelectAll);
        function g() {
            if (n.selectionStart != null) {
                var e = i.somethingSelected();
                var o = "\u200b" + (e ? n.value : "");
                n.value = "\u21da";
                n.value = o;
                t.prevInput = e ? "" : "\u200b";
                n.selectionStart = 1;
                n.selectionEnd = o.length;
                r.selForContextMenu = i.doc.sel;
            }
        }
        function m() {
            if (t.contextMenuPending != m) {
                return;
            }
            t.contextMenuPending = false;
            t.wrapper.style.cssText = d;
            n.style.cssText = h;
            if (l && s < 9) {
                r.scrollbars.setScrollTop((r.scroller.scrollTop = f));
            }
            if (n.selectionStart != null) {
                if (!l || (l && s < 9)) {
                    g();
                }
                var e = 0, o = function() {
                    if (r.selForContextMenu == i.doc.sel && n.selectionStart == 0 && n.selectionEnd > 0 && t.prevInput == "\u200b") {
                        rY(i, nQ)(i);
                    } else if (e++ < 10) {
                        r.detectingSelectAll = setTimeout(o, 500);
                    } else {
                        r.selForContextMenu = null;
                        r.input.reset();
                    }
                };
                r.detectingSelectAll = setTimeout(o, 200);
            }
        }
        if (l && s >= 9) {
            g();
        }
        if (x) {
            eS(e);
            var $ = function() {
                eg(window, "mouseup", $);
                setTimeout(m, 20);
            };
            ep(window, "mouseup", $);
        } else {
            setTimeout(m, 50);
        }
    };
    lU.prototype.readOnlyChanged = function(e) {
        if (!e) {
            this.reset();
        }
        this.textarea.disabled = e == "nocursor";
        this.textarea.readOnly = !!e;
    };
    lU.prototype.setUneditable = function() {};
    lU.prototype.needsContentAttribute = false;
    function lV(e, t) {
        t = t ? P(t) : {};
        t.value = e.value;
        if (!t.tabindex && e.tabIndex) {
            t.tabindex = e.tabIndex;
        }
        if (!t.placeholder && e.placeholder) {
            t.placeholder = e.placeholder;
        }
        if (t.autofocus == null) {
            var i = A();
            t.autofocus = i == e || (e.getAttribute("autofocus") != null && i == document.body);
        }
        function r() {
            e.value = a.getValue();
        }
        var n;
        if (e.form) {
            ep(e.form, "submit", r);
            if (!t.leaveSubmitMethodAlone) {
                var o = e.form;
                n = o.submit;
                try {
                    var l = (o.submit = function() {
                        r();
                        o.submit = n;
                        o.submit();
                        o.submit = l;
                    });
                } catch (s) {}
            }
        }
        t.finishInit = function(i) {
            i.save = r;
            i.getTextArea = function() {
                return e;
            };
            i.toTextArea = function() {
                i.toTextArea = isNaN;
                r();
                e.parentNode.removeChild(i.getWrapperElement());
                e.style.display = "";
                if (e.form) {
                    eg(e.form, "submit", r);
                    if (!t.leaveSubmitMethodAlone && typeof e.form.submit == "function") {
                        e.form.submit = n;
                    }
                }
            };
        };
        e.style.display = "none";
        var a = l0(function(t) {
            return e.parentNode.insertBefore(t, e.nextSibling);
        }, t);
        return a;
    }
    function lK(e) {
        e.off = eg;
        e.on = ep;
        e.wheelEventPixels = ng;
        e.Doc = ok;
        e.splitLines = eA;
        e.countColumn = z;
        e.findColumn = K;
        e.isWordChar = et;
        e.Pass = B;
        e.signal = em;
        e.Line = tG;
        e.changeEnd = nb;
        e.scrollbarModel = r3;
        e.Pos = e9;
        e.cmpPos = eq;
        e.modes = e1;
        e.mimeModes = eP;
        e.resolveMode = eI;
        e.getMode = eR;
        e.modeExtensions = e3;
        e.extendMode = e7;
        e.copyState = eB;
        e.startState = e6;
        e.innerMode = e4;
        e.commands = oK;
        e.keyMap = oE;
        e.keyName = o4;
        e.isModifierKey = o7;
        e.lookupKey = o3;
        e.normalizeKeyMap = oR;
        e.StringStream = e5;
        e.SharedTextMarker = o_;
        e.TextMarker = o$;
        e.LineWidget = op;
        e.e_preventDefault = eb;
        e.e_stopPropagation = ex;
        e.e_stop = eS;
        e.addClass = D;
        e.contains = N;
        e.rmClass = S;
        e.keyNames = oM;
    }
    lT(l0);
    lI(l0);
    var lX = "iter insert remove copy getEditor constructor".split(" ");
    for(var lY in ok.prototype){
        if (ok.prototype.hasOwnProperty(lY) && I(lX, lY) < 0) {
            l0.prototype[lY] = (function(e) {
                return function() {
                    return e.apply(this.doc, arguments);
                };
            })(ok.prototype[lY]);
        }
    }
    ew(ok);
    l0.inputStyles = {
        textarea: lU,
        contenteditable: l7
    };
    l0.defineMode = function(e) {
        if (!l0.defaults.mode && e != "null") {
            l0.defaults.mode = e;
        }
        ez.apply(this, arguments);
    };
    l0.defineMIME = eE;
    l0.defineMode("null", function() {
        return {
            token: function(e) {
                return e.skipToEnd();
            }
        };
    });
    l0.defineMIME("text/plain", "null");
    l0.defineExtension = function(e, t) {
        l0.prototype[e] = t;
    };
    l0.defineDocExtension = function(e, t) {
        ok.prototype[e] = t;
    };
    l0.fromTextArea = lV;
    lK(l0);
    l0.version = "5.65.1";
    return l0;
});
