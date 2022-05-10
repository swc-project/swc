/*
 * Copyright (c) 2021, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off" */

import { HDateTime } from "./HDateTime";
import { HDate } from "./HDate";
import { HStr } from "./HStr";
import { ZincReader } from "./ZincReader";
import { valueIsKind } from "./HVal";
import { Kind } from "./Kind";
import { HaysonDate, HaysonDateTime } from "./hayson";

/**
 * Relative span mode.
 */
export enum SpanMode {
    today = "today",
    yesterday = "yesterday",
    thisWeek = "thisWeek",
    lastWeek = "lastWeek",
    thisMonth = "thisMonth",
    lastMonth = "lastMonth",
    thisQuarter = "thisQuarter",
    lastQuarter = "lastQuarter",
    thisYear = "thisYear",
    lastYear = "lastYear",
}

/**
 * The arguments for a relative span.
 */
export interface RelativeSpan {
    mode: SpanMode;
    timezone?: string;
}

function isRelativeSpan(args: unknown): args is RelativeSpan {
    return !!(args as RelativeSpan)?.mode;
}

/**
 * The arguments for a single date span.
 */
export interface SingleDateSpan {
    start: HDate;
    timezone?: string;
}

/**
 * The arguments for a double date span.
 */
export interface DoubleDateSpan {
    start: HDate;
    end: HDate;
    timezone?: string;
}

/**
 * The arguments for a double date time span.
 */
export interface DoubleDateTimeSpan {
    start: HDateTime;
    end: HDateTime;
    timezone?: string;
}

/**
 * A JSON encoded Span.
 */
export interface SpanJsonData {
    mode?: SpanMode;
    start?: HaysonDate | HaysonDateTime;
    end?: HaysonDate | HaysonDateTime;
    timezone?: string;
}

/**
 * Models a range of time using an inclusive starting timestamp and exclusive ending timestamp.
 *
 * Please note, due to the lack of date time support in vanilla JavaScript, this implementation relies
 * on using a third party library with proper timezone and locale support. See {@link HSpan.toLuxonInterval}
 * and {@link HSpan.toMomentRange}.
 */
export class HSpan {
    /**
     * The relative mode. If undefined the span is absolute.
     */
    public readonly mode?: SpanMode;

    /**
     * Inclusive starting time.
     */
    public readonly start?: HDateTime | HDate;

    /**
     * Exclusive ending time.
     */
    public readonly end?: HDateTime | HDate;

    /**
     * The timezone to use.
     */
    public readonly timezone: string;

    /**
     * Construct a new span.
     *
     * @param options.mode The span mode.
     * @param options.start The starting date or date time.
     * @param options.end The ending date or date time.
     * @param options.timezone Optional timezone identifier.
     */
    public constructor(
        args:
            | RelativeSpan
            | SingleDateSpan
            | DoubleDateSpan
            | DoubleDateTimeSpan
    ) {
        this.timezone = args.timezone ?? "";

        if (isRelativeSpan(args)) {
            this.mode = args.mode;
        } else {
            this.start = (
                args as SingleDateSpan | DoubleDateSpan | DoubleDateTimeSpan
            ).start;
            this.end = (args as DoubleDateSpan | DoubleDateTimeSpan).end;
        }
    }

    /**
     * Create a span from a encoded string or undefined if it can't be decoded.
     *
     * Decode from string format:
     * - relative `SpanMode` mode name
     * - absolute single date: 'YYYY-MM-DD'
     * - absolute date span: 'YYYY-MM-DD,YYYY-MM-DD'
     * - absolute date time span: 'YYYY-MM-DDThh:mm:ss.FFF zzzz,YYYY-MM-DDThh:mm:ss.FFF zzzz'
     *
     * @param str The string to decode.
     * @returns The decoded span or undefined.
     */
    public static fromStr(str: string): HSpan | undefined {
        const mode = SpanMode[str as SpanMode];

        if (mode) {
            return new HSpan({ mode });
        }

        // Parse single or double dates.
        const [, start, end] = /^([^,]+)(?:,([^,]+))?$/.exec(str) ?? [];

        // Absolute single date: 'YYYY-MM-DD'.
        if (start && !end) {
            const startVal = ZincReader.readValue(start);

            if (valueIsKind<HDate>(startVal, Kind.Date)) {
                return new HSpan({
                    start: startVal,
                });
            }
        }

        // Absolute date span: 'YYYY-MM-DD,YYYY-MM-DD' or
        // absolute date time span: 'YYYY-MM-DDThh:mm:ss.FFF zzzz,YYYY-MM-DDThh:mm:ss.FFF zzzz'
        if (start && end) {
            const startVal = ZincReader.readValue(start);
            const endVal = ZincReader.readValue(end);

            if (
                valueIsKind<HDate>(startVal, Kind.Date) &&
                valueIsKind<HDate>(endVal, Kind.Date)
            ) {
                return new HSpan({
                    start: startVal,
                    end: endVal,
                });
            }

            if (
                valueIsKind<HDateTime>(startVal, Kind.DateTime) &&
                valueIsKind<HDateTime>(endVal, Kind.DateTime)
            ) {
                return new HSpan({
                    start: startVal,
                    end: endVal,
                });
            }
        }

        return undefined;
    }

