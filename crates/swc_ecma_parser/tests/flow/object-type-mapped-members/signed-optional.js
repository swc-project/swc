// Signed optionality on mapped members after ordinary properties.
type PropThenPlus = { foo: string, [K in keyof O]+?: T };
type PropThenMinus = { foo: string, [K in keyof O]-?: T };
type PropThenBare = { foo: string, [K in keyof O]?: T };
type PropThenRequired = { foo: string, [K in keyof O]: T };
