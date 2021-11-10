L1: for (var x = 0; x < 3; x++) {
    break L1;
    L2: for (var y = 0; y < 2; y++) {
        break L2;
    }
}
console.log(x, y);
