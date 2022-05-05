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
import { HaysonRef } from "./hayson";
import { HStr } from "./HStr";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";

/** Accepted types for making a `HRef` from */
type RefBaseType = string | HaysonRef | HRef;

/**
 * Haystack ref.
 */
export class HRef implements HVal {
    /**
     * The ref's value.
     */
    readonly #value: string;

    /**
     * The ref's display name.
     */
    readonly #displayName: string;
    /**
     * Constructs a new haystack ref.
     *
     * @param value The value.
     * @param displayName The optional display name.
     */
    private constructor(value: string | HaysonRef, displayName?: string) {
        if (typeof value === "string") {
            if (value.startsWith("@")) {
                value = value.substring(1, value.length);
            }
            this.#value = value;
            this.#displayName = displayName ?? "";
        } else {
            const obj = value as HaysonRef;

            this.#value = obj.val;
            this.#displayName = obj.dis ?? "";
        }
    }

    /**
     * Makes a Haystack ref.
     *
     * @param value The value or hayson ref.
     * @param displayName Optional display string for a reference.
     * @returns A haystack ref.
     */
    public static make(value: RefBaseType, displayName?: string): HRef {
        if (valueIsKind<HRef>(value, Kind.Ref)) {
            return value;
        } else {
            return Object.freeze(
                new HRef(value as string | HaysonRef, displayName)
            ) as HRef;
        }
    }

    /**
     * @returns The ref value.
     */
    public get value(): string {
        return this.#value;
    }

    public set value(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The display name value in shorthand.
     */
    public get dis(): string {
        return this.#displayName || this.#value;
    }

    public set dis(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The display name value.
     */
    public get displayName(): string {
        return this.dis;
    }

    public set displayName(value: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Ref;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HRef>(this, kind);
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
        return this.toZinc(/*excludeDis*/ true);
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the ref is the same.
     */
    public equals(value: unknown): boolean {
        return valueIsKind<HRef>(value, Kind.Ref) && this.value === value.value;
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HRef>(value, Kind.Ref)) {
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
     * @returns A string representation of the value.
     */
    public toString(): string {
        return this.toZinc();
    }

    /**
     * @returns The ref's value.
     */
    public valueOf(): string {
        return this.value;
    }

    /**
     * Encode to zinc encoding.
     *
     * @params excludeDis Excludes the display name from the encoding.
     * @returns The encoded zinc string.
     */
    public toZinc(excludeDis?: boolean): string {
        let zinc = `@${this.value}`;

        // If there's a display name then also add it.
        if (!excludeDis && this.#displayName) {
            zinc += ` ${HStr.make(this.#displayName).toZinc()}`;
        }

        return zinc;
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonRef {
        const obj: HaysonRef = {
            _kind: this.getKind(),
            val: this.value,
        };

        if (this.#displayName) {
            obj.dis = this.#displayName;
        }

        return obj;
    }

    /**
     * @returns An Axon encoded string.
     */
    public toAxon(): string {
        return this.toZinc(/*excludeDis*/ true);
    }

    /**
     * @returns Returns the value instance.
     */
    public newCopy(): HRef {
        return this;
    }

    /**
     * @returns A ref with no display name.
     */
    public noDis(): HRef {
        return this.#displayName ? HRef.make(this.#value) : this;
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
    public toList(): HList<HRef> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
