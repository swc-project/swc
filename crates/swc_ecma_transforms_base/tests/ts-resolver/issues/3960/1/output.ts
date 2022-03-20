import { field } from "../validation/decorators";
class C {
    constructor(@field("a")
    readonly field__2: string, @field("b")
    readonly b__2: string){}
}
