const sizes = {
    A4: {
        width: '21cm',
        height: '29.7cm'
    },
    Letter: {
        width: '8.5in',
        height: '11in'
    }
};
export function printSize(i) {
    const { width: t, height: e } = sizes[i];
    console.log({
        width: t,
        height: e
    });
}
