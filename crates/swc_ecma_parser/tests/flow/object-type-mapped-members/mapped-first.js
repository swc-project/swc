// Mapped members may be followed by any other object type member.
type MappedThenProp = { [K in keyof O]: T, foo: string };
type MappedThenMapped = { [K in keyof O]: T, [J in keyof P]: U };
type MappedThenSpreadAndIndexer = { [K in keyof O]: T, ...bar, [number]: boolean };
type MappedThenPropSemi = { [K in keyof O]: T; foo: string };
type MappedThenAll = { [K in keyof O]: T, foo: string, ...bar, [number]: boolean, [J in keyof P]: U };
type MappedThenPropNewline = {
  [K in keyof O]: T
  foo: string
};
type MappedThenInexact = { [K in keyof O]: T, ... };
type MappedThenFunctionType = { [K in keyof O]: string => void, foo: number => void };
