export const fn = () => {
    let val;

    if (!val) {
        return undefined;
        // works as expected if comment out below line
        throw new Error('first');
    }

    if (val.a?.b !== true) { // Uncaught TypeError: Cannot read properties of undefined (reading 'a')
        throw new Error('second');
    }
    return val;
}