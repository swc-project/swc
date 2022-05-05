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
import { HaysonXStr } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { HStr } from "./HStr";
import { EvalContext } from "../filter/EvalContext";

/** Accepted types for making a `HXStr` from */
type XStrBaseType = string | HaysonXStr | HXStr;

/**
 * Haystack XStr.
 */
export class HXStr implements HVal {
    /**
     * The inner type.
     */
    readonly #type: string;

    /**
     * The inner value.
     */
    readonly #value: string;

    /**
     * Constructs a new haystack xstring.
     *
     * @param type The type or an hayson xstr object.
     * @param value The value.
     */
    private constructor(type: string | HaysonXStr, value?: string) {
        if (typeof type === "string") {
            this.#type = type;
            this.#value = value ?? "";
        } else {
            const obj = type as HaysonXStr;
            this.#type = obj.type;
            this.#value = obj.val ?? "";
        }
    }

    /**
     * Make a haystack xstring.
     *
     * @param type The type or an hayson xstr object.
     * @param value The value.
     * @returns A haystack xstring.
     */
    public static make(type: XStrBaseType, value?: string): HXStr {
        if (valueIsKind<HXStr>(type, Kind.XStr)) {
            return type;
        } else {
            return Object.freeze(
                new HXStr(type as string | HaysonXStr, value)
            ) as HXStr;
        }
    }

    /**
     * @returns The type value.
     */
    public get type(): string {
        return this.#type;
    }

    public set type(type: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value.
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
        return Kind.XStr;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HXStr>(this, kind);
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
     * @returns A string representation of the value.
     */
    public toString(): string {
        return this.toZinc();
    }

    /**
     * @returns The zinc encoded string.
     */
    public valueOf(): string {
        return this.toZinc();
    }

    /**
     * Encodes to an encoding zinc value.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return `${this.type}(${HStr.make(this.value).toZinc()})`;
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        return (
            valueIsKind<HXStr>(value, Kind.XStr) &&
            this.value === value.value &&
            this.type === value.type
        );
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HXStr>(value, Kind.XStr)) {
            return -1;
        }

        const str = `${this.type}:${this.value}`;
        const strVal = `${value.type}:${value.value}`;

        if (str < strVal) {
            return -1;
        }
        if (str === strVal) {
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
    public toJSON(): HaysonXStr {
        return {
            _kind: this.getKind(),
            val: this.value,
            type: this.type,
        };
    }

    /**
     * @returns An Axon encoded string of the value.
     */
    public toAxon(): string {
        return `xstr(${HStr.make(this.type).toZinc()},${HStr.make(
            this.value
        ).toZinc()})`;
    }

    /**
     * @returns Returns the value instance.
     */
    public newCopy(): HXStr {
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
    public toList(): HList<HXStr> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
