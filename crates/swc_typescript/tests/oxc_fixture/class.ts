export class Foo {
  private constructor(a: number = 0) {}
}

export class Bar {
  public constructor(a: number = 0) {}
}

export class Zoo {
  foo<F>(f: F): F {
    return f;
  }
}

export abstract class Qux {
  abstract foo(): void;
  protected foo2?(): void;
  bar(): void {}
  baz(): void {}
}

export class Baz {
  /** Just a comment */
  readonly prop1 = "some string";
  /** Just a comment */
  prop2 = "another string";
  /** Just a comment */
  private prop3 = "yet another string";
  /** Just a comment */
  private prop4(): void {}
  /** Just a comment */
  private static prop5 = "yet another string";
  /** Just a comment */
  private static prop6(): void {}
}

export class Boo {
  constructor(
    public readonly prop: number = 0,
    private readonly prop2: number = 1,
    readonly prop3: number = 1,
  ) {}
}

export class Bux {
  private constructor(
    public readonly prop: number = 0,
    private readonly prop2: number = 1,
    readonly prop3: number = 1,
  ) {}
}

export class PrivateFieldsWithConstructorAssignments {
  private second = 0;
  constructor(public first: number) {}
}


export class PrivateMethodClass {
  private good(a): void {}
  private get goodGetter() {
    return {[('x')]: 1};
  }
}

export class PublicMethodClass {
  public bad(a): void {}
  public get badGetter() {
    return {[('x')]: 1};
  }
}