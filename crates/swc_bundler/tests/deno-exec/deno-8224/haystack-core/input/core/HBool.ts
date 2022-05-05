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

let trueInstance: HBool;
let falseInstance: HBool;

/**
 * Haystack boolean.
 */
export class HBool implements HVal {
    /**
     * The boolean value.
     */
    readonly #value: boolean;

    /**
     * Constructs a new haystack boolean.
     *
     * @param value The value.
     */
    private constructor(value: boolean) {
        this.#value = !!value;
    }

    /**
     * Factory method for a haystack boolean.
     *
     * @param value The value.
     * @returns A haystack boolean value.
     */
    public static make(value: boolean | HBool): HBool {
        if (valueIsKind<HBool>(value, Kind.Bool)) {
            return value;
        } else if (value) {
            return (
                trueInstance ||
                (trueInstance = Object.freeze(new HBool(true)) as HBool)
            );
        } else {
            return (
                falseInstance ||
                (falseInstance = Object.freeze(new HBool(false)) as HBool)
            );
        }
    }

    /**
     * @returns The boolean value.
     */
    public get value(): boolean {
        return this.#value;
    }

    public set value(value: boolean) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Bool;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HBool>(this, kind);
    }

    /* Returns true if the haystack filter matches the value.
     *
     * @param filter The filter to test.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the filter matches ok.
     */
    public matches(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        return valueMatches(this, filter, cx);
    }

    /**
     *
     * @param message An optional message to display before the value.
     * @returns The value instance.
     */
    public inspect(message?: string): this {
        return valueInspect(this, message);
    }

    /*
     * @returns The object's value as a boolean string.
     */
    public valueOf(): boolean {
        return this.#value;
    }

    /**
     * Value equality check.
     *
     * @param value The value to compare.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        return (
            valueIsKind<HBool>(value, Kind.Bool) &&
            this.valueOf() === value.valueOf()
        );
    }

    /**
     * Compares two booleans.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HBool>(value, Kind.Bool)) {
            return -1;
        }

        if (this.valueOf() < value.valueOf()) {
            return -1;
        }
        if (this.valueOf() === value.valueOf()) {
            return 0;
        }
        return 1;
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return String(this.value);
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
        return this.valueOf() ? "true" : "false";
    }

    /**
     * Encode to zinc encoding.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return this.valueOf() ? "T" : "F";
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): boolean {
        return this.valueOf();
    }

    /**
     * @returns An Axon encoded string of the value.
     */
    public toAxon(): string {
        return String(this.valueOf());
    }

    /**
     * @returns Returns the value instance.
     */
    public newCopy(): HBool {
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
    public toList(): HList<HBool> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
