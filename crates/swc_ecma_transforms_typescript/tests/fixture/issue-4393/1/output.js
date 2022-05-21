var foo;
(function(foo1) {
    var bar = foo1.bar = 0;
})(foo || (foo = {}));
export { foo };
