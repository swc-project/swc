export declare function fnDeclGood(p?: T, rParam?: string): void;
export declare function fnDeclGood2(p?: T, rParam?: number): void;
export declare function fooGood([a, b]?: any[]): number;
export declare const fooGood2: (_dts_1: {
    a: number;
    b: number;
}) => number;
export declare function fnDeclBad<T>(p?: T, rParam?: T, r2: T): void;
export declare function fnDeclBad2<T>(p?: T, r2: T): void;
export declare function fnDeclBad3<T>(p?: T, rParam?: T, r2: T): void;
export declare function fooBad([a, b]?: [number, number]): number;
export declare const fooBad2: (_dts_2: {
    a: number;
    b: number;
}) => number;
