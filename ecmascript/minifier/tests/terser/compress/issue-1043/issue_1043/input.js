function* range(start = 0, end = null, step = 1) {
    if (end == null) {
        end = start;
        start = 0;
    }
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
