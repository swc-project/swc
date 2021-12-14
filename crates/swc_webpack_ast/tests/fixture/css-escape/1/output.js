if (exports) module.exports = null;
else {
    define, define.amd;
    define([], factory.bind(root, root));
}
