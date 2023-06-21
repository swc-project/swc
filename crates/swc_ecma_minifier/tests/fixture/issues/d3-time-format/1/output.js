import { timeDay, timeSunday, timeMonday, timeThursday, timeYear, utcDay, utcSunday, utcMonday, utcThursday, utcYear } from "d3-time";
function localDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        return date.setFullYear(d.y), date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}
function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        return date.setUTCFullYear(d.y), date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}
function newDate(y, m, d) {
    return {
        y: y,
        m: m,
        d: d,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function formatLocale(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_weekdays = locale.days, locale_shortWeekdays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths, periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths), formats = {
        c: null,
        x: null,
        X: null
    }, utcFormats = {
        c: null,
        x: null,
        X: null
    }, parses = {
        a: function(d, string, i) {
            var n = shortWeekdayRe.exec(string.slice(i));
            return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        },
        A: function(d, string, i) {
            var n = weekdayRe.exec(string.slice(i));
            return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        },
        b: function(d, string, i) {
            var n = shortMonthRe.exec(string.slice(i));
            return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        },
        B: function(d, string, i) {
            var n = monthRe.exec(string.slice(i));
            return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        },
        c: function(d, string, i) {
            return parseSpecifier(d, locale_dateTime, string, i);
        },
        d: parseDayOfMonth,
        e: parseDayOfMonth,
        f: parseMicroseconds,
        g: parseYear,
        G: parseFullYear,
        H: parseHour24,
        I: parseHour24,
        j: parseDayOfYear,
        L: parseMilliseconds,
        m: parseMonthNumber,
        M: parseMinutes,
        p: function(d, string, i) {
            var n = periodRe.exec(string.slice(i));
            return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        },
        q: parseQuarter,
        Q: parseUnixTimestamp,
        s: parseUnixTimestampSeconds,
        S: parseSeconds,
        u: parseWeekdayNumberMonday,
        U: parseWeekNumberSunday,
        V: parseWeekNumberISO,
        w: parseWeekdayNumberSunday,
        W: parseWeekNumberMonday,
        x: function(d, string, i) {
            return parseSpecifier(d, locale_date, string, i);
        },
        X: function(d, string, i) {
            return parseSpecifier(d, locale_time, string, i);
        },
        y: parseYear,
        Y: parseFullYear,
        Z: parseZone,
        "%": parseLiteralPercent
    };
    function newFormat(specifier, formats) {
        return function(date) {
            var c, pad, format, string = [], i = -1, j = 0, n = specifier.length;
            for(date instanceof Date || (date = new Date(+date)); ++i < n;)37 === specifier.charCodeAt(i) && (string.push(specifier.slice(j, i)), null != (pad = pads[c = specifier.charAt(++i)]) ? c = specifier.charAt(++i) : pad = "e" === c ? " " : "0", (format = formats[c]) && (c = format(date, pad)), string.push(c), j = i + 1);
            return string.push(specifier.slice(j, i)), string.join("");
        };
    }
    function newParse(specifier, Z) {
        return function(string) {
            var week, day, d = newDate(1900, void 0, 1);
            if (parseSpecifier(d, specifier, string += "", 0) != string.length) return null;
            if ("Q" in d) return new Date(d.Q);
            if ("s" in d) return new Date(1000 * d.s + ("L" in d ? d.L : 0));
            if (!Z || "Z" in d || (d.Z = 0), "p" in d && (d.H = d.H % 12 + 12 * d.p), void 0 === d.m && (d.m = "q" in d ? d.q : 0), "V" in d) {
                if (d.V < 1 || d.V > 53) return null;
                "w" in d || (d.w = 1), "Z" in d ? (week = (day = (week = utcDate(newDate(d.y, 0, 1))).getUTCDay()) > 4 || 0 === day ? utcMonday.ceil(week) : utcMonday(week), week = utcDay.offset(week, (d.V - 1) * 7), d.y = week.getUTCFullYear(), d.m = week.getUTCMonth(), d.d = week.getUTCDate() + (d.w + 6) % 7) : (week = (day = (week = localDate(newDate(d.y, 0, 1))).getDay()) > 4 || 0 === day ? timeMonday.ceil(week) : timeMonday(week), week = timeDay.offset(week, (d.V - 1) * 7), d.y = week.getFullYear(), d.m = week.getMonth(), d.d = week.getDate() + (d.w + 6) % 7);
            } else ("W" in d || "U" in d) && ("w" in d || (d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0), day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay(), d.m = 0, d.d = "W" in d ? (d.w + 6) % 7 + 7 * d.W - (day + 5) % 7 : d.w + 7 * d.U - (day + 6) % 7);
            return "Z" in d ? (d.H += d.Z / 100 | 0, d.M += d.Z % 100, utcDate(d)) : localDate(d);
        };
    }
    function parseSpecifier(d, specifier, string, j) {
        for(var c, parse, i = 0, n = specifier.length, m = string.length; i < n;){
            if (j >= m) return -1;
            if (37 === (c = specifier.charCodeAt(i++))) {
                if (!(parse = parses[(c = specifier.charAt(i++)) in pads ? specifier.charAt(i++) : c]) || (j = parse(d, string, j)) < 0) return -1;
            } else if (c != string.charCodeAt(j++)) return -1;
        }
        return j;
    }
    return formats.x = newFormat(locale_date, formats), formats.X = newFormat(locale_time, formats), formats.c = newFormat(locale_dateTime, formats), utcFormats.x = newFormat(locale_date, utcFormats), utcFormats.X = newFormat(locale_time, utcFormats), utcFormats.c = newFormat(locale_dateTime, utcFormats), {
        format: function(specifier) {
            var f = newFormat(specifier += "", formats);
            return f.toString = function() {
                return specifier;
            }, f;
        },
        parse: function(specifier) {
            var p = newParse(specifier += "", !1);
            return p.toString = function() {
                return specifier;
            }, p;
        },
        utcFormat: function(specifier) {
            var f = newFormat(specifier += "", utcFormats);
            return f.toString = function() {
                return specifier;
            }, f;
        },
        utcParse: function(specifier) {
            var p = newParse(specifier += "", !0);
            return p.toString = function() {
                return specifier;
            }, p;
        }
    };
}
var pads = {
    "-": "",
    _: " ",
    0: "0"
}, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
function requote(s) {
    return s.replace(requoteRe, "\\$&");
}
function formatRe(names) {
    return RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}
function formatLookup(names) {
    return new Map(names.map((name, i)=>[
            name.toLowerCase(),
            i
        ]));
}
function parseWeekdayNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
}
function parseWeekdayNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.u = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberISO(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.V = +n[0], i + n[0].length) : -1;
}
function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
}
function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
}
function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}
function parseZone(d, string, i) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}
function parseQuarter(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.q = 3 * n[0] - 3, i + n[0].length) : -1;
}
function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}
function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
}
function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}
function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
}
function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
}
function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
}
function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
}
function parseMicroseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 6));
    return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}
function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
}
function parseUnixTimestamp(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.Q = +n[0], i + n[0].length) : -1;
}
function parseUnixTimestampSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.s = +n[0], i + n[0].length) : -1;
}
