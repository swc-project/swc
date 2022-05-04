import { Nullable } from "nullable";
import { Another } from "some";
class A {
    do(): Nullable<Another> {
        return null;
    }
}
new A();
