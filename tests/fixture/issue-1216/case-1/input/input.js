const source = Math.random() < 2 ? 'matilda' : 'fred';
const details = {
    _id: '1',
};
async function request(path) {
    return `success:${path}`;
}

(async () => {
    const obj = source === 'matilda'
        ? details
        : await request(
            `/${details._id}?source=${source}`
        );

    console.log({ obj });
})();