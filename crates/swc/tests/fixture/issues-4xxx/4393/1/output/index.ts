var foo;
(function(foo) {
    var bar = foo.bar = 0;
})(foo || (foo = {}));
export { foo };
