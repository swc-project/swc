/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off" */

import {
    HVal,
    NOT_SUPPORTED_IN_FILTER_MSG,
    CANNOT_CHANGE_READONLY_VALUE,
    isHVal,
    valueIsKind,
    valueEquals,
    OptionalHVal,
    ZINC_NULL,
} from "./HVal";
import { HDict, DictStore, HValObj } from "./HDict";
import { Kind } from "./Kind";
import { HaysonGrid, HaysonDict } from "./hayson";
import { HStr } from "./HStr";
import { HFilter } from "../filter/HFilter";
import { Node, isNode } from "../filter/Node";
import { HList } from "./HList";
import { makeValue } from "./util";
import { HRef } from "./HRef";
import { EvalContext, EvalContextResolve } from "../filter/EvalContext";

/**
 * The default grid version number.
 */
export const DEFAULT_GRID_VERSION = "3.0";

/**
 * Returns the zinc for the meta data.
 *
 * @param meta The meta data dict.
 * @returns The zinc used for meta data in a grid.
 */
function toMetaZinc(meta: HDict): string {
    const zinc = meta.toZinc();

    // Remove the braces from the dict zinc encoding
    return zinc.substring(1, zinc.length - 1);
}

/**
 * A grid column.
 */
export class GridColumn {
    /**
     * Inner name of the column.
     */
    private $name: string;

    /**
     * Inner meta data for the column.
     */
    private $meta: HDict;

    /**
     * Constructs a new column.
     *
     * @param name The name of the column.
     * @param meta The column's meta data.
     */
    public constructor(name: string, meta?: HDict) {
        this.$name = name;
        this.$meta = meta || HDict.make();
    }

    /**
     * @returns The column's name.
     */
    public get name(): string {
        return this.$name;
    }

    public set name(name: string) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The column's meta data.
     */
    public get meta(): HDict {
        return this.$meta;
    }

    public set meta(meta: HDict) {
        throw new Error(CANNOT_CHANGE_READONLY_VALUE);
    }

    /**
     * @returns The display name for the column.
     */
    public get dis(): string {
        const dis = this.meta.get("dis");
        return (valueIsKind<HStr>(dis, Kind.Str) && dis.value) || this.name;
    }

    /**
     * @returns The display name for the column.
     */
    public get displayName(): string {
        return this.dis;
    }

    /**
     * Column equality check.
     *
     * @param column The column to test.
     * @returns True if the value is the same.
     */
    public equals(column: GridColumn): boolean {
        if (!isGridColumn(column)) {
            return false;
        }
        if (column.name !== this.$name) {
            return false;
        }
        if (!column.meta.equals(this.$meta)) {
            return false;
        }
        return true;
    }

    /**
     * Flag used to identify a grid column.
     */
    public readonly _isAGridColumn = true;
}

function isGridColumn(val: unknown): val is GridColumn {
    return !!(val && (val as GridColumn)._isAGridColumn);
}

/**
 * A dict store for a row in a grid.
 *
 * This is used as the backing store for a dict (row) held in a grid. The dict itself
 * requires a reference to its parent grid. It wraps the inner Dict used to store the actual
 * row data.
 *
 * When a grid is filtered, this inner dict is reused across grids to maximize memory usage.
 */
class GridRowDictStore<DictVal extends HDict> implements DictStore {
    /**
     * A reference to the outer grid instance.
     */
    private readonly $grid: HGrid;

    /**
     * The inner dict that holds the data.
     */
    private readonly $cells: DictVal;

    public constructor(grid: HGrid, cells: DictVal) {
        this.$grid = grid;
        this.$cells = cells;
    }

    public get(name: string): HVal | undefined | null {
        return this.$cells.get(name);
    }

    public set(name: string, value: OptionalHVal): void {
        // The column to the grid if it's missing.
        if (!this.$grid.hasColumn(name)) {
            this.$grid.addColumn(name);
        }

        this.$cells.set(name, value);
    }

    public remove(name: string): void {
        this.$cells.remove(name);
    }

    public clear(): void {
        this.$cells.clear();
    }

    public getKeys(): string[] {
        return this.$cells.keys;
    }

    public toObj(): HValObj {
        return this.$cells.toObj();
    }
}

/**
 * An iterator for dicts.
 */
export class GridDictIterator<DictVal extends HDict>
    implements Iterator<DictVal>
{
    private readonly $grid: HGrid;
    private $index = 0;

    public constructor(grid: HGrid) {
        this.$grid = grid;
    }

    public next(): IteratorResult<DictVal> {
        const dict = this.$grid.get(this.$index++);

        return {
            done: !dict,
            value: dict ? (dict as DictVal) : (HDict.make() as DictVal),
        };
    }
}

/**
 * Implements the storage for an HGrid.
 *
 * This separates the HGrid interface from the actual storage,
 * which could be backed by a native one
 */
class GridStore<DictVal extends HDict> {
    /**
     * The internal grid's meta data.
     */
    private $meta: HDict;

    /**
     * The internal grid's columns.
     */
    private $columns: GridColumn[];

    /**
     * An internal column index cache.
     *
     * This is used to increase the performance of column name look ups.
     */
    private $columnNameCache: { [prop: string]: number };

    /**
     * The internal cached rows.
     */
    private $rows: DictVal[];

    public constructor(meta: HDict, columns: GridColumn[], rows: DictVal[]) {
        this.$columnNameCache = {};

        this.$meta = meta;
        this.$columns = columns;
        this.$rows = rows;
        this.rebuildColumnCache();
    }

    /**
     * The stores's meta data.
     */
    public get meta(): HDict {
        return this.$meta;
    }

    /**
     * True if store has the column
     * @param name - the column name
     */
    public hasColumn(name: string): boolean {
        return this.$columnNameCache[name] !== undefined;
    }

    /**
     * The stores's columns.
     */
    public get columns(): GridColumn[] {
        return this.$columns;
    }

    /**
     * Sets a column for this store
     */
    public setColumn(index: number, column: GridColumn): void {
        this.$columns[index] = column;
        this.$columnNameCache[column.name] = index;
    }

    /**
     * Returns a store column via its name or index number. If it can't be found
     * then return undefined.
     */
    public getColumn(index: number | string): GridColumn | undefined {
        let column: GridColumn | undefined;
        if (typeof index === "number") {
            column = this.$columns[index as number];
        } else if (typeof index === "string") {
            const i = this.$columnNameCache[index];
            if (i !== undefined) {
                column = this.$columns[i];
            }
        } else {
            throw new Error("Invalid input");
        }
        return column;
    }

    public addColumn(name: string, meta: HDict | undefined): GridColumn {
        const index = this.$columnNameCache[name];

        const col = new GridColumn(name, meta || HDict.make());
        // If the column already exists then just update it.
        if (typeof index === "number") {
            this.setColumn(index, col);
            return col;
        } else {
            this.$columns.push(col);
            this.rebuildColumnCache();
            return col;
        }
    }

