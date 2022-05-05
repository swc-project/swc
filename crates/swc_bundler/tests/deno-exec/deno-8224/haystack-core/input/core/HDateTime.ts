/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { Kind } from "./Kind";
import {
    HVal,
    NOT_SUPPORTED_IN_FILTER_MSG,
    CANNOT_CHANGE_READONLY_VALUE,
    valueInspect,
    valueIsKind,
    valueMatches,
} from "./HVal";
import { HaysonDateTime } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { HDate } from "./HDate";
import { HTime } from "./HTime";
import { EvalContext } from "../filter/EvalContext";

export interface PartialHaysonDateTime {
    _kind?: Kind;
    val: string;
    tz?: string;
}

/** Accepted types for making a `HDateTime` from */
type DateTimeBaseType = string | Date | HaysonDateTime | HDateTime;

/**
 * Prefixes for IANA timezone names.
 */
const TIMEZONE_PREFIXES = [
    "Africa",
    "America",
    "Asia",
    "Atlantic",
    "Australia",
    "Brazil",
    "Canada",
    "Chile",
    "Etc",
    "Europe",
    "Indian",
    "Mexico",
    "Pacific",
    "US",
];

/**
 * The default method for checking whether a timezone is valid or not.
 *
 * This implementation attempts to use the environment's Intl API. This may
 * not work in all environments (Deno) but this is the best attempt at something generic.
 *
 * This approach was discovered after examining the source code for Luxon.
 *
 * @param timezone The timezone.
 * @returns True if the timezone is supported.
 */
