/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/**
 * The unit dimension data.
 */
export interface UnitDimensionsData {
    kg: number;
    m: number;
    sec: number;
    K: number;
    A: number;
    mol: number;
    cd: number;
}

/**
 * A unit's dimension.
 *
 * https://fantom.org/doc/sys/Unit
 */
export class UnitDimensions {
    readonly kg: number;
    readonly m: number;
    readonly sec: number;
    readonly K: number;
    readonly A: number;
    readonly mol: number;
    readonly cd: number;

    public constructor({
        kg,
        m,
        sec,
        K,
        A,
        mol,
        cd,
    }: Partial<UnitDimensionsData>) {
        this.kg = kg ?? 0;
        this.m = m ?? 0;
        this.sec = sec ?? 0;
        this.K = K ?? 0;
        this.A = A ?? 0;
        this.mol = mol ?? 0;
        this.cd = cd ?? 0;
    }

    /**
     * Add this unit to another one and return the result.
     *
     * @param dim The dimension to add to this one.
     * @returns The new dimension.
     */
    public add(dim: UnitDimensions): UnitDimensions {
        return new UnitDimensions({
            kg: this.kg + dim.kg,
            m: this.m + dim.m,
            sec: this.sec + dim.sec,
            K: this.K + dim.K,
            A: this.A + dim.A,
            mol: this.mol + dim.mol,
            cd: this.cd + dim.cd,
        });
    }

    /**
     * Subtract the units from one another and return the result.
     *
     * @param dim The dimension to subtract from this one.
     * @returns The new dimension.
     */
    public subtract(dim: UnitDimensions): UnitDimensions {
        return new UnitDimensions({
            kg: this.kg - dim.kg,
            m: this.m - dim.m,
            sec: this.sec - dim.sec,
            K: this.K - dim.K,
            A: this.A - dim.A,
            mol: this.mol - dim.mol,
            cd: this.cd - dim.cd,
        });
    }

    /**
     * Dimension equality.
     *
     * @param dim The dimension to test for equality.
     * @returns True if the dimensions match.
     */
    public equals(dim?: UnitDimensions): boolean {
        if (!dim) {
            return false;
        }

        return (
            this.kg === dim.kg &&
            this.m === dim.m &&
            this.sec === dim.sec &&
            this.K === dim.K &&
            this.A === dim.A &&
            this.mol === dim.mol &&
            this.cd === dim.cd
        );
    }

    /**
     * @returns A JSON representation of the dimension.
     */
    public toJSON(): UnitDimensionsData {
        return {
            kg: this.kg,
            m: this.m,
            sec: this.sec,
            K: this.K,
            A: this.A,
            mol: this.mol,
            cd: this.cd,
        };
    }
}
