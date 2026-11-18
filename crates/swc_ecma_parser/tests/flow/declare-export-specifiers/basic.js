declare export { Foo };
declare export { Foo, type Bar as Baz } from "./foo";
declare export * from "./foo";
declare export * as ns from "./foo";
