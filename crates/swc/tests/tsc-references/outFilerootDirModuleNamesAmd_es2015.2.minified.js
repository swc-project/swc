import foo from "./b";
import Foo from "./a";
export default class Foo {
};
foo();
export default function foo() {
    new Foo();
};
import("./a");
