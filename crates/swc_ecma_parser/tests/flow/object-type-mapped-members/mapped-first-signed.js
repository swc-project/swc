// The first mapped member keeps its optionality modifier when lowered.
type Plus = { [K in keyof O]+?: T, foo: string };
type Minus = { [K in keyof O]-?: T, foo: string };
type Bare = { [K in keyof O]?: T, foo: string };
