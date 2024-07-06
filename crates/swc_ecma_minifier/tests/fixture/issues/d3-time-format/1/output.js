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
        a: function(d) {
            return locale_shortWeekdays[d.getDay()];
        },
        A: function(d) {
            return locale_weekdays[d.getDay()];
        },
        b: function(d) {
            return locale_shortMonths[d.getMonth()];
        },
        B: function(d) {
            return locale_months[d.getMonth()];
        },
        c: null,
        d: formatDayOfMonth,
        e: formatDayOfMonth,
        f: formatMicroseconds,
        g: formatYearISO,
        G: formatFullYearISO,
        H: formatHour24,
        I: formatHour12,
        j: formatDayOfYear,
        L: formatMilliseconds,
        m: formatMonthNumber,
        M: formatMinutes,
        p: function(d) {
            return locale_periods[+(d.getHours() >= 12)];
        },
        q: function(d) {
            return 1 + ~~(d.getMonth() / 3);
        },
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatSeconds,
        u: formatWeekdayNumberMonday,
        U: formatWeekNumberSunday,
        V: formatWeekNumberISO,
        w: formatWeekdayNumberSunday,
        W: formatWeekNumberMonday,
        x: null,
        X: null,
        y: formatYear,
        Y: formatFullYear,
        Z: formatZone,
        "%": formatLiteralPercent
    }, utcFormats = {
        a: function(d) {
            return locale_shortWeekdays[d.getUTCDay()];
        },
        A: function(d) {
            return locale_weekdays[d.getUTCDay()];
        },
        b: function(d) {
            return locale_shortMonths[d.getUTCMonth()];
        },
        B: function(d) {
            return locale_months[d.getUTCMonth()];
        },
        c: null,
        d: formatUTCDayOfMonth,
        e: formatUTCDayOfMonth,
        f: formatUTCMicroseconds,
        g: formatUTCYearISO,
        G: formatUTCFullYearISO,
        H: formatUTCHour24,
        I: formatUTCHour12,
        j: formatUTCDayOfYear,
        L: formatUTCMilliseconds,
        m: formatUTCMonthNumber,
        M: formatUTCMinutes,
        p: function(d) {
            return locale_periods[+(d.getUTCHours() >= 12)];
        },
        q: function(d) {
            return 1 + ~~(d.getUTCMonth() / 3);
        },
        Q: formatUnixTimestamp,
        s: formatUnixTimestampSeconds,
        S: formatUTCSeconds,
        u: formatUTCWeekdayNumberMonday,
        U: formatUTCWeekNumberSunday,
        V: formatUTCWeekNumberISO,
        w: formatUTCWeekdayNumberSunday,
        W: formatUTCWeekNumberMonday,
        x: null,
        X: null,
        y: formatUTCYear,
        Y: formatUTCFullYear,
        Z: formatUTCZone,
        "%": formatLiteralPercent
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
            // If a UNIX timestamp is specified, return it.
            if ("Q" in d) return new Date(d.Q);
            if ("s" in d) return new Date(1000 * d.s + ("L" in d ? d.L : 0));
            // Convert day-of-week and week-of-year to day-of-year.
            if (!Z || "Z" in d || (d.Z = 0), "p" in d && (d.H = d.H % 12 + 12 * d.p), void 0 === d.m && (d.m = "q" in d ? d.q : 0), "V" in d) {
                if (d.V < 1 || d.V > 53) return null;
                "w" in d || (d.w = 1), "Z" in d ? (week = (day = (week = utcDate(newDate(d.y, 0, 1))).getUTCDay()) > 4 || 0 === day ? utcMonday.ceil(week) : utcMonday(week), week = utcDay.offset(week, (d.V - 1) * 7), d.y = week.getUTCFullYear(), d.m = week.getUTCMonth(), d.d = week.getUTCDate() + (d.w + 6) % 7) : (week = (day = (week = localDate(newDate(d.y, 0, 1))).getDay()) > 4 || 0 === day ? timeMonday.ceil(week) : timeMonday(week), week = timeDay.offset(week, (d.V - 1) * 7), d.y = week.getFullYear(), d.m = week.getMonth(), d.d = week.getDate() + (d.w + 6) % 7);
            } else ("W" in d || "U" in d) && ("w" in d || (d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0), day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay(), d.m = 0, d.d = "W" in d ? (d.w + 6) % 7 + 7 * d.W - (day + 5) % 7 : d.w + 7 * d.U - (day + 6) % 7);
            return(// If a time zone is specified, all fields are interpreted as UTC and then
            // offset according to the specified time zone.
            "Z" in d ? (d.H += d.Z / 100 | 0, d.M += d.Z % 100, utcDate(d)) : localDate(d));
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
    return(// These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats), formats.X = newFormat(locale_time, formats), formats.c = newFormat(locale_dateTime, formats), utcFormats.x = newFormat(locale_date, utcFormats), utcFormats.X = newFormat(locale_time, utcFormats), utcFormats.c = newFormat(locale_dateTime, utcFormats), {
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
    });
}
var pads = {
    "-": "",
    _: " ",
    0: "0"
}, numberRe = /^\s*\d+/, percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? Array(width - length + 1).join(fill) + string : string);
}
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
function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
}
function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
}
function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
}
function formatDayOfYear(d, p) {
    return pad(1 + timeDay.count(timeYear(d), d), p, 3);
}
function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
}
function formatMicroseconds(d, p) {
    return formatMilliseconds(d, p) + "000";
}
function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
}
function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
}
function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
}
function formatWeekdayNumberMonday(d) {
    var day = d.getDay();
    return 0 === day ? 7 : day;
}
function formatWeekNumberSunday(d, p) {
    return pad(timeSunday.count(timeYear(d) - 1, d), p, 2);
}
function dISO(d) {
    var day = d.getDay();
    return day >= 4 || 0 === day ? timeThursday(d) : timeThursday.ceil(d);
}
function formatWeekNumberISO(d, p) {
    return d = dISO(d), pad(timeThursday.count(timeYear(d), d) + (4 === timeYear(d).getDay()), p, 2);
}
function formatWeekdayNumberSunday(d) {
    return d.getDay();
}
function formatWeekNumberMonday(d, p) {
    return pad(timeMonday.count(timeYear(d) - 1, d), p, 2);
}
function formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
}
function formatYearISO(d, p) {
    return pad((d = dISO(d)).getFullYear() % 100, p, 2);
}
function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
}
function formatFullYearISO(d, p) {
    var day = d.getDay();
    return pad((d = day >= 4 || 0 === day ? timeThursday(d) : timeThursday.ceil(d)).getFullYear() % 10000, p, 4);
}
function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}
function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
}
function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
}
function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
}
function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}
function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
}
function formatUTCMicroseconds(d, p) {
    return formatUTCMilliseconds(d, p) + "000";
}
function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
}
function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
}
function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
}
function formatUTCWeekdayNumberMonday(d) {
    var dow = d.getUTCDay();
    return 0 === dow ? 7 : dow;
}
function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
}
function UTCdISO(d) {
    var day = d.getUTCDay();
    return day >= 4 || 0 === day ? utcThursday(d) : utcThursday.ceil(d);
}
function formatUTCWeekNumberISO(d, p) {
    return d = UTCdISO(d), pad(utcThursday.count(utcYear(d), d) + (4 === utcYear(d).getUTCDay()), p, 2);
}
function formatUTCWeekdayNumberSunday(d) {
    return d.getUTCDay();
}
function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
}
function formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
}
function formatUTCYearISO(d, p) {
    return pad((d = UTCdISO(d)).getUTCFullYear() % 100, p, 2);
}
function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
}
function formatUTCFullYearISO(d, p) {
    var day = d.getUTCDay();
    return pad((d = day >= 4 || 0 === day ? utcThursday(d) : utcThursday.ceil(d)).getUTCFullYear() % 10000, p, 4);
}
function formatUTCZone() {
    return "+0000";
}
function formatLiteralPercent() {
    return "%";
}
function formatUnixTimestamp(d) {
    return +d;
}
function formatUnixTimestampSeconds(d) {
    return Math.floor(+d / 1000);
}
