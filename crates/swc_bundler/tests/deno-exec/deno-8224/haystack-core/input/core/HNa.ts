/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-unused-vars: "off", @typescript-eslint/no-empty-function: "off" */

import { Kind } from './Kind'
import {
	HVal,
	NOT_SUPPORTED_IN_FILTER_MSG,
	valueInspect,
	valueIsKind,
	valueMatches,
} from './HVal'
import { HaysonNa } from './hayson'
import { Node } from '../filter/Node'
import { HGrid } from './HGrid'
import { HList } from './HList'
import { HDict } from './HDict'
import { EvalContext } from '../filter/EvalContext'

/**
 * An immutable JSON value.
 */
const JSON_NA = {
	_kind: Kind.NA,
}

let na: HNa

/**
 * Haystack NA value.
 */
export class HNa implements HVal {
	/**
	 * Constructs a new haystack marker.
	 */
	private constructor() {}

	/**
	 * Makes an na.
	 *
	 * @returns A na instance.
	 */
	public static make(): HNa {
		return na ?? (na = Object.freeze(new HNa()) as HNa)
	}

	/**
	 * @returns The value's kind.
	 */
	public getKind(): Kind {
		return Kind.NA
	}

	/**
	 * Compares the value's kind.
	 *
	 * @param kind The kind to compare against.
	 * @returns True if the kind matches.
	 */
	public isKind(kind: Kind): boolean {
		return valueIsKind<HNa>(this, kind)
	}

	/**
	 * Returns true if the haystack filter matches the value.
	 *
	 * @param filter The filter to test.
	 * @param cx Optional haystack filter evaluation context.
	 * @returns True if the filter matches ok.
	 */
	public matches(filter: string | Node, cx?: Partial<EvalContext>): boolean {
		return valueMatches(this, filter, cx)
	}

	/**
	 * Dump the value to the local console output.
	 *
	 * @param message An optional message to display before the value.
	 * @returns The value instance.
	 */
	public inspect(message?: string): this {
		return valueInspect(this, message)
	}

	/**
	 * @returns A string representation of the value.
	 */
	public toString(): string {
		return '[NA]'
	}

	/**
	 * @returns The zinc encoded string.
	 */
	public valueOf(): string {
		return this.toZinc()
	}

	/**
	 * Encodes to an encoding zinc value.
	 *
	 * @returns The encoded zinc string.
	 */
	public toZinc(): string {
		return 'NA'
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
		throw new Error(NOT_SUPPORTED_IN_FILTER_MSG)
	}

	/**
	 * Value equality check.
	 *
	 * @param value The value to test.
	 * @returns True if the value is the same.
	 */
	public equals(value: unknown): boolean {
		return valueIsKind<HNa>(value, Kind.NA)
	}

	/**
	 * Compares two values.
	 *
	 * @param value The value to compare against.
	 * @returns The sort order as negative, 0, or positive
	 */
	public compareTo(value: unknown): number {
		return valueIsKind<HNa>(value, Kind.NA) ? 0 : -1
	}

	/**
	 * @returns A JSON reprentation of the object.
	 */
	public toJSON(): HaysonNa {
		return JSON_NA
	}

	/**
	 * @returns An Axon encoded string of the value.
	 */
	public toAxon(): string {
		return 'na()'
	}

	/**
	 * @returns Returns the value instance.
	 */
	public newCopy(): HNa {
		return this
	}

	/**
	 * @returns The value as a grid.
	 */
	public toGrid(): HGrid {
		return HGrid.make(this)
	}

	/**
	 * @returns The value as a list.
	 */
	public toList(): HList<HNa> {
		return HList.make(this)
	}

	/**
	 * @returns The value as a dict.
	 */
	public toDict(): HDict {
		return HDict.make(this)
	}
}
