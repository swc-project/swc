class LuxonError extends Error {
}
class InvalidDateTimeError extends LuxonError {
    constructor(reason){
        super(`Invalid DateTime: ${reason.toMessage()}`);
    }
}
class InvalidIntervalError extends LuxonError {
    constructor(reason){
        super(`Invalid Interval: ${reason.toMessage()}`);
    }
}
class InvalidDurationError extends LuxonError {
    constructor(reason){
        super(`Invalid Duration: ${reason.toMessage()}`);
    }
}
class ConflictingSpecificationError extends LuxonError {
}
class InvalidUnitError extends LuxonError {
    constructor(unit){
        super(`Invalid unit ${unit}`);
    }
}
class InvalidArgumentError extends LuxonError {
}
class ZoneIsAbstractError extends LuxonError {
    constructor(){
        super("Zone is an abstract class");
    }
}
function isUndefined(o) {
    return typeof o === "undefined";
}
function isNumber(o) {
    return typeof o === "number";
}
function isInteger(o) {
    return typeof o === "number" && o % 1 === 0;
}
function isString(o) {
    return typeof o === "string";
}
function isDate(o) {
    return Object.prototype.toString.call(o) === "[object Date]";
}
function hasIntl() {
    try {
        return typeof Intl !== "undefined" && Intl.DateTimeFormat;
    } catch (e) {
        return false;
    }
}
function hasFormatToParts() {
    return !isUndefined(Intl.DateTimeFormat.prototype.formatToParts);
}
function hasRelative() {
    try {
        return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
    } catch (e) {
        return false;
    }
}
function maybeArray(thing) {
    return Array.isArray(thing) ? thing : [
        thing
    ];
}
function bestBy(arr, by, compare) {
    if (arr.length === 0) {
        return undefined;
    }
    return arr.reduce((best, next)=>{
        const pair = [
            by(next),
            next
        ];
        if (!best) {
            return pair;
        } else if (compare(best[0], pair[0]) === best[0]) {
            return best;
        } else {
            return pair;
        }
    }, null)[1];
}
function pick(obj, keys) {
    return keys.reduce((a, k)=>{
        a[k] = obj[k];
        return a;
    }, {
    });
}
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function integerBetween(thing, bottom, top) {
    return isInteger(thing) && thing >= bottom && thing <= top;
}
function floorMod(x, n) {
    return x - n * Math.floor(x / n);
}
function padStart(input, n = 2) {
    if (input.toString().length < n) {
        return ("0".repeat(n) + input).slice(-n);
    } else {
        return input.toString();
    }
}
function parseInteger(string) {
    if (isUndefined(string) || string === null || string === "") {
        return undefined;
    } else {
        return parseInt(string, 10);
    }
}
function parseMillis(fraction) {
    if (isUndefined(fraction) || fraction === null || fraction === "") {
        return undefined;
    } else {
        const f = parseFloat("0." + fraction) * 1000;
        return Math.floor(f);
    }
}
function roundTo(number, digits, towardZero = false) {
    const factor = 10 ** digits, rounder = towardZero ? Math.trunc : Math.round;
    return rounder(number * factor) / factor;
}
function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}
function daysInMonth(year, month) {
    const modMonth = floorMod(month - 1, 12) + 1, modYear = year + (month - modMonth) / 12;
    if (modMonth === 2) {
        return isLeapYear(modYear) ? 29 : 28;
    } else {
        return [
            31,
            null,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ][modMonth - 1];
    }
}
function objToLocalTS(obj) {
    let d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond);
    if (obj.year < 100 && obj.year >= 0) {
        d = new Date(d);
        d.setUTCFullYear(d.getUTCFullYear() - 1900);
    }
    return +d;
}
function weeksInWeekYear(weekYear) {
    const p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7, last = weekYear - 1, p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
    return p1 === 4 || p2 === 3 ? 53 : 52;
}
function untruncateYear(year) {
    if (year > 99) {
        return year;
    } else return year > 60 ? 1900 + year : 2000 + year;
}
function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
    const date = new Date(ts), intlOpts = {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    };
    if (timeZone) {
        intlOpts.timeZone = timeZone;
    }
    const modified = Object.assign({
        timeZoneName: offsetFormat
    }, intlOpts), intl = hasIntl();
    if (intl && hasFormatToParts()) {
        const parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find((m)=>m.type.toLowerCase() === "timezonename"
        );
        return parsed ? parsed.value : null;
    } else if (intl) {
        const without = new Intl.DateTimeFormat(locale, intlOpts).format(date), included = new Intl.DateTimeFormat(locale, modified).format(date), diffed = included.substring(without.length), trimmed = diffed.replace(/^[, \u200e]+/, "");
        return trimmed;
    } else {
        return null;
    }
}
function signedOffset(offHourStr, offMinuteStr) {
    let offHour = parseInt(offHourStr, 10);
    if (Number.isNaN(offHour)) {
        offHour = 0;
    }
    const offMin = parseInt(offMinuteStr, 10) || 0, offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
    return offHour * 60 + offMinSigned;
}
function asNumber(value) {
    const numericValue = Number(value);
    if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue)) throw new InvalidArgumentError(`Invalid unit value ${value}`);
    return numericValue;
}
function normalizeObject(obj, normalizer, nonUnitKeys) {
    const normalized = {
    };
    for(const u in obj){
        if (hasOwnProperty(obj, u)) {
            if (nonUnitKeys.indexOf(u) >= 0) continue;
            const v = obj[u];
            if (v === undefined || v === null) continue;
            normalized[normalizer(u)] = asNumber(v);
        }
    }
    return normalized;
}
function formatOffset(offset, format) {
    const hours = Math.trunc(Math.abs(offset / 60)), minutes = Math.trunc(Math.abs(offset % 60)), sign = offset >= 0 ? "+" : "-";
    switch(format){
        case "short":
            return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
        case "narrow":
            return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
        case "techie":
            return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
        default:
            throw new RangeError(`Value format ${format} is out of range for property format`);
    }
}
function timeObject(obj) {
    return pick(obj, [
        "hour",
        "minute",
        "second",
        "millisecond"
    ]);
}
const ianaRegex = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z_+-]{1,256}(\/[A-Za-z_+-]{1,256})?)?/;
const n1 = "numeric", s1 = "short", l = "long";
const DATE_SHORT = {
    year: n1,
    month: n1,
    day: n1
};
const DATE_MED = {
    year: n1,
    month: s1,
    day: n1
};
const DATE_MED_WITH_WEEKDAY = {
    year: n1,
    month: s1,
    day: n1,
    weekday: s1
};
const DATE_FULL = {
    year: n1,
    month: l,
    day: n1
};
const DATE_HUGE = {
    year: n1,
    month: l,
    day: n1,
    weekday: l
};
const TIME_SIMPLE = {
    hour: n1,
    minute: n1
};
const TIME_WITH_SECONDS = {
    hour: n1,
    minute: n1,
    second: n1
};
const TIME_WITH_SHORT_OFFSET = {
    hour: n1,
    minute: n1,
    second: n1,
    timeZoneName: s1
};
const TIME_WITH_LONG_OFFSET = {
    hour: n1,
    minute: n1,
    second: n1,
    timeZoneName: l
};
const TIME_24_SIMPLE = {
    hour: n1,
    minute: n1,
    hour12: false
};
const TIME_24_WITH_SECONDS = {
    hour: n1,
    minute: n1,
    second: n1,
    hour12: false
};
const TIME_24_WITH_SHORT_OFFSET = {
    hour: n1,
    minute: n1,
    second: n1,
    hour12: false,
    timeZoneName: s1
};
const TIME_24_WITH_LONG_OFFSET = {
    hour: n1,
    minute: n1,
    second: n1,
    hour12: false,
    timeZoneName: l
};
const DATETIME_SHORT = {
    year: n1,
    month: n1,
    day: n1,
    hour: n1,
    minute: n1
};
const DATETIME_SHORT_WITH_SECONDS = {
    year: n1,
    month: n1,
    day: n1,
    hour: n1,
    minute: n1,
    second: n1
};
const DATETIME_MED = {
    year: n1,
    month: s1,
    day: n1,
    hour: n1,
    minute: n1
};
const DATETIME_MED_WITH_SECONDS = {
    year: n1,
    month: s1,
    day: n1,
    hour: n1,
    minute: n1,
    second: n1
};
const DATETIME_MED_WITH_WEEKDAY = {
    year: n1,
    month: s1,
    day: n1,
    weekday: s1,
    hour: n1,
    minute: n1
};
const DATETIME_FULL = {
    year: n1,
    month: l,
    day: n1,
    hour: n1,
    minute: n1,
    timeZoneName: s1
};
const DATETIME_FULL_WITH_SECONDS = {
    year: n1,
    month: l,
    day: n1,
    hour: n1,
    minute: n1,
    second: n1,
    timeZoneName: s1
};
const DATETIME_HUGE = {
    year: n1,
    month: l,
    day: n1,
    weekday: l,
    hour: n1,
    minute: n1,
    timeZoneName: l
};
const DATETIME_HUGE_WITH_SECONDS = {
    year: n1,
    month: l,
    day: n1,
    weekday: l,
    hour: n1,
    minute: n1,
    second: n1,
    timeZoneName: l
};
function stringify(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
}
const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const monthsNarrow = [
    "J",
    "F",
    "M",
    "A",
    "M",
    "J",
    "J",
    "A",
    "S",
    "O",
    "N",
    "D"
];
function months(length) {
    switch(length){
        case "narrow":
            return monthsNarrow;
        case "short":
            return monthsShort;
        case "long":
            return monthsLong;
        case "numeric":
            return [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
            ];
        case "2-digit":
            return [
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12"
            ];
        default:
            return null;
    }
}
const weekdaysLong = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];
const weekdaysShort = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];
const weekdaysNarrow = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S"
];
function weekdays(length) {
    switch(length){
        case "narrow":
            return weekdaysNarrow;
        case "short":
            return weekdaysShort;
        case "long":
            return weekdaysLong;
        case "numeric":
            return [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7"
            ];
        default:
            return null;
    }
}
const meridiems = [
    "AM",
    "PM"
];
const erasLong = [
    "Before Christ",
    "Anno Domini"
];
const erasShort = [
    "BC",
    "AD"
];
const erasNarrow = [
    "B",
    "A"
];
function eras(length) {
    switch(length){
        case "narrow":
            return erasNarrow;
        case "short":
            return erasShort;
        case "long":
            return erasLong;
        default:
            return null;
    }
}
function meridiemForDateTime(dt) {
    return meridiems[dt.hour < 12 ? 0 : 1];
}
function weekdayForDateTime(dt, length) {
    return weekdays(length)[dt.weekday - 1];
}
function monthForDateTime(dt, length) {
    return months(length)[dt.month - 1];
}
function eraForDateTime(dt, length) {
    return eras(length)[dt.year < 0 ? 0 : 1];
}
function formatRelativeTime(unit, count, numeric = "always", narrow = false) {
    const units = {
        years: [
            "year",
            "yr."
        ],
        quarters: [
            "quarter",
            "qtr."
        ],
        months: [
            "month",
            "mo."
        ],
        weeks: [
            "week",
            "wk."
        ],
        days: [
            "day",
            "day",
            "days"
        ],
        hours: [
            "hour",
            "hr."
        ],
        minutes: [
            "minute",
            "min."
        ],
        seconds: [
            "second",
            "sec."
        ]
    };
    const lastable = [
        "hours",
        "minutes",
        "seconds"
    ].indexOf(unit) === -1;
    if (numeric === "auto" && lastable) {
        const isDay = unit === "days";
        switch(count){
            case 1:
                return isDay ? "tomorrow" : `next ${units[unit][0]}`;
            case -1:
                return isDay ? "yesterday" : `last ${units[unit][0]}`;
            case 0:
                return isDay ? "today" : `this ${units[unit][0]}`;
            default:
        }
    }
    const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
    return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
}
function formatString(knownFormat) {
    const filtered = pick(knownFormat, [
        "weekday",
        "era",
        "year",
        "month",
        "day",
        "hour",
        "minute",
        "second",
        "timeZoneName",
        "hour12"
    ]), key = stringify(filtered), dateTimeHuge = "EEEE, LLLL d, yyyy, h:mm a";
    switch(key){
        case stringify(DATE_SHORT):
            return "M/d/yyyy";
        case stringify(DATE_MED):
            return "LLL d, yyyy";
        case stringify(DATE_MED_WITH_WEEKDAY):
            return "EEE, LLL d, yyyy";
        case stringify(DATE_FULL):
            return "LLLL d, yyyy";
        case stringify(DATE_HUGE):
            return "EEEE, LLLL d, yyyy";
        case stringify(TIME_SIMPLE):
            return "h:mm a";
        case stringify(TIME_WITH_SECONDS):
            return "h:mm:ss a";
        case stringify(TIME_WITH_SHORT_OFFSET):
            return "h:mm a";
        case stringify(TIME_WITH_LONG_OFFSET):
            return "h:mm a";
        case stringify(TIME_24_SIMPLE):
            return "HH:mm";
        case stringify(TIME_24_WITH_SECONDS):
            return "HH:mm:ss";
        case stringify(TIME_24_WITH_SHORT_OFFSET):
            return "HH:mm";
        case stringify(TIME_24_WITH_LONG_OFFSET):
            return "HH:mm";
        case stringify(DATETIME_SHORT):
            return "M/d/yyyy, h:mm a";
        case stringify(DATETIME_MED):
            return "LLL d, yyyy, h:mm a";
        case stringify(DATETIME_FULL):
            return "LLLL d, yyyy, h:mm a";
        case stringify(DATETIME_HUGE):
            return dateTimeHuge;
        case stringify(DATETIME_SHORT_WITH_SECONDS):
            return "M/d/yyyy, h:mm:ss a";
        case stringify(DATETIME_MED_WITH_SECONDS):
            return "LLL d, yyyy, h:mm:ss a";
        case stringify(DATETIME_MED_WITH_WEEKDAY):
            return "EEE, d LLL yyyy, h:mm a";
        case stringify(DATETIME_FULL_WITH_SECONDS):
            return "LLLL d, yyyy, h:mm:ss a";
        case stringify(DATETIME_HUGE_WITH_SECONDS):
            return "EEEE, LLLL d, yyyy, h:mm:ss a";
        default:
            return dateTimeHuge;
    }
}
function stringifyTokens(splits, tokenToString) {
    let s = "";
    for (const token of splits){
        if (token.literal) {
            s += token.val;
        } else {
            s += tokenToString(token.val);
        }
    }
    return s;
}
const macroTokenToFormatOpts = {
    D: DATE_SHORT,
    DD: DATE_MED,
    DDD: DATE_FULL,
    DDDD: DATE_HUGE,
    t: TIME_SIMPLE,
    tt: TIME_WITH_SECONDS,
    ttt: TIME_WITH_SHORT_OFFSET,
    tttt: TIME_WITH_LONG_OFFSET,
    T: TIME_24_SIMPLE,
    TT: TIME_24_WITH_SECONDS,
    TTT: TIME_24_WITH_SHORT_OFFSET,
    TTTT: TIME_24_WITH_LONG_OFFSET,
    f: DATETIME_SHORT,
    ff: DATETIME_MED,
    fff: DATETIME_FULL,
    ffff: DATETIME_HUGE,
    F: DATETIME_SHORT_WITH_SECONDS,
    FF: DATETIME_MED_WITH_SECONDS,
    FFF: DATETIME_FULL_WITH_SECONDS,
    FFFF: DATETIME_HUGE_WITH_SECONDS
};
class Formatter {
    static create(locale1, opts5 = {
    }) {
        return new Formatter(locale1, opts5);
    }
    static parseFormat(fmt4) {
        let current = null, currentFull = "", bracketed = false;
        const splits = [];
        for(let i = 0; i < fmt4.length; i++){
            const c = fmt4.charAt(i);
            if (c === "'") {
                if (currentFull.length > 0) {
                    splits.push({
                        literal: bracketed,
                        val: currentFull
                    });
                }
                current = null;
                currentFull = "";
                bracketed = !bracketed;
            } else if (bracketed) {
                currentFull += c;
            } else if (c === current) {
                currentFull += c;
            } else {
                if (currentFull.length > 0) {
                    splits.push({
                        literal: false,
                        val: currentFull
                    });
                }
                currentFull = c;
                current = c;
            }
        }
        if (currentFull.length > 0) {
            splits.push({
                literal: bracketed,
                val: currentFull
            });
        }
        return splits;
    }
    static macroTokenToFormatOpts(token1) {
        return macroTokenToFormatOpts[token1];
    }
    constructor(locale, formatOpts){
        this.opts = formatOpts;
        this.loc = locale;
        this.systemLoc = null;
    }
    formatWithSystemDefault(dt1, opts1) {
        if (this.systemLoc === null) {
            this.systemLoc = this.loc.redefaultToSystem();
        }
        const df = this.systemLoc.dtFormatter(dt1, Object.assign({
        }, this.opts, opts1));
        return df.format();
    }
    formatDateTime(dt1, opts2 = {
    }) {
        const df = this.loc.dtFormatter(dt1, Object.assign({
        }, this.opts, opts2));
        return df.format();
    }
    formatDateTimeParts(dt2, opts3 = {
    }) {
        const df = this.loc.dtFormatter(dt2, Object.assign({
        }, this.opts, opts3));
        return df.formatToParts();
    }
    resolvedOptions(dt3, opts4 = {
    }) {
        const df = this.loc.dtFormatter(dt3, Object.assign({
        }, this.opts, opts4));
        return df.resolvedOptions();
    }
    num(n2, p1 = 0) {
        if (this.opts.forceSimple) {
            return padStart(n2, p1);
        }
        const opts = Object.assign({
        }, this.opts);
        if (p1 > 0) {
            opts.padTo = p1;
        }
        return this.loc.numberFormatter(opts).format(n2);
    }
    formatDateTimeFromString(dt4, fmt1) {
        const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory" && hasFormatToParts(), string = (opts, extract)=>this.loc.extract(dt4, opts, extract)
        , formatOffset = (opts)=>{
            if (dt4.isOffsetFixed && dt4.offset === 0 && opts.allowZ) {
                return "Z";
            }
            return dt4.isValid ? dt4.zone.formatOffset(dt4.ts, opts.format) : "";
        }, meridiem = ()=>knownEnglish ? meridiemForDateTime(dt4) : string({
                hour: "numeric",
                hour12: true
            }, "dayperiod")
        , month = (length, standalone)=>knownEnglish ? monthForDateTime(dt4, length) : string(standalone ? {
                month: length
            } : {
                month: length,
                day: "numeric"
            }, "month")
        , weekday = (length, standalone)=>knownEnglish ? weekdayForDateTime(dt4, length) : string(standalone ? {
                weekday: length
            } : {
                weekday: length,
                month: "long",
                day: "numeric"
            }, "weekday")
        , maybeMacro = (token)=>{
            const formatOpts = Formatter.macroTokenToFormatOpts(token);
            if (formatOpts) {
                return this.formatWithSystemDefault(dt4, formatOpts);
            } else {
                return token;
            }
        }, era = (length)=>knownEnglish ? eraForDateTime(dt4, length) : string({
                era: length
            }, "era")
        , tokenToString = (token)=>{
            switch(token){
                case "S":
                    return this.num(dt4.millisecond);
                case "u":
                case "SSS":
                    return this.num(dt4.millisecond, 3);
                case "s":
                    return this.num(dt4.second);
                case "ss":
                    return this.num(dt4.second, 2);
                case "m":
                    return this.num(dt4.minute);
                case "mm":
                    return this.num(dt4.minute, 2);
                case "h":
                    return this.num(dt4.hour % 12 === 0 ? 12 : dt4.hour % 12);
                case "hh":
                    return this.num(dt4.hour % 12 === 0 ? 12 : dt4.hour % 12, 2);
                case "H":
                    return this.num(dt4.hour);
                case "HH":
                    return this.num(dt4.hour, 2);
                case "Z":
                    return formatOffset({
                        format: "narrow",
                        allowZ: this.opts.allowZ
                    });
                case "ZZ":
                    return formatOffset({
                        format: "short",
                        allowZ: this.opts.allowZ
                    });
                case "ZZZ":
                    return formatOffset({
                        format: "techie",
                        allowZ: this.opts.allowZ
                    });
                case "ZZZZ":
                    return dt4.zone.offsetName(dt4.ts, {
                        format: "short",
                        locale: this.loc.locale
                    });
                case "ZZZZZ":
                    return dt4.zone.offsetName(dt4.ts, {
                        format: "long",
                        locale: this.loc.locale
                    });
                case "z":
                    return dt4.zoneName;
                case "a":
                    return meridiem();
                case "d":
                    return useDateTimeFormatter ? string({
                        day: "numeric"
                    }, "day") : this.num(dt4.day);
                case "dd":
                    return useDateTimeFormatter ? string({
                        day: "2-digit"
                    }, "day") : this.num(dt4.day, 2);
                case "c":
                    return this.num(dt4.weekday);
                case "ccc":
                    return weekday("short", true);
                case "cccc":
                    return weekday("long", true);
                case "ccccc":
                    return weekday("narrow", true);
                case "E":
                    return this.num(dt4.weekday);
                case "EEE":
                    return weekday("short", false);
                case "EEEE":
                    return weekday("long", false);
                case "EEEEE":
                    return weekday("narrow", false);
                case "L":
                    return useDateTimeFormatter ? string({
                        month: "numeric",
                        day: "numeric"
                    }, "month") : this.num(dt4.month);
                case "LL":
                    return useDateTimeFormatter ? string({
                        month: "2-digit",
                        day: "numeric"
                    }, "month") : this.num(dt4.month, 2);
                case "LLL":
                    return month("short", true);
                case "LLLL":
                    return month("long", true);
                case "LLLLL":
                    return month("narrow", true);
                case "M":
                    return useDateTimeFormatter ? string({
                        month: "numeric"
                    }, "month") : this.num(dt4.month);
                case "MM":
                    return useDateTimeFormatter ? string({
                        month: "2-digit"
                    }, "month") : this.num(dt4.month, 2);
                case "MMM":
                    return month("short", false);
                case "MMMM":
                    return month("long", false);
                case "MMMMM":
                    return month("narrow", false);
                case "y":
                    return useDateTimeFormatter ? string({
                        year: "numeric"
                    }, "year") : this.num(dt4.year);
                case "yy":
                    return useDateTimeFormatter ? string({
                        year: "2-digit"
                    }, "year") : this.num(dt4.year.toString().slice(-2), 2);
                case "yyyy":
                    return useDateTimeFormatter ? string({
                        year: "numeric"
                    }, "year") : this.num(dt4.year, 4);
                case "yyyyyy":
                    return useDateTimeFormatter ? string({
                        year: "numeric"
                    }, "year") : this.num(dt4.year, 6);
                case "G":
                    return era("short");
                case "GG":
                    return era("long");
                case "GGGGG":
                    return era("narrow");
                case "kk":
                    return this.num(dt4.weekYear.toString().slice(-2), 2);
                case "kkkk":
                    return this.num(dt4.weekYear, 4);
                case "W":
                    return this.num(dt4.weekNumber);
                case "WW":
                    return this.num(dt4.weekNumber, 2);
                case "o":
                    return this.num(dt4.ordinal);
                case "ooo":
                    return this.num(dt4.ordinal, 3);
                case "q":
                    return this.num(dt4.quarter);
                case "qq":
                    return this.num(dt4.quarter, 2);
                case "X":
                    return this.num(Math.floor(dt4.ts / 1000));
                case "x":
                    return this.num(dt4.ts);
                default:
                    return maybeMacro(token);
            }
        };
        return stringifyTokens(Formatter.parseFormat(fmt1), tokenToString);
    }
    formatDurationFromString(dur1, fmt2) {
        const tokenToField = (token)=>{
            switch(token[0]){
                case "S":
                    return "millisecond";
                case "s":
                    return "second";
                case "m":
                    return "minute";
                case "h":
                    return "hour";
                case "d":
                    return "day";
                case "M":
                    return "month";
                case "y":
                    return "year";
                default:
                    return null;
            }
        }, tokenToString = (lildur)=>(token)=>{
                const mapped = tokenToField(token);
                if (mapped) {
                    return this.num(lildur.get(mapped), token.length);
                } else {
                    return token;
                }
            }
        , tokens = Formatter.parseFormat(fmt2), realTokens = tokens.reduce((found, { literal , val  })=>literal ? found : found.concat(val)
        , []), collapsed = dur1.shiftTo(...realTokens.map(tokenToField).filter((t)=>t
        ));
        return stringifyTokens(tokens, tokenToString(collapsed));
    }
}
class Zone {
    get type() {
        throw new ZoneIsAbstractError();
    }
    get name() {
        throw new ZoneIsAbstractError();
    }
    get universal() {
        throw new ZoneIsAbstractError();
    }
    offsetName(ts6, opts7) {
        throw new ZoneIsAbstractError();
    }
    formatOffset(ts1, format4) {
        throw new ZoneIsAbstractError();
    }
    offset(ts2) {
        throw new ZoneIsAbstractError();
    }
    equals(otherZone) {
        throw new ZoneIsAbstractError();
    }
    get isValid() {
        throw new ZoneIsAbstractError();
    }
}
let singleton = null;
class FixedOffsetZone extends Zone {
    static get utcInstance() {
        if (singleton === null) {
            singleton = new FixedOffsetZone(0);
        }
        return singleton;
    }
    static instance(offset12) {
        return offset12 === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset12);
    }
    static parseSpecifier(s3) {
        if (s3) {
            const r = s3.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
            if (r) {
                return new FixedOffsetZone(signedOffset(r[1], r[2]));
            }
        }
        return null;
    }
    constructor(offset){
        super();
        this.fixed = offset;
    }
    get type() {
        return "fixed";
    }
    get name() {
        return this.fixed === 0 ? "UTC" : `UTC${formatOffset(this.fixed, "narrow")}`;
    }
    offsetName() {
        return this.name;
    }
    formatOffset(ts3, format1) {
        return formatOffset(this.fixed, format1);
    }
    get universal() {
        return true;
    }
    offset() {
        return this.fixed;
    }
    equals(otherZone1) {
        return otherZone1.type === "fixed" && otherZone1.fixed === this.fixed;
    }
    get isValid() {
        return true;
    }
}
const matchingRegex = RegExp(`^${ianaRegex.source}$`);
let dtfCache = {
};
function makeDTF(zone) {
    if (!dtfCache[zone]) {
        dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
            hour12: false,
            timeZone: zone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }
    return dtfCache[zone];
}
const typeToPos = {
    year: 0,
    month: 1,
    day: 2,
    hour: 3,
    minute: 4,
    second: 5
};
function hackyOffset(dtf, date) {
    const formatted = dtf.format(date).replace(/\u200E/g, ""), parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted), [, fMonth, fDay, fYear, fHour, fMinute, fSecond] = parsed;
    return [
        fYear,
        fMonth,
        fDay,
        fHour,
        fMinute,
        fSecond
    ];
}
function partsOffset(dtf, date) {
    const formatted = dtf.formatToParts(date), filled = [];
    for(let i = 0; i < formatted.length; i++){
        const { type , value  } = formatted[i], pos = typeToPos[type];
        if (!isUndefined(pos)) {
            filled[pos] = parseInt(value, 10);
        }
    }
    return filled;
}
let ianaZoneCache = {
};
class IANAZone extends Zone {
    static create(name1) {
        if (!ianaZoneCache[name1]) {
            ianaZoneCache[name1] = new IANAZone(name1);
        }
        return ianaZoneCache[name1];
    }
    static resetCache() {
        ianaZoneCache = {
        };
        dtfCache = {
        };
    }
    static isValidSpecifier(s2) {
        return !!(s2 && s2.match(matchingRegex));
    }
    static isValidZone(zone1) {
        try {
            new Intl.DateTimeFormat("en-US", {
                timeZone: zone1
            }).format();
            return true;
        } catch (e) {
            return false;
        }
    }
    static parseGMTOffset(specifier) {
        if (specifier) {
            const match = specifier.match(/^Etc\/GMT([+-]\d{1,2})$/i);
            if (match) {
                return -60 * parseInt(match[1]);
            }
        }
        return null;
    }
    constructor(name){
        super();
        this.zoneName = name;
        this.valid = IANAZone.isValidZone(name);
    }
    get type() {
        return "iana";
    }
    get name() {
        return this.zoneName;
    }
    get universal() {
        return false;
    }
    offsetName(ts4, { format: format2 , locale: locale8  }) {
        return parseZoneInfo(ts4, format2, locale8, this.name);
    }
    formatOffset(ts11, format1) {
        return formatOffset(this.offset(ts11), format1);
    }
    offset(ts21) {
        const date = new Date(ts21), dtf = makeDTF(this.name), [year, month, day, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date), adjustedHour = hour === 24 ? 0 : hour;
        const asUTC = objToLocalTS({
            year,
            month,
            day,
            hour: adjustedHour,
            minute,
            second,
            millisecond: 0
        });
        let asTS = +date;
        const over = asTS % 1000;
        asTS -= over >= 0 ? over : 1000 + over;
        return (asUTC - asTS) / (60 * 1000);
    }
    equals(otherZone2) {
        return otherZone2.type === "iana" && otherZone2.name === this.name;
    }
    get isValid() {
        return this.valid;
    }
}
const numberingSystems = {
    arab: "[\u0660-\u0669]",
    arabext: "[\u06F0-\u06F9]",
    bali: "[\u1B50-\u1B59]",
    beng: "[\u09E6-\u09EF]",
    deva: "[\u0966-\u096F]",
    fullwide: "[\uFF10-\uFF19]",
    gujr: "[\u0AE6-\u0AEF]",
    hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
    khmr: "[\u17E0-\u17E9]",
    knda: "[\u0CE6-\u0CEF]",
    laoo: "[\u0ED0-\u0ED9]",
    limb: "[\u1946-\u194F]",
    mlym: "[\u0D66-\u0D6F]",
    mong: "[\u1810-\u1819]",
    mymr: "[\u1040-\u1049]",
    orya: "[\u0B66-\u0B6F]",
    tamldec: "[\u0BE6-\u0BEF]",
    telu: "[\u0C66-\u0C6F]",
    thai: "[\u0E50-\u0E59]",
    tibt: "[\u0F20-\u0F29]",
    latn: "\\d"
};
const numberingSystemsUTF16 = {
    arab: [
        1632,
        1641
    ],
    arabext: [
        1776,
        1785
    ],
    bali: [
        6992,
        7001
    ],
    beng: [
        2534,
        2543
    ],
    deva: [
        2406,
        2415
    ],
    fullwide: [
        65296,
        65303
    ],
    gujr: [
        2790,
        2799
    ],
    khmr: [
        6112,
        6121
    ],
    knda: [
        3302,
        3311
    ],
    laoo: [
        3792,
        3801
    ],
    limb: [
        6470,
        6479
    ],
    mlym: [
        3430,
        3439
    ],
    mong: [
        6160,
        6169
    ],
    mymr: [
        4160,
        4169
    ],
    orya: [
        2918,
        2927
    ],
    tamldec: [
        3046,
        3055
    ],
    telu: [
        3174,
        3183
    ],
    thai: [
        3664,
        3673
    ],
    tibt: [
        3872,
        3881
    ]
};
const hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
function parseDigits(str) {
    let value = parseInt(str, 10);
    if (isNaN(value)) {
        value = "";
        for(let i = 0; i < str.length; i++){
            const code = str.charCodeAt(i);
            if (str[i].search(numberingSystems.hanidec) !== -1) {
                value += hanidecChars.indexOf(str[i]);
            } else {
                for(const key in numberingSystemsUTF16){
                    const [min, max] = numberingSystemsUTF16[key];
                    if (code >= min && code <= max) {
                        value += code - min;
                    }
                }
            }
        }
        return parseInt(value, 10);
    } else {
        return value;
    }
}
function digitRegex({ numberingSystem  }, append = "") {
    return new RegExp(`${numberingSystems[numberingSystem || "latn"]}${append}`);
}
class InvalidZone extends Zone {
    constructor(zoneName){
        super();
        this.zoneName = zoneName;
    }
    get type() {
        return "invalid";
    }
    get name() {
        return this.zoneName;
    }
    get universal() {
        return false;
    }
    offsetName() {
        return null;
    }
    formatOffset() {
        return "";
    }
    offset() {
        return NaN;
    }
    equals() {
        return false;
    }
    get isValid() {
        return false;
    }
}
function normalizeZone(input, defaultZone) {
    let offset;
    if (isUndefined(input) || input === null) {
        return defaultZone;
    } else if (input instanceof Zone) {
        return input;
    } else if (isString(input)) {
        const lowered = input.toLowerCase();
        if (lowered === "local") return defaultZone;
        else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;
        else if ((offset = IANAZone.parseGMTOffset(input)) != null) {
            return FixedOffsetZone.instance(offset);
        } else if (IANAZone.isValidSpecifier(lowered)) return IANAZone.create(input);
        else return FixedOffsetZone.parseSpecifier(lowered) || new InvalidZone(input);
    } else if (isNumber(input)) {
        return FixedOffsetZone.instance(input);
    } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
        return input;
    } else {
        return new InvalidZone(input);
    }
}
class Invalid {
    constructor(reason, explanation){
        this.reason = reason;
        this.explanation = explanation;
    }
    toMessage() {
        if (this.explanation) {
            return `${this.reason}: ${this.explanation}`;
        } else {
            return this.reason;
        }
    }
}
let singleton1 = null;
class LocalZone extends Zone {
    static get instance() {
        if (singleton1 === null) {
            singleton1 = new LocalZone();
        }
        return singleton1;
    }
    get type() {
        return "local";
    }
    get name() {
        if (hasIntl()) {
            return new Intl.DateTimeFormat().resolvedOptions().timeZone;
        } else return "local";
    }
    get universal() {
        return false;
    }
    offsetName(ts5, { format: format3 , locale: locale2  }) {
        return parseZoneInfo(ts5, format3, locale2);
    }
    formatOffset(ts12, format11) {
        return formatOffset(this.offset(ts12), format11);
    }
    offset(ts22) {
        return -new Date(ts22).getTimezoneOffset();
    }
    equals(otherZone3) {
        return otherZone3.type === "local";
    }
    get isValid() {
        return true;
    }
}
function combineRegexes(...regexes) {
    const full = regexes.reduce((f, r)=>f + r.source
    , "");
    return RegExp(`^${full}$`);
}
function combineExtractors(...extractors) {
    return (m)=>extractors.reduce(([mergedVals, mergedZone, cursor], ex)=>{
            const [val, zone, next] = ex(m, cursor);
            return [
                Object.assign(mergedVals, val),
                mergedZone || zone,
                next
            ];
        }, [
            {
            },
            null,
            1
        ]).slice(0, 2)
    ;
}
function parse(s, ...patterns) {
    if (s == null) {
        return [
            null,
            null
        ];
    }
    for (const [regex, extractor] of patterns){
        const m = regex.exec(s);
        if (m) {
            return extractor(m);
        }
    }
    return [
        null,
        null
    ];
}
function simpleParse(...keys) {
    return (match, cursor)=>{
        const ret = {
        };
        let i;
        for(i = 0; i < keys.length; i++){
            ret[keys[i]] = parseInteger(match[cursor + i]);
        }
        return [
            ret,
            null,
            cursor + i
        ];
    };
}
const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${offsetRegex.source}?`), isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`), isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/, isoOrdinalRegex = /(\d{4})-?(\d{3})/, extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay"), extractISOOrdinalData = simpleParse("year", "ordinal"), sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/, sqlTimeRegex = RegExp(`${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex.source}))?`), sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
function __int(match, pos, fallback) {
    const m = match[pos];
    return isUndefined(m) ? fallback : parseInteger(m);
}
function extractISOYmd(match, cursor) {
    const item = {
        year: __int(match, cursor),
        month: __int(match, cursor + 1, 1),
        day: __int(match, cursor + 2, 1)
    };
    return [
        item,
        null,
        cursor + 3
    ];
}
function extractISOTime(match, cursor) {
    const item = {
        hour: __int(match, cursor, 0),
        minute: __int(match, cursor + 1, 0),
        second: __int(match, cursor + 2, 0),
        millisecond: parseMillis(match[cursor + 3])
    };
    return [
        item,
        null,
        cursor + 4
    ];
}
function extractISOOffset(match, cursor) {
    const local = !match[cursor] && !match[cursor + 1], fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]), zone = local ? null : FixedOffsetZone.instance(fullOffset);
    return [
        {
        },
        zone,
        cursor + 3
    ];
}
function extractIANAZone(match, cursor) {
    const zone = match[cursor] ? IANAZone.create(match[cursor]) : null;
    return [
        {
        },
        zone,
        cursor + 1
    ];
}
const isoDuration = /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;
function extractISODuration(match) {
    const [s, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match;
    const hasNegativePrefix = s[0] === "-";
    const maybeNegate = (num)=>num && hasNegativePrefix ? -num : num
    ;
    return [
        {
            years: maybeNegate(parseInteger(yearStr)),
            months: maybeNegate(parseInteger(monthStr)),
            weeks: maybeNegate(parseInteger(weekStr)),
            days: maybeNegate(parseInteger(dayStr)),
            hours: maybeNegate(parseInteger(hourStr)),
            minutes: maybeNegate(parseInteger(minuteStr)),
            seconds: maybeNegate(parseInteger(secondStr)),
            milliseconds: maybeNegate(parseMillis(millisecondsStr))
        }
    ];
}
const obsOffsets = {
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
function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    const result = {
        year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
        month: monthsShort.indexOf(monthStr) + 1,
        day: parseInteger(dayStr),
        hour: parseInteger(hourStr),
        minute: parseInteger(minuteStr)
    };
    if (secondStr) result.second = parseInteger(secondStr);
    if (weekdayStr) {
        result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
    }
    return result;
}
const rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
function extractRFC2822(match) {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr, obsOffset, milOffset, offHourStr, offMinuteStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    let offset;
    if (obsOffset) {
        offset = obsOffsets[obsOffset];
    } else if (milOffset) {
        offset = 0;
    } else {
        offset = signedOffset(offHourStr, offMinuteStr);
    }
    return [
        result,
        new FixedOffsetZone(offset)
    ];
}
function preprocessRFC2822(s) {
    return s.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
}
const rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
function extractRFC1123Or850(match) {
    const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [
        result,
        FixedOffsetZone.utcInstance
    ];
}
function extractASCII(match) {
    const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
    return [
        result,
        FixedOffsetZone.utcInstance
    ];
}
const isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
const isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
const isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
const isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
const extractISOYmdTimeAndOffset = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset);
const extractISOWeekTimeAndOffset = combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset);
const extractISOOrdinalDataAndTime = combineExtractors(extractISOOrdinalData, extractISOTime);
const extractISOTimeAndOffset = combineExtractors(extractISOTime, extractISOOffset);
function parseISODate(s) {
    return parse(s, [
        isoYmdWithTimeExtensionRegex,
        extractISOYmdTimeAndOffset
    ], [
        isoWeekWithTimeExtensionRegex,
        extractISOWeekTimeAndOffset
    ], [
        isoOrdinalWithTimeExtensionRegex,
        extractISOOrdinalDataAndTime
    ], [
        isoTimeCombinedRegex,
        extractISOTimeAndOffset
    ]);
}
function parseRFC2822Date(s) {
    return parse(preprocessRFC2822(s), [
        rfc2822,
        extractRFC2822
    ]);
}
function parseHTTPDate(s) {
    return parse(s, [
        rfc1123,
        extractRFC1123Or850
    ], [
        rfc850,
        extractRFC1123Or850
    ], [
        ascii,
        extractASCII
    ]);
}
function parseISODuration(s) {
    return parse(s, [
        isoDuration,
        extractISODuration
    ]);
}
const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
const extractISOYmdTimeOffsetAndIANAZone = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
const extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
function parseSQL(s) {
    return parse(s, [
        sqlYmdWithTimeExtensionRegex,
        extractISOYmdTimeOffsetAndIANAZone
    ], [
        sqlTimeCombinedRegex,
        extractISOTimeOffsetAndIANAZone
    ]);
}
const nonLeapLadder = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334
], leapLadder = [
    0,
    31,
    60,
    91,
    121,
    152,
    182,
    213,
    244,
    274,
    305,
    335
];
function unitOutOfRange(unit, value) {
    return new Invalid("unit out of range", `you specified ${value} (of type ${typeof value}) as a ${unit}, which is invalid`);
}
function dayOfWeek(year, month, day) {
    const js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    return js === 0 ? 7 : js;
}
function computeOrdinal(year, month, day) {
    return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
}
function uncomputeOrdinal(year, ordinal) {
    const table = isLeapYear(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i)=>i < ordinal
    ), day = ordinal - table[month0];
    return {
        month: month0 + 1,
        day
    };
}
function gregorianToWeek(gregObj) {
    const { year , month , day  } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = dayOfWeek(year, month, day);
    let weekNumber = Math.floor((ordinal - weekday + 10) / 7), weekYear;
    if (weekNumber < 1) {
        weekYear = year - 1;
        weekNumber = weeksInWeekYear(weekYear);
    } else if (weekNumber > weeksInWeekYear(year)) {
        weekYear = year + 1;
        weekNumber = 1;
    } else {
        weekYear = year;
    }
    return Object.assign({
        weekYear,
        weekNumber,
        weekday
    }, timeObject(gregObj));
}
function weekToGregorian(weekData) {
    const { weekYear , weekNumber , weekday  } = weekData, weekdayOfJan4 = dayOfWeek(weekYear, 1, 4), yearInDays = daysInYear(weekYear);
    let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3, year;
    if (ordinal < 1) {
        year = weekYear - 1;
        ordinal += daysInYear(year);
    } else if (ordinal > yearInDays) {
        year = weekYear + 1;
        ordinal -= daysInYear(weekYear);
    } else {
        year = weekYear;
    }
    const { month , day  } = uncomputeOrdinal(year, ordinal);
    return Object.assign({
        year,
        month,
        day
    }, timeObject(weekData));
}
function gregorianToOrdinal(gregData) {
    const { year , month , day  } = gregData, ordinal = computeOrdinal(year, month, day);
    return Object.assign({
        year,
        ordinal
    }, timeObject(gregData));
}
function ordinalToGregorian(ordinalData) {
    const { year , ordinal  } = ordinalData, { month , day  } = uncomputeOrdinal(year, ordinal);
    return Object.assign({
        year,
        month,
        day
    }, timeObject(ordinalData));
}
function hasInvalidWeekData(obj) {
    const validYear = isInteger(obj.weekYear), validWeek = integerBetween(obj.weekNumber, 1, weeksInWeekYear(obj.weekYear)), validWeekday = integerBetween(obj.weekday, 1, 7);
    if (!validYear) {
        return unitOutOfRange("weekYear", obj.weekYear);
    } else if (!validWeek) {
        return unitOutOfRange("week", obj.week);
    } else if (!validWeekday) {
        return unitOutOfRange("weekday", obj.weekday);
    } else return false;
}
function hasInvalidOrdinalData(obj) {
    const validYear = isInteger(obj.year), validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));
    if (!validYear) {
        return unitOutOfRange("year", obj.year);
    } else if (!validOrdinal) {
        return unitOutOfRange("ordinal", obj.ordinal);
    } else return false;
}
function hasInvalidGregorianData(obj) {
    const validYear = isInteger(obj.year), validMonth = integerBetween(obj.month, 1, 12), validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));
    if (!validYear) {
        return unitOutOfRange("year", obj.year);
    } else if (!validMonth) {
        return unitOutOfRange("month", obj.month);
    } else if (!validDay) {
        return unitOutOfRange("day", obj.day);
    } else return false;
}
function hasInvalidTimeData(obj) {
    const { hour , minute , second , millisecond  } = obj;
    const validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween(minute, 0, 59), validSecond = integerBetween(second, 0, 59), validMillisecond = integerBetween(millisecond, 0, 999);
    if (!validHour) {
        return unitOutOfRange("hour", hour);
    } else if (!validMinute) {
        return unitOutOfRange("minute", minute);
    } else if (!validSecond) {
        return unitOutOfRange("second", second);
    } else if (!validMillisecond) {
        return unitOutOfRange("millisecond", millisecond);
    } else return false;
}
const INVALID = "Invalid DateTime";
const INVALID1 = "Invalid Duration";
let intlDTCache = {
};
let now = ()=>Date.now()
, defaultZone1 = null, defaultLocale = null, defaultNumberingSystem = null, defaultOutputCalendar = null, throwOnInvalid = false;
const INVALID2 = "Invalid Interval";
class Info {
    static hasDST(zone2 = Settings.defaultZone) {
        const proto = DateTime.local().setZone(zone2).set({
            month: 12
        });
        return !zone2.universal && proto.offset !== proto.set({
            month: 6
        }).offset;
    }
    static isValidIANAZone(zone1) {
        return IANAZone.isValidSpecifier(zone1) && IANAZone.isValidZone(zone1);
    }
    static normalizeZone(input1) {
        return normalizeZone(input1, Settings.defaultZone);
    }
    static months(length5 = "long", { locale: locale3 = null , numberingSystem: numberingSystem6 = null , outputCalendar: outputCalendar3 = "gregory"  } = {
    }) {
        return Locale.create(locale3, numberingSystem6, outputCalendar3).months(length5);
    }
    static monthsFormat(length1 = "long", { locale: locale11 = null , numberingSystem: numberingSystem1 = null , outputCalendar: outputCalendar1 = "gregory"  } = {
    }) {
        return Locale.create(locale11, numberingSystem1, outputCalendar1).months(length1, true);
    }
    static weekdays(length2 = "long", { locale: locale2 = null , numberingSystem: numberingSystem2 = null  } = {
    }) {
        return Locale.create(locale2, numberingSystem2, null).weekdays(length2);
    }
    static weekdaysFormat(length3 = "long", { locale: locale3 = null , numberingSystem: numberingSystem3 = null  } = {
    }) {
        return Locale.create(locale3, numberingSystem3, null).weekdays(length3, true);
    }
    static meridiems({ locale: locale4 = null  } = {
    }) {
        return Locale.create(locale4).meridiems();
    }
    static eras(length4 = "short", { locale: locale5 = null  } = {
    }) {
        return Locale.create(locale5, null, "gregory").eras(length4);
    }
    static features() {
        let intl = false, intlTokens = false, zones = false, relative = false;
        if (hasIntl()) {
            intl = true;
            intlTokens = hasFormatToParts();
            relative = hasRelative();
            try {
                zones = new Intl.DateTimeFormat("en", {
                    timeZone: "America/New_York"
                }).resolvedOptions().timeZone === "America/New_York";
            } catch (e) {
                zones = false;
            }
        }
        return {
            intl,
            intlTokens,
            zones,
            relative
        };
    }
}
const lowOrderMatrix = {
    weeks: {
        days: 7,
        hours: 7 * 24,
        minutes: 7 * 24 * 60,
        seconds: 7 * 24 * 60 * 60,
        milliseconds: 7 * 24 * 60 * 60 * 1000
    },
    days: {
        hours: 24,
        minutes: 24 * 60,
        seconds: 24 * 60 * 60,
        milliseconds: 24 * 60 * 60 * 1000
    },
    hours: {
        minutes: 60,
        seconds: 60 * 60,
        milliseconds: 60 * 60 * 1000
    },
    minutes: {
        seconds: 60,
        milliseconds: 60 * 1000
    },
    seconds: {
        milliseconds: 1000
    }
}, casualMatrix = Object.assign({
    years: {
        quarters: 4,
        months: 12,
        weeks: 52,
        days: 365,
        hours: 365 * 24,
        minutes: 365 * 24 * 60,
        seconds: 365 * 24 * 60 * 60,
        milliseconds: 365 * 24 * 60 * 60 * 1000
    },
    quarters: {
        months: 3,
        weeks: 13,
        days: 91,
        hours: 91 * 24,
        minutes: 91 * 24 * 60,
        seconds: 91 * 24 * 60 * 60,
        milliseconds: 91 * 24 * 60 * 60 * 1000
    },
    months: {
        weeks: 4,
        days: 30,
        hours: 30 * 24,
        minutes: 30 * 24 * 60,
        seconds: 30 * 24 * 60 * 60,
        milliseconds: 30 * 24 * 60 * 60 * 1000
    }
}, lowOrderMatrix), daysInYearAccurate = 146097 / 400, daysInMonthAccurate = 146097 / 4800, accurateMatrix = Object.assign({
    years: {
        quarters: 4,
        months: 12,
        weeks: daysInYearAccurate / 7,
        days: daysInYearAccurate,
        hours: daysInYearAccurate * 24,
        minutes: daysInYearAccurate * 24 * 60,
        seconds: daysInYearAccurate * 24 * 60 * 60,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000
    },
    quarters: {
        months: 3,
        weeks: daysInYearAccurate / 28,
        days: daysInYearAccurate / 4,
        hours: daysInYearAccurate * 24 / 4,
        minutes: daysInYearAccurate * 24 * 60 / 4,
        seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000 / 4
    },
    months: {
        weeks: daysInMonthAccurate / 7,
        days: daysInMonthAccurate,
        hours: daysInMonthAccurate * 24,
        minutes: daysInMonthAccurate * 24 * 60,
        seconds: daysInMonthAccurate * 24 * 60 * 60,
        milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000
    }
}, lowOrderMatrix);
const orderedUnits = [
    "years",
    "quarters",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
];
const reverseUnits = orderedUnits.slice(0).reverse();
function clone(dur, alts, clear = false) {
    const conf = {
        values: clear ? alts.values : Object.assign({
        }, dur.values, alts.values || {
        }),
        loc: dur.loc.clone(alts.loc),
        conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
    };
    return new Duration(conf);
}
function antiTrunc(n) {
    return n < 0 ? Math.floor(n) : Math.ceil(n);
}
function convert(matrix, fromMap, fromUnit, toMap, toUnit) {
    const conv = matrix[toUnit][fromUnit], raw = fromMap[fromUnit] / conv, sameSign = Math.sign(raw) === Math.sign(toMap[toUnit]), added = !sameSign && toMap[toUnit] !== 0 && Math.abs(raw) <= 1 ? antiTrunc(raw) : Math.trunc(raw);
    toMap[toUnit] += added;
    fromMap[fromUnit] -= added * conv;
}
function normalizeValues(matrix, vals) {
    reverseUnits.reduce((previous, current)=>{
        if (!isUndefined(vals[current])) {
            if (previous) {
                convert(matrix, vals, previous, vals, current);
            }
            return current;
        } else {
            return previous;
        }
    }, null);
}
class Duration {
    constructor(config){
        const accurate = config.conversionAccuracy === "longterm" || false;
        this.values = config.values;
        this.loc = config.loc || Locale.create();
        this.conversionAccuracy = accurate ? "longterm" : "casual";
        this.invalid = config.invalid || null;
        this.matrix = accurate ? accurateMatrix : casualMatrix;
        this.isLuxonDuration = true;
    }
    static fromMillis(count1, opts6) {
        return Duration.fromObject(Object.assign({
            milliseconds: count1
        }, opts6));
    }
    static fromObject(obj1) {
        if (obj1 == null || typeof obj1 !== "object") {
            throw new InvalidArgumentError(`Duration.fromObject: argument expected to be an object, got ${obj1 === null ? "null" : typeof obj1}`);
        }
        return new Duration({
            values: normalizeObject(obj1, Duration.normalizeUnit, [
                "locale",
                "numberingSystem",
                "conversionAccuracy",
                "zone"
            ]),
            loc: Locale.fromObject(obj1),
            conversionAccuracy: obj1.conversionAccuracy
        });
    }
    static fromISO(text1, opts11) {
        const [parsed] = parseISODuration(text1);
        if (parsed) {
            const obj = Object.assign(parsed, opts11);
            return Duration.fromObject(obj);
        } else {
            return Duration.invalid("unparsable", `the input "${text1}" can't be parsed as ISO 8601`);
        }
    }
    static invalid(reason, explanation = null) {
        if (!reason) {
            throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
        }
        const invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);
        if (Settings.throwOnInvalid) {
            throw new InvalidDurationError(invalid);
        } else {
            return new Duration({
                invalid
            });
        }
    }
    static normalizeUnit(unit3) {
        const normalized = {
            year: "years",
            years: "years",
            quarter: "quarters",
            quarters: "quarters",
            month: "months",
            months: "months",
            week: "weeks",
            weeks: "weeks",
            day: "days",
            days: "days",
            hour: "hours",
            hours: "hours",
            minute: "minutes",
            minutes: "minutes",
            second: "seconds",
            seconds: "seconds",
            millisecond: "milliseconds",
            milliseconds: "milliseconds"
        }[unit3 ? unit3.toLowerCase() : unit3];
        if (!normalized) throw new InvalidUnitError(unit3);
        return normalized;
    }
    static isDuration(o1) {
        return o1 && o1.isLuxonDuration || false;
    }
    get locale() {
        return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
    }
    toFormat(fmt3, opts21 = {
    }) {
        const fmtOpts = Object.assign({
        }, opts21, {
            floor: opts21.round !== false && opts21.floor !== false
        });
        return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt3) : INVALID1;
    }
    toObject(opts31 = {
    }) {
        if (!this.isValid) return {
        };
        const base = Object.assign({
        }, this.values);
        if (opts31.includeConfig) {
            base.conversionAccuracy = this.conversionAccuracy;
            base.numberingSystem = this.loc.numberingSystem;
            base.locale = this.loc.locale;
        }
        return base;
    }
    toISO() {
        if (!this.isValid) return null;
        let s = "P";
        if (this.years !== 0) s += this.years + "Y";
        if (this.months !== 0 || this.quarters !== 0) s += this.months + this.quarters * 3 + "M";
        if (this.weeks !== 0) s += this.weeks + "W";
        if (this.days !== 0) s += this.days + "D";
        if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) s += "T";
        if (this.hours !== 0) s += this.hours + "H";
        if (this.minutes !== 0) s += this.minutes + "M";
        if (this.seconds !== 0 || this.milliseconds !== 0) s += roundTo(this.seconds + this.milliseconds / 1000, 3) + "S";
        if (s === "P") s += "T0S";
        return s;
    }
    toJSON() {
        return this.toISO();
    }
    toString() {
        return this.toISO();
    }
    valueOf() {
        return this.as("milliseconds");
    }
    plus(duration4) {
        if (!this.isValid) return this;
        const dur = friendlyDuration(duration4), result = {
        };
        for (const k of orderedUnits){
            if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
                result[k] = dur.get(k) + this.get(k);
            }
        }
        return clone(this, {
            values: result
        }, true);
    }
    minus(duration1) {
        if (!this.isValid) return this;
        const dur = friendlyDuration(duration1);
        return this.plus(dur.negate());
    }
    mapUnits(fn) {
        if (!this.isValid) return this;
        const result = {
        };
        for (const k of Object.keys(this.values)){
            result[k] = asNumber(fn(this.values[k], k));
        }
        return clone(this, {
            values: result
        }, true);
    }
    get(unit11) {
        return this[Duration.normalizeUnit(unit11)];
    }
    set(values) {
        if (!this.isValid) return this;
        const mixed = Object.assign(this.values, normalizeObject(values, Duration.normalizeUnit, []));
        return clone(this, {
            values: mixed
        });
    }
    reconfigure({ locale: locale6 , numberingSystem: numberingSystem4 , conversionAccuracy  } = {
    }) {
        const loc = this.loc.clone({
            locale: locale6,
            numberingSystem: numberingSystem4
        }), opts = {
            loc
        };
        if (conversionAccuracy) {
            opts.conversionAccuracy = conversionAccuracy;
        }
        return clone(this, opts);
    }
    as(unit2) {
        return this.isValid ? this.shiftTo(unit2).get(unit2) : NaN;
    }
    normalize() {
        if (!this.isValid) return this;
        const vals = this.toObject();
        normalizeValues(this.matrix, vals);
        return clone(this, {
            values: vals
        }, true);
    }
    shiftTo(...units1) {
        if (!this.isValid) return this;
        if (units1.length === 0) {
            return this;
        }
        units1 = units1.map((u)=>Duration.normalizeUnit(u)
        );
        const built = {
        }, accumulated = {
        }, vals = this.toObject();
        let lastUnit;
        for (const k of orderedUnits){
            if (units1.indexOf(k) >= 0) {
                lastUnit = k;
                let own = 0;
                for(const ak in accumulated){
                    own += this.matrix[ak][k] * accumulated[ak];
                    accumulated[ak] = 0;
                }
                if (isNumber(vals[k])) {
                    own += vals[k];
                }
                const i = Math.trunc(own);
                built[k] = i;
                accumulated[k] = own - i;
                for(const down in vals){
                    if (orderedUnits.indexOf(down) > orderedUnits.indexOf(k)) {
                        convert(this.matrix, vals, down, built, k);
                    }
                }
            } else if (isNumber(vals[k])) {
                accumulated[k] = vals[k];
            }
        }
        for(const key in accumulated){
            if (accumulated[key] !== 0) {
                built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
            }
        }
        return clone(this, {
            values: built
        }, true).normalize();
    }
    negate() {
        if (!this.isValid) return this;
        const negated = {
        };
        for (const k of Object.keys(this.values)){
            negated[k] = -this.values[k];
        }
        return clone(this, {
            values: negated
        }, true);
    }
    get years() {
        return this.isValid ? this.values.years || 0 : NaN;
    }
    get quarters() {
        return this.isValid ? this.values.quarters || 0 : NaN;
    }
    get months() {
        return this.isValid ? this.values.months || 0 : NaN;
    }
    get weeks() {
        return this.isValid ? this.values.weeks || 0 : NaN;
    }
    get days() {
        return this.isValid ? this.values.days || 0 : NaN;
    }
    get hours() {
        return this.isValid ? this.values.hours || 0 : NaN;
    }
    get minutes() {
        return this.isValid ? this.values.minutes || 0 : NaN;
    }
    get seconds() {
        return this.isValid ? this.values.seconds || 0 : NaN;
    }
    get milliseconds() {
        return this.isValid ? this.values.milliseconds || 0 : NaN;
    }
    get isValid() {
        return this.invalid === null;
    }
    get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
    }
    equals(other) {
        if (!this.isValid || !other.isValid) {
            return false;
        }
        if (!this.loc.equals(other.loc)) {
            return false;
        }
        for (const u of orderedUnits){
            if (this.values[u] !== other.values[u]) {
                return false;
            }
        }
        return true;
    }
}
function dayDiff(earlier, later) {
    const utcDayStart = (dt)=>dt.toUTC(0, {
            keepLocalTime: true
        }).startOf("day").valueOf()
    , ms = utcDayStart(later) - utcDayStart(earlier);
    return Math.floor(Duration.fromMillis(ms).as("days"));
}
const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
function unsupportedZone(zone) {
    return new Invalid("unsupported zone", `the zone "${zone.name}" is not supported`);
}
function possiblyCachedWeekData(dt) {
    if (dt.weekData === null) {
        dt.weekData = gregorianToWeek(dt.c);
    }
    return dt.weekData;
}
function clone1(inst, alts) {
    const current = {
        ts: inst.ts,
        zone: inst.zone,
        c: inst.c,
        o: inst.o,
        loc: inst.loc,
        invalid: inst.invalid
    };
    return new DateTime(Object.assign({
    }, current, alts, {
        old: current
    }));
}
function fixOffset(localTS, o, tz) {
    let utcGuess = localTS - o * 60 * 1000;
    const o2 = tz.offset(utcGuess);
    if (o === o2) {
        return [
            utcGuess,
            o
        ];
    }
    utcGuess -= (o2 - o) * 60 * 1000;
    const o3 = tz.offset(utcGuess);
    if (o2 === o3) {
        return [
            utcGuess,
            o2
        ];
    }
    return [
        localTS - Math.min(o2, o3) * 60 * 1000,
        Math.max(o2, o3)
    ];
}
function tsToObj(ts, offset) {
    ts += offset * 60 * 1000;
    const d = new Date(ts);
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds(),
        millisecond: d.getUTCMilliseconds()
    };
}
function objToTS(obj, offset, zone) {
    return fixOffset(objToLocalTS(obj), offset, zone);
}
function adjustTime(inst, dur) {
    const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = Object.assign({
    }, inst.c, {
        year,
        month,
        day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
    }), millisToAdd = Duration.fromObject({
        years: dur.years - Math.trunc(dur.years),
        quarters: dur.quarters - Math.trunc(dur.quarters),
        months: dur.months - Math.trunc(dur.months),
        weeks: dur.weeks - Math.trunc(dur.weeks),
        days: dur.days - Math.trunc(dur.days),
        hours: dur.hours,
        minutes: dur.minutes,
        seconds: dur.seconds,
        milliseconds: dur.milliseconds
    }).as("milliseconds"), localTS = objToLocalTS(c);
    let [ts, o] = fixOffset(localTS, oPre, inst.zone);
    if (millisToAdd !== 0) {
        ts += millisToAdd;
        o = inst.zone.offset(ts);
    }
    return {
        ts,
        o
    };
}
function parseDataToDateTime(parsed, parsedZone, opts, format, text) {
    const { setZone , zone  } = opts;
    if (parsed && Object.keys(parsed).length !== 0) {
        const interpretationZone = parsedZone || zone, inst = DateTime.fromObject(Object.assign(parsed, opts, {
            zone: interpretationZone,
            setZone: undefined
        }));
        return setZone ? inst : inst.setZone(zone);
    } else {
        return DateTime.invalid(new Invalid("unparsable", `the input "${text}" can't be parsed as ${format}`));
    }
}
function toTechFormat(dt, format, allowZ = true) {
    return dt.isValid ? Formatter.create(Locale.create("en-US"), {
        allowZ,
        forceSimple: true
    }).formatDateTimeFromString(dt, format) : null;
}
function toTechTimeFormat(dt, { suppressSeconds =false , suppressMilliseconds =false , includeOffset , includeZone =false , spaceZone =false , format ="extended"  }) {
    let fmt = format === "basic" ? "HHmm" : "HH:mm";
    if (!suppressSeconds || dt.second !== 0 || dt.millisecond !== 0) {
        fmt += format === "basic" ? "ss" : ":ss";
        if (!suppressMilliseconds || dt.millisecond !== 0) {
            fmt += ".SSS";
        }
    }
    if ((includeZone || includeOffset) && spaceZone) {
        fmt += " ";
    }
    if (includeZone) {
        fmt += "z";
    } else if (includeOffset) {
        fmt += format === "basic" ? "ZZZ" : "ZZ";
    }
    return toTechFormat(dt, fmt);
}
const defaultUnitValues = {
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
}, defaultWeekUnitValues = {
    weekNumber: 1,
    weekday: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
}, defaultOrdinalUnitValues = {
    ordinal: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0
};
const orderedUnits1 = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
], orderedWeekUnits = [
    "weekYear",
    "weekNumber",
    "weekday",
    "hour",
    "minute",
    "second",
    "millisecond"
], orderedOrdinalUnits = [
    "year",
    "ordinal",
    "hour",
    "minute",
    "second",
    "millisecond"
];
function normalizeUnit(unit) {
    const normalized = {
        year: "year",
        years: "year",
        month: "month",
        months: "month",
        day: "day",
        days: "day",
        hour: "hour",
        hours: "hour",
        minute: "minute",
        minutes: "minute",
        quarter: "quarter",
        quarters: "quarter",
        second: "second",
        seconds: "second",
        millisecond: "millisecond",
        milliseconds: "millisecond",
        weekday: "weekday",
        weekdays: "weekday",
        weeknumber: "weekNumber",
        weeksnumber: "weekNumber",
        weeknumbers: "weekNumber",
        weekyear: "weekYear",
        weekyears: "weekYear",
        ordinal: "ordinal"
    }[unit.toLowerCase()];
    if (!normalized) throw new InvalidUnitError(unit);
    return normalized;
}
function quickDT(obj, zone) {
    for (const u of orderedUnits1){
        if (isUndefined(obj[u])) {
            obj[u] = defaultUnitValues[u];
        }
    }
    const invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);
    if (invalid) {
        return DateTime.invalid(invalid);
    }
    const tsNow = Settings.now(), offsetProvis = zone.offset(tsNow), [ts, o] = objToTS(obj, offsetProvis, zone);
    return new DateTime({
        ts,
        zone,
        o
    });
}
function diffRelative(start, end, opts) {
    const round = isUndefined(opts.round) ? true : opts.round, format = (c, unit)=>{
        c = roundTo(c, round || opts.calendary ? 0 : 2, true);
        const formatter = end.loc.clone(opts).relFormatter(opts);
        return formatter.format(c, unit);
    }, differ = (unit)=>{
        if (opts.calendary) {
            if (!end.hasSame(start, unit)) {
                return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
            } else return 0;
        } else {
            return end.diff(start, unit).get(unit);
        }
    };
    if (opts.unit) {
        return format(differ(opts.unit), opts.unit);
    }
    for (const unit1 of opts.units){
        const count = differ(unit1);
        if (Math.abs(count) >= 1) {
            return format(count, unit1);
        }
    }
    return format(0, opts.units[opts.units.length - 1]);
}
function friendlyDuration(durationish) {
    if (isNumber(durationish)) {
        return Duration.fromMillis(durationish);
    } else if (Duration.isDuration(durationish)) {
        return durationish;
    } else if (typeof durationish === "object") {
        return Duration.fromObject(durationish);
    } else {
        throw new InvalidArgumentError(`Unknown duration argument ${durationish} of type ${typeof durationish}`);
    }
}
class DateTime {
    constructor(config){
        const zone = config.zone || Settings.defaultZone;
        let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
        this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
        let c = null, o = null;
        if (!invalid) {
            const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);
            if (unchanged) {
                [c, o] = [
                    config.old.c,
                    config.old.o
                ];
            } else {
                const ot = zone.offset(this.ts);
                c = tsToObj(this.ts, ot);
                invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
                c = invalid ? null : c;
                o = invalid ? null : ot;
            }
        }
        this._zone = zone;
        this.loc = config.loc || Locale.create();
        this.invalid = invalid;
        this.weekData = null;
        this.c = c;
        this.o = o;
        this.isLuxonDateTime = true;
    }
    static local(year, month, day, hour, minute, second, millisecond) {
        if (isUndefined(year)) {
            return new DateTime({
                ts: Settings.now()
            });
        } else {
            return quickDT({
                year,
                month,
                day,
                hour,
                minute,
                second,
                millisecond
            }, Settings.defaultZone);
        }
    }
    static utc(year1, month1, day1, hour1, minute1, second1, millisecond1) {
        if (isUndefined(year1)) {
            return new DateTime({
                ts: Settings.now(),
                zone: FixedOffsetZone.utcInstance
            });
        } else {
            return quickDT({
                year: year1,
                month: month1,
                day: day1,
                hour: hour1,
                minute: minute1,
                second: second1,
                millisecond: millisecond1
            }, FixedOffsetZone.utcInstance);
        }
    }
    static fromJSDate(date, options7 = {
    }) {
        const ts = isDate(date) ? date.valueOf() : NaN;
        if (Number.isNaN(ts)) {
            return DateTime.invalid("invalid input");
        }
        const zoneToUse = normalizeZone(options7.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
            return DateTime.invalid(unsupportedZone(zoneToUse));
        }
        return new DateTime({
            ts: ts,
            zone: zoneToUse,
            loc: Locale.fromObject(options7)
        });
    }
    static fromMillis(milliseconds, options1 = {
    }) {
        if (!isNumber(milliseconds)) {
            throw new InvalidArgumentError(`fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`);
        } else if (milliseconds < -8640000000000000 || milliseconds > 8640000000000000) {
            return DateTime.invalid("Timestamp out of range");
        } else {
            return new DateTime({
                ts: milliseconds,
                zone: normalizeZone(options1.zone, Settings.defaultZone),
                loc: Locale.fromObject(options1)
            });
        }
    }
    static fromSeconds(seconds, options2 = {
    }) {
        if (!isNumber(seconds)) {
            throw new InvalidArgumentError("fromSeconds requires a numerical input");
        } else {
            return new DateTime({
                ts: seconds * 1000,
                zone: normalizeZone(options2.zone, Settings.defaultZone),
                loc: Locale.fromObject(options2)
            });
        }
    }
    static fromObject(obj) {
        const zoneToUse = normalizeZone(obj.zone, Settings.defaultZone);
        if (!zoneToUse.isValid) {
            return DateTime.invalid(unsupportedZone(zoneToUse));
        }
        const tsNow = Settings.now(), offsetProvis = zoneToUse.offset(tsNow), normalized = normalizeObject(obj, normalizeUnit, [
            "zone",
            "locale",
            "outputCalendar",
            "numberingSystem"
        ]), containsOrdinal = !isUndefined(normalized.ordinal), containsGregorYear = !isUndefined(normalized.year), containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber, loc = Locale.fromObject(obj);
        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
            throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
        }
        if (containsGregorMD && containsOrdinal) {
            throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }
        const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
        let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
        if (useWeekData) {
            units = orderedWeekUnits;
            defaultValues = defaultWeekUnitValues;
            objNow = gregorianToWeek(objNow);
        } else if (containsOrdinal) {
            units = orderedOrdinalUnits;
            defaultValues = defaultOrdinalUnitValues;
            objNow = gregorianToOrdinal(objNow);
        } else {
            units = orderedUnits1;
            defaultValues = defaultUnitValues;
        }
        let foundFirst = false;
        for (const u of units){
            const v = normalized[u];
            if (!isUndefined(v)) {
                foundFirst = true;
            } else if (foundFirst) {
                normalized[u] = defaultValues[u];
            } else {
                normalized[u] = objNow[u];
            }
        }
        const higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized), invalid = higherOrderInvalid || hasInvalidTimeData(normalized);
        if (invalid) {
            return DateTime.invalid(invalid);
        }
        const gregorian = useWeekData ? weekToGregorian(normalized) : containsOrdinal ? ordinalToGregorian(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime({
            ts: tsFinal,
            zone: zoneToUse,
            o: offsetFinal,
            loc
        });
        if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
            return DateTime.invalid("mismatched weekday", `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`);
        }
        return inst;
    }
    static fromISO(text, opts16 = {
    }) {
        const [vals, parsedZone] = parseISODate(text);
        return parseDataToDateTime(vals, parsedZone, opts16, "ISO 8601", text);
    }
    static fromRFC2822(text1, opts12 = {
    }) {
        const [vals, parsedZone] = parseRFC2822Date(text1);
        return parseDataToDateTime(vals, parsedZone, opts12, "RFC 2822", text1);
    }
    static fromHTTP(text2, opts22 = {
    }) {
        const [vals, parsedZone] = parseHTTPDate(text2);
        return parseDataToDateTime(vals, parsedZone, opts22, "HTTP", opts22);
    }
    static fromFormat(text3, fmt, opts32 = {
    }) {
        if (isUndefined(text3) || isUndefined(fmt)) {
            throw new InvalidArgumentError("fromFormat requires an input string and a format");
        }
        const { locale =null , numberingSystem =null  } = opts32, localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true
        }), [vals, parsedZone, invalid] = parseFromTokens(localeToUse, text3, fmt);
        if (invalid) {
            return DateTime.invalid(invalid);
        } else {
            return parseDataToDateTime(vals, parsedZone, opts32, `format ${fmt}`, text3);
        }
    }
    static fromString(text4, fmt11, opts41 = {
    }) {
        return DateTime.fromFormat(text4, fmt11, opts41);
    }
    static fromSQL(text5, opts51 = {
    }) {
        const [vals, parsedZone] = parseSQL(text5);
        return parseDataToDateTime(vals, parsedZone, opts51, "SQL", text5);
    }
    static invalid(reason1, explanation1 = null) {
        if (!reason1) {
            throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
        }
        const invalid = reason1 instanceof Invalid ? reason1 : new Invalid(reason1, explanation1);
        if (Settings.throwOnInvalid) {
            throw new InvalidDateTimeError(invalid);
        } else {
            return new DateTime({
                invalid
            });
        }
    }
    static isDateTime(o) {
        return o && o.isLuxonDateTime || false;
    }
    get(unit8) {
        return this[unit8];
    }
    get isValid() {
        return this.invalid === null;
    }
    get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
    }
    get locale() {
        return this.isValid ? this.loc.locale : null;
    }
    get numberingSystem() {
        return this.isValid ? this.loc.numberingSystem : null;
    }
    get outputCalendar() {
        return this.isValid ? this.loc.outputCalendar : null;
    }
    get zone() {
        return this._zone;
    }
    get zoneName() {
        return this.isValid ? this.zone.name : null;
    }
    get year() {
        return this.isValid ? this.c.year : NaN;
    }
    get quarter() {
        return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
    }
    get month() {
        return this.isValid ? this.c.month : NaN;
    }
    get day() {
        return this.isValid ? this.c.day : NaN;
    }
    get hour() {
        return this.isValid ? this.c.hour : NaN;
    }
    get minute() {
        return this.isValid ? this.c.minute : NaN;
    }
    get second() {
        return this.isValid ? this.c.second : NaN;
    }
    get millisecond() {
        return this.isValid ? this.c.millisecond : NaN;
    }
    get weekYear() {
        return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
    }
    get weekNumber() {
        return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
    }
    get weekday() {
        return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
    }
    get ordinal() {
        return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
    }
    get monthShort() {
        return this.isValid ? Info.months("short", {
            locale: this.locale
        })[this.month - 1] : null;
    }
    get monthLong() {
        return this.isValid ? Info.months("long", {
            locale: this.locale
        })[this.month - 1] : null;
    }
    get weekdayShort() {
        return this.isValid ? Info.weekdays("short", {
            locale: this.locale
        })[this.weekday - 1] : null;
    }
    get weekdayLong() {
        return this.isValid ? Info.weekdays("long", {
            locale: this.locale
        })[this.weekday - 1] : null;
    }
    get offset() {
        return this.isValid ? +this.o : NaN;
    }
    get offsetNameShort() {
        if (this.isValid) {
            return this.zone.offsetName(this.ts, {
                format: "short",
                locale: this.locale
            });
        } else {
            return null;
        }
    }
    get offsetNameLong() {
        if (this.isValid) {
            return this.zone.offsetName(this.ts, {
                format: "long",
                locale: this.locale
            });
        } else {
            return null;
        }
    }
    get isOffsetFixed() {
        return this.isValid ? this.zone.universal : null;
    }
    get isInDST() {
        if (this.isOffsetFixed) {
            return false;
        } else {
            return this.offset > this.set({
                month: 1
            }).offset || this.offset > this.set({
                month: 5
            }).offset;
        }
    }
    get isInLeapYear() {
        return isLeapYear(this.year);
    }
    get daysInMonth() {
        return daysInMonth(this.year, this.month);
    }
    get daysInYear() {
        return this.isValid ? daysInYear(this.year) : NaN;
    }
    get weeksInWeekYear() {
        return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
    }
    resolvedLocaleOpts(opts6 = {
    }) {
        const { locale , numberingSystem , calendar  } = Formatter.create(this.loc.clone(opts6), opts6).resolvedOptions(this);
        return {
            locale,
            numberingSystem,
            outputCalendar: calendar
        };
    }
    toUTC(offset = 0, opts7 = {
    }) {
        return this.setZone(FixedOffsetZone.instance(offset), opts7);
    }
    toLocal() {
        return this.setZone(Settings.defaultZone);
    }
    setZone(zone3, { keepLocalTime =false , keepCalendarTime =false  } = {
    }) {
        zone3 = normalizeZone(zone3, Settings.defaultZone);
        if (zone3.equals(this.zone)) {
            return this;
        } else if (!zone3.isValid) {
            return DateTime.invalid(unsupportedZone(zone3));
        } else {
            let newTS = this.ts;
            if (keepLocalTime || keepCalendarTime) {
                const offsetGuess = zone3.offset(this.ts);
                const asObj = this.toObject();
                [newTS] = objToTS(asObj, offsetGuess, zone3);
            }
            return clone1(this, {
                ts: newTS,
                zone: zone3
            });
        }
    }
    reconfigure({ locale: locale7 , numberingSystem: numberingSystem5 , outputCalendar: outputCalendar2  } = {
    }) {
        const loc = this.loc.clone({
            locale: locale7,
            numberingSystem: numberingSystem5,
            outputCalendar: outputCalendar2
        });
        return clone1(this, {
            loc
        });
    }
    setLocale(locale12) {
        return this.reconfigure({
            locale: locale12
        });
    }
    set(values1) {
        if (!this.isValid) return this;
        const normalized = normalizeObject(values1, normalizeUnit, []), settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday);
        let mixed;
        if (settingWeekStuff) {
            mixed = weekToGregorian(Object.assign(gregorianToWeek(this.c), normalized));
        } else if (!isUndefined(normalized.ordinal)) {
            mixed = ordinalToGregorian(Object.assign(gregorianToOrdinal(this.c), normalized));
        } else {
            mixed = Object.assign(this.toObject(), normalized);
            if (isUndefined(normalized.day)) {
                mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
            }
        }
        const [ts, o] = objToTS(mixed, this.o, this.zone);
        return clone1(this, {
            ts,
            o
        });
    }
    plus(duration2) {
        if (!this.isValid) return this;
        const dur = friendlyDuration(duration2);
        return clone1(this, adjustTime(this, dur));
    }
    minus(duration11) {
        if (!this.isValid) return this;
        const dur = friendlyDuration(duration11).negate();
        return clone1(this, adjustTime(this, dur));
    }
    startOf(unit21) {
        if (!this.isValid) return this;
        const o = {
        }, normalizedUnit = Duration.normalizeUnit(unit21);
        switch(normalizedUnit){
            case "years":
                o.month = 1;
            case "quarters":
            case "months":
                o.day = 1;
            case "weeks":
            case "days":
                o.hour = 0;
            case "hours":
                o.minute = 0;
            case "minutes":
                o.second = 0;
            case "seconds":
                o.millisecond = 0;
                break;
            case "milliseconds":
                break;
        }
        if (normalizedUnit === "weeks") {
            o.weekday = 1;
        }
        if (normalizedUnit === "quarters") {
            const q = Math.ceil(this.month / 3);
            o.month = (q - 1) * 3 + 1;
        }
        return this.set(o);
    }
    endOf(unit3) {
        return this.isValid ? this.plus({
            [unit3]: 1
        }).startOf(unit3).minus(1) : this;
    }
    toFormat(fmt21, opts8 = {
    }) {
        return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts8)).formatDateTimeFromString(this, fmt21) : INVALID;
    }
    toLocaleString(opts9 = DATE_SHORT) {
        return this.isValid ? Formatter.create(this.loc.clone(opts9), opts9).formatDateTime(this) : INVALID;
    }
    toLocaleParts(opts10 = {
    }) {
        return this.isValid ? Formatter.create(this.loc.clone(opts10), opts10).formatDateTimeParts(this) : [];
    }
    toISO(opts11 = {
    }) {
        if (!this.isValid) {
            return null;
        }
        return `${this.toISODate(opts11)}T${this.toISOTime(opts11)}`;
    }
    toISODate({ format: format6 = "extended"  } = {
    }) {
        let fmt = format6 === "basic" ? "yyyyMMdd" : "yyyy-MM-dd";
        if (this.year > 9999) {
            fmt = "+" + fmt;
        }
        return toTechFormat(this, fmt);
    }
    toISOWeekDate() {
        return toTechFormat(this, "kkkk-'W'WW-c");
    }
    toISOTime({ suppressMilliseconds =false , suppressSeconds =false , includeOffset =true , format: format12 = "extended"  } = {
    }) {
        return toTechTimeFormat(this, {
            suppressSeconds,
            suppressMilliseconds,
            includeOffset,
            format: format12
        });
    }
    toRFC2822() {
        return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
    }
    toHTTP() {
        return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
    }
    toSQLDate() {
        return toTechFormat(this, "yyyy-MM-dd");
    }
    toSQLTime({ includeOffset: includeOffset1 = true , includeZone =false  } = {
    }) {
        return toTechTimeFormat(this, {
            includeOffset: includeOffset1,
            includeZone,
            spaceZone: true
        });
    }
    toSQL(opts12 = {
    }) {
        if (!this.isValid) {
            return null;
        }
        return `${this.toSQLDate()} ${this.toSQLTime(opts12)}`;
    }
    toString() {
        return this.isValid ? this.toISO() : INVALID;
    }
    valueOf() {
        return this.toMillis();
    }
    toMillis() {
        return this.isValid ? this.ts : NaN;
    }
    toSeconds() {
        return this.isValid ? this.ts / 1000 : NaN;
    }
    toJSON() {
        return this.toISO();
    }
    toBSON() {
        return this.toJSDate();
    }
    toObject(opts13 = {
    }) {
        if (!this.isValid) return {
        };
        const base = Object.assign({
        }, this.c);
        if (opts13.includeConfig) {
            base.outputCalendar = this.outputCalendar;
            base.numberingSystem = this.loc.numberingSystem;
            base.locale = this.loc.locale;
        }
        return base;
    }
    toJSDate() {
        return new Date(this.isValid ? this.ts : NaN);
    }
    diff(otherDateTime, unit4 = "milliseconds", opts14 = {
    }) {
        if (!this.isValid || !otherDateTime.isValid) {
            return Duration.invalid(this.invalid || otherDateTime.invalid, "created by diffing an invalid DateTime");
        }
        const durOpts = Object.assign({
            locale: this.locale,
            numberingSystem: this.numberingSystem
        }, opts14);
        const units = maybeArray(unit4).map(Duration.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = __default(earlier, later, units, durOpts);
        return otherIsLater ? diffed.negate() : diffed;
    }
    diffNow(unit5 = "milliseconds", opts15 = {
    }) {
        return this.diff(DateTime.local(), unit5, opts15);
    }
    until(otherDateTime1) {
        return this.isValid ? Interval.fromDateTimes(this, otherDateTime1) : this;
    }
    hasSame(otherDateTime2, unit6) {
        if (!this.isValid) return false;
        if (unit6 === "millisecond") {
            return this.valueOf() === otherDateTime2.valueOf();
        } else {
            const inputMs = otherDateTime2.valueOf();
            return this.startOf(unit6) <= inputMs && inputMs <= this.endOf(unit6);
        }
    }
    equals(other1) {
        return this.isValid && other1.isValid && this.valueOf() === other1.valueOf() && this.zone.equals(other1.zone) && this.loc.equals(other1.loc);
    }
    toRelative(options3 = {
    }) {
        if (!this.isValid) return null;
        const base = options3.base || DateTime.fromObject({
            zone: this.zone
        }), padding = options3.padding ? this < base ? -options3.padding : options3.padding : 0;
        return diffRelative(base, this.plus(padding), Object.assign(options3, {
            numeric: "always",
            units: [
                "years",
                "months",
                "days",
                "hours",
                "minutes",
                "seconds"
            ]
        }));
    }
    toRelativeCalendar(options4 = {
    }) {
        if (!this.isValid) return null;
        return diffRelative(options4.base || DateTime.fromObject({
            zone: this.zone
        }), this, Object.assign(options4, {
            numeric: "auto",
            units: [
                "years",
                "months",
                "days"
            ],
            calendary: true
        }));
    }
    static min(...dateTimes) {
        if (!dateTimes.every(DateTime.isDateTime)) {
            throw new InvalidArgumentError("min requires all arguments be DateTimes");
        }
        return bestBy(dateTimes, (i)=>i.valueOf()
        , Math.min);
    }
    static max(...dateTimes1) {
        if (!dateTimes1.every(DateTime.isDateTime)) {
            throw new InvalidArgumentError("max requires all arguments be DateTimes");
        }
        return bestBy(dateTimes1, (i)=>i.valueOf()
        , Math.max);
    }
    static fromFormatExplain(text6, fmt3, options5 = {
    }) {
        const { locale =null , numberingSystem =null  } = options5, localeToUse = Locale.fromOpts({
            locale,
            numberingSystem,
            defaultToEN: true
        });
        return explainFromTokens(localeToUse, text6, fmt3);
    }
    static fromStringExplain(text7, fmt4, options6 = {
    }) {
        return DateTime.fromFormatExplain(text7, fmt4, options6);
    }
    static get DATE_SHORT() {
        return DATE_SHORT;
    }
    static get DATE_MED() {
        return DATE_MED;
    }
    static get DATE_MED_WITH_WEEKDAY() {
        return DATE_MED_WITH_WEEKDAY;
    }
    static get DATE_FULL() {
        return DATE_FULL;
    }
    static get DATE_HUGE() {
        return DATE_HUGE;
    }
    static get TIME_SIMPLE() {
        return TIME_SIMPLE;
    }
    static get TIME_WITH_SECONDS() {
        return TIME_WITH_SECONDS;
    }
    static get TIME_WITH_SHORT_OFFSET() {
        return TIME_WITH_SHORT_OFFSET;
    }
    static get TIME_WITH_LONG_OFFSET() {
        return TIME_WITH_LONG_OFFSET;
    }
    static get TIME_24_SIMPLE() {
        return TIME_24_SIMPLE;
    }
    static get TIME_24_WITH_SECONDS() {
        return TIME_24_WITH_SECONDS;
    }
    static get TIME_24_WITH_SHORT_OFFSET() {
        return TIME_24_WITH_SHORT_OFFSET;
    }
    static get TIME_24_WITH_LONG_OFFSET() {
        return TIME_24_WITH_LONG_OFFSET;
    }
    static get DATETIME_SHORT() {
        return DATETIME_SHORT;
    }
    static get DATETIME_SHORT_WITH_SECONDS() {
        return DATETIME_SHORT_WITH_SECONDS;
    }
    static get DATETIME_MED() {
        return DATETIME_MED;
    }
    static get DATETIME_MED_WITH_SECONDS() {
        return DATETIME_MED_WITH_SECONDS;
    }
    static get DATETIME_MED_WITH_WEEKDAY() {
        return DATETIME_MED_WITH_WEEKDAY;
    }
    static get DATETIME_FULL() {
        return DATETIME_FULL;
    }
    static get DATETIME_FULL_WITH_SECONDS() {
        return DATETIME_FULL_WITH_SECONDS;
    }
    static get DATETIME_HUGE() {
        return DATETIME_HUGE;
    }
    static get DATETIME_HUGE_WITH_SECONDS() {
        return DATETIME_HUGE_WITH_SECONDS;
    }
}
function friendlyDateTime(dateTimeish) {
    if (DateTime.isDateTime(dateTimeish)) {
        return dateTimeish;
    } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
        return DateTime.fromJSDate(dateTimeish);
    } else if (dateTimeish && typeof dateTimeish === "object") {
        return DateTime.fromObject(dateTimeish);
    } else {
        throw new InvalidArgumentError(`Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`);
    }
}
function getCachedDTF(locString, opts = {
}) {
    const key = JSON.stringify([
        locString,
        opts
    ]);
    let dtf = intlDTCache[key];
    if (!dtf) {
        dtf = new Intl.DateTimeFormat(locString, opts);
        intlDTCache[key] = dtf;
    }
    return dtf;
}
let intlNumCache = {
};
function getCachedINF(locString, opts = {
}) {
    const key = JSON.stringify([
        locString,
        opts
    ]);
    let inf = intlNumCache[key];
    if (!inf) {
        inf = new Intl.NumberFormat(locString, opts);
        intlNumCache[key] = inf;
    }
    return inf;
}
let intlRelCache = {
};
function getCachedRTF(locString, opts = {
}) {
    const { base , ...cacheKeyOpts } = opts;
    const key = JSON.stringify([
        locString,
        cacheKeyOpts
    ]);
    let inf = intlRelCache[key];
    if (!inf) {
        inf = new Intl.RelativeTimeFormat(locString, opts);
        intlRelCache[key] = inf;
    }
    return inf;
}
let sysLocaleCache = null;
function systemLocale() {
    if (sysLocaleCache) {
        return sysLocaleCache;
    } else if (hasIntl()) {
        const computedSys = new Intl.DateTimeFormat().resolvedOptions().locale;
        sysLocaleCache = !computedSys || computedSys === "und" ? "en-US" : computedSys;
        return sysLocaleCache;
    } else {
        sysLocaleCache = "en-US";
        return sysLocaleCache;
    }
}
function parseLocaleString(localeStr) {
    const uIndex = localeStr.indexOf("-u-");
    if (uIndex === -1) {
        return [
            localeStr
        ];
    } else {
        let options;
        const smaller = localeStr.substring(0, uIndex);
        try {
            options = getCachedDTF(localeStr).resolvedOptions();
        } catch (e) {
            options = getCachedDTF(smaller).resolvedOptions();
        }
        const { numberingSystem , calendar  } = options;
        return [
            smaller,
            numberingSystem,
            calendar
        ];
    }
}
function intlConfigString(localeStr, numberingSystem, outputCalendar) {
    if (hasIntl()) {
        if (outputCalendar || numberingSystem) {
            localeStr += "-u";
            if (outputCalendar) {
                localeStr += `-ca-${outputCalendar}`;
            }
            if (numberingSystem) {
                localeStr += `-nu-${numberingSystem}`;
            }
            return localeStr;
        } else {
            return localeStr;
        }
    } else {
        return [];
    }
}
function mapMonths(f) {
    const ms = [];
    for(let i = 1; i <= 12; i++){
        const dt = DateTime.utc(2016, i, 1);
        ms.push(f(dt));
    }
    return ms;
}
function mapWeekdays(f) {
    const ms = [];
    for(let i = 1; i <= 7; i++){
        const dt = DateTime.utc(2016, 11, 13 + i);
        ms.push(f(dt));
    }
    return ms;
}
function listStuff(loc, length, defaultOK, englishFn, intlFn) {
    const mode = loc.listingMode(defaultOK);
    if (mode === "error") {
        return null;
    } else if (mode === "en") {
        return englishFn(length);
    } else {
        return intlFn(length);
    }
}
function supportsFastNumbers(loc) {
    if (loc.numberingSystem && loc.numberingSystem !== "latn") {
        return false;
    } else {
        return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || hasIntl() && new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
    }
}
class PolyNumberFormatter {
    constructor(intl, forceSimple, opts){
        this.padTo = opts.padTo || 0;
        this.floor = opts.floor || false;
        if (!forceSimple && hasIntl()) {
            const intlOpts = {
                useGrouping: false
            };
            if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
            this.inf = getCachedINF(intl, intlOpts);
        }
    }
    format(i2) {
        if (this.inf) {
            const fixed = this.floor ? Math.floor(i2) : i2;
            return this.inf.format(fixed);
        } else {
            const fixed = this.floor ? Math.floor(i2) : roundTo(i2, 3);
            return padStart(fixed, this.padTo);
        }
    }
}
class PolyDateFormatter {
    constructor(dt, intl, opts){
        this.opts = opts;
        this.hasIntl = hasIntl();
        let z;
        if (dt.zone.universal && this.hasIntl) {
            z = "UTC";
            if (opts.timeZoneName) {
                this.dt = dt;
            } else {
                this.dt = dt.offset === 0 ? dt : DateTime.fromMillis(dt.ts + dt.offset * 60 * 1000);
            }
        } else if (dt.zone.type === "local") {
            this.dt = dt;
        } else {
            this.dt = dt;
            z = dt.zone.name;
        }
        if (this.hasIntl) {
            const intlOpts = Object.assign({
            }, this.opts);
            if (z) {
                intlOpts.timeZone = z;
            }
            this.dtf = getCachedDTF(intl, intlOpts);
        }
    }
    format() {
        if (this.hasIntl) {
            return this.dtf.format(this.dt.toJSDate());
        } else {
            const tokenFormat = formatString(this.opts), loc = Locale.create("en-US");
            return Formatter.create(loc).formatDateTimeFromString(this.dt, tokenFormat);
        }
    }
    formatToParts() {
        if (this.hasIntl && hasFormatToParts()) {
            return this.dtf.formatToParts(this.dt.toJSDate());
        } else {
            return [];
        }
    }
    resolvedOptions() {
        if (this.hasIntl) {
            return this.dtf.resolvedOptions();
        } else {
            return {
                locale: "en-US",
                numberingSystem: "latn",
                outputCalendar: "gregory"
            };
        }
    }
}
class PolyRelFormatter {
    constructor(intl, isEnglish, opts){
        this.opts = Object.assign({
            style: "long"
        }, opts);
        if (!isEnglish && hasRelative()) {
            this.rtf = getCachedRTF(intl, opts);
        }
    }
    format(count, unit1) {
        if (this.rtf) {
            return this.rtf.format(count, unit1);
        } else {
            return formatRelativeTime(unit1, count, this.opts.numeric, this.opts.style !== "long");
        }
    }
    formatToParts(count1, unit1) {
        if (this.rtf) {
            return this.rtf.formatToParts(count1, unit1);
        } else {
            return [];
        }
    }
}
class Locale {
    static fromOpts(opts20) {
        return Locale.create(opts20.locale, opts20.numberingSystem, opts20.outputCalendar, opts20.defaultToEN);
    }
    static create(locale21, numberingSystem, outputCalendar2, defaultToEN = false) {
        const specifiedLocale = locale21 || Settings.defaultLocale, localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale()), numberingSystemR = numberingSystem || Settings.defaultNumberingSystem, outputCalendarR = outputCalendar2 || Settings.defaultOutputCalendar;
        return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
    }
    static resetCache() {
        sysLocaleCache = null;
        intlDTCache = {
        };
        intlNumCache = {
        };
        intlRelCache = {
        };
    }
    static fromObject({ locale: locale13 , numberingSystem: numberingSystem11 , outputCalendar: outputCalendar11  } = {
    }) {
        return Locale.create(locale13, numberingSystem11, outputCalendar11);
    }
    constructor(locale, numbering, outputCalendar, specifiedLocale){
        const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale);
        this.locale = parsedLocale;
        this.numberingSystem = numbering || parsedNumberingSystem || null;
        this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
        this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
        this.weekdaysCache = {
            format: {
            },
            standalone: {
            }
        };
        this.monthsCache = {
            format: {
            },
            standalone: {
            }
        };
        this.meridiemCache = null;
        this.eraCache = {
        };
        this.specifiedLocale = specifiedLocale;
        this.fastNumbersCached = null;
    }
    get fastNumbers() {
        if (this.fastNumbersCached == null) {
            this.fastNumbersCached = supportsFastNumbers(this);
        }
        return this.fastNumbersCached;
    }
    listingMode(defaultOK = true) {
        const intl = hasIntl(), hasFTP = intl && hasFormatToParts(), isActuallyEn = this.isEnglish(), hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
        if (!hasFTP && !(isActuallyEn && hasNoWeirdness) && !defaultOK) {
            return "error";
        } else if (!hasFTP || isActuallyEn && hasNoWeirdness) {
            return "en";
        } else {
            return "intl";
        }
    }
    clone(alts) {
        if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
            return this;
        } else {
            return Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, alts.defaultToEN || false);
        }
    }
    redefaultToEN(alts1 = {
    }) {
        return this.clone(Object.assign({
        }, alts1, {
            defaultToEN: true
        }));
    }
    redefaultToSystem(alts2 = {
    }) {
        return this.clone(Object.assign({
        }, alts2, {
            defaultToEN: false
        }));
    }
    months(length, format5 = false, defaultOK1 = true) {
        return listStuff(this, length, defaultOK1, months, ()=>{
            const intl = format5 ? {
                month: length,
                day: "numeric"
            } : {
                month: length
            }, formatStr = format5 ? "format" : "standalone";
            if (!this.monthsCache[formatStr][length]) {
                this.monthsCache[formatStr][length] = mapMonths((dt)=>this.extract(dt, intl, "month")
                );
            }
            return this.monthsCache[formatStr][length];
        });
    }
    weekdays(length11, format13 = false, defaultOK2 = true) {
        return listStuff(this, length11, defaultOK2, weekdays, ()=>{
            const intl = format13 ? {
                weekday: length11,
                year: "numeric",
                month: "long",
                day: "numeric"
            } : {
                weekday: length11
            }, formatStr = format13 ? "format" : "standalone";
            if (!this.weekdaysCache[formatStr][length11]) {
                this.weekdaysCache[formatStr][length11] = mapWeekdays((dt)=>this.extract(dt, intl, "weekday")
                );
            }
            return this.weekdaysCache[formatStr][length11];
        });
    }
    meridiems(defaultOK3 = true) {
        return listStuff(this, undefined, defaultOK3, ()=>meridiems
        , ()=>{
            if (!this.meridiemCache) {
                const intl = {
                    hour: "numeric",
                    hour12: true
                };
                this.meridiemCache = [
                    DateTime.utc(2016, 11, 13, 9),
                    DateTime.utc(2016, 11, 13, 19)
                ].map((dt)=>this.extract(dt, intl, "dayperiod")
                );
            }
            return this.meridiemCache;
        });
    }
    eras(length21, defaultOK4 = true) {
        return listStuff(this, length21, defaultOK4, eras, ()=>{
            const intl = {
                era: length21
            };
            if (!this.eraCache[length21]) {
                this.eraCache[length21] = [
                    DateTime.utc(-40, 1, 1),
                    DateTime.utc(2017, 1, 1)
                ].map((dt)=>this.extract(dt, intl, "era")
                );
            }
            return this.eraCache[length21];
        });
    }
    extract(dt, intlOpts, field) {
        const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m)=>m.type.toLowerCase() === field
        );
        return matching ? matching.value : null;
    }
    numberFormatter(opts17 = {
    }) {
        return new PolyNumberFormatter(this.intl, opts17.forceSimple || this.fastNumbers, opts17);
    }
    dtFormatter(dt11, intlOpts1 = {
    }) {
        return new PolyDateFormatter(dt11, this.intl, intlOpts1);
    }
    relFormatter(opts23 = {
    }) {
        return new PolyRelFormatter(this.intl, this.isEnglish(), opts23);
    }
    isEnglish() {
        return this.locale === "en" || this.locale.toLowerCase() === "en-us" || hasIntl() && new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
    }
    equals(other2) {
        return this.locale === other2.locale && this.numberingSystem === other2.numberingSystem && this.outputCalendar === other2.outputCalendar;
    }
}
class Settings {
    static get now() {
        return now;
    }
    static set now(n) {
        now = n;
    }
    static get defaultZoneName() {
        return Settings.defaultZone.name;
    }
    static set defaultZoneName(z) {
        if (!z) {
            defaultZone1 = null;
        } else {
            defaultZone1 = normalizeZone(z);
        }
    }
    static get defaultZone() {
        return defaultZone1 || LocalZone.instance;
    }
    static get defaultLocale() {
        return defaultLocale;
    }
    static set defaultLocale(locale9) {
        defaultLocale = locale9;
    }
    static get defaultNumberingSystem() {
        return defaultNumberingSystem;
    }
    static set defaultNumberingSystem(numberingSystem7) {
        defaultNumberingSystem = numberingSystem7;
    }
    static get defaultOutputCalendar() {
        return defaultOutputCalendar;
    }
    static set defaultOutputCalendar(outputCalendar) {
        defaultOutputCalendar = outputCalendar;
    }
    static get throwOnInvalid() {
        return throwOnInvalid;
    }
    static set throwOnInvalid(t1) {
        throwOnInvalid = t1;
    }
    static resetCaches() {
        Locale.resetCache();
        IANAZone.resetCache();
    }
}
function validateStartEnd(start, end) {
    if (!start || !start.isValid) {
        return Interval.invalid("missing or invalid start");
    } else if (!end || !end.isValid) {
        return Interval.invalid("missing or invalid end");
    } else if (end < start) {
        return Interval.invalid("end before start", `The end of an interval must be after its start, but you had start=${start.toISO()} and end=${end.toISO()}`);
    } else {
        return null;
    }
}
class Interval {
    constructor(config){
        this.s = config.start;
        this.e = config.end;
        this.invalid = config.invalid || null;
        this.isLuxonInterval = true;
    }
    static invalid(reason2, explanation2 = null) {
        if (!reason2) {
            throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
        }
        const invalid = reason2 instanceof Invalid ? reason2 : new Invalid(reason2, explanation2);
        if (Settings.throwOnInvalid) {
            throw new InvalidIntervalError(invalid);
        } else {
            return new Interval({
                invalid
            });
        }
    }
    static fromDateTimes(start, end) {
        const builtStart = friendlyDateTime(start), builtEnd = friendlyDateTime(end);
        const validateError = validateStartEnd(builtStart, builtEnd);
        if (validateError == null) {
            return new Interval({
                start: builtStart,
                end: builtEnd
            });
        } else {
            return validateError;
        }
    }
    static after(start1, duration3) {
        const dur = friendlyDuration(duration3), dt = friendlyDateTime(start1);
        return Interval.fromDateTimes(dt, dt.plus(dur));
    }
    static before(end1, duration12) {
        const dur = friendlyDuration(duration12), dt = friendlyDateTime(end1);
        return Interval.fromDateTimes(dt.minus(dur), dt);
    }
    static fromISO(text8, opts18) {
        const [s, e] = (text8 || "").split("/", 2);
        if (s && e) {
            let start, startIsValid;
            try {
                start = DateTime.fromISO(s, opts18);
                startIsValid = start.isValid;
            } catch (e1) {
                startIsValid = false;
            }
            let end, endIsValid;
            try {
                end = DateTime.fromISO(e, opts18);
                endIsValid = end.isValid;
            } catch (e2) {
                endIsValid = false;
            }
            if (startIsValid && endIsValid) {
                return Interval.fromDateTimes(start, end);
            }
            if (startIsValid) {
                const dur = Duration.fromISO(e, opts18);
                if (dur.isValid) {
                    return Interval.after(start, dur);
                }
            } else if (endIsValid) {
                const dur = Duration.fromISO(s, opts18);
                if (dur.isValid) {
                    return Interval.before(end, dur);
                }
            }
        }
        return Interval.invalid("unparsable", `the input "${text8}" can't be parsed as ISO 8601`);
    }
    static isInterval(o2) {
        return o2 && o2.isLuxonInterval || false;
    }
    get start() {
        return this.isValid ? this.s : null;
    }
    get end() {
        return this.isValid ? this.e : null;
    }
    get isValid() {
        return this.invalidReason === null;
    }
    get invalidReason() {
        return this.invalid ? this.invalid.reason : null;
    }
    get invalidExplanation() {
        return this.invalid ? this.invalid.explanation : null;
    }
    length(unit7 = "milliseconds") {
        return this.isValid ? this.toDuration(...[
            unit7
        ]).get(unit7) : NaN;
    }
    count(unit12 = "milliseconds") {
        if (!this.isValid) return NaN;
        const start = this.start.startOf(unit12), end = this.end.startOf(unit12);
        return Math.floor(end.diff(start, unit12).get(unit12)) + 1;
    }
    hasSame(unit22) {
        return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit22) : false;
    }
    isEmpty() {
        return this.s.valueOf() === this.e.valueOf();
    }
    isAfter(dateTime) {
        if (!this.isValid) return false;
        return this.s > dateTime;
    }
    isBefore(dateTime1) {
        if (!this.isValid) return false;
        return this.e <= dateTime1;
    }
    contains(dateTime2) {
        if (!this.isValid) return false;
        return this.s <= dateTime2 && this.e > dateTime2;
    }
    set({ start: start2 , end: end2  } = {
    }) {
        if (!this.isValid) return this;
        return Interval.fromDateTimes(start2 || this.s, end2 || this.e);
    }
    splitAt(...dateTimes2) {
        if (!this.isValid) return [];
        const sorted = dateTimes2.map(friendlyDateTime).filter((d)=>this.contains(d)
        ).sort(), results = [];
        let { s  } = this, i = 0;
        while(s < this.e){
            const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
            results.push(Interval.fromDateTimes(s, next));
            s = next;
            i += 1;
        }
        return results;
    }
    splitBy(duration2) {
        const dur = friendlyDuration(duration2);
        if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
            return [];
        }
        let { s  } = this, added, next;
        const results = [];
        while(s < this.e){
            added = s.plus(dur);
            next = +added > +this.e ? this.e : added;
            results.push(Interval.fromDateTimes(s, next));
            s = next;
        }
        return results;
    }
    divideEqually(numberOfParts) {
        if (!this.isValid) return [];
        return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
    }
    overlaps(other3) {
        return this.e > other3.s && this.s < other3.e;
    }
    abutsStart(other1) {
        if (!this.isValid) return false;
        return +this.e === +other1.s;
    }
    abutsEnd(other2) {
        if (!this.isValid) return false;
        return +other2.e === +this.s;
    }
    engulfs(other3) {
        if (!this.isValid) return false;
        return this.s <= other3.s && this.e >= other3.e;
    }
    equals(other4) {
        if (!this.isValid || !other4.isValid) {
            return false;
        }
        return this.s.equals(other4.s) && this.e.equals(other4.e);
    }
    intersection(other5) {
        if (!this.isValid) return this;
        const s = this.s > other5.s ? this.s : other5.s, e = this.e < other5.e ? this.e : other5.e;
        if (s > e) {
            return null;
        } else {
            return Interval.fromDateTimes(s, e);
        }
    }
    union(other6) {
        if (!this.isValid) return this;
        const s = this.s < other6.s ? this.s : other6.s, e = this.e > other6.e ? this.e : other6.e;
        return Interval.fromDateTimes(s, e);
    }
    static merge(intervals) {
        const [found, __final] = intervals.sort((a, b)=>a.s - b.s
        ).reduce(([sofar, current], item)=>{
            if (!current) {
                return [
                    sofar,
                    item
                ];
            } else if (current.overlaps(item) || current.abutsStart(item)) {
                return [
                    sofar,
                    current.union(item)
                ];
            } else {
                return [
                    sofar.concat([
                        current
                    ]),
                    item
                ];
            }
        }, [
            [],
            null
        ]);
        if (__final) {
            found.push(__final);
        }
        return found;
    }
    static xor(intervals1) {
        let start = null, currentCount = 0;
        const results = [], ends = intervals1.map((i)=>[
                {
                    time: i.s,
                    type: "s"
                },
                {
                    time: i.e,
                    type: "e"
                }
            ]
        ), flattened = Array.prototype.concat(...ends), arr = flattened.sort((a, b)=>a.time - b.time
        );
        for (const i1 of arr){
            currentCount += i1.type === "s" ? 1 : -1;
            if (currentCount === 1) {
                start = i1.time;
            } else {
                if (start && +start !== +i1.time) {
                    results.push(Interval.fromDateTimes(start, i1.time));
                }
                start = null;
            }
        }
        return Interval.merge(results);
    }
    difference(...intervals2) {
        return Interval.xor([
            this
        ].concat(intervals2)).map((i)=>this.intersection(i)
        ).filter((i)=>i && !i.isEmpty()
        );
    }
    toString() {
        if (!this.isValid) return INVALID2;
        return `[${this.s.toISO()} – ${this.e.toISO()})`;
    }
    toISO(opts19) {
        if (!this.isValid) return INVALID2;
        return `${this.s.toISO(opts19)}/${this.e.toISO(opts19)}`;
    }
    toISODate() {
        if (!this.isValid) return INVALID2;
        return `${this.s.toISODate()}/${this.e.toISODate()}`;
    }
    toISOTime(opts24) {
        if (!this.isValid) return INVALID2;
        return `${this.s.toISOTime(opts24)}/${this.e.toISOTime(opts24)}`;
    }
    toFormat(dateFormat, { separator =" – "  } = {
    }) {
        if (!this.isValid) return INVALID2;
        return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
    }
    toDuration(unit31, opts33) {
        if (!this.isValid) {
            return Duration.invalid(this.invalidReason);
        }
        return this.e.diff(this.s, unit31, opts33);
    }
    mapEndpoints(mapFn) {
        return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
    }
}
function highOrderDiffs(cursor, later, units) {
    const differs = [
        [
            "years",
            (a, b)=>b.year - a.year
        ],
        [
            "months",
            (a, b)=>b.month - a.month + (b.year - a.year) * 12
        ],
        [
            "weeks",
            (a, b)=>{
                const days = dayDiff(a, b);
                return (days - days % 7) / 7;
            }
        ],
        [
            "days",
            dayDiff
        ]
    ];
    const results = {
    };
    let lowestOrder, highWater;
    for (const [unit, differ] of differs){
        if (units.indexOf(unit) >= 0) {
            lowestOrder = unit;
            let delta = differ(cursor, later);
            highWater = cursor.plus({
                [unit]: delta
            });
            if (highWater > later) {
                cursor = cursor.plus({
                    [unit]: delta - 1
                });
                delta -= 1;
            } else {
                cursor = highWater;
            }
            results[unit] = delta;
        }
    }
    return [
        cursor,
        results,
        highWater,
        lowestOrder
    ];
}
function __default(earlier, later, units, opts) {
    let [cursor, results, highWater, lowestOrder] = highOrderDiffs(earlier, later, units);
    const remainingMillis = later - cursor;
    const lowerOrderUnits = units.filter((u)=>[
            "hours",
            "minutes",
            "seconds",
            "milliseconds"
        ].indexOf(u) >= 0
    );
    if (lowerOrderUnits.length === 0) {
        if (highWater < later) {
            highWater = cursor.plus({
                [lowestOrder]: 1
            });
        }
        if (highWater !== cursor) {
            results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
        }
    }
    const duration = Duration.fromObject(Object.assign(results, opts));
    if (lowerOrderUnits.length > 0) {
        return Duration.fromMillis(remainingMillis, opts).shiftTo(...lowerOrderUnits).plus(duration);
    } else {
        return duration;
    }
}
function intUnit(regex, post = (i)=>i
) {
    return {
        regex,
        deser: ([s])=>post(parseDigits(s))
    };
}
const NBSP = String.fromCharCode(160);
const spaceOrNBSP = `( |${NBSP})`;
const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
function fixListRegex(s) {
    return s.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
}
function stripInsensitivities(s) {
    return s.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
}
function oneOf(strings, startIndex) {
    if (strings === null) {
        return null;
    } else {
        return {
            regex: RegExp(strings.map(fixListRegex).join("|")),
            deser: ([s])=>strings.findIndex((i)=>stripInsensitivities(s) === stripInsensitivities(i)
                ) + startIndex
        };
    }
}
function offset1(regex, groups) {
    return {
        regex,
        deser: ([, h, m])=>signedOffset(h, m)
        ,
        groups
    };
}
function simple(regex) {
    return {
        regex,
        deser: ([s])=>s
    };
}
function escapeToken(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}
function unitForToken(token, loc) {
    const one = digitRegex(loc), two = digitRegex(loc, "{2}"), three = digitRegex(loc, "{3}"), four = digitRegex(loc, "{4}"), six = digitRegex(loc, "{6}"), oneOrTwo = digitRegex(loc, "{1,2}"), oneToThree = digitRegex(loc, "{1,3}"), oneToSix = digitRegex(loc, "{1,6}"), oneToNine = digitRegex(loc, "{1,9}"), twoToFour = digitRegex(loc, "{2,4}"), fourToSix = digitRegex(loc, "{4,6}"), literal = (t)=>({
            regex: RegExp(escapeToken(t.val)),
            deser: ([s])=>s
            ,
            literal: true
        })
    , unitate = (t)=>{
        if (token.literal) {
            return literal(t);
        }
        switch(t.val){
            case "G":
                return oneOf(loc.eras("short", false), 0);
            case "GG":
                return oneOf(loc.eras("long", false), 0);
            case "y":
                return intUnit(oneToSix);
            case "yy":
                return intUnit(twoToFour, untruncateYear);
            case "yyyy":
                return intUnit(four);
            case "yyyyy":
                return intUnit(fourToSix);
            case "yyyyyy":
                return intUnit(six);
            case "M":
                return intUnit(oneOrTwo);
            case "MM":
                return intUnit(two);
            case "MMM":
                return oneOf(loc.months("short", true, false), 1);
            case "MMMM":
                return oneOf(loc.months("long", true, false), 1);
            case "L":
                return intUnit(oneOrTwo);
            case "LL":
                return intUnit(two);
            case "LLL":
                return oneOf(loc.months("short", false, false), 1);
            case "LLLL":
                return oneOf(loc.months("long", false, false), 1);
            case "d":
                return intUnit(oneOrTwo);
            case "dd":
                return intUnit(two);
            case "o":
                return intUnit(oneToThree);
            case "ooo":
                return intUnit(three);
            case "HH":
                return intUnit(two);
            case "H":
                return intUnit(oneOrTwo);
            case "hh":
                return intUnit(two);
            case "h":
                return intUnit(oneOrTwo);
            case "mm":
                return intUnit(two);
            case "m":
                return intUnit(oneOrTwo);
            case "q":
                return intUnit(oneOrTwo);
            case "qq":
                return intUnit(two);
            case "s":
                return intUnit(oneOrTwo);
            case "ss":
                return intUnit(two);
            case "S":
                return intUnit(oneToThree);
            case "SSS":
                return intUnit(three);
            case "u":
                return simple(oneToNine);
            case "a":
                return oneOf(loc.meridiems(), 0);
            case "kkkk":
                return intUnit(four);
            case "kk":
                return intUnit(twoToFour, untruncateYear);
            case "W":
                return intUnit(oneOrTwo);
            case "WW":
                return intUnit(two);
            case "E":
            case "c":
                return intUnit(one);
            case "EEE":
                return oneOf(loc.weekdays("short", false, false), 1);
            case "EEEE":
                return oneOf(loc.weekdays("long", false, false), 1);
            case "ccc":
                return oneOf(loc.weekdays("short", true, false), 1);
            case "cccc":
                return oneOf(loc.weekdays("long", true, false), 1);
            case "Z":
            case "ZZ":
                return offset1(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
            case "ZZZ":
                return offset1(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
            case "z":
                return simple(/[a-z_+-/]{1,256}?/i);
            default:
                return literal(t);
        }
    };
    const unit = unitate(token) || {
        invalidReason: MISSING_FTP
    };
    unit.token = token;
    return unit;
}
const partTypeStyleToTokenVal = {
    year: {
        "2-digit": "yy",
        numeric: "yyyyy"
    },
    month: {
        numeric: "M",
        "2-digit": "MM",
        short: "MMM",
        long: "MMMM"
    },
    day: {
        numeric: "d",
        "2-digit": "dd"
    },
    weekday: {
        short: "EEE",
        long: "EEEE"
    },
    dayperiod: "a",
    dayPeriod: "a",
    hour: {
        numeric: "h",
        "2-digit": "hh"
    },
    minute: {
        numeric: "m",
        "2-digit": "mm"
    },
    second: {
        numeric: "s",
        "2-digit": "ss"
    }
};
function tokenForPart(part, locale, formatOpts) {
    const { type , value  } = part;
    if (type === "literal") {
        return {
            literal: true,
            val: value
        };
    }
    const style = formatOpts[type];
    let val = partTypeStyleToTokenVal[type];
    if (typeof val === "object") {
        val = val[style];
    }
    if (val) {
        return {
            literal: false,
            val
        };
    }
    return undefined;
}
function buildRegex(units) {
    const re = units.map((u)=>u.regex
    ).reduce((f, r)=>`${f}(${r.source})`
    , "");
    return [
        `^${re}$`,
        units
    ];
}
function match1(input, regex, handlers) {
    const matches = input.match(regex);
    if (matches) {
        const all = {
        };
        let matchIndex = 1;
        for(const i in handlers){
            if (hasOwnProperty(handlers, i)) {
                const h = handlers[i], groups = h.groups ? h.groups + 1 : 1;
                if (!h.literal && h.token) {
                    all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
                }
                matchIndex += groups;
            }
        }
        return [
            matches,
            all
        ];
    } else {
        return [
            matches,
            {
            }
        ];
    }
}
function dateTimeFromMatches(matches) {
    const toField = (token)=>{
        switch(token){
            case "S":
                return "millisecond";
            case "s":
                return "second";
            case "m":
                return "minute";
            case "h":
            case "H":
                return "hour";
            case "d":
                return "day";
            case "o":
                return "ordinal";
            case "L":
            case "M":
                return "month";
            case "y":
                return "year";
            case "E":
            case "c":
                return "weekday";
            case "W":
                return "weekNumber";
            case "k":
                return "weekYear";
            case "q":
                return "quarter";
            default:
                return null;
        }
    };
    let zone;
    if (!isUndefined(matches.Z)) {
        zone = new FixedOffsetZone(matches.Z);
    } else if (!isUndefined(matches.z)) {
        zone = IANAZone.create(matches.z);
    } else {
        zone = null;
    }
    if (!isUndefined(matches.q)) {
        matches.M = (matches.q - 1) * 3 + 1;
    }
    if (!isUndefined(matches.h)) {
        if (matches.h < 12 && matches.a === 1) {
            matches.h += 12;
        } else if (matches.h === 12 && matches.a === 0) {
            matches.h = 0;
        }
    }
    if (matches.G === 0 && matches.y) {
        matches.y = -matches.y;
    }
    if (!isUndefined(matches.u)) {
        matches.S = parseMillis(matches.u);
    }
    const vals = Object.keys(matches).reduce((r, k)=>{
        const f = toField(k);
        if (f) {
            r[f] = matches[k];
        }
        return r;
    }, {
    });
    return [
        vals,
        zone
    ];
}
let dummyDateTimeCache = null;
function getDummyDateTime() {
    if (!dummyDateTimeCache) {
        dummyDateTimeCache = DateTime.fromMillis(1555555555555);
    }
    return dummyDateTimeCache;
}
function maybeExpandMacroToken(token, locale) {
    if (token.literal) {
        return token;
    }
    const formatOpts = Formatter.macroTokenToFormatOpts(token.val);
    if (!formatOpts) {
        return token;
    }
    const formatter = Formatter.create(locale, formatOpts);
    const parts = formatter.formatDateTimeParts(getDummyDateTime());
    const tokens = parts.map((p)=>tokenForPart(p, locale, formatOpts)
    );
    if (tokens.includes(undefined)) {
        return token;
    }
    return tokens;
}
function expandMacroTokens(tokens, locale) {
    return Array.prototype.concat(...tokens.map((t)=>maybeExpandMacroToken(t, locale)
    ));
}
function explainFromTokens(locale, input, format) {
    const tokens = expandMacroTokens(Formatter.parseFormat(format), locale), units = tokens.map((t)=>unitForToken(t, locale)
    ), disqualifyingUnit = units.find((t)=>t.invalidReason
    );
    if (disqualifyingUnit) {
        return {
            input,
            tokens,
            invalidReason: disqualifyingUnit.invalidReason
        };
    } else {
        const [regexString, handlers] = buildRegex(units), regex = RegExp(regexString, "i"), [rawMatches, matches] = match1(input, regex, handlers), [result, zone] = matches ? dateTimeFromMatches(matches) : [
            null,
            null
        ];
        if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
            throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");
        }
        return {
            input,
            tokens,
            regex,
            rawMatches,
            matches,
            result,
            zone
        };
    }
}
function parseFromTokens(locale, input, format) {
    const { result , zone , invalidReason  } = explainFromTokens(locale, input, format);
    return [
        result,
        zone,
        invalidReason
    ];
}
const mod = {
    DateTime: DateTime,
    Duration: Duration,
    Interval: Interval,
    Info: Info,
    Zone: Zone,
    FixedOffsetZone: FixedOffsetZone,
    IANAZone: IANAZone,
    InvalidZone: InvalidZone,
    LocalZone: LocalZone,
    Settings: Settings
};
const date1 = new Date();
const dt5 = mod.DateTime.fromJSDate(date1);
console.log(dt5.toISO());
