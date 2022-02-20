import foo from "./b";
class Foo {
}
foo();
export default function foo() {
    new Foo();
};
import("./a");
export { Foo as default };
