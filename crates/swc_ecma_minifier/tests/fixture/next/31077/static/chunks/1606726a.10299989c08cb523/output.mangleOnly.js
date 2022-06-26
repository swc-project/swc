"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        453
    ],
    {
        8780: function(a, b, c) {
            c.r(b);
            c.d(b, {
                Decoration: function() {
                    return cd;
                },
                DecorationSet: function() {
                    return ch;
                },
                EditorView: function() {
                    return cu;
                },
                __endComposition: function() {
                    return b0;
                },
                __parseFromClipboard: function() {
                    return bi;
                },
                __serializeForClipboard: function() {
                    return bh;
                }
            });
            var d = c(6922);
            var e = c(2230);
            var f = c(1081);
            var g = {};
            if (typeof navigator != "undefined" && typeof document != "undefined") {
                var h = /Edge\/(\d+)/.exec(navigator.userAgent);
                var i = /MSIE \d/.test(navigator.userAgent);
                var j = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
                var k = (g.ie = !!(i || j || h));
                g.ie_version = i ? document.documentMode || 6 : j ? +j[1] : h ? +h[1] : null;
                g.gecko = !k && /gecko\/(\d+)/i.test(navigator.userAgent);
                g.gecko_version = g.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1];
                var l = !k && /Chrome\/(\d+)/.exec(navigator.userAgent);
                g.chrome = !!l;
                g.chrome_version = l && +l[1];
                g.safari = !k && /Apple Computer/.test(navigator.vendor);
                g.ios = g.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
                g.mac = g.ios || /Mac/.test(navigator.platform);
                g.android = /Android \d/.test(navigator.userAgent);
                g.webkit = "webkitFontSmoothing" in document.documentElement.style;
                g.webkit_version = g.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0, 
                ])[1];
            }
            var m = function(a) {
                for(var b = 0;; b++){
                    a = a.previousSibling;
                    if (!a) {
                        return b;
                    }
                }
            };
            var n = function(a) {
                var b = a.assignedSlot || a.parentNode;
                return b && b.nodeType == 11 ? b.host : b;
            };
            var o = null;
            var p = function(a, b, c) {
                var d = o || (o = document.createRange());
                d.setEnd(a, c == null ? a.nodeValue.length : c);
                d.setStart(a, b || 0);
                return d;
            };
            var q = function(a, b, c, d) {
                return (c && (s(a, b, c, d, -1) || s(a, b, c, d, 1)));
            };
            var r = /^(img|br|input|textarea|hr)$/i;
            function s(a, b, c, d, e) {
                for(;;){
                    if (a == c && b == d) {
                        return true;
                    }
                    if (b == (e < 0 ? 0 : t(a))) {
                        var f = a.parentNode;
                        if (f.nodeType != 1 || v(a) || r.test(a.nodeName) || a.contentEditable == "false") {
                            return false;
                        }
                        b = m(a) + (e < 0 ? 0 : 1);
                        a = f;
                    } else if (a.nodeType == 1) {
                        a = a.childNodes[b + (e < 0 ? -1 : 0)];
                        if (a.contentEditable == "false") {
                            return false;
                        }
                        b = e < 0 ? t(a) : 0;
                    } else {
                        return false;
                    }
                }
            }
            function t(a) {
                return a.nodeType == 3 ? a.nodeValue.length : a.childNodes.length;
            }
            function u(a, b, c) {
                for(var d = b == 0, e = b == t(a); d || e;){
                    if (a == c) {
                        return true;
                    }
                    var f = m(a);
                    a = a.parentNode;
                    if (!a) {
                        return false;
                    }
                    d = d && f == 0;
                    e = e && f == t(a);
                }
            }
            function v(a) {
                var b;
                for(var c = a; c; c = c.parentNode){
                    if ((b = c.pmViewDesc)) {
                        break;
                    }
                }
                return (b && b.node && b.node.isBlock && (b.dom == a || b.contentDOM == a));
            }
            var w = function(a) {
                var b = a.isCollapsed;
                if (b && g.chrome && a.rangeCount && !a.getRangeAt(0).collapsed) {
                    b = false;
                }
                return b;
            };
            function x(a, b) {
                var c = document.createEvent("Event");
                c.initEvent("keydown", true, true);
                c.keyCode = a;
                c.key = c.code = b;
                return c;
            }
            function y(a) {
                return {
                    left: 0,
                    right: a.documentElement.clientWidth,
                    top: 0,
                    bottom: a.documentElement.clientHeight
                };
            }
            function z(a, b) {
                return typeof a == "number" ? a : a[b];
            }
            function A(a) {
                var b = a.getBoundingClientRect();
                var c = b.width / a.offsetWidth || 1;
                var d = b.height / a.offsetHeight || 1;
                return {
                    left: b.left,
                    right: b.left + a.clientWidth * c,
                    top: b.top,
                    bottom: b.top + a.clientHeight * d
                };
            }
            function B(a, b, c) {
                var d = a.someProp("scrollThreshold") || 0, e = a.someProp("scrollMargin") || 5;
                var f = a.dom.ownerDocument;
                for(var g = c || a.dom;; g = n(g)){
                    if (!g) {
                        break;
                    }
                    if (g.nodeType != 1) {
                        continue;
                    }
                    var h = g == f.body || g.nodeType != 1;
                    var i = h ? y(f) : A(g);
                    var j = 0, k = 0;
                    if (b.top < i.top + z(d, "top")) {
                        k = -(i.top - b.top + z(e, "top"));
                    } else if (b.bottom > i.bottom - z(d, "bottom")) {
                        k = b.bottom - i.bottom + z(e, "bottom");
                    }
                    if (b.left < i.left + z(d, "left")) {
                        j = -(i.left - b.left + z(e, "left"));
                    } else if (b.right > i.right - z(d, "right")) {
                        j = b.right - i.right + z(e, "right");
                    }
                    if (j || k) {
                        if (h) {
                            f.defaultView.scrollBy(j, k);
                        } else {
                            var l = g.scrollLeft, m = g.scrollTop;
                            if (k) {
                                g.scrollTop += k;
                            }
                            if (j) {
                                g.scrollLeft += j;
                            }
                            var o = g.scrollLeft - l, p = g.scrollTop - m;
                            b = {
                                left: b.left - o,
                                top: b.top - p,
                                right: b.right - o,
                                bottom: b.bottom - p
                            };
                        }
                    }
                    if (h) {
                        break;
                    }
                }
            }
            function C(a) {
                var b = a.dom.getBoundingClientRect(), c = Math.max(0, b.top);
                var d, e;
                for(var f = (b.left + b.right) / 2, g = c + 1; g < Math.min(innerHeight, b.bottom); g += 5){
                    var h = a.root.elementFromPoint(f, g);
                    if (h == a.dom || !a.dom.contains(h)) {
                        continue;
                    }
                    var i = h.getBoundingClientRect();
                    if (i.top >= c - 20) {
                        d = h;
                        e = i.top;
                        break;
                    }
                }
                return {
                    refDOM: d,
                    refTop: e,
                    stack: D(a.dom)
                };
            }
            function D(a) {
                var b = [], c = a.ownerDocument;
                for(; a; a = n(a)){
                    b.push({
                        dom: a,
                        top: a.scrollTop,
                        left: a.scrollLeft
                    });
                    if (a == c) {
                        break;
                    }
                }
                return b;
            }
            function E(a) {
                var b = a.refDOM;
                var c = a.refTop;
                var d = a.stack;
                var e = b ? b.getBoundingClientRect().top : 0;
                F(d, e == 0 ? 0 : e - c);
            }
            function F(a, b) {
                for(var c = 0; c < a.length; c++){
                    var d = a[c];
                    var e = d.dom;
                    var f = d.top;
                    var g = d.left;
                    if (e.scrollTop != f + b) {
                        e.scrollTop = f + b;
                    }
                    if (e.scrollLeft != g) {
                        e.scrollLeft = g;
                    }
                }
            }
            var G = null;
            function H(a) {
                if (a.setActive) {
                    return a.setActive();
                }
                if (G) {
                    return a.focus(G);
                }
                var b = D(a);
                a.focus(G == null ? {
                    get preventScroll () {
                        G = {
                            preventScroll: true
                        };
                        return true;
                    }
                } : undefined);
                if (!G) {
                    G = false;
                    F(b, 0);
                }
            }
            function I(a, b) {
                var c, d = 2e8, e, f = 0;
                var g = b.top, h = b.top;
                for(var i = a.firstChild, j = 0; i; i = i.nextSibling, j++){
                    var k = void 0;
                    if (i.nodeType == 1) {
                        k = i.getClientRects();
                    } else if (i.nodeType == 3) {
                        k = p(i).getClientRects();
                    } else {
                        continue;
                    }
                    for(var l = 0; l < k.length; l++){
                        var m = k[l];
                        if (m.top <= g && m.bottom >= h) {
                            g = Math.max(m.bottom, g);
                            h = Math.min(m.top, h);
                            var n = m.left > b.left ? m.left - b.left : m.right < b.left ? b.left - m.right : 0;
                            if (n < d) {
                                c = i;
                                d = n;
                                e = n && c.nodeType == 3 ? {
                                    left: m.right < b.left ? m.right : m.left,
                                    top: b.top
                                } : b;
                                if (i.nodeType == 1 && n) {
                                    f = j + (b.left >= (m.left + m.right) / 2 ? 1 : 0);
                                }
                                continue;
                            }
                        }
                        if (!c && ((b.left >= m.right && b.top >= m.top) || (b.left >= m.left && b.top >= m.bottom))) {
                            f = j + 1;
                        }
                    }
                }
                if (c && c.nodeType == 3) {
                    return J(c, e);
                }
                if (!c || (d && c.nodeType == 1)) {
                    return {
                        node: a,
                        offset: f
                    };
                }
                return I(c, e);
            }
            function J(a, b) {
                var c = a.nodeValue.length;
                var d = document.createRange();
                for(var e = 0; e < c; e++){
                    d.setEnd(a, e + 1);
                    d.setStart(a, e);
                    var f = Q(d, 1);
                    if (f.top == f.bottom) {
                        continue;
                    }
                    if (K(b, f)) {
                        return {
                            node: a,
                            offset: e + (b.left >= (f.left + f.right) / 2 ? 1 : 0)
                        };
                    }
                }
                return {
                    node: a,
                    offset: 0
                };
            }
            function K(a, b) {
                return (a.left >= b.left - 1 && a.left <= b.right + 1 && a.top >= b.top - 1 && a.top <= b.bottom + 1);
            }
            function L(a, b) {
                var c = a.parentNode;
                if (c && /^li$/i.test(c.nodeName) && b.left < a.getBoundingClientRect().left) {
                    return c;
                }
                return a;
            }
            function M(a, b, c) {
                var d = I(b, c);
                var e = d.node;
                var f = d.offset;
                var g = -1;
                if (e.nodeType == 1 && !e.firstChild) {
                    var h = e.getBoundingClientRect();
                    g = h.left != h.right && c.left > (h.left + h.right) / 2 ? 1 : -1;
                }
                return a.docView.posFromDOM(e, f, g);
            }
            function N(a, b, c, d) {
                var e = -1;
                for(var f = b;;){
                    if (f == a.dom) {
                        break;
                    }
                    var g = a.docView.nearestDesc(f, true);
                    if (!g) {
                        return null;
                    }
                    if (g.node.isBlock && g.parent) {
                        var h = g.dom.getBoundingClientRect();
                        if (h.left > d.left || h.top > d.top) {
                            e = g.posBefore;
                        } else if (h.right < d.left || h.bottom < d.top) {
                            e = g.posAfter;
                        } else {
                            break;
                        }
                    }
                    f = g.dom.parentNode;
                }
                return e > -1 ? e : a.docView.posFromDOM(b, c);
            }
            function O(a, b, c) {
                var d = a.childNodes.length;
                if (d && c.top < c.bottom) {
                    for(var e = Math.max(0, Math.min(d - 1, Math.floor((d * (b.top - c.top)) / (c.bottom - c.top)) - 2)), f = e;;){
                        var g = a.childNodes[f];
                        if (g.nodeType == 1) {
                            var h = g.getClientRects();
                            for(var i = 0; i < h.length; i++){
                                var j = h[i];
                                if (K(b, j)) {
                                    return O(g, b, j);
                                }
                            }
                        }
                        if ((f = (f + 1) % d) == e) {
                            break;
                        }
                    }
                }
                return a;
            }
            function P(a, b) {
                var c, d;
                var e = a.dom.ownerDocument, f, h;
                if (e.caretPositionFromPoint) {
                    try {
                        var i = e.caretPositionFromPoint(b.left, b.top);
                        if (i) {
                            (c = i), (f = c.offsetNode), (h = c.offset);
                        }
                    } catch (j) {}
                }
                if (!f && e.caretRangeFromPoint) {
                    var k = e.caretRangeFromPoint(b.left, b.top);
                    if (k) {
                        (d = k), (f = d.startContainer), (h = d.startOffset);
                    }
                }
                var l = (a.root.elementFromPoint ? a.root : e).elementFromPoint(b.left, b.top + 1), m;
                if (!l || !a.dom.contains(l.nodeType != 1 ? l.parentNode : l)) {
                    var o = a.dom.getBoundingClientRect();
                    if (!K(b, o)) {
                        return null;
                    }
                    l = O(a.dom, b, o);
                    if (!l) {
                        return null;
                    }
                }
                if (g.safari) {
                    for(var p = l; f && p; p = n(p)){
                        if (p.draggable) {
                            f = h = null;
                        }
                    }
                }
                l = L(l, b);
                if (f) {
                    if (g.gecko && f.nodeType == 1) {
                        h = Math.min(h, f.childNodes.length);
                        if (h < f.childNodes.length) {
                            var q = f.childNodes[h], r;
                            if (q.nodeName == "IMG" && (r = q.getBoundingClientRect()).right <= b.left && r.bottom > b.top) {
                                h++;
                            }
                        }
                    }
                    if (f == a.dom && h == f.childNodes.length - 1 && f.lastChild.nodeType == 1 && b.top > f.lastChild.getBoundingClientRect().bottom) {
                        m = a.state.doc.content.size;
                    } else if (h == 0 || f.nodeType != 1 || f.childNodes[h - 1].nodeName != "BR") {
                        m = N(a, f, h, b);
                    }
                }
                if (m == null) {
                    m = M(a, l, b);
                }
                var s = a.docView.nearestDesc(l, true);
                return {
                    pos: m,
                    inside: s ? s.posAtStart - s.border : -1
                };
            }
            function Q(a, b) {
                var c = a.getClientRects();
                return !c.length ? a.getBoundingClientRect() : c[b < 0 ? 0 : c.length - 1];
            }
            var R = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
            function S(a, b, c) {
                var d = a.docView.domFromPos(b, c < 0 ? -1 : 1);
                var e = d.node;
                var f = d.offset;
                var h = g.webkit || g.gecko;
                if (e.nodeType == 3) {
                    if (h && (R.test(e.nodeValue) || (c < 0 ? !f : f == e.nodeValue.length))) {
                        var i = Q(p(e, f, f), c);
                        if (g.gecko && f && /\s/.test(e.nodeValue[f - 1]) && f < e.nodeValue.length) {
                            var j = Q(p(e, f - 1, f - 1), -1);
                            if (j.top == i.top) {
                                var k = Q(p(e, f, f + 1), -1);
                                if (k.top != i.top) {
                                    return T(k, k.left < j.left);
                                }
                            }
                        }
                        return i;
                    } else {
                        var l = f, m = f, n = c < 0 ? 1 : -1;
                        if (c < 0 && !f) {
                            m++;
                            n = -1;
                        } else if (c >= 0 && f == e.nodeValue.length) {
                            l--;
                            n = 1;
                        } else if (c < 0) {
                            l--;
                        } else {
                            m++;
                        }
                        return T(Q(p(e, l, m), n), n < 0);
                    }
                }
                if (!a.state.doc.resolve(b).parent.inlineContent) {
                    if (f && (c < 0 || f == t(e))) {
                        var o = e.childNodes[f - 1];
                        if (o.nodeType == 1) {
                            return U(o.getBoundingClientRect(), false);
                        }
                    }
                    if (f < t(e)) {
                        var q = e.childNodes[f];
                        if (q.nodeType == 1) {
                            return U(q.getBoundingClientRect(), true);
                        }
                    }
                    return U(e.getBoundingClientRect(), c >= 0);
                }
                if (f && (c < 0 || f == t(e))) {
                    var r = e.childNodes[f - 1];
                    var s = r.nodeType == 3 ? p(r, t(r) - (h ? 0 : 1)) : r.nodeType == 1 && (r.nodeName != "BR" || !r.nextSibling) ? r : null;
                    if (s) {
                        return T(Q(s, 1), false);
                    }
                }
                if (f < t(e)) {
                    var u = e.childNodes[f];
                    while(u.pmViewDesc && u.pmViewDesc.ignoreForCoords){
                        u = u.nextSibling;
                    }
                    var v = !u ? null : u.nodeType == 3 ? p(u, 0, h ? 0 : 1) : u.nodeType == 1 ? u : null;
                    if (v) {
                        return T(Q(v, -1), true);
                    }
                }
                return T(Q(e.nodeType == 3 ? p(e) : e, -c), c >= 0);
            }
            function T(a, b) {
                if (a.width == 0) {
                    return a;
                }
                var c = b ? a.left : a.right;
                return {
                    top: a.top,
                    bottom: a.bottom,
                    left: c,
                    right: c
                };
            }
            function U(a, b) {
                if (a.height == 0) {
                    return a;
                }
                var c = b ? a.top : a.bottom;
                return {
                    top: c,
                    bottom: c,
                    left: a.left,
                    right: a.right
                };
            }
            function V(a, b, c) {
                var d = a.state, e = a.root.activeElement;
                if (d != b) {
                    a.updateState(b);
                }
                if (e != a.dom) {
                    a.focus();
                }
                try {
                    return c();
                } finally{
                    if (d != b) {
                        a.updateState(d);
                    }
                    if (e != a.dom && e) {
                        e.focus();
                    }
                }
            }
            function W(a, b, c) {
                var d = b.selection;
                var e = c == "up" ? d.$from : d.$to;
                return V(a, b, function() {
                    var b = a.docView.domFromPos(e.pos, c == "up" ? -1 : 1);
                    var d = b.node;
                    for(;;){
                        var f = a.docView.nearestDesc(d, true);
                        if (!f) {
                            break;
                        }
                        if (f.node.isBlock) {
                            d = f.dom;
                            break;
                        }
                        d = f.dom.parentNode;
                    }
                    var g = S(a, e.pos, 1);
                    for(var h = d.firstChild; h; h = h.nextSibling){
                        var i = void 0;
                        if (h.nodeType == 1) {
                            i = h.getClientRects();
                        } else if (h.nodeType == 3) {
                            i = p(h, 0, h.nodeValue.length).getClientRects();
                        } else {
                            continue;
                        }
                        for(var j = 0; j < i.length; j++){
                            var k = i[j];
                            if (k.bottom > k.top + 1 && (c == "up" ? g.top - k.top > (k.bottom - g.top) * 2 : k.bottom - g.bottom > (g.bottom - k.top) * 2)) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            var X = /[\u0590-\u08ac]/;
            function Y(a, b, c) {
                var d = b.selection;
                var e = d.$head;
                if (!e.parent.isTextblock) {
                    return false;
                }
                var f = e.parentOffset, g = !f, h = f == e.parent.content.size;
                var i = a.root.getSelection();
                if (!X.test(e.parent.textContent) || !i.modify) {
                    return c == "left" || c == "backward" ? g : h;
                }
                return V(a, b, function() {
                    var b = i.getRangeAt(0), d = i.focusNode, f = i.focusOffset;
                    var g = i.caretBidiLevel;
                    i.modify("move", c, "character");
                    var h = e.depth ? a.docView.domAfterPos(e.before()) : a.dom;
                    var j = !h.contains(i.focusNode.nodeType == 1 ? i.focusNode : i.focusNode.parentNode) || (d == i.focusNode && f == i.focusOffset);
                    i.removeAllRanges();
                    i.addRange(b);
                    if (g != null) {
                        i.caretBidiLevel = g;
                    }
                    return j;
                });
            }
            var Z = null, $ = null, _ = false;
            function aa(a, b, c) {
                if (Z == b && $ == c) {
                    return _;
                }
                Z = b;
                $ = c;
                return (_ = c == "up" || c == "down" ? W(a, b, c) : Y(a, b, c));
            }
            var ab = 0, ac = 1, ad = 2, ae = 3;
            var af = function a(b, c, d, e) {
                this.parent = b;
                this.children = c;
                this.dom = d;
                d.pmViewDesc = this;
                this.contentDOM = e;
                this.dirty = ab;
            };
            var ag = {
                size: {
                    configurable: true
                },
                border: {
                    configurable: true
                },
                posBefore: {
                    configurable: true
                },
                posAtStart: {
                    configurable: true
                },
                posAfter: {
                    configurable: true
                },
                posAtEnd: {
                    configurable: true
                },
                contentLost: {
                    configurable: true
                },
                domAtom: {
                    configurable: true
                },
                ignoreForCoords: {
                    configurable: true
                }
            };
            af.prototype.matchesWidget = function a() {
                return false;
            };
            af.prototype.matchesMark = function a() {
                return false;
            };
            af.prototype.matchesNode = function a() {
                return false;
            };
            af.prototype.matchesHack = function a(b) {
                return false;
            };
            af.prototype.parseRule = function a() {
                return null;
            };
            af.prototype.stopEvent = function a() {
                return false;
            };
            ag.size.get = function() {
                var a = 0;
                for(var b = 0; b < this.children.length; b++){
                    a += this.children[b].size;
                }
                return a;
            };
            ag.border.get = function() {
                return 0;
            };
            af.prototype.destroy = function a() {
                this.parent = null;
                if (this.dom.pmViewDesc == this) {
                    this.dom.pmViewDesc = null;
                }
                for(var b = 0; b < this.children.length; b++){
                    this.children[b].destroy();
                }
            };
            af.prototype.posBeforeChild = function a(b) {
                for(var c = 0, d = this.posAtStart; c < this.children.length; c++){
                    var e = this.children[c];
                    if (e == b) {
                        return d;
                    }
                    d += e.size;
                }
            };
            ag.posBefore.get = function() {
                return this.parent.posBeforeChild(this);
            };
            ag.posAtStart.get = function() {
                return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
            };
            ag.posAfter.get = function() {
                return this.posBefore + this.size;
            };
            ag.posAtEnd.get = function() {
                return this.posAtStart + this.size - 2 * this.border;
            };
            af.prototype.localPosFromDOM = function a(b, c, d) {
                if (this.contentDOM && this.contentDOM.contains(b.nodeType == 1 ? b : b.parentNode)) {
                    if (d < 0) {
                        var e, f;
                        if (b == this.contentDOM) {
                            e = b.childNodes[c - 1];
                        } else {
                            while(b.parentNode != this.contentDOM){
                                b = b.parentNode;
                            }
                            e = b.previousSibling;
                        }
                        while(e && !((f = e.pmViewDesc) && f.parent == this)){
                            e = e.previousSibling;
                        }
                        return e ? this.posBeforeChild(f) + f.size : this.posAtStart;
                    } else {
                        var g, h;
                        if (b == this.contentDOM) {
                            g = b.childNodes[c];
                        } else {
                            while(b.parentNode != this.contentDOM){
                                b = b.parentNode;
                            }
                            g = b.nextSibling;
                        }
                        while(g && !((h = g.pmViewDesc) && h.parent == this)){
                            g = g.nextSibling;
                        }
                        return g ? this.posBeforeChild(h) : this.posAtEnd;
                    }
                }
                var i;
                if (b == this.dom && this.contentDOM) {
                    i = c > m(this.contentDOM);
                } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
                    i = b.compareDocumentPosition(this.contentDOM) & 2;
                } else if (this.dom.firstChild) {
                    if (c == 0) {
                        for(var j = b;; j = j.parentNode){
                            if (j == this.dom) {
                                i = false;
                                break;
                            }
                            if (j.parentNode.firstChild != j) {
                                break;
                            }
                        }
                    }
                    if (i == null && c == b.childNodes.length) {
                        for(var k = b;; k = k.parentNode){
                            if (k == this.dom) {
                                i = true;
                                break;
                            }
                            if (k.parentNode.lastChild != k) {
                                break;
                            }
                        }
                    }
                }
                return (i == null ? d > 0 : i) ? this.posAtEnd : this.posAtStart;
            };
            af.prototype.nearestDesc = function a(b, c) {
                for(var d = true, e = b; e; e = e.parentNode){
                    var f = this.getDesc(e);
                    if (f && (!c || f.node)) {
                        if (d && f.nodeDOM && !(f.nodeDOM.nodeType == 1 ? f.nodeDOM.contains(b.nodeType == 1 ? b : b.parentNode) : f.nodeDOM == b)) {
                            d = false;
                        } else {
                            return f;
                        }
                    }
                }
            };
            af.prototype.getDesc = function a(b) {
                var c = b.pmViewDesc;
                for(var d = c; d; d = d.parent){
                    if (d == this) {
                        return c;
                    }
                }
            };
            af.prototype.posFromDOM = function a(b, c, d) {
                for(var e = b; e; e = e.parentNode){
                    var f = this.getDesc(e);
                    if (f) {
                        return f.localPosFromDOM(b, c, d);
                    }
                }
                return -1;
            };
            af.prototype.descAt = function a(b) {
                for(var c = 0, d = 0; c < this.children.length; c++){
                    var e = this.children[c], f = d + e.size;
                    if (d == b && f != d) {
                        while(!e.border && e.children.length){
                            e = e.children[0];
                        }
                        return e;
                    }
                    if (b < f) {
                        return e.descAt(b - d - e.border);
                    }
                    d = f;
                }
            };
            af.prototype.domFromPos = function a(b, c) {
                if (!this.contentDOM) {
                    return {
                        node: this.dom,
                        offset: 0
                    };
                }
                var d = 0, e = 0;
                for(var f = 0; d < this.children.length; d++){
                    var g = this.children[d], h = f + g.size;
                    if (h > b || g instanceof ao) {
                        e = b - f;
                        break;
                    }
                    f = h;
                }
                if (e) {
                    return this.children[d].domFromPos(e - this.children[d].border, c);
                }
                for(var i = void 0; d && !(i = this.children[d - 1]).size && i instanceof ai && i.widget.type.side >= 0; d--){}
                if (c <= 0) {
                    var j, k = true;
                    for(;; d--, k = false){
                        j = d ? this.children[d - 1] : null;
                        if (!j || j.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (j && c && k && !j.border && !j.domAtom) {
                        return j.domFromPos(j.size, c);
                    }
                    return {
                        node: this.contentDOM,
                        offset: j ? m(j.dom) + 1 : 0
                    };
                } else {
                    var l, n = true;
                    for(;; d++, n = false){
                        l = d < this.children.length ? this.children[d] : null;
                        if (!l || l.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (l && n && !l.border && !l.domAtom) {
                        return l.domFromPos(0, c);
                    }
                    return {
                        node: this.contentDOM,
                        offset: l ? m(l.dom) : this.contentDOM.childNodes.length
                    };
                }
            };
            af.prototype.parseRange = function a(b, c, d) {
                if (d === void 0) d = 0;
                if (this.children.length == 0) {
                    return {
                        node: this.contentDOM,
                        from: b,
                        to: c,
                        fromOffset: 0,
                        toOffset: this.contentDOM.childNodes.length
                    };
                }
                var e = -1, f = -1;
                for(var g = d, h = 0;; h++){
                    var i = this.children[h], j = g + i.size;
                    if (e == -1 && b <= j) {
                        var k = g + i.border;
                        if (b >= k && c <= j - i.border && i.node && i.contentDOM && this.contentDOM.contains(i.contentDOM)) {
                            return i.parseRange(b, c, k);
                        }
                        b = g;
                        for(var l = h; l > 0; l--){
                            var n = this.children[l - 1];
                            if (n.size && n.dom.parentNode == this.contentDOM && !n.emptyChildAt(1)) {
                                e = m(n.dom) + 1;
                                break;
                            }
                            b -= n.size;
                        }
                        if (e == -1) {
                            e = 0;
                        }
                    }
                    if (e > -1 && (j > c || h == this.children.length - 1)) {
                        c = j;
                        for(var o = h + 1; o < this.children.length; o++){
                            var p = this.children[o];
                            if (p.size && p.dom.parentNode == this.contentDOM && !p.emptyChildAt(-1)) {
                                f = m(p.dom);
                                break;
                            }
                            c += p.size;
                        }
                        if (f == -1) {
                            f = this.contentDOM.childNodes.length;
                        }
                        break;
                    }
                    g = j;
                }
                return {
                    node: this.contentDOM,
                    from: b,
                    to: c,
                    fromOffset: e,
                    toOffset: f
                };
            };
            af.prototype.emptyChildAt = function a(b) {
                if (this.border || !this.contentDOM || !this.children.length) {
                    return false;
                }
                var c = this.children[b < 0 ? 0 : this.children.length - 1];
                return c.size == 0 || c.emptyChildAt(b);
            };
            af.prototype.domAfterPos = function a(b) {
                var c = this.domFromPos(b, 0);
                var d = c.node;
                var e = c.offset;
                if (d.nodeType != 1 || e == d.childNodes.length) {
                    throw new RangeError("No node after pos " + b);
                }
                return d.childNodes[e];
            };
            af.prototype.setSelection = function a(b, c, d, e) {
                var f = Math.min(b, c), h = Math.max(b, c);
                for(var i = 0, j = 0; i < this.children.length; i++){
                    var k = this.children[i], l = j + k.size;
                    if (f > j && h < l) {
                        return k.setSelection(b - j - k.border, c - j - k.border, d, e);
                    }
                    j = l;
                }
                var n = this.domFromPos(b, b ? -1 : 1);
                var o = c == b ? n : this.domFromPos(c, c ? -1 : 1);
                var p = d.getSelection();
                var r = false;
                if ((g.gecko || g.safari) && b == c) {
                    var s = n.node;
                    var t = n.offset;
                    if (s.nodeType == 3) {
                        r = t && s.nodeValue[t - 1] == "\n";
                        if (r && t == s.nodeValue.length) {
                            for(var u = s, v = void 0; u; u = u.parentNode){
                                if ((v = u.nextSibling)) {
                                    if (v.nodeName == "BR") {
                                        n = o = {
                                            node: v.parentNode,
                                            offset: m(v) + 1
                                        };
                                    }
                                    break;
                                }
                                var w = u.pmViewDesc;
                                if (w && w.node && w.node.isBlock) {
                                    break;
                                }
                            }
                        }
                    } else {
                        var x = s.childNodes[t - 1];
                        r = x && (x.nodeName == "BR" || x.contentEditable == "false");
                    }
                }
                if (g.gecko && p.focusNode && p.focusNode != o.node && p.focusNode.nodeType == 1) {
                    var y = p.focusNode.childNodes[p.focusOffset];
                    if (y && y.contentEditable == "false") {
                        e = true;
                    }
                }
                if (!(e || (r && g.safari)) && q(n.node, n.offset, p.anchorNode, p.anchorOffset) && q(o.node, o.offset, p.focusNode, p.focusOffset)) {
                    return;
                }
                var z = false;
                if ((p.extend || b == c) && !r) {
                    p.collapse(n.node, n.offset);
                    try {
                        if (b != c) {
                            p.extend(o.node, o.offset);
                        }
                        z = true;
                    } catch (A) {
                        if (!(A instanceof DOMException)) {
                            throw A;
                        }
                    }
                }
                if (!z) {
                    if (b > c) {
                        var B = n;
                        n = o;
                        o = B;
                    }
                    var C = document.createRange();
                    C.setEnd(o.node, o.offset);
                    C.setStart(n.node, n.offset);
                    p.removeAllRanges();
                    p.addRange(C);
                }
            };
            af.prototype.ignoreMutation = function a(b) {
                return !this.contentDOM && b.type != "selection";
            };
            ag.contentLost.get = function() {
                return (this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM));
            };
            af.prototype.markDirty = function a(b, c) {
                for(var d = 0, e = 0; e < this.children.length; e++){
                    var f = this.children[e], g = d + f.size;
                    if (d == g ? b <= g && c >= d : b < g && c > d) {
                        var h = d + f.border, i = g - f.border;
                        if (b >= h && c <= i) {
                            this.dirty = b == d || c == g ? ad : ac;
                            if (b == h && c == i && (f.contentLost || f.dom.parentNode != this.contentDOM)) {
                                f.dirty = ae;
                            } else {
                                f.markDirty(b - h, c - h);
                            }
                            return;
                        } else {
                            f.dirty = f.dom == f.contentDOM && f.dom.parentNode == this.contentDOM ? ad : ae;
                        }
                    }
                    d = g;
                }
                this.dirty = ad;
            };
            af.prototype.markParentsDirty = function a() {
                var b = 1;
                for(var c = this.parent; c; c = c.parent, b++){
                    var d = b == 1 ? ad : ac;
                    if (c.dirty < d) {
                        c.dirty = d;
                    }
                }
            };
            ag.domAtom.get = function() {
                return false;
            };
            ag.ignoreForCoords.get = function() {
                return false;
            };
            Object.defineProperties(af.prototype, ag);
            var ah = [];
            var ai = (function(a) {
                function b(b, c, d, e) {
                    var f, g = c.type.toDOM;
                    if (typeof g == "function") {
                        g = g(d, function() {
                            if (!f) {
                                return e;
                            }
                            if (f.parent) {
                                return f.parent.posBeforeChild(f);
                            }
                        });
                    }
                    if (!c.type.spec.raw) {
                        if (g.nodeType != 1) {
                            var h = document.createElement("span");
                            h.appendChild(g);
                            g = h;
                        }
                        g.contentEditable = false;
                        g.classList.add("ProseMirror-widget");
                    }
                    a.call(this, b, ah, g, null);
                    this.widget = c;
                    f = this;
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                var c = {
                    domAtom: {
                        configurable: true
                    }
                };
                b.prototype.matchesWidget = function a(b) {
                    return (this.dirty == ab && b.type.eq(this.widget.type));
                };
                b.prototype.parseRule = function a() {
                    return {
                        ignore: true
                    };
                };
                b.prototype.stopEvent = function a(b) {
                    var c = this.widget.spec.stopEvent;
                    return c ? c(b) : false;
                };
                b.prototype.ignoreMutation = function a(b) {
                    return (b.type != "selection" || this.widget.spec.ignoreSelection);
                };
                c.domAtom.get = function() {
                    return true;
                };
                Object.defineProperties(b.prototype, c);
                return b;
            })(af);
            var aj = (function(a) {
                function b(b, c, d, e) {
                    a.call(this, b, ah, c, null);
                    this.textDOM = d;
                    this.text = e;
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                var c = {
                    size: {
                        configurable: true
                    }
                };
                c.size.get = function() {
                    return this.text.length;
                };
                b.prototype.localPosFromDOM = function a(b, c) {
                    if (b != this.textDOM) {
                        return this.posAtStart + (c ? this.size : 0);
                    }
                    return this.posAtStart + c;
                };
                b.prototype.domFromPos = function a(b) {
                    return {
                        node: this.textDOM,
                        offset: b
                    };
                };
                b.prototype.ignoreMutation = function a(b) {
                    return (b.type === "characterData" && b.target.nodeValue == b.oldValue);
                };
                Object.defineProperties(b.prototype, c);
                return b;
            })(af);
            var ak = (function(a) {
                function b(b, c, d, e) {
                    a.call(this, b, [], d, e);
                    this.mark = c;
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                b.create = function a(c, d, f, g) {
                    var h = g.nodeViews[d.type.name];
                    var i = h && h(d, g, f);
                    if (!i || !i.dom) {
                        i = e.DOMSerializer.renderSpec(document, d.type.spec.toDOM(d, f));
                    }
                    return new b(c, d, i.dom, i.contentDOM || i.dom);
                };
                b.prototype.parseRule = function a() {
                    return {
                        mark: this.mark.type.name,
                        attrs: this.mark.attrs,
                        contentElement: this.contentDOM
                    };
                };
                b.prototype.matchesMark = function a(b) {
                    return this.dirty != ae && this.mark.eq(b);
                };
                b.prototype.markDirty = function b(c, d) {
                    a.prototype.markDirty.call(this, c, d);
                    if (this.dirty != ab) {
                        var e = this.parent;
                        while(!e.node){
                            e = e.parent;
                        }
                        if (e.dirty < this.dirty) {
                            e.dirty = this.dirty;
                        }
                        this.dirty = ab;
                    }
                };
                b.prototype.slice = function a(c, d, e) {
                    var f = b.create(this.parent, this.mark, true, e);
                    var g = this.children, h = this.size;
                    if (d < h) {
                        g = aG(g, d, h, e);
                    }
                    if (c > 0) {
                        g = aG(g, 0, c, e);
                    }
                    for(var i = 0; i < g.length; i++){
                        g[i].parent = f;
                    }
                    f.children = g;
                    return f;
                };
                return b;
            })(af);
            var al = (function(a) {
                function b(b, c, d, e, f, g, h, i, j) {
                    a.call(this, b, c.isLeaf ? ah : [], f, g);
                    this.nodeDOM = h;
                    this.node = c;
                    this.outerDeco = d;
                    this.innerDeco = e;
                    if (g) {
                        this.updateChildren(i, j);
                    }
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                var c = {
                    size: {
                        configurable: true
                    },
                    border: {
                        configurable: true
                    },
                    domAtom: {
                        configurable: true
                    }
                };
                b.create = function a(c, d, f, g, h, i) {
                    var j;
                    var k = h.nodeViews[d.type.name], l;
                    var m = k && k(d, h, function() {
                        if (!l) {
                            return i;
                        }
                        if (l.parent) {
                            return l.parent.posBeforeChild(l);
                        }
                    }, f, g);
                    var n = m && m.dom, o = m && m.contentDOM;
                    if (d.isText) {
                        if (!n) {
                            n = document.createTextNode(d.text);
                        } else if (n.nodeType != 3) {
                            throw new RangeError("Text must be rendered as a DOM text node");
                        }
                    } else if (!n) {
                        (j = e.DOMSerializer.renderSpec(document, d.type.spec.toDOM(d))), (n = j.dom), (o = j.contentDOM);
                    }
                    if (!o && !d.isText && n.nodeName != "BR") {
                        if (!n.hasAttribute("contenteditable")) {
                            n.contentEditable = false;
                        }
                        if (d.type.spec.draggable) {
                            n.draggable = true;
                        }
                    }
                    var p = n;
                    n = aw(n, f, d);
                    if (m) {
                        return (l = new ap(c, d, f, g, n, o, p, m, h, i + 1));
                    } else if (d.isText) {
                        return new an(c, d, f, g, n, p, h);
                    } else {
                        return new b(c, d, f, g, n, o, p, h, i + 1);
                    }
                };
                b.prototype.parseRule = function a() {
                    var b = this;
                    if (this.node.type.spec.reparseInView) {
                        return null;
                    }
                    var c = {
                        node: this.node.type.name,
                        attrs: this.node.attrs
                    };
                    if (this.node.type.spec.code) {
                        c.preserveWhitespace = "full";
                    }
                    if (this.contentDOM && !this.contentLost) {
                        c.contentElement = this.contentDOM;
                    } else {
                        c.getContent = function() {
                            return b.contentDOM ? e.Fragment.empty : b.node.content;
                        };
                    }
                    return c;
                };
                b.prototype.matchesNode = function a(b, c, d) {
                    return (this.dirty == ab && b.eq(this.node) && ax(c, this.outerDeco) && d.eq(this.innerDeco));
                };
                c.size.get = function() {
                    return this.node.nodeSize;
                };
                c.border.get = function() {
                    return this.node.isLeaf ? 0 : 1;
                };
                b.prototype.updateChildren = function a(b, c) {
                    var d = this;
                    var f = this.node.inlineContent, h = c;
                    var i = b.composing && this.localCompositionInfo(b, c);
                    var j = i && i.pos > -1 ? i : null;
                    var k = i && i.pos < 0;
                    var l = new az(this, j && j.node);
                    aC(this.node, this.innerDeco, function(a, c, g) {
                        if (a.spec.marks) {
                            l.syncToMarks(a.spec.marks, f, b);
                        } else if (a.type.side >= 0 && !g) {
                            l.syncToMarks(c == d.node.childCount ? e.Mark.none : d.node.child(c).marks, f, b);
                        }
                        l.placeWidget(a, b, h);
                    }, function(a, c, d, e) {
                        l.syncToMarks(a.marks, f, b);
                        var g;
                        if (l.findNodeMatch(a, c, d, e)) ;
                        else if (k && b.state.selection.from > h && b.state.selection.to < h + a.nodeSize && (g = l.findIndexWithChild(i.node)) > -1 && l.updateNodeAt(a, c, d, g, b)) ;
                        else if (l.updateNextNode(a, c, d, b, e)) ;
                        else {
                            l.addNode(a, c, d, b, h);
                        }
                        h += a.nodeSize;
                    });
                    l.syncToMarks(ah, f, b);
                    if (this.node.isTextblock) {
                        l.addTextblockHacks();
                    }
                    l.destroyRest();
                    if (l.changed || this.dirty == ad) {
                        if (j) {
                            this.protectLocalComposition(b, j);
                        }
                        aq(this.contentDOM, this.children, b);
                        if (g.ios) {
                            aD(this.dom);
                        }
                    }
                };
                b.prototype.localCompositionInfo = function a(b, c) {
                    var e = b.state.selection;
                    var f = e.from;
                    var g = e.to;
                    if (!(b.state.selection instanceof d.TextSelection) || f < c || g > c + this.node.content.size) {
                        return;
                    }
                    var h = b.root.getSelection();
                    var i = aE(h.focusNode, h.focusOffset);
                    if (!i || !this.dom.contains(i.parentNode)) {
                        return;
                    }
                    if (this.node.inlineContent) {
                        var j = i.nodeValue;
                        var k = aF(this.node.content, j, f - c, g - c);
                        return k < 0 ? null : {
                            node: i,
                            pos: k,
                            text: j
                        };
                    } else {
                        return {
                            node: i,
                            pos: -1
                        };
                    }
                };
                b.prototype.protectLocalComposition = function a(b, c) {
                    var d = c.node;
                    var e = c.pos;
                    var f = c.text;
                    if (this.getDesc(d)) {
                        return;
                    }
                    var g = d;
                    for(;; g = g.parentNode){
                        if (g.parentNode == this.contentDOM) {
                            break;
                        }
                        while(g.previousSibling){
                            g.parentNode.removeChild(g.previousSibling);
                        }
                        while(g.nextSibling){
                            g.parentNode.removeChild(g.nextSibling);
                        }
                        if (g.pmViewDesc) {
                            g.pmViewDesc = null;
                        }
                    }
                    var h = new aj(this, g, d, f);
                    b.compositionNodes.push(h);
                    this.children = aG(this.children, e, e + f.length, b, h);
                };
                b.prototype.update = function a(b, c, d, e) {
                    if (this.dirty == ae || !b.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateInner(b, c, d, e);
                    return true;
                };
                b.prototype.updateInner = function a(b, c, d, e) {
                    this.updateOuterDeco(c);
                    this.node = b;
                    this.innerDeco = d;
                    if (this.contentDOM) {
                        this.updateChildren(e, this.posAtStart);
                    }
                    this.dirty = ab;
                };
                b.prototype.updateOuterDeco = function a(b) {
                    if (ax(b, this.outerDeco)) {
                        return;
                    }
                    var c = this.nodeDOM.nodeType != 1;
                    var d = this.dom;
                    this.dom = au(this.dom, this.nodeDOM, at(this.outerDeco, this.node, c), at(b, this.node, c));
                    if (this.dom != d) {
                        d.pmViewDesc = null;
                        this.dom.pmViewDesc = this;
                    }
                    this.outerDeco = b;
                };
                b.prototype.selectNode = function a() {
                    this.nodeDOM.classList.add("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.draggable = true;
                    }
                };
                b.prototype.deselectNode = function a() {
                    this.nodeDOM.classList.remove("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.removeAttribute("draggable");
                    }
                };
                c.domAtom.get = function() {
                    return this.node.isAtom;
                };
                Object.defineProperties(b.prototype, c);
                return b;
            })(af);
            function am(a, b, c, d, e) {
                aw(d, b, a);
                return new al(null, a, b, c, d, d, d, e, 0);
            }
            var an = (function(a) {
                function b(b, c, d, e, f, g, h) {
                    a.call(this, b, c, d, e, f, null, g, h);
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                var c = {
                    domAtom: {
                        configurable: true
                    }
                };
                b.prototype.parseRule = function a() {
                    var b = this.nodeDOM.parentNode;
                    while(b && b != this.dom && !b.pmIsDeco){
                        b = b.parentNode;
                    }
                    return {
                        skip: b || true
                    };
                };
                b.prototype.update = function a(b, c, d, e) {
                    if (this.dirty == ae || (this.dirty != ab && !this.inParent()) || !b.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateOuterDeco(c);
                    if ((this.dirty != ab || b.text != this.node.text) && b.text != this.nodeDOM.nodeValue) {
                        this.nodeDOM.nodeValue = b.text;
                        if (e.trackWrites == this.nodeDOM) {
                            e.trackWrites = null;
                        }
                    }
                    this.node = b;
                    this.dirty = ab;
                    return true;
                };
                b.prototype.inParent = function a() {
                    var b = this.parent.contentDOM;
                    for(var c = this.nodeDOM; c; c = c.parentNode){
                        if (c == b) {
                            return true;
                        }
                    }
                    return false;
                };
                b.prototype.domFromPos = function a(b) {
                    return {
                        node: this.nodeDOM,
                        offset: b
                    };
                };
                b.prototype.localPosFromDOM = function b(c, d, e) {
                    if (c == this.nodeDOM) {
                        return (this.posAtStart + Math.min(d, this.node.text.length));
                    }
                    return a.prototype.localPosFromDOM.call(this, c, d, e);
                };
                b.prototype.ignoreMutation = function a(b) {
                    return (b.type != "characterData" && b.type != "selection");
                };
                b.prototype.slice = function a(c, d, e) {
                    var f = this.node.cut(c, d), g = document.createTextNode(f.text);
                    return new b(this.parent, f, this.outerDeco, this.innerDeco, g, g, e);
                };
                b.prototype.markDirty = function b(c, d) {
                    a.prototype.markDirty.call(this, c, d);
                    if (this.dom != this.nodeDOM && (c == 0 || d == this.nodeDOM.nodeValue.length)) {
                        this.dirty = ae;
                    }
                };
                c.domAtom.get = function() {
                    return false;
                };
                Object.defineProperties(b.prototype, c);
                return b;
            })(al);
            var ao = (function(a) {
                function b() {
                    a.apply(this, arguments);
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                var c = {
                    domAtom: {
                        configurable: true
                    },
                    ignoreForCoords: {
                        configurable: true
                    }
                };
                b.prototype.parseRule = function a() {
                    return {
                        ignore: true
                    };
                };
                b.prototype.matchesHack = function a(b) {
                    return (this.dirty == ab && this.dom.nodeName == b);
                };
                c.domAtom.get = function() {
                    return true;
                };
                c.ignoreForCoords.get = function() {
                    return this.dom.nodeName == "IMG";
                };
                Object.defineProperties(b.prototype, c);
                return b;
            })(af);
            var ap = (function(a) {
                function b(b, c, d, e, f, g, h, i, j, k) {
                    a.call(this, b, c, d, e, f, g, h, j, k);
                    this.spec = i;
                }
                if (a) b.__proto__ = a;
                b.prototype = Object.create(a && a.prototype);
                b.prototype.constructor = b;
                b.prototype.update = function b(c, d, e, f) {
                    if (this.dirty == ae) {
                        return false;
                    }
                    if (this.spec.update) {
                        var g = this.spec.update(c, d, e);
                        if (g) {
                            this.updateInner(c, d, e, f);
                        }
                        return g;
                    } else if (!this.contentDOM && !c.isLeaf) {
                        return false;
                    } else {
                        return a.prototype.update.call(this, c, d, e, f);
                    }
                };
                b.prototype.selectNode = function b() {
                    this.spec.selectNode ? this.spec.selectNode() : a.prototype.selectNode.call(this);
                };
                b.prototype.deselectNode = function b() {
                    this.spec.deselectNode ? this.spec.deselectNode() : a.prototype.deselectNode.call(this);
                };
                b.prototype.setSelection = function b(c, d, e, f) {
                    this.spec.setSelection ? this.spec.setSelection(c, d, e) : a.prototype.setSelection.call(this, c, d, e, f);
                };
                b.prototype.destroy = function b() {
                    if (this.spec.destroy) {
                        this.spec.destroy();
                    }
                    a.prototype.destroy.call(this);
                };
                b.prototype.stopEvent = function a(b) {
                    return this.spec.stopEvent ? this.spec.stopEvent(b) : false;
                };
                b.prototype.ignoreMutation = function b(c) {
                    return this.spec.ignoreMutation ? this.spec.ignoreMutation(c) : a.prototype.ignoreMutation.call(this, c);
                };
                return b;
            })(al);
            function aq(a, b, c) {
                var d = a.firstChild, e = false;
                for(var f = 0; f < b.length; f++){
                    var g = b[f], h = g.dom;
                    if (h.parentNode == a) {
                        while(h != d){
                            d = ay(d);
                            e = true;
                        }
                        d = d.nextSibling;
                    } else {
                        e = true;
                        a.insertBefore(h, d);
                    }
                    if (g instanceof ak) {
                        var i = d ? d.previousSibling : a.lastChild;
                        aq(g.contentDOM, g.children, c);
                        d = i ? i.nextSibling : a.firstChild;
                    }
                }
                while(d){
                    d = ay(d);
                    e = true;
                }
                if (e && c.trackWrites == a) {
                    c.trackWrites = null;
                }
            }
            function ar(a) {
                if (a) {
                    this.nodeName = a;
                }
            }
            ar.prototype = Object.create(null);
            var as = [
                new ar()
            ];
            function at(a, b, c) {
                if (a.length == 0) {
                    return as;
                }
                var d = c ? as[0] : new ar(), e = [
                    d
                ];
                for(var f = 0; f < a.length; f++){
                    var g = a[f].type.attrs;
                    if (!g) {
                        continue;
                    }
                    if (g.nodeName) {
                        e.push((d = new ar(g.nodeName)));
                    }
                    for(var h in g){
                        var i = g[h];
                        if (i == null) {
                            continue;
                        }
                        if (c && e.length == 1) {
                            e.push((d = new ar(b.isInline ? "span" : "div")));
                        }
                        if (h == "class") {
                            d.class = (d.class ? d.class + " " : "") + i;
                        } else if (h == "style") {
                            d.style = (d.style ? d.style + ";" : "") + i;
                        } else if (h != "nodeName") {
                            d[h] = i;
                        }
                    }
                }
                return e;
            }
            function au(a, b, c, d) {
                if (c == as && d == as) {
                    return b;
                }
                var e = b;
                for(var f = 0; f < d.length; f++){
                    var g = d[f], h = c[f];
                    if (f) {
                        var i = void 0;
                        if (h && h.nodeName == g.nodeName && e != a && (i = e.parentNode) && i.tagName.toLowerCase() == g.nodeName) {
                            e = i;
                        } else {
                            i = document.createElement(g.nodeName);
                            i.pmIsDeco = true;
                            i.appendChild(e);
                            h = as[0];
                            e = i;
                        }
                    }
                    av(e, h || as[0], g);
                }
                return e;
            }
            function av(a, b, c) {
                for(var d in b){
                    if (d != "class" && d != "style" && d != "nodeName" && !(d in c)) {
                        a.removeAttribute(d);
                    }
                }
                for(var e in c){
                    if (e != "class" && e != "style" && e != "nodeName" && c[e] != b[e]) {
                        a.setAttribute(e, c[e]);
                    }
                }
                if (b.class != c.class) {
                    var f = b.class ? b.class.split(" ").filter(Boolean) : ah;
                    var g = c.class ? c.class.split(" ").filter(Boolean) : ah;
                    for(var h = 0; h < f.length; h++){
                        if (g.indexOf(f[h]) == -1) {
                            a.classList.remove(f[h]);
                        }
                    }
                    for(var i = 0; i < g.length; i++){
                        if (f.indexOf(g[i]) == -1) {
                            a.classList.add(g[i]);
                        }
                    }
                }
                if (b.style != c.style) {
                    if (b.style) {
                        var j = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, k;
                        while((k = j.exec(b.style))){
                            a.style.removeProperty(k[1]);
                        }
                    }
                    if (c.style) {
                        a.style.cssText += c.style;
                    }
                }
            }
            function aw(a, b, c) {
                return au(a, a, as, at(b, c, a.nodeType != 1));
            }
            function ax(a, b) {
                if (a.length != b.length) {
                    return false;
                }
                for(var c = 0; c < a.length; c++){
                    if (!a[c].type.eq(b[c].type)) {
                        return false;
                    }
                }
                return true;
            }
            function ay(a) {
                var b = a.nextSibling;
                a.parentNode.removeChild(a);
                return b;
            }
            var az = function a(b, c) {
                this.top = b;
                this.lock = c;
                this.index = 0;
                this.stack = [];
                this.changed = false;
                this.preMatch = aA(b.node.content, b.children);
            };
            az.prototype.destroyBetween = function a(b, c) {
                if (b == c) {
                    return;
                }
                for(var d = b; d < c; d++){
                    this.top.children[d].destroy();
                }
                this.top.children.splice(b, c - b);
                this.changed = true;
            };
            az.prototype.destroyRest = function a() {
                this.destroyBetween(this.index, this.top.children.length);
            };
            az.prototype.syncToMarks = function a(b, c, d) {
                var e = 0, f = this.stack.length >> 1;
                var g = Math.min(f, b.length);
                while(e < g && (e == f - 1 ? this.top : this.stack[(e + 1) << 1]).matchesMark(b[e]) && b[e].type.spec.spanning !== false){
                    e++;
                }
                while(e < f){
                    this.destroyRest();
                    this.top.dirty = ab;
                    this.index = this.stack.pop();
                    this.top = this.stack.pop();
                    f--;
                }
                while(f < b.length){
                    this.stack.push(this.top, this.index + 1);
                    var h = -1;
                    for(var i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++){
                        if (this.top.children[i].matchesMark(b[f])) {
                            h = i;
                            break;
                        }
                    }
                    if (h > -1) {
                        if (h > this.index) {
                            this.changed = true;
                            this.destroyBetween(this.index, h);
                        }
                        this.top = this.top.children[this.index];
                    } else {
                        var j = ak.create(this.top, b[f], c, d);
                        this.top.children.splice(this.index, 0, j);
                        this.top = j;
                        this.changed = true;
                    }
                    this.index = 0;
                    f++;
                }
            };
            az.prototype.findNodeMatch = function a(b, c, d, e) {
                var f = this.top.children, g = -1;
                if (e >= this.preMatch.index) {
                    for(var h = this.index; h < f.length; h++){
                        if (f[h].matchesNode(b, c, d)) {
                            g = h;
                            break;
                        }
                    }
                } else {
                    for(var i = this.index, j = Math.min(f.length, i + 1); i < j; i++){
                        var k = f[i];
                        if (k.matchesNode(b, c, d) && !this.preMatch.matched.has(k)) {
                            g = i;
                            break;
                        }
                    }
                }
                if (g < 0) {
                    return false;
                }
                this.destroyBetween(this.index, g);
                this.index++;
                return true;
            };
            az.prototype.updateNodeAt = function a(b, c, d, e, f) {
                var g = this.top.children[e];
                if (!g.update(b, c, d, f)) {
                    return false;
                }
                this.destroyBetween(this.index, e);
                this.index = e + 1;
                return true;
            };
            az.prototype.findIndexWithChild = function a(b) {
                for(;;){
                    var c = b.parentNode;
                    if (!c) {
                        return -1;
                    }
                    if (c == this.top.contentDOM) {
                        var d = b.pmViewDesc;
                        if (d) {
                            for(var e = this.index; e < this.top.children.length; e++){
                                if (this.top.children[e] == d) {
                                    return e;
                                }
                            }
                        }
                        return -1;
                    }
                    b = c;
                }
            };
            az.prototype.updateNextNode = function a(b, c, d, e, f) {
                for(var g = this.index; g < this.top.children.length; g++){
                    var h = this.top.children[g];
                    if (h instanceof al) {
                        var i = this.preMatch.matched.get(h);
                        if (i != null && i != f) {
                            return false;
                        }
                        var j = h.dom;
                        var k = this.lock && (j == this.lock || (j.nodeType == 1 && j.contains(this.lock.parentNode))) && !(b.isText && h.node && h.node.isText && h.nodeDOM.nodeValue == b.text && h.dirty != ae && ax(c, h.outerDeco));
                        if (!k && h.update(b, c, d, e)) {
                            this.destroyBetween(this.index, g);
                            if (h.dom != j) {
                                this.changed = true;
                            }
                            this.index++;
                            return true;
                        }
                        break;
                    }
                }
                return false;
            };
            az.prototype.addNode = function a(b, c, d, e, f) {
                this.top.children.splice(this.index++, 0, al.create(this.top, b, c, d, e, f));
                this.changed = true;
            };
            az.prototype.placeWidget = function a(b, c, d) {
                var e = this.index < this.top.children.length ? this.top.children[this.index] : null;
                if (e && e.matchesWidget(b) && (b == e.widget || !e.widget.type.toDOM.parentNode)) {
                    this.index++;
                } else {
                    var f = new ai(this.top, b, c, d);
                    this.top.children.splice(this.index++, 0, f);
                    this.changed = true;
                }
            };
            az.prototype.addTextblockHacks = function a() {
                var b = this.top.children[this.index - 1];
                while(b instanceof ak){
                    b = b.children[b.children.length - 1];
                }
                if (!b || !(b instanceof an) || /\n$/.test(b.node.text)) {
                    if ((g.safari || g.chrome) && b && b.dom.contentEditable == "false") {
                        this.addHackNode("IMG");
                    }
                    this.addHackNode("BR");
                }
            };
            az.prototype.addHackNode = function a(b) {
                if (this.index < this.top.children.length && this.top.children[this.index].matchesHack(b)) {
                    this.index++;
                } else {
                    var c = document.createElement(b);
                    if (b == "IMG") {
                        c.className = "ProseMirror-separator";
                    }
                    if (b == "BR") {
                        c.className = "ProseMirror-trailingBreak";
                    }
                    this.top.children.splice(this.index++, 0, new ao(this.top, ah, c, null));
                    this.changed = true;
                }
            };
            function aA(a, b) {
                var c = a.childCount, d = b.length, e = new Map();
                for(; c > 0 && d > 0; d--){
                    var f = b[d - 1], g = f.node;
                    if (!g) {
                        continue;
                    }
                    if (g != a.child(c - 1)) {
                        break;
                    }
                    --c;
                    e.set(f, c);
                }
                return {
                    index: c,
                    matched: e
                };
            }
            function aB(a, b) {
                return a.type.side - b.type.side;
            }
            function aC(a, b, c, d) {
                var e = b.locals(a), f = 0;
                if (e.length == 0) {
                    for(var g = 0; g < a.childCount; g++){
                        var h = a.child(g);
                        d(h, e, b.forChild(f, h), g);
                        f += h.nodeSize;
                    }
                    return;
                }
                var i = 0, j = [], k = null;
                for(var l = 0;;){
                    if (i < e.length && e[i].to == f) {
                        var m = e[i++], n = void 0;
                        while(i < e.length && e[i].to == f){
                            (n || (n = [
                                m
                            ])).push(e[i++]);
                        }
                        if (n) {
                            n.sort(aB);
                            for(var o = 0; o < n.length; o++){
                                c(n[o], l, !!k);
                            }
                        } else {
                            c(m, l, !!k);
                        }
                    }
                    var p = void 0, q = void 0;
                    if (k) {
                        q = -1;
                        p = k;
                        k = null;
                    } else if (l < a.childCount) {
                        q = l;
                        p = a.child(l++);
                    } else {
                        break;
                    }
                    for(var r = 0; r < j.length; r++){
                        if (j[r].to <= f) {
                            j.splice(r--, 1);
                        }
                    }
                    while(i < e.length && e[i].from <= f && e[i].to > f){
                        j.push(e[i++]);
                    }
                    var s = f + p.nodeSize;
                    if (p.isText) {
                        var t = s;
                        if (i < e.length && e[i].from < t) {
                            t = e[i].from;
                        }
                        for(var u = 0; u < j.length; u++){
                            if (j[u].to < t) {
                                t = j[u].to;
                            }
                        }
                        if (t < s) {
                            k = p.cut(t - f);
                            p = p.cut(0, t - f);
                            s = t;
                            q = -1;
                        }
                    }
                    var v = !j.length ? ah : p.isInline && !p.isLeaf ? j.filter(function(a) {
                        return !a.inline;
                    }) : j.slice();
                    d(p, v, b.forChild(f, p), q);
                    f = s;
                }
            }
            function aD(a) {
                if (a.nodeName == "UL" || a.nodeName == "OL") {
                    var b = a.style.cssText;
                    a.style.cssText = b + "; list-style: square !important";
                    window.getComputedStyle(a).listStyle;
                    a.style.cssText = b;
                }
            }
            function aE(a, b) {
                for(;;){
                    if (a.nodeType == 3) {
                        return a;
                    }
                    if (a.nodeType == 1 && b > 0) {
                        if (a.childNodes.length > b && a.childNodes[b].nodeType == 3) {
                            return a.childNodes[b];
                        }
                        a = a.childNodes[b - 1];
                        b = t(a);
                    } else if (a.nodeType == 1 && b < a.childNodes.length) {
                        a = a.childNodes[b];
                        b = 0;
                    } else {
                        return null;
                    }
                }
            }
            function aF(a, b, c, d) {
                for(var e = 0, f = 0; e < a.childCount && f <= d;){
                    var g = a.child(e++), h = f;
                    f += g.nodeSize;
                    if (!g.isText) {
                        continue;
                    }
                    var i = g.text;
                    while(e < a.childCount){
                        var j = a.child(e++);
                        f += j.nodeSize;
                        if (!j.isText) {
                            break;
                        }
                        i += j.text;
                    }
                    if (f >= c) {
                        var k = i.lastIndexOf(b, d - h);
                        if (k >= 0 && k + b.length + h >= c) {
                            return h + k;
                        }
                    }
                }
                return -1;
            }
            function aG(a, b, c, d, e) {
                var f = [];
                for(var g = 0, h = 0; g < a.length; g++){
                    var i = a[g], j = h, k = (h += i.size);
                    if (j >= c || k <= b) {
                        f.push(i);
                    } else {
                        if (j < b) {
                            f.push(i.slice(0, b - j, d));
                        }
                        if (e) {
                            f.push(e);
                            e = null;
                        }
                        if (k > c) {
                            f.push(i.slice(c - j, i.size, d));
                        }
                    }
                }
                return f;
            }
            function aH(a, b) {
                var c = a.root.getSelection(), e = a.state.doc;
                if (!c.focusNode) {
                    return null;
                }
                var f = a.docView.nearestDesc(c.focusNode), g = f && f.size == 0;
                var h = a.docView.posFromDOM(c.focusNode, c.focusOffset);
                if (h < 0) {
                    return null;
                }
                var i = e.resolve(h), j, k;
                if (w(c)) {
                    j = i;
                    while(f && !f.node){
                        f = f.parent;
                    }
                    if (f && f.node.isAtom && d.NodeSelection.isSelectable(f.node) && f.parent && !(f.node.isInline && u(c.focusNode, c.focusOffset, f.dom))) {
                        var l = f.posBefore;
                        k = new d.NodeSelection(h == l ? i : e.resolve(l));
                    }
                } else {
                    var m = a.docView.posFromDOM(c.anchorNode, c.anchorOffset);
                    if (m < 0) {
                        return null;
                    }
                    j = e.resolve(m);
                }
                if (!k) {
                    var n = b == "pointer" || (a.state.selection.head < i.pos && !g) ? 1 : -1;
                    k = aS(a, j, i, n);
                }
                return k;
            }
            function aI(a) {
                return a.editable ? a.hasFocus() : aU(a) && document.activeElement && document.activeElement.contains(a.dom);
            }
            function aJ(a, b) {
                var c = a.state.selection;
                aQ(a, c);
                if (!aI(a)) {
                    return;
                }
                if (!b && a.mouseDown && a.mouseDown.allowDefault) {
                    a.mouseDown.delayedSelectionSync = true;
                    a.domObserver.setCurSelection();
                    return;
                }
                a.domObserver.disconnectSelection();
                if (a.cursorWrapper) {
                    aP(a);
                } else {
                    var e = c.anchor;
                    var f = c.head;
                    var g, h;
                    if (aK && !(c instanceof d.TextSelection)) {
                        if (!c.$from.parent.inlineContent) {
                            g = aL(a, c.from);
                        }
                        if (!c.empty && !c.$from.parent.inlineContent) {
                            h = aL(a, c.to);
                        }
                    }
                    a.docView.setSelection(e, f, a.root, b);
                    if (aK) {
                        if (g) {
                            aN(g);
                        }
                        if (h) {
                            aN(h);
                        }
                    }
                    if (c.visible) {
                        a.dom.classList.remove("ProseMirror-hideselection");
                    } else {
                        a.dom.classList.add("ProseMirror-hideselection");
                        if ("onselectionchange" in document) {
                            aO(a);
                        }
                    }
                }
                a.domObserver.setCurSelection();
                a.domObserver.connectSelection();
            }
            var aK = g.safari || (g.chrome && g.chrome_version < 63);
            function aL(a, b) {
                var c = a.docView.domFromPos(b, 0);
                var d = c.node;
                var e = c.offset;
                var f = e < d.childNodes.length ? d.childNodes[e] : null;
                var h = e ? d.childNodes[e - 1] : null;
                if (g.safari && f && f.contentEditable == "false") {
                    return aM(f);
                }
                if ((!f || f.contentEditable == "false") && (!h || h.contentEditable == "false")) {
                    if (f) {
                        return aM(f);
                    } else if (h) {
                        return aM(h);
                    }
                }
            }
            function aM(a) {
                a.contentEditable = "true";
                if (g.safari && a.draggable) {
                    a.draggable = false;
                    a.wasDraggable = true;
                }
                return a;
            }
            function aN(a) {
                a.contentEditable = "false";
                if (a.wasDraggable) {
                    a.draggable = true;
                    a.wasDraggable = null;
                }
            }
            function aO(a) {
                var b = a.dom.ownerDocument;
                b.removeEventListener("selectionchange", a.hideSelectionGuard);
                var c = a.root.getSelection();
                var d = c.anchorNode, e = c.anchorOffset;
                b.addEventListener("selectionchange", (a.hideSelectionGuard = function() {
                    if (c.anchorNode != d || c.anchorOffset != e) {
                        b.removeEventListener("selectionchange", a.hideSelectionGuard);
                        setTimeout(function() {
                            if (!aI(a) || a.state.selection.visible) {
                                a.dom.classList.remove("ProseMirror-hideselection");
                            }
                        }, 20);
                    }
                }));
            }
            function aP(a) {
                var b = a.root.getSelection(), c = document.createRange();
                var d = a.cursorWrapper.dom, e = d.nodeName == "IMG";
                if (e) {
                    c.setEnd(d.parentNode, m(d) + 1);
                } else {
                    c.setEnd(d, 0);
                }
                c.collapse(false);
                b.removeAllRanges();
                b.addRange(c);
                if (!e && !a.state.selection.visible && g.ie && g.ie_version <= 11) {
                    d.disabled = true;
                    d.disabled = false;
                }
            }
            function aQ(a, b) {
                if (b instanceof d.NodeSelection) {
                    var c = a.docView.descAt(b.from);
                    if (c != a.lastSelectedViewDesc) {
                        aR(a);
                        if (c) {
                            c.selectNode();
                        }
                        a.lastSelectedViewDesc = c;
                    }
                } else {
                    aR(a);
                }
            }
            function aR(a) {
                if (a.lastSelectedViewDesc) {
                    if (a.lastSelectedViewDesc.parent) {
                        a.lastSelectedViewDesc.deselectNode();
                    }
                    a.lastSelectedViewDesc = null;
                }
            }
            function aS(a, b, c, e) {
                return (a.someProp("createSelectionBetween", function(d) {
                    return d(a, b, c);
                }) || d.TextSelection.between(b, c, e));
            }
            function aT(a) {
                if (a.editable && a.root.activeElement != a.dom) {
                    return false;
                }
                return aU(a);
            }
            function aU(a) {
                var b = a.root.getSelection();
                if (!b.anchorNode) {
                    return false;
                }
                try {
                    return (a.dom.contains(b.anchorNode.nodeType == 3 ? b.anchorNode.parentNode : b.anchorNode) && (a.editable || a.dom.contains(b.focusNode.nodeType == 3 ? b.focusNode.parentNode : b.focusNode)));
                } catch (c) {
                    return false;
                }
            }
            function aV(a) {
                var b = a.docView.domFromPos(a.state.selection.anchor, 0);
                var c = a.root.getSelection();
                return q(b.node, b.offset, c.anchorNode, c.anchorOffset);
            }
            function aW(a, b) {
                var c = a.selection;
                var e = c.$anchor;
                var f = c.$head;
                var g = b > 0 ? e.max(f) : e.min(f);
                var h = !g.parent.inlineContent ? g : g.depth ? a.doc.resolve(b > 0 ? g.after() : g.before()) : null;
                return (h && d.Selection.findFrom(h, b));
            }
            function aX(a, b) {
                a.dispatch(a.state.tr.setSelection(b).scrollIntoView());
                return true;
            }
            function aY(a, b, c) {
                var e = a.state.selection;
                if (e instanceof d.TextSelection) {
                    if (!e.empty || c.indexOf("s") > -1) {
                        return false;
                    } else if (a.endOfTextblock(b > 0 ? "right" : "left")) {
                        var f = aW(a.state, b);
                        if (f && f instanceof d.NodeSelection) {
                            return aX(a, f);
                        }
                        return false;
                    } else if (!(g.mac && c.indexOf("m") > -1)) {
                        var h = e.$head, i = h.textOffset ? null : b < 0 ? h.nodeBefore : h.nodeAfter, j;
                        if (!i || i.isText) {
                            return false;
                        }
                        var k = b < 0 ? h.pos - i.nodeSize : h.pos;
                        if (!(i.isAtom || ((j = a.docView.descAt(k)) && !j.contentDOM))) {
                            return false;
                        }
                        if (d.NodeSelection.isSelectable(i)) {
                            return aX(a, new d.NodeSelection(b < 0 ? a.state.doc.resolve(h.pos - i.nodeSize) : h));
                        } else if (g.webkit) {
                            return aX(a, new d.TextSelection(a.state.doc.resolve(b < 0 ? k : k + i.nodeSize)));
                        } else {
                            return false;
                        }
                    }
                } else if (e instanceof d.NodeSelection && e.node.isInline) {
                    return aX(a, new d.TextSelection(b > 0 ? e.$to : e.$from));
                } else {
                    var l = aW(a.state, b);
                    if (l) {
                        return aX(a, l);
                    }
                    return false;
                }
            }
            function aZ(a) {
                return a.nodeType == 3 ? a.nodeValue.length : a.childNodes.length;
            }
            function a$(a) {
                var b = a.pmViewDesc;
                return (b && b.size == 0 && (a.nextSibling || a.nodeName != "BR"));
            }
            function a_(a) {
                var b = a.root.getSelection();
                var c = b.focusNode, d = b.focusOffset;
                if (!c) {
                    return;
                }
                var e, f, h = false;
                if (g.gecko && c.nodeType == 1 && d < aZ(c) && a$(c.childNodes[d])) {
                    h = true;
                }
                for(;;){
                    if (d > 0) {
                        if (c.nodeType != 1) {
                            break;
                        } else {
                            var i = c.childNodes[d - 1];
                            if (a$(i)) {
                                e = c;
                                f = --d;
                            } else if (i.nodeType == 3) {
                                c = i;
                                d = c.nodeValue.length;
                            } else {
                                break;
                            }
                        }
                    } else if (a1(c)) {
                        break;
                    } else {
                        var j = c.previousSibling;
                        while(j && a$(j)){
                            e = c.parentNode;
                            f = m(j);
                            j = j.previousSibling;
                        }
                        if (!j) {
                            c = c.parentNode;
                            if (c == a.dom) {
                                break;
                            }
                            d = 0;
                        } else {
                            c = j;
                            d = aZ(c);
                        }
                    }
                }
                if (h) {
                    a2(a, b, c, d);
                } else if (e) {
                    a2(a, b, e, f);
                }
            }
            function a0(a) {
                var b = a.root.getSelection();
                var c = b.focusNode, d = b.focusOffset;
                if (!c) {
                    return;
                }
                var e = aZ(c);
                var f, g;
                for(;;){
                    if (d < e) {
                        if (c.nodeType != 1) {
                            break;
                        }
                        var h = c.childNodes[d];
                        if (a$(h)) {
                            f = c;
                            g = ++d;
                        } else {
                            break;
                        }
                    } else if (a1(c)) {
                        break;
                    } else {
                        var i = c.nextSibling;
                        while(i && a$(i)){
                            f = i.parentNode;
                            g = m(i) + 1;
                            i = i.nextSibling;
                        }
                        if (!i) {
                            c = c.parentNode;
                            if (c == a.dom) {
                                break;
                            }
                            d = e = 0;
                        } else {
                            c = i;
                            d = 0;
                            e = aZ(c);
                        }
                    }
                }
                if (f) {
                    a2(a, b, f, g);
                }
            }
            function a1(a) {
                var b = a.pmViewDesc;
                return b && b.node && b.node.isBlock;
            }
            function a2(a, b, c, d) {
                if (w(b)) {
                    var e = document.createRange();
                    e.setEnd(c, d);
                    e.setStart(c, d);
                    b.removeAllRanges();
                    b.addRange(e);
                } else if (b.extend) {
                    b.extend(c, d);
                }
                a.domObserver.setCurSelection();
                var f = a.state;
                setTimeout(function() {
                    if (a.state == f) {
                        aJ(a);
                    }
                }, 50);
            }
            function a3(a, b, c) {
                var e = a.state.selection;
                if ((e instanceof d.TextSelection && !e.empty) || c.indexOf("s") > -1) {
                    return false;
                }
                if (g.mac && c.indexOf("m") > -1) {
                    return false;
                }
                var f = e.$from;
                var h = e.$to;
                if (!f.parent.inlineContent || a.endOfTextblock(b < 0 ? "up" : "down")) {
                    var i = aW(a.state, b);
                    if (i && i instanceof d.NodeSelection) {
                        return aX(a, i);
                    }
                }
                if (!f.parent.inlineContent) {
                    var j = b < 0 ? f : h;
                    var k = e instanceof d.AllSelection ? d.Selection.near(j, b) : d.Selection.findFrom(j, b);
                    return k ? aX(a, k) : false;
                }
                return false;
            }
            function a4(a, b) {
                if (!(a.state.selection instanceof d.TextSelection)) {
                    return true;
                }
                var c = a.state.selection;
                var e = c.$head;
                var f = c.$anchor;
                var g = c.empty;
                if (!e.sameParent(f)) {
                    return true;
                }
                if (!g) {
                    return false;
                }
                if (a.endOfTextblock(b > 0 ? "forward" : "backward")) {
                    return true;
                }
                var h = !e.textOffset && (b < 0 ? e.nodeBefore : e.nodeAfter);
                if (h && !h.isText) {
                    var i = a.state.tr;
                    if (b < 0) {
                        i.delete(e.pos - h.nodeSize, e.pos);
                    } else {
                        i.delete(e.pos, e.pos + h.nodeSize);
                    }
                    a.dispatch(i);
                    return true;
                }
                return false;
            }
            function a5(a, b, c) {
                a.domObserver.stop();
                b.contentEditable = c;
                a.domObserver.start();
            }
            function a6(a) {
                if (!g.safari || a.state.selection.$head.parentOffset > 0) {
                    return;
                }
                var b = a.root.getSelection();
                var c = b.focusNode;
                var d = b.focusOffset;
                if (c && c.nodeType == 1 && d == 0 && c.firstChild && c.firstChild.contentEditable == "false") {
                    var e = c.firstChild;
                    a5(a, e, true);
                    setTimeout(function() {
                        return a5(a, e, false);
                    }, 20);
                }
            }
            function a7(a) {
                var b = "";
                if (a.ctrlKey) {
                    b += "c";
                }
                if (a.metaKey) {
                    b += "m";
                }
                if (a.altKey) {
                    b += "a";
                }
                if (a.shiftKey) {
                    b += "s";
                }
                return b;
            }
            function a8(a, b) {
                var c = b.keyCode, d = a7(b);
                if (c == 8 || (g.mac && c == 72 && d == "c")) {
                    return (a4(a, -1) || a_(a));
                } else if (c == 46 || (g.mac && c == 68 && d == "c")) {
                    return (a4(a, 1) || a0(a));
                } else if (c == 13 || c == 27) {
                    return true;
                } else if (c == 37) {
                    return (aY(a, -1, d) || a_(a));
                } else if (c == 39) {
                    return (aY(a, 1, d) || a0(a));
                } else if (c == 38) {
                    return (a3(a, -1, d) || a_(a));
                } else if (c == 40) {
                    return (a6(a) || a3(a, 1, d) || a0(a));
                } else if (d == (g.mac ? "m" : "c") && (c == 66 || c == 73 || c == 89 || c == 90)) {
                    return true;
                }
                return false;
            }
            function a9(a, b, c) {
                var d = a.docView.parseRange(b, c);
                var f = d.node;
                var h = d.fromOffset;
                var i = d.toOffset;
                var j = d.from;
                var k = d.to;
                var l = a.root.getSelection(), m = null, n = l.anchorNode;
                if (n && a.dom.contains(n.nodeType == 1 ? n : n.parentNode)) {
                    m = [
                        {
                            node: n,
                            offset: l.anchorOffset
                        }
                    ];
                    if (!w(l)) {
                        m.push({
                            node: l.focusNode,
                            offset: l.focusOffset
                        });
                    }
                }
                if (g.chrome && a.lastKeyCode === 8) {
                    for(var o = i; o > h; o--){
                        var p = f.childNodes[o - 1], q = p.pmViewDesc;
                        if (p.nodeName == "BR" && !q) {
                            i = o;
                            break;
                        }
                        if (!q || q.size) {
                            break;
                        }
                    }
                }
                var r = a.state.doc;
                var s = a.someProp("domParser") || e.DOMParser.fromSchema(a.state.schema);
                var t = r.resolve(j);
                var u = null, v = s.parse(f, {
                    topNode: t.parent,
                    topMatch: t.parent.contentMatchAt(t.index()),
                    topOpen: true,
                    from: h,
                    to: i,
                    preserveWhitespace: t.parent.type.spec.code ? "full" : true,
                    editableContent: true,
                    findPositions: m,
                    ruleFromNode: ba,
                    context: t
                });
                if (m && m[0].pos != null) {
                    var x = m[0].pos, y = m[1] && m[1].pos;
                    if (y == null) {
                        y = x;
                    }
                    u = {
                        anchor: x + j,
                        head: y + j
                    };
                }
                return {
                    doc: v,
                    sel: u,
                    from: j,
                    to: k
                };
            }
            function ba(a) {
                var b = a.pmViewDesc;
                if (b) {
                    return b.parseRule();
                } else if (a.nodeName == "BR" && a.parentNode) {
                    if (g.safari && /^(ul|ol)$/i.test(a.parentNode.nodeName)) {
                        var c = document.createElement("div");
                        c.appendChild(document.createElement("li"));
                        return {
                            skip: c
                        };
                    } else if (a.parentNode.lastChild == a || (g.safari && /^(tr|table)$/i.test(a.parentNode.nodeName))) {
                        return {
                            ignore: true
                        };
                    }
                } else if (a.nodeName == "IMG" && a.getAttribute("mark-placeholder")) {
                    return {
                        ignore: true
                    };
                }
            }
            function bb(a, b, c, e, f) {
                if (b < 0) {
                    var h = a.lastSelectionTime > Date.now() - 50 ? a.lastSelectionOrigin : null;
                    var i = aH(a, h);
                    if (i && !a.state.selection.eq(i)) {
                        var j = a.state.tr.setSelection(i);
                        if (h == "pointer") {
                            j.setMeta("pointer", true);
                        } else if (h == "key") {
                            j.scrollIntoView();
                        }
                        a.dispatch(j);
                    }
                    return;
                }
                var k = a.state.doc.resolve(b);
                var l = k.sharedDepth(c);
                b = k.before(l + 1);
                c = a.state.doc.resolve(c).after(l + 1);
                var m = a.state.selection;
                var n = a9(a, b, c);
                if (g.chrome && a.cursorWrapper && n.sel && n.sel.anchor == a.cursorWrapper.deco.from) {
                    var o = a.cursorWrapper.deco.type.toDOM.nextSibling;
                    var p = o && o.nodeValue ? o.nodeValue.length : 1;
                    n.sel = {
                        anchor: n.sel.anchor + p,
                        head: n.sel.anchor + p
                    };
                }
                var q = a.state.doc, r = q.slice(n.from, n.to);
                var s, t;
                if (a.lastKeyCode === 8 && Date.now() - 100 < a.lastKeyCodeTime) {
                    s = a.state.selection.to;
                    t = "end";
                } else {
                    s = a.state.selection.from;
                    t = "start";
                }
                a.lastKeyCode = null;
                var u = bg(r.content, n.doc.content, n.from, s, t);
                if (!u) {
                    if (e && m instanceof d.TextSelection && !m.empty && m.$head.sameParent(m.$anchor) && !a.composing && !(n.sel && n.sel.anchor != n.sel.head)) {
                        u = {
                            start: m.from,
                            endA: m.to,
                            endB: m.to
                        };
                    } else if (((g.ios && a.lastIOSEnter > Date.now() - 225) || g.android) && f.some(function(a) {
                        return a.nodeName == "DIV" || a.nodeName == "P";
                    }) && a.someProp("handleKeyDown", function(b) {
                        return b(a, x(13, "Enter"));
                    })) {
                        a.lastIOSEnter = 0;
                        return;
                    } else {
                        if (n.sel) {
                            var v = bc(a, a.state.doc, n.sel);
                            if (v && !v.eq(a.state.selection)) {
                                a.dispatch(a.state.tr.setSelection(v));
                            }
                        }
                        return;
                    }
                }
                a.domChangeCount++;
                if (a.state.selection.from < a.state.selection.to && u.start == u.endB && a.state.selection instanceof d.TextSelection) {
                    if (u.start > a.state.selection.from && u.start <= a.state.selection.from + 2) {
                        u.start = a.state.selection.from;
                    } else if (u.endA < a.state.selection.to && u.endA >= a.state.selection.to - 2) {
                        u.endB += a.state.selection.to - u.endA;
                        u.endA = a.state.selection.to;
                    }
                }
                if (g.ie && g.ie_version <= 11 && u.endB == u.start + 1 && u.endA == u.start && u.start > n.from && n.doc.textBetween(u.start - n.from - 1, u.start - n.from + 1) == " \u00a0") {
                    u.start--;
                    u.endA--;
                    u.endB--;
                }
                var w = n.doc.resolveNoCache(u.start - n.from);
                var y = n.doc.resolveNoCache(u.endB - n.from);
                var z = w.sameParent(y) && w.parent.inlineContent;
                var A;
                if (((g.ios && a.lastIOSEnter > Date.now() - 225 && (!z || f.some(function(a) {
                    return a.nodeName == "DIV" || a.nodeName == "P";
                }))) || (!z && w.pos < n.doc.content.size && (A = d.Selection.findFrom(n.doc.resolve(w.pos + 1), 1, true)) && A.head == y.pos)) && a.someProp("handleKeyDown", function(b) {
                    return b(a, x(13, "Enter"));
                })) {
                    a.lastIOSEnter = 0;
                    return;
                }
                if (a.state.selection.anchor > u.start && be(q, u.start, u.endA, w, y) && a.someProp("handleKeyDown", function(b) {
                    return b(a, x(8, "Backspace"));
                })) {
                    if (g.android && g.chrome) {
                        a.domObserver.suppressSelectionUpdates();
                    }
                    return;
                }
                if (g.chrome && g.android && u.toB == u.from) {
                    a.lastAndroidDelete = Date.now();
                }
                if (g.android && !z && w.start() != y.start() && y.parentOffset == 0 && w.depth == y.depth && n.sel && n.sel.anchor == n.sel.head && n.sel.head == u.endA) {
                    u.endB -= 2;
                    y = n.doc.resolveNoCache(u.endB - n.from);
                    setTimeout(function() {
                        a.someProp("handleKeyDown", function(b) {
                            return b(a, x(13, "Enter"));
                        });
                    }, 20);
                }
                var B = u.start, C = u.endA;
                var D, E, F, G;
                if (z) {
                    if (w.pos == y.pos) {
                        if (g.ie && g.ie_version <= 11 && w.parentOffset == 0) {
                            a.domObserver.suppressSelectionUpdates();
                            setTimeout(function() {
                                return aJ(a);
                            }, 20);
                        }
                        D = a.state.tr.delete(B, C);
                        E = q.resolve(u.start).marksAcross(q.resolve(u.endA));
                    } else if (u.endA == u.endB && (G = q.resolve(u.start)) && (F = bd(w.parent.content.cut(w.parentOffset, y.parentOffset), G.parent.content.cut(G.parentOffset, u.endA - G.start())))) {
                        D = a.state.tr;
                        if (F.type == "add") {
                            D.addMark(B, C, F.mark);
                        } else {
                            D.removeMark(B, C, F.mark);
                        }
                    } else if (w.parent.child(w.index()).isText && w.index() == y.index() - (y.textOffset ? 0 : 1)) {
                        var H = w.parent.textBetween(w.parentOffset, y.parentOffset);
                        if (a.someProp("handleTextInput", function(b) {
                            return b(a, B, C, H);
                        })) {
                            return;
                        }
                        D = a.state.tr.insertText(H, B, C);
                    }
                }
                if (!D) {
                    D = a.state.tr.replace(B, C, n.doc.slice(u.start - n.from, u.endB - n.from));
                }
                if (n.sel) {
                    var I = bc(a, D.doc, n.sel);
                    if (I && !((g.chrome && g.android && a.composing && I.empty && (u.start != u.endB || a.lastAndroidDelete < Date.now() - 100) && (I.head == B || I.head == D.mapping.map(C) - 1)) || (g.ie && I.empty && I.head == B))) {
                        D.setSelection(I);
                    }
                }
                if (E) {
                    D.ensureMarks(E);
                }
                a.dispatch(D.scrollIntoView());
            }
            function bc(a, b, c) {
                if (Math.max(c.anchor, c.head) > b.content.size) {
                    return null;
                }
                return aS(a, b.resolve(c.anchor), b.resolve(c.head));
            }
            function bd(a, b) {
                var c = a.firstChild.marks, d = b.firstChild.marks;
                var f = c, g = d, h, i, j;
                for(var k = 0; k < d.length; k++){
                    f = d[k].removeFromSet(f);
                }
                for(var l = 0; l < c.length; l++){
                    g = c[l].removeFromSet(g);
                }
                if (f.length == 1 && g.length == 0) {
                    i = f[0];
                    h = "add";
                    j = function(a) {
                        return a.mark(i.addToSet(a.marks));
                    };
                } else if (f.length == 0 && g.length == 1) {
                    i = g[0];
                    h = "remove";
                    j = function(a) {
                        return a.mark(i.removeFromSet(a.marks));
                    };
                } else {
                    return null;
                }
                var m = [];
                for(var n = 0; n < b.childCount; n++){
                    m.push(j(b.child(n)));
                }
                if (e.Fragment.from(m).eq(a)) {
                    return {
                        mark: i,
                        type: h
                    };
                }
            }
            function be(a, b, c, d, e) {
                if (!d.parent.isTextblock || c - b <= e.pos - d.pos || bf(d, true, false) < e.pos) {
                    return false;
                }
                var f = a.resolve(b);
                if (f.parentOffset < f.parent.content.size || !f.parent.isTextblock) {
                    return false;
                }
                var g = a.resolve(bf(f, true, true));
                if (!g.parent.isTextblock || g.pos > c || bf(g, true, false) < c) {
                    return false;
                }
                return d.parent.content.cut(d.parentOffset).eq(g.parent.content);
            }
            function bf(a, b, c) {
                var d = a.depth, e = b ? a.end() : a.pos;
                while(d > 0 && (b || a.indexAfter(d) == a.node(d).childCount)){
                    d--;
                    e++;
                    b = false;
                }
                if (c) {
                    var f = a.node(d).maybeChild(a.indexAfter(d));
                    while(f && !f.isLeaf){
                        f = f.firstChild;
                        e++;
                    }
                }
                return e;
            }
            function bg(a, b, c, d, e) {
                var f = a.findDiffStart(b, c);
                if (f == null) {
                    return null;
                }
                var g = a.findDiffEnd(b, c + a.size, c + b.size);
                var h = g.a;
                var i = g.b;
                if (e == "end") {
                    var j = Math.max(0, f - Math.min(h, i));
                    d -= h + j - f;
                }
                if (h < f && a.size < b.size) {
                    var k = d <= f && d >= h ? f - d : 0;
                    f -= k;
                    i = f + (i - h);
                    h = f;
                } else if (i < f) {
                    var l = d <= f && d >= i ? f - d : 0;
                    f -= l;
                    h = f + (h - i);
                    i = f;
                }
                return {
                    start: f,
                    endA: h,
                    endB: i
                };
            }
            function bh(a, b) {
                var c = [];
                var d = b.content;
                var f = b.openStart;
                var g = b.openEnd;
                while(f > 1 && g > 1 && d.childCount == 1 && d.firstChild.childCount == 1){
                    f--;
                    g--;
                    var h = d.firstChild;
                    c.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null);
                    d = h.content;
                }
                var i = a.someProp("clipboardSerializer") || e.DOMSerializer.fromSchema(a.state.schema);
                var j = br(), k = j.createElement("div");
                k.appendChild(i.serializeFragment(d, {
                    document: j
                }));
                var l = k.firstChild, m;
                while(l && l.nodeType == 1 && (m = bp[l.nodeName.toLowerCase()])){
                    for(var n = m.length - 1; n >= 0; n--){
                        var o = j.createElement(m[n]);
                        while(k.firstChild){
                            o.appendChild(k.firstChild);
                        }
                        k.appendChild(o);
                        if (m[n] != "tbody") {
                            f++;
                            g++;
                        }
                    }
                    l = k.firstChild;
                }
                if (l && l.nodeType == 1) {
                    l.setAttribute("data-pm-slice", f + " " + g + " " + JSON.stringify(c));
                }
                var p = a.someProp("clipboardTextSerializer", function(a) {
                    return a(b);
                }) || b.content.textBetween(0, b.content.size, "\n\n");
                return {
                    dom: k,
                    text: p
                };
            }
            function bi(a, b, c, d, f) {
                var h, i = f.parent.type.spec.code, j;
                if (!c && !b) {
                    return null;
                }
                var k = b && (d || i || !c);
                if (k) {
                    a.someProp("transformPastedText", function(a) {
                        b = a(b, i || d);
                    });
                    if (i) {
                        return b ? new e.Slice(e.Fragment.from(a.state.schema.text(b.replace(/\r\n?/g, "\n"))), 0, 0) : e.Slice.empty;
                    }
                    var l = a.someProp("clipboardTextParser", function(a) {
                        return a(b, f, d);
                    });
                    if (l) {
                        j = l;
                    } else {
                        var m = f.marks();
                        var n = a.state;
                        var o = n.schema;
                        var p = e.DOMSerializer.fromSchema(o);
                        h = document.createElement("div");
                        b.split(/(?:\r\n?|\n)+/).forEach(function(a) {
                            var b = h.appendChild(document.createElement("p"));
                            if (a) {
                                b.appendChild(p.serializeNode(o.text(a, m)));
                            }
                        });
                    }
                } else {
                    a.someProp("transformPastedHTML", function(a) {
                        c = a(c);
                    });
                    h = bs(c);
                    if (g.webkit) {
                        bt(h);
                    }
                }
                var q = h && h.querySelector("[data-pm-slice]");
                var r = q && /^(\d+) (\d+) (.*)/.exec(q.getAttribute("data-pm-slice"));
                if (!j) {
                    var s = a.someProp("clipboardParser") || a.someProp("domParser") || e.DOMParser.fromSchema(a.state.schema);
                    j = s.parseSlice(h, {
                        preserveWhitespace: !!(k || r),
                        context: f
                    });
                }
                if (r) {
                    j = bu(bo(j, +r[1], +r[2]), r[3]);
                } else {
                    j = e.Slice.maxOpen(bj(j.content, f), true);
                    if (j.openStart || j.openEnd) {
                        var t = 0, u = 0;
                        for(var v = j.content.firstChild; t < j.openStart && !v.type.spec.isolating; t++, v = v.firstChild){}
                        for(var w = j.content.lastChild; u < j.openEnd && !w.type.spec.isolating; u++, w = w.lastChild){}
                        j = bo(j, t, u);
                    }
                }
                a.someProp("transformPasted", function(a) {
                    j = a(j);
                });
                return j;
            }
            function bj(a, b) {
                if (a.childCount < 2) {
                    return a;
                }
                var c = function(c) {
                    var d = b.node(c);
                    var f = d.contentMatchAt(b.index(c));
                    var g = void 0, h = [];
                    a.forEach(function(a) {
                        if (!h) {
                            return;
                        }
                        var b = f.findWrapping(a.type), c;
                        if (!b) {
                            return (h = null);
                        }
                        if ((c = h.length && g.length && bl(b, g, a, h[h.length - 1], 0))) {
                            h[h.length - 1] = c;
                        } else {
                            if (h.length) {
                                h[h.length - 1] = bm(h[h.length - 1], g.length);
                            }
                            var d = bk(a, b);
                            h.push(d);
                            f = f.matchType(d.type, d.attrs);
                            g = b;
                        }
                    });
                    if (h) {
                        return {
                            v: e.Fragment.from(h)
                        };
                    }
                };
                for(var d = b.depth; d >= 0; d--){
                    var f = c(d);
                    if (f) return f.v;
                }
                return a;
            }
            function bk(a, b, c) {
                if (c === void 0) c = 0;
                for(var d = b.length - 1; d >= c; d--){
                    a = b[d].create(null, e.Fragment.from(a));
                }
                return a;
            }
            function bl(a, b, c, d, f) {
                if (f < a.length && f < b.length && a[f] == b[f]) {
                    var g = bl(a, b, c, d.lastChild, f + 1);
                    if (g) {
                        return d.copy(d.content.replaceChild(d.childCount - 1, g));
                    }
                    var h = d.contentMatchAt(d.childCount);
                    if (h.matchType(f == a.length - 1 ? c.type : a[f + 1])) {
                        return d.copy(d.content.append(e.Fragment.from(bk(c, a, f + 1))));
                    }
                }
            }
            function bm(a, b) {
                if (b == 0) {
                    return a;
                }
                var c = a.content.replaceChild(a.childCount - 1, bm(a.lastChild, b - 1));
                var d = a.contentMatchAt(a.childCount).fillBefore(e.Fragment.empty, true);
                return a.copy(c.append(d));
            }
            function bn(a, b, c, d, f, g) {
                var h = b < 0 ? a.firstChild : a.lastChild, i = h.content;
                if (f < d - 1) {
                    i = bn(i, b, c, d, f + 1, g);
                }
                if (f >= c) {
                    i = b < 0 ? h.contentMatchAt(0).fillBefore(i, a.childCount > 1 || g <= f).append(i) : i.append(h.contentMatchAt(h.childCount).fillBefore(e.Fragment.empty, true));
                }
                return a.replaceChild(b < 0 ? 0 : a.childCount - 1, h.copy(i));
            }
            function bo(a, b, c) {
                if (b < a.openStart) {
                    a = new e.Slice(bn(a.content, -1, b, a.openStart, 0, a.openEnd), b, a.openEnd);
                }
                if (c < a.openEnd) {
                    a = new e.Slice(bn(a.content, 1, c, a.openEnd, 0, 0), a.openStart, c);
                }
                return a;
            }
            var bp = {
                thead: [
                    "table"
                ],
                tbody: [
                    "table"
                ],
                tfoot: [
                    "table"
                ],
                caption: [
                    "table"
                ],
                colgroup: [
                    "table"
                ],
                col: [
                    "table",
                    "colgroup"
                ],
                tr: [
                    "table",
                    "tbody"
                ],
                td: [
                    "table",
                    "tbody",
                    "tr"
                ],
                th: [
                    "table",
                    "tbody",
                    "tr"
                ]
            };
            var bq = null;
            function br() {
                return (bq || (bq = document.implementation.createHTMLDocument("title")));
            }
            function bs(a) {
                var b = /^(\s*<meta [^>]*>)*/.exec(a);
                if (b) {
                    a = a.slice(b[0].length);
                }
                var c = br().createElement("div");
                var d = /<([a-z][^>\s]+)/i.exec(a), e;
                if ((e = d && bp[d[1].toLowerCase()])) {
                    a = e.map(function(a) {
                        return "<" + a + ">";
                    }).join("") + a + e.map(function(a) {
                        return "</" + a + ">";
                    }).reverse().join("");
                }
                c.innerHTML = a;
                if (e) {
                    for(var f = 0; f < e.length; f++){
                        c = c.querySelector(e[f]) || c;
                    }
                }
                return c;
            }
            function bt(a) {
                var b = a.querySelectorAll(g.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
                for(var c = 0; c < b.length; c++){
                    var d = b[c];
                    if (d.childNodes.length == 1 && d.textContent == "\u00a0" && d.parentNode) {
                        d.parentNode.replaceChild(a.ownerDocument.createTextNode(" "), d);
                    }
                }
            }
            function bu(a, b) {
                if (!a.size) {
                    return a;
                }
                var c = a.content.firstChild.type.schema, d;
                try {
                    d = JSON.parse(b);
                } catch (f) {
                    return a;
                }
                var g = a.content;
                var h = a.openStart;
                var i = a.openEnd;
                for(var j = d.length - 2; j >= 0; j -= 2){
                    var k = c.nodes[d[j]];
                    if (!k || k.hasRequiredAttrs()) {
                        break;
                    }
                    g = e.Fragment.from(k.create(d[j + 1], g));
                    h++;
                    i++;
                }
                return new e.Slice(g, h, i);
            }
            var bv = {
                childList: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: true,
                attributeOldValue: true,
                subtree: true
            };
            var bw = g.ie && g.ie_version <= 11;
            var bx = function a() {
                this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
            };
            bx.prototype.set = function a(b) {
                this.anchorNode = b.anchorNode;
                this.anchorOffset = b.anchorOffset;
                this.focusNode = b.focusNode;
                this.focusOffset = b.focusOffset;
            };
            bx.prototype.eq = function a(b) {
                return (b.anchorNode == this.anchorNode && b.anchorOffset == this.anchorOffset && b.focusNode == this.focusNode && b.focusOffset == this.focusOffset);
            };
            var by = function a(b, c) {
                var d = this;
                this.view = b;
                this.handleDOMChange = c;
                this.queue = [];
                this.flushingSoon = -1;
                this.observer = window.MutationObserver && new window.MutationObserver(function(a) {
                    for(var b = 0; b < a.length; b++){
                        d.queue.push(a[b]);
                    }
                    if (g.ie && g.ie_version <= 11 && a.some(function(a) {
                        return ((a.type == "childList" && a.removedNodes.length) || (a.type == "characterData" && a.oldValue.length > a.target.nodeValue.length));
                    })) {
                        d.flushSoon();
                    } else {
                        d.flush();
                    }
                });
                this.currentSelection = new bx();
                if (bw) {
                    this.onCharData = function(a) {
                        d.queue.push({
                            target: a.target,
                            type: "characterData",
                            oldValue: a.prevValue
                        });
                        d.flushSoon();
                    };
                }
                this.onSelectionChange = this.onSelectionChange.bind(this);
                this.suppressingSelectionUpdates = false;
            };
            by.prototype.flushSoon = function a() {
                var b = this;
                if (this.flushingSoon < 0) {
                    this.flushingSoon = window.setTimeout(function() {
                        b.flushingSoon = -1;
                        b.flush();
                    }, 20);
                }
            };
            by.prototype.forceFlush = function a() {
                if (this.flushingSoon > -1) {
                    window.clearTimeout(this.flushingSoon);
                    this.flushingSoon = -1;
                    this.flush();
                }
            };
            by.prototype.start = function a() {
                if (this.observer) {
                    this.observer.observe(this.view.dom, bv);
                }
                if (bw) {
                    this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.connectSelection();
            };
            by.prototype.stop = function a() {
                var b = this;
                if (this.observer) {
                    var c = this.observer.takeRecords();
                    if (c.length) {
                        for(var d = 0; d < c.length; d++){
                            this.queue.push(c[d]);
                        }
                        window.setTimeout(function() {
                            return b.flush();
                        }, 20);
                    }
                    this.observer.disconnect();
                }
                if (bw) {
                    this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.disconnectSelection();
            };
            by.prototype.connectSelection = function a() {
                this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
            };
            by.prototype.disconnectSelection = function a() {
                this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
            };
            by.prototype.suppressSelectionUpdates = function a() {
                var b = this;
                this.suppressingSelectionUpdates = true;
                setTimeout(function() {
                    return (b.suppressingSelectionUpdates = false);
                }, 50);
            };
            by.prototype.onSelectionChange = function a() {
                if (!aT(this.view)) {
                    return;
                }
                if (this.suppressingSelectionUpdates) {
                    return aJ(this.view);
                }
                if (g.ie && g.ie_version <= 11 && !this.view.state.selection.empty) {
                    var b = this.view.root.getSelection();
                    if (b.focusNode && q(b.focusNode, b.focusOffset, b.anchorNode, b.anchorOffset)) {
                        return this.flushSoon();
                    }
                }
                this.flush();
            };
            by.prototype.setCurSelection = function a() {
                this.currentSelection.set(this.view.root.getSelection());
            };
            by.prototype.ignoreSelectionChange = function a(b) {
                if (b.rangeCount == 0) {
                    return true;
                }
                var c = b.getRangeAt(0).commonAncestorContainer;
                var d = this.view.docView.nearestDesc(c);
                if (d && d.ignoreMutation({
                    type: "selection",
                    target: c.nodeType == 3 ? c.parentNode : c
                })) {
                    this.setCurSelection();
                    return true;
                }
            };
            by.prototype.flush = function a() {
                if (!this.view.docView || this.flushingSoon > -1) {
                    return;
                }
                var b = this.observer ? this.observer.takeRecords() : [];
                if (this.queue.length) {
                    b = this.queue.concat(b);
                    this.queue.length = 0;
                }
                var c = this.view.root.getSelection();
                var d = !this.suppressingSelectionUpdates && !this.currentSelection.eq(c) && aU(this.view) && !this.ignoreSelectionChange(c);
                var e = -1, f = -1, h = false, i = [];
                if (this.view.editable) {
                    for(var j = 0; j < b.length; j++){
                        var k = this.registerMutation(b[j], i);
                        if (k) {
                            e = e < 0 ? k.from : Math.min(k.from, e);
                            f = f < 0 ? k.to : Math.max(k.to, f);
                            if (k.typeOver) {
                                h = true;
                            }
                        }
                    }
                }
                if (g.gecko && i.length > 1) {
                    var l = i.filter(function(a) {
                        return a.nodeName == "BR";
                    });
                    if (l.length == 2) {
                        var m = l[0];
                        var n = l[1];
                        if (m.parentNode && m.parentNode.parentNode == n.parentNode) {
                            n.remove();
                        } else {
                            m.remove();
                        }
                    }
                }
                if (e > -1 || d) {
                    if (e > -1) {
                        this.view.docView.markDirty(e, f);
                        bA(this.view);
                    }
                    this.handleDOMChange(e, f, h, i);
                    if (this.view.docView.dirty) {
                        this.view.updateState(this.view.state);
                    } else if (!this.currentSelection.eq(c)) {
                        aJ(this.view);
                    }
                    this.currentSelection.set(c);
                }
            };
            by.prototype.registerMutation = function a(b, c) {
                if (c.indexOf(b.target) > -1) {
                    return null;
                }
                var d = this.view.docView.nearestDesc(b.target);
                if (b.type == "attributes" && (d == this.view.docView || b.attributeName == "contenteditable" || (b.attributeName == "style" && !b.oldValue && !b.target.getAttribute("style")))) {
                    return null;
                }
                if (!d || d.ignoreMutation(b)) {
                    return null;
                }
                if (b.type == "childList") {
                    for(var e = 0; e < b.addedNodes.length; e++){
                        c.push(b.addedNodes[e]);
                    }
                    if (d.contentDOM && d.contentDOM != d.dom && !d.contentDOM.contains(b.target)) {
                        return {
                            from: d.posBefore,
                            to: d.posAfter
                        };
                    }
                    var f = b.previousSibling, h = b.nextSibling;
                    if (g.ie && g.ie_version <= 11 && b.addedNodes.length) {
                        for(var i = 0; i < b.addedNodes.length; i++){
                            var j = b.addedNodes[i];
                            var k = j.previousSibling;
                            var l = j.nextSibling;
                            if (!k || Array.prototype.indexOf.call(b.addedNodes, k) < 0) {
                                f = k;
                            }
                            if (!l || Array.prototype.indexOf.call(b.addedNodes, l) < 0) {
                                h = l;
                            }
                        }
                    }
                    var n = f && f.parentNode == b.target ? m(f) + 1 : 0;
                    var o = d.localPosFromDOM(b.target, n, -1);
                    var p = h && h.parentNode == b.target ? m(h) : b.target.childNodes.length;
                    var q = d.localPosFromDOM(b.target, p, 1);
                    return {
                        from: o,
                        to: q
                    };
                } else if (b.type == "attributes") {
                    return {
                        from: d.posAtStart - d.border,
                        to: d.posAtEnd + d.border
                    };
                } else {
                    return {
                        from: d.posAtStart,
                        to: d.posAtEnd,
                        typeOver: b.target.nodeValue == b.oldValue
                    };
                }
            };
            var bz = false;
            function bA(a) {
                if (bz) {
                    return;
                }
                bz = true;
                if (getComputedStyle(a.dom).whiteSpace == "normal") {
                    console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
                }
            }
            var bB = {}, bC = {};
            function bD(a) {
                a.shiftKey = false;
                a.mouseDown = null;
                a.lastKeyCode = null;
                a.lastKeyCodeTime = 0;
                a.lastClick = {
                    time: 0,
                    x: 0,
                    y: 0,
                    type: ""
                };
                a.lastSelectionOrigin = null;
                a.lastSelectionTime = 0;
                a.lastIOSEnter = 0;
                a.lastIOSEnterFallbackTimeout = null;
                a.lastAndroidDelete = 0;
                a.composing = false;
                a.composingTimeout = null;
                a.compositionNodes = [];
                a.compositionEndedAt = -2e8;
                a.domObserver = new by(a, function(b, c, d, e) {
                    return bb(a, b, c, d, e);
                });
                a.domObserver.start();
                a.domChangeCount = 0;
                a.eventHandlers = Object.create(null);
                var b = function(b) {
                    var c = bB[b];
                    a.dom.addEventListener(b, (a.eventHandlers[b] = function(b) {
                        if (bI(a, b) && !bH(a, b) && (a.editable || !(b.type in bC))) {
                            c(a, b);
                        }
                    }));
                };
                for(var c in bB)b(c);
                if (g.safari) {
                    a.dom.addEventListener("input", function() {
                        return null;
                    });
                }
                bG(a);
            }
            function bE(a, b) {
                a.lastSelectionOrigin = b;
                a.lastSelectionTime = Date.now();
            }
            function bF(a) {
                a.domObserver.stop();
                for(var b in a.eventHandlers){
                    a.dom.removeEventListener(b, a.eventHandlers[b]);
                }
                clearTimeout(a.composingTimeout);
                clearTimeout(a.lastIOSEnterFallbackTimeout);
            }
            function bG(a) {
                a.someProp("handleDOMEvents", function(b) {
                    for(var c in b){
                        if (!a.eventHandlers[c]) {
                            a.dom.addEventListener(c, (a.eventHandlers[c] = function(b) {
                                return bH(a, b);
                            }));
                        }
                    }
                });
            }
            function bH(a, b) {
                return a.someProp("handleDOMEvents", function(c) {
                    var d = c[b.type];
                    return d ? d(a, b) || b.defaultPrevented : false;
                });
            }
            function bI(a, b) {
                if (!b.bubbles) {
                    return true;
                }
                if (b.defaultPrevented) {
                    return false;
                }
                for(var c = b.target; c != a.dom; c = c.parentNode){
                    if (!c || c.nodeType == 11 || (c.pmViewDesc && c.pmViewDesc.stopEvent(b))) {
                        return false;
                    }
                }
                return true;
            }
            function bJ(a, b) {
                if (!bH(a, b) && bB[b.type] && (a.editable || !(b.type in bC))) {
                    bB[b.type](a, b);
                }
            }
            bC.keydown = function(a, b) {
                a.shiftKey = b.keyCode == 16 || b.shiftKey;
                if (bX(a, b)) {
                    return;
                }
                if (b.keyCode != 229) {
                    a.domObserver.forceFlush();
                }
                a.lastKeyCode = b.keyCode;
                a.lastKeyCodeTime = Date.now();
                if (g.ios && b.keyCode == 13 && !b.ctrlKey && !b.altKey && !b.metaKey) {
                    var c = Date.now();
                    a.lastIOSEnter = c;
                    a.lastIOSEnterFallbackTimeout = setTimeout(function() {
                        if (a.lastIOSEnter == c) {
                            a.someProp("handleKeyDown", function(b) {
                                return b(a, x(13, "Enter"));
                            });
                            a.lastIOSEnter = 0;
                        }
                    }, 200);
                } else if (a.someProp("handleKeyDown", function(c) {
                    return c(a, b);
                }) || a8(a, b)) {
                    b.preventDefault();
                } else {
                    bE(a, "key");
                }
            };
            bC.keyup = function(a, b) {
                if (b.keyCode == 16) {
                    a.shiftKey = false;
                }
            };
            bC.keypress = function(a, b) {
                if (bX(a, b) || !b.charCode || (b.ctrlKey && !b.altKey) || (g.mac && b.metaKey)) {
                    return;
                }
                if (a.someProp("handleKeyPress", function(c) {
                    return c(a, b);
                })) {
                    b.preventDefault();
                    return;
                }
                var c = a.state.selection;
                if (!(c instanceof d.TextSelection) || !c.$from.sameParent(c.$to)) {
                    var e = String.fromCharCode(b.charCode);
                    if (!a.someProp("handleTextInput", function(b) {
                        return b(a, c.$from.pos, c.$to.pos, e);
                    })) {
                        a.dispatch(a.state.tr.insertText(e).scrollIntoView());
                    }
                    b.preventDefault();
                }
            };
            function bK(a) {
                return {
                    left: a.clientX,
                    top: a.clientY
                };
            }
            function bL(a, b) {
                var c = b.x - a.clientX, d = b.y - a.clientY;
                return c * c + d * d < 100;
            }
            function bM(a, b, c, d, e) {
                if (d == -1) {
                    return false;
                }
                var f = a.state.doc.resolve(d);
                var g = function(d) {
                    if (a.someProp(b, function(b) {
                        return d > f.depth ? b(a, c, f.nodeAfter, f.before(d), e, true) : b(a, c, f.node(d), f.before(d), e, false);
                    })) {
                        return {
                            v: true
                        };
                    }
                };
                for(var h = f.depth + 1; h > 0; h--){
                    var i = g(h);
                    if (i) return i.v;
                }
                return false;
            }
            function bN(a, b, c) {
                if (!a.focused) {
                    a.focus();
                }
                var d = a.state.tr.setSelection(b);
                if (c == "pointer") {
                    d.setMeta("pointer", true);
                }
                a.dispatch(d);
            }
            function bO(a, b) {
                if (b == -1) {
                    return false;
                }
                var c = a.state.doc.resolve(b), e = c.nodeAfter;
                if (e && e.isAtom && d.NodeSelection.isSelectable(e)) {
                    bN(a, new d.NodeSelection(c), "pointer");
                    return true;
                }
                return false;
            }
            function bP(a, b) {
                if (b == -1) {
                    return false;
                }
                var c = a.state.selection, e, f;
                if (c instanceof d.NodeSelection) {
                    e = c.node;
                }
                var g = a.state.doc.resolve(b);
                for(var h = g.depth + 1; h > 0; h--){
                    var i = h > g.depth ? g.nodeAfter : g.node(h);
                    if (d.NodeSelection.isSelectable(i)) {
                        if (e && c.$from.depth > 0 && h >= c.$from.depth && g.before(c.$from.depth + 1) == c.$from.pos) {
                            f = g.before(c.$from.depth);
                        } else {
                            f = g.before(h);
                        }
                        break;
                    }
                }
                if (f != null) {
                    bN(a, d.NodeSelection.create(a.state.doc, f), "pointer");
                    return true;
                } else {
                    return false;
                }
            }
            function bQ(a, b, c, d, e) {
                return (bM(a, "handleClickOn", b, c, d) || a.someProp("handleClick", function(c) {
                    return c(a, b, d);
                }) || (e ? bP(a, c) : bO(a, c)));
            }
            function bR(a, b, c, d) {
                return (bM(a, "handleDoubleClickOn", b, c, d) || a.someProp("handleDoubleClick", function(c) {
                    return c(a, b, d);
                }));
            }
            function bS(a, b, c, d) {
                return (bM(a, "handleTripleClickOn", b, c, d) || a.someProp("handleTripleClick", function(c) {
                    return c(a, b, d);
                }) || bT(a, c, d));
            }
            function bT(a, b, c) {
                if (c.button != 0) {
                    return false;
                }
                var e = a.state.doc;
                if (b == -1) {
                    if (e.inlineContent) {
                        bN(a, d.TextSelection.create(e, 0, e.content.size), "pointer");
                        return true;
                    }
                    return false;
                }
                var f = e.resolve(b);
                for(var g = f.depth + 1; g > 0; g--){
                    var h = g > f.depth ? f.nodeAfter : f.node(g);
                    var i = f.before(g);
                    if (h.inlineContent) {
                        bN(a, d.TextSelection.create(e, i + 1, i + 1 + h.content.size), "pointer");
                    } else if (d.NodeSelection.isSelectable(h)) {
                        bN(a, d.NodeSelection.create(e, i), "pointer");
                    } else {
                        continue;
                    }
                    return true;
                }
            }
            function bU(a) {
                return b0(a);
            }
            var bV = g.mac ? "metaKey" : "ctrlKey";
            bB.mousedown = function(a, b) {
                a.shiftKey = b.shiftKey;
                var c = bU(a);
                var d = Date.now(), e = "singleClick";
                if (d - a.lastClick.time < 500 && bL(b, a.lastClick) && !b[bV]) {
                    if (a.lastClick.type == "singleClick") {
                        e = "doubleClick";
                    } else if (a.lastClick.type == "doubleClick") {
                        e = "tripleClick";
                    }
                }
                a.lastClick = {
                    time: d,
                    x: b.clientX,
                    y: b.clientY,
                    type: e
                };
                var f = a.posAtCoords(bK(b));
                if (!f) {
                    return;
                }
                if (e == "singleClick") {
                    if (a.mouseDown) {
                        a.mouseDown.done();
                    }
                    a.mouseDown = new bW(a, f, b, c);
                } else if ((e == "doubleClick" ? bR : bS)(a, f.pos, f.inside, b)) {
                    b.preventDefault();
                } else {
                    bE(a, "pointer");
                }
            };
            var bW = function a(b, c, e, f) {
                var h = this;
                this.view = b;
                this.startDoc = b.state.doc;
                this.pos = c;
                this.event = e;
                this.flushed = f;
                this.selectNode = e[bV];
                this.allowDefault = e.shiftKey;
                this.delayedSelectionSync = false;
                var i, j;
                if (c.inside > -1) {
                    i = b.state.doc.nodeAt(c.inside);
                    j = c.inside;
                } else {
                    var k = b.state.doc.resolve(c.pos);
                    i = k.parent;
                    j = k.depth ? k.before() : 0;
                }
                this.mightDrag = null;
                var l = f ? null : e.target;
                var m = l ? b.docView.nearestDesc(l, true) : null;
                this.target = m ? m.dom : null;
                var n = b.state;
                var o = n.selection;
                if ((e.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== false) || (o instanceof d.NodeSelection && o.from <= j && o.to > j)) {
                    this.mightDrag = {
                        node: i,
                        pos: j,
                        addAttr: this.target && !this.target.draggable,
                        setUneditable: this.target && g.gecko && !this.target.hasAttribute("contentEditable")
                    };
                }
                if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.draggable = true;
                    }
                    if (this.mightDrag.setUneditable) {
                        setTimeout(function() {
                            if (h.view.mouseDown == h) {
                                h.target.setAttribute("contentEditable", "false");
                            }
                        }, 20);
                    }
                    this.view.domObserver.start();
                }
                b.root.addEventListener("mouseup", (this.up = this.up.bind(this)));
                b.root.addEventListener("mousemove", (this.move = this.move.bind(this)));
                bE(b, "pointer");
            };
            bW.prototype.done = function a() {
                var b = this;
                this.view.root.removeEventListener("mouseup", this.up);
                this.view.root.removeEventListener("mousemove", this.move);
                if (this.mightDrag && this.target) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.removeAttribute("draggable");
                    }
                    if (this.mightDrag.setUneditable) {
                        this.target.removeAttribute("contentEditable");
                    }
                    this.view.domObserver.start();
                }
                if (this.delayedSelectionSync) {
                    setTimeout(function() {
                        return aJ(b.view);
                    });
                }
                this.view.mouseDown = null;
            };
            bW.prototype.up = function a(b) {
                this.done();
                if (!this.view.dom.contains(b.target.nodeType == 3 ? b.target.parentNode : b.target)) {
                    return;
                }
                var c = this.pos;
                if (this.view.state.doc != this.startDoc) {
                    c = this.view.posAtCoords(bK(b));
                }
                if (this.allowDefault || !c) {
                    bE(this.view, "pointer");
                } else if (bQ(this.view, c.pos, c.inside, b, this.selectNode)) {
                    b.preventDefault();
                } else if (b.button == 0 && (this.flushed || (g.safari && this.mightDrag && !this.mightDrag.node.isAtom) || (g.chrome && !(this.view.state.selection instanceof d.TextSelection) && Math.min(Math.abs(c.pos - this.view.state.selection.from), Math.abs(c.pos - this.view.state.selection.to)) <= 2))) {
                    bN(this.view, d.Selection.near(this.view.state.doc.resolve(c.pos)), "pointer");
                    b.preventDefault();
                } else {
                    bE(this.view, "pointer");
                }
            };
            bW.prototype.move = function a(b) {
                if (!this.allowDefault && (Math.abs(this.event.x - b.clientX) > 4 || Math.abs(this.event.y - b.clientY) > 4)) {
                    this.allowDefault = true;
                }
                bE(this.view, "pointer");
                if (b.buttons == 0) {
                    this.done();
                }
            };
            bB.touchdown = function(a) {
                bU(a);
                bE(a, "pointer");
            };
            bB.contextmenu = function(a) {
                return bU(a);
            };
            function bX(a, b) {
                if (a.composing) {
                    return true;
                }
                if (g.safari && Math.abs(b.timeStamp - a.compositionEndedAt) < 500) {
                    a.compositionEndedAt = -2e8;
                    return true;
                }
                return false;
            }
            var bY = g.android ? 5000 : -1;
            bC.compositionstart = bC.compositionupdate = function(a) {
                if (!a.composing) {
                    a.domObserver.flush();
                    var b = a.state;
                    var c = b.selection.$from;
                    if (b.selection.empty && (b.storedMarks || (!c.textOffset && c.parentOffset && c.nodeBefore.marks.some(function(a) {
                        return a.type.spec.inclusive === false;
                    })))) {
                        a.markCursor = a.state.storedMarks || c.marks();
                        b0(a, true);
                        a.markCursor = null;
                    } else {
                        b0(a);
                        if (g.gecko && b.selection.empty && c.parentOffset && !c.textOffset && c.nodeBefore.marks.length) {
                            var d = a.root.getSelection();
                            for(var e = d.focusNode, f = d.focusOffset; e && e.nodeType == 1 && f != 0;){
                                var h = f < 0 ? e.lastChild : e.childNodes[f - 1];
                                if (!h) {
                                    break;
                                }
                                if (h.nodeType == 3) {
                                    d.collapse(h, h.nodeValue.length);
                                    break;
                                } else {
                                    e = h;
                                    f = -1;
                                }
                            }
                        }
                    }
                    a.composing = true;
                }
                bZ(a, bY);
            };
            bC.compositionend = function(a, b) {
                if (a.composing) {
                    a.composing = false;
                    a.compositionEndedAt = b.timeStamp;
                    bZ(a, 20);
                }
            };
            function bZ(a, b) {
                clearTimeout(a.composingTimeout);
                if (b > -1) {
                    a.composingTimeout = setTimeout(function() {
                        return b0(a);
                    }, b);
                }
            }
            function b$(a) {
                if (a.composing) {
                    a.composing = false;
                    a.compositionEndedAt = b_();
                }
                while(a.compositionNodes.length > 0){
                    a.compositionNodes.pop().markParentsDirty();
                }
            }
            function b_() {
                var a = document.createEvent("Event");
                a.initEvent("event", true, true);
                return a.timeStamp;
            }
            function b0(a, b) {
                a.domObserver.forceFlush();
                b$(a);
                if (b || a.docView.dirty) {
                    var c = aH(a);
                    if (c && !c.eq(a.state.selection)) {
                        a.dispatch(a.state.tr.setSelection(c));
                    } else {
                        a.updateState(a.state);
                    }
                    return true;
                }
                return false;
            }
            function b1(a, b) {
                if (!a.dom.parentNode) {
                    return;
                }
                var c = a.dom.parentNode.appendChild(document.createElement("div"));
                c.appendChild(b);
                c.style.cssText = "position: fixed; left: -10000px; top: 10px";
                var d = getSelection(), e = document.createRange();
                e.selectNodeContents(b);
                a.dom.blur();
                d.removeAllRanges();
                d.addRange(e);
                setTimeout(function() {
                    if (c.parentNode) {
                        c.parentNode.removeChild(c);
                    }
                    a.focus();
                }, 50);
            }
            var b2 = (g.ie && g.ie_version < 15) || (g.ios && g.webkit_version < 604);
            bB.copy = bC.cut = function(a, b) {
                var c = a.state.selection, d = b.type == "cut";
                if (c.empty) {
                    return;
                }
                var e = b2 ? null : b.clipboardData;
                var f = c.content();
                var g = bh(a, f);
                var h = g.dom;
                var i = g.text;
                if (e) {
                    b.preventDefault();
                    e.clearData();
                    e.setData("text/html", h.innerHTML);
                    e.setData("text/plain", i);
                } else {
                    b1(a, h);
                }
                if (d) {
                    a.dispatch(a.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
                }
            };
            function b3(a) {
                return a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1 ? a.content.firstChild : null;
            }
            function b4(a, b) {
                if (!a.dom.parentNode) {
                    return;
                }
                var c = a.shiftKey || a.state.selection.$from.parent.type.spec.code;
                var d = a.dom.parentNode.appendChild(document.createElement(c ? "textarea" : "div"));
                if (!c) {
                    d.contentEditable = "true";
                }
                d.style.cssText = "position: fixed; left: -10000px; top: 10px";
                d.focus();
                setTimeout(function() {
                    a.focus();
                    if (d.parentNode) {
                        d.parentNode.removeChild(d);
                    }
                    if (c) {
                        b5(a, d.value, null, b);
                    } else {
                        b5(a, d.textContent, d.innerHTML, b);
                    }
                }, 50);
            }
            function b5(a, b, c, d) {
                var f = bi(a, b, c, a.shiftKey, a.state.selection.$from);
                if (a.someProp("handlePaste", function(b) {
                    return b(a, d, f || e.Slice.empty);
                })) {
                    return true;
                }
                if (!f) {
                    return false;
                }
                var g = b3(f);
                var h = g ? a.state.tr.replaceSelectionWith(g, a.shiftKey) : a.state.tr.replaceSelection(f);
                a.dispatch(h.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
                return true;
            }
            bC.paste = function(a, b) {
                var c = b2 ? null : b.clipboardData;
                if (c && b5(a, c.getData("text/plain"), c.getData("text/html"), b)) {
                    b.preventDefault();
                } else {
                    b4(a, b);
                }
            };
            var b6 = function a(b, c) {
                this.slice = b;
                this.move = c;
            };
            var b7 = g.mac ? "altKey" : "ctrlKey";
            bB.dragstart = function(a, b) {
                var c = a.mouseDown;
                if (c) {
                    c.done();
                }
                if (!b.dataTransfer) {
                    return;
                }
                var e = a.state.selection;
                var f = e.empty ? null : a.posAtCoords(bK(b));
                if (f && f.pos >= e.from && f.pos <= (e instanceof d.NodeSelection ? e.to - 1 : e.to)) ;
                else if (c && c.mightDrag) {
                    a.dispatch(a.state.tr.setSelection(d.NodeSelection.create(a.state.doc, c.mightDrag.pos)));
                } else if (b.target && b.target.nodeType == 1) {
                    var g = a.docView.nearestDesc(b.target, true);
                    if (g && g.node.type.spec.draggable && g != a.docView) {
                        a.dispatch(a.state.tr.setSelection(d.NodeSelection.create(a.state.doc, g.posBefore)));
                    }
                }
                var h = a.state.selection.content();
                var i = bh(a, h);
                var j = i.dom;
                var k = i.text;
                b.dataTransfer.clearData();
                b.dataTransfer.setData(b2 ? "Text" : "text/html", j.innerHTML);
                b.dataTransfer.effectAllowed = "copyMove";
                if (!b2) {
                    b.dataTransfer.setData("text/plain", k);
                }
                a.dragging = new b6(h, !b[b7]);
            };
            bB.dragend = function(a) {
                var b = a.dragging;
                window.setTimeout(function() {
                    if (a.dragging == b) {
                        a.dragging = null;
                    }
                }, 50);
            };
            bC.dragover = bC.dragenter = function(a, b) {
                return b.preventDefault();
            };
            bC.drop = function(a, b) {
                var c = a.dragging;
                a.dragging = null;
                if (!b.dataTransfer) {
                    return;
                }
                var g = a.posAtCoords(bK(b));
                if (!g) {
                    return;
                }
                var h = a.state.doc.resolve(g.pos);
                if (!h) {
                    return;
                }
                var i = c && c.slice;
                if (i) {
                    a.someProp("transformPasted", function(a) {
                        i = a(i);
                    });
                } else {
                    i = bi(a, b.dataTransfer.getData(b2 ? "Text" : "text/plain"), b2 ? null : b.dataTransfer.getData("text/html"), false, h);
                }
                var j = c && !b[b7];
                if (a.someProp("handleDrop", function(c) {
                    return c(a, b, i || e.Slice.empty, j);
                })) {
                    b.preventDefault();
                    return;
                }
                if (!i) {
                    return;
                }
                b.preventDefault();
                var k = i ? (0, f.nj)(a.state.doc, h.pos, i) : h.pos;
                if (k == null) {
                    k = h.pos;
                }
                var l = a.state.tr;
                if (j) {
                    l.deleteSelection();
                }
                var m = l.mapping.map(k);
                var n = i.openStart == 0 && i.openEnd == 0 && i.content.childCount == 1;
                var o = l.doc;
                if (n) {
                    l.replaceRangeWith(m, m, i.content.firstChild);
                } else {
                    l.replaceRange(m, m, i);
                }
                if (l.doc.eq(o)) {
                    return;
                }
                var p = l.doc.resolve(m);
                if (n && d.NodeSelection.isSelectable(i.content.firstChild) && p.nodeAfter && p.nodeAfter.sameMarkup(i.content.firstChild)) {
                    l.setSelection(new d.NodeSelection(p));
                } else {
                    var q = l.mapping.map(k);
                    l.mapping.maps[l.mapping.maps.length - 1].forEach(function(a, b, c, d) {
                        return (q = d);
                    });
                    l.setSelection(aS(a, p, l.doc.resolve(q)));
                }
                a.focus();
                a.dispatch(l.setMeta("uiEvent", "drop"));
            };
            bB.focus = function(a) {
                if (!a.focused) {
                    a.domObserver.stop();
                    a.dom.classList.add("ProseMirror-focused");
                    a.domObserver.start();
                    a.focused = true;
                    setTimeout(function() {
                        if (a.docView && a.hasFocus() && !a.domObserver.currentSelection.eq(a.root.getSelection())) {
                            aJ(a);
                        }
                    }, 20);
                }
            };
            bB.blur = function(a, b) {
                if (a.focused) {
                    a.domObserver.stop();
                    a.dom.classList.remove("ProseMirror-focused");
                    a.domObserver.start();
                    if (b.relatedTarget && a.dom.contains(b.relatedTarget)) {
                        a.domObserver.currentSelection.set({});
                    }
                    a.focused = false;
                }
            };
            bB.beforeinput = function(a, b) {
                if (g.chrome && g.android && b.inputType == "deleteContentBackward") {
                    var c = a.domChangeCount;
                    setTimeout(function() {
                        if (a.domChangeCount != c) {
                            return;
                        }
                        a.dom.blur();
                        a.focus();
                        if (a.someProp("handleKeyDown", function(b) {
                            return b(a, x(8, "Backspace"));
                        })) {
                            return;
                        }
                        var b = a.state.selection;
                        var d = b.$cursor;
                        if (d && d.pos > 0) {
                            a.dispatch(a.state.tr.delete(d.pos - 1, d.pos).scrollIntoView());
                        }
                    }, 50);
                }
            };
            for(var b8 in bC){
                bB[b8] = bC[b8];
            }
            function b9(a, b) {
                if (a == b) {
                    return true;
                }
                for(var c in a){
                    if (a[c] !== b[c]) {
                        return false;
                    }
                }
                for(var d in b){
                    if (!(d in a)) {
                        return false;
                    }
                }
                return true;
            }
            var ca = function a(b, c) {
                this.spec = c || cg;
                this.side = this.spec.side || 0;
                this.toDOM = b;
            };
            ca.prototype.map = function a(b, c, d, e) {
                var f = b.mapResult(c.from + e, this.side < 0 ? -1 : 1);
                var g = f.pos;
                var h = f.deleted;
                return h ? null : new cd(g - d, g - d, this);
            };
            ca.prototype.valid = function a() {
                return true;
            };
            ca.prototype.eq = function a(b) {
                return (this == b || (b instanceof ca && ((this.spec.key && this.spec.key == b.spec.key) || (this.toDOM == b.toDOM && b9(this.spec, b.spec)))));
            };
            var cb = function a(b, c) {
                this.spec = c || cg;
                this.attrs = b;
            };
            cb.prototype.map = function a(b, c, d, e) {
                var f = b.map(c.from + e, this.spec.inclusiveStart ? -1 : 1) - d;
                var g = b.map(c.to + e, this.spec.inclusiveEnd ? 1 : -1) - d;
                return f >= g ? null : new cd(f, g, this);
            };
            cb.prototype.valid = function a(b, c) {
                return c.from < c.to;
            };
            cb.prototype.eq = function a(b) {
                return (this == b || (b instanceof cb && b9(this.attrs, b.attrs) && b9(this.spec, b.spec)));
            };
            cb.is = function a(b) {
                return b.type instanceof cb;
            };
            var cc = function a(b, c) {
                this.spec = c || cg;
                this.attrs = b;
            };
            cc.prototype.map = function a(b, c, d, e) {
                var f = b.mapResult(c.from + e, 1);
                if (f.deleted) {
                    return null;
                }
                var g = b.mapResult(c.to + e, -1);
                if (g.deleted || g.pos <= f.pos) {
                    return null;
                }
                return new cd(f.pos - d, g.pos - d, this);
            };
            cc.prototype.valid = function a(b, c) {
                var d = b.content.findIndex(c.from);
                var e = d.index;
                var f = d.offset;
                var g;
                return (f == c.from && !(g = b.child(e)).isText && f + g.nodeSize == c.to);
            };
            cc.prototype.eq = function a(b) {
                return (this == b || (b instanceof cc && b9(this.attrs, b.attrs) && b9(this.spec, b.spec)));
            };
            var cd = function a(b, c, d) {
                this.from = b;
                this.to = c;
                this.type = d;
            };
            var ce = {
                spec: {
                    configurable: true
                },
                inline: {
                    configurable: true
                }
            };
            cd.prototype.copy = function a(b, c) {
                return new cd(b, c, this.type);
            };
            cd.prototype.eq = function a(b, c) {
                if (c === void 0) c = 0;
                return (this.type.eq(b.type) && this.from + c == b.from && this.to + c == b.to);
            };
            cd.prototype.map = function a(b, c, d) {
                return this.type.map(b, this, c, d);
            };
            cd.widget = function a(b, c, d) {
                return new cd(b, b, new ca(c, d));
            };
            cd.inline = function a(b, c, d, e) {
                return new cd(b, c, new cb(d, e));
            };
            cd.node = function a(b, c, d, e) {
                return new cd(b, c, new cc(d, e));
            };
            ce.spec.get = function() {
                return this.type.spec;
            };
            ce.inline.get = function() {
                return this.type instanceof cb;
            };
            Object.defineProperties(cd.prototype, ce);
            var cf = [], cg = {};
            var ch = function a(b, c) {
                this.local = b && b.length ? b : cf;
                this.children = c && c.length ? c : cf;
            };
            ch.create = function a(b, c) {
                return c.length ? cp(c, b, 0, cg) : ci;
            };
            ch.prototype.find = function a(b, c, d) {
                var e = [];
                this.findInner(b == null ? 0 : b, c == null ? 1e9 : c, e, 0, d);
                return e;
            };
            ch.prototype.findInner = function a(b, c, d, e, f) {
                for(var g = 0; g < this.local.length; g++){
                    var h = this.local[g];
                    if (h.from <= c && h.to >= b && (!f || f(h.spec))) {
                        d.push(h.copy(h.from + e, h.to + e));
                    }
                }
                for(var i = 0; i < this.children.length; i += 3){
                    if (this.children[i] < c && this.children[i + 1] > b) {
                        var j = this.children[i] + 1;
                        this.children[i + 2].findInner(b - j, c - j, d, e + j, f);
                    }
                }
            };
            ch.prototype.map = function a(b, c, d) {
                if (this == ci || b.maps.length == 0) {
                    return this;
                }
                return this.mapInner(b, c, 0, 0, d || cg);
            };
            ch.prototype.mapInner = function a(b, c, d, e, f) {
                var g;
                for(var h = 0; h < this.local.length; h++){
                    var i = this.local[h].map(b, d, e);
                    if (i && i.type.valid(c, i)) {
                        (g || (g = [])).push(i);
                    } else if (f.onRemove) {
                        f.onRemove(this.local[h].spec);
                    }
                }
                if (this.children.length) {
                    return ck(this.children, g, b, c, d, e, f);
                } else {
                    return g ? new ch(g.sort(cq)) : ci;
                }
            };
            ch.prototype.add = function a(b, c) {
                if (!c.length) {
                    return this;
                }
                if (this == ci) {
                    return ch.create(b, c);
                }
                return this.addInner(b, c, 0);
            };
            ch.prototype.addInner = function a(b, c, d) {
                var e = this;
                var f, g = 0;
                b.forEach(function(a, b) {
                    var h = b + d, i;
                    if (!(i = cn(c, a, h))) {
                        return;
                    }
                    if (!f) {
                        f = e.children.slice();
                    }
                    while(g < f.length && f[g] < b){
                        g += 3;
                    }
                    if (f[g] == b) {
                        f[g + 2] = f[g + 2].addInner(a, i, h + 1);
                    } else {
                        f.splice(g, 0, b, b + a.nodeSize, cp(i, a, h + 1, cg));
                    }
                    g += 3;
                });
                var h = cl(g ? co(c) : c, -d);
                for(var i = 0; i < h.length; i++){
                    if (!h[i].type.valid(b, h[i])) {
                        h.splice(i--, 1);
                    }
                }
                return new ch(h.length ? this.local.concat(h).sort(cq) : this.local, f || this.children);
            };
            ch.prototype.remove = function a(b) {
                if (b.length == 0 || this == ci) {
                    return this;
                }
                return this.removeInner(b, 0);
            };
            ch.prototype.removeInner = function a(b, c) {
                var d = this.children, e = this.local;
                for(var f = 0; f < d.length; f += 3){
                    var g = void 0, h = d[f] + c, i = d[f + 1] + c;
                    for(var j = 0, k = void 0; j < b.length; j++){
                        if ((k = b[j])) {
                            if (k.from > h && k.to < i) {
                                b[j] = null;
                                (g || (g = [])).push(k);
                            }
                        }
                    }
                    if (!g) {
                        continue;
                    }
                    if (d == this.children) {
                        d = this.children.slice();
                    }
                    var l = d[f + 2].removeInner(g, h + 1);
                    if (l != ci) {
                        d[f + 2] = l;
                    } else {
                        d.splice(f, 3);
                        f -= 3;
                    }
                }
                if (e.length) {
                    for(var m = 0, n = void 0; m < b.length; m++){
                        if ((n = b[m])) {
                            for(var o = 0; o < e.length; o++){
                                if (e[o].eq(n, c)) {
                                    if (e == this.local) {
                                        e = this.local.slice();
                                    }
                                    e.splice(o--, 1);
                                }
                            }
                        }
                    }
                }
                if (d == this.children && e == this.local) {
                    return this;
                }
                return e.length || d.length ? new ch(e, d) : ci;
            };
            ch.prototype.forChild = function a(b, c) {
                if (this == ci) {
                    return this;
                }
                if (c.isLeaf) {
                    return ch.empty;
                }
                var d, e;
                for(var f = 0; f < this.children.length; f += 3){
                    if (this.children[f] >= b) {
                        if (this.children[f] == b) {
                            d = this.children[f + 2];
                        }
                        break;
                    }
                }
                var g = b + 1, h = g + c.content.size;
                for(var i = 0; i < this.local.length; i++){
                    var j = this.local[i];
                    if (j.from < h && j.to > g && j.type instanceof cb) {
                        var k = Math.max(g, j.from) - g, l = Math.min(h, j.to) - g;
                        if (k < l) {
                            (e || (e = [])).push(j.copy(k, l));
                        }
                    }
                }
                if (e) {
                    var m = new ch(e.sort(cq));
                    return d ? new cj([
                        m,
                        d
                    ]) : m;
                }
                return d || ci;
            };
            ch.prototype.eq = function a(b) {
                if (this == b) {
                    return true;
                }
                if (!(b instanceof ch) || this.local.length != b.local.length || this.children.length != b.children.length) {
                    return false;
                }
                for(var c = 0; c < this.local.length; c++){
                    if (!this.local[c].eq(b.local[c])) {
                        return false;
                    }
                }
                for(var d = 0; d < this.children.length; d += 3){
                    if (this.children[d] != b.children[d] || this.children[d + 1] != b.children[d + 1] || !this.children[d + 2].eq(b.children[d + 2])) {
                        return false;
                    }
                }
                return true;
            };
            ch.prototype.locals = function a(b) {
                return cr(this.localsInner(b));
            };
            ch.prototype.localsInner = function a(b) {
                if (this == ci) {
                    return cf;
                }
                if (b.inlineContent || !this.local.some(cb.is)) {
                    return this.local;
                }
                var c = [];
                for(var d = 0; d < this.local.length; d++){
                    if (!(this.local[d].type instanceof cb)) {
                        c.push(this.local[d]);
                    }
                }
                return c;
            };
            var ci = new ch();
            ch.empty = ci;
            ch.removeOverlap = cr;
            var cj = function a(b) {
                this.members = b;
            };
            cj.prototype.map = function a(b, c) {
                var d = this.members.map(function(a) {
                    return a.map(b, c, cg);
                });
                return cj.from(d);
            };
            cj.prototype.forChild = function a(b, c) {
                if (c.isLeaf) {
                    return ch.empty;
                }
                var d = [];
                for(var e = 0; e < this.members.length; e++){
                    var f = this.members[e].forChild(b, c);
                    if (f == ci) {
                        continue;
                    }
                    if (f instanceof cj) {
                        d = d.concat(f.members);
                    } else {
                        d.push(f);
                    }
                }
                return cj.from(d);
            };
            cj.prototype.eq = function a(b) {
                if (!(b instanceof cj) || b.members.length != this.members.length) {
                    return false;
                }
                for(var c = 0; c < this.members.length; c++){
                    if (!this.members[c].eq(b.members[c])) {
                        return false;
                    }
                }
                return true;
            };
            cj.prototype.locals = function a(b) {
                var c, d = true;
                for(var e = 0; e < this.members.length; e++){
                    var a = this.members[e].localsInner(b);
                    if (!a.length) {
                        continue;
                    }
                    if (!c) {
                        c = a;
                    } else {
                        if (d) {
                            c = c.slice();
                            d = false;
                        }
                        for(var f = 0; f < a.length; f++){
                            c.push(a[f]);
                        }
                    }
                }
                return c ? cr(d ? c : c.sort(cq)) : cf;
            };
            cj.from = function a(b) {
                switch(b.length){
                    case 0:
                        return ci;
                    case 1:
                        return b[0];
                    default:
                        return new cj(b);
                }
            };
            function ck(a, b, c, d, e, f, g) {
                var h = a.slice();
                var i = function(a, b, c, d) {
                    for(var g = 0; g < h.length; g += 3){
                        var i = h[g + 1], j = void 0;
                        if (i == -1 || a > i + f) {
                            continue;
                        }
                        if (b >= h[g] + f) {
                            h[g + 1] = -1;
                        } else if (c >= e && (j = d - c - (b - a))) {
                            h[g] += j;
                            h[g + 1] += j;
                        }
                    }
                };
                for(var j = 0; j < c.maps.length; j++){
                    c.maps[j].forEach(i);
                }
                var k = false;
                for(var l = 0; l < h.length; l += 3){
                    if (h[l + 1] == -1) {
                        var m = c.map(a[l] + f), n = m - e;
                        if (n < 0 || n >= d.content.size) {
                            k = true;
                            continue;
                        }
                        var o = c.map(a[l + 1] + f, -1), p = o - e;
                        var q = d.content.findIndex(n);
                        var r = q.index;
                        var s = q.offset;
                        var t = d.maybeChild(r);
                        if (t && s == n && s + t.nodeSize == p) {
                            var u = h[l + 2].mapInner(c, t, m + 1, a[l] + f + 1, g);
                            if (u != ci) {
                                h[l] = n;
                                h[l + 1] = p;
                                h[l + 2] = u;
                            } else {
                                h[l + 1] = -2;
                                k = true;
                            }
                        } else {
                            k = true;
                        }
                    }
                }
                if (k) {
                    var v = cm(h, a, b || [], c, e, f, g);
                    var w = cp(v, d, 0, g);
                    b = w.local;
                    for(var x = 0; x < h.length; x += 3){
                        if (h[x + 1] < 0) {
                            h.splice(x, 3);
                            x -= 3;
                        }
                    }
                    for(var y = 0, z = 0; y < w.children.length; y += 3){
                        var A = w.children[y];
                        while(z < h.length && h[z] < A){
                            z += 3;
                        }
                        h.splice(z, 0, w.children[y], w.children[y + 1], w.children[y + 2]);
                    }
                }
                return new ch(b && b.sort(cq), h);
            }
            function cl(a, b) {
                if (!b || !a.length) {
                    return a;
                }
                var c = [];
                for(var d = 0; d < a.length; d++){
                    var e = a[d];
                    c.push(new cd(e.from + b, e.to + b, e.type));
                }
                return c;
            }
            function cm(a, b, c, d, e, f, g) {
                function h(a, b) {
                    for(var f = 0; f < a.local.length; f++){
                        var i = a.local[f].map(d, e, b);
                        if (i) {
                            c.push(i);
                        } else if (g.onRemove) {
                            g.onRemove(a.local[f].spec);
                        }
                    }
                    for(var j = 0; j < a.children.length; j += 3){
                        h(a.children[j + 2], a.children[j] + b + 1);
                    }
                }
                for(var i = 0; i < a.length; i += 3){
                    if (a[i + 1] == -1) {
                        h(a[i + 2], b[i] + f + 1);
                    }
                }
                return c;
            }
            function cn(a, b, c) {
                if (b.isLeaf) {
                    return null;
                }
                var d = c + b.nodeSize, e = null;
                for(var f = 0, g = void 0; f < a.length; f++){
                    if ((g = a[f]) && g.from > c && g.to < d) {
                        (e || (e = [])).push(g);
                        a[f] = null;
                    }
                }
                return e;
            }
            function co(a) {
                var b = [];
                for(var c = 0; c < a.length; c++){
                    if (a[c] != null) {
                        b.push(a[c]);
                    }
                }
                return b;
            }
            function cp(a, b, c, d) {
                var e = [], f = false;
                b.forEach(function(b, g) {
                    var h = cn(a, b, g + c);
                    if (h) {
                        f = true;
                        var i = cp(h, b, c + g + 1, d);
                        if (i != ci) {
                            e.push(g, g + b.nodeSize, i);
                        }
                    }
                });
                var g = cl(f ? co(a) : a, -c).sort(cq);
                for(var h = 0; h < g.length; h++){
                    if (!g[h].type.valid(b, g[h])) {
                        if (d.onRemove) {
                            d.onRemove(g[h].spec);
                        }
                        g.splice(h--, 1);
                    }
                }
                return g.length || e.length ? new ch(g, e) : ci;
            }
            function cq(a, b) {
                return a.from - b.from || a.to - b.to;
            }
            function cr(a) {
                var b = a;
                for(var c = 0; c < b.length - 1; c++){
                    var d = b[c];
                    if (d.from != d.to) {
                        for(var e = c + 1; e < b.length; e++){
                            var f = b[e];
                            if (f.from == d.from) {
                                if (f.to != d.to) {
                                    if (b == a) {
                                        b = a.slice();
                                    }
                                    b[e] = f.copy(f.from, d.to);
                                    cs(b, e + 1, f.copy(d.to, f.to));
                                }
                                continue;
                            } else {
                                if (f.from < d.to) {
                                    if (b == a) {
                                        b = a.slice();
                                    }
                                    b[c] = d.copy(d.from, f.from);
                                    cs(b, e, d.copy(f.from, d.to));
                                }
                                break;
                            }
                        }
                    }
                }
                return b;
            }
            function cs(a, b, c) {
                while(b < a.length && cq(c, a[b]) > 0){
                    b++;
                }
                a.splice(b, 0, c);
            }
            function ct(a) {
                var b = [];
                a.someProp("decorations", function(c) {
                    var d = c(a.state);
                    if (d && d != ci) {
                        b.push(d);
                    }
                });
                if (a.cursorWrapper) {
                    b.push(ch.create(a.state.doc, [
                        a.cursorWrapper.deco, 
                    ]));
                }
                return cj.from(b);
            }
            var cu = function a(b, c) {
                this._props = c;
                this.state = c.state;
                this.directPlugins = c.plugins || [];
                this.directPlugins.forEach(cC);
                this.dispatch = this.dispatch.bind(this);
                this._root = null;
                this.focused = false;
                this.trackWrites = null;
                this.dom = (b && b.mount) || document.createElement("div");
                if (b) {
                    if (b.appendChild) {
                        b.appendChild(this.dom);
                    } else if (b.apply) {
                        b(this.dom);
                    } else if (b.mount) {
                        this.mounted = true;
                    }
                }
                this.editable = cy(this);
                this.markCursor = null;
                this.cursorWrapper = null;
                cx(this);
                this.nodeViews = cA(this);
                this.docView = am(this.state.doc, cw(this), ct(this), this.dom, this);
                this.lastSelectedViewDesc = null;
                this.dragging = null;
                bD(this);
                this.prevDirectPlugins = [];
                this.pluginViews = [];
                this.updatePluginViews();
            };
            var cv = {
                props: {
                    configurable: true
                },
                root: {
                    configurable: true
                }
            };
            cv.props.get = function() {
                if (this._props.state != this.state) {
                    var a = this._props;
                    this._props = {};
                    for(var b in a){
                        this._props[b] = a[b];
                    }
                    this._props.state = this.state;
                }
                return this._props;
            };
            cu.prototype.update = function a(b) {
                if (b.handleDOMEvents != this._props.handleDOMEvents) {
                    bG(this);
                }
                this._props = b;
                if (b.plugins) {
                    b.plugins.forEach(cC);
                    this.directPlugins = b.plugins;
                }
                this.updateStateInner(b.state, true);
            };
            cu.prototype.setProps = function a(b) {
                var c = {};
                for(var d in this._props){
                    c[d] = this._props[d];
                }
                c.state = this.state;
                for(var e in b){
                    c[e] = b[e];
                }
                this.update(c);
            };
            cu.prototype.updateState = function a(b) {
                this.updateStateInner(b, this.state.plugins != b.plugins);
            };
            cu.prototype.updateStateInner = function a(b, c) {
                var e = this;
                var f = this.state, h = false, i = false;
                if (b.storedMarks && this.composing) {
                    b$(this);
                    i = true;
                }
                this.state = b;
                if (c) {
                    var j = cA(this);
                    if (cB(j, this.nodeViews)) {
                        this.nodeViews = j;
                        h = true;
                    }
                    bG(this);
                }
                this.editable = cy(this);
                cx(this);
                var k = ct(this), l = cw(this);
                var m = c ? "reset" : b.scrollToSelection > f.scrollToSelection ? "to selection" : "preserve";
                var n = h || !this.docView.matchesNode(b.doc, l, k);
                if (n || !b.selection.eq(f.selection)) {
                    i = true;
                }
                var o = m == "preserve" && i && this.dom.style.overflowAnchor == null && C(this);
                if (i) {
                    this.domObserver.stop();
                    var p = n && (g.ie || g.chrome) && !this.composing && !f.selection.empty && !b.selection.empty && cz(f.selection, b.selection);
                    if (n) {
                        var q = g.chrome ? (this.trackWrites = this.root.getSelection().focusNode) : null;
                        if (h || !this.docView.update(b.doc, l, k, this)) {
                            this.docView.updateOuterDeco([]);
                            this.docView.destroy();
                            this.docView = am(b.doc, l, k, this.dom, this);
                        }
                        if (q && !this.trackWrites) {
                            p = true;
                        }
                    }
                    if (p || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && aV(this))) {
                        aJ(this, p);
                    } else {
                        aQ(this, b.selection);
                        this.domObserver.setCurSelection();
                    }
                    this.domObserver.start();
                }
                this.updatePluginViews(f);
                if (m == "reset") {
                    this.dom.scrollTop = 0;
                } else if (m == "to selection") {
                    var r = this.root.getSelection().focusNode;
                    if (this.someProp("handleScrollToSelection", function(a) {
                        return a(e);
                    })) ;
                    else if (b.selection instanceof d.NodeSelection) {
                        B(this, this.docView.domAfterPos(b.selection.from).getBoundingClientRect(), r);
                    } else {
                        B(this, this.coordsAtPos(b.selection.head, 1), r);
                    }
                } else if (o) {
                    E(o);
                }
            };
            cu.prototype.destroyPluginViews = function a() {
                var b;
                while((b = this.pluginViews.pop())){
                    if (b.destroy) {
                        b.destroy();
                    }
                }
            };
            cu.prototype.updatePluginViews = function a(b) {
                if (!b || b.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
                    this.prevDirectPlugins = this.directPlugins;
                    this.destroyPluginViews();
                    for(var c = 0; c < this.directPlugins.length; c++){
                        var d = this.directPlugins[c];
                        if (d.spec.view) {
                            this.pluginViews.push(d.spec.view(this));
                        }
                    }
                    for(var e = 0; e < this.state.plugins.length; e++){
                        var f = this.state.plugins[e];
                        if (f.spec.view) {
                            this.pluginViews.push(f.spec.view(this));
                        }
                    }
                } else {
                    for(var g = 0; g < this.pluginViews.length; g++){
                        var h = this.pluginViews[g];
                        if (h.update) {
                            h.update(this, b);
                        }
                    }
                }
            };
            cu.prototype.someProp = function a(b, c) {
                var d = this._props && this._props[b], e;
                if (d != null && (e = c ? c(d) : d)) {
                    return e;
                }
                for(var f = 0; f < this.directPlugins.length; f++){
                    var g = this.directPlugins[f].props[b];
                    if (g != null && (e = c ? c(g) : g)) {
                        return e;
                    }
                }
                var h = this.state.plugins;
                if (h) {
                    for(var i = 0; i < h.length; i++){
                        var j = h[i].props[b];
                        if (j != null && (e = c ? c(j) : j)) {
                            return e;
                        }
                    }
                }
            };
            cu.prototype.hasFocus = function a() {
                return this.root.activeElement == this.dom;
            };
            cu.prototype.focus = function a() {
                this.domObserver.stop();
                if (this.editable) {
                    H(this.dom);
                }
                aJ(this);
                this.domObserver.start();
            };
            cv.root.get = function() {
                var a = this._root;
                if (a == null) {
                    for(var b = this.dom.parentNode; b; b = b.parentNode){
                        if (b.nodeType == 9 || (b.nodeType == 11 && b.host)) {
                            if (!b.getSelection) {
                                Object.getPrototypeOf(b).getSelection = function() {
                                    return document.getSelection();
                                };
                            }
                            return (this._root = b);
                        }
                    }
                }
                return a || document;
            };
            cu.prototype.posAtCoords = function a(b) {
                return P(this, b);
            };
            cu.prototype.coordsAtPos = function a(b, c) {
                if (c === void 0) c = 1;
                return S(this, b, c);
            };
            cu.prototype.domAtPos = function a(b, c) {
                if (c === void 0) c = 0;
                return this.docView.domFromPos(b, c);
            };
            cu.prototype.nodeDOM = function a(b) {
                var c = this.docView.descAt(b);
                return c ? c.nodeDOM : null;
            };
            cu.prototype.posAtDOM = function a(b, c, d) {
                if (d === void 0) d = -1;
                var e = this.docView.posFromDOM(b, c, d);
                if (e == null) {
                    throw new RangeError("DOM position not inside the editor");
                }
                return e;
            };
            cu.prototype.endOfTextblock = function a(b, c) {
                return aa(this, c || this.state, b);
            };
            cu.prototype.destroy = function a() {
                if (!this.docView) {
                    return;
                }
                bF(this);
                this.destroyPluginViews();
                if (this.mounted) {
                    this.docView.update(this.state.doc, [], ct(this), this);
                    this.dom.textContent = "";
                } else if (this.dom.parentNode) {
                    this.dom.parentNode.removeChild(this.dom);
                }
                this.docView.destroy();
                this.docView = null;
            };
            cu.prototype.dispatchEvent = function a(b) {
                return bJ(this, b);
            };
            cu.prototype.dispatch = function a(b) {
                var c = this._props.dispatchTransaction;
                if (c) {
                    c.call(this, b);
                } else {
                    this.updateState(this.state.apply(b));
                }
            };
            Object.defineProperties(cu.prototype, cv);
            function cw(a) {
                var b = Object.create(null);
                b.class = "ProseMirror";
                b.contenteditable = String(a.editable);
                b.translate = "no";
                a.someProp("attributes", function(c) {
                    if (typeof c == "function") {
                        c = c(a.state);
                    }
                    if (c) {
                        for(var d in c){
                            if (d == "class") {
                                b.class += " " + c[d];
                            }
                            if (d == "style") {
                                b.style = (b.style ? b.style + ";" : "") + c[d];
                            } else if (!b[d] && d != "contenteditable" && d != "nodeName") {
                                b[d] = String(c[d]);
                            }
                        }
                    }
                });
                return [
                    cd.node(0, a.state.doc.content.size, b)
                ];
            }
            function cx(a) {
                if (a.markCursor) {
                    var b = document.createElement("img");
                    b.className = "ProseMirror-separator";
                    b.setAttribute("mark-placeholder", "true");
                    a.cursorWrapper = {
                        dom: b,
                        deco: cd.widget(a.state.selection.head, b, {
                            raw: true,
                            marks: a.markCursor
                        })
                    };
                } else {
                    a.cursorWrapper = null;
                }
            }
            function cy(a) {
                return !a.someProp("editable", function(b) {
                    return b(a.state) === false;
                });
            }
            function cz(a, b) {
                var c = Math.min(a.$anchor.sharedDepth(a.head), b.$anchor.sharedDepth(b.head));
                return a.$anchor.start(c) != b.$anchor.start(c);
            }
            function cA(a) {
                var b = {};
                a.someProp("nodeViews", function(a) {
                    for(var c in a){
                        if (!Object.prototype.hasOwnProperty.call(b, c)) {
                            b[c] = a[c];
                        }
                    }
                });
                return b;
            }
            function cB(a, b) {
                var c = 0, d = 0;
                for(var e in a){
                    if (a[e] != b[e]) {
                        return true;
                    }
                    c++;
                }
                for(var f in b){
                    d++;
                }
                return c != d;
            }
            function cC(a) {
                if (a.spec.state || a.spec.filterTransaction || a.spec.appendTransaction) {
                    throw new RangeError("Plugins passed directly to the view must not have a state component");
                }
            }
        }
    }, 
]);
