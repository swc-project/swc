class Alpha {
    num() {
        return x;
    }
}
let x = 2, z = 4;
console.log(2, 3, 4, 6, 4 * x, 3 * z, x, 3, z, new Alpha().num(), new class {
    num() {
        return 3;
    }
}().num(), new class {
    num() {
        return z;
    }
}().num());
