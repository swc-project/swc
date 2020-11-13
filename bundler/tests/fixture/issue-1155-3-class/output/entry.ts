class a {
}
const a1 = a;
const a2 = a1;
function b() {
    return new a2();
}
b();
