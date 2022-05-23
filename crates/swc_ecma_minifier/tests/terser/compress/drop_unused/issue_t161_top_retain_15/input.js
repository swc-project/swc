class Alpha {
    num() {
        return x;
    }
}
class Beta {
    num() {
        return y;
    }
}
class Carrot {
    num() {
        return z;
    }
}
function f() {
    return x;
}
const g = () => y;
const h = () => z;
let x = 2,
    y = 3,
    z = 4;
console.log(
    x,
    y,
    z,
    x * y,
    x * z,
    y * z,
    f(),
    g(),
    h(),
    new Alpha().num(),
    new Beta().num(),
    new Carrot().num()
);
