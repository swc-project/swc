import foo, { bar as baz } from "mod";
const local = foo + baz;
export { local as renamed };
export function used() {
    return local;
}
