import foo from "./b";
export default class Foo {
};
foo();
import Foo from "./a";
export default function foo() {
    new Foo();
};
import("./a");
