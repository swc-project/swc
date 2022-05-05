import { field } from "../validation/decorators";
class C {
    constructor(
        @field("a") readonly field: string,
        @field("b") readonly b: string
    ) {}
}
