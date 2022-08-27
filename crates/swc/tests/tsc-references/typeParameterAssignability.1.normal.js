//// [typeParameterAssignability.ts]
// type parameters are not assignable to one another unless directly or indirectly constrained to one another
function foo(t, u) {
    t = u; // error
    u = t; // error
}
