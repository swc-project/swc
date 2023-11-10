(function() {
    var _poll = _async_to_generator(function*() {
        console.log((yield Promise.resolve('Hello')));
        setTimeout(poll, 1000);
    });
    function poll() {
        return _poll.apply(this, arguments);
    }
    return poll;
})()();
