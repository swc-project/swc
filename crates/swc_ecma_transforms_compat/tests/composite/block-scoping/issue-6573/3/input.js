let funcs = [];
for (let i of [1, 2])
    for (let j of [1, 2])
        funcs.push(() => console.log(i, j));

funcs.forEach((f) => f());
