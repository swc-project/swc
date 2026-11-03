
    export default () => useContext(X);
    export const Foo = () => useContext(X);
    module.exports = () => useContext(X);
    const Bar = () => useContext(X);
    const Baz = memo(() => useContext(X));
    const Qux = () => (0, useContext(X));
