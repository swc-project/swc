out: for (let i = 0; i < 2; i++) {
    if (i === 0) continue out;
    if (i === 1) break out;

    [1].forEach((_) => {
        console.log(i);
    });
}
