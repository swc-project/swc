export class Foo {
  private constructor(a: number = 0, b) {}
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

export class ConstructorOverloadsClass {
  constructor(a: number);
  constructor(a: string);
  constructor(readonly a: any) {}
}

export class ClassParameterProperties {
	constructor(
		a: number,
		readonly b: string,
	) {}
}

export class PrivateConstructorWithParameterProperties {
	private constructor(
		foo: string,
		readonly bar: string,
	) {}
}

export class ProtectedConstructorWithParameterProperties {
	protected constructor(
		public foo: string,
		private readonly bar: number,
		protected baz: boolean,
		readonly qux: string,
	) {}
}

export class PrivateConstructorMixedParameterProperties {
	private constructor(
		public publicProp: string,
		private privateProp: number,
		protected protectedProp: boolean,
		readonly readonlyProp: string,
		public readonly publicReadonlyProp: number,
		private readonly privateReadonlyProp: boolean,
		normalParam: string,
	) {}
}

export class PrivateConstructorWithOverloads {
	private constructor(a: number);
	private constructor(a: string);
	private constructor(a: number, b: string);
	private constructor(a: any, b?: string) {}
}

export class PrivateConstructorWithOptionalParameters {
	private constructor(
		required: string,
		optional?: number,
		public publicOptional?: boolean,
		private privateOptional?: string,
		readonly readonlyOptional?: number,
	) {}
}

export class PrivateConstructorWithRestParameters {
	private constructor(
		first: string,
		...rest: number[]
	) {}
}

export class PrivateConstructorWithDefaultParameters {
	private constructor(
		public prop1: string = "default",
		private prop2: number = 42,
		readonly prop3: boolean = true,
		normalParam: string = "normal",
	) {}
}