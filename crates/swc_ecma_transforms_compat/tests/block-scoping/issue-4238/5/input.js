for (let i = 0; i < 4; i++) {
    b: for (let j = 0; j < 4; ++j) {
        if (i < 2) continue b;

        [1].forEach((_) => {
            console.log(i, j);
        });
    }
}
