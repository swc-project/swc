"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        453
    ],
    {
        8780: function(e, t, r) {
            r.r(t);
            r.d(t, {
                Decoration: function() {
                    return rn;
                },
                DecorationSet: function() {
                    return ra;
                },
                EditorView: function() {
                    return rb;
                },
                __endComposition: function() {
                    return t7;
                },
                __parseFromClipboard: function() {
                    return tl;
                },
                __serializeForClipboard: function() {
                    return ta;
                }
            });
            var n = r(6922);
            var o = r(2230);
            var i = r(1081);
            var s = {};
            if (typeof navigator != "undefined" && typeof document != "undefined") {
                var a = /Edge\/(\d+)/.exec(navigator.userAgent);
                var l = /MSIE \d/.test(navigator.userAgent);
                var f = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
                var c = (s.ie = !!(l || f || a));
                s.ie_version = l ? document.documentMode || 6 : f ? +f[1] : a ? +a[1] : null;
                s.gecko = !c && /gecko\/(\d+)/i.test(navigator.userAgent);
                s.gecko_version = s.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1];
                var d = !c && /Chrome\/(\d+)/.exec(navigator.userAgent);
                s.chrome = !!d;
                s.chrome_version = d && +d[1];
                s.safari = !c && /Apple Computer/.test(navigator.vendor);
                s.ios = s.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
                s.mac = s.ios || /Mac/.test(navigator.platform);
                s.android = /Android \d/.test(navigator.userAgent);
                s.webkit = "webkitFontSmoothing" in document.documentElement.style;
                s.webkit_version = s.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0, 
                ])[1];
            }
            var u = function(e) {
                for(var t = 0;; t++){
                    e = e.previousSibling;
                    if (!e) {
                        return t;
                    }
                }
            };
            var h = function(e) {
                var t = e.assignedSlot || e.parentNode;
                return t && t.nodeType == 11 ? t.host : t;
            };
            var p = null;
            var v = function(e, t, r) {
                var n = p || (p = document.createRange());
                n.setEnd(e, r == null ? e.nodeValue.length : r);
                n.setStart(e, t || 0);
                return n;
            };
            var m = function(e, t, r, n) {
                return (r && (y(e, t, r, n, -1) || y(e, t, r, n, 1)));
            };
            var g = /^(img|br|input|textarea|hr)$/i;
            function y(e, t, r, n, o) {
                for(;;){
                    if (e == r && t == n) {
                        return true;
                    }
                    if (t == (o < 0 ? 0 : $(e))) {
                        var i = e.parentNode;
                        if (i.nodeType != 1 || w(e) || g.test(e.nodeName) || e.contentEditable == "false") {
                            return false;
                        }
                        t = u(e) + (o < 0 ? 0 : 1);
                        e = i;
                    } else if (e.nodeType == 1) {
                        e = e.childNodes[t + (o < 0 ? -1 : 0)];
                        if (e.contentEditable == "false") {
                            return false;
                        }
                        t = o < 0 ? $(e) : 0;
                    } else {
                        return false;
                    }
                }
            }
            function $(e) {
                return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
            }
            function b(e, t, r) {
                for(var n = t == 0, o = t == $(e); n || o;){
                    if (e == r) {
                        return true;
                    }
                    var i = u(e);
                    e = e.parentNode;
                    if (!e) {
                        return false;
                    }
                    n = n && i == 0;
                    o = o && i == $(e);
                }
            }
            function w(e) {
                var t;
                for(var r = e; r; r = r.parentNode){
                    if ((t = r.pmViewDesc)) {
                        break;
                    }
                }
                return (t && t.node && t.node.isBlock && (t.dom == e || t.contentDOM == e));
            }
            var _ = function(e) {
                var t = e.isCollapsed;
                if (t && s.chrome && e.rangeCount && !e.getRangeAt(0).collapsed) {
                    t = false;
                }
                return t;
            };
            function S(e, t) {
                var r = document.createEvent("Event");
                r.initEvent("keydown", true, true);
                r.keyCode = e;
                r.key = r.code = t;
                return r;
            }
            function D(e) {
                return {
                    left: 0,
                    right: e.documentElement.clientWidth,
                    top: 0,
                    bottom: e.documentElement.clientHeight
                };
            }
            function N(e, t) {
                return typeof e == "number" ? e : e[t];
            }
            function O(e) {
                var t = e.getBoundingClientRect();
                var r = t.width / e.offsetWidth || 1;
                var n = t.height / e.offsetHeight || 1;
                return {
                    left: t.left,
                    right: t.left + e.clientWidth * r,
                    top: t.top,
                    bottom: t.top + e.clientHeight * n
                };
            }
            function C(e, t, r) {
                var n = e.someProp("scrollThreshold") || 0, o = e.someProp("scrollMargin") || 5;
                var i = e.dom.ownerDocument;
                for(var s = r || e.dom;; s = h(s)){
                    if (!s) {
                        break;
                    }
                    if (s.nodeType != 1) {
                        continue;
                    }
                    var a = s == i.body || s.nodeType != 1;
                    var l = a ? D(i) : O(s);
                    var f = 0, c = 0;
                    if (t.top < l.top + N(n, "top")) {
                        c = -(l.top - t.top + N(o, "top"));
                    } else if (t.bottom > l.bottom - N(n, "bottom")) {
                        c = t.bottom - l.bottom + N(o, "bottom");
                    }
                    if (t.left < l.left + N(n, "left")) {
                        f = -(l.left - t.left + N(o, "left"));
                    } else if (t.right > l.right - N(n, "right")) {
                        f = t.right - l.right + N(o, "right");
                    }
                    if (f || c) {
                        if (a) {
                            i.defaultView.scrollBy(f, c);
                        } else {
                            var d = s.scrollLeft, u = s.scrollTop;
                            if (c) {
                                s.scrollTop += c;
                            }
                            if (f) {
                                s.scrollLeft += f;
                            }
                            var p = s.scrollLeft - d, v = s.scrollTop - u;
                            t = {
                                left: t.left - p,
                                top: t.top - v,
                                right: t.right - p,
                                bottom: t.bottom - v
                            };
                        }
                    }
                    if (a) {
                        break;
                    }
                }
            }
            function k(e) {
                var t = e.dom.getBoundingClientRect(), r = Math.max(0, t.top);
                var n, o;
                for(var i = (t.left + t.right) / 2, s = r + 1; s < Math.min(innerHeight, t.bottom); s += 5){
                    var a = e.root.elementFromPoint(i, s);
                    if (a == e.dom || !e.dom.contains(a)) {
                        continue;
                    }
                    var l = a.getBoundingClientRect();
                    if (l.top >= r - 20) {
                        n = a;
                        o = l.top;
                        break;
                    }
                }
                return {
                    refDOM: n,
                    refTop: o,
                    stack: x(e.dom)
                };
            }
            function x(e) {
                var t = [], r = e.ownerDocument;
                for(; e; e = h(e)){
                    t.push({
                        dom: e,
                        top: e.scrollTop,
                        left: e.scrollLeft
                    });
                    if (e == r) {
                        break;
                    }
                }
                return t;
            }
            function M(e) {
                var t = e.refDOM;
                var r = e.refTop;
                var n = e.stack;
                var o = t ? t.getBoundingClientRect().top : 0;
                T(n, o == 0 ? 0 : o - r);
            }
            function T(e, t) {
                for(var r = 0; r < e.length; r++){
                    var n = e[r];
                    var o = n.dom;
                    var i = n.top;
                    var s = n.left;
                    if (o.scrollTop != i + t) {
                        o.scrollTop = i + t;
                    }
                    if (o.scrollLeft != s) {
                        o.scrollLeft = s;
                    }
                }
            }
            var A = null;
            function P(e) {
                if (e.setActive) {
                    return e.setActive();
                }
                if (A) {
                    return e.focus(A);
                }
                var t = x(e);
                e.focus(A == null ? {
                    get preventScroll () {
                        A = {
                            preventScroll: true
                        };
                        return true;
                    }
                } : undefined);
                if (!A) {
                    A = false;
                    T(t, 0);
                }
            }
            function E(e, t) {
                var r, n = 2e8, o, i = 0;
                var s = t.top, a = t.top;
                for(var l = e.firstChild, f = 0; l; l = l.nextSibling, f++){
                    var c = void 0;
                    if (l.nodeType == 1) {
                        c = l.getClientRects();
                    } else if (l.nodeType == 3) {
                        c = v(l).getClientRects();
                    } else {
                        continue;
                    }
                    for(var d = 0; d < c.length; d++){
                        var u = c[d];
                        if (u.top <= s && u.bottom >= a) {
                            s = Math.max(u.bottom, s);
                            a = Math.min(u.top, a);
                            var h = u.left > t.left ? u.left - t.left : u.right < t.left ? t.left - u.right : 0;
                            if (h < n) {
                                r = l;
                                n = h;
                                o = h && r.nodeType == 3 ? {
                                    left: u.right < t.left ? u.right : u.left,
                                    top: t.top
                                } : t;
                                if (l.nodeType == 1 && h) {
                                    i = f + (t.left >= (u.left + u.right) / 2 ? 1 : 0);
                                }
                                continue;
                            }
                        }
                        if (!r && ((t.left >= u.right && t.top >= u.top) || (t.left >= u.left && t.top >= u.bottom))) {
                            i = f + 1;
                        }
                    }
                }
                if (r && r.nodeType == 3) {
                    return V(r, o);
                }
                if (!r || (n && r.nodeType == 1)) {
                    return {
                        node: e,
                        offset: i
                    };
                }
                return E(r, o);
            }
            function V(e, t) {
                var r = e.nodeValue.length;
                var n = document.createRange();
                for(var o = 0; o < r; o++){
                    n.setEnd(e, o + 1);
                    n.setStart(e, o);
                    var i = K(n, 1);
                    if (i.top == i.bottom) {
                        continue;
                    }
                    if (B(t, i)) {
                        return {
                            node: e,
                            offset: o + (t.left >= (i.left + i.right) / 2 ? 1 : 0)
                        };
                    }
                }
                return {
                    node: e,
                    offset: 0
                };
            }
            function B(e, t) {
                return (e.left >= t.left - 1 && e.left <= t.right + 1 && e.top >= t.top - 1 && e.top <= t.bottom + 1);
            }
            function R(e, t) {
                var r = e.parentNode;
                if (r && /^li$/i.test(r.nodeName) && t.left < e.getBoundingClientRect().left) {
                    return r;
                }
                return e;
            }
            function z(e, t, r) {
                var n = E(t, r);
                var o = n.node;
                var i = n.offset;
                var s = -1;
                if (o.nodeType == 1 && !o.firstChild) {
                    var a = o.getBoundingClientRect();
                    s = a.left != a.right && r.left > (a.left + a.right) / 2 ? 1 : -1;
                }
                return e.docView.posFromDOM(o, i, s);
            }
            function F(e, t, r, n) {
                var o = -1;
                for(var i = t;;){
                    if (i == e.dom) {
                        break;
                    }
                    var s = e.docView.nearestDesc(i, true);
                    if (!s) {
                        return null;
                    }
                    if (s.node.isBlock && s.parent) {
                        var a = s.dom.getBoundingClientRect();
                        if (a.left > n.left || a.top > n.top) {
                            o = s.posBefore;
                        } else if (a.right < n.left || a.bottom < n.top) {
                            o = s.posAfter;
                        } else {
                            break;
                        }
                    }
                    i = s.dom.parentNode;
                }
                return o > -1 ? o : e.docView.posFromDOM(t, r);
            }
            function I(e, t, r) {
                var n = e.childNodes.length;
                if (n && r.top < r.bottom) {
                    for(var o = Math.max(0, Math.min(n - 1, Math.floor((n * (t.top - r.top)) / (r.bottom - r.top)) - 2)), i = o;;){
                        var s = e.childNodes[i];
                        if (s.nodeType == 1) {
                            var a = s.getClientRects();
                            for(var l = 0; l < a.length; l++){
                                var f = a[l];
                                if (B(t, f)) {
                                    return I(s, t, f);
                                }
                            }
                        }
                        if ((i = (i + 1) % n) == o) {
                            break;
                        }
                    }
                }
                return e;
            }
            function L(e, t) {
                var r, n;
                var o = e.dom.ownerDocument, i, a;
                if (o.caretPositionFromPoint) {
                    try {
                        var l = o.caretPositionFromPoint(t.left, t.top);
                        if (l) {
                            (r = l), (i = r.offsetNode), (a = r.offset);
                        }
                    } catch (f) {}
                }
                if (!i && o.caretRangeFromPoint) {
                    var c = o.caretRangeFromPoint(t.left, t.top);
                    if (c) {
                        (n = c), (i = n.startContainer), (a = n.startOffset);
                    }
                }
                var d = (e.root.elementFromPoint ? e.root : o).elementFromPoint(t.left, t.top + 1), u;
                if (!d || !e.dom.contains(d.nodeType != 1 ? d.parentNode : d)) {
                    var p = e.dom.getBoundingClientRect();
                    if (!B(t, p)) {
                        return null;
                    }
                    d = I(e.dom, t, p);
                    if (!d) {
                        return null;
                    }
                }
                if (s.safari) {
                    for(var v = d; i && v; v = h(v)){
                        if (v.draggable) {
                            i = a = null;
                        }
                    }
                }
                d = R(d, t);
                if (i) {
                    if (s.gecko && i.nodeType == 1) {
                        a = Math.min(a, i.childNodes.length);
                        if (a < i.childNodes.length) {
                            var m = i.childNodes[a], g;
                            if (m.nodeName == "IMG" && (g = m.getBoundingClientRect()).right <= t.left && g.bottom > t.top) {
                                a++;
                            }
                        }
                    }
                    if (i == e.dom && a == i.childNodes.length - 1 && i.lastChild.nodeType == 1 && t.top > i.lastChild.getBoundingClientRect().bottom) {
                        u = e.state.doc.content.size;
                    } else if (a == 0 || i.nodeType != 1 || i.childNodes[a - 1].nodeName != "BR") {
                        u = F(e, i, a, t);
                    }
                }
                if (u == null) {
                    u = z(e, d, t);
                }
                var y = e.docView.nearestDesc(d, true);
                return {
                    pos: u,
                    inside: y ? y.posAtStart - y.border : -1
                };
            }
            function K(e, t) {
                var r = e.getClientRects();
                return !r.length ? e.getBoundingClientRect() : r[t < 0 ? 0 : r.length - 1];
            }
            var q = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
            function W(e, t, r) {
                var n = e.docView.domFromPos(t, r < 0 ? -1 : 1);
                var o = n.node;
                var i = n.offset;
                var a = s.webkit || s.gecko;
                if (o.nodeType == 3) {
                    if (a && (q.test(o.nodeValue) || (r < 0 ? !i : i == o.nodeValue.length))) {
                        var l = K(v(o, i, i), r);
                        if (s.gecko && i && /\s/.test(o.nodeValue[i - 1]) && i < o.nodeValue.length) {
                            var f = K(v(o, i - 1, i - 1), -1);
                            if (f.top == l.top) {
                                var c = K(v(o, i, i + 1), -1);
                                if (c.top != l.top) {
                                    return H(c, c.left < f.left);
                                }
                            }
                        }
                        return l;
                    } else {
                        var d = i, u = i, h = r < 0 ? 1 : -1;
                        if (r < 0 && !i) {
                            u++;
                            h = -1;
                        } else if (r >= 0 && i == o.nodeValue.length) {
                            d--;
                            h = 1;
                        } else if (r < 0) {
                            d--;
                        } else {
                            u++;
                        }
                        return H(K(v(o, d, u), h), h < 0);
                    }
                }
                if (!e.state.doc.resolve(t).parent.inlineContent) {
                    if (i && (r < 0 || i == $(o))) {
                        var p = o.childNodes[i - 1];
                        if (p.nodeType == 1) {
                            return U(p.getBoundingClientRect(), false);
                        }
                    }
                    if (i < $(o)) {
                        var m = o.childNodes[i];
                        if (m.nodeType == 1) {
                            return U(m.getBoundingClientRect(), true);
                        }
                    }
                    return U(o.getBoundingClientRect(), r >= 0);
                }
                if (i && (r < 0 || i == $(o))) {
                    var g = o.childNodes[i - 1];
                    var y = g.nodeType == 3 ? v(g, $(g) - (a ? 0 : 1)) : g.nodeType == 1 && (g.nodeName != "BR" || !g.nextSibling) ? g : null;
                    if (y) {
                        return H(K(y, 1), false);
                    }
                }
                if (i < $(o)) {
                    var b = o.childNodes[i];
                    while(b.pmViewDesc && b.pmViewDesc.ignoreForCoords){
                        b = b.nextSibling;
                    }
                    var w = !b ? null : b.nodeType == 3 ? v(b, 0, a ? 0 : 1) : b.nodeType == 1 ? b : null;
                    if (w) {
                        return H(K(w, -1), true);
                    }
                }
                return H(K(o.nodeType == 3 ? v(o) : o, -r), r >= 0);
            }
            function H(e, t) {
                if (e.width == 0) {
                    return e;
                }
                var r = t ? e.left : e.right;
                return {
                    top: e.top,
                    bottom: e.bottom,
                    left: r,
                    right: r
                };
            }
            function U(e, t) {
                if (e.height == 0) {
                    return e;
                }
                var r = t ? e.top : e.bottom;
                return {
                    top: r,
                    bottom: r,
                    left: e.left,
                    right: e.right
                };
            }
            function G(e, t, r) {
                var n = e.state, o = e.root.activeElement;
                if (n != t) {
                    e.updateState(t);
                }
                if (o != e.dom) {
                    e.focus();
                }
                try {
                    return r();
                } finally{
                    if (n != t) {
                        e.updateState(n);
                    }
                    if (o != e.dom && o) {
                        o.focus();
                    }
                }
            }
            function X(e, t, r) {
                var n = t.selection;
                var o = r == "up" ? n.$from : n.$to;
                return G(e, t, function() {
                    var t = e.docView.domFromPos(o.pos, r == "up" ? -1 : 1);
                    var n = t.node;
                    for(;;){
                        var i = e.docView.nearestDesc(n, true);
                        if (!i) {
                            break;
                        }
                        if (i.node.isBlock) {
                            n = i.dom;
                            break;
                        }
                        n = i.dom.parentNode;
                    }
                    var s = W(e, o.pos, 1);
                    for(var a = n.firstChild; a; a = a.nextSibling){
                        var l = void 0;
                        if (a.nodeType == 1) {
                            l = a.getClientRects();
                        } else if (a.nodeType == 3) {
                            l = v(a, 0, a.nodeValue.length).getClientRects();
                        } else {
                            continue;
                        }
                        for(var f = 0; f < l.length; f++){
                            var c = l[f];
                            if (c.bottom > c.top + 1 && (r == "up" ? s.top - c.top > (c.bottom - s.top) * 2 : c.bottom - s.bottom > (s.bottom - c.top) * 2)) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            var Y = /[\u0590-\u08ac]/;
            function j(e, t, r) {
                var n = t.selection;
                var o = n.$head;
                if (!o.parent.isTextblock) {
                    return false;
                }
                var i = o.parentOffset, s = !i, a = i == o.parent.content.size;
                var l = e.root.getSelection();
                if (!Y.test(o.parent.textContent) || !l.modify) {
                    return r == "left" || r == "backward" ? s : a;
                }
                return G(e, t, function() {
                    var t = l.getRangeAt(0), n = l.focusNode, i = l.focusOffset;
                    var s = l.caretBidiLevel;
                    l.modify("move", r, "character");
                    var a = o.depth ? e.docView.domAfterPos(o.before()) : e.dom;
                    var f = !a.contains(l.focusNode.nodeType == 1 ? l.focusNode : l.focusNode.parentNode) || (n == l.focusNode && i == l.focusOffset);
                    l.removeAllRanges();
                    l.addRange(t);
                    if (s != null) {
                        l.caretBidiLevel = s;
                    }
                    return f;
                });
            }
            var J = null, Q = null, Z = false;
            function ee(e, t, r) {
                if (J == t && Q == r) {
                    return Z;
                }
                J = t;
                Q = r;
                return (Z = r == "up" || r == "down" ? X(e, t, r) : j(e, t, r));
            }
            var et = 0, er = 1, en = 2, eo = 3;
            var ei = function e(t, r, n, o) {
                this.parent = t;
                this.children = r;
                this.dom = n;
                n.pmViewDesc = this;
                this.contentDOM = o;
                this.dirty = et;
            };
            var es = {
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
            ei.prototype.matchesWidget = function e() {
                return false;
            };
            ei.prototype.matchesMark = function e() {
                return false;
            };
            ei.prototype.matchesNode = function e() {
                return false;
            };
            ei.prototype.matchesHack = function e(t) {
                return false;
            };
            ei.prototype.parseRule = function e() {
                return null;
            };
            ei.prototype.stopEvent = function e() {
                return false;
            };
            es.size.get = function() {
                var e = 0;
                for(var t = 0; t < this.children.length; t++){
                    e += this.children[t].size;
                }
                return e;
            };
            es.border.get = function() {
                return 0;
            };
            ei.prototype.destroy = function e() {
                this.parent = null;
                if (this.dom.pmViewDesc == this) {
                    this.dom.pmViewDesc = null;
                }
                for(var t = 0; t < this.children.length; t++){
                    this.children[t].destroy();
                }
            };
            ei.prototype.posBeforeChild = function e(t) {
                for(var r = 0, n = this.posAtStart; r < this.children.length; r++){
                    var o = this.children[r];
                    if (o == t) {
                        return n;
                    }
                    n += o.size;
                }
            };
            es.posBefore.get = function() {
                return this.parent.posBeforeChild(this);
            };
            es.posAtStart.get = function() {
                return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
            };
            es.posAfter.get = function() {
                return this.posBefore + this.size;
            };
            es.posAtEnd.get = function() {
                return this.posAtStart + this.size - 2 * this.border;
            };
            ei.prototype.localPosFromDOM = function e(t, r, n) {
                if (this.contentDOM && this.contentDOM.contains(t.nodeType == 1 ? t : t.parentNode)) {
                    if (n < 0) {
                        var o, i;
                        if (t == this.contentDOM) {
                            o = t.childNodes[r - 1];
                        } else {
                            while(t.parentNode != this.contentDOM){
                                t = t.parentNode;
                            }
                            o = t.previousSibling;
                        }
                        while(o && !((i = o.pmViewDesc) && i.parent == this)){
                            o = o.previousSibling;
                        }
                        return o ? this.posBeforeChild(i) + i.size : this.posAtStart;
                    } else {
                        var s, a;
                        if (t == this.contentDOM) {
                            s = t.childNodes[r];
                        } else {
                            while(t.parentNode != this.contentDOM){
                                t = t.parentNode;
                            }
                            s = t.nextSibling;
                        }
                        while(s && !((a = s.pmViewDesc) && a.parent == this)){
                            s = s.nextSibling;
                        }
                        return s ? this.posBeforeChild(a) : this.posAtEnd;
                    }
                }
                var l;
                if (t == this.dom && this.contentDOM) {
                    l = r > u(this.contentDOM);
                } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
                    l = t.compareDocumentPosition(this.contentDOM) & 2;
                } else if (this.dom.firstChild) {
                    if (r == 0) {
                        for(var f = t;; f = f.parentNode){
                            if (f == this.dom) {
                                l = false;
                                break;
                            }
                            if (f.parentNode.firstChild != f) {
                                break;
                            }
                        }
                    }
                    if (l == null && r == t.childNodes.length) {
                        for(var c = t;; c = c.parentNode){
                            if (c == this.dom) {
                                l = true;
                                break;
                            }
                            if (c.parentNode.lastChild != c) {
                                break;
                            }
                        }
                    }
                }
                return (l == null ? n > 0 : l) ? this.posAtEnd : this.posAtStart;
            };
            ei.prototype.nearestDesc = function e(t, r) {
                for(var n = true, o = t; o; o = o.parentNode){
                    var i = this.getDesc(o);
                    if (i && (!r || i.node)) {
                        if (n && i.nodeDOM && !(i.nodeDOM.nodeType == 1 ? i.nodeDOM.contains(t.nodeType == 1 ? t : t.parentNode) : i.nodeDOM == t)) {
                            n = false;
                        } else {
                            return i;
                        }
                    }
                }
            };
            ei.prototype.getDesc = function e(t) {
                var r = t.pmViewDesc;
                for(var n = r; n; n = n.parent){
                    if (n == this) {
                        return r;
                    }
                }
            };
            ei.prototype.posFromDOM = function e(t, r, n) {
                for(var o = t; o; o = o.parentNode){
                    var i = this.getDesc(o);
                    if (i) {
                        return i.localPosFromDOM(t, r, n);
                    }
                }
                return -1;
            };
            ei.prototype.descAt = function e(t) {
                for(var r = 0, n = 0; r < this.children.length; r++){
                    var o = this.children[r], i = n + o.size;
                    if (n == t && i != n) {
                        while(!o.border && o.children.length){
                            o = o.children[0];
                        }
                        return o;
                    }
                    if (t < i) {
                        return o.descAt(t - n - o.border);
                    }
                    n = i;
                }
            };
            ei.prototype.domFromPos = function e(t, r) {
                if (!this.contentDOM) {
                    return {
                        node: this.dom,
                        offset: 0
                    };
                }
                var n = 0, o = 0;
                for(var i = 0; n < this.children.length; n++){
                    var s = this.children[n], a = i + s.size;
                    if (a > t || s instanceof ep) {
                        o = t - i;
                        break;
                    }
                    i = a;
                }
                if (o) {
                    return this.children[n].domFromPos(o - this.children[n].border, r);
                }
                for(var l = void 0; n && !(l = this.children[n - 1]).size && l instanceof el && l.widget.type.side >= 0; n--){}
                if (r <= 0) {
                    var f, c = true;
                    for(;; n--, c = false){
                        f = n ? this.children[n - 1] : null;
                        if (!f || f.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (f && r && c && !f.border && !f.domAtom) {
                        return f.domFromPos(f.size, r);
                    }
                    return {
                        node: this.contentDOM,
                        offset: f ? u(f.dom) + 1 : 0
                    };
                } else {
                    var d, h = true;
                    for(;; n++, h = false){
                        d = n < this.children.length ? this.children[n] : null;
                        if (!d || d.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (d && h && !d.border && !d.domAtom) {
                        return d.domFromPos(0, r);
                    }
                    return {
                        node: this.contentDOM,
                        offset: d ? u(d.dom) : this.contentDOM.childNodes.length
                    };
                }
            };
            ei.prototype.parseRange = function e(t, r, n) {
                if (n === void 0) n = 0;
                if (this.children.length == 0) {
                    return {
                        node: this.contentDOM,
                        from: t,
                        to: r,
                        fromOffset: 0,
                        toOffset: this.contentDOM.childNodes.length
                    };
                }
                var o = -1, i = -1;
                for(var s = n, a = 0;; a++){
                    var l = this.children[a], f = s + l.size;
                    if (o == -1 && t <= f) {
                        var c = s + l.border;
                        if (t >= c && r <= f - l.border && l.node && l.contentDOM && this.contentDOM.contains(l.contentDOM)) {
                            return l.parseRange(t, r, c);
                        }
                        t = s;
                        for(var d = a; d > 0; d--){
                            var h = this.children[d - 1];
                            if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
                                o = u(h.dom) + 1;
                                break;
                            }
                            t -= h.size;
                        }
                        if (o == -1) {
                            o = 0;
                        }
                    }
                    if (o > -1 && (f > r || a == this.children.length - 1)) {
                        r = f;
                        for(var p = a + 1; p < this.children.length; p++){
                            var v = this.children[p];
                            if (v.size && v.dom.parentNode == this.contentDOM && !v.emptyChildAt(-1)) {
                                i = u(v.dom);
                                break;
                            }
                            r += v.size;
                        }
                        if (i == -1) {
                            i = this.contentDOM.childNodes.length;
                        }
                        break;
                    }
                    s = f;
                }
                return {
                    node: this.contentDOM,
                    from: t,
                    to: r,
                    fromOffset: o,
                    toOffset: i
                };
            };
            ei.prototype.emptyChildAt = function e(t) {
                if (this.border || !this.contentDOM || !this.children.length) {
                    return false;
                }
                var r = this.children[t < 0 ? 0 : this.children.length - 1];
                return r.size == 0 || r.emptyChildAt(t);
            };
            ei.prototype.domAfterPos = function e(t) {
                var r = this.domFromPos(t, 0);
                var n = r.node;
                var o = r.offset;
                if (n.nodeType != 1 || o == n.childNodes.length) {
                    throw new RangeError("No node after pos " + t);
                }
                return n.childNodes[o];
            };
            ei.prototype.setSelection = function e(t, r, n, o) {
                var i = Math.min(t, r), a = Math.max(t, r);
                for(var l = 0, f = 0; l < this.children.length; l++){
                    var c = this.children[l], d = f + c.size;
                    if (i > f && a < d) {
                        return c.setSelection(t - f - c.border, r - f - c.border, n, o);
                    }
                    f = d;
                }
                var h = this.domFromPos(t, t ? -1 : 1);
                var p = r == t ? h : this.domFromPos(r, r ? -1 : 1);
                var v = n.getSelection();
                var g = false;
                if ((s.gecko || s.safari) && t == r) {
                    var y = h.node;
                    var $ = h.offset;
                    if (y.nodeType == 3) {
                        g = $ && y.nodeValue[$ - 1] == "\n";
                        if (g && $ == y.nodeValue.length) {
                            for(var b = y, w = void 0; b; b = b.parentNode){
                                if ((w = b.nextSibling)) {
                                    if (w.nodeName == "BR") {
                                        h = p = {
                                            node: w.parentNode,
                                            offset: u(w) + 1
                                        };
                                    }
                                    break;
                                }
                                var _ = b.pmViewDesc;
                                if (_ && _.node && _.node.isBlock) {
                                    break;
                                }
                            }
                        }
                    } else {
                        var S = y.childNodes[$ - 1];
                        g = S && (S.nodeName == "BR" || S.contentEditable == "false");
                    }
                }
                if (s.gecko && v.focusNode && v.focusNode != p.node && v.focusNode.nodeType == 1) {
                    var D = v.focusNode.childNodes[v.focusOffset];
                    if (D && D.contentEditable == "false") {
                        o = true;
                    }
                }
                if (!(o || (g && s.safari)) && m(h.node, h.offset, v.anchorNode, v.anchorOffset) && m(p.node, p.offset, v.focusNode, v.focusOffset)) {
                    return;
                }
                var N = false;
                if ((v.extend || t == r) && !g) {
                    v.collapse(h.node, h.offset);
                    try {
                        if (t != r) {
                            v.extend(p.node, p.offset);
                        }
                        N = true;
                    } catch (O) {
                        if (!(O instanceof DOMException)) {
                            throw O;
                        }
                    }
                }
                if (!N) {
                    if (t > r) {
                        var C = h;
                        h = p;
                        p = C;
                    }
                    var k = document.createRange();
                    k.setEnd(p.node, p.offset);
                    k.setStart(h.node, h.offset);
                    v.removeAllRanges();
                    v.addRange(k);
                }
            };
            ei.prototype.ignoreMutation = function e(t) {
                return !this.contentDOM && t.type != "selection";
            };
            es.contentLost.get = function() {
                return (this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM));
            };
            ei.prototype.markDirty = function e(t, r) {
                for(var n = 0, o = 0; o < this.children.length; o++){
                    var i = this.children[o], s = n + i.size;
                    if (n == s ? t <= s && r >= n : t < s && r > n) {
                        var a = n + i.border, l = s - i.border;
                        if (t >= a && r <= l) {
                            this.dirty = t == n || r == s ? en : er;
                            if (t == a && r == l && (i.contentLost || i.dom.parentNode != this.contentDOM)) {
                                i.dirty = eo;
                            } else {
                                i.markDirty(t - a, r - a);
                            }
                            return;
                        } else {
                            i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM ? en : eo;
                        }
                    }
                    n = s;
                }
                this.dirty = en;
            };
            ei.prototype.markParentsDirty = function e() {
                var t = 1;
                for(var r = this.parent; r; r = r.parent, t++){
                    var n = t == 1 ? en : er;
                    if (r.dirty < n) {
                        r.dirty = n;
                    }
                }
            };
            es.domAtom.get = function() {
                return false;
            };
            es.ignoreForCoords.get = function() {
                return false;
            };
            Object.defineProperties(ei.prototype, es);
            var ea = [];
            var el = (function(e) {
                function t(t, r, n, o) {
                    var i, s = r.type.toDOM;
                    if (typeof s == "function") {
                        s = s(n, function() {
                            if (!i) {
                                return o;
                            }
                            if (i.parent) {
                                return i.parent.posBeforeChild(i);
                            }
                        });
                    }
                    if (!r.type.spec.raw) {
                        if (s.nodeType != 1) {
                            var a = document.createElement("span");
                            a.appendChild(s);
                            s = a;
                        }
                        s.contentEditable = false;
                        s.classList.add("ProseMirror-widget");
                    }
                    e.call(this, t, ea, s, null);
                    this.widget = r;
                    i = this;
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                var r = {
                    domAtom: {
                        configurable: true
                    }
                };
                t.prototype.matchesWidget = function e(t) {
                    return (this.dirty == et && t.type.eq(this.widget.type));
                };
                t.prototype.parseRule = function e() {
                    return {
                        ignore: true
                    };
                };
                t.prototype.stopEvent = function e(t) {
                    var r = this.widget.spec.stopEvent;
                    return r ? r(t) : false;
                };
                t.prototype.ignoreMutation = function e(t) {
                    return (t.type != "selection" || this.widget.spec.ignoreSelection);
                };
                r.domAtom.get = function() {
                    return true;
                };
                Object.defineProperties(t.prototype, r);
                return t;
            })(ei);
            var ef = (function(e) {
                function t(t, r, n, o) {
                    e.call(this, t, ea, r, null);
                    this.textDOM = n;
                    this.text = o;
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                var r = {
                    size: {
                        configurable: true
                    }
                };
                r.size.get = function() {
                    return this.text.length;
                };
                t.prototype.localPosFromDOM = function e(t, r) {
                    if (t != this.textDOM) {
                        return this.posAtStart + (r ? this.size : 0);
                    }
                    return this.posAtStart + r;
                };
                t.prototype.domFromPos = function e(t) {
                    return {
                        node: this.textDOM,
                        offset: t
                    };
                };
                t.prototype.ignoreMutation = function e(t) {
                    return (t.type === "characterData" && t.target.nodeValue == t.oldValue);
                };
                Object.defineProperties(t.prototype, r);
                return t;
            })(ei);
            var ec = (function(e) {
                function t(t, r, n, o) {
                    e.call(this, t, [], n, o);
                    this.mark = r;
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                t.create = function e(r, n, i, s) {
                    var a = s.nodeViews[n.type.name];
                    var l = a && a(n, s, i);
                    if (!l || !l.dom) {
                        l = o.DOMSerializer.renderSpec(document, n.type.spec.toDOM(n, i));
                    }
                    return new t(r, n, l.dom, l.contentDOM || l.dom);
                };
                t.prototype.parseRule = function e() {
                    return {
                        mark: this.mark.type.name,
                        attrs: this.mark.attrs,
                        contentElement: this.contentDOM
                    };
                };
                t.prototype.matchesMark = function e(t) {
                    return this.dirty != eo && this.mark.eq(t);
                };
                t.prototype.markDirty = function t(r, n) {
                    e.prototype.markDirty.call(this, r, n);
                    if (this.dirty != et) {
                        var o = this.parent;
                        while(!o.node){
                            o = o.parent;
                        }
                        if (o.dirty < this.dirty) {
                            o.dirty = this.dirty;
                        }
                        this.dirty = et;
                    }
                };
                t.prototype.slice = function e(r, n, o) {
                    var i = t.create(this.parent, this.mark, true, o);
                    var s = this.children, a = this.size;
                    if (n < a) {
                        s = eA(s, n, a, o);
                    }
                    if (r > 0) {
                        s = eA(s, 0, r, o);
                    }
                    for(var l = 0; l < s.length; l++){
                        s[l].parent = i;
                    }
                    i.children = s;
                    return i;
                };
                return t;
            })(ei);
            var ed = (function(e) {
                function t(t, r, n, o, i, s, a, l, f) {
                    e.call(this, t, r.isLeaf ? ea : [], i, s);
                    this.nodeDOM = a;
                    this.node = r;
                    this.outerDeco = n;
                    this.innerDeco = o;
                    if (s) {
                        this.updateChildren(l, f);
                    }
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                var r = {
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
                t.create = function e(r, n, i, s, a, l) {
                    var f;
                    var c = a.nodeViews[n.type.name], d;
                    var u = c && c(n, a, function() {
                        if (!d) {
                            return l;
                        }
                        if (d.parent) {
                            return d.parent.posBeforeChild(d);
                        }
                    }, i, s);
                    var h = u && u.dom, p = u && u.contentDOM;
                    if (n.isText) {
                        if (!h) {
                            h = document.createTextNode(n.text);
                        } else if (h.nodeType != 3) {
                            throw new RangeError("Text must be rendered as a DOM text node");
                        }
                    } else if (!h) {
                        (f = o.DOMSerializer.renderSpec(document, n.type.spec.toDOM(n))), (h = f.dom), (p = f.contentDOM);
                    }
                    if (!p && !n.isText && h.nodeName != "BR") {
                        if (!h.hasAttribute("contenteditable")) {
                            h.contentEditable = false;
                        }
                        if (n.type.spec.draggable) {
                            h.draggable = true;
                        }
                    }
                    var v = h;
                    h = e_(h, i, n);
                    if (u) {
                        return (d = new ev(r, n, i, s, h, p, v, u, a, l + 1));
                    } else if (n.isText) {
                        return new eh(r, n, i, s, h, v, a);
                    } else {
                        return new t(r, n, i, s, h, p, v, a, l + 1);
                    }
                };
                t.prototype.parseRule = function e() {
                    var t = this;
                    if (this.node.type.spec.reparseInView) {
                        return null;
                    }
                    var r = {
                        node: this.node.type.name,
                        attrs: this.node.attrs
                    };
                    if (this.node.type.spec.code) {
                        r.preserveWhitespace = "full";
                    }
                    if (this.contentDOM && !this.contentLost) {
                        r.contentElement = this.contentDOM;
                    } else {
                        r.getContent = function() {
                            return t.contentDOM ? o.Fragment.empty : t.node.content;
                        };
                    }
                    return r;
                };
                t.prototype.matchesNode = function e(t, r, n) {
                    return (this.dirty == et && t.eq(this.node) && eS(r, this.outerDeco) && n.eq(this.innerDeco));
                };
                r.size.get = function() {
                    return this.node.nodeSize;
                };
                r.border.get = function() {
                    return this.node.isLeaf ? 0 : 1;
                };
                t.prototype.updateChildren = function e(t, r) {
                    var n = this;
                    var i = this.node.inlineContent, a = r;
                    var l = t.composing && this.localCompositionInfo(t, r);
                    var f = l && l.pos > -1 ? l : null;
                    var c = l && l.pos < 0;
                    var d = new eN(this, f && f.node);
                    ek(this.node, this.innerDeco, function(e, r, s) {
                        if (e.spec.marks) {
                            d.syncToMarks(e.spec.marks, i, t);
                        } else if (e.type.side >= 0 && !s) {
                            d.syncToMarks(r == n.node.childCount ? o.Mark.none : n.node.child(r).marks, i, t);
                        }
                        d.placeWidget(e, t, a);
                    }, function(e, r, n, o) {
                        d.syncToMarks(e.marks, i, t);
                        var s;
                        if (d.findNodeMatch(e, r, n, o)) ;
                        else if (c && t.state.selection.from > a && t.state.selection.to < a + e.nodeSize && (s = d.findIndexWithChild(l.node)) > -1 && d.updateNodeAt(e, r, n, s, t)) ;
                        else if (d.updateNextNode(e, r, n, t, o)) ;
                        else {
                            d.addNode(e, r, n, t, a);
                        }
                        a += e.nodeSize;
                    });
                    d.syncToMarks(ea, i, t);
                    if (this.node.isTextblock) {
                        d.addTextblockHacks();
                    }
                    d.destroyRest();
                    if (d.changed || this.dirty == en) {
                        if (f) {
                            this.protectLocalComposition(t, f);
                        }
                        em(this.contentDOM, this.children, t);
                        if (s.ios) {
                            ex(this.dom);
                        }
                    }
                };
                t.prototype.localCompositionInfo = function e(t, r) {
                    var o = t.state.selection;
                    var i = o.from;
                    var s = o.to;
                    if (!(t.state.selection instanceof n.TextSelection) || i < r || s > r + this.node.content.size) {
                        return;
                    }
                    var a = t.root.getSelection();
                    var l = eM(a.focusNode, a.focusOffset);
                    if (!l || !this.dom.contains(l.parentNode)) {
                        return;
                    }
                    if (this.node.inlineContent) {
                        var f = l.nodeValue;
                        var c = eT(this.node.content, f, i - r, s - r);
                        return c < 0 ? null : {
                            node: l,
                            pos: c,
                            text: f
                        };
                    } else {
                        return {
                            node: l,
                            pos: -1
                        };
                    }
                };
                t.prototype.protectLocalComposition = function e(t, r) {
                    var n = r.node;
                    var o = r.pos;
                    var i = r.text;
                    if (this.getDesc(n)) {
                        return;
                    }
                    var s = n;
                    for(;; s = s.parentNode){
                        if (s.parentNode == this.contentDOM) {
                            break;
                        }
                        while(s.previousSibling){
                            s.parentNode.removeChild(s.previousSibling);
                        }
                        while(s.nextSibling){
                            s.parentNode.removeChild(s.nextSibling);
                        }
                        if (s.pmViewDesc) {
                            s.pmViewDesc = null;
                        }
                    }
                    var a = new ef(this, s, n, i);
                    t.compositionNodes.push(a);
                    this.children = eA(this.children, o, o + i.length, t, a);
                };
                t.prototype.update = function e(t, r, n, o) {
                    if (this.dirty == eo || !t.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateInner(t, r, n, o);
                    return true;
                };
                t.prototype.updateInner = function e(t, r, n, o) {
                    this.updateOuterDeco(r);
                    this.node = t;
                    this.innerDeco = n;
                    if (this.contentDOM) {
                        this.updateChildren(o, this.posAtStart);
                    }
                    this.dirty = et;
                };
                t.prototype.updateOuterDeco = function e(t) {
                    if (eS(t, this.outerDeco)) {
                        return;
                    }
                    var r = this.nodeDOM.nodeType != 1;
                    var n = this.dom;
                    this.dom = eb(this.dom, this.nodeDOM, e$(this.outerDeco, this.node, r), e$(t, this.node, r));
                    if (this.dom != n) {
                        n.pmViewDesc = null;
                        this.dom.pmViewDesc = this;
                    }
                    this.outerDeco = t;
                };
                t.prototype.selectNode = function e() {
                    this.nodeDOM.classList.add("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.draggable = true;
                    }
                };
                t.prototype.deselectNode = function e() {
                    this.nodeDOM.classList.remove("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.removeAttribute("draggable");
                    }
                };
                r.domAtom.get = function() {
                    return this.node.isAtom;
                };
                Object.defineProperties(t.prototype, r);
                return t;
            })(ei);
            function eu(e, t, r, n, o) {
                e_(n, t, e);
                return new ed(null, e, t, r, n, n, n, o, 0);
            }
            var eh = (function(e) {
                function t(t, r, n, o, i, s, a) {
                    e.call(this, t, r, n, o, i, null, s, a);
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                var r = {
                    domAtom: {
                        configurable: true
                    }
                };
                t.prototype.parseRule = function e() {
                    var t = this.nodeDOM.parentNode;
                    while(t && t != this.dom && !t.pmIsDeco){
                        t = t.parentNode;
                    }
                    return {
                        skip: t || true
                    };
                };
                t.prototype.update = function e(t, r, n, o) {
                    if (this.dirty == eo || (this.dirty != et && !this.inParent()) || !t.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateOuterDeco(r);
                    if ((this.dirty != et || t.text != this.node.text) && t.text != this.nodeDOM.nodeValue) {
                        this.nodeDOM.nodeValue = t.text;
                        if (o.trackWrites == this.nodeDOM) {
                            o.trackWrites = null;
                        }
                    }
                    this.node = t;
                    this.dirty = et;
                    return true;
                };
                t.prototype.inParent = function e() {
                    var t = this.parent.contentDOM;
                    for(var r = this.nodeDOM; r; r = r.parentNode){
                        if (r == t) {
                            return true;
                        }
                    }
                    return false;
                };
                t.prototype.domFromPos = function e(t) {
                    return {
                        node: this.nodeDOM,
                        offset: t
                    };
                };
                t.prototype.localPosFromDOM = function t(r, n, o) {
                    if (r == this.nodeDOM) {
                        return (this.posAtStart + Math.min(n, this.node.text.length));
                    }
                    return e.prototype.localPosFromDOM.call(this, r, n, o);
                };
                t.prototype.ignoreMutation = function e(t) {
                    return (t.type != "characterData" && t.type != "selection");
                };
                t.prototype.slice = function e(r, n, o) {
                    var i = this.node.cut(r, n), s = document.createTextNode(i.text);
                    return new t(this.parent, i, this.outerDeco, this.innerDeco, s, s, o);
                };
                t.prototype.markDirty = function t(r, n) {
                    e.prototype.markDirty.call(this, r, n);
                    if (this.dom != this.nodeDOM && (r == 0 || n == this.nodeDOM.nodeValue.length)) {
                        this.dirty = eo;
                    }
                };
                r.domAtom.get = function() {
                    return false;
                };
                Object.defineProperties(t.prototype, r);
                return t;
            })(ed);
            var ep = (function(e) {
                function t() {
                    e.apply(this, arguments);
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                var r = {
                    domAtom: {
                        configurable: true
                    },
                    ignoreForCoords: {
                        configurable: true
                    }
                };
                t.prototype.parseRule = function e() {
                    return {
                        ignore: true
                    };
                };
                t.prototype.matchesHack = function e(t) {
                    return (this.dirty == et && this.dom.nodeName == t);
                };
                r.domAtom.get = function() {
                    return true;
                };
                r.ignoreForCoords.get = function() {
                    return this.dom.nodeName == "IMG";
                };
                Object.defineProperties(t.prototype, r);
                return t;
            })(ei);
            var ev = (function(e) {
                function t(t, r, n, o, i, s, a, l, f, c) {
                    e.call(this, t, r, n, o, i, s, a, f, c);
                    this.spec = l;
                }
                if (e) t.__proto__ = e;
                t.prototype = Object.create(e && e.prototype);
                t.prototype.constructor = t;
                t.prototype.update = function t(r, n, o, i) {
                    if (this.dirty == eo) {
                        return false;
                    }
                    if (this.spec.update) {
                        var s = this.spec.update(r, n, o);
                        if (s) {
                            this.updateInner(r, n, o, i);
                        }
                        return s;
                    } else if (!this.contentDOM && !r.isLeaf) {
                        return false;
                    } else {
                        return e.prototype.update.call(this, r, n, o, i);
                    }
                };
                t.prototype.selectNode = function t() {
                    this.spec.selectNode ? this.spec.selectNode() : e.prototype.selectNode.call(this);
                };
                t.prototype.deselectNode = function t() {
                    this.spec.deselectNode ? this.spec.deselectNode() : e.prototype.deselectNode.call(this);
                };
                t.prototype.setSelection = function t(r, n, o, i) {
                    this.spec.setSelection ? this.spec.setSelection(r, n, o) : e.prototype.setSelection.call(this, r, n, o, i);
                };
                t.prototype.destroy = function t() {
                    if (this.spec.destroy) {
                        this.spec.destroy();
                    }
                    e.prototype.destroy.call(this);
                };
                t.prototype.stopEvent = function e(t) {
                    return this.spec.stopEvent ? this.spec.stopEvent(t) : false;
                };
                t.prototype.ignoreMutation = function t(r) {
                    return this.spec.ignoreMutation ? this.spec.ignoreMutation(r) : e.prototype.ignoreMutation.call(this, r);
                };
                return t;
            })(ed);
            function em(e, t, r) {
                var n = e.firstChild, o = false;
                for(var i = 0; i < t.length; i++){
                    var s = t[i], a = s.dom;
                    if (a.parentNode == e) {
                        while(a != n){
                            n = eD(n);
                            o = true;
                        }
                        n = n.nextSibling;
                    } else {
                        o = true;
                        e.insertBefore(a, n);
                    }
                    if (s instanceof ec) {
                        var l = n ? n.previousSibling : e.lastChild;
                        em(s.contentDOM, s.children, r);
                        n = l ? l.nextSibling : e.firstChild;
                    }
                }
                while(n){
                    n = eD(n);
                    o = true;
                }
                if (o && r.trackWrites == e) {
                    r.trackWrites = null;
                }
            }
            function eg(e) {
                if (e) {
                    this.nodeName = e;
                }
            }
            eg.prototype = Object.create(null);
            var ey = [
                new eg()
            ];
            function e$(e, t, r) {
                if (e.length == 0) {
                    return ey;
                }
                var n = r ? ey[0] : new eg(), o = [
                    n
                ];
                for(var i = 0; i < e.length; i++){
                    var s = e[i].type.attrs;
                    if (!s) {
                        continue;
                    }
                    if (s.nodeName) {
                        o.push((n = new eg(s.nodeName)));
                    }
                    for(var a in s){
                        var l = s[a];
                        if (l == null) {
                            continue;
                        }
                        if (r && o.length == 1) {
                            o.push((n = new eg(t.isInline ? "span" : "div")));
                        }
                        if (a == "class") {
                            n.class = (n.class ? n.class + " " : "") + l;
                        } else if (a == "style") {
                            n.style = (n.style ? n.style + ";" : "") + l;
                        } else if (a != "nodeName") {
                            n[a] = l;
                        }
                    }
                }
                return o;
            }
            function eb(e, t, r, n) {
                if (r == ey && n == ey) {
                    return t;
                }
                var o = t;
                for(var i = 0; i < n.length; i++){
                    var s = n[i], a = r[i];
                    if (i) {
                        var l = void 0;
                        if (a && a.nodeName == s.nodeName && o != e && (l = o.parentNode) && l.tagName.toLowerCase() == s.nodeName) {
                            o = l;
                        } else {
                            l = document.createElement(s.nodeName);
                            l.pmIsDeco = true;
                            l.appendChild(o);
                            a = ey[0];
                            o = l;
                        }
                    }
                    ew(o, a || ey[0], s);
                }
                return o;
            }
            function ew(e, t, r) {
                for(var n in t){
                    if (n != "class" && n != "style" && n != "nodeName" && !(n in r)) {
                        e.removeAttribute(n);
                    }
                }
                for(var o in r){
                    if (o != "class" && o != "style" && o != "nodeName" && r[o] != t[o]) {
                        e.setAttribute(o, r[o]);
                    }
                }
                if (t.class != r.class) {
                    var i = t.class ? t.class.split(" ").filter(Boolean) : ea;
                    var s = r.class ? r.class.split(" ").filter(Boolean) : ea;
                    for(var a = 0; a < i.length; a++){
                        if (s.indexOf(i[a]) == -1) {
                            e.classList.remove(i[a]);
                        }
                    }
                    for(var l = 0; l < s.length; l++){
                        if (i.indexOf(s[l]) == -1) {
                            e.classList.add(s[l]);
                        }
                    }
                }
                if (t.style != r.style) {
                    if (t.style) {
                        var f = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, c;
                        while((c = f.exec(t.style))){
                            e.style.removeProperty(c[1]);
                        }
                    }
                    if (r.style) {
                        e.style.cssText += r.style;
                    }
                }
            }
            function e_(e, t, r) {
                return eb(e, e, ey, e$(t, r, e.nodeType != 1));
            }
            function eS(e, t) {
                if (e.length != t.length) {
                    return false;
                }
                for(var r = 0; r < e.length; r++){
                    if (!e[r].type.eq(t[r].type)) {
                        return false;
                    }
                }
                return true;
            }
            function eD(e) {
                var t = e.nextSibling;
                e.parentNode.removeChild(e);
                return t;
            }
            var eN = function e(t, r) {
                this.top = t;
                this.lock = r;
                this.index = 0;
                this.stack = [];
                this.changed = false;
                this.preMatch = eO(t.node.content, t.children);
            };
            eN.prototype.destroyBetween = function e(t, r) {
                if (t == r) {
                    return;
                }
                for(var n = t; n < r; n++){
                    this.top.children[n].destroy();
                }
                this.top.children.splice(t, r - t);
                this.changed = true;
            };
            eN.prototype.destroyRest = function e() {
                this.destroyBetween(this.index, this.top.children.length);
            };
            eN.prototype.syncToMarks = function e(t, r, n) {
                var o = 0, i = this.stack.length >> 1;
                var s = Math.min(i, t.length);
                while(o < s && (o == i - 1 ? this.top : this.stack[(o + 1) << 1]).matchesMark(t[o]) && t[o].type.spec.spanning !== false){
                    o++;
                }
                while(o < i){
                    this.destroyRest();
                    this.top.dirty = et;
                    this.index = this.stack.pop();
                    this.top = this.stack.pop();
                    i--;
                }
                while(i < t.length){
                    this.stack.push(this.top, this.index + 1);
                    var a = -1;
                    for(var l = this.index; l < Math.min(this.index + 3, this.top.children.length); l++){
                        if (this.top.children[l].matchesMark(t[i])) {
                            a = l;
                            break;
                        }
                    }
                    if (a > -1) {
                        if (a > this.index) {
                            this.changed = true;
                            this.destroyBetween(this.index, a);
                        }
                        this.top = this.top.children[this.index];
                    } else {
                        var f = ec.create(this.top, t[i], r, n);
                        this.top.children.splice(this.index, 0, f);
                        this.top = f;
                        this.changed = true;
                    }
                    this.index = 0;
                    i++;
                }
            };
            eN.prototype.findNodeMatch = function e(t, r, n, o) {
                var i = this.top.children, s = -1;
                if (o >= this.preMatch.index) {
                    for(var a = this.index; a < i.length; a++){
                        if (i[a].matchesNode(t, r, n)) {
                            s = a;
                            break;
                        }
                    }
                } else {
                    for(var l = this.index, f = Math.min(i.length, l + 1); l < f; l++){
                        var c = i[l];
                        if (c.matchesNode(t, r, n) && !this.preMatch.matched.has(c)) {
                            s = l;
                            break;
                        }
                    }
                }
                if (s < 0) {
                    return false;
                }
                this.destroyBetween(this.index, s);
                this.index++;
                return true;
            };
            eN.prototype.updateNodeAt = function e(t, r, n, o, i) {
                var s = this.top.children[o];
                if (!s.update(t, r, n, i)) {
                    return false;
                }
                this.destroyBetween(this.index, o);
                this.index = o + 1;
                return true;
            };
            eN.prototype.findIndexWithChild = function e(t) {
                for(;;){
                    var r = t.parentNode;
                    if (!r) {
                        return -1;
                    }
                    if (r == this.top.contentDOM) {
                        var n = t.pmViewDesc;
                        if (n) {
                            for(var o = this.index; o < this.top.children.length; o++){
                                if (this.top.children[o] == n) {
                                    return o;
                                }
                            }
                        }
                        return -1;
                    }
                    t = r;
                }
            };
            eN.prototype.updateNextNode = function e(t, r, n, o, i) {
                for(var s = this.index; s < this.top.children.length; s++){
                    var a = this.top.children[s];
                    if (a instanceof ed) {
                        var l = this.preMatch.matched.get(a);
                        if (l != null && l != i) {
                            return false;
                        }
                        var f = a.dom;
                        var c = this.lock && (f == this.lock || (f.nodeType == 1 && f.contains(this.lock.parentNode))) && !(t.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == t.text && a.dirty != eo && eS(r, a.outerDeco));
                        if (!c && a.update(t, r, n, o)) {
                            this.destroyBetween(this.index, s);
                            if (a.dom != f) {
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
            eN.prototype.addNode = function e(t, r, n, o, i) {
                this.top.children.splice(this.index++, 0, ed.create(this.top, t, r, n, o, i));
                this.changed = true;
            };
            eN.prototype.placeWidget = function e(t, r, n) {
                var o = this.index < this.top.children.length ? this.top.children[this.index] : null;
                if (o && o.matchesWidget(t) && (t == o.widget || !o.widget.type.toDOM.parentNode)) {
                    this.index++;
                } else {
                    var i = new el(this.top, t, r, n);
                    this.top.children.splice(this.index++, 0, i);
                    this.changed = true;
                }
            };
            eN.prototype.addTextblockHacks = function e() {
                var t = this.top.children[this.index - 1];
                while(t instanceof ec){
                    t = t.children[t.children.length - 1];
                }
                if (!t || !(t instanceof eh) || /\n$/.test(t.node.text)) {
                    if ((s.safari || s.chrome) && t && t.dom.contentEditable == "false") {
                        this.addHackNode("IMG");
                    }
                    this.addHackNode("BR");
                }
            };
            eN.prototype.addHackNode = function e(t) {
                if (this.index < this.top.children.length && this.top.children[this.index].matchesHack(t)) {
                    this.index++;
                } else {
                    var r = document.createElement(t);
                    if (t == "IMG") {
                        r.className = "ProseMirror-separator";
                    }
                    if (t == "BR") {
                        r.className = "ProseMirror-trailingBreak";
                    }
                    this.top.children.splice(this.index++, 0, new ep(this.top, ea, r, null));
                    this.changed = true;
                }
            };
            function eO(e, t) {
                var r = e.childCount, n = t.length, o = new Map();
                for(; r > 0 && n > 0; n--){
                    var i = t[n - 1], s = i.node;
                    if (!s) {
                        continue;
                    }
                    if (s != e.child(r - 1)) {
                        break;
                    }
                    --r;
                    o.set(i, r);
                }
                return {
                    index: r,
                    matched: o
                };
            }
            function eC(e, t) {
                return e.type.side - t.type.side;
            }
            function ek(e, t, r, n) {
                var o = t.locals(e), i = 0;
                if (o.length == 0) {
                    for(var s = 0; s < e.childCount; s++){
                        var a = e.child(s);
                        n(a, o, t.forChild(i, a), s);
                        i += a.nodeSize;
                    }
                    return;
                }
                var l = 0, f = [], c = null;
                for(var d = 0;;){
                    if (l < o.length && o[l].to == i) {
                        var u = o[l++], h = void 0;
                        while(l < o.length && o[l].to == i){
                            (h || (h = [
                                u
                            ])).push(o[l++]);
                        }
                        if (h) {
                            h.sort(eC);
                            for(var p = 0; p < h.length; p++){
                                r(h[p], d, !!c);
                            }
                        } else {
                            r(u, d, !!c);
                        }
                    }
                    var v = void 0, m = void 0;
                    if (c) {
                        m = -1;
                        v = c;
                        c = null;
                    } else if (d < e.childCount) {
                        m = d;
                        v = e.child(d++);
                    } else {
                        break;
                    }
                    for(var g = 0; g < f.length; g++){
                        if (f[g].to <= i) {
                            f.splice(g--, 1);
                        }
                    }
                    while(l < o.length && o[l].from <= i && o[l].to > i){
                        f.push(o[l++]);
                    }
                    var y = i + v.nodeSize;
                    if (v.isText) {
                        var $ = y;
                        if (l < o.length && o[l].from < $) {
                            $ = o[l].from;
                        }
                        for(var b = 0; b < f.length; b++){
                            if (f[b].to < $) {
                                $ = f[b].to;
                            }
                        }
                        if ($ < y) {
                            c = v.cut($ - i);
                            v = v.cut(0, $ - i);
                            y = $;
                            m = -1;
                        }
                    }
                    var w = !f.length ? ea : v.isInline && !v.isLeaf ? f.filter(function(e) {
                        return !e.inline;
                    }) : f.slice();
                    n(v, w, t.forChild(i, v), m);
                    i = y;
                }
            }
            function ex(e) {
                if (e.nodeName == "UL" || e.nodeName == "OL") {
                    var t = e.style.cssText;
                    e.style.cssText = t + "; list-style: square !important";
                    window.getComputedStyle(e).listStyle;
                    e.style.cssText = t;
                }
            }
            function eM(e, t) {
                for(;;){
                    if (e.nodeType == 3) {
                        return e;
                    }
                    if (e.nodeType == 1 && t > 0) {
                        if (e.childNodes.length > t && e.childNodes[t].nodeType == 3) {
                            return e.childNodes[t];
                        }
                        e = e.childNodes[t - 1];
                        t = $(e);
                    } else if (e.nodeType == 1 && t < e.childNodes.length) {
                        e = e.childNodes[t];
                        t = 0;
                    } else {
                        return null;
                    }
                }
            }
            function eT(e, t, r, n) {
                for(var o = 0, i = 0; o < e.childCount && i <= n;){
                    var s = e.child(o++), a = i;
                    i += s.nodeSize;
                    if (!s.isText) {
                        continue;
                    }
                    var l = s.text;
                    while(o < e.childCount){
                        var f = e.child(o++);
                        i += f.nodeSize;
                        if (!f.isText) {
                            break;
                        }
                        l += f.text;
                    }
                    if (i >= r) {
                        var c = l.lastIndexOf(t, n - a);
                        if (c >= 0 && c + t.length + a >= r) {
                            return a + c;
                        }
                    }
                }
                return -1;
            }
            function eA(e, t, r, n, o) {
                var i = [];
                for(var s = 0, a = 0; s < e.length; s++){
                    var l = e[s], f = a, c = (a += l.size);
                    if (f >= r || c <= t) {
                        i.push(l);
                    } else {
                        if (f < t) {
                            i.push(l.slice(0, t - f, n));
                        }
                        if (o) {
                            i.push(o);
                            o = null;
                        }
                        if (c > r) {
                            i.push(l.slice(r - f, l.size, n));
                        }
                    }
                }
                return i;
            }
            function eP(e, t) {
                var r = e.root.getSelection(), o = e.state.doc;
                if (!r.focusNode) {
                    return null;
                }
                var i = e.docView.nearestDesc(r.focusNode), s = i && i.size == 0;
                var a = e.docView.posFromDOM(r.focusNode, r.focusOffset);
                if (a < 0) {
                    return null;
                }
                var l = o.resolve(a), f, c;
                if (_(r)) {
                    f = l;
                    while(i && !i.node){
                        i = i.parent;
                    }
                    if (i && i.node.isAtom && n.NodeSelection.isSelectable(i.node) && i.parent && !(i.node.isInline && b(r.focusNode, r.focusOffset, i.dom))) {
                        var d = i.posBefore;
                        c = new n.NodeSelection(a == d ? l : o.resolve(d));
                    }
                } else {
                    var u = e.docView.posFromDOM(r.anchorNode, r.anchorOffset);
                    if (u < 0) {
                        return null;
                    }
                    f = o.resolve(u);
                }
                if (!c) {
                    var h = t == "pointer" || (e.state.selection.head < l.pos && !s) ? 1 : -1;
                    c = e1(e, f, l, h);
                }
                return c;
            }
            function eE(e) {
                return e.editable ? e.hasFocus() : eq(e) && document.activeElement && document.activeElement.contains(e.dom);
            }
            function eV(e, t) {
                var r = e.state.selection;
                eL(e, r);
                if (!eE(e)) {
                    return;
                }
                if (!t && e.mouseDown && e.mouseDown.allowDefault) {
                    e.mouseDown.delayedSelectionSync = true;
                    e.domObserver.setCurSelection();
                    return;
                }
                e.domObserver.disconnectSelection();
                if (e.cursorWrapper) {
                    eI(e);
                } else {
                    var o = r.anchor;
                    var i = r.head;
                    var s, a;
                    if (eB && !(r instanceof n.TextSelection)) {
                        if (!r.$from.parent.inlineContent) {
                            s = eR(e, r.from);
                        }
                        if (!r.empty && !r.$from.parent.inlineContent) {
                            a = eR(e, r.to);
                        }
                    }
                    e.docView.setSelection(o, i, e.root, t);
                    if (eB) {
                        if (s) {
                            eF(s);
                        }
                        if (a) {
                            eF(a);
                        }
                    }
                    if (r.visible) {
                        e.dom.classList.remove("ProseMirror-hideselection");
                    } else {
                        e.dom.classList.add("ProseMirror-hideselection");
                        if ("onselectionchange" in document) {
                            e8(e);
                        }
                    }
                }
                e.domObserver.setCurSelection();
                e.domObserver.connectSelection();
            }
            var eB = s.safari || (s.chrome && s.chrome_version < 63);
            function eR(e, t) {
                var r = e.docView.domFromPos(t, 0);
                var n = r.node;
                var o = r.offset;
                var i = o < n.childNodes.length ? n.childNodes[o] : null;
                var a = o ? n.childNodes[o - 1] : null;
                if (s.safari && i && i.contentEditable == "false") {
                    return ez(i);
                }
                if ((!i || i.contentEditable == "false") && (!a || a.contentEditable == "false")) {
                    if (i) {
                        return ez(i);
                    } else if (a) {
                        return ez(a);
                    }
                }
            }
            function ez(e) {
                e.contentEditable = "true";
                if (s.safari && e.draggable) {
                    e.draggable = false;
                    e.wasDraggable = true;
                }
                return e;
            }
            function eF(e) {
                e.contentEditable = "false";
                if (e.wasDraggable) {
                    e.draggable = true;
                    e.wasDraggable = null;
                }
            }
            function e8(e) {
                var t = e.dom.ownerDocument;
                t.removeEventListener("selectionchange", e.hideSelectionGuard);
                var r = e.root.getSelection();
                var n = r.anchorNode, o = r.anchorOffset;
                t.addEventListener("selectionchange", (e.hideSelectionGuard = function() {
                    if (r.anchorNode != n || r.anchorOffset != o) {
                        t.removeEventListener("selectionchange", e.hideSelectionGuard);
                        setTimeout(function() {
                            if (!eE(e) || e.state.selection.visible) {
                                e.dom.classList.remove("ProseMirror-hideselection");
                            }
                        }, 20);
                    }
                }));
            }
            function eI(e) {
                var t = e.root.getSelection(), r = document.createRange();
                var n = e.cursorWrapper.dom, o = n.nodeName == "IMG";
                if (o) {
                    r.setEnd(n.parentNode, u(n) + 1);
                } else {
                    r.setEnd(n, 0);
                }
                r.collapse(false);
                t.removeAllRanges();
                t.addRange(r);
                if (!o && !e.state.selection.visible && s.ie && s.ie_version <= 11) {
                    n.disabled = true;
                    n.disabled = false;
                }
            }
            function eL(e, t) {
                if (t instanceof n.NodeSelection) {
                    var r = e.docView.descAt(t.from);
                    if (r != e.lastSelectedViewDesc) {
                        e0(e);
                        if (r) {
                            r.selectNode();
                        }
                        e.lastSelectedViewDesc = r;
                    }
                } else {
                    e0(e);
                }
            }
            function e0(e) {
                if (e.lastSelectedViewDesc) {
                    if (e.lastSelectedViewDesc.parent) {
                        e.lastSelectedViewDesc.deselectNode();
                    }
                    e.lastSelectedViewDesc = null;
                }
            }
            function e1(e, t, r, o) {
                return (e.someProp("createSelectionBetween", function(n) {
                    return n(e, t, r);
                }) || n.TextSelection.between(t, r, o));
            }
            function eK(e) {
                if (e.editable && e.root.activeElement != e.dom) {
                    return false;
                }
                return eq(e);
            }
            function eq(e) {
                var t = e.root.getSelection();
                if (!t.anchorNode) {
                    return false;
                }
                try {
                    return (e.dom.contains(t.anchorNode.nodeType == 3 ? t.anchorNode.parentNode : t.anchorNode) && (e.editable || e.dom.contains(t.focusNode.nodeType == 3 ? t.focusNode.parentNode : t.focusNode)));
                } catch (r) {
                    return false;
                }
            }
            function e9(e) {
                var t = e.docView.domFromPos(e.state.selection.anchor, 0);
                var r = e.root.getSelection();
                return m(t.node, t.offset, r.anchorNode, r.anchorOffset);
            }
            function eW(e, t) {
                var r = e.selection;
                var o = r.$anchor;
                var i = r.$head;
                var s = t > 0 ? o.max(i) : o.min(i);
                var a = !s.parent.inlineContent ? s : s.depth ? e.doc.resolve(t > 0 ? s.after() : s.before()) : null;
                return (a && n.Selection.findFrom(a, t));
            }
            function eH(e, t) {
                e.dispatch(e.state.tr.setSelection(t).scrollIntoView());
                return true;
            }
            function e3(e, t, r) {
                var o = e.state.selection;
                if (o instanceof n.TextSelection) {
                    if (!o.empty || r.indexOf("s") > -1) {
                        return false;
                    } else if (e.endOfTextblock(t > 0 ? "right" : "left")) {
                        var i = eW(e.state, t);
                        if (i && i instanceof n.NodeSelection) {
                            return eH(e, i);
                        }
                        return false;
                    } else if (!(s.mac && r.indexOf("m") > -1)) {
                        var a = o.$head, l = a.textOffset ? null : t < 0 ? a.nodeBefore : a.nodeAfter, f;
                        if (!l || l.isText) {
                            return false;
                        }
                        var c = t < 0 ? a.pos - l.nodeSize : a.pos;
                        if (!(l.isAtom || ((f = e.docView.descAt(c)) && !f.contentDOM))) {
                            return false;
                        }
                        if (n.NodeSelection.isSelectable(l)) {
                            return eH(e, new n.NodeSelection(t < 0 ? e.state.doc.resolve(a.pos - l.nodeSize) : a));
                        } else if (s.webkit) {
                            return eH(e, new n.TextSelection(e.state.doc.resolve(t < 0 ? c : c + l.nodeSize)));
                        } else {
                            return false;
                        }
                    }
                } else if (o instanceof n.NodeSelection && o.node.isInline) {
                    return eH(e, new n.TextSelection(t > 0 ? o.$to : o.$from));
                } else {
                    var d = eW(e.state, t);
                    if (d) {
                        return eH(e, d);
                    }
                    return false;
                }
            }
            function e6(e) {
                return e.nodeType == 3 ? e.nodeValue.length : e.childNodes.length;
            }
            function eU(e) {
                var t = e.pmViewDesc;
                return (t && t.size == 0 && (e.nextSibling || e.nodeName != "BR"));
            }
            function e4(e) {
                var t = e.root.getSelection();
                var r = t.focusNode, n = t.focusOffset;
                if (!r) {
                    return;
                }
                var o, i, a = false;
                if (s.gecko && r.nodeType == 1 && n < e6(r) && eU(r.childNodes[n])) {
                    a = true;
                }
                for(;;){
                    if (n > 0) {
                        if (r.nodeType != 1) {
                            break;
                        } else {
                            var l = r.childNodes[n - 1];
                            if (eU(l)) {
                                o = r;
                                i = --n;
                            } else if (l.nodeType == 3) {
                                r = l;
                                n = r.nodeValue.length;
                            } else {
                                break;
                            }
                        }
                    } else if (eG(r)) {
                        break;
                    } else {
                        var f = r.previousSibling;
                        while(f && eU(f)){
                            o = r.parentNode;
                            i = u(f);
                            f = f.previousSibling;
                        }
                        if (!f) {
                            r = r.parentNode;
                            if (r == e.dom) {
                                break;
                            }
                            n = 0;
                        } else {
                            r = f;
                            n = e6(r);
                        }
                    }
                }
                if (a) {
                    e2(e, t, r, n);
                } else if (o) {
                    e2(e, t, o, i);
                }
            }
            function e7(e) {
                var t = e.root.getSelection();
                var r = t.focusNode, n = t.focusOffset;
                if (!r) {
                    return;
                }
                var o = e6(r);
                var i, s;
                for(;;){
                    if (n < o) {
                        if (r.nodeType != 1) {
                            break;
                        }
                        var a = r.childNodes[n];
                        if (eU(a)) {
                            i = r;
                            s = ++n;
                        } else {
                            break;
                        }
                    } else if (eG(r)) {
                        break;
                    } else {
                        var l = r.nextSibling;
                        while(l && eU(l)){
                            i = l.parentNode;
                            s = u(l) + 1;
                            l = l.nextSibling;
                        }
                        if (!l) {
                            r = r.parentNode;
                            if (r == e.dom) {
                                break;
                            }
                            n = o = 0;
                        } else {
                            r = l;
                            n = 0;
                            o = e6(r);
                        }
                    }
                }
                if (i) {
                    e2(e, t, i, s);
                }
            }
            function eG(e) {
                var t = e.pmViewDesc;
                return t && t.node && t.node.isBlock;
            }
            function e2(e, t, r, n) {
                if (_(t)) {
                    var o = document.createRange();
                    o.setEnd(r, n);
                    o.setStart(r, n);
                    t.removeAllRanges();
                    t.addRange(o);
                } else if (t.extend) {
                    t.extend(r, n);
                }
                e.domObserver.setCurSelection();
                var i = e.state;
                setTimeout(function() {
                    if (e.state == i) {
                        eV(e);
                    }
                }, 50);
            }
            function e5(e, t, r) {
                var o = e.state.selection;
                if ((o instanceof n.TextSelection && !o.empty) || r.indexOf("s") > -1) {
                    return false;
                }
                if (s.mac && r.indexOf("m") > -1) {
                    return false;
                }
                var i = o.$from;
                var a = o.$to;
                if (!i.parent.inlineContent || e.endOfTextblock(t < 0 ? "up" : "down")) {
                    var l = eW(e.state, t);
                    if (l && l instanceof n.NodeSelection) {
                        return eH(e, l);
                    }
                }
                if (!i.parent.inlineContent) {
                    var f = t < 0 ? i : a;
                    var c = o instanceof n.AllSelection ? n.Selection.near(f, t) : n.Selection.findFrom(f, t);
                    return c ? eH(e, c) : false;
                }
                return false;
            }
            function eX(e, t) {
                if (!(e.state.selection instanceof n.TextSelection)) {
                    return true;
                }
                var r = e.state.selection;
                var o = r.$head;
                var i = r.$anchor;
                var s = r.empty;
                if (!o.sameParent(i)) {
                    return true;
                }
                if (!s) {
                    return false;
                }
                if (e.endOfTextblock(t > 0 ? "forward" : "backward")) {
                    return true;
                }
                var a = !o.textOffset && (t < 0 ? o.nodeBefore : o.nodeAfter);
                if (a && !a.isText) {
                    var l = e.state.tr;
                    if (t < 0) {
                        l.delete(o.pos - a.nodeSize, o.pos);
                    } else {
                        l.delete(o.pos, o.pos + a.nodeSize);
                    }
                    e.dispatch(l);
                    return true;
                }
                return false;
            }
            function eY(e, t, r) {
                e.domObserver.stop();
                t.contentEditable = r;
                e.domObserver.start();
            }
            function ej(e) {
                if (!s.safari || e.state.selection.$head.parentOffset > 0) {
                    return;
                }
                var t = e.root.getSelection();
                var r = t.focusNode;
                var n = t.focusOffset;
                if (r && r.nodeType == 1 && n == 0 && r.firstChild && r.firstChild.contentEditable == "false") {
                    var o = r.firstChild;
                    eY(e, o, true);
                    setTimeout(function() {
                        return eY(e, o, false);
                    }, 20);
                }
            }
            function eJ(e) {
                var t = "";
                if (e.ctrlKey) {
                    t += "c";
                }
                if (e.metaKey) {
                    t += "m";
                }
                if (e.altKey) {
                    t += "a";
                }
                if (e.shiftKey) {
                    t += "s";
                }
                return t;
            }
            function eQ(e, t) {
                var r = t.keyCode, n = eJ(t);
                if (r == 8 || (s.mac && r == 72 && n == "c")) {
                    return (eX(e, -1) || e4(e));
                } else if (r == 46 || (s.mac && r == 68 && n == "c")) {
                    return (eX(e, 1) || e7(e));
                } else if (r == 13 || r == 27) {
                    return true;
                } else if (r == 37) {
                    return (e3(e, -1, n) || e4(e));
                } else if (r == 39) {
                    return (e3(e, 1, n) || e7(e));
                } else if (r == 38) {
                    return (e5(e, -1, n) || e4(e));
                } else if (r == 40) {
                    return (ej(e) || e5(e, 1, n) || e7(e));
                } else if (n == (s.mac ? "m" : "c") && (r == 66 || r == 73 || r == 89 || r == 90)) {
                    return true;
                }
                return false;
            }
            function eZ(e, t, r) {
                var n = e.docView.parseRange(t, r);
                var i = n.node;
                var a = n.fromOffset;
                var l = n.toOffset;
                var f = n.from;
                var c = n.to;
                var d = e.root.getSelection(), u = null, h = d.anchorNode;
                if (h && e.dom.contains(h.nodeType == 1 ? h : h.parentNode)) {
                    u = [
                        {
                            node: h,
                            offset: d.anchorOffset
                        }
                    ];
                    if (!_(d)) {
                        u.push({
                            node: d.focusNode,
                            offset: d.focusOffset
                        });
                    }
                }
                if (s.chrome && e.lastKeyCode === 8) {
                    for(var p = l; p > a; p--){
                        var v = i.childNodes[p - 1], m = v.pmViewDesc;
                        if (v.nodeName == "BR" && !m) {
                            l = p;
                            break;
                        }
                        if (!m || m.size) {
                            break;
                        }
                    }
                }
                var g = e.state.doc;
                var y = e.someProp("domParser") || o.DOMParser.fromSchema(e.state.schema);
                var $ = g.resolve(f);
                var b = null, w = y.parse(i, {
                    topNode: $.parent,
                    topMatch: $.parent.contentMatchAt($.index()),
                    topOpen: true,
                    from: a,
                    to: l,
                    preserveWhitespace: $.parent.type.spec.code ? "full" : true,
                    editableContent: true,
                    findPositions: u,
                    ruleFromNode: te,
                    context: $
                });
                if (u && u[0].pos != null) {
                    var S = u[0].pos, D = u[1] && u[1].pos;
                    if (D == null) {
                        D = S;
                    }
                    b = {
                        anchor: S + f,
                        head: D + f
                    };
                }
                return {
                    doc: w,
                    sel: b,
                    from: f,
                    to: c
                };
            }
            function te(e) {
                var t = e.pmViewDesc;
                if (t) {
                    return t.parseRule();
                } else if (e.nodeName == "BR" && e.parentNode) {
                    if (s.safari && /^(ul|ol)$/i.test(e.parentNode.nodeName)) {
                        var r = document.createElement("div");
                        r.appendChild(document.createElement("li"));
                        return {
                            skip: r
                        };
                    } else if (e.parentNode.lastChild == e || (s.safari && /^(tr|table)$/i.test(e.parentNode.nodeName))) {
                        return {
                            ignore: true
                        };
                    }
                } else if (e.nodeName == "IMG" && e.getAttribute("mark-placeholder")) {
                    return {
                        ignore: true
                    };
                }
            }
            function tt(e, t, r, o, i) {
                if (t < 0) {
                    var a = e.lastSelectionTime > Date.now() - 50 ? e.lastSelectionOrigin : null;
                    var l = eP(e, a);
                    if (l && !e.state.selection.eq(l)) {
                        var f = e.state.tr.setSelection(l);
                        if (a == "pointer") {
                            f.setMeta("pointer", true);
                        } else if (a == "key") {
                            f.scrollIntoView();
                        }
                        e.dispatch(f);
                    }
                    return;
                }
                var c = e.state.doc.resolve(t);
                var d = c.sharedDepth(r);
                t = c.before(d + 1);
                r = e.state.doc.resolve(r).after(d + 1);
                var u = e.state.selection;
                var h = eZ(e, t, r);
                if (s.chrome && e.cursorWrapper && h.sel && h.sel.anchor == e.cursorWrapper.deco.from) {
                    var p = e.cursorWrapper.deco.type.toDOM.nextSibling;
                    var v = p && p.nodeValue ? p.nodeValue.length : 1;
                    h.sel = {
                        anchor: h.sel.anchor + v,
                        head: h.sel.anchor + v
                    };
                }
                var m = e.state.doc, g = m.slice(h.from, h.to);
                var y, $;
                if (e.lastKeyCode === 8 && Date.now() - 100 < e.lastKeyCodeTime) {
                    y = e.state.selection.to;
                    $ = "end";
                } else {
                    y = e.state.selection.from;
                    $ = "start";
                }
                e.lastKeyCode = null;
                var b = ts(g.content, h.doc.content, h.from, y, $);
                if (!b) {
                    if (o && u instanceof n.TextSelection && !u.empty && u.$head.sameParent(u.$anchor) && !e.composing && !(h.sel && h.sel.anchor != h.sel.head)) {
                        b = {
                            start: u.from,
                            endA: u.to,
                            endB: u.to
                        };
                    } else if (((s.ios && e.lastIOSEnter > Date.now() - 225) || s.android) && i.some(function(e) {
                        return e.nodeName == "DIV" || e.nodeName == "P";
                    }) && e.someProp("handleKeyDown", function(t) {
                        return t(e, S(13, "Enter"));
                    })) {
                        e.lastIOSEnter = 0;
                        return;
                    } else {
                        if (h.sel) {
                            var w = tr(e, e.state.doc, h.sel);
                            if (w && !w.eq(e.state.selection)) {
                                e.dispatch(e.state.tr.setSelection(w));
                            }
                        }
                        return;
                    }
                }
                e.domChangeCount++;
                if (e.state.selection.from < e.state.selection.to && b.start == b.endB && e.state.selection instanceof n.TextSelection) {
                    if (b.start > e.state.selection.from && b.start <= e.state.selection.from + 2) {
                        b.start = e.state.selection.from;
                    } else if (b.endA < e.state.selection.to && b.endA >= e.state.selection.to - 2) {
                        b.endB += e.state.selection.to - b.endA;
                        b.endA = e.state.selection.to;
                    }
                }
                if (s.ie && s.ie_version <= 11 && b.endB == b.start + 1 && b.endA == b.start && b.start > h.from && h.doc.textBetween(b.start - h.from - 1, b.start - h.from + 1) == " \u00a0") {
                    b.start--;
                    b.endA--;
                    b.endB--;
                }
                var _ = h.doc.resolveNoCache(b.start - h.from);
                var D = h.doc.resolveNoCache(b.endB - h.from);
                var N = _.sameParent(D) && _.parent.inlineContent;
                var O;
                if (((s.ios && e.lastIOSEnter > Date.now() - 225 && (!N || i.some(function(e) {
                    return e.nodeName == "DIV" || e.nodeName == "P";
                }))) || (!N && _.pos < h.doc.content.size && (O = n.Selection.findFrom(h.doc.resolve(_.pos + 1), 1, true)) && O.head == D.pos)) && e.someProp("handleKeyDown", function(t) {
                    return t(e, S(13, "Enter"));
                })) {
                    e.lastIOSEnter = 0;
                    return;
                }
                if (e.state.selection.anchor > b.start && to(m, b.start, b.endA, _, D) && e.someProp("handleKeyDown", function(t) {
                    return t(e, S(8, "Backspace"));
                })) {
                    if (s.android && s.chrome) {
                        e.domObserver.suppressSelectionUpdates();
                    }
                    return;
                }
                if (s.chrome && s.android && b.toB == b.from) {
                    e.lastAndroidDelete = Date.now();
                }
                if (s.android && !N && _.start() != D.start() && D.parentOffset == 0 && _.depth == D.depth && h.sel && h.sel.anchor == h.sel.head && h.sel.head == b.endA) {
                    b.endB -= 2;
                    D = h.doc.resolveNoCache(b.endB - h.from);
                    setTimeout(function() {
                        e.someProp("handleKeyDown", function(t) {
                            return t(e, S(13, "Enter"));
                        });
                    }, 20);
                }
                var C = b.start, k = b.endA;
                var x, M, T, A;
                if (N) {
                    if (_.pos == D.pos) {
                        if (s.ie && s.ie_version <= 11 && _.parentOffset == 0) {
                            e.domObserver.suppressSelectionUpdates();
                            setTimeout(function() {
                                return eV(e);
                            }, 20);
                        }
                        x = e.state.tr.delete(C, k);
                        M = m.resolve(b.start).marksAcross(m.resolve(b.endA));
                    } else if (b.endA == b.endB && (A = m.resolve(b.start)) && (T = tn(_.parent.content.cut(_.parentOffset, D.parentOffset), A.parent.content.cut(A.parentOffset, b.endA - A.start())))) {
                        x = e.state.tr;
                        if (T.type == "add") {
                            x.addMark(C, k, T.mark);
                        } else {
                            x.removeMark(C, k, T.mark);
                        }
                    } else if (_.parent.child(_.index()).isText && _.index() == D.index() - (D.textOffset ? 0 : 1)) {
                        var P = _.parent.textBetween(_.parentOffset, D.parentOffset);
                        if (e.someProp("handleTextInput", function(t) {
                            return t(e, C, k, P);
                        })) {
                            return;
                        }
                        x = e.state.tr.insertText(P, C, k);
                    }
                }
                if (!x) {
                    x = e.state.tr.replace(C, k, h.doc.slice(b.start - h.from, b.endB - h.from));
                }
                if (h.sel) {
                    var E = tr(e, x.doc, h.sel);
                    if (E && !((s.chrome && s.android && e.composing && E.empty && (b.start != b.endB || e.lastAndroidDelete < Date.now() - 100) && (E.head == C || E.head == x.mapping.map(k) - 1)) || (s.ie && E.empty && E.head == C))) {
                        x.setSelection(E);
                    }
                }
                if (M) {
                    x.ensureMarks(M);
                }
                e.dispatch(x.scrollIntoView());
            }
            function tr(e, t, r) {
                if (Math.max(r.anchor, r.head) > t.content.size) {
                    return null;
                }
                return e1(e, t.resolve(r.anchor), t.resolve(r.head));
            }
            function tn(e, t) {
                var r = e.firstChild.marks, n = t.firstChild.marks;
                var i = r, s = n, a, l, f;
                for(var c = 0; c < n.length; c++){
                    i = n[c].removeFromSet(i);
                }
                for(var d = 0; d < r.length; d++){
                    s = r[d].removeFromSet(s);
                }
                if (i.length == 1 && s.length == 0) {
                    l = i[0];
                    a = "add";
                    f = function(e) {
                        return e.mark(l.addToSet(e.marks));
                    };
                } else if (i.length == 0 && s.length == 1) {
                    l = s[0];
                    a = "remove";
                    f = function(e) {
                        return e.mark(l.removeFromSet(e.marks));
                    };
                } else {
                    return null;
                }
                var u = [];
                for(var h = 0; h < t.childCount; h++){
                    u.push(f(t.child(h)));
                }
                if (o.Fragment.from(u).eq(e)) {
                    return {
                        mark: l,
                        type: a
                    };
                }
            }
            function to(e, t, r, n, o) {
                if (!n.parent.isTextblock || r - t <= o.pos - n.pos || ti(n, true, false) < o.pos) {
                    return false;
                }
                var i = e.resolve(t);
                if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock) {
                    return false;
                }
                var s = e.resolve(ti(i, true, true));
                if (!s.parent.isTextblock || s.pos > r || ti(s, true, false) < r) {
                    return false;
                }
                return n.parent.content.cut(n.parentOffset).eq(s.parent.content);
            }
            function ti(e, t, r) {
                var n = e.depth, o = t ? e.end() : e.pos;
                while(n > 0 && (t || e.indexAfter(n) == e.node(n).childCount)){
                    n--;
                    o++;
                    t = false;
                }
                if (r) {
                    var i = e.node(n).maybeChild(e.indexAfter(n));
                    while(i && !i.isLeaf){
                        i = i.firstChild;
                        o++;
                    }
                }
                return o;
            }
            function ts(e, t, r, n, o) {
                var i = e.findDiffStart(t, r);
                if (i == null) {
                    return null;
                }
                var s = e.findDiffEnd(t, r + e.size, r + t.size);
                var a = s.a;
                var l = s.b;
                if (o == "end") {
                    var f = Math.max(0, i - Math.min(a, l));
                    n -= a + f - i;
                }
                if (a < i && e.size < t.size) {
                    var c = n <= i && n >= a ? i - n : 0;
                    i -= c;
                    l = i + (l - a);
                    a = i;
                } else if (l < i) {
                    var d = n <= i && n >= l ? i - n : 0;
                    i -= d;
                    a = i + (a - l);
                    l = i;
                }
                return {
                    start: i,
                    endA: a,
                    endB: l
                };
            }
            function ta(e, t) {
                var r = [];
                var n = t.content;
                var i = t.openStart;
                var s = t.openEnd;
                while(i > 1 && s > 1 && n.childCount == 1 && n.firstChild.childCount == 1){
                    i--;
                    s--;
                    var a = n.firstChild;
                    r.push(a.type.name, a.attrs != a.type.defaultAttrs ? a.attrs : null);
                    n = a.content;
                }
                var l = e.someProp("clipboardSerializer") || o.DOMSerializer.fromSchema(e.state.schema);
                var f = tg(), c = f.createElement("div");
                c.appendChild(l.serializeFragment(n, {
                    document: f
                }));
                var d = c.firstChild, u;
                while(d && d.nodeType == 1 && (u = tv[d.nodeName.toLowerCase()])){
                    for(var h = u.length - 1; h >= 0; h--){
                        var p = f.createElement(u[h]);
                        while(c.firstChild){
                            p.appendChild(c.firstChild);
                        }
                        c.appendChild(p);
                        if (u[h] != "tbody") {
                            i++;
                            s++;
                        }
                    }
                    d = c.firstChild;
                }
                if (d && d.nodeType == 1) {
                    d.setAttribute("data-pm-slice", i + " " + s + " " + JSON.stringify(r));
                }
                var v = e.someProp("clipboardTextSerializer", function(e) {
                    return e(t);
                }) || t.content.textBetween(0, t.content.size, "\n\n");
                return {
                    dom: c,
                    text: v
                };
            }
            function tl(e, t, r, n, i) {
                var a, l = i.parent.type.spec.code, f;
                if (!r && !t) {
                    return null;
                }
                var c = t && (n || l || !r);
                if (c) {
                    e.someProp("transformPastedText", function(e) {
                        t = e(t, l || n);
                    });
                    if (l) {
                        return t ? new o.Slice(o.Fragment.from(e.state.schema.text(t.replace(/\r\n?/g, "\n"))), 0, 0) : o.Slice.empty;
                    }
                    var d = e.someProp("clipboardTextParser", function(e) {
                        return e(t, i, n);
                    });
                    if (d) {
                        f = d;
                    } else {
                        var u = i.marks();
                        var h = e.state;
                        var p = h.schema;
                        var v = o.DOMSerializer.fromSchema(p);
                        a = document.createElement("div");
                        t.split(/(?:\r\n?|\n)+/).forEach(function(e) {
                            var t = a.appendChild(document.createElement("p"));
                            if (e) {
                                t.appendChild(v.serializeNode(p.text(e, u)));
                            }
                        });
                    }
                } else {
                    e.someProp("transformPastedHTML", function(e) {
                        r = e(r);
                    });
                    a = ty(r);
                    if (s.webkit) {
                        t$(a);
                    }
                }
                var m = a && a.querySelector("[data-pm-slice]");
                var g = m && /^(\d+) (\d+) (.*)/.exec(m.getAttribute("data-pm-slice"));
                if (!f) {
                    var y = e.someProp("clipboardParser") || e.someProp("domParser") || o.DOMParser.fromSchema(e.state.schema);
                    f = y.parseSlice(a, {
                        preserveWhitespace: !!(c || g),
                        context: i
                    });
                }
                if (g) {
                    f = tb(tp(f, +g[1], +g[2]), g[3]);
                } else {
                    f = o.Slice.maxOpen(tf(f.content, i), true);
                    if (f.openStart || f.openEnd) {
                        var $ = 0, b = 0;
                        for(var w = f.content.firstChild; $ < f.openStart && !w.type.spec.isolating; $++, w = w.firstChild){}
                        for(var _ = f.content.lastChild; b < f.openEnd && !_.type.spec.isolating; b++, _ = _.lastChild){}
                        f = tp(f, $, b);
                    }
                }
                e.someProp("transformPasted", function(e) {
                    f = e(f);
                });
                return f;
            }
            function tf(e, t) {
                if (e.childCount < 2) {
                    return e;
                }
                var r = function(r) {
                    var n = t.node(r);
                    var i = n.contentMatchAt(t.index(r));
                    var s = void 0, a = [];
                    e.forEach(function(e) {
                        if (!a) {
                            return;
                        }
                        var t = i.findWrapping(e.type), r;
                        if (!t) {
                            return (a = null);
                        }
                        if ((r = a.length && s.length && td(t, s, e, a[a.length - 1], 0))) {
                            a[a.length - 1] = r;
                        } else {
                            if (a.length) {
                                a[a.length - 1] = tu(a[a.length - 1], s.length);
                            }
                            var n = tc(e, t);
                            a.push(n);
                            i = i.matchType(n.type, n.attrs);
                            s = t;
                        }
                    });
                    if (a) {
                        return {
                            v: o.Fragment.from(a)
                        };
                    }
                };
                for(var n = t.depth; n >= 0; n--){
                    var i = r(n);
                    if (i) return i.v;
                }
                return e;
            }
            function tc(e, t, r) {
                if (r === void 0) r = 0;
                for(var n = t.length - 1; n >= r; n--){
                    e = t[n].create(null, o.Fragment.from(e));
                }
                return e;
            }
            function td(e, t, r, n, i) {
                if (i < e.length && i < t.length && e[i] == t[i]) {
                    var s = td(e, t, r, n.lastChild, i + 1);
                    if (s) {
                        return n.copy(n.content.replaceChild(n.childCount - 1, s));
                    }
                    var a = n.contentMatchAt(n.childCount);
                    if (a.matchType(i == e.length - 1 ? r.type : e[i + 1])) {
                        return n.copy(n.content.append(o.Fragment.from(tc(r, e, i + 1))));
                    }
                }
            }
            function tu(e, t) {
                if (t == 0) {
                    return e;
                }
                var r = e.content.replaceChild(e.childCount - 1, tu(e.lastChild, t - 1));
                var n = e.contentMatchAt(e.childCount).fillBefore(o.Fragment.empty, true);
                return e.copy(r.append(n));
            }
            function th(e, t, r, n, i, s) {
                var a = t < 0 ? e.firstChild : e.lastChild, l = a.content;
                if (i < n - 1) {
                    l = th(l, t, r, n, i + 1, s);
                }
                if (i >= r) {
                    l = t < 0 ? a.contentMatchAt(0).fillBefore(l, e.childCount > 1 || s <= i).append(l) : l.append(a.contentMatchAt(a.childCount).fillBefore(o.Fragment.empty, true));
                }
                return e.replaceChild(t < 0 ? 0 : e.childCount - 1, a.copy(l));
            }
            function tp(e, t, r) {
                if (t < e.openStart) {
                    e = new o.Slice(th(e.content, -1, t, e.openStart, 0, e.openEnd), t, e.openEnd);
                }
                if (r < e.openEnd) {
                    e = new o.Slice(th(e.content, 1, r, e.openEnd, 0, 0), e.openStart, r);
                }
                return e;
            }
            var tv = {
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
            var tm = null;
            function tg() {
                return (tm || (tm = document.implementation.createHTMLDocument("title")));
            }
            function ty(e) {
                var t = /^(\s*<meta [^>]*>)*/.exec(e);
                if (t) {
                    e = e.slice(t[0].length);
                }
                var r = tg().createElement("div");
                var n = /<([a-z][^>\s]+)/i.exec(e), o;
                if ((o = n && tv[n[1].toLowerCase()])) {
                    e = o.map(function(e) {
                        return "<" + e + ">";
                    }).join("") + e + o.map(function(e) {
                        return "</" + e + ">";
                    }).reverse().join("");
                }
                r.innerHTML = e;
                if (o) {
                    for(var i = 0; i < o.length; i++){
                        r = r.querySelector(o[i]) || r;
                    }
                }
                return r;
            }
            function t$(e) {
                var t = e.querySelectorAll(s.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
                for(var r = 0; r < t.length; r++){
                    var n = t[r];
                    if (n.childNodes.length == 1 && n.textContent == "\u00a0" && n.parentNode) {
                        n.parentNode.replaceChild(e.ownerDocument.createTextNode(" "), n);
                    }
                }
            }
            function tb(e, t) {
                if (!e.size) {
                    return e;
                }
                var r = e.content.firstChild.type.schema, n;
                try {
                    n = JSON.parse(t);
                } catch (i) {
                    return e;
                }
                var s = e.content;
                var a = e.openStart;
                var l = e.openEnd;
                for(var f = n.length - 2; f >= 0; f -= 2){
                    var c = r.nodes[n[f]];
                    if (!c || c.hasRequiredAttrs()) {
                        break;
                    }
                    s = o.Fragment.from(c.create(n[f + 1], s));
                    a++;
                    l++;
                }
                return new o.Slice(s, a, l);
            }
            var tw = {
                childList: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: true,
                attributeOldValue: true,
                subtree: true
            };
            var t_ = s.ie && s.ie_version <= 11;
            var tS = function e() {
                this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
            };
            tS.prototype.set = function e(t) {
                this.anchorNode = t.anchorNode;
                this.anchorOffset = t.anchorOffset;
                this.focusNode = t.focusNode;
                this.focusOffset = t.focusOffset;
            };
            tS.prototype.eq = function e(t) {
                return (t.anchorNode == this.anchorNode && t.anchorOffset == this.anchorOffset && t.focusNode == this.focusNode && t.focusOffset == this.focusOffset);
            };
            var tD = function e(t, r) {
                var n = this;
                this.view = t;
                this.handleDOMChange = r;
                this.queue = [];
                this.flushingSoon = -1;
                this.observer = window.MutationObserver && new window.MutationObserver(function(e) {
                    for(var t = 0; t < e.length; t++){
                        n.queue.push(e[t]);
                    }
                    if (s.ie && s.ie_version <= 11 && e.some(function(e) {
                        return ((e.type == "childList" && e.removedNodes.length) || (e.type == "characterData" && e.oldValue.length > e.target.nodeValue.length));
                    })) {
                        n.flushSoon();
                    } else {
                        n.flush();
                    }
                });
                this.currentSelection = new tS();
                if (t_) {
                    this.onCharData = function(e) {
                        n.queue.push({
                            target: e.target,
                            type: "characterData",
                            oldValue: e.prevValue
                        });
                        n.flushSoon();
                    };
                }
                this.onSelectionChange = this.onSelectionChange.bind(this);
                this.suppressingSelectionUpdates = false;
            };
            tD.prototype.flushSoon = function e() {
                var t = this;
                if (this.flushingSoon < 0) {
                    this.flushingSoon = window.setTimeout(function() {
                        t.flushingSoon = -1;
                        t.flush();
                    }, 20);
                }
            };
            tD.prototype.forceFlush = function e() {
                if (this.flushingSoon > -1) {
                    window.clearTimeout(this.flushingSoon);
                    this.flushingSoon = -1;
                    this.flush();
                }
            };
            tD.prototype.start = function e() {
                if (this.observer) {
                    this.observer.observe(this.view.dom, tw);
                }
                if (t_) {
                    this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.connectSelection();
            };
            tD.prototype.stop = function e() {
                var t = this;
                if (this.observer) {
                    var r = this.observer.takeRecords();
                    if (r.length) {
                        for(var n = 0; n < r.length; n++){
                            this.queue.push(r[n]);
                        }
                        window.setTimeout(function() {
                            return t.flush();
                        }, 20);
                    }
                    this.observer.disconnect();
                }
                if (t_) {
                    this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.disconnectSelection();
            };
            tD.prototype.connectSelection = function e() {
                this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
            };
            tD.prototype.disconnectSelection = function e() {
                this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
            };
            tD.prototype.suppressSelectionUpdates = function e() {
                var t = this;
                this.suppressingSelectionUpdates = true;
                setTimeout(function() {
                    return (t.suppressingSelectionUpdates = false);
                }, 50);
            };
            tD.prototype.onSelectionChange = function e() {
                if (!eK(this.view)) {
                    return;
                }
                if (this.suppressingSelectionUpdates) {
                    return eV(this.view);
                }
                if (s.ie && s.ie_version <= 11 && !this.view.state.selection.empty) {
                    var t = this.view.root.getSelection();
                    if (t.focusNode && m(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset)) {
                        return this.flushSoon();
                    }
                }
                this.flush();
            };
            tD.prototype.setCurSelection = function e() {
                this.currentSelection.set(this.view.root.getSelection());
            };
            tD.prototype.ignoreSelectionChange = function e(t) {
                if (t.rangeCount == 0) {
                    return true;
                }
                var r = t.getRangeAt(0).commonAncestorContainer;
                var n = this.view.docView.nearestDesc(r);
                if (n && n.ignoreMutation({
                    type: "selection",
                    target: r.nodeType == 3 ? r.parentNode : r
                })) {
                    this.setCurSelection();
                    return true;
                }
            };
            tD.prototype.flush = function e() {
                if (!this.view.docView || this.flushingSoon > -1) {
                    return;
                }
                var t = this.observer ? this.observer.takeRecords() : [];
                if (this.queue.length) {
                    t = this.queue.concat(t);
                    this.queue.length = 0;
                }
                var r = this.view.root.getSelection();
                var n = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && eq(this.view) && !this.ignoreSelectionChange(r);
                var o = -1, i = -1, a = false, l = [];
                if (this.view.editable) {
                    for(var f = 0; f < t.length; f++){
                        var c = this.registerMutation(t[f], l);
                        if (c) {
                            o = o < 0 ? c.from : Math.min(c.from, o);
                            i = i < 0 ? c.to : Math.max(c.to, i);
                            if (c.typeOver) {
                                a = true;
                            }
                        }
                    }
                }
                if (s.gecko && l.length > 1) {
                    var d = l.filter(function(e) {
                        return e.nodeName == "BR";
                    });
                    if (d.length == 2) {
                        var u = d[0];
                        var h = d[1];
                        if (u.parentNode && u.parentNode.parentNode == h.parentNode) {
                            h.remove();
                        } else {
                            u.remove();
                        }
                    }
                }
                if (o > -1 || n) {
                    if (o > -1) {
                        this.view.docView.markDirty(o, i);
                        tO(this.view);
                    }
                    this.handleDOMChange(o, i, a, l);
                    if (this.view.docView.dirty) {
                        this.view.updateState(this.view.state);
                    } else if (!this.currentSelection.eq(r)) {
                        eV(this.view);
                    }
                    this.currentSelection.set(r);
                }
            };
            tD.prototype.registerMutation = function e(t, r) {
                if (r.indexOf(t.target) > -1) {
                    return null;
                }
                var n = this.view.docView.nearestDesc(t.target);
                if (t.type == "attributes" && (n == this.view.docView || t.attributeName == "contenteditable" || (t.attributeName == "style" && !t.oldValue && !t.target.getAttribute("style")))) {
                    return null;
                }
                if (!n || n.ignoreMutation(t)) {
                    return null;
                }
                if (t.type == "childList") {
                    for(var o = 0; o < t.addedNodes.length; o++){
                        r.push(t.addedNodes[o]);
                    }
                    if (n.contentDOM && n.contentDOM != n.dom && !n.contentDOM.contains(t.target)) {
                        return {
                            from: n.posBefore,
                            to: n.posAfter
                        };
                    }
                    var i = t.previousSibling, a = t.nextSibling;
                    if (s.ie && s.ie_version <= 11 && t.addedNodes.length) {
                        for(var l = 0; l < t.addedNodes.length; l++){
                            var f = t.addedNodes[l];
                            var c = f.previousSibling;
                            var d = f.nextSibling;
                            if (!c || Array.prototype.indexOf.call(t.addedNodes, c) < 0) {
                                i = c;
                            }
                            if (!d || Array.prototype.indexOf.call(t.addedNodes, d) < 0) {
                                a = d;
                            }
                        }
                    }
                    var h = i && i.parentNode == t.target ? u(i) + 1 : 0;
                    var p = n.localPosFromDOM(t.target, h, -1);
                    var v = a && a.parentNode == t.target ? u(a) : t.target.childNodes.length;
                    var m = n.localPosFromDOM(t.target, v, 1);
                    return {
                        from: p,
                        to: m
                    };
                } else if (t.type == "attributes") {
                    return {
                        from: n.posAtStart - n.border,
                        to: n.posAtEnd + n.border
                    };
                } else {
                    return {
                        from: n.posAtStart,
                        to: n.posAtEnd,
                        typeOver: t.target.nodeValue == t.oldValue
                    };
                }
            };
            var tN = false;
            function tO(e) {
                if (tN) {
                    return;
                }
                tN = true;
                if (getComputedStyle(e.dom).whiteSpace == "normal") {
                    console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
                }
            }
            var tC = {}, tk = {};
            function tx(e) {
                e.shiftKey = false;
                e.mouseDown = null;
                e.lastKeyCode = null;
                e.lastKeyCodeTime = 0;
                e.lastClick = {
                    time: 0,
                    x: 0,
                    y: 0,
                    type: ""
                };
                e.lastSelectionOrigin = null;
                e.lastSelectionTime = 0;
                e.lastIOSEnter = 0;
                e.lastIOSEnterFallbackTimeout = null;
                e.lastAndroidDelete = 0;
                e.composing = false;
                e.composingTimeout = null;
                e.compositionNodes = [];
                e.compositionEndedAt = -2e8;
                e.domObserver = new tD(e, function(t, r, n, o) {
                    return tt(e, t, r, n, o);
                });
                e.domObserver.start();
                e.domChangeCount = 0;
                e.eventHandlers = Object.create(null);
                var t = function(t) {
                    var r = tC[t];
                    e.dom.addEventListener(t, (e.eventHandlers[t] = function(t) {
                        if (tE(e, t) && !tP(e, t) && (e.editable || !(t.type in tk))) {
                            r(e, t);
                        }
                    }));
                };
                for(var r in tC)t(r);
                if (s.safari) {
                    e.dom.addEventListener("input", function() {
                        return null;
                    });
                }
                tA(e);
            }
            function tM(e, t) {
                e.lastSelectionOrigin = t;
                e.lastSelectionTime = Date.now();
            }
            function tT(e) {
                e.domObserver.stop();
                for(var t in e.eventHandlers){
                    e.dom.removeEventListener(t, e.eventHandlers[t]);
                }
                clearTimeout(e.composingTimeout);
                clearTimeout(e.lastIOSEnterFallbackTimeout);
            }
            function tA(e) {
                e.someProp("handleDOMEvents", function(t) {
                    for(var r in t){
                        if (!e.eventHandlers[r]) {
                            e.dom.addEventListener(r, (e.eventHandlers[r] = function(t) {
                                return tP(e, t);
                            }));
                        }
                    }
                });
            }
            function tP(e, t) {
                return e.someProp("handleDOMEvents", function(r) {
                    var n = r[t.type];
                    return n ? n(e, t) || t.defaultPrevented : false;
                });
            }
            function tE(e, t) {
                if (!t.bubbles) {
                    return true;
                }
                if (t.defaultPrevented) {
                    return false;
                }
                for(var r = t.target; r != e.dom; r = r.parentNode){
                    if (!r || r.nodeType == 11 || (r.pmViewDesc && r.pmViewDesc.stopEvent(t))) {
                        return false;
                    }
                }
                return true;
            }
            function tV(e, t) {
                if (!tP(e, t) && tC[t.type] && (e.editable || !(t.type in tk))) {
                    tC[t.type](e, t);
                }
            }
            tk.keydown = function(e, t) {
                e.shiftKey = t.keyCode == 16 || t.shiftKey;
                if (tH(e, t)) {
                    return;
                }
                if (t.keyCode != 229) {
                    e.domObserver.forceFlush();
                }
                e.lastKeyCode = t.keyCode;
                e.lastKeyCodeTime = Date.now();
                if (s.ios && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
                    var r = Date.now();
                    e.lastIOSEnter = r;
                    e.lastIOSEnterFallbackTimeout = setTimeout(function() {
                        if (e.lastIOSEnter == r) {
                            e.someProp("handleKeyDown", function(t) {
                                return t(e, S(13, "Enter"));
                            });
                            e.lastIOSEnter = 0;
                        }
                    }, 200);
                } else if (e.someProp("handleKeyDown", function(r) {
                    return r(e, t);
                }) || eQ(e, t)) {
                    t.preventDefault();
                } else {
                    tM(e, "key");
                }
            };
            tk.keyup = function(e, t) {
                if (t.keyCode == 16) {
                    e.shiftKey = false;
                }
            };
            tk.keypress = function(e, t) {
                if (tH(e, t) || !t.charCode || (t.ctrlKey && !t.altKey) || (s.mac && t.metaKey)) {
                    return;
                }
                if (e.someProp("handleKeyPress", function(r) {
                    return r(e, t);
                })) {
                    t.preventDefault();
                    return;
                }
                var r = e.state.selection;
                if (!(r instanceof n.TextSelection) || !r.$from.sameParent(r.$to)) {
                    var o = String.fromCharCode(t.charCode);
                    if (!e.someProp("handleTextInput", function(t) {
                        return t(e, r.$from.pos, r.$to.pos, o);
                    })) {
                        e.dispatch(e.state.tr.insertText(o).scrollIntoView());
                    }
                    t.preventDefault();
                }
            };
            function tB(e) {
                return {
                    left: e.clientX,
                    top: e.clientY
                };
            }
            function tR(e, t) {
                var r = t.x - e.clientX, n = t.y - e.clientY;
                return r * r + n * n < 100;
            }
            function tz(e, t, r, n, o) {
                if (n == -1) {
                    return false;
                }
                var i = e.state.doc.resolve(n);
                var s = function(n) {
                    if (e.someProp(t, function(t) {
                        return n > i.depth ? t(e, r, i.nodeAfter, i.before(n), o, true) : t(e, r, i.node(n), i.before(n), o, false);
                    })) {
                        return {
                            v: true
                        };
                    }
                };
                for(var a = i.depth + 1; a > 0; a--){
                    var l = s(a);
                    if (l) return l.v;
                }
                return false;
            }
            function tF(e, t, r) {
                if (!e.focused) {
                    e.focus();
                }
                var n = e.state.tr.setSelection(t);
                if (r == "pointer") {
                    n.setMeta("pointer", true);
                }
                e.dispatch(n);
            }
            function t8(e, t) {
                if (t == -1) {
                    return false;
                }
                var r = e.state.doc.resolve(t), o = r.nodeAfter;
                if (o && o.isAtom && n.NodeSelection.isSelectable(o)) {
                    tF(e, new n.NodeSelection(r), "pointer");
                    return true;
                }
                return false;
            }
            function tI(e, t) {
                if (t == -1) {
                    return false;
                }
                var r = e.state.selection, o, i;
                if (r instanceof n.NodeSelection) {
                    o = r.node;
                }
                var s = e.state.doc.resolve(t);
                for(var a = s.depth + 1; a > 0; a--){
                    var l = a > s.depth ? s.nodeAfter : s.node(a);
                    if (n.NodeSelection.isSelectable(l)) {
                        if (o && r.$from.depth > 0 && a >= r.$from.depth && s.before(r.$from.depth + 1) == r.$from.pos) {
                            i = s.before(r.$from.depth);
                        } else {
                            i = s.before(a);
                        }
                        break;
                    }
                }
                if (i != null) {
                    tF(e, n.NodeSelection.create(e.state.doc, i), "pointer");
                    return true;
                } else {
                    return false;
                }
            }
            function tL(e, t, r, n, o) {
                return (tz(e, "handleClickOn", t, r, n) || e.someProp("handleClick", function(r) {
                    return r(e, t, n);
                }) || (o ? tI(e, r) : t8(e, r)));
            }
            function t0(e, t, r, n) {
                return (tz(e, "handleDoubleClickOn", t, r, n) || e.someProp("handleDoubleClick", function(r) {
                    return r(e, t, n);
                }));
            }
            function t1(e, t, r, n) {
                return (tz(e, "handleTripleClickOn", t, r, n) || e.someProp("handleTripleClick", function(r) {
                    return r(e, t, n);
                }) || tK(e, r, n));
            }
            function tK(e, t, r) {
                if (r.button != 0) {
                    return false;
                }
                var o = e.state.doc;
                if (t == -1) {
                    if (o.inlineContent) {
                        tF(e, n.TextSelection.create(o, 0, o.content.size), "pointer");
                        return true;
                    }
                    return false;
                }
                var i = o.resolve(t);
                for(var s = i.depth + 1; s > 0; s--){
                    var a = s > i.depth ? i.nodeAfter : i.node(s);
                    var l = i.before(s);
                    if (a.inlineContent) {
                        tF(e, n.TextSelection.create(o, l + 1, l + 1 + a.content.size), "pointer");
                    } else if (n.NodeSelection.isSelectable(a)) {
                        tF(e, n.NodeSelection.create(o, l), "pointer");
                    } else {
                        continue;
                    }
                    return true;
                }
            }
            function tq(e) {
                return t7(e);
            }
            var t9 = s.mac ? "metaKey" : "ctrlKey";
            tC.mousedown = function(e, t) {
                e.shiftKey = t.shiftKey;
                var r = tq(e);
                var n = Date.now(), o = "singleClick";
                if (n - e.lastClick.time < 500 && tR(t, e.lastClick) && !t[t9]) {
                    if (e.lastClick.type == "singleClick") {
                        o = "doubleClick";
                    } else if (e.lastClick.type == "doubleClick") {
                        o = "tripleClick";
                    }
                }
                e.lastClick = {
                    time: n,
                    x: t.clientX,
                    y: t.clientY,
                    type: o
                };
                var i = e.posAtCoords(tB(t));
                if (!i) {
                    return;
                }
                if (o == "singleClick") {
                    if (e.mouseDown) {
                        e.mouseDown.done();
                    }
                    e.mouseDown = new tW(e, i, t, r);
                } else if ((o == "doubleClick" ? t0 : t1)(e, i.pos, i.inside, t)) {
                    t.preventDefault();
                } else {
                    tM(e, "pointer");
                }
            };
            var tW = function e(t, r, o, i) {
                var a = this;
                this.view = t;
                this.startDoc = t.state.doc;
                this.pos = r;
                this.event = o;
                this.flushed = i;
                this.selectNode = o[t9];
                this.allowDefault = o.shiftKey;
                this.delayedSelectionSync = false;
                var l, f;
                if (r.inside > -1) {
                    l = t.state.doc.nodeAt(r.inside);
                    f = r.inside;
                } else {
                    var c = t.state.doc.resolve(r.pos);
                    l = c.parent;
                    f = c.depth ? c.before() : 0;
                }
                this.mightDrag = null;
                var d = i ? null : o.target;
                var u = d ? t.docView.nearestDesc(d, true) : null;
                this.target = u ? u.dom : null;
                var h = t.state;
                var p = h.selection;
                if ((o.button == 0 && l.type.spec.draggable && l.type.spec.selectable !== false) || (p instanceof n.NodeSelection && p.from <= f && p.to > f)) {
                    this.mightDrag = {
                        node: l,
                        pos: f,
                        addAttr: this.target && !this.target.draggable,
                        setUneditable: this.target && s.gecko && !this.target.hasAttribute("contentEditable")
                    };
                }
                if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.draggable = true;
                    }
                    if (this.mightDrag.setUneditable) {
                        setTimeout(function() {
                            if (a.view.mouseDown == a) {
                                a.target.setAttribute("contentEditable", "false");
                            }
                        }, 20);
                    }
                    this.view.domObserver.start();
                }
                t.root.addEventListener("mouseup", (this.up = this.up.bind(this)));
                t.root.addEventListener("mousemove", (this.move = this.move.bind(this)));
                tM(t, "pointer");
            };
            tW.prototype.done = function e() {
                var t = this;
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
                        return eV(t.view);
                    });
                }
                this.view.mouseDown = null;
            };
            tW.prototype.up = function e(t) {
                this.done();
                if (!this.view.dom.contains(t.target.nodeType == 3 ? t.target.parentNode : t.target)) {
                    return;
                }
                var r = this.pos;
                if (this.view.state.doc != this.startDoc) {
                    r = this.view.posAtCoords(tB(t));
                }
                if (this.allowDefault || !r) {
                    tM(this.view, "pointer");
                } else if (tL(this.view, r.pos, r.inside, t, this.selectNode)) {
                    t.preventDefault();
                } else if (t.button == 0 && (this.flushed || (s.safari && this.mightDrag && !this.mightDrag.node.isAtom) || (s.chrome && !(this.view.state.selection instanceof n.TextSelection) && Math.min(Math.abs(r.pos - this.view.state.selection.from), Math.abs(r.pos - this.view.state.selection.to)) <= 2))) {
                    tF(this.view, n.Selection.near(this.view.state.doc.resolve(r.pos)), "pointer");
                    t.preventDefault();
                } else {
                    tM(this.view, "pointer");
                }
            };
            tW.prototype.move = function e(t) {
                if (!this.allowDefault && (Math.abs(this.event.x - t.clientX) > 4 || Math.abs(this.event.y - t.clientY) > 4)) {
                    this.allowDefault = true;
                }
                tM(this.view, "pointer");
                if (t.buttons == 0) {
                    this.done();
                }
            };
            tC.touchdown = function(e) {
                tq(e);
                tM(e, "pointer");
            };
            tC.contextmenu = function(e) {
                return tq(e);
            };
            function tH(e, t) {
                if (e.composing) {
                    return true;
                }
                if (s.safari && Math.abs(t.timeStamp - e.compositionEndedAt) < 500) {
                    e.compositionEndedAt = -2e8;
                    return true;
                }
                return false;
            }
            var t3 = s.android ? 5000 : -1;
            tk.compositionstart = tk.compositionupdate = function(e) {
                if (!e.composing) {
                    e.domObserver.flush();
                    var t = e.state;
                    var r = t.selection.$from;
                    if (t.selection.empty && (t.storedMarks || (!r.textOffset && r.parentOffset && r.nodeBefore.marks.some(function(e) {
                        return e.type.spec.inclusive === false;
                    })))) {
                        e.markCursor = e.state.storedMarks || r.marks();
                        t7(e, true);
                        e.markCursor = null;
                    } else {
                        t7(e);
                        if (s.gecko && t.selection.empty && r.parentOffset && !r.textOffset && r.nodeBefore.marks.length) {
                            var n = e.root.getSelection();
                            for(var o = n.focusNode, i = n.focusOffset; o && o.nodeType == 1 && i != 0;){
                                var a = i < 0 ? o.lastChild : o.childNodes[i - 1];
                                if (!a) {
                                    break;
                                }
                                if (a.nodeType == 3) {
                                    n.collapse(a, a.nodeValue.length);
                                    break;
                                } else {
                                    o = a;
                                    i = -1;
                                }
                            }
                        }
                    }
                    e.composing = true;
                }
                t6(e, t3);
            };
            tk.compositionend = function(e, t) {
                if (e.composing) {
                    e.composing = false;
                    e.compositionEndedAt = t.timeStamp;
                    t6(e, 20);
                }
            };
            function t6(e, t) {
                clearTimeout(e.composingTimeout);
                if (t > -1) {
                    e.composingTimeout = setTimeout(function() {
                        return t7(e);
                    }, t);
                }
            }
            function tU(e) {
                if (e.composing) {
                    e.composing = false;
                    e.compositionEndedAt = t4();
                }
                while(e.compositionNodes.length > 0){
                    e.compositionNodes.pop().markParentsDirty();
                }
            }
            function t4() {
                var e = document.createEvent("Event");
                e.initEvent("event", true, true);
                return e.timeStamp;
            }
            function t7(e, t) {
                e.domObserver.forceFlush();
                tU(e);
                if (t || e.docView.dirty) {
                    var r = eP(e);
                    if (r && !r.eq(e.state.selection)) {
                        e.dispatch(e.state.tr.setSelection(r));
                    } else {
                        e.updateState(e.state);
                    }
                    return true;
                }
                return false;
            }
            function tG(e, t) {
                if (!e.dom.parentNode) {
                    return;
                }
                var r = e.dom.parentNode.appendChild(document.createElement("div"));
                r.appendChild(t);
                r.style.cssText = "position: fixed; left: -10000px; top: 10px";
                var n = getSelection(), o = document.createRange();
                o.selectNodeContents(t);
                e.dom.blur();
                n.removeAllRanges();
                n.addRange(o);
                setTimeout(function() {
                    if (r.parentNode) {
                        r.parentNode.removeChild(r);
                    }
                    e.focus();
                }, 50);
            }
            var t2 = (s.ie && s.ie_version < 15) || (s.ios && s.webkit_version < 604);
            tC.copy = tk.cut = function(e, t) {
                var r = e.state.selection, n = t.type == "cut";
                if (r.empty) {
                    return;
                }
                var o = t2 ? null : t.clipboardData;
                var i = r.content();
                var s = ta(e, i);
                var a = s.dom;
                var l = s.text;
                if (o) {
                    t.preventDefault();
                    o.clearData();
                    o.setData("text/html", a.innerHTML);
                    o.setData("text/plain", l);
                } else {
                    tG(e, a);
                }
                if (n) {
                    e.dispatch(e.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
                }
            };
            function t5(e) {
                return e.openStart == 0 && e.openEnd == 0 && e.content.childCount == 1 ? e.content.firstChild : null;
            }
            function tX(e, t) {
                if (!e.dom.parentNode) {
                    return;
                }
                var r = e.shiftKey || e.state.selection.$from.parent.type.spec.code;
                var n = e.dom.parentNode.appendChild(document.createElement(r ? "textarea" : "div"));
                if (!r) {
                    n.contentEditable = "true";
                }
                n.style.cssText = "position: fixed; left: -10000px; top: 10px";
                n.focus();
                setTimeout(function() {
                    e.focus();
                    if (n.parentNode) {
                        n.parentNode.removeChild(n);
                    }
                    if (r) {
                        tY(e, n.value, null, t);
                    } else {
                        tY(e, n.textContent, n.innerHTML, t);
                    }
                }, 50);
            }
            function tY(e, t, r, n) {
                var i = tl(e, t, r, e.shiftKey, e.state.selection.$from);
                if (e.someProp("handlePaste", function(t) {
                    return t(e, n, i || o.Slice.empty);
                })) {
                    return true;
                }
                if (!i) {
                    return false;
                }
                var s = t5(i);
                var a = s ? e.state.tr.replaceSelectionWith(s, e.shiftKey) : e.state.tr.replaceSelection(i);
                e.dispatch(a.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
                return true;
            }
            tk.paste = function(e, t) {
                var r = t2 ? null : t.clipboardData;
                if (r && tY(e, r.getData("text/plain"), r.getData("text/html"), t)) {
                    t.preventDefault();
                } else {
                    tX(e, t);
                }
            };
            var tj = function e(t, r) {
                this.slice = t;
                this.move = r;
            };
            var tJ = s.mac ? "altKey" : "ctrlKey";
            tC.dragstart = function(e, t) {
                var r = e.mouseDown;
                if (r) {
                    r.done();
                }
                if (!t.dataTransfer) {
                    return;
                }
                var o = e.state.selection;
                var i = o.empty ? null : e.posAtCoords(tB(t));
                if (i && i.pos >= o.from && i.pos <= (o instanceof n.NodeSelection ? o.to - 1 : o.to)) ;
                else if (r && r.mightDrag) {
                    e.dispatch(e.state.tr.setSelection(n.NodeSelection.create(e.state.doc, r.mightDrag.pos)));
                } else if (t.target && t.target.nodeType == 1) {
                    var s = e.docView.nearestDesc(t.target, true);
                    if (s && s.node.type.spec.draggable && s != e.docView) {
                        e.dispatch(e.state.tr.setSelection(n.NodeSelection.create(e.state.doc, s.posBefore)));
                    }
                }
                var a = e.state.selection.content();
                var l = ta(e, a);
                var f = l.dom;
                var c = l.text;
                t.dataTransfer.clearData();
                t.dataTransfer.setData(t2 ? "Text" : "text/html", f.innerHTML);
                t.dataTransfer.effectAllowed = "copyMove";
                if (!t2) {
                    t.dataTransfer.setData("text/plain", c);
                }
                e.dragging = new tj(a, !t[tJ]);
            };
            tC.dragend = function(e) {
                var t = e.dragging;
                window.setTimeout(function() {
                    if (e.dragging == t) {
                        e.dragging = null;
                    }
                }, 50);
            };
            tk.dragover = tk.dragenter = function(e, t) {
                return t.preventDefault();
            };
            tk.drop = function(e, t) {
                var r = e.dragging;
                e.dragging = null;
                if (!t.dataTransfer) {
                    return;
                }
                var s = e.posAtCoords(tB(t));
                if (!s) {
                    return;
                }
                var a = e.state.doc.resolve(s.pos);
                if (!a) {
                    return;
                }
                var l = r && r.slice;
                if (l) {
                    e.someProp("transformPasted", function(e) {
                        l = e(l);
                    });
                } else {
                    l = tl(e, t.dataTransfer.getData(t2 ? "Text" : "text/plain"), t2 ? null : t.dataTransfer.getData("text/html"), false, a);
                }
                var f = r && !t[tJ];
                if (e.someProp("handleDrop", function(r) {
                    return r(e, t, l || o.Slice.empty, f);
                })) {
                    t.preventDefault();
                    return;
                }
                if (!l) {
                    return;
                }
                t.preventDefault();
                var c = l ? (0, i.nj)(e.state.doc, a.pos, l) : a.pos;
                if (c == null) {
                    c = a.pos;
                }
                var d = e.state.tr;
                if (f) {
                    d.deleteSelection();
                }
                var u = d.mapping.map(c);
                var h = l.openStart == 0 && l.openEnd == 0 && l.content.childCount == 1;
                var p = d.doc;
                if (h) {
                    d.replaceRangeWith(u, u, l.content.firstChild);
                } else {
                    d.replaceRange(u, u, l);
                }
                if (d.doc.eq(p)) {
                    return;
                }
                var v = d.doc.resolve(u);
                if (h && n.NodeSelection.isSelectable(l.content.firstChild) && v.nodeAfter && v.nodeAfter.sameMarkup(l.content.firstChild)) {
                    d.setSelection(new n.NodeSelection(v));
                } else {
                    var m = d.mapping.map(c);
                    d.mapping.maps[d.mapping.maps.length - 1].forEach(function(e, t, r, n) {
                        return (m = n);
                    });
                    d.setSelection(e1(e, v, d.doc.resolve(m)));
                }
                e.focus();
                e.dispatch(d.setMeta("uiEvent", "drop"));
            };
            tC.focus = function(e) {
                if (!e.focused) {
                    e.domObserver.stop();
                    e.dom.classList.add("ProseMirror-focused");
                    e.domObserver.start();
                    e.focused = true;
                    setTimeout(function() {
                        if (e.docView && e.hasFocus() && !e.domObserver.currentSelection.eq(e.root.getSelection())) {
                            eV(e);
                        }
                    }, 20);
                }
            };
            tC.blur = function(e, t) {
                if (e.focused) {
                    e.domObserver.stop();
                    e.dom.classList.remove("ProseMirror-focused");
                    e.domObserver.start();
                    if (t.relatedTarget && e.dom.contains(t.relatedTarget)) {
                        e.domObserver.currentSelection.set({});
                    }
                    e.focused = false;
                }
            };
            tC.beforeinput = function(e, t) {
                if (s.chrome && s.android && t.inputType == "deleteContentBackward") {
                    var r = e.domChangeCount;
                    setTimeout(function() {
                        if (e.domChangeCount != r) {
                            return;
                        }
                        e.dom.blur();
                        e.focus();
                        if (e.someProp("handleKeyDown", function(t) {
                            return t(e, S(8, "Backspace"));
                        })) {
                            return;
                        }
                        var t = e.state.selection;
                        var n = t.$cursor;
                        if (n && n.pos > 0) {
                            e.dispatch(e.state.tr.delete(n.pos - 1, n.pos).scrollIntoView());
                        }
                    }, 50);
                }
            };
            for(var tQ in tk){
                tC[tQ] = tk[tQ];
            }
            function tZ(e, t) {
                if (e == t) {
                    return true;
                }
                for(var r in e){
                    if (e[r] !== t[r]) {
                        return false;
                    }
                }
                for(var n in t){
                    if (!(n in e)) {
                        return false;
                    }
                }
                return true;
            }
            var re = function e(t, r) {
                this.spec = r || rs;
                this.side = this.spec.side || 0;
                this.toDOM = t;
            };
            re.prototype.map = function e(t, r, n, o) {
                var i = t.mapResult(r.from + o, this.side < 0 ? -1 : 1);
                var s = i.pos;
                var a = i.deleted;
                return a ? null : new rn(s - n, s - n, this);
            };
            re.prototype.valid = function e() {
                return true;
            };
            re.prototype.eq = function e(t) {
                return (this == t || (t instanceof re && ((this.spec.key && this.spec.key == t.spec.key) || (this.toDOM == t.toDOM && tZ(this.spec, t.spec)))));
            };
            var rt = function e(t, r) {
                this.spec = r || rs;
                this.attrs = t;
            };
            rt.prototype.map = function e(t, r, n, o) {
                var i = t.map(r.from + o, this.spec.inclusiveStart ? -1 : 1) - n;
                var s = t.map(r.to + o, this.spec.inclusiveEnd ? 1 : -1) - n;
                return i >= s ? null : new rn(i, s, this);
            };
            rt.prototype.valid = function e(t, r) {
                return r.from < r.to;
            };
            rt.prototype.eq = function e(t) {
                return (this == t || (t instanceof rt && tZ(this.attrs, t.attrs) && tZ(this.spec, t.spec)));
            };
            rt.is = function e(t) {
                return t.type instanceof rt;
            };
            var rr = function e(t, r) {
                this.spec = r || rs;
                this.attrs = t;
            };
            rr.prototype.map = function e(t, r, n, o) {
                var i = t.mapResult(r.from + o, 1);
                if (i.deleted) {
                    return null;
                }
                var s = t.mapResult(r.to + o, -1);
                if (s.deleted || s.pos <= i.pos) {
                    return null;
                }
                return new rn(i.pos - n, s.pos - n, this);
            };
            rr.prototype.valid = function e(t, r) {
                var n = t.content.findIndex(r.from);
                var o = n.index;
                var i = n.offset;
                var s;
                return (i == r.from && !(s = t.child(o)).isText && i + s.nodeSize == r.to);
            };
            rr.prototype.eq = function e(t) {
                return (this == t || (t instanceof rr && tZ(this.attrs, t.attrs) && tZ(this.spec, t.spec)));
            };
            var rn = function e(t, r, n) {
                this.from = t;
                this.to = r;
                this.type = n;
            };
            var ro = {
                spec: {
                    configurable: true
                },
                inline: {
                    configurable: true
                }
            };
            rn.prototype.copy = function e(t, r) {
                return new rn(t, r, this.type);
            };
            rn.prototype.eq = function e(t, r) {
                if (r === void 0) r = 0;
                return (this.type.eq(t.type) && this.from + r == t.from && this.to + r == t.to);
            };
            rn.prototype.map = function e(t, r, n) {
                return this.type.map(t, this, r, n);
            };
            rn.widget = function e(t, r, n) {
                return new rn(t, t, new re(r, n));
            };
            rn.inline = function e(t, r, n, o) {
                return new rn(t, r, new rt(n, o));
            };
            rn.node = function e(t, r, n, o) {
                return new rn(t, r, new rr(n, o));
            };
            ro.spec.get = function() {
                return this.type.spec;
            };
            ro.inline.get = function() {
                return this.type instanceof rt;
            };
            Object.defineProperties(rn.prototype, ro);
            var ri = [], rs = {};
            var ra = function e(t, r) {
                this.local = t && t.length ? t : ri;
                this.children = r && r.length ? r : ri;
            };
            ra.create = function e(t, r) {
                return r.length ? rv(r, t, 0, rs) : rl;
            };
            ra.prototype.find = function e(t, r, n) {
                var o = [];
                this.findInner(t == null ? 0 : t, r == null ? 1e9 : r, o, 0, n);
                return o;
            };
            ra.prototype.findInner = function e(t, r, n, o, i) {
                for(var s = 0; s < this.local.length; s++){
                    var a = this.local[s];
                    if (a.from <= r && a.to >= t && (!i || i(a.spec))) {
                        n.push(a.copy(a.from + o, a.to + o));
                    }
                }
                for(var l = 0; l < this.children.length; l += 3){
                    if (this.children[l] < r && this.children[l + 1] > t) {
                        var f = this.children[l] + 1;
                        this.children[l + 2].findInner(t - f, r - f, n, o + f, i);
                    }
                }
            };
            ra.prototype.map = function e(t, r, n) {
                if (this == rl || t.maps.length == 0) {
                    return this;
                }
                return this.mapInner(t, r, 0, 0, n || rs);
            };
            ra.prototype.mapInner = function e(t, r, n, o, i) {
                var s;
                for(var a = 0; a < this.local.length; a++){
                    var l = this.local[a].map(t, n, o);
                    if (l && l.type.valid(r, l)) {
                        (s || (s = [])).push(l);
                    } else if (i.onRemove) {
                        i.onRemove(this.local[a].spec);
                    }
                }
                if (this.children.length) {
                    return rc(this.children, s, t, r, n, o, i);
                } else {
                    return s ? new ra(s.sort(rm)) : rl;
                }
            };
            ra.prototype.add = function e(t, r) {
                if (!r.length) {
                    return this;
                }
                if (this == rl) {
                    return ra.create(t, r);
                }
                return this.addInner(t, r, 0);
            };
            ra.prototype.addInner = function e(t, r, n) {
                var o = this;
                var i, s = 0;
                t.forEach(function(e, t) {
                    var a = t + n, l;
                    if (!(l = rh(r, e, a))) {
                        return;
                    }
                    if (!i) {
                        i = o.children.slice();
                    }
                    while(s < i.length && i[s] < t){
                        s += 3;
                    }
                    if (i[s] == t) {
                        i[s + 2] = i[s + 2].addInner(e, l, a + 1);
                    } else {
                        i.splice(s, 0, t, t + e.nodeSize, rv(l, e, a + 1, rs));
                    }
                    s += 3;
                });
                var a = rd(s ? rp(r) : r, -n);
                for(var l = 0; l < a.length; l++){
                    if (!a[l].type.valid(t, a[l])) {
                        a.splice(l--, 1);
                    }
                }
                return new ra(a.length ? this.local.concat(a).sort(rm) : this.local, i || this.children);
            };
            ra.prototype.remove = function e(t) {
                if (t.length == 0 || this == rl) {
                    return this;
                }
                return this.removeInner(t, 0);
            };
            ra.prototype.removeInner = function e(t, r) {
                var n = this.children, o = this.local;
                for(var i = 0; i < n.length; i += 3){
                    var s = void 0, a = n[i] + r, l = n[i + 1] + r;
                    for(var f = 0, c = void 0; f < t.length; f++){
                        if ((c = t[f])) {
                            if (c.from > a && c.to < l) {
                                t[f] = null;
                                (s || (s = [])).push(c);
                            }
                        }
                    }
                    if (!s) {
                        continue;
                    }
                    if (n == this.children) {
                        n = this.children.slice();
                    }
                    var d = n[i + 2].removeInner(s, a + 1);
                    if (d != rl) {
                        n[i + 2] = d;
                    } else {
                        n.splice(i, 3);
                        i -= 3;
                    }
                }
                if (o.length) {
                    for(var u = 0, h = void 0; u < t.length; u++){
                        if ((h = t[u])) {
                            for(var p = 0; p < o.length; p++){
                                if (o[p].eq(h, r)) {
                                    if (o == this.local) {
                                        o = this.local.slice();
                                    }
                                    o.splice(p--, 1);
                                }
                            }
                        }
                    }
                }
                if (n == this.children && o == this.local) {
                    return this;
                }
                return o.length || n.length ? new ra(o, n) : rl;
            };
            ra.prototype.forChild = function e(t, r) {
                if (this == rl) {
                    return this;
                }
                if (r.isLeaf) {
                    return ra.empty;
                }
                var n, o;
                for(var i = 0; i < this.children.length; i += 3){
                    if (this.children[i] >= t) {
                        if (this.children[i] == t) {
                            n = this.children[i + 2];
                        }
                        break;
                    }
                }
                var s = t + 1, a = s + r.content.size;
                for(var l = 0; l < this.local.length; l++){
                    var f = this.local[l];
                    if (f.from < a && f.to > s && f.type instanceof rt) {
                        var c = Math.max(s, f.from) - s, d = Math.min(a, f.to) - s;
                        if (c < d) {
                            (o || (o = [])).push(f.copy(c, d));
                        }
                    }
                }
                if (o) {
                    var u = new ra(o.sort(rm));
                    return n ? new rf([
                        u,
                        n
                    ]) : u;
                }
                return n || rl;
            };
            ra.prototype.eq = function e(t) {
                if (this == t) {
                    return true;
                }
                if (!(t instanceof ra) || this.local.length != t.local.length || this.children.length != t.children.length) {
                    return false;
                }
                for(var r = 0; r < this.local.length; r++){
                    if (!this.local[r].eq(t.local[r])) {
                        return false;
                    }
                }
                for(var n = 0; n < this.children.length; n += 3){
                    if (this.children[n] != t.children[n] || this.children[n + 1] != t.children[n + 1] || !this.children[n + 2].eq(t.children[n + 2])) {
                        return false;
                    }
                }
                return true;
            };
            ra.prototype.locals = function e(t) {
                return rg(this.localsInner(t));
            };
            ra.prototype.localsInner = function e(t) {
                if (this == rl) {
                    return ri;
                }
                if (t.inlineContent || !this.local.some(rt.is)) {
                    return this.local;
                }
                var r = [];
                for(var n = 0; n < this.local.length; n++){
                    if (!(this.local[n].type instanceof rt)) {
                        r.push(this.local[n]);
                    }
                }
                return r;
            };
            var rl = new ra();
            ra.empty = rl;
            ra.removeOverlap = rg;
            var rf = function e(t) {
                this.members = t;
            };
            rf.prototype.map = function e(t, r) {
                var n = this.members.map(function(e) {
                    return e.map(t, r, rs);
                });
                return rf.from(n);
            };
            rf.prototype.forChild = function e(t, r) {
                if (r.isLeaf) {
                    return ra.empty;
                }
                var n = [];
                for(var o = 0; o < this.members.length; o++){
                    var i = this.members[o].forChild(t, r);
                    if (i == rl) {
                        continue;
                    }
                    if (i instanceof rf) {
                        n = n.concat(i.members);
                    } else {
                        n.push(i);
                    }
                }
                return rf.from(n);
            };
            rf.prototype.eq = function e(t) {
                if (!(t instanceof rf) || t.members.length != this.members.length) {
                    return false;
                }
                for(var r = 0; r < this.members.length; r++){
                    if (!this.members[r].eq(t.members[r])) {
                        return false;
                    }
                }
                return true;
            };
            rf.prototype.locals = function e(t) {
                var r, n = true;
                for(var o = 0; o < this.members.length; o++){
                    var e = this.members[o].localsInner(t);
                    if (!e.length) {
                        continue;
                    }
                    if (!r) {
                        r = e;
                    } else {
                        if (n) {
                            r = r.slice();
                            n = false;
                        }
                        for(var i = 0; i < e.length; i++){
                            r.push(e[i]);
                        }
                    }
                }
                return r ? rg(n ? r : r.sort(rm)) : ri;
            };
            rf.from = function e(t) {
                switch(t.length){
                    case 0:
                        return rl;
                    case 1:
                        return t[0];
                    default:
                        return new rf(t);
                }
            };
            function rc(e, t, r, n, o, i, s) {
                var a = e.slice();
                var l = function(e, t, r, n) {
                    for(var s = 0; s < a.length; s += 3){
                        var l = a[s + 1], f = void 0;
                        if (l == -1 || e > l + i) {
                            continue;
                        }
                        if (t >= a[s] + i) {
                            a[s + 1] = -1;
                        } else if (r >= o && (f = n - r - (t - e))) {
                            a[s] += f;
                            a[s + 1] += f;
                        }
                    }
                };
                for(var f = 0; f < r.maps.length; f++){
                    r.maps[f].forEach(l);
                }
                var c = false;
                for(var d = 0; d < a.length; d += 3){
                    if (a[d + 1] == -1) {
                        var u = r.map(e[d] + i), h = u - o;
                        if (h < 0 || h >= n.content.size) {
                            c = true;
                            continue;
                        }
                        var p = r.map(e[d + 1] + i, -1), v = p - o;
                        var m = n.content.findIndex(h);
                        var g = m.index;
                        var y = m.offset;
                        var $ = n.maybeChild(g);
                        if ($ && y == h && y + $.nodeSize == v) {
                            var b = a[d + 2].mapInner(r, $, u + 1, e[d] + i + 1, s);
                            if (b != rl) {
                                a[d] = h;
                                a[d + 1] = v;
                                a[d + 2] = b;
                            } else {
                                a[d + 1] = -2;
                                c = true;
                            }
                        } else {
                            c = true;
                        }
                    }
                }
                if (c) {
                    var w = ru(a, e, t || [], r, o, i, s);
                    var _ = rv(w, n, 0, s);
                    t = _.local;
                    for(var S = 0; S < a.length; S += 3){
                        if (a[S + 1] < 0) {
                            a.splice(S, 3);
                            S -= 3;
                        }
                    }
                    for(var D = 0, N = 0; D < _.children.length; D += 3){
                        var O = _.children[D];
                        while(N < a.length && a[N] < O){
                            N += 3;
                        }
                        a.splice(N, 0, _.children[D], _.children[D + 1], _.children[D + 2]);
                    }
                }
                return new ra(t && t.sort(rm), a);
            }
            function rd(e, t) {
                if (!t || !e.length) {
                    return e;
                }
                var r = [];
                for(var n = 0; n < e.length; n++){
                    var o = e[n];
                    r.push(new rn(o.from + t, o.to + t, o.type));
                }
                return r;
            }
            function ru(e, t, r, n, o, i, s) {
                function a(e, t) {
                    for(var i = 0; i < e.local.length; i++){
                        var l = e.local[i].map(n, o, t);
                        if (l) {
                            r.push(l);
                        } else if (s.onRemove) {
                            s.onRemove(e.local[i].spec);
                        }
                    }
                    for(var f = 0; f < e.children.length; f += 3){
                        a(e.children[f + 2], e.children[f] + t + 1);
                    }
                }
                for(var l = 0; l < e.length; l += 3){
                    if (e[l + 1] == -1) {
                        a(e[l + 2], t[l] + i + 1);
                    }
                }
                return r;
            }
            function rh(e, t, r) {
                if (t.isLeaf) {
                    return null;
                }
                var n = r + t.nodeSize, o = null;
                for(var i = 0, s = void 0; i < e.length; i++){
                    if ((s = e[i]) && s.from > r && s.to < n) {
                        (o || (o = [])).push(s);
                        e[i] = null;
                    }
                }
                return o;
            }
            function rp(e) {
                var t = [];
                for(var r = 0; r < e.length; r++){
                    if (e[r] != null) {
                        t.push(e[r]);
                    }
                }
                return t;
            }
            function rv(e, t, r, n) {
                var o = [], i = false;
                t.forEach(function(t, s) {
                    var a = rh(e, t, s + r);
                    if (a) {
                        i = true;
                        var l = rv(a, t, r + s + 1, n);
                        if (l != rl) {
                            o.push(s, s + t.nodeSize, l);
                        }
                    }
                });
                var s = rd(i ? rp(e) : e, -r).sort(rm);
                for(var a = 0; a < s.length; a++){
                    if (!s[a].type.valid(t, s[a])) {
                        if (n.onRemove) {
                            n.onRemove(s[a].spec);
                        }
                        s.splice(a--, 1);
                    }
                }
                return s.length || o.length ? new ra(s, o) : rl;
            }
            function rm(e, t) {
                return e.from - t.from || e.to - t.to;
            }
            function rg(e) {
                var t = e;
                for(var r = 0; r < t.length - 1; r++){
                    var n = t[r];
                    if (n.from != n.to) {
                        for(var o = r + 1; o < t.length; o++){
                            var i = t[o];
                            if (i.from == n.from) {
                                if (i.to != n.to) {
                                    if (t == e) {
                                        t = e.slice();
                                    }
                                    t[o] = i.copy(i.from, n.to);
                                    ry(t, o + 1, i.copy(n.to, i.to));
                                }
                                continue;
                            } else {
                                if (i.from < n.to) {
                                    if (t == e) {
                                        t = e.slice();
                                    }
                                    t[r] = n.copy(n.from, i.from);
                                    ry(t, o, n.copy(i.from, n.to));
                                }
                                break;
                            }
                        }
                    }
                }
                return t;
            }
            function ry(e, t, r) {
                while(t < e.length && rm(r, e[t]) > 0){
                    t++;
                }
                e.splice(t, 0, r);
            }
            function r$(e) {
                var t = [];
                e.someProp("decorations", function(r) {
                    var n = r(e.state);
                    if (n && n != rl) {
                        t.push(n);
                    }
                });
                if (e.cursorWrapper) {
                    t.push(ra.create(e.state.doc, [
                        e.cursorWrapper.deco, 
                    ]));
                }
                return rf.from(t);
            }
            var rb = function e(t, r) {
                this._props = r;
                this.state = r.state;
                this.directPlugins = r.plugins || [];
                this.directPlugins.forEach(rk);
                this.dispatch = this.dispatch.bind(this);
                this._root = null;
                this.focused = false;
                this.trackWrites = null;
                this.dom = (t && t.mount) || document.createElement("div");
                if (t) {
                    if (t.appendChild) {
                        t.appendChild(this.dom);
                    } else if (t.apply) {
                        t(this.dom);
                    } else if (t.mount) {
                        this.mounted = true;
                    }
                }
                this.editable = rD(this);
                this.markCursor = null;
                this.cursorWrapper = null;
                rS(this);
                this.nodeViews = rO(this);
                this.docView = eu(this.state.doc, r_(this), r$(this), this.dom, this);
                this.lastSelectedViewDesc = null;
                this.dragging = null;
                tx(this);
                this.prevDirectPlugins = [];
                this.pluginViews = [];
                this.updatePluginViews();
            };
            var rw = {
                props: {
                    configurable: true
                },
                root: {
                    configurable: true
                }
            };
            rw.props.get = function() {
                if (this._props.state != this.state) {
                    var e = this._props;
                    this._props = {};
                    for(var t in e){
                        this._props[t] = e[t];
                    }
                    this._props.state = this.state;
                }
                return this._props;
            };
            rb.prototype.update = function e(t) {
                if (t.handleDOMEvents != this._props.handleDOMEvents) {
                    tA(this);
                }
                this._props = t;
                if (t.plugins) {
                    t.plugins.forEach(rk);
                    this.directPlugins = t.plugins;
                }
                this.updateStateInner(t.state, true);
            };
            rb.prototype.setProps = function e(t) {
                var r = {};
                for(var n in this._props){
                    r[n] = this._props[n];
                }
                r.state = this.state;
                for(var o in t){
                    r[o] = t[o];
                }
                this.update(r);
            };
            rb.prototype.updateState = function e(t) {
                this.updateStateInner(t, this.state.plugins != t.plugins);
            };
            rb.prototype.updateStateInner = function e(t, r) {
                var o = this;
                var i = this.state, a = false, l = false;
                if (t.storedMarks && this.composing) {
                    tU(this);
                    l = true;
                }
                this.state = t;
                if (r) {
                    var f = rO(this);
                    if (rC(f, this.nodeViews)) {
                        this.nodeViews = f;
                        a = true;
                    }
                    tA(this);
                }
                this.editable = rD(this);
                rS(this);
                var c = r$(this), d = r_(this);
                var u = r ? "reset" : t.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve";
                var h = a || !this.docView.matchesNode(t.doc, d, c);
                if (h || !t.selection.eq(i.selection)) {
                    l = true;
                }
                var p = u == "preserve" && l && this.dom.style.overflowAnchor == null && k(this);
                if (l) {
                    this.domObserver.stop();
                    var v = h && (s.ie || s.chrome) && !this.composing && !i.selection.empty && !t.selection.empty && rN(i.selection, t.selection);
                    if (h) {
                        var m = s.chrome ? (this.trackWrites = this.root.getSelection().focusNode) : null;
                        if (a || !this.docView.update(t.doc, d, c, this)) {
                            this.docView.updateOuterDeco([]);
                            this.docView.destroy();
                            this.docView = eu(t.doc, d, c, this.dom, this);
                        }
                        if (m && !this.trackWrites) {
                            v = true;
                        }
                    }
                    if (v || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && e9(this))) {
                        eV(this, v);
                    } else {
                        eL(this, t.selection);
                        this.domObserver.setCurSelection();
                    }
                    this.domObserver.start();
                }
                this.updatePluginViews(i);
                if (u == "reset") {
                    this.dom.scrollTop = 0;
                } else if (u == "to selection") {
                    var g = this.root.getSelection().focusNode;
                    if (this.someProp("handleScrollToSelection", function(e) {
                        return e(o);
                    })) ;
                    else if (t.selection instanceof n.NodeSelection) {
                        C(this, this.docView.domAfterPos(t.selection.from).getBoundingClientRect(), g);
                    } else {
                        C(this, this.coordsAtPos(t.selection.head, 1), g);
                    }
                } else if (p) {
                    M(p);
                }
            };
            rb.prototype.destroyPluginViews = function e() {
                var t;
                while((t = this.pluginViews.pop())){
                    if (t.destroy) {
                        t.destroy();
                    }
                }
            };
            rb.prototype.updatePluginViews = function e(t) {
                if (!t || t.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
                    this.prevDirectPlugins = this.directPlugins;
                    this.destroyPluginViews();
                    for(var r = 0; r < this.directPlugins.length; r++){
                        var n = this.directPlugins[r];
                        if (n.spec.view) {
                            this.pluginViews.push(n.spec.view(this));
                        }
                    }
                    for(var o = 0; o < this.state.plugins.length; o++){
                        var i = this.state.plugins[o];
                        if (i.spec.view) {
                            this.pluginViews.push(i.spec.view(this));
                        }
                    }
                } else {
                    for(var s = 0; s < this.pluginViews.length; s++){
                        var a = this.pluginViews[s];
                        if (a.update) {
                            a.update(this, t);
                        }
                    }
                }
            };
            rb.prototype.someProp = function e(t, r) {
                var n = this._props && this._props[t], o;
                if (n != null && (o = r ? r(n) : n)) {
                    return o;
                }
                for(var i = 0; i < this.directPlugins.length; i++){
                    var s = this.directPlugins[i].props[t];
                    if (s != null && (o = r ? r(s) : s)) {
                        return o;
                    }
                }
                var a = this.state.plugins;
                if (a) {
                    for(var l = 0; l < a.length; l++){
                        var f = a[l].props[t];
                        if (f != null && (o = r ? r(f) : f)) {
                            return o;
                        }
                    }
                }
            };
            rb.prototype.hasFocus = function e() {
                return this.root.activeElement == this.dom;
            };
            rb.prototype.focus = function e() {
                this.domObserver.stop();
                if (this.editable) {
                    P(this.dom);
                }
                eV(this);
                this.domObserver.start();
            };
            rw.root.get = function() {
                var e = this._root;
                if (e == null) {
                    for(var t = this.dom.parentNode; t; t = t.parentNode){
                        if (t.nodeType == 9 || (t.nodeType == 11 && t.host)) {
                            if (!t.getSelection) {
                                Object.getPrototypeOf(t).getSelection = function() {
                                    return document.getSelection();
                                };
                            }
                            return (this._root = t);
                        }
                    }
                }
                return e || document;
            };
            rb.prototype.posAtCoords = function e(t) {
                return L(this, t);
            };
            rb.prototype.coordsAtPos = function e(t, r) {
                if (r === void 0) r = 1;
                return W(this, t, r);
            };
            rb.prototype.domAtPos = function e(t, r) {
                if (r === void 0) r = 0;
                return this.docView.domFromPos(t, r);
            };
            rb.prototype.nodeDOM = function e(t) {
                var r = this.docView.descAt(t);
                return r ? r.nodeDOM : null;
            };
            rb.prototype.posAtDOM = function e(t, r, n) {
                if (n === void 0) n = -1;
                var o = this.docView.posFromDOM(t, r, n);
                if (o == null) {
                    throw new RangeError("DOM position not inside the editor");
                }
                return o;
            };
            rb.prototype.endOfTextblock = function e(t, r) {
                return ee(this, r || this.state, t);
            };
            rb.prototype.destroy = function e() {
                if (!this.docView) {
                    return;
                }
                tT(this);
                this.destroyPluginViews();
                if (this.mounted) {
                    this.docView.update(this.state.doc, [], r$(this), this);
                    this.dom.textContent = "";
                } else if (this.dom.parentNode) {
                    this.dom.parentNode.removeChild(this.dom);
                }
                this.docView.destroy();
                this.docView = null;
            };
            rb.prototype.dispatchEvent = function e(t) {
                return tV(this, t);
            };
            rb.prototype.dispatch = function e(t) {
                var r = this._props.dispatchTransaction;
                if (r) {
                    r.call(this, t);
                } else {
                    this.updateState(this.state.apply(t));
                }
            };
            Object.defineProperties(rb.prototype, rw);
            function r_(e) {
                var t = Object.create(null);
                t.class = "ProseMirror";
                t.contenteditable = String(e.editable);
                t.translate = "no";
                e.someProp("attributes", function(r) {
                    if (typeof r == "function") {
                        r = r(e.state);
                    }
                    if (r) {
                        for(var n in r){
                            if (n == "class") {
                                t.class += " " + r[n];
                            }
                            if (n == "style") {
                                t.style = (t.style ? t.style + ";" : "") + r[n];
                            } else if (!t[n] && n != "contenteditable" && n != "nodeName") {
                                t[n] = String(r[n]);
                            }
                        }
                    }
                });
                return [
                    rn.node(0, e.state.doc.content.size, t)
                ];
            }
            function rS(e) {
                if (e.markCursor) {
                    var t = document.createElement("img");
                    t.className = "ProseMirror-separator";
                    t.setAttribute("mark-placeholder", "true");
                    e.cursorWrapper = {
                        dom: t,
                        deco: rn.widget(e.state.selection.head, t, {
                            raw: true,
                            marks: e.markCursor
                        })
                    };
                } else {
                    e.cursorWrapper = null;
                }
            }
            function rD(e) {
                return !e.someProp("editable", function(t) {
                    return t(e.state) === false;
                });
            }
            function rN(e, t) {
                var r = Math.min(e.$anchor.sharedDepth(e.head), t.$anchor.sharedDepth(t.head));
                return e.$anchor.start(r) != t.$anchor.start(r);
            }
            function rO(e) {
                var t = {};
                e.someProp("nodeViews", function(e) {
                    for(var r in e){
                        if (!Object.prototype.hasOwnProperty.call(t, r)) {
                            t[r] = e[r];
                        }
                    }
                });
                return t;
            }
            function rC(e, t) {
                var r = 0, n = 0;
                for(var o in e){
                    if (e[o] != t[o]) {
                        return true;
                    }
                    r++;
                }
                for(var i in t){
                    n++;
                }
                return r != n;
            }
            function rk(e) {
                if (e.spec.state || e.spec.filterTransaction || e.spec.appendTransaction) {
                    throw new RangeError("Plugins passed directly to the view must not have a state component");
                }
            }
        }
    }, 
]);
