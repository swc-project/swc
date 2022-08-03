(function(e, t) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = t()) : typeof define === "function" && define.amd ? define(t) : (e.moment = t());
})(this, function() {
    "use strict";
    var e;
    function t() {
        return e.apply(null, arguments);
    }
    function i(t) {
        e = t;
    }
    function n(e) {
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
    function u(e) {
        return e === void 0;
    }
    function o(e) {
        return (typeof e === "number" || Object.prototype.toString.call(e) === "[object Number]");
    }
    function l(e) {
        return (e instanceof Date || Object.prototype.toString.call(e) === "[object Date]");
    }
    function f(e, t) {
        var i = [], n;
        for(n = 0; n < e.length; ++n){
            i.push(t(e[n], n));
        }
        return i;
    }
    function h(e, t) {
        for(var i in t){
            if (s(t, i)) {
                e[i] = t[i];
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
    function c(e, t, i, n) {
        return iT(e, t, i, n, true).utc();
    }
    function d() {
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
    function $(e) {
        if (e._pf == null) {
            e._pf = d();
        }
        return e._pf;
    }
    var m;
    if (Array.prototype.some) {
        m = Array.prototype.some;
    } else {
        m = function(e) {
            var t = Object(this), i = t.length >>> 0, n;
            for(n = 0; n < i; n++){
                if (n in t && e.call(this, t[n], n, t)) {
                    return true;
                }
            }
            return false;
        };
    }
    function y(e) {
        if (e._isValid == null) {
            var t = $(e), i = m.call(t.parsedDateParts, function(e) {
                return e != null;
            }), n = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidEra && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || (t.meridiem && i));
            if (e._strict) {
                n = n && t.charsLeftOver === 0 && t.unusedTokens.length === 0 && t.bigHour === undefined;
            }
            if (Object.isFrozen == null || !Object.isFrozen(e)) {
                e._isValid = n;
            } else {
                return n;
            }
        }
        return e._isValid;
    }
    function v(e) {
        var t = c(NaN);
        if (e != null) {
            h($(t), e);
        } else {
            $(t).userInvalidated = true;
        }
        return t;
    }
    var w = (t.momentProperties = []), _ = false;
    function g(e, t) {
        var i, n, r;
        if (!u(t._isAMomentObject)) {
            e._isAMomentObject = t._isAMomentObject;
        }
        if (!u(t._i)) {
            e._i = t._i;
        }
        if (!u(t._f)) {
            e._f = t._f;
        }
        if (!u(t._l)) {
            e._l = t._l;
        }
        if (!u(t._strict)) {
            e._strict = t._strict;
        }
        if (!u(t._tzm)) {
            e._tzm = t._tzm;
        }
        if (!u(t._isUTC)) {
            e._isUTC = t._isUTC;
        }
        if (!u(t._offset)) {
            e._offset = t._offset;
        }
        if (!u(t._pf)) {
            e._pf = $(t);
        }
        if (!u(t._locale)) {
            e._locale = t._locale;
        }
        if (w.length > 0) {
            for(i = 0; i < w.length; i++){
                n = w[i];
                r = t[n];
                if (!u(r)) {
                    e[n] = r;
                }
            }
        }
        return e;
    }
    function p(e) {
        g(this, e);
        this._d = new Date(e._d != null ? e._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        if (_ === false) {
            _ = true;
            t.updateOffset(this);
            _ = false;
        }
    }
    function k(e) {
        return (e instanceof p || (e != null && e._isAMomentObject != null));
    }
    function O(e) {
        if (t.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
            console.warn("Deprecation warning: " + e);
        }
    }
    function S(e, i) {
        var n = true;
        return h(function() {
            if (t.deprecationHandler != null) {
                t.deprecationHandler(null, e);
            }
            if (n) {
                var r = [], a, u, o;
                for(u = 0; u < arguments.length; u++){
                    a = "";
                    if (typeof arguments[u] === "object") {
                        a += "\n[" + u + "] ";
                        for(o in arguments[0]){
                            if (s(arguments[0], o)) {
                                a += o + ": " + arguments[0][o] + ", ";
                            }
                        }
                        a = a.slice(0, -2);
                    } else {
                        a = arguments[u];
                    }
                    r.push(a);
                }
                O(e + "\nArguments: " + Array.prototype.slice.call(r).join("") + "\n" + new Error().stack);
                n = false;
            }
            return i.apply(this, arguments);
        }, i);
    }
    var b = {};
    function T(e, i) {
        if (t.deprecationHandler != null) {
            t.deprecationHandler(e, i);
        }
        if (!b[e]) {
            O(i);
            b[e] = true;
        }
    }
    t.suppressDeprecationWarnings = false;
    t.deprecationHandler = null;
    function D(e) {
        return ((typeof Function !== "undefined" && e instanceof Function) || Object.prototype.toString.call(e) === "[object Function]");
    }
    function x(e) {
        var t, i;
        for(i in e){
            if (s(e, i)) {
                t = e[i];
                if (D(t)) {
                    this[i] = t;
                } else {
                    this["_" + i] = t;
                }
            }
        }
        this._config = e;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function M(e, t) {
        var i = h({}, e), n;
        for(n in t){
            if (s(t, n)) {
                if (r(e[n]) && r(t[n])) {
                    i[n] = {};
                    h(i[n], e[n]);
                    h(i[n], t[n]);
                } else if (t[n] != null) {
                    i[n] = t[n];
                } else {
                    delete i[n];
                }
            }
        }
        for(n in e){
            if (s(e, n) && !s(t, n) && r(e[n])) {
                i[n] = h({}, i[n]);
            }
        }
        return i;
    }
    function P(e) {
        if (e != null) {
            this.set(e);
        }
    }
    var C;
    if (Object.keys) {
        C = Object.keys;
    } else {
        C = function(e) {
            var t, i = [];
            for(t in e){
                if (s(e, t)) {
                    i.push(t);
                }
            }
            return i;
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
    function U(e, t, i) {
        var n = this._calendar[e] || this._calendar["sameElse"];
        return D(n) ? n.call(t, i) : n;
    }
    function V(e, t, i) {
        var n = "" + Math.abs(e), r = t - n.length, s = e >= 0;
        return ((s ? (i ? "+" : "") : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + n);
    }
    var L = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, W = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Y = {}, F = {};
    function I(e, t, i, n) {
        var r = n;
        if (typeof n === "string") {
            r = function() {
                return this[n]();
            };
        }
        if (e) {
            F[e] = r;
        }
        if (t) {
            F[t[0]] = function() {
                return V(r.apply(this, arguments), t[1], t[2]);
            };
        }
        if (i) {
            F[i] = function() {
                return this.localeData().ordinal(r.apply(this, arguments), e);
            };
        }
    }
    function A(e) {
        if (e.match(/\[[\s\S]/)) {
            return e.replace(/^\[|\]$/g, "");
        }
        return e.replace(/\\/g, "");
    }
    function E(e) {
        var t = e.match(L), i, n;
        for(i = 0, n = t.length; i < n; i++){
            if (F[t[i]]) {
                t[i] = F[t[i]];
            } else {
                t[i] = A(t[i]);
            }
        }
        return function(i) {
            var r = "", s;
            for(s = 0; s < n; s++){
                r += D(t[s]) ? t[s].call(i, e) : t[s];
            }
            return r;
        };
    }
    function z(e, t) {
        if (!e.isValid()) {
            return e.localeData().invalidDate();
        }
        t = N(t, e.localeData());
        Y[t] = Y[t] || E(t);
        return Y[t](e);
    }
    function N(e, t) {
        var i = 5;
        function n(e) {
            return t.longDateFormat(e) || e;
        }
        W.lastIndex = 0;
        while(i >= 0 && W.test(e)){
            e = e.replace(W, n);
            W.lastIndex = 0;
            i -= 1;
        }
        return e;
    }
    var H = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function j(e) {
        var t = this._longDateFormat[e], i = this._longDateFormat[e.toUpperCase()];
        if (t || !i) {
            return t;
        }
        this._longDateFormat[e] = i.match(L).map(function(e) {
            if (e === "MMMM" || e === "MM" || e === "DD" || e === "dddd") {
                return e.slice(1);
            }
            return e;
        }).join("");
        return this._longDateFormat[e];
    }
    var G = "Invalid date";
    function Z() {
        return this._invalidDate;
    }
    var B = "%d", J = /\d{1,2}/;
    function q(e) {
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
    function K(e, t, i, n) {
        var r = this._relativeTime[i];
        return D(r) ? r(e, t, i, n) : r.replace(/%d/i, e);
    }
    function X(e, t) {
        var i = this._relativeTime[e > 0 ? "future" : "past"];
        return D(i) ? i(t) : i.replace(/%s/i, t);
    }
    var ee = {};
    function et(e, t) {
        var i = e.toLowerCase();
        ee[i] = ee[i + "s"] = ee[t] = e;
    }
    function ei(e) {
        return typeof e === "string" ? ee[e] || ee[e.toLowerCase()] : undefined;
    }
    function en(e) {
        var t = {}, i, n;
        for(n in e){
            if (s(e, n)) {
                i = ei(n);
                if (i) {
                    t[i] = e[n];
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
        var t = [], i;
        for(i in e){
            if (s(e, i)) {
                t.push({
                    unit: i,
                    priority: er[i]
                });
            }
        }
        t.sort(function(e, t) {
            return e.priority - t.priority;
        });
        return t;
    }
    function eu(e) {
        return (e % 4 === 0 && e % 100 !== 0) || e % 400 === 0;
    }
    function eo(e) {
        if (e < 0) {
            return Math.ceil(e) || 0;
        } else {
            return Math.floor(e);
        }
    }
    function el(e) {
        var t = +e, i = 0;
        if (t !== 0 && isFinite(t)) {
            i = eo(t);
        }
        return i;
    }
    function ef(e, i) {
        return function(n) {
            if (n != null) {
                ec(this, e, n);
                t.updateOffset(this, i);
                return this;
            } else {
                return eh(this, e);
            }
        };
    }
    function eh(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
    }
    function ec(e, t, i) {
        if (e.isValid() && !isNaN(i)) {
            if (t === "FullYear" && eu(e.year()) && e.month() === 1 && e.date() === 29) {
                i = el(i);
                e._d["set" + (e._isUTC ? "UTC" : "") + t](i, e.month(), eN(i, e.month()));
            } else {
                e._d["set" + (e._isUTC ? "UTC" : "") + t](i);
            }
        }
    }
    function ed(e) {
        e = ei(e);
        if (D(this[e])) {
            return this[e]();
        }
        return this;
    }
    function e8(e, t) {
        if (typeof e === "object") {
            e = en(e);
            var i = ea(e), n;
            for(n = 0; n < i.length; n++){
                this[i[n].unit](e[i[n].unit]);
            }
        } else {
            e = ei(e);
            if (D(this[e])) {
                return this[e](t);
            }
        }
        return this;
    }
    var e$ = /\d/, em = /\d\d/, ey = /\d{3}/, ev = /\d{4}/, ew = /[+-]?\d{6}/, e_ = /\d\d?/, eg = /\d\d\d\d?/, ep = /\d\d\d\d\d\d?/, ek = /\d{1,3}/, eO = /\d{1,4}/, eS = /[+-]?\d{1,6}/, eb = /\d+/, eT = /[+-]?\d+/, e0 = /Z|[+-]\d\d:?\d\d/gi, eD = /Z|[+-]\d\d(?::?\d\d)?/gi, ex = /[+-]?\d+(\.\d{1,3})?/, eM = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, eP;
    eP = {};
    function eC(e, t, i) {
        eP[e] = D(t) ? t : function(e, n) {
            return e && i ? i : t;
        };
    }
    function e4(e, t) {
        if (!s(eP, e)) {
            return new RegExp(e2(e));
        }
        return eP[e](t._strict, t._locale);
    }
    function e2(e) {
        return eR(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, i, n, r) {
            return t || i || n || r;
        }));
    }
    function eR(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var eU = {};
    function eV(e, t) {
        var i, n = t;
        if (typeof e === "string") {
            e = [
                e
            ];
        }
        if (o(t)) {
            n = function(e, i) {
                i[t] = el(e);
            };
        }
        for(i = 0; i < e.length; i++){
            eU[e[i]] = n;
        }
    }
    function eL(e, t) {
        eV(e, function(e, i, n, r) {
            n._w = n._w || {};
            t(e, n._w, n, r);
        });
    }
    function eW(e, t, i) {
        if (t != null && s(eU, e)) {
            eU[e](t, i._a, i, e);
        }
    }
    var eY = 0, eF = 1, e5 = 2, e7 = 3, eI = 4, e1 = 5, e3 = 6, eA = 7, eE = 8;
    function e6(e, t) {
        return ((e % t) + t) % t;
    }
    var ez;
    if (Array.prototype.indexOf) {
        ez = Array.prototype.indexOf;
    } else {
        ez = function(e) {
            var t;
            for(t = 0; t < this.length; ++t){
                if (this[t] === e) {
                    return t;
                }
            }
            return -1;
        };
    }
    function eN(e, t) {
        if (isNaN(e) || isNaN(t)) {
            return NaN;
        }
        var i = e6(t, 12);
        e += (t - i) / 12;
        return i === 1 ? eu(e) ? 29 : 28 : 31 - ((i % 7) % 2);
    }
    I("M", [
        "MM",
        2
    ], "Mo", function() {
        return this.month() + 1;
    });
    I("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    });
    I("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    });
    et("month", "M");
    es("month", 8);
    eC("M", e_);
    eC("MM", e_, em);
    eC("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    });
    eC("MMMM", function(e, t) {
        return t.monthsRegex(e);
    });
    eV([
        "M",
        "MM"
    ], function(e, t) {
        t[eF] = el(e) - 1;
    });
    eV([
        "MMM",
        "MMMM"
    ], function(e, t, i, n) {
        var r = i._locale.monthsParse(e, n, i._strict);
        if (r != null) {
            t[eF] = r;
        } else {
            $(i).invalidMonth = e;
        }
    });
    var eH = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ej = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), eG = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, eZ = eM, e9 = eM;
    function eB(e, t) {
        if (!e) {
            return n(this._months) ? this._months : this._months["standalone"];
        }
        return n(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || eG).test(t) ? "format" : "standalone"][e.month()];
    }
    function eJ(e, t) {
        if (!e) {
            return n(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return n(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[eG.test(t) ? "format" : "standalone"][e.month()];
    }
    function eq(e, t, i) {
        var n, r, s, a = e.toLocaleLowerCase();
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for(n = 0; n < 12; ++n){
                s = c([
                    2000,
                    n
                ]);
                this._shortMonthsParse[n] = this.monthsShort(s, "").toLocaleLowerCase();
                this._longMonthsParse[n] = this.months(s, "").toLocaleLowerCase();
            }
        }
        if (i) {
            if (t === "MMM") {
                r = ez.call(this._shortMonthsParse, a);
                return r !== -1 ? r : null;
            } else {
                r = ez.call(this._longMonthsParse, a);
                return r !== -1 ? r : null;
            }
        } else {
            if (t === "MMM") {
                r = ez.call(this._shortMonthsParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._longMonthsParse, a);
                return r !== -1 ? r : null;
            } else {
                r = ez.call(this._longMonthsParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._shortMonthsParse, a);
                return r !== -1 ? r : null;
            }
        }
    }
    function eQ(e, t, i) {
        var n, r, s;
        if (this._monthsParseExact) {
            return eq.call(this, e, t, i);
        }
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for(n = 0; n < 12; n++){
            r = c([
                2000,
                n
            ]);
            if (i && !this._longMonthsParse[n]) {
                this._longMonthsParse[n] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[n] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i");
            }
            if (!i && !this._monthsParse[n]) {
                s = "^" + this.months(r, "") + "|^" + this.monthsShort(r, "");
                this._monthsParse[n] = new RegExp(s.replace(".", ""), "i");
            }
            if (i && t === "MMMM" && this._longMonthsParse[n].test(e)) {
                return n;
            } else if (i && t === "MMM" && this._shortMonthsParse[n].test(e)) {
                return n;
            } else if (!i && this._monthsParse[n].test(e)) {
                return n;
            }
        }
    }
    function eK(e, t) {
        var i;
        if (!e.isValid()) {
            return e;
        }
        if (typeof t === "string") {
            if (/^\d+$/.test(t)) {
                t = el(t);
            } else {
                t = e.localeData().monthsParse(t);
                if (!o(t)) {
                    return e;
                }
            }
        }
        i = Math.min(e.date(), eN(e.year(), t));
        e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, i);
        return e;
    }
    function eX(e) {
        if (e != null) {
            eK(this, e);
            t.updateOffset(this, true);
            return this;
        } else {
            return eh(this, "Month");
        }
    }
    function te() {
        return eN(this.year(), this.month());
    }
    function tt(e) {
        if (this._monthsParseExact) {
            if (!s(this, "_monthsRegex")) {
                tn.call(this);
            }
            if (e) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!s(this, "_monthsShortRegex")) {
                this._monthsShortRegex = eZ;
            }
            return this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }
    function ti(e) {
        if (this._monthsParseExact) {
            if (!s(this, "_monthsRegex")) {
                tn.call(this);
            }
            if (e) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!s(this, "_monthsRegex")) {
                this._monthsRegex = e9;
            }
            return this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex;
        }
    }
    function tn() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], i = [], n = [], r, s;
        for(r = 0; r < 12; r++){
            s = c([
                2000,
                r
            ]);
            t.push(this.monthsShort(s, ""));
            i.push(this.months(s, ""));
            n.push(this.months(s, ""));
            n.push(this.monthsShort(s, ""));
        }
        t.sort(e);
        i.sort(e);
        n.sort(e);
        for(r = 0; r < 12; r++){
            t[r] = eR(t[r]);
            i[r] = eR(i[r]);
        }
        for(r = 0; r < 24; r++){
            n[r] = eR(n[r]);
        }
        this._monthsRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    I("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? V(e, 4) : "+" + e;
    });
    I(0, [
        "YY",
        2
    ], 0, function() {
        return this.year() % 100;
    });
    I(0, [
        "YYYY",
        4
    ], 0, "year");
    I(0, [
        "YYYYY",
        5
    ], 0, "year");
    I(0, [
        "YYYYYY",
        6,
        true
    ], 0, "year");
    et("year", "y");
    es("year", 1);
    eC("Y", eT);
    eC("YY", e_, em);
    eC("YYYY", eO, ev);
    eC("YYYYY", eS, ew);
    eC("YYYYYY", eS, ew);
    eV([
        "YYYYY",
        "YYYYYY"
    ], eY);
    eV("YYYY", function(e, i) {
        i[eY] = e.length === 2 ? t.parseTwoDigitYear(e) : el(e);
    });
    eV("YY", function(e, i) {
        i[eY] = t.parseTwoDigitYear(e);
    });
    eV("Y", function(e, t) {
        t[eY] = parseInt(e, 10);
    });
    function tr(e) {
        return eu(e) ? 366 : 365;
    }
    t.parseTwoDigitYear = function(e) {
        return el(e) + (el(e) > 68 ? 1900 : 2000);
    };
    var ts = ef("FullYear", true);
    function ta() {
        return eu(this.year());
    }
    function tu(e, t, i, n, r, s, a) {
        var u;
        if (e < 100 && e >= 0) {
            u = new Date(e + 400, t, i, n, r, s, a);
            if (isFinite(u.getFullYear())) {
                u.setFullYear(e);
            }
        } else {
            u = new Date(e, t, i, n, r, s, a);
        }
        return u;
    }
    function to(e) {
        var t, i;
        if (e < 100 && e >= 0) {
            i = Array.prototype.slice.call(arguments);
            i[0] = e + 400;
            t = new Date(Date.UTC.apply(null, i));
            if (isFinite(t.getUTCFullYear())) {
                t.setUTCFullYear(e);
            }
        } else {
            t = new Date(Date.UTC.apply(null, arguments));
        }
        return t;
    }
    function tl(e, t, i) {
        var n = 7 + t - i, r = (7 + to(e, 0, n).getUTCDay() - t) % 7;
        return -r + n - 1;
    }
    function tf(e, t, i, n, r) {
        var s = (7 + i - n) % 7, a = tl(e, n, r), u = 1 + 7 * (t - 1) + s + a, o, l;
        if (u <= 0) {
            o = e - 1;
            l = tr(o) + u;
        } else if (u > tr(e)) {
            o = e + 1;
            l = u - tr(e);
        } else {
            o = e;
            l = u;
        }
        return {
            year: o,
            dayOfYear: l
        };
    }
    function th(e, t, i) {
        var n = tl(e.year(), t, i), r = Math.floor((e.dayOfYear() - n - 1) / 7) + 1, s, a;
        if (r < 1) {
            a = e.year() - 1;
            s = r + tc(a, t, i);
        } else if (r > tc(e.year(), t, i)) {
            s = r - tc(e.year(), t, i);
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
    function tc(e, t, i) {
        var n = tl(e, t, i), r = tl(e + 1, t, i);
        return (tr(e) - n + r) / 7;
    }
    I("w", [
        "ww",
        2
    ], "wo", "week");
    I("W", [
        "WW",
        2
    ], "Wo", "isoWeek");
    et("week", "w");
    et("isoWeek", "W");
    es("week", 5);
    es("isoWeek", 5);
    eC("w", e_);
    eC("ww", e_, em);
    eC("W", e_);
    eC("WW", e_, em);
    eL([
        "w",
        "ww",
        "W",
        "WW"
    ], function(e, t, i, n) {
        t[n.substr(0, 1)] = el(e);
    });
    function td(e) {
        return th(e, this._week.dow, this._week.doy).week;
    }
    var t8 = {
        dow: 0,
        doy: 6
    };
    function t$() {
        return this._week.dow;
    }
    function tm() {
        return this._week.doy;
    }
    function ty(e) {
        var t = this.localeData().week(this);
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    function tv(e) {
        var t = th(this, 1, 4).week;
        return e == null ? t : this.add((e - t) * 7, "d");
    }
    I("d", 0, "do", "day");
    I("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e);
    });
    I("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e);
    });
    I("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e);
    });
    I("e", 0, 0, "weekday");
    I("E", 0, 0, "isoWeekday");
    et("day", "d");
    et("weekday", "e");
    et("isoWeekday", "E");
    es("day", 11);
    es("weekday", 11);
    es("isoWeekday", 11);
    eC("d", e_);
    eC("e", e_);
    eC("E", e_);
    eC("dd", function(e, t) {
        return t.weekdaysMinRegex(e);
    });
    eC("ddd", function(e, t) {
        return t.weekdaysShortRegex(e);
    });
    eC("dddd", function(e, t) {
        return t.weekdaysRegex(e);
    });
    eL([
        "dd",
        "ddd",
        "dddd"
    ], function(e, t, i, n) {
        var r = i._locale.weekdaysParse(e, n, i._strict);
        if (r != null) {
            t.d = r;
        } else {
            $(i).invalidWeekday = e;
        }
    });
    eL([
        "d",
        "e",
        "E"
    ], function(e, t, i, n) {
        t[n] = el(e);
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
    function t_(e, t) {
        if (typeof e === "string") {
            return t.weekdaysParse(e) % 7 || 7;
        }
        return isNaN(e) ? null : e;
    }
    function tg(e, t) {
        return e.slice(t, 7).concat(e.slice(0, t));
    }
    var tp = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), tk = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), tO = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), tS = eM, tb = eM, tT = eM;
    function t0(e, t) {
        var i = n(this._weekdays) ? this._weekdays : this._weekdays[e && e !== true && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
        return e === true ? tg(i, this._week.dow) : e ? i[e.day()] : i;
    }
    function tD(e) {
        return e === true ? tg(this._weekdaysShort, this._week.dow) : e ? this._weekdaysShort[e.day()] : this._weekdaysShort;
    }
    function tx(e) {
        return e === true ? tg(this._weekdaysMin, this._week.dow) : e ? this._weekdaysMin[e.day()] : this._weekdaysMin;
    }
    function tM(e, t, i) {
        var n, r, s, a = e.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];
            for(n = 0; n < 7; ++n){
                s = c([
                    2000,
                    1
                ]).day(n);
                this._minWeekdaysParse[n] = this.weekdaysMin(s, "").toLocaleLowerCase();
                this._shortWeekdaysParse[n] = this.weekdaysShort(s, "").toLocaleLowerCase();
                this._weekdaysParse[n] = this.weekdays(s, "").toLocaleLowerCase();
            }
        }
        if (i) {
            if (t === "dddd") {
                r = ez.call(this._weekdaysParse, a);
                return r !== -1 ? r : null;
            } else if (t === "ddd") {
                r = ez.call(this._shortWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else {
                r = ez.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            }
        } else {
            if (t === "dddd") {
                r = ez.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._shortWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else if (t === "ddd") {
                r = ez.call(this._shortWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._minWeekdaysParse, a);
                return r !== -1 ? r : null;
            } else {
                r = ez.call(this._minWeekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._weekdaysParse, a);
                if (r !== -1) {
                    return r;
                }
                r = ez.call(this._shortWeekdaysParse, a);
                return r !== -1 ? r : null;
            }
        }
    }
    function tP(e, t, i) {
        var n, r, s;
        if (this._weekdaysParseExact) {
            return tM.call(this, e, t, i);
        }
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for(n = 0; n < 7; n++){
            r = c([
                2000,
                1
            ]).day(n);
            if (i && !this._fullWeekdaysParse[n]) {
                this._fullWeekdaysParse[n] = new RegExp("^" + this.weekdays(r, "").replace(".", "\\.?") + "$", "i");
                this._shortWeekdaysParse[n] = new RegExp("^" + this.weekdaysShort(r, "").replace(".", "\\.?") + "$", "i");
                this._minWeekdaysParse[n] = new RegExp("^" + this.weekdaysMin(r, "").replace(".", "\\.?") + "$", "i");
            }
            if (!this._weekdaysParse[n]) {
                s = "^" + this.weekdays(r, "") + "|^" + this.weekdaysShort(r, "") + "|^" + this.weekdaysMin(r, "");
                this._weekdaysParse[n] = new RegExp(s.replace(".", ""), "i");
            }
            if (i && t === "dddd" && this._fullWeekdaysParse[n].test(e)) {
                return n;
            } else if (i && t === "ddd" && this._shortWeekdaysParse[n].test(e)) {
                return n;
            } else if (i && t === "dd" && this._minWeekdaysParse[n].test(e)) {
                return n;
            } else if (!i && this._weekdaysParse[n].test(e)) {
                return n;
            }
        }
    }
    function tC(e) {
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
    function t4(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return e == null ? t : this.add(e - t, "d");
    }
    function t2(e) {
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        if (e != null) {
            var t = t_(e, this.localeData());
            return this.day(this.day() % 7 ? t : t - 7);
        } else {
            return this.day() || 7;
        }
    }
    function tR(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tL.call(this);
            }
            if (e) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!s(this, "_weekdaysRegex")) {
                this._weekdaysRegex = tS;
            }
            return this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }
    function tU(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tL.call(this);
            }
            if (e) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!s(this, "_weekdaysShortRegex")) {
                this._weekdaysShortRegex = tb;
            }
            return this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }
    function tV(e) {
        if (this._weekdaysParseExact) {
            if (!s(this, "_weekdaysRegex")) {
                tL.call(this);
            }
            if (e) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!s(this, "_weekdaysMinRegex")) {
                this._weekdaysMinRegex = tT;
            }
            return this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }
    function tL() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t = [], i = [], n = [], r = [], s, a, u, o, l;
        for(s = 0; s < 7; s++){
            a = c([
                2000,
                1
            ]).day(s);
            u = eR(this.weekdaysMin(a, ""));
            o = eR(this.weekdaysShort(a, ""));
            l = eR(this.weekdays(a, ""));
            t.push(u);
            i.push(o);
            n.push(l);
            r.push(u);
            r.push(o);
            r.push(l);
        }
        t.sort(e);
        i.sort(e);
        n.sort(e);
        r.sort(e);
        this._weekdaysRegex = new RegExp("^(" + r.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + t.join("|") + ")", "i");
    }
    function tW() {
        return this.hours() % 12 || 12;
    }
    function tY() {
        return this.hours() || 24;
    }
    I("H", [
        "HH",
        2
    ], 0, "hour");
    I("h", [
        "hh",
        2
    ], 0, tW);
    I("k", [
        "kk",
        2
    ], 0, tY);
    I("hmm", 0, 0, function() {
        return "" + tW.apply(this) + V(this.minutes(), 2);
    });
    I("hmmss", 0, 0, function() {
        return ("" + tW.apply(this) + V(this.minutes(), 2) + V(this.seconds(), 2));
    });
    I("Hmm", 0, 0, function() {
        return "" + this.hours() + V(this.minutes(), 2);
    });
    I("Hmmss", 0, 0, function() {
        return ("" + this.hours() + V(this.minutes(), 2) + V(this.seconds(), 2));
    });
    function tF(e, t) {
        I(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }
    tF("a", true);
    tF("A", false);
    et("hour", "h");
    es("hour", 13);
    function t5(e, t) {
        return t._meridiemParse;
    }
    eC("a", t5);
    eC("A", t5);
    eC("H", e_);
    eC("h", e_);
    eC("k", e_);
    eC("HH", e_, em);
    eC("hh", e_, em);
    eC("kk", e_, em);
    eC("hmm", eg);
    eC("hmmss", ep);
    eC("Hmm", eg);
    eC("Hmmss", ep);
    eV([
        "H",
        "HH"
    ], e7);
    eV([
        "k",
        "kk"
    ], function(e, t, i) {
        var n = el(e);
        t[e7] = n === 24 ? 0 : n;
    });
    eV([
        "a",
        "A"
    ], function(e, t, i) {
        i._isPm = i._locale.isPM(e);
        i._meridiem = e;
    });
    eV([
        "h",
        "hh"
    ], function(e, t, i) {
        t[e7] = el(e);
        $(i).bigHour = true;
    });
    eV("hmm", function(e, t, i) {
        var n = e.length - 2;
        t[e7] = el(e.substr(0, n));
        t[eI] = el(e.substr(n));
        $(i).bigHour = true;
    });
    eV("hmmss", function(e, t, i) {
        var n = e.length - 4, r = e.length - 2;
        t[e7] = el(e.substr(0, n));
        t[eI] = el(e.substr(n, 2));
        t[e1] = el(e.substr(r));
        $(i).bigHour = true;
    });
    eV("Hmm", function(e, t, i) {
        var n = e.length - 2;
        t[e7] = el(e.substr(0, n));
        t[eI] = el(e.substr(n));
    });
    eV("Hmmss", function(e, t, i) {
        var n = e.length - 4, r = e.length - 2;
        t[e7] = el(e.substr(0, n));
        t[eI] = el(e.substr(n, 2));
        t[e1] = el(e.substr(r));
    });
    function t7(e) {
        return (e + "").toLowerCase().charAt(0) === "p";
    }
    var tI = /[ap]\.?m?\.?/i, t1 = ef("Hours", true);
    function t3(e, t, i) {
        if (e > 11) {
            return i ? "pm" : "PM";
        } else {
            return i ? "am" : "AM";
        }
    }
    var tA = {
        calendar: R,
        longDateFormat: H,
        invalidDate: G,
        ordinal: B,
        dayOfMonthOrdinalParse: J,
        relativeTime: Q,
        months: eH,
        monthsShort: ej,
        week: t8,
        weekdays: tp,
        weekdaysMin: tO,
        weekdaysShort: tk,
        meridiemParse: tI
    };
    var tE = {}, t6 = {}, tz;
    function tN(e, t) {
        var i, n = Math.min(e.length, t.length);
        for(i = 0; i < n; i += 1){
            if (e[i] !== t[i]) {
                return i;
            }
        }
        return n;
    }
    function tH(e) {
        return e ? e.toLowerCase().replace("_", "-") : e;
    }
    function tj(e) {
        var t = 0, i, n, r, s;
        while(t < e.length){
            s = tH(e[t]).split("-");
            i = s.length;
            n = tH(e[t + 1]);
            n = n ? n.split("-") : null;
            while(i > 0){
                r = tG(s.slice(0, i).join("-"));
                if (r) {
                    return r;
                }
                if (n && n.length >= i && tN(s, n) >= i - 1) {
                    break;
                }
                i--;
            }
            t++;
        }
        return tz;
    }
    function tG(e) {
        var t = null, i;
        if (tE[e] === undefined && typeof module !== "undefined" && module && module.exports) {
            try {
                t = tz._abbr;
                i = require;
                i("./locale/" + e);
                tZ(t);
            } catch (n) {
                tE[e] = null;
            }
        }
        return tE[e];
    }
    function tZ(e, t) {
        var i;
        if (e) {
            if (u(t)) {
                i = tJ(e);
            } else {
                i = t9(e, t);
            }
            if (i) {
                tz = i;
            } else {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Locale " + e + " not found. Did you forget to load it?");
                }
            }
        }
        return tz._abbr;
    }
    function t9(e, t) {
        if (t !== null) {
            var i, n = tA;
            t.abbr = e;
            if (tE[e] != null) {
                T("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change " + "an existing locale. moment.defineLocale(localeName, " + "config) should only be used for creating a new locale " + "See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
                n = tE[e]._config;
            } else if (t.parentLocale != null) {
                if (tE[t.parentLocale] != null) {
                    n = tE[t.parentLocale]._config;
                } else {
                    i = tG(t.parentLocale);
                    if (i != null) {
                        n = i._config;
                    } else {
                        if (!t6[t.parentLocale]) {
                            t6[t.parentLocale] = [];
                        }
                        t6[t.parentLocale].push({
                            name: e,
                            config: t
                        });
                        return null;
                    }
                }
            }
            tE[e] = new P(M(n, t));
            if (t6[e]) {
                t6[e].forEach(function(e) {
                    t9(e.name, e.config);
                });
            }
            tZ(e);
            return tE[e];
        } else {
            delete tE[e];
            return null;
        }
    }
    function tB(e, t) {
        if (t != null) {
            var i, n, r = tA;
            if (tE[e] != null && tE[e].parentLocale != null) {
                tE[e].set(M(tE[e]._config, t));
            } else {
                n = tG(e);
                if (n != null) {
                    r = n._config;
                }
                t = M(r, t);
                if (n == null) {
                    t.abbr = e;
                }
                i = new P(t);
                i.parentLocale = tE[e];
                tE[e] = i;
            }
            tZ(e);
        } else {
            if (tE[e] != null) {
                if (tE[e].parentLocale != null) {
                    tE[e] = tE[e].parentLocale;
                    if (e === tZ()) {
                        tZ(e);
                    }
                } else if (tE[e] != null) {
                    delete tE[e];
                }
            }
        }
        return tE[e];
    }
    function tJ(e) {
        var t;
        if (e && e._locale && e._locale._abbr) {
            e = e._locale._abbr;
        }
        if (!e) {
            return tz;
        }
        if (!n(e)) {
            t = tG(e);
            if (t) {
                return t;
            }
            e = [
                e
            ];
        }
        return tj(e);
    }
    function tq() {
        return C(tE);
    }
    function tQ(e) {
        var t, i = e._a;
        if (i && $(e).overflow === -2) {
            t = i[eF] < 0 || i[eF] > 11 ? eF : i[e5] < 1 || i[e5] > eN(i[eY], i[eF]) ? e5 : i[e7] < 0 || i[e7] > 24 || (i[e7] === 24 && (i[eI] !== 0 || i[e1] !== 0 || i[e3] !== 0)) ? e7 : i[eI] < 0 || i[eI] > 59 ? eI : i[e1] < 0 || i[e1] > 59 ? e1 : i[e3] < 0 || i[e3] > 999 ? e3 : -1;
            if ($(e)._overflowDayOfYear && (t < eY || t > e5)) {
                t = e5;
            }
            if ($(e)._overflowWeeks && t === -1) {
                t = eA;
            }
            if ($(e)._overflowWeekday && t === -1) {
                t = eE;
            }
            $(e).overflow = t;
        }
        return e;
    }
    var tK = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tX = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ie = /Z|[+-]\d\d(?::?\d\d)?/, it = [
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
    ], ii = [
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
    ], ir = /^\/?Date\((-?\d+)/i, is = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, ia = {
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
    function iu(e) {
        var t, i, n = e._i, r = tK.exec(n) || tX.exec(n), s, a, u, o;
        if (r) {
            $(e).iso = true;
            for(t = 0, i = it.length; t < i; t++){
                if (it[t][1].exec(r[1])) {
                    a = it[t][0];
                    s = it[t][2] !== false;
                    break;
                }
            }
            if (a == null) {
                e._isValid = false;
                return;
            }
            if (r[3]) {
                for(t = 0, i = ii.length; t < i; t++){
                    if (ii[t][1].exec(r[3])) {
                        u = (r[2] || " ") + ii[t][0];
                        break;
                    }
                }
                if (u == null) {
                    e._isValid = false;
                    return;
                }
            }
            if (!s && u != null) {
                e._isValid = false;
                return;
            }
            if (r[4]) {
                if (ie.exec(r[4])) {
                    o = "Z";
                } else {
                    e._isValid = false;
                    return;
                }
            }
            e._f = a + (u || "") + (o || "");
            i_(e);
        } else {
            e._isValid = false;
        }
    }
    function io(e, t, i, n, r, s) {
        var a = [
            il(e),
            ej.indexOf(t),
            parseInt(i, 10),
            parseInt(n, 10),
            parseInt(r, 10), 
        ];
        if (s) {
            a.push(parseInt(s, 10));
        }
        return a;
    }
    function il(e) {
        var t = parseInt(e, 10);
        if (t <= 49) {
            return 2000 + t;
        } else if (t <= 999) {
            return 1900 + t;
        }
        return t;
    }
    function ih(e) {
        return e.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function ic(e, t, i) {
        if (e) {
            var n = tk.indexOf(e), r = new Date(t[0], t[1], t[2]).getDay();
            if (n !== r) {
                $(i).weekdayMismatch = true;
                i._isValid = false;
                return false;
            }
        }
        return true;
    }
    function id(e, t, i) {
        if (e) {
            return ia[e];
        } else if (t) {
            return 0;
        } else {
            var n = parseInt(i, 10), r = n % 100, s = (n - r) / 100;
            return s * 60 + r;
        }
    }
    function i8(e) {
        var t = is.exec(ih(e._i)), i;
        if (t) {
            i = io(t[4], t[3], t[2], t[5], t[6], t[7]);
            if (!ic(t[1], i, e)) {
                return;
            }
            e._a = i;
            e._tzm = id(t[8], t[9], t[10]);
            e._d = to.apply(null, e._a);
            e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
            $(e).rfc2822 = true;
        } else {
            e._isValid = false;
        }
    }
    function i$(e) {
        var i = ir.exec(e._i);
        if (i !== null) {
            e._d = new Date(+i[1]);
            return;
        }
        iu(e);
        if (e._isValid === false) {
            delete e._isValid;
        } else {
            return;
        }
        i8(e);
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
    function im(e, t, i) {
        if (e != null) {
            return e;
        }
        if (t != null) {
            return t;
        }
        return i;
    }
    function iy(e) {
        var i = new Date(t.now());
        if (e._useUTC) {
            return [
                i.getUTCFullYear(),
                i.getUTCMonth(),
                i.getUTCDate(), 
            ];
        }
        return [
            i.getFullYear(),
            i.getMonth(),
            i.getDate(), 
        ];
    }
    function iv(e) {
        var t, i, n = [], r, s, a;
        if (e._d) {
            return;
        }
        r = iy(e);
        if (e._w && e._a[e5] == null && e._a[eF] == null) {
            iw(e);
        }
        if (e._dayOfYear != null) {
            a = im(e._a[eY], r[eY]);
            if (e._dayOfYear > tr(a) || e._dayOfYear === 0) {
                $(e)._overflowDayOfYear = true;
            }
            i = to(a, 0, e._dayOfYear);
            e._a[eF] = i.getUTCMonth();
            e._a[e5] = i.getUTCDate();
        }
        for(t = 0; t < 3 && e._a[t] == null; ++t){
            e._a[t] = n[t] = r[t];
        }
        for(; t < 7; t++){
            e._a[t] = n[t] = e._a[t] == null ? (t === 2 ? 1 : 0) : e._a[t];
        }
        if (e._a[e7] === 24 && e._a[eI] === 0 && e._a[e1] === 0 && e._a[e3] === 0) {
            e._nextDay = true;
            e._a[e7] = 0;
        }
        e._d = (e._useUTC ? to : tu).apply(null, n);
        s = e._useUTC ? e._d.getUTCDay() : e._d.getDay();
        if (e._tzm != null) {
            e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
        }
        if (e._nextDay) {
            e._a[e7] = 24;
        }
        if (e._w && typeof e._w.d !== "undefined" && e._w.d !== s) {
            $(e).weekdayMismatch = true;
        }
    }
    function iw(e) {
        var t, i, n, r, s, a, u, o, l;
        t = e._w;
        if (t.GG != null || t.W != null || t.E != null) {
            s = 1;
            a = 4;
            i = im(t.GG, e._a[eY], th(i0(), 1, 4).year);
            n = im(t.W, 1);
            r = im(t.E, 1);
            if (r < 1 || r > 7) {
                o = true;
            }
        } else {
            s = e._locale._week.dow;
            a = e._locale._week.doy;
            l = th(i0(), s, a);
            i = im(t.gg, e._a[eY], l.year);
            n = im(t.w, l.week);
            if (t.d != null) {
                r = t.d;
                if (r < 0 || r > 6) {
                    o = true;
                }
            } else if (t.e != null) {
                r = t.e + s;
                if (t.e < 0 || t.e > 6) {
                    o = true;
                }
            } else {
                r = s;
            }
        }
        if (n < 1 || n > tc(i, s, a)) {
            $(e)._overflowWeeks = true;
        } else if (o != null) {
            $(e)._overflowWeekday = true;
        } else {
            u = tf(i, n, r, s, a);
            e._a[eY] = u.year;
            e._dayOfYear = u.dayOfYear;
        }
    }
    t.ISO_8601 = function() {};
    t.RFC_2822 = function() {};
    function i_(e) {
        if (e._f === t.ISO_8601) {
            iu(e);
            return;
        }
        if (e._f === t.RFC_2822) {
            i8(e);
            return;
        }
        e._a = [];
        $(e).empty = true;
        var i = "" + e._i, n, r, s, a, u, o = i.length, l = 0, f;
        s = N(e._f, e._locale).match(L) || [];
        for(n = 0; n < s.length; n++){
            a = s[n];
            r = (i.match(e4(a, e)) || [])[0];
            if (r) {
                u = i.substr(0, i.indexOf(r));
                if (u.length > 0) {
                    $(e).unusedInput.push(u);
                }
                i = i.slice(i.indexOf(r) + r.length);
                l += r.length;
            }
            if (F[a]) {
                if (r) {
                    $(e).empty = false;
                } else {
                    $(e).unusedTokens.push(a);
                }
                eW(a, r, e);
            } else if (e._strict && !r) {
                $(e).unusedTokens.push(a);
            }
        }
        $(e).charsLeftOver = o - l;
        if (i.length > 0) {
            $(e).unusedInput.push(i);
        }
        if (e._a[e7] <= 12 && $(e).bigHour === true && e._a[e7] > 0) {
            $(e).bigHour = undefined;
        }
        $(e).parsedDateParts = e._a.slice(0);
        $(e).meridiem = e._meridiem;
        e._a[e7] = ig(e._locale, e._a[e7], e._meridiem);
        f = $(e).era;
        if (f !== null) {
            e._a[eY] = e._locale.erasConvertYear(f, e._a[eY]);
        }
        iv(e);
        tQ(e);
    }
    function ig(e, t, i) {
        var n;
        if (i == null) {
            return t;
        }
        if (e.meridiemHour != null) {
            return e.meridiemHour(t, i);
        } else if (e.isPM != null) {
            n = e.isPM(i);
            if (n && t < 12) {
                t += 12;
            }
            if (!n && t === 12) {
                t = 0;
            }
            return t;
        } else {
            return t;
        }
    }
    function ip(e) {
        var t, i, n, r, s, a, u = false;
        if (e._f.length === 0) {
            $(e).invalidFormat = true;
            e._d = new Date(NaN);
            return;
        }
        for(r = 0; r < e._f.length; r++){
            s = 0;
            a = false;
            t = g({}, e);
            if (e._useUTC != null) {
                t._useUTC = e._useUTC;
            }
            t._f = e._f[r];
            i_(t);
            if (y(t)) {
                a = true;
            }
            s += $(t).charsLeftOver;
            s += $(t).unusedTokens.length * 10;
            $(t).score = s;
            if (!u) {
                if (n == null || s < n || a) {
                    n = s;
                    i = t;
                    if (a) {
                        u = true;
                    }
                }
            } else {
                if (s < n) {
                    n = s;
                    i = t;
                }
            }
        }
        h(e, i || t);
    }
    function ik(e) {
        if (e._d) {
            return;
        }
        var t = en(e._i), i = t.day === undefined ? t.date : t.day;
        e._a = f([
            t.year,
            t.month,
            i,
            t.hour,
            t.minute,
            t.second,
            t.millisecond, 
        ], function(e) {
            return e && parseInt(e, 10);
        });
        iv(e);
    }
    function iO(e) {
        var t = new p(tQ(iS(e)));
        if (t._nextDay) {
            t.add(1, "d");
            t._nextDay = undefined;
        }
        return t;
    }
    function iS(e) {
        var t = e._i, i = e._f;
        e._locale = e._locale || tJ(e._l);
        if (t === null || (i === undefined && t === "")) {
            return v({
                nullInput: true
            });
        }
        if (typeof t === "string") {
            e._i = t = e._locale.preparse(t);
        }
        if (k(t)) {
            return new p(tQ(t));
        } else if (l(t)) {
            e._d = t;
        } else if (n(i)) {
            ip(e);
        } else if (i) {
            i_(e);
        } else {
            ib(e);
        }
        if (!y(e)) {
            e._d = null;
        }
        return e;
    }
    function ib(e) {
        var i = e._i;
        if (u(i)) {
            e._d = new Date(t.now());
        } else if (l(i)) {
            e._d = new Date(i.valueOf());
        } else if (typeof i === "string") {
            i$(e);
        } else if (n(i)) {
            e._a = f(i.slice(0), function(e) {
                return parseInt(e, 10);
            });
            iv(e);
        } else if (r(i)) {
            ik(e);
        } else if (o(i)) {
            e._d = new Date(i);
        } else {
            t.createFromInputFallback(e);
        }
    }
    function iT(e, t, i, s, u) {
        var o = {};
        if (t === true || t === false) {
            s = t;
            t = undefined;
        }
        if (i === true || i === false) {
            s = i;
            i = undefined;
        }
        if ((r(e) && a(e)) || (n(e) && e.length === 0)) {
            e = undefined;
        }
        o._isAMomentObject = true;
        o._useUTC = o._isUTC = u;
        o._l = i;
        o._i = e;
        o._f = t;
        o._strict = s;
        return iO(o);
    }
    function i0(e, t, i, n) {
        return iT(e, t, i, n, false);
    }
    var iD = S("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = i0.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e < this ? this : e;
        } else {
            return v();
        }
    }), ix = S("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = i0.apply(null, arguments);
        if (this.isValid() && e.isValid()) {
            return e > this ? this : e;
        } else {
            return v();
        }
    });
    function iM(e, t) {
        var i, r;
        if (t.length === 1 && n(t[0])) {
            t = t[0];
        }
        if (!t.length) {
            return i0();
        }
        i = t[0];
        for(r = 1; r < t.length; ++r){
            if (!t[r].isValid() || t[r][e](i)) {
                i = t[r];
            }
        }
        return i;
    }
    function iP() {
        var e = [].slice.call(arguments, 0);
        return iM("isBefore", e);
    }
    function iC() {
        var e = [].slice.call(arguments, 0);
        return iM("isAfter", e);
    }
    var i4 = function() {
        return Date.now ? Date.now() : +new Date();
    };
    var i2 = [
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
    function iR(e) {
        var t, i = false, n;
        for(t in e){
            if (s(e, t) && !(ez.call(i2, t) !== -1 && (e[t] == null || !isNaN(e[t])))) {
                return false;
            }
        }
        for(n = 0; n < i2.length; ++n){
            if (e[i2[n]]) {
                if (i) {
                    return false;
                }
                if (parseFloat(e[i2[n]]) !== el(e[i2[n]])) {
                    i = true;
                }
            }
        }
        return true;
    }
    function iU() {
        return this._isValid;
    }
    function iV() {
        return iQ(NaN);
    }
    function iL(e) {
        var t = en(e), i = t.year || 0, n = t.quarter || 0, r = t.month || 0, s = t.week || t.isoWeek || 0, a = t.day || 0, u = t.hour || 0, o = t.minute || 0, l = t.second || 0, f = t.millisecond || 0;
        this._isValid = iR(t);
        this._milliseconds = +f + l * 1e3 + o * 6e4 + u * 1000 * 60 * 60;
        this._days = +a + s * 7;
        this._months = +r + n * 3 + i * 12;
        this._data = {};
        this._locale = tJ();
        this._bubble();
    }
    function iW(e) {
        return e instanceof iL;
    }
    function iY(e) {
        if (e < 0) {
            return Math.round(-1 * e) * -1;
        } else {
            return Math.round(e);
        }
    }
    function iF(e, t, i) {
        var n = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), s = 0, a;
        for(a = 0; a < n; a++){
            if ((i && e[a] !== t[a]) || (!i && el(e[a]) !== el(t[a]))) {
                s++;
            }
        }
        return s + r;
    }
    function i5(e, t) {
        I(e, 0, 0, function() {
            var e = this.utcOffset(), i = "+";
            if (e < 0) {
                e = -e;
                i = "-";
            }
            return (i + V(~~(e / 60), 2) + t + V(~~e % 60, 2));
        });
    }
    i5("Z", ":");
    i5("ZZ", "");
    eC("Z", eD);
    eC("ZZ", eD);
    eV([
        "Z",
        "ZZ"
    ], function(e, t, i) {
        i._useUTC = true;
        i._tzm = iI(eD, e);
    });
    var i7 = /([\+\-]|\d\d)/gi;
    function iI(e, t) {
        var i = (t || "").match(e), n, r, s;
        if (i === null) {
            return null;
        }
        n = i[i.length - 1] || [];
        r = (n + "").match(i7) || [
            "-",
            0,
            0
        ];
        s = +(r[1] * 60) + el(r[2]);
        return s === 0 ? 0 : r[0] === "+" ? s : -s;
    }
    function i1(e, i) {
        var n, r;
        if (i._isUTC) {
            n = i.clone();
            r = (k(e) || l(e) ? e.valueOf() : i0(e).valueOf()) - n.valueOf();
            n._d.setTime(n._d.valueOf() + r);
            t.updateOffset(n, false);
            return n;
        } else {
            return i0(e).local();
        }
    }
    function i3(e) {
        return -Math.round(e._d.getTimezoneOffset());
    }
    t.updateOffset = function() {};
    function iA(e, i, n) {
        var r = this._offset || 0, s;
        if (!this.isValid()) {
            return e != null ? this : NaN;
        }
        if (e != null) {
            if (typeof e === "string") {
                e = iI(eD, e);
                if (e === null) {
                    return this;
                }
            } else if (Math.abs(e) < 16 && !n) {
                e = e * 60;
            }
            if (!this._isUTC && i) {
                s = i3(this);
            }
            this._offset = e;
            this._isUTC = true;
            if (s != null) {
                this.add(s, "m");
            }
            if (r !== e) {
                if (!i || this._changeInProgress) {
                    ni(this, iQ(e - r, "m"), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    t.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? r : i3(this);
        }
    }
    function iE(e, t) {
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
    function i6(e) {
        return this.utcOffset(0, e);
    }
    function iz(e) {
        if (this._isUTC) {
            this.utcOffset(0, e);
            this._isUTC = false;
            if (e) {
                this.subtract(i3(this), "m");
            }
        }
        return this;
    }
    function iN() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
            var e = iI(e0, this._i);
            if (e != null) {
                this.utcOffset(e);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }
    function iH(e) {
        if (!this.isValid()) {
            return false;
        }
        e = e ? i0(e).utcOffset() : 0;
        return (this.utcOffset() - e) % 60 === 0;
    }
    function ij() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }
    function iG() {
        if (!u(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var e = {}, t;
        g(e, this);
        e = iS(e);
        if (e._a) {
            t = e._isUTC ? c(e._a) : i0(e._a);
            this._isDSTShifted = this.isValid() && iF(e._a, t.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }
    function iZ() {
        return this.isValid() ? !this._isUTC : false;
    }
    function i9() {
        return this.isValid() ? this._isUTC : false;
    }
    function iB() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var iJ = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, iq = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function iQ(e, t) {
        var i = e, n = null, r, a, u;
        if (iW(e)) {
            i = {
                ms: e._milliseconds,
                d: e._days,
                M: e._months
            };
        } else if (o(e) || !isNaN(+e)) {
            i = {};
            if (t) {
                i[t] = +e;
            } else {
                i.milliseconds = +e;
            }
        } else if ((n = iJ.exec(e))) {
            r = n[1] === "-" ? -1 : 1;
            i = {
                y: 0,
                d: el(n[e5]) * r,
                h: el(n[e7]) * r,
                m: el(n[eI]) * r,
                s: el(n[e1]) * r,
                ms: el(iY(n[e3] * 1000)) * r
            };
        } else if ((n = iq.exec(e))) {
            r = n[1] === "-" ? -1 : 1;
            i = {
                y: iK(n[2], r),
                M: iK(n[3], r),
                w: iK(n[4], r),
                d: iK(n[5], r),
                h: iK(n[6], r),
                m: iK(n[7], r),
                s: iK(n[8], r)
            };
        } else if (i == null) {
            i = {};
        } else if (typeof i === "object" && ("from" in i || "to" in i)) {
            u = ne(i0(i.from), i0(i.to));
            i = {};
            i.ms = u.milliseconds;
            i.M = u.months;
        }
        a = new iL(i);
        if (iW(e) && s(e, "_locale")) {
            a._locale = e._locale;
        }
        if (iW(e) && s(e, "_isValid")) {
            a._isValid = e._isValid;
        }
        return a;
    }
    iQ.fn = iL.prototype;
    iQ.invalid = iV;
    function iK(e, t) {
        var i = e && parseFloat(e.replace(",", "."));
        return (isNaN(i) ? 0 : i) * t;
    }
    function iX(e, t) {
        var i = {};
        i.months = t.month() - e.month() + (t.year() - e.year()) * 12;
        if (e.clone().add(i.months, "M").isAfter(t)) {
            --i.months;
        }
        i.milliseconds = +t - +e.clone().add(i.months, "M");
        return i;
    }
    function ne(e, t) {
        var i;
        if (!(e.isValid() && t.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }
        t = i1(t, e);
        if (e.isBefore(t)) {
            i = iX(e, t);
        } else {
            i = iX(t, e);
            i.milliseconds = -i.milliseconds;
            i.months = -i.months;
        }
        return i;
    }
    function nt(e, t) {
        return function(i, n) {
            var r, s;
            if (n !== null && !isNaN(+n)) {
                T(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). " + "See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
                s = i;
                i = n;
                n = s;
            }
            r = iQ(i, n);
            ni(this, r, e);
            return this;
        };
    }
    function ni(e, i, n, r) {
        var s = i._milliseconds, a = iY(i._days), u = iY(i._months);
        if (!e.isValid()) {
            return;
        }
        r = r == null ? true : r;
        if (u) {
            eK(e, eh(e, "Month") + u * n);
        }
        if (a) {
            ec(e, "Date", eh(e, "Date") + a * n);
        }
        if (s) {
            e._d.setTime(e._d.valueOf() + s * n);
        }
        if (r) {
            t.updateOffset(e, a || u);
        }
    }
    var nn = nt(1, "add"), nr = nt(-1, "subtract");
    function ns(e) {
        return typeof e === "string" || e instanceof String;
    }
    function na(e) {
        return (k(e) || l(e) || ns(e) || o(e) || no(e) || nu(e) || e === null || e === undefined);
    }
    function nu(e) {
        var t = r(e) && !a(e), i = false, n = [
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
        ], u, o;
        for(u = 0; u < n.length; u += 1){
            o = n[u];
            i = i || s(e, o);
        }
        return t && i;
    }
    function no(e) {
        var t = n(e), i = false;
        if (t) {
            i = e.filter(function(t) {
                return !o(t) && ns(e);
            }).length === 0;
        }
        return t && i;
    }
    function nl(e) {
        var t = r(e) && !a(e), i = false, n = [
            "sameDay",
            "nextDay",
            "lastDay",
            "nextWeek",
            "lastWeek",
            "sameElse", 
        ], u, o;
        for(u = 0; u < n.length; u += 1){
            o = n[u];
            i = i || s(e, o);
        }
        return t && i;
    }
    function nf(e, t) {
        var i = e.diff(t, "days", true);
        return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
    }
    function nh(e, i) {
        if (arguments.length === 1) {
            if (!arguments[0]) {
                e = undefined;
                i = undefined;
            } else if (na(arguments[0])) {
                e = arguments[0];
                i = undefined;
            } else if (nl(arguments[0])) {
                i = arguments[0];
                e = undefined;
            }
        }
        var n = e || i0(), r = i1(n, this).startOf("day"), s = t.calendarFormat(this, r) || "sameElse", a = i && (D(i[s]) ? i[s].call(this, n) : i[s]);
        return this.format(a || this.localeData().calendar(s, this, i0(n)));
    }
    function nc() {
        return new p(this);
    }
    function nd(e, t) {
        var i = k(e) ? e : i0(e);
        if (!(this.isValid() && i.isValid())) {
            return false;
        }
        t = ei(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() > i.valueOf();
        } else {
            return i.valueOf() < this.clone().startOf(t).valueOf();
        }
    }
    function n8(e, t) {
        var i = k(e) ? e : i0(e);
        if (!(this.isValid() && i.isValid())) {
            return false;
        }
        t = ei(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() < i.valueOf();
        } else {
            return this.clone().endOf(t).valueOf() < i.valueOf();
        }
    }
    function n$(e, t, i, n) {
        var r = k(e) ? e : i0(e), s = k(t) ? t : i0(t);
        if (!(this.isValid() && r.isValid() && s.isValid())) {
            return false;
        }
        n = n || "()";
        return ((n[0] === "(" ? this.isAfter(r, i) : !this.isBefore(r, i)) && (n[1] === ")" ? this.isBefore(s, i) : !this.isAfter(s, i)));
    }
    function nm(e, t) {
        var i = k(e) ? e : i0(e), n;
        if (!(this.isValid() && i.isValid())) {
            return false;
        }
        t = ei(t) || "millisecond";
        if (t === "millisecond") {
            return this.valueOf() === i.valueOf();
        } else {
            n = i.valueOf();
            return (this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf());
        }
    }
    function ny(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t);
    }
    function nv(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t);
    }
    function nw(e, t, i) {
        var n, r, s;
        if (!this.isValid()) {
            return NaN;
        }
        n = i1(e, this);
        if (!n.isValid()) {
            return NaN;
        }
        r = (n.utcOffset() - this.utcOffset()) * 6e4;
        t = ei(t);
        switch(t){
            case "year":
                s = n_(this, n) / 12;
                break;
            case "month":
                s = n_(this, n);
                break;
            case "quarter":
                s = n_(this, n) / 3;
                break;
            case "second":
                s = (this - n) / 1e3;
                break;
            case "minute":
                s = (this - n) / 6e4;
                break;
            case "hour":
                s = (this - n) / 36e5;
                break;
            case "day":
                s = (this - n - r) / 864e5;
                break;
            case "week":
                s = (this - n - r) / 6048e5;
                break;
            default:
                s = this - n;
        }
        return i ? s : eo(s);
    }
    function n_(e, t) {
        if (e.date() < t.date()) {
            return -n_(t, e);
        }
        var i = (t.year() - e.year()) * 12 + (t.month() - e.month()), n = e.clone().add(i, "months"), r, s;
        if (t - n < 0) {
            r = e.clone().add(i - 1, "months");
            s = (t - n) / (n - r);
        } else {
            r = e.clone().add(i + 1, "months");
            s = (t - n) / (r - n);
        }
        return -(i + s) || 0;
    }
    t.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    t.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function ng() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function np(e) {
        if (!this.isValid()) {
            return null;
        }
        var t = e !== true, i = t ? this.clone().utc() : this;
        if (i.year() < 0 || i.year() > 9999) {
            return z(i, t ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (D(Date.prototype.toISOString)) {
            if (t) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace("Z", z(i, "Z"));
            }
        }
        return z(i, t ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function nk() {
        if (!this.isValid()) {
            return "moment.invalid(/* " + this._i + " */)";
        }
        var e = "moment", t = "", i, n, r, s;
        if (!this.isLocal()) {
            e = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
            t = "Z";
        }
        i = "[" + e + '("]';
        n = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        r = "-MM-DD[T]HH:mm:ss.SSS";
        s = t + '[")]';
        return this.format(i + n + r + s);
    }
    function nO(e) {
        if (!e) {
            e = this.isUtc() ? t.defaultFormatUtc : t.defaultFormat;
        }
        var i = z(this, e);
        return this.localeData().postformat(i);
    }
    function nS(e, t) {
        if (this.isValid() && ((k(e) && e.isValid()) || i0(e).isValid())) {
            return iQ({
                to: this,
                from: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function nb(e) {
        return this.from(i0(), e);
    }
    function nT(e, t) {
        if (this.isValid() && ((k(e) && e.isValid()) || i0(e).isValid())) {
            return iQ({
                from: this,
                to: e
            }).locale(this.locale()).humanize(!t);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function n0(e) {
        return this.to(i0(), e);
    }
    function nD(e) {
        var t;
        if (e === undefined) {
            return this._locale._abbr;
        } else {
            t = tJ(e);
            if (t != null) {
                this._locale = t;
            }
            return this;
        }
    }
    var nx = S("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        if (e === undefined) {
            return this.localeData();
        } else {
            return this.locale(e);
        }
    });
    function nM() {
        return this._locale;
    }
    var nP = 1000, nC = 60 * nP, n4 = 60 * nC, n2 = (365 * 400 + 97) * 24 * n4;
    function nR(e, t) {
        return ((e % t) + t) % t;
    }
    function nU(e, t, i) {
        if (e < 100 && e >= 0) {
            return new Date(e + 400, t, i) - n2;
        } else {
            return new Date(e, t, i).valueOf();
        }
    }
    function nV(e, t, i) {
        if (e < 100 && e >= 0) {
            return Date.UTC(e + 400, t, i) - n2;
        } else {
            return Date.UTC(e, t, i);
        }
    }
    function nL(e) {
        var i, n;
        e = ei(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        n = this._isUTC ? nV : nU;
        switch(e){
            case "year":
                i = n(this.year(), 0, 1);
                break;
            case "quarter":
                i = n(this.year(), this.month() - (this.month() % 3), 1);
                break;
            case "month":
                i = n(this.year(), this.month(), 1);
                break;
            case "week":
                i = n(this.year(), this.month(), this.date() - this.weekday());
                break;
            case "isoWeek":
                i = n(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case "day":
            case "date":
                i = n(this.year(), this.month(), this.date());
                break;
            case "hour":
                i = this._d.valueOf();
                i -= nR(i + (this._isUTC ? 0 : this.utcOffset() * nC), n4);
                break;
            case "minute":
                i = this._d.valueOf();
                i -= nR(i, nC);
                break;
            case "second":
                i = this._d.valueOf();
                i -= nR(i, nP);
                break;
        }
        this._d.setTime(i);
        t.updateOffset(this, true);
        return this;
    }
    function nW(e) {
        var i, n;
        e = ei(e);
        if (e === undefined || e === "millisecond" || !this.isValid()) {
            return this;
        }
        n = this._isUTC ? nV : nU;
        switch(e){
            case "year":
                i = n(this.year() + 1, 0, 1) - 1;
                break;
            case "quarter":
                i = n(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
                break;
            case "month":
                i = n(this.year(), this.month() + 1, 1) - 1;
                break;
            case "week":
                i = n(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case "isoWeek":
                i = n(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case "day":
            case "date":
                i = n(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case "hour":
                i = this._d.valueOf();
                i += n4 - nR(i + (this._isUTC ? 0 : this.utcOffset() * nC), n4) - 1;
                break;
            case "minute":
                i = this._d.valueOf();
                i += nC - nR(i, nC) - 1;
                break;
            case "second":
                i = this._d.valueOf();
                i += nP - nR(i, nP) - 1;
                break;
        }
        this._d.setTime(i);
        t.updateOffset(this, true);
        return this;
    }
    function nY() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }
    function nF() {
        return Math.floor(this.valueOf() / 1000);
    }
    function n5() {
        return new Date(this.valueOf());
    }
    function n7() {
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
    function nI() {
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
    function n1() {
        return this.isValid() ? this.toISOString() : null;
    }
    function n3() {
        return y(this);
    }
    function nA() {
        return h({}, $(this));
    }
    function nE() {
        return $(this).overflow;
    }
    function n6() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    I("N", 0, 0, "eraAbbr");
    I("NN", 0, 0, "eraAbbr");
    I("NNN", 0, 0, "eraAbbr");
    I("NNNN", 0, 0, "eraName");
    I("NNNNN", 0, 0, "eraNarrow");
    I("y", [
        "y",
        1
    ], "yo", "eraYear");
    I("y", [
        "yy",
        2
    ], 0, "eraYear");
    I("y", [
        "yyy",
        3
    ], 0, "eraYear");
    I("y", [
        "yyyy",
        4
    ], 0, "eraYear");
    eC("N", nQ);
    eC("NN", nQ);
    eC("NNN", nQ);
    eC("NNNN", nK);
    eC("NNNNN", nX);
    eV([
        "N",
        "NN",
        "NNN",
        "NNNN",
        "NNNNN"
    ], function(e, t, i, n) {
        var r = i._locale.erasParse(e, n, i._strict);
        if (r) {
            $(i).era = r;
        } else {
            $(i).invalidEra = e;
        }
    });
    eC("y", eb);
    eC("yy", eb);
    eC("yyy", eb);
    eC("yyyy", eb);
    eC("yo", re);
    eV([
        "y",
        "yy",
        "yyy",
        "yyyy"
    ], eY);
    eV([
        "yo"
    ], function(e, t, i, n) {
        var r;
        if (i._locale._eraYearOrdinalRegex) {
            r = e.match(i._locale._eraYearOrdinalRegex);
        }
        if (i._locale.eraYearOrdinalParse) {
            t[eY] = i._locale.eraYearOrdinalParse(e, r);
        } else {
            t[eY] = parseInt(e, 10);
        }
    });
    function nz(e, i) {
        var n, r, s, a = this._eras || tJ("en")._eras;
        for(n = 0, r = a.length; n < r; ++n){
            switch(typeof a[n].since){
                case "string":
                    s = t(a[n].since).startOf("day");
                    a[n].since = s.valueOf();
                    break;
            }
            switch(typeof a[n].until){
                case "undefined":
                    a[n].until = +Infinity;
                    break;
                case "string":
                    s = t(a[n].until).startOf("day").valueOf();
                    a[n].until = s.valueOf();
                    break;
            }
        }
        return a;
    }
    function nN(e, t, i) {
        var n, r, s = this.eras(), a, u, o;
        e = e.toUpperCase();
        for(n = 0, r = s.length; n < r; ++n){
            a = s[n].name.toUpperCase();
            u = s[n].abbr.toUpperCase();
            o = s[n].narrow.toUpperCase();
            if (i) {
                switch(t){
                    case "N":
                    case "NN":
                    case "NNN":
                        if (u === e) {
                            return s[n];
                        }
                        break;
                    case "NNNN":
                        if (a === e) {
                            return s[n];
                        }
                        break;
                    case "NNNNN":
                        if (o === e) {
                            return s[n];
                        }
                        break;
                }
            } else if ([
                a,
                u,
                o
            ].indexOf(e) >= 0) {
                return s[n];
            }
        }
    }
    function nH(e, i) {
        var n = e.since <= e.until ? +1 : -1;
        if (i === undefined) {
            return t(e.since).year();
        } else {
            return t(e.since).year() + (i - e.offset) * n;
        }
    }
    function nj() {
        var e, t, i, n = this.localeData().eras();
        for(e = 0, t = n.length; e < t; ++e){
            i = this.clone().startOf("day").valueOf();
            if (n[e].since <= i && i <= n[e].until) {
                return n[e].name;
            }
            if (n[e].until <= i && i <= n[e].since) {
                return n[e].name;
            }
        }
        return "";
    }
    function nG() {
        var e, t, i, n = this.localeData().eras();
        for(e = 0, t = n.length; e < t; ++e){
            i = this.clone().startOf("day").valueOf();
            if (n[e].since <= i && i <= n[e].until) {
                return n[e].narrow;
            }
            if (n[e].until <= i && i <= n[e].since) {
                return n[e].narrow;
            }
        }
        return "";
    }
    function nZ() {
        var e, t, i, n = this.localeData().eras();
        for(e = 0, t = n.length; e < t; ++e){
            i = this.clone().startOf("day").valueOf();
            if (n[e].since <= i && i <= n[e].until) {
                return n[e].abbr;
            }
            if (n[e].until <= i && i <= n[e].since) {
                return n[e].abbr;
            }
        }
        return "";
    }
    function n9() {
        var e, i, n, r, s = this.localeData().eras();
        for(e = 0, i = s.length; e < i; ++e){
            n = s[e].since <= s[e].until ? +1 : -1;
            r = this.clone().startOf("day").valueOf();
            if ((s[e].since <= r && r <= s[e].until) || (s[e].until <= r && r <= s[e].since)) {
                return ((this.year() - t(s[e].since).year()) * n + s[e].offset);
            }
        }
        return this.year();
    }
    function nB(e) {
        if (!s(this, "_erasNameRegex")) {
            rt.call(this);
        }
        return e ? this._erasNameRegex : this._erasRegex;
    }
    function nJ(e) {
        if (!s(this, "_erasAbbrRegex")) {
            rt.call(this);
        }
        return e ? this._erasAbbrRegex : this._erasRegex;
    }
    function nq(e) {
        if (!s(this, "_erasNarrowRegex")) {
            rt.call(this);
        }
        return e ? this._erasNarrowRegex : this._erasRegex;
    }
    function nQ(e, t) {
        return t.erasAbbrRegex(e);
    }
    function nK(e, t) {
        return t.erasNameRegex(e);
    }
    function nX(e, t) {
        return t.erasNarrowRegex(e);
    }
    function re(e, t) {
        return t._eraYearOrdinalRegex || eb;
    }
    function rt() {
        var e = [], t = [], i = [], n = [], r, s, a = this.eras();
        for(r = 0, s = a.length; r < s; ++r){
            t.push(eR(a[r].name));
            e.push(eR(a[r].abbr));
            i.push(eR(a[r].narrow));
            n.push(eR(a[r].name));
            n.push(eR(a[r].abbr));
            n.push(eR(a[r].narrow));
        }
        this._erasRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + t.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + e.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + i.join("|") + ")", "i");
    }
    I(0, [
        "gg",
        2
    ], 0, function() {
        return this.weekYear() % 100;
    });
    I(0, [
        "GG",
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    function ri(e, t) {
        I(0, [
            e,
            e.length
        ], 0, t);
    }
    ri("gggg", "weekYear");
    ri("ggggg", "weekYear");
    ri("GGGG", "isoWeekYear");
    ri("GGGGG", "isoWeekYear");
    et("weekYear", "gg");
    et("isoWeekYear", "GG");
    es("weekYear", 1);
    es("isoWeekYear", 1);
    eC("G", eT);
    eC("g", eT);
    eC("GG", e_, em);
    eC("gg", e_, em);
    eC("GGGG", eO, ev);
    eC("gggg", eO, ev);
    eC("GGGGG", eS, ew);
    eC("ggggg", eS, ew);
    eL([
        "gggg",
        "ggggg",
        "GGGG",
        "GGGGG"
    ], function(e, t, i, n) {
        t[n.substr(0, 2)] = el(e);
    });
    eL([
        "gg",
        "GG"
    ], function(e, i, n, r) {
        i[r] = t.parseTwoDigitYear(e);
    });
    function rn(e) {
        return rl.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function rr(e) {
        return rl.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function rs() {
        return tc(this.year(), 1, 4);
    }
    function ra() {
        return tc(this.isoWeekYear(), 1, 4);
    }
    function ru() {
        var e = this.localeData()._week;
        return tc(this.year(), e.dow, e.doy);
    }
    function ro() {
        var e = this.localeData()._week;
        return tc(this.weekYear(), e.dow, e.doy);
    }
    function rl(e, t, i, n, r) {
        var s;
        if (e == null) {
            return th(this, n, r).year;
        } else {
            s = tc(e, n, r);
            if (t > s) {
                t = s;
            }
            return rf.call(this, e, t, i, n, r);
        }
    }
    function rf(e, t, i, n, r) {
        var s = tf(e, t, i, n, r), a = to(s.year, 0, s.dayOfYear);
        this.year(a.getUTCFullYear());
        this.month(a.getUTCMonth());
        this.date(a.getUTCDate());
        return this;
    }
    I("Q", 0, "Qo", "quarter");
    et("quarter", "Q");
    es("quarter", 7);
    eC("Q", e$);
    eV("Q", function(e, t) {
        t[eF] = (el(e) - 1) * 3;
    });
    function rh(e) {
        return e == null ? Math.ceil((this.month() + 1) / 3) : this.month((e - 1) * 3 + (this.month() % 3));
    }
    I("D", [
        "DD",
        2
    ], "Do", "date");
    et("date", "D");
    es("date", 9);
    eC("D", e_);
    eC("DD", e_, em);
    eC("Do", function(e, t) {
        return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient;
    });
    eV([
        "D",
        "DD"
    ], e5);
    eV("Do", function(e, t) {
        t[e5] = el(e.match(e_)[0]);
    });
    var rc = ef("Date", true);
    I("DDD", [
        "DDDD",
        3
    ], "DDDo", "dayOfYear");
    et("dayOfYear", "DDD");
    es("dayOfYear", 4);
    eC("DDD", ek);
    eC("DDDD", ey);
    eV([
        "DDD",
        "DDDD"
    ], function(e, t, i) {
        i._dayOfYear = el(e);
    });
    function rd(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return e == null ? t : this.add(e - t, "d");
    }
    I("m", [
        "mm",
        2
    ], 0, "minute");
    et("minute", "m");
    es("minute", 14);
    eC("m", e_);
    eC("mm", e_, em);
    eV([
        "m",
        "mm"
    ], eI);
    var r8 = ef("Minutes", false);
    I("s", [
        "ss",
        2
    ], 0, "second");
    et("second", "s");
    es("second", 15);
    eC("s", e_);
    eC("ss", e_, em);
    eV([
        "s",
        "ss"
    ], e1);
    var r$ = ef("Seconds", false);
    I("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    I(0, [
        "SS",
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    I(0, [
        "SSS",
        3
    ], 0, "millisecond");
    I(0, [
        "SSSS",
        4
    ], 0, function() {
        return this.millisecond() * 10;
    });
    I(0, [
        "SSSSS",
        5
    ], 0, function() {
        return this.millisecond() * 100;
    });
    I(0, [
        "SSSSSS",
        6
    ], 0, function() {
        return this.millisecond() * 1000;
    });
    I(0, [
        "SSSSSSS",
        7
    ], 0, function() {
        return this.millisecond() * 10000;
    });
    I(0, [
        "SSSSSSSS",
        8
    ], 0, function() {
        return this.millisecond() * 100000;
    });
    I(0, [
        "SSSSSSSSS",
        9
    ], 0, function() {
        return this.millisecond() * 1000000;
    });
    et("millisecond", "ms");
    es("millisecond", 16);
    eC("S", ek, e$);
    eC("SS", ek, em);
    eC("SSS", ek, ey);
    var rm, ry;
    for(rm = "SSSS"; rm.length <= 9; rm += "S"){
        eC(rm, eb);
    }
    function rv(e, t) {
        t[e3] = el(("0." + e) * 1000);
    }
    for(rm = "S"; rm.length <= 9; rm += "S"){
        eV(rm, rv);
    }
    ry = ef("Milliseconds", false);
    I("z", 0, 0, "zoneAbbr");
    I("zz", 0, 0, "zoneName");
    function rw() {
        return this._isUTC ? "UTC" : "";
    }
    function r_() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var rg = p.prototype;
    rg.add = nn;
    rg.calendar = nh;
    rg.clone = nc;
    rg.diff = nw;
    rg.endOf = nW;
    rg.format = nO;
    rg.from = nS;
    rg.fromNow = nb;
    rg.to = nT;
    rg.toNow = n0;
    rg.get = ed;
    rg.invalidAt = nE;
    rg.isAfter = nd;
    rg.isBefore = n8;
    rg.isBetween = n$;
    rg.isSame = nm;
    rg.isSameOrAfter = ny;
    rg.isSameOrBefore = nv;
    rg.isValid = n3;
    rg.lang = nx;
    rg.locale = nD;
    rg.localeData = nM;
    rg.max = ix;
    rg.min = iD;
    rg.parsingFlags = nA;
    rg.set = e8;
    rg.startOf = nL;
    rg.subtract = nr;
    rg.toArray = n7;
    rg.toObject = nI;
    rg.toDate = n5;
    rg.toISOString = np;
    rg.inspect = nk;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
        rg[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        };
    }
    rg.toJSON = n1;
    rg.toString = ng;
    rg.unix = nF;
    rg.valueOf = nY;
    rg.creationData = n6;
    rg.eraName = nj;
    rg.eraNarrow = nG;
    rg.eraAbbr = nZ;
    rg.eraYear = n9;
    rg.year = ts;
    rg.isLeapYear = ta;
    rg.weekYear = rn;
    rg.isoWeekYear = rr;
    rg.quarter = rg.quarters = rh;
    rg.month = eX;
    rg.daysInMonth = te;
    rg.week = rg.weeks = ty;
    rg.isoWeek = rg.isoWeeks = tv;
    rg.weeksInYear = ru;
    rg.weeksInWeekYear = ro;
    rg.isoWeeksInYear = rs;
    rg.isoWeeksInISOWeekYear = ra;
    rg.date = rc;
    rg.day = rg.days = tC;
    rg.weekday = t4;
    rg.isoWeekday = t2;
    rg.dayOfYear = rd;
    rg.hour = rg.hours = t1;
    rg.minute = rg.minutes = r8;
    rg.second = rg.seconds = r$;
    rg.millisecond = rg.milliseconds = ry;
    rg.utcOffset = iA;
    rg.utc = i6;
    rg.local = iz;
    rg.parseZone = iN;
    rg.hasAlignedHourOffset = iH;
    rg.isDST = ij;
    rg.isLocal = iZ;
    rg.isUtcOffset = i9;
    rg.isUtc = iB;
    rg.isUTC = iB;
    rg.zoneAbbr = rw;
    rg.zoneName = r_;
    rg.dates = S("dates accessor is deprecated. Use date instead.", rc);
    rg.months = S("months accessor is deprecated. Use month instead", eX);
    rg.years = S("years accessor is deprecated. Use year instead", ts);
    rg.zone = S("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", iE);
    rg.isDSTShifted = S("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", iG);
    function rp(e) {
        return i0(e * 1000);
    }
    function rk() {
        return i0.apply(null, arguments).parseZone();
    }
    function rO(e) {
        return e;
    }
    var rS = P.prototype;
    rS.calendar = U;
    rS.longDateFormat = j;
    rS.invalidDate = Z;
    rS.ordinal = q;
    rS.preparse = rO;
    rS.postformat = rO;
    rS.relativeTime = K;
    rS.pastFuture = X;
    rS.set = x;
    rS.eras = nz;
    rS.erasParse = nN;
    rS.erasConvertYear = nH;
    rS.erasAbbrRegex = nJ;
    rS.erasNameRegex = nB;
    rS.erasNarrowRegex = nq;
    rS.months = eB;
    rS.monthsShort = eJ;
    rS.monthsParse = eQ;
    rS.monthsRegex = ti;
    rS.monthsShortRegex = tt;
    rS.week = td;
    rS.firstDayOfYear = tm;
    rS.firstDayOfWeek = t$;
    rS.weekdays = t0;
    rS.weekdaysMin = tx;
    rS.weekdaysShort = tD;
    rS.weekdaysParse = tP;
    rS.weekdaysRegex = tR;
    rS.weekdaysShortRegex = tU;
    rS.weekdaysMinRegex = tV;
    rS.isPM = t7;
    rS.meridiem = t3;
    function rb(e, t, i, n) {
        var r = tJ(), s = c().set(n, t);
        return r[i](s, e);
    }
    function rT(e, t, i) {
        if (o(e)) {
            t = e;
            e = undefined;
        }
        e = e || "";
        if (t != null) {
            return rb(e, t, i, "month");
        }
        var n, r = [];
        for(n = 0; n < 12; n++){
            r[n] = rb(e, n, i, "month");
        }
        return r;
    }
    function r0(e, t, i, n) {
        if (typeof e === "boolean") {
            if (o(t)) {
                i = t;
                t = undefined;
            }
            t = t || "";
        } else {
            t = e;
            i = t;
            e = false;
            if (o(t)) {
                i = t;
                t = undefined;
            }
            t = t || "";
        }
        var r = tJ(), s = e ? r._week.dow : 0, a, u = [];
        if (i != null) {
            return rb(t, (i + s) % 7, n, "day");
        }
        for(a = 0; a < 7; a++){
            u[a] = rb(t, (a + s) % 7, n, "day");
        }
        return u;
    }
    function rD(e, t) {
        return rT(e, t, "months");
    }
    function rx(e, t) {
        return rT(e, t, "monthsShort");
    }
    function rM(e, t, i) {
        return r0(e, t, i, "weekdays");
    }
    function rP(e, t, i) {
        return r0(e, t, i, "weekdaysShort");
    }
    function rC(e, t, i) {
        return r0(e, t, i, "weekdaysMin");
    }
    tZ("en", {
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
            var t = e % 10, i = el((e % 100) / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th";
            return e + i;
        }
    });
    t.lang = S("moment.lang is deprecated. Use moment.locale instead.", tZ);
    t.langData = S("moment.langData is deprecated. Use moment.localeData instead.", tJ);
    var r4 = Math.abs;
    function r2() {
        var e = this._data;
        this._milliseconds = r4(this._milliseconds);
        this._days = r4(this._days);
        this._months = r4(this._months);
        e.milliseconds = r4(e.milliseconds);
        e.seconds = r4(e.seconds);
        e.minutes = r4(e.minutes);
        e.hours = r4(e.hours);
        e.months = r4(e.months);
        e.years = r4(e.years);
        return this;
    }
    function rR(e, t, i, n) {
        var r = iQ(t, i);
        e._milliseconds += n * r._milliseconds;
        e._days += n * r._days;
        e._months += n * r._months;
        return e._bubble();
    }
    function rU(e, t) {
        return rR(this, e, t, 1);
    }
    function rV(e, t) {
        return rR(this, e, t, -1);
    }
    function rL(e) {
        if (e < 0) {
            return Math.floor(e);
        } else {
            return Math.ceil(e);
        }
    }
    function rW() {
        var e = this._milliseconds, t = this._days, i = this._months, n = this._data, r, s, a, u, o;
        if (!((e >= 0 && t >= 0 && i >= 0) || (e <= 0 && t <= 0 && i <= 0))) {
            e += rL(rF(i) + t) * 864e5;
            t = 0;
            i = 0;
        }
        n.milliseconds = e % 1000;
        r = eo(e / 1000);
        n.seconds = r % 60;
        s = eo(r / 60);
        n.minutes = s % 60;
        a = eo(s / 60);
        n.hours = a % 24;
        t += eo(a / 24);
        o = eo(rY(t));
        i += o;
        t -= rL(rF(o));
        u = eo(i / 12);
        i %= 12;
        n.days = t;
        n.months = i;
        n.years = u;
        return this;
    }
    function rY(e) {
        return (e * 4800) / 146097;
    }
    function rF(e) {
        return (e * 146097) / 4800;
    }
    function r5(e) {
        if (!this.isValid()) {
            return NaN;
        }
        var t, i, n = this._milliseconds;
        e = ei(e);
        if (e === "month" || e === "quarter" || e === "year") {
            t = this._days + n / 864e5;
            i = this._months + rY(t);
            switch(e){
                case "month":
                    return i;
                case "quarter":
                    return i / 3;
                case "year":
                    return i / 12;
            }
        } else {
            t = this._days + Math.round(rF(this._months));
            switch(e){
                case "week":
                    return t / 7 + n / 6048e5;
                case "day":
                    return t + n / 864e5;
                case "hour":
                    return t * 24 + n / 36e5;
                case "minute":
                    return t * 1440 + n / 6e4;
                case "second":
                    return t * 86400 + n / 1000;
                case "millisecond":
                    return Math.floor(t * 864e5) + n;
                default:
                    throw new Error("Unknown unit " + e);
            }
        }
    }
    function r7() {
        if (!this.isValid()) {
            return NaN;
        }
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + el(this._months / 12) * 31536e6);
    }
    function rI(e) {
        return function() {
            return this.as(e);
        };
    }
    var r1 = rI("ms"), r3 = rI("s"), rA = rI("m"), rE = rI("h"), r6 = rI("d"), rz = rI("w"), rN = rI("M"), rH = rI("Q"), rj = rI("y");
    function rG() {
        return iQ(this);
    }
    function rZ(e) {
        e = ei(e);
        return this.isValid() ? this[e + "s"]() : NaN;
    }
    function r9(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN;
        };
    }
    var rB = r9("milliseconds"), rJ = r9("seconds"), rq = r9("minutes"), rQ = r9("hours"), rK = r9("days"), rX = r9("months"), se = r9("years");
    function st() {
        return eo(this.days() / 7);
    }
    var si = Math.round, sn = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    function sr(e, t, i, n, r) {
        return r.relativeTime(t || 1, !!i, e, n);
    }
    function ss(e, t, i, n) {
        var r = iQ(e).abs(), s = si(r.as("s")), a = si(r.as("m")), u = si(r.as("h")), o = si(r.as("d")), l = si(r.as("M")), f = si(r.as("w")), h = si(r.as("y")), c = (s <= i.ss && [
            "s",
            s
        ]) || (s < i.s && [
            "ss",
            s
        ]) || (a <= 1 && [
            "m"
        ]) || (a < i.m && [
            "mm",
            a
        ]) || (u <= 1 && [
            "h"
        ]) || (u < i.h && [
            "hh",
            u
        ]) || (o <= 1 && [
            "d"
        ]) || (o < i.d && [
            "dd",
            o
        ]);
        if (i.w != null) {
            c = c || (f <= 1 && [
                "w"
            ]) || (f < i.w && [
                "ww",
                f
            ]);
        }
        c = c || (l <= 1 && [
            "M"
        ]) || (l < i.M && [
            "MM",
            l
        ]) || (h <= 1 && [
            "y"
        ]) || [
            "yy",
            h
        ];
        c[2] = t;
        c[3] = +e > 0;
        c[4] = n;
        return sr.apply(null, c);
    }
    function sa(e) {
        if (e === undefined) {
            return si;
        }
        if (typeof e === "function") {
            si = e;
            return true;
        }
        return false;
    }
    function su(e, t) {
        if (sn[e] === undefined) {
            return false;
        }
        if (t === undefined) {
            return sn[e];
        }
        sn[e] = t;
        if (e === "s") {
            sn.ss = t - 1;
        }
        return true;
    }
    function so(e, t) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var i = false, n = sn, r, s;
        if (typeof e === "object") {
            t = e;
            e = false;
        }
        if (typeof e === "boolean") {
            i = e;
        }
        if (typeof t === "object") {
            n = Object.assign({}, sn, t);
            if (t.s != null && t.ss == null) {
                n.ss = t.s - 1;
            }
        }
        r = this.localeData();
        s = ss(this, !i, n, r);
        if (i) {
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
        var e = sl(this._milliseconds) / 1000, t = sl(this._days), i = sl(this._months), n, r, s, a, u = this.asSeconds(), o, l, f, h;
        if (!u) {
            return "P0D";
        }
        n = eo(e / 60);
        r = eo(n / 60);
        e %= 60;
        n %= 60;
        s = eo(i / 12);
        i %= 12;
        a = e ? e.toFixed(3).replace(/\.?0+$/, "") : "";
        o = u < 0 ? "-" : "";
        l = sf(this._months) !== sf(u) ? "-" : "";
        f = sf(this._days) !== sf(u) ? "-" : "";
        h = sf(this._milliseconds) !== sf(u) ? "-" : "";
        return (o + "P" + (s ? l + s + "Y" : "") + (i ? l + i + "M" : "") + (t ? f + t + "D" : "") + (r || n || e ? "T" : "") + (r ? h + r + "H" : "") + (n ? h + n + "M" : "") + (e ? h + a + "S" : ""));
    }
    var sc = iL.prototype;
    sc.isValid = iU;
    sc.abs = r2;
    sc.add = rU;
    sc.subtract = rV;
    sc.as = r5;
    sc.asMilliseconds = r1;
    sc.asSeconds = r3;
    sc.asMinutes = rA;
    sc.asHours = rE;
    sc.asDays = r6;
    sc.asWeeks = rz;
    sc.asMonths = rN;
    sc.asQuarters = rH;
    sc.asYears = rj;
    sc.valueOf = r7;
    sc._bubble = rW;
    sc.clone = rG;
    sc.get = rZ;
    sc.milliseconds = rB;
    sc.seconds = rJ;
    sc.minutes = rq;
    sc.hours = rQ;
    sc.days = rK;
    sc.weeks = st;
    sc.months = rX;
    sc.years = se;
    sc.humanize = so;
    sc.toISOString = sh;
    sc.toString = sh;
    sc.toJSON = sh;
    sc.locale = nD;
    sc.localeData = nM;
    sc.toIsoString = S("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", sh);
    sc.lang = nx;
    I("X", 0, 0, "unix");
    I("x", 0, 0, "valueOf");
    eC("x", eT);
    eC("X", ex);
    eV("X", function(e, t, i) {
        i._d = new Date(parseFloat(e) * 1000);
    });
    eV("x", function(e, t, i) {
        i._d = new Date(el(e));
    });
    t.version = "2.29.1";
    i(i0);
    t.fn = rg;
    t.min = iP;
    t.max = iC;
    t.now = i4;
    t.utc = c;
    t.unix = rp;
    t.months = rD;
    t.isDate = l;
    t.locale = tZ;
    t.invalid = v;
    t.duration = iQ;
    t.isMoment = k;
    t.weekdays = rM;
    t.parseZone = rk;
    t.localeData = tJ;
    t.isDuration = iW;
    t.monthsShort = rx;
    t.weekdaysMin = rC;
    t.defineLocale = t9;
    t.updateLocale = tB;
    t.locales = tq;
    t.weekdaysShort = rP;
    t.normalizeUnits = ei;
    t.relativeTimeRounding = sa;
    t.relativeTimeThreshold = su;
    t.calendarFormat = nf;
    t.prototype = rg;
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
