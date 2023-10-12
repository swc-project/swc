let funcs = [];
for (let i = 0; i < 2; i++)
    for (let j = 0; j < 2; j++)
        funcs.push(() => console.log(i, j));

funcs.forEach((f) => f());
