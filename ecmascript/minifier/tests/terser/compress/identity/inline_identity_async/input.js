const id = (x) => x;
id(async () => await 1)();
id(async (x) => await console.log(2))();
