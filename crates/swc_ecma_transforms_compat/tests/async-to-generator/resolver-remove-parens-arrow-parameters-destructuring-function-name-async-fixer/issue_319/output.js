export default obj({
    f () {
        return _async_to_generator(function*() {
            yield g();
        })();
    }
});
