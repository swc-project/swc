const timeoutPromise = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

const processArray = async (array) => {
    const [first, , third = 'default', ...rest] = array;

    if (!first || !third) {
        return;
    }
    await timeoutPromise(10);
    return {first, third, rest};
}

const func1 = async () => {
    return await processArray(['value1', 'value2', , 'value4', 'value5', 'value6', 'value7']);
}

const main = async () => {
    const res = await func1();
    console.log(res);
}

main();
