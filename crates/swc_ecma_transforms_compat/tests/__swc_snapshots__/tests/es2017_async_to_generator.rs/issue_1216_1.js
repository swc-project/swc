const source = Math.random() < 2 ? 'matilda' : 'fred';
const details = {
    _id: '1'
};
function request(path) {
    return /*#__PURE__*/ _async_to_generator(function*() {
        return `success:${path}`;
    })();
}
(function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        const obj = source === 'matilda' ? details : yield request(`/${details._id}?source=${source}`);
        console.log({
            obj
        });
    })();
})();
