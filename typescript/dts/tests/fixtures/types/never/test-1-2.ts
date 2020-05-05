class C {
    void1() {
        throw new Error();
    }

    void2() {
        while (true) {
        }
    }

    never1(): never {
        throw new Error();
    }

    never2(): never {
        while (true) {
        }
    }
}
