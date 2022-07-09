export const foo = {
    get [this]() {
        return this;
    },
    set [this](v = this.y) {
        this.x = v;
    },
};
