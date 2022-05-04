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
import { HaysonSymbol } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";
import { memoize } from "../util/memoize";

export interface PartialHaysonSymbol {
    _kind?: Kind;
    val: string;
}

/** Accepted types for making a `HSymbol` from */
type SymbolBaseType = string | HaysonSymbol | HSymbol;

/**
 * Haystack symbol.
 */
export class HSymbol implements HVal {
    /**
     * Internal implementation.
     */
    readonly #value: string;

    /**
     * Constructs a new haystack symbol.
     *
     * @param value The value.
     */
    private constructor(value: string) {
        this.#value = value;
    }

    /**
     * Makes a haystack symbol.
     *
     * @param value The value string or Hayson symbol object.
     * @returns A haystack symbol.
     */
    public static make(value: SymbolBaseType): HSymbol {
        if (valueIsKind<HSymbol>(value, Kind.Symbol)) {
            return value;
        } else {
            let valStr = "";

            if (typeof value === "string") {
                if (value.startsWith("^")) {
                    value = value.substring(1, value.length);
                }
                valStr = value;
            } else {
                const obj = value as HaysonSymbol;
                valStr = obj.val;
            }

            return HSymbol.makeInterned(valStr);
        }
    }

    /**
     * Returns an interned symbol value.
     *
     * @param value The value to make.
     * @returns An interned symbol value.
     */
    @memoize()
    private static makeInterned(value: string): HSymbol {
        return Object.freeze(new HSymbol(value)) as HSymbol;
    }

    /**
     * @returns The symbol value.
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
        return Kind.Symbol;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HSymbol>(this, kind);
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
            valueIsKind<HSymbol>(value, Kind.Symbol) &&
            this.value === value.value
        );
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HSymbol>(value, Kind.Symbol)) {
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
        return this.value;
    }

    /**
     * @returns A encoded reference.
     */
    public valueOf(): string {
        return this.value;
    }

    /**
     * Encode to zinc encoding.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return `^${this.value}`;
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonSymbol {
        return {
            _kind: this.getKind(),
            val: this.value,
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
    public newCopy(): HSymbol {
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
    public toList(): HList<HSymbol> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }
}
