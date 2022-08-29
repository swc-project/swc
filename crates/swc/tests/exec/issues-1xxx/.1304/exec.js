function cache(target, key, value) {
    return {
        get() {
            return value;
        }
    }
}

class Life {
    #friends = true;

    @cache // remove this and see private class field transpile without errors
    get happy() {
        return this.#friends;
    }
}