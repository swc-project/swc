type T10 = string[];
type T11 = Array<string>;
type T12 = readonly string[];
type T13 = ReadonlyArray<string>;

type T20 = [number, number];
type T21 = readonly [number, number];

declare function f1(ma: string[], ra: readonly string[], mt: [string, string], rt: readonly [string, string]): readonly [string, string];
