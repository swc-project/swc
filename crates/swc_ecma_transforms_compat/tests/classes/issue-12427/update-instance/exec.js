const assert = require("node:assert/strict");

class Counter {
    state = {
        n: 0,
        deep: { n: 0 },
        0: 0,
        g() {
            return this;
        },
    };
    events = [];
    #n = 0;

    #m(value = this.state) {
        this.events.push("method");
        return value;
    }
    #key() {
        this.events.push("key");
        return "n";
    }
    get #view() {
        this.events.push("getter");
        return this.state;
    }
    #receiver() {
        return this;
    }

    run(other) {
        assert.equal(this.#m().n++, 0);
        assert.equal(++this.#m().n, 2);
        assert.equal(this.#m().n--, 2);
        assert.equal(--this.#m().n, 0);
        assert.equal(other.#m().n++, 0);
        assert.equal(other.state.n, 1);
        assert.equal(this.#m().deep.n++, 0);
        assert.equal(this.state.deep.n, 1);
        assert.equal(this.#m().g().n++, 0);
        assert.equal(this.#m()[0]++, 0);
        assert.equal(this.state[0], 1);
        assert.equal((this.#m()).n++, 1);
        assert.equal((() => this.#m())().n++, 2);
        assert.equal(this.state[this.#key()]++, 3);

        this.events = [];
        assert.equal(this.#m(this.#m()).n++, 4);
        assert.deepEqual(this.events, ["method", "method"]);

        this.events = [];
        assert.equal(this.#view.n++, 5);
        assert.deepEqual(this.events, ["getter"]);

        let receiverCalls = 0;
        const receiver = () => {
            receiverCalls++;
            return this;
        };
        assert.equal(receiver().#m().n++, 6);
        assert.equal(receiverCalls, 1);

        this.events = [];
        assert.equal(this.#m()[this.#key()]++, 7);
        assert.deepEqual(this.events, ["method", "key"]);
        assert.equal(this.state.n, 8);

        assert.equal(this.#receiver().#n++, 0);
        assert.equal(++this.#receiver().#n, 2);
        assert.equal(this.#n, 2);

        const bigint = { n: 0n };
        assert.equal(this.#m(bigint).n++, 0n);
        assert.equal(++this.#m(bigint).n, 2n);
        assert.equal(bigint.n, 2n);
        assert.throws(() => ({}).#m().n++, TypeError);
    }
}

new Counter().run(new Counter());
console.log("instance updates passed");
