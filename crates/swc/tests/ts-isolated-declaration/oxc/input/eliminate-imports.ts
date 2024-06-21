import { AExtend, BExtend, Type, CImplements1, CImplements2, CType, ThisType1, ThisType2, Unused } from 'mod';

export interface A extends AExtend<Type> {}
export class B extends BExtend<Type> {}
export class C implements CImplements1<CType>, CImplements2<CType> {}
export function foo(this: ThisType1): void {}
export const bar: (this: ThisType2) => void = function() {}