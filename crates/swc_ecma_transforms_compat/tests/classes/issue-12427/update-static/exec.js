const assert = require("node:assert/strict");

class Counter {
    static state = { n: 0 };
    static #n = 0;

    static #m() {
        assert.equal(this, Counter);
        return this.state;
    }
    static #key() {
        return "n";
    }
    static get #view() {
        return this.state;
    }
    static #receiver() {
        return this;
    }

    static run() {
        assert.equal(this.#m().n++, 0);
        assert.equal(++this.#m().n, 2);
        assert.equal(this.#m().n--, 2);
        assert.equal(--this.#m().n, 0);
        assert.equal(Counter.#m().n++, 0);

        let receiverCalls = 0;
        const receiver = () => {
            receiverCalls++;
            return Counter;
        };
        assert.equal(receiver().#m().n++, 1);
        assert.equal(receiverCalls, 1);
        assert.equal(this.state[this.#key()]++, 2);
        assert.equal(this.#view.n++, 3);
        assert.equal(this.state.n, 4);

        assert.equal(this.#receiver().#n++, 0);
        assert.equal(++this.#receiver().#n, 2);
        assert.equal(Counter.#receiver().#n++, 2);
        assert.equal(this.#n, 3);
        assert.throws(() => ({}).#m().n++, TypeError);
    }
}

Counter.run();
console.log("static updates passed");
