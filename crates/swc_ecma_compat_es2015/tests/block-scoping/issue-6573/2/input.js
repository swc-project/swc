let funcs = [];
for (let i in [1, 2])
    for (let j in [1, 2])
        funcs.push(() => console.log(i, j));

funcs.forEach((f) => f());
