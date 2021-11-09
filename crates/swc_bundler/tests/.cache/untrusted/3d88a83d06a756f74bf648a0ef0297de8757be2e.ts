// Loaded from https://unpkg.com/luxon@1.25.0/src/zones/localZone.js


import { formatOffset, parseZoneInfo, hasIntl } from "../impl/util.js";
import Zone from "../zone.js";

let singleton = null;

/**
 * Represents the local zone for this Javascript environment.
 * @implements {Zone}
 */
export default class LocalZone extends Zone {
  /**
   * Get a singleton instance of the local zone
   * @return {LocalZone}
   */
  static get instance() {
    if (singleton === null) {
      singleton = new LocalZone();
    }
    return singleton;
  }

  /** @override **/
  get type() {
    return "local";
  }

  /** @override **/
  get name() {
    if (hasIntl()) {
      return new Intl.DateTimeFormat().resolvedOptions().timeZone;
    } else return "local";
  }

  /** @override **/
  get universal() {
    return false;
  }

  /** @override **/
  offsetName(ts, { format, locale }) {
    return parseZoneInfo(ts, format, locale);
  }

  /** @override **/
  formatOffset(ts, format) {
    return formatOffset(this.offset(ts), format);
  }

  /** @override **/
  offset(ts) {
    return -new Date(ts).getTimezoneOffset();
  }

  /** @override **/
  equals(otherZone) {
    return otherZone.type === "local";
  }

  /** @override **/
  get isValid() {
    return true;
  }
}
