"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        453
    ],
    {
        8780: function(D, w, k) {
            k.r(w);
            k.d(w, {
                Decoration: function() {
                    return j;
                },
                DecorationSet: function() {
                    return d;
                },
                EditorView: function() {
                    return c;
                },
                __endComposition: function() {
                    return cb;
                },
                __parseFromClipboard: function() {
                    return by;
                },
                __serializeForClipboard: function() {
                    return bx;
                }
            });
            var E = k(6922);
            var F = k(2230);
            var G = k(1081);
            var a = {};
            if (typeof navigator != "undefined" && typeof document != "undefined") {
                var n = /Edge\/(\d+)/.exec(navigator.userAgent);
                var x = /MSIE \d/.test(navigator.userAgent);
                var o = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
                var p = (a.ie = !!(x || o || n));
                a.ie_version = x ? document.documentMode || 6 : o ? +o[1] : n ? +n[1] : null;
                a.gecko = !p && /gecko\/(\d+)/i.test(navigator.userAgent);
                a.gecko_version = a.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1];
                var q = !p && /Chrome\/(\d+)/.exec(navigator.userAgent);
                a.chrome = !!q;
                a.chrome_version = q && +q[1];
                a.safari = !p && /Apple Computer/.test(navigator.vendor);
                a.ios = a.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2);
                a.mac = a.ios || /Mac/.test(navigator.platform);
                a.android = /Android \d/.test(navigator.userAgent);
                a.webkit = "webkitFontSmoothing" in document.documentElement.style;
                a.webkit_version = a.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0, 
                ])[1];
            }
            var H = function(a) {
                for(var b = 0;; b++){
                    a = a.previousSibling;
                    if (!a) {
                        return b;
                    }
                }
            };
            var I = function(b) {
                var a = b.assignedSlot || b.parentNode;
                return a && a.nodeType == 11 ? a.host : a;
            };
            var J = null;
            var K = function(a, d, c) {
                var b = J || (J = document.createRange());
                b.setEnd(a, c == null ? a.nodeValue.length : c);
                b.setStart(a, d || 0);
                return b;
            };
            var L = function(b, c, a, d) {
                return (a && (N(b, c, a, d, -1) || N(b, c, a, d, 1)));
            };
            var M = /^(img|br|input|textarea|hr)$/i;
            function N(a, b, e, f, c) {
                for(;;){
                    if (a == e && b == f) {
                        return true;
                    }
                    if (b == (c < 0 ? 0 : O(a))) {
                        var d = a.parentNode;
                        if (d.nodeType != 1 || Q(a) || M.test(a.nodeName) || a.contentEditable == "false") {
                            return false;
                        }
                        b = H(a) + (c < 0 ? 0 : 1);
                        a = d;
                    } else if (a.nodeType == 1) {
                        a = a.childNodes[b + (c < 0 ? -1 : 0)];
                        if (a.contentEditable == "false") {
                            return false;
                        }
                        b = c < 0 ? O(a) : 0;
                    } else {
                        return false;
                    }
                }
            }
            function O(a) {
                return a.nodeType == 3 ? a.nodeValue.length : a.childNodes.length;
            }
            function P(a, d, f) {
                for(var b = d == 0, c = d == O(a); b || c;){
                    if (a == f) {
                        return true;
                    }
                    var e = H(a);
                    a = a.parentNode;
                    if (!a) {
                        return false;
                    }
                    b = b && e == 0;
                    c = c && e == O(a);
                }
            }
            function Q(c) {
                var a;
                for(var b = c; b; b = b.parentNode){
                    if ((a = b.pmViewDesc)) {
                        break;
                    }
                }
                return (a && a.node && a.node.isBlock && (a.dom == c || a.contentDOM == c));
            }
            var R = function(b) {
                var c = b.isCollapsed;
                if (c && a.chrome && b.rangeCount && !b.getRangeAt(0).collapsed) {
                    c = false;
                }
                return c;
            };
            function S(b, c) {
                var a = document.createEvent("Event");
                a.initEvent("keydown", true, true);
                a.keyCode = b;
                a.key = a.code = c;
                return a;
            }
            function T(a) {
                return {
                    left: 0,
                    right: a.documentElement.clientWidth,
                    top: 0,
                    bottom: a.documentElement.clientHeight
                };
            }
            function U(a, b) {
                return typeof a == "number" ? a : a[b];
            }
            function V(b) {
                var a = b.getBoundingClientRect();
                var c = a.width / b.offsetWidth || 1;
                var d = a.height / b.offsetHeight || 1;
                return {
                    left: a.left,
                    right: a.left + b.clientWidth * c,
                    top: a.top,
                    bottom: a.top + b.clientHeight * d
                };
            }
            function W(f, a, m) {
                var g = f.someProp("scrollThreshold") || 0, h = f.someProp("scrollMargin") || 5;
                var i = f.dom.ownerDocument;
                for(var b = m || f.dom;; b = I(b)){
                    if (!b) {
                        break;
                    }
                    if (b.nodeType != 1) {
                        continue;
                    }
                    var j = b == i.body || b.nodeType != 1;
                    var c = j ? T(i) : V(b);
                    var d = 0, e = 0;
                    if (a.top < c.top + U(g, "top")) {
                        e = -(c.top - a.top + U(h, "top"));
                    } else if (a.bottom > c.bottom - U(g, "bottom")) {
                        e = a.bottom - c.bottom + U(h, "bottom");
                    }
                    if (a.left < c.left + U(g, "left")) {
                        d = -(c.left - a.left + U(h, "left"));
                    } else if (a.right > c.right - U(g, "right")) {
                        d = a.right - c.right + U(h, "right");
                    }
                    if (d || e) {
                        if (j) {
                            i.defaultView.scrollBy(d, e);
                        } else {
                            var n = b.scrollLeft, o = b.scrollTop;
                            if (e) {
                                b.scrollTop += e;
                            }
                            if (d) {
                                b.scrollLeft += d;
                            }
                            var k = b.scrollLeft - n, l = b.scrollTop - o;
                            a = {
                                left: a.left - k,
                                top: a.top - l,
                                right: a.right - k,
                                bottom: a.bottom - l
                            };
                        }
                    }
                    if (j) {
                        break;
                    }
                }
            }
            function X(a) {
                var b = a.dom.getBoundingClientRect(), e = Math.max(0, b.top);
                var f, g;
                for(var i = (b.left + b.right) / 2, d = e + 1; d < Math.min(innerHeight, b.bottom); d += 5){
                    var c = a.root.elementFromPoint(i, d);
                    if (c == a.dom || !a.dom.contains(c)) {
                        continue;
                    }
                    var h = c.getBoundingClientRect();
                    if (h.top >= e - 20) {
                        f = c;
                        g = h.top;
                        break;
                    }
                }
                return {
                    refDOM: f,
                    refTop: g,
                    stack: Y(a.dom)
                };
            }
            function Y(a) {
                var b = [], c = a.ownerDocument;
                for(; a; a = I(a)){
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
            function Z(a) {
                var b = a.refDOM;
                var d = a.refTop;
                var e = a.stack;
                var c = b ? b.getBoundingClientRect().top : 0;
                $(e, c == 0 ? 0 : c - d);
            }
            function $(d, e) {
                for(var b = 0; b < d.length; b++){
                    var c = d[b];
                    var a = c.dom;
                    var f = c.top;
                    var g = c.left;
                    if (a.scrollTop != f + e) {
                        a.scrollTop = f + e;
                    }
                    if (a.scrollLeft != g) {
                        a.scrollLeft = g;
                    }
                }
            }
            var _ = null;
            function aa(a) {
                if (a.setActive) {
                    return a.setActive();
                }
                if (_) {
                    return a.focus(_);
                }
                var b = Y(a);
                a.focus(_ == null ? {
                    get preventScroll () {
                        _ = {
                            preventScroll: true
                        };
                        return true;
                    }
                } : undefined);
                if (!_) {
                    _ = false;
                    $(b, 0);
                }
            }
            function ab(n, b) {
                var c, g = 2e8, h, i = 0;
                var j = b.top, k = b.top;
                for(var d = n.firstChild, l = 0; d; d = d.nextSibling, l++){
                    var e = void 0;
                    if (d.nodeType == 1) {
                        e = d.getClientRects();
                    } else if (d.nodeType == 3) {
                        e = K(d).getClientRects();
                    } else {
                        continue;
                    }
                    for(var m = 0; m < e.length; m++){
                        var a = e[m];
                        if (a.top <= j && a.bottom >= k) {
                            j = Math.max(a.bottom, j);
                            k = Math.min(a.top, k);
                            var f = a.left > b.left ? a.left - b.left : a.right < b.left ? b.left - a.right : 0;
                            if (f < g) {
                                c = d;
                                g = f;
                                h = f && c.nodeType == 3 ? {
                                    left: a.right < b.left ? a.right : a.left,
                                    top: b.top
                                } : b;
                                if (d.nodeType == 1 && f) {
                                    i = l + (b.left >= (a.left + a.right) / 2 ? 1 : 0);
                                }
                                continue;
                            }
                        }
                        if (!c && ((b.left >= a.right && b.top >= a.top) || (b.left >= a.left && b.top >= a.bottom))) {
                            i = l + 1;
                        }
                    }
                }
                if (c && c.nodeType == 3) {
                    return ac(c, h);
                }
                if (!c || (g && c.nodeType == 1)) {
                    return {
                        node: n,
                        offset: i
                    };
                }
                return ab(c, h);
            }
            function ac(a, e) {
                var f = a.nodeValue.length;
                var d = document.createRange();
                for(var b = 0; b < f; b++){
                    d.setEnd(a, b + 1);
                    d.setStart(a, b);
                    var c = aj(d, 1);
                    if (c.top == c.bottom) {
                        continue;
                    }
                    if (ad(e, c)) {
                        return {
                            node: a,
                            offset: b + (e.left >= (c.left + c.right) / 2 ? 1 : 0)
                        };
                    }
                }
                return {
                    node: a,
                    offset: 0
                };
            }
            function ad(a, b) {
                return (a.left >= b.left - 1 && a.left <= b.right + 1 && a.top >= b.top - 1 && a.top <= b.bottom + 1);
            }
            function ae(a, c) {
                var b = a.parentNode;
                if (b && /^li$/i.test(b.nodeName) && c.left < a.getBoundingClientRect().left) {
                    return b;
                }
                return a;
            }
            function af(f, g, c) {
                var d = ab(g, c);
                var a = d.node;
                var h = d.offset;
                var e = -1;
                if (a.nodeType == 1 && !a.firstChild) {
                    var b = a.getBoundingClientRect();
                    e = b.left != b.right && c.left > (b.left + b.right) / 2 ? 1 : -1;
                }
                return f.docView.posFromDOM(a, h, e);
            }
            function ag(e, g, h, b) {
                var c = -1;
                for(var f = g;;){
                    if (f == e.dom) {
                        break;
                    }
                    var a = e.docView.nearestDesc(f, true);
                    if (!a) {
                        return null;
                    }
                    if (a.node.isBlock && a.parent) {
                        var d = a.dom.getBoundingClientRect();
                        if (d.left > b.left || d.top > b.top) {
                            c = a.posBefore;
                        } else if (d.right < b.left || d.bottom < b.top) {
                            c = a.posAfter;
                        } else {
                            break;
                        }
                    }
                    f = a.dom.parentNode;
                }
                return c > -1 ? c : e.docView.posFromDOM(g, h);
            }
            function ah(c, d, a) {
                var b = c.childNodes.length;
                if (b && a.top < a.bottom) {
                    for(var h = Math.max(0, Math.min(b - 1, Math.floor((b * (d.top - a.top)) / (a.bottom - a.top)) - 2)), e = h;;){
                        var f = c.childNodes[e];
                        if (f.nodeType == 1) {
                            var i = f.getClientRects();
                            for(var g = 0; g < i.length; g++){
                                var j = i[g];
                                if (ad(d, j)) {
                                    return ah(f, d, j);
                                }
                            }
                        }
                        if ((e = (e + 1) % b) == h) {
                            break;
                        }
                    }
                }
                return c;
            }
            function ai(e, c) {
                var j, k;
                var g = e.dom.ownerDocument, b, d;
                if (g.caretPositionFromPoint) {
                    try {
                        var m = g.caretPositionFromPoint(c.left, c.top);
                        if (m) {
                            (j = m), (b = j.offsetNode), (d = j.offset);
                        }
                    } catch (r) {}
                }
                if (!b && g.caretRangeFromPoint) {
                    var n = g.caretRangeFromPoint(c.left, c.top);
                    if (n) {
                        (k = n), (b = k.startContainer), (d = k.startOffset);
                    }
                }
                var f = (e.root.elementFromPoint ? e.root : g).elementFromPoint(c.left, c.top + 1), h;
                if (!f || !e.dom.contains(f.nodeType != 1 ? f.parentNode : f)) {
                    var o = e.dom.getBoundingClientRect();
                    if (!ad(c, o)) {
                        return null;
                    }
                    f = ah(e.dom, c, o);
                    if (!f) {
                        return null;
                    }
                }
                if (a.safari) {
                    for(var i = f; b && i; i = I(i)){
                        if (i.draggable) {
                            b = d = null;
                        }
                    }
                }
                f = ae(f, c);
                if (b) {
                    if (a.gecko && b.nodeType == 1) {
                        d = Math.min(d, b.childNodes.length);
                        if (d < b.childNodes.length) {
                            var p = b.childNodes[d], q;
                            if (p.nodeName == "IMG" && (q = p.getBoundingClientRect()).right <= c.left && q.bottom > c.top) {
                                d++;
                            }
                        }
                    }
                    if (b == e.dom && d == b.childNodes.length - 1 && b.lastChild.nodeType == 1 && c.top > b.lastChild.getBoundingClientRect().bottom) {
                        h = e.state.doc.content.size;
                    } else if (d == 0 || b.nodeType != 1 || b.childNodes[d - 1].nodeName != "BR") {
                        h = ag(e, b, d, c);
                    }
                }
                if (h == null) {
                    h = af(e, f, c);
                }
                var l = e.docView.nearestDesc(f, true);
                return {
                    pos: h,
                    inside: l ? l.posAtStart - l.border : -1
                };
            }
            function aj(b, c) {
                var a = b.getClientRects();
                return !a.length ? b.getBoundingClientRect() : a[c < 0 ? 0 : a.length - 1];
            }
            var ak = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
            function al(m, n, d) {
                var o = m.docView.domFromPos(n, d < 0 ? -1 : 1);
                var c = o.node;
                var b = o.offset;
                var h = a.webkit || a.gecko;
                if (c.nodeType == 3) {
                    if (h && (ak.test(c.nodeValue) || (d < 0 ? !b : b == c.nodeValue.length))) {
                        var i = aj(K(c, b, b), d);
                        if (a.gecko && b && /\s/.test(c.nodeValue[b - 1]) && b < c.nodeValue.length) {
                            var p = aj(K(c, b - 1, b - 1), -1);
                            if (p.top == i.top) {
                                var j = aj(K(c, b, b + 1), -1);
                                if (j.top != i.top) {
                                    return am(j, j.left < p.left);
                                }
                            }
                        }
                        return i;
                    } else {
                        var k = b, l = b, g = d < 0 ? 1 : -1;
                        if (d < 0 && !b) {
                            l++;
                            g = -1;
                        } else if (d >= 0 && b == c.nodeValue.length) {
                            k--;
                            g = 1;
                        } else if (d < 0) {
                            k--;
                        } else {
                            l++;
                        }
                        return am(aj(K(c, k, l), g), g < 0);
                    }
                }
                if (!m.state.doc.resolve(n).parent.inlineContent) {
                    if (b && (d < 0 || b == O(c))) {
                        var q = c.childNodes[b - 1];
                        if (q.nodeType == 1) {
                            return an(q.getBoundingClientRect(), false);
                        }
                    }
                    if (b < O(c)) {
                        var r = c.childNodes[b];
                        if (r.nodeType == 1) {
                            return an(r.getBoundingClientRect(), true);
                        }
                    }
                    return an(c.getBoundingClientRect(), d >= 0);
                }
                if (b && (d < 0 || b == O(c))) {
                    var f = c.childNodes[b - 1];
                    var s = f.nodeType == 3 ? K(f, O(f) - (h ? 0 : 1)) : f.nodeType == 1 && (f.nodeName != "BR" || !f.nextSibling) ? f : null;
                    if (s) {
                        return am(aj(s, 1), false);
                    }
                }
                if (b < O(c)) {
                    var e = c.childNodes[b];
                    while(e.pmViewDesc && e.pmViewDesc.ignoreForCoords){
                        e = e.nextSibling;
                    }
                    var t = !e ? null : e.nodeType == 3 ? K(e, 0, h ? 0 : 1) : e.nodeType == 1 ? e : null;
                    if (t) {
                        return am(aj(t, -1), true);
                    }
                }
                return am(aj(c.nodeType == 3 ? K(c) : c, -d), d >= 0);
            }
            function am(a, c) {
                if (a.width == 0) {
                    return a;
                }
                var b = c ? a.left : a.right;
                return {
                    top: a.top,
                    bottom: a.bottom,
                    left: b,
                    right: b
                };
            }
            function an(a, c) {
                if (a.height == 0) {
                    return a;
                }
                var b = c ? a.top : a.bottom;
                return {
                    top: b,
                    bottom: b,
                    left: a.left,
                    right: a.right
                };
            }
            function ao(a, c, e) {
                var d = a.state, b = a.root.activeElement;
                if (d != c) {
                    a.updateState(c);
                }
                if (b != a.dom) {
                    a.focus();
                }
                try {
                    return e();
                } finally{
                    if (d != c) {
                        a.updateState(d);
                    }
                    if (b != a.dom && b) {
                        b.focus();
                    }
                }
            }
            function ap(c, a, d) {
                var b = a.selection;
                var e = d == "up" ? b.$from : b.$to;
                return ao(c, a, function() {
                    var k = c.docView.domFromPos(e.pos, d == "up" ? -1 : 1);
                    var f = k.node;
                    for(;;){
                        var g = c.docView.nearestDesc(f, true);
                        if (!g) {
                            break;
                        }
                        if (g.node.isBlock) {
                            f = g.dom;
                            break;
                        }
                        f = g.dom.parentNode;
                    }
                    var h = al(c, e.pos, 1);
                    for(var a = f.firstChild; a; a = a.nextSibling){
                        var i = void 0;
                        if (a.nodeType == 1) {
                            i = a.getClientRects();
                        } else if (a.nodeType == 3) {
                            i = K(a, 0, a.nodeValue.length).getClientRects();
                        } else {
                            continue;
                        }
                        for(var j = 0; j < i.length; j++){
                            var b = i[j];
                            if (b.bottom > b.top + 1 && (d == "up" ? h.top - b.top > (b.bottom - h.top) * 2 : b.bottom - h.bottom > (h.bottom - b.top) * 2)) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }
            var aq = /[\u0590-\u08ac]/;
            function ar(b, c, d) {
                var f = c.selection;
                var a = f.$head;
                if (!a.parent.isTextblock) {
                    return false;
                }
                var e = a.parentOffset, g = !e, h = e == a.parent.content.size;
                var i = b.root.getSelection();
                if (!aq.test(a.parent.textContent) || !i.modify) {
                    return d == "left" || d == "backward" ? g : h;
                }
                return ao(b, c, function() {
                    var e = i.getRangeAt(0), f = i.focusNode, g = i.focusOffset;
                    var c = i.caretBidiLevel;
                    i.modify("move", d, "character");
                    var h = a.depth ? b.docView.domAfterPos(a.before()) : b.dom;
                    var j = !h.contains(i.focusNode.nodeType == 1 ? i.focusNode : i.focusNode.parentNode) || (f == i.focusNode && g == i.focusOffset);
                    i.removeAllRanges();
                    i.addRange(e);
                    if (c != null) {
                        i.caretBidiLevel = c;
                    }
                    return j;
                });
            }
            var as = null, at = null, au = false;
            function av(c, b, a) {
                if (as == b && at == a) {
                    return au;
                }
                as = b;
                at = a;
                return (au = a == "up" || a == "down" ? ap(c, b, a) : ar(c, b, a));
            }
            var aw = 0, ax = 1, ay = 2, az = 3;
            var b = function e(b, c, a, d) {
                this.parent = b;
                this.children = c;
                this.dom = a;
                a.pmViewDesc = this;
                this.contentDOM = d;
                this.dirty = aw;
            };
            var h = {
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
            b.prototype.matchesWidget = function a() {
                return false;
            };
            b.prototype.matchesMark = function a() {
                return false;
            };
            b.prototype.matchesNode = function a() {
                return false;
            };
            b.prototype.matchesHack = function a(b) {
                return false;
            };
            b.prototype.parseRule = function a() {
                return null;
            };
            b.prototype.stopEvent = function a() {
                return false;
            };
            h.size.get = function() {
                var b = 0;
                for(var a = 0; a < this.children.length; a++){
                    b += this.children[a].size;
                }
                return b;
            };
            h.border.get = function() {
                return 0;
            };
            b.prototype.destroy = function b() {
                this.parent = null;
                if (this.dom.pmViewDesc == this) {
                    this.dom.pmViewDesc = null;
                }
                for(var a = 0; a < this.children.length; a++){
                    this.children[a].destroy();
                }
            };
            b.prototype.posBeforeChild = function e(d) {
                for(var a = 0, b = this.posAtStart; a < this.children.length; a++){
                    var c = this.children[a];
                    if (c == d) {
                        return b;
                    }
                    b += c.size;
                }
            };
            h.posBefore.get = function() {
                return this.parent.posBeforeChild(this);
            };
            h.posAtStart.get = function() {
                return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
            };
            h.posAfter.get = function() {
                return this.posBefore + this.size;
            };
            h.posAtEnd.get = function() {
                return this.posAtStart + this.size - 2 * this.border;
            };
            b.prototype.localPosFromDOM = function k(a, e, j) {
                if (this.contentDOM && this.contentDOM.contains(a.nodeType == 1 ? a : a.parentNode)) {
                    if (j < 0) {
                        var b, h;
                        if (a == this.contentDOM) {
                            b = a.childNodes[e - 1];
                        } else {
                            while(a.parentNode != this.contentDOM){
                                a = a.parentNode;
                            }
                            b = a.previousSibling;
                        }
                        while(b && !((h = b.pmViewDesc) && h.parent == this)){
                            b = b.previousSibling;
                        }
                        return b ? this.posBeforeChild(h) + h.size : this.posAtStart;
                    } else {
                        var c, i;
                        if (a == this.contentDOM) {
                            c = a.childNodes[e];
                        } else {
                            while(a.parentNode != this.contentDOM){
                                a = a.parentNode;
                            }
                            c = a.nextSibling;
                        }
                        while(c && !((i = c.pmViewDesc) && i.parent == this)){
                            c = c.nextSibling;
                        }
                        return c ? this.posBeforeChild(i) : this.posAtEnd;
                    }
                }
                var d;
                if (a == this.dom && this.contentDOM) {
                    d = e > H(this.contentDOM);
                } else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) {
                    d = a.compareDocumentPosition(this.contentDOM) & 2;
                } else if (this.dom.firstChild) {
                    if (e == 0) {
                        for(var f = a;; f = f.parentNode){
                            if (f == this.dom) {
                                d = false;
                                break;
                            }
                            if (f.parentNode.firstChild != f) {
                                break;
                            }
                        }
                    }
                    if (d == null && e == a.childNodes.length) {
                        for(var g = a;; g = g.parentNode){
                            if (g == this.dom) {
                                d = true;
                                break;
                            }
                            if (g.parentNode.lastChild != g) {
                                break;
                            }
                        }
                    }
                }
                return (d == null ? j > 0 : d) ? this.posAtEnd : this.posAtStart;
            };
            b.prototype.nearestDesc = function f(b, e) {
                for(var d = true, c = b; c; c = c.parentNode){
                    var a = this.getDesc(c);
                    if (a && (!e || a.node)) {
                        if (d && a.nodeDOM && !(a.nodeDOM.nodeType == 1 ? a.nodeDOM.contains(b.nodeType == 1 ? b : b.parentNode) : a.nodeDOM == b)) {
                            d = false;
                        } else {
                            return a;
                        }
                    }
                }
            };
            b.prototype.getDesc = function d(c) {
                var b = c.pmViewDesc;
                for(var a = b; a; a = a.parent){
                    if (a == this) {
                        return b;
                    }
                }
            };
            b.prototype.posFromDOM = function f(b, d, e) {
                for(var a = b; a; a = a.parentNode){
                    var c = this.getDesc(a);
                    if (c) {
                        return c.localPosFromDOM(b, d, e);
                    }
                }
                return -1;
            };
            b.prototype.descAt = function f(c) {
                for(var d = 0, b = 0; d < this.children.length; d++){
                    var a = this.children[d], e = b + a.size;
                    if (b == c && e != b) {
                        while(!a.border && a.children.length){
                            a = a.children[0];
                        }
                        return a;
                    }
                    if (c < e) {
                        return a.descAt(c - b - a.border);
                    }
                    b = e;
                }
            };
            b.prototype.domFromPos = function m(h, d) {
                if (!this.contentDOM) {
                    return {
                        node: this.dom,
                        offset: 0
                    };
                }
                var a = 0, e = 0;
                for(var f = 0; a < this.children.length; a++){
                    var i = this.children[a], j = f + i.size;
                    if (j > h || i instanceof aG) {
                        e = h - f;
                        break;
                    }
                    f = j;
                }
                if (e) {
                    return this.children[a].domFromPos(e - this.children[a].border, d);
                }
                for(var g = void 0; a && !(g = this.children[a - 1]).size && g instanceof aB && g.widget.type.side >= 0; a--){}
                if (d <= 0) {
                    var b, k = true;
                    for(;; a--, k = false){
                        b = a ? this.children[a - 1] : null;
                        if (!b || b.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (b && d && k && !b.border && !b.domAtom) {
                        return b.domFromPos(b.size, d);
                    }
                    return {
                        node: this.contentDOM,
                        offset: b ? H(b.dom) + 1 : 0
                    };
                } else {
                    var c, l = true;
                    for(;; a++, l = false){
                        c = a < this.children.length ? this.children[a] : null;
                        if (!c || c.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (c && l && !c.border && !c.domAtom) {
                        return c.domFromPos(0, d);
                    }
                    return {
                        node: this.contentDOM,
                        offset: c ? H(c.dom) : this.contentDOM.childNodes.length
                    };
                }
            };
            b.prototype.parseRange = function o(a, b, k) {
                if (k === void 0) k = 0;
                if (this.children.length == 0) {
                    return {
                        node: this.contentDOM,
                        from: a,
                        to: b,
                        fromOffset: 0,
                        toOffset: this.contentDOM.childNodes.length
                    };
                }
                var d = -1, i = -1;
                for(var j = k, e = 0;; e++){
                    var c = this.children[e], f = j + c.size;
                    if (d == -1 && a <= f) {
                        var n = j + c.border;
                        if (a >= n && b <= f - c.border && c.node && c.contentDOM && this.contentDOM.contains(c.contentDOM)) {
                            return c.parseRange(a, b, n);
                        }
                        a = j;
                        for(var l = e; l > 0; l--){
                            var g = this.children[l - 1];
                            if (g.size && g.dom.parentNode == this.contentDOM && !g.emptyChildAt(1)) {
                                d = H(g.dom) + 1;
                                break;
                            }
                            a -= g.size;
                        }
                        if (d == -1) {
                            d = 0;
                        }
                    }
                    if (d > -1 && (f > b || e == this.children.length - 1)) {
                        b = f;
                        for(var m = e + 1; m < this.children.length; m++){
                            var h = this.children[m];
                            if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(-1)) {
                                i = H(h.dom);
                                break;
                            }
                            b += h.size;
                        }
                        if (i == -1) {
                            i = this.contentDOM.childNodes.length;
                        }
                        break;
                    }
                    j = f;
                }
                return {
                    node: this.contentDOM,
                    from: a,
                    to: b,
                    fromOffset: d,
                    toOffset: i
                };
            };
            b.prototype.emptyChildAt = function c(a) {
                if (this.border || !this.contentDOM || !this.children.length) {
                    return false;
                }
                var b = this.children[a < 0 ? 0 : this.children.length - 1];
                return b.size == 0 || b.emptyChildAt(a);
            };
            b.prototype.domAfterPos = function e(b) {
                var c = this.domFromPos(b, 0);
                var a = c.node;
                var d = c.offset;
                if (a.nodeType != 1 || d == a.childNodes.length) {
                    throw new RangeError("No node after pos " + b);
                }
                return a.childNodes[d];
            };
            b.prototype.setSelection = function A(d, e, s, n) {
                var x = Math.min(d, e), y = Math.max(d, e);
                for(var o = 0, g = 0; o < this.children.length; o++){
                    var k = this.children[o], t = g + k.size;
                    if (x > g && y < t) {
                        return k.setSelection(d - g - k.border, e - g - k.border, s, n);
                    }
                    g = t;
                }
                var c = this.domFromPos(d, d ? -1 : 1);
                var f = e == d ? c : this.domFromPos(e, e ? -1 : 1);
                var b = s.getSelection();
                var h = false;
                if ((a.gecko || a.safari) && d == e) {
                    var i = c.node;
                    var l = c.offset;
                    if (i.nodeType == 3) {
                        h = l && i.nodeValue[l - 1] == "\n";
                        if (h && l == i.nodeValue.length) {
                            for(var j = i, m = void 0; j; j = j.parentNode){
                                if ((m = j.nextSibling)) {
                                    if (m.nodeName == "BR") {
                                        c = f = {
                                            node: m.parentNode,
                                            offset: H(m) + 1
                                        };
                                    }
                                    break;
                                }
                                var p = j.pmViewDesc;
                                if (p && p.node && p.node.isBlock) {
                                    break;
                                }
                            }
                        }
                    } else {
                        var q = i.childNodes[l - 1];
                        h = q && (q.nodeName == "BR" || q.contentEditable == "false");
                    }
                }
                if (a.gecko && b.focusNode && b.focusNode != f.node && b.focusNode.nodeType == 1) {
                    var u = b.focusNode.childNodes[b.focusOffset];
                    if (u && u.contentEditable == "false") {
                        n = true;
                    }
                }
                if (!(n || (h && a.safari)) && L(c.node, c.offset, b.anchorNode, b.anchorOffset) && L(f.node, f.offset, b.focusNode, b.focusOffset)) {
                    return;
                }
                var v = false;
                if ((b.extend || d == e) && !h) {
                    b.collapse(c.node, c.offset);
                    try {
                        if (d != e) {
                            b.extend(f.node, f.offset);
                        }
                        v = true;
                    } catch (w) {
                        if (!(w instanceof DOMException)) {
                            throw w;
                        }
                    }
                }
                if (!v) {
                    if (d > e) {
                        var z = c;
                        c = f;
                        f = z;
                    }
                    var r = document.createRange();
                    r.setEnd(f.node, f.offset);
                    r.setStart(c.node, c.offset);
                    b.removeAllRanges();
                    b.addRange(r);
                }
            };
            b.prototype.ignoreMutation = function b(a) {
                return !this.contentDOM && a.type != "selection";
            };
            h.contentLost.get = function() {
                return (this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM));
            };
            b.prototype.markDirty = function i(c, d) {
                for(var b = 0, g = 0; g < this.children.length; g++){
                    var a = this.children[g], e = b + a.size;
                    if (b == e ? c <= e && d >= b : c < e && d > b) {
                        var f = b + a.border, h = e - a.border;
                        if (c >= f && d <= h) {
                            this.dirty = c == b || d == e ? ay : ax;
                            if (c == f && d == h && (a.contentLost || a.dom.parentNode != this.contentDOM)) {
                                a.dirty = az;
                            } else {
                                a.markDirty(c - f, d - f);
                            }
                            return;
                        } else {
                            a.dirty = a.dom == a.contentDOM && a.dom.parentNode == this.contentDOM ? ay : az;
                        }
                    }
                    b = e;
                }
                this.dirty = ay;
            };
            b.prototype.markParentsDirty = function d() {
                var b = 1;
                for(var a = this.parent; a; a = a.parent, b++){
                    var c = b == 1 ? ay : ax;
                    if (a.dirty < c) {
                        a.dirty = c;
                    }
                }
            };
            h.domAtom.get = function() {
                return false;
            };
            h.ignoreForCoords.get = function() {
                return false;
            };
            Object.defineProperties(b.prototype, h);
            var aA = [];
            var aB = (function(b) {
                function a(e, c, f, h) {
                    var g, a = c.type.toDOM;
                    if (typeof a == "function") {
                        a = a(f, function() {
                            if (!g) {
                                return h;
                            }
                            if (g.parent) {
                                return g.parent.posBeforeChild(g);
                            }
                        });
                    }
                    if (!c.type.spec.raw) {
                        if (a.nodeType != 1) {
                            var d = document.createElement("span");
                            d.appendChild(a);
                            a = d;
                        }
                        a.contentEditable = false;
                        a.classList.add("ProseMirror-widget");
                    }
                    b.call(this, e, aA, a, null);
                    this.widget = c;
                    g = this;
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                var c = {
                    domAtom: {
                        configurable: true
                    }
                };
                a.prototype.matchesWidget = function b(a) {
                    return (this.dirty == aw && a.type.eq(this.widget.type));
                };
                a.prototype.parseRule = function a() {
                    return {
                        ignore: true
                    };
                };
                a.prototype.stopEvent = function c(b) {
                    var a = this.widget.spec.stopEvent;
                    return a ? a(b) : false;
                };
                a.prototype.ignoreMutation = function b(a) {
                    return (a.type != "selection" || this.widget.spec.ignoreSelection);
                };
                c.domAtom.get = function() {
                    return true;
                };
                Object.defineProperties(a.prototype, c);
                return a;
            })(b);
            var aC = (function(b) {
                function a(a, c, d, e) {
                    b.call(this, a, aA, c, null);
                    this.textDOM = d;
                    this.text = e;
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                var c = {
                    size: {
                        configurable: true
                    }
                };
                c.size.get = function() {
                    return this.text.length;
                };
                a.prototype.localPosFromDOM = function c(b, a) {
                    if (b != this.textDOM) {
                        return this.posAtStart + (a ? this.size : 0);
                    }
                    return this.posAtStart + a;
                };
                a.prototype.domFromPos = function b(a) {
                    return {
                        node: this.textDOM,
                        offset: a
                    };
                };
                a.prototype.ignoreMutation = function b(a) {
                    return (a.type === "characterData" && a.target.nodeValue == a.oldValue);
                };
                Object.defineProperties(a.prototype, c);
                return a;
            })(b);
            var aD = (function(b) {
                function a(a, c, d, e) {
                    b.call(this, a, [], d, e);
                    this.mark = c;
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                a.create = function h(g, c, d, e) {
                    var f = e.nodeViews[c.type.name];
                    var b = f && f(c, e, d);
                    if (!b || !b.dom) {
                        b = F.DOMSerializer.renderSpec(document, c.type.spec.toDOM(c, d));
                    }
                    return new a(g, c, b.dom, b.contentDOM || b.dom);
                };
                a.prototype.parseRule = function a() {
                    return {
                        mark: this.mark.type.name,
                        attrs: this.mark.attrs,
                        contentElement: this.contentDOM
                    };
                };
                a.prototype.matchesMark = function b(a) {
                    return this.dirty != az && this.mark.eq(a);
                };
                a.prototype.markDirty = function e(c, d) {
                    b.prototype.markDirty.call(this, c, d);
                    if (this.dirty != aw) {
                        var a = this.parent;
                        while(!a.node){
                            a = a.parent;
                        }
                        if (a.dirty < this.dirty) {
                            a.dirty = this.dirty;
                        }
                        this.dirty = aw;
                    }
                };
                a.prototype.slice = function i(f, g, c) {
                    var d = a.create(this.parent, this.mark, true, c);
                    var b = this.children, h = this.size;
                    if (g < h) {
                        b = aW(b, g, h, c);
                    }
                    if (f > 0) {
                        b = aW(b, 0, f, c);
                    }
                    for(var e = 0; e < b.length; e++){
                        b[e].parent = d;
                    }
                    d.children = b;
                    return d;
                };
                return a;
            })(b);
            var y = (function(c) {
                function b(d, a, e, f, g, b, h, i, j) {
                    c.call(this, d, a.isLeaf ? aA : [], g, b);
                    this.nodeDOM = h;
                    this.node = a;
                    this.outerDeco = e;
                    this.innerDeco = f;
                    if (b) {
                        this.updateChildren(i, j);
                    }
                }
                if (c) b.__proto__ = c;
                b.prototype = Object.create(c && c.prototype);
                b.prototype.constructor = b;
                var d = {
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
                b.create = function o(i, c, e, g, f, l) {
                    var j;
                    var m = f.nodeViews[c.type.name], n;
                    var d = m && m(c, f, function() {
                        if (!n) {
                            return l;
                        }
                        if (n.parent) {
                            return n.parent.posBeforeChild(n);
                        }
                    }, e, g);
                    var a = d && d.dom, h = d && d.contentDOM;
                    if (c.isText) {
                        if (!a) {
                            a = document.createTextNode(c.text);
                        } else if (a.nodeType != 3) {
                            throw new RangeError("Text must be rendered as a DOM text node");
                        }
                    } else if (!a) {
                        (j = F.DOMSerializer.renderSpec(document, c.type.spec.toDOM(c))), (a = j.dom), (h = j.contentDOM);
                    }
                    if (!h && !c.isText && a.nodeName != "BR") {
                        if (!a.hasAttribute("contenteditable")) {
                            a.contentEditable = false;
                        }
                        if (c.type.spec.draggable) {
                            a.draggable = true;
                        }
                    }
                    var k = a;
                    a = aN(a, e, c);
                    if (d) {
                        return (n = new aH(i, c, e, g, a, h, k, d, f, l + 1));
                    } else if (c.isText) {
                        return new aF(i, c, e, g, a, k, f);
                    } else {
                        return new b(i, c, e, g, a, h, k, f, l + 1);
                    }
                };
                b.prototype.parseRule = function b() {
                    var c = this;
                    if (this.node.type.spec.reparseInView) {
                        return null;
                    }
                    var a = {
                        node: this.node.type.name,
                        attrs: this.node.attrs
                    };
                    if (this.node.type.spec.code) {
                        a.preserveWhitespace = "full";
                    }
                    if (this.contentDOM && !this.contentLost) {
                        a.contentElement = this.contentDOM;
                    } else {
                        a.getContent = function() {
                            return c.contentDOM ? F.Fragment.empty : c.node.content;
                        };
                    }
                    return a;
                };
                b.prototype.matchesNode = function d(a, b, c) {
                    return (this.dirty == aw && a.eq(this.node) && aO(b, this.outerDeco) && c.eq(this.innerDeco));
                };
                d.size.get = function() {
                    return this.node.nodeSize;
                };
                d.border.get = function() {
                    return this.node.isLeaf ? 0 : 1;
                };
                b.prototype.updateChildren = function i(b, f) {
                    var j = this;
                    var h = this.node.inlineContent, k = f;
                    var c = b.composing && this.localCompositionInfo(b, f);
                    var d = c && c.pos > -1 ? c : null;
                    var l = c && c.pos < 0;
                    var e = new g(this, d && d.node);
                    aS(this.node, this.innerDeco, function(a, c, d) {
                        if (a.spec.marks) {
                            e.syncToMarks(a.spec.marks, h, b);
                        } else if (a.type.side >= 0 && !d) {
                            e.syncToMarks(c == j.node.childCount ? F.Mark.none : j.node.child(c).marks, h, b);
                        }
                        e.placeWidget(a, b, k);
                    }, function(a, d, f, g) {
                        e.syncToMarks(a.marks, h, b);
                        var i;
                        if (e.findNodeMatch(a, d, f, g)) ;
                        else if (l && b.state.selection.from > k && b.state.selection.to < k + a.nodeSize && (i = e.findIndexWithChild(c.node)) > -1 && e.updateNodeAt(a, d, f, i, b)) ;
                        else if (e.updateNextNode(a, d, f, b, g)) ;
                        else {
                            e.addNode(a, d, f, b, k);
                        }
                        k += a.nodeSize;
                    });
                    e.syncToMarks(aA, h, b);
                    if (this.node.isTextblock) {
                        e.addTextblockHacks();
                    }
                    e.destroyRest();
                    if (e.changed || this.dirty == ay) {
                        if (d) {
                            this.protectLocalComposition(b, d);
                        }
                        aI(this.contentDOM, this.children, b);
                        if (a.ios) {
                            aT(this.dom);
                        }
                    }
                };
                b.prototype.localCompositionInfo = function j(c, b) {
                    var d = c.state.selection;
                    var e = d.from;
                    var f = d.to;
                    if (!(c.state.selection instanceof E.TextSelection) || e < b || f > b + this.node.content.size) {
                        return;
                    }
                    var g = c.root.getSelection();
                    var a = aU(g.focusNode, g.focusOffset);
                    if (!a || !this.dom.contains(a.parentNode)) {
                        return;
                    }
                    if (this.node.inlineContent) {
                        var h = a.nodeValue;
                        var i = aV(this.node.content, h, e - b, f - b);
                        return i < 0 ? null : {
                            node: a,
                            pos: i,
                            text: h
                        };
                    } else {
                        return {
                            node: a,
                            pos: -1
                        };
                    }
                };
                b.prototype.protectLocalComposition = function h(d, b) {
                    var c = b.node;
                    var e = b.pos;
                    var f = b.text;
                    if (this.getDesc(c)) {
                        return;
                    }
                    var a = c;
                    for(;; a = a.parentNode){
                        if (a.parentNode == this.contentDOM) {
                            break;
                        }
                        while(a.previousSibling){
                            a.parentNode.removeChild(a.previousSibling);
                        }
                        while(a.nextSibling){
                            a.parentNode.removeChild(a.nextSibling);
                        }
                        if (a.pmViewDesc) {
                            a.pmViewDesc = null;
                        }
                    }
                    var g = new aC(this, a, c, f);
                    d.compositionNodes.push(g);
                    this.children = aW(this.children, e, e + f.length, d, g);
                };
                b.prototype.update = function e(a, b, c, d) {
                    if (this.dirty == az || !a.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateInner(a, b, c, d);
                    return true;
                };
                b.prototype.updateInner = function e(a, b, c, d) {
                    this.updateOuterDeco(b);
                    this.node = a;
                    this.innerDeco = c;
                    if (this.contentDOM) {
                        this.updateChildren(d, this.posAtStart);
                    }
                    this.dirty = aw;
                };
                b.prototype.updateOuterDeco = function d(a) {
                    if (aO(a, this.outerDeco)) {
                        return;
                    }
                    var b = this.nodeDOM.nodeType != 1;
                    var c = this.dom;
                    this.dom = aL(this.dom, this.nodeDOM, aK(this.outerDeco, this.node, b), aK(a, this.node, b));
                    if (this.dom != c) {
                        c.pmViewDesc = null;
                        this.dom.pmViewDesc = this;
                    }
                    this.outerDeco = a;
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
                d.domAtom.get = function() {
                    return this.node.isAtom;
                };
                Object.defineProperties(b.prototype, d);
                return b;
            })(b);
            function aE(b, c, d, a, e) {
                aN(a, c, b);
                return new y(null, b, c, d, a, a, a, e, 0);
            }
            var aF = (function(b) {
                function a(a, c, d, e, f, g, h) {
                    b.call(this, a, c, d, e, f, null, g, h);
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                var c = {
                    domAtom: {
                        configurable: true
                    }
                };
                a.prototype.parseRule = function b() {
                    var a = this.nodeDOM.parentNode;
                    while(a && a != this.dom && !a.pmIsDeco){
                        a = a.parentNode;
                    }
                    return {
                        skip: a || true
                    };
                };
                a.prototype.update = function d(a, c, e, b) {
                    if (this.dirty == az || (this.dirty != aw && !this.inParent()) || !a.sameMarkup(this.node)) {
                        return false;
                    }
                    this.updateOuterDeco(c);
                    if ((this.dirty != aw || a.text != this.node.text) && a.text != this.nodeDOM.nodeValue) {
                        this.nodeDOM.nodeValue = a.text;
                        if (b.trackWrites == this.nodeDOM) {
                            b.trackWrites = null;
                        }
                    }
                    this.node = a;
                    this.dirty = aw;
                    return true;
                };
                a.prototype.inParent = function c() {
                    var b = this.parent.contentDOM;
                    for(var a = this.nodeDOM; a; a = a.parentNode){
                        if (a == b) {
                            return true;
                        }
                    }
                    return false;
                };
                a.prototype.domFromPos = function b(a) {
                    return {
                        node: this.nodeDOM,
                        offset: a
                    };
                };
                a.prototype.localPosFromDOM = function e(a, c, d) {
                    if (a == this.nodeDOM) {
                        return (this.posAtStart + Math.min(c, this.node.text.length));
                    }
                    return b.prototype.localPosFromDOM.call(this, a, c, d);
                };
                a.prototype.ignoreMutation = function b(a) {
                    return (a.type != "characterData" && a.type != "selection");
                };
                a.prototype.slice = function g(d, e, f) {
                    var b = this.node.cut(d, e), c = document.createTextNode(b.text);
                    return new a(this.parent, b, this.outerDeco, this.innerDeco, c, c, f);
                };
                a.prototype.markDirty = function d(a, c) {
                    b.prototype.markDirty.call(this, a, c);
                    if (this.dom != this.nodeDOM && (a == 0 || c == this.nodeDOM.nodeValue.length)) {
                        this.dirty = az;
                    }
                };
                c.domAtom.get = function() {
                    return false;
                };
                Object.defineProperties(a.prototype, c);
                return a;
            })(y);
            var aG = (function(b) {
                function a() {
                    b.apply(this, arguments);
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                var c = {
                    domAtom: {
                        configurable: true
                    },
                    ignoreForCoords: {
                        configurable: true
                    }
                };
                a.prototype.parseRule = function a() {
                    return {
                        ignore: true
                    };
                };
                a.prototype.matchesHack = function b(a) {
                    return (this.dirty == aw && this.dom.nodeName == a);
                };
                c.domAtom.get = function() {
                    return true;
                };
                c.ignoreForCoords.get = function() {
                    return this.dom.nodeName == "IMG";
                };
                Object.defineProperties(a.prototype, c);
                return a;
            })(b);
            var aH = (function(b) {
                function a(a, c, d, e, f, g, h, i, j, k) {
                    b.call(this, a, c, d, e, f, g, h, j, k);
                    this.spec = i;
                }
                if (b) a.__proto__ = b;
                a.prototype = Object.create(b && b.prototype);
                a.prototype.constructor = a;
                a.prototype.update = function g(a, c, d, e) {
                    if (this.dirty == az) {
                        return false;
                    }
                    if (this.spec.update) {
                        var f = this.spec.update(a, c, d);
                        if (f) {
                            this.updateInner(a, c, d, e);
                        }
                        return f;
                    } else if (!this.contentDOM && !a.isLeaf) {
                        return false;
                    } else {
                        return b.prototype.update.call(this, a, c, d, e);
                    }
                };
                a.prototype.selectNode = function a() {
                    this.spec.selectNode ? this.spec.selectNode() : b.prototype.selectNode.call(this);
                };
                a.prototype.deselectNode = function a() {
                    this.spec.deselectNode ? this.spec.deselectNode() : b.prototype.deselectNode.call(this);
                };
                a.prototype.setSelection = function f(a, c, d, e) {
                    this.spec.setSelection ? this.spec.setSelection(a, c, d) : b.prototype.setSelection.call(this, a, c, d, e);
                };
                a.prototype.destroy = function a() {
                    if (this.spec.destroy) {
                        this.spec.destroy();
                    }
                    b.prototype.destroy.call(this);
                };
                a.prototype.stopEvent = function b(a) {
                    return this.spec.stopEvent ? this.spec.stopEvent(a) : false;
                };
                a.prototype.ignoreMutation = function c(a) {
                    return this.spec.ignoreMutation ? this.spec.ignoreMutation(a) : b.prototype.ignoreMutation.call(this, a);
                };
                return a;
            })(y);
            function aI(b, h, e) {
                var a = b.firstChild, c = false;
                for(var f = 0; f < h.length; f++){
                    var d = h[f], g = d.dom;
                    if (g.parentNode == b) {
                        while(g != a){
                            a = aP(a);
                            c = true;
                        }
                        a = a.nextSibling;
                    } else {
                        c = true;
                        b.insertBefore(g, a);
                    }
                    if (d instanceof aD) {
                        var i = a ? a.previousSibling : b.lastChild;
                        aI(d.contentDOM, d.children, e);
                        a = i ? i.nextSibling : b.firstChild;
                    }
                }
                while(a){
                    a = aP(a);
                    c = true;
                }
                if (c && e.trackWrites == b) {
                    e.trackWrites = null;
                }
            }
            function z(a) {
                if (a) {
                    this.nodeName = a;
                }
            }
            z.prototype = Object.create(null);
            var aJ = [
                new z()
            ];
            function aK(f, i, h) {
                if (f.length == 0) {
                    return aJ;
                }
                var a = h ? aJ[0] : new z(), d = [
                    a
                ];
                for(var g = 0; g < f.length; g++){
                    var b = f[g].type.attrs;
                    if (!b) {
                        continue;
                    }
                    if (b.nodeName) {
                        d.push((a = new z(b.nodeName)));
                    }
                    for(var c in b){
                        var e = b[c];
                        if (e == null) {
                            continue;
                        }
                        if (h && d.length == 1) {
                            d.push((a = new z(i.isInline ? "span" : "div")));
                        }
                        if (c == "class") {
                            a.class = (a.class ? a.class + " " : "") + e;
                        } else if (c == "style") {
                            a.style = (a.style ? a.style + ";" : "") + e;
                        } else if (c != "nodeName") {
                            a[c] = e;
                        }
                    }
                }
                return d;
            }
            function aL(i, g, h, f) {
                if (h == aJ && f == aJ) {
                    return g;
                }
                var a = g;
                for(var c = 0; c < f.length; c++){
                    var d = f[c], e = h[c];
                    if (c) {
                        var b = void 0;
                        if (e && e.nodeName == d.nodeName && a != i && (b = a.parentNode) && b.tagName.toLowerCase() == d.nodeName) {
                            a = b;
                        } else {
                            b = document.createElement(d.nodeName);
                            b.pmIsDeco = true;
                            b.appendChild(a);
                            e = aJ[0];
                            a = b;
                        }
                    }
                    aM(a, e || aJ[0], d);
                }
                return a;
            }
            function aM(d, b, a) {
                for(var e in b){
                    if (e != "class" && e != "style" && e != "nodeName" && !(e in a)) {
                        d.removeAttribute(e);
                    }
                }
                for(var c in a){
                    if (c != "class" && c != "style" && c != "nodeName" && a[c] != b[c]) {
                        d.setAttribute(c, a[c]);
                    }
                }
                if (b.class != a.class) {
                    var f = b.class ? b.class.split(" ").filter(Boolean) : aA;
                    var g = a.class ? a.class.split(" ").filter(Boolean) : aA;
                    for(var h = 0; h < f.length; h++){
                        if (g.indexOf(f[h]) == -1) {
                            d.classList.remove(f[h]);
                        }
                    }
                    for(var i = 0; i < g.length; i++){
                        if (f.indexOf(g[i]) == -1) {
                            d.classList.add(g[i]);
                        }
                    }
                }
                if (b.style != a.style) {
                    if (b.style) {
                        var k = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, j;
                        while((j = k.exec(b.style))){
                            d.style.removeProperty(j[1]);
                        }
                    }
                    if (a.style) {
                        d.style.cssText += a.style;
                    }
                }
            }
            function aN(a, b, c) {
                return aL(a, a, aJ, aK(b, c, a.nodeType != 1));
            }
            function aO(b, c) {
                if (b.length != c.length) {
                    return false;
                }
                for(var a = 0; a < b.length; a++){
                    if (!b[a].type.eq(c[a].type)) {
                        return false;
                    }
                }
                return true;
            }
            function aP(a) {
                var b = a.nextSibling;
                a.parentNode.removeChild(a);
                return b;
            }
            var g = function c(a, b) {
                this.top = a;
                this.lock = b;
                this.index = 0;
                this.stack = [];
                this.changed = false;
                this.preMatch = aQ(a.node.content, a.children);
            };
            g.prototype.destroyBetween = function d(a, b) {
                if (a == b) {
                    return;
                }
                for(var c = a; c < b; c++){
                    this.top.children[c].destroy();
                }
                this.top.children.splice(a, b - a);
                this.changed = true;
            };
            g.prototype.destroyRest = function a() {
                this.destroyBetween(this.index, this.top.children.length);
            };
            g.prototype.syncToMarks = function j(c, g, h) {
                var b = 0, a = this.stack.length >> 1;
                var i = Math.min(a, c.length);
                while(b < i && (b == a - 1 ? this.top : this.stack[(b + 1) << 1]).matchesMark(c[b]) && c[b].type.spec.spanning !== false){
                    b++;
                }
                while(b < a){
                    this.destroyRest();
                    this.top.dirty = aw;
                    this.index = this.stack.pop();
                    this.top = this.stack.pop();
                    a--;
                }
                while(a < c.length){
                    this.stack.push(this.top, this.index + 1);
                    var d = -1;
                    for(var e = this.index; e < Math.min(this.index + 3, this.top.children.length); e++){
                        if (this.top.children[e].matchesMark(c[a])) {
                            d = e;
                            break;
                        }
                    }
                    if (d > -1) {
                        if (d > this.index) {
                            this.changed = true;
                            this.destroyBetween(this.index, d);
                        }
                        this.top = this.top.children[this.index];
                    } else {
                        var f = aD.create(this.top, c[a], g, h);
                        this.top.children.splice(this.index, 0, f);
                        this.top = f;
                        this.changed = true;
                    }
                    this.index = 0;
                    a++;
                }
            };
            g.prototype.findNodeMatch = function k(e, f, g, i) {
                var b = this.top.children, c = -1;
                if (i >= this.preMatch.index) {
                    for(var d = this.index; d < b.length; d++){
                        if (b[d].matchesNode(e, f, g)) {
                            c = d;
                            break;
                        }
                    }
                } else {
                    for(var a = this.index, j = Math.min(b.length, a + 1); a < j; a++){
                        var h = b[a];
                        if (h.matchesNode(e, f, g) && !this.preMatch.matched.has(h)) {
                            c = a;
                            break;
                        }
                    }
                }
                if (c < 0) {
                    return false;
                }
                this.destroyBetween(this.index, c);
                this.index++;
                return true;
            };
            g.prototype.updateNodeAt = function g(b, c, d, a, e) {
                var f = this.top.children[a];
                if (!f.update(b, c, d, e)) {
                    return false;
                }
                this.destroyBetween(this.index, a);
                this.index = a + 1;
                return true;
            };
            g.prototype.findIndexWithChild = function e(b) {
                for(;;){
                    var c = b.parentNode;
                    if (!c) {
                        return -1;
                    }
                    if (c == this.top.contentDOM) {
                        var d = b.pmViewDesc;
                        if (d) {
                            for(var a = this.index; a < this.top.children.length; a++){
                                if (this.top.children[a] == d) {
                                    return a;
                                }
                            }
                        }
                        return -1;
                    }
                    b = c;
                }
            };
            g.prototype.updateNextNode = function k(d, e, g, h, i) {
                for(var b = this.index; b < this.top.children.length; b++){
                    var a = this.top.children[b];
                    if (a instanceof y) {
                        var f = this.preMatch.matched.get(a);
                        if (f != null && f != i) {
                            return false;
                        }
                        var c = a.dom;
                        var j = this.lock && (c == this.lock || (c.nodeType == 1 && c.contains(this.lock.parentNode))) && !(d.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == d.text && a.dirty != az && aO(e, a.outerDeco));
                        if (!j && a.update(d, e, g, h)) {
                            this.destroyBetween(this.index, b);
                            if (a.dom != c) {
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
            g.prototype.addNode = function f(a, b, c, d, e) {
                this.top.children.splice(this.index++, 0, y.create(this.top, a, b, c, d, e));
                this.changed = true;
            };
            g.prototype.placeWidget = function f(b, c, d) {
                var a = this.index < this.top.children.length ? this.top.children[this.index] : null;
                if (a && a.matchesWidget(b) && (b == a.widget || !a.widget.type.toDOM.parentNode)) {
                    this.index++;
                } else {
                    var e = new aB(this.top, b, c, d);
                    this.top.children.splice(this.index++, 0, e);
                    this.changed = true;
                }
            };
            g.prototype.addTextblockHacks = function c() {
                var b = this.top.children[this.index - 1];
                while(b instanceof aD){
                    b = b.children[b.children.length - 1];
                }
                if (!b || !(b instanceof aF) || /\n$/.test(b.node.text)) {
                    if ((a.safari || a.chrome) && b && b.dom.contentEditable == "false") {
                        this.addHackNode("IMG");
                    }
                    this.addHackNode("BR");
                }
            };
            g.prototype.addHackNode = function c(a) {
                if (this.index < this.top.children.length && this.top.children[this.index].matchesHack(a)) {
                    this.index++;
                } else {
                    var b = document.createElement(a);
                    if (a == "IMG") {
                        b.className = "ProseMirror-separator";
                    }
                    if (a == "BR") {
                        b.className = "ProseMirror-trailingBreak";
                    }
                    this.top.children.splice(this.index++, 0, new aG(this.top, aA, b, null));
                    this.changed = true;
                }
            };
            function aQ(c, d) {
                var a = c.childCount, b = d.length, e = new Map();
                for(; a > 0 && b > 0; b--){
                    var f = d[b - 1], g = f.node;
                    if (!g) {
                        continue;
                    }
                    if (g != c.child(a - 1)) {
                        break;
                    }
                    --a;
                    e.set(f, a);
                }
                return {
                    index: a,
                    matched: e
                };
            }
            function aR(a, b) {
                return a.type.side - b.type.side;
            }
            function aS(i, p, s, t) {
                var a = p.locals(i), c = 0;
                if (a.length == 0) {
                    for(var k = 0; k < i.childCount; k++){
                        var q = i.child(k);
                        t(q, a, p.forChild(c, q), k);
                        c += q.nodeSize;
                    }
                    return;
                }
                var b = 0, e = [], g = null;
                for(var j = 0;;){
                    if (b < a.length && a[b].to == c) {
                        var u = a[b++], h = void 0;
                        while(b < a.length && a[b].to == c){
                            (h || (h = [
                                u
                            ])).push(a[b++]);
                        }
                        if (h) {
                            h.sort(aR);
                            for(var r = 0; r < h.length; r++){
                                s(h[r], j, !!g);
                            }
                        } else {
                            s(u, j, !!g);
                        }
                    }
                    var d = void 0, l = void 0;
                    if (g) {
                        l = -1;
                        d = g;
                        g = null;
                    } else if (j < i.childCount) {
                        l = j;
                        d = i.child(j++);
                    } else {
                        break;
                    }
                    for(var m = 0; m < e.length; m++){
                        if (e[m].to <= c) {
                            e.splice(m--, 1);
                        }
                    }
                    while(b < a.length && a[b].from <= c && a[b].to > c){
                        e.push(a[b++]);
                    }
                    var n = c + d.nodeSize;
                    if (d.isText) {
                        var f = n;
                        if (b < a.length && a[b].from < f) {
                            f = a[b].from;
                        }
                        for(var o = 0; o < e.length; o++){
                            if (e[o].to < f) {
                                f = e[o].to;
                            }
                        }
                        if (f < n) {
                            g = d.cut(f - c);
                            d = d.cut(0, f - c);
                            n = f;
                            l = -1;
                        }
                    }
                    var v = !e.length ? aA : d.isInline && !d.isLeaf ? e.filter(function(a) {
                        return !a.inline;
                    }) : e.slice();
                    t(d, v, p.forChild(c, d), l);
                    c = n;
                }
            }
            function aT(a) {
                if (a.nodeName == "UL" || a.nodeName == "OL") {
                    var b = a.style.cssText;
                    a.style.cssText = b + "; list-style: square !important";
                    window.getComputedStyle(a).listStyle;
                    a.style.cssText = b;
                }
            }
            function aU(a, b) {
                for(;;){
                    if (a.nodeType == 3) {
                        return a;
                    }
                    if (a.nodeType == 1 && b > 0) {
                        if (a.childNodes.length > b && a.childNodes[b].nodeType == 3) {
                            return a.childNodes[b];
                        }
                        a = a.childNodes[b - 1];
                        b = O(a);
                    } else if (a.nodeType == 1 && b < a.childNodes.length) {
                        a = a.childNodes[b];
                        b = 0;
                    } else {
                        return null;
                    }
                }
            }
            function aV(b, h, i, j) {
                for(var c = 0, a = 0; c < b.childCount && a <= j;){
                    var d = b.child(c++), e = a;
                    a += d.nodeSize;
                    if (!d.isText) {
                        continue;
                    }
                    var k = d.text;
                    while(c < b.childCount){
                        var f = b.child(c++);
                        a += f.nodeSize;
                        if (!f.isText) {
                            break;
                        }
                        k += f.text;
                    }
                    if (a >= i) {
                        var g = k.lastIndexOf(h, j - e);
                        if (g >= 0 && g + h.length + e >= i) {
                            return e + g;
                        }
                    }
                }
                return -1;
            }
            function aW(h, d, e, i, f) {
                var a = [];
                for(var g = 0, j = 0; g < h.length; g++){
                    var b = h[g], c = j, k = (j += b.size);
                    if (c >= e || k <= d) {
                        a.push(b);
                    } else {
                        if (c < d) {
                            a.push(b.slice(0, d - c, i));
                        }
                        if (f) {
                            a.push(f);
                            f = null;
                        }
                        if (k > e) {
                            a.push(b.slice(e - c, b.size, i));
                        }
                    }
                }
                return a;
            }
            function aX(c, k) {
                var b = c.root.getSelection(), f = c.state.doc;
                if (!b.focusNode) {
                    return null;
                }
                var a = c.docView.nearestDesc(b.focusNode), l = a && a.size == 0;
                var g = c.docView.posFromDOM(b.focusNode, b.focusOffset);
                if (g < 0) {
                    return null;
                }
                var d = f.resolve(g), h, e;
                if (R(b)) {
                    h = d;
                    while(a && !a.node){
                        a = a.parent;
                    }
                    if (a && a.node.isAtom && E.NodeSelection.isSelectable(a.node) && a.parent && !(a.node.isInline && P(b.focusNode, b.focusOffset, a.dom))) {
                        var i = a.posBefore;
                        e = new E.NodeSelection(g == i ? d : f.resolve(i));
                    }
                } else {
                    var j = c.docView.posFromDOM(b.anchorNode, b.anchorOffset);
                    if (j < 0) {
                        return null;
                    }
                    h = f.resolve(j);
                }
                if (!e) {
                    var m = k == "pointer" || (c.state.selection.head < d.pos && !l) ? 1 : -1;
                    e = a6(c, h, d, m);
                }
                return e;
            }
            function aY(a) {
                return a.editable ? a.hasFocus() : a8(a) && document.activeElement && document.activeElement.contains(a.dom);
            }
            function aZ(a, e) {
                var b = a.state.selection;
                a4(a, b);
                if (!aY(a)) {
                    return;
                }
                if (!e && a.mouseDown && a.mouseDown.allowDefault) {
                    a.mouseDown.delayedSelectionSync = true;
                    a.domObserver.setCurSelection();
                    return;
                }
                a.domObserver.disconnectSelection();
                if (a.cursorWrapper) {
                    a3(a);
                } else {
                    var f = b.anchor;
                    var g = b.head;
                    var c, d;
                    if (a$ && !(b instanceof E.TextSelection)) {
                        if (!b.$from.parent.inlineContent) {
                            c = a_(a, b.from);
                        }
                        if (!b.empty && !b.$from.parent.inlineContent) {
                            d = a_(a, b.to);
                        }
                    }
                    a.docView.setSelection(f, g, a.root, e);
                    if (a$) {
                        if (c) {
                            a1(c);
                        }
                        if (d) {
                            a1(d);
                        }
                    }
                    if (b.visible) {
                        a.dom.classList.remove("ProseMirror-hideselection");
                    } else {
                        a.dom.classList.add("ProseMirror-hideselection");
                        if ("onselectionchange" in document) {
                            a2(a);
                        }
                    }
                }
                a.domObserver.setCurSelection();
                a.domObserver.connectSelection();
            }
            var a$ = a.safari || (a.chrome && a.chrome_version < 63);
            function a_(g, h) {
                var f = g.docView.domFromPos(h, 0);
                var e = f.node;
                var c = f.offset;
                var b = c < e.childNodes.length ? e.childNodes[c] : null;
                var d = c ? e.childNodes[c - 1] : null;
                if (a.safari && b && b.contentEditable == "false") {
                    return a0(b);
                }
                if ((!b || b.contentEditable == "false") && (!d || d.contentEditable == "false")) {
                    if (b) {
                        return a0(b);
                    } else if (d) {
                        return a0(d);
                    }
                }
            }
            function a0(b) {
                b.contentEditable = "true";
                if (a.safari && b.draggable) {
                    b.draggable = false;
                    b.wasDraggable = true;
                }
                return b;
            }
            function a1(a) {
                a.contentEditable = "false";
                if (a.wasDraggable) {
                    a.draggable = true;
                    a.wasDraggable = null;
                }
            }
            function a2(a) {
                var b = a.dom.ownerDocument;
                b.removeEventListener("selectionchange", a.hideSelectionGuard);
                var c = a.root.getSelection();
                var d = c.anchorNode, e = c.anchorOffset;
                b.addEventListener("selectionchange", (a.hideSelectionGuard = function() {
                    if (c.anchorNode != d || c.anchorOffset != e) {
                        b.removeEventListener("selectionchange", a.hideSelectionGuard);
                        setTimeout(function() {
                            if (!aY(a) || a.state.selection.visible) {
                                a.dom.classList.remove("ProseMirror-hideselection");
                            }
                        }, 20);
                    }
                }));
            }
            function a3(d) {
                var e = d.root.getSelection(), c = document.createRange();
                var b = d.cursorWrapper.dom, f = b.nodeName == "IMG";
                if (f) {
                    c.setEnd(b.parentNode, H(b) + 1);
                } else {
                    c.setEnd(b, 0);
                }
                c.collapse(false);
                e.removeAllRanges();
                e.addRange(c);
                if (!f && !d.state.selection.visible && a.ie && a.ie_version <= 11) {
                    b.disabled = true;
                    b.disabled = false;
                }
            }
            function a4(a, c) {
                if (c instanceof E.NodeSelection) {
                    var b = a.docView.descAt(c.from);
                    if (b != a.lastSelectedViewDesc) {
                        a5(a);
                        if (b) {
                            b.selectNode();
                        }
                        a.lastSelectedViewDesc = b;
                    }
                } else {
                    a5(a);
                }
            }
            function a5(a) {
                if (a.lastSelectedViewDesc) {
                    if (a.lastSelectedViewDesc.parent) {
                        a.lastSelectedViewDesc.deselectNode();
                    }
                    a.lastSelectedViewDesc = null;
                }
            }
            function a6(a, b, c, d) {
                return (a.someProp("createSelectionBetween", function(d) {
                    return d(a, b, c);
                }) || E.TextSelection.between(b, c, d));
            }
            function a7(a) {
                if (a.editable && a.root.activeElement != a.dom) {
                    return false;
                }
                return a8(a);
            }
            function a8(b) {
                var a = b.root.getSelection();
                if (!a.anchorNode) {
                    return false;
                }
                try {
                    return (b.dom.contains(a.anchorNode.nodeType == 3 ? a.anchorNode.parentNode : a.anchorNode) && (b.editable || b.dom.contains(a.focusNode.nodeType == 3 ? a.focusNode.parentNode : a.focusNode)));
                } catch (c) {
                    return false;
                }
            }
            function a9(a) {
                var b = a.docView.domFromPos(a.state.selection.anchor, 0);
                var c = a.root.getSelection();
                return L(b.node, b.offset, c.anchorNode, c.anchorOffset);
            }
            function ba(c, b) {
                var d = c.selection;
                var e = d.$anchor;
                var f = d.$head;
                var a = b > 0 ? e.max(f) : e.min(f);
                var g = !a.parent.inlineContent ? a : a.depth ? c.doc.resolve(b > 0 ? a.after() : a.before()) : null;
                return (g && E.Selection.findFrom(g, b));
            }
            function bb(a, b) {
                a.dispatch(a.state.tr.setSelection(b).scrollIntoView());
                return true;
            }
            function bc(b, c, i) {
                var d = b.state.selection;
                if (d instanceof E.TextSelection) {
                    if (!d.empty || i.indexOf("s") > -1) {
                        return false;
                    } else if (b.endOfTextblock(c > 0 ? "right" : "left")) {
                        var g = ba(b.state, c);
                        if (g && g instanceof E.NodeSelection) {
                            return bb(b, g);
                        }
                        return false;
                    } else if (!(a.mac && i.indexOf("m") > -1)) {
                        var e = d.$head, f = e.textOffset ? null : c < 0 ? e.nodeBefore : e.nodeAfter, j;
                        if (!f || f.isText) {
                            return false;
                        }
                        var h = c < 0 ? e.pos - f.nodeSize : e.pos;
                        if (!(f.isAtom || ((j = b.docView.descAt(h)) && !j.contentDOM))) {
                            return false;
                        }
                        if (E.NodeSelection.isSelectable(f)) {
                            return bb(b, new E.NodeSelection(c < 0 ? b.state.doc.resolve(e.pos - f.nodeSize) : e));
                        } else if (a.webkit) {
                            return bb(b, new E.TextSelection(b.state.doc.resolve(c < 0 ? h : h + f.nodeSize)));
                        } else {
                            return false;
                        }
                    }
                } else if (d instanceof E.NodeSelection && d.node.isInline) {
                    return bb(b, new E.TextSelection(c > 0 ? d.$to : d.$from));
                } else {
                    var k = ba(b.state, c);
                    if (k) {
                        return bb(b, k);
                    }
                    return false;
                }
            }
            function bd(a) {
                return a.nodeType == 3 ? a.nodeValue.length : a.childNodes.length;
            }
            function be(a) {
                var b = a.pmViewDesc;
                return (b && b.size == 0 && (a.nextSibling || a.nodeName != "BR"));
            }
            function bf(e) {
                var f = e.root.getSelection();
                var b = f.focusNode, c = f.focusOffset;
                if (!b) {
                    return;
                }
                var g, h, j = false;
                if (a.gecko && b.nodeType == 1 && c < bd(b) && be(b.childNodes[c])) {
                    j = true;
                }
                for(;;){
                    if (c > 0) {
                        if (b.nodeType != 1) {
                            break;
                        } else {
                            var i = b.childNodes[c - 1];
                            if (be(i)) {
                                g = b;
                                h = --c;
                            } else if (i.nodeType == 3) {
                                b = i;
                                c = b.nodeValue.length;
                            } else {
                                break;
                            }
                        }
                    } else if (bh(b)) {
                        break;
                    } else {
                        var d = b.previousSibling;
                        while(d && be(d)){
                            g = b.parentNode;
                            h = H(d);
                            d = d.previousSibling;
                        }
                        if (!d) {
                            b = b.parentNode;
                            if (b == e.dom) {
                                break;
                            }
                            c = 0;
                        } else {
                            b = d;
                            c = bd(b);
                        }
                    }
                }
                if (j) {
                    bi(e, f, b, c);
                } else if (g) {
                    bi(e, f, g, h);
                }
            }
            function bg(e) {
                var f = e.root.getSelection();
                var a = f.focusNode, c = f.focusOffset;
                if (!a) {
                    return;
                }
                var g = bd(a);
                var d, h;
                for(;;){
                    if (c < g) {
                        if (a.nodeType != 1) {
                            break;
                        }
                        var i = a.childNodes[c];
                        if (be(i)) {
                            d = a;
                            h = ++c;
                        } else {
                            break;
                        }
                    } else if (bh(a)) {
                        break;
                    } else {
                        var b = a.nextSibling;
                        while(b && be(b)){
                            d = b.parentNode;
                            h = H(b) + 1;
                            b = b.nextSibling;
                        }
                        if (!b) {
                            a = a.parentNode;
                            if (a == e.dom) {
                                break;
                            }
                            c = g = 0;
                        } else {
                            a = b;
                            c = 0;
                            g = bd(a);
                        }
                    }
                }
                if (d) {
                    bi(e, f, d, h);
                }
            }
            function bh(b) {
                var a = b.pmViewDesc;
                return a && a.node && a.node.isBlock;
            }
            function bi(e, a, b, c) {
                if (R(a)) {
                    var d = document.createRange();
                    d.setEnd(b, c);
                    d.setStart(b, c);
                    a.removeAllRanges();
                    a.addRange(d);
                } else if (a.extend) {
                    a.extend(b, c);
                }
                e.domObserver.setCurSelection();
                var f = e.state;
                setTimeout(function() {
                    if (e.state == f) {
                        aZ(e);
                    }
                }, 50);
            }
            function bj(b, c, g) {
                var d = b.state.selection;
                if ((d instanceof E.TextSelection && !d.empty) || g.indexOf("s") > -1) {
                    return false;
                }
                if (a.mac && g.indexOf("m") > -1) {
                    return false;
                }
                var e = d.$from;
                var j = d.$to;
                if (!e.parent.inlineContent || b.endOfTextblock(c < 0 ? "up" : "down")) {
                    var f = ba(b.state, c);
                    if (f && f instanceof E.NodeSelection) {
                        return bb(b, f);
                    }
                }
                if (!e.parent.inlineContent) {
                    var h = c < 0 ? e : j;
                    var i = d instanceof E.AllSelection ? E.Selection.near(h, c) : E.Selection.findFrom(h, c);
                    return i ? bb(b, i) : false;
                }
                return false;
            }
            function bk(b, d) {
                if (!(b.state.selection instanceof E.TextSelection)) {
                    return true;
                }
                var e = b.state.selection;
                var a = e.$head;
                var g = e.$anchor;
                var h = e.empty;
                if (!a.sameParent(g)) {
                    return true;
                }
                if (!h) {
                    return false;
                }
                if (b.endOfTextblock(d > 0 ? "forward" : "backward")) {
                    return true;
                }
                var c = !a.textOffset && (d < 0 ? a.nodeBefore : a.nodeAfter);
                if (c && !c.isText) {
                    var f = b.state.tr;
                    if (d < 0) {
                        f.delete(a.pos - c.nodeSize, a.pos);
                    } else {
                        f.delete(a.pos, a.pos + c.nodeSize);
                    }
                    b.dispatch(f);
                    return true;
                }
                return false;
            }
            function bl(a, b, c) {
                a.domObserver.stop();
                b.contentEditable = c;
                a.domObserver.start();
            }
            function bm(c) {
                if (!a.safari || c.state.selection.$head.parentOffset > 0) {
                    return;
                }
                var d = c.root.getSelection();
                var b = d.focusNode;
                var e = d.focusOffset;
                if (b && b.nodeType == 1 && e == 0 && b.firstChild && b.firstChild.contentEditable == "false") {
                    var f = b.firstChild;
                    bl(c, f, true);
                    setTimeout(function() {
                        return bl(c, f, false);
                    }, 20);
                }
            }
            function bn(b) {
                var a = "";
                if (b.ctrlKey) {
                    a += "c";
                }
                if (b.metaKey) {
                    a += "m";
                }
                if (b.altKey) {
                    a += "a";
                }
                if (b.shiftKey) {
                    a += "s";
                }
                return a;
            }
            function bo(c, e) {
                var b = e.keyCode, d = bn(e);
                if (b == 8 || (a.mac && b == 72 && d == "c")) {
                    return (bk(c, -1) || bf(c));
                } else if (b == 46 || (a.mac && b == 68 && d == "c")) {
                    return (bk(c, 1) || bg(c));
                } else if (b == 13 || b == 27) {
                    return true;
                } else if (b == 37) {
                    return (bc(c, -1, d) || bf(c));
                } else if (b == 39) {
                    return (bc(c, 1, d) || bg(c));
                } else if (b == 38) {
                    return (bj(c, -1, d) || bf(c));
                } else if (b == 40) {
                    return (bm(c) || bj(c, 1, d) || bg(c));
                } else if (d == (a.mac ? "m" : "c") && (b == 66 || b == 73 || b == 89 || b == 90)) {
                    return true;
                }
                return false;
            }
            function bp(c, r, s) {
                var d = c.docView.parseRange(r, s);
                var m = d.node;
                var n = d.fromOffset;
                var j = d.toOffset;
                var h = d.from;
                var t = d.to;
                var e = c.root.getSelection(), b = null, f = e.anchorNode;
                if (f && c.dom.contains(f.nodeType == 1 ? f : f.parentNode)) {
                    b = [
                        {
                            node: f,
                            offset: e.anchorOffset
                        }
                    ];
                    if (!R(e)) {
                        b.push({
                            node: e.focusNode,
                            offset: e.focusOffset
                        });
                    }
                }
                if (a.chrome && c.lastKeyCode === 8) {
                    for(var i = j; i > n; i--){
                        var o = m.childNodes[i - 1], k = o.pmViewDesc;
                        if (o.nodeName == "BR" && !k) {
                            j = i;
                            break;
                        }
                        if (!k || k.size) {
                            break;
                        }
                    }
                }
                var u = c.state.doc;
                var v = c.someProp("domParser") || F.DOMParser.fromSchema(c.state.schema);
                var g = u.resolve(h);
                var p = null, w = v.parse(m, {
                    topNode: g.parent,
                    topMatch: g.parent.contentMatchAt(g.index()),
                    topOpen: true,
                    from: n,
                    to: j,
                    preserveWhitespace: g.parent.type.spec.code ? "full" : true,
                    editableContent: true,
                    findPositions: b,
                    ruleFromNode: bq,
                    context: g
                });
                if (b && b[0].pos != null) {
                    var q = b[0].pos, l = b[1] && b[1].pos;
                    if (l == null) {
                        l = q;
                    }
                    p = {
                        anchor: q + h,
                        head: l + h
                    };
                }
                return {
                    doc: w,
                    sel: p,
                    from: h,
                    to: t
                };
            }
            function bq(b) {
                var c = b.pmViewDesc;
                if (c) {
                    return c.parseRule();
                } else if (b.nodeName == "BR" && b.parentNode) {
                    if (a.safari && /^(ul|ol)$/i.test(b.parentNode.nodeName)) {
                        var d = document.createElement("div");
                        d.appendChild(document.createElement("li"));
                        return {
                            skip: d
                        };
                    } else if (b.parentNode.lastChild == b || (a.safari && /^(tr|table)$/i.test(b.parentNode.nodeName))) {
                        return {
                            ignore: true
                        };
                    }
                } else if (b.nodeName == "IMG" && b.getAttribute("mark-placeholder")) {
                    return {
                        ignore: true
                    };
                }
            }
            function br(b, m, n, F, z) {
                if (m < 0) {
                    var r = b.lastSelectionTime > Date.now() - 50 ? b.lastSelectionOrigin : null;
                    var s = aX(b, r);
                    if (s && !b.state.selection.eq(s)) {
                        var t = b.state.tr.setSelection(s);
                        if (r == "pointer") {
                            t.setMeta("pointer", true);
                        } else if (r == "key") {
                            t.scrollIntoView();
                        }
                        b.dispatch(t);
                    }
                    return;
                }
                var A = b.state.doc.resolve(m);
                var B = A.sharedDepth(n);
                m = A.before(B + 1);
                n = b.state.doc.resolve(n).after(B + 1);
                var h = b.state.selection;
                var d = bp(b, m, n);
                if (a.chrome && b.cursorWrapper && d.sel && d.sel.anchor == b.cursorWrapper.deco.from) {
                    var u = b.cursorWrapper.deco.type.toDOM.nextSibling;
                    var C = u && u.nodeValue ? u.nodeValue.length : 1;
                    d.sel = {
                        anchor: d.sel.anchor + C,
                        head: d.sel.anchor + C
                    };
                }
                var l = b.state.doc, G = l.slice(d.from, d.to);
                var v, w;
                if (b.lastKeyCode === 8 && Date.now() - 100 < b.lastKeyCodeTime) {
                    v = b.state.selection.to;
                    w = "end";
                } else {
                    v = b.state.selection.from;
                    w = "start";
                }
                b.lastKeyCode = null;
                var c = bw(G.content, d.doc.content, d.from, v, w);
                if (!c) {
                    if (F && h instanceof E.TextSelection && !h.empty && h.$head.sameParent(h.$anchor) && !b.composing && !(d.sel && d.sel.anchor != d.sel.head)) {
                        c = {
                            start: h.from,
                            endA: h.to,
                            endB: h.to
                        };
                    } else if (((a.ios && b.lastIOSEnter > Date.now() - 225) || a.android) && z.some(function(a) {
                        return a.nodeName == "DIV" || a.nodeName == "P";
                    }) && b.someProp("handleKeyDown", function(a) {
                        return a(b, S(13, "Enter"));
                    })) {
                        b.lastIOSEnter = 0;
                        return;
                    } else {
                        if (d.sel) {
                            var x = bs(b, b.state.doc, d.sel);
                            if (x && !x.eq(b.state.selection)) {
                                b.dispatch(b.state.tr.setSelection(x));
                            }
                        }
                        return;
                    }
                }
                b.domChangeCount++;
                if (b.state.selection.from < b.state.selection.to && c.start == c.endB && b.state.selection instanceof E.TextSelection) {
                    if (c.start > b.state.selection.from && c.start <= b.state.selection.from + 2) {
                        c.start = b.state.selection.from;
                    } else if (c.endA < b.state.selection.to && c.endA >= b.state.selection.to - 2) {
                        c.endB += b.state.selection.to - c.endA;
                        c.endA = b.state.selection.to;
                    }
                }
                if (a.ie && a.ie_version <= 11 && c.endB == c.start + 1 && c.endA == c.start && c.start > d.from && d.doc.textBetween(c.start - d.from - 1, c.start - d.from + 1) == " \u00a0") {
                    c.start--;
                    c.endA--;
                    c.endB--;
                }
                var e = d.doc.resolveNoCache(c.start - d.from);
                var f = d.doc.resolveNoCache(c.endB - d.from);
                var o = e.sameParent(f) && e.parent.inlineContent;
                var D;
                if (((a.ios && b.lastIOSEnter > Date.now() - 225 && (!o || z.some(function(a) {
                    return a.nodeName == "DIV" || a.nodeName == "P";
                }))) || (!o && e.pos < d.doc.content.size && (D = E.Selection.findFrom(d.doc.resolve(e.pos + 1), 1, true)) && D.head == f.pos)) && b.someProp("handleKeyDown", function(a) {
                    return a(b, S(13, "Enter"));
                })) {
                    b.lastIOSEnter = 0;
                    return;
                }
                if (b.state.selection.anchor > c.start && bu(l, c.start, c.endA, e, f) && b.someProp("handleKeyDown", function(a) {
                    return a(b, S(8, "Backspace"));
                })) {
                    if (a.android && a.chrome) {
                        b.domObserver.suppressSelectionUpdates();
                    }
                    return;
                }
                if (a.chrome && a.android && c.toB == c.from) {
                    b.lastAndroidDelete = Date.now();
                }
                if (a.android && !o && e.start() != f.start() && f.parentOffset == 0 && e.depth == f.depth && d.sel && d.sel.anchor == d.sel.head && d.sel.head == c.endA) {
                    c.endB -= 2;
                    f = d.doc.resolveNoCache(c.endB - d.from);
                    setTimeout(function() {
                        b.someProp("handleKeyDown", function(a) {
                            return a(b, S(13, "Enter"));
                        });
                    }, 20);
                }
                var i = c.start, k = c.endA;
                var g, y, p, q;
                if (o) {
                    if (e.pos == f.pos) {
                        if (a.ie && a.ie_version <= 11 && e.parentOffset == 0) {
                            b.domObserver.suppressSelectionUpdates();
                            setTimeout(function() {
                                return aZ(b);
                            }, 20);
                        }
                        g = b.state.tr.delete(i, k);
                        y = l.resolve(c.start).marksAcross(l.resolve(c.endA));
                    } else if (c.endA == c.endB && (q = l.resolve(c.start)) && (p = bt(e.parent.content.cut(e.parentOffset, f.parentOffset), q.parent.content.cut(q.parentOffset, c.endA - q.start())))) {
                        g = b.state.tr;
                        if (p.type == "add") {
                            g.addMark(i, k, p.mark);
                        } else {
                            g.removeMark(i, k, p.mark);
                        }
                    } else if (e.parent.child(e.index()).isText && e.index() == f.index() - (f.textOffset ? 0 : 1)) {
                        var H = e.parent.textBetween(e.parentOffset, f.parentOffset);
                        if (b.someProp("handleTextInput", function(a) {
                            return a(b, i, k, H);
                        })) {
                            return;
                        }
                        g = b.state.tr.insertText(H, i, k);
                    }
                }
                if (!g) {
                    g = b.state.tr.replace(i, k, d.doc.slice(c.start - d.from, c.endB - d.from));
                }
                if (d.sel) {
                    var j = bs(b, g.doc, d.sel);
                    if (j && !((a.chrome && a.android && b.composing && j.empty && (c.start != c.endB || b.lastAndroidDelete < Date.now() - 100) && (j.head == i || j.head == g.mapping.map(k) - 1)) || (a.ie && j.empty && j.head == i))) {
                        g.setSelection(j);
                    }
                }
                if (y) {
                    g.ensureMarks(y);
                }
                b.dispatch(g.scrollIntoView());
            }
            function bs(c, b, a) {
                if (Math.max(a.anchor, a.head) > b.content.size) {
                    return null;
                }
                return a6(c, b.resolve(a.anchor), b.resolve(a.head));
            }
            function bt(l, c) {
                var d = l.firstChild.marks, e = c.firstChild.marks;
                var a = d, b = e, f, g, h;
                for(var i = 0; i < e.length; i++){
                    a = e[i].removeFromSet(a);
                }
                for(var j = 0; j < d.length; j++){
                    b = d[j].removeFromSet(b);
                }
                if (a.length == 1 && b.length == 0) {
                    g = a[0];
                    f = "add";
                    h = function(a) {
                        return a.mark(g.addToSet(a.marks));
                    };
                } else if (a.length == 0 && b.length == 1) {
                    g = b[0];
                    f = "remove";
                    h = function(a) {
                        return a.mark(g.removeFromSet(a.marks));
                    };
                } else {
                    return null;
                }
                var m = [];
                for(var k = 0; k < c.childCount; k++){
                    m.push(h(c.child(k)));
                }
                if (F.Fragment.from(m).eq(l)) {
                    return {
                        mark: g,
                        type: f
                    };
                }
            }
            function bu(e, f, d, a, g) {
                if (!a.parent.isTextblock || d - f <= g.pos - a.pos || bv(a, true, false) < g.pos) {
                    return false;
                }
                var b = e.resolve(f);
                if (b.parentOffset < b.parent.content.size || !b.parent.isTextblock) {
                    return false;
                }
                var c = e.resolve(bv(b, true, true));
                if (!c.parent.isTextblock || c.pos > d || bv(c, true, false) < d) {
                    return false;
                }
                return a.parent.content.cut(a.parentOffset).eq(c.parent.content);
            }
            function bv(a, d, f) {
                var b = a.depth, e = d ? a.end() : a.pos;
                while(b > 0 && (d || a.indexAfter(b) == a.node(b).childCount)){
                    b--;
                    e++;
                    d = false;
                }
                if (f) {
                    var c = a.node(b).maybeChild(a.indexAfter(b));
                    while(c && !c.isLeaf){
                        c = c.firstChild;
                        e++;
                    }
                }
                return e;
            }
            function bw(e, f, g, d, i) {
                var a = e.findDiffStart(f, g);
                if (a == null) {
                    return null;
                }
                var h = e.findDiffEnd(f, g + e.size, g + f.size);
                var b = h.a;
                var c = h.b;
                if (i == "end") {
                    var j = Math.max(0, a - Math.min(b, c));
                    d -= b + j - a;
                }
                if (b < a && e.size < f.size) {
                    var k = d <= a && d >= b ? a - d : 0;
                    a -= k;
                    c = a + (c - b);
                    b = a;
                } else if (c < a) {
                    var l = d <= a && d >= c ? a - d : 0;
                    a -= l;
                    b = a + (b - c);
                    c = a;
                }
                return {
                    start: a,
                    endA: b,
                    endB: c
                };
            }
            function bx(j, c) {
                var l = [];
                var d = c.content;
                var f = c.openStart;
                var g = c.openEnd;
                while(f > 1 && g > 1 && d.childCount == 1 && d.firstChild.childCount == 1){
                    f--;
                    g--;
                    var e = d.firstChild;
                    l.push(e.type.name, e.attrs != e.type.defaultAttrs ? e.attrs : null);
                    d = e.content;
                }
                var n = j.someProp("clipboardSerializer") || F.DOMSerializer.fromSchema(j.state.schema);
                var k = bH(), a = k.createElement("div");
                a.appendChild(n.serializeFragment(d, {
                    document: k
                }));
                var b = a.firstChild, h;
                while(b && b.nodeType == 1 && (h = bF[b.nodeName.toLowerCase()])){
                    for(var i = h.length - 1; i >= 0; i--){
                        var m = k.createElement(h[i]);
                        while(a.firstChild){
                            m.appendChild(a.firstChild);
                        }
                        a.appendChild(m);
                        if (h[i] != "tbody") {
                            f++;
                            g++;
                        }
                    }
                    b = a.firstChild;
                }
                if (b && b.nodeType == 1) {
                    b.setAttribute("data-pm-slice", f + " " + g + " " + JSON.stringify(l));
                }
                var o = j.someProp("clipboardTextSerializer", function(a) {
                    return a(c);
                }) || c.content.textBetween(0, c.content.size, "\n\n");
                return {
                    dom: a,
                    text: o
                };
            }
            function by(c, e, h, q, g) {
                var d, m = g.parent.type.spec.code, b;
                if (!h && !e) {
                    return null;
                }
                var n = e && (q || m || !h);
                if (n) {
                    c.someProp("transformPastedText", function(a) {
                        e = a(e, m || q);
                    });
                    if (m) {
                        return e ? new F.Slice(F.Fragment.from(c.state.schema.text(e.replace(/\r\n?/g, "\n"))), 0, 0) : F.Slice.empty;
                    }
                    var o = c.someProp("clipboardTextParser", function(a) {
                        return a(e, g, q);
                    });
                    if (o) {
                        b = o;
                    } else {
                        var u = g.marks();
                        var r = c.state;
                        var s = r.schema;
                        var v = F.DOMSerializer.fromSchema(s);
                        d = document.createElement("div");
                        e.split(/(?:\r\n?|\n)+/).forEach(function(a) {
                            var b = d.appendChild(document.createElement("p"));
                            if (a) {
                                b.appendChild(v.serializeNode(s.text(a, u)));
                            }
                        });
                    }
                } else {
                    c.someProp("transformPastedHTML", function(a) {
                        h = a(h);
                    });
                    d = bI(h);
                    if (a.webkit) {
                        bJ(d);
                    }
                }
                var p = d && d.querySelector("[data-pm-slice]");
                var f = p && /^(\d+) (\d+) (.*)/.exec(p.getAttribute("data-pm-slice"));
                if (!b) {
                    var t = c.someProp("clipboardParser") || c.someProp("domParser") || F.DOMParser.fromSchema(c.state.schema);
                    b = t.parseSlice(d, {
                        preserveWhitespace: !!(n || f),
                        context: g
                    });
                }
                if (f) {
                    b = bK(bE(b, +f[1], +f[2]), f[3]);
                } else {
                    b = F.Slice.maxOpen(bz(b.content, g), true);
                    if (b.openStart || b.openEnd) {
                        var i = 0, j = 0;
                        for(var k = b.content.firstChild; i < b.openStart && !k.type.spec.isolating; i++, k = k.firstChild){}
                        for(var l = b.content.lastChild; j < b.openEnd && !l.type.spec.isolating; j++, l = l.lastChild){}
                        b = bE(b, i, j);
                    }
                }
                c.someProp("transformPasted", function(a) {
                    b = a(b);
                });
                return b;
            }
            function bz(a, d) {
                if (a.childCount < 2) {
                    return a;
                }
                var e = function(b) {
                    var e = d.node(b);
                    var f = e.contentMatchAt(d.index(b));
                    var g = void 0, c = [];
                    a.forEach(function(b) {
                        if (!c) {
                            return;
                        }
                        var a = f.findWrapping(b.type), e;
                        if (!a) {
                            return (c = null);
                        }
                        if ((e = c.length && g.length && bB(a, g, b, c[c.length - 1], 0))) {
                            c[c.length - 1] = e;
                        } else {
                            if (c.length) {
                                c[c.length - 1] = bC(c[c.length - 1], g.length);
                            }
                            var d = bA(b, a);
                            c.push(d);
                            f = f.matchType(d.type, d.attrs);
                            g = a;
                        }
                    });
                    if (c) {
                        return {
                            v: F.Fragment.from(c)
                        };
                    }
                };
                for(var b = d.depth; b >= 0; b--){
                    var c = e(b);
                    if (c) return c.v;
                }
                return a;
            }
            function bA(a, d, b) {
                if (b === void 0) b = 0;
                for(var c = d.length - 1; c >= b; c--){
                    a = d[c].create(null, F.Fragment.from(a));
                }
                return a;
            }
            function bB(c, d, e, a, b) {
                if (b < c.length && b < d.length && c[b] == d[b]) {
                    var f = bB(c, d, e, a.lastChild, b + 1);
                    if (f) {
                        return a.copy(a.content.replaceChild(a.childCount - 1, f));
                    }
                    var g = a.contentMatchAt(a.childCount);
                    if (g.matchType(b == c.length - 1 ? e.type : c[b + 1])) {
                        return a.copy(a.content.append(F.Fragment.from(bA(e, c, b + 1))));
                    }
                }
            }
            function bC(a, b) {
                if (b == 0) {
                    return a;
                }
                var c = a.content.replaceChild(a.childCount - 1, bC(a.lastChild, b - 1));
                var d = a.contentMatchAt(a.childCount).fillBefore(F.Fragment.empty, true);
                return a.copy(c.append(d));
            }
            function bD(b, d, f, g, e, h) {
                var c = d < 0 ? b.firstChild : b.lastChild, a = c.content;
                if (e < g - 1) {
                    a = bD(a, d, f, g, e + 1, h);
                }
                if (e >= f) {
                    a = d < 0 ? c.contentMatchAt(0).fillBefore(a, b.childCount > 1 || h <= e).append(a) : a.append(c.contentMatchAt(c.childCount).fillBefore(F.Fragment.empty, true));
                }
                return b.replaceChild(d < 0 ? 0 : b.childCount - 1, c.copy(a));
            }
            function bE(a, b, c) {
                if (b < a.openStart) {
                    a = new F.Slice(bD(a.content, -1, b, a.openStart, 0, a.openEnd), b, a.openEnd);
                }
                if (c < a.openEnd) {
                    a = new F.Slice(bD(a.content, 1, c, a.openEnd, 0, 0), a.openStart, c);
                }
                return a;
            }
            var bF = {
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
            var bG = null;
            function bH() {
                return (bG || (bG = document.implementation.createHTMLDocument("title")));
            }
            function bI(a) {
                var e = /^(\s*<meta [^>]*>)*/.exec(a);
                if (e) {
                    a = a.slice(e[0].length);
                }
                var c = bH().createElement("div");
                var f = /<([a-z][^>\s]+)/i.exec(a), b;
                if ((b = f && bF[f[1].toLowerCase()])) {
                    a = b.map(function(a) {
                        return "<" + a + ">";
                    }).join("") + a + b.map(function(a) {
                        return "</" + a + ">";
                    }).reverse().join("");
                }
                c.innerHTML = a;
                if (b) {
                    for(var d = 0; d < b.length; d++){
                        c = c.querySelector(b[d]) || c;
                    }
                }
                return c;
            }
            function bJ(d) {
                var e = d.querySelectorAll(a.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space");
                for(var c = 0; c < e.length; c++){
                    var b = e[c];
                    if (b.childNodes.length == 1 && b.textContent == "\u00a0" && b.parentNode) {
                        b.parentNode.replaceChild(d.ownerDocument.createTextNode(" "), b);
                    }
                }
            }
            function bK(a, h) {
                if (!a.size) {
                    return a;
                }
                var i = a.content.firstChild.type.schema, b;
                try {
                    b = JSON.parse(h);
                } catch (j) {
                    return a;
                }
                var d = a.content;
                var f = a.openStart;
                var g = a.openEnd;
                for(var c = b.length - 2; c >= 0; c -= 2){
                    var e = i.nodes[b[c]];
                    if (!e || e.hasRequiredAttrs()) {
                        break;
                    }
                    d = F.Fragment.from(e.create(b[c + 1], d));
                    f++;
                    g++;
                }
                return new F.Slice(d, f, g);
            }
            var bL = {
                childList: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: true,
                attributeOldValue: true,
                subtree: true
            };
            var bM = a.ie && a.ie_version <= 11;
            var A = function a() {
                this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
            };
            A.prototype.set = function b(a) {
                this.anchorNode = a.anchorNode;
                this.anchorOffset = a.anchorOffset;
                this.focusNode = a.focusNode;
                this.focusOffset = a.focusOffset;
            };
            A.prototype.eq = function b(a) {
                return (a.anchorNode == this.anchorNode && a.anchorOffset == this.anchorOffset && a.focusNode == this.focusNode && a.focusOffset == this.focusOffset);
            };
            var f = function d(b, c) {
                var e = this;
                this.view = b;
                this.handleDOMChange = c;
                this.queue = [];
                this.flushingSoon = -1;
                this.observer = window.MutationObserver && new window.MutationObserver(function(b) {
                    for(var c = 0; c < b.length; c++){
                        e.queue.push(b[c]);
                    }
                    if (a.ie && a.ie_version <= 11 && b.some(function(a) {
                        return ((a.type == "childList" && a.removedNodes.length) || (a.type == "characterData" && a.oldValue.length > a.target.nodeValue.length));
                    })) {
                        e.flushSoon();
                    } else {
                        e.flush();
                    }
                });
                this.currentSelection = new A();
                if (bM) {
                    this.onCharData = function(a) {
                        e.queue.push({
                            target: a.target,
                            type: "characterData",
                            oldValue: a.prevValue
                        });
                        e.flushSoon();
                    };
                }
                this.onSelectionChange = this.onSelectionChange.bind(this);
                this.suppressingSelectionUpdates = false;
            };
            f.prototype.flushSoon = function a() {
                var b = this;
                if (this.flushingSoon < 0) {
                    this.flushingSoon = window.setTimeout(function() {
                        b.flushingSoon = -1;
                        b.flush();
                    }, 20);
                }
            };
            f.prototype.forceFlush = function a() {
                if (this.flushingSoon > -1) {
                    window.clearTimeout(this.flushingSoon);
                    this.flushingSoon = -1;
                    this.flush();
                }
            };
            f.prototype.start = function a() {
                if (this.observer) {
                    this.observer.observe(this.view.dom, bL);
                }
                if (bM) {
                    this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.connectSelection();
            };
            f.prototype.stop = function c() {
                var d = this;
                if (this.observer) {
                    var a = this.observer.takeRecords();
                    if (a.length) {
                        for(var b = 0; b < a.length; b++){
                            this.queue.push(a[b]);
                        }
                        window.setTimeout(function() {
                            return d.flush();
                        }, 20);
                    }
                    this.observer.disconnect();
                }
                if (bM) {
                    this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
                }
                this.disconnectSelection();
            };
            f.prototype.connectSelection = function a() {
                this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
            };
            f.prototype.disconnectSelection = function a() {
                this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
            };
            f.prototype.suppressSelectionUpdates = function a() {
                var b = this;
                this.suppressingSelectionUpdates = true;
                setTimeout(function() {
                    return (b.suppressingSelectionUpdates = false);
                }, 50);
            };
            f.prototype.onSelectionChange = function c() {
                if (!a7(this.view)) {
                    return;
                }
                if (this.suppressingSelectionUpdates) {
                    return aZ(this.view);
                }
                if (a.ie && a.ie_version <= 11 && !this.view.state.selection.empty) {
                    var b = this.view.root.getSelection();
                    if (b.focusNode && L(b.focusNode, b.focusOffset, b.anchorNode, b.anchorOffset)) {
                        return this.flushSoon();
                    }
                }
                this.flush();
            };
            f.prototype.setCurSelection = function a() {
                this.currentSelection.set(this.view.root.getSelection());
            };
            f.prototype.ignoreSelectionChange = function d(b) {
                if (b.rangeCount == 0) {
                    return true;
                }
                var a = b.getRangeAt(0).commonAncestorContainer;
                var c = this.view.docView.nearestDesc(a);
                if (c && c.ignoreMutation({
                    type: "selection",
                    target: a.nodeType == 3 ? a.parentNode : a
                })) {
                    this.setCurSelection();
                    return true;
                }
            };
            f.prototype.flush = function n() {
                if (!this.view.docView || this.flushingSoon > -1) {
                    return;
                }
                var e = this.observer ? this.observer.takeRecords() : [];
                if (this.queue.length) {
                    e = this.queue.concat(e);
                    this.queue.length = 0;
                }
                var f = this.view.root.getSelection();
                var m = !this.suppressingSelectionUpdates && !this.currentSelection.eq(f) && a8(this.view) && !this.ignoreSelectionChange(f);
                var b = -1, d = -1, k = false, g = [];
                if (this.view.editable) {
                    for(var h = 0; h < e.length; h++){
                        var c = this.registerMutation(e[h], g);
                        if (c) {
                            b = b < 0 ? c.from : Math.min(c.from, b);
                            d = d < 0 ? c.to : Math.max(c.to, d);
                            if (c.typeOver) {
                                k = true;
                            }
                        }
                    }
                }
                if (a.gecko && g.length > 1) {
                    var i = g.filter(function(a) {
                        return a.nodeName == "BR";
                    });
                    if (i.length == 2) {
                        var j = i[0];
                        var l = i[1];
                        if (j.parentNode && j.parentNode.parentNode == l.parentNode) {
                            l.remove();
                        } else {
                            j.remove();
                        }
                    }
                }
                if (b > -1 || m) {
                    if (b > -1) {
                        this.view.docView.markDirty(b, d);
                        bO(this.view);
                    }
                    this.handleDOMChange(b, d, k, g);
                    if (this.view.docView.dirty) {
                        this.view.updateState(this.view.state);
                    } else if (!this.currentSelection.eq(f)) {
                        aZ(this.view);
                    }
                    this.currentSelection.set(f);
                }
            };
            f.prototype.registerMutation = function p(b, j) {
                if (j.indexOf(b.target) > -1) {
                    return null;
                }
                var c = this.view.docView.nearestDesc(b.target);
                if (b.type == "attributes" && (c == this.view.docView || b.attributeName == "contenteditable" || (b.attributeName == "style" && !b.oldValue && !b.target.getAttribute("style")))) {
                    return null;
                }
                if (!c || c.ignoreMutation(b)) {
                    return null;
                }
                if (b.type == "childList") {
                    for(var f = 0; f < b.addedNodes.length; f++){
                        j.push(b.addedNodes[f]);
                    }
                    if (c.contentDOM && c.contentDOM != c.dom && !c.contentDOM.contains(b.target)) {
                        return {
                            from: c.posBefore,
                            to: c.posAfter
                        };
                    }
                    var d = b.previousSibling, e = b.nextSibling;
                    if (a.ie && a.ie_version <= 11 && b.addedNodes.length) {
                        for(var g = 0; g < b.addedNodes.length; g++){
                            var k = b.addedNodes[g];
                            var h = k.previousSibling;
                            var i = k.nextSibling;
                            if (!h || Array.prototype.indexOf.call(b.addedNodes, h) < 0) {
                                d = h;
                            }
                            if (!i || Array.prototype.indexOf.call(b.addedNodes, i) < 0) {
                                e = i;
                            }
                        }
                    }
                    var l = d && d.parentNode == b.target ? H(d) + 1 : 0;
                    var m = c.localPosFromDOM(b.target, l, -1);
                    var n = e && e.parentNode == b.target ? H(e) : b.target.childNodes.length;
                    var o = c.localPosFromDOM(b.target, n, 1);
                    return {
                        from: m,
                        to: o
                    };
                } else if (b.type == "attributes") {
                    return {
                        from: c.posAtStart - c.border,
                        to: c.posAtEnd + c.border
                    };
                } else {
                    return {
                        from: c.posAtStart,
                        to: c.posAtEnd,
                        typeOver: b.target.nodeValue == b.oldValue
                    };
                }
            };
            var bN = false;
            function bO(a) {
                if (bN) {
                    return;
                }
                bN = true;
                if (getComputedStyle(a.dom).whiteSpace == "normal") {
                    console["warn"]("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.");
                }
            }
            var i = {}, e = {};
            function bP(b) {
                b.shiftKey = false;
                b.mouseDown = null;
                b.lastKeyCode = null;
                b.lastKeyCodeTime = 0;
                b.lastClick = {
                    time: 0,
                    x: 0,
                    y: 0,
                    type: ""
                };
                b.lastSelectionOrigin = null;
                b.lastSelectionTime = 0;
                b.lastIOSEnter = 0;
                b.lastIOSEnterFallbackTimeout = null;
                b.lastAndroidDelete = 0;
                b.composing = false;
                b.composingTimeout = null;
                b.compositionNodes = [];
                b.compositionEndedAt = -2e8;
                b.domObserver = new f(b, function(a, c, d, e) {
                    return br(b, a, c, d, e);
                });
                b.domObserver.start();
                b.domChangeCount = 0;
                b.eventHandlers = Object.create(null);
                var c = function(a) {
                    var c = i[a];
                    b.dom.addEventListener(a, (b.eventHandlers[a] = function(a) {
                        if (bU(b, a) && !bT(b, a) && (b.editable || !(a.type in e))) {
                            c(b, a);
                        }
                    }));
                };
                for(var d in i)c(d);
                if (a.safari) {
                    b.dom.addEventListener("input", function() {
                        return null;
                    });
                }
                bS(b);
            }
            function bQ(a, b) {
                a.lastSelectionOrigin = b;
                a.lastSelectionTime = Date.now();
            }
            function bR(a) {
                a.domObserver.stop();
                for(var b in a.eventHandlers){
                    a.dom.removeEventListener(b, a.eventHandlers[b]);
                }
                clearTimeout(a.composingTimeout);
                clearTimeout(a.lastIOSEnterFallbackTimeout);
            }
            function bS(a) {
                a.someProp("handleDOMEvents", function(c) {
                    for(var b in c){
                        if (!a.eventHandlers[b]) {
                            a.dom.addEventListener(b, (a.eventHandlers[b] = function(b) {
                                return bT(a, b);
                            }));
                        }
                    }
                });
            }
            function bT(a, b) {
                return a.someProp("handleDOMEvents", function(d) {
                    var c = d[b.type];
                    return c ? c(a, b) || b.defaultPrevented : false;
                });
            }
            function bU(c, b) {
                if (!b.bubbles) {
                    return true;
                }
                if (b.defaultPrevented) {
                    return false;
                }
                for(var a = b.target; a != c.dom; a = a.parentNode){
                    if (!a || a.nodeType == 11 || (a.pmViewDesc && a.pmViewDesc.stopEvent(b))) {
                        return false;
                    }
                }
                return true;
            }
            function bV(b, a) {
                if (!bT(b, a) && i[a.type] && (b.editable || !(a.type in e))) {
                    i[a.type](b, a);
                }
            }
            e.keydown = function(c, b) {
                c.shiftKey = b.keyCode == 16 || b.shiftKey;
                if (b6(c, b)) {
                    return;
                }
                if (b.keyCode != 229) {
                    c.domObserver.forceFlush();
                }
                c.lastKeyCode = b.keyCode;
                c.lastKeyCodeTime = Date.now();
                if (a.ios && b.keyCode == 13 && !b.ctrlKey && !b.altKey && !b.metaKey) {
                    var d = Date.now();
                    c.lastIOSEnter = d;
                    c.lastIOSEnterFallbackTimeout = setTimeout(function() {
                        if (c.lastIOSEnter == d) {
                            c.someProp("handleKeyDown", function(a) {
                                return a(c, S(13, "Enter"));
                            });
                            c.lastIOSEnter = 0;
                        }
                    }, 200);
                } else if (c.someProp("handleKeyDown", function(a) {
                    return a(c, b);
                }) || bo(c, b)) {
                    b.preventDefault();
                } else {
                    bQ(c, "key");
                }
            };
            e.keyup = function(a, b) {
                if (b.keyCode == 16) {
                    a.shiftKey = false;
                }
            };
            e.keypress = function(c, b) {
                if (b6(c, b) || !b.charCode || (b.ctrlKey && !b.altKey) || (a.mac && b.metaKey)) {
                    return;
                }
                if (c.someProp("handleKeyPress", function(a) {
                    return a(c, b);
                })) {
                    b.preventDefault();
                    return;
                }
                var d = c.state.selection;
                if (!(d instanceof E.TextSelection) || !d.$from.sameParent(d.$to)) {
                    var e = String.fromCharCode(b.charCode);
                    if (!c.someProp("handleTextInput", function(a) {
                        return a(c, d.$from.pos, d.$to.pos, e);
                    })) {
                        c.dispatch(c.state.tr.insertText(e).scrollIntoView());
                    }
                    b.preventDefault();
                }
            };
            function bW(a) {
                return {
                    left: a.clientX,
                    top: a.clientY
                };
            }
            function bX(a, b) {
                var c = b.x - a.clientX, d = b.y - a.clientY;
                return c * c + d * d < 100;
            }
            function bY(d, g, h, b, i) {
                if (b == -1) {
                    return false;
                }
                var e = d.state.doc.resolve(b);
                var f = function(a) {
                    if (d.someProp(g, function(b) {
                        return a > e.depth ? b(d, h, e.nodeAfter, e.before(a), i, true) : b(d, h, e.node(a), e.before(a), i, false);
                    })) {
                        return {
                            v: true
                        };
                    }
                };
                for(var a = e.depth + 1; a > 0; a--){
                    var c = f(a);
                    if (c) return c.v;
                }
                return false;
            }
            function bZ(a, c, d) {
                if (!a.focused) {
                    a.focus();
                }
                var b = a.state.tr.setSelection(c);
                if (d == "pointer") {
                    b.setMeta("pointer", true);
                }
                a.dispatch(b);
            }
            function b$(b, c) {
                if (c == -1) {
                    return false;
                }
                var d = b.state.doc.resolve(c), a = d.nodeAfter;
                if (a && a.isAtom && E.NodeSelection.isSelectable(a)) {
                    bZ(b, new E.NodeSelection(d), "pointer");
                    return true;
                }
                return false;
            }
            function b_(d, f) {
                if (f == -1) {
                    return false;
                }
                var a = d.state.selection, g, e;
                if (a instanceof E.NodeSelection) {
                    g = a.node;
                }
                var b = d.state.doc.resolve(f);
                for(var c = b.depth + 1; c > 0; c--){
                    var h = c > b.depth ? b.nodeAfter : b.node(c);
                    if (E.NodeSelection.isSelectable(h)) {
                        if (g && a.$from.depth > 0 && c >= a.$from.depth && b.before(a.$from.depth + 1) == a.$from.pos) {
                            e = b.before(a.$from.depth);
                        } else {
                            e = b.before(c);
                        }
                        break;
                    }
                }
                if (e != null) {
                    bZ(d, E.NodeSelection.create(d.state.doc, e), "pointer");
                    return true;
                } else {
                    return false;
                }
            }
            function b0(a, c, b, d, e) {
                return (bY(a, "handleClickOn", c, b, d) || a.someProp("handleClick", function(b) {
                    return b(a, c, d);
                }) || (e ? b_(a, b) : b$(a, b)));
            }
            function b1(a, b, c, d) {
                return (bY(a, "handleDoubleClickOn", b, c, d) || a.someProp("handleDoubleClick", function(c) {
                    return c(a, b, d);
                }));
            }
            function b2(a, d, b, c) {
                return (bY(a, "handleTripleClickOn", d, b, c) || a.someProp("handleTripleClick", function(b) {
                    return b(a, d, c);
                }) || b3(a, b, c));
            }
            function b3(d, g, h) {
                if (h.button != 0) {
                    return false;
                }
                var a = d.state.doc;
                if (g == -1) {
                    if (a.inlineContent) {
                        bZ(d, E.TextSelection.create(a, 0, a.content.size), "pointer");
                        return true;
                    }
                    return false;
                }
                var b = a.resolve(g);
                for(var c = b.depth + 1; c > 0; c--){
                    var e = c > b.depth ? b.nodeAfter : b.node(c);
                    var f = b.before(c);
                    if (e.inlineContent) {
                        bZ(d, E.TextSelection.create(a, f + 1, f + 1 + e.content.size), "pointer");
                    } else if (E.NodeSelection.isSelectable(e)) {
                        bZ(d, E.NodeSelection.create(a, f), "pointer");
                    } else {
                        continue;
                    }
                    return true;
                }
            }
            function b4(a) {
                return cb(a);
            }
            var b5 = a.mac ? "metaKey" : "ctrlKey";
            i.mousedown = function(a, b) {
                a.shiftKey = b.shiftKey;
                var f = b4(a);
                var e = Date.now(), c = "singleClick";
                if (e - a.lastClick.time < 500 && bX(b, a.lastClick) && !b[b5]) {
                    if (a.lastClick.type == "singleClick") {
                        c = "doubleClick";
                    } else if (a.lastClick.type == "doubleClick") {
                        c = "tripleClick";
                    }
                }
                a.lastClick = {
                    time: e,
                    x: b.clientX,
                    y: b.clientY,
                    type: c
                };
                var d = a.posAtCoords(bW(b));
                if (!d) {
                    return;
                }
                if (c == "singleClick") {
                    if (a.mouseDown) {
                        a.mouseDown.done();
                    }
                    a.mouseDown = new r(a, d, b, f);
                } else if ((c == "doubleClick" ? b1 : b2)(a, d.pos, d.inside, b)) {
                    b.preventDefault();
                } else {
                    bQ(a, "pointer");
                }
            };
            var r = function m(b, c, d, i) {
                var n = this;
                this.view = b;
                this.startDoc = b.state.doc;
                this.pos = c;
                this.event = d;
                this.flushed = i;
                this.selectNode = d[b5];
                this.allowDefault = d.shiftKey;
                this.delayedSelectionSync = false;
                var e, f;
                if (c.inside > -1) {
                    e = b.state.doc.nodeAt(c.inside);
                    f = c.inside;
                } else {
                    var g = b.state.doc.resolve(c.pos);
                    e = g.parent;
                    f = g.depth ? g.before() : 0;
                }
                this.mightDrag = null;
                var j = i ? null : d.target;
                var k = j ? b.docView.nearestDesc(j, true) : null;
                this.target = k ? k.dom : null;
                var l = b.state;
                var h = l.selection;
                if ((d.button == 0 && e.type.spec.draggable && e.type.spec.selectable !== false) || (h instanceof E.NodeSelection && h.from <= f && h.to > f)) {
                    this.mightDrag = {
                        node: e,
                        pos: f,
                        addAttr: this.target && !this.target.draggable,
                        setUneditable: this.target && a.gecko && !this.target.hasAttribute("contentEditable")
                    };
                }
                if (this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable)) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.draggable = true;
                    }
                    if (this.mightDrag.setUneditable) {
                        setTimeout(function() {
                            if (n.view.mouseDown == n) {
                                n.target.setAttribute("contentEditable", "false");
                            }
                        }, 20);
                    }
                    this.view.domObserver.start();
                }
                b.root.addEventListener("mouseup", (this.up = this.up.bind(this)));
                b.root.addEventListener("mousemove", (this.move = this.move.bind(this)));
                bQ(b, "pointer");
            };
            r.prototype.done = function a() {
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
                        return aZ(b.view);
                    });
                }
                this.view.mouseDown = null;
            };
            r.prototype.up = function d(b) {
                this.done();
                if (!this.view.dom.contains(b.target.nodeType == 3 ? b.target.parentNode : b.target)) {
                    return;
                }
                var c = this.pos;
                if (this.view.state.doc != this.startDoc) {
                    c = this.view.posAtCoords(bW(b));
                }
                if (this.allowDefault || !c) {
                    bQ(this.view, "pointer");
                } else if (b0(this.view, c.pos, c.inside, b, this.selectNode)) {
                    b.preventDefault();
                } else if (b.button == 0 && (this.flushed || (a.safari && this.mightDrag && !this.mightDrag.node.isAtom) || (a.chrome && !(this.view.state.selection instanceof E.TextSelection) && Math.min(Math.abs(c.pos - this.view.state.selection.from), Math.abs(c.pos - this.view.state.selection.to)) <= 2))) {
                    bZ(this.view, E.Selection.near(this.view.state.doc.resolve(c.pos)), "pointer");
                    b.preventDefault();
                } else {
                    bQ(this.view, "pointer");
                }
            };
            r.prototype.move = function b(a) {
                if (!this.allowDefault && (Math.abs(this.event.x - a.clientX) > 4 || Math.abs(this.event.y - a.clientY) > 4)) {
                    this.allowDefault = true;
                }
                bQ(this.view, "pointer");
                if (a.buttons == 0) {
                    this.done();
                }
            };
            i.touchdown = function(a) {
                b4(a);
                bQ(a, "pointer");
            };
            i.contextmenu = function(a) {
                return b4(a);
            };
            function b6(b, c) {
                if (b.composing) {
                    return true;
                }
                if (a.safari && Math.abs(c.timeStamp - b.compositionEndedAt) < 500) {
                    b.compositionEndedAt = -2e8;
                    return true;
                }
                return false;
            }
            var b7 = a.android ? 5000 : -1;
            e.compositionstart = e.compositionupdate = function(b) {
                if (!b.composing) {
                    b.domObserver.flush();
                    var f = b.state;
                    var c = f.selection.$from;
                    if (f.selection.empty && (f.storedMarks || (!c.textOffset && c.parentOffset && c.nodeBefore.marks.some(function(a) {
                        return a.type.spec.inclusive === false;
                    })))) {
                        b.markCursor = b.state.storedMarks || c.marks();
                        cb(b, true);
                        b.markCursor = null;
                    } else {
                        cb(b);
                        if (a.gecko && f.selection.empty && c.parentOffset && !c.textOffset && c.nodeBefore.marks.length) {
                            var h = b.root.getSelection();
                            for(var d = h.focusNode, g = h.focusOffset; d && d.nodeType == 1 && g != 0;){
                                var e = g < 0 ? d.lastChild : d.childNodes[g - 1];
                                if (!e) {
                                    break;
                                }
                                if (e.nodeType == 3) {
                                    h.collapse(e, e.nodeValue.length);
                                    break;
                                } else {
                                    d = e;
                                    g = -1;
                                }
                            }
                        }
                    }
                    b.composing = true;
                }
                b8(b, b7);
            };
            e.compositionend = function(a, b) {
                if (a.composing) {
                    a.composing = false;
                    a.compositionEndedAt = b.timeStamp;
                    b8(a, 20);
                }
            };
            function b8(a, b) {
                clearTimeout(a.composingTimeout);
                if (b > -1) {
                    a.composingTimeout = setTimeout(function() {
                        return cb(a);
                    }, b);
                }
            }
            function b9(a) {
                if (a.composing) {
                    a.composing = false;
                    a.compositionEndedAt = ca();
                }
                while(a.compositionNodes.length > 0){
                    a.compositionNodes.pop().markParentsDirty();
                }
            }
            function ca() {
                var a = document.createEvent("Event");
                a.initEvent("event", true, true);
                return a.timeStamp;
            }
            function cb(a, c) {
                a.domObserver.forceFlush();
                b9(a);
                if (c || a.docView.dirty) {
                    var b = aX(a);
                    if (b && !b.eq(a.state.selection)) {
                        a.dispatch(a.state.tr.setSelection(b));
                    } else {
                        a.updateState(a.state);
                    }
                    return true;
                }
                return false;
            }
            function cc(a, b) {
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
            var cd = (a.ie && a.ie_version < 15) || (a.ios && a.webkit_version < 604);
            i.copy = e.cut = function(a, c) {
                var d = a.state.selection, g = c.type == "cut";
                if (d.empty) {
                    return;
                }
                var b = cd ? null : c.clipboardData;
                var h = d.content();
                var e = bx(a, h);
                var f = e.dom;
                var i = e.text;
                if (b) {
                    c.preventDefault();
                    b.clearData();
                    b.setData("text/html", f.innerHTML);
                    b.setData("text/plain", i);
                } else {
                    cc(a, f);
                }
                if (g) {
                    a.dispatch(a.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
                }
            };
            function ce(a) {
                return a.openStart == 0 && a.openEnd == 0 && a.content.childCount == 1 ? a.content.firstChild : null;
            }
            function cf(a, d) {
                if (!a.dom.parentNode) {
                    return;
                }
                var c = a.shiftKey || a.state.selection.$from.parent.type.spec.code;
                var b = a.dom.parentNode.appendChild(document.createElement(c ? "textarea" : "div"));
                if (!c) {
                    b.contentEditable = "true";
                }
                b.style.cssText = "position: fixed; left: -10000px; top: 10px";
                b.focus();
                setTimeout(function() {
                    a.focus();
                    if (b.parentNode) {
                        b.parentNode.removeChild(b);
                    }
                    if (c) {
                        cg(a, b.value, null, d);
                    } else {
                        cg(a, b.textContent, b.innerHTML, d);
                    }
                }, 50);
            }
            function cg(a, d, e, g) {
                var b = by(a, d, e, a.shiftKey, a.state.selection.$from);
                if (a.someProp("handlePaste", function(c) {
                    return c(a, g, b || F.Slice.empty);
                })) {
                    return true;
                }
                if (!b) {
                    return false;
                }
                var c = ce(b);
                var f = c ? a.state.tr.replaceSelectionWith(c, a.shiftKey) : a.state.tr.replaceSelection(b);
                a.dispatch(f.scrollIntoView().setMeta("paste", true).setMeta("uiEvent", "paste"));
                return true;
            }
            e.paste = function(c, a) {
                var b = cd ? null : a.clipboardData;
                if (b && cg(c, b.getData("text/plain"), b.getData("text/html"), a)) {
                    a.preventDefault();
                } else {
                    cf(c, a);
                }
            };
            var ch = function c(a, b) {
                this.slice = a;
                this.move = b;
            };
            var ci = a.mac ? "altKey" : "ctrlKey";
            i.dragstart = function(a, b) {
                var c = a.mouseDown;
                if (c) {
                    c.done();
                }
                if (!b.dataTransfer) {
                    return;
                }
                var d = a.state.selection;
                var f = d.empty ? null : a.posAtCoords(bW(b));
                if (f && f.pos >= d.from && f.pos <= (d instanceof E.NodeSelection ? d.to - 1 : d.to)) ;
                else if (c && c.mightDrag) {
                    a.dispatch(a.state.tr.setSelection(E.NodeSelection.create(a.state.doc, c.mightDrag.pos)));
                } else if (b.target && b.target.nodeType == 1) {
                    var e = a.docView.nearestDesc(b.target, true);
                    if (e && e.node.type.spec.draggable && e != a.docView) {
                        a.dispatch(a.state.tr.setSelection(E.NodeSelection.create(a.state.doc, e.posBefore)));
                    }
                }
                var g = a.state.selection.content();
                var h = bx(a, g);
                var i = h.dom;
                var j = h.text;
                b.dataTransfer.clearData();
                b.dataTransfer.setData(cd ? "Text" : "text/html", i.innerHTML);
                b.dataTransfer.effectAllowed = "copyMove";
                if (!cd) {
                    b.dataTransfer.setData("text/plain", j);
                }
                a.dragging = new ch(g, !b[ci]);
            };
            i.dragend = function(a) {
                var b = a.dragging;
                window.setTimeout(function() {
                    if (a.dragging == b) {
                        a.dragging = null;
                    }
                }, 50);
            };
            e.dragover = e.dragenter = function(b, a) {
                return a.preventDefault();
            };
            e.drop = function(b, d) {
                var i = b.dragging;
                b.dragging = null;
                if (!d.dataTransfer) {
                    return;
                }
                var j = b.posAtCoords(bW(d));
                if (!j) {
                    return;
                }
                var e = b.state.doc.resolve(j.pos);
                if (!e) {
                    return;
                }
                var c = i && i.slice;
                if (c) {
                    b.someProp("transformPasted", function(a) {
                        c = a(c);
                    });
                } else {
                    c = by(b, d.dataTransfer.getData(cd ? "Text" : "text/plain"), cd ? null : d.dataTransfer.getData("text/html"), false, e);
                }
                var l = i && !d[ci];
                if (b.someProp("handleDrop", function(a) {
                    return a(b, d, c || F.Slice.empty, l);
                })) {
                    d.preventDefault();
                    return;
                }
                if (!c) {
                    return;
                }
                d.preventDefault();
                var g = c ? (0, G.nj)(b.state.doc, e.pos, c) : e.pos;
                if (g == null) {
                    g = e.pos;
                }
                var a = b.state.tr;
                if (l) {
                    a.deleteSelection();
                }
                var f = a.mapping.map(g);
                var k = c.openStart == 0 && c.openEnd == 0 && c.content.childCount == 1;
                var m = a.doc;
                if (k) {
                    a.replaceRangeWith(f, f, c.content.firstChild);
                } else {
                    a.replaceRange(f, f, c);
                }
                if (a.doc.eq(m)) {
                    return;
                }
                var h = a.doc.resolve(f);
                if (k && E.NodeSelection.isSelectable(c.content.firstChild) && h.nodeAfter && h.nodeAfter.sameMarkup(c.content.firstChild)) {
                    a.setSelection(new E.NodeSelection(h));
                } else {
                    var n = a.mapping.map(g);
                    a.mapping.maps[a.mapping.maps.length - 1].forEach(function(b, c, d, a) {
                        return (n = a);
                    });
                    a.setSelection(a6(b, h, a.doc.resolve(n)));
                }
                b.focus();
                b.dispatch(a.setMeta("uiEvent", "drop"));
            };
            i.focus = function(a) {
                if (!a.focused) {
                    a.domObserver.stop();
                    a.dom.classList.add("ProseMirror-focused");
                    a.domObserver.start();
                    a.focused = true;
                    setTimeout(function() {
                        if (a.docView && a.hasFocus() && !a.domObserver.currentSelection.eq(a.root.getSelection())) {
                            aZ(a);
                        }
                    }, 20);
                }
            };
            i.blur = function(a, b) {
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
            i.beforeinput = function(b, c) {
                if (a.chrome && a.android && c.inputType == "deleteContentBackward") {
                    var d = b.domChangeCount;
                    setTimeout(function() {
                        if (b.domChangeCount != d) {
                            return;
                        }
                        b.dom.blur();
                        b.focus();
                        if (b.someProp("handleKeyDown", function(a) {
                            return a(b, S(8, "Backspace"));
                        })) {
                            return;
                        }
                        var c = b.state.selection;
                        var a = c.$cursor;
                        if (a && a.pos > 0) {
                            b.dispatch(b.state.tr.delete(a.pos - 1, a.pos).scrollIntoView());
                        }
                    }, 50);
                }
            };
            for(var B in e){
                i[B] = e[B];
            }
            function cj(a, b) {
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
            var s = function c(a, b) {
                this.spec = b || cl;
                this.side = this.spec.side || 0;
                this.toDOM = a;
            };
            s.prototype.map = function h(d, e, a, f) {
                var b = d.mapResult(e.from + f, this.side < 0 ? -1 : 1);
                var c = b.pos;
                var g = b.deleted;
                return g ? null : new j(c - a, c - a, this);
            };
            s.prototype.valid = function a() {
                return true;
            };
            s.prototype.eq = function b(a) {
                return (this == a || (a instanceof s && ((this.spec.key && this.spec.key == a.spec.key) || (this.toDOM == a.toDOM && cj(this.spec, a.spec)))));
            };
            var m = function c(a, b) {
                this.spec = b || cl;
                this.attrs = a;
            };
            m.prototype.map = function g(a, b, c, d) {
                var e = a.map(b.from + d, this.spec.inclusiveStart ? -1 : 1) - c;
                var f = a.map(b.to + d, this.spec.inclusiveEnd ? 1 : -1) - c;
                return e >= f ? null : new j(e, f, this);
            };
            m.prototype.valid = function b(c, a) {
                return a.from < a.to;
            };
            m.prototype.eq = function b(a) {
                return (this == a || (a instanceof m && cj(this.attrs, a.attrs) && cj(this.spec, a.spec)));
            };
            m.is = function b(a) {
                return a.type instanceof m;
            };
            var t = function c(a, b) {
                this.spec = b || cl;
                this.attrs = a;
            };
            t.prototype.map = function g(c, d, e, f) {
                var a = c.mapResult(d.from + f, 1);
                if (a.deleted) {
                    return null;
                }
                var b = c.mapResult(d.to + f, -1);
                if (b.deleted || b.pos <= a.pos) {
                    return null;
                }
                return new j(a.pos - e, b.pos - e, this);
            };
            t.prototype.valid = function g(b, a) {
                var c = b.content.findIndex(a.from);
                var f = c.index;
                var d = c.offset;
                var e;
                return (d == a.from && !(e = b.child(f)).isText && d + e.nodeSize == a.to);
            };
            t.prototype.eq = function b(a) {
                return (this == a || (a instanceof t && cj(this.attrs, a.attrs) && cj(this.spec, a.spec)));
            };
            var j = function d(a, b, c) {
                this.from = a;
                this.to = b;
                this.type = c;
            };
            var u = {
                spec: {
                    configurable: true
                },
                inline: {
                    configurable: true
                }
            };
            j.prototype.copy = function c(a, b) {
                return new j(a, b, this.type);
            };
            j.prototype.eq = function c(b, a) {
                if (a === void 0) a = 0;
                return (this.type.eq(b.type) && this.from + a == b.from && this.to + a == b.to);
            };
            j.prototype.map = function d(a, b, c) {
                return this.type.map(a, this, b, c);
            };
            j.widget = function d(a, b, c) {
                return new j(a, a, new s(b, c));
            };
            j.inline = function e(a, b, c, d) {
                return new j(a, b, new m(c, d));
            };
            j.node = function e(a, b, c, d) {
                return new j(a, b, new t(c, d));
            };
            u.spec.get = function() {
                return this.type.spec;
            };
            u.inline.get = function() {
                return this.type instanceof m;
            };
            Object.defineProperties(j.prototype, u);
            var ck = [], cl = {};
            var d = function c(a, b) {
                this.local = a && a.length ? a : ck;
                this.children = b && b.length ? b : ck;
            };
            d.create = function c(b, a) {
                return a.length ? cr(a, b, 0, cl) : C;
            };
            d.prototype.find = function e(a, b, d) {
                var c = [];
                this.findInner(a == null ? 0 : a, b == null ? 1e9 : b, c, 0, d);
                return c;
            };
            d.prototype.findInner = function j(c, d, i, e, f) {
                for(var g = 0; g < this.local.length; g++){
                    var a = this.local[g];
                    if (a.from <= d && a.to >= c && (!f || f(a.spec))) {
                        i.push(a.copy(a.from + e, a.to + e));
                    }
                }
                for(var b = 0; b < this.children.length; b += 3){
                    if (this.children[b] < d && this.children[b + 1] > c) {
                        var h = this.children[b] + 1;
                        this.children[b + 2].findInner(c - h, d - h, i, e + h, f);
                    }
                }
            };
            d.prototype.map = function d(a, b, c) {
                if (this == C || a.maps.length == 0) {
                    return this;
                }
                return this.mapInner(a, b, 0, 0, c || cl);
            };
            d.prototype.mapInner = function j(f, g, h, i, e) {
                var a;
                for(var b = 0; b < this.local.length; b++){
                    var c = this.local[b].map(f, h, i);
                    if (c && c.type.valid(g, c)) {
                        (a || (a = [])).push(c);
                    } else if (e.onRemove) {
                        e.onRemove(this.local[b].spec);
                    }
                }
                if (this.children.length) {
                    return cm(this.children, a, f, g, h, i, e);
                } else {
                    return a ? new d(a.sort(cs)) : C;
                }
            };
            d.prototype.add = function c(b, a) {
                if (!a.length) {
                    return this;
                }
                if (this == C) {
                    return d.create(b, a);
                }
                return this.addInner(b, a, 0);
            };
            d.prototype.addInner = function i(c, e, f) {
                var j = this;
                var g, h = 0;
                c.forEach(function(b, a) {
                    var c = a + f, d;
                    if (!(d = cp(e, b, c))) {
                        return;
                    }
                    if (!g) {
                        g = j.children.slice();
                    }
                    while(h < g.length && g[h] < a){
                        h += 3;
                    }
                    if (g[h] == a) {
                        g[h + 2] = g[h + 2].addInner(b, d, c + 1);
                    } else {
                        g.splice(h, 0, a, a + b.nodeSize, cr(d, b, c + 1, cl));
                    }
                    h += 3;
                });
                var a = cn(h ? cq(e) : e, -f);
                for(var b = 0; b < a.length; b++){
                    if (!a[b].type.valid(c, a[b])) {
                        a.splice(b--, 1);
                    }
                }
                return new d(a.length ? this.local.concat(a).sort(cs) : this.local, g || this.children);
            };
            d.prototype.remove = function b(a) {
                if (a.length == 0 || this == C) {
                    return this;
                }
                return this.removeInner(a, 0);
            };
            d.prototype.removeInner = function p(e, j) {
                var a = this.children, b = this.local;
                for(var c = 0; c < a.length; c += 3){
                    var f = void 0, l = a[c] + j, o = a[c + 1] + j;
                    for(var g = 0, h = void 0; g < e.length; g++){
                        if ((h = e[g])) {
                            if (h.from > l && h.to < o) {
                                e[g] = null;
                                (f || (f = [])).push(h);
                            }
                        }
                    }
                    if (!f) {
                        continue;
                    }
                    if (a == this.children) {
                        a = this.children.slice();
                    }
                    var m = a[c + 2].removeInner(f, l + 1);
                    if (m != C) {
                        a[c + 2] = m;
                    } else {
                        a.splice(c, 3);
                        c -= 3;
                    }
                }
                if (b.length) {
                    for(var k = 0, n = void 0; k < e.length; k++){
                        if ((n = e[k])) {
                            for(var i = 0; i < b.length; i++){
                                if (b[i].eq(n, j)) {
                                    if (b == this.local) {
                                        b = this.local.slice();
                                    }
                                    b.splice(i--, 1);
                                }
                            }
                        }
                    }
                }
                if (a == this.children && b == this.local) {
                    return this;
                }
                return b.length || a.length ? new d(b, a) : C;
            };
            d.prototype.forChild = function p(g, i) {
                if (this == C) {
                    return this;
                }
                if (i.isLeaf) {
                    return d.empty;
                }
                var e, f;
                for(var b = 0; b < this.children.length; b += 3){
                    if (this.children[b] >= g) {
                        if (this.children[b] == g) {
                            e = this.children[b + 2];
                        }
                        break;
                    }
                }
                var c = g + 1, j = c + i.content.size;
                for(var h = 0; h < this.local.length; h++){
                    var a = this.local[h];
                    if (a.from < j && a.to > c && a.type instanceof m) {
                        var k = Math.max(c, a.from) - c, n = Math.min(j, a.to) - c;
                        if (k < n) {
                            (f || (f = [])).push(a.copy(k, n));
                        }
                    }
                }
                if (f) {
                    var o = new d(f.sort(cs));
                    return e ? new l([
                        o,
                        e
                    ]) : o;
                }
                return e || C;
            };
            d.prototype.eq = function e(a) {
                if (this == a) {
                    return true;
                }
                if (!(a instanceof d) || this.local.length != a.local.length || this.children.length != a.children.length) {
                    return false;
                }
                for(var c = 0; c < this.local.length; c++){
                    if (!this.local[c].eq(a.local[c])) {
                        return false;
                    }
                }
                for(var b = 0; b < this.children.length; b += 3){
                    if (this.children[b] != a.children[b] || this.children[b + 1] != a.children[b + 1] || !this.children[b + 2].eq(a.children[b + 2])) {
                        return false;
                    }
                }
                return true;
            };
            d.prototype.locals = function b(a) {
                return ct(this.localsInner(a));
            };
            d.prototype.localsInner = function d(c) {
                if (this == C) {
                    return ck;
                }
                if (c.inlineContent || !this.local.some(m.is)) {
                    return this.local;
                }
                var b = [];
                for(var a = 0; a < this.local.length; a++){
                    if (!(this.local[a].type instanceof m)) {
                        b.push(this.local[a]);
                    }
                }
                return b;
            };
            var C = new d();
            d.empty = C;
            d.removeOverlap = ct;
            var l = function b(a) {
                this.members = a;
            };
            l.prototype.map = function b(c, d) {
                var a = this.members.map(function(a) {
                    return a.map(c, d, cl);
                });
                return l.from(a);
            };
            l.prototype.forChild = function g(f, e) {
                if (e.isLeaf) {
                    return d.empty;
                }
                var a = [];
                for(var c = 0; c < this.members.length; c++){
                    var b = this.members[c].forChild(f, e);
                    if (b == C) {
                        continue;
                    }
                    if (b instanceof l) {
                        a = a.concat(b.members);
                    } else {
                        a.push(b);
                    }
                }
                return l.from(a);
            };
            l.prototype.eq = function c(b) {
                if (!(b instanceof l) || b.members.length != this.members.length) {
                    return false;
                }
                for(var a = 0; a < this.members.length; a++){
                    if (!this.members[a].eq(b.members[a])) {
                        return false;
                    }
                }
                return true;
            };
            l.prototype.locals = function b(f) {
                var a, c = true;
                for(var d = 0; d < this.members.length; d++){
                    var b = this.members[d].localsInner(f);
                    if (!b.length) {
                        continue;
                    }
                    if (!a) {
                        a = b;
                    } else {
                        if (c) {
                            a = a.slice();
                            c = false;
                        }
                        for(var e = 0; e < b.length; e++){
                            a.push(b[e]);
                        }
                    }
                }
                return a ? ct(c ? a : a.sort(cs)) : ck;
            };
            l.from = function b(a) {
                switch(a.length){
                    case 0:
                        return C;
                    case 1:
                        return a[0];
                    default:
                        return new l(a);
                }
            };
            function cm(g, j, c, k, o, l, p) {
                var a = g.slice();
                var x = function(d, e, f, h) {
                    for(var b = 0; b < a.length; b += 3){
                        var g = a[b + 1], c = void 0;
                        if (g == -1 || d > g + l) {
                            continue;
                        }
                        if (e >= a[b] + l) {
                            a[b + 1] = -1;
                        } else if (f >= o && (c = h - f - (e - d))) {
                            a[b] += c;
                            a[b + 1] += c;
                        }
                    }
                };
                for(var q = 0; q < c.maps.length; q++){
                    c.maps[q].forEach(x);
                }
                var m = false;
                for(var b = 0; b < a.length; b += 3){
                    if (a[b + 1] == -1) {
                        var s = c.map(g[b] + l), h = s - o;
                        if (h < 0 || h >= k.content.size) {
                            m = true;
                            continue;
                        }
                        var y = c.map(g[b + 1] + l, -1), t = y - o;
                        var u = k.content.findIndex(h);
                        var z = u.index;
                        var v = u.offset;
                        var r = k.maybeChild(z);
                        if (r && v == h && v + r.nodeSize == t) {
                            var w = a[b + 2].mapInner(c, r, s + 1, g[b] + l + 1, p);
                            if (w != C) {
                                a[b] = h;
                                a[b + 1] = t;
                                a[b + 2] = w;
                            } else {
                                a[b + 1] = -2;
                                m = true;
                            }
                        } else {
                            m = true;
                        }
                    }
                }
                if (m) {
                    var A = co(a, g, j || [], c, o, l, p);
                    var e = cr(A, k, 0, p);
                    j = e.local;
                    for(var i = 0; i < a.length; i += 3){
                        if (a[i + 1] < 0) {
                            a.splice(i, 3);
                            i -= 3;
                        }
                    }
                    for(var f = 0, n = 0; f < e.children.length; f += 3){
                        var B = e.children[f];
                        while(n < a.length && a[n] < B){
                            n += 3;
                        }
                        a.splice(n, 0, e.children[f], e.children[f + 1], e.children[f + 2]);
                    }
                }
                return new d(j && j.sort(cs), a);
            }
            function cn(a, b) {
                if (!b || !a.length) {
                    return a;
                }
                var e = [];
                for(var c = 0; c < a.length; c++){
                    var d = a[c];
                    e.push(new j(d.from + b, d.to + b, d.type));
                }
                return e;
            }
            function co(b, c, d, g, h, e, i) {
                function f(a, e) {
                    for(var b = 0; b < a.local.length; b++){
                        var j = a.local[b].map(g, h, e);
                        if (j) {
                            d.push(j);
                        } else if (i.onRemove) {
                            i.onRemove(a.local[b].spec);
                        }
                    }
                    for(var c = 0; c < a.children.length; c += 3){
                        f(a.children[c + 2], a.children[c] + e + 1);
                    }
                }
                for(var a = 0; a < b.length; a += 3){
                    if (b[a + 1] == -1) {
                        f(b[a + 2], c[a] + e + 1);
                    }
                }
                return d;
            }
            function cp(c, e, f) {
                if (e.isLeaf) {
                    return null;
                }
                var g = f + e.nodeSize, d = null;
                for(var a = 0, b = void 0; a < c.length; a++){
                    if ((b = c[a]) && b.from > f && b.to < g) {
                        (d || (d = [])).push(b);
                        c[a] = null;
                    }
                }
                return d;
            }
            function cq(b) {
                var c = [];
                for(var a = 0; a < b.length; a++){
                    if (b[a] != null) {
                        c.push(b[a]);
                    }
                }
                return c;
            }
            function cr(c, e, h, f) {
                var g = [], i = false;
                e.forEach(function(b, a) {
                    var d = cp(c, b, a + h);
                    if (d) {
                        i = true;
                        var e = cr(d, b, h + a + 1, f);
                        if (e != C) {
                            g.push(a, a + b.nodeSize, e);
                        }
                    }
                });
                var a = cn(i ? cq(c) : c, -h).sort(cs);
                for(var b = 0; b < a.length; b++){
                    if (!a[b].type.valid(e, a[b])) {
                        if (f.onRemove) {
                            f.onRemove(a[b].spec);
                        }
                        a.splice(b--, 1);
                    }
                }
                return a.length || g.length ? new d(a, g) : C;
            }
            function cs(a, b) {
                return a.from - b.from || a.to - b.to;
            }
            function ct(e) {
                var a = e;
                for(var f = 0; f < a.length - 1; f++){
                    var b = a[f];
                    if (b.from != b.to) {
                        for(var d = f + 1; d < a.length; d++){
                            var c = a[d];
                            if (c.from == b.from) {
                                if (c.to != b.to) {
                                    if (a == e) {
                                        a = e.slice();
                                    }
                                    a[d] = c.copy(c.from, b.to);
                                    cu(a, d + 1, c.copy(b.to, c.to));
                                }
                                continue;
                            } else {
                                if (c.from < b.to) {
                                    if (a == e) {
                                        a = e.slice();
                                    }
                                    a[f] = b.copy(b.from, c.from);
                                    cu(a, d, b.copy(c.from, b.to));
                                }
                                break;
                            }
                        }
                    }
                }
                return a;
            }
            function cu(b, a, c) {
                while(a < b.length && cs(c, b[a]) > 0){
                    a++;
                }
                b.splice(a, 0, c);
            }
            function cv(a) {
                var b = [];
                a.someProp("decorations", function(d) {
                    var c = d(a.state);
                    if (c && c != C) {
                        b.push(c);
                    }
                });
                if (a.cursorWrapper) {
                    b.push(d.create(a.state.doc, [
                        a.cursorWrapper.deco, 
                    ]));
                }
                return l.from(b);
            }
            var c = function c(a, b) {
                this._props = b;
                this.state = b.state;
                this.directPlugins = b.plugins || [];
                this.directPlugins.forEach(cC);
                this.dispatch = this.dispatch.bind(this);
                this._root = null;
                this.focused = false;
                this.trackWrites = null;
                this.dom = (a && a.mount) || document.createElement("div");
                if (a) {
                    if (a.appendChild) {
                        a.appendChild(this.dom);
                    } else if (a.apply) {
                        a(this.dom);
                    } else if (a.mount) {
                        this.mounted = true;
                    }
                }
                this.editable = cy(this);
                this.markCursor = null;
                this.cursorWrapper = null;
                cx(this);
                this.nodeViews = cA(this);
                this.docView = aE(this.state.doc, cw(this), cv(this), this.dom, this);
                this.lastSelectedViewDesc = null;
                this.dragging = null;
                bP(this);
                this.prevDirectPlugins = [];
                this.pluginViews = [];
                this.updatePluginViews();
            };
            var v = {
                props: {
                    configurable: true
                },
                root: {
                    configurable: true
                }
            };
            v.props.get = function() {
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
            c.prototype.update = function b(a) {
                if (a.handleDOMEvents != this._props.handleDOMEvents) {
                    bS(this);
                }
                this._props = a;
                if (a.plugins) {
                    a.plugins.forEach(cC);
                    this.directPlugins = a.plugins;
                }
                this.updateStateInner(a.state, true);
            };
            c.prototype.setProps = function e(b) {
                var a = {};
                for(var c in this._props){
                    a[c] = this._props[c];
                }
                a.state = this.state;
                for(var d in b){
                    a[d] = b[d];
                }
                this.update(a);
            };
            c.prototype.updateState = function b(a) {
                this.updateStateInner(a, this.state.plugins != a.plugins);
            };
            c.prototype.updateStateInner = function p(b, k) {
                var q = this;
                var c = this.state, e = false, d = false;
                if (b.storedMarks && this.composing) {
                    b9(this);
                    d = true;
                }
                this.state = b;
                if (k) {
                    var l = cA(this);
                    if (cB(l, this.nodeViews)) {
                        this.nodeViews = l;
                        e = true;
                    }
                    bS(this);
                }
                this.editable = cy(this);
                cx(this);
                var f = cv(this), g = cw(this);
                var h = k ? "reset" : b.scrollToSelection > c.scrollToSelection ? "to selection" : "preserve";
                var i = e || !this.docView.matchesNode(b.doc, g, f);
                if (i || !b.selection.eq(c.selection)) {
                    d = true;
                }
                var m = h == "preserve" && d && this.dom.style.overflowAnchor == null && X(this);
                if (d) {
                    this.domObserver.stop();
                    var j = i && (a.ie || a.chrome) && !this.composing && !c.selection.empty && !b.selection.empty && cz(c.selection, b.selection);
                    if (i) {
                        var o = a.chrome ? (this.trackWrites = this.root.getSelection().focusNode) : null;
                        if (e || !this.docView.update(b.doc, g, f, this)) {
                            this.docView.updateOuterDeco([]);
                            this.docView.destroy();
                            this.docView = aE(b.doc, g, f, this.dom, this);
                        }
                        if (o && !this.trackWrites) {
                            j = true;
                        }
                    }
                    if (j || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && a9(this))) {
                        aZ(this, j);
                    } else {
                        a4(this, b.selection);
                        this.domObserver.setCurSelection();
                    }
                    this.domObserver.start();
                }
                this.updatePluginViews(c);
                if (h == "reset") {
                    this.dom.scrollTop = 0;
                } else if (h == "to selection") {
                    var n = this.root.getSelection().focusNode;
                    if (this.someProp("handleScrollToSelection", function(a) {
                        return a(q);
                    })) ;
                    else if (b.selection instanceof E.NodeSelection) {
                        W(this, this.docView.domAfterPos(b.selection.from).getBoundingClientRect(), n);
                    } else {
                        W(this, this.coordsAtPos(b.selection.head, 1), n);
                    }
                } else if (m) {
                    Z(m);
                }
            };
            c.prototype.destroyPluginViews = function b() {
                var a;
                while((a = this.pluginViews.pop())){
                    if (a.destroy) {
                        a.destroy();
                    }
                }
            };
            c.prototype.updatePluginViews = function h(a) {
                if (!a || a.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
                    this.prevDirectPlugins = this.directPlugins;
                    this.destroyPluginViews();
                    for(var b = 0; b < this.directPlugins.length; b++){
                        var e = this.directPlugins[b];
                        if (e.spec.view) {
                            this.pluginViews.push(e.spec.view(this));
                        }
                    }
                    for(var c = 0; c < this.state.plugins.length; c++){
                        var f = this.state.plugins[c];
                        if (f.spec.view) {
                            this.pluginViews.push(f.spec.view(this));
                        }
                    }
                } else {
                    for(var d = 0; d < this.pluginViews.length; d++){
                        var g = this.pluginViews[d];
                        if (g.update) {
                            g.update(this, a);
                        }
                    }
                }
            };
            c.prototype.someProp = function j(c, a) {
                var d = this._props && this._props[c], b;
                if (d != null && (b = a ? a(d) : d)) {
                    return b;
                }
                for(var e = 0; e < this.directPlugins.length; e++){
                    var f = this.directPlugins[e].props[c];
                    if (f != null && (b = a ? a(f) : f)) {
                        return b;
                    }
                }
                var g = this.state.plugins;
                if (g) {
                    for(var h = 0; h < g.length; h++){
                        var i = g[h].props[c];
                        if (i != null && (b = a ? a(i) : i)) {
                            return b;
                        }
                    }
                }
            };
            c.prototype.hasFocus = function a() {
                return this.root.activeElement == this.dom;
            };
            c.prototype.focus = function a() {
                this.domObserver.stop();
                if (this.editable) {
                    aa(this.dom);
                }
                aZ(this);
                this.domObserver.start();
            };
            v.root.get = function() {
                var b = this._root;
                if (b == null) {
                    for(var a = this.dom.parentNode; a; a = a.parentNode){
                        if (a.nodeType == 9 || (a.nodeType == 11 && a.host)) {
                            if (!a.getSelection) {
                                Object.getPrototypeOf(a).getSelection = function() {
                                    return document.getSelection();
                                };
                            }
                            return (this._root = a);
                        }
                    }
                }
                return b || document;
            };
            c.prototype.posAtCoords = function b(a) {
                return ai(this, a);
            };
            c.prototype.coordsAtPos = function c(b, a) {
                if (a === void 0) a = 1;
                return al(this, b, a);
            };
            c.prototype.domAtPos = function c(b, a) {
                if (a === void 0) a = 0;
                return this.docView.domFromPos(b, a);
            };
            c.prototype.nodeDOM = function c(b) {
                var a = this.docView.descAt(b);
                return a ? a.nodeDOM : null;
            };
            c.prototype.posAtDOM = function e(c, d, a) {
                if (a === void 0) a = -1;
                var b = this.docView.posFromDOM(c, d, a);
                if (b == null) {
                    throw new RangeError("DOM position not inside the editor");
                }
                return b;
            };
            c.prototype.endOfTextblock = function c(a, b) {
                return av(this, b || this.state, a);
            };
            c.prototype.destroy = function a() {
                if (!this.docView) {
                    return;
                }
                bR(this);
                this.destroyPluginViews();
                if (this.mounted) {
                    this.docView.update(this.state.doc, [], cv(this), this);
                    this.dom.textContent = "";
                } else if (this.dom.parentNode) {
                    this.dom.parentNode.removeChild(this.dom);
                }
                this.docView.destroy();
                this.docView = null;
            };
            c.prototype.dispatchEvent = function b(a) {
                return bV(this, a);
            };
            c.prototype.dispatch = function c(a) {
                var b = this._props.dispatchTransaction;
                if (b) {
                    b.call(this, a);
                } else {
                    this.updateState(this.state.apply(a));
                }
            };
            Object.defineProperties(c.prototype, v);
            function cw(b) {
                var a = Object.create(null);
                a.class = "ProseMirror";
                a.contenteditable = String(b.editable);
                a.translate = "no";
                b.someProp("attributes", function(d) {
                    if (typeof d == "function") {
                        d = d(b.state);
                    }
                    if (d) {
                        for(var c in d){
                            if (c == "class") {
                                a.class += " " + d[c];
                            }
                            if (c == "style") {
                                a.style = (a.style ? a.style + ";" : "") + d[c];
                            } else if (!a[c] && c != "contenteditable" && c != "nodeName") {
                                a[c] = String(d[c]);
                            }
                        }
                    }
                });
                return [
                    j.node(0, b.state.doc.content.size, a)
                ];
            }
            function cx(a) {
                if (a.markCursor) {
                    var b = document.createElement("img");
                    b.className = "ProseMirror-separator";
                    b.setAttribute("mark-placeholder", "true");
                    a.cursorWrapper = {
                        dom: b,
                        deco: j.widget(a.state.selection.head, b, {
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
                a.someProp("nodeViews", function(c) {
                    for(var a in c){
                        if (!Object.prototype.hasOwnProperty.call(b, a)) {
                            b[a] = c[a];
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
