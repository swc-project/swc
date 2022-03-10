// https://github.com/umdjs/umd/blob/master/returnExports.js
if (exports) // For Node.js.
module.exports = null;
else {
    define, define.amd;
    // For AMD. Register as an anonymous module.
    define([], factory.bind(root, root));
}
