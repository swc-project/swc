// Controls for object type accessors and methods.
type Setter = { set p(x: number): void };
type SetterNoReturn = { set p(x: number) };
type Getter = { get p(): number };
type Method = { p(x: number, y: string): void };
