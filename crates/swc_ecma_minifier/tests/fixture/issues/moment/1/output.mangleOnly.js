(function(e, t) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = t()) : typeof define === "function" && define.amd ? define(t) : (e.moment = t());
})(this, function() {
    "use strict";
    var e;
    function t() {
        return e.apply(null, arguments);
    }
    function n(t) {
        e = t;
    }
    function i(e) {
        return (e instanceof Array || Object.prototype.toString.call(e) === "[object Array]");
    }
    function s(e) {
        return (e != null && Object.prototype.toString.call(e) === "[object Object]");
    }
    function r(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }
    function a(e) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(e).length === 0;
        } else {
            var t;
            for(t in e){
                if (r(e, t)) {
                    return false;
                }
            }
            return true;
        }
    }
    function o(e) {
        return e === void 0;
    }
    function u(e) {
        return (typeof e === "number" || Object.prototype.toString.call(e) === "[object Number]");
    }
    function l(e) {
        return (e instanceof Date || Object.prototype.toString.call(e) === "[object Date]");
    }
    function f(e, t) {
        var n = [], i;
        for(i = 0; i < e.length; ++i){
            n.push(t(e[i], i));
        }
        return n;
    }
    function h(e, t) {
        for(var n in t){
            if (r(t, n)) {
                e[n] = t[n];
            }
        }
        if (r(t, "toString")) {
            e.toString = t.toString;
        }
        if (r(t, "valueOf")) {
            e.valueOf = t.valueOf;
        }
        return e;
    }
    function d(e, t, n, i) {
        return nS(e, t, n, i, true).utc();
    }
    function c() {
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
    function m(e) {
        if (e._pf == null) {
            e._pf = c();
        }
        return e._pf;
    }
    var $;
    if (Array.prototype.some) {
        $ = Array.prototype.some;
    } else {
        $ = function(e) {
            var t = Object(this), n = t.length >>> 0, i;
            for(i = 0; i < n; i++){
                if (i in t && e.call(this, t[i], i, t)) {
                    return true;
                }
            }
            return false;
        };
    }
    function y(e) {
        if (e._isValid == null) {
            var t = m(e), n = $.call(t.parsedDateParts, function(e) {
                return e != null;
            }), i = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidEra && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || (t.meridiem && n));
            if (e._strict) {
                i = i && t.charsLeftOver === 0 && t.unusedTokens.length === 0 && t.bigHour === undefined;
            }
            if (Object.isFrozen == null || !Object.isFrozen(e)) {
                e._isValid = i;
            } else {
                return i;
            }
        }
        return e._isValid;
    }
    function g(e) {
        var t = d(NaN);
        if (e != null) {
            h(m(t), e);
        } else {
            m(t).userInvalidated = true;
        }
        return t;
    }
    var w = (t.momentProperties = []), v = false;
    function p(e, t) {
        var n, i, s;
        if (!o(t._isAMomentObject)) {
            e._isAMomentObject = t._isAMomentObject;
        }
        if (!o(t._i)) {
            e._i = t._i;
        }
        if (!o(t._f)) {
            e._f = t._f;
        }
        if (!o(t._l)) {
            e._l = t._l;
        }
        if (!o(t._strict)) {
            e._strict = t._strict;
        }
        if (!o(t._tzm)) {
            e._tzm = t._tzm;
        }
        if (!o(t._isUTC)) {
            e._isUTC = t._isUTC;
        }
        if (!o(t._offset)) {
            e._offset = t._offset;
        }
        if (!o(t._pf)) {
            e._pf = m(t);
        }
        if (!o(t._locale)) {
            e._locale = t._locale;
        }
        if (w.length > 0) {
            for(n = 0; n < w.length; n++){
                i = w[n];
                s = t[i];
                if (!o(s)) {
                    e[i] = s;
                }
            }
        }
        return e;
    }
    function k(e) {
        p(this, e);
        this._d = new Date(e._d != null ? e._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        if (v === false) {
            v = true;
            t.updateOffset(this);
            v = false;
        }
    }
    function _(e) {
        return (e instanceof k || (e != null && e._isAMomentObject != null));
    }
    function Y(e) {
        if (t.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
            console.warn("Deprecation warning: " + e);
        }
    }
    function S(e, n) {
        var i = true;
        return h(function() {
            if (t.deprecationHandler != null) {
                t.deprecationHandler(null, e);
            }
            if (i) {
                var s = [], a, o, u;
                for(o = 0; o < arguments.length; o++){
                    a = "";
                    if (typeof arguments[o] === "object") {
                        a += "\n[" + o + "] ";
                        for(u in arguments[0]){
                            if (r(arguments[0], u)) {
                                a += u + ": " + arguments[0][u] + ", ";
                            }
                        }
                        a = a.slice(0, -2);
                    } else {
                        a = arguments[o];
                    }
                    s.push(a);
                }
                Y(e + "\nArguments: " + Array.prototype.slice.call(s).join("") + "\n" + new Error().stack);
                i = false;
            }
            return n.apply(this, arguments);
        }, n);
    }
    var M = {};
    function D(e, n) {
        if (t.deprecationHandler != null) {
            t.deprecationHandler(e, n);
        }
        if (!M[e]) {
            Y(n);
            M[e] = true;
        }
    }
    t.suppressDeprecationWarnings = false;
    t.deprecationHandler = null;
    function O(e) {
        return ((typeof Function !== "undefined" && e instanceof Function) || Object.prototype.toString.call(e) === "[object Function]");
    }
    function b(e) {
        var t, n;
        for(n in e){
            if (r(e, n)) {
                t = e[n];
                if (O(t)) {
                    this[n] = t;
                } else {
                    this["_" + n] = t;
                }
            }
        }
        this._config = e;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function T(e, t) {
        var n = h({}, e), i;
        for(i in t){
            if (r(t, i)) {
                if (s(e[i]) && s(t[i])) {
                    n[i] = {};
                    h(n[i], e[i]);
                    h(n[i], t[i]);
                } else if (t[i] != null) {
                    n[i] = t[i];
                } else {
                    delete n[i];
                }
            }
        }
        for(i in e){
            if (r(e, i) && !r(t, i) && s(e[i])) {
                n[i] = h({}, n[i]);
            }
        }
        return n;
    }
    function x(e) {
        if (e != null) {
            this.set(e);
        }
    }
    var P;
    if (Object.keys) {
        P = Object.keys;
    } else {
        P = function(e) {
            var t, n = [];
            for(t in e){
                if (r(e, t)) {
                    n.push(t);
                }
            }
            return n;
        };
    }
    var W = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    function C(e, t, n) {
        var i = this._calendar[e] || this._calendar["sameElse"];
        return O(i) ? i.call(t, n) : i;
    }
    function N(e, t, n) {
        var i = "" + Math.abs(e), s = t - i.length, r = e >= 0;
        return ((r ? (n ? "+" : "") : "-") + Math.pow(10, Math.max(0, s)).toString().substr(1) + i);
    }
    var R = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, U = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, H = {}, L = {};
    function F(e, t, n, i) {
        var s = i;
        if (typeof i === "string") {
            s = function() {
                return this[i]();
            };
        }
        if (e) {
            L[e] = s;
        }
        if (t) {
            L[t[0]] = function() {
                return N(s.apply(this, arguments), t[1], t[2]);
            };
        }
        if (n) {
            L[n] = function() {
                return this.localeData().ordinal(s.apply(this, arguments), e);
            };
        }
    }
    function V(e) {
        if (e.match(/\[[\s\S]/)) {
            return e.replace(/^\[|\]$/g, "");
        }
        return e.replace(/\\/g, "");
    }
    function G(e) {
        var t = e.match(R), n, i;
        for(n = 0, i = t.length; n < i; n++){
            if (L[t[n]]) {
                t[n] = L[t[n]];
            } else {
                t[n] = V(t[n]);
            }
        }
        return function(n) {
            var s = "", r;
            for(r = 0; r < i; r++){
                s += O(t[r]) ? t[r].call(n, e) : t[r];
            }
            return s;
        };
    }
    function A(e, t) {
        if (!e.isValid()) {
            return e.localeData().invalidDate();
        }
        t = I(t, e.localeData());
        H[t] = H[t] || G(t);
        return H[t](e);
    }
    function I(e, t) {
        var n = 5;
        function i(e) {
            return t.longDateFormat(e) || e;
        }
        U.lastIndex = 0;
        while(n >= 0 && U.test(e)){
            e = e.replace(U, i);
            U.lastIndex = 0;
            n -= 1;
        }
        return e;
    }
    var E = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function j(e) {
        var t = this._longDateFormat[e], n = this._longDateFormat[e.toUpperCase()];
        if (t || !n) {
            return t;
        }
        this._longDateFormat[e] = n.match(R).map(function(e) {
            if (e === "MMMM" || e === "MM" || e === "DD" || e === "dddd") {
                return e.slice(1);
            }
            return e;
        }).join("");
        return this._longDateFormat[e];
    }
    var Z = "Invalid date";
    function z() {
        return this._invalidDate;
    }
    var q = "%d", B = /\d{1,2}/;
    function J(e) {
        return this._ordinal.replace("%d", e);
    }
    var Q = {
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
    function X(e, t, n, i) {
        var s = this._relativeTime[n];
        return O(s) ? s(e, t, n, i) : s.replace(/%d/i, e);
    }
    function K(e, t) {
        var n = this._relativeTime[e > 0 ? "future" : "past"];
        return O(n) ? n(t) : n.replace(/%s/i, t);
    }
    var ee = {};
    function et(e, t) {
        var n = e.toLowerCase();
        ee[n] = ee[n + "s"] = ee[t] = e;
    }
    function en(e) {
        return typeof e === "string" ? ee[e] || ee[e.toLowerCase()] : undefined;
    }
    function ei(e) {
        var t = {}, n, i;
        for(i in e){
            if (r(e, i)) {
                n = en(i);
                if (n) {
                    t[n] = e[i];
                }
            }
        }
        return t;
    }
    var es = {};
    function er(e, t) {
        es[e] = t;
    }
    function ea(e) {
        var t = [], n;
        for(n in e){
            if (r(e, n)) {
                t.push({
                    unit: n,
                    priority: es[n]
                });
            }
        }
        t.sort(function(e, t) {
            return e.priority - t.priority;
        });
        return t;
    }
    function eo(e) {
        return (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0;
    }
    function eu(e) {
        if (e < 0) {
            return Math.ceil(e) || 0;
        } else {
            return Math.floor(e);
        }
    }
    function el(e) {
        var t = +e, n = 0;
        if (t !== 0 && isFinite(t)) {
            n = eu(t);
        }
        return n;
    }
    function ef(e, n) {
        return function(i) {
            if (i != null) {
                ed(this, e, i);
                t.updateOffset(this, n);
                return this;
            } else {
                return eh(this, e);
            }
        };
    }
    function eh(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
    }
    function ed(e, t, n) {
        if (e.isValid() && !isNaN(n)) {
            if (t === "FullYear" && eo(e.year()) && e.month() === 1 && e.date() === 29) {
                n = el(n);
                e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), e1(n, e.month()));
            } else {
                e._d["set" + (e._isUTC ? "UTC" : "") + t](n);
            }
        }
    }
    function ec(e) {
        e = en(e);
        if (O(this[e])) {
            return this[e]();
        }
        return this;
    }
    function em(e, t) {
        if (typeof e === "object") {
            e = ei(e);
            var n = ea(e), i;
            for(i = 0; i < n.length; i++){
                this[n[i].unit](e[n[i].unit]);
            }
        } else {
            e = en(e);
            if (O(this[e])) {
                return this[e](t);
            }
        }
        return this;
    }
    var e8 = /\d/, e$ = /\d\d/, ey = /\d{3}/, eg = /\d{4}/, ew = /[+-]?\d{6}/, ev = /\d\d?/, ep = /\d\d\d\d?/, ek = /\d\d\d\d\d\d?/, e_ = /\d{1,3}/, eY = /\d{1,4}/, eS = /[+-]?\d{1,6}/, eM = /\d+/, eD = /[+-]?\d+/, eO = /Z|[+-]\d\d:?\d\d/gi, eb = /Z|[+-]\d\d(?::?\d\d)?/gi, eT = /[+-]?\d+(\.\d{1,3})?/, ex = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, e0;
    e0 = {};
    function eP(e, t, n) {
        e0[e] = O(t) ? t : function(e, i) {
            return e && n ? n : t;
        };
    }
    function eW(e, t) {
        if (!r(e0, e)) {
            return new RegExp(eC(e));
        }
        return e0[e](t._strict, t._locale);
    }
    function eC(e) {
        return eN(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, i, s) {
            return t || n || i || s;
        }));
    }
    function eN(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var eR = {};
    function eU(e, t) {
        var n, i = t;
        if (typeof e === "string") {
            e = [
                e
            ];
        }
        if (u(t)) {
            i = function(e, n) {
                n[t] = el(e);
            };
        }
        for(n = 0; n < e.length; n++){
            eR[e[n]] = i;
        }
    }
    function eH(e, t) {
        eU(e, function(e, n, i, s) {
            i._w = i._w || {};
            t(e, i._w, i, s);
        });
    }
    function e4(e, t, n) {
        if (t != null && r(eR, e)) {
            eR[e](t, n._a, n, e);
        }
    }
    var e2 = 0, eL = 1, eF = 2, eV = 3, eG = 4, eA = 5, e5 = 6, eI = 7, e7 = 8;
    function eE(e, t) {
        return ((e % t) + t) % t;
    }
    var ej;
    if (Array.prototype.indexOf) {
        ej = Array.prototype.indexOf;
    } else {
        ej = function(e) {
            var t;
            for(t = 0; t < this.length; ++t){
                if (this[t] === e) {
                    return t;
                }
            }
            return -1;
        };
    }
    function e1(e, t) {
        if (isNaN(e) || isNaN(t)) {
            return NaN;
        }
        var n = eE(t, 12);
        e += (t - n) / 12;
        return n === 1 ? eo(e) ? 29 : 28 : 31 - ((n % 7) % 2);
    }
    F("M", [
        "MM",
        2
    ], "Mo", function() {
        return this.month() + 1;
    });
    F("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    });
    F("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    });
    et("month", "M");
    er("month", 8);
    eP("M", ev);
    eP("MM", ev, e$);
    eP("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    });
    eP("MMMM", function(e, t) {
        return t.monthsRegex(e);
    });
    eU([
        "M",
        "MM"
    ], function(e, t) {
        t[eL] = el(e) - 1;
    });
    eU([
        "MMM",
        "MMMM"
    ], function(e, t, n, i) {
        var s = n._locale.monthsParse(e, i, n._strict);
        if (s != null) {
            t[eL] = s;
        } else {
            m(n).invalidMonth = e;
        }
    });
    var e3 = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), eZ = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), ez = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, e6 = ex, e9 = ex;
    function eq(e, t) {
        if (!e) {
            return i(this._months) ? this._months : this._months["standalone"];
        }
        return i(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || ez).test(t) ? "format" : "standalone"][e.month()];
    }
    function eB(e, t) {
        if (!e) {
            return i(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return i(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[ez.test(t) ? "format" : "standalone"][e.month()];
    }
    function eJ(e, t, n) {
        var i, s, r, a = e.toLocaleLowerCase();
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for(i = 0; i < 12; ++i){
                r = d([
                    2000,
                    i
                ]);
                this._shortMonthsParse[i] = this.monthsShort(r, "").toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(r, "").toLocaleLowerCase();
            }
        }
        if (n) {
            if (t === "MMM") {
                s = ej.call(this._shortMonthsParse, a);
                return s !== -1 ? s : null;
            } else {
                s = ej.call(this._longMonthsParse, a);
                return s !== -1 ? s : null;
            }
        } else {
            if (t === "MMM") {
                s = ej.call(this._shortMonthsParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._longMonthsParse, a);
                return s !== -1 ? s : null;
            } else {
                s = ej.call(this._longMonthsParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._shortMonthsParse, a);
                return s !== -1 ? s : null;
            }
        }
    }
    function eQ(e, t, n) {
        var i, s, r;
        if (this._monthsParseExact) {
            return eJ.call(this, e, t, n);
        }
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for(i = 0; i < 12; i++){
            s = d([
                2000,
                i
            ]);
            if (n && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp("^" + this.months(s, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(s, "").replace(".", "") + "$", "i");
            }
            if (!n && !this._monthsParse[i]) {
                r = "^" + this.months(s, "") + "|^" + this.monthsShort(s, "");
                this._monthsParse[i] = new RegExp(r.replace(".", ""), "i");
            }
            if (n && t === "MMMM" && this._longMonthsParse[i].test(e)) {
                return i;
            } else if (n && t === "MMM" && this._shortMonthsParse[i].test(e)) {
                return i;
            } else if (!n && this._monthsParse[i].test(e)) {
                return i;
            }
        }
    }
    function eX(e, t) {
        var n;
        if (!e.isValid()) {
            return e;
        }
        if (typeof t === "string") {
            if (/^\d+$/.test(t)) {
                t = el(t);
            } else {
                t = e.localeData().monthsParse(t);
                if (!u(t)) {
                    return e;
                }
            }
        }
        n = Math.min(e.date(), e1(e.year(), t));
        e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n);
        return e;
    }
    function eK(e) {
        if (e != null) {
            eX(this, e);
            t.updateOffset(this, true);
            return this;
        } else {
            return eh(this, "Month");
        }
    }
    function te() {
        return e1(this.year(), this.month());
    }
    function tt(e) {
        if (this._monthsParseExact) {
            if (!r(this, "_monthsRegex")) {
                ti.call(this);
            }
            if (e) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!r(this, "_monthsShortRegex")) {
                this._monthsShortRegex = e6;
            }
            return this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }
    function tn(e) {
        if (this._monthsParseExact) {
            if (!r(this, "_monthsRegex")) {
                ti.call(this);
            }
            if (e) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!r(this, "_monthsRegex")) {
                this._monthsRegex = e9;
            }
            return this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex;
        }
    }
    function ti() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], n = [], i = [], s, r;
        for(s = 0; s < 12; s++){
            r = d([
                2000,
                s
            ]);
            t.push(this.monthsShort(r, ""));
            n.push(this.months(r, ""));
            i.push(this.months(r, ""));
            i.push(this.monthsShort(r, ""));
        }
        t.sort(e);
        n.sort(e);
        i.sort(e);
        for(s = 0; s < 12; s++){
            t[s] = eN(t[s]);
            n[s] = eN(n[s]);
        }
        for(s = 0; s < 24; s++){
            i[s] = eN(i[s]);
        }
        this._monthsRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    F("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? N(e, 4) : "+" + e;
    });
    F(0, [
        "YY",
        2
    ], 0, function() {
        return this.year() % 100;
    });
    F(0, [
        "YYYY",
        4
    ], 0, "year");
    F(0, [
        "YYYYY",
        5
    ], 0, "year");
    F(0, [
        "YYYYYY",
        6,
        true
    ], 0, "year");
    et("year", "y");
    er("year", 1);
    eP("Y", eD);
    eP("YY", ev, e$);
    eP("YYYY", eY, eg);
    eP("YYYYY", eS, ew);
    eP("YYYYYY", eS, ew);
    eU([
        "YYYYY",
        "YYYYYY"
    ], e2);
    eU("YYYY", function(e, n) {
        n[e2] = e.length === 2 ? t.parseTwoDigitYear(e) : el(e);
    });
    eU("YY", function(e, n) {
        n[e2] = t.parseTwoDigitYear(e);
    });
    eU("Y", function(e, t) {
        t[e2] = parseInt(e, 10);
    });
    function ts(e) {
        return eo(e) ? 366 : 365;
    }
    t.parseTwoDigitYear = function(e) {
        return el(e) + (el(e) > 68 ? 1900 : 2000);
    };
    var tr = ef("FullYear", true);
    function ta() {
        return eo(this.year());
    }
    function to(e, t, n, i, s, r, a) {
        var o;
        if (e < 100 && e >= 0) {
            o = new Date(e + 400, t, n, i, s, r, a);
            if (isFinite(o.getFullYear())) {
                o.setFullYear(e);
            }
        } else {
            o = new Date(e, t, n, i, s, r, a);
        }
        return o;
    }
    function tu(e) {
        var t, n;
        if (e < 100 && e >= 0) {
            n = Array.prototype.slice.call(arguments);
            n[0] = e + 400;
            t = new Date(Date.UTC.apply(null, n));
            if (isFinite(t.getUTCFullYear())) {
                t.setUTCFullYear(e);
            }
        } else {
            t = new Date(Date.UTC.apply(null, arguments));
        }
        return t;
    }
    function tl(e, t, n) {
        var i = 7 + t - n, s = (7 + tu(e, 0, i).getUTCDay() - t) % 7;
        return -s + i - 1;
    }
    function tf(e, t, n, i, s) {
        var r = (7 + n - i) % 7, a = tl(e, i, s), o = 1 + 7 * (t - 1) + r + a, u, l;
        if (o <= 0) {
            u = e - 1;
            l = ts(u) + o;
        } else if (o > ts(e)) {
            u = e + 1;
            l = o - ts(e);
        } else {
            u = e;
            l = o;
        }
        return {
            year: u,
            dayOfYear: l
        };
    }
    function th(e, t, n) {
        var i = tl(e.year(), t, n), s = Math.floor((e.dayOfYear() - i - 1) / 7) + 1, r, a;
        if (s < 1) {
            a = e.year() - 1;
            r = s + td(a, t, n);
        } else if (s > td(e.year(), t, n)) {
            r = s - td(e.year(), t, n);
            a = e.year() + 1;
        } else {
            a = e.year();
            r = s;
        }
        return {
            week: r,
            year: a
        };
    }
    function td(e, t, n) {
        var i = tl(e, t, n), s = tl(e + 1, t, n);
        return (ts(e) - i + s) / 7;
    }
    F("w", [
        "ww",
        2
    ], "wo", "week");
    F("W", [
        "WW",
        2
    ], "Wo", "isoWeek");
    et("week", "w");
    et("isoWeek", "W");
    er("week", 5);
    er("isoWeek", 5);
    eP("w", ev);
    eP("ww", ev, e$);
    eP("W", ev);
    eP("WW", ev, e$);
    eH([
        "w",
        "ww",
        "W",
        "WW"
    ], function(e, t, n, i) {
        t[i.substr(0, 1)] = el(e);
    });
    function tc(e) {
        return th(e, this._week.dow, this._week.doy).week;
    }
    var tm = {
        dow: 0,
        doy: 6
    };
    function t8() {
        return this._week.dow;
    }
    function t$() {
        return this._week.doy;
    }
    function ty(e) {
        var t = this.localeData().week(this);
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    function tg(e) {
        var t = th(this, 1, 4).week;
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    F("d", 0, "do", "day");
    F("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e);
    });
    F("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e);
    });
    F("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e);
    });
    F("e", 0, 0, "weekday");
    F("E", 0, 0, "isoWeekday");
    et("day", "d");
    et("weekday", "e");
    et("isoWeekday", "E");
    er("day", 11);
    er("weekday", 11);
    er("isoWeekday", 11);
    eP("d", ev);
    eP("e", ev);
    eP("E", ev);
    eP("dd", function(e, t) {
        return t.weekdaysMinRegex(e);
    });
    eP("ddd", function(e, t) {
        return t.weekdaysShortRegex(e);
    });
    eP("dddd", function(e, t) {
        return t.weekdaysRegex(e);
    });
    eH([
        "dd",
        "ddd",
        "dddd"
    ], function(e, t, n, i) {
        var s = n._locale.weekdaysParse(e, i, n._strict);
        if (s != null) {
            t.d = s;
        } else {
            m(n).invalidWeekday = e;
        }
    });
    eH([
        "d",
        "e",
        "E"
    ], function(e, t, n, i) {
        t[i] = el(e);
    });
    function tw(e, t) {
        if (typeof e !== "string") {
            return e;
        }
        if (!isNaN(e)) {
            return parseInt(e, 10);
        }
        e = t.weekdaysParse(e);
        if (typeof e === "number") {
            return e;
        }
        return null;
    }
    function tv(e, t) {
        if (typeof e === "string") {
            return t.weekdaysParse(e) % 7 || 7;
        }
        return isNaN(e) ? null : e;
    }
    function tp(e, t) {
        return e.slice(t, 7).concat(e.slice(0, t));
    }
    var tk = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), t_ = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), tY = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), tS = ex, tM = ex, tD = ex;
    function tO(e, t) {
        var n = i(this._weekdays) ? this._weekdays : this._weekdays[e && e !== true && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
        return e === true ? tp(n, this._week.dow) : e ? n[e.day()] : n;
    }
    function tb(e) {
        return e === true ? tp(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
    }
    function tT(e) {
        return e === true ? tp(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
    }
    function tx(e, t, n) {
        var i, s, r, a = e.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];
            for(i = 0; i < 7; ++i){
                r = d([
                    2000,
                    1
                ]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(r, "").toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(r, "").toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(r, "").toLocaleLowerCase();
            }
        }
        if (n) {
            if (t === "dddd") {
                s = ej.call(this._weekdaysParse, a);
                return s !== -1 ? s : null;
            } else if (t === "ddd") {
                s = ej.call(this._shortWeekdaysParse, a);
                return s !== -1 ? s : null;
            } else {
                s = ej.call(this._minWeekdaysParse, a);
                return s !== -1 ? s : null;
            }
        } else {
            if (t === "dddd") {
                s = ej.call(this._weekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._shortWeekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._minWeekdaysParse, a);
                return s !== -1 ? s : null;
            } else if (t === "ddd") {
                s = ej.call(this._shortWeekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._weekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._minWeekdaysParse, a);
                return s !== -1 ? s : null;
            } else {
                s = ej.call(this._minWeekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._weekdaysParse, a);
                if (s !== -1) {
                    return s;
                }
                s = ej.call(this._shortWeekdaysParse, a);
                return s !== -1 ? s : null;
            }
        }
    }
    function t0(e, t, n) {
        var i, s, r;
        if (this._weekdaysParseExact) {
            return tx.call(this, e, t, n);
        }
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for(i = 0; i < 7; i++){
            s = d([
                2000,
                1
            ]).day(i);
            if (n && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp("^" + this.weekdays(s, "").replace(".", "\\.?") + "$", "i");
                this._shortWeekdaysParse[i] = new RegExp("^" + this.weekdaysShort(s, "").replace(".", "\\.?") + "$", "i");
                this._minWeekdaysParse[i] = new RegExp("^" + this.weekdaysMin(s, "").replace(".", "\\.?") + "$", "i");
            }
            if (!this._weekdaysParse[i]) {
                r = "^" + this.weekdays(s, "") + "|^" + this.weekdaysShort(s, "") + "|^" + this.weekdaysMin(s, "");
                this._weekdaysParse[i] = new RegExp(r.replace(".", ""), "i");
            }
            if (n && t === "dddd" && this._fullWeekdaysParse[i].test(e)) {
                return i;
            } else if (n && t === "ddd" && this._shortWeekdaysParse[i].test(e)) {
                return i;
            } else if (n && t === "dd" && this._minWeekdaysParse[i].test(e)) {
                return i;
            } else if (!n && this._weekdaysParse[i].test(e)) {
                return i;
            }
        }
    }
    function tP(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (e != null) {
            e = tw(e, this.localeData());
            return this.add(e - t, "d");
        } else {
            return t;
        }
    }
    function tW(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return e == null ? t : this.add(e - t, "d");
    }
    function tC(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        if (e != null) {
            var t = tv(e, this.localeData());
            return this.day(this.day() % 7 ? t : t - 7);
        } else {
            return this.day() || 7;
        }
    }
    function tN(e) {
        if (this._weekdaysParseExact) {
            if (!r(this, "_weekdaysRegex")) {
                tH.call(this);
            }
            if (e) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!r(this, "_weekdaysRegex")) {
                this._weekdaysRegex = tS;
            }
            return this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }
    function tR(e) {
        if (this._weekdaysParseExact) {
            if (!r(this, "_weekdaysRegex")) {
                tH.call(this);
            }
            if (e) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!r(this, "_weekdaysShortRegex")) {
                this._weekdaysShortRegex = tM;
            }
            return this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }
    function tU(e) {
        if (this._weekdaysParseExact) {
            if (!r(this, "_weekdaysRegex")) {
                tH.call(this);
            }
            if (e) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!r(this, "_weekdaysMinRegex")) {
                this._weekdaysMinRegex = tD;
            }
            return this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }
    function tH() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], n = [], i = [], s = [], r, a, o, u, l;
        for(r = 0; r < 7; r++){
            a = d([
                2000,
                1
            ]).day(r);
            o = eN(this.weekdaysMin(a, ""));
            u = eN(this.weekdaysShort(a, ""));
            l = eN(this.weekdays(a, ""));
            t.push(o);
            n.push(u);
            i.push(l);
            s.push(o);
            s.push(u);
            s.push(l);
        }
        t.sort(e);
        n.sort(e);
        i.sort(e);
        s.sort(e);
        this._weekdaysRegex = new RegExp("^(" + s.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    function t4() {
        return this.hours() % 12 || 12;
    }
    function t2() {
        return this.hours() || 24;
    }
    F("H", [
        "HH",
        2
    ], 0, "hour");
    F("h", [
        "hh",
        2
    ], 0, t4);
    F("k", [
        "kk",
        2
    ], 0, t2);
    F("hmm", 0, 0, function() {
        return "" + t4.apply(this) + N(this.minutes(), 2);
    });
    F("hmmss", 0, 0, function() {
        return ("" + t4.apply(this) + N(this.minutes(), 2) + N(this.seconds(), 2));
    });
    F("Hmm", 0, 0, function() {
        return "" + this.hours() + N(this.minutes(), 2);
    });
    F("Hmmss", 0, 0, function() {
        return ("" + this.hours() + N(this.minutes(), 2) + N(this.seconds(), 2));
    });
    function tL(e, t) {
        F(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }
    tL("a", true);
    tL("A", false);
    et("hour", "h");
    er("hour", 13);
    function tF(e, t) {
        return t._meridiemParse;
    }
    eP("a", tF);
    eP("A", tF);
    eP("H", ev);
    eP("h", ev);
    eP("k", ev);
    eP("HH", ev, e$);
    eP("hh", ev, e$);
    eP("kk", ev, e$);
    eP("hmm", ep);
    eP("hmmss", ek);
    eP("Hmm", ep);
    eP("Hmmss", ek);
    eU([
        "H",
        "HH"
    ], eV);
    eU([
        "k",
        "kk"
    ], function(e, t, n) {
        var i = el(e);
        t[eV] = i === 24 ? 0 : i;
    });
    eU([
        "a",
        "A"
    ], function(e, t, n) {
        n._isPm = n._locale.isPM(e);
        n._meridiem = e;
    });
    eU([
        "h",
        "hh"
    ], function(e, t, n) {
        t[eV] = el(e);
        m(n).bigHour = true;
    });
    eU("hmm", function(e, t, n) {
        var i = e.length - 2;
        t[eV] = el(e.substr(0, i));
        t[eG] = el(e.substr(i));
        m(n).bigHour = true;
    });
    eU("hmmss", function(e, t, n) {
        var i = e.length - 4, s = e.length - 2;
        t[eV] = el(e.substr(0, i));
        t[eG] = el(e.substr(i, 2));
        t[eA] = el(e.substr(s));
        m(n).bigHour = true;
    });
    eU("Hmm", function(e, t, n) {
        var i = e.length - 2;
        t[eV] = el(e.substr(0, i));
        t[eG] = el(e.substr(i));
    });
    eU("Hmmss", function(e, t, n) {
        var i = e.length - 4, s = e.length - 2;
        t[eV] = el(e.substr(0, i));
        t[eG] = el(e.substr(i, 2));
        t[eA] = el(e.substr(s));
    });
    function tV(e) {
        return (e + "").toLowerCase().charAt(0) === "p";
    }
    var tG = /[ap]\.?m?\.?/i, tA = ef("Hours", true);
    function t5(e, t, n) {
        if (e > 11) {
            return n ? "pm" : "PM";
        } else {
            return n ? "am" : "AM";
        }
    }
    var tI = {
        calendar: W,
        longDateFormat: E,
        invalidDate: Z,
        ordinal: q,
        dayOfMonthOrdinalParse: B,
        relativeTime: Q,
        months: e3,
        monthsShort: eZ,
        week: tm,
        weekdays: tk,
        weekdaysMin: tY,
        weekdaysShort: t_,
        meridiemParse: tG
    };
    var t7 = {}, tE = {}, tj;
    function t1(e, t) {
        var n, i = Math.min(e.length, t.length);
        for(n = 0; n < i; n += 1){
            if (e[n] !== t[n]) {
                return n;
            }
        }
        return i;
    }
    function t3(e) {
        return e ? e.toLowerCase().replace("_", "-") : e;
    }
    function tZ(e) {
        var t = 0, n, i, s, r;
        while(t < e.length){
            r = t3(e[t]).split("-");
            n = r.length;
            i = t3(e[t + 1]);
            i = i ? i.split("-") : null;
            while(n > 0){
                s = tz(r.slice(0, n).join("-"));
                if (s) {
                    return s;
                }
                if (i && i.length >= n && t1(r, i) >= n - 1) {
                    break;
                }
                n--;
            }
            t++;
        }
        return tj;
    }
    function tz(e) {
        var t = null, n;
        if (t7[e] === undefined && typeof module !== "undefined" && module && module.exports) {
            try {
                t = tj._abbr;
                n = require;
                n("./locale/" + e);
                t6(t);
            } catch (i) {
                t7[e] = null;
            }
        }
        return t7[e];
    }
    function t6(e, t) {
        var n;
        if (e) {
            if (o(t)) {
                n = tB(e);
            } else {
                n = t9(e, t);
            }
            if (n) {
                tj = n;
            } else {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Locale " + e + " not found. Did you forget to load it?");
                }
            }
        }
        return tj._abbr;
    }
    function t9(e, t) {
        if (t !== null) {
            var n, i = tI;
            t.abbr = e;
            if (t7[e] != null) {
                D("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change " + "an existing locale. moment.defineLocale(localeName, " + "config) should only be used for creating a new locale " + "See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
                i = t7[e]._config;
            } else if (t.parentLocale != null) {
                if (t7[t.parentLocale] != null) {
                    i = t7[t.parentLocale]._config;
                } else {
                    n = tz(t.parentLocale);
                    if (n != null) {
                        i = n._config;
                    } else {
                        if (!tE[t.parentLocale]) {
                            tE[t.parentLocale] = [];
                        }
                        tE[t.parentLocale].push({
                            name: e,
                            config: t
                        });
                        return null;
                    }
                }
            }
            t7[e] = new x(T(i, t));
            if (tE[e]) {
                tE[e].forEach(function(e) {
                    t9(e.name, e.config);
                });
            }
            t6(e);
            return t7[e];
        } else {
            delete t7[e];
            return null;
        }
    }
    function tq(e, t) {
        if (t != null) {
            var n, i, s = tI;
            if (t7[e] != null && t7[e].parentLocale != null) {
                t7[e].set(T(t7[e]._config, t));
            } else {
                i = tz(e);
                if (i != null) {
                    s = i._config;
                }
                t = T(s, t);
                if (i == null) {
                    t.abbr = e;
                }
                n = new x(t);
                n.parentLocale = t7[e];
                t7[e] = n;
            }
            t6(e);
        } else {
            if (t7[e] != null) {
                if (t7[e].parentLocale != null) {
                    t7[e] = t7[e].parentLocale;
                    if (e === t6()) {
                        t6(e);
                    }
                } else if (t7[e] != null) {
                    delete t7[e];
                }
            }
        }
        return t7[e];
    }
    function tB(e) {
        var t;
        if (e && e._locale && e._locale._abbr) {
            e = e._locale._abbr;
        }
        if (!e) {
            return tj;
        }
        if (!i(e)) {
            t = tz(e);
            if (t) {
                return t;
            }
            e = [
                e
            ];
        }
        return tZ(e);
    }
    function tJ() {
        return P(t7);
    }
    function tQ(e) {
        var t, n = e._a;
        if (n && m(e).overflow === -2) {
            t = n[eL] < 0 || n[eL] > 11 ? eL : n[eF] < 1 || n[eF] > e1(n[e2], n[eL]) ? eF : n[eV] < 0 || n[eV] > 24 || (n[eV] === 24 && (n[eG] !== 0 || n[eA] !== 0 || n[e5] !== 0)) ? eV : n[eG] < 0 || n[eG] > 59 ? eG : n[eA] < 0 || n[eA] > 59 ? eA : n[e5] < 0 || n[e5] > 999 ? e5 : -1;
            if (m(e)._overflowDayOfYear && (t < e2 || t > eF)) {
                t = eF;
            }
            if (m(e)._overflowWeeks && t === -1) {
                t = eI;
            }
            if (m(e)._overflowWeekday && t === -1) {
                t = e7;
            }
            m(e).overflow = t;
        }
        return e;
    }
    var tX = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tK = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ne = /Z|[+-]\d\d(?::?\d\d)?/, nt = [
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
    ], nn = [
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
    ], ni = /^\/?Date\((-?\d+)/i, ns = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, nr = {
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
    function na(e) {
        var t, n, i = e._i, s = tX.exec(i) || tK.exec(i), r, a, o, u;
        if (s) {
            m(e).iso = true;
            for(t = 0, n = nt.length; t < n; t++){
                if (nt[t][1].exec(s[1])) {
                    a = nt[t][0];
                    r = nt[t][2] !== false;
                    break;
                }
            }
            if (a == null) {
                e._isValid = false;
                return;
            }
            if (s[3]) {
                for(t = 0, n = nn.length; t < n; t++){
                    if (nn[t][1].exec(s[3])) {
                        o = (s[2] || " ") + nn[t][0];
                        break;
                    }
                }
                if (o == null) {
                    e._isValid = false;
                    return;
                }
            }
            if (!r && o != null) {
                e._isValid = false;
                return;
            }
            if (s[4]) {
                if (ne.exec(s[4])) {
                    u = "Z";
                } else {
                    e._isValid = false;
                    return;
                }
            }
            e._f = a + (o || "") + (u || "");
            ng(e);
        } else {
            e._isValid = false;
        }
    }
    function no(e, t, n, i, s, r) {
        var a = [
            nu(e),
            eZ.indexOf(t),
            parseInt(n, 10),
            parseInt(i, 10),
            parseInt(s, 10), 
        ];
        if (r) {
            a.push(parseInt(r, 10));
        }
        return a;
    }
    function nu(e) {
        var t = parseInt(e, 10);
        if (t <= 49) {
            return 2000 + t;
        } else if (t <= 999) {
            return 1900 + t;
        }
        return t;
    }
    function nl(e) {
        return e.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function nf(e, t, n) {
        if (e) {
            var i = t_.indexOf(e), s = new Date(t[0], t[1], t[2]).getDay();
            if (i !== s) {
                m(n).weekdayMismatch = true;
                n._isValid = false;
                return false;
            }
        }
        return true;
    }
    function nh(e, t, n) {
        if (e) {
            return nr[e];
        } else if (t) {
            return 0;
        } else {
            var i = parseInt(n, 10), s = i % 100, r = (i - s) / 100;
            return r * 60 + s;
        }
    }
    function nd(e) {
        var t = ns.exec(nl(e._i)), n;
        if (t) {
            n = no(t[4], t[3], t[2], t[5], t[6], t[7]);
            if (!nf(t[1], n, e)) {
                return;
            }
            e._a = n;
            e._tzm = nh(t[8], t[9], t[10]);
            e._d = tu.apply(null, e._a);
            e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
            m(e).rfc2822 = true;
        } else {
            e._isValid = false;
        }
    }
    function nc(e) {
        var n = ni.exec(e._i);
        if (n !== null) {
            e._d = new Date(+n[1]);
            return;
        }
        na(e);
        if (e._isValid === false) {
            delete e._isValid;
        } else {
            return;
        }
        nd(e);
        if (e._isValid === false) {
            delete e._isValid;
        } else {
            return;
        }
        if (e._strict) {
            e._isValid = false;
        } else {
            t.createFromInputFallback(e);
        }
    }
    t.createFromInputFallback = S("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), " + "which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are " + "discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
    });
    function nm(e, t, n) {
        if (e != null) {
            return e;
        }
        if (t != null) {
            return t;
        }
        return n;
    }
    function n8(e) {
        var n = new Date(t.now());
        if (e._useUTC) {
            return [
                n.getUTCFullYear(),
                n.getUTCMonth(),
                n.getUTCDate(), 
            ];
        }
        return [
            n.getFullYear(),
            n.getMonth(),
            n.getDate(), 
        ];
    }
    function n$(e) {
        var t, n, i = [], s, r, a;
        if (e._d) {
            return;
        }
        s = n8(e);
        if (e._w && e._a[eF] == null && e._a[eL] == null) {
            ny(e);
        }
        if (e._dayOfYear != null) {
            a = nm(e._a[e2], s[e2]);
            if (e._dayOfYear > ts(a) || e._dayOfYear === 0) {
                m(e)._overflowDayOfYear = true;
            }
            n = tu(a, 0, e._dayOfYear);
            e._a[eL] = n.getUTCMonth();
            e._a[eF] = n.getUTCDate();
        }
        for(t = 0; t < 3 && e._a[t] == null; ++t){
            e._a[t] = i[t] = s[t];
        }
        for(; t < 7; t++){
            e._a[t] = i[t] = e._a[t] == null ? (t === 2 ? 1 : 0) : e._a[t];
        }
        if (e._a[eV] === 24 && e._a[eG] === 0 && e._a[eA] === 0 && e._a[e5] === 0) {
            e._nextDay = true;
            e._a[eV] = 0;
        }
        e._d = (e._useUTC ? tu : to).apply(null, i);
        r = e._useUTC ? e._d.getUTCDay() : e._d.getDay();
        if (e._tzm != null) {
            e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
        }
        if (e._nextDay) {
            e._a[eV] = 24;
        }
        if (e._w && typeof e._w.d !== "undefined" && e._w.d !== r) {
            m(e).weekdayMismatch = true;
        }
    }
    function ny(e) {
        var t, n, i, s, r, a, o, u, l;
        t = e._w;
        if (t.GG != null || t.W != null || t.E != null) {
            r = 1;
            a = 4;
            n = nm(t.GG, e._a[e2], th(nM(), 1, 4).year);
            i = nm(t.W, 1);
            s = nm(t.E, 1);
            if (s < 1 || s > 7) {
                u = true;
            }
        } else {
            r = e._locale._week.dow;
            a = e._locale._week.doy;
            l = th(nM(), r, a);
            n = nm(t.gg, e._a[e2], l.year);
            i = nm(t.w, l.week);
            if (t.d != null) {
                s = t.d;
                if (s < 0 || s > 6) {
                    u = true;
                }
            } else if (t.e != null) {
                s = t.e + r;
                if (t.e < 0 || t.e > 6) {
                    u = true;
                }
            } else {
                s = r;
            }
        }
        if (i < 1 || i > td(n, r, a)) {
            m(e)._overflowWeeks = true;
        } else if (u != null) {
            m(e)._overflowWeekday = true;
        } else {
            o = tf(n, i, s, r, a);
            e._a[e2] = o.year;
            e._dayOfYear = o.dayOfYear;
        }
    }
    t.ISO_8601 = function() {};
    t.RFC_2822 = function() {};
    function ng(e) {
        if (e._f === t.ISO_8601) {
            na(e);
            return;
        }
        if (e._f === t.RFC_2822) {
            nd(e);
            return;
        }
        e._a = [];
        m(e).empty = true;
        var n = "" + e._i, i, s, r, a, o, u = n.length, l = 0, f;
        r = I(e._f, e._locale).match(R) || [];
        for(i = 0; i < r.length; i++){
            a = r[i];
            s = (n.match(eW(a, e)) || [])[0];
            if (s) {
                o = n.substr(0, n.indexOf(s));
                if (o.length > 0) {
                    m(e).unusedInput.push(o);
                }
                n = n.slice(n.indexOf(s) + s.length);
                l += s.length;
            }
            if (L[a]) {
                if (s) {
                    m(e).empty = false;
                } else {
                    m(e).unusedTokens.push(a);
                }
                e4(a, s, e);
            } else if (e._strict && !s) {
                m(e).unusedTokens.push(a);
            }
        }
        m(e).charsLeftOver = u - l;
        if (n.length > 0) {
            m(e).unusedInput.push(n);
        }
        if (e._a[eV] <= 12 && m(e).bigHour === true && e._a[eV] > 0) {
            m(e).bigHour = undefined;
        }
        m(e).parsedDateParts = e._a.slice(0);
        m(e).meridiem = e._meridiem;
        e._a[eV] = nw(e._locale, e._a[eV], e._meridiem);
        f = m(e).era;
        if (f !== null) {
            e._a[e2] = e._locale.erasConvertYear(f, e._a[e2]);
        }
        n$(e);
        tQ(e);
    }
    function nw(e, t, n) {
        var i;
        if (n == null) {
            return t;
        }
        if (e.meridiemHour != null) {
            return e.meridiemHour(t, n);
        } else if (e.isPM != null) {
            i = e.isPM(n);
            if (i && t < 12) {
                t += 12;
            }
            if (!i && t === 12) {
                t = 0;
            }
            return t;
        } else {
            return t;
        }
    }
    function nv(e) {
        var t, n, i, s, r, a, o = false;
        if (e._f.length === 0) {
            m(e).invalidFormat = true;
            e._d = new Date(NaN);
            return;
        }
        for(s = 0; s < e._f.length; s++){
            r = 0;
            a = false;
            t = p({}, e);
            if (e._useUTC != null) {
                t._useUTC = e._useUTC;
            }
            t._f = e._f[s];
            ng(t);
            if (y(t)) {
                a = true;
            }
            r += m(t).charsLeftOver;
            r += m(t).unusedTokens.length * 10;
            m(t).score = r;
            if (!o) {
                if (i == null || r < i || a) {
                    i = r;
                    n = t;
                    if (a) {
                        o = true;
                    }
                }
            } else {
                if (r < i) {
                    i = r;
                    n = t;
                }
            }
        }
        h(e, n || t);
    }
    function np(e) {
        if (e._d) {
            return;
        }
        var t = ei(e._i), n = t.day === undefined ? t.date : t.day;
        e._a = f([
            t.year,
            t.month,
            n,
            t.hour,
            t.minute,
            t.second,
            t.millisecond, 
        ], function(e) {
            return e && parseInt(e, 10);
        });
        n$(e);
    }
    function nk(e) {
        var t = new k(tQ(n_(e)));
        if (t._nextDay) {
            t.add(1, "d");
            t._nextDay = undefined;
        }
        return t;
    }
    function n_(e) {
        var t = e._i, n = e._f;
        e._locale = e._locale || tB(e._l);
        if (t === null || (n === undefined && t === "")) {
            return g({
                nullInput: true
            });
        }
        if (typeof t === "string") {
            e._i = t = e._locale.preparse(t);
        }
        if (_(t)) {
            return new k(tQ(t));
        } else if (l(t)) {
            e._d = t;
        } else if (i(n)) {
            nv(e);
        } else if (n) {
            ng(e);
        } else {
            nY(e);
        }
        if (!y(e)) {
            e._d = null;
        }
        return e;
    }
    function nY(e) {
        var n = e._i;
        if (o(n)) {
            e._d = new Date(t.now());
        } else if (l(n)) {
            e._d = new Date(n.valueOf());
        } else if (typeof n === "string") {
            nc(e);
        } else if (i(n)) {
            e._a = f(n.slice(0), function(e) {
                return parseInt(e, 10);
            });
            n$(e);
        } else if (s(n)) {
            np(e);
        } else if (u(n)) {
            e._d = new Date(n);
        } else {
            t.createFromInputFallback(e);
        }
    }
    function nS(e, t, n, r, o) {
        var u = {};
        if (t === true || t === false) {
            r = t;
            t = undefined;
        }
        if (n === true || n === false) {
            r = n;
            n = undefined;
        }
        if ((s(e) && a(e)) || (i(e) && e.length === 0)) {
            e = undefined;
        }
        u._isAMomentObject = true;
        u._useUTC = u._isUTC = o;
        u._l = n;
        u._i = e;
        u._f = t;
        u._strict = r;
        return nk(u);
    }
    function nM(e, t, n, i) {
        return nS(e, t, n, i, false);
    }
    var nD = S("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = nM.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e < this ? this : e;
        } else {
            return g();
        }
    }), nO = S("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = nM.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e > this ? this : e;
        } else {
            return g();
        }
    });
    function nb(e, t) {
        var n, s;
        if (t.length === 1 && i(t[0])) {
            t = t[0];
        }
        if (!t.length) {
            return nM();
        }
        n = t[0];
        for(s = 1; s < t.length; ++s){
            if (!t[s].isValid() || t[s][e](n)) {
                n = t[s];
            }
        }
        return n;
    }
    function nT() {
        var e = [].slice.call(arguments, 0);
        return nb("isBefore", e);
    }
    function nx() {
        var e = [].slice.call(arguments, 0);
        return nb("isAfter", e);
    }
    var n0 = function() {
        return Date.now ? Date.now() : +new Date();
    };
    var nP = [
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
    function nW(e) {
        var t, n = false, i;
        for(t in e){
            if (r(e, t) && !(ej.call(nP, t) !== -1 && (e[t] == null || !isNaN(e[t])))) {
                return false;
            }
        }
        for(i = 0; i < nP.length; ++i){
            if (e[nP[i]]) {
                if (n) {
                    return false;
                }
                if (parseFloat(e[nP[i]]) !== el(e[nP[i]])) {
                    n = true;
                }
            }
        }
        return true;
    }
    function nC() {
        return this._isValid;
    }
    function nN() {
        return nB(NaN);
    }
    function nR(e) {
        var t = ei(e), n = t.year || 0, i = t.quarter || 0, s = t.month || 0, r = t.week || t.isoWeek || 0, a = t.day || 0, o = t.hour || 0, u = t.minute || 0, l = t.second || 0, f = t.millisecond || 0;
        this._isValid = nW(t);
        this._milliseconds = +f + l * 1e3 + u * 6e4 + o * 1000 * 60 * 60;
        this._days = +a + r * 7;
        this._months = +s + i * 3 + n * 12;
        this._data = {};
        this._locale = tB();
        this._bubble();
    }
    function nU(e) {
        return e instanceof nR;
    }
    function nH(e) {
        if (e < 0) {
            return Math.round(-1 * e) * -1;
        } else {
            return Math.round(e);
        }
    }
    function n4(e, t, n) {
        var i = Math.min(e.length, t.length), s = Math.abs(e.length - t.length), r = 0, a;
        for(a = 0; a < i; a++){
            if ((n && e[a] !== t[a]) || (!n && el(e[a]) !== el(t[a]))) {
                r++;
            }
        }
        return r + s;
    }
    function n2(e, t) {
        F(e, 0, 0, function() {
            var e = this.utcOffset(), n = "+";
            if (e < 0) {
                e = -e;
                n = "-";
            }
            return (n + N(~~(e / 60), 2) + t + N(~~e % 60, 2));
        });
    }
    n2("Z", ":");
    n2("ZZ", "");
    eP("Z", eb);
    eP("ZZ", eb);
    eU([
        "Z",
        "ZZ"
    ], function(e, t, n) {
        n._useUTC = true;
        n._tzm = nF(eb, e);
    });
    var nL = /([\+\-]|\d\d)/gi;
    function nF(e, t) {
        var n = (t || "").match(e), i, s, r;
        if (n === null) {
            return null;
        }
        i = n[n.length - 1] || [];
        s = (i + "").match(nL) || [
            "-",
            0,
            0
        ];
        r = +(s[1] * 60) + el(s[2]);
        return r === 0 ? 0 : s[0] === "+" ? r : -r;
    }
    function nV(e, n) {
        var i, s;
        if (n._isUTC) {
            i = n.clone();
            s = (_(e) || l(e) ? e.valueOf() : nM(e).valueOf()) - i.valueOf();
            i._d.setTime(i._d.valueOf() + s);
            t.updateOffset(i, false);
            return i;
        } else {
            return nM(e).local();
        }
    }
    function nG(e) {
        return -Math.round(e._d.getTimezoneOffset());
    }
    t.updateOffset = function() {};
    function nA(e, n, i) {
        var s = this._offset || 0, r;
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        if (e != null) {
            if (typeof e === "string") {
                e = nF(eb, e);
                if (e === null) {
                    return this;
                }
            } else if (Math.abs(e) < 16 && !i) {
                e = e * 60;
            }
            if (!this._isUTC && n) {
                r = nG(this);
            }
            this._offset = e;
            this._isUTC = true;
            if (r != null) {
                this.add(r, "m");
            }
            if (s !== e) {
                if (!n || this._changeInProgress) {
                    ie(this, nB(e - s, "m"), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    t.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? s : nG(this);
        }
    }
    function n5(e, t) {
        if (e != null) {
            if (typeof e !== "string") {
                e = -e;
            }
            this.utcOffset(e, t);
            return this;
        } else {
            return -this.utcOffset();
        }
    }
    function nI(e) {
        return this.utcOffset(0, e);
    }
    function n7(e) {
        if (this._isUTC) {
            this.utcOffset(0, e);
            this._isUTC = false;
            if (e) {
                this.subtract(nG(this), "m");
            }
        }
        return this;
    }
    function nE() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
            var e = nF(eO, this._i);
            if (e != null) {
                this.utcOffset(e);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }
    function nj(e) {
        if (!this.isValid()) {
            return false;
        }
        e = e ? nM(e).utcOffset() : 0;
        return (this.utcOffset() - e) % 60 === 0;
    }
    function n1() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }
    function n3() {
        if (!o(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var e = {}, t;
        p(e, this);
        e = n_(e);
        if (e._a) {
            t = e._isUTC ? d(e._a) : nM(e._a);
            this._isDSTShifted = this.isValid() && n4(e._a, t.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }
    function nZ() {
        return this.isValid() ? !this._isUTC : false;
    }
    function nz() {
        return this.isValid() ? this._isUTC : false;
    }
    function n6() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var n9 = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, nq = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function nB(e, t) {
        var n = e, i = null, s, a, o;
        if (nU(e)) {
            n = {
                ms: e._milliseconds,
                d: e._days,
                M: e._months
            };
        } else if (u(e) || !isNaN(+e)) {
            n = {};
            if (t) {
                n[t] = +e;
            } else {
                n.milliseconds = +e;
            }
        } else if ((i = n9.exec(e))) {
            s = i[1] === "-" ? -1 : 1;
            n = {
                y: 0,
                d: el(i[eF]) * s,
                h: el(i[eV]) * s,
                m: el(i[eG]) * s,
                s: el(i[eA]) * s,
                ms: el(nH(i[e5] * 1000)) * s
            };
        } else if ((i = nq.exec(e))) {
            s = i[1] === "-" ? -1 : 1;
            n = {
                y: nJ(i[2], s),
                M: nJ(i[3], s),
                w: nJ(i[4], s),
                d: nJ(i[5], s),
                h: nJ(i[6], s),
                m: nJ(i[7], s),
                s: nJ(i[8], s)
            };
        } else if (n == null) {
            n = {};
        } else if (typeof n === "object" && ("from" in n || "to" in n)) {
            o = nX(nM(n.from), nM(n.to));
            n = {};
            n.ms = o.milliseconds;
            n.M = o.months;
        }
        a = new nR(n);
        if (nU(e) && r(e, "_locale")) {
            a._locale = e._locale;
        }
        if (nU(e) && r(e, "_isValid")) {
            a._isValid = e._isValid;
        }
        return a;
    }
    nB.fn = nR.prototype;
    nB.invalid = nN;
    function nJ(e, t) {
        var n = e && parseFloat(e.replace(",", "."));
        return (isNaN(n) ? 0 : n) * t;
    }
    function nQ(e, t) {
        var n = {};
        n.months = t.month() - e.month() + (t.year() - e.year()) * 12;
        if (e.clone().add(n.months, "M").isAfter(t)) {
            --n.months;
        }
        n.milliseconds = +t - +e.clone().add(n.months, "M");
        return n;
    }
    function nX(e, t) {
        var n;
        if (!(e.isValid() && t.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }
        t = nV(t, e);
        if (e.isBefore(t)) {
            n = nQ(e, t);
        } else {
            n = nQ(t, e);
            n.milliseconds = -n.milliseconds;
            n.months = -n.months;
        }
        return n;
    }
    function nK(e, t) {
        return function(n, i) {
            var s, r;
            if (i !== null && !isNaN(+i)) {
                D(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). " + "See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
                r = n;
                n = i;
                i = r;
            }
            s = nB(n, i);
            ie(this, s, e);
            return this;
        };
    }
    function ie(e, n, i, s) {
        var r = n._milliseconds, a = nH(n._days), o = nH(n._months);
        if (!e.isValid()) {
            return;
        }
        s = s == null ? true : s;
        if (o) {
            eX(e, eh(e, "Month") + o * i);
        }
        if (a) {
            ed(e, "Date", eh(e, "Date") + a * i);
        }
        if (r) {
            e._d.setTime(e._d.valueOf() + r * i);
        }
        if (s) {
            t.updateOffset(e, a || o);
        }
    }
    var it = nK(1, "add"), ii = nK(-1, "subtract");
    function is(e) {
        return typeof e === "string" || e instanceof String;
    }
    function ir(e) {
        return (_(e) || l(e) || is(e) || u(e) || io(e) || ia(e) || e === null || e === undefined);
    }
    function ia(e) {
        var t = s(e) && !a(e), n = false, i = [
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
        ], o, u;
        for(o = 0; o < i.length; o += 1){
            u = i[o];
            n = n || r(e, u);
        }
        return t && n;
    }
    function io(e) {
        var t = i(e), n = false;
        if (t) {
            n = e.filter(function(t) {
                return !u(t) && is(e);
            }).length === 0;
        }
        return t && n;
    }
    function iu(e) {
        var t = s(e) && !a(e), n = false, i = [
            "sameDay",
            "nextDay",
            "lastDay",
            "nextWeek",
            "lastWeek",
            "sameElse", 
        ], o, u;
        for(o = 0; o < i.length; o += 1){
            u = i[o];
            n = n || r(e, u);
        }
        return t && n;
    }
    function il(e, t) {
        var n = e.diff(t, "days", true);
        return n < -6 ? "sameElse" : n < -1 ? "lastWeek" : n < 0 ? "lastDay" : n < 1 ? "sameDay" : n < 2 ? "nextDay" : n < 7 ? "nextWeek" : "sameElse";
    }
    function ih(e, n) {
        if (arguments.length === 1) {
            if (!arguments[0]) {
                e = undefined;
                n = undefined;
            } else if (ir(arguments[0])) {
                e = arguments[0];
                n = undefined;
            } else if (iu(arguments[0])) {
                n = arguments[0];
                e = undefined;
            }
        }
        var i = e || nM(), s = nV(i, this).startOf("day"), r = t.calendarFormat(this, s) || "sameElse", a = n && (O(n[r]) ? n[r].call(this, i) : n[r]);
        return this.format(a || this.localeData().calendar(r, this, nM(i)));
    }
    function id() {
        return new k(this);
    }
    function ic(e, t) {
        var n = _(e) ? e : nM(e);
        if (!(this.isValid() && n.isValid())) {
            return false;
        }
        t = en(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() > n.valueOf();
        } else {
            return n.valueOf() < this.clone().startOf(t).valueOf();
        }
    }
    function im(e, t) {
        var n = _(e) ? e : nM(e);
        if (!(this.isValid() && n.isValid())) {
            return false;
        }
        t = en(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() < n.valueOf();
        } else {
            return this.clone().endOf(t).valueOf() < n.valueOf();
        }
    }
    function i8(e, t, n, i) {
        var s = _(e) ? e : nM(e), r = _(t) ? t : nM(t);
        if (!(this.isValid() && s.isValid() && r.isValid())) {
            return false;
        }
        i = i || "()";
        return ((i[0] === "(" ? this.isAfter(s, n) : !this.isBefore(s, n)) && (i[1] === ")" ? this.isBefore(r, n) : !this.isAfter(r, n)));
    }
    function i$(e, t) {
        var n = _(e) ? e : nM(e), i;
        if (!(this.isValid() && n.isValid())) {
            return false;
        }
        t = en(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() === n.valueOf();
        } else {
            i = n.valueOf();
            return (this.clone().startOf(t).valueOf() <= i && i <= this.clone().endOf(t).valueOf());
        }
    }
    function iy(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t);
    }
    function ig(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t);
    }
    function iw(e, t, n) {
        var i, s, r;
        if (!this.isValid()) {
            return NaN;
        }
        i = nV(e, this);
        if (!i.isValid()) {
            return NaN;
        }
        s = (i.utcOffset() - this.utcOffset()) * 6e4;
        t = en(t);
        switch(t){
            case "year":
                r = iv(this, i) / 12;
                break;
            case "month":
                r = iv(this, i);
                break;
            case "quarter":
                r = iv(this, i) / 3;
                break;
            case "second":
                r = (this - i) / 1e3;
                break;
            case "minute":
                r = (this - i) / 6e4;
                break;
            case "hour":
                r = (this - i) / 36e5;
                break;
            case "day":
                r = (this - i - s) / 864e5;
                break;
            case "week":
                r = (this - i - s) / 6048e5;
                break;
            default:
                r = this - i;
        }
        return n ? r : eu(r);
    }
    function iv(e, t) {
        if (e.date() < t.date()) {
            return -iv(t, e);
        }
        var n = (t.year() - e.year()) * 12 + (t.month() - e.month()), i = e.clone().add(n, "months"), s, r;
        if (t - i < 0) {
            s = e.clone().add(n - 1, "months");
            r = (t - i) / (i - s);
        } else {
            s = e.clone().add(n + 1, "months");
            r = (t - i) / (s - i);
        }
        return -(n + r) || 0;
    }
    t.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    t.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function ip() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function ik(e) {
        if (!this.isValid()) {
            return null;
        }
        var t = e !== true, n = t ? this.clone().utc() : this;
        if (n.year() < 0 || n.year() > 9999) {
            return A(n, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (O(Date.prototype.toISOString)) {
            if (t) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace("Z", A(n, "Z"));
            }
        }
        return A(n, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function i_() {
        if (!this.isValid()) {
            return "moment.invalid(/* " + this._i + " */)";
        }
        var e = "moment", t = "", n, i, s, r;
        if (!this.isLocal()) {
            e = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
            t = "Z";
        }
        n = "[" + e + '("]';
        i = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        s = "-MM-DD[T]HH:mm:ss.SSS";
        r = t + '[")]';
        return this.format(n + i + s + r);
    }
    function iY(e) {
        if (!e) {
            e = this.isUtc() ? t.defaultFormatUtc : t.defaultFormat;
        }
        var n = A(this, e);
        return this.localeData().postformat(n);
    }
    function iS(e, t) {
        if (this.isValid() && ((_(e) && e.isValid()) || nM(e).isValid())) {
            return nB({
                to: this,
                from: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function iM(e) {
        return this.from(nM(), e);
    }
    function iD(e, t) {
        if (this.isValid() && ((_(e) && e.isValid()) || nM(e).isValid())) {
            return nB({
                from: this,
                to: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function iO(e) {
        return this.to(nM(), e);
    }
    function ib(e) {
        var t;
        if (e === undefined) {
            return this._locale._abbr;
        } else {
            t = tB(e);
            if (t != null) {
                this._locale = t;
            }
            return this;
        }
    }
    var iT = S("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        if (e === undefined) {
            return this.localeData();
        } else {
            return this.locale(e);
        }
    });
    function ix() {
        return this._locale;
    }
    var i0 = 1000, iP = 60 * i0, iW = 60 * iP, iC = (365 * 400 + 97) * 24 * iW;
    function iN(e, t) {
        return ((e % t) + t) % t;
    }
    function iR(e, t, n) {
        if (e < 100 && e >= 0) {
            return new Date(e + 400, t, n) - iC;
        } else {
            return new Date(e, t, n).valueOf();
        }
    }
    function iU(e, t, n) {
        if (e < 100 && e >= 0) {
            return Date.UTC(e + 400, t, n) - iC;
        } else {
            return Date.UTC(e, t, n);
        }
    }
    function iH(e) {
        var n, i;
        e = en(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        i = this._isUTC ? iU : iR;
        switch(e){
            case "year":
                n = i(this.year(), 0, 1);
                break;
            case "quarter":
                n = i(this.year(), this.month() - (this.month() % 3), 1);
                break;
            case "month":
                n = i(this.year(), this.month(), 1);
                break;
            case "week":
                n = i(this.year(), this.month(), this.date() - this.weekday());
                break;
            case "isoWeek":
                n = i(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case "day":
            case "date":
                n = i(this.year(), this.month(), this.date());
                break;
            case "hour":
                n = this._d.valueOf();
                n -= iN(n + (this._isUTC ? 0 : this.utcOffset() * iP), iW);
                break;
            case "minute":
                n = this._d.valueOf();
                n -= iN(n, iP);
                break;
            case "second":
                n = this._d.valueOf();
                n -= iN(n, i0);
                break;
        }
        this._d.setTime(n);
        t.updateOffset(this, true);
        return this;
    }
    function i4(e) {
        var n, i;
        e = en(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        i = this._isUTC ? iU : iR;
        switch(e){
            case "year":
                n = i(this.year() + 1, 0, 1) - 1;
                break;
            case "quarter":
                n = i(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
                break;
            case "month":
                n = i(this.year(), this.month() + 1, 1) - 1;
                break;
            case "week":
                n = i(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case "isoWeek":
                n = i(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case "day":
            case "date":
                n = i(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case "hour":
                n = this._d.valueOf();
                n += iW - iN(n + (this._isUTC ? 0 : this.utcOffset() * iP), iW) - 1;
                break;
            case "minute":
                n = this._d.valueOf();
                n += iP - iN(n, iP) - 1;
                break;
            case "second":
                n = this._d.valueOf();
                n += i0 - iN(n, i0) - 1;
                break;
        }
        this._d.setTime(n);
        t.updateOffset(this, true);
        return this;
    }
    function i2() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }
    function iL() {
        return Math.floor(this.valueOf() / 1000);
    }
    function iF() {
        return new Date(this.valueOf());
    }
    function iV() {
        var e = this;
        return [
            e.year(),
            e.month(),
            e.date(),
            e.hour(),
            e.minute(),
            e.second(),
            e.millisecond(), 
        ];
    }
    function iG() {
        var e = this;
        return {
            years: e.year(),
            months: e.month(),
            date: e.date(),
            hours: e.hours(),
            minutes: e.minutes(),
            seconds: e.seconds(),
            milliseconds: e.milliseconds()
        };
    }
    function iA() {
        return this.isValid() ? this.toISOString() : null;
    }
    function i5() {
        return y(this);
    }
    function iI() {
        return h({}, m(this));
    }
    function i7() {
        return m(this).overflow;
    }
    function iE() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    F("N", 0, 0, "eraAbbr");
    F("NN", 0, 0, "eraAbbr");
    F("NNN", 0, 0, "eraAbbr");
    F("NNNN", 0, 0, "eraName");
    F("NNNNN", 0, 0, "eraNarrow");
    F("y", [
        "y",
        1
    ], "yo", "eraYear");
    F("y", [
        "yy",
        2
    ], 0, "eraYear");
    F("y", [
        "yyy",
        3
    ], 0, "eraYear");
    F("y", [
        "yyyy",
        4
    ], 0, "eraYear");
    eP("N", iQ);
    eP("NN", iQ);
    eP("NNN", iQ);
    eP("NNNN", iX);
    eP("NNNNN", iK);
    eU([
        "N",
        "NN",
        "NNN",
        "NNNN",
        "NNNNN"
    ], function(e, t, n, i) {
        var s = n._locale.erasParse(e, i, n._strict);
        if (s) {
            m(n).era = s;
        } else {
            m(n).invalidEra = e;
        }
    });
    eP("y", eM);
    eP("yy", eM);
    eP("yyy", eM);
    eP("yyyy", eM);
    eP("yo", se);
    eU([
        "y",
        "yy",
        "yyy",
        "yyyy"
    ], e2);
    eU([
        "yo"
    ], function(e, t, n, i) {
        var s;
        if (n._locale._eraYearOrdinalRegex) {
            s = e.match(n._locale._eraYearOrdinalRegex);
        }
        if (n._locale.eraYearOrdinalParse) {
            t[e2] = n._locale.eraYearOrdinalParse(e, s);
        } else {
            t[e2] = parseInt(e, 10);
        }
    });
    function ij(e, n) {
        var i, s, r, a = this._eras || tB("en")._eras;
        for(i = 0, s = a.length; i < s; ++i){
            switch(typeof a[i].since){
                case "string":
                    r = t(a[i].since).startOf("day");
                    a[i].since = r.valueOf();
                    break;
            }
            switch(typeof a[i].until){
                case "undefined":
                    a[i].until = +Infinity;
                    break;
                case "string":
                    r = t(a[i].until).startOf("day").valueOf();
                    a[i].until = r.valueOf();
                    break;
            }
        }
        return a;
    }
    function i1(e, t, n) {
        var i, s, r = this.eras(), a, o, u;
        e = e.toUpperCase();
        for(i = 0, s = r.length; i < s; ++i){
            a = r[i].name.toUpperCase();
            o = r[i].abbr.toUpperCase();
            u = r[i].narrow.toUpperCase();
            if (n) {
                switch(t){
                    case "N":
                    case "NN":
                    case "NNN":
                        if (o === e) {
                            return r[i];
                        }
                        break;
                    case "NNNN":
                        if (a === e) {
                            return r[i];
                        }
                        break;
                    case "NNNNN":
                        if (u === e) {
                            return r[i];
                        }
                        break;
                }
            } else if ([
                a,
                o,
                u
            ].indexOf(e) >= 0) {
                return r[i];
            }
        }
    }
    function i3(e, n) {
        var i = e.since <= e.until ? +1 : -1;
        if (n === undefined) {
            return t(e.since).year();
        } else {
            return t(e.since).year() + (n - e.offset) * i;
        }
    }
    function iZ() {
        var e, t, n, i = this.localeData().eras();
        for(e = 0, t = i.length; e < t; ++e){
            n = this.clone().startOf("day").valueOf();
            if (i[e].since <= n && n <= i[e].until) {
                return i[e].name;
            }
            if (i[e].until <= n && n <= i[e].since) {
                return i[e].name;
            }
        }
        return "";
    }
    function iz() {
        var e, t, n, i = this.localeData().eras();
        for(e = 0, t = i.length; e < t; ++e){
            n = this.clone().startOf("day").valueOf();
            if (i[e].since <= n && n <= i[e].until) {
                return i[e].narrow;
            }
            if (i[e].until <= n && n <= i[e].since) {
                return i[e].narrow;
            }
        }
        return "";
    }
    function i6() {
        var e, t, n, i = this.localeData().eras();
        for(e = 0, t = i.length; e < t; ++e){
            n = this.clone().startOf("day").valueOf();
            if (i[e].since <= n && n <= i[e].until) {
                return i[e].abbr;
            }
            if (i[e].until <= n && n <= i[e].since) {
                return i[e].abbr;
            }
        }
        return "";
    }
    function i9() {
        var e, n, i, s, r = this.localeData().eras();
        for(e = 0, n = r.length; e < n; ++e){
            i = r[e].since <= r[e].until ? +1 : -1;
            s = this.clone().startOf("day").valueOf();
            if ((r[e].since <= s && s <= r[e].until) || (r[e].until <= s && s <= r[e].since)) {
                return ((this.year() - t(r[e].since).year()) * i + r[e].offset);
            }
        }
        return this.year();
    }
    function iq(e) {
        if (!r(this, "_erasNameRegex")) {
            st.call(this);
        }
        return e ? this._erasNameRegex : this._erasRegex;
    }
    function iB(e) {
        if (!r(this, "_erasAbbrRegex")) {
            st.call(this);
        }
        return e ? this._erasAbbrRegex : this._erasRegex;
    }
    function iJ(e) {
        if (!r(this, "_erasNarrowRegex")) {
            st.call(this);
        }
        return e ? this._erasNarrowRegex : this._erasRegex;
    }
    function iQ(e, t) {
        return t.erasAbbrRegex(e);
    }
    function iX(e, t) {
        return t.erasNameRegex(e);
    }
    function iK(e, t) {
        return t.erasNarrowRegex(e);
    }
    function se(e, t) {
        return t._eraYearOrdinalRegex || eM;
    }
    function st() {
        var e = [], t = [], n = [], i = [], s, r, a = this.eras();
        for(s = 0, r = a.length; s < r; ++s){
            t.push(eN(a[s].name));
            e.push(eN(a[s].abbr));
            n.push(eN(a[s].narrow));
            i.push(eN(a[s].name));
            i.push(eN(a[s].abbr));
            i.push(eN(a[s].narrow));
        }
        this._erasRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + t.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + e.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }
    F(0, [
        "gg",
        2
    ], 0, function() {
        return this.weekYear() % 100;
    });
    F(0, [
        "GG",
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    function sn(e, t) {
        F(0, [
            e,
            e.length
        ], 0, t);
    }
    sn("gggg", "weekYear");
    sn("ggggg", "weekYear");
    sn("GGGG", "isoWeekYear");
    sn("GGGGG", "isoWeekYear");
    et("weekYear", "gg");
    et("isoWeekYear", "GG");
    er("weekYear", 1);
    er("isoWeekYear", 1);
    eP("G", eD);
    eP("g", eD);
    eP("GG", ev, e$);
    eP("gg", ev, e$);
    eP("GGGG", eY, eg);
    eP("gggg", eY, eg);
    eP("GGGGG", eS, ew);
    eP("ggggg", eS, ew);
    eH([
        "gggg",
        "ggggg",
        "GGGG",
        "GGGGG"
    ], function(e, t, n, i) {
        t[i.substr(0, 2)] = el(e);
    });
    eH([
        "gg",
        "GG"
    ], function(e, n, i, s) {
        n[s] = t.parseTwoDigitYear(e);
    });
    function si(e) {
        return sl.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function ss(e) {
        return sl.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function sr() {
        return td(this.year(), 1, 4);
    }
    function sa() {
        return td(this.isoWeekYear(), 1, 4);
    }
    function so() {
        var e = this.localeData()._week;
        return td(this.year(), e.dow, e.doy);
    }
    function su() {
        var e = this.localeData()._week;
        return td(this.weekYear(), e.dow, e.doy);
    }
    function sl(e, t, n, i, s) {
        var r;
        if (e == null) {
            return th(this, i, s).year;
        } else {
            r = td(e, i, s);
            if (t > r) {
                t = r;
            }
            return sf.call(this, e, t, n, i, s);
        }
    }
    function sf(e, t, n, i, s) {
        var r = tf(e, t, n, i, s), a = tu(r.year, 0, r.dayOfYear);
        this.year(a.getUTCFullYear());
        this.month(a.getUTCMonth());
        this.date(a.getUTCDate());
        return this;
    }
    F("Q", 0, "Qo", "quarter");
    et("quarter", "Q");
    er("quarter", 7);
    eP("Q", e8);
    eU("Q", function(e, t) {
        t[eL] = (el(e) - 1) * 3;
    });
    function sh(e) {
        return e == null ? Math.ceil((this.month() + 1) / 3) : this.month((e - 1) * 3 + (this.month() % 3));
    }
    F("D", [
        "DD",
        2
    ], "Do", "date");
    et("date", "D");
    er("date", 9);
    eP("D", ev);
    eP("DD", ev, e$);
    eP("Do", function(e, t) {
        return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
    });
    eU([
        "D",
        "DD"
    ], eF);
    eU("Do", function(e, t) {
        t[eF] = el(e.match(ev)[0]);
    });
    var sd = ef("Date", true);
    F("DDD", [
        "DDDD",
        3
    ], "DDDo", "dayOfYear");
    et("dayOfYear", "DDD");
    er("dayOfYear", 4);
    eP("DDD", e_);
    eP("DDDD", ey);
    eU([
        "DDD",
        "DDDD"
    ], function(e, t, n) {
        n._dayOfYear = el(e);
    });
    function sc(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return e == null ? t : this.add(e - t, "d");
    }
    F("m", [
        "mm",
        2
    ], 0, "minute");
    et("minute", "m");
    er("minute", 14);
    eP("m", ev);
    eP("mm", ev, e$);
    eU([
        "m",
        "mm"
    ], eG);
    var sm = ef("Minutes", false);
    F("s", [
        "ss",
        2
    ], 0, "second");
    et("second", "s");
    er("second", 15);
    eP("s", ev);
    eP("ss", ev, e$);
    eU([
        "s",
        "ss"
    ], eA);
    var s8 = ef("Seconds", false);
    F("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    F(0, [
        "SS",
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    F(0, [
        "SSS",
        3
    ], 0, "millisecond");
    F(0, [
        "SSSS",
        4
    ], 0, function() {
        return this.millisecond() * 10;
    });
    F(0, [
        "SSSSS",
        5
    ], 0, function() {
        return this.millisecond() * 100;
    });
    F(0, [
        "SSSSSS",
        6
    ], 0, function() {
        return this.millisecond() * 1000;
    });
    F(0, [
        "SSSSSSS",
        7
    ], 0, function() {
        return this.millisecond() * 10000;
    });
    F(0, [
        "SSSSSSSS",
        8
    ], 0, function() {
        return this.millisecond() * 100000;
    });
    F(0, [
        "SSSSSSSSS",
        9
    ], 0, function() {
        return this.millisecond() * 1000000;
    });
    et("millisecond", "ms");
    er("millisecond", 16);
    eP("S", e_, e8);
    eP("SS", e_, e$);
    eP("SSS", e_, ey);
    var s$, sy;
    for(s$ = "SSSS"; s$.length <= 9; s$ += "S"){
        eP(s$, eM);
    }
    function sg(e, t) {
        t[e5] = el(("0." + e) * 1000);
    }
    for(s$ = "S"; s$.length <= 9; s$ += "S"){
        eU(s$, sg);
    }
    sy = ef("Milliseconds", false);
    F("z", 0, 0, "zoneAbbr");
    F("zz", 0, 0, "zoneName");
    function sw() {
        return this._isUTC ? "UTC" : "";
    }
    function sv() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var sp = k.prototype;
    sp.add = it;
    sp.calendar = ih;
    sp.clone = id;
    sp.diff = iw;
    sp.endOf = i4;
    sp.format = iY;
    sp.from = iS;
    sp.fromNow = iM;
    sp.to = iD;
    sp.toNow = iO;
    sp.get = ec;
    sp.invalidAt = i7;
    sp.isAfter = ic;
    sp.isBefore = im;
    sp.isBetween = i8;
    sp.isSame = i$;
    sp.isSameOrAfter = iy;
    sp.isSameOrBefore = ig;
    sp.isValid = i5;
    sp.lang = iT;
    sp.locale = ib;
    sp.localeData = ix;
    sp.max = nO;
    sp.min = nD;
    sp.parsingFlags = iI;
    sp.set = em;
    sp.startOf = iH;
    sp.subtract = ii;
    sp.toArray = iV;
    sp.toObject = iG;
    sp.toDate = iF;
    sp.toISOString = ik;
    sp.inspect = i_;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
        sp[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        };
    }
    sp.toJSON = iA;
    sp.toString = ip;
    sp.unix = iL;
    sp.valueOf = i2;
    sp.creationData = iE;
    sp.eraName = iZ;
    sp.eraNarrow = iz;
    sp.eraAbbr = i6;
    sp.eraYear = i9;
    sp.year = tr;
    sp.isLeapYear = ta;
    sp.weekYear = si;
    sp.isoWeekYear = ss;
    sp.quarter = sp.quarters = sh;
    sp.month = eK;
    sp.daysInMonth = te;
    sp.week = sp.weeks = ty;
    sp.isoWeek = sp.isoWeeks = tg;
    sp.weeksInYear = so;
    sp.weeksInWeekYear = su;
    sp.isoWeeksInYear = sr;
    sp.isoWeeksInISOWeekYear = sa;
    sp.date = sd;
    sp.day = sp.days = tP;
    sp.weekday = tW;
    sp.isoWeekday = tC;
    sp.dayOfYear = sc;
    sp.hour = sp.hours = tA;
    sp.minute = sp.minutes = sm;
    sp.second = sp.seconds = s8;
    sp.millisecond = sp.milliseconds = sy;
    sp.utcOffset = nA;
    sp.utc = nI;
    sp.local = n7;
    sp.parseZone = nE;
    sp.hasAlignedHourOffset = nj;
    sp.isDST = n1;
    sp.isLocal = nZ;
    sp.isUtcOffset = nz;
    sp.isUtc = n6;
    sp.isUTC = n6;
    sp.zoneAbbr = sw;
    sp.zoneName = sv;
    sp.dates = S("dates accessor is deprecated. Use date instead.", sd);
    sp.months = S("months accessor is deprecated. Use month instead", eK);
    sp.years = S("years accessor is deprecated. Use year instead", tr);
    sp.zone = S("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", n5);
    sp.isDSTShifted = S("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", n3);
    function sk(e) {
        return nM(e * 1000);
    }
    function s_() {
        return nM.apply(null, arguments).parseZone();
    }
    function sY(e) {
        return e;
    }
    var sS = x.prototype;
    sS.calendar = C;
    sS.longDateFormat = j;
    sS.invalidDate = z;
    sS.ordinal = J;
    sS.preparse = sY;
    sS.postformat = sY;
    sS.relativeTime = X;
    sS.pastFuture = K;
    sS.set = b;
    sS.eras = ij;
    sS.erasParse = i1;
    sS.erasConvertYear = i3;
    sS.erasAbbrRegex = iB;
    sS.erasNameRegex = iq;
    sS.erasNarrowRegex = iJ;
    sS.months = eq;
    sS.monthsShort = eB;
    sS.monthsParse = eQ;
    sS.monthsRegex = tn;
    sS.monthsShortRegex = tt;
    sS.week = tc;
    sS.firstDayOfYear = t$;
    sS.firstDayOfWeek = t8;
    sS.weekdays = tO;
    sS.weekdaysMin = tT;
    sS.weekdaysShort = tb;
    sS.weekdaysParse = t0;
    sS.weekdaysRegex = tN;
    sS.weekdaysShortRegex = tR;
    sS.weekdaysMinRegex = tU;
    sS.isPM = tV;
    sS.meridiem = t5;
    function sM(e, t, n, i) {
        var s = tB(), r = d().set(i, t);
        return s[n](r, e);
    }
    function sD(e, t, n) {
        if (u(e)) {
            t = e;
            e = undefined;
        }
        e = e || "";
        if (t != null) {
            return sM(e, t, n, "month");
        }
        var i, s = [];
        for(i = 0; i < 12; i++){
            s[i] = sM(e, i, n, "month");
        }
        return s;
    }
    function sO(e, t, n, i) {
        if (typeof e === "boolean") {
            if (u(t)) {
                n = t;
                t = undefined;
            }
            t = t || "";
        } else {
            t = e;
            n = t;
            e = false;
            if (u(t)) {
                n = t;
                t = undefined;
            }
            t = t || "";
        }
        var s = tB(), r = e ? s._week.dow : 0, a, o = [];
        if (n != null) {
            return sM(t, (n + r) % 7, i, "day");
        }
        for(a = 0; a < 7; a++){
            o[a] = sM(t, (a + r) % 7, i, "day");
        }
        return o;
    }
    function sb(e, t) {
        return sD(e, t, "months");
    }
    function sT(e, t) {
        return sD(e, t, "monthsShort");
    }
    function sx(e, t, n) {
        return sO(e, t, n, "weekdays");
    }
    function s0(e, t, n) {
        return sO(e, t, n, "weekdaysShort");
    }
    function sP(e, t, n) {
        return sO(e, t, n, "weekdaysMin");
    }
    t6("en", {
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
        ordinal: function(e) {
            var t = e % 10, n = el((e % 100) / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th";
            return e + n;
        }
    });
    t.lang = S("moment.lang is deprecated. Use moment.locale instead.", t6);
    t.langData = S("moment.langData is deprecated. Use moment.localeData instead.", tB);
    var sW = Math.abs;
    function sC() {
        var e = this._data;
        this._milliseconds = sW(this._milliseconds);
        this._days = sW(this._days);
        this._months = sW(this._months);
        e.milliseconds = sW(e.milliseconds);
        e.seconds = sW(e.seconds);
        e.minutes = sW(e.minutes);
        e.hours = sW(e.hours);
        e.months = sW(e.months);
        e.years = sW(e.years);
        return this;
    }
    function sN(e, t, n, i) {
        var s = nB(t, n);
        e._milliseconds += i * s._milliseconds;
        e._days += i * s._days;
        e._months += i * s._months;
        return e._bubble();
    }
    function sR(e, t) {
        return sN(this, e, t, 1);
    }
    function sU(e, t) {
        return sN(this, e, t, -1);
    }
    function sH(e) {
        if (e < 0) {
            return Math.floor(e);
        } else {
            return Math.ceil(e);
        }
    }
    function s4() {
        var e = this._milliseconds, t = this._days, n = this._months, i = this._data, s, r, a, o, u;
        if (!((e >= 0 && t >= 0 && n >= 0) || (e <= 0 && t <= 0 && n <= 0))) {
            e += sH(sL(n) + t) * 864e5;
            t = 0;
            n = 0;
        }
        i.milliseconds = e % 1000;
        s = eu(e / 1000);
        i.seconds = s % 60;
        r = eu(s / 60);
        i.minutes = r % 60;
        a = eu(r / 60);
        i.hours = a % 24;
        t += eu(a / 24);
        u = eu(s2(t));
        n += u;
        t -= sH(sL(u));
        o = eu(n / 12);
        n %= 12;
        i.days = t;
        i.months = n;
        i.years = o;
        return this;
    }
    function s2(e) {
        return (e * 4800) / 146097;
    }
    function sL(e) {
        return (e * 146097) / 4800;
    }
    function sF(e) {
        if (!this.isValid()) {
            return NaN;
        }
        var t, n, i = this._milliseconds;
        e = en(e);
        if (e === "month" || e === "quarter" || e === "year") {
            t = this._days + i / 864e5;
            n = this._months + s2(t);
            switch(e){
                case "month":
                    return n;
                case "quarter":
                    return n / 3;
                case "year":
                    return n / 12;
            }
        } else {
            t = this._days + Math.round(sL(this._months));
            switch(e){
                case "week":
                    return t / 7 + i / 6048e5;
                case "day":
                    return t + i / 864e5;
                case "hour":
                    return t * 24 + i / 36e5;
                case "minute":
                    return t * 1440 + i / 6e4;
                case "second":
                    return t * 86400 + i / 1000;
                case "millisecond":
                    return Math.floor(t * 864e5) + i;
                default:
                    throw new Error("Unknown unit " + e);
            }
        }
    }
    function sV() {
        if (!this.isValid()) {
            return NaN;
        }
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + el(this._months / 12) * 31536e6);
    }
    function sG(e) {
        return function() {
            return this.as(e);
        };
    }
    var sA = sG("ms"), s5 = sG("s"), sI = sG("m"), s7 = sG("h"), sE = sG("d"), sj = sG("w"), s1 = sG("M"), s3 = sG("Q"), sZ = sG("y");
    function sz() {
        return nB(this);
    }
    function s6(e) {
        e = en(e);
        return this.isValid() ? this[e + "s"]() : NaN;
    }
    function s9(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN;
        };
    }
    var sq = s9("milliseconds"), sB = s9("seconds"), sJ = s9("minutes"), sQ = s9("hours"), sX = s9("days"), sK = s9("months"), re = s9("years");
    function rt() {
        return eu(this.days() / 7);
    }
    var rn = Math.round, ri = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    function rs(e, t, n, i, s) {
        return s.relativeTime(t || 1, !!n, e, i);
    }
    function rr(e, t, n, i) {
        var s = nB(e).abs(), r = rn(s.as("s")), a = rn(s.as("m")), o = rn(s.as("h")), u = rn(s.as("d")), l = rn(s.as("M")), f = rn(s.as("w")), h = rn(s.as("y")), d = (r <= n.ss && [
            "s",
            r
        ]) || (r < n.s && [
            "ss",
            r
        ]) || (a <= 1 && [
            "m"
        ]) || (a < n.m && [
            "mm",
            a
        ]) || (o <= 1 && [
            "h"
        ]) || (o < n.h && [
            "hh",
            o
        ]) || (u <= 1 && [
            "d"
        ]) || (u < n.d && [
            "dd",
            u
        ]);
        if (n.w != null) {
            d = d || (f <= 1 && [
                "w"
            ]) || (f < n.w && [
                "ww",
                f
            ]);
        }
        d = d || (l <= 1 && [
            "M"
        ]) || (l < n.M && [
            "MM",
            l
        ]) || (h <= 1 && [
            "y"
        ]) || [
            "yy",
            h
        ];
        d[2] = t;
        d[3] = +e > 0;
        d[4] = i;
        return rs.apply(null, d);
    }
    function ra(e) {
        if (e === undefined) {
            return rn;
        }
        if (typeof e === "function") {
            rn = e;
            return true;
        }
        return false;
    }
    function ro(e, t) {
        if (ri[e] === undefined) {
            return false;
        }
        if (t === undefined) {
            return ri[e];
        }
        ri[e] = t;
        if (e === "s") {
            ri.ss = t - 1;
        }
        return true;
    }
    function ru(e, t) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var n = false, i = ri, s, r;
        if (typeof e === "object") {
            t = e;
            e = false;
        }
        if (typeof e === "boolean") {
            n = e;
        }
        if (typeof t === "object") {
            i = Object.assign({}, ri, t);
            if (t.s != null && t.ss == null) {
                i.ss = t.s - 1;
            }
        }
        s = this.localeData();
        r = rr(this, !n, i, s);
        if (n) {
            r = s.pastFuture(+this, r);
        }
        return s.postformat(r);
    }
    var rl = Math.abs;
    function rf(e) {
        return (e > 0) - (e < 0) || +e;
    }
    function rh() {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var e = rl(this._milliseconds) / 1000, t = rl(this._days), n = rl(this._months), i, s, r, a, o = this.asSeconds(), u, l, f, h;
        if (!o) {
            return "P0D";
        }
        i = eu(e / 60);
        s = eu(i / 60);
        e %= 60;
        i %= 60;
        r = eu(n / 12);
        n %= 12;
        a = e ? e.toFixed(3).replace(/\.?0+$/, "") : "";
        u = o < 0 ? "-" : "";
        l = rf(this._months) !== rf(o) ? "-" : "";
        f = rf(this._days) !== rf(o) ? "-" : "";
        h = rf(this._milliseconds) !== rf(o) ? "-" : "";
        return (u + "P" + (r ? l + r + "Y" : "") + (n ? l + n + "M" : "") + (t ? f + t + "D" : "") + (s || i || e ? "T" : "") + (s ? h + s + "H" : "") + (i ? h + i + "M" : "") + (e ? h + a + "S" : ""));
    }
    var rd = nR.prototype;
    rd.isValid = nC;
    rd.abs = sC;
    rd.add = sR;
    rd.subtract = sU;
    rd.as = sF;
    rd.asMilliseconds = sA;
    rd.asSeconds = s5;
    rd.asMinutes = sI;
    rd.asHours = s7;
    rd.asDays = sE;
    rd.asWeeks = sj;
    rd.asMonths = s1;
    rd.asQuarters = s3;
    rd.asYears = sZ;
    rd.valueOf = sV;
    rd._bubble = s4;
    rd.clone = sz;
    rd.get = s6;
    rd.milliseconds = sq;
    rd.seconds = sB;
    rd.minutes = sJ;
    rd.hours = sQ;
    rd.days = sX;
    rd.weeks = rt;
    rd.months = sK;
    rd.years = re;
    rd.humanize = ru;
    rd.toISOString = rh;
    rd.toString = rh;
    rd.toJSON = rh;
    rd.locale = ib;
    rd.localeData = ix;
    rd.toIsoString = S("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", rh);
    rd.lang = iT;
    F("X", 0, 0, "unix");
    F("x", 0, 0, "valueOf");
    eP("x", eD);
    eP("X", eT);
    eU("X", function(e, t, n) {
        n._d = new Date(parseFloat(e) * 1000);
    });
    eU("x", function(e, t, n) {
        n._d = new Date(el(e));
    });
    t.version = "2.29.1";
    n(nM);
    t.fn = sp;
    t.min = nT;
    t.max = nx;
    t.now = n0;
    t.utc = d;
    t.unix = sk;
    t.months = sb;
    t.isDate = l;
    t.locale = t6;
    t.invalid = g;
    t.duration = nB;
    t.isMoment = _;
    t.weekdays = sx;
    t.parseZone = s_;
    t.localeData = tB;
    t.isDuration = nU;
    t.monthsShort = sT;
    t.weekdaysMin = sP;
    t.defineLocale = t9;
    t.updateLocale = tq;
    t.locales = tJ;
    t.weekdaysShort = s0;
    t.normalizeUnits = en;
    t.relativeTimeRounding = ra;
    t.relativeTimeThreshold = ro;
    t.calendarFormat = il;
    t.prototype = sp;
    t.HTML5_FMT = {
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
    return t;
});
