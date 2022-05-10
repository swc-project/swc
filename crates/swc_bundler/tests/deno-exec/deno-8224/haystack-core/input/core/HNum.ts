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
import { HaysonNum, HaysonNumVal } from "./hayson";
import { Node } from "../filter/Node";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { EvalContext } from "../filter/EvalContext";
import { HUnit } from "./HUnit";

/** Accepted types for making a `HNum` from */
type NumberBaseType = number | HaysonNum | HNum;

/**
 * The default numeric precision.
 */
export const DEFAULT_PRECISION = 1;

let zeroNoUnitsNum: HNum;

export const POSITIVE_INFINITY_ZINC = "INF";
export const NEGATIVE_INFINITY_ZINC = "-INF";
export const NOT_A_NUMBER_ZINC = "NaN";

/**
 * Haystack number with units.
 */
export class HNum implements HVal {
    /**
     * The numerical value.
     */
    readonly #value: number;

    /**
     * The unit symbol for the number.
     */
    readonly #unitSymbol: string;

    /**
     * Constructs a new haystack number.
     *
     * @param value The value.
     * @param unit Optional units.
     */
    private constructor(value: number, unit?: string | HUnit) {
        this.#value = value;

        if (unit) {
            if (typeof unit === "string") {
                this.#unitSymbol = unit;
            } else {
                const symbol = unit.symbol;

                if (!HUnit.get(symbol)) {
                    HUnit.define(unit);
                }

                this.#unitSymbol = symbol;
            }
        } else {
            this.#unitSymbol = "";
        }
    }

    /**
     * Makes a haystack number.
     *
     * @param value The value or a hayson number object.
     * @param unit Optional units.
     * @returns A haystack number.
     */
    public static make(value: NumberBaseType, unit?: string | HUnit): HNum {
        let val = 0;
        if (typeof value === "number") {
            val = value as number;
        } else if (valueIsKind<HNum>(value, Kind.Number)) {
            return value;
        } else {
            const obj = value as HaysonNum;

            switch (typeof obj.val) {
                case "string":
                    if (obj.val === POSITIVE_INFINITY_ZINC) {
                        val = Number.POSITIVE_INFINITY;
                    } else if (obj.val === NEGATIVE_INFINITY_ZINC) {
                        val = Number.NEGATIVE_INFINITY;
                    } else if (obj.val === NOT_A_NUMBER_ZINC) {
                        val = Number.NaN;
                    } else {
                        throw new Error("Invalid hayson number string value");
                    }
                    break;
                case "number":
                    val = obj.val as number;
                    break;
                default:
                    throw new Error("Invalid hayson number value");
            }

            unit = obj.unit;
        }

        return val === 0 && !unit
            ? zeroNoUnitsNum ||
                  (zeroNoUnitsNum = Object.freeze(new HNum(val, unit)) as HNum)
            : (Object.freeze(new HNum(val, unit)) as HNum);
    }

    /**
     * @returns The numeric value.
     */
    public get value(): number {
        return this.#value;
    }

