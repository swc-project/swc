//// [constEnum2.ts]
// An enum declaration that specifies a const modifier is a constant enum declaration.
// In a constant enum declaration, all members must have constant values and
// it is an error for a member declaration to specify an expression that isn't classified as a constant enum expression.
// Error : not a constant enum expression
var D, D1;
(D1 = D || (D = {}))[D1.d = 10] = "d", D1[D1.e = 199 * Math.floor(1000 * Math.random())] = "e", D1[D1.f = 10 - 100 * Math.floor(Math.random() % 8)] = "f", D1[D1.g = 0] = "g";
