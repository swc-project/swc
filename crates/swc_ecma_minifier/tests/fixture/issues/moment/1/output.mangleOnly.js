(function(b, a) {
    typeof exports === "object" && typeof module !== "undefined" ? (module.exports = a()) : typeof define === "function" && define.amd ? define(a) : (b.moment = a());
})(this, function() {
    "use strict";
    var cX;
    function d() {
        return cX.apply(null, arguments);
    }
    function _(a) {
        cX = a;
    }
    function cY(a) {
        return (a instanceof Array || Object.prototype.toString.call(a) === "[object Array]");
    }
    function cZ(a) {
        return (a != null && Object.prototype.toString.call(a) === "[object Object]");
    }
    function c$(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
    function c_(a) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(a).length === 0;
        } else {
            var b;
            for(b in a){
                if (c$(a, b)) {
                    return false;
                }
            }
            return true;
        }
    }
    function c0(a) {
        return a === void 0;
    }
    function c1(a) {
        return (typeof a === "number" || Object.prototype.toString.call(a) === "[object Number]");
    }
    function aa(a) {
        return (a instanceof Date || Object.prototype.toString.call(a) === "[object Date]");
    }
    function c2(b, d) {
        var c = [], a;
        for(a = 0; a < b.length; ++a){
            c.push(d(b[a], a));
        }
        return c;
    }
    function c3(b, a) {
        for(var c in a){
            if (c$(a, c)) {
                b[c] = a[c];
            }
        }
        if (c$(a, "toString")) {
            b.toString = a.toString;
        }
        if (c$(a, "valueOf")) {
            b.valueOf = a.valueOf;
        }
        return b;
    }
    function ab(a, b, c, d) {
        return eD(a, b, c, d, true).utc();
    }
    function c4() {
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
    function c5(a) {
        if (a._pf == null) {
            a._pf = c4();
        }
        return a._pf;
    }
    var D;
    if (Array.prototype.some) {
        D = Array.prototype.some;
    } else {
        D = function(c) {
            var b = Object(this), d = b.length >>> 0, a;
            for(a = 0; a < d; a++){
                if (a in b && c.call(this, b[a], a, b)) {
                    return true;
                }
            }
            return false;
        };
    }
    function c6(b) {
        if (b._isValid == null) {
            var a = c5(b), d = D.call(a.parsedDateParts, function(a) {
                return a != null;
            }), c = !isNaN(b._d.getTime()) && a.overflow < 0 && !a.empty && !a.invalidEra && !a.invalidMonth && !a.invalidWeekday && !a.weekdayMismatch && !a.nullInput && !a.invalidFormat && !a.userInvalidated && (!a.meridiem || (a.meridiem && d));
            if (b._strict) {
                c = c && a.charsLeftOver === 0 && a.unusedTokens.length === 0 && a.bigHour === undefined;
            }
            if (Object.isFrozen == null || !Object.isFrozen(b)) {
                b._isValid = c;
            } else {
                return c;
            }
        }
        return b._isValid;
    }
    function ac(b) {
        var a = ab(NaN);
        if (b != null) {
            c3(c5(a), b);
        } else {
            c5(a).userInvalidated = true;
        }
        return a;
    }
    var c7 = (d.momentProperties = []), c8 = false;
    function c9(b, a) {
        var c, d, e;
        if (!c0(a._isAMomentObject)) {
            b._isAMomentObject = a._isAMomentObject;
        }
        if (!c0(a._i)) {
            b._i = a._i;
        }
        if (!c0(a._f)) {
            b._f = a._f;
        }
        if (!c0(a._l)) {
            b._l = a._l;
        }
        if (!c0(a._strict)) {
            b._strict = a._strict;
        }
        if (!c0(a._tzm)) {
            b._tzm = a._tzm;
        }
        if (!c0(a._isUTC)) {
            b._isUTC = a._isUTC;
        }
        if (!c0(a._offset)) {
            b._offset = a._offset;
        }
        if (!c0(a._pf)) {
            b._pf = c5(a);
        }
        if (!c0(a._locale)) {
            b._locale = a._locale;
        }
        if (c7.length > 0) {
            for(c = 0; c < c7.length; c++){
                d = c7[c];
                e = a[d];
                if (!c0(e)) {
                    b[d] = e;
                }
            }
        }
        return b;
    }
    function ad(a) {
        c9(this, a);
        this._d = new Date(a._d != null ? a._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        if (c8 === false) {
            c8 = true;
            d.updateOffset(this);
            c8 = false;
        }
    }
    function ae(a) {
        return (a instanceof ad || (a != null && a._isAMomentObject != null));
    }
    function da(a) {
        if (d.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
            console.warn("Deprecation warning: " + a);
        }
    }
    function l(b, a) {
        var c = true;
        return c3(function() {
            if (d.deprecationHandler != null) {
                d.deprecationHandler(null, b);
            }
            if (c) {
                var h = [], e, f, g;
                for(f = 0; f < arguments.length; f++){
                    e = "";
                    if (typeof arguments[f] === "object") {
                        e += "\n[" + f + "] ";
                        for(g in arguments[0]){
                            if (c$(arguments[0], g)) {
                                e += g + ": " + arguments[0][g] + ", ";
                            }
                        }
                        e = e.slice(0, -2);
                    } else {
                        e = arguments[f];
                    }
                    h.push(e);
                }
                da(b + "\nArguments: " + Array.prototype.slice.call(h).join("") + "\n" + new Error().stack);
                c = false;
            }
            return a.apply(this, arguments);
        }, a);
    }
    var db = {};
    function dc(a, b) {
        if (d.deprecationHandler != null) {
            d.deprecationHandler(a, b);
        }
        if (!db[a]) {
            da(b);
            db[a] = true;
        }
    }
    d.suppressDeprecationWarnings = false;
    d.deprecationHandler = null;
    function dd(a) {
        return ((typeof Function !== "undefined" && a instanceof Function) || Object.prototype.toString.call(a) === "[object Function]");
    }
    function af(b) {
        var c, a;
        for(a in b){
            if (c$(b, a)) {
                c = b[a];
                if (dd(c)) {
                    this[a] = c;
                } else {
                    this["_" + a] = c;
                }
            }
        }
        this._config = b;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function de(d, c) {
        var b = c3({}, d), a;
        for(a in c){
            if (c$(c, a)) {
                if (cZ(d[a]) && cZ(c[a])) {
                    b[a] = {};
                    c3(b[a], d[a]);
                    c3(b[a], c[a]);
                } else if (c[a] != null) {
                    b[a] = c[a];
                } else {
                    delete b[a];
                }
            }
        }
        for(a in d){
            if (c$(d, a) && !c$(c, a) && cZ(d[a])) {
                b[a] = c3({}, b[a]);
            }
        }
        return b;
    }
    function ag(a) {
        if (a != null) {
            this.set(a);
        }
    }
    var E;
    if (Object.keys) {
        E = Object.keys;
    } else {
        E = function(b) {
            var a, c = [];
            for(a in b){
                if (c$(b, a)) {
                    c.push(a);
                }
            }
            return c;
        };
    }
    var ah = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    function ai(b, c, d) {
        var a = this._calendar[b] || this._calendar["sameElse"];
        return dd(a) ? a.call(c, d) : a;
    }
    function df(a, c, d) {
        var b = "" + Math.abs(a), e = c - b.length, f = a >= 0;
        return ((f ? (d ? "+" : "") : "-") + Math.pow(10, Math.max(0, e)).toString().substr(1) + b);
    }
    var dg = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, dh = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, di = {}, dj = {};
    function c(a, b, c, d) {
        var e = d;
        if (typeof d === "string") {
            e = function() {
                return this[d]();
            };
        }
        if (a) {
            dj[a] = e;
        }
        if (b) {
            dj[b[0]] = function() {
                return df(e.apply(this, arguments), b[1], b[2]);
            };
        }
        if (c) {
            dj[c] = function() {
                return this.localeData().ordinal(e.apply(this, arguments), a);
            };
        }
    }
    function dk(a) {
        if (a.match(/\[[\s\S]/)) {
            return a.replace(/^\[|\]$/g, "");
        }
        return a.replace(/\\/g, "");
    }
    function dl(d) {
        var b = d.match(dg), a, c;
        for(a = 0, c = b.length; a < c; a++){
            if (dj[b[a]]) {
                b[a] = dj[b[a]];
            } else {
                b[a] = dk(b[a]);
            }
        }
        return function(f) {
            var e = "", a;
            for(a = 0; a < c; a++){
                e += dd(b[a]) ? b[a].call(f, d) : b[a];
            }
            return e;
        };
    }
    function dm(b, a) {
        if (!b.isValid()) {
            return b.localeData().invalidDate();
        }
        a = dn(a, b.localeData());
        di[a] = di[a] || dl(a);
        return di[a](b);
    }
    function dn(a, d) {
        var b = 5;
        function c(a) {
            return d.longDateFormat(a) || a;
        }
        dh.lastIndex = 0;
        while(b >= 0 && dh.test(a)){
            a = a.replace(dh, c);
            dh.lastIndex = 0;
            b -= 1;
        }
        return a;
    }
    var aj = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function ak(a) {
        var b = this._longDateFormat[a], c = this._longDateFormat[a.toUpperCase()];
        if (b || !c) {
            return b;
        }
        this._longDateFormat[a] = c.match(dg).map(function(a) {
            if (a === "MMMM" || a === "MM" || a === "DD" || a === "dddd") {
                return a.slice(1);
            }
            return a;
        }).join("");
        return this._longDateFormat[a];
    }
    var al = "Invalid date";
    function am() {
        return this._invalidDate;
    }
    var an = "%d", ao = /\d{1,2}/;
    function ap(a) {
        return this._ordinal.replace("%d", a);
    }
    var aq = {
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
    function ar(b, d, c, e) {
        var a = this._relativeTime[c];
        return dd(a) ? a(b, d, c, e) : a.replace(/%d/i, b);
    }
    function as(c, b) {
        var a = this._relativeTime[c > 0 ? "future" : "past"];
        return dd(a) ? a(b) : a.replace(/%s/i, b);
    }
    var dp = {};
    function i(a, c) {
        var b = a.toLowerCase();
        dp[b] = dp[b + "s"] = dp[c] = a;
    }
    function at(a) {
        return typeof a === "string" ? dp[a] || dp[a.toLowerCase()] : undefined;
    }
    function dq(b) {
        var d = {}, c, a;
        for(a in b){
            if (c$(b, a)) {
                c = at(a);
                if (c) {
                    d[c] = b[a];
                }
            }
        }
        return d;
    }
    var dr = {};
    function j(a, b) {
        dr[a] = b;
    }
    function ds(c) {
        var b = [], a;
        for(a in c){
            if (c$(c, a)) {
                b.push({
                    unit: a,
                    priority: dr[a]
                });
            }
        }
        b.sort(function(a, b) {
            return a.priority - b.priority;
        });
        return b;
    }
    function dt(a) {
        return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
    }
    function du(a) {
        if (a < 0) {
            return Math.ceil(a) || 0;
        } else {
            return Math.floor(a);
        }
    }
    function dv(c) {
        var a = +c, b = 0;
        if (a !== 0 && isFinite(a)) {
            b = du(a);
        }
        return b;
    }
    function p(a, b) {
        return function(c) {
            if (c != null) {
                dx(this, a, c);
                d.updateOffset(this, b);
                return this;
            } else {
                return dw(this, a);
            }
        };
    }
    function dw(a, b) {
        return a.isValid() ? a._d["get" + (a._isUTC ? "UTC" : "") + b]() : NaN;
    }
    function dx(a, c, b) {
        if (a.isValid() && !isNaN(b)) {
            if (c === "FullYear" && dt(a.year()) && a.month() === 1 && a.date() === 29) {
                b = dv(b);
                a._d["set" + (a._isUTC ? "UTC" : "") + c](b, a.month(), dJ(b, a.month()));
            } else {
                a._d["set" + (a._isUTC ? "UTC" : "") + c](b);
            }
        }
    }
    function au(a) {
        a = at(a);
        if (dd(this[a])) {
            return this[a]();
        }
        return this;
    }
    function av(a, d) {
        if (typeof a === "object") {
            a = dq(a);
            var c = ds(a), b;
            for(b = 0; b < c.length; b++){
                this[c[b].unit](a[c[b].unit]);
            }
        } else {
            a = at(a);
            if (dd(this[a])) {
                return this[a](d);
            }
        }
        return this;
    }
    var F = /\d/, k = /\d\d/, G = /\d{3}/, z = /\d{4}/, t = /[+-]?\d{6}/, h = /\d\d?/, H = /\d\d\d\d?/, I = /\d\d\d\d\d\d?/, u = /\d{1,3}/, A = /\d{1,4}/, v = /[+-]?\d{1,6}/, q = /\d+/, w = /[+-]?\d+/, dy = /Z|[+-]\d\d:?\d\d/gi, J = /Z|[+-]\d\d(?::?\d\d)?/gi, aw = /[+-]?\d+(\.\d{1,3})?/, r = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, ax;
    ax = {};
    function b(b, a, c) {
        ax[b] = dd(a) ? a : function(b, d) {
            return b && c ? c : a;
        };
    }
    function dz(a, b) {
        if (!c$(ax, a)) {
            return new RegExp(dA(a));
        }
        return ax[a](b._strict, b._locale);
    }
    function dA(a) {
        return dB(a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, a, b, c, d) {
            return a || b || c || d;
        }));
    }
    function dB(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    var dC = {};
    function g(a, c) {
        var b, d = c;
        if (typeof a === "string") {
            a = [
                a
            ];
        }
        if (c1(c)) {
            d = function(a, b) {
                b[c] = dv(a);
            };
        }
        for(b = 0; b < a.length; b++){
            dC[a[b]] = d;
        }
    }
    function s(a, b) {
        g(a, function(c, e, a, d) {
            a._w = a._w || {};
            b(c, a._w, a, d);
        });
    }
    function dD(a, b, c) {
        if (b != null && c$(dC, a)) {
            dC[a](b, c._a, c, a);
        }
    }
    var K = 0, dE = 1, ay = 2, az = 3, aA = 4, aB = 5, dF = 6, dG = 7, dH = 8;
    function dI(b, a) {
        return ((b % a) + a) % a;
    }
    var L;
    if (Array.prototype.indexOf) {
        L = Array.prototype.indexOf;
    } else {
        L = function(b) {
            var a;
            for(a = 0; a < this.length; ++a){
                if (this[a] === b) {
                    return a;
                }
            }
            return -1;
        };
    }
    function dJ(a, b) {
        if (isNaN(a) || isNaN(b)) {
            return NaN;
        }
        var c = dI(b, 12);
        a += (b - c) / 12;
        return c === 1 ? dt(a) ? 29 : 28 : 31 - ((c % 7) % 2);
    }
    c("M", [
        "MM",
        2
    ], "Mo", function() {
        return this.month() + 1;
    });
    c("MMM", 0, 0, function(a) {
        return this.localeData().monthsShort(this, a);
    });
    c("MMMM", 0, 0, function(a) {
        return this.localeData().months(this, a);
    });
    i("month", "M");
    j("month", 8);
    b("M", h);
    b("MM", h, k);
    b("MMM", function(a, b) {
        return b.monthsShortRegex(a);
    });
    b("MMMM", function(a, b) {
        return b.monthsRegex(a);
    });
    g([
        "M",
        "MM"
    ], function(a, b) {
        b[dE] = dv(a) - 1;
    });
    g([
        "MMM",
        "MMMM"
    ], function(b, d, a, e) {
        var c = a._locale.monthsParse(b, e, a._strict);
        if (c != null) {
            d[dE] = c;
        } else {
            c5(a).invalidMonth = b;
        }
    });
    var aC = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), aD = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), dK = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, dL = r, dM = r;
    function aE(a, b) {
        if (!a) {
            return cY(this._months) ? this._months : this._months["standalone"];
        }
        return cY(this._months) ? this._months[a.month()] : this._months[(this._months.isFormat || dK).test(b) ? "format" : "standalone"][a.month()];
    }
    function aF(a, b) {
        if (!a) {
            return cY(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return cY(this._monthsShort) ? this._monthsShort[a.month()] : this._monthsShort[dK.test(b) ? "format" : "standalone"][a.month()];
    }
    function dN(f, e, g) {
        var b, a, d, c = f.toLocaleLowerCase();
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for(b = 0; b < 12; ++b){
                d = ab([
                    2000,
                    b
                ]);
                this._shortMonthsParse[b] = this.monthsShort(d, "").toLocaleLowerCase();
                this._longMonthsParse[b] = this.months(d, "").toLocaleLowerCase();
            }
        }
        if (g) {
            if (e === "MMM") {
                a = L.call(this._shortMonthsParse, c);
                return a !== -1 ? a : null;
            } else {
                a = L.call(this._longMonthsParse, c);
                return a !== -1 ? a : null;
            }
        } else {
            if (e === "MMM") {
                a = L.call(this._shortMonthsParse, c);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._longMonthsParse, c);
                return a !== -1 ? a : null;
            } else {
                a = L.call(this._longMonthsParse, c);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._shortMonthsParse, c);
                return a !== -1 ? a : null;
            }
        }
    }
    function aG(d, e, b) {
        var a, c, f;
        if (this._monthsParseExact) {
            return dN.call(this, d, e, b);
        }
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for(a = 0; a < 12; a++){
            c = ab([
                2000,
                a
            ]);
            if (b && !this._longMonthsParse[a]) {
                this._longMonthsParse[a] = new RegExp("^" + this.months(c, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[a] = new RegExp("^" + this.monthsShort(c, "").replace(".", "") + "$", "i");
            }
            if (!b && !this._monthsParse[a]) {
                f = "^" + this.months(c, "") + "|^" + this.monthsShort(c, "");
                this._monthsParse[a] = new RegExp(f.replace(".", ""), "i");
            }
            if (b && e === "MMMM" && this._longMonthsParse[a].test(d)) {
                return a;
            } else if (b && e === "MMM" && this._shortMonthsParse[a].test(d)) {
                return a;
            } else if (!b && this._monthsParse[a].test(d)) {
                return a;
            }
        }
    }
    function dO(a, b) {
        var c;
        if (!a.isValid()) {
            return a;
        }
        if (typeof b === "string") {
            if (/^\d+$/.test(b)) {
                b = dv(b);
            } else {
                b = a.localeData().monthsParse(b);
                if (!c1(b)) {
                    return a;
                }
            }
        }
        c = Math.min(a.date(), dJ(a.year(), b));
        a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c);
        return a;
    }
    function M(a) {
        if (a != null) {
            dO(this, a);
            d.updateOffset(this, true);
            return this;
        } else {
            return dw(this, "Month");
        }
    }
    function aH() {
        return dJ(this.year(), this.month());
    }
    function aI(a) {
        if (this._monthsParseExact) {
            if (!c$(this, "_monthsRegex")) {
                dP.call(this);
            }
            if (a) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!c$(this, "_monthsShortRegex")) {
                this._monthsShortRegex = dL;
            }
            return this._monthsShortStrictRegex && a ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }
    function aJ(a) {
        if (this._monthsParseExact) {
            if (!c$(this, "_monthsRegex")) {
                dP.call(this);
            }
            if (a) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!c$(this, "_monthsRegex")) {
                this._monthsRegex = dM;
            }
            return this._monthsStrictRegex && a ? this._monthsStrictRegex : this._monthsRegex;
        }
    }
    function dP() {
        function f(a, b) {
            return b.length - a.length;
        }
        var c = [], d = [], b = [], a, e;
        for(a = 0; a < 12; a++){
            e = ab([
                2000,
                a
            ]);
            c.push(this.monthsShort(e, ""));
            d.push(this.months(e, ""));
            b.push(this.months(e, ""));
            b.push(this.monthsShort(e, ""));
        }
        c.sort(f);
        d.sort(f);
        b.sort(f);
        for(a = 0; a < 12; a++){
            c[a] = dB(c[a]);
            d[a] = dB(d[a]);
        }
        for(a = 0; a < 24; a++){
            b[a] = dB(b[a]);
        }
        this._monthsRegex = new RegExp("^(" + b.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + d.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + c.join("|") + ")", "i");
    }
    c("Y", 0, 0, function() {
        var a = this.year();
        return a <= 9999 ? df(a, 4) : "+" + a;
    });
    c(0, [
        "YY",
        2
    ], 0, function() {
        return this.year() % 100;
    });
    c(0, [
        "YYYY",
        4
    ], 0, "year");
    c(0, [
        "YYYYY",
        5
    ], 0, "year");
    c(0, [
        "YYYYYY",
        6,
        true
    ], 0, "year");
    i("year", "y");
    j("year", 1);
    b("Y", w);
    b("YY", h, k);
    b("YYYY", A, z);
    b("YYYYY", v, t);
    b("YYYYYY", v, t);
    g([
        "YYYYY",
        "YYYYYY"
    ], K);
    g("YYYY", function(a, b) {
        b[K] = a.length === 2 ? d.parseTwoDigitYear(a) : dv(a);
    });
    g("YY", function(a, b) {
        b[K] = d.parseTwoDigitYear(a);
    });
    g("Y", function(a, b) {
        b[K] = parseInt(a, 10);
    });
    function dQ(a) {
        return dt(a) ? 366 : 365;
    }
    d.parseTwoDigitYear = function(a) {
        return dv(a) + (dv(a) > 68 ? 1900 : 2000);
    };
    var N = p("FullYear", true);
    function aK() {
        return dt(this.year());
    }
    function dR(a, c, d, e, f, g, h) {
        var b;
        if (a < 100 && a >= 0) {
            b = new Date(a + 400, c, d, e, f, g, h);
            if (isFinite(b.getFullYear())) {
                b.setFullYear(a);
            }
        } else {
            b = new Date(a, c, d, e, f, g, h);
        }
        return b;
    }
    function dS(b) {
        var a, c;
        if (b < 100 && b >= 0) {
            c = Array.prototype.slice.call(arguments);
            c[0] = b + 400;
            a = new Date(Date.UTC.apply(null, c));
            if (isFinite(a.getUTCFullYear())) {
                a.setUTCFullYear(b);
            }
        } else {
            a = new Date(Date.UTC.apply(null, arguments));
        }
        return a;
    }
    function dT(c, a, d) {
        var b = 7 + a - d, e = (7 + dS(c, 0, b).getUTCDay() - a) % 7;
        return -e + b - 1;
    }
    function dU(a, f, g, e, h) {
        var i = (7 + g - e) % 7, j = dT(a, e, h), b = 1 + 7 * (f - 1) + i + j, c, d;
        if (b <= 0) {
            c = a - 1;
            d = dQ(c) + b;
        } else if (b > dQ(a)) {
            c = a + 1;
            d = b - dQ(a);
        } else {
            c = a;
            d = b;
        }
        return {
            year: c,
            dayOfYear: d
        };
    }
    function dV(a, d, e) {
        var g = dT(a.year(), d, e), b = Math.floor((a.dayOfYear() - g - 1) / 7) + 1, f, c;
        if (b < 1) {
            c = a.year() - 1;
            f = b + dW(c, d, e);
        } else if (b > dW(a.year(), d, e)) {
            f = b - dW(a.year(), d, e);
            c = a.year() + 1;
        } else {
            c = a.year();
            f = b;
        }
        return {
            week: f,
            year: c
        };
    }
    function dW(a, b, c) {
        var d = dT(a, b, c), e = dT(a + 1, b, c);
        return (dQ(a) - d + e) / 7;
    }
    c("w", [
        "ww",
        2
    ], "wo", "week");
    c("W", [
        "WW",
        2
    ], "Wo", "isoWeek");
    i("week", "w");
    i("isoWeek", "W");
    j("week", 5);
    j("isoWeek", 5);
    b("w", h);
    b("ww", h, k);
    b("W", h);
    b("WW", h, k);
    s([
        "w",
        "ww",
        "W",
        "WW"
    ], function(a, b, d, c) {
        b[c.substr(0, 1)] = dv(a);
    });
    function aL(a) {
        return dV(a, this._week.dow, this._week.doy).week;
    }
    var aM = {
        dow: 0,
        doy: 6
    };
    function aN() {
        return this._week.dow;
    }
    function aO() {
        return this._week.doy;
    }
    function aP(a) {
        var b = this.localeData().week(this);
        return a == null ? b : this.add((a - b) * 7, "d");
    }
    function aQ(a) {
        var b = dV(this, 1, 4).week;
        return a == null ? b : this.add((a - b) * 7, "d");
    }
    c("d", 0, "do", "day");
    c("dd", 0, 0, function(a) {
        return this.localeData().weekdaysMin(this, a);
    });
    c("ddd", 0, 0, function(a) {
        return this.localeData().weekdaysShort(this, a);
    });
    c("dddd", 0, 0, function(a) {
        return this.localeData().weekdays(this, a);
    });
    c("e", 0, 0, "weekday");
    c("E", 0, 0, "isoWeekday");
    i("day", "d");
    i("weekday", "e");
    i("isoWeekday", "E");
    j("day", 11);
    j("weekday", 11);
    j("isoWeekday", 11);
    b("d", h);
    b("e", h);
    b("E", h);
    b("dd", function(a, b) {
        return b.weekdaysMinRegex(a);
    });
    b("ddd", function(a, b) {
        return b.weekdaysShortRegex(a);
    });
    b("dddd", function(a, b) {
        return b.weekdaysRegex(a);
    });
    s([
        "dd",
        "ddd",
        "dddd"
    ], function(b, d, a, e) {
        var c = a._locale.weekdaysParse(b, e, a._strict);
        if (c != null) {
            d.d = c;
        } else {
            c5(a).invalidWeekday = b;
        }
    });
    s([
        "d",
        "e",
        "E"
    ], function(a, b, d, c) {
        b[c] = dv(a);
    });
    function dX(a, b) {
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
    function dY(a, b) {
        if (typeof a === "string") {
            return b.weekdaysParse(a) % 7 || 7;
        }
        return isNaN(a) ? null : a;
    }
    function dZ(a, b) {
        return a.slice(b, 7).concat(a.slice(0, b));
    }
    var aR = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), aS = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), aT = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), d$ = r, d_ = r, d0 = r;
    function aU(a, c) {
        var b = cY(this._weekdays) ? this._weekdays : this._weekdays[a && a !== true && this._weekdays.isFormat.test(c) ? "format" : "standalone"];
        return a === true ? dZ(b, this._week.dow) : a ? b[a.day()] : b;
    }
    function aV(a) {
        return a === true ? dZ(this._weekdaysShort, this._week.dow) : a ? this._weekdaysShort[a.day()] : this._weekdaysShort;
    }
    function aW(a) {
        return a === true ? dZ(this._weekdaysMin, this._week.dow) : a ? this._weekdaysMin[a.day()] : this._weekdaysMin;
    }
    function d1(f, d, g) {
        var c, a, e, b = f.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];
            for(c = 0; c < 7; ++c){
                e = ab([
                    2000,
                    1
                ]).day(c);
                this._minWeekdaysParse[c] = this.weekdaysMin(e, "").toLocaleLowerCase();
                this._shortWeekdaysParse[c] = this.weekdaysShort(e, "").toLocaleLowerCase();
                this._weekdaysParse[c] = this.weekdays(e, "").toLocaleLowerCase();
            }
        }
        if (g) {
            if (d === "dddd") {
                a = L.call(this._weekdaysParse, b);
                return a !== -1 ? a : null;
            } else if (d === "ddd") {
                a = L.call(this._shortWeekdaysParse, b);
                return a !== -1 ? a : null;
            } else {
                a = L.call(this._minWeekdaysParse, b);
                return a !== -1 ? a : null;
            }
        } else {
            if (d === "dddd") {
                a = L.call(this._weekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._shortWeekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._minWeekdaysParse, b);
                return a !== -1 ? a : null;
            } else if (d === "ddd") {
                a = L.call(this._shortWeekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._weekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._minWeekdaysParse, b);
                return a !== -1 ? a : null;
            } else {
                a = L.call(this._minWeekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._weekdaysParse, b);
                if (a !== -1) {
                    return a;
                }
                a = L.call(this._shortWeekdaysParse, b);
                return a !== -1 ? a : null;
            }
        }
    }
    function aX(d, e, c) {
        var a, b, f;
        if (this._weekdaysParseExact) {
            return d1.call(this, d, e, c);
        }
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for(a = 0; a < 7; a++){
            b = ab([
                2000,
                1
            ]).day(a);
            if (c && !this._fullWeekdaysParse[a]) {
                this._fullWeekdaysParse[a] = new RegExp("^" + this.weekdays(b, "").replace(".", "\\.?") + "$", "i");
                this._shortWeekdaysParse[a] = new RegExp("^" + this.weekdaysShort(b, "").replace(".", "\\.?") + "$", "i");
                this._minWeekdaysParse[a] = new RegExp("^" + this.weekdaysMin(b, "").replace(".", "\\.?") + "$", "i");
            }
            if (!this._weekdaysParse[a]) {
                f = "^" + this.weekdays(b, "") + "|^" + this.weekdaysShort(b, "") + "|^" + this.weekdaysMin(b, "");
                this._weekdaysParse[a] = new RegExp(f.replace(".", ""), "i");
            }
            if (c && e === "dddd" && this._fullWeekdaysParse[a].test(d)) {
                return a;
            } else if (c && e === "ddd" && this._shortWeekdaysParse[a].test(d)) {
                return a;
            } else if (c && e === "dd" && this._minWeekdaysParse[a].test(d)) {
                return a;
            } else if (!c && this._weekdaysParse[a].test(d)) {
                return a;
            }
        }
    }
    function aY(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (a != null) {
            a = dX(a, this.localeData());
            return this.add(a - b, "d");
        } else {
            return b;
        }
    }
    function aZ(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        var b = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return a == null ? b : this.add(a - b, "d");
    }
    function a$(a) {
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        if (a != null) {
            var b = dY(a, this.localeData());
            return this.day(this.day() % 7 ? b : b - 7);
        } else {
            return this.day() || 7;
        }
    }
    function a_(a) {
        if (this._weekdaysParseExact) {
            if (!c$(this, "_weekdaysRegex")) {
                d2.call(this);
            }
            if (a) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!c$(this, "_weekdaysRegex")) {
                this._weekdaysRegex = d$;
            }
            return this._weekdaysStrictRegex && a ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }
    function a0(a) {
        if (this._weekdaysParseExact) {
            if (!c$(this, "_weekdaysRegex")) {
                d2.call(this);
            }
            if (a) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!c$(this, "_weekdaysShortRegex")) {
                this._weekdaysShortRegex = d_;
            }
            return this._weekdaysShortStrictRegex && a ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }
    function a1(a) {
        if (this._weekdaysParseExact) {
            if (!c$(this, "_weekdaysRegex")) {
                d2.call(this);
            }
            if (a) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!c$(this, "_weekdaysMinRegex")) {
                this._weekdaysMinRegex = d0;
            }
            return this._weekdaysMinStrictRegex && a ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }
    function d2() {
        function b(a, b) {
            return b.length - a.length;
        }
        var e = [], f = [], g = [], a = [], c, d, h, i, j;
        for(c = 0; c < 7; c++){
            d = ab([
                2000,
                1
            ]).day(c);
            h = dB(this.weekdaysMin(d, ""));
            i = dB(this.weekdaysShort(d, ""));
            j = dB(this.weekdays(d, ""));
            e.push(h);
            f.push(i);
            g.push(j);
            a.push(h);
            a.push(i);
            a.push(j);
        }
        e.sort(b);
        f.sort(b);
        g.sort(b);
        a.sort(b);
        this._weekdaysRegex = new RegExp("^(" + a.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + g.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + f.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + e.join("|") + ")", "i");
    }
    function a2() {
        return this.hours() % 12 || 12;
    }
    function a3() {
        return this.hours() || 24;
    }
    c("H", [
        "HH",
        2
    ], 0, "hour");
    c("h", [
        "hh",
        2
    ], 0, a2);
    c("k", [
        "kk",
        2
    ], 0, a3);
    c("hmm", 0, 0, function() {
        return "" + a2.apply(this) + df(this.minutes(), 2);
    });
    c("hmmss", 0, 0, function() {
        return ("" + a2.apply(this) + df(this.minutes(), 2) + df(this.seconds(), 2));
    });
    c("Hmm", 0, 0, function() {
        return "" + this.hours() + df(this.minutes(), 2);
    });
    c("Hmmss", 0, 0, function() {
        return ("" + this.hours() + df(this.minutes(), 2) + df(this.seconds(), 2));
    });
    function O(a, b) {
        c(a, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), b);
        });
    }
    O("a", true);
    O("A", false);
    i("hour", "h");
    j("hour", 13);
    function P(b, a) {
        return a._meridiemParse;
    }
    b("a", P);
    b("A", P);
    b("H", h);
    b("h", h);
    b("k", h);
    b("HH", h, k);
    b("hh", h, k);
    b("kk", h, k);
    b("hmm", H);
    b("hmmss", I);
    b("Hmm", H);
    b("Hmmss", I);
    g([
        "H",
        "HH"
    ], az);
    g([
        "k",
        "kk"
    ], function(b, c, d) {
        var a = dv(b);
        c[az] = a === 24 ? 0 : a;
    });
    g([
        "a",
        "A"
    ], function(b, c, a) {
        a._isPm = a._locale.isPM(b);
        a._meridiem = b;
    });
    g([
        "h",
        "hh"
    ], function(a, b, c) {
        b[az] = dv(a);
        c5(c).bigHour = true;
    });
    g("hmm", function(a, b, d) {
        var c = a.length - 2;
        b[az] = dv(a.substr(0, c));
        b[aA] = dv(a.substr(c));
        c5(d).bigHour = true;
    });
    g("hmmss", function(a, b, d) {
        var c = a.length - 4, e = a.length - 2;
        b[az] = dv(a.substr(0, c));
        b[aA] = dv(a.substr(c, 2));
        b[aB] = dv(a.substr(e));
        c5(d).bigHour = true;
    });
    g("Hmm", function(a, b, d) {
        var c = a.length - 2;
        b[az] = dv(a.substr(0, c));
        b[aA] = dv(a.substr(c));
    });
    g("Hmmss", function(a, b, e) {
        var c = a.length - 4, d = a.length - 2;
        b[az] = dv(a.substr(0, c));
        b[aA] = dv(a.substr(c, 2));
        b[aB] = dv(a.substr(d));
    });
    function a4(a) {
        return (a + "").toLowerCase().charAt(0) === "p";
    }
    var a5 = /[ap]\.?m?\.?/i, a6 = p("Hours", true);
    function a7(b, c, a) {
        if (b > 11) {
            return a ? "pm" : "PM";
        } else {
            return a ? "am" : "AM";
        }
    }
    var d3 = {
        calendar: ah,
        longDateFormat: aj,
        invalidDate: al,
        ordinal: an,
        dayOfMonthOrdinalParse: ao,
        relativeTime: aq,
        months: aC,
        monthsShort: aD,
        week: aM,
        weekdays: aR,
        weekdaysMin: aT,
        weekdaysShort: aS,
        meridiemParse: a5
    };
    var d4 = {}, d5 = {}, d6;
    function d7(b, c) {
        var a, d = Math.min(b.length, c.length);
        for(a = 0; a < d; a += 1){
            if (b[a] !== c[a]) {
                return a;
            }
        }
        return d;
    }
    function d8(a) {
        return a ? a.toLowerCase().replace("_", "-") : a;
    }
    function d9(e) {
        var c = 0, b, a, f, d;
        while(c < e.length){
            d = d8(e[c]).split("-");
            b = d.length;
            a = d8(e[c + 1]);
            a = a ? a.split("-") : null;
            while(b > 0){
                f = ea(d.slice(0, b).join("-"));
                if (f) {
                    return f;
                }
                if (a && a.length >= b && d7(d, a) >= b - 1) {
                    break;
                }
                b--;
            }
            c++;
        }
        return d6;
    }
    function ea(a) {
        var b = null, c;
        if (d4[a] === undefined && typeof module !== "undefined" && module && module.exports) {
            try {
                b = d6._abbr;
                c = require;
                c("./locale/" + a);
                B(b);
            } catch (d) {
                d4[a] = null;
            }
        }
        return d4[a];
    }
    function B(a, c) {
        var b;
        if (a) {
            if (c0(c)) {
                b = Q(a);
            } else {
                b = a8(a, c);
            }
            if (b) {
                d6 = b;
            } else {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Locale " + a + " not found. Did you forget to load it?");
                }
            }
        }
        return d6._abbr;
    }
    function a8(b, a) {
        if (a !== null) {
            var d, c = d3;
            a.abbr = b;
            if (d4[b] != null) {
                dc("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change " + "an existing locale. moment.defineLocale(localeName, " + "config) should only be used for creating a new locale " + "See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
                c = d4[b]._config;
            } else if (a.parentLocale != null) {
                if (d4[a.parentLocale] != null) {
                    c = d4[a.parentLocale]._config;
                } else {
                    d = ea(a.parentLocale);
                    if (d != null) {
                        c = d._config;
                    } else {
                        if (!d5[a.parentLocale]) {
                            d5[a.parentLocale] = [];
                        }
                        d5[a.parentLocale].push({
                            name: b,
                            config: a
                        });
                        return null;
                    }
                }
            }
            d4[b] = new ag(de(c, a));
            if (d5[b]) {
                d5[b].forEach(function(a) {
                    a8(a.name, a.config);
                });
            }
            B(b);
            return d4[b];
        } else {
            delete d4[b];
            return null;
        }
    }
    function a9(a, b) {
        if (b != null) {
            var d, c, e = d3;
            if (d4[a] != null && d4[a].parentLocale != null) {
                d4[a].set(de(d4[a]._config, b));
            } else {
                c = ea(a);
                if (c != null) {
                    e = c._config;
                }
                b = de(e, b);
                if (c == null) {
                    b.abbr = a;
                }
                d = new ag(b);
                d.parentLocale = d4[a];
                d4[a] = d;
            }
            B(a);
        } else {
            if (d4[a] != null) {
                if (d4[a].parentLocale != null) {
                    d4[a] = d4[a].parentLocale;
                    if (a === B()) {
                        B(a);
                    }
                } else if (d4[a] != null) {
                    delete d4[a];
                }
            }
        }
        return d4[a];
    }
    function Q(a) {
        var b;
        if (a && a._locale && a._locale._abbr) {
            a = a._locale._abbr;
        }
        if (!a) {
            return d6;
        }
        if (!cY(a)) {
            b = ea(a);
            if (b) {
                return b;
            }
            a = [
                a
            ];
        }
        return d9(a);
    }
    function ba() {
        return E(d4);
    }
    function eb(c) {
        var b, a = c._a;
        if (a && c5(c).overflow === -2) {
            b = a[dE] < 0 || a[dE] > 11 ? dE : a[ay] < 1 || a[ay] > dJ(a[K], a[dE]) ? ay : a[az] < 0 || a[az] > 24 || (a[az] === 24 && (a[aA] !== 0 || a[aB] !== 0 || a[dF] !== 0)) ? az : a[aA] < 0 || a[aA] > 59 ? aA : a[aB] < 0 || a[aB] > 59 ? aB : a[dF] < 0 || a[dF] > 999 ? dF : -1;
            if (c5(c)._overflowDayOfYear && (b < K || b > ay)) {
                b = ay;
            }
            if (c5(c)._overflowWeeks && b === -1) {
                b = dG;
            }
            if (c5(c)._overflowWeekday && b === -1) {
                b = dH;
            }
            c5(c).overflow = b;
        }
        return c;
    }
    var ec = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ed = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ee = /Z|[+-]\d\d(?::?\d\d)?/, ef = [
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
    ], eg = [
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
    ], eh = /^\/?Date\((-?\d+)/i, ei = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, ej = {
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
    function ek(b) {
        var a, d, g = b._i, c = ec.exec(g) || ed.exec(g), h, f, e, i;
        if (c) {
            c5(b).iso = true;
            for(a = 0, d = ef.length; a < d; a++){
                if (ef[a][1].exec(c[1])) {
                    f = ef[a][0];
                    h = ef[a][2] !== false;
                    break;
                }
            }
            if (f == null) {
                b._isValid = false;
                return;
            }
            if (c[3]) {
                for(a = 0, d = eg.length; a < d; a++){
                    if (eg[a][1].exec(c[3])) {
                        e = (c[2] || " ") + eg[a][0];
                        break;
                    }
                }
                if (e == null) {
                    b._isValid = false;
                    return;
                }
            }
            if (!h && e != null) {
                b._isValid = false;
                return;
            }
            if (c[4]) {
                if (ee.exec(c[4])) {
                    i = "Z";
                } else {
                    b._isValid = false;
                    return;
                }
            }
            b._f = f + (e || "") + (i || "");
            ew(b);
        } else {
            b._isValid = false;
        }
    }
    function el(c, d, e, f, g, a) {
        var b = [
            em(c),
            aD.indexOf(d),
            parseInt(e, 10),
            parseInt(f, 10),
            parseInt(g, 10), 
        ];
        if (a) {
            b.push(parseInt(a, 10));
        }
        return b;
    }
    function em(b) {
        var a = parseInt(b, 10);
        if (a <= 49) {
            return 2000 + a;
        } else if (a <= 999) {
            return 1900 + a;
        }
        return a;
    }
    function en(a) {
        return a.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function eo(b, a, c) {
        if (b) {
            var d = aS.indexOf(b), e = new Date(a[0], a[1], a[2]).getDay();
            if (d !== e) {
                c5(c).weekdayMismatch = true;
                c._isValid = false;
                return false;
            }
        }
        return true;
    }
    function ep(a, d, e) {
        if (a) {
            return ej[a];
        } else if (d) {
            return 0;
        } else {
            var b = parseInt(e, 10), c = b % 100, f = (b - c) / 100;
            return f * 60 + c;
        }
    }
    function eq(a) {
        var b = ei.exec(en(a._i)), c;
        if (b) {
            c = el(b[4], b[3], b[2], b[5], b[6], b[7]);
            if (!eo(b[1], c, a)) {
                return;
            }
            a._a = c;
            a._tzm = ep(b[8], b[9], b[10]);
            a._d = dS.apply(null, a._a);
            a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm);
            c5(a).rfc2822 = true;
        } else {
            a._isValid = false;
        }
    }
    function er(a) {
        var b = eh.exec(a._i);
        if (b !== null) {
            a._d = new Date(+b[1]);
            return;
        }
        ek(a);
        if (a._isValid === false) {
            delete a._isValid;
        } else {
            return;
        }
        eq(a);
        if (a._isValid === false) {
            delete a._isValid;
        } else {
            return;
        }
        if (a._strict) {
            a._isValid = false;
        } else {
            d.createFromInputFallback(a);
        }
    }
    d.createFromInputFallback = l("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), " + "which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are " + "discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(a) {
        a._d = new Date(a._i + (a._useUTC ? " UTC" : ""));
    });
    function es(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }
    function et(b) {
        var a = new Date(d.now());
        if (b._useUTC) {
            return [
                a.getUTCFullYear(),
                a.getUTCMonth(),
                a.getUTCDate(), 
            ];
        }
        return [
            a.getFullYear(),
            a.getMonth(),
            a.getDate(), 
        ];
    }
    function eu(a) {
        var b, c, d = [], e, g, f;
        if (a._d) {
            return;
        }
        e = et(a);
        if (a._w && a._a[ay] == null && a._a[dE] == null) {
            ev(a);
        }
        if (a._dayOfYear != null) {
            f = es(a._a[K], e[K]);
            if (a._dayOfYear > dQ(f) || a._dayOfYear === 0) {
                c5(a)._overflowDayOfYear = true;
            }
            c = dS(f, 0, a._dayOfYear);
            a._a[dE] = c.getUTCMonth();
            a._a[ay] = c.getUTCDate();
        }
        for(b = 0; b < 3 && a._a[b] == null; ++b){
            a._a[b] = d[b] = e[b];
        }
        for(; b < 7; b++){
            a._a[b] = d[b] = a._a[b] == null ? (b === 2 ? 1 : 0) : a._a[b];
        }
        if (a._a[az] === 24 && a._a[aA] === 0 && a._a[aB] === 0 && a._a[dF] === 0) {
            a._nextDay = true;
            a._a[az] = 0;
        }
        a._d = (a._useUTC ? dS : dR).apply(null, d);
        g = a._useUTC ? a._d.getUTCDay() : a._d.getDay();
        if (a._tzm != null) {
            a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm);
        }
        if (a._nextDay) {
            a._a[az] = 24;
        }
        if (a._w && typeof a._w.d !== "undefined" && a._w.d !== g) {
            c5(a).weekdayMismatch = true;
        }
    }
    function ev(b) {
        var a, g, e, c, d, f, i, h, j;
        a = b._w;
        if (a.GG != null || a.W != null || a.E != null) {
            d = 1;
            f = 4;
            g = es(a.GG, b._a[K], dV(bb(), 1, 4).year);
            e = es(a.W, 1);
            c = es(a.E, 1);
            if (c < 1 || c > 7) {
                h = true;
            }
        } else {
            d = b._locale._week.dow;
            f = b._locale._week.doy;
            j = dV(bb(), d, f);
            g = es(a.gg, b._a[K], j.year);
            e = es(a.w, j.week);
            if (a.d != null) {
                c = a.d;
                if (c < 0 || c > 6) {
                    h = true;
                }
            } else if (a.e != null) {
                c = a.e + d;
                if (a.e < 0 || a.e > 6) {
                    h = true;
                }
            } else {
                c = d;
            }
        }
        if (e < 1 || e > dW(g, d, f)) {
            c5(b)._overflowWeeks = true;
        } else if (h != null) {
            c5(b)._overflowWeekday = true;
        } else {
            i = dU(g, e, c, d, f);
            b._a[K] = i.year;
            b._dayOfYear = i.dayOfYear;
        }
    }
    d.ISO_8601 = function() {};
    d.RFC_2822 = function() {};
    function ew(a) {
        if (a._f === d.ISO_8601) {
            ek(a);
            return;
        }
        if (a._f === d.RFC_2822) {
            eq(a);
            return;
        }
        a._a = [];
        c5(a).empty = true;
        var b = "" + a._i, f, c, g, e, h, k = b.length, j = 0, i;
        g = dn(a._f, a._locale).match(dg) || [];
        for(f = 0; f < g.length; f++){
            e = g[f];
            c = (b.match(dz(e, a)) || [])[0];
            if (c) {
                h = b.substr(0, b.indexOf(c));
                if (h.length > 0) {
                    c5(a).unusedInput.push(h);
                }
                b = b.slice(b.indexOf(c) + c.length);
                j += c.length;
            }
            if (dj[e]) {
                if (c) {
                    c5(a).empty = false;
                } else {
                    c5(a).unusedTokens.push(e);
                }
                dD(e, c, a);
            } else if (a._strict && !c) {
                c5(a).unusedTokens.push(e);
            }
        }
        c5(a).charsLeftOver = k - j;
        if (b.length > 0) {
            c5(a).unusedInput.push(b);
        }
        if (a._a[az] <= 12 && c5(a).bigHour === true && a._a[az] > 0) {
            c5(a).bigHour = undefined;
        }
        c5(a).parsedDateParts = a._a.slice(0);
        c5(a).meridiem = a._meridiem;
        a._a[az] = ex(a._locale, a._a[az], a._meridiem);
        i = c5(a).era;
        if (i !== null) {
            a._a[K] = a._locale.erasConvertYear(i, a._a[K]);
        }
        eu(a);
        eb(a);
    }
    function ex(b, a, c) {
        var d;
        if (c == null) {
            return a;
        }
        if (b.meridiemHour != null) {
            return b.meridiemHour(a, c);
        } else if (b.isPM != null) {
            d = b.isPM(c);
            if (d && a < 12) {
                a += 12;
            }
            if (!d && a === 12) {
                a = 0;
            }
            return a;
        } else {
            return a;
        }
    }
    function ey(b) {
        var a, g, d, e, c, f, h = false;
        if (b._f.length === 0) {
            c5(b).invalidFormat = true;
            b._d = new Date(NaN);
            return;
        }
        for(e = 0; e < b._f.length; e++){
            c = 0;
            f = false;
            a = c9({}, b);
            if (b._useUTC != null) {
                a._useUTC = b._useUTC;
            }
            a._f = b._f[e];
            ew(a);
            if (c6(a)) {
                f = true;
            }
            c += c5(a).charsLeftOver;
            c += c5(a).unusedTokens.length * 10;
            c5(a).score = c;
            if (!h) {
                if (d == null || c < d || f) {
                    d = c;
                    g = a;
                    if (f) {
                        h = true;
                    }
                }
            } else {
                if (c < d) {
                    d = c;
                    g = a;
                }
            }
        }
        c3(b, g || a);
    }
    function ez(b) {
        if (b._d) {
            return;
        }
        var a = dq(b._i), c = a.day === undefined ? a.date : a.day;
        b._a = c2([
            a.year,
            a.month,
            c,
            a.hour,
            a.minute,
            a.second,
            a.millisecond, 
        ], function(a) {
            return a && parseInt(a, 10);
        });
        eu(b);
    }
    function eA(b) {
        var a = new ad(eb(eB(b)));
        if (a._nextDay) {
            a.add(1, "d");
            a._nextDay = undefined;
        }
        return a;
    }
    function eB(a) {
        var b = a._i, c = a._f;
        a._locale = a._locale || Q(a._l);
        if (b === null || (c === undefined && b === "")) {
            return ac({
                nullInput: true
            });
        }
        if (typeof b === "string") {
            a._i = b = a._locale.preparse(b);
        }
        if (ae(b)) {
            return new ad(eb(b));
        } else if (aa(b)) {
            a._d = b;
        } else if (cY(c)) {
            ey(a);
        } else if (c) {
            ew(a);
        } else {
            eC(a);
        }
        if (!c6(a)) {
            a._d = null;
        }
        return a;
    }
    function eC(a) {
        var b = a._i;
        if (c0(b)) {
            a._d = new Date(d.now());
        } else if (aa(b)) {
            a._d = new Date(b.valueOf());
        } else if (typeof b === "string") {
            er(a);
        } else if (cY(b)) {
            a._a = c2(b.slice(0), function(a) {
                return parseInt(a, 10);
            });
            eu(a);
        } else if (cZ(b)) {
            ez(a);
        } else if (c1(b)) {
            a._d = new Date(b);
        } else {
            d.createFromInputFallback(a);
        }
    }
    function eD(b, c, d, e, f) {
        var a = {};
        if (c === true || c === false) {
            e = c;
            c = undefined;
        }
        if (d === true || d === false) {
            e = d;
            d = undefined;
        }
        if ((cZ(b) && c_(b)) || (cY(b) && b.length === 0)) {
            b = undefined;
        }
        a._isAMomentObject = true;
        a._useUTC = a._isUTC = f;
        a._l = d;
        a._i = b;
        a._f = c;
        a._strict = e;
        return eA(a);
    }
    function bb(a, b, c, d) {
        return eD(a, b, c, d, false);
    }
    var bc = l("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var a = bb.apply(null, arguments);
        if (this.isValid() && a.isValid()) {
            return a < this ? this : a;
        } else {
            return ac();
        }
    }), bd = l("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var a = bb.apply(null, arguments);
        if (this.isValid() && a.isValid()) {
            return a > this ? this : a;
        } else {
            return ac();
        }
    });
    function eE(d, a) {
        var c, b;
        if (a.length === 1 && cY(a[0])) {
            a = a[0];
        }
        if (!a.length) {
            return bb();
        }
        c = a[0];
        for(b = 1; b < a.length; ++b){
            if (!a[b].isValid() || a[b][d](c)) {
                c = a[b];
            }
        }
        return c;
    }
    function be() {
        var a = [].slice.call(arguments, 0);
        return eE("isBefore", a);
    }
    function bf() {
        var a = [].slice.call(arguments, 0);
        return eE("isAfter", a);
    }
    var bg = function() {
        return Date.now ? Date.now() : +new Date();
    };
    var eF = [
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
    function eG(a) {
        var c, d = false, b;
        for(c in a){
            if (c$(a, c) && !(L.call(eF, c) !== -1 && (a[c] == null || !isNaN(a[c])))) {
                return false;
            }
        }
        for(b = 0; b < eF.length; ++b){
            if (a[eF[b]]) {
                if (d) {
                    return false;
                }
                if (parseFloat(a[eF[b]]) !== dv(a[eF[b]])) {
                    d = true;
                }
            }
        }
        return true;
    }
    function bh() {
        return this._isValid;
    }
    function bi() {
        return C(NaN);
    }
    function R(b) {
        var a = dq(b), c = a.year || 0, d = a.quarter || 0, e = a.month || 0, f = a.week || a.isoWeek || 0, g = a.day || 0, h = a.hour || 0, i = a.minute || 0, j = a.second || 0, k = a.millisecond || 0;
        this._isValid = eG(a);
        this._milliseconds = +k + j * 1e3 + i * 6e4 + h * 1000 * 60 * 60;
        this._days = +g + f * 7;
        this._months = +e + d * 3 + c * 12;
        this._data = {};
        this._locale = Q();
        this._bubble();
    }
    function bj(a) {
        return a instanceof R;
    }
    function eH(a) {
        if (a < 0) {
            return Math.round(-1 * a) * -1;
        } else {
            return Math.round(a);
        }
    }
    function eI(b, c, d) {
        var f = Math.min(b.length, c.length), g = Math.abs(b.length - c.length), e = 0, a;
        for(a = 0; a < f; a++){
            if ((d && b[a] !== c[a]) || (!d && dv(b[a]) !== dv(c[a]))) {
                e++;
            }
        }
        return e + g;
    }
    function S(a, b) {
        c(a, 0, 0, function() {
            var a = this.utcOffset(), c = "+";
            if (a < 0) {
                a = -a;
                c = "-";
            }
            return (c + df(~~(a / 60), 2) + b + df(~~a % 60, 2));
        });
    }
    S("Z", ":");
    S("ZZ", "");
    b("Z", J);
    b("ZZ", J);
    g([
        "Z",
        "ZZ"
    ], function(b, c, a) {
        a._useUTC = true;
        a._tzm = eK(J, b);
    });
    var eJ = /([\+\-]|\d\d)/gi;
    function eK(e, f) {
        var c = (f || "").match(e), d, a, b;
        if (c === null) {
            return null;
        }
        d = c[c.length - 1] || [];
        a = (d + "").match(eJ) || [
            "-",
            0,
            0
        ];
        b = +(a[1] * 60) + dv(a[2]);
        return b === 0 ? 0 : a[0] === "+" ? b : -b;
    }
    function eL(b, c) {
        var a, e;
        if (c._isUTC) {
            a = c.clone();
            e = (ae(b) || aa(b) ? b.valueOf() : bb(b).valueOf()) - a.valueOf();
            a._d.setTime(a._d.valueOf() + e);
            d.updateOffset(a, false);
            return a;
        } else {
            return bb(b).local();
        }
    }
    function eM(a) {
        return -Math.round(a._d.getTimezoneOffset());
    }
    d.updateOffset = function() {};
    function bk(a, e, f) {
        var b = this._offset || 0, c;
        if (!this.isValid()) {
            return a != null ? this : NaN;
        }
        if (a != null) {
            if (typeof a === "string") {
                a = eK(J, a);
                if (a === null) {
                    return this;
                }
            } else if (Math.abs(a) < 16 && !f) {
                a = a * 60;
            }
            if (!this._isUTC && e) {
                c = eM(this);
            }
            this._offset = a;
            this._isUTC = true;
            if (c != null) {
                this.add(c, "m");
            }
            if (b !== a) {
                if (!e || this._changeInProgress) {
                    eS(this, C(a - b, "m"), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    d.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? b : eM(this);
        }
    }
    function bl(a, b) {
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
    function bm(a) {
        return this.utcOffset(0, a);
    }
    function bn(a) {
        if (this._isUTC) {
            this.utcOffset(0, a);
            this._isUTC = false;
            if (a) {
                this.subtract(eM(this), "m");
            }
        }
        return this;
    }
    function bo() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
            var a = eK(dy, this._i);
            if (a != null) {
                this.utcOffset(a);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }
    function bp(a) {
        if (!this.isValid()) {
            return false;
        }
        a = a ? bb(a).utcOffset() : 0;
        return (this.utcOffset() - a) % 60 === 0;
    }
    function bq() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }
    function br() {
        if (!c0(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var a = {}, b;
        c9(a, this);
        a = eB(a);
        if (a._a) {
            b = a._isUTC ? ab(a._a) : bb(a._a);
            this._isDSTShifted = this.isValid() && eI(a._a, b.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }
    function bs() {
        return this.isValid() ? !this._isUTC : false;
    }
    function bt() {
        return this.isValid() ? this._isUTC : false;
    }
    function T() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }
    var eN = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, eO = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function C(a, g) {
        var b = a, c = null, d, e, f;
        if (bj(a)) {
            b = {
                ms: a._milliseconds,
                d: a._days,
                M: a._months
            };
        } else if (c1(a) || !isNaN(+a)) {
            b = {};
            if (g) {
                b[g] = +a;
            } else {
                b.milliseconds = +a;
            }
        } else if ((c = eN.exec(a))) {
            d = c[1] === "-" ? -1 : 1;
            b = {
                y: 0,
                d: dv(c[ay]) * d,
                h: dv(c[az]) * d,
                m: dv(c[aA]) * d,
                s: dv(c[aB]) * d,
                ms: dv(eH(c[dF] * 1000)) * d
            };
        } else if ((c = eO.exec(a))) {
            d = c[1] === "-" ? -1 : 1;
            b = {
                y: eP(c[2], d),
                M: eP(c[3], d),
                w: eP(c[4], d),
                d: eP(c[5], d),
                h: eP(c[6], d),
                m: eP(c[7], d),
                s: eP(c[8], d)
            };
        } else if (b == null) {
            b = {};
        } else if (typeof b === "object" && ("from" in b || "to" in b)) {
            f = eR(bb(b.from), bb(b.to));
            b = {};
            b.ms = f.milliseconds;
            b.M = f.months;
        }
        e = new R(b);
        if (bj(a) && c$(a, "_locale")) {
            e._locale = a._locale;
        }
        if (bj(a) && c$(a, "_isValid")) {
            e._isValid = a._isValid;
        }
        return e;
    }
    C.fn = R.prototype;
    C.invalid = bi;
    function eP(a, c) {
        var b = a && parseFloat(a.replace(",", "."));
        return (isNaN(b) ? 0 : b) * c;
    }
    function eQ(b, c) {
        var a = {};
        a.months = c.month() - b.month() + (c.year() - b.year()) * 12;
        if (b.clone().add(a.months, "M").isAfter(c)) {
            --a.months;
        }
        a.milliseconds = +c - +b.clone().add(a.months, "M");
        return a;
    }
    function eR(c, b) {
        var a;
        if (!(c.isValid() && b.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }
        b = eL(b, c);
        if (c.isBefore(b)) {
            a = eQ(c, b);
        } else {
            a = eQ(b, c);
            a.milliseconds = -a.milliseconds;
            a.months = -a.months;
        }
        return a;
    }
    function U(a, b) {
        return function(d, c) {
            var e, f;
            if (c !== null && !isNaN(+c)) {
                dc(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period). " + "See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
                f = d;
                d = c;
                c = f;
            }
            e = C(d, c);
            eS(this, e, a);
            return this;
        };
    }
    function eS(a, c, e, b) {
        var h = c._milliseconds, f = eH(c._days), g = eH(c._months);
        if (!a.isValid()) {
            return;
        }
        b = b == null ? true : b;
        if (g) {
            dO(a, dw(a, "Month") + g * e);
        }
        if (f) {
            dx(a, "Date", dw(a, "Date") + f * e);
        }
        if (h) {
            a._d.setTime(a._d.valueOf() + h * e);
        }
        if (b) {
            d.updateOffset(a, f || g);
        }
    }
    var bu = U(1, "add"), bv = U(-1, "subtract");
    function eT(a) {
        return typeof a === "string" || a instanceof String;
    }
    function eU(a) {
        return (ae(a) || aa(a) || eT(a) || c1(a) || eW(a) || eV(a) || a === null || a === undefined);
    }
    function eV(b) {
        var f = cZ(b) && !c_(b), c = false, d = [
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
        ], a, e;
        for(a = 0; a < d.length; a += 1){
            e = d[a];
            c = c || c$(b, e);
        }
        return f && c;
    }
    function eW(a) {
        var b = cY(a), c = false;
        if (b) {
            c = a.filter(function(b) {
                return !c1(b) && eT(a);
            }).length === 0;
        }
        return b && c;
    }
    function eX(b) {
        var f = cZ(b) && !c_(b), c = false, d = [
            "sameDay",
            "nextDay",
            "lastDay",
            "nextWeek",
            "lastWeek",
            "sameElse", 
        ], a, e;
        for(a = 0; a < d.length; a += 1){
            e = d[a];
            c = c || c$(b, e);
        }
        return f && c;
    }
    function bw(b, c) {
        var a = b.diff(c, "days", true);
        return a < -6 ? "sameElse" : a < -1 ? "lastWeek" : a < 0 ? "lastDay" : a < 1 ? "sameDay" : a < 2 ? "nextDay" : a < 7 ? "nextWeek" : "sameElse";
    }
    function bx(b, a) {
        if (arguments.length === 1) {
            if (!arguments[0]) {
                b = undefined;
                a = undefined;
            } else if (eU(arguments[0])) {
                b = arguments[0];
                a = undefined;
            } else if (eX(arguments[0])) {
                a = arguments[0];
                b = undefined;
            }
        }
        var e = b || bb(), f = eL(e, this).startOf("day"), c = d.calendarFormat(this, f) || "sameElse", g = a && (dd(a[c]) ? a[c].call(this, e) : a[c]);
        return this.format(g || this.localeData().calendar(c, this, bb(e)));
    }
    function by() {
        return new ad(this);
    }
    function bz(b, a) {
        var c = ae(b) ? b : bb(b);
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        a = at(a) || "millisecond";
        if (a === "millisecond") {
            return this.valueOf() > c.valueOf();
        } else {
            return c.valueOf() < this.clone().startOf(a).valueOf();
        }
    }
    function bA(b, a) {
        var c = ae(b) ? b : bb(b);
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        a = at(a) || "millisecond";
        if (a === "millisecond") {
            return this.valueOf() < c.valueOf();
        } else {
            return this.clone().endOf(a).valueOf() < c.valueOf();
        }
    }
    function bB(c, d, a, b) {
        var e = ae(c) ? c : bb(c), f = ae(d) ? d : bb(d);
        if (!(this.isValid() && e.isValid() && f.isValid())) {
            return false;
        }
        b = b || "()";
        return ((b[0] === "(" ? this.isAfter(e, a) : !this.isBefore(e, a)) && (b[1] === ")" ? this.isBefore(f, a) : !this.isAfter(f, a)));
    }
    function bC(b, a) {
        var c = ae(b) ? b : bb(b), d;
        if (!(this.isValid() && c.isValid())) {
            return false;
        }
        a = at(a) || "millisecond";
        if (a === "millisecond") {
            return this.valueOf() === c.valueOf();
        } else {
            d = c.valueOf();
            return (this.clone().startOf(a).valueOf() <= d && d <= this.clone().endOf(a).valueOf());
        }
    }
    function bD(a, b) {
        return this.isSame(a, b) || this.isAfter(a, b);
    }
    function bE(a, b) {
        return this.isSame(a, b) || this.isBefore(a, b);
    }
    function bF(e, c, f) {
        var a, d, b;
        if (!this.isValid()) {
            return NaN;
        }
        a = eL(e, this);
        if (!a.isValid()) {
            return NaN;
        }
        d = (a.utcOffset() - this.utcOffset()) * 6e4;
        c = at(c);
        switch(c){
            case "year":
                b = eY(this, a) / 12;
                break;
            case "month":
                b = eY(this, a);
                break;
            case "quarter":
                b = eY(this, a) / 3;
                break;
            case "second":
                b = (this - a) / 1e3;
                break;
            case "minute":
                b = (this - a) / 6e4;
                break;
            case "hour":
                b = (this - a) / 36e5;
                break;
            case "day":
                b = (this - a - d) / 864e5;
                break;
            case "week":
                b = (this - a - d) / 6048e5;
                break;
            default:
                b = this - a;
        }
        return f ? b : du(b);
    }
    function eY(a, b) {
        if (a.date() < b.date()) {
            return -eY(b, a);
        }
        var d = (b.year() - a.year()) * 12 + (b.month() - a.month()), c = a.clone().add(d, "months"), e, f;
        if (b - c < 0) {
            e = a.clone().add(d - 1, "months");
            f = (b - c) / (c - e);
        } else {
            e = a.clone().add(d + 1, "months");
            f = (b - c) / (e - c);
        }
        return -(d + f) || 0;
    }
    d.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    d.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    function bG() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function bH(c) {
        if (!this.isValid()) {
            return null;
        }
        var b = c !== true, a = b ? this.clone().utc() : this;
        if (a.year() < 0 || a.year() > 9999) {
            return dm(a, b ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        }
        if (dd(Date.prototype.toISOString)) {
            if (b) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace("Z", dm(a, "Z"));
            }
        }
        return dm(a, b ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function bI() {
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
    function bJ(a) {
        if (!a) {
            a = this.isUtc() ? d.defaultFormatUtc : d.defaultFormat;
        }
        var b = dm(this, a);
        return this.localeData().postformat(b);
    }
    function bK(a, b) {
        if (this.isValid() && ((ae(a) && a.isValid()) || bb(a).isValid())) {
            return C({
                to: this,
                from: a
            }).locale(this.locale()).humanize(!b);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function bL(a) {
        return this.from(bb(), a);
    }
    function bM(a, b) {
        if (this.isValid() && ((ae(a) && a.isValid()) || bb(a).isValid())) {
            return C({
                from: this,
                to: a
            }).locale(this.locale()).humanize(!b);
        } else {
            return this.localeData().invalidDate();
        }
    }
    function bN(a) {
        return this.to(bb(), a);
    }
    function V(b) {
        var a;
        if (b === undefined) {
            return this._locale._abbr;
        } else {
            a = Q(b);
            if (a != null) {
                this._locale = a;
            }
            return this;
        }
    }
    var W = l("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(a) {
        if (a === undefined) {
            return this.localeData();
        } else {
            return this.locale(a);
        }
    });
    function X() {
        return this._locale;
    }
    var bO = 1000, bP = 60 * bO, bQ = 60 * bP, eZ = (365 * 400 + 97) * 24 * bQ;
    function e$(b, a) {
        return ((b % a) + a) % a;
    }
    function e_(a, b, c) {
        if (a < 100 && a >= 0) {
            return new Date(a + 400, b, c) - eZ;
        } else {
            return new Date(a, b, c).valueOf();
        }
    }
    function e0(a, b, c) {
        if (a < 100 && a >= 0) {
            return Date.UTC(a + 400, b, c) - eZ;
        } else {
            return Date.UTC(a, b, c);
        }
    }
    function bR(c) {
        var a, b;
        c = at(c);
        if (c === undefined || c === "millisecond" || !this.isValid()) {
            return this;
        }
        b = this._isUTC ? e0 : e_;
        switch(c){
            case "year":
                a = b(this.year(), 0, 1);
                break;
            case "quarter":
                a = b(this.year(), this.month() - (this.month() % 3), 1);
                break;
            case "month":
                a = b(this.year(), this.month(), 1);
                break;
            case "week":
                a = b(this.year(), this.month(), this.date() - this.weekday());
                break;
            case "isoWeek":
                a = b(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case "day":
            case "date":
                a = b(this.year(), this.month(), this.date());
                break;
            case "hour":
                a = this._d.valueOf();
                a -= e$(a + (this._isUTC ? 0 : this.utcOffset() * bP), bQ);
                break;
            case "minute":
                a = this._d.valueOf();
                a -= e$(a, bP);
                break;
            case "second":
                a = this._d.valueOf();
                a -= e$(a, bO);
                break;
        }
        this._d.setTime(a);
        d.updateOffset(this, true);
        return this;
    }
    function bS(c) {
        var a, b;
        c = at(c);
        if (c === undefined || c === "millisecond" || !this.isValid()) {
            return this;
        }
        b = this._isUTC ? e0 : e_;
        switch(c){
            case "year":
                a = b(this.year() + 1, 0, 1) - 1;
                break;
            case "quarter":
                a = b(this.year(), this.month() - (this.month() % 3) + 3, 1) - 1;
                break;
            case "month":
                a = b(this.year(), this.month() + 1, 1) - 1;
                break;
            case "week":
                a = b(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case "isoWeek":
                a = b(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case "day":
            case "date":
                a = b(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case "hour":
                a = this._d.valueOf();
                a += bQ - e$(a + (this._isUTC ? 0 : this.utcOffset() * bP), bQ) - 1;
                break;
            case "minute":
                a = this._d.valueOf();
                a += bP - e$(a, bP) - 1;
                break;
            case "second":
                a = this._d.valueOf();
                a += bO - e$(a, bO) - 1;
                break;
        }
        this._d.setTime(a);
        d.updateOffset(this, true);
        return this;
    }
    function bT() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }
    function bU() {
        return Math.floor(this.valueOf() / 1000);
    }
    function bV() {
        return new Date(this.valueOf());
    }
    function bW() {
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
    function bX() {
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
    function bY() {
        return this.isValid() ? this.toISOString() : null;
    }
    function bZ() {
        return c6(this);
    }
    function b$() {
        return c3({}, c5(this));
    }
    function b_() {
        return c5(this).overflow;
    }
    function b0() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    c("N", 0, 0, "eraAbbr");
    c("NN", 0, 0, "eraAbbr");
    c("NNN", 0, 0, "eraAbbr");
    c("NNNN", 0, 0, "eraName");
    c("NNNNN", 0, 0, "eraNarrow");
    c("y", [
        "y",
        1
    ], "yo", "eraYear");
    c("y", [
        "yy",
        2
    ], 0, "eraYear");
    c("y", [
        "yyy",
        3
    ], 0, "eraYear");
    c("y", [
        "yyyy",
        4
    ], 0, "eraYear");
    b("N", e1);
    b("NN", e1);
    b("NNN", e1);
    b("NNNN", e2);
    b("NNNNN", e3);
    g([
        "N",
        "NN",
        "NNN",
        "NNNN",
        "NNNNN"
    ], function(b, e, a, d) {
        var c = a._locale.erasParse(b, d, a._strict);
        if (c) {
            c5(a).era = c;
        } else {
            c5(a).invalidEra = b;
        }
    });
    b("y", q);
    b("yy", q);
    b("yyy", q);
    b("yyyy", q);
    b("yo", e4);
    g([
        "y",
        "yy",
        "yyy",
        "yyyy"
    ], K);
    g([
        "yo"
    ], function(b, c, a, e) {
        var d;
        if (a._locale._eraYearOrdinalRegex) {
            d = b.match(a._locale._eraYearOrdinalRegex);
        }
        if (a._locale.eraYearOrdinalParse) {
            c[K] = a._locale.eraYearOrdinalParse(b, d);
        } else {
            c[K] = parseInt(b, 10);
        }
    });
    function b1(f, g) {
        var a, e, c, b = this._eras || Q("en")._eras;
        for(a = 0, e = b.length; a < e; ++a){
            switch(typeof b[a].since){
                case "string":
                    c = d(b[a].since).startOf("day");
                    b[a].since = c.valueOf();
                    break;
            }
            switch(typeof b[a].until){
                case "undefined":
                    b[a].until = +Infinity;
                    break;
                case "string":
                    c = d(b[a].until).startOf("day").valueOf();
                    b[a].until = c.valueOf();
                    break;
            }
        }
        return b;
    }
    function b2(c, h, i) {
        var a, g, b = this.eras(), d, e, f;
        c = c.toUpperCase();
        for(a = 0, g = b.length; a < g; ++a){
            d = b[a].name.toUpperCase();
            e = b[a].abbr.toUpperCase();
            f = b[a].narrow.toUpperCase();
            if (i) {
                switch(h){
                    case "N":
                    case "NN":
                    case "NNN":
                        if (e === c) {
                            return b[a];
                        }
                        break;
                    case "NNNN":
                        if (d === c) {
                            return b[a];
                        }
                        break;
                    case "NNNNN":
                        if (f === c) {
                            return b[a];
                        }
                        break;
                }
            } else if ([
                d,
                e,
                f
            ].indexOf(c) >= 0) {
                return b[a];
            }
        }
    }
    function b3(a, b) {
        var c = a.since <= a.until ? +1 : -1;
        if (b === undefined) {
            return d(a.since).year();
        } else {
            return d(a.since).year() + (b - a.offset) * c;
        }
    }
    function b4() {
        var a, d, c, b = this.localeData().eras();
        for(a = 0, d = b.length; a < d; ++a){
            c = this.clone().startOf("day").valueOf();
            if (b[a].since <= c && c <= b[a].until) {
                return b[a].name;
            }
            if (b[a].until <= c && c <= b[a].since) {
                return b[a].name;
            }
        }
        return "";
    }
    function b5() {
        var a, d, c, b = this.localeData().eras();
        for(a = 0, d = b.length; a < d; ++a){
            c = this.clone().startOf("day").valueOf();
            if (b[a].since <= c && c <= b[a].until) {
                return b[a].narrow;
            }
            if (b[a].until <= c && c <= b[a].since) {
                return b[a].narrow;
            }
        }
        return "";
    }
    function b6() {
        var a, d, c, b = this.localeData().eras();
        for(a = 0, d = b.length; a < d; ++a){
            c = this.clone().startOf("day").valueOf();
            if (b[a].since <= c && c <= b[a].until) {
                return b[a].abbr;
            }
            if (b[a].until <= c && c <= b[a].since) {
                return b[a].abbr;
            }
        }
        return "";
    }
    function b7() {
        var a, e, f, c, b = this.localeData().eras();
        for(a = 0, e = b.length; a < e; ++a){
            f = b[a].since <= b[a].until ? +1 : -1;
            c = this.clone().startOf("day").valueOf();
            if ((b[a].since <= c && c <= b[a].until) || (b[a].until <= c && c <= b[a].since)) {
                return ((this.year() - d(b[a].since).year()) * f + b[a].offset);
            }
        }
        return this.year();
    }
    function b8(a) {
        if (!c$(this, "_erasNameRegex")) {
            e5.call(this);
        }
        return a ? this._erasNameRegex : this._erasRegex;
    }
    function b9(a) {
        if (!c$(this, "_erasAbbrRegex")) {
            e5.call(this);
        }
        return a ? this._erasAbbrRegex : this._erasRegex;
    }
    function ca(a) {
        if (!c$(this, "_erasNarrowRegex")) {
            e5.call(this);
        }
        return a ? this._erasNarrowRegex : this._erasRegex;
    }
    function e1(a, b) {
        return b.erasAbbrRegex(a);
    }
    function e2(a, b) {
        return b.erasNameRegex(a);
    }
    function e3(a, b) {
        return b.erasNarrowRegex(a);
    }
    function e4(b, a) {
        return a._eraYearOrdinalRegex || q;
    }
    function e5() {
        var d = [], e = [], f = [], c = [], a, g, b = this.eras();
        for(a = 0, g = b.length; a < g; ++a){
            e.push(dB(b[a].name));
            d.push(dB(b[a].abbr));
            f.push(dB(b[a].narrow));
            c.push(dB(b[a].name));
            c.push(dB(b[a].abbr));
            c.push(dB(b[a].narrow));
        }
        this._erasRegex = new RegExp("^(" + c.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + e.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + d.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + f.join("|") + ")", "i");
    }
    c(0, [
        "gg",
        2
    ], 0, function() {
        return this.weekYear() % 100;
    });
    c(0, [
        "GG",
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    function x(a, b) {
        c(0, [
            a,
            a.length
        ], 0, b);
    }
    x("gggg", "weekYear");
    x("ggggg", "weekYear");
    x("GGGG", "isoWeekYear");
    x("GGGGG", "isoWeekYear");
    i("weekYear", "gg");
    i("isoWeekYear", "GG");
    j("weekYear", 1);
    j("isoWeekYear", 1);
    b("G", w);
    b("g", w);
    b("GG", h, k);
    b("gg", h, k);
    b("GGGG", A, z);
    b("gggg", A, z);
    b("GGGGG", v, t);
    b("ggggg", v, t);
    s([
        "gggg",
        "ggggg",
        "GGGG",
        "GGGGG"
    ], function(a, b, d, c) {
        b[c.substr(0, 2)] = dv(a);
    });
    s([
        "gg",
        "GG"
    ], function(a, b, e, c) {
        b[c] = d.parseTwoDigitYear(a);
    });
    function cb(a) {
        return e6.call(this, a, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function cc(a) {
        return e6.call(this, a, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function cd() {
        return dW(this.year(), 1, 4);
    }
    function ce() {
        return dW(this.isoWeekYear(), 1, 4);
    }
    function cf() {
        var a = this.localeData()._week;
        return dW(this.year(), a.dow, a.doy);
    }
    function cg() {
        var a = this.localeData()._week;
        return dW(this.weekYear(), a.dow, a.doy);
    }
    function e6(a, b, f, c, d) {
        var e;
        if (a == null) {
            return dV(this, c, d).year;
        } else {
            e = dW(a, c, d);
            if (b > e) {
                b = e;
            }
            return e7.call(this, a, b, f, c, d);
        }
    }
    function e7(c, d, e, f, g) {
        var b = dU(c, d, e, f, g), a = dS(b.year, 0, b.dayOfYear);
        this.year(a.getUTCFullYear());
        this.month(a.getUTCMonth());
        this.date(a.getUTCDate());
        return this;
    }
    c("Q", 0, "Qo", "quarter");
    i("quarter", "Q");
    j("quarter", 7);
    b("Q", F);
    g("Q", function(a, b) {
        b[dE] = (dv(a) - 1) * 3;
    });
    function ch(a) {
        return a == null ? Math.ceil((this.month() + 1) / 3) : this.month((a - 1) * 3 + (this.month() % 3));
    }
    c("D", [
        "DD",
        2
    ], "Do", "date");
    i("date", "D");
    j("date", 9);
    b("D", h);
    b("DD", h, k);
    b("Do", function(b, a) {
        return b ? a._dayOfMonthOrdinalParse || a._ordinalParse : a._dayOfMonthOrdinalParseLenient;
    });
    g([
        "D",
        "DD"
    ], ay);
    g("Do", function(a, b) {
        b[ay] = dv(a.match(h)[0]);
    });
    var Y = p("Date", true);
    c("DDD", [
        "DDDD",
        3
    ], "DDDo", "dayOfYear");
    i("dayOfYear", "DDD");
    j("dayOfYear", 4);
    b("DDD", u);
    b("DDDD", G);
    g([
        "DDD",
        "DDDD"
    ], function(a, c, b) {
        b._dayOfYear = dv(a);
    });
    function ci(a) {
        var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return a == null ? b : this.add(a - b, "d");
    }
    c("m", [
        "mm",
        2
    ], 0, "minute");
    i("minute", "m");
    j("minute", 14);
    b("m", h);
    b("mm", h, k);
    g([
        "m",
        "mm"
    ], aA);
    var cj = p("Minutes", false);
    c("s", [
        "ss",
        2
    ], 0, "second");
    i("second", "s");
    j("second", 15);
    b("s", h);
    b("ss", h, k);
    g([
        "s",
        "ss"
    ], aB);
    var ck = p("Seconds", false);
    c("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    c(0, [
        "SS",
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    c(0, [
        "SSS",
        3
    ], 0, "millisecond");
    c(0, [
        "SSSS",
        4
    ], 0, function() {
        return this.millisecond() * 10;
    });
    c(0, [
        "SSSSS",
        5
    ], 0, function() {
        return this.millisecond() * 100;
    });
    c(0, [
        "SSSSSS",
        6
    ], 0, function() {
        return this.millisecond() * 1000;
    });
    c(0, [
        "SSSSSSS",
        7
    ], 0, function() {
        return this.millisecond() * 10000;
    });
    c(0, [
        "SSSSSSSS",
        8
    ], 0, function() {
        return this.millisecond() * 100000;
    });
    c(0, [
        "SSSSSSSSS",
        9
    ], 0, function() {
        return this.millisecond() * 1000000;
    });
    i("millisecond", "ms");
    j("millisecond", 16);
    b("S", u, F);
    b("SS", u, k);
    b("SSS", u, G);
    var n, Z;
    for(n = "SSSS"; n.length <= 9; n += "S"){
        b(n, q);
    }
    function cl(a, b) {
        b[dF] = dv(("0." + a) * 1000);
    }
    for(n = "S"; n.length <= 9; n += "S"){
        g(n, cl);
    }
    Z = p("Milliseconds", false);
    c("z", 0, 0, "zoneAbbr");
    c("zz", 0, 0, "zoneName");
    function cm() {
        return this._isUTC ? "UTC" : "";
    }
    function cn() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    var a = ad.prototype;
    a.add = bu;
    a.calendar = bx;
    a.clone = by;
    a.diff = bF;
    a.endOf = bS;
    a.format = bJ;
    a.from = bK;
    a.fromNow = bL;
    a.to = bM;
    a.toNow = bN;
    a.get = au;
    a.invalidAt = b_;
    a.isAfter = bz;
    a.isBefore = bA;
    a.isBetween = bB;
    a.isSame = bC;
    a.isSameOrAfter = bD;
    a.isSameOrBefore = bE;
    a.isValid = bZ;
    a.lang = W;
    a.locale = V;
    a.localeData = X;
    a.max = bd;
    a.min = bc;
    a.parsingFlags = b$;
    a.set = av;
    a.startOf = bR;
    a.subtract = bv;
    a.toArray = bW;
    a.toObject = bX;
    a.toDate = bV;
    a.toISOString = bH;
    a.inspect = bI;
    if (typeof Symbol !== "undefined" && Symbol.for != null) {
        a[Symbol.for("nodejs.util.inspect.custom")] = function() {
            return "Moment<" + this.format() + ">";
        };
    }
    a.toJSON = bY;
    a.toString = bG;
    a.unix = bU;
    a.valueOf = bT;
    a.creationData = b0;
    a.eraName = b4;
    a.eraNarrow = b5;
    a.eraAbbr = b6;
    a.eraYear = b7;
    a.year = N;
    a.isLeapYear = aK;
    a.weekYear = cb;
    a.isoWeekYear = cc;
    a.quarter = a.quarters = ch;
    a.month = M;
    a.daysInMonth = aH;
    a.week = a.weeks = aP;
    a.isoWeek = a.isoWeeks = aQ;
    a.weeksInYear = cf;
    a.weeksInWeekYear = cg;
    a.isoWeeksInYear = cd;
    a.isoWeeksInISOWeekYear = ce;
    a.date = Y;
    a.day = a.days = aY;
    a.weekday = aZ;
    a.isoWeekday = a$;
    a.dayOfYear = ci;
    a.hour = a.hours = a6;
    a.minute = a.minutes = cj;
    a.second = a.seconds = ck;
    a.millisecond = a.milliseconds = Z;
    a.utcOffset = bk;
    a.utc = bm;
    a.local = bn;
    a.parseZone = bo;
    a.hasAlignedHourOffset = bp;
    a.isDST = bq;
    a.isLocal = bs;
    a.isUtcOffset = bt;
    a.isUtc = T;
    a.isUTC = T;
    a.zoneAbbr = cm;
    a.zoneName = cn;
    a.dates = l("dates accessor is deprecated. Use date instead.", Y);
    a.months = l("months accessor is deprecated. Use month instead", M);
    a.years = l("years accessor is deprecated. Use year instead", N);
    a.zone = l("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", bl);
    a.isDSTShifted = l("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", br);
    function co(a) {
        return bb(a * 1000);
    }
    function cp() {
        return bb.apply(null, arguments).parseZone();
    }
    function $(a) {
        return a;
    }
    var f = ag.prototype;
    f.calendar = ai;
    f.longDateFormat = ak;
    f.invalidDate = am;
    f.ordinal = ap;
    f.preparse = $;
    f.postformat = $;
    f.relativeTime = ar;
    f.pastFuture = as;
    f.set = af;
    f.eras = b1;
    f.erasParse = b2;
    f.erasConvertYear = b3;
    f.erasAbbrRegex = b9;
    f.erasNameRegex = b8;
    f.erasNarrowRegex = ca;
    f.months = aE;
    f.monthsShort = aF;
    f.monthsParse = aG;
    f.monthsRegex = aJ;
    f.monthsShortRegex = aI;
    f.week = aL;
    f.firstDayOfYear = aO;
    f.firstDayOfWeek = aN;
    f.weekdays = aU;
    f.weekdaysMin = aW;
    f.weekdaysShort = aV;
    f.weekdaysParse = aX;
    f.weekdaysRegex = a_;
    f.weekdaysShortRegex = a0;
    f.weekdaysMinRegex = a1;
    f.isPM = a4;
    f.meridiem = a7;
    function e8(a, b, c, d) {
        var e = Q(), f = ab().set(d, b);
        return e[c](f, a);
    }
    function e9(a, c, d) {
        if (c1(a)) {
            c = a;
            a = undefined;
        }
        a = a || "";
        if (c != null) {
            return e8(a, c, d, "month");
        }
        var b, e = [];
        for(b = 0; b < 12; b++){
            e[b] = e8(a, b, d, "month");
        }
        return e;
    }
    function fa(d, a, b, e) {
        if (typeof d === "boolean") {
            if (c1(a)) {
                b = a;
                a = undefined;
            }
            a = a || "";
        } else {
            a = d;
            b = a;
            d = false;
            if (c1(a)) {
                b = a;
                a = undefined;
            }
            a = a || "";
        }
        var h = Q(), f = d ? h._week.dow : 0, c, g = [];
        if (b != null) {
            return e8(a, (b + f) % 7, e, "day");
        }
        for(c = 0; c < 7; c++){
            g[c] = e8(a, (c + f) % 7, e, "day");
        }
        return g;
    }
    function cq(a, b) {
        return e9(a, b, "months");
    }
    function cr(a, b) {
        return e9(a, b, "monthsShort");
    }
    function cs(a, b, c) {
        return fa(a, b, c, "weekdays");
    }
    function ct(a, b, c) {
        return fa(a, b, c, "weekdaysShort");
    }
    function cu(a, b, c) {
        return fa(a, b, c, "weekdaysMin");
    }
    B("en", {
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
            var b = a % 10, c = dv((a % 100) / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
            return a + c;
        }
    });
    d.lang = l("moment.lang is deprecated. Use moment.locale instead.", B);
    d.langData = l("moment.langData is deprecated. Use moment.localeData instead.", Q);
    var fb = Math.abs;
    function cv() {
        var a = this._data;
        this._milliseconds = fb(this._milliseconds);
        this._days = fb(this._days);
        this._months = fb(this._months);
        a.milliseconds = fb(a.milliseconds);
        a.seconds = fb(a.seconds);
        a.minutes = fb(a.minutes);
        a.hours = fb(a.hours);
        a.months = fb(a.months);
        a.years = fb(a.years);
        return this;
    }
    function fc(a, d, e, b) {
        var c = C(d, e);
        a._milliseconds += b * c._milliseconds;
        a._days += b * c._days;
        a._months += b * c._months;
        return a._bubble();
    }
    function cw(a, b) {
        return fc(this, a, b, 1);
    }
    function cx(a, b) {
        return fc(this, a, b, -1);
    }
    function fd(a) {
        if (a < 0) {
            return Math.floor(a);
        } else {
            return Math.ceil(a);
        }
    }
    function cy() {
        var d = this._milliseconds, a = this._days, b = this._months, c = this._data, e, f, g, i, h;
        if (!((d >= 0 && a >= 0 && b >= 0) || (d <= 0 && a <= 0 && b <= 0))) {
            d += fd(ff(b) + a) * 864e5;
            a = 0;
            b = 0;
        }
        c.milliseconds = d % 1000;
        e = du(d / 1000);
        c.seconds = e % 60;
        f = du(e / 60);
        c.minutes = f % 60;
        g = du(f / 60);
        c.hours = g % 24;
        a += du(g / 24);
        h = du(fe(a));
        b += h;
        a -= fd(ff(h));
        i = du(b / 12);
        b %= 12;
        c.days = a;
        c.months = b;
        c.years = i;
        return this;
    }
    function fe(a) {
        return (a * 4800) / 146097;
    }
    function ff(a) {
        return (a * 146097) / 4800;
    }
    function cz(b) {
        if (!this.isValid()) {
            return NaN;
        }
        var a, d, c = this._milliseconds;
        b = at(b);
        if (b === "month" || b === "quarter" || b === "year") {
            a = this._days + c / 864e5;
            d = this._months + fe(a);
            switch(b){
                case "month":
                    return d;
                case "quarter":
                    return d / 3;
                case "year":
                    return d / 12;
            }
        } else {
            a = this._days + Math.round(ff(this._months));
            switch(b){
                case "week":
                    return a / 7 + c / 6048e5;
                case "day":
                    return a + c / 864e5;
                case "hour":
                    return a * 24 + c / 36e5;
                case "minute":
                    return a * 1440 + c / 6e4;
                case "second":
                    return a * 86400 + c / 1000;
                case "millisecond":
                    return Math.floor(a * 864e5) + c;
                default:
                    throw new Error("Unknown unit " + b);
            }
        }
    }
    function cA() {
        if (!this.isValid()) {
            return NaN;
        }
        return (this._milliseconds + this._days * 864e5 + (this._months % 12) * 2592e6 + dv(this._months / 12) * 31536e6);
    }
    function m(a) {
        return function() {
            return this.as(a);
        };
    }
    var cB = m("ms"), cC = m("s"), cD = m("m"), cE = m("h"), cF = m("d"), cG = m("w"), cH = m("M"), cI = m("Q"), cJ = m("y");
    function cK() {
        return C(this);
    }
    function cL(a) {
        a = at(a);
        return this.isValid() ? this[a + "s"]() : NaN;
    }
    function o(a) {
        return function() {
            return this.isValid() ? this._data[a] : NaN;
        };
    }
    var cM = o("milliseconds"), cN = o("seconds"), cO = o("minutes"), cP = o("hours"), cQ = o("days"), cR = o("months"), cS = o("years");
    function cT() {
        return du(this.days() / 7);
    }
    var fg = Math.round, fh = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    function fi(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d);
    }
    function fj(j, l, a, m) {
        var c = C(j).abs(), d = fg(c.as("s")), e = fg(c.as("m")), f = fg(c.as("h")), g = fg(c.as("d")), h = fg(c.as("M")), i = fg(c.as("w")), k = fg(c.as("y")), b = (d <= a.ss && [
            "s",
            d
        ]) || (d < a.s && [
            "ss",
            d
        ]) || (e <= 1 && [
            "m"
        ]) || (e < a.m && [
            "mm",
            e
        ]) || (f <= 1 && [
            "h"
        ]) || (f < a.h && [
            "hh",
            f
        ]) || (g <= 1 && [
            "d"
        ]) || (g < a.d && [
            "dd",
            g
        ]);
        if (a.w != null) {
            b = b || (i <= 1 && [
                "w"
            ]) || (i < a.w && [
                "ww",
                i
            ]);
        }
        b = b || (h <= 1 && [
            "M"
        ]) || (h < a.M && [
            "MM",
            h
        ]) || (k <= 1 && [
            "y"
        ]) || [
            "yy",
            k
        ];
        b[2] = l;
        b[3] = +j > 0;
        b[4] = m;
        return fi.apply(null, b);
    }
    function cU(a) {
        if (a === undefined) {
            return fg;
        }
        if (typeof a === "function") {
            fg = a;
            return true;
        }
        return false;
    }
    function cV(a, b) {
        if (fh[a] === undefined) {
            return false;
        }
        if (b === undefined) {
            return fh[a];
        }
        fh[a] = b;
        if (a === "s") {
            fh.ss = b - 1;
        }
        return true;
    }
    function cW(b, a) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var e = false, f = fh, c, d;
        if (typeof b === "object") {
            a = b;
            b = false;
        }
        if (typeof b === "boolean") {
            e = b;
        }
        if (typeof a === "object") {
            f = Object.assign({}, fh, a);
            if (a.s != null && a.ss == null) {
                f.ss = a.s - 1;
            }
        }
        c = this.localeData();
        d = fj(this, !e, f, c);
        if (e) {
            d = c.pastFuture(+this, d);
        }
        return c.postformat(d);
    }
    var fk = Math.abs;
    function fl(a) {
        return (a > 0) - (a < 0) || +a;
    }
    function y() {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        var a = fk(this._milliseconds) / 1000, i = fk(this._days), d = fk(this._months), b, e, g, j, c = this.asSeconds(), k, h, l, f;
        if (!c) {
            return "P0D";
        }
        b = du(a / 60);
        e = du(b / 60);
        a %= 60;
        b %= 60;
        g = du(d / 12);
        d %= 12;
        j = a ? a.toFixed(3).replace(/\.?0+$/, "") : "";
        k = c < 0 ? "-" : "";
        h = fl(this._months) !== fl(c) ? "-" : "";
        l = fl(this._days) !== fl(c) ? "-" : "";
        f = fl(this._milliseconds) !== fl(c) ? "-" : "";
        return (k + "P" + (g ? h + g + "Y" : "") + (d ? h + d + "M" : "") + (i ? l + i + "D" : "") + (e || b || a ? "T" : "") + (e ? f + e + "H" : "") + (b ? f + b + "M" : "") + (a ? f + j + "S" : ""));
    }
    var e = R.prototype;
    e.isValid = bh;
    e.abs = cv;
    e.add = cw;
    e.subtract = cx;
    e.as = cz;
    e.asMilliseconds = cB;
    e.asSeconds = cC;
    e.asMinutes = cD;
    e.asHours = cE;
    e.asDays = cF;
    e.asWeeks = cG;
    e.asMonths = cH;
    e.asQuarters = cI;
    e.asYears = cJ;
    e.valueOf = cA;
    e._bubble = cy;
    e.clone = cK;
    e.get = cL;
    e.milliseconds = cM;
    e.seconds = cN;
    e.minutes = cO;
    e.hours = cP;
    e.days = cQ;
    e.weeks = cT;
    e.months = cR;
    e.years = cS;
    e.humanize = cW;
    e.toISOString = y;
    e.toString = y;
    e.toJSON = y;
    e.locale = V;
    e.localeData = X;
    e.toIsoString = l("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", y);
    e.lang = W;
    c("X", 0, 0, "unix");
    c("x", 0, 0, "valueOf");
    b("x", w);
    b("X", aw);
    g("X", function(a, c, b) {
        b._d = new Date(parseFloat(a) * 1000);
    });
    g("x", function(a, c, b) {
        b._d = new Date(dv(a));
    });
    d.version = "2.29.1";
    _(bb);
    d.fn = a;
    d.min = be;
    d.max = bf;
    d.now = bg;
    d.utc = ab;
    d.unix = co;
    d.months = cq;
    d.isDate = aa;
    d.locale = B;
    d.invalid = ac;
    d.duration = C;
    d.isMoment = ae;
    d.weekdays = cs;
    d.parseZone = cp;
    d.localeData = Q;
    d.isDuration = bj;
    d.monthsShort = cr;
    d.weekdaysMin = cu;
    d.defineLocale = a8;
    d.updateLocale = a9;
    d.locales = ba;
    d.weekdaysShort = ct;
    d.normalizeUnits = at;
    d.relativeTimeRounding = cU;
    d.relativeTimeThreshold = cV;
    d.calendarFormat = bw;
    d.prototype = a;
    d.HTML5_FMT = {
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
    return d;
});