    /**
     * Reorder the columns with the specified new order of names.
     */
    public reorderColumns(colNames: string[]): void {
        this.$columns = this.$columns.sort((first, second): number => {
            let firstIndex = 0;
            let secondIndex = 0;
            for (let i = 0; i < colNames.length; ++i) {
                if (colNames[i] === first.name) {
                    firstIndex = i;
                }
                if (colNames[i] === second.name) {
                    secondIndex = i;
                }
            }

            return firstIndex - secondIndex;
        });

        this.rebuildColumnCache();
    }

    /**
     * Rebuilds the store's column cache
     */
    public rebuildColumnCache(): void {
        for (const key of Object.keys(this.$columnNameCache)) {
            delete this.$columnNameCache[key];
        }

        for (let i = 0; i < this.$columns.length; ++i) {
            this.$columnNameCache[this.$columns[i].name] = i;
        }
    }

    /**
     * Get the row by index
     * @param index the index of the row
     */
    public get(index: number): DictVal | undefined {
        return this.$rows[index];
    }

    /**
     * The store's rows.
     */
    public get rows(): DictVal[] {
        return this.$rows;
    }

    public size(): number {
        return this.$rows ? this.$rows.length : 0;
    }
}

export interface GridObj<DictVal extends HDict = HDict> {
    meta?: HDict;
    columns?: { name: string; meta?: HDict }[];
    rows?: DictVal[];
    version?: string;
}

/**
 * A haystack grid.
 *
 * ```typescript
 * const grid = new HGrid({
 *   columns: [
 *     {
 *       name: 'name'
 *     },
 *     {
 *       name: 'height'
 *     }
 *   ],
 *   // rows
 *   rows: [
 *     new HDict({ name: HStr.make('Mall'),  height: HNum.make(200, 'm') }),
 *     new HDict({ name: HStr.make('House'), height: HNum.make(30, 'm') })
 *   ]
 * })
 *
 * // The same grid can be specified without any rows. The columns will be dynamically
 * // generated based upon the row data...
 * const grid0 = new HGrid({
 *   rows: [
 *     new HDict({ name: HStr.make('Mall'),  height: HNum.make(200, 'm') }),
 *     new HDict({ name: HStr.make('House'), height: HNum.make(30, 'm') })
 *   ]
 * })
 *
 * // The same grid can be created from a Hayson object.
 * // Again columns don't have to be specified unless precise order and meta data is required...
 * const grid1 = new HGrid({
 *   rows: [
 *     { name: 'Mall', height: { _kind: 'number', val: 200, unit: 'm' } },
 *     { name: 'House', height: { _kind: 'number', val: 30, unit: 'm' } },
 *   ]
 * })
 *
 * // Iterate a grid
 * for (let dict of grid) {
 *   console.log(dict)
 * }
 *
 * // Filter a grid
 * const filteredGrid = grid.filter('name == "House"')
 * console.log(filteredGrid)
 *
 * // Test a grid
 * if (grid.has('name == "House"')) {
 *   console.log('Found house!')
 * }
 *
 * // Remove items from a grid
 * grid.remove('name == "Mall"')
 *
 * // Average, sum, max and min...
 * console.log(grid.avgOf('height'))
 * console.log(grid.sumOf('height'))
 * console.log(grid.maxOf('height'))
 * console.log(grid.minOf('height'))
 * ```
 */
