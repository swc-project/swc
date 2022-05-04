/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { UnitDatabase } from "./UnitDatabase";
import { UnitDimensions, UnitDimensionsData } from "./UnitDimensions";

/**
 * The module cached unit database.
 */
let db: UnitDatabase | undefined;

/**
 * @returns The unit database.
 */
function getDb(): UnitDatabase {
    // With two-way dependencies, it's always far safer to lazily create resources in TS/JS.
    return db ?? (db = new UnitDatabase());
}

/**
 * A unit's raw data.
 */
export interface UnitData {
    quantity?: string;
    ids: string[];
    dimensions?: Partial<UnitDimensionsData>;
    scale: number;
    offset: number;
}

/**
 * Returns true if the unit is for bytes.
 *
 * @param unit The unit test.
 * @returns True if the unit is for bytes.
 */
function isByteUnit(unit: HUnit): boolean {
    return (
        unit.name === "byte" ||
        unit.name === "kilobyte" ||
        unit.name === "megabyte" ||
        unit.name === "gigabyte" ||
        unit.name === "terabyte" ||
        unit.name === "petabyte"
    );
}

/**
 * A type guard for testing whether a value is an `HUnit`.
 *
 * @param value The value to test.
 * @returns True if the value is an `HUnit` instance.
 */
export function valueIsHUnit(value: unknown): value is HUnit {
    return !!(value as HUnit)?._isHUnit;
}

/**
 * A haystack unit.
 *
 * https://project-haystack.org/doc/Units
 */
export class HUnit {
    readonly #quantity?: string;
    readonly #ids: string[];
    readonly #dimensions?: UnitDimensions;
    readonly #scale: number;
    readonly #offset: number;

    /**
     * Used for a type guard check.
     */
    public readonly _isHUnit = true;

    public constructor({ quantity, ids, dimensions, scale, offset }: UnitData) {
        this.#quantity = quantity;
        this.#ids = ids;
        this.#dimensions = dimensions && new UnitDimensions(dimensions);
        this.#scale = scale;
        this.#offset = offset;
    }

    /**
     * Defines a unit in the database.
     *
     * @param data The unit instance or data.
     * @return The unit instance.
     * @throws An error if the unit is already registered.
     */
    public static define(data: UnitData | HUnit): HUnit {
        const unit = valueIsHUnit(data) ? data : new HUnit(data);
        getDb().define(unit);
        return unit;
    }

    /**
     * Return a unit from the database via its id or undefined if it can't be found.
     *
     * @param id The id of the unit to look up.
     * @returns The unit or undefined.
     */
    public static get(id: string): HUnit | undefined {
        return getDb().get(id);
    }

    /**
     * Clear the underlying unit database.
     */
    public static clearDatabase(): void {
        // Completely overwrite the database so we also
        // wipe out any memoization.
        db = undefined;
    }

    /**
     * Parse the database and return all of the units.
     *
     * @param text The text from `units.txt` to parse.
     * @returns All parsed units.
     */
    public static parseDatabase(text: string): UnitData[] {
        const units: UnitData[] = [];
        let lastQuantity = "";

        for (const line of text.split("\n")) {
            const quantity = this.parseQuantity(line);

            if (quantity) {
                lastQuantity = quantity;
            } else {
                const unit = this.parseUnit(line);

                if (unit) {
                    // Record the last quantity if we have one.
                    if (lastQuantity) {
                        unit.quantity = lastQuantity;
                    }
                    units.push(unit);
                }
            }
        }

        return units;
    }

