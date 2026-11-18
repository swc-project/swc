const v0 = Symbol("Context#bar");
module.exports = {
    get bar() {
        if (new.target === "foo") {
            return;
        }
        return new Proxy(this, v0);
    }
};