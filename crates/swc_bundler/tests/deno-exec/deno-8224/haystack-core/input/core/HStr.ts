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
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";

let emptyStr: HStr;

/**
 * Haystack string.
 */
export class HStr implements HVal {
    /**
     * The string value.
     */
    readonly #value: string;

    /**
     * Constructs a new haystack string.
     *
     * @param value The value.
     */
    private constructor(value: string) {
        this.#value = value;
    }

    /**
     * Makes a haystack string.
     *
     * @param value The value string.
     * @returns A haystack string.
     */
    public static make(value: string | HStr): HStr {
        if (valueIsKind<HStr>(value, Kind.Str)) {
            return value;
        } else {
            const valStr = String(value);

            return valStr
                ? (Object.freeze(new HStr(valStr)) as HStr)
                : emptyStr ||
                      (emptyStr = Object.freeze(new HStr(valStr)) as HStr);
        }
    }

    /**
     * @returns The string value.
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
        return Kind.Str;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HStr>(this, kind);
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
    public equals(value: HStr): boolean {
        return valueIsKind<HStr>(value, Kind.Str) && this.value === value.value;
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HStr>(value, Kind.Str)) {
            return -1;
        }

        if (this.value < value.value) {
            return -1;
        }
        if (this.value === value.value) {
            return 0;
        }
        return 1;
    }

    /**
     * @returns The object's value as a string.
     */
    public valueOf(): string {
        return this.value;
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return this.value;
    }

    /**
     * Encode to zinc encoding.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        let buf = '"';

        for (const c of this.value) {
            const code = c.charCodeAt(0);
            if (
                c < " " ||
                c === '"' ||
                c === "\\" ||
                c === "$" ||
                code >= 128
            ) {
                buf += "\\";
                switch (c) {
                    case "\b":
                        buf += "b";
                        break;
                    case "\f":
                        buf += "f";
                        break;
                    case "\n":
                        buf += "n";
                        break;
                    case "\r":
                        buf += "r";
                        break;
                    case "\t":
                        buf += "t";
                        break;
                    case '"':
                        buf += '"';
                        break;
                    case "\\":
                        buf += "\\";
                        break;
                    case "$":
                        buf += "$";
                        break;
                    default:
                        let seq = code.toString(16);

                        // Make sure we have four characters for the unicode sequence.
                        while (seq.length < 4) {
                            seq = `0${seq}`;
                        }

                        buf += `u${seq}`;
                }
            } else {
                buf += c;
            }
        }

        buf += '"';

        return buf;
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): string {
        return this.value;
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
    public newCopy(): HStr {
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
    public toList(): HList<HStr> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
