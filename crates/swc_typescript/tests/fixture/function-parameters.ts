// Correct
export function fnDeclGood(p: T = [], rParam = ""): void { };
export function fnDeclGood2(p: T = [], rParam?: number): void { };

export function fooGood([a, b]: any[] = [1, 2]): number {
  return 2;
}

export const fooGood2 = ({a, b}: object = { a: 1, b: 2 }): number => {
  return 2;
}

const x = 42;
const y = '';
export function fooGood3({a = x, b: [{c = y}]}: object): void {}

// Incorrect
export function fnDeclBad<T>(p: T = [], rParam: T = "", r2: T): void { }
export function fnDeclBad2<T>(p: T = [], r2: T): void { }
export function fnDeclBad3<T>(p: T = [], rParam?: T, r2: T): void { }

export function fooBad([a, b] = [1, 2]): number {
  return 2;
}

export const fooBad2 = ({a, b} = { a: 1, b: 2 }): number => {
  return 2;
}


export function withAny(a: any = 1, b: string): void { }
export function withUnknown(a: unknown = 1, b: string): void { }

export function withTypeAssertion(a = /regular-repression-cannot-infer/ as any): void { }