(function(a, b) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = b()) : typeof define === "function" && define.amd ? define(b) : (a.moment = b());
})(this, function() {
    "use strict";
    var a;
    function b() {
        return a.apply(null, arguments);
    }
    function c(b) {
        a = b;
    }
    function d(a) {
        return (a instanceof Array || Object.prototype.toString.call(a) === "[object Array]");
    }
    function e(a) {
        return (a != null && Object.prototype.toString.call(a) === "[object Object]");
    }
    function f(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
    function g(a) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(a).length === 0;
        } else {
            var b;
            for(b in a){
                if (f(a, b)) {
                    return false;
                }
            }
            return true;
        }
    }
    function h(a) {
        return a === void 0;
    }
    function i(a) {
        return (typeof a === "number" || Object.prototype.toString.call(a) === "[object Number]");
    }
    function j(a) {
        return (a instanceof Date || Object.prototype.toString.call(a) === "[object Date]");
    }
    function k(a, b) {
        var c = [], d;
        for(d = 0; d < a.length; ++d){
            c.push(b(a[d], d));
        }
        return c;
    }
    function l(a, b) {
        for(var c in b){
            if (f(b, c)) {
                a[c] = b[c];
            }
        }
        if (f(b, "toString")) {
            a.toString = b.toString;
        }
        if (f(b, "valueOf")) {
            a.valueOf = b.valueOf;
        }
        return a;
    }
    function m(a, b, c, d) {
        return cz(a, b, c, d, true).utc();
    }
    function n() {
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false
        };
    }
    function o(a) {
        if (a._pf == null) {
            a._pf = n();
        }
        return a._pf;
    }
    var p;
    if (Array.prototype.some) {
        p = Array.prototype.some;
    } else {
        p = function(a) {
            var b = Object(this), c = b.length >>> 0, d;
            for(d = 0; d < c; d++){
                if (d in b && a.call(this, b[d], d, b)) {
                    return true;
                }
            }
            return false;
        };
    }
    function q(a) {
        if (a._isValid == null) {
            var b = o(a), c = p.call(b.parsedDateParts, function(a) {
                return a != null;
            }), d = !isNaN(a._d.getTime()) && b.overflow < 0 && !b.empty && !b.invalidEra && !b.invalidMonth && !b.invalidWeekday && !b.weekdayMismatch && !b.nullInput && !b.invalidFormat && !b.userInvalidated && (!b.meridiem || (b.meridiem && c));
            if (a._strict) {
                d = d && b.charsLeftOver === 0 && b.unusedTokens.length === 0 && b.bigHour === undefined;
            }
            if (Object.isFrozen == null || !Object.isFrozen(a)) {
                a._isValid = d;
            } else {
                return d;
            }
        }
        return a._isValid;
    }
    function r(a) {
        var b = m(NaN);
        if (a != null) {
            l(o(b), a);
        } else {
            o(b).userInvalidated = true;
        }
        return b;
    }
    var s = (b.momentProperties = []), t = false;
    function u(a, b) {
        var c, d, e;
        if (!h(b._isAMomentObject)) {
            a._isAMomentObject = b._isAMomentObject;
        }
        if (!h(b._i)) {
            a._i = b._i;
        }
        if (!h(b._f)) {
            a._f = b._f;
        }
        if (!h(b._l)) {
            a._l = b._l;
        }
        if (!h(b._strict)) {
            a._strict = b._strict;
        }
        if (!h(b._tzm)) {
            a._tzm = b._tzm;
        }
        if (!h(b._isUTC)) {
            a._isUTC = b._isUTC;
        }
        if (!h(b._offset)) {
            a._offset = b._offset;
        }
        if (!h(b._pf)) {
            a._pf = o(b);
        }
        if (!h(b._locale)) {
            a._locale = b._locale;
        }
        if (s.length > 0) {
            for(c = 0; c < s.length; c++){
                d = s[c];
                e = b[d];
                if (!h(e)) {
                    a[d] = e;
                }
            }
        }
        return a;
    }
    function v(a) {
        u(this, a);
        this._d = new Date(a._d != null ? a._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        if (t === false) {
            t = true;
            b.updateOffset(this);
            t = false;
        }
    }
    function w(a) {
        return (a instanceof v || (a != null && a._isAMomentObject != null));
    }
    function x(a) {
        if (b.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
            console.warn("Deprecation warning: " + a);
        }
    }
    function y(a, c) {
        var d = true;
        return l(function() {
            if (b.deprecationHandler != null) {
                b.deprecationHandler(null, a);
            }
            if (d) {
                var e = [], g, h, i;
                for(h = 0; h < arguments.length; h++){
                    g = "";
                    if (typeof arguments[h] === "object") {
                        g += "\n[" + h + "] ";
                        for(i in arguments[0]){
                            if (f(arguments[0], i)) {
                                g += i + ": " + arguments[0][i] + ", ";
                            }
                        }
                        g = g.slice(0, -2);
                    } else {
                        g = arguments[h];
                    }
                    e.push(g);
                }
                x(a + "\nArguments: " + Array.prototype.slice.call(e).join("") + "\n" + new Error().stack);
                d = false;
            }
            return c.apply(this, arguments);
        }, c);
    }
    var z = {};
    function A(a, c) {
        if (b.deprecationHandler != null) {
            b.deprecationHandler(a, c);
        }
        if (!z[a]) {
            x(c);
            z[a] = true;
        }
    }
    b.suppressDeprecationWarnings = false;
    b.deprecationHandler = null;
    function B(a) {
        return ((typeof Function !== "undefined" && a instanceof Function) || Object.prototype.toString.call(a) === "[object Function]");
    }
    function C(a) {
        var b, c;
        for(c in a){
            if (f(a, c)) {
                b = a[c];
                if (B(b)) {
                    this[c] = b;
                } else {
                    this["_" + c] = b;
                }
            }
        }
        this._config = a;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function D(a, b) {
        var c = l({}, a), d;
        for(d in b){
            if (f(b, d)) {
                if (e(a[d]) && e(b[d])) {
                    c[d] = {};
                    l(c[d], a[d]);
                    l(c[d], b[d]);
                } else if (b[d] != null) {
                    c[d] = b[d];
                } else {
                    delete c[d];
                }
            }
        }
        for(d in a){
            if (f(a, d) && !f(b, d) && e(a[d])) {
                c[d] = l({}, c[d]);
            }
        }
        return c;
    }
    function E(a) {
        if (a != null) {
            this.set(a);
        }
    }
    var F;
    if (Object.keys) {
        F = Object.keys;
    } else {
        F = function(a) {
            var b, c = [];
            for(b in a){
                if (f(a, b)) {
                    c.push(b);
                }
            }
            return c;
        };
    }
    var G = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    function H(a, b, c) {
        var d = this._calendar[a] || this._calendar["sameElse"];
        return B(d) ? d.call(b, c) : d;
    }
    function I(a, b, c) {
        var d = "" + Math.abs(a), e = b - d.length, f = a >= 0;
        return ((f ? (c ? "+" : "") : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + d);
    }
    var J = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, K = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, L = {}, M = {};
    function N(a, b, c, d) {
        var e = d;
        if (typeof d === "string") {
            e = function() {
                return this[d]();
            };
        }
        if (a) {
            M[a] = e;
        }
        if (b) {
            M[b[0]] = function() {
                return I(e.apply(this, arguments), b[1], b[2]);
            };
        }
        if (c) {
            M[c] = function() {
                return this.localeData().ordinal(e.apply(this, arguments), a);
            };
        }
    }
    function O(a) {
        if (a.match(/\[[\s\S]/)) {
            return a.replace(/^\[|\]$/g, "");
        }
        return a.replace(/\\/g, "");
    }
    function P(a) {
        var b = a.match(J), c, d;
        for(c = 0, d = b.length; c < d; c++){
            if (M[b[c]]) {
                b[c] = M[b[c]];
            } else {
                b[c] = O(b[c]);
            }
        }
        return function(c) {
            var e = "", f;
            for(f = 0; f < d; f++){
                e += B(b[f]) ? b[f].call(c, a) : b[f];
            }
            return e;
        };
    }
    function Q(a, b) {
        if (!a.isValid()) {
            return a.localeData().invalidDate();
        }
        b = R(b, a.localeData());
        L[b] = L[b] || P(b);
        return L[b](a);
    }
    function R(a, b) {
        var c = 5;
        function d(a) {
            return b.longDateFormat(a) || a;
        }
        K.lastIndex = 0;
        while(c >= 0 && K.test(a)){
            a = a.replace(K, d);
            K.lastIndex = 0;
            c -= 1;
        }
        return a;
    }
    var S = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function T(a) {
        var b = this._longDateFormat[a], c = this._longDateFormat[a.toUpperCase()];
        if (b || !c) {
            return b;
        }
        this._longDateFormat[a] = c.match(J).map(function(a) {
            if (a === "MMMM" || a === "MM" || a === "DD" || a === "dddd") {
                return a.slice(1);
            }
            return a;
        }).join("");
        return this._longDateFormat[a];
    }
    var U = "Invalid date";
    function V() {
        return this._invalidDate;
    }
    var W = "%d", X = /\d{1,2}/;
    function Y(a) {
        return this._ordinal.replace("%d", a);
    }
    var Z = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    };
    function $(a, b, c, d) {
        var e = this._relativeTime[c];
        return B(e) ? e(a, b, c, d) : e.replace(/%d/i, a);
    }
    function _(a, b) {
        var c = this._relativeTime[a > 0 ? "future" : "past"];
        return B(c) ? c(b) : c.replace(/%s/i, b);
    }
    var aa = {};
    function ab(a, b) {
        var c = a.toLowerCase();
        aa[c] = aa[c + "s"] = aa[b] = a;
    }
    function ac(a) {
        return typeof a === "string" ? aa[a] || aa[a.toLowerCase()] : undefined;
    }
    function ad(a) {
        var b = {}, c, d;
        for(d in a){
            if (f(a, d)) {
                c = ac(d);
                if (c) {
                    b[c] = a[d];
                }
            }
        }
        return b;
    }
    var ae = {};
    function af(a, b) {
        ae[a] = b;
    }
    function ag(a) {
        var b = [], c;
        for(c in a){
            if (f(a, c)) {
                b.push({
                    unit: c,
                    priority: ae[c]
                });
            }
        }
        b.sort(function(a, b) {
            return a.priority - b.priority;
        });
        return b;
    }
    function ah(a) {
        return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
    }
    function ai(a) {
        if (a < 0) {
            return Math.ceil(a) || 0;
        } else {
            return Math.floor(a);
        }
    }
    function aj(a) {
        var b = +a, c = 0;
        if (b !== 0 && isFinite(b)) {
            c = ai(b);
        }
        return c;
    }
    function ak(a, c) {
        return function(d) {
            if (d != null) {
                am(this, a, d);
                b.updateOffset(this, c);
                return this;
            } else {
                return al(this, a);
            }
        };
    }
    function al(a, b) {
        return a.isValid() ? a._d["get" + (a._isUTC ? "UTC" : "") + b]() : NaN;
    }
    function am(a, b, c) {
        if (a.isValid() && !isNaN(c)) {
            if (b === "FullYear" && ah(a.year()) && a.month() === 1 && a.date() === 29) {
                c = aj(c);
                a._d["set" + (a._isUTC ? "UTC" : "") + b](c, a.month(), a$(c, a.month()));
            } else {
                a._d["set" + (a._isUTC ? "UTC" : "") + b](c);
            }
        }
    }
    function an(a) {
        a = ac(a);
        if (B(this[a])) {
            return this[a]();
        }
        return this;
    }
    function ao(a, b) {
        if (typeof a === "object") {
            a = ad(a);
            var c = ag(a), d;
            for(d = 0; d < c.length; d++){
                this[c[d].unit](a[c[d].unit]);
            }
        } else {
            a = ac(a);
            if (B(this[a])) {
                return this[a](b);
            }
        }
        return this;
    }
    var ap = /\d/, aq = /\d\d/, ar = /\d{3}/, as = /\d{4}/, at = /[+-]?\d{6}/, au = /\d\d?/, av = /\d\d\d\d?/, aw = /\d\d\d\d\d\d?/, ax = /\d{1,3}/, ay = /\d{1,4}/, az = /[+-]?\d{1,6}/, aA = /\d+/, aB = /[+-]?\d+/, aC = /Z|[+-]\d\d:?\d\d/gi, aD = /Z|[+-]\d\d(?::?\d\d)?/gi, aE = /[+-]?\d+(\.\d{1,3})?/, aF = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, aG;
    aG = {};
    function aH(a, b, c) {
        aG[a] = B(b) ? b : function(a, d) {
            return a && c ? c : b;
        };
    }
    function aI(a, b) {
        if (!f(aG, a)) {
            return new RegExp(aJ(a));
        }
        return aG[a](b._strict, b._locale);
    }
    function aJ(a) {
        return aK(a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e;
        }));
    }
    function aK(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var aL = {};
    function aM(a, b) {
        var c, d = b;
        if (typeof a === "string") {
            a = [
                a
            ];
        }
        if (i(b)) {
            d = function(a, c) {
                c[b] = aj(a);
            };
        }
        for(c = 0; c < a.length; c++){
            aL[a[c]] = d;
        }
    }
    function aN(a, b) {
        aM(a, function(a, c, d, e) {
            d._w = d._w || {};
            b(a, d._w, d, e);
        });
    }
    function aO(a, b, c) {
        if (b != null && f(aL, a)) {
            aL[a](b, c._a, c, a);
        }
    }
    var aP = 0, aQ = 1, aR = 2, aS = 3, aT = 4, aU = 5, aV = 6, aW = 7, aX = 8;
    function aY(a, b) {
        return ((a % b) + b) % b;
    }
    var aZ;
    if (Array.prototype.indexOf) {
        aZ = Array.prototype.indexOf;
    } else {
        aZ = function(a) {
            var b;
            for(b = 0; b < this.length; ++b){
                if (this[b] === a) {
                    return b;
                }
            }
            return -1;
        };
    }
    function a$(a, b) {
        if (isNaN(a) || isNaN(b)) {
            return NaN;
        }
        var c = aY(b, 12);
        a += (b - c) / 12;
        return c === 1 ? ah(a) ? 29 : 28 : 31 - ((c % 7) % 2);
    }
    N("M", [
        "MM",
        2
    ], "Mo", function() {
        return this.month() + 1;
    });
    N("MMM", 0, 0, function(a) {
        return this.localeData().monthsShort(this, a);
    });
    N("MMMM", 0, 0, function(a) {
        return this.localeData().months(this, a);
    });
    ab("month", "M");
    af("month", 8);
    aH("M", au);
    aH("MM", au, aq);
    aH("MMM", function(a, b) {
        return b.monthsShortRegex(a);
    });
    aH("MMMM", function(a, b) {
        return b.monthsRegex(a);
    });
    aM([
        "M",
        "MM"
    ], function(a, b) {
        b[aQ] = aj(a) - 1;
    });
    aM([
        "MMM",
        "MMMM"
    ], function(a, b, c, d) {
        var e = c._locale.monthsParse(a, d, c._strict);
        if (e != null) {
            b[aQ] = e;
        } else {
            o(c).invalidMonth = a;
        }
    });
    var a_ = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), a0 = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), a1 = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, a2 = aF, a3 = aF;
    function a4(a, b) {
        if (!a) {
            return d(this._months) ? this._months : this._months["standalone"];
        }
        return d(this._months) ? this._months[a.month()] : this._months[(this._months.isFormat || a1).test(b) ? "format" : "standalone"][a.month()];
    }
    function a5(a, b) {
        if (!a) {
            return d(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return d(this._monthsShort) ? this._monthsShort[a.month()] : this._monthsShort[a1.test(b) ? "format" : "standalone"][a.month()];
    }
    function a6(a, b, c) {
        var d, e, f, g = a.toLocaleLowerCase();
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for(d = 0; d < 12; ++d){
                f = m([
                    2000,
                    d
                ]);
                this._shortMonthsParse[d] = this.monthsShort(f, "").toLocaleLowerCase();
                this._longMonthsParse[d] = this.months(f, "").toLocaleLowerCase();
            }
        }
        if (c) {
            if (b === "MMM") {
                e = aZ.call(this._shortMonthsParse, g);
                return e !== -1 ? e : null;
            } else {
                e = aZ.call(this._longMonthsParse, g);
                return e !== -1 ? e : null;
            }
        } else {
            if (b === "MMM") {
                e = aZ.call(this._shortMonthsParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._longMonthsParse, g);
                return e !== -1 ? e : null;
            } else {
                e = aZ.call(this._longMonthsParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._shortMonthsParse, g);
                return e !== -1 ? e : null;
            }
        }
    }
    function a7(a, b, c) {
        var d, e, f;
        if (this._monthsParseExact) {
            return a6.call(this, a, b, c);
        }
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for(d = 0; d < 12; d++){
            e = m([
                2000,
                d
            ]);
            if (c && !this._longMonthsParse[d]) {
                this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i");
            }
            if (!c && !this._monthsParse[d]) {
                f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, "");
                this._monthsParse[d] = new RegExp(f.replace(".", ""), "i");
            }
            if (c && b === "MMMM" && this._longMonthsParse[d].test(a)) {
                return d;
            } else if (c && b === "MMM" && this._shortMonthsParse[d].test(a)) {
                return d;
            } else if (!c && this._monthsParse[d].test(a)) {
                return d;
            }
        }
    }
    function a8(a, b) {
        var c;
        if (!a.isValid()) {
            return a;
        }
        if (typeof b === "string") {
            if (/^\d+$/.test(b)) {
                b = aj(b);
            } else {
                b = a.localeData().monthsParse(b);
                if (!i(b)) {
                    return a;
                }
            }
        }
        c = Math.min(a.date(), a$(a.year(), b));
        a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c);
        return a;
    }
    function a9(a) {
        if (a != null) {
            a8(this, a);
            b.updateOffset(this, true);
            return this;
        } else {
            return al(this, "Month");
        }
    }
    function ba() {
        return a$(this.year(), this.month());
    }
    function bb(a) {
        if (this._monthsParseExact) {
            if (!f(this, "_monthsRegex")) {
                bd.call(this);
            }
            if (a) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!f(this, "_monthsShortRegex")) {
                this._monthsShortRegex = a2;
            }
            return this._monthsShortStrictRegex && a ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }
    function bc(a) {
        if (this._monthsParseExact) {
            if (!f(this, "_monthsRegex")) {
                bd.call(this);
            }
            if (a) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!f(this, "_monthsRegex")) {
                this._monthsRegex = a3;
            }
            return this._monthsStrictRegex && a ? this._monthsStrictRegex : this._monthsRegex;
        }
    }
    function bd() {
        function a(a, b) {
            return b.length - a.length;
        }
        var b = [], c = [], d = [], e, f;
        for(e = 0; e < 12; e++){
            f = m([
                2000,
                e
            ]);
            b.push(this.monthsShort(f, ""));
            c.push(this.months(f, ""));
            d.push(this.months(f, ""));
            d.push(this.monthsShort(f, ""));
        }
        b.sort(a);
        c.sort(a);
        d.sort(a);
        for(e = 0; e < 12; e++){
            b[e] = aK(b[e]);
            c[e] = aK(c[e]);
        }
        for(e = 0; e < 24; e++){
            d[e] = aK(d[e]);
        }
        this._monthsRegex = new RegExp("^(" + d.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + c.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + b.join("|") + ")", "i");
    }
    N("Y", 0, 0, function() {
        var a = this.year();
        return a <= 9999 ? I(a, 4) : "+" + a;
    });
    N(0, [
        "YY",
        2
    ], 0, function() {
        return this.year() % 100;
    });
    N(0, [
        "YYYY",
        4
    ], 0, "year");
    N(0, [
        "YYYYY",
        5
    ], 0, "year");
    N(0, [
        "YYYYYY",
        6,
        true
    ], 0, "year");
    ab("year", "y");
    af("year", 1);
    aH("Y", aB);
    aH("YY", au, aq);
    aH("YYYY", ay, as);
    aH("YYYYY", az, at);
    aH("YYYYYY", az, at);
    aM([
        "YYYYY",
        "YYYYYY"
    ], aP);
    aM("YYYY", function(a, c) {
        c[aP] = a.length === 2 ? b.parseTwoDigitYear(a) : aj(a);
    });
    aM("YY", function(a, c) {
        c[aP] = b.parseTwoDigitYear(a);
    });
    aM("Y", function(a, b) {
        b[aP] = parseInt(a, 10);
    });
    function be(a) {
        return ah(a) ? 366 : 365;
    }
    b.parseTwoDigitYear = function(a) {
        return aj(a) + (aj(a) > 68 ? 1900 : 2000);
    };
    var bf = ak("FullYear", true);
    function bg() {
        return ah(this.year());
    }
    function bh(a, b, c, d, e, f, g) {
        var h;
        if (a < 100 && a >= 0) {
            h = new Date(a + 400, b, c, d, e, f, g);
            if (isFinite(h.getFullYear())) {
                h.setFullYear(a);
            }
        } else {
            h = new Date(a, b, c, d, e, f, g);
        }
        return h;
    }
    function bi(a) {
        var b, c;
        if (a < 100 && a >= 0) {
            c = Array.prototype.slice.call(arguments);
            c[0] = a + 400;
            b = new Date(Date.UTC.apply(null, c));
            if (isFinite(b.getUTCFullYear())) {
                b.setUTCFullYear(a);
            }
        } else {
            b = new Date(Date.UTC.apply(null, arguments));
        }
        return b;
    }
    function bj(a, b, c) {
        var d = 7 + b - c, e = (7 + bi(a, 0, d).getUTCDay() - b) % 7;
        return -e + d - 1;
    }
    function bk(a, b, c, d, e) {
        var f = (7 + c - d) % 7, g = bj(a, d, e), h = 1 + 7 * (b - 1) + f + g, i, j;
        if (h <= 0) {
            i = a - 1;
            j = be(i) + h;
        } else if (h > be(a)) {
            i = a + 1;
            j = h - be(a);
        } else {
            i = a;
            j = h;
        }
        return {
            year: i,
            dayOfYear: j
        };
    }
    function bl(a, b, c) {
        var d = bj(a.year(), b, c), e = Math.floor((a.dayOfYear() - d - 1) / 7) + 1, f, g;
        if (e < 1) {
            g = a.year() - 1;
            f = e + bm(g, b, c);
        } else if (e > bm(a.year(), b, c)) {
            f = e - bm(a.year(), b, c);
            g = a.year() + 1;
        } else {
            g = a.year();
            f = e;
        }
        return {
            week: f,
            year: g
        };
    }
    function bm(a, b, c) {
        var d = bj(a, b, c), e = bj(a + 1, b, c);
        return (be(a) - d + e) / 7;
    }
    N("w", [
        "ww",
        2
    ], "wo", "week");
    N("W", [
        "WW",
        2
    ], "Wo", "isoWeek");
    ab("week", "w");
    ab("isoWeek", "W");
    af("week", 5);
    af("isoWeek", 5);
    aH("w", au);
    aH("ww", au, aq);
    aH("W", au);
    aH("WW", au, aq);
    aN([
        "w",
        "ww",
        "W",
        "WW"
    ], function(a, b, c, d) {
        b[d.substr(0, 1)] = aj(a);
    });
    function bn(a) {
        return bl(a, this._week.dow, this._week.doy).week;
    }
    var bo = {
        dow: 0,
        doy: 6
    };
    function bp() {
        return this._week.dow;
    }
    function bq() {
        return this._week.doy;
    }
    function br(a) {
        var b = this.localeData().week(this);
        return a == null ? b : this.add((a - b) * 7, "d");
    }
    function bs(a) {
        var b = bl(this, 1, 4).week;
        return a == null ? b : this.add((a - b) * 7, "d");
    }
    N("d", 0, "do", "day");
    N("dd", 0, 0, function(a) {
        return this.localeData().weekdaysMin(this, a);
    });
    N("ddd", 0, 0, function(a) {
        return this.localeData().weekdaysShort(this, a);
    });
    N("dddd", 0, 0, function(a) {
        return this.localeData().weekdays(this, a);
    });
    N("e", 0, 0, "weekday");
    N("E", 0, 0, "isoWeekday");
    ab("day", "d");
    ab("weekday", "e");
    ab("isoWeekday", "E");
    af("day", 11);
    af("weekday", 11);
    af("isoWeekday", 11);
    aH("d", au);
    aH("e", au);
    aH("E", au);
    aH("dd", function(a, b) {
        return b.weekdaysMinRegex(a);
    });
    aH("ddd", function(a, b) {
        return b.weekdaysShortRegex(a);
    });
    aH("dddd", function(a, b) {
        return b.weekdaysRegex(a);
    });
    aN([
        "dd",
        "ddd",
        "dddd"
    ], function(a, b, c, d) {
        var e = c._locale.weekdaysParse(a, d, c._strict);
        if (e != null) {
            b.d = e;
        } else {
            o(c).invalidWeekday = a;
        }
    });
    aN([
        "d",
        "e",
        "E"
    ], function(a, b, c, d) {
        b[d] = aj(a);
    });
    function bt(a, b) {
        if (typeof a !== "string") {
            return a;
        }
        if (!isNaN(a)) {
            return parseInt(a, 10);
        }
        a = b.weekdaysParse(a);
        if (typeof a === "number") {
            return a;
        }
        return null;
    }
    function bu(a, b) {
        if (typeof a === "string") {
            return b.weekdaysParse(a) % 7 || 7;
        }
        return isNaN(a) ? null : a;
    }
    function bv(a, b) {
        return a.slice(b, 7).concat(a.slice(0, b));
    }
    var bw = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), bx = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), by = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), bz = aF, bA = aF, bB = aF;
    function bC(a, b) {
        var c = d(this._weekdays) ? this._weekdays : this._weekdays[a && a !== true && this._weekdays.isFormat.test(b) ? "format" : "standalone"];
        return a === true ? bv(c, this._week.dow) : a ? c[a.day()] : c;
    }
    function bD(a) {
        return a === true ? bv(this._weekdaysShort, this._week.dow) : a ? this._weekdaysShort[a.day()] : this._weekdaysShort;
    }
    function bE(a) {
        return a === true ? bv(this._weekdaysMin, this._week.dow) : a ? this._weekdaysMin[a.day()] : this._weekdaysMin;
    }
    function bF(a, b, c) {
        var d, e, f, g = a.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];
            for(d = 0; d < 7; ++d){
                f = m([
                    2000,
                    1
                ]).day(d);
                this._minWeekdaysParse[d] = this.weekdaysMin(f, "").toLocaleLowerCase();
                this._shortWeekdaysParse[d] = this.weekdaysShort(f, "").toLocaleLowerCase();
                this._weekdaysParse[d] = this.weekdays(f, "").toLocaleLowerCase();
            }
        }
        if (c) {
            if (b === "dddd") {
                e = aZ.call(this._weekdaysParse, g);
                return e !== -1 ? e : null;
            } else if (b === "ddd") {
                e = aZ.call(this._shortWeekdaysParse, g);
                return e !== -1 ? e : null;
            } else {
                e = aZ.call(this._minWeekdaysParse, g);
                return e !== -1 ? e : null;
            }
        } else {
            if (b === "dddd") {
                e = aZ.call(this._weekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._shortWeekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._minWeekdaysParse, g);
                return e !== -1 ? e : null;
            } else if (b === "ddd") {
                e = aZ.call(this._shortWeekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._weekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._minWeekdaysParse, g);
                return e !== -1 ? e : null;
            } else {
                e = aZ.call(this._minWeekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._weekdaysParse, g);
                if (e !== -1) {
                    return e;
                }
                e = aZ.call(this._shortWeekdaysParse, g);
                return e !== -1 ? e : null;
            }
        }
    }
    function bG(a, b, c) {
        var d, e, f;
        if (this._weekdaysParseExact) {
            return bF.call(this, a, b, c);
        }
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for(d = 0; d < 7; d++){
            e = m([
                2000,
                1
            ]).day(d);
            if (c && !this._fullWeekdaysParse[d]) {
                this._fullWeekdaysParse[d] = new RegExp("^" + this.weekdays(e, "").replace(".", "\\.?") + "$", "i");
                this._shortWeekdaysParse[d] = new RegExp("^" + this.weekdaysShort(e, "").replace(".", "\\.?") + "$", "i");
                this._minWeekdaysParse[d] = new RegExp("^" + this.weekdaysMin(e, "").replace(".", "\\.?") + "$", "i");
            }
            if (!this._weekdaysParse[d]) {
                f = "^" + this.weekdays(e, "") + "|^" + this.weekdaysShort(e, "") + "|^" + this.weekdaysMin(e, "");
                this._weekdaysParse[d] = new RegExp(f.replace(".", ""), "i");
            }
            if (c && b === "dddd" && this._fullWeekdaysParse[d].test(a)) {
                return d;
            } else if (c && b === "ddd" && this._shortWeekdaysParse[d].test(a)) {
                return d;
            } else if (c && b === "dd" && this._minWeekdaysParse[d].test(a)) {
                return d;
            } else if (!c && this._weekdaysParse[d].test(a)) {
                return d;
            }
        }
    }
    function bH(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (a != null) {
            a = bt(a, this.localeData());
            return this.add(a - b, "d");
        } else {
            return b;
        }
    }
    function bI(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return a == null ? b : this.add(a - b, "d");
    }
    function bJ(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        if (a != null) {
            var b = bu(a, this.localeData());
            return this.day(this.day() % 7 ? b : b - 7);
        } else {
            return this.day() || 7;
        }
    }
    function bK(a) {
        if (this._weekdaysParseExact) {
            if (!f(this, "_weekdaysRegex")) {
                bN.call(this);
            }
            if (a) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!f(this, "_weekdaysRegex")) {
                this._weekdaysRegex = bz;
            }
            return this._weekdaysStrictRegex && a ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }
    function bL(a) {
        if (this._weekdaysParseExact) {
            if (!f(this, "_weekdaysRegex")) {
                bN.call(this);
            }
            if (a) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!f(this, "_weekdaysShortRegex")) {
                this._weekdaysShortRegex = bA;
            }
            return this._weekdaysShortStrictRegex && a ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }
    function bM(a) {
        if (this._weekdaysParseExact) {
            if (!f(this, "_weekdaysRegex")) {
                bN.call(this);
            }
            if (a) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!f(this, "_weekdaysMinRegex")) {
                this._weekdaysMinRegex = bB;
            }
            return this._weekdaysMinStrictRegex && a ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }
    function bN() {
        function a(a, b) {
            return b.length - a.length;
        }
        var b = [], c = [], d = [], e = [], f, g, h, i, j;
        for(f = 0; f < 7; f++){
            g = m([
                2000,
                1
            ]).day(f);
            h = aK(this.weekdaysMin(g, ""));
            i = aK(this.weekdaysShort(g, ""));
            j = aK(this.weekdays(g, ""));
            b.push(h);
            c.push(i);
            d.push(j);
            e.push(h);
            e.push(i);
            e.push(j);
        }
        b.sort(a);
        c.sort(a);
        d.sort(a);
        e.sort(a);
        this._weekdaysRegex = new RegExp("^(" + e.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + d.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + c.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + b.join("|") + ")", "i");
    }
    function bO() {
        return this.hours() % 12 || 12;
    }
    function bP() {
        return this.hours() || 24;
    }
    N("H", [
        "HH",
        2
    ], 0, "hour");
    N("h", [
        "hh",
        2
    ], 0, bO);
    N("k", [
        "kk",
        2
    ], 0, bP);
    N("hmm", 0, 0, function() {
        return "" + bO.apply(this) + I(this.minutes(), 2);
    });
    N("hmmss", 0, 0, function() {
        return ("" + bO.apply(this) + I(this.minutes(), 2) + I(this.seconds(), 2));
    });
    N("Hmm", 0, 0, function() {
        return "" + this.hours() + I(this.minutes(), 2);
    });
    N("Hmmss", 0, 0, function() {
        return ("" + this.hours() + I(this.minutes(), 2) + I(this.seconds(), 2));
    });
    function bQ(a, b) {
        N(a, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), b);
        });
    }
    bQ("a", true);
    bQ("A", false);
    ab("hour", "h");
    af("hour", 13);
    function bR(a, b) {
        return b._meridiemParse;
    }
    aH("a", bR);
    aH("A", bR);
    aH("H", au);
    aH("h", au);
    aH("k", au);
    aH("HH", au, aq);
    aH("hh", au, aq);
    aH("kk", au, aq);
    aH("hmm", av);
    aH("hmmss", aw);
    aH("Hmm", av);
    aH("Hmmss", aw);
    aM([
        "H",
        "HH"
    ], aS);
    aM([
        "k",
        "kk"
    ], function(a, b, c) {
        var d = aj(a);
        b[aS] = d === 24 ? 0 : d;
    });
    aM([
        "a",
        "A"
    ], function(a, b, c) {
        c._isPm = c._locale.isPM(a);
        c._meridiem = a;
    });
    aM([
        "h",
        "hh"
    ], function(a, b, c) {
        b[aS] = aj(a);
        o(c).bigHour = true;
    });
    aM("hmm", function(a, b, c) {
        var d = a.length - 2;
        b[aS] = aj(a.substr(0, d));
        b[aT] = aj(a.substr(d));
        o(c).bigHour = true;
    });
    aM("hmmss", function(a, b, c) {
        var d = a.length - 4, e = a.length - 2;
        b[aS] = aj(a.substr(0, d));
        b[aT] = aj(a.substr(d, 2));
        b[aU] = aj(a.substr(e));
        o(c).bigHour = true;
    });
    aM("Hmm", function(a, b, c) {
        var d = a.length - 2;
        b[aS] = aj(a.substr(0, d));
        b[aT] = aj(a.substr(d));
    });
    aM("Hmmss", function(a, b, c) {
        var d = a.length - 4, e = a.length - 2;
        b[aS] = aj(a.substr(0, d));
        b[aT] = aj(a.substr(d, 2));
        b[aU] = aj(a.substr(e));
    });
    function bS(a) {
        return (a + "").toLowerCase().charAt(0) === "p";
    }
    var bT = /[ap]\.?m?\.?/i, bU = ak("Hours", true);
    function bV(a, b, c) {
        if (a > 11) {
            return c ? "pm" : "PM";
        } else {
            return c ? "am" : "AM";
        }
    }
    var bW = {
        calendar: G,
        longDateFormat: S,
        invalidDate: U,
        ordinal: W,
        dayOfMonthOrdinalParse: X,
        relativeTime: Z,
        months: a_,
        monthsShort: a0,
        week: bo,
        weekdays: bw,
        weekdaysMin: by,
        weekdaysShort: bx,
        meridiemParse: bT
    };
    var bX = {}, bY = {}, bZ;
    function b$(a, b) {
        var c, d = Math.min(a.length, b.length);
        for(c = 0; c < d; c += 1){
            if (a[c] !== b[c]) {
                return c;
            }
        }
        return d;
    }
    function b_(a) {
        return a ? a.toLowerCase().replace("_", "-") : a;
    }
    function b0(a) {
        var b = 0, c, d, e, f;
        while(b < a.length){
            f = b_(a[b]).split("-");
            c = f.length;
            d = b_(a[b + 1]);
            d = d ? d.split("-") : null;
            while(c > 0){
                e = b1(f.slice(0, c).join("-"));
                if (e) {
                    return e;
                }
                if (d && d.length >= c && b$(f, d) >= c - 1) {
                    break;
                }
                c--;
            }
            b++;
        }
        return bZ;
    }
    function b1(a) {
        var b = null, c;
        if (bX[a] === undefined && typeof module !== "undefined" && module && module.exports) {
            try {
                b = bZ._abbr;
                c = require;
                c("./locale/" + a);
                b2(b);
            } catch (d) {
                bX[a] = null;
            }
        }
        return bX[a];
    }
    function b2(a, b) {
        var c;
        if (a) {
            if (h(b)) {
                c = b5(a);
            } else {
                c = b3(a, b);
            }
            if (c) {
                bZ = c;
            } else {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Locale " + a + " not found. Did you forget to load it?");
                }
            }
        }
        return bZ._abbr;
    }
    function b3(a, b) {
        if (b !== null) {
            var c, d = bW;
            b.abbr = a;
            if (bX[a] != null) {
                A("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change " + "an existing locale. moment.defineLocale(localeName, " + "config) should only be used for creating a new locale " + "See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
                d = bX[a]._config;
            } else if (b.parentLocale != null) {
                if (bX[b.parentLocale] != null) {
                    d = bX[b.parentLocale]._config;
                } else {
                    c = b1(b.parentLocale);
                    if (c != null) {
                        d = c._config;
                    } else {
                        if (!bY[b.parentLocale]) {
                            bY[b.parentLocale] = [];
                        }
                        bY[b.parentLocale].push({
                            name: a,
                            config: b
                        });
                        return null;
                    }
                }
            }
            bX[a] = new E(D(d, b));
            if (bY[a]) {
                bY[a].forEach(function(a) {
                    b3(a.name, a.config);
                });
            }
            b2(a);
            return bX[a];
        } else {
            delete bX[a];
            return null;
        }
    }
    function b4(a, b) {
        if (b != null) {
            var c, d, e = bW;
            if (bX[a] != null && bX[a].parentLocale != null) {
                bX[a].set(D(bX[a]._config, b));
            } else {
                d = b1(a);
                if (d != null) {
                    e = d._config;
                }
                b = D(e, b);
                if (d == null) {
                    b.abbr = a;
                }
                c = new E(b);
                c.parentLocale = bX[a];
                bX[a] = c;
            }
            b2(a);
        } else {
            if (bX[a] != null) {
                if (bX[a].parentLocale != null) {
                    bX[a] = bX[a].parentLocale;
                    if (a === b2()) {
                        b2(a);
                    }
                } else if (bX[a] != null) {
                    delete bX[a];
                }
            }
        }
        return bX[a];
    }
    function b5(a) {
        var b;
        if (a && a._locale && a._locale._abbr) {
            a = a._locale._abbr;
        }
        if (!a) {
            return bZ;
        }
        if (!d(a)) {
            b = b1(a);
            if (b) {
                return b;
            }
            a = [
                a
            ];
        }
        return b0(a);
    }
    function b6() {
        return F(bX);
    }
    function b7(a) {
        var b, c = a._a;
        if (c && o(a).overflow === -2) {
            b = c[aQ] < 0 || c[aQ] > 11 ? aQ : c[aR] < 1 || c[aR] > a$(c[aP], c[aQ]) ? aR : c[aS] < 0 || c[aS] > 24 || (c[aS] === 24 && (c[aT] !== 0 || c[aU] !== 0 || c[aV] !== 0)) ? aS : c[aT] < 0 || c[aT] > 59 ? aT : c[aU] < 0 || c[aU] > 59 ? aU : c[aV] < 0 || c[aV] > 999 ? aV : -1;
            if (o(a)._overflowDayOfYear && (b < aP || b > aR)) {
                b = aR;
            }
            if (o(a)._overflowWeeks && b === -1) {
                b = aW;
            }
            if (o(a)._overflowWeekday && b === -1) {
                b = aX;
            }
            o(a).overflow = b;
        }
        return a;
    }
    var b8 = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, b9 = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ca = /Z|[+-]\d\d(?::?\d\d)?/, cb = [
        [
            "YYYYYY-MM-DD",
            /[+-]\d{6}-\d\d-\d\d/
        ],
        [
            "YYYY-MM-DD",
            /\d{4}-\d\d-\d\d/
        ],
        [
            "GGGG-[W]WW-E",
            /\d{4}-W\d\d-\d/
        ],
        [
            "GGGG-[W]WW",
            /\d{4}-W\d\d/,
            false
        ],
        [
            "YYYY-DDD",
            /\d{4}-\d{3}/
        ],
        [
            "YYYY-MM",
            /\d{4}-\d\d/,
            false
        ],
        [
            "YYYYYYMMDD",
            /[+-]\d{10}/
        ],
        [
            "YYYYMMDD",
            /\d{8}/
        ],
        [
            "GGGG[W]WWE",
            /\d{4}W\d{3}/
        ],
        [
            "GGGG[W]WW",
            /\d{4}W\d{2}/,
            false
        ],
        [
            "YYYYDDD",
            /\d{7}/
        ],
        [
            "YYYYMM",
            /\d{6}/,
            false
        ],
        [
            "YYYY",
            /\d{4}/,
            false
        ], 
    ], cc = [
        [
            "HH:mm:ss.SSSS",
            /\d\d:\d\d:\d\d\.\d+/
        ],
        [
            "HH:mm:ss,SSSS",
            /\d\d:\d\d:\d\d,\d+/
        ],
        [
            "HH:mm:ss",
            /\d\d:\d\d:\d\d/
        ],
        [
            "HH:mm",
            /\d\d:\d\d/
        ],
        [
            "HHmmss.SSSS",
            /\d\d\d\d\d\d\.\d+/
        ],
        [
            "HHmmss,SSSS",
            /\d\d\d\d\d\d,\d+/
        ],
        [
            "HHmmss",
            /\d\d\d\d\d\d/
        ],
        [
            "HHmm",
            /\d\d\d\d/
        ],
        [
            "HH",
            /\d\d/
        ], 
    ], cd = /^\/?Date\((-?\d+)/i, ce = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, cf = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };
    function cg(a) {
        var b, c, d = a._i, e = b8.exec(d) || b9.exec(d), f, g, h, i;
        if (e) {
            o(a).iso = true;
            for(b = 0, c = cb.length; b < c; b++){
                if (cb[b][1].exec(e[1])) {
                    g = cb[b][0];
                    f = cb[b][2] !== false;
                    break;
                }
            }
            if (g == null) {
                a._isValid = false;
                return;
            }
            if (e[3]) {
                for(b = 0, c = cc.length; b < c; b++){
                    if (cc[b][1].exec(e[3])) {
                        h = (e[2] || " ") + cc[b][0];
                        break;
                    }
                }
                if (h == null) {
                    a._isValid = false;
                    return;
                }
            }
            if (!f && h != null) {
                a._isValid = false;
                return;
            }
            if (e[4]) {
                if (ca.exec(e[4])) {
                    i = "Z";
                } else {
                    a._isValid = false;
                    return;
                }
            }
            a._f = g + (h || "") + (i || "");
            cs(a);
        } else {
            a._isValid = false;
        }
    }
    function ch(a, b, c, d, e, f) {
        var g = [
            ci(a),
            a0.indexOf(b),
            parseInt(c, 10),
            parseInt(d, 10),
            parseInt(e, 10), 
        ];
        if (f) {
            g.push(parseInt(f, 10));
        }
        return g;
    }
    function ci(a) {
        var b = parseInt(a, 10);
        if (b <= 49) {
            return 2000 + b;
        } else if (b <= 999) {
            return 1900 + b;
        }
        return b;
    }
    function cj(a) {
        return a.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function ck(a, b, c) {
        if (a) {
            var d = bx.indexOf(a), e = new Date(b[0], b[1], b[2]).getDay();
            if (d !== e) {
                o(c).weekdayMismatch = true;
                c._isValid = false;
                return false;
            }
        }
        return true;
    }
    function cl(a, b, c) {
        if (a) {
            return cf[a];
        } else if (b) {
            return 0;
        } else {
            var d = parseInt(c, 10), e = d % 100, f = (d - e) / 100;
            return f * 60 + e;
        }
    }
    function cm(a) {
        var b = ce.exec(cj(a._i)), c;
        if (b) {
            c = ch(b[4], b[3], b[2], b[5], b[6], b[7]);
            if (!ck(b[1], c, a)) {
                return;
            }
            a._a = c;
            a._tzm = cl(b[8], b[9], b[10]);
            a._d = bi.apply(null, a._a);
            a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm);
            o(a).rfc2822 = true;
        } else {
            a._isValid = false;
        }
    }
    function cn(a) {
        var c = cd.exec(a._i);
        if (c !== null) {
            a._d = new Date(+c[1]);
            return;
        }
        cg(a);
        if (a._isValid === false) {
            delete a._isValid;
        } else {
            return;
        }
        cm(a);
        if (a._isValid === false) {
            delete a._isValid;
        } else {
            return;
        }
        if (a._strict) {
            a._isValid = false;
        } else {
            b.createFromInputFallback(a);
        }
    }
    b.createFromInputFallback = y("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), " + "which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are " + "discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""));
    });
    function co(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }
    function cp(a) {
        var c = new Date(b.now());
        if (a._useUTC) {
            return [
                c.getUTCFullYear(),
                c.getUTCMonth(),
                c.getUTCDate(), 
            ];
        }
        return [
            c.getFullYear(),
            c.getMonth(),
            c.getDate(), 
        ];
    }
    function cq(a) {
        var b, c, d = [], e, f, g;
        if (a._d) {
            return;
        }
        e = cp(a);
        if (a._w && a._a[aR] == null && a._a[aQ] == null) {
            cr(a);
        }
        if (a._dayOfYear != null) {
            g = co(a._a[aP], e[aP]);
            if (a._dayOfYear > be(g) || a._dayOfYear === 0) {
                o(a)._overflowDayOfYear = true;
            }
            c = bi(g, 0, a._dayOfYear);
            a._a[aQ] = c.getUTCMonth();
            a._a[aR] = c.getUTCDate();
        }
        for(b = 0; b < 3 && a._a[b] == null; ++b){
            a._a[b] = d[b] = e[b];
        }
        for(; b < 7; b++){
            a._a[b] = d[b] = a._a[b] == null ? (b === 2 ? 1 : 0) : a._a[b];
        }
        if (a._a[aS] === 24 && a._a[aT] === 0 && a._a[aU] === 0 && a._a[aV] === 0) {
            a._nextDay = true;
            a._a[aS] = 0;
        }
        a._d = (a._useUTC ? bi : bh).apply(null, d);
        f = a._useUTC ? a._d.getUTCDay() : a._d.getDay();
        if (a._tzm != null) {
            a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm);
        }
        if (a._nextDay) {
            a._a[aS] = 24;
        }
        if (a._w && typeof a._w.d !== "undefined" && a._w.d !== f) {
            o(a).weekdayMismatch = true;
        }
    }
    function cr(a) {
        var b, c, d, e, f, g, h, i, j;
        b = a._w;
        if (b.GG != null || b.W != null || b.E != null) {
            f = 1;
            g = 4;
            c = co(b.GG, a._a[aP], bl(cA(), 1, 4).year);
            d = co(b.W, 1);
            e = co(b.E, 1);
            if (e < 1 || e > 7) {
                i = true;
            }
        } else {
            f = a._locale._week.dow;
            g = a._locale._week.doy;
            j = bl(cA(), f, g);
            c = co(b.gg, a._a[aP], j.year);
            d = co(b.w, j.week);
            if (b.d != null) {
                e = b.d;
                if (e < 0 || e > 6) {
                    i = true;
                }
            } else if (b.e != null) {
                e = b.e + f;
                if (b.e < 0 || b.e > 6) {
                    i = true;
                }
            } else {
                e = f;
            }
        }
        if (d < 1 || d > bm(c, f, g)) {
            o(a)._overflowWeeks = true;
        } else if (i != null) {
            o(a)._overflowWeekday = true;
        } else {
            h = bk(c, d, e, f, g);
            a._a[aP] = h.year;
            a._dayOfYear = h.dayOfYear;
        }
    }
    b.ISO_8601 = function() {};
    b.RFC_2822 = function() {};
    function cs(a) {
        if (a._f === b.ISO_8601) {
            cg(a);
            return;
        }
        if (a._f === b.RFC_2822) {
            cm(a);
            return;
        }
        a._a = [];
        o(a).empty = true;
        var c = "" + a._i, d, e, f, g, h, i = c.length, j = 0, k;
        f = R(a._f, a._locale).match(J) || [];
        for(d = 0; d < f.length; d++){
            g = f[d];
            e = (c.match(aI(g, a)) || [])[0];
            if (e) {
                h = c.substr(0, c.indexOf(e));
                if (h.length > 0) {
                    o(a).unusedInput.push(h);
                }
                c = c.slice(c.indexOf(e) + e.length);
                j += e.length;
            }
            if (M[g]) {
                if (e) {
                    o(a).empty = false;
                } else {
                    o(a).unusedTokens.push(g);
                }
                aO(g, e, a);
            } else if (a._strict && !e) {
                o(a).unusedTokens.push(g);
            }
        }
        o(a).charsLeftOver = i - j;
        if (c.length > 0) {
            o(a).unusedInput.push(c);
        }
        if (a._a[aS] <= 12 && o(a).bigHour === true && a._a[aS] > 0) {
            o(a).bigHour = undefined;
        }
        o(a).parsedDateParts = a._a.slice(0);
        o(a).meridiem = a._meridiem;
        a._a[aS] = ct(a._locale, a._a[aS], a._meridiem);
        k = o(a).era;
        if (k !== null) {
            a._a[aP] = a._locale.erasConvertYear(k, a._a[aP]);
        }
        cq(a);
        b7(a);
    }
    function ct(a, b, c) {
        var d;
        if (c == null) {
            return b;
        }
        if (a.meridiemHour != null) {
            return a.meridiemHour(b, c);
        } else if (a.isPM != null) {
            d = a.isPM(c);
            if (d && b < 12) {
                b += 12;
            }
            if (!d && b === 12) {
                b = 0;
            }
            return b;
        } else {
            return b;
        }
    }
    function cu(a) {
        var b, c, d, e, f, g, h = false;
        if (a._f.length === 0) {
            o(a).invalidFormat = true;
            a._d = new Date(NaN);
            return;
        }
        for(e = 0; e < a._f.length; e++){
            f = 0;
            g = false;
            b = u({}, a);
            if (a._useUTC != null) {
                b._useUTC = a._useUTC;
            }
            b._f = a._f[e];
            cs(b);
            if (q(b)) {
                g = true;
            }
            f += o(b).charsLeftOver;
            f += o(b).unusedTokens.length * 10;
            o(b).score = f;
            if (!h) {
                if (d == null || f < d || g) {
                    d = f;
                    c = b;
                    if (g) {
                        h = true;
                    }
                }
            } else {
                if (f < d) {
                    d = f;
                    c = b;
                }
            }
        }
        l(a, c || b);
    }
    function cv(a) {
        if (a._d) {
            return;
        }
        var b = ad(a._i), c = b.day === undefined ? b.date : b.day;
        a._a = k([
            b.year,
            b.month,
            c,
            b.hour,
            b.minute,
            b.second,
            b.millisecond, 
        ], function(a) {
            return a && parseInt(a, 10);
        });
        cq(a);
    }
    function cw(a) {
        var b = new v(b7(cx(a)));
        if (b._nextDay) {
            b.add(1, "d");
            b._nextDay = undefined;
        }
        return b;
    }
    function cx(a) {
        var b = a._i, c = a._f;
        a._locale = a._locale || b5(a._l);
        if (b === null || (c === undefined && b === "")) {
            return r({
                nullInput: true
            });
        }
        if (typeof b === "string") {
            a._i = b = a._locale.preparse(b);
        }
        if (w(b)) {
            return new v(b7(b));
        } else if (j(b)) {
            a._d = b;
        } else if (d(c)) {
            cu(a);
        } else if (c) {
            cs(a);
        } else {
            cy(a);
        }
        if (!q(a)) {
            a._d = null;
        }
        return a;
    }
    function cy(a) {
        var c = a._i;
        if (h(c)) {
            a._d = new Date(b.now());
        } else if (j(c)) {
            a._d = new Date(c.valueOf());
        } else if (typeof c === "string") {
            cn(a);
        } else if (d(c)) {
            a._a = k(c.slice(0), function(a) {
                return parseInt(a, 10);
            });
            cq(a);
        } else if (e(c)) {
            cv(a);
        } else if (i(c)) {
            a._d = new Date(c);
        } else {
            b.createFromInputFallback(a);
        }
    }
    function cz(a, b, c, f, h) {
        var i = {};
        if (b === true || b === false) {
            f = b;
            b = undefined;
        }
        if (c === true || c === false) {
            f = c;
            c = undefined;
        }
        if ((e(a) && g(a)) || (d(a) && a.length === 0)) {
            a = undefined;
        }
        i._isAMomentObject = true;
        i._useUTC = i._isUTC = h;
        i._l = c;
        i._i = a;
        i._f = b;
        i._strict = f;
        return cw(i);
    }
    function cA(a, b, c, d) {
        return cz(a, b, c, d, false);
    }
    var cB = y("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var a = cA.apply(null, arguments);
        if (this.isValid() && a.isValid()) {
            return a < this ? this : a;
        } else {
            return r();
        }
    }), cC = y("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var a = cA.apply(null, arguments);
        if (this.isValid() && a.isValid()) {
            return a > this ? this : a;
        } else {
            return r();
        }
    });
    function cD(a, b) {
        var c, e;
        if (b.length === 1 && d(b[0])) {
            b = b[0];
        }
        if (!b.length) {
            return cA();
        }
        c = b[0];
        for(e = 1; e < b.length; ++e){
            if (!b[e].isValid() || b[e][a](c)) {
                c = b[e];
            }
        }
        return c;
    }
    function cE() {
        var a = [].slice.call(arguments, 0);
        return cD("isBefore", a);
    }
    function cF() {
        var a = [].slice.call(arguments, 0);
        return cD("isAfter", a);
    }
    var cG = function() {
        return Date.now ? Date.now() : +new Date();
    };
    var cH = [
        "year",
        "quarter",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond", 
    ];
    function cI(a) {
        var b, c = false, d;
        for(b in a){
            if (f(a, b) && !(aZ.call(cH, b) !== -1 && (a[b] == null || !isNaN(a[b])))) {
                return false;
            }
        }
        for(d = 0; d < cH.length; ++d){
            if (a[cH[d]]) {
                if (c) {
                    return false;
                }
                if (parseFloat(a[cH[d]]) !== aj(a[cH[d]])) {
                    c = true;
                }
            }
        }
        return true;
    }
    function cJ() {
        return this._isValid;
    }
    function cK() {
        return c5(NaN);
    }
    function cL(a) {
        var b = ad(a), c = b.year || 0, d = b.quarter || 0, e = b.month || 0, f = b.week || b.isoWeek || 0, g = b.day || 0, h = b.hour || 0, i = b.minute || 0, j = b.second || 0, k = b.millisecond || 0;
        this._isValid = cI(b);
        this._milliseconds = +k + j * 1e3 + i * 6e4 + h * 1000 * 60 * 60;
        this._days = +g + f * 7;
        this._months = +e + d * 3 + c * 12;
        this._data = {};
        this._locale = b5();
        this._bubble();
    }
    function cM(a) {
        return a instanceof cL;
    }
    function cN(a) {
        if (a < 0) {
            return Math.round(-1 * a) * -1;
        } else {
            return Math.round(a);
        }
    }
    function cO(a, b, c) {
        var d = Math.min(a.length, b.length), e = Math.abs(a.length - b.length), f = 0, g;
        for(g = 0; g < d; g++){
            if ((c && a[g] !== b[g]) || (!c && aj(a[g]) !== aj(b[g]))) {
                f++;
            }
        }
        return f + e;
    }
    function cP(a, b) {
        N(a, 0, 0, function() {
            var a = this.utcOffset(), c = "+";
            if (a < 0) {
                a = -a;
                c = "-";
            }
            return (c + I(~~(a / 60), 2) + b + I(~~a % 60, 2));
        });
    }
    cP("Z", ":");
    cP("ZZ", "");
    aH("Z", aD);
    aH("ZZ", aD);
    aM([
        "Z",
        "ZZ"
    ], function(a, b, c) {
        c._useUTC = true;
        c._tzm = cR(aD, a);
    });
    var cQ = /([\+\-]|\d\d)/gi;
    function cR(a, b) {
        var c = (b || "").match(a), d, e, f;
        if (c === null) {
            return null;
        }
        d = c[c.length - 1] || [];
        e = (d + "").match(cQ) || [
            "-",
            0,
            0
        ];
        f = +(e[1] * 60) + aj(e[2]);
        return f === 0 ? 0 : e[0] === "+" ? f : -f;
    }
    function cS(a, c) {
        var d, e;
        if (c._isUTC) {
            d = c.clone();
            e = (w(a) || j(a) ? a.valueOf() : cA(a).valueOf()) - d.valueOf();
            d._d.setTime(d._d.valueOf() + e);
            b.updateOffset(d, false);
            return d;
        } else {
            return cA(a).local();
        }
    }
    function cT(a) {
        return -Math.round(a._d.getTimezoneOffset());
    }
    b.updateOffset = function() {};
    function cU(a, c, d) {
        var e = this._offset || 0, f;
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        if (a != null) {
            if (typeof a === "string") {
                a = cR(aD, a);
                if (a === null) {
                    return this;
                }
            } else if (Math.abs(a) < 16 && !d) {
                a = a * 60;
            }
            if (!this._isUTC && c) {
                f = cT(this);
            }
            this._offset = a;
            this._isUTC = true;
            if (f != null) {
                this.add(f, "m");
            }
            if (e !== a) {
                if (!c || this._changeInProgress) {
                    da(this, c5(a - e, "m"), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    b.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? e : cT(this);
        }
    }
    function cV(a, b) {
        if (a != null) {
            if (typeof a !== "string") {
                a = -a;
            }
            this.utcOffset(a, b);
            return this;
        } else {
            return -this.utcOffset();
        }
    }
    function cW(a) {
        return this.utcOffset(0, a);
    }
    function cX(a) {
        if (this._isUTC) {
            this.utcOffset(0, a);
            this._isUTC = false;
            if (a) {
                this.subtract(cT(this), "m");
            }
        }
        return this;
    }
    function cY() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
            var a = cR(aC, this._i);
            if (a != null) {
                this.utcOffset(a);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }
    function cZ(a) {
        if (!this.isValid()) {
            return false;
        }
        a = a ? cA(a).utcOffset() : 0;
        return (this.utcOffset() - a) % 60 === 0;
    }
    function c$() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }
    function c_() {
        if (!h(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var a = {}, b;
        u(a, this);
        a = cx(a);
        if (a._a) {
            b = a._isUTC ? m(a._a) : cA(a._a);
            this._isDSTShifted = this.isValid() && cO(a._a, b.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }
    function c0() {
        return this.isValid() ? !this._isUTC : false;
    }
    function c1() {
        return this.isValid() ? this._isUTC : false;
    }
    function c2() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var c3 = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, c4 = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function c5(a, b) {
        var c = a, d = null, e, g, h;
        if (cM(a)) {
            c = {
                ms: a._milliseconds,
                d: a._days,
                M: a._months
            };
        } else if (i(a) || !isNaN(+a)) {
            c = {};
            if (b) {
                c[b] = +a;
            } else {
                c.milliseconds = +a;
            }
        } else if ((d = c3.exec(a))) {
            e = d[1] === "-" ? -1 : 1;
            c = {
                y: 0,
                d: aj(d[aR]) * e,
                h: aj(d[aS]) * e,
                m: aj(d[aT]) * e,
                s: aj(d[aU]) * e,
                ms: aj(cN(d[aV] * 1000)) * e
            };
        } else if ((d = c4.exec(a))) {
            e = d[1] === "-" ? -1 : 1;
            c = {
                y: c6(d[2], e),
                M: c6(d[3], e),
                w: c6(d[4], e),
                d: c6(d[5], e),
                h: c6(d[6], e),
                m: c6(d[7], e),
                s: c6(d[8], e)
            };
        } else if (c == null) {
            c = {};
        } else if (typeof c === "object" && ("from" in c || "to" in c)) {
            h = c8(cA(c.from), cA(c.to));
            c = {};
            c.ms = h.milliseconds;
            c.M = h.months;
        }
        g = new cL(c);
        if (cM(a) && f(a, "_locale")) {
            g._locale = a._locale;
        }
        if (cM(a) && f(a, "_isValid")) {
            g._isValid = a._isValid;
        }
        return g;
    }
    c5.fn = cL.prototype;
    c5.invalid = cK;
    function c6(a, b) {
        var c = a && parseFloat(a.replace(",", "."));
        return (isNaN(c) ? 0 : c) * b;
    }
    function c7(a, b) {
        var c = {};
        c.months = b.month() - a.month() + (b.year() - a.year()) * 12;
        if (a.clone().add(c.months, "M").isAfter(b)) {
            --c.months;
        }
        c.milliseconds = +b - +a.clone().add(c.months, "M");
        return c;
    }
    function c8(a, b) {
        var c;
        if (!(a.isValid() && b.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }
        b = cS(b, a);
        if (a.isBefore(b)) {
            c = c7(a, b);
        } else {
            c = c7(b, a);
            c.milliseconds = -c.milliseconds;
            c.months = -c.months;
        }
        return c;
    }
    function c9(a, b) {
        return function(c, d) {
            var e, f;
            if (d !== null && !isNaN(+d)) {
                A(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period). " + "See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
                f = c;
                c = d;
                d = f;
            }
            e = c5(c, d);
            da(this, e, a);
            return this;
        };
    }
    function da(a, c, d, e) {
        var f = c._milliseconds, g = cN(c._days), h = cN(c._months);
        if (!a.isValid()) {
            return;
        }
        e = e == null ? true : e;
        if (h) {
            a8(a, al(a, "Month") + h * d);
        }
        if (g) {
            am(a, "Date", al(a, "Date") + g * d);
        }
        if (f) {
            a._d.setTime(a._d.valueOf() + f * d);
        }
        if (e) {
            b.updateOffset(a, g || h);
        }
    }
    var db = c9(1, "add"), dc = c9(-1, "subtract");
    function dd(a) {
        return typeof a === "string" || a instanceof String;
    }
    function de(a) {
        return (w(a) || j(a) || dd(a) || i(a) || dg(a) || df(a) || a === null || a === undefined);
    }
    function df(a) {
        var b = e(a) && !g(a), c = false, d = [
            "years",
            "year",
            "y",
            "months",
            "month",
            "M",
            "days",
            "day",
            "d",
            "dates",
            "date",
            "D",
            "hours",
            "hour",
            "h",
            "minutes",
            "minute",
            "m",
            "seconds",
            "second",
            "s",
            "milliseconds",
            "millisecond",
            "ms", 
        ], h, i;
        for(h = 0; h < d.length; h += 1){
            i = d[h];
            c = c || f(a, i);
        }
        return b && c;
    }
    function dg(a) {
        var b = d(a), c = false;
        if (b) {
            c = a.filter(function(b) {
                return !i(b) && dd(a);
            }).length === 0;
        }
        return b && c;
    }
    function dh(a) {
        var b = e(a) && !g(a), c = false, d = [
            "sameDay",
            "nextDay",
            "lastDay",
            "nextWeek",
            "lastWeek",
            "sameElse", 
        ], h, i;
        for(h = 0; h < d.length; h += 1){
            i = d[h];
            c = c || f(a, i);
        }
        return b && c;
    }
    function di(a, b) {
        var c = a.diff(b, "days", true);
        return c < -6 ? "sameElse" : c < -1 ? "lastWeek" : c < 0 ? "lastDay" : c < 1 ? "sameDay" : c < 2 ? "nextDay" : c < 7 ? "nextWeek" : "sameElse";
    }
    function dj(a, c) {
        if (arguments.length === 1) {
            if (!arguments[0]) {
                a = undefined;
                c = undefined;
            } else if (de(arguments[0])) {
                a = arguments[0];
                c = undefined;
            } else if (dh(arguments[0])) {
                c = arguments[0];
                a = undefined;
            }
        }
        var d = a || cA(), e = cS(d, this).startOf("day"), f = b.calendarFormat(this, e) || "sameElse", g = c && (B(c[f]) ? c[f].call(this, d) : c[f]);
        return this.format(g || this.localeData().calendar(f, this, cA(d)));
    }
    function dk() {
        return new v(this);
    }
    function dl(a, b) {
        var c = w(a) ? a : cA(a);
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        b = ac(b) || "millisecond";
        if (b === "millisecond") {
            return this.valueOf() > c.valueOf();
        } else {
            return c.valueOf() < this.clone().startOf(b).valueOf();
        }
    }
    function dm(a, b) {
        var c = w(a) ? a : cA(a);
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        b = ac(b) || "millisecond";
        if (b === "millisecond") {
            return this.valueOf() < c.valueOf();
        } else {
            return this.clone().endOf(b).valueOf() < c.valueOf();
        }
    }
    function dn(a, b, c, d) {
        var e = w(a) ? a : cA(a), f = w(b) ? b : cA(b);
        if (!(this.isValid() && e.isValid() && f.isValid())) {
            return false;
        }
        d = d || "()";
        return ((d[0] === "(" ? this.isAfter(e, c) : !this.isBefore(e, c)) && (d[1] === ")" ? this.isBefore(f, c) : !this.isAfter(f, c)));
    }
    function dp(a, b) {
        var c = w(a) ? a : cA(a), d;
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        b = ac(b) || "millisecond";
        if (b === "millisecond") {
            return this.valueOf() === c.valueOf();
        } else {
            d = c.valueOf();
            return (this.clone().startOf(b).valueOf() <= d && d <= this.clone().endOf(b).valueOf());
        }
    }
    function dq(a, b) {
        return this.isSame(a, b) || this.isAfter(a, b);
    }
    function dr(a, b) {
        return this.isSame(a, b) || this.isBefore(a, b);
    }
    function ds(a, b, c) {
        var d, e, f;
        if (!this.isValid()) {
            return NaN;
        }
        d = cS(a, this);
        if (!d.isValid()) {
            return NaN;
        }
        e = (d.utcOffset() - this.utcOffset()) * 6e4;
        b = ac(b);
        switch(b){
            case "year":
                f = dt(this, d) / 12;
                break;
            case "month":
                f = dt(this, d);
                break;
            case "quarter":
                f = dt(this, d) / 3;
                break;
            case "second":
                f = (this - d) / 1e3;
                break;
            case "minute":
                f = (this - d) / 6e4;
                break;
            case "hour":
                f = (this - d) / 36e5;
                break;
            case "day":
                f = (this - d - e) / 864e5;
                break;
            case "week":
                f = (this - d - e) / 6048e5;
                break;
            default:
                f = this - d;
        }
        return c ? f : ai(f);
    }
    function dt(a, b) {
        if (a.date() < b.date()) {
            return -dt(b, a);
        }
        var c = (b.year() - a.year()) * 12 + (b.month() - a.month()), d = a.clone().add(c, "months"), e, f;
        if (b - d < 0) {
            e = a.clone().add(c - 1, "months");
            f = (b - d) / (d - e);
        } else {
            e = a.clone().add(c + 1, "months");
            f = (b - d) / (e - d);
        }
        return -(c + f) || 0;
    }
    b.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    b.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function du() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function dv(a) {
        if (!this.isValid()) {
            return null;
        }
        var b = a !== true, c = b ? this.clone().utc() : this;
        if (c.year() < 0 || c.year() > 9999) {
            return Q(c, b ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (B(Date.prototype.toISOString)) {
            if (b) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace("Z", Q(c, "Z"));
            }
        }
        return Q(c, b ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function dw() {
        if (!this.isValid()) {
            return "moment.invalid(/* " + this._i + " */)";
        }
        var a = "moment", b = "", c, d, e, f;
        if (!this.isLocal()) {
            a = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
            b = "Z";
        }
        c = "[" + a + '("]';
        d = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        e = "-MM-DD[T]HH:mm:ss.SSS";
        f = b + '[")]';
        return this.format(c + d + e + f);
    }
    function dx(a) {
        if (!a) {
            a = this.isUtc() ? b.defaultFormatUtc : b.defaultFormat;
        }
        var c = Q(this, a);
        return this.localeData().postformat(c);
    }
    function dy(a, b) {
        if (this.isValid() && ((w(a) && a.isValid()) || cA(a).isValid())) {
            return c5({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function dz(a) {
        return this.from(cA(), a);
    }
    function dA(a, b) {
        if (this.isValid() && ((w(a) && a.isValid()) || cA(a).isValid())) {
            return c5({
                from: this,
                to: a
            }).locale(this.locale()).humanize(!b);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function dB(a) {
        return this.to(cA(), a);
    }
    function dC(a) {
        var b;
        if (a === undefined) {
            return this._locale._abbr;
        } else {
            b = b5(a);
            if (b != null) {
                this._locale = b;
            }
            return this;
        }
    }
    var dD = y("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(a) {
        if (a === undefined) {
            return this.localeData();
        } else {
            return this.locale(a);
        }
    });
    function dE() {
        return this._locale;
    }
    var dF = 1000, dG = 60 * dF, dH = 60 * dG, dI = (365 * 400 + 97) * 24 * dH;
    function dJ(a, b) {
        return ((a % b) + b) % b;
    }
    function dK(a, b, c) {
        if (a < 100 && a >= 0) {
            return new Date(a + 400, b, c) - dI;
        } else {
            return new Date(a, b, c).valueOf();
        }
    }
    function dL(a, b, c) {
        if (a < 100 && a >= 0) {
            return Date.UTC(a + 400, b, c) - dI;
        } else {
            return Date.UTC(a, b, c);
        }
    }
    function dM(a) {
        var c, d;
        a = ac(a);
        if (a === undefined || a === "millisecond" || !this.isValid()) {
            return this;
        }
        d = this._isUTC ? dL : dK;
        switch(a){
            case "year":
                c = d(this.year(), 0, 1);
                break;
            case "quarter":
                c = d(this.year(), this.month() - (this.month() % 3), 1);
                break;
            case "month":
                c = d(this.year(), this.month(), 1);
                break;
            case "week":
                c = d(this.year(), this.month(), this.date() - this.weekday());
                break;
            case "isoWeek":
                c = d(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case "day":
            case "date":
                c = d(this.year(), this.month(), this.date());
                break;
            case "hour":
                c = this._d.valueOf();
                c -= dJ(c + (this._isUTC ? 0 : this.utcOffset() * dG), dH);
                break;
            case "minute":
                c = this._d.valueOf();
                c -= dJ(c, dG);
                break;
            case "second":
                c = this._d.valueOf();
                c -= dJ(c, dF);
                break;
        }
        this._d.setTime(c);
        b.updateOffset(this, true);
        return this;
    }
    function dN(a) {
        var c, d;
        a = ac(a);
        if (a === undefined || a === "millisecond" || !this.isValid()) {
            return this;
        }
        d = this._isUTC ? dL : dK;
        switch(a){
            case "year":
                c = d(this.year() + 1, 0, 1) - 1;
                break;
            case "quarter":
                c = d(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
                break;
            case "month":
                c = d(this.year(), this.month() + 1, 1) - 1;
                break;
            case "week":
                c = d(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case "isoWeek":
                c = d(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case "day":
            case "date":
                c = d(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case "hour":
                c = this._d.valueOf();
                c += dH - dJ(c + (this._isUTC ? 0 : this.utcOffset() * dG), dH) - 1;
                break;
            case "minute":
                c = this._d.valueOf();
                c += dG - dJ(c, dG) - 1;
                break;
            case "second":
                c = this._d.valueOf();
                c += dF - dJ(c, dF) - 1;
                break;
        }
        this._d.setTime(c);
        b.updateOffset(this, true);
        return this;
    }
    function dO() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }
    function dP() {
        return Math.floor(this.valueOf() / 1000);
    }
    function dQ() {
        return new Date(this.valueOf());
    }
    function dR() {
        var a = this;
        return [
            a.year(),
            a.month(),
            a.date(),
            a.hour(),
            a.minute(),
            a.second(),
            a.millisecond(), 
        ];
    }
    function dS() {
        var a = this;
        return {
            years: a.year(),
            months: a.month(),
            date: a.date(),
            hours: a.hours(),
            minutes: a.minutes(),
            seconds: a.seconds(),
            milliseconds: a.milliseconds()
        };
    }
    function dT() {
        return this.isValid() ? this.toISOString() : null;
    }
    function dU() {
        return q(this);
    }
    function dV() {
        return l({}, o(this));
    }
    function dW() {
        return o(this).overflow;
    }
    function dX() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    N("N", 0, 0, "eraAbbr");
    N("NN", 0, 0, "eraAbbr");
    N("NNN", 0, 0, "eraAbbr");
    N("NNNN", 0, 0, "eraName");
    N("NNNNN", 0, 0, "eraNarrow");
    N("y", [
        "y",
        1
    ], "yo", "eraYear");
    N("y", [
        "yy",
        2
    ], 0, "eraYear");
    N("y", [
        "yyy",
        3
    ], 0, "eraYear");
    N("y", [
        "yyyy",
        4
    ], 0, "eraYear");
    aH("N", d6);
    aH("NN", d6);
    aH("NNN", d6);
    aH("NNNN", d7);
    aH("NNNNN", d8);
    aM([
        "N",
        "NN",
        "NNN",
        "NNNN",
        "NNNNN"
    ], function(a, b, c, d) {
        var e = c._locale.erasParse(a, d, c._strict);
        if (e) {
            o(c).era = e;
        } else {
            o(c).invalidEra = a;
        }
    });
    aH("y", aA);
    aH("yy", aA);
    aH("yyy", aA);
    aH("yyyy", aA);
    aH("yo", d9);
    aM([
        "y",
        "yy",
        "yyy",
        "yyyy"
    ], aP);
    aM([
        "yo"
    ], function(a, b, c, d) {
        var e;
        if (c._locale._eraYearOrdinalRegex) {
            e = a.match(c._locale._eraYearOrdinalRegex);
        }
        if (c._locale.eraYearOrdinalParse) {
            b[aP] = c._locale.eraYearOrdinalParse(a, e);
        } else {
            b[aP] = parseInt(a, 10);
        }
    });
    function dY(a, c) {
        var d, e, f, g = this._eras || b5("en")._eras;
        for(d = 0, e = g.length; d < e; ++d){
            switch(typeof g[d].since){
                case "string":
                    f = b(g[d].since).startOf("day");
                    g[d].since = f.valueOf();
                    break;
            }
            switch(typeof g[d].until){
                case "undefined":
                    g[d].until = +Infinity;
                    break;
                case "string":
                    f = b(g[d].until).startOf("day").valueOf();
                    g[d].until = f.valueOf();
                    break;
            }
        }
        return g;
    }
    function dZ(a, b, c) {
        var d, e, f = this.eras(), g, h, i;
        a = a.toUpperCase();
        for(d = 0, e = f.length; d < e; ++d){
            g = f[d].name.toUpperCase();
            h = f[d].abbr.toUpperCase();
            i = f[d].narrow.toUpperCase();
            if (c) {
                switch(b){
                    case "N":
                    case "NN":
                    case "NNN":
                        if (h === a) {
                            return f[d];
                        }
                        break;
                    case "NNNN":
                        if (g === a) {
                            return f[d];
                        }
                        break;
                    case "NNNNN":
                        if (i === a) {
                            return f[d];
                        }
                        break;
                }
            } else if ([
                g,
                h,
                i
            ].indexOf(a) >= 0) {
                return f[d];
            }
        }
    }
    function d$(a, c) {
        var d = a.since <= a.until ? +1 : -1;
        if (c === undefined) {
            return b(a.since).year();
        } else {
            return b(a.since).year() + (c - a.offset) * d;
        }
    }
    function d_() {
        var a, b, c, d = this.localeData().eras();
        for(a = 0, b = d.length; a < b; ++a){
            c = this.clone().startOf("day").valueOf();
            if (d[a].since <= c && c <= d[a].until) {
                return d[a].name;
            }
            if (d[a].until <= c && c <= d[a].since) {
                return d[a].name;
            }
        }
        return "";
    }
    function d0() {
        var a, b, c, d = this.localeData().eras();
        for(a = 0, b = d.length; a < b; ++a){
            c = this.clone().startOf("day").valueOf();
            if (d[a].since <= c && c <= d[a].until) {
                return d[a].narrow;
            }
            if (d[a].until <= c && c <= d[a].since) {
                return d[a].narrow;
            }
        }
        return "";
    }
    function d1() {
        var a, b, c, d = this.localeData().eras();
        for(a = 0, b = d.length; a < b; ++a){
            c = this.clone().startOf("day").valueOf();
            if (d[a].since <= c && c <= d[a].until) {
                return d[a].abbr;
            }
            if (d[a].until <= c && c <= d[a].since) {
                return d[a].abbr;
            }
        }
        return "";
    }
    function d2() {
        var a, c, d, e, f = this.localeData().eras();
        for(a = 0, c = f.length; a < c; ++a){
            d = f[a].since <= f[a].until ? +1 : -1;
            e = this.clone().startOf("day").valueOf();
            if ((f[a].since <= e && e <= f[a].until) || (f[a].until <= e && e <= f[a].since)) {
                return ((this.year() - b(f[a].since).year()) * d + f[a].offset);
            }
        }
        return this.year();
    }
    function d3(a) {
        if (!f(this, "_erasNameRegex")) {
            ea.call(this);
        }
        return a ? this._erasNameRegex : this._erasRegex;
    }
    function d4(a) {
        if (!f(this, "_erasAbbrRegex")) {
            ea.call(this);
        }
        return a ? this._erasAbbrRegex : this._erasRegex;
    }
    function d5(a) {
        if (!f(this, "_erasNarrowRegex")) {
            ea.call(this);
        }
        return a ? this._erasNarrowRegex : this._erasRegex;
    }
    function d6(a, b) {
        return b.erasAbbrRegex(a);
    }
    function d7(a, b) {
        return b.erasNameRegex(a);
    }
    function d8(a, b) {
        return b.erasNarrowRegex(a);
    }
    function d9(a, b) {
        return b._eraYearOrdinalRegex || aA;
    }
    function ea() {
        var a = [], b = [], c = [], d = [], e, f, g = this.eras();
        for(e = 0, f = g.length; e < f; ++e){
            b.push(aK(g[e].name));
            a.push(aK(g[e].abbr));
            c.push(aK(g[e].narrow));
            d.push(aK(g[e].name));
            d.push(aK(g[e].abbr));
            d.push(aK(g[e].narrow));
        }
        this._erasRegex = new RegExp("^(" + d.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + b.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + a.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + c.join("|") + ")", "i");
    }
    N(0, [
        "gg",
        2
    ], 0, function() {
        return this.weekYear() % 100;
    });
    N(0, [
        "GG",
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    function eb(a, b) {
        N(0, [
            a,
            a.length
        ], 0, b);
    }
    eb("gggg", "weekYear");
    eb("ggggg", "weekYear");
    eb("GGGG", "isoWeekYear");
    eb("GGGGG", "isoWeekYear");
    ab("weekYear", "gg");
    ab("isoWeekYear", "GG");
    af("weekYear", 1);
    af("isoWeekYear", 1);
    aH("G", aB);
    aH("g", aB);
    aH("GG", au, aq);
    aH("gg", au, aq);
    aH("GGGG", ay, as);
    aH("gggg", ay, as);
    aH("GGGGG", az, at);
    aH("ggggg", az, at);
    aN([
        "gggg",
        "ggggg",
        "GGGG",
        "GGGGG"
    ], function(a, b, c, d) {
        b[d.substr(0, 2)] = aj(a);
    });
    aN([
        "gg",
        "GG"
    ], function(a, c, d, e) {
        c[e] = b.parseTwoDigitYear(a);
    });
    function ec(a) {
        return ei.call(this, a, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function ed(a) {
        return ei.call(this, a, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function ee() {
        return bm(this.year(), 1, 4);
    }
    function ef() {
        return bm(this.isoWeekYear(), 1, 4);
    }
    function eg() {
        var a = this.localeData()._week;
        return bm(this.year(), a.dow, a.doy);
    }
    function eh() {
        var a = this.localeData()._week;
        return bm(this.weekYear(), a.dow, a.doy);
    }
    function ei(a, b, c, d, e) {
        var f;
        if (a == null) {
            return bl(this, d, e).year;
        } else {
            f = bm(a, d, e);
            if (b > f) {
                b = f;
            }
            return ej.call(this, a, b, c, d, e);
        }
    }
    function ej(a, b, c, d, e) {
        var f = bk(a, b, c, d, e), g = bi(f.year, 0, f.dayOfYear);
        this.year(g.getUTCFullYear());
        this.month(g.getUTCMonth());
        this.date(g.getUTCDate());
        return this;
    }
    N("Q", 0, "Qo", "quarter");
    ab("quarter", "Q");
    af("quarter", 7);
    aH("Q", ap);
    aM("Q", function(a, b) {
        b[aQ] = (aj(a) - 1) * 3;
    });
    function ek(a) {
        return a == null ? Math.ceil((this.month() + 1) / 3) : this.month((a - 1) * 3 + (this.month() % 3));
    }
    N("D", [
        "DD",
        2
    ], "Do", "date");
    ab("date", "D");
    af("date", 9);
    aH("D", au);
    aH("DD", au, aq);
    aH("Do", function(a, b) {
        return a ? b._dayOfMonthOrdinalParse || b._ordinalParse : b._dayOfMonthOrdinalParseLenient;
    });
    aM([
        "D",
        "DD"
    ], aR);
    aM("Do", function(a, b) {
        b[aR] = aj(a.match(au)[0]);
    });
    var el = ak("Date", true);
    N("DDD", [
        "DDDD",
        3
    ], "DDDo", "dayOfYear");
    ab("dayOfYear", "DDD");
    af("dayOfYear", 4);
    aH("DDD", ax);
    aH("DDDD", ar);
    aM([
        "DDD",
        "DDDD"
    ], function(a, b, c) {
        c._dayOfYear = aj(a);
    });
    function em(a) {
        var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return a == null ? b : this.add(a - b, "d");
    }
    N("m", [
        "mm",
        2
    ], 0, "minute");
    ab("minute", "m");
    af("minute", 14);
    aH("m", au);
    aH("mm", au, aq);
    aM([
        "m",
        "mm"
    ], aT);
    var en = ak("Minutes", false);
    N("s", [
        "ss",
        2
    ], 0, "second");
    ab("second", "s");
    af("second", 15);
    aH("s", au);
    aH("ss", au, aq);
    aM([
        "s",
        "ss"
    ], aU);
    var eo = ak("Seconds", false);
    N("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    N(0, [
        "SS",
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    N(0, [
        "SSS",
        3
    ], 0, "millisecond");
    N(0, [
        "SSSS",
        4
    ], 0, function() {
        return this.millisecond() * 10;
    });
    N(0, [
        "SSSSS",
        5
    ], 0, function() {
        return this.millisecond() * 100;
    });
    N(0, [
        "SSSSSS",
        6
    ], 0, function() {
        return this.millisecond() * 1000;
    });
    N(0, [
        "SSSSSSS",
        7
    ], 0, function() {
        return this.millisecond() * 10000;
    });
    N(0, [
        "SSSSSSSS",
        8
    ], 0, function() {
        return this.millisecond() * 100000;
    });
    N(0, [
        "SSSSSSSSS",
        9
    ], 0, function() {
        return this.millisecond() * 1000000;
    });
    ab("millisecond", "ms");
    af("millisecond", 16);
    aH("S", ax, ap);
    aH("SS", ax, aq);
    aH("SSS", ax, ar);
    var ep, eq;
    for(ep = "SSSS"; ep.length <= 9; ep += "S"){
        aH(ep, aA);
    }
    function er(a, b) {
        b[aV] = aj(("0." + a) * 1000);
    }
    for(ep = "S"; ep.length <= 9; ep += "S"){
        aM(ep, er);
    }
    eq = ak("Milliseconds", false);
    N("z", 0, 0, "zoneAbbr");
    N("zz", 0, 0, "zoneName");
    function es() {
        return this._isUTC ? "UTC" : "";
    }
    function et() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var eu = v.prototype;
    eu.add = db;
    eu.calendar = dj;
    eu.clone = dk;
    eu.diff = ds;
    eu.endOf = dN;
    eu.format = dx;
    eu.from = dy;
    eu.fromNow = dz;
    eu.to = dA;
    eu.toNow = dB;
    eu.get = an;
    eu.invalidAt = dW;
    eu.isAfter = dl;
    eu.isBefore = dm;
    eu.isBetween = dn;
    eu.isSame = dp;
    eu.isSameOrAfter = dq;
    eu.isSameOrBefore = dr;
    eu.isValid = dU;
    eu.lang = dD;
    eu.locale = dC;
    eu.localeData = dE;
    eu.max = cC;
    eu.min = cB;
    eu.parsingFlags = dV;
    eu.set = ao;
    eu.startOf = dM;
    eu.subtract = dc;
    eu.toArray = dR;
    eu.toObject = dS;
    eu.toDate = dQ;
    eu.toISOString = dv;
    eu.inspect = dw;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
        eu[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        };
    }
    eu.toJSON = dT;
    eu.toString = du;
    eu.unix = dP;
    eu.valueOf = dO;
    eu.creationData = dX;
    eu.eraName = d_;
    eu.eraNarrow = d0;
    eu.eraAbbr = d1;
    eu.eraYear = d2;
    eu.year = bf;
    eu.isLeapYear = bg;
    eu.weekYear = ec;
    eu.isoWeekYear = ed;
    eu.quarter = eu.quarters = ek;
    eu.month = a9;
    eu.daysInMonth = ba;
    eu.week = eu.weeks = br;
    eu.isoWeek = eu.isoWeeks = bs;
    eu.weeksInYear = eg;
    eu.weeksInWeekYear = eh;
    eu.isoWeeksInYear = ee;
    eu.isoWeeksInISOWeekYear = ef;
    eu.date = el;
    eu.day = eu.days = bH;
    eu.weekday = bI;
    eu.isoWeekday = bJ;
    eu.dayOfYear = em;
    eu.hour = eu.hours = bU;
    eu.minute = eu.minutes = en;
    eu.second = eu.seconds = eo;
    eu.millisecond = eu.milliseconds = eq;
    eu.utcOffset = cU;
    eu.utc = cW;
    eu.local = cX;
    eu.parseZone = cY;
    eu.hasAlignedHourOffset = cZ;
    eu.isDST = c$;
    eu.isLocal = c0;
    eu.isUtcOffset = c1;
    eu.isUtc = c2;
    eu.isUTC = c2;
    eu.zoneAbbr = es;
    eu.zoneName = et;
    eu.dates = y("dates accessor is deprecated. Use date instead.", el);
    eu.months = y("months accessor is deprecated. Use month instead", a9);
    eu.years = y("years accessor is deprecated. Use year instead", bf);
    eu.zone = y("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", cV);
    eu.isDSTShifted = y("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", c_);
    function ev(a) {
        return cA(a * 1000);
    }
    function ew() {
        return cA.apply(null, arguments).parseZone();
    }
    function ex(a) {
        return a;
    }
    var ey = E.prototype;
    ey.calendar = H;
    ey.longDateFormat = T;
    ey.invalidDate = V;
    ey.ordinal = Y;
    ey.preparse = ex;
    ey.postformat = ex;
    ey.relativeTime = $;
    ey.pastFuture = _;
    ey.set = C;
    ey.eras = dY;
    ey.erasParse = dZ;
    ey.erasConvertYear = d$;
    ey.erasAbbrRegex = d4;
    ey.erasNameRegex = d3;
    ey.erasNarrowRegex = d5;
    ey.months = a4;
    ey.monthsShort = a5;
    ey.monthsParse = a7;
    ey.monthsRegex = bc;
    ey.monthsShortRegex = bb;
    ey.week = bn;
    ey.firstDayOfYear = bq;
    ey.firstDayOfWeek = bp;
    ey.weekdays = bC;
    ey.weekdaysMin = bE;
    ey.weekdaysShort = bD;
    ey.weekdaysParse = bG;
    ey.weekdaysRegex = bK;
    ey.weekdaysShortRegex = bL;
    ey.weekdaysMinRegex = bM;
    ey.isPM = bS;
    ey.meridiem = bV;
    function ez(a, b, c, d) {
        var e = b5(), f = m().set(d, b);
        return e[c](f, a);
    }
    function eA(a, b, c) {
        if (i(a)) {
            b = a;
            a = undefined;
        }
        a = a || "";
        if (b != null) {
            return ez(a, b, c, "month");
        }
        var d, e = [];
        for(d = 0; d < 12; d++){
            e[d] = ez(a, d, c, "month");
        }
        return e;
    }
    function eB(a, b, c, d) {
        if (typeof a === "boolean") {
            if (i(b)) {
                c = b;
                b = undefined;
            }
            b = b || "";
        } else {
            b = a;
            c = b;
            a = false;
            if (i(b)) {
                c = b;
                b = undefined;
            }
            b = b || "";
        }
        var e = b5(), f = a ? e._week.dow : 0, g, h = [];
        if (c != null) {
            return ez(b, (c + f) % 7, d, "day");
        }
        for(g = 0; g < 7; g++){
            h[g] = ez(b, (g + f) % 7, d, "day");
        }
        return h;
    }
    function eC(a, b) {
        return eA(a, b, "months");
    }
    function eD(a, b) {
        return eA(a, b, "monthsShort");
    }
    function eE(a, b, c) {
        return eB(a, b, c, "weekdays");
    }
    function eF(a, b, c) {
        return eB(a, b, c, "weekdaysShort");
    }
    function eG(a, b, c) {
        return eB(a, b, c, "weekdaysMin");
    }
    b2("en", {
        eras: [
            {
                since: "0001-01-01",
                until: +Infinity,
                offset: 1,
                name: "Anno Domini",
                narrow: "AD",
                abbr: "AD"
            },
            {
                since: "0000-12-31",
                until: -Infinity,
                offset: 1,
                name: "Before Christ",
                narrow: "BC",
                abbr: "BC"
            }, 
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(a) {
            var b = a % 10, c = aj((a % 100) / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
            return a + c;
        }
    });
    b.lang = y("moment.lang is deprecated. Use moment.locale instead.", b2);
    b.langData = y("moment.langData is deprecated. Use moment.localeData instead.", b5);
    var eH = Math.abs;
    function eI() {
        var a = this._data;
        this._milliseconds = eH(this._milliseconds);
        this._days = eH(this._days);
        this._months = eH(this._months);
        a.milliseconds = eH(a.milliseconds);
        a.seconds = eH(a.seconds);
        a.minutes = eH(a.minutes);
        a.hours = eH(a.hours);
        a.months = eH(a.months);
        a.years = eH(a.years);
        return this;
    }
    function eJ(a, b, c, d) {
        var e = c5(b, c);
        a._milliseconds += d * e._milliseconds;
        a._days += d * e._days;
        a._months += d * e._months;
        return a._bubble();
    }
    function eK(a, b) {
        return eJ(this, a, b, 1);
    }
    function eL(a, b) {
        return eJ(this, a, b, -1);
    }
    function eM(a) {
        if (a < 0) {
            return Math.floor(a);
        } else {
            return Math.ceil(a);
        }
    }
    function eN() {
        var a = this._milliseconds, b = this._days, c = this._months, d = this._data, e, f, g, h, i;
        if (!((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0))) {
            a += eM(eP(c) + b) * 864e5;
            b = 0;
            c = 0;
        }
        d.milliseconds = a % 1000;
        e = ai(a / 1000);
        d.seconds = e % 60;
        f = ai(e / 60);
        d.minutes = f % 60;
        g = ai(f / 60);
        d.hours = g % 24;
        b += ai(g / 24);
        i = ai(eO(b));
        c += i;
        b -= eM(eP(i));
        h = ai(c / 12);
        c %= 12;
        d.days = b;
        d.months = c;
        d.years = h;
        return this;
    }
    function eO(a) {
        return (a * 4800) / 146097;
    }
    function eP(a) {
        return (a * 146097) / 4800;
    }
    function eQ(a) {
        if (!this.isValid()) {
            return NaN;
        }
        var b, c, d = this._milliseconds;
        a = ac(a);
        if (a === "month" || a === "quarter" || a === "year") {
            b = this._days + d / 864e5;
            c = this._months + eO(b);
            switch(a){
                case "month":
                    return c;
                case "quarter":
                    return c / 3;
                case "year":
                    return c / 12;
            }
        } else {
            b = this._days + Math.round(eP(this._months));
            switch(a){
                case "week":
                    return b / 7 + d / 6048e5;
                case "day":
                    return b + d / 864e5;
                case "hour":
                    return b * 24 + d / 36e5;
                case "minute":
                    return b * 1440 + d / 6e4;
                case "second":
                    return b * 86400 + d / 1000;
                case "millisecond":
                    return Math.floor(b * 864e5) + d;
                default:
                    throw new Error("Unknown unit " + a);
            }
        }
    }
    function eR() {
        if (!this.isValid()) {
            return NaN;
        }
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + aj(this._months / 12) * 31536e6);
    }
    function eS(a) {
        return function() {
            return this.as(a);
        };
    }
    var eT = eS("ms"), eU = eS("s"), eV = eS("m"), eW = eS("h"), eX = eS("d"), eY = eS("w"), eZ = eS("M"), e$ = eS("Q"), e_ = eS("y");
    function e0() {
        return c5(this);
    }
    function e1(a) {
        a = ac(a);
        return this.isValid() ? this[a + "s"]() : NaN;
    }
    function e2(a) {
        return function() {
            return this.isValid() ? this._data[a] : NaN;
        };
    }
    var e3 = e2("milliseconds"), e4 = e2("seconds"), e5 = e2("minutes"), e6 = e2("hours"), e7 = e2("days"), e8 = e2("months"), e9 = e2("years");
    function fa() {
        return ai(this.days() / 7);
    }
    var fb = Math.round, fc = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    function fd(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d);
    }
    function fe(a, b, c, d) {
        var e = c5(a).abs(), f = fb(e.as("s")), g = fb(e.as("m")), h = fb(e.as("h")), i = fb(e.as("d")), j = fb(e.as("M")), k = fb(e.as("w")), l = fb(e.as("y")), m = (f <= c.ss && [
            "s",
            f
        ]) || (f < c.s && [
            "ss",
            f
        ]) || (g <= 1 && [
            "m"
        ]) || (g < c.m && [
            "mm",
            g
        ]) || (h <= 1 && [
            "h"
        ]) || (h < c.h && [
            "hh",
            h
        ]) || (i <= 1 && [
            "d"
        ]) || (i < c.d && [
            "dd",
            i
        ]);
        if (c.w != null) {
            m = m || (k <= 1 && [
                "w"
            ]) || (k < c.w && [
                "ww",
                k
            ]);
        }
        m = m || (j <= 1 && [
            "M"
        ]) || (j < c.M && [
            "MM",
            j
        ]) || (l <= 1 && [
            "y"
        ]) || [
            "yy",
            l
        ];
        m[2] = b;
        m[3] = +a > 0;
        m[4] = d;
        return fd.apply(null, m);
    }
    function ff(a) {
        if (a === undefined) {
            return fb;
        }
        if (typeof a === "function") {
            fb = a;
            return true;
        }
        return false;
    }
    function fg(a, b) {
        if (fc[a] === undefined) {
            return false;
        }
        if (b === undefined) {
            return fc[a];
        }
        fc[a] = b;
        if (a === "s") {
            fc.ss = b - 1;
        }
        return true;
    }
    function fh(a, b) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var c = false, d = fc, e, f;
        if (typeof a === "object") {
            b = a;
            a = false;
        }
        if (typeof a === "boolean") {
            c = a;
        }
        if (typeof b === "object") {
            d = Object.assign({}, fc, b);
            if (b.s != null && b.ss == null) {
                d.ss = b.s - 1;
            }
        }
        e = this.localeData();
        f = fe(this, !c, d, e);
        if (c) {
            f = e.pastFuture(+this, f);
        }
        return e.postformat(f);
    }
    var fi = Math.abs;
    function fj(a) {
        return (a > 0) - (a < 0) || +a;
    }
    function fk() {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var a = fi(this._milliseconds) / 1000, b = fi(this._days), c = fi(this._months), d, e, f, g, h = this.asSeconds(), i, j, k, l;
        if (!h) {
            return "P0D";
        }
        d = ai(a / 60);
        e = ai(d / 60);
        a %= 60;
        d %= 60;
        f = ai(c / 12);
        c %= 12;
        g = a ? a.toFixed(3).replace(/\.?0+$/, "") : "";
        i = h < 0 ? "-" : "";
        j = fj(this._months) !== fj(h) ? "-" : "";
        k = fj(this._days) !== fj(h) ? "-" : "";
        l = fj(this._milliseconds) !== fj(h) ? "-" : "";
        return (i + "P" + (f ? j + f + "Y" : "") + (c ? j + c + "M" : "") + (b ? k + b + "D" : "") + (e || d || a ? "T" : "") + (e ? l + e + "H" : "") + (d ? l + d + "M" : "") + (a ? l + g + "S" : ""));
    }
    var fl = cL.prototype;
    fl.isValid = cJ;
    fl.abs = eI;
    fl.add = eK;
    fl.subtract = eL;
    fl.as = eQ;
    fl.asMilliseconds = eT;
    fl.asSeconds = eU;
    fl.asMinutes = eV;
    fl.asHours = eW;
    fl.asDays = eX;
    fl.asWeeks = eY;
    fl.asMonths = eZ;
    fl.asQuarters = e$;
    fl.asYears = e_;
    fl.valueOf = eR;
    fl._bubble = eN;
    fl.clone = e0;
    fl.get = e1;
    fl.milliseconds = e3;
    fl.seconds = e4;
    fl.minutes = e5;
    fl.hours = e6;
    fl.days = e7;
    fl.weeks = fa;
    fl.months = e8;
    fl.years = e9;
    fl.humanize = fh;
    fl.toISOString = fk;
    fl.toString = fk;
    fl.toJSON = fk;
    fl.locale = dC;
    fl.localeData = dE;
    fl.toIsoString = y("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", fk);
    fl.lang = dD;
    N("X", 0, 0, "unix");
    N("x", 0, 0, "valueOf");
    aH("x", aB);
    aH("X", aE);
    aM("X", function(a, b, c) {
        c._d = new Date(parseFloat(a) * 1000);
    });
    aM("x", function(a, b, c) {
        c._d = new Date(aj(a));
    });
    b.version = "2.29.1";
    c(cA);
    b.fn = eu;
    b.min = cE;
    b.max = cF;
    b.now = cG;
    b.utc = m;
    b.unix = ev;
    b.months = eC;
    b.isDate = j;
    b.locale = b2;
    b.invalid = r;
    b.duration = c5;
    b.isMoment = w;
    b.weekdays = eE;
    b.parseZone = ew;
    b.localeData = b5;
    b.isDuration = cM;
    b.monthsShort = eD;
    b.weekdaysMin = eG;
    b.defineLocale = b3;
    b.updateLocale = b4;
    b.locales = b6;
    b.weekdaysShort = eF;
    b.normalizeUnits = ac;
    b.relativeTimeRounding = ff;
    b.relativeTimeThreshold = fg;
    b.calendarFormat = di;
    b.prototype = eu;
    b.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
    };
    return b;
});