export class HGrid<DictVal extends HDict = HDict>
    implements HVal, Iterable<DictVal>
{
    /**
     * The grid's version number.
     */
    public version: string;

    /**
     * The internal grid storage.
     */
    private readonly $store: GridStore<DictVal>;

    /**
     * Numerical index access.
     */
    [prop: number]: DictVal | undefined;

    /**
     * Constructs a new grid.
     *
     * ```typescript
     * const grid = new HGrid({
     *   columns: [
     *     {
     *       name: 'name'
     *     },
     *     {
     *       name: 'height'
     *     }
     *   ],
     *   // rows
     *   rows: [
     *     new HDict({ name: HStr.make('Mall'),  height: HNum.make(200, 'm') }),
     *     new HDict({ name: HStr.make('House'), height: HNum.make(30, 'm') })
     *   ]
     * })
     *
     * // The same grid can be specified without any rows. The columns will be dynamically
     * // generated based upon the row data...
     * const grid0 = new HGrid({
     *   rows: [
     *     new HDict({ name: HStr.make('Mall'),  height: HNum.make(200, 'm') }),
     *     new HDict({ name: HStr.make('House'), height: HNum.make(30, 'm') })
     *   ]
     * })
     *
     * // The same grid can be created from a Hayson object.
     * // Again columns don't have to be specified unless precise order and meta data is required...
     * const grid1 = new HGrid({
     *   rows: [
     *     { name: 'Mall', height: { _kind: 'number', val: 200, unit: 'm' } },
     *     { name: 'House', height: { _kind: 'number', val: 30, unit: 'm' } },
     *   ]
     * })
     *
     * // Pass in a haystack value to create a grid...
     * const grid3 = new HGrid(HNum.make(24)) // Creates a grid with one column called 'val' and one row.
     *
     * // Pass in an array of dicts to create a grid...
     * const grid4 = new HGrid([
     *   new HDict({ name: HStr.make('Mall'),  height: HNum.make(200, 'm') }),
     *   new HDict({ name: HStr.make('House'), height: HNum.make(30, 'm') })
     * ])
     *
     * // Pass in an array of Hayson dicts to create a grid...
     * const grid5 = new HGrid([
     *   { name: 'Mall', height: { _kind: 'number', val: 200, unit: 'm' } },
     *   { name: 'House', height: { _kind: 'number', val: 30, unit: 'm' } },
     * ])
     * ```
     *
     * @param value The values used to create a grid.
     * @param skipChecks This flag should be only used internally. If true then any error
     * checking on dicts is skipped. This is useful when we already know the dict being added
     * is valid.
     */
    public constructor(
        arg?: GridObj<DictVal> | HaysonGrid | HVal | (HaysonDict | DictVal)[],
        skipChecks = false
    ) {
        let meta: HDict | undefined;
        let columns: { name: string; meta?: HDict }[] | undefined;
        let rows: DictVal[] | HaysonDict[] | undefined;
        let version = DEFAULT_GRID_VERSION;

        const value = arg as
            | GridObj<DictVal>
            | HaysonGrid
            | HVal
            | (HaysonDict | DictVal)[]
            | undefined
            | null;

        if (value === undefined) {
            rows = [];
        } else if (isHVal(value) || value === null) {
            // Don't skip any column checks when we pass in haystack values
            // since we need the columns to be automatically generated for us.
            skipChecks = false;

            if (valueIsKind<HGrid<DictVal>>(value, Kind.Grid)) {
                meta = value.meta;
                columns = value.getColumns();
                rows = value.getRows();
                version = value.version;
            } else if (valueIsKind<HDict>(value, Kind.Dict)) {
                rows = [value] as DictVal[];
            } else {
                rows = [HDict.make({ val: value }) as DictVal];
            }
        } else if (Array.isArray(value)) {
            rows = value.map(
                (dict: HaysonDict | DictVal): DictVal =>
                    HDict.make(dict) as DictVal
            ) as DictVal[];
        } else {
            if (value.meta) {
                meta = makeValue(value.meta) as HDict;
            }

            if ((value as GridObj).columns) {
                columns = (value as GridObj).columns || [];
            } else if ((value as HaysonGrid).cols) {
                const obj = value as HaysonGrid;

                if (obj.cols) {
                    columns = obj.cols.map(
                        (
                            col
                        ): {
                            name: string;
                            meta?: HDict;
                        } => ({
                            name: col.name,
                            meta: col.meta
                                ? (makeValue(col.meta) as HDict)
                                : undefined,
                        })
                    );
                }
            }

            // Both HaysonGrid and GridObj share a rows iterator property.
            if ((value as GridObj).rows) {
                rows = (value as GridObj<DictVal>).rows || [];
            }

            if ((value as GridObj).version) {
                version =
                    (value as GridObj<DictVal>).version || DEFAULT_GRID_VERSION;
            }
        }

        meta = meta ?? HDict.make();
        columns = columns ?? [];
        rows = rows ?? [];

        for (let i = 0; i < rows.length; ++i) {
            rows[i] = makeValue(rows[i]) as DictVal;
        }

        this.version = version;

        this.$store = new GridStore(
            meta,
            columns.map(
                (column): GridColumn => new GridColumn(column.name, column.meta)
            ),
            skipChecks ? (rows as DictVal[]) : []
        );

        // If we're check each row then create the grid and add each dict.
        // Adding in this way enforces error checking on each row.
        if (!skipChecks) {
            for (const dict of rows) {
                this.add(makeValue(dict) as DictVal);
            }
        }

        return this.makeProxy();
    }

    /**
     * Implement proxy to make it easy to get and set internal values.
     */
    private makeProxy(): HGrid<DictVal> {
        const handler = {
            get: function (target: HGrid, prop: string): any {
                const anyTarget = target as any;
                return typeof prop === "string" && /^[0-9]+$/.test(prop)
                    ? target.get(Number(prop))
                    : (anyTarget[prop] as any);
            },
            set(target: HGrid, prop: string, value: any): boolean {
                const anyTarget = target as any;
                if (typeof prop === "string" && /^[0-9]+$/.test(prop)) {
                    target.set(Number(prop), value);
                } else {
                    anyTarget[prop] = value;
                }
                return true;
            },
        };
        return new Proxy(this, handler) as HGrid<DictVal>;
    }

    /**
     * Makes a new grid.
     *
     * @param value The values used to create a grid.
     * @param skipChecks This flag should be only used internally. If true then any error
     * checking on dicts is skipped. This is useful when we already know the dict being added
     * is valid.
     * @returns A grid.
     */
    public static make<DictVal extends HDict = HDict>(
        arg?: GridObj<DictVal> | HaysonGrid | HVal | (HaysonDict | DictVal)[],
        skipChecks = false
    ): HGrid<DictVal> {
        return valueIsKind<HGrid<DictVal>>(arg, Kind.Grid)
            ? arg
            : new HGrid(arg, skipChecks);
    }

    /**
     * The grid's meta data.
     */
    public get meta(): HDict {
        return this.$store.meta;
    }

    /**
     * @returns The value's kind.
     */
    public getKind(): Kind {
        return Kind.Grid;
    }

    /**
     * Compares the value's kind.
     *
     * @param kind The kind to compare against.
     * @returns True if the kind matches.
     */
    public isKind(kind: Kind): boolean {
        return valueIsKind<HGrid>(this, kind);
    }

    /**
     * @returns A JSON reprentation of the object.
     */
    public toJSON(): HaysonGrid {
        const rows = this.getRows().map((row: DictVal): HaysonDict => {
            this.addMissingColumns(row);
            return row.toJSON();
        });

        return {
            _kind: this.getKind(),
            meta: {
                ver: this.version,
                ...(this.meta ? this.meta.toJSON() : {}),
            },
            cols: this.$store.columns.map(
                (
                    column: GridColumn
                ): {
                    name: string;
                    meta: HaysonDict;
                } => ({
                    name: column.name,
                    meta: column.meta.toJSON(),
                })
            ),
            rows,
        };
    }

    /**
     * Encodes to an encoded zinc value that can be used
     * in a haystack filter string.
     *
     * A grid isn't supported in filter so throw an error.
     *
     * @returns The encoded value that can be used in a haystack filter.
     */
    public toFilter(): string {
        throw new Error(NOT_SUPPORTED_IN_FILTER_MSG);
    }

    /**
     * Encodes to an encoding zinc value.
     *
     * @param nested An optional flag used to indiciate whether the
     * value being encoded is nested.
     * @returns The encoded zinc string.
     */
    public toZinc(nested?: boolean): string {
        // Check whether we need to add any missing columns. We need to do this
        // as a developer could have adding a new dict to the grid's internal rows array.
        // Therefore we need lazily make sure we have all the correct columns in place for
        // the grid to be valid.
        const rows = this.getRows();
        rows.forEach((dict: DictVal): void => this.addMissingColumns(dict));

        let zinc = nested ? "<<\n" : "";

        // Header and version
        zinc += `ver:${HStr.make(this.version).toZinc()}`;

        // Meta
        const metaZinc = toMetaZinc(this.meta);
        if (metaZinc) {
            zinc += ` ${metaZinc}`;
        }
        zinc += "\n";

        // Columns
        if (!rows.length && !this.$store.columns.length) {
            zinc += "empty\n";
        } else {
            zinc +=
                this.$store.columns
                    .map((col: GridColumn): string => {
                        let colZinc = col.name;

                        const metaZinc = toMetaZinc(col.meta);
                        if (metaZinc) {
                            colZinc += ` ${metaZinc}`;
                        }
                        return colZinc;
                    })
                    .join(",") + "\n";
        }

        // Rows
        zinc +=
            rows
                .map((row: DictVal): string =>
                    this.$store.columns
                        .map((col, index: number): string => {
                            const val = row.get(col.name);
                            return (
                                (index > 0 ? "," : "") +
                                (val === undefined
                                    ? ""
                                    : val?.toZinc(/*nested*/ true) ?? ZINC_NULL)
                            );
                        })
                        .join("")
                )
                .join("\n") + "\n";

        if (nested) {
            // Footer
            zinc += ">>";
        }

        return zinc;
    }

    /**
     * @returns An Axon encoded string.
     */
    public toAxon(): string {
        let axon = `${HList.make(this.getRows()).toAxon()}.toGrid`;

        if (!this.meta.isEmpty()) {
            axon += `.addMeta(${this.meta.toAxon()})`;
        }

        return axon;
    }

    /**
     * Grid equality check.
     *
     * @param value The value to test.
     * @returns True if the value is the same.
     */
    public equals(value: unknown): boolean {
        if (!valueIsKind<HGrid>(value, Kind.Grid)) {
            return false;
        }

        if (this.version !== value.version) {
            return false;
        }

        if (!this.meta.equals(value.meta)) {
            return false;
        }

        if (this.$store.columns.length !== value.$store.columns.length) {
            return false;
        }

        for (let i = 0; i < this.$store.columns.length; ++i) {
            if (!this.$store.columns[i].equals(value.$store.columns[i])) {
                return false;
            }
        }

        if (this.length !== value.length) {
            return false;
        }

        for (let i = 0; i < this.length; ++i) {
            const row0 = this.get(i);
            const row1 = value.get(i);

            if (!row0?.equals(row1)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compares two grids.
     *
     * @param value The value to compare against.
     * @returns The sort order as negative, 0, or positive.
     */
    public compareTo(value: unknown): number {
        if (!valueIsKind<HGrid>(value, Kind.Grid)) {
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
     * Return all the rows of the grid.
     *
     * ```typescript
     * const anArrayOfDicts = grid.getRows()
     * ```
     *
     * @returns All rows in the grid.
     */
    public getRows(): DictVal[] {
        return this.$store.rows;
    }

    /**
     * Return a row or undefined if it can't find it via its
     * row number.
     *
     * ```typescript
     * // Get a dict at a given index or returned undefined if it can't be found.
     * const dict = grid.get(0)
     * if (dict) {
     *   // Do something
     * }
     * ```
     *
     * @param index The index number of the row.
     * @returns The dict or undefined if it does not exist.
     */
    public get(index: number): DictVal | undefined {
        this.checkRowIndexNum(index);
        return this.$store.get(index);
    }

    /**
     * Return the first row in the grid or undefined if it can't be found.
     *
     * ```typescript
     * const dict = grid.first
     * if (dict) {
     *   // Do something
     * }
     * ```
     *
     * @returns The dict or undefined if it does not exist.
     */
    public get first(): DictVal | undefined {
        return this.get(0);
    }

    /**
     * Return the last row in the grid or undefined if it can't be found.
     *
     * ```typescript
     * const dict = grid.last
     * if (dict) {
     *   // Do something
     * }
     * ```
     *
     * @returns The dict or undefined if it does not exist.
     */
    public get last(): DictVal | undefined {
        return this.get(Math.max(0, this.length - 1));
    }

    /**
     * Remove the row from the grid via its index number of a haystack filter.
     *
     * ```typescript
     * // Remove a row via its index
     * grid.remove(0)
     *
     * // Remove multiple rows via a Haystack Filter
     * grid.remove('foo == "baa"')
     * ```
     *
     * @param filter A haystack filter, index number or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns The rows that were removed. If no rows were removed then the is empty.
     */
    public remove(
        filter: number | string | Node,
        cx?: Partial<EvalContext>
    ): DictVal[] {
        let removed: DictVal[];

        if (typeof filter === "string" || isNode(filter)) {
            removed = [];
            const toRemove: number[] = [];

            this.runFilter(
                filter as string,
                (match: boolean, row: DictVal, index: number): boolean => {
                    if (match) {
                        toRemove.push(index);
                        removed.push(row);
                    }

                    // Keep iterating.
                    return true;
                },
                cx
            );

            for (let i = toRemove.length - 1; i >= 0; --i) {
                this.getRows().splice(toRemove[i], 1);
            }
        } else {
            const index = filter as number;

            this.checkRowIndexNum(index);

            removed = this.getRows().splice(index, 1);
        }

        return removed;
    }

    /**
     * Filter the grid with the haystack filter and return a new grid with the results.
     *
     * ```typescript
     * // Filter a grid with a haystack filter
     * const newGridWithFoo = grid.filter('foo')
     *
     * // Filter a grid with a function callback
     * const newGridWithFooAgain = grid.filter((row: HDict): boolean => row.has('foo'))
     * ```
     *
     * @param filter The haystack filter, AST node or filter function callback.
     * @param cx Optional haystack filter evaluation context.
     * @returns A new filtered grid.
     */
    public filter(
        filter: string | Node | ((row: DictVal, index: number) => boolean),
        cx?: Partial<EvalContext>
    ): HGrid<DictVal> {
        const grid = HGrid.make<DictVal>({
            meta: this.meta,
            rows: [],
            version: this.version,
        });

        if (typeof filter === "function") {
            for (const row of this.getRows().filter(filter)) {
                grid.add(row);
            }
        } else {
            this.runFilter(
                filter,
                (match: boolean, row: DictVal): boolean => {
                    if (match) {
                        grid.add(row);
                    }

                    // Keep iterating.
                    return true;
                },
                cx
            );
        }

        this.syncColumnMeta(grid);
        return grid;
    }

    /**
     * Synchronize column meta information from this grid to the specified grid.
     *
     * @param grid The grid to synchronize data to.
     */
    private syncColumnMeta(grid: HGrid): void {
        for (const col of this.getColumns()) {
            const newCol = grid.getColumn(col.name);

            if (newCol && !newCol.meta.equals(col.meta)) {
                newCol.meta.clear();
                newCol.meta.update(col.meta);
            }
        }
    }

    /**
     * Filters an individual column in a grid.
     *
     * For example, if a particular column in a grid holds a list.
     * The inner filter can be run against all of the list values
     * held in that column.
     *
     * The filter can be run against a list, dict or grid.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { list: [ 'foo', 'boo', 'goo' ] },
     *     { list: [ 'foo', 'boo1', 'goo1' ] },
     *     { list: [ 'doo', 'boo1', 'goo1' ] },
     *   ]
     * })
     *
     * // Returns a grid with only the first two rows.
     * const newGrid = grid.filterBy('list', 'item == "foo"')
     * ```
     *
     * @param name The name of the column that holds the list values.
     * @param innerFilter The haystack filter to run against the list.
     * @param cx Optional haystack filter evaluation context.
     * @returns A filtered grid.
     */
    public filterBy(
        name: string,
        innerFilter: string | Node,
        cx?: Partial<EvalContext>
    ): HGrid<DictVal> {
        // Parse the AST node so we don't need to reparse it each time.
        const node =
            typeof innerFilter === "string"
                ? HFilter.parse(innerFilter)
                : innerFilter;

        cx = {
            namespace: cx?.namespace,
            resolve: this.makeResolveFunc(),
        };

        return this.filter((row: DictVal): boolean => {
            const val = row.get(name);

            if (
                valueIsKind<HList>(val, Kind.List) ||
                valueIsKind<HGrid>(val, Kind.Grid)
            ) {
                return val.any(node, cx);
            } else if (valueIsKind<HDict>(val, Kind.Dict)) {
                return val.matches(node, cx);
            } else {
                return false;
            }
        });
    }

    /**
     * Provide a grid with unique values in the specified columns.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     * 	   { id: 1, name: 'Jason' },
     * 	   { id: 2, name: 'Gareth' },
     * 	   { id: 3, name: 'Gareth' },
     *   ]
     * })
     *
     * // Returns a new grid with rows 1 and 2.
     * const uniqueGrid = grid.unique('name')
     * ```
     *
     * @param names The column names.
     * @returns The filtered grid instance.
     */
    public uniqueBy(names: string | string[]): HGrid<DictVal> {
        const uniqueNames = Array.isArray(names) ? names : [names];

        const grid = HGrid.make<DictVal>({
            meta: this.meta,
            rows: [],
            version: this.version,
        });

        let rows = this.getRows();

        // First filter out any rows that don't have any data.
        rows = rows.filter((dict: DictVal): boolean => {
            for (const name of uniqueNames) {
                if (!dict.has(name)) {
                    return false;
                }
            }

            return true;
        });

        // Filter unique data.
        rows = rows.filter((dict: DictVal, index: number): boolean => {
            // For each row identify if there are other rows that have the same
            // value but a different index.
            // The test passes if there are no other rows with the same values.

            for (let i = 0; i < index; ++i) {
                let duplicates = 0;

                for (const name of uniqueNames) {
                    const val0 = dict.get(name);
                    const val1 = rows[i].get(name);

                    if (valueEquals(val0, val1)) {
                        ++duplicates;
                    } else {
                        break;
                    }
                }

                // If all the rows are duplicates then exclude this result.
                if (duplicates === uniqueNames.length) {
                    return false;
                }
            }

            return true;
        });

        // Add all the newly filtered rows to the grid.
        if (rows.length) {
            grid.add(rows as DictVal[]);
            this.syncColumnMeta(grid);
        }

        return grid;
    }

    /**
     * Return true if the filter matches at least one row.
     *
     * ```typescript
     * if (grid.any('site')) {
     *   // The grid has some sites.
     * }
     * ```
     *
     * @param filter The haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns true if there's at least one match
     */
    public any(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        let result = false;
        this.runFilter(
            filter,
            (match: boolean): boolean => {
                if (match) {
                    result = true;

                    // Stop iterating since we have one match.
                    return false;
                }

                // Keep iterating.
                return true;
            },
            cx
        );
        return result;
    }

    /**
     * Returns true if the haystack filter matches the value.
     *
     * This is the same as the `any` method.
     *
     * ```typescript
     * if (grid.matches('site')) {
     *   // The grid has some sites.
     * }
     * ```
     *
     * @param filter The filter to test.
     * @param cx Optional haystack filter evaluation context.
     * @returns True if the filter matches ok.
     */
    public matches(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        return this.any(filter, cx);
    }

    /**
     * Return true if the filter matches at least one cell
     * in a particular column in the grid.
     *
     * This filter runs on the data held in the particular column.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { list: [ 'foo', 'boo', 'goo' ] },
     *     { list: [ 'foo', 'boo1', 'goo1' ] },
     *     { list: [ 'doo', 'boo1', 'goo1' ] },
     *   ]
     * })
     *
     * if (grid.anyBy('list', 'item === "foo"')) {
     *   // One or more of the items in the list contains 'foo'
     * }
     * ```
     *
     * @param filter The haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns true if there's at least one match
     */
    public anyBy(
        name: string,
        innerFilter: string | Node,
        cx?: Partial<EvalContext>
    ): boolean {
        // Parse the AST node so we don't need to reparse it each time.
        const node =
            typeof innerFilter === "string"
                ? HFilter.parse(innerFilter)
                : innerFilter;

        cx = {
            namespace: cx?.namespace,
            resolve: this.makeResolveFunc(),
        };

        for (const row of this) {
            const val = row.get(name);

            if (
                valueIsKind<HList>(val, Kind.List) ||
                valueIsKind<HGrid>(val, Kind.Grid)
            ) {
                if (val.any(node, cx)) {
                    return true;
                }
            } else if (valueIsKind<HDict>(val, Kind.Dict)) {
                if (val.matches(node, cx)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Return true if the filter matches at least one row.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { name: 'Fred' },
     *     { name: 'Fred' },
     *     { name: 'Fred' },
     *   ]
     * })
     *
     * if (grid.all('name == "Fred")) {
     *   // All rows in the grid have the name Fred.
     * }
     * ```
     *
     * @param filter The haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns true if there's at least one match
     */
    public all(filter: string | Node, cx?: Partial<EvalContext>): boolean {
        if (this.isEmpty()) {
            return false;
        }

        let result = true;
        this.runFilter(
            filter,
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

        return result;
    }

    /**
     * Return true if the filter matches all the values
     * in a particular column in the grid.
     *
     * This filter runs on the data held in the particular column.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { list: [ 'foo', 'foo', 'foo' ] },
     *     { list: [ 'foo', 'foo', 'foo' ] },
     *     { list: [ 'foo', 'foo', 'foo' ] },
     *   ]
     * })
     *
     * if (grid.allBy('list', 'item == "foo"')) {
     *   // True if all the lists contain all foos.
     * }
     * ```
     *
     * @param filter The haystack filter or AST node.
     * @param cx Optional haystack filter evaluation context.
     * @returns true if there's at least one match
     */
    public allBy(
        name: string,
        innerFilter: string | Node,
        cx?: Partial<EvalContext>
    ): boolean {
        // Parse the AST node so we don't need to reparse it each time.
        const node =
            typeof innerFilter === "string"
                ? HFilter.parse(innerFilter)
                : innerFilter;

        if (this.isEmpty()) {
            return false;
        }

        cx = {
            namespace: cx?.namespace,
            resolve: this.makeResolveFunc(),
        };

        for (const row of this) {
            const val = row.get(name);

            if (
                valueIsKind<HList>(val, Kind.List) ||
                valueIsKind<HGrid>(val, Kind.Grid)
            ) {
                if (!val.all(node, cx)) {
                    return false;
                }
            } else if (valueIsKind<HDict>(val, Kind.Dict)) {
                if (val.matches(node, cx)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * Run the filter. For each match invoke the callback function.
     *
     * The callback takes a match flag, a row and an index argument. If false is returned
     * the filter stops running.
     *
     * @param filter The haystack filter to run or an AST node.
     * @param callback The callback invoked for each match.
     * @param cx Optional haystack filter evaluation context.
     */
    private runFilter(
        filter: string | Node,
        callback: (match: boolean, row: DictVal, index: number) => boolean,
        cx: Partial<EvalContext> | undefined
    ): void {
        const hfilter = new HFilter(filter);

        const context = {
            dict: HDict.make(),
            resolve: this.makeResolveFunc(),
            namespace: cx?.namespace,
        };

        // Use iterator so we don't have to drain all the rows.
        let i = 0;
        for (const dict of this) {
            context.dict = dict;

            // Run the filter against the row.
            // If the callback returns false then stop the filtering.
            if (!callback(hfilter.eval(context), dict, i++)) {
                break;
            }
        }
    }

    /**
     * Return a function that when called will search for a
     * dict (record) via its id.
     *
     * The method lazily optimizes the request by indexing the grid's id.
     *
     * @returns  The evaluation context resolve method for a grid.
     */
    private makeResolveFunc(): EvalContextResolve {
        let ids: Map<string, HDict>;
        return (ref: HRef): HDict | undefined => {
            // Lazily build up a map of id refs to records in this grid.
            if (!ids) {
                ids = new Map();

                if (this.hasColumn("id")) {
                    for (const row of this) {
                        const id = row.get("id");

                        if (valueIsKind<HRef>(id, Kind.Ref)) {
                            ids.set(id.value, row);
                        }
                    }
                }
            }

            return ids.get(ref.value);
        };
    }

    /**
     * A mapping function that maps from an array of dicts into something else.
     *
     * ```typescript
     * // Map each row to a div using React...
     * grid.map((dict: HDict) => <div>{dict.toZinc()}</div>>)
     * ```
     *
     * @param callback A mapping callback that takes a row dict, an index number
     * and returns a new value.
     */
    public map<U>(callback: (row: DictVal, index: number) => U): U[] {
        return this.getRows().map(callback);
    }

    /**
     * Reduce the rows in a grid.
     *
     * ```typescript
     * // Reduce the grid down to one row...
     * grid = HGrid.make({
     *   rows: [
     *     { a: 1, b: 2 },
     *     { a: 3, b: 4 },
     *   ],
     * })
     *
     * grid.reduce((prev, cur): HGrid => {
     *   const dict = prev.get(0)
     *
     *   if (dict) {
     *     dict.set('a', Number(cur.get<HNum>('a')?.value) + Number(dict.get<HNum>('a')?.value))
     *     dict.set('b', Number(cur.get<HNum>('b')?.value) + Number(dict.get<HNum>('b')?.value))
     *   }
     *
     *   return prev
     *}, HGrid.make({ rows: [{ a: 0, b: 0 }] }))
     * ```
     *
     * @param callback The reducer callback. This method will be called with the previous and
     * current rows (dicts) as well as the index number.
     * @param initialValue Optional initial value for the reduce.
     */
    public reduce<U = DictVal>(
        callback: (
            prev: U,
            current: DictVal,
            currentIndex: number,
            array: DictVal[]
        ) => U,
        initialValue?: U
    ): U {
        return initialValue === undefined
            ? (this.getRows().reduce(callback as any) as any)
            : this.getRows().reduce(callback, initialValue);
    }

    /**
     * ```typescript
     * // The number of rows in a grid.
     * console.log(grid.length)
     * ```
     *
     * @returns The total number of rows.
     */
    public get length(): number {
        return this.$store.size();
    }

    /**
     * Set the values or dict for an individual row.
     *
     * ```typescript
     * // Set a row in a grid.
     * grid.set(0, new HDict({ foo: HStr.make('foobar') }))
     *
     * // Set a row via Hayson.
     * grid.set(0, { foo: 'foobar' })
     * ```
     *
     * @param index The index number of the row.
     * @param values The dict or Hayson Dict.
     * @returns The grid instance.
     * @throws An error if the index is invalid or the number of rows incorrect.
     */
    public set(index: number, values: DictVal | HaysonDict): this {
        const dict = makeValue(values) as DictVal;

        if (!dict.isKind(Kind.Dict)) {
            throw new Error("Invalid value");
        }

        this.checkRowIndexNum(index);
        const row = this.makeRowDictFromValues(dict);

        this.addMissingColumns(dict);

        this.getRows()[index] = row;
        return this;
    }

    /**
     * Adds any missing columns for the dict.
     *
     * @param dict The dict to check.
     */
    private addMissingColumns(dict: DictVal): void {
        // Add any missing columns.
        for (const key of dict.keys) {
            if (!this.hasColumn(key)) {
                this.addColumn(key);
            }
        }
    }

    /**
     * Add a single or multiple rows using dicts.
     *
     * This method can be called in different ways to add multiple rows at a time.
     *
     * ```typescript
     * // Add a single dict.
     * grid.add(new HDict({ foo: HStr.make('bar') }))
     *
     * // Add multiple dicts.
     * grid.add(new HDict({ foo: HStr.make('bar') }), new HDict({ foo: HStr.make('bar') }))
     *
     * // Add multiple dicts using an array...
     * grid.add([new HDict({ foo: HStr.make('bar') }), new HDict({ foo: HStr.make('bar') })])
     *
     * // Same but using Hayson...
     * grid.add({ foo: 'bar' }))
     * grid.add({ foo: 'bar' }), { foo: 'bar' })
     * grid.add([{ foo: 'bar' }), { foo: 'bar' }])
     * ```
     * @param rows The rows to add.
     * @returns The grid instance.
     * @throws If the values being added are not dicts.
     */
    public add(
        ...rows: (DictVal[] | HaysonDict[] | DictVal | HaysonDict)[]
    ): this {
        const toAdd = HGrid.toDicts(rows);

        if (!toAdd.length) {
            throw new Error("No dicts to add to grid");
        }

        for (let row of toAdd) {
            row = makeValue(row) as DictVal;

            if (!valueIsKind<HDict>(row, Kind.Dict)) {
                throw new Error("Row is not a dict");
            }

            const dict = this.makeRowDictFromValues(row);

            this.addMissingColumns(dict);

            this.getRows().push(dict);
        }

        return this;
    }

    /**
     * Insert rows as dicts at the specified index.
     *
     * ```typescript
     * // Insert a single dict.
     * grid.insert(1, new HDict({ foo: HStr.make('bar') }))
     *
     * // Insert multiple dicts.
     * grid.insert(1, new HDict({ foo: HStr.make('bar') }), new HDict({ foo: HStr.make('bar') }))
     *
     * // Insert multiple dicts using an array...
     * grid.insert(1, [new HDict({ foo: HStr.make('bar') }), new HDict({ foo: HStr.make('bar') })])
     *
     * // Same but using Hayson...
     * grid.insert(1, { foo: 'bar' }))
     * grid.insert(1, { foo: 'bar' }), { foo: 'bar' })
     * grid.insert(1, [{ foo: 'bar' }), { foo: 'bar' }])
     * ```
     *
     * @param index The index number to insert the rows at.
     * @param rows The rows to insert.
     * @returns The grid instance.
     * @throws An error if the index is invalid or the rows are not dicts.
     */
    public insert(
        index: number,
        ...rows: (DictVal[] | HaysonDict[] | DictVal | HaysonDict)[]
    ): this {
        const toInsert = HGrid.toDicts(rows);

        if (!toInsert.length) {
            throw new Error("No dicts to insert into grid");
        }

        if (index < 0) {
            throw new Error("Index cannot be less than zero");
        }

        if (index > this.length) {
            throw new Error("Index not in range");
        }

        for (let row of toInsert) {
            row = makeValue(row) as DictVal;

            if (!valueIsKind<HDict>(row, Kind.Dict)) {
                throw new Error("Row is not a dict");
            }

            const dict = this.makeRowDictFromValues(row);

            this.addMissingColumns(dict);

            // Insert into the array
            this.getRows().splice(index++, 0, dict);
        }

        return this;
    }

    /**
     * Sort the grid in ascending order via a column name. This also
     * supports sorting via multiple column names.
     *
     * Precedence is given to the first columns in the table.
     *
     * ```typescript
     * // Sorts the grid in ascending order by 'foo'
     * grid.sortBy('foo')
     *
     * // Sorts the grid in ascending order by 'foo' and then by 'boo'
     * grid.sortBy(['foo', 'boo'])
     * ```
     *
     * @param names The name of the column to sort by.
     * @returns The grid instance.
     */
    public sortBy(names: string | string[]): this {
        const sortNames = Array.isArray(names) ? names : [names];

        if (sortNames.length) {
            this.getRows().sort((first: DictVal, second: DictVal): number => {
                for (const name of sortNames) {
                    const firstVal = first.get(name);
                    const secondVal = second.get(name);

                    if (firstVal && secondVal) {
                        const res = firstVal.compareTo(secondVal);

                        if (res !== 0) {
                            return res;
                        }
                    }
                }

                return -1;
            });
        }

        return this;
    }

    /**
     * Reverses the order of all the rows in the grid.
     *
     * ```typescript
     * // Sort the grid in descending order by foo
     * grid.sortBy('foo').reverse()
     * ```
     */
    public reverse(): void {
        this.getRows().reverse();
    }

    /**
     * Returns a flattened array of dicts.
     *
     * @param rows The rows to flatten into an array of dicts.
     * @returns An array of dicts.
     */
    private static toDicts<DictVal extends HDict>(
        rows: (DictVal[] | HaysonDict[] | DictVal | HaysonDict)[]
    ): DictVal[] {
        const dicts: DictVal[] = [];

        for (const row of rows) {
            if (Array.isArray(row)) {
                for (const innerRow of row) {
                    dicts.push(makeValue(innerRow) as DictVal);
                }
            } else {
                dicts.push(makeValue(row) as DictVal);
            }
        }

        return dicts;
    }

    /**
     * Make a dict that can be used as a row in a dict.
     *
     * @param dict The dict to insert as a row into the grid.
     * @returns The row dict.
     */
    private makeRowDictFromValues(dict: DictVal): DictVal {
        const store = new GridRowDictStore(this, dict);
        return HDict.makeFromStore(store) as DictVal;
    }

    /**
     * ```typescript
     * // Create a grid with no rows (still retains column and meta).
     * grid.clear()
     * ```
     *
     * Clear all the rows from the grid.
     */
    public clear(): void {
        this.getRows().splice(0, this.length);
    }

    /**
     * Return an array of column information.
     *
     * ```typescript
     * // Return an array of column objects.
     * const cols = grid.getColumns()
     * ```
     *
     * @returns A copy of the grid's columns.
     */
    public getColumns(): GridColumn[] {
        return [...this.$store.columns];
    }

    /**
     * Return the column names (not display names).
     *
     * @returns The column names.
     */
    public getColumnNames(): string[] {
        return this.$store.columns.map((col: GridColumn): string => col.name);
    }

    /**
     * Add a column and return its new instance.
     *
     * If the column is already available then update it.
     *
     * ```typescript
     * grid.addColumn('Address', new HDict({ length: 30 }))
     * ```
     *
     * @param name The name of the column.
     * @param meta The column's meta data.
     * @returns The new column or the one already found.
     */
    public addColumn(name: string, meta?: HDict): GridColumn {
        return this.$store.addColumn(name, meta);
    }

    /**
     * Does the grid have the specified column?
     *
     * ```typescript
     * if (grid.hasColumn('Address)) {
     *   // The grid has a column called address.
     * }
     * ```
     *
     * @param name The name of the column.
     * @returns True if the grid has the column.
     */
    public hasColumn(name: string): boolean {
        return this.$store.hasColumn(name);
    }

    /**
     * Set the column at the specified index number.
     *
     * ```typescript
     * // Set the column at the specified index with the new name and length.
     * grid.setColumn(3, 'Address', new HDict({ length: 30 }))
     * ```
     *
     * @param index The zero based index number of the column.
     * @param name The name of the column.
     * @param meta Optional column's meta data.
     * @returns The updated column.
     * @throws An error if index does not exist in the columns.
     */
    public setColumn(index: number, name: string, meta?: HDict): GridColumn {
        if (!this.$store.columns[index]) {
            throw new Error("Cannot set an invalid column");
        }

        const col = new GridColumn(name, meta || HDict.make());
        this.$store.setColumn(index, col);
        return col;
    }

    /**
     * Returns a grid column via its name or index number. If it can't be found
     * then return undefined.
     *
     * ```typescript
     * // Get the column at the specified index or return undefined
     * const col = grid.getColumn('Address')
     * if (col) {
     *   // Do something
     * }
     *
     * // Alternatively use the column index to get the column
     * const col1 = grid.getColumn(3)
     * if (col1) {
     *   // Do something
     * }
     * ```
     *
     * @param index The column index number or name.
     * @returns The column or undefined if not found.
     */
    public getColumn(index: number | string): GridColumn | undefined {
        return this.$store.getColumn(index);
    }

    /**
     * Returns the number of columns.
     *
     * ```typescript
     * console.log('The table has this many columns: ' + grid.getColumnsLength())
     * ```
     *
     * @returns The number of columns.
     */
    public getColumnsLength(): number {
        return this.$store.columns.length;
    }

    /**
     * Reorder the columns with the specified new order of names.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   columns: [
     *     { name: 'b' },
     *     { name: 'c' },
     *     { name: 'a' },
     *   ]
     * })
     *
     * // Reorder the columns to be a, b and then c.
     * grid.reorderColumns([ 'a', 'b', 'c' ])
     * ```
     *
     * @param names The new order of column names to use.
     */
    public reorderColumns(names: string | string[]): void {
        const colNames = Array.isArray(names) ? names : [names];

        this.$store.reorderColumns(colNames);
    }

    /**
     * Return a haystack list for all the values in
     * the specified column.
     *
     * If the column can't be found then an empty list is returned.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { name: 'Gareth', id: 1 },
     *     { name: 'Jason', id: 2 },
     *     { name: 'Radu', id: 3 },
     *   ]
     * })
     *
     * // Returns an HList<HStr> of the names (Gareth, Jason and Radu).
     * const listOfNames = grid.listBy<HStr>('name')
     * ```
     *
     * @param column The column name, column index or instance to
     * create the list from.
     */
    public listBy<Value extends OptionalHVal>(
        column: string | number | GridColumn
    ): HList<Value> {
        let name: string | undefined;

        if (isGridColumn(column)) {
            for (let i = 0; i < this.$store.columns.length; ++i) {
                if (column.name === this.$store.columns[i].name) {
                    name = column.name;
                    break;
                }
            }
        } else {
            switch (typeof column) {
                case "string":
                    name = column;
                    break;
                case "number":
                    const col = this.$store.columns[column];
                    if (col) {
                        name = col.name;
                    }
            }
        }

        if (name === undefined) {
            return HList.make();
        }

        const values = this.getRows()
            .map((row: DictVal): OptionalHVal | undefined =>
                row.get(name as string)
            )
            .filter((value): boolean => value !== undefined) as Value[];

        return HList.make(values as Value[]);
    }

    /**
     * Limit the grid only to the specified columns.
     *
     * This will return a new instance of a grid.
     *
     * ```typescript
     * grid.filter('site').limitColumns(['id', 'dis']).inspect()
     * ```
     *
     * @param names The column names.
     * @returns A new grid instance with the specified columns.
     */
    public limitColumns<LimitDictVal extends HDict = DictVal>(
        names: string[]
    ): HGrid<LimitDictVal> {
        return HGrid.make<LimitDictVal>({
            version: this.version,
            meta: this.meta.newCopy() as HDict,
            rows: this.getRows().map((dict: DictVal): LimitDictVal => {
                const newDict = new HDict();

                for (const name of names) {
                    if (dict.has(name)) {
                        newDict.set(name, dict.get(name) as HVal);
                    }
                }

                return newDict as LimitDictVal;
            }),
            columns: this.getColumns()
                .filter((col: GridColumn) => names.includes(col.name))
                .map(
                    (
                        col: GridColumn
                    ): {
                        name: string;
                        meta?: HDict;
                    } => ({ name: col.name, meta: col.meta.newCopy() as HDict })
                ),
        });
    }

    /**
     * Iterate over a grid using dicts for rows.
     *
     * This enables a 'for ... of' loop to be used directly on an iterator.
     *
     * @returns A new iterator for a grid.
     *
     * ```typescript
     * // Iterate a grid
     * for (let dict of grid) {
     *   console.log(dict)
     * }
     *
     * // Destructure a grid into an array of dicts...
     * const fooDict = [...grid].filter((dict): boolean => dict.get('foo') === 'foo')[0]
     * ```
     */
    public [Symbol.iterator](): Iterator<DictVal> {
        return new GridDictIterator(this);
    }

    /**
     * ```typescript
     * if (grid.isEmpty()) {
     *   // Grid is empty.
     * }
     * ```
     *
     * @returns true if the grid is empty.
     */
    public isEmpty(): boolean {
        return this.length === 0;
    }

    /**
     * Selects a range from the grid.
     *
     * The start and end can be used to specify a range...
     * ```typescript
     * // from [0, 1, 2, 3, 4, 5] to [1, 2, 3, 4]
     * grid.filter('site').range(1, 4).inspect()
     * ```
     *
     * //If only the first argument then a quantity can be used...
     * ```typescript
     * // select the first 4 rows - [0, 1, 2, 4]...
     * grid.filter('site').range(4).inspect()
     * ```
     *
     * @param startOrQuantity The start of the range or quantity.
     * @param end Optional end range.
     * @returns This grid instance.
     */
    public range(startOrQuantity: number, end?: number): this {
        const rows = this.getRows();

        if (end === undefined) {
            end = --startOrQuantity;
            startOrQuantity = 0;
        }

        if (startOrQuantity <= end) {
            for (let i = rows.length; i >= 0; --i) {
                if (i < startOrQuantity || i > end) {
                    this.remove(i);
                }
            }
        }

        return this;
    }

    /**
     * Return the sum of values for the specified column.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { id: 34, num: 1 },
     *     { id: 35, num: 2 },
     *     { id: 36, num: 3 },
     *   ]
     * })
     * // Sum all the values in the num column (6)
     * const sum = grid.sumOf('num')
     * ```
     *
     * @param column The column name, column index or column instance.
     * @returns The sum of all the numeric values.
     */
    public sumOf(column: string | number | GridColumn): number {
        return this.listBy(column).sum;
    }

    /**
     * Return the maximum value in the specified column.
     *
     * If there are no numbers then Number.MIN_SAFE_INTEGER is returned.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { id: 34, num: 1 },
     *     { id: 35, num: 2 },
     *     { id: 36, num: 3 },
     *   ]
     * })
     * // Return the maximum value in the num column (3).
     * const max = grid.maxOf('num')
     * ```
     *
     * @param column The column name, column index or column instance.
     * @returns The maximum numerical value found.
     */
    public maxOf(column: string | number | GridColumn): number {
        return this.listBy(column).max;
    }

    /**
     * Return the minimum of value in the specified column.
     *
     * If there are no numbers then Number.MAX_SAFE_INTEGER is returned.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { id: 34, num: 1 },
     *     { id: 35, num: 2 },
     *     { id: 36, num: 3 },
     *   ]
     * })
     * // Return the maximum value in the num column (1).
     * const min = grid.minOf('num')
     * ```
     *
     * @param column The column name, column index or column instance.
     * @returns The minimum numerical value found.
     */
    public minOf(column: string | number | GridColumn): number {
        return this.listBy(column).min;
    }

    /**
     * Return the sum of values for the specified column.
     *
     * If there are no numbers then Number.NaN is returned.
     *
     * ```typescript
     * const grid = HGrid.make({
     *   rows: [
     *     { id: 34, num: 1 },
     *     { id: 35, num: 2 },
     *     { id: 36, num: 3 },
     *   ]
     * })
     * // Return average of the num column (2).
     * const avg = grid.avgOf('num')
     * ```
     *
     * @param column The column name, column index or column instance.
     * @returns The average of all the numeric values.
     */
    public avgOf(column: string | number | GridColumn): number {
        return this.listBy(column).avg;
    }

    /**
     * ```typescript
     * if (grid.isError()) {
     *   // Do something.
     * }
     * ```
     *
     * @returns true if the grid has an error associated with it.
     */
    public isError(): boolean {
        return this.meta.has("err");
    }

    /**
     * ```typescript
     * const err = grid.getError()
     * if (err) {
     *   // Do something with the error.
     * }
     * ```
     *
     * @returns Error information or undefined if not available.
     */
    public getError():
        | undefined
        | { type: string; trace: string; dis: string } {
        if (!this.isError()) {
            return undefined;
        }

        const errType = this.meta.get<HStr>("errType");
        const errTrace = this.meta.get<HStr>("errTrace");
        const dis = this.meta.get<HStr>("dis");

        return {
            type: (errType && errType.value) || "",
            trace: (errTrace && errTrace.value) || "",
            dis: (dis && dis.value) || "",
        };
    }

    /**
     * @returns The grid as an array like object.
     */
    public asArrayLike(): ArrayLike<DictVal> {
        return this as unknown as ArrayLike<DictVal>;
    }

    /**
     * @returns A string representation of the value.
     */
    public toString(): string {
        return `[${this.getRows()
            .map((dict: DictVal): string => String(dict))
            .join(", ")}]`;
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

        console.table(
            this.getRows().map(
                (
                    row: DictVal
                ): {
                    [prop: string]: string | number;
                } => {
                    const obj: { [prop: string]: string } = {};

                    for (const val of row) {
                        obj[val.name] = String(val.value);
                    }

                    return obj;
                }
            )
        );

        return this;
    }

    /**
     * Check whether the index number for the row is a valid number.
     *
     * @param index The row index number to check.
     * @throws An error if the index number is invalid.
     */
    private checkRowIndexNum(index: number): void {
        if (index < 0) {
            throw new Error("Row index must be greater than zero");
        }
    }

    /**
     * @returns Returns a copy of the grid.
     */
    public newCopy(): HGrid<DictVal> {
        return HGrid.make<DictVal>({
            version: this.version,
            meta: this.meta.newCopy() as HDict,
            rows: this.getRows().map(
                (dict: DictVal): DictVal => dict.newCopy() as DictVal
            ),
            columns: this.getColumns().map(
                (
                    col: GridColumn
                ): {
                    name: string;
                    meta?: HDict;
                } => ({ name: col.name, meta: col.meta.newCopy() as HDict })
            ),
        });
    }

    /**
     * @returns The value as a grid.
     */
    public toGrid(): HGrid<DictVal> {
        return this;
    }

    /**
     * @returns The value as a list.
     */
    public toList(): HList<DictVal> {
        return HList.make(this.getRows());
    }

    /**
     * @returns The value as a dict.
     */
    public toDict(): HDict {
        const obj: HValObj = {};

        const rows = this.getRows();
        for (let i = 0; i < rows.length; ++i) {
            obj[`row${i}`] = rows[i];
        }

        return HDict.make(this);
    }
}
