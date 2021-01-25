class LuxonError extends Error {
}
class InvalidDateTimeError extends LuxonError {
    constructor(reason4){
        super(`Invalid DateTime: ${reason4.toMessage()}`);
    }
}
class InvalidIntervalError extends LuxonError {
    constructor(reason1){
        super(`Invalid Interval: ${reason1.toMessage()}`);
    }
}
class InvalidDurationError extends LuxonError {
    constructor(reason2){
        super(`Invalid Duration: ${reason2.toMessage()}`);
    }
}
class ConflictingSpecificationError extends LuxonError {
}
class InvalidUnitError extends LuxonError {
    constructor(unit1){
        super(`Invalid unit ${unit1}`);
    }
}
class InvalidArgumentError extends LuxonError {
}
class ZoneIsAbstractError extends LuxonError {
    constructor(){
        super("Zone is an abstract class");
    }
}
const ZoneIsAbstractError1 = ZoneIsAbstractError;
const ZoneIsAbstractError2 = ZoneIsAbstractError1;
class Zone {
    get type() {
        throw new ZoneIsAbstractError2();
    }
    get name() {
        throw new ZoneIsAbstractError2();
    }
    get universal() {
        throw new ZoneIsAbstractError2();
    }
    offsetName(ts, opts) {
        throw new ZoneIsAbstractError2();
    }
    formatOffset(ts, format) {
        throw new ZoneIsAbstractError2();
    }
    offset(ts) {
        throw new ZoneIsAbstractError2();
    }
    equals(otherZone) {
        throw new ZoneIsAbstractError2();
    }
    get isValid() {
        throw new ZoneIsAbstractError2();
    }
}
const __default = Zone;
const __default1 = __default;
const Zone1 = __default1;
class Invalid {
    constructor(reason3, explanation1){
        this.reason = reason3;
        this.explanation = explanation1;
    }
    toMessage() {
        if (this.explanation) {
            return `${this.reason}: ${this.explanation}`;
        } else {
            return this.reason;
        }
    }
}
const __default2 = Invalid;
const __default3 = __default2;
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
const InvalidArgumentError1 = InvalidArgumentError;
const InvalidArgumentError2 = InvalidArgumentError1;
const isLeapYear1 = isLeapYear;
const weeksInWeekYear1 = weeksInWeekYear;
function asNumber(value) {
    const numericValue = Number(value);
    if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue)) throw new InvalidArgumentError2(`Invalid unit value ${value}`);
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
const timeObject1 = timeObject;
const daysInYear1 = daysInYear;
const isInteger1 = isInteger;
const integerBetween1 = integerBetween;
const daysInMonth1 = daysInMonth;
const objToLocalTS1 = objToLocalTS;
const padStart1 = padStart;
const hasFormatToParts1 = hasFormatToParts;
const pick1 = pick;
const InvalidUnitError1 = InvalidUnitError;
const isUndefined1 = isUndefined;
const roundTo1 = roundTo;
const signedOffset1 = signedOffset;
const formatOffset1 = formatOffset;
const isDate1 = isDate;
const isString1 = isString;
const parseZoneInfo1 = parseZoneInfo;
const ianaRegex1 = ianaRegex;
class InvalidZone extends Zone1 {
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
const __default4 = InvalidZone;
const __default5 = __default4;
const isNumber1 = isNumber;
const normalizeObject1 = normalizeObject;
const ConflictingSpecificationError1 = ConflictingSpecificationError;
const parseInteger1 = parseInteger;
const parseMillis1 = parseMillis;
const untruncateYear1 = untruncateYear;
const InvalidDateTimeError1 = InvalidDateTimeError;
const maybeArray1 = maybeArray;
const bestBy1 = bestBy;
const InvalidDurationError1 = InvalidDurationError;
const hasOwnProperty1 = hasOwnProperty;
const asNumber1 = asNumber;
const hasIntl1 = hasIntl;
const hasRelative1 = hasRelative;
const InvalidIntervalError1 = InvalidIntervalError;
const mod = function() {
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
    const Invalid1 = __default3;
    function unitOutOfRange(unit1, value) {
        return new Invalid1("unit out of range", `you specified ${value} (of type ${typeof value}) as a ${unit1}, which is invalid`);
    }
    function dayOfWeek(year, month, day) {
        const js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
        return js === 0 ? 7 : js;
    }
    const isLeapYear2 = isLeapYear1;
    function computeOrdinal(year, month, day) {
        return day + (isLeapYear2(year) ? leapLadder : nonLeapLadder)[month - 1];
    }
    function uncomputeOrdinal(year, ordinal) {
        const table = isLeapYear2(year) ? leapLadder : nonLeapLadder, month0 = table.findIndex((i)=>i < ordinal
        ), day = ordinal - table[month0];
        return {
            month: month0 + 1,
            day
        };
    }
    const weeksInWeekYear2 = weeksInWeekYear1;
    const timeObject2 = timeObject1;
    function gregorianToWeek(gregObj) {
        const { year , month , day  } = gregObj, ordinal = computeOrdinal(year, month, day), weekday = dayOfWeek(year, month, day);
        let weekNumber = Math.floor((ordinal - weekday + 10) / 7), weekYear;
        if (weekNumber < 1) {
            weekYear = year - 1;
            weekNumber = weeksInWeekYear2(weekYear);
        } else if (weekNumber > weeksInWeekYear2(year)) {
            weekYear = year + 1;
            weekNumber = 1;
        } else {
            weekYear = year;
        }
        return Object.assign({
            weekYear,
            weekNumber,
            weekday
        }, timeObject2(gregObj));
    }
    const daysInYear2 = daysInYear1;
    function weekToGregorian(weekData) {
        const { weekYear , weekNumber , weekday  } = weekData, weekdayOfJan4 = dayOfWeek(weekYear, 1, 4), yearInDays = daysInYear2(weekYear);
        let ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3, year;
        if (ordinal < 1) {
            year = weekYear - 1;
            ordinal += daysInYear2(year);
        } else if (ordinal > yearInDays) {
            year = weekYear + 1;
            ordinal -= daysInYear2(weekYear);
        } else {
            year = weekYear;
        }
        const { month , day  } = uncomputeOrdinal(year, ordinal);
        return Object.assign({
            year,
            month,
            day
        }, timeObject2(weekData));
    }
    function gregorianToOrdinal(gregData) {
        const { year , month , day  } = gregData, ordinal = computeOrdinal(year, month, day);
        return Object.assign({
            year,
            ordinal
        }, timeObject2(gregData));
    }
    function ordinalToGregorian(ordinalData) {
        const { year , ordinal  } = ordinalData, { month , day  } = uncomputeOrdinal(year, ordinal);
        return Object.assign({
            year,
            month,
            day
        }, timeObject2(ordinalData));
    }
    const isInteger2 = isInteger1;
    const integerBetween2 = integerBetween1;
    function hasInvalidWeekData(obj) {
        const validYear = isInteger2(obj.weekYear), validWeek = integerBetween2(obj.weekNumber, 1, weeksInWeekYear2(obj.weekYear)), validWeekday = integerBetween2(obj.weekday, 1, 7);
        if (!validYear) {
            return unitOutOfRange("weekYear", obj.weekYear);
        } else if (!validWeek) {
            return unitOutOfRange("week", obj.week);
        } else if (!validWeekday) {
            return unitOutOfRange("weekday", obj.weekday);
        } else return false;
    }
    function hasInvalidOrdinalData(obj) {
        const validYear = isInteger2(obj.year), validOrdinal = integerBetween2(obj.ordinal, 1, daysInYear2(obj.year));
        if (!validYear) {
            return unitOutOfRange("year", obj.year);
        } else if (!validOrdinal) {
            return unitOutOfRange("ordinal", obj.ordinal);
        } else return false;
    }
    const daysInMonth2 = daysInMonth1;
    function hasInvalidGregorianData(obj) {
        const validYear = isInteger2(obj.year), validMonth = integerBetween2(obj.month, 1, 12), validDay = integerBetween2(obj.day, 1, daysInMonth2(obj.year, obj.month));
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
        const validHour = integerBetween2(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0, validMinute = integerBetween2(minute, 0, 59), validSecond = integerBetween2(second, 0, 59), validMillisecond = integerBetween2(millisecond, 0, 999);
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
    const MAX_DATE = 8640000000000000;
    const Invalid2 = __default3;
    function unsupportedZone(zone) {
        return new Invalid2("unsupported zone", `the zone "${zone.name}" is not supported`);
    }
    const gregorianToWeek1 = gregorianToWeek;
    const gregorianToWeek2 = gregorianToWeek1;
    function possiblyCachedWeekData(dt) {
        if (dt.weekData === null) {
            dt.weekData = gregorianToWeek2(dt.c);
        }
        return dt.weekData;
    }
    function clone(inst, alts) {
        const current = {
            ts: inst.ts,
            zone: inst.zone,
            c: inst.c,
            o: inst.o,
            loc: inst.loc,
            invalid: inst.invalid
        };
        return new DateTime1(Object.assign({
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
    const objToLocalTS2 = objToLocalTS1;
    function objToTS(obj, offset, zone) {
        return fixOffset(objToLocalTS2(obj), offset, zone);
    }
    const daysInMonth3 = daysInMonth1;
    function adjustTime(inst, dur) {
        const oPre = inst.o, year = inst.c.year + Math.trunc(dur.years), month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3, c = Object.assign({
        }, inst.c, {
            year,
            month,
            day: Math.min(inst.c.day, daysInMonth3(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
        }), millisToAdd = Duration6.fromObject({
            years: dur.years - Math.trunc(dur.years),
            quarters: dur.quarters - Math.trunc(dur.quarters),
            months: dur.months - Math.trunc(dur.months),
            weeks: dur.weeks - Math.trunc(dur.weeks),
            days: dur.days - Math.trunc(dur.days),
            hours: dur.hours,
            minutes: dur.minutes,
            seconds: dur.seconds,
            milliseconds: dur.milliseconds
        }).as("milliseconds"), localTS = objToLocalTS2(c);
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
            const interpretationZone = parsedZone || zone, inst = DateTime1.fromObject(Object.assign(parsed, opts, {
                zone: interpretationZone,
                setZone: undefined
            }));
            return setZone ? inst : inst.setZone(zone);
        } else {
            return DateTime1.invalid(new Invalid2("unparsable", `the input "${text}" can't be parsed as ${format}`));
        }
    }
    const padStart2 = padStart1;
    const hasFormatToParts2 = hasFormatToParts1;
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
    function formatRelativeTime(unit1, count, numeric = "always", narrow = false) {
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
        ].indexOf(unit1) === -1;
        if (numeric === "auto" && lastable) {
            const isDay = unit1 === "days";
            switch(count){
                case 1:
                    return isDay ? "tomorrow" : `next ${units[unit1][0]}`;
                case -1:
                    return isDay ? "yesterday" : `last ${units[unit1][0]}`;
                case 0:
                    return isDay ? "today" : `this ${units[unit1][0]}`;
                default:
            }
        }
        const isInPast = Object.is(count, -0) || count < 0, fmtValue = Math.abs(count), singular = fmtValue === 1, lilUnits = units[unit1], fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit1][0] : unit1;
        return isInPast ? `${fmtValue} ${fmtUnit} ago` : `in ${fmtValue} ${fmtUnit}`;
    }
    const pick2 = pick1;
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
    const DATE_SHORT1 = DATE_SHORT;
    const DATE_MED1 = DATE_MED;
    const DATE_MED_WITH_WEEKDAY1 = DATE_MED_WITH_WEEKDAY;
    const DATE_FULL1 = DATE_FULL;
    const DATE_HUGE1 = DATE_HUGE;
    const TIME_SIMPLE1 = TIME_SIMPLE;
    const TIME_WITH_SECONDS1 = TIME_WITH_SECONDS;
    const TIME_WITH_SHORT_OFFSET1 = TIME_WITH_SHORT_OFFSET;
    const TIME_WITH_LONG_OFFSET1 = TIME_WITH_LONG_OFFSET;
    const TIME_24_SIMPLE1 = TIME_24_SIMPLE;
    const TIME_24_WITH_SECONDS1 = TIME_24_WITH_SECONDS;
    const TIME_24_WITH_SHORT_OFFSET1 = TIME_24_WITH_SHORT_OFFSET;
    const TIME_24_WITH_LONG_OFFSET1 = TIME_24_WITH_LONG_OFFSET;
    const DATETIME_SHORT1 = DATETIME_SHORT;
    const DATETIME_MED1 = DATETIME_MED;
    const DATETIME_FULL1 = DATETIME_FULL;
    const DATETIME_HUGE1 = DATETIME_HUGE;
    const DATETIME_SHORT_WITH_SECONDS1 = DATETIME_SHORT_WITH_SECONDS;
    const DATETIME_MED_WITH_SECONDS1 = DATETIME_MED_WITH_SECONDS;
    const DATETIME_MED_WITH_WEEKDAY1 = DATETIME_MED_WITH_WEEKDAY;
    const DATETIME_FULL_WITH_SECONDS1 = DATETIME_FULL_WITH_SECONDS;
    const DATETIME_HUGE_WITH_SECONDS1 = DATETIME_HUGE_WITH_SECONDS;
    function formatString(knownFormat) {
        const filtered = pick2(knownFormat, [
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
            case stringify(DATE_SHORT1):
                return "M/d/yyyy";
            case stringify(DATE_MED1):
                return "LLL d, yyyy";
            case stringify(DATE_MED_WITH_WEEKDAY1):
                return "EEE, LLL d, yyyy";
            case stringify(DATE_FULL1):
                return "LLLL d, yyyy";
            case stringify(DATE_HUGE1):
                return "EEEE, LLLL d, yyyy";
            case stringify(TIME_SIMPLE1):
                return "h:mm a";
            case stringify(TIME_WITH_SECONDS1):
                return "h:mm:ss a";
            case stringify(TIME_WITH_SHORT_OFFSET1):
                return "h:mm a";
            case stringify(TIME_WITH_LONG_OFFSET1):
                return "h:mm a";
            case stringify(TIME_24_SIMPLE1):
                return "HH:mm";
            case stringify(TIME_24_WITH_SECONDS1):
                return "HH:mm:ss";
            case stringify(TIME_24_WITH_SHORT_OFFSET1):
                return "HH:mm";
            case stringify(TIME_24_WITH_LONG_OFFSET1):
                return "HH:mm";
            case stringify(DATETIME_SHORT1):
                return "M/d/yyyy, h:mm a";
            case stringify(DATETIME_MED1):
                return "LLL d, yyyy, h:mm a";
            case stringify(DATETIME_FULL1):
                return "LLLL d, yyyy, h:mm a";
            case stringify(DATETIME_HUGE1):
                return dateTimeHuge;
            case stringify(DATETIME_SHORT_WITH_SECONDS1):
                return "M/d/yyyy, h:mm:ss a";
            case stringify(DATETIME_MED_WITH_SECONDS1):
                return "LLL d, yyyy, h:mm:ss a";
            case stringify(DATETIME_MED_WITH_WEEKDAY1):
                return "EEE, d LLL yyyy, h:mm a";
            case stringify(DATETIME_FULL_WITH_SECONDS1):
                return "LLLL d, yyyy, h:mm:ss a";
            case stringify(DATETIME_HUGE_WITH_SECONDS1):
                return "EEEE, LLLL d, yyyy, h:mm:ss a";
            default:
                return dateTimeHuge;
        }
    }
    const meridiemForDateTime1 = meridiemForDateTime;
    const monthForDateTime1 = monthForDateTime;
    const weekdayForDateTime1 = weekdayForDateTime;
    const eraForDateTime1 = eraForDateTime;
    function stringifyTokens(splits, tokenToString) {
        let s1 = "";
        for (const token of splits){
            if (token.literal) {
                s1 += token.val;
            } else {
                s1 += tokenToString(token.val);
            }
        }
        return s1;
    }
    const macroTokenToFormatOpts = {
        D: DATE_SHORT1,
        DD: DATE_MED1,
        DDD: DATE_FULL1,
        DDDD: DATE_HUGE1,
        t: TIME_SIMPLE1,
        tt: TIME_WITH_SECONDS1,
        ttt: TIME_WITH_SHORT_OFFSET1,
        tttt: TIME_WITH_LONG_OFFSET1,
        T: TIME_24_SIMPLE1,
        TT: TIME_24_WITH_SECONDS1,
        TTT: TIME_24_WITH_SHORT_OFFSET1,
        TTTT: TIME_24_WITH_LONG_OFFSET1,
        f: DATETIME_SHORT1,
        ff: DATETIME_MED1,
        fff: DATETIME_FULL1,
        ffff: DATETIME_HUGE1,
        F: DATETIME_SHORT_WITH_SECONDS1,
        FF: DATETIME_MED_WITH_SECONDS1,
        FFF: DATETIME_FULL_WITH_SECONDS1,
        FFFF: DATETIME_HUGE_WITH_SECONDS1
    };
    class Formatter {
        static create(locale, opts = {
        }) {
            return new Formatter(locale, opts);
        }
        static parseFormat(fmt) {
            let current = null, currentFull = "", bracketed = false;
            const splits = [];
            for(let i = 0; i < fmt.length; i++){
                const c = fmt.charAt(i);
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
        static macroTokenToFormatOpts(token) {
            return macroTokenToFormatOpts[token];
        }
        constructor(locale1, formatOpts){
            this.opts = formatOpts;
            this.loc = locale1;
            this.systemLoc = null;
        }
        formatWithSystemDefault(dt, opts) {
            if (this.systemLoc === null) {
                this.systemLoc = this.loc.redefaultToSystem();
            }
            const df = this.systemLoc.dtFormatter(dt, Object.assign({
            }, this.opts, opts));
            return df.format();
        }
        formatDateTime(dt, opts = {
        }) {
            const df = this.loc.dtFormatter(dt, Object.assign({
            }, this.opts, opts));
            return df.format();
        }
        formatDateTimeParts(dt, opts = {
        }) {
            const df = this.loc.dtFormatter(dt, Object.assign({
            }, this.opts, opts));
            return df.formatToParts();
        }
        resolvedOptions(dt, opts = {
        }) {
            const df = this.loc.dtFormatter(dt, Object.assign({
            }, this.opts, opts));
            return df.resolvedOptions();
        }
        num(n, p = 0) {
            if (this.opts.forceSimple) {
                return padStart2(n, p);
            }
            const opts = Object.assign({
            }, this.opts);
            if (p > 0) {
                opts.padTo = p;
            }
            return this.loc.numberFormatter(opts).format(n);
        }
        formatDateTimeFromString(dt, fmt) {
            const knownEnglish = this.loc.listingMode() === "en", useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory" && hasFormatToParts2(), string = (opts, extract)=>this.loc.extract(dt, opts, extract)
            , formatOffset2 = (opts)=>{
                if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
                    return "Z";
                }
                return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
            }, meridiem = ()=>knownEnglish ? meridiemForDateTime1(dt) : string({
                    hour: "numeric",
                    hour12: true
                }, "dayperiod")
            , month = (length, standalone)=>knownEnglish ? monthForDateTime1(dt, length) : string(standalone ? {
                    month: length
                } : {
                    month: length,
                    day: "numeric"
                }, "month")
            , weekday = (length, standalone)=>knownEnglish ? weekdayForDateTime1(dt, length) : string(standalone ? {
                    weekday: length
                } : {
                    weekday: length,
                    month: "long",
                    day: "numeric"
                }, "weekday")
            , maybeMacro = (token)=>{
                const formatOpts1 = Formatter.macroTokenToFormatOpts(token);
                if (formatOpts1) {
                    return this.formatWithSystemDefault(dt, formatOpts1);
                } else {
                    return token;
                }
            }, era = (length)=>knownEnglish ? eraForDateTime1(dt, length) : string({
                    era: length
                }, "era")
            , tokenToString = (token)=>{
                switch(token){
                    case "S":
                        return this.num(dt.millisecond);
                    case "u":
                    case "SSS":
                        return this.num(dt.millisecond, 3);
                    case "s":
                        return this.num(dt.second);
                    case "ss":
                        return this.num(dt.second, 2);
                    case "m":
                        return this.num(dt.minute);
                    case "mm":
                        return this.num(dt.minute, 2);
                    case "h":
                        return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);
                    case "hh":
                        return this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);
                    case "H":
                        return this.num(dt.hour);
                    case "HH":
                        return this.num(dt.hour, 2);
                    case "Z":
                        return formatOffset2({
                            format: "narrow",
                            allowZ: this.opts.allowZ
                        });
                    case "ZZ":
                        return formatOffset2({
                            format: "short",
                            allowZ: this.opts.allowZ
                        });
                    case "ZZZ":
                        return formatOffset2({
                            format: "techie",
                            allowZ: this.opts.allowZ
                        });
                    case "ZZZZ":
                        return dt.zone.offsetName(dt.ts, {
                            format: "short",
                            locale: this.loc.locale
                        });
                    case "ZZZZZ":
                        return dt.zone.offsetName(dt.ts, {
                            format: "long",
                            locale: this.loc.locale
                        });
                    case "z":
                        return dt.zoneName;
                    case "a":
                        return meridiem();
                    case "d":
                        return useDateTimeFormatter ? string({
                            day: "numeric"
                        }, "day") : this.num(dt.day);
                    case "dd":
                        return useDateTimeFormatter ? string({
                            day: "2-digit"
                        }, "day") : this.num(dt.day, 2);
                    case "c":
                        return this.num(dt.weekday);
                    case "ccc":
                        return weekday("short", true);
                    case "cccc":
                        return weekday("long", true);
                    case "ccccc":
                        return weekday("narrow", true);
                    case "E":
                        return this.num(dt.weekday);
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
                        }, "month") : this.num(dt.month);
                    case "LL":
                        return useDateTimeFormatter ? string({
                            month: "2-digit",
                            day: "numeric"
                        }, "month") : this.num(dt.month, 2);
                    case "LLL":
                        return month("short", true);
                    case "LLLL":
                        return month("long", true);
                    case "LLLLL":
                        return month("narrow", true);
                    case "M":
                        return useDateTimeFormatter ? string({
                            month: "numeric"
                        }, "month") : this.num(dt.month);
                    case "MM":
                        return useDateTimeFormatter ? string({
                            month: "2-digit"
                        }, "month") : this.num(dt.month, 2);
                    case "MMM":
                        return month("short", false);
                    case "MMMM":
                        return month("long", false);
                    case "MMMMM":
                        return month("narrow", false);
                    case "y":
                        return useDateTimeFormatter ? string({
                            year: "numeric"
                        }, "year") : this.num(dt.year);
                    case "yy":
                        return useDateTimeFormatter ? string({
                            year: "2-digit"
                        }, "year") : this.num(dt.year.toString().slice(-2), 2);
                    case "yyyy":
                        return useDateTimeFormatter ? string({
                            year: "numeric"
                        }, "year") : this.num(dt.year, 4);
                    case "yyyyyy":
                        return useDateTimeFormatter ? string({
                            year: "numeric"
                        }, "year") : this.num(dt.year, 6);
                    case "G":
                        return era("short");
                    case "GG":
                        return era("long");
                    case "GGGGG":
                        return era("narrow");
                    case "kk":
                        return this.num(dt.weekYear.toString().slice(-2), 2);
                    case "kkkk":
                        return this.num(dt.weekYear, 4);
                    case "W":
                        return this.num(dt.weekNumber);
                    case "WW":
                        return this.num(dt.weekNumber, 2);
                    case "o":
                        return this.num(dt.ordinal);
                    case "ooo":
                        return this.num(dt.ordinal, 3);
                    case "q":
                        return this.num(dt.quarter);
                    case "qq":
                        return this.num(dt.quarter, 2);
                    case "X":
                        return this.num(Math.floor(dt.ts / 1000));
                    case "x":
                        return this.num(dt.ts);
                    default:
                        return maybeMacro(token);
                }
            };
            return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
        }
        formatDurationFromString(dur, fmt) {
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
            , tokens = Formatter.parseFormat(fmt), realTokens = tokens.reduce((found, { literal , val  })=>literal ? found : found.concat(val)
            , []), collapsed = dur.shiftTo(...realTokens.map(tokenToField).filter((t)=>t
            ));
            return stringifyTokens(tokens, tokenToString(collapsed));
        }
    }
    const __default6 = Formatter;
    const __default7 = __default6;
    const Formatter1 = __default7;
    const Formatter2 = __default7;
    const Formatter3 = __default7;
    const Formatter4 = __default7;
    function toTechFormat(dt, format, allowZ = true) {
        return dt.isValid ? Formatter4.create(Locale4.create("en-US"), {
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
    const orderedUnits = [
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
    const InvalidUnitError2 = InvalidUnitError1;
    function normalizeUnit(unit1) {
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
        }[unit1.toLowerCase()];
        if (!normalized) throw new InvalidUnitError2(unit1);
        return normalized;
    }
    const isUndefined2 = isUndefined1;
    const hasInvalidGregorianData1 = hasInvalidGregorianData;
    const hasInvalidGregorianData2 = hasInvalidGregorianData1;
    const hasInvalidTimeData1 = hasInvalidTimeData;
    const hasInvalidTimeData2 = hasInvalidTimeData1;
    function quickDT(obj, zone) {
        for (const u of orderedUnits){
            if (isUndefined2(obj[u])) {
                obj[u] = defaultUnitValues[u];
            }
        }
        const invalid = hasInvalidGregorianData2(obj) || hasInvalidTimeData2(obj);
        if (invalid) {
            return DateTime1.invalid(invalid);
        }
        const tsNow = Settings8.now(), offsetProvis = zone.offset(tsNow), [ts, o] = objToTS(obj, offsetProvis, zone);
        return new DateTime1({
            ts,
            zone,
            o
        });
    }
    const roundTo2 = roundTo1;
    function diffRelative(start, end, opts) {
        const round = isUndefined2(opts.round) ? true : opts.round, format = (c, unit1)=>{
            c = roundTo2(c, round || opts.calendary ? 0 : 2, true);
            const formatter = end.loc.clone(opts).relFormatter(opts);
            return formatter.format(c, unit1);
        }, differ = (unit1)=>{
            if (opts.calendary) {
                if (!end.hasSame(start, unit1)) {
                    return end.startOf(unit1).diff(start.startOf(unit1), unit1).get(unit1);
                } else return 0;
            } else {
                return end.diff(start, unit1).get(unit1);
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
    const signedOffset2 = signedOffset1;
    const formatOffset2 = formatOffset1;
    const Zone2 = __default1;
    let singleton = null;
    class FixedOffsetZone extends Zone2 {
        static get utcInstance() {
            if (singleton === null) {
                singleton = new FixedOffsetZone(0);
            }
            return singleton;
        }
        static instance(offset) {
            return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
        }
        static parseSpecifier(s) {
            if (s) {
                const r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
                if (r) {
                    return new FixedOffsetZone(signedOffset2(r[1], r[2]));
                }
            }
            return null;
        }
        constructor(offset1){
            super();
            this.fixed = offset1;
        }
        get type() {
            return "fixed";
        }
        get name() {
            return this.fixed === 0 ? "UTC" : `UTC${formatOffset2(this.fixed, "narrow")}`;
        }
        offsetName() {
            return this.name;
        }
        formatOffset(ts, format) {
            return formatOffset2(this.fixed, format);
        }
        get universal() {
            return true;
        }
        offset() {
            return this.fixed;
        }
        equals(otherZone) {
            return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
        }
        get isValid() {
            return true;
        }
    }
    const __default8 = FixedOffsetZone;
    const __default9 = __default8;
    const FixedOffsetZone1 = __default9;
    const FixedOffsetZone2 = FixedOffsetZone1;
    const FixedOffsetZone3 = __default9;
    const FixedOffsetZone4 = __default9;
    const FixedOffsetZone5 = __default9;
    const FixedOffsetZone6 = __default9;
    const isDate2 = isDate1;
    const isUndefined3 = isUndefined1;
    const Zone3 = __default1;
    const isString2 = isString1;
    const parseZoneInfo2 = parseZoneInfo1;
    const formatOffset3 = formatOffset1;
    const objToLocalTS3 = objToLocalTS1;
    const Zone4 = __default1;
    const ianaRegex2 = ianaRegex1;
    const matchingRegex = RegExp(`^${ianaRegex2.source}$`);
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
    const isUndefined4 = isUndefined1;
    function partsOffset(dtf, date) {
        const formatted = dtf.formatToParts(date), filled = [];
        for(let i = 0; i < formatted.length; i++){
            const { type , value  } = formatted[i], pos = typeToPos[type];
            if (!isUndefined4(pos)) {
                filled[pos] = parseInt(value, 10);
            }
        }
        return filled;
    }
    let ianaZoneCache = {
    };
    class IANAZone extends Zone4 {
        static create(name) {
            if (!ianaZoneCache[name]) {
                ianaZoneCache[name] = new IANAZone(name);
            }
            return ianaZoneCache[name];
        }
        static resetCache() {
            ianaZoneCache = {
            };
            dtfCache = {
            };
        }
        static isValidSpecifier(s) {
            return !!(s && s.match(matchingRegex));
        }
        static isValidZone(zone) {
            try {
                new Intl.DateTimeFormat("en-US", {
                    timeZone: zone
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
        offsetName(ts, { format , locale  }) {
            return parseZoneInfo2(ts, format, locale, this.name);
        }
        formatOffset(ts, format) {
            return formatOffset3(this.offset(ts), format);
        }
        offset(ts) {
            const date = new Date(ts), dtf = makeDTF(this.name), [year, month, day, hour, minute, second] = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date), adjustedHour = hour === 24 ? 0 : hour;
            const asUTC = objToLocalTS3({
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
        equals(otherZone) {
            return otherZone.type === "iana" && otherZone.name === this.name;
        }
        get isValid() {
            return this.valid;
        }
    }
    const __default10 = IANAZone;
    const __default11 = __default10;
    const IANAZone1 = __default11;
    const IANAZone2 = IANAZone1;
    const IANAZone3 = __default11;
    const IANAZone4 = __default11;
    const IANAZone5 = __default11;
    const IANAZone6 = __default11;
    const IANAZone7 = __default11;
    const InvalidZone1 = __default5;
    const isNumber2 = isNumber1;
    function normalizeZone(input, defaultZone) {
        let offset1;
        if (isUndefined3(input) || input === null) {
            return defaultZone;
        } else if (input instanceof Zone3) {
            return input;
        } else if (isString2(input)) {
            const lowered = input.toLowerCase();
            if (lowered === "local") return defaultZone;
            else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone4.utcInstance;
            else if ((offset1 = IANAZone5.parseGMTOffset(input)) != null) {
                return FixedOffsetZone4.instance(offset1);
            } else if (IANAZone5.isValidSpecifier(lowered)) return IANAZone5.create(input);
            else return FixedOffsetZone4.parseSpecifier(lowered) || new InvalidZone1(input);
        } else if (isNumber2(input)) {
            return FixedOffsetZone4.instance(input);
        } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
            return input;
        } else {
            return new InvalidZone1(input);
        }
    }
    const normalizeZone1 = normalizeZone;
    const normalizeZone2 = normalizeZone1;
    const normalizeZone3 = normalizeZone1;
    const normalizeZone4 = normalizeZone1;
    const isNumber3 = isNumber1;
    const InvalidArgumentError3 = InvalidArgumentError1;
    const normalizeObject2 = normalizeObject1;
    const ConflictingSpecificationError2 = ConflictingSpecificationError1;
    const gregorianToOrdinal1 = gregorianToOrdinal;
    const gregorianToOrdinal2 = gregorianToOrdinal1;
    const hasInvalidWeekData1 = hasInvalidWeekData;
    const hasInvalidWeekData2 = hasInvalidWeekData1;
    const hasInvalidOrdinalData1 = hasInvalidOrdinalData;
    const hasInvalidOrdinalData2 = hasInvalidOrdinalData1;
    const weekToGregorian1 = weekToGregorian;
    const weekToGregorian2 = weekToGregorian1;
    const ordinalToGregorian1 = ordinalToGregorian;
    const ordinalToGregorian2 = ordinalToGregorian1;
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
    function parse(s2, ...patterns) {
        if (s2 == null) {
            return [
                null,
                null
            ];
        }
        for (const [regex, extractor] of patterns){
            const m = regex.exec(s2);
            if (m) {
                return extractor(m);
            }
        }
        return [
            null,
            null
        ];
    }
    const parseInteger2 = parseInteger1;
    function simpleParse(...keys) {
        return (match, cursor)=>{
            const ret = {
            };
            let i;
            for(i = 0; i < keys.length; i++){
                ret[keys[i]] = parseInteger2(match[cursor + i]);
            }
            return [
                ret,
                null,
                cursor + i
            ];
        };
    }
    const ianaRegex3 = ianaRegex1;
    const offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/, isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/, isoTimeRegex = RegExp(`${isoTimeBaseRegex.source}${offsetRegex.source}?`), isoTimeExtensionRegex = RegExp(`(?:T${isoTimeRegex.source})?`), isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/, isoOrdinalRegex = /(\d{4})-?(\d{3})/, extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay"), extractISOOrdinalData = simpleParse("year", "ordinal"), sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/, sqlTimeRegex = RegExp(`${isoTimeBaseRegex.source} ?(?:${offsetRegex.source}|(${ianaRegex3.source}))?`), sqlTimeExtensionRegex = RegExp(`(?: ${sqlTimeRegex.source})?`);
    const isUndefined5 = isUndefined1;
    function __int(match, pos, fallback) {
        const m = match[pos];
        return isUndefined5(m) ? fallback : parseInteger2(m);
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
    const parseMillis2 = parseMillis1;
    function extractISOTime(match, cursor) {
        const item = {
            hour: __int(match, cursor, 0),
            minute: __int(match, cursor + 1, 0),
            second: __int(match, cursor + 2, 0),
            millisecond: parseMillis2(match[cursor + 3])
        };
        return [
            item,
            null,
            cursor + 4
        ];
    }
    const signedOffset3 = signedOffset1;
    function extractISOOffset(match, cursor) {
        const local = !match[cursor] && !match[cursor + 1], fullOffset = signedOffset3(match[cursor + 1], match[cursor + 2]), zone = local ? null : FixedOffsetZone5.instance(fullOffset);
        return [
            {
            },
            zone,
            cursor + 3
        ];
    }
    function extractIANAZone(match, cursor) {
        const zone = match[cursor] ? IANAZone7.create(match[cursor]) : null;
        return [
            {
            },
            zone,
            cursor + 1
        ];
    }
    const isoDuration = /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;
    function extractISODuration(match) {
        const [s2, yearStr, monthStr, weekStr, dayStr, hourStr, minuteStr, secondStr, millisecondsStr] = match;
        const hasNegativePrefix = s2[0] === "-";
        const maybeNegate = (num)=>num && hasNegativePrefix ? -num : num
        ;
        return [
            {
                years: maybeNegate(parseInteger2(yearStr)),
                months: maybeNegate(parseInteger2(monthStr)),
                weeks: maybeNegate(parseInteger2(weekStr)),
                days: maybeNegate(parseInteger2(dayStr)),
                hours: maybeNegate(parseInteger2(hourStr)),
                minutes: maybeNegate(parseInteger2(minuteStr)),
                seconds: maybeNegate(parseInteger2(secondStr)),
                milliseconds: maybeNegate(parseMillis2(millisecondsStr))
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
    const untruncateYear2 = untruncateYear1;
    const monthsShort1 = monthsShort;
    const weekdaysLong1 = weekdaysLong;
    const weekdaysShort1 = weekdaysShort;
    function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        const result = {
            year: yearStr.length === 2 ? untruncateYear2(parseInteger2(yearStr)) : parseInteger2(yearStr),
            month: monthsShort1.indexOf(monthStr) + 1,
            day: parseInteger2(dayStr),
            hour: parseInteger2(hourStr),
            minute: parseInteger2(minuteStr)
        };
        if (secondStr) result.second = parseInteger2(secondStr);
        if (weekdayStr) {
            result.weekday = weekdayStr.length > 3 ? weekdaysLong1.indexOf(weekdayStr) + 1 : weekdaysShort1.indexOf(weekdayStr) + 1;
        }
        return result;
    }
    const rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
    function extractRFC2822(match) {
        const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr, obsOffset, milOffset, offHourStr, offMinuteStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
        let offset1;
        if (obsOffset) {
            offset1 = obsOffsets[obsOffset];
        } else if (milOffset) {
            offset1 = 0;
        } else {
            offset1 = signedOffset3(offHourStr, offMinuteStr);
        }
        return [
            result,
            new FixedOffsetZone5(offset1)
        ];
    }
    function preprocessRFC2822(s2) {
        return s2.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
    }
    const rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/, rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/, ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
    function extractRFC1123Or850(match) {
        const [, weekdayStr, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
        return [
            result,
            FixedOffsetZone5.utcInstance
        ];
    }
    function extractASCII(match) {
        const [, weekdayStr, monthStr, dayStr, hourStr, minuteStr, secondStr, yearStr] = match, result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
        return [
            result,
            FixedOffsetZone5.utcInstance
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
    function parseISODate(s2) {
        return parse(s2, [
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
    function parseRFC2822Date(s2) {
        return parse(preprocessRFC2822(s2), [
            rfc2822,
            extractRFC2822
        ]);
    }
    function parseHTTPDate(s2) {
        return parse(s2, [
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
    function parseISODuration(s2) {
        return parse(s2, [
            isoDuration,
            extractISODuration
        ]);
    }
    const sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
    const sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
    const extractISOYmdTimeOffsetAndIANAZone = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
    const extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
    function parseSQL(s2) {
        return parse(s2, [
            sqlYmdWithTimeExtensionRegex,
            extractISOYmdTimeOffsetAndIANAZone
        ], [
            sqlTimeCombinedRegex,
            extractISOTimeOffsetAndIANAZone
        ]);
    }
    const parseISODate1 = parseISODate;
    const parseISODate2 = parseISODate1;
    const parseRFC2822Date1 = parseRFC2822Date;
    const parseRFC2822Date2 = parseRFC2822Date1;
    const parseHTTPDate1 = parseHTTPDate;
    const parseHTTPDate2 = parseHTTPDate1;
    const parseSQL1 = parseSQL;
    const parseSQL2 = parseSQL1;
    const InvalidDateTimeError2 = InvalidDateTimeError1;
    const isLeapYear3 = isLeapYear1;
    const daysInYear3 = daysInYear1;
    const weeksInWeekYear3 = weeksInWeekYear1;
    const maybeArray2 = maybeArray1;
    const bestBy2 = bestBy1;
    class DateTime1 {
        constructor(config){
            const zone1 = config.zone || Settings8.defaultZone;
            let invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid2("invalid input") : null) || (!zone1.isValid ? unsupportedZone(zone1) : null);
            this.ts = isUndefined2(config.ts) ? Settings8.now() : config.ts;
            let c = null, o1 = null;
            if (!invalid) {
                const unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone1);
                if (unchanged) {
                    [c, o1] = [
                        config.old.c,
                        config.old.o
                    ];
                } else {
                    const ot = zone1.offset(this.ts);
                    c = tsToObj(this.ts, ot);
                    invalid = Number.isNaN(c.year) ? new Invalid2("invalid input") : null;
                    c = invalid ? null : c;
                    o1 = invalid ? null : ot;
                }
            }
            this._zone = zone1;
            this.loc = config.loc || Locale4.create();
            this.invalid = invalid;
            this.weekData = null;
            this.c = c;
            this.o = o1;
            this.isLuxonDateTime = true;
        }
        static local(year, month, day, hour, minute, second, millisecond) {
            if (isUndefined2(year)) {
                return new DateTime1({
                    ts: Settings8.now()
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
                }, Settings8.defaultZone);
            }
        }
        static utc(year, month, day, hour, minute, second, millisecond) {
            if (isUndefined2(year)) {
                return new DateTime1({
                    ts: Settings8.now(),
                    zone: FixedOffsetZone6.utcInstance
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
                }, FixedOffsetZone6.utcInstance);
            }
        }
        static fromJSDate(date, options = {
        }) {
            const ts = isDate2(date) ? date.valueOf() : NaN;
            if (Number.isNaN(ts)) {
                return DateTime1.invalid("invalid input");
            }
            const zoneToUse = normalizeZone4(options.zone, Settings8.defaultZone);
            if (!zoneToUse.isValid) {
                return DateTime1.invalid(unsupportedZone(zoneToUse));
            }
            return new DateTime1({
                ts: ts,
                zone: zoneToUse,
                loc: Locale4.fromObject(options)
            });
        }
        static fromMillis(milliseconds, options = {
        }) {
            if (!isNumber3(milliseconds)) {
                throw new InvalidArgumentError3(`fromMillis requires a numerical input, but received a ${typeof milliseconds} with value ${milliseconds}`);
            } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
                return DateTime1.invalid("Timestamp out of range");
            } else {
                return new DateTime1({
                    ts: milliseconds,
                    zone: normalizeZone4(options.zone, Settings8.defaultZone),
                    loc: Locale4.fromObject(options)
                });
            }
        }
        static fromSeconds(seconds, options = {
        }) {
            if (!isNumber3(seconds)) {
                throw new InvalidArgumentError3("fromSeconds requires a numerical input");
            } else {
                return new DateTime1({
                    ts: seconds * 1000,
                    zone: normalizeZone4(options.zone, Settings8.defaultZone),
                    loc: Locale4.fromObject(options)
                });
            }
        }
        static fromObject(obj) {
            const zoneToUse = normalizeZone4(obj.zone, Settings8.defaultZone);
            if (!zoneToUse.isValid) {
                return DateTime1.invalid(unsupportedZone(zoneToUse));
            }
            const tsNow = Settings8.now(), offsetProvis = zoneToUse.offset(tsNow), normalized = normalizeObject2(obj, normalizeUnit, [
                "zone",
                "locale",
                "outputCalendar",
                "numberingSystem"
            ]), containsOrdinal = !isUndefined2(normalized.ordinal), containsGregorYear = !isUndefined2(normalized.year), containsGregorMD = !isUndefined2(normalized.month) || !isUndefined2(normalized.day), containsGregor = containsGregorYear || containsGregorMD, definiteWeekDef = normalized.weekYear || normalized.weekNumber, loc = Locale4.fromObject(obj);
            if ((containsGregor || containsOrdinal) && definiteWeekDef) {
                throw new ConflictingSpecificationError2("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
            }
            if (containsGregorMD && containsOrdinal) {
                throw new ConflictingSpecificationError2("Can't mix ordinal dates with month/day");
            }
            const useWeekData = definiteWeekDef || normalized.weekday && !containsGregor;
            let units, defaultValues, objNow = tsToObj(tsNow, offsetProvis);
            if (useWeekData) {
                units = orderedWeekUnits;
                defaultValues = defaultWeekUnitValues;
                objNow = gregorianToWeek2(objNow);
            } else if (containsOrdinal) {
                units = orderedOrdinalUnits;
                defaultValues = defaultOrdinalUnitValues;
                objNow = gregorianToOrdinal2(objNow);
            } else {
                units = orderedUnits;
                defaultValues = defaultUnitValues;
            }
            let foundFirst = false;
            for (const u of units){
                const v = normalized[u];
                if (!isUndefined2(v)) {
                    foundFirst = true;
                } else if (foundFirst) {
                    normalized[u] = defaultValues[u];
                } else {
                    normalized[u] = objNow[u];
                }
            }
            const higherOrderInvalid = useWeekData ? hasInvalidWeekData2(normalized) : containsOrdinal ? hasInvalidOrdinalData2(normalized) : hasInvalidGregorianData2(normalized), invalid1 = higherOrderInvalid || hasInvalidTimeData2(normalized);
            if (invalid1) {
                return DateTime1.invalid(invalid1);
            }
            const gregorian = useWeekData ? weekToGregorian2(normalized) : containsOrdinal ? ordinalToGregorian2(normalized) : normalized, [tsFinal, offsetFinal] = objToTS(gregorian, offsetProvis, zoneToUse), inst = new DateTime1({
                ts: tsFinal,
                zone: zoneToUse,
                o: offsetFinal,
                loc
            });
            if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
                return DateTime1.invalid("mismatched weekday", `you can't specify both a weekday of ${normalized.weekday} and a date of ${inst.toISO()}`);
            }
            return inst;
        }
        static fromISO(text, opts = {
        }) {
            const [vals, parsedZone] = parseISODate2(text);
            return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
        }
        static fromRFC2822(text, opts = {
        }) {
            const [vals, parsedZone] = parseRFC2822Date2(text);
            return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
        }
        static fromHTTP(text, opts = {
        }) {
            const [vals, parsedZone] = parseHTTPDate2(text);
            return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
        }
        static fromFormat(text, fmt, opts = {
        }) {
            if (isUndefined2(text) || isUndefined2(fmt)) {
                throw new InvalidArgumentError3("fromFormat requires an input string and a format");
            }
            const { locale: locale2 = null , numberingSystem =null  } = opts, localeToUse = Locale4.fromOpts({
                locale: locale2,
                numberingSystem,
                defaultToEN: true
            }), [vals, parsedZone, invalid1] = parseFromTokens2(localeToUse, text, fmt);
            if (invalid1) {
                return DateTime1.invalid(invalid1);
            } else {
                return parseDataToDateTime(vals, parsedZone, opts, `format ${fmt}`, text);
            }
        }
        static fromString(text, fmt, opts = {
        }) {
            return DateTime1.fromFormat(text, fmt, opts);
        }
        static fromSQL(text, opts = {
        }) {
            const [vals, parsedZone] = parseSQL2(text);
            return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
        }
        static invalid(reason, explanation = null) {
            if (!reason) {
                throw new InvalidArgumentError3("need to specify a reason the DateTime is invalid");
            }
            const invalid1 = reason instanceof Invalid2 ? reason : new Invalid2(reason, explanation);
            if (Settings8.throwOnInvalid) {
                throw new InvalidDateTimeError2(invalid1);
            } else {
                return new DateTime1({
                    invalid: invalid1
                });
            }
        }
        static isDateTime(o) {
            return o && o.isLuxonDateTime || false;
        }
        get(unit) {
            return this[unit];
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
            return this.isValid ? gregorianToOrdinal2(this.c).ordinal : NaN;
        }
        get monthShort() {
            return this.isValid ? Info3.months("short", {
                locale: this.locale
            })[this.month - 1] : null;
        }
        get monthLong() {
            return this.isValid ? Info3.months("long", {
                locale: this.locale
            })[this.month - 1] : null;
        }
        get weekdayShort() {
            return this.isValid ? Info3.weekdays("short", {
                locale: this.locale
            })[this.weekday - 1] : null;
        }
        get weekdayLong() {
            return this.isValid ? Info3.weekdays("long", {
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
            return isLeapYear3(this.year);
        }
        get daysInMonth() {
            return daysInMonth3(this.year, this.month);
        }
        get daysInYear() {
            return this.isValid ? daysInYear3(this.year) : NaN;
        }
        get weeksInWeekYear() {
            return this.isValid ? weeksInWeekYear3(this.weekYear) : NaN;
        }
        resolvedLocaleOpts(opts = {
        }) {
            const { locale: locale2 , numberingSystem , calendar  } = Formatter4.create(this.loc.clone(opts), opts).resolvedOptions(this);
            return {
                locale: locale2,
                numberingSystem,
                outputCalendar: calendar
            };
        }
        toUTC(offset = 0, opts = {
        }) {
            return this.setZone(FixedOffsetZone6.instance(offset), opts);
        }
        toLocal() {
            return this.setZone(Settings8.defaultZone);
        }
        setZone(zone, { keepLocalTime =false , keepCalendarTime =false  } = {
        }) {
            zone = normalizeZone4(zone, Settings8.defaultZone);
            if (zone.equals(this.zone)) {
                return this;
            } else if (!zone.isValid) {
                return DateTime1.invalid(unsupportedZone(zone));
            } else {
                let newTS = this.ts;
                if (keepLocalTime || keepCalendarTime) {
                    const offsetGuess = zone.offset(this.ts);
                    const asObj = this.toObject();
                    [newTS] = objToTS(asObj, offsetGuess, zone);
                }
                return clone(this, {
                    ts: newTS,
                    zone
                });
            }
        }
        reconfigure({ locale , numberingSystem , outputCalendar  } = {
        }) {
            const loc = this.loc.clone({
                locale,
                numberingSystem,
                outputCalendar
            });
            return clone(this, {
                loc
            });
        }
        setLocale(locale) {
            return this.reconfigure({
                locale
            });
        }
        set(values) {
            if (!this.isValid) return this;
            const normalized = normalizeObject2(values, normalizeUnit, []), settingWeekStuff = !isUndefined2(normalized.weekYear) || !isUndefined2(normalized.weekNumber) || !isUndefined2(normalized.weekday);
            let mixed;
            if (settingWeekStuff) {
                mixed = weekToGregorian2(Object.assign(gregorianToWeek2(this.c), normalized));
            } else if (!isUndefined2(normalized.ordinal)) {
                mixed = ordinalToGregorian2(Object.assign(gregorianToOrdinal2(this.c), normalized));
            } else {
                mixed = Object.assign(this.toObject(), normalized);
                if (isUndefined2(normalized.day)) {
                    mixed.day = Math.min(daysInMonth3(mixed.year, mixed.month), mixed.day);
                }
            }
            const [ts, o2] = objToTS(mixed, this.o, this.zone);
            return clone(this, {
                ts,
                o: o2
            });
        }
        plus(duration) {
            if (!this.isValid) return this;
            const dur = friendlyDuration4(duration);
            return clone(this, adjustTime(this, dur));
        }
        minus(duration) {
            if (!this.isValid) return this;
            const dur = friendlyDuration4(duration).negate();
            return clone(this, adjustTime(this, dur));
        }
        startOf(unit) {
            if (!this.isValid) return this;
            const o2 = {
            }, normalizedUnit = Duration6.normalizeUnit(unit);
            switch(normalizedUnit){
                case "years":
                    o2.month = 1;
                case "quarters":
                case "months":
                    o2.day = 1;
                case "weeks":
                case "days":
                    o2.hour = 0;
                case "hours":
                    o2.minute = 0;
                case "minutes":
                    o2.second = 0;
                case "seconds":
                    o2.millisecond = 0;
                    break;
                case "milliseconds": break;
            }
            if (normalizedUnit === "weeks") {
                o2.weekday = 1;
            }
            if (normalizedUnit === "quarters") {
                const q = Math.ceil(this.month / 3);
                o2.month = (q - 1) * 3 + 1;
            }
            return this.set(o2);
        }
        endOf(unit) {
            return this.isValid ? this.plus({
                [unit]: 1
            }).startOf(unit).minus(1) : this;
        }
        toFormat(fmt, opts = {
        }) {
            return this.isValid ? Formatter4.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID;
        }
        toLocaleString(opts = DATE_SHORT1) {
            return this.isValid ? Formatter4.create(this.loc.clone(opts), opts).formatDateTime(this) : INVALID;
        }
        toLocaleParts(opts = {
        }) {
            return this.isValid ? Formatter4.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
        }
        toISO(opts = {
        }) {
            if (!this.isValid) {
                return null;
            }
            return `${this.toISODate(opts)}T${this.toISOTime(opts)}`;
        }
        toISODate({ format ="extended"  } = {
        }) {
            let fmt = format === "basic" ? "yyyyMMdd" : "yyyy-MM-dd";
            if (this.year > 9999) {
                fmt = "+" + fmt;
            }
            return toTechFormat(this, fmt);
        }
        toISOWeekDate() {
            return toTechFormat(this, "kkkk-'W'WW-c");
        }
        toISOTime({ suppressMilliseconds =false , suppressSeconds =false , includeOffset =true , format ="extended"  } = {
        }) {
            return toTechTimeFormat(this, {
                suppressSeconds,
                suppressMilliseconds,
                includeOffset,
                format
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
        toSQLTime({ includeOffset =true , includeZone =false  } = {
        }) {
            return toTechTimeFormat(this, {
                includeOffset,
                includeZone,
                spaceZone: true
            });
        }
        toSQL(opts = {
        }) {
            if (!this.isValid) {
                return null;
            }
            return `${this.toSQLDate()} ${this.toSQLTime(opts)}`;
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
        toObject(opts = {
        }) {
            if (!this.isValid) return {
            };
            const base = Object.assign({
            }, this.c);
            if (opts.includeConfig) {
                base.outputCalendar = this.outputCalendar;
                base.numberingSystem = this.loc.numberingSystem;
                base.locale = this.loc.locale;
            }
            return base;
        }
        toJSDate() {
            return new Date(this.isValid ? this.ts : NaN);
        }
        diff(otherDateTime, unit = "milliseconds", opts = {
        }) {
            if (!this.isValid || !otherDateTime.isValid) {
                return Duration6.invalid(this.invalid || otherDateTime.invalid, "created by diffing an invalid DateTime");
            }
            const durOpts = Object.assign({
                locale: this.locale,
                numberingSystem: this.numberingSystem
            }, opts);
            const units = maybeArray2(unit).map(Duration6.normalizeUnit), otherIsLater = otherDateTime.valueOf() > this.valueOf(), earlier = otherIsLater ? this : otherDateTime, later = otherIsLater ? otherDateTime : this, diffed = diff(earlier, later, units, durOpts);
            return otherIsLater ? diffed.negate() : diffed;
        }
        diffNow(unit = "milliseconds", opts = {
        }) {
            return this.diff(DateTime1.local(), unit, opts);
        }
        until(otherDateTime) {
            return this.isValid ? Interval3.fromDateTimes(this, otherDateTime) : this;
        }
        hasSame(otherDateTime, unit) {
            if (!this.isValid) return false;
            if (unit === "millisecond") {
                return this.valueOf() === otherDateTime.valueOf();
            } else {
                const inputMs = otherDateTime.valueOf();
                return this.startOf(unit) <= inputMs && inputMs <= this.endOf(unit);
            }
        }
        equals(other) {
            return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
        }
        toRelative(options = {
        }) {
            if (!this.isValid) return null;
            const base = options.base || DateTime1.fromObject({
                zone: this.zone
            }), padding = options.padding ? this < base ? -options.padding : options.padding : 0;
            return diffRelative(base, this.plus(padding), Object.assign(options, {
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
        toRelativeCalendar(options = {
        }) {
            if (!this.isValid) return null;
            return diffRelative(options.base || DateTime1.fromObject({
                zone: this.zone
            }), this, Object.assign(options, {
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
            if (!dateTimes.every(DateTime1.isDateTime)) {
                throw new InvalidArgumentError3("min requires all arguments be DateTimes");
            }
            return bestBy2(dateTimes, (i)=>i.valueOf()
            , Math.min);
        }
        static max(...dateTimes) {
            if (!dateTimes.every(DateTime1.isDateTime)) {
                throw new InvalidArgumentError3("max requires all arguments be DateTimes");
            }
            return bestBy2(dateTimes, (i)=>i.valueOf()
            , Math.max);
        }
        static fromFormatExplain(text, fmt, options = {
        }) {
            const { locale: locale2 = null , numberingSystem =null  } = options, localeToUse = Locale4.fromOpts({
                locale: locale2,
                numberingSystem,
                defaultToEN: true
            });
            return explainFromTokens2(localeToUse, text, fmt);
        }
        static fromStringExplain(text, fmt, options = {
        }) {
            return DateTime1.fromFormatExplain(text, fmt, options);
        }
        static get DATE_SHORT() {
            return DATE_SHORT1;
        }
        static get DATE_MED() {
            return DATE_MED1;
        }
        static get DATE_MED_WITH_WEEKDAY() {
            return DATE_MED_WITH_WEEKDAY1;
        }
        static get DATE_FULL() {
            return DATE_FULL1;
        }
        static get DATE_HUGE() {
            return DATE_HUGE1;
        }
        static get TIME_SIMPLE() {
            return TIME_SIMPLE1;
        }
        static get TIME_WITH_SECONDS() {
            return TIME_WITH_SECONDS1;
        }
        static get TIME_WITH_SHORT_OFFSET() {
            return TIME_WITH_SHORT_OFFSET1;
        }
        static get TIME_WITH_LONG_OFFSET() {
            return TIME_WITH_LONG_OFFSET1;
        }
        static get TIME_24_SIMPLE() {
            return TIME_24_SIMPLE1;
        }
        static get TIME_24_WITH_SECONDS() {
            return TIME_24_WITH_SECONDS1;
        }
        static get TIME_24_WITH_SHORT_OFFSET() {
            return TIME_24_WITH_SHORT_OFFSET1;
        }
        static get TIME_24_WITH_LONG_OFFSET() {
            return TIME_24_WITH_LONG_OFFSET1;
        }
        static get DATETIME_SHORT() {
            return DATETIME_SHORT1;
        }
        static get DATETIME_SHORT_WITH_SECONDS() {
            return DATETIME_SHORT_WITH_SECONDS1;
        }
        static get DATETIME_MED() {
            return DATETIME_MED1;
        }
        static get DATETIME_MED_WITH_SECONDS() {
            return DATETIME_MED_WITH_SECONDS1;
        }
        static get DATETIME_MED_WITH_WEEKDAY() {
            return DATETIME_MED_WITH_WEEKDAY1;
        }
        static get DATETIME_FULL() {
            return DATETIME_FULL1;
        }
        static get DATETIME_FULL_WITH_SECONDS() {
            return DATETIME_FULL_WITH_SECONDS1;
        }
        static get DATETIME_HUGE() {
            return DATETIME_HUGE1;
        }
        static get DATETIME_HUGE_WITH_SECONDS() {
            return DATETIME_HUGE_WITH_SECONDS1;
        }
    }
    function friendlyDateTime1(dateTimeish) {
        if (DateTime1.isDateTime(dateTimeish)) {
            return dateTimeish;
        } else if (dateTimeish && dateTimeish.valueOf && isNumber3(dateTimeish.valueOf())) {
            return DateTime1.fromJSDate(dateTimeish);
        } else if (dateTimeish && typeof dateTimeish === "object") {
            return DateTime1.fromObject(dateTimeish);
        } else {
            throw new InvalidArgumentError3(`Unknown datetime argument: ${dateTimeish}, of type ${typeof dateTimeish}`);
        }
    }
    const INVALID1 = "Invalid Duration";
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
    const orderedUnits1 = [
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
    const reverseUnits = orderedUnits1.slice(0).reverse();
    function clone1(dur, alts, clear = false) {
        const conf = {
            values: clear ? alts.values : Object.assign({
            }, dur.values, alts.values || {
            }),
            loc: dur.loc.clone(alts.loc),
            conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
        };
        return new Duration1(conf);
    }
    function antiTrunc(n2) {
        return n2 < 0 ? Math.floor(n2) : Math.ceil(n2);
    }
    function convert(matrix, fromMap, fromUnit, toMap, toUnit) {
        const conv = matrix[toUnit][fromUnit], raw = fromMap[fromUnit] / conv, sameSign = Math.sign(raw) === Math.sign(toMap[toUnit]), added = !sameSign && toMap[toUnit] !== 0 && Math.abs(raw) <= 1 ? antiTrunc(raw) : Math.trunc(raw);
        toMap[toUnit] += added;
        fromMap[fromUnit] -= added * conv;
    }
    const isUndefined6 = isUndefined1;
    function normalizeValues(matrix, vals) {
        reverseUnits.reduce((previous, current)=>{
            if (!isUndefined6(vals[current])) {
                if (previous) {
                    convert(matrix, vals, previous, vals, current);
                }
                return current;
            } else {
                return previous;
            }
        }, null);
    }
    const InvalidArgumentError4 = InvalidArgumentError1;
    const normalizeObject3 = normalizeObject1;
    const parseISODuration1 = parseISODuration;
    const parseISODuration2 = parseISODuration1;
    const Invalid3 = __default3;
    const InvalidDurationError2 = InvalidDurationError1;
    const InvalidUnitError3 = InvalidUnitError1;
    const roundTo3 = roundTo1;
    const hasOwnProperty2 = hasOwnProperty1;
    const asNumber2 = asNumber1;
    const isNumber4 = isNumber1;
    class Duration1 {
        constructor(config1){
            const accurate = config1.conversionAccuracy === "longterm" || false;
            this.values = config1.values;
            this.loc = config1.loc || Locale3.create();
            this.conversionAccuracy = accurate ? "longterm" : "casual";
            this.invalid = config1.invalid || null;
            this.matrix = accurate ? accurateMatrix : casualMatrix;
            this.isLuxonDuration = true;
        }
        static fromMillis(count, opts) {
            return Duration1.fromObject(Object.assign({
                milliseconds: count
            }, opts));
        }
        static fromObject(obj) {
            if (obj == null || typeof obj !== "object") {
                throw new InvalidArgumentError4(`Duration.fromObject: argument expected to be an object, got ${obj === null ? "null" : typeof obj}`);
            }
            return new Duration1({
                values: normalizeObject3(obj, Duration1.normalizeUnit, [
                    "locale",
                    "numberingSystem",
                    "conversionAccuracy",
                    "zone"
                ]),
                loc: Locale3.fromObject(obj),
                conversionAccuracy: obj.conversionAccuracy
            });
        }
        static fromISO(text, opts) {
            const [parsed] = parseISODuration2(text);
            if (parsed) {
                const obj = Object.assign(parsed, opts);
                return Duration1.fromObject(obj);
            } else {
                return Duration1.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
            }
        }
        static invalid(reason, explanation = null) {
            if (!reason) {
                throw new InvalidArgumentError4("need to specify a reason the Duration is invalid");
            }
            const invalid1 = reason instanceof Invalid3 ? reason : new Invalid3(reason, explanation);
            if (Settings7.throwOnInvalid) {
                throw new InvalidDurationError2(invalid1);
            } else {
                return new Duration1({
                    invalid: invalid1
                });
            }
        }
        static normalizeUnit(unit) {
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
            }[unit ? unit.toLowerCase() : unit];
            if (!normalized) throw new InvalidUnitError3(unit);
            return normalized;
        }
        static isDuration(o) {
            return o && o.isLuxonDuration || false;
        }
        get locale() {
            return this.isValid ? this.loc.locale : null;
        }
        get numberingSystem() {
            return this.isValid ? this.loc.numberingSystem : null;
        }
        toFormat(fmt, opts = {
        }) {
            const fmtOpts = Object.assign({
            }, opts, {
                floor: opts.round !== false && opts.floor !== false
            });
            return this.isValid ? Formatter3.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID1;
        }
        toObject(opts = {
        }) {
            if (!this.isValid) return {
            };
            const base = Object.assign({
            }, this.values);
            if (opts.includeConfig) {
                base.conversionAccuracy = this.conversionAccuracy;
                base.numberingSystem = this.loc.numberingSystem;
                base.locale = this.loc.locale;
            }
            return base;
        }
        toISO() {
            if (!this.isValid) return null;
            let s2 = "P";
            if (this.years !== 0) s2 += this.years + "Y";
            if (this.months !== 0 || this.quarters !== 0) s2 += this.months + this.quarters * 3 + "M";
            if (this.weeks !== 0) s2 += this.weeks + "W";
            if (this.days !== 0) s2 += this.days + "D";
            if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) s2 += "T";
            if (this.hours !== 0) s2 += this.hours + "H";
            if (this.minutes !== 0) s2 += this.minutes + "M";
            if (this.seconds !== 0 || this.milliseconds !== 0) s2 += roundTo3(this.seconds + this.milliseconds / 1000, 3) + "S";
            if (s2 === "P") s2 += "T0S";
            return s2;
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
        plus(duration) {
            if (!this.isValid) return this;
            const dur = friendlyDuration1(duration), result = {
            };
            for (const k of orderedUnits1){
                if (hasOwnProperty2(dur.values, k) || hasOwnProperty2(this.values, k)) {
                    result[k] = dur.get(k) + this.get(k);
                }
            }
            return clone1(this, {
                values: result
            }, true);
        }
        minus(duration) {
            if (!this.isValid) return this;
            const dur = friendlyDuration1(duration);
            return this.plus(dur.negate());
        }
        mapUnits(fn) {
            if (!this.isValid) return this;
            const result = {
            };
            for (const k of Object.keys(this.values)){
                result[k] = asNumber2(fn(this.values[k], k));
            }
            return clone1(this, {
                values: result
            }, true);
        }
        get(unit) {
            return this[Duration1.normalizeUnit(unit)];
        }
        set(values) {
            if (!this.isValid) return this;
            const mixed = Object.assign(this.values, normalizeObject3(values, Duration1.normalizeUnit, []));
            return clone1(this, {
                values: mixed
            });
        }
        reconfigure({ locale , numberingSystem , conversionAccuracy  } = {
        }) {
            const loc = this.loc.clone({
                locale,
                numberingSystem
            }), opts = {
                loc
            };
            if (conversionAccuracy) {
                opts.conversionAccuracy = conversionAccuracy;
            }
            return clone1(this, opts);
        }
        as(unit) {
            return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
        }
        normalize() {
            if (!this.isValid) return this;
            const vals = this.toObject();
            normalizeValues(this.matrix, vals);
            return clone1(this, {
                values: vals
            }, true);
        }
        shiftTo(...units) {
            if (!this.isValid) return this;
            if (units.length === 0) {
                return this;
            }
            units = units.map((u)=>Duration1.normalizeUnit(u)
            );
            const built = {
            }, accumulated = {
            }, vals = this.toObject();
            let lastUnit;
            for (const k of orderedUnits1){
                if (units.indexOf(k) >= 0) {
                    lastUnit = k;
                    let own = 0;
                    for(const ak in accumulated){
                        own += this.matrix[ak][k] * accumulated[ak];
                        accumulated[ak] = 0;
                    }
                    if (isNumber4(vals[k])) {
                        own += vals[k];
                    }
                    const i = Math.trunc(own);
                    built[k] = i;
                    accumulated[k] = own - i;
                    for(const down in vals){
                        if (orderedUnits1.indexOf(down) > orderedUnits1.indexOf(k)) {
                            convert(this.matrix, vals, down, built, k);
                        }
                    }
                } else if (isNumber4(vals[k])) {
                    accumulated[k] = vals[k];
                }
            }
            for(const key in accumulated){
                if (accumulated[key] !== 0) {
                    built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
                }
            }
            return clone1(this, {
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
            return clone1(this, {
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
            for (const u of orderedUnits1){
                if (this.values[u] !== other.values[u]) {
                    return false;
                }
            }
            return true;
        }
    }
    function friendlyDuration1(durationish) {
        if (isNumber4(durationish)) {
            return Duration1.fromMillis(durationish);
        } else if (Duration1.isDuration(durationish)) {
            return durationish;
        } else if (typeof durationish === "object") {
            return Duration1.fromObject(durationish);
        } else {
            throw new InvalidArgumentError4(`Unknown duration argument ${durationish} of type ${typeof durationish}`);
        }
    }
    const hasIntl2 = hasIntl1;
    const hasFormatToParts3 = hasFormatToParts1;
    const hasRelative2 = hasRelative1;
    class Info {
        static hasDST(zone = Settings6.defaultZone) {
            const proto = DateTime7.local().setZone(zone).set({
                month: 12
            });
            return !zone.universal && proto.offset !== proto.set({
                month: 6
            }).offset;
        }
        static isValidIANAZone(zone) {
            return IANAZone6.isValidSpecifier(zone) && IANAZone6.isValidZone(zone);
        }
        static normalizeZone(input) {
            return normalizeZone3(input, Settings6.defaultZone);
        }
        static months(length = "long", { locale =null , numberingSystem =null , outputCalendar ="gregory"  } = {
        }) {
            return Locale2.create(locale, numberingSystem, outputCalendar).months(length);
        }
        static monthsFormat(length = "long", { locale =null , numberingSystem =null , outputCalendar ="gregory"  } = {
        }) {
            return Locale2.create(locale, numberingSystem, outputCalendar).months(length, true);
        }
        static weekdays(length = "long", { locale =null , numberingSystem =null  } = {
        }) {
            return Locale2.create(locale, numberingSystem, null).weekdays(length);
        }
        static weekdaysFormat(length = "long", { locale =null , numberingSystem =null  } = {
        }) {
            return Locale2.create(locale, numberingSystem, null).weekdays(length, true);
        }
        static meridiems({ locale =null  } = {
        }) {
            return Locale2.create(locale).meridiems();
        }
        static eras(length = "short", { locale =null  } = {
        }) {
            return Locale2.create(locale, null, "gregory").eras(length);
        }
        static features() {
            let intl = false, intlTokens = false, zones = false, relative = false;
            if (hasIntl2()) {
                intl = true;
                intlTokens = hasFormatToParts3();
                relative = hasRelative2();
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
    let now = ()=>Date.now()
    , defaultZone = null, defaultLocale = null, defaultNumberingSystem = null, defaultOutputCalendar = null, throwOnInvalid = false;
    const hasIntl3 = hasIntl1;
    const parseZoneInfo3 = parseZoneInfo1;
    const formatOffset4 = formatOffset1;
    const Zone5 = __default1;
    let singleton1 = null;
    class LocalZone extends Zone5 {
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
            if (hasIntl3()) {
                return new Intl.DateTimeFormat().resolvedOptions().timeZone;
            } else return "local";
        }
        get universal() {
            return false;
        }
        offsetName(ts, { format , locale  }) {
            return parseZoneInfo3(ts, format, locale);
        }
        formatOffset(ts, format) {
            return formatOffset4(this.offset(ts), format);
        }
        offset(ts) {
            return -new Date(ts).getTimezoneOffset();
        }
        equals(otherZone) {
            return otherZone.type === "local";
        }
        get isValid() {
            return true;
        }
    }
    const __default12 = LocalZone;
    const __default13 = __default12;
    const LocalZone1 = __default13;
    const LocalZone2 = LocalZone1;
    const LocalZone3 = __default13;
    class Settings1 {
        static get now() {
            return now;
        }
        static set now(n) {
            now = n;
        }
        static get defaultZoneName() {
            return Settings1.defaultZone.name;
        }
        static set defaultZoneName(z) {
            if (!z) {
                defaultZone = null;
            } else {
                defaultZone = normalizeZone2(z);
            }
        }
        static get defaultZone() {
            return defaultZone || LocalZone3.instance;
        }
        static get defaultLocale() {
            return defaultLocale;
        }
        static set defaultLocale(locale) {
            defaultLocale = locale;
        }
        static get defaultNumberingSystem() {
            return defaultNumberingSystem;
        }
        static set defaultNumberingSystem(numberingSystem) {
            defaultNumberingSystem = numberingSystem;
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
        static set throwOnInvalid(t) {
            throwOnInvalid = t;
        }
        static resetCaches() {
            Locale1.resetCache();
            IANAZone4.resetCache();
        }
    }
    let intlDTCache = {
    };
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
    const hasIntl4 = hasIntl1;
    function systemLocale() {
        if (sysLocaleCache) {
            return sysLocaleCache;
        } else if (hasIntl4()) {
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
        if (hasIntl4()) {
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
            const dt = DateTime6.utc(2016, i, 1);
            ms.push(f(dt));
        }
        return ms;
    }
    function mapWeekdays(f) {
        const ms = [];
        for(let i = 1; i <= 7; i++){
            const dt = DateTime6.utc(2016, 11, 13 + i);
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
            return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || hasIntl4() && new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
        }
    }
    const roundTo4 = roundTo1;
    const padStart3 = padStart1;
    class PolyNumberFormatter {
        constructor(intl, forceSimple, opts3){
            this.padTo = opts3.padTo || 0;
            this.floor = opts3.floor || false;
            if (!forceSimple && hasIntl4()) {
                const intlOpts = {
                    useGrouping: false
                };
                if (opts3.padTo > 0) intlOpts.minimumIntegerDigits = opts3.padTo;
                this.inf = getCachedINF(intl, intlOpts);
            }
        }
        format(i) {
            if (this.inf) {
                const fixed = this.floor ? Math.floor(i) : i;
                return this.inf.format(fixed);
            } else {
                const fixed = this.floor ? Math.floor(i) : roundTo4(i, 3);
                return padStart3(fixed, this.padTo);
            }
        }
    }
    const formatString1 = formatString;
    const hasFormatToParts4 = hasFormatToParts1;
    class PolyDateFormatter {
        constructor(dt1, intl1, opts1){
            this.opts = opts1;
            this.hasIntl = hasIntl4();
            let z;
            if (dt1.zone.universal && this.hasIntl) {
                z = "UTC";
                if (opts1.timeZoneName) {
                    this.dt = dt1;
                } else {
                    this.dt = dt1.offset === 0 ? dt1 : DateTime6.fromMillis(dt1.ts + dt1.offset * 60 * 1000);
                }
            } else if (dt1.zone.type === "local") {
                this.dt = dt1;
            } else {
                this.dt = dt1;
                z = dt1.zone.name;
            }
            if (this.hasIntl) {
                const intlOpts = Object.assign({
                }, this.opts);
                if (z) {
                    intlOpts.timeZone = z;
                }
                this.dtf = getCachedDTF(intl1, intlOpts);
            }
        }
        format() {
            if (this.hasIntl) {
                return this.dtf.format(this.dt.toJSDate());
            } else {
                const tokenFormat = formatString1(this.opts), loc = Locale.create("en-US");
                return Formatter2.create(loc).formatDateTimeFromString(this.dt, tokenFormat);
            }
        }
        formatToParts() {
            if (this.hasIntl && hasFormatToParts4()) {
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
    const hasRelative3 = hasRelative1;
    const formatRelativeTime1 = formatRelativeTime;
    class PolyRelFormatter {
        constructor(intl2, isEnglish, opts2){
            this.opts = Object.assign({
                style: "long"
            }, opts2);
            if (!isEnglish && hasRelative3()) {
                this.rtf = getCachedRTF(intl2, opts2);
            }
        }
        format(count, unit) {
            if (this.rtf) {
                return this.rtf.format(count, unit);
            } else {
                return formatRelativeTime1(unit, count, this.opts.numeric, this.opts.style !== "long");
            }
        }
        formatToParts(count, unit) {
            if (this.rtf) {
                return this.rtf.formatToParts(count, unit);
            } else {
                return [];
            }
        }
    }
    const months1 = months;
    const weekdays1 = weekdays;
    const meridiems1 = meridiems;
    const eras1 = eras;
    class Locale {
        static fromOpts(opts) {
            return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
        }
        static create(locale, numberingSystem, outputCalendar, defaultToEN = false) {
            const specifiedLocale = locale || Settings5.defaultLocale, localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale()), numberingSystemR = numberingSystem || Settings5.defaultNumberingSystem, outputCalendarR = outputCalendar || Settings5.defaultOutputCalendar;
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
        static fromObject({ locale , numberingSystem , outputCalendar  } = {
        }) {
            return Locale.create(locale, numberingSystem, outputCalendar);
        }
        constructor(locale2, numbering, outputCalendar, specifiedLocale){
            const [parsedLocale, parsedNumberingSystem, parsedOutputCalendar] = parseLocaleString(locale2);
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
            const intl3 = hasIntl4(), hasFTP = intl3 && hasFormatToParts4(), isActuallyEn = this.isEnglish(), hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
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
        redefaultToEN(alts = {
        }) {
            return this.clone(Object.assign({
            }, alts, {
                defaultToEN: true
            }));
        }
        redefaultToSystem(alts = {
        }) {
            return this.clone(Object.assign({
            }, alts, {
                defaultToEN: false
            }));
        }
        months(length, format = false, defaultOK = true) {
            return listStuff(this, length, defaultOK, months1, ()=>{
                const intl3 = format ? {
                    month: length,
                    day: "numeric"
                } : {
                    month: length
                }, formatStr = format ? "format" : "standalone";
                if (!this.monthsCache[formatStr][length]) {
                    this.monthsCache[formatStr][length] = mapMonths((dt1)=>this.extract(dt1, intl3, "month")
                    );
                }
                return this.monthsCache[formatStr][length];
            });
        }
        weekdays(length, format = false, defaultOK = true) {
            return listStuff(this, length, defaultOK, weekdays1, ()=>{
                const intl3 = format ? {
                    weekday: length,
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                } : {
                    weekday: length
                }, formatStr = format ? "format" : "standalone";
                if (!this.weekdaysCache[formatStr][length]) {
                    this.weekdaysCache[formatStr][length] = mapWeekdays((dt1)=>this.extract(dt1, intl3, "weekday")
                    );
                }
                return this.weekdaysCache[formatStr][length];
            });
        }
        meridiems(defaultOK = true) {
            return listStuff(this, undefined, defaultOK, ()=>meridiems1
            , ()=>{
                if (!this.meridiemCache) {
                    const intl3 = {
                        hour: "numeric",
                        hour12: true
                    };
                    this.meridiemCache = [
                        DateTime6.utc(2016, 11, 13, 9),
                        DateTime6.utc(2016, 11, 13, 19)
                    ].map((dt1)=>this.extract(dt1, intl3, "dayperiod")
                    );
                }
                return this.meridiemCache;
            });
        }
        eras(length, defaultOK = true) {
            return listStuff(this, length, defaultOK, eras1, ()=>{
                const intl3 = {
                    era: length
                };
                if (!this.eraCache[length]) {
                    this.eraCache[length] = [
                        DateTime6.utc(-40, 1, 1),
                        DateTime6.utc(2017, 1, 1)
                    ].map((dt1)=>this.extract(dt1, intl3, "era")
                    );
                }
                return this.eraCache[length];
            });
        }
        extract(dt, intlOpts, field) {
            const df = this.dtFormatter(dt, intlOpts), results = df.formatToParts(), matching = results.find((m)=>m.type.toLowerCase() === field
            );
            return matching ? matching.value : null;
        }
        numberFormatter(opts = {
        }) {
            return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
        }
        dtFormatter(dt, intlOpts = {
        }) {
            return new PolyDateFormatter(dt, this.intl, intlOpts);
        }
        relFormatter(opts = {
        }) {
            return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
        }
        isEnglish() {
            return this.locale === "en" || this.locale.toLowerCase() === "en-us" || hasIntl4() && new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
        }
        equals(other) {
            return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
        }
    }
    function dayDiff(earlier, later) {
        const utcDayStart = (dt2)=>dt2.toUTC(0, {
                keepLocalTime: true
            }).startOf("day").valueOf()
        , ms = utcDayStart(later) - utcDayStart(earlier);
        return Math.floor(Duration5.fromMillis(ms).as("days"));
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
        for (const [unit2, differ] of differs){
            if (units.indexOf(unit2) >= 0) {
                lowestOrder = unit2;
                let delta = differ(cursor, later);
                highWater = cursor.plus({
                    [unit2]: delta
                });
                if (highWater > later) {
                    cursor = cursor.plus({
                        [unit2]: delta - 1
                    });
                    delta -= 1;
                } else {
                    cursor = highWater;
                }
                results[unit2] = delta;
            }
        }
        return [
            cursor,
            results,
            highWater,
            lowestOrder
        ];
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
    const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";
    const parseDigits1 = parseDigits;
    const parseDigits2 = parseDigits1;
    function intUnit(regex, post = (i)=>i
    ) {
        return {
            regex,
            deser: ([s2])=>post(parseDigits2(s2))
        };
    }
    const NBSP = String.fromCharCode(160);
    const spaceOrNBSP = `( |${NBSP})`;
    const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");
    function fixListRegex(s2) {
        return s2.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
    }
    function stripInsensitivities(s2) {
        return s2.replace(/\./g, "").replace(spaceOrNBSPRegExp, " ").toLowerCase();
    }
    function oneOf(strings, startIndex) {
        if (strings === null) {
            return null;
        } else {
            return {
                regex: RegExp(strings.map(fixListRegex).join("|")),
                deser: ([s2])=>strings.findIndex((i)=>stripInsensitivities(s2) === stripInsensitivities(i)
                    ) + startIndex
            };
        }
    }
    const signedOffset4 = signedOffset1;
    function offset2(regex, groups) {
        return {
            regex,
            deser: ([, h, m])=>signedOffset4(h, m)
            ,
            groups
        };
    }
    function simple(regex) {
        return {
            regex,
            deser: ([s2])=>s2
        };
    }
    function escapeToken(value) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    const digitRegex1 = digitRegex;
    const digitRegex2 = digitRegex1;
    const untruncateYear3 = untruncateYear1;
    function unitForToken(token, loc) {
        const one = digitRegex2(loc), two = digitRegex2(loc, "{2}"), three = digitRegex2(loc, "{3}"), four = digitRegex2(loc, "{4}"), six = digitRegex2(loc, "{6}"), oneOrTwo = digitRegex2(loc, "{1,2}"), oneToThree = digitRegex2(loc, "{1,3}"), oneToSix = digitRegex2(loc, "{1,6}"), oneToNine = digitRegex2(loc, "{1,9}"), twoToFour = digitRegex2(loc, "{2,4}"), fourToSix = digitRegex2(loc, "{4,6}"), literal = (t)=>({
                regex: RegExp(escapeToken(t.val)),
                deser: ([s2])=>s2
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
                    return intUnit(twoToFour, untruncateYear3);
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
                    return intUnit(twoToFour, untruncateYear3);
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
                    return offset2(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
                case "ZZZ":
                    return offset2(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
                case "z":
                    return simple(/[a-z_+-/]{1,256}?/i);
                default:
                    return literal(t);
            }
        };
        const unit2 = unitate(token) || {
            invalidReason: MISSING_FTP
        };
        unit2.token = token;
        return unit2;
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
    function tokenForPart(part, locale3, formatOpts1) {
        const { type , value  } = part;
        if (type === "literal") {
            return {
                literal: true,
                val: value
            };
        }
        const style = formatOpts1[type];
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
    const hasOwnProperty3 = hasOwnProperty1;
    function match(input, regex, handlers) {
        const matches = input.match(regex);
        if (matches) {
            const all = {
            };
            let matchIndex = 1;
            for(const i in handlers){
                if (hasOwnProperty3(handlers, i)) {
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
    const isUndefined7 = isUndefined1;
    const parseMillis3 = parseMillis1;
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
        let zone2;
        if (!isUndefined7(matches.Z)) {
            zone2 = new FixedOffsetZone3(matches.Z);
        } else if (!isUndefined7(matches.z)) {
            zone2 = IANAZone3.create(matches.z);
        } else {
            zone2 = null;
        }
        if (!isUndefined7(matches.q)) {
            matches.M = (matches.q - 1) * 3 + 1;
        }
        if (!isUndefined7(matches.h)) {
            if (matches.h < 12 && matches.a === 1) {
                matches.h += 12;
            } else if (matches.h === 12 && matches.a === 0) {
                matches.h = 0;
            }
        }
        if (matches.G === 0 && matches.y) {
            matches.y = -matches.y;
        }
        if (!isUndefined7(matches.u)) {
            matches.S = parseMillis3(matches.u);
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
            zone2
        ];
    }
    let dummyDateTimeCache = null;
    function getDummyDateTime() {
        if (!dummyDateTimeCache) {
            dummyDateTimeCache = DateTime5.fromMillis(1555555555555);
        }
        return dummyDateTimeCache;
    }
    function maybeExpandMacroToken(token, locale3) {
        if (token.literal) {
            return token;
        }
        const formatOpts1 = Formatter1.macroTokenToFormatOpts(token.val);
        if (!formatOpts1) {
            return token;
        }
        const formatter = Formatter1.create(locale3, formatOpts1);
        const parts = formatter.formatDateTimeParts(getDummyDateTime());
        const tokens = parts.map((p)=>tokenForPart(p, locale3, formatOpts1)
        );
        if (tokens.includes(undefined)) {
            return token;
        }
        return tokens;
    }
    function expandMacroTokens(tokens, locale3) {
        return Array.prototype.concat(...tokens.map((t)=>maybeExpandMacroToken(t, locale3)
        ));
    }
    const ConflictingSpecificationError3 = ConflictingSpecificationError1;
    function explainFromTokens(locale3, input, format) {
        const tokens = expandMacroTokens(Formatter1.parseFormat(format), locale3), units = tokens.map((t)=>unitForToken(t, locale3)
        ), disqualifyingUnit = units.find((t)=>t.invalidReason
        );
        if (disqualifyingUnit) {
            return {
                input,
                tokens,
                invalidReason: disqualifyingUnit.invalidReason
            };
        } else {
            const [regexString, handlers] = buildRegex(units), regex = RegExp(regexString, "i"), [rawMatches, matches] = match(input, regex, handlers), [result, zone2] = matches ? dateTimeFromMatches(matches) : [
                null,
                null
            ];
            if (hasOwnProperty3(matches, "a") && hasOwnProperty3(matches, "H")) {
                throw new ConflictingSpecificationError3("Can't include meridiem when specifying 24-hour format");
            }
            return {
                input,
                tokens,
                regex,
                rawMatches,
                matches,
                result,
                zone: zone2
            };
        }
    }
    function parseFromTokens(locale3, input, format) {
        const { result , zone: zone2 , invalidReason  } = explainFromTokens(locale3, input, format);
        return [
            result,
            zone2,
            invalidReason
        ];
    }
    const INVALID2 = "Invalid Interval";
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
    const InvalidArgumentError5 = InvalidArgumentError1;
    const Invalid4 = __default3;
    const InvalidIntervalError2 = InvalidIntervalError1;
    class Interval {
        constructor(config2){
            this.s = config2.start;
            this.e = config2.end;
            this.invalid = config2.invalid || null;
            this.isLuxonInterval = true;
        }
        static invalid(reason, explanation = null) {
            if (!reason) {
                throw new InvalidArgumentError5("need to specify a reason the Interval is invalid");
            }
            const invalid1 = reason instanceof Invalid4 ? reason : new Invalid4(reason, explanation);
            if (Settings4.throwOnInvalid) {
                throw new InvalidIntervalError2(invalid1);
            } else {
                return new Interval({
                    invalid: invalid1
                });
            }
        }
        static fromDateTimes(start, end) {
            const builtStart = friendlyDateTime3(start), builtEnd = friendlyDateTime3(end);
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
        static after(start, duration) {
            const dur = friendlyDuration3(duration), dt2 = friendlyDateTime3(start);
            return Interval.fromDateTimes(dt2, dt2.plus(dur));
        }
        static before(end, duration) {
            const dur = friendlyDuration3(duration), dt2 = friendlyDateTime3(end);
            return Interval.fromDateTimes(dt2.minus(dur), dt2);
        }
        static fromISO(text, opts) {
            const [s2, e] = (text || "").split("/", 2);
            if (s2 && e) {
                let start, startIsValid;
                try {
                    start = DateTime4.fromISO(s2, opts);
                    startIsValid = start.isValid;
                } catch (e) {
                    startIsValid = false;
                }
                let end, endIsValid;
                try {
                    end = DateTime4.fromISO(e, opts);
                    endIsValid = end.isValid;
                } catch (e) {
                    endIsValid = false;
                }
                if (startIsValid && endIsValid) {
                    return Interval.fromDateTimes(start, end);
                }
                if (startIsValid) {
                    const dur = Duration4.fromISO(e, opts);
                    if (dur.isValid) {
                        return Interval.after(start, dur);
                    }
                } else if (endIsValid) {
                    const dur = Duration4.fromISO(s2, opts);
                    if (dur.isValid) {
                        return Interval.before(end, dur);
                    }
                }
            }
            return Interval.invalid("unparsable", `the input "${text}" can't be parsed as ISO 8601`);
        }
        static isInterval(o) {
            return o && o.isLuxonInterval || false;
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
        length(unit = "milliseconds") {
            return this.isValid ? this.toDuration(...[
                unit
            ]).get(unit) : NaN;
        }
        count(unit = "milliseconds") {
            if (!this.isValid) return NaN;
            const start = this.start.startOf(unit), end = this.end.startOf(unit);
            return Math.floor(end.diff(start, unit).get(unit)) + 1;
        }
        hasSame(unit) {
            return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
        }
        isEmpty() {
            return this.s.valueOf() === this.e.valueOf();
        }
        isAfter(dateTime) {
            if (!this.isValid) return false;
            return this.s > dateTime;
        }
        isBefore(dateTime) {
            if (!this.isValid) return false;
            return this.e <= dateTime;
        }
        contains(dateTime) {
            if (!this.isValid) return false;
            return this.s <= dateTime && this.e > dateTime;
        }
        set({ start , end  } = {
        }) {
            if (!this.isValid) return this;
            return Interval.fromDateTimes(start || this.s, end || this.e);
        }
        splitAt(...dateTimes) {
            if (!this.isValid) return [];
            const sorted = dateTimes.map(friendlyDateTime3).filter((d)=>this.contains(d)
            ).sort(), results = [];
            let { s: s2  } = this, i = 0;
            while(s2 < this.e){
                const added = sorted[i] || this.e, next = +added > +this.e ? this.e : added;
                results.push(Interval.fromDateTimes(s2, next));
                s2 = next;
                i += 1;
            }
            return results;
        }
        splitBy(duration) {
            const dur = friendlyDuration3(duration);
            if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
                return [];
            }
            let { s: s2  } = this, added, next;
            const results = [];
            while(s2 < this.e){
                added = s2.plus(dur);
                next = +added > +this.e ? this.e : added;
                results.push(Interval.fromDateTimes(s2, next));
                s2 = next;
            }
            return results;
        }
        divideEqually(numberOfParts) {
            if (!this.isValid) return [];
            return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
        }
        overlaps(other) {
            return this.e > other.s && this.s < other.e;
        }
        abutsStart(other) {
            if (!this.isValid) return false;
            return +this.e === +other.s;
        }
        abutsEnd(other) {
            if (!this.isValid) return false;
            return +other.e === +this.s;
        }
        engulfs(other) {
            if (!this.isValid) return false;
            return this.s <= other.s && this.e >= other.e;
        }
        equals(other) {
            if (!this.isValid || !other.isValid) {
                return false;
            }
            return this.s.equals(other.s) && this.e.equals(other.e);
        }
        intersection(other) {
            if (!this.isValid) return this;
            const s2 = this.s > other.s ? this.s : other.s, e = this.e < other.e ? this.e : other.e;
            if (s2 > e) {
                return null;
            } else {
                return Interval.fromDateTimes(s2, e);
            }
        }
        union(other) {
            if (!this.isValid) return this;
            const s2 = this.s < other.s ? this.s : other.s, e = this.e > other.e ? this.e : other.e;
            return Interval.fromDateTimes(s2, e);
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
        static xor(intervals) {
            let start = null, currentCount = 0;
            const results = [], ends = intervals.map((i)=>[
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
            for (const i of arr){
                currentCount += i.type === "s" ? 1 : -1;
                if (currentCount === 1) {
                    start = i.time;
                } else {
                    if (start && +start !== +i.time) {
                        results.push(Interval.fromDateTimes(start, i.time));
                    }
                    start = null;
                }
            }
            return Interval.merge(results);
        }
        difference(...intervals) {
            return Interval.xor([
                this
            ].concat(intervals)).map((i)=>this.intersection(i)
            ).filter((i)=>i && !i.isEmpty()
            );
        }
        toString() {
            if (!this.isValid) return INVALID2;
            return `[${this.s.toISO()} – ${this.e.toISO()})`;
        }
        toISO(opts) {
            if (!this.isValid) return INVALID2;
            return `${this.s.toISO(opts)}/${this.e.toISO(opts)}`;
        }
        toISODate() {
            if (!this.isValid) return INVALID2;
            return `${this.s.toISODate()}/${this.e.toISODate()}`;
        }
        toISOTime(opts) {
            if (!this.isValid) return INVALID2;
            return `${this.s.toISOTime(opts)}/${this.e.toISOTime(opts)}`;
        }
        toFormat(dateFormat, { separator =" – "  } = {
        }) {
            if (!this.isValid) return INVALID2;
            return `${this.s.toFormat(dateFormat)}${separator}${this.e.toFormat(dateFormat)}`;
        }
        toDuration(unit, opts) {
            if (!this.isValid) {
                return Duration4.invalid(this.invalidReason);
            }
            return this.e.diff(this.s, unit, opts);
        }
        mapEndpoints(mapFn) {
            return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
        }
    }
    const __default14 = DateTime1;
    const __default15 = __default14;
    const DateTime2 = __default15;
    const DateTime3 = DateTime2;
    const DateTime4 = __default15;
    const DateTime5 = __default15;
    const DateTime6 = __default15;
    const DateTime7 = __default15;
    const __default16 = Duration1;
    const __default17 = __default16;
    const Duration2 = __default17;
    const Duration3 = Duration2;
    const Duration4 = __default17;
    const Duration5 = __default17;
    const __default18 = function(earlier, later, units, opts4) {
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
        const duration = Duration5.fromObject(Object.assign(results, opts4));
        if (lowerOrderUnits.length > 0) {
            return Duration5.fromMillis(remainingMillis, opts4).shiftTo(...lowerOrderUnits).plus(duration);
        } else {
            return duration;
        }
    };
    const __default19 = __default18;
    const diff = __default19;
    const Duration6 = __default17;
    const __default20 = Interval;
    const __default21 = __default20;
    const Interval1 = __default21;
    const Interval2 = Interval1;
    const Interval3 = __default21;
    const __default22 = Info;
    const __default23 = __default22;
    const Info1 = __default23;
    const Info2 = Info1;
    const Info3 = __default23;
    const Zone6 = __default1;
    const Zone7 = Zone6;
    const InvalidZone2 = __default5;
    const InvalidZone3 = InvalidZone2;
    const __default24 = Settings1;
    const __default25 = __default24;
    const Settings2 = __default25;
    const Settings3 = Settings2;
    const Settings4 = __default25;
    const Settings5 = __default25;
    const Settings6 = __default25;
    const Settings7 = __default25;
    const Settings8 = __default25;
    const explainFromTokens1 = explainFromTokens;
    const explainFromTokens2 = explainFromTokens1;
    const parseFromTokens1 = parseFromTokens;
    const parseFromTokens2 = parseFromTokens1;
    const monthsLong1 = monthsLong;
    const monthsNarrow1 = monthsNarrow;
    const weekdaysNarrow1 = weekdaysNarrow;
    const erasLong1 = erasLong;
    const erasShort1 = erasShort;
    const erasNarrow1 = erasNarrow;
    const __default26 = Locale;
    const __default27 = __default26;
    const Locale1 = __default27;
    const Locale2 = __default27;
    const Locale3 = __default27;
    const Locale4 = __default27;
    const friendlyDuration2 = friendlyDuration1;
    const friendlyDuration3 = friendlyDuration2;
    const friendlyDuration4 = friendlyDuration2;
    const friendlyDateTime2 = friendlyDateTime1;
    const friendlyDateTime3 = friendlyDateTime2;
    return {
        DateTime: DateTime3,
        Duration: Duration3,
        Interval: Interval2,
        Info: Info2,
        Zone: Zone7,
        FixedOffsetZone: FixedOffsetZone2,
        IANAZone: IANAZone2,
        InvalidZone: InvalidZone3,
        LocalZone: LocalZone2,
        Settings: Settings3
    };
}();
const luxon = mod;
const luxon1 = luxon;
const luxon2 = luxon1;
const date = new Date();
const dt = luxon2.DateTime.fromJSDate(date);
console.log(dt.toISO());
