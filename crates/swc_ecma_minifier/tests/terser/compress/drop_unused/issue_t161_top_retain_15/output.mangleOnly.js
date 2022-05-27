class d {
    num() {
        return a;
    }
}
class e {
    num() {
        return b;
    }
}
class f {
    num() {
        return c;
    }
}
function g() {
    return a;
}
const h = ()=>b;
const i = ()=>c;
let a = 2, b = 3, c = 4;
console.log(a, b, c, a * b, a * c, b * c, g(), h(), i(), new d().num(), new e().num(), new f().num());
