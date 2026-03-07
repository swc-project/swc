type Box<T> = {readonly value: T;};
interface Service<T> extends Base{get(id: string): T;};
const enum Mode{Fast = 1, Slow = 2};
declare namespace Env {interface Config{mode: Mode;};};
type Fn = (input: string) => number;
type Wrapped<T> = T extends string ? Box<T> : T[];
const value = foo as Box<string>;
