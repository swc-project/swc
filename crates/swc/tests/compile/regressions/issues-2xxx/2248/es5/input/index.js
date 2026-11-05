export const foo = async () => {
    try {
        console.log(1);
    } catch (err) {
        console.log(err.message);
    }
};
