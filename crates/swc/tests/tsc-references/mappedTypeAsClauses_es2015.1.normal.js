// @strict: true
// @declaration: true
// Mapped type 'as N' clauses
const e1 = {
    foo: "hello"
};
const e2 = "foo";
let primitiveCar; // { name: string; seats: number; }
let keys; //  "name" | "seats"
let carKeys; // "name" | "seats"
function f(x) {
    return x;
}
f("a"); // Error, should allow only "b"