    public set value(value: number) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns Optional unit value for a number.
     */
    public get unit(): HUnit | undefined {
        // Always lazily look up the unit from the unit database
        // just in case the unit was defined after the number was loaded.
        // This can happen as the loading of the unit database is decoupled
        // from the core haystack value type system.
        if (!this.#unitSymbol) {
            return undefined;
        }

        let unit = HUnit.get(this.#unitSymbol);

        if (unit) {
            return unit;
        }

        unit = new HUnit({ ids: [this.#unitSymbol], scale: 1, offset: 0 });
        HUnit.define(unit);
        return unit;
    }

    public set unit(unit: HUnit | undefined) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Number;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HNum>(this, kind);
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
     * @returns The object's value as a number.
     */
    public valueOf(): number {
        return this.#value;
    }

    /**
     * Return the number as a readable string.
     *
     * @param precision Optional precision. Default is 1 decimal place.
     * @returns A string representation of the value.
     */
    public toString(precision: number = DEFAULT_PRECISION): string {
        if (this.value === Number.POSITIVE_INFINITY) {
            return POSITIVE_INFINITY_ZINC;
        } else if (this.value === Number.NEGATIVE_INFINITY) {
            return NEGATIVE_INFINITY_ZINC;
        } else if (isNaN(this.value)) {
            return NOT_A_NUMBER_ZINC;
        } else {
            const value = this.value.toLocaleString(/*locale*/ undefined, {
                style: "decimal",
                maximumFractionDigits: precision,
                minimumFractionDigits: precision,
            });

            return this.#unitSymbol ? value + this.#unitSymbol : value;
        }
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
        if (
            this.value === Number.POSITIVE_INFINITY ||
            this.value === Number.NEGATIVE_INFINITY ||
            isNaN(this.value)
        ) {
            throw new Error(
                "Numeric INF, -INF and NaN not supported in filter"
            );
        }

        return this.toZinc();
    }

    /**
     * Encodes to an encoding zinc value.
     *
     * @returns The encoded zinc string.
     */
    public toZinc(): string {
        if (this.value === Number.POSITIVE_INFINITY) {
            return POSITIVE_INFINITY_ZINC;
        } else if (this.value === Number.NEGATIVE_INFINITY) {
            return NEGATIVE_INFINITY_ZINC;
        } else if (isNaN(this.value)) {
            return NOT_A_NUMBER_ZINC;
        } else {
            return this.#unitSymbol
                ? String(this.value) + this.#unitSymbol
                : String(this.value);
        }
    }

    /**
     * Value equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        if (!valueIsKind<HNum>(value, Kind.Number)) {
            return false;
        }

        if (
            this.value !== value.value &&
            !(Number.isNaN(this.value) && Number.isNaN(value.value))
        ) {
            return false;
        }

        const unit = this.unit;
        return unit ? unit.equals(value.unit) : unit === value.unit;
    }

    /**
     * Compares two values.
     *
     * @param value The number to compare.
     * @returns The sort order as negative, 0, or positive
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HNum>(value, Kind.Number)) {
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
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonNum | number {
        let val: HaysonNumVal;

        if (this.value === Number.POSITIVE_INFINITY) {
            val = POSITIVE_INFINITY_ZINC;
        } else if (this.value === Number.NEGATIVE_INFINITY) {
            val = NEGATIVE_INFINITY_ZINC;
        } else if (isNaN(this.value)) {
            val = NOT_A_NUMBER_ZINC;
        } else {
            val = this.value;
        }

        if (this.#unitSymbol) {
            return {
                _kind: this.getKind(),
                val,
                unit: this.#unitSymbol,
            };
        } else {
            if (typeof val === "string") {
                return {
                    _kind: this.getKind(),
                    val,
                };
            } else {
                return val;
            }
        }
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
    public newCopy(): HNum {
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
    public toList(): HList<HNum> {
        return HList.make(this);
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        return HDict.make(this);
    }

    /**
     * Add a number to this number.
     *
     * @param num The number to add.
     * @returns The new number.
     * @throws An error if the units are incompatible.
     */
    public plus(num: HNum): HNum {
        return HNum.make(
            this.value + num.value,
            this.checkPlusMinusUnit(num.unit, "+")
        );
    }

    /**
     * Subtract a number from this number.
     *
     * @param num The number to subtract.
     * @returns The new number.
     * @throws An error if the units are incompatible.
     */
    public minus(num: HNum): HNum {
        return HNum.make(
            this.value - num.value,
            this.checkPlusMinusUnit(num.unit, "-")
        );
    }

    private checkPlusMinusUnit(
        unit: HUnit | undefined,
        symbol: string
    ): HUnit | undefined {
        const thisUnit = this.unit;

        if (!thisUnit) {
            return unit;
        }
        if (!unit) {
            return thisUnit;
        }
        if (thisUnit.equals(unit)) {
            return thisUnit;
        }
        throw new Error(`Unit error: ${thisUnit} ${symbol} ${unit}`);
    }

    /**
     * Multiply this number by another.
     *
     * @param num The number to multiply by.
     * @returns The new number.
     * @throws An error if the units are incompatible.
     */
    public multiply(num: HNum): HNum {
        return HNum.make(
            this.value * num.value,
            this.checkMultiplyUnit(num.unit)
        );
    }

    private checkMultiplyUnit(unit: HUnit | undefined): HUnit | undefined {
        const thisUnit = this.unit;
        if (!thisUnit) {
            return unit;
        }
        if (!unit) {
            return thisUnit;
        }
        return thisUnit.multiply(unit);
    }

    /**
     * Divide this number by another.
     *
     * @param num The number to divide by.
     * @returns The new number.
     * @throws An error if the units are incompatible.
     */
    public divide(num: HNum): HNum {
        return HNum.make(
            this.value / num.value,
            this.checkDivideUnit(num.unit)
        );
    }

    private checkDivideUnit(unit: HUnit | undefined): HUnit | undefined {
        const thisUnit = this.unit;
        if (!thisUnit) {
            return unit;
        }
        if (!unit) {
            return thisUnit;
        }
        return thisUnit.divide(unit);
    }

    /**
     * Convert the number to another unit.
     *
     * Please note, the unit to convert to must be compatible
     * otherwise an error is thrown.
     *
     * If the current number does not have a unit then return a number
     * with the specified unit and value.
     *
     * @param unit The unit to convert too.
     * @returns The new number with the new unit.
     * @throws An error if the number can't be converted with the unit.
     */
    public convertTo(unit: HUnit): HNum {
        const thisUnit = this.unit;
        return HNum.make(
            thisUnit ? thisUnit.convertTo(this.value, unit) : this.value,
            unit
        );
    }
}
