var foo;
(function(foo) {
    foo.bar = 0;
})(foo || (foo = {}));
export { foo };