    /**
     * @returns Encodes the span as a string value.
     */
    public toString(): string {
        if (this.isRelative()) {
            return this.mode as string;
        }

        if (this.start && !this.end) {
            return this.start.toZinc();
        }

        return `${this.start?.toZinc()},${this.end?.toZinc()}`;
    }

    /**
     * @returns an Axon representation of this span.
     */
    public toAxon(): string {
        return `toSpan(${HStr.make(this.toString()).toAxon()})`;
    }

    /**
     * @returns A JSON representation of a span.
     */
    public toJSON(): SpanJsonData {
        const data: SpanJsonData = {};

        if (this.isRelative()) {
            data.mode = this.mode;
        } else {
            if (this.start) {
                data.start = this.start.toJSON();
            }

            if (this.end) {
                data.end = this.end.toJSON();
            }
        }

        return data;
    }

    /**
     * @returns True if the span is relative.
     */
    public isRelative(): boolean {
        return !!this.mode;
    }

    /**
     * Convert the span to a [Luxon](https://moment.github.io/luxon/index.html) interval.
     *
     * The `haystack-core` has zero runtime dependencies and supports web, node and deno environments.
     * However vanilla JavaScript lacks support for various calendar functions required to
     * make `HSpan` useful.
     *
     * Warning: at the time of writing, the first day of the week does not vary between locales with Luxon.
     *
     * ```typescript
     * import { DateTime, Interval } from 'luxon'
     *
     * ...
     * const interval = new HSpan({ mode: SpanMode.today })
     *   .toLuxonInterval({ DateTime, Interval })
     * ```
     *
     * @link [Luxon](https://moment.github.io/luxon/index.html)
     *
     * @param options.DateTime The luxon DateTime class.
     * @param options.Interval The luxon Interval class.
     * @returns A luxon interval.
     */
    public toLuxonInterval<IntervalType>(
        {
            DateTime,
            Interval,
        }: {
            DateTime: any;
            Interval: {
                fromDateTimes(start: any, end: any): IntervalType;
            };
        },
        _now?: Date
    ): IntervalType {
        const isValidTimeZone = (timezone: string): boolean =>
            !!DateTime.now().setZone(timezone).isValid;

        const getTimeZone = (timezone: string): string =>
            HDateTime.getIANATimeZone(timezone, isValidTimeZone) || "local";

        if (this.isRelative()) {
            const now = DateTime.fromJSDate(_now ?? new Date(), {
                zone: getTimeZone(this.timezone),
            });

            switch (this.mode) {
                case SpanMode.today:
                    return Interval.fromDateTimes(
                        now.startOf("day"),
                        now.endOf("day")
                    );
                case SpanMode.yesterday:
                    const yesterday = now.minus({ days: 1 });

                    return Interval.fromDateTimes(
                        yesterday.startOf("day"),
                        yesterday.endOf("day")
                    );
                case SpanMode.thisWeek:
                    return Interval.fromDateTimes(
                        now.startOf("week"),
                        now.endOf("week")
                    );
                case SpanMode.lastWeek:
                    const lastWeek = now.minus({ week: 1 });

                    return Interval.fromDateTimes(
                        lastWeek.startOf("week"),
                        lastWeek.endOf("week")
                    );
                case SpanMode.thisMonth:
                    return Interval.fromDateTimes(
                        now.startOf("month"),
                        now.endOf("month")
                    );
                case SpanMode.lastMonth:
                    const lastMonth = now.minus({ month: 1 });

                    return Interval.fromDateTimes(
                        lastMonth.startOf("month"),
                        lastMonth.endOf("month")
                    );
                case SpanMode.thisQuarter:
                    return Interval.fromDateTimes(
                        now.startOf("quarter"),
                        now.endOf("quarter")
                    );
                case SpanMode.lastQuarter:
                    const lastQuarter = now.minus({ quarter: 1 });

                    return Interval.fromDateTimes(
                        lastQuarter.startOf("quarter"),
                        lastQuarter.endOf("quarter")
                    );
                case SpanMode.thisYear:
                    return Interval.fromDateTimes(
                        now.startOf("year"),
                        now.endOf("year")
                    );
                case SpanMode.lastYear:
                    const lastYear = now.minus({ year: 1 });

                    return Interval.fromDateTimes(
                        lastYear.startOf("year"),
                        lastYear.endOf("year")
                    );
                default:
                    throw new Error(`Invalid relative span ${this.mode}`);
            }
        } else {
            if (valueIsKind<HDate>(this.start, Kind.Date) && !this.end) {
                const start = DateTime.fromJSDate(this.start.date, {
                    zone: this.timezone,
                });

                return Interval.fromDateTimes(
                    start.startOf("day"),
                    start.endOf("day")
                );
            } else if (this.start && this.end) {
                const start = valueIsKind<HDate>(this.start, Kind.Date)
                    ? DateTime.fromJSDate(this.start.date, {
                          zone: getTimeZone(this.timezone),
                      }).startOf("day")
                    : DateTime.fromJSDate(this.start.date, {
                          zone: getTimeZone(
                              this.start.timezone || this.timezone
                          ),
                      });

                const end = valueIsKind<HDate>(this.end, Kind.Date)
                    ? DateTime.fromJSDate(this.end.date, {
                          zone: getTimeZone(this.timezone),
                      }).endOf("day")
                    : DateTime.fromJSDate(this.end.date, {
                          zone: getTimeZone(this.end.timezone || this.timezone),
                      });

                return Interval.fromDateTimes(start, end);
            } else {
                throw new Error("Invalid absolute span");
            }
        }
    }

