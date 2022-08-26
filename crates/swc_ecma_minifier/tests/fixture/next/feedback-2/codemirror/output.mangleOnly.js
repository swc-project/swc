(function(e, t) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = t()) : typeof define === "function" && define.amd ? define(t) : ((e = e || self), (e.CodeMirror = t()));
})(this, function() {
    "use strict";
    var e = navigator.userAgent;
    var t = navigator.platform;
    var r = /gecko\/\d/i.test(e);
    var i = /MSIE \d/.test(e);
    var n = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(e);
    var o = /Edge\/(\d+)/.exec(e);
    var l = i || n || o;
    var a = l && (i ? document.documentMode || 6 : +(o || n)[1]);
    var s = !o && /WebKit\//.test(e);
    var u = s && /Qt\/\d+\.\d+/.test(e);
    var f = !o && /Chrome\//.test(e);
    var c = /Opera\//.test(e);
    var h = /Apple Computer/.test(navigator.vendor);
    var d = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(e);
    var p = /PhantomJS/.test(e);
    var v = h && (/Mobile\/\w+/.test(e) || navigator.maxTouchPoints > 2);
    var g = /Android/.test(e);
    var m = v || g || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(e);
    var $ = v || /Mac/.test(t);
    var y = /\bCrOS\b/.test(e);
    var b = /win/i.test(t);
    var x = c && e.match(/Version\/(\d*\.\d*)/);
    if (x) {
        x = Number(x[1]);
    }
    if (x && x >= 15) {
        c = false;
        s = true;
    }
    var w = $ && (u || (c && (x == null || x < 12.11)));
    var _ = r || (l && a >= 9);
    function C(e) {
        return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*");
    }
    var S = function(e, t) {
        var r = e.className;
        var i = C(t).exec(r);
        if (i) {
            var n = r.slice(i.index + i[0].length);
            e.className = r.slice(0, i.index) + (n ? i[1] + n : "");
        }
    };
    function L(e) {
        for(var t = e.childNodes.length; t > 0; --t){
            e.removeChild(e.firstChild);
        }
        return e;
    }
    function k(e, t) {
        return L(e).appendChild(t);
    }
    function T(e, t, r, i) {
        var n = document.createElement(e);
        if (r) {
            n.className = r;
        }
        if (i) {
            n.style.cssText = i;
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
    function N(e, t, r, i) {
        var n = T(e, t, r, i);
        n.setAttribute("role", "presentation");
        return n;
    }
    var O;
    if (document.createRange) {
        O = function(e, t, r, i) {
            var n = document.createRange();
            n.setEnd(i || e, r);
            n.setStart(e, t);
            return n;
        };
    } else {
        O = function(e, t, r) {
            var i = document.body.createTextRange();
            try {
                i.moveToElementText(e.parentNode);
            } catch (n) {
                return i;
            }
            i.collapse(true);
            i.moveEnd("character", r);
            i.moveStart("character", t);
            return i;
        };
    }
    function M(e, t) {
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
    function W(e, t) {
        var r = e.className;
        if (!C(t).test(r)) {
            e.className += (r ? " " : "") + t;
        }
    }
    function D(e, t) {
        var r = e.split(" ");
        for(var i = 0; i < r.length; i++){
            if (r[i] && !C(r[i]).test(t)) {
                t += " " + r[i];
            }
        }
        return t;
    }
    var H = function(e) {
        e.select();
    };
    if (v) {
        H = function(e) {
            e.selectionStart = 0;
            e.selectionEnd = e.value.length;
        };
    } else if (l) {
        H = function(e) {
            try {
                e.select();
            } catch (t) {}
        };
    }
    function F(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return function() {
            return e.apply(null, t);
        };
    }
    function P(e, t, r) {
        if (!t) {
            t = {};
        }
        for(var i in e){
            if (e.hasOwnProperty(i) && (r !== false || !t.hasOwnProperty(i))) {
                t[i] = e[i];
            }
        }
        return t;
    }
    function E(e, t, r, i, n) {
        if (t == null) {
            t = e.search(/[^\s\u00a0]/);
            if (t == -1) {
                t = e.length;
            }
        }
        for(var o = i || 0, l = n || 0;;){
            var a = e.indexOf("\t", o);
            if (a < 0 || a >= t) {
                return l + (t - o);
            }
            l += a - o;
            l += r - (l % r);
            o = a + 1;
        }
    }
    var z = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = F(this.onTimeout, this);
    };
    z.prototype.onTimeout = function(e) {
        e.id = 0;
        if (e.time <= +new Date()) {
            e.f();
        } else {
            setTimeout(e.handler, e.time - +new Date());
        }
    };
    z.prototype.set = function(e, t) {
        this.f = t;
        var r = +new Date() + e;
        if (!this.id || r < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, e);
            this.time = r;
        }
    };
    function R(e, t) {
        for(var r = 0; r < e.length; ++r){
            if (e[r] == t) {
                return r;
            }
        }
        return -1;
    }
    var I = 50;
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
    function K(e, t, r) {
        for(var i = 0, n = 0;;){
            var o = e.indexOf("\t", i);
            if (o == -1) {
                o = e.length;
            }
            var l = o - i;
            if (o == e.length || n + l >= t) {
                return i + Math.min(l, t - n);
            }
            n += o - i;
            n += r - (n % r);
            i = o + 1;
            if (n >= t) {
                return i;
            }
        }
    }
    var X = [
        ""
    ];
    function j(e) {
        while(X.length <= e){
            X.push(Y(X) + " ");
        }
        return X[e];
    }
    function Y(e) {
        return e[e.length - 1];
    }
    function q(e, t) {
        var r = [];
        for(var i = 0; i < e.length; i++){
            r[i] = t(e[i], i);
        }
        return r;
    }
    function Z(e, t, r) {
        var i = 0, n = r(t);
        while(i < e.length && r(e[i]) <= n){
            i++;
        }
        e.splice(i, 0, t);
    }
    function Q() {}
    function J(e, t) {
        var r;
        if (Object.create) {
            r = Object.create(e);
        } else {
            Q.prototype = e;
            r = new Q();
        }
        if (t) {
            P(t, r);
        }
        return r;
    }
    var ee = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function et(e) {
        return (/\w/.test(e) || (e > "\x80" && (e.toUpperCase() != e.toLowerCase() || ee.test(e))));
    }
    function er(e, t) {
        if (!t) {
            return et(e);
        }
        if (t.source.indexOf("\\w") > -1 && et(e)) {
            return true;
        }
        return t.test(e);
    }
    function ei(e) {
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
    function el(e, t, r) {
        while((r < 0 ? t > 0 : t < e.length) && eo(e.charAt(t))){
            t += r;
        }
        return t;
    }
    function ea(e, t, r) {
        var i = t > r ? -1 : 1;
        for(;;){
            if (t == r) {
                return t;
            }
            var n = (t + r) / 2, o = i < 0 ? Math.ceil(n) : Math.floor(n);
            if (o == t) {
                return e(o) ? t : r;
            }
            if (e(o)) {
                r = o;
            } else {
                t = o + i;
            }
        }
    }
    function es(e, t, r, i) {
        if (!e) {
            return i(t, r, "ltr", 0);
        }
        var n = false;
        for(var o = 0; o < e.length; ++o){
            var l = e[o];
            if ((l.from < r && l.to > t) || (t == r && l.to == t)) {
                i(Math.max(l.from, t), Math.min(l.to, r), l.level == 1 ? "rtl" : "ltr", o);
                n = true;
            }
        }
        if (!n) {
            i(t, r, "ltr");
        }
    }
    var eu = null;
    function ef(e, t, r) {
        var i;
        eu = null;
        for(var n = 0; n < e.length; ++n){
            var o = e[n];
            if (o.from < t && o.to > t) {
                return n;
            }
            if (o.to == t) {
                if (o.from != o.to && r == "before") {
                    i = n;
                } else {
                    eu = n;
                }
            }
            if (o.from == t) {
                if (o.from != o.to && r != "before") {
                    i = n;
                } else {
                    eu = n;
                }
            }
        }
        return i != null ? i : eu;
    }
    var ec = (function() {
        var e = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var t = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function r(r) {
            if (r <= 0xf7) {
                return e.charAt(r);
            } else if (0x590 <= r && r <= 0x5f4) {
                return "R";
            } else if (0x600 <= r && r <= 0x6f9) {
                return t.charAt(r - 0x600);
            } else if (0x6ee <= r && r <= 0x8ac) {
                return "r";
            } else if (0x2000 <= r && r <= 0x200b) {
                return "w";
            } else if (r == 0x200c) {
                return "b";
            } else {
                return "L";
            }
        }
        var i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var n = /[stwN]/, o = /[LRr]/, l = /[Lb1n]/, a = /[1n]/;
        function s(e, t, r) {
            this.level = e;
            this.from = t;
            this.to = r;
        }
        return function(e, t) {
            var u = t == "ltr" ? "L" : "R";
            if (e.length == 0 || (t == "ltr" && !i.test(e))) {
                return false;
            }
            var f = e.length, c = [];
            for(var h = 0; h < f; ++h){
                c.push(r(e.charCodeAt(h)));
            }
            for(var d = 0, p = u; d < f; ++d){
                var v = c[d];
                if (v == "m") {
                    c[d] = p;
                } else {
                    p = v;
                }
            }
            for(var g = 0, m = u; g < f; ++g){
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
            for(var y = 1, b = c[0]; y < f - 1; ++y){
                var x = c[y];
                if (x == "+" && b == "1" && c[y + 1] == "1") {
                    c[y] = "1";
                } else if (x == "," && b == c[y + 1] && (b == "1" || b == "n")) {
                    c[y] = b;
                }
                b = x;
            }
            for(var w = 0; w < f; ++w){
                var _ = c[w];
                if (_ == ",") {
                    c[w] = "N";
                } else if (_ == "%") {
                    var C = void 0;
                    for(C = w + 1; C < f && c[C] == "%"; ++C){}
                    var S = (w && c[w - 1] == "!") || (C < f && c[C] == "1") ? "1" : "N";
                    for(var L = w; L < C; ++L){
                        c[L] = S;
                    }
                    w = C - 1;
                }
            }
            for(var k = 0, T = u; k < f; ++k){
                var N = c[k];
                if (T == "L" && N == "1") {
                    c[k] = "L";
                } else if (o.test(N)) {
                    T = N;
                }
            }
            for(var O = 0; O < f; ++O){
                if (n.test(c[O])) {
                    var M = void 0;
                    for(M = O + 1; M < f && n.test(c[M]); ++M){}
                    var A = (O ? c[O - 1] : u) == "L";
                    var W = (M < f ? c[M] : u) == "L";
                    var D = A == W ? (A ? "L" : "R") : u;
                    for(var H = O; H < M; ++H){
                        c[H] = D;
                    }
                    O = M - 1;
                }
            }
            var F = [], P;
            for(var E = 0; E < f;){
                if (l.test(c[E])) {
                    var z = E;
                    for(++E; E < f && l.test(c[E]); ++E){}
                    F.push(new s(0, z, E));
                } else {
                    var R = E, I = F.length, B = t == "rtl" ? 1 : 0;
                    for(++E; E < f && c[E] != "L"; ++E){}
                    for(var G = R; G < E;){
                        if (a.test(c[G])) {
                            if (R < G) {
                                F.splice(I, 0, new s(1, R, G));
                                I += B;
                            }
                            var U = G;
                            for(++G; G < E && a.test(c[G]); ++G){}
                            F.splice(I, 0, new s(2, U, G));
                            I += B;
                            R = G;
                        } else {
                            ++G;
                        }
                    }
                    if (R < E) {
                        F.splice(I, 0, new s(1, R, E));
                    }
                }
            }
            if (t == "ltr") {
                if (F[0].level == 1 && (P = e.match(/^\s+/))) {
                    F[0].from = P[0].length;
                    F.unshift(new s(0, 0, P[0].length));
                }
                if (Y(F).level == 1 && (P = e.match(/\s+$/))) {
                    Y(F).to -= P[0].length;
                    F.push(new s(0, f - P[0].length, f));
                }
            }
            return t == "rtl" ? F.reverse() : F;
        };
    })();
    function eh(e, t) {
        var r = e.order;
        if (r == null) {
            r = e.order = ec(e.text, t);
        }
        return r;
    }
    var ed = [];
    var ep = function(e, t, r) {
        if (e.addEventListener) {
            e.addEventListener(t, r, false);
        } else if (e.attachEvent) {
            e.attachEvent("on" + t, r);
        } else {
            var i = e._handlers || (e._handlers = {});
            i[t] = (i[t] || ed).concat(r);
        }
    };
    function ev(e, t) {
        return (e._handlers && e._handlers[t]) || ed;
    }
    function eg(e, t, r) {
        if (e.removeEventListener) {
            e.removeEventListener(t, r, false);
        } else if (e.detachEvent) {
            e.detachEvent("on" + t, r);
        } else {
            var i = e._handlers, n = i && i[t];
            if (n) {
                var o = R(n, r);
                if (o > -1) {
                    i[t] = n.slice(0, o).concat(n.slice(o + 1));
                }
            }
        }
    }
    function em(e, t) {
        var r = ev(e, t);
        if (!r.length) {
            return;
        }
        var i = Array.prototype.slice.call(arguments, 2);
        for(var n = 0; n < r.length; ++n){
            r[n].apply(null, i);
        }
    }
    function e$(e, t, r) {
        if (typeof t == "string") {
            t = {
                type: t,
                preventDefault: function() {
                    this.defaultPrevented = true;
                }
            };
        }
        em(e, r || t.type, e, t);
        return eC(t) || t.codemirrorIgnore;
    }
    function ey(e) {
        var t = e._handlers && e._handlers.cursorActivity;
        if (!t) {
            return;
        }
        var r = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []);
        for(var i = 0; i < t.length; ++i){
            if (R(r, t[i]) == -1) {
                r.push(t[i]);
            }
        }
    }
    function eb(e, t) {
        return ev(e, t).length > 0;
    }
    function ex(e) {
        e.prototype.on = function(e, t) {
            ep(this, e, t);
        };
        e.prototype.off = function(e, t) {
            eg(this, e, t);
        };
    }
    function ew(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    function e_(e) {
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
        ew(e);
        e_(e);
    }
    function eL(e) {
        return e.target || e.srcElement;
    }
    function ek(e) {
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
    var eT = (function() {
        if (l && a < 9) {
            return false;
        }
        var e = T("div");
        return "draggable" in e || "dragDrop" in e;
    })();
    var eN;
    function eO(e) {
        if (eN == null) {
            var t = T("span", "\u200b");
            k(e, T("span", [
                t,
                document.createTextNode("x")
            ]));
            if (e.firstChild.offsetHeight != 0) {
                eN = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(l && a < 8);
            }
        }
        var r = eN ? T("span", "\u200b") : T("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        r.setAttribute("cm-text", "");
        return r;
    }
    var eM;
    function eA(e) {
        if (eM != null) {
            return eM;
        }
        var t = k(e, document.createTextNode("A\u062eA"));
        var r = O(t, 0, 1).getBoundingClientRect();
        var i = O(t, 1, 2).getBoundingClientRect();
        L(e);
        if (!r || r.left == r.right) {
            return false;
        }
        return (eM = i.right - r.right < 3);
    }
    var e0 = "\n\nb".split(/\n/).length != 3 ? function(e) {
        var t = 0, r = [], i = e.length;
        while(t <= i){
            var n = e.indexOf("\n", t);
            if (n == -1) {
                n = e.length;
            }
            var o = e.slice(t, e.charAt(n - 1) == "\r" ? n - 1 : n);
            var l = o.indexOf("\r");
            if (l != -1) {
                r.push(o.slice(0, l));
                t += l + 1;
            } else {
                r.push(o);
                t = n + 1;
            }
        }
        return r;
    } : function(e) {
        return e.split(/\r\n?|\n/);
    };
    var eW = window.getSelection ? function(e) {
        try {
            return e.selectionStart != e.selectionEnd;
        } catch (t) {
            return false;
        }
    } : function(e) {
        var t;
        try {
            t = e.ownerDocument.selection.createRange();
        } catch (r) {}
        if (!t || t.parentElement() != e) {
            return false;
        }
        return t.compareEndPoints("StartToEnd", t) != 0;
    };
    var eD = (function() {
        var e = T("div");
        if ("oncopy" in e) {
            return true;
        }
        e.setAttribute("oncopy", "return;");
        return typeof e.oncopy == "function";
    })();
    var eH = null;
    function eF(e) {
        if (eH != null) {
            return eH;
        }
        var t = k(e, T("span", "x"));
        var r = t.getBoundingClientRect();
        var i = O(t, 0, 1).getBoundingClientRect();
        return (eH = Math.abs(r.left - i.left) > 1);
    }
    var eP = {}, e1 = {};
    function eE(e, t) {
        if (arguments.length > 2) {
            t.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        eP[e] = t;
    }
    function ez(e, t) {
        e1[e] = t;
    }
    function eR(e) {
        if (typeof e == "string" && e1.hasOwnProperty(e)) {
            e = e1[e];
        } else if (e && typeof e.name == "string" && e1.hasOwnProperty(e.name)) {
            var t = e1[e.name];
            if (typeof t == "string") {
                t = {
                    name: t
                };
            }
            e = J(t, e);
            e.name = t.name;
        } else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) {
            return eR("application/xml");
        } else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) {
            return eR("application/json");
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
    function eI(e, t) {
        t = eR(t);
        var r = eP[t.name];
        if (!r) {
            return eI(e, "text/plain");
        }
        var i = r(e, t);
        if (e3.hasOwnProperty(t.name)) {
            var n = e3[t.name];
            for(var o in n){
                if (!n.hasOwnProperty(o)) {
                    continue;
                }
                if (i.hasOwnProperty(o)) {
                    i["_" + o] = i[o];
                }
                i[o] = n[o];
            }
        }
        i.name = t.name;
        if (t.helperType) {
            i.helperType = t.helperType;
        }
        if (t.modeProps) {
            for(var l in t.modeProps){
                i[l] = t.modeProps[l];
            }
        }
        return i;
    }
    var e3 = {};
    function eB(e, t) {
        var r = e3.hasOwnProperty(e) ? e3[e] : (e3[e] = {});
        P(t, r);
    }
    function e7(e, t) {
        if (t === true) {
            return t;
        }
        if (e.copyState) {
            return e.copyState(t);
        }
        var r = {};
        for(var i in t){
            var n = t[i];
            if (n instanceof Array) {
                n = n.concat([]);
            }
            r[i] = n;
        }
        return r;
    }
    function e4(e, t) {
        var r;
        while(e.innerMode){
            r = e.innerMode(t);
            if (!r || r.mode == e) {
                break;
            }
            t = r.state;
            e = r.mode;
        }
        return r || {
            mode: e,
            state: t
        };
    }
    function e6(e, t, r) {
        return e.startState ? e.startState(t, r) : true;
    }
    var e5 = function(e, t, r) {
        this.pos = this.start = 0;
        this.string = e;
        this.tabSize = t || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = r;
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
        var r;
        if (typeof e == "string") {
            r = t == e;
        } else {
            r = t && (e.test ? e.test(t) : e(t));
        }
        if (r) {
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
            this.lastColumnValue = E(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return (this.lastColumnValue - (this.lineStart ? E(this.string, this.lineStart, this.tabSize) : 0));
    };
    e5.prototype.indentation = function() {
        return (E(this.string, null, this.tabSize) - (this.lineStart ? E(this.string, this.lineStart, this.tabSize) : 0));
    };
    e5.prototype.match = function(e, t, r) {
        if (typeof e == "string") {
            var i = function(e) {
                return r ? e.toLowerCase() : e;
            };
            var n = this.string.substr(this.pos, e.length);
            if (i(n) == i(e)) {
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
        var r = e;
        while(!r.lines){
            for(var i = 0;; ++i){
                var n = r.children[i], o = n.chunkSize();
                if (t < o) {
                    r = n;
                    break;
                }
                t -= o;
            }
        }
        return r.lines[t];
    }
    function eG(e, t, r) {
        var i = [], n = t.line;
        e.iter(t.line, r.line + 1, function(e) {
            var o = e.text;
            if (n == r.line) {
                o = o.slice(0, r.ch);
            }
            if (n == t.line) {
                o = o.slice(t.ch);
            }
            i.push(o);
            ++n;
        });
        return i;
    }
    function eU(e, t, r) {
        var i = [];
        e.iter(t, r, function(e) {
            i.push(e.text);
        });
        return i;
    }
    function eV(e, t) {
        var r = t - e.height;
        if (r) {
            for(var i = e; i; i = i.parent){
                i.height += r;
            }
        }
    }
    function eK(e) {
        if (e.parent == null) {
            return null;
        }
        var t = e.parent, r = R(t.lines, e);
        for(var i = t.parent; i; t = i, i = i.parent){
            for(var n = 0;; ++n){
                if (i.children[n] == t) {
                    break;
                }
                r += i.children[n].chunkSize();
            }
        }
        return r + t.first;
    }
    function eX(e, t) {
        var r = e.first;
        outer: do {
            for(var i = 0; i < e.children.length; ++i){
                var n = e.children[i], o = n.height;
                if (t < o) {
                    e = n;
                    continue outer;
                }
                t -= o;
                r += n.chunkSize();
            }
            return r;
        }while (!e.lines)
        var l = 0;
        for(; l < e.lines.length; ++l){
            var a = e.lines[l], s = a.height;
            if (t < s) {
                break;
            }
            t -= s;
        }
        return r + l;
    }
    function ej(e, t) {
        return t >= e.first && t < e.first + e.size;
    }
    function eY(e, t) {
        return String(e.lineNumberFormatter(t + e.firstLineNumber));
    }
    function e8(e, t, r) {
        if (r === void 0) r = null;
        if (!(this instanceof e8)) {
            return new e8(e, t, r);
        }
        this.line = e;
        this.ch = t;
        this.sticky = r;
    }
    function e9(e, t) {
        return e.line - t.line || e.ch - t.ch;
    }
    function eq(e, t) {
        return e.sticky == t.sticky && e9(e, t) == 0;
    }
    function eZ(e) {
        return e8(e.line, e.ch);
    }
    function eQ(e, t) {
        return e9(e, t) < 0 ? t : e;
    }
    function eJ(e, t) {
        return e9(e, t) < 0 ? e : t;
    }
    function te(e, t) {
        return Math.max(e.first, Math.min(t, e.first + e.size - 1));
    }
    function tt(e, t) {
        if (t.line < e.first) {
            return e8(e.first, 0);
        }
        var r = e.first + e.size - 1;
        if (t.line > r) {
            return e8(r, e2(e, r).text.length);
        }
        return tr(t, e2(e, t.line).text.length);
    }
    function tr(e, t) {
        var r = e.ch;
        if (r == null || r > t) {
            return e8(e.line, t);
        } else if (r < 0) {
            return e8(e.line, 0);
        } else {
            return e;
        }
    }
    function ti(e, t) {
        var r = [];
        for(var i = 0; i < t.length; i++){
            r[i] = tt(e, t[i]);
        }
        return r;
    }
    var tn = function(e, t) {
        this.state = e;
        this.lookAhead = t;
    };
    var to = function(e, t, r, i) {
        this.state = t;
        this.doc = e;
        this.line = r;
        this.maxLookAhead = i || 0;
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
    to.fromSaved = function(e, t, r) {
        if (t instanceof tn) {
            return new to(e, e7(e.mode, t.state), r, t.lookAhead);
        } else {
            return new to(e, e7(e.mode, t), r);
        }
    };
    to.prototype.save = function(e) {
        var t = e !== false ? e7(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new tn(t, this.maxLookAhead) : t;
    };
    function tl(e, t, r, i) {
        var n = [
            e.state.modeGen
        ], o = {};
        tv(e, t.text, e.doc.mode, r, function(e, t) {
            return n.push(e, t);
        }, o, i);
        var l = r.state;
        var a = function(i) {
            r.baseTokens = n;
            var a = e.state.overlays[i], s = 1, u = 0;
            r.state = true;
            tv(e, t.text, a.mode, r, function(e, t) {
                var r = s;
                while(u < e){
                    var i = n[s];
                    if (i > e) {
                        n.splice(s, 1, e, n[s + 1], i);
                    }
                    s += 2;
                    u = Math.min(e, i);
                }
                if (!t) {
                    return;
                }
                if (a.opaque) {
                    n.splice(r, s - r, e, "overlay " + t);
                    s = r + 2;
                } else {
                    for(; r < s; r += 2){
                        var o = n[r + 1];
                        n[r + 1] = (o ? o + " " : "") + "overlay " + t;
                    }
                }
            }, o);
            r.state = l;
            r.baseTokens = null;
            r.baseTokenPos = 1;
        };
        for(var s = 0; s < e.state.overlays.length; ++s)a(s);
        return {
            styles: n,
            classes: o.bgClass || o.textClass ? o : null
        };
    }
    function ta(e, t, r) {
        if (!t.styles || t.styles[0] != e.state.modeGen) {
            var i = ts(e, eK(t));
            var n = t.text.length > e.options.maxHighlightLength && e7(e.doc.mode, i.state);
            var o = tl(e, t, i);
            if (n) {
                i.state = n;
            }
            t.stateAfter = i.save(!n);
            t.styles = o.styles;
            if (o.classes) {
                t.styleClasses = o.classes;
            } else if (t.styleClasses) {
                t.styleClasses = null;
            }
            if (r === e.doc.highlightFrontier) {
                e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier);
            }
        }
        return t.styles;
    }
    function ts(e, t, r) {
        var i = e.doc, n = e.display;
        if (!i.mode.startState) {
            return new to(i, true, t);
        }
        var o = tg(e, t, r);
        var l = o > i.first && e2(i, o - 1).stateAfter;
        var a = l ? to.fromSaved(i, l, o) : new to(i, e6(i.mode), o);
        i.iter(o, t, function(r) {
            tu(e, r.text, a);
            var i = a.line;
            r.stateAfter = i == t - 1 || i % 5 == 0 || (i >= n.viewFrom && i < n.viewTo) ? a.save() : null;
            a.nextLine();
        });
        if (r) {
            i.modeFrontier = a.line;
        }
        return a;
    }
    function tu(e, t, r, i) {
        var n = e.doc.mode;
        var o = new e5(t, e.options.tabSize, r);
        o.start = o.pos = i || 0;
        if (t == "") {
            tf(n, r.state);
        }
        while(!o.eol()){
            tc(n, o, r.state);
            o.start = o.pos;
        }
    }
    function tf(e, t) {
        if (e.blankLine) {
            return e.blankLine(t);
        }
        if (!e.innerMode) {
            return;
        }
        var r = e4(e, t);
        if (r.mode.blankLine) {
            return r.mode.blankLine(r.state);
        }
    }
    function tc(e, t, r, i) {
        for(var n = 0; n < 10; n++){
            if (i) {
                i[0] = e4(e, r).mode;
            }
            var o = e.token(t, r);
            if (t.pos > t.start) {
                return o;
            }
        }
        throw new Error("Mode " + e.name + " failed to advance stream.");
    }
    var th = function(e, t, r) {
        this.start = e.start;
        this.end = e.pos;
        this.string = e.current();
        this.type = t || null;
        this.state = r;
    };
    function td(e, t, r, i) {
        var n = e.doc, o = n.mode, l;
        t = tt(n, t);
        var a = e2(n, t.line), s = ts(e, t.line, r);
        var u = new e5(a.text, e.options.tabSize, s), f;
        if (i) {
            f = [];
        }
        while((i || u.pos < t.ch) && !u.eol()){
            u.start = u.pos;
            l = tc(o, u, s.state);
            if (i) {
                f.push(new th(u, l, e7(n.mode, s.state)));
            }
        }
        return i ? f : new th(u, l, s.state);
    }
    function tp(e, t) {
        if (e) {
            for(;;){
                var r = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!r) {
                    break;
                }
                e = e.slice(0, r.index) + e.slice(r.index + r[0].length);
                var i = r[1] ? "bgClass" : "textClass";
                if (t[i] == null) {
                    t[i] = r[2];
                } else if (!new RegExp("(?:^|\\s)" + r[2] + "(?:$|\\s)").test(t[i])) {
                    t[i] += " " + r[2];
                }
            }
        }
        return e;
    }
    function tv(e, t, r, i, n, o, l) {
        var a = r.flattenSpans;
        if (a == null) {
            a = e.options.flattenSpans;
        }
        var s = 0, u = null;
        var f = new e5(t, e.options.tabSize, i), c;
        var h = e.options.addModeClass && [
            null
        ];
        if (t == "") {
            tp(tf(r, i.state), o);
        }
        while(!f.eol()){
            if (f.pos > e.options.maxHighlightLength) {
                a = false;
                if (l) {
                    tu(e, t, i, f.pos);
                }
                f.pos = t.length;
                c = null;
            } else {
                c = tp(tc(r, f, i.state, h), o);
            }
            if (h) {
                var d = h[0].name;
                if (d) {
                    c = "m-" + (c ? d + " " + c : d);
                }
            }
            if (!a || u != c) {
                while(s < f.start){
                    s = Math.min(f.start, s + 5000);
                    n(s, u);
                }
                u = c;
            }
            f.start = f.pos;
        }
        while(s < f.pos){
            var p = Math.min(f.pos, s + 5000);
            n(p, u);
            s = p;
        }
    }
    function tg(e, t, r) {
        var i, n, o = e.doc;
        var l = r ? -1 : t - (e.doc.mode.innerMode ? 1000 : 100);
        for(var a = t; a > l; --a){
            if (a <= o.first) {
                return o.first;
            }
            var s = e2(o, a - 1), u = s.stateAfter;
            if (u && (!r || a + (u instanceof tn ? u.lookAhead : 0) <= o.modeFrontier)) {
                return a;
            }
            var f = E(s.text, null, e.options.tabSize);
            if (n == null || i > f) {
                n = a - 1;
                i = f;
            }
        }
        return n;
    }
    function tm(e, t) {
        e.modeFrontier = Math.min(e.modeFrontier, t);
        if (e.highlightFrontier < t - 10) {
            return;
        }
        var r = e.first;
        for(var i = t - 1; i > r; i--){
            var n = e2(e, i).stateAfter;
            if (n && (!(n instanceof tn) || i + n.lookAhead < t)) {
                r = i + 1;
                break;
            }
        }
        e.highlightFrontier = Math.min(e.highlightFrontier, r);
    }
    var t$ = false, ty = false;
    function tb() {
        t$ = true;
    }
    function tx() {
        ty = true;
    }
    function tw(e, t, r) {
        this.marker = e;
        this.from = t;
        this.to = r;
    }
    function t_(e, t) {
        if (e) {
            for(var r = 0; r < e.length; ++r){
                var i = e[r];
                if (i.marker == t) {
                    return i;
                }
            }
        }
    }
    function tC(e, t) {
        var r;
        for(var i = 0; i < e.length; ++i){
            if (e[i] != t) {
                (r || (r = [])).push(e[i]);
            }
        }
        return r;
    }
    function tS(e, t, r) {
        var i = r && window.WeakSet && (r.markedSpans || (r.markedSpans = new WeakSet()));
        if (i && i.has(e.markedSpans)) {
            e.markedSpans.push(t);
        } else {
            e.markedSpans = e.markedSpans ? e.markedSpans.concat([
                t
            ]) : [
                t
            ];
            if (i) {
                i.add(e.markedSpans);
            }
        }
        t.marker.attachLine(e);
    }
    function tL(e, t, r) {
        var i;
        if (e) {
            for(var n = 0; n < e.length; ++n){
                var o = e[n], l = o.marker;
                var a = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t);
                if (a || (o.from == t && l.type == "bookmark" && (!r || !o.marker.insertLeft))) {
                    var s = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t);
                    (i || (i = [])).push(new tw(l, o.from, s ? null : o.to));
                }
            }
        }
        return i;
    }
    function tk(e, t, r) {
        var i;
        if (e) {
            for(var n = 0; n < e.length; ++n){
                var o = e[n], l = o.marker;
                var a = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t);
                if (a || (o.from == t && l.type == "bookmark" && (!r || o.marker.insertLeft))) {
                    var s = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t);
                    (i || (i = [])).push(new tw(l, s ? null : o.from - t, o.to == null ? null : o.to - t));
                }
            }
        }
        return i;
    }
    function tT(e, t) {
        if (t.full) {
            return null;
        }
        var r = ej(e, t.from.line) && e2(e, t.from.line).markedSpans;
        var i = ej(e, t.to.line) && e2(e, t.to.line).markedSpans;
        if (!r && !i) {
            return null;
        }
        var n = t.from.ch, o = t.to.ch, l = e9(t.from, t.to) == 0;
        var a = tL(r, n, l);
        var s = tk(i, o, l);
        var u = t.text.length == 1, f = Y(t.text).length + (u ? n : 0);
        if (a) {
            for(var c = 0; c < a.length; ++c){
                var h = a[c];
                if (h.to == null) {
                    var d = t_(s, h.marker);
                    if (!d) {
                        h.to = n;
                    } else if (u) {
                        h.to = d.to == null ? null : d.to + f;
                    }
                }
            }
        }
        if (s) {
            for(var p = 0; p < s.length; ++p){
                var v = s[p];
                if (v.to != null) {
                    v.to += f;
                }
                if (v.from == null) {
                    var g = t_(a, v.marker);
                    if (!g) {
                        v.from = f;
                        if (u) {
                            (a || (a = [])).push(v);
                        }
                    }
                } else {
                    v.from += f;
                    if (u) {
                        (a || (a = [])).push(v);
                    }
                }
            }
        }
        if (a) {
            a = tN(a);
        }
        if (s && s != a) {
            s = tN(s);
        }
        var m = [
            a
        ];
        if (!u) {
            var $ = t.text.length - 2, y;
            if ($ > 0 && a) {
                for(var b = 0; b < a.length; ++b){
                    if (a[b].to == null) {
                        (y || (y = [])).push(new tw(a[b].marker, null, null));
                    }
                }
            }
            for(var x = 0; x < $; ++x){
                m.push(y);
            }
            m.push(s);
        }
        return m;
    }
    function tN(e) {
        for(var t = 0; t < e.length; ++t){
            var r = e[t];
            if (r.from != null && r.from == r.to && r.marker.clearWhenEmpty !== false) {
                e.splice(t--, 1);
            }
        }
        if (!e.length) {
            return null;
        }
        return e;
    }
    function tO(e, t, r) {
        var i = null;
        e.iter(t.line, r.line + 1, function(e) {
            if (e.markedSpans) {
                for(var t = 0; t < e.markedSpans.length; ++t){
                    var r = e.markedSpans[t].marker;
                    if (r.readOnly && (!i || R(i, r) == -1)) {
                        (i || (i = [])).push(r);
                    }
                }
            }
        });
        if (!i) {
            return null;
        }
        var n = [
            {
                from: t,
                to: r
            }
        ];
        for(var o = 0; o < i.length; ++o){
            var l = i[o], a = l.find(0);
            for(var s = 0; s < n.length; ++s){
                var u = n[s];
                if (e9(u.to, a.from) < 0 || e9(u.from, a.to) > 0) {
                    continue;
                }
                var f = [
                    s,
                    1
                ], c = e9(u.from, a.from), h = e9(u.to, a.to);
                if (c < 0 || (!l.inclusiveLeft && !c)) {
                    f.push({
                        from: u.from,
                        to: a.from
                    });
                }
                if (h > 0 || (!l.inclusiveRight && !h)) {
                    f.push({
                        from: a.to,
                        to: u.to
                    });
                }
                n.splice.apply(n, f);
                s += f.length - 3;
            }
        }
        return n;
    }
    function tM(e) {
        var t = e.markedSpans;
        if (!t) {
            return;
        }
        for(var r = 0; r < t.length; ++r){
            t[r].marker.detachLine(e);
        }
        e.markedSpans = null;
    }
    function tA(e, t) {
        if (!t) {
            return;
        }
        for(var r = 0; r < t.length; ++r){
            t[r].marker.attachLine(e);
        }
        e.markedSpans = t;
    }
    function t0(e) {
        return e.inclusiveLeft ? -1 : 0;
    }
    function tW(e) {
        return e.inclusiveRight ? 1 : 0;
    }
    function tD(e, t) {
        var r = e.lines.length - t.lines.length;
        if (r != 0) {
            return r;
        }
        var i = e.find(), n = t.find();
        var o = e9(i.from, n.from) || t0(e) - t0(t);
        if (o) {
            return -o;
        }
        var l = e9(i.to, n.to) || tW(e) - tW(t);
        if (l) {
            return l;
        }
        return t.id - e.id;
    }
    function tH(e, t) {
        var r = ty && e.markedSpans, i;
        if (r) {
            for(var n = void 0, o = 0; o < r.length; ++o){
                n = r[o];
                if (n.marker.collapsed && (t ? n.from : n.to) == null && (!i || tD(i, n.marker) < 0)) {
                    i = n.marker;
                }
            }
        }
        return i;
    }
    function tF(e) {
        return tH(e, true);
    }
    function tP(e) {
        return tH(e, false);
    }
    function t1(e, t) {
        var r = ty && e.markedSpans, i;
        if (r) {
            for(var n = 0; n < r.length; ++n){
                var o = r[n];
                if (o.marker.collapsed && (o.from == null || o.from < t) && (o.to == null || o.to > t) && (!i || tD(i, o.marker) < 0)) {
                    i = o.marker;
                }
            }
        }
        return i;
    }
    function tE(e, t, r, i, n) {
        var o = e2(e, t);
        var l = ty && o.markedSpans;
        if (l) {
            for(var a = 0; a < l.length; ++a){
                var s = l[a];
                if (!s.marker.collapsed) {
                    continue;
                }
                var u = s.marker.find(0);
                var f = e9(u.from, r) || t0(s.marker) - t0(n);
                var c = e9(u.to, i) || tW(s.marker) - tW(n);
                if ((f >= 0 && c <= 0) || (f <= 0 && c >= 0)) {
                    continue;
                }
                if ((f <= 0 && (s.marker.inclusiveRight && n.inclusiveLeft ? e9(u.to, r) >= 0 : e9(u.to, r) > 0)) || (f >= 0 && (s.marker.inclusiveRight && n.inclusiveLeft ? e9(u.from, i) <= 0 : e9(u.from, i) < 0))) {
                    return true;
                }
            }
        }
    }
    function tz(e) {
        var t;
        while((t = tF(e))){
            e = t.find(-1, true).line;
        }
        return e;
    }
    function tR(e) {
        var t;
        while((t = tP(e))){
            e = t.find(1, true).line;
        }
        return e;
    }
    function tI(e) {
        var t, r;
        while((t = tP(e))){
            e = t.find(1, true).line;
            (r || (r = [])).push(e);
        }
        return r;
    }
    function t3(e, t) {
        var r = e2(e, t), i = tz(r);
        if (r == i) {
            return t;
        }
        return eK(i);
    }
    function tB(e, t) {
        if (t > e.lastLine()) {
            return t;
        }
        var r = e2(e, t), i;
        if (!t7(e, r)) {
            return t;
        }
        while((i = tP(r))){
            r = i.find(1, true).line;
        }
        return eK(r) + 1;
    }
    function t7(e, t) {
        var r = ty && t.markedSpans;
        if (r) {
            for(var i = void 0, n = 0; n < r.length; ++n){
                i = r[n];
                if (!i.marker.collapsed) {
                    continue;
                }
                if (i.from == null) {
                    return true;
                }
                if (i.marker.widgetNode) {
                    continue;
                }
                if (i.from == 0 && i.marker.inclusiveLeft && t4(e, t, i)) {
                    return true;
                }
            }
        }
    }
    function t4(e, t, r) {
        if (r.to == null) {
            var i = r.marker.find(1, true);
            return t4(e, i.line, t_(i.line.markedSpans, r.marker));
        }
        if (r.marker.inclusiveRight && r.to == t.text.length) {
            return true;
        }
        for(var n = void 0, o = 0; o < t.markedSpans.length; ++o){
            n = t.markedSpans[o];
            if (n.marker.collapsed && !n.marker.widgetNode && n.from == r.to && (n.to == null || n.to != r.from) && (n.marker.inclusiveLeft || r.marker.inclusiveRight) && t4(e, t, n)) {
                return true;
            }
        }
    }
    function t6(e) {
        e = tz(e);
        var t = 0, r = e.parent;
        for(var i = 0; i < r.lines.length; ++i){
            var n = r.lines[i];
            if (n == e) {
                break;
            } else {
                t += n.height;
            }
        }
        for(var o = r.parent; o; r = o, o = r.parent){
            for(var l = 0; l < o.children.length; ++l){
                var a = o.children[l];
                if (a == r) {
                    break;
                } else {
                    t += a.height;
                }
            }
        }
        return t;
    }
    function t5(e) {
        if (e.height == 0) {
            return 0;
        }
        var t = e.text.length, r, i = e;
        while((r = tF(i))){
            var n = r.find(0, true);
            i = n.from.line;
            t += n.from.ch - n.to.ch;
        }
        i = e;
        while((r = tP(i))){
            var o = r.find(0, true);
            t -= i.text.length - o.from.ch;
            i = o.to.line;
            t += i.text.length - o.to.ch;
        }
        return t;
    }
    function t2(e) {
        var t = e.display, r = e.doc;
        t.maxLine = e2(r, r.first);
        t.maxLineLength = t5(t.maxLine);
        t.maxLineChanged = true;
        r.iter(function(e) {
            var r = t5(e);
            if (r > t.maxLineLength) {
                t.maxLineLength = r;
                t.maxLine = e;
            }
        });
    }
    var tG = function(e, t, r) {
        this.text = e;
        tA(this, t);
        this.height = r ? r(this) : 1;
    };
    tG.prototype.lineNo = function() {
        return eK(this);
    };
    ex(tG);
    function tU(e, t, r, i) {
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
        tM(e);
        tA(e, r);
        var n = i ? i(e) : 1;
        if (n != e.height) {
            eV(e, n);
        }
    }
    function tV(e) {
        e.parent = null;
        tM(e);
    }
    var tK = {}, tX = {};
    function tj(e, t) {
        if (!e || /^\s*$/.test(e)) {
            return null;
        }
        var r = t.addModeClass ? tX : tK;
        return r[e] || (r[e] = e.replace(/\S+/g, "cm-$&"));
    }
    function tY(e, t) {
        var r = N("span", null, null, s ? "padding-right: .1px" : null);
        var i = {
            pre: N("pre", [
                r
            ], "CodeMirror-line"),
            content: r,
            col: 0,
            pos: 0,
            cm: e,
            trailingSpace: false,
            splitSpaces: e.getOption("lineWrapping")
        };
        t.measure = {};
        for(var n = 0; n <= (t.rest ? t.rest.length : 0); n++){
            var o = n ? t.rest[n - 1] : t.line, l = void 0;
            i.pos = 0;
            i.addToken = t9;
            if (eA(e.display.measure) && (l = eh(o, e.doc.direction))) {
                i.addToken = tZ(i.addToken, l);
            }
            i.map = [];
            var a = t != e.display.externalMeasured && eK(o);
            tJ(o, i, ta(e, o, a));
            if (o.styleClasses) {
                if (o.styleClasses.bgClass) {
                    i.bgClass = D(o.styleClasses.bgClass, i.bgClass || "");
                }
                if (o.styleClasses.textClass) {
                    i.textClass = D(o.styleClasses.textClass, i.textClass || "");
                }
            }
            if (i.map.length == 0) {
                i.map.push(0, 0, i.content.appendChild(eO(e.display.measure)));
            }
            if (n == 0) {
                t.measure.map = i.map;
                t.measure.cache = {};
            } else {
                (t.measure.maps || (t.measure.maps = [])).push(i.map);
                (t.measure.caches || (t.measure.caches = [])).push({});
            }
        }
        if (s) {
            var u = i.content.lastChild;
            if (/\bcm-tab\b/.test(u.className) || (u.querySelector && u.querySelector(".cm-tab"))) {
                i.content.className = "cm-tab-wrap-hack";
            }
        }
        em(e, "renderLine", e, t.line, i.pre);
        if (i.pre.className) {
            i.textClass = D(i.pre.className, i.textClass || "");
        }
        return i;
    }
    function t8(e) {
        var t = T("span", "\u2022", "cm-invalidchar");
        t.title = "\\u" + e.charCodeAt(0).toString(16);
        t.setAttribute("aria-label", t.title);
        return t;
    }
    function t9(e, t, r, i, n, o, s) {
        if (!t) {
            return;
        }
        var u = e.splitSpaces ? tq(t, e.trailingSpace) : t;
        var f = e.cm.state.specialChars, c = false;
        var h;
        if (!f.test(t)) {
            e.col += t.length;
            h = document.createTextNode(u);
            e.map.push(e.pos, e.pos + t.length, h);
            if (l && a < 9) {
                c = true;
            }
            e.pos += t.length;
        } else {
            h = document.createDocumentFragment();
            var d = 0;
            while(true){
                f.lastIndex = d;
                var p = f.exec(t);
                var v = p ? p.index - d : t.length - d;
                if (v) {
                    var g = document.createTextNode(u.slice(d, d + v));
                    if (l && a < 9) {
                        h.appendChild(T("span", [
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
                    m = h.appendChild(T("span", j(y), "cm-tab"));
                    m.setAttribute("role", "presentation");
                    m.setAttribute("cm-text", "\t");
                    e.col += y;
                } else if (p[0] == "\r" || p[0] == "\n") {
                    m = h.appendChild(T("span", p[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                    m.setAttribute("cm-text", p[0]);
                    e.col += 1;
                } else {
                    m = e.cm.options.specialCharPlaceholder(p[0]);
                    m.setAttribute("cm-text", p[0]);
                    if (l && a < 9) {
                        h.appendChild(T("span", [
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
        e.trailingSpace = u.charCodeAt(t.length - 1) == 32;
        if (r || i || n || c || o || s) {
            var b = r || "";
            if (i) {
                b += i;
            }
            if (n) {
                b += n;
            }
            var x = T("span", [
                h
            ], b, o);
            if (s) {
                for(var w in s){
                    if (s.hasOwnProperty(w) && w != "style" && w != "class") {
                        x.setAttribute(w, s[w]);
                    }
                }
            }
            return e.content.appendChild(x);
        }
        e.content.appendChild(h);
    }
    function tq(e, t) {
        if (e.length > 1 && !/  /.test(e)) {
            return e;
        }
        var r = t, i = "";
        for(var n = 0; n < e.length; n++){
            var o = e.charAt(n);
            if (o == " " && r && (n == e.length - 1 || e.charCodeAt(n + 1) == 32)) {
                o = "\u00a0";
            }
            i += o;
            r = o == " ";
        }
        return i;
    }
    function tZ(e, t) {
        return function(r, i, n, o, l, a, s) {
            n = n ? n + " cm-force-border" : "cm-force-border";
            var u = r.pos, f = u + i.length;
            for(;;){
                var c = void 0;
                for(var h = 0; h < t.length; h++){
                    c = t[h];
                    if (c.to > u && c.from <= u) {
                        break;
                    }
                }
                if (c.to >= f) {
                    return e(r, i, n, o, l, a, s);
                }
                e(r, i.slice(0, c.to - u), n, o, null, a, s);
                o = null;
                i = i.slice(c.to - u);
                u = c.to;
            }
        };
    }
    function tQ(e, t, r, i) {
        var n = !i && r.widgetNode;
        if (n) {
            e.map.push(e.pos, e.pos + t, n);
        }
        if (!i && e.cm.display.input.needsContentAttribute) {
            if (!n) {
                n = e.content.appendChild(document.createElement("span"));
            }
            n.setAttribute("cm-marker", r.id);
        }
        if (n) {
            e.cm.display.input.setUneditable(n);
            e.content.appendChild(n);
        }
        e.pos += t;
        e.trailingSpace = false;
    }
    function tJ(e, t, r) {
        var i = e.markedSpans, n = e.text, o = 0;
        if (!i) {
            for(var l = 1; l < r.length; l += 2){
                t.addToken(t, n.slice(o, (o = r[l])), tj(r[l + 1], t.cm.options));
            }
            return;
        }
        var a = n.length, s = 0, u = 1, f = "", c, h;
        var d = 0, p, v, g, m, $;
        for(;;){
            if (d == s) {
                p = v = g = h = "";
                $ = null;
                m = null;
                d = Infinity;
                var y = [], b = void 0;
                for(var x = 0; x < i.length; ++x){
                    var w = i[x], _ = w.marker;
                    if (_.type == "bookmark" && w.from == s && _.widgetNode) {
                        y.push(_);
                    } else if (w.from <= s && (w.to == null || w.to > s || (_.collapsed && w.to == s && w.from == s))) {
                        if (w.to != null && w.to != s && d > w.to) {
                            d = w.to;
                            v = "";
                        }
                        if (_.className) {
                            p += " " + _.className;
                        }
                        if (_.css) {
                            h = (h ? h + ";" : "") + _.css;
                        }
                        if (_.startStyle && w.from == s) {
                            g += " " + _.startStyle;
                        }
                        if (_.endStyle && w.to == d) {
                            (b || (b = [])).push(_.endStyle, w.to);
                        }
                        if (_.title) {
                            ($ || ($ = {})).title = _.title;
                        }
                        if (_.attributes) {
                            for(var C in _.attributes){
                                ($ || ($ = {}))[C] = _.attributes[C];
                            }
                        }
                        if (_.collapsed && (!m || tD(m.marker, _) < 0)) {
                            m = w;
                        }
                    } else if (w.from > s && d > w.from) {
                        d = w.from;
                    }
                }
                if (b) {
                    for(var S = 0; S < b.length; S += 2){
                        if (b[S + 1] == d) {
                            v += " " + b[S];
                        }
                    }
                }
                if (!m || m.from == s) {
                    for(var L = 0; L < y.length; ++L){
                        tQ(t, 0, y[L]);
                    }
                }
                if (m && (m.from || 0) == s) {
                    tQ(t, (m.to == null ? a + 1 : m.to) - s, m.marker, m.from == null);
                    if (m.to == null) {
                        return;
                    }
                    if (m.to == s) {
                        m = false;
                    }
                }
            }
            if (s >= a) {
                break;
            }
            var k = Math.min(a, d);
            while(true){
                if (f) {
                    var T = s + f.length;
                    if (!m) {
                        var N = T > k ? f.slice(0, k - s) : f;
                        t.addToken(t, N, c ? c + p : p, g, s + N.length == d ? v : "", h, $);
                    }
                    if (T >= k) {
                        f = f.slice(k - s);
                        s = k;
                        break;
                    }
                    s = T;
                    g = "";
                }
                f = n.slice(o, (o = r[u++]));
                c = tj(r[u++], t.cm.options);
            }
        }
    }
    function re(e, t, r) {
        this.line = t;
        this.rest = tI(t);
        this.size = this.rest ? eK(Y(this.rest)) - r + 1 : 1;
        this.node = this.text = null;
        this.hidden = t7(e, t);
    }
    function rt(e, t, r) {
        var i = [], n;
        for(var o = t; o < r; o = n){
            var l = new re(e.doc, e2(e.doc, o), o);
            n = o + l.size;
            i.push(l);
        }
        return i;
    }
    var rr = null;
    function ri(e) {
        if (rr) {
            rr.ops.push(e);
        } else {
            e.ownsGroup = rr = {
                ops: [
                    e
                ],
                delayedCallbacks: []
            };
        }
    }
    function rn(e) {
        var t = e.delayedCallbacks, r = 0;
        do {
            for(; r < t.length; r++){
                t[r].call(null);
            }
            for(var i = 0; i < e.ops.length; i++){
                var n = e.ops[i];
                if (n.cursorActivityHandlers) {
                    while(n.cursorActivityCalled < n.cursorActivityHandlers.length){
                        n.cursorActivityHandlers[n.cursorActivityCalled++].call(null, n.cm);
                    }
                }
            }
        }while (r < t.length)
    }
    function ro(e, t) {
        var r = e.ownsGroup;
        if (!r) {
            return;
        }
        try {
            rn(r);
        } finally{
            rr = null;
            t(r);
        }
    }
    var rl = null;
    function ra(e, t) {
        var r = ev(e, t);
        if (!r.length) {
            return;
        }
        var i = Array.prototype.slice.call(arguments, 2), n;
        if (rr) {
            n = rr.delayedCallbacks;
        } else if (rl) {
            n = rl;
        } else {
            n = rl = [];
            setTimeout(rs, 0);
        }
        var o = function(e) {
            n.push(function() {
                return r[e].apply(null, i);
            });
        };
        for(var l = 0; l < r.length; ++l)o(l);
    }
    function rs() {
        var e = rl;
        rl = null;
        for(var t = 0; t < e.length; ++t){
            e[t]();
        }
    }
    function ru(e, t, r, i) {
        for(var n = 0; n < t.changes.length; n++){
            var o = t.changes[n];
            if (o == "text") {
                rd(e, t);
            } else if (o == "gutter") {
                rv(e, t, r, i);
            } else if (o == "class") {
                rp(e, t);
            } else if (o == "widget") {
                rg(e, t, i);
            }
        }
        t.changes = null;
    }
    function rf(e) {
        if (e.node == e.text) {
            e.node = T("div", null, null, "position: relative");
            if (e.text.parentNode) {
                e.text.parentNode.replaceChild(e.node, e.text);
            }
            e.node.appendChild(e.text);
            if (l && a < 8) {
                e.node.style.zIndex = 2;
            }
        }
        return e.node;
    }
    function rc(e, t) {
        var r = t.bgClass ? t.bgClass + " " + (t.line.bgClass || "") : t.line.bgClass;
        if (r) {
            r += " CodeMirror-linebackground";
        }
        if (t.background) {
            if (r) {
                t.background.className = r;
            } else {
                t.background.parentNode.removeChild(t.background);
                t.background = null;
            }
        } else if (r) {
            var i = rf(t);
            t.background = i.insertBefore(T("div", null, r), i.firstChild);
            e.display.input.setUneditable(t.background);
        }
    }
    function rh(e, t) {
        var r = e.display.externalMeasured;
        if (r && r.line == t.line) {
            e.display.externalMeasured = null;
            t.measure = r.measure;
            return r.built;
        }
        return tY(e, t);
    }
    function rd(e, t) {
        var r = t.text.className;
        var i = rh(e, t);
        if (t.text == t.node) {
            t.node = i.pre;
        }
        t.text.parentNode.replaceChild(i.pre, t.text);
        t.text = i.pre;
        if (i.bgClass != t.bgClass || i.textClass != t.textClass) {
            t.bgClass = i.bgClass;
            t.textClass = i.textClass;
            rp(e, t);
        } else if (r) {
            t.text.className = r;
        }
    }
    function rp(e, t) {
        rc(e, t);
        if (t.line.wrapClass) {
            rf(t).className = t.line.wrapClass;
        } else if (t.node != t.text) {
            t.node.className = "";
        }
        var r = t.textClass ? t.textClass + " " + (t.line.textClass || "") : t.line.textClass;
        t.text.className = r || "";
    }
    function rv(e, t, r, i) {
        if (t.gutter) {
            t.node.removeChild(t.gutter);
            t.gutter = null;
        }
        if (t.gutterBackground) {
            t.node.removeChild(t.gutterBackground);
            t.gutterBackground = null;
        }
        if (t.line.gutterClass) {
            var n = rf(t);
            t.gutterBackground = T("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? i.fixedPos : -i.gutterTotalWidth) + "px; width: " + i.gutterTotalWidth + "px");
            e.display.input.setUneditable(t.gutterBackground);
            n.insertBefore(t.gutterBackground, t.text);
        }
        var o = t.line.gutterMarkers;
        if (e.options.lineNumbers || o) {
            var l = rf(t);
            var a = (t.gutter = T("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? i.fixedPos : -i.gutterTotalWidth) + "px"));
            a.setAttribute("aria-hidden", "true");
            e.display.input.setUneditable(a);
            l.insertBefore(a, t.text);
            if (t.line.gutterClass) {
                a.className += " " + t.line.gutterClass;
            }
            if (e.options.lineNumbers && (!o || !o["CodeMirror-linenumbers"])) {
                t.lineNumber = a.appendChild(T("div", eY(e.options, r), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + i.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"));
            }
            if (o) {
                for(var s = 0; s < e.display.gutterSpecs.length; ++s){
                    var u = e.display.gutterSpecs[s].className, f = o.hasOwnProperty(u) && o[u];
                    if (f) {
                        a.appendChild(T("div", [
                            f
                        ], "CodeMirror-gutter-elt", "left: " + i.gutterLeft[u] + "px; width: " + i.gutterWidth[u] + "px"));
                    }
                }
            }
        }
    }
    function rg(e, t, r) {
        if (t.alignable) {
            t.alignable = null;
        }
        var i = C("CodeMirror-linewidget");
        for(var n = t.node.firstChild, o = void 0; n; n = o){
            o = n.nextSibling;
            if (i.test(n.className)) {
                t.node.removeChild(n);
            }
        }
        r$(e, t, r);
    }
    function rm(e, t, r, i) {
        var n = rh(e, t);
        t.text = t.node = n.pre;
        if (n.bgClass) {
            t.bgClass = n.bgClass;
        }
        if (n.textClass) {
            t.textClass = n.textClass;
        }
        rp(e, t);
        rv(e, t, r, i);
        r$(e, t, i);
        return t.node;
    }
    function r$(e, t, r) {
        ry(e, t.line, t, r, true);
        if (t.rest) {
            for(var i = 0; i < t.rest.length; i++){
                ry(e, t.rest[i], t, r, false);
            }
        }
    }
    function ry(e, t, r, i, n) {
        if (!t.widgets) {
            return;
        }
        var o = rf(r);
        for(var l = 0, a = t.widgets; l < a.length; ++l){
            var s = a[l], u = T("div", [
                s.node
            ], "CodeMirror-linewidget" + (s.className ? " " + s.className : ""));
            if (!s.handleMouseEvents) {
                u.setAttribute("cm-ignore-events", "true");
            }
            rb(s, u, r, i);
            e.display.input.setUneditable(u);
            if (n && s.above) {
                o.insertBefore(u, r.gutter || r.text);
            } else {
                o.appendChild(u);
            }
            ra(s, "redraw");
        }
    }
    function rb(e, t, r, i) {
        if (e.noHScroll) {
            (r.alignable || (r.alignable = [])).push(t);
            var n = i.wrapperWidth;
            t.style.left = i.fixedPos + "px";
            if (!e.coverGutter) {
                n -= i.gutterTotalWidth;
                t.style.paddingLeft = i.gutterTotalWidth + "px";
            }
            t.style.width = n + "px";
        }
        if (e.coverGutter) {
            t.style.zIndex = 5;
            t.style.position = "relative";
            if (!e.noHScroll) {
                t.style.marginLeft = -i.gutterTotalWidth + "px";
            }
        }
    }
    function rx(e) {
        if (e.height != null) {
            return e.height;
        }
        var t = e.doc.cm;
        if (!t) {
            return 0;
        }
        if (!M(document.body, e.node)) {
            var r = "position: relative;";
            if (e.coverGutter) {
                r += "margin-left: -" + t.display.gutters.offsetWidth + "px;";
            }
            if (e.noHScroll) {
                r += "width: " + t.display.wrapper.clientWidth + "px;";
            }
            k(t.display.measure, T("div", [
                e.node
            ], null, r));
        }
        return (e.height = e.node.parentNode.offsetHeight);
    }
    function rw(e, t) {
        for(var r = eL(t); r != e.wrapper; r = r.parentNode){
            if (!r || (r.nodeType == 1 && r.getAttribute("cm-ignore-events") == "true") || (r.parentNode == e.sizer && r != e.mover)) {
                return true;
            }
        }
    }
    function r_(e) {
        return e.lineSpace.offsetTop;
    }
    function rC(e) {
        return e.mover.offsetHeight - e.lineSpace.offsetHeight;
    }
    function rS(e) {
        if (e.cachedPaddingH) {
            return e.cachedPaddingH;
        }
        var t = k(e.measure, T("pre", "x", "CodeMirror-line-like"));
        var r = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle;
        var i = {
            left: parseInt(r.paddingLeft),
            right: parseInt(r.paddingRight)
        };
        if (!isNaN(i.left) && !isNaN(i.right)) {
            e.cachedPaddingH = i;
        }
        return i;
    }
    function rL(e) {
        return I - e.display.nativeBarWidth;
    }
    function rk(e) {
        return (e.display.scroller.clientWidth - rL(e) - e.display.barWidth);
    }
    function rT(e) {
        return (e.display.scroller.clientHeight - rL(e) - e.display.barHeight);
    }
    function rN(e, t, r) {
        var i = e.options.lineWrapping;
        var n = i && rk(e);
        if (!t.measure.heights || (i && t.measure.width != n)) {
            var o = (t.measure.heights = []);
            if (i) {
                t.measure.width = n;
                var l = t.text.firstChild.getClientRects();
                for(var a = 0; a < l.length - 1; a++){
                    var s = l[a], u = l[a + 1];
                    if (Math.abs(s.bottom - u.bottom) > 2) {
                        o.push((s.bottom + u.top) / 2 - r.top);
                    }
                }
            }
            o.push(r.bottom - r.top);
        }
    }
    function rO(e, t, r) {
        if (e.line == t) {
            return {
                map: e.measure.map,
                cache: e.measure.cache
            };
        }
        if (e.rest) {
            for(var i = 0; i < e.rest.length; i++){
                if (e.rest[i] == t) {
                    return {
                        map: e.measure.maps[i],
                        cache: e.measure.caches[i]
                    };
                }
            }
            for(var n = 0; n < e.rest.length; n++){
                if (eK(e.rest[n]) > r) {
                    return {
                        map: e.measure.maps[n],
                        cache: e.measure.caches[n],
                        before: true
                    };
                }
            }
        }
    }
    function rM(e, t) {
        t = tz(t);
        var r = eK(t);
        var i = (e.display.externalMeasured = new re(e.doc, t, r));
        i.lineN = r;
        var n = (i.built = tY(e, i));
        i.text = n.pre;
        k(e.display.lineMeasure, n.pre);
        return i;
    }
    function rA(e, t, r, i) {
        return rD(e, rW(e, t), r, i);
    }
    function r0(e, t) {
        if (t >= e.display.viewFrom && t < e.display.viewTo) {
            return e.display.view[io(e, t)];
        }
        var r = e.display.externalMeasured;
        if (r && t >= r.lineN && t < r.lineN + r.size) {
            return r;
        }
    }
    function rW(e, t) {
        var r = eK(t);
        var i = r0(e, r);
        if (i && !i.text) {
            i = null;
        } else if (i && i.changes) {
            ru(e, i, r, rJ(e));
            e.curOp.forceUpdate = true;
        }
        if (!i) {
            i = rM(e, t);
        }
        var n = rO(i, t, r);
        return {
            line: t,
            view: i,
            rect: null,
            map: n.map,
            cache: n.cache,
            before: n.before,
            hasHeights: false
        };
    }
    function rD(e, t, r, i, n) {
        if (t.before) {
            r = -1;
        }
        var o = r + (i || ""), l;
        if (t.cache.hasOwnProperty(o)) {
            l = t.cache[o];
        } else {
            if (!t.rect) {
                t.rect = t.view.text.getBoundingClientRect();
            }
            if (!t.hasHeights) {
                rN(e, t.view, t.rect);
                t.hasHeights = true;
            }
            l = r1(e, t, r, i);
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
    var rH = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function rF(e, t, r) {
        var i, n, o, l, a, s;
        for(var u = 0; u < e.length; u += 3){
            a = e[u];
            s = e[u + 1];
            if (t < a) {
                n = 0;
                o = 1;
                l = "left";
            } else if (t < s) {
                n = t - a;
                o = n + 1;
            } else if (u == e.length - 3 || (t == s && e[u + 3] > t)) {
                o = s - a;
                n = o - 1;
                if (t >= s) {
                    l = "right";
                }
            }
            if (n != null) {
                i = e[u + 2];
                if (a == s && r == (i.insertLeft ? "left" : "right")) {
                    l = r;
                }
                if (r == "left" && n == 0) {
                    while(u && e[u - 2] == e[u - 3] && e[u - 1].insertLeft){
                        i = e[(u -= 3) + 2];
                        l = "left";
                    }
                }
                if (r == "right" && n == s - a) {
                    while(u < e.length - 3 && e[u + 3] == e[u + 4] && !e[u + 5].insertLeft){
                        i = e[(u += 3) + 2];
                        l = "right";
                    }
                }
                break;
            }
        }
        return {
            node: i,
            start: n,
            end: o,
            collapse: l,
            coverStart: a,
            coverEnd: s
        };
    }
    function rP(e, t) {
        var r = rH;
        if (t == "left") {
            for(var i = 0; i < e.length; i++){
                if ((r = e[i]).left != r.right) {
                    break;
                }
            }
        } else {
            for(var n = e.length - 1; n >= 0; n--){
                if ((r = e[n]).left != r.right) {
                    break;
                }
            }
        }
        return r;
    }
    function r1(e, t, r, i) {
        var n = rF(t.map, r, i);
        var o = n.node, s = n.start, u = n.end, f = n.collapse;
        var c;
        if (o.nodeType == 3) {
            for(var h = 0; h < 4; h++){
                while(s && eo(t.line.text.charAt(n.coverStart + s))){
                    --s;
                }
                while(n.coverStart + u < n.coverEnd && eo(t.line.text.charAt(n.coverStart + u))){
                    ++u;
                }
                if (l && a < 9 && s == 0 && u == n.coverEnd - n.coverStart) {
                    c = o.parentNode.getBoundingClientRect();
                } else {
                    c = rP(O(o, s, u).getClientRects(), i);
                }
                if (c.left || c.right || s == 0) {
                    break;
                }
                u = s;
                s = s - 1;
                f = "right";
            }
            if (l && a < 11) {
                c = rE(e.display.measure, c);
            }
        } else {
            if (s > 0) {
                f = i = "right";
            }
            var d;
            if (e.options.lineWrapping && (d = o.getClientRects()).length > 1) {
                c = d[i == "right" ? d.length - 1 : 0];
            } else {
                c = o.getBoundingClientRect();
            }
        }
        if (l && a < 9 && !s && (!c || (!c.left && !c.right))) {
            var p = o.parentNode.getClientRects()[0];
            if (p) {
                c = {
                    left: p.left,
                    right: p.left + rQ(e.display),
                    top: p.top,
                    bottom: p.bottom
                };
            } else {
                c = rH;
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
        var b = y ? $[y - 1] : 0, x = $[y];
        var w = {
            left: (f == "right" ? c.right : c.left) - t.rect.left,
            right: (f == "left" ? c.left : c.right) - t.rect.left,
            top: b,
            bottom: x
        };
        if (!c.left && !c.right) {
            w.bogus = true;
        }
        if (!e.options.singleCursorHeightPerLine) {
            w.rtop = v;
            w.rbottom = g;
        }
        return w;
    }
    function rE(e, t) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !eF(e)) {
            return t;
        }
        var r = screen.logicalXDPI / screen.deviceXDPI;
        var i = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: t.left * r,
            right: t.right * r,
            top: t.top * i,
            bottom: t.bottom * i
        };
    }
    function rz(e) {
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
    function rR(e) {
        e.display.externalMeasure = null;
        L(e.display.lineMeasure);
        for(var t = 0; t < e.display.view.length; t++){
            rz(e.display.view[t]);
        }
    }
    function rI(e) {
        rR(e);
        e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null;
        if (!e.options.lineWrapping) {
            e.display.maxLineChanged = true;
        }
        e.display.lineNumChars = null;
    }
    function r3() {
        if (f && g) {
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        }
        return (window.pageXOffset || (document.documentElement || document.body).scrollLeft);
    }
    function rB() {
        if (f && g) {
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        }
        return (window.pageYOffset || (document.documentElement || document.body).scrollTop);
    }
    function r7(e) {
        var t = tz(e);
        var r = t.widgets;
        var i = 0;
        if (r) {
            for(var n = 0; n < r.length; ++n){
                if (r[n].above) {
                    i += rx(r[n]);
                }
            }
        }
        return i;
    }
    function r4(e, t, r, i, n) {
        if (!n) {
            var o = r7(t);
            r.top += o;
            r.bottom += o;
        }
        if (i == "line") {
            return r;
        }
        if (!i) {
            i = "local";
        }
        var l = t6(t);
        if (i == "local") {
            l += r_(e.display);
        } else {
            l -= e.display.viewOffset;
        }
        if (i == "page" || i == "window") {
            var a = e.display.lineSpace.getBoundingClientRect();
            l += a.top + (i == "window" ? 0 : rB());
            var s = a.left + (i == "window" ? 0 : r3());
            r.left += s;
            r.right += s;
        }
        r.top += l;
        r.bottom += l;
        return r;
    }
    function r6(e, t, r) {
        if (r == "div") {
            return t;
        }
        var i = t.left, n = t.top;
        if (r == "page") {
            i -= r3();
            n -= rB();
        } else if (r == "local" || !r) {
            var o = e.display.sizer.getBoundingClientRect();
            i += o.left;
            n += o.top;
        }
        var l = e.display.lineSpace.getBoundingClientRect();
        return {
            left: i - l.left,
            top: n - l.top
        };
    }
    function r5(e, t, r, i, n) {
        if (!i) {
            i = e2(e.doc, t.line);
        }
        return r4(e, i, rA(e, i, t.ch, n), r);
    }
    function r2(e, t, r, i, n, o) {
        i = i || e2(e.doc, t.line);
        if (!n) {
            n = rW(e, i);
        }
        function l(t, l) {
            var a = rD(e, n, t, l ? "right" : "left", o);
            if (l) {
                a.left = a.right;
            } else {
                a.right = a.left;
            }
            return r4(e, i, a, r);
        }
        var a = eh(i, e.doc.direction), s = t.ch, u = t.sticky;
        if (s >= i.text.length) {
            s = i.text.length;
            u = "before";
        } else if (s <= 0) {
            s = 0;
            u = "after";
        }
        if (!a) {
            return l(u == "before" ? s - 1 : s, u == "before");
        }
        function f(e, t, r) {
            var i = a[t], n = i.level == 1;
            return l(r ? e - 1 : e, n != r);
        }
        var c = ef(a, s, u);
        var h = eu;
        var d = f(s, c, u == "before");
        if (h != null) {
            d.other = f(s, h, u != "before");
        }
        return d;
    }
    function rG(e, t) {
        var r = 0;
        t = tt(e.doc, t);
        if (!e.options.lineWrapping) {
            r = rQ(e.display) * t.ch;
        }
        var i = e2(e.doc, t.line);
        var n = t6(i) + r_(e.display);
        return {
            left: r,
            right: r,
            top: n,
            bottom: n + i.height
        };
    }
    function rU(e, t, r, i, n) {
        var o = e8(e, t, r);
        o.xRel = n;
        if (i) {
            o.outside = i;
        }
        return o;
    }
    function rV(e, t, r) {
        var i = e.doc;
        r += e.display.viewOffset;
        if (r < 0) {
            return rU(i.first, 0, null, -1, -1);
        }
        var n = eX(i, r), o = i.first + i.size - 1;
        if (n > o) {
            return rU(i.first + i.size - 1, e2(i, o).text.length, null, 1, 1);
        }
        if (t < 0) {
            t = 0;
        }
        var l = e2(i, n);
        for(;;){
            var a = rY(e, l, n, t, r);
            var s = t1(l, a.ch + (a.xRel > 0 || a.outside > 0 ? 1 : 0));
            if (!s) {
                return a;
            }
            var u = s.find(1);
            if (u.line == n) {
                return u;
            }
            l = e2(i, (n = u.line));
        }
    }
    function rK(e, t, r, i) {
        i -= r7(t);
        var n = t.text.length;
        var o = ea(function(t) {
            return (rD(e, r, t - 1).bottom <= i);
        }, n, 0);
        n = ea(function(t) {
            return rD(e, r, t).top > i;
        }, o, n);
        return {
            begin: o,
            end: n
        };
    }
    function rX(e, t, r, i) {
        if (!r) {
            r = rW(e, t);
        }
        var n = r4(e, t, rD(e, r, i), "line").top;
        return rK(e, t, r, n);
    }
    function rj(e, t, r, i) {
        return e.bottom <= r ? false : e.top > r ? true : (i ? e.left : e.right) > t;
    }
    function rY(e, t, r, i, n) {
        n -= t6(t);
        var o = rW(e, t);
        var l = r7(t);
        var a = 0, s = t.text.length, u = true;
        var f = eh(t, e.doc.direction);
        if (f) {
            var c = (e.options.lineWrapping ? r9 : r8)(e, t, r, o, f, i, n);
            u = c.level != 1;
            a = u ? c.from : c.to - 1;
            s = u ? c.to : c.from - 1;
        }
        var h = null, d = null;
        var p = ea(function(t) {
            var r = rD(e, o, t);
            r.top += l;
            r.bottom += l;
            if (!rj(r, i, n, false)) {
                return false;
            }
            if (r.top <= n && r.left <= i) {
                h = t;
                d = r;
            }
            return true;
        }, a, s);
        var v, g, m = false;
        if (d) {
            var $ = i - d.left < d.right - i, y = $ == u;
            p = h + (y ? 0 : 1);
            g = y ? "after" : "before";
            v = $ ? d.left : d.right;
        } else {
            if (!u && (p == s || p == a)) {
                p++;
            }
            g = p == 0 ? "after" : p == t.text.length ? "before" : rD(e, o, p - (u ? 1 : 0)).bottom + l <= n == u ? "after" : "before";
            var b = r2(e, e8(r, p, g), "line", t, o);
            v = b.left;
            m = n < b.top ? -1 : n >= b.bottom ? 1 : 0;
        }
        p = el(t.text, p, 1);
        return rU(r, p, g, m, i - v);
    }
    function r8(e, t, r, i, n, o, l) {
        var a = ea(function(a) {
            var s = n[a], u = s.level != 1;
            return rj(r2(e, e8(r, u ? s.to : s.from, u ? "before" : "after"), "line", t, i), o, l, true);
        }, 0, n.length - 1);
        var s = n[a];
        if (a > 0) {
            var u = s.level != 1;
            var f = r2(e, e8(r, u ? s.from : s.to, u ? "after" : "before"), "line", t, i);
            if (rj(f, o, l, true) && f.top > l) {
                s = n[a - 1];
            }
        }
        return s;
    }
    function r9(e, t, r, i, n, o, l) {
        var a = rK(e, t, i, l);
        var s = a.begin;
        var u = a.end;
        if (/\s/.test(t.text.charAt(u - 1))) {
            u--;
        }
        var f = null, c = null;
        for(var h = 0; h < n.length; h++){
            var d = n[h];
            if (d.from >= u || d.to <= s) {
                continue;
            }
            var p = d.level != 1;
            var v = rD(e, i, p ? Math.min(u, d.to) - 1 : Math.max(s, d.from)).right;
            var g = v < o ? o - v + 1e9 : v - o;
            if (!f || c > g) {
                f = d;
                c = g;
            }
        }
        if (!f) {
            f = n[n.length - 1];
        }
        if (f.from < s) {
            f = {
                from: s,
                to: f.to,
                level: f.level
            };
        }
        if (f.to > u) {
            f = {
                from: f.from,
                to: u,
                level: f.level
            };
        }
        return f;
    }
    var rq;
    function rZ(e) {
        if (e.cachedTextHeight != null) {
            return e.cachedTextHeight;
        }
        if (rq == null) {
            rq = T("pre", null, "CodeMirror-line-like");
            for(var t = 0; t < 49; ++t){
                rq.appendChild(document.createTextNode("x"));
                rq.appendChild(T("br"));
            }
            rq.appendChild(document.createTextNode("x"));
        }
        k(e.measure, rq);
        var r = rq.offsetHeight / 50;
        if (r > 3) {
            e.cachedTextHeight = r;
        }
        L(e.measure);
        return r || 1;
    }
    function rQ(e) {
        if (e.cachedCharWidth != null) {
            return e.cachedCharWidth;
        }
        var t = T("span", "xxxxxxxxxx");
        var r = T("pre", [
            t
        ], "CodeMirror-line-like");
        k(e.measure, r);
        var i = t.getBoundingClientRect(), n = (i.right - i.left) / 10;
        if (n > 2) {
            e.cachedCharWidth = n;
        }
        return n || 10;
    }
    function rJ(e) {
        var t = e.display, r = {}, i = {};
        var n = t.gutters.clientLeft;
        for(var o = t.gutters.firstChild, l = 0; o; o = o.nextSibling, ++l){
            var a = e.display.gutterSpecs[l].className;
            r[a] = o.offsetLeft + o.clientLeft + n;
            i[a] = o.clientWidth;
        }
        return {
            fixedPos: ie(t),
            gutterTotalWidth: t.gutters.offsetWidth,
            gutterLeft: r,
            gutterWidth: i,
            wrapperWidth: t.wrapper.clientWidth
        };
    }
    function ie(e) {
        return (e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left);
    }
    function it(e) {
        var t = rZ(e.display), r = e.options.lineWrapping;
        var i = r && Math.max(5, e.display.scroller.clientWidth / rQ(e.display) - 3);
        return function(n) {
            if (t7(e.doc, n)) {
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
            if (r) {
                return (o + (Math.ceil(n.text.length / i) || 1) * t);
            } else {
                return o + t;
            }
        };
    }
    function ir(e) {
        var t = e.doc, r = it(e);
        t.iter(function(e) {
            var t = r(e);
            if (t != e.height) {
                eV(e, t);
            }
        });
    }
    function ii(e, t, r, i) {
        var n = e.display;
        if (!r && eL(t).getAttribute("cm-not-content") == "true") {
            return null;
        }
        var o, l, a = n.lineSpace.getBoundingClientRect();
        try {
            o = t.clientX - a.left;
            l = t.clientY - a.top;
        } catch (s) {
            return null;
        }
        var u = rV(e, o, l), f;
        if (i && u.xRel > 0 && (f = e2(e.doc, u.line).text).length == u.ch) {
            var c = E(f, f.length, e.options.tabSize) - f.length;
            u = e8(u.line, Math.max(0, Math.round((o - rS(e.display).left) / rQ(e.display)) - c));
        }
        return u;
    }
    function io(e, t) {
        if (t >= e.display.viewTo) {
            return null;
        }
        t -= e.display.viewFrom;
        if (t < 0) {
            return null;
        }
        var r = e.display.view;
        for(var i = 0; i < r.length; i++){
            t -= r[i].size;
            if (t < 0) {
                return i;
            }
        }
    }
    function il(e, t, r, i) {
        if (t == null) {
            t = e.doc.first;
        }
        if (r == null) {
            r = e.doc.first + e.doc.size;
        }
        if (!i) {
            i = 0;
        }
        var n = e.display;
        if (i && r < n.viewTo && (n.updateLineNumbers == null || n.updateLineNumbers > t)) {
            n.updateLineNumbers = t;
        }
        e.curOp.viewChanged = true;
        if (t >= n.viewTo) {
            if (ty && t3(e.doc, t) < n.viewTo) {
                is(e);
            }
        } else if (r <= n.viewFrom) {
            if (ty && tB(e.doc, r + i) > n.viewFrom) {
                is(e);
            } else {
                n.viewFrom += i;
                n.viewTo += i;
            }
        } else if (t <= n.viewFrom && r >= n.viewTo) {
            is(e);
        } else if (t <= n.viewFrom) {
            var o = iu(e, r, r + i, 1);
            if (o) {
                n.view = n.view.slice(o.index);
                n.viewFrom = o.lineN;
                n.viewTo += i;
            } else {
                is(e);
            }
        } else if (r >= n.viewTo) {
            var l = iu(e, t, t, -1);
            if (l) {
                n.view = n.view.slice(0, l.index);
                n.viewTo = l.lineN;
            } else {
                is(e);
            }
        } else {
            var a = iu(e, t, t, -1);
            var s = iu(e, r, r + i, 1);
            if (a && s) {
                n.view = n.view.slice(0, a.index).concat(rt(e, a.lineN, s.lineN)).concat(n.view.slice(s.index));
                n.viewTo += i;
            } else {
                is(e);
            }
        }
        var u = n.externalMeasured;
        if (u) {
            if (r < u.lineN) {
                u.lineN += i;
            } else if (t < u.lineN + u.size) {
                n.externalMeasured = null;
            }
        }
    }
    function ia(e, t, r) {
        e.curOp.viewChanged = true;
        var i = e.display, n = e.display.externalMeasured;
        if (n && t >= n.lineN && t < n.lineN + n.size) {
            i.externalMeasured = null;
        }
        if (t < i.viewFrom || t >= i.viewTo) {
            return;
        }
        var o = i.view[io(e, t)];
        if (o.node == null) {
            return;
        }
        var l = o.changes || (o.changes = []);
        if (R(l, r) == -1) {
            l.push(r);
        }
    }
    function is(e) {
        e.display.viewFrom = e.display.viewTo = e.doc.first;
        e.display.view = [];
        e.display.viewOffset = 0;
    }
    function iu(e, t, r, i) {
        var n = io(e, t), o, l = e.display.view;
        if (!ty || r == e.doc.first + e.doc.size) {
            return {
                index: n,
                lineN: r
            };
        }
        var a = e.display.viewFrom;
        for(var s = 0; s < n; s++){
            a += l[s].size;
        }
        if (a != t) {
            if (i > 0) {
                if (n == l.length - 1) {
                    return null;
                }
                o = a + l[n].size - t;
                n++;
            } else {
                o = a - t;
            }
            t += o;
            r += o;
        }
        while(t3(e.doc, r) != r){
            if (n == (i < 0 ? 0 : l.length - 1)) {
                return null;
            }
            r += i * l[n - (i < 0 ? 1 : 0)].size;
            n += i;
        }
        return {
            index: n,
            lineN: r
        };
    }
    function ic(e, t, r) {
        var i = e.display, n = i.view;
        if (n.length == 0 || t >= i.viewTo || r <= i.viewFrom) {
            i.view = rt(e, t, r);
            i.viewFrom = t;
        } else {
            if (i.viewFrom > t) {
                i.view = rt(e, t, i.viewFrom).concat(i.view);
            } else if (i.viewFrom < t) {
                i.view = i.view.slice(io(e, t));
            }
            i.viewFrom = t;
            if (i.viewTo < r) {
                i.view = i.view.concat(rt(e, i.viewTo, r));
            } else if (i.viewTo > r) {
                i.view = i.view.slice(0, io(e, r));
            }
        }
        i.viewTo = r;
    }
    function ih(e) {
        var t = e.display.view, r = 0;
        for(var i = 0; i < t.length; i++){
            var n = t[i];
            if (!n.hidden && (!n.node || n.changes)) {
                ++r;
            }
        }
        return r;
    }
    function id(e) {
        e.display.input.showSelection(e.display.input.prepareSelection());
    }
    function ip(e, t) {
        if (t === void 0) t = true;
        var r = e.doc, i = {};
        var n = (i.cursors = document.createDocumentFragment());
        var o = (i.selection = document.createDocumentFragment());
        var l = e.options.$customCursor;
        if (l) {
            t = true;
        }
        for(var a = 0; a < r.sel.ranges.length; a++){
            if (!t && a == r.sel.primIndex) {
                continue;
            }
            var s = r.sel.ranges[a];
            if (s.from().line >= e.display.viewTo || s.to().line < e.display.viewFrom) {
                continue;
            }
            var u = s.empty();
            if (l) {
                var f = l(e, s);
                if (f) {
                    iv(e, f, n);
                }
            } else if (u || e.options.showCursorWhenSelecting) {
                iv(e, s.head, n);
            }
            if (!u) {
                im(e, s, o);
            }
        }
        return i;
    }
    function iv(e, t, r) {
        var i = r2(e, t, "div", null, null, !e.options.singleCursorHeightPerLine);
        var n = r.appendChild(T("div", "\u00a0", "CodeMirror-cursor"));
        n.style.left = i.left + "px";
        n.style.top = i.top + "px";
        n.style.height = Math.max(0, i.bottom - i.top) * e.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(e.getWrapperElement().className)) {
            var o = r5(e, t, "div", null, null);
            var l = o.right - o.left;
            n.style.width = (l > 0 ? l : e.defaultCharWidth()) + "px";
        }
        if (i.other) {
            var a = r.appendChild(T("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            a.style.display = "";
            a.style.left = i.other.left + "px";
            a.style.top = i.other.top + "px";
            a.style.height = (i.other.bottom - i.other.top) * 0.85 + "px";
        }
    }
    function ig(e, t) {
        return e.top - t.top || e.left - t.left;
    }
    function im(e, t, r) {
        var i = e.display, n = e.doc;
        var o = document.createDocumentFragment();
        var l = rS(e.display), a = l.left;
        var s = Math.max(i.sizerWidth, rk(e) - i.sizer.offsetLeft) - l.right;
        var u = n.direction == "ltr";
        function f(e, t, r, i) {
            if (t < 0) {
                t = 0;
            }
            t = Math.round(t);
            i = Math.round(i);
            o.appendChild(T("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px;\n                             top: " + t + "px; width: " + (r == null ? s - e : r) + "px;\n                             height: " + (i - t) + "px"));
        }
        function c(t, r, i) {
            var o = e2(n, t);
            var l = o.text.length;
            var c, h;
            function d(r, i) {
                return r5(e, e8(t, r), "div", o, i);
            }
            function p(t, r, i) {
                var n = rX(e, o, null, t);
                var l = (r == "ltr") == (i == "after") ? "left" : "right";
                var a = i == "after" ? n.begin : n.end - (/\s/.test(o.text.charAt(n.end - 1)) ? 2 : 1);
                return d(a, l)[l];
            }
            var v = eh(o, n.direction);
            es(v, r || 0, i == null ? l : i, function(e, t, n, o) {
                var g = n == "ltr";
                var m = d(e, g ? "left" : "right");
                var $ = d(t - 1, g ? "right" : "left");
                var y = r == null && e == 0, b = i == null && t == l;
                var x = o == 0, w = !v || o == v.length - 1;
                if ($.top - m.top <= 3) {
                    var _ = (u ? y : b) && x;
                    var C = (u ? b : y) && w;
                    var S = _ ? a : (g ? m : $).left;
                    var L = C ? s : (g ? $ : m).right;
                    f(S, m.top, L - S, m.bottom);
                } else {
                    var k, T, N, O;
                    if (g) {
                        k = u && y && x ? a : m.left;
                        T = u ? s : p(e, n, "before");
                        N = u ? a : p(t, n, "after");
                        O = u && b && w ? s : $.right;
                    } else {
                        k = !u ? a : p(e, n, "before");
                        T = !u && y && x ? s : m.right;
                        N = !u && b && w ? a : $.left;
                        O = !u ? s : p(t, n, "after");
                    }
                    f(k, m.top, T - k, m.bottom);
                    if (m.bottom < $.top) {
                        f(a, m.bottom, null, $.top);
                    }
                    f(N, $.top, O - N, $.bottom);
                }
                if (!c || ig(m, c) < 0) {
                    c = m;
                }
                if (ig($, c) < 0) {
                    c = $;
                }
                if (!h || ig(m, h) < 0) {
                    h = m;
                }
                if (ig($, h) < 0) {
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
            var g = tz(p) == tz(v);
            var m = c(h.line, h.ch, g ? p.text.length + 1 : null).end;
            var $ = c(d.line, g ? 0 : null, d.ch).start;
            if (g) {
                if (m.top < $.top - 2) {
                    f(m.right, m.top, null, m.bottom);
                    f(a, $.top, $.left, $.bottom);
                } else {
                    f(m.right, m.top, $.left - m.right, m.bottom);
                }
            }
            if (m.bottom < $.top) {
                f(a, m.bottom, null, $.top);
            }
        }
        r.appendChild(o);
    }
    function i$(e) {
        if (!e.state.focused) {
            return;
        }
        var t = e.display;
        clearInterval(t.blinker);
        var r = true;
        t.cursorDiv.style.visibility = "";
        if (e.options.cursorBlinkRate > 0) {
            t.blinker = setInterval(function() {
                if (!e.hasFocus()) {
                    iw(e);
                }
                t.cursorDiv.style.visibility = (r = !r) ? "" : "hidden";
            }, e.options.cursorBlinkRate);
        } else if (e.options.cursorBlinkRate < 0) {
            t.cursorDiv.style.visibility = "hidden";
        }
    }
    function iy(e) {
        if (!e.hasFocus()) {
            e.display.input.focus();
            if (!e.state.focused) {
                ix(e);
            }
        }
    }
    function ib(e) {
        e.state.delayingBlurEvent = true;
        setTimeout(function() {
            if (e.state.delayingBlurEvent) {
                e.state.delayingBlurEvent = false;
                if (e.state.focused) {
                    iw(e);
                }
            }
        }, 100);
    }
    function ix(e, t) {
        if (e.state.delayingBlurEvent && !e.state.draggingText) {
            e.state.delayingBlurEvent = false;
        }
        if (e.options.readOnly == "nocursor") {
            return;
        }
        if (!e.state.focused) {
            em(e, "focus", e, t);
            e.state.focused = true;
            W(e.display.wrapper, "CodeMirror-focused");
            if (!e.curOp && e.display.selForContextMenu != e.doc.sel) {
                e.display.input.reset();
                if (s) {
                    setTimeout(function() {
                        return e.display.input.reset(true);
                    }, 20);
                }
            }
            e.display.input.receivedFocus();
        }
        i$(e);
    }
    function iw(e, t) {
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
    function i_(e) {
        var t = e.display;
        var r = t.lineDiv.offsetTop;
        var i = Math.max(0, t.scroller.getBoundingClientRect().top);
        var n = t.lineDiv.getBoundingClientRect().top;
        var o = 0;
        for(var s = 0; s < t.view.length; s++){
            var u = t.view[s], f = e.options.lineWrapping;
            var c = void 0, h = 0;
            if (u.hidden) {
                continue;
            }
            n += u.line.height;
            if (l && a < 8) {
                var d = u.node.offsetTop + u.node.offsetHeight;
                c = d - r;
                r = d;
            } else {
                var p = u.node.getBoundingClientRect();
                c = p.bottom - p.top;
                if (!f && u.text.firstChild) {
                    h = u.text.firstChild.getBoundingClientRect().right - p.left - 1;
                }
            }
            var v = u.line.height - c;
            if (v > 0.005 || v < -0.005) {
                if (n < i) {
                    o -= v;
                }
                eV(u.line, c);
                iC(u.line);
                if (u.rest) {
                    for(var g = 0; g < u.rest.length; g++){
                        iC(u.rest[g]);
                    }
                }
            }
            if (h > e.display.sizerWidth) {
                var m = Math.ceil(h / rQ(e.display));
                if (m > e.display.maxLineLength) {
                    e.display.maxLineLength = m;
                    e.display.maxLine = u.line;
                    e.display.maxLineChanged = true;
                }
            }
        }
        if (Math.abs(o) > 2) {
            t.scroller.scrollTop += o;
        }
    }
    function iC(e) {
        if (e.widgets) {
            for(var t = 0; t < e.widgets.length; ++t){
                var r = e.widgets[t], i = r.node.parentNode;
                if (i) {
                    r.height = i.offsetHeight;
                }
            }
        }
    }
    function iS(e, t, r) {
        var i = r && r.top != null ? Math.max(0, r.top) : e.scroller.scrollTop;
        i = Math.floor(i - r_(e));
        var n = r && r.bottom != null ? r.bottom : i + e.wrapper.clientHeight;
        var o = eX(t, i), l = eX(t, n);
        if (r && r.ensure) {
            var a = r.ensure.from.line, s = r.ensure.to.line;
            if (a < o) {
                o = a;
                l = eX(t, t6(e2(t, a)) + e.wrapper.clientHeight);
            } else if (Math.min(s, t.lastLine()) >= l) {
                o = eX(t, t6(e2(t, s)) - e.wrapper.clientHeight);
                l = s;
            }
        }
        return {
            from: o,
            to: Math.max(l, o + 1)
        };
    }
    function iL(e, t) {
        if (e$(e, "scrollCursorIntoView")) {
            return;
        }
        var r = e.display, i = r.sizer.getBoundingClientRect(), n = null;
        if (t.top + i.top < 0) {
            n = true;
        } else if (t.bottom + i.top > (window.innerHeight || document.documentElement.clientHeight)) {
            n = false;
        }
        if (n != null && !p) {
            var o = T("div", "\u200b", null, "position: absolute;\n                         top: " + (t.top - r.viewOffset - r_(e.display)) + "px;\n                         height: " + (t.bottom - t.top + rL(e) + r.barHeight) + "px;\n                         left: " + t.left + "px; width: " + Math.max(2, t.right - t.left) + "px;");
            e.display.lineSpace.appendChild(o);
            o.scrollIntoView(n);
            e.display.lineSpace.removeChild(o);
        }
    }
    function ik(e, t, r, i) {
        if (i == null) {
            i = 0;
        }
        var n;
        if (!e.options.lineWrapping && t == r) {
            r = t.sticky == "before" ? e8(t.line, t.ch + 1, "before") : t;
            t = t.ch ? e8(t.line, t.sticky == "before" ? t.ch - 1 : t.ch, "after") : t;
        }
        for(var o = 0; o < 5; o++){
            var l = false;
            var a = r2(e, t);
            var s = !r || r == t ? a : r2(e, r);
            n = {
                left: Math.min(a.left, s.left),
                top: Math.min(a.top, s.top) - i,
                right: Math.max(a.left, s.left),
                bottom: Math.max(a.bottom, s.bottom) + i
            };
            var u = iN(e, n);
            var f = e.doc.scrollTop, c = e.doc.scrollLeft;
            if (u.scrollTop != null) {
                iH(e, u.scrollTop);
                if (Math.abs(e.doc.scrollTop - f) > 1) {
                    l = true;
                }
            }
            if (u.scrollLeft != null) {
                iP(e, u.scrollLeft);
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
    function iT(e, t) {
        var r = iN(e, t);
        if (r.scrollTop != null) {
            iH(e, r.scrollTop);
        }
        if (r.scrollLeft != null) {
            iP(e, r.scrollLeft);
        }
    }
    function iN(e, t) {
        var r = e.display, i = rZ(e.display);
        if (t.top < 0) {
            t.top = 0;
        }
        var n = e.curOp && e.curOp.scrollTop != null ? e.curOp.scrollTop : r.scroller.scrollTop;
        var o = rT(e), l = {};
        if (t.bottom - t.top > o) {
            t.bottom = t.top + o;
        }
        var a = e.doc.height + rC(r);
        var s = t.top < i, u = t.bottom > a - i;
        if (t.top < n) {
            l.scrollTop = s ? 0 : t.top;
        } else if (t.bottom > n + o) {
            var f = Math.min(t.top, (u ? a : t.bottom) - o);
            if (f != n) {
                l.scrollTop = f;
            }
        }
        var c = e.options.fixedGutter ? 0 : r.gutters.offsetWidth;
        var h = e.curOp && e.curOp.scrollLeft != null ? e.curOp.scrollLeft : r.scroller.scrollLeft - c;
        var d = rk(e) - r.gutters.offsetWidth;
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
    function iO(e, t) {
        if (t == null) {
            return;
        }
        iW(e);
        e.curOp.scrollTop = (e.curOp.scrollTop == null ? e.doc.scrollTop : e.curOp.scrollTop) + t;
    }
    function iM(e) {
        iW(e);
        var t = e.getCursor();
        e.curOp.scrollToPos = {
            from: t,
            to: t,
            margin: e.options.cursorScrollMargin
        };
    }
    function iA(e, t, r) {
        if (t != null || r != null) {
            iW(e);
        }
        if (t != null) {
            e.curOp.scrollLeft = t;
        }
        if (r != null) {
            e.curOp.scrollTop = r;
        }
    }
    function i0(e, t) {
        iW(e);
        e.curOp.scrollToPos = t;
    }
    function iW(e) {
        var t = e.curOp.scrollToPos;
        if (t) {
            e.curOp.scrollToPos = null;
            var r = rG(e, t.from), i = rG(e, t.to);
            iD(e, r, i, t.margin);
        }
    }
    function iD(e, t, r, i) {
        var n = iN(e, {
            left: Math.min(t.left, r.left),
            top: Math.min(t.top, r.top) - i,
            right: Math.max(t.right, r.right),
            bottom: Math.max(t.bottom, r.bottom) + i
        });
        iA(e, n.scrollLeft, n.scrollTop);
    }
    function iH(e, t) {
        if (Math.abs(e.doc.scrollTop - t) < 2) {
            return;
        }
        if (!r) {
            ni(e, {
                top: t
            });
        }
        iF(e, t, true);
        if (r) {
            ni(e);
        }
        i9(e, 100);
    }
    function iF(e, t, r) {
        t = Math.max(0, Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t));
        if (e.display.scroller.scrollTop == t && !r) {
            return;
        }
        e.doc.scrollTop = t;
        e.display.scrollbars.setScrollTop(t);
        if (e.display.scroller.scrollTop != t) {
            e.display.scroller.scrollTop = t;
        }
    }
    function iP(e, t, r, i) {
        t = Math.max(0, Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth));
        if ((r ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !i) {
            return;
        }
        e.doc.scrollLeft = t;
        na(e);
        if (e.display.scroller.scrollLeft != t) {
            e.display.scroller.scrollLeft = t;
        }
        e.display.scrollbars.setScrollLeft(t);
    }
    function i1(e) {
        var t = e.display, r = t.gutters.offsetWidth;
        var i = Math.round(e.doc.height + rC(e.display));
        return {
            clientHeight: t.scroller.clientHeight,
            viewHeight: t.wrapper.clientHeight,
            scrollWidth: t.scroller.scrollWidth,
            clientWidth: t.scroller.clientWidth,
            viewWidth: t.wrapper.clientWidth,
            barLeft: e.options.fixedGutter ? r : 0,
            docHeight: i,
            scrollHeight: i + rL(e) + t.barHeight,
            nativeBarWidth: t.nativeBarWidth,
            gutterWidth: r
        };
    }
    var iE = function(e, t, r) {
        this.cm = r;
        var i = (this.vert = T("div", [
            T("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar"));
        var n = (this.horiz = T("div", [
            T("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar"));
        i.tabIndex = n.tabIndex = -1;
        e(i);
        e(n);
        ep(i, "scroll", function() {
            if (i.clientHeight) {
                t(i.scrollTop, "vertical");
            }
        });
        ep(n, "scroll", function() {
            if (n.clientWidth) {
                t(n.scrollLeft, "horizontal");
            }
        });
        this.checkedZeroWidth = false;
        if (l && a < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
    };
    iE.prototype.update = function(e) {
        var t = e.scrollWidth > e.clientWidth + 1;
        var r = e.scrollHeight > e.clientHeight + 1;
        var i = e.nativeBarWidth;
        if (r) {
            this.vert.style.display = "block";
            this.vert.style.bottom = t ? i + "px" : "0";
            var n = e.viewHeight - (t ? i : 0);
            this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + n) + "px";
        } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
        }
        if (t) {
            this.horiz.style.display = "block";
            this.horiz.style.right = r ? i + "px" : "0";
            this.horiz.style.left = e.barLeft + "px";
            var o = e.viewWidth - e.barLeft - (r ? i : 0);
            this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + o) + "px";
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && e.clientHeight > 0) {
            if (i == 0) {
                this.zeroWidthHack();
            }
            this.checkedZeroWidth = true;
        }
        return {
            right: r ? i : 0,
            bottom: t ? i : 0
        };
    };
    iE.prototype.setScrollLeft = function(e) {
        if (this.horiz.scrollLeft != e) {
            this.horiz.scrollLeft = e;
        }
        if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
    };
    iE.prototype.setScrollTop = function(e) {
        if (this.vert.scrollTop != e) {
            this.vert.scrollTop = e;
        }
        if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
    };
    iE.prototype.zeroWidthHack = function() {
        var e = $ && !d ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = e;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new z();
        this.disableVert = new z();
    };
    iE.prototype.enableZeroWidthBar = function(e, t, r) {
        e.style.pointerEvents = "auto";
        function i() {
            var n = e.getBoundingClientRect();
            var o = r == "vert" ? document.elementFromPoint(n.right - 1, (n.top + n.bottom) / 2) : document.elementFromPoint((n.right + n.left) / 2, n.bottom - 1);
            if (o != e) {
                e.style.pointerEvents = "none";
            } else {
                t.set(1000, i);
            }
        }
        t.set(1000, i);
    };
    iE.prototype.clear = function() {
        var e = this.horiz.parentNode;
        e.removeChild(this.horiz);
        e.removeChild(this.vert);
    };
    var iz = function() {};
    iz.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    };
    iz.prototype.setScrollLeft = function() {};
    iz.prototype.setScrollTop = function() {};
    iz.prototype.clear = function() {};
    function iR(e, t) {
        if (!t) {
            t = i1(e);
        }
        var r = e.display.barWidth, i = e.display.barHeight;
        iI(e, t);
        for(var n = 0; (n < 4 && r != e.display.barWidth) || i != e.display.barHeight; n++){
            if (r != e.display.barWidth && e.options.lineWrapping) {
                i_(e);
            }
            iI(e, i1(e));
            r = e.display.barWidth;
            i = e.display.barHeight;
        }
    }
    function iI(e, t) {
        var r = e.display;
        var i = r.scrollbars.update(t);
        r.sizer.style.paddingRight = (r.barWidth = i.right) + "px";
        r.sizer.style.paddingBottom = (r.barHeight = i.bottom) + "px";
        r.heightForcer.style.borderBottom = i.bottom + "px solid transparent";
        if (i.right && i.bottom) {
            r.scrollbarFiller.style.display = "block";
            r.scrollbarFiller.style.height = i.bottom + "px";
            r.scrollbarFiller.style.width = i.right + "px";
        } else {
            r.scrollbarFiller.style.display = "";
        }
        if (i.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter) {
            r.gutterFiller.style.display = "block";
            r.gutterFiller.style.height = i.bottom + "px";
            r.gutterFiller.style.width = t.gutterWidth + "px";
        } else {
            r.gutterFiller.style.display = "";
        }
    }
    var i3 = {
        native: iE,
        null: iz
    };
    function iB(e) {
        if (e.display.scrollbars) {
            e.display.scrollbars.clear();
            if (e.display.scrollbars.addClass) {
                S(e.display.wrapper, e.display.scrollbars.addClass);
            }
        }
        e.display.scrollbars = new i3[e.options.scrollbarStyle](function(t) {
            e.display.wrapper.insertBefore(t, e.display.scrollbarFiller);
            ep(t, "mousedown", function() {
                if (e.state.focused) {
                    setTimeout(function() {
                        return e.display.input.focus();
                    }, 0);
                }
            });
            t.setAttribute("cm-not-content", "true");
        }, function(t, r) {
            if (r == "horizontal") {
                iP(e, t);
            } else {
                iH(e, t);
            }
        }, e);
        if (e.display.scrollbars.addClass) {
            W(e.display.wrapper, e.display.scrollbars.addClass);
        }
    }
    var i7 = 0;
    function i4(e) {
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
            id: ++i7,
            markArrays: null
        };
        ri(e.curOp);
    }
    function i6(e) {
        var t = e.curOp;
        if (t) {
            ro(t, function(e) {
                for(var t = 0; t < e.ops.length; t++){
                    e.ops[t].cm.curOp = null;
                }
                i5(e);
            });
        }
    }
    function i5(e) {
        var t = e.ops;
        for(var r = 0; r < t.length; r++){
            i2(t[r]);
        }
        for(var i = 0; i < t.length; i++){
            iG(t[i]);
        }
        for(var n = 0; n < t.length; n++){
            iU(t[n]);
        }
        for(var o = 0; o < t.length; o++){
            iV(t[o]);
        }
        for(var l = 0; l < t.length; l++){
            iK(t[l]);
        }
    }
    function i2(e) {
        var t = e.cm, r = t.display;
        iQ(t);
        if (e.updateMaxLine) {
            t2(t);
        }
        e.mustUpdate = e.viewChanged || e.forceUpdate || e.scrollTop != null || (e.scrollToPos && (e.scrollToPos.from.line < r.viewFrom || e.scrollToPos.to.line >= r.viewTo)) || (r.maxLineChanged && t.options.lineWrapping);
        e.update = e.mustUpdate && new iZ(t, e.mustUpdate && {
            top: e.scrollTop,
            ensure: e.scrollToPos
        }, e.forceUpdate);
    }
    function iG(e) {
        e.updatedDisplay = e.mustUpdate && nt(e.cm, e.update);
    }
    function iU(e) {
        var t = e.cm, r = t.display;
        if (e.updatedDisplay) {
            i_(t);
        }
        e.barMeasure = i1(t);
        if (r.maxLineChanged && !t.options.lineWrapping) {
            e.adjustWidthTo = rA(t, r.maxLine, r.maxLine.text.length).left + 3;
            t.display.sizerWidth = e.adjustWidthTo;
            e.barMeasure.scrollWidth = Math.max(r.scroller.clientWidth, r.sizer.offsetLeft + e.adjustWidthTo + rL(t) + t.display.barWidth);
            e.maxScrollLeft = Math.max(0, r.sizer.offsetLeft + e.adjustWidthTo - rk(t));
        }
        if (e.updatedDisplay || e.selectionChanged) {
            e.preparedSelection = r.input.prepareSelection();
        }
    }
    function iV(e) {
        var t = e.cm;
        if (e.adjustWidthTo != null) {
            t.display.sizer.style.minWidth = e.adjustWidthTo + "px";
            if (e.maxScrollLeft < t.doc.scrollLeft) {
                iP(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), true);
            }
            t.display.maxLineChanged = false;
        }
        var r = e.focus && e.focus == A();
        if (e.preparedSelection) {
            t.display.input.showSelection(e.preparedSelection, r);
        }
        if (e.updatedDisplay || e.startHeight != t.doc.height) {
            iR(t, e.barMeasure);
        }
        if (e.updatedDisplay) {
            nl(t, e.barMeasure);
        }
        if (e.selectionChanged) {
            i$(t);
        }
        if (t.state.focused && e.updateInput) {
            t.display.input.reset(e.typing);
        }
        if (r) {
            iy(e.cm);
        }
    }
    function iK(e) {
        var t = e.cm, r = t.display, i = t.doc;
        if (e.updatedDisplay) {
            nr(t, e.update);
        }
        if (r.wheelStartX != null && (e.scrollTop != null || e.scrollLeft != null || e.scrollToPos)) {
            r.wheelStartX = r.wheelStartY = null;
        }
        if (e.scrollTop != null) {
            iF(t, e.scrollTop, e.forceScroll);
        }
        if (e.scrollLeft != null) {
            iP(t, e.scrollLeft, true, true);
        }
        if (e.scrollToPos) {
            var n = ik(t, tt(i, e.scrollToPos.from), tt(i, e.scrollToPos.to), e.scrollToPos.margin);
            iL(t, n);
        }
        var o = e.maybeHiddenMarkers, l = e.maybeUnhiddenMarkers;
        if (o) {
            for(var a = 0; a < o.length; ++a){
                if (!o[a].lines.length) {
                    em(o[a], "hide");
                }
            }
        }
        if (l) {
            for(var s = 0; s < l.length; ++s){
                if (l[s].lines.length) {
                    em(l[s], "unhide");
                }
            }
        }
        if (r.wrapper.offsetHeight) {
            i.scrollTop = t.display.scroller.scrollTop;
        }
        if (e.changeObjs) {
            em(t, "changes", t, e.changeObjs);
        }
        if (e.update) {
            e.update.finish();
        }
    }
    function iX(e, t) {
        if (e.curOp) {
            return t();
        }
        i4(e);
        try {
            return t();
        } finally{
            i6(e);
        }
    }
    function ij(e, t) {
        return function() {
            if (e.curOp) {
                return t.apply(e, arguments);
            }
            i4(e);
            try {
                return t.apply(e, arguments);
            } finally{
                i6(e);
            }
        };
    }
    function iY(e) {
        return function() {
            if (this.curOp) {
                return e.apply(this, arguments);
            }
            i4(this);
            try {
                return e.apply(this, arguments);
            } finally{
                i6(this);
            }
        };
    }
    function i8(e) {
        return function() {
            var t = this.cm;
            if (!t || t.curOp) {
                return e.apply(this, arguments);
            }
            i4(t);
            try {
                return e.apply(this, arguments);
            } finally{
                i6(t);
            }
        };
    }
    function i9(e, t) {
        if (e.doc.highlightFrontier < e.display.viewTo) {
            e.state.highlight.set(t, F(iq, e));
        }
    }
    function iq(e) {
        var t = e.doc;
        if (t.highlightFrontier >= e.display.viewTo) {
            return;
        }
        var r = +new Date() + e.options.workTime;
        var i = ts(e, t.highlightFrontier);
        var n = [];
        t.iter(i.line, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
            if (i.line >= e.display.viewFrom) {
                var l = o.styles;
                var a = o.text.length > e.options.maxHighlightLength ? e7(t.mode, i.state) : null;
                var s = tl(e, o, i, true);
                if (a) {
                    i.state = a;
                }
                o.styles = s.styles;
                var u = o.styleClasses, f = s.classes;
                if (f) {
                    o.styleClasses = f;
                } else if (u) {
                    o.styleClasses = null;
                }
                var c = !l || l.length != o.styles.length || (u != f && (!u || !f || u.bgClass != f.bgClass || u.textClass != f.textClass));
                for(var h = 0; !c && h < l.length; ++h){
                    c = l[h] != o.styles[h];
                }
                if (c) {
                    n.push(i.line);
                }
                o.stateAfter = i.save();
                i.nextLine();
            } else {
                if (o.text.length <= e.options.maxHighlightLength) {
                    tu(e, o.text, i);
                }
                o.stateAfter = i.line % 5 == 0 ? i.save() : null;
                i.nextLine();
            }
            if (+new Date() > r) {
                i9(e, e.options.workDelay);
                return true;
            }
        });
        t.highlightFrontier = i.line;
        t.modeFrontier = Math.max(t.modeFrontier, i.line);
        if (n.length) {
            iX(e, function() {
                for(var t = 0; t < n.length; t++){
                    ia(e, n[t], "text");
                }
            });
        }
    }
    var iZ = function(e, t, r) {
        var i = e.display;
        this.viewport = t;
        this.visible = iS(i, e.doc, t);
        this.editorIsHidden = !i.wrapper.offsetWidth;
        this.wrapperHeight = i.wrapper.clientHeight;
        this.wrapperWidth = i.wrapper.clientWidth;
        this.oldDisplayWidth = rk(e);
        this.force = r;
        this.dims = rJ(e);
        this.events = [];
    };
    iZ.prototype.signal = function(e, t) {
        if (eb(e, t)) {
            this.events.push(arguments);
        }
    };
    iZ.prototype.finish = function() {
        for(var e = 0; e < this.events.length; e++){
            em.apply(null, this.events[e]);
        }
    };
    function iQ(e) {
        var t = e.display;
        if (!t.scrollbarsClipped && t.scroller.offsetWidth) {
            t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth;
            t.heightForcer.style.height = rL(e) + "px";
            t.sizer.style.marginBottom = -t.nativeBarWidth + "px";
            t.sizer.style.borderRightWidth = rL(e) + "px";
            t.scrollbarsClipped = true;
        }
    }
    function iJ(e) {
        if (e.hasFocus()) {
            return null;
        }
        var t = A();
        if (!t || !M(e.display.lineDiv, t)) {
            return null;
        }
        var r = {
            activeElt: t
        };
        if (window.getSelection) {
            var i = window.getSelection();
            if (i.anchorNode && i.extend && M(e.display.lineDiv, i.anchorNode)) {
                r.anchorNode = i.anchorNode;
                r.anchorOffset = i.anchorOffset;
                r.focusNode = i.focusNode;
                r.focusOffset = i.focusOffset;
            }
        }
        return r;
    }
    function ne(e) {
        if (!e || !e.activeElt || e.activeElt == A()) {
            return;
        }
        e.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) && e.anchorNode && M(document.body, e.anchorNode) && M(document.body, e.focusNode)) {
            var t = window.getSelection(), r = document.createRange();
            r.setEnd(e.anchorNode, e.anchorOffset);
            r.collapse(false);
            t.removeAllRanges();
            t.addRange(r);
            t.extend(e.focusNode, e.focusOffset);
        }
    }
    function nt(e, t) {
        var r = e.display, i = e.doc;
        if (t.editorIsHidden) {
            is(e);
            return false;
        }
        if (!t.force && t.visible.from >= r.viewFrom && t.visible.to <= r.viewTo && (r.updateLineNumbers == null || r.updateLineNumbers >= r.viewTo) && r.renderedView == r.view && ih(e) == 0) {
            return false;
        }
        if (ns(e)) {
            is(e);
            t.dims = rJ(e);
        }
        var n = i.first + i.size;
        var o = Math.max(t.visible.from - e.options.viewportMargin, i.first);
        var l = Math.min(n, t.visible.to + e.options.viewportMargin);
        if (r.viewFrom < o && o - r.viewFrom < 20) {
            o = Math.max(i.first, r.viewFrom);
        }
        if (r.viewTo > l && r.viewTo - l < 20) {
            l = Math.min(n, r.viewTo);
        }
        if (ty) {
            o = t3(e.doc, o);
            l = tB(e.doc, l);
        }
        var a = o != r.viewFrom || l != r.viewTo || r.lastWrapHeight != t.wrapperHeight || r.lastWrapWidth != t.wrapperWidth;
        ic(e, o, l);
        r.viewOffset = t6(e2(e.doc, r.viewFrom));
        e.display.mover.style.top = r.viewOffset + "px";
        var s = ih(e);
        if (!a && s == 0 && !t.force && r.renderedView == r.view && (r.updateLineNumbers == null || r.updateLineNumbers >= r.viewTo)) {
            return false;
        }
        var u = iJ(e);
        if (s > 4) {
            r.lineDiv.style.display = "none";
        }
        nn(e, r.updateLineNumbers, t.dims);
        if (s > 4) {
            r.lineDiv.style.display = "";
        }
        r.renderedView = r.view;
        ne(u);
        L(r.cursorDiv);
        L(r.selectionDiv);
        r.gutters.style.height = r.sizer.style.minHeight = 0;
        if (a) {
            r.lastWrapHeight = t.wrapperHeight;
            r.lastWrapWidth = t.wrapperWidth;
            i9(e, 400);
        }
        r.updateLineNumbers = null;
        return true;
    }
    function nr(e, t) {
        var r = t.viewport;
        for(var i = true;; i = false){
            if (!i || !e.options.lineWrapping || t.oldDisplayWidth == rk(e)) {
                if (r && r.top != null) {
                    r = {
                        top: Math.min(e.doc.height + rC(e.display) - rT(e), r.top)
                    };
                }
                t.visible = iS(e.display, e.doc, r);
                if (t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo) {
                    break;
                }
            } else if (i) {
                t.visible = iS(e.display, e.doc, r);
            }
            if (!nt(e, t)) {
                break;
            }
            i_(e);
            var n = i1(e);
            id(e);
            iR(e, n);
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
    function ni(e, t) {
        var r = new iZ(e, t);
        if (nt(e, r)) {
            i_(e);
            nr(e, r);
            var i = i1(e);
            id(e);
            iR(e, i);
            nl(e, i);
            r.finish();
        }
    }
    function nn(e, t, r) {
        var i = e.display, n = e.options.lineNumbers;
        var o = i.lineDiv, l = o.firstChild;
        function a(t) {
            var r = t.nextSibling;
            if (s && $ && e.display.currentWheelTarget == t) {
                t.style.display = "none";
            } else {
                t.parentNode.removeChild(t);
            }
            return r;
        }
        var u = i.view, f = i.viewFrom;
        for(var c = 0; c < u.length; c++){
            var h = u[c];
            if (h.hidden) ;
            else if (!h.node || h.node.parentNode != o) {
                var d = rm(e, h, f, r);
                o.insertBefore(d, l);
            } else {
                while(l != h.node){
                    l = a(l);
                }
                var p = n && t != null && t <= f && h.lineNumber;
                if (h.changes) {
                    if (R(h.changes, "gutter") > -1) {
                        p = false;
                    }
                    ru(e, h, f, r);
                }
                if (p) {
                    L(h.lineNumber);
                    h.lineNumber.appendChild(document.createTextNode(eY(e.options, f)));
                }
                l = h.node.nextSibling;
            }
            f += h.size;
        }
        while(l){
            l = a(l);
        }
    }
    function no(e) {
        var t = e.gutters.offsetWidth;
        e.sizer.style.marginLeft = t + "px";
        ra(e, "gutterChanged", e);
    }
    function nl(e, t) {
        e.display.sizer.style.minHeight = t.docHeight + "px";
        e.display.heightForcer.style.top = t.docHeight + "px";
        e.display.gutters.style.height = t.docHeight + e.display.barHeight + rL(e) + "px";
    }
    function na(e) {
        var t = e.display, r = t.view;
        if (!t.alignWidgets && (!t.gutters.firstChild || !e.options.fixedGutter)) {
            return;
        }
        var i = ie(t) - t.scroller.scrollLeft + e.doc.scrollLeft;
        var n = t.gutters.offsetWidth, o = i + "px";
        for(var l = 0; l < r.length; l++){
            if (!r[l].hidden) {
                if (e.options.fixedGutter) {
                    if (r[l].gutter) {
                        r[l].gutter.style.left = o;
                    }
                    if (r[l].gutterBackground) {
                        r[l].gutterBackground.style.left = o;
                    }
                }
                var a = r[l].alignable;
                if (a) {
                    for(var s = 0; s < a.length; s++){
                        a[s].style.left = o;
                    }
                }
            }
        }
        if (e.options.fixedGutter) {
            t.gutters.style.left = i + n + "px";
        }
    }
    function ns(e) {
        if (!e.options.lineNumbers) {
            return false;
        }
        var t = e.doc, r = eY(e.options, t.first + t.size - 1), i = e.display;
        if (r.length != i.lineNumChars) {
            var n = i.measure.appendChild(T("div", [
                T("div", r)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var o = n.firstChild.offsetWidth, l = n.offsetWidth - o;
            i.lineGutter.style.width = "";
            i.lineNumInnerWidth = Math.max(o, i.lineGutter.offsetWidth - l) + 1;
            i.lineNumWidth = i.lineNumInnerWidth + l;
            i.lineNumChars = i.lineNumInnerWidth ? r.length : -1;
            i.lineGutter.style.width = i.lineNumWidth + "px";
            no(e.display);
            return true;
        }
        return false;
    }
    function nu(e, t) {
        var r = [], i = false;
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
                    i = true;
                }
            }
            r.push({
                className: o,
                style: l
            });
        }
        if (t && !i) {
            r.push({
                className: "CodeMirror-linenumbers",
                style: null
            });
        }
        return r;
    }
    function nf(e) {
        var t = e.gutters, r = e.gutterSpecs;
        L(t);
        e.lineGutter = null;
        for(var i = 0; i < r.length; ++i){
            var n = r[i];
            var o = n.className;
            var l = n.style;
            var a = t.appendChild(T("div", null, "CodeMirror-gutter " + o));
            if (l) {
                a.style.cssText = l;
            }
            if (o == "CodeMirror-linenumbers") {
                e.lineGutter = a;
                a.style.width = (e.lineNumWidth || 1) + "px";
            }
        }
        t.style.display = r.length ? "" : "none";
        no(e);
    }
    function nc(e) {
        nf(e.display);
        il(e);
        na(e);
    }
    function nh(e, t, i, n) {
        var o = this;
        this.input = i;
        o.scrollbarFiller = T("div", null, "CodeMirror-scrollbar-filler");
        o.scrollbarFiller.setAttribute("cm-not-content", "true");
        o.gutterFiller = T("div", null, "CodeMirror-gutter-filler");
        o.gutterFiller.setAttribute("cm-not-content", "true");
        o.lineDiv = N("div", null, "CodeMirror-code");
        o.selectionDiv = T("div", null, null, "position: relative; z-index: 1");
        o.cursorDiv = T("div", null, "CodeMirror-cursors");
        o.measure = T("div", null, "CodeMirror-measure");
        o.lineMeasure = T("div", null, "CodeMirror-measure");
        o.lineSpace = N("div", [
            o.measure,
            o.lineMeasure,
            o.selectionDiv,
            o.cursorDiv,
            o.lineDiv
        ], null, "position: relative; outline: none");
        var u = N("div", [
            o.lineSpace
        ], "CodeMirror-lines");
        o.mover = T("div", [
            u
        ], null, "position: relative");
        o.sizer = T("div", [
            o.mover
        ], "CodeMirror-sizer");
        o.sizerWidth = null;
        o.heightForcer = T("div", null, null, "position: absolute; height: " + I + "px; width: 1px;");
        o.gutters = T("div", null, "CodeMirror-gutters");
        o.lineGutter = null;
        o.scroller = T("div", [
            o.sizer,
            o.heightForcer,
            o.gutters
        ], "CodeMirror-scroll");
        o.scroller.setAttribute("tabIndex", "-1");
        o.wrapper = T("div", [
            o.scrollbarFiller,
            o.gutterFiller,
            o.scroller
        ], "CodeMirror");
        o.wrapper.setAttribute("translate", "no");
        if (l && a < 8) {
            o.gutters.style.zIndex = -1;
            o.scroller.style.paddingRight = 0;
        }
        if (!s && !(r && m)) {
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
        o.gutterSpecs = nu(n.gutters, n.lineNumbers);
        nf(o);
        i.init(o);
    }
    var nd = 0, np = null;
    if (l) {
        np = -0.53;
    } else if (r) {
        np = 15;
    } else if (f) {
        np = -0.7;
    } else if (h) {
        np = -1 / 3;
    }
    function nv(e) {
        var t = e.wheelDeltaX, r = e.wheelDeltaY;
        if (t == null && e.detail && e.axis == e.HORIZONTAL_AXIS) {
            t = e.detail;
        }
        if (r == null && e.detail && e.axis == e.VERTICAL_AXIS) {
            r = e.detail;
        } else if (r == null) {
            r = e.wheelDelta;
        }
        return {
            x: t,
            y: r
        };
    }
    function ng(e) {
        var t = nv(e);
        t.x *= np;
        t.y *= np;
        return t;
    }
    function nm(e, t) {
        var i = nv(t), n = i.x, o = i.y;
        var l = np;
        if (t.deltaMode === 0) {
            n = t.deltaX;
            o = t.deltaY;
            l = 1;
        }
        var a = e.display, u = a.scroller;
        var f = u.scrollWidth > u.clientWidth;
        var h = u.scrollHeight > u.clientHeight;
        if (!((n && f) || (o && h))) {
            return;
        }
        if (o && $ && s) {
            outer: for(var d = t.target, p = a.view; d != u; d = d.parentNode){
                for(var v = 0; v < p.length; v++){
                    if (p[v].node == d) {
                        e.display.currentWheelTarget = d;
                        break outer;
                    }
                }
            }
        }
        if (n && !r && !c && l != null) {
            if (o && h) {
                iH(e, Math.max(0, u.scrollTop + o * l));
            }
            iP(e, Math.max(0, u.scrollLeft + n * l));
            if (!o || (o && h)) {
                ew(t);
            }
            a.wheelStartX = null;
            return;
        }
        if (o && l != null) {
            var g = o * l;
            var m = e.doc.scrollTop, y = m + a.wrapper.clientHeight;
            if (g < 0) {
                m = Math.max(0, m + g - 50);
            } else {
                y = Math.min(e.doc.height, y + g + 50);
            }
            ni(e, {
                top: m,
                bottom: y
            });
        }
        if (nd < 20 && t.deltaMode !== 0) {
            if (a.wheelStartX == null) {
                a.wheelStartX = u.scrollLeft;
                a.wheelStartY = u.scrollTop;
                a.wheelDX = n;
                a.wheelDY = o;
                setTimeout(function() {
                    if (a.wheelStartX == null) {
                        return;
                    }
                    var e = u.scrollLeft - a.wheelStartX;
                    var t = u.scrollTop - a.wheelStartY;
                    var r = (t && a.wheelDY && t / a.wheelDY) || (e && a.wheelDX && e / a.wheelDX);
                    a.wheelStartX = a.wheelStartY = null;
                    if (!r) {
                        return;
                    }
                    np = (np * nd + r) / (nd + 1);
                    ++nd;
                }, 200);
            } else {
                a.wheelDX += n;
                a.wheelDY += o;
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
            var r = this.ranges[t], i = e.ranges[t];
            if (!eq(r.anchor, i.anchor) || !eq(r.head, i.head)) {
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
        for(var r = 0; r < this.ranges.length; r++){
            var i = this.ranges[r];
            if (e9(t, i.from()) >= 0 && e9(e, i.to()) <= 0) {
                return r;
            }
        }
        return -1;
    };
    var ny = function(e, t) {
        this.anchor = e;
        this.head = t;
    };
    ny.prototype.from = function() {
        return eJ(this.anchor, this.head);
    };
    ny.prototype.to = function() {
        return eQ(this.anchor, this.head);
    };
    ny.prototype.empty = function() {
        return (this.head.line == this.anchor.line && this.head.ch == this.anchor.ch);
    };
    function nb(e, t, r) {
        var i = e && e.options.selectionsMayTouch;
        var n = t[r];
        t.sort(function(e, t) {
            return e9(e.from(), t.from());
        });
        r = R(t, n);
        for(var o = 1; o < t.length; o++){
            var l = t[o], a = t[o - 1];
            var s = e9(a.to(), l.from());
            if (i && !l.empty() ? s > 0 : s >= 0) {
                var u = eJ(a.from(), l.from()), f = eQ(a.to(), l.to());
                var c = a.empty() ? l.from() == l.head : a.from() == a.head;
                if (o <= r) {
                    --r;
                }
                t.splice(--o, 2, new ny(c ? f : u, c ? u : f));
            }
        }
        return new n$(t, r);
    }
    function nx(e, t) {
        return new n$([
            new ny(e, t || e)
        ], 0);
    }
    function nw(e) {
        if (!e.text) {
            return e.to;
        }
        return e8(e.from.line + e.text.length - 1, Y(e.text).length + (e.text.length == 1 ? e.from.ch : 0));
    }
    function n_(e, t) {
        if (e9(e, t.from) < 0) {
            return e;
        }
        if (e9(e, t.to) <= 0) {
            return nw(t);
        }
        var r = e.line + t.text.length - (t.to.line - t.from.line) - 1, i = e.ch;
        if (e.line == t.to.line) {
            i += nw(t).ch - t.to.ch;
        }
        return e8(r, i);
    }
    function nC(e, t) {
        var r = [];
        for(var i = 0; i < e.sel.ranges.length; i++){
            var n = e.sel.ranges[i];
            r.push(new ny(n_(n.anchor, t), n_(n.head, t)));
        }
        return nb(e.cm, r, e.sel.primIndex);
    }
    function nS(e, t, r) {
        if (e.line == t.line) {
            return e8(r.line, e.ch - t.ch + r.ch);
        } else {
            return e8(r.line + (e.line - t.line), e.ch);
        }
    }
    function nL(e, t, r) {
        var i = [];
        var n = e8(e.first, 0), o = n;
        for(var l = 0; l < t.length; l++){
            var a = t[l];
            var s = nS(a.from, n, o);
            var u = nS(nw(a), n, o);
            n = a.to;
            o = u;
            if (r == "around") {
                var f = e.sel.ranges[l], c = e9(f.head, f.anchor) < 0;
                i[l] = new ny(c ? u : s, c ? s : u);
            } else {
                i[l] = new ny(s, s);
            }
        }
        return new n$(i, e.sel.primIndex);
    }
    function nk(e) {
        e.doc.mode = eI(e.options, e.doc.modeOption);
        nT(e);
    }
    function nT(e) {
        e.doc.iter(function(e) {
            if (e.stateAfter) {
                e.stateAfter = null;
            }
            if (e.styles) {
                e.styles = null;
            }
        });
        e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first;
        i9(e, 100);
        e.state.modeGen++;
        if (e.curOp) {
            il(e);
        }
    }
    function nN(e, t) {
        return (t.from.ch == 0 && t.to.ch == 0 && Y(t.text) == "" && (!e.cm || e.cm.options.wholeLineUpdateBefore));
    }
    function nO(e, t, r, i) {
        function n(e) {
            return r ? r[e] : null;
        }
        function o(e, r, n) {
            tU(e, r, n, i);
            ra(e, "change", e, t);
        }
        function l(e, t) {
            var r = [];
            for(var o = e; o < t; ++o){
                r.push(new tG(u[o], n(o), i));
            }
            return r;
        }
        var a = t.from, s = t.to, u = t.text;
        var f = e2(e, a.line), c = e2(e, s.line);
        var h = Y(u), d = n(u.length - 1), p = s.line - a.line;
        if (t.full) {
            e.insert(0, l(0, u.length));
            e.remove(u.length, e.size - u.length);
        } else if (nN(e, t)) {
            var v = l(0, u.length - 1);
            o(c, c.text, d);
            if (p) {
                e.remove(a.line, p);
            }
            if (v.length) {
                e.insert(a.line, v);
            }
        } else if (f == c) {
            if (u.length == 1) {
                o(f, f.text.slice(0, a.ch) + h + f.text.slice(s.ch), d);
            } else {
                var g = l(1, u.length - 1);
                g.push(new tG(h + f.text.slice(s.ch), d, i));
                o(f, f.text.slice(0, a.ch) + u[0], n(0));
                e.insert(a.line + 1, g);
            }
        } else if (u.length == 1) {
            o(f, f.text.slice(0, a.ch) + u[0] + c.text.slice(s.ch), n(0));
            e.remove(a.line + 1, p);
        } else {
            o(f, f.text.slice(0, a.ch) + u[0], n(0));
            o(c, h + c.text.slice(s.ch), d);
            var m = l(1, u.length - 1);
            if (p > 1) {
                e.remove(a.line + 1, p - 1);
            }
            e.insert(a.line + 1, m);
        }
        ra(e, "change", e, t);
    }
    function nM(e, t, r) {
        function i(e, n, o) {
            if (e.linked) {
                for(var l = 0; l < e.linked.length; ++l){
                    var a = e.linked[l];
                    if (a.doc == n) {
                        continue;
                    }
                    var s = o && a.sharedHist;
                    if (r && !s) {
                        continue;
                    }
                    t(a.doc, s);
                    i(a.doc, e, s);
                }
            }
        }
        i(e, null, true);
    }
    function nA(e, t) {
        if (t.cm) {
            throw new Error("This document is already in use.");
        }
        e.doc = t;
        t.cm = e;
        ir(e);
        nk(e);
        n0(e);
        e.options.direction = t.direction;
        if (!e.options.lineWrapping) {
            t2(e);
        }
        e.options.mode = t.modeOption;
        il(e);
    }
    function n0(e) {
        (e.doc.direction == "rtl" ? W : S)(e.display.lineDiv, "CodeMirror-rtl");
    }
    function nW(e) {
        iX(e, function() {
            n0(e);
            il(e);
        });
    }
    function nD(e) {
        this.done = [];
        this.undone = [];
        this.undoDepth = e ? e.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = e ? e.maxGeneration : 1;
    }
    function nH(e, t) {
        var r = {
            from: eZ(t.from),
            to: nw(t),
            text: eG(e, t.from, t.to)
        };
        nI(e, r, t.from.line, t.to.line + 1);
        nM(e, function(e) {
            return nI(e, r, t.from.line, t.to.line + 1);
        }, true);
        return r;
    }
    function nF(e) {
        while(e.length){
            var t = Y(e);
            if (t.ranges) {
                e.pop();
            } else {
                break;
            }
        }
    }
    function nP(e, t) {
        if (t) {
            nF(e.done);
            return Y(e.done);
        } else if (e.done.length && !Y(e.done).ranges) {
            return Y(e.done);
        } else if (e.done.length > 1 && !e.done[e.done.length - 2].ranges) {
            e.done.pop();
            return Y(e.done);
        }
    }
    function n1(e, t, r, i) {
        var n = e.history;
        n.undone.length = 0;
        var o = +new Date(), l;
        var a;
        if ((n.lastOp == i || (n.lastOrigin == t.origin && t.origin && ((t.origin.charAt(0) == "+" && n.lastModTime > o - (e.cm ? e.cm.options.historyEventDelay : 500)) || t.origin.charAt(0) == "*"))) && (l = nP(n, n.lastOp == i))) {
            a = Y(l.changes);
            if (e9(t.from, t.to) == 0 && e9(t.from, a.to) == 0) {
                a.to = nw(t);
            } else {
                l.changes.push(nH(e, t));
            }
        } else {
            var s = Y(n.done);
            if (!s || !s.ranges) {
                nR(e.sel, n.done);
            }
            l = {
                changes: [
                    nH(e, t)
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
        n.done.push(r);
        n.generation = ++n.maxGeneration;
        n.lastModTime = n.lastSelTime = o;
        n.lastOp = n.lastSelOp = i;
        n.lastOrigin = n.lastSelOrigin = t.origin;
        if (!a) {
            em(e, "historyAdded");
        }
    }
    function nE(e, t, r, i) {
        var n = t.charAt(0);
        return (n == "*" || (n == "+" && r.ranges.length == i.ranges.length && r.somethingSelected() == i.somethingSelected() && new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)));
    }
    function nz(e, t, r, i) {
        var n = e.history, o = i && i.origin;
        if (r == n.lastSelOp || (o && n.lastSelOrigin == o && ((n.lastModTime == n.lastSelTime && n.lastOrigin == o) || nE(e, o, Y(n.done), t)))) {
            n.done[n.done.length - 1] = t;
        } else {
            nR(t, n.done);
        }
        n.lastSelTime = +new Date();
        n.lastSelOrigin = o;
        n.lastSelOp = r;
        if (i && i.clearRedo !== false) {
            nF(n.undone);
        }
    }
    function nR(e, t) {
        var r = Y(t);
        if (!(r && r.ranges && r.equals(e))) {
            t.push(e);
        }
    }
    function nI(e, t, r, i) {
        var n = t["spans_" + e.id], o = 0;
        e.iter(Math.max(e.first, r), Math.min(e.first + e.size, i), function(r) {
            if (r.markedSpans) {
                (n || (n = t["spans_" + e.id] = {}))[o] = r.markedSpans;
            }
            ++o;
        });
    }
    function n3(e) {
        if (!e) {
            return null;
        }
        var t;
        for(var r = 0; r < e.length; ++r){
            if (e[r].marker.explicitlyCleared) {
                if (!t) {
                    t = e.slice(0, r);
                }
            } else if (t) {
                t.push(e[r]);
            }
        }
        return !t ? e : t.length ? t : null;
    }
    function nB(e, t) {
        var r = t["spans_" + e.id];
        if (!r) {
            return null;
        }
        var i = [];
        for(var n = 0; n < t.text.length; ++n){
            i.push(n3(r[n]));
        }
        return i;
    }
    function n7(e, t) {
        var r = nB(e, t);
        var i = tT(e, t);
        if (!r) {
            return i;
        }
        if (!i) {
            return r;
        }
        for(var n = 0; n < r.length; ++n){
            var o = r[n], l = i[n];
            if (o && l) {
                spans: for(var a = 0; a < l.length; ++a){
                    var s = l[a];
                    for(var u = 0; u < o.length; ++u){
                        if (o[u].marker == s.marker) {
                            continue spans;
                        }
                    }
                    o.push(s);
                }
            } else if (l) {
                r[n] = l;
            }
        }
        return r;
    }
    function n4(e, t, r) {
        var i = [];
        for(var n = 0; n < e.length; ++n){
            var o = e[n];
            if (o.ranges) {
                i.push(r ? n$.prototype.deepCopy.call(o) : o);
                continue;
            }
            var l = o.changes, a = [];
            i.push({
                changes: a
            });
            for(var s = 0; s < l.length; ++s){
                var u = l[s], f = void 0;
                a.push({
                    from: u.from,
                    to: u.to,
                    text: u.text
                });
                if (t) {
                    for(var c in u){
                        if ((f = c.match(/^spans_(\d+)$/))) {
                            if (R(t, Number(f[1])) > -1) {
                                Y(a)[c] = u[c];
                                delete u[c];
                            }
                        }
                    }
                }
            }
        }
        return i;
    }
    function n6(e, t, r, i) {
        if (i) {
            var n = e.anchor;
            if (r) {
                var o = e9(t, n) < 0;
                if (o != e9(r, n) < 0) {
                    n = t;
                    t = r;
                } else if (o != e9(t, r) < 0) {
                    t = r;
                }
            }
            return new ny(n, t);
        } else {
            return new ny(r || t, t);
        }
    }
    function n5(e, t, r, i, n) {
        if (n == null) {
            n = e.cm && (e.cm.display.shift || e.extend);
        }
        nX(e, new n$([
            n6(e.sel.primary(), t, r, n)
        ], 0), i);
    }
    function n2(e, t, r) {
        var i = [];
        var n = e.cm && (e.cm.display.shift || e.extend);
        for(var o = 0; o < e.sel.ranges.length; o++){
            i[o] = n6(e.sel.ranges[o], t[o], null, n);
        }
        var l = nb(e.cm, i, e.sel.primIndex);
        nX(e, l, r);
    }
    function nG(e, t, r, i) {
        var n = e.sel.ranges.slice(0);
        n[t] = r;
        nX(e, nb(e.cm, n, e.sel.primIndex), i);
    }
    function nU(e, t, r, i) {
        nX(e, nx(t, r), i);
    }
    function nV(e, t, r) {
        var i = {
            ranges: t.ranges,
            update: function(t) {
                this.ranges = [];
                for(var r = 0; r < t.length; r++){
                    this.ranges[r] = new ny(tt(e, t[r].anchor), tt(e, t[r].head));
                }
            },
            origin: r && r.origin
        };
        em(e, "beforeSelectionChange", e, i);
        if (e.cm) {
            em(e.cm, "beforeSelectionChange", e.cm, i);
        }
        if (i.ranges != t.ranges) {
            return nb(e.cm, i.ranges, i.ranges.length - 1);
        } else {
            return t;
        }
    }
    function nK(e, t, r) {
        var i = e.history.done, n = Y(i);
        if (n && n.ranges) {
            i[i.length - 1] = t;
            nj(e, t, r);
        } else {
            nX(e, t, r);
        }
    }
    function nX(e, t, r) {
        nj(e, t, r);
        nz(e, e.sel, e.cm ? e.cm.curOp.id : NaN, r);
    }
    function nj(e, t, r) {
        if (eb(e, "beforeSelectionChange") || (e.cm && eb(e.cm, "beforeSelectionChange"))) {
            t = nV(e, t, r);
        }
        var i = (r && r.bias) || (e9(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
        nY(e, n9(e, t, i, true));
        if (!(r && r.scroll === false) && e.cm && e.cm.getOption("readOnly") != "nocursor") {
            iM(e.cm);
        }
    }
    function nY(e, t) {
        if (t.equals(e.sel)) {
            return;
        }
        e.sel = t;
        if (e.cm) {
            e.cm.curOp.updateInput = 1;
            e.cm.curOp.selectionChanged = true;
            ey(e.cm);
        }
        ra(e, "cursorActivity", e);
    }
    function n8(e) {
        nY(e, n9(e, e.sel, null, false));
    }
    function n9(e, t, r, i) {
        var n;
        for(var o = 0; o < t.ranges.length; o++){
            var l = t.ranges[o];
            var a = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o];
            var s = nZ(e, l.anchor, a && a.anchor, r, i);
            var u = nZ(e, l.head, a && a.head, r, i);
            if (n || s != l.anchor || u != l.head) {
                if (!n) {
                    n = t.ranges.slice(0, o);
                }
                n[o] = new ny(s, u);
            }
        }
        return n ? nb(e.cm, n, t.primIndex) : t;
    }
    function nq(e, t, r, i, n) {
        var o = e2(e, t.line);
        if (o.markedSpans) {
            for(var l = 0; l < o.markedSpans.length; ++l){
                var a = o.markedSpans[l], s = a.marker;
                var u = "selectLeft" in s ? !s.selectLeft : s.inclusiveLeft;
                var f = "selectRight" in s ? !s.selectRight : s.inclusiveRight;
                if ((a.from == null || (u ? a.from <= t.ch : a.from < t.ch)) && (a.to == null || (f ? a.to >= t.ch : a.to > t.ch))) {
                    if (n) {
                        em(s, "beforeCursorEnter");
                        if (s.explicitlyCleared) {
                            if (!o.markedSpans) {
                                break;
                            } else {
                                --l;
                                continue;
                            }
                        }
                    }
                    if (!s.atomic) {
                        continue;
                    }
                    if (r) {
                        var c = s.find(i < 0 ? 1 : -1), h = void 0;
                        if (i < 0 ? f : u) {
                            c = nQ(e, c, -i, c && c.line == t.line ? o : null);
                        }
                        if (c && c.line == t.line && (h = e9(c, r)) && (i < 0 ? h < 0 : h > 0)) {
                            return nq(e, c, t, i, n);
                        }
                    }
                    var d = s.find(i < 0 ? -1 : 1);
                    if (i < 0 ? u : f) {
                        d = nQ(e, d, i, d.line == t.line ? o : null);
                    }
                    return d ? nq(e, d, t, i, n) : null;
                }
            }
        }
        return t;
    }
    function nZ(e, t, r, i, n) {
        var o = i || 1;
        var l = nq(e, t, r, o, n) || (!n && nq(e, t, r, o, true)) || nq(e, t, r, -o, n) || (!n && nq(e, t, r, -o, true));
        if (!l) {
            e.cantEdit = true;
            return e8(e.first, 0);
        }
        return l;
    }
    function nQ(e, t, r, i) {
        if (r < 0 && t.ch == 0) {
            if (t.line > e.first) {
                return tt(e, e8(t.line - 1));
            } else {
                return null;
            }
        } else if (r > 0 && t.ch == (i || e2(e, t.line)).text.length) {
            if (t.line < e.first + e.size - 1) {
                return e8(t.line + 1, 0);
            } else {
                return null;
            }
        } else {
            return new e8(t.line, t.ch + r);
        }
    }
    function nJ(e) {
        e.setSelection(e8(e.firstLine(), 0), e8(e.lastLine()), G);
    }
    function oe(e, t, r) {
        var i = {
            canceled: false,
            from: t.from,
            to: t.to,
            text: t.text,
            origin: t.origin,
            cancel: function() {
                return (i.canceled = true);
            }
        };
        if (r) {
            i.update = function(t, r, n, o) {
                if (t) {
                    i.from = tt(e, t);
                }
                if (r) {
                    i.to = tt(e, r);
                }
                if (n) {
                    i.text = n;
                }
                if (o !== undefined) {
                    i.origin = o;
                }
            };
        }
        em(e, "beforeChange", e, i);
        if (e.cm) {
            em(e.cm, "beforeChange", e.cm, i);
        }
        if (i.canceled) {
            if (e.cm) {
                e.cm.curOp.updateInput = 2;
            }
            return null;
        }
        return {
            from: i.from,
            to: i.to,
            text: i.text,
            origin: i.origin
        };
    }
    function ot(e, t, r) {
        if (e.cm) {
            if (!e.cm.curOp) {
                return ij(e.cm, ot)(e, t, r);
            }
            if (e.cm.state.suppressEdits) {
                return;
            }
        }
        if (eb(e, "beforeChange") || (e.cm && eb(e.cm, "beforeChange"))) {
            t = oe(e, t, true);
            if (!t) {
                return;
            }
        }
        var i = t$ && !r && tO(e, t.from, t.to);
        if (i) {
            for(var n = i.length - 1; n >= 0; --n){
                or(e, {
                    from: i[n].from,
                    to: i[n].to,
                    text: n ? [
                        ""
                    ] : t.text,
                    origin: t.origin
                });
            }
        } else {
            or(e, t);
        }
    }
    function or(e, t) {
        if (t.text.length == 1 && t.text[0] == "" && e9(t.from, t.to) == 0) {
            return;
        }
        var r = nC(e, t);
        n1(e, t, r, e.cm ? e.cm.curOp.id : NaN);
        oo(e, t, r, tT(e, t));
        var i = [];
        nM(e, function(e, r) {
            if (!r && R(i, e.history) == -1) {
                of(e.history, t);
                i.push(e.history);
            }
            oo(e, t, null, tT(e, t));
        });
    }
    function oi(e, t, r) {
        var i = e.cm && e.cm.state.suppressEdits;
        if (i && !r) {
            return;
        }
        var n = e.history, o, l = e.sel;
        var a = t == "undo" ? n.done : n.undone, s = t == "undo" ? n.undone : n.done;
        var u = 0;
        for(; u < a.length; u++){
            o = a[u];
            if (r ? o.ranges && !o.equals(e.sel) : !o.ranges) {
                break;
            }
        }
        if (u == a.length) {
            return;
        }
        n.lastOrigin = n.lastSelOrigin = null;
        for(;;){
            o = a.pop();
            if (o.ranges) {
                nR(o, s);
                if (r && !o.equals(e.sel)) {
                    nX(e, o, {
                        clearRedo: false
                    });
                    return;
                }
                l = o;
            } else if (i) {
                a.push(o);
                return;
            } else {
                break;
            }
        }
        var f = [];
        nR(l, s);
        s.push({
            changes: f,
            generation: n.generation
        });
        n.generation = o.generation || ++n.maxGeneration;
        var c = eb(e, "beforeChange") || (e.cm && eb(e.cm, "beforeChange"));
        var h = function(r) {
            var i = o.changes[r];
            i.origin = t;
            if (c && !oe(e, i, false)) {
                a.length = 0;
                return {};
            }
            f.push(nH(e, i));
            var n = r ? nC(e, i) : Y(a);
            oo(e, i, n, n7(e, i));
            if (!r && e.cm) {
                e.cm.scrollIntoView({
                    from: i.from,
                    to: nw(i)
                });
            }
            var l = [];
            nM(e, function(e, t) {
                if (!t && R(l, e.history) == -1) {
                    of(e.history, i);
                    l.push(e.history);
                }
                oo(e, i, null, n7(e, i));
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
            return new ny(e8(e.anchor.line + t, e.anchor.ch), e8(e.head.line + t, e.head.ch));
        }), e.sel.primIndex);
        if (e.cm) {
            il(e.cm, e.first, e.first - t, t);
            for(var r = e.cm.display, i = r.viewFrom; i < r.viewTo; i++){
                ia(e.cm, i, "gutter");
            }
        }
    }
    function oo(e, t, r, i) {
        if (e.cm && !e.cm.curOp) {
            return ij(e.cm, oo)(e, t, r, i);
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
                from: e8(e.first, 0),
                to: e8(t.to.line + n, t.to.ch),
                text: [
                    Y(t.text)
                ],
                origin: t.origin
            };
        }
        var o = e.lastLine();
        if (t.to.line > o) {
            t = {
                from: t.from,
                to: e8(o, e2(e, o).text.length),
                text: [
                    t.text[0]
                ],
                origin: t.origin
            };
        }
        t.removed = eG(e, t.from, t.to);
        if (!r) {
            r = nC(e, t);
        }
        if (e.cm) {
            ol(e.cm, t, i);
        } else {
            nO(e, t, i);
        }
        nj(e, r, G);
        if (e.cantEdit && nZ(e, e8(e.firstLine(), 0))) {
            e.cantEdit = false;
        }
    }
    function ol(e, t, r) {
        var i = e.doc, n = e.display, o = t.from, l = t.to;
        var a = false, s = o.line;
        if (!e.options.lineWrapping) {
            s = eK(tz(e2(i, o.line)));
            i.iter(s, l.line + 1, function(e) {
                if (e == n.maxLine) {
                    a = true;
                    return true;
                }
            });
        }
        if (i.sel.contains(t.from, t.to) > -1) {
            ey(e);
        }
        nO(i, t, r, it(e));
        if (!e.options.lineWrapping) {
            i.iter(s, o.line + t.text.length, function(e) {
                var t = t5(e);
                if (t > n.maxLineLength) {
                    n.maxLine = e;
                    n.maxLineLength = t;
                    n.maxLineChanged = true;
                    a = false;
                }
            });
            if (a) {
                e.curOp.updateMaxLine = true;
            }
        }
        tm(i, o.line);
        i9(e, 400);
        var u = t.text.length - (l.line - o.line) - 1;
        if (t.full) {
            il(e);
        } else if (o.line == l.line && t.text.length == 1 && !nN(e.doc, t)) {
            ia(e, o.line, "text");
        } else {
            il(e, o.line, l.line + 1, u);
        }
        var f = eb(e, "changes"), c = eb(e, "change");
        if (c || f) {
            var h = {
                from: o,
                to: l,
                text: t.text,
                removed: t.removed,
                origin: t.origin
            };
            if (c) {
                ra(e, "change", e, h);
            }
            if (f) {
                (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(h);
            }
        }
        e.display.selForContextMenu = null;
    }
    function oa(e, t, r, i, n) {
        var o;
        if (!i) {
            i = r;
        }
        if (e9(i, r) < 0) {
            (o = [
                i,
                r
            ]), (r = o[0]), (i = o[1]);
        }
        if (typeof t == "string") {
            t = e.splitLines(t);
        }
        ot(e, {
            from: r,
            to: i,
            text: t,
            origin: n
        });
    }
    function os(e, t, r, i) {
        if (r < e.line) {
            e.line += i;
        } else if (t < e.line) {
            e.line = t;
            e.ch = 0;
        }
    }
    function ou(e, t, r, i) {
        for(var n = 0; n < e.length; ++n){
            var o = e[n], l = true;
            if (o.ranges) {
                if (!o.copied) {
                    o = e[n] = o.deepCopy();
                    o.copied = true;
                }
                for(var a = 0; a < o.ranges.length; a++){
                    os(o.ranges[a].anchor, t, r, i);
                    os(o.ranges[a].head, t, r, i);
                }
                continue;
            }
            for(var s = 0; s < o.changes.length; ++s){
                var u = o.changes[s];
                if (r < u.from.line) {
                    u.from = e8(u.from.line + i, u.from.ch);
                    u.to = e8(u.to.line + i, u.to.ch);
                } else if (t <= u.to.line) {
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
    function of(e, t) {
        var r = t.from.line, i = t.to.line, n = t.text.length - (i - r) - 1;
        ou(e.done, r, i, n);
        ou(e.undone, r, i, n);
    }
    function oc(e, t, r, i) {
        var n = t, o = t;
        if (typeof t == "number") {
            o = e2(e, te(e, t));
        } else {
            n = eK(t);
        }
        if (n == null) {
            return null;
        }
        if (i(o, n) && e.cm) {
            ia(e.cm, n, r);
        }
        return o;
    }
    function oh(e) {
        this.lines = e;
        this.parent = null;
        var t = 0;
        for(var r = 0; r < e.length; ++r){
            e[r].parent = this;
            t += e[r].height;
        }
        this.height = t;
    }
    oh.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        removeInner: function(e, t) {
            for(var r = e, i = e + t; r < i; ++r){
                var n = this.lines[r];
                this.height -= n.height;
                tV(n);
                ra(n, "delete");
            }
            this.lines.splice(e, t);
        },
        collapse: function(e) {
            e.push.apply(e, this.lines);
        },
        insertInner: function(e, t, r) {
            this.height += r;
            this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
            for(var i = 0; i < t.length; ++i){
                t[i].parent = this;
            }
        },
        iterN: function(e, t, r) {
            for(var i = e + t; e < i; ++e){
                if (r(this.lines[e])) {
                    return true;
                }
            }
        }
    };
    function od(e) {
        this.children = e;
        var t = 0, r = 0;
        for(var i = 0; i < e.length; ++i){
            var n = e[i];
            t += n.chunkSize();
            r += n.height;
            n.parent = this;
        }
        this.size = t;
        this.height = r;
        this.parent = null;
    }
    od.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(e, t) {
            this.size -= t;
            for(var r = 0; r < this.children.length; ++r){
                var i = this.children[r], n = i.chunkSize();
                if (e < n) {
                    var o = Math.min(t, n - e), l = i.height;
                    i.removeInner(e, o);
                    this.height -= l - i.height;
                    if (n == o) {
                        this.children.splice(r--, 1);
                        i.parent = null;
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
                var a = [];
                this.collapse(a);
                this.children = [
                    new oh(a)
                ];
                this.children[0].parent = this;
            }
        },
        collapse: function(e) {
            for(var t = 0; t < this.children.length; ++t){
                this.children[t].collapse(e);
            }
        },
        insertInner: function(e, t, r) {
            this.size += t.length;
            this.height += r;
            for(var i = 0; i < this.children.length; ++i){
                var n = this.children[i], o = n.chunkSize();
                if (e <= o) {
                    n.insertInner(e, t, r);
                    if (n.lines && n.lines.length > 50) {
                        var l = (n.lines.length % 25) + 25;
                        for(var a = l; a < n.lines.length;){
                            var s = new oh(n.lines.slice(a, (a += 25)));
                            n.height -= s.height;
                            this.children.splice(++i, 0, s);
                            s.parent = this;
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
                var r = new od(t);
                if (!e.parent) {
                    var i = new od(e.children);
                    i.parent = e;
                    e.children = [
                        i,
                        r
                    ];
                    e = i;
                } else {
                    e.size -= r.size;
                    e.height -= r.height;
                    var n = R(e.parent.children, e);
                    e.parent.children.splice(n + 1, 0, r);
                }
                r.parent = e.parent;
            }while (e.children.length > 10)
            e.parent.maybeSpill();
        },
        iterN: function(e, t, r) {
            for(var i = 0; i < this.children.length; ++i){
                var n = this.children[i], o = n.chunkSize();
                if (e < o) {
                    var l = Math.min(t, o - e);
                    if (n.iterN(e, l, r)) {
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
    var op = function(e, t, r) {
        if (r) {
            for(var i in r){
                if (r.hasOwnProperty(i)) {
                    this[i] = r[i];
                }
            }
        }
        this.doc = e;
        this.node = t;
    };
    op.prototype.clear = function() {
        var e = this.doc.cm, t = this.line.widgets, r = this.line, i = eK(r);
        if (i == null || !t) {
            return;
        }
        for(var n = 0; n < t.length; ++n){
            if (t[n] == this) {
                t.splice(n--, 1);
            }
        }
        if (!t.length) {
            r.widgets = null;
        }
        var o = rx(this);
        eV(r, Math.max(0, r.height - o));
        if (e) {
            iX(e, function() {
                ov(e, r, -o);
                ia(e, i, "widget");
            });
            ra(e, "lineWidgetCleared", e, this, i);
        }
    };
    op.prototype.changed = function() {
        var e = this;
        var t = this.height, r = this.doc.cm, i = this.line;
        this.height = null;
        var n = rx(this) - t;
        if (!n) {
            return;
        }
        if (!t7(this.doc, i)) {
            eV(i, i.height + n);
        }
        if (r) {
            iX(r, function() {
                r.curOp.forceUpdate = true;
                ov(r, i, n);
                ra(r, "lineWidgetChanged", r, e, eK(i));
            });
        }
    };
    ex(op);
    function ov(e, t, r) {
        if (t6(t) < ((e.curOp && e.curOp.scrollTop) || e.doc.scrollTop)) {
            iO(e, r);
        }
    }
    function og(e, t, r, i) {
        var n = new op(e, r, i);
        var o = e.cm;
        if (o && n.noHScroll) {
            o.display.alignWidgets = true;
        }
        oc(e, t, "widget", function(t) {
            var r = t.widgets || (t.widgets = []);
            if (n.insertAt == null) {
                r.push(n);
            } else {
                r.splice(Math.min(r.length, Math.max(0, n.insertAt)), 0, n);
            }
            n.line = t;
            if (o && !t7(e, t)) {
                var i = t6(t) < e.scrollTop;
                eV(t, t.height + rx(n));
                if (i) {
                    iO(o, n.height);
                }
                o.curOp.forceUpdate = true;
            }
            return true;
        });
        if (o) {
            ra(o, "lineWidgetAdded", o, n, typeof t == "number" ? t : eK(t));
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
            i4(e);
        }
        if (eb(this, "clear")) {
            var r = this.find();
            if (r) {
                ra(this, "clear", r.from, r.to);
            }
        }
        var i = null, n = null;
        for(var o = 0; o < this.lines.length; ++o){
            var l = this.lines[o];
            var a = t_(l.markedSpans, this);
            if (e && !this.collapsed) {
                ia(e, eK(l), "text");
            } else if (e) {
                if (a.to != null) {
                    n = eK(l);
                }
                if (a.from != null) {
                    i = eK(l);
                }
            }
            l.markedSpans = tC(l.markedSpans, a);
            if (a.from == null && this.collapsed && !t7(this.doc, l) && e) {
                eV(l, rZ(e.display));
            }
        }
        if (e && this.collapsed && !e.options.lineWrapping) {
            for(var s = 0; s < this.lines.length; ++s){
                var u = tz(this.lines[s]), f = t5(u);
                if (f > e.display.maxLineLength) {
                    e.display.maxLine = u;
                    e.display.maxLineLength = f;
                    e.display.maxLineChanged = true;
                }
            }
        }
        if (i != null && e && this.collapsed) {
            il(e, i, n + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (e) {
                n8(e.doc);
            }
        }
        if (e) {
            ra(e, "markerCleared", e, this, i, n);
        }
        if (t) {
            i6(e);
        }
        if (this.parent) {
            this.parent.clear();
        }
    };
    o$.prototype.find = function(e, t) {
        if (e == null && this.type == "bookmark") {
            e = 1;
        }
        var r, i;
        for(var n = 0; n < this.lines.length; ++n){
            var o = this.lines[n];
            var l = t_(o.markedSpans, this);
            if (l.from != null) {
                r = e8(t ? o : eK(o), l.from);
                if (e == -1) {
                    return r;
                }
            }
            if (l.to != null) {
                i = e8(t ? o : eK(o), l.to);
                if (e == 1) {
                    return i;
                }
            }
        }
        return r && {
            from: r,
            to: i
        };
    };
    o$.prototype.changed = function() {
        var e = this;
        var t = this.find(-1, true), r = this, i = this.doc.cm;
        if (!t || !i) {
            return;
        }
        iX(i, function() {
            var n = t.line, o = eK(t.line);
            var l = r0(i, o);
            if (l) {
                rz(l);
                i.curOp.selectionChanged = i.curOp.forceUpdate = true;
            }
            i.curOp.updateMaxLine = true;
            if (!t7(r.doc, n) && r.height != null) {
                var a = r.height;
                r.height = null;
                var s = rx(r) - a;
                if (s) {
                    eV(n, n.height + s);
                }
            }
            ra(i, "markerChanged", i, e);
        });
    };
    o$.prototype.attachLine = function(e) {
        if (!this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            if (!t.maybeHiddenMarkers || R(t.maybeHiddenMarkers, this) == -1) {
                (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this);
            }
        }
        this.lines.push(e);
    };
    o$.prototype.detachLine = function(e) {
        this.lines.splice(R(this.lines, e), 1);
        if (!this.lines.length && this.doc.cm) {
            var t = this.doc.cm.curOp;
            (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this);
        }
    };
    ex(o$);
    function oy(e, t, r, i, n) {
        if (i && i.shared) {
            return ox(e, t, r, i, n);
        }
        if (e.cm && !e.cm.curOp) {
            return ij(e.cm, oy)(e, t, r, i, n);
        }
        var o = new o$(e, n), l = e9(t, r);
        if (i) {
            P(i, o, false);
        }
        if (l > 0 || (l == 0 && o.clearWhenEmpty !== false)) {
            return o;
        }
        if (o.replacedWith) {
            o.collapsed = true;
            o.widgetNode = N("span", [
                o.replacedWith
            ], "CodeMirror-widget");
            if (!i.handleMouseEvents) {
                o.widgetNode.setAttribute("cm-ignore-events", "true");
            }
            if (i.insertLeft) {
                o.widgetNode.insertLeft = true;
            }
        }
        if (o.collapsed) {
            if (tE(e, t.line, t, r, o) || (t.line != r.line && tE(e, r.line, t, r, o))) {
                throw new Error("Inserting collapsed marker partially overlapping an existing one");
            }
            tx();
        }
        if (o.addToHistory) {
            n1(e, {
                from: t,
                to: r,
                origin: "markText"
            }, e.sel, NaN);
        }
        var a = t.line, s = e.cm, u;
        e.iter(a, r.line + 1, function(i) {
            if (s && o.collapsed && !s.options.lineWrapping && tz(i) == s.display.maxLine) {
                u = true;
            }
            if (o.collapsed && a != t.line) {
                eV(i, 0);
            }
            tS(i, new tw(o, a == t.line ? t.ch : null, a == r.line ? r.ch : null), e.cm && e.cm.curOp);
            ++a;
        });
        if (o.collapsed) {
            e.iter(t.line, r.line + 1, function(t) {
                if (t7(e, t)) {
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
            tb();
            if (e.history.done.length || e.history.undone.length) {
                e.clearHistory();
            }
        }
        if (o.collapsed) {
            o.id = ++om;
            o.atomic = true;
        }
        if (s) {
            if (u) {
                s.curOp.updateMaxLine = true;
            }
            if (o.collapsed) {
                il(s, t.line, r.line + 1);
            } else if (o.className || o.startStyle || o.endStyle || o.css || o.attributes || o.title) {
                for(var f = t.line; f <= r.line; f++){
                    ia(s, f, "text");
                }
            }
            if (o.atomic) {
                n8(s.doc);
            }
            ra(s, "markerAdded", s, o);
        }
        return o;
    }
    var ob = function(e, t) {
        this.markers = e;
        this.primary = t;
        for(var r = 0; r < e.length; ++r){
            e[r].parent = this;
        }
    };
    ob.prototype.clear = function() {
        if (this.explicitlyCleared) {
            return;
        }
        this.explicitlyCleared = true;
        for(var e = 0; e < this.markers.length; ++e){
            this.markers[e].clear();
        }
        ra(this, "clear");
    };
    ob.prototype.find = function(e, t) {
        return this.primary.find(e, t);
    };
    ex(ob);
    function ox(e, t, r, i, n) {
        i = P(i);
        i.shared = false;
        var o = [
            oy(e, t, r, i, n)
        ], l = o[0];
        var a = i.widgetNode;
        nM(e, function(e) {
            if (a) {
                i.widgetNode = a.cloneNode(true);
            }
            o.push(oy(e, tt(e, t), tt(e, r), i, n));
            for(var s = 0; s < e.linked.length; ++s){
                if (e.linked[s].isParent) {
                    return;
                }
            }
            l = Y(o);
        });
        return new ob(o, l);
    }
    function ow(e) {
        return e.findMarks(e8(e.first, 0), e.clipPos(e8(e.lastLine())), function(e) {
            return e.parent;
        });
    }
    function o_(e, t) {
        for(var r = 0; r < t.length; r++){
            var i = t[r], n = i.find();
            var o = e.clipPos(n.from), l = e.clipPos(n.to);
            if (e9(o, l)) {
                var a = oy(e, o, l, i.primary, i.primary.type);
                i.markers.push(a);
                a.parent = i;
            }
        }
    }
    function oC(e) {
        var t = function(t) {
            var r = e[t], i = [
                r.primary.doc
            ];
            nM(r.primary.doc, function(e) {
                return i.push(e);
            });
            for(var n = 0; n < r.markers.length; n++){
                var o = r.markers[n];
                if (R(i, o.doc) == -1) {
                    o.parent = null;
                    r.markers.splice(n--, 1);
                }
            }
        };
        for(var r = 0; r < e.length; r++)t(r);
    }
    var oS = 0;
    var oL = function(e, t, r, i, n) {
        if (!(this instanceof oL)) {
            return new oL(e, t, r, i, n);
        }
        if (r == null) {
            r = 0;
        }
        od.call(this, [
            new oh([
                new tG("", null)
            ])
        ]);
        this.first = r;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = r;
        var o = e8(r, 0);
        this.sel = nx(o);
        this.history = new nD(null);
        this.id = ++oS;
        this.modeOption = t;
        this.lineSep = i;
        this.direction = n == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof e == "string") {
            e = this.splitLines(e);
        }
        nO(this, {
            from: o,
            to: o,
            text: e
        });
        nX(this, nx(o), G);
    };
    oL.prototype = J(od.prototype, {
        constructor: oL,
        iter: function(e, t, r) {
            if (r) {
                this.iterN(e - this.first, t - e, r);
            } else {
                this.iterN(this.first, this.first + this.size, e);
            }
        },
        insert: function(e, t) {
            var r = 0;
            for(var i = 0; i < t.length; ++i){
                r += t[i].height;
            }
            this.insertInner(e - this.first, t, r);
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
        setValue: i8(function(e) {
            var t = e8(this.first, 0), r = this.first + this.size - 1;
            ot(this, {
                from: t,
                to: e8(r, e2(this, r).text.length),
                text: this.splitLines(e),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) {
                iA(this.cm, 0, 0);
            }
            nX(this, nx(t), G);
        }),
        replaceRange: function(e, t, r, i) {
            t = tt(this, t);
            r = r ? tt(this, r) : t;
            oa(this, e, t, r, i);
        },
        getRange: function(e, t, r) {
            var i = eG(this, tt(this, e), tt(this, t));
            if (r === false) {
                return i;
            }
            if (r === "") {
                return i.join("");
            }
            return i.join(r || this.lineSeparator());
        },
        getLine: function(e) {
            var t = this.getLineHandle(e);
            return t && t.text;
        },
        getLineHandle: function(e) {
            if (ej(this, e)) {
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
            return tz(e);
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
            var t = this.sel.primary(), r;
            if (e == null || e == "head") {
                r = t.head;
            } else if (e == "anchor") {
                r = t.anchor;
            } else if (e == "end" || e == "to" || e === false) {
                r = t.to();
            } else {
                r = t.from();
            }
            return r;
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: i8(function(e, t, r) {
            nU(this, tt(this, typeof e == "number" ? e8(e, t || 0) : e), null, r);
        }),
        setSelection: i8(function(e, t, r) {
            nU(this, tt(this, e), tt(this, t || e), r);
        }),
        extendSelection: i8(function(e, t, r) {
            n5(this, tt(this, e), t && tt(this, t), r);
        }),
        extendSelections: i8(function(e, t) {
            n2(this, ti(this, e), t);
        }),
        extendSelectionsBy: i8(function(e, t) {
            var r = q(this.sel.ranges, e);
            n2(this, ti(this, r), t);
        }),
        setSelections: i8(function(e, t, r) {
            if (!e.length) {
                return;
            }
            var i = [];
            for(var n = 0; n < e.length; n++){
                i[n] = new ny(tt(this, e[n].anchor), tt(this, e[n].head || e[n].anchor));
            }
            if (t == null) {
                t = Math.min(e.length - 1, this.sel.primIndex);
            }
            nX(this, nb(this.cm, i, t), r);
        }),
        addSelection: i8(function(e, t, r) {
            var i = this.sel.ranges.slice(0);
            i.push(new ny(tt(this, e), tt(this, t || e)));
            nX(this, nb(this.cm, i, i.length - 1), r);
        }),
        getSelection: function(e) {
            var t = this.sel.ranges, r;
            for(var i = 0; i < t.length; i++){
                var n = eG(this, t[i].from(), t[i].to());
                r = r ? r.concat(n) : n;
            }
            if (e === false) {
                return r;
            } else {
                return r.join(e || this.lineSeparator());
            }
        },
        getSelections: function(e) {
            var t = [], r = this.sel.ranges;
            for(var i = 0; i < r.length; i++){
                var n = eG(this, r[i].from(), r[i].to());
                if (e !== false) {
                    n = n.join(e || this.lineSeparator());
                }
                t[i] = n;
            }
            return t;
        },
        replaceSelection: function(e, t, r) {
            var i = [];
            for(var n = 0; n < this.sel.ranges.length; n++){
                i[n] = e;
            }
            this.replaceSelections(i, t, r || "+input");
        },
        replaceSelections: i8(function(e, t, r) {
            var i = [], n = this.sel;
            for(var o = 0; o < n.ranges.length; o++){
                var l = n.ranges[o];
                i[o] = {
                    from: l.from(),
                    to: l.to(),
                    text: this.splitLines(e[o]),
                    origin: r
                };
            }
            var a = t && t != "end" && nL(this, i, t);
            for(var s = i.length - 1; s >= 0; s--){
                ot(this, i[s]);
            }
            if (a) {
                nK(this, a);
            } else if (this.cm) {
                iM(this.cm);
            }
        }),
        undo: i8(function() {
            oi(this, "undo");
        }),
        redo: i8(function() {
            oi(this, "redo");
        }),
        undoSelection: i8(function() {
            oi(this, "undo", true);
        }),
        redoSelection: i8(function() {
            oi(this, "redo", true);
        }),
        setExtending: function(e) {
            this.extend = e;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            var e = this.history, t = 0, r = 0;
            for(var i = 0; i < e.done.length; i++){
                if (!e.done[i].ranges) {
                    ++t;
                }
            }
            for(var n = 0; n < e.undone.length; n++){
                if (!e.undone[n].ranges) {
                    ++r;
                }
            }
            return {
                undo: t,
                redo: r
            };
        },
        clearHistory: function() {
            var e = this;
            this.history = new nD(this.history);
            nM(this, function(t) {
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
            var t = (this.history = new nD(this.history));
            t.done = n4(e.done.slice(0), null, true);
            t.undone = n4(e.undone.slice(0), null, true);
        },
        setGutterMarker: i8(function(e, t, r) {
            return oc(this, e, "gutter", function(e) {
                var i = e.gutterMarkers || (e.gutterMarkers = {});
                i[t] = r;
                if (!r && ei(i)) {
                    e.gutterMarkers = null;
                }
                return true;
            });
        }),
        clearGutter: i8(function(e) {
            var t = this;
            this.iter(function(r) {
                if (r.gutterMarkers && r.gutterMarkers[e]) {
                    oc(t, r, "gutter", function() {
                        r.gutterMarkers[e] = null;
                        if (ei(r.gutterMarkers)) {
                            r.gutterMarkers = null;
                        }
                        return true;
                    });
                }
            });
        }),
        lineInfo: function(e) {
            var t;
            if (typeof e == "number") {
                if (!ej(this, e)) {
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
        addLineClass: i8(function(e, t, r) {
            return oc(this, e, t == "gutter" ? "gutter" : "class", function(e) {
                var i = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass";
                if (!e[i]) {
                    e[i] = r;
                } else if (C(r).test(e[i])) {
                    return false;
                } else {
                    e[i] += " " + r;
                }
                return true;
            });
        }),
        removeLineClass: i8(function(e, t, r) {
            return oc(this, e, t == "gutter" ? "gutter" : "class", function(e) {
                var i = t == "text" ? "textClass" : t == "background" ? "bgClass" : t == "gutter" ? "gutterClass" : "wrapClass";
                var n = e[i];
                if (!n) {
                    return false;
                } else if (r == null) {
                    e[i] = null;
                } else {
                    var o = n.match(C(r));
                    if (!o) {
                        return false;
                    }
                    var l = o.index + o[0].length;
                    e[i] = n.slice(0, o.index) + (!o.index || l == n.length ? "" : " ") + n.slice(l) || null;
                }
                return true;
            });
        }),
        addLineWidget: i8(function(e, t, r) {
            return og(this, e, t, r);
        }),
        removeLineWidget: function(e) {
            e.clear();
        },
        markText: function(e, t, r) {
            return oy(this, tt(this, e), tt(this, t), r, (r && r.type) || "range");
        },
        setBookmark: function(e, t) {
            var r = {
                replacedWith: t && (t.nodeType == null ? t.widget : t),
                insertLeft: t && t.insertLeft,
                clearWhenEmpty: false,
                shared: t && t.shared,
                handleMouseEvents: t && t.handleMouseEvents
            };
            e = tt(this, e);
            return oy(this, e, e, r, "bookmark");
        },
        findMarksAt: function(e) {
            e = tt(this, e);
            var t = [], r = e2(this, e.line).markedSpans;
            if (r) {
                for(var i = 0; i < r.length; ++i){
                    var n = r[i];
                    if ((n.from == null || n.from <= e.ch) && (n.to == null || n.to >= e.ch)) {
                        t.push(n.marker.parent || n.marker);
                    }
                }
            }
            return t;
        },
        findMarks: function(e, t, r) {
            e = tt(this, e);
            t = tt(this, t);
            var i = [], n = e.line;
            this.iter(e.line, t.line + 1, function(o) {
                var l = o.markedSpans;
                if (l) {
                    for(var a = 0; a < l.length; a++){
                        var s = l[a];
                        if (!((s.to != null && n == e.line && e.ch >= s.to) || (s.from == null && n != e.line) || (s.from != null && n == t.line && s.from >= t.ch)) && (!r || r(s.marker))) {
                            i.push(s.marker.parent || s.marker);
                        }
                    }
                }
                ++n;
            });
            return i;
        },
        getAllMarks: function() {
            var e = [];
            this.iter(function(t) {
                var r = t.markedSpans;
                if (r) {
                    for(var i = 0; i < r.length; ++i){
                        if (r[i].from != null) {
                            e.push(r[i].marker);
                        }
                    }
                }
            });
            return e;
        },
        posFromIndex: function(e) {
            var t, r = this.first, i = this.lineSeparator().length;
            this.iter(function(n) {
                var o = n.text.length + i;
                if (o > e) {
                    t = e;
                    return true;
                }
                e -= o;
                ++r;
            });
            return tt(this, e8(r, t));
        },
        indexFromPos: function(e) {
            e = tt(this, e);
            var t = e.ch;
            if (e.line < this.first || e.ch < 0) {
                return 0;
            }
            var r = this.lineSeparator().length;
            this.iter(this.first, e.line, function(e) {
                t += e.text.length + r;
            });
            return t;
        },
        copy: function(e) {
            var t = new oL(eU(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
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
            var t = this.first, r = this.first + this.size;
            if (e.from != null && e.from > t) {
                t = e.from;
            }
            if (e.to != null && e.to < r) {
                r = e.to;
            }
            var i = new oL(eU(this, t, r), e.mode || this.modeOption, t, this.lineSep, this.direction);
            if (e.sharedHist) {
                i.history = this.history;
            }
            (this.linked || (this.linked = [])).push({
                doc: i,
                sharedHist: e.sharedHist
            });
            i.linked = [
                {
                    doc: this,
                    isParent: true,
                    sharedHist: e.sharedHist
                }, 
            ];
            o_(i, ow(this));
            return i;
        },
        unlinkDoc: function(e) {
            if (e instanceof lO) {
                e = e.doc;
            }
            if (this.linked) {
                for(var t = 0; t < this.linked.length; ++t){
                    var r = this.linked[t];
                    if (r.doc != e) {
                        continue;
                    }
                    this.linked.splice(t, 1);
                    e.unlinkDoc(this);
                    oC(ow(this));
                    break;
                }
            }
            if (e.history == this.history) {
                var i = [
                    e.id
                ];
                nM(e, function(e) {
                    return i.push(e.id);
                }, true);
                e.history = new nD(null);
                e.history.done = n4(this.history.done, i);
                e.history.undone = n4(this.history.undone, i);
            }
        },
        iterLinkedDocs: function(e) {
            nM(this, e);
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
            return e0(e);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: i8(function(e) {
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
                nW(this.cm);
            }
        })
    });
    oL.prototype.eachLine = oL.prototype.iter;
    var ok = 0;
    function oT(e) {
        var t = this;
        oM(t);
        if (e$(t, e) || rw(t.display, e)) {
            return;
        }
        ew(e);
        if (l) {
            ok = +new Date();
        }
        var r = ii(t, e, true), i = e.dataTransfer.files;
        if (!r || t.isReadOnly()) {
            return;
        }
        if (i && i.length && window.FileReader && window.File) {
            var n = i.length, o = Array(n), a = 0;
            var s = function() {
                if (++a == n) {
                    ij(t, function() {
                        r = tt(t.doc, r);
                        var e = {
                            from: r,
                            to: r,
                            text: t.doc.splitLines(o.filter(function(e) {
                                return e != null;
                            }).join(t.doc.lineSeparator())),
                            origin: "paste"
                        };
                        ot(t.doc, e);
                        nK(t.doc, nx(tt(t.doc, r), tt(t.doc, nw(e))));
                    })();
                }
            };
            var u = function(e, r) {
                if (t.options.allowDropFileTypes && R(t.options.allowDropFileTypes, e.type) == -1) {
                    s();
                    return;
                }
                var i = new FileReader();
                i.onerror = function() {
                    return s();
                };
                i.onload = function() {
                    var e = i.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(e)) {
                        s();
                        return;
                    }
                    o[r] = e;
                    s();
                };
                i.readAsText(e);
            };
            for(var f = 0; f < i.length; f++){
                u(i[f], f);
            }
        } else {
            if (t.state.draggingText && t.doc.sel.contains(r) > -1) {
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
                    nj(t.doc, nx(r, r));
                    if (h) {
                        for(var d = 0; d < h.length; ++d){
                            oa(t.doc, "", h[d].anchor, h[d].head, "drag");
                        }
                    }
                    t.replaceSelection(c, "around", "paste");
                    t.display.input.focus();
                }
            } catch (p) {}
        }
    }
    function oN(e, t) {
        if (l && (!e.state.draggingText || +new Date() - ok < 100)) {
            eS(t);
            return;
        }
        if (e$(e, t) || rw(e.display, t)) {
            return;
        }
        t.dataTransfer.setData("Text", e.getSelection());
        t.dataTransfer.effectAllowed = "copyMove";
        if (t.dataTransfer.setDragImage && !h) {
            var r = T("img", null, null, "position: fixed; left: 0; top: 0;");
            r.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (c) {
                r.width = r.height = 1;
                e.display.wrapper.appendChild(r);
                r._top = r.offsetTop;
            }
            t.dataTransfer.setDragImage(r, 0, 0);
            if (c) {
                r.parentNode.removeChild(r);
            }
        }
    }
    function oO(e, t) {
        var r = ii(e, t);
        if (!r) {
            return;
        }
        var i = document.createDocumentFragment();
        iv(e, r, i);
        if (!e.display.dragCursor) {
            e.display.dragCursor = T("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv);
        }
        k(e.display.dragCursor, i);
    }
    function oM(e) {
        if (e.display.dragCursor) {
            e.display.lineSpace.removeChild(e.display.dragCursor);
            e.display.dragCursor = null;
        }
    }
    function oA(e) {
        if (!document.getElementsByClassName) {
            return;
        }
        var t = document.getElementsByClassName("CodeMirror"), r = [];
        for(var i = 0; i < t.length; i++){
            var n = t[i].CodeMirror;
            if (n) {
                r.push(n);
            }
        }
        if (r.length) {
            r[0].operation(function() {
                for(var t = 0; t < r.length; t++){
                    e(r[t]);
                }
            });
        }
    }
    var o0 = false;
    function oW() {
        if (o0) {
            return;
        }
        oD();
        o0 = true;
    }
    function oD() {
        var e;
        ep(window, "resize", function() {
            if (e == null) {
                e = setTimeout(function() {
                    e = null;
                    oA(oH);
                }, 100);
            }
        });
        ep(window, "blur", function() {
            return oA(iw);
        });
    }
    function oH(e) {
        var t = e.display;
        t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null;
        t.scrollbarsClipped = false;
        e.setSize();
    }
    var oF = {
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
    for(var oP = 0; oP < 10; oP++){
        oF[oP + 48] = oF[oP + 96] = String(oP);
    }
    for(var o1 = 65; o1 <= 90; o1++){
        oF[o1] = String.fromCharCode(o1);
    }
    for(var oE = 1; oE <= 12; oE++){
        oF[oE + 111] = oF[oE + 63235] = "F" + oE;
    }
    var oz = {};
    oz.basic = {
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
    oz.pcDefault = {
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
    oz.emacsy = {
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
    oz.macDefault = {
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
    oz["default"] = $ ? oz.macDefault : oz.pcDefault;
    function oR(e) {
        var t = e.split(/-(?!$)/);
        e = t[t.length - 1];
        var r, i, n, o;
        for(var l = 0; l < t.length - 1; l++){
            var a = t[l];
            if (/^(cmd|meta|m)$/i.test(a)) {
                o = true;
            } else if (/^a(lt)?$/i.test(a)) {
                r = true;
            } else if (/^(c|ctrl|control)$/i.test(a)) {
                i = true;
            } else if (/^s(hift)?$/i.test(a)) {
                n = true;
            } else {
                throw new Error("Unrecognized modifier name: " + a);
            }
        }
        if (r) {
            e = "Alt-" + e;
        }
        if (i) {
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
    function oI(e) {
        var t = {};
        for(var r in e){
            if (e.hasOwnProperty(r)) {
                var i = e[r];
                if (/^(name|fallthrough|(de|at)tach)$/.test(r)) {
                    continue;
                }
                if (i == "...") {
                    delete e[r];
                    continue;
                }
                var n = q(r.split(" "), oR);
                for(var o = 0; o < n.length; o++){
                    var l = void 0, a = void 0;
                    if (o == n.length - 1) {
                        a = n.join(" ");
                        l = i;
                    } else {
                        a = n.slice(0, o + 1).join(" ");
                        l = "...";
                    }
                    var s = t[a];
                    if (!s) {
                        t[a] = l;
                    } else if (s != l) {
                        throw new Error("Inconsistent bindings for " + a);
                    }
                }
                delete e[r];
            }
        }
        for(var u in t){
            e[u] = t[u];
        }
        return e;
    }
    function o3(e, t, r, i) {
        t = o6(t);
        var n = t.call ? t.call(e, i) : t[e];
        if (n === false) {
            return "nothing";
        }
        if (n === "...") {
            return "multi";
        }
        if (n != null && r(n)) {
            return "handled";
        }
        if (t.fallthrough) {
            if (Object.prototype.toString.call(t.fallthrough) != "[object Array]") {
                return o3(e, t.fallthrough, r, i);
            }
            for(var o = 0; o < t.fallthrough.length; o++){
                var l = o3(e, t.fallthrough[o], r, i);
                if (l) {
                    return l;
                }
            }
        }
    }
    function oB(e) {
        var t = typeof e == "string" ? e : oF[e.keyCode];
        return (t == "Ctrl" || t == "Alt" || t == "Shift" || t == "Mod");
    }
    function o7(e, t, r) {
        var i = e;
        if (t.altKey && i != "Alt") {
            e = "Alt-" + e;
        }
        if ((w ? t.metaKey : t.ctrlKey) && i != "Ctrl") {
            e = "Ctrl-" + e;
        }
        if ((w ? t.ctrlKey : t.metaKey) && i != "Mod") {
            e = "Cmd-" + e;
        }
        if (!r && t.shiftKey && i != "Shift") {
            e = "Shift-" + e;
        }
        return e;
    }
    function o4(e, t) {
        if (c && e.keyCode == 34 && e["char"]) {
            return false;
        }
        var r = oF[e.keyCode];
        if (r == null || e.altGraphKey) {
            return false;
        }
        if (e.keyCode == 3 && e.code) {
            r = e.code;
        }
        return o7(r, e, t);
    }
    function o6(e) {
        return typeof e == "string" ? oz[e] : e;
    }
    function o5(e, t) {
        var r = e.doc.sel.ranges, i = [];
        for(var n = 0; n < r.length; n++){
            var o = t(r[n]);
            while(i.length && e9(o.from, Y(i).to) <= 0){
                var l = i.pop();
                if (e9(l.from, o.from) < 0) {
                    o.from = l.from;
                    break;
                }
            }
            i.push(o);
        }
        iX(e, function() {
            for(var t = i.length - 1; t >= 0; t--){
                oa(e.doc, "", i[t].from, i[t].to, "+delete");
            }
            iM(e);
        });
    }
    function o2(e, t, r) {
        var i = el(e.text, t + r, r);
        return i < 0 || i > e.text.length ? null : i;
    }
    function oG(e, t, r) {
        var i = o2(e, t.ch, r);
        return i == null ? null : new e8(t.line, i, r < 0 ? "after" : "before");
    }
    function oU(e, t, r, i, n) {
        if (e) {
            if (t.doc.direction == "rtl") {
                n = -n;
            }
            var o = eh(r, t.doc.direction);
            if (o) {
                var l = n < 0 ? Y(o) : o[0];
                var a = n < 0 == (l.level == 1);
                var s = a ? "after" : "before";
                var u;
                if (l.level > 0 || t.doc.direction == "rtl") {
                    var f = rW(t, r);
                    u = n < 0 ? r.text.length - 1 : 0;
                    var c = rD(t, f, u).top;
                    u = ea(function(e) {
                        return (rD(t, f, e).top == c);
                    }, n < 0 == (l.level == 1) ? l.from : l.to - 1, u);
                    if (s == "before") {
                        u = o2(r, u, 1);
                    }
                } else {
                    u = n < 0 ? l.to : l.from;
                }
                return new e8(i, u, s);
            }
        }
        return new e8(i, n < 0 ? r.text.length : 0, n < 0 ? "before" : "after");
    }
    function oV(e, t, r, i) {
        var n = eh(t, e.doc.direction);
        if (!n) {
            return oG(t, r, i);
        }
        if (r.ch >= t.text.length) {
            r.ch = t.text.length;
            r.sticky = "before";
        } else if (r.ch <= 0) {
            r.ch = 0;
            r.sticky = "after";
        }
        var o = ef(n, r.ch, r.sticky), l = n[o];
        if (e.doc.direction == "ltr" && l.level % 2 == 0 && (i > 0 ? l.to > r.ch : l.from < r.ch)) {
            return oG(t, r, i);
        }
        var a = function(e, r) {
            return o2(t, e instanceof e8 ? e.ch : e, r);
        };
        var s;
        var u = function(r) {
            if (!e.options.lineWrapping) {
                return {
                    begin: 0,
                    end: t.text.length
                };
            }
            s = s || rW(e, t);
            return rX(e, t, s, r);
        };
        var f = u(r.sticky == "before" ? a(r, -1) : r.ch);
        if (e.doc.direction == "rtl" || l.level == 1) {
            var c = (l.level == 1) == i < 0;
            var h = a(r, c ? 1 : -1);
            if (h != null && (!c ? h >= l.from && h >= f.begin : h <= l.to && h <= f.end)) {
                var d = c ? "before" : "after";
                return new e8(r.line, h, d);
            }
        }
        var p = function(e, t, i) {
            var o = function(e, t) {
                return t ? new e8(r.line, a(e, 1), "before") : new e8(r.line, e, "after");
            };
            for(; e >= 0 && e < n.length; e += t){
                var l = n[e];
                var s = t > 0 == (l.level != 1);
                var u = s ? i.begin : a(i.end, -1);
                if (l.from <= u && u < l.to) {
                    return o(u, s);
                }
                u = s ? l.from : a(l.to, -1);
                if (i.begin <= u && u < i.end) {
                    return o(u, s);
                }
            }
        };
        var v = p(o + i, i, f);
        if (v) {
            return v;
        }
        var g = i > 0 ? f.end : a(f.begin, -1);
        if (g != null && !(i > 0 && g == t.text.length)) {
            v = p(i > 0 ? 0 : n.length - 1, i, u(g));
            if (v) {
                return v;
            }
        }
        return null;
    }
    var oK = {
        selectAll: nJ,
        singleSelection: function(e) {
            return e.setSelection(e.getCursor("anchor"), e.getCursor("head"), G);
        },
        killLine: function(e) {
            return o5(e, function(t) {
                if (t.empty()) {
                    var r = e2(e.doc, t.head.line).text.length;
                    if (t.head.ch == r && t.head.line < e.lastLine()) {
                        return {
                            from: t.head,
                            to: e8(t.head.line + 1, 0)
                        };
                    } else {
                        return {
                            from: t.head,
                            to: e8(t.head.line, r)
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
                    from: e8(t.from().line, 0),
                    to: tt(e.doc, e8(t.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(e) {
            return o5(e, function(e) {
                return {
                    from: e8(e.from().line, 0),
                    to: e.from()
                };
            });
        },
        delWrappedLineLeft: function(e) {
            return o5(e, function(t) {
                var r = e.charCoords(t.head, "div").top + 5;
                var i = e.coordsChar({
                    left: 0,
                    top: r
                }, "div");
                return {
                    from: i,
                    to: t.from()
                };
            });
        },
        delWrappedLineRight: function(e) {
            return o5(e, function(t) {
                var r = e.charCoords(t.head, "div").top + 5;
                var i = e.coordsChar({
                    left: e.display.lineDiv.offsetWidth + 100,
                    top: r
                }, "div");
                return {
                    from: t.from(),
                    to: i
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
            return e.extendSelection(e8(e.firstLine(), 0));
        },
        goDocEnd: function(e) {
            return e.extendSelection(e8(e.lastLine()));
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
                return oY(e, t.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(e) {
            return e.extendSelectionsBy(function(t) {
                return oj(e, t.head.line);
            }, {
                origin: "+move",
                bias: -1
            });
        },
        goLineRight: function(e) {
            return e.extendSelectionsBy(function(t) {
                var r = e.cursorCoords(t.head, "div").top + 5;
                return e.coordsChar({
                    left: e.display.lineDiv.offsetWidth + 100,
                    top: r
                }, "div");
            }, V);
        },
        goLineLeft: function(e) {
            return e.extendSelectionsBy(function(t) {
                var r = e.cursorCoords(t.head, "div").top + 5;
                return e.coordsChar({
                    left: 0,
                    top: r
                }, "div");
            }, V);
        },
        goLineLeftSmart: function(e) {
            return e.extendSelectionsBy(function(t) {
                var r = e.cursorCoords(t.head, "div").top + 5;
                var i = e.coordsChar({
                    left: 0,
                    top: r
                }, "div");
                if (i.ch < e.getLine(i.line).search(/\S/)) {
                    return oY(e, t.head);
                }
                return i;
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
            var t = [], r = e.listSelections(), i = e.options.tabSize;
            for(var n = 0; n < r.length; n++){
                var o = r[n].from();
                var l = E(e.getLine(o.line), o.ch, i);
                t.push(j(i - (l % i)));
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
            return iX(e, function() {
                var t = e.listSelections(), r = [];
                for(var i = 0; i < t.length; i++){
                    if (!t[i].empty()) {
                        continue;
                    }
                    var n = t[i].head, o = e2(e.doc, n.line).text;
                    if (o) {
                        if (n.ch == o.length) {
                            n = new e8(n.line, n.ch - 1);
                        }
                        if (n.ch > 0) {
                            n = new e8(n.line, n.ch + 1);
                            e.replaceRange(o.charAt(n.ch - 1) + o.charAt(n.ch - 2), e8(n.line, n.ch - 2), n, "+transpose");
                        } else if (n.line > e.doc.first) {
                            var l = e2(e.doc, n.line - 1).text;
                            if (l) {
                                n = new e8(n.line, 1);
                                e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), e8(n.line - 1, l.length - 1), n, "+transpose");
                            }
                        }
                    }
                    r.push(new ny(n, n));
                }
                e.setSelections(r);
            });
        },
        newlineAndIndent: function(e) {
            return iX(e, function() {
                var t = e.listSelections();
                for(var r = t.length - 1; r >= 0; r--){
                    e.replaceRange(e.doc.lineSeparator(), t[r].anchor, t[r].head, "+input");
                }
                t = e.listSelections();
                for(var i = 0; i < t.length; i++){
                    e.indentLine(t[i].from().line, null, true);
                }
                iM(e);
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
        var r = e2(e.doc, t);
        var i = tz(r);
        if (i != r) {
            t = eK(i);
        }
        return oU(true, e, i, t, 1);
    }
    function oj(e, t) {
        var r = e2(e.doc, t);
        var i = tR(r);
        if (i != r) {
            t = eK(i);
        }
        return oU(true, e, r, t, -1);
    }
    function oY(e, t) {
        var r = oX(e, t.line);
        var i = e2(e.doc, r.line);
        var n = eh(i, e.doc.direction);
        if (!n || n[0].level == 0) {
            var o = Math.max(r.ch, i.text.search(/\S/));
            var l = t.line == r.line && t.ch <= o && t.ch;
            return e8(r.line, l ? 0 : o, r.sticky);
        }
        return r;
    }
    function o8(e, t, r) {
        if (typeof t == "string") {
            t = oK[t];
            if (!t) {
                return false;
            }
        }
        e.display.input.ensurePolled();
        var i = e.display.shift, n = false;
        try {
            if (e.isReadOnly()) {
                e.state.suppressEdits = true;
            }
            if (r) {
                e.display.shift = false;
            }
            n = t(e) != B;
        } finally{
            e.display.shift = i;
            e.state.suppressEdits = false;
        }
        return n;
    }
    function o9(e, t, r) {
        for(var i = 0; i < e.state.keyMaps.length; i++){
            var n = o3(t, e.state.keyMaps[i], r, e);
            if (n) {
                return n;
            }
        }
        return ((e.options.extraKeys && o3(t, e.options.extraKeys, r, e)) || o3(t, e.options.keyMap, r, e));
    }
    var oq = new z();
    function oZ(e, t, r, i) {
        var n = e.state.keySeq;
        if (n) {
            if (oB(t)) {
                return "handled";
            }
            if (/\'$/.test(t)) {
                e.state.keySeq = null;
            } else {
                oq.set(50, function() {
                    if (e.state.keySeq == n) {
                        e.state.keySeq = null;
                        e.display.input.reset();
                    }
                });
            }
            if (oQ(e, n + " " + t, r, i)) {
                return true;
            }
        }
        return oQ(e, t, r, i);
    }
    function oQ(e, t, r, i) {
        var n = o9(e, t, i);
        if (n == "multi") {
            e.state.keySeq = t;
        }
        if (n == "handled") {
            ra(e, "keyHandled", e, t, r);
        }
        if (n == "handled" || n == "multi") {
            ew(r);
            i$(e);
        }
        return !!n;
    }
    function oJ(e, t) {
        var r = o4(t, true);
        if (!r) {
            return false;
        }
        if (t.shiftKey && !e.state.keySeq) {
            return (oZ(e, "Shift-" + r, t, function(t) {
                return o8(e, t, true);
            }) || oZ(e, r, t, function(t) {
                if (typeof t == "string" ? /^go[A-Z]/.test(t) : t.motion) {
                    return o8(e, t);
                }
            }));
        } else {
            return oZ(e, r, t, function(t) {
                return o8(e, t);
            });
        }
    }
    function le(e, t, r) {
        return oZ(e, "'" + r + "'", t, function(t) {
            return o8(e, t, true);
        });
    }
    var lt = null;
    function lr(e) {
        var t = this;
        if (e.target && e.target != t.display.input.getField()) {
            return;
        }
        t.curOp.focus = A();
        if (e$(t, e)) {
            return;
        }
        if (l && a < 11 && e.keyCode == 27) {
            e.returnValue = false;
        }
        var i = e.keyCode;
        t.display.shift = i == 16 || e.shiftKey;
        var n = oJ(t, e);
        if (c) {
            lt = n ? i : null;
            if (!n && i == 88 && !eD && ($ ? e.metaKey : e.ctrlKey)) {
                t.replaceSelection("", null, "cut");
            }
        }
        if (r && !$ && !n && i == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) {
            document.execCommand("cut");
        }
        if (i == 18 && !/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className)) {
            li(t);
        }
    }
    function li(e) {
        var t = e.display.lineDiv;
        W(t, "CodeMirror-crosshair");
        function r(e) {
            if (e.keyCode == 18 || !e.altKey) {
                S(t, "CodeMirror-crosshair");
                eg(document, "keyup", r);
                eg(document, "mouseover", r);
            }
        }
        ep(document, "keyup", r);
        ep(document, "mouseover", r);
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
        if (rw(t.display, e) || e$(t, e) || (e.ctrlKey && !e.altKey) || ($ && e.metaKey)) {
            return;
        }
        var r = e.keyCode, i = e.charCode;
        if (c && r == lt) {
            lt = null;
            ew(e);
            return;
        }
        if (c && (!e.which || e.which < 10) && oJ(t, e)) {
            return;
        }
        var n = String.fromCharCode(i == null ? r : i);
        if (n == "\x08") {
            return;
        }
        if (le(t, e, n)) {
            return;
        }
        t.display.input.onKeyPress(e);
    }
    var ll = 400;
    var la = function(e, t, r) {
        this.time = e;
        this.pos = t;
        this.button = r;
    };
    la.prototype.compare = function(e, t, r) {
        return (this.time + ll > e && e9(t, this.pos) == 0 && r == this.button);
    };
    var ls, lu;
    function lf(e, t) {
        var r = +new Date();
        if (lu && lu.compare(r, e, t)) {
            ls = lu = null;
            return "triple";
        } else if (ls && ls.compare(r, e, t)) {
            lu = new la(r, e, t);
            ls = null;
            return "double";
        } else {
            ls = new la(r, e, t);
            lu = null;
            return "single";
        }
    }
    function lc(e) {
        var t = this, r = t.display;
        if (e$(t, e) || (r.activeTouch && r.input.supportsTouch())) {
            return;
        }
        r.input.ensurePolled();
        r.shift = e.shiftKey;
        if (rw(r, e)) {
            if (!s) {
                r.scroller.draggable = false;
                setTimeout(function() {
                    return (r.scroller.draggable = true);
                }, 100);
            }
            return;
        }
        if (lb(t, e)) {
            return;
        }
        var i = ii(t, e), n = ek(e), o = i ? lf(i, n) : "single";
        window.focus();
        if (n == 1 && t.state.selectingText) {
            t.state.selectingText(e);
        }
        if (i && lh(t, n, i, o, e)) {
            return;
        }
        if (n == 1) {
            if (i) {
                lp(t, i, o, e);
            } else if (eL(e) == r.scroller) {
                ew(e);
            }
        } else if (n == 2) {
            if (i) {
                n5(t.doc, i);
            }
            setTimeout(function() {
                return r.input.focus();
            }, 20);
        } else if (n == 3) {
            if (_) {
                t.display.input.onContextMenu(e);
            } else {
                ib(t);
            }
        }
    }
    function lh(e, t, r, i, n) {
        var o = "Click";
        if (i == "double") {
            o = "Double" + o;
        } else if (i == "triple") {
            o = "Triple" + o;
        }
        o = (t == 1 ? "Left" : t == 2 ? "Middle" : "Right") + o;
        return oZ(e, o7(o, n), n, function(t) {
            if (typeof t == "string") {
                t = oK[t];
            }
            if (!t) {
                return false;
            }
            var i = false;
            try {
                if (e.isReadOnly()) {
                    e.state.suppressEdits = true;
                }
                i = t(e, r) != B;
            } finally{
                e.state.suppressEdits = false;
            }
            return i;
        });
    }
    function ld(e, t, r) {
        var i = e.getOption("configureMouse");
        var n = i ? i(e, t, r) : {};
        if (n.unit == null) {
            var o = y ? r.shiftKey && r.metaKey : r.altKey;
            n.unit = o ? "rectangle" : t == "single" ? "char" : t == "double" ? "word" : "line";
        }
        if (n.extend == null || e.doc.extend) {
            n.extend = e.doc.extend || r.shiftKey;
        }
        if (n.addNew == null) {
            n.addNew = $ ? r.metaKey : r.ctrlKey;
        }
        if (n.moveOnDrag == null) {
            n.moveOnDrag = !($ ? r.altKey : r.ctrlKey);
        }
        return n;
    }
    function lp(e, t, r, i) {
        if (l) {
            setTimeout(F(iy, e), 0);
        } else {
            e.curOp.focus = A();
        }
        var n = ld(e, r, i);
        var o = e.doc.sel, a;
        if (e.options.dragDrop && eT && !e.isReadOnly() && r == "single" && (a = o.contains(t)) > -1 && (e9((a = o.ranges[a]).from(), t) < 0 || t.xRel > 0) && (e9(a.to(), t) > 0 || t.xRel < 0)) {
            lv(e, i, t, n);
        } else {
            lm(e, i, t, n);
        }
    }
    function lv(e, t, r, i) {
        var n = e.display, o = false;
        var u = ij(e, function(t) {
            if (s) {
                n.scroller.draggable = false;
            }
            e.state.draggingText = false;
            if (e.state.delayingBlurEvent) {
                if (e.hasFocus()) {
                    e.state.delayingBlurEvent = false;
                } else {
                    ib(e);
                }
            }
            eg(n.wrapper.ownerDocument, "mouseup", u);
            eg(n.wrapper.ownerDocument, "mousemove", f);
            eg(n.scroller, "dragstart", c);
            eg(n.scroller, "drop", u);
            if (!o) {
                ew(t);
                if (!i.addNew) {
                    n5(e.doc, r, null, null, i.extend);
                }
                if ((s && !h) || (l && a == 9)) {
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
        var f = function(e) {
            o = o || Math.abs(t.clientX - e.clientX) + Math.abs(t.clientY - e.clientY) >= 10;
        };
        var c = function() {
            return (o = true);
        };
        if (s) {
            n.scroller.draggable = true;
        }
        e.state.draggingText = u;
        u.copy = !i.moveOnDrag;
        ep(n.wrapper.ownerDocument, "mouseup", u);
        ep(n.wrapper.ownerDocument, "mousemove", f);
        ep(n.scroller, "dragstart", c);
        ep(n.scroller, "drop", u);
        e.state.delayingBlurEvent = true;
        setTimeout(function() {
            return n.input.focus();
        }, 20);
        if (n.scroller.dragDrop) {
            n.scroller.dragDrop();
        }
    }
    function lg(e, t, r) {
        if (r == "char") {
            return new ny(t, t);
        }
        if (r == "word") {
            return e.findWordAt(t);
        }
        if (r == "line") {
            return new ny(e8(t.line, 0), tt(e.doc, e8(t.line + 1, 0)));
        }
        var i = r(e, t);
        return new ny(i.from, i.to);
    }
    function lm(e, t, r, i) {
        if (l) {
            ib(e);
        }
        var n = e.display, o = e.doc;
        ew(t);
        var a, s, u = o.sel, f = u.ranges;
        if (i.addNew && !i.extend) {
            s = o.sel.contains(r);
            if (s > -1) {
                a = f[s];
            } else {
                a = new ny(r, r);
            }
        } else {
            a = o.sel.primary();
            s = o.sel.primIndex;
        }
        if (i.unit == "rectangle") {
            if (!i.addNew) {
                a = new ny(r, r);
            }
            r = ii(e, t, true, true);
            s = -1;
        } else {
            var c = lg(e, r, i.unit);
            if (i.extend) {
                a = n6(a, c.anchor, c.head, i.extend);
            } else {
                a = c;
            }
        }
        if (!i.addNew) {
            s = 0;
            nX(o, new n$([
                a
            ], 0), U);
            u = o.sel;
        } else if (s == -1) {
            s = f.length;
            nX(o, nb(e, f.concat([
                a
            ]), s), {
                scroll: false,
                origin: "*mouse"
            });
        } else if (f.length > 1 && f[s].empty() && i.unit == "char" && !i.extend) {
            nX(o, nb(e, f.slice(0, s).concat(f.slice(s + 1)), 0), {
                scroll: false,
                origin: "*mouse"
            });
            u = o.sel;
        } else {
            nG(o, s, a, U);
        }
        var h = r;
        function d(t) {
            if (e9(h, t) == 0) {
                return;
            }
            h = t;
            if (i.unit == "rectangle") {
                var n = [], l = e.options.tabSize;
                var f = E(e2(o, r.line).text, r.ch, l);
                var c = E(e2(o, t.line).text, t.ch, l);
                var d = Math.min(f, c), p = Math.max(f, c);
                for(var v = Math.min(r.line, t.line), g = Math.min(e.lastLine(), Math.max(r.line, t.line)); v <= g; v++){
                    var m = e2(o, v).text, $ = K(m, d, l);
                    if (d == p) {
                        n.push(new ny(e8(v, $), e8(v, $)));
                    } else if (m.length > $) {
                        n.push(new ny(e8(v, $), e8(v, K(m, p, l))));
                    }
                }
                if (!n.length) {
                    n.push(new ny(r, r));
                }
                nX(o, nb(e, u.ranges.slice(0, s).concat(n), s), {
                    origin: "*mouse",
                    scroll: false
                });
                e.scrollIntoView(t);
            } else {
                var y = a;
                var b = lg(e, t, i.unit);
                var x = y.anchor, w;
                if (e9(b.anchor, x) > 0) {
                    w = b.head;
                    x = eJ(y.from(), b.anchor);
                } else {
                    w = b.anchor;
                    x = eQ(y.to(), b.head);
                }
                var _ = u.ranges.slice(0);
                _[s] = l$(e, new ny(tt(o, x), w));
                nX(o, nb(e, _, s), U);
            }
        }
        var p = n.wrapper.getBoundingClientRect();
        var v = 0;
        function g(t) {
            var r = ++v;
            var l = ii(e, t, true, i.unit == "rectangle");
            if (!l) {
                return;
            }
            if (e9(l, h) != 0) {
                e.curOp.focus = A();
                d(l);
                var a = iS(n, o);
                if (l.line >= a.to || l.line < a.from) {
                    setTimeout(ij(e, function() {
                        if (v == r) {
                            g(t);
                        }
                    }), 150);
                }
            } else {
                var s = t.clientY < p.top ? -20 : t.clientY > p.bottom ? 20 : 0;
                if (s) {
                    setTimeout(ij(e, function() {
                        if (v != r) {
                            return;
                        }
                        n.scroller.scrollTop += s;
                        g(t);
                    }), 50);
                }
            }
        }
        function m(t) {
            e.state.selectingText = false;
            v = Infinity;
            if (t) {
                ew(t);
                n.input.focus();
            }
            eg(n.wrapper.ownerDocument, "mousemove", $);
            eg(n.wrapper.ownerDocument, "mouseup", y);
            o.history.lastSelOrigin = null;
        }
        var $ = ij(e, function(e) {
            if (e.buttons === 0 || !ek(e)) {
                m(e);
            } else {
                g(e);
            }
        });
        var y = ij(e, m);
        e.state.selectingText = y;
        ep(n.wrapper.ownerDocument, "mousemove", $);
        ep(n.wrapper.ownerDocument, "mouseup", y);
    }
    function l$(e, t) {
        var r = t.anchor;
        var i = t.head;
        var n = e2(e.doc, r.line);
        if (e9(r, i) == 0 && r.sticky == i.sticky) {
            return t;
        }
        var o = eh(n);
        if (!o) {
            return t;
        }
        var l = ef(o, r.ch, r.sticky), a = o[l];
        if (a.from != r.ch && a.to != r.ch) {
            return t;
        }
        var s = l + ((a.from == r.ch) == (a.level != 1) ? 0 : 1);
        if (s == 0 || s == o.length) {
            return t;
        }
        var u;
        if (i.line != r.line) {
            u = (i.line - r.line) * (e.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
            var f = ef(o, i.ch, i.sticky);
            var c = f - l || (i.ch - r.ch) * (a.level == 1 ? -1 : 1);
            if (f == s - 1 || f == s) {
                u = c < 0;
            } else {
                u = c > 0;
            }
        }
        var h = o[s + (u ? -1 : 0)];
        var d = u == (h.level == 1);
        var p = d ? h.from : h.to, v = d ? "after" : "before";
        return r.ch == p && r.sticky == v ? t : new ny(new e8(r.line, p, v), i);
    }
    function ly(e, t, r, i) {
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
        if (i) {
            ew(t);
        }
        var a = e.display;
        var s = a.lineDiv.getBoundingClientRect();
        if (o > s.bottom || !eb(e, r)) {
            return eC(t);
        }
        o -= s.top - a.viewOffset;
        for(var u = 0; u < e.display.gutterSpecs.length; ++u){
            var f = a.gutters.childNodes[u];
            if (f && f.getBoundingClientRect().right >= n) {
                var c = eX(e.doc, o);
                var h = e.display.gutterSpecs[u];
                em(e, r, e, c, h.className, t);
                return eC(t);
            }
        }
    }
    function lb(e, t) {
        return ly(e, t, "gutterClick", true);
    }
    function lx(e, t) {
        if (rw(e.display, t) || lw(e, t)) {
            return;
        }
        if (e$(e, t, "contextmenu")) {
            return;
        }
        if (!_) {
            e.display.input.onContextMenu(t);
        }
    }
    function lw(e, t) {
        if (!eb(e, "gutterContextMenu")) {
            return false;
        }
        return ly(e, t, "gutterContextMenu", false);
    }
    function l_(e) {
        e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        rI(e);
    }
    var lC = {
        toString: function() {
            return "CodeMirror.Init";
        }
    };
    var lS = {};
    var lL = {};
    function lk(e) {
        var t = e.optionHandlers;
        function r(r, i, n, o) {
            e.defaults[r] = i;
            if (n) {
                t[r] = o ? function(e, t, r) {
                    if (r != lC) {
                        n(e, t, r);
                    }
                } : n;
            }
        }
        e.defineOption = r;
        e.Init = lC;
        r("value", "", function(e, t) {
            return e.setValue(t);
        }, true);
        r("mode", null, function(e, t) {
            e.doc.modeOption = t;
            nk(e);
        }, true);
        r("indentUnit", 2, nk, true);
        r("indentWithTabs", false);
        r("smartIndent", true);
        r("tabSize", 4, function(e) {
            nT(e);
            rI(e);
            il(e);
        }, true);
        r("lineSeparator", null, function(e, t) {
            e.doc.lineSep = t;
            if (!t) {
                return;
            }
            var r = [], i = e.doc.first;
            e.doc.iter(function(e) {
                for(var n = 0;;){
                    var o = e.text.indexOf(t, n);
                    if (o == -1) {
                        break;
                    }
                    n = o + t.length;
                    r.push(e8(i, o));
                }
                i++;
            });
            for(var n = r.length - 1; n >= 0; n--){
                oa(e.doc, t, r[n], e8(r[n].line, r[n].ch + t.length));
            }
        });
        r("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(e, t, r) {
            e.state.specialChars = new RegExp(t.source + (t.test("\t") ? "" : "|\t"), "g");
            if (r != lC) {
                e.refresh();
            }
        });
        r("specialCharPlaceholder", t8, function(e) {
            return e.refresh();
        }, true);
        r("electricChars", true);
        r("inputStyle", m ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        r("spellcheck", false, function(e, t) {
            return (e.getInputField().spellcheck = t);
        }, true);
        r("autocorrect", false, function(e, t) {
            return (e.getInputField().autocorrect = t);
        }, true);
        r("autocapitalize", false, function(e, t) {
            return (e.getInputField().autocapitalize = t);
        }, true);
        r("rtlMoveVisually", !b);
        r("wholeLineUpdateBefore", true);
        r("theme", "default", function(e) {
            l_(e);
            nc(e);
        }, true);
        r("keyMap", "default", function(e, t, r) {
            var i = o6(t);
            var n = r != lC && o6(r);
            if (n && n.detach) {
                n.detach(e, i);
            }
            if (i.attach) {
                i.attach(e, n || null);
            }
        });
        r("extraKeys", null);
        r("configureMouse", null);
        r("lineWrapping", false, lN, true);
        r("gutters", [], function(e, t) {
            e.display.gutterSpecs = nu(t, e.options.lineNumbers);
            nc(e);
        }, true);
        r("fixedGutter", true, function(e, t) {
            e.display.gutters.style.left = t ? ie(e.display) + "px" : "0";
            e.refresh();
        }, true);
        r("coverGutterNextToScrollbar", false, function(e) {
            return iR(e);
        }, true);
        r("scrollbarStyle", "native", function(e) {
            iB(e);
            iR(e);
            e.display.scrollbars.setScrollTop(e.doc.scrollTop);
            e.display.scrollbars.setScrollLeft(e.doc.scrollLeft);
        }, true);
        r("lineNumbers", false, function(e, t) {
            e.display.gutterSpecs = nu(e.options.gutters, t);
            nc(e);
        }, true);
        r("firstLineNumber", 1, nc, true);
        r("lineNumberFormatter", function(e) {
            return e;
        }, nc, true);
        r("showCursorWhenSelecting", false, id, true);
        r("resetSelectionOnContextMenu", true);
        r("lineWiseCopyCut", true);
        r("pasteLinesPerSelection", true);
        r("selectionsMayTouch", false);
        r("readOnly", false, function(e, t) {
            if (t == "nocursor") {
                iw(e);
                e.display.input.blur();
            }
            e.display.input.readOnlyChanged(t);
        });
        r("screenReaderLabel", null, function(e, t) {
            t = t === "" ? null : t;
            e.display.input.screenReaderLabelChanged(t);
        });
        r("disableInput", false, function(e, t) {
            if (!t) {
                e.display.input.reset();
            }
        }, true);
        r("dragDrop", true, lT);
        r("allowDropFileTypes", null);
        r("cursorBlinkRate", 530);
        r("cursorScrollMargin", 0);
        r("cursorHeight", 1, id, true);
        r("singleCursorHeightPerLine", true, id, true);
        r("workTime", 100);
        r("workDelay", 100);
        r("flattenSpans", true, nT, true);
        r("addModeClass", false, nT, true);
        r("pollInterval", 100);
        r("undoDepth", 200, function(e, t) {
            return (e.doc.history.undoDepth = t);
        });
        r("historyEventDelay", 1250);
        r("viewportMargin", 10, function(e) {
            return e.refresh();
        }, true);
        r("maxHighlightLength", 10000, nT, true);
        r("moveInputWithCursor", true, function(e, t) {
            if (!t) {
                e.display.input.resetPosition();
            }
        });
        r("tabindex", null, function(e, t) {
            return (e.display.input.getField().tabIndex = t || "");
        });
        r("autofocus", null);
        r("direction", "ltr", function(e, t) {
            return e.doc.setDirection(t);
        }, true);
        r("phrases", null);
    }
    function lT(e, t, r) {
        var i = r && r != lC;
        if (!t != !i) {
            var n = e.display.dragFunctions;
            var o = t ? ep : eg;
            o(e.display.scroller, "dragstart", n.start);
            o(e.display.scroller, "dragenter", n.enter);
            o(e.display.scroller, "dragover", n.over);
            o(e.display.scroller, "dragleave", n.leave);
            o(e.display.scroller, "drop", n.drop);
        }
    }
    function lN(e) {
        if (e.options.lineWrapping) {
            W(e.display.wrapper, "CodeMirror-wrap");
            e.display.sizer.style.minWidth = "";
            e.display.sizerWidth = null;
        } else {
            S(e.display.wrapper, "CodeMirror-wrap");
            t2(e);
        }
        ir(e);
        il(e);
        rI(e);
        setTimeout(function() {
            return iR(e);
        }, 100);
    }
    function lO(e, t) {
        var r = this;
        if (!(this instanceof lO)) {
            return new lO(e, t);
        }
        this.options = t = t ? P(t) : {};
        P(lS, t, false);
        var i = t.value;
        if (typeof i == "string") {
            i = new oL(i, t.mode, null, t.lineSeparator, t.direction);
        } else if (t.mode) {
            i.modeOption = t.mode;
        }
        this.doc = i;
        var n = new lO.inputStyles[t.inputStyle](this);
        var o = (this.display = new nh(e, i, n, t));
        o.wrapper.CodeMirror = this;
        l_(this);
        if (t.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap";
        }
        iB(this);
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
        if (t.autofocus && !m) {
            o.input.focus();
        }
        if (l && a < 11) {
            setTimeout(function() {
                return r.display.input.reset(true);
            }, 20);
        }
        lM(this);
        oW();
        i4(this);
        this.curOp.forceUpdate = true;
        nA(this, i);
        if ((t.autofocus && !m) || this.hasFocus()) {
            setTimeout(function() {
                if (r.hasFocus() && !r.state.focused) {
                    ix(r);
                }
            }, 20);
        } else {
            iw(this);
        }
        for(var u in lL){
            if (lL.hasOwnProperty(u)) {
                lL[u](this, t[u], lC);
            }
        }
        ns(this);
        if (t.finishInit) {
            t.finishInit(this);
        }
        for(var f = 0; f < lA.length; ++f){
            lA[f](this);
        }
        i6(this);
        if (s && t.lineWrapping && getComputedStyle(o.lineDiv).textRendering == "optimizelegibility") {
            o.lineDiv.style.textRendering = "auto";
        }
    }
    lO.defaults = lS;
    lO.optionHandlers = lL;
    function lM(e) {
        var t = e.display;
        ep(t.scroller, "mousedown", ij(e, lc));
        if (l && a < 11) {
            ep(t.scroller, "dblclick", ij(e, function(t) {
                if (e$(e, t)) {
                    return;
                }
                var r = ii(e, t);
                if (!r || lb(e, t) || rw(e.display, t)) {
                    return;
                }
                ew(t);
                var i = e.findWordAt(r);
                n5(e.doc, i.anchor, i.head);
            }));
        } else {
            ep(t.scroller, "dblclick", function(t) {
                return e$(e, t) || ew(t);
            });
        }
        ep(t.scroller, "contextmenu", function(t) {
            return lx(e, t);
        });
        ep(t.input.getField(), "contextmenu", function(r) {
            if (!t.scroller.contains(r.target)) {
                lx(e, r);
            }
        });
        var r, i = {
            end: 0
        };
        function n() {
            if (t.activeTouch) {
                r = setTimeout(function() {
                    return (t.activeTouch = null);
                }, 1000);
                i = t.activeTouch;
                i.end = +new Date();
            }
        }
        function o(e) {
            if (e.touches.length != 1) {
                return false;
            }
            var t = e.touches[0];
            return t.radiusX <= 1 && t.radiusY <= 1;
        }
        function s(e, t) {
            if (t.left == null) {
                return true;
            }
            var r = t.left - e.left, i = t.top - e.top;
            return r * r + i * i > 20 * 20;
        }
        ep(t.scroller, "touchstart", function(n) {
            if (!e$(e, n) && !o(n) && !lb(e, n)) {
                t.input.ensurePolled();
                clearTimeout(r);
                var l = +new Date();
                t.activeTouch = {
                    start: l,
                    moved: false,
                    prev: l - i.end <= 300 ? i : null
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
        ep(t.scroller, "touchend", function(r) {
            var i = t.activeTouch;
            if (i && !rw(t, r) && i.left != null && !i.moved && new Date() - i.start < 300) {
                var o = e.coordsChar(t.activeTouch, "page"), l;
                if (!i.prev || s(i, i.prev)) {
                    l = new ny(o, o);
                } else if (!i.prev.prev || s(i, i.prev.prev)) {
                    l = e.findWordAt(o);
                } else {
                    l = new ny(e8(o.line, 0), tt(e.doc, e8(o.line + 1, 0)));
                }
                e.setSelection(l.anchor, l.head);
                e.focus();
                ew(r);
            }
            n();
        });
        ep(t.scroller, "touchcancel", n);
        ep(t.scroller, "scroll", function() {
            if (t.scroller.clientHeight) {
                iH(e, t.scroller.scrollTop);
                iP(e, t.scroller.scrollLeft, true);
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
                    oO(e, t);
                    eS(t);
                }
            },
            start: function(t) {
                return oN(e, t);
            },
            drop: ij(e, oT),
            leave: function(t) {
                if (!e$(e, t)) {
                    oM(e);
                }
            }
        };
        var u = t.input.getField();
        ep(u, "keyup", function(t) {
            return ln.call(e, t);
        });
        ep(u, "keydown", ij(e, lr));
        ep(u, "keypress", ij(e, lo));
        ep(u, "focus", function(t) {
            return ix(e, t);
        });
        ep(u, "blur", function(t) {
            return iw(e, t);
        });
    }
    var lA = [];
    lO.defineInitHook = function(e) {
        return lA.push(e);
    };
    function l0(e, t, r, i) {
        var n = e.doc, o;
        if (r == null) {
            r = "add";
        }
        if (r == "smart") {
            if (!n.mode.indent) {
                r = "prev";
            } else {
                o = ts(e, t).state;
            }
        }
        var l = e.options.tabSize;
        var a = e2(n, t), s = E(a.text, null, l);
        if (a.stateAfter) {
            a.stateAfter = null;
        }
        var u = a.text.match(/^\s*/)[0], f;
        if (!i && !/\S/.test(a.text)) {
            f = 0;
            r = "not";
        } else if (r == "smart") {
            f = n.mode.indent(o, a.text.slice(u.length), a.text);
            if (f == B || f > 150) {
                if (!i) {
                    return;
                }
                r = "prev";
            }
        }
        if (r == "prev") {
            if (t > n.first) {
                f = E(e2(n, t - 1).text, null, l);
            } else {
                f = 0;
            }
        } else if (r == "add") {
            f = s + e.options.indentUnit;
        } else if (r == "subtract") {
            f = s - e.options.indentUnit;
        } else if (typeof r == "number") {
            f = s + r;
        }
        f = Math.max(0, f);
        var c = "", h = 0;
        if (e.options.indentWithTabs) {
            for(var d = Math.floor(f / l); d; --d){
                h += l;
                c += "\t";
            }
        }
        if (h < f) {
            c += j(f - h);
        }
        if (c != u) {
            oa(n, c, e8(t, 0), e8(t, u.length), "+input");
            a.stateAfter = null;
            return true;
        } else {
            for(var p = 0; p < n.sel.ranges.length; p++){
                var v = n.sel.ranges[p];
                if (v.head.line == t && v.head.ch < u.length) {
                    var g = e8(t, u.length);
                    nG(n, p, new ny(g, g));
                    break;
                }
            }
        }
    }
    var lW = null;
    function lD(e) {
        lW = e;
    }
    function lH(e, t, r, i, n) {
        var o = e.doc;
        e.display.shift = false;
        if (!i) {
            i = o.sel;
        }
        var l = +new Date() - 200;
        var a = n == "paste" || e.state.pasteIncoming > l;
        var s = e0(t), u = null;
        if (a && i.ranges.length > 1) {
            if (lW && lW.text.join("\n") == t) {
                if (i.ranges.length % lW.text.length == 0) {
                    u = [];
                    for(var f = 0; f < lW.text.length; f++){
                        u.push(o.splitLines(lW.text[f]));
                    }
                }
            } else if (s.length == i.ranges.length && e.options.pasteLinesPerSelection) {
                u = q(s, function(e) {
                    return [
                        e
                    ];
                });
            }
        }
        var c = e.curOp.updateInput;
        for(var h = i.ranges.length - 1; h >= 0; h--){
            var d = i.ranges[h];
            var p = d.from(), v = d.to();
            if (d.empty()) {
                if (r && r > 0) {
                    p = e8(p.line, p.ch - r);
                } else if (e.state.overwrite && !a) {
                    v = e8(v.line, Math.min(e2(o, v.line).text.length, v.ch + Y(s).length));
                } else if (a && lW && lW.lineWise && lW.text.join("\n") == s.join("\n")) {
                    p = v = e8(p.line, 0);
                }
            }
            var g = {
                from: p,
                to: v,
                text: u ? u[h % u.length] : s,
                origin: n || (a ? "paste" : e.state.cutIncoming > l ? "cut" : "+input")
            };
            ot(e.doc, g);
            ra(e, "inputRead", e, g);
        }
        if (t && !a) {
            lP(e, t);
        }
        iM(e);
        if (e.curOp.updateInput < 2) {
            e.curOp.updateInput = c;
        }
        e.curOp.typing = true;
        e.state.pasteIncoming = e.state.cutIncoming = -1;
    }
    function lF(e, t) {
        var r = e.clipboardData && e.clipboardData.getData("Text");
        if (r) {
            e.preventDefault();
            if (!t.isReadOnly() && !t.options.disableInput) {
                iX(t, function() {
                    return lH(t, r, 0, null, "paste");
                });
            }
            return true;
        }
    }
    function lP(e, t) {
        if (!e.options.electricChars || !e.options.smartIndent) {
            return;
        }
        var r = e.doc.sel;
        for(var i = r.ranges.length - 1; i >= 0; i--){
            var n = r.ranges[i];
            if (n.head.ch > 100 || (i && r.ranges[i - 1].head.line == n.head.line)) {
                continue;
            }
            var o = e.getModeAt(n.head);
            var l = false;
            if (o.electricChars) {
                for(var a = 0; a < o.electricChars.length; a++){
                    if (t.indexOf(o.electricChars.charAt(a)) > -1) {
                        l = l0(e, n.head.line, "smart");
                        break;
                    }
                }
            } else if (o.electricInput) {
                if (o.electricInput.test(e2(e.doc, n.head.line).text.slice(0, n.head.ch))) {
                    l = l0(e, n.head.line, "smart");
                }
            }
            if (l) {
                ra(e, "electricInput", e, n.head.line);
            }
        }
    }
    function l1(e) {
        var t = [], r = [];
        for(var i = 0; i < e.doc.sel.ranges.length; i++){
            var n = e.doc.sel.ranges[i].head.line;
            var o = {
                anchor: e8(n, 0),
                head: e8(n + 1, 0)
            };
            r.push(o);
            t.push(e.getRange(o.anchor, o.head));
        }
        return {
            text: t,
            ranges: r
        };
    }
    function lE(e, t, r, i) {
        e.setAttribute("autocorrect", r ? "" : "off");
        e.setAttribute("autocapitalize", i ? "" : "off");
        e.setAttribute("spellcheck", !!t);
    }
    function lz() {
        var e = T("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var t = T("div", [
            e
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (s) {
            e.style.width = "1000px";
        } else {
            e.setAttribute("wrap", "off");
        }
        if (v) {
            e.style.border = "1px solid black";
        }
        lE(e);
        return t;
    }
    function lR(e) {
        var t = e.optionHandlers;
        var r = (e.helpers = {});
        e.prototype = {
            constructor: e,
            focus: function() {
                window.focus();
                this.display.input.focus();
            },
            setOption: function(e, r) {
                var i = this.options, n = i[e];
                if (i[e] == r && e != "mode") {
                    return;
                }
                i[e] = r;
                if (t.hasOwnProperty(e)) {
                    ij(this, t[e])(this, r, n);
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
                for(var r = 0; r < t.length; ++r){
                    if (t[r] == e || t[r].name == e) {
                        t.splice(r, 1);
                        return true;
                    }
                }
            },
            addOverlay: iY(function(t, r) {
                var i = t.token ? t : e.getMode(this.options, t);
                if (i.startState) {
                    throw new Error("Overlays may not be stateful.");
                }
                Z(this.state.overlays, {
                    mode: i,
                    modeSpec: t,
                    opaque: r && r.opaque,
                    priority: (r && r.priority) || 0
                }, function(e) {
                    return e.priority;
                });
                this.state.modeGen++;
                il(this);
            }),
            removeOverlay: iY(function(e) {
                var t = this.state.overlays;
                for(var r = 0; r < t.length; ++r){
                    var i = t[r].modeSpec;
                    if (i == e || (typeof e == "string" && i.name == e)) {
                        t.splice(r, 1);
                        this.state.modeGen++;
                        il(this);
                        return;
                    }
                }
            }),
            indentLine: iY(function(e, t, r) {
                if (typeof t != "string" && typeof t != "number") {
                    if (t == null) {
                        t = this.options.smartIndent ? "smart" : "prev";
                    } else {
                        t = t ? "add" : "subtract";
                    }
                }
                if (ej(this.doc, e)) {
                    l0(this, e, t, r);
                }
            }),
            indentSelection: iY(function(e) {
                var t = this.doc.sel.ranges, r = -1;
                for(var i = 0; i < t.length; i++){
                    var n = t[i];
                    if (!n.empty()) {
                        var o = n.from(), l = n.to();
                        var a = Math.max(r, o.line);
                        r = Math.min(this.lastLine(), l.line - (l.ch ? 0 : 1)) + 1;
                        for(var s = a; s < r; ++s){
                            l0(this, s, e);
                        }
                        var u = this.doc.sel.ranges;
                        if (o.ch == 0 && t.length == u.length && u[i].from().ch > 0) {
                            nG(this.doc, i, new ny(o, u[i].to()), G);
                        }
                    } else if (n.head.line > r) {
                        l0(this, n.head.line, e, true);
                        r = n.head.line;
                        if (i == this.doc.sel.primIndex) {
                            iM(this);
                        }
                    }
                }
            }),
            getTokenAt: function(e, t) {
                return td(this, e, t);
            },
            getLineTokens: function(e, t) {
                return td(this, e8(e), t, true);
            },
            getTokenTypeAt: function(e) {
                e = tt(this.doc, e);
                var t = ta(this, e2(this.doc, e.line));
                var r = 0, i = (t.length - 1) / 2, n = e.ch;
                var o;
                if (n == 0) {
                    o = t[2];
                } else {
                    for(;;){
                        var l = (r + i) >> 1;
                        if ((l ? t[l * 2 - 1] : 0) >= n) {
                            i = l;
                        } else if (t[l * 2 + 1] < n) {
                            r = l + 1;
                        } else {
                            o = t[l * 2 + 2];
                            break;
                        }
                    }
                }
                var a = o ? o.indexOf("overlay ") : -1;
                return a < 0 ? o : a == 0 ? null : o.slice(0, a - 1);
            },
            getModeAt: function(t) {
                var r = this.doc.mode;
                if (!r.innerMode) {
                    return r;
                }
                return e.innerMode(r, this.getTokenAt(t).state).mode;
            },
            getHelper: function(e, t) {
                return this.getHelpers(e, t)[0];
            },
            getHelpers: function(e, t) {
                var i = [];
                if (!r.hasOwnProperty(t)) {
                    return i;
                }
                var n = r[t], o = this.getModeAt(e);
                if (typeof o[t] == "string") {
                    if (n[o[t]]) {
                        i.push(n[o[t]]);
                    }
                } else if (o[t]) {
                    for(var l = 0; l < o[t].length; l++){
                        var a = n[o[t][l]];
                        if (a) {
                            i.push(a);
                        }
                    }
                } else if (o.helperType && n[o.helperType]) {
                    i.push(n[o.helperType]);
                } else if (n[o.name]) {
                    i.push(n[o.name]);
                }
                for(var s = 0; s < n._global.length; s++){
                    var u = n._global[s];
                    if (u.pred(o, this) && R(i, u.val) == -1) {
                        i.push(u.val);
                    }
                }
                return i;
            },
            getStateAfter: function(e, t) {
                var r = this.doc;
                e = te(r, e == null ? r.first + r.size - 1 : e);
                return ts(this, e + 1, t).state;
            },
            cursorCoords: function(e, t) {
                var r, i = this.doc.sel.primary();
                if (e == null) {
                    r = i.head;
                } else if (typeof e == "object") {
                    r = tt(this.doc, e);
                } else {
                    r = e ? i.from() : i.to();
                }
                return r2(this, r, t || "page");
            },
            charCoords: function(e, t) {
                return r5(this, tt(this.doc, e), t || "page");
            },
            coordsChar: function(e, t) {
                e = r6(this, e, t || "page");
                return rV(this, e.left, e.top);
            },
            lineAtHeight: function(e, t) {
                e = r6(this, {
                    top: e,
                    left: 0
                }, t || "page").top;
                return eX(this.doc, e + this.display.viewOffset);
            },
            heightAtLine: function(e, t, r) {
                var i = false, n;
                if (typeof e == "number") {
                    var o = this.doc.first + this.doc.size - 1;
                    if (e < this.doc.first) {
                        e = this.doc.first;
                    } else if (e > o) {
                        e = o;
                        i = true;
                    }
                    n = e2(this.doc, e);
                } else {
                    n = e;
                }
                return (r4(this, n, {
                    top: 0,
                    left: 0
                }, t || "page", r || i).top + (i ? this.doc.height - t6(n) : 0));
            },
            defaultTextHeight: function() {
                return rZ(this.display);
            },
            defaultCharWidth: function() {
                return rQ(this.display);
            },
            getViewport: function() {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function(e, t, r, i, n) {
                var o = this.display;
                e = r2(this, tt(this.doc, e));
                var l = e.bottom, a = e.left;
                t.style.position = "absolute";
                t.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(t);
                o.sizer.appendChild(t);
                if (i == "over") {
                    l = e.top;
                } else if (i == "above" || i == "near") {
                    var s = Math.max(o.wrapper.clientHeight, this.doc.height), u = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
                    if ((i == "above" || e.bottom + t.offsetHeight > s) && e.top > t.offsetHeight) {
                        l = e.top - t.offsetHeight;
                    } else if (e.bottom + t.offsetHeight <= s) {
                        l = e.bottom;
                    }
                    if (a + t.offsetWidth > u) {
                        a = u - t.offsetWidth;
                    }
                }
                t.style.top = l + "px";
                t.style.left = t.style.right = "";
                if (n == "right") {
                    a = o.sizer.clientWidth - t.offsetWidth;
                    t.style.right = "0px";
                } else {
                    if (n == "left") {
                        a = 0;
                    } else if (n == "middle") {
                        a = (o.sizer.clientWidth - t.offsetWidth) / 2;
                    }
                    t.style.left = a + "px";
                }
                if (r) {
                    iT(this, {
                        left: a,
                        top: l,
                        right: a + t.offsetWidth,
                        bottom: l + t.offsetHeight
                    });
                }
            },
            triggerOnKeyDown: iY(lr),
            triggerOnKeyPress: iY(lo),
            triggerOnKeyUp: ln,
            triggerOnMouseDown: iY(lc),
            execCommand: function(e) {
                if (oK.hasOwnProperty(e)) {
                    return oK[e].call(null, this);
                }
            },
            triggerElectric: iY(function(e) {
                lP(this, e);
            }),
            findPosH: function(e, t, r, i) {
                var n = 1;
                if (t < 0) {
                    n = -1;
                    t = -t;
                }
                var o = tt(this.doc, e);
                for(var l = 0; l < t; ++l){
                    o = lI(this.doc, o, n, r, i);
                    if (o.hitSide) {
                        break;
                    }
                }
                return o;
            },
            moveH: iY(function(e, t) {
                var r = this;
                this.extendSelectionsBy(function(i) {
                    if (r.display.shift || r.doc.extend || i.empty()) {
                        return lI(r.doc, i.head, e, t, r.options.rtlMoveVisually);
                    } else {
                        return e < 0 ? i.from() : i.to();
                    }
                }, V);
            }),
            deleteH: iY(function(e, t) {
                var r = this.doc.sel, i = this.doc;
                if (r.somethingSelected()) {
                    i.replaceSelection("", null, "+delete");
                } else {
                    o5(this, function(r) {
                        var n = lI(i, r.head, e, t, false);
                        return e < 0 ? {
                            from: n,
                            to: r.head
                        } : {
                            from: r.head,
                            to: n
                        };
                    });
                }
            }),
            findPosV: function(e, t, r, i) {
                var n = 1, o = i;
                if (t < 0) {
                    n = -1;
                    t = -t;
                }
                var l = tt(this.doc, e);
                for(var a = 0; a < t; ++a){
                    var s = r2(this, l, "div");
                    if (o == null) {
                        o = s.left;
                    } else {
                        s.left = o;
                    }
                    l = l3(this, s, n, r);
                    if (l.hitSide) {
                        break;
                    }
                }
                return l;
            },
            moveV: iY(function(e, t) {
                var r = this;
                var i = this.doc, n = [];
                var o = !this.display.shift && !i.extend && i.sel.somethingSelected();
                i.extendSelectionsBy(function(l) {
                    if (o) {
                        return e < 0 ? l.from() : l.to();
                    }
                    var a = r2(r, l.head, "div");
                    if (l.goalColumn != null) {
                        a.left = l.goalColumn;
                    }
                    n.push(a.left);
                    var s = l3(r, a, e, t);
                    if (t == "page" && l == i.sel.primary()) {
                        iO(r, r5(r, s, "div").top - a.top);
                    }
                    return s;
                }, V);
                if (n.length) {
                    for(var l = 0; l < i.sel.ranges.length; l++){
                        i.sel.ranges[l].goalColumn = n[l];
                    }
                }
            }),
            findWordAt: function(e) {
                var t = this.doc, r = e2(t, e.line).text;
                var i = e.ch, n = e.ch;
                if (r) {
                    var o = this.getHelper(e, "wordChars");
                    if ((e.sticky == "before" || n == r.length) && i) {
                        --i;
                    } else {
                        ++n;
                    }
                    var l = r.charAt(i);
                    var a = er(l, o) ? function(e) {
                        return er(e, o);
                    } : /\s/.test(l) ? function(e) {
                        return /\s/.test(e);
                    } : function(e) {
                        return !/\s/.test(e) && !er(e);
                    };
                    while(i > 0 && a(r.charAt(i - 1))){
                        --i;
                    }
                    while(n < r.length && a(r.charAt(n))){
                        ++n;
                    }
                }
                return new ny(e8(e.line, i), e8(e.line, n));
            },
            toggleOverwrite: function(e) {
                if (e != null && e == this.state.overwrite) {
                    return;
                }
                if ((this.state.overwrite = !this.state.overwrite)) {
                    W(this.display.cursorDiv, "CodeMirror-overwrite");
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
            scrollTo: iY(function(e, t) {
                iA(this, e, t);
            }),
            getScrollInfo: function() {
                var e = this.display.scroller;
                return {
                    left: e.scrollLeft,
                    top: e.scrollTop,
                    height: e.scrollHeight - rL(this) - this.display.barHeight,
                    width: e.scrollWidth - rL(this) - this.display.barWidth,
                    clientHeight: rT(this),
                    clientWidth: rk(this)
                };
            },
            scrollIntoView: iY(function(e, t) {
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
                        from: e8(e, 0),
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
                    i0(this, e);
                } else {
                    iD(this, e.from, e.to, e.margin);
                }
            }),
            setSize: iY(function(e, t) {
                var r = this;
                var i = function(e) {
                    return typeof e == "number" || /^\d+$/.test(String(e)) ? e + "px" : e;
                };
                if (e != null) {
                    this.display.wrapper.style.width = i(e);
                }
                if (t != null) {
                    this.display.wrapper.style.height = i(t);
                }
                if (this.options.lineWrapping) {
                    rR(this);
                }
                var n = this.display.viewFrom;
                this.doc.iter(n, this.display.viewTo, function(e) {
                    if (e.widgets) {
                        for(var t = 0; t < e.widgets.length; t++){
                            if (e.widgets[t].noHScroll) {
                                ia(r, n, "widget");
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
                return iX(this, e);
            },
            startOperation: function() {
                return i4(this);
            },
            endOperation: function() {
                return i6(this);
            },
            refresh: iY(function() {
                var e = this.display.cachedTextHeight;
                il(this);
                this.curOp.forceUpdate = true;
                rI(this);
                iA(this, this.doc.scrollLeft, this.doc.scrollTop);
                no(this.display);
                if (e == null || Math.abs(e - rZ(this.display)) > 0.5 || this.options.lineWrapping) {
                    ir(this);
                }
                em(this, "refresh", this);
            }),
            swapDoc: iY(function(e) {
                var t = this.doc;
                t.cm = null;
                if (this.state.selectingText) {
                    this.state.selectingText();
                }
                nA(this, e);
                rI(this);
                this.display.input.reset();
                iA(this, e.scrollLeft, e.scrollTop);
                this.curOp.forceScroll = true;
                ra(this, "swapDoc", this, t);
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
        ex(e);
        e.registerHelper = function(t, i, n) {
            if (!r.hasOwnProperty(t)) {
                r[t] = e[t] = {
                    _global: []
                };
            }
            r[t][i] = n;
        };
        e.registerGlobalHelper = function(t, i, n, o) {
            e.registerHelper(t, i, o);
            r[t]._global.push({
                pred: n,
                val: o
            });
        };
    }
    function lI(e, t, r, i, n) {
        var o = t;
        var l = r;
        var a = e2(e, t.line);
        var s = n && e.direction == "rtl" ? -r : r;
        function u() {
            var r = t.line + s;
            if (r < e.first || r >= e.first + e.size) {
                return false;
            }
            t = new e8(r, t.ch, t.sticky);
            return (a = e2(e, r));
        }
        function f(o) {
            var l;
            if (i == "codepoint") {
                var f = a.text.charCodeAt(t.ch + (r > 0 ? 0 : -1));
                if (isNaN(f)) {
                    l = null;
                } else {
                    var c = r > 0 ? f >= 0xd800 && f < 0xdc00 : f >= 0xdc00 && f < 0xdfff;
                    l = new e8(t.line, Math.max(0, Math.min(a.text.length, t.ch + r * (c ? 2 : 1))), -r);
                }
            } else if (n) {
                l = oV(e.cm, a, t, r);
            } else {
                l = oG(a, t, r);
            }
            if (l == null) {
                if (!o && u()) {
                    t = oU(n, e.cm, a, t.line, s);
                } else {
                    return false;
                }
            } else {
                t = l;
            }
            return true;
        }
        if (i == "char" || i == "codepoint") {
            f();
        } else if (i == "column") {
            f(true);
        } else if (i == "word" || i == "group") {
            var c = null, h = i == "group";
            var d = e.cm && e.cm.getHelper(t, "wordChars");
            for(var p = true;; p = false){
                if (r < 0 && !f(!p)) {
                    break;
                }
                var v = a.text.charAt(t.ch) || "\n";
                var g = er(v, d) ? "w" : h && v == "\n" ? "n" : !h || /\s/.test(v) ? null : "p";
                if (h && !p && !g) {
                    g = "s";
                }
                if (c && c != g) {
                    if (r < 0) {
                        r = 1;
                        f();
                        t.sticky = "after";
                    }
                    break;
                }
                if (g) {
                    c = g;
                }
                if (r > 0 && !f(!p)) {
                    break;
                }
            }
        }
        var m = nZ(e, t, o, l, true);
        if (eq(o, m)) {
            m.hitSide = true;
        }
        return m;
    }
    function l3(e, t, r, i) {
        var n = e.doc, o = t.left, l;
        if (i == "page") {
            var a = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            var s = Math.max(a - 0.5 * rZ(e.display), 3);
            l = (r > 0 ? t.bottom : t.top) + r * s;
        } else if (i == "line") {
            l = r > 0 ? t.bottom + 3 : t.top - 3;
        }
        var u;
        for(;;){
            u = rV(e, o, l);
            if (!u.outside) {
                break;
            }
            if (r < 0 ? l <= 0 : l >= n.height) {
                u.hitSide = true;
                break;
            }
            l += r * 5;
        }
        return u;
    }
    var lB = function(e) {
        this.cm = e;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new z();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
    };
    lB.prototype.init = function(e) {
        var t = this;
        var r = this, i = r.cm;
        var n = (r.div = e.lineDiv);
        n.contentEditable = true;
        lE(n, i.options.spellcheck, i.options.autocorrect, i.options.autocapitalize);
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
            if (!o(e) || e$(i, e) || lF(e, i)) {
                return;
            }
            if (a <= 11) {
                setTimeout(ij(i, function() {
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
            return r.forceCompositionEnd();
        });
        ep(n, "input", function() {
            if (!t.composing) {
                t.readFromDOMSoon();
            }
        });
        function l(e) {
            if (!o(e) || e$(i, e)) {
                return;
            }
            if (i.somethingSelected()) {
                lD({
                    lineWise: false,
                    text: i.getSelections()
                });
                if (e.type == "cut") {
                    i.replaceSelection("", null, "cut");
                }
            } else if (!i.options.lineWiseCopyCut) {
                return;
            } else {
                var t = l1(i);
                lD({
                    lineWise: true,
                    text: t.text
                });
                if (e.type == "cut") {
                    i.operation(function() {
                        i.setSelections(t.ranges, 0, G);
                        i.replaceSelection("", null, "cut");
                    });
                }
            }
            if (e.clipboardData) {
                e.clipboardData.clearData();
                var l = lW.text.join("\n");
                e.clipboardData.setData("Text", l);
                if (e.clipboardData.getData("Text") == l) {
                    e.preventDefault();
                    return;
                }
            }
            var a = lz(), s = a.firstChild;
            i.display.lineSpace.insertBefore(a, i.display.lineSpace.firstChild);
            s.value = lW.text.join("\n");
            var u = A();
            H(s);
            setTimeout(function() {
                i.display.lineSpace.removeChild(a);
                u.focus();
                if (u == n) {
                    r.showPrimarySelection();
                }
            }, 50);
        }
        ep(n, "copy", l);
        ep(n, "cut", l);
    };
    lB.prototype.screenReaderLabelChanged = function(e) {
        if (e) {
            this.div.setAttribute("aria-label", e);
        } else {
            this.div.removeAttribute("aria-label");
        }
    };
    lB.prototype.prepareSelection = function() {
        var e = ip(this.cm, false);
        e.focus = A() == this.div;
        return e;
    };
    lB.prototype.showSelection = function(e, t) {
        if (!e || !this.cm.display.view.length) {
            return;
        }
        if (e.focus || t) {
            this.showPrimarySelection();
        }
        this.showMultipleSelections(e);
    };
    lB.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    };
    lB.prototype.showPrimarySelection = function() {
        var e = this.getSelection(), t = this.cm, i = t.doc.sel.primary();
        var n = i.from(), o = i.to();
        if (t.display.viewTo == t.display.viewFrom || n.line >= t.display.viewTo || o.line < t.display.viewFrom) {
            e.removeAllRanges();
            return;
        }
        var l = l2(t, e.anchorNode, e.anchorOffset);
        var a = l2(t, e.focusNode, e.focusOffset);
        if (l && !l.bad && a && !a.bad && e9(eJ(l, a), n) == 0 && e9(eQ(l, a), o) == 0) {
            return;
        }
        var s = t.display.view;
        var u = (n.line >= t.display.viewFrom && l7(t, n)) || {
            node: s[0].measure.map[2],
            offset: 0
        };
        var f = o.line < t.display.viewTo && l7(t, o);
        if (!f) {
            var c = s[s.length - 1].measure;
            var h = c.maps ? c.maps[c.maps.length - 1] : c.map;
            f = {
                node: h[h.length - 1],
                offset: h[h.length - 2] - h[h.length - 3]
            };
        }
        if (!u || !f) {
            e.removeAllRanges();
            return;
        }
        var d = e.rangeCount && e.getRangeAt(0), p;
        try {
            p = O(u.node, u.offset, f.offset, f.node);
        } catch (v) {}
        if (p) {
            if (!r && t.state.focused) {
                e.collapse(u.node, u.offset);
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
            } else if (r) {
                this.startGracePeriod();
            }
        }
        this.rememberSelection();
    };
    lB.prototype.startGracePeriod = function() {
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
    lB.prototype.showMultipleSelections = function(e) {
        k(this.cm.display.cursorDiv, e.cursors);
        k(this.cm.display.selectionDiv, e.selection);
    };
    lB.prototype.rememberSelection = function() {
        var e = this.getSelection();
        this.lastAnchorNode = e.anchorNode;
        this.lastAnchorOffset = e.anchorOffset;
        this.lastFocusNode = e.focusNode;
        this.lastFocusOffset = e.focusOffset;
    };
    lB.prototype.selectionInEditor = function() {
        var e = this.getSelection();
        if (!e.rangeCount) {
            return false;
        }
        var t = e.getRangeAt(0).commonAncestorContainer;
        return M(this.div, t);
    };
    lB.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || A() != this.div) {
                this.showSelection(this.prepareSelection(), true);
            }
            this.div.focus();
        }
    };
    lB.prototype.blur = function() {
        this.div.blur();
    };
    lB.prototype.getField = function() {
        return this.div;
    };
    lB.prototype.supportsTouch = function() {
        return true;
    };
    lB.prototype.receivedFocus = function() {
        var e = this;
        var t = this;
        if (this.selectionInEditor()) {
            setTimeout(function() {
                return e.pollSelection();
            }, 20);
        } else {
            iX(this.cm, function() {
                return (t.cm.curOp.selectionChanged = true);
            });
        }
        function r() {
            if (t.cm.state.focused) {
                t.pollSelection();
                t.polling.set(t.cm.options.pollInterval, r);
            }
        }
        this.polling.set(this.cm.options.pollInterval, r);
    };
    lB.prototype.selectionChanged = function() {
        var e = this.getSelection();
        return (e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset);
    };
    lB.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return;
        }
        var e = this.getSelection(), t = this.cm;
        if (g && f && this.cm.display.gutterSpecs.length && l4(e.anchorNode)) {
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
        var r = l2(t, e.anchorNode, e.anchorOffset);
        var i = l2(t, e.focusNode, e.focusOffset);
        if (r && i) {
            iX(t, function() {
                nX(t.doc, nx(r, i), G);
                if (r.bad || i.bad) {
                    t.curOp.selectionChanged = true;
                }
            });
        }
    };
    lB.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
        }
        var e = this.cm, t = e.display, r = e.doc.sel.primary();
        var i = r.from(), n = r.to();
        if (i.ch == 0 && i.line > e.firstLine()) {
            i = e8(i.line - 1, e2(e.doc, i.line - 1).length);
        }
        if (n.ch == e2(e.doc, n.line).text.length && n.line < e.lastLine()) {
            n = e8(n.line + 1, 0);
        }
        if (i.line < t.viewFrom || n.line > t.viewTo - 1) {
            return false;
        }
        var o, l, a;
        if (i.line == t.viewFrom || (o = io(e, i.line)) == 0) {
            l = eK(t.view[0].line);
            a = t.view[0].node;
        } else {
            l = eK(t.view[o].line);
            a = t.view[o - 1].node.nextSibling;
        }
        var s = io(e, n.line);
        var u, f;
        if (s == t.view.length - 1) {
            u = t.viewTo - 1;
            f = t.lineDiv.lastChild;
        } else {
            u = eK(t.view[s + 1].line) - 1;
            f = t.view[s + 1].node.previousSibling;
        }
        if (!a) {
            return false;
        }
        var c = e.doc.splitLines(l5(e, a, f, l, u));
        var h = eG(e.doc, e8(l, 0), e8(u, e2(e.doc, u).text.length));
        while(c.length > 1 && h.length > 1){
            if (Y(c) == Y(h)) {
                c.pop();
                h.pop();
                u--;
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
        var $ = Y(c), y = Y(h);
        var b = Math.min($.length - (c.length == 1 ? d : 0), y.length - (h.length == 1 ? d : 0));
        while(p < b && $.charCodeAt($.length - p - 1) == y.charCodeAt(y.length - p - 1)){
            ++p;
        }
        if (c.length == 1 && h.length == 1 && l == i.line) {
            while(d && d > i.ch && $.charCodeAt($.length - p - 1) == y.charCodeAt(y.length - p - 1)){
                d--;
                p++;
            }
        }
        c[c.length - 1] = $.slice(0, $.length - p).replace(/^\u200b+/, "");
        c[0] = c[0].slice(d).replace(/\u200b+$/, "");
        var x = e8(l, d);
        var w = e8(u, h.length ? Y(h).length - p : 0);
        if (c.length > 1 || c[0] || e9(x, w)) {
            oa(e.doc, c, x, w, "+input");
            return true;
        }
    };
    lB.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    };
    lB.prototype.reset = function() {
        this.forceCompositionEnd();
    };
    lB.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
            return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
    };
    lB.prototype.readFromDOMSoon = function() {
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
    lB.prototype.updateFromDOM = function() {
        var e = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
            iX(this.cm, function() {
                return il(e.cm);
            });
        }
    };
    lB.prototype.setUneditable = function(e) {
        e.contentEditable = "false";
    };
    lB.prototype.onKeyPress = function(e) {
        if (e.charCode == 0 || this.composing) {
            return;
        }
        e.preventDefault();
        if (!this.cm.isReadOnly()) {
            ij(this.cm, lH)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
        }
    };
    lB.prototype.readOnlyChanged = function(e) {
        this.div.contentEditable = String(e != "nocursor");
    };
    lB.prototype.onContextMenu = function() {};
    lB.prototype.resetPosition = function() {};
    lB.prototype.needsContentAttribute = true;
    function l7(e, t) {
        var r = r0(e, t.line);
        if (!r || r.hidden) {
            return null;
        }
        var i = e2(e.doc, t.line);
        var n = rO(r, i, t.line);
        var o = eh(i, e.doc.direction), l = "left";
        if (o) {
            var a = ef(o, t.ch);
            l = a % 2 ? "right" : "left";
        }
        var s = rF(n.map, t.ch, l);
        s.offset = s.collapse == "right" ? s.end : s.start;
        return s;
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
    function l5(e, t, r, i, n) {
        var o = "", l = false, a = e.doc.lineSeparator(), s = false;
        function u(e) {
            return function(t) {
                return t.id == e;
            };
        }
        function f() {
            if (l) {
                o += a;
                if (s) {
                    o += a;
                }
                l = s = false;
            }
        }
        function c(e) {
            if (e) {
                f();
                o += e;
            }
        }
        function h(t) {
            if (t.nodeType == 1) {
                var r = t.getAttribute("cm-text");
                if (r) {
                    c(r);
                    return;
                }
                var o = t.getAttribute("cm-marker"), d;
                if (o) {
                    var p = e.findMarks(e8(i, 0), e8(n + 1, 0), u(+o));
                    if (p.length && (d = p[0].find(0))) {
                        c(eG(e.doc, d.from, d.to).join(a));
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
                    f();
                }
                for(var g = 0; g < t.childNodes.length; g++){
                    h(t.childNodes[g]);
                }
                if (/^(pre|p)$/i.test(t.nodeName)) {
                    s = true;
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
            if (t == r) {
                break;
            }
            t = t.nextSibling;
            s = false;
        }
        return o;
    }
    function l2(e, t, r) {
        var i;
        if (t == e.display.lineDiv) {
            i = e.display.lineDiv.childNodes[r];
            if (!i) {
                return l6(e.clipPos(e8(e.display.viewTo - 1)), true);
            }
            t = null;
            r = 0;
        } else {
            for(i = t;; i = i.parentNode){
                if (!i || i == e.display.lineDiv) {
                    return null;
                }
                if (i.parentNode && i.parentNode == e.display.lineDiv) {
                    break;
                }
            }
        }
        for(var n = 0; n < e.display.view.length; n++){
            var o = e.display.view[n];
            if (o.node == i) {
                return lG(o, t, r);
            }
        }
    }
    function lG(e, t, r) {
        var i = e.text.firstChild, n = false;
        if (!t || !M(i, t)) {
            return l6(e8(eK(e.line), 0), true);
        }
        if (t == i) {
            n = true;
            t = i.childNodes[r];
            r = 0;
            if (!t) {
                var o = e.rest ? Y(e.rest) : e.line;
                return l6(e8(eK(o), o.text.length), n);
            }
        }
        var l = t.nodeType == 3 ? t : null, a = t;
        if (!l && t.childNodes.length == 1 && t.firstChild.nodeType == 3) {
            l = t.firstChild;
            if (r) {
                r = l.nodeValue.length;
            }
        }
        while(a.parentNode != i){
            a = a.parentNode;
        }
        var s = e.measure, u = s.maps;
        function f(t, r, i) {
            for(var n = -1; n < (u ? u.length : 0); n++){
                var o = n < 0 ? s.map : u[n];
                for(var l = 0; l < o.length; l += 3){
                    var a = o[l + 2];
                    if (a == t || a == r) {
                        var f = eK(n < 0 ? e.line : e.rest[n]);
                        var c = o[l] + i;
                        if (i < 0 || a != t) {
                            c = o[l + (i ? 1 : 0)];
                        }
                        return e8(f, c);
                    }
                }
            }
        }
        var c = f(l, a, r);
        if (c) {
            return l6(c, n);
        }
        for(var h = a.nextSibling, d = l ? l.nodeValue.length - r : 0; h; h = h.nextSibling){
            c = f(h, h.firstChild, 0);
            if (c) {
                return l6(e8(c.line, c.ch - d), n);
            } else {
                d += h.textContent.length;
            }
        }
        for(var p = a.previousSibling, v = r; p; p = p.previousSibling){
            c = f(p, p.firstChild, -1);
            if (c) {
                return l6(e8(c.line, c.ch + v), n);
            } else {
                v += p.textContent.length;
            }
        }
    }
    var lU = function(e) {
        this.cm = e;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new z();
        this.hasSelection = false;
        this.composing = null;
    };
    lU.prototype.init = function(e) {
        var t = this;
        var r = this, i = this.cm;
        this.createField(e);
        var n = this.textarea;
        e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild);
        if (v) {
            n.style.width = "0px";
        }
        ep(n, "input", function() {
            if (l && a >= 9 && t.hasSelection) {
                t.hasSelection = null;
            }
            r.poll();
        });
        ep(n, "paste", function(e) {
            if (e$(i, e) || lF(e, i)) {
                return;
            }
            i.state.pasteIncoming = +new Date();
            r.fastPoll();
        });
        function o(e) {
            if (e$(i, e)) {
                return;
            }
            if (i.somethingSelected()) {
                lD({
                    lineWise: false,
                    text: i.getSelections()
                });
            } else if (!i.options.lineWiseCopyCut) {
                return;
            } else {
                var t = l1(i);
                lD({
                    lineWise: true,
                    text: t.text
                });
                if (e.type == "cut") {
                    i.setSelections(t.ranges, null, G);
                } else {
                    r.prevInput = "";
                    n.value = t.text.join("\n");
                    H(n);
                }
            }
            if (e.type == "cut") {
                i.state.cutIncoming = +new Date();
            }
        }
        ep(n, "cut", o);
        ep(n, "copy", o);
        ep(e.scroller, "paste", function(t) {
            if (rw(e, t) || e$(i, t)) {
                return;
            }
            if (!n.dispatchEvent) {
                i.state.pasteIncoming = +new Date();
                r.focus();
                return;
            }
            var o = new Event("paste");
            o.clipboardData = t.clipboardData;
            n.dispatchEvent(o);
        });
        ep(e.lineSpace, "selectstart", function(t) {
            if (!rw(e, t)) {
                ew(t);
            }
        });
        ep(n, "compositionstart", function() {
            var e = i.getCursor("from");
            if (r.composing) {
                r.composing.range.clear();
            }
            r.composing = {
                start: e,
                range: i.markText(e, i.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        });
        ep(n, "compositionend", function() {
            if (r.composing) {
                r.poll();
                r.composing.range.clear();
                r.composing = null;
            }
        });
    };
    lU.prototype.createField = function(e) {
        this.wrapper = lz();
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
        var e = this.cm, t = e.display, r = e.doc;
        var i = ip(e);
        if (e.options.moveInputWithCursor) {
            var n = r2(e, r.sel.primary().head, "div");
            var o = t.wrapper.getBoundingClientRect(), l = t.lineDiv.getBoundingClientRect();
            i.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, n.top + l.top - o.top));
            i.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, n.left + l.left - o.left));
        }
        return i;
    };
    lU.prototype.showSelection = function(e) {
        var t = this.cm, r = t.display;
        k(r.cursorDiv, e.cursors);
        k(r.selectionDiv, e.selection);
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
            var r = t.getSelection();
            this.textarea.value = r;
            if (t.state.focused) {
                H(this.textarea);
            }
            if (l && a >= 9) {
                this.hasSelection = r;
            }
        } else if (!e) {
            this.prevInput = this.textarea.value = "";
            if (l && a >= 9) {
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
        function r() {
            var i = t.poll();
            if (!i && !e) {
                e = true;
                t.polling.set(60, r);
            } else {
                t.pollingFast = false;
                t.slowPoll();
            }
        }
        t.polling.set(20, r);
    };
    lU.prototype.poll = function() {
        var e = this;
        var t = this.cm, r = this.textarea, i = this.prevInput;
        if (this.contextMenuPending || !t.state.focused || (eW(r) && !i && !this.composing) || t.isReadOnly() || t.options.disableInput || t.state.keySeq) {
            return false;
        }
        var n = r.value;
        if (n == i && !t.somethingSelected()) {
            return false;
        }
        if ((l && a >= 9 && this.hasSelection === n) || ($ && /[\uf700-\uf7ff]/.test(n))) {
            t.display.input.reset();
            return false;
        }
        if (t.doc.sel == t.display.selForContextMenu) {
            var o = n.charCodeAt(0);
            if (o == 0x200b && !i) {
                i = "\u200b";
            }
            if (o == 0x21da) {
                this.reset();
                return this.cm.execCommand("undo");
            }
        }
        var s = 0, u = Math.min(i.length, n.length);
        while(s < u && i.charCodeAt(s) == n.charCodeAt(s)){
            ++s;
        }
        iX(t, function() {
            lH(t, n.slice(s), i.length - s, null, e.composing ? "*compose" : null);
            if (n.length > 1000 || n.indexOf("\n") > -1) {
                r.value = e.prevInput = "";
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
        if (l && a >= 9) {
            this.hasSelection = null;
        }
        this.fastPoll();
    };
    lU.prototype.onContextMenu = function(e) {
        var t = this, r = t.cm, i = r.display, n = t.textarea;
        if (t.contextMenuPending) {
            t.contextMenuPending();
        }
        var o = ii(r, e), u = i.scroller.scrollTop;
        if (!o || c) {
            return;
        }
        var f = r.options.resetSelectionOnContextMenu;
        if (f && r.doc.sel.contains(o) == -1) {
            ij(r, nX)(r.doc, nx(o), G);
        }
        var h = n.style.cssText, d = t.wrapper.style.cssText;
        var p = t.wrapper.offsetParent.getBoundingClientRect();
        t.wrapper.style.cssText = "position: static";
        n.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - p.top - 5) + "px; left: " + (e.clientX - p.left - 5) + "px;\n      z-index: 1000; background: " + (l ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var v;
        if (s) {
            v = window.scrollY;
        }
        i.input.focus();
        if (s) {
            window.scrollTo(null, v);
        }
        i.input.reset();
        if (!r.somethingSelected()) {
            n.value = t.prevInput = " ";
        }
        t.contextMenuPending = m;
        i.selForContextMenu = r.doc.sel;
        clearTimeout(i.detectingSelectAll);
        function g() {
            if (n.selectionStart != null) {
                var e = r.somethingSelected();
                var o = "\u200b" + (e ? n.value : "");
                n.value = "\u21da";
                n.value = o;
                t.prevInput = e ? "" : "\u200b";
                n.selectionStart = 1;
                n.selectionEnd = o.length;
                i.selForContextMenu = r.doc.sel;
            }
        }
        function m() {
            if (t.contextMenuPending != m) {
                return;
            }
            t.contextMenuPending = false;
            t.wrapper.style.cssText = d;
            n.style.cssText = h;
            if (l && a < 9) {
                i.scrollbars.setScrollTop((i.scroller.scrollTop = u));
            }
            if (n.selectionStart != null) {
                if (!l || (l && a < 9)) {
                    g();
                }
                var e = 0, o = function() {
                    if (i.selForContextMenu == r.doc.sel && n.selectionStart == 0 && n.selectionEnd > 0 && t.prevInput == "\u200b") {
                        ij(r, nJ)(r);
                    } else if (e++ < 10) {
                        i.detectingSelectAll = setTimeout(o, 500);
                    } else {
                        i.selForContextMenu = null;
                        i.input.reset();
                    }
                };
                i.detectingSelectAll = setTimeout(o, 200);
            }
        }
        if (l && a >= 9) {
            g();
        }
        if (_) {
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
            var r = A();
            t.autofocus = r == e || (e.getAttribute("autofocus") != null && r == document.body);
        }
        function i() {
            e.value = s.getValue();
        }
        var n;
        if (e.form) {
            ep(e.form, "submit", i);
            if (!t.leaveSubmitMethodAlone) {
                var o = e.form;
                n = o.submit;
                try {
                    var l = (o.submit = function() {
                        i();
                        o.submit = n;
                        o.submit();
                        o.submit = l;
                    });
                } catch (a) {}
            }
        }
        t.finishInit = function(r) {
            r.save = i;
            r.getTextArea = function() {
                return e;
            };
            r.toTextArea = function() {
                r.toTextArea = isNaN;
                i();
                e.parentNode.removeChild(r.getWrapperElement());
                e.style.display = "";
                if (e.form) {
                    eg(e.form, "submit", i);
                    if (!t.leaveSubmitMethodAlone && typeof e.form.submit == "function") {
                        e.form.submit = n;
                    }
                }
            };
        };
        e.style.display = "none";
        var s = lO(function(t) {
            return e.parentNode.insertBefore(t, e.nextSibling);
        }, t);
        return s;
    }
    function lK(e) {
        e.off = eg;
        e.on = ep;
        e.wheelEventPixels = ng;
        e.Doc = oL;
        e.splitLines = e0;
        e.countColumn = E;
        e.findColumn = K;
        e.isWordChar = et;
        e.Pass = B;
        e.signal = em;
        e.Line = tG;
        e.changeEnd = nw;
        e.scrollbarModel = i3;
        e.Pos = e8;
        e.cmpPos = e9;
        e.modes = eP;
        e.mimeModes = e1;
        e.resolveMode = eR;
        e.getMode = eI;
        e.modeExtensions = e3;
        e.extendMode = eB;
        e.copyState = e7;
        e.startState = e6;
        e.innerMode = e4;
        e.commands = oK;
        e.keyMap = oz;
        e.keyName = o4;
        e.isModifierKey = oB;
        e.lookupKey = o3;
        e.normalizeKeyMap = oI;
        e.StringStream = e5;
        e.SharedTextMarker = ob;
        e.TextMarker = o$;
        e.LineWidget = op;
        e.e_preventDefault = ew;
        e.e_stopPropagation = e_;
        e.e_stop = eS;
        e.addClass = W;
        e.contains = M;
        e.rmClass = S;
        e.keyNames = oF;
    }
    lk(lO);
    lR(lO);
    var lX = "iter insert remove copy getEditor constructor".split(" ");
    for(var lj in oL.prototype){
        if (oL.prototype.hasOwnProperty(lj) && R(lX, lj) < 0) {
            lO.prototype[lj] = (function(e) {
                return function() {
                    return e.apply(this.doc, arguments);
                };
            })(oL.prototype[lj]);
        }
    }
    ex(oL);
    lO.inputStyles = {
        textarea: lU,
        contenteditable: lB
    };
    lO.defineMode = function(e) {
        if (!lO.defaults.mode && e != "null") {
            lO.defaults.mode = e;
        }
        eE.apply(this, arguments);
    };
    lO.defineMIME = ez;
    lO.defineMode("null", function() {
        return {
            token: function(e) {
                return e.skipToEnd();
            }
        };
    });
    lO.defineMIME("text/plain", "null");
    lO.defineExtension = function(e, t) {
        lO.prototype[e] = t;
    };
    lO.defineDocExtension = function(e, t) {
        oL.prototype[e] = t;
    };
    lO.fromTextArea = lV;
    lK(lO);
    lO.version = "5.65.1";
    return lO;
});
