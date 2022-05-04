/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { Kind } from "./Kind";
import { HaysonVal } from "./hayson";
import { HFilter } from "../filter/HFilter";
import { Node } from "../filter/Node";
import { HList } from "./HList";
import { HGrid } from "./HGrid";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";

/**
 * Default error message when a zinc value is not supported in the filter.
 */
export const NOT_SUPPORTED_IN_FILTER_MSG = "Not supported in haystack filter";

/**
 * Default error message when attempting to change immutable values.
 */
export const CANNOT_CHANGE_READONLY_VALUE = "Cannot change readonly value";

/**
 * Return true if the value is a haystack value.
 *
 * @param val The haystack value.
 * @returns True if the value is an haystack value.
 */
export function isHVal(val: unknown): val is HVal {
    return !!(val && typeof (val as HVal).isKind === "function");
}

/**
 * Return true if the kind matches.
 *
 * @param value The value to test.
 * @param kind The kind to test.
 * @returns True if the kind matches.
 */
export function valueIsKind<Value extends OptionalHVal>(
    value: unknown,
    kind: Kind
): value is Value {
    return isHVal(value) && value.getKind() === kind;
}

/**
 * Dump the value to the local console output.
 *
 * This method acts as a default implementation for most haystack value types.
 *
 * @param message An optional message to display before the value.
 * @returns The value instance.
 */
export function valueInspect<Value extends HVal>(
    value: Value,
    message?: string
): Value {
    if (message) {
        console.log(String(message));
    }

    console.log(String(value));
    return value;
}

/**
 * A value comparison that handles null or undefined values.
 *
 * @param val0 The first value to compare.
 * @param val1 The second value to compare.
 */
export function valueEquals(
    val0: HVal | undefined | null,
    val1: HVal | undefined | null
): boolean {
    if (!val0 || !val1) {
        return val0 === val1;
    } else {
        return val0.equals(val1);
    }
}

/**
 * Return true if the haystack filter matches the value.
 *
 * This method acts as a default implementation for most haystack value types.
 *
 * @param value The haystack value to test on.
 * @param filter The haystack filter or node.
 * @param cx Optional haystack filter evaluation context.
 * @returns True if there's a match.
 */
export function valueMatches(
    value: HVal,
    filter: string | Node,
    cx?: Partial<EvalContext>
): boolean {
    return new HFilter(filter).eval({
        dict: HDict.make({
            item: value,
            it: value,
        }),
        namespace: cx?.namespace,
        resolve: cx?.resolve,
    });
}

/**
 * The Zinc symbol for null.
 */
export const ZINC_NULL = "N";

/**
 * Returns a Zinc encoded value.
 *
 * @param val The value to encode.
 * @returns The Zinc encoded value.
 */
export function valueToZinc(val: HVal | null): string {
    return val?.toZinc() ?? ZINC_NULL;
}

/**
 * The Axon symbol for null
 */
export const AXON_NULL = "null";

/**
 * Returns an Axon encoded value.
 *
 * @param val The value to encode.
 * @returns The Axon encoded value.
 */
export function valueToAxon(val: HVal | null): string {
    return val?.toAxon() ?? AXON_NULL;
}

/**
 * An HVal or null type.
 */
export type OptionalHVal<Value extends HVal | null = HVal | null> =
    Value | null;

/**
 * The interface for a haystack value.
 *
 * Each haystack encoded value should declare a static factory 'make' method
 * used for creating values. All constructors should be kept private (or protected).
 */
export interface HVal {
    /**
     * @return The value's kind.
     */
    getKind(): Kind;

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    isKind(kind: Kind): boolean;

    /**
     * Value equality check.
     *
     * @param value The value used to check for equality.
     * @returns True if the value is the same.
     */
    equals(value: unknown): boolean;

    /**
     * Compares two numbers.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive
     */
    compareTo(value: unknown): number;

    /**
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * The encoding for a haystack filter is mostly zinc but contains
     * some exceptions.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    toFilter(): string;

    /**
     * Encodes to an encoding zinc value.
     *
     * @param nested An optional flag used to indiciate whether the
     * value being encoded is nested.
     * @returns The encoded zinc string.
     */
    toZinc(nested?: boolean): string;

    /**
     * @returns A JSON reprentation of the object.
     */
    toJSON(): HaysonVal;

    /**
     * @returns A string representation of the value.
     */
    toString(): string;

    /**
     * @returns An Axon encoded representation of the value.
     */
    toAxon(): string;

    /**
     * Returns true if the haystack filter matches the value.
     *
     * @param filter The filter to test.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the filter matches ok.
     */
    matches(filter: string | Node, cx?: Partial<EvalContext>): boolean;

    /**
     * Dump the value to the local console output.
     *
     * @param message An optional message to display before the value.
     * @returns The value instance.
     */
    inspect(message?: string): this;

    /**
     * Returns a new copy of the underlying value.
     *
     * If the value is immutable, the value will simply return itself.
     * If mutable, the value will return a brand new copy of the value.
     *
     * @returns A value.
     */
    newCopy(): HVal;

    /**
     * @returns The value as a grid.
     */
    toGrid(): HGrid;

    /**
     * @returns The value as a list.
     */
    toList(): HList;

    /**
     * @returns The value as a dict.
     */
    toDict(): HDict;
}
