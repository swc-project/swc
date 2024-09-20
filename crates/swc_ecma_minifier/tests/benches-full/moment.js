//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(global, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = factory() : 'function' == typeof define && define.amd ? define(factory) : global.moment = factory();
}(this, function() {
    'use strict';
    function hooks() {
        return hookCallback.apply(null, arguments);
    }
    function isArray(input) {
        return input instanceof Array || '[object Array]' === Object.prototype.toString.call(input);
    }
    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return null != input && '[object Object]' === Object.prototype.toString.call(input);
    }
    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
    function isObjectEmpty(obj) {
        var k;
        if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(obj).length;
        for(k in obj)if (hasOwnProp(obj, k)) return !1;
        return !0;
    }
    function isUndefined(input) {
        return void 0 === input;
    }
    function isNumber(input) {
        return 'number' == typeof input || '[object Number]' === Object.prototype.toString.call(input);
    }
    function isDate(input) {
        return input instanceof Date || '[object Date]' === Object.prototype.toString.call(input);
    }
    function map(arr, fn) {
        var i, res = [];
        for(i = 0; i < arr.length; ++i)res.push(fn(arr[i], i));
        return res;
    }
    function extend(a, b) {
        for(var i in b)hasOwnProp(b, i) && (a[i] = b[i]);
        return hasOwnProp(b, 'toString') && (a.toString = b.toString), hasOwnProp(b, 'valueOf') && (a.valueOf = b.valueOf), a;
    }
    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, !0).utc();
    }
    function getParsingFlags(m) {
        return null == m._pf && (m._pf = {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }), m._pf;
    }
    function isValid(m) {
        if (null == m._isValid) {
            var flags = getParsingFlags(m), parsedParts = some.call(flags.parsedDateParts, function(i) {
                return null != i;
            }), isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
            if (m._strict && (isNowValid = isNowValid && 0 === flags.charsLeftOver && 0 === flags.unusedTokens.length && void 0 === flags.bigHour), null != Object.isFrozen && Object.isFrozen(m)) return isNowValid;
            m._isValid = isNowValid;
        }
        return m._isValid;
    }
    function createInvalid(flags) {
        var m = createUTC(NaN);
        return null != flags ? extend(getParsingFlags(m), flags) : getParsingFlags(m).userInvalidated = !0, m;
    }
    some = Array.prototype.some ? Array.prototype.some : function(fun) {
        var i, t = Object(this), len = t.length >>> 0;
        for(i = 0; i < len; i++)if (i in t && fun.call(this, t[i], i, t)) return !0;
        return !1;
    };
    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var token, getSetMillisecond, momentProperties = hooks.momentProperties = [], updateInProgress = !1;
    function copyConfig(to, from) {
        var i, prop, val;
        if (isUndefined(from._isAMomentObject) || (to._isAMomentObject = from._isAMomentObject), isUndefined(from._i) || (to._i = from._i), isUndefined(from._f) || (to._f = from._f), isUndefined(from._l) || (to._l = from._l), isUndefined(from._strict) || (to._strict = from._strict), isUndefined(from._tzm) || (to._tzm = from._tzm), isUndefined(from._isUTC) || (to._isUTC = from._isUTC), isUndefined(from._offset) || (to._offset = from._offset), isUndefined(from._pf) || (to._pf = getParsingFlags(from)), isUndefined(from._locale) || (to._locale = from._locale), momentProperties.length > 0) for(i = 0; i < momentProperties.length; i++)isUndefined(val = from[prop = momentProperties[i]]) || (to[prop] = val);
        return to;
    }
    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config), this._d = new Date(null != config._d ? config._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === updateInProgress && (updateInProgress = !0, hooks.updateOffset(this), updateInProgress = !1);
    }
    function isMoment(obj) {
        return obj instanceof Moment || null != obj && null != obj._isAMomentObject;
    }
    function warn(msg) {
        !1 === hooks.suppressDeprecationWarnings && 'undefined' != typeof console && console.warn && console.warn('Deprecation warning: ' + msg);
    }
    function deprecate(msg, fn) {
        var firstTime = !0;
        return extend(function() {
            if (null != hooks.deprecationHandler && hooks.deprecationHandler(null, msg), firstTime) {
                var arg, i, key, args = [];
                for(i = 0; i < arguments.length; i++){
                    if (arg = '', 'object' == typeof arguments[i]) {
                        for(key in arg += '\n[' + i + '] ', arguments[0])hasOwnProp(arguments[0], key) && (arg += key + ': ' + arguments[0][key] + ', ');
                        arg = arg.slice(0, -2);
                    } else arg = arguments[i];
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + Error().stack), firstTime = !1;
            }
            return fn.apply(this, arguments);
        }, fn);
    }
    var deprecations = {};
    function deprecateSimple(name, msg) {
        null != hooks.deprecationHandler && hooks.deprecationHandler(name, msg), deprecations[name] || (warn(msg), deprecations[name] = !0);
    }
    function isFunction(input) {
        return 'undefined' != typeof Function && input instanceof Function || '[object Function]' === Object.prototype.toString.call(input);
    }
    function mergeConfigs(parentConfig, childConfig) {
        var prop, res = extend({}, parentConfig);
        for(prop in childConfig)hasOwnProp(childConfig, prop) && (isObject(parentConfig[prop]) && isObject(childConfig[prop]) ? (res[prop] = {}, extend(res[prop], parentConfig[prop]), extend(res[prop], childConfig[prop])) : null != childConfig[prop] ? res[prop] = childConfig[prop] : delete res[prop]);
        for(prop in parentConfig)hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop]) && // make sure changes to properties don't modify parent config
        (res[prop] = extend({}, res[prop]));
        return res;
    }
    function Locale(config) {
        null != config && this.set(config);
    }
    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number);
        return (number >= 0 ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, targetLength - absNumber.length)).toString().substr(1) + absNumber;
    }
    hooks.suppressDeprecationWarnings = !1, hooks.deprecationHandler = null, keys = Object.keys ? Object.keys : function(obj) {
        var i, res = [];
        for(i in obj)hasOwnProp(obj, i) && res.push(i);
        return res;
    };
    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        'string' == typeof callback && (func = function() {
            return this[callback]();
        }), token && (formatTokenFunctions[token] = func), padded && (formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        }), ordinal && (formatTokenFunctions[ordinal] = function() {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        });
    }
    // format date using native date object
    function formatMoment(m, format) {
        return m.isValid() ? (formatFunctions[format = expandFormat(format, m.localeData())] = formatFunctions[format] || function(format) {
            var input, i, length, array = format.match(formattingTokens);
            for(i = 0, length = array.length; i < length; i++)formatTokenFunctions[array[i]] ? array[i] = formatTokenFunctions[array[i]] : array[i] = (input = array[i]).match(/\[[\s\S]/) ? input.replace(/^\[|\]$/g, '') : input.replace(/\\/g, '');
            return function(mom) {
                var i, output = '';
                for(i = 0; i < length; i++)output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
                return output;
            };
        }(format), formatFunctions[format](m)) : m.localeData().invalidDate();
    }
    function expandFormat(format, locale) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }
        for(localFormattingTokens.lastIndex = 0; i >= 0 && localFormattingTokens.test(format);)format = format.replace(localFormattingTokens, replaceLongDateFormatTokens), localFormattingTokens.lastIndex = 0, i -= 1;
        return format;
    }
    var aliases = {};
    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }
    function normalizeUnits(units) {
        return 'string' == typeof units ? aliases[units] || aliases[units.toLowerCase()] : void 0;
    }
    function normalizeObjectUnits(inputObject) {
        var normalizedProp, prop, normalizedInput = {};
        for(prop in inputObject)hasOwnProp(inputObject, prop) && (normalizedProp = normalizeUnits(prop)) && (normalizedInput[normalizedProp] = inputObject[prop]);
        return normalizedInput;
    }
    var priorities = {};
    function isLeapYear(year) {
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }
    function absFloor(number) {
        return number < 0 ? Math.ceil(number) || 0 : Math.floor(number);
    }
    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        return 0 !== coercedNumber && isFinite(coercedNumber) && (value = absFloor(coercedNumber)), value;
    }
    function makeGetSet(unit, keepTime) {
        return function(value) {
            return null != value ? (set$1(this, unit, value), hooks.updateOffset(this, keepTime), this) : get(this, unit);
        };
    }
    function get(mom, unit) {
        return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }
    function set$1(mom, unit, value) {
        mom.isValid() && !isNaN(value) && ('FullYear' === unit && isLeapYear(mom.year()) && 1 === mom.month() && 29 === mom.date() ? (value = toInt(value), mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()))) : mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value));
    }
    var hookCallback, some, keys, regexes, match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;
    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function(isStrict, localeData) {
            return isStrict && strictRegex ? strictRegex : regex;
        };
    }
    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    regexes = {};
    var tokens = {};
    function addParseToken(token, callback) {
        var i, func = callback;
        for('string' == typeof token && (token = [
            token
        ]), isNumber(callback) && (func = function(input, array) {
            array[callback] = toInt(input);
        }), i = 0; i < token.length; i++)tokens[token[i]] = func;
    }
    function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
            config._w = config._w || {}, callback(input, config._w, config, token);
        });
    }
    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) return NaN;
        var modMonth = (month % 12 + 12) % 12;
        return year += (month - modMonth) / 12, 1 === modMonth ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
    }
    indexOf = Array.prototype.indexOf ? Array.prototype.indexOf : function(o) {
        // I know
        var i;
        for(i = 0; i < this.length; ++i)if (this[i] === o) return i;
        return -1;
    }, // FORMATTING
    addFormatToken('M', [
        'MM',
        2
    ], 'Mo', function() {
        return this.month() + 1;
    }), addFormatToken('MMM', 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
    }), addFormatToken('MMMM', 0, 0, function(format) {
        return this.localeData().months(this, format);
    }), // ALIASES
    addUnitAlias('month', 'M'), priorities.month = 8, // PARSING
    addRegexToken('M', match1to2), addRegexToken('MM', match1to2, match2), addRegexToken('MMM', function(isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    }), addRegexToken('MMMM', function(isStrict, locale) {
        return locale.monthsRegex(isStrict);
    }), addParseToken([
        'M',
        'MM'
    ], function(input, array) {
        array[1] = toInt(input) - 1;
    }), addParseToken([
        'MMM',
        'MMMM'
    ], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        null != month ? array[1] = month : getParsingFlags(config).invalidMonth = input;
    });
    // LOCALES
    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) for(i = 0, // this is not used
        this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []; i < 12; ++i)mom = createUTC([
            2000,
            i
        ]), this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase(), this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        return strict ? 'MMM' === format ? -1 !== (ii = indexOf.call(this._shortMonthsParse, llc)) ? ii : null : -1 !== (ii = indexOf.call(this._longMonthsParse, llc)) ? ii : null : 'MMM' === format ? -1 !== (ii = indexOf.call(this._shortMonthsParse, llc)) ? ii : -1 !== (ii = indexOf.call(this._longMonthsParse, llc)) ? ii : null : -1 !== (ii = indexOf.call(this._longMonthsParse, llc)) ? ii : -1 !== (ii = indexOf.call(this._shortMonthsParse, llc)) ? ii : null;
    }
    // MOMENTS
    function setMonth(mom, value) {
        var dayOfMonth;
        if (!mom.isValid()) // No op
        return mom;
        if ('string' == typeof value) {
            if (/^\d+$/.test(value)) value = toInt(value);
            else // TODO: Another silent failure?
            if (!isNumber(value = mom.localeData().monthsParse(value))) return mom;
        }
        return dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value)), mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth), mom;
    }
    function getSetMonth(value) {
        return null != value ? (setMonth(this, value), hooks.updateOffset(this, !0), this) : get(this, 'Month');
    }
    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }
        var i, mom, shortPieces = [], longPieces = [], mixedPieces = [];
        for(i = 0; i < 12; i++)// make the regex if we don't have it already
        mom = createUTC([
            2000,
            i
        ]), shortPieces.push(this.monthsShort(mom, '')), longPieces.push(this.months(mom, '')), mixedPieces.push(this.months(mom, '')), mixedPieces.push(this.monthsShort(mom, ''));
        for(// Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev), longPieces.sort(cmpLenRev), mixedPieces.sort(cmpLenRev), i = 0; i < 12; i++)shortPieces[i] = regexEscape(shortPieces[i]), longPieces[i] = regexEscape(longPieces[i]);
        for(i = 0; i < 24; i++)mixedPieces[i] = regexEscape(mixedPieces[i]);
        this._monthsRegex = RegExp('^(' + mixedPieces.join('|') + ')', 'i'), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = RegExp('^(' + longPieces.join('|') + ')', 'i'), this._monthsShortStrictRegex = RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }
    // HELPERS
    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }
    // FORMATTING
    addFormatToken('Y', 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    }), addFormatToken(0, [
        'YY',
        2
    ], 0, function() {
        return this.year() % 100;
    }), addFormatToken(0, [
        'YYYY',
        4
    ], 0, 'year'), addFormatToken(0, [
        'YYYYY',
        5
    ], 0, 'year'), addFormatToken(0, [
        'YYYYYY',
        6,
        !0
    ], 0, 'year'), // ALIASES
    addUnitAlias('year', 'y'), priorities.year = 1, // PARSING
    addRegexToken('Y', matchSigned), addRegexToken('YY', match1to2, match2), addRegexToken('YYYY', match1to4, match4), addRegexToken('YYYYY', match1to6, match6), addRegexToken('YYYYYY', match1to6, match6), addParseToken([
        'YYYYY',
        'YYYYYY'
    ], 0), addParseToken('YYYY', function(input, array) {
        array[0] = 2 === input.length ? hooks.parseTwoDigitYear(input) : toInt(input);
    }), addParseToken('YY', function(input, array) {
        array[0] = hooks.parseTwoDigitYear(input);
    }), addParseToken('Y', function(input, array) {
        array[0] = parseInt(input, 10);
    }), // HOOKS
    hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };
    // MOMENTS
    var getSetYear = makeGetSet('FullYear', !0);
    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        return y < 100 && y >= 0 ? isFinite(// preserve leap years using a full 400 year cycle, then reset
        (date = new Date(y + 400, m, d, h, M, s, ms)).getFullYear()) && date.setFullYear(y) : date = new Date(y, m, d, h, M, s, ms), date;
    }
    function createUTCDate(y) {
        var date, args;
        return y < 100 && y >= 0 ? (args = Array.prototype.slice.call(arguments), // preserve leap years using a full 400 year cycle, then reset
        args[0] = y + 400, isFinite((date = new Date(Date.UTC.apply(null, args))).getUTCFullYear()) && date.setUTCFullYear(y)) : date = new Date(Date.UTC.apply(null, arguments)), date;
    }
    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var fwd = 7 + dow - doy;
        return -((7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7) + fwd - 1;
    }
    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var resYear, resDayOfYear, dayOfYear = 1 + 7 * (week - 1) + (7 + weekday - dow) % 7 + firstWeekOffset(year, dow, doy);
        return dayOfYear <= 0 ? resDayOfYear = daysInYear(resYear = year - 1) + dayOfYear : dayOfYear > daysInYear(year) ? (resYear = year + 1, resDayOfYear = dayOfYear - daysInYear(year)) : (resYear = year, resDayOfYear = dayOfYear), {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }
    function weekOfYear(mom, dow, doy) {
        var resWeek, resYear, weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1;
        return week < 1 ? resWeek = week + weeksInYear(resYear = mom.year() - 1, dow, doy) : week > weeksInYear(mom.year(), dow, doy) ? (resWeek = week - weeksInYear(mom.year(), dow, doy), resYear = mom.year() + 1) : (resYear = mom.year(), resWeek = week), {
            week: resWeek,
            year: resYear
        };
    }
    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }
    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }
    // FORMATTING
    addFormatToken('w', [
        'ww',
        2
    ], 'wo', 'week'), addFormatToken('W', [
        'WW',
        2
    ], 'Wo', 'isoWeek'), // ALIASES
    addUnitAlias('week', 'w'), addUnitAlias('isoWeek', 'W'), priorities.week = 5, priorities.isoWeek = 5, // PARSING
    addRegexToken('w', match1to2), addRegexToken('ww', match1to2, match2), addRegexToken('W', match1to2), addRegexToken('WW', match1to2, match2), addWeekParseToken([
        'w',
        'ww',
        'W',
        'WW'
    ], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    }), // FORMATTING
    addFormatToken('d', 0, 'do', 'day'), addFormatToken('dd', 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
    }), addFormatToken('ddd', 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
    }), addFormatToken('dddd', 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
    }), addFormatToken('e', 0, 0, 'weekday'), addFormatToken('E', 0, 0, 'isoWeekday'), // ALIASES
    addUnitAlias('day', 'd'), addUnitAlias('weekday', 'e'), addUnitAlias('isoWeekday', 'E'), priorities.day = 11, priorities.weekday = 11, priorities.isoWeekday = 11, // PARSING
    addRegexToken('d', match1to2), addRegexToken('e', match1to2), addRegexToken('E', match1to2), addRegexToken('dd', function(isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    }), addRegexToken('ddd', function(isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    }), addRegexToken('dddd', function(isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    }), addWeekParseToken([
        'dd',
        'ddd',
        'dddd'
    ], function(input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        null != weekday ? week.d = weekday : getParsingFlags(config).invalidWeekday = input;
    }), addWeekParseToken([
        'd',
        'e',
        'E'
    ], function(input, week, config, token) {
        week[token] = toInt(input);
    });
    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) for(i = 0, this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = []; i < 7; ++i)mom = createUTC([
            2000,
            1
        ]).day(i), this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase(), this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase(), this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        return strict ? 'dddd' === format ? -1 !== (ii = indexOf.call(this._weekdaysParse, llc)) ? ii : null : 'ddd' === format ? -1 !== (ii = indexOf.call(this._shortWeekdaysParse, llc)) ? ii : null : -1 !== (ii = indexOf.call(this._minWeekdaysParse, llc)) ? ii : null : 'dddd' === format ? -1 !== (ii = indexOf.call(this._weekdaysParse, llc)) || -1 !== (ii = indexOf.call(this._shortWeekdaysParse, llc)) ? ii : -1 !== (ii = indexOf.call(this._minWeekdaysParse, llc)) ? ii : null : 'ddd' === format ? -1 !== (ii = indexOf.call(this._shortWeekdaysParse, llc)) || -1 !== (ii = indexOf.call(this._weekdaysParse, llc)) ? ii : -1 !== (ii = indexOf.call(this._minWeekdaysParse, llc)) ? ii : null : -1 !== (ii = indexOf.call(this._minWeekdaysParse, llc)) || -1 !== (ii = indexOf.call(this._weekdaysParse, llc)) ? ii : -1 !== (ii = indexOf.call(this._shortWeekdaysParse, llc)) ? ii : null;
    }
    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }
        var i, mom, minp, shortp, longp, minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [];
        for(i = 0; i < 7; i++)// make the regex if we don't have it already
        mom = createUTC([
            2000,
            1
        ]).day(i), minp = regexEscape(this.weekdaysMin(mom, '')), shortp = regexEscape(this.weekdaysShort(mom, '')), longp = regexEscape(this.weekdays(mom, '')), minPieces.push(minp), shortPieces.push(shortp), longPieces.push(longp), mixedPieces.push(minp), mixedPieces.push(shortp), mixedPieces.push(longp);
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev), shortPieces.sort(cmpLenRev), longPieces.sort(cmpLenRev), mixedPieces.sort(cmpLenRev), this._weekdaysRegex = RegExp('^(' + mixedPieces.join('|') + ')', 'i'), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = RegExp('^(' + longPieces.join('|') + ')', 'i'), this._weekdaysShortStrictRegex = RegExp('^(' + shortPieces.join('|') + ')', 'i'), this._weekdaysMinStrictRegex = RegExp('^(' + minPieces.join('|') + ')', 'i');
    }
    // FORMATTING
    function hFormat() {
        return this.hours() % 12 || 12;
    }
    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }
    // PARSING
    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }
    addFormatToken('H', [
        'HH',
        2
    ], 0, 'hour'), addFormatToken('h', [
        'hh',
        2
    ], 0, hFormat), addFormatToken('k', [
        'kk',
        2
    ], 0, function() {
        return this.hours() || 24;
    }), addFormatToken('hmm', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    }), addFormatToken('hmmss', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    }), addFormatToken('Hmm', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    }), addFormatToken('Hmmss', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
    }), meridiem('a', !0), meridiem('A', !1), // ALIASES
    addUnitAlias('hour', 'h'), priorities.hour = 13, addRegexToken('a', matchMeridiem), addRegexToken('A', matchMeridiem), addRegexToken('H', match1to2), addRegexToken('h', match1to2), addRegexToken('k', match1to2), addRegexToken('HH', match1to2, match2), addRegexToken('hh', match1to2, match2), addRegexToken('kk', match1to2, match2), addRegexToken('hmm', match3to4), addRegexToken('hmmss', match5to6), addRegexToken('Hmm', match3to4), addRegexToken('Hmmss', match5to6), addParseToken([
        'H',
        'HH'
    ], 3), addParseToken([
        'k',
        'kk'
    ], function(input, array, config) {
        var kInput = toInt(input);
        array[3] = 24 === kInput ? 0 : kInput;
    }), addParseToken([
        'a',
        'A'
    ], function(input, array, config) {
        config._isPm = config._locale.isPM(input), config._meridiem = input;
    }), addParseToken([
        'h',
        'hh'
    ], function(input, array, config) {
        array[3] = toInt(input), getParsingFlags(config).bigHour = !0;
    }), addParseToken('hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[3] = toInt(input.substr(0, pos)), array[4] = toInt(input.substr(pos)), getParsingFlags(config).bigHour = !0;
    }), addParseToken('hmmss', function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[3] = toInt(input.substr(0, pos1)), array[4] = toInt(input.substr(pos1, 2)), array[5] = toInt(input.substr(pos2)), getParsingFlags(config).bigHour = !0;
    }), addParseToken('Hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[3] = toInt(input.substr(0, pos)), array[4] = toInt(input.substr(pos));
    }), addParseToken('Hmmss', function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[3] = toInt(input.substr(0, pos1)), array[4] = toInt(input.substr(pos1, 2)), array[5] = toInt(input.substr(pos2));
    });
    var indexOf, globalLocale, // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    getSetHour = makeGetSet('Hours', !0), baseConfig = {
        calendar: {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L'
        },
        longDateFormat: {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A'
        },
        invalidDate: 'Invalid date',
        ordinal: '%d',
        dayOfMonthOrdinalParse: /\d{1,2}/,
        relativeTime: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            w: 'a week',
            ww: '%d weeks',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        },
        months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        monthsShort: defaultLocaleMonthsShort,
        week: {
            dow: 0,
            doy: 6
        },
        weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysShort: defaultLocaleWeekdaysShort,
        meridiemParse: /[ap]\.?m?\.?/i
    }, locales = {}, localeFamilies = {};
    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }
    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (void 0 === locales[name] && 'undefined' != typeof module && module && module.exports) try {
            oldLocale = globalLocale._abbr, require('./locale/' + name), getSetGlobalLocale(oldLocale);
        } catch (e) {
            // mark as not found to avoid repeating expensive file require call causing high CPU
            // when trying to find en-US, en_US, en-us for every format call
            locales[name] = null; // null means not found
        }
        return locales[name];
    }
    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        return key && ((data = isUndefined(values) ? getLocale(key) : defineLocale(key, values)) ? // moment.duration._locale = moment._locale = data;
        globalLocale = data : 'undefined' != typeof console && console.warn && //warn user if arguments are passed but the locale could not be set
        console.warn('Locale ' + key + ' not found. Did you forget to load it?')), globalLocale._abbr;
    }
    function defineLocale(name, config) {
        if (null === config) return(// useful for testing
        delete locales[name], null);
        var locale, parentConfig = baseConfig;
        if (config.abbr = name, null != locales[name]) deprecateSimple('defineLocaleOverride', "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), parentConfig = locales[name]._config;
        else if (null != config.parentLocale) {
            if (null != locales[config.parentLocale]) parentConfig = locales[config.parentLocale]._config;
            else {
                if (null == (locale = loadLocale(config.parentLocale))) return localeFamilies[config.parentLocale] || (localeFamilies[config.parentLocale] = []), localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                }), null;
                parentConfig = locale._config;
            }
        }
        return locales[name] = new Locale(mergeConfigs(parentConfig, config)), localeFamilies[name] && localeFamilies[name].forEach(function(x) {
            defineLocale(x.name, x.config);
        }), // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name), locales[name];
    }
    // returns locale data
    function getLocale(key) {
        var locale;
        if (key && key._locale && key._locale._abbr && (key = key._locale._abbr), !key) return globalLocale;
        if (!isArray(key)) {
            if (//short-circuit everything else
            locale = loadLocale(key)) return locale;
            key = [
                key
            ];
        }
        return(// pick the locale from the array
        // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        function(names) {
            for(var j, next, locale, split, i = 0; i < names.length;){
                for(j = (split = normalizeLocale(names[i]).split('-')).length, next = (next = normalizeLocale(names[i + 1])) ? next.split('-') : null; j > 0;){
                    if (locale = loadLocale(split.slice(0, j).join('-'))) return locale;
                    if (next && next.length >= j && function(arr1, arr2) {
                        var i, minl = Math.min(arr1.length, arr2.length);
                        for(i = 0; i < minl; i += 1)if (arr1[i] !== arr2[i]) return i;
                        return minl;
                    }(split, next) >= j - 1) break;
                    j--;
                }
                i++;
            }
            return globalLocale;
        }(key));
    }
    function checkOverflow(m) {
        var overflow, a = m._a;
        return a && -2 === getParsingFlags(m).overflow && (overflow = a[1] < 0 || a[1] > 11 ? 1 : a[2] < 1 || a[2] > daysInMonth(a[0], a[1]) ? 2 : a[3] < 0 || a[3] > 24 || 24 === a[3] && (0 !== a[4] || 0 !== a[5] || 0 !== a[6]) ? 3 : a[4] < 0 || a[4] > 59 ? 4 : a[5] < 0 || a[5] > 59 ? 5 : a[6] < 0 || a[6] > 999 ? 6 : -1, getParsingFlags(m)._overflowDayOfYear && (overflow < 0 || overflow > 2) && (overflow = 2), getParsingFlags(m)._overflowWeeks && -1 === overflow && (overflow = 7), getParsingFlags(m)._overflowWeekday && -1 === overflow && (overflow = 8), getParsingFlags(m).overflow = overflow), m;
    }
    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
        [
            'YYYYYY-MM-DD',
            /[+-]\d{6}-\d\d-\d\d/
        ],
        [
            'YYYY-MM-DD',
            /\d{4}-\d\d-\d\d/
        ],
        [
            'GGGG-[W]WW-E',
            /\d{4}-W\d\d-\d/
        ],
        [
            'GGGG-[W]WW',
            /\d{4}-W\d\d/,
            !1
        ],
        [
            'YYYY-DDD',
            /\d{4}-\d{3}/
        ],
        [
            'YYYY-MM',
            /\d{4}-\d\d/,
            !1
        ],
        [
            'YYYYYYMMDD',
            /[+-]\d{10}/
        ],
        [
            'YYYYMMDD',
            /\d{8}/
        ],
        [
            'GGGG[W]WWE',
            /\d{4}W\d{3}/
        ],
        [
            'GGGG[W]WW',
            /\d{4}W\d{2}/,
            !1
        ],
        [
            'YYYYDDD',
            /\d{7}/
        ],
        [
            'YYYYMM',
            /\d{6}/,
            !1
        ],
        [
            'YYYY',
            /\d{4}/,
            !1
        ]
    ], // iso time formats and regexes
    isoTimes = [
        [
            'HH:mm:ss.SSSS',
            /\d\d:\d\d:\d\d\.\d+/
        ],
        [
            'HH:mm:ss,SSSS',
            /\d\d:\d\d:\d\d,\d+/
        ],
        [
            'HH:mm:ss',
            /\d\d:\d\d:\d\d/
        ],
        [
            'HH:mm',
            /\d\d:\d\d/
        ],
        [
            'HHmmss.SSSS',
            /\d\d\d\d\d\d\.\d+/
        ],
        [
            'HHmmss,SSSS',
            /\d\d\d\d\d\d,\d+/
        ],
        [
            'HHmmss',
            /\d\d\d\d\d\d/
        ],
        [
            'HHmm',
            /\d\d\d\d/
        ],
        [
            'HH',
            /\d\d/
        ]
    ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -240,
        EST: -300,
        CDT: -300,
        CST: -360,
        MDT: -360,
        MST: -420,
        PDT: -420,
        PST: -480
    };
    // date from iso format
    function configFromISO(config) {
        var i, l, allowTime, dateFormat, timeFormat, tzFormat, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string);
        if (match) {
            for(i = 0, getParsingFlags(config).iso = !0, l = isoDates.length; i < l; i++)if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0], allowTime = !1 !== isoDates[i][2];
                break;
            }
            if (null == dateFormat) {
                config._isValid = !1;
                return;
            }
            if (match[3]) {
                for(i = 0, l = isoTimes.length; i < l; i++)if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
                if (null == timeFormat) {
                    config._isValid = !1;
                    return;
                }
            }
            if (!allowTime && null != timeFormat) {
                config._isValid = !1;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) tzFormat = 'Z';
                else {
                    config._isValid = !1;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || ''), configFromStringAndFormat(config);
        } else config._isValid = !1;
    }
    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var year, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr, result, weekdayStr, match = rfc2822.exec(config._i.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
        if (match) {
            if (yearStr = match[4], monthStr = match[3], dayStr = match[2], hourStr = match[5], minuteStr = match[6], secondStr = match[7], result = [
                (year = parseInt(yearStr, 10)) <= 49 ? 2000 + year : year <= 999 ? 1900 + year : year,
                defaultLocaleMonthsShort.indexOf(monthStr),
                parseInt(dayStr, 10),
                parseInt(hourStr, 10),
                parseInt(minuteStr, 10)
            ], secondStr && result.push(parseInt(secondStr, 10)), (weekdayStr = match[1]) && defaultLocaleWeekdaysShort.indexOf(weekdayStr) !== new Date(result[0], result[1], result[2]).getDay() && (getParsingFlags(config).weekdayMismatch = !0, config._isValid = !1, 1)) return;
            config._a = result, config._tzm = function(obsOffset, militaryOffset, numOffset) {
                if (obsOffset) return obsOffsets[obsOffset];
                if (militaryOffset) // the only allowed military tz is Z
                return 0;
                var hm = parseInt(numOffset, 10), m = hm % 100;
                return (hm - m) / 100 * 60 + m;
            }(match[8], match[9], match[10]), config._d = createUTCDate.apply(null, config._a), config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm), getParsingFlags(config).rfc2822 = !0;
        } else config._isValid = !1;
    }
    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        return null != a ? a : null != b ? b : c;
    }
    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek, nowValue, i, date, currentDate, expectedWeekday, yearToUse, input = [];
        if (!config._d) {
            // Default to current date.
            // * if no year, month, day of month are given, default to today
            // * if day of month is given, default month and year
            // * if month is given, default only year
            // * if year is given, don't default anything
            for(nowValue = new Date(hooks.now()), currentDate = config._useUTC ? [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate()
            ] : [
                nowValue.getFullYear(),
                nowValue.getMonth(),
                nowValue.getDate()
            ], config._w && null == config._a[2] && null == config._a[1] && (null != (w = config._w).GG || null != w.W || null != w.E ? (dow = 1, doy = 4, // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[0], weekOfYear(createLocal(), 1, 4).year), week = defaults(w.W, 1), ((weekday = defaults(w.E, 1)) < 1 || weekday > 7) && (weekdayOverflow = !0)) : (dow = config._locale._week.dow, doy = config._locale._week.doy, curWeek = weekOfYear(createLocal(), dow, doy), weekYear = defaults(w.gg, config._a[0], curWeek.year), // Default to current week.
            week = defaults(w.w, curWeek.week), null != w.d ? (// weekday -- low day numbers are considered next week
            (weekday = w.d) < 0 || weekday > 6) && (weekdayOverflow = !0) : null != w.e ? (// local weekday -- counting starts from beginning of week
            weekday = w.e + dow, (w.e < 0 || w.e > 6) && (weekdayOverflow = !0)) : // default to beginning of week
            weekday = dow), week < 1 || week > weeksInYear(weekYear, dow, doy) ? getParsingFlags(config)._overflowWeeks = !0 : null != weekdayOverflow ? getParsingFlags(config)._overflowWeekday = !0 : (temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), config._a[0] = temp.year, config._dayOfYear = temp.dayOfYear)), null != config._dayOfYear && (yearToUse = defaults(config._a[0], currentDate[0]), (config._dayOfYear > daysInYear(yearToUse) || 0 === config._dayOfYear) && (getParsingFlags(config)._overflowDayOfYear = !0), date = createUTCDate(yearToUse, 0, config._dayOfYear), config._a[1] = date.getUTCMonth(), config._a[2] = date.getUTCDate()), i = 0; i < 3 && null == config._a[i]; ++i)config._a[i] = input[i] = currentDate[i];
            // Zero out whatever was not defaulted, including time
            for(; i < 7; i++)config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
            24 === config._a[3] && 0 === config._a[4] && 0 === config._a[5] && 0 === config._a[6] && (config._nextDay = !0, config._a[3] = 0), config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input), expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay(), null != config._tzm && config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm), config._nextDay && (config._a[3] = 24), config._w && void 0 !== config._w.d && config._w.d !== expectedWeekday && (getParsingFlags(config).weekdayMismatch = !0);
        }
    }
    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [], getParsingFlags(config).empty = !0;
        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var locale, hour, meridiem, isPm, i, parsedInput, tokens1, token, skipped, era, string = '' + config._i, stringLength = string.length, totalParsedInputLength = 0;
        for(i = 0, tokens1 = expandFormat(config._f, config._locale).match(formattingTokens) || []; i < tokens1.length; i++)// don't parse if it's not a known token
        (token = tokens1[i], (parsedInput = (string.match(hasOwnProp(regexes, token) ? regexes[token](config._strict, config._locale) : new RegExp(regexEscape(token.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        })))) || [])[0]) && ((skipped = string.substr(0, string.indexOf(parsedInput))).length > 0 && getParsingFlags(config).unusedInput.push(skipped), string = string.slice(string.indexOf(parsedInput) + parsedInput.length), totalParsedInputLength += parsedInput.length), formatTokenFunctions[token]) ? (parsedInput ? getParsingFlags(config).empty = !1 : getParsingFlags(config).unusedTokens.push(token), null != parsedInput && hasOwnProp(tokens, token) && tokens[token](parsedInput, config._a, config, token)) : config._strict && !parsedInput && getParsingFlags(config).unusedTokens.push(token);
        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength, string.length > 0 && getParsingFlags(config).unusedInput.push(string), config._a[3] <= 12 && !0 === getParsingFlags(config).bigHour && config._a[3] > 0 && (getParsingFlags(config).bigHour = void 0), getParsingFlags(config).parsedDateParts = config._a.slice(0), getParsingFlags(config).meridiem = config._meridiem, // handle meridiem
        config._a[3] = (locale = config._locale, hour = config._a[3], null == (meridiem = config._meridiem) ? hour : null != locale.meridiemHour ? locale.meridiemHour(hour, meridiem) : (null != locale.isPM && (// Fallback
        (isPm = locale.isPM(meridiem)) && hour < 12 && (hour += 12), isPm || 12 !== hour || (hour = 0)), hour)), null !== // handle era
        (era = getParsingFlags(config).era) && (config._a[0] = config._locale.erasConvertYear(era, config._a[0])), configFromArray(config), checkOverflow(config);
    }
    function prepareConfig(config) {
        var input, input1 = config._i, format = config._f;
        return (config._locale = config._locale || getLocale(config._l), null === input1 || void 0 === format && '' === input1) ? createInvalid({
            nullInput: !0
        }) : ('string' == typeof input1 && (config._i = input1 = config._locale.preparse(input1)), isMoment(input1)) ? new Moment(checkOverflow(input1)) : (isDate(input1) ? config._d = input1 : isArray(format) ? // date from string and array of format strings
        function(config) {
            var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = !1;
            if (0 === config._f.length) {
                getParsingFlags(config).invalidFormat = !0, config._d = new Date(NaN);
                return;
            }
            for(i = 0; i < config._f.length; i++)currentScore = 0, validFormatFound = !1, tempConfig = copyConfig({}, config), null != config._useUTC && (tempConfig._useUTC = config._useUTC), tempConfig._f = config._f[i], configFromStringAndFormat(tempConfig), isValid(tempConfig) && (validFormatFound = !0), // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver, //or tokens
            currentScore += 10 * getParsingFlags(tempConfig).unusedTokens.length, getParsingFlags(tempConfig).score = currentScore, bestFormatIsValid ? currentScore < scoreToBeat && (scoreToBeat = currentScore, bestMoment = tempConfig) : (null == scoreToBeat || currentScore < scoreToBeat || validFormatFound) && (scoreToBeat = currentScore, bestMoment = tempConfig, validFormatFound && (bestFormatIsValid = !0));
            extend(config, bestMoment || tempConfig);
        }(config) : format ? configFromStringAndFormat(config) : isUndefined(input = config._i) ? config._d = new Date(hooks.now()) : isDate(input) ? config._d = new Date(input.valueOf()) : 'string' == typeof input ? // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
        function(config) {
            var matched = aspNetJsonRegex.exec(config._i);
            if (null !== matched) {
                config._d = new Date(+matched[1]);
                return;
            }
            configFromISO(config), !1 === config._isValid && (delete config._isValid, configFromRFC2822(config), !1 === config._isValid && (delete config._isValid, config._strict ? config._isValid = !1 : // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config)));
        }(config) : isArray(input) ? (config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
        }), configFromArray(config)) : isObject(input) ? function(config) {
            if (!config._d) {
                var i = normalizeObjectUnits(config._i), dayOrDate = void 0 === i.day ? i.date : i.day;
                config._a = map([
                    i.year,
                    i.month,
                    dayOrDate,
                    i.hour,
                    i.minute,
                    i.second,
                    i.millisecond
                ], function(obj) {
                    return obj && parseInt(obj, 10);
                }), configFromArray(config);
            }
        }(config) : isNumber(input) ? // from milliseconds
        config._d = new Date(input) : hooks.createFromInputFallback(config), isValid(config) || (config._d = null), config);
    }
    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var res, c = {};
        return (!0 === format || !1 === format) && (strict = format, format = void 0), (!0 === locale || !1 === locale) && (strict = locale, locale = void 0), (isObject(input) && isObjectEmpty(input) || isArray(input) && 0 === input.length) && (input = void 0), // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = !0, c._useUTC = c._isUTC = isUTC, c._l = locale, c._i = input, c._f = format, c._strict = strict, (res = new Moment(checkOverflow(prepareConfig(c))))._nextDay && (// Adding is smart enough around DST
        res.add(1, 'd'), res._nextDay = void 0), res;
    }
    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, !1);
    }
    hooks.createFromInputFallback = deprecate("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }), // constant that refers to the ISO standard
    hooks.ISO_8601 = function() {}, // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function() {};
    var prototypeMin = deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function() {
        var other = createLocal.apply(null, arguments);
        return this.isValid() && other.isValid() ? other < this ? this : other : createInvalid();
    }), prototypeMax = deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function() {
        var other = createLocal.apply(null, arguments);
        return this.isValid() && other.isValid() ? other > this ? this : other : createInvalid();
    });
    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (1 === moments.length && isArray(moments[0]) && (moments = moments[0]), !moments.length) return createLocal();
        for(i = 1, res = moments[0]; i < moments.length; ++i)(!moments[i].isValid() || moments[i][fn](res)) && (res = moments[i]);
        return res;
    }
    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond'
    ];
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || normalizedInput.isoWeek || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
        this._isValid = function(m) {
            var key, i, unitHasDecimal = !1;
            for(key in m)if (hasOwnProp(m, key) && !(-1 !== indexOf.call(ordering, key) && (null == m[key] || !isNaN(m[key])))) return !1;
            for(i = 0; i < ordering.length; ++i)if (m[ordering[i]]) {
                if (unitHasDecimal) return !1; // only allow non-integers for smallest unit
                parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]]) && (unitHasDecimal = !0);
            }
            return !0;
        }(normalizedInput), // representation for dateAddRemove
        this._milliseconds = +milliseconds + 1e3 * seconds + // 1000
        6e4 * minutes + // 1000 * 60
        3600000 * hours, // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + 7 * weeks, // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + 3 * quarters + 12 * years, this._data = {}, this._locale = getLocale(), this._bubble();
    }
    function isDuration(obj) {
        return obj instanceof Duration;
    }
    function absRound(number) {
        return number < 0 ? -1 * Math.round(-1 * number) : Math.round(number);
    }
    // FORMATTING
    function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
            var offset = this.utcOffset(), sign = '+';
            return offset < 0 && (offset = -offset, sign = '-'), sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
        });
    }
    offset('Z', ':'), offset('ZZ', ''), // PARSING
    addRegexToken('Z', matchShortOffset), addRegexToken('ZZ', matchShortOffset), addParseToken([
        'Z',
        'ZZ'
    ], function(input, array, config) {
        config._useUTC = !0, config._tzm = offsetFromString(matchShortOffset, input);
    });
    // HELPERS
    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;
    function offsetFromString(matcher, string) {
        var parts, minutes, matches = (string || '').match(matcher);
        return null === matches ? null : 0 === (minutes = +(60 * (parts = ((matches[matches.length - 1] || []) + '').match(chunkOffset) || [
            '-',
            0,
            0
        ])[1]) + toInt(parts[2])) ? 0 : '+' === parts[0] ? minutes : -minutes;
    }
    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        return model._isUTC ? (res = model.clone(), diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf(), // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff), hooks.updateOffset(res, !1), res) : createLocal(input).local();
    }
    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }
    function isUtc() {
        return !!this.isValid() && this._isUTC && 0 === this._offset;
    }
    // HOOKS
    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function() {};
    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function createDuration(input, key) {
        var base, other, res, sign, ret, diffRes, duration = input, // matching against regexp is expensive, do it on demand
        match = null;
        return isDuration(input) ? duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
        } : isNumber(input) || !isNaN(+input) ? (duration = {}, key ? duration[key] = +input : duration.milliseconds = +input) : (match = aspNetRegex.exec(input)) ? (sign = '-' === match[1] ? -1 : 1, duration = {
            y: 0,
            d: toInt(match[2]) * sign,
            h: toInt(match[3]) * sign,
            m: toInt(match[4]) * sign,
            s: toInt(match[5]) * sign,
            ms: toInt(absRound(1000 * match[6])) * sign
        }) : (match = isoRegex.exec(input)) ? (sign = '-' === match[1] ? -1 : 1, duration = {
            y: parseIso(match[2], sign),
            M: parseIso(match[3], sign),
            w: parseIso(match[4], sign),
            d: parseIso(match[5], sign),
            h: parseIso(match[6], sign),
            m: parseIso(match[7], sign),
            s: parseIso(match[8], sign)
        }) : null == duration ? // checks for null or undefined
        duration = {} : 'object' == typeof duration && ('from' in duration || 'to' in duration) && (base = createLocal(duration.from), other = createLocal(duration.to), diffRes = base.isValid() && other.isValid() ? (other = cloneWithOffset(other, base), base.isBefore(other) ? res = positiveMomentsDifference(base, other) : ((res = positiveMomentsDifference(other, base)).milliseconds = -res.milliseconds, res.months = -res.months), res) : {
            milliseconds: 0,
            months: 0
        }, (duration = {}).ms = diffRes.milliseconds, duration.M = diffRes.months), ret = new Duration(duration), isDuration(input) && hasOwnProp(input, '_locale') && (ret._locale = input._locale), isDuration(input) && hasOwnProp(input, '_isValid') && (ret._isValid = input._isValid), ret;
    }
    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }
    function positiveMomentsDifference(base, other) {
        var res = {};
        return res.months = other.month() - base.month() + (other.year() - base.year()) * 12, base.clone().add(res.months, 'M').isAfter(other) && --res.months, res.milliseconds = +other - +base.clone().add(res.months, 'M'), res;
    }
    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function(val, period) {
            var tmp;
            return null === period || isNaN(+period) || (deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), tmp = val, val = period, period = tmp), addSubtract(this, createDuration(val, period), direction), this;
        };
    }
    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds, days = absRound(duration._days), months = absRound(duration._months);
        mom.isValid() && (updateOffset = null == updateOffset || updateOffset, months && setMonth(mom, get(mom, 'Month') + months * isAdding), days && set$1(mom, 'Date', get(mom, 'Date') + days * isAdding), milliseconds && mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding), updateOffset && hooks.updateOffset(mom, days || months));
    }
    createDuration.fn = Duration.prototype, createDuration.invalid = function() {
        return createDuration(NaN);
    };
    var add = createAdder(1, 'add'), subtract = createAdder(-1, 'subtract');
    function isString(input) {
        return 'string' == typeof input || input instanceof String;
    }
    function monthDiff(a, b) {
        if (a.date() < b.date()) // end-of-month calculations work correct when the start month has more
        // days than the end month.
        return -monthDiff(b, a);
        // difference in months
        var adjust, wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months');
        //check for negative zero, return zero if negative zero
        return(// linear across the month
        adjust = b - anchor < 0 ? (b - anchor) / (anchor - a.clone().add(wholeMonthDiff - 1, 'months')) : (b - anchor) / (a.clone().add(wholeMonthDiff + 1, 'months') - anchor), -(wholeMonthDiff + adjust) || 0);
    }
    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;
        return void 0 === key ? this._locale._abbr : (null != (newLocaleData = getLocale(key)) && (this._locale = newLocaleData), this);
    }
    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ', hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
    var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function(key) {
        return void 0 === key ? this.localeData() : this.locale(key);
    });
    function localeData() {
        return this._locale;
    }
    function localStartOfDate(y, m, d) {
        return(// the date constructor remaps years 0-99 to 1900-1999
        y < 100 && y >= 0 ? new Date(y + 400, m, d) - 12622780800000 : new Date(y, m, d).valueOf());
    }
    function utcStartOfDate(y, m, d) {
        return(// Date.UTC remaps years 0-99 to 1900-1999
        y < 100 && y >= 0 ? Date.UTC(y + 400, m, d) - 12622780800000 : Date.UTC(y, m, d));
    }
    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }
    function computeErasParse() {
        var i, l, abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], eras = this.eras();
        for(i = 0, l = eras.length; i < l; ++i)namePieces.push(regexEscape(eras[i].name)), abbrPieces.push(regexEscape(eras[i].abbr)), narrowPieces.push(regexEscape(eras[i].narrow)), mixedPieces.push(regexEscape(eras[i].name)), mixedPieces.push(regexEscape(eras[i].abbr)), mixedPieces.push(regexEscape(eras[i].narrow));
        this._erasRegex = RegExp('^(' + mixedPieces.join('|') + ')', 'i'), this._erasNameRegex = RegExp('^(' + namePieces.join('|') + ')', 'i'), this._erasAbbrRegex = RegExp('^(' + abbrPieces.join('|') + ')', 'i'), this._erasNarrowRegex = RegExp('^(' + narrowPieces.join('|') + ')', 'i');
    }
    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [
            token,
            token.length
        ], 0, getter);
    }
    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        return null == input ? weekOfYear(this, dow, doy).year : (week > (weeksTarget = weeksInYear(input, dow, doy)) && (week = weeksTarget), setWeekAll.call(this, input, week, weekday, dow, doy));
    }
    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        return this.year(date.getUTCFullYear()), this.month(date.getUTCMonth()), this.date(date.getUTCDate()), this;
    }
    addFormatToken('N', 0, 0, 'eraAbbr'), addFormatToken('NN', 0, 0, 'eraAbbr'), addFormatToken('NNN', 0, 0, 'eraAbbr'), addFormatToken('NNNN', 0, 0, 'eraName'), addFormatToken('NNNNN', 0, 0, 'eraNarrow'), addFormatToken('y', [
        'y',
        1
    ], 'yo', 'eraYear'), addFormatToken('y', [
        'yy',
        2
    ], 0, 'eraYear'), addFormatToken('y', [
        'yyy',
        3
    ], 0, 'eraYear'), addFormatToken('y', [
        'yyyy',
        4
    ], 0, 'eraYear'), addRegexToken('N', matchEraAbbr), addRegexToken('NN', matchEraAbbr), addRegexToken('NNN', matchEraAbbr), addRegexToken('NNNN', function(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }), addRegexToken('NNNNN', function(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }), addParseToken([
        'N',
        'NN',
        'NNN',
        'NNNN',
        'NNNNN'
    ], function(input, array, config, token) {
        var era = config._locale.erasParse(input, token, config._strict);
        era ? getParsingFlags(config).era = era : getParsingFlags(config).invalidEra = input;
    }), addRegexToken('y', matchUnsigned), addRegexToken('yy', matchUnsigned), addRegexToken('yyy', matchUnsigned), addRegexToken('yyyy', matchUnsigned), addRegexToken('yo', function(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }), addParseToken([
        'y',
        'yy',
        'yyy',
        'yyyy'
    ], 0), addParseToken([
        'yo'
    ], function(input, array, config, token) {
        var match;
        config._locale._eraYearOrdinalRegex && (match = input.match(config._locale._eraYearOrdinalRegex)), config._locale.eraYearOrdinalParse ? array[0] = config._locale.eraYearOrdinalParse(input, match) : array[0] = parseInt(input, 10);
    }), // FORMATTING
    addFormatToken(0, [
        'gg',
        2
    ], 0, function() {
        return this.weekYear() % 100;
    }), addFormatToken(0, [
        'GG',
        2
    ], 0, function() {
        return this.isoWeekYear() % 100;
    }), addWeekYearFormatToken('gggg', 'weekYear'), addWeekYearFormatToken('ggggg', 'weekYear'), addWeekYearFormatToken('GGGG', 'isoWeekYear'), addWeekYearFormatToken('GGGGG', 'isoWeekYear'), // ALIASES
    addUnitAlias('weekYear', 'gg'), addUnitAlias('isoWeekYear', 'GG'), priorities.weekYear = 1, priorities.isoWeekYear = 1, // PARSING
    addRegexToken('G', matchSigned), addRegexToken('g', matchSigned), addRegexToken('GG', match1to2, match2), addRegexToken('gg', match1to2, match2), addRegexToken('GGGG', match1to4, match4), addRegexToken('gggg', match1to4, match4), addRegexToken('GGGGG', match1to6, match6), addRegexToken('ggggg', match1to6, match6), addWeekParseToken([
        'gggg',
        'ggggg',
        'GGGG',
        'GGGGG'
    ], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    }), addWeekParseToken([
        'gg',
        'GG'
    ], function(input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    }), // FORMATTING
    addFormatToken('Q', 0, 'Qo', 'quarter'), // ALIASES
    addUnitAlias('quarter', 'Q'), priorities.quarter = 7, // PARSING
    addRegexToken('Q', match1), addParseToken('Q', function(input, array) {
        array[1] = (toInt(input) - 1) * 3;
    }), // FORMATTING
    addFormatToken('D', [
        'DD',
        2
    ], 'Do', 'date'), // ALIASES
    addUnitAlias('date', 'D'), priorities.date = 9, // PARSING
    addRegexToken('D', match1to2), addRegexToken('DD', match1to2, match2), addRegexToken('Do', function(isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
    }), addParseToken([
        'D',
        'DD'
    ], 2), addParseToken('Do', function(input, array) {
        array[2] = toInt(input.match(match1to2)[0]);
    });
    // MOMENTS
    var getSetDayOfMonth = makeGetSet('Date', !0);
    // FORMATTING
    addFormatToken('DDD', [
        'DDDD',
        3
    ], 'DDDo', 'dayOfYear'), // ALIASES
    addUnitAlias('dayOfYear', 'DDD'), priorities.dayOfYear = 4, // PARSING
    addRegexToken('DDD', match1to3), addRegexToken('DDDD', match3), addParseToken([
        'DDD',
        'DDDD'
    ], function(input, array, config) {
        config._dayOfYear = toInt(input);
    }), // FORMATTING
    addFormatToken('m', [
        'mm',
        2
    ], 0, 'minute'), // ALIASES
    addUnitAlias('minute', 'm'), priorities.minute = 14, // PARSING
    addRegexToken('m', match1to2), addRegexToken('mm', match1to2, match2), addParseToken([
        'm',
        'mm'
    ], 4);
    // MOMENTS
    var getSetMinute = makeGetSet('Minutes', !1);
    // FORMATTING
    addFormatToken('s', [
        'ss',
        2
    ], 0, 'second'), // ALIASES
    addUnitAlias('second', 's'), priorities.second = 15, // PARSING
    addRegexToken('s', match1to2), addRegexToken('ss', match1to2, match2), addParseToken([
        's',
        'ss'
    ], 5);
    // MOMENTS
    var getSetSecond = makeGetSet('Seconds', !1);
    for(// FORMATTING
    addFormatToken('S', 0, 0, function() {
        return ~~(this.millisecond() / 100);
    }), addFormatToken(0, [
        'SS',
        2
    ], 0, function() {
        return ~~(this.millisecond() / 10);
    }), addFormatToken(0, [
        'SSS',
        3
    ], 0, 'millisecond'), addFormatToken(0, [
        'SSSS',
        4
    ], 0, function() {
        return 10 * this.millisecond();
    }), addFormatToken(0, [
        'SSSSS',
        5
    ], 0, function() {
        return 100 * this.millisecond();
    }), addFormatToken(0, [
        'SSSSSS',
        6
    ], 0, function() {
        return 1000 * this.millisecond();
    }), addFormatToken(0, [
        'SSSSSSS',
        7
    ], 0, function() {
        return 10000 * this.millisecond();
    }), addFormatToken(0, [
        'SSSSSSSS',
        8
    ], 0, function() {
        return 100000 * this.millisecond();
    }), addFormatToken(0, [
        'SSSSSSSSS',
        9
    ], 0, function() {
        return 1000000 * this.millisecond();
    }), // ALIASES
    addUnitAlias('millisecond', 'ms'), priorities.millisecond = 16, // PARSING
    addRegexToken('S', match1to3, match1), addRegexToken('SS', match1to3, match2), addRegexToken('SSS', match1to3, match3), token = 'SSSS'; token.length <= 9; token += 'S')addRegexToken(token, matchUnsigned);
    function parseMs(input, array) {
        array[6] = toInt(('0.' + input) * 1000);
    }
    for(token = 'S'; token.length <= 9; token += 'S')addParseToken(token, parseMs);
    getSetMillisecond = makeGetSet('Milliseconds', !1), // FORMATTING
    addFormatToken('z', 0, 0, 'zoneAbbr'), addFormatToken('zz', 0, 0, 'zoneName');
    var proto = Moment.prototype;
    function preParsePostFormat(string) {
        return string;
    }
    proto.add = add, proto.calendar = function(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (1 == arguments.length) {
            if (arguments[0]) {
                var input, arrayTest, dataTypeTest;
                (input = arguments[0], isMoment(input) || isDate(input) || isString(input) || isNumber(input) || (arrayTest = isArray(input), dataTypeTest = !1, arrayTest && (dataTypeTest = 0 === input.filter(function(item) {
                    return !isNumber(item) && isString(input);
                }).length), arrayTest && dataTypeTest) || function(input) {
                    var i, property, objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = !1, properties = [
                        'years',
                        'year',
                        'y',
                        'months',
                        'month',
                        'M',
                        'days',
                        'day',
                        'd',
                        'dates',
                        'date',
                        'D',
                        'hours',
                        'hour',
                        'h',
                        'minutes',
                        'minute',
                        'm',
                        'seconds',
                        'second',
                        's',
                        'milliseconds',
                        'millisecond',
                        'ms'
                    ];
                    for(i = 0; i < properties.length; i += 1)property = properties[i], propertyTest = propertyTest || hasOwnProp(input, property);
                    return objectTest && propertyTest;
                }(input) || null == input) ? (time = arguments[0], formats = void 0) : function(input) {
                    var i, property, objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = !1, properties = [
                        'sameDay',
                        'nextDay',
                        'lastDay',
                        'nextWeek',
                        'lastWeek',
                        'sameElse'
                    ];
                    for(i = 0; i < properties.length; i += 1)property = properties[i], propertyTest = propertyTest || hasOwnProp(input, property);
                    return objectTest && propertyTest;
                }(arguments[0]) && (formats = arguments[0], time = void 0);
            } else time = void 0, formats = void 0;
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(), sod = cloneWithOffset(now, this).startOf('day'), format = hooks.calendarFormat(this, sod) || 'sameElse', output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);
        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }, proto.clone = function() {
        return new Moment(this);
    }, proto.diff = function(input, units, asFloat) {
        var that, zoneDelta, output;
        if (!this.isValid() || !(that = cloneWithOffset(input, this)).isValid()) return NaN;
        switch(zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4, units = normalizeUnits(units)){
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }
        return asFloat ? output : absFloor(output);
    }, proto.endOf = function(units) {
        var time, startOfDate;
        if (void 0 === (units = normalizeUnits(units)) || 'millisecond' === units || !this.isValid()) return this;
        switch(startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate, units){
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf(), time += 3600000 - ((time + (this._isUTC ? 0 : 60000 * this.utcOffset())) % 3600000 + 3600000) % 3600000 - 1;
                break;
            case 'minute':
                time = this._d.valueOf(), time += 60000 - (time % 60000 + 60000) % 60000 - 1;
                break;
            case 'second':
                time = this._d.valueOf(), time += 1000 - (time % 1000 + 1000) % 1000 - 1;
        }
        return this._d.setTime(time), hooks.updateOffset(this, !0), this;
    }, proto.format = function(inputString) {
        inputString || (inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat);
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }, proto.from = function(time, withoutSuffix) {
        return this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid()) ? createDuration({
            to: this,
            from: time
        }).locale(this.locale()).humanize(!withoutSuffix) : this.localeData().invalidDate();
    }, proto.fromNow = function(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }, proto.to = function(time, withoutSuffix) {
        return this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid()) ? createDuration({
            from: this,
            to: time
        }).locale(this.locale()).humanize(!withoutSuffix) : this.localeData().invalidDate();
    }, proto.toNow = function(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }, proto.get = // MOMENTS
    function(units) {
        return isFunction(this[units = normalizeUnits(units)]) ? this[units]() : this;
    }, proto.invalidAt = function() {
        return getParsingFlags(this).overflow;
    }, proto.isAfter = function(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        return !!(this.isValid() && localInput.isValid()) && ('millisecond' === (units = normalizeUnits(units) || 'millisecond') ? this.valueOf() > localInput.valueOf() : localInput.valueOf() < this.clone().startOf(units).valueOf());
    }, proto.isBefore = function(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        return !!(this.isValid() && localInput.isValid()) && ('millisecond' === (units = normalizeUnits(units) || 'millisecond') ? this.valueOf() < localInput.valueOf() : this.clone().endOf(units).valueOf() < localInput.valueOf());
    }, proto.isBetween = function(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from), localTo = isMoment(to) ? to : createLocal(to);
        return !!(this.isValid() && localFrom.isValid() && localTo.isValid()) && ('(' === (inclusivity = inclusivity || '()')[0] ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (')' === inclusivity[1] ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }, proto.isSame = function(input, units) {
        var inputMs, localInput = isMoment(input) ? input : createLocal(input);
        return !!(this.isValid() && localInput.isValid()) && ('millisecond' === (units = normalizeUnits(units) || 'millisecond') ? this.valueOf() === localInput.valueOf() : (inputMs = localInput.valueOf(), this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf()));
    }, proto.isSameOrAfter = function(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }, proto.isSameOrBefore = function(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }, proto.isValid = function() {
        return isValid(this);
    }, proto.lang = lang, proto.locale = locale, proto.localeData = localeData, proto.max = prototypeMax, proto.min = prototypeMin, proto.parsingFlags = function() {
        return extend({}, getParsingFlags(this));
    }, proto.set = function(units, value) {
        if ('object' == typeof units) {
            var i, prioritized = function(unitsObj) {
                var u, units = [];
                for(u in unitsObj)hasOwnProp(unitsObj, u) && units.push({
                    unit: u,
                    priority: priorities[u]
                });
                return units.sort(function(a, b) {
                    return a.priority - b.priority;
                }), units;
            }(units = normalizeObjectUnits(units));
            for(i = 0; i < prioritized.length; i++)this[prioritized[i].unit](units[prioritized[i].unit]);
        } else if (isFunction(this[units = normalizeUnits(units)])) return this[units](value);
        return this;
    }, proto.startOf = function(units) {
        var time, startOfDate;
        if (void 0 === (units = normalizeUnits(units)) || 'millisecond' === units || !this.isValid()) return this;
        switch(startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate, units){
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf(), time -= ((time + (this._isUTC ? 0 : 60000 * this.utcOffset())) % 3600000 + 3600000) % 3600000;
                break;
            case 'minute':
                time = this._d.valueOf(), time -= (time % 60000 + 60000) % 60000;
                break;
            case 'second':
                time = this._d.valueOf(), time -= (time % 1000 + 1000) % 1000;
        }
        return this._d.setTime(time), hooks.updateOffset(this, !0), this;
    }, proto.subtract = subtract, proto.toArray = function() {
        return [
            this.year(),
            this.month(),
            this.date(),
            this.hour(),
            this.minute(),
            this.second(),
            this.millisecond()
        ];
    }, proto.toObject = function() {
        return {
            years: this.year(),
            months: this.month(),
            date: this.date(),
            hours: this.hours(),
            minutes: this.minutes(),
            seconds: this.seconds(),
            milliseconds: this.milliseconds()
        };
    }, proto.toDate = function() {
        return new Date(this.valueOf());
    }, proto.toISOString = function(keepOffset) {
        if (!this.isValid()) return null;
        var utc = !0 !== keepOffset, m = utc ? this.clone().utc() : this;
        return 0 > m.year() || m.year() > 9999 ? formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ') : isFunction(Date.prototype.toISOString) ? // native implementation is ~50x faster, use it when we can
        utc ? this.toDate().toISOString() : new Date(this.valueOf() + 60000 * this.utcOffset()).toISOString().replace('Z', formatMoment(m, 'Z')) : formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }, proto.inspect = /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */ function() {
        if (!this.isValid()) return 'moment.invalid(/* ' + this._i + ' */)';
        var prefix, year, datetime, suffix, func = 'moment', zone = '';
        return this.isLocal() || (func = 0 === this.utcOffset() ? 'moment.utc' : 'moment.parseZone', zone = 'Z'), prefix = '[' + func + '("]', year = 0 <= this.year() && 9999 >= this.year() ? 'YYYY' : 'YYYYYY', datetime = '-MM-DD[T]HH:mm:ss.SSS', suffix = zone + '[")]', this.format(prefix + year + datetime + suffix);
    }, 'undefined' != typeof Symbol && null != Symbol.for && (proto[Symbol.for('nodejs.util.inspect.custom')] = function() {
        return 'Moment<' + this.format() + '>';
    }), proto.toJSON = function() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }, proto.toString = function() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }, proto.unix = function() {
        return Math.floor(this.valueOf() / 1000);
    }, proto.valueOf = function() {
        return this._d.valueOf() - 60000 * (this._offset || 0);
    }, proto.creationData = function() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }, proto.eraName = function() {
        var i, l, val, eras = this.localeData().eras();
        for(i = 0, l = eras.length; i < l; ++i)if (// truncate time
        val = this.clone().startOf('day').valueOf(), eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) return eras[i].name;
        return '';
    }, proto.eraNarrow = function() {
        var i, l, val, eras = this.localeData().eras();
        for(i = 0, l = eras.length; i < l; ++i)if (// truncate time
        val = this.clone().startOf('day').valueOf(), eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) return eras[i].narrow;
        return '';
    }, proto.eraAbbr = function() {
        var i, l, val, eras = this.localeData().eras();
        for(i = 0, l = eras.length; i < l; ++i)if (// truncate time
        val = this.clone().startOf('day').valueOf(), eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) return eras[i].abbr;
        return '';
    }, proto.eraYear = function() {
        var i, l, dir, val, eras = this.localeData().eras();
        for(i = 0, l = eras.length; i < l; ++i)if (dir = eras[i].since <= eras[i].until ? 1 : -1, // truncate time
        val = this.clone().startOf('day').valueOf(), eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
        return this.year();
    }, proto.year = getSetYear, proto.isLeapYear = function() {
        return isLeapYear(this.year());
    }, proto.weekYear = // MOMENTS
    function(input) {
        return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }, proto.isoWeekYear = function(input) {
        return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }, proto.quarter = proto.quarters = // MOMENTS
    function(input) {
        return null == input ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }, proto.month = getSetMonth, proto.daysInMonth = function() {
        return daysInMonth(this.year(), this.month());
    }, proto.week = proto.weeks = // MOMENTS
    function(input) {
        var week = this.localeData().week(this);
        return null == input ? week : this.add((input - week) * 7, 'd');
    }, proto.isoWeek = proto.isoWeeks = function(input) {
        var week = weekOfYear(this, 1, 4).week;
        return null == input ? week : this.add((input - week) * 7, 'd');
    }, proto.weeksInYear = function() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }, proto.weeksInWeekYear = function() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }, proto.isoWeeksInYear = function() {
        return weeksInYear(this.year(), 1, 4);
    }, proto.isoWeeksInISOWeekYear = function() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }, proto.date = getSetDayOfMonth, proto.day = proto.days = // MOMENTS
    function(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        var input1, locale, day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null == input ? day : (input1 = input, locale = this.localeData(), input = 'string' != typeof input1 ? input1 : isNaN(input1) ? 'number' == typeof (input1 = locale.weekdaysParse(input1)) ? input1 : null : parseInt(input1, 10), this.add(input - day, 'd'));
    }, proto.weekday = function(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == input ? weekday : this.add(input - weekday, 'd');
    }, proto.isoWeekday = function(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        if (null == input) return this.day() || 7;
        var locale, weekday = (locale = this.localeData(), 'string' == typeof input ? locale.weekdaysParse(input) % 7 || 7 : isNaN(input) ? null : input);
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    }, proto.dayOfYear = // HELPERS
    // MOMENTS
    function(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return null == input ? dayOfYear : this.add(input - dayOfYear, 'd');
    }, proto.hour = proto.hours = getSetHour, proto.minute = proto.minutes = getSetMinute, proto.second = proto.seconds = getSetSecond, proto.millisecond = proto.milliseconds = getSetMillisecond, proto.utcOffset = // MOMENTS
    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function(input, keepLocalTime, keepMinutes) {
        var localAdjust, offset = this._offset || 0;
        if (!this.isValid()) return null != input ? this : NaN;
        if (null == input) return this._isUTC ? offset : getDateOffset(this);
        if ('string' == typeof input) {
            if (null === (input = offsetFromString(matchShortOffset, input))) return this;
        } else 16 > Math.abs(input) && !keepMinutes && (input *= 60);
        return !this._isUTC && keepLocalTime && (localAdjust = getDateOffset(this)), this._offset = input, this._isUTC = !0, null != localAdjust && this.add(localAdjust, 'm'), offset === input || (!keepLocalTime || this._changeInProgress ? addSubtract(this, createDuration(input - offset, 'm'), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, hooks.updateOffset(this, !0), this._changeInProgress = null)), this;
    }, proto.utc = function(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }, proto.local = function(keepLocalTime) {
        return this._isUTC && (this.utcOffset(0, keepLocalTime), this._isUTC = !1, keepLocalTime && this.subtract(getDateOffset(this), 'm')), this;
    }, proto.parseZone = function() {
        if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);
        else if ('string' == typeof this._i) {
            var tZone = offsetFromString(matchOffset, this._i);
            null != tZone ? this.utcOffset(tZone) : this.utcOffset(0, !0);
        }
        return this;
    }, proto.hasAlignedHourOffset = function(input) {
        return !!this.isValid() && (input = input ? createLocal(input).utcOffset() : 0, (this.utcOffset() - input) % 60 == 0);
    }, proto.isDST = function() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }, proto.isLocal = function() {
        return !!this.isValid() && !this._isUTC;
    }, proto.isUtcOffset = function() {
        return !!this.isValid() && this._isUTC;
    }, proto.isUtc = isUtc, proto.isUTC = isUtc, proto.zoneAbbr = // MOMENTS
    function() {
        return this._isUTC ? 'UTC' : '';
    }, proto.zoneName = function() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }, proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth), proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth), proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear), proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', function(input, keepLocalTime) {
        return null != input ? ('string' != typeof input && (input = -input), this.utcOffset(input, keepLocalTime), this) : -this.utcOffset();
    }), proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', function() {
        if (!isUndefined(this._isDSTShifted)) return this._isDSTShifted;
        var other, c = {};
        return copyConfig(c, this), (c = prepareConfig(c))._a ? (other = c._isUTC ? createUTC(c._a) : createLocal(c._a), this._isDSTShifted = this.isValid() && // compare two arrays, return the number of differences
        function(array1, array2, dontConvert) {
            var i, len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0;
            for(i = 0; i < len; i++)toInt(array1[i]) !== toInt(array2[i]) && diffs++;
            return diffs + lengthDiff;
        }(c._a, other.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
    });
    var proto$1 = Locale.prototype;
    function get$1(format, index, field, setter) {
        var locale = getLocale(), utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }
    function listMonthsImpl(format, index, field) {
        if (isNumber(format) && (index = format, format = void 0), format = format || '', null != index) return get$1(format, index, field, 'month');
        var i, out = [];
        for(i = 0; i < 12; i++)out[i] = get$1(format, i, field, 'month');
        return out;
    }
    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        'boolean' == typeof localeSorted || (index = format = localeSorted, localeSorted = !1), isNumber(format) && (index = format, format = void 0), format = format || '';
        var i, locale = getLocale(), shift = localeSorted ? locale._week.dow : 0, out = [];
        if (null != index) return get$1(format, (index + shift) % 7, field, 'day');
        for(i = 0; i < 7; i++)out[i] = get$1(format, (i + shift) % 7, field, 'day');
        return out;
    }
    proto$1.calendar = function(key, mom, now) {
        var output = this._calendar[key] || this._calendar.sameElse;
        return isFunction(output) ? output.call(mom, now) : output;
    }, proto$1.longDateFormat = function(key) {
        var format = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
        return format || !formatUpper ? format : (this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
            return 'MMMM' === tok || 'MM' === tok || 'DD' === tok || 'dddd' === tok ? tok.slice(1) : tok;
        }).join(''), this._longDateFormat[key]);
    }, proto$1.invalidDate = function() {
        return this._invalidDate;
    }, proto$1.ordinal = function(number) {
        return this._ordinal.replace('%d', number);
    }, proto$1.preparse = preParsePostFormat, proto$1.postformat = preParsePostFormat, proto$1.relativeTime = function(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }, proto$1.pastFuture = function(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }, proto$1.set = function(config) {
        var prop, i;
        for(i in config)hasOwnProp(config, i) && (isFunction(prop = config[i]) ? this[i] = prop : this['_' + i] = prop);
        this._config = config, // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
    }, proto$1.eras = function(m, format) {
        var i, l, date, eras = this._eras || getLocale('en')._eras;
        for(i = 0, l = eras.length; i < l; ++i)switch('string' == typeof eras[i].since && (// truncate time
        date = hooks(eras[i].since).startOf('day'), eras[i].since = date.valueOf()), typeof eras[i].until){
            case 'undefined':
                eras[i].until = Infinity;
                break;
            case 'string':
                // truncate time
                date = hooks(eras[i].until).startOf('day').valueOf(), eras[i].until = date.valueOf();
        }
        return eras;
    }, proto$1.erasParse = function(eraName, format, strict) {
        var i, l, name, abbr, narrow, eras = this.eras();
        for(i = 0, eraName = eraName.toUpperCase(), l = eras.length; i < l; ++i)if (name = eras[i].name.toUpperCase(), abbr = eras[i].abbr.toUpperCase(), narrow = eras[i].narrow.toUpperCase(), strict) switch(format){
            case 'N':
            case 'NN':
            case 'NNN':
                if (abbr === eraName) return eras[i];
                break;
            case 'NNNN':
                if (name === eraName) return eras[i];
                break;
            case 'NNNNN':
                if (narrow === eraName) return eras[i];
        }
        else if ([
            name,
            abbr,
            narrow
        ].indexOf(eraName) >= 0) return eras[i];
    }, proto$1.erasConvertYear = function(era, year) {
        var dir = era.since <= era.until ? 1 : -1;
        return void 0 === year ? hooks(era.since).year() : hooks(era.since).year() + (year - era.offset) * dir;
    }, proto$1.erasAbbrRegex = function(isStrict) {
        return hasOwnProp(this, '_erasAbbrRegex') || computeErasParse.call(this), isStrict ? this._erasAbbrRegex : this._erasRegex;
    }, proto$1.erasNameRegex = function(isStrict) {
        return hasOwnProp(this, '_erasNameRegex') || computeErasParse.call(this), isStrict ? this._erasNameRegex : this._erasRegex;
    }, proto$1.erasNarrowRegex = function(isStrict) {
        return hasOwnProp(this, '_erasNarrowRegex') || computeErasParse.call(this), isStrict ? this._erasNarrowRegex : this._erasRegex;
    }, proto$1.months = function(m, format) {
        return m ? isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()] : isArray(this._months) ? this._months : this._months.standalone;
    }, proto$1.monthsShort = function(m, format) {
        return m ? isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()] : isArray(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }, proto$1.monthsParse = function(monthName, format, strict) {
        var i, mom, regex;
        if (this._monthsParseExact) return handleStrictParse.call(this, monthName, format, strict);
        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for(this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), i = 0; i < 12; i++)// test the regex
        if (// make the regex if we don't have it already
        mom = createUTC([
            2000,
            i
        ]), strict && !this._longMonthsParse[i] && (this._longMonthsParse[i] = RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i'), this._shortMonthsParse[i] = RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i')), strict || this._monthsParse[i] || (regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, ''), this._monthsParse[i] = RegExp(regex.replace('.', ''), 'i')), strict && 'MMMM' === format && this._longMonthsParse[i].test(monthName) || strict && 'MMM' === format && this._shortMonthsParse[i].test(monthName) || !strict && this._monthsParse[i].test(monthName)) return i;
    }, proto$1.monthsRegex = function(isStrict) {
        return this._monthsParseExact ? (hasOwnProp(this, '_monthsRegex') || computeMonthsParse.call(this), isStrict) ? this._monthsStrictRegex : this._monthsRegex : (hasOwnProp(this, '_monthsRegex') || (this._monthsRegex = matchWord), this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex);
    }, proto$1.monthsShortRegex = function(isStrict) {
        return this._monthsParseExact ? (hasOwnProp(this, '_monthsRegex') || computeMonthsParse.call(this), isStrict) ? this._monthsShortStrictRegex : this._monthsShortRegex : (hasOwnProp(this, '_monthsShortRegex') || (this._monthsShortRegex = matchWord), this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }, proto$1.week = // HELPERS
    // LOCALES
    function(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }, proto$1.firstDayOfYear = function() {
        return this._week.doy;
    }, proto$1.firstDayOfWeek = function() {
        return this._week.dow;
    }, proto$1.weekdays = function(m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && !0 !== m && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'];
        return !0 === m ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
    }, proto$1.weekdaysMin = function(m) {
        return !0 === m ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }, proto$1.weekdaysShort = function(m) {
        return !0 === m ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }, proto$1.weekdaysParse = function(weekdayName, format, strict) {
        var i, mom, regex;
        if (this._weekdaysParseExact) return handleStrictParse$1.call(this, weekdayName, format, strict);
        for(this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), i = 0; i < 7; i++){
            // test the regex
            if (// make the regex if we don't have it already
            mom = createUTC([
                2000,
                1
            ]).day(i), strict && !this._fullWeekdaysParse[i] && (this._fullWeekdaysParse[i] = RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i'), this._shortWeekdaysParse[i] = RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i'), this._minWeekdaysParse[i] = RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i')), this._weekdaysParse[i] || (regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, ''), this._weekdaysParse[i] = RegExp(regex.replace('.', ''), 'i')), strict && 'dddd' === format && this._fullWeekdaysParse[i].test(weekdayName) || strict && 'ddd' === format && this._shortWeekdaysParse[i].test(weekdayName)) return i;
            if (strict && 'dd' === format && this._minWeekdaysParse[i].test(weekdayName)) return i;
            if (!strict && this._weekdaysParse[i].test(weekdayName)) return i;
        }
    }, proto$1.weekdaysRegex = function(isStrict) {
        return this._weekdaysParseExact ? (hasOwnProp(this, '_weekdaysRegex') || computeWeekdaysParse.call(this), isStrict) ? this._weekdaysStrictRegex : this._weekdaysRegex : (hasOwnProp(this, '_weekdaysRegex') || (this._weekdaysRegex = matchWord), this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }, proto$1.weekdaysShortRegex = function(isStrict) {
        return this._weekdaysParseExact ? (hasOwnProp(this, '_weekdaysRegex') || computeWeekdaysParse.call(this), isStrict) ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex : (hasOwnProp(this, '_weekdaysShortRegex') || (this._weekdaysShortRegex = matchWord), this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }, proto$1.weekdaysMinRegex = function(isStrict) {
        return this._weekdaysParseExact ? (hasOwnProp(this, '_weekdaysRegex') || computeWeekdaysParse.call(this), isStrict) ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex : (hasOwnProp(this, '_weekdaysMinRegex') || (this._weekdaysMinRegex = matchWord), this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
    }, proto$1.isPM = // LOCALES
    function(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return 'p' === (input + '').toLowerCase().charAt(0);
    }, proto$1.meridiem = function(hours, minutes, isLower) {
        return hours > 11 ? isLower ? 'pm' : 'PM' : isLower ? 'am' : 'AM';
    }, getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD'
            },
            {
                since: '0000-12-31',
                until: -1 / 0,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC'
            }
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
            var b = number % 10, output = 1 === toInt(number % 100 / 10) ? 'th' : 1 === b ? 'st' : 2 === b ? 'nd' : 3 === b ? 'rd' : 'th';
            return number + output;
        }
    }), // Side effect imports
    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale), hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);
    var mathAbs = Math.abs;
    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);
        return duration._milliseconds += direction * other._milliseconds, duration._days += direction * other._days, duration._months += direction * other._months, duration._bubble();
    }
    function absCeil(number) {
        return number < 0 ? Math.floor(number) : Math.ceil(number);
    }
    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return 4800 * days / 146097;
    }
    function monthsToDays(months) {
        // the reverse of daysToMonths
        return 146097 * months / 4800;
    }
    function makeAs(alias) {
        return function() {
            return this.as(alias);
        };
    }
    var asMilliseconds = makeAs('ms'), asSeconds = makeAs('s'), asMinutes = makeAs('m'), asHours = makeAs('h'), asDays = makeAs('d'), asWeeks = makeAs('w'), asMonths = makeAs('M'), asQuarters = makeAs('Q'), asYears = makeAs('y');
    function makeGetter(name) {
        return function() {
            return this.isValid() ? this._data[name] : NaN;
        };
    }
    var milliseconds = makeGetter('milliseconds'), seconds = makeGetter('seconds'), minutes = makeGetter('minutes'), hours = makeGetter('hours'), days = makeGetter('days'), months = makeGetter('months'), years = makeGetter('years'), round = Math.round, thresholds = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
    };
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    var abs$1 = Math.abs;
    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }
    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) return this.localeData().invalidDate();
        var minutes, hours, years, s, totalSign, ymSign, daysSign, hmsSign, seconds = abs$1(this._milliseconds) / 1000, days = abs$1(this._days), months = abs$1(this._months), total = this.asSeconds();
        return total ? (// 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60), hours = absFloor(minutes / 60), seconds %= 60, minutes %= 60, // 12 months -> 1 year
        years = absFloor(months / 12), months %= 12, // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '', totalSign = total < 0 ? '-' : '', ymSign = sign(this._months) !== sign(total) ? '-' : '', daysSign = sign(this._days) !== sign(total) ? '-' : '', hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '', totalSign + 'P' + (years ? ymSign + years + 'Y' : '') + (months ? ymSign + months + 'M' : '') + (days ? daysSign + days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hmsSign + hours + 'H' : '') + (minutes ? hmsSign + minutes + 'M' : '') + (seconds ? hmsSign + s + 'S' : '')) : 'P0D';
    }
    var proto$2 = Duration.prototype;
    return proto$2.isValid = function() {
        return this._isValid;
    }, proto$2.abs = function() {
        var data = this._data;
        return this._milliseconds = mathAbs(this._milliseconds), this._days = mathAbs(this._days), this._months = mathAbs(this._months), data.milliseconds = mathAbs(data.milliseconds), data.seconds = mathAbs(data.seconds), data.minutes = mathAbs(data.minutes), data.hours = mathAbs(data.hours), data.months = mathAbs(data.months), data.years = mathAbs(data.years), this;
    }, proto$2.add = // supports only 2.0-style add(1, 's') or add(duration)
    function(input, value) {
        return addSubtract$1(this, input, value, 1);
    }, proto$2.subtract = // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function(input, value) {
        return addSubtract$1(this, input, value, -1);
    }, proto$2.as = function(units) {
        if (!this.isValid()) return NaN;
        var days, months, milliseconds = this._milliseconds;
        if ('month' === (units = normalizeUnits(units)) || 'quarter' === units || 'year' === units) switch(days = this._days + milliseconds / 864e5, months = this._months + daysToMonths(days), units){
            case 'month':
                return months;
            case 'quarter':
                return months / 3;
            case 'year':
                return months / 12;
        }
        else switch(// handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months)), units){
            case 'week':
                return days / 7 + milliseconds / 6048e5;
            case 'day':
                return days + milliseconds / 864e5;
            case 'hour':
                return 24 * days + milliseconds / 36e5;
            case 'minute':
                return 1440 * days + milliseconds / 6e4;
            case 'second':
                return 86400 * days + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond':
                return Math.floor(864e5 * days) + milliseconds;
            default:
                throw Error('Unknown unit ' + units);
        }
    }, proto$2.asMilliseconds = asMilliseconds, proto$2.asSeconds = asSeconds, proto$2.asMinutes = asMinutes, proto$2.asHours = asHours, proto$2.asDays = asDays, proto$2.asWeeks = asWeeks, proto$2.asMonths = asMonths, proto$2.asQuarters = asQuarters, proto$2.asYears = asYears, proto$2.valueOf = // TODO: Use this.as('ms')?
    function() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * toInt(this._months / 12) : NaN;
    }, proto$2._bubble = function() {
        var seconds, minutes, hours, years, monthsFromDays, milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data;
        return milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0 || (milliseconds += 864e5 * absCeil(monthsToDays(months) + days), days = 0, months = 0), // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000, seconds = absFloor(milliseconds / 1000), data.seconds = seconds % 60, minutes = absFloor(seconds / 60), data.minutes = minutes % 60, hours = absFloor(minutes / 60), data.hours = hours % 24, days += absFloor(hours / 24), months += // convert days to months
        monthsFromDays = absFloor(daysToMonths(days)), days -= absCeil(monthsToDays(monthsFromDays)), // 12 months -> 1 year
        years = absFloor(months / 12), months %= 12, data.days = days, data.months = months, data.years = years, this;
    }, proto$2.clone = function() {
        return createDuration(this);
    }, proto$2.get = function(units) {
        return units = normalizeUnits(units), this.isValid() ? this[units + 's']() : NaN;
    }, proto$2.milliseconds = milliseconds, proto$2.seconds = seconds, proto$2.minutes = minutes, proto$2.hours = hours, proto$2.days = days, proto$2.weeks = function() {
        return absFloor(this.days() / 7);
    }, proto$2.months = months, proto$2.years = years, proto$2.humanize = function(argWithSuffix, argThresholds) {
        if (!this.isValid()) return this.localeData().invalidDate();
        var withoutSuffix, thresholds1, duration, seconds, minutes, hours, days, months, weeks, years, a, locale, output, withSuffix = !1, th = thresholds;
        return 'object' == typeof argWithSuffix && (argThresholds = argWithSuffix, argWithSuffix = !1), 'boolean' == typeof argWithSuffix && (withSuffix = argWithSuffix), 'object' == typeof argThresholds && (th = Object.assign({}, thresholds, argThresholds), null != argThresholds.s && null == argThresholds.ss && (th.ss = argThresholds.s - 1)), locale = this.localeData(), withoutSuffix = !withSuffix, thresholds1 = th, duration = createDuration(this).abs(), seconds = round(duration.as('s')), minutes = round(duration.as('m')), hours = round(duration.as('h')), days = round(duration.as('d')), months = round(duration.as('M')), weeks = round(duration.as('w')), years = round(duration.as('y')), a = seconds <= thresholds1.ss && [
            's',
            seconds
        ] || seconds < thresholds1.s && [
            'ss',
            seconds
        ] || minutes <= 1 && [
            'm'
        ] || minutes < thresholds1.m && [
            'mm',
            minutes
        ] || hours <= 1 && [
            'h'
        ] || hours < thresholds1.h && [
            'hh',
            hours
        ] || days <= 1 && [
            'd'
        ] || days < thresholds1.d && [
            'dd',
            days
        ], null != thresholds1.w && (a = a || weeks <= 1 && [
            'w'
        ] || weeks < thresholds1.w && [
            'ww',
            weeks
        ]), (a = a || months <= 1 && [
            'M'
        ] || months < thresholds1.M && [
            'MM',
            months
        ] || years <= 1 && [
            'y'
        ] || [
            'yy',
            years
        ])[2] = withoutSuffix, a[3] = +this > 0, a[4] = locale, output = substituteTimeAgo.apply(null, a), withSuffix && (output = locale.pastFuture(+this, output)), locale.postformat(output);
    }, proto$2.toISOString = toISOString$1, proto$2.toString = toISOString$1, proto$2.toJSON = toISOString$1, proto$2.locale = locale, proto$2.localeData = localeData, proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1), proto$2.lang = lang, // FORMATTING
    addFormatToken('X', 0, 0, 'unix'), addFormatToken('x', 0, 0, 'valueOf'), // PARSING
    addRegexToken('x', matchSigned), addRegexToken('X', /[+-]?\d+(\.\d{1,3})?/), addParseToken('X', function(input, array, config) {
        config._d = new Date(1000 * parseFloat(input));
    }), addParseToken('x', function(input, array, config) {
        config._d = new Date(toInt(input));
    }), //! moment.js
    hooks.version = '2.29.1', hookCallback = createLocal, hooks.fn = proto, hooks.min = // TODO: Use [].sort instead?
    function() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isBefore', args);
    }, hooks.max = function() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isAfter', args);
    }, hooks.now = function() {
        return Date.now ? Date.now() : +new Date();
    }, hooks.utc = createUTC, hooks.unix = function(input) {
        return createLocal(1000 * input);
    }, hooks.months = function(format, index) {
        return listMonthsImpl(format, index, 'months');
    }, hooks.isDate = isDate, hooks.locale = getSetGlobalLocale, hooks.invalid = createInvalid, hooks.duration = createDuration, hooks.isMoment = isMoment, hooks.weekdays = function(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }, hooks.parseZone = function() {
        return createLocal.apply(null, arguments).parseZone();
    }, hooks.localeData = getLocale, hooks.isDuration = isDuration, hooks.monthsShort = function(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }, hooks.weekdaysMin = function(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }, hooks.defineLocale = defineLocale, hooks.updateLocale = function(name, config) {
        if (null != config) {
            var locale, tmpLocale, parentConfig = baseConfig;
            null != locales[name] && null != locales[name].parentLocale ? // Update existing child locale in-place to avoid memory-leaks
            locales[name].set(mergeConfigs(locales[name]._config, config)) : (null != // MERGE
            (tmpLocale = loadLocale(name)) && (parentConfig = tmpLocale._config), config = mergeConfigs(parentConfig, config), null == tmpLocale && // updateLocale is called for creating a new locale
            // Set abbr so it will have a name (getters return
            // undefined otherwise).
            (config.abbr = name), (locale = new Locale(config)).parentLocale = locales[name], locales[name] = locale), // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else // pass null for config to unupdate, useful for tests
        null != locales[name] && (null != locales[name].parentLocale ? (locales[name] = locales[name].parentLocale, name === getSetGlobalLocale() && getSetGlobalLocale(name)) : null != locales[name] && delete locales[name]);
        return locales[name];
    }, hooks.locales = function() {
        return keys(locales);
    }, hooks.weekdaysShort = function(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }, hooks.normalizeUnits = normalizeUnits, hooks.relativeTimeRounding = // This function allows you to set the rounding function for relative time strings
    function(roundingFunction) {
        return void 0 === roundingFunction ? round : 'function' == typeof roundingFunction && (round = roundingFunction, !0);
    }, hooks.relativeTimeThreshold = // This function allows you to set a threshold for relative time strings
    function(threshold, limit) {
        return void 0 !== thresholds[threshold] && (void 0 === limit ? thresholds[threshold] : (thresholds[threshold] = limit, 's' === threshold && (thresholds.ss = limit - 1), !0));
    }, hooks.calendarFormat = function(myMoment, now) {
        var diff = myMoment.diff(now, 'days', !0);
        return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
    }, hooks.prototype = proto, // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',
        DATE: 'YYYY-MM-DD',
        TIME: 'HH:mm',
        TIME_SECONDS: 'HH:mm:ss',
        TIME_MS: 'HH:mm:ss.SSS',
        WEEK: 'GGGG-[W]WW',
        MONTH: 'YYYY-MM'
    }, hooks;
});
