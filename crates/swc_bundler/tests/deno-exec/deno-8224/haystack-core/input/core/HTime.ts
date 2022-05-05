/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { Kind } from "./Kind";
import {
    HVal,
    CANNOT_CHANGE_READONLY_VALUE,
    valueInspect,
    valueIsKind,
    valueMatches,
} from "./HVal";
import { HaysonTime } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";

/**
 * A date object.
 */
export interface TimeObj {
    hours: number;
    minutes: number;
    seconds?: number;
    milliseconds?: number;
}

/** Accepted types for making a `HTime` from */
type TimeBaseType = string | Date | TimeObj | HaysonTime | HTime;

/**
 * Haystack time.
 */
export class HTime implements HVal {
    /**
     * The string time value.
     */
    readonly #value: string;

    /**
     * Internal implementation.
     */
    readonly #date: Date;

    /**
     * Constructs a new haystack time.
     *
     * @param value The value.
     */
    private constructor(value: string | Date | TimeObj | HaysonTime) {
        if (typeof value === "string") {
            this.#value = value as string;
            this.#date = HTime.toJsDate(this.#value);
        } else if (value instanceof Date) {
            this.#date = value as Date;
            this.#value = HTime.getTimeFromDateObj(this.#date);
        } else if ((value as HaysonTime).val) {
            this.#value = (value as HaysonTime).val;
            this.#date = HTime.toJsDate(this.#value);
        } else if (typeof (value as TimeObj).hours === "number") {
            const obj = value as TimeObj;
            this.#value = HTime.getTime(
                obj.hours,
                obj.minutes,
                obj.seconds || 0,
                obj.milliseconds || 0
            );
            this.#date = HTime.toJsDate(this.#value);
        } else {
            // Mark this so an error is thrown below.
            this.#value = "";
            this.#date = new Date();
        }

        if (!this.#value) {
            throw new Error("Invalid time");
        }
    }

    private static toJsDate(value: string): Date {
        const time = Date.parse("1970-01-01T" + value + "Z");
        if (isNaN(time)) {
            throw new Error(`Invalid Time format ${value}`);
        }
        return new Date(time);
    }

    /**
     * Makes a haystack time.
     *
     * @param value The value.
     * @returns A haystack time.
     */
    public static make(value: TimeBaseType): HTime {
        if (valueIsKind<HTime>(value, Kind.Time)) {
            return value;
        } else {
            return Object.freeze(
                new HTime(value as string | Date | TimeObj | HaysonTime)
            ) as HTime;
        }
    }

    /**
     * @returns The time value.
     */
    public get value(): string {
        return this.#value;
    }

    public set value(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The hours in a 24 hour format.
     */
    public get hours(): number {
        return this.date.getUTCHours();
    }

    public set hours(hours: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The minutes.
     */
    public get minutes(): number {
        return this.date.getMinutes();
    }

    public set minutes(minutes: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The seconds.
     */
    public get seconds(): number {
        return this.date.getSeconds();
    }

    public set seconds(seconds: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The milliseconds.
     */
    public get milliseconds(): number {
        return this.date.getMilliseconds();
    }

    public set milliseconds(milliseconds: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Time;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HTime>(this, kind);
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
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * The encoding for a haystack filter is mostly zinc but contains
     * some exceptions.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        return this.toZinc();
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        return (
            valueIsKind<HTime>(value, Kind.Time) && this.#value === value.#value
        );
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HTime>(value, Kind.Time)) {
            return -1;
        }

        if (this.#value < value.#value) {
            return -1;
        }
        if (this.#value === value.#value) {
            return 0;
        }
        return 1;
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return this.#value;
    }

    /**
     * @returns The encoded time value.
     */
    public valueOf(): string {
        return this.#value;
    }

    /**
     * Encodes to an encoding zinc value.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return this.#value;
    }

    /**
     * @returns The current time.
     */
    public static now(): HTime {
        return HTime.make(new Date());
    }

    /**
     * @returns The Date for this time.
     */
    public get date(): Date {
        return this.#date;
    }

    /**
     * Return the time from the JS date object.
     *
     * @param date The JS date object.
     * @returns The time string.
     * @throws An error if the time can't be found.
     */
    private static getTimeFromDateObj(date: Date): string {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const ms = date.getMilliseconds();

        return HTime.getTime(hours, minutes, seconds, ms);
    }

    /**
     * Return the time from the JS date object.
     *
     * @param date The JS date object.
     * @returns The time string.
     * @throws An error if the time can't be found.
     */
    private static getTime(
        hours: number,
        minutes: number,
        seconds: number,
        milliseconds: number
    ): string {
        let time = (hours < 10 ? "0" : "") + String(hours);
        time += ":" + (minutes < 10 ? "0" : "") + String(minutes);
        time += ":" + (seconds < 10 ? "0" : "") + String(seconds);

        if (milliseconds) {
            let nsStr = String(milliseconds);

            while (nsStr.length < 3) {
                nsStr = "0" + nsStr;
            }

            time += "." + nsStr;
        }

        return time;
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonTime {
        return {
            _kind: this.getKind(),
            val: this.#value,
        };
    }

    /**
     * @returns An Axon encoded string of the value.
     */
    public toAxon(): string {
        return this.toZinc();
    }

    /**
     * @returns Returns the value instance.
     */
    public newCopy(): HTime {
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
    public toList(): HList<HTime> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
