type Obj = {
  readonly foo: string,
};
type Valid = {
  readonly: string,
  readonly?: string,
  readonly(): string,
  readonly<T>(): T,
};

type Indexer = {
  readonly [string]: mixed;
};

class C {
  readonly prop: string;
}
class ValidC {
  readonly: void;
  readonly(): void {}
  readonly<T>(): T {}
  static readonly: void;
  static readonly(): void {}
  static readonly<T>(): T {}
}

interface I {
  readonly prop: string;
}
interface ValidI {
  readonly: string;
  readonly?: string;
  readonly(): T;
  readonly<T>(): T;
}

const readonly = 1;
