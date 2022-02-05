class C {
}
C["foo"] = 1;
C.bar = 2;
const foo = C["foo"];
C[42] = 42;
C[2] = 2;
const bar = C[42];
