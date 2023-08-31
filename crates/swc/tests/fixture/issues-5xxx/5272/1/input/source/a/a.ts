import { Base } from "../b/base";
export class Foo extends Base {
    bar() {
        return 1 + this.foo();
    }
}