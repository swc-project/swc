// Controls: a lone mapped member keeps the `TsMappedType` representation.
type Plain = { [K in keyof O]: T };
type TrailingComma = { [K in keyof O]: T, };
type TrailingSemi = { [K in keyof O]: T; };
type Plus = { [K in keyof O]+?: T };
type Minus = { [K in keyof O]-?: T };
