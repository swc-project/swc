const test = require("node:test");
const assert = require("node:assert/strict");

const minifier = require("../index.js");

test("minifySync exposes extractedComments", () => {
    const result = minifier.minifySync(
        `/*!
 * @license MIT
 */
console.log("minifier");`,
        {
            compress: false,
            mangle: false,
            extractComments: true,
        }
    );

    assert.equal(result.code, 'console.log("minifier");');
    assert.deepEqual(result.extractedComments, ["/*!\n * @license MIT\n */"]);
});
