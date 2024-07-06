!// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
// This is CodeMirror (https://codemirror.net), a code editor
// implemented in JavaScript on top of the browser's DOM.
//
// You can find some technical background for some of the code below
// at http://marijnhaverbeke.nl/blog/#cm-internals .
function(global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : (global = global || self).CodeMirror = factory();
}(this, function() {
    "use strict";
    // Kludges for bugs and behavior differences that can't be feature
    // detected are enabled based on userAgent etc sniffing.
    var e, optionHandlers, helpers, range, zwspSupported, badBidiRects, measureText, lastClick, lastDoubleClick, userAgent = navigator.userAgent, platform = navigator.platform, gecko = /gecko\/\d/i.test(userAgent), ie_upto10 = /MSIE \d/.test(userAgent), ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent), edge = /Edge\/(\d+)/.exec(userAgent), ie = ie_upto10 || ie_11up || edge, ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]), webkit = !edge && /WebKit\//.test(userAgent), qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent), chrome = !edge && /Chrome\//.test(userAgent), presto = /Opera\//.test(userAgent), safari = /Apple Computer/.test(navigator.vendor), mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent), phantom = /PhantomJS/.test(userAgent), ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2), android = /Android/.test(userAgent), mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent), mac = ios || /Mac/.test(platform), chromeOS = /\bCrOS\b/.test(userAgent), windows = /win/i.test(platform), presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
    presto_version && (presto_version = Number(presto_version[1])), presto_version && presto_version >= 15 && (presto = !1, webkit = !0);
    // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
    var flipCtrlCmd = mac && (qtwebkit || presto && (null == presto_version || presto_version < 12.11)), captureRightClick = gecko || ie && ie_version >= 9;
    function classTest(cls) {
        return RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
    }
    var rmClass = function(node, cls) {
        var current = node.className, match = classTest(cls).exec(current);
        if (match) {
            var after = current.slice(match.index + match[0].length);
            node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
        }
    };
    function removeChildren(e) {
        for(var count = e.childNodes.length; count > 0; --count)e.removeChild(e.firstChild);
        return e;
    }
    function removeChildrenAndAdd(parent, e) {
        return removeChildren(parent).appendChild(e);
    }
    function elt(tag, content, className, style) {
        var e = document.createElement(tag);
        if (className && (e.className = className), style && (e.style.cssText = style), "string" == typeof content) e.appendChild(document.createTextNode(content));
        else if (content) for(var i = 0; i < content.length; ++i)e.appendChild(content[i]);
        return e;
    }
    // wrapper for elt, which removes the elt from the accessibility tree
    function eltP(tag, content, className, style) {
        var e = elt(tag, content, className, style);
        return e.setAttribute("role", "presentation"), e;
    }
    function contains(parent, child) {
        if (3 == child.nodeType && // Android browser always returns false when child is a textnode
        (child = child.parentNode), parent.contains) return parent.contains(child);
        do if (11 == child.nodeType && (child = child.host), child == parent) return !0;
        while (child = child.parentNode)
    }
    function activeElt() {
        // IE and Edge may throw an "Unspecified Error" when accessing document.activeElement.
        // IE < 10 will throw when accessed while the page is loading or in an iframe.
        // IE > 9 and Edge will throw when accessed in an iframe if document.body is unavailable.
        var activeElement;
        try {
            activeElement = document.activeElement;
        } catch (e) {
            activeElement = document.body || null;
        }
        for(; activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement;)activeElement = activeElement.shadowRoot.activeElement;
        return activeElement;
    }
    function addClass(node, cls) {
        var current = node.className;
        classTest(cls).test(current) || (node.className += (current ? " " : "") + cls);
    }
    function joinClasses(a, b) {
        for(var as = a.split(" "), i = 0; i < as.length; i++)as[i] && !classTest(as[i]).test(b) && (b += " " + as[i]);
        return b;
    }
    document.createRange ? range = function(node, start, end, endNode) {
        var r = document.createRange();
        return r.setEnd(endNode || node, end), r.setStart(node, start), r;
    } : range = function(node, start, end) {
        var r = document.body.createTextRange();
        try {
            r.moveToElementText(node.parentNode);
        } catch (e) {
            return r;
        }
        return r.collapse(!0), r.moveEnd("character", end), r.moveStart("character", start), r;
    };
    var selectInput = function(node) {
        node.select();
    };
    function bind(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return f.apply(null, args);
        };
    }
    function copyObj(obj, target, overwrite) {
        for(var prop in target || (target = {}), obj)obj.hasOwnProperty(prop) && (!1 !== overwrite || !target.hasOwnProperty(prop)) && (target[prop] = obj[prop]);
        return target;
    }
    // Counts the column offset in a string, taking tabs into account.
    // Used mostly to find indentation.
    function countColumn(string, end, tabSize, startIndex, startValue) {
        null == end && -1 == (end = string.search(/[^\s\u00a0]/)) && (end = string.length);
        for(var i = startIndex || 0, n = startValue || 0;;){
            var nextTab = string.indexOf("\t", i);
            if (nextTab < 0 || nextTab >= end) return n + (end - i);
            n += nextTab - i, n += tabSize - n % tabSize, i = nextTab + 1;
        }
    }
    ios ? // Mobile Safari apparently has a bug where select() is broken.
    selectInput = function(node) {
        node.selectionStart = 0, node.selectionEnd = node.value.length;
    } : ie && // Suppress mysterious IE10 errors
    (selectInput = function(node) {
        try {
            node.select();
        } catch (_e) {}
    });
    var Delayed = function() {
        this.id = null, this.f = null, this.time = 0, this.handler = bind(this.onTimeout, this);
    };
    function indexOf(array, elt) {
        for(var i = 0; i < array.length; ++i)if (array[i] == elt) return i;
        return -1;
    }
    Delayed.prototype.onTimeout = function(self1) {
        self1.id = 0, self1.time <= +new Date() ? self1.f() : setTimeout(self1.handler, self1.time - +new Date());
    }, Delayed.prototype.set = function(ms, f) {
        this.f = f;
        var time = +new Date() + ms;
        (!this.id || time < this.time) && (clearTimeout(this.id), this.id = setTimeout(this.handler, ms), this.time = time);
    };
    // Returned or thrown by various protocols to signal 'I'm not
    // handling this'.
    var Pass = {
        toString: function() {
            return "CodeMirror.Pass";
        }
    }, sel_dontScroll = {
        scroll: !1
    }, sel_mouse = {
        origin: "*mouse"
    }, sel_move = {
        origin: "+move"
    };
    // The inverse of countColumn -- find the offset that corresponds to
    // a particular column.
    function findColumn(string, goal, tabSize) {
        for(var pos = 0, col = 0;;){
            var nextTab = string.indexOf("\t", pos);
            -1 == nextTab && (nextTab = string.length);
            var skipped = nextTab - pos;
            if (nextTab == string.length || col + skipped >= goal) return pos + Math.min(skipped, goal - col);
            if (col += nextTab - pos, col += tabSize - col % tabSize, pos = nextTab + 1, col >= goal) return pos;
        }
    }
    var spaceStrs = [
        ""
    ];
    function spaceStr(n) {
        for(; spaceStrs.length <= n;)spaceStrs.push(lst(spaceStrs) + " ");
        return spaceStrs[n];
    }
    function lst(arr) {
        return arr[arr.length - 1];
    }
    function map(array, f) {
        for(var out = [], i = 0; i < array.length; i++)out[i] = f(array[i], i);
        return out;
    }
    function nothing() {}
    function createObj(base, props) {
        var inst;
        return Object.create ? inst = Object.create(base) : (nothing.prototype = base, inst = new nothing()), props && copyObj(props, inst), inst;
    }
    var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function isWordCharBasic(ch) {
        return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
    }
    function isWordChar(ch, helper) {
        return helper ? !!(helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) || helper.test(ch) : isWordCharBasic(ch);
    }
    function isEmpty(obj) {
        for(var n in obj)if (obj.hasOwnProperty(n) && obj[n]) return !1;
        return !0;
    }
    // Extending unicode characters. A series of a non-extending char +
    // any number of extending chars is treated as a single unit as far
    // as editing and measuring is concerned. This is not fully correct,
    // since some scripts/fonts/browsers also treat other configurations
    // of code points as a group.
    var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function isExtendingChar(ch) {
        return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
    }
    // Returns a number from the range [`0`; `str.length`] unless `pos` is outside that range.
    function skipExtendingChars(str, pos, dir) {
        for(; (dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos));)pos += dir;
        return pos;
    }
    // Returns the value from the range [`from`; `to`] that satisfies
    // `pred` and is closest to `from`. Assumes that at least `to`
    // satisfies `pred`. Supports `from` being greater than `to`.
    function findFirst(pred, from, to) {
        for(// At any point we are certain `to` satisfies `pred`, don't know
        // whether `from` does.
        var dir = from > to ? -1 : 1;;){
            if (from == to) return from;
            var midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
            if (mid == from) return pred(mid) ? from : to;
            pred(mid) ? to = mid : from = mid + dir;
        }
    }
    var bidiOther = null;
    function getBidiPartAt(order, ch, sticky) {
        var found;
        bidiOther = null;
        for(var i = 0; i < order.length; ++i){
            var cur = order[i];
            if (cur.from < ch && cur.to > ch) return i;
            cur.to == ch && (cur.from != cur.to && "before" == sticky ? found = i : bidiOther = i), cur.from == ch && (cur.from != cur.to && "before" != sticky ? found = i : bidiOther = i);
        }
        return null != found ? found : bidiOther;
    }
    // Bidirectional ordering algorithm
    // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
    // that this (partially) implements.
    // One-char codes used for character types:
    // L (L):   Left-to-Right
    // R (R):   Right-to-Left
    // r (AL):  Right-to-Left Arabic
    // 1 (EN):  European Number
    // + (ES):  European Number Separator
    // % (ET):  European Number Terminator
    // n (AN):  Arabic Number
    // , (CS):  Common Number Separator
    // m (NSM): Non-Spacing Mark
    // b (BN):  Boundary Neutral
    // s (B):   Paragraph Separator
    // t (S):   Segment Separator
    // w (WS):  Whitespace
    // N (ON):  Other Neutrals
    // Returns null if characters are ordered as they appear
    // (left-to-right), or an array of sections ({from, to, level}
    // objects) in the order in which they occur visually.
    var bidiOrdering = function() {
        var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/, isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
            this.level = level, this.from = from, this.to = to;
        }
        return function(str, direction) {
            var outerType = "ltr" == direction ? "L" : "R";
            if (0 == str.length || "ltr" == direction && !bidiRE.test(str)) return !1;
            for(var len = str.length, types = [], i = 0; i < len; ++i)types.push((code = str.charCodeAt(i)) <= 0xf7 ? "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(code) : 0x590 <= code && code <= 0x5f4 ? "R" : 0x600 <= code && code <= 0x6f9 ? "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(code - 0x600) : 0x6ee <= code && code <= 0x8ac ? "r" : 0x2000 <= code && code <= 0x200b ? "w" : 0x200c == code ? "b" : "L");
            // W1. Examine each non-spacing mark (NSM) in the level run, and
            // change the type of the NSM to the type of the previous
            // character. If the NSM is at the start of the level run, it will
            // get the type of sor.
            for(var i$1 = 0, prev = outerType; i$1 < len; ++i$1){
                var type = types[i$1];
                "m" == type ? types[i$1] = prev : prev = type;
            }
            // W2. Search backwards from each instance of a European number
            // until the first strong type (R, L, AL, or sor) is found. If an
            // AL is found, change the type of the European number to Arabic
            // number.
            // W3. Change all ALs to R.
            for(var i$2 = 0, cur = outerType; i$2 < len; ++i$2){
                var type$1 = types[i$2];
                "1" == type$1 && "r" == cur ? types[i$2] = "n" : isStrong.test(type$1) && (cur = type$1, "r" == type$1 && (types[i$2] = "R"));
            }
            // W4. A single European separator between two European numbers
            // changes to a European number. A single common separator between
            // two numbers of the same type changes to that type.
            for(var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3){
                var type$2 = types[i$3];
                "+" == type$2 && "1" == prev$1 && "1" == types[i$3 + 1] ? types[i$3] = "1" : "," == type$2 && prev$1 == types[i$3 + 1] && ("1" == prev$1 || "n" == prev$1) && (types[i$3] = prev$1), prev$1 = type$2;
            }
            // W5. A sequence of European terminators adjacent to European
            // numbers changes to all European numbers.
            // W6. Otherwise, separators and terminators change to Other
            // Neutral.
            for(var i$4 = 0; i$4 < len; ++i$4){
                var type$3 = types[i$4];
                if ("," == type$3) types[i$4] = "N";
                else if ("%" == type$3) {
                    var end = void 0;
                    for(end = i$4 + 1; end < len && "%" == types[end]; ++end);
                    for(var replace = i$4 && "!" == types[i$4 - 1] || end < len && "1" == types[end] ? "1" : "N", j = i$4; j < end; ++j)types[j] = replace;
                    i$4 = end - 1;
                }
            }
            // W7. Search backwards from each instance of a European number
            // until the first strong type (R, L, or sor) is found. If an L is
            // found, then change the type of the European number to L.
            for(var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5){
                var type$4 = types[i$5];
                "L" == cur$1 && "1" == type$4 ? types[i$5] = "L" : isStrong.test(type$4) && (cur$1 = type$4);
            }
            // N1. A sequence of neutrals takes the direction of the
            // surrounding strong text if the text on both sides has the same
            // direction. European and Arabic numbers act as if they were R in
            // terms of their influence on neutrals. Start-of-level-run (sor)
            // and end-of-level-run (eor) are used at level run boundaries.
            // N2. Any remaining neutrals take the embedding direction.
            for(var i$6 = 0; i$6 < len; ++i$6)if (isNeutral.test(types[i$6])) {
                var end$1 = void 0;
                for(end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1);
                for(var before = (i$6 ? types[i$6 - 1] : outerType) == "L", replace$1 = before == ((end$1 < len ? types[end$1] : outerType) == "L") ? before ? "L" : "R" : outerType, j$1 = i$6; j$1 < end$1; ++j$1)types[j$1] = replace$1;
                i$6 = end$1 - 1;
            }
            for(var code, m, order = [], i$7 = 0; i$7 < len;)if (countsAsLeft.test(types[i$7])) {
                var start = i$7;
                for(++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7);
                order.push(new BidiSpan(0, start, i$7));
            } else {
                var pos = i$7, at = order.length, isRTL = "rtl" == direction ? 1 : 0;
                for(++i$7; i$7 < len && "L" != types[i$7]; ++i$7);
                for(var j$2 = pos; j$2 < i$7;)if (countsAsNum.test(types[j$2])) {
                    pos < j$2 && (order.splice(at, 0, new BidiSpan(1, pos, j$2)), at += isRTL);
                    var nstart = j$2;
                    for(++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2);
                    order.splice(at, 0, new BidiSpan(2, nstart, j$2)), at += isRTL, pos = j$2;
                } else ++j$2;
                pos < i$7 && order.splice(at, 0, new BidiSpan(1, pos, i$7));
            }
            return "ltr" == direction && (1 == order[0].level && (m = str.match(/^\s+/)) && (order[0].from = m[0].length, order.unshift(new BidiSpan(0, 0, m[0].length))), 1 == lst(order).level && (m = str.match(/\s+$/)) && (lst(order).to -= m[0].length, order.push(new BidiSpan(0, len - m[0].length, len)))), "rtl" == direction ? order.reverse() : order;
        };
    }();
    // Get the bidi ordering for the given line (and cache it). Returns
    // false for lines that are fully left-to-right, and an array of
    // BidiSpan objects otherwise.
    function getOrder(line, direction) {
        var order = line.order;
        return null == order && (order = line.order = bidiOrdering(line.text, direction)), order;
    }
    // EVENT HANDLING
    // Lightweight event framework. on/off also work on DOM nodes,
    // registering native DOM handlers.
    var noHandlers = [], on = function(emitter, type, f) {
        if (emitter.addEventListener) emitter.addEventListener(type, f, !1);
        else if (emitter.attachEvent) emitter.attachEvent("on" + type, f);
        else {
            var map = emitter._handlers || (emitter._handlers = {});
            map[type] = (map[type] || noHandlers).concat(f);
        }
    };
    function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
    }
    function off(emitter, type, f) {
        if (emitter.removeEventListener) emitter.removeEventListener(type, f, !1);
        else if (emitter.detachEvent) emitter.detachEvent("on" + type, f);
        else {
            var map = emitter._handlers, arr = map && map[type];
            if (arr) {
                var index = indexOf(arr, f);
                index > -1 && (map[type] = arr.slice(0, index).concat(arr.slice(index + 1)));
            }
        }
    }
    function signal(emitter, type /*, values...*/ ) {
        var handlers = getHandlers(emitter, type);
        if (handlers.length) for(var args = Array.prototype.slice.call(arguments, 2), i = 0; i < handlers.length; ++i)handlers[i].apply(null, args);
    }
    // The DOM events that CodeMirror handles can be overridden by
    // registering a (non-DOM) handler on the editor for the event name,
    // and preventDefault-ing the event in that handler.
    function signalDOMEvent(cm, e, override) {
        return "string" == typeof e && (e = {
            type: e,
            preventDefault: function() {
                this.defaultPrevented = !0;
            }
        }), signal(cm, override || e.type, cm, e), e_defaultPrevented(e) || e.codemirrorIgnore;
    }
    function signalCursorActivity(cm) {
        var arr = cm._handlers && cm._handlers.cursorActivity;
        if (arr) for(var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []), i = 0; i < arr.length; ++i)-1 == indexOf(set, arr[i]) && set.push(arr[i]);
    }
    function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
    }
    // Add on and off methods to a constructor's prototype, to make
    // registering events on such objects more convenient.
    function eventMixin(ctor) {
        ctor.prototype.on = function(type, f) {
            on(this, type, f);
        }, ctor.prototype.off = function(type, f) {
            off(this, type, f);
        };
    }
    // Due to the fact that we still support jurassic IE versions, some
    // compatibility wrappers are needed.
    function e_preventDefault(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
    }
    function e_stopPropagation(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
    }
    function e_defaultPrevented(e) {
        return null != e.defaultPrevented ? e.defaultPrevented : !1 == e.returnValue;
    }
    function e_stop(e) {
        e_preventDefault(e), e_stopPropagation(e);
    }
    function e_target(e) {
        return e.target || e.srcElement;
    }
    function e_button(e) {
        var b = e.which;
        return null == b && (1 & e.button ? b = 1 : 2 & e.button ? b = 3 : 4 & e.button && (b = 2)), mac && e.ctrlKey && 1 == b && (b = 3), b;
    }
    // Detect drag-and-drop
    var dragAndDrop = function() {
        // There is *some* kind of drag-and-drop support in IE6-8, but I
        // couldn't get it to work yet.
        if (ie && ie_version < 9) return !1;
        var div = elt("div");
        return "draggable" in div || "dragDrop" in div;
    }(), splitLinesAuto = 3 != "\n\nb".split(/\n/).length ? function(string) {
        for(var pos = 0, result = [], l = string.length; pos <= l;){
            var nl = string.indexOf("\n", pos);
            -1 == nl && (nl = string.length);
            var line = string.slice(pos, "\r" == string.charAt(nl - 1) ? nl - 1 : nl), rt = line.indexOf("\r");
            -1 != rt ? (result.push(line.slice(0, rt)), pos += rt + 1) : (result.push(line), pos = nl + 1);
        }
        return result;
    } : function(string) {
        return string.split(/\r\n?|\n/);
    }, hasSelection = window.getSelection ? function(te) {
        try {
            return te.selectionStart != te.selectionEnd;
        } catch (e) {
            return !1;
        }
    } : function(te) {
        var range;
        try {
            range = te.ownerDocument.selection.createRange();
        } catch (e) {}
        return !!range && range.parentElement() == te && 0 != range.compareEndPoints("StartToEnd", range);
    }, hasCopyEvent = "oncopy" in (e = elt("div")) || (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy), badZoomedRects = null, modes = {}, mimeModes = {};
    // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    function defineMode(name, mode) {
        arguments.length > 2 && (mode.dependencies = Array.prototype.slice.call(arguments, 2)), modes[name] = mode;
    }
    // Given a MIME type, a {name, ...options} config object, or a name
    // string, return a mode config object.
    function resolveMode(spec) {
        if ("string" == typeof spec && mimeModes.hasOwnProperty(spec)) spec = mimeModes[spec];
        else if (spec && "string" == typeof spec.name && mimeModes.hasOwnProperty(spec.name)) {
            var found = mimeModes[spec.name];
            "string" == typeof found && (found = {
                name: found
            }), (spec = createObj(found, spec)).name = found.name;
        } else if ("string" == typeof spec && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) return resolveMode("application/xml");
        else if ("string" == typeof spec && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) return resolveMode("application/json");
        return "string" == typeof spec ? {
            name: spec
        } : spec || {
            name: "null"
        };
    }
    // Given a mode spec (anything that resolveMode accepts), find and
    // initialize an actual mode object.
    function getMode(options, spec) {
        var mfactory = modes[(spec = resolveMode(spec)).name];
        if (!mfactory) return getMode(options, "text/plain");
        var modeObj = mfactory(options, spec);
        if (modeExtensions.hasOwnProperty(spec.name)) {
            var exts = modeExtensions[spec.name];
            for(var prop in exts)exts.hasOwnProperty(prop) && (modeObj.hasOwnProperty(prop) && (modeObj["_" + prop] = modeObj[prop]), modeObj[prop] = exts[prop]);
        }
        if (modeObj.name = spec.name, spec.helperType && (modeObj.helperType = spec.helperType), spec.modeProps) for(var prop$1 in spec.modeProps)modeObj[prop$1] = spec.modeProps[prop$1];
        return modeObj;
    }
    // This can be used to attach properties to mode objects from
    // outside the actual mode definition.
    var modeExtensions = {};
    function copyState(mode, state) {
        if (!0 === state) return state;
        if (mode.copyState) return mode.copyState(state);
        var nstate = {};
        for(var n in state){
            var val = state[n];
            val instanceof Array && (val = val.concat([])), nstate[n] = val;
        }
        return nstate;
    }
    // Given a mode and a state (for that mode), find the inner mode and
    // state at the position that the state refers to.
    function innerMode(mode, state) {
        for(var info; mode.innerMode && (info = mode.innerMode(state)) && info.mode != mode;)state = info.state, mode = info.mode;
        return info || {
            mode: mode,
            state: state
        };
    }
    function startState(mode, a1, a2) {
        return !mode.startState || mode.startState(a1, a2);
    }
    // STRING STREAM
    // Fed to the mode parsers, provides helper functions to make
    // parsers more succinct.
    var StringStream = function(string, tabSize, lineOracle) {
        this.pos = this.start = 0, this.string = string, this.tabSize = tabSize || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = lineOracle;
    };
    // Find the line object corresponding to the given line number.
    function getLine(doc, n) {
        if ((n -= doc.first) < 0 || n >= doc.size) throw Error("There is no line " + (n + doc.first) + " in the document.");
        for(var chunk = doc; !chunk.lines;)for(var i = 0;; ++i){
            var child = chunk.children[i], sz = child.chunkSize();
            if (n < sz) {
                chunk = child;
                break;
            }
            n -= sz;
        }
        return chunk.lines[n];
    }
    // Get the part of a document between two positions, as an array of
    // strings.
    function getBetween(doc, start, end) {
        var out = [], n = start.line;
        return doc.iter(start.line, end.line + 1, function(line) {
            var text = line.text;
            n == end.line && (text = text.slice(0, end.ch)), n == start.line && (text = text.slice(start.ch)), out.push(text), ++n;
        }), out;
    }
    // Get the lines between from and to, as array of strings.
    function getLines(doc, from, to) {
        var out = [];
        return doc.iter(from, to, function(line) {
            out.push(line.text);
        }), out;
    }
    // Update the height of a line, propagating the height change
    // upwards to parent nodes.
    function updateLineHeight(line, height) {
        var diff = height - line.height;
        if (diff) for(var n = line; n; n = n.parent)n.height += diff;
    }
    // Given a line object, find its line number by walking up through
    // its parent links.
    function lineNo(line) {
        if (null == line.parent) return null;
        for(var cur = line.parent, no = indexOf(cur.lines, line), chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent)for(var i = 0; chunk.children[i] != cur; ++i)no += chunk.children[i].chunkSize();
        return no + cur.first;
    }
    // Find the line at the given vertical position, using the height
    // information in the document tree.
    function lineAtHeight(chunk, h) {
        var n = chunk.first;
        outer: do {
            for(var i$1 = 0; i$1 < chunk.children.length; ++i$1){
                var child = chunk.children[i$1], ch = child.height;
                if (h < ch) {
                    chunk = child;
                    continue outer;
                }
                h -= ch, n += child.chunkSize();
            }
            return n;
        }while (!chunk.lines)
        for(var i = 0; i < chunk.lines.length; ++i){
            var lh = chunk.lines[i].height;
            if (h < lh) break;
            h -= lh;
        }
        return n + i;
    }
    function isLine(doc, l) {
        return l >= doc.first && l < doc.first + doc.size;
    }
    function lineNumberFor(options, i) {
        return String(options.lineNumberFormatter(i + options.firstLineNumber));
    }
    // A Pos instance represents a position within the text.
    function Pos(line, ch, sticky) {
        if (void 0 === sticky && (sticky = null), !(this instanceof Pos)) return new Pos(line, ch, sticky);
        this.line = line, this.ch = ch, this.sticky = sticky;
    }
    // Compare two positions, return 0 if they are the same, a negative
    // number when a is less, and a positive number otherwise.
    function cmp(a, b) {
        return a.line - b.line || a.ch - b.ch;
    }
    function equalCursorPos(a, b) {
        return a.sticky == b.sticky && 0 == cmp(a, b);
    }
    function copyPos(x) {
        return Pos(x.line, x.ch);
    }
    function maxPos(a, b) {
        return 0 > cmp(a, b) ? b : a;
    }
    function minPos(a, b) {
        return 0 > cmp(a, b) ? a : b;
    }
    // Most of the external API clips given positions to make sure they
    // actually exist within the document.
    function clipLine(doc, n) {
        return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
    }
    function clipPos(doc, pos) {
        if (pos.line < doc.first) return Pos(doc.first, 0);
        var linelen, ch, last = doc.first + doc.size - 1;
        return pos.line > last ? Pos(last, getLine(doc, last).text.length) : (linelen = getLine(doc, pos.line).text.length, null == (ch = pos.ch) || ch > linelen ? Pos(pos.line, linelen) : ch < 0 ? Pos(pos.line, 0) : pos);
    }
    function clipPosArray(doc, array) {
        for(var out = [], i = 0; i < array.length; i++)out[i] = clipPos(doc, array[i]);
        return out;
    }
    StringStream.prototype.eol = function() {
        return this.pos >= this.string.length;
    }, StringStream.prototype.sol = function() {
        return this.pos == this.lineStart;
    }, StringStream.prototype.peek = function() {
        return this.string.charAt(this.pos) || void 0;
    }, StringStream.prototype.next = function() {
        if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    }, StringStream.prototype.eat = function(match) {
        var ch = this.string.charAt(this.pos);
        if ("string" == typeof match ? ch == match : ch && (match.test ? match.test(ch) : match(ch))) return ++this.pos, ch;
    }, StringStream.prototype.eatWhile = function(match) {
        for(var start = this.pos; this.eat(match););
        return this.pos > start;
    }, StringStream.prototype.eatSpace = function() {
        for(var start = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;
        return this.pos > start;
    }, StringStream.prototype.skipToEnd = function() {
        this.pos = this.string.length;
    }, StringStream.prototype.skipTo = function(ch) {
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) return this.pos = found, !0;
    }, StringStream.prototype.backUp = function(n) {
        this.pos -= n;
    }, StringStream.prototype.column = function() {
        return this.lastColumnPos < this.start && (this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    }, StringStream.prototype.indentation = function() {
        return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    }, StringStream.prototype.match = function(pattern, consume, caseInsensitive) {
        if ("string" == typeof pattern) {
            var cased = function(str) {
                return caseInsensitive ? str.toLowerCase() : str;
            };
            if (cased(this.string.substr(this.pos, pattern.length)) == cased(pattern)) return !1 !== consume && (this.pos += pattern.length), !0;
        } else {
            var match = this.string.slice(this.pos).match(pattern);
            return match && match.index > 0 ? null : (match && !1 !== consume && (this.pos += match[0].length), match);
        }
    }, StringStream.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
    }, StringStream.prototype.hideFirstChars = function(n, inner) {
        this.lineStart += n;
        try {
            return inner();
        } finally{
            this.lineStart -= n;
        }
    }, StringStream.prototype.lookAhead = function(n) {
        var oracle = this.lineOracle;
        return oracle && oracle.lookAhead(n);
    }, StringStream.prototype.baseToken = function() {
        var oracle = this.lineOracle;
        return oracle && oracle.baseToken(this.pos);
    };
    var SavedContext = function(state, lookAhead) {
        this.state = state, this.lookAhead = lookAhead;
    }, Context = function(doc, state, line, lookAhead) {
        this.state = state, this.doc = doc, this.line = line, this.maxLookAhead = lookAhead || 0, this.baseTokens = null, this.baseTokenPos = 1;
    };
    // Compute a style array (an array starting with a mode generation
    // -- for invalidation -- followed by pairs of end positions and
    // style strings), which is used to highlight the tokens on the
    // line.
    function highlightLine(cm, line, context, forceToEnd) {
        // A styles array always starts with a number identifying the
        // mode/overlays that it is based on (for easy invalidation).
        var st = [
            cm.state.modeGen
        ], lineClasses = {};
        // Compute the base array of styles
        runMode(cm, line.text, cm.doc.mode, context, function(end, style) {
            return st.push(end, style);
        }, lineClasses, forceToEnd);
        for(var state = context.state, o = 0; o < cm.state.overlays.length; ++o)!function(o) {
            context.baseTokens = st;
            var overlay = cm.state.overlays[o], i = 1, at = 0;
            context.state = !0, runMode(cm, line.text, overlay.mode, context, function(end, style) {
                // Ensure there's a token end at the current position, and that i points at it
                for(var start = i; at < end;){
                    var i_end = st[i];
                    i_end > end && st.splice(i, 1, end, st[i + 1], i_end), i += 2, at = Math.min(end, i_end);
                }
                if (style) {
                    if (overlay.opaque) st.splice(start, i - start, end, "overlay " + style), i = start + 2;
                    else for(; start < i; start += 2){
                        var cur = st[start + 1];
                        st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
                    }
                }
            }, lineClasses), context.state = state, context.baseTokens = null, context.baseTokenPos = 1;
        }(o);
        return {
            styles: st,
            classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null
        };
    }
    function getLineStyles(cm, line, updateFrontier) {
        if (!line.styles || line.styles[0] != cm.state.modeGen) {
            var context = getContextBefore(cm, lineNo(line)), resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state), result = highlightLine(cm, line, context);
            resetState && (context.state = resetState), line.stateAfter = context.save(!resetState), line.styles = result.styles, result.classes ? line.styleClasses = result.classes : line.styleClasses && (line.styleClasses = null), updateFrontier === cm.doc.highlightFrontier && (cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier));
        }
        return line.styles;
    }
    function getContextBefore(cm, n, precise) {
        var doc = cm.doc, display = cm.display;
        if (!doc.mode.startState) return new Context(doc, !0, n);
        var start = // Finds the line to start with when starting a parse. Tries to
        // find a line with a stateAfter, so that it can start with a
        // valid state. If that fails, it returns the line with the
        // smallest indentation, which tends to need the least context to
        // parse correctly.
        function(cm, n, precise) {
            for(var minindent, minline, doc = cm.doc, lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100), search = n; search > lim; --search){
                if (search <= doc.first) return doc.first;
                var line = getLine(doc, search - 1), after = line.stateAfter;
                if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier)) return search;
                var indented = countColumn(line.text, null, cm.options.tabSize);
                (null == minline || minindent > indented) && (minline = search - 1, minindent = indented);
            }
            return minline;
        }(cm, n, precise), saved = start > doc.first && getLine(doc, start - 1).stateAfter, context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, startState(doc.mode), start);
        return doc.iter(start, n, function(line) {
            processLine(cm, line.text, context);
            var pos = context.line;
            line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null, context.nextLine();
        }), precise && (doc.modeFrontier = context.line), context;
    }
    // Lightweight form of highlight -- proceed over this line and
    // update state, but don't save a style array. Used for lines that
    // aren't currently visible.
    function processLine(cm, text, context, startAt) {
        var mode = cm.doc.mode, stream = new StringStream(text, cm.options.tabSize, context);
        for(stream.start = stream.pos = startAt || 0, "" == text && callBlankLine(mode, context.state); !stream.eol();)readToken(mode, stream, context.state), stream.start = stream.pos;
    }
    function callBlankLine(mode, state) {
        if (mode.blankLine) return mode.blankLine(state);
        if (mode.innerMode) {
            var inner = innerMode(mode, state);
            if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
        }
    }
    function readToken(mode, stream, state, inner) {
        for(var i = 0; i < 10; i++){
            inner && (inner[0] = innerMode(mode, state).mode);
            var style = mode.token(stream, state);
            if (stream.pos > stream.start) return style;
        }
        throw Error("Mode " + mode.name + " failed to advance stream.");
    }
    Context.prototype.lookAhead = function(n) {
        var line = this.doc.getLine(this.line + n);
        return null != line && n > this.maxLookAhead && (this.maxLookAhead = n), line;
    }, Context.prototype.baseToken = function(n) {
        if (!this.baseTokens) return null;
        for(; this.baseTokens[this.baseTokenPos] <= n;)this.baseTokenPos += 2;
        var type = this.baseTokens[this.baseTokenPos + 1];
        return {
            type: type && type.replace(/( |^)overlay .*/, ""),
            size: this.baseTokens[this.baseTokenPos] - n
        };
    }, Context.prototype.nextLine = function() {
        this.line++, this.maxLookAhead > 0 && this.maxLookAhead--;
    }, Context.fromSaved = function(doc, saved, line) {
        return saved instanceof SavedContext ? new Context(doc, copyState(doc.mode, saved.state), line, saved.lookAhead) : new Context(doc, copyState(doc.mode, saved), line);
    }, Context.prototype.save = function(copy) {
        var state = !1 !== copy ? copyState(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
    };
    var Token = function(stream, type, state) {
        this.start = stream.start, this.end = stream.pos, this.string = stream.current(), this.type = type || null, this.state = state;
    };
    // Utility for getTokenAt and getLineTokens
    function takeToken(cm, pos, precise, asArray) {
        var style, doc = cm.doc, mode = doc.mode;
        pos = clipPos(doc, pos);
        var tokens, line = getLine(doc, pos.line), context = getContextBefore(cm, pos.line, precise), stream = new StringStream(line.text, cm.options.tabSize, context);
        for(asArray && (tokens = []); (asArray || stream.pos < pos.ch) && !stream.eol();)stream.start = stream.pos, style = readToken(mode, stream, context.state), asArray && tokens.push(new Token(stream, style, copyState(doc.mode, context.state)));
        return asArray ? tokens : new Token(stream, style, context.state);
    }
    function extractLineClasses(type, output) {
        if (type) for(;;){
            var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!lineClass) break;
            type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
            var prop = lineClass[1] ? "bgClass" : "textClass";
            null == output[prop] ? output[prop] = lineClass[2] : RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop]) || (output[prop] += " " + lineClass[2]);
        }
        return type;
    }
    // Run the given mode's parser over a line, calling f for each token.
    function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
        var flattenSpans = mode.flattenSpans;
        null == flattenSpans && (flattenSpans = cm.options.flattenSpans);
        var style, curStart = 0, curStyle = null, stream = new StringStream(text, cm.options.tabSize, context), inner = cm.options.addModeClass && [
            null
        ];
        for("" == text && extractLineClasses(callBlankLine(mode, context.state), lineClasses); !stream.eol();){
            if (stream.pos > cm.options.maxHighlightLength ? (flattenSpans = !1, forceToEnd && processLine(cm, text, context, stream.pos), stream.pos = text.length, style = null) : style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses), inner) {
                var mName = inner[0].name;
                mName && (style = "m-" + (style ? mName + " " + style : mName));
            }
            if (!flattenSpans || curStyle != style) {
                for(; curStart < stream.start;)f(curStart = Math.min(stream.start, curStart + 5000), curStyle);
                curStyle = style;
            }
            stream.start = stream.pos;
        }
        for(; curStart < stream.pos;){
            // Webkit seems to refuse to render text nodes longer than 57444
            // characters, and returns inaccurate measurements in nodes
            // starting around 5000 chars.
            var pos = Math.min(stream.pos, curStart + 5000);
            f(pos, curStyle), curStart = pos;
        }
    }
    // Optimize some code when these features are not used.
    var sawReadOnlySpans = !1, sawCollapsedSpans = !1;
    // TEXTMARKER SPANS
    function MarkedSpan(marker, from, to) {
        this.marker = marker, this.from = from, this.to = to;
    }
    // Search an array of spans for a span matching the given marker.
    function getMarkedSpanFor(spans, marker) {
        if (spans) for(var i = 0; i < spans.length; ++i){
            var span = spans[i];
            if (span.marker == marker) return span;
        }
    }
    // Given a change object, compute the new set of marker spans that
    // cover the line in which the change took place. Removes spans
    // entirely within the change, reconnects spans belonging to the
    // same marker that appear on both sides of the change, and cuts off
    // spans partially within the change. Returns an array of span
    // arrays with one element for each line in (after) the change.
    function stretchSpansOverChange(doc, change) {
        if (change.full) return null;
        var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans, oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
        if (!oldFirst && !oldLast) return null;
        var startCh = change.from.ch, endCh = change.to.ch, isInsert = 0 == cmp(change.from, change.to), first = // Used for the algorithm that adjusts markers for a change in the
        // document. These functions cut an array of spans at a given
        // character position, returning an array of remaining chunks (or
        // undefined if nothing remains).
        function(old, startCh, isInsert) {
            var nw;
            if (old) for(var i = 0; i < old.length; ++i){
                var span = old[i], marker = span.marker;
                if (null == span.from || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh) || span.from == startCh && "bookmark" == marker.type && (!isInsert || !span.marker.insertLeft)) {
                    var endsAfter = null == span.to || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
                }
            }
            return nw;
        }(oldFirst, startCh, isInsert), last = function(old, endCh, isInsert) {
            var nw;
            if (old) for(var i = 0; i < old.length; ++i){
                var span = old[i], marker = span.marker;
                if (null == span.to || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh) || span.from == endCh && "bookmark" == marker.type && (!isInsert || span.marker.insertLeft)) {
                    var startsBefore = null == span.from || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                    (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, null == span.to ? null : span.to - endCh));
                }
            }
            return nw;
        }(oldLast, endCh, isInsert), sameLine = 1 == change.text.length, offset = lst(change.text).length + (sameLine ? startCh : 0);
        if (first) // Fix up .to properties of first
        for(var i = 0; i < first.length; ++i){
            var span = first[i];
            if (null == span.to) {
                var found = getMarkedSpanFor(last, span.marker);
                found ? sameLine && (span.to = null == found.to ? null : found.to + offset) : span.to = startCh;
            }
        }
        if (last) // Fix up .from in last (or move them into first in case of sameLine)
        for(var i$1 = 0; i$1 < last.length; ++i$1){
            var span$1 = last[i$1];
            null != span$1.to && (span$1.to += offset), null == span$1.from ? !getMarkedSpanFor(first, span$1.marker) && (span$1.from = offset, sameLine && (first || (first = [])).push(span$1)) : (span$1.from += offset, sameLine && (first || (first = [])).push(span$1));
        }
        first && (first = clearEmptySpans(first)), last && last != first && (last = clearEmptySpans(last));
        var newMarkers = [
            first
        ];
        if (!sameLine) {
            // Fill gap with whole-line-spans
            var gapMarkers, gap = change.text.length - 2;
            if (gap > 0 && first) for(var i$2 = 0; i$2 < first.length; ++i$2)null == first[i$2].to && (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$2].marker, null, null));
            for(var i$3 = 0; i$3 < gap; ++i$3)newMarkers.push(gapMarkers);
            newMarkers.push(last);
        }
        return newMarkers;
    }
    // Remove spans that are empty and don't have a clearWhenEmpty
    // option of false.
    function clearEmptySpans(spans) {
        for(var i = 0; i < spans.length; ++i){
            var span = spans[i];
            null != span.from && span.from == span.to && !1 !== span.marker.clearWhenEmpty && spans.splice(i--, 1);
        }
        return spans.length ? spans : null;
    }
    // Connect or disconnect spans from a line.
    function detachMarkedSpans(line) {
        var spans = line.markedSpans;
        if (spans) {
            for(var i = 0; i < spans.length; ++i)spans[i].marker.detachLine(line);
            line.markedSpans = null;
        }
    }
    function attachMarkedSpans(line, spans) {
        if (spans) {
            for(var i = 0; i < spans.length; ++i)spans[i].marker.attachLine(line);
            line.markedSpans = spans;
        }
    }
    // Helpers used when computing which overlapping collapsed span
    // counts as the larger one.
    function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
    }
    function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
    }
    // Returns a number indicating which of two overlapping collapsed
    // spans is larger (and thus includes the other). Falls back to
    // comparing ids when the spans cover exactly the same range.
    function compareCollapsedMarkers(a, b) {
        var lenDiff = a.lines.length - b.lines.length;
        if (0 != lenDiff) return lenDiff;
        var aPos = a.find(), bPos = b.find(), fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
        return fromCmp ? -fromCmp : cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b) || b.id - a.id;
    }
    // Find out whether a line ends or starts in a collapsed span. If
    // so, return the marker for that span.
    function collapsedSpanAtSide(line, start) {
        var found, sps = sawCollapsedSpans && line.markedSpans;
        if (sps) for(var sp = void 0, i = 0; i < sps.length; ++i)(sp = sps[i]).marker.collapsed && (start ? sp.from : sp.to) == null && (!found || 0 > compareCollapsedMarkers(found, sp.marker)) && (found = sp.marker);
        return found;
    }
    // Test whether there exists a collapsed span that partially
    // overlaps (covers the start or end, but not both) of a new span.
    // Such overlap is not allowed.
    function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
        var line = getLine(doc, lineNo), sps = sawCollapsedSpans && line.markedSpans;
        if (sps) for(var i = 0; i < sps.length; ++i){
            var sp = sps[i];
            if (sp.marker.collapsed) {
                var found = sp.marker.find(0), fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker), toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
                if ((!(fromCmp >= 0) || !(toCmp <= 0)) && (!(fromCmp <= 0) || !(toCmp >= 0)) && (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? 0 >= cmp(found.from, to) : 0 > cmp(found.from, to)))) return !0;
            }
        }
    }
    // A visual line is a line as drawn on the screen. Folding, for
    // example, can cause multiple logical lines to appear on the same
    // visual line. This finds the start of the visual line that the
    // given line is part of (usually that is the line itself).
    function visualLine(line) {
        for(var merged; merged = collapsedSpanAtSide(line, !0);)line = merged.find(-1, !0).line;
        return line;
    }
    // Get the line number of the start of the visual line that the
    // given line number is part of.
    function visualLineNo(doc, lineN) {
        var line = getLine(doc, lineN), vis = visualLine(line);
        return line == vis ? lineN : lineNo(vis);
    }
    // Get the line number of the start of the next visual line after
    // the given line.
    function visualLineEndNo(doc, lineN) {
        if (lineN > doc.lastLine()) return lineN;
        var merged, line = getLine(doc, lineN);
        if (!lineIsHidden(doc, line)) return lineN;
        for(; merged = collapsedSpanAtSide(line, !1);)line = merged.find(1, !0).line;
        return lineNo(line) + 1;
    }
    // Compute whether a line is hidden. Lines count as hidden when they
    // are part of a visual line that starts with another line, or when
    // they are entirely covered by collapsed, non-widget span.
    function lineIsHidden(doc, line) {
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) {
            for(var sp = void 0, i = 0; i < sps.length; ++i)if ((sp = sps[i]).marker.collapsed && (null == sp.from || !sp.marker.widgetNode && 0 == sp.from && sp.marker.inclusiveLeft && function lineIsHiddenInner(doc, line, span) {
                if (null == span.to) {
                    var end = span.marker.find(1, !0);
                    return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
                }
                if (span.marker.inclusiveRight && span.to == line.text.length) return !0;
                for(var sp = void 0, i = 0; i < line.markedSpans.length; ++i)if ((sp = line.markedSpans[i]).marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (null == sp.to || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp)) return !0;
            }(doc, line, sp))) return !0;
        }
    }
    // Find the height above the given line.
    function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        for(var h = 0, chunk = lineObj.parent, i = 0; i < chunk.lines.length; ++i){
            var line = chunk.lines[i];
            if (line == lineObj) break;
            h += line.height;
        }
        for(var p = chunk.parent; p; p = (chunk = p).parent)for(var i$1 = 0; i$1 < p.children.length; ++i$1){
            var cur = p.children[i$1];
            if (cur == chunk) break;
            h += cur.height;
        }
        return h;
    }
    // Compute the character length of a line, taking into account
    // collapsed ranges (see markText) that might hide parts, and join
    // other lines onto it.
    function lineLength(line) {
        if (0 == line.height) return 0;
        for(var merged, len = line.text.length, cur = line; merged = collapsedSpanAtSide(cur, !0);){
            var found = merged.find(0, !0);
            cur = found.from.line, len += found.from.ch - found.to.ch;
        }
        for(cur = line; merged = collapsedSpanAtSide(cur, !1);){
            var found$1 = merged.find(0, !0);
            len -= cur.text.length - found$1.from.ch, len += (cur = found$1.to.line).text.length - found$1.to.ch;
        }
        return len;
    }
    // Find the longest line in the document.
    function findMaxLine(cm) {
        var d = cm.display, doc = cm.doc;
        d.maxLine = getLine(doc, doc.first), d.maxLineLength = lineLength(d.maxLine), d.maxLineChanged = !0, doc.iter(function(line) {
            var len = lineLength(line);
            len > d.maxLineLength && (d.maxLineLength = len, d.maxLine = line);
        });
    }
    // LINE DATA STRUCTURE
    // Line objects. These hold state related to a line, including
    // highlighting info (the styles array).
    var Line = function(text, markedSpans, estimateHeight) {
        this.text = text, attachMarkedSpans(this, markedSpans), this.height = estimateHeight ? estimateHeight(this) : 1;
    };
    Line.prototype.lineNo = function() {
        return lineNo(this);
    }, eventMixin(Line);
    // Convert a style as returned by a mode (either null, or a string
    // containing one or more styles) to a CSS style. This is cached,
    // and also looks for line-wide styles.
    var styleToClassCache = {}, styleToClassCacheWithMode = {};
    function interpretTokenStyle(style, options) {
        if (!style || /^\s*$/.test(style)) return null;
        var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
        return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
    }
    // Render the DOM representation of the text of a line. Also builds
    // up a 'line map', which points at the DOM nodes that represent
    // specific stretches of text, and is used by the measuring code.
    // The returned object contains the DOM node, this map, and
    // information about line-wide styles that were set by the mode.
    function buildLineContent(cm, lineView) {
        // The padding-right forces the element to have a 'border', which
        // is needed on Webkit to be able to get line-level bounding
        // rectangles for it (in measureChar).
        var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null), builder = {
            pre: eltP("pre", [
                content
            ], "CodeMirror-line"),
            content: content,
            col: 0,
            pos: 0,
            cm: cm,
            trailingSpace: !1,
            splitSpaces: cm.getOption("lineWrapping")
        };
        lineView.measure = {};
        // Iterate over the logical lines that make up this visual line.
        for(var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++){
            var line = i ? lineView.rest[i - 1] : lineView.line, order = void 0;
            builder.pos = 0, builder.addToken = buildToken, function(measure) {
                if (null != badBidiRects) return badBidiRects;
                var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA")), r0 = range(txt, 0, 1).getBoundingClientRect(), r1 = range(txt, 1, 2).getBoundingClientRect();
                return removeChildren(measure), !!r0 && r0.left != r0.right && (badBidiRects = r1.right - r0.right < 3) // Safari returns null in some cases (#2780)
                ;
            }(cm.display.measure) && (order = getOrder(line, cm.doc.direction)) && (builder.addToken = // Work around nonsense dimensions being reported for stretches of
            // right-to-left text.
            function(inner, order) {
                return function(builder, text, style, startStyle, endStyle, css, attributes) {
                    style = style ? style + " cm-force-border" : "cm-force-border";
                    for(var start = builder.pos, end = start + text.length;;){
                        for(var part = void 0, i = 0; i < order.length && (!((part = order[i]).to > start) || !(part.from <= start)); i++);
                        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, css, attributes);
                        inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes), startStyle = null, text = text.slice(part.to - start), start = part.to;
                    }
                };
            }(builder.addToken, order)), builder.map = [];
            var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
            // Outputs a number of spans to make up a line, taking highlighting
            // and marked text into account.
            (function(line, builder, styles) {
                var spans = line.markedSpans, allText = line.text, at = 0;
                if (!spans) {
                    for(var i$1 = 1; i$1 < styles.length; i$1 += 2)builder.addToken(builder, allText.slice(at, at = styles[i$1]), interpretTokenStyle(styles[i$1 + 1], builder.cm.options));
                    return;
                }
                for(var style, css, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes, len = allText.length, pos = 0, i = 1, text = "", nextChange = 0;;){
                    if (nextChange == pos) {
                        // Update current marker set
                        spanStyle = spanEndStyle = spanStartStyle = css = "", attributes = null, collapsed = null, nextChange = 1 / 0;
                        for(var foundBookmarks = [], endStyles = void 0, j = 0; j < spans.length; ++j){
                            var sp = spans[j], m = sp.marker;
                            if ("bookmark" == m.type && sp.from == pos && m.widgetNode) foundBookmarks.push(m);
                            else if (sp.from <= pos && (null == sp.to || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
                                if (null != sp.to && sp.to != pos && nextChange > sp.to && (nextChange = sp.to, spanEndStyle = ""), m.className && (spanStyle += " " + m.className), m.css && (css = (css ? css + ";" : "") + m.css), m.startStyle && sp.from == pos && (spanStartStyle += " " + m.startStyle), m.endStyle && sp.to == nextChange && (endStyles || (endStyles = [])).push(m.endStyle, sp.to), m.title && ((attributes || (attributes = {})).title = m.title), m.attributes) for(var attr in m.attributes)(attributes || (attributes = {}))[attr] = m.attributes[attr];
                                m.collapsed && (!collapsed || 0 > compareCollapsedMarkers(collapsed.marker, m)) && (collapsed = sp);
                            } else sp.from > pos && nextChange > sp.from && (nextChange = sp.from);
                        }
                        if (endStyles) for(var j$1 = 0; j$1 < endStyles.length; j$1 += 2)endStyles[j$1 + 1] == nextChange && (spanEndStyle += " " + endStyles[j$1]);
                        if (!collapsed || collapsed.from == pos) for(var j$2 = 0; j$2 < foundBookmarks.length; ++j$2)buildCollapsedSpan(builder, 0, foundBookmarks[j$2]);
                        if (collapsed && (collapsed.from || 0) == pos) {
                            if (buildCollapsedSpan(builder, (null == collapsed.to ? len + 1 : collapsed.to) - pos, collapsed.marker, null == collapsed.from), null == collapsed.to) return;
                            collapsed.to == pos && (collapsed = !1);
                        }
                    }
                    if (pos >= len) break;
                    for(var upto = Math.min(len, nextChange);;){
                        if (text) {
                            var end = pos + text.length;
                            if (!collapsed) {
                                var tokenText = end > upto ? text.slice(0, upto - pos) : text;
                                builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", css, attributes);
                            }
                            if (end >= upto) {
                                text = text.slice(upto - pos), pos = upto;
                                break;
                            }
                            pos = end, spanStartStyle = "";
                        }
                        text = allText.slice(at, at = styles[i++]), style = interpretTokenStyle(styles[i++], builder.cm.options);
                    }
                }
            })(line, builder, getLineStyles(cm, line, allowFrontierUpdate)), line.styleClasses && (line.styleClasses.bgClass && (builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "")), line.styleClasses.textClass && (builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || ""))), 0 == builder.map.length && builder.map.push(0, 0, builder.content.appendChild(function(measure) {
                if (null == zwspSupported) {
                    var test = elt("span", "\u200b");
                    removeChildrenAndAdd(measure, elt("span", [
                        test,
                        document.createTextNode("x")
                    ])), 0 != measure.firstChild.offsetHeight && (zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8));
                }
                var node = zwspSupported ? elt("span", "\u200b") : elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
                return node.setAttribute("cm-text", ""), node;
            }(cm.display.measure))), 0 == i ? (lineView.measure.map = builder.map, lineView.measure.cache = {}) : ((lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map), (lineView.measure.caches || (lineView.measure.caches = [])).push({}));
        }
        // See issue #2901
        if (webkit) {
            var last = builder.content.lastChild;
            (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector(".cm-tab")) && (builder.content.className = "cm-tab-wrap-hack");
        }
        return signal(cm, "renderLine", cm, lineView.line, builder.pre), builder.pre.className && (builder.textClass = joinClasses(builder.pre.className, builder.textClass || "")), builder;
    }
    function defaultSpecialCharPlaceholder(ch) {
        var token = elt("span", "\u2022", "cm-invalidchar");
        return token.title = "\\u" + ch.charCodeAt(0).toString(16), token.setAttribute("aria-label", token.title), token;
    }
    // Build up the DOM representation for a single token, and add it to
    // the line map. Takes care to render special characters separately.
    function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
        if (text) {
            var content, displayText = builder.splitSpaces ? // Change some spaces to NBSP to prevent the browser from collapsing
            // trailing spaces at the end of a line when rendering text (issue #1362).
            function(text, trailingBefore) {
                if (text.length > 1 && !/  /.test(text)) return text;
                for(var spaceBefore = trailingBefore, result = "", i = 0; i < text.length; i++){
                    var ch = text.charAt(i);
                    " " == ch && spaceBefore && (i == text.length - 1 || 32 == text.charCodeAt(i + 1)) && (ch = "\u00a0"), result += ch, spaceBefore = " " == ch;
                }
                return result;
            }(text, builder.trailingSpace) : text, special = builder.cm.state.specialChars, mustWrap = !1;
            if (special.test(text)) {
                content = document.createDocumentFragment();
                for(var pos = 0;;){
                    special.lastIndex = pos;
                    var m = special.exec(text), skipped = m ? m.index - pos : text.length - pos;
                    if (skipped) {
                        var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
                        ie && ie_version < 9 ? content.appendChild(elt("span", [
                            txt
                        ])) : content.appendChild(txt), builder.map.push(builder.pos, builder.pos + skipped, txt), builder.col += skipped, builder.pos += skipped;
                    }
                    if (!m) break;
                    pos += skipped + 1;
                    var txt$1 = void 0;
                    if ("\t" == m[0]) {
                        var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
                        (txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"))).setAttribute("role", "presentation"), txt$1.setAttribute("cm-text", "\t"), builder.col += tabWidth;
                    } else "\r" == m[0] || "\n" == m[0] ? (txt$1 = content.appendChild(elt("span", "\r" == m[0] ? "\u240d" : "\u2424", "cm-invalidchar"))).setAttribute("cm-text", m[0]) : ((txt$1 = builder.cm.options.specialCharPlaceholder(m[0])).setAttribute("cm-text", m[0]), ie && ie_version < 9 ? content.appendChild(elt("span", [
                        txt$1
                    ])) : content.appendChild(txt$1)), builder.col += 1;
                    builder.map.push(builder.pos, builder.pos + 1, txt$1), builder.pos++;
                }
            } else builder.col += text.length, content = document.createTextNode(displayText), builder.map.push(builder.pos, builder.pos + text.length, content), ie && ie_version < 9 && (mustWrap = !0), builder.pos += text.length;
            if (builder.trailingSpace = 32 == displayText.charCodeAt(text.length - 1), style || startStyle || endStyle || mustWrap || css || attributes) {
                var fullStyle = style || "";
                startStyle && (fullStyle += startStyle), endStyle && (fullStyle += endStyle);
                var token = elt("span", [
                    content
                ], fullStyle, css);
                if (attributes) for(var attr in attributes)attributes.hasOwnProperty(attr) && "style" != attr && "class" != attr && token.setAttribute(attr, attributes[attr]);
                return builder.content.appendChild(token);
            }
            builder.content.appendChild(content);
        }
    }
    function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
        var widget = !ignoreWidget && marker.widgetNode;
        widget && builder.map.push(builder.pos, builder.pos + size, widget), !ignoreWidget && builder.cm.display.input.needsContentAttribute && (widget || (widget = builder.content.appendChild(document.createElement("span"))), widget.setAttribute("cm-marker", marker.id)), widget && (builder.cm.display.input.setUneditable(widget), builder.content.appendChild(widget)), builder.pos += size, builder.trailingSpace = !1;
    }
    // These objects are used to represent the visible (currently drawn)
    // part of the document. A LineView may correspond to multiple
    // logical lines, if those are connected by collapsed ranges.
    function LineView(doc, line, lineN) {
        // The starting line
        this.line = line, // Continuing lines, if any
        this.rest = // Returns an array of logical lines that continue the visual line
        // started by the argument, or undefined if there are no such lines.
        function(line) {
            for(var merged, lines; merged = collapsedSpanAtSide(line, !1);)line = merged.find(1, !0).line, (lines || (lines = [])).push(line);
            return lines;
        }(line), // Number of logical lines in this visual line
        this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1, this.node = this.text = null, this.hidden = lineIsHidden(doc, line);
    }
    // Create a range of LineView objects for the given lines.
    function buildViewArray(cm, from, to) {
        for(var nextPos, array = [], pos = from; pos < to; pos = nextPos){
            var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
            nextPos = pos + view.size, array.push(view);
        }
        return array;
    }
    var operationGroup = null, orphanDelayedCallbacks = null;
    // Often, we want to signal events at a point where we are in the
    // middle of some work, but don't want the handler to start calling
    // other methods on the editor, which might be in an inconsistent
    // state or simply not expect any other events to happen.
    // signalLater looks whether there are any handlers, and schedules
    // them to be executed when the last operation ends, or, if no
    // operation is active, when a timeout fires.
    function signalLater(emitter, type /*, values...*/ ) {
        var arr = getHandlers(emitter, type);
        if (arr.length) {
            var list, args = Array.prototype.slice.call(arguments, 2);
            operationGroup ? list = operationGroup.delayedCallbacks : orphanDelayedCallbacks ? list = orphanDelayedCallbacks : (list = orphanDelayedCallbacks = [], setTimeout(fireOrphanDelayed, 0));
            for(var loop = function(i) {
                list.push(function() {
                    return arr[i].apply(null, args);
                });
            }, i = 0; i < arr.length; ++i)loop(i);
        }
    }
    function fireOrphanDelayed() {
        var delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for(var i = 0; i < delayed.length; ++i)delayed[i]();
    }
    // When an aspect of a line changes, a string is added to
    // lineView.changes. This updates the relevant part of the line's
    // DOM structure.
    function updateLineForChanges(cm, lineView, lineN, dims) {
        for(var j = 0; j < lineView.changes.length; j++){
            var type = lineView.changes[j];
            "text" == type ? // Redraw the line's text. Interacts with the background and text
            // classes because the mode may output tokens that influence these
            // classes.
            function(cm, lineView) {
                var cls = lineView.text.className, built = getLineContent(cm, lineView);
                lineView.text == lineView.node && (lineView.node = built.pre), lineView.text.parentNode.replaceChild(built.pre, lineView.text), lineView.text = built.pre, built.bgClass != lineView.bgClass || built.textClass != lineView.textClass ? (lineView.bgClass = built.bgClass, lineView.textClass = built.textClass, updateLineClasses(cm, lineView)) : cls && (lineView.text.className = cls);
            }(cm, lineView) : "gutter" == type ? updateLineGutter(cm, lineView, lineN, dims) : "class" == type ? updateLineClasses(cm, lineView) : "widget" == type && function(cm, lineView, dims) {
                lineView.alignable && (lineView.alignable = null);
                for(var isWidget = classTest("CodeMirror-linewidget"), node = lineView.node.firstChild, next = void 0; node; node = next)next = node.nextSibling, isWidget.test(node.className) && lineView.node.removeChild(node);
                insertLineWidgets(cm, lineView, dims);
            }(cm, lineView, dims);
        }
        lineView.changes = null;
    }
    // Lines with gutter elements, widgets or a background class need to
    // be wrapped, and have the extra elements added to the wrapper div
    function ensureLineWrapped(lineView) {
        return lineView.node == lineView.text && (lineView.node = elt("div", null, null, "position: relative"), lineView.text.parentNode && lineView.text.parentNode.replaceChild(lineView.node, lineView.text), lineView.node.appendChild(lineView.text), ie && ie_version < 8 && (lineView.node.style.zIndex = 2)), lineView.node;
    }
    // Wrapper around buildLineContent which will reuse the structure
    // in display.externalMeasured when possible.
    function getLineContent(cm, lineView) {
        var ext = cm.display.externalMeasured;
        return ext && ext.line == lineView.line ? (cm.display.externalMeasured = null, lineView.measure = ext.measure, ext.built) : buildLineContent(cm, lineView);
    }
    function updateLineClasses(cm, lineView) {
        !function(cm, lineView) {
            var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
            if (cls && (cls += " CodeMirror-linebackground"), lineView.background) cls ? lineView.background.className = cls : (lineView.background.parentNode.removeChild(lineView.background), lineView.background = null);
            else if (cls) {
                var wrap = ensureLineWrapped(lineView);
                lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild), cm.display.input.setUneditable(lineView.background);
            }
        }(cm, lineView), lineView.line.wrapClass ? ensureLineWrapped(lineView).className = lineView.line.wrapClass : lineView.node != lineView.text && (lineView.node.className = "");
        var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
        lineView.text.className = textClass || "";
    }
    function updateLineGutter(cm, lineView, lineN, dims) {
        if (lineView.gutter && (lineView.node.removeChild(lineView.gutter), lineView.gutter = null), lineView.gutterBackground && (lineView.node.removeChild(lineView.gutterBackground), lineView.gutterBackground = null), lineView.line.gutterClass) {
            var wrap = ensureLineWrapped(lineView);
            lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass, "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + dims.gutterTotalWidth + "px"), cm.display.input.setUneditable(lineView.gutterBackground), wrap.insertBefore(lineView.gutterBackground, lineView.text);
        }
        var markers = lineView.line.gutterMarkers;
        if (cm.options.lineNumbers || markers) {
            var wrap$1 = ensureLineWrapped(lineView), gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
            if (gutterWrap.setAttribute("aria-hidden", "true"), cm.display.input.setUneditable(gutterWrap), wrap$1.insertBefore(gutterWrap, lineView.text), lineView.line.gutterClass && (gutterWrap.className += " " + lineView.line.gutterClass), !cm.options.lineNumbers || markers && markers["CodeMirror-linenumbers"] || (lineView.lineNumber = gutterWrap.appendChild(elt("div", lineNumberFor(cm.options, lineN), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + cm.display.lineNumInnerWidth + "px"))), markers) for(var k = 0; k < cm.display.gutterSpecs.length; ++k){
                var id = cm.display.gutterSpecs[k].className, found = markers.hasOwnProperty(id) && markers[id];
                found && gutterWrap.appendChild(elt("div", [
                    found
                ], "CodeMirror-gutter-elt", "left: " + dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
            }
        }
    }
    // A lineView may contain multiple logical lines (when merged by
    // collapsed spans). The widgets for all of them need to be drawn.
    function insertLineWidgets(cm, lineView, dims) {
        if (insertLineWidgetsFor(cm, lineView.line, lineView, dims, !0), lineView.rest) for(var i = 0; i < lineView.rest.length; i++)insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, !1);
    }
    function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
        if (line.widgets) for(var wrap = ensureLineWrapped(lineView), i = 0, ws = line.widgets; i < ws.length; ++i){
            var widget = ws[i], node = elt("div", [
                widget.node
            ], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
            widget.handleMouseEvents || node.setAttribute("cm-ignore-events", "true"), function(widget, node, lineView, dims) {
                if (widget.noHScroll) {
                    (lineView.alignable || (lineView.alignable = [])).push(node);
                    var width = dims.wrapperWidth;
                    node.style.left = dims.fixedPos + "px", widget.coverGutter || (width -= dims.gutterTotalWidth, node.style.paddingLeft = dims.gutterTotalWidth + "px"), node.style.width = width + "px";
                }
                widget.coverGutter && (node.style.zIndex = 5, node.style.position = "relative", widget.noHScroll || (node.style.marginLeft = -dims.gutterTotalWidth + "px"));
            }(widget, node, lineView, dims), cm.display.input.setUneditable(node), allowAbove && widget.above ? wrap.insertBefore(node, lineView.gutter || lineView.text) : wrap.appendChild(node), signalLater(widget, "redraw");
        }
    }
    function widgetHeight(widget) {
        if (null != widget.height) return widget.height;
        var cm = widget.doc.cm;
        if (!cm) return 0;
        if (!contains(document.body, widget.node)) {
            var parentStyle = "position: relative;";
            widget.coverGutter && (parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;"), widget.noHScroll && (parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;"), removeChildrenAndAdd(cm.display.measure, elt("div", [
                widget.node
            ], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
    }
    // Return true when the given mouse event happened in a widget
    function eventInWidget(display, e) {
        for(var n = e_target(e); n != display.wrapper; n = n.parentNode)if (!n || 1 == n.nodeType && "true" == n.getAttribute("cm-ignore-events") || n.parentNode == display.sizer && n != display.mover) return !0;
    }
    // POSITION MEASUREMENT
    function paddingTop(display) {
        return display.lineSpace.offsetTop;
    }
    function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
    }
    function paddingH(display) {
        if (display.cachedPaddingH) return display.cachedPaddingH;
        var e = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like")), style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle, data = {
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight)
        };
        return isNaN(data.left) || isNaN(data.right) || (display.cachedPaddingH = data), data;
    }
    function scrollGap(cm) {
        return 50 - cm.display.nativeBarWidth;
    }
    function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
    }
    function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
    }
    // Find a line map (mapping character offsets to text nodes) and a
    // measurement cache for the given line number. (A line view might
    // contain multiple lines when collapsed ranges are present.)
    function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line) return {
            map: lineView.measure.map,
            cache: lineView.measure.cache
        };
        if (lineView.rest) {
            for(var i = 0; i < lineView.rest.length; i++)if (lineView.rest[i] == line) return {
                map: lineView.measure.maps[i],
                cache: lineView.measure.caches[i]
            };
            for(var i$1 = 0; i$1 < lineView.rest.length; i$1++)if (lineNo(lineView.rest[i$1]) > lineN) return {
                map: lineView.measure.maps[i$1],
                cache: lineView.measure.caches[i$1],
                before: !0
            };
        }
    }
    // Find a line view that corresponds to the given line number.
    function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) return cm.display.view[findViewIndex(cm, lineN)];
        var ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) return ext;
    }
    // Measurement can be split in two steps, the set-up work that
    // applies to the whole line, and the measurement of the actual
    // character. Functions like coordsChar, that need to do a lot of
    // measurements in a row, can thus ensure that the set-up work is
    // only done once.
    function prepareMeasureForLine(cm, line) {
        var line1, lineN, view, built, lineN1 = lineNo(line), view1 = findViewForLine(cm, lineN1);
        view1 && !view1.text ? view1 = null : view1 && view1.changes && (updateLineForChanges(cm, view1, lineN1, getDimensions(cm)), cm.curOp.forceUpdate = !0), view1 || (lineN = lineNo(line1 = visualLine(line1 = line)), (view = cm.display.externalMeasured = new LineView(cm.doc, line1, lineN)).lineN = lineN, built = view.built = buildLineContent(cm, view), view.text = built.pre, removeChildrenAndAdd(cm.display.lineMeasure, built.pre), view1 = view);
        var info = mapFromLineView(view1, line, lineN1);
        return {
            line: line,
            view: view1,
            rect: null,
            map: info.map,
            cache: info.cache,
            before: info.before,
            hasHeights: !1
        };
    }
    // Given a prepared measurement object, measures the position of an
    // actual character (or fetches it from the cache).
    function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        prepared.before && (ch = -1);
        var found, key = ch + (bias || "");
        return prepared.cache.hasOwnProperty(key) ? found = prepared.cache[key] : (prepared.rect || (prepared.rect = prepared.view.text.getBoundingClientRect()), prepared.hasHeights || (// Ensure the lineView.wrapping.heights array is populated. This is
        // an array of bottom offsets for the lines that make up a drawn
        // line. When lineWrapping is on, there might be more than one
        // height.
        function(cm, lineView, rect) {
            var wrapping = cm.options.lineWrapping, curWidth = wrapping && displayWidth(cm);
            if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
                var heights = lineView.measure.heights = [];
                if (wrapping) {
                    lineView.measure.width = curWidth;
                    for(var rects = lineView.text.firstChild.getClientRects(), i = 0; i < rects.length - 1; i++){
                        var cur = rects[i], next = rects[i + 1];
                        Math.abs(cur.bottom - next.bottom) > 2 && heights.push((cur.bottom + next.top) / 2 - rect.top);
                    }
                }
                heights.push(rect.bottom - rect.top);
            }
        }(cm, prepared.view, prepared.rect), prepared.hasHeights = !0), (found = function(cm, prepared, ch, bias) {
            var rect, rects, place = nodeAndOffsetInLineMap(prepared.map, ch, bias), node = place.node, start = place.start, end = place.end, collapse = place.collapse;
            if (3 == node.nodeType) {
                // If it is a text node, use a range to retrieve the coordinates.
                for(var i$1 = 0; i$1 < 4; i$1++){
                    // Retry a maximum of 4 times when nonsense rectangles are returned
                    for(; start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start));)--start;
                    for(; place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end));)++end;
                    if ((rect = ie && ie_version < 9 && 0 == start && end == place.coverEnd - place.coverStart ? node.parentNode.getBoundingClientRect() : function(rects, bias) {
                        var rect = nullRect;
                        if ("left" == bias) for(var i = 0; i < rects.length && (rect = rects[i]).left == rect.right; i++);
                        else for(var i$1 = rects.length - 1; i$1 >= 0 && (rect = rects[i$1]).left == rect.right; i$1--);
                        return rect;
                    }(range(node, start, end).getClientRects(), bias)).left || rect.right || 0 == start) break;
                    end = start, start -= 1, collapse = "right";
                }
                ie && ie_version < 11 && (rect = // Work around problem with bounding client rects on ranges being
                // returned incorrectly when zoomed on IE10 and below.
                function(measure, rect) {
                    if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !function(measure) {
                        if (null != badZoomedRects) return badZoomedRects;
                        var node = removeChildrenAndAdd(measure, elt("span", "x")), normal = node.getBoundingClientRect(), fromRange = range(node, 0, 1).getBoundingClientRect();
                        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
                    }(measure)) return rect;
                    var scaleX = screen.logicalXDPI / screen.deviceXDPI, scaleY = screen.logicalYDPI / screen.deviceYDPI;
                    return {
                        left: rect.left * scaleX,
                        right: rect.right * scaleX,
                        top: rect.top * scaleY,
                        bottom: rect.bottom * scaleY
                    };
                }(cm.display.measure, rect));
            } else start > 0 && (collapse = bias = "right"), rect = cm.options.lineWrapping && (rects = node.getClientRects()).length > 1 ? rects["right" == bias ? rects.length - 1 : 0] : node.getBoundingClientRect();
            if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
                var rSpan = node.parentNode.getClientRects()[0];
                rect = rSpan ? {
                    left: rSpan.left,
                    right: rSpan.left + charWidth(cm.display),
                    top: rSpan.top,
                    bottom: rSpan.bottom
                } : nullRect;
            }
            for(var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top, mid = (rtop + rbot) / 2, heights = prepared.view.measure.heights, i = 0; i < heights.length - 1 && !(mid < heights[i]); i++);
            var top = i ? heights[i - 1] : 0, bot = heights[i], result = {
                left: ("right" == collapse ? rect.right : rect.left) - prepared.rect.left,
                right: ("left" == collapse ? rect.left : rect.right) - prepared.rect.left,
                top: top,
                bottom: bot
            };
            return rect.left || rect.right || (result.bogus = !0), cm.options.singleCursorHeightPerLine || (result.rtop = rtop, result.rbottom = rbot), result;
        }(cm, prepared, ch, bias)).bogus || (prepared.cache[key] = found)), {
            left: found.left,
            right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom
        };
    }
    var nullRect = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function nodeAndOffsetInLineMap(map, ch, bias) {
        // First, search the line map for the text node corresponding to,
        // or closest to, the target character.
        for(var node, start, end, collapse, mStart, mEnd, i = 0; i < map.length; i += 3)if (mStart = map[i], mEnd = map[i + 1], ch < mStart ? (start = 0, end = 1, collapse = "left") : ch < mEnd ? end = (start = ch - mStart) + 1 : (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) && (start = (end = mEnd - mStart) - 1, ch >= mEnd && (collapse = "right")), null != start) {
            if (node = map[i + 2], mStart == mEnd && bias == (node.insertLeft ? "left" : "right") && (collapse = bias), "left" == bias && 0 == start) for(; i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft;)node = map[(i -= 3) + 2], collapse = "left";
            if ("right" == bias && start == mEnd - mStart) for(; i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft;)node = map[(i += 3) + 2], collapse = "right";
            break;
        }
        return {
            node: node,
            start: start,
            end: end,
            collapse: collapse,
            coverStart: mStart,
            coverEnd: mEnd
        };
    }
    function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure && (lineView.measure.cache = {}, lineView.measure.heights = null, lineView.rest)) for(var i = 0; i < lineView.rest.length; i++)lineView.measure.caches[i] = {};
    }
    function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null, removeChildren(cm.display.lineMeasure);
        for(var i = 0; i < cm.display.view.length; i++)clearLineMeasurementCacheFor(cm.display.view[i]);
    }
    function clearCaches(cm) {
        clearLineMeasurementCache(cm), cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null, cm.options.lineWrapping || (cm.display.maxLineChanged = !0), cm.display.lineNumChars = null;
    }
    function pageScrollX() {
        return(// Work around https://bugs.chromium.org/p/chromium/issues/detail?id=489206
        // which causes page_Offset and bounding client rects to use
        // different reference viewports and invalidate our calculations.
        chrome && android ? -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) : window.pageXOffset || (document.documentElement || document.body).scrollLeft);
    }
    function pageScrollY() {
        return chrome && android ? -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) : window.pageYOffset || (document.documentElement || document.body).scrollTop;
    }
    function widgetTopHeight(lineObj) {
        var widgets = visualLine(lineObj).widgets, height = 0;
        if (widgets) for(var i = 0; i < widgets.length; ++i)widgets[i].above && (height += widgetHeight(widgets[i]));
        return height;
    }
    // Converts a {top, bottom, left, right} box from line-local
    // coordinates into another coordinate system. Context may be one of
    // "line", "div" (display.lineDiv), "local"./null (editor), "window",
    // or "page".
    function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
            var height = widgetTopHeight(lineObj);
            rect.top += height, rect.bottom += height;
        }
        if ("line" == context) return rect;
        context || (context = "local");
        var yOff = heightAtLine(lineObj);
        if ("local" == context ? yOff += paddingTop(cm.display) : yOff -= cm.display.viewOffset, "page" == context || "window" == context) {
            var lOff = cm.display.lineSpace.getBoundingClientRect();
            yOff += lOff.top + ("window" == context ? 0 : pageScrollY());
            var xOff = lOff.left + ("window" == context ? 0 : pageScrollX());
            rect.left += xOff, rect.right += xOff;
        }
        return rect.top += yOff, rect.bottom += yOff, rect;
    }
    // Coverts a box from "div" coords to another coordinate system.
    // Context may be "window", "page", "div", or "local"./null.
    function fromCoordSystem(cm, coords, context) {
        if ("div" == context) return coords;
        var left = coords.left, top = coords.top;
        // First move into "page" coordinate system
        if ("page" == context) left -= pageScrollX(), top -= pageScrollY();
        else if ("local" == context || !context) {
            var localBox = cm.display.sizer.getBoundingClientRect();
            left += localBox.left, top += localBox.top;
        }
        var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return {
            left: left - lineSpaceBox.left,
            top: top - lineSpaceBox.top
        };
    }
    function charCoords(cm, pos, context, lineObj, bias) {
        var line, ch;
        return lineObj || (lineObj = getLine(cm.doc, pos.line)), intoCoordSystem(cm, lineObj, (line = lineObj, ch = pos.ch, measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias)), context);
    }
    // Returns a box for a given cursor position, which may have an
    // 'other' property containing the position of the secondary cursor
    // on a bidi boundary.
    // A cursor Pos(line, char, "before") is on the same visual line as `char - 1`
    // and after `char - 1` in writing order of `char - 1`
    // A cursor Pos(line, char, "after") is on the same visual line as `char`
    // and before `char` in writing order of `char`
    // Examples (upper-case letters are RTL, lower-case are LTR):
    //     Pos(0, 1, ...)
    //     before   after
    // ab     a|b     a|b
    // aB     a|B     aB|
    // Ab     |Ab     A|b
    // AB     B|A     B|A
    // Every position after the last character on a line is considered to stick
    // to the last character on the line.
    function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        function get(ch, right) {
            var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
            return right ? m.left = m.right : m.right = m.left, intoCoordSystem(cm, lineObj, m, context);
        }
        lineObj = lineObj || getLine(cm.doc, pos.line), preparedMeasure || (preparedMeasure = prepareMeasureForLine(cm, lineObj));
        var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length ? (ch = lineObj.text.length, sticky = "before") : ch <= 0 && (ch = 0, sticky = "after"), !order) return get("before" == sticky ? ch - 1 : ch, "before" == sticky);
        function getBidi(ch, partPos, invert) {
            return get(invert ? ch - 1 : ch, 1 == order[partPos].level != invert);
        }
        var partPos = getBidiPartAt(order, ch, sticky), other = bidiOther, val = getBidi(ch, partPos, "before" == sticky);
        return null != other && (val.other = getBidi(ch, other, "before" != sticky)), val;
    }
    // Used to cheaply estimate the coordinates for a position. Used for
    // intermediate scroll updates.
    function estimateCoords(cm, pos) {
        var left = 0;
        pos = clipPos(cm.doc, pos), cm.options.lineWrapping || (left = charWidth(cm.display) * pos.ch);
        var lineObj = getLine(cm.doc, pos.line), top = heightAtLine(lineObj) + paddingTop(cm.display);
        return {
            left: left,
            right: left,
            top: top,
            bottom: top + lineObj.height
        };
    }
    // Positions returned by coordsChar contain some extra information.
    // xRel is the relative x position of the input coordinates compared
    // to the found position (so xRel > 0 means the coordinates are to
    // the right of the character position, for example). When outside
    // is true, that means the coordinates lie outside the line's
    // vertical range.
    function PosWithInfo(line, ch, sticky, outside, xRel) {
        var pos = Pos(line, ch, sticky);
        return pos.xRel = xRel, outside && (pos.outside = outside), pos;
    }
    // Compute the character position closest to the given coordinates.
    // Input must be lineSpace-local ("div" coordinate system).
    function coordsChar(cm, x, y) {
        var doc = cm.doc;
        if ((y += cm.display.viewOffset) < 0) return PosWithInfo(doc.first, 0, null, -1, -1);
        var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
        if (lineN > last) return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, null, 1, 1);
        x < 0 && (x = 0);
        for(var lineObj = getLine(doc, lineN);;){
            var found = function(cm, lineObj, lineNo, x, y) {
                // Move y into line-local coordinate space
                y -= heightAtLine(lineObj);
                var preparedMeasure = prepareMeasureForLine(cm, lineObj), widgetHeight = widgetTopHeight(lineObj), begin = 0, end = lineObj.text.length, ltr = !0, order = getOrder(lineObj, cm.doc.direction);
                // If the line isn't plain left-to-right text, first figure out
                // which bidi section the coordinates fall into.
                if (order) {
                    var part = (cm.options.lineWrapping ? function(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
                        // In a wrapped line, rtl text on wrapping boundaries can do things
                        // that don't correspond to the ordering in our `order` array at
                        // all, so a binary search doesn't work, and we want to return a
                        // part that only spans one line so that the binary search in
                        // coordsCharInner is safe. As such, we first find the extent of the
                        // wrapped line, and then do a flat search in which we discard any
                        // spans that aren't on the line.
                        var ref = wrappedLineExtent(cm, lineObj, preparedMeasure, y), begin = ref.begin, end = ref.end;
                        /\s/.test(lineObj.text.charAt(end - 1)) && end--;
                        for(var part = null, closestDist = null, i = 0; i < order.length; i++){
                            var p = order[i];
                            if (!(p.from >= end) && !(p.to <= begin)) {
                                var endX = measureCharPrepared(cm, preparedMeasure, 1 != p.level ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right, dist = endX < x ? x - endX + 1e9 : endX - x;
                                (!part || closestDist > dist) && (part = p, closestDist = dist);
                            }
                        }
                        return part || (part = order[order.length - 1]), part.from < begin && (part = {
                            from: begin,
                            to: part.to,
                            level: part.level
                        }), part.to > end && (part = {
                            from: part.from,
                            to: end,
                            level: part.level
                        }), part;
                    } : function(cm, lineObj, lineNo, preparedMeasure, order, x, y) {
                        // Bidi parts are sorted left-to-right, and in a non-line-wrapping
                        // situation, we can take this ordering to correspond to the visual
                        // ordering. This finds the first part whose end is after the given
                        // coordinates.
                        var index = findFirst(function(i) {
                            var part = order[i], ltr = 1 != part.level;
                            return boxIsAfter(cursorCoords(cm, Pos(lineNo, ltr ? part.to : part.from, ltr ? "before" : "after"), "line", lineObj, preparedMeasure), x, y, !0);
                        }, 0, order.length - 1), part = order[index];
                        // If this isn't the first part, the part's start is also after
                        // the coordinates, and the coordinates aren't on the same line as
                        // that start, move one part back.
                        if (index > 0) {
                            var ltr = 1 != part.level, start = cursorCoords(cm, Pos(lineNo, ltr ? part.from : part.to, ltr ? "after" : "before"), "line", lineObj, preparedMeasure);
                            boxIsAfter(start, x, y, !0) && start.top > y && (part = order[index - 1]);
                        }
                        return part;
                    })(cm, lineObj, lineNo, preparedMeasure, order, x, y);
                    // The awkward -1 offsets are needed because findFirst (called
                    // on these below) will treat its first bound as inclusive,
                    // second as exclusive, but we want to actually address the
                    // characters in the part's range
                    begin = (ltr = 1 != part.level) ? part.from : part.to - 1, end = ltr ? part.to : part.from - 1;
                }
                // A binary search to find the first character whose bounding box
                // starts after the coordinates. If we run across any whose box wrap
                // the coordinates, store that.
                var baseX, sticky, chAround = null, boxAround = null, ch = findFirst(function(ch) {
                    var box = measureCharPrepared(cm, preparedMeasure, ch);
                    return box.top += widgetHeight, box.bottom += widgetHeight, !!boxIsAfter(box, x, y, !1) && (box.top <= y && box.left <= x && (chAround = ch, boxAround = box), !0);
                }, begin, end), outside = !1;
                // If a box around the coordinates was found, use that
                if (boxAround) {
                    // Distinguish coordinates nearer to the left or right side of the box
                    var atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
                    ch = chAround + (atStart ? 0 : 1), sticky = atStart ? "after" : "before", baseX = atLeft ? boxAround.left : boxAround.right;
                } else {
                    !ltr && (ch == end || ch == begin) && ch++, // To determine which side to associate with, get the box to the
                    // left of the character and compare it's vertical position to the
                    // coordinates
                    sticky = 0 == ch ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight <= y == ltr ? "after" : "before";
                    // Now get accurate coordinates for this place, in order to get a
                    // base X position
                    var coords = cursorCoords(cm, Pos(lineNo, ch, sticky), "line", lineObj, preparedMeasure);
                    baseX = coords.left, outside = y < coords.top ? -1 : y >= coords.bottom ? 1 : 0;
                }
                return PosWithInfo(lineNo, ch = skipExtendingChars(lineObj.text, ch, 1), sticky, outside, x - baseX);
            }(cm, lineObj, lineN, x, y), collapsed = function(line, ch) {
                var found, sps = sawCollapsedSpans && line.markedSpans;
                if (sps) for(var i = 0; i < sps.length; ++i){
                    var sp = sps[i];
                    sp.marker.collapsed && (null == sp.from || sp.from < ch) && (null == sp.to || sp.to > ch) && (!found || 0 > compareCollapsedMarkers(found, sp.marker)) && (found = sp.marker);
                }
                return found;
            }(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
            if (!collapsed) return found;
            var rangeEnd = collapsed.find(1);
            if (rangeEnd.line == lineN) return rangeEnd;
            lineObj = getLine(doc, lineN = rangeEnd.line);
        }
    }
    function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
        y -= widgetTopHeight(lineObj);
        var end = lineObj.text.length, begin = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y;
        }, end, 0);
        return end = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch).top > y;
        }, begin, end), {
            begin: begin,
            end: end
        };
    }
    function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        preparedMeasure || (preparedMeasure = prepareMeasureForLine(cm, lineObj));
        var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
    }
    // Returns true if the given side of a box is after the given
    // coordinates, in top-to-bottom, left-to-right order.
    function boxIsAfter(box, x, y, left) {
        return !(box.bottom <= y) && (box.top > y || (left ? box.left : box.right) > x);
    }
    // Compute the default text height.
    function textHeight(display) {
        if (null != display.cachedTextHeight) return display.cachedTextHeight;
        if (null == measureText) {
            measureText = elt("pre", null, "CodeMirror-line-like");
            // Measure a bunch of lines, for browsers that compute
            // fractional heights.
            for(var i = 0; i < 49; ++i)measureText.appendChild(document.createTextNode("x")), measureText.appendChild(elt("br"));
            measureText.appendChild(document.createTextNode("x"));
        }
        removeChildrenAndAdd(display.measure, measureText);
        var height = measureText.offsetHeight / 50;
        return height > 3 && (display.cachedTextHeight = height), removeChildren(display.measure), height || 1;
    }
    // Compute the default character width.
    function charWidth(display) {
        if (null != display.cachedCharWidth) return display.cachedCharWidth;
        var anchor = elt("span", "xxxxxxxxxx"), pre = elt("pre", [
            anchor
        ], "CodeMirror-line-like");
        removeChildrenAndAdd(display.measure, pre);
        var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        return width > 2 && (display.cachedCharWidth = width), width || 10;
    }
    // Do a bulk-read of the DOM positions and sizes needed to draw the
    // view, so that we don't interleave reading and writing to the DOM.
    function getDimensions(cm) {
        for(var d = cm.display, left = {}, width = {}, gutterLeft = d.gutters.clientLeft, n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i){
            var id = cm.display.gutterSpecs[i].className;
            left[id] = n.offsetLeft + n.clientLeft + gutterLeft, width[id] = n.clientWidth;
        }
        return {
            fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth
        };
    }
    // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
    // but using getBoundingClientRect to get a sub-pixel-accurate
    // result.
    function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
    }
    // Returns a function that estimates the height of a line, to use as
    // first approximation until the line becomes visible (and is thus
    // properly measurable).
    function estimateHeight(cm) {
        var th = textHeight(cm.display), wrapping = cm.options.lineWrapping, perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return function(line) {
            if (lineIsHidden(cm.doc, line)) return 0;
            var widgetsHeight = 0;
            if (line.widgets) for(var i = 0; i < line.widgets.length; i++)line.widgets[i].height && (widgetsHeight += line.widgets[i].height);
            return wrapping ? widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th : widgetsHeight + th;
        };
    }
    function estimateLineHeights(cm) {
        var doc = cm.doc, est = estimateHeight(cm);
        doc.iter(function(line) {
            var estHeight = est(line);
            estHeight != line.height && updateLineHeight(line, estHeight);
        });
    }
    // Given a mouse event, find the corresponding position. If liberal
    // is false, it checks whether a gutter or scrollbar was clicked,
    // and returns null if it was. forRect is used by rectangular
    // selections, and tries to estimate a character position even for
    // coordinates beyond the right of the text.
    function posFromMouse(cm, e, liberal, forRect) {
        var display = cm.display;
        if (!liberal && "true" == e_target(e).getAttribute("cm-not-content")) return null;
        var x, y, space = display.lineSpace.getBoundingClientRect();
        // Fails unpredictably on IE[67] when mouse is dragged around quickly.
        try {
            x = e.clientX - space.left, y = e.clientY - space.top;
        } catch (e$1) {
            return null;
        }
        var line, coords = coordsChar(cm, x, y);
        if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
            var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
            coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
    }
    // Find the view element corresponding to a given line. Return null
    // when the line isn't visible.
    function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo || (n -= cm.display.viewFrom) < 0) return null;
        for(var view = cm.display.view, i = 0; i < view.length; i++)if ((n -= view[i].size) < 0) return i;
    }
    // Updates the display.view data structure for a given change to the
    // document. From and to are in pre-change coordinates. Lendiff is
    // the amount of lines added or subtracted by the change. This is
    // used for changes that span multiple lines, or change the way
    // lines are divided into visual lines. regLineChange (below)
    // registers single-line changes.
    function regChange(cm, from, to, lendiff) {
        null == from && (from = cm.doc.first), null == to && (to = cm.doc.first + cm.doc.size), lendiff || (lendiff = 0);
        var display = cm.display;
        if (lendiff && to < display.viewTo && (null == display.updateLineNumbers || display.updateLineNumbers > from) && (display.updateLineNumbers = from), cm.curOp.viewChanged = !0, from >= display.viewTo) // Change after
        sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo && resetView(cm);
        else if (to <= display.viewFrom) // Change before
        sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom ? resetView(cm) : (display.viewFrom += lendiff, display.viewTo += lendiff);
        else if (from <= display.viewFrom && to >= display.viewTo) // Full overlap
        resetView(cm);
        else if (from <= display.viewFrom) {
            // Top overlap
            var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
            cut ? (display.view = display.view.slice(cut.index), display.viewFrom = cut.lineN, display.viewTo += lendiff) : resetView(cm);
        } else if (to >= display.viewTo) {
            // Bottom overlap
            var cut$1 = viewCuttingPoint(cm, from, from, -1);
            cut$1 ? (display.view = display.view.slice(0, cut$1.index), display.viewTo = cut$1.lineN) : resetView(cm);
        } else {
            // Gap in the middle
            var cutTop = viewCuttingPoint(cm, from, from, -1), cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
            cutTop && cutBot ? (display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index)), display.viewTo += lendiff) : resetView(cm);
        }
        var ext = display.externalMeasured;
        ext && (to < ext.lineN ? ext.lineN += lendiff : from < ext.lineN + ext.size && (display.externalMeasured = null));
    }
    // Register a change to a single line. Type must be one of "text",
    // "gutter", "class", "widget"
    function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = !0;
        var display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size && (display.externalMeasured = null), !(line < display.viewFrom) && !(line >= display.viewTo)) {
            var lineView = display.view[findViewIndex(cm, line)];
            if (null != lineView.node) {
                var arr = lineView.changes || (lineView.changes = []);
                -1 == indexOf(arr, type) && arr.push(type);
            }
        }
    }
    // Clear the view.
    function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first, cm.display.view = [], cm.display.viewOffset = 0;
    }
    function viewCuttingPoint(cm, oldN, newN, dir) {
        var diff, index = findViewIndex(cm, oldN), view = cm.display.view;
        if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) return {
            index: index,
            lineN: newN
        };
        for(var n = cm.display.viewFrom, i = 0; i < index; i++)n += view[i].size;
        if (n != oldN) {
            if (dir > 0) {
                if (index == view.length - 1) return null;
                diff = n + view[index].size - oldN, index++;
            } else diff = n - oldN;
            oldN += diff, newN += diff;
        }
        for(; visualLineNo(cm.doc, newN) != newN;){
            if (index == (dir < 0 ? 0 : view.length - 1)) return null;
            newN += dir * view[index - (dir < 0 ? 1 : 0)].size, index += dir;
        }
        return {
            index: index,
            lineN: newN
        };
    }
    // Count the number of lines in the view whose DOM representation is
    // out of date (or nonexistent).
    function countDirtyView(cm) {
        for(var view = cm.display.view, dirty = 0, i = 0; i < view.length; i++){
            var lineView = view[i];
            !lineView.hidden && (!lineView.node || lineView.changes) && ++dirty;
        }
        return dirty;
    }
    function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
    }
    function prepareSelection(cm, primary) {
        void 0 === primary && (primary = !0);
        var doc = cm.doc, result = {}, curFragment = result.cursors = document.createDocumentFragment(), selFragment = result.selection = document.createDocumentFragment(), customCursor = cm.options.$customCursor;
        customCursor && (primary = !0);
        for(var i = 0; i < doc.sel.ranges.length; i++)if (primary || i != doc.sel.primIndex) {
            var range = doc.sel.ranges[i];
            if (!(range.from().line >= cm.display.viewTo) && !(range.to().line < cm.display.viewFrom)) {
                var collapsed = range.empty();
                if (customCursor) {
                    var head = customCursor(cm, range);
                    head && drawSelectionCursor(cm, head, curFragment);
                } else (collapsed || cm.options.showCursorWhenSelecting) && drawSelectionCursor(cm, range.head, curFragment);
                collapsed || // Draws the given range as a highlighted selection
                function(cm, range, output) {
                    var display = cm.display, doc = cm.doc, fragment = document.createDocumentFragment(), padding = paddingH(cm.display), leftSide = padding.left, rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right, docLTR = "ltr" == doc.direction;
                    function add(left, top, width, bottom) {
                        top < 0 && (top = 0), top = Math.round(top), bottom = Math.round(bottom), fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (null == width ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px"));
                    }
                    function drawForLine(line, fromArg, toArg) {
                        var start, end, lineObj = getLine(doc, line), lineLen = lineObj.text.length;
                        function coords(ch, bias) {
                            return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
                        }
                        function wrapX(pos, dir, side) {
                            var extent = wrappedLineExtentChar(cm, lineObj, null, pos), prop = "ltr" == dir == ("after" == side) ? "left" : "right";
                            return coords("after" == side ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1), prop)[prop];
                        }
                        var order = getOrder(lineObj, doc.direction);
                        return !// BIDI HELPERS
                        function(order, from, to, f) {
                            if (!order) return f(from, to, "ltr", 0);
                            for(var found = !1, i = 0; i < order.length; ++i){
                                var part = order[i];
                                (part.from < to && part.to > from || from == to && part.to == from) && (f(Math.max(part.from, from), Math.min(part.to, to), 1 == part.level ? "rtl" : "ltr", i), found = !0);
                            }
                            found || f(from, to, "ltr");
                        }(order, fromArg || 0, null == toArg ? lineLen : toArg, function(from, to, dir, i) {
                            var topLeft, topRight, botLeft, botRight, ltr = "ltr" == dir, fromPos = coords(from, ltr ? "left" : "right"), toPos = coords(to - 1, ltr ? "right" : "left"), openStart = null == fromArg && 0 == from, openEnd = null == toArg && to == lineLen, first = 0 == i, last = !order || i == order.length - 1;
                            if (toPos.top - fromPos.top <= 3) {
                                // Single line
                                var openLeft = (docLTR ? openStart : openEnd) && first, openRight = (docLTR ? openEnd : openStart) && last, left = openLeft ? leftSide : (ltr ? fromPos : toPos).left, right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
                                add(left, fromPos.top, right - left, fromPos.bottom);
                            } else ltr ? (topLeft = docLTR && openStart && first ? leftSide : fromPos.left, topRight = docLTR ? rightSide : wrapX(from, dir, "before"), botLeft = docLTR ? leftSide : wrapX(to, dir, "after"), botRight = docLTR && openEnd && last ? rightSide : toPos.right) : (topLeft = docLTR ? wrapX(from, dir, "before") : leftSide, topRight = !docLTR && openStart && first ? rightSide : fromPos.right, botLeft = !docLTR && openEnd && last ? leftSide : toPos.left, botRight = docLTR ? wrapX(to, dir, "after") : rightSide), add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom), fromPos.bottom < toPos.top && add(leftSide, fromPos.bottom, null, toPos.top), add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
                            (!start || 0 > cmpCoords(fromPos, start)) && (start = fromPos), 0 > cmpCoords(toPos, start) && (start = toPos), (!end || 0 > cmpCoords(fromPos, end)) && (end = fromPos), 0 > cmpCoords(toPos, end) && (end = toPos);
                        }), {
                            start: start,
                            end: end
                        };
                    }
                    var sFrom = range.from(), sTo = range.to();
                    if (sFrom.line == sTo.line) drawForLine(sFrom.line, sFrom.ch, sTo.ch);
                    else {
                        var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line), singleVLine = visualLine(fromLine) == visualLine(toLine), leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end, rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
                        singleVLine && (leftEnd.top < rightStart.top - 2 ? (add(leftEnd.right, leftEnd.top, null, leftEnd.bottom), add(leftSide, rightStart.top, rightStart.left, rightStart.bottom)) : add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom)), leftEnd.bottom < rightStart.top && add(leftSide, leftEnd.bottom, null, rightStart.top);
                    }
                    output.appendChild(fragment);
                }(cm, range, selFragment);
            }
        }
        return result;
    }
    // Draws a cursor for the given range
    function drawSelectionCursor(cm, head, output) {
        var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine), cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
        if (cursor.style.left = pos.left + "px", cursor.style.top = pos.top + "px", cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px", /\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)) {
            var charPos = charCoords(cm, head, "div", null, null), width = charPos.right - charPos.left;
            cursor.style.width = (width > 0 ? width : cm.defaultCharWidth()) + "px";
        }
        if (pos.other) {
            // Secondary cursor, shown when on a 'jump' in bi-directional text
            var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            otherCursor.style.display = "", otherCursor.style.left = pos.other.left + "px", otherCursor.style.top = pos.other.top + "px", otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + "px";
        }
    }
    function cmpCoords(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    // Cursor-blinking
    function restartBlink(cm) {
        if (cm.state.focused) {
            var display = cm.display;
            clearInterval(display.blinker);
            var on = !0;
            display.cursorDiv.style.visibility = "", cm.options.cursorBlinkRate > 0 ? display.blinker = setInterval(function() {
                cm.hasFocus() || onBlur(cm), display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
            }, cm.options.cursorBlinkRate) : cm.options.cursorBlinkRate < 0 && (display.cursorDiv.style.visibility = "hidden");
        }
    }
    function ensureFocus(cm) {
        cm.hasFocus() || (cm.display.input.focus(), cm.state.focused || onFocus(cm));
    }
    function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = !0, setTimeout(function() {
            cm.state.delayingBlurEvent && (cm.state.delayingBlurEvent = !1, cm.state.focused && onBlur(cm));
        }, 100);
    }
    function onFocus(cm, e) {
        cm.state.delayingBlurEvent && !cm.state.draggingText && (cm.state.delayingBlurEvent = !1), "nocursor" != cm.options.readOnly && (cm.state.focused || (signal(cm, "focus", cm, e), cm.state.focused = !0, addClass(cm.display.wrapper, "CodeMirror-focused"), !cm.curOp && cm.display.selForContextMenu != cm.doc.sel && (cm.display.input.reset(), webkit && setTimeout(function() {
            return cm.display.input.reset(!0);
        }, 20)), cm.display.input.receivedFocus()), restartBlink(cm));
    }
    function onBlur(cm, e) {
        cm.state.delayingBlurEvent || (cm.state.focused && (signal(cm, "blur", cm, e), cm.state.focused = !1, rmClass(cm.display.wrapper, "CodeMirror-focused")), clearInterval(cm.display.blinker), setTimeout(function() {
            cm.state.focused || (cm.display.shift = !1);
        }, 150));
    }
    // Read the actual heights of the rendered lines, and update their
    // stored heights to match.
    function updateHeightsInViewport(cm) {
        for(var display = cm.display, prevBottom = display.lineDiv.offsetTop, viewTop = Math.max(0, display.scroller.getBoundingClientRect().top), oldHeight = display.lineDiv.getBoundingClientRect().top, mustScroll = 0, i = 0; i < display.view.length; i++){
            var cur = display.view[i], wrapping = cm.options.lineWrapping, height = void 0, width = 0;
            if (!cur.hidden) {
                if (oldHeight += cur.line.height, ie && ie_version < 8) {
                    var bot = cur.node.offsetTop + cur.node.offsetHeight;
                    height = bot - prevBottom, prevBottom = bot;
                } else {
                    var box = cur.node.getBoundingClientRect();
                    height = box.bottom - box.top, !wrapping && cur.text.firstChild && (width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1);
                }
                var diff = cur.line.height - height;
                if ((diff > 0.005 || diff < -0.005) && (oldHeight < viewTop && (mustScroll -= diff), updateLineHeight(cur.line, height), updateWidgetHeight(cur.line), cur.rest)) for(var j = 0; j < cur.rest.length; j++)updateWidgetHeight(cur.rest[j]);
                if (width > cm.display.sizerWidth) {
                    var chWidth = Math.ceil(width / charWidth(cm.display));
                    chWidth > cm.display.maxLineLength && (cm.display.maxLineLength = chWidth, cm.display.maxLine = cur.line, cm.display.maxLineChanged = !0);
                }
            }
        }
        Math.abs(mustScroll) > 2 && (display.scroller.scrollTop += mustScroll);
    }
    // Read and store the height of line widgets associated with the
    // given line.
    function updateWidgetHeight(line) {
        if (line.widgets) for(var i = 0; i < line.widgets.length; ++i){
            var w = line.widgets[i], parent = w.node.parentNode;
            parent && (w.height = parent.offsetHeight);
        }
    }
    // Compute the lines that are visible in a given viewport (defaults
    // the the current scroll position). viewport may contain top,
    // height, and ensure (see op.scrollToPos) properties.
    function visibleLines(display, doc, viewport) {
        var top = viewport && null != viewport.top ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - paddingTop(display));
        var bottom = viewport && null != viewport.bottom ? viewport.bottom : top + display.wrapper.clientHeight, from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
        // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
        // forces those lines into the viewport (if possible).
        if (viewport && viewport.ensure) {
            var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
            ensureFrom < from ? (from = ensureFrom, to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight)) : Math.min(ensureTo, doc.lastLine()) >= to && (from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight), to = ensureTo);
        }
        return {
            from: from,
            to: Math.max(to, from + 1)
        };
    }
    // Calculate a new scroll position needed to scroll the given
    // rectangle into view. Returns an object with scrollTop and
    // scrollLeft properties. When these are undefined, the
    // vertical/horizontal position does not need to be adjusted.
    function calculateScrollPos(cm, rect) {
        var display = cm.display, snapMargin = textHeight(cm.display);
        rect.top < 0 && (rect.top = 0);
        var screentop = cm.curOp && null != cm.curOp.scrollTop ? cm.curOp.scrollTop : display.scroller.scrollTop, screen1 = displayHeight(cm), result = {};
        rect.bottom - rect.top > screen1 && (rect.bottom = rect.top + screen1);
        var docBottom = cm.doc.height + paddingVert(display), atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
        if (rect.top < screentop) result.scrollTop = atTop ? 0 : rect.top;
        else if (rect.bottom > screentop + screen1) {
            var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen1);
            newTop != screentop && (result.scrollTop = newTop);
        }
        var gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth, screenleft = cm.curOp && null != cm.curOp.scrollLeft ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace, screenw = displayWidth(cm) - display.gutters.offsetWidth, tooWide = rect.right - rect.left > screenw;
        return tooWide && (rect.right = rect.left + screenw), rect.left < 10 ? result.scrollLeft = 0 : rect.left < screenleft ? result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10)) : rect.right > screenw + screenleft - 3 && (result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw), result;
    }
    // Store a relative adjustment to the scroll position in the current
    // operation (to be applied when the operation finishes).
    function addToScrollTop(cm, top) {
        null != top && (resolveScrollToPos(cm), cm.curOp.scrollTop = (null == cm.curOp.scrollTop ? cm.doc.scrollTop : cm.curOp.scrollTop) + top);
    }
    // Make sure that at the end of the operation the current cursor is
    // shown.
    function ensureCursorVisible(cm) {
        resolveScrollToPos(cm);
        var cur = cm.getCursor();
        cm.curOp.scrollToPos = {
            from: cur,
            to: cur,
            margin: cm.options.cursorScrollMargin
        };
    }
    function scrollToCoords(cm, x, y) {
        (null != x || null != y) && resolveScrollToPos(cm), null != x && (cm.curOp.scrollLeft = x), null != y && (cm.curOp.scrollTop = y);
    }
    // When an operation has its scrollToPos property set, and another
    // scroll action is applied before the end of the operation, this
    // 'simulates' scrolling that position into view in a cheap way, so
    // that the effect of intermediate scroll commands is not ignored.
    function resolveScrollToPos(cm) {
        var range = cm.curOp.scrollToPos;
        if (range) {
            cm.curOp.scrollToPos = null;
            var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
            scrollToCoordsRange(cm, from, to, range.margin);
        }
    }
    function scrollToCoordsRange(cm, from, to, margin) {
        var sPos = calculateScrollPos(cm, {
            left: Math.min(from.left, to.left),
            top: Math.min(from.top, to.top) - margin,
            right: Math.max(from.right, to.right),
            bottom: Math.max(from.bottom, to.bottom) + margin
        });
        scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
    }
    // Sync the scrollable area and scrollbars, ensure the viewport
    // covers the visible area.
    function updateScrollTop(cm, val) {
        2 > Math.abs(cm.doc.scrollTop - val) || (gecko || updateDisplaySimple(cm, {
            top: val
        }), setScrollTop(cm, val, !0), gecko && updateDisplaySimple(cm), startWorker(cm, 100));
    }
    function setScrollTop(cm, val, forceScroll) {
        val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val)), (cm.display.scroller.scrollTop != val || forceScroll) && (cm.doc.scrollTop = val, cm.display.scrollbars.setScrollTop(val), cm.display.scroller.scrollTop != val && (cm.display.scroller.scrollTop = val));
    }
    // Sync scroller and scrollbar, ensure the gutter elements are
    // aligned.
    function setScrollLeft(cm, val, isScroller, forceScroll) {
        val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth)), ((isScroller ? val != cm.doc.scrollLeft : !(2 > Math.abs(cm.doc.scrollLeft - val))) || forceScroll) && (cm.doc.scrollLeft = val, alignHorizontally(cm), cm.display.scroller.scrollLeft != val && (cm.display.scroller.scrollLeft = val), cm.display.scrollbars.setScrollLeft(val));
    }
    // SCROLLBARS
    // Prepare DOM reads needed to update the scrollbars. Done in one
    // shot to minimize update/measure roundtrips.
    function measureForScrollbars(cm) {
        var d = cm.display, gutterW = d.gutters.offsetWidth, docH = Math.round(cm.doc.height + paddingVert(cm.display));
        return {
            clientHeight: d.scroller.clientHeight,
            viewHeight: d.wrapper.clientHeight,
            scrollWidth: d.scroller.scrollWidth,
            clientWidth: d.scroller.clientWidth,
            viewWidth: d.wrapper.clientWidth,
            barLeft: cm.options.fixedGutter ? gutterW : 0,
            docHeight: docH,
            scrollHeight: docH + scrollGap(cm) + d.barHeight,
            nativeBarWidth: d.nativeBarWidth,
            gutterWidth: gutterW
        };
    }
    var NativeScrollbars = function(place, scroll, cm) {
        this.cm = cm;
        var vert = this.vert = elt("div", [
            elt("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar"), horiz = this.horiz = elt("div", [
            elt("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar");
        vert.tabIndex = horiz.tabIndex = -1, place(vert), place(horiz), on(vert, "scroll", function() {
            vert.clientHeight && scroll(vert.scrollTop, "vertical");
        }), on(horiz, "scroll", function() {
            horiz.clientWidth && scroll(horiz.scrollLeft, "horizontal");
        }), this.checkedZeroWidth = !1, ie && ie_version < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px");
    };
    NativeScrollbars.prototype.update = function(measure) {
        var needsH = measure.scrollWidth > measure.clientWidth + 1, needsV = measure.scrollHeight > measure.clientHeight + 1, sWidth = measure.nativeBarWidth;
        if (needsV) {
            this.vert.style.display = "block", this.vert.style.bottom = needsH ? sWidth + "px" : "0";
            var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
            // A bug in IE8 can cause this value to be negative, so guard it.
            this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
        } else this.vert.scrollTop = 0, this.vert.style.display = "", this.vert.firstChild.style.height = "0";
        if (needsH) {
            this.horiz.style.display = "block", this.horiz.style.right = needsV ? sWidth + "px" : "0", this.horiz.style.left = measure.barLeft + "px";
            var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
            this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
        } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
        return !this.checkedZeroWidth && measure.clientHeight > 0 && (0 == sWidth && this.zeroWidthHack(), this.checkedZeroWidth = !0), {
            right: needsV ? sWidth : 0,
            bottom: needsH ? sWidth : 0
        };
    }, NativeScrollbars.prototype.setScrollLeft = function(pos) {
        this.horiz.scrollLeft != pos && (this.horiz.scrollLeft = pos), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
    }, NativeScrollbars.prototype.setScrollTop = function(pos) {
        this.vert.scrollTop != pos && (this.vert.scrollTop = pos), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
    }, NativeScrollbars.prototype.zeroWidthHack = function() {
        this.horiz.style.height = this.vert.style.width = mac && !mac_geMountainLion ? "12px" : "18px", this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none", this.disableHoriz = new Delayed(), this.disableVert = new Delayed();
    }, NativeScrollbars.prototype.enableZeroWidthBar = function(bar, delay, type) {
        bar.style.pointerEvents = "auto", delay.set(1000, function maybeDisable() {
            // To find out whether the scrollbar is still visible, we
            // check whether the element under the pixel in the bottom
            // right corner of the scrollbar box is the scrollbar box
            // itself (when the bar is still visible) or its filler child
            // (when the bar is hidden). If it is still visible, we keep
            // it enabled, if it's hidden, we disable pointer events.
            var box = bar.getBoundingClientRect();
            ("vert" == type ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1)) != bar ? bar.style.pointerEvents = "none" : delay.set(1000, maybeDisable);
        });
    }, NativeScrollbars.prototype.clear = function() {
        var parent = this.horiz.parentNode;
        parent.removeChild(this.horiz), parent.removeChild(this.vert);
    };
    var NullScrollbars = function() {};
    function updateScrollbars(cm, measure) {
        measure || (measure = measureForScrollbars(cm));
        var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for(var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++)startWidth != cm.display.barWidth && cm.options.lineWrapping && updateHeightsInViewport(cm), updateScrollbarsInner(cm, measureForScrollbars(cm)), startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
    }
    // Re-synchronize the fake scrollbars with the actual size of the
    // content.
    function updateScrollbarsInner(cm, measure) {
        var d = cm.display, sizes = d.scrollbars.update(measure);
        d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px", d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px", d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent", sizes.right && sizes.bottom ? (d.scrollbarFiller.style.display = "block", d.scrollbarFiller.style.height = sizes.bottom + "px", d.scrollbarFiller.style.width = sizes.right + "px") : d.scrollbarFiller.style.display = "", sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter ? (d.gutterFiller.style.display = "block", d.gutterFiller.style.height = sizes.bottom + "px", d.gutterFiller.style.width = measure.gutterWidth + "px") : d.gutterFiller.style.display = "";
    }
    NullScrollbars.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    }, NullScrollbars.prototype.setScrollLeft = function() {}, NullScrollbars.prototype.setScrollTop = function() {}, NullScrollbars.prototype.clear = function() {};
    var scrollbarModel = {
        native: NativeScrollbars,
        null: NullScrollbars
    };
    function initScrollbars(cm) {
        cm.display.scrollbars && (cm.display.scrollbars.clear(), cm.display.scrollbars.addClass && rmClass(cm.display.wrapper, cm.display.scrollbars.addClass)), cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function(node) {
            cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller), // Prevent clicks in the scrollbars from killing focus
            on(node, "mousedown", function() {
                cm.state.focused && setTimeout(function() {
                    return cm.display.input.focus();
                }, 0);
            }), node.setAttribute("cm-not-content", "true");
        }, function(pos, axis) {
            "horizontal" == axis ? setScrollLeft(cm, pos) : updateScrollTop(cm, pos);
        }, cm), cm.display.scrollbars.addClass && addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
    }
    // Operations are used to wrap a series of changes to the editor
    // state in such a way that each change won't have to update the
    // cursor and display (which would be awkward, slow, and
    // error-prone). Instead, display updates are batched and then all
    // combined and executed at once.
    var nextOpId = 0;
    // Start a new operation.
    function startOperation(cm) {
        var op;
        cm.curOp = {
            cm: cm,
            viewChanged: !1,
            startHeight: cm.doc.height,
            forceUpdate: !1,
            updateInput: 0,
            typing: !1,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: !1,
            updateMaxLine: !1,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: !1,
            id: ++nextOpId,
            markArrays: null
        }, op = cm.curOp, operationGroup ? operationGroup.ops.push(op) : op.ownsGroup = operationGroup = {
            ops: [
                op
            ],
            delayedCallbacks: []
        };
    }
    // Finish an operation, updating the display and signalling delayed events
    function endOperation(cm) {
        var op = cm.curOp;
        op && function(op, endCb) {
            var group = op.ownsGroup;
            if (group) try {
                !function(group) {
                    // Calls delayed callbacks and cursorActivity handlers until no
                    // new ones appear
                    var callbacks = group.delayedCallbacks, i = 0;
                    do {
                        for(; i < callbacks.length; i++)callbacks[i].call(null);
                        for(var j = 0; j < group.ops.length; j++){
                            var op = group.ops[j];
                            if (op.cursorActivityHandlers) for(; op.cursorActivityCalled < op.cursorActivityHandlers.length;)op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
                        }
                    }while (i < callbacks.length)
                }(group);
            } finally{
                operationGroup = null, endCb(group);
            }
        }(op, function(group) {
            for(var i = 0; i < group.ops.length; i++)group.ops[i].cm.curOp = null;
            !// The DOM updates done when an operation finishes are batched so
            // that the minimum number of relayouts are required.
            function(group) {
                for(var op, ops = group.ops, i = 0; i < ops.length; i++ // Read DOM
                )!function(op) {
                    var cm = op.cm, display = cm.display;
                    (function(cm) {
                        var display = cm.display;
                        !display.scrollbarsClipped && display.scroller.offsetWidth && (display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth, display.heightForcer.style.height = scrollGap(cm) + "px", display.sizer.style.marginBottom = -display.nativeBarWidth + "px", display.sizer.style.borderRightWidth = scrollGap(cm) + "px", display.scrollbarsClipped = !0);
                    })(cm), op.updateMaxLine && findMaxLine(cm), op.mustUpdate = op.viewChanged || op.forceUpdate || null != op.scrollTop || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping, op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && {
                        top: op.scrollTop,
                        ensure: op.scrollToPos
                    }, op.forceUpdate);
                }(ops[i]);
                for(var i$1 = 0; i$1 < ops.length; i$1++ // Write DOM (maybe)
                )(op = ops[i$1]).updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
                for(var i$2 = 0; i$2 < ops.length; i$2++ // Read DOM
                )!function(op) {
                    var line, ch, cm = op.cm, display = cm.display;
                    op.updatedDisplay && updateHeightsInViewport(cm), op.barMeasure = measureForScrollbars(cm), display.maxLineChanged && !cm.options.lineWrapping && (op.adjustWidthTo = (line = display.maxLine, ch = display.maxLine.text.length, measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, void 0)).left + 3, cm.display.sizerWidth = op.adjustWidthTo, op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth), op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm))), (op.updatedDisplay || op.selectionChanged) && (op.preparedSelection = display.input.prepareSelection());
                }(ops[i$2]);
                for(var i$3 = 0; i$3 < ops.length; i$3++ // Write DOM (maybe)
                )!function(op) {
                    var cm = op.cm;
                    null != op.adjustWidthTo && (cm.display.sizer.style.minWidth = op.adjustWidthTo + "px", op.maxScrollLeft < cm.doc.scrollLeft && setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), !0), cm.display.maxLineChanged = !1);
                    var takeFocus = op.focus && op.focus == activeElt();
                    op.preparedSelection && cm.display.input.showSelection(op.preparedSelection, takeFocus), (op.updatedDisplay || op.startHeight != cm.doc.height) && updateScrollbars(cm, op.barMeasure), op.updatedDisplay && setDocumentHeight(cm, op.barMeasure), op.selectionChanged && restartBlink(cm), cm.state.focused && op.updateInput && cm.display.input.reset(op.typing), takeFocus && ensureFocus(op.cm);
                }(ops[i$3]);
                for(var i$4 = 0; i$4 < ops.length; i$4++ // Read DOM
                )!function(op) {
                    var cm = op.cm, display = cm.display, doc = cm.doc;
                    // If we need to scroll a specific position into view, do so.
                    if (op.updatedDisplay && postUpdateDisplay(cm, op.update), null != display.wheelStartX && (null != op.scrollTop || null != op.scrollLeft || op.scrollToPos) && (display.wheelStartX = display.wheelStartY = null), null != op.scrollTop && setScrollTop(cm, op.scrollTop, op.forceScroll), null != op.scrollLeft && setScrollLeft(cm, op.scrollLeft, !0, !0), op.scrollToPos) {
                        var rect = // Scroll a given position into view (immediately), verifying that
                        // it actually became visible (as line heights are accurately
                        // measured, the position of something may 'drift' during drawing).
                        function(cm, pos, end, margin) {
                            null == margin && (margin = 0), cm.options.lineWrapping || pos != end || (// Set pos and end to the cursor positions around the character pos sticks to
                            // If pos.sticky == "before", that is around pos.ch - 1, otherwise around pos.ch
                            // If pos == Pos(_, 0, "before"), pos and end are unchanged
                            end = "before" == pos.sticky ? Pos(pos.line, pos.ch + 1, "before") : pos, pos = pos.ch ? Pos(pos.line, "before" == pos.sticky ? pos.ch - 1 : pos.ch, "after") : pos);
                            for(var rect, limit = 0; limit < 5; limit++){
                                var changed = !1, coords = cursorCoords(cm, pos), endCoords = end && end != pos ? cursorCoords(cm, end) : coords, scrollPos = calculateScrollPos(cm, rect = {
                                    left: Math.min(coords.left, endCoords.left),
                                    top: Math.min(coords.top, endCoords.top) - margin,
                                    right: Math.max(coords.left, endCoords.left),
                                    bottom: Math.max(coords.bottom, endCoords.bottom) + margin
                                }), startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
                                if (null != scrollPos.scrollTop && (updateScrollTop(cm, scrollPos.scrollTop), Math.abs(cm.doc.scrollTop - startTop) > 1 && (changed = !0)), null != scrollPos.scrollLeft && (setScrollLeft(cm, scrollPos.scrollLeft), Math.abs(cm.doc.scrollLeft - startLeft) > 1 && (changed = !0)), !changed) break;
                            }
                            return rect;
                        }(cm, clipPos(doc, op.scrollToPos.from), clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
                        !// SCROLLING THINGS INTO VIEW
                        // If an editor sits on the top or bottom of the window, partially
                        // scrolled out of view, this ensures that the cursor is visible.
                        function(cm, rect) {
                            if (!signalDOMEvent(cm, "scrollCursorIntoView")) {
                                var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
                                if (rect.top + box.top < 0 ? doScroll = !0 : rect.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight) && (doScroll = !1), null != doScroll && !phantom) {
                                    var scrollNode = elt("div", "\u200b", null, "position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + rect.left + "px; width: " + Math.max(2, rect.right - rect.left) + "px;");
                                    cm.display.lineSpace.appendChild(scrollNode), scrollNode.scrollIntoView(doScroll), cm.display.lineSpace.removeChild(scrollNode);
                                }
                            }
                        }(cm, rect);
                    }
                    // Fire events for markers that are hidden/unidden by editing or
                    // undoing
                    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
                    if (hidden) for(var i = 0; i < hidden.length; ++i)hidden[i].lines.length || signal(hidden[i], "hide");
                    if (unhidden) for(var i$1 = 0; i$1 < unhidden.length; ++i$1)unhidden[i$1].lines.length && signal(unhidden[i$1], "unhide");
                    display.wrapper.offsetHeight && (doc.scrollTop = cm.display.scroller.scrollTop), op.changeObjs && signal(cm, "changes", cm, op.changeObjs), op.update && op.update.finish();
                }(ops[i$4]);
            }(group);
        });
    }
    // Run the given function in an operation
    function runInOp(cm, f) {
        if (cm.curOp) return f();
        startOperation(cm);
        try {
            return f();
        } finally{
            endOperation(cm);
        }
    }
    // Wraps a function in an operation. Returns the wrapped function.
    function operation(cm, f) {
        return function() {
            if (cm.curOp) return f.apply(cm, arguments);
            startOperation(cm);
            try {
                return f.apply(cm, arguments);
            } finally{
                endOperation(cm);
            }
        };
    }
    // Used to add methods to editor and doc instances, wrapping them in
    // operations.
    function methodOp(f) {
        return function() {
            if (this.curOp) return f.apply(this, arguments);
            startOperation(this);
            try {
                return f.apply(this, arguments);
            } finally{
                endOperation(this);
            }
        };
    }
    function docMethodOp(f) {
        return function() {
            var cm = this.cm;
            if (!cm || cm.curOp) return f.apply(this, arguments);
            startOperation(cm);
            try {
                return f.apply(this, arguments);
            } finally{
                endOperation(cm);
            }
        };
    }
    // HIGHLIGHT WORKER
    function startWorker(cm, time) {
        cm.doc.highlightFrontier < cm.display.viewTo && cm.state.highlight.set(time, bind(highlightWorker, cm));
    }
    function highlightWorker(cm) {
        var doc = cm.doc;
        if (!(doc.highlightFrontier >= cm.display.viewTo)) {
            var end = +new Date() + cm.options.workTime, context = getContextBefore(cm, doc.highlightFrontier), changedLines = [];
            doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
                if (context.line >= cm.display.viewFrom) {
                    // Visible
                    var oldStyles = line.styles, resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null, highlighted = highlightLine(cm, line, context, !0);
                    resetState && (context.state = resetState), line.styles = highlighted.styles;
                    var oldCls = line.styleClasses, newCls = highlighted.classes;
                    newCls ? line.styleClasses = newCls : oldCls && (line.styleClasses = null);
                    for(var ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass), i = 0; !ischange && i < oldStyles.length; ++i)ischange = oldStyles[i] != line.styles[i];
                    ischange && changedLines.push(context.line), line.stateAfter = context.save(), context.nextLine();
                } else line.text.length <= cm.options.maxHighlightLength && processLine(cm, line.text, context), line.stateAfter = context.line % 5 == 0 ? context.save() : null, context.nextLine();
                if (+new Date() > end) return startWorker(cm, cm.options.workDelay), !0;
            }), doc.highlightFrontier = context.line, doc.modeFrontier = Math.max(doc.modeFrontier, context.line), changedLines.length && runInOp(cm, function() {
                for(var i = 0; i < changedLines.length; i++)regLineChange(cm, changedLines[i], "text");
            });
        }
    }
    // DISPLAY DRAWING
    var DisplayUpdate = function(cm, viewport, force) {
        var display = cm.display;
        this.viewport = viewport, // Store some values that we'll need later (but don't want to force a relayout for)
        this.visible = visibleLines(display, cm.doc, viewport), this.editorIsHidden = !display.wrapper.offsetWidth, this.wrapperHeight = display.wrapper.clientHeight, this.wrapperWidth = display.wrapper.clientWidth, this.oldDisplayWidth = displayWidth(cm), this.force = force, this.dims = getDimensions(cm), this.events = [];
    };
    // Does the actual updating of the line display. Bails out
    // (returning false) when there is nothing to be done and forced is
    // false.
    function updateDisplayIfNeeded(cm, update) {
        var from, to, display, display1 = cm.display, doc = cm.doc;
        if (update.editorIsHidden) return resetView(cm), !1;
        // Bail out if the visible area is already rendered and nothing changed.
        if (!update.force && update.visible.from >= display1.viewFrom && update.visible.to <= display1.viewTo && (null == display1.updateLineNumbers || display1.updateLineNumbers >= display1.viewTo) && display1.renderedView == display1.view && 0 == countDirtyView(cm)) return !1;
        maybeUpdateLineNumberWidth(cm) && (resetView(cm), update.dims = getDimensions(cm));
        // Compute a suitable new viewport (from & to)
        var end = doc.first + doc.size, from1 = Math.max(update.visible.from - cm.options.viewportMargin, doc.first), to1 = Math.min(end, update.visible.to + cm.options.viewportMargin);
        display1.viewFrom < from1 && from1 - display1.viewFrom < 20 && (from1 = Math.max(doc.first, display1.viewFrom)), display1.viewTo > to1 && display1.viewTo - to1 < 20 && (to1 = Math.min(end, display1.viewTo)), sawCollapsedSpans && (from1 = visualLineNo(cm.doc, from1), to1 = visualLineEndNo(cm.doc, to1));
        var different = from1 != display1.viewFrom || to1 != display1.viewTo || display1.lastWrapHeight != update.wrapperHeight || display1.lastWrapWidth != update.wrapperWidth;
        from = from1, to = to1, 0 == (display = cm.display).view.length || from >= display.viewTo || to <= display.viewFrom ? (display.view = buildViewArray(cm, from, to), display.viewFrom = from) : (display.viewFrom > from ? display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view) : display.viewFrom < from && (display.view = display.view.slice(findViewIndex(cm, from))), display.viewFrom = from, display.viewTo < to ? display.view = display.view.concat(buildViewArray(cm, display.viewTo, to)) : display.viewTo > to && (display.view = display.view.slice(0, findViewIndex(cm, to)))), display.viewTo = to, display1.viewOffset = heightAtLine(getLine(cm.doc, display1.viewFrom)), // Position the mover div to align with the current scroll position
        cm.display.mover.style.top = display1.viewOffset + "px";
        var toUpdate = countDirtyView(cm);
        if (!different && 0 == toUpdate && !update.force && display1.renderedView == display1.view && (null == display1.updateLineNumbers || display1.updateLineNumbers >= display1.viewTo)) return !1;
        // For big changes, we hide the enclosing element during the
        // update, since that speeds up the operations on most browsers.
        var selSnapshot = function(cm) {
            if (cm.hasFocus()) return null;
            var active = activeElt();
            if (!active || !contains(cm.display.lineDiv, active)) return null;
            var result = {
                activeElt: active
            };
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode) && (result.anchorNode = sel.anchorNode, result.anchorOffset = sel.anchorOffset, result.focusNode = sel.focusNode, result.focusOffset = sel.focusOffset);
            }
            return result;
        }(cm);
        return toUpdate > 4 && (display1.lineDiv.style.display = "none"), // Sync the actual display DOM structure with display.view, removing
        // nodes for lines that are no longer in view, and creating the ones
        // that are not there yet, and updating the ones that are out of
        // date.
        function(cm, updateNumbersFrom, dims) {
            var display = cm.display, lineNumbers = cm.options.lineNumbers, container = display.lineDiv, cur = container.firstChild;
            function rm(node) {
                var next = node.nextSibling;
                return webkit && mac && cm.display.currentWheelTarget == node ? node.style.display = "none" : node.parentNode.removeChild(node), next;
            }
            // Loop over the elements in the view, syncing cur (the DOM nodes
            // in display.lineDiv) with the view as we go.
            for(var view = display.view, lineN = display.viewFrom, i = 0; i < view.length; i++){
                var lineView = view[i];
                if (lineView.hidden) ;
                else if (lineView.node && lineView.node.parentNode == container) {
                    // Already drawn
                    for(; cur != lineView.node;)cur = rm(cur);
                    var updateNumber = lineNumbers && null != updateNumbersFrom && updateNumbersFrom <= lineN && lineView.lineNumber;
                    lineView.changes && (indexOf(lineView.changes, "gutter") > -1 && (updateNumber = !1), updateLineForChanges(cm, lineView, lineN, dims)), updateNumber && (removeChildren(lineView.lineNumber), lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)))), cur = lineView.node.nextSibling;
                } else {
                    // Not drawn yet
                    var node = // Build a line's DOM representation from scratch
                    function(cm, lineView, lineN, dims) {
                        var built = getLineContent(cm, lineView);
                        return lineView.text = lineView.node = built.pre, built.bgClass && (lineView.bgClass = built.bgClass), built.textClass && (lineView.textClass = built.textClass), updateLineClasses(cm, lineView), updateLineGutter(cm, lineView, lineN, dims), insertLineWidgets(cm, lineView, dims), lineView.node;
                    }(cm, lineView, lineN, dims);
                    container.insertBefore(node, cur);
                }
                lineN += lineView.size;
            }
            for(; cur;)cur = rm(cur);
        }(cm, display1.updateLineNumbers, update.dims), toUpdate > 4 && (display1.lineDiv.style.display = ""), display1.renderedView = display1.view, !// There might have been a widget with a focused element that got
        // hidden or updated, if so re-focus it.
        function(snapshot) {
            if (snapshot && snapshot.activeElt && snapshot.activeElt != activeElt() && (snapshot.activeElt.focus(), !/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode))) {
                var sel = window.getSelection(), range = document.createRange();
                range.setEnd(snapshot.anchorNode, snapshot.anchorOffset), range.collapse(!1), sel.removeAllRanges(), sel.addRange(range), sel.extend(snapshot.focusNode, snapshot.focusOffset);
            }
        }(selSnapshot), // Prevent selection and cursors from interfering with the scroll
        // width and height.
        removeChildren(display1.cursorDiv), removeChildren(display1.selectionDiv), display1.gutters.style.height = display1.sizer.style.minHeight = 0, different && (display1.lastWrapHeight = update.wrapperHeight, display1.lastWrapWidth = update.wrapperWidth, startWorker(cm, 400)), display1.updateLineNumbers = null, !0;
    }
    function postUpdateDisplay(cm, update) {
        for(var viewport = update.viewport, first = !0;; first = !1){
            if (first && cm.options.lineWrapping && update.oldDisplayWidth != displayWidth(cm)) first && (update.visible = visibleLines(cm.display, cm.doc, viewport));
            else if (viewport && null != viewport.top && (viewport = {
                top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)
            }), // Updated line heights might result in the drawn area not
            // actually covering the viewport. Keep looping until it does.
            update.visible = visibleLines(cm.display, cm.doc, viewport), update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) break;
            if (!updateDisplayIfNeeded(cm, update)) break;
            updateHeightsInViewport(cm);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm), updateScrollbars(cm, barMeasure), setDocumentHeight(cm, barMeasure), update.force = !1;
        }
        update.signal(cm, "update", cm), (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) && (update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo), cm.display.reportedViewFrom = cm.display.viewFrom, cm.display.reportedViewTo = cm.display.viewTo);
    }
    function updateDisplaySimple(cm, viewport) {
        var update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
            updateHeightsInViewport(cm), postUpdateDisplay(cm, update);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm), updateScrollbars(cm, barMeasure), setDocumentHeight(cm, barMeasure), update.finish();
        }
    }
    function updateGutterSpace(display) {
        var width = display.gutters.offsetWidth;
        display.sizer.style.marginLeft = width + "px", // Send an event to consumers responding to changes in gutter width.
        signalLater(display, "gutterChanged", display);
    }
    function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + "px", cm.display.heightForcer.style.top = measure.docHeight + "px", cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
    }
    // Re-align line numbers and gutter marks to compensate for
    // horizontal scrolling.
    function alignHorizontally(cm) {
        var display = cm.display, view = display.view;
        if (display.alignWidgets || display.gutters.firstChild && cm.options.fixedGutter) {
            for(var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft, gutterW = display.gutters.offsetWidth, left = comp + "px", i = 0; i < view.length; i++)if (!view[i].hidden) {
                cm.options.fixedGutter && (view[i].gutter && (view[i].gutter.style.left = left), view[i].gutterBackground && (view[i].gutterBackground.style.left = left));
                var align = view[i].alignable;
                if (align) for(var j = 0; j < align.length; j++)align[j].style.left = left;
            }
            cm.options.fixedGutter && (display.gutters.style.left = comp + gutterW + "px");
        }
    }
    // Used to ensure that the line number gutter is still the right
    // size for the current document size. Returns true when an update
    // is needed.
    function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers) return !1;
        var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
            var test = display.measure.appendChild(elt("div", [
                elt("div", last)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt")), innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
            return display.lineGutter.style.width = "", display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1, display.lineNumWidth = display.lineNumInnerWidth + padding, display.lineNumChars = display.lineNumInnerWidth ? last.length : -1, display.lineGutter.style.width = display.lineNumWidth + "px", updateGutterSpace(cm.display), !0;
        }
        return !1;
    }
    function getGutters(gutters, lineNumbers) {
        for(var result = [], sawLineNumbers = !1, i = 0; i < gutters.length; i++){
            var name = gutters[i], style = null;
            if ("string" != typeof name && (style = name.style, name = name.className), "CodeMirror-linenumbers" == name) {
                if (!lineNumbers) continue;
                sawLineNumbers = !0;
            }
            result.push({
                className: name,
                style: style
            });
        }
        return lineNumbers && !sawLineNumbers && result.push({
            className: "CodeMirror-linenumbers",
            style: null
        }), result;
    }
    // Rebuild the gutter elements, ensure the margin to the left of the
    // code matches their width.
    function renderGutters(display) {
        var gutters = display.gutters, specs = display.gutterSpecs;
        removeChildren(gutters), display.lineGutter = null;
        for(var i = 0; i < specs.length; ++i){
            var ref = specs[i], className = ref.className, style = ref.style, gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
            style && (gElt.style.cssText = style), "CodeMirror-linenumbers" == className && (display.lineGutter = gElt, gElt.style.width = (display.lineNumWidth || 1) + "px");
        }
        gutters.style.display = specs.length ? "" : "none", updateGutterSpace(display);
    }
    function updateGutters(cm) {
        renderGutters(cm.display), regChange(cm), alignHorizontally(cm);
    }
    // The display handles the DOM integration, both for input reading
    // and content drawing. It holds references to DOM nodes and
    // display-related state.
    function Display(place, doc, input, options) {
        this.input = input, // Covers bottom-right square when both scrollbars are present.
        this.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler"), this.scrollbarFiller.setAttribute("cm-not-content", "true"), // Covers bottom of gutter when coverGutterNextToScrollbar is on
        // and h scrollbar is present.
        this.gutterFiller = elt("div", null, "CodeMirror-gutter-filler"), this.gutterFiller.setAttribute("cm-not-content", "true"), // Will contain the actual code, positioned to cover the viewport.
        this.lineDiv = eltP("div", null, "CodeMirror-code"), // Elements are added to these to represent selection and cursors.
        this.selectionDiv = elt("div", null, null, "position: relative; z-index: 1"), this.cursorDiv = elt("div", null, "CodeMirror-cursors"), // A visibility: hidden element used to find the size of things.
        this.measure = elt("div", null, "CodeMirror-measure"), // When lines outside of the viewport are measured, they are drawn in this.
        this.lineMeasure = elt("div", null, "CodeMirror-measure"), // Wraps everything that needs to exist inside the vertically-padded coordinate system
        this.lineSpace = eltP("div", [
            this.measure,
            this.lineMeasure,
            this.selectionDiv,
            this.cursorDiv,
            this.lineDiv
        ], null, "position: relative; outline: none");
        var lines = eltP("div", [
            this.lineSpace
        ], "CodeMirror-lines");
        // Moved around its parent to cover visible view.
        this.mover = elt("div", [
            lines
        ], null, "position: relative"), // Set to the height of the document, allowing scrolling.
        this.sizer = elt("div", [
            this.mover
        ], "CodeMirror-sizer"), this.sizerWidth = null, // Behavior of elts with overflow: auto and padding is
        // inconsistent across browsers. This is used to ensure the
        // scrollable area is big enough.
        this.heightForcer = elt("div", null, null, "position: absolute; height: 50px; width: 1px;"), // Will contain the gutters, if any.
        this.gutters = elt("div", null, "CodeMirror-gutters"), this.lineGutter = null, // Actual scrollable element.
        this.scroller = elt("div", [
            this.sizer,
            this.heightForcer,
            this.gutters
        ], "CodeMirror-scroll"), this.scroller.setAttribute("tabIndex", "-1"), // The element in which the editor lives.
        this.wrapper = elt("div", [
            this.scrollbarFiller,
            this.gutterFiller,
            this.scroller
        ], "CodeMirror"), // This attribute is respected by automatic translation systems such as Google Translate,
        // and may also be respected by tools used by human translators.
        this.wrapper.setAttribute("translate", "no"), ie && ie_version < 8 && (this.gutters.style.zIndex = -1, this.scroller.style.paddingRight = 0), webkit || gecko && mobile || (this.scroller.draggable = !0), place && (place.appendChild ? place.appendChild(this.wrapper) : place(this.wrapper)), // Current rendered range (may be bigger than the view window).
        this.viewFrom = this.viewTo = doc.first, this.reportedViewFrom = this.reportedViewTo = doc.first, // Information about the rendered lines.
        this.view = [], this.renderedView = null, // Holds info about a single rendered line when it was rendered
        // for measurement, while not in view.
        this.externalMeasured = null, // Empty space (in pixels) above the view
        this.viewOffset = 0, this.lastWrapHeight = this.lastWrapWidth = 0, this.updateLineNumbers = null, this.nativeBarWidth = this.barHeight = this.barWidth = 0, this.scrollbarsClipped = !1, // Used to only resize the line number gutter when necessary (when
        // the amount of lines crosses a boundary that makes its width change)
        this.lineNumWidth = this.lineNumInnerWidth = this.lineNumChars = null, // Set to true when a non-horizontal-scrolling line widget is
        // added. As an optimization, line widget aligning is skipped when
        // this is false.
        this.alignWidgets = !1, this.cachedCharWidth = this.cachedTextHeight = this.cachedPaddingH = null, // Tracks the maximum line length so that the horizontal scrollbar
        // can be kept static when scrolling.
        this.maxLine = null, this.maxLineLength = 0, this.maxLineChanged = !1, // Used for measuring wheel scrolling granularity
        this.wheelDX = this.wheelDY = this.wheelStartX = this.wheelStartY = null, // True when shift is held down.
        this.shift = !1, // Used to track whether anything happened since the context menu
        // was opened.
        this.selForContextMenu = null, this.activeTouch = null, this.gutterSpecs = getGutters(options.gutters, options.lineNumbers), renderGutters(this), input.init(this);
    }
    DisplayUpdate.prototype.signal = function(emitter, type) {
        hasHandler(emitter, type) && this.events.push(arguments);
    }, DisplayUpdate.prototype.finish = function() {
        for(var i = 0; i < this.events.length; i++)signal.apply(null, this.events[i]);
    };
    // Since the delta values reported on mouse wheel events are
    // unstandardized between browsers and even browser versions, and
    // generally horribly unpredictable, this code starts by measuring
    // the scroll effect that the first few mouse wheel events have,
    // and, from that, detects the way it can convert deltas to pixel
    // offsets afterwards.
    //
    // The reason we want to know the amount a wheel event will scroll
    // is that it gives us a chance to update the display before the
    // actual scrolling happens, reducing flickering.
    var wheelSamples = 0, wheelPixelsPerUnit = null;
    function wheelEventDelta(e) {
        var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
        return null == dx && e.detail && e.axis == e.HORIZONTAL_AXIS && (dx = e.detail), null == dy && e.detail && e.axis == e.VERTICAL_AXIS ? dy = e.detail : null == dy && (dy = e.wheelDelta), {
            x: dx,
            y: dy
        };
    }
    function onScrollWheel(cm, e) {
        var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y, pixelsPerUnit = wheelPixelsPerUnit;
        0 === e.deltaMode && (dx = e.deltaX, dy = e.deltaY, pixelsPerUnit = 1);
        var display = cm.display, scroll = display.scroller, canScrollX = scroll.scrollWidth > scroll.clientWidth, canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (dx && canScrollX || dy && canScrollY) {
            // Webkit browsers on OS X abort momentum scrolls when the target
            // of the scroll event is removed from the scrollable element.
            // This hack (see related code in patchDisplay) makes sure the
            // element is kept around.
            if (dy && mac && webkit) {
                outer: for(var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode)for(var i = 0; i < view.length; i++)if (view[i].node == cur) {
                    cm.display.currentWheelTarget = cur;
                    break outer;
                }
            }
            // On some browsers, horizontal scrolling will cause redraws to
            // happen before the gutter has been realigned, causing it to
            // wriggle around in a most unseemly way. When we have an
            // estimated pixels/delta value, we just handle horizontal
            // scrolling entirely here. It'll be slightly off from native, but
            // better than glitching out.
            if (dx && !gecko && !presto && null != pixelsPerUnit) {
                dy && canScrollY && updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * pixelsPerUnit)), setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * pixelsPerUnit)), (!dy || dy && canScrollY) && e_preventDefault(e), display.wheelStartX = null;
                return;
            }
            // 'Project' the visible viewport to cover the area that is being
            // scrolled into view (if we know enough to estimate it).
            if (dy && null != pixelsPerUnit) {
                var pixels = dy * pixelsPerUnit, top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
                pixels < 0 ? top = Math.max(0, top + pixels - 50) : bot = Math.min(cm.doc.height, bot + pixels + 50), updateDisplaySimple(cm, {
                    top: top,
                    bottom: bot
                });
            }
            wheelSamples < 20 && 0 !== e.deltaMode && (null == display.wheelStartX ? (display.wheelStartX = scroll.scrollLeft, display.wheelStartY = scroll.scrollTop, display.wheelDX = dx, display.wheelDY = dy, setTimeout(function() {
                if (null != display.wheelStartX) {
                    var movedX = scroll.scrollLeft - display.wheelStartX, movedY = scroll.scrollTop - display.wheelStartY, sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                    display.wheelStartX = display.wheelStartY = null, sample && (wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1), ++wheelSamples);
                }
            }, 200)) : (display.wheelDX += dx, display.wheelDY += dy));
        }
    }
    ie ? wheelPixelsPerUnit = -0.53 : gecko ? wheelPixelsPerUnit = 15 : chrome ? wheelPixelsPerUnit = -0.7 : safari && (wheelPixelsPerUnit = -1 / 3);
    // Selection objects are immutable. A new one is created every time
    // the selection changes. A selection is one or more non-overlapping
    // (and non-touching) ranges, sorted, and an integer that indicates
    // which one is the primary selection (the one that's scrolled into
    // view, that getCursor returns, etc).
    var Selection = function(ranges, primIndex) {
        this.ranges = ranges, this.primIndex = primIndex;
    };
    Selection.prototype.primary = function() {
        return this.ranges[this.primIndex];
    }, Selection.prototype.equals = function(other) {
        if (other == this) return !0;
        if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return !1;
        for(var i = 0; i < this.ranges.length; i++){
            var here = this.ranges[i], there = other.ranges[i];
            if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) return !1;
        }
        return !0;
    }, Selection.prototype.deepCopy = function() {
        for(var out = [], i = 0; i < this.ranges.length; i++)out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
        return new Selection(out, this.primIndex);
    }, Selection.prototype.somethingSelected = function() {
        for(var i = 0; i < this.ranges.length; i++)if (!this.ranges[i].empty()) return !0;
        return !1;
    }, Selection.prototype.contains = function(pos, end) {
        end || (end = pos);
        for(var i = 0; i < this.ranges.length; i++){
            var range = this.ranges[i];
            if (cmp(end, range.from()) >= 0 && 0 >= cmp(pos, range.to())) return i;
        }
        return -1;
    };
    var Range = function(anchor, head) {
        this.anchor = anchor, this.head = head;
    };
    // Take an unsorted, potentially overlapping set of ranges, and
    // build a selection out of it. 'Consumes' ranges array (modifying
    // it).
    function normalizeSelection(cm, ranges, primIndex) {
        var mayTouch = cm && cm.options.selectionsMayTouch, prim = ranges[primIndex];
        ranges.sort(function(a, b) {
            return cmp(a.from(), b.from());
        }), primIndex = indexOf(ranges, prim);
        for(var i = 1; i < ranges.length; i++){
            var cur = ranges[i], prev = ranges[i - 1], diff = cmp(prev.to(), cur.from());
            if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
                var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to()), inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
                i <= primIndex && --primIndex, ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
            }
        }
        return new Selection(ranges, primIndex);
    }
    function simpleSelection(anchor, head) {
        return new Selection([
            new Range(anchor, head || anchor)
        ], 0);
    }
    // Compute the position of the end of a change (its 'to' property
    // refers to the pre-change end).
    function changeEnd(change) {
        return change.text ? Pos(change.from.line + change.text.length - 1, lst(change.text).length + (1 == change.text.length ? change.from.ch : 0)) : change.to;
    }
    // Adjust a position to refer to the post-change position of the
    // same text, or the end of the change if the change covers it.
    function adjustForChange(pos, change) {
        if (0 > cmp(pos, change.from)) return pos;
        if (0 >= cmp(pos, change.to)) return changeEnd(change);
        var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        return pos.line == change.to.line && (ch += changeEnd(change).ch - change.to.ch), Pos(line, ch);
    }
    function computeSelAfterChange(doc, change) {
        for(var out = [], i = 0; i < doc.sel.ranges.length; i++){
            var range = doc.sel.ranges[i];
            out.push(new Range(adjustForChange(range.anchor, change), adjustForChange(range.head, change)));
        }
        return normalizeSelection(doc.cm, out, doc.sel.primIndex);
    }
    function offsetPos(pos, old, nw) {
        return pos.line == old.line ? Pos(nw.line, pos.ch - old.ch + nw.ch) : Pos(nw.line + (pos.line - old.line), pos.ch);
    }
    // Used to get the editor into a consistent state again when options change.
    function loadMode(cm) {
        cm.doc.mode = getMode(cm.options, cm.doc.modeOption), resetModeState(cm);
    }
    function resetModeState(cm) {
        cm.doc.iter(function(line) {
            line.stateAfter && (line.stateAfter = null), line.styles && (line.styles = null);
        }), cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first, startWorker(cm, 100), cm.state.modeGen++, cm.curOp && regChange(cm);
    }
    // DOCUMENT DATA STRUCTURE
    // By default, updates that start and end at the beginning of a line
    // are treated specially, in order to make the association of line
    // widgets and marker elements with the text behave more intuitive.
    function isWholeLineUpdate(doc, change) {
        return 0 == change.from.ch && 0 == change.to.ch && "" == lst(change.text) && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
    }
    // Perform a change on the document data structure.
    function updateDoc(doc, change, markedSpans, estimateHeight) {
        function spansFor(n) {
            return markedSpans ? markedSpans[n] : null;
        }
        function update(line, text, spans) {
            var estHeight;
            line.text = text, line.stateAfter && (line.stateAfter = null), line.styles && (line.styles = null), null != line.order && (line.order = null), detachMarkedSpans(line), attachMarkedSpans(line, spans), (estHeight = estimateHeight ? estimateHeight(line) : 1) != line.height && updateLineHeight(line, estHeight), signalLater(line, "change", line, change);
        }
        function linesFor(start, end) {
            for(var result = [], i = start; i < end; ++i)result.push(new Line(text[i], spansFor(i), estimateHeight));
            return result;
        }
        var from = change.from, to = change.to, text = change.text, firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line), lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        // Adjust the line structure
        if (change.full) doc.insert(0, linesFor(0, text.length)), doc.remove(text.length, doc.size - text.length);
        else if (isWholeLineUpdate(doc, change)) {
            // This is a whole-line replace. Treated specially to make
            // sure line objects move the way they are supposed to.
            var added = linesFor(0, text.length - 1);
            update(lastLine, lastLine.text, lastSpans), nlines && doc.remove(from.line, nlines), added.length && doc.insert(from.line, added);
        } else if (firstLine == lastLine) {
            if (1 == text.length) update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
            else {
                var added$1 = linesFor(1, text.length - 1);
                added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight)), update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0)), doc.insert(from.line + 1, added$1);
            }
        } else if (1 == text.length) update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0)), doc.remove(from.line + 1, nlines);
        else {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0)), update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
            var added$2 = linesFor(1, text.length - 1);
            nlines > 1 && doc.remove(from.line + 1, nlines - 1), doc.insert(from.line + 1, added$2);
        }
        signalLater(doc, "change", doc, change);
    }
    // Call f for all linked documents.
    function linkedDocs(doc, f, sharedHistOnly) {
        !function propagate(doc, skip, sharedHist) {
            if (doc.linked) for(var i = 0; i < doc.linked.length; ++i){
                var rel = doc.linked[i];
                if (rel.doc != skip) {
                    var shared = sharedHist && rel.sharedHist;
                    (!sharedHistOnly || shared) && (f(rel.doc, shared), propagate(rel.doc, doc, shared));
                }
            }
        }(doc, null, !0);
    }
    // Attach a document to an editor.
    function attachDoc(cm, doc) {
        if (doc.cm) throw Error("This document is already in use.");
        cm.doc = doc, doc.cm = cm, estimateLineHeights(cm), loadMode(cm), setDirectionClass(cm), cm.options.direction = doc.direction, cm.options.lineWrapping || findMaxLine(cm), cm.options.mode = doc.modeOption, regChange(cm);
    }
    function setDirectionClass(cm) {
        ("rtl" == cm.doc.direction ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
    }
    function History(prev) {
        // Arrays of change events and selections. Doing something adds an
        // event to done and clears undo. Undoing moves events from done
        // to undone, redoing moves them in the other direction.
        this.done = [], this.undone = [], this.undoDepth = prev ? prev.undoDepth : 1 / 0, // Used to track when changes can be merged into a single undo
        // event
        this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, // Used by the isClean() method
        this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
    }
    // Create a history change event from an updateDoc-style change
    // object.
    function historyChangeFromChange(doc, change) {
        var histChange = {
            from: copyPos(change.from),
            to: changeEnd(change),
            text: getBetween(doc, change.from, change.to)
        };
        return attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1), linkedDocs(doc, function(doc) {
            return attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        }, !0), histChange;
    }
    // Pop all selection events off the end of a history array. Stop at
    // a change event.
    function clearSelectionEvents(array) {
        for(; array.length;)if (lst(array).ranges) array.pop();
        else break;
    }
    // Register a change in the history. Merges changes that are within
    // a single operation, or are close together with an origin that
    // allows merging (starting with "+") into a single event.
    function addChangeToHistory(doc, change, selAfter, opId) {
        var last, hist = doc.history;
        hist.undone.length = 0;
        var cur, time = +new Date();
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && ("+" == change.origin.charAt(0) && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || "*" == change.origin.charAt(0))) && (cur = hist.lastOp == opId ? (clearSelectionEvents(hist.done), lst(hist.done)) : hist.done.length && !lst(hist.done).ranges ? lst(hist.done) : hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges ? (hist.done.pop(), lst(hist.done)) : void 0)) // Merge this change into the last event
        last = lst(cur.changes), 0 == cmp(change.from, change.to) && 0 == cmp(change.from, last.to) ? // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change) : // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
        else {
            // Can not be merged, start a new event.
            var before = lst(hist.done);
            for(before && before.ranges || pushSelectionToHistory(doc.sel, hist.done), cur = {
                changes: [
                    historyChangeFromChange(doc, change)
                ],
                generation: hist.generation
            }, hist.done.push(cur); hist.done.length > hist.undoDepth;)hist.done.shift(), hist.done[0].ranges || hist.done.shift();
        }
        hist.done.push(selAfter), hist.generation = ++hist.maxGeneration, hist.lastModTime = hist.lastSelTime = time, hist.lastOp = hist.lastSelOp = opId, hist.lastOrigin = hist.lastSelOrigin = change.origin, last || signal(doc, "historyAdded");
    }
    function pushSelectionToHistory(sel, dest) {
        var top = lst(dest);
        top && top.ranges && top.equals(sel) || dest.push(sel);
    }
    // Used to store marked span information in the history.
    function attachLocalSpans(doc, change, from, to) {
        var existing = change["spans_" + doc.id], n = 0;
        doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
            line.markedSpans && ((existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans), ++n;
        });
    }
    // Used for un/re-doing changes from the history. Combines the
    // result of computing the existing spans with the set of spans that
    // existed in the history (so that deleting around a span and then
    // undoing brings back the span).
    function mergeOldSpans(doc, change) {
        var old = // Retrieve and filter the old marked spans stored in a change event.
        function(doc, change) {
            var found = change["spans_" + doc.id];
            if (!found) return null;
            for(var nw = [], i = 0; i < change.text.length; ++i)nw.push(// When un/re-doing restores text containing marked spans, those
            // that have been explicitly cleared should not be restored.
            function(spans) {
                if (!spans) return null;
                for(var out, i = 0; i < spans.length; ++i)spans[i].marker.explicitlyCleared ? out || (out = spans.slice(0, i)) : out && out.push(spans[i]);
                return out ? out.length ? out : null : spans;
            }(found[i]));
            return nw;
        }(doc, change), stretched = stretchSpansOverChange(doc, change);
        if (!old) return stretched;
        if (!stretched) return old;
        for(var i = 0; i < old.length; ++i){
            var oldCur = old[i], stretchCur = stretched[i];
            if (oldCur && stretchCur) spans: for(var j = 0; j < stretchCur.length; ++j){
                for(var span = stretchCur[j], k = 0; k < oldCur.length; ++k)if (oldCur[k].marker == span.marker) continue spans;
                oldCur.push(span);
            }
            else stretchCur && (old[i] = stretchCur);
        }
        return old;
    }
    // Used both to provide a JSON-safe object in .getHistory, and, when
    // detaching a document, to split the history in two
    function copyHistoryArray(events, newGroup, instantiateSel) {
        for(var copy = [], i = 0; i < events.length; ++i){
            var event = events[i];
            if (event.ranges) {
                copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
                continue;
            }
            var changes = event.changes, newChanges = [];
            copy.push({
                changes: newChanges
            });
            for(var j = 0; j < changes.length; ++j){
                var change = changes[j], m = void 0;
                if (newChanges.push({
                    from: change.from,
                    to: change.to,
                    text: change.text
                }), newGroup) for(var prop in change)(m = prop.match(/^spans_(\d+)$/)) && indexOf(newGroup, Number(m[1])) > -1 && (lst(newChanges)[prop] = change[prop], delete change[prop]);
            }
        }
        return copy;
    }
    // The 'scroll' parameter given to many of these indicated whether
    // the new cursor position should be scrolled into view after
    // modifying the selection.
    // If shift is held or the extend flag is set, extends a range to
    // include a given position (and optionally a second position).
    // Otherwise, simply returns the range between the given positions.
    // Used for cursor motion and such.
    function extendRange(range, head, other, extend) {
        if (!extend) return new Range(other || head, head);
        var anchor = range.anchor;
        if (other) {
            var posBefore = 0 > cmp(head, anchor);
            posBefore != 0 > cmp(other, anchor) ? (anchor = head, head = other) : posBefore != 0 > cmp(head, other) && (head = other);
        }
        return new Range(anchor, head);
    }
    // Extend the primary selection range, discard the rest.
    function extendSelection(doc, head, other, options, extend) {
        null == extend && (extend = doc.cm && (doc.cm.display.shift || doc.extend)), setSelection(doc, new Selection([
            extendRange(doc.sel.primary(), head, other, extend)
        ], 0), options);
    }
    // Extend all selections (pos is an array of selections with length
    // equal the number of selections)
    function extendSelections(doc, heads, options) {
        for(var out = [], extend = doc.cm && (doc.cm.display.shift || doc.extend), i = 0; i < doc.sel.ranges.length; i++)out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend);
        var newSel = normalizeSelection(doc.cm, out, doc.sel.primIndex);
        setSelection(doc, newSel, options);
    }
    // Updates a single range in the selection.
    function replaceOneSelection(doc, i, range, options) {
        var ranges = doc.sel.ranges.slice(0);
        ranges[i] = range, setSelection(doc, normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
    }
    function setSelectionReplaceHistory(doc, sel, options) {
        var done = doc.history.done, last = lst(done);
        last && last.ranges ? (done[done.length - 1] = sel, setSelectionNoUndo(doc, sel, options)) : setSelection(doc, sel, options);
    }
    // Set a new selection.
    function setSelection(doc, sel, options) {
        var sel1, opId, prev, ch, hist, origin;
        setSelectionNoUndo(doc, sel, options), sel1 = doc.sel, opId = doc.cm ? doc.cm.curOp.id : NaN, hist = doc.history, origin = options && options.origin, opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || (prev = lst(hist.done), "*" == (ch = origin.charAt(0)) || "+" == ch && prev.ranges.length == sel1.ranges.length && prev.somethingSelected() == sel1.somethingSelected() && new Date() - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500))) ? hist.done[hist.done.length - 1] = sel1 : pushSelectionToHistory(sel1, hist.done), hist.lastSelTime = +new Date(), hist.lastSelOrigin = origin, hist.lastSelOp = opId, options && !1 !== options.clearRedo && clearSelectionEvents(hist.undone);
    }
    function setSelectionNoUndo(doc, sel, options) {
        if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
            var sel1, obj;
            obj = {
                ranges: (sel1 = sel).ranges,
                update: function(ranges) {
                    this.ranges = [];
                    for(var i = 0; i < ranges.length; i++)this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor), clipPos(doc, ranges[i].head));
                },
                origin: options && options.origin
            }, signal(doc, "beforeSelectionChange", doc, obj), doc.cm && signal(doc.cm, "beforeSelectionChange", doc.cm, obj), sel = obj.ranges != sel1.ranges ? normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1) : sel1;
        }
        var bias = options && options.bias || (0 > cmp(sel.primary().head, doc.sel.primary().head) ? -1 : 1);
        setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, !0)), !(options && !1 === options.scroll) && doc.cm && "nocursor" != doc.cm.getOption("readOnly") && ensureCursorVisible(doc.cm);
    }
    function setSelectionInner(doc, sel) {
        sel.equals(doc.sel) || (doc.sel = sel, doc.cm && (doc.cm.curOp.updateInput = 1, doc.cm.curOp.selectionChanged = !0, signalCursorActivity(doc.cm)), signalLater(doc, "cursorActivity", doc));
    }
    // Verify that the selection does not partially select any atomic
    // marked ranges.
    function reCheckSelection(doc) {
        setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, !1));
    }
    // Return a selection that does not partially select any atomic
    // ranges.
    function skipAtomicInSelection(doc, sel, bias, mayClear) {
        for(var out, i = 0; i < sel.ranges.length; i++){
            var range = sel.ranges[i], old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i], newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear), newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
            (out || newAnchor != range.anchor || newHead != range.head) && (out || (out = sel.ranges.slice(0, i)), out[i] = new Range(newAnchor, newHead));
        }
        return out ? normalizeSelection(doc.cm, out, sel.primIndex) : sel;
    }
    function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
        var line = getLine(doc, pos.line);
        if (line.markedSpans) for(var i = 0; i < line.markedSpans.length; ++i){
            var sp = line.markedSpans[i], m = sp.marker, preventCursorLeft = "selectLeft" in m ? !m.selectLeft : m.inclusiveLeft, preventCursorRight = "selectRight" in m ? !m.selectRight : m.inclusiveRight;
            if ((null == sp.from || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (null == sp.to || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
                if (mayClear && (signal(m, "beforeCursorEnter"), m.explicitlyCleared)) {
                    if (line.markedSpans) {
                        --i;
                        continue;
                    }
                    break;
                }
                if (!m.atomic) continue;
                if (oldPos) {
                    var near = m.find(dir < 0 ? 1 : -1), diff = void 0;
                    if ((dir < 0 ? preventCursorRight : preventCursorLeft) && (near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null)), near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0)) return skipAtomicInner(doc, near, pos, dir, mayClear);
                }
                var far = m.find(dir < 0 ? -1 : 1);
                return (dir < 0 ? preventCursorLeft : preventCursorRight) && (far = movePos(doc, far, dir, far.line == pos.line ? line : null)), far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
            }
        }
        return pos;
    }
    // Ensure a given position is not inside an atomic range.
    function skipAtomic(doc, pos, oldPos, bias, mayClear) {
        var dir = bias || 1;
        return skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, !0) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, !0) || (doc.cantEdit = !0, Pos(doc.first, 0));
    }
    function movePos(doc, pos, dir, line) {
        return dir < 0 && 0 == pos.ch ? pos.line > doc.first ? clipPos(doc, Pos(pos.line - 1)) : null : dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length ? pos.line < doc.first + doc.size - 1 ? Pos(pos.line + 1, 0) : null : new Pos(pos.line, pos.ch + dir);
    }
    function selectAll(cm) {
        cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
    }
    // UPDATING
    // Allow "beforeChange" event handlers to influence a change
    function filterChange(doc, change, update) {
        var obj = {
            canceled: !1,
            from: change.from,
            to: change.to,
            text: change.text,
            origin: change.origin,
            cancel: function() {
                return obj.canceled = !0;
            }
        };
        return (update && (obj.update = function(from, to, text, origin) {
            from && (obj.from = clipPos(doc, from)), to && (obj.to = clipPos(doc, to)), text && (obj.text = text), void 0 !== origin && (obj.origin = origin);
        }), signal(doc, "beforeChange", doc, obj), doc.cm && signal(doc.cm, "beforeChange", doc.cm, obj), obj.canceled) ? (doc.cm && (doc.cm.curOp.updateInput = 2), null) : {
            from: obj.from,
            to: obj.to,
            text: obj.text,
            origin: obj.origin
        };
    }
    // Apply a change to a document, and add it to the document's
    // history, and propagating it to all linked documents.
    function makeChange(doc, change, ignoreReadOnly) {
        if (doc.cm) {
            if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
            if (doc.cm.state.suppressEdits) return;
        }
        if (!(hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) || (change = filterChange(doc, change, !0))) {
            // Possibly split or suppress the update based on the presence
            // of read-only spans in its range.
            var split = sawReadOnlySpans && !ignoreReadOnly && // Used to 'clip' out readOnly ranges when making a change.
            function(doc, from, to) {
                var markers = null;
                if (doc.iter(from.line, to.line + 1, function(line) {
                    if (line.markedSpans) for(var i = 0; i < line.markedSpans.length; ++i){
                        var mark = line.markedSpans[i].marker;
                        mark.readOnly && (!markers || -1 == indexOf(markers, mark)) && (markers || (markers = [])).push(mark);
                    }
                }), !markers) return null;
                for(var parts = [
                    {
                        from: from,
                        to: to
                    }
                ], i = 0; i < markers.length; ++i)for(var mk = markers[i], m = mk.find(0), j = 0; j < parts.length; ++j){
                    var p = parts[j];
                    if (!(0 > cmp(p.to, m.from) || cmp(p.from, m.to) > 0)) {
                        var newParts = [
                            j,
                            1
                        ], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
                        !(dfrom < 0) && (mk.inclusiveLeft || dfrom) || newParts.push({
                            from: p.from,
                            to: m.from
                        }), !(dto > 0) && (mk.inclusiveRight || dto) || newParts.push({
                            from: m.to,
                            to: p.to
                        }), parts.splice.apply(parts, newParts), j += newParts.length - 3;
                    }
                }
                return parts;
            }(doc, change.from, change.to);
            if (split) for(var i = split.length - 1; i >= 0; --i)makeChangeInner(doc, {
                from: split[i].from,
                to: split[i].to,
                text: i ? [
                    ""
                ] : change.text,
                origin: change.origin
            });
            else makeChangeInner(doc, change);
        }
    }
    function makeChangeInner(doc, change) {
        if (1 != change.text.length || "" != change.text[0] || 0 != cmp(change.from, change.to)) {
            var selAfter = computeSelAfterChange(doc, change);
            addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN), makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
            var rebased = [];
            linkedDocs(doc, function(doc, sharedHist) {
                sharedHist || -1 != indexOf(rebased, doc.history) || (rebaseHist(doc.history, change), rebased.push(doc.history)), makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
            });
        }
    }
    // Revert a change stored in a document's history.
    function makeChangeFromHistory(doc, type, allowSelectionOnly) {
        var suppress = doc.cm && doc.cm.state.suppressEdits;
        if (!suppress || allowSelectionOnly) {
            for(var event, hist = doc.history, selAfter = doc.sel, source = "undo" == type ? hist.done : hist.undone, dest = "undo" == type ? hist.undone : hist.done, i = 0; i < source.length && (event = source[i], allowSelectionOnly ? !event.ranges || event.equals(doc.sel) : event.ranges); i++);
            if (i != source.length) {
                for(hist.lastOrigin = hist.lastSelOrigin = null;;)if ((event = source.pop()).ranges) {
                    if (pushSelectionToHistory(event, dest), allowSelectionOnly && !event.equals(doc.sel)) {
                        setSelection(doc, event, {
                            clearRedo: !1
                        });
                        return;
                    }
                    selAfter = event;
                } else if (suppress) {
                    source.push(event);
                    return;
                } else break;
                // Build up a reverse change object to add to the opposite history
                // stack (redo when undoing, and vice versa).
                var antiChanges = [];
                pushSelectionToHistory(selAfter, dest), dest.push({
                    changes: antiChanges,
                    generation: hist.generation
                }), hist.generation = event.generation || ++hist.maxGeneration;
                for(var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange"), i$1 = event.changes.length - 1; i$1 >= 0; --i$1){
                    var returned = function(i) {
                        var change = event.changes[i];
                        if (change.origin = type, filter && !filterChange(doc, change, !1)) return source.length = 0, {};
                        antiChanges.push(historyChangeFromChange(doc, change));
                        var after = i ? computeSelAfterChange(doc, change) : lst(source);
                        makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change)), !i && doc.cm && doc.cm.scrollIntoView({
                            from: change.from,
                            to: changeEnd(change)
                        });
                        var rebased = [];
                        // Propagate to the linked documents
                        linkedDocs(doc, function(doc, sharedHist) {
                            sharedHist || -1 != indexOf(rebased, doc.history) || (rebaseHist(doc.history, change), rebased.push(doc.history)), makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
                        });
                    }(i$1);
                    if (returned) return returned.v;
                }
            }
        }
    }
    // Sub-views need their line numbers shifted when text is added
    // above or below them in the parent document.
    function shiftDoc(doc, distance) {
        if (0 != distance && (doc.first += distance, doc.sel = new Selection(map(doc.sel.ranges, function(range) {
            return new Range(Pos(range.anchor.line + distance, range.anchor.ch), Pos(range.head.line + distance, range.head.ch));
        }), doc.sel.primIndex), doc.cm)) {
            regChange(doc.cm, doc.first, doc.first - distance, distance);
            for(var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)regLineChange(doc.cm, l, "gutter");
        }
    }
    // More lower-level change function, handling only a single document
    // (not linked ones).
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
        if (doc.cm && !doc.cm.curOp) return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
        if (change.to.line < doc.first) {
            shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
            return;
        }
        if (!(change.from.line > doc.lastLine())) {
            // Clip the change to the size of this doc
            if (change.from.line < doc.first) {
                var shift = change.text.length - 1 - (doc.first - change.from.line);
                shiftDoc(doc, shift), change = {
                    from: Pos(doc.first, 0),
                    to: Pos(change.to.line + shift, change.to.ch),
                    text: [
                        lst(change.text)
                    ],
                    origin: change.origin
                };
            }
            var last = doc.lastLine();
            change.to.line > last && (change = {
                from: change.from,
                to: Pos(last, getLine(doc, last).text.length),
                text: [
                    change.text[0]
                ],
                origin: change.origin
            }), change.removed = getBetween(doc, change.from, change.to), selAfter || (selAfter = computeSelAfterChange(doc, change)), doc.cm ? // Handle the interaction of a change to a document with the editor
            // that this document is part of.
            function(cm, change, spans) {
                var doc = cm.doc, display = cm.display, from = change.from, to = change.to, recomputeMaxLength = !1, checkWidthStart = from.line;
                cm.options.lineWrapping || (checkWidthStart = lineNo(visualLine(getLine(doc, from.line))), doc.iter(checkWidthStart, to.line + 1, function(line) {
                    if (line == display.maxLine) return recomputeMaxLength = !0, !0;
                })), doc.sel.contains(change.from, change.to) > -1 && signalCursorActivity(cm), updateDoc(doc, change, spans, estimateHeight(cm)), !cm.options.lineWrapping && (doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
                    var len = lineLength(line);
                    len > display.maxLineLength && (display.maxLine = line, display.maxLineLength = len, display.maxLineChanged = !0, recomputeMaxLength = !1);
                }), recomputeMaxLength && (cm.curOp.updateMaxLine = !0)), function(doc, n) {
                    if (doc.modeFrontier = Math.min(doc.modeFrontier, n), !(doc.highlightFrontier < n - 10)) {
                        for(var start = doc.first, line = n - 1; line > start; line--){
                            var saved = getLine(doc, line).stateAfter;
                            // change is on 3
                            // state on line 1 looked ahead 2 -- so saw 3
                            // test 1 + 2 < 3 should cover this
                            if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
                                start = line + 1;
                                break;
                            }
                        }
                        doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
                    }
                }(doc, from.line), startWorker(cm, 400);
                var lendiff = change.text.length - (to.line - from.line) - 1;
                change.full ? regChange(cm) : from.line != to.line || 1 != change.text.length || isWholeLineUpdate(cm.doc, change) ? regChange(cm, from.line, to.line + 1, lendiff) : regLineChange(cm, from.line, "text");
                var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
                if (changeHandler || changesHandler) {
                    var obj = {
                        from: from,
                        to: to,
                        text: change.text,
                        removed: change.removed,
                        origin: change.origin
                    };
                    changeHandler && signalLater(cm, "change", cm, obj), changesHandler && (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
                }
                cm.display.selForContextMenu = null;
            }(doc.cm, change, spans) : updateDoc(doc, change, spans), setSelectionNoUndo(doc, selAfter, sel_dontScroll), doc.cantEdit && skipAtomic(doc, Pos(doc.firstLine(), 0)) && (doc.cantEdit = !1);
        }
    }
    function replaceRange(doc, code, from, to, origin) {
        var assign;
        to || (to = from), 0 > cmp(to, from) && (from = (assign = [
            to,
            from
        ])[0], to = assign[1]), "string" == typeof code && (code = doc.splitLines(code)), makeChange(doc, {
            from: from,
            to: to,
            text: code,
            origin: origin
        });
    }
    // Rebasing/resetting history to deal with externally-sourced changes
    function rebaseHistSelSingle(pos, from, to, diff) {
        to < pos.line ? pos.line += diff : from < pos.line && (pos.line = from, pos.ch = 0);
    }
    // Tries to rebase an array of history events given a change in the
    // document. If the change touches the same lines as the event, the
    // event, and everything 'behind' it, is discarded. If the change is
    // before the event, the event's positions are updated. Uses a
    // copy-on-write scheme for the positions, to avoid having to
    // reallocate them all on every rebase, but also avoid problems with
    // shared position objects being unsafely updated.
    function rebaseHistArray(array, from, to, diff) {
        for(var i = 0; i < array.length; ++i){
            var sub = array[i], ok = !0;
            if (sub.ranges) {
                sub.copied || ((sub = array[i] = sub.deepCopy()).copied = !0);
                for(var j = 0; j < sub.ranges.length; j++)rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff), rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
                continue;
            }
            for(var j$1 = 0; j$1 < sub.changes.length; ++j$1){
                var cur = sub.changes[j$1];
                if (to < cur.from.line) cur.from = Pos(cur.from.line + diff, cur.from.ch), cur.to = Pos(cur.to.line + diff, cur.to.ch);
                else if (from <= cur.to.line) {
                    ok = !1;
                    break;
                }
            }
            ok || (array.splice(0, i + 1), i = 0);
        }
    }
    function rebaseHist(hist, change) {
        var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff), rebaseHistArray(hist.undone, from, to, diff);
    }
    // Utility for applying a change to a line by handle or number,
    // returning the number and optionally registering the line as
    // changed.
    function changeLine(doc, handle, changeType, op) {
        var no = handle, line = handle;
        return ("number" == typeof handle ? line = getLine(doc, clipLine(doc, handle)) : no = lineNo(handle), null == no) ? null : (op(line, no) && doc.cm && regLineChange(doc.cm, no, changeType), line);
    }
    // The document is represented as a BTree consisting of leaves, with
    // chunk of lines in them, and branches, with up to ten leaves or
    // other branch nodes below them. The top node is always a branch
    // node, and is the document object itself (meaning it has
    // additional methods and properties).
    //
    // All nodes have parent links. The tree is used both to go from
    // line numbers to line objects, and to go from objects to numbers.
    // It also indexes by height, and is used to convert between height
    // and line object, and to find the total height of the document.
    //
    // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html
    function LeafChunk(lines) {
        this.lines = lines, this.parent = null;
        for(var height = 0, i = 0; i < lines.length; ++i)lines[i].parent = this, height += lines[i].height;
        this.height = height;
    }
    function BranchChunk(children) {
        this.children = children;
        for(var size = 0, height = 0, i = 0; i < children.length; ++i){
            var ch = children[i];
            size += ch.chunkSize(), height += ch.height, ch.parent = this;
        }
        this.size = size, this.height = height, this.parent = null;
    }
    Range.prototype.from = function() {
        return minPos(this.anchor, this.head);
    }, Range.prototype.to = function() {
        return maxPos(this.anchor, this.head);
    }, Range.prototype.empty = function() {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    }, LeafChunk.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        // Remove the n lines at offset 'at'.
        removeInner: function(at, n) {
            for(var i = at, e = at + n; i < e; ++i){
                var line = this.lines[i];
                this.height -= line.height, line.parent = null, detachMarkedSpans(line), signalLater(line, "delete");
            }
            this.lines.splice(at, n);
        },
        // Helper used to collapse a small branch into a single leaf.
        collapse: function(lines) {
            lines.push.apply(lines, this.lines);
        },
        // Insert the given array of lines at offset 'at', count them as
        // having the given height.
        insertInner: function(at, lines, height) {
            this.height += height, this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
            for(var i = 0; i < lines.length; ++i)lines[i].parent = this;
        },
        // Used to iterate over a part of the tree.
        iterN: function(at, n, op) {
            for(var e = at + n; at < e; ++at)if (op(this.lines[at])) return !0;
        }
    }, BranchChunk.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(at, n) {
            this.size -= n;
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var rm = Math.min(n, sz - at), oldHeight = child.height;
                    if (child.removeInner(at, rm), this.height -= oldHeight - child.height, sz == rm && (this.children.splice(i--, 1), child.parent = null), 0 == (n -= rm)) break;
                    at = 0;
                } else at -= sz;
            }
            // If the result is smaller than 25 lines, ensure that it is a
            // single leaf node.
            if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
                var lines = [];
                this.collapse(lines), this.children = [
                    new LeafChunk(lines)
                ], this.children[0].parent = this;
            }
        },
        collapse: function(lines) {
            for(var i = 0; i < this.children.length; ++i)this.children[i].collapse(lines);
        },
        insertInner: function(at, lines, height) {
            this.size += lines.length, this.height += height;
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at <= sz) {
                    if (child.insertInner(at, lines, height), child.lines && child.lines.length > 50) {
                        for(var remaining = child.lines.length % 25 + 25, pos = remaining; pos < child.lines.length;){
                            var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                            child.height -= leaf.height, this.children.splice(++i, 0, leaf), leaf.parent = this;
                        }
                        child.lines = child.lines.slice(0, remaining), this.maybeSpill();
                    }
                    break;
                }
                at -= sz;
            }
        },
        // When a node has grown, check whether it should be split.
        maybeSpill: function() {
            if (!(this.children.length <= 10)) {
                var me = this;
                do {
                    var sibling = new BranchChunk(me.children.splice(me.children.length - 5, 5));
                    if (me.parent) {
                        me.size -= sibling.size, me.height -= sibling.height;
                        var myIndex = indexOf(me.parent.children, me);
                        me.parent.children.splice(myIndex + 1, 0, sibling);
                    } else {
                        // Become the parent node
                        var copy = new BranchChunk(me.children);
                        copy.parent = me, me.children = [
                            copy,
                            sibling
                        ], me = copy;
                    }
                    sibling.parent = me.parent;
                }while (me.children.length > 10)
                me.parent.maybeSpill();
            }
        },
        iterN: function(at, n, op) {
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var used = Math.min(n, sz - at);
                    if (child.iterN(at, used, op)) return !0;
                    if (0 == (n -= used)) break;
                    at = 0;
                } else at -= sz;
            }
        }
    };
    // Line widgets are block elements displayed above or below a line.
    var LineWidget = function(doc, node, options) {
        if (options) for(var opt in options)options.hasOwnProperty(opt) && (this[opt] = options[opt]);
        this.doc = doc, this.node = node;
    };
    function adjustScrollWhenAboveVisible(cm, line, diff) {
        heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop) && addToScrollTop(cm, diff);
    }
    LineWidget.prototype.clear = function() {
        var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
        if (null != no && ws) {
            for(var i = 0; i < ws.length; ++i)ws[i] == this && ws.splice(i--, 1);
            ws.length || (line.widgets = null);
            var height = widgetHeight(this);
            updateLineHeight(line, Math.max(0, line.height - height)), cm && (runInOp(cm, function() {
                adjustScrollWhenAboveVisible(cm, line, -height), regLineChange(cm, no, "widget");
            }), signalLater(cm, "lineWidgetCleared", cm, this, no));
        }
    }, LineWidget.prototype.changed = function() {
        var this$1 = this, oldH = this.height, cm = this.doc.cm, line = this.line;
        this.height = null;
        var diff = widgetHeight(this) - oldH;
        diff && (lineIsHidden(this.doc, line) || updateLineHeight(line, line.height + diff), cm && runInOp(cm, function() {
            cm.curOp.forceUpdate = !0, adjustScrollWhenAboveVisible(cm, line, diff), signalLater(cm, "lineWidgetChanged", cm, this$1, lineNo(line));
        }));
    }, eventMixin(LineWidget);
    // TEXTMARKERS
    // Created with markText and setBookmark methods. A TextMarker is a
    // handle that can be used to clear or find a marked position in the
    // document. Line objects hold arrays (markedSpans) containing
    // {from, to, marker} object pointing to such marker objects, and
    // indicating that such a marker is present on that line. Multiple
    // lines may point to the same marker when it spans across lines.
    // The spans will have null for their from/to properties when the
    // marker continues beyond the start/end of the line. Markers have
    // links back to the lines they currently touch.
    // Collapsed markers have unique ids, in order to be able to order
    // them, which is needed for uniquely determining an outer marker
    // when they overlap (they may nest, but not partially overlap).
    var nextMarkerId = 0, TextMarker = function(doc, type) {
        this.lines = [], this.type = type, this.doc = doc, this.id = ++nextMarkerId;
    };
    // Create a marker, wire it up to the right lines, and
    function markText(doc, from, to, options, type) {
        // Shared markers (across linked documents) are handled separately
        // (markTextShared will call out to this again, once per
        // document).
        if (options && options.shared) {
            var options1, markers, primary, widget;
            return (options1 = copyObj(options1 = options)).shared = !1, primary = (markers = [
                markText(doc, from, to, options1, type)
            ])[0], widget = options1.widgetNode, linkedDocs(doc, function(doc) {
                widget && (options1.widgetNode = widget.cloneNode(!0)), markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options1, type));
                for(var i = 0; i < doc.linked.length; ++i)if (doc.linked[i].isParent) return;
                primary = lst(markers);
            }), new SharedTextMarker(markers, primary);
        }
        // Ensure we are in an operation.
        if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);
        var marker = new TextMarker(doc, type), diff = cmp(from, to);
        // Don't connect empty markers unless clearWhenEmpty is false
        if (options && copyObj(options, marker, !1), diff > 0 || 0 == diff && !1 !== marker.clearWhenEmpty) return marker;
        if (marker.replacedWith && (// Showing up as a widget implies collapsed (widget replaces text)
        marker.collapsed = !0, marker.widgetNode = eltP("span", [
            marker.replacedWith
        ], "CodeMirror-widget"), options.handleMouseEvents || marker.widgetNode.setAttribute("cm-ignore-events", "true"), options.insertLeft && (marker.widgetNode.insertLeft = !0)), marker.collapsed) {
            if (conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker)) throw Error("Inserting collapsed marker partially overlapping an existing one");
            sawCollapsedSpans = !0;
        }
        marker.addToHistory && addChangeToHistory(doc, {
            from: from,
            to: to,
            origin: "markText"
        }, doc.sel, NaN);
        var updateMaxLine, curLine = from.line, cm = doc.cm;
        if (doc.iter(curLine, to.line + 1, function(line) {
            var span, op, inThisOp;
            cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine && (updateMaxLine = !0), marker.collapsed && curLine != from.line && updateLineHeight(line, 0), span = new MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null), (inThisOp = (op = doc.cm && doc.cm.curOp) && window.WeakSet && (op.markedSpans || (op.markedSpans = new WeakSet()))) && inThisOp.has(line.markedSpans) ? line.markedSpans.push(span) : (line.markedSpans = line.markedSpans ? line.markedSpans.concat([
                span
            ]) : [
                span
            ], inThisOp && inThisOp.add(line.markedSpans)), span.marker.attachLine(line), ++curLine;
        }), marker.collapsed && doc.iter(from.line, to.line + 1, function(line) {
            lineIsHidden(doc, line) && updateLineHeight(line, 0);
        }), marker.clearOnEnter && on(marker, "beforeCursorEnter", function() {
            return marker.clear();
        }), marker.readOnly && (sawReadOnlySpans = !0, (doc.history.done.length || doc.history.undone.length) && doc.clearHistory()), marker.collapsed && (marker.id = ++nextMarkerId, marker.atomic = !0), cm) {
            if (updateMaxLine && (cm.curOp.updateMaxLine = !0), marker.collapsed) regChange(cm, from.line, to.line + 1);
            else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) for(var i = from.line; i <= to.line; i++)regLineChange(cm, i, "text");
            marker.atomic && reCheckSelection(cm.doc), signalLater(cm, "markerAdded", cm, marker);
        }
        return marker;
    }
    // Clear the marker.
    TextMarker.prototype.clear = function() {
        if (!this.explicitlyCleared) {
            var cm = this.doc.cm, withOp = cm && !cm.curOp;
            if (withOp && startOperation(cm), hasHandler(this, "clear")) {
                var found = this.find();
                found && signalLater(this, "clear", found.from, found.to);
            }
            for(var min = null, max = null, i = 0; i < this.lines.length; ++i){
                var line = this.lines[i], span = getMarkedSpanFor(line.markedSpans, this);
                cm && !this.collapsed ? regLineChange(cm, lineNo(line), "text") : cm && (null != span.to && (max = lineNo(line)), null != span.from && (min = lineNo(line))), line.markedSpans = // Remove a span from an array, returning undefined if no spans are
                // left (we don't store arrays for lines without spans).
                function(spans, span) {
                    for(var r, i = 0; i < spans.length; ++i)spans[i] != span && (r || (r = [])).push(spans[i]);
                    return r;
                }(line.markedSpans, span), null == span.from && this.collapsed && !lineIsHidden(this.doc, line) && cm && updateLineHeight(line, textHeight(cm.display));
            }
            if (cm && this.collapsed && !cm.options.lineWrapping) for(var i$1 = 0; i$1 < this.lines.length; ++i$1){
                var visual = visualLine(this.lines[i$1]), len = lineLength(visual);
                len > cm.display.maxLineLength && (cm.display.maxLine = visual, cm.display.maxLineLength = len, cm.display.maxLineChanged = !0);
            }
            null != min && cm && this.collapsed && regChange(cm, min, max + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, cm && reCheckSelection(cm.doc)), cm && signalLater(cm, "markerCleared", cm, this, min, max), withOp && endOperation(cm), this.parent && this.parent.clear();
        }
    }, // Find the position of the marker in the document. Returns a {from,
    // to} object by default. Side can be passed to get a specific side
    // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
    // Pos objects returned contain a line object, rather than a line
    // number (used to prevent looking up the same line twice).
    TextMarker.prototype.find = function(side, lineObj) {
        null == side && "bookmark" == this.type && (side = 1);
        for(var from, to, i = 0; i < this.lines.length; ++i){
            var line = this.lines[i], span = getMarkedSpanFor(line.markedSpans, this);
            if (null != span.from && (from = Pos(lineObj ? line : lineNo(line), span.from), -1 == side)) return from;
            if (null != span.to && (to = Pos(lineObj ? line : lineNo(line), span.to), 1 == side)) return to;
        }
        return from && {
            from: from,
            to: to
        };
    }, // Signals that the marker's widget changed, and surrounding layout
    // should be recomputed.
    TextMarker.prototype.changed = function() {
        var this$1 = this, pos = this.find(-1, !0), widget = this, cm = this.doc.cm;
        pos && cm && runInOp(cm, function() {
            var line = pos.line, view = findViewForLine(cm, lineNo(pos.line));
            if (view && (clearLineMeasurementCacheFor(view), cm.curOp.selectionChanged = cm.curOp.forceUpdate = !0), cm.curOp.updateMaxLine = !0, !lineIsHidden(widget.doc, line) && null != widget.height) {
                var oldHeight = widget.height;
                widget.height = null;
                var dHeight = widgetHeight(widget) - oldHeight;
                dHeight && updateLineHeight(line, line.height + dHeight);
            }
            signalLater(cm, "markerChanged", cm, this$1);
        });
    }, TextMarker.prototype.attachLine = function(line) {
        if (!this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            op.maybeHiddenMarkers && -1 != indexOf(op.maybeHiddenMarkers, this) || (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
        }
        this.lines.push(line);
    }, TextMarker.prototype.detachLine = function(line) {
        if (this.lines.splice(indexOf(this.lines, line), 1), !this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
        }
    }, eventMixin(TextMarker);
    // SHARED TEXTMARKERS
    // A shared marker spans multiple linked documents. It is
    // implemented as a meta-marker-object controlling multiple normal
    // markers.
    var SharedTextMarker = function(markers, primary) {
        this.markers = markers, this.primary = primary;
        for(var i = 0; i < markers.length; ++i)markers[i].parent = this;
    };
    function findSharedMarkers(doc) {
        return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())), function(m) {
            return m.parent;
        });
    }
    SharedTextMarker.prototype.clear = function() {
        if (!this.explicitlyCleared) {
            this.explicitlyCleared = !0;
            for(var i = 0; i < this.markers.length; ++i)this.markers[i].clear();
            signalLater(this, "clear");
        }
    }, SharedTextMarker.prototype.find = function(side, lineObj) {
        return this.primary.find(side, lineObj);
    }, eventMixin(SharedTextMarker);
    var nextDocId = 0, Doc = function(text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc)) return new Doc(text, mode, firstLine, lineSep, direction);
        null == firstLine && (firstLine = 0), BranchChunk.call(this, [
            new LeafChunk([
                new Line("", null)
            ])
        ]), this.first = firstLine, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.modeFrontier = this.highlightFrontier = firstLine;
        var start = Pos(firstLine, 0);
        this.sel = simpleSelection(start), this.history = new History(null), this.id = ++nextDocId, this.modeOption = mode, this.lineSep = lineSep, this.direction = "rtl" == direction ? "rtl" : "ltr", this.extend = !1, "string" == typeof text && (text = this.splitLines(text)), updateDoc(this, {
            from: start,
            to: start,
            text: text
        }), setSelection(this, simpleSelection(start), sel_dontScroll);
    };
    Doc.prototype = createObj(BranchChunk.prototype, {
        constructor: Doc,
        // Iterate over the document. Supports two forms -- with only one
        // argument, it calls that for each line in the document. With
        // three, it iterates over the range given by the first two (with
        // the second being non-inclusive).
        iter: function(from, to, op) {
            op ? this.iterN(from - this.first, to - from, op) : this.iterN(this.first, this.first + this.size, from);
        },
        // Non-public interface for adding and removing lines.
        insert: function(at, lines) {
            for(var height = 0, i = 0; i < lines.length; ++i)height += lines[i].height;
            this.insertInner(at - this.first, lines, height);
        },
        remove: function(at, n) {
            this.removeInner(at - this.first, n);
        },
        // From here, the methods are part of the public interface. Most
        // are also available from CodeMirror (editor) instances.
        getValue: function(lineSep) {
            var lines = getLines(this, this.first, this.first + this.size);
            return !1 === lineSep ? lines : lines.join(lineSep || this.lineSeparator());
        },
        setValue: docMethodOp(function(code) {
            var top = Pos(this.first, 0), last = this.first + this.size - 1;
            makeChange(this, {
                from: top,
                to: Pos(last, getLine(this, last).text.length),
                text: this.splitLines(code),
                origin: "setValue",
                full: !0
            }, !0), this.cm && scrollToCoords(this.cm, 0, 0), setSelection(this, simpleSelection(top), sel_dontScroll);
        }),
        replaceRange: function(code, from, to, origin) {
            from = clipPos(this, from), to = to ? clipPos(this, to) : from, replaceRange(this, code, from, to, origin);
        },
        getRange: function(from, to, lineSep) {
            var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
            return !1 === lineSep ? lines : "" === lineSep ? lines.join("") : lines.join(lineSep || this.lineSeparator());
        },
        getLine: function(line) {
            var l = this.getLineHandle(line);
            return l && l.text;
        },
        getLineHandle: function(line) {
            if (isLine(this, line)) return getLine(this, line);
        },
        getLineNumber: function(line) {
            return lineNo(line);
        },
        getLineHandleVisualStart: function(line) {
            return "number" == typeof line && (line = getLine(this, line)), visualLine(line);
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
        clipPos: function(pos) {
            return clipPos(this, pos);
        },
        getCursor: function(start) {
            var range = this.sel.primary();
            return null == start || "head" == start ? range.head : "anchor" == start ? range.anchor : "end" == start || "to" == start || !1 === start ? range.to() : range.from();
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: docMethodOp(function(line, ch, options) {
            setSelection(this, simpleSelection(clipPos(this, "number" == typeof line ? Pos(line, ch || 0) : line), null), options);
        }),
        setSelection: docMethodOp(function(anchor, head, options) {
            setSelection(this, simpleSelection(clipPos(this, anchor), clipPos(this, head || anchor)), options);
        }),
        extendSelection: docMethodOp(function(head, other, options) {
            extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
        }),
        extendSelections: docMethodOp(function(heads, options) {
            extendSelections(this, clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: docMethodOp(function(f, options) {
            extendSelections(this, clipPosArray(this, map(this.sel.ranges, f)), options);
        }),
        setSelections: docMethodOp(function(ranges, primary, options) {
            if (ranges.length) {
                for(var out = [], i = 0; i < ranges.length; i++)out[i] = new Range(clipPos(this, ranges[i].anchor), clipPos(this, ranges[i].head || ranges[i].anchor));
                null == primary && (primary = Math.min(ranges.length - 1, this.sel.primIndex)), setSelection(this, normalizeSelection(this.cm, out, primary), options);
            }
        }),
        addSelection: docMethodOp(function(anchor, head, options) {
            var ranges = this.sel.ranges.slice(0);
            ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor))), setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function(lineSep) {
            for(var lines, ranges = this.sel.ranges, i = 0; i < ranges.length; i++){
                var sel = getBetween(this, ranges[i].from(), ranges[i].to());
                lines = lines ? lines.concat(sel) : sel;
            }
            return !1 === lineSep ? lines : lines.join(lineSep || this.lineSeparator());
        },
        getSelections: function(lineSep) {
            for(var parts = [], ranges = this.sel.ranges, i = 0; i < ranges.length; i++){
                var sel = getBetween(this, ranges[i].from(), ranges[i].to());
                !1 !== lineSep && (sel = sel.join(lineSep || this.lineSeparator())), parts[i] = sel;
            }
            return parts;
        },
        replaceSelection: function(code, collapse, origin) {
            for(var dup = [], i = 0; i < this.sel.ranges.length; i++)dup[i] = code;
            this.replaceSelections(dup, collapse, origin || "+input");
        },
        replaceSelections: docMethodOp(function(code, collapse, origin) {
            for(var changes = [], sel = this.sel, i = 0; i < sel.ranges.length; i++){
                var range = sel.ranges[i];
                changes[i] = {
                    from: range.from(),
                    to: range.to(),
                    text: this.splitLines(code[i]),
                    origin: origin
                };
            }
            for(var newSel = collapse && "end" != collapse && // Used by replaceSelections to allow moving the selection to the
            // start or around the replaced test. Hint may be "start" or "around".
            function(doc, changes, hint) {
                for(var out = [], oldPrev = Pos(doc.first, 0), newPrev = oldPrev, i = 0; i < changes.length; i++){
                    var change = changes[i], from = offsetPos(change.from, oldPrev, newPrev), to = offsetPos(changeEnd(change), oldPrev, newPrev);
                    if (oldPrev = change.to, newPrev = to, "around" == hint) {
                        var range = doc.sel.ranges[i], inv = 0 > cmp(range.head, range.anchor);
                        out[i] = new Range(inv ? to : from, inv ? from : to);
                    } else out[i] = new Range(from, from);
                }
                return new Selection(out, doc.sel.primIndex);
            }(this, changes, collapse), i$1 = changes.length - 1; i$1 >= 0; i$1--)makeChange(this, changes[i$1]);
            newSel ? setSelectionReplaceHistory(this, newSel) : this.cm && ensureCursorVisible(this.cm);
        }),
        undo: docMethodOp(function() {
            makeChangeFromHistory(this, "undo");
        }),
        redo: docMethodOp(function() {
            makeChangeFromHistory(this, "redo");
        }),
        undoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "undo", !0);
        }),
        redoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "redo", !0);
        }),
        setExtending: function(val) {
            this.extend = val;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            for(var hist = this.history, done = 0, undone = 0, i = 0; i < hist.done.length; i++)!hist.done[i].ranges && ++done;
            for(var i$1 = 0; i$1 < hist.undone.length; i$1++)!hist.undone[i$1].ranges && ++undone;
            return {
                undo: done,
                redo: undone
            };
        },
        clearHistory: function() {
            var this$1 = this;
            this.history = new History(this.history), linkedDocs(this, function(doc) {
                return doc.history = this$1.history;
            }, !0);
        },
        markClean: function() {
            this.cleanGeneration = this.changeGeneration(!0);
        },
        changeGeneration: function(forceSplit) {
            return forceSplit && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation;
        },
        isClean: function(gen) {
            return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function() {
            return {
                done: copyHistoryArray(this.history.done),
                undone: copyHistoryArray(this.history.undone)
            };
        },
        setHistory: function(histData) {
            var hist = this.history = new History(this.history);
            hist.done = copyHistoryArray(histData.done.slice(0), null, !0), hist.undone = copyHistoryArray(histData.undone.slice(0), null, !0);
        },
        setGutterMarker: docMethodOp(function(line, gutterID, value) {
            return changeLine(this, line, "gutter", function(line) {
                var markers = line.gutterMarkers || (line.gutterMarkers = {});
                return markers[gutterID] = value, !value && isEmpty(markers) && (line.gutterMarkers = null), !0;
            });
        }),
        clearGutter: docMethodOp(function(gutterID) {
            var this$1 = this;
            this.iter(function(line) {
                line.gutterMarkers && line.gutterMarkers[gutterID] && changeLine(this$1, line, "gutter", function() {
                    return line.gutterMarkers[gutterID] = null, isEmpty(line.gutterMarkers) && (line.gutterMarkers = null), !0;
                });
            });
        }),
        lineInfo: function(line) {
            var n;
            if ("number" == typeof line) {
                if (!isLine(this, line) || (n = line, !(line = getLine(this, line)))) return null;
            } else if (null == (n = lineNo(line))) return null;
            return {
                line: n,
                handle: line,
                text: line.text,
                gutterMarkers: line.gutterMarkers,
                textClass: line.textClass,
                bgClass: line.bgClass,
                wrapClass: line.wrapClass,
                widgets: line.widgets
            };
        },
        addLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, "gutter" == where ? "gutter" : "class", function(line) {
                var prop = "text" == where ? "textClass" : "background" == where ? "bgClass" : "gutter" == where ? "gutterClass" : "wrapClass";
                if (line[prop]) {
                    if (classTest(cls).test(line[prop])) return !1;
                    line[prop] += " " + cls;
                } else line[prop] = cls;
                return !0;
            });
        }),
        removeLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, "gutter" == where ? "gutter" : "class", function(line) {
                var prop = "text" == where ? "textClass" : "background" == where ? "bgClass" : "gutter" == where ? "gutterClass" : "wrapClass", cur = line[prop];
                if (!cur) return !1;
                if (null == cls) line[prop] = null;
                else {
                    var found = cur.match(classTest(cls));
                    if (!found) return !1;
                    var end = found.index + found[0].length;
                    line[prop] = cur.slice(0, found.index) + (found.index && end != cur.length ? " " : "") + cur.slice(end) || null;
                }
                return !0;
            });
        }),
        addLineWidget: docMethodOp(function(handle, node, options) {
            var doc, widget, cm;
            return doc = this, widget = new LineWidget(doc, node, options), (cm = doc.cm) && widget.noHScroll && (cm.display.alignWidgets = !0), changeLine(doc, handle, "widget", function(line) {
                var widgets = line.widgets || (line.widgets = []);
                if (null == widget.insertAt ? widgets.push(widget) : widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget), widget.line = line, cm && !lineIsHidden(doc, line)) {
                    var aboveVisible = heightAtLine(line) < doc.scrollTop;
                    updateLineHeight(line, line.height + widgetHeight(widget)), aboveVisible && addToScrollTop(cm, widget.height), cm.curOp.forceUpdate = !0;
                }
                return !0;
            }), cm && signalLater(cm, "lineWidgetAdded", cm, widget, "number" == typeof handle ? handle : lineNo(handle)), widget;
        }),
        removeLineWidget: function(widget) {
            widget.clear();
        },
        markText: function(from, to, options) {
            return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
        },
        setBookmark: function(pos, options) {
            var realOpts = {
                replacedWith: options && (null == options.nodeType ? options.widget : options),
                insertLeft: options && options.insertLeft,
                clearWhenEmpty: !1,
                shared: options && options.shared,
                handleMouseEvents: options && options.handleMouseEvents
            };
            return markText(this, pos = clipPos(this, pos), pos, realOpts, "bookmark");
        },
        findMarksAt: function(pos) {
            pos = clipPos(this, pos);
            var markers = [], spans = getLine(this, pos.line).markedSpans;
            if (spans) for(var i = 0; i < spans.length; ++i){
                var span = spans[i];
                (null == span.from || span.from <= pos.ch) && (null == span.to || span.to >= pos.ch) && markers.push(span.marker.parent || span.marker);
            }
            return markers;
        },
        findMarks: function(from, to, filter) {
            from = clipPos(this, from), to = clipPos(this, to);
            var found = [], lineNo = from.line;
            return this.iter(from.line, to.line + 1, function(line) {
                var spans = line.markedSpans;
                if (spans) for(var i = 0; i < spans.length; i++){
                    var span = spans[i];
                    !(null != span.to && lineNo == from.line && from.ch >= span.to || null == span.from && lineNo != from.line || null != span.from && lineNo == to.line && span.from >= to.ch) && (!filter || filter(span.marker)) && found.push(span.marker.parent || span.marker);
                }
                ++lineNo;
            }), found;
        },
        getAllMarks: function() {
            var markers = [];
            return this.iter(function(line) {
                var sps = line.markedSpans;
                if (sps) for(var i = 0; i < sps.length; ++i)null != sps[i].from && markers.push(sps[i].marker);
            }), markers;
        },
        posFromIndex: function(off) {
            var ch, lineNo = this.first, sepSize = this.lineSeparator().length;
            return this.iter(function(line) {
                var sz = line.text.length + sepSize;
                if (sz > off) return ch = off, !0;
                off -= sz, ++lineNo;
            }), clipPos(this, Pos(lineNo, ch));
        },
        indexFromPos: function(coords) {
            var index = (coords = clipPos(this, coords)).ch;
            if (coords.line < this.first || coords.ch < 0) return 0;
            var sepSize = this.lineSeparator().length;
            return this.iter(this.first, coords.line, function(line) {
                // iter aborts when callback returns a truthy value
                index += line.text.length + sepSize;
            }), index;
        },
        copy: function(copyHistory) {
            var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            return doc.scrollTop = this.scrollTop, doc.scrollLeft = this.scrollLeft, doc.sel = this.sel, doc.extend = !1, copyHistory && (doc.history.undoDepth = this.history.undoDepth, doc.setHistory(this.getHistory())), doc;
        },
        linkedDoc: function(options) {
            options || (options = {});
            var from = this.first, to = this.first + this.size;
            null != options.from && options.from > from && (from = options.from), null != options.to && options.to < to && (to = options.to);
            var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
            return options.sharedHist && (copy.history = this.history), (this.linked || (this.linked = [])).push({
                doc: copy,
                sharedHist: options.sharedHist
            }), copy.linked = [
                {
                    doc: this,
                    isParent: !0,
                    sharedHist: options.sharedHist
                }
            ], function(doc, markers) {
                for(var i = 0; i < markers.length; i++){
                    var marker = markers[i], pos = marker.find(), mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
                    if (cmp(mFrom, mTo)) {
                        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
                        marker.markers.push(subMark), subMark.parent = marker;
                    }
                }
            }(copy, findSharedMarkers(this)), copy;
        },
        unlinkDoc: function(other) {
            if (other instanceof CodeMirror && (other = other.doc), this.linked) {
                for(var i = 0; i < this.linked.length; ++i)if (this.linked[i].doc == other) {
                    this.linked.splice(i, 1), other.unlinkDoc(this), function(markers) {
                        for(var i = 0; i < markers.length; i++)!function(i) {
                            var marker = markers[i], linked = [
                                marker.primary.doc
                            ];
                            linkedDocs(marker.primary.doc, function(d) {
                                return linked.push(d);
                            });
                            for(var j = 0; j < marker.markers.length; j++){
                                var subMarker = marker.markers[j];
                                -1 == indexOf(linked, subMarker.doc) && (subMarker.parent = null, marker.markers.splice(j--, 1));
                            }
                        }(i);
                    }(findSharedMarkers(this));
                    break;
                }
            }
            // If the histories were shared, split them again
            if (other.history == this.history) {
                var splitIds = [
                    other.id
                ];
                linkedDocs(other, function(doc) {
                    return splitIds.push(doc.id);
                }, !0), other.history = new History(null), other.history.done = copyHistoryArray(this.history.done, splitIds), other.history.undone = copyHistoryArray(this.history.undone, splitIds);
            }
        },
        iterLinkedDocs: function(f) {
            linkedDocs(this, f);
        },
        getMode: function() {
            return this.mode;
        },
        getEditor: function() {
            return this.cm;
        },
        splitLines: function(str) {
            return this.lineSep ? str.split(this.lineSep) : splitLinesAuto(str);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: docMethodOp(function(dir) {
            if ("rtl" != dir && (dir = "ltr"), dir != this.direction && (this.direction = dir, this.iter(function(line) {
                return line.order = null;
            }), this.cm)) {
                var cm;
                runInOp(cm = this.cm, function() {
                    setDirectionClass(cm), regChange(cm);
                });
            }
        })
    }), // Public alias.
    Doc.prototype.eachLine = Doc.prototype.iter;
    // Kludge to work around strange IE behavior where it'll sometimes
    // re-fire a series of drag-related events right after the drop (#1551)
    var lastDrop = 0;
    function onDrop(e) {
        var cm = this;
        if (clearDragCursor(cm), !(signalDOMEvent(cm, e) || eventInWidget(cm.display, e))) {
            e_preventDefault(e), ie && (lastDrop = +new Date());
            var pos = posFromMouse(cm, e, !0), files = e.dataTransfer.files;
            if (!(!pos || cm.isReadOnly())) {
                // Might be a file drop, in which case we simply extract the text
                // and insert it.
                if (files && files.length && window.FileReader && window.File) for(var n = files.length, text = Array(n), read = 0, markAsReadAndPasteIfAllFilesAreRead = function() {
                    ++read == n && operation(cm, function() {
                        var change = {
                            from: pos = clipPos(cm.doc, pos),
                            to: pos,
                            text: cm.doc.splitLines(text.filter(function(t) {
                                return null != t;
                            }).join(cm.doc.lineSeparator())),
                            origin: "paste"
                        };
                        makeChange(cm.doc, change), setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
                    })();
                }, readTextFromFile = function(file, i) {
                    if (cm.options.allowDropFileTypes && -1 == indexOf(cm.options.allowDropFileTypes, file.type)) {
                        markAsReadAndPasteIfAllFilesAreRead();
                        return;
                    }
                    var reader = new FileReader();
                    reader.onerror = function() {
                        return markAsReadAndPasteIfAllFilesAreRead();
                    }, reader.onload = function() {
                        var content = reader.result;
                        if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
                            markAsReadAndPasteIfAllFilesAreRead();
                            return;
                        }
                        text[i] = content, markAsReadAndPasteIfAllFilesAreRead();
                    }, reader.readAsText(file);
                }, i = 0; i < files.length; i++)readTextFromFile(files[i], i);
                else {
                    // Normal drop
                    // Don't do a replace if the drop happened inside of the selected text.
                    if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
                        cm.state.draggingText(e), // Ensure the editor is re-focused
                        setTimeout(function() {
                            return cm.display.input.focus();
                        }, 20);
                        return;
                    }
                    try {
                        var selected, text$1 = e.dataTransfer.getData("Text");
                        if (text$1) {
                            if (cm.state.draggingText && !cm.state.draggingText.copy && (selected = cm.listSelections()), setSelectionNoUndo(cm.doc, simpleSelection(pos, pos)), selected) for(var i$1 = 0; i$1 < selected.length; ++i$1)replaceRange(cm.doc, "", selected[i$1].anchor, selected[i$1].head, "drag");
                            cm.replaceSelection(text$1, "around", "paste"), cm.display.input.focus();
                        }
                    } catch (e$1) {}
                }
            }
        }
    }
    function clearDragCursor(cm) {
        cm.display.dragCursor && (cm.display.lineSpace.removeChild(cm.display.dragCursor), cm.display.dragCursor = null);
    }
    // These must be handled carefully, because naively registering a
    // handler for each editor will cause the editors to never be
    // garbage collected.
    function forEachCodeMirror(f) {
        if (document.getElementsByClassName) {
            for(var byClass = document.getElementsByClassName("CodeMirror"), editors = [], i = 0; i < byClass.length; i++){
                var cm = byClass[i].CodeMirror;
                cm && editors.push(cm);
            }
            editors.length && editors[0].operation(function() {
                for(var i = 0; i < editors.length; i++)f(editors[i]);
            });
        }
    }
    var globalsRegistered = !1;
    // Called when the window resizes
    function onResize(cm) {
        var d = cm.display;
        // Might be a text scaling operation, clear size caches.
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null, d.scrollbarsClipped = !1, cm.setSize();
    }
    // Number keys
    for(var keyNames = {
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
    }, i = 0; i < 10; i++)keyNames[i + 48] = keyNames[i + 96] = String(i);
    // Alphabetic keys
    for(var i$1 = 65; i$1 <= 90; i$1++)keyNames[i$1] = String.fromCharCode(i$1);
    // Function keys
    for(var i$2 = 1; i$2 <= 12; i$2++)keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2;
    var keyMap = {};
    // KEYMAP DISPATCH
    function normalizeKeyName(name) {
        var alt, ctrl, shift, cmd, parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        for(var i = 0; i < parts.length - 1; i++){
            var mod = parts[i];
            if (/^(cmd|meta|m)$/i.test(mod)) cmd = !0;
            else if (/^a(lt)?$/i.test(mod)) alt = !0;
            else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = !0;
            else if (/^s(hift)?$/i.test(mod)) shift = !0;
            else throw Error("Unrecognized modifier name: " + mod);
        }
        return alt && (name = "Alt-" + name), ctrl && (name = "Ctrl-" + name), cmd && (name = "Cmd-" + name), shift && (name = "Shift-" + name), name;
    }
    function lookupKey(key, map, handle, context) {
        var found = (map = getKeyMap(map)).call ? map.call(key, context) : map[key];
        if (!1 === found) return "nothing";
        if ("..." === found) return "multi";
        if (null != found && handle(found)) return "handled";
        if (map.fallthrough) {
            if ("[object Array]" != Object.prototype.toString.call(map.fallthrough)) return lookupKey(key, map.fallthrough, handle, context);
            for(var i = 0; i < map.fallthrough.length; i++){
                var result = lookupKey(key, map.fallthrough[i], handle, context);
                if (result) return result;
            }
        }
    }
    // Modifier key presses don't count as 'real' key presses for the
    // purpose of keymap fallthrough.
    function isModifierKey(value) {
        var name = "string" == typeof value ? value : keyNames[value.keyCode];
        return "Ctrl" == name || "Alt" == name || "Shift" == name || "Mod" == name;
    }
    function addModifierNames(name, event, noShift) {
        var base = name;
        return event.altKey && "Alt" != base && (name = "Alt-" + name), (flipCtrlCmd ? event.metaKey : event.ctrlKey) && "Ctrl" != base && (name = "Ctrl-" + name), (flipCtrlCmd ? event.ctrlKey : event.metaKey) && "Mod" != base && (name = "Cmd-" + name), !noShift && event.shiftKey && "Shift" != base && (name = "Shift-" + name), name;
    }
    // Look up the name of a key as indicated by an event object.
    function keyName(event, noShift) {
        if (presto && 34 == event.keyCode && event.char) return !1;
        var name = keyNames[event.keyCode];
        return null != name && !event.altGraphKey && (3 == event.keyCode && event.code && (name = event.code), addModifierNames(name, event, noShift));
    }
    function getKeyMap(val) {
        return "string" == typeof val ? keyMap[val] : val;
    }
    // Helper for deleting text near the selection(s), used to implement
    // backspace, delete, and similar functionality.
    function deleteNearSelection(cm, compute) {
        // Build up a set of ranges to kill first, merging overlapping
        // ranges.
        for(var ranges = cm.doc.sel.ranges, kill = [], i = 0; i < ranges.length; i++){
            for(var toKill = compute(ranges[i]); kill.length && 0 >= cmp(toKill.from, lst(kill).to);){
                var replaced = kill.pop();
                if (0 > cmp(replaced.from, toKill.from)) {
                    toKill.from = replaced.from;
                    break;
                }
            }
            kill.push(toKill);
        }
        // Next, remove those actual ranges.
        runInOp(cm, function() {
            for(var i = kill.length - 1; i >= 0; i--)replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
            ensureCursorVisible(cm);
        });
    }
    function moveCharLogically(line, ch, dir) {
        var target = skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
    }
    function moveLogically(line, start, dir) {
        var ch = moveCharLogically(line, start.ch, dir);
        return null == ch ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
    }
    function endOfLine(visually, cm, lineObj, lineNo, dir) {
        if (visually) {
            "rtl" == cm.doc.direction && (dir = -dir);
            var order = getOrder(lineObj, cm.doc.direction);
            if (order) {
                var ch, part = dir < 0 ? lst(order) : order[0], sticky = dir < 0 == (1 == part.level) ? "after" : "before";
                // With a wrapped rtl chunk (possibly spanning multiple bidi parts),
                // it could be that the last bidi part is not on the last visual line,
                // since visual lines contain content order-consecutive chunks.
                // Thus, in rtl, we are looking for the first (content-order) character
                // in the rtl chunk that is on the last line (that is, the same line
                // as the last (content-order) character).
                if (part.level > 0 || "rtl" == cm.doc.direction) {
                    var prep = prepareMeasureForLine(cm, lineObj), targetTop = measureCharPrepared(cm, prep, ch = dir < 0 ? lineObj.text.length - 1 : 0).top;
                    ch = findFirst(function(ch) {
                        return measureCharPrepared(cm, prep, ch).top == targetTop;
                    }, dir < 0 == (1 == part.level) ? part.from : part.to - 1, ch), "before" == sticky && (ch = moveCharLogically(lineObj, ch, 1));
                } else ch = dir < 0 ? part.to : part.from;
                return new Pos(lineNo, ch, sticky);
            }
        }
        return new Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
    }
    keyMap.basic = {
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
    }, // Note that the save and find-related commands aren't defined by
    // default. User code or addons can define them. Unknown commands
    // are simply ignored.
    keyMap.pcDefault = {
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
    }, // Very basic readline/emacs-style bindings, which are standard on Mac.
    keyMap.emacsy = {
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
    }, keyMap.macDefault = {
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
    }, keyMap.default = mac ? keyMap.macDefault : keyMap.pcDefault;
    // Commands are parameter-less actions that can be performed on an
    // editor, mostly used for keybindings.
    var commands = {
        selectAll: selectAll,
        singleSelection: function(cm) {
            return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
        },
        killLine: function(cm) {
            return deleteNearSelection(cm, function(range) {
                if (!range.empty()) return {
                    from: range.from(),
                    to: range.to()
                };
                var len = getLine(cm.doc, range.head.line).text.length;
                return range.head.ch == len && range.head.line < cm.lastLine() ? {
                    from: range.head,
                    to: Pos(range.head.line + 1, 0)
                } : {
                    from: range.head,
                    to: Pos(range.head.line, len)
                };
            });
        },
        deleteLine: function(cm) {
            return deleteNearSelection(cm, function(range) {
                return {
                    from: Pos(range.from().line, 0),
                    to: clipPos(cm.doc, Pos(range.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range) {
                return {
                    from: Pos(range.from().line, 0),
                    to: range.from()
                };
            });
        },
        delWrappedLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range) {
                var top = cm.charCoords(range.head, "div").top + 5;
                return {
                    from: cm.coordsChar({
                        left: 0,
                        top: top
                    }, "div"),
                    to: range.from()
                };
            });
        },
        delWrappedLineRight: function(cm) {
            return deleteNearSelection(cm, function(range) {
                var top = cm.charCoords(range.head, "div").top + 5, rightPos = cm.coordsChar({
                    left: cm.display.lineDiv.offsetWidth + 100,
                    top: top
                }, "div");
                return {
                    from: range.from(),
                    to: rightPos
                };
            });
        },
        undo: function(cm) {
            return cm.undo();
        },
        redo: function(cm) {
            return cm.redo();
        },
        undoSelection: function(cm) {
            return cm.undoSelection();
        },
        redoSelection: function(cm) {
            return cm.redoSelection();
        },
        goDocStart: function(cm) {
            return cm.extendSelection(Pos(cm.firstLine(), 0));
        },
        goDocEnd: function(cm) {
            return cm.extendSelection(Pos(cm.lastLine()));
        },
        goLineStart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                return lineStart(cm, range.head.line);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineStartSmart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                return lineStartSmart(cm, range.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var lineN, line, visual;
                return lineN = range.head.line, (visual = function(line) {
                    for(var merged; merged = collapsedSpanAtSide(line, !1);)line = merged.find(1, !0).line;
                    return line;
                }(line = getLine(cm.doc, lineN))) != line && (lineN = lineNo(visual)), endOfLine(!0, cm, line, lineN, -1);
            }, {
                origin: "+move",
                bias: -1
            });
        },
        goLineRight: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5;
                return cm.coordsChar({
                    left: cm.display.lineDiv.offsetWidth + 100,
                    top: top
                }, "div");
            }, sel_move);
        },
        goLineLeft: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5;
                return cm.coordsChar({
                    left: 0,
                    top: top
                }, "div");
            }, sel_move);
        },
        goLineLeftSmart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5, pos = cm.coordsChar({
                    left: 0,
                    top: top
                }, "div");
                return pos.ch < cm.getLine(pos.line).search(/\S/) ? lineStartSmart(cm, range.head) : pos;
            }, sel_move);
        },
        goLineUp: function(cm) {
            return cm.moveV(-1, "line");
        },
        goLineDown: function(cm) {
            return cm.moveV(1, "line");
        },
        goPageUp: function(cm) {
            return cm.moveV(-1, "page");
        },
        goPageDown: function(cm) {
            return cm.moveV(1, "page");
        },
        goCharLeft: function(cm) {
            return cm.moveH(-1, "char");
        },
        goCharRight: function(cm) {
            return cm.moveH(1, "char");
        },
        goColumnLeft: function(cm) {
            return cm.moveH(-1, "column");
        },
        goColumnRight: function(cm) {
            return cm.moveH(1, "column");
        },
        goWordLeft: function(cm) {
            return cm.moveH(-1, "word");
        },
        goGroupRight: function(cm) {
            return cm.moveH(1, "group");
        },
        goGroupLeft: function(cm) {
            return cm.moveH(-1, "group");
        },
        goWordRight: function(cm) {
            return cm.moveH(1, "word");
        },
        delCharBefore: function(cm) {
            return cm.deleteH(-1, "codepoint");
        },
        delCharAfter: function(cm) {
            return cm.deleteH(1, "char");
        },
        delWordBefore: function(cm) {
            return cm.deleteH(-1, "word");
        },
        delWordAfter: function(cm) {
            return cm.deleteH(1, "word");
        },
        delGroupBefore: function(cm) {
            return cm.deleteH(-1, "group");
        },
        delGroupAfter: function(cm) {
            return cm.deleteH(1, "group");
        },
        indentAuto: function(cm) {
            return cm.indentSelection("smart");
        },
        indentMore: function(cm) {
            return cm.indentSelection("add");
        },
        indentLess: function(cm) {
            return cm.indentSelection("subtract");
        },
        insertTab: function(cm) {
            return cm.replaceSelection("\t");
        },
        insertSoftTab: function(cm) {
            for(var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize, i = 0; i < ranges.length; i++){
                var pos = ranges[i].from(), col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
                spaces.push(spaceStr(tabSize - col % tabSize));
            }
            cm.replaceSelections(spaces);
        },
        defaultTab: function(cm) {
            cm.somethingSelected() ? cm.indentSelection("add") : cm.execCommand("insertTab");
        },
        // Swap the two chars left and right of each selection's head.
        // Move cursor behind the two swapped characters afterwards.
        //
        // Doesn't consider line feeds a character.
        // Doesn't scan more than one line above to find a character.
        // Doesn't do anything on an empty line.
        // Doesn't do anything with non-empty selections.
        transposeChars: function(cm) {
            return runInOp(cm, function() {
                for(var ranges = cm.listSelections(), newSel = [], i = 0; i < ranges.length; i++)if (ranges[i].empty()) {
                    var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
                    if (line) {
                        if (cur.ch == line.length && (cur = new Pos(cur.line, cur.ch - 1)), cur.ch > 0) cur = new Pos(cur.line, cur.ch + 1), cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), Pos(cur.line, cur.ch - 2), cur, "+transpose");
                        else if (cur.line > cm.doc.first) {
                            var prev = getLine(cm.doc, cur.line - 1).text;
                            prev && (cur = new Pos(cur.line, 1), cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), Pos(cur.line - 1, prev.length - 1), cur, "+transpose"));
                        }
                    }
                    newSel.push(new Range(cur, cur));
                }
                cm.setSelections(newSel);
            });
        },
        newlineAndIndent: function(cm) {
            return runInOp(cm, function() {
                for(var sels = cm.listSelections(), i = sels.length - 1; i >= 0; i--)cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, "+input");
                sels = cm.listSelections();
                for(var i$1 = 0; i$1 < sels.length; i$1++)cm.indentLine(sels[i$1].from().line, null, !0);
                ensureCursorVisible(cm);
            });
        },
        openLine: function(cm) {
            return cm.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(cm) {
            return cm.toggleOverwrite();
        }
    };
    function lineStart(cm, lineN) {
        var line = getLine(cm.doc, lineN), visual = visualLine(line);
        return visual != line && (lineN = lineNo(visual)), endOfLine(!0, cm, visual, lineN, 1);
    }
    function lineStartSmart(cm, pos) {
        var start = lineStart(cm, pos.line), line = getLine(cm.doc, start.line), order = getOrder(line, cm.doc.direction);
        if (!order || 0 == order[0].level) {
            var firstNonWS = Math.max(start.ch, line.text.search(/\S/)), inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
            return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
    }
    // Run a handler that was bound to a key.
    function doHandleBinding(cm, bound, dropShift) {
        if ("string" == typeof bound && !(bound = commands[bound])) return !1;
        // Ensure previous input has been read, so that the handler sees a
        // consistent view of the document
        cm.display.input.ensurePolled();
        var prevShift = cm.display.shift, done = !1;
        try {
            cm.isReadOnly() && (cm.state.suppressEdits = !0), dropShift && (cm.display.shift = !1), done = bound(cm) != Pass;
        } finally{
            cm.display.shift = prevShift, cm.state.suppressEdits = !1;
        }
        return done;
    }
    // Note that, despite the name, this function is also used to check
    // for bound mouse clicks.
    var stopSeq = new Delayed();
    function dispatchKey(cm, name, e, handle) {
        var seq = cm.state.keySeq;
        if (seq) {
            if (isModifierKey(name)) return "handled";
            if (/\'$/.test(name) ? cm.state.keySeq = null : stopSeq.set(50, function() {
                cm.state.keySeq == seq && (cm.state.keySeq = null, cm.display.input.reset());
            }), dispatchKeyInner(cm, seq + " " + name, e, handle)) return !0;
        }
        return dispatchKeyInner(cm, name, e, handle);
    }
    function dispatchKeyInner(cm, name, e, handle) {
        var result = function(cm, name, handle) {
            for(var i = 0; i < cm.state.keyMaps.length; i++){
                var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
                if (result) return result;
            }
            return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
        }(cm, name, handle);
        return "multi" == result && (cm.state.keySeq = name), "handled" == result && signalLater(cm, "keyHandled", cm, name, e), ("handled" == result || "multi" == result) && (e_preventDefault(e), restartBlink(cm)), !!result;
    }
    // Handle a key from the keydown event.
    function handleKeyBinding(cm, e) {
        var name = keyName(e, !0);
        return !!name && (e.shiftKey && !cm.state.keySeq ? dispatchKey(cm, "Shift-" + name, e, function(b) {
            return doHandleBinding(cm, b, !0);
        }) || dispatchKey(cm, name, e, function(b) {
            if ("string" == typeof b ? /^go[A-Z]/.test(b) : b.motion) return doHandleBinding(cm, b);
        }) : dispatchKey(cm, name, e, function(b) {
            return doHandleBinding(cm, b);
        }));
    }
    var lastStoppedKey = null;
    function onKeyDown(e) {
        if ((!e.target || e.target == this.display.input.getField()) && (this.curOp.focus = activeElt(), !signalDOMEvent(this, e))) {
            ie && ie_version < 11 && 27 == e.keyCode && (e.returnValue = !1);
            var code = e.keyCode;
            this.display.shift = 16 == code || e.shiftKey;
            var handled = handleKeyBinding(this, e);
            presto && (lastStoppedKey = handled ? code : null, !handled && 88 == code && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey) && this.replaceSelection("", null, "cut")), gecko && !mac && !handled && 46 == code && e.shiftKey && !e.ctrlKey && document.execCommand && document.execCommand("cut"), 18 != code || /\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className) || function(cm) {
                var lineDiv = cm.display.lineDiv;
                function up(e) {
                    18 != e.keyCode && e.altKey || (rmClass(lineDiv, "CodeMirror-crosshair"), off(document, "keyup", up), off(document, "mouseover", up));
                }
                addClass(lineDiv, "CodeMirror-crosshair"), on(document, "keyup", up), on(document, "mouseover", up);
            }(this);
        }
    }
    function onKeyUp(e) {
        16 == e.keyCode && (this.doc.sel.shift = !1), signalDOMEvent(this, e);
    }
    function onKeyPress(e) {
        if (!(e.target && e.target != this.display.input.getField() || eventInWidget(this.display, e) || signalDOMEvent(this, e)) && (!e.ctrlKey || e.altKey) && (!mac || !e.metaKey)) {
            var cm, keyCode = e.keyCode, charCode = e.charCode;
            if (presto && keyCode == lastStoppedKey) {
                lastStoppedKey = null, e_preventDefault(e);
                return;
            }
            if (!(presto && (!e.which || e.which < 10) && handleKeyBinding(this, e))) {
                var ch = String.fromCharCode(null == charCode ? keyCode : charCode);
                // Some browsers fire keypress events for backspace
                "\x08" != ch && (cm = this, dispatchKey(cm, "'" + ch + "'", e, function(b) {
                    return doHandleBinding(cm, b, !0);
                }) || this.display.input.onKeyPress(e));
            }
        }
    }
    var PastClick = function(time, pos, button) {
        this.time = time, this.pos = pos, this.button = button;
    };
    // A mouse down can be a single click, double click, triple click,
    // start of selection drag, start of text drag, new cursor
    // (ctrl-click), rectangle drag (alt-drag), or xwin
    // middle-click-paste. Or it might be a click on something we should
    // not interfere with, such as a scrollbar or widget.
    function onMouseDown(e) {
        var cm, name, behavior, contained, sel, cm1, display, moved, dragEnd, mouseMove, dragStart, now, display1 = this.display;
        if (!(signalDOMEvent(this, e) || display1.activeTouch && display1.input.supportsTouch())) {
            if (display1.input.ensurePolled(), display1.shift = e.shiftKey, eventInWidget(display1, e)) {
                webkit || (// Briefly turn off draggability, to allow widgets to do
                // normal dragging things.
                display1.scroller.draggable = !1, setTimeout(function() {
                    return display1.scroller.draggable = !0;
                }, 100));
                return;
            }
            if (!clickInGutter(this, e)) {
                var pos = posFromMouse(this, e), button = e_button(e), repeat = pos ? (now = +new Date(), lastDoubleClick && lastDoubleClick.compare(now, pos, button) ? (lastClick = lastDoubleClick = null, "triple") : lastClick && lastClick.compare(now, pos, button) ? (lastDoubleClick = new PastClick(now, pos, button), lastClick = null, "double") : (lastClick = new PastClick(now, pos, button), lastDoubleClick = null, "single")) : "single";
                window.focus(), 1 == button && this.state.selectingText && this.state.selectingText(e), !(pos && (cm = this, name = "Click", "double" == repeat ? name = "Double" + name : "triple" == repeat && (name = "Triple" + name), dispatchKey(cm, addModifierNames(name = (1 == button ? "Left" : 2 == button ? "Middle" : "Right") + name, e), e, function(bound) {
                    if ("string" == typeof bound && (bound = commands[bound]), !bound) return !1;
                    var done = !1;
                    try {
                        cm.isReadOnly() && (cm.state.suppressEdits = !0), done = bound(cm, pos) != Pass;
                    } finally{
                        cm.state.suppressEdits = !1;
                    }
                    return done;
                }))) && (1 == button ? pos ? (ie ? setTimeout(bind(ensureFocus, this), 0) : this.curOp.focus = activeElt(), behavior = function(cm, repeat, event) {
                    var option = cm.getOption("configureMouse"), value = option ? option(cm, repeat, event) : {};
                    if (null == value.unit) {
                        var rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
                        value.unit = rect ? "rectangle" : "single" == repeat ? "char" : "double" == repeat ? "word" : "line";
                    }
                    return (null == value.extend || cm.doc.extend) && (value.extend = cm.doc.extend || event.shiftKey), null == value.addNew && (value.addNew = mac ? event.metaKey : event.ctrlKey), null == value.moveOnDrag && (value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey)), value;
                }(this, repeat, e), sel = this.doc.sel, this.options.dragDrop && dragAndDrop && !this.isReadOnly() && "single" == repeat && (contained = sel.contains(pos)) > -1 && (0 > cmp((contained = sel.ranges[contained]).from(), pos) || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0) ? (cm1 = this, display = cm1.display, moved = !1, dragEnd = operation(cm1, function(e) {
                    webkit && (display.scroller.draggable = !1), cm1.state.draggingText = !1, cm1.state.delayingBlurEvent && (cm1.hasFocus() ? cm1.state.delayingBlurEvent = !1 : delayBlurEvent(cm1)), off(display.wrapper.ownerDocument, "mouseup", dragEnd), off(display.wrapper.ownerDocument, "mousemove", mouseMove), off(display.scroller, "dragstart", dragStart), off(display.scroller, "drop", dragEnd), moved || (e_preventDefault(e), behavior.addNew || extendSelection(cm1.doc, pos, null, null, behavior.extend), webkit && !safari || ie && 9 == ie_version ? setTimeout(function() {
                        display.wrapper.ownerDocument.body.focus({
                            preventScroll: !0
                        }), display.input.focus();
                    }, 20) : display.input.focus());
                }), mouseMove = function(e2) {
                    moved = moved || Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) >= 10;
                }, dragStart = function() {
                    return moved = !0;
                }, webkit && (display.scroller.draggable = !0), cm1.state.draggingText = dragEnd, dragEnd.copy = !behavior.moveOnDrag, on(display.wrapper.ownerDocument, "mouseup", dragEnd), on(display.wrapper.ownerDocument, "mousemove", mouseMove), on(display.scroller, "dragstart", dragStart), on(display.scroller, "drop", dragEnd), cm1.state.delayingBlurEvent = !0, setTimeout(function() {
                    return display.input.focus();
                }, 20), display.scroller.dragDrop && display.scroller.dragDrop()) : // Normal selection, as opposed to text dragging.
                function(cm, event, start, behavior) {
                    ie && delayBlurEvent(cm);
                    var display = cm.display, doc = cm.doc;
                    e_preventDefault(event);
                    var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
                    if (behavior.addNew && !behavior.extend ? ourRange = (ourIndex = doc.sel.contains(start)) > -1 ? ranges[ourIndex] : new Range(start, start) : (ourRange = doc.sel.primary(), ourIndex = doc.sel.primIndex), "rectangle" == behavior.unit) behavior.addNew || (ourRange = new Range(start, start)), start = posFromMouse(cm, event, !0, !0), ourIndex = -1;
                    else {
                        var range = rangeForUnit(cm, start, behavior.unit);
                        ourRange = behavior.extend ? extendRange(ourRange, range.anchor, range.head, behavior.extend) : range;
                    }
                    behavior.addNew ? -1 == ourIndex ? (ourIndex = ranges.length, setSelection(doc, normalizeSelection(cm, ranges.concat([
                        ourRange
                    ]), ourIndex), {
                        scroll: !1,
                        origin: "*mouse"
                    })) : ranges.length > 1 && ranges[ourIndex].empty() && "char" == behavior.unit && !behavior.extend ? (setSelection(doc, normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
                        scroll: !1,
                        origin: "*mouse"
                    }), startSel = doc.sel) : replaceOneSelection(doc, ourIndex, ourRange, sel_mouse) : (ourIndex = 0, setSelection(doc, new Selection([
                        ourRange
                    ], 0), sel_mouse), startSel = doc.sel);
                    var lastPos = start, editorSize = display.wrapper.getBoundingClientRect(), counter = 0;
                    function done(e) {
                        cm.state.selectingText = !1, counter = 1 / 0, e && (e_preventDefault(e), display.input.focus()), off(display.wrapper.ownerDocument, "mousemove", move), off(display.wrapper.ownerDocument, "mouseup", up), doc.history.lastSelOrigin = null;
                    }
                    var move = operation(cm, function(e) {
                        0 !== e.buttons && e_button(e) ? function extend(e) {
                            var curCount = ++counter, cur = posFromMouse(cm, e, !0, "rectangle" == behavior.unit);
                            if (cur) {
                                if (0 != cmp(cur, lastPos)) {
                                    cm.curOp.focus = activeElt(), function(pos) {
                                        if (0 != cmp(lastPos, pos)) {
                                            if (lastPos = pos, "rectangle" == behavior.unit) {
                                                for(var ranges = [], tabSize = cm.options.tabSize, startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize), posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize), left = Math.min(startCol, posCol), right = Math.max(startCol, posCol), line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++){
                                                    var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
                                                    left == right ? ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos))) : text.length > leftPos && ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
                                                }
                                                ranges.length || ranges.push(new Range(start, start)), setSelection(doc, normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
                                                    origin: "*mouse",
                                                    scroll: !1
                                                }), cm.scrollIntoView(pos);
                                            } else {
                                                var head, oldRange = ourRange, range = rangeForUnit(cm, pos, behavior.unit), anchor = oldRange.anchor;
                                                cmp(range.anchor, anchor) > 0 ? (head = range.head, anchor = minPos(oldRange.from(), range.anchor)) : (head = range.anchor, anchor = maxPos(oldRange.to(), range.head));
                                                var ranges$1 = startSel.ranges.slice(0);
                                                ranges$1[ourIndex] = // Used when mouse-selecting to adjust the anchor to the proper side
                                                // of a bidi jump depending on the visual position of the head.
                                                function(cm, range) {
                                                    var leftSide, anchor = range.anchor, head = range.head, anchorLine = getLine(cm.doc, anchor.line);
                                                    if (0 == cmp(anchor, head) && anchor.sticky == head.sticky) return range;
                                                    var order = getOrder(anchorLine);
                                                    if (!order) return range;
                                                    var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
                                                    if (part.from != anchor.ch && part.to != anchor.ch) return range;
                                                    var boundary = index + (part.from == anchor.ch == (1 != part.level) ? 0 : 1);
                                                    if (0 == boundary || boundary == order.length) return range;
                                                    if (head.line != anchor.line) leftSide = (head.line - anchor.line) * ("ltr" == cm.doc.direction ? 1 : -1) > 0;
                                                    else {
                                                        var headIndex = getBidiPartAt(order, head.ch, head.sticky), dir = headIndex - index || (head.ch - anchor.ch) * (1 == part.level ? -1 : 1);
                                                        leftSide = headIndex == boundary - 1 || headIndex == boundary ? dir < 0 : dir > 0;
                                                    }
                                                    var usePart = order[boundary + (leftSide ? -1 : 0)], from = leftSide == (1 == usePart.level), ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
                                                    return anchor.ch == ch && anchor.sticky == sticky ? range : new Range(new Pos(anchor.line, ch, sticky), head);
                                                }(cm, new Range(clipPos(doc, anchor), head)), setSelection(doc, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
                                            }
                                        }
                                    }(cur);
                                    var visible = visibleLines(display, doc);
                                    (cur.line >= visible.to || cur.line < visible.from) && setTimeout(operation(cm, function() {
                                        counter == curCount && extend(e);
                                    }), 150);
                                } else {
                                    var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                                    outside && setTimeout(operation(cm, function() {
                                        counter == curCount && (display.scroller.scrollTop += outside, extend(e));
                                    }), 50);
                                }
                            }
                        }(e) : done(e);
                    }), up = operation(cm, done);
                    cm.state.selectingText = up, on(display.wrapper.ownerDocument, "mousemove", move), on(display.wrapper.ownerDocument, "mouseup", up);
                }(this, e, pos, behavior)) : e_target(e) == display1.scroller && e_preventDefault(e) : 2 == button ? (pos && extendSelection(this.doc, pos), setTimeout(function() {
                    return display1.input.focus();
                }, 20)) : 3 == button && (captureRightClick ? this.display.input.onContextMenu(e) : delayBlurEvent(this)));
            }
        }
    }
    function rangeForUnit(cm, pos, unit) {
        if ("char" == unit) return new Range(pos, pos);
        if ("word" == unit) return cm.findWordAt(pos);
        if ("line" == unit) return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        var result = unit(cm, pos);
        return new Range(result.from, result.to);
    }
    // Determines whether an event happened in the gutter, and fires the
    // handlers for the corresponding event.
    function gutterEvent(cm, e, type, prevent) {
        if (e.touches) mX = e.touches[0].clientX, mY = e.touches[0].clientY;
        else try {
            mX = e.clientX, mY = e.clientY;
        } catch (e$1) {
            return !1;
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return !1;
        prevent && e_preventDefault(e);
        var mX, mY, display = cm.display, lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
        mY -= lineBox.top - display.viewOffset;
        for(var i = 0; i < cm.display.gutterSpecs.length; ++i){
            var g = display.gutters.childNodes[i];
            if (g && g.getBoundingClientRect().right >= mX) {
                var line = lineAtHeight(cm.doc, mY), gutter = cm.display.gutterSpecs[i];
                return signal(cm, type, cm, line, gutter.className, e), e_defaultPrevented(e);
            }
        }
    }
    function clickInGutter(cm, e) {
        return gutterEvent(cm, e, "gutterClick", !0);
    }
    // CONTEXT MENU HANDLING
    // To make the context menu work, we need to briefly unhide the
    // textarea (making it as unobtrusive as possible) to let the
    // right-click take effect on it.
    function onContextMenu(cm, e) {
        !(eventInWidget(cm.display, e) || hasHandler(cm, "gutterContextMenu") && gutterEvent(cm, e, "gutterContextMenu", !1) || signalDOMEvent(cm, e, "contextmenu")) && (captureRightClick || cm.display.input.onContextMenu(e));
    }
    function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), clearCaches(cm);
    }
    PastClick.prototype.compare = function(time, pos, button) {
        return this.time + 400 > time && 0 == cmp(pos, this.pos) && button == this.button;
    };
    var Init = {
        toString: function() {
            return "CodeMirror.Init";
        }
    }, defaults = {}, optionHandlers1 = {};
    function dragDropChanged(cm, value, old) {
        if (!value != !(old && old != Init)) {
            var funcs = cm.display.dragFunctions, toggle = value ? on : off;
            toggle(cm.display.scroller, "dragstart", funcs.start), toggle(cm.display.scroller, "dragenter", funcs.enter), toggle(cm.display.scroller, "dragover", funcs.over), toggle(cm.display.scroller, "dragleave", funcs.leave), toggle(cm.display.scroller, "drop", funcs.drop);
        }
    }
    function wrappingChanged(cm) {
        cm.options.lineWrapping ? (addClass(cm.display.wrapper, "CodeMirror-wrap"), cm.display.sizer.style.minWidth = "", cm.display.sizerWidth = null) : (rmClass(cm.display.wrapper, "CodeMirror-wrap"), findMaxLine(cm)), estimateLineHeights(cm), regChange(cm), clearCaches(cm), setTimeout(function() {
            return updateScrollbars(cm);
        }, 100);
    }
    // A CodeMirror instance represents an editor. This is the object
    // that user code is usually dealing with.
    function CodeMirror(place, options) {
        var this$1 = this;
        if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);
        this.options = options = options ? copyObj(options) : {}, // Determine effective options based on given values and defaults.
        copyObj(defaults, options, !1);
        var doc = options.value;
        "string" == typeof doc ? doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction) : options.mode && (doc.modeOption = options.mode), this.doc = doc;
        var input = new CodeMirror.inputStyles[options.inputStyle](this), display = this.display = new Display(place, doc, input, options);
        for(var opt in display.wrapper.CodeMirror = this, themeChanged(this), options.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), initScrollbars(this), this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: !1,
            delayingBlurEvent: !1,
            focused: !1,
            suppressEdits: !1,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: !1,
            draggingText: !1,
            highlight: new Delayed(),
            keySeq: null,
            specialChars: null
        }, options.autofocus && !mobile && display.input.focus(), ie && ie_version < 11 && setTimeout(function() {
            return this$1.display.input.reset(!0);
        }, 20), // Attach the necessary event handlers when initializing the editor
        function(cm) {
            var d = cm.display;
            on(d.scroller, "mousedown", operation(cm, onMouseDown)), ie && ie_version < 11 ? on(d.scroller, "dblclick", operation(cm, function(e) {
                if (!signalDOMEvent(cm, e)) {
                    var pos = posFromMouse(cm, e);
                    if (!(!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e))) {
                        e_preventDefault(e);
                        var word = cm.findWordAt(pos);
                        extendSelection(cm.doc, word.anchor, word.head);
                    }
                }
            })) : on(d.scroller, "dblclick", function(e) {
                return signalDOMEvent(cm, e) || e_preventDefault(e);
            }), // Some browsers fire contextmenu *after* opening the menu, at
            // which point we can't mess with it anymore. Context menu is
            // handled in onMouseDown for these browsers.
            on(d.scroller, "contextmenu", function(e) {
                return onContextMenu(cm, e);
            }), on(d.input.getField(), "contextmenu", function(e) {
                d.scroller.contains(e.target) || onContextMenu(cm, e);
            });
            // Used to suppress mouse event handling when a touch happens
            var touchFinished, prevTouch = {
                end: 0
            };
            function finishTouch() {
                d.activeTouch && (touchFinished = setTimeout(function() {
                    return d.activeTouch = null;
                }, 1000), (prevTouch = d.activeTouch).end = +new Date());
            }
            function farAway(touch, other) {
                if (null == other.left) return !0;
                var dx = other.left - touch.left, dy = other.top - touch.top;
                return dx * dx + dy * dy > 400;
            }
            on(d.scroller, "touchstart", function(e) {
                if (!signalDOMEvent(cm, e) && !function(e) {
                    if (1 != e.touches.length) return !1;
                    var touch = e.touches[0];
                    return touch.radiusX <= 1 && touch.radiusY <= 1;
                }(e) && !clickInGutter(cm, e)) {
                    d.input.ensurePolled(), clearTimeout(touchFinished);
                    var now = +new Date();
                    d.activeTouch = {
                        start: now,
                        moved: !1,
                        prev: now - prevTouch.end <= 300 ? prevTouch : null
                    }, 1 == e.touches.length && (d.activeTouch.left = e.touches[0].pageX, d.activeTouch.top = e.touches[0].pageY);
                }
            }), on(d.scroller, "touchmove", function() {
                d.activeTouch && (d.activeTouch.moved = !0);
            }), on(d.scroller, "touchend", function(e) {
                var touch = d.activeTouch;
                if (touch && !eventInWidget(d, e) && null != touch.left && !touch.moved && new Date() - touch.start < 300) {
                    var range, pos = cm.coordsChar(d.activeTouch, "page");
                    // Single tap
                    range = !touch.prev || farAway(touch, touch.prev) ? new Range(pos, pos) : !touch.prev.prev || farAway(touch, touch.prev.prev) ? cm.findWordAt(pos) : new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0))), cm.setSelection(range.anchor, range.head), cm.focus(), e_preventDefault(e);
                }
                finishTouch();
            }), on(d.scroller, "touchcancel", finishTouch), // Sync scrolling between fake scrollbars and real scrollable
            // area, ensure viewport is updated when scrolling.
            on(d.scroller, "scroll", function() {
                d.scroller.clientHeight && (updateScrollTop(cm, d.scroller.scrollTop), setScrollLeft(cm, d.scroller.scrollLeft, !0), signal(cm, "scroll", cm));
            }), // Listen to wheel events in order to try and update the viewport on time.
            on(d.scroller, "mousewheel", function(e) {
                return onScrollWheel(cm, e);
            }), on(d.scroller, "DOMMouseScroll", function(e) {
                return onScrollWheel(cm, e);
            }), // Prevent wrapper from ever scrolling
            on(d.wrapper, "scroll", function() {
                return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0;
            }), d.dragFunctions = {
                enter: function(e) {
                    signalDOMEvent(cm, e) || e_stop(e);
                },
                over: function(e) {
                    signalDOMEvent(cm, e) || (function(cm, e) {
                        var pos = posFromMouse(cm, e);
                        if (pos) {
                            var frag = document.createDocumentFragment();
                            drawSelectionCursor(cm, pos, frag), cm.display.dragCursor || (cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv)), removeChildrenAndAdd(cm.display.dragCursor, frag);
                        }
                    }(cm, e), e_stop(e));
                },
                start: function(e) {
                    return function(cm, e) {
                        if (ie && (!cm.state.draggingText || +new Date() - lastDrop < 100)) {
                            e_stop(e);
                            return;
                        }
                        if (!(signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) && (e.dataTransfer.setData("Text", cm.getSelection()), e.dataTransfer.effectAllowed = "copyMove", e.dataTransfer.setDragImage && !safari)) {
                            var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
                            img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", presto && (img.width = img.height = 1, cm.display.wrapper.appendChild(img), // Force a relayout, or Opera won't use our image for some obscure reason
                            img._top = img.offsetTop), e.dataTransfer.setDragImage(img, 0, 0), presto && img.parentNode.removeChild(img);
                        }
                    }(cm, e);
                },
                drop: operation(cm, onDrop),
                leave: function(e) {
                    signalDOMEvent(cm, e) || clearDragCursor(cm);
                }
            };
            var inp = d.input.getField();
            on(inp, "keyup", function(e) {
                return onKeyUp.call(cm, e);
            }), on(inp, "keydown", operation(cm, onKeyDown)), on(inp, "keypress", operation(cm, onKeyPress)), on(inp, "focus", function(e) {
                return onFocus(cm, e);
            }), on(inp, "blur", function(e) {
                return onBlur(cm, e);
            });
        }(this), !function() {
            if (!globalsRegistered) {
                // When the window resizes, we need to refresh active editors.
                var resizeTimer;
                on(window, "resize", function() {
                    null == resizeTimer && (resizeTimer = setTimeout(function() {
                        resizeTimer = null, forEachCodeMirror(onResize);
                    }, 100));
                }), // When the window loses focus, we want to show the editor as blurred
                on(window, "blur", function() {
                    return forEachCodeMirror(onBlur);
                }), globalsRegistered = !0;
            }
        }(), startOperation(this), this.curOp.forceUpdate = !0, attachDoc(this, doc), options.autofocus && !mobile || this.hasFocus() ? setTimeout(function() {
            this$1.hasFocus() && !this$1.state.focused && onFocus(this$1);
        }, 20) : onBlur(this), optionHandlers1)optionHandlers1.hasOwnProperty(opt) && optionHandlers1[opt](this, options[opt], Init);
        maybeUpdateLineNumberWidth(this), options.finishInit && options.finishInit(this);
        for(var i = 0; i < initHooks.length; ++i)initHooks[i](this);
        endOperation(this), webkit && options.lineWrapping && "optimizelegibility" == getComputedStyle(display.lineDiv).textRendering && (display.lineDiv.style.textRendering = "auto");
    }
    // The default configuration options.
    CodeMirror.defaults = defaults, // Functions to run when options are changed.
    CodeMirror.optionHandlers = optionHandlers1;
    var initHooks = [];
    // Indent the given line. The how parameter can be "smart",
    // "add"/null, "subtract", or "prev". When aggressive is false
    // (typically set to true for forced single-line indents), empty
    // lines are not indented, and places where the mode returns Pass
    // are left alone.
    function indentLine(cm, n, how, aggressive) {
        var state, doc = cm.doc;
        null == how && (how = "add"), "smart" == how && (doc.mode.indent ? state = getContextBefore(cm, n).state : how = "prev");
        var tabSize = cm.options.tabSize, line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
        line.stateAfter && (line.stateAfter = null);
        var indentation, curSpaceString = line.text.match(/^\s*/)[0];
        if (aggressive || /\S/.test(line.text)) {
            if ("smart" == how && ((indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text)) == Pass || indentation > 150)) {
                if (!aggressive) return;
                how = "prev";
            }
        } else indentation = 0, how = "not";
        "prev" == how ? indentation = n > doc.first ? countColumn(getLine(doc, n - 1).text, null, tabSize) : 0 : "add" == how ? indentation = curSpace + cm.options.indentUnit : "subtract" == how ? indentation = curSpace - cm.options.indentUnit : "number" == typeof how && (indentation = curSpace + how), indentation = Math.max(0, indentation);
        var indentString = "", pos = 0;
        if (cm.options.indentWithTabs) for(var i = Math.floor(indentation / tabSize); i; --i)pos += tabSize, indentString += "\t";
        if (pos < indentation && (indentString += spaceStr(indentation - pos)), indentString != curSpaceString) return replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input"), line.stateAfter = null, !0;
        // Ensure that, if the cursor was in the whitespace at the start
        // of the line, it is moved to the end of that space.
        for(var i$1 = 0; i$1 < doc.sel.ranges.length; i$1++){
            var range = doc.sel.ranges[i$1];
            if (range.head.line == n && range.head.ch < curSpaceString.length) {
                var pos$1 = Pos(n, curSpaceString.length);
                replaceOneSelection(doc, i$1, new Range(pos$1, pos$1));
                break;
            }
        }
    }
    CodeMirror.defineInitHook = function(f) {
        return initHooks.push(f);
    };
    // This will be set to a {lineWise: bool, text: [string]} object, so
    // that, when pasting, we know what kind of selections the copied
    // text was made out of.
    var lastCopied = null;
    function applyTextInput(cm, inserted, deleted, sel, origin) {
        var doc = cm.doc;
        cm.display.shift = !1, sel || (sel = doc.sel);
        var recent = +new Date() - 200, paste = "paste" == origin || cm.state.pasteIncoming > recent, textLines = splitLinesAuto(inserted), multiPaste = null;
        // When pasting N lines into N selections, insert one line per selection
        if (paste && sel.ranges.length > 1) {
            if (lastCopied && lastCopied.text.join("\n") == inserted) {
                if (sel.ranges.length % lastCopied.text.length == 0) {
                    multiPaste = [];
                    for(var i = 0; i < lastCopied.text.length; i++)multiPaste.push(doc.splitLines(lastCopied.text[i]));
                }
            } else textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection && (multiPaste = map(textLines, function(l) {
                return [
                    l
                ];
            }));
        }
        // Normal behavior is to insert the new text into every selection
        for(var updateInput = cm.curOp.updateInput, i$1 = sel.ranges.length - 1; i$1 >= 0; i$1--){
            var range = sel.ranges[i$1], from = range.from(), to = range.to();
            range.empty() && (deleted && deleted > 0 ? // Handle deletion
            from = Pos(from.line, from.ch - deleted) : cm.state.overwrite && !paste ? // Handle overwrite
            to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length)) : paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n") && (from = to = Pos(from.line, 0)));
            var changeEvent = {
                from: from,
                to: to,
                text: multiPaste ? multiPaste[i$1 % multiPaste.length] : textLines,
                origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
            };
            makeChange(cm.doc, changeEvent), signalLater(cm, "inputRead", cm, changeEvent);
        }
        inserted && !paste && triggerElectric(cm, inserted), ensureCursorVisible(cm), cm.curOp.updateInput < 2 && (cm.curOp.updateInput = updateInput), cm.curOp.typing = !0, cm.state.pasteIncoming = cm.state.cutIncoming = -1;
    }
    function handlePaste(e, cm) {
        var pasted = e.clipboardData && e.clipboardData.getData("Text");
        if (pasted) return e.preventDefault(), cm.isReadOnly() || cm.options.disableInput || runInOp(cm, function() {
            return applyTextInput(cm, pasted, 0, null, "paste");
        }), !0;
    }
    function triggerElectric(cm, inserted) {
        // When an 'electric' character is inserted, immediately trigger a reindent
        if (cm.options.electricChars && cm.options.smartIndent) for(var sel = cm.doc.sel, i = sel.ranges.length - 1; i >= 0; i--){
            var range = sel.ranges[i];
            if (!(range.head.ch > 100) && (!i || sel.ranges[i - 1].head.line != range.head.line)) {
                var mode = cm.getModeAt(range.head), indented = !1;
                if (mode.electricChars) {
                    for(var j = 0; j < mode.electricChars.length; j++)if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                        indented = indentLine(cm, range.head.line, "smart");
                        break;
                    }
                } else mode.electricInput && mode.electricInput.test(getLine(cm.doc, range.head.line).text.slice(0, range.head.ch)) && (indented = indentLine(cm, range.head.line, "smart"));
                indented && signalLater(cm, "electricInput", cm, range.head.line);
            }
        }
    }
    function copyableRanges(cm) {
        for(var text = [], ranges = [], i = 0; i < cm.doc.sel.ranges.length; i++){
            var line = cm.doc.sel.ranges[i].head.line, lineRange = {
                anchor: Pos(line, 0),
                head: Pos(line + 1, 0)
            };
            ranges.push(lineRange), text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return {
            text: text,
            ranges: ranges
        };
    }
    function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute("autocorrect", autocorrect ? "" : "off"), field.setAttribute("autocapitalize", autocapitalize ? "" : "off"), field.setAttribute("spellcheck", !!spellcheck);
    }
    function hiddenTextarea() {
        var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none"), div = elt("div", [
            te
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        return webkit ? te.style.width = "1000px" : te.setAttribute("wrap", "off"), ios && (te.style.border = "1px solid black"), disableBrowserMagic(te), div;
    }
    // Used for horizontal relative motion. Dir is -1 or 1 (left or
    // right), unit can be "codepoint", "char", "column" (like char, but
    // doesn't cross line boundaries), "word" (across next word), or
    // "group" (to the start of next group of word or
    // non-word-non-whitespace chars). The visually param controls
    // whether, in right-to-left text, direction 1 means to move towards
    // the next index in the string, or towards the character to the right
    // of the current position. The resulting position will have a
    // hitSide=true property if it reached the end of the document.
    function findPosH(doc, pos, dir, unit, visually) {
        var oldPos = pos, origDir = dir, lineObj = getLine(doc, pos.line), lineDir = visually && "rtl" == doc.direction ? -dir : dir;
        function moveOnce(boundToLine) {
            if ("codepoint" == unit) {
                var next, l, ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));
                if (isNaN(ch)) next = null;
                else {
                    var astral = dir > 0 ? ch >= 0xd800 && ch < 0xdc00 : ch >= 0xdc00 && ch < 0xdfff;
                    next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
                }
            } else next = visually ? function(cm, line, start, dir) {
                var prep, bidi = getOrder(line, cm.doc.direction);
                if (!bidi) return moveLogically(line, start, dir);
                start.ch >= line.text.length ? (start.ch = line.text.length, start.sticky = "before") : start.ch <= 0 && (start.ch = 0, start.sticky = "after");
                var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
                if ("ltr" == cm.doc.direction && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) // Case 1: We move within an ltr part in an ltr editor. Even with wrapped lines,
                // nothing interesting happens.
                return moveLogically(line, start, dir);
                var mv = function(pos, dir) {
                    return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir);
                }, getWrappedLineExtent = function(ch) {
                    return cm.options.lineWrapping ? (prep = prep || prepareMeasureForLine(cm, line), wrappedLineExtentChar(cm, line, prep, ch)) : {
                        begin: 0,
                        end: line.text.length
                    };
                }, wrappedLineExtent = getWrappedLineExtent("before" == start.sticky ? mv(start, -1) : start.ch);
                if ("rtl" == cm.doc.direction || 1 == part.level) {
                    var moveInStorageOrder = 1 == part.level == dir < 0, ch = mv(start, moveInStorageOrder ? 1 : -1);
                    if (null != ch && (moveInStorageOrder ? ch <= part.to && ch <= wrappedLineExtent.end : ch >= part.from && ch >= wrappedLineExtent.begin)) return new Pos(start.line, ch, moveInStorageOrder ? "before" : "after");
                }
                // Case 3: Could not move within this bidi part in this visual line, so leave
                // the current bidi part
                var searchInVisualLine = function(partPos, dir, wrappedLineExtent) {
                    for(; partPos >= 0 && partPos < bidi.length; partPos += dir){
                        var ch, part = bidi[partPos], moveInStorageOrder = dir > 0 == (1 != part.level), ch1 = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
                        if (part.from <= ch1 && ch1 < part.to || (ch1 = moveInStorageOrder ? part.from : mv(part.to, -1), wrappedLineExtent.begin <= ch1 && ch1 < wrappedLineExtent.end)) return ch = ch1, moveInStorageOrder ? new Pos(start.line, mv(ch, 1), "before") : new Pos(start.line, ch, "after");
                    }
                }, res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
                if (res) return res;
                // Case 3b: Look for other bidi parts on the next visual line
                var nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
                return null != nextCh && !(dir > 0 && nextCh == line.text.length) && (res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh))) ? res : null;
            }(doc.cm, lineObj, pos, dir) : moveLogically(lineObj, pos, dir);
            if (null == next) {
                if (!(!boundToLine && !((l = pos.line + lineDir) < doc.first) && !(l >= doc.first + doc.size) && (pos = new Pos(l, pos.ch, pos.sticky), lineObj = getLine(doc, l)))) return !1;
                pos = endOfLine(visually, doc.cm, lineObj, pos.line, lineDir);
            } else pos = next;
            return !0;
        }
        if ("char" == unit || "codepoint" == unit) moveOnce();
        else if ("column" == unit) moveOnce(!0);
        else if ("word" == unit || "group" == unit) for(var sawType = null, group = "group" == unit, helper = doc.cm && doc.cm.getHelper(pos, "wordChars"), first = !0; !(dir < 0) || moveOnce(!first); first = !1){
            var cur = lineObj.text.charAt(pos.ch) || "\n", type = isWordChar(cur, helper) ? "w" : group && "\n" == cur ? "n" : !group || /\s/.test(cur) ? null : "p";
            if (!group || first || type || (type = "s"), sawType && sawType != type) {
                dir < 0 && (dir = 1, moveOnce(), pos.sticky = "after");
                break;
            }
            if (type && (sawType = type), dir > 0 && !moveOnce(!first)) break;
        }
        var result = skipAtomic(doc, pos, oldPos, origDir, !0);
        return equalCursorPos(oldPos, result) && (result.hitSide = !0), result;
    }
    // For relative vertical movement. Dir may be -1 or 1. Unit can be
    // "page" or "line". The resulting position will have a hitSide=true
    // property if it reached the end of the document.
    function findPosV(cm, pos, dir, unit) {
        var target, y, doc = cm.doc, x = pos.left;
        if ("page" == unit) {
            var moveAmount = Math.max(Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight) - 0.5 * textHeight(cm.display), 3);
            y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else "line" == unit && (y = dir > 0 ? pos.bottom + 3 : pos.top - 3);
        for(; (target = coordsChar(cm, x, y)).outside;){
            if (dir < 0 ? y <= 0 : y >= doc.height) {
                target.hitSide = !0;
                break;
            }
            y += 5 * dir;
        }
        return target;
    }
    // CONTENTEDITABLE INPUT STYLE
    var ContentEditableInput = function(cm) {
        this.cm = cm, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new Delayed(), this.composing = null, this.gracePeriod = !1, this.readDOMTimeout = null;
    };
    function posToDOM(cm, pos) {
        var view = findViewForLine(cm, pos.line);
        if (!view || view.hidden) return null;
        var line = getLine(cm.doc, pos.line), info = mapFromLineView(view, line, pos.line), order = getOrder(line, cm.doc.direction), side = "left";
        order && (side = getBidiPartAt(order, pos.ch) % 2 ? "right" : "left");
        var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
        return result.offset = "right" == result.collapse ? result.end : result.start, result;
    }
    function badPos(pos, bad) {
        return bad && (pos.bad = !0), pos;
    }
    function domToPos(cm, node, offset) {
        var lineNode;
        if (node == cm.display.lineDiv) {
            if (!(lineNode = cm.display.lineDiv.childNodes[offset])) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), !0);
            node = null, offset = 0;
        } else for(lineNode = node;; lineNode = lineNode.parentNode){
            if (!lineNode || lineNode == cm.display.lineDiv) return null;
            if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
        }
        for(var i = 0; i < cm.display.view.length; i++){
            var lineView = cm.display.view[i];
            if (lineView.node == lineNode) return function(lineView, node, offset) {
                var wrapper = lineView.text.firstChild, bad = !1;
                if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), !0);
                if (node == wrapper && (bad = !0, node = wrapper.childNodes[offset], offset = 0, !node)) {
                    var line = lineView.rest ? lst(lineView.rest) : lineView.line;
                    return badPos(Pos(lineNo(line), line.text.length), bad);
                }
                var textNode = 3 == node.nodeType ? node : null, topNode = node;
                for(!textNode && 1 == node.childNodes.length && 3 == node.firstChild.nodeType && (textNode = node.firstChild, offset && (offset = textNode.nodeValue.length)); topNode.parentNode != wrapper;)topNode = topNode.parentNode;
                var measure = lineView.measure, maps = measure.maps;
                function find(textNode, topNode, offset) {
                    for(var i = -1; i < (maps ? maps.length : 0); i++)for(var map = i < 0 ? measure.map : maps[i], j = 0; j < map.length; j += 3){
                        var curNode = map[j + 2];
                        if (curNode == textNode || curNode == topNode) {
                            var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]), ch = map[j] + offset;
                            return (offset < 0 || curNode != textNode) && (ch = map[j + (offset ? 1 : 0)]), Pos(line, ch);
                        }
                    }
                }
                var found = find(textNode, topNode, offset);
                if (found) return badPos(found, bad);
                // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
                for(var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling){
                    if (found = find(after, after.firstChild, 0)) return badPos(Pos(found.line, found.ch - dist), bad);
                    dist += after.textContent.length;
                }
                for(var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling){
                    if (found = find(before, before.firstChild, -1)) return badPos(Pos(found.line, found.ch + dist$1), bad);
                    dist$1 += before.textContent.length;
                }
            }(lineView, node, offset);
        }
    }
    ContentEditableInput.prototype.init = function(display) {
        var this$1 = this, input = this, cm = input.cm, div = input.div = display.lineDiv;
        function belongsToInput(e) {
            for(var t = e.target; t; t = t.parentNode){
                if (t == div) return !0;
                if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) break;
            }
            return !1;
        }
        function onCopyCut(e) {
            if (!(!belongsToInput(e) || signalDOMEvent(cm, e))) {
                if (cm.somethingSelected()) lastCopied = {
                    lineWise: !1,
                    text: cm.getSelections()
                }, "cut" == e.type && cm.replaceSelection("", null, "cut");
                else {
                    if (!cm.options.lineWiseCopyCut) return;
                    var ranges = copyableRanges(cm);
                    lastCopied = {
                        lineWise: !0,
                        text: ranges.text
                    }, "cut" == e.type && cm.operation(function() {
                        cm.setSelections(ranges.ranges, 0, sel_dontScroll), cm.replaceSelection("", null, "cut");
                    });
                }
                if (e.clipboardData) {
                    e.clipboardData.clearData();
                    var content = lastCopied.text.join("\n");
                    if (// iOS exposes the clipboard API, but seems to discard content inserted into it
                    e.clipboardData.setData("Text", content), e.clipboardData.getData("Text") == content) {
                        e.preventDefault();
                        return;
                    }
                }
                // Old-fashioned briefly-focus-a-textarea hack
                var kludge = hiddenTextarea(), te = kludge.firstChild;
                cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild), te.value = lastCopied.text.join("\n");
                var hadFocus = activeElt();
                selectInput(te), setTimeout(function() {
                    cm.display.lineSpace.removeChild(kludge), hadFocus.focus(), hadFocus == div && input.showPrimarySelection();
                }, 50);
            }
        }
        div.contentEditable = !0, disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize), on(div, "paste", function(e) {
            !(!belongsToInput(e) || signalDOMEvent(cm, e) || handlePaste(e, cm)) && ie_version <= 11 && setTimeout(operation(cm, function() {
                return this$1.updateFromDOM();
            }), 20);
        }), on(div, "compositionstart", function(e) {
            this$1.composing = {
                data: e.data,
                done: !1
            };
        }), on(div, "compositionupdate", function(e) {
            this$1.composing || (this$1.composing = {
                data: e.data,
                done: !1
            });
        }), on(div, "compositionend", function(e) {
            this$1.composing && (e.data != this$1.composing.data && this$1.readFromDOMSoon(), this$1.composing.done = !0);
        }), on(div, "touchstart", function() {
            return input.forceCompositionEnd();
        }), on(div, "input", function() {
            this$1.composing || this$1.readFromDOMSoon();
        }), on(div, "copy", onCopyCut), on(div, "cut", onCopyCut);
    }, ContentEditableInput.prototype.screenReaderLabelChanged = function(label) {
        // Label for screenreaders, accessibility
        label ? this.div.setAttribute("aria-label", label) : this.div.removeAttribute("aria-label");
    }, ContentEditableInput.prototype.prepareSelection = function() {
        var result = prepareSelection(this.cm, !1);
        return result.focus = activeElt() == this.div, result;
    }, ContentEditableInput.prototype.showSelection = function(info, takeFocus) {
        info && this.cm.display.view.length && ((info.focus || takeFocus) && this.showPrimarySelection(), this.showMultipleSelections(info));
    }, ContentEditableInput.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    }, ContentEditableInput.prototype.showPrimarySelection = function() {
        var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary(), from = prim.from(), to = prim.to();
        if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
            sel.removeAllRanges();
            return;
        }
        var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset), curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (!curAnchor || curAnchor.bad || !curFocus || curFocus.bad || 0 != cmp(minPos(curAnchor, curFocus), from) || 0 != cmp(maxPos(curAnchor, curFocus), to)) {
            var view = cm.display.view, start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || {
                node: view[0].measure.map[2],
                offset: 0
            }, end = to.line < cm.display.viewTo && posToDOM(cm, to);
            if (!end) {
                var measure = view[view.length - 1].measure, map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
                end = {
                    node: map[map.length - 1],
                    offset: map[map.length - 2] - map[map.length - 3]
                };
            }
            if (!start || !end) {
                sel.removeAllRanges();
                return;
            }
            var rng, old = sel.rangeCount && sel.getRangeAt(0);
            try {
                rng = range(start.node, start.offset, end.offset, end.node);
            } catch (e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
            rng && (!gecko && cm.state.focused ? (sel.collapse(start.node, start.offset), rng.collapsed || (sel.removeAllRanges(), sel.addRange(rng))) : (sel.removeAllRanges(), sel.addRange(rng)), old && null == sel.anchorNode ? sel.addRange(old) : gecko && this.startGracePeriod()), this.rememberSelection();
        }
    }, ContentEditableInput.prototype.startGracePeriod = function() {
        var this$1 = this;
        clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() {
            this$1.gracePeriod = !1, this$1.selectionChanged() && this$1.cm.operation(function() {
                return this$1.cm.curOp.selectionChanged = !0;
            });
        }, 20);
    }, ContentEditableInput.prototype.showMultipleSelections = function(info) {
        removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors), removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
    }, ContentEditableInput.prototype.rememberSelection = function() {
        var sel = this.getSelection();
        this.lastAnchorNode = sel.anchorNode, this.lastAnchorOffset = sel.anchorOffset, this.lastFocusNode = sel.focusNode, this.lastFocusOffset = sel.focusOffset;
    }, ContentEditableInput.prototype.selectionInEditor = function() {
        var sel = this.getSelection();
        if (!sel.rangeCount) return !1;
        var node = sel.getRangeAt(0).commonAncestorContainer;
        return contains(this.div, node);
    }, ContentEditableInput.prototype.focus = function() {
        "nocursor" != this.cm.options.readOnly && (this.selectionInEditor() && activeElt() == this.div || this.showSelection(this.prepareSelection(), !0), this.div.focus());
    }, ContentEditableInput.prototype.blur = function() {
        this.div.blur();
    }, ContentEditableInput.prototype.getField = function() {
        return this.div;
    }, ContentEditableInput.prototype.supportsTouch = function() {
        return !0;
    }, ContentEditableInput.prototype.receivedFocus = function() {
        var this$1 = this, input = this;
        this.selectionInEditor() ? setTimeout(function() {
            return this$1.pollSelection();
        }, 20) : runInOp(this.cm, function() {
            return input.cm.curOp.selectionChanged = !0;
        }), this.polling.set(this.cm.options.pollInterval, function poll() {
            input.cm.state.focused && (input.pollSelection(), input.polling.set(input.cm.options.pollInterval, poll));
        });
    }, ContentEditableInput.prototype.selectionChanged = function() {
        var sel = this.getSelection();
        return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
    }, ContentEditableInput.prototype.pollSelection = function() {
        if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
            var sel = this.getSelection(), cm = this.cm;
            // On Android Chrome (version 56, at least), backspacing into an
            // uneditable block element will put the cursor in that element,
            // and then, because it's not editable, hide the virtual keyboard.
            // Because Android doesn't allow us to actually detect backspace
            // presses in a sane way, this code checks for when that happens
            // and simulates a backspace press in this case.
            if (android && chrome && this.cm.display.gutterSpecs.length && function(node) {
                for(var scan = node; scan; scan = scan.parentNode)if (/CodeMirror-gutter-wrapper/.test(scan.className)) return !0;
                return !1;
            }(sel.anchorNode)) {
                this.cm.triggerOnKeyDown({
                    type: "keydown",
                    keyCode: 8,
                    preventDefault: Math.abs
                }), this.blur(), this.focus();
                return;
            }
            if (!this.composing) {
                this.rememberSelection();
                var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset), head = domToPos(cm, sel.focusNode, sel.focusOffset);
                anchor && head && runInOp(cm, function() {
                    setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll), (anchor.bad || head.bad) && (cm.curOp.selectionChanged = !0);
                });
            }
        }
    }, ContentEditableInput.prototype.pollContent = function() {
        null != this.readDOMTimeout && (clearTimeout(this.readDOMTimeout), this.readDOMTimeout = null);
        var fromIndex, fromLine, fromNode, toLine, toNode, cm = this.cm, display = cm.display, sel = cm.doc.sel.primary(), from = sel.from(), to = sel.to();
        if (0 == from.ch && from.line > cm.firstLine() && (from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length)), to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine() && (to = Pos(to.line + 1, 0)), from.line < display.viewFrom || to.line > display.viewTo - 1) return !1;
        from.line == display.viewFrom || 0 == (fromIndex = findViewIndex(cm, from.line)) ? (fromLine = lineNo(display.view[0].line), fromNode = display.view[0].node) : (fromLine = lineNo(display.view[fromIndex].line), fromNode = display.view[fromIndex - 1].node.nextSibling);
        var toIndex = findViewIndex(cm, to.line);
        if (toIndex == display.view.length - 1 ? (toLine = display.viewTo - 1, toNode = display.lineDiv.lastChild) : (toLine = lineNo(display.view[toIndex + 1].line) - 1, toNode = display.view[toIndex + 1].node.previousSibling), !fromNode) return !1;
        for(var newText = cm.doc.splitLines(function(cm, from, to, fromLine, toLine) {
            var text = "", closing = !1, lineSep = cm.doc.lineSeparator(), extraLinebreak = !1;
            function close() {
                closing && (text += lineSep, extraLinebreak && (text += lineSep), closing = extraLinebreak = !1);
            }
            function addText(str) {
                str && (close(), text += str);
            }
            for(; function walk(node) {
                if (1 == node.nodeType) {
                    var cmText = node.getAttribute("cm-text");
                    if (cmText) {
                        addText(cmText);
                        return;
                    }
                    var range, markerID = node.getAttribute("cm-marker");
                    if (markerID) {
                        var id, found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), (id = +markerID, function(marker) {
                            return marker.id == id;
                        }));
                        found.length && (range = found[0].find(0)) && addText(getBetween(cm.doc, range.from, range.to).join(lineSep));
                        return;
                    }
                    if ("false" != node.getAttribute("contenteditable")) {
                        var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
                        if (/^br$/i.test(node.nodeName) || 0 != node.textContent.length) {
                            isBlock && close();
                            for(var i = 0; i < node.childNodes.length; i++)walk(node.childNodes[i]);
                            /^(pre|p)$/i.test(node.nodeName) && (extraLinebreak = !0), isBlock && (closing = !0);
                        }
                    }
                } else 3 == node.nodeType && addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
            }(from), from != to;)from = from.nextSibling, extraLinebreak = !1;
            return text;
        }(cm, fromNode, toNode, fromLine, toLine)), oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length)); newText.length > 1 && oldText.length > 1;)if (lst(newText) == lst(oldText)) newText.pop(), oldText.pop(), toLine--;
        else if (newText[0] == oldText[0]) newText.shift(), oldText.shift(), fromLine++;
        else break;
        for(var cutFront = 0, cutEnd = 0, newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length); cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront);)++cutFront;
        for(var newBot = lst(newText), oldBot = lst(oldText), maxCutEnd = Math.min(newBot.length - (1 == newText.length ? cutFront : 0), oldBot.length - (1 == oldText.length ? cutFront : 0)); cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1);)++cutEnd;
        // Try to move start of change to start of selection if ambiguous
        if (1 == newText.length && 1 == oldText.length && fromLine == from.line) for(; cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1);)cutFront--, cutEnd++;
        newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, ""), newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
        var chFrom = Pos(fromLine, cutFront), chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
        if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) return replaceRange(cm.doc, newText, chFrom, chTo, "+input"), !0;
    }, ContentEditableInput.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    }, ContentEditableInput.prototype.reset = function() {
        this.forceCompositionEnd();
    }, ContentEditableInput.prototype.forceCompositionEnd = function() {
        this.composing && (clearTimeout(this.readDOMTimeout), this.composing = null, this.updateFromDOM(), this.div.blur(), this.div.focus());
    }, ContentEditableInput.prototype.readFromDOMSoon = function() {
        var this$1 = this;
        null == this.readDOMTimeout && (this.readDOMTimeout = setTimeout(function() {
            if (this$1.readDOMTimeout = null, this$1.composing) {
                if (!this$1.composing.done) return;
                this$1.composing = null;
            }
            this$1.updateFromDOM();
        }, 80));
    }, ContentEditableInput.prototype.updateFromDOM = function() {
        var this$1 = this;
        (this.cm.isReadOnly() || !this.pollContent()) && runInOp(this.cm, function() {
            return regChange(this$1.cm);
        });
    }, ContentEditableInput.prototype.setUneditable = function(node) {
        node.contentEditable = "false";
    }, ContentEditableInput.prototype.onKeyPress = function(e) {
        0 != e.charCode && !this.composing && (e.preventDefault(), this.cm.isReadOnly() || operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0));
    }, ContentEditableInput.prototype.readOnlyChanged = function(val) {
        this.div.contentEditable = String("nocursor" != val);
    }, ContentEditableInput.prototype.onContextMenu = function() {}, ContentEditableInput.prototype.resetPosition = function() {}, ContentEditableInput.prototype.needsContentAttribute = !0;
    // TEXTAREA INPUT STYLE
    var TextareaInput = function(cm) {
        this.cm = cm, // See input.poll and input.reset
        this.prevInput = "", // Flag that indicates whether we expect input to appear real soon
        // now (after some event like 'keypress' or 'input') and are
        // polling intensively.
        this.pollingFast = !1, // Self-resetting timeout for the poller
        this.polling = new Delayed(), // Used to work around IE issue with selection being forgotten when focus moves away from textarea
        this.hasSelection = !1, this.composing = null;
    };
    TextareaInput.prototype.init = function(display) {
        var this$1 = this, input = this, cm = this.cm;
        this.createField(display);
        var te = this.textarea;
        function prepareCopyCut(e) {
            if (!signalDOMEvent(cm, e)) {
                if (cm.somethingSelected()) lastCopied = {
                    lineWise: !1,
                    text: cm.getSelections()
                };
                else {
                    if (!cm.options.lineWiseCopyCut) return;
                    var ranges = copyableRanges(cm);
                    lastCopied = {
                        lineWise: !0,
                        text: ranges.text
                    }, "cut" == e.type ? cm.setSelections(ranges.ranges, null, sel_dontScroll) : (input.prevInput = "", te.value = ranges.text.join("\n"), selectInput(te));
                }
                "cut" == e.type && (cm.state.cutIncoming = +new Date());
            }
        }
        display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild), ios && (te.style.width = "0px"), on(te, "input", function() {
            ie && ie_version >= 9 && this$1.hasSelection && (this$1.hasSelection = null), input.poll();
        }), on(te, "paste", function(e) {
            signalDOMEvent(cm, e) || handlePaste(e, cm) || (cm.state.pasteIncoming = +new Date(), input.fastPoll());
        }), on(te, "cut", prepareCopyCut), on(te, "copy", prepareCopyCut), on(display.scroller, "paste", function(e) {
            if (!(eventInWidget(display, e) || signalDOMEvent(cm, e))) {
                if (!te.dispatchEvent) {
                    cm.state.pasteIncoming = +new Date(), input.focus();
                    return;
                }
                // Pass the `paste` event to the textarea so it's handled by its event listener.
                var event = new Event("paste");
                event.clipboardData = e.clipboardData, te.dispatchEvent(event);
            }
        }), // Prevent normal selection in the editor (we handle our own)
        on(display.lineSpace, "selectstart", function(e) {
            eventInWidget(display, e) || e_preventDefault(e);
        }), on(te, "compositionstart", function() {
            var start = cm.getCursor("from");
            input.composing && input.composing.range.clear(), input.composing = {
                start: start,
                range: cm.markText(start, cm.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        }), on(te, "compositionend", function() {
            input.composing && (input.poll(), input.composing.range.clear(), input.composing = null);
        });
    }, TextareaInput.prototype.createField = function(_display) {
        // Wraps and hides input textarea
        this.wrapper = hiddenTextarea(), // The semihidden textarea that is focused when the editor is
        // focused, and receives input.
        this.textarea = this.wrapper.firstChild;
    }, TextareaInput.prototype.screenReaderLabelChanged = function(label) {
        // Label for screenreaders, accessibility
        label ? this.textarea.setAttribute("aria-label", label) : this.textarea.removeAttribute("aria-label");
    }, TextareaInput.prototype.prepareSelection = function() {
        // Redraw the selection and/or cursor
        var cm = this.cm, display = cm.display, doc = cm.doc, result = prepareSelection(cm);
        // Move the hidden textarea near the cursor to prevent scrolling artifacts
        if (cm.options.moveInputWithCursor) {
            var headPos = cursorCoords(cm, doc.sel.primary().head, "div"), wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
            result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top)), result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
        }
        return result;
    }, TextareaInput.prototype.showSelection = function(drawn) {
        var display = this.cm.display;
        removeChildrenAndAdd(display.cursorDiv, drawn.cursors), removeChildrenAndAdd(display.selectionDiv, drawn.selection), null != drawn.teTop && (this.wrapper.style.top = drawn.teTop + "px", this.wrapper.style.left = drawn.teLeft + "px");
    }, // Reset the input to correspond to the selection (or to be empty,
    // when not typing and nothing is selected)
    TextareaInput.prototype.reset = function(typing) {
        if (!this.contextMenuPending && !this.composing) {
            var cm = this.cm;
            if (cm.somethingSelected()) {
                this.prevInput = "";
                var content = cm.getSelection();
                this.textarea.value = content, cm.state.focused && selectInput(this.textarea), ie && ie_version >= 9 && (this.hasSelection = content);
            } else !typing && (this.prevInput = this.textarea.value = "", ie && ie_version >= 9 && (this.hasSelection = null));
        }
    }, TextareaInput.prototype.getField = function() {
        return this.textarea;
    }, TextareaInput.prototype.supportsTouch = function() {
        return !1;
    }, TextareaInput.prototype.focus = function() {
        if ("nocursor" != this.cm.options.readOnly && (!mobile || activeElt() != this.textarea)) try {
            this.textarea.focus();
        } catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
    }, TextareaInput.prototype.blur = function() {
        this.textarea.blur();
    }, TextareaInput.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
    }, TextareaInput.prototype.receivedFocus = function() {
        this.slowPoll();
    }, // Poll for input changes, using the normal rate of polling. This
    // runs as long as the editor is focused.
    TextareaInput.prototype.slowPoll = function() {
        var this$1 = this;
        this.pollingFast || this.polling.set(this.cm.options.pollInterval, function() {
            this$1.poll(), this$1.cm.state.focused && this$1.slowPoll();
        });
    }, // When an event has just come in that is likely to add or change
    // something in the input textarea, we poll faster, to ensure that
    // the change appears on the screen quickly.
    TextareaInput.prototype.fastPoll = function() {
        var missed = !1, input = this;
        input.pollingFast = !0, input.polling.set(20, function p() {
            input.poll() || missed ? (input.pollingFast = !1, input.slowPoll()) : (missed = !0, input.polling.set(60, p));
        });
    }, // Read input from the textarea, and update the document to match.
    // When something is selected, it is present in the textarea, and
    // selected (unless it is huge, in which case a placeholder is
    // used). When nothing is selected, the cursor sits after previously
    // seen text (can be empty), which is stored in prevInput (we must
    // not reset the textarea when typing, because that breaks IME).
    TextareaInput.prototype.poll = function() {
        var this$1 = this, cm = this.cm, input = this.textarea, prevInput = this.prevInput;
        // Since this is called a *lot*, try to bail out as cheaply as
        // possible when it is clear that nothing happened. hasSelection
        // will be the case when there is a lot of text in the textarea,
        // in which case reading its value would be expensive.
        if (this.contextMenuPending || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) return !1;
        var text = input.value;
        // If nothing changed, bail.
        if (text == prevInput && !cm.somethingSelected()) return !1;
        // Work around nonsensical selection resetting in IE9/10, and
        // inexplicable appearance of private area unicode characters on
        // some key combos in Mac (#2689).
        if (ie && ie_version >= 9 && this.hasSelection === text || mac && /[\uf700-\uf7ff]/.test(text)) return cm.display.input.reset(), !1;
        if (cm.doc.sel == cm.display.selForContextMenu) {
            var first = text.charCodeAt(0);
            if (0x200b != first || prevInput || (prevInput = "\u200b"), 0x21da == first) return this.reset(), this.cm.execCommand("undo");
        }
        for(// Find the part of the input that is actually new
        var same = 0, l = Math.min(prevInput.length, text.length); same < l && prevInput.charCodeAt(same) == text.charCodeAt(same);)++same;
        return runInOp(cm, function() {
            applyTextInput(cm, text.slice(same), prevInput.length - same, null, this$1.composing ? "*compose" : null), text.length > 1000 || text.indexOf("\n") > -1 ? input.value = this$1.prevInput = "" : this$1.prevInput = text, this$1.composing && (this$1.composing.range.clear(), this$1.composing.range = cm.markText(this$1.composing.start, cm.getCursor("to"), {
                className: "CodeMirror-composing"
            }));
        }), !0;
    }, TextareaInput.prototype.ensurePolled = function() {
        this.pollingFast && this.poll() && (this.pollingFast = !1);
    }, TextareaInput.prototype.onKeyPress = function() {
        ie && ie_version >= 9 && (this.hasSelection = null), this.fastPoll();
    }, TextareaInput.prototype.onContextMenu = function(e) {
        var oldScrollY, input = this, cm = input.cm, display = cm.display, te = input.textarea;
        input.contextMenuPending && input.contextMenuPending();
        var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
        if (pos && !presto) {
            cm.options.resetSelectionOnContextMenu && -1 == cm.doc.sel.contains(pos) && operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
            var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText, wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
            if (input.wrapper.style.cssText = "position: static", te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", webkit && (oldScrollY = window.scrollY), display.input.focus(), webkit && window.scrollTo(null, oldScrollY), display.input.reset(), cm.somethingSelected() || (te.value = input.prevInput = " "), input.contextMenuPending = rehide, display.selForContextMenu = cm.doc.sel, clearTimeout(display.detectingSelectAll), ie && ie_version >= 9 && prepareSelectAllHack(), captureRightClick) {
                e_stop(e);
                var mouseup = function() {
                    off(window, "mouseup", mouseup), setTimeout(rehide, 20);
                };
                on(window, "mouseup", mouseup);
            } else setTimeout(rehide, 50);
        } // Opera is difficult.
        // Select-all will be greyed out if there's nothing to select, so
        // this adds a zero-width space so that we can later check whether
        // it got selected.
        function prepareSelectAllHack() {
            if (null != te.selectionStart) {
                var selected = cm.somethingSelected(), extval = "\u200b" + (selected ? te.value : "");
                te.value = "\u21da", te.value = extval, input.prevInput = selected ? "" : "\u200b", te.selectionStart = 1, te.selectionEnd = extval.length, // Re-set this, in case some other handler touched the
                // selection in the meantime.
                display.selForContextMenu = cm.doc.sel;
            }
        }
        function rehide() {
            if (input.contextMenuPending == rehide && (input.contextMenuPending = !1, input.wrapper.style.cssText = oldWrapperCSS, te.style.cssText = oldCSS, ie && ie_version < 9 && display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos), null != te.selectionStart)) {
                (!ie || ie && ie_version < 9) && prepareSelectAllHack();
                var i = 0, poll = function() {
                    display.selForContextMenu == cm.doc.sel && 0 == te.selectionStart && te.selectionEnd > 0 && "\u200b" == input.prevInput ? operation(cm, selectAll)(cm) : i++ < 10 ? display.detectingSelectAll = setTimeout(poll, 500) : (display.selForContextMenu = null, display.input.reset());
                };
                display.detectingSelectAll = setTimeout(poll, 200);
            }
        }
    }, TextareaInput.prototype.readOnlyChanged = function(val) {
        val || this.reset(), this.textarea.disabled = "nocursor" == val, this.textarea.readOnly = !!val;
    }, TextareaInput.prototype.setUneditable = function() {}, TextareaInput.prototype.needsContentAttribute = !1, // EDITOR CONSTRUCTOR
    function(CodeMirror) {
        var optionHandlers = CodeMirror.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
            CodeMirror.defaults[name] = deflt, handle && (optionHandlers[name] = notOnInit ? function(cm, val, old) {
                old != Init && handle(cm, val, old);
            } : handle);
        }
        CodeMirror.defineOption = option, // Passed to option handlers when there is no old value.
        CodeMirror.Init = Init, // These two are, on init, called from the constructor because they
        // have to be initialized before the editor can start at all.
        option("value", "", function(cm, val) {
            return cm.setValue(val);
        }, !0), option("mode", null, function(cm, val) {
            cm.doc.modeOption = val, loadMode(cm);
        }, !0), option("indentUnit", 2, loadMode, !0), option("indentWithTabs", !1), option("smartIndent", !0), option("tabSize", 4, function(cm) {
            resetModeState(cm), clearCaches(cm), regChange(cm);
        }, !0), option("lineSeparator", null, function(cm, val) {
            if (cm.doc.lineSep = val, val) {
                var newBreaks = [], lineNo = cm.doc.first;
                cm.doc.iter(function(line) {
                    for(var pos = 0;;){
                        var found = line.text.indexOf(val, pos);
                        if (-1 == found) break;
                        pos = found + val.length, newBreaks.push(Pos(lineNo, found));
                    }
                    lineNo++;
                });
                for(var i = newBreaks.length - 1; i >= 0; i--)replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length));
            }
        }), option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(cm, val, old) {
            cm.state.specialChars = RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g"), old != Init && cm.refresh();
        }), option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {
            return cm.refresh();
        }, !0), option("electricChars", !0), option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
            throw Error("inputStyle can not (yet) be changed in a running editor"); // FIXME
        }, !0), option("spellcheck", !1, function(cm, val) {
            return cm.getInputField().spellcheck = val;
        }, !0), option("autocorrect", !1, function(cm, val) {
            return cm.getInputField().autocorrect = val;
        }, !0), option("autocapitalize", !1, function(cm, val) {
            return cm.getInputField().autocapitalize = val;
        }, !0), option("rtlMoveVisually", !windows), option("wholeLineUpdateBefore", !0), option("theme", "default", function(cm) {
            themeChanged(cm), updateGutters(cm);
        }, !0), option("keyMap", "default", function(cm, val, old) {
            var next = getKeyMap(val), prev = old != Init && getKeyMap(old);
            prev && prev.detach && prev.detach(cm, next), next.attach && next.attach(cm, prev || null);
        }), option("extraKeys", null), option("configureMouse", null), option("lineWrapping", !1, wrappingChanged, !0), option("gutters", [], function(cm, val) {
            cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers), updateGutters(cm);
        }, !0), option("fixedGutter", !0, function(cm, val) {
            cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0", cm.refresh();
        }, !0), option("coverGutterNextToScrollbar", !1, function(cm) {
            return updateScrollbars(cm);
        }, !0), option("scrollbarStyle", "native", function(cm) {
            initScrollbars(cm), updateScrollbars(cm), cm.display.scrollbars.setScrollTop(cm.doc.scrollTop), cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, !0), option("lineNumbers", !1, function(cm, val) {
            cm.display.gutterSpecs = getGutters(cm.options.gutters, val), updateGutters(cm);
        }, !0), option("firstLineNumber", 1, updateGutters, !0), option("lineNumberFormatter", function(integer) {
            return integer;
        }, updateGutters, !0), option("showCursorWhenSelecting", !1, updateSelection, !0), option("resetSelectionOnContextMenu", !0), option("lineWiseCopyCut", !0), option("pasteLinesPerSelection", !0), option("selectionsMayTouch", !1), option("readOnly", !1, function(cm, val) {
            "nocursor" == val && (onBlur(cm), cm.display.input.blur()), cm.display.input.readOnlyChanged(val);
        }), option("screenReaderLabel", null, function(cm, val) {
            val = "" === val ? null : val, cm.display.input.screenReaderLabelChanged(val);
        }), option("disableInput", !1, function(cm, val) {
            val || cm.display.input.reset();
        }, !0), option("dragDrop", !0, dragDropChanged), option("allowDropFileTypes", null), option("cursorBlinkRate", 530), option("cursorScrollMargin", 0), option("cursorHeight", 1, updateSelection, !0), option("singleCursorHeightPerLine", !0, updateSelection, !0), option("workTime", 100), option("workDelay", 100), option("flattenSpans", !0, resetModeState, !0), option("addModeClass", !1, resetModeState, !0), option("pollInterval", 100), option("undoDepth", 200, function(cm, val) {
            return cm.doc.history.undoDepth = val;
        }), option("historyEventDelay", 1250), option("viewportMargin", 10, function(cm) {
            return cm.refresh();
        }, !0), option("maxHighlightLength", 10000, resetModeState, !0), option("moveInputWithCursor", !0, function(cm, val) {
            val || cm.display.input.resetPosition();
        }), option("tabindex", null, function(cm, val) {
            return cm.display.input.getField().tabIndex = val || "";
        }), option("autofocus", null), option("direction", "ltr", function(cm, val) {
            return cm.doc.setDirection(val);
        }, !0), option("phrases", null);
    }(CodeMirror), optionHandlers = CodeMirror.optionHandlers, helpers = CodeMirror.helpers = {}, CodeMirror.prototype = {
        constructor: CodeMirror,
        focus: function() {
            window.focus(), this.display.input.focus();
        },
        setOption: function(option, value) {
            var options = this.options, old = options[option];
            (options[option] != value || "mode" == option) && (options[option] = value, optionHandlers.hasOwnProperty(option) && operation(this, optionHandlers[option])(this, value, old), signal(this, "optionChange", this, option));
        },
        getOption: function(option) {
            return this.options[option];
        },
        getDoc: function() {
            return this.doc;
        },
        addKeyMap: function(map, bottom) {
            this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
        },
        removeKeyMap: function(map) {
            for(var maps = this.state.keyMaps, i = 0; i < maps.length; ++i)if (maps[i] == map || maps[i].name == map) return maps.splice(i, 1), !0;
        },
        addOverlay: methodOp(function(spec, options) {
            var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
            if (mode.startState) throw Error("Overlays may not be stateful.");
            (function(array, value, score) {
                for(var pos = 0, priority = score(value); pos < array.length && score(array[pos]) <= priority;)pos++;
                array.splice(pos, 0, value);
            })(this.state.overlays, {
                mode: mode,
                modeSpec: spec,
                opaque: options && options.opaque,
                priority: options && options.priority || 0
            }, function(overlay) {
                return overlay.priority;
            }), this.state.modeGen++, regChange(this);
        }),
        removeOverlay: methodOp(function(spec) {
            for(var overlays = this.state.overlays, i = 0; i < overlays.length; ++i){
                var cur = overlays[i].modeSpec;
                if (cur == spec || "string" == typeof spec && cur.name == spec) {
                    overlays.splice(i, 1), this.state.modeGen++, regChange(this);
                    return;
                }
            }
        }),
        indentLine: methodOp(function(n, dir, aggressive) {
            "string" != typeof dir && "number" != typeof dir && (dir = null == dir ? this.options.smartIndent ? "smart" : "prev" : dir ? "add" : "subtract"), isLine(this.doc, n) && indentLine(this, n, dir, aggressive);
        }),
        indentSelection: methodOp(function(how) {
            for(var ranges = this.doc.sel.ranges, end = -1, i = 0; i < ranges.length; i++){
                var range = ranges[i];
                if (range.empty()) range.head.line > end && (indentLine(this, range.head.line, how, !0), end = range.head.line, i == this.doc.sel.primIndex && ensureCursorVisible(this));
                else {
                    var from = range.from(), to = range.to(), start = Math.max(end, from.line);
                    end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                    for(var j = start; j < end; ++j)indentLine(this, j, how);
                    var newRanges = this.doc.sel.ranges;
                    0 == from.ch && ranges.length == newRanges.length && newRanges[i].from().ch > 0 && replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
                }
            }
        }),
        // Fetch the parser token for a given character. Useful for hacks
        // that want to inspect the mode state (say, for completion).
        getTokenAt: function(pos, precise) {
            return takeToken(this, pos, precise);
        },
        getLineTokens: function(line, precise) {
            return takeToken(this, Pos(line), precise, !0);
        },
        getTokenTypeAt: function(pos) {
            pos = clipPos(this.doc, pos);
            var type, styles = getLineStyles(this, getLine(this.doc, pos.line)), before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
            if (0 == ch) type = styles[2];
            else for(;;){
                var mid = before + after >> 1;
                if ((mid ? styles[2 * mid - 1] : 0) >= ch) after = mid;
                else if (styles[2 * mid + 1] < ch) before = mid + 1;
                else {
                    type = styles[2 * mid + 2];
                    break;
                }
            }
            var cut = type ? type.indexOf("overlay ") : -1;
            return cut < 0 ? type : 0 == cut ? null : type.slice(0, cut - 1);
        },
        getModeAt: function(pos) {
            var mode = this.doc.mode;
            return mode.innerMode ? CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode : mode;
        },
        getHelper: function(pos, type) {
            return this.getHelpers(pos, type)[0];
        },
        getHelpers: function(pos, type) {
            var found = [];
            if (!helpers.hasOwnProperty(type)) return found;
            var help = helpers[type], mode = this.getModeAt(pos);
            if ("string" == typeof mode[type]) help[mode[type]] && found.push(help[mode[type]]);
            else if (mode[type]) for(var i = 0; i < mode[type].length; i++){
                var val = help[mode[type][i]];
                val && found.push(val);
            }
            else mode.helperType && help[mode.helperType] ? found.push(help[mode.helperType]) : help[mode.name] && found.push(help[mode.name]);
            for(var i$1 = 0; i$1 < help._global.length; i$1++){
                var cur = help._global[i$1];
                cur.pred(mode, this) && -1 == indexOf(found, cur.val) && found.push(cur.val);
            }
            return found;
        },
        getStateAfter: function(line, precise) {
            var doc = this.doc;
            return getContextBefore(this, (line = clipLine(doc, null == line ? doc.first + doc.size - 1 : line)) + 1, precise).state;
        },
        cursorCoords: function(start, mode) {
            var range = this.doc.sel.primary();
            return cursorCoords(this, null == start ? range.head : "object" == typeof start ? clipPos(this.doc, start) : start ? range.from() : range.to(), mode || "page");
        },
        charCoords: function(pos, mode) {
            return charCoords(this, clipPos(this.doc, pos), mode || "page");
        },
        coordsChar: function(coords, mode) {
            return coordsChar(this, (coords = fromCoordSystem(this, coords, mode || "page")).left, coords.top);
        },
        lineAtHeight: function(height, mode) {
            return height = fromCoordSystem(this, {
                top: height,
                left: 0
            }, mode || "page").top, lineAtHeight(this.doc, height + this.display.viewOffset);
        },
        heightAtLine: function(line, mode, includeWidgets) {
            var lineObj, end = !1;
            if ("number" == typeof line) {
                var last = this.doc.first + this.doc.size - 1;
                line < this.doc.first ? line = this.doc.first : line > last && (line = last, end = !0), lineObj = getLine(this.doc, line);
            } else lineObj = line;
            return intoCoordSystem(this, lineObj, {
                top: 0,
                left: 0
            }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
        },
        defaultTextHeight: function() {
            return textHeight(this.display);
        },
        defaultCharWidth: function() {
            return charWidth(this.display);
        },
        getViewport: function() {
            return {
                from: this.display.viewFrom,
                to: this.display.viewTo
            };
        },
        addWidget: function(pos, node, scroll, vert, horiz) {
            var scrollPos, display = this.display, top = (pos = cursorCoords(this, clipPos(this.doc, pos))).bottom, left = pos.left;
            if (node.style.position = "absolute", node.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(node), display.sizer.appendChild(node), "over" == vert) top = pos.top;
            else if ("above" == vert || "near" == vert) {
                var vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                ("above" == vert || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight ? top = pos.top - node.offsetHeight : pos.bottom + node.offsetHeight <= vspace && (top = pos.bottom), left + node.offsetWidth > hspace && (left = hspace - node.offsetWidth);
            }
            node.style.top = top + "px", node.style.left = node.style.right = "", "right" == horiz ? (left = display.sizer.clientWidth - node.offsetWidth, node.style.right = "0px") : ("left" == horiz ? left = 0 : "middle" == horiz && (left = (display.sizer.clientWidth - node.offsetWidth) / 2), node.style.left = left + "px"), scroll && (null != (scrollPos = calculateScrollPos(this, {
                left: left,
                top: top,
                right: left + node.offsetWidth,
                bottom: top + node.offsetHeight
            })).scrollTop && updateScrollTop(this, scrollPos.scrollTop), null != scrollPos.scrollLeft && setScrollLeft(this, scrollPos.scrollLeft));
        },
        triggerOnKeyDown: methodOp(onKeyDown),
        triggerOnKeyPress: methodOp(onKeyPress),
        triggerOnKeyUp: onKeyUp,
        triggerOnMouseDown: methodOp(onMouseDown),
        execCommand: function(cmd) {
            if (commands.hasOwnProperty(cmd)) return commands[cmd].call(null, this);
        },
        triggerElectric: methodOp(function(text) {
            triggerElectric(this, text);
        }),
        findPosH: function(from, amount, unit, visually) {
            var dir = 1;
            amount < 0 && (dir = -1, amount = -amount);
            for(var cur = clipPos(this.doc, from), i = 0; i < amount && !(cur = findPosH(this.doc, cur, dir, unit, visually)).hitSide; ++i);
            return cur;
        },
        moveH: methodOp(function(dir, unit) {
            var this$1 = this;
            this.extendSelectionsBy(function(range) {
                return this$1.display.shift || this$1.doc.extend || range.empty() ? findPosH(this$1.doc, range.head, dir, unit, this$1.options.rtlMoveVisually) : dir < 0 ? range.from() : range.to();
            }, sel_move);
        }),
        deleteH: methodOp(function(dir, unit) {
            var sel = this.doc.sel, doc = this.doc;
            sel.somethingSelected() ? doc.replaceSelection("", null, "+delete") : deleteNearSelection(this, function(range) {
                var other = findPosH(doc, range.head, dir, unit, !1);
                return dir < 0 ? {
                    from: other,
                    to: range.head
                } : {
                    from: range.head,
                    to: other
                };
            });
        }),
        findPosV: function(from, amount, unit, goalColumn) {
            var dir = 1, x = goalColumn;
            amount < 0 && (dir = -1, amount = -amount);
            for(var cur = clipPos(this.doc, from), i = 0; i < amount; ++i){
                var coords = cursorCoords(this, cur, "div");
                if (null == x ? x = coords.left : coords.left = x, (cur = findPosV(this, coords, dir, unit)).hitSide) break;
            }
            return cur;
        },
        moveV: methodOp(function(dir, unit) {
            var this$1 = this, doc = this.doc, goals = [], collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
            if (doc.extendSelectionsBy(function(range) {
                if (collapse) return dir < 0 ? range.from() : range.to();
                var headPos = cursorCoords(this$1, range.head, "div");
                null != range.goalColumn && (headPos.left = range.goalColumn), goals.push(headPos.left);
                var pos = findPosV(this$1, headPos, dir, unit);
                return "page" == unit && range == doc.sel.primary() && addToScrollTop(this$1, charCoords(this$1, pos, "div").top - headPos.top), pos;
            }, sel_move), goals.length) for(var i = 0; i < doc.sel.ranges.length; i++)doc.sel.ranges[i].goalColumn = goals[i];
        }),
        // Find the word at the given position (as returned by coordsChar).
        findWordAt: function(pos) {
            var line = getLine(this.doc, pos.line).text, start = pos.ch, end = pos.ch;
            if (line) {
                var helper = this.getHelper(pos, "wordChars");
                ("before" == pos.sticky || end == line.length) && start ? --start : ++end;
                for(var startChar = line.charAt(start), check = isWordChar(startChar, helper) ? function(ch) {
                    return isWordChar(ch, helper);
                } : /\s/.test(startChar) ? function(ch) {
                    return /\s/.test(ch);
                } : function(ch) {
                    return !/\s/.test(ch) && !isWordChar(ch);
                }; start > 0 && check(line.charAt(start - 1));)--start;
                for(; end < line.length && check(line.charAt(end));)++end;
            }
            return new Range(Pos(pos.line, start), Pos(pos.line, end));
        },
        toggleOverwrite: function(value) {
            (null == value || value != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? addClass(this.display.cursorDiv, "CodeMirror-overwrite") : rmClass(this.display.cursorDiv, "CodeMirror-overwrite"), signal(this, "overwriteToggle", this, this.state.overwrite));
        },
        hasFocus: function() {
            return this.display.input.getField() == activeElt();
        },
        isReadOnly: function() {
            return !!(this.options.readOnly || this.doc.cantEdit);
        },
        scrollTo: methodOp(function(x, y) {
            scrollToCoords(this, x, y);
        }),
        getScrollInfo: function() {
            var scroller = this.display.scroller;
            return {
                left: scroller.scrollLeft,
                top: scroller.scrollTop,
                height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
                width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
                clientHeight: displayHeight(this),
                clientWidth: displayWidth(this)
            };
        },
        scrollIntoView: methodOp(function(range, margin) {
            if (null == range ? (range = {
                from: this.doc.sel.primary().head,
                to: null
            }, null == margin && (margin = this.options.cursorScrollMargin)) : "number" == typeof range ? range = {
                from: Pos(range, 0),
                to: null
            } : null == range.from && (range = {
                from: range,
                to: null
            }), range.to || (range.to = range.from), range.margin = margin || 0, null != range.from.line) {
                var range1;
                range1 = range, resolveScrollToPos(this), this.curOp.scrollToPos = range1;
            } else scrollToCoordsRange(this, range.from, range.to, range.margin);
        }),
        setSize: methodOp(function(width, height) {
            var this$1 = this, interpret = function(val) {
                return "number" == typeof val || /^\d+$/.test(String(val)) ? val + "px" : val;
            };
            null != width && (this.display.wrapper.style.width = interpret(width)), null != height && (this.display.wrapper.style.height = interpret(height)), this.options.lineWrapping && clearLineMeasurementCache(this);
            var lineNo = this.display.viewFrom;
            this.doc.iter(lineNo, this.display.viewTo, function(line) {
                if (line.widgets) {
                    for(var i = 0; i < line.widgets.length; i++)if (line.widgets[i].noHScroll) {
                        regLineChange(this$1, lineNo, "widget");
                        break;
                    }
                }
                ++lineNo;
            }), this.curOp.forceUpdate = !0, signal(this, "refresh", this);
        }),
        operation: function(f) {
            return runInOp(this, f);
        },
        startOperation: function() {
            return startOperation(this);
        },
        endOperation: function() {
            return endOperation(this);
        },
        refresh: methodOp(function() {
            var oldHeight = this.display.cachedTextHeight;
            regChange(this), this.curOp.forceUpdate = !0, clearCaches(this), scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop), updateGutterSpace(this.display), (null == oldHeight || Math.abs(oldHeight - textHeight(this.display)) > 0.5 || this.options.lineWrapping) && estimateLineHeights(this), signal(this, "refresh", this);
        }),
        swapDoc: methodOp(function(doc) {
            var old = this.doc;
            return old.cm = null, this.state.selectingText && this.state.selectingText(), attachDoc(this, doc), clearCaches(this), this.display.input.reset(), scrollToCoords(this, doc.scrollLeft, doc.scrollTop), this.curOp.forceScroll = !0, signalLater(this, "swapDoc", this, old), old;
        }),
        phrase: function(phraseText) {
            var phrases = this.options.phrases;
            return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
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
    }, eventMixin(CodeMirror), CodeMirror.registerHelper = function(type, name, value) {
        helpers.hasOwnProperty(type) || (helpers[type] = CodeMirror[type] = {
            _global: []
        }), helpers[type][name] = value;
    }, CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
        CodeMirror.registerHelper(type, name, value), helpers[type]._global.push({
            pred: predicate,
            val: value
        });
    };
    // Set up methods on CodeMirror's prototype to redirect to the editor's document.
    var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
    for(var prop in Doc.prototype)Doc.prototype.hasOwnProperty(prop) && 0 > indexOf(dontDelegate, prop) && (CodeMirror.prototype[prop] = function(method) {
        return function() {
            return method.apply(this.doc, arguments);
        };
    }(Doc.prototype[prop]));
    return eventMixin(Doc), CodeMirror.inputStyles = {
        textarea: TextareaInput,
        contenteditable: ContentEditableInput
    }, // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    CodeMirror.defineMode = function(name /*, mode, …*/ ) {
        CodeMirror.defaults.mode || "null" == name || (CodeMirror.defaults.mode = name), defineMode.apply(this, arguments);
    }, CodeMirror.defineMIME = function(mime, spec) {
        mimeModes[mime] = spec;
    }, // Minimal default mode.
    CodeMirror.defineMode("null", function() {
        return {
            token: function(stream) {
                return stream.skipToEnd();
            }
        };
    }), CodeMirror.defineMIME("text/plain", "null"), // EXTENSIONS
    CodeMirror.defineExtension = function(name, func) {
        CodeMirror.prototype[name] = func;
    }, CodeMirror.defineDocExtension = function(name, func) {
        Doc.prototype[name] = func;
    }, CodeMirror.fromTextArea = function(textarea, options) {
        // Set autofocus to true if this textarea is focused, or if it has
        // autofocus and no other element is focused.
        if ((options = options ? copyObj(options) : {}).value = textarea.value, !options.tabindex && textarea.tabIndex && (options.tabindex = textarea.tabIndex), !options.placeholder && textarea.placeholder && (options.placeholder = textarea.placeholder), null == options.autofocus) {
            var realSubmit, hasFocus = activeElt();
            options.autofocus = hasFocus == textarea || null != textarea.getAttribute("autofocus") && hasFocus == document.body;
        }
        function save() {
            textarea.value = cm.getValue();
        }
        if (textarea.form && (on(textarea.form, "submit", save), !options.leaveSubmitMethodAlone)) {
            var form = textarea.form;
            realSubmit = form.submit;
            try {
                var wrappedSubmit = form.submit = function() {
                    save(), form.submit = realSubmit, form.submit(), form.submit = wrappedSubmit;
                };
            } catch (e) {}
        }
        options.finishInit = function(cm) {
            cm.save = save, cm.getTextArea = function() {
                return textarea;
            }, cm.toTextArea = function() {
                cm.toTextArea = isNaN, save(), textarea.parentNode.removeChild(cm.getWrapperElement()), textarea.style.display = "", textarea.form && (off(textarea.form, "submit", save), options.leaveSubmitMethodAlone || "function" != typeof textarea.form.submit || (textarea.form.submit = realSubmit));
            };
        }, textarea.style.display = "none";
        var cm = CodeMirror(function(node) {
            return textarea.parentNode.insertBefore(node, textarea.nextSibling);
        }, options);
        return cm;
    }, CodeMirror.off = off, CodeMirror.on = on, CodeMirror.wheelEventPixels = function(e) {
        var delta = wheelEventDelta(e);
        return delta.x *= wheelPixelsPerUnit, delta.y *= wheelPixelsPerUnit, delta;
    }, CodeMirror.Doc = Doc, CodeMirror.splitLines = splitLinesAuto, CodeMirror.countColumn = countColumn, CodeMirror.findColumn = findColumn, CodeMirror.isWordChar = isWordCharBasic, CodeMirror.Pass = Pass, CodeMirror.signal = signal, CodeMirror.Line = Line, CodeMirror.changeEnd = changeEnd, CodeMirror.scrollbarModel = scrollbarModel, CodeMirror.Pos = Pos, CodeMirror.cmpPos = cmp, CodeMirror.modes = modes, CodeMirror.mimeModes = mimeModes, CodeMirror.resolveMode = resolveMode, CodeMirror.getMode = getMode, CodeMirror.modeExtensions = modeExtensions, CodeMirror.extendMode = function(mode, properties) {
        copyObj(properties, modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {});
    }, CodeMirror.copyState = copyState, CodeMirror.startState = startState, CodeMirror.innerMode = innerMode, CodeMirror.commands = commands, CodeMirror.keyMap = keyMap, CodeMirror.keyName = keyName, CodeMirror.isModifierKey = isModifierKey, CodeMirror.lookupKey = lookupKey, CodeMirror.normalizeKeyMap = // This is a kludge to keep keymaps mostly working as raw objects
    // (backwards compatibility) while at the same time support features
    // like normalization and multi-stroke key bindings. It compiles a
    // new normalized keymap, and then updates the old object to reflect
    // this.
    function(keymap) {
        var copy = {};
        for(var keyname in keymap)if (keymap.hasOwnProperty(keyname)) {
            var value = keymap[keyname];
            if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;
            if ("..." == value) {
                delete keymap[keyname];
                continue;
            }
            for(var keys = map(keyname.split(" "), normalizeKeyName), i = 0; i < keys.length; i++){
                var val = void 0, name = void 0;
                i == keys.length - 1 ? (name = keys.join(" "), val = value) : (name = keys.slice(0, i + 1).join(" "), val = "...");
                var prev = copy[name];
                if (prev) {
                    if (prev != val) throw Error("Inconsistent bindings for " + name);
                } else copy[name] = val;
            }
            delete keymap[keyname];
        }
        for(var prop in copy)keymap[prop] = copy[prop];
        return keymap;
    }, CodeMirror.StringStream = StringStream, CodeMirror.SharedTextMarker = SharedTextMarker, CodeMirror.TextMarker = TextMarker, CodeMirror.LineWidget = LineWidget, CodeMirror.e_preventDefault = e_preventDefault, CodeMirror.e_stopPropagation = e_stopPropagation, CodeMirror.e_stop = e_stop, CodeMirror.addClass = addClass, CodeMirror.contains = contains, CodeMirror.rmClass = rmClass, CodeMirror.keyNames = keyNames, CodeMirror.version = "5.65.1", CodeMirror;
});
