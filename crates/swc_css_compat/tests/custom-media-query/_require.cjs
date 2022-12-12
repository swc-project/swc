const assert = require('assert');
const plugin = require('postcss-custom-media');
plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
