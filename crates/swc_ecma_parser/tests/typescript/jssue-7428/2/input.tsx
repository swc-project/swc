class T {
    f() { arguments }

    static f = class extends T {
        x() { arguments }
    }
}