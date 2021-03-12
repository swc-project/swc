// Loaded from https://unpkg.com/luxon@1.25.0/src/impl/zoneUtil.js


/**
 * @private
 */

import Zone from "../zone.js";
import IANAZone from "../zones/IANAZone.js";
import FixedOffsetZone from "../zones/fixedOffsetZone.js";
import InvalidZone from "../zones/invalidZone.js";

import { isUndefined, isString, isNumber } from "./util.js";

export function normalizeZone(input, defaultZone) {
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
      // handle Etc/GMT-4, which V8 chokes on
      return FixedOffsetZone.instance(offset);
    } else if (IANAZone.isValidSpecifier(lowered)) return IANAZone.create(input);
    else return FixedOffsetZone.parseSpecifier(lowered) || new InvalidZone(input);
  } else if (isNumber(input)) {
    return FixedOffsetZone.instance(input);
  } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
    // This is dumb, but the instanceof check above doesn't seem to really work
    // so we're duck checking it
    return input;
  } else {
    return new InvalidZone(input);
  }
}
