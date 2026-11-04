const assert = require("node:assert/strict");

class Counter {
    state = { n: 0, 0: 0 };
    events = [];
    #n = 0;

    #m(value = this.state) {
        this.events.push("method");
        return value;
    }
    #receiver() {
        this.events.push("receiver");
        return this;
    }
    get #view() {
        this.events.push("getter");
        return this.state;
    }

    update() {
        assert.equal(this.#view[this.#n++]++, 0);
        assert.equal(this.#n, 1);
        assert.equal(this.state[0], 1);
        assert.deepEqual(this.events, ["getter"]);

        this.events = [];
        assert.equal((++this.#n, this.#m()).n++, 0);
        assert.equal(this.#n, 2);
        assert.deepEqual(this.events, ["method"]);

        this.events = [];
        assert.equal(this.#m((this.#n++, this.state)).n++, 1);
        assert.equal(this.#n, 3);
        assert.deepEqual(this.events, ["method"]);

        this.events = [];
        assert.equal(this.#view[(this.#n = 4, "n")]++, 2);
        assert.equal(this.#n, 4);
        assert.equal(this.state.n, 3);
        assert.deepEqual(this.events, ["getter"]);

        const receiver = () => {
            this.events.push("receiver-call");
            return this;
        };
        this.events = [];
        assert.equal(receiver().#n++, 4);
        assert.equal(this.#n, 5);
        assert.deepEqual(this.events, ["receiver-call"]);
    }

    assign() {
        this.#n = 0;
        this.events = [];
        [this.#receiver().#n = ++this.#n] = [];
        assert.equal(this.#n, 1);
        assert.deepEqual(this.events, ["receiver"]);

        this.events = [];
        ({ value: this.#receiver().#n = (this.#n = 2) } = {});
        assert.equal(this.#n, 2);
        assert.deepEqual(this.events, ["receiver"]);

        this.events = [];
        ({ [this.#n++]: this.#receiver().#n } = { 2: 3 });
        assert.equal(this.#n, 3);
        assert.deepEqual(this.events, ["receiver"]);

        const receiver = () => {
            this.events.push("receiver-call");
            return this;
        };
        this.events = [];
        [receiver().#n] = [4];
        assert.equal(this.#n, 4);
        assert.deepEqual(this.events, ["receiver-call"]);

        this.#n = 0;
        this.events = [];
        for (this.#view[this.#n++] of [5, 6]) {}
        assert.equal(this.#n, 2);
        assert.equal(this.state[0], 5);
        assert.equal(this.state[1], 6);
        assert.deepEqual(this.events, ["getter", "getter"]);
    }
}

const counter = new Counter();
counter.update();
counter.assign();
console.log("nested instance writes passed");
