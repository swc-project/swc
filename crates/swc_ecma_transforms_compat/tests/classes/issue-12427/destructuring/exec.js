const assert = require("node:assert/strict");

class Counter {
    events = [];
    #n = 0;

    #receiver() {
        this.events.push("receiver");
        return this;
    }
    #key() {
        this.events.push("key");
        return "n";
    }
    get #view() {
        this.events.push("getter");
        return this;
    }

    run(other) {
        [this.#receiver().#n] = [1];
        assert.equal(this.#n, 1);
        ({ value: other.#receiver().#n } = { value: 2 });
        assert.equal(other.#n, 2);

        this.events = [];
        [this.#receiver().#n = this.#receiver().#n + 1] = [];
        assert.equal(this.#n, 2);
        assert.deepEqual(this.events, ["receiver", "receiver"]);

        this.events = [];
        [this.#view.#n] = [3];
        assert.equal(this.#n, 3);
        assert.deepEqual(this.events, ["getter"]);

        [this.#n, ...other.#receiver().#n] = [4, 5, 6];
        assert.equal(this.#n, 4);
        assert.deepEqual(other.#n, [5, 6]);
        ({ ...this.#receiver().#n } = { n: 7 });
        assert.deepEqual(this.#n, { n: 7 });

        this.events = [];
        ({ [this.#key()]: this.#receiver().#n } = { n: 8 });
        assert.equal(this.#n, 8);
        assert.deepEqual(this.events, ["key", "receiver"]);

        this.events = [];
        ({ value: this.#receiver().#n = this.#receiver().#n + 1 } = {});
        assert.equal(this.#n, 9);
        assert.deepEqual(this.events, ["receiver", "receiver"]);

        this.events = [];
        for (this.#receiver().#n of [10, 11]) {}
        assert.equal(this.#n, 11);
        assert.deepEqual(this.events, ["receiver", "receiver"]);

        [this.#n] = [12];
        assert.equal(this.#n, 12);
        assert.throws(() => { [({}).#receiver().#n] = [1]; }, TypeError);
    }

    static #staticN = 0;
    static #staticReceiver() {
        return this;
    }
    static run() {
        [this.#staticReceiver().#staticN] = [1];
        assert.equal(this.#staticN, 1);
        ({ value: Counter.#staticReceiver().#staticN } = { value: 2 });
        assert.equal(this.#staticN, 2);
        [this.#staticReceiver().#staticN = this.#staticReceiver().#staticN + 1] = [];
        assert.equal(this.#staticN, 3);
    }
}

new Counter().run(new Counter());
Counter.run();
console.log("destructuring passed");
