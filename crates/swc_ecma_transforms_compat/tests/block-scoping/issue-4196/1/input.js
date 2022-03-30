for (let i = 0; i < 2; i++) {
    if (i === 0) continue;
    if (i === 1) break;

    [1].forEach((_) => {
        console.log(i);
    });
}
