class a {
    num() {
        return g;
    }
}
class b {
    num() {
        return h;
    }
}
class c {
    num() {
        return i;
    }
}
function d() {
    return g;
}
const e = ()=>h;
const f = ()=>i;
let g = 2, h = 3, i = 4;
console.log(g, h, i, g * h, g * i, h * i, d(), e(), f(), new a().num(), new b().num(), new c().num());
