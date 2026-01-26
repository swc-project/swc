import { Reference, Unreferenced } from 'mod';

declare class Class {}
declare function Function(): Reference
declare const variable: number;
declare enum Enum { A, B, C }

// Should not be included in the output, because they are not exported
declare class UnreferencedClass {}
declare function UnreferencedFunction(): Unreferenced
declare const UnreferencedVariable: number;
declare enum UnreferencedEnum { A, B, C }


export { Class, Function, variable, Enum }
