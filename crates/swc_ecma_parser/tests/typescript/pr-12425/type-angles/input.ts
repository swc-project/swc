type ImportType = import("m").Foo<<U>() => U>;
type TypeQuery = typeof f<<U>() => U>;
type ImportQuery = typeof import("m").Foo<<U>() => U>;
type NestedQuery = Box<typeof f<<U>() => U>>;
type TypeReference = Foo<<U>() => U>;
type SpacedQuery = typeof f< <U>() => U>;