    /**
     * Parse some text to see if contains some quantity information.
     * Return the quantity or undefined if it can't be found.
     *
     * @param text The text to parse.
     * @returns The quantity or undefined if it can't be found.
     */
    public static parseQuantity(text: string): string {
        const res = /^ *-- *([^(]+) */.exec(text);
        return ((res && res[1]) ?? "").trim();
    }

    /**
     * Parse a line from `units.txt` as follows...
     *
     * unit   := <ids> [";" <dim> [";" <scale> [";" <offset>]]]
     * names  := <ids> ("," <id>)*
     * id     := <idChar>*
     * idChar := 'a'-'z' | 'A'-'Z' | '_' | '%' | '/' | any char > 128
     * dim    := <ratio> ["*" <ratio>]*   // no whitespace allowed
     * ratio  := <base> <exp>
     * base   := "kg" | "m" | "sec" | "K" | "A" | "mol" | "cd"
     * exp    := <int>
     * scale  := <float>
     * offset := <float>
     *
     * @param text The text to parse.
     * @return The unit data or undefined if no unit data is found.
     * @throws An error if unit data is found but the format is invalid.
     */
    public static parseUnit(text: string): UnitData | undefined {
        const [, ids, dimensions, scale, offset] =
            /^ *([a-zA-Z][^;]*) *;? *([^;]+)? *;? *([^;]+)? *;? *([^;]+)?/.exec(
                text
            ) ?? [];

        if (!ids) {
            return undefined;
        }

        const data: UnitData = {
            ids: this.parseIds(ids),
            scale: 1,
            offset: 0,
        };

        if (dimensions) {
            data.dimensions = this.parseDimensions(dimensions);
        }

        if (scale) {
            data.scale = this.parseNumber(scale);
        }

        if (offset) {
            data.offset = this.parseNumber(offset);
        }

        return data;
    }

    private static parseIds(ids: string): string[] {
        return ids.split(",").map((id) => id.trim());
    }

    private static parseDimensions(
        dimensions: string
    ): UnitDimensions | undefined {
        const dimension: Partial<UnitDimensionsData> = {};

        dimensions.split("*").forEach((dim): void => {
            const [, ratio, val] =
                /^ *(kg|sec|mol|m|K|A|cd) *([-+]?\d+)/.exec(dim) ?? [];

            switch (ratio) {
                case "kg":
                    dimension.kg = Number(val);
                    break;
                case "sec":
                    dimension.sec = Number(val);
                    break;
                case "mol":
                    dimension.mol = Number(val);
                    break;
                case "m":
                    dimension.m = Number(val);
                    break;
                case "K":
                    dimension.K = Number(val);
                    break;
                case "A":
                    dimension.A = Number(val);
                    break;
                case "cd":
                    dimension.cd = Number(val);
                    break;
            }
        });

        return Object.keys(dimension).length
            ? new UnitDimensions(dimension)
            : undefined;
    }

    private static parseNumber(str: string): number {
        const num = Number(str.trim());

        if (isNaN(num) || typeof num !== "number") {
            throw new Error(`Unable to convert '${str}' to a number`);
        }

        return num;
    }

    /**
     * @returns The ids for the units.
     */
    public get ids(): string[] {
        return this.#ids;
    }

    /**
     * @returns The unit's name.
     */
    public get name(): string {
        return this.#ids[0] ?? "";
    }

    /**
     * @returns The unit's symbol.
     */
    public get symbol(): string {
        return this.#ids[this.#ids.length - 1] ?? "";
    }

    /**
     * @returns The unit's scale.
     */
    public get scale(): number {
        return this.#scale;
    }

    /**
     * @returns The unit's offset.
     */
    public get offset(): number {
        return this.#offset;
    }

    /**
     * @returns The unit's quantity or undefined if none available.
     */
    public get quantity(): string | undefined {
        return this.#quantity;
    }

    /**
     * @returns A list of all the quantities available.
     */
    public static get quantities(): string[] {
        return getDb().quantities;
    }

    /**
     * Return the units for the quantity.
     *
     * @param quanity The quantity to search for.
     * @returns An array of quantities. An empty array is returned
     * if the quantity can't be found.
     */
    public static getUnitsForQuantity(quanity: string): readonly HUnit[] {
        return getDb().getUnitsForQuantity(quanity);
    }

    /**
     * @returns All the registered units.
     */
    public static get units(): readonly HUnit[] {
        return getDb().units;
    }

    /**
     * @returns The unit's dimensions or undefined if dimensionless.
     */
    public get dimensions(): UnitDimensions | undefined {
        return this.#dimensions;
    }

    /**
     * Return a unit that can be used when multiplying two numbers together.
     *
     * @param unit The unit to multiply.
     * @return The unit to multiply by.
     * @throws An error if the units can't be multiplied.
     */
    public multiply(unit: HUnit): HUnit {
        return getDb().multiply(this, unit);
    }

    /**
     * Return a unit that can be used when dividing two numbers together.
     *
     * @param unit The unit to divide.
     * @return The unit to divide by.
     * @throws An error if the units can't be divided.
     */
    public divide(unit: HUnit): HUnit {
        return getDb().divide(this, unit);
    }

    /**
     * @returns The unit as a JSON object.
     */
    public toJSON(): UnitData {
        const data: UnitData = {
            ids: this.#ids,
            scale: this.#scale,
            offset: this.#offset,
        };

        if (this.#quantity) {
            data.quantity = this.#quantity;
        }

        if (this.#dimensions) {
            data.dimensions = this.#dimensions?.toJSON();
        }

        return data;
    }

    /**
     * Equality for units.
     *
     * @param unit The value to compare against.
     * @returns True if the units are equal.
     */
    public equals(unit?: HUnit): boolean {
        if (!unit) {
            return false;
        }

        // Don't take into account `quantity` as this used
        // merely for organization.

        if (this.ids.length !== unit.ids.length) {
            return false;
        }

        for (let i = 0; i < this.ids.length; ++i) {
            if (this.ids[i] !== unit.ids[i]) {
                return false;
            }
        }

        if (
            this.#dimensions
                ? !this.#dimensions.equals(unit.dimensions)
                : unit.dimensions
        ) {
            return false;
        }

        if (!HUnit.isApproximate(this.scale, unit.scale)) {
            return false;
        }

        if (this.offset !== unit.offset) {
            return false;
        }

        return true;
    }

    /**
     * @returns A string representation of a unit.
     */
    public toString(): string {
        return this.symbol;
    }

    /**
     * Dump the current state of the unit database to the console output.
     */
    public static inspectDb(): void {
        console.table(getDb().units.map((unit) => unit.toJSON()));
    }

    /**
     * Convert the unit to the new scalar.
     *
     * @param scalar The new scalar value.
     * @param to The new unit to convert too.
     * @returns The new scalar value.
     */
    public convertTo(scalar: number, to: HUnit): number {
        // Bytes have no dimension so handle as a special case.
        if (
            !(isByteUnit(this) && isByteUnit(to)) &&
            !this.#dimensions?.equals(to.dimensions)
        ) {
            throw new Error(`Inconvertible units: ${this} and ${to}`);
        }

        return (scalar * this.scale + this.offset - to.offset) / to.scale;
    }

    /**
     * Returns true if the two numbers approximately match.
     *
     * @param a The first number.
     * @param b The second number.
     * @returns True if the two numbers match.
     */
    public static isApproximate(a: number, b: number): boolean {
        if (a === b) {
            return true;
        }

        // Pretty loose with our approximation because the database
        // doesn't have super great resolution for some normalizations.
        const t = Math.min(Math.abs(a / 1e3), Math.abs(b / 1e3));
        return Math.abs(a - b) <= t;
    }
}
