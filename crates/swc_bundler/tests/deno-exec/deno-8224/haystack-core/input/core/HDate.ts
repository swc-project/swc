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
import { HaysonDate } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";

/**
 * A date object.
 */
export interface DateObj {
    year: number;
    month: number;
    day: number;
}

/** Accepted types for making a `HDate` from */
type DateBaseType = string | Date | DateObj | HaysonDate | HDate;

/**
 * Haystack date.
 */
export class HDate implements HVal {
    /**
     * Interval value.
     */
    readonly #value: string;

    /**
     * Internal implementation.
     */
    readonly #date: Date;

    /**
     * Constructs a new haystack date.
     *
     * @param value The value as a string, date object or an object
     * literal with year, month and day values.
     * @throws An error if the date is invalid.
     */
    private constructor(value: string | Date | DateObj | HaysonDate) {
        if (value instanceof Date) {
            this.#value = HDate.getDateFromDateObj(value as Date);
            this.#date = value;
        } else if (typeof value === "string") {
            this.#value = value;
            this.#date = HDate.toJsDate(this.#value);
        } else if ((value as HaysonDate).val) {
            this.#value = (value as HaysonDate).val;
            this.#date = HDate.toJsDate(this.#value);
        } else {
            let year = 0;
            let month = 0;
            let day = 0;

            if (value && (value as DateObj).year) {
                const dateObj = value as DateObj;
                year = dateObj.year;
                month = dateObj.month;
                day = dateObj.day;
            }

            let date = String(year);

            date += "-" + (month <= 10 ? "0" : "") + month;
            date += "-" + (day <= 10 ? "0" : "") + day;

            this.#value = date;
            this.#date = HDate.toJsDate(this.#value);
            this.validate();
        }
    }

    private static toJsDate(value: string): Date {
        const date = Date.parse(value + "T00:00:00Z");
        if (isNaN(date)) {
            throw new Error(`Invalid Date format ${value}`);
        }
        return new Date(date);
    }

    /**
     * Factory method for a haystack date.
     *
     * @param value The value as a string, date object or an object
     * literal with year, month and day values.
     * @returns The haystack date.
     */
    public static make(value: DateBaseType): HDate {
        if (valueIsKind<HDate>(value, Kind.Date)) {
            return value;
        } else {
            return Object.freeze(
                new HDate(value as string | Date | DateObj | HaysonDate)
            ) as HDate;
        }
    }

    /**
     * @returns The date value.
     */
    public get value(): string {
        return this.#value;
    }

    public set value(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Date;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HDate>(this, kind);
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
     * Value equality check.
     *
     * @param value The value property.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        return (
            valueIsKind<HDate>(value, Kind.Date) && value.#value === this.#value
        );
    }

    /**
     * Compares two dates.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HDate>(value, Kind.Date)) {
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
        return this.date.toLocaleDateString();
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
     * @returns The date as a string.
     */
    public valueOf(): string {
        return this.value;
    }

    /**
     * @returns A JS date object.
     */
    public get date(): Date {
        return this.#date;
    }

    /**
     * @return Today's date.
     */
    public static now(): HDate {
        return HDate.make(new Date());
    }

    /**
     * @returns The year for the date.
     */
    public get year(): number {
        return this.date.getUTCFullYear();
    }

    public set year(year: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The month for the date.
     */
    public get month(): number {
        return this.date.getUTCMonth() + 1;
    }

    public set month(month: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The day for the date.
     */
    public get day(): number {
        return this.date.getUTCDate();
    }

    public set day(day: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * Validate the internal year, month and day variables.
     */
    private validate(): void {
        let year: number | undefined;
        let month: number | undefined;
        let day: number | undefined;

        const res = /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/.exec(
            this.#value
        );

        if (res) {
            year = Number(res[1]);
            month = Number(res[2]);
            day = Number(res[3]);
        }

        if (!year || year < 1900) {
            throw new Error("Invalid year");
        }
        if (!month || month < 1 || month > 12) {
            throw new Error("Invalid month");
        }
        if (!day || day < 1 || day > 31) throw new Error("Invalid day");
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
     * Return the date from the JS date object.
     *
     * @param date The JS date object.
     * @returns The date string.
     * @throws An error if the date can't be found.
     */
    private static getDateFromDateObj(date: Date): string {
        // Parse date string from ISO format.
        const iso = date.toISOString() || "";
        const res = /^([0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9])./.exec(iso);

        if (!res || !res[1]) {
            throw new Error("Invalid date");
        }

        return res[1];
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonDate {
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
    public newCopy(): HDate {
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
    public toList(): HList<HDate> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
