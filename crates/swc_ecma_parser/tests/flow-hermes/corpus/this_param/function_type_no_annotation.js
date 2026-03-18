// These are ok - foo is a function which takes the `this` type
type foo = (this) => void;
type bar = this => void;
