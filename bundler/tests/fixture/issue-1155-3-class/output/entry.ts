class a {
}
const a1 = a;
const a2 = a1;
const a3 = a2;
function b() {
    return new a3();
}
b();
