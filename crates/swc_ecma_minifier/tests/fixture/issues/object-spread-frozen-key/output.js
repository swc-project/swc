const assert = require("assert");
let leaked = !1;
const Keys = Object.freeze({
    ...{
        __proto__: {
            get Leaked () {
                return leaked = !0, "bad";
            }
        }
    },
    FocalTweet: "focal_tweet"
}), handlers = {
    [Keys.FocalTweet]: ()=>"handled"
};
assert.strictEqual(Keys.Leaked, void 0), assert.strictEqual(leaked, !1), assert.strictEqual(handlers[Keys.FocalTweet](), "handled");
