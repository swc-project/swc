out: while (true) {
    inner: for (let i = 0; j < 2; j++) {
        if (i === 0) continue inner;
        if (i === 1) break out;

        [1].forEach((_) => {
            console.log(i);
        });
    }
}