    /**
     * Convert the span to a moment range.
     *
     * ```typescript
     * import * as Moment from 'moment-timezone'
     * import { extendMoment } from 'moment-range'
     * const moment = extendMoment(Moment)
     * ...
     * const range = new HSpan({ mode: SpanMode.today })
     *   .toMomentRange(moment)
     * ```
     *
     * @link [Moment with timezones](https://momentjs.com/timezone/docs/)
     * @link [Moment range](https://github.com/rotaready/moment-range)
     */
    toMomentRange<MomentType>(
        moment: () => MomentType,
        _now?: Date
    ): MomentType {
        const _moment = moment as any;

        const isValidTimeZone = (timezone: string): boolean =>
            !!_moment.tz.zone(timezone);

        const getTimeZone = (timezone: string): string =>
            HDateTime.getIANATimeZone(timezone, isValidTimeZone) ||
            _moment.tz.guess();

        const now = _moment(_now ?? new Date()).tz(getTimeZone(this.timezone));

        if (this.isRelative()) {
            switch (this.mode) {
                case SpanMode.today:
                    return _moment.range(
                        now.clone().startOf("day"),
                        now.clone().endOf("day")
                    );
                case SpanMode.yesterday:
                    return _moment.range(
                        now.clone().subtract(1, "day").startOf("day"),
                        now.clone().subtract(1, "day").endOf("day")
                    );
                case SpanMode.thisWeek:
                    return _moment.range(
                        now.clone().startOf("week"),
                        now.clone().endOf("week")
                    );
                case SpanMode.lastWeek:
                    return _moment.range(
                        now.clone().subtract(1, "week").startOf("week"),
                        now.clone().subtract(1, "week").endOf("week")
                    );
                case SpanMode.thisMonth:
                    return _moment.range(
                        now.clone().startOf("month"),
                        now.clone().endOf("month")
                    );
                case SpanMode.lastMonth:
                    return _moment.range(
                        now.clone().subtract(1, "month").startOf("month"),
                        now.clone().subtract(1, "month").endOf("month")
                    );
                case SpanMode.thisQuarter:
                    return _moment.range(
                        now.clone().startOf("quarter"),
                        now.clone().endOf("quarter")
                    );
                case SpanMode.lastQuarter:
                    return _moment.range(
                        now.clone().subtract(1, "quarter").startOf("quarter"),
                        now.clone().subtract(1, "quarter").endOf("quarter")
                    );
                case SpanMode.thisYear:
                    return _moment.range(
                        now.clone().startOf("year"),
                        now.clone().endOf("year")
                    );
                case SpanMode.lastYear:
                    return _moment.range(
                        now.clone().subtract(1, "year").startOf("year"),
                        now.clone().subtract(1, "year").endOf("year")
                    );
                default:
                    throw new Error(`Invalid relative span ${this.mode}`);
            }
        } else {
            if (valueIsKind<HDate>(this.start, Kind.Date) && !this.end) {
                const start = _moment(this.start.date).tz(
                    getTimeZone(this.timezone)
                );

                return _moment.range(
                    start.clone().startOf("day"),
                    start.clone().endOf("day")
                );
            } else if (this.start && this.end) {
                const start = valueIsKind<HDate>(this.start, Kind.Date)
                    ? _moment(this.start.date)
                          .tz(getTimeZone(this.timezone))
                          .startOf("day")
                    : _moment(this.start.date).tz(
                          getTimeZone(this.start.timezone || this.timezone)
                      );

                const end = valueIsKind<HDate>(this.end, Kind.Date)
                    ? _moment(this.end.date)
                          .tz(getTimeZone(this.timezone))
                          .endOf("day")
                    : _moment(this.end.date).tz(
                          getTimeZone(this.end.timezone || this.timezone)
                      );

                return _moment.range(start, end);
            } else {
                throw new Error("Invalid absolute span");
            }
        }
    }
}
