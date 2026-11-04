console.log([
    ...(function* () {
        for (const i of [1, 2, 3]) {
            Promise.resolve().then(() => {
                console.log(`async: ${i}`);
            });
            yield i;
        }
    })(),
]);