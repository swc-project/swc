import { RuntimeValue } from "values";
export function read(value) {
    return RuntimeValue(value.value);
}
