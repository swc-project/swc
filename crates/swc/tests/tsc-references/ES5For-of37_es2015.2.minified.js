for (const i of [
    0,
    1,
    2,
    3,
    4
])try {
    for (const j of [
        1,
        2,
        3
    ])if (2 === i) throw new Error('ERR');
    console.log(i);
} catch (err) {
    console.log('E %s %s', i, err);
}
