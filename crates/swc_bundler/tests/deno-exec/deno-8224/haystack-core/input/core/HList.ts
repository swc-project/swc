/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off", @typescript-eslint/explicit-module-boundary-types: "off" */

import { Kind } from "./Kind";
import {
    HVal,
    NOT_SUPPORTED_IN_FILTER_MSG,
    isHVal,
    valueIsKind,
    valueEquals,
    OptionalHVal,
    ZINC_NULL,
    AXON_NULL,
} from "./HVal";
import { HaysonVal, HaysonList } from "./hayson";
import { HFilter } from "../filter/HFilter";
import { HMarker } from "./HMarker";
import { Node } from "../filter/Node";
import { HDict } from "./HDict";
import { makeValue } from "./util";
import { HNum } from "./HNum";
import { HGrid } from "./HGrid";
import { EvalContext } from "../filter/EvalContext";

/**
 * An iterator for a list.
 */
export class ListValueIterator<Value extends OptionalHVal>
    implements Iterator<Value>
{
    private readonly $values: Value[];

    private $index = 0;

    public constructor(list: HList<Value>) {
        // Make a defensive copy so the iterator doesn't screw up
        // if the list is modified.
        this.$values = list.toArray();
    }

    public next(): IteratorResult<Value> {
        if (this.$index >= this.$values.length) {
            return {
                done: true,
                value: undefined,
            };
        }

        return {
            done: false,
            value: this.$values[this.$index++],
        };
    }
}

type FilterCallback<Value> = (
    row: Value,
    index: number,
    rows: Value[]
) => boolean;

type MapCallback<Value, NewValue> = (
    value: Value,
    index: number,
    array: Value[]
) => NewValue;

type ReduceCallback<PreviousValue, CurrentValue> = (
    previousValue: PreviousValue,
    currentValue: CurrentValue,
    currentIndex: number,
    array: CurrentValue[]
) => PreviousValue;

/**
 * A mutable haystack list that uses generics and the JavaScript proxy pattern.
 *
 * A list implements the JavaScript proxy pattern to make it easy to work with...
 * ```typescript
 *
 * // If you want the list to hold any value then use `new HList<HVal>(...)` instead.
 * const list = new HList<HStr>([ HStr.make('alpha'), HStr.make('beta') ])
 *
 * // Write 'gamma'
 * list.set(0, HStr.make('gamma'))
 *
 * // Read 'gamma'
 * console.log(list.get(0))
 * ```
 *
 * A list is also iterable...
 * ```typescript
 * // Iterate a list
 * for (let value of list) {
 *   console.log(value)
 * }
 *
 * // Get the list as an array...
 * const array = list.toArray()
 * ```
 */
