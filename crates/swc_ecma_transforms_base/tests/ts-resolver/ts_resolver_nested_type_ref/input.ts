import { Nullable } from "nullable";
import { SomeOther } from "some";
import { Another } from "some";
class A extends Nullable {
    other: Nullable<Another>;
}
new A();
