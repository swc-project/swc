// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/table/lib/row.ts


import { Cell, ICell } from './cell.ts';

export type IRow<T extends ICell = ICell> = T[] | Row<T>;
export type IDataRow = Record<string, string | number>;

export interface IRowOptions {
    indent?: number;
    border?: boolean;
}

export class Row<T extends ICell = ICell> extends Array<T> {

    protected options: IRowOptions = {};

    public static from<T extends ICell = ICell>( cells: IRow<T> ): Row<T> {
        const row = new this( ...cells );
        if ( cells instanceof Row ) {
            row.options = Object.assign( {}, cells.options );
        }
        return row;
    }

    public clone(): Row {
        const row = new Row( ...this.map( ( cell: T ) =>
            cell instanceof Cell ? cell.clone() : cell ) );
        row.options = Object.assign( {}, this.options );
        return row;
    }

    /**
     * Setter:
     */

    public border( enable: boolean, override: boolean = true ): this {
        if ( override || typeof this.options.border === 'undefined' ) {
            this.options.border = enable;
        }
        return this;
    }

    /**
     * Getter:
     */

    public getBorder(): boolean {
        return this.options.border === true;
    }

    public hasBorder(): boolean {
        return this.getBorder() || this.some( cell => cell instanceof Cell && cell.getBorder() );
    }
}
