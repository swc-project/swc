var foo;
(function(foo) {
    const bar = foo.bar = 0;
})(foo || (foo = {}));
export { foo };
