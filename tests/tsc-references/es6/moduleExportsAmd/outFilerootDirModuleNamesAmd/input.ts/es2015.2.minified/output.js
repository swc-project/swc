import foo from "./b";
class Foo {
}
export { Foo as default };
foo();
export default function foo() {
    new Foo();
};
import("./a");