export class HList<Value extends OptionalHVal = OptionalHVal>
    implements HVal, Iterable<Value>
{
    /**
     * The list values.
     */
    public values: Value[];

    /**
     * Numerical index access.
     */
    [prop: number]: Value;

    /**
     * Creates a new list.
     *
     * ```typescript
     * // A single haystack value array.
     * const list0 = new HList([HStr.make('foo), HMarker.make()])
     *
     * // Pass in multiple arguments instead of an array.
     * const list1 = new HList(HStr.make('foo'), HMarker.make())
     *
     * // Create a list using Hayson.
     * const list2 = new HList(['foo', { _kind: Kind.Marker }])
     * const list2 = new HList('foo', { _kind: Kind.Marker })
     * ```
     *
     * @param value list values.
     */
    public constructor(
        ...values: (Value | HaysonVal | (Value | HaysonVal)[] | HaysonList)[]
    ) {
        this.values = HList.toValues<Value>(values);

        // Implement proxy to make it easy to get and set internal values.
        const handler = {
            get: function (target: HList<Value>, prop: string): any {
                const anyTarget = target as any;

                if (prop === "length") {
                    return target.values.length;
                } else if (typeof prop === "string" && /^[0-9]+$/.test(prop)) {
                    return target.get(Number(prop));
                } else {
                    return anyTarget[prop] as any;
                }
            },

            set(target: HList<Value>, prop: string, value: any): boolean {
                const anyTarget = target as any;

                if (typeof prop === "string" && /^[0-9]+$/.test(prop)) {
                    target.set(Number(prop), value);
                } else {
                    anyTarget[prop] = value;
                }

                return true;
            },
        };

        return new Proxy(this, handler);
    }

    /**
     * Make a list.
     *
     * @param values A value or list of values.
     * @returns A list.
     */
    public static make<Value extends OptionalHVal = OptionalHVal>(
        ...values: (Value | HaysonVal | (Value | HaysonVal)[] | HaysonList)[]
    ): HList<Value> {
        return values.length === 1 &&
            valueIsKind<HList<Value>>(values[0], Kind.List)
            ? values[0]
            : new HList<Value>(HList.toValues<Value>(values));
    }

    /**
     * Returns a flattened array of haystack values.
     *
     * @param values The values to flatten into an array of haystack values.
     * @returns An array of values.
     */
    private static toValues<Value extends OptionalHVal>(
        values: (Value | HaysonVal | (Value | HaysonVal)[] | HaysonList)[]
    ): Value[] {
        const newValues: Value[] = [];

        for (const val of values) {
            if (Array.isArray(val)) {
                for (const innerVal of val) {
                    if (innerVal !== undefined) {
                        newValues.push(makeValue(innerVal) as Value);
                    }
                }
            } else if (val !== undefined) {
                newValues.push(makeValue(val) as Value);
            }
        }

        return newValues;
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.List;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HList>(this, kind);
    }

    /**
     * Return the length of the list.
     */
    public get length(): number {
        return this.values.length;
    }

    /**
     * Returns a haystack value from the list or undefined
     * if it can't be found.
     *
     * ```typescript
     * const val = list.get(0)
     * if (val) {
     *   // Do something
     * }
     * ```
     *
     * @param index The index number of the value to get.
     * @return The value, null or undefined if it can't be found.
     */
    public get(index: number): Value | undefined {
        return this.values[index];
    }

    /**
     * Set a haystack value in the list.
     *
     * ```typescript
     * list.set(0, HStr.make('A new string'))
     *
     * // Or use Hayson...
     * list.set(0, 'A new string')
     * ```
     *
     * @param index The index of the item in the list.
     * @param value The haystack value or hayson value to set.
     * @returns The list instance.
     */
    public set(index: number, value: Value | HaysonVal): this {
        this.values[index] = makeValue(value) as Value;
        return this;
    }

    /**
     * Removes a value from the list.
     *
     * ```typescript
     * // Removes the first element of the list.
     * list.remove(0)
     * ```
     *
     * @param index The index of the item in the list.
     */
    public remove(index: number): void {
        this.values.splice(index, 1);
    }

    /**
     * Clear all entries from the list.
     *
     * ```typescript
     * // Makes a list completely empty.
     * list.clear()
     * ```
     */
    public clear(): void {
        this.values.splice(0, this.values.length);
    }

    /**
     * Adds an element to the list.
     *
     * This method can add multiple values at once...
     *
     * ```typescript
     * list.add(HStr.make('foo'))
     * list.add(HStr.make('foo'), HStr.make('boo))
     *
     * // Using an array...
     * list.add([HStr.make('foo'), HStr.make('boo)])
     *
     * // Same but using hayson...
     * list.add('foo')
     * list.add('foo', 'boo')
     * list.add(['foo', 'boo'])
     * ```
     *
     * @param values The values to add to the list.
     * @returns The list instance.
     */
    public add(
        ...values: (Value | HaysonVal | (Value | HaysonVal)[] | HaysonList)[]
    ): this {
        const toAdd = HList.toValues(values);

        for (const val of toAdd) {
            this.values.push(val);
        }

        return this;
    }

    /**
     * Concatenate two lists together and return the new list.
     *
     * ```typescript
     * const newList = listA.concat(listB)
     * ```
     *
     * @param list The list to concatenate.
     * @returns The new list.
     */
    public concat(list: HList<Value>): HList<Value> {
        return HList.make(this.values.concat(list.values));
    }

    /**
     * Inserts an element into the list.
     *
     * This method can insert multiple values at once...
     *
     * ```typescript
     * list.insert(1, HStr.make('foo'))
     * list.insert(1, HStr.make('foo'), HStr.make('boo))
     *
     * // Using an array...
     * list.insert(1, [HStr.make('foo'), HStr.make('boo)])
     *
     * // Same but using hayson...
     * list.insert(1, 'foo')
     * list.insert(1, 'foo', 'boo')
     * list.insert(1, ['foo', 'boo'])
     * ```
     *
     * @param values The values to insert into the list.
     * @returns The list instance.
     */
    public insert(
        index: number,
        ...values: (Value | HaysonVal | (Value | HaysonVal)[] | HaysonList)[]
    ): this {
        const toInsert = HList.toValues(values);

        if (!toInsert.length) {
            throw new Error("No dicts to insert into grid");
        }

        if (index < 0) {
            throw new Error("Index cannot be less than zero");
        }

        if (index > this.values.length) {
            throw new Error("Index not in range");
        }

        for (const val of toInsert) {
            this.values.splice(index++, 0, val);
        }

        return this;
    }

    /**
     * Pushes a value onto the end of the list.
     *
     * ```typescript
     * list.push(HStr.make('A new string'))
     *
     * // Same but using Hayson...
     * list.push('A new string')
     * ```
     *
     * @param val The value to add to the list.
     * @returns The list instance.
     */
    public push(val: Value | HaysonVal): this {
        return this.add(val);
    }

    /**
     * Pops removes the last element of the array and returns it.
     * If the array is empty then undefined is returned.
     *
     * ```typescript
     * const lastValue = list.pop()
     *
     * if (lastValue) {
     *   // Do something
     * }
     * ```
     *
     * @returns The popped value or undefined.
     */
    public pop(): Value | undefined {
        return this.values.pop();
    }

    /**
     * Sort the list in ascending order.
     *
     * ```typescript
     * const sortedList = list.sort()
     * ```
     *
     * @returns The list instance.
     */
    public sort(): this {
        this.values.sort((first: Value, second: Value): number => {
            if (!first && !second) {
                return 0;
            }
            if (!first) {
                return -1;
            }
            if (!second) {
                return 1;
            }
            return first.compareTo(second);
        });
        return this;
    }

    /**
     * Reverse the order of all the values in the list.
     *
     * ```typescript
     * const listInDescendingOrder = list.sort().reverse()
     * ```
     *
     * @returns The list instance.
     */
    public reverse(): this {
        this.values.reverse();
        return this;
    }

    /**
     * ```typescript
     * if (list.isEmpty()) {
     *   // List is empty.
     * }
     * ```
     *
     * @returns True when there are no entries in the list.
     */
    public isEmpty(): boolean {
        return this.values.length === 0;
    }

    /**
     * Test to see if the list contains the value or matches the filter at least once.
     *
     * ```typescript
     * const list = new HList([ HStr.make('a'), HStr.make('b'), HStr.make('c') ])
     *
     * if (list.any(HStr.make(a))) {
     *   // Do something
     * }
     *
     * // Or use a haystack filter...
     * if (list.any('item == "a"')) {
     *  // Do something
     * }
     *
     * // It use the shortened item name in a haystack filter...
     * if (list.any('it == "a"')) {
     *  // Do something
     * }
     * ```
     *
     * @param val The value to test, a haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the list contains the value.
     */
    public any(val: Value | string | Node, cx?: Partial<EvalContext>): boolean {
        let result = false;

        if (isHVal(val) || val === null) {
            for (const value of this.values) {
                if (valueEquals(val, value)) {
                    result = true;
                    break;
                }
            }
        } else {
            this.runFilter(
                val as string | Node,
                (match: boolean): boolean => {
                    if (match) {
                        result = true;

                        // Stop iterating since we have one match.
                        return false;
                    }

                    return true;
                },
                cx
            );
        }

        return result;
    }

    /**
     * Returns true if the haystack filter matches the value.
     *
     * This method is the same as `any`.
     *
     * @param filter The filter to test.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the filter matches ok.
     */
    public matches(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        return this.any(filter, cx);
    }

    /**
     * Test to see if the list contains all the same value or the filter
     * matches all elements.
     *
     * ```typescript
     *
     * const list = new HList([ HStr.make('a'), HStr.make('a'), HStr.make('a') ])
     *
     * if (list.all(HStr.make('a'))) {
     *   // Do something
     * }
     *
     * // Also use a haystack filter...
     * if (list.all('item == "a"')) {
     *   // Do something
     * }
     *
     * // Same again but use the shorter 'it'...
     * if (list.all('it == "all"')) {
     *   // Do something
     * }
     *
     * list.push(HStr.make('b'))
     *
     * // All will now return false as the values aren't all the same...
     * if (list.all('it == "a"')) {
     *   // Do something
     * }
     * ```
     *
     * @param val The value to test, a haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the list contains the value.
     */
    public all(val: Value | string | Node, cx?: Partial<EvalContext>): boolean {
        if (this.isEmpty()) {
            return false;
        }

        let result = true;

        if (isHVal(val) || val === null) {
            for (const value of this.values) {
                if (!valueEquals(val, value)) {
                    result = false;
                    break;
                }
            }
        } else {
            this.runFilter(
                val as string | Node,
                (match: boolean): boolean => {
                    if (!match) {
                        result = false;

                        // Stop iterating because the test has failed.
                        return false;
                    }

                    // Keep iterating.
                    return true;
                },
                cx
            );
        }

        return result;
    }

    /**
     * Filter the list via a haystack filter or callback function and return a new list.
     *
     * If a Haystack filter is used, the array list is referenced as either 'it' or 'item.
     *
     * ```typescript
     * const list = HList<HStr>.make([ HStr.make('foo'), HStr.make('boo'), HStr.make('foo') ])
     *
     * const filteredList = list.filter('item == "foo"')
     *
     * // Or use the shorter it...
     *
     * const anotherList = list.filter('it == "foo"')
     * ```
     *
     * A classic filter function callback can also be used...
     * ```typescript
     * const anotherList= list.filter((val: HStr): boolean => val.value === 'foo')
     * ```
     *
     * @param filter A haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns A new haystack list.
     */
    public filter(
        filter: string | Node | FilterCallback<Value>,
        cx?: Partial<EvalContext>
    ): HList<Value> {
        let newVals: Value[];

        if (typeof filter === "function") {
            newVals = this.values.filter(filter);
        } else {
            newVals = [];

            this.runFilter(
                filter,
                (match: boolean, val: Value): boolean => {
                    if (match) {
                        newVals.push(val);
                    }

                    // Keep iterating
                    return true;
                },
                cx
            );
        }

        return HList.make(newVals);
    }

    /**
     * Run the filter. For each match invoke the callback function.
     *
     * The callback takes a flag to indicate a match, value and an index argument.
     * If false is returned the filter stops running.
     *
     * @param filter The haystack filter to run or an AST node.
     * @param callback The callback invoked for each match.
     * @param cx Optional haystack filter evaluation context.
     */
    private runFilter(
        filter: string | Node,
        callback: (match: boolean, value: Value, index: number) => boolean,
        cx: Partial<EvalContext> | undefined
    ): void {
        const hfilter = new HFilter(filter);

        // Create a dict that is modified for each value in the array.
        const dict = HDict.make({
            it: HMarker.make(),
            item: HMarker.make(),
        });

        const context = {
            dict,
            namespace: cx?.namespace,
            resolve: cx?.resolve,
        };

        for (let i = 0; i < this.values.length; ++i) {
            const val = this.values[i];

            dict.set("it", val);
            dict.set("item", val);

            // Run the filter against the dict again after each time its modified.
            if (!callback(hfilter.eval(context), val, i)) {
                break;
            }
        }
    }

    /**
     * Use an array style map function on a list.
     *
     * ```typescript
     * // Using React, map a list to some DOM elements...
     * list.make((str: HStr): any => <div>{str.value}</div>)
     * ```
     *
     * @param callback The map callback.
     * @returns A new list with the mapped value.
     */
    public map<NewValue>(callback: MapCallback<Value, NewValue>): NewValue[] {
        return this.values.map(callback);
    }

    /**
     * Use an array style reduce function on a list.
     *
     * ```typescript
     * const numList = new HList<HNum>([1, 2, 3])
     *
     * const total = numList.reduce(
     *   (prev, cur): number => prev + cur.value), 0
     * )
     * ```
     *
     * @param callback the reduce callback.
     * @param initialValue The initial value for the reduce operation.
     * @returns The reduced value.
     */
    public reduce<NewValue = Value>(
        callback: ReduceCallback<NewValue, Value>,
        initialValue?: NewValue
    ): NewValue {
        return initialValue === undefined
            ? (this.values.reduce(callback as any) as any)
            : this.values.reduce(callback, initialValue);
    }

    /**
     * ```typescript
     * // Creates an HList with HNums - [1, 2, 3, 4, 5, 6]
     * const list = new HList<HNum>([[1, 2, 3], [4, 5], 6]).flat()
     * ```
     *
     * @returns A flattened list.
     */
    public flat<
        NewValue extends OptionalHVal = OptionalHVal
    >(): HList<NewValue> {
        const newValues: NewValue[] = [];

        for (const val of this.values) {
            // If any values are lists then flatten then into a new list.
            if (valueIsKind<HList>(val, Kind.List)) {
                for (const innerVal of val) {
                    newValues.push(innerVal as NewValue);
                }
            } else {
                newValues.push(val as unknown as NewValue);
            }
        }

        return HList.make(newValues);
    }

    /**
     * ```typescript
     * // Create a unique list with HStr - [ 'a', 'b' ]
     * const list = new HList<HStr>('a', 'a', 'b').unique()
     * ```
     *
     * @returns A new filtered list of unique values.
     */
    public unique(): HList<Value> {
        return HList.make<Value>(
            this.values.filter((val: Value, index: number): boolean => {
                for (let i = 0; i < index; ++i) {
                    const value = this.values[i];

                    if (valueEquals(value, val)) {
                        return false;
                    }
                }
                return true;
            })
        );
    }

    /**
     * Find a value to search for and returns true if it's found.
     *
     * ```typescript
     * if (list.includes(HNum.make(24, 'm'))) {
     *   // Do something...
     * }
     * ```
     *
     * @param val The value to search for.
     * @param fromIndex Optional index number to search from.
     * @returns true if the value is found.
     */
    public includes(val: Value | HaysonVal, fromIndex?: number): boolean {
        const newVal = makeValue(val);
        let included = false;

        for (let i = fromIndex || 0; i < this.values.length; ++i) {
            const value = this.values[i];
            if (valueEquals(newVal, value)) {
                included = true;
                break;
            }
        }

        return included;
    }

    /**
     * Loop through a list's values.
     *
     * @param callbackfn The function to execute on each haystack value.
     * @param thisArg Optional value to use as this when executing callback.
     */
    public forEach(
        callbackfn: (value: Value, index: number, array: Value[]) => void,
        thisArg?: any
    ): void {
        this.values.forEach(callbackfn, thisArg || this);
    }

    /**
     * Returns the list in a Hayson format.
     *
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonList {
        return this.values.map((val): HaysonVal => val?.toJSON() ?? null);
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return `[${this.values
            .map((val): string => val?.toString() ?? String(val))
            .join(", ")}]`;
    }

    /**
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * A list isn't supported in filter so throw an error.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        throw new Error(NOT_SUPPORTED_IN_FILTER_MSG);
    }

    /**
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        return `[${this.values
            .map((val): string => val?.toZinc(/*nested*/ true) ?? ZINC_NULL)
            .join(",")}]`;
    }

    /**
     * @returns An Axon encoded string.
     */
    public toAxon(): string {
        return `[${this.values
            .map((val): string => val?.toAxon() ?? AXON_NULL)
            .join(",")}]`;
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        if (!valueIsKind<HList>(value, Kind.List)) {
            return false;
        }

        if (this.values.length !== value.values.length) {
            return false;
        }

        for (let i = 0; i < this.values.length; ++i) {
            const val0 = this.values[i];
            const val1 = value.values[i];

            if (!valueEquals(val0, val1)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compares two values.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive.
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HList>(value, Kind.List)) {
            return -1;
        }

        const zinc0 = this.toZinc();
        const zinc1 = value.toZinc();

        if (zinc0 < zinc1) {
            return -1;
        }
        if (zinc0 === zinc1) {
            return 0;
        }
        return 1;
    }

    /**
     * @returns A copy of the underlying array.
     */
    public toArray(): Value[] {
        return this.values;
    }

    /**
     * Iterate over a list.
     *
     * This enables a 'for ... of' loop to be used directly on an iterator.
     *
     * @returns A new iterator for a list.
     *
     * ```typescript
     * // Iterate a list
     * for (let value of list) {
     *   console.log(value)
     * }
     *
     * // Destructure a list into a real array
     * const array = [...list]
     * ```
     */
    public [Symbol.iterator](): Iterator<Value> {
        return new ListValueIterator(this) as Iterator<Value>;
    }

    /**
     * @returns The list as an array like object.
     */
    public asArrayLike(): ArrayLike<HaysonVal | Value> {
        return this as unknown as ArrayLike<HaysonVal | Value>;
    }

    /**
     * Returns a list of primitive numbers from the list.
     *
     * @returns A list of numbers.
     */
    private toNumbers(): number[] {
        return this.values
            .filter((val): boolean => valueIsKind<HNum>(val, Kind.Number))
            .map((val): number => (val as unknown as HNum).value);
    }

    /**
     * Convience method for summing a list of numbers in a list.
     *
     * ```typescript
     * // Sums to 6
     * const sum = new HList<HNum>(1, 2, 3).sum
     * ```
     *
     * @returns A sum of all the numbers in the list.
     */
    public get sum(): number {
        return this.toNumbers().reduce(
            (acc: number, cur: number): number => acc + cur,
            /*initial value*/ 0
        );
    }

    /**
     * Convience method for getting the maximum number in a list.
     *
     * ```typescript
     * // 3
     * const max = new HList<HNum>(1, 2, 3).max
     * ```
     *
     * If there are no numbers then Number.MIN_SAFE_INTEGER is returned.
     *
     * @returns A maximum number in a list.
     */
    public get max(): number {
        return this.toNumbers().reduce(
            (acc: number, cur: number): number => (acc > cur ? acc : cur),
            /*initial value*/ Number.MIN_SAFE_INTEGER
        );
    }

    /**
     * Convience method for getting the minimum number in a list.
     *
     * ```typescript
     * // 1
     * const min = new HList<HNum>(1, 2, 3).min
     * ```
     *
     * If there are no numbers then Number.MAX_SAFE_INTEGER is returned.
     *
     * @returns A minimum number in a list.
     */
    public get min(): number {
        return this.toNumbers().reduce(
            (acc: number, cur: number): number => (acc < cur ? acc : cur),
            /*initial value*/ Number.MAX_SAFE_INTEGER
        );
    }

    /**
     * Convience method for averaging all the numbers in a list.
     *
     * If there are no numbers then Number.NaN is returned.
     *
     * ```typescript
     * // 2
     * const avg = new HList<HNum>(1, 2, 3).avg
     * ```
     *
     * @returns The average of all the numbers.
     */
    public get avg(): number {
        const numbers = this.toNumbers();

        if (numbers.length === 0) {
            return Number.NaN;
        }

        return (
            numbers.reduce(
                (acc: number, cur: number): number => acc + cur,
                /*initial value*/ 0
            ) / numbers.length
        );
    }

    /**
     * Return the list as a dict.
     *
     * The dict has one key called 'val' that stores the list.
     *
     * @returns A dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }

    /**
     * Return the list as a grid.
     *
     * The grid has one row and one column called 'val'.
     *
     * @returns A grid.
     */
    public toGrid(): HGrid {
        return HGrid.make(this);
    }

    /**
     * @returns The value as a list.
     */
    public toList(): HList<Value> {
        return this;
    }

    /**
     * Dump the value to the local console output.
     *
     * @param message An optional message to display before the value.
     * @returns The value instance.
     */
    public inspect(message?: string): this {
        if (message) {
            console.log(String(message));
        }

        console.table(this.values.map((val): string => String(val)));
        return this;
    }

    /**
     * @returns Returns a copy of the list.
     */
    public newCopy(): HList<Value> {
        return HList.make<Value>(
            this.values.map(
                (val): Value => (val === null ? null : val.newCopy()) as Value
            )
        );
    }

    /**
     * Iterates through the list to ensure we have a valid set of haystack values.
     *
     * As the list's array is directly exposed calling this method will ensure all the
     * values held in the list are haystack values.
     */
    public validate(): void {
        for (let i = 0; i < this.values.length; ++i) {
            if (!isHVal(this.values[i])) {
                this.values[i] = makeValue(this.values[i]) as Value;
            }
        }
    }
}
