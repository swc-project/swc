type T01 = Parameters<(x: number, y: string, ...z: boolean[]) => void>;
type T02 = Parameters<(...args: [number, string, ...boolean[]]) => void>;
type T03 = ConstructorParameters<new (x: number, y: string, ...z: boolean[]) => void>;
type T04 = ConstructorParameters<new (...args: [number, string, ...boolean[]]) => void>;
type T05<T extends any[]> = Parameters<(x: string, ...args: T) => void>;
type T06 = T05<[number, ...boolean[]]>;

type P1<T extends Function> = T extends (head: infer A, ...tail: infer B) => any ? { head: A, tail: B } : any[];

type T10 = P1<(x: number, y: string, ...z: boolean[]) => void>;
type T11 = P1<(...z: number[]) => void>;
type T12 = P1<(x: number, y: number) => void>;