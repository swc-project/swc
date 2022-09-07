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
    function r(e) {
        return (e != null && Object.prototype.toString.call(e) === "[object Object]");
    }
    function s(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }
    function a(e) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(e).length === 0;
        } else {
            var t;
            for(t in e){
                if (s(e, t)) {
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
            if (s(t, n)) {
                e[n] = t[n];
            }
        }
        if (s(t, "toString")) {
            e.toString = t.toString;
        }
        if (s(t, "valueOf")) {
            e.valueOf = t.valueOf;
        }
        return e;
    }
    function d(e, t, n, i) {
        return nY(e, t, n, i, true).utc();
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
    var _;
    if (Array.prototype.some) {
        _ = Array.prototype.some;
    } else {
        _ = function(e) {
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
            var t = m(e), n = _.call(t.parsedDateParts, function(e) {
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
    var w = (t.momentProperties = []), p = false;
    function v(e, t) {
        var n, i, r;
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
                r = t[i];
                if (!o(r)) {
                    e[i] = r;
                }
            }
        }
        return e;
    }
    function k(e) {
        v(this, e);
        this._d = new Date(e._d != null ? e._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        if (p === false) {
            p = true;
            t.updateOffset(this);
            p = false;
        }
    }
    function M(e) {
        return (e instanceof k || (e != null && e._isAMomentObject != null));
    }
    function D(e) {
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
                var r = [], a, o, u;
                for(o = 0; o < arguments.length; o++){
                    a = "";
                    if (typeof arguments[o] === "object") {
                        a += "\n[" + o + "] ";
                        for(u in arguments[0]){
                            if (s(arguments[0], u)) {
                                a += u + ": " + arguments[0][u] + ", ";
                            }
                        }
                        a = a.slice(0, -2);
                    } else {
                        a = arguments[o];
                    }
                    r.push(a);
                }
                D(e + "\nArguments: " + Array.prototype.slice.call(r).join("") + "\n" + new Error().stack);
                i = false;
            }
            return n.apply(this, arguments);
        }, n);
    }
    var Y = {};
    function O(e, n) {
        if (t.deprecationHandler != null) {
            t.deprecationHandler(e, n);
        }
        if (!Y[e]) {
            D(n);
            Y[e] = true;
        }
    }
    t.suppressDeprecationWarnings = false;
    t.deprecationHandler = null;
    function b(e) {
        return ((typeof Function !== "undefined" && e instanceof Function) || Object.prototype.toString.call(e) === "[object Function]");
    }
    function x(e) {
        var t, n;
        for(n in e){
            if (s(e, n)) {
                t = e[n];
                if (b(t)) {
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
            if (s(t, i)) {
                if (r(e[i]) && r(t[i])) {
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
            if (s(e, i) && !s(t, i) && r(e[i])) {
                n[i] = h({}, n[i]);
            }
        }
        return n;
    }
    function N(e) {
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
                if (s(e, t)) {
                    n.push(t);
                }
            }
            return n;
        };
    }
    var R = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    function W(e, t, n) {
        var i = this._calendar[e] || this._calendar["sameElse"];
        return b(i) ? i.call(t, n) : i;
    }
    function C(e, t, n) {
        var i = "" + Math.abs(e), r = t - i.length, s = e >= 0;
        return ((s ? (n ? "+" : "") : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + i);
    }
    var U = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, H = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, F = {}, L = {};
    function V(e, t, n, i) {
        var r = i;
        if (typeof i === "string") {
            r = function() {
                return this[i]();
            };
        }
        if (e) {
            L[e] = r;
        }
        if (t) {
            L[t[0]] = function() {
                return C(r.apply(this, arguments), t[1], t[2]);
            };
        }
        if (n) {
            L[n] = function() {
                return this.localeData().ordinal(r.apply(this, arguments), e);
            };
        }
    }
    function G(e) {
        if (e.match(/\[[\s\S]/)) {
            return e.replace(/^\[|\]$/g, "");
        }
        return e.replace(/\\/g, "");
    }
    function E(e) {
        var t = e.match(U), n, i;
        for(n = 0, i = t.length; n < i; n++){
            if (L[t[n]]) {
                t[n] = L[t[n]];
            } else {
                t[n] = G(t[n]);
            }
        }
        return function(n) {
            var r = "", s;
            for(s = 0; s < i; s++){
                r += b(t[s]) ? t[s].call(n, e) : t[s];
            }
            return r;
        };
    }
    function A(e, t) {
        if (!e.isValid()) {
            return e.localeData().invalidDate();
        }
        t = I(t, e.localeData());
        F[t] = F[t] || E(t);
        return F[t](e);
    }
    function I(e, t) {
        var n = 5;
        function i(e) {
            return t.longDateFormat(e) || e;
        }
        H.lastIndex = 0;
        while(n >= 0 && H.test(e)){
            e = e.replace(H, i);
            H.lastIndex = 0;
            n -= 1;
        }
        return e;
    }
    var j = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function Z(e) {
        var t = this._longDateFormat[e], n = this._longDateFormat[e.toUpperCase()];
        if (t || !n) {
            return t;
        }
        this._longDateFormat[e] = n.match(U).map(function(e) {
            if (e === "MMMM" || e === "MM" || e === "DD" || e === "dddd") {
                return e.slice(1);
            }
            return e;
        }).join("");
        return this._longDateFormat[e];
    }
    var z = "Invalid date";
    function $() {
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
        var r = this._relativeTime[n];
        return b(r) ? r(e, t, n, i) : r.replace(/%d/i, e);
    }
    function K(e, t) {
        var n = this._relativeTime[e > 0 ? "future" : "past"];
        return b(n) ? n(t) : n.replace(/%s/i, t);
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
            if (s(e, i)) {
                n = en(i);
                if (n) {
                    t[n] = e[i];
                }
            }
        }
        return t;
    }
    var er = {};
    function es(e, t) {
        er[e] = t;
    }
    function ea(e) {
        var t = [], n;
        for(n in e){
            if (s(e, n)) {
                t.push({
                    unit: n,
                    priority: er[n]
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
                e._d["set" + (e._isUTC ? "UTC" : "") + t](n, e.month(), eX(n, e.month()));
            } else {
                e._d["set" + (e._isUTC ? "UTC" : "") + t](n);
            }
        }
    }
    function ec(e) {
        e = en(e);
        if (b(this[e])) {
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
            if (b(this[e])) {
                return this[e](t);
            }
        }
        return this;
    }
    var e_ = /\d/, ey = /\d\d/, eg = /\d{3}/, ew = /\d{4}/, ep = /[+-]?\d{6}/, ev = /\d\d?/, ek = /\d\d\d\d?/, eM = /\d\d\d\d\d\d?/, eD = /\d{1,3}/, eS = /\d{1,4}/, eY = /[+-]?\d{1,6}/, eO = /\d+/, eb = /[+-]?\d+/, ex = /Z|[+-]\d\d:?\d\d/gi, eT = /Z|[+-]\d\d(?::?\d\d)?/gi, eN = /[+-]?\d+(\.\d{1,3})?/, eP = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, eR;
    eR = {};
    function eW(e, t, n) {
        eR[e] = b(t) ? t : function(e, i) {
            return e && n ? n : t;
        };
    }
    function eC(e, t) {
        if (!s(eR, e)) {
            return new RegExp(eU(e));
        }
        return eR[e](t._strict, t._locale);
    }
    function eU(e) {
        return eH(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, i, r) {
            return t || n || i || r;
        }));
    }
    function eH(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var eF = {};
    function eL(e, t) {
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
            eF[e[n]] = i;
        }
    }
    function eV(e, t) {
        eL(e, function(e, n, i, r) {
            i._w = i._w || {};
            t(e, i._w, i, r);
        });
    }
    function eG(e, t, n) {
        if (t != null && s(eF, e)) {
            eF[e](t, n._a, n, e);
        }
    }
    var eE = 0, eA = 1, eI = 2, ej = 3, eZ = 4, ez = 5, e$ = 6, eq = 7, eB = 8;
    function eJ(e, t) {
        return ((e % t) + t) % t;
    }
    var eQ;
    if (Array.prototype.indexOf) {
        eQ = Array.prototype.indexOf;
    } else {
        eQ = function(e) {
            var t;
            for(t = 0; t < this.length; ++t){
                if (this[t] === e) {
                    return t;
                }
            }
            return -1;
        };
    }
    function eX(e, t) {
        if (isNaN(e) || isNaN(t)) {
            return NaN;
        }
        var n = eJ(t, 12);
        e += (t - n) / 12;
        return n === 1 ? eo(e) ? 29 : 28 : 31 - ((n % 7) % 2);
    }
    V("M", [
        "MM",
        2
    ], "Mo", function() {
        return this.month() + 1;
    });
    V("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    });
    V("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    });
    et("month", "M");
    es("month", 8);
    eW("M", ev);
    eW("MM", ev, ey);
    eW("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    });
    eW("MMMM", function(e, t) {
        return t.monthsRegex(e);
    });
    eL([
        "M",
        "MM"
    ], function(e, t) {
        t[eA] = el(e) - 1;
    });
    eL([
        "MMM",
        "MMMM"
    ], function(e, t, n, i) {
        var r = n._locale.monthsParse(e, i, n._strict);
        if (r != null) {
            t[eA] = r;
        } else {
            m(n).invalidMonth = e;
        }
    });
    var eK = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), e0 = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), e1 = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, e2 = eP, e6 = eP;
    function e4(e, t) {
        if (!e) {
            return i(this._months) ? this._months : this._months["standalone"];
        }
        return i(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || e1).test(t) ? "format" : "standalone"][e.month()];
    }
    function e3(e, t) {
        if (!e) {
            return i(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return i(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[e1.test(t) ? "format" : "standalone"][e.month()];
    }
    function e7(e, t, n) {
        var i, r, s, a = e.toLocaleLowerCase();
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for(i = 0; i < 12; ++i){
                s = d([
                    2000,
                    i
                ]);
                this._shortMonthsParse[i] = this.monthsShort(s, "").toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(s, "").toLocaleLowerCase();
            }
        }
        if (n) {
            if (t === "MMM") {
                r = eQ.call(this._shortMonthsParse, a);
                return r !== -1 ? r : null;
            } else {
                r = eQ.call(this._longMonthsParse, a);
                return r !== -1 ? r : null;
            }
        } else {
            if (t === "MMM") {
                r = eQ.call(this._shortMonthsParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._longMonthsParse, a);
                return r !== -1 ? r : null;
            } else {
                r = eQ.call(this._longMonthsParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._shortMonthsParse, a);
                return r !== -1 ? r : null;
            }
        }
    }
    function e9(e, t, n) {
        var i, r, s;
        if (this._monthsParseExact) {
            return e7.call(this, e, t, n);
        }
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for(i = 0; i < 12; i++){
            r = d([
                2000,
                i
            ]);
            if (n && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i");
            }
            if (!n && !this._monthsParse[i]) {
                s = "^" + this.months(r, "") + "|^" + this.monthsShort(r, "");
                this._monthsParse[i] = new RegExp(s.replace(".", ""), "i");
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
    function e5(e, t) {
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
        n = Math.min(e.date(), eX(e.year(), t));
        e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n);
        return e;
    }
    function e8(e) {
        if (e != null) {
            e5(this, e);
            t.updateOffset(this, true);
            return this;
        } else {
            return eh(this, "Month");
        }
    }
    function te() {
        return eX(this.year(), this.month());
    }
    function tt(e) {
        if (this._monthsParseExact) {
            if (!s(this, "_monthsRegex")) {
                ti.call(this);
            }
            if (e) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!s(this, "_monthsShortRegex")) {
                this._monthsShortRegex = e2;
            }
            return this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }
    function tn(e) {
        if (this._monthsParseExact) {
            if (!s(this, "_monthsRegex")) {
                ti.call(this);
            }
            if (e) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!s(this, "_monthsRegex")) {
                this._monthsRegex = e6;
            }
            return this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex;
        }
    }
    function ti() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], n = [], i = [], r, s;
        for(r = 0; r < 12; r++){
            s = d([
                2000,
                r
            ]);
            t.push(this.monthsShort(s, ""));
            n.push(this.months(s, ""));
            i.push(this.months(s, ""));
            i.push(this.monthsShort(s, ""));
        }
        t.sort(e);
        n.sort(e);
        i.sort(e);
        for(r = 0; r < 12; r++){
            t[r] = eH(t[r]);
            n[r] = eH(n[r]);
        }
        for(r = 0; r < 24; r++){
            i[r] = eH(i[r]);
        }
        this._monthsRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    V("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? C(e, 4) : "+" + e;
    });
    V(0, [
        "YY",
        2
    ], 0, function() {
        return this.year() % 100;
    });
    V(0, [
        "YYYY",
        4
    ], 0, "year");
    V(0, [
        "YYYYY",
        5
    ], 0, "year");
    V(0, [
        "YYYYYY",
        6,
        true
    ], 0, "year");
    et("year", "y");
    es("year", 1);
    eW("Y", eb);
    eW("YY", ev, ey);
    eW("YYYY", eS, ew);
    eW("YYYYY", eY, ep);
    eW("YYYYYY", eY, ep);
    eL([
        "YYYYY",
        "YYYYYY"
    ], eE);
    eL("YYYY", function(e, n) {
        n[eE] = e.length === 2 ? t.parseTwoDigitYear(e) : el(e);
    });
    eL("YY", function(e, n) {
        n[eE] = t.parseTwoDigitYear(e);
    });
    eL("Y", function(e, t) {
        t[eE] = parseInt(e, 10);
    });
    function tr(e) {
        return eo(e) ? 366 : 365;
    }
    t.parseTwoDigitYear = function(e) {
        return el(e) + (el(e) > 68 ? 1900 : 2000);
    };
    var ts = ef("FullYear", true);
    function ta() {
        return eo(this.year());
    }
    function to(e, t, n, i, r, s, a) {
        var o;
        if (e < 100 && e >= 0) {
            o = new Date(e + 400, t, n, i, r, s, a);
            if (isFinite(o.getFullYear())) {
                o.setFullYear(e);
            }
        } else {
            o = new Date(e, t, n, i, r, s, a);
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
        var i = 7 + t - n, r = (7 + tu(e, 0, i).getUTCDay() - t) % 7;
        return -r + i - 1;
    }
    function tf(e, t, n, i, r) {
        var s = (7 + n - i) % 7, a = tl(e, i, r), o = 1 + 7 * (t - 1) + s + a, u, l;
        if (o <= 0) {
            u = e - 1;
            l = tr(u) + o;
        } else if (o > tr(e)) {
            u = e + 1;
            l = o - tr(e);
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
        var i = tl(e.year(), t, n), r = Math.floor((e.dayOfYear() - i - 1) / 7) + 1, s, a;
        if (r < 1) {
            a = e.year() - 1;
            s = r + td(a, t, n);
        } else if (r > td(e.year(), t, n)) {
            s = r - td(e.year(), t, n);
            a = e.year() + 1;
        } else {
            a = e.year();
            s = r;
        }
        return {
            week: s,
            year: a
        };
    }
    function td(e, t, n) {
        var i = tl(e, t, n), r = tl(e + 1, t, n);
        return (tr(e) - i + r) / 7;
    }
    V("w", [
        "ww",
        2
    ], "wo", "week");
    V("W", [
        "WW",
        2
    ], "Wo", "isoWeek");
    et("week", "w");
    et("isoWeek", "W");
    es("week", 5);
    es("isoWeek", 5);
    eW("w", ev);
    eW("ww", ev, ey);
    eW("W", ev);
    eW("WW", ev, ey);
    eV([
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
    function t_() {
        return this._week.dow;
    }
    function ty() {
        return this._week.doy;
    }
    function tg(e) {
        var t = this.localeData().week(this);
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    function tw(e) {
        var t = th(this, 1, 4).week;
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    V("d", 0, "do", "day");
    V("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e);
    });
    V("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e);
    });
    V("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e);
    });
    V("e", 0, 0, "weekday");
    V("E", 0, 0, "isoWeekday");
    et("day", "d");
    et("weekday", "e");
    et("isoWeekday", "E");
    es("day", 11);
    es("weekday", 11);
    es("isoWeekday", 11);
    eW("d", ev);
    eW("e", ev);
    eW("E", ev);
    eW("dd", function(e, t) {
        return t.weekdaysMinRegex(e);
    });
    eW("ddd", function(e, t) {
        return t.weekdaysShortRegex(e);
    });
    eW("dddd", function(e, t) {
        return t.weekdaysRegex(e);
    });
    eV([
        "dd",
        "ddd",
        "dddd"
    ], function(e, t, n, i) {
        var r = n._locale.weekdaysParse(e, i, n._strict);
        if (r != null) {
            t.d = r;
        } else {
            m(n).invalidWeekday = e;
        }
    });
    eV([
        "d",
        "e",
        "E"
    ], function(e, t, n, i) {
        t[i] = el(e);
    });
    function tp(e, t) {
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
    function tk(e, t) {
        return e.slice(t, 7).concat(e.slice(0, t));
    }
    var tM = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), tD = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), tS = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), tY = eP, tO = eP, tb = eP;
    function tx(e, t) {
        var n = i(this._weekdays) ? this._weekdays : this._weekdays[e && e !== true && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
        return e === true ? tk(n, this._week.dow) : e ? n[e.day()] : n;
    }
    function tT(e) {
        return e === true ? tk(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
    }
    function tN(e) {
        return e === true ? tk(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
    }
    function tP(e, t, n) {
        var i, r, s, a = e.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];
            for(i = 0; i < 7; ++i){
                s = d([
                    2000,
                    1
                ]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(s, "").toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(s, "").toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(s, "").toLocaleLowerCase();
            }
        }
        if (n) {
            if (t === "dddd") {
                r = eQ.call(this._weekdaysParse, a);
                return r !== -1 ? r : null;
            } else if (t === "ddd") {
                r = eQ.call(this._shortWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else {
                r = eQ.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            }
        } else {
            if (t === "dddd") {
                r = eQ.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._shortWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else if (t === "ddd") {
                r = eQ.call(this._shortWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else {
                r = eQ.call(this._minWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = eQ.call(this._shortWeekdaysParse, a);
                return r !== -1 ? r : null;
            }
        }
    }
    function tR(e, t, n) {
        var i, r, s;
        if (this._weekdaysParseExact) {
            return tP.call(this, e, t, n);
        }
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for(i = 0; i < 7; i++){
            r = d([
                2000,
                1
            ]).day(i);
            if (n && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp("^" + this.weekdays(r, "").replace(".", "\\.?") + "$", "i");
                this._shortWeekdaysParse[i] = new RegExp("^" + this.weekdaysShort(r, "").replace(".", "\\.?") + "$", "i");
                this._minWeekdaysParse[i] = new RegExp("^" + this.weekdaysMin(r, "").replace(".", "\\.?") + "$", "i");
            }
            if (!this._weekdaysParse[i]) {
                s = "^" + this.weekdays(r, "") + "|^" + this.weekdaysShort(r, "") + "|^" + this.weekdaysMin(r, "");
                this._weekdaysParse[i] = new RegExp(s.replace(".", ""), "i");
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
    function tW(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (e != null) {
            e = tp(e, this.localeData());
            return this.add(e - t, "d");
        } else {
            return t;
        }
    }
    function tC(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return e == null ? t : this.add(e - t, "d");
    }
    function tU(e) {
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
    function tH(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tV.call(this);
            }
            if (e) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!s(this, "_weekdaysRegex")) {
                this._weekdaysRegex = tY;
            }
            return this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }
    function tF(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tV.call(this);
            }
            if (e) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!s(this, "_weekdaysShortRegex")) {
                this._weekdaysShortRegex = tO;
            }
            return this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }
    function tL(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tV.call(this);
            }
            if (e) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!s(this, "_weekdaysMinRegex")) {
                this._weekdaysMinRegex = tb;
            }
            return this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }
    function tV() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], n = [], i = [], r = [], s, a, o, u, l;
        for(s = 0; s < 7; s++){
            a = d([
                2000,
                1
            ]).day(s);
            o = eH(this.weekdaysMin(a, ""));
            u = eH(this.weekdaysShort(a, ""));
            l = eH(this.weekdays(a, ""));
            t.push(o);
            n.push(u);
            i.push(l);
            r.push(o);
            r.push(u);
            r.push(l);
        }
        t.sort(e);
        n.sort(e);
        i.sort(e);
        r.sort(e);
        this._weekdaysRegex = new RegExp("^(" + r.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    function tG() {
        return this.hours() % 12 || 12;
    }
    function tE() {
        return this.hours() || 24;
    }
    V("H", [
        "HH",
        2
    ], 0, "hour");
    V("h", [
        "hh",
        2
    ], 0, tG);
    V("k", [
        "kk",
        2
    ], 0, tE);
    V("hmm", 0, 0, function() {
        return "" + tG.apply(this) + C(this.minutes(), 2);
    });
    V("hmmss", 0, 0, function() {
        return ("" + tG.apply(this) + C(this.minutes(), 2) + C(this.seconds(), 2));
    });
    V("Hmm", 0, 0, function() {
        return "" + this.hours() + C(this.minutes(), 2);
    });
    V("Hmmss", 0, 0, function() {
        return ("" + this.hours() + C(this.minutes(), 2) + C(this.seconds(), 2));
    });
    function tA(e, t) {
        V(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }
    tA("a", true);
    tA("A", false);
    et("hour", "h");
    es("hour", 13);
    function tI(e, t) {
        return t._meridiemParse;
    }
    eW("a", tI);
    eW("A", tI);
    eW("H", ev);
    eW("h", ev);
    eW("k", ev);
    eW("HH", ev, ey);
    eW("hh", ev, ey);
    eW("kk", ev, ey);
    eW("hmm", ek);
    eW("hmmss", eM);
    eW("Hmm", ek);
    eW("Hmmss", eM);
    eL([
        "H",
        "HH"
    ], ej);
    eL([
        "k",
        "kk"
    ], function(e, t, n) {
        var i = el(e);
        t[ej] = i === 24 ? 0 : i;
    });
    eL([
        "a",
        "A"
    ], function(e, t, n) {
        n._isPm = n._locale.isPM(e);
        n._meridiem = e;
    });
    eL([
        "h",
        "hh"
    ], function(e, t, n) {
        t[ej] = el(e);
        m(n).bigHour = true;
    });
    eL("hmm", function(e, t, n) {
        var i = e.length - 2;
        t[ej] = el(e.substr(0, i));
        t[eZ] = el(e.substr(i));
        m(n).bigHour = true;
    });
    eL("hmmss", function(e, t, n) {
        var i = e.length - 4, r = e.length - 2;
        t[ej] = el(e.substr(0, i));
        t[eZ] = el(e.substr(i, 2));
        t[ez] = el(e.substr(r));
        m(n).bigHour = true;
    });
    eL("Hmm", function(e, t, n) {
        var i = e.length - 2;
        t[ej] = el(e.substr(0, i));
        t[eZ] = el(e.substr(i));
    });
    eL("Hmmss", function(e, t, n) {
        var i = e.length - 4, r = e.length - 2;
        t[ej] = el(e.substr(0, i));
        t[eZ] = el(e.substr(i, 2));
        t[ez] = el(e.substr(r));
    });
    function tj(e) {
        return (e + "").toLowerCase().charAt(0) === "p";
    }
    var tZ = /[ap]\.?m?\.?/i, tz = ef("Hours", true);
    function t$(e, t, n) {
        if (e > 11) {
            return n ? "pm" : "PM";
        } else {
            return n ? "am" : "AM";
        }
    }
    var tq = {
        calendar: R,
        longDateFormat: j,
        invalidDate: z,
        ordinal: q,
        dayOfMonthOrdinalParse: B,
        relativeTime: Q,
        months: eK,
        monthsShort: e0,
        week: tm,
        weekdays: tM,
        weekdaysMin: tS,
        weekdaysShort: tD,
        meridiemParse: tZ
    };
    var tB = {}, tJ = {}, tQ;
    function tX(e, t) {
        var n, i = Math.min(e.length, t.length);
        for(n = 0; n < i; n += 1){
            if (e[n] !== t[n]) {
                return n;
            }
        }
        return i;
    }
    function tK(e) {
        return e ? e.toLowerCase().replace("_", "-") : e;
    }
    function t0(e) {
        var t = 0, n, i, r, s;
        while(t < e.length){
            s = tK(e[t]).split("-");
            n = s.length;
            i = tK(e[t + 1]);
            i = i ? i.split("-") : null;
            while(n > 0){
                r = t1(s.slice(0, n).join("-"));
                if (r) {
                    return r;
                }
                if (i && i.length >= n && tX(s, i) >= n - 1) {
                    break;
                }
                n--;
            }
            t++;
        }
        return tQ;
    }
    function t1(e) {
        var t = null, n;
        if (tB[e] === undefined && typeof module !== "undefined" && module && module.exports) {
            try {
                t = tQ._abbr;
                n = require;
                n("./locale/" + e);
                t2(t);
            } catch (i) {
                tB[e] = null;
            }
        }
        return tB[e];
    }
    function t2(e, t) {
        var n;
        if (e) {
            if (o(t)) {
                n = t3(e);
            } else {
                n = t6(e, t);
            }
            if (n) {
                tQ = n;
            } else {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Locale " + e + " not found. Did you forget to load it?");
                }
            }
        }
        return tQ._abbr;
    }
    function t6(e, t) {
        if (t !== null) {
            var n, i = tq;
            t.abbr = e;
            if (tB[e] != null) {
                O("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change " + "an existing locale. moment.defineLocale(localeName, " + "config) should only be used for creating a new locale " + "See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
                i = tB[e]._config;
            } else if (t.parentLocale != null) {
                if (tB[t.parentLocale] != null) {
                    i = tB[t.parentLocale]._config;
                } else {
                    n = t1(t.parentLocale);
                    if (n != null) {
                        i = n._config;
                    } else {
                        if (!tJ[t.parentLocale]) {
                            tJ[t.parentLocale] = [];
                        }
                        tJ[t.parentLocale].push({
                            name: e,
                            config: t
                        });
                        return null;
                    }
                }
            }
            tB[e] = new N(T(i, t));
            if (tJ[e]) {
                tJ[e].forEach(function(e) {
                    t6(e.name, e.config);
                });
            }
            t2(e);
            return tB[e];
        } else {
            delete tB[e];
            return null;
        }
    }
    function t4(e, t) {
        if (t != null) {
            var n, i, r = tq;
            if (tB[e] != null && tB[e].parentLocale != null) {
                tB[e].set(T(tB[e]._config, t));
            } else {
                i = t1(e);
                if (i != null) {
                    r = i._config;
                }
                t = T(r, t);
                if (i == null) {
                    t.abbr = e;
                }
                n = new N(t);
                n.parentLocale = tB[e];
                tB[e] = n;
            }
            t2(e);
        } else {
            if (tB[e] != null) {
                if (tB[e].parentLocale != null) {
                    tB[e] = tB[e].parentLocale;
                    if (e === t2()) {
                        t2(e);
                    }
                } else if (tB[e] != null) {
                    delete tB[e];
                }
            }
        }
        return tB[e];
    }
    function t3(e) {
        var t;
        if (e && e._locale && e._locale._abbr) {
            e = e._locale._abbr;
        }
        if (!e) {
            return tQ;
        }
        if (!i(e)) {
            t = t1(e);
            if (t) {
                return t;
            }
            e = [
                e
            ];
        }
        return t0(e);
    }
    function t7() {
        return P(tB);
    }
    function t9(e) {
        var t, n = e._a;
        if (n && m(e).overflow === -2) {
            t = n[eA] < 0 || n[eA] > 11 ? eA : n[eI] < 1 || n[eI] > eX(n[eE], n[eA]) ? eI : n[ej] < 0 || n[ej] > 24 || (n[ej] === 24 && (n[eZ] !== 0 || n[ez] !== 0 || n[e$] !== 0)) ? ej : n[eZ] < 0 || n[eZ] > 59 ? eZ : n[ez] < 0 || n[ez] > 59 ? ez : n[e$] < 0 || n[e$] > 999 ? e$ : -1;
            if (m(e)._overflowDayOfYear && (t < eE || t > eI)) {
                t = eI;
            }
            if (m(e)._overflowWeeks && t === -1) {
                t = eq;
            }
            if (m(e)._overflowWeekday && t === -1) {
                t = eB;
            }
            m(e).overflow = t;
        }
        return e;
    }
    var t5 = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, t8 = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ne = /Z|[+-]\d\d(?::?\d\d)?/, nt = [
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
    ], ni = /^\/?Date\((-?\d+)/i, nr = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, ns = {
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
        var t, n, i = e._i, r = t5.exec(i) || t8.exec(i), s, a, o, u;
        if (r) {
            m(e).iso = true;
            for(t = 0, n = nt.length; t < n; t++){
                if (nt[t][1].exec(r[1])) {
                    a = nt[t][0];
                    s = nt[t][2] !== false;
                    break;
                }
            }
            if (a == null) {
                e._isValid = false;
                return;
            }
            if (r[3]) {
                for(t = 0, n = nn.length; t < n; t++){
                    if (nn[t][1].exec(r[3])) {
                        o = (r[2] || " ") + nn[t][0];
                        break;
                    }
                }
                if (o == null) {
                    e._isValid = false;
                    return;
                }
            }
            if (!s && o != null) {
                e._isValid = false;
                return;
            }
            if (r[4]) {
                if (ne.exec(r[4])) {
                    u = "Z";
                } else {
                    e._isValid = false;
                    return;
                }
            }
            e._f = a + (o || "") + (u || "");
            nw(e);
        } else {
            e._isValid = false;
        }
    }
    function no(e, t, n, i, r, s) {
        var a = [
            nu(e),
            e0.indexOf(t),
            parseInt(n, 10),
            parseInt(i, 10),
            parseInt(r, 10), 
        ];
        if (s) {
            a.push(parseInt(s, 10));
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
            var i = tD.indexOf(e), r = new Date(t[0], t[1], t[2]).getDay();
            if (i !== r) {
                m(n).weekdayMismatch = true;
                n._isValid = false;
                return false;
            }
        }
        return true;
    }
    function nh(e, t, n) {
        if (e) {
            return ns[e];
        } else if (t) {
            return 0;
        } else {
            var i = parseInt(n, 10), r = i % 100, s = (i - r) / 100;
            return s * 60 + r;
        }
    }
    function nd(e) {
        var t = nr.exec(nl(e._i)), n;
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
    function n_(e) {
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
    function ny(e) {
        var t, n, i = [], r, s, a;
        if (e._d) {
            return;
        }
        r = n_(e);
        if (e._w && e._a[eI] == null && e._a[eA] == null) {
            ng(e);
        }
        if (e._dayOfYear != null) {
            a = nm(e._a[eE], r[eE]);
            if (e._dayOfYear > tr(a) || e._dayOfYear === 0) {
                m(e)._overflowDayOfYear = true;
            }
            n = tu(a, 0, e._dayOfYear);
            e._a[eA] = n.getUTCMonth();
            e._a[eI] = n.getUTCDate();
        }
        for(t = 0; t < 3 && e._a[t] == null; ++t){
            e._a[t] = i[t] = r[t];
        }
        for(; t < 7; t++){
            e._a[t] = i[t] = e._a[t] == null ? (t === 2 ? 1 : 0) : e._a[t];
        }
        if (e._a[ej] === 24 && e._a[eZ] === 0 && e._a[ez] === 0 && e._a[e$] === 0) {
            e._nextDay = true;
            e._a[ej] = 0;
        }
        e._d = (e._useUTC ? tu : to).apply(null, i);
        s = e._useUTC ? e._d.getUTCDay() : e._d.getDay();
        if (e._tzm != null) {
            e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
        }
        if (e._nextDay) {
            e._a[ej] = 24;
        }
        if (e._w && typeof e._w.d !== "undefined" && e._w.d !== s) {
            m(e).weekdayMismatch = true;
        }
    }
    function ng(e) {
        var t, n, i, r, s, a, o, u, l;
        t = e._w;
        if (t.GG != null || t.W != null || t.E != null) {
            s = 1;
            a = 4;
            n = nm(t.GG, e._a[eE], th(nO(), 1, 4).year);
            i = nm(t.W, 1);
            r = nm(t.E, 1);
            if (r < 1 || r > 7) {
                u = true;
            }
        } else {
            s = e._locale._week.dow;
            a = e._locale._week.doy;
            l = th(nO(), s, a);
            n = nm(t.gg, e._a[eE], l.year);
            i = nm(t.w, l.week);
            if (t.d != null) {
                r = t.d;
                if (r < 0 || r > 6) {
                    u = true;
                }
            } else if (t.e != null) {
                r = t.e + s;
                if (t.e < 0 || t.e > 6) {
                    u = true;
                }
            } else {
                r = s;
            }
        }
        if (i < 1 || i > td(n, s, a)) {
            m(e)._overflowWeeks = true;
        } else if (u != null) {
            m(e)._overflowWeekday = true;
        } else {
            o = tf(n, i, r, s, a);
            e._a[eE] = o.year;
            e._dayOfYear = o.dayOfYear;
        }
    }
    t.ISO_8601 = function() {};
    t.RFC_2822 = function() {};
    function nw(e) {
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
        var n = "" + e._i, i, r, s, a, o, u = n.length, l = 0, f;
        s = I(e._f, e._locale).match(U) || [];
        for(i = 0; i < s.length; i++){
            a = s[i];
            r = (n.match(eC(a, e)) || [])[0];
            if (r) {
                o = n.substr(0, n.indexOf(r));
                if (o.length > 0) {
                    m(e).unusedInput.push(o);
                }
                n = n.slice(n.indexOf(r) + r.length);
                l += r.length;
            }
            if (L[a]) {
                if (r) {
                    m(e).empty = false;
                } else {
                    m(e).unusedTokens.push(a);
                }
                eG(a, r, e);
            } else if (e._strict && !r) {
                m(e).unusedTokens.push(a);
            }
        }
        m(e).charsLeftOver = u - l;
        if (n.length > 0) {
            m(e).unusedInput.push(n);
        }
        if (e._a[ej] <= 12 && m(e).bigHour === true && e._a[ej] > 0) {
            m(e).bigHour = undefined;
        }
        m(e).parsedDateParts = e._a.slice(0);
        m(e).meridiem = e._meridiem;
        e._a[ej] = np(e._locale, e._a[ej], e._meridiem);
        f = m(e).era;
        if (f !== null) {
            e._a[eE] = e._locale.erasConvertYear(f, e._a[eE]);
        }
        ny(e);
        t9(e);
    }
    function np(e, t, n) {
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
        var t, n, i, r, s, a, o = false;
        if (e._f.length === 0) {
            m(e).invalidFormat = true;
            e._d = new Date(NaN);
            return;
        }
        for(r = 0; r < e._f.length; r++){
            s = 0;
            a = false;
            t = v({}, e);
            if (e._useUTC != null) {
                t._useUTC = e._useUTC;
            }
            t._f = e._f[r];
            nw(t);
            if (y(t)) {
                a = true;
            }
            s += m(t).charsLeftOver;
            s += m(t).unusedTokens.length * 10;
            m(t).score = s;
            if (!o) {
                if (i == null || s < i || a) {
                    i = s;
                    n = t;
                    if (a) {
                        o = true;
                    }
                }
            } else {
                if (s < i) {
                    i = s;
                    n = t;
                }
            }
        }
        h(e, n || t);
    }
    function nk(e) {
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
        ny(e);
    }
    function nM(e) {
        var t = new k(t9(nD(e)));
        if (t._nextDay) {
            t.add(1, "d");
            t._nextDay = undefined;
        }
        return t;
    }
    function nD(e) {
        var t = e._i, n = e._f;
        e._locale = e._locale || t3(e._l);
        if (t === null || (n === undefined && t === "")) {
            return g({
                nullInput: true
            });
        }
        if (typeof t === "string") {
            e._i = t = e._locale.preparse(t);
        }
        if (M(t)) {
            return new k(t9(t));
        } else if (l(t)) {
            e._d = t;
        } else if (i(n)) {
            nv(e);
        } else if (n) {
            nw(e);
        } else {
            nS(e);
        }
        if (!y(e)) {
            e._d = null;
        }
        return e;
    }
    function nS(e) {
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
            ny(e);
        } else if (r(n)) {
            nk(e);
        } else if (u(n)) {
            e._d = new Date(n);
        } else {
            t.createFromInputFallback(e);
        }
    }
    function nY(e, t, n, s, o) {
        var u = {};
        if (t === true || t === false) {
            s = t;
            t = undefined;
        }
        if (n === true || n === false) {
            s = n;
            n = undefined;
        }
        if ((r(e) && a(e)) || (i(e) && e.length === 0)) {
            e = undefined;
        }
        u._isAMomentObject = true;
        u._useUTC = u._isUTC = o;
        u._l = n;
        u._i = e;
        u._f = t;
        u._strict = s;
        return nM(u);
    }
    function nO(e, t, n, i) {
        return nY(e, t, n, i, false);
    }
    var nb = S("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = nO.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e < this ? this : e;
        } else {
            return g();
        }
    }), nx = S("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = nO.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e > this ? this : e;
        } else {
            return g();
        }
    });
    function nT(e, t) {
        var n, r;
        if (t.length === 1 && i(t[0])) {
            t = t[0];
        }
        if (!t.length) {
            return nO();
        }
        n = t[0];
        for(r = 1; r < t.length; ++r){
            if (!t[r].isValid() || t[r][e](n)) {
                n = t[r];
            }
        }
        return n;
    }
    function nN() {
        var e = [].slice.call(arguments, 0);
        return nT("isBefore", e);
    }
    function nP() {
        var e = [].slice.call(arguments, 0);
        return nT("isAfter", e);
    }
    var nR = function() {
        return Date.now ? Date.now() : +new Date();
    };
    var nW = [
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
    function nC(e) {
        var t, n = false, i;
        for(t in e){
            if (s(e, t) && !(eQ.call(nW, t) !== -1 && (e[t] == null || !isNaN(e[t])))) {
                return false;
            }
        }
        for(i = 0; i < nW.length; ++i){
            if (e[nW[i]]) {
                if (n) {
                    return false;
                }
                if (parseFloat(e[nW[i]]) !== el(e[nW[i]])) {
                    n = true;
                }
            }
        }
        return true;
    }
    function nU() {
        return this._isValid;
    }
    function nH() {
        return n3(NaN);
    }
    function nF(e) {
        var t = ei(e), n = t.year || 0, i = t.quarter || 0, r = t.month || 0, s = t.week || t.isoWeek || 0, a = t.day || 0, o = t.hour || 0, u = t.minute || 0, l = t.second || 0, f = t.millisecond || 0;
        this._isValid = nC(t);
        this._milliseconds = +f + l * 1e3 + u * 6e4 + o * 1000 * 60 * 60;
        this._days = +a + s * 7;
        this._months = +r + i * 3 + n * 12;
        this._data = {};
        this._locale = t3();
        this._bubble();
    }
    function nL(e) {
        return e instanceof nF;
    }
    function nV(e) {
        if (e < 0) {
            return Math.round(-1 * e) * -1;
        } else {
            return Math.round(e);
        }
    }
    function nG(e, t, n) {
        var i = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), s = 0, a;
        for(a = 0; a < i; a++){
            if ((n && e[a] !== t[a]) || (!n && el(e[a]) !== el(t[a]))) {
                s++;
            }
        }
        return s + r;
    }
    function nE(e, t) {
        V(e, 0, 0, function() {
            var e = this.utcOffset(), n = "+";
            if (e < 0) {
                e = -e;
                n = "-";
            }
            return (n + C(~~(e / 60), 2) + t + C(~~e % 60, 2));
        });
    }
    nE("Z", ":");
    nE("ZZ", "");
    eW("Z", eT);
    eW("ZZ", eT);
    eL([
        "Z",
        "ZZ"
    ], function(e, t, n) {
        n._useUTC = true;
        n._tzm = nI(eT, e);
    });
    var nA = /([\+\-]|\d\d)/gi;
    function nI(e, t) {
        var n = (t || "").match(e), i, r, s;
        if (n === null) {
            return null;
        }
        i = n[n.length - 1] || [];
        r = (i + "").match(nA) || [
            "-",
            0,
            0
        ];
        s = +(r[1] * 60) + el(r[2]);
        return s === 0 ? 0 : r[0] === "+" ? s : -s;
    }
    function nj(e, n) {
        var i, r;
        if (n._isUTC) {
            i = n.clone();
            r = (M(e) || l(e) ? e.valueOf() : nO(e).valueOf()) - i.valueOf();
            i._d.setTime(i._d.valueOf() + r);
            t.updateOffset(i, false);
            return i;
        } else {
            return nO(e).local();
        }
    }
    function nZ(e) {
        return -Math.round(e._d.getTimezoneOffset());
    }
    t.updateOffset = function() {};
    function nz(e, n, i) {
        var r = this._offset || 0, s;
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        if (e != null) {
            if (typeof e === "string") {
                e = nI(eT, e);
                if (e === null) {
                    return this;
                }
            } else if (Math.abs(e) < 16 && !i) {
                e = e * 60;
            }
            if (!this._isUTC && n) {
                s = nZ(this);
            }
            this._offset = e;
            this._isUTC = true;
            if (s != null) {
                this.add(s, "m");
            }
            if (r !== e) {
                if (!n || this._changeInProgress) {
                    ie(this, n3(e - r, "m"), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    t.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? r : nZ(this);
        }
    }
    function n$(e, t) {
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
    function nq(e) {
        return this.utcOffset(0, e);
    }
    function nB(e) {
        if (this._isUTC) {
            this.utcOffset(0, e);
            this._isUTC = false;
            if (e) {
                this.subtract(nZ(this), "m");
            }
        }
        return this;
    }
    function nJ() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
            var e = nI(ex, this._i);
            if (e != null) {
                this.utcOffset(e);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }
    function nQ(e) {
        if (!this.isValid()) {
            return false;
        }
        e = e ? nO(e).utcOffset() : 0;
        return (this.utcOffset() - e) % 60 === 0;
    }
    function nX() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }
    function nK() {
        if (!o(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var e = {}, t;
        v(e, this);
        e = nD(e);
        if (e._a) {
            t = e._isUTC ? d(e._a) : nO(e._a);
            this._isDSTShifted = this.isValid() && nG(e._a, t.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }
    function n0() {
        return this.isValid() ? !this._isUTC : false;
    }
    function n1() {
        return this.isValid() ? this._isUTC : false;
    }
    function n2() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var n6 = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, n4 = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function n3(e, t) {
        var n = e, i = null, r, a, o;
        if (nL(e)) {
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
        } else if ((i = n6.exec(e))) {
            r = i[1] === "-" ? -1 : 1;
            n = {
                y: 0,
                d: el(i[eI]) * r,
                h: el(i[ej]) * r,
                m: el(i[eZ]) * r,
                s: el(i[ez]) * r,
                ms: el(nV(i[e$] * 1000)) * r
            };
        } else if ((i = n4.exec(e))) {
            r = i[1] === "-" ? -1 : 1;
            n = {
                y: n7(i[2], r),
                M: n7(i[3], r),
                w: n7(i[4], r),
                d: n7(i[5], r),
                h: n7(i[6], r),
                m: n7(i[7], r),
                s: n7(i[8], r)
            };
        } else if (n == null) {
            n = {};
        } else if (typeof n === "object" && ("from" in n || "to" in n)) {
            o = n5(nO(n.from), nO(n.to));
            n = {};
            n.ms = o.milliseconds;
            n.M = o.months;
        }
        a = new nF(n);
        if (nL(e) && s(e, "_locale")) {
            a._locale = e._locale;
        }
        if (nL(e) && s(e, "_isValid")) {
            a._isValid = e._isValid;
        }
        return a;
    }
    n3.fn = nF.prototype;
    n3.invalid = nH;
    function n7(e, t) {
        var n = e && parseFloat(e.replace(",", "."));
        return (isNaN(n) ? 0 : n) * t;
    }
    function n9(e, t) {
        var n = {};
        n.months = t.month() - e.month() + (t.year() - e.year()) * 12;
        if (e.clone().add(n.months, "M").isAfter(t)) {
            --n.months;
        }
        n.milliseconds = +t - +e.clone().add(n.months, "M");
        return n;
    }
    function n5(e, t) {
        var n;
        if (!(e.isValid() && t.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }
        t = nj(t, e);
        if (e.isBefore(t)) {
            n = n9(e, t);
        } else {
            n = n9(t, e);
            n.milliseconds = -n.milliseconds;
            n.months = -n.months;
        }
        return n;
    }
    function n8(e, t) {
        return function(n, i) {
            var r, s;
            if (i !== null && !isNaN(+i)) {
                O(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). " + "See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
                s = n;
                n = i;
                i = s;
            }
            r = n3(n, i);
            ie(this, r, e);
            return this;
        };
    }
    function ie(e, n, i, r) {
        var s = n._milliseconds, a = nV(n._days), o = nV(n._months);
        if (!e.isValid()) {
            return;
        }
        r = r == null ? true : r;
        if (o) {
            e5(e, eh(e, "Month") + o * i);
        }
        if (a) {
            ed(e, "Date", eh(e, "Date") + a * i);
        }
        if (s) {
            e._d.setTime(e._d.valueOf() + s * i);
        }
        if (r) {
            t.updateOffset(e, a || o);
        }
    }
    var it = n8(1, "add"), ii = n8(-1, "subtract");
    function ir(e) {
        return typeof e === "string" || e instanceof String;
    }
    function is(e) {
        return (M(e) || l(e) || ir(e) || u(e) || io(e) || ia(e) || e === null || e === undefined);
    }
    function ia(e) {
        var t = r(e) && !a(e), n = false, i = [
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
            n = n || s(e, u);
        }
        return t && n;
    }
    function io(e) {
        var t = i(e), n = false;
        if (t) {
            n = e.filter(function(t) {
                return !u(t) && ir(e);
            }).length === 0;
        }
        return t && n;
    }
    function iu(e) {
        var t = r(e) && !a(e), n = false, i = [
            "sameDay",
            "nextDay",
            "lastDay",
            "nextWeek",
            "lastWeek",
            "sameElse", 
        ], o, u;
        for(o = 0; o < i.length; o += 1){
            u = i[o];
            n = n || s(e, u);
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
            } else if (is(arguments[0])) {
                e = arguments[0];
                n = undefined;
            } else if (iu(arguments[0])) {
                n = arguments[0];
                e = undefined;
            }
        }
        var i = e || nO(), r = nj(i, this).startOf("day"), s = t.calendarFormat(this, r) || "sameElse", a = n && (b(n[s]) ? n[s].call(this, i) : n[s]);
        return this.format(a || this.localeData().calendar(s, this, nO(i)));
    }
    function id() {
        return new k(this);
    }
    function ic(e, t) {
        var n = M(e) ? e : nO(e);
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
        var n = M(e) ? e : nO(e);
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
    function i_(e, t, n, i) {
        var r = M(e) ? e : nO(e), s = M(t) ? t : nO(t);
        if (!(this.isValid() && r.isValid() && s.isValid())) {
            return false;
        }
        i = i || "()";
        return ((i[0] === "(" ? this.isAfter(r, n) : !this.isBefore(r, n)) && (i[1] === ")" ? this.isBefore(s, n) : !this.isAfter(s, n)));
    }
    function iy(e, t) {
        var n = M(e) ? e : nO(e), i;
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
    function ig(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t);
    }
    function iw(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t);
    }
    function ip(e, t, n) {
        var i, r, s;
        if (!this.isValid()) {
            return NaN;
        }
        i = nj(e, this);
        if (!i.isValid()) {
            return NaN;
        }
        r = (i.utcOffset() - this.utcOffset()) * 6e4;
        t = en(t);
        switch(t){
            case "year":
                s = iv(this, i) / 12;
                break;
            case "month":
                s = iv(this, i);
                break;
            case "quarter":
                s = iv(this, i) / 3;
                break;
            case "second":
                s = (this - i) / 1e3;
                break;
            case "minute":
                s = (this - i) / 6e4;
                break;
            case "hour":
                s = (this - i) / 36e5;
                break;
            case "day":
                s = (this - i - r) / 864e5;
                break;
            case "week":
                s = (this - i - r) / 6048e5;
                break;
            default:
                s = this - i;
        }
        return n ? s : eu(s);
    }
    function iv(e, t) {
        if (e.date() < t.date()) {
            return -iv(t, e);
        }
        var n = (t.year() - e.year()) * 12 + (t.month() - e.month()), i = e.clone().add(n, "months"), r, s;
        if (t - i < 0) {
            r = e.clone().add(n - 1, "months");
            s = (t - i) / (i - r);
        } else {
            r = e.clone().add(n + 1, "months");
            s = (t - i) / (r - i);
        }
        return -(n + s) || 0;
    }
    t.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    t.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function ik() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function iM(e) {
        if (!this.isValid()) {
            return null;
        }
        var t = e !== true, n = t ? this.clone().utc() : this;
        if (n.year() < 0 || n.year() > 9999) {
            return A(n, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (b(Date.prototype.toISOString)) {
            if (t) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace("Z", A(n, "Z"));
            }
        }
        return A(n, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function iD() {
        if (!this.isValid()) {
            return "moment.invalid(/* " + this._i + " */)";
        }
        var e = "moment", t = "", n, i, r, s;
        if (!this.isLocal()) {
            e = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
            t = "Z";
        }
        n = "[" + e + '("]';
        i = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        r = "-MM-DD[T]HH:mm:ss.SSS";
        s = t + '[")]';
        return this.format(n + i + r + s);
    }
    function iS(e) {
        if (!e) {
            e = this.isUtc() ? t.defaultFormatUtc : t.defaultFormat;
        }
        var n = A(this, e);
        return this.localeData().postformat(n);
    }
    function iY(e, t) {
        if (this.isValid() && ((M(e) && e.isValid()) || nO(e).isValid())) {
            return n3({
                to: this,
                from: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function iO(e) {
        return this.from(nO(), e);
    }
    function ib(e, t) {
        if (this.isValid() && ((M(e) && e.isValid()) || nO(e).isValid())) {
            return n3({
                from: this,
                to: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function ix(e) {
        return this.to(nO(), e);
    }
    function iT(e) {
        var t;
        if (e === undefined) {
            return this._locale._abbr;
        } else {
            t = t3(e);
            if (t != null) {
                this._locale = t;
            }
            return this;
        }
    }
    var iN = S("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        if (e === undefined) {
            return this.localeData();
        } else {
            return this.locale(e);
        }
    });
    function iP() {
        return this._locale;
    }
    var iR = 1000, iW = 60 * iR, iC = 60 * iW, iU = (365 * 400 + 97) * 24 * iC;
    function iH(e, t) {
        return ((e % t) + t) % t;
    }
    function iF(e, t, n) {
        if (e < 100 && e >= 0) {
            return new Date(e + 400, t, n) - iU;
        } else {
            return new Date(e, t, n).valueOf();
        }
    }
    function iL(e, t, n) {
        if (e < 100 && e >= 0) {
            return Date.UTC(e + 400, t, n) - iU;
        } else {
            return Date.UTC(e, t, n);
        }
    }
    function iV(e) {
        var n, i;
        e = en(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        i = this._isUTC ? iL : iF;
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
                n -= iH(n + (this._isUTC ? 0 : this.utcOffset() * iW), iC);
                break;
            case "minute":
                n = this._d.valueOf();
                n -= iH(n, iW);
                break;
            case "second":
                n = this._d.valueOf();
                n -= iH(n, iR);
                break;
        }
        this._d.setTime(n);
        t.updateOffset(this, true);
        return this;
    }
    function iG(e) {
        var n, i;
        e = en(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        i = this._isUTC ? iL : iF;
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
                n += iC - iH(n + (this._isUTC ? 0 : this.utcOffset() * iW), iC) - 1;
                break;
            case "minute":
                n = this._d.valueOf();
                n += iW - iH(n, iW) - 1;
                break;
            case "second":
                n = this._d.valueOf();
                n += iR - iH(n, iR) - 1;
                break;
        }
        this._d.setTime(n);
        t.updateOffset(this, true);
        return this;
    }
    function iE() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }
    function iA() {
        return Math.floor(this.valueOf() / 1000);
    }
    function iI() {
        return new Date(this.valueOf());
    }
    function ij() {
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
    function iZ() {
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
    function iz() {
        return this.isValid() ? this.toISOString() : null;
    }
    function i$() {
        return y(this);
    }
    function iq() {
        return h({}, m(this));
    }
    function iB() {
        return m(this).overflow;
    }
    function iJ() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    V("N", 0, 0, "eraAbbr");
    V("NN", 0, 0, "eraAbbr");
    V("NNN", 0, 0, "eraAbbr");
    V("NNNN", 0, 0, "eraName");
    V("NNNNN", 0, 0, "eraNarrow");
    V("y", [
        "y",
        1
    ], "yo", "eraYear");
    V("y", [
        "yy",
        2
    ], 0, "eraYear");
    V("y", [
        "yyy",
        3
    ], 0, "eraYear");
    V("y", [
        "yyyy",
        4
    ], 0, "eraYear");
    eW("N", i9);
    eW("NN", i9);
    eW("NNN", i9);
    eW("NNNN", i5);
    eW("NNNNN", i8);
    eL([
        "N",
        "NN",
        "NNN",
        "NNNN",
        "NNNNN"
    ], function(e, t, n, i) {
        var r = n._locale.erasParse(e, i, n._strict);
        if (r) {
            m(n).era = r;
        } else {
            m(n).invalidEra = e;
        }
    });
    eW("y", eO);
    eW("yy", eO);
    eW("yyy", eO);
    eW("yyyy", eO);
    eW("yo", re);
    eL([
        "y",
        "yy",
        "yyy",
        "yyyy"
    ], eE);
    eL([
        "yo"
    ], function(e, t, n, i) {
        var r;
        if (n._locale._eraYearOrdinalRegex) {
            r = e.match(n._locale._eraYearOrdinalRegex);
        }
        if (n._locale.eraYearOrdinalParse) {
            t[eE] = n._locale.eraYearOrdinalParse(e, r);
        } else {
            t[eE] = parseInt(e, 10);
        }
    });
    function iQ(e, n) {
        var i, r, s, a = this._eras || t3("en")._eras;
        for(i = 0, r = a.length; i < r; ++i){
            switch(typeof a[i].since){
                case "string":
                    s = t(a[i].since).startOf("day");
                    a[i].since = s.valueOf();
                    break;
            }
            switch(typeof a[i].until){
                case "undefined":
                    a[i].until = +Infinity;
                    break;
                case "string":
                    s = t(a[i].until).startOf("day").valueOf();
                    a[i].until = s.valueOf();
                    break;
            }
        }
        return a;
    }
    function iX(e, t, n) {
        var i, r, s = this.eras(), a, o, u;
        e = e.toUpperCase();
        for(i = 0, r = s.length; i < r; ++i){
            a = s[i].name.toUpperCase();
            o = s[i].abbr.toUpperCase();
            u = s[i].narrow.toUpperCase();
            if (n) {
                switch(t){
                    case "N":
                    case "NN":
                    case "NNN":
                        if (o === e) {
                            return s[i];
                        }
                        break;
                    case "NNNN":
                        if (a === e) {
                            return s[i];
                        }
                        break;
                    case "NNNNN":
                        if (u === e) {
                            return s[i];
                        }
                        break;
                }
            } else if ([
                a,
                o,
                u
            ].indexOf(e) >= 0) {
                return s[i];
            }
        }
    }
    function iK(e, n) {
        var i = e.since <= e.until ? +1 : -1;
        if (n === undefined) {
            return t(e.since).year();
        } else {
            return t(e.since).year() + (n - e.offset) * i;
        }
    }
    function i0() {
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
    function i1() {
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
    function i2() {
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
    function i6() {
        var e, n, i, r, s = this.localeData().eras();
        for(e = 0, n = s.length; e < n; ++e){
            i = s[e].since <= s[e].until ? +1 : -1;
            r = this.clone().startOf("day").valueOf();
            if ((s[e].since <= r && r <= s[e].until) || (s[e].until <= r && r <= s[e].since)) {
                return ((this.year() - t(s[e].since).year()) * i + s[e].offset);
            }
        }
        return this.year();
    }
    function i4(e) {
        if (!s(this, "_erasNameRegex")) {
            rt.call(this);
        }
        return e ? this._erasNameRegex : this._erasRegex;
    }
    function i3(e) {
        if (!s(this, "_erasAbbrRegex")) {
            rt.call(this);
        }
        return e ? this._erasAbbrRegex : this._erasRegex;
    }
    function i7(e) {
        if (!s(this, "_erasNarrowRegex")) {
            rt.call(this);
        }
        return e ? this._erasNarrowRegex : this._erasRegex;
    }
    function i9(e, t) {
        return t.erasAbbrRegex(e);
    }
    function i5(e, t) {
        return t.erasNameRegex(e);
    }
    function i8(e, t) {
        return t.erasNarrowRegex(e);
    }
    function re(e, t) {
        return t._eraYearOrdinalRegex || eO;
    }
    function rt() {
        var e = [], t = [], n = [], i = [], r, s, a = this.eras();
        for(r = 0, s = a.length; r < s; ++r){
            t.push(eH(a[r].name));
            e.push(eH(a[r].abbr));
            n.push(eH(a[r].narrow));
            i.push(eH(a[r].name));
            i.push(eH(a[r].abbr));
            i.push(eH(a[r].narrow));
        }
        this._erasRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + t.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + e.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }
    V(0, [
        "gg",
        2
    ], 0, function() {
        return this.weekYear() % 100;
    });
    V(0, [
        "GG",
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    function rn(e, t) {
        V(0, [
            e,
            e.length
        ], 0, t);
    }
    rn("gggg", "weekYear");
    rn("ggggg", "weekYear");
    rn("GGGG", "isoWeekYear");
    rn("GGGGG", "isoWeekYear");
    et("weekYear", "gg");
    et("isoWeekYear", "GG");
    es("weekYear", 1);
    es("isoWeekYear", 1);
    eW("G", eb);
    eW("g", eb);
    eW("GG", ev, ey);
    eW("gg", ev, ey);
    eW("GGGG", eS, ew);
    eW("gggg", eS, ew);
    eW("GGGGG", eY, ep);
    eW("ggggg", eY, ep);
    eV([
        "gggg",
        "ggggg",
        "GGGG",
        "GGGGG"
    ], function(e, t, n, i) {
        t[i.substr(0, 2)] = el(e);
    });
    eV([
        "gg",
        "GG"
    ], function(e, n, i, r) {
        n[r] = t.parseTwoDigitYear(e);
    });
    function ri(e) {
        return rl.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function rr(e) {
        return rl.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function rs() {
        return td(this.year(), 1, 4);
    }
    function ra() {
        return td(this.isoWeekYear(), 1, 4);
    }
    function ro() {
        var e = this.localeData()._week;
        return td(this.year(), e.dow, e.doy);
    }
    function ru() {
        var e = this.localeData()._week;
        return td(this.weekYear(), e.dow, e.doy);
    }
    function rl(e, t, n, i, r) {
        var s;
        if (e == null) {
            return th(this, i, r).year;
        } else {
            s = td(e, i, r);
            if (t > s) {
                t = s;
            }
            return rf.call(this, e, t, n, i, r);
        }
    }
    function rf(e, t, n, i, r) {
        var s = tf(e, t, n, i, r), a = tu(s.year, 0, s.dayOfYear);
        this.year(a.getUTCFullYear());
        this.month(a.getUTCMonth());
        this.date(a.getUTCDate());
        return this;
    }
    V("Q", 0, "Qo", "quarter");
    et("quarter", "Q");
    es("quarter", 7);
    eW("Q", e_);
    eL("Q", function(e, t) {
        t[eA] = (el(e) - 1) * 3;
    });
    function rh(e) {
        return e == null ? Math.ceil((this.month() + 1) / 3) : this.month((e - 1) * 3 + (this.month() % 3));
    }
    V("D", [
        "DD",
        2
    ], "Do", "date");
    et("date", "D");
    es("date", 9);
    eW("D", ev);
    eW("DD", ev, ey);
    eW("Do", function(e, t) {
        return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
    });
    eL([
        "D",
        "DD"
    ], eI);
    eL("Do", function(e, t) {
        t[eI] = el(e.match(ev)[0]);
    });
    var rd = ef("Date", true);
    V("DDD", [
        "DDDD",
        3
    ], "DDDo", "dayOfYear");
    et("dayOfYear", "DDD");
    es("dayOfYear", 4);
    eW("DDD", eD);
    eW("DDDD", eg);
    eL([
        "DDD",
        "DDDD"
    ], function(e, t, n) {
        n._dayOfYear = el(e);
    });
    function rc(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return e == null ? t : this.add(e - t, "d");
    }
    V("m", [
        "mm",
        2
    ], 0, "minute");
    et("minute", "m");
    es("minute", 14);
    eW("m", ev);
    eW("mm", ev, ey);
    eL([
        "m",
        "mm"
    ], eZ);
    var rm = ef("Minutes", false);
    V("s", [
        "ss",
        2
    ], 0, "second");
    et("second", "s");
    es("second", 15);
    eW("s", ev);
    eW("ss", ev, ey);
    eL([
        "s",
        "ss"
    ], ez);
    var r_ = ef("Seconds", false);
    V("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    V(0, [
        "SS",
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    V(0, [
        "SSS",
        3
    ], 0, "millisecond");
    V(0, [
        "SSSS",
        4
    ], 0, function() {
        return this.millisecond() * 10;
    });
    V(0, [
        "SSSSS",
        5
    ], 0, function() {
        return this.millisecond() * 100;
    });
    V(0, [
        "SSSSSS",
        6
    ], 0, function() {
        return this.millisecond() * 1000;
    });
    V(0, [
        "SSSSSSS",
        7
    ], 0, function() {
        return this.millisecond() * 10000;
    });
    V(0, [
        "SSSSSSSS",
        8
    ], 0, function() {
        return this.millisecond() * 100000;
    });
    V(0, [
        "SSSSSSSSS",
        9
    ], 0, function() {
        return this.millisecond() * 1000000;
    });
    et("millisecond", "ms");
    es("millisecond", 16);
    eW("S", eD, e_);
    eW("SS", eD, ey);
    eW("SSS", eD, eg);
    var ry, rg;
    for(ry = "SSSS"; ry.length <= 9; ry += "S"){
        eW(ry, eO);
    }
    function rw(e, t) {
        t[e$] = el(("0." + e) * 1000);
    }
    for(ry = "S"; ry.length <= 9; ry += "S"){
        eL(ry, rw);
    }
    rg = ef("Milliseconds", false);
    V("z", 0, 0, "zoneAbbr");
    V("zz", 0, 0, "zoneName");
    function rp() {
        return this._isUTC ? "UTC" : "";
    }
    function rv() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var rk = k.prototype;
    rk.add = it;
    rk.calendar = ih;
    rk.clone = id;
    rk.diff = ip;
    rk.endOf = iG;
    rk.format = iS;
    rk.from = iY;
    rk.fromNow = iO;
    rk.to = ib;
    rk.toNow = ix;
    rk.get = ec;
    rk.invalidAt = iB;
    rk.isAfter = ic;
    rk.isBefore = im;
    rk.isBetween = i_;
    rk.isSame = iy;
    rk.isSameOrAfter = ig;
    rk.isSameOrBefore = iw;
    rk.isValid = i$;
    rk.lang = iN;
    rk.locale = iT;
    rk.localeData = iP;
    rk.max = nx;
    rk.min = nb;
    rk.parsingFlags = iq;
    rk.set = em;
    rk.startOf = iV;
    rk.subtract = ii;
    rk.toArray = ij;
    rk.toObject = iZ;
    rk.toDate = iI;
    rk.toISOString = iM;
    rk.inspect = iD;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
        rk[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        };
    }
    rk.toJSON = iz;
    rk.toString = ik;
    rk.unix = iA;
    rk.valueOf = iE;
    rk.creationData = iJ;
    rk.eraName = i0;
    rk.eraNarrow = i1;
    rk.eraAbbr = i2;
    rk.eraYear = i6;
    rk.year = ts;
    rk.isLeapYear = ta;
    rk.weekYear = ri;
    rk.isoWeekYear = rr;
    rk.quarter = rk.quarters = rh;
    rk.month = e8;
    rk.daysInMonth = te;
    rk.week = rk.weeks = tg;
    rk.isoWeek = rk.isoWeeks = tw;
    rk.weeksInYear = ro;
    rk.weeksInWeekYear = ru;
    rk.isoWeeksInYear = rs;
    rk.isoWeeksInISOWeekYear = ra;
    rk.date = rd;
    rk.day = rk.days = tW;
    rk.weekday = tC;
    rk.isoWeekday = tU;
    rk.dayOfYear = rc;
    rk.hour = rk.hours = tz;
    rk.minute = rk.minutes = rm;
    rk.second = rk.seconds = r_;
    rk.millisecond = rk.milliseconds = rg;
    rk.utcOffset = nz;
    rk.utc = nq;
    rk.local = nB;
    rk.parseZone = nJ;
    rk.hasAlignedHourOffset = nQ;
    rk.isDST = nX;
    rk.isLocal = n0;
    rk.isUtcOffset = n1;
    rk.isUtc = n2;
    rk.isUTC = n2;
    rk.zoneAbbr = rp;
    rk.zoneName = rv;
    rk.dates = S("dates accessor is deprecated. Use date instead.", rd);
    rk.months = S("months accessor is deprecated. Use month instead", e8);
    rk.years = S("years accessor is deprecated. Use year instead", ts);
    rk.zone = S("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", n$);
    rk.isDSTShifted = S("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", nK);
    function rM(e) {
        return nO(e * 1000);
    }
    function rD() {
        return nO.apply(null, arguments).parseZone();
    }
    function rS(e) {
        return e;
    }
    var rY = N.prototype;
    rY.calendar = W;
    rY.longDateFormat = Z;
    rY.invalidDate = $;
    rY.ordinal = J;
    rY.preparse = rS;
    rY.postformat = rS;
    rY.relativeTime = X;
    rY.pastFuture = K;
    rY.set = x;
    rY.eras = iQ;
    rY.erasParse = iX;
    rY.erasConvertYear = iK;
    rY.erasAbbrRegex = i3;
    rY.erasNameRegex = i4;
    rY.erasNarrowRegex = i7;
    rY.months = e4;
    rY.monthsShort = e3;
    rY.monthsParse = e9;
    rY.monthsRegex = tn;
    rY.monthsShortRegex = tt;
    rY.week = tc;
    rY.firstDayOfYear = ty;
    rY.firstDayOfWeek = t_;
    rY.weekdays = tx;
    rY.weekdaysMin = tN;
    rY.weekdaysShort = tT;
    rY.weekdaysParse = tR;
    rY.weekdaysRegex = tH;
    rY.weekdaysShortRegex = tF;
    rY.weekdaysMinRegex = tL;
    rY.isPM = tj;
    rY.meridiem = t$;
    function rO(e, t, n, i) {
        var r = t3(), s = d().set(i, t);
        return r[n](s, e);
    }
    function rb(e, t, n) {
        if (u(e)) {
            t = e;
            e = undefined;
        }
        e = e || "";
        if (t != null) {
            return rO(e, t, n, "month");
        }
        var i, r = [];
        for(i = 0; i < 12; i++){
            r[i] = rO(e, i, n, "month");
        }
        return r;
    }
    function rx(e, t, n, i) {
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
        var r = t3(), s = e ? r._week.dow : 0, a, o = [];
        if (n != null) {
            return rO(t, (n + s) % 7, i, "day");
        }
        for(a = 0; a < 7; a++){
            o[a] = rO(t, (a + s) % 7, i, "day");
        }
        return o;
    }
    function rT(e, t) {
        return rb(e, t, "months");
    }
    function rN(e, t) {
        return rb(e, t, "monthsShort");
    }
    function rP(e, t, n) {
        return rx(e, t, n, "weekdays");
    }
    function rR(e, t, n) {
        return rx(e, t, n, "weekdaysShort");
    }
    function rW(e, t, n) {
        return rx(e, t, n, "weekdaysMin");
    }
    t2("en", {
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
    t.lang = S("moment.lang is deprecated. Use moment.locale instead.", t2);
    t.langData = S("moment.langData is deprecated. Use moment.localeData instead.", t3);
    var rC = Math.abs;
    function rU() {
        var e = this._data;
        this._milliseconds = rC(this._milliseconds);
        this._days = rC(this._days);
        this._months = rC(this._months);
        e.milliseconds = rC(e.milliseconds);
        e.seconds = rC(e.seconds);
        e.minutes = rC(e.minutes);
        e.hours = rC(e.hours);
        e.months = rC(e.months);
        e.years = rC(e.years);
        return this;
    }
    function rH(e, t, n, i) {
        var r = n3(t, n);
        e._milliseconds += i * r._milliseconds;
        e._days += i * r._days;
        e._months += i * r._months;
        return e._bubble();
    }
    function rF(e, t) {
        return rH(this, e, t, 1);
    }
    function rL(e, t) {
        return rH(this, e, t, -1);
    }
    function rV(e) {
        if (e < 0) {
            return Math.floor(e);
        } else {
            return Math.ceil(e);
        }
    }
    function rG() {
        var e = this._milliseconds, t = this._days, n = this._months, i = this._data, r, s, a, o, u;
        if (!((e >= 0 && t >= 0 && n >= 0) || (e <= 0 && t <= 0 && n <= 0))) {
            e += rV(rA(n) + t) * 864e5;
            t = 0;
            n = 0;
        }
        i.milliseconds = e % 1000;
        r = eu(e / 1000);
        i.seconds = r % 60;
        s = eu(r / 60);
        i.minutes = s % 60;
        a = eu(s / 60);
        i.hours = a % 24;
        t += eu(a / 24);
        u = eu(rE(t));
        n += u;
        t -= rV(rA(u));
        o = eu(n / 12);
        n %= 12;
        i.days = t;
        i.months = n;
        i.years = o;
        return this;
    }
    function rE(e) {
        return (e * 4800) / 146097;
    }
    function rA(e) {
        return (e * 146097) / 4800;
    }
    function rI(e) {
        if (!this.isValid()) {
            return NaN;
        }
        var t, n, i = this._milliseconds;
        e = en(e);
        if (e === "month" || e === "quarter" || e === "year") {
            t = this._days + i / 864e5;
            n = this._months + rE(t);
            switch(e){
                case "month":
                    return n;
                case "quarter":
                    return n / 3;
                case "year":
                    return n / 12;
            }
        } else {
            t = this._days + Math.round(rA(this._months));
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
    function rj() {
        if (!this.isValid()) {
            return NaN;
        }
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + el(this._months / 12) * 31536e6);
    }
    function rZ(e) {
        return function() {
            return this.as(e);
        };
    }
    var rz = rZ("ms"), r$ = rZ("s"), rq = rZ("m"), rB = rZ("h"), rJ = rZ("d"), rQ = rZ("w"), rX = rZ("M"), rK = rZ("Q"), r0 = rZ("y");
    function r1() {
        return n3(this);
    }
    function r2(e) {
        e = en(e);
        return this.isValid() ? this[e + "s"]() : NaN;
    }
    function r6(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN;
        };
    }
    var r4 = r6("milliseconds"), r3 = r6("seconds"), r7 = r6("minutes"), r9 = r6("hours"), r5 = r6("days"), r8 = r6("months"), se = r6("years");
    function st() {
        return eu(this.days() / 7);
    }
    var sn = Math.round, si = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    function sr(e, t, n, i, r) {
        return r.relativeTime(t || 1, !!n, e, i);
    }
    function ss(e, t, n, i) {
        var r = n3(e).abs(), s = sn(r.as("s")), a = sn(r.as("m")), o = sn(r.as("h")), u = sn(r.as("d")), l = sn(r.as("M")), f = sn(r.as("w")), h = sn(r.as("y")), d = (s <= n.ss && [
            "s",
            s
        ]) || (s < n.s && [
            "ss",
            s
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
        return sr.apply(null, d);
    }
    function sa(e) {
        if (e === undefined) {
            return sn;
        }
        if (typeof e === "function") {
            sn = e;
            return true;
        }
        return false;
    }
    function so(e, t) {
        if (si[e] === undefined) {
            return false;
        }
        if (t === undefined) {
            return si[e];
        }
        si[e] = t;
        if (e === "s") {
            si.ss = t - 1;
        }
        return true;
    }
    function su(e, t) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var n = false, i = si, r, s;
        if (typeof e === "object") {
            t = e;
            e = false;
        }
        if (typeof e === "boolean") {
            n = e;
        }
        if (typeof t === "object") {
            i = Object.assign({}, si, t);
            if (t.s != null && t.ss == null) {
                i.ss = t.s - 1;
            }
        }
        r = this.localeData();
        s = ss(this, !n, i, r);
        if (n) {
            s = r.pastFuture(+this, s);
        }
        return r.postformat(s);
    }
    var sl = Math.abs;
    function sf(e) {
        return (e > 0) - (e < 0) || +e;
    }
    function sh() {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var e = sl(this._milliseconds) / 1000, t = sl(this._days), n = sl(this._months), i, r, s, a, o = this.asSeconds(), u, l, f, h;
        if (!o) {
            return "P0D";
        }
        i = eu(e / 60);
        r = eu(i / 60);
        e %= 60;
        i %= 60;
        s = eu(n / 12);
        n %= 12;
        a = e ? e.toFixed(3).replace(/\.?0+$/, "") : "";
        u = o < 0 ? "-" : "";
        l = sf(this._months) !== sf(o) ? "-" : "";
        f = sf(this._days) !== sf(o) ? "-" : "";
        h = sf(this._milliseconds) !== sf(o) ? "-" : "";
        return (u + "P" + (s ? l + s + "Y" : "") + (n ? l + n + "M" : "") + (t ? f + t + "D" : "") + (r || i || e ? "T" : "") + (r ? h + r + "H" : "") + (i ? h + i + "M" : "") + (e ? h + a + "S" : ""));
    }
    var sd = nF.prototype;
    sd.isValid = nU;
    sd.abs = rU;
    sd.add = rF;
    sd.subtract = rL;
    sd.as = rI;
    sd.asMilliseconds = rz;
    sd.asSeconds = r$;
    sd.asMinutes = rq;
    sd.asHours = rB;
    sd.asDays = rJ;
    sd.asWeeks = rQ;
    sd.asMonths = rX;
    sd.asQuarters = rK;
    sd.asYears = r0;
    sd.valueOf = rj;
    sd._bubble = rG;
    sd.clone = r1;
    sd.get = r2;
    sd.milliseconds = r4;
    sd.seconds = r3;
    sd.minutes = r7;
    sd.hours = r9;
    sd.days = r5;
    sd.weeks = st;
    sd.months = r8;
    sd.years = se;
    sd.humanize = su;
    sd.toISOString = sh;
    sd.toString = sh;
    sd.toJSON = sh;
    sd.locale = iT;
    sd.localeData = iP;
    sd.toIsoString = S("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", sh);
    sd.lang = iN;
    V("X", 0, 0, "unix");
    V("x", 0, 0, "valueOf");
    eW("x", eb);
    eW("X", eN);
    eL("X", function(e, t, n) {
        n._d = new Date(parseFloat(e) * 1000);
    });
    eL("x", function(e, t, n) {
        n._d = new Date(el(e));
    });
    t.version = "2.29.1";
    n(nO);
    t.fn = rk;
    t.min = nN;
    t.max = nP;
    t.now = nR;
    t.utc = d;
    t.unix = rM;
    t.months = rT;
    t.isDate = l;
    t.locale = t2;
    t.invalid = g;
    t.duration = n3;
    t.isMoment = M;
    t.weekdays = rP;
    t.parseZone = rD;
    t.localeData = t3;
    t.isDuration = nL;
    t.monthsShort = rN;
    t.weekdaysMin = rW;
    t.defineLocale = t6;
    t.updateLocale = t4;
    t.locales = t7;
    t.weekdaysShort = rR;
    t.normalizeUnits = en;
    t.relativeTimeRounding = sa;
    t.relativeTimeThreshold = so;
    t.calendarFormat = il;
    t.prototype = rk;
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
