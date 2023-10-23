const someFn = (xx, x, y) => [x, y];

const getArray = () => [1, 2, 3];

const goodFunction = async () => {
    const rb = await getArray();
    const rc = await getArray();
    console.log(someFn(1, rb, rc));
}

const badFunction = async () => {
    console.log(someFn(1, await getArray(), await getArray()))
}

goodFunction();
badFunction();