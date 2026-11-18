// Controls: members before the first mapped member.
type PropThenMapped = { foo: string, [K in keyof O]: T };
type PropThenAll = { foo: string, [K in keyof O]: T, ...bar, [number]: boolean, [K in keyof O]: T, };
type SpreadThenMapped = { ...bar, [K in keyof O]: T, foo: string };
type ExactMappedThenProp = {| [K in keyof O]: T, foo: string |};
type VarianceMappedThenProp = { +[K in keyof O]: T, foo: string };
