new class {
    m() {
        return new class {
        }();
    }
}().m();
