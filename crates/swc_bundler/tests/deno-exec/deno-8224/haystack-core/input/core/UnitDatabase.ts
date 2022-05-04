/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { memoize } from "../util/memoize";
import { HUnit } from "./HUnit";
import { UnitDimensions } from "./UnitDimensions";

/**
 * The central database where all units are registered and cached.
 */
export class UnitDatabase {
    /**
     * All units keyed by their ids.
     */
    readonly #byId = new Map<string, HUnit>();

    /**
     * All units organized by quantity.
     */
    readonly #quantities = new Map<string, Set<HUnit>>();

    /**
     * All the registered units.
     */
    readonly #units = new Set<HUnit>();

    /**
     * Define a unit within the database.
     *
     * @param unit The unit to define.
     */
    public define(unit: HUnit): void {
        for (const id of unit.ids) {
            this.#byId.set(id, unit);

            const quantity = unit.quantity;
            if (quantity) {
                let units = this.#quantities.get(quantity);
                if (!units) {
                    units = new Set();
                    this.#quantities.set(quantity, units);
                }
                units.add(unit);
            }
        }

        this.#units.add(unit);
    }

    /**
     * Get a unit via its id or undefined if it can't be found.
     *
     * @param id The unit's id.
     * @returns The unit or undefined.
     */
    public get(id: string): HUnit | undefined {
        return this.#byId.get(id);
    }

    /**
     * @returns All the registered units in the database.
     */
    public get units(): readonly HUnit[] {
        return Object.freeze([...this.#units.values()]);
    }

    /**
     * @returns A list of all the quantities.
     */
    public get quantities(): string[] {
        return [...this.#quantities.keys()];
    }

    /**
     * Returns all the units for the specified quantity.
     *
     * @param quanity The quantity to search for.
     * @returns An array of units.
     */
    public getUnitsForQuantity(quanity: string): readonly HUnit[] {
        const units = this.#quantities.get(quanity);
        return Object.freeze(units ? [...units.values()] : []);
    }

    /**
     * Return a unit that can be used when multiplying two numbers together.
     *
     * @param unit0 The first unit to multiply by.
     * @param unit1 The second unit to multiply by.
     * @return The unit to multiply by.
     * @throws An error if the units can't be multiplied.
     */
    public multiply(unit0: HUnit, unit1: HUnit): HUnit {
        // If either is dimensionless give up immediately.
        if (!unit0.dimensions || !unit1.dimensions) {
            throw new Error(
                `Cannot compute dimensionless ${unit0.name} * ${unit1.name}`
            );
        }

        // Compute dim/scale of a * b.
        const dim = unit0.dimensions.add(unit1.dimensions);

        const scale = unit0.scale * unit1.scale;

        // Find all matches.
        const matches = this.match(dim, scale);

        if (matches.length === 1) {
            return matches[0];
        }

        // Right how our technique for resolving multiple matches is lame.
        const expectedName = `${unit0.name}_${unit1.name}`;
        for (const match of matches) {
            if (match.name === expectedName) {
                return match;
            }
        }

        // For now just give up
        throw new Error(`Cannot match to db ${unit0.name} * ${unit1.name}`);
    }

    /**
     * Return a unit that can be used when dividing two numbers together.
     *
     * @param unit0 The first unit to divide by.
     * @param unit1 The second unit to divide by.
     * @return The unit to divide by.
     * @throws An error if the units can't be divided.
     */
    public divide(unit0: HUnit, unit1: HUnit): HUnit {
        // If either is dimensionless give up immediately.
        if (!unit0.dimensions || !unit1.dimensions) {
            throw new Error(
                `Cannot compute dimensionless ${unit0.name} / ${unit1.name}`
            );
        }

        // Compute dim/scale of a / b.
        const dim = unit0.dimensions.subtract(unit1.dimensions);

        const scale = unit0.scale / unit1.scale;

        // Find all matches.
        const matches = this.match(dim, scale);

        if (matches.length === 1) {
            return matches[0];
        }

        // Right how our technique for resolving multiple matches is lame.
        const expectedName = `${unit0.name}_${unit1.name}`;
        for (const match of matches) {
            if (match.name === expectedName) {
                return match;
            }
        }

        // For now just give up
        throw new Error(`Cannot match to db ${unit1.name} / ${unit1.name}`);
    }

    /**
     * Match the unit dimensions and scale against what's already registered
     * in the database.
     *
     * @param dim The dimension.
     * @param scale The scale.
     * @returns A list of matching units.
     */
    @memoize()
    private match(dim: UnitDimensions, scale: number): HUnit[] {
        const units: HUnit[] = [];

        for (const unit of this.#units) {
            if (
                unit.dimensions?.equals(dim) &&
                HUnit.isApproximate(unit.scale, scale)
            ) {
                units.push(unit);
            }
        }

        return units;
    }
}
