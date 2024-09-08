_async_to_generator(function*() {
    yield 'ok';
})();
_async_to_generator(function*() {
    yield 'ok';
})();
/*#__PURE__*/ (function() {
    var _notIIFE = _async_to_generator(function*() {
        yield 'ok';
    });
    function notIIFE() {
        return _notIIFE.apply(this, arguments);
    }
    return notIIFE;
})();
/*#__PURE__*/ _async_to_generator(function*() {
    yield 'not iife';
});
