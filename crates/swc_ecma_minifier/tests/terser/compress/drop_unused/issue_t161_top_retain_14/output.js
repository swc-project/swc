class Alpha {
    num() {
        return x;
    }
}
let x = 2, z = 4;
console.log(2, 3, 4, 6, 8, 12, 2, 3, 4, new Alpha().num(), new class {
    num() {
        return 3;
    }
}().num(), new class {
    num() {
        return z;
    }
}().num());
