abstract class C {}
declare abstract class C {}
export abstract class C {}
// `export abstract class {}` is not valid TypeScript.
export default abstract class { }
export default abstract class C { }
// `abstract class` is not valid as an expression.

export abstract class C {
  abstract prop: number;
  abstract method(): void;
}
export class C {
  // should still have as abstract even though parent is not
  abstract prop: number;
  abstract method(): void;
  // should be abstract in spite of override in wrong place
  override abstract method(): string;
}