export function defaultIsValidTimeZone(timezone: string): boolean {
    try {
        new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Haystack date time.
 */
export class HDateTime implements HVal {
    /**
     * An internal cached date string value in an ISO 8601 format.
     */
    readonly #iso: string;

    /**
     * Internal implementation.
     */
    readonly #value: string;

    /**
     * Internal timezone.
     */
    readonly #timezone: string;

    /**
     * Constructs a new haystack date time.
     *
     * @param value The date time as a string, a JS Date or Hayson date object.
     */
    private constructor(value: string | Date | HaysonDateTime) {
        let val = "";
        let tz = "";

        if (value) {
            if (typeof value === "string") {
                val = value;
            } else if (value instanceof Date) {
                val = (value as Date).toISOString();
            } else {
                const obj = value as HaysonDateTime;
                val = obj.val;

                if (obj.tz) {
                    tz = obj.tz;
                }
            }
        }

        if (!val) {
            throw new Error("Invalid date");
        }

        // Parse the ISO formatted string, the offset and any timezone.
        const result =
            /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.]\d+)?)(Z|(?:[-+]\d{2}:\d{2}))(?: (.+))?$/.exec(
                val
            ) ?? [];

        let [, , offset, timezone] = result;
        const [, dateTime] = result;

        if (!dateTime || !offset) {
            throw new Error("Invalid date format");
        }

        if (tz) {
            timezone = tz;
        }

        if (!timezone) {
            // Calculate the GMT offset if there is no timezone specified.
            timezone = HDateTime.fromGmtOffset(offset);

            if (timezone === "UTC") {
                offset = "Z";
            }
        }

        this.#iso = `${dateTime}${offset}`;
        this.#value = `${dateTime}${offset}${
            offset === "Z" ? "" : ` ${timezone}`
        }`;
        this.#timezone = timezone || "UTC";
    }

    /**
     * Calculate the GMT offset to use as a fallback timezone.
     *
     * @param offset The string encoded offset (-/+HH:MM) or Z.
     * @returns The calculated GMT offset.
     */
    private static fromGmtOffset(offset: string): string {
        if (offset === "Z") {
            return "UTC";
        }

        const negative = offset[0] === "-";
        const hours = Number(offset.substring(1, 3));

        return hours ? `GMT${negative ? "+" : "-"}${hours}` : "UTC";
    }

    /**
     * Factory method for a haystack date time.
     *
     * @param value The date time as a string, a JS Date or Hayson date object.
     * @returns A haystack date time.
     */
    public static make(value: DateTimeBaseType): HDateTime {
        if (valueIsKind<HDateTime>(value, Kind.DateTime)) {
            return value;
        } else {
            return Object.freeze(
                new HDateTime(value as string | Date | HaysonDateTime)
            ) as HDateTime;
        }
    }

    /**
     * @returns The date time value.
     */
    public get value(): string {
        return this.#value;
    }

    public set value(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The date time in an ISO 8601 format.
     */
    public get iso(): string {
        return this.#iso;
    }

    /**
     * @returns The timezone.
     */
    public get timezone(): string {
        return this.#timezone;
    }

    /**
     * @returns The date time object as a JavaScript date.
     */
    public get date(): Date {
        return new Date(this.iso);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.DateTime;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HDateTime>(this, kind);
    }

    /**
     * Returns true if the haystack filter matches the value.
     *
     * @param filter The filter to test.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the filter matches ok.
     */
    public matches(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        return valueMatches(this, filter, cx);
    }

    /**
     * Dump the value to the local console output.
     *
     * @param message An optional message to display before the value.
     * @returns The value instance.
     */
    public inspect(message?: string): this {
        return valueInspect(this, message);
    }

    /**
     * @returns Now as a date time object.
     */
    public static now(): HDateTime {
        return HDateTime.make(new Date());
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return (
            this.date.toLocaleString() +
            (this.timezone ? ` ${this.timezone}` : "")
        );
    }

    /**
     * @returns The encoded date time value.
     */
    public valueOf(): string {
        return this.value;
    }

    /**
     * Encodes to an encoding zinc value.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return this.value;
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        return (
            valueIsKind<HDateTime>(value, Kind.DateTime) &&
            value.value === this.value
        );
    }

    /**
     * Compares two date times.
     *
     * @param value The value value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HDateTime>(value, Kind.DateTime)) {
            return -1;
        }

        // Always compare the ISO 8601 date time values as this naturally
        // can be sorted as strings.
        if (this.iso < value.iso) {
            return -1;
        }
        if (this.iso === value.iso) {
            return 0;
        }
        return 1;
    }

    /**
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * A dict isn't supported in filter so throw an error.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        throw new Error(NOT_SUPPORTED_IN_FILTER_MSG);
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonDateTime {
        const json: HaysonDateTime = {
            _kind: this.getKind(),
            val: this.iso,
        };

        const tz = this.timezone;

        if (tz !== "UTC") {
            json.tz = tz;
        }

        return json;
    }

    /**
     * @returns An Axon encoded string of the value.
     */
    public toAxon(): string {
        const date = this.date;
        return `dateTime(${HDate.make(date).toAxon()},${HTime.make(
            date
        ).toAxon()})`;
    }

    /**
     * @returns Returns the value instance.
     */
    public newCopy(): HDateTime {
        return this;
    }

    /**
     * @returns The value as a grid.
     */
    public toGrid(): HGrid {
        return HGrid.make(this);
    }

    /**
     * @returns The value as a list.
     */
    public toList(): HList<HDateTime> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }

    /**
     * Return the full IANA timezone name or an empty string if it can't be found.
     *
     * @param isValidTimeZone An optional callback invoked to see if the timezone is valid.
     * @returns The IANA timezone name or an empty string if the timezone name isn't valid.
     */
    public getIANATimeZone(
        isValidTimeZone: (timezone: string) => boolean = defaultIsValidTimeZone
    ): string {
        return HDateTime.getIANATimeZone(this.#timezone, isValidTimeZone);
    }

    /**
     * Return the full IANA timezone name or an empty string if it can't be found.
     *
     * The timezone name can be a full existing timezone or an alias.
     *
     * Since a vanilla JavaScript environment doesn't have support for querying the IANA database,
     * a callback function needs to be passed in to query the local database implementation.
     *
     * Here's an example that uses [Luxon](https://moment.github.io/luxon/index.html)...
     * ```typescript
     * import { DateTime } from 'luxon'
     * ...
     * const isValidTimeZone = (timezone: string): boolean =>
     *   !!DateTime.now().setZone(timezone).isValid
     *
     * const tz = getIANATimeZone('New_York', isValidTimeZone) // Returns 'America/New_York'.
     * ...
     * ```
     *
     * Here's an example that uses [Moment with timezones](https://momentjs.com/timezone/docs/)...
     * ```typescript
     * import * as moment from 'moment-timezone'
     * ...
     * const isValidTimeZone = (timezone: string): boolean =>
     *   !!moment.tz.zone(timezone)
     *
     * const tz = getIANATimeZone('New_York', isValidTimeZone) // Returns 'America/New_York'.
     * ```
     *
     * @see defaultIsValidTimeZone
     * @link [IANA timezone database](https://www.iana.org/time-zones)
     * @link [Fantom's DateTime with alias explanation](https://fantom.org/doc/docLang/DateTime)
     *
     * @param timezone A full timezone name or alias.
     * @param isValidTimeZone An optional callback invoked to see if the timezone is valid.
     * @returns The IANA timezone name or an empty string if the timezone name isn't valid.
     */
    public static getIANATimeZone(
        timezone: string,
        isValidTimeZone: (timezone: string) => boolean = defaultIsValidTimeZone
    ): string {
        if (isValidTimeZone(timezone)) {
            return timezone;
        }

        for (const prefix of TIMEZONE_PREFIXES) {
            const tz = `${prefix}/${timezone}`;
            if (isValidTimeZone(tz)) {
                return tz;
            }
        }

        return "";
    }
}
