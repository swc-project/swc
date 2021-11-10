function* y() {
    return new (yield x())();
}
