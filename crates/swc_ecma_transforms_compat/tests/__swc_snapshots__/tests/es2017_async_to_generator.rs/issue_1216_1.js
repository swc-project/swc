const source = Math.random() < 2 ? 'matilda' : 'fred';
const details = {
    _id: '1'
};
function request(path) {
    return _request.apply(this, arguments);
}
function _request() {
    _request = _async_to_generator(function*(path) {
        return `success:${path}`;
    });
    return _request.apply(this, arguments);
}
_async_to_generator(function*() {
    const obj = source === 'matilda' ? details : yield request(`/${details._id}?source=${source}`);
    console.log({
        obj
    });
})();
