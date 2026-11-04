for (let a = 0; a < 2; a++) {
    for (let b = 0; b < 2; b++) {
        () => {};
        for (let c = 0; c < 2; c++) {
            console.log(b);
        }
    }
}
