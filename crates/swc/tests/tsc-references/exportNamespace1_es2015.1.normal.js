// @Filename: a.ts
export class A {
}
// @Filename: c.ts
export * from './b';
new A(); // Error
