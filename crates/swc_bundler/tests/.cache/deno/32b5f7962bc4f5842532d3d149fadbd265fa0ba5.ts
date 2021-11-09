// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/table/lib/cell.ts


export type ICell = number | string | String | Cell;

export interface ICellOptions {
    border?: boolean;
    colSpan?: number;
    rowSpan?: number;
}

export class Cell {

    protected options: ICellOptions = {};

    public get length(): number {
        return this.toString().length;
    }

    public static from( value: ICell ): Cell {
        const cell = new this( value );
        if ( value instanceof Cell ) {
            cell.options = Object.assign( {}, value.options );
        }
        return cell;
    }

    public constructor( private value: ICell ) {
    }

    public toString(): string {
        return this.value.toString();
    }

    public setValue( value: ICell ): this {
        this.value = value;
        return this;
    }

    public clone( value?: ICell ): Cell {
        const cell = new Cell( value ?? this );
        cell.options = Object.assign( {}, this.options );
        return cell;
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

    public colSpan( span: number, override: boolean = true ): this {
        if ( override || typeof this.options.colSpan === 'undefined' ) {
            this.options.colSpan = span;
        }
        return this;
    }

    public rowSpan( span: number, override: boolean = true ): this {
        if ( override || typeof this.options.rowSpan === 'undefined' ) {
            this.options.rowSpan = span;
        }
        return this;
    }

    /**
     * Getter:
     */

    public getBorder(): boolean {
        return this.options.border === true;
    }

    public getColSpan(): number {
        return typeof this.options.colSpan === 'number' && this.options.colSpan > 0 ? this.options.colSpan : 1;
    }

    public getRowSpan(): number {
        return typeof this.options.rowSpan === 'number' && this.options.rowSpan > 0 ? this.options.rowSpan : 1;
    }
}
