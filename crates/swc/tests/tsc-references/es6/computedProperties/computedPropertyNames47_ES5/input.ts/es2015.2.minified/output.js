var E1, E2;
let E1;
(E1 = E1 || (E1 = {
}))[E1.x = 0] = "x";
let E2;
(E2 = E2 || (E2 = {
}))[E2.x = 0] = "x", E1.x || E2.x;
