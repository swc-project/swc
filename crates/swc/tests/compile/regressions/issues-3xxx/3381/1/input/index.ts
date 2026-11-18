const dummyTsFunction = () => {
    const dummyArray = [0, 1, 2];

    const func1 = (array: Array<number>) =>
        // Mapping array
        array?.map((i) => i);

    const func2 = (array: Array<number>) => array?.map((i) => i);

    console.log(func1(dummyArray)); // output: undefined
    console.log(func2(dummyArray)); // output: array
};
