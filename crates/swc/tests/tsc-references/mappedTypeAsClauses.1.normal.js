//// [mappedTypeAsClauses.ts]
// Mapped type 'as N' clauses
var e1 = {
    foo: "hello"
};
var e2 = "foo";
var primitiveCar; // { name: string; seats: number; }
var keys; //  "name" | "seats"
var carKeys; // "name" | "seats"
function f(x) {
    return x;
}
f("a"); // Error, should allow only "b"
