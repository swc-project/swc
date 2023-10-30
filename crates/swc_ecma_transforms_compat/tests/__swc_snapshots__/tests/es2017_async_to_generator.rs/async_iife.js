_async_to_generator(function*() {
    yield 'ok';
})();
_async_to_generator(function*() {
    yield 'ok';
})();
(function() {
    var _notIIFE = _async_to_generator(function*() {
        yield 'ok';
    });
    function notIIFE() {
        return _notIIFE.apply(this, arguments);
    }
    return notIIFE;
})();
_async_to_generator(function*() {
    yield 'not iife';
});
