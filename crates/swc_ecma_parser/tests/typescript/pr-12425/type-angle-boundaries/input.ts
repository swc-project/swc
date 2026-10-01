type QualifiedQuery = typeof obj.f<<U>() => U>;
type NestedImport = Box<import("m").Foo<<U>() => U>>;
type MultipleArgs = typeof f<<U>() => U, Foo<Bar>>;
type MultipleImportArgs = import("m").Foo<<U>() => U, Foo<Bar>>;
type AttributedImport = import("m", { with: { "resolution-mode": "import" } }).Foo<<U>() => U>;
type NewlineImport = import("m").Foo
<<U>() => U>;
type NewlineQuery = typeof f
<Foo>value;
type NewlineReference = Foo
<Bar>value;
const left = a << b;
const right = a >> b;
const compare = a < b;
