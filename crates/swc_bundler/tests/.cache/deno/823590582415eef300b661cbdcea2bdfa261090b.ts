// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/table/lib/table.ts


import { encode } from 'https://deno.land/std@0.63.0/encoding/utf8.ts';
import { border, IBorder } from './border.ts';
import { Cell } from './cell.ts';
import { TableLayout } from './layout.ts';
import { IDataRow, IRow, Row } from './row.ts';

export interface IBorderOptions extends Partial<IBorder> {}

export interface ITableOptions {
    indent?: number;
    border?: boolean;
    maxCellWidth?: number | number[];
    minCellWidth?: number | number[];
    padding?: number | number[];
    chars?: IBorderOptions;
}

export interface ITableSettings extends Required<ITableOptions> {
    chars: IBorder;
}

export type ITable<T extends IRow = IRow> = T[] | Table<T>;

export class Table<T extends IRow = IRow> extends Array<T> {

    protected options: ITableSettings = {
        indent: 0,
        border: false,
        maxCellWidth: Infinity,
        minCellWidth: 0,
        padding: 1,
        chars: border
    };
    private headerRow?: Row;

    public static from<T extends IRow>( rows: ITable<T> ): Table<T> {
        const table = new this( ...rows );
        if ( rows instanceof Table ) {
            table.options = Object.assign( {}, rows.options );
            table.headerRow = rows.headerRow ? Row.from( rows.headerRow ) : undefined;
        }
        return table;
    }

    public static fromJson( rows: IDataRow[] ): Table {
        return new this().fromJson( rows );
    }

    public static render<T extends IRow>( rows: ITable<T> ): void {
        Table.from( rows ).render();
    }

    public fromJson( rows: IDataRow[] ): this {
        this.header( Object.keys( rows[ 0 ] ) );
        this.body( rows.map( row => Object.values( row ) as T ) );
        return this;
    }

    public header( header: IRow ): this {
        this.headerRow = header instanceof Row ? header : Row.from( header );
        return this;
    }

    public body( rows: T[] ): this {
        this.length = 0;
        this.push( ...rows );
        return this;
    }

    public clone(): Table {
        const table = new Table( ...this.map( ( row: T ) =>
            row instanceof Row ? row.clone() : Row.from( row ).clone() ) );
        table.options = Object.assign( {}, this.options );
        table.headerRow = this.headerRow?.clone();
        return table;
    }

    public toString(): string {
        return new TableLayout( this, this.options ).toString();
    }

    public render(): this {
        Deno.stdout.writeSync( encode( this.toString() + '\n' ) );
        return this;
    }

    public maxCellWidth( width: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.maxCellWidth === 'undefined' ) {
            this.options.maxCellWidth = width;
        }
        return this;
    }

    public minCellWidth( width: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.minCellWidth === 'undefined' ) {
            this.options.minCellWidth = width;
        }
        return this;
    }

    public indent( width: number, override: boolean = true ): this {
        if ( override || typeof this.options.indent === 'undefined' ) {
            this.options.indent = width;
        }
        return this;
    }

    public padding( padding: number | number[], override: boolean = true ): this {
        if ( override || typeof this.options.padding === 'undefined' ) {
            this.options.padding = padding;
        }
        return this;
    }

    public border( enable: boolean, override: boolean = true ): this {
        if ( override || typeof this.options.border === 'undefined' ) {
            this.options.border = enable;
        }
        return this;
    }

    public chars( chars: IBorderOptions ): this {
        Object.assign( this.options.chars, chars );
        return this;
    }

    public getHeader(): Row | undefined {
        return this.headerRow;
    }

    public getBody(): T[] {
        return this.slice();
    }

    public getMaxCellWidth(): number | number[] {
        return this.options.maxCellWidth;
    }

    public getMinCellWidth(): number | number[] {
        return this.options.minCellWidth;
    }

    public getIndent(): number {
        return this.options.indent;
    }

    public getPadding(): number | number[] {
        return this.options.padding;
    }

    public getBorder(): boolean {
        return this.options.border === true;
    }

    public hasHeaderBorder(): boolean {
        return this.getBorder() || (
            this.headerRow instanceof Row && this.headerRow.hasBorder()
        );
    }

    public hasBodyBorder(): boolean {
        return this.getBorder() ||
            this.some( row =>
                row instanceof Row ? row.hasBorder() :
                    row.some( cell =>
                        cell instanceof Cell ? cell.getBorder : false
                    )
            );
    }

    public hasBorder(): boolean {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
}
