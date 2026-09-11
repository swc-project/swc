import value from "input";
export { value };
export { other as renamed } from "other";
export * as namespace from "namespace";
export default function read() {
    return ()=>value;
}
