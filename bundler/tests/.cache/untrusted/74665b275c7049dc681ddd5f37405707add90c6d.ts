// Loaded from https://unpkg.com/luxon@1.25.0/src/impl/tokenParser.js


import { parseMillis, isUndefined, untruncateYear, signedOffset, hasOwnProperty } from "./util.js";
import Formatter from "./formatter.js";
import FixedOffsetZone from "../zones/fixedOffsetZone.js";
import IANAZone from "../zones/IANAZone.js";
import DateTime from "../datetime.js";
import { digitRegex, parseDigits } from "./digits.js";
import { ConflictingSpecificationError } from "../errors.js";

const MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";

function intUnit(regex, post = i => i) {
  return { regex, deser: ([s]) => post(parseDigits(s)) };
}

const NBSP = String.fromCharCode(160);
const spaceOrNBSP = `( |${NBSP})`;
const spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");

function fixListRegex(s) {
  // make dots optional and also make them literal
  // make space and non breakable space characters interchangeable
  return s.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
}

function stripInsensitivities(s) {
  return s
    .replace(/\./g, "") // ignore dots that were made optional
    .replace(spaceOrNBSPRegExp, " ") // interchange space and nbsp
    .toLowerCase();
}

function oneOf(strings, startIndex) {
  if (strings === null) {
    return null;
  } else {
    return {
      regex: RegExp(strings.map(fixListRegex).join("|")),
      deser: ([s]) =>
        strings.findIndex(i => stripInsensitivities(s) === stripInsensitivities(i)) + startIndex
    };
  }
}

function offset(regex, groups) {
  return { regex, deser: ([, h, m]) => signedOffset(h, m), groups };
}

function simple(regex) {
  return { regex, deser: ([s]) => s };
}

function escapeToken(value) {
  // eslint-disable-next-line no-useless-escape
  return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

function unitForToken(token, loc) {
  const one = digitRegex(loc),
    two = digitRegex(loc, "{2}"),
    three = digitRegex(loc, "{3}"),
    four = digitRegex(loc, "{4}"),
    six = digitRegex(loc, "{6}"),
    oneOrTwo = digitRegex(loc, "{1,2}"),
    oneToThree = digitRegex(loc, "{1,3}"),
    oneToSix = digitRegex(loc, "{1,6}"),
    oneToNine = digitRegex(loc, "{1,9}"),
    twoToFour = digitRegex(loc, "{2,4}"),
    fourToSix = digitRegex(loc, "{4,6}"),
    literal = t => ({ regex: RegExp(escapeToken(t.val)), deser: ([s]) => s, literal: true }),
    unitate = t => {
      if (token.literal) {
        return literal(t);
      }
      switch (t.val) {
        // era
        case "G":
          return oneOf(loc.eras("short", false), 0);
        case "GG":
          return oneOf(loc.eras("long", false), 0);
        // years
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
        // months
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
        // dates
        case "d":
          return intUnit(oneOrTwo);
        case "dd":
          return intUnit(two);
        // ordinals
        case "o":
          return intUnit(oneToThree);
        case "ooo":
          return intUnit(three);
        // time
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
        // meridiem
        case "a":
          return oneOf(loc.meridiems(), 0);
        // weekYear (k)
        case "kkkk":
          return intUnit(four);
        case "kk":
          return intUnit(twoToFour, untruncateYear);
        // weekNumber (W)
        case "W":
          return intUnit(oneOrTwo);
        case "WW":
          return intUnit(two);
        // weekdays
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
        // offset/zone
        case "Z":
        case "ZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(?::(${two.source}))?`), 2);
        case "ZZZ":
          return offset(new RegExp(`([+-]${oneOrTwo.source})(${two.source})?`), 2);
        // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
        // because we don't have any way to figure out what they are
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
  const { type, value } = part;

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
  const re = units.map(u => u.regex).reduce((f, r) => `${f}(${r.source})`, "");
  return [`^${re}$`, units];
}

function match(input, regex, handlers) {
  const matches = input.match(regex);

  if (matches) {
    const all = {};
    let matchIndex = 1;
    for (const i in handlers) {
      if (hasOwnProperty(handlers, i)) {
        const h = handlers[i],
          groups = h.groups ? h.groups + 1 : 1;
        if (!h.literal && h.token) {
          all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
        }
        matchIndex += groups;
      }
    }
    return [matches, all];
  } else {
    return [matches, {}];
  }
}

function dateTimeFromMatches(matches) {
  const toField = token => {
    switch (token) {
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

  const vals = Object.keys(matches).reduce((r, k) => {
    const f = toField(k);
    if (f) {
      r[f] = matches[k];
    }

    return r;
  }, {});

  return [vals, zone];
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

  const tokens = parts.map(p => tokenForPart(p, locale, formatOpts));

  if (tokens.includes(undefined)) {
    return token;
  }

  return tokens;
}

function expandMacroTokens(tokens, locale) {
  return Array.prototype.concat(...tokens.map(t => maybeExpandMacroToken(t, locale)));
}

/**
 * @private
 */

export function explainFromTokens(locale, input, format) {
  const tokens = expandMacroTokens(Formatter.parseFormat(format), locale),
    units = tokens.map(t => unitForToken(t, locale)),
    disqualifyingUnit = units.find(t => t.invalidReason);

  if (disqualifyingUnit) {
    return { input, tokens, invalidReason: disqualifyingUnit.invalidReason };
  } else {
    const [regexString, handlers] = buildRegex(units),
      regex = RegExp(regexString, "i"),
      [rawMatches, matches] = match(input, regex, handlers),
      [result, zone] = matches ? dateTimeFromMatches(matches) : [null, null];
    if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
      throw new ConflictingSpecificationError(
        "Can't include meridiem when specifying 24-hour format"
      );
    }
    return { input, tokens, regex, rawMatches, matches, result, zone };
  }
}

export function parseFromTokens(locale, input, format) {
  const { result, zone, invalidReason } = explainFromTokens(locale, input, format);
  return [result, zone, invalidReason];
}
