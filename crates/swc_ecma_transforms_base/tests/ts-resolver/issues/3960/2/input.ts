import { field } from "../validation/decorators";
class C {
    method(
        @field("a") readonly field: string,
        @field("b") readonly b: string
    ) {}
}
