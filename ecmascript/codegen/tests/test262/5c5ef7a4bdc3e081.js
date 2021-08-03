var a;
// access to global should be assumed to have side effects
if (b) {
    a = 1 + 2;
} else {
    a = 3;
}
