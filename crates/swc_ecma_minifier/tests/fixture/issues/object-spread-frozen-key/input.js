const assert = require("assert");

let leaked = false;
const proto = {
    get Leaked() {
        leaked = true;
        return "bad";
    },
};

const Keys = Object.freeze({
    ...{ __proto__: proto },
    FocalTweet: "focal_tweet",
});

const handler = () => "handled";
const handlers = {
    [Keys.FocalTweet]: handler,
};

assert.strictEqual(Keys.Leaked, undefined);
assert.strictEqual(leaked, false);
assert.strictEqual(handlers[Keys.FocalTweet](), "handled");
